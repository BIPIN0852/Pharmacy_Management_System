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
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) cb(null, true);
//     else cb(new Error("Only image files are allowed!"), false);
//   },
// });

// const router = express.Router();

// // ---------- GET customer's prescriptions ----------
// router.get("/prescriptions", authenticateToken, async (req, res) => {
//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({ message: "No user ID in token" });
//     }

//     const prescriptions = await Prescription.find({ customer: req.user.id })
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("Get prescriptions error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // ---------- GET customer's appointments ----------
// router.get("/appointments", authenticateToken, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ customer: req.user.id })
//       .populate("doctor", "name speciality nmcNumber")
//       .sort({ date: 1, timeSlot: 1 })
//       .lean();

//     res.json(appointments);
//   } catch (err) {
//     console.error("Get customer appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------- Customer profile (get) ----------
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

// // ---------- Customer profile (update) ----------
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

//

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const mongoose = require("mongoose");
// const authenticateToken = require("../middleware/auth");
// const multer = require("multer");
// const path = require("path");

// const Prescription = require("../models/Prescription"); // Correct casing
// const Appointment = require("../models/Appointment");
// const Doctor = require("../models/Doctor");
// const User = require("../models/User");
// const Order = require("../models/Order");
// const Transaction = require("../models/Transaction"); // Ensure this model exists, or create it if missing

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
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) cb(null, true);
//     else cb(new Error("Only image files are allowed!"), false);
//   },
// });

// const router = express.Router();

// // ---------- Helper: Format Prescription URL ----------
// const formatPrescription = (doc) => {
//   const p = doc.toObject ? doc.toObject() : doc;
//   // If it has a filename, construct the full URL
//   if (p.imageFilename) {
//     return {
//       ...p,
//       imageUrl: `/api/customer/prescriptions/image/${p.imageFilename}`,
//     };
//   }
//   return p;
// };

// // ---------- GET customer's prescriptions ----------
// router.get("/prescriptions", authenticateToken, async (req, res) => {
//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({ message: "No user ID in token" });
//     }

//     const prescriptions = await Prescription.find({ customer: req.user.id })
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     const formatted = prescriptions.map(formatPrescription);

//     res.json(formatted);
//   } catch (err) {
//     console.error("Get prescriptions error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // ---------- GET customer's appointments ----------
// router.get("/appointments", authenticateToken, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ customer: req.user.id })
//       .populate("doctor", "name speciality nmcNumber profilePhoto")
//       .sort({ date: 1, timeSlot: 1 })
//       .lean();

//     res.json(appointments);
//   } catch (err) {
//     console.error("Get customer appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------- Customer profile (get) ----------
// router.get("/profile", authenticateToken, async (req, res) => {
//   try {
//     const profile = await User.findById(req.user.id)
//       .select(
//         "name email phone address profilePhoto accountStatus savedMedicines"
//       )
//       .populate("savedMedicines")
//       .lean();
//     res.json(profile);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------- Customer profile (update) ----------
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

// // ==========================================
// // [UPDATED] ROUTES FOR HISTORY & SAVED ITEMS
// // ==========================================

