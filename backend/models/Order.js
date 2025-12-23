// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   items: [
//     {
//       medicine: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Medicine",
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         min: 1,
//       },
//       price: {
//         type: Number,
//         required: true,
//       },
//     },
//   ],
//   totalAmount: {
//     type: Number,
//     required: true,
//   },
//   paymentStatus: {
//     type: String,
//     enum: ["pending", "paid", "failed"],
//     default: "pending",
//   },
//   orderStatus: {
//     type: String,
//     enum: ["processing", "completed", "cancelled"],
//     default: "processing",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Order", OrderSchema);

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    // customer placing the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // optional link to a prescription
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },

    // order items with medicine details
    items: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtOrder: {
          type: Number,
          required: true,
          min: 0,
        },
        name: String, // ✅ ADDED: Snapshot of medicine name
      },
    ],

    // pricing breakdown
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ✅ UPDATED: Payment integration (Stripe/Khalti/COD)
    paymentMethod: {
      type: String,
      enum: ["COD", "Khalti", "Stripe", "Cash"], // ✅ MATCH Frontend
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded", "failed", "pending"], // ✅ MATCH AdminOrders
      default: "unpaid",
    },
    paymentResult: {
      // ✅ NEW: Stripe/Khalti transaction details
      id: String,
      status: String,
      update_time: Date,
      email_address: String,
      transaction_id: String, // Khalti specific
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },

    // ✅ UPDATED: Order status (MATCH AdminOrders.jsx)
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Cancelled"], // ✅ MATCH Frontend
      default: "Pending",
    },

    // delivery details
    deliveryAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    deliveryNotes: {
      type: String,
      trim: true,
    },

    // customer notes
    notes: {
      type: String,
      trim: true,
    },

    // tracking & fulfillment
    trackingNumber: String,
    deliveredAt: Date,
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ✅ INDEXES for performance
OrderSchema.index({ user: 1, orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ paymentStatus: 1, orderStatus: 1 });

// ✅ VIRTUAL for total items count
OrderSchema.virtual("totalItems").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// ✅ PRE-SAVE: Validate totalAmount matches items
OrderSchema.pre("save", function (next) {
  if (this.isModified("items") && !this.isNew) {
    const subtotal = this.items.reduce(
      (sum, item) => sum + item.quantity * item.priceAtOrder,
      0
    );
    this.subtotal = subtotal;
    this.totalAmount = subtotal + this.taxAmount + this.shippingCost;
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
