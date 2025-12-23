const express = require("express");
const authenticateToken = require("../middleware/auth");
const RefillReminder = require("../models/RefillReminder");
const Medicine = require("../models/Medicine");

const router = express.Router();

// GET upcoming refill reminders for logged-in customer
router.get("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const reminders = await RefillReminder.find({
      user: req.user.id,
      refillDate: { $gte: new Date() },
      isCompleted: false,
    })
      .populate("medicine", "name price image")
      .sort({ refillDate: 1 })
      .lean();

    res.json(reminders);
  } catch (err) {
    console.error("Refill reminders fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST create a new refill reminder for a medicine
router.post("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { medicineId, quantity, daysSupply } = req.body;
    const medicine = await Medicine.findById(medicineId).lean();

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    const refillDate = new Date(Date.now() + daysSupply * 24 * 60 * 60 * 1000);

    const reminder = new RefillReminder({
      user: req.user.id,
      medicine: medicineId,
      medicineName: medicine.name,
      quantity,
      daysSupply,
      refillDate,
      isCompleted: false,
      reminderSent: false,
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (err) {
    console.error("Create refill reminder error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT mark reminder as completed (e.g., after refill)
router.put("/:id/complete", authenticateToken, async (req, res) => {
  try {
    const reminder = await RefillReminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isCompleted: true },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: "Refill reminder not found" });
    }

    res.json({ message: "Refill reminder marked completed", reminder });
  } catch (err) {
    console.error("Complete refill reminder error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;  
