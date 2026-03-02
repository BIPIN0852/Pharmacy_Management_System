// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");

// // Import the controller functions
// const {
//   getAdminStats,
//   getAllUsers,
//   getAllOrders,
//   updateOrderStatus,
//   getAllSuppliers,
//   createSupplier,
//   updateSupplier,
//   deleteSupplier,
//   getAllMedicines,
//   updateMedicine, // ✅ Added for complete inventory control
//   getAllDoctors,
//   createDoctor,
//   updateDoctor,
//   deleteDoctor,
//   getAllPurchases,
//   createPurchaseOrder,
//   updatePurchaseStatus,
// } = require("../controllers/adminController");

// // -------------------------------------------------------------------
// // 📊 1. DASHBOARD & STAFF REGISTRY
// // -------------------------------------------------------------------

// // @desc    Get dashboard statistics
// // @route   GET /api/admin/stats
// router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

// // @desc    Get all staff/users for Staff Management
// // @route   GET /api/admin/users
// router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

// // -------------------------------------------------------------------
// // 🛒 2. CUSTOMER ORDER MANAGEMENT
// // -------------------------------------------------------------------

// // @desc    Get all customer orders for management
// // @route   GET /api/admin/orders
// router.get("/orders", protect, authorizeRoles("admin"), getAllOrders);

// // @desc    Update Order fulfillment status
// // @route   PUT /api/admin/orders/:id/status
// router.put(
//   "/orders/:id/status",
//   protect,
//   authorizeRoles("admin"),
//   updateOrderStatus
// );

// // -------------------------------------------------------------------
// // 🩺 3. DOCTOR MANAGEMENT (MEDICAL STAFF)
// // -------------------------------------------------------------------

// // @desc    Get all doctors or register a new one
// // @route   GET /api/admin/doctors | POST /api/admin/doctors
// router
//   .route("/doctors")
//   .get(protect, authorizeRoles("admin"), getAllDoctors)
//   .post(protect, authorizeRoles("admin"), createDoctor);

// // @desc    Update or remove a doctor from the directory
// // @route   PUT /api/admin/doctors/:id | DELETE /api/admin/doctors/:id
// // ✅ Essential for the Edit button in AdminDoctors.jsx to save changes
// router
//   .route("/doctors/:id")
//   .put(protect, authorizeRoles("admin"), updateDoctor)
//   .delete(protect, authorizeRoles("admin"), deleteDoctor);

// // -------------------------------------------------------------------
// // 🏢 4. SUPPLIER MANAGEMENT (CRUD)
// // -------------------------------------------------------------------

// // @desc    Get all suppliers or create a new one
// router
//   .route("/suppliers")
//   .get(protect, authorizeRoles("admin"), getAllSuppliers)
//   .post(protect, authorizeRoles("admin"), createSupplier);

// // @desc    Update or delete a supplier
// router
//   .route("/suppliers/:id")
//   .put(protect, authorizeRoles("admin"), updateSupplier)
//   .delete(protect, authorizeRoles("admin"), deleteSupplier);

// // -------------------------------------------------------------------
// // 💊 5. INVENTORY MANAGEMENT
// // -------------------------------------------------------------------

// // @desc    Get all medicines or update specific medicine details
// router.get("/medicines", protect, authorizeRoles("admin"), getAllMedicines);

// // @desc    Update medicine stock or details
// // @route   PUT /api/admin/medicines/:id
// router.put("/medicines/:id", protect, authorizeRoles("admin"), updateMedicine);

// // -------------------------------------------------------------------
// // 📦 6. PURCHASE ORDER ROUTES (STOCK ENTRY)
// // -------------------------------------------------------------------

// // @desc    Get all purchases or create a new Purchase Order
// router
//   .route("/purchases")
//   .get(protect, authorizeRoles("admin"), getAllPurchases)
//   .post(protect, authorizeRoles("admin"), createPurchaseOrder);

// // @desc    Update Purchase Order status (e.g., mark as Received)
// router.put(
//   "/purchases/:id/status",
//   protect,
//   authorizeRoles("admin"),
//   updatePurchaseStatus
// );

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");

// // Import the controller functions
// const {
//   getAdminStats,
//   getAllUsers,
//   getAllOrders,
//   updateOrderStatus,
//   getAllSuppliers,
//   createSupplier,
//   updateSupplier,
//   deleteSupplier,
//   getAllMedicines,
//   updateMedicine, // ✅ Added for complete inventory control
//   getAllDoctors,
//   createDoctor,
//   updateDoctor,
//   deleteDoctor,
//   getAllPurchases,
//   createPurchaseOrder,
//   updatePurchaseStatus,
// } = require("../controllers/adminController");

