// import Stripe from "stripe";
// import axios from "axios";
// import Order from "../models/orderModel.js";
// import asyncHandler from "express-async-handler";

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Add to .env

// // @desc    Create Stripe payment session
// // @route   POST /api/payments/create-stripe-session
// const createStripeSession = asyncHandler(async (req, res) => {
//   const { amount, orderId, medicineName, customerEmail } = req.body;

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: [
//       {
//         price_data: {
//           currency: "npr",
//           product_data: {
//             name: medicineName || "Pharmacy Order",
//             description: `Order #${orderId}`,
//           },
//           unit_amount: Math.round(amount), // amount in paisa, should be integer
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: `${req.headers.origin}/placeorder?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
//     cancel_url: `${req.headers.origin}/payment?cancelled=true&order_id=${orderId}`,
//     customer_email: customerEmail,
//     metadata: {
//       orderId,
//       customerEmail,
//     },
//     automatic_tax: { enabled: true }, // Enable automatic tax calculation (optional)
//   });

//   res.json({ sessionId: session.id, url: session.url });
// });

// // @desc    Verify Khalti payment
// // @route   POST /api/payments/khalti-verify
// const verifyKhaltiPayment = asyncHandler(async (req, res) => {
//   const { token, amount, orderId } = req.body;

//   try {
//     const verifyResponse = await axios.post(
//       "https://a.khalti.com/api/v2/payment/verify/",
//       {
//         token,
//         amount,
//       },
//       {
//         headers: {
//           Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (verifyResponse.data.state.value === "Complete") {
//       // Update order status in DB
//       await Order.findByIdAndUpdate(orderId, {
//         paymentMethod: "Khalti",
//         paymentResult: {
//           id: verifyResponse.data.transaction_id,
//           status: "succeeded",
//           update_time: Date.now(),
//           email_address: verifyResponse.data.user.email,
//         },
//         isPaid: true,
//         paidAt: Date.now(),
//       });

//       res.json({
//         success: true,
//         transactionId: verifyResponse.data.transaction_id,
//       });
//     } else {
//       res
//         .status(400)
//         .json({ success: false, message: "Payment verification failed" });
//     }
//   } catch (error) {
//     res
//       .status(400)
//       .json({
//         success: false,
//         message: error.response?.data?.detail || "Verification failed",
//       });
//   }
// });

// // @desc    Confirm COD order
// // @route   POST /api/payments/cod-confirm
// const confirmCODOrder = asyncHandler(async (req, res) => {
//   const { orderId } = req.body;

//   await Order.findByIdAndUpdate(orderId, {
//     paymentMethod: "COD",
//     isPaid: false, // COD not paid upfront
//     paymentResult: {
//       id: `COD-${Date.now()}`,
//       status: "pending",
//       update_time: Date.now(),
//     },
//   });

//   res.json({ success: true, message: "COD order confirmed" });
// });

// export { createStripeSession, verifyKhaltiPayment, confirmCODOrder };

// const Order = require("../models/Order");
// const axios = require("axios");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Ensure STRIPE_SECRET_KEY is in .env

// // @desc    Verify Khalti Payment
// // @route   POST /api/payments/khalti-verify
// // @access  Private
// const verifyKhalti = async (req, res) => {
//   const { token, amount, orderId } = req.body;

//   try {
//     // 1. Verify with Khalti API
//     const khaltiConfig = {
//       headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}` },
//     };

//     const khaltiRes = await axios.post(
//       "https://khalti.com/api/v2/payment/verify/",
//       { token, amount },
//       khaltiConfig
//     );

//     if (khaltiRes.data) {
//       // 2. Update Order in DB if Order ID exists
//       if (orderId && orderId !== "new") {
//         const order = await Order.findById(orderId);
//         if (order) {
//           order.isPaid = true;
//           order.paidAt = Date.now();
//           order.paymentMethod = "Khalti";
//           order.paymentResult = {
//             id: khaltiRes.data.idx,
//             status: "completed",
//             update_time: Date.now(),
//             email_address: req.user.email,
//           };
//           await order.save();
//           return res.json({ success: true, message: "Payment verified" });
//         }
//       }
//       // If it's a new order flow, frontend handles creation after this success
//       return res.json({
//         success: true,
//         message: "Payment verified (New Order)",
//       });
//     }

