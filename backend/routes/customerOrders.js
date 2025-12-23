const express = require("express");
const Order = require("../models/Order"); // ✅ matches backend/models/Order.js
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// GET /api/customer/orders - current customer's orders
router.get("/orders", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Customer access only" });
    }

    const orders = await Order.find({ customer: req.user.id })
      .populate("orderItems.medicine", "name") // adjust field names to your schema
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (err) {
    console.error("customer orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
