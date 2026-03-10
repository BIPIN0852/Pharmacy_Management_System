// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
// const {
//   createOrder,
//   getMyOrders,
//   getOrderById,
//   updateOrderToPaid,
// } = require("../controllers/orderController");

// // Route for creating an order
// router.route("/").post(protect, createOrder);

// // Route for getting user's specific orders
// router.route("/myorders").get(protect, getMyOrders);

// // Route for getting a single order by ID
// router.route("/:id").get(protect, getOrderById);

// // Route for payment update
// router.route("/:id/pay").put(protect, updateOrderToPaid);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   addOrderItems,
//   getOrderById,
//   updateOrderToPaid,
//   getMyOrders,
//   getOrders,
// } = require("../controllers/orderController");
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");

// // Root routes
// router
//   .route("/")
//   .post(protect, addOrderItems)
//   .get(protect, authorizeRoles("admin"), getOrders);

// // User specific routes
// router.route("/myorders").get(protect, getMyOrders);

// // ID specific routes
// router.route("/:id").get(protect, getOrderById);
// router.route("/:id/pay").put(protect, updateOrderToPaid);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   addOrderItems,
//   getOrderById,
//   updateOrderToPaid,
//   getMyOrders,
//   getOrders,
//   deleteOrder,
// } = require("../controllers/orderController");
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");

// // ✅ FIX: Add 'pharmacist' to the allowed roles list
// router
//   .route("/")
//   .post(protect, addOrderItems)
//   .get(protect, authorizeRoles("admin", "pharmacist"), getOrders);

// // User specific routes
// router.route("/my").get(protect, getMyOrders);
// router.route("/myorders").get(protect, getMyOrders);

// // ID specific routes
// router.route("/:id").get(protect, getOrderById);
// router.route("/:id/pay").put(protect, updateOrderToPaid);
// router.route("/:id").delete(protect, deleteOrder);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   addOrderItems,
//   getOrderById,
//   updateOrderToPaid,
//   updateOrderStatus,
//   updateOrderToPaidManual,
//   getMyOrders,
//   getOrders,
//   deleteOrder,
// } = require("../controllers/orderController");
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role"); // Ensure this path is correct

// // ===================================================================
// // ROOT ROUTES: /api/orders
// // ===================================================================
// router
//   .route("/")
//   .post(protect, addOrderItems) // Create new order (Any logged-in user)
//   .get(protect, authorizeRoles("admin", "pharmacist"), getOrders); // View all orders (Admin/Pharmacist only)

// // ===================================================================
// // USER SPECIFIC ROUTES
// // ===================================================================
// // Note: Put these BEFORE /:id routes to prevent "myorders" being treated as an ID
// router.route("/myorders").get(protect, getMyOrders);

// // ===================================================================
// // ID SPECIFIC ROUTES: /api/orders/:id
// // ===================================================================
// router
//   .route("/:id")
//   .get(protect, getOrderById) // View single order details
//   .delete(protect, deleteOrder); // ✅ Delete order (User can delete their own, or Admin)

// router
//   .route("/:id/status")
//   .put(protect, authorizeRoles("admin", "pharmacist"), updateOrderStatus);

// // ===================================================================
// // PAYMENT ROUTES
// // ===================================================================
// router.route("/:id/pay").put(protect, updateOrderToPaid);

// router
//   .route("/:id/pay-manual")
//   .put(protect, authorizeRoles("admin", "pharmacist"), updateOrderToPaidManual);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   addOrderItems,
//   getOrderById,
//   updateOrderToPaid,
//   updateOrderStatus,
//   updateOrderToPaidManual,
//   getMyOrders,
//   getOrders,
//   deleteOrder,
//   updatePrescriptionStatus, // ✅ Added new prescription controller
// } = require("../controllers/orderController");
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role"); // Ensure this path is correct

// // ===================================================================
// // ROOT ROUTES: /api/orders
// // ===================================================================
// router
//   .route("/")
//   .post(protect, addOrderItems) // Create new order (Any logged-in user)
//   .get(protect, authorizeRoles("admin", "pharmacist"), getOrders); // View all orders (Admin/Pharmacist only)

// // ===================================================================
// // USER SPECIFIC ROUTES
// // ===================================================================
// // Note: Put these BEFORE /:id routes to prevent "myorders" being treated as an ID
// router.route("/myorders").get(protect, getMyOrders);

// // ===================================================================
// // ID SPECIFIC ROUTES: /api/orders/:id
// // ===================================================================
// router
//   .route("/:id")
//   .get(protect, getOrderById) // View single order details
//   .delete(protect, deleteOrder); // ✅ Delete order (User can delete their own, or Admin)

