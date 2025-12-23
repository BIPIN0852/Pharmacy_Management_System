// // routes/pharmacist.js
// const express = require("express");
// const router = express.Router();
// const authenticateToken = require("../middleware/auth");
// const Order = require("../models/Order");
// const Medicine = require("../models/Medicine");

// // GET /api/pharmacist/orders
// router.get("/orders", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const orders = await Order.find({})
//       .populate("customer", "name email")
//       .populate("orderItems.medicine", "name")
//       .sort({ createdAt: -1 })
//       .lean();

//     const formatted = orders.map((o) => ({
//       id: o._id,
//       customer: o.customer?.name || "N/A",
//       medicine:
//         o.orderItems?.[0]?.medicine?.name ||
//         (o.orderItems?.length > 1 ? "Multiple" : "N/A"),
//       qty:
//         o.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
//       paymentStatus: o.paymentStatus || "Pending",
//     }));

//     res.json(formatted);
//   } catch (err) {
//     console.error("pharmacist orders error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/pharmacist/medicines
// router.get("/medicines", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const meds = await Medicine.find({ quantity: { $gt: 0 } })
//       .select("name category quantity expiryDate")
//       .sort({ name: 1 })
//       .lean();

//     res.json(meds);
//   } catch (err) {
//     console.error("pharmacist medicines error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// routes/pharmacist.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const Order = require("../models/Order");
const Medicine = require("../models/Medicine");
const Doctor = require("../models/Doctor"); // ✅ ADDED for doctors

// GET /api/pharmacist/orders
router.get("/orders", authenticateToken, async (req, res) => {
  try {
    if (!["pharmacist", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    console.log("🔍 Pharmacist fetching orders..."); // 🔍 DEBUG

    const orders = await Order.find({})
      .populate("customer", "name email")
      .populate("orderItems.medicine", "name")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = orders.map((o) => ({
      id: o._id,
      customer: o.customer?.name || "N/A",
      medicine:
        o.orderItems?.[0]?.medicine?.name ||
        (o.orderItems?.length > 1 ? "Multiple" : "N/A"),
      qty:
        o.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
      paymentStatus: o.paymentStatus || "Pending",
    }));

    console.log(`✅ Pharmacist: Found ${formatted.length} orders`); // 🔍 DEBUG
    res.json(formatted);
  } catch (err) {
    console.error("❌ pharmacist orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/pharmacist/medicines
router.get("/medicines", authenticateToken, async (req, res) => {
  try {
    if (!["pharmacist", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    console.log("🔍 Pharmacist fetching medicines..."); // 🔍 DEBUG

    const meds = await Medicine.find({ quantity: { $gt: 0 } })
      .select("name category quantity expiryDate")
      .sort({ name: 1 })
      .lean();

    console.log(`✅ Pharmacist: Found ${meds.length} medicines`); // 🔍 DEBUG
    res.json(meds);
  } catch (err) {
    console.error("❌ pharmacist medicines error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- NEW: GET /api/pharmacist/doctors (FIXES 404) ----------
router.get("/doctors", authenticateToken, async (req, res) => {
  try {
    console.log("🔍 Pharmacist fetching doctors..."); // 🔍 DEBUG

    if (!["pharmacist", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const doctors = await Doctor.find({})
      .select("name speciality nmcNumber availability")
      .sort({ name: 1 })
      .lean();

    console.log(`✅ Pharmacist: Found ${doctors.length} doctors`); // 🔍 DEBUG
    res.json(doctors);
  } catch (err) {
    console.error("❌ pharmacist doctors error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
