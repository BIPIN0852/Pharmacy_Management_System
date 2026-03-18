const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Medicine = require("../models/Medicine"); // ✅ Required Medicine Model
require("dotenv").config();
const nodemailer = require("nodemailer");

// ===================================================================
// 📧 EMAIL CONFIGURATION & HELPER
// ===================================================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendOrderEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"PharmaStore Updates" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`📧 Order Update Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
  }
};

// ===================================================================
// CONTROLLERS
// ===================================================================

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    prescriptionImage,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    // Determine Prescription Status Logic
    const needsPrescription = !!prescriptionImage;
    const initialRxStatus = needsPrescription
      ? "Pending Verification"
      : "Not Required";

    const initialOrderStatus = needsPrescription
      ? "On Hold (Rx Review)"
      : "Processing";

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      prescriptionImage: needsPrescription ? prescriptionImage : null,
      prescriptionStatus: initialRxStatus,
      orderStatus: initialOrderStatus,
    });

    const createdOrder = await order.save();

    // ✅ NEW: INVENTORY DEDUCTION LOGIC
    // Loop through the items and subtract the purchased quantity from the stock
    for (const item of orderItems) {
      // Find medicine by ID (supporting both .product and .medicine conventions)
      const medicineId = item.product || item.medicine;
      const medicine = await Medicine.findById(medicineId);

      if (medicine) {
        medicine.countInStock = medicine.countInStock - item.qty;

        // Prevent negative stock
        if (medicine.countInStock < 0) {
          medicine.countInStock = 0;
        }

        await medicine.save();
      }
    }

    res.status(201).json(createdOrder);
  }
});

// @desc    Update Prescription Status (Approve/Reject)
// @route   PUT /api/orders/:id/prescription
// @access  Private/Admin/Pharmacist
const updatePrescriptionStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.prescriptionStatus = status;

  let emailSubject = "";
  let emailBody = "";

  if (status === "Approved") {
    order.orderStatus = "Processing";

    emailSubject = `✅ Prescription Approved: Order #${order.orderNumber || order._id.toString().slice(-6)}`;
    emailBody = `
      <h3>Good news, ${order.user.name}!</h3>
      <p>Our pharmacist has reviewed and approved your prescription.</p>
      <p>Your order is now being processed and prepared for shipping.</p>
    `;
  } else if (status === "Rejected") {
    order.orderStatus = "Cancelled";
    order.isCancelled = true;
    order.cancelledAt = Date.now();

    // ✅ OPTIONAL LOGIC: If an order is rejected/cancelled, return the stock to inventory
    for (const item of order.orderItems) {
      const medicineId = item.product || item.medicine;
      const medicine = await Medicine.findById(medicineId);
      if (medicine) {
        medicine.countInStock = medicine.countInStock + item.qty;
        await medicine.save();
      }
    }

    emailSubject = `❌ Prescription Rejected: Order #${order.orderNumber || order._id.toString().slice(-6)}`;
    emailBody = `
      <h3>Prescription Review Update</h3>
      <p>Dear ${order.user.name},</p>
      <p>Unfortunately, our pharmacist could not verify the prescription you uploaded. 
      This might be because the image was unclear, expired, or invalid for the requested medicines.</p>
      <p>As a result, your order has been cancelled. Please place a new order with a valid prescription.</p>
    `;
  }

  const updatedOrder = await order.save();

  if (emailSubject && order.user && order.user.email) {
    await sendOrderEmail(order.user.email, emailSubject, emailBody);
  }

  res.json(updatedOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// // @desc    Update order to paid (Automatic via Gateway)
// // @route   PUT /api/orders/:id/pay
// // @access  Private
// const updateOrderToPaid = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     order.isPaid = true;
//     order.paidAt = Date.now();
//     order.paymentResult = {
//       id: req.body.id,
//       status: req.body.status,
//       update_time: req.body.update_time,
//       email_address: req.body.email_address,
//     };

//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// });

// @desc    Update order to paid (Triggered by Customer after payment success)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // ✅ 1. FORCE THE DATABASE TO MARK IT AS PAID
      order.isPaid = true;
      order.paidAt = Date.now();

      // ✅ 2. SAVE THE TRANSACTION DETAILS (Works for Khalti & Stripe)
      order.paymentResult = {
        id: req.body.id || req.body.pidx || "transaction_id_missing",
        status: req.body.status || "COMPLETED",
        update_time: req.body.update_time || new Date().toISOString(),
        email_address: req.body.email_address || req.user?.email || "customer",
      };

      // ✅ 3. SAVE TO DATABASE
      const updatedOrder = await order.save();

      // ✅ 4. RETURN UPDATED ORDER TO FRONTEND
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Payment Update Error:", error);
    res
      .status(500)
      .json({ message: "Server error while updating payment status" });
  }
};

