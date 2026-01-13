const Medicine = require("../models/Medicine");

// @desc    Fetch all medicines (with Search & Filter)
// @route   GET /api/medicines
// @access  Public
const getMedicines = async (req, res) => {
  try {
    // 1. Search Logic (Name or Brand)
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { brand: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    // 2. Category Filter Logic
    const category =
      req.query.category && req.query.category !== "All"
        ? { category: req.query.category }
        : {};

    // 3. Fetch from DB
    const medicines = await Medicine.find({ ...keyword, ...category });

    res.json({ medicines });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Fetch single medicine by ID
// @route   GET /api/medicines/:id
// @access  Public
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (medicine) {
      res.json(medicine);
    } else {
      res.status(404).json({ message: "Medicine not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (medicine) {
      await medicine.deleteOne();
      res.json({ message: "Medicine removed" });
    } else {
      res.status(404).json({ message: "Medicine not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a medicine
// @route   POST /api/medicines
// @access  Private/Admin
const createMedicine = async (req, res) => {
  try {
    const medicine = new Medicine({
      name: "Sample Medicine",
      price: 0,
      user: req.user._id,
      image: "/images/sample.jpg",
      brand: "Generic",
      category: "Tablet",
      countInStock: 0,
      numReviews: 0,
      description: "Sample description",
      prescriptionRequired: false,
    });

    const createdMedicine = await medicine.save();
    res.status(201).json(createdMedicine);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a medicine
// @route   PUT /api/medicines/:id
// @access  Private/Admin
const updateMedicine = async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    prescriptionRequired,
  } = req.body;

  try {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine) {
      medicine.name = name;
      medicine.price = price;
      medicine.description = description;
      medicine.image = image;
      medicine.brand = brand;
      medicine.category = category;
      medicine.countInStock = countInStock;
      medicine.prescriptionRequired = prescriptionRequired;

      const updatedMedicine = await medicine.save();
      res.json(updatedMedicine);
    } else {
      res.status(404).json({ message: "Medicine not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  deleteMedicine,
  createMedicine,
  updateMedicine,
};