// // -------------------------------------------------------------------
// // 📊 1. DASHBOARD & STAFF REGISTRY
// // -------------------------------------------------------------------

// // @desc    Get dashboard statistics (Sales, Counts, Graphs)
// // @route   GET /api/admin/stats
// router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

// // @desc    Get all staff/users for Staff Management Table
// // @route   GET /api/admin/users
// router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

// // -------------------------------------------------------------------
// // 🛒 2. CUSTOMER ORDER MANAGEMENT
// // -------------------------------------------------------------------

// // @desc    Get all customer orders for management
// // @route   GET /api/admin/orders
// router.get("/orders", protect, authorizeRoles("admin"), getAllOrders);

// // @desc    Update Order fulfillment status (e.g., Delivered)
// // @route   PUT /api/admin/orders/:id/status
// router.put(
//   "/orders/:id/status",
//   protect,
//   authorizeRoles("admin"),
//   updateOrderStatus
// );

// // -------------------------------------------------------------------
// // 🩺 3. DOCTOR MANAGEMENT (MEDICAL STAFF)
// // -------------------------------------------------------------------
// // Note: Schema validation for slots/phone is handled in the Doctor Model

// // @desc    Get all doctors or register a new one
// // @route   GET /api/admin/doctors | POST /api/admin/doctors
// router
//   .route("/doctors")
//   .get(protect, authorizeRoles("admin"), getAllDoctors)
//   .post(protect, authorizeRoles("admin"), createDoctor);

// // @desc    Update or remove a doctor from the directory
// // @route   PUT /api/admin/doctors/:id | DELETE /api/admin/doctors/:id
// // ✅ Essential for the Edit/Delete buttons in AdminDoctors.jsx
// router
//   .route("/doctors/:id")
//   .put(protect, authorizeRoles("admin"), updateDoctor)
//   .delete(protect, authorizeRoles("admin"), deleteDoctor);

// // -------------------------------------------------------------------
// // 🏢 4. SUPPLIER MANAGEMENT (CRUD)
// // -------------------------------------------------------------------

// // @desc    Get all suppliers or create a new one
// // @route   GET /api/admin/suppliers | POST /api/admin/suppliers
// router
//   .route("/suppliers")
//   .get(protect, authorizeRoles("admin"), getAllSuppliers)
//   .post(protect, authorizeRoles("admin"), createSupplier);

// // @desc    Update or delete a supplier
// // @route   PUT /api/admin/suppliers/:id | DELETE /api/admin/suppliers/:id
// router
//   .route("/suppliers/:id")
//   .put(protect, authorizeRoles("admin"), updateSupplier)
//   .delete(protect, authorizeRoles("admin"), deleteSupplier);

// // -------------------------------------------------------------------
// // 💊 5. INVENTORY MANAGEMENT
// // -------------------------------------------------------------------

// // @desc    Get all medicines for the Inventory Table
// // @route   GET /api/admin/medicines
// router.get("/medicines", protect, authorizeRoles("admin"), getAllMedicines);

// // @desc    Update medicine stock or details (Restocking/Price change)
// // @route   PUT /api/admin/medicines/:id
// router.put("/medicines/:id", protect, authorizeRoles("admin"), updateMedicine);

// // -------------------------------------------------------------------
// // 📦 6. PURCHASE ORDER ROUTES (STOCK ENTRY)
// // -------------------------------------------------------------------

// // @desc    Get all purchases or create a new Purchase Order
// // @route   GET /api/admin/purchases | POST /api/admin/purchases
// router
//   .route("/purchases")
//   .get(protect, authorizeRoles("admin"), getAllPurchases)
//   .post(protect, authorizeRoles("admin"), createPurchaseOrder);

// // @desc    Update Purchase Order status (e.g., mark as Received to update stock)
// // @route   PUT /api/admin/purchases/:id/status
// router.put(
//   "/purchases/:id/status",
//   protect,
//   authorizeRoles("admin"),
//   updatePurchaseStatus
// );

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");

// // Import the controller functions
// const {
//   getAdminStats, // ✅ Connects to the new Date-Filtered Stats
//   getAllUsers,
//   getAllOrders,
//   updateOrderStatus,
//   getAllSuppliers,
//   createSupplier,
//   updateSupplier,
//   deleteSupplier,
//   getAllMedicines,
//   updateMedicine,
//   getAllDoctors,
//   createDoctor,
//   updateDoctor,
//   deleteDoctor,
//   getAllPurchases,
//   createPurchaseOrder,
//   updatePurchaseStatus,
// } = require("../controllers/adminController");

