// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Controllers
// const {
//   uploadPrescription,
//   getMyPrescriptions,
//   getPrescriptions,
//   updatePrescriptionStatus,
//   deletePrescription,
//   getPatientHistory, // ✅ IMPORTED the new history function
// } = require("../controllers/prescriptionController");

// // Middleware
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");

// // -------------------------------------------------------------------
// // 📂 MULTER CONFIG (File Upload)
// // -------------------------------------------------------------------
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, "../uploads/prescriptions");
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `rx-${uniqueSuffix}${path.extname(file.originalname)}`);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype.startsWith("image/") ||
//       file.mimetype === "application/pdf"
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image and PDF files are allowed!"), false);
//     }
//   },
// });

// // -------------------------------------------------------------------
// // CUSTOMER ROUTES
// // -------------------------------------------------------------------

// // ✅ IMPORTANT: This must be BEFORE the /:id route!
// // Matches: GET /api/prescriptions/my
// router.route("/my").get(protect, getMyPrescriptions);

// // Matches: POST /api/prescriptions (Upload)
// router.route("/").post(protect, upload.single("image"), uploadPrescription);

// // -------------------------------------------------------------------
// // 🩺 DOCTOR / ADMIN HISTORY ROUTES
// // -------------------------------------------------------------------

// // ✅ NEW: Fetch a specific patient's prescription history (Doctor/Admin)
// router.get(
//   "/patient/:patientId",
//   protect,
//   authorizeRoles("doctor", "admin"),
//   getPatientHistory,
// );

// // -------------------------------------------------------------------
// // GENERAL & ADMIN ROUTES
// // -------------------------------------------------------------------

// // Matches: GET /api/prescriptions (Dashboard List)
// // ✅ UPDATED: Added "customer" so ProfilePage can fetch user's own prescriptions
// router
//   .route("/")
//   .get(
//     protect,
//     authorizeRoles("admin", "pharmacist", "customer"),
//     getPrescriptions,
//   );

// // Matches: PUT/DELETE /api/prescriptions/:id
// router
//   .route("/:id")
//   .put(protect, authorizeRoles("admin", "pharmacist"), updatePrescriptionStatus)
//   .delete(protect, deletePrescription);

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");

// Controllers
const {
  uploadPrescription,
  getMyPrescriptions,
  getPrescriptions,
  updatePrescriptionStatus,
  deletePrescription,
  getPatientHistory,
} = require("../controllers/prescriptionController");

// -------------------------------------------------------------------
// 📂 CLOUDINARY CONFIG (Cloud Upload)
// -------------------------------------------------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pms_prescriptions", // Organized folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});

// -------------------------------------------------------------------
// CUSTOMER ROUTES
// -------------------------------------------------------------------

// Matches: GET /api/prescriptions/my
router.route("/my").get(protect, getMyPrescriptions);

// ✅ UPDATED: Now handles multiple fields for Prescription and Supportive ID
// Matches: POST /api/prescriptions
router.route("/").post(
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "supportiveDocument", maxCount: 1 },
  ]),
  uploadPrescription,
);

// -------------------------------------------------------------------
// 🩺 DOCTOR / ADMIN HISTORY ROUTES
// -------------------------------------------------------------------

// Fetch a specific patient's prescription history (Doctor/Admin)
router.get(
  "/patient/:patientId",
  protect,
  authorizeRoles("doctor", "admin"),
  getPatientHistory,
);

// -------------------------------------------------------------------
// GENERAL & ADMIN ROUTES
// -------------------------------------------------------------------

// Matches: GET /api/prescriptions (Dashboard List)
router
  .route("/")
  .get(
    protect,
    authorizeRoles("admin", "pharmacist", "customer"),
    getPrescriptions,
  );

// Matches: PUT/DELETE /api/prescriptions/:id
router
  .route("/:id")
  .put(protect, authorizeRoles("admin", "pharmacist"), updatePrescriptionStatus)
  .delete(protect, deletePrescription);

module.exports = router;
