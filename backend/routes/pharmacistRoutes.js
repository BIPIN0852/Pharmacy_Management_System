// const express = require("express");
// const router = express.Router();

// const Prescription = require("../models/prescriptionModel");
// const Medicine = require("../models/Medicine");
// const Order = require("../models/Order"); // Uncomment when Order model exists
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");

// // @desc    Get Pharmacist Dashboard Stats
// // @route   GET /api/pharmacist/dashboard
// router.get(
//   "/dashboard",
//   protect,
//   authorizeRoles("pharmacist", "admin"),
//   async (req, res) => {
//     try {
//       // 1. Count Pending Prescriptions
//       const pendingRxCount = await Prescription.countDocuments({
//         status: "Pending",
//       });

//       // 2. Count Low Stock Medicines (Threshold < 15)
//       const lowStockCount = await Medicine.countDocuments({
//         countInStock: { $lt: 15 },
//       });

//       // 3. Total Medicines
//       const totalMedicines = await Medicine.countDocuments({});

//       // 4. Order Stats (Placeholder until Order System is fully active)
//       // const pendingOrdersCount = await Order.countDocuments({ status: "Processing" });
//       const pendingOrdersCount = 0;
//       const todaysOrdersCount = 0;

//       res.json({
//         pendingPrescriptionsCount: pendingRxCount,
//         lowStockCount,
//         totalMedicines,
//         pendingOrdersCount,
//         todaysOrdersCount,
//       });
//     } catch (error) {
//       console.error("Dashboard Stats Error:", error);
//       res.status(500).json({ message: "Server Error loading stats" });
//     }
//   },
// );

// module.exports = router;

const express = require("express");
const router = express.Router();

const Prescription = require("../models/prescriptionModel");
const Medicine = require("../models/Medicine");
const Order = require("../models/Order"); // Uncomment when Order model exists
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
  },
);

// @desc    Get Pharmacist Critical Alerts (Low Stock & Expiring)
// @route   GET /api/pharmacist/alerts
router.get(
  "/alerts",
  protect,
  authorizeRoles("pharmacist", "admin"),
  async (req, res) => {
    try {
      // 1. Fetch Low Stock Medicines (< 15 units)
      const lowStockMedicines = await Medicine.find({
        countInStock: { $lt: 15 },
      }).select("name brand category countInStock");

      // 2. Fetch Expiring Medicines (<= 90 days)
      // We fetch all medicines with stock, then filter securely in Node.js
      // This prevents MongoDB crashes if expiryDate was saved as a String instead of a Date object.
      const allMedicines = await Medicine.find({ countInStock: { $gt: 0 } });

      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
      ninetyDaysFromNow.setHours(23, 59, 59, 999);

      const expiringBatches = [];

      allMedicines.forEach((m) => {
        let hasPushed = false;

        const isExpiringSoon = (dateString) => {
          if (!dateString) return false;
          const expDate = new Date(dateString);
          if (isNaN(expDate.getTime())) return false; // Ignore invalid dates
          return expDate <= ninetyDaysFromNow;
        };

        // A. Check inside nested batches (if using FEFO)
        if (m.batches && m.batches.length > 0) {
          m.batches.forEach((b) => {
            if (isExpiringSoon(b.expiryDate || b.expireDate) && b.qty > 0) {
              expiringBatches.push({
                _id: `${m._id}-${b._id || Math.random()}`,
                name: m.name,
                batchNumber: b.batchNumber || "Unknown",
                expiryDate: b.expiryDate || b.expireDate,
                qty: b.qty,
              });
              hasPushed = true;
            }
          });
        }

        // B. Check root object (from your Edit Item Record screen)
        const rootExpDate = m.expiryDate || m.expireDate;
        if (!hasPushed && isExpiringSoon(rootExpDate) && m.countInStock > 0) {
          expiringBatches.push({
            _id: m._id,
            name: m.name,
            batchNumber: m.batchNumber || m.batchId || "N/A",
            expiryDate: rootExpDate,
            qty: m.countInStock,
          });
        }
      });

      // Sort by closest expiry date first
      expiringBatches.sort(
        (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate),
      );

      res.json({
        lowStockMedicines,
        expiringMedicines: expiringBatches,
      });
    } catch (error) {
      console.error("Alerts Fetch Error:", error);
      res.status(500).json({ message: "Server Error loading alerts" });
    }
  },
);

module.exports = router;
