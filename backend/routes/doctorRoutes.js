const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Models
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// Middleware
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");

// Controllers
const {
  getDoctorAppointments,
  updateAppointmentStatus,
  getDoctorPatients,
  deleteAppointment, // ✅ IMPORTED the delete function from appointmentController
} = require("../controllers/appointmentController");

// IMPORT the prescription controller for the doctor route
const {
  createDigitalPrescription,
} = require("../controllers/prescriptionController");

// ✅ IMPORT the AI controller for smart features
const {
  generateSmartReplies,
  summarizeChat,
} = require("../controllers/aiController");

// -------------------------------------------------------------------
// 🛠️ SHARED VALIDATORS
// -------------------------------------------------------------------
const slotValidators = [
  body("slots")
    .optional()
    .isArray()
    .withMessage("Slots must be an array")
    .custom((slots) => {
      if (!slots || slots.length === 0) return true;

      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM format

      return slots.every((slot) => {
        const validDays = [
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ];
        if (!slot.day || !validDays.includes(slot.day.toUpperCase()))
          return false;
        if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime))
          return false;

        return slot.startTime < slot.endTime;
      });
    })
    .withMessage(
      "Invalid slot data. Ensure days are valid and times are in HH:MM (24h) format.",
    ),
];

// ===================================================================
// 🚨 PART 1: EXACT MATCH ROUTES (MUST BE AT THE TOP)
// ===================================================================

// 👉 DOCTOR DASHBOARD: GET APPOINTMENTS
router.get(
  "/appointments",
  protect,
  authorizeRoles("doctor"),
  getDoctorAppointments,
);

// 👉 DOCTOR DASHBOARD: GET PATIENTS
router.get("/patients", protect, authorizeRoles("doctor"), getDoctorPatients);

// 👉 DOCTOR ACTION: CREATE DIGITAL PRESCRIPTION
router.post(
  "/prescriptions/create",
  protect,
  authorizeRoles("doctor"),
  createDigitalPrescription,
);

// 👉 DOCTOR DASHBOARD: GET OWN PROFILE
router.get(
  "/profile/me",
  protect,
  authorizeRoles("doctor"),
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({
        $or: [{ userId: req.user._id }, { email: req.user.email }],
      });
      if (!doctor)
        return res
          .status(404)
          .json({ message: "Profile not found. Please contact admin." });
      res.json({ doctor });
    } catch (error) {
      res.status(500).json({ message: "Server error fetching profile" });
    }
  },
);

// 👉 DOCTOR DASHBOARD: UPDATE OWN PROFILE
router.put(
  "/profile/me",
  protect,
  authorizeRoles("doctor"),
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({
        $or: [{ userId: req.user._id }, { email: req.user.email }],
      });
      if (!doctor)
        return res.status(404).json({ message: "Profile not found" });

      // We allow doctors to update these specific fields
      const {
        name,
        phone,
        experience,
        consultationFee,
        image,
        isAvailable,
        slots,
      } = req.body;

      if (name) doctor.name = name;
      if (phone) doctor.phone = phone;
      if (experience !== undefined) doctor.experience = experience;
      if (consultationFee !== undefined)
        doctor.consultationFee = consultationFee;
      if (image !== undefined) doctor.image = image;
      if (typeof isAvailable === "boolean") doctor.isAvailable = isAvailable;
      if (slots) doctor.slots = slots;

      await doctor.save();
      res.json({
        success: true,
        message: "Profile updated successfully!",
        doctor,
      });
    } catch (error) {
      console.error("Profile Update Error:", error);
      res.status(500).json({ message: "Server error updating profile" });
    }
  },
);

// 👉 ADMIN: GET STATS
router.get(
  "/admin/stats",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const totalDoctors = await Doctor.countDocuments();
      const availableDoctors = await Doctor.countDocuments({
        isAvailable: true,
      });

      const stats = await Doctor.aggregate([
        { $group: { _id: "$speciality", count: { $sum: 1 } } },
      ]);

      res.json({
        total: totalDoctors,
        available: availableDoctors,
        bySpeciality: stats,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching doctor stats" });
    }
  },
);

// 👉 PUBLIC DIRECTORY: GET ALL DOCTORS
router.get("/", async (req, res) => {
  try {
    const { speciality, search } = req.query;
    let query = { isAvailable: true };

    if (speciality) query.speciality = speciality;
    if (search) query.name = { $regex: search, $options: "i" };

    const doctors = await Doctor.find(query)
      .select(
        "name speciality nmcNumber slots experience consultationFee phone image",
      )
      .sort({ name: 1 })
      .lean();

    res.json(doctors);
  } catch (error) {
    console.error("❌ Fetch Directory Error:", error);
    res.status(500).json({ message: "Error fetching medical directory" });
  }
});

