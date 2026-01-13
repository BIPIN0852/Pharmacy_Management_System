// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");

// // ✅ Standardized import to match your role.js export
// const authorizeRoles = require("../middleware/role");

// const {
//   getAllOrders,
//   createOrder,
//   getMyOrders,
//   updateOrderStatus,
// } = require("../controllers/orderController");

// // -------------------------------------------------------------------
// // CUSTOMER ROUTES
// // -------------------------------------------------------------------
// router.route("/").post(protect, createOrder).get(protect, getMyOrders);

// // -------------------------------------------------------------------
// // ADMIN & PHARMACIST ROUTES
// // -------------------------------------------------------------------
// // ✅ Using 'authorizeRoles' instead of 'authorize' to fix the ReferenceError
// router
//   .route("/all")
//   .get(protect, authorizeRoles("admin", "pharmacist"), getAllOrders);

// router
//   .route("/:id/status")
//   .put(protect, authorizeRoles("admin", "pharmacist"), updateOrderStatus);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");

// // ✅ Standardized import to match your role.js export
// const authorizeRoles = require("../middleware/role");

// // ✅ All function names now match the module.exports in orderController.js
// const {
//   getAllOrders,
//   createOrder,
//   getMyOrders,
//   updateOrderStatus,
// } = require("../controllers/orderController");

// // -------------------------------------------------------------------
// // CUSTOMER ROUTES
// // -------------------------------------------------------------------

// /**
//  * @route   POST /api/orders
//  * @desc    Create a new order (Customer)
//  */
// router.route("/").post(protect, createOrder);

// /**
//  * @route   GET /api/orders
//  * @desc    Get logged-in user's orders (Customer)
//  */
// router.route("/my").get(protect, getMyOrders);

// // -------------------------------------------------------------------
// // ADMIN & PHARMACIST ROUTES
// // -------------------------------------------------------------------

// /**
//  * @route   GET /api/orders/all
//  * @desc    Get all orders for management
//  */
// router
//   .route("/all")
//   .get(protect, authorizeRoles("admin", "pharmacist"), getAllOrders);

// /**
//  * @route   PUT /api/orders/:id/status
//  * @desc    Update order status (Processing -> Shipped -> Delivered)
//  */
// router
//   .route("/:id/status")
//   .put(protect, authorizeRoles("admin", "pharmacist"), updateOrderStatus);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// ✅ Standardized import to match your role.js export
const authorizeRoles = require("../middleware/role");

// ✅ All function names now match the module.exports in orderController.js
const {
  createOrder,
  getMyOrders,
  getOrderById, // ✅ Added for single order details
  getAllOrders,
  updateOrderStatus,
  updateOrderToPaid, // ✅ Added for payment processing
} = require("../controllers/orderController");

// -------------------------------------------------------------------
// CUSTOMER ROUTES
// -------------------------------------------------------------------

/**
 * @route   POST /api/orders
 * @desc    Create a new order (Customer)
 */
router.route("/").post(protect, createOrder);

/**
 * @route   GET /api/orders/my
 * @desc    Get logged-in user's orders (Customer)
 */
router.route("/my").get(protect, getMyOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order details
 */
router.route("/:id").get(protect, getOrderById);

/**
 * @route   PUT /api/orders/:id/pay
 * @desc    Update order to paid status
 */
router.route("/:id/pay").put(protect, updateOrderToPaid);

// -------------------------------------------------------------------
// ADMIN & PHARMACIST ROUTES
// -------------------------------------------------------------------

/**
 * @route   GET /api/orders/all
 * @desc    Get all orders for management
 */
router
  .route("/all")
  .get(protect, authorizeRoles("admin", "pharmacist"), getAllOrders);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (Processing -> Shipped -> Delivered)
 */
router
  .route("/:id/status")
  .put(protect, authorizeRoles("admin", "pharmacist"), updateOrderStatus);

module.exports = router;
