const express = require("express");
const router = express.Router();
// ✅ FIXED: Changed from "../models/Prescription" to "../models/prescriptionModel"
const Prescription = require("../models/prescriptionModel");
const Medicine = require("../models/Medicine");
// const Order = require("../models/Order"); // Uncomment when Order model exists
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");

// @desc    Get Pharmacist Dashboard Stats
// @route   GET /api/pharmacist/dashboard
router.get(
  "/dashboard",
  protect,
  authorizeRoles("pharmacist", "admin"),
  async (req, res) => {
    try {
      // 1. Count Pending Prescriptions
      const pendingRxCount = await Prescription.countDocuments({
        status: "Pending",
      });

      // 2. Count Low Stock Medicines (Threshold < 15)
      const lowStockCount = await Medicine.countDocuments({
        countInStock: { $lt: 15 },
      });

      // 3. Total Medicines
      const totalMedicines = await Medicine.countDocuments({});

      // 4. Order Stats (Placeholder until Order System is fully active)
      // const pendingOrdersCount = await Order.countDocuments({ status: "Processing" });
      const pendingOrdersCount = 0;
      const todaysOrdersCount = 0;

      res.json({
        pendingPrescriptionsCount: pendingRxCount,
        lowStockCount,
        totalMedicines,
        pendingOrdersCount,
        todaysOrdersCount,
      });
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
      res.status(500).json({ message: "Server Error loading stats" });
    }
  }
);

module.exports = router;
