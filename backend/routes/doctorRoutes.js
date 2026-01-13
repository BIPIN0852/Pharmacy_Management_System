// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const authenticateAdmin = require("../middleware/authAdmin"); // Adjust or remove if you don't have admin auth
// const Doctor = require("../models/Doctor");

// const router = express.Router();

// // POST /api/doctor - Create a new doctor (protected route, admin only)
// router.post(
//   "/",
//   authenticateAdmin, // Remove this middleware if no admin auth is setup
//   [
//     body("name").notEmpty().withMessage("Name is required"),
//     body("speciality").notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber").notEmpty().withMessage("NMC Number is required"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const { name, speciality, nmcNumber } = req.body;

//       // Check if doctor with this NMC number already exists
//       const existingDoctor = await Doctor.findOne({ nmcNumber });
//       if (existingDoctor) {
//         return res.status(400).json({ message: "Doctor already exists" });
//       }

//       const doctor = new Doctor({
//         name,
//         speciality,
//         nmcNumber,
//       });

//       await doctor.save();

//       return res.status(201).json({ message: "Doctor created", doctor });
//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // GET /api/doctor - Get list of all doctors (public or protected as you prefer)
// router.get("/", async (req, res) => {
//   try {
//     const doctors = await Doctor.find({});
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const authenticateAdmin = require("../middleware/authAdmin");
// const authenticateToken = require("../middleware/auth");
// const Doctor = require("../models/Doctor");

// const router = express.Router();

// // POST /api/doctors - Create a new doctor (admin only)
// router.post(
//   "/",
//   authenticateAdmin,
//   [
//     body("name").notEmpty().withMessage("Name is required"),
//     body("speciality").notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber").notEmpty().withMessage("NMC Number is required"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const { name, speciality, nmcNumber, isAvailable = true } = req.body;

//       // Check duplicate NMC
//       const existing = await Doctor.findOne({ nmcNumber });
//       if (existing) {
//         return res.status(400).json({ message: "Doctor already exists" });
//       }

//       const doctor = new Doctor({ name, speciality, nmcNumber, isAvailable });
//       await doctor.save();

//       return res.status(201).json({ message: "Doctor created", doctor });
//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // GET /api/doctors - Get all doctors (public)
// router.get("/", async (req, res) => {
//   try {
//     const doctors = await Doctor.find({})
//       .select("name speciality nmcNumber isAvailable")
//       .sort({ name: 1 });
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/doctors/pharmacist/doctors - Pharmacist/admin access only
// router.get("/pharmacist/doctors", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     const doctors = await Doctor.find({})
//       .select("name speciality nmcNumber isAvailable")
//       .sort({ name: 1 });
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching pharmacist doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ NEW: GET /api/doctors/customer/doctors - Customer booking dropdown (FIXES "Failed to load data")
// router.get("/customer/doctors", authenticateToken, async (req, res) => {
//   try {
//     // Customers see only available doctors for booking
//     const doctors = await Doctor.find({ isAvailable: true })
//       .select("name speciality nmcNumber")
//       .sort({ name: 1 })
//       .lean();

//     res.json(doctors);
//   } catch (error) {
//     console.error("customer doctors error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const authenticateAdmin = require("../middleware/authAdmin");
// const authenticateToken = require("../middleware/auth");
// const Doctor = require("../models/Doctor");

// const router = express.Router();

// // POST /api/doctors - Create a new doctor (admin only)
// router.post(
//   "/",
//   authenticateAdmin,
//   [
//     body("name").notEmpty().withMessage("Name is required"),
//     body("speciality").notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber").notEmpty().withMessage("NMC Number is required"),
//     // ✅ NEW: timeSlots validation
//     body("timeSlots")
//       .optional()
//       .isArray({ min: 1 })
//       .withMessage("timeSlots must be a non-empty array")
//       .custom((value) => {
//         // Validate time slot format: "HH:MM-HH:MM"
//         return value.every((slot) =>
//           /^(\d{2}:\d{2})-(\d{2}:\d{2})$/.test(slot)
//         );
//       })
//       .withMessage("Invalid time slot format. Use HH:MM-HH:MM"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const {
//         name,
//         speciality,
//         nmcNumber,
//         timeSlots = [],
//         isAvailable = true,
//       } = req.body;

//       // Check duplicate NMC
//       const existing = await Doctor.findOne({ nmcNumber });
//       if (existing) {
//         return res
//           .status(400)
//           .json({ message: "Doctor with this NMC number already exists" });
//       }

//       const doctor = new Doctor({
//         name,
//         speciality,
//         nmcNumber,
//         timeSlots, // ✅ Saves doctor's available time slots
//         isAvailable,
//       });
//       await doctor.save();

//       const populatedDoctor = await Doctor.findById(doctor._id).select("-__v");

//       return res.status(201).json({
//         message: "Doctor created successfully",
//         doctor: populatedDoctor,
//       });
//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ✅ UPDATED: PUT /api/doctors/:id - Update doctor (admin only)
// router.put(
//   "/:id",
//   authenticateAdmin,
//   [
//     body("name").notEmpty().withMessage("Name is required"),
//     body("speciality").notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber").notEmpty().withMessage("NMC Number is required"),
//     body("timeSlots")
//       .optional()
//       .isArray()
//       .withMessage("timeSlots must be an array")
//       .custom((value) => {
//         if (!value || value.length === 0) return true; // Allow empty array
//         return value.every((slot) =>
//           /^(\d{2}:\d{2})-(\d{2}:\d{2})$/.test(slot)
//         );
//       })
//       .withMessage("Invalid time slot format. Use HH:MM-HH:MM"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const {
//         name,
//         speciality,
//         nmcNumber,
//         timeSlots = [],
//         isAvailable,
//       } = req.body;
//       const doctorId = req.params.id;

//       // Check if doctor exists
//       const doctor = await Doctor.findById(doctorId);
//       if (!doctor) {
//         return res.status(404).json({ message: "Doctor not found" });
//       }

//       // Check duplicate NMC (excluding current doctor)
//       const existing = await Doctor.findOne({
//         nmcNumber,
//         _id: { $ne: doctorId },
//       });
//       if (existing) {
//         return res
//           .status(400)
//           .json({ message: "NMC number already exists for another doctor" });
//       }

//       // Update doctor
//       doctor.name = name;
//       doctor.speciality = speciality;
//       doctor.nmcNumber = nmcNumber;
//       doctor.timeSlots = timeSlots; // ✅ Updates doctor's available time slots
//       if (isAvailable !== undefined) {
//         doctor.isAvailable = isAvailable;
//       }

//       await doctor.save();

//       const populatedDoctor = await Doctor.findById(doctorId).select("-__v");

//       return res.json({
//         message: "Doctor updated successfully",
//         doctor: populatedDoctor,
//       });
//     } catch (error) {
//       console.error("Error updating doctor:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // DELETE /api/doctors/:id - Delete doctor (admin only)
// router.delete("/:id", authenticateAdmin, async (req, res) => {
//   try {
//     const doctor = await Doctor.findByIdAndDelete(req.params.id);
//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }
//     res.json({ message: "Doctor deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting doctor:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/doctors - Get all doctors (public - for basic info)
// router.get("/", async (req, res) => {
//   try {
//     const doctors = await Doctor.find({})
//       .select("name speciality nmcNumber isAvailable")
//       .sort({ name: 1 });
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/doctors/pharmacist/doctors - Pharmacist/admin access (full info)
// router.get("/pharmacist/doctors", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     const doctors = await Doctor.find({})
//       .select("name speciality nmcNumber isAvailable timeSlots") // ✅ Include timeSlots
//       .sort({ name: 1 });
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching pharmacist doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ UPDATED: GET /api/doctors/customer/doctors - Customer booking (includes timeSlots)
// router.get("/customer/doctors", authenticateToken, async (req, res) => {
//   try {
//     // Customers see only available doctors with their time slots
//     const doctors = await Doctor.find({ isAvailable: true })
//       .select("name speciality nmcNumber timeSlots") // ✅ Critical: include timeSlots!
//       .sort({ name: 1 })
//       .lean();

//     res.json(doctors);
//   } catch (error) {
//     console.error("customer doctors error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const authenticateAdmin = require("../middleware/authAdmin");
// const authenticateToken = require("../middleware/auth");
// const Doctor = require("../models/Doctor");

