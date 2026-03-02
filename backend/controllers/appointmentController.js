// const crypto = require("crypto");
// const Appointment = require("../models/Appointment");
// const Doctor = require("../models/Doctor");
// const sendEmail = require("../utils/sendEmail"); // ✅ Ensure this utility exists

// // -------------------------------------------------------------------
// // ⚙️ CONFIGURATION
// // -------------------------------------------------------------------
// const SLOT_CAPACITY = 3; // Max patients per time slot

// // -------------------------------------------------------------------
// // 1. CREATE APPOINTMENT (Book with Capacity & Date Logic)
// // -------------------------------------------------------------------
// // @route   POST /api/appointments
// // @access  Private (Customer)
// const createAppointment = async (req, res) => {
//   try {
//     const { doctor, date, day, timeSlot, notes } = req.body;

//     // 1. Basic Validation
//     if (!doctor || !date || !timeSlot) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const doctorDoc = await Doctor.findById(doctor);
//     if (!doctorDoc || !doctorDoc.isAvailable) {
//       return res
//         .status(400)
//         .json({ message: "Doctor is currently unavailable." });
//     }

//     // 2. Normalize Date (Strip time component)
//     const bookingDate = new Date(date);
//     bookingDate.setHours(0, 0, 0, 0);

//     // 3. Prevent Double Booking (Same Patient, Same Slot)
//     const existingBooking = await Appointment.findOne({
//       user: req.user._id,
//       doctor,
//       date: bookingDate,
//       timeSlot,
//       status: { $ne: "cancelled" },
//     });

//     if (existingBooking) {
//       return res.status(400).json({
//         message: "You already have an appointment booked for this time slot.",
//       });
//     }

//     // 4. Check Slot Capacity (Prevent Overbooking)
//     const currentCount = await Appointment.countDocuments({
//       doctor,
//       date: bookingDate,
//       timeSlot,
//       status: { $ne: "cancelled" },
//     });

//     if (currentCount >= SLOT_CAPACITY) {
//       return res.status(400).json({
//         message:
//           "Sorry, this time slot is fully booked. Please choose another.",
//       });
//     }

//     // 5. Generate Reference & Create Record
//     const reference = `PH-${crypto
//       .randomBytes(3)
//       .toString("hex")
//       .toUpperCase()}`;

//     const appointment = await Appointment.create({
//       user: req.user._id,
//       doctor,
//       day: day.toUpperCase(),
//       date: bookingDate,
//       timeSlot,
//       notes,
//       bookingReference: reference,
//       status: "pending",
//       customerDetails: {
//         name: req.user.name,
//         email: req.user.email,
//         phone: req.user.phone || "N/A",
//       },
//     });

//     // 6. Send Confirmation Email
//     const emailMsg = `
//       <h3>Appointment Confirmed</h3>
//       <p>Dear ${req.user.name},</p>
//       <p>Your appointment with <strong>Dr. ${
//         doctorDoc.name
//       }</strong> is confirmed.</p>
//       <ul>
//         <li><strong>Ref:</strong> ${reference}</li>
//         <li><strong>Date:</strong> ${bookingDate.toDateString()}</li>
//         <li><strong>Time:</strong> ${timeSlot}</li>
//       </ul>
//       <p>Please arrive 10 minutes early.</p>
//     `;

//     try {
//       await sendEmail({
//         email: req.user.email,
//         subject: `Appointment Confirmed - ${reference}`,
//         message: emailMsg,
//       });
//     } catch (emailErr) {
//       console.error("Email failed to send:", emailErr.message);
//     }

//     res.status(201).json(appointment);
//   } catch (error) {
//     console.error("Booking Controller Error:", error);
//     res.status(500).json({ message: "Server error processing booking." });
//   }
// };

// // -------------------------------------------------------------------
// // 2. GET MY APPOINTMENTS (Customer)
// // -------------------------------------------------------------------
// // @route   GET /api/appointments/my
// // @access  Private
// const getMyAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ user: req.user._id })
//       .populate("doctor", "name speciality image")
//       .sort({ date: 1 }); // Upcoming first

