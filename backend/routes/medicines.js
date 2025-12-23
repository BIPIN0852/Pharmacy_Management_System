// const express = require("express");
// const router = express.Router();
// const Medicine = require("../models/Medicine");
// const authenticateToken = require("../middleware/auth");

// // @desc    Get all medicines
// // @route   GET /api/medicines
// router.get("/", async (req, res) => {
//   try {
//     const { category, search, sort, page = 1, limit = 12 } = req.query;

//     let query = {};
//     if (category && category !== "All") query.category = category;
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//       ];
//     }

//     const medicines = await Medicine.find(query)
//       .sort(
//         sort === "price-low"
//           ? { price: 1 }
//           : sort === "price-high"
//           ? { price: -1 }
//           : { name: 1 }
//       )
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     res.json(medicines);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // @desc    Get single medicine
// // @route   GET /api/medicines/:id
// router.get("/:id", async (req, res) => {
//   try {
//     const medicine = await Medicine.findById(req.params.id);
//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }
//     res.json(medicine);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Medicine = require("../models/Medicine");
// const authenticateToken = require("../middleware/auth");

// // @desc    Get all medicines (public - for customer browsing)
// router.get("/", async (req, res) => {
//   try {
//     const { category, search, sort, page = 1, limit = 12 } = req.query;

//     let query = {};
//     if (category && category !== "All") query.category = category;
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//       ];
//     }

//     const medicines = await Medicine.find(query)
//       .sort(
//         sort === "price-low"
//           ? { price: 1 }
//           : sort === "price-high"
//           ? { price: -1 }
//           : { name: 1 }
//       )
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .select("name category price quantity expiryDate image"); // Optimized fields

//     res.json(medicines);
//   } catch (error) {
//     console.error("get medicines error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // ✅ NEW: FIXES CustomerDashboard 500 error - Recommended medicines
// router.get("/recommended", async (req, res) => {
//   try {
//     // Popular medicines: high stock + in-stock
//     const recommended = await Medicine.find({
//       quantity: { $gt: 0 },
//     })
//       .sort({ name: 1 })
//       .limit(8)
//       .select("name category price quantity image")
//       .lean();

//     res.json(recommended);
//   } catch (error) {
//     console.error("recommended medicines error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ NEW: Pharmacist dashboard medicines (with stock management fields)
// router.get("/pharmacist/medicines", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const medicines = await Medicine.find({ quantity: { $gt: 0 } })
//       .select("name category quantity expiryDate price")
//       .sort({ name: 1 })
//       .lean();

//     res.json(medicines);
//   } catch (error) {
//     console.error("pharmacist medicines error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // @desc    Get single medicine
// router.get("/:id", async (req, res) => {
//   try {
//     const medicine = await Medicine.findById(req.params.id);
//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }
//     res.json(medicine);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // ✅ NEW: Admin-only medicine management (create/update/delete)
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Admin access only" });
//     }

//     const medicine = new Medicine(req.body);
//     await medicine.save();
//     res.status(201).json(medicine);
//   } catch (error) {
//     console.error("create medicine error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// router.put("/:id", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }

//     res.json(medicine);
//   } catch (error) {
//     console.error("update medicine error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// router.delete("/:id", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Admin access only" });
//     }

//     const medicine = await Medicine.findByIdAndDelete(req.params.id);
//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }

//     res.json({ message: "Medicine deleted" });
//   } catch (error) {
//     console.error("delete medicine error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Medicine = require("../models/Medicine");
// const authenticateToken = require("../middleware/auth");

// // @desc    Get all medicines (public - for customer browsing)
// router.get("/", async (req, res) => {
//   try {
//     const { category, search, sort, page = 1, limit = 12 } = req.query;

//     const query = {};
//     if (category && category !== "All") query.category = category;
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//       ];
//     }

//     const medicines = await Medicine.find(query)
//       .sort(
//         sort === "price-low"
//           ? { price: 1 }
//           : sort === "price-high"
//           ? { price: -1 }
//           : { name: 1 }
//       )
//       .limit(Number(limit) || 12)
//       .skip((Number(page) - 1) * (Number(limit) || 12))
//       // include batches so frontend can show batchNumber + expiry
//       .select("name category price quantity image batches");