// const router = express.Router();

// // POST /api/doctors - Create a new doctor (admin only)
// router.post(
//   "/",
//   authenticateAdmin,
//   [
//     body("name").notEmpty().withMessage("Name is required"),
//     body("speciality").notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber").notEmpty().withMessage("NMC Number is required"),
//     // ✅ IMPROVED: timeSlots validation (allow empty array)
//     body("timeSlots")
//       .optional()
//       .isArray()
//       .withMessage("timeSlots must be an array")
//       .custom((value) => {
//         if (!value || value.length === 0) return true; // ✅ Allow empty array
//         return value.every((slot) =>
//           /^(\d{2}:\d{2})-(\d{2}:\d{2})$/.test(slot)
//         );
//       })
//       .withMessage("Invalid time slot format. Use HH:MM-HH:MM"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const {
//         name,
//         speciality,
//         nmcNumber,
//         timeSlots = [],
//         isAvailable = true,
//       } = req.body;

//       // Check duplicate NMC
//       const existing = await Doctor.findOne({ nmcNumber });
//       if (existing) {
//         return res
//           .status(400)
//           .json({ message: "Doctor with this NMC number already exists" });
//       }

//       const doctor = new Doctor({
//         name,
//         speciality,
//         nmcNumber,
//         timeSlots, // ✅ Saves doctor's available time slots
//         isAvailable,
//       });
//       await doctor.save();

//       const populatedDoctor = await Doctor.findById(doctor._id).select("-__v");

//       return res.status(201).json({
//         message: "Doctor created successfully",
//         doctor: populatedDoctor,
//       });
//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ✅ FIXED: PUT /api/doctors/:id - Update doctor (admin only)
// router.put(
//   "/:id",
//   authenticateAdmin,
//   [
//     body("name")
//       .optional({ checkFalsy: true })
//       .notEmpty()
//       .withMessage("Name is required"),
//     body("speciality")
//       .optional({ checkFalsy: true })
//       .notEmpty()
//       .withMessage("Speciality is required"),
//     body("nmcNumber")
//       .optional({ checkFalsy: true })
//       .notEmpty()
//       .withMessage("NMC Number is required"),
//     body("timeSlots")
//       .optional()
//       .isArray()
//       .withMessage("timeSlots must be an array")
//       .custom((value) => {
//         if (!value || value.length === 0) return true; // ✅ Allow empty array
//         return value.every((slot) =>
//           /^(\d{2}:\d{2})-(\d{2}:\d{2})$/.test(slot)
//         );
//       })
//       .withMessage("Invalid time slot format. Use HH:MM-HH:MM"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const {
//         name,
//         speciality,
//         nmcNumber,
//         timeSlots = [],
//         isAvailable,
//       } = req.body;
//       const doctorId = req.params.id;

//       // Check if doctor exists
//       const doctor = await Doctor.findById(doctorId);
//       if (!doctor) {
//         return res.status(404).json({ message: "Doctor not found" });
//       }

//       // Check duplicate NMC (excluding current doctor)
//       const existing = await Doctor.findOne({
//         nmcNumber,
//         _id: { $ne: doctorId },
//       });
//       if (existing) {
//         return res
//           .status(400)
//           .json({ message: "NMC number already exists for another doctor" });
//       }

//       // Update doctor
//       doctor.name = name;
//       doctor.speciality = speciality;
//       doctor.nmcNumber = nmcNumber;
//       doctor.timeSlots = timeSlots; // ✅ Updates doctor's available time slots
//       if (isAvailable !== undefined) {
//         doctor.isAvailable = isAvailable;
//       }

//       await doctor.save();

//       const populatedDoctor = await Doctor.findById(doctorId).select("-__v");

//       return res.json({
//         message: "Doctor updated successfully",
//         doctor: populatedDoctor,
//       });
//     } catch (error) {
//       console.error("Error updating doctor:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // DELETE /api/doctors/:id - Delete doctor (admin only)
// router.delete("/:id", authenticateAdmin, async (req, res) => {
//   try {
//     // ✅ IMPROVED: Check for active appointments before deletion
//     const activeAppointments = await Appointment.countDocuments({
//       doctor: req.params.id,
//       status: { $ne: "cancelled" },
//     });

//     if (activeAppointments > 0) {
//       return res.status(400).json({
//         message: "Cannot delete doctor with active appointments",
//         activeCount: activeAppointments,
//       });
//     }

//     const doctor = await Doctor.findByIdAndDelete(req.params.id);
//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }
//     res.json({ message: "Doctor deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting doctor:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ FIXED: GET /api/doctors - Public access (basic info, no auth)
// router.get("/", async (req, res) => {
//   try {
//     const doctors = await Doctor.find({})
//       .select("name speciality nmcNumber isAvailable")
//       .sort({ name: 1 })
//       .lean();
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/doctors/pharmacist/doctors - Pharmacist/admin access (full info)
// router.get("/pharmacist/doctors", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     const doctors = await Doctor.find({})
//       .select("name speciality nmcNumber isAvailable timeSlots")
//       .sort({ name: 1 })
//       .lean();
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching pharmacist doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ CRITICAL FIX: GET /api/doctors/customer/doctors - Customer booking (includes timeSlots)
// router.get("/customer/doctors", authenticateToken, async (req, res) => {
//   try {
//     // Customers see only available doctors with their time slots
//     const doctors = await Doctor.find({ isAvailable: true })
//       .select("name speciality nmcNumber isAvailable timeSlots") // ✅ Include ALL fields
//       .sort({ name: 1 })
//       .lean();

//     res.json(doctors);
//   } catch (error) {
//     console.error("customer doctors error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const authenticateAdmin = require("../middleware/authAdmin");
// const authenticateToken = require("../middleware/auth");
// const Doctor = require("../models/Doctor");
// const Appointment = require("../models/Appointment"); // ✅ needed for delete check

// const router = express.Router();

// // POST /api/doctors - Create a new doctor (admin only)
// router.post(
//   "/",
//   authenticateAdmin,
//   [
//     body("name").notEmpty().withMessage("Name is required"),
//     body("speciality").notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber").notEmpty().withMessage("NMC Number is required"),
//     // timeSlots validation (allow empty array)
//     body("timeSlots")
//       .optional()
//       .isArray()
//       .withMessage("timeSlots must be an array")
//       .custom((value) => {
//         if (!value || value.length === 0) return true; // allow empty
//         return value.every((slot) =>
//           /^(\d{2}:\d{2})-(\d{2}:\d{2})$/.test(slot)
//         );
//       })
//       .withMessage("Invalid time slot format. Use HH:MM-HH:MM"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const {
//         name,
//         speciality,
//         nmcNumber,
//         timeSlots = [],
//         isAvailable = true,
//       } = req.body;

//       // Check duplicate NMC
//       const existing = await Doctor.findOne({ nmcNumber });
//       if (existing) {
//         return res
//           .status(400)
//           .json({ message: "Doctor with this NMC number already exists" });
//       }

//       const doctor = new Doctor({
//         name,
//         speciality,
//         nmcNumber,
//         timeSlots,
//         isAvailable,
//       });
//       await doctor.save();

//       const populatedDoctor = await Doctor.findById(doctor._id).select("-__v");

//       return res.status(201).json({
//         message: "Doctor created successfully",
//         doctor: populatedDoctor,
//       });
//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // PUT /api/doctors/:id - Update doctor (admin only)
// router.put(
//   "/:id",
//   authenticateAdmin,
//   [
//     body("name")
//       .optional({ checkFalsy: true })
//       .notEmpty()
//       .withMessage("Name is required"),
//     body("speciality")
//       .optional({ checkFalsy: true })
//       .notEmpty()
//       .withMessage("Speciality is required"),
//     body("nmcNumber")
//       .optional({ checkFalsy: true })
//       .notEmpty()
//       .withMessage("NMC Number is required"),
//     body("timeSlots")
//       .optional()
//       .isArray()
//       .withMessage("timeSlots must be an array")
//       .custom((value) => {
//         if (!value || value.length === 0) return true;
//         return value.every((slot) =>
//           /^(\d{2}:\d{2})-(\d{2}:\d{2})$/.test(slot)
//         );
//       })
//       .withMessage("Invalid time slot format. Use HH:MM-HH:MM"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const {
//         name,
//         speciality,
//         nmcNumber,
//         timeSlots = [],
//         isAvailable,
//       } = req.body;
//       const doctorId = req.params.id;

