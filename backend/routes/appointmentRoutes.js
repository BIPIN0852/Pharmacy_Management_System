const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { protect, admin, pharmacist } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");
const sendEmail = require("../utils/sendEmail");
const { getEmailTemplate } = require("../utils/emailTemplates");

// Set capacity to 1 to strictly enforce one patient per time slot
const SLOT_CAPACITY = 1;

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

    // PREVENT DOUBLE BOOKING: Check if anyone else already has this slot
    const slotAlreadyTaken = await Appointment.findOne({
      doctor,
      date: bookingDate,
      timeSlot,
      status: { $in: ["pending", "confirmed"] }, // Ignore cancelled ones
    });

    if (slotAlreadyTaken) {
      return res.status(400).json({
        message:
          "This time slot is already booked. Please choose another time.",
      });
    }

    // Check if the current user already has an appointment
    const existingUserBooking = await Appointment.findOne({
      user: req.user._id,
      doctor,
      date: bookingDate,
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (existingUserBooking) {
      return res.status(400).json({
        message: "You already have an active booking for this time slot.",
      });
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

    // 2. SEND TEMPLATE EMAIL (Booking Request)
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
  },
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
  },
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
  },
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

    // 3. SEND TEMPLATE EMAIL (Status Update)
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
                appointment.date,
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
            `📧 Email sent to ${recipientEmail} for status: ${status}`,
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
