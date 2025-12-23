const mongoose = require("mongoose");

const RefillReminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    medicineName: { type: String, required: true },
    quantity: { type: Number, required: true },
    daysSupply: { type: Number, required: true }, // How many days supply
    refillDate: { type: Date, required: true },
    isCompleted: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RefillReminder", RefillReminderSchema);