//       // Check if doctor exists
//       const doctor = await Doctor.findById(doctorId);
//       if (!doctor) {
//         return res.status(404).json({ message: "Doctor not found" });
//       }

//       // Check duplicate NMC (excluding current doctor)
//       if (nmcNumber && nmcNumber !== doctor.nmcNumber) {
//         const existing = await Doctor.findOne({
//           nmcNumber,
//           _id: { $ne: doctorId },
//         });
//         if (existing) {
//           return res
//             .status(400)
//             .json({ message: "NMC number already exists for another doctor" });
//         }
//       }

//       // Update doctor
//       if (name !== undefined) doctor.name = name;
//       if (speciality !== undefined) doctor.speciality = speciality;
//       if (nmcNumber !== undefined) doctor.nmcNumber = nmcNumber;
//       if (timeSlots !== undefined) doctor.timeSlots = timeSlots;
//       if (isAvailable !== undefined) doctor.isAvailable = isAvailable;

//       await doctor.save();

//       const populatedDoctor = await Doctor.findById(doctorId).select("-__v");

//       return res.json({
//         message: "Doctor updated successfully",
//         doctor: populatedDoctor,
//       });
//     } catch (error) {
//       console.error("Error updating doctor:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // DELETE /api/doctors/:id - Delete doctor (admin only)
// router.delete("/:id", authenticateAdmin, async (req, res) => {
//   try {
//     // Check for active appointments before deletion
//     const activeAppointments = await Appointment.countDocuments({
//       doctor: req.params.id,
//       status: { $ne: "cancelled" },
//     });

//     if (activeAppointments > 0) {
//       return res.status(400).json({
//         message: "Cannot delete doctor with active appointments",
//         activeCount: activeAppointments,
//       });
//     }

//     const doctor = await Doctor.findByIdAndDelete(req.params.id);
//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }
//     res.json({ message: "Doctor deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting doctor:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/doctors - Public access (basic info)
// router.get("/", async (req, res) => {
//   try {
//     const doctors = await Doctor.find({})
//       .select("name speciality nmcNumber isAvailable")
//       .sort({ name: 1 })
//       .lean();
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/doctors/pharmacist/doctors - Pharmacist/admin access (full info)
// router.get("/pharmacist/doctors", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     const doctors = await Doctor.find({})
//       .select("name speciality nmcNumber isAvailable timeSlots")
//       .sort({ name: 1 })
//       .lean();
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching pharmacist doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/doctors/customer/doctors - Customer booking (includes timeSlots)
// router.get("/customer/doctors", authenticateToken, async (req, res) => {
//   try {
//     // Customers see only available doctors with their time slots
//     const doctors = await Doctor.find({ isAvailable: true })
//       .select("name speciality nmcNumber isAvailable timeSlots")
//       .sort({ name: 1 })
//       .lean();

//     res.json(doctors);
//   } catch (error) {
//     console.error("customer doctors error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const authenticateAdmin = require("../middleware/authAdmin");
// const authenticateToken = require("../middleware/auth");
// const Doctor = require("../models/Doctor");
// const Appointment = require("../models/Appointment"); // ✅ needed for delete check

// const router = express.Router();

// // shared validators for slot objects
// const slotValidators = [
//   body("slots")
//     .optional()
//     .isArray()
//     .withMessage("slots must be an array")
//     .custom((value) => {
//       if (!value || value.length === 0) return true; // allow empty
//       const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM
//       return value.every((slot) => {
//         if (!slot.date || !slot.startTime || !slot.endTime) return false;
//         if (!timeRegex.test(slot.startTime)) return false;
//         if (!timeRegex.test(slot.endTime)) return false;
//         return true;
//       });
//     })
//     .withMessage(
//       "Each slot must have date, startTime and endTime (HH:MM 24-hour format)"
//     ),
// ];

// // POST /api/doctors - Create a new doctor (admin only)
// router.post(
//   "/",
//   authenticateAdmin,
//   [
//     body("name").notEmpty().withMessage("Name is required"),
//     body("speciality").notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber").notEmpty().withMessage("NMC Number is required"),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const {
//         name,
//         speciality,
//         nmcNumber,
//         slots = [],
//         isAvailable = true,
//       } = req.body;

//       // Check duplicate NMC
//       const existing = await Doctor.findOne({ nmcNumber });
//       if (existing) {
//         return res
//           .status(400)
//           .json({ message: "Doctor with this NMC number already exists" });
//       }

//       const doctor = new Doctor({
//         name,
//         speciality,
//         nmcNumber,
//         slots: slots.map((s) => ({
//           date: s.date,
//           startTime: s.startTime,
//           endTime: s.endTime,
//           isBooked: !!s.isBooked,
//         })),
//         isAvailable,
//       });
//       await doctor.save();

//       const populatedDoctor = await Doctor.findById(doctor._id).select("-__v");

//       return res.status(201).json({
//         message: "Doctor created successfully",
//         doctor: populatedDoctor,
//       });
//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // PUT /api/doctors/:id - Update doctor (admin only)
// router.put(
//   "/:id",
//   authenticateAdmin,
//   [
//     body("name")
//       .optional({ checkFalsy: true })
//       .notEmpty()
//       .withMessage("Name is required"),
//     body("speciality")
//       .optional({ checkFalsy: true })
//       .notEmpty()
//       .withMessage("Speciality is required"),
//     body("nmcNumber")
//       .optional({ checkFalsy: true })
//       .notEmpty()
//       .withMessage("NMC Number is required"),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const {
//         name,
//         speciality,
//         nmcNumber,
//         slots, // may be undefined
//         isAvailable,
//       } = req.body;
//       const doctorId = req.params.id;

//       // Check if doctor exists
//       const doctor = await Doctor.findById(doctorId);
//       if (!doctor) {
//         return res.status(404).json({ message: "Doctor not found" });
//       }

//       // Check duplicate NMC (excluding current doctor)
//       if (nmcNumber && nmcNumber !== doctor.nmcNumber) {
//         const existing = await Doctor.findOne({
//           nmcNumber,
//           _id: { $ne: doctorId },
//         });
//         if (existing) {
//           return res.status(400).json({
//             message: "NMC number already exists for another doctor",
//           });
//         }
//       }

//       // Update doctor
//       if (name !== undefined) doctor.name = name;
//       if (speciality !== undefined) doctor.speciality = speciality;
//       if (nmcNumber !== undefined) doctor.nmcNumber = nmcNumber;
//       if (Array.isArray(slots)) {
//         doctor.slots = slots.map((s) => ({
//           date: s.date,
//           startTime: s.startTime,
//           endTime: s.endTime,
//           isBooked: !!s.isBooked,
//         }));
//       }
//       if (isAvailable !== undefined) doctor.isAvailable = isAvailable;

//       await doctor.save();

//       const populatedDoctor = await Doctor.findById(doctorId).select("-__v");

//       return res.json({
//         message: "Doctor updated successfully",
//         doctor: populatedDoctor,
//       });
//     } catch (error) {
//       console.error("Error updating doctor:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // DELETE /api/doctors/:id - Delete doctor (admin only)
// router.delete("/:id", authenticateAdmin, async (req, res) => {
//   try {
//     // Check for active appointments before deletion
//     const activeAppointments = await Appointment.countDocuments({
//       doctor: req.params.id,
//       status: { $ne: "cancelled" },
//     });

//     if (activeAppointments > 0) {
//       return res.status(400).json({
//         message: "Cannot delete doctor with active appointments",
//         activeCount: activeAppointments,
//       });
//     }

//     const doctor = await Doctor.findByIdAndDelete(req.params.id);
//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }
//     res.json({ message: "Doctor deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting doctor:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/doctors - Public access (basic info)
// router.get("/", async (req, res) => {
//   try {
//     const doctors = await Doctor.find({})
//       .select("name speciality nmcNumber isAvailable")
//       .sort({ name: 1 })
//       .lean();
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/doctors/pharmacist/doctors - Pharmacist/admin access (full info)
// router.get("/pharmacist/doctors", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     const doctors = await Doctor.find({})
//       .select("name speciality nmcNumber isAvailable slots")
//       .sort({ name: 1 })
//       .lean();
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching pharmacist doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/doctors/customer/doctors - Customer booking (includes slots)
// router.get("/customer/doctors", authenticateToken, async (req, res) => {
//   try {
//     // Customers see only available doctors with their time slots
//     const doctors = await Doctor.find({ isAvailable: true })
//       .select("name speciality nmcNumber isAvailable slots")
//       .sort({ name: 1 })
//       .lean();