//     res.json(appointments);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch appointments." });
//   }
// };

// // -------------------------------------------------------------------
// // 3. GET ALL APPOINTMENTS (Admin/Pharmacist Registry)
// // -------------------------------------------------------------------
// // @route   GET /api/appointments
// // @access  Private (Admin/Pharmacist)
// const getAppointments = async (req, res) => {
//   try {
//     const { date, status, doctor, day } = req.query;
//     let query = {};

//     // Filter by specific Date Range (Start of day to End of day)
//     if (date) {
//       const start = new Date(date);
//       start.setHours(0, 0, 0, 0);
//       const end = new Date(date);
//       end.setHours(23, 59, 59, 999);
//       query.date = { $gte: start, $lte: end };
//     }
//     // Fallback: Filter by Day name (e.g. "MONDAY") if no specific date
//     else if (day) {
//       query.day = day.toUpperCase();
//     }

//     if (status) query.status = status;
//     if (doctor) query.doctor = doctor;

//     const appointments = await Appointment.find(query)
//       .populate("user", "name email phone")
//       .populate("doctor", "name speciality nmcNumber")
//       .sort({ date: -1 }); // Newest first

//     res.json({ appointments }); // Wrapped for frontend consistency
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch registry." });
//   }
// };

// // -------------------------------------------------------------------
// // 4. GET SINGLE APPOINTMENT
// // -------------------------------------------------------------------
// // @route   GET /api/appointments/:id
// // @access  Private
// const getAppointmentById = async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id)
//       .populate("user", "name email phone")
//       .populate("doctor", "name speciality");

//     if (!appointment) return res.status(404).json({ message: "Not found" });
//     res.json(appointment);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // -------------------------------------------------------------------
// // 5. UPDATE STATUS (Cancel/Confirm)
// // -------------------------------------------------------------------
// // @route   PUT /api/appointments/:id/status
// // @access  Private
// const updateAppointmentStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const appointment = await Appointment.findById(req.params.id).populate(
//       "doctor"
//     );

//     if (!appointment) return res.status(404).json({ message: "Not found" });

//     // Permission Logic
//     const isOwner = appointment.user.toString() === req.user._id.toString();
//     const isStaff = ["admin", "pharmacist"].includes(req.user.role);

//     if (!isOwner && !isStaff) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     // Customer Restriction: Can only cancel
//     if (req.user.role === "customer" && status !== "cancelled") {
//       return res
//         .status(400)
//         .json({ message: "Customers can only cancel appointments." });
//     }

//     appointment.status = status;
//     const updated = await appointment.save();

//     // Send Status Update Email
//     if (status === "cancelled" || status === "confirmed") {
//       const subject =
//         status === "cancelled"
//           ? "Appointment Cancelled"
//           : "Appointment Approved";
//       try {
//         await sendEmail({
//           email: appointment.customerDetails?.email || req.user.email,
//           subject: `${subject} - ${appointment.bookingReference}`,
//           message: `<p>Your appointment status has been updated to: <strong>${status.toUpperCase()}</strong></p>`,
//         });
//       } catch (e) {
//         console.error("Status email failed");
//       }
//     }

//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: "Update failed" });
//   }
// };

// // -------------------------------------------------------------------
// // 6. DELETE APPOINTMENT (Admin Clean-up)
// // -------------------------------------------------------------------
// // @route   DELETE /api/appointments/:id
// // @access  Private (Admin)
// const deleteAppointment = async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id);
//     if (!appointment) return res.status(404).json({ message: "Not found" });

//     await appointment.deleteOne();
//     res.json({ message: "Record removed permanently" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   createAppointment,
//   getMyAppointments,
//   getAppointments,
//   getAppointmentById,
//   updateAppointmentStatus,
//   deleteAppointment,
// };

// const crypto = require("crypto");
// const Appointment = require("../models/Appointment");
// const Doctor = require("../models/Doctor");
// const sendEmail = require("../utils/sendEmail"); // ✅ Ensure this utility exists

