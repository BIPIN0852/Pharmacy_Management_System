// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const router = express.Router();

// // 1. Configure Storage
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     // Save to 'backend/uploads/' folder
//     cb(null, "uploads/");
//   },
//   filename(req, file, cb) {
//     // Create unique filename: fieldname-date-random.ext
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// // 2. Validate File Type (Images only)
// function checkFileType(file, cb) {
//   const filetypes = /jpg|jpeg|png|webp/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb("Images only!");
//   }
// }

// // 3. Initialize Multer
// const upload = multer({
//   storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// });

// // 4. Define Route
// // POST /api/upload
// // Expects a form-data field named 'image'
// router.post("/", upload.single("image"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send({ message: "No file uploaded" });
//   }
//   // Return the path so frontend can use it
//   res.send(`/${req.file.path.replace(/\\/g, "/")}`);
// });

// module.exports = router;

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Middleware
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// -------------------------------------------------------------------
// 1. CONFIGURE STORAGE & DIRECTORY
// -------------------------------------------------------------------
const uploadDir = path.join(__dirname, "../uploads");

// Ensure 'uploads' folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Save to 'backend/uploads/' folder
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    // Create unique filename: image-date-random.ext
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// -------------------------------------------------------------------
// 2. VALIDATE FILE TYPE
// -------------------------------------------------------------------
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Images only! (jpg, jpeg, png, webp)"));
  }
}

// -------------------------------------------------------------------
// 3. INITIALIZE MULTER
// -------------------------------------------------------------------
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// -------------------------------------------------------------------
// 4. DEFINE ROUTE
// @route   POST /api/upload
// @desc    Upload product/medicine image (Admin Only)
// -------------------------------------------------------------------
router.post("/", protect, admin, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Return the path formatted for frontend access
    // Assuming server.js serves '/uploads' statically
    const formattedPath = `/uploads/${req.file.filename}`;

    res.status(201).json({
      message: "Image uploaded successfully",
      image: formattedPath,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error during upload" });
  }
});

module.exports = router;
