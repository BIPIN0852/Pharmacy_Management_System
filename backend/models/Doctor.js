// const mongoose = require("mongoose");

// const DoctorSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },

//     // main specialization, e.g. "General Physician", "Cardiologist"
//     speciality: { type: String, required: true, trim: true },

//     // NMC registration number (unique per doctor)
//     nmcNumber: { type: String, required: true, unique: true, trim: true },

//     // optional contact fields
//     email: { type: String, lowercase: true, trim: true },
//     phone: { type: String, trim: true },

//     // link to User account if doctors also log in (optional)
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//     // availability status for appointments
//     isAvailable: { type: Boolean, default: true },

//     // brief bio / description
//     bio: { type: String, trim: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Doctor", DoctorSchema);

// const mongoose = require("mongoose");

// const DoctorSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },

//     // main specialization, e.g. "General Physician", "Cardiologist"
//     speciality: { type: String, required: true, trim: true },

//     // NMC registration number (unique per doctor)
//     nmcNumber: { type: String, required: true, unique: true, trim: true },

//     // optional contact fields
//     email: { type: String, lowercase: true, trim: true },
//     phone: { type: String, trim: true },

//     // link to User account if doctors also log in (optional)
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//     // availability status for appointments
//     isAvailable: { type: Boolean, default: true },

//     // ✅ NEW: available appointment time slots (e.g. "09:00-10:00")
//     timeSlots: [
//       {
//         type: String,
//         trim: true,
//       },
//     ],

//     // brief bio / description
//     bio: { type: String, trim: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Doctor", DoctorSchema);

// const mongoose = require("mongoose");

// // Slot sub-schema: specific date + time range
// const SlotSchema = new mongoose.Schema(
//   {
//     date: {
//       type: Date,
//       required: true, // calendar day for the slot
//     },
//     startTime: {
//       type: String, // "09:00"
//       required: true,
//       trim: true,
//     },
//     endTime: {
//       type: String, // "09:30"
//       required: true,
//       trim: true,
//     },
//     isBooked: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { _id: true }
// );

// const DoctorSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },

//     // main specialization, e.g. "General Physician", "Cardiologist"
//     speciality: { type: String, required: true, trim: true },

//     // NMC registration number (unique per doctor)
//     nmcNumber: { type: String, required: true, unique: true, trim: true },

//     // optional contact fields
//     email: { type: String, lowercase: true, trim: true },
//     phone: { type: String, trim: true },

//     // link to User account if doctors also log in (optional)
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//     // availability status for appointments
//     isAvailable: { type: Boolean, default: true },

//     // ✅ available appointment slots with date + time
//     slots: [SlotSchema],

//     // brief bio / description
//     bio: { type: String, trim: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Doctor", DoctorSchema);

// const mongoose = require("mongoose");

// // Regex for 24-hour HH:MM format
// const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// // Slot sub-schema: specific date + time range
// const SlotSchema = new mongoose.Schema(
//   {
//     date: {
//       type: Date,
//       required: true, // calendar day for the slot
//     },
//     startTime: {
//       type: String, // "09:00"
//       required: true,
//       trim: true,
//       match: [timeRegex, "Invalid start time (use HH:MM 24-hour format)"],
//     },
//     endTime: {
//       type: String, // "09:30"
//       required: true,
//       trim: true,
//       match: [timeRegex, "Invalid end time (use HH:MM 24-hour format)"],
//     },
//     isBooked: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { _id: true }
// );

// const DoctorSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },

//     // main specialization, e.g. "General Physician", "Cardiologist"
//     speciality: { type: String, required: true, trim: true },

//     // NMC registration number (unique per doctor)
//     nmcNumber: { type: String, required: true, unique: true, trim: true },

//     // optional contact fields
//     email: { type: String, lowercase: true, trim: true },
//     phone: { type: String, trim: true },

//     // link to User account if doctors also log in (optional)
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//     // availability status for appointments
//     isAvailable: { type: Boolean, default: true },

//     // available appointment slots with date + time
//     slots: [SlotSchema],

//     // brief bio / description
//     bio: { type: String, trim: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Doctor", DoctorSchema);

// const mongoose = require("mongoose");

// // Regex for 24-hour HH:MM format
// const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// // Slot sub-schema: specific day + time range
// const SlotSchema = new mongoose.Schema(
//   {
//     // ✅ CHANGED: Replaced 'date' with 'day'
//     day: {
//       type: String, // Changed to String to support days like "Monday" or date strings
//       required: true,
//       trim: true,
//     },
//     startTime: {
//       type: String, // "09:00"
//       required: true,
//       trim: true,
//       match: [timeRegex, "Invalid start time (use HH:MM 24-hour format)"],
//     },
//     endTime: {
//       type: String, // "09:30"
//       required: true,
//       trim: true,
//       match: [timeRegex, "Invalid end time (use HH:MM 24-hour format)"],
//     },
//     isBooked: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { _id: true }
// );

// const DoctorSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },

//     // main specialization, e.g. "General Physician", "Cardiologist"
//     speciality: { type: String, required: true, trim: true },

//     // NMC registration number (unique per doctor)
//     nmcNumber: { type: String, required: true, unique: true, trim: true },

//     // optional contact fields
//     email: { type: String, lowercase: true, trim: true },
//     phone: { type: String, trim: true },