// // -------------------------------------------------------------------
// // ⚙️ CONFIGURATION
// // -------------------------------------------------------------------
// const SLOT_CAPACITY = 3; // Max patients per time slot

// // -------------------------------------------------------------------
// // 1. CREATE APPOINTMENT (Book with Capacity & Date Logic)
// // -------------------------------------------------------------------
// // @route   POST /api/appointments
// // @access  Private (Customer)
// const createAppointment = async (req, res) => {
//   try {
//     const { doctor, date, day, timeSlot, notes } = req.body;

//     // 1. Basic Validation
//     if (!doctor || !date || !timeSlot) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const doctorDoc = await Doctor.findById(doctor);
//     if (!doctorDoc || !doctorDoc.isAvailable) {
//       return res
//         .status(400)
//         .json({ message: "Doctor is currently unavailable." });
//     }

//     // 2. Normalize Date (Strip time component)
//     const bookingDate = new Date(date);
//     bookingDate.setHours(0, 0, 0, 0);

//     // ✅ 3. PREVENT DOUBLE BOOKING (Global Slot Check)
//     // Check if ANYONE has already booked this exact slot
//     const slotAlreadyTaken = await Appointment.findOne({
//       doctor,
//       date: bookingDate,
//       timeSlot,
//       status: { $in: ["pending", "confirmed"] }, // Ignore cancelled ones
//     });

//     if (slotAlreadyTaken) {
//       return res.status(400).json({
//         message:
//           "This time slot is already booked. Please choose another time.",
//       });
//     }

//     // 4. Prevent Double Booking (Same Patient, Same Doctor, Same Day - Optional safety check)
//     const existingBooking = await Appointment.findOne({
//       user: req.user._id,
//       doctor,
//       date: bookingDate,
//       status: { $ne: "cancelled" },
//     });

//     if (existingBooking) {
//       return res.status(400).json({
//         message:
//           "You already have an appointment booked with this doctor on this date.",
//       });
//     }

//     // 5. Generate Reference & Create Record
//     const reference = `PH-${crypto
//       .randomBytes(3)
//       .toString("hex")
//       .toUpperCase()}`;

//     const appointment = await Appointment.create({
//       user: req.user._id,
//       doctor,
//       day: day.toUpperCase(),
//       date: bookingDate,
//       timeSlot,
//       notes,
//       bookingReference: reference,
//       status: "pending",
//       customerDetails: {
//         name: req.user.name,
//         email: req.user.email,
//         phone: req.user.phone || "N/A",
//       },
//     });

//     // 6. Send Confirmation Email
//     const emailMsg = `
//       <h3>Appointment Confirmed</h3>
//       <p>Dear ${req.user.name},</p>
//       <p>Your appointment with <strong>Dr. ${
//         doctorDoc.name
//       }</strong> is confirmed.</p>
//       <ul>
//         <li><strong>Ref:</strong> ${reference}</li>
//         <li><strong>Date:</strong> ${bookingDate.toDateString()}</li>
//         <li><strong>Time:</strong> ${timeSlot}</li>
//       </ul>
//       <p>Please arrive 10 minutes early.</p>
//     `;

//     // Attempt to send email, but don't fail the booking if email fails
//     try {
//       await sendEmail({
//         email: req.user.email,
//         subject: `Appointment Confirmed - ${reference}`,
//         message: emailMsg,
//       });
//     } catch (emailErr) {
//       console.error("Email failed to send:", emailErr.message);
//     }

//     // Send the successful response
//     res.status(201).json(appointment);
//   } catch (error) {
//     console.error("Booking Controller Error:", error);
//     res.status(500).json({ message: "Server error processing booking." });
//   }
// };

// // -------------------------------------------------------------------
// // 2. GET MY APPOINTMENTS (Customer)
// // -------------------------------------------------------------------
// // @route   GET /api/appointments/my
// // @access  Private
// const getMyAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ user: req.user._id })
//       .populate("doctor", "name speciality image")
//       .sort({ date: 1 }); // Upcoming first

//     res.json(appointments);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch appointments." });
//   }
// };

