// const mongoose = require("mongoose");

// const MedicineSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     }, // brand name

//     genericName: {
//       type: String,
//       trim: true,
//     },

//     category: {
//       type: String,
//       required: true,
//       trim: true, // e.g. Antibiotic, Painkiller
//     },

//     manufacturer: {
//       type: String,
//       trim: true,
//     },

//     dosageForm: {
//       type: String,
//       trim: true, // Tablet, Syrup, Injection, etc.
//     },

//     strength: {
//       type: String,
//       trim: true, // 500mg, 5mg/5ml, etc.
//     },

//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     quantity: {
//       type: Number,
//       required: true,
//       default: 0,
//       min: 0,
//     }, // stock in units

//     expiryDate: {
//       type: Date,
//     },

//     requiresPrescription: {
//       type: Boolean,
//       default: true,
//     },

//     description: {
//       type: String,
//       trim: true,
//     },
//   },
//   { timestamps: true } // adds createdAt and updatedAt automatically
// );

// module.exports = mongoose.model("Medicine", MedicineSchema);

// const mongoose = require("mongoose");

// const BatchSchema = new mongoose.Schema(
//   {
//     batchNumber: { type: String, trim: true },
//     expiryDate: { type: Date, required: true },
//     qty: { type: Number, required: true, min: 0 }, // units in this batch
//     costPrice: { type: Number, min: 0 }, // optional
//     addedAt: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

// const MedicineSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     genericName: {
//       type: String,
//       trim: true,
//     },
//     category: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     manufacturer: {
//       type: String,
//       trim: true,
//     },
//     dosageForm: {
//       type: String,
//       trim: true,
//     },
//     strength: {
//       type: String,
//       trim: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     // total stock in units (derived from batches)
//     quantity: {
//       type: Number,
//       required: true,
//       default: 0,
//       min: 0,
//     },

//     // OLD single expiryDate kept for backward compatibility (optional)
//     expiryDate: {
//       type: Date,
//     },

//     requiresPrescription: {
//       type: Boolean,
//       default: true,
//     },

//     description: {
//       type: String,
//       trim: true,
//     },

//     // NEW: batch-wise expiry + stock
//     batches: [BatchSchema],
//   },
//   { timestamps: true }
// );

// // helper to keep quantity in sync with batches
// MedicineSchema.methods.recalculateQuantityFromBatches = function () {
//   const total = this.batches.reduce((sum, b) => sum + (b.qty || 0), 0);
//   this.quantity = total;
// };

// module.exports = mongoose.model("Medicine", MedicineSchema);

// const mongoose = require("mongoose");

// const BatchSchema = new mongoose.Schema(
//   {
//     batchNumber: { type: String, trim: true },
//     expiryDate: { type: Date, required: true },
//     qty: { type: Number, required: true, min: 0 }, // Stock in BASE UNITS
//     costPrice: { type: Number, min: 0 }, // optional
//     addedAt: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

// const MedicineSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     genericName: {
//       type: String,
//       trim: true,
//     },
//     category: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     manufacturer: {
//       type: String,
//       trim: true,
//     },
//     dosageForm: {
//       type: String,
//       trim: true,
//     },
//     strength: {
//       type: String,
//       trim: true,
//     },

//     // --- BASE UNIT PRICING ---
//     // This 'price' acts as the price for 1 BASE UNIT (e.g., 1 Tablet)
//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     // --- NEW: UNIT CONVERSION LOGIC ---
//     // The smallest unit (e.g. "Tablet", "Vial", "Capsule")
//     baseUnit: {
//         type: String,
//         required: true,
//         default: "Tablet", // Default ensures backward compatibility
//         trim: true
//     },

//     // Defines larger packaging: e.g. 1 Strip = 10 Tablets
//     units: [
//       {
//         name: { type: String, required: true }, // e.g. "Strip", "Box"
//         multiplier: { type: Number, required: true, min: 1 }, // e.g. 10 (Contains 10 base units)
//         price: { type: Number, required: true, min: 0 }, // Price for this specific unit
//         barcode: { type: String, trim: true } // Different barcode for Pack/Box
//       }
//     ],
//     // ----------------------------------

