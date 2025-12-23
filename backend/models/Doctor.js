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

const mongoose = require("mongoose");

// Slot sub-schema: specific date + time range
const SlotSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true, // calendar day for the slot
    },
    startTime: {
      type: String, // "09:00"
      required: true,
      trim: true,
    },
    endTime: {
      type: String, // "09:30"
      required: true,
      trim: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const DoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // main specialization, e.g. "General Physician", "Cardiologist"
    speciality: { type: String, required: true, trim: true },

    // NMC registration number (unique per doctor)
    nmcNumber: { type: String, required: true, unique: true, trim: true },

    // optional contact fields
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },

    // link to User account if doctors also log in (optional)
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // availability status for appointments
    isAvailable: { type: Boolean, default: true },

    // ✅ available appointment slots with date + time
    slots: [SlotSchema],

    // brief bio / description
    bio: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", DoctorSchema);