// router
//   .route("/:id/status")
//   .put(protect, authorizeRoles("admin", "pharmacist"), updateOrderStatus);

// // ===================================================================
// // PRESCRIPTION ROUTES
// // ===================================================================
// // ✅ NEW: Route for Pharmacist to approve/reject prescription
// router
//   .route("/:id/prescription")
//   .put(
//     protect,
//     authorizeRoles("admin", "pharmacist"),
//     updatePrescriptionStatus,
//   );

// // ===================================================================
// // PAYMENT ROUTES
// // ===================================================================
// router.route("/:id/pay").put(protect, updateOrderToPaid);

// router
//   .route("/:id/pay-manual")
//   .put(protect, authorizeRoles("admin", "pharmacist"), updateOrderToPaidManual);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   addOrderItems,
//   getOrderById,
//   updateOrderToPaid,
//   updateOrderStatus,
//   updateOrderToPaidManual,
//   getMyOrders,
//   getOrders,
//   deleteOrder,
//   updatePrescriptionStatus, // ✅ Added new prescription controller
// } = require("../controllers/orderController");
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role"); // Ensure this path is correct

// // ===================================================================
// // ROOT ROUTES: /api/orders
// // ===================================================================
// router
//   .route("/")
//   .post(protect, addOrderItems) // Create new order (Any logged-in user)
//   .get(protect, authorizeRoles("admin", "pharmacist"), getOrders); // View all orders (Admin/Pharmacist only)

// // ===================================================================
// // USER SPECIFIC ROUTES
// // ===================================================================
// // Note: Put these BEFORE /:id routes to prevent "myorders" being treated as an ID
// router.route("/myorders").get(protect, getMyOrders);
// // ✅ ADDED: Alternative route to match frontend call /api/orders/my
// router.route("/my").get(protect, getMyOrders);

// // ===================================================================
// // ID SPECIFIC ROUTES: /api/orders/:id
// // ===================================================================
// router
//   .route("/:id")
//   .get(protect, getOrderById) // View single order details
//   .delete(protect, deleteOrder); // ✅ Delete order (User can delete their own, or Admin)

// router
//   .route("/:id/status")
//   .put(protect, authorizeRoles("admin", "pharmacist"), updateOrderStatus);

// // ===================================================================
// // PRESCRIPTION ROUTES
// // ===================================================================
// // ✅ NEW: Route for Pharmacist to approve/reject prescription
// router
//   .route("/:id/prescription")
//   .put(
//     protect,
//     authorizeRoles("admin", "pharmacist"),
//     updatePrescriptionStatus,
//   );

// // ===================================================================
// // PAYMENT ROUTES
// // ===================================================================
// router.route("/:id/pay").put(protect, updateOrderToPaid);

// router
//   .route("/:id/pay-manual")
//   .put(protect, authorizeRoles("admin", "pharmacist"), updateOrderToPaidManual);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  updateOrderToPaidManual,
  getMyOrders,
  getOrders,
  deleteOrder,
  updatePrescriptionStatus,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");

// ===================================================================
// ROOT ROUTES: /api/orders
// ===================================================================
router
  .route("/")
  .post(protect, addOrderItems) // Create new order (Any logged-in user)
  .get(protect, authorizeRoles("admin", "pharmacist"), getOrders); // View all orders (Admin/Pharmacist only)

// ===================================================================
// USER SPECIFIC ROUTES
// ===================================================================
// Note: Put these BEFORE /:id routes to prevent "myorders" being treated as an ID
router.route("/myorders").get(protect, getMyOrders);
router.route("/my").get(protect, getMyOrders); // Alternative route to match frontend call /api/orders/my

// ===================================================================
// ID SPECIFIC ROUTES: /api/orders/:id
// ===================================================================
router
  .route("/:id")
  .get(protect, getOrderById) // View single order details
  .delete(protect, deleteOrder); // Cancel/Delete order (User can delete their own, or Admin)

router
  .route("/:id/status")
  .put(protect, authorizeRoles("admin", "pharmacist"), updateOrderStatus);

// ===================================================================
// PRESCRIPTION ROUTES
// ===================================================================
// Route for Pharmacist to approve/reject prescription
router
  .route("/:id/prescription")
  .put(
    protect,
    authorizeRoles("admin", "pharmacist"),
    updatePrescriptionStatus,
  );

// ===================================================================
// PAYMENT ROUTES
// ===================================================================
router.route("/:id/pay").put(protect, updateOrderToPaid);

router
  .route("/:id/pay-manual")
  .put(protect, authorizeRoles("admin", "pharmacist"), updateOrderToPaidManual);

module.exports = router;
