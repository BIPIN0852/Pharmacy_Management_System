const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema(
  {
    // ✅ Patient Reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Snapshot fields
    customerName: { type: String, trim: true },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // ✅ Doctor Integration
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },

    // ✅ Digital Prescription Items
    items: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
        },
        // We added 'medicine' as a string field here to match what the
        // DoctorPrescriptions.jsx frontend sends (the name of the medicine)
        medicine: { type: String, trim: true },
        dosageInstructions: { type: String, trim: true },
        durationDays: { type: Number, min: 1 },
        quantity: { type: Number, min: 1 },
      },
    ],

    // ✅ Prescription Image URL
    imageUrl: {
      type: String,
      trim: true,
      // Fixed Validator: Ensures it doesn't fail when doctor sends "digital" or no image
      validate: {
        validator: function (v) {
          // If it has digital items, we don't need an image
          if (this.items && this.items.length > 0) return true;
          // If no items, then imageUrl must exist
          return typeof v === "string" && v.length > 0;
        },
        message: "Prescription must have either an image or medicine items.",
      },
    },

    // ✅ Standardized Status (Added "Completed" and lowercase versions for compatibility)
    status: {
      type: String,
      enum: [
        "Pending",
        "Reviewed",
        "Approved",
        "Rejected",
        "Dispensed",
        "Completed",
        "pending",
        "approved",
        "rejected",
        "completed",
      ],
      default: "Pending",
      index: true,
    },

    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
  },
);

// -------------------------------------------------------------------
// ✅ INDEXES
// -------------------------------------------------------------------
PrescriptionSchema.index({ status: 1, createdAt: -1 });
PrescriptionSchema.index({ doctor: 1 });

// -------------------------------------------------------------------
// ✅ VIRTUALS
// -------------------------------------------------------------------

PrescriptionSchema.virtual("type").get(function () {
  return this.items && this.items.length > 0 ? "Digital" : "Scanned";
});

PrescriptionSchema.virtual("image").get(function () {
  return this.imageUrl;
});

PrescriptionSchema.set("toJSON", { virtuals: true });
PrescriptionSchema.set("toObject", { virtuals: true });

module.exports =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema, "prescriptions");
