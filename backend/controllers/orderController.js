// const Order = require("../models/Order");

// // @desc    Create new order
// // @route   POST /api/orders
// // @access  Private
// const createOrder = async (req, res) => {
//   res.status(201).json({ message: "Order Created (Placeholder)" });
// };

// // @desc    Get logged in user orders
// // @route   GET /api/orders/myorders
// // @access  Private
// const getMyOrders = async (req, res) => {
//   res.status(200).json([]);
// };

// // @desc    Get order by ID
// // @route   GET /api/orders/:id
// // @access  Private
// const getOrderById = async (req, res) => {
//   res.status(200).json({ message: "Order Details (Placeholder)" });
// };

// // @desc    Update order to paid
// // @route   PUT /api/orders/:id/pay
// // @access  Private
// const updateOrderToPaid = async (req, res) => {
//   res.status(200).json({ message: "Order Paid (Placeholder)" });
// };

// module.exports = {
//   createOrder,
//   getMyOrders,
//   getOrderById,
//   updateOrderToPaid,
// };

// const asyncHandler = require("express-async-handler");
// const Order = require("../models/Order");

// // @desc    Create new order
// // @route   POST /api/orders
// // @access  Private
// const addOrderItems = asyncHandler(async (req, res) => {
//   const {
//     orderItems,
//     shippingAddress,
//     paymentMethod,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//   } = req.body;

//   if (orderItems && orderItems.length === 0) {
//     res.status(400);
//     throw new Error("No order items");
//   } else {
//     const order = new Order({
//       orderItems,
//       user: req.user._id,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice,
//     });

//     const createdOrder = await order.save();
//     res.status(201).json(createdOrder);
//   }
// });

// // @desc    Get order by ID
// // @route   GET /api/orders/:id
// // @access  Private
// const getOrderById = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id).populate(
//     "user",
//     "name email",
//   );

//   if (order) {
//     res.json(order);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// });

// // @desc    Update order to paid
// // @route   PUT /api/orders/:id/pay
// // @access  Private
// const updateOrderToPaid = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     order.isPaid = true;
//     order.paidAt = Date.now();
//     // Payment result comes from payment gateway (Khalti/Stripe)
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

// // @desc    Get logged in user orders
// // @route   GET /api/orders/myorders
// // @access  Private
// const getMyOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find({ user: req.user._id });
//   res.json(orders);
// });

// // @desc    Get all orders (Admin)
// // @route   GET /api/orders
// // @access  Private/Admin
// const getOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find({}).populate("user", "id name");
//   res.json(orders);
// });

// module.exports = {
//   addOrderItems,
//   getOrderById,
//   updateOrderToPaid,
//   getMyOrders,
//   getOrders,
// };

// const asyncHandler = require("express-async-handler");
// const Order = require("../models/Order");

// // @desc    Create new order
// // @route   POST /api/orders
// // @access  Private
// const addOrderItems = asyncHandler(async (req, res) => {
//   const {
//     orderItems,
//     shippingAddress,
//     paymentMethod,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//   } = req.body;

//   if (orderItems && orderItems.length === 0) {
//     res.status(400);
//     throw new Error("No order items");
//   } else {
//     const order = new Order({
//       orderItems,
//       user: req.user._id,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice,
//     });

//     const createdOrder = await order.save();
//     res.status(201).json(createdOrder);
//   }
// });

// // @desc    Get order by ID
// // @route   GET /api/orders/:id
// // @access  Private
// const getOrderById = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id).populate(
//     "user",
//     "name email",
//   );

//   if (order) {
//     res.json(order);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// });

// // @desc    Update order to paid
// // @route   PUT /api/orders/:id/pay
// // @access  Private
// const updateOrderToPaid = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     order.isPaid = true;
//     order.paidAt = Date.now();
//     // Payment result comes from payment gateway (Khalti/Stripe)
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

// // @desc    Get logged in user orders
// // @route   GET /api/orders/myorders
// // @access  Private
// const getMyOrders = asyncHandler(async (req, res) => {
//   // ✅ FIX: Ensure req.user exists to prevent 500 crashes
//   if (!req.user) {
//     res.status(401);
//     throw new Error("User not found");
//   }

//   // Sort by newest first
//   const orders = await Order.find({ user: req.user._id }).sort({
//     createdAt: -1,
//   });
//   res.json(orders);
// });

// // @desc    Get all orders (Admin)
// // @route   GET /api/orders
// // @access  Private/Admin
// const getOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find({})
//     .populate("user", "id name")
//     .sort({ createdAt: -1 }); // Added sort for Admin too
//   res.json(orders);
// });

// // @desc    Delete order
// // @route   DELETE /api/orders/:id
// // @access  Private
// const deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (order) {
//       await order.deleteOne();
//       res.json({ message: "Order removed" });
//     } else {
//       res.status(404).json({ message: "Order not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
// module.exports = {
//   addOrderItems,
//   getOrderById,
//   updateOrderToPaid,
//   getMyOrders,
//   getOrders,
//   deleteOrder,
// };

// const asyncHandler = require("express-async-handler");
// const Order = require("../models/Order");

// // @desc    Create new order
// // @route   POST /api/orders
// // @access  Private
// const addOrderItems = asyncHandler(async (req, res) => {
//   const {
//     orderItems,
//     shippingAddress,
//     paymentMethod,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//   } = req.body;

//   if (orderItems && orderItems.length === 0) {
//     res.status(400);
//     throw new Error("No order items");
//   } else {
//     const order = new Order({
//       orderItems,
//       user: req.user._id,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice,
//     });

