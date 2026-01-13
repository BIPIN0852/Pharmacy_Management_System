// const mongoose = require("mongoose");

// const supplierSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     contactPerson: {
//       type: String,
//       trim: true,
//     },
//     phone: {
//       type: String,
//       trim: true,
//     },
//     email: {
//       type: String,
//       trim: true,
//       lowercase: true,
//     },
//     address: {
//       type: String,
//       trim: true,
//     },
//     gstOrPan: {
//       type: String,
//       trim: true,
//     },
//     notes: {
//       type: String,
//       trim: true,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true, // createdAt, updatedAt
//   }
// );

// module.exports = mongoose.model("Supplier", supplierSchema);

const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    // Company Name (Must be unique to prevent duplicates)
    name: {
      type: String,
      required: [true, "Supplier company name is required"],
      trim: true,
      unique: true,
      index: true,
    },

    contactPerson: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Contact number is essential for communication"],
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      // ✅ Added basic regex validation for email
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },

    address: {
      type: String,
      trim: true,
    },

    // Tax/Business Identification (PAN, VAT, GST)
    gstOrPan: {
      type: String,
      trim: true,
      uppercase: true,
      default: "N/A",
    },

    // Optional: Payment Terms (e.g., "Net 30", "Cash", "Credit")
    paymentTerms: {
      type: String,
      default: "Cash",
      trim: true,
    },

    // ✅ List of medicines provided by this specific supplier
    suppliedMedicines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
    ],

    notes: {
      type: String,
      trim: true,
    },

    // Soft Delete Flag
    isActive: {
      type: Boolean,
      default: true,
      index: true, // Optimizes "Show Active Suppliers" query
    },
  },
  {
    timestamps: true, // Auto-manages createdAt and updatedAt
  }
);

// -------------------------------------------------------------------
// ✅ INDEXES
// -------------------------------------------------------------------

/**
 * Text Index: Allows advanced searching by "Name" or "Contact Person"
 * This powers the search bar in your AdminSuppliers.jsx frontend
 */
supplierSchema.index({ name: "text", contactPerson: "text" });

module.exports = mongoose.model("Supplier", supplierSchema);
