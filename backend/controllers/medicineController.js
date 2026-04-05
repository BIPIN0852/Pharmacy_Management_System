const asyncHandler = require("express-async-handler");
const Medicine = require("../models/Medicine");

// @desc    Fetch all medicines
// @route   GET /api/medicines
// @access  Public
const getMedicines = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Medicine.countDocuments({ ...keyword });
  const medicines = await Medicine.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // Support for both paginated and non-paginated (all) requests
  // If 'all' query param is present, return everything (used by Admin dropdowns)
  if (req.query.all) {
    const allMedicines = await Medicine.find({}).sort({ name: 1 });
    return res.json({ medicines: allMedicines });
  }

  res.json({ medicines, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single medicine
// @route   GET /api/medicines/:id
// @access  Public
const getMedicineById = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);

  if (medicine) {
    res.json(medicine);
  } else {
    res.status(404);
    throw new Error("Medicine not found");
  }
});

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);

  if (medicine) {
    await medicine.deleteOne();
    res.json({ message: "Medicine removed" });
  } else {
    res.status(404);
    throw new Error("Medicine not found");
  }
});

// @desc    Create a medicine
// @route   POST /api/medicines
// @access  Private/Admin
const createMedicine = asyncHandler(async (req, res) => {
  const medicine = new Medicine({
    name: "Sample Medicine",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample Brand",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
    expiryDate: new Date(), // Default to today
  });

  const createdMedicine = await medicine.save();
  res.status(201).json(createdMedicine);
});

// @desc    Update a medicine
// @route   PUT /api/medicines/:id
// @access  Private/Admin
const updateMedicine = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    expiryDate,
  } = req.body;

  const medicine = await Medicine.findById(req.params.id);

  if (medicine) {
    medicine.name = name;
    medicine.price = price;
    medicine.description = description;
    medicine.image = image;
    medicine.brand = brand;
    medicine.category = category;
    medicine.countInStock = countInStock;
    medicine.expiryDate = expiryDate; // Update expiry date

    const updatedMedicine = await medicine.save();
    res.json(updatedMedicine);
  } else {
    res.status(404);
    throw new Error("Medicine not found");
  }
});

// @desc    Create new review
// @route   POST /api/medicines/:id/reviews
// @access  Private
const createMedicineReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const medicine = await Medicine.findById(req.params.id);

  if (medicine) {
    const alreadyReviewed = medicine.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Medicine already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    medicine.reviews.push(review);

    medicine.numReviews = medicine.reviews.length;

    medicine.rating =
      medicine.reviews.reduce((acc, item) => item.rating + acc, 0) /
      medicine.reviews.length;

    await medicine.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Medicine not found");
  }
});

// @desc    Get top rated medicines
// @route   GET /api/medicines/top
// @access  Public
const getTopMedicines = asyncHandler(async (req, res) => {
  const medicines = await Medicine.find({}).sort({ rating: -1 }).limit(3);
  res.json(medicines);
});

// -------------------------------------------------------------------
// 🚨 PHARMACIST ALERTS
// -------------------------------------------------------------------

// @desc    Get expiring medicines (Next 90 days)
// @route   GET /api/medicines/expired
// @access  Private/Pharmacist/Admin
const getExpiringMedicines = asyncHandler(async (req, res) => {
  const today = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setDate(today.getDate() + 90);

  // Find medicines expiring between NOW and 90 Days later
  const medicines = await Medicine.find({
    expiryDate: {
      $gte: today,
      $lte: threeMonthsFromNow,
    },
  }).sort({ expiryDate: 1 }); // Sort by soonest expiry first

  res.json(medicines);
});

module.exports = {
  getMedicines,
  getMedicineById,
  deleteMedicine,
  createMedicine,
  updateMedicine,
  createMedicineReview,
  getTopMedicines,
  getExpiringMedicines,
};
