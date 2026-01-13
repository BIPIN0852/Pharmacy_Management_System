// const mongoose = require("mongoose");

// const appointmentSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     doctor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Doctor",
//       required: true,
//     },
//     day: { type: String, required: true, uppercase: true }, // e.g., MONDAY
//     date: { type: Date, required: true }, // The specific calendar date
//     timeSlot: { type: String, required: true }, // e.g., "09:00 - 10:00"
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "completed", "cancelled"],
//       default: "pending",
//     },
//     bookingReference: { type: String, unique: true },
//     notes: String,
//     customerDetails: {
//       name: String,
//       phone: String,
//       email: String,
//     },
//   },
//   { timestamps: true }
// );

// // ✅ Prevent a single customer from booking the same slot twice
// appointmentSchema.index(
//   { user: 1, doctor: 1, date: 1, timeSlot: 1 },
//   { unique: true }
// );

// module.exports = mongoose.model("Appointment", appointmentSchema);

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    day: {
      type: String,
      required: true,
      uppercase: true,
    }, // e.g., MONDAY
    date: {
      type: Date,
      required: true,
    }, // The specific calendar date
    timeSlot: {
      type: String,
      required: true,
    }, // e.g., "09:00 - 10:00"
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    bookingReference: {
      type: String,
      unique: true,
      sparse: true, // Allows legacy data without references to coexist
    },
    notes: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    customerDetails: {
      name: String,
      phone: String,
      email: String,
    },
    // ✅ Added: Track who cancelled or completed the appointment
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// -------------------------------------------------------------------
// 🛠️ INDEXES & LOGIC
// -------------------------------------------------------------------

// ✅ Prevent a single customer from booking the same slot twice
// This is the primary guard against double-bookings in the database
appointmentSchema.index(
  { user: 1, doctor: 1, date: 1, timeSlot: 1 },
  { unique: true }
);

// ✅ Performance Index: Helps the Admin Dashboard load "Today's" list faster
appointmentSchema.index({ date: 1, status: 1 });

/**
 * ✅ Pre-save Middleware
 * Ensures the 'day' string matches the actual calendar 'date' day name
 */
appointmentSchema.pre("save", function (next) {
  if (this.isModified("date")) {
    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const dayName = days[this.date.getDay()];
    this.day = dayName;
  }
  next();
});

/**
 * ✅ Virtual Field: isExpired
 * Automatically tells the frontend if an appointment date has already passed
 */
appointmentSchema.virtual("isExpired").get(function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return this.date < today && this.status === "pending";
});

module.exports = mongoose.model("Appointment", appointmentSchema);