// // -------------------------------------------------------------------
// // 📊 1. DASHBOARD & STAFF REGISTRY
// // -------------------------------------------------------------------

// // @desc    Get dashboard statistics (Sales, Counts, Graphs)
// // @route   GET /api/admin/stats
// // Note: Frontend sends ?range=7, handled automatically by controller
// router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

// // @desc    Get all staff/users for Staff Management Table
// // @route   GET /api/admin/users
// router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

// // -------------------------------------------------------------------
// // 🛒 2. CUSTOMER ORDER MANAGEMENT
// // -------------------------------------------------------------------

// // @desc    Get all customer orders for management
// // @route   GET /api/admin/orders
// router.get("/orders", protect, authorizeRoles("admin"), getAllOrders);

// // @desc    Update Order fulfillment status (e.g., Delivered)
// // @route   PUT /api/admin/orders/:id/status
// router.put(
//   "/orders/:id/status",
//   protect,
//   authorizeRoles("admin"),
//   updateOrderStatus,
// );

// // -------------------------------------------------------------------
// // 🩺 3. DOCTOR MANAGEMENT (MEDICAL STAFF)
// // -------------------------------------------------------------------

// // @desc    Get all doctors or register a new one
// // @route   GET /api/admin/doctors | POST /api/admin/doctors
// router
//   .route("/doctors")
//   .get(protect, authorizeRoles("admin"), getAllDoctors)
//   .post(protect, authorizeRoles("admin"), createDoctor);

// // @desc    Update or remove a doctor from the directory
// // @route   PUT /api/admin/doctors/:id | DELETE /api/admin/doctors/:id
// router
//   .route("/doctors/:id")
//   .put(protect, authorizeRoles("admin"), updateDoctor)
//   .delete(protect, authorizeRoles("admin"), deleteDoctor);

// // -------------------------------------------------------------------
// // 🏢 4. SUPPLIER MANAGEMENT (CRUD)
// // -------------------------------------------------------------------

// // @desc    Get all suppliers or create a new one
// // @route   GET /api/admin/suppliers | POST /api/admin/suppliers
// router
//   .route("/suppliers")
//   .get(protect, authorizeRoles("admin"), getAllSuppliers)
//   .post(protect, authorizeRoles("admin"), createSupplier);

// // @desc    Update or delete a supplier
// // @route   PUT /api/admin/suppliers/:id | DELETE /api/admin/suppliers/:id
// router
//   .route("/suppliers/:id")
//   .put(protect, authorizeRoles("admin"), updateSupplier)
//   .delete(protect, authorizeRoles("admin"), deleteSupplier);

// // -------------------------------------------------------------------
// // 💊 5. INVENTORY MANAGEMENT
// // -------------------------------------------------------------------

// // @desc    Get all medicines for the Inventory Table
// // @route   GET /api/admin/medicines
// router.get("/medicines", protect, authorizeRoles("admin"), getAllMedicines);

// // @desc    Update medicine stock or details (Restocking/Price change)
// // @route   PUT /api/admin/medicines/:id
// router.put("/medicines/:id", protect, authorizeRoles("admin"), updateMedicine);

// // -------------------------------------------------------------------
// // 📦 6. PURCHASE ORDER ROUTES (STOCK ENTRY)
// // -------------------------------------------------------------------

// // @desc    Get all purchases or create a new Purchase Order
// // @route   GET /api/admin/purchases | POST /api/admin/purchases
// router
//   .route("/purchases")
//   .get(protect, authorizeRoles("admin"), getAllPurchases)
//   .post(protect, authorizeRoles("admin"), createPurchaseOrder);

// // @desc    Update Purchase Order status (e.g., mark as Received to update stock)
// // @route   PUT /api/admin/purchases/:id/status
// router.put(
//   "/purchases/:id/status",
//   protect,
//   authorizeRoles("admin"),
//   updatePurchaseStatus,
// );

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");

// // -------------------------------------------------------------------
// // 🛠️ MULTER CONFIGURATION FOR DOCTOR IMAGES
// // -------------------------------------------------------------------
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Save to the images folder we exposed in server.js
//     cb(null, "images/");
//   },
//   filename: function (req, file, cb) {
//     // Create a unique filename: doctor-1612345678.jpg
//     cb(null, `doctor-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) cb(null, true);
//     else cb(new Error("Only images are allowed!"), false);
//   },
// });

// // Helper Middleware: Formats FormData before passing to your existing controller
// const processDoctorFormData = (req, res, next) => {
//   // 1. If an image was uploaded, attach the path to req.body.image
//   if (req.file) {
//     req.body.image = `/images/${req.file.filename}`;
//   }