// // -------------------------------------------------------------------
// // 3. GET ALL APPOINTMENTS (Admin/Pharmacist Registry)
// // -------------------------------------------------------------------
// // @route   GET /api/appointments
// // @access  Private (Admin/Pharmacist)
// const getAppointments = async (req, res) => {
//   try {
//     const { date, status, doctor, day } = req.query;
//     let query = {};

//     // Filter by specific Date Range (Start of day to End of day)
//     if (date) {
//       const start = new Date(date);
//       start.setHours(0, 0, 0, 0);
//       const end = new Date(date);
//       end.setHours(23, 59, 59, 999);
//       query.date = { $gte: start, $lte: end };
//     }
//     // Fallback: Filter by Day name (e.g. "MONDAY") if no specific date
//     else if (day) {
//       query.day = day.toUpperCase();
//     }

//     if (status) query.status = status;
//     if (doctor) query.doctor = doctor;

//     const appointments = await Appointment.find(query)
//       .populate("user", "name email phone")
//       .populate("doctor", "name speciality nmcNumber")
//       .sort({ date: -1 }); // Newest first

//     res.json({ appointments }); // Wrapped for frontend consistency
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch registry." });
//   }
// };

// // -------------------------------------------------------------------
// // 4. GET SINGLE APPOINTMENT
// // -------------------------------------------------------------------
// // @route   GET /api/appointments/:id
// // @access  Private
// const getAppointmentById = async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id)
//       .populate("user", "name email phone")
//       .populate("doctor", "name speciality");

//     if (!appointment) return res.status(404).json({ message: "Not found" });
//     res.json(appointment);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // -------------------------------------------------------------------
// // 5. UPDATE STATUS (Cancel/Confirm)
// // -------------------------------------------------------------------
// // @route   PUT /api/appointments/:id/status
// // @access  Private
// const updateAppointmentStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const appointment = await Appointment.findById(req.params.id).populate(
//       "doctor",
//     );

//     if (!appointment) return res.status(404).json({ message: "Not found" });

//     // Permission Logic
//     const isOwner = appointment.user.toString() === req.user._id.toString();
//     const isStaff = ["admin", "pharmacist"].includes(req.user.role);

//     if (!isOwner && !isStaff) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     // Customer Restriction: Can only cancel
//     if (req.user.role === "customer" && status !== "cancelled") {
//       return res
//         .status(400)
//         .json({ message: "Customers can only cancel appointments." });
//     }

//     appointment.status = status;
//     const updated = await appointment.save();

//     // Send Status Update Email
//     if (status === "cancelled" || status === "confirmed") {
//       const subject =
//         status === "cancelled"
//           ? "Appointment Cancelled"
//           : "Appointment Approved";
//       try {
//         await sendEmail({
//           email: appointment.customerDetails?.email || req.user.email,
//           subject: `${subject} - ${appointment.bookingReference}`,
//           message: `<p>Your appointment status has been updated to: <strong>${status.toUpperCase()}</strong></p>`,
//         });
//       } catch (e) {
//         console.error("Status email failed");
//       }
//     }

//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: "Update failed" });
//   }
// };

// // -------------------------------------------------------------------
// // 6. DELETE APPOINTMENT (Admin Clean-up)
// // -------------------------------------------------------------------
// // @route   DELETE /api/appointments/:id
// // @access  Private (Admin)
// const deleteAppointment = async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id);
//     if (!appointment) return res.status(404).json({ message: "Not found" });

//     await appointment.deleteOne();
//     res.json({ message: "Record removed permanently" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // -------------------------------------------------------------------
// // 7. GET AVAILABLE SLOTS FOR A SPECIFIC DATE (Frontend Helper)
// // -------------------------------------------------------------------
// // @route   GET /api/appointments/availability
// // @access  Private
// const getAvailability = async (req, res) => {
//   try {
//     const { doctorId, date } = req.query;

//     if (!doctorId || !date) {
//       return res.status(400).json({ message: "Missing doctor or date" });
//     }

