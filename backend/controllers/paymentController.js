const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const axios = require("axios");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");

// ----------------------
// Email Transport Setup
// ----------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: Send Order Email
async function sendOrderEmail(to, subject, htmlContent) {
  try {
    await transporter.sendMail({
      from: `"Smart Pharmacy" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`📧 Order email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
  }
}

// Helper: Generate Basic HTML
const getEmailHtml = (name, message) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
    <h2 style="color: #2c3e50;">Hello ${name},</h2>
    <p style="font-size: 16px;">${message}</p>
    <hr>
    <p style="font-size: 14px; color: #7f8c8d;">Thank you for shopping with Smart Pharmacy!</p>
  </div>
`;

// ===================================================================
// 1. STRIPE: Create Payment Intent
// ===================================================================
const createStripeIntent = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ⚠️ CURRENCY CONVERSION (NPR -> USD)
    const EXCHANGE_RATE = 133;
    const priceInUsd = order.totalPrice / EXCHANGE_RATE;
    const amountInCents = Math.round(priceInUsd * 100);

    if (amountInCents < 50) {
      return res
        .status(400)
        .json({ message: "Amount too low for card payment." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Intent Error:", error);
    res.status(500).json({ message: "Failed to create payment intent" });
  }
};

// ===================================================================
// 2. STRIPE: Verify Payment
// ===================================================================
const verifyStripePayment = async (req, res) => {
  const { paymentIntentId, orderId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const order = await Order.findById(orderId).populate(
        "user",
        "name email",
      );
      if (!order) return res.status(404).json({ message: "Order not found" });

      if (order.isPaid) return res.json({ message: "Order already paid" });

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentMethod = "Stripe";
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        // Failsafe: Use order.user.email if req.user is lost in the transaction redirect
        email: req.user?.email || order.user.email,
        amount_paid_usd: paymentIntent.amount / 100,
      };

      await order.save(); // Save the order before creating the transaction to ensure order._id is available

      await Transaction.create({
        user: req.user?._id || order.user._id,
        order: order._id,
        amount: order.totalPrice,
        currency: "NPR",
        paymentMethod: "Stripe",
        status: "Success",
        referenceId: paymentIntent.id,
      });

      // Send Email
      const emailHtml = getEmailHtml(
        order.user.name,
        `✅ <strong>Payment Successful!</strong><br>We received <strong>NPR ${order.totalPrice}</strong> via Stripe.`,
      );
      await sendOrderEmail(order.user.email, "Payment Receipt", emailHtml);

      res.json({ success: true, message: "Payment Successful", order });
    } else {
      res.status(400).json({ message: "Payment not successful" });
    }
  } catch (error) {
    console.error("Stripe Verify Error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

// ===================================================================
// 3. KHALTI: Initiate (Step 1)
// @desc   Gets the Payment URL for the frontend to redirect
// ===================================================================
const initiateKhaltiPayment = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findById(orderId).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Use FRONTEND_URL environment variable, defaulting to localhost for local dev
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const payload = {
      return_url: `${frontendUrl}/payment-success?id=${order._id}`,
      website_url: frontendUrl,
      amount: Math.round(order.totalPrice * 100),
      purchase_order_id: order._id.toString(),
      purchase_order_name: `Order #${order._id}`,
      customer_info: {
        name: order.user.name,
        email: order.user.email,
        phone: "9800000000",
      },
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    res.json({
      pidx: response.data.pidx,
      payment_url: response.data.payment_url,
    });
  } catch (error) {
    console.error("Khalti Init Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Khalti initiation failed" });
  }
};

// ===================================================================
// 4. KHALTI: Verify (Step 2 - Lookup)
// @desc   Verifies payment after user returns from Khalti
// ===================================================================
const verifyKhalti = async (req, res) => {
  // We explicitly accept orderId from frontend as a fallback
  const { pidx, orderId } = req.body;

  try {
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.status === "Completed") {
      // Failsafe: Use frontend provided orderId if Khalti drops purchase_order_id
      const actualOrderId = response.data.purchase_order_id || orderId;

      const order = await Order.findById(actualOrderId).populate(
        "user",
        "name email",
      );
      if (!order) return res.status(404).json({ message: "Order not found" });

      if (order.isPaid)
        return res.json({ success: true, message: "Already Paid", order });

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentMethod = "Khalti";
      order.paymentResult = {
        id: pidx,
        status: "success",
        // Failsafe: prevent crash if req.user is undefined during redirect
        email: req.user?.email || order.user.email,
      };

      await order.save(); // Will no longer crash!

      await Transaction.create({
        user: req.user?._id || order.user._id, // Failsafe
        order: order._id,
        amount: order.totalPrice,
        currency: "NPR",
        paymentMethod: "Khalti",
        status: "Success",
        referenceId: response.data.transaction_id || pidx,
      });

      const emailHtml = getEmailHtml(
        order.user.name,
        `✅ <strong>Payment Successful!</strong><br>We received <strong>NPR ${order.totalPrice}</strong> via Khalti.`,
      );
      await sendOrderEmail(order.user.email, "Payment Receipt", emailHtml);

      res.json({ success: true, message: "Payment Verified", order });
    } else {
      res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Khalti Verify Error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

// ===================================================================
// 5. CASH ON DELIVERY (COD)
// ===================================================================
const setCodMethod = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentMethod = "COD";
    order.isPaid = false;
    order.paymentResult = { status: "pending_cod" };

    await order.save();

    const emailHtml = getEmailHtml(
      order.user.name,
      `📦 <strong>Order Confirmed!</strong><br><br>
       Your order <strong>#${order._id
         .toString()
         .slice(-6)
         .toUpperCase()}</strong> has been placed using <strong>Cash on Delivery</strong>.<br>
       <h3 style="color: #d35400;">Total to Pay: NPR ${order.totalPrice}</h3>
       Please keep the exact amount ready upon delivery.`,
    );

    await sendOrderEmail(
      order.user.email,
      "Order Confirmation - Smart Pharmacy",
      emailHtml,
    );

    res.json({
      success: true,
      message: "Order confirmed for COD",
      order: order,
      amount: order.totalPrice,
    });
  } catch (error) {
    console.error("COD Error:", error);
    res.status(500).json({ message: "Server error during COD processing" });
  }
};

module.exports = {
  createStripeIntent,
  verifyStripePayment,
  initiateKhaltiPayment,
  verifyKhalti,
  setCodMethod,
};
