const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUserCart,
  addToCart,
  removeFromCart,
} = require("../controllers/cartController");

router.route("/").get(protect, getUserCart).post(protect, addToCart);
router.route("/:id").delete(protect, removeFromCart);

module.exports = router;
