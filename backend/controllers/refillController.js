const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");

// @desc    Get customers needing refills
// @route   GET /api/refills
// @access  Private/Pharmacist
const getRefillReminders = asyncHandler(async (req, res) => {
  // Logic: Find orders from 30 days ago (assuming 30-day supply)
  const daysAgo30 = new Date();
  daysAgo30.setDate(daysAgo30.getDate() - 25); // Start reminding 5 days early

  const refills = await Order.find({
    createdAt: { $lte: daysAgo30 }, // Orders older than 25 days
    isPaid: true,
  })
    .populate("user", "name email phone")
    .populate("orderItems.product", "name")
    .limit(20);

  res.json(refills);
});

module.exports = { getRefillReminders };
