const express = require("express");
const router = express.Router();
const authAdmin = require("../middleware/authAdmin");
const Order = require("../models/Order"); // adjust path/model name if different

// GET /api/admin/orders  → list all orders for admin
router.get("/orders", authAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(100);
    res.json(orders);
  } catch (err) {
    console.error("Admin orders fetch error:", err);
    res.status(500).json({ message: "Failed to fetch admin orders" });
  }
});

module.exports = router;
