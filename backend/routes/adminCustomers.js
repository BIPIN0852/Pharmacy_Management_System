const express = require("express");
const authenticateToken = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// GET /api/customers/admin
router.get("/customers/admin", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { page = 1, limit = 15, search = "" } = req.query;
    const query = { role: "customer" };

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      User.find(query)
        .select(
          "name email phone allergies notes loyaltyPoints preferredContact totalSpent lastPurchaseDate prescriptionCount"
        )
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      User.countDocuments(query),
    ]);

    res.json({
      customers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("admin customers error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
