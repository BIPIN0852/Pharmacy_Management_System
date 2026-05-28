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
