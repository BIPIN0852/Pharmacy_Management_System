// const express = require("express");
// const router = express.Router();
// const crypto = require("crypto");
// const Appointment = require("../models/Appointment");
// const Doctor = require("../models/Doctor");
// const { protect, admin, pharmacist } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role"); // ✅ Consistent RBAC
// const sendEmail = require("../utils/sendEmail");

// const SLOT_CAPACITY = 3; // ✅ Real-world: Max 3 patients per time slot

// /**
//  * ------------------------------------------------------------------
//  * 📊 1. CHECK AVAILABILITY (Dynamic Capacity)
//  * ------------------------------------------------------------------
//  * Used by Customer Frontend to show "Full" or "Limited" slots
//  * @route   GET /api/appointments/availability
//  */
// router.get("/availability", protect, async (req, res) => {
//   try {
//     const { doctorId, date } = req.query;
//     if (!doctorId || !date) {
//       return res
//         .status(400)
//         .json({ message: "Doctor ID and Date are required" });
//     }

//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);

//     // Count existing bookings for this doctor/date that are not cancelled
//     const bookings = await Appointment.find({
//       doctor: doctorId,
//       date: { $gte: startOfDay, $lte: endOfDay },
//       status: { $ne: "cancelled" },
//     });

//     // Map counts: { "09:00 - 09:30": 2, "10:00 - 10:30": 3 }
//     const slotCounts = bookings.reduce((acc, curr) => {
//       acc[curr.timeSlot] = (acc[curr.timeSlot] || 0) + 1;
//       return acc;
//     }, {});

//     // Determine status based on SLOT_CAPACITY
//     // 0 = Available, 1-2 = Limited, 3+ = Full
//     const availabilityStatus = Object.keys(slotCounts).map((slot) => ({
//       time: slot,
//       count: slotCounts[slot],
//       status: slotCounts[slot] >= SLOT_CAPACITY ? "full" : "limited",
//     }));

//     res.json(availabilityStatus);
//   } catch (err) {
//     console.error("❌ Availability Error:", err);
//     res.status(500).json({ message: "Server Error fetching availability" });
//   }
// });

// /**
//  * ------------------------------------------------------------------
//  * 📅 2. CREATE APPOINTMENT (Book with Logic)
//  * ------------------------------------------------------------------
//  * @route   POST /api/appointments
//  */
// router.post("/", protect, async (req, res) => {
//   try {
//     const { doctor, date, day, timeSlot, notes } = req.body;

//     // 1. Basic Validation
//     if (!doctor || !date || !timeSlot || !day) {
//       return res
//         .status(400)
//         .json({ message: "Missing required booking fields" });
//     }

//     // ✅ Added: Date validation (Cannot book in the past)
//     const bookingDate = new Date(date);
//     bookingDate.setHours(0, 0, 0, 0);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (bookingDate < today) {
//       return res
//         .status(400)
//         .json({ message: "Cannot book appointments for past dates." });
//     }

//     // 2. Doctor Availability Check
//     const doctorDoc = await Doctor.findById(doctor);
//     if (!doctorDoc || !doctorDoc.isAvailable) {
//       return res.status(400).json({
//         message: "This doctor is currently unavailable for bookings.",
//       });
//     }

//     // 3. Logic Check: Prevent Overbooking & Double Booking
//     const [existingUserBooking, currentSlotCount] = await Promise.all([
//       Appointment.findOne({
//         user: req.user._id,
//         doctor,
//         date: bookingDate,
//         timeSlot,
//         status: { $ne: "cancelled" },
//       }),
//       Appointment.countDocuments({
//         doctor,
//         date: bookingDate,
//         timeSlot,
//         status: { $ne: "cancelled" },
//       }),
//     ]);

//     if (existingUserBooking) {
//       return res.status(400).json({
//         message: "You already have an active booking for this time slot.",
//       });
//     }

//     if (currentSlotCount >= SLOT_CAPACITY) {
//       return res
//         .status(400)
//         .json({ message: "This slot has reached maximum capacity." });
//     }

