const express = require("express");
const router = express.Router();
const {
  getSavedMedicines,
  addSavedMedicine,
  removeSavedMedicine,
} = require("../controllers/savedMedicineController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected (User must be logged in)
router.use(protect);

// 1. Get all saved items & Add new item
router.route("/").get(getSavedMedicines).post(addSavedMedicine);

// 2. Remove saved item by ID
router.route("/:id").delete(removeSavedMedicine);

module.exports = router;
