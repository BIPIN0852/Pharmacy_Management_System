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

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");

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
  updateMedicine, // ✅ Added for complete inventory control
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAllPurchases,
  createPurchaseOrder,
  updatePurchaseStatus,
} = require("../controllers/adminController");

// -------------------------------------------------------------------
// 📊 1. DASHBOARD & STAFF REGISTRY
// -------------------------------------------------------------------

// @desc    Get dashboard statistics (Sales, Counts, Graphs)
// @route   GET /api/admin/stats
router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

// @desc    Get all staff/users for Staff Management Table
// @route   GET /api/admin/users
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

// -------------------------------------------------------------------
// 🛒 2. CUSTOMER ORDER MANAGEMENT
// -------------------------------------------------------------------

// @desc    Get all customer orders for management
// @route   GET /api/admin/orders
router.get("/orders", protect, authorizeRoles("admin"), getAllOrders);

// @desc    Update Order fulfillment status (e.g., Delivered)
// @route   PUT /api/admin/orders/:id/status
router.put(
  "/orders/:id/status",
  protect,
  authorizeRoles("admin"),
  updateOrderStatus
);

// -------------------------------------------------------------------
// 🩺 3. DOCTOR MANAGEMENT (MEDICAL STAFF)
// -------------------------------------------------------------------
// Note: Schema validation for slots/phone is handled in the Doctor Model

// @desc    Get all doctors or register a new one
// @route   GET /api/admin/doctors | POST /api/admin/doctors
router
  .route("/doctors")
  .get(protect, authorizeRoles("admin"), getAllDoctors)
  .post(protect, authorizeRoles("admin"), createDoctor);

// @desc    Update or remove a doctor from the directory
// @route   PUT /api/admin/doctors/:id | DELETE /api/admin/doctors/:id
// ✅ Essential for the Edit/Delete buttons in AdminDoctors.jsx
router
  .route("/doctors/:id")
  .put(protect, authorizeRoles("admin"), updateDoctor)
  .delete(protect, authorizeRoles("admin"), deleteDoctor);

// -------------------------------------------------------------------
// 🏢 4. SUPPLIER MANAGEMENT (CRUD)
// -------------------------------------------------------------------

// @desc    Get all suppliers or create a new one
// @route   GET /api/admin/suppliers | POST /api/admin/suppliers
router
  .route("/suppliers")
  .get(protect, authorizeRoles("admin"), getAllSuppliers)
  .post(protect, authorizeRoles("admin"), createSupplier);

// @desc    Update or delete a supplier
// @route   PUT /api/admin/suppliers/:id | DELETE /api/admin/suppliers/:id
router
  .route("/suppliers/:id")
  .put(protect, authorizeRoles("admin"), updateSupplier)
  .delete(protect, authorizeRoles("admin"), deleteSupplier);

// -------------------------------------------------------------------
// 💊 5. INVENTORY MANAGEMENT
// -------------------------------------------------------------------

// @desc    Get all medicines for the Inventory Table
// @route   GET /api/admin/medicines
router.get("/medicines", protect, authorizeRoles("admin"), getAllMedicines);

// @desc    Update medicine stock or details (Restocking/Price change)
// @route   PUT /api/admin/medicines/:id
router.put("/medicines/:id", protect, authorizeRoles("admin"), updateMedicine);

// -------------------------------------------------------------------
// 📦 6. PURCHASE ORDER ROUTES (STOCK ENTRY)
// -------------------------------------------------------------------

// @desc    Get all purchases or create a new Purchase Order
// @route   GET /api/admin/purchases | POST /api/admin/purchases
router
  .route("/purchases")
  .get(protect, authorizeRoles("admin"), getAllPurchases)
  .post(protect, authorizeRoles("admin"), createPurchaseOrder);

// @desc    Update Purchase Order status (e.g., mark as Received to update stock)
// @route   PUT /api/admin/purchases/:id/status
router.put(
  "/purchases/:id/status",
  protect,
  authorizeRoles("admin"),
  updatePurchaseStatus
);

module.exports = router;