//     // 4. Generate Unique Reference (Ticket ID)
//     const reference = `PH-${crypto
//       .randomBytes(3)
//       .toString("hex")
//       .toUpperCase()}`;

//     // 5. Create Appointment
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
//         phone: req.user.phone,
//       },
//     });

//     // 6. Send Confirmation Email (Async)
//     try {
//       await sendEmail({
//         email: req.user.email,
//         subject: `Appointment Scheduled: ${reference}`,
//         message: `
//           <h3>Your appointment is scheduled!</h3>
//           <p><strong>Ticket ID:</strong> ${reference}</p>
//           <p><strong>Doctor:</strong> Dr. ${doctorDoc.name}</p>
//           <p><strong>Date:</strong> ${bookingDate.toDateString()}</p>
//           <p><strong>Time:</strong> ${timeSlot}</p>
//           <p>Please present this Ticket ID at the reception 10 minutes before your time.</p>
//         `,
//       });
//     } catch (emailErr) {
//       console.warn("⚠️ Confirmation email could not be sent.");
//     }

//     res.status(201).json({ success: true, appointment });
//   } catch (err) {
//     console.error("❌ Booking Error:", err);
//     res
//       .status(500)
//       .json({ message: "Failed to process booking. Please try again." });
//   }
// });

// /**
//  * ------------------------------------------------------------------
//  * 👤 3. CUSTOMER: MY APPOINTMENTS
//  * ------------------------------------------------------------------
//  * @route   GET /api/appointments/my
//  */
// router.get("/my", protect, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ user: req.user._id })
//       .populate("doctor", "name speciality image")
//       .sort({ date: -1 });
//     res.json(appointments);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching your appointments" });
//   }
// });

// /**
//  * ------------------------------------------------------------------
//  * 🏥 4. ADMIN: GLOBAL REGISTRY (Manage All)
//  * ------------------------------------------------------------------
//  * @route   GET /api/appointments
//  */
// router.get(
//   "/",
//   protect,
//   authorizeRoles("admin", "pharmacist"),
//   async (req, res) => {
//     try {
//       const { day, status, page = 1, limit = 20 } = req.query;
//       const query = {};

//       if (day) query.day = day.toUpperCase();
//       if (status) query.status = status;

//       const appointments = await Appointment.find(query)
//         .populate("user", "name email phone")
//         .populate("doctor", "name speciality nmcNumber")
//         .sort({ date: -1 })
//         .skip((page - 1) * limit)
//         .limit(Number(limit));

//       const total = await Appointment.countDocuments(query);

//       res.json({
//         appointments,
//         pagination: {
//           page: Number(page),
//           pages: Math.ceil(total / limit),
//           total,
//         },
//       });
//     } catch (err) {
//       res.status(500).json({ message: "Error fetching registry" });
//     }
//   }
// );

// /**
//  * ------------------------------------------------------------------
//  * 📈 5. ADMIN: APPOINTMENT STATISTICS
//  * ------------------------------------------------------------------
//  */
// router.get(
//   "/stats/overview",
//   protect,
//   authorizeRoles("admin"),
//   async (req, res) => {
//     try {
//       const stats = await Appointment.aggregate([
//         { $group: { _id: "$status", count: { $sum: 1 } } },
//       ]);
//       res.json(stats);
//     } catch (err) {
//       res.status(500).json({ message: "Error fetching statistics" });
//     }
//   }
// );

// /**
//  * ------------------------------------------------------------------
//  * 💊 6. STAFF VIEW (Today & Upcoming)
//  * ------------------------------------------------------------------
//  */
// router.get(
//   "/staff/upcoming",
//   protect,
//   authorizeRoles("admin", "pharmacist"),
//   async (req, res) => {
//     try {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const appointments = await Appointment.find({
//         date: { $gte: today },
//         status: { $nin: ["cancelled", "completed"] }, // ✅ Logic: Filter out past/inactive
//       })
//         .populate("user", "name phone")
//         .populate("doctor", "name speciality")
//         .sort({ date: 1, timeSlot: 1 });

