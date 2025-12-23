const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "pharmacist", "staff", "customer"],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    // ---------- NEW CUSTOMER FIELDS ----------
    allergies: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    preferredContact: {
      type: String,
      enum: ["email", "sms", "phone", "none"],
      default: "email",
    },
    lastPurchaseDate: {
      type: Date,
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    prescriptionCount: {
      type: Number,
      default: 0,
    },

    profilePhoto: { type: String }, // URL/path to uploaded photo
    phone: { type: String, trim: true },
    address: {
      street: { type: String },
      city: { type: String },
      province: { type: String },
      postalCode: { type: String },
    },
    accountStatus: {
      type: String,
      enum: ["pending", "verified", "suspended"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
