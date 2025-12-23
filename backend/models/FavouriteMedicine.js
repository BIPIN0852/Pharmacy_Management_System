const mongoose = require("mongoose");

const FavouriteMedicineSchema = new mongoose.Schema(
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
    medicineImage: { type: String },
    dosage: { type: String }, // "1 tablet daily"
    lastRefillDate: { type: Date },
    nextRefillDate: { type: Date },
    reminderDays: { type: Number, default: 7 }, // Alert 7 days before
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FavouriteMedicine", FavouriteMedicineSchema);
