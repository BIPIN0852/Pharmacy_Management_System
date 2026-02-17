// const express = require("express");
// const router = express.Router();
// const {
//   uploadPrescription,
//   getMyPrescriptions,
//   getAllPrescriptions,
//   updatePrescriptionStatus,
//   deletePrescription,
// } = require("../controllers/prescriptionController");
// const { protect, authorize } = require("../middleware/authMiddleware");

// // ==========================================
// //  CUSTOMER ROUTES
// // ==========================================

// // @desc    Get logged-in user's prescriptions
// // @route   GET /api/prescriptions/my
// // @access  Private (Customer)
// router.route("/my").get(protect, getMyPrescriptions);

// // @desc    Upload a new prescription
// // @route   POST /api/prescriptions
// // @access  Private (Customer)
// // Note: This route also handles GET for Pharmacists (see below)
// router.route("/").post(protect, uploadPrescription);

// // ==========================================
// //  PHARMACIST & ADMIN ROUTES
// // ==========================================

// // @desc    Get ALL prescriptions (for Dashboard)
// // @route   GET /api/prescriptions
// // @access  Private (Admin, Pharmacist)
// router
//   .route("/")
//   .get(protect, authorize("admin", "pharmacist"), getAllPrescriptions);

// // @desc    Update Status (Approve/Reject) & Delete
// // @route   PUT /api/prescriptions/:id
// // @route   DELETE /api/prescriptions/:id
// // @access  PUT: Staff Only | DELETE: Owner or Staff
// router
//   .route("/:id")
//   .put(protect, authorize("admin", "pharmacist"), updatePrescriptionStatus)
//   .delete(protect, deletePrescription);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");

// // Controllers
// const {
//   uploadPrescription,
//   getMyPrescriptions,
//   getAllPrescriptions,
//   updatePrescriptionStatus,
//   deletePrescription,
// } = require("../controllers/prescriptionController");

// // Middleware
// const { protect } = require("../middleware/authMiddleware");
// const authorize = require("../middleware/role"); // ✅ Use standardized role checker

// // -------------------------------------------------------------------
// // 📂 MULTER CONFIG (File Upload)
// // -------------------------------------------------------------------
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Ensure this directory exists: backend/uploads/prescriptions
//     cb(null, path.join(__dirname, "../uploads/prescriptions"));
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
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed!"), false);
//     }
//   },
// });

// // -------------------------------------------------------------------
// // CUSTOMER ROUTES
// // -------------------------------------------------------------------

// // @desc    Get logged-in user's prescriptions
// // @route   GET /api/prescriptions/my
// // @access  Private (Customer)
// router.route("/my").get(protect, getMyPrescriptions);

// // @desc    Upload a new prescription
// // @route   POST /api/prescriptions
// // @access  Private (Customer)
// // ✅ ADDED: 'upload.single("image")' middleware to handle file parsing
// router.route("/").post(protect, upload.single("image"), uploadPrescription);

// // -------------------------------------------------------------------
// // PHARMACIST & ADMIN ROUTES
// // -------------------------------------------------------------------

// // @desc    Get ALL prescriptions (for Dashboard)
// // @route   GET /api/prescriptions
// // @access  Private (Admin, Pharmacist)
// router
//   .route("/")
//   .get(protect, authorize("admin", "pharmacist"), getAllPrescriptions);

// // @desc    Update Status (Approve/Reject) & Delete
// // @route   PUT /api/prescriptions/:id
// // @route   DELETE /api/prescriptions/:id
// // @access  PUT: Staff Only | DELETE: Owner or Staff
// router
//   .route("/:id")
//   .put(protect, authorize("admin", "pharmacist"), updatePrescriptionStatus)
//   .delete(protect, deletePrescription);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Controllers
// // ✅ Verified that all names match the module.exports in prescriptionController.js
// const {
//   uploadPrescription,
//   getMyPrescriptions,
//   getPrescriptions, // Changed from getAllPrescriptions to match controller
//   updatePrescriptionStatus,
//   deletePrescription,
// } = require("../controllers/prescriptionController");

// // Middleware
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role"); // ✅ Fixed: Match your role.js export

// // -------------------------------------------------------------------
// // 📂 MULTER CONFIG (File Upload)
// // -------------------------------------------------------------------
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Path logic: backend/uploads/prescriptions
//     const dir = path.join(__dirname, "../uploads/prescriptions");

//     // Auto-create directory if it doesn't exist to prevent crashes
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
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed!"), false);
//     }
//   },
// });

