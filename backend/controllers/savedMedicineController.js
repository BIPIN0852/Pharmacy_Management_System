const SavedMedicine = require("../models/SavedMedicine");
const Medicine = require("../models/Medicine");

// @desc    Get all saved medicines (Crash-Proof)
// @route   GET /api/customer/saved-medicines
const getSavedMedicines = async (req, res) => {
  try {
    // 1. Fetch raw items
    const rawItems = await SavedMedicine.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    // 2. Populate manually using the specific model name "medicine"
    const populatedItems = await SavedMedicine.populate(rawItems, {
      path: "medicine",
      model: "medicine",
    });

    // 3. Filter out "Ghost Items" (where medicine is null/deleted)
    const validItems = populatedItems.filter((item) => item.medicine != null);

    res.json(validItems);
  } catch (error) {
    console.error("❌ Wishlist Error:", error.message);
    // ✅ RETURN EMPTY LIST INSTEAD OF 500 CRASH
    res.status(200).json([]);
  }
};

// @desc    Add Item to Wishlist
// @route   POST /api/customer/saved-medicines
const addSavedMedicine = async (req, res) => {
  const { medicineId } = req.body;
  try {
    const exists = await SavedMedicine.findOne({
      user: req.user._id,
      medicine: medicineId,
    });
    if (exists) return res.status(400).json({ message: "Item already saved" });

    const item = await SavedMedicine.create({
      user: req.user._id,
      medicine: medicineId,
    });
    res.status(201).json(item);
  } catch (error) {
    console.error("Add Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Remove Item
// @route   DELETE /api/customer/saved-medicines/:id
const removeSavedMedicine = async (req, res) => {
  try {
    // Allows deleting by Document ID OR Medicine ID
    const result = await SavedMedicine.findOneAndDelete({
      user: req.user._id,
      $or: [{ medicine: req.params.id }, { _id: req.params.id }],
    });

    if (result) {
      res.json({ message: "Removed" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error("Remove Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getSavedMedicines, addSavedMedicine, removeSavedMedicine };