//   // 2. Because FormData sends arrays as text, we must parse "slots" back into a JSON array
//   if (req.body.slots && typeof req.body.slots === "string") {
//     try {
//       req.body.slots = JSON.parse(req.body.slots);
//     } catch (err) {
//       console.error("Error parsing slots JSON:", err);
//       req.body.slots = [];
//     }
//   }

//   // 3. Convert isAvailable string to boolean
//   if (req.body.isAvailable !== undefined) {
//     req.body.isAvailable = req.body.isAvailable === "true";
//   }

//   next();
// };

// // Import the controller functions
// const {
//   getAdminStats,
//   getAllUsers,
//   getAllOrders,
//   updateOrderStatus,
//   getAllSuppliers,
//   createSupplier,
//   updateSupplier,
//   deleteSupplier,
//   getAllMedicines,
//   updateMedicine,
//   getAllDoctors,
//   createDoctor,
//   updateDoctor,
//   deleteDoctor,
//   getAllPurchases,
//   createPurchaseOrder,
//   updatePurchaseStatus,
// } = require("../controllers/adminController");

// // -------------------------------------------------------------------
// // 📊 1. DASHBOARD & STAFF REGISTRY
// // -------------------------------------------------------------------
// router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);
// router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

// // -------------------------------------------------------------------
// // 🛒 2. CUSTOMER ORDER MANAGEMENT
// // -------------------------------------------------------------------
// router.get("/orders", protect, authorizeRoles("admin"), getAllOrders);
// router.put(
//   "/orders/:id/status",
//   protect,
//   authorizeRoles("admin"),
//   updateOrderStatus,
// );

// // -------------------------------------------------------------------
// // 🩺 3. DOCTOR MANAGEMENT (MEDICAL STAFF)
// // -------------------------------------------------------------------
// router
//   .route("/doctors")
//   .get(protect, authorizeRoles("admin"), getAllDoctors)
//   // ✅ Added upload.single() and processDoctorFormData middleware
//   .post(
//     protect,
//     authorizeRoles("admin"),
//     upload.single("image"),
//     processDoctorFormData,
//     createDoctor,
//   );

// router
//   .route("/doctors/:id")
//   // ✅ Added upload.single() and processDoctorFormData middleware
//   .put(
//     protect,
//     authorizeRoles("admin"),
//     upload.single("image"),
//     processDoctorFormData,
//     updateDoctor,
//   )
//   .delete(protect, authorizeRoles("admin"), deleteDoctor);

// // -------------------------------------------------------------------
// // 🏢 4. SUPPLIER MANAGEMENT (CRUD)
// // -------------------------------------------------------------------
// router
//   .route("/suppliers")
//   .get(protect, authorizeRoles("admin"), getAllSuppliers)
//   .post(protect, authorizeRoles("admin"), createSupplier);

// router
//   .route("/suppliers/:id")
//   .put(protect, authorizeRoles("admin"), updateSupplier)
//   .delete(protect, authorizeRoles("admin"), deleteSupplier);

// // -------------------------------------------------------------------
// // 💊 5. INVENTORY MANAGEMENT
// // -------------------------------------------------------------------
// router.get("/medicines", protect, authorizeRoles("admin"), getAllMedicines);
// router.put("/medicines/:id", protect, authorizeRoles("admin"), updateMedicine);

// // -------------------------------------------------------------------
// // 📦 6. PURCHASE ORDER ROUTES (STOCK ENTRY)
// // -------------------------------------------------------------------
// router
//   .route("/purchases")
//   .get(protect, authorizeRoles("admin"), getAllPurchases)
//   .post(protect, authorizeRoles("admin"), createPurchaseOrder);

// router.put(
//   "/purchases/:id/status",
//   protect,
//   authorizeRoles("admin"),
//   updatePurchaseStatus,
// );

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");

// // -------------------------------------------------------------------
// // 🛠️ MULTER CONFIGURATION FOR DOCTOR IMAGES
// // -------------------------------------------------------------------
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Save to the images folder we exposed in server.js
//     cb(null, "images/");
//   },
//   filename: function (req, file, cb) {
//     // Create a unique filename: doctor-1612345678.jpg
//     cb(null, `doctor-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) cb(null, true);
//     else cb(new Error("Only images are allowed!"), false);
//   },
// });

// // Helper Middleware: Formats FormData before passing to your existing controller
// const processDoctorFormData = (req, res, next) => {
//   // 1. If an image was uploaded, attach the path to req.body.image
//   if (req.file) {
//     req.body.image = `/images/${req.file.filename}`;
//   }