//       res.json(appointments);
//     } catch (err) {
//       res.status(500).json({ message: "Error fetching staff dashboard data" });
//     }
//   }
// );

// /**
//  * ------------------------------------------------------------------
//  * 🔄 7. UPDATE STATUS (Confirm/Cancel/Complete)
//  * ------------------------------------------------------------------
//  */
// router.put("/:id/status", protect, async (req, res) => {
//   try {
//     const { status } = req.body;
//     const appointment = await Appointment.findById(req.params.id).populate(
//       "doctor"
//     );

//     if (!appointment)
//       return res.status(404).json({ message: "Appointment not found" });

//     // Permissions: User can only cancel their own. Admin/Pharmacist can do anything.
//     const isOwner = appointment.user.toString() === req.user._id.toString();
//     const isStaff = ["admin", "pharmacist"].includes(req.user.role);

//     if (!isOwner && !isStaff)
//       return res
//         .status(403)
//         .json({ message: "Not authorized to modify this booking" });

//     if (!isStaff && status !== "cancelled") {
//       return res.status(400).json({
//         message: "Patients are only permitted to cancel appointments.",
//       });
//     }

//     appointment.status = status;
//     await appointment.save();

//     // Notify Customer on Status Change
//     if (["confirmed", "cancelled", "completed"].includes(status)) {
//       try {
//         await sendEmail({
//           email: appointment.customerDetails?.email || req.user.email,
//           subject: `Appointment Status Update: ${status.toUpperCase()}`,
//           message: `<p>Your appointment (${appointment.bookingReference}) with Dr. ${appointment.doctor.name} has been <strong>${status}</strong>.</p>`,
//         });
//       } catch (e) {
//         console.warn("⚠️ Status update email failed.");
//       }
//     }

//     res.json({ success: true, appointment });
//   } catch (err) {
//     res.status(500).json({ message: "Status update failed" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const crypto = require("crypto");
// const Appointment = require("../models/Appointment");
// const Doctor = require("../models/Doctor");
// const { protect, admin, pharmacist } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");
// const sendEmail = require("../utils/sendEmail");

// const SLOT_CAPACITY = 3;

// /**
//  * ------------------------------------------------------------------
//  * 📊 1. CHECK AVAILABILITY
//  * ------------------------------------------------------------------
//  */
// router.get("/availability", protect, async (req, res) => {
//   try {
//     const { doctorId, date } = req.query;
//     if (!doctorId || !date) {
//       return res
//         .status(400)
//         .json({ message: "Doctor ID and Date are required" });
//     }

//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);

//     const bookings = await Appointment.find({
//       doctor: doctorId,
//       date: { $gte: startOfDay, $lte: endOfDay },
//       status: { $ne: "cancelled" },
//     });

//     const slotCounts = bookings.reduce((acc, curr) => {
//       acc[curr.timeSlot] = (acc[curr.timeSlot] || 0) + 1;
//       return acc;
//     }, {});

//     const availabilityStatus = Object.keys(slotCounts).map((slot) => ({
//       time: slot,
//       count: slotCounts[slot],
//       status: slotCounts[slot] >= SLOT_CAPACITY ? "full" : "limited",
//     }));

//     res.json(availabilityStatus);
//   } catch (err) {
//     console.error("❌ Availability Error:", err);
//     res.status(500).json({ message: "Server Error fetching availability" });
//   }
// });

// /**
//  * ------------------------------------------------------------------
//  * 📅 2. CREATE APPOINTMENT
//  * ------------------------------------------------------------------
//  */
// router.post("/", protect, async (req, res) => {
//   try {
//     const { doctor, date, day, timeSlot, notes } = req.body;

//     if (!doctor || !date || !timeSlot || !day) {
//       return res
//         .status(400)
//         .json({ message: "Missing required booking fields" });
//     }

