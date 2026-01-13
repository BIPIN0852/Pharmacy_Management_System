const crypto = require("crypto");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const sendEmail = require("../utils/sendEmail"); // ✅ Ensure this utility exists

// -------------------------------------------------------------------
// ⚙️ CONFIGURATION
// -------------------------------------------------------------------
const SLOT_CAPACITY = 3; // Max patients per time slot

// -------------------------------------------------------------------
// 1. CREATE APPOINTMENT (Book with Capacity & Date Logic)
// -------------------------------------------------------------------
// @route   POST /api/appointments
// @access  Private (Customer)
const createAppointment = async (req, res) => {
  try {
    const { doctor, date, day, timeSlot, notes } = req.body;

    // 1. Basic Validation
    if (!doctor || !date || !timeSlot) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const doctorDoc = await Doctor.findById(doctor);
    if (!doctorDoc || !doctorDoc.isAvailable) {
      return res
        .status(400)
        .json({ message: "Doctor is currently unavailable." });
    }

    // 2. Normalize Date (Strip time component)
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    // 3. Prevent Double Booking (Same Patient, Same Slot)
    const existingBooking = await Appointment.findOne({
      user: req.user._id,
      doctor,
      date: bookingDate,
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "You already have an appointment booked for this time slot.",
      });
    }

    // 4. Check Slot Capacity (Prevent Overbooking)
    const currentCount = await Appointment.countDocuments({
      doctor,
      date: bookingDate,
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (currentCount >= SLOT_CAPACITY) {
      return res.status(400).json({
        message:
          "Sorry, this time slot is fully booked. Please choose another.",
      });
    }

    // 5. Generate Reference & Create Record
    const reference = `PH-${crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;

    const appointment = await Appointment.create({
      user: req.user._id,
      doctor,
      day: day.toUpperCase(),
      date: bookingDate,
      timeSlot,
      notes,
      bookingReference: reference,
      status: "pending",
      customerDetails: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || "N/A",
      },
    });

    // 6. Send Confirmation Email
    const emailMsg = `
      <h3>Appointment Confirmed</h3>
      <p>Dear ${req.user.name},</p>
      <p>Your appointment with <strong>Dr. ${
        doctorDoc.name
      }</strong> is confirmed.</p>
      <ul>
        <li><strong>Ref:</strong> ${reference}</li>
        <li><strong>Date:</strong> ${bookingDate.toDateString()}</li>
        <li><strong>Time:</strong> ${timeSlot}</li>
      </ul>
      <p>Please arrive 10 minutes early.</p>
    `;

    try {
      await sendEmail({
        email: req.user.email,
        subject: `Appointment Confirmed - ${reference}`,
        message: emailMsg,
      });
    } catch (emailErr) {
      console.error("Email failed to send:", emailErr.message);
    }

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Booking Controller Error:", error);
    res.status(500).json({ message: "Server error processing booking." });
  }
};

// -------------------------------------------------------------------
// 2. GET MY APPOINTMENTS (Customer)
// -------------------------------------------------------------------
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("doctor", "name speciality image")
      .sort({ date: 1 }); // Upcoming first

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments." });
  }
};

// -------------------------------------------------------------------
// 3. GET ALL APPOINTMENTS (Admin/Pharmacist Registry)
// -------------------------------------------------------------------
// @route   GET /api/appointments
// @access  Private (Admin/Pharmacist)
const getAppointments = async (req, res) => {
  try {
    const { date, status, doctor, day } = req.query;
    let query = {};

    // Filter by specific Date Range (Start of day to End of day)
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }
    // Fallback: Filter by Day name (e.g. "MONDAY") if no specific date
    else if (day) {
      query.day = day.toUpperCase();
    }

    if (status) query.status = status;
    if (doctor) query.doctor = doctor;

    const appointments = await Appointment.find(query)
      .populate("user", "name email phone")
      .populate("doctor", "name speciality nmcNumber")
      .sort({ date: -1 }); // Newest first

    res.json({ appointments }); // Wrapped for frontend consistency
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch registry." });
  }
};

// -------------------------------------------------------------------
// 4. GET SINGLE APPOINTMENT
// -------------------------------------------------------------------
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("doctor", "name speciality");

    if (!appointment) return res.status(404).json({ message: "Not found" });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------------------------------------------
// 5. UPDATE STATUS (Cancel/Confirm)
// -------------------------------------------------------------------
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id).populate(
      "doctor"
    );

    if (!appointment) return res.status(404).json({ message: "Not found" });

    // Permission Logic
    const isOwner = appointment.user.toString() === req.user._id.toString();
    const isStaff = ["admin", "pharmacist"].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Customer Restriction: Can only cancel
    if (req.user.role === "customer" && status !== "cancelled") {
      return res
        .status(400)
        .json({ message: "Customers can only cancel appointments." });
    }

    appointment.status = status;
    const updated = await appointment.save();

    // Send Status Update Email
    if (status === "cancelled" || status === "confirmed") {
      const subject =
        status === "cancelled"
          ? "Appointment Cancelled"
          : "Appointment Approved";
      try {
        await sendEmail({
          email: appointment.customerDetails?.email || req.user.email,
          subject: `${subject} - ${appointment.bookingReference}`,
          message: `<p>Your appointment status has been updated to: <strong>${status.toUpperCase()}</strong></p>`,
        });
      } catch (e) {
        console.error("Status email failed");
      }
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// -------------------------------------------------------------------
// 6. DELETE APPOINTMENT (Admin Clean-up)
// -------------------------------------------------------------------
// @route   DELETE /api/appointments/:id
// @access  Private (Admin)
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Not found" });

    await appointment.deleteOne();
    res.json({ message: "Record removed permanently" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
};