// // -------------------------------------------------------------------
// // CUSTOMER ROUTES
// // -------------------------------------------------------------------

// /**
//  * @route   GET /api/prescriptions/my
//  * @desc    Get logged-in user's prescriptions
//  */
// router.route("/my").get(protect, getMyPrescriptions);

// /**
//  * @route   POST /api/prescriptions
//  * @desc    Upload a new prescription
//  */
// router.route("/").post(protect, upload.single("image"), uploadPrescription);

// // -------------------------------------------------------------------
// // PHARMACIST & ADMIN ROUTES
// // -------------------------------------------------------------------

// /**
//  * @route   GET /api/prescriptions
//  * @desc    Get ALL prescriptions (Staff Dashboard)
//  */
// router
//   .route("/")
//   .get(protect, authorizeRoles("admin", "pharmacist"), getPrescriptions);

// /**
//  * @route   PUT /api/prescriptions/:id
//  * @route   DELETE /api/prescriptions/:id
//  * @desc    Update Status or Delete
//  */
// router
//   .route("/:id")
//   .put(protect, authorizeRoles("admin", "pharmacist"), updatePrescriptionStatus)
//   .delete(protect, deletePrescription);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Controllers
// // ✅ Verified: Names match module.exports in prescriptionController.js
// const {
//   uploadPrescription,
//   getMyPrescriptions,
//   getPrescriptions,
//   updatePrescriptionStatus,
//   deletePrescription,
// } = require("../controllers/prescriptionController");

// // Middleware
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");

// // -------------------------------------------------------------------
// // 📂 MULTER CONFIG (File Upload)
// // -------------------------------------------------------------------
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Path: backend/uploads/prescriptions
//     const dir = path.join(__dirname, "../uploads/prescriptions");

//     // Auto-create directory if it doesn't exist
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
//     // ✅ Updated to allow PDFs (matching frontend accept attribute)
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

// /**
//  * @route   GET /api/prescriptions/my
//  * @desc    Get logged-in user's prescriptions
//  */
// router.route("/my").get(protect, getMyPrescriptions);

// /**
//  * @route   POST /api/prescriptions
//  * @desc    Upload a new prescription
//  */
// router.route("/").post(protect, upload.single("image"), uploadPrescription);

// // -------------------------------------------------------------------
// // PHARMACIST & ADMIN ROUTES
// // -------------------------------------------------------------------

// /**
//  * @route   GET /api/prescriptions
//  * @desc    Get ALL prescriptions (Staff Dashboard)
//  */
// router
//   .route("/")
//   .get(protect, authorizeRoles("admin", "pharmacist"), getPrescriptions);

// /**
//  * @route   PUT /api/prescriptions/:id
//  * @route   DELETE /api/prescriptions/:id
//  * @desc    Update Status or Delete
//  */
// router
//   .route("/:id")
//   .put(protect, authorizeRoles("admin", "pharmacist"), updatePrescriptionStatus)
//   .delete(protect, deletePrescription);

// module.exports = router;

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
// // PHARMACIST & ADMIN ROUTES
// // -------------------------------------------------------------------

// // Matches: GET /api/prescriptions (Dashboard List)
// router
//   .route("/")
//   .get(protect, authorizeRoles("admin", "pharmacist"), getPrescriptions);

// // Matches: PUT/DELETE /api/prescriptions/:id
// router
//   .route("/:id")
//   .put(protect, authorizeRoles("admin", "pharmacist"), updatePrescriptionStatus)
//   .delete(protect, deletePrescription);

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Controllers
const {
  uploadPrescription,
  getMyPrescriptions,
  getPrescriptions,
  updatePrescriptionStatus,
  deletePrescription,
} = require("../controllers/prescriptionController");

// Middleware
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");

// -------------------------------------------------------------------
// 📂 MULTER CONFIG (File Upload)
// -------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/prescriptions");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `rx-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image and PDF files are allowed!"), false);
    }
  },
});

// -------------------------------------------------------------------
// CUSTOMER ROUTES
// -------------------------------------------------------------------

// ✅ IMPORTANT: This must be BEFORE the /:id route!
// Matches: GET /api/prescriptions/my
router.route("/my").get(protect, getMyPrescriptions);

// Matches: POST /api/prescriptions (Upload)
router.route("/").post(protect, upload.single("image"), uploadPrescription);

// -------------------------------------------------------------------
// GENERAL & ADMIN ROUTES
// -------------------------------------------------------------------

// Matches: GET /api/prescriptions (Dashboard List)
// ✅ UPDATED: Added "customer" so ProfilePage can fetch user's own prescriptions
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
