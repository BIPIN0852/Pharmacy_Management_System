// const express = require("express");
// const router = express.Router();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const authenticateToken = require("../middleware/auth");

// // POST /api/payments/create-stripe-session
// router.post("/create-stripe-session", authenticateToken, async (req, res) => {
//   const { amount, orderId, medicineName, customerEmail } = req.body;

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: { name: medicineName },
//             unit_amount: Math.round(amount * 100), // amount in cents
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
//       cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
//       customer_email: customerEmail,
//       metadata: { orderId },
//     });

//     res.json({ sessionId: session.id });
//   } catch (error) {
//     console.error("Stripe session error:", error);
//     res.status(500).json({ message: "Stripe session error." });
//   }
// });

// module.exports = router;

// const express = require("express");
// const fetch = require("node-fetch"); // install with: npm install node-fetch
// const router = express.Router();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const authenticateToken = require("../middleware/auth");

// // Stripe: Create Checkout Session
// router.post("/create-stripe-session", authenticateToken, async (req, res) => {
//   const { amount, orderId, medicineName, customerEmail } = req.body;
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: { name: medicineName },
//             unit_amount: Math.round(amount * 100), // cents
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
//       cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
//       customer_email: customerEmail,
//       metadata: { orderId },
//     });
//     res.json({ sessionId: session.id });
//   } catch (error) {
//     console.error("Stripe session error:", error);
//     res.status(500).json({ message: "Stripe session error." });
//   }
// });

// // Khalti: Initiate e-payment (redirection)
// router.post("/khalti-initiate", authenticateToken, async (req, res) => {
//   try {
//     const {
//       amount,
//       purchase_order_id,
//       purchase_order_name,
//       return_url,
//       website_url,
//       customer_info,
//     } = req.body;

//     const response = await fetch(
//       "https://khalti.com/api/v2/epayment/initiate/",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           return_url,
//           website_url,
//           amount,
//           purchase_order_id,
//           purchase_order_name,
//           customer_info,
//         }),
//       }
//     );
//     const data = await response.json();
//     res.json(data); // data.payment_url is the main one to redirect to
//   } catch (error) {
//     console.error("Khalti initiate error:", error);
//     res.status(500).json({ message: "Khalti initiate error." });
//   }
// });

// // Khalti: Verify Khalti widget payment (for SDK popup)
// router.post("/khalti-verify", async (req, res) => {
//   const { token, amount } = req.body;
//   try {
//     const response = await fetch("https://khalti.com/api/v2/payment/verify/", {
//       method: "POST",
//       headers: {
//         Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ token, amount }),
//     });

//     const data = await response.json();
//     if (data.idx) {
//       // Mark order as paid in your DB if you wish
//       res.json({ success: true, ...data });
//     } else {
//       res.json({ success: false, error: data });
//     }
//   } catch (e) {
//     console.error("Khalti verification error:", e);
//     res.json({ success: false, error: e.toString() });
//   }
// });

// module.exports = router;
////////////////////////////////////////////////////////////////////////////
// const express = require("express");
// const fetch = require("node-fetch"); // npm install node-fetch
// const router = express.Router();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const authenticateToken = require("../middleware/auth");

// // STRIPE: Create Checkout Session
// router.post("/create-stripe-session", authenticateToken, async (req, res) => {
//   const { amount, orderId, medicineName, customerEmail } = req.body;
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: { name: medicineName || "Pharmacy Purchase" },
//             unit_amount: Math.round(amount * 100),
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
//       cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
//       customer_email: customerEmail,
//       metadata: { orderId },
//     });
//     res.json({ sessionId: session.id });
//   } catch (error) {
//     console.error("Stripe session error:", error);
//     res.status(500).json({ message: "Stripe session error." });
//   }
// });

// // KHALTI: Widget-based verification (for popup integration)
// router.post("/khalti-verify", async (req, res) => {
//   const { token, amount } = req.body;
//   try {
//     const response = await fetch("https://khalti.com/api/v2/payment/verify/", {
//       method: "POST",
//       headers: {
//         Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ token, amount }),
//     });
//     const data = await response.json();
//     if (data.idx) {
//       // Here you can now mark an order as paid in your DB if desired
//       res.json({ success: true, ...data });
//     } else {
//       res.json({ success: false, error: data });
//     }
//   } catch (e) {
//     console.error("Khalti verification error:", e);
//     res.json({ success: false, error: e.toString() });
//   }
// });

// // OPTIONAL: KHALTI E-Payment Redirection Initiation
// router.post("/khalti-initiate", authenticateToken, async (req, res) => {
//   try {
//     const {
//       amount,
//       purchase_order_id,
//       purchase_order_name,
//       return_url,
//       website_url,
//       customer_info,
//     } = req.body;

