// const mongoose = require("mongoose");

// const RefillReminderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     medicine: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Medicine",
//       required: true,
//     },
//     medicineName: { type: String, required: true },
//     quantity: { type: Number, required: true },
//     daysSupply: { type: Number, required: true }, // How many days supply
//     refillDate: { type: Date, required: true },
//     isCompleted: { type: Boolean, default: false },
//     reminderSent: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("RefillReminder", RefillReminderSchema);

const mongoose = require("mongoose");

const RefillReminderSchema = new mongoose.Schema(
  {
    // Reference to Patient
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Reference to Medicine
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },

    // Snapshot of Medicine Name (Preserved even if medicine is deleted)
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },

    // Snapshot of Image (For Email/UI display)
    medicineImage: {
      type: String,
      default: "/images/sample.jpg",
    },

    // Supply Details
    quantity: { type: Number, required: true }, // Total tablets bought
    daysSupply: { type: Number, required: true }, // e.g., 30 days
    dosage: { type: String, default: "As prescribed" }, // e.g., "1 Tablet Daily"

    // Dates
    startDate: { type: Date, default: Date.now }, // When the medicine started
    refillDate: { type: Date, required: true }, // Calculated date (Start + DaysSupply - Buffer)

    // Status Tracking
    status: {
      type: String,
      enum: ["Pending", "Sent", "Dismissed", "Fulfilled"],
      default: "Pending",
    },

    // Technical Flags
    reminderSent: { type: Boolean, default: false },
    emailSentAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// -------------------------------------------------------------------
// ✅ INDEXES (Critical for Cron Jobs)
// -------------------------------------------------------------------

// 1. Scheduler Index: Quickly find reminders that are DUE and NOT SENT yet
RefillReminderSchema.index({ refillDate: 1, reminderSent: 1, status: 1 });

// 2. User Dashboard: Show upcoming refills for a specific user
RefillReminderSchema.index({ user: 1, refillDate: 1 });

module.exports = mongoose.model("RefillReminder", RefillReminderSchema);