// // ---------- GET customer's orders (History) ----------
// router.get("/orders", authenticateToken, async (req, res) => {
//   try {
//     // UPDATED: Use 'customerId' and populate 'items.medicineId' with baseUnit
//     const orders = await Order.find({ customerId: req.user.id })
//       .populate({
//         path: "items.medicineId",
//         select: "name image price baseUnit",
//       })
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (err) {
//     console.error("Get orders error:", err);
//     res.status(500).json({ message: "Error fetching orders" });
//   }
// });

// // ---------- GET transactions (History) ----------
// router.get("/transactions", authenticateToken, async (req, res) => {
//   try {
//     // If you haven't created a Transaction model yet, return empty array to prevent crash
//     if (!Transaction) return res.json([]);

//     const history = await Transaction.find({ user: req.user.id })
//       .sort({ createdAt: -1 })
//       .limit(20);
//     res.json(history);
//   } catch (err) {
//     // Fail silently with empty array if model missing, or log error
//     console.error(
//       "Get transactions error (Transaction model might be missing):",
//       err.message
//     );
//     res.json([]);
//   }
// });

// // ---------- POST simulate transaction (Helper) ----------
// router.post("/simulate-transaction", authenticateToken, async (req, res) => {
//   try {
//     if (!Transaction)
//       return res.status(500).json({ message: "Transaction model missing" });

//     const newTx = new Transaction({
//       user: req.user.id,
//       amount: req.body.amount,
//       type: req.body.type || "payment",
//       paymentMethod: req.body.method || "esewa",
//       status: "success",
//       description: req.body.desc || "Manual test transaction",
//     });
//     await newTx.save();
//     res.json(newTx);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to create transaction" });
//   }
// });

// // ---------- GET Saved Medicines (Wishlist) ----------
// router.get("/saved-medicines", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate("savedMedicines");
//     res.json(user.savedMedicines || []);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------- TOGGLE Saved Medicine (Add/Remove) ----------
// router.post("/saved-medicines/:id", authenticateToken, async (req, res) => {
//   try {
//     const medicineId = req.params.id;
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Initialize array if it doesn't exist
//     if (!user.savedMedicines) user.savedMedicines = [];

//     const index = user.savedMedicines.indexOf(medicineId);
//     let status;

//     if (index === -1) {
//       user.savedMedicines.push(medicineId);
//       status = "added";
//     } else {
//       user.savedMedicines.splice(index, 1);
//       status = "removed";
//     }

//     await user.save();
//     res.json({ status, savedMedicines: user.savedMedicines });
//   } catch (err) {
//     console.error("Toggle saved medicine error:", err);
//     res.status(500).json({ message: "Toggle failed" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");

// // Models
// const User = require("../models/User");
// const Prescription = require("../models/prescriptionModel");
// const Appointment = require("../models/Appointment");
// const Order = require("../models/Order");
// const Transaction = require("../models/Transaction");
// const Medicine = require("../models/Medicine");

// // Middleware
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// // -------------------------------------------------------------------
// // 📂 MULTER CONFIG FOR PROFILE PHOTOS
// // -------------------------------------------------------------------
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
//       `profile-${req.user._id}-${uniqueSuffix}${path.extname(
//         file.originalname
//       )}`
//     );
//   },
// });

// const uploadProfilePhoto = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) cb(null, true);
//     else cb(new Error("Only image files are allowed!"), false);
//   },
// });

// // -------------------------------------------------------------------
// // 💊 PRESCRIPTIONS
// // -------------------------------------------------------------------
// router.get("/prescriptions", protect, async (req, res) => {
//   try {
//     // ✅ Updated: Uses 'user' instead of 'customer'
//     const prescriptions = await Prescription.find({ user: req.user._id })
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("Get prescriptions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------------------------------------------------------
// // 📅 APPOINTMENTS
// // -------------------------------------------------------------------
// router.get("/appointments", protect, async (req, res) => {
//   try {
//     // ✅ Updated: Uses 'user' instead of 'customer'
//     const appointments = await Appointment.find({ user: req.user._id })
//       .populate("doctor", "name speciality nmcNumber image")
//       .sort({ date: 1, timeSlot: 1 })
//       .lean();

//     res.json(appointments);
//   } catch (err) {
//     console.error("Get customer appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------------------------------------------------------
// // 👤 PROFILE MANAGEMENT
// // -------------------------------------------------------------------

// // GET Profile
// router.get("/profile", protect, async (req, res) => {
//   try {
//     const profile = await User.findById(req.user._id)
//       .select("-password")
//       .populate("savedMedicines") // Populate Wishlist
//       .lean();
//     res.json(profile);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // UPDATE Profile (With Photo Upload)
// router.put(
//   "/profile",
//   protect,
//   uploadProfilePhoto.single("profilePhoto"),
//   async (req, res) => {
//     try {
//       // Build update object
//       const updates = {};
//       if (req.body.phone) updates.phone = req.body.phone.trim();

//       // Handle Address Update (Supports both flat fields and object)
//       if (req.body.street || req.body.city || req.body.province) {
//         updates.address = {
//           street: req.body.street || "",
//           city: req.body.city || "",
//           province: req.body.province || "",
//           postalCode: req.body.postalCode || "",
//         };
//       }

//       // Handle File Upload
//       if (req.file) {
//         updates.profilePhoto = `/uploads/profiles/${req.file.filename}`;
//       }

//       const user = await User.findByIdAndUpdate(req.user._id, updates, {
//         new: true,
//         runValidators: true,
//       }).select("-password");

//       res.json(user);
//     } catch (err) {
//       console.error("Profile update error:", err);
//       res.status(500).json({ message: "Update failed" });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // 📦 ORDERS HISTORY
// // -------------------------------------------------------------------
// router.get("/orders", protect, async (req, res) => {
//   try {
//     // ✅ Updated: Uses 'user' (not customerId) and 'orderItems.product' (not items.medicineId)
//     const orders = await Order.find({ user: req.user._id })
//       .populate({
//         path: "orderItems.product",
//         select: "name image price baseUnit brand",
//       })
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (err) {
//     console.error("Get orders error:", err);
//     res.status(500).json({ message: "Error fetching orders" });
//   }
// });

// // -------------------------------------------------------------------
// // 💳 TRANSACTIONS
// // -------------------------------------------------------------------
// router.get("/transactions", protect, async (req, res) => {
//   try {
//     const history = await Transaction.find({ user: req.user._id })
//       .sort({ transactionDate: -1 })
//       .limit(50);
//     res.json(history);
//   } catch (err) {
//     console.error("Get transactions error:", err.message);
//     res.status(500).json({ message: "Error fetching transactions" });
//   }
// });

// // HELPER: Simulate Transaction (For Testing/Manual Add)
// router.post("/simulate-transaction", protect, async (req, res) => {
//   try {
//     const newTx = await Transaction.create({
//       user: req.user._id,
//       amount: req.body.amount,
//       type: req.body.type || "Payment",
//       paymentMethod: req.body.method || "Khalti",
//       status: "Success",
//       description: req.body.desc || "Simulated transaction",
//       transactionDate: new Date(),
//     });
//     res.json(newTx);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to create transaction" });
//   }
// });

// // -------------------------------------------------------------------
// // ❤️ SAVED MEDICINES (Wishlist)
// // -------------------------------------------------------------------

// // GET Saved Items
// router.get("/saved-medicines", protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate("savedMedicines");
//     res.json(user.savedMedicines || []);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // TOGGLE Saved Item (Add/Remove)
// router.post("/saved-medicines/:id", protect, async (req, res) => {
//   try {
//     const medicineId = req.params.id;

//     // Check if medicine exists
//     const medicine = await Medicine.findById(medicineId);
//     if (!medicine)
//       return res.status(404).json({ message: "Medicine not found" });

//     const user = await User.findById(req.user._id);

//     // Initialize array if missing
//     if (!user.savedMedicines) user.savedMedicines = [];

//     const index = user.savedMedicines.indexOf(medicineId);
//     let status;

//     if (index === -1) {
//       user.savedMedicines.push(medicineId);
//       status = "added";
//     } else {
//       user.savedMedicines.splice(index, 1);
//       status = "removed";
//     }

//     await user.save();

//     // Return updated list
//     await user.populate("savedMedicines");
//     res.json({ status, savedMedicines: user.savedMedicines });
//   } catch (err) {
//     console.error("Toggle saved medicine error:", err);
//     res.status(500).json({ message: "Toggle failed" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs"); // Added fs for directory management

// // Models
// const User = require("../models/User");
// // ✅ Fixed: Updated to match your renamed file
// const Prescription = require("../models/prescriptionModel");
// const Appointment = require("../models/Appointment");
// const Order = require("../models/Order");
// const Transaction = require("../models/Transaction");
// const Medicine = require("../models/Medicine");

// // Middleware
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// // -------------------------------------------------------------------
// // 📂 MULTER CONFIG FOR PROFILE PHOTOS
// // -------------------------------------------------------------------
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "../uploads/profiles");
//     // ✅ Ensure directory exists to prevent upload errors
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       `profile-${req.user._id}-${uniqueSuffix}${path.extname(
//         file.originalname
//       )}`
//     );
//   },
// });

// const uploadProfilePhoto = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) cb(null, true);
//     else cb(new Error("Only image files are allowed!"), false);
//   },
// });

// // -------------------------------------------------------------------
// // 💊 PRESCRIPTIONS
// // -------------------------------------------------------------------
// router.get("/prescriptions", protect, async (req, res) => {
//   try {
//     // Standardized query: find by user ID attached from protect middleware
//     const prescriptions = await Prescription.find({ user: req.user._id })
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("Get prescriptions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------------------------------------------------------
// // 📅 APPOINTMENTS
// // -------------------------------------------------------------------
// router.get("/appointments", protect, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ user: req.user._id })
//       .populate("doctor", "name speciality nmcNumber image")
//       .sort({ date: 1, timeSlot: 1 })
//       .lean();

//     res.json(appointments);
//   } catch (err) {
//     console.error("Get customer appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------------------------------------------------------
// // 👤 PROFILE MANAGEMENT
// // -------------------------------------------------------------------

// // GET Profile
// router.get("/profile", protect, async (req, res) => {
//   try {
//     const profile = await User.findById(req.user._id)
//       .select("-password")
//       .populate("savedMedicines")
//       .lean();
//     res.json(profile);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // UPDATE Profile (With Photo Upload)
// router.put(
//   "/profile",
//   protect,
//   uploadProfilePhoto.single("profilePhoto"),
//   async (req, res) => {
//     try {
//       const updates = {};
//       if (req.body.phone) updates.phone = req.body.phone.trim();

//       // Handle Address Update
//       if (req.body.street || req.body.city || req.body.province) {
//         updates.address = {
//           street: req.body.street || "",
//           city: req.body.city || "",
//           province: req.body.province || "",
//           postalCode: req.body.postalCode || "",
//         };
//       }

//       // Handle File Upload
//       if (req.file) {
//         updates.profilePhoto = `/uploads/profiles/${req.file.filename}`;
//       }

//       const user = await User.findByIdAndUpdate(req.user._id, updates, {
//         new: true,
//         runValidators: true,
//       }).select("-password");

//       res.json(user);
//     } catch (err) {
//       console.error("Profile update error:", err);
//       res.status(500).json({ message: "Update failed" });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // 📦 ORDERS HISTORY
// // -------------------------------------------------------------------
// router.get("/orders", protect, async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id })
//       .populate({
//         path: "orderItems.product",
//         select: "name image price baseUnit brand",
//       })
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (err) {
//     console.error("Get orders error:", err);
//     res.status(500).json({ message: "Error fetching orders" });
//   }
// });

// // -------------------------------------------------------------------
// // 💳 TRANSACTIONS
// // -------------------------------------------------------------------
// router.get("/transactions", protect, async (req, res) => {
//   try {
//     const history = await Transaction.find({ user: req.user._id })
//       .sort({ transactionDate: -1 })
//       .limit(50);
//     res.json(history);
//   } catch (err) {
//     console.error("Get transactions error:", err.message);
//     res.status(500).json({ message: "Error fetching transactions" });
//   }
// });

// // -------------------------------------------------------------------
// // ❤️ SAVED MEDICINES (Wishlist)
// // -------------------------------------------------------------------

// // GET Saved Items
// router.get("/saved-medicines", protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate("savedMedicines");
//     res.json(user.savedMedicines || []);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // TOGGLE Saved Item (Add/Remove)
// router.post("/saved-medicines/:id", protect, async (req, res) => {
//   try {
//     const medicineId = req.params.id;
//     const medicine = await Medicine.findById(medicineId);
//     if (!medicine)
//       return res.status(404).json({ message: "Medicine not found" });

//     const user = await User.findById(req.user._id);
//     if (!user.savedMedicines) user.savedMedicines = [];

//     const index = user.savedMedicines.indexOf(medicineId);
//     let status;

//     if (index === -1) {
//       user.savedMedicines.push(medicineId);
//       status = "added";
//     } else {
//       user.savedMedicines.splice(index, 1);
//       status = "removed";
//     }

//     await user.save();
//     await user.populate("savedMedicines");
//     res.json({ status, savedMedicines: user.savedMedicines });
//   } catch (err) {
//     console.error("Toggle saved medicine error:", err);
//     res.status(500).json({ message: "Toggle failed" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Models
// const User = require("../models/User");
// const Prescription = require("../models/prescriptionModel"); // ✅ Kept your specific filename
// const Appointment = require("../models/Appointment");
// const Order = require("../models/Order");
// const Transaction = require("../models/Transaction");
// const Medicine = require("../models/Medicine");

// // Middleware
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// // -------------------------------------------------------------------
// // 📂 MULTER CONFIG FOR PROFILE PHOTOS
// // -------------------------------------------------------------------
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "../uploads/profiles");
//     // ✅ Directory Safety Check
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       `profile-${req.user._id}-${uniqueSuffix}${path.extname(
//         file.originalname
//       )}`
//     );
//   },
// });

// const uploadProfilePhoto = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) cb(null, true);
//     else cb(new Error("Only image files are allowed!"), false);
//   },
// });

// // -------------------------------------------------------------------
// // 💊 PRESCRIPTIONS
// // -------------------------------------------------------------------
// router.get("/prescriptions", protect, async (req, res) => {
//   try {
//     const prescriptions = await Prescription.find({ user: req.user._id })
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("Get prescriptions error:", err);
//     res.status(500).json({ message: "Server error fetching prescriptions" });
//   }
// });

// // -------------------------------------------------------------------
// // 📅 APPOINTMENTS
// // -------------------------------------------------------------------
// router.get("/appointments", protect, async (req, res) => {
//   try {
//     // ✅ Updated to include 'bookingReference' and sort by valid Date object
//     const appointments = await Appointment.find({ user: req.user._id })
//       .populate("doctor", "name speciality nmcNumber image")
//       .select("date day timeSlot status bookingReference doctor notes")
//       .sort({ date: 1, timeSlot: 1 }) // Upcoming first
//       .lean();

//     res.json(appointments);
//   } catch (err) {
//     console.error("Get customer appointments error:", err);
//     res.status(500).json({ message: "Server error fetching appointments" });
//   }
// });

// // -------------------------------------------------------------------
// // 👤 PROFILE MANAGEMENT
// // -------------------------------------------------------------------

// // GET Profile
// router.get("/profile", protect, async (req, res) => {
//   try {
//     const profile = await User.findById(req.user._id)
//       .select("-password")
//       .populate("savedMedicines")
//       .lean();
//     res.json(profile);
//   } catch (err) {
//     res.status(500).json({ message: "Server error fetching profile" });
//   }
// });

// // UPDATE Profile (With Photo Upload)
// router.put(
//   "/profile",
//   protect,
//   uploadProfilePhoto.single("profilePhoto"),
//   async (req, res) => {
//     try {
//       const updates = {};

//       // ✅ Added Name & Allergies to support User Model updates
//       if (req.body.name) updates.name = req.body.name.trim();
//       if (req.body.phone) updates.phone = req.body.phone.trim();
//       if (req.body.allergies) updates.allergies = req.body.allergies.trim();

//       // Handle Address Update (Reconstructs object from flat fields)
//       if (
//         req.body.street ||
//         req.body.city ||
//         req.body.province ||
//         req.body.postalCode
//       ) {
//         updates.address = {
//           street: req.body.street || "",
//           city: req.body.city || "",
//           province: req.body.province || "",
//           postalCode: req.body.postalCode || "",
//         };
//       }

//       // Handle File Upload
//       if (req.file) {
//         updates.profilePhoto = `/uploads/profiles/${req.file.filename}`;
//       }

//       const user = await User.findByIdAndUpdate(req.user._id, updates, {
//         new: true,
//         runValidators: true,
//       }).select("-password");

//       res.json(user);
//     } catch (err) {
//       console.error("Profile update error:", err);
//       res.status(500).json({ message: "Update failed" });
//     }
//   }
// );

// // -------------------------------------------------------------------
// // 📦 ORDERS HISTORY
// // -------------------------------------------------------------------
// router.get("/orders", protect, async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id })
//       .populate({
//         path: "orderItems.product",
//         select: "name image price baseUnit brand",
//       })
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (err) {
//     console.error("Get orders error:", err);
//     res.status(500).json({ message: "Error fetching orders" });
//   }
// });

// // -------------------------------------------------------------------
// // 💳 TRANSACTIONS
// // -------------------------------------------------------------------
// router.get("/transactions", protect, async (req, res) => {
//   try {
//     const history = await Transaction.find({ user: req.user._id })
//       .sort({ transactionDate: -1 })
//       .limit(50);
//     res.json(history);
//   } catch (err) {
//     console.error("Get transactions error:", err.message);
//     res.status(500).json({ message: "Error fetching transactions" });
//   }
// });

// // -------------------------------------------------------------------
// // ❤️ SAVED MEDICINES (Wishlist)
// // -------------------------------------------------------------------

// // GET Saved Items
// router.get("/saved-medicines", protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate("savedMedicines");
//     res.json(user.savedMedicines || []);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // TOGGLE Saved Item (Add/Remove)
// router.post("/saved-medicines/:id", protect, async (req, res) => {
//   try {
//     const medicineId = req.params.id;
//     const medicine = await Medicine.findById(medicineId);
//     if (!medicine)
//       return res.status(404).json({ message: "Medicine not found" });

//     const user = await User.findById(req.user._id);
//     if (!user.savedMedicines) user.savedMedicines = [];

//     const index = user.savedMedicines.indexOf(medicineId);
//     let status;

//     if (index === -1) {
//       user.savedMedicines.push(medicineId);
//       status = "added";
//     } else {
//       user.savedMedicines.splice(index, 1);
//       status = "removed";
//     }

//     await user.save();
//     await user.populate("savedMedicines");
//     res.json({ status, savedMedicines: user.savedMedicines });
//   } catch (err) {
//     console.error("Toggle saved medicine error:", err);
//     res.status(500).json({ message: "Toggle failed" });
//   }
// });

// module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Models
const User = require("../models/User");
const Prescription = require("../models/prescriptionModel");
const Appointment = require("../models/Appointment");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const Medicine = require("../models/Medicine");

// Middleware
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// -------------------------------------------------------------------
// 📂 MULTER CONFIG FOR PROFILE PHOTOS
// -------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/profiles");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `profile-${req.user._id}-${uniqueSuffix}${path.extname(
        file.originalname
      )}`
    );
  },
});

const uploadProfilePhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"), false);
  },
});

// -------------------------------------------------------------------
// 📊 DASHBOARD ANALYTICS (Overview Stats)
// -------------------------------------------------------------------
router.get("/dashboard-stats", protect, async (req, res) => {
  try {
    const [appointmentCount, orderCount, savedCount] = await Promise.all([
      Appointment.countDocuments({ user: req.user._id, status: "confirmed" }),
      Order.countDocuments({ user: req.user._id }),
      User.findById(req.user._id).then((u) => u.savedMedicines?.length || 0),
    ]);

    res.json({
      appointments: appointmentCount,
      orders: orderCount,
      savedItems: savedCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
});

// -------------------------------------------------------------------
// 💊 PRESCRIPTIONS
// -------------------------------------------------------------------
router.get("/prescriptions", protect, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user._id })
      .populate("doctor", "name speciality")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    console.error("Get prescriptions error:", err);
    res.status(500).json({ message: "Server error fetching prescriptions" });
  }
});

// -------------------------------------------------------------------
// 📅 APPOINTMENTS
// -------------------------------------------------------------------
router.get("/appointments", protect, async (req, res) => {
  try {
    // ✅ Logic: Fetch all appointments for history, sort by date
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("doctor", "name speciality nmcNumber image")
      .select("date day timeSlot status bookingReference doctor notes")
      .sort({ date: -1, timeSlot: -1 })
      .lean();

    res.json(appointments);
  } catch (err) {
    console.error("Get customer appointments error:", err);
    res.status(500).json({ message: "Server error fetching appointments" });
  }
});

// -------------------------------------------------------------------
// 👤 PROFILE MANAGEMENT
// -------------------------------------------------------------------

// GET Profile
router.get("/profile", protect, async (req, res) => {
  try {
    const profile = await User.findById(req.user._id)
      .select("-password")
      .populate("savedMedicines")
      .lean();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

// UPDATE Profile (With Photo Upload)
router.put(
  "/profile",
  protect,
  uploadProfilePhoto.single("profilePhoto"),
  async (req, res) => {
    try {
      const updates = {};

      if (req.body.name) updates.name = req.body.name.trim();
      if (req.body.phone) updates.phone = req.body.phone.trim();
      if (req.body.allergies) updates.allergies = req.body.allergies.trim();

      // Handle Address Update
      if (
        req.body.street ||
        req.body.city ||
        req.body.province ||
        req.body.postalCode
      ) {
        updates.address = {
          street: req.body.street || "",
          city: req.body.city || "",
          province: req.body.province || "",
          postalCode: req.body.postalCode || "",
        };
      }

      // Handle File Upload
      if (req.file) {
        updates.profilePhoto = `/uploads/profiles/${req.file.filename}`;
      }

      const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");

      res.json(user);
    } catch (err) {
      console.error("Profile update error:", err);
      res.status(500).json({ message: "Update failed" });
    }
  }
);

// -------------------------------------------------------------------
// 📦 ORDERS HISTORY
// -------------------------------------------------------------------
router.get("/orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: "orderItems.product",
        select: "name image price baseUnit brand",
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// -------------------------------------------------------------------
// 💳 TRANSACTIONS
// -------------------------------------------------------------------
router.get("/transactions", protect, async (req, res) => {
  try {
    const history = await Transaction.find({ user: req.user._id })
      .sort({ transactionDate: -1 })
      .limit(50);
    res.json(history);
  } catch (err) {
    console.error("Get transactions error:", err.message);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// -------------------------------------------------------------------
// ❤️ SAVED MEDICINES (Wishlist)
// -------------------------------------------------------------------

// GET Saved Items
router.get("/saved-medicines", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedMedicines");
    res.json(user.savedMedicines || []);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// TOGGLE Saved Item (Add/Remove)
router.post("/saved-medicines/:id", protect, async (req, res) => {
  try {
    const medicineId = req.params.id;
    const medicine = await Medicine.findById(medicineId);
    if (!medicine)
      return res.status(404).json({ message: "Medicine not found" });

    const user = await User.findById(req.user._id);
    if (!user.savedMedicines) user.savedMedicines = [];

    const index = user.savedMedicines.indexOf(medicineId);
    let status;

    if (index === -1) {
      user.savedMedicines.push(medicineId);
      status = "added";
    } else {
      user.savedMedicines.splice(index, 1);
      status = "removed";
    }

    await user.save();
    await user.populate("savedMedicines");
    res.json({ status, savedMedicines: user.savedMedicines });
  } catch (err) {
    console.error("Toggle saved medicine error:", err);
    res.status(500).json({ message: "Toggle failed" });
  }
});

module.exports = router;