//     const bookingDate = new Date(date);
//     bookingDate.setHours(0, 0, 0, 0);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (bookingDate < today) {
//       return res
//         .status(400)
//         .json({ message: "Cannot book appointments for past dates." });
//     }

//     const doctorDoc = await Doctor.findById(doctor);
//     if (!doctorDoc || !doctorDoc.isAvailable) {
//       return res
//         .status(400)
//         .json({ message: "This doctor is currently unavailable." });
//     }

//     const [existingUserBooking, currentSlotCount] = await Promise.all([
//       Appointment.findOne({
//         user: req.user._id,
//         doctor,
//         date: bookingDate,
//         timeSlot,
//         status: { $ne: "cancelled" },
//       }),
//       Appointment.countDocuments({
//         doctor,
//         date: bookingDate,
//         timeSlot,
//         status: { $ne: "cancelled" },
//       }),
//     ]);

//     if (existingUserBooking) {
//       return res.status(400).json({
//         message: "You already have an active booking for this time slot.",
//       });
//     }

//     if (currentSlotCount >= SLOT_CAPACITY) {
//       return res
//         .status(400)
//         .json({ message: "This slot has reached maximum capacity." });
//     }

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
//         phone: req.user.phone,
//       },
//     });

//     // Send Booking Request Email (To Customer)
//     try {
//       await sendEmail({
//         email: req.user.email,
//         subject: `Appointment Request Received: ${reference}`,
//         message: `
//           <h3>Appointment Request Received</h3>
//           <p>Your request for an appointment with <strong>Dr. ${
//             doctorDoc.name
//           }</strong> on <strong>${bookingDate.toDateString()} at ${timeSlot}</strong> has been received.</p>
//           <p>Status: <strong>PENDING</strong></p>
//           <p>You will receive another email once the clinic confirms your slot.</p>
//         `,
//       });
//     } catch (emailErr) {
//       console.warn("⚠️ Confirmation email could not be sent.");
//     }

//     res.status(201).json({ success: true, appointment });
//   } catch (err) {
//     console.error("❌ Booking Error:", err);
//     res.status(500).json({ message: "Failed to process booking." });
//   }
// });

// /**
//  * ------------------------------------------------------------------
//  * 👤 3. CUSTOMER: MY APPOINTMENTS
//  * ------------------------------------------------------------------
//  */
// router.get("/my", protect, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ user: req.user._id })
//       .populate("doctor", "name speciality image")
//       .sort({ date: -1 });
//     res.json(appointments);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching your appointments" });
//   }
// });

// /**
//  * ------------------------------------------------------------------
//  * 🏥 4. ADMIN: GLOBAL REGISTRY
//  * ------------------------------------------------------------------
//  */
// router.get(
//   "/",
//   protect,
//   authorizeRoles("admin", "pharmacist"),
//   async (req, res) => {
//     try {
//       const { day, status, page = 1, limit = 20 } = req.query;
//       const query = {};
//       if (day) query.day = day.toUpperCase();
//       if (status) query.status = status;

//       const appointments = await Appointment.find(query)
//         .populate("user", "name email phone")
//         .populate("doctor", "name speciality nmcNumber")
//         .sort({ date: -1 })
//         .skip((page - 1) * limit)
//         .limit(Number(limit));

//       const total = await Appointment.countDocuments(query);

//       res.json({
//         appointments,
//         pagination: {
//           page: Number(page),
//           pages: Math.ceil(total / limit),
//           total,
//         },
//       });
//     } catch (err) {
//       res.status(500).json({ message: "Error fetching registry" });
//     }
//   }
// );

// /**
//  * ------------------------------------------------------------------
//  * 📈 5. ADMIN: STATS
//  * ------------------------------------------------------------------
//  */
// router.get(
//   "/stats/overview",
//   protect,
//   authorizeRoles("admin"),
//   async (req, res) => {
//     try {
//       const stats = await Appointment.aggregate([
//         { $group: { _id: "$status", count: { $sum: 1 } } },
//       ]);
//       res.json(stats);
//     } catch (err) {
//       res.status(500).json({ message: "Error fetching statistics" });
//     }
//   }
// );

