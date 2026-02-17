// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     // Reference to the Customer
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//       index: true, // Optimizes "My Orders" queries
//     },

//     // ✅ ONE-TO-MANY Relationship: One Order contains multiple OrderItems
//     orderItems: [
//       {
//         name: { type: String, required: true },
//         qty: { type: Number, required: true }, // e.g., 2
//         image: { type: String, required: true },
//         price: { type: Number, required: true },

//         // Reference to Medicine Model
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           required: true,
//           ref: "Medicine",
//         },

//         // ✅ UNIT TRACKING (Crucial for Inventory)
//         // Tracks which pack size was bought (e.g., "Strip", "Bottle", "Box")
//         unit: {
//           type: String,
//           default: "Unit",
//         },

//         // Tracks how many base units this equals (e.g., 1 Strip = 10 Tablets)
//         // Used to deduct correct amount from Medicine.countInStock
//         buyingMultiplier: {
//           type: Number,
//           default: 1,
//         },
//       },
//     ],

//     shippingAddress: {
//       address: { type: String, required: true },
//       city: { type: String, required: true },
//       postalCode: { type: String, required: true },
//       country: { type: String, required: true },
//     },

//     paymentMethod: {
//       type: String,
//       required: true, // "Khalti", "Stripe", "COD"
//     },

//     // Payment Gateway Response Details
//     paymentResult: {
//       id: { type: String },
//       status: { type: String },
//       update_time: { type: String },
//       email_address: { type: String },
//     },

//     // --- PRICING BREAKDOWN ---
//     itemsPrice: { type: Number, required: true, default: 0.0 },
//     taxPrice: { type: Number, required: true, default: 0.0 },
//     shippingPrice: { type: Number, required: true, default: 0.0 },
//     totalPrice: { type: Number, required: true, default: 0.0 },

//     // --- STATUS FLAGS ---
//     isPaid: { type: Boolean, required: true, default: false },
//     paidAt: { type: Date },

//     isDelivered: { type: Boolean, required: true, default: false },
//     deliveredAt: { type: Date },

//     // Order Lifecycle Status
//     status: {
//       type: String,
//       enum: ["Pending", "Processing", "Ready", "Delivered", "Cancelled"],
//       default: "Processing",
//       index: true, // Optimizes Pharmacist Dashboard filtering
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // -------------------------------------------------------------------
// // ✅ INDEXES
// // -------------------------------------------------------------------

// // 1. Efficient "My Orders" lookup: Find orders by user, sorted by newest
// orderSchema.index({ user: 1, createdAt: -1 });

// module.exports = mongoose.model("Order", orderSchema);

// const mongoose = require("mongoose");

// const orderSchema = mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },
//     orderItems: [
//       {
//         name: { type: String, required: true },
//         qty: { type: Number, required: true },
//         image: { type: String, required: true },
//         price: { type: Number, required: true },
//         unit: { type: String },
//         medicine: {
//           type: mongoose.Schema.Types.ObjectId,
//           required: true,
//           ref: "medicine",
//         },
//       },
//     ],
//     shippingAddress: {
//       address: { type: String, required: true },
//       city: { type: String, required: true },
//       postalCode: { type: String, required: true },
//       phone: { type: String, required: true },
//     },
//     paymentMethod: {
//       type: String,
//       required: true,
//       enum: ["Khalti", "Stripe", "COD"], // Enforce specific gateways
//     },
//     paymentResult: {
//       // Stores gateway response
//       id: { type: String },
//       status: { type: String },
//       update_time: { type: String },
//       email_address: { type: String },
//     },
//     // Financials
//     itemsPrice: { type: Number, required: true, default: 0.0 },
//     taxPrice: { type: Number, required: true, default: 0.0 },
//     shippingPrice: { type: Number, required: true, default: 0.0 },
//     totalPrice: { type: Number, required: true, default: 0.0 },

//     // Status Flags
//     isPaid: { type: Boolean, required: true, default: false },
//     paidAt: { type: Date },
//     isDelivered: { type: Boolean, required: true, default: false },
//     deliveredAt: { type: Date },
//     orderStatus: {
//       type: String,
//       required: true,
//       default: "Processing",
//       enum: ["Processing", "Packed", "Shipped", "Delivered", "Cancelled"],
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);

// const mongoose = require("mongoose");

// const orderSchema = mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },
//     orderItems: [
//       {
//         name: { type: String, required: true },
//         qty: { type: Number, required: true },
//         image: { type: String, required: true },
//         price: { type: Number, required: true },
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           required: true,
//           ref: "Medicine",
//         },
//       },
//     ],
//     shippingAddress: {
//       address: { type: String, required: true },
//       city: { type: String, required: true },
//       postalCode: { type: String, required: true },
//       country: { type: String, required: true },
//     },
//     paymentMethod: {
//       type: String,
//       required: true,
//     },
//     paymentResult: {
//       id: { type: String },
//       status: { type: String },
//       update_time: { type: String },
//       email_address: { type: String },
//     },
//     taxPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },
//     shippingPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },
//     totalPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },
//     isPaid: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//     paidAt: {
//       type: Date,
//     },
//     isDelivered: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//     deliveredAt: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
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
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },

    // ✅ NEW: Main Status Field (Processing, Shipped, Delivered, Cancelled)
    orderStatus: {
      type: String,
      required: true,
      default: "Processing",
    },

    // ✅ NEW: Shipping Details
    isShipped: {
      type: Boolean,
      default: false,
    },
    shippedAt: {
      type: Date,
    },

    // ✅ EXISTING: Delivery Details
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },

    // ✅ NEW: Cancellation Details
    isCancelled: {
      type: Boolean,
      default: false,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
