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

// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema(
//   {
//     // customer placing the order
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // optional link to a prescription
//     prescription: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Prescription",
//     },

//     // order items with medicine details
//     items: [
//       {
//         medicine: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Medicine",
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//           min: 1,
//         },
//         priceAtOrder: {
//           type: Number,
//           required: true,
//           min: 0,
//         },
//         name: String, // ✅ ADDED: Snapshot of medicine name
//       },
//     ],

//     // pricing breakdown
//     subtotal: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     taxAmount: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     shippingCost: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     totalAmount: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     // ✅ UPDATED: Payment integration (Stripe/Khalti/COD)
//     paymentMethod: {
//       type: String,
//       enum: ["COD", "Khalti", "Stripe", "Cash"], // ✅ MATCH Frontend
//       default: "COD",
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["unpaid", "paid", "refunded", "failed", "pending"], // ✅ MATCH AdminOrders
//       default: "unpaid",
//     },
//     paymentResult: {
//       // ✅ NEW: Stripe/Khalti transaction details
//       id: String,
//       status: String,
//       update_time: Date,
//       email_address: String,
//       transaction_id: String, // Khalti specific
//     },
//     isPaid: {
//       type: Boolean,
//       default: false,
//     },
//     paidAt: {
//       type: Date,
//     },

//     // ✅ UPDATED: Order status (MATCH AdminOrders.jsx)
//     orderStatus: {
//       type: String,
//       enum: ["Pending", "Processing", "Completed", "Cancelled"], // ✅ MATCH Frontend
//       default: "Pending",
//     },

//     // delivery details
//     deliveryAddress: {
//       address: String,
//       city: String,
//       postalCode: String,
//       country: String,
//     },
//     deliveryNotes: {
//       type: String,
//       trim: true,
//     },

//     // customer notes
//     notes: {
//       type: String,
//       trim: true,
//     },

//     // tracking & fulfillment
//     trackingNumber: String,
//     deliveredAt: Date,
//   },
//   {
//     timestamps: true, // adds createdAt and updatedAt automatically
//   }
// );

// // ✅ INDEXES for performance
// OrderSchema.index({ user: 1, orderStatus: 1 });
// OrderSchema.index({ createdAt: -1 });
// OrderSchema.index({ paymentStatus: 1, orderStatus: 1 });

// // ✅ VIRTUAL for total items count
// OrderSchema.virtual("totalItems").get(function () {
//   return this.items.reduce((sum, item) => sum + item.quantity, 0);
// });

// // ✅ PRE-SAVE: Validate totalAmount matches items
// OrderSchema.pre("save", function (next) {
//   if (this.isModified("items") && !this.isNew) {
//     const subtotal = this.items.reduce(
//       (sum, item) => sum + item.quantity * item.priceAtOrder,
//       0
//     );
//     this.subtotal = subtotal;
//     this.totalAmount = subtotal + this.taxAmount + this.shippingCost;
//   }
//   next();
// });

// module.exports = mongoose.model("Order", OrderSchema);

// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema(
//   {
//     // Changed from 'user' or 'customer' to 'customerId' to match your routes
//     customerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // Array of items in the order
//     items: [
//       {
//         medicineId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Medicine",
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//           min: 1,
//         },
//         // NEW: Store which unit they bought (Tablet vs Strip)
//         unit: {
//           type: String,
//           default: "Tablet",
//         },
//         // NEW: Store the price at the moment of purchase (in case price changes later)
//         price: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],

//     total: {
//       type: Number,
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
//       default: "pending",
//     },

//     paymentStatus: {
//       type: String,
//       enum: ["Pending", "Paid", "Failed"],
//       default: "Pending",
//     },

//     paymentMethod: {
//       type: String,
//       default: "Cash on Delivery",
//     },

//     shippingAddress: {
//       street: String,
//       city: String,
//       postalCode: String,
//       country: String,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);

// const mongoose = require("mongoose");

// const batchSchema = new mongoose.Schema({
//   batchNumber: { type: String, required: true },
//   expiryDate: { type: Date, required: true },
//   quantity: { type: Number, required: true, default: 0 },
//   supplier: { type: String }, // Optional: Link to Supplier
// });

// const medicineSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
//     name: { type: String, required: true, trim: true },
//     image: { type: String, required: true },
//     brand: { type: String, required: true },
//     category: { type: String, required: true },
//     description: { type: String, required: true },

//     // Medical Info
//     dosage: { type: String, default: "As directed." },
//     sideEffects: { type: String, default: "None reported." },
//     prescriptionRequired: { type: Boolean, default: false },

//     // Pricing
//     price: { type: Number, required: true, default: 0 },

//     // ✅ ONE-TO-MANY: One Medicine -> Many Batches
//     batches: [batchSchema],

//     // Total calculated from batches
//     countInStock: { type: Number, required: true, default: 0 },

//     rating: { type: Number, default: 0 },
//     numReviews: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// // Middleware: Auto-calculate total stock before saving
// medicineSchema.pre("save", function (next) {
//   if (this.batches && this.batches.length > 0) {
//     this.countInStock = this.batches.reduce(
//       (acc, batch) => acc + batch.quantity,
//       0
//     );
//   }
//   next();
// });

// const Medicine = mongoose.model("Medicine", medicineSchema);
// module.exports = Medicine;

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // ✅ ONE-TO-MANY Relationship: One Order contains multiple OrderItems
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Medicine",
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: { type: Number, default: 0.0 },
    shippingPrice: { type: Number, default: 0.0 },
    totalPrice: { type: Number, default: 0.0 },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    status: { type: String, default: "Processing" },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
