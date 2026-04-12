const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    //Real-world  Order ID
    orderNumber: {
      type: String,
      unique: true,
    },
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

    // Prescription Verification Fields
    prescriptionImage: {
      type: String, // URL of the uploaded prescription image
    },
    supportiveDocument: {
      type: String,
      required: false,
    },
    prescriptionStatus: {
      type: String,
      enum: ["Not Required", "Pending Verification", "Approved", "Rejected"],
      default: "Not Required",
    },

    // EXISTING: Main Status Field (Processing, Shipped, Delivered, Cancelled)
    orderStatus: {
      type: String,
      required: true,
      default: "Processing",
    },

    //  EXISTING: Shipping Details
    isShipped: {
      type: Boolean,
      default: false,
    },
    shippedAt: {
      type: Date,
    },

    // EXISTING: Delivery Details
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },

    // EXISTING: Cancellation Details
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

// EXISTING: Auto-generate the Real-World Order ID before saving
orderSchema.pre("save", function (next) {
  // Only generate it if it doesn't already exist (i.e., this is a new order)
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Generate a random 4-digit number (e.g., 4829)
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    // Result: ORD-20260222-4829
    this.orderNumber = `ORD-${year}${month}${day}-${randomNum}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
