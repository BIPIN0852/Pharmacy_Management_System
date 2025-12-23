// routes/adminAnalytics.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Medicine = require("../models/Medicine");
const Order = require("../models/Order");
const Doctor = require("../models/Doctor");

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const [users, medicines, doctors, orders, revenueAgg] = await Promise.all([
      User.countDocuments(),
      Medicine.countDocuments(),
      Doctor.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    const revenue = revenueAgg[0]?.total || 0;

    const salesAgg = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const salesData = salesAgg.map((row) => ({
      month: MONTHS[row._id - 1],
      sales: row.sales,
    }));

    res.json({ users, medicines, doctors, orders, revenue, salesData });
  } catch (err) {
    console.error("admin stats error", err);
    res.status(500).json({ message: "Failed to load admin stats" });
  }
});

// GET /api/admin/low-stock
router.get("/low-stock", async (req, res) => {
  try {
    const lowStock = await Medicine.find({ stock: { $lte: 10 } })
      .sort({ stock: 1 })
      .limit(50);
    res.json(lowStock);
  } catch (err) {
    console.error("low stock error", err);
    res.status(500).json({ message: "Failed to load low stock list" });
  }
});

module.exports = router;
