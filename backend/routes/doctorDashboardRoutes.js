const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");

const {
  getDoctorAppointments,
  updateAppointmentStatus,
  getDoctorPatients,
} = require("../controllers/appointmentController");

// 🔒 Apply security middleware to all routes in this file
router.use(protect);
router.use(authorizeRoles("doctor", "admin")); // Admins can also view this if needed

// -------------------------------------------------------------------
// 🩺 DOCTOR DASHBOARD ROUTES (Mounted at /api/doctor)
// -------------------------------------------------------------------

// 1. Get Doctor's Appointments
router.get("/appointments", getDoctorAppointments);

// 2. Update Appointment Status (Approve/Complete)
router.put("/appointments/:id/status", updateAppointmentStatus);

// 3. Get Unique Patients List
router.get("/patients", getDoctorPatients);

module.exports = router;