//     const response = await fetch(
//       "https://khalti.com/api/v2/epayment/initiate/",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           return_url,
//           website_url,
//           amount,
//           purchase_order_id,
//           purchase_order_name,
//           customer_info,
//         }),
//       }
//     );
//     const data = await response.json();
//     res.json(data); // includes payment_url to redirect
//   } catch (error) {
//     console.error("Khalti initiate error:", error);
//     res.status(500).json({ message: "Khalti initiate error." });
//   }
// });

// module.exports = router;
//////////////////////////////////////////////////////////////////////////

// const express = require("express");
// const router = express.Router();
// const {
//   verifyKhalti,
//   createStripeSession,
// } = require("../controllers/paymentController");
// const { protect } = require("../middleware/authMiddleware");

// // @desc    Verify Khalti Payment
// // @route   POST /api/payments/khalti-verify
// router.post("/khalti-verify", protect, verifyKhalti);

// // @desc    Create Stripe Checkout Session
// // @route   POST /api/payments/create-stripe-session
// router.post("/create-stripe-session", protect, createStripeSession);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   verifyKhalti,
//   createStripeSession,
//   setCodMethod
// } = require("../controllers/paymentController");
// const { protect } = require("../middleware/authMiddleware");

// // @desc    Verify Khalti Payment
// // @route   POST /api/payments/khalti-verify
// router.post("/khalti-verify", protect, verifyKhalti);

// // @desc    Create Stripe Checkout Session
// // @route   POST /api/payments/create-stripe-session
// router.post("/create-stripe-session", protect, createStripeSession);

// // @desc    Set Payment Method to COD (for existing orders)
// // @route   POST /api/payments/set-cod
// router.post("/set-cod", protect, setCodMethod);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   verifyKhalti,
//   createStripeSession,
//   setCodMethod,
// } = require("../controllers/paymentController");

// // ✅ FIX: Import the middleware from 'auth.js', matching your project structure
// const authenticateToken = require("../middleware/auth");

// // @desc    Verify Khalti Payment
// // @route   POST /api/payments/khalti-verify
// router.post("/khalti-verify", authenticateToken, verifyKhalti);

// // @desc    Create Stripe Checkout Session
// // @route   POST /api/payments/create-stripe-session
// router.post("/create-stripe-session", authenticateToken, createStripeSession);

// // @desc    Set Payment Method to COD
// // @route   POST /api/payments/set-cod
// // ✅ This was likely the line causing the error if setCodMethod was undefined
// router.post("/set-cod", authenticateToken, setCodMethod);

// module.exports = router;

// const express = require("express");
// const fetch = require("node-fetch");
// const router = express.Router();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const authenticateToken = require("../middleware/auth");

// // COD confirmation
// router.post("/cod-confirm", authenticateToken, async (req, res) => {
//   const { orderId } = req.body;
//   try {
//     console.log(`COD confirmed for order: ${orderId}`);
//     res.json({
//       success: true,
//       message: "COD order confirmed successfully",
//       orderId,
//     });
//   } catch (error) {
//     console.error("COD confirm error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "COD confirmation failed" });
//   }
// });