//   // 2. Because FormData sends arrays as text, we must parse "slots" back into a JSON array
//   if (req.body.slots && typeof req.body.slots === "string") {
//     try {
//       req.body.slots = JSON.parse(req.body.slots);
//     } catch (err) {
//       console.error("Error parsing slots JSON:", err);
//       req.body.slots = [];
//     }
//   }

//   // 3. Convert isAvailable string to boolean
//   if (req.body.isAvailable !== undefined) {
//     req.body.isAvailable = req.body.isAvailable === "true";
//   }

//   next();
// };

// // Import the controller functions
// const {
//   getAdminStats,
//   getAllUsers,
//   getAllOrders,
//   updateOrderStatus,
//   getAllSuppliers,
//   createSupplier,
//   updateSupplier,
//   deleteSupplier,
//   getAllMedicines,
//   updateMedicine,
//   getAllDoctors,
//   createDoctor,
//   requestDoctorOtp, // ✅ NEW: Import Request OTP
//   verifyAndCreateDoctor, // ✅ NEW: Import Verify OTP
//   updateDoctor,
//   deleteDoctor,
//   getAllPurchases,
//   createPurchaseOrder,
//   updatePurchaseStatus,
// } = require("../controllers/adminController");

// // -------------------------------------------------------------------
// // 📊 1. DASHBOARD & STAFF REGISTRY
// // -------------------------------------------------------------------
// router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);
// router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

// // -------------------------------------------------------------------
// // 🛒 2. CUSTOMER ORDER MANAGEMENT
// // -------------------------------------------------------------------
// router.get("/orders", protect, authorizeRoles("admin"), getAllOrders);
// router.put(
//   "/orders/:id/status",
//   protect,
//   authorizeRoles("admin"),
//   updateOrderStatus,
// );

// // -------------------------------------------------------------------
// // 🩺 3. DOCTOR MANAGEMENT (MEDICAL STAFF)
// // -------------------------------------------------------------------

// // ✅ NEW: Request OTP for Doctor Registration
// router.post(
//   "/request-doctor-otp",
//   protect,
//   authorizeRoles("admin"),
//   requestDoctorOtp,
// );

// // ✅ NEW: Verify OTP and Create Doctor (Handles image uploads just like createDoctor)
// router.post(
//   "/verify-create-doctor",
//   protect,
//   authorizeRoles("admin"),
//   upload.single("image"),
//   processDoctorFormData,
//   verifyAndCreateDoctor,
// );

// router
//   .route("/doctors")
//   .get(protect, authorizeRoles("admin"), getAllDoctors)
//   // Legacy creation route (kept for backward compatibility)
//   .post(
//     protect,
//     authorizeRoles("admin"),
//     upload.single("image"),
//     processDoctorFormData,
//     createDoctor,
//   );

// router
//   .route("/doctors/:id")
//   // ✅ Edit route uses the same upload middleware
//   .put(
//     protect,
//     authorizeRoles("admin"),
//     upload.single("image"),
//     processDoctorFormData,
//     updateDoctor,
//   )
//   .delete(protect, authorizeRoles("admin"), deleteDoctor);

// // -------------------------------------------------------------------
// // 🏢 4. SUPPLIER MANAGEMENT (CRUD)
// // -------------------------------------------------------------------
// router
//   .route("/suppliers")
//   .get(protect, authorizeRoles("admin"), getAllSuppliers)
//   .post(protect, authorizeRoles("admin"), createSupplier);

// router
//   .route("/suppliers/:id")
//   .put(protect, authorizeRoles("admin"), updateSupplier)
//   .delete(protect, authorizeRoles("admin"), deleteSupplier);

// // -------------------------------------------------------------------
// // 💊 5. INVENTORY MANAGEMENT
// // -------------------------------------------------------------------
// router.get("/medicines", protect, authorizeRoles("admin"), getAllMedicines);
// router.put("/medicines/:id", protect, authorizeRoles("admin"), updateMedicine);

// // -------------------------------------------------------------------
// // 📦 6. PURCHASE ORDER ROUTES (STOCK ENTRY)
// // -------------------------------------------------------------------
// router
//   .route("/purchases")
//   .get(protect, authorizeRoles("admin"), getAllPurchases)
//   .post(protect, authorizeRoles("admin"), createPurchaseOrder);

// router.put(
//   "/purchases/:id/status",
//   protect,
//   authorizeRoles("admin"),
//   updatePurchaseStatus,
// );

// module.exports = router;

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
