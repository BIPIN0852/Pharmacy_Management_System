// const mongoose = require("mongoose");

// const appointmentSchema = new mongoose.Schema(
//   {
//     doctor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Doctor",
//       required: true,
//     },
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     date: {
//       type: Date,
//       required: true,
//     },
//     timeSlot: {
//       type: String,
//       enum: [
//         "09:00-10:00",
//         "10:00-11:00",
//         "11:00-12:00",
//         "14:00-15:00",
//         "15:00-16:00",
//         "16:00-17:00",
//       ],
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "completed", "cancelled"],
//       default: "pending",
//     },
//     notes: {
//       type: String,
//       trim: true,
//     },
//     prescriptionId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Prescription",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Index for efficient queries
// appointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1 });
// appointmentSchema.index({ customer: 1, date: -1 });

// module.exports = mongoose.model("Appointment", appointmentSchema);

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      // ✅ REMOVED hardcoded enum - now accepts ANY valid doctor time slot
      match: /^(\d{2}:\d{2})-(\d{2}:\d{2})$/, // Validates "HH:MM-HH:MM" format
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
    customerDetails: {
      name: String,
      phone: String,
      age: String,
      address: String,
      province: String,
    }, // ✅ Added for customer booking form data
  },
  {
    timestamps: true,
  }
);

// ✅ COMPOUND INDEXES for efficient double-booking prevention
appointmentSchema.index(
  {
    doctor: 1,
    date: 1,
    timeSlot: 1,
  },
  { unique: true }
); // Prevents double booking same doctor + date + slot

appointmentSchema.index({ customer: 1, date: -1 });
appointmentSchema.index({ doctor: 1, status: 1 });
appointmentSchema.index({ date: 1, status: 1 }); // For upcoming appointments

// ✅ Pre-save middleware to normalize date (remove time portion)
appointmentSchema.pre("save", function (next) {
  if (this.date) {
    // Ensure date is date-only (no time)
    this.date = new Date(this.date.setHours(0, 0, 0, 0));
  }
  next();
});

// ✅ Query helper: Find conflicting appointments
appointmentSchema.statics.findConflict = async function (
  doctor,
  date,
  timeSlot
) {
  return this.findOne({
    doctor,
    date: new Date(date.setHours(0, 0, 0, 0)),
    timeSlot,
    status: { $ne: "cancelled" },
  });
};

module.exports = mongoose.model("Appointment", appointmentSchema);
