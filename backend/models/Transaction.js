const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "NPR" },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: "Success" },
    referenceId: { type: String }, // Stripe ID or Khalti ID
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