//     res.json(medicines);
//   } catch (error) {
//     console.error("get medicines error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Recommended medicines
// router.get("/recommended", async (req, res) => {
//   try {
//     const recommended = await Medicine.find({
//       quantity: { $gt: 0 },
//     })
//       .sort({ name: 1 })
//       .limit(8)
//       .select("name category price quantity image batches")
//       .lean();

//     res.json(recommended);
//   } catch (error) {
//     console.error("recommended medicines error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Pharmacist dashboard medicines (with stock & batches)
// router.get("/pharmacist/medicines", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const medicines = await Medicine.find({ quantity: { $gt: 0 } })
//       .select("name category quantity price batches")
//       .sort({ name: 1 })
//       .lean();

//     res.json(medicines);
//   } catch (error) {
//     console.error("pharmacist medicines error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get single medicine
// router.get("/:id", async (req, res) => {
//   try {
//     const medicine = await Medicine.findById(req.params.id);
//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }
//     res.json(medicine);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Admin-only medicine create
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Admin access only" });
//     }

//     // keep quantity in sync with batches if provided
//     if (Array.isArray(req.body.batches) && req.body.batches.length > 0) {
//       const total = req.body.batches.reduce(
//         (sum, b) => sum + (Number(b.qty) || 0),
//         0
//       );
//       req.body.quantity = total;
//     }

//     const medicine = new Medicine(req.body);
//     await medicine.save();
//     res.status(201).json(medicine);
//   } catch (error) {
//     console.error("create medicine error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update medicine (admin / pharmacist)
// router.put("/:id", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     // if batches updated, sync quantity
//     if (Array.isArray(req.body.batches)) {
//       const total = req.body.batches.reduce(
//         (sum, b) => sum + (Number(b.qty) || 0),
//         0
//       );
//       req.body.quantity = total;
//     }

//     const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }

//     res.json(medicine);
//   } catch (error) {
//     console.error("update medicine error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Delete medicine
// router.delete("/:id", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Admin access only" });
//     }

//     const medicine = await Medicine.findByIdAndDelete(req.params.id);
//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }

//     res.json({ message: "Medicine deleted" });
//   } catch (error) {
//     console.error("delete medicine error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Medicine = require("../models/Medicine");
// const authenticateToken = require("../middleware/auth");

// // @desc    Get all medicines (public - for customer browsing)
// router.get("/", async (req, res) => {
//   try {
//     const { category, search, sort, page = 1, limit = 12 } = req.query;

//     const query = {};
//     if (category && category !== "All") query.category = category;
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//       ];
//     }

//     const medicines = await Medicine.find(query)
//       .sort(
//         sort === "price-low"
//           ? { price: 1 }
//           : sort === "price-high"
//           ? { price: -1 }
//           : { name: 1 }
//       )
//       .limit(Number(limit) || 12)
//       .skip((Number(page) - 1) * (Number(limit) || 12))
//       // include batches so frontend can show batchNumber + expiry
//       .select("name category price quantity image batches");

//     res.json(medicines);
//   } catch (error) {
//     console.error("get medicines error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Recommended medicines
// router.get("/recommended", async (req, res) => {
//   try {
//     const recommended = await Medicine.find({
//       quantity: { $gt: 0 },
//     })
//       .sort({ name: 1 })
//       .limit(8)
//       .select("name category price quantity image batches")
//       .lean();

//     res.json(recommended);
//   } catch (error) {
//     console.error("recommended medicines error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Pharmacist dashboard medicines (with stock & batches)
// router.get("/pharmacist/medicines", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const medicines = await Medicine.find({ quantity: { $gt: 0 } })
//       .select("name category quantity price batches")
//       .sort({ name: 1 })
//       .lean();

//     res.json(medicines);
//   } catch (error) {
//     console.error("pharmacist medicines error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Low stock medicines for admin dashboard
// router.get("/admin/low-stock", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Admin access only" });
//     }

//     const raw = req.query.threshold;
//     const threshold = Number.isFinite(Number(raw)) ? Number(raw) : 10;

//     const meds = await Medicine.find({
//       quantity: { $lte: threshold },
//     })
//       .select("name category quantity")
//       .sort({ quantity: 1, name: 1 });

