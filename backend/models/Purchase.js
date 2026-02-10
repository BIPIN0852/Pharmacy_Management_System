const mongoose = require("mongoose");

const purchaseSchema = mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        quantity: { type: Number, required: true },
        costPrice: { type: Number, required: true },
        batchNumber: { type: String },
        expiryDate: { type: Date },
      },
    ],
    totalCost: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      enum: ["Ordered", "Received", "Cancelled"],
      default: "Ordered",
    },
    notes: { type: String },
    receivedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Purchase", purchaseSchema);
