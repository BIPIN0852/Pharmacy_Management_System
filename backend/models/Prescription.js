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

// backend/models/Prescription.js
const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema(
  {
    // patient (customer) who owns this prescription
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerName: { type: String, required: true, trim: true },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // prescribing doctor (optional if uploaded by customer)
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },

    // optional link to appointment
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },

    // structured medicine list (when pharmacist/admin enters it)
    items: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
        },
        customName: {
          type: String,
          trim: true,
        }, // if medicine not yet in DB
        dosageInstructions: {
          type: String,
          trim: true,
        }, // e.g. 1-0-1 after food
        durationDays: {
          type: Number,
          min: 1,
        },
        quantity: {
          type: Number,
          min: 1,
        },
      },
    ],

    // uploaded prescription image (filename only)
    // Changed from 'imageUrl' to 'imageFilename' to match your Route logic
    imageFilename: {
      type: String,
      required: true, // for photo-based prescriptions
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "approved", "rejected", "dispensed"],
      default: "pending",
    },

    notes: { type: String, trim: true }, // pharmacist / doctor notes
  },
  { timestamps: true }
);

// Check if model exists before defining to prevent OverwriteModelError
module.exports =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema);