//     const bookingDate = new Date(date);
//     bookingDate.setHours(0, 0, 0, 0);

//     // Fetch all confirmed/pending appointments for this doctor on this day
//     const bookedSlots = await Appointment.find({
//       doctor: doctorId,
//       date: bookingDate,
//       status: { $in: ["pending", "confirmed"] },
//     }).select("timeSlot status");

//     // Return the array of booked slots mapped nicely for the frontend
//     const formattedSlots = bookedSlots.map((appt) => ({
//       time: appt.timeSlot,
//       status: appt.status === "confirmed" ? "full" : "booked",
//     }));

//     res.json(formattedSlots);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch availability" });
//   }
// };

// module.exports = {
//   createAppointment,
//   getMyAppointments,
//   getAppointments,
//   getAppointmentById,
//   updateAppointmentStatus,
//   deleteAppointment,
//   getAvailability, // ✅ Exported new function
// };

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
    // ✅ Added fallbacks to support BOTH old forms and the new Customer Dashboard form
    const doctorId = req.body.doctor || req.body.doctorId;
    const appointmentDate = req.body.date;
    const appointmentTime = req.body.timeSlot || req.body.time;
    const appointmentNotes =
      req.body.notes || req.body.reason || "General Consultation";

    // Auto-calculate the day if it wasn't provided by the frontend
    const appointmentDay = req.body.day
      ? req.body.day.toUpperCase()
      : new Date(appointmentDate)
          .toLocaleDateString("en-US", { weekday: "long" })
          .toUpperCase();

    // 1. Basic Validation
    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const doctorDoc = await Doctor.findById(doctorId);
    if (!doctorDoc || !doctorDoc.isAvailable) {
      return res
        .status(400)
        .json({ message: "Doctor is currently unavailable." });
    }

    // 2. Normalize Date (Strip time component)
    const bookingDate = new Date(appointmentDate);
    bookingDate.setHours(0, 0, 0, 0);

    // ✅ 3. PREVENT DOUBLE BOOKING (Global Slot Check)
    // Check if ANYONE has already booked this exact slot
    const slotAlreadyTaken = await Appointment.findOne({
      doctor: doctorId,
      date: bookingDate,
      timeSlot: appointmentTime,
      status: { $in: ["pending", "confirmed"] }, // Ignore cancelled ones
    });

    if (slotAlreadyTaken) {
      return res.status(400).json({
        message:
          "This time slot is already booked. Please choose another time.",
      });
    }

    // 4. Prevent Double Booking (Same Patient, Same Doctor, Same Day - Optional safety check)
    const existingBooking = await Appointment.findOne({
      user: req.user._id,
      doctor: doctorId,
      date: bookingDate,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(400).json({
        message:
          "You already have an appointment booked with this doctor on this date.",
      });
    }

    // 5. Generate Reference & Create Record
    const reference = `PH-${crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;

    const appointment = await Appointment.create({
      user: req.user._id,
      doctor: doctorId,
      day: appointmentDay,
      date: bookingDate,
      timeSlot: appointmentTime,
      notes: appointmentNotes,
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
        <li><strong>Time:</strong> ${appointmentTime}</li>
      </ul>
      <p>Please arrive 10 minutes early.</p>
    `;

    // Attempt to send email, but don't fail the booking if email fails
    try {
      await sendEmail({
        email: req.user.email,
        subject: `Appointment Confirmed - ${reference}`,
        message: emailMsg,
      });
    } catch (emailErr) {
      console.error("Email failed to send:", emailErr.message);
    }

    // Send the successful response
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
      .populate("doctor", "name speciality image consultationFee phone") // Added extra fields for frontend
      .sort({ date: 1 }); // Upcoming first

    // Format slightly for the new frontend compatibility
    const formatted = appointments.map((app) => ({
      ...app.toObject(),
      time: app.timeSlot, // Maps timeSlot to time for the new UI
    }));

    res.json(formatted);
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
// 5. UPDATE STATUS (Cancel/Confirm/Complete)
// -------------------------------------------------------------------
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id).populate(
      "doctor",
    );

    if (!appointment) return res.status(404).json({ message: "Not found" });

    // Permission Logic
    const isOwner = appointment.user.toString() === req.user._id.toString();
    // ✅ ADDED "doctor" to allowed staff list so doctors can update their own appointments
    const isStaff = ["admin", "pharmacist", "doctor"].includes(req.user.role);

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

