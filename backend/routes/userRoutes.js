// const express = require("express");
// const router = express.Router();
// const {
//   authUser,
//   registerUser,
//   getUserProfile,
//   updateUserProfile,
//   getUsers,
//   deleteUser,
//   getUserById,
//   updateUser,
// } = require("../controllers/userController");
// const { protect, admin } = require("../middleware/authMiddleware");

// // Route: /api/users
// router.route("/").post(registerUser).get(protect, admin, getUsers);

// // ✅ THIS IS THE MISSING ROUTE CAUSING THE 404
// router.post("/login", authUser);

// // Route: /api/users/profile
// router
//   .route("/profile")
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);

// // Route: /api/users/:id
// router
//   .route("/:id")
//   .delete(protect, admin, deleteUser)
//   .get(protect, admin, getUserById)
//   .put(protect, admin, updateUser);

// module.exports = router;

// const express = require("express");
// const router = express.Router();

// // Controllers
// const {
//   authUser,
//   registerUser,
//   getUserProfile,
//   updateUserProfile,
//   getUsers,
//   deleteUser,
//   getUserById,
//   updateUser,
// } = require("../controllers/userController");

// // Middleware
// const { protect, admin } = require("../middleware/authMiddleware");

// // -------------------------------------------------------------------
// // PUBLIC ROUTES
// // -------------------------------------------------------------------

// // @desc    Register a new user
// // @route   POST /api/users
// router.post("/", registerUser);

// // @desc    Auth user & get token (Login)
// // @route   POST /api/users/login
// router.post("/login", authUser);

// // -------------------------------------------------------------------
// // PROTECTED ROUTES (Logged In Users)
// // -------------------------------------------------------------------

// // @desc    Get & Update User Profile
// // @route   GET /api/users/profile
// // @route   PUT /api/users/profile
// router
//   .route("/profile")
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);

// // -------------------------------------------------------------------
// // ADMIN ROUTES (Admin Only)
// // -------------------------------------------------------------------

// // @desc    Get all users
// // @route   GET /api/users
// router.get("/", protect, admin, getUsers);

// // @desc    Get, Update & Delete User by ID
// // @route   GET /api/users/:id
// // @route   PUT /api/users/:id
// // @route   DELETE /api/users/:id
// router
//   .route("/:id")
//   .get(protect, admin, getUserById)
//   .put(protect, admin, updateUser)
//   .delete(protect, admin, deleteUser);

// module.exports = router;

// const express = require("express");
// const router = express.Router();

// // -------------------------------------------------------------------
// // 1. CONTROLLERS
// // -------------------------------------------------------------------
// const {
//   authUser,
//   registerUser,
//   getUserProfile,
//   updateUserProfile,
//   getUsers,
//   deleteUser,
//   getUserById,
//   updateUser,
// } = require("../controllers/userController");

// // -------------------------------------------------------------------
// // 2. MIDDLEWARE
// // -------------------------------------------------------------------
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role"); // ✅ Using consolidated role middleware

// // -------------------------------------------------------------------
// // 3. PUBLIC ROUTES
// // -------------------------------------------------------------------

// // @desc    Register a new user (Self-registration for Customers)
// // @route   POST /api/users
// router.post("/", registerUser);

// // @desc    Auth user & get token (Login)
// // @route   POST /api/users/login
// router.post("/login", authUser);

// // -------------------------------------------------------------------
// // 4. PROTECTED ROUTES (All Authenticated Users)
// // -------------------------------------------------------------------

// // @desc    Get & Update User Profile
// // @route   GET /api/users/profile
// // @route   PUT /api/users/profile
// router
//   .route("/profile")
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);

// // -------------------------------------------------------------------
// // 5. ADMIN ROUTES (Admin Only)
// // -------------------------------------------------------------------

// // @desc    Admin creating a staff/pharmacist user
// // @route   POST /api/users/admin-create
// // ✅ Fixes your Staff Management "Unable to create user" issue
// router.post("/admin-create", protect, authorizeRoles("admin"), registerUser);

// // @desc    Get all users for management
// // @route   GET /api/users
// router.get("/", protect, authorizeRoles("admin"), getUsers);

// // @desc    Get, Update & Delete User by ID
// // @route   GET /api/users/:id
// // @route   PUT /api/users/:id
// // @route   DELETE /api/users/:id
// router
//   .route("/:id")
//   .get(protect, authorizeRoles("admin"), getUserById)
//   .put(protect, authorizeRoles("admin"), updateUser)
//   .delete(protect, authorizeRoles("admin"), deleteUser);

// module.exports = router;

