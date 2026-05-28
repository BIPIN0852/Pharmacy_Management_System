const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// -------------------------------------------------------------------
// 1. CONTROLLERS
// -------------------------------------------------------------------
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getSavedMedicines,
  removeSavedMedicine,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  toggleSavedMedicine,
} = require("../controllers/userController");

// -------------------------------------------------------------------
// 2. MIDDLEWARE
// -------------------------------------------------------------------
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");

// -------------------------------------------------------------------
// 📸 MULTER CONFIGURATION FOR PROFILE PHOTOS
// -------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Saves exactly to backend/images folder
    cb(null, path.join(__dirname, "../images/"));
  },
  filename: function (req, file, cb) {
    cb(null, `user-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// Helper Middleware to attach the image path to req.body
const processProfilePhoto = (req, res, next) => {
  if (req.file) {
    req.body.profilePhoto = `/images/${req.file.filename}`;
  }
  next();
};

// -------------------------------------------------------------------
// 3. PUBLIC ROUTES (Authentication)
// -------------------------------------------------------------------

/**
 * @desc    Register a new user (Self-registration for Customers) & Get all users
 * @route   POST /api/users
 * @route   GET /api/users
 */

router
  .route("/")
  .post(registerUser)
  .get(protect, authorizeRoles("admin", "pharmacist"), getUsers);

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
 */
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(
    protect,
    upload.single("profilePhoto"),
    processProfilePhoto,
    updateUserProfile,
  );

/**
 * @desc    Get & Delete User Saved Medicines (Wishlist)
 * @route   GET /api/users/saved-medicines
 * @route   POST /api/users/saved-medicines (Toggle)
 * @route   DELETE /api/users/saved-medicines/:id
 */
router.get("/saved-medicines", protect, getSavedMedicines);
router.post("/saved-medicines", protect, toggleSavedMedicine);
router.delete("/saved-medicines/:id", protect, removeSavedMedicine);

// -------------------------------------------------------------------
// 5. ADMINISTRATIVE & STAFF ROUTES
// -------------------------------------------------------------------

/**
 * @desc    Admin creating a staff/pharmacist user manually
 * @route   POST /api/users/admin-create
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
