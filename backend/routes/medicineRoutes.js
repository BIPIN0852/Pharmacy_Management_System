const express = require("express");
const router = express.Router();

// Models
const Medicine = require("../models/Medicine");

// Middleware
const { protect, admin, pharmacist } = require("../middleware/authMiddleware");

// -------------------------------------------------------------------
// PUBLIC: GET ALL MEDICINES (Browsing & Search)
// -------------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const { category, search, keyword, sort, page = 1, limit = 12 } = req.query;

    const searchTerm = search || keyword; // Support both naming conventions

    const query = {};

    // Category Filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Search Logic (Name, Brand, Generic Name, Description)
    if (searchTerm) {
      const regex = { $regex: searchTerm, $options: "i" };
      query.$or = [
        { name: regex },
        { genericName: regex },
        { brand: regex },
        { description: regex },
      ];
    }

    // Sort Logic
    let sortOption = { name: 1 };
    if (sort === "price-low") sortOption = { price: 1 };
    else if (sort === "price-high") sortOption = { price: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    const medicines = await Medicine.find(query)
      .sort(sortOption)
      // .limit(Number(limit)) // Uncomment for strict pagination
      // .skip((Number(page) - 1) * Number(limit))
      .select(
        "name category price countInStock image brand prescriptionRequired description baseUnit units"
      );

    // Return plain objects (Model already uses 'countInStock', no mapping needed)
    res.json({ medicines });
  } catch (error) {
    console.error("Get medicines error:", error);
    res.status(500).json({ message: error.message });
  }
});

// -------------------------------------------------------------------
// PUBLIC: GET RECOMMENDED (In-Stock & Random/Popular)
// -------------------------------------------------------------------
router.get("/recommended", async (req, res) => {
  try {
    const recommended = await Medicine.find({
      countInStock: { $gt: 0 },
    })
      .sort({ rating: -1, name: 1 }) // Show highest rated or alphabetical
      .limit(8)
      .select("name category price countInStock image brand")
      .lean();

    res.json(recommended);
  } catch (error) {
    console.error("Recommended medicines error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------------
// PHARMACIST DASHBOARD (Detailed Stock View)
// -------------------------------------------------------------------
router.get("/pharmacist/medicines", protect, pharmacist, async (req, res) => {
  try {
    // Return medicines with batch details for inventory management
    const medicines = await Medicine.find({})
      .select("name category countInStock price batches brand expiryDate")
      .sort({ countInStock: 1 }) // Show low stock first
      .lean();

    res.json(medicines);
  } catch (error) {
    console.error("Pharmacist medicines error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------------
// ADMIN: LOW STOCK ALERT
// -------------------------------------------------------------------
router.get("/admin/low-stock", protect, admin, async (req, res) => {
  try {
    const raw = req.query.threshold;
    const threshold = Number.isFinite(Number(raw)) ? Number(raw) : 10;

    const meds = await Medicine.find({
      countInStock: { $lte: threshold },
    })
      .select("name category countInStock brand image")
      .sort({ countInStock: 1 });

    res.json(meds);
  } catch (err) {
    console.error("Low stock error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------------
// PUBLIC: GET SINGLE MEDICINE
// -------------------------------------------------------------------
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

// -------------------------------------------------------------------
// ADMIN: CREATE MEDICINE
// -------------------------------------------------------------------
router.post("/", protect, admin, async (req, res) => {
  try {
    // ✅ Create instance
    const medicine = new Medicine(req.body);

    // ✅ Recalculate stock if batches provided immediately
    if (medicine.batches && medicine.batches.length > 0) {
      medicine.recalculateStock(); // Uses the new Model Method
    } else {
      // Fallback if manual stock provided without batches
      medicine.countInStock = req.body.countInStock || req.body.quantity || 0;
    }

    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    console.error("Create medicine error:", error);
    res.status(500).json({ message: error.message });
  }
});

// -------------------------------------------------------------------
// ADMIN/PHARMACIST: UPDATE MEDICINE
// -------------------------------------------------------------------
router.put("/:id", protect, pharmacist, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // Update fields
    Object.assign(medicine, req.body);

    // ✅ Recalculate stock automatically if batches were modified
    if (req.body.batches) {
      medicine.recalculateStock();
    }

    await medicine.save();
    res.json(medicine);
  } catch (error) {
    console.error("Update medicine error:", error);
    res.status(500).json({ message: error.message });
  }
});

// -------------------------------------------------------------------
// ADMIN: DELETE MEDICINE
// -------------------------------------------------------------------
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.json({ message: "Medicine deleted" });
  } catch (error) {
    console.error("Delete medicine error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
