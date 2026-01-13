// const mongoose = require("mongoose");

// const FavouriteMedicineSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     medicine: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Medicine",
//       required: true,
//     },
//     medicineName: { type: String, required: true },
//     medicineImage: { type: String },
//     dosage: { type: String }, // "1 tablet daily"
//     lastRefillDate: { type: Date },
//     nextRefillDate: { type: Date },
//     reminderDays: { type: Number, default: 7 }, // Alert 7 days before
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("FavouriteMedicine", FavouriteMedicineSchema);

// const mongoose = require("mongoose");

// const FavouriteMedicineSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     medicine: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Medicine",
//       required: true,
//     },

//     // ✅ RENAMED: 'medicineName' -> 'name' (Matches Medicine model)
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // ✅ RENAMED: 'medicineImage' -> 'image' (Matches Medicine/Order models)
//     image: {
//       type: String,
//       default: "/images/sample.jpg",
//     },

//     dosage: { type: String, trim: true }, // e.g. "1 tablet daily"

//     lastRefillDate: { type: Date },
//     nextRefillDate: { type: Date },

//     reminderDays: { type: Number, default: 7 }, // Alert 7 days before next refill

//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// // ✅ COMPOUND INDEX: Prevents duplicate favorites for the same user
// FavouriteMedicineSchema.index({ user: 1, medicine: 1 }, { unique: true });

// module.exports = mongoose.model("FavouriteMedicine", FavouriteMedicineSchema);

const mongoose = require("mongoose");

const FavouriteMedicineSchema = new mongoose.Schema(
  {
    // Reference to the Patient
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Reference to the actual Medicine Stock Item
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },

    // Snapshot of Medicine Name (For display even if Medicine is deleted)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Snapshot of Image
    image: {
      type: String,
      default: "",
    },

    // User's specific notes (e.g., "Take after breakfast")
    dosage: {
      type: String,
      trim: true,
      default: "",
    },

    // Refill Tracking
    lastRefillDate: {
      type: Date,
    },
    nextRefillDate: {
      type: Date,
      // Validator: Next refill cannot be before last refill
      validate: {
        validator: function (v) {
          // Only validate if both dates exist
          return !this.lastRefillDate || !v || v > this.lastRefillDate;
        },
        message: "Next refill date must be after the last refill date",
      },
    },

    // How many days before next refill to send an alert?
    reminderDays: {
      type: Number,
      default: 3,
      min: 1,
      max: 30,
    },

    // Soft Delete / Toggle
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// -------------------------------------------------------------------
// ✅ INDEXES
// -------------------------------------------------------------------

// 1. Prevent Duplicates: A user can only favorite a specific medicine once
FavouriteMedicineSchema.index({ user: 1, medicine: 1 }, { unique: true });

// 2. Query optimization for the "Refill Reminder" job
FavouriteMedicineSchema.index({ nextRefillDate: 1, isActive: 1 });

// -------------------------------------------------------------------
// ✅ STATIC METHODS
// -------------------------------------------------------------------

// Find all medicines that need a refill within the next 'X' days
FavouriteMedicineSchema.statics.findDueRefills = function (days = 3) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  return this.find({
    isActive: true,
    nextRefillDate: {
      $gte: today,
      $lte: futureDate,
    },
  }).populate("user", "name email"); // Populate user to send email alerts
};

module.exports = mongoose.model("FavouriteMedicine", FavouriteMedicineSchema);
