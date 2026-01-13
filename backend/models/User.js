// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     phone: {
//       type: String,
//       trim: true,
//     },
//     role: {
//       type: String,
//       enum: ["admin", "pharmacist", "staff", "customer"],
//       default: "customer",
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     otp: {
//       type: String,
//     },
//     otpExpiry: {
//       type: Date,
//     },
//     // ---------- NEW CUSTOMER FIELDS ----------
//     allergies: {
//       type: [String],
//       default: [],
//     },
//     notes: {
//       type: String,
//       trim: true,
//     },
//     loyaltyPoints: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     preferredContact: {
//       type: String,
//       enum: ["email", "sms", "phone", "none"],
//       default: "email",
//     },
//     lastPurchaseDate: {
//       type: Date,
//     },
//     totalSpent: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     prescriptionCount: {
//       type: Number,
//       default: 0,
//     },

//     profilePhoto: { type: String }, // URL/path to uploaded photo
//     phone: { type: String, trim: true },
//     address: {
//       street: { type: String },
//       city: { type: String },
//       province: { type: String },
//       postalCode: { type: String },
//     },
//     accountStatus: {
//       type: String,
//       enum: ["pending", "verified", "suspended"],
//       default: "pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     phone: {
//       type: String,
//       trim: true,
//     },
//     role: {
//       type: String,
//       enum: ["admin", "pharmacist", "staff", "customer"],
//       default: "customer",
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     otp: {
//       type: String,
//     },
//     otpExpiry: {
//       type: Date,
//     },

//     // ---------- NEW CUSTOMER FIELDS ----------
//     allergies: {
//       type: [String],
//       default: [],
//     },
//     notes: {
//       type: String,
//       trim: true,
//     },
//     loyaltyPoints: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     preferredContact: {
//       type: String,
//       enum: ["email", "sms", "phone", "none"],
//       default: "email",
//     },
//     lastPurchaseDate: {
//       type: Date,
//     },
//     totalSpent: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     prescriptionCount: {
//       type: Number,
//       default: 0,
//     },

//     profilePhoto: { type: String }, // URL/path to uploaded photo

//     address: {
//       street: { type: String },
//       city: { type: String },
//       province: { type: String },
//       postalCode: { type: String },
//     },
//     accountStatus: {
//       type: String,
//       enum: ["pending", "verified", "suspended"],
//       default: "pending",
//     },

//     // ---------- [ADDED] Fix for StrictPopulateError ----------
//     savedMedicines: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Medicine",
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: { type: String, required: true },
//     role: {
//       type: String,
//       enum: ["admin", "pharmacist", "staff", "customer"],
//       default: "customer",
//     },

//     // Personal Info
//     phone: { type: String, trim: true },
//     gender: { type: String, enum: ["Male", "Female", "Other", ""] },
//     dob: { type: Date },
//     address: {
//       street: String,
//       city: String,
//       province: String,
//       postalCode: String,
//     },

//     // Medical Info (New Fields)
//     bloodGroup: { type: String, default: "" },
//     allergies: { type: String, default: "" }, // Storing as comma-separated string or you can use [String]
//     chronicConditions: { type: String, default: "" },
//     emergencyContact: { type: String, default: "" },

//     profilePhoto: { type: String, default: "" },
//     accountStatus: { type: String, default: "active" }, // active, verified, etc.

//     // Links
//     savedMedicines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Medicine" }],
//   },
//   { timestamps: true }
// );

// // ... (Keep your existing password hashing middleware here) ...
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     // --- Core Identity ---
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     role: {
//       type: String,
//       enum: ["admin", "pharmacist", "staff", "customer"],
//       default: "customer",
//     },

//     // --- Personal Information (Updated) ---
//     phone: {
//       type: String,
//       trim: true,
//     },
//     gender: {
//       type: String,
//       enum: ["Male", "Female", "Other", ""],
//     },
//     dob: {
//       type: Date,
//     },
//     address: {
//       street: { type: String },
//       city: { type: String },
//       province: { type: String },
//       postalCode: { type: String },
//     },
//     profilePhoto: {
//       type: String,
//       default: "", // Stores URL path to uploaded photo
//     },

//     // --- Account Verification & Security (Preserved) ---
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     otp: {
//       type: String,
//     },
//     otpExpiry: {
//       type: Date,
//     },
//     accountStatus: {
//       type: String,
//       enum: ["pending", "verified", "suspended", "active"],
//       default: "active",
//     },

//     // --- Medical Info (New Fields for Profile Page) ---
//     bloodGroup: {
//       type: String,
//       default: "",
//     },
//     allergies: {
//       type: String, // Stored as string to match Profile Page input
//       default: "",
//     },
//     chronicConditions: {
//       type: String,
//       default: "",
//     },
//     emergencyContact: {
//       type: String,
//       default: "",
//     },

//     // --- Customer Stats & Loyalty (Preserved) ---
//     notes: {
//       type: String,
//       trim: true,
//     },
//     loyaltyPoints: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     preferredContact: {
//       type: String,
//       enum: ["email", "sms", "phone", "none"],
//       default: "email",
//     },
//     lastPurchaseDate: {
//       type: Date,
//     },
//     totalSpent: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     prescriptionCount: {
//       type: Number,
//       default: 0,
//     },

//     // --- Relations ---
//     savedMedicines: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Medicine",
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Compare password method
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     // --- Core Identity ---
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     // Optional: Username (used in your authController)
//     username: {
//       type: String,
//       trim: true,
//       unique: true,
//       sparse: true, // Allows multiple null values if user only registers with email
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     role: {
//       type: String,
//       enum: ["admin", "pharmacist", "staff", "customer"],
//       default: "customer",
//     },

//     // ✅ Backward Compatibility for Admin Middleware
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },

//     // --- Personal Information ---
//     phone: {
//       type: String,
//       trim: true,
//     },
//     gender: {
//       type: String,
//       enum: ["Male", "Female", "Other", ""],
//       default: "",
//     },
//     dob: {
//       type: Date,
//     },
//     address: {
//       street: { type: String, default: "" },
//       city: { type: String, default: "" },
//       province: { type: String, default: "" },
//       postalCode: { type: String, default: "" },
//     },
//     profilePhoto: {
//       type: String,
//       default: "", // Stores URL path
//     },

//     // --- Security & Auth (Linked to authController) ---
//     isActive: {
//       type: Boolean,
//       default: true, // Used for Soft Delete
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },

//     // Email OTP Login Codes
//     loginCode: { type: String },
//     loginCodeExpires: { type: Date },

//     // Password Reset Codes
//     resetPasswordCode: { type: String },
//     resetPasswordExpires: { type: Date },

//     // --- Medical Info (Profile Page) ---
//     bloodGroup: { type: String, default: "" },
//     allergies: { type: String, default: "" },
//     chronicConditions: { type: String, default: "" },
//     emergencyContact: { type: String, default: "" },

//     // --- Customer Loyalty & Stats ---
//     notes: { type: String, trim: true },
//     loyaltyPoints: { type: Number, default: 0, min: 0 },

//     preferredContact: {
//       type: String,
//       enum: ["email", "sms", "phone", "none"],
//       default: "email",
//     },

//     lastPurchaseDate: { type: Date },
//     totalSpent: { type: Number, default: 0, min: 0 },
//     prescriptionCount: { type: Number, default: 0 },

//     // --- Relations ---
//     savedMedicines: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Medicine",
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// // -------------------------------------------------------------------
// // ✅ MIDDLEWARE & METHODS
// // -------------------------------------------------------------------

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);

//   // Sync isAdmin flag with role (Optional convenience)
//   if (this.role === "admin") {
//     this.isAdmin = true;
//   }

//   next();
// });

// // Compare password method
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // Virtual field for "fullName" (maps to 'name' for controller compatibility)
// userSchema
//   .virtual("fullName")
//   .get(function () {
//     return this.name;
//   })
//   .set(function (v) {
//     this.name = v;
//   });

// module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     // --- Core Identity ---
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     // Optional: Username (used in your authController)
//     username: {
//       type: String,
//       trim: true,
//       unique: true,
//       sparse: true, // Allows multiple null values if user only registers with email
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     role: {
//       type: String,
//       enum: ["admin", "pharmacist", "staff", "customer"],
//       default: "customer",
//     },

//     // ✅ Backward Compatibility for Admin Middleware
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },

//     // --- Personal Information ---
//     phone: {
//       type: String,
//       trim: true,
//       // ✅ Added unique constraint to prevent duplicate phone registrations
//       sparse: true,
//     },
//     gender: {
//       type: String,
//       enum: ["Male", "Female", "Other", ""],
//       default: "",
//     },
//     dob: {
//       type: Date,
//     },
//     address: {
//       street: { type: String, default: "" },
//       city: { type: String, default: "" },
//       province: { type: String, default: "" },
//       postalCode: { type: String, default: "" },
//     },
//     profilePhoto: {
//       type: String,
//       default: "", // Stores URL path
//     },

//     // --- Security & Auth (Linked to authController) ---
//     isActive: {
//       type: Boolean,
//       default: true, // Used for Soft Delete
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },

//     // Email OTP Login Codes
//     loginCode: { type: String },
//     loginCodeExpires: { type: Date },

//     // Password Reset Codes
//     resetPasswordCode: { type: String },
//     resetPasswordExpires: { type: Date },

//     // --- Medical Info (Profile Page) ---
//     bloodGroup: { type: String, default: "" },
//     allergies: { type: String, default: "" },
//     chronicConditions: { type: String, default: "" },
//     emergencyContact: { type: String, default: "" },

//     // --- Customer Loyalty & Stats ---
//     notes: { type: String, trim: true },
//     loyaltyPoints: { type: Number, default: 0, min: 0 },

//     preferredContact: {
//       type: String,
//       enum: ["email", "sms", "phone", "none"],
//       default: "email",
//     },

//     lastPurchaseDate: { type: Date },
//     totalSpent: { type: Number, default: 0, min: 0 },
//     prescriptionCount: { type: Number, default: 0 },

//     // --- Relations ---
//     savedMedicines: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Medicine",
//       },
//     ],
//   },
//   {
//     timestamps: true,
//     // Ensure virtuals are included in JSON output
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // -------------------------------------------------------------------
// // ✅ MIDDLEWARE & METHODS
// // -------------------------------------------------------------------

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   // Hash password only if modified
//   if (this.isModified("password")) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }

//   // ✅ Force Sync isAdmin flag with role
//   // This ensures that if role is "admin", isAdmin is ALWAYS true
//   if (this.isModified("role") || this.isNew) {
//     this.isAdmin = this.role === "admin";
//   }

//   next();
// });

// // Compare password method
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // Virtual field for "fullName" (maps to 'name' for controller compatibility)
// userSchema
//   .virtual("fullName")
//   .get(function () {
//     return this.name;
//   })
//   .set(function (v) {
//     this.name = v;
//   });

// module.exports = mongoose.model("User", userSchema);

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
    // Optional: Username (used in your authController)
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allows multiple null values if user only registers with email
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
      enum: ["admin", "pharmacist", "staff", "customer"],
      default: "customer",
    },

    // ✅ Backward Compatibility for Admin Middleware
    isAdmin: {
      type: Boolean,
      default: false,
    },

    // --- Personal Information ---
    phone: {
      type: String,
      trim: true,
      // ✅ Added unique constraint to prevent duplicate phone registrations
      sparse: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    dob: {
      type: Date,
    },
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

    // --- Security & Auth (Linked to authController) ---
    isActive: {
      type: Boolean,
      default: true, // Used for Soft Delete
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // ✅ UPDATED: Standardized OTP Fields
    // Replaces 'loginCode' to work with new authRoutes.js logic
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
    savedMedicines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
    ],
  },
  {
    timestamps: true,
    // Ensure virtuals are included in JSON output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// -------------------------------------------------------------------
// ✅ MIDDLEWARE & METHODS
// -------------------------------------------------------------------

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Hash password only if modified
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // ✅ Force Sync isAdmin flag with role
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
