const asyncHandler = require("express-async-handler");
const Purchase = require("../models/Purchase");
const Medicine = require("../models/Medicine"); // ✅ CRITICAL FIX: Import this!

// @desc    Get all purchase orders
// @route   GET /api/admin/purchases
// @access  Private/Admin
const getPurchases = asyncHandler(async (req, res) => {
  try {
    const purchases = await Purchase.find({})
      .populate("supplier", "name email")
      .populate("user", "name")
      .populate({
        path: "items.medicine",
        select: "name manufacturer",
        model: Medicine, // ✅ Pass the actual Model object, not a string
      })
      .sort({ createdAt: -1 });

    res.json(purchases);
  } catch (error) {
    console.error("Fetch Purchases Error:", error);
    res
      .status(500)
      .json({ message: "Server Error: Could not fetch purchases." });
  }
});

// @desc    Create a new purchase order
// @route   POST /api/admin/purchases
// @access  Private/Admin
const createPurchase = asyncHandler(async (req, res) => {
  const { supplier, items, notes } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No items in purchase order");
  }

  // Calculate total cost
  const totalCost = items.reduce(
    (acc, item) => acc + (item.costPrice || 0) * (item.quantity || 0),
    0,
  );

  const purchase = new Purchase({
    supplier,
    user: req.user._id,
    items,
    totalCost,
    notes,
    status: "Ordered",
  });

  const createdPurchase = await purchase.save();
  res.status(201).json(createdPurchase);
});

// @desc    Update PO status (e.g., Mark as Received)
// @route   PUT /api/admin/purchases/:id/status
// @access  Private/Admin
const updatePurchaseStatus = asyncHandler(async (req, res) => {
  const purchase = await Purchase.findById(req.params.id);

  if (!purchase) {
    res.status(404);
    throw new Error("Purchase order not found");
  }

  const { status } = req.body;

  if (purchase.status === "Received" && status === "Received") {
    res.status(400);
    throw new Error("This order has already been received.");
  }

  // ✅ Update Stock Logic
  if (status === "Received") {
    for (const item of purchase.items) {
      const medicine = await Medicine.findById(item.medicine);
      if (medicine) {
        medicine.countInStock += item.quantity;
        await medicine.save();
      }
    }
    purchase.receivedAt = Date.now();
  }

  purchase.status = status;
  const updatedPurchase = await purchase.save();

  res.json(updatedPurchase);
});

module.exports = {
  getPurchases,
  createPurchase,
  updatePurchaseStatus,
};