//     res.json(doctors);
//   } catch (error) {
//     console.error("customer doctors error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const authenticateToken = require("../middleware/auth");
// const Doctor = require("../models/Doctor");
// const Appointment = require("../models/Appointment");

// const router = express.Router();

// // helper: require admin role
// const requireAdmin = (req, res, next) => {
//   if (!req.user || req.user.role !== "admin") {
//     return res.status(403).json({ message: "Access denied. Admins only." });
//   }
//   next();
// };

// // shared validators for slot objects
// const slotValidators = [
//   body("slots")
//     .optional()
//     .isArray()
//     .withMessage("slots must be an array")
//     .custom((value) => {
//       if (!value || value.length === 0) return true;

//       const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       return value.every((slot) => {
//         if (!slot.date || !slot.startTime || !slot.endTime) return false;
//         if (!timeRegex.test(slot.startTime)) return false;
//         if (!timeRegex.test(slot.endTime)) return false;

//         // date must be today or future
//         const d = new Date(slot.date);
//         d.setHours(0, 0, 0, 0);
//         if (isNaN(d.getTime())) return false;
//         if (d.getTime() < today.getTime()) return false;

//         // start must be before end
//         const [sh, sm] = slot.startTime.split(":").map(Number);
//         const [eh, em] = slot.endTime.split(":").map(Number);
//         const startMinutes = sh * 60 + sm;
//         const endMinutes = eh * 60 + em;
//         return startMinutes < endMinutes;
//       });
//     })
//     .withMessage(
//       "Each slot must have a valid future date and start/end time (HH:MM) where start is before end"
//     ),
// ];

// // POST /api/doctors - Create a new doctor (admin only)
// router.post(
//   "/",
//   authenticateToken,
//   requireAdmin,
//   [
//     body("name").notEmpty().withMessage("Name is required"),
//     body("speciality").notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber").notEmpty().withMessage("NMC Number is required"),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const {
//         name,
//         speciality,
//         nmcNumber,
//         slots = [],
//         isAvailable = true,
//       } = req.body;

//       // Check duplicate NMC
//       const existing = await Doctor.findOne({ nmcNumber });
//       if (existing) {
//         return res
//           .status(400)
//           .json({ message: "Doctor with this NMC number already exists" });
//       }

//       const doctor = new Doctor({
//         name,
//         speciality,
//         nmcNumber,
//         slots: slots.map((s) => ({
//           date: s.date,
//           startTime: s.startTime,
//           endTime: s.endTime,
//           isBooked: !!s.isBooked,
//         })),
//         isAvailable,
//       });
//       await doctor.save();

//       const populatedDoctor = await Doctor.findById(doctor._id).select("-__v");

//       return res.status(201).json({
//         message: "Doctor created successfully",
//         doctor: populatedDoctor,
//       });
//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // PUT /api/doctors/:id - Update doctor (admin only)
// router.put(
//   "/:id",
//   authenticateToken,
//   requireAdmin,
//   [
//     body("name")
//       .optional({ checkFalsy: true })
//       .notEmpty()
//       .withMessage("Name is required"),
//     body("speciality")
//       .optional({ checkFalsy: true })
//       .notEmpty()
//       .withMessage("Speciality is required"),
//     body("nmcNumber")
//       .optional({ checkFalsy: true })
//       .notEmpty()
//       .withMessage("NMC Number is required"),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const {
//         name,
//         speciality,
//         nmcNumber,
//         slots, // may be undefined
//         isAvailable,
//       } = req.body;
//       const doctorId = req.params.id;

//       // Check if doctor exists
//       const doctor = await Doctor.findById(doctorId);
//       if (!doctor) {
//         return res.status(404).json({ message: "Doctor not found" });
//       }

//       // Check duplicate NMC (excluding current doctor)
//       if (nmcNumber && nmcNumber !== doctor.nmcNumber) {
//         const existing = await Doctor.findOne({
//           nmcNumber,
//           _id: { $ne: doctorId },
//         });
//         if (existing) {
//           return res.status(400).json({
//             message: "NMC number already exists for another doctor",
//           });
//         }
//       }

//       // Update doctor
//       if (name !== undefined) doctor.name = name;
//       if (speciality !== undefined) doctor.speciality = speciality;
//       if (nmcNumber !== undefined) doctor.nmcNumber = nmcNumber;
//       if (Array.isArray(slots)) {
//         doctor.slots = slots.map((s) => ({
//           date: s.date,
//           startTime: s.startTime,
//           endTime: s.endTime,
//           isBooked: !!s.isBooked,
//         }));
//       }
//       if (isAvailable !== undefined) doctor.isAvailable = isAvailable;

//       await doctor.save();

//       const populatedDoctor = await Doctor.findById(doctorId).select("-__v");

//       return res.json({
//         message: "Doctor updated successfully",
//         doctor: populatedDoctor,
//       });
//     } catch (error) {
//       console.error("Error updating doctor:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // DELETE /api/doctors/:id - Delete doctor (admin only)
// router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
//   try {
//     // Check for active appointments before deletion
//     const activeAppointments = await Appointment.countDocuments({
//       doctor: req.params.id,
//       status: { $ne: "cancelled" },
//     });

//     if (activeAppointments > 0) {
//       return res.status(400).json({
//         message: "Cannot delete doctor with active appointments",
//         activeCount: activeAppointments,
//       });
//     }

//     const doctor = await Doctor.findByIdAndDelete(req.params.id);
//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }
//     res.json({ message: "Doctor deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting doctor:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/doctors - Public access (basic info)
// router.get("/", async (req, res) => {
//   try {
//     const doctors = await Doctor.find({})
//       .select("name speciality nmcNumber isAvailable")
//       .sort({ name: 1 })
//       .lean();
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/doctors/pharmacist/doctors - Pharmacist/admin access (full info)
// router.get("/pharmacist/doctors", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     const doctors = await Doctor.find({})
//       .select("name speciality nmcNumber isAvailable slots")
//       .sort({ name: 1 })
//       .lean();
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching pharmacist doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/doctors/customer/doctors - Customer booking (includes slots)
// router.get("/customer/doctors", authenticateToken, async (req, res) => {
//   try {
//     // Customers see only available doctors with their time slots
//     const doctors = await Doctor.find({ isAvailable: true })
//       .select("name speciality nmcNumber isAvailable slots")
//       .sort({ name: 1 })
//       .lean();

//     res.json(doctors);
//   } catch (error) {
//     console.error("customer doctors error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const router = express.Router();

// // Models
// const Doctor = require("../models/Doctor");
// const Appointment = require("../models/Appointment");

// // Middleware
// const { protect, admin } = require("../middleware/authMiddleware");

// // -------------------------------------------------------------------
// // 🛠️ SHARED VALIDATORS
// // -------------------------------------------------------------------

// // Validates the 'slots' array structure
// const slotValidators = [
//   body("slots")
//     .optional()
//     .isArray()
//     .withMessage("Slots must be an array")
//     .custom((slots) => {
//       if (!slots || slots.length === 0) return true;

//       const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM

//       return slots.every((slot) => {
//         // Validate Day (String, e.g., "Monday" or "2025-10-20")
//         if (!slot.day || typeof slot.day !== "string") return false;

//         // Validate Time Format
//         if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime))
//           return false;

//         // Validate Start < End
//         return slot.startTime < slot.endTime;
//       });
//     })
//     .withMessage(
//       "Each slot must have a valid 'day', 'startTime', and 'endTime' (start must be before end)."
//     ),
// ];

// // -------------------------------------------------------------------
// // ➕ CREATE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.post(
//   "/",
//   protect,
//   admin,
//   [
//     body("name").trim().notEmpty().withMessage("Name is required"),
//     body("speciality").trim().notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber").trim().notEmpty().withMessage("NMC Number is required"),
//     body("email").optional().isEmail().withMessage("Invalid email"),
//     body("experience")
//       .optional()
//       .isNumeric()
//       .withMessage("Experience must be a number"),
//     body("consultationFee")
//       .optional()
//       .isNumeric()
//       .withMessage("Fee must be a number"),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     try {
//       const {
//         name,
//         speciality,
//         nmcNumber,
//         email,
//         phone,
//         experience,
//         consultationFee,
//         bio,
//         image,
//         slots = [],
//         isAvailable = true,
//       } = req.body;

