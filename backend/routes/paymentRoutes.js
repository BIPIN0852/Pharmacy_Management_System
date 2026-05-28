const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

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
router.post("/khalti-initiate", protect, initiateKhaltiPayment);

router.post("/khalti-lookup", protect, verifyKhalti);

// 3. CASH ON DELIVERY
router.post("/cod", protect, setCodMethod);

// Legacy Route Compatibility (Optional)
router.post("/verify-khalti", protect, verifyKhalti);

module.exports = router;