//     res
//       .status(400)
//       .json({ success: false, message: "Invalid Khalti response" });
//   } catch (error) {
//     console.error(
//       "Khalti Error:",
//       error.response ? error.response.data : error.message
//     );
//     res
//       .status(500)
//       .json({ success: false, message: "Payment verification failed" });
//   }
// };

// // @desc    Create Stripe Session
// // @route   POST /api/payments/create-stripe-session
// // @access  Private
// const createStripeSession = async (req, res) => {
//   const { amount, orderId, medicineName, customerEmail } = req.body;

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "npr",
//             product_data: {
//               name: medicineName || "Pharmacy Order",
//             },
//             unit_amount: amount, // Amount in cents/paisa
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${
//         process.env.CLIENT_URL || "http://localhost:3000"
//       }/payment-success?id=${orderId || "new"}&method=Stripe`,
//       cancel_url: `${
//         process.env.CLIENT_URL || "http://localhost:3000"
//       }/payment`,
//       customer_email: customerEmail,
//     });

//     res.json({ sessionId: session.id });
//   } catch (error) {
//     console.error("Stripe Session Error:", error);
//     res.status(500).json({ message: "Stripe session creation failed" });
//   }
// };

// // @desc    Set Payment Method to COD
// // @route   POST /api/payments/set-cod
// // @access  Private
// const setCodMethod = async (req, res) => {
//   const { orderId } = req.body;

//   try {
//     const order = await Order.findById(orderId);
//     if (order) {
//       order.paymentMethod = "COD";
//       order.isPaid = false;
//       order.paymentResult = { status: "pending_cod" };
//       await order.save();

//       res.json({ success: true, message: "Order updated to COD" });
//     } else {
//       res.status(404).json({ message: "Order not found" });
//     }
//   } catch (error) {
//     console.error("COD Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = { verifyKhalti, createStripeSession, setCodMethod };

// const Order = require("../models/Order");
// const axios = require("axios");
// // Ensure STRIPE_SECRET_KEY is in your .env file
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// // 1. Verify Khalti
// const verifyKhalti = async (req, res) => {
//   const { token, amount, orderId } = req.body;
//   try {
//     const khaltiConfig = {
//       headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}` },
//     };
//     const khaltiRes = await axios.post(
//       "https://khalti.com/api/v2/payment/verify/",
//       { token, amount },
//       khaltiConfig
//     );

//     if (khaltiRes.data) {
//       if (orderId && orderId !== "new") {
//         const order = await Order.findById(orderId);
//         if (order) {
//           order.isPaid = true;
//           order.paidAt = Date.now();
//           order.paymentMethod = "Khalti";
//           order.paymentResult = {
//             id: khaltiRes.data.idx,
//             status: "completed",
//             update_time: Date.now(),
//             email_address: req.user.email,
//           };
//           await order.save();
//           return res.json({ success: true, message: "Payment verified" });
//         }
//       }
//       return res.json({
//         success: true,
//         message: "Payment verified (New Order)",
//       });
//     }
//     res
//       .status(400)
//       .json({ success: false, message: "Invalid Khalti response" });
//   } catch (error) {
//     console.error("Khalti Error:", error.message);
//     res
//       .status(500)
//       .json({ success: false, message: "Payment verification failed" });
//   }
// };

// // 2. Create Stripe Session
// const createStripeSession = async (req, res) => {
//   const { amount, orderId, medicineName, customerEmail } = req.body;
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "npr",
//             product_data: { name: medicineName || "Pharmacy Order" },
//             unit_amount: amount,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${
//         process.env.CLIENT_URL || "http://localhost:3000"
//       }/payment-success?id=${orderId || "new"}&method=Stripe`,
//       cancel_url: `${
//         process.env.CLIENT_URL || "http://localhost:3000"
//       }/payment`,
//       customer_email: customerEmail,
//     });
//     res.json({ sessionId: session.id });
//   } catch (error) {
//     console.error("Stripe Error:", error);
//     res.status(500).json({ message: "Stripe session creation failed" });
//   }
// };

// // 3. Set COD Method
// const setCodMethod = async (req, res) => {
//   const { orderId } = req.body;
//   try {
//     const order = await Order.findById(orderId);
//     if (order) {
//       order.paymentMethod = "COD";
//       order.isPaid = false;
//       order.paymentResult = { status: "pending_cod" };
//       await order.save();
//       res.json({ success: true, message: "Order updated to COD" });
//     } else {
//       res.status(404).json({ message: "Order not found" });
//     }
//   } catch (error) {
//     console.error("COD Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ IMPORTANT: Ensure all 3 functions are exported here
// module.exports = { verifyKhalti, createStripeSession, setCodMethod };

// const Order = require("../models/Order");
// const axios = require("axios");
// // Ensure STRIPE_SECRET_KEY is in your .env file
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// // 1. Verify Khalti
// const verifyKhalti = async (req, res) => {
//   const { token, amount, orderId } = req.body;
//   try {
//     const khaltiConfig = {
//       headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}` },
//     };
//     const khaltiRes = await axios.post(
//       "https://khalti.com/api/v2/payment/verify/",
//       { token, amount },
//       khaltiConfig
//     );

//     if (khaltiRes.data) {
//       if (orderId && orderId !== "new") {
//         const order = await Order.findById(orderId);
//         if (order) {
//           order.isPaid = true;
//           order.paidAt = Date.now();
//           order.paymentMethod = "Khalti";
//           order.paymentResult = {
//             id: khaltiRes.data.idx,
//             status: "completed",
//             update_time: Date.now(),
//             email_address: req.user.email,
//           };
//           await order.save();
//           return res.json({ success: true, message: "Payment verified" });
//         }
//       }
//       return res.json({
//         success: true,
//         message: "Payment verified (New Order)",
//       });
//     }
//     res
//       .status(400)
//       .json({ success: false, message: "Invalid Khalti response" });
//   } catch (error) {
//     console.error("Khalti Error:", error.message);
//     res
//       .status(500)
//       .json({ success: false, message: "Payment verification failed" });
//   }
// };

// // 2. Create Stripe Session
// const createStripeSession = async (req, res) => {
//   const { amount, orderId, medicineName, customerEmail } = req.body;
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "npr",
//             product_data: { name: medicineName || "Pharmacy Order" },
//             unit_amount: amount,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${
//         process.env.CLIENT_URL || "http://localhost:3000"
//       }/payment-success?id=${orderId || "new"}&method=Stripe`,
//       cancel_url: `${
//         process.env.CLIENT_URL || "http://localhost:3000"
//       }/payment`,
//       customer_email: customerEmail,
//     });
//     res.json({ sessionId: session.id });
//   } catch (error) {
//     console.error("Stripe Error:", error);
//     res.status(500).json({ message: "Stripe session creation failed" });
//   }
// };

// // 3. Set COD Method
// const setCodMethod = async (req, res) => {
//   const { orderId } = req.body;
//   try {
//     const order = await Order.findById(orderId);
//     if (order) {
//       order.paymentMethod = "COD";
//       order.isPaid = false;
//       order.paymentResult = { status: "pending_cod" };
//       await order.save();
//       res.json({ success: true, message: "Order updated to COD" });
//     } else {
//       res.status(404).json({ message: "Order not found" });
//     }
//   } catch (error) {
//     console.error("COD Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ IMPORTANT: Ensure all 3 functions are exported here
// module.exports = { verifyKhalti, createStripeSession, setCodMethod };

//

// const Order = require("../models/Order");
// const Transaction = require("../models/Transaction"); // Ensure this model exists
// const axios = require("axios");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const nodemailer = require("nodemailer");
// const { getEmailTemplate } = require("../utils/emailTemplates"); // Uncomment if you have this file

// // ----------------------
// // Email Transport Setup
// // ----------------------
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Helper: Send Order Email
// async function sendOrderEmail(to, subject, htmlContent) {
//   try {
//     await transporter.sendMail({
//       from: `"Smart Pharmacy" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html: htmlContent,
//     });
//     console.log(`📧 Order email sent to ${to}`);
//   } catch (error) {
//     console.error("❌ Email send failed:", error.message);
//   }
// }

// // Helper: Generate Basic HTML (Fallback if getEmailTemplate is missing)
// const getEmailHtml = (name, message) => `
//   <div style="font-family: Arial, sans-serif; padding: 20px;">
//     <h2>Hello ${name},</h2>
//     <p>${message}</p>
//     <p>Thank you for shopping with Smart Pharmacy!</p>
//   </div>
// `;

// // ===================================================================
// // 1. STRIPE: Create Payment Intent
// // @desc    Step 1: Calculate USD amount & send clientSecret
// // ===================================================================
// const createStripeIntent = async (req, res) => {
//   const { orderId } = req.body;

//   try {
//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     // ⚠️ CURRENCY CONVERSION (NPR -> USD)
//     // Stripe does not support NPR. Assuming 1 USD = 133 NPR.
//     const EXCHANGE_RATE = 133;
//     const priceInUsd = order.totalPrice / EXCHANGE_RATE;

//     // Stripe expects amount in CENTS
//     const amountInCents = Math.round(priceInUsd * 100);

//     // Minimum Stripe charge check (~$0.50)
//     if (amountInCents < 50) {
//       return res
//         .status(400)
//         .json({ message: "Amount too low for card payment." });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amountInCents,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//       metadata: {
//         orderId: order._id.toString(),
//         userId: req.user._id.toString(),
//         originalAmountNPR: order.totalPrice,
//       },
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error("Stripe Intent Error:", error);
//     res.status(500).json({ message: "Failed to create payment intent" });
//   }
// };

// // ===================================================================
// // 2. STRIPE: Verify Payment
// // @desc    Step 2: Confirm success, Update DB, Send Email
// // ===================================================================
// const verifyStripePayment = async (req, res) => {
//   const { paymentIntentId, orderId } = req.body;

//   try {
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     if (paymentIntent.status === "succeeded") {
//       const order = await Order.findById(orderId).populate(
//         "user",
//         "name email",
//       );

//       if (!order) return res.status(404).json({ message: "Order not found" });
//       if (order.isPaid) return res.json({ message: "Order already paid" });

//       // Update Order
//       order.isPaid = true;
//       order.paidAt = Date.now();
//       order.paymentMethod = "Stripe";
//       order.paymentResult = {
//         id: paymentIntent.id,
//         status: paymentIntent.status,
//         email: req.user.email,
//         amount_paid_usd: paymentIntent.amount / 100,
//       };

//       await order.save();

//       // Create Transaction Record
//       await Transaction.create({
//         user: req.user._id,
//         order: order._id,
//         amount: order.totalPrice, // NPR
//         currency: "NPR",
//         paymentMethod: "Stripe",
//         status: "Success",
//         referenceId: paymentIntent.id,
//       });

//       // ✅ Send Email
//       const emailHtml = getEmailHtml(
//         order.user.name,
//         `✅ <strong>Payment Successful!</strong><br>
//          We received your payment of <strong>NPR ${order.totalPrice}</strong> via Stripe (Card).<br>
//          Order #${order._id} is being processed.`,
//       );

//       await sendOrderEmail(
//         order.user.email,
//         "Payment Receipt - Smart Pharmacy",
//         emailHtml,
//       );

//       res.json({ success: true, message: "Payment Successful" });
//     } else {
//       res.status(400).json({ message: "Payment not successful" });
//     }
//   } catch (error) {
//     console.error("Stripe Verify Error:", error);
//     res.status(500).json({ message: "Verification failed" });
//   }
// };

// // ===================================================================
// // 3. KHALTI: Verify Payment
// // @desc    Verify Legacy Token, Update DB, Send Email
// // ===================================================================
// const verifyKhalti = async (req, res) => {
//   const { token, amount, orderId } = req.body; // Amount is in Paisa

//   try {
//     const order = await Order.findById(orderId).populate("user", "name email");
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     // Verify with Khalti API
//     const khaltiRes = await axios.post(
//       "https://khalti.com/api/v2/payment/verify/",
//       { token, amount },
//       { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}` } },
//     );

//     if (khaltiRes.data && khaltiRes.data.idx) {
//       // ✅ SECURITY CHECK: Amount Mismatch
//       const paidAmountPaisa = khaltiRes.data.amount;
//       const orderAmountPaisa = Math.round(order.totalPrice * 100);

//       if (Math.abs(paidAmountPaisa - orderAmountPaisa) > 10) {
//         return res.status(400).json({
//           message: "Payment Verification Failed: Amount mismatch.",
//         });
//       }

//       // Update Order
//       order.isPaid = true;
//       order.paidAt = Date.now();
//       order.paymentMethod = "Khalti";
//       order.paymentResult = {
//         id: khaltiRes.data.idx,
//         status: "success",
//         email: req.user.email,
//         mobile: khaltiRes.data.user.mobile,
//       };

//       await order.save();

//       // Create Transaction Record
//       await Transaction.create({
//         user: req.user._id,
//         order: order._id,
//         amount: order.totalPrice,
//         currency: "NPR",
//         paymentMethod: "Khalti",
//         status: "Success",
//         referenceId: khaltiRes.data.idx,
//       });

//       // ✅ Send Email
//       const emailHtml = getEmailHtml(
//         order.user.name,
//         `✅ <strong>Payment Successful!</strong><br>
//          We received your payment of <strong>NPR ${(amount / 100).toFixed(2)}</strong> via Khalti.<br>
//          Order #${order._id} is being processed.`,
//       );

//       await sendOrderEmail(
//         order.user.email,
//         "Payment Receipt - Smart Pharmacy",
//         emailHtml,
//       );

//       res.json({
//         success: true,
//         message: "Payment Verified Successfully",
//         order,
//       });
//     } else {
//       res.status(400).json({ message: "Invalid Khalti response" });
//     }
//   } catch (error) {
//     console.error(
//       "Khalti Verify Error:",
//       error.response?.data || error.message,
//     );
//     res.status(400).json({
//       message: error.response?.data?.detail || "Khalti verification failed",
//     });
//   }
// };

// // ===================================================================
// // 4. CASH ON DELIVERY (COD)
// // @desc    Set COD, Send Confirmation Email
// // ===================================================================
// const setCodMethod = async (req, res) => {
//   const { orderId } = req.body;

//   try {
//     const order = await Order.findById(orderId).populate("user", "name email");
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     order.paymentMethod = "COD";
//     order.isPaid = false;
//     order.paymentResult = { status: "pending_cod" };
//     await order.save();

//     // ✅ Send Email
//     const emailHtml = getEmailHtml(
//       order.user.name,
//       `📦 <strong>Order Confirmed!</strong><br>
//        Your order <strong>#${order._id}</strong> has been placed using <strong>Cash on Delivery</strong>.<br>
//        Please keep Rs. ${order.totalPrice} ready upon delivery.`,
//     );

//     await sendOrderEmail(
//       order.user.email,
//       "Order Confirmation - Smart Pharmacy",
//       emailHtml,
//     );

//     res.json({ success: true, message: "Order confirmed for COD" });
//   } catch (error) {
//     console.error("COD Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   createStripeIntent,
//   verifyStripePayment,
//   verifyKhalti,
//   setCodMethod,
// };

// const Order = require("../models/Order");
// const Transaction = require("../models/Transaction");
// const axios = require("axios");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const nodemailer = require("nodemailer");

// // ----------------------
// // Email Transport Setup
// // ----------------------
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Helper: Send Order Email
// async function sendOrderEmail(to, subject, htmlContent) {
//   try {
//     await transporter.sendMail({
//       from: `"Smart Pharmacy" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html: htmlContent,
//     });
//     console.log(`📧 Order email sent to ${to}`);
//   } catch (error) {
//     console.error("❌ Email send failed:", error.message);
//   }
// }

// // Helper: Generate Basic HTML
// const getEmailHtml = (name, message) => `
//   <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
//     <h2 style="color: #2c3e50;">Hello ${name},</h2>
//     <p style="font-size: 16px;">${message}</p>
//     <hr>
//     <p style="font-size: 14px; color: #7f8c8d;">Thank you for shopping with Smart Pharmacy!</p>
//   </div>
// `;

// // ===================================================================
// // 1. STRIPE: Create Payment Intent
// // ===================================================================
// const createStripeIntent = async (req, res) => {
//   const { orderId } = req.body;

//   try {
//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     // ⚠️ CURRENCY CONVERSION (NPR -> USD)
//     const EXCHANGE_RATE = 133;
//     const priceInUsd = order.totalPrice / EXCHANGE_RATE;
//     const amountInCents = Math.round(priceInUsd * 100);

//     if (amountInCents < 50) {
//       return res
//         .status(400)
//         .json({ message: "Amount too low for card payment." });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amountInCents,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//       metadata: {
//         orderId: order._id.toString(),
//         userId: req.user._id.toString(),
//       },
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error("Stripe Intent Error:", error);
//     res.status(500).json({ message: "Failed to create payment intent" });
//   }
// };

// // ===================================================================
// // 2. STRIPE: Verify Payment
// // ===================================================================
// const verifyStripePayment = async (req, res) => {
//   const { paymentIntentId, orderId } = req.body;

//   try {
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     if (paymentIntent.status === "succeeded") {
//       const order = await Order.findById(orderId).populate(
//         "user",
//         "name email",
//       );
//       if (!order) return res.status(404).json({ message: "Order not found" });

//       if (order.isPaid) return res.json({ message: "Order already paid" });

//       order.isPaid = true;
//       order.paidAt = Date.now();
//       order.paymentMethod = "Stripe";
//       order.paymentResult = {
//         id: paymentIntent.id,
//         status: paymentIntent.status,
//         email: req.user.email,
//         amount_paid_usd: paymentIntent.amount / 100,
//       };

//       await order.save();
//       await Transaction.create({
//         user: req.user._id,
//         order: order._id,
//         amount: order.totalPrice,
//         currency: "NPR",
//         paymentMethod: "Stripe",
//         status: "Success",
//         referenceId: paymentIntent.id,
//       });

//       // Send Email
//       const emailHtml = getEmailHtml(
//         order.user.name,
//         `✅ <strong>Payment Successful!</strong><br>We received <strong>NPR ${order.totalPrice}</strong> via Stripe.`,
//       );
//       await sendOrderEmail(order.user.email, "Payment Receipt", emailHtml);

//       res.json({ success: true, message: "Payment Successful" });
//     } else {
//       res.status(400).json({ message: "Payment not successful" });
//     }
//   } catch (error) {
//     console.error("Stripe Verify Error:", error);
//     res.status(500).json({ message: "Verification failed" });
//   }
// };

// // ===================================================================
// // 3. KHALTI: Initiate (Step 1)
// // @desc   Gets the Payment URL for the frontend to redirect
// // ===================================================================
// const initiateKhaltiPayment = async (req, res) => {
//   const { orderId } = req.body;
//   try {
//     const order = await Order.findById(orderId).populate("user", "name email");
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     const payload = {
//       // ✅ FIX: Append '?id=' + order._id to the URL
//       // This ensures the ID is present when the user returns
//       return_url: `http://localhost:5173/payment-success?id=${order._id}`,
//       website_url: "http://localhost:5173",
//       amount: Math.round(order.totalPrice * 100),
//       purchase_order_id: order._id.toString(),
//       purchase_order_name: `Order #${order._id}`,
//       customer_info: {
//         name: order.user.name,
//         email: order.user.email,
//         phone: "9800000000",
//       },
//     };

//     const response = await axios.post(
//       "https://a.khalti.com/api/v2/epayment/initiate/",
//       payload,
//       {
//         headers: {
//           Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     res.json({
//       pidx: response.data.pidx,
//       payment_url: response.data.payment_url,
//     });
//   } catch (error) {
//     console.error("Khalti Init Error:", error.response?.data || error.message);
//     res.status(500).json({ message: "Khalti initiation failed" });
//   }
// };
// // ===================================================================
// // 4. KHALTI: Verify (Step 2 - Lookup)
// // @desc   Verifies payment after user returns from Khalti
// // ===================================================================
// const verifyKhalti = async (req, res) => {
//   const { pidx } = req.body;
//   try {
//     const response = await axios.post(
//       "https://a.khalti.com/api/v2/epayment/lookup/",
//       { pidx },
//       {
//         headers: {
//           Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     if (response.data.status === "Completed") {
//       const order = await Order.findById(
//         response.data.purchase_order_id,
//       ).populate("user", "name email");
//       if (!order) return res.status(404).json({ message: "Order not found" });

//       if (order.isPaid)
//         return res.json({ success: true, message: "Already Paid", order });

//       order.isPaid = true;
//       order.paidAt = Date.now();
//       order.paymentMethod = "Khalti";
//       order.paymentResult = {
//         id: pidx,
//         status: "success",
//         email: req.user.email,
//       };

//       await order.save();
//       await Transaction.create({
//         user: req.user._id,
//         order: order._id,
//         amount: order.totalPrice,
//         currency: "NPR",
//         paymentMethod: "Khalti",
//         status: "Success",
//         referenceId: response.data.transaction_id,
//       });

//       const emailHtml = getEmailHtml(
//         order.user.name,
//         `✅ <strong>Payment Successful!</strong><br>We received <strong>NPR ${order.totalPrice}</strong> via Khalti.`,
//       );
//       await sendOrderEmail(order.user.email, "Payment Receipt", emailHtml);

//       res.json({ success: true, message: "Payment Verified", order });
//     } else {
//       res.status(400).json({ message: "Payment not completed" });
//     }
//   } catch (error) {
//     console.error("Khalti Verify Error:", error);
//     res.status(500).json({ message: "Verification failed" });
//   }
// };

// // ===================================================================
// // 5. CASH ON DELIVERY (COD) - UPDATED
// // ===================================================================
// const setCodMethod = async (req, res) => {
//   const { orderId } = req.body;

//   try {
//     // 1. Fetch Order
//     const order = await Order.findById(orderId).populate("user", "name email");
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     // 2. Update Order Status
//     order.paymentMethod = "COD";
//     order.isPaid = false; // COD is paid on delivery
//     order.paymentResult = { status: "pending_cod" };

//     await order.save();

//     // 3. Send Confirmation Email with Cost
//     const emailHtml = getEmailHtml(
//       order.user.name,
//       `📦 <strong>Order Confirmed!</strong><br><br>
//        Your order <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong> has been placed using <strong>Cash on Delivery</strong>.<br>
//        <h3 style="color: #d35400;">Total to Pay: NPR ${order.totalPrice}</h3>
//        Please keep the exact amount ready upon delivery.`,
//     );

//     await sendOrderEmail(
//       order.user.email,
//       "Order Confirmation - Smart Pharmacy",
//       emailHtml,
//     );

//     // 4. ✅ RETURN ORDER & AMOUNT (Fixes the issue)
//     res.json({
//       success: true,
//       message: "Order confirmed for COD",
//       order: order,
//       amount: order.totalPrice,
//     });
//   } catch (error) {
//     console.error("COD Error:", error);
//     res.status(500).json({ message: "Server error during COD processing" });
//   }
// };

// module.exports = {
//   createStripeIntent,
//   verifyStripePayment,
//   initiateKhaltiPayment, // Make sure your routes file uses this name
//   verifyKhalti, // This is now the Lookup function
//   setCodMethod,
// };

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
        email: req.user.email,
        amount_paid_usd: paymentIntent.amount / 100,
      };

      await order.save();
      await Transaction.create({
        user: req.user._id,
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

      res.json({ success: true, message: "Payment Successful" });
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

    const payload = {
      // ✅ FIX: Appended '?id=' + order._id to the URL
      return_url: `http://localhost:5173/payment-success?id=${order._id}`,
      website_url: "http://localhost:5173",
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
  const { pidx } = req.body;
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
      const order = await Order.findById(
        response.data.purchase_order_id,
      ).populate("user", "name email");
      if (!order) return res.status(404).json({ message: "Order not found" });

      if (order.isPaid)
        return res.json({ success: true, message: "Already Paid", order });

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentMethod = "Khalti";
      order.paymentResult = {
        id: pidx,
        status: "success",
        email: req.user.email,
      };

      await order.save();
      await Transaction.create({
        user: req.user._id,
        order: order._id,
        amount: order.totalPrice,
        currency: "NPR",
        paymentMethod: "Khalti",
        status: "Success",
        referenceId: response.data.transaction_id,
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
    // 1. Fetch Order
    const order = await Order.findById(orderId).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 2. Update Order Status
    order.paymentMethod = "COD";
    order.isPaid = false; // COD is paid on delivery
    order.paymentResult = { status: "pending_cod" };

    await order.save();

    // 3. Send Confirmation Email with Cost
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

    // 4. Return Order & Amount
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
