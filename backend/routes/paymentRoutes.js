const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// Import Controllers
const {
  createStripeIntent,
  verifyStripePayment,
  initiateKhaltiPayment,
  verifyKhalti,
  setCodMethod,
} = require("../controllers/paymentController");

// ===================================================================
// PAYMENT ROUTES
// ===================================================================

// 1. STRIPE
router.post("/create-stripe-intent", protect, createStripeIntent);
router.post("/verify-stripe", protect, verifyStripePayment);

// 2. KHALTI (New ePayment Flow)
// ✅ FIX: This route handles the request from Payment.jsx
router.post("/khalti-initiate", protect, initiateKhaltiPayment);

// ✅ FIX: This handles the verification when user returns
router.post("/khalti-lookup", protect, verifyKhalti);

// 3. CASH ON DELIVERY
router.post("/cod", protect, setCodMethod);

// Legacy Route Compatibility (Optional)
router.post("/verify-khalti", protect, verifyKhalti);

module.exports = router;
