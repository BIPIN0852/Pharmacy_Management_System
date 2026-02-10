const express = require("express");
const router = express.Router();
const {
  getPurchases,
  createPurchase,
  updatePurchaseStatus,
} = require("../controllers/purchaseController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");

// All routes require authentication and admin/staff role
router.use(protect);
router.use(authorizeRoles("admin", "pharmacist"));

router.route("/").get(getPurchases).post(createPurchase);

router.route("/:id/status").put(updatePurchaseStatus);

module.exports = router;
