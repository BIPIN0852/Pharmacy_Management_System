const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null, // Optional: Link to a specific order if applicable
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["payment", "refund", "deposit", "withdrawal"],
      default: "payment",
    },
    paymentMethod: {
      type: String, // e.g., 'esewa', 'khalti', 'cod', 'card'
      default: "esewa",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    description: {
      type: String,
      trim: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