// -------------------------------------------------------------------
// 7. GET AVAILABLE SLOTS FOR A SPECIFIC DATE (Frontend Helper)
// -------------------------------------------------------------------
// @route   GET /api/appointments/availability
// @access  Private
const getAvailability = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "Missing doctor or date" });
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    // Fetch all confirmed/pending appointments for this doctor on this day
    const bookedSlots = await Appointment.find({
      doctor: doctorId,
      date: bookingDate,
      status: { $in: ["pending", "confirmed"] },
    }).select("timeSlot status");

    // Return the array of booked slots mapped nicely for the frontend
    const formattedSlots = bookedSlots.map((appt) => ({
      time: appt.timeSlot,
      status: appt.status === "confirmed" ? "full" : "booked",
    }));

    res.json(formattedSlots);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch availability" });
  }
};

// ===================================================================
// 🩺 NEW LOGIC FOR DOCTOR AND CUSTOMER DASHBOARDS
// ===================================================================

// @desc    Get all available doctors for the customer booking dropdown
// @route   GET /api/appointments/available-doctors
const getAvailableDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isAvailable: true }).select(
      "name speciality consultationFee experience image slots",
    );
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

// @desc    Doctor views their own appointments
// @route   GET /api/doctor/appointments
const getDoctorAppointments = async (req, res) => {
  try {
    // ✅ FIX: Match the doctor by their EMAIL instead of userId,
    // because the Admin panel creates doctors using emails.
    const doctorProfile = await Doctor.findOne({
      $or: [{ userId: req.user._id }, { email: req.user.email }],
    });

    if (!doctorProfile) {
      console.log("❌ Doctor Profile Not Found for email:", req.user.email);
      return res.status(404).json({
        message:
          "Doctor profile not found. Ensure your login email matches the email in the Doctor Directory.",
      });
    }

    const appointments = await Appointment.find({ doctor: doctorProfile._id })
      .populate("user", "name email phone")
      .sort({ date: 1, timeSlot: 1 });

    const formattedAppointments = appointments.map((app) => ({
      ...app.toObject(),
      patient: app.user,
      time: app.timeSlot,
      reason: app.notes,
    }));

    res.json({ appointments: formattedAppointments });
  } catch (error) {
    console.error("Dashboard Appointments Error:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

// @desc    Doctor views unique patients they have treated/booked
// @route   GET /api/doctor/patients
const getDoctorPatients = async (req, res) => {
  try {
    // ✅ FIX: Match the doctor by their EMAIL
    const doctorProfile = await Doctor.findOne({
      $or: [{ userId: req.user._id }, { email: req.user.email }],
    });

    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found." });
    }

    const appointments = await Appointment.find({ doctor: doctorProfile._id })
      .populate("user", "name email phone")
      .sort({ date: -1 });

    const uniquePatientsMap = new Map();
    appointments.forEach((app) => {
      if (app.user && !uniquePatientsMap.has(app.user._id.toString())) {
        uniquePatientsMap.set(app.user._id.toString(), {
          _id: app.user._id,
          name: app.user.name,
          email: app.user.email,
          phone: app.user.phone || "N/A",
          lastVisit: app.date,
          status: app.status,
        });
      }
    });

    res.json({ patients: Array.from(uniquePatientsMap.values()) });
  } catch (error) {
    console.error("Dashboard Patients Error:", error);
    res.status(500).json({ message: "Error fetching patients" });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  getAvailability,
  getAvailableDoctors, // ✅ Exported New Route
  getUserAppointments: getMyAppointments, // ✅ Exported as alias so new Customer Dashboard finds it perfectly
  getDoctorAppointments, // ✅ Exported New Route
  getDoctorPatients, // ✅ Exported New Route
};
