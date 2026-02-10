const mongoose = require("mongoose");

const savedMedicineSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // ✅ CRITICAL: Must match the lowercase "medicine" export in Medicine.js
      ref: "medicine",
    },
  },
  { timestamps: true }
);

// Unique Constraint: A user can only save a specific medicine once
savedMedicineSchema.index({ user: 1, medicine: 1 }, { unique: true });

module.exports = mongoose.model("SavedMedicine", savedMedicineSchema);