//     res.json(meds);
//   } catch (err) {
//     console.error("low stock error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get single medicine
// router.get("/:id", async (req, res) => {
//   try {
//     const medicine = await Medicine.findById(req.params.id);
//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }
//     res.json(medicine);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Admin-only medicine create
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Admin access only" });
//     }

//     // keep quantity in sync with batches if provided
//     if (Array.isArray(req.body.batches) && req.body.batches.length > 0) {
//       const total = req.body.batches.reduce(
//         (sum, b) => sum + (Number(b.qty) || 0),
//         0
//       );
//       req.body.quantity = total;
//     }

//     const medicine = new Medicine(req.body);
//     await medicine.save();
//     res.status(201).json(medicine);
//   } catch (error) {
//     console.error("create medicine error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update medicine (admin / pharmacist)
// router.put("/:id", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     // if batches updated, sync quantity
//     if (Array.isArray(req.body.batches)) {
//       const total = req.body.batches.reduce(
//         (sum, b) => sum + (Number(b.qty) || 0),
//         0
//       );
//       req.body.quantity = total;
//     }

//     const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }

//     res.json(medicine);
//   } catch (error) {
//     console.error("update medicine error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Delete medicine
// router.delete("/:id", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Admin access only" });
//     }

//     const medicine = await Medicine.findByIdAndDelete(req.params.id);
//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }

//     res.json({ message: "Medicine deleted" });
//   } catch (error) {
//     console.error("delete medicine error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");
const authenticateToken = require("../middleware/auth");

// @desc    Get all medicines (public - for customer browsing)
router.get("/", async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;

    const query = {};
    if (category && category !== "All") query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const medicines = await Medicine.find(query)
      .sort(
        sort === "price-low"
          ? { price: 1 }
          : sort === "price-high"
          ? { price: -1 }
          : { name: 1 }
      )
      .limit(Number(limit) || 12)
      .skip((Number(page) - 1) * (Number(limit) || 12))
      // include batches so frontend can show batchNumber + expiry
      .select("name category price quantity image batches");

    res.json(medicines);
  } catch (error) {
    console.error("get medicines error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Recommended medicines
router.get("/recommended", async (req, res) => {
  try {
    const recommended = await Medicine.find({
      quantity: { $gt: 0 },
    })
      .sort({ name: 1 })
      .limit(8)
      .select("name category price quantity image batches")
      .lean();

    res.json(recommended);
  } catch (error) {
    console.error("recommended medicines error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Pharmacist dashboard medicines (with stock & batches)
router.get("/pharmacist/medicines", authenticateToken, async (req, res) => {
  try {
    if (!["pharmacist", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const medicines = await Medicine.find({ quantity: { $gt: 0 } })
      .select("name category quantity price batches")
      .sort({ name: 1 })
      .lean();

    res.json(medicines);
  } catch (error) {
    console.error("pharmacist medicines error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Low stock medicines for admin dashboard
router.get("/admin/low-stock", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const raw = req.query.threshold;
    const threshold = Number.isFinite(Number(raw)) ? Number(raw) : 10;

    const meds = await Medicine.find({
      quantity: { $lte: threshold },
    })
      .select("name category quantity")
      .sort({ quantity: 1, name: 1 });

    res.json(meds);
  } catch (err) {
    console.error("low stock error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single medicine
router.get("/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin-only medicine create
router.post("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // keep quantity in sync with batches if provided
    if (Array.isArray(req.body.batches) && req.body.batches.length > 0) {
      const total = req.body.batches.reduce(
        (sum, b) => sum + (Number(b.qty) || 0),
        0
      );
      req.body.quantity = total;
    }

    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    console.error("create medicine error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update medicine (admin / pharmacist)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    if (!["admin", "pharmacist"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // if batches updated, sync quantity
    if (Array.isArray(req.body.batches)) {
      const total = req.body.batches.reduce(
        (sum, b) => sum + (Number(b.qty) || 0),
        0
      );
      req.body.quantity = total;
    }

    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json(medicine);
  } catch (error) {
    console.error("update medicine error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete medicine
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json({ message: "Medicine deleted" });
  } catch (error) {
    console.error("delete medicine error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
