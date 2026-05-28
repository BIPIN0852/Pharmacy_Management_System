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
        file.originalname,
      )}`,
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
    //Fetch all appointments for history, sort by date
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
  },
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
