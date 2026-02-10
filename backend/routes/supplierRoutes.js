const express = require("express");
const router = express.Router();
const {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");

// Apply protection and Admin check to all routes
router
  .route("/")
  .get(protect, authorizeRoles("admin"), getSuppliers)
  .post(protect, authorizeRoles("admin"), createSupplier);

router
  .route("/:id")
  .put(protect, authorizeRoles("admin"), updateSupplier)
  .delete(protect, authorizeRoles("admin"), deleteSupplier);

module.exports = router;