//       // Check for Duplicate NMC
//       const existing = await Doctor.findOne({ nmcNumber });
//       if (existing) {
//         return res
//           .status(400)
//           .json({ message: "Doctor with this NMC number already exists" });
//       }

//       const doctor = await Doctor.create({
//         name,
//         speciality,
//         nmcNumber,
//         email,
//         phone,
//         experience: experience || 0,
//         consultationFee: consultationFee || 0,
//         bio,
//         image: image || "/images/sample-doctor.jpg",
//         slots,
//         isAvailable,
//       });

//       res.status(201).json({ message: "Doctor created successfully", doctor });
//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // ✏️ UPDATE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.put(
//   "/:id",
//   protect,
//   admin,
//   [
//     body("name").optional().trim().notEmpty(),
//     body("speciality").optional().trim().notEmpty(),
//     body("nmcNumber").optional().trim().notEmpty(),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     try {
//       const doctorId = req.params.id;
//       const doctor = await Doctor.findById(doctorId);

//       if (!doctor) {
//         return res.status(404).json({ message: "Doctor not found" });
//       }

//       // Check unique NMC if it's being updated
//       if (req.body.nmcNumber && req.body.nmcNumber !== doctor.nmcNumber) {
//         const existing = await Doctor.findOne({
//           nmcNumber: req.body.nmcNumber,
//         });
//         if (existing) {
//           return res
//             .status(400)
//             .json({ message: "NMC number already exists for another doctor" });
//         }
//       }

//       // Update allowed fields
//       const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, req.body, {
//         new: true,
//         runValidators: true,
//       });

//       res.json({
//         message: "Doctor updated successfully",
//         doctor: updatedDoctor,
//       });
//     } catch (error) {
//       console.error("Error updating doctor:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // 🗑️ DELETE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.delete("/:id", protect, admin, async (req, res) => {
//   try {
//     // Prevent deletion if active appointments exist
//     const activeAppointments = await Appointment.countDocuments({
//       doctor: req.params.id,
//       status: { $in: ["pending", "confirmed"] }, // Only block valid future appointments
//     });

//     if (activeAppointments > 0) {
//       return res.status(400).json({
//         message: `Cannot delete doctor. They have ${activeAppointments} active appointments.`,
//       });
//     }

//     const doctor = await Doctor.findByIdAndDelete(req.params.id);
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     res.json({ message: "Doctor deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting doctor:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------------------------------------------------------
// // 🔍 PUBLIC: GET ALL DOCTORS
// // -------------------------------------------------------------------
// router.get("/", async (req, res) => {
//   try {
//     // Return lightweight list for UI Cards
//     const doctors = await Doctor.find({ isAvailable: true })
//       .select(
//         "name speciality nmcNumber isAvailable image experience consultationFee"
//       )
//       .sort({ name: 1 })
//       .lean();
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------------------------------------------------------
// // 📄 PUBLIC: GET SINGLE DOCTOR DETAILS
// // -------------------------------------------------------------------
// router.get("/:id", async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id).lean();
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });
//     res.json(doctor);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------------------------------------------------------
// // 🔐 PHARMACIST: GET DOCTORS (Full List including unavailable)
// // -------------------------------------------------------------------
// router.get("/pharmacist/list", protect, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     const doctors = await Doctor.find({}).sort({ name: 1 }).lean();
//     res.json(doctors);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const router = express.Router();

// // Models
// const Doctor = require("../models/Doctor");
// const Appointment = require("../models/Appointment");

// // Middleware
// const { protect, admin } = require("../middleware/authMiddleware");

// // -------------------------------------------------------------------
// // 🛠️ SHARED VALIDATORS
// // -------------------------------------------------------------------

// // Validates the 'slots' array structure
// const slotValidators = [
//   body("slots")
//     .optional()
//     .isArray()
//     .withMessage("Slots must be an array")
//     .custom((slots) => {
//       if (!slots || slots.length === 0) return true;

//       const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM

//       return slots.every((slot) => {
//         // Validate Day (String, e.g., "MONDAY") - matches uppercase requirement
//         if (!slot.day || typeof slot.day !== "string") return false;

//         // Validate Time Format
//         if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime))
//           return false;

//         // Validate Start < End
//         return slot.startTime < slot.endTime;
//       });
//     })
//     .withMessage(
//       "Each slot must have a valid 'day', 'startTime', and 'endTime' (start must be before end)."
//     ),
// ];

// // -------------------------------------------------------------------
// // ➕ CREATE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.post(
//   "/",
//   protect,
//   admin,
//   [
//     body("name").trim().notEmpty().withMessage("Name is required"),
//     body("speciality").trim().notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber").trim().notEmpty().withMessage("NMC Number is required"),
//     body("phone").trim().notEmpty().withMessage("Contact number is required"), // ✅ Added phone validation
//     body("email").optional().isEmail().withMessage("Invalid email"),
//     body("experience")
//       .optional()
//       .isNumeric()
//       .withMessage("Experience must be a number"),
//     body("consultationFee")
//       .optional()
//       .isNumeric()
//       .withMessage("Fee must be a number"),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     try {
//       const {
//         name,
//         speciality,
//         nmcNumber,
//         email,
//         phone,
//         experience,
//         consultationFee,
//         bio,
//         image,
//         slots = [],
//         isAvailable = true,
//       } = req.body;

//       // Check for Duplicate NMC
//       const existing = await Doctor.findOne({ nmcNumber });
//       if (existing) {
//         return res
//           .status(400)
//           .json({ message: "Doctor with this NMC number already exists" });
//       }

//       const doctor = await Doctor.create({
//         name,
//         speciality,
//         nmcNumber,
//         email,
//         phone,
//         experience: experience || 0,
//         consultationFee: consultationFee || 0,
//         bio,
//         image: image || "/images/sample-doctor.jpg",
//         slots,
//         isAvailable,
//       });

//       res.status(201).json({ message: "Doctor created successfully", doctor });
//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // ✏️ UPDATE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.put(
//   "/:id",
//   protect,
//   admin,
//   [
//     body("name").optional().trim().notEmpty(),
//     body("speciality").optional().trim().notEmpty(),
//     body("nmcNumber").optional().trim().notEmpty(),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     try {
//       const doctorId = req.params.id;
//       const doctor = await Doctor.findById(doctorId);

//       if (!doctor) {
//         return res.status(404).json({ message: "Doctor not found" });
//       }

//       // Check unique NMC if it's being updated
//       if (req.body.nmcNumber && req.body.nmcNumber !== doctor.nmcNumber) {
//         const existing = await Doctor.findOne({
//           nmcNumber: req.body.nmcNumber,
//         });
//         if (existing) {
//           return res
//             .status(400)
//             .json({ message: "NMC number already exists for another doctor" });
//         }
//       }

//       // Update allowed fields
//       const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, req.body, {
//         new: true,
//         runValidators: true,
//       });

//       res.json({
//         message: "Doctor updated successfully",
//         doctor: updatedDoctor,
//       });
//     } catch (error) {
//       console.error("Error updating doctor:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // 🗑️ DELETE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.delete("/:id", protect, admin, async (req, res) => {
//   try {
//     // Prevent deletion if active appointments exist
//     const activeAppointments = await Appointment.countDocuments({
//       doctor: req.params.id,
//       status: { $in: ["pending", "confirmed"] },
//     });

//     if (activeAppointments > 0) {
//       return res.status(400).json({
//         message: `Cannot delete doctor. They have ${activeAppointments} active appointments.`,
//       });
//     }

//     const doctor = await Doctor.findByIdAndDelete(req.params.id);
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     res.json({ message: "Doctor deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting doctor:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------------------------------------------------------
// // 🔍 PUBLIC: GET ALL DOCTORS (Used by Customer Appointments)
// // -------------------------------------------------------------------
// router.get("/", async (req, res) => {
//   try {
//     // ✅ FIX: Added 'slots' to select string so Customer Dashboard can show Working Days
//     const doctors = await Doctor.find({ isAvailable: true })
//       .select(
//         "name speciality nmcNumber isAvailable image experience consultationFee slots"
//       )
//       .sort({ name: 1 })
//       .lean();
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------------------------------------------------------
// // 📄 PUBLIC: GET SINGLE DOCTOR DETAILS
// // -------------------------------------------------------------------
// router.get("/:id", async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id).lean();
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });
//     res.json(doctor);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const router = express.Router();