// @desc    Manually mark order as paid (For COD or Corrections)
// @route   PUT /api/orders/:id/pay-manual
// @access  Private/Admin/Pharmacist
const updateOrderToPaidManual = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: "MANUAL_ENTRY",
      status: "COMPLETED",
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };

    const updatedOrder = await order.save();

    if (order.user && order.user.email) {
      await sendOrderEmail(
        order.user.email,
        `💰 Payment Received: Order #${order._id.toString().slice(-6)}`,
        `<h3>Payment Confirmed</h3>
         <p>We have received your payment of <strong>Rs. ${order.totalPrice}</strong>.</p>
         <p>Thank you for shopping with us!</p>`,
      );
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "id name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status & Send Email Notification
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Pharmacist
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (order) {
    const { status } = req.body;

    order.orderStatus = status;

    let emailSubject = "";
    let emailBody = "";

    switch (status) {
      case "Delivered":
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        emailSubject = `✅ Delivered: Order #${order._id.toString().slice(-6)}`;
        emailBody = `
          <h3>Package Delivered</h3>
          <p>Your order has been successfully delivered. Thank you for shopping with PharmaStore!</p>
        `;
        break;

      case "Shipped":
        order.isShipped = true;
        order.shippedAt = Date.now();
        emailSubject = `🚚 Your Order #${order._id
          .toString()
          .slice(-6)} has Shipped!`;
        emailBody = `
          <h3>Great news, ${order.user.name}!</h3>
          <p>Your order is on its way. Our delivery partner has picked up your package.</p>
          <p><strong>Order ID:</strong> #${order._id}</p>
        `;
        break;

      case "Cancelled":
        order.isCancelled = true;

        // ✅ OPTIONAL LOGIC: Return stock if order is manually cancelled by admin
        for (const item of order.orderItems) {
          const medicineId = item.product || item.medicine;
          const medicine = await Medicine.findById(medicineId);
          if (medicine) {
            medicine.countInStock = medicine.countInStock + item.qty;
            await medicine.save();
          }
        }

        emailSubject = `❌ Order Cancelled: #${order._id.toString().slice(-6)}`;
        emailBody = `
          <h3>Order Cancelled</h3>
          <p>Your order has been cancelled as per your request or due to unavailability.</p>
        `;
        break;

      case "Processing":
        order.isDelivered = false;
        break;

      case "Ready":
        emailSubject = `📦 Order Ready: #${order._id.toString().slice(-6)}`;
        emailBody = `
           <h3>Your Order is Ready!</h3>
           <p>Your order is packed and ready for delivery/pickup.</p>
        `;
        break;

      default:
        break;
    }

    const updatedOrder = await order.save();

    if (emailSubject && order.user && order.user.email) {
      await sendOrderEmail(order.user.email, emailSubject, emailBody);
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
// Example Backend Code (Node.js / Express)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ REAL WORLD LOGIC: Restore the stock before deleting
    for (const item of order.orderItems) {
      const medicine = await Medicine.findById(item.medicine || item.product);
      if (medicine) {
        medicine.countInStock += item.qty; // Add the cancelled quantity back to inventory
        await medicine.save();
      }
    }

    // Now delete the order (or change its status to 'Cancelled')
    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order cancelled and stock successfully restored." });
  } catch (error) {
    res.status(500).json({ message: "Server error during cancellation." });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  deleteOrder,
  updateOrderStatus,
  updateOrderToPaidManual,
  updatePrescriptionStatus,
};
