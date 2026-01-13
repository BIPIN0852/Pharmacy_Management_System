// const mongoose = require("mongoose");

// const TransactionSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     order: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//       default: null, // Optional: Link to a specific order if applicable
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     type: {
//       type: String,
//       enum: ["payment", "refund", "deposit", "withdrawal"],
//       default: "payment",
//     },
//     paymentMethod: {
//       type: String, // e.g., 'esewa', 'khalti', 'cod', 'card'
//       default: "khalti",
//     },
//     status: {
//       type: String,
//       enum: ["pending", "success", "failed"],
//       default: "pending",
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//     transactionDate: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// module.exports =
//   mongoose.models.Transaction ||
//   mongoose.model("Transaction", TransactionSchema);

const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    // User who owns this transaction
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Optimizes "My Wallet/Transactions" queries
    },

    // Linked Order (Optional)
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    // ✅ External Gateway ID (e.g., Khalti 'idx' or Stripe 'payment_intent')
    // Important for auditing and preventing duplicate processing
    referenceId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allows null for Cash/COD transactions
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "NPR",
      uppercase: true,
      trim: true,
    },

    // Transaction Type
    type: {
      type: String,
      enum: ["Payment", "Refund", "Deposit", "Withdrawal"],
      default: "Payment",
    },

    // Payment Source
    paymentMethod: {
      type: String,
      enum: ["Khalti", "Stripe", "COD", "Cash", "Bank Transfer"],
      required: true,
      default: "Khalti",
    },

    // Status
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Cancelled"],
      default: "Pending",
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // Date of Transaction (Separate from createdAt for flexibility)
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// -------------------------------------------------------------------
// ✅ INDEXES
// -------------------------------------------------------------------

// 1. Sort by newest transactions first
TransactionSchema.index({ transactionDate: -1 });

// 2. Lookup by Gateway Reference (e.g., Find transaction by Khalti ID)
TransactionSchema.index({ referenceId: 1 });

module.exports =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