// // Models
// const Doctor = require("../models/Doctor");
// const Appointment = require("../models/Appointment");

// // Middleware
// const { protect, admin } = require("../middleware/authMiddleware");

// // -------------------------------------------------------------------
// // 🛠️ SHARED VALIDATORS
// // -------------------------------------------------------------------

// const slotValidators = [
//   body("slots")
//     .optional()
//     .isArray()
//     .withMessage("Slots must be an array")
//     .custom((slots) => {
//       if (!slots || slots.length === 0) return true;
//       const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM format

//       return slots.every((slot) => {
//         // Validate Day (Must be a string like "MONDAY")
//         if (!slot.day || typeof slot.day !== "string") return false;
//         // Validate Time Format
//         if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime))
//           return false;
//         // Validate Start Time is before End Time
//         return slot.startTime < slot.endTime;
//       });
//     })
//     .withMessage(
//       "Invalid slot data. Ensure day is a string and times are in 24h HH:MM format."
//     ),
// ];

// // -------------------------------------------------------------------
// // ➕ CREATE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.post(
//   "/",
//   protect,
//   admin,
//   [
//     body("name").trim().notEmpty().withMessage("Name is required"),
//     body("speciality").trim().notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber").trim().notEmpty().withMessage("NMC Number is required"),
//     body("phone").trim().notEmpty().withMessage("Contact number is required"), // ✅ FIX: Added phone validation
//     body("experience")
//       .optional()
//       .isNumeric()
//       .withMessage("Experience must be a number"),
//     body("consultationFee")
//       .optional()
//       .isNumeric()
//       .withMessage("Fee must be a number"),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     try {
//       const { nmcNumber } = req.body;
//       const existing = await Doctor.findOne({ nmcNumber });
//       if (existing) {
//         return res
//           .status(400)
//           .json({ message: "Doctor with this NMC number already exists" });
//       }

