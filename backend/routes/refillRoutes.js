// const express = require("express");
// const router = express.Router();

// // Models
// const RefillReminder = require("../models/RefillReminder");
// const Medicine = require("../models/Medicine");

// // Middleware
// const { protect } = require("../middleware/authMiddleware");

// // -------------------------------------------------------------------
// // GET: Upcoming Refills
// // @route GET /api/refill-reminders
// // -------------------------------------------------------------------
// router.get("/", protect, async (req, res) => {
//   try {
//     // 1. Fetch active reminders (Not Fulfilled or Dismissed)
//     const reminders = await RefillReminder.find({
//       user: req.user._id,
//       status: { $in: ["Pending", "Sent"] }, // Only show active ones
//       refillDate: { $gte: new Date() }, // Filter out past dates if needed, or show all
//     })
//       .populate("medicine", "name price image brand")
//       .sort({ refillDate: 1 }) // Soonest first
//       .lean();

//     res.json(reminders);
//   } catch (err) {
//     console.error("Refill reminders fetch error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------------------------------------------------------
// // POST: Create Reminder
// // @route POST /api/refill-reminders
// // -------------------------------------------------------------------
// router.post("/", protect, async (req, res) => {
//   try {
//     const { medicineId, quantity, daysSupply, dosage } = req.body;

//     const medicine = await Medicine.findById(medicineId);
//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }

//     // Calculate Refill Date (Now + Days Supply)
//     // Optional: Subtract a "buffer" (e.g., remind 2 days before)
//     const bufferDays = 2;
//     const targetDate = new Date();
//     targetDate.setDate(
//       targetDate.getDate() + (Number(daysSupply) - bufferDays)
//     );

//     const reminder = new RefillReminder({
//       user: req.user._id,
//       medicine: medicineId,
//       // ✅ Snapshot Details
//       medicineName: medicine.name,
//       medicineImage: medicine.image,
//       quantity,
//       daysSupply,
//       dosage: dosage || "As prescribed",
//       refillDate: targetDate,
//       status: "Pending",
//     });

//     await reminder.save();
//     res.status(201).json(reminder);
//   } catch (err) {
//     console.error("Create refill reminder error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------------------------------------------------------
// // PUT: Mark as Fulfilled (Completed)
// // @route PUT /api/refill-reminders/:id/complete
// // -------------------------------------------------------------------
// router.put("/:id/complete", protect, async (req, res) => {
//   try {
//     const reminder = await RefillReminder.findOneAndUpdate(
//       { _id: req.params.id, user: req.user._id },
//       {
//         status: "Fulfilled", // ✅ Updated Status Enum
//         isCompleted: true, // Keep legacy flag if needed, otherwise rely on status
//       },
//       { new: true }
//     );

//     if (!reminder) {
//       return res.status(404).json({ message: "Reminder not found" });
//     }

//     res.json({ message: "Refill marked as fulfilled", reminder });
//   } catch (err) {
//     console.error("Complete refill reminder error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------------------------------------------------------
// // DELETE: Remove Reminder
// // @route DELETE /api/refill-reminders/:id
// // -------------------------------------------------------------------
// router.delete("/:id", protect, async (req, res) => {
//   try {
//     const reminder = await RefillReminder.findOneAndDelete({
//       _id: req.params.id,
//       user: req.user._id,
//     });

//     if (!reminder) {
//       return res.status(404).json({ message: "Reminder not found" });
//     }

//     res.json({ message: "Reminder deleted" });
//   } catch (err) {
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
// GET: Upcoming Refills (For Customer Portal)
// @route GET /api/refill-reminders
// -------------------------------------------------------------------
router.get("/", protect, async (req, res) => {
  try {
    // 1. Fetch active reminders (Not Fulfilled or Dismissed)
    const reminders = await RefillReminder.find({
      user: req.user._id,
      status: { $in: ["Pending", "Sent"] }, // Show active ones
      // FIXED: Removed the { $gte: new Date() } filter!
      // If a refill is past due, we STILL want the patient to see it so they don't run out.
    })
      .populate("medicine", "name price image brand")
      .sort({ refillDate: 1 }) // Soonest/Past-Due first
      .lean();

    res.json(reminders);
  } catch (err) {
    console.error("Refill reminders fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------------
// POST: Create Manual Reminder
// @route POST /api/refill-reminders
// -------------------------------------------------------------------
router.post("/", protect, async (req, res) => {
  try {
    const { medicineId, quantity, daysSupply, dosage } = req.body;

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // ✅ SMART MATH ENGINE FALLBACK
    // If frontend provides daysSupply, use it. Otherwise, calculate it automatically!
    let finalDaysSupply = Number(daysSupply);

    if (!finalDaysSupply && quantity) {
      let dailyDose = 1;
      const dosageStr = (dosage || "").toLowerCase();
      if (dosageStr.includes("twice") || dosageStr.includes("2")) dailyDose = 2;
      else if (dosageStr.includes("thrice") || dosageStr.includes("3"))
        dailyDose = 3;

      finalDaysSupply = Math.floor(Number(quantity) / dailyDose);
    }

    // Calculate Refill Date (Now + Days Supply)
    // Subtract a "buffer" (e.g., remind 2 days before they completely run out)
    const bufferDays = 2;
    const targetDate = new Date();

    // Ensure we don't go into negative days if daysSupply is very small
    const daysToAdd = Math.max(1, finalDaysSupply - bufferDays);
    targetDate.setDate(targetDate.getDate() + daysToAdd);

    const reminder = new RefillReminder({
      user: req.user._id,
      medicine: medicineId,
      // Snapshot Details
      medicineName: medicine.name,
      medicineImage: medicine.image,
      quantity: Number(quantity) || 0,
      daysSupply: finalDaysSupply,
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
        status: "Fulfilled",
        isCompleted: true, // Keep legacy flag if frontend relies on it
      },
      { new: true },
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