// /**
//  * ------------------------------------------------------------------
//  * 💊 6. STAFF VIEW
//  * ------------------------------------------------------------------
//  */
// router.get(
//   "/staff/upcoming",
//   protect,
//   authorizeRoles("admin", "pharmacist"),
//   async (req, res) => {
//     try {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const appointments = await Appointment.find({
//         date: { $gte: today },
//         status: { $nin: ["cancelled", "completed"] },
//       })
//         .populate("user", "name phone")
//         .populate("doctor", "name speciality")
//         .sort({ date: 1, timeSlot: 1 });

//       res.json(appointments);
//     } catch (err) {
//       res.status(500).json({ message: "Error fetching staff dashboard data" });
//     }
//   }
// );

// /**
//  * ------------------------------------------------------------------
//  * 🔄 7. UPDATE STATUS (Triggers Email to Customer)
//  * ------------------------------------------------------------------
//  */
// router.put("/:id/status", protect, async (req, res) => {
//   try {
//     const { status } = req.body;

//     // ✅ CRITICAL FIX: Populate "user" so we can access the customer's email
//     const appointment = await Appointment.findById(req.params.id)
//       .populate("doctor")
//       .populate("user", "name email");

//     if (!appointment)
//       return res.status(404).json({ message: "Appointment not found" });

//     // Permissions Check
//     const isOwner = appointment.user._id.toString() === req.user._id.toString();
//     const isStaff = ["admin", "pharmacist"].includes(req.user.role);

//     if (!isOwner && !isStaff)
//       return res.status(403).json({ message: "Not authorized" });

//     if (!isStaff && status !== "cancelled") {
//       return res
//         .status(400)
//         .json({ message: "Patients can only cancel appointments." });
//     }

//     appointment.status = status;
//     await appointment.save();

//     // ✅ NOTIFY CUSTOMER logic
//     // We prioritize appointment.user.email because that is the registered account email
//     if (["confirmed", "cancelled", "completed"].includes(status)) {
//       const recipientEmail =
//         appointment.user?.email || appointment.customerDetails?.email;

//       if (recipientEmail) {
//         try {
//           let emailSubject = `Appointment Update: ${status.toUpperCase()}`;
//           let emailBody = `<p>Your appointment (${
//             appointment.bookingReference
//           }) with Dr. ${
//             appointment.doctor.name
//           } has been updated to <strong>${status.toUpperCase()}</strong>.</p>`;

//           // Custom message for Confirmation
//           if (status === "confirmed") {
//             emailSubject = "✅ Appointment Confirmed!";
//             emailBody = `
//               <h3>Good news! Your appointment is confirmed.</h3>
//               <p><strong>Ticket ID:</strong> ${appointment.bookingReference}</p>
//               <p><strong>Doctor:</strong> Dr. ${appointment.doctor.name}</p>
//               <p><strong>Date:</strong> ${new Date(
//                 appointment.date
//               ).toDateString()}</p>
//               <p><strong>Time:</strong> ${appointment.timeSlot}</p>
//               <p>Please arrive 10 minutes early.</p>
//             `;
//           }

//           await sendEmail({
//             email: recipientEmail,
//             subject: emailSubject,
//             message: emailBody,
//           });
//           console.log(
//             `📧 Email sent to ${recipientEmail} for status: ${status}`
//           );
//         } catch (e) {
//           console.warn("⚠️ Status update email failed:", e.message);
//         }
//       } else {
//         console.warn("⚠️ No recipient email found for appointment update.");
//       }
//     }

//     res.json({ success: true, appointment });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Status update failed" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { protect, admin, pharmacist } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");
const sendEmail = require("../utils/sendEmail");
// ✅ 1. IMPORT YOUR TEMPLATE
const { getEmailTemplate } = require("../utils/emailTemplates");

const SLOT_CAPACITY = 3;

/**
 * ------------------------------------------------------------------
 * 📊 1. CHECK AVAILABILITY
 * ------------------------------------------------------------------
 */
