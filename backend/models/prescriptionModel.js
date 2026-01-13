// // backend/models/Prescription.js
// const mongoose = require("mongoose");

// const PrescriptionSchema = new mongoose.Schema(
//   {
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     customerName: { type: String, required: true },
//     customerEmail: { type: String, required: true },

//     imageUrl: { type: String, required: true }, // for now store a URL/path
//     status: {
//       type: String,
//       enum: ["pending", "reviewed", "dispensed"],
//       default: "pending",
//     },
//     notes: { type: String },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Prescription", PrescriptionSchema);

// backend/models/Prescription.js
// const mongoose = require("mongoose");

// const PrescriptionSchema = new mongoose.Schema(
//   {
//     // patient (customer) who owns this prescription
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     customerName: { type: String, required: true, trim: true },
//     customerEmail: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//     },

//     // prescribing doctor (optional if uploaded by customer)
//     doctor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Doctor",
//     },

//     // optional link to appointment
//     appointment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Appointment",
//     },

//     // structured medicine list (when pharmacist/admin enters it)
//     items: [
//       {
//         medicine: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Medicine",
//         },
//         customName: {
//           type: String,
//           trim: true,
//         }, // if medicine not yet in DB
//         dosageInstructions: {
//           type: String,
//           trim: true,
//         }, // e.g. 1-0-1 after food
//         durationDays: {
//           type: Number,
//           min: 1,
//         },
//         quantity: {
//           type: Number,
//           min: 1,
//         },
//       },
//     ],

//     // uploaded prescription image (if customer uploads photo)
//     imageUrl: { type: String }, // optional now, path or URL

//     status: {
//       type: String,
//       enum: ["pending", "reviewed", "approved", "rejected", "dispensed"],
//       default: "pending",
//     },

//     notes: { type: String, trim: true }, // pharmacist / doctor notes
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Prescription", PrescriptionSchema);

// // backend/models/Prescription.js
// const mongoose = require("mongoose");

// const PrescriptionSchema = new mongoose.Schema(
//   {
//     // patient (customer) who owns this prescription
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     customerName: { type: String, required: true, trim: true },
//     customerEmail: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//     },

//     // prescribing doctor (optional if uploaded by customer)
//     doctor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Doctor",
//       default: null,
//     },

//     // optional link to appointment
//     appointment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Appointment",
//       default: null,
//     },

//     // structured medicine list (when pharmacist/admin enters it)
//     items: [
//       {
//         medicine: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Medicine",
//         },
//         customName: {
//           type: String,
//           trim: true,
//         }, // if medicine not yet in DB
//         dosageInstructions: {
//           type: String,
//           trim: true,
//         }, // e.g. 1-0-1 after food
//         durationDays: {
//           type: Number,
//           min: 1,
//         },
//         quantity: {
//           type: Number,
//           min: 1,
//         },
//       },
//     ],

//     // uploaded prescription image (required for customer uploads)
//     imageUrl: {
//       type: String,
//       required: true, // for photo-based prescriptions
//       trim: true,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "reviewed", "approved", "rejected", "dispensed"],
//       default: "pending",
//     },

//     notes: { type: String, trim: true }, // pharmacist / doctor notes
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Prescription", PrescriptionSchema);

// // backend/models/Prescription.js
// const mongoose = require("mongoose");

// const PrescriptionSchema = new mongoose.Schema(
//   {
//     // patient (customer) who owns this prescription
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     customerName: { type: String, required: true, trim: true },
//     customerEmail: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//     },

//     // prescribing doctor (optional if uploaded by customer)
//     doctor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Doctor",
//       default: null,
//     },

//     // optional link to appointment
//     appointment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Appointment",
//       default: null,
//     },

//     // structured medicine list (when pharmacist/admin enters it)
//     items: [
//       {
//         medicine: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Medicine",
//         },
//         customName: {
//           type: String,
//           trim: true,
//         }, // if medicine not yet in DB
//         dosageInstructions: {
//           type: String,
//           trim: true,
//         }, // e.g. 1-0-1 after food
//         durationDays: {
//           type: Number,
//           min: 1,
//         },
//         quantity: {
//           type: Number,
//           min: 1,
//         },
//       },
//     ],

//     // uploaded prescription image (filename only)
//     // Changed from 'imageUrl' to 'imageFilename' to match your Route logic
//     imageFilename: {
//       type: String,
//       required: true, // for photo-based prescriptions
//       trim: true,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "reviewed", "approved", "rejected", "dispensed"],
//       default: "pending",
//     },

//     notes: { type: String, trim: true }, // pharmacist / doctor notes
//   },
//   { timestamps: true }
// );

// // Check if model exists before defining to prevent OverwriteModelError
// module.exports =
//   mongoose.models.Prescription ||
//   mongoose.model("Prescription", PrescriptionSchema);

// const mongoose = require("mongoose");

// const PrescriptionSchema = new mongoose.Schema(
//   {
//     // --- UPDATED: User Reference ---
//     // Changed from 'customer' to 'user' to match authMiddleware (req.user._id)
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // --- PRESERVED: Snapshot Data ---
//     // Kept these fields if you want to store snapshot data at time of upload
//     // Made optional since we can populate from 'user' now
//     customerName: { type: String, trim: true },
//     customerEmail: {
//       type: String,
//       trim: true,
//       lowercase: true,
//     },