//     const createdOrder = await order.save();
//     res.status(201).json(createdOrder);
//   }
// });

// // @desc    Get order by ID
// // @route   GET /api/orders/:id
// // @access  Private
// const getOrderById = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id).populate(
//     "user",
//     "name email",
//   );

//   if (order) {
//     res.json(order);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// });

// // @desc    Update order to paid
// // @route   PUT /api/orders/:id/pay
// // @access  Private
// const updateOrderToPaid = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     order.isPaid = true;
//     order.paidAt = Date.now();
//     // Payment result comes from payment gateway (Khalti/Stripe)
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

// // @desc    Manually mark order as paid (For COD or Corrections)
// // @route   PUT /api/orders/:id/pay-manual
// // @access  Private/Admin/Pharmacist
// const updateOrderToPaidManual = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     order.isPaid = true;
//     order.paidAt = Date.now();
//     // Record that this was a manual update by the staff
//     order.paymentResult = {
//       id: "MANUAL_ENTRY",
//       status: "COMPLETED",
//       update_time: new Date().toISOString(),
//       email_address: req.user.email, // Tracks WHICH pharmacist confirmed it
//     };

//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// });

// // @desc    Get logged in user orders
// // @route   GET /api/orders/myorders
// // @access  Private
// const getMyOrders = asyncHandler(async (req, res) => {
//   // ✅ Safety Check: Ensure req.user exists
//   if (!req.user) {
//     res.status(401);
//     throw new Error("User not found");
//   }

//   // Sort by newest first
//   const orders = await Order.find({ user: req.user._id }).sort({
//     createdAt: -1,
//   });
//   res.json(orders);
// });

// // @desc    Get all orders (Admin)
// // @route   GET /api/orders
// // @access  Private/Admin
// const getOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find({})
//     .populate("user", "id name")
//     .sort({ createdAt: -1 });
//   res.json(orders);
// });

// // @desc    Update order status
// // @route   PUT /api/orders/:id/status
// // @access  Private/Admin/Pharmacist
// const updateOrderStatus = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     const { status } = req.body;

//     // 1. Update the generic status field (Make sure your Order Model has this field)
//     order.orderStatus = status;

//     // 2. Handle specific side-effects for each status
//     switch (status) {
//       case "Delivered":
//         order.isDelivered = true;
//         order.deliveredAt = Date.now();
//         break;

//       case "Shipped":
//         order.isShipped = true; // Optional: If your schema has isShipped
//         order.shippedAt = Date.now();
//         break;

//       case "Cancelled":
//         order.isCancelled = true; // Optional: If your schema has isCancelled
//         break;

//       case "Processing":
//         // Reset flags if moved back to processing (optional safety)
//         order.isDelivered = false;
//         break;

//       default:
//         break;
//     }

//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// });

// // @desc    Delete order
// // @route   DELETE /api/orders/:id
// // @access  Private
// const deleteOrder = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     await order.deleteOne();
//     res.json({ message: "Order removed" });
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// });

// module.exports = {
//   addOrderItems,
//   getOrderById,
//   updateOrderToPaid,
//   getMyOrders,
//   getOrders,
//   deleteOrder,
//   updateOrderStatus,
//   updateOrderToPaidManual, // ✅ Ensure this is exported
//   updateOrderToPaidManual,
// };

const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
require("dotenv").config();
const nodemailer = require("nodemailer"); // ✅ Added Nodemailer

// ===================================================================
// 📧 EMAIL CONFIGURATION & HELPER
// ===================================================================
// Configure your email service (Ensure env variables are set)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Helper function to send emails
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
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
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

// @desc    Update order to paid (Automatic via Gateway)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // Payment result comes from payment gateway (Khalti/Stripe)
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Manually mark order as paid (For COD or Corrections)
// @route   PUT /api/orders/:id/pay-manual
// @access  Private/Admin/Pharmacist
const updateOrderToPaidManual = asyncHandler(async (req, res) => {
  // ✅ Populate user to send email
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // Record that this was a manual update by the staff
    order.paymentResult = {
      id: "MANUAL_ENTRY",
      status: "COMPLETED",
      update_time: new Date().toISOString(),
      email_address: req.user.email, // Tracks WHICH pharmacist confirmed it
    };

    const updatedOrder = await order.save();

    // ✅ Send Payment Confirmation Email
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
  // ✅ Safety Check: Ensure req.user exists
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Sort by newest first
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
    .populate("user", "id name email") // Added email for admin view if needed
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status & Send Email Notification
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Pharmacist
const updateOrderStatus = asyncHandler(async (req, res) => {
  // ✅ Populate user to get email address
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (order) {
    const { status } = req.body;

    // 1. Update the generic status field
    order.orderStatus = status;

    let emailSubject = "";
    let emailBody = "";

    // 2. Handle specific side-effects and Email Content
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
        emailSubject = `❌ Order Cancelled: #${order._id.toString().slice(-6)}`;
        emailBody = `
          <h3>Order Cancelled</h3>
          <p>Your order has been cancelled as per your request or due to unavailability.</p>
        `;
        break;

      case "Processing":
        order.isDelivered = false; // Reset if moved back
        break;

      case "Ready": // Optional: Ready for Pickup
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

    // ✅ Send Email if we have a subject and a user email
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
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.deleteOne();
    res.json({ message: "Order removed" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  deleteOrder,
  updateOrderStatus,
  updateOrderToPaidManual,
};