router.get("/availability", protect, async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res
        .status(400)
        .json({ message: "Doctor ID and Date are required" });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Appointment.find({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "cancelled" },
    });

    const slotCounts = bookings.reduce((acc, curr) => {
      acc[curr.timeSlot] = (acc[curr.timeSlot] || 0) + 1;
      return acc;
    }, {});

    const availabilityStatus = Object.keys(slotCounts).map((slot) => ({
      time: slot,
      count: slotCounts[slot],
      status: slotCounts[slot] >= SLOT_CAPACITY ? "full" : "limited",
    }));

    res.json(availabilityStatus);
  } catch (err) {
    console.error("❌ Availability Error:", err);
    res.status(500).json({ message: "Server Error fetching availability" });
  }
});

/**
 * ------------------------------------------------------------------
 * 📅 2. CREATE APPOINTMENT
 * ------------------------------------------------------------------
 */
router.post("/", protect, async (req, res) => {
  try {
    const { doctor, date, day, timeSlot, notes } = req.body;

    if (!doctor || !date || !timeSlot || !day) {
      return res
        .status(400)
        .json({ message: "Missing required booking fields" });
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res
        .status(400)
        .json({ message: "Cannot book appointments for past dates." });
    }

    const doctorDoc = await Doctor.findById(doctor);
    if (!doctorDoc || !doctorDoc.isAvailable) {
      return res
        .status(400)
        .json({ message: "This doctor is currently unavailable." });
    }

    const [existingUserBooking, currentSlotCount] = await Promise.all([
      Appointment.findOne({
        user: req.user._id,
        doctor,
        date: bookingDate,
        timeSlot,
        status: { $ne: "cancelled" },
      }),
      Appointment.countDocuments({
        doctor,
        date: bookingDate,
        timeSlot,
        status: { $ne: "cancelled" },
      }),
    ]);

    if (existingUserBooking) {
      return res.status(400).json({
        message: "You already have an active booking for this time slot.",
      });
    }

    if (currentSlotCount >= SLOT_CAPACITY) {
      return res
        .status(400)
        .json({ message: "This slot has reached maximum capacity." });
    }

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
        phone: req.user.phone,
      },
    });

    // ✅ 2. SEND TEMPLATE EMAIL (Booking Request)
    try {
      const emailContent = `
        Your request for an appointment with <strong>Dr. ${
          doctorDoc.name
        }</strong> has been received.<br><br>
        <strong>Date:</strong> ${bookingDate.toDateString()}<br>
        <strong>Time:</strong> ${timeSlot}<br>
        <strong>Reference:</strong> ${reference}<br><br>
        You will receive another email once the clinic confirms your slot.
      `;

      // Pass user name and content to the template
      const htmlMessage = getEmailTemplate(req.user.name, emailContent);

      await sendEmail({
        email: req.user.email,
        subject: `Appointment Request Received: ${reference}`,
        message: htmlMessage, // Send the full HTML
      });
    } catch (emailErr) {
      console.warn("⚠️ Confirmation email could not be sent.");
    }

    res.status(201).json({ success: true, appointment });
  } catch (err) {
    console.error("❌ Booking Error:", err);
    res.status(500).json({ message: "Failed to process booking." });
  }
});

/**
 * ------------------------------------------------------------------
 * 👤 3. CUSTOMER: MY APPOINTMENTS
 * ------------------------------------------------------------------
 */
router.get("/my", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("doctor", "name speciality image")
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your appointments" });
  }
});

/**
 * ------------------------------------------------------------------
 * 🏥 4. ADMIN: GLOBAL REGISTRY
 * ------------------------------------------------------------------
 */
