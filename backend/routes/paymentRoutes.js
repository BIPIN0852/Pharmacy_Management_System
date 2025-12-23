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

const express = require("express");
const fetch = require("node-fetch"); // npm install node-fetch
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const authenticateToken = require("../middleware/auth");

// STRIPE: Create Checkout Session
router.post("/create-stripe-session", authenticateToken, async (req, res) => {
  const { amount, orderId, medicineName, customerEmail } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: medicineName || "Pharmacy Purchase" },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
      customer_email: customerEmail,
      metadata: { orderId },
    });
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ message: "Stripe session error." });
  }
});

// KHALTI: Widget-based verification (for popup integration)
router.post("/khalti-verify", async (req, res) => {
  const { token, amount } = req.body;
  try {
    const response = await fetch("https://khalti.com/api/v2/payment/verify/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, amount }),
    });
    const data = await response.json();
    if (data.idx) {
      // Here you can now mark an order as paid in your DB if desired
      res.json({ success: true, ...data });
    } else {
      res.json({ success: false, error: data });
    }
  } catch (e) {
    console.error("Khalti verification error:", e);
    res.json({ success: false, error: e.toString() });
  }
});

// OPTIONAL: KHALTI E-Payment Redirection Initiation
router.post("/khalti-initiate", authenticateToken, async (req, res) => {
  try {
    const {
      amount,
      purchase_order_id,
      purchase_order_name,
      return_url,
      website_url,
      customer_info,
    } = req.body;

    const response = await fetch(
      "https://khalti.com/api/v2/epayment/initiate/",
      {
        method: "POST",
        headers: {
          Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_url,
          website_url,
          amount,
          purchase_order_id,
          purchase_order_name,
          customer_info,
        }),
      }
    );
    const data = await response.json();
    res.json(data); // includes payment_url to redirect
  } catch (error) {
    console.error("Khalti initiate error:", error);
    res.status(500).json({ message: "Khalti initiate error." });
  }
});

module.exports = router;

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