// const express = require("express");
// const router = express.Router();

// // -------------------------------------------------------------------
// // 1. CONTROLLERS
// // -------------------------------------------------------------------
// const {
//   authUser,
//   registerUser,
//   getUserProfile,
//   updateUserProfile,
//   getUsers,
//   deleteUser,
//   getUserById,
//   updateUser,
// } = require("../controllers/userController");

// // -------------------------------------------------------------------
// // 2. MIDDLEWARE
// // -------------------------------------------------------------------
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");

// // -------------------------------------------------------------------
// // 3. PUBLIC ROUTES
// // -------------------------------------------------------------------

// /**
//  * @desc    Register a new user (Self-registration for Customers)
//  * @route   POST /api/users
//  */
// router.post("/", registerUser);

// /**
//  * @desc    Auth user & get token (Login)
//  * @route   POST /api/users/login
//  */
// router.post("/login", authUser);

// // -------------------------------------------------------------------
// // 4. PROTECTED PROFILE ROUTES (All Roles: Customer, Doctor, Admin)
// // -------------------------------------------------------------------

// /**
//  * @desc    Get & Update Personal Profile Info
//  * @route   GET /api/users/profile
//  * @route   PUT /api/users/profile
//  * ✅ FIX: Used by CustomerProfile.jsx to prevent blank screens
//  */
// router
//   .route("/profile")
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);

// // -------------------------------------------------------------------
// // 5. ADMINISTRATIVE ROUTES (Admin Only)
// // -------------------------------------------------------------------

// /**
//  * @desc    Get all users for management registry
//  * @route   GET /api/users
//  * ✅ Used by AdminCustomers.jsx and Staff Registry
//  */
// router.get("/", protect, authorizeRoles("admin"), getUsers);

// /**
//  * @desc    Admin creating a staff/pharmacist user
//  * @route   POST /api/users/admin-create
//  * ✅ Resolves "Unable to create user" in Staff Management
//  */
// router.post("/admin-create", protect, authorizeRoles("admin"), registerUser);

// /**
//  * @desc    Manage specific user records by ID
//  * @route   GET /api/users/:id
//  * @route   PUT /api/users/:id
//  * @route   DELETE /api/users/:id
//  */
// router
//   .route("/:id")
//   .get(protect, authorizeRoles("admin"), getUserById)
//   .put(protect, authorizeRoles("admin"), updateUser)
//   .delete(protect, authorizeRoles("admin"), deleteUser);

// module.exports = router;

const express = require("express");
const router = express.Router();

// -------------------------------------------------------------------
// 1. CONTROLLERS
// -------------------------------------------------------------------
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require("../controllers/userController");

// -------------------------------------------------------------------
// 2. MIDDLEWARE
// -------------------------------------------------------------------
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role"); // ✅ Consistent RBAC

// -------------------------------------------------------------------
// 3. PUBLIC ROUTES (Authentication)
// -------------------------------------------------------------------

/**
 * @desc    Register a new user (Self-registration for Customers)
 * @route   POST /api/users
 */
router.post("/", registerUser);

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/users/login
 */
router.post("/login", authUser);

// -------------------------------------------------------------------
// 4. PROTECTED PROFILE ROUTES (All Roles: Customer, Doctor, Admin)
// -------------------------------------------------------------------

/**
 * @desc    Get & Update Personal Profile Info
 * @route   GET /api/users/profile
 * @route   PUT /api/users/profile
 * ✅ FIX: Used by CustomerProfile.jsx to fetch personal data (Address, Allergies)
 */
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// -------------------------------------------------------------------
// 5. ADMINISTRATIVE ROUTES (Admin Only)
// -------------------------------------------------------------------

/**
 * @desc    Get all users (Search & Pagination enabled)
 * @route   GET /api/users
 * ✅ Used by AdminCustomers.jsx and Staff Registry
 */
router.get("/", protect, authorizeRoles("admin"), getUsers);

/**
 * @desc    Admin creating a staff/pharmacist user manually
 * @route   POST /api/users/admin-create
 * ✅ Resolves "Unable to create user" in Staff Management
 */
router.post("/admin-create", protect, authorizeRoles("admin"), registerUser);

/**
 * @desc    Manage specific user records by ID
 * @route   GET /api/users/:id
 * @route   PUT /api/users/:id
 * @route   DELETE /api/users/:id
 */
router
  .route("/:id")
  .get(protect, authorizeRoles("admin"), getUserById)
  .put(protect, authorizeRoles("admin"), updateUser)
  .delete(protect, authorizeRoles("admin"), deleteUser);

module.exports = router;
