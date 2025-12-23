const express = require("express");
const authenticateToken = require("../middleware/auth");
const FavouriteMedicine = require("../models/FavouriteMedicine");
const Medicine = require("../models/Medicine");

const router = express.Router();

// GET all favourites for the logged-in customer
router.get("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const favourites = await FavouriteMedicine.find({
      user: req.user.id,
      isActive: true,
    })
      .populate("medicine", "name price image")
      .sort({ createdAt: -1 })
      .lean();

    res.json(favourites);
  } catch (err) {
    console.error("Favourites fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST add a new favourite medicine
router.post("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { medicineId, dosage } = req.body;
    const medicine = await Medicine.findById(medicineId).lean();

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    const existing = await FavouriteMedicine.findOne({
      user: req.user.id,
      medicine: medicineId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already in favourites" });
    }

    const favourite = new FavouriteMedicine({
      user: req.user.id,
      medicine: medicineId,
      medicineName: medicine.name,
      medicineImage: medicine.image,
      dosage: dosage || "As prescribed",
      nextRefillDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days later
    });

    await favourite.save();
    res.status(201).json(favourite);
  } catch (err) {
    console.error("Add favourite error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE (soft) favourite medicine
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const favourite = await FavouriteMedicine.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isActive: false },
      { new: true }
    );

    if (!favourite) {
      return res.status(404).json({ message: "Favourite not found" });
    }

    res.json({ message: "Removed from favourites" });
  } catch (err) {
    console.error("Delete favourite error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
