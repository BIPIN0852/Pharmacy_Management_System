const mongoose = require("mongoose");

// Sub-schema for Batch Management
const BatchSchema = new mongoose.Schema(
  {
    batchNumber: { type: String, trim: true },
    expiryDate: { type: Date, required: true },
    qty: { type: Number, required: true, min: 0 }, // Stock held in BASE UNITS
    costPrice: { type: Number, min: 0 }, // Optional: for profit calculation
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const MedicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // Optimizes exact name lookup
    },
    genericName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // ✅ Manufacturer / Brand Name
    brand: {
      type: String,
      trim: true,
    },

    dosageForm: {
      type: String,
      trim: true, // e.g., "Tablet", "Syrup", "Injection"
    },
    strength: {
      type: String,
      trim: true, // e.g., "500mg"
    },

    // ✅ Image for UI Display
    image: {
      type: String,
      required: true,
      default: "/images/sample.jpg",
    },

    // --- PRICING ---
    // Price per 1 BASE UNIT (e.g., 1 Tablet)
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // --- UNIT CONVERSION LOGIC ---
    baseUnit: {
      type: String,
      required: true,
      default: "Tablet",
      trim: true,
    },

    // Packaging Units (e.g., 1 Strip = 10 Tablets)
    units: [
      {
        name: { type: String, required: true }, // e.g. "Strip"
        multiplier: { type: Number, required: true, min: 1 }, // e.g. 10
        price: { type: Number, required: true, min: 0 }, // Price for this pack
        barcode: { type: String, trim: true },
      },
    ],

    // ✅ Total Stock (Derived from Batches)
    // Named 'countInStock' to align with typical E-commerce logic
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // Legacy/Main Expiry Date (usually the earliest expiring batch)
    expiryDate: {
      type: Date,
    },

    // ✅ Prescription Requirement Flag
    prescriptionRequired: {
      type: Boolean,
      default: false, // CHANGED TO FALSE: Most OTC medicines don't need a prescription
    },

    description: {
      type: String,
      trim: true,
    },

    // Detailed Batch Tracking
    batches: [BatchSchema],

    // E-commerce Ratings
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

// -------------------------------------------------------------------
// ✅ INDEXES
// -------------------------------------------------------------------

// Text Index allows users to search "Paracetamol Cipla" and get results
MedicineSchema.index({ name: "text", genericName: "text", brand: "text" });

// -------------------------------------------------------------------
// ✅ METHODS
// -------------------------------------------------------------------

// Recalculate total stock from batches and update earliest expiry
MedicineSchema.methods.recalculateStock = function () {
  let total = 0;
  let earliestExpiry = null;

  if (this.batches && this.batches.length > 0) {
    this.batches.forEach((b) => {
      total += b.qty || 0;

      // Update earliest expiry date for quick dashboard sorting
      if (!earliestExpiry || new Date(b.expiryDate) < earliestExpiry) {
        earliestExpiry = new Date(b.expiryDate);
      }
    });
  }

  this.countInStock = total;
  if (earliestExpiry) {
    this.expiryDate = earliestExpiry;
  }
};

// Pre-save hook to ensure consistency
MedicineSchema.pre("save", function (next) {
  if (this.isModified("batches")) {
    this.recalculateStock();
  }
  next();
});

module.exports = mongoose.model("Medicine", MedicineSchema);
