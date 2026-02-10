const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
} = require("../controllers/orderController");

// Route for creating an order
router.route("/").post(protect, createOrder);

// Route for getting user's specific orders
router.route("/myorders").get(protect, getMyOrders);

// Route for getting a single order by ID
router.route("/:id").get(protect, getOrderById);

// Route for payment update
router.route("/:id/pay").put(protect, updateOrderToPaid);

module.exports = router;