//     // total stock in BASE UNITS (derived from batches)
//     // If you add 1 Box (100 multiplier), this quantity becomes 100.
//     quantity: {
//       type: Number,
//       required: true,
//       default: 0,
//       min: 0,
//     },

//     // OLD single expiryDate kept for backward compatibility (optional)
//     expiryDate: {
//       type: Date,
//     },

//     requiresPrescription: {
//       type: Boolean,
//       default: true,
//     },

//     description: {
//       type: String,
//       trim: true,
//     },

//     // NEW: batch-wise expiry + stock
//     batches: [BatchSchema],
//   },
//   { timestamps: true }
// );

// // helper to keep quantity in sync with batches
// MedicineSchema.methods.recalculateQuantityFromBatches = function () {
//   const total = this.batches.reduce((sum, b) => sum + (b.qty || 0), 0);
//   this.quantity = total;
// };

// module.exports = mongoose.model("Medicine", MedicineSchema);

// const mongoose = require("mongoose");

// const BatchSchema = new mongoose.Schema(
//   {
//     batchNumber: { type: String, trim: true },
//     expiryDate: { type: Date, required: true },
//     qty: { type: Number, required: true, min: 0 }, // Stock in BASE UNITS
//     costPrice: { type: Number, min: 0 }, // optional
//     addedAt: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

// const MedicineSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     genericName: {
//       type: String,
//       trim: true,
//     },
//     category: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // ✅ UPDATED: Renamed 'manufacturer' to 'brand' to match Controller
//     brand: {
//       type: String,
//       trim: true,
//     },

//     dosageForm: {
//       type: String,
//       trim: true,
//     },
//     strength: {
//       type: String,
//       trim: true,
//     },

//     // ✅ ADDED: Image URL (Required for Dashboard display)
//     image: {
//       type: String,
//       required: true,
//       default: "/images/sample.jpg",
//     },

//     // --- BASE UNIT PRICING ---
//     // This 'price' acts as the price for 1 BASE UNIT (e.g., 1 Tablet)
//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     // --- UNIT CONVERSION LOGIC (Preserved) ---
//     baseUnit: {
//       type: String,
//       required: true,
//       default: "Tablet",
//       trim: true,
//     },

//     // Defines larger packaging: e.g. 1 Strip = 10 Tablets
//     units: [
//       {
//         name: { type: String, required: true }, // e.g. "Strip", "Box"
//         multiplier: { type: Number, required: true, min: 1 }, // e.g. 10
//         price: { type: Number, required: true, min: 0 }, // Price for this specific unit
//         barcode: { type: String, trim: true },
//       },
//     ],

//     // ✅ UPDATED: Renamed 'quantity' to 'countInStock' to match OrderController logic
//     // Total stock in BASE UNITS (derived from batches)
//     countInStock: {
//       type: Number,
//       required: true,
//       default: 0,
//       min: 0,
//     },

//     // Legacy expiryDate (Useful for quick sorting in dashboards)
//     expiryDate: {
//       type: Date,
//     },

//     // ✅ UPDATED: Renamed 'requiresPrescription' to 'prescriptionRequired' to match Frontend
//     prescriptionRequired: {
//       type: Boolean,
//       default: true,
//     },

//     description: {
//       type: String,
//       trim: true,
//     },

//     // Batch-wise expiry + stock
//     batches: [BatchSchema],

//     // Optional: Rating fields for E-commerce store
//     rating: { type: Number, default: 0 },
//     numReviews: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// // ✅ UPDATED: Helper now updates 'countInStock'
// MedicineSchema.methods.recalculateQuantityFromBatches = function () {
//   const total = this.batches.reduce((sum, b) => sum + (b.qty || 0), 0);
//   this.countInStock = total;
// };

// module.exports = mongoose.model("Medicine", MedicineSchema);

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
  { _id: false }
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
      default: true,
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
  }
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