//     // link to User account if doctors also log in (optional)
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//     // availability status for appointments
//     isAvailable: { type: Boolean, default: true },

//     // available appointment slots
//     slots: [SlotSchema],

//     // brief bio / description
//     bio: { type: String, trim: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Doctor", DoctorSchema);

// const mongoose = require("mongoose");

// // Regex for 24-hour HH:MM format
// const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// /**
//  * Slot Sub-schema: Represents a specific availability window
//  */
// const SlotSchema = new mongoose.Schema(
//   {
//     // Accepts "MONDAY", "TUESDAY" or specific date "2026-05-20"
//     day: {
//       type: String,
//       required: true,
//       trim: true,
//       uppercase: true,
//     },
//     startTime: {
//       type: String, // e.g., "09:00"
//       required: true,
//       trim: true,
//       match: [timeRegex, "Invalid start time format (HH:MM)"],
//     },
//     endTime: {
//       type: String, // e.g., "10:30"
//       required: true,
//       trim: true,
//       match: [timeRegex, "Invalid end time format (HH:MM)"],
//       validate: {
//         validator: function (v) {
//           // Only validate if startTime exists
//           return !this.startTime || v > this.startTime;
//         },
//         message: "End time ({VALUE}) must be after start time",
//       },
//     },
//     isBooked: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     _id: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // ✅ Virtual: Formats the time range for easy frontend display
// SlotSchema.virtual("timeRange").get(function () {
//   return `${this.startTime} - ${this.endTime}`;
// });

// /**
//  * Doctor Schema: Main profile and registration details
//  */
// const DoctorSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Doctor name is required"],
//       trim: true,
//     },

//     // e.g., "Cardiologist", "Neurologist"
//     speciality: {
//       type: String,
//       required: [true, "Specialization is required"],
//       trim: true,
//       index: true,
//     },

//     // NMC Registration Number (Unique verification ID)
//     nmcNumber: {
//       type: String,
//       required: [true, "NMC Registration number is required"],
//       unique: true,
//       trim: true,
//     },

//     // Contact Info
//     email: {
//       type: String,
//       lowercase: true,
//       trim: true,
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         "Invalid email format",
//       ],
//     },
//     phone: {
//       type: String,
//       trim: true,
//       required: [true, "Contact number is required"],
//     },

//     // Link to User account for login credentials
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },

//     // Profile Customization
//     image: { type: String, default: "/images/default-doctor.png" },
//     experience: { type: Number, default: 0 }, // Years
//     consultationFee: { type: Number, default: 500 },
//     bio: { type: String, trim: true, maxlength: 1000 },

//     // Status Toggles
//     isAvailable: {
//       type: Boolean,
//       default: true,
//       index: true,
//     },

//     // ✅ Dynamic Schedule Slots
//     slots: [SlotSchema],
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // ✅ Indexes for Search Functionality
// DoctorSchema.index({ name: "text", speciality: "text" });

// module.exports = mongoose.model("Doctor", DoctorSchema);

const mongoose = require("mongoose");

// Regex for 24-hour HH:MM format
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Slot Sub-schema: Represents a RECURRING weekly shift (Template)
 * Note: specific bookings are stored in the 'Appointment' collection.
 */
const SlotSchema = new mongoose.Schema(
  {
    // Accepts "MONDAY", "TUESDAY"
    day: {
      type: String,
      required: true,
      trim: true,
      uppercase: true, // ✅ Forces "MONDAY" consistency for dropdowns
    },
    startTime: {
      type: String, // e.g., "09:00"
      required: true,
      trim: true,
      match: [timeRegex, "Invalid start time format (HH:MM)"],
    },
    endTime: {
      type: String, // e.g., "10:30"
      required: true,
      trim: true,
      match: [timeRegex, "Invalid end time format (HH:MM)"],
      validate: {
        validator: function (v) {
          // Simple string comparison works for 24h format (e.g. "10:00" > "09:00")
          return !this.startTime || v > this.startTime;
        },
        message: "End time must be after start time",
      },
    },
  },
  {
    _id: false, // ✅ Set to false to treat slots as simple data objects, not sub-docs
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Virtual: Formats the time range for easy frontend display
SlotSchema.virtual("timeRange").get(function () {
  return `${this.startTime} - ${this.endTime}`;
});

/**
 * Doctor Schema: Main profile and registration details
 */
const DoctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },

    // e.g., "Cardiologist", "Neurologist"
    speciality: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
      index: true,
    },

    // NMC Registration Number (Unique verification ID)
    nmcNumber: {
      type: String,
      required: [true, "NMC Registration number is required"],
      unique: true,
      trim: true,
    },

    // Contact Info
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email format",
      ],
    },
    // ✅ REQUIRED: Fixes the "Contact number is required" frontend error
    phone: {
      type: String,
      trim: true,
      required: [true, "Contact number is required"],
    },

    // Link to User account for login credentials (optional if they have a login)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Profile Customization
    image: { type: String, default: "/images/sample-doctor.jpg" },
    experience: { type: Number, default: 0 }, // Years
    consultationFee: { type: Number, default: 500 },
    bio: { type: String, trim: true, maxlength: 1000 },

    // Status Toggles
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ✅ Dynamic Schedule Slots
    slots: [SlotSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Indexes for Search Functionality
DoctorSchema.index({ name: "text", speciality: "text" });

module.exports = mongoose.model("Doctor", DoctorSchema);
