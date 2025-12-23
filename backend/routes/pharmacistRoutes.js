const express = require("express");
const Order = require("../models/order.model"); // adjust path
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Pharmacist: Get all customer orders
router.get("/orders", authenticateToken, async (req, res) => {
  try {
    if (!["pharmacist", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find({ status: { $ne: "cancelled" } })
      .populate("customer", "name email")
      .populate("medicines.medicine", "name")
      .sort({ createdAt: -1 });

    res.json(
      orders.map((o) => ({
        id: o._id,
        customer: o.customer?.name || "N/A",
        medicine: o.medicines?.[0]?.medicine?.name || "Mixed",
        qty: o.medicines?.reduce((sum, m) => sum + m.quantity, 0) || 0,
        paymentStatus: o.paymentStatus || "Pending",
      }))
    );
  } catch (err) {
    console.error("pharmacist orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
