// const mongoose = require("mongoose");

// const PrescriptionSchema = new mongoose.Schema(
//   {
//     // Patient (customer) who owns this prescription
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     customerName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     customerEmail: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//     },

//     // Prescribing doctor (optional if uploaded by customer)
//     doctor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Doctor",
//     },

//     // Optional link to appointment
//     appointment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Appointment",
//     },

//     // Structured medicine list (when pharmacist/admin enters it)
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

//     // Uploaded prescription image (if customer uploads photo)
//     imageFilename: {
//       type: String, // ✅ Changed from imageUrl
//     }, // path or URL

//     status: {
//       type: String,
//       enum: ["pending", "reviewed", "approved", "rejected", "dispensed"],
//       default: "pending",
//     },

//     notes: {
//       type: String,
//       trim: true,
//     }, // Pharmacist / doctor notes
//   },
//   { timestamps: true }
// );

// // Prevent OverwriteModelError by checking if model exists
// const Prescription =
//   mongoose.models.Prescription ||
//   mongoose.model("Prescription", PrescriptionSchema);

// module.exports = Prescription;

// models/prescription.model.js
// const mongoose = require("mongoose");

// const prescriptionSchema = new mongoose.Schema(
//   {
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     customerName: {
//       type: String,
//       required: true,
//     },
//     customerEmail: {
//       type: String,
//       required: true,
//     },
//     imageFilename: {
//       // ✅ CHANGED from imageUrl
//       type: String,
//       required: true,
//     },
//     notes: {
//       type: String,
//       default: "",
//     },
//     status: {
//       type: String,
//       enum: ["pending", "reviewed", "approved", "rejected", "dispensed"],
//       default: "pending",
//     },
//     doctor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Prescription", prescriptionSchema);

// const mongoose = require("mongoose");

// const PrescriptionSchema = new mongoose.Schema(
//   {
//     // Patient (customer) who owns this prescription
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     customerName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     customerEmail: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//     },

//     // Prescribing doctor (optional if uploaded by customer)
//     doctor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Doctor",
//     },

//     // Optional link to appointment
//     appointment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Appointment",
//     },

//     // Structured medicine list (when pharmacist/admin enters it)
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

//     // Uploaded prescription image (if customer uploads photo)
//     imageFilename: {
//       type: String,
//       required: true, // ✅ REQUIRED to match your route validation
//     }, // filename stored in uploads/prescriptions/

//     status: {
//       type: String,
//       enum: ["pending", "reviewed", "approved", "rejected", "dispensed"],
//       default: "pending",
//     },

//     notes: {
//       type: String,
//       trim: true,
//     }, // Pharmacist / doctor notes
//   },
//   { timestamps: true }
// );

// // Prevent OverwriteModelError by checking if model exists
// const Prescription =
//   mongoose.models.Prescription ||
//   mongoose.model("Prescription", PrescriptionSchema);

// module.exports = Prescription;

const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema(
  {
    // Patient (customer) who owns this prescription
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Prescribing doctor (optional if uploaded by customer)
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },

    // Optional link to appointment
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    // Structured medicine list (when pharmacist/admin enters it)
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

    // Uploaded prescription image (if customer uploads photo)
    imageFilename: {
      type: String,
      required: true, // ✅ REQUIRED to match your route validation
    }, // filename stored in uploads/prescriptions/

    status: {
      type: String,
      enum: ["pending", "reviewed", "approved", "rejected", "dispensed"],
      default: "pending",
    },

    notes: {
      type: String,
      trim: true,
    }, // Pharmacist / doctor notes
  },
  { timestamps: true }
);

// ✅ FIXED: Single export - NO duplicate const declaration
module.exports =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema);
