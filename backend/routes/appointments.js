// // backend/routes/appointments.js
// const express = require("express");
// const Appointment = require("../models/Appointment");
// const authenticateToken = require("../middleware/auth");

// const router = express.Router();

// // Get all appointments (admin / pharmacist)
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const appointments = await Appointment.find()
//       .populate("customer", "name email")
//       .populate("doctor", "name speciality")
//       .sort({ appointmentDateTime: -1 });

//     res.json(appointments);
//   } catch (err) {
//     console.error("get appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get appointments for current user (customer)
// router.get("/my", authenticateToken, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ customer: req.user.id })
//       .populate("doctor", "name speciality")
//       .sort({ appointmentDateTime: -1 });

//     res.json(appointments);
//   } catch (err) {
//     console.error("get my appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Create appointment (customer)
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const { doctor, appointmentDateTime, timeSlot, notes } = req.body;

//     if (!doctor || !appointmentDateTime || !timeSlot) {
//       return res
//         .status(400)
//         .json({ message: "Doctor, date/time and timeSlot are required." });
//     }

//     const appointment = new Appointment({
//       customer: req.user.id,
//       customerName: req.user.name,
//       customerEmail: req.user.email,
//       doctor,
//       appointmentDateTime,
//       timeSlot,
//       status: "reserved",
//       notes,
//     });

//     await appointment.save();
//     res.status(201).json(appointment);
//   } catch (err) {
//     console.error("create appointment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// // backend/routes/appointments.js
// const express = require("express");
// const Appointment = require("../models/Appointment");
// const authenticateToken = require("../middleware/auth");

// const router = express.Router();

// // Get all appointments (admin / pharmacist)
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { date, doctor, status, page = 1, limit = 20 } = req.query;

//     const query = {};
//     if (date) {
//       const startDate = new Date(date);
//       const endDate = new Date(startDate);
//       endDate.setDate(endDate.getDate() + 1);
//       query.date = { $gte: startDate, $lt: endDate };
//     }
//     if (doctor) query.doctor = doctor;
//     if (status) query.status = status;

//     const [appointments, total] = await Promise.all([
//       Appointment.find(query)
//         .populate("customer", "name email phone")
//         .populate("doctor", "name speciality nmcNumber")
//         .sort({ date: -1, createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(Number(limit))
//         .lean(),
//       Appointment.countDocuments(query),
//     ]);

//     res.json({
//       appointments,
//       pagination: {
//         page: Number(page),
//         limit: Number(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     console.error("get appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get appointments for current user (customer)
// router.get("/my", authenticateToken, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ customer: req.user.id })
//       .populate("doctor", "name speciality nmcNumber")
//       .sort({ date: 1, timeSlot: 1 })
//       .lean();

//     res.json(appointments);
//   } catch (err) {
//     console.error("get my appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Create appointment (customer) - prevents double booking
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const { doctor, date, timeSlot, notes } = req.body;

//     if (!doctor || !date || !timeSlot) {
//       return res.status(400).json({
//         message: "Doctor, date, and timeSlot are required.",
//       });
//     }

//     // Model validation handles double-booking check automatically
//     const appointment = await Appointment.create({
//       customer: req.user.id,
//       doctor,
//       date: new Date(date),
//       timeSlot,
//       notes,
//     });

//     const populated = await Appointment.findById(appointment._id)
//       .populate("doctor", "name speciality")
//       .lean();