// 👉 ADMIN: CREATE DOCTOR
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  [
    body("name").trim().notEmpty().withMessage("Doctor name is required"),
    body("speciality").trim().notEmpty().withMessage("Speciality is required"),
    body("nmcNumber")
      .trim()
      .notEmpty()
      .withMessage("NMC Registration number is required"),
    body("phone").trim().notEmpty().withMessage("Contact number is required"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please provide a valid email"),
    body("experience")
      .optional()
      .isNumeric()
      .withMessage("Experience must be a number"),
    body("consultationFee")
      .optional()
      .isNumeric()
      .withMessage("Fee must be a number"),
    ...slotValidators,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { nmcNumber, email } = req.body;

      // Check for existing doctor by NMC or Email
      const existingDoctor = await Doctor.findOne({
        $or: [{ nmcNumber }, { email: email?.toLowerCase() }],
      });

      if (existingDoctor) {
        return res.status(400).json({
          message: "A doctor with this NMC number or email already exists.",
        });
      }

      const doctor = await Doctor.create({
        ...req.body,
        email: email?.toLowerCase(),
      });

      res.status(201).json({
        success: true,
        message: "Doctor profile created successfully",
        doctor,
      });
    } catch (error) {
      console.error("❌ Create Doctor Error:", error);
      res.status(500).json({
        message: "Internal server error while creating doctor profile",
      });
    }
  },
);

// ===================================================================
// 🚨 PART 2: NESTED DYNAMIC ROUTES
// ===================================================================

// 👉 DOCTOR DASHBOARD: UPDATE APPOINTMENT STATUS
router.put(
  "/appointments/:id/status",
  protect,
  authorizeRoles("doctor"),
  updateAppointmentStatus,
);

// 👉 DOCTOR DASHBOARD: DELETE APPOINTMENT
router.delete(
  "/appointments/:id",
  protect,
  authorizeRoles("doctor"),
  deleteAppointment,
);

// 👉 AI FEATURES: Chat Summarization & Smart Replies
router.get(
  "/ai/smart-replies/:appointmentId",
  protect,
  authorizeRoles("doctor"),
  generateSmartReplies,
);

router.get(
  "/ai/summarize/:appointmentId",
  protect,
  authorizeRoles("doctor"),
  summarizeChat,
);

// ===================================================================
// 🚨 PART 3: ROOT DYNAMIC ROUTES (MUST BE AT THE VERY BOTTOM)
// ===================================================================

// 👉 ADMIN: UPDATE DOCTOR
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  [
    body("name").optional().trim().notEmpty(),
    body("phone").optional().trim().notEmpty(),
    ...slotValidators,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });

      if (req.body.nmcNumber && req.body.nmcNumber !== doctor.nmcNumber) {
        const duplicate = await Doctor.findOne({
          nmcNumber: req.body.nmcNumber,
        });
        if (duplicate)
          return res.status(400).json({
            message: "NMC number is already assigned to another doctor",
          });
      }

      const updatedDoctor = await Doctor.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true },
      );

      res.json({
        success: true,
        message: "Doctor updated successfully",
        doctor: updatedDoctor,
      });
    } catch (error) {
      console.error("❌ Update Doctor Error:", error);
      res.status(500).json({ message: "Server error updating profile" });
    }
  },
);

// 👉 ADMIN: TOGGLE AVAILABILITY
router.patch(
  "/:id/availability",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });

      doctor.isAvailable = !doctor.isAvailable;
      await doctor.save();

      res.json({
        success: true,
        message: `Doctor is now ${doctor.isAvailable ? "Available" : "Unavailable"}`,
        isAvailable: doctor.isAvailable,
      });
    } catch (error) {
      res.status(500).json({ message: "Error toggling status" });
    }
  },
);

// 👉 ADMIN: DELETE DOCTOR
router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const activeAppointments = await Appointment.countDocuments({
      doctor: req.params.id,
      status: { $in: ["pending", "confirmed"] },
    });

    if (activeAppointments > 0) {
      return res.status(400).json({
        message: `Cannot delete. This doctor has ${activeAppointments} active appointments.`,
      });
    }

    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json({ success: true, message: "Doctor record removed from registry" });
  } catch (error) {
    console.error("❌ Delete Doctor Error:", error);
    res.status(500).json({ message: "Server error during deletion" });
  }
});

// 👉 PUBLIC: GET DOCTOR BY ID (Catch-all for IDs)
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).lean();
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json(doctor);
  } catch (error) {
    console.error("❌ Fetch Doctor Detail Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
