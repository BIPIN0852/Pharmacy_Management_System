const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");

// -------------------------------------------------------------------
// 🛠️ MULTER CONFIGURATION FOR DOCTOR IMAGES
// -------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ✅ FIX: Save to the "uploads/" folder so it matches the database
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Create a unique filename: doctor-1612345678.jpg
    cb(null, `doctor-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images are allowed!"), false);
  },
});

// Helper Middleware: Formats FormData before passing to your existing controller
const processDoctorFormData = (req, res, next) => {
  // 1. If an image was uploaded, attach the path to req.body.image
  if (req.file) {
    // ✅ FIX: Set the database path to /uploads/ so the frontend can find it
    req.body.image = `/uploads/${req.file.filename}`;
  }

  // 2. Because FormData sends arrays as text, we must parse "slots" back into a JSON array
  if (req.body.slots && typeof req.body.slots === "string") {
    try {
      req.body.slots = JSON.parse(req.body.slots);
    } catch (err) {
      console.error("Error parsing slots JSON:", err);
      req.body.slots = [];
    }
  }

  // 3. Convert isAvailable string to boolean
  if (req.body.isAvailable !== undefined) {
    req.body.isAvailable = req.body.isAvailable === "true";
  }

  next();
};

// Import the controller functions
const {
  getAdminStats,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getAllMedicines,
  updateMedicine,
  getAllDoctors,
  createDoctor,
  requestDoctorOtp, // ✅ NEW: Import Request OTP
  verifyAndCreateDoctor, // ✅ NEW: Import Verify OTP
  updateDoctor,
  deleteDoctor,
  getAllPurchases,
  createPurchaseOrder,
  updatePurchaseStatus,
} = require("../controllers/adminController");

// -------------------------------------------------------------------
// 📊 1. DASHBOARD & STAFF REGISTRY
// -------------------------------------------------------------------
router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

// -------------------------------------------------------------------
// 🛒 2. CUSTOMER ORDER MANAGEMENT
// -------------------------------------------------------------------
router.get("/orders", protect, authorizeRoles("admin"), getAllOrders);
router.put(
  "/orders/:id/status",
  protect,
  authorizeRoles("admin"),
  updateOrderStatus,
);

// -------------------------------------------------------------------
// 🩺 3. DOCTOR MANAGEMENT (MEDICAL STAFF)
// -------------------------------------------------------------------

// ✅ NEW: Request OTP for Doctor Registration
router.post(
  "/request-doctor-otp",
  protect,
  authorizeRoles("admin"),
  requestDoctorOtp,
);

// ✅ NEW: Verify OTP and Create Doctor (Handles image uploads just like createDoctor)
router.post(
  "/verify-create-doctor",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  processDoctorFormData,
  verifyAndCreateDoctor,
);

router
  .route("/doctors")
  .get(protect, authorizeRoles("admin"), getAllDoctors)
  // Legacy creation route (kept for backward compatibility)
  .post(
    protect,
    authorizeRoles("admin"),
    upload.single("image"),
    processDoctorFormData,
    createDoctor,
  );

router
  .route("/doctors/:id")
  // ✅ Edit route uses the same upload middleware
  .put(
    protect,
    authorizeRoles("admin"),
    upload.single("image"),
    processDoctorFormData,
    updateDoctor,
  )
  .delete(protect, authorizeRoles("admin"), deleteDoctor);

// -------------------------------------------------------------------
// 🏢 4. SUPPLIER MANAGEMENT (CRUD)
// -------------------------------------------------------------------
router
  .route("/suppliers")
  .get(protect, authorizeRoles("admin"), getAllSuppliers)
  .post(protect, authorizeRoles("admin"), createSupplier);

router
  .route("/suppliers/:id")
  .put(protect, authorizeRoles("admin"), updateSupplier)
  .delete(protect, authorizeRoles("admin"), deleteSupplier);

// -------------------------------------------------------------------
// 💊 5. INVENTORY MANAGEMENT
// -------------------------------------------------------------------
router.get("/medicines", protect, authorizeRoles("admin"), getAllMedicines);
router.put("/medicines/:id", protect, authorizeRoles("admin"), updateMedicine);

// -------------------------------------------------------------------
// 📦 6. PURCHASE ORDER ROUTES (STOCK ENTRY)
// -------------------------------------------------------------------
router
  .route("/purchases")
  .get(protect, authorizeRoles("admin"), getAllPurchases)
  .post(protect, authorizeRoles("admin"), createPurchaseOrder);

router.put(
  "/purchases/:id/status",
  protect,
  authorizeRoles("admin"),
  updatePurchaseStatus,
);

module.exports = router;
