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

const Order = require("../models/Order");
const axios = require("axios");
// Ensure STRIPE_SECRET_KEY is in your .env file
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// 1. Verify Khalti
const verifyKhalti = async (req, res) => {
  const { token, amount, orderId } = req.body;
  try {
    const khaltiConfig = {
      headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}` },
    };
    const khaltiRes = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      { token, amount },
      khaltiConfig
    );

    if (khaltiRes.data) {
      if (orderId && orderId !== "new") {
        const order = await Order.findById(orderId);
        if (order) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentMethod = "Khalti";
          order.paymentResult = {
            id: khaltiRes.data.idx,
            status: "completed",
            update_time: Date.now(),
            email_address: req.user.email,
          };
          await order.save();
          return res.json({ success: true, message: "Payment verified" });
        }
      }
      return res.json({
        success: true,
        message: "Payment verified (New Order)",
      });
    }
    res
      .status(400)
      .json({ success: false, message: "Invalid Khalti response" });
  } catch (error) {
    console.error("Khalti Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
};

// 2. Create Stripe Session
const createStripeSession = async (req, res) => {
  const { amount, orderId, medicineName, customerEmail } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "npr",
            product_data: { name: medicineName || "Pharmacy Order" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/payment-success?id=${orderId || "new"}&method=Stripe`,
      cancel_url: `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/payment`,
      customer_email: customerEmail,
    });
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: "Stripe session creation failed" });
  }
};

// 3. Set COD Method
const setCodMethod = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentMethod = "COD";
      order.isPaid = false;
      order.paymentResult = { status: "pending_cod" };
      await order.save();
      res.json({ success: true, message: "Order updated to COD" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("COD Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ IMPORTANT: Ensure all 3 functions are exported here
module.exports = { verifyKhalti, createStripeSession, setCodMethod };
