// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Middleware
// const { protect, admin } = require("../middleware/authMiddleware");

// const router = express.Router();

// // -------------------------------------------------------------------
// // 1. CONFIGURE STORAGE & DIRECTORY
// // -------------------------------------------------------------------
// const uploadDir = path.join(__dirname, "../uploads");

// // Ensure 'uploads' folder exists
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     // Save to 'backend/uploads/' folder
//     cb(null, uploadDir);
//   },
//   filename(req, file, cb) {
//     // Create unique filename: image-date-random.ext
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
//     );
//   },
// });

// // -------------------------------------------------------------------
// // 2. VALIDATE FILE TYPE
// // -------------------------------------------------------------------
// function checkFileType(file, cb) {
//   const filetypes = /jpg|jpeg|png|webp/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb(new Error("Images only! (jpg, jpeg, png, webp)"));
//   }
// }

// // -------------------------------------------------------------------
// // 3. INITIALIZE MULTER
// // -------------------------------------------------------------------
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// });

// // -------------------------------------------------------------------
// // 4. DEFINE ROUTE
// // @route   POST /api/upload
// // @desc    Upload product/medicine image (Customers & Admins)
// // -------------------------------------------------------------------

// router.post("/", protect, upload.single("image"), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Return the path formatted for frontend access
//     // Assuming server.js serves '/uploads' statically
//     const formattedPath = `/uploads/${req.file.filename}`;

//     res.status(201).json({
//       message: "Image uploaded successfully",
//       image: formattedPath,
//       imageUrl: formattedPath,
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ message: "Server error during upload" });
//   }
// });

// module.exports = router;

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
    folder: "pms_medicines", // Folder name inside your Cloudinary Media Library
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }], // Optional: Auto-resize
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

    // ✅ req.file.path contains the secure HTTPS URL from Cloudinary
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
