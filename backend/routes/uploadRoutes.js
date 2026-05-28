const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// -------------------------------------------------------------------
// 1. CLOUDINARY CONFIGURATION
// -------------------------------------------------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------------------------------------------------------
// 2. CONFIGURE CLOUDINARY STORAGE
// -------------------------------------------------------------------
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pms_medicines",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

// -------------------------------------------------------------------
// 3. INITIALIZE MULTER WITH CLOUDINARY
// -------------------------------------------------------------------
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// -------------------------------------------------------------------
// 4. DEFINE ROUTE
// @route   POST /api/upload
// @desc    Upload image to Cloudinary (Customers & Admins)
// -------------------------------------------------------------------
router.post("/", protect, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // req.file.path contains the secure HTTPS URL from Cloudinary
    const cloudPath = req.file.path;

    res.status(201).json({
      message: "Image uploaded to Cloudinary successfully",
      image: cloudPath,
      imageUrl: cloudPath, // Sent both for frontend compatibility
    });
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({ message: "Server error during cloud upload" });
  }
});

module.exports = router;
