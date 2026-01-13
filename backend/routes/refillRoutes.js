// const express = require("express");
// const authenticateToken = require("../middleware/auth");
// const RefillReminder = require("../models/RefillReminder");
// const Medicine = require("../models/Medicine");

// const router = express.Router();

// // GET upcoming refill reminders for logged-in customer
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== "customer") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const reminders = await RefillReminder.find({
//       user: req.user.id,
//       refillDate: { $gte: new Date() },
//       isCompleted: false,
//     })
//       .populate("medicine", "name price image")
//       .sort({ refillDate: 1 })
//       .lean();

//     res.json(reminders);
//   } catch (err) {
//     console.error("Refill reminders fetch error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST create a new refill reminder for a medicine
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== "customer") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const { medicineId, quantity, daysSupply } = req.body;
//     const medicine = await Medicine.findById(medicineId).lean();

//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }

//     const refillDate = new Date(Date.now() + daysSupply * 24 * 60 * 60 * 1000);

//     const reminder = new RefillReminder({
//       user: req.user.id,
//       medicine: medicineId,
//       medicineName: medicine.name,
//       quantity,
//       daysSupply,
//       refillDate,
//       isCompleted: false,
//       reminderSent: false,
//     });

//     await reminder.save();
//     res.status(201).json(reminder);
//   } catch (err) {
//     console.error("Create refill reminder error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // PUT mark reminder as completed (e.g., after refill)
// router.put("/:id/complete", authenticateToken, async (req, res) => {
//   try {
//     const reminder = await RefillReminder.findOneAndUpdate(
//       { _id: req.params.id, user: req.user.id },
//       { isCompleted: true },
//       { new: true }
//     );

//     if (!reminder) {
//       return res.status(404).json({ message: "Refill reminder not found" });
//     }

//     res.json({ message: "Refill reminder marked completed", reminder });
//   } catch (err) {
//     console.error("Complete refill reminder error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

// Models
const RefillReminder = require("../models/RefillReminder");
const Medicine = require("../models/Medicine");

// Middleware
const { protect } = require("../middleware/authMiddleware");

// -------------------------------------------------------------------
// GET: Upcoming Refills
// @route GET /api/refill-reminders
// -------------------------------------------------------------------
router.get("/", protect, async (req, res) => {
  try {
    // 1. Fetch active reminders (Not Fulfilled or Dismissed)
    const reminders = await RefillReminder.find({
      user: req.user._id,
      status: { $in: ["Pending", "Sent"] }, // Only show active ones
      refillDate: { $gte: new Date() }, // Filter out past dates if needed, or show all
    })
      .populate("medicine", "name price image brand")
      .sort({ refillDate: 1 }) // Soonest first
      .lean();

    res.json(reminders);
  } catch (err) {
    console.error("Refill reminders fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------------
// POST: Create Reminder
// @route POST /api/refill-reminders
// -------------------------------------------------------------------
router.post("/", protect, async (req, res) => {
  try {
    const { medicineId, quantity, daysSupply, dosage } = req.body;

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // Calculate Refill Date (Now + Days Supply)
    // Optional: Subtract a "buffer" (e.g., remind 2 days before)
    const bufferDays = 2;
    const targetDate = new Date();
    targetDate.setDate(
      targetDate.getDate() + (Number(daysSupply) - bufferDays)
    );

    const reminder = new RefillReminder({
      user: req.user._id,
      medicine: medicineId,
      // ✅ Snapshot Details
      medicineName: medicine.name,
      medicineImage: medicine.image,
      quantity,
      daysSupply,
      dosage: dosage || "As prescribed",
      refillDate: targetDate,
      status: "Pending",
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (err) {
    console.error("Create refill reminder error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------------
// PUT: Mark as Fulfilled (Completed)
// @route PUT /api/refill-reminders/:id/complete
// -------------------------------------------------------------------
router.put("/:id/complete", protect, async (req, res) => {
  try {
    const reminder = await RefillReminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        status: "Fulfilled", // ✅ Updated Status Enum
        isCompleted: true, // Keep legacy flag if needed, otherwise rely on status
      },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json({ message: "Refill marked as fulfilled", reminder });
  } catch (err) {
    console.error("Complete refill reminder error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------------
// DELETE: Remove Reminder
// @route DELETE /api/refill-reminders/:id
// -------------------------------------------------------------------
router.delete("/:id", protect, async (req, res) => {
  try {
    const reminder = await RefillReminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json({ message: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