//       const doctor = await Doctor.create(req.body);
//       res.status(201).json({ message: "Doctor created successfully", doctor });
//     } catch (error) {
//       console.error("Create Doctor Error:", error);
//       res.status(500).json({ message: "Server error creating doctor profile" });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // ✏️ UPDATE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.put(
//   "/:id",
//   protect,
//   admin,
//   [
//     body("name").optional().trim().notEmpty(),
//     body("nmcNumber").optional().trim().notEmpty(),
//     body("phone")
//       .optional()
//       .trim()
//       .notEmpty()
//       .withMessage("Phone cannot be empty"), // ✅ Ensure phone is handled in updates
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     try {
//       const doctor = await Doctor.findById(req.params.id);
//       if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//       // Check NMC uniqueness if changed
//       if (req.body.nmcNumber && req.body.nmcNumber !== doctor.nmcNumber) {
//         const existing = await Doctor.findOne({
//           nmcNumber: req.body.nmcNumber,
//         });
//         if (existing)
//           return res.status(400).json({ message: "NMC number already taken" });
//       }

//       const updatedDoctor = await Doctor.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         {
//           new: true,
//           runValidators: true,
//         }
//       );

//       res.json({
//         message: "Doctor updated successfully",
//         doctor: updatedDoctor,
//       });
//     } catch (error) {
//       console.error("Update Doctor Error:", error);
//       res.status(500).json({ message: "Server error updating profile" });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // 🗑️ DELETE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.delete("/:id", protect, admin, async (req, res) => {
//   try {
//     const activeAppointments = await Appointment.countDocuments({
//       doctor: req.params.id,
//       status: { $in: ["pending", "confirmed"] },
//     });

//     if (activeAppointments > 0) {
//       return res.status(400).json({
//         message: `Cannot delete. Doctor has ${activeAppointments} active appointments.`,
//       });
//     }

//     const doctor = await Doctor.findByIdAndDelete(req.params.id);
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     res.json({ message: "Doctor removed from registry" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error during deletion" });
//   }
// });

// // -------------------------------------------------------------------
// // 🔍 PUBLIC: GET ALL DOCTORS (Used by Customer Appointments)
// // -------------------------------------------------------------------
// router.get("/", async (req, res) => {
//   try {
//     // ✅ CRITICAL FIX: Added 'slots' and 'phone' to the selection
//     // Without 'slots', the Working Day dropdown on the customer dashboard stays empty
//     const doctors = await Doctor.find({ isAvailable: true })
//       .select(
//         "name speciality nmcNumber slots experience consultationFee phone image"
//       )
//       .sort({ name: 1 })
//       .lean();

//     res.json(doctors);
//   } catch (error) {
//     console.error("Fetch Doctors Error:", error);
//     res
//       .status(500)
//       .json({ message: "Server error fetching medical directory" });
//   }
// });

// // -------------------------------------------------------------------
// // 📄 PUBLIC: GET SINGLE DOCTOR
// // -------------------------------------------------------------------
// router.get("/:id", async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id).lean();
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });
//     res.json(doctor);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const router = express.Router();

// // Models
// const Doctor = require("../models/Doctor");
// const Appointment = require("../models/Appointment");

// // Middleware
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role"); // ✅ Consistent RBAC

// // -------------------------------------------------------------------
// // 🛠️ SHARED VALIDATORS
// // -------------------------------------------------------------------

// // Validates the 'slots' array structure for strict HH:MM format
// const slotValidators = [
//   body("slots")
//     .optional()
//     .isArray()
//     .withMessage("Slots must be an array")
//     .custom((slots) => {
//       if (!slots || slots.length === 0) return true;

//       const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM

//       return slots.every((slot) => {
//         // Validate Day (String, e.g., "MONDAY")
//         if (!slot.day || typeof slot.day !== "string") return false;

//         // Validate Time Format
//         if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime))
//           return false;

//         // Validate Start < End
//         return slot.startTime < slot.endTime;
//       });
//     })
//     .withMessage(
//       "Each slot must have a valid 'day', 'startTime', and 'endTime' (start must be before end)."
//     ),
// ];

// // -------------------------------------------------------------------
// // ➕ CREATE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.post(
//   "/",
//   protect,
//   authorizeRoles("admin"), // ✅ Updated to use Role Middleware
//   [
//     body("name").trim().notEmpty().withMessage("Name is required"),
//     body("speciality").trim().notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber").trim().notEmpty().withMessage("NMC Number is required"),
//     body("phone").trim().notEmpty().withMessage("Contact number is required"),
//     body("email").optional().isEmail().withMessage("Invalid email"),
//     body("experience")
//       .optional()
//       .isNumeric()
//       .withMessage("Experience must be a number"),
//     body("consultationFee")
//       .optional()
//       .isNumeric()
//       .withMessage("Fee must be a number"),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     try {
//       const { nmcNumber } = req.body;

//       // 1. Check for Duplicate NMC
//       const existing = await Doctor.findOne({ nmcNumber });
//       if (existing) {
//         return res
//           .status(400)
//           .json({ message: "Doctor with this NMC number already exists" });
//       }

//       // 2. Create Doctor Profile
//       const doctor = await Doctor.create(req.body);

//       res.status(201).json({ message: "Doctor created successfully", doctor });
//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       res.status(500).json({ message: "Server error creating profile" });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // ✏️ UPDATE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.put(
//   "/:id",
//   protect,
//   authorizeRoles("admin"),
//   [
//     body("name").optional().trim().notEmpty(),
//     body("speciality").optional().trim().notEmpty(),
//     body("nmcNumber").optional().trim().notEmpty(),
//     body("phone").optional().trim().notEmpty().withMessage("Phone is required"),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     try {
//       const doctorId = req.params.id;
//       const doctor = await Doctor.findById(doctorId);

//       if (!doctor) {
//         return res.status(404).json({ message: "Doctor not found" });
//       }

//       // Check unique NMC if it's being updated
//       if (req.body.nmcNumber && req.body.nmcNumber !== doctor.nmcNumber) {
//         const existing = await Doctor.findOne({
//           nmcNumber: req.body.nmcNumber,
//         });
//         if (existing) {
//           return res
//             .status(400)
//             .json({ message: "NMC number already exists for another doctor" });
//         }
//       }

//       // Update allowed fields
//       const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, req.body, {
//         new: true,
//         runValidators: true,
//       });

//       res.json({
//         message: "Doctor updated successfully",
//         doctor: updatedDoctor,
//       });
//     } catch (error) {
//       console.error("Error updating doctor:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // 🗑️ DELETE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
//   try {
//     // Prevent deletion if active appointments exist
//     const activeAppointments = await Appointment.countDocuments({
//       doctor: req.params.id,
//       status: { $in: ["pending", "confirmed"] }, // Only block valid future appointments
//     });

//     if (activeAppointments > 0) {
//       return res.status(400).json({
//         message: `Cannot delete doctor. They have ${activeAppointments} active appointments.`,
//       });
//     }

//     const doctor = await Doctor.findByIdAndDelete(req.params.id);
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     res.json({ message: "Doctor deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting doctor:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------------------------------------------------------
// // 🔍 PUBLIC: GET ALL DOCTORS (Customer Dashboard)
// // -------------------------------------------------------------------
// router.get("/", async (req, res) => {
//   try {
//     // ✅ Returns lightweight list for UI Cards (Customer View)
//     // CRITICAL: Includes 'slots' so the booking dropdown works!
//     const doctors = await Doctor.find({ isAvailable: true })
//       .select(
//         "name speciality nmcNumber isAvailable image experience consultationFee phone slots"
//       )
//       .sort({ name: 1 })
//       .lean();
//     res.json(doctors);
//   } catch (error) {
//     console.error("Error fetching doctors:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------------------------------------------------------
// // 📄 PUBLIC: GET SINGLE DOCTOR DETAILS
// // -------------------------------------------------------------------
// router.get("/:id", async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id).lean();
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });
//     res.json(doctor);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const router = express.Router();

// // Models
// const Doctor = require("../models/Doctor");
// const Appointment = require("../models/Appointment");

// // Middleware
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");

// // -------------------------------------------------------------------
// // 🛠️ SHARED VALIDATORS
// // -------------------------------------------------------------------

// /**
//  * ✅ Enhanced Slot Validator
//  * Checks for array structure, day strings, 24h time formats, and logic (start < end)
//  */
// const slotValidators = [
//   body("slots")
//     .optional()
//     .isArray()
//     .withMessage("Slots must be an array")
//     .custom((slots) => {
//       if (!slots || slots.length === 0) return true;

//       const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM format

//       return slots.every((slot) => {
//         // Validate Day
//         const validDays = [
//           "MONDAY",
//           "TUESDAY",
//           "WEDNESDAY",
//           "THURSDAY",
//           "FRIDAY",
//           "SATURDAY",
//           "SUNDAY",
//         ];
//         if (!slot.day || !validDays.includes(slot.day.toUpperCase()))
//           return false;

//         // Validate Time Formats
//         if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime))
//           return false;

//         // Validate Logic: Start must be strictly before End
//         return slot.startTime < slot.endTime;
//       });
//     })
//     .withMessage(
//       "Invalid slot data. Ensure days are valid and times are in HH:MM (24h) format."
//     ),
// ];

// // -------------------------------------------------------------------
// // ➕ 1. CREATE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.post(
//   "/",
//   protect,
//   authorizeRoles("admin"),
//   [
//     body("name").trim().notEmpty().withMessage("Doctor name is required"),
//     body("speciality").trim().notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber")
//       .trim()
//       .notEmpty()
//       .withMessage("NMC Registration number is required"),
//     body("phone").trim().notEmpty().withMessage("Contact number is required"),
//     body("email")
//       .optional()
//       .isEmail()
//       .withMessage("Please provide a valid email"),
//     body("experience")
//       .optional()
//       .isNumeric()
//       .withMessage("Experience must be a number"),
//     body("consultationFee")
//       .optional()
//       .isNumeric()
//       .withMessage("Fee must be a number"),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const { nmcNumber, email } = req.body;

//       // Check for existing doctor by NMC or Email
//       const existingDoctor = await Doctor.findOne({
//         $or: [{ nmcNumber }, { email: email?.toLowerCase() }],
//       });

//       if (existingDoctor) {
//         return res.status(400).json({
//           message: "A doctor with this NMC number or email already exists.",
//         });
//       }

//       const doctor = await Doctor.create({
//         ...req.body,
//         email: email?.toLowerCase(),
//       });

//       res.status(201).json({
//         success: true,
//         message: "Doctor profile created successfully",
//         doctor,
//       });
//     } catch (error) {
//       console.error("❌ Create Doctor Error:", error);
//       res
//         .status(500)
//         .json({
//           message: "Internal server error while creating doctor profile",
//         });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // ✏️ 2. UPDATE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.put(
//   "/:id",
//   protect,
//   authorizeRoles("admin"),
//   [
//     body("name").optional().trim().notEmpty(),
//     body("phone").optional().trim().notEmpty(),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const doctor = await Doctor.findById(req.params.id);
//       if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//       // Prevent duplicate NMC on update
//       if (req.body.nmcNumber && req.body.nmcNumber !== doctor.nmcNumber) {
//         const duplicate = await Doctor.findOne({
//           nmcNumber: req.body.nmcNumber,
//         });
//         if (duplicate)
//           return res
//             .status(400)
//             .json({
//               message: "NMC number is already assigned to another doctor",
//             });
//       }

//       const updatedDoctor = await Doctor.findByIdAndUpdate(
//         req.params.id,
//         { $set: req.body },
//         { new: true, runValidators: true }
//       );

//       res.json({
//         success: true,
//         message: "Doctor updated successfully",
//         doctor: updatedDoctor,
//       });
//     } catch (error) {
//       console.error("❌ Update Doctor Error:", error);
//       res.status(500).json({ message: "Server error updating profile" });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // 🗑️ 3. DELETE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
//   try {
//     // Safety Check: block deletion if active appointments exist
//     const activeAppointments = await Appointment.countDocuments({
//       doctor: req.params.id,
//       status: { $in: ["pending", "confirmed"] },
//     });

//     if (activeAppointments > 0) {
//       return res.status(400).json({
//         message: `Cannot delete. This doctor has ${activeAppointments} active appointments.`,
//       });
//     }

//     const doctor = await Doctor.findByIdAndDelete(req.params.id);
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     res.json({ success: true, message: "Doctor record removed from registry" });
//   } catch (error) {
//     console.error("❌ Delete Doctor Error:", error);
//     res.status(500).json({ message: "Server error during deletion" });
//   }
// });

// // -------------------------------------------------------------------
// // 🔍 4. PUBLIC: GET DOCTOR DIRECTORY (Customer View)
// // -------------------------------------------------------------------
// router.get("/", async (req, res) => {
//   try {
//     // Only return doctors marked as available for public booking
//     const doctors = await Doctor.find({ isAvailable: true })
//       .select(
//         "name speciality nmcNumber slots experience consultationFee phone image"
//       )
//       .sort({ name: 1 })
//       .lean();

//     res.json(doctors);
//   } catch (error) {
//     console.error("❌ Fetch Directory Error:", error);
//     res.status(500).json({ message: "Error fetching medical directory" });
//   }
// });

// // -------------------------------------------------------------------
// // 📄 5. PUBLIC: GET DOCTOR BY ID
// // -------------------------------------------------------------------
// router.get("/:id", async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id).lean();
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     res.json(doctor);
//   } catch (error) {
//     console.error("❌ Fetch Doctor Detail Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const router = express.Router();

// // Models
// const Doctor = require("../models/Doctor");
// const Appointment = require("../models/Appointment");

// // Middleware
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");

// // -------------------------------------------------------------------
// // 🛠️ SHARED VALIDATORS
// // -------------------------------------------------------------------

// /**
//  * ✅ Enhanced Slot Validator
//  * Checks for array structure, day strings, 24h time formats, and logic (start < end)
//  */
// const slotValidators = [
//   body("slots")
//     .optional()
//     .isArray()
//     .withMessage("Slots must be an array")
//     .custom((slots) => {
//       if (!slots || slots.length === 0) return true;

//       const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM format

//       return slots.every((slot) => {
//         // Validate Day
//         const validDays = [
//           "MONDAY",
//           "TUESDAY",
//           "WEDNESDAY",
//           "THURSDAY",
//           "FRIDAY",
//           "SATURDAY",
//           "SUNDAY",
//         ];
//         if (!slot.day || !validDays.includes(slot.day.toUpperCase()))
//           return false;

//         // Validate Time Formats
//         if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime))
//           return false;

//         // Validate Logic: Start must be strictly before End
//         return slot.startTime < slot.endTime;
//       });
//     })
//     .withMessage(
//       "Invalid slot data. Ensure days are valid and times are in HH:MM (24h) format."
//     ),
// ];

// // -------------------------------------------------------------------
// // ➕ 1. CREATE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.post(
//   "/",
//   protect,
//   authorizeRoles("admin"),
//   [
//     body("name").trim().notEmpty().withMessage("Doctor name is required"),
//     body("speciality").trim().notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber")
//       .trim()
//       .notEmpty()
//       .withMessage("NMC Registration number is required"),
//     body("phone").trim().notEmpty().withMessage("Contact number is required"),
//     body("email")
//       .optional()
//       .isEmail()
//       .withMessage("Please provide a valid email"),
//     body("experience")
//       .optional()
//       .isNumeric()
//       .withMessage("Experience must be a number"),
//     body("consultationFee")
//       .optional()
//       .isNumeric()
//       .withMessage("Fee must be a number"),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const { nmcNumber, email } = req.body;

//       // Check for existing doctor by NMC or Email
//       const existingDoctor = await Doctor.findOne({
//         $or: [{ nmcNumber }, { email: email?.toLowerCase() }],
//       });

//       if (existingDoctor) {
//         return res.status(400).json({
//           message: "A doctor with this NMC number or email already exists.",
//         });
//       }

//       const doctor = await Doctor.create({
//         ...req.body,
//         email: email?.toLowerCase(),
//       });

//       res.status(201).json({
//         success: true,
//         message: "Doctor profile created successfully",
//         doctor,
//       });
//     } catch (error) {
//       console.error("❌ Create Doctor Error:", error);
//       res.status(500).json({
//         message: "Internal server error while creating doctor profile",
//       });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // ✏️ 2. UPDATE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.put(
//   "/:id",
//   protect,
//   authorizeRoles("admin"),
//   [
//     body("name").optional().trim().notEmpty(),
//     body("phone").optional().trim().notEmpty(),
//     ...slotValidators,
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const doctor = await Doctor.findById(req.params.id);
//       if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//       // Prevent duplicate NMC on update
//       if (req.body.nmcNumber && req.body.nmcNumber !== doctor.nmcNumber) {
//         const duplicate = await Doctor.findOne({
//           nmcNumber: req.body.nmcNumber,
//         });
//         if (duplicate)
//           return res.status(400).json({
//             message: "NMC number is already assigned to another doctor",
//           });
//       }

//       const updatedDoctor = await Doctor.findByIdAndUpdate(
//         req.params.id,
//         { $set: req.body },
//         { new: true, runValidators: true }
//       );

//       res.json({
//         success: true,
//         message: "Doctor updated successfully",
//         doctor: updatedDoctor,
//       });
//     } catch (error) {
//       console.error("❌ Update Doctor Error:", error);
//       res.status(500).json({ message: "Server error updating profile" });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // 🔄 3. TOGGLE AVAILABILITY (Admin Only)
// // -------------------------------------------------------------------
// router.patch(
//   "/:id/availability",
//   protect,
//   authorizeRoles("admin"),
//   async (req, res) => {
//     try {
//       const doctor = await Doctor.findById(req.params.id);
//       if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//       doctor.isAvailable = !doctor.isAvailable;
//       await doctor.save();

//       res.json({
//         success: true,
//         message: `Doctor is now ${
//           doctor.isAvailable ? "Available" : "Unavailable"
//         }`,
//         isAvailable: doctor.isAvailable,
//       });
//     } catch (error) {
//       res.status(500).json({ message: "Error toggling status" });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // 🗑️ 4. DELETE DOCTOR (Admin Only)
// // -------------------------------------------------------------------
// router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
//   try {
//     // Safety Check: block deletion if active appointments exist
//     const activeAppointments = await Appointment.countDocuments({
//       doctor: req.params.id,
//       status: { $in: ["pending", "confirmed"] },
//     });

//     if (activeAppointments > 0) {
//       return res.status(400).json({
//         message: `Cannot delete. This doctor has ${activeAppointments} active appointments.`,
//       });
//     }

//     const doctor = await Doctor.findByIdAndDelete(req.params.id);
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     res.json({ success: true, message: "Doctor record removed from registry" });
//   } catch (error) {
//     console.error("❌ Delete Doctor Error:", error);
//     res.status(500).json({ message: "Server error during deletion" });
//   }
// });

// // -------------------------------------------------------------------
// // 🔍 5. PUBLIC: GET DOCTOR DIRECTORY (Customer View)
// // -------------------------------------------------------------------
// router.get("/", async (req, res) => {
//   try {
//     // Only return doctors marked as available for public booking
//     const doctors = await Doctor.find({ isAvailable: true })
//       .select(
//         "name speciality nmcNumber slots experience consultationFee phone image"
//       )
//       .sort({ name: 1 })
//       .lean();

//     res.json(doctors);
//   } catch (error) {
//     console.error("❌ Fetch Directory Error:", error);
//     res.status(500).json({ message: "Error fetching medical directory" });
//   }
// });

// // -------------------------------------------------------------------
// // 📄 6. PUBLIC: GET DOCTOR BY ID
// // -------------------------------------------------------------------
// router.get("/:id", async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id).lean();
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     res.json(doctor);
//   } catch (error) {
//     console.error("❌ Fetch Doctor Detail Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Models
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// Middleware
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");

// -------------------------------------------------------------------
// 🛠️ SHARED VALIDATORS
// -------------------------------------------------------------------

/**
 * ✅ Enhanced Slot Validator
 * Checks for array structure, day strings, 24h time formats, and logic (start < end)
 */
const slotValidators = [
  body("slots")
    .optional()
    .isArray()
    .withMessage("Slots must be an array")
    .custom((slots) => {
      if (!slots || slots.length === 0) return true;

      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM format

      return slots.every((slot) => {
        // Validate Day
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

        // Validate Time Formats
        if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime))
          return false;

        // Validate Logic: Start must be strictly before End
        return slot.startTime < slot.endTime;
      });
    })
    .withMessage(
      "Invalid slot data. Ensure days are valid and times are in HH:MM (24h) format."
    ),
];

