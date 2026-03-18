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
