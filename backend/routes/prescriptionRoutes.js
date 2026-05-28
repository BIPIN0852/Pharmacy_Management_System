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
