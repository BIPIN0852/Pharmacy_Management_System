const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    cartItems: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "medicine",
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        unit: { type: String, default: "Unit" }, // Tablet, Strip, etc.
        countInStock: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

// Middleware to calculate total price before saving
cartSchema.pre("save", function (next) {
  this.totalPrice = this.cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0,
  );
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