//     res.status(201).json({
//       message: "Appointment booked successfully",
//       appointment: populated,
//     });
//   } catch (err) {
//     if (err.message.includes("already booked")) {
//       return res.status(400).json({
//         message: err.message,
//       });
//     }
//     console.error("create appointment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Update appointment status (admin/pharmacist)
// router.put("/:id/status", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { status } = req.body;
//     if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     )
//       .populate("doctor", "name speciality")
//       .populate("customer", "name email")
//       .lean();

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.json({
//       message: "Appointment status updated",
//       appointment,
//     });
//   } catch (err) {
//     console.error("update appointment status error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Cancel appointment (customer or admin)
// router.put("/:id/cancel", authenticateToken, async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id);

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     // Only owner or admin/pharmacist can cancel
//     if (
//       appointment.customer.toString() !== req.user.id &&
//       !["admin", "pharmacist"].includes(req.user.role)
//     ) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     if (appointment.status === "cancelled") {
//       return res.status(400).json({ message: "Already cancelled" });
//     }

//     appointment.status = "cancelled";
//     await appointment.save();

//     const populated = await Appointment.findById(appointment._id)
//       .populate("doctor", "name speciality")
//       .lean();

//     res.json({
//       message: "Appointment cancelled",
//       appointment: populated,
//     });
//   } catch (err) {
//     console.error("cancel appointment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const Appointment = require("../models/Appointment");
// const authenticateToken = require("../middleware/auth");

// const router = express.Router();

// // ---------- NEW: Pharmacist dashboard route (fixes 404) ----------
// router.get("/pharmacist/appointments", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const appointments = await Appointment.find({
//       status: { $ne: "cancelled" },
//     })
//       .populate("customer", "name email")
//       .populate("doctor", "name speciality nmcNumber")
//       .select(
//         "customerName customerEmail doctorName doctorSpeciality doctorNMC date timeSlot status"
//       )
//       .sort({ date: 1, timeSlot: 1 })
//       .limit(20)
//       .lean();

//     // Transform for frontend
//     const formatted = appointments.map((a) => ({
//       _id: a._id,
//       customerName: a.customer?.name || "N/A",
//       customerEmail: a.customer?.email || "N/A",
//       doctorName: a.doctor?.name || "N/A",
//       doctorSpeciality: a.doctor?.speciality || "N/A",
//       doctorNMC: a.doctor?.nmcNumber || "N/A",
//       date: a.date ? new Date(a.date).toLocaleDateString() : "N/A",
//       timeSlot: a.timeSlot,
//       status: a.status,
//     }));

//     res.json(formatted);
//   } catch (err) {
//     console.error("pharmacist appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get all appointments (admin / pharmacist)
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { date, doctor, status, page = 1, limit = 20 } = req.query;

//     const query = {};
//     if (date) {
//       const startDate = new Date(date);
//       const endDate = new Date(startDate);
//       endDate.setDate(endDate.getDate() + 1);
//       query.date = { $gte: startDate, $lt: endDate };
//     }
//     if (doctor) query.doctor = doctor;
//     if (status) query.status = status;

//     const [appointments, total] = await Promise.all([
//       Appointment.find(query)
//         .populate("customer", "name email phone")
//         .populate("doctor", "name speciality nmcNumber")
//         .sort({ date: -1, createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(Number(limit))
//         .lean(),
//       Appointment.countDocuments(query),
//     ]);

//     res.json({
//       appointments,
//       pagination: {
//         page: Number(page),
//         limit: Number(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     console.error("get appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get appointments for current user (customer)
// router.get("/my", authenticateToken, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ customer: req.user.id })
//       .populate("doctor", "name speciality nmcNumber")
//       .sort({ date: 1, timeSlot: 1 })
//       .lean();

//     res.json(appointments);
//   } catch (err) {
//     console.error("get my appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Create appointment (customer) - prevents double booking
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const { doctor, date, timeSlot, notes } = req.body;

//     if (!doctor || !date || !timeSlot) {
//       return res.status(400).json({
//         message: "Doctor, date, and timeSlot are required.",
//       });
//     }

//     const appointment = await Appointment.create({
//       customer: req.user.id,
//       doctor,
//       date: new Date(date),
//       timeSlot,
//       notes,
//     });

//     const populated = await Appointment.findById(appointment._id)
//       .populate("doctor", "name speciality")
//       .lean();

//     res.status(201).json({
//       message: "Appointment booked successfully",
//       appointment: populated,
//     });
//   } catch (err) {
//     if (err.message.includes("already booked")) {
//       return res.status(400).json({
//         message: err.message,
//       });
//     }
//     console.error("create appointment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Update appointment status (admin/pharmacist)
// router.put("/:id/status", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { status } = req.body;
//     if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     )
//       .populate("doctor", "name speciality")
//       .populate("customer", "name email")
//       .lean();

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.json({
//       message: "Appointment status updated",
//       appointment,
//     });
//   } catch (err) {
//     console.error("update appointment status error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Cancel appointment (customer or admin)
// router.put("/:id/cancel", authenticateToken, async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id);

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     if (
//       appointment.customer.toString() !== req.user.id &&
//       !["admin", "pharmacist"].includes(req.user.role)
//     ) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     if (appointment.status === "cancelled") {
//       return res.status(400).json({ message: "Already cancelled" });
//     }

//     appointment.status = "cancelled";
//     await appointment.save();

//     const populated = await Appointment.findById(appointment._id)
//       .populate("doctor", "name speciality")
//       .lean();

//     res.json({
//       message: "Appointment cancelled",
//       appointment: populated,
//     });
//   } catch (err) {
//     console.error("cancel appointment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const Appointment = require("../models/Appointment");
// const Doctor = require("../models/Doctor");
// const authenticateToken = require("../middleware/auth");

// const router = express.Router();

// // ✅ NEW: Customer doctors route (FIXES time slot issue!)
// router.get("/doctors/customer/doctors", authenticateToken, async (req, res) => {
//   try {
//     const doctors = await Doctor.find({})
//       .select("name speciality nmcNumber isAvailable timeSlots")
//       .sort({ name: 1 })
//       .lean();
//     res.json(doctors);
//   } catch (err) {
//     console.error("Get customer doctors error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------- NEW: Pharmacist dashboard route (fixes 404) ----------
// router.get("/pharmacist/appointments", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const appointments = await Appointment.find({
//       status: { $ne: "cancelled" },
//     })
//       .populate("customer", "name email")
//       .populate("doctor", "name speciality nmcNumber")
//       .select(
//         "customerName customerEmail doctorName doctorSpeciality doctorNMC date timeSlot status"
//       )
//       .sort({ date: 1, timeSlot: 1 })
//       .limit(20)
//       .lean();

//     // Transform for frontend
//     const formatted = appointments.map((a) => ({
//       _id: a._id,
//       customerName: a.customer?.name || "N/A",
//       customerEmail: a.customer?.email || "N/A",
//       doctorName: a.doctor?.name || "N/A",
//       doctorSpeciality: a.doctor?.speciality || "N/A",
//       doctorNMC: a.doctor?.nmcNumber || "N/A",
//       date: a.date ? new Date(a.date).toLocaleDateString() : "N/A",
//       timeSlot: a.timeSlot,
//       status: a.status,
//     }));

//     res.json(formatted);
//   } catch (err) {
//     console.error("pharmacist appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get all appointments (admin / pharmacist)
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { date, doctor, status, page = 1, limit = 20 } = req.query;

//     const query = {};
//     if (date) {
//       const startDate = new Date(date);
//       const endDate = new Date(startDate);
//       endDate.setDate(endDate.getDate() + 1);
//       query.date = { $gte: startDate, $lt: endDate };
//     }
//     if (doctor) query.doctor = doctor;
//     if (status) query.status = status;

//     const [appointments, total] = await Promise.all([
//       Appointment.find(query)
//         .populate("customer", "name email phone")
//         .populate("doctor", "name speciality nmcNumber")
//         .sort({ date: -1, createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(Number(limit))
//         .lean(),
//       Appointment.countDocuments(query),
//     ]);

//     res.json({
//       appointments,
//       pagination: {
//         page: Number(page),
//         limit: Number(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     console.error("get appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get appointments for current user (customer)
// router.get("/my", authenticateToken, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ customer: req.user.id })
//       .populate("doctor", "name speciality nmcNumber")
//       .sort({ date: 1, timeSlot: 1 })
//       .lean();

//     res.json(appointments);
//   } catch (err) {
//     console.error("get my appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ IMPROVED: Create appointment with double-booking prevention
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const { doctor, date, timeSlot, notes } = req.body;

//     if (!doctor || !date || !timeSlot) {
//       return res.status(400).json({
//         message: "Doctor, date, and timeSlot are required.",
//       });
//     }

//     // ✅ CHECK: Doctor's time slot availability
//     const doctorDoc = await Doctor.findById(doctor).select("timeSlots");
//     if (!doctorDoc || !doctorDoc.timeSlots.includes(timeSlot)) {
//       return res.status(400).json({
//         message: `Time slot "${timeSlot}" not available for this doctor.`,
//       });
//     }

//     // ✅ PREVENT: Double booking check
//     const existingBooking = await Appointment.findOne({
//       doctor,
//       date: new Date(date),
//       timeSlot,
//       status: { $ne: "cancelled" },
//     });

//     if (existingBooking) {
//       return res.status(400).json({
//         message: `This time slot is already booked for ${existingBooking.customerName || "another customer"}.`,
//       });
//     }

//     // ✅ CHECK: Doctor availability
//     if (!doctorDoc.isAvailable) {
//       return res.status(400).json({
//         message: "Doctor is currently not available.",
//       });
//     }

//     const appointment = await Appointment.create({
//       customer: req.user.id,
//       customerName: req.user.name,
//       customerEmail: req.user.email,
//       doctor,
//       date: new Date(date),
//       timeSlot,
//       notes,
//       status: "pending",
//     });

//     const populated = await Appointment.findById(appointment._id)
//       .populate("doctor", "name speciality nmcNumber")
//       .lean();

//     res.status(201).json({
//       message: "Appointment booked successfully",
//       appointment: populated,
//     });
//   } catch (err) {
//     console.error("create appointment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Update appointment status (admin/pharmacist)
// router.put("/:id/status", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { status } = req.body;
//     if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     )
//       .populate("doctor", "name speciality")
//       .populate("customer", "name email")
//       .lean();

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.json({
//       message: "Appointment status updated",
//       appointment,
//     });
//   } catch (err) {
//     console.error("update appointment status error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Cancel appointment (customer or admin)
// router.put("/:id/cancel", authenticateToken, async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id);

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     if (
//       appointment.customer.toString() !== req.user.id &&
//       !["admin", "pharmacist"].includes(req.user.role)
//     ) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     if (appointment.status === "cancelled") {
//       return res.status(400).json({ message: "Already cancelled" });
//     }

//     appointment.status = "cancelled";
//     await appointment.save();

//     const populated = await Appointment.findById(appointment._id)
//       .populate("doctor", "name speciality")
//       .lean();

//     res.json({
//       message: "Appointment cancelled",
//       appointment: populated,
//     });
//   } catch (err) {
//     console.error("cancel appointment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const Appointment = require("../models/Appointment");
// const Doctor = require("../models/Doctor");
// const authenticateToken = require("../middleware/auth");

// const router = express.Router();

// /**
//  * NOTE:
//  * Customer doctors route is now in routes/doctor.js as:
//  *   GET /api/doctors/customer/doctors
//  * so you do NOT need it here under /api/appointments.
//  * Remove the old "/doctors/customer/doctors" route from this file.
//  */

// /**
//  * ---------- Pharmacist dashboard appointments ----------
//  * GET /api/appointments/pharmacist/appointments
//  */
// router.get("/pharmacist/appointments", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const appointments = await Appointment.find({
//       status: { $ne: "cancelled" },
//     })
//       .populate("customer", "name email")
//       .populate("doctor", "name speciality nmcNumber")
//       .sort({ date: 1, timeSlot: 1 })
//       .limit(20)
//       .lean();

//     const formatted = appointments.map((a) => ({
//       _id: a._id,
//       customerName: a.customer?.name || "N/A",
//       customerEmail: a.customer?.email || "N/A",
//       doctorName: a.doctor?.name || "N/A",
//       doctorSpeciality: a.doctor?.speciality || "N/A",
//       doctorNMC: a.doctor?.nmcNumber || "N/A",
//       date: a.date ? new Date(a.date).toLocaleDateString() : "N/A",
//       timeSlot: a.timeSlot,
//       status: a.status,
//     }));

//     res.json(formatted);
//   } catch (err) {
//     console.error("pharmacist appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * ---------- Admin/pharmacist: list with filters ----------
//  * GET /api/appointments
//  */
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { date, doctor, status, page = 1, limit = 20 } = req.query;

//     const query = {};
//     if (date) {
//       const startDate = new Date(date);
//       const endDate = new Date(startDate);
//       endDate.setDate(endDate.getDate() + 1);
//       query.date = { $gte: startDate, $lt: endDate };
//     }
//     if (doctor) query.doctor = doctor;
//     if (status) query.status = status;

//     const [appointments, total] = await Promise.all([
//       Appointment.find(query)
//         .populate("customer", "name email phone")
//         .populate("doctor", "name speciality nmcNumber")
//         .sort({ date: -1, createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(Number(limit))
//         .lean(),
//       Appointment.countDocuments(query),
//     ]);

//     res.json({
//       appointments,
//       pagination: {
//         page: Number(page),
//         limit: Number(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     console.error("get appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * ---------- Customer: my appointments ----------
//  * GET /api/appointments/my
//  */
// router.get("/my", authenticateToken, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ customer: req.user.id })
//       .populate("doctor", "name speciality nmcNumber")
//       .sort({ date: 1, timeSlot: 1 })
//       .lean();

//     res.json(appointments);
//   } catch (err) {
//     console.error("get my appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * ---------- Customer: create appointment ----------
//  * POST /api/appointments
//  */
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const { doctor, date, timeSlot, notes } = req.body;

//     if (!doctor || !date || !timeSlot) {
//       return res.status(400).json({
//         message: "Doctor, date, and timeSlot are required.",
//       });
//     }

//     // Check doctor's time slot availability + availability status
//     const doctorDoc = await Doctor.findById(doctor).select(
//       "timeSlots isAvailable"
//     );
//     if (!doctorDoc) {
//       return res.status(404).json({ message: "Doctor not found." });
//     }

//     if (!doctorDoc.timeSlots.includes(timeSlot)) {
//       return res.status(400).json({
//         message: `Time slot "${timeSlot}" not available for this doctor.`,
//       });
//     }

//     if (!doctorDoc.isAvailable) {
//       return res.status(400).json({
//         message: "Doctor is currently not available.",
//       });
//     }

//     // Prevent double booking
//     const existingBooking = await Appointment.findOne({
//       doctor,
//       date: new Date(date),
//       timeSlot,
//       status: { $ne: "cancelled" },
//     });

//     if (existingBooking) {
//       return res.status(400).json({
//         message: "This time slot is already booked for another customer.",
//       });
//     }

//     const appointment = await Appointment.create({
//       customer: req.user.id,
//       customerName: req.user.name,
//       customerEmail: req.user.email,
//       doctor,
//       date: new Date(date),
//       timeSlot,
//       notes,
//       status: "pending",
//     });

//     const populated = await Appointment.findById(appointment._id)
//       .populate("doctor", "name speciality nmcNumber")
//       .lean();

//     res.status(201).json({
//       message: "Appointment booked successfully",
//       appointment: populated,
//     });
//   } catch (err) {
//     console.error("create appointment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * ---------- Admin/pharmacist: update status ----------
//  * PUT /api/appointments/:id/status
//  */
// router.put("/:id/status", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { status } = req.body;
//     if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     )
//       .populate("doctor", "name speciality")
//       .populate("customer", "name email")
//       .lean();

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.json({
//       message: "Appointment status updated",
//       appointment,
//     });
//   } catch (err) {
//     console.error("update appointment status error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * ---------- Customer/admin/pharmacist: cancel ----------
//  * PUT /api/appointments/:id/cancel
//  */
// router.put("/:id/cancel", authenticateToken, async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id);

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     if (
//       appointment.customer.toString() !== req.user.id &&
//       !["admin", "pharmacist"].includes(req.user.role)
//     ) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     if (appointment.status === "cancelled") {
//       return res.status(400).json({ message: "Already cancelled" });
//     }

//     appointment.status = "cancelled";
//     await appointment.save();

//     const populated = await Appointment.findById(appointment._id)
//       .populate("doctor", "name speciality")
//       .lean();

//     res.json({
//       message: "Appointment cancelled",
//       appointment: populated,
//     });
//   } catch (err) {
//     console.error("cancel appointment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const Appointment = require("../models/Appointment");
// const Doctor = require("../models/Doctor");
// const authenticateToken = require("../middleware/auth");

// const router = express.Router();

// /**
//  * ---------- Pharmacist dashboard appointments ----------
//  * GET /api/appointments/pharmacist/appointments
//  */
// router.get("/pharmacist/appointments", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const appointments = await Appointment.find({
//       status: { $ne: "cancelled" },
//     })
//       .populate("customer", "name email")
//       .populate("doctor", "name speciality nmcNumber")
//       .sort({ date: 1, timeSlot: 1 })
//       .limit(20)
//       .lean();

//     const formatted = appointments.map((a) => ({
//       _id: a._id,
//       customerName: a.customer?.name || "N/A",
//       customerEmail: a.customer?.email || "N/A",
//       doctorName: a.doctor?.name || "N/A",
//       doctorSpeciality: a.doctor?.speciality || "N/A",
//       doctorNMC: a.doctor?.nmcNumber || "N/A",
//       date: a.date ? new Date(a.date).toLocaleDateString() : "N/A",
//       timeSlot: a.timeSlot,
//       status: a.status,
//     }));

//     res.json(formatted);
//   } catch (err) {
//     console.error("pharmacist appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * ---------- Admin/pharmacist: list with filters ----------
//  * GET /api/appointments
//  */
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { date, doctor, status, page = 1, limit = 20 } = req.query;

//     const query = {};
//     if (date) {
//       const startDate = new Date(date);
//       const endDate = new Date(startDate);
//       endDate.setDate(endDate.getDate() + 1);
//       query.date = { $gte: startDate, $lt: endDate };
//     }
//     if (doctor) query.doctor = doctor;
//     if (status) query.status = status;

//     const [appointments, total] = await Promise.all([
//       Appointment.find(query)
//         .populate("customer", "name email phone")
//         .populate("doctor", "name speciality nmcNumber")
//         .sort({ date: -1, createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(Number(limit))
//         .lean(),
//       Appointment.countDocuments(query),
//     ]);

//     res.json({
//       appointments,
//       pagination: {
//         page: Number(page),
//         limit: Number(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     console.error("get appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * ---------- Customer: my appointments ----------
//  * GET /api/appointments/my
//  */
// router.get("/my", authenticateToken, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ customer: req.user.id })
//       .populate("doctor", "name speciality nmcNumber")
//       .sort({ date: 1, timeSlot: 1 })
//       .lean();

//     res.json(appointments);
//   } catch (err) {
//     console.error("get my appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * ---------- Customer: create appointment ----------
//  * POST /api/appointments
//  */
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const { doctor, date, timeSlot, notes } = req.body;

//     if (!doctor || !date || !timeSlot) {
//       return res.status(400).json({
//         message: "Doctor, date, and timeSlot are required.",
//       });
//     }

//     // normalize to date-only (midnight) so comparisons are consistent
//     const day = new Date(date);
//     day.setHours(0, 0, 0, 0);

//     // Check doctor's time slot availability + availability status
//     const doctorDoc = await Doctor.findById(doctor).select(
//       "timeSlots isAvailable"
//     );
//     if (!doctorDoc) {
//       return res.status(404).json({ message: "Doctor not found." });
//     }

//     if (!doctorDoc.timeSlots.includes(timeSlot)) {
//       return res.status(400).json({
//         message: `Time slot "${timeSlot}" not available for this doctor.`,
//       });
//     }

//     if (!doctorDoc.isAvailable) {
//       return res.status(400).json({
//         message: "Doctor is currently not available.",
//       });
//     }

//     // Prevent double booking for same doctor + day + timeSlot
//     const existingBooking = await Appointment.findOne({
//       doctor,
//       date: day,
//       timeSlot,
//       status: { $ne: "cancelled" },
//     });

//     if (existingBooking) {
//       return res.status(400).json({
//         message: "This time slot is already booked for another customer.",
//       });
//     }

//     const appointment = await Appointment.create({
//       customer: req.user.id,
//       customerName: req.user.name,
//       customerEmail: req.user.email,
//       doctor,
//       date: day,
//       timeSlot,
//       notes,
//       status: "pending",
//     });

//     const populated = await Appointment.findById(appointment._id)
//       .populate("doctor", "name speciality nmcNumber")
//       .lean();

//     res.status(201).json({
//       message: "Appointment booked successfully",
//       appointment: populated,
//     });
//   } catch (err) {
//     console.error("create appointment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * ---------- Admin/pharmacist: update status ----------
//  * PUT /api/appointments/:id/status
//  */
// router.put("/:id/status", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { status } = req.body;
//     if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     )
//       .populate("doctor", "name speciality")
//       .populate("customer", "name email")
//       .lean();

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.json({
//       message: "Appointment status updated",
//       appointment,
//     });
//   } catch (err) {
//     console.error("update appointment status error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * ---------- Customer/admin/pharmacist: cancel ----------
//  * PUT /api/appointments/:id/cancel
//  */
// router.put("/:id/cancel", authenticateToken, async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id);

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     if (
//       appointment.customer.toString() !== req.user.id &&
//       !["admin", "pharmacist"].includes(req.user.role)
//     ) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     if (appointment.status === "cancelled") {
//       return res.status(400).json({ message: "Already cancelled" });
//     }

//     appointment.status = "cancelled";
//     await appointment.save();

//     const populated = await Appointment.findById(appointment._id)
//       .populate("doctor", "name speciality")
//       .lean();

//     res.json({
//       message: "Appointment cancelled",
//       appointment: populated,
//     });
//   } catch (err) {
//     console.error("cancel appointment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

/**
 * ---------- Pharmacist dashboard appointments ----------
 * GET /api/appointments/pharmacist/appointments
 */
router.get("/pharmacist/appointments", authenticateToken, async (req, res) => {
  try {
    if (!["pharmacist", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const appointments = await Appointment.find({
      status: { $ne: "cancelled" },
    })
      .populate("customer", "name email")
      .populate("doctor", "name speciality nmcNumber")
      .sort({ date: 1, timeSlot: 1 })
      .limit(20)
      .lean();

    const formatted = appointments.map((a) => ({
      _id: a._id,
      customerName: a.customer?.name || "N/A",
      customerEmail: a.customer?.email || "N/A",
      doctorName: a.doctor?.name || "N/A",
      doctorSpeciality: a.doctor?.speciality || "N/A",
      doctorNMC: a.doctor?.nmcNumber || "N/A",
      date: a.date ? new Date(a.date).toLocaleDateString() : "N/A",
      timeSlot: a.timeSlot, // kept for UI compatibility
      status: a.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("pharmacist appointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ---------- Admin/pharmacist: list with filters ----------
 * GET /api/appointments
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    if (!["admin", "pharmacist"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }

    const { date, doctor, status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    if (doctor) query.doctor = doctor;
    if (status) query.status = status;

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate("customer", "name email phone")
        .populate("doctor", "name speciality nmcNumber")
        .sort({ date: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      Appointment.countDocuments(query),
    ]);

    res.json({
      appointments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("get appointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ---------- Customer: my appointments ----------
 * GET /api/appointments/my
 */
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ customer: req.user.id })
      .populate("doctor", "name speciality nmcNumber")
      .sort({ date: 1, timeSlot: 1 })
      .lean();

    res.json(appointments);
  } catch (err) {
    console.error("get my appointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ---------- Customer: create appointment ----------
 * POST /api/appointments
 * expects: { doctor, date, startTime, endTime, notes }
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { doctor, date, startTime, endTime, notes } = req.body;

    if (!doctor || !date || !startTime || !endTime) {
      return res.status(400).json({
        message: "Doctor, date, startTime and endTime are required.",
      });
    }

    // normalize to date-only
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);

    const doctorDoc = await Doctor.findById(doctor);
    if (!doctorDoc) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    if (!doctorDoc.isAvailable) {
      return res
        .status(400)
        .json({ message: "Doctor is currently not available." });
    }

    // find matching slot in doctor's slots
    const slot = doctorDoc.slots.find((s) => {
      if (!s.date) return false;
      const sDay = new Date(s.date);
      sDay.setHours(0, 0, 0, 0);
      return (
        sDay.getTime() === day.getTime() &&
        s.startTime === startTime &&
        s.endTime === endTime
      );
    });

    if (!slot) {
      return res.status(400).json({
        message: "Selected slot is not available for this doctor.",
      });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        message: "This time slot is already booked.",
      });
    }

    // optional: double-check in Appointment collection
    const existingBooking = await Appointment.findOne({
      doctor,
      date: day,
      timeSlot: `${startTime}-${endTime}`,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "This time slot is already booked for another customer.",
      });
    }

    // mark slot as booked
    slot.isBooked = true;
    await doctorDoc.save();

    const appointment = await Appointment.create({
      customer: req.user.id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      doctor,
      date: day,
      timeSlot: `${startTime}-${endTime}`, // keep legacy field
      notes,
      status: "pending",
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("doctor", "name speciality nmcNumber")
      .lean();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: populated,
    });
  } catch (err) {
    console.error("create appointment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ---------- Admin/pharmacist: update status ----------
 * PUT /api/appointments/:id/status
 */
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    if (!["admin", "pharmacist"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }

    const { status } = req.body;
    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("doctor", "name speciality")
      .populate("customer", "name email")
      .lean();

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment status updated",
      appointment,
    });
  } catch (err) {
    console.error("update appointment status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ---------- Customer/admin/pharmacist: cancel ----------
 * PUT /api/appointments/:id/cancel
 */
router.put("/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      appointment.customer.toString() !== req.user.id &&
      !["admin", "pharmacist"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    // free the corresponding slot on the doctor
    try {
      const doctorDoc = await Doctor.findById(appointment.doctor);
      if (doctorDoc) {
        const [start, end] = String(appointment.timeSlot || "").split("-");
        const apptDay = new Date(appointment.date);
        apptDay.setHours(0, 0, 0, 0);

        const slot = doctorDoc.slots.find((s) => {
          if (!s.date) return false;
          const sDay = new Date(s.date);
          sDay.setHours(0, 0, 0, 0);
          return (
            sDay.getTime() === apptDay.getTime() &&
            s.startTime === start &&
            s.endTime === end
          );
        });

        if (slot && slot.isBooked) {
          slot.isBooked = false;
          await doctorDoc.save();
        }
      }
    } catch (slotErr) {
      console.error("error freeing doctor slot on cancel:", slotErr);
      // do not fail the cancel just because freeing slot failed
    }

    const populated = await Appointment.findById(appointment._id)
      .populate("doctor", "name speciality")
      .lean();

    res.json({
      message: "Appointment cancelled",
      appointment: populated,
    });
  } catch (err) {
    console.error("cancel appointment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
