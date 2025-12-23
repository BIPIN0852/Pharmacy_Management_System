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

const express = require("express");
const { body, validationResult } = require("express-validator");
const authenticateToken = require("../middleware/auth");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const router = express.Router();

// helper: require admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// shared validators for slot objects
const slotValidators = [
  body("slots")
    .optional()
    .isArray()
    .withMessage("slots must be an array")
    .custom((value) => {
      if (!value || value.length === 0) return true;

      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return value.every((slot) => {
        if (!slot.date || !slot.startTime || !slot.endTime) return false;
        if (!timeRegex.test(slot.startTime)) return false;
        if (!timeRegex.test(slot.endTime)) return false;

        // date must be today or future
        const d = new Date(slot.date);
        d.setHours(0, 0, 0, 0);
        if (isNaN(d.getTime())) return false;
        if (d.getTime() < today.getTime()) return false;

        // start must be before end
        const [sh, sm] = slot.startTime.split(":").map(Number);
        const [eh, em] = slot.endTime.split(":").map(Number);
        const startMinutes = sh * 60 + sm;
        const endMinutes = eh * 60 + em;
        return startMinutes < endMinutes;
      });
    })
    .withMessage(
      "Each slot must have a valid future date and start/end time (HH:MM) where start is before end"
    ),
];

// POST /api/doctors - Create a new doctor (admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("speciality").notEmpty().withMessage("Speciality is required"),
    body("nmcNumber").notEmpty().withMessage("NMC Number is required"),
    ...slotValidators,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        name,
        speciality,
        nmcNumber,
        slots = [],
        isAvailable = true,
      } = req.body;

      // Check duplicate NMC
      const existing = await Doctor.findOne({ nmcNumber });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Doctor with this NMC number already exists" });
      }

      const doctor = new Doctor({
        name,
        speciality,
        nmcNumber,
        slots: slots.map((s) => ({
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
          isBooked: !!s.isBooked,
        })),
        isAvailable,
      });
      await doctor.save();

      const populatedDoctor = await Doctor.findById(doctor._id).select("-__v");

      return res.status(201).json({
        message: "Doctor created successfully",
        doctor: populatedDoctor,
      });
    } catch (error) {
      console.error("Error creating doctor:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/doctors/:id - Update doctor (admin only)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  [
    body("name")
      .optional({ checkFalsy: true })
      .notEmpty()
      .withMessage("Name is required"),
    body("speciality")
      .optional({ checkFalsy: true })
      .notEmpty()
      .withMessage("Speciality is required"),
    body("nmcNumber")
      .optional({ checkFalsy: true })
      .notEmpty()
      .withMessage("NMC Number is required"),
    ...slotValidators,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        name,
        speciality,
        nmcNumber,
        slots, // may be undefined
        isAvailable,
      } = req.body;
      const doctorId = req.params.id;

      // Check if doctor exists
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      // Check duplicate NMC (excluding current doctor)
      if (nmcNumber && nmcNumber !== doctor.nmcNumber) {
        const existing = await Doctor.findOne({
          nmcNumber,
          _id: { $ne: doctorId },
        });
        if (existing) {
          return res.status(400).json({
            message: "NMC number already exists for another doctor",
          });
        }
      }

      // Update doctor
      if (name !== undefined) doctor.name = name;
      if (speciality !== undefined) doctor.speciality = speciality;
      if (nmcNumber !== undefined) doctor.nmcNumber = nmcNumber;
      if (Array.isArray(slots)) {
        doctor.slots = slots.map((s) => ({
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
          isBooked: !!s.isBooked,
        }));
      }
      if (isAvailable !== undefined) doctor.isAvailable = isAvailable;

      await doctor.save();

      const populatedDoctor = await Doctor.findById(doctorId).select("-__v");

      return res.json({
        message: "Doctor updated successfully",
        doctor: populatedDoctor,
      });
    } catch (error) {
      console.error("Error updating doctor:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE /api/doctors/:id - Delete doctor (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Check for active appointments before deletion
    const activeAppointments = await Appointment.countDocuments({
      doctor: req.params.id,
      status: { $ne: "cancelled" },
    });

    if (activeAppointments > 0) {
      return res.status(400).json({
        message: "Cannot delete doctor with active appointments",
        activeCount: activeAppointments,
      });
    }

    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/doctors - Public access (basic info)
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find({})
      .select("name speciality nmcNumber isAvailable")
      .sort({ name: 1 })
      .lean();
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/doctors/pharmacist/doctors - Pharmacist/admin access (full info)
router.get("/pharmacist/doctors", authenticateToken, async (req, res) => {
  try {
    if (!["pharmacist", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const doctors = await Doctor.find({})
      .select("name speciality nmcNumber isAvailable slots")
      .sort({ name: 1 })
      .lean();
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching pharmacist doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/doctors/customer/doctors - Customer booking (includes slots)
router.get("/customer/doctors", authenticateToken, async (req, res) => {
  try {
    // Customers see only available doctors with their time slots
    const doctors = await Doctor.find({ isAvailable: true })
      .select("name speciality nmcNumber isAvailable slots")
      .sort({ name: 1 })
      .lean();

    res.json(doctors);
  } catch (error) {
    console.error("customer doctors error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
