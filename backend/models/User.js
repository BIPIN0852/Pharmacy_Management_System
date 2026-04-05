const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // --- Core Identity ---
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Optional: Username
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allows multiple null values
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
    role: {
      type: String,
      enum: ["admin", "doctor", "pharmacist", "staff", "customer"],
      default: "customer",
    },

    // Backward Compatibility for Admin Middleware
    isAdmin: {
      type: Boolean,
      default: false,
    },

    // --- Personal Information ---
    phone: {
      type: String,
      trim: true,
      sparse: true, // Added unique constraint logic via sparse
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    dob: {
      type: Date,
    },
    // Consolidated Address Field
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      province: { type: String, default: "" },
      postalCode: { type: String, default: "" },
    },
    profilePhoto: {
      type: String,
      default: "", // Stores URL path
    },

    // --- Security & Auth ---
    isActive: {
      type: Boolean,
      default: true, // Used for Soft Delete
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Standardized OTP Fields
    otp: { type: String },
    otpExpires: { type: Date },

    // Password Reset Codes
    resetPasswordCode: { type: String },
    resetPasswordExpires: { type: Date },

    // --- Medical Info (Profile Page) ---
    bloodGroup: { type: String, default: "" },
    allergies: { type: String, default: "" },
    chronicConditions: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },

    // --- Customer Loyalty & Stats ---
    notes: { type: String, trim: true },
    // Consolidated Loyalty Points
    loyaltyPoints: { type: Number, default: 0, min: 0 },

    preferredContact: {
      type: String,
      enum: ["email", "sms", "phone", "none"],
      default: "email",
    },

    lastPurchaseDate: { type: Date },
    totalSpent: { type: Number, default: 0, min: 0 },
    prescriptionCount: { type: Number, default: 0 },

    // --- Relations ---
    // CRITICAL: Used for Wishlist feature
    savedMedicines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
    ],
  },
  // Correct placement of Schema Options
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// MIDDLEWARE & METHODS
// -------------------------------------------------------------------

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Hash password only if modified
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Force Sync isAdmin flag with role
  // This ensures that if role is "admin", isAdmin is ALWAYS true
  if (this.isModified("role") || this.isNew) {
    this.isAdmin = this.role === "admin";
  }

  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual field for "fullName" (maps to 'name' for controller compatibility)
userSchema
  .virtual("fullName")
  .get(function () {
    return this.name;
  })
  .set(function (v) {
    this.name = v;
  });

module.exports = mongoose.model("User", userSchema);