//     // --- PRESERVED: Doctor/Appointment Logic ---
//     doctor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Doctor",
//       default: null,
//     },

//     appointment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Appointment",
//       default: null,
//     },

//     // --- PRESERVED: Structured Medicine List ---
//     items: [
//       {
//         medicine: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Medicine",
//         },
//         customName: {
//           type: String,
//           trim: true,
//         },
//         dosageInstructions: {
//           type: String,
//           trim: true,
//         },
//         durationDays: {
//           type: Number,
//           min: 1,
//         },
//         quantity: {
//           type: Number,
//           min: 1,
//         },
//       },
//     ],

//     // --- UPDATED: Image Field ---
//     // Changed 'imageFilename' to 'image' to hold the Full Path/URL
//     // This matches the frontend <img src={rx.image} />
//     image: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // --- UPDATED: Status Enum ---
//     // Added Title Case ("Approved", "Rejected") to match Pharmacist Dashboard Actions
//     status: {
//       type: String,
//       enum: [
//         "Pending",
//         "Approved",
//         "Rejected", // New Dashboard Logic
//         "pending",
//         "reviewed",
//         "approved",
//         "rejected",
//         "dispensed", // Legacy Logic
//       ],
//       default: "Pending",
//     },

//     // --- PRESERVED: Notes ---
//     notes: { type: String, trim: true },
//   },
//   { timestamps: true }
// );

// module.exports =
//   mongoose.models.Prescription ||
//   mongoose.model("Prescription", PrescriptionSchema);

// const mongoose = require("mongoose");

// const PrescriptionSchema = new mongoose.Schema(
//   {
//     // ✅ CORRECT: Matches req.user._id from authMiddleware
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // Optional snapshot fields
//     customerName: { type: String, trim: true },
//     customerEmail: {
//       type: String,
//       trim: true,
//       lowercase: true,
//     },

//     // Doctor/Appointment links
//     doctor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Doctor",
//       default: null,
//     },

//     appointment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Appointment",
//       default: null,
//     },

//     // Medicine list
//     items: [
//       {
//         medicine: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Medicine",
//         },
//         customName: { type: String, trim: true },
//         dosageInstructions: { type: String, trim: true },
//         durationDays: { type: Number, min: 1 },
//         quantity: { type: Number, min: 1 },
//       },
//     ],

//     // ✅ CORRECT: Changed 'imageFilename' to 'image' for consistency
//     image: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // ✅ CORRECT: Added Title Case enums for Dashboard compatibility
//     status: {
//       type: String,
//       enum: [
//         "Pending",
//         "Approved",
//         "Rejected",
//         "pending",
//         "reviewed",
//         "approved",
//         "rejected",
//         "dispensed",
//       ],
//       default: "Pending",
//     },

//     notes: { type: String, trim: true },
//   },
//   { timestamps: true }
// );

// module.exports =
//   mongoose.models.Prescription ||
//   mongoose.model("Prescription", PrescriptionSchema);

const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema(
  {
    // ✅ Patient Reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Snapshot fields (Useful for easy display without extra queries)
    customerName: { type: String, trim: true },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // ✅ Doctor Integration (Optional)
    // If created via "Doctor Appointment" flow
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },

    // ✅ Digital Prescription Items
    // (Populated if a doctor creates it digitally, empty if user uploads an image)
    items: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
        },
        customName: { type: String, trim: true }, // e.g. "Paracetamol" if ID not linked
        dosageInstructions: { type: String, trim: true }, // "1-0-1 after food"
        durationDays: { type: Number, min: 1 },
        quantity: { type: Number, min: 1 },
      },
    ],

    // ✅ Prescription Image URL
    // Required for customer uploads, optional for digital prescriptions
    imageUrl: {
      type: String,
      trim: true,
      // Custom validator: Image is required ONLY if items array is empty
      validate: {
        validator: function (v) {
          if (this.items && this.items.length > 0) return true; // Has digital items, image optional
          return v && v.length > 0; // No items, so must have image
        },
        message: "Prescription must have either an image or medicine items.",
      },
    },

    // ✅ Standardized Status (Title Case)
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Approved", "Rejected", "Dispensed"],
      default: "Pending",
      index: true,
    },

    // Pharmacist/Doctor comments
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

// -------------------------------------------------------------------
// ✅ INDEXES
// -------------------------------------------------------------------

// 1. Pharmacist Dashboard: Filter by status (e.g., Show all 'Pending')
PrescriptionSchema.index({ status: 1, createdAt: -1 });

// 2. Doctor Dashboard: Find prescriptions by doctor
PrescriptionSchema.index({ doctor: 1 });

// -------------------------------------------------------------------
// ✅ VIRTUALS
// -------------------------------------------------------------------

// Helper to check if this is a digital prescription or scanned image
PrescriptionSchema.virtual("type").get(function () {
  return this.items && this.items.length > 0 ? "Digital" : "Scanned";
});

// Alias 'image' to 'imageUrl' for backward compatibility with frontend
PrescriptionSchema.virtual("image").get(function () {
  return this.imageUrl;
});

// Ensure virtuals are included in JSON output
PrescriptionSchema.set("toJSON", { virtuals: true });
PrescriptionSchema.set("toObject", { virtuals: true });

module.exports =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema);
