const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Medicine = require("../models/Medicine");

// @desc    Create new order & Apply FEFO Stock Deduction
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    // 1. Process Stock Deduction (FEFO Logic)
    for (const item of orderItems) {
      const medicine = await Medicine.findById(item.product);

      if (!medicine) {
        res.status(404);
        throw new Error(`Medicine not found: ${item.name}`);
      }

      if (medicine.countInStock < item.qty) {
        res.status(400);
        throw new Error(`Insufficient stock for: ${medicine.name}`);
      }

      // ✅ FEFO ALGORITHM (First Expired, First Out)
      // Sort batches by Expiry Date (Ascending)
      medicine.batches.sort(
        (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
      );

      let qtyNeeded = item.qty;

      // Iterate through batches and deduct
      for (let batch of medicine.batches) {
        if (qtyNeeded <= 0) break; // Demand met

        if (batch.quantity > 0) {
          // Determine how much to take from this batch
          const deductAmount = Math.min(qtyNeeded, batch.quantity);

          batch.quantity -= deductAmount; // Deduct
          qtyNeeded -= deductAmount; // Decrease needed amount
        }
      }

      // Remove empty batches (Optional cleanup)
      medicine.batches = medicine.batches.filter((b) => b.quantity > 0);

      // Recalculate Total Stock (Handled by pre-save hook, but good to be explicit)
      medicine.countInStock = medicine.batches.reduce(
        (acc, b) => acc + b.quantity,
        0
      );

      await medicine.save();
    }

    // 2. Create Order
    const order = new Order({
      orderItems, // ✅ ONE-TO-MANY: One Order -> Many Items
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get Order by ID
// @route   GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
};
