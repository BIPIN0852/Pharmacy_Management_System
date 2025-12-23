import Stripe from "stripe";
import axios from "axios";
import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Add to .env

// @desc    Create Stripe payment session
// @route   POST /api/payments/create-stripe-session
const createStripeSession = asyncHandler(async (req, res) => {
  const { amount, orderId, medicineName, customerEmail } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "npr",
          product_data: {
            name: medicineName || "Pharmacy Order",
            description: `Order #${orderId}`,
          },
          unit_amount: Math.round(amount), // amount in paisa, should be integer
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.headers.origin}/placeorder?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
    cancel_url: `${req.headers.origin}/payment?cancelled=true&order_id=${orderId}`,
    customer_email: customerEmail,
    metadata: {
      orderId,
      customerEmail,
    },
    automatic_tax: { enabled: true }, // Enable automatic tax calculation (optional)
  });

  res.json({ sessionId: session.id, url: session.url });
});

// @desc    Verify Khalti payment
// @route   POST /api/payments/khalti-verify
const verifyKhaltiPayment = asyncHandler(async (req, res) => {
  const { token, amount, orderId } = req.body;

  try {
    const verifyResponse = await axios.post(
      "https://a.khalti.com/api/v2/payment/verify/",
      {
        token,
        amount,
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (verifyResponse.data.state.value === "Complete") {
      // Update order status in DB
      await Order.findByIdAndUpdate(orderId, {
        paymentMethod: "Khalti",
        paymentResult: {
          id: verifyResponse.data.transaction_id,
          status: "succeeded",
          update_time: Date.now(),
          email_address: verifyResponse.data.user.email,
        },
        isPaid: true,
        paidAt: Date.now(),
      });

      res.json({
        success: true,
        transactionId: verifyResponse.data.transaction_id,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: error.response?.data?.detail || "Verification failed",
      });
  }
});

// @desc    Confirm COD order
// @route   POST /api/payments/cod-confirm
const confirmCODOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  await Order.findByIdAndUpdate(orderId, {
    paymentMethod: "COD",
    isPaid: false, // COD not paid upfront
    paymentResult: {
      id: `COD-${Date.now()}`,
      status: "pending",
      update_time: Date.now(),
    },
  });

  res.json({ success: true, message: "COD order confirmed" });
});

export { createStripeSession, verifyKhaltiPayment, confirmCODOrder };