router.get(
  "/",
  protect,
  authorizeRoles("admin", "pharmacist"),
  async (req, res) => {
    try {
      const { day, status, page = 1, limit = 20 } = req.query;
      const query = {};
      if (day) query.day = day.toUpperCase();
      if (status) query.status = status;

      const appointments = await Appointment.find(query)
        .populate("user", "name email phone")
        .populate("doctor", "name speciality nmcNumber")
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Appointment.countDocuments(query);

      res.json({
        appointments,
        pagination: {
          page: Number(page),
          pages: Math.ceil(total / limit),
          total,
        },
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching registry" });
    }
  }
);

/**
 * ------------------------------------------------------------------
 * 📈 5. ADMIN: STATS
 * ------------------------------------------------------------------
 */
router.get(
  "/stats/overview",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const stats = await Appointment.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ message: "Error fetching statistics" });
    }
  }
);

/**
 * ------------------------------------------------------------------
 * 💊 6. STAFF VIEW
 * ------------------------------------------------------------------
 */
router.get(
  "/staff/upcoming",
  protect,
  authorizeRoles("admin", "pharmacist"),
  async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const appointments = await Appointment.find({
        date: { $gte: today },
        status: { $nin: ["cancelled", "completed"] },
      })
        .populate("user", "name phone")
        .populate("doctor", "name speciality")
        .sort({ date: 1, timeSlot: 1 });

      res.json(appointments);
    } catch (err) {
      res.status(500).json({ message: "Error fetching staff dashboard data" });
    }
  }
);

/**
 * ------------------------------------------------------------------
 * 🔄 7. UPDATE STATUS (Triggers Email to Customer)
 * ------------------------------------------------------------------
 */
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate("doctor")
      .populate("user", "name email");

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    // Permissions Check
    const isOwner = appointment.user._id.toString() === req.user._id.toString();
    const isStaff = ["admin", "pharmacist"].includes(req.user.role);

    if (!isOwner && !isStaff)
      return res.status(403).json({ message: "Not authorized" });

    if (!isStaff && status !== "cancelled") {
      return res
        .status(400)
        .json({ message: "Patients can only cancel appointments." });
    }

    appointment.status = status;
    await appointment.save();

    // ✅ 3. SEND TEMPLATE EMAIL (Status Update)
    if (["confirmed", "cancelled", "completed"].includes(status)) {
      const recipientEmail =
        appointment.user?.email || appointment.customerDetails?.email;

      const recipientName = appointment.user?.name || "Valued Customer";

      if (recipientEmail) {
        try {
          let emailSubject = `Appointment Update: ${status.toUpperCase()}`;
          let content = "";

          // Customize message based on status
          if (status === "confirmed") {
            emailSubject = "✅ Appointment Confirmed!";
            content = `
              Good news! Your appointment has been <strong>confirmed</strong>.<br><br>
              <strong>Ticket ID:</strong> ${appointment.bookingReference}<br>
              <strong>Doctor:</strong> Dr. ${appointment.doctor.name}<br>
              <strong>Date:</strong> ${new Date(
                appointment.date
              ).toDateString()}<br>
              <strong>Time:</strong> ${appointment.timeSlot}<br><br>
              Please arrive 10 minutes early.
            `;
          } else if (status === "cancelled") {
            emailSubject = "❌ Appointment Cancelled";
            content = `
              Your appointment with Dr. ${appointment.doctor.name} has been <strong>cancelled</strong>.<br>
              If this was a mistake, please book a new slot or contact support.
            `;
          } else {
            content = `Your appointment (${
              appointment.bookingReference
            }) with Dr. ${
              appointment.doctor.name
            } is now <strong>${status.toUpperCase()}</strong>.`;
          }

          // Wrap in template
          const htmlMessage = getEmailTemplate(recipientName, content);

          await sendEmail({
            email: recipientEmail,
            subject: emailSubject,
            message: htmlMessage, // Send the formatted HTML
          });
          console.log(
            `📧 Email sent to ${recipientEmail} for status: ${status}`
          );
        } catch (e) {
          console.warn("⚠️ Status update email failed:", e.message);
        }
      } else {
        console.warn("⚠️ No recipient email found for appointment update.");
      }
    }

    res.json({ success: true, appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Status update failed" });
  }
});

module.exports = router;