// // Stripe session
// router.post("/create-stripe-session", authenticateToken, async (req, res) => {
//   const { amount, orderId, medicineName, customerEmail } = req.body;
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "npr",
//             product_data: {
//               name: medicineName || "Pharmacy Purchase",
//               description: `Order #${orderId}`,
//             },
//             unit_amount: Math.round(amount * 100),
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${
//         process.env.CLIENT_URL || "http://localhost:3000"
//       }/placeorder?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
//       cancel_url: `${
//         process.env.CLIENT_URL || "http://localhost:3000"
//       }/payment?cancelled=true&order_id=${orderId}`,
//       customer_email: customerEmail,
//       metadata: { orderId, customerEmail },
//       automatic_tax: { enabled: true },
//     });
//     res.json({ sessionId: session.id, url: session.url });
//   } catch (error) {
//     console.error("Stripe session error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Stripe session creation failed" });
//   }
// });

// // Khalti verification
// router.post("/khalti-verify", authenticateToken, async (req, res) => {
//   const { token, amount, orderId } = req.body;
//   try {
//     const response = await fetch(
//       "https://a.khalti.com/api/v2/payment/verify/",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ token, amount }),
//       }
//     );

//     const data = await response.json();

//     if (response.ok && data.state?.value === "Complete") {
//       res.json({
//         success: true,
//         transactionId: data.transaction_id,
//         orderId,
//         amount: data.amount,
//         message: "Payment verified successfully",
//       });
//     } else {
//       res
//         .status(400)
//         .json({
//           success: false,
//           message: data.detail || "Payment verification failed",
//         });
//     }
//   } catch (error) {
//     console.error("Khalti verification error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Khalti verification failed" });
//   }
// });

// // Khalti e-payment initiate
// router.post("/khalti-initiate", authenticateToken, async (req, res) => {
//   try {
//     const {
//       amount,
//       purchase_order_id,
//       purchase_order_name,
//       return_url,
//       website_url,
//       customer_info,
//     } = req.body;
//     const response = await fetch(
//       "https://a.khalti.com/api/v2/epayment/initiate/",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           return_url:
//             return_url ||
//             `${process.env.CLIENT_URL || "http://localhost:3000"}/placeorder`,
//           website_url:
//             website_url || process.env.CLIENT_URL || "http://localhost:3000",
//           amount: Math.round(amount * 100),
//           purchase_order_id,
//           purchase_order_name: purchase_order_name || "Pharmacy Order",
//           customer_info: customer_info || {},
//         }),
//       }
//     );

//     const data = await response.json();
//     if (response.ok) {
//       res.json({
//         success: true,
//         payment_url: data.payment_url,
//         pidx: data.pidx,
//       });
//     } else {
//       res
//         .status(400)
//         .json({
//           success: false,
//           message: data.detail || "Khalti initiation failed",
//         });
//     }
//   } catch (error) {
//     console.error("Khalti initiate error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Khalti initiation failed" });
//   }
// });

// router.get("/order/:orderId/status", authenticateToken, async (req, res) => {
//   try {
//     res.json({
//       success: true,
//       orderId: req.params.orderId,
//       paymentStatus: "pending",
//       paymentMethod: "Khalti",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Status check failed" });
//   }
// });

// module.exports = router;

const express = require("express");
const axios = require("axios");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // ✅ Initialize Stripe

// Models
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");

// Middleware
const { protect } = require("../middleware/authMiddleware");

// -------------------------------------------------------------------
// 1. STRIPE: Create Payment Intent
// @desc    Step 1: Create intent so frontend can show card element
// @route   POST /api/payments/create-stripe-intent
// -------------------------------------------------------------------
router.post("/create-stripe-intent", protect, async (req, res) => {
  const { orderId } = req.body;

  try {
    // 1. Fetch Order to calculate accurate amount (Security)
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 2. Convert to cents (Stripe expects lowest currency unit)
    // Example: $10.00 -> 1000 cents
    const amountInCents = Math.round(order.totalPrice * 100);

    // 3. Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd", // Change to 'npr' if your Stripe account supports it, otherwise convert
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    // 4. Send Client Secret to Frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Intent Error:", error);
    res.status(500).json({ message: "Failed to create payment intent" });
  }
});

// -------------------------------------------------------------------
// 2. STRIPE: Verify Payment (Webhook or Manual Confirmation)
// @desc    Step 2: Confirm success after frontend finishes payment
// @route   POST /api/payments/verify-stripe
// -------------------------------------------------------------------
router.post("/verify-stripe", protect, async (req, res) => {
  const { paymentIntentId, orderId } = req.body;

  try {
    // 1. Retrieve Intent from Stripe to confirm status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });

      if (order.isPaid) return res.json({ message: "Order already paid" });

      // 2. Update Order
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentMethod = "Stripe";
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        email: req.user.email,
      };

      await order.save();

      // 3. Create Transaction Record
      await Transaction.create({
        user: req.user._id,
        order: order._id,
        amount: paymentIntent.amount / 100, // Convert back to main unit
        type: "Payment",
        paymentMethod: "Stripe",
        status: "Success",
        referenceId: paymentIntent.id,
        description: `Stripe Payment for Order #${order._id}`,
      });

      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.status(400).json({ message: "Payment not successful" });
    }
  } catch (error) {
    console.error("Stripe Verification Error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});

// -------------------------------------------------------------------
// 3. KHALTI: Verify Payment
// @route   POST /api/payments/verify-khalti
// -------------------------------------------------------------------
router.post("/verify-khalti", protect, async (req, res) => {
  const { token, amount, orderId } = req.body;

  try {
    const khaltiResponse = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      { token, amount },
      {
        headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}` },
      }
    );

    if (khaltiResponse.data) {
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentMethod = "Khalti";
      order.paymentResult = {
        id: khaltiResponse.data.idx,
        status: "success",
        email: req.user.email,
      };

      await order.save();

      await Transaction.create({
        user: req.user._id,
        order: order._id,
        amount: amount / 100,
        type: "Payment",
        paymentMethod: "Khalti",
        status: "Success",
        referenceId: khaltiResponse.data.idx,
        description: `Khalti Payment for Order #${order._id}`,
      });

      res.json({ message: "Payment Verified", order });
    }
  } catch (error) {
    console.error("Khalti Error:", error.response?.data || error.message);
    res.status(400).json({ message: "Khalti verification failed" });
  }
});

// -------------------------------------------------------------------
// 4. CASH ON DELIVERY (COD)
// @route   POST /api/payments/cod
// -------------------------------------------------------------------
router.post("/cod", protect, async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentMethod = "COD";
    order.isPaid = false;
    await order.save();

    res.json({ message: "Order confirmed for COD", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
