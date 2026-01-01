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

    // --- Personal Information (Updated) ---
    phone: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
    },
    dob: {
      type: Date,
    },
    address: {
      street: { type: String },
      city: { type: String },
      province: { type: String },
      postalCode: { type: String },
    },
    profilePhoto: {
      type: String,
      default: "", // Stores URL path to uploaded photo
    },

    // --- Account Verification & Security (Preserved) ---
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
    accountStatus: {
      type: String,
      enum: ["pending", "verified", "suspended", "active"],
      default: "active",
    },

    // --- Medical Info (New Fields for Profile Page) ---
    bloodGroup: {
      type: String,
      default: "",
    },
    allergies: {
      type: String, // Stored as string to match Profile Page input
      default: "",
    },
    chronicConditions: {
      type: String,
      default: "",
    },
    emergencyContact: {
      type: String,
      default: "",
    },

    // --- Customer Stats & Loyalty (Preserved) ---
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
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
