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

const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema(
  {
    batchNumber: { type: String, trim: true },
    expiryDate: { type: Date, required: true },
    qty: { type: Number, required: true, min: 0 }, // units in this batch
    costPrice: { type: Number, min: 0 }, // optional
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
    },
    genericName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    dosageForm: {
      type: String,
      trim: true,
    },
    strength: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // total stock in units (derived from batches)
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // OLD single expiryDate kept for backward compatibility (optional)
    expiryDate: {
      type: Date,
    },

    requiresPrescription: {
      type: Boolean,
      default: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // NEW: batch-wise expiry + stock
    batches: [BatchSchema],
  },
  { timestamps: true }
);

// helper to keep quantity in sync with batches
MedicineSchema.methods.recalculateQuantityFromBatches = function () {
  const total = this.batches.reduce((sum, b) => sum + (b.qty || 0), 0);
  this.quantity = total;
};

module.exports = mongoose.model("Medicine", MedicineSchema);
