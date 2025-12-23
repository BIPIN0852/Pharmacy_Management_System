// // backend/routes/customer.js
// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const mongoose = require("mongoose");
// const authenticateToken = require("../middleware/auth");

// const Prescription = require("../models/prescription.model"); // ✅ SINGLE import
// const Appointment = require("../models/Appointment");
// const Doctor = require("../models/Doctor");
// const User = require("../models/User");

// const router = express.Router();

// // ---------- GET customer's prescriptions (DEBUG READY) ----------
// router.get("/prescriptions", authenticateToken, async (req, res) => {
//   try {
//     console.log("🔍 req.user:", req.user); // 🔍 DEBUG
//     console.log("🔍 Customer ID:", req.user?.id); // 🔍 DEBUG

//     if (!req.user?.id) {
//       return res.status(401).json({ message: "No user ID in token" });
//     }

//     const prescriptions = await Prescription.find({ customer: req.user.id })
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     console.log(`✅ Found ${prescriptions.length} prescriptions`); // 🔍 DEBUG

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("❌ FULL ERROR:", err); // 🔍 BETTER LOGGING
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // ---------- POST appointment ----------
// router.post(
//   "/appointments",
//   authenticateToken,
//   [
//     body("doctorId").isString().notEmpty().withMessage("Doctor ID is required"),
//     body("date").isString().notEmpty().withMessage("Date is required"),
//     body("timeSlot").isString().notEmpty().withMessage("Time slot is required"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { doctorId, date, timeSlot, notes } = req.body;

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(doctorId)) {
//       return res.status(400).json({ message: "Invalid doctor ID format" });
//     }

//     try {
//       const user = await User.findById(req.user.id);
//       if (!user) return res.status(404).json({ message: "User not found" });

//       const doctor = await Doctor.findById(doctorId);
//       if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//       // Check if slot is available
//       const existing = await Appointment.findOne({
//         doctor: doctorId,
//         date,
//         timeSlot,
//         status: { $ne: "cancelled" },
//       });

//       if (existing) {
//         return res
//           .status(400)
//           .json({ message: "This time slot is already booked" });
//       }

//       const appointment = await Appointment.create({
//         customer: user._id,
//         customerName: user.name,
//         customerEmail: user.email,
//         doctor: doctorId,
//         doctorName: doctor.name,
//         doctorSpeciality: doctor.speciality,
//         doctorNMC: doctor.nmcNumber,
//         date,
//         timeSlot,
//         notes: notes || "",
//       });

//       const populated = await Appointment.findById(appointment._id)
//         .populate("doctor", "name speciality nmcNumber")
//         .lean();

//       res.status(201).json({
//         message: "Appointment booked successfully",
//         appointment: populated,
//       });
//     } catch (err) {
//       console.error("❌ Create appointment error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ---------- GET customer's appointments ----------
// router.get("/appointments", authenticateToken, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ customer: req.user.id })
//       .populate("doctor", "name speciality nmcNumber")
//       .sort({ date: 1 })
//       .lean();

//     res.json(appointments);
//   } catch (err) {
//     console.error("❌ Get customer appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET customer profile
// router.get("/profile", authenticateToken, async (req, res) => {
//   try {
//     const profile = await User.findById(req.user.id)
//       .select("name email phone address profilePhoto accountStatus")
//       .lean();
//     res.json(profile);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // UPDATE profile
// router.put(
//   "/profile",
//   authenticateToken,
//   uploadProfilePhoto.single("profilePhoto"),
//   async (req, res) => {
//     try {
//       const updates = {
//         phone: req.body.phone?.trim(),
//         address: {
//           street: req.body.street?.trim(),
//           city: req.body.city?.trim(),
//           province: req.body.province?.trim(),
//           postalCode: req.body.postalCode?.trim(),
//         },
//       };

//       if (req.file) {
//         updates.profilePhoto = `/uploads/profiles/${req.file.filename}`;
//       }

//       const user = await User.findByIdAndUpdate(req.user.id, updates, {
//         new: true,
//         runValidators: true,
//       }).select("name email phone address profilePhoto accountStatus");

//       res.json(user);
//     } catch (err) {
//       res.status(500).json({ message: "Update failed" });
//     }
//   }
// );

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const mongoose = require("mongoose");
// const authenticateToken = require("../middleware/auth");
// const multer = require("multer");
// const path = require("path");

// const Prescription = require("../models/prescription.model");
// const Appointment = require("../models/Appointment");
// const Doctor = require("../models/Doctor");
// const User = require("../models/User");

// // Multer config for profile photo uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "../uploads/profiles");
//     const fs = require("fs");
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       `profile-${req.user?.id || "user"}-${uniqueSuffix}${path.extname(
//         file.originalname
//       )}`
//     );
//   },
// });
// const uploadProfilePhoto = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed!"), false);
//     }
//   },
// });

// const router = express.Router();

// // ---------- GET customer's prescriptions (DEBUG READY) ----------
// router.get("/prescriptions", authenticateToken, async (req, res) => {
//   try {
//     console.log("🔍 req.user:", req.user);
//     console.log("🔍 Customer ID:", req.user?.id);

//     if (!req.user?.id) {
//       return res.status(401).json({ message: "No user ID in token" });
//     }

//     const prescriptions = await Prescription.find({ customer: req.user.id })
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     console.log(`✅ Found ${prescriptions.length} prescriptions`);
//     res.json(prescriptions);
//   } catch (err) {
//     console.error("❌ FULL ERROR:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // ---------- POST appointment ----------
// router.post(
//   "/appointments",
//   authenticateToken,
//   [
//     body("doctorId").isString().notEmpty().withMessage("Doctor ID is required"),
//     body("date").isString().notEmpty().withMessage("Date is required"),
//     body("timeSlot").isString().notEmpty().withMessage("Time slot is required"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { doctorId, date, timeSlot, notes } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(doctorId)) {
//       return res.status(400).json({ message: "Invalid doctor ID format" });
//     }

//     try {
//       const user = await User.findById(req.user.id);
//       if (!user) return res.status(404).json({ message: "User not found" });

//       const doctor = await Doctor.findById(doctorId);
//       if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//       // Check if slot is available
//       const existing = await Appointment.findOne({
//         doctor: doctorId,
//         date,
//         timeSlot,
//         status: { $ne: "cancelled" },
//       });

//       if (existing) {
//         return res
//           .status(400)
//           .json({ message: "This time slot is already booked" });
//       }

//       const appointment = await Appointment.create({
//         customer: user._id,
//         customerName: user.name,
//         customerEmail: user.email,
//         doctor: doctorId,
//         doctorName: doctor.name,
//         doctorSpeciality: doctor.speciality,
//         doctorNMC: doctor.nmcNumber,
//         date,
//         timeSlot,
//         notes: notes || "",
//       });

//       const populated = await Appointment.findById(appointment._id)
//         .populate("doctor", "name speciality nmcNumber")
//         .lean();

//       res.status(201).json({
//         message: "Appointment booked successfully",
//         appointment: populated,
//       });
//     } catch (err) {
//       console.error("❌ Create appointment error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ---------- GET customer's appointments ----------
// router.get("/appointments", authenticateToken, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ customer: req.user.id })
//       .populate("doctor", "name speciality nmcNumber")
//       .sort({ date: 1 })
//       .lean();

//     res.json(appointments);
//   } catch (err) {
//     console.error("❌ Get customer appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET customer profile
// router.get("/profile", authenticateToken, async (req, res) => {
//   try {
//     const profile = await User.findById(req.user.id)
//       .select("name email phone address profilePhoto accountStatus")
//       .lean();
//     res.json(profile);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // UPDATE profile
// router.put(
//   "/profile",
//   authenticateToken,
//   uploadProfilePhoto.single("profilePhoto"),
//   async (req, res) => {
//     try {
//       const updates = {
//         phone: req.body.phone?.trim(),
//         address: {
//           street: req.body.street?.trim(),
//           city: req.body.city?.trim(),
//           province: req.body.province?.trim(),
//           postalCode: req.body.postalCode?.trim(),
//         },
//       };

//       if (req.file) {
//         updates.profilePhoto = `/uploads/profiles/${req.file.filename}`;
//       }

//       const user = await User.findByIdAndUpdate(req.user.id, updates, {
//         new: true,
//         runValidators: true,
//       }).select("name email phone address profilePhoto accountStatus");

//       res.json(user);
//     } catch (err) {
//       res.status(500).json({ message: "Update failed" });
//     }
//   }
// );

// module.exports = router;

const express = require("express");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const authenticateToken = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const Prescription = require("../models/prescription.model");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/profiles");
    const fs = require("fs");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `profile-${req.user?.id || "user"}-${uniqueSuffix}${path.extname(
        file.originalname
      )}`
    );
  },
});

const uploadProfilePhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"), false);
  },
});

const router = express.Router();

// ---------- GET customer's prescriptions ----------
router.get("/prescriptions", authenticateToken, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "No user ID in token" });
    }

    const prescriptions = await Prescription.find({ customer: req.user.id })
      .populate("doctor", "name speciality")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    console.error("Get prescriptions error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------- GET customer's appointments ----------
router.get("/appointments", authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ customer: req.user.id })
      .populate("doctor", "name speciality nmcNumber")
      .sort({ date: 1, timeSlot: 1 })
      .lean();

    res.json(appointments);
  } catch (err) {
    console.error("Get customer appointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- Customer profile (get) ----------
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const profile = await User.findById(req.user.id)
      .select("name email phone address profilePhoto accountStatus")
      .lean();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- Customer profile (update) ----------
router.put(
  "/profile",
  authenticateToken,
  uploadProfilePhoto.single("profilePhoto"),
  async (req, res) => {
    try {
      const updates = {
        phone: req.body.phone?.trim(),
        address: {
          street: req.body.street?.trim(),
          city: req.body.city?.trim(),
          province: req.body.province?.trim(),
          postalCode: req.body.postalCode?.trim(),
        },
      };

      if (req.file) {
        updates.profilePhoto = `/uploads/profiles/${req.file.filename}`;
      }

      const user = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
        runValidators: true,
      }).select("name email phone address profilePhoto accountStatus");

      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Update failed" });
    }
  }
);

module.exports = router;
