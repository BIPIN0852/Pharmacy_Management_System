const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier company name is required"],
      trim: true,
      unique: true,
      index: true,
    },
    contactPerson: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    address: { type: String, trim: true },
    gstOrPan: { type: String, trim: true, default: "N/A" },
    paymentTerms: { type: String, default: "Cash", trim: true },
    notes: { type: String, trim: true },

    // ✅ UPDATED: Stores Medicine Reference AND Quantity
    suppliedMedicines: [
      {
        // _id: false, // Uncomment this if you don't want unique IDs for each list item
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: [1, "Quantity must be at least 1"], // ✅ Prevents negative/zero values
        },
      },
    ],

    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

// ✅ INDEXES
// 1. Text Search Index (for Search Bar)
supplierSchema.index({ name: "text", contactPerson: "text" });

// 2. Relationship Index (Optimizes "Find all suppliers who sell Medicine X")
supplierSchema.index({ "suppliedMedicines.medicine": 1 });

module.exports = mongoose.model("Supplier", supplierSchema);