// -------------------------------------------------------------------
// 📊 1. ADMIN: DOCTOR STATISTICS
// -------------------------------------------------------------------
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
  }
);

// -------------------------------------------------------------------
// ➕ 2. CREATE DOCTOR (Admin Only)
// -------------------------------------------------------------------
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
  }
);

// -------------------------------------------------------------------
// ✏️ 3. UPDATE DOCTOR (Admin Only)
// -------------------------------------------------------------------
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

      // Prevent duplicate NMC on update
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
        { new: true, runValidators: true }
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
  }
);

// -------------------------------------------------------------------
// 🔄 4. TOGGLE AVAILABILITY (Admin Only)
// -------------------------------------------------------------------
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
        message: `Doctor is now ${
          doctor.isAvailable ? "Available" : "Unavailable"
        }`,
        isAvailable: doctor.isAvailable,
      });
    } catch (error) {
      res.status(500).json({ message: "Error toggling status" });
    }
  }
);

// -------------------------------------------------------------------
// 🗑️ 5. DELETE DOCTOR (Admin Only)
// -------------------------------------------------------------------
router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    // Safety Check: block deletion if active appointments exist
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

// -------------------------------------------------------------------
// 🔍 6. PUBLIC: GET DOCTOR DIRECTORY (Customer View)
// -------------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const { speciality, search } = req.query;
    let query = { isAvailable: true };

    if (speciality) query.speciality = speciality;
    if (search) query.name = { $regex: search, $options: "i" };

    // Only return doctors marked as available for public booking
    const doctors = await Doctor.find(query)
      .select(
        "name speciality nmcNumber slots experience consultationFee phone image"
      )
      .sort({ name: 1 })
      .lean();

    res.json(doctors);
  } catch (error) {
    console.error("❌ Fetch Directory Error:", error);
    res.status(500).json({ message: "Error fetching medical directory" });
  }
});

// -------------------------------------------------------------------
// 📄 7. PUBLIC: GET DOCTOR BY ID
// -------------------------------------------------------------------
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
