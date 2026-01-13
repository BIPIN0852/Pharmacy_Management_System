// const asyncHandler = require("express-async-handler");
// const Order = require("../models/Order");
// const Medicine = require("../models/Medicine");

// // @desc    Create new order & Apply FEFO Stock Deduction
// // @route   POST /api/orders
// // @access  Private
// const addOrderItems = asyncHandler(async (req, res) => {
//   const {
//     orderItems,
//     shippingAddress,
//     paymentMethod,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//   } = req.body;

//   if (orderItems && orderItems.length === 0) {
//     res.status(400);
//     throw new Error("No order items");
//   } else {
//     // 1. Process Stock Deduction (FEFO Logic)
//     for (const item of orderItems) {
//       const medicine = await Medicine.findById(item.product);

//       if (!medicine) {
//         res.status(404);
//         throw new Error(`Medicine not found: ${item.name}`);
//       }

//       if (medicine.countInStock < item.qty) {
//         res.status(400);
//         throw new Error(`Insufficient stock for: ${medicine.name}`);
//       }

//       // ✅ FEFO ALGORITHM (First Expired, First Out)
//       // Sort batches by Expiry Date (Ascending)
//       medicine.batches.sort(
//         (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
//       );

//       let qtyNeeded = item.qty;

//       // Iterate through batches and deduct
//       for (let batch of medicine.batches) {
//         if (qtyNeeded <= 0) break; // Demand met

//         if (batch.quantity > 0) {
//           // Determine how much to take from this batch
//           const deductAmount = Math.min(qtyNeeded, batch.quantity);

//           batch.quantity -= deductAmount; // Deduct
//           qtyNeeded -= deductAmount; // Decrease needed amount
//         }
//       }

//       // Remove empty batches (Optional cleanup)
//       medicine.batches = medicine.batches.filter((b) => b.quantity > 0);

//       // Recalculate Total Stock (Handled by pre-save hook, but good to be explicit)
//       medicine.countInStock = medicine.batches.reduce(
//         (acc, b) => acc + b.quantity,
//         0
//       );

//       await medicine.save();
//     }

//     // 2. Create Order
//     const order = new Order({
//       orderItems, // ✅ ONE-TO-MANY: One Order -> Many Items
//       user: req.user._id,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice,
//     });

//     const createdOrder = await order.save();
//     res.status(201).json(createdOrder);
//   }
// });

// // @desc    Get Order by ID
// // @route   GET /api/orders/:id
// const getOrderById = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id).populate(
//     "user",
//     "name email"
//   );
//   if (order) {
//     res.json(order);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// });

// // @desc    Get logged in user orders
// // @route   GET /api/orders/myorders
// const getMyOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find({ user: req.user._id });
//   res.json(orders);
// });

// module.exports = {
//   addOrderItems,
//   getOrderById,
//   getMyOrders,
// };

// const asyncHandler = require("express-async-handler");
// const Order = require("../models/Order");
// const Medicine = require("../models/Medicine");

// // @desc    Create new order & Apply FEFO Stock Deduction
// // @route   POST /api/orders
// // @access  Private
// const addOrderItems = asyncHandler(async (req, res) => {
//   const {
//     orderItems,
//     shippingAddress,
//     paymentMethod,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//   } = req.body;

//   if (orderItems && orderItems.length === 0) {
//     res.status(400);
//     throw new Error("No order items");
//   } else {
//     // 1. Process Stock Deduction (FEFO Logic)
//     for (const item of orderItems) {
//       const medicine = await Medicine.findById(item.product);

//       if (!medicine) {
//         res.status(404);
//         throw new Error(`Medicine not found: ${item.name}`);
//       }

//       if (medicine.countInStock < item.qty) {
//         res.status(400);
//         throw new Error(`Insufficient stock for: ${medicine.name}`);
//       }

//       // ✅ FEFO ALGORITHM (First Expired, First Out)
//       // Sort batches by Expiry Date (Ascending)
//       medicine.batches.sort(
//         (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
//       );

//       let qtyNeeded = item.qty;

//       // Iterate through batches and deduct
//       for (let batch of medicine.batches) {
//         if (qtyNeeded <= 0) break; // Demand met

//         if (batch.quantity > 0) {
//           // Determine how much to take from this batch
//           const deductAmount = Math.min(qtyNeeded, batch.quantity);

//           batch.quantity -= deductAmount; // Deduct
//           qtyNeeded -= deductAmount; // Decrease needed amount
//         }
//       }

//       // Remove empty batches (Optional cleanup)
//       medicine.batches = medicine.batches.filter((b) => b.quantity > 0);

//       // Recalculate Total Stock (Handled by pre-save hook, but good to be explicit)
//       medicine.countInStock = medicine.batches.reduce(
//         (acc, b) => acc + b.quantity,
//         0
//       );

//       await medicine.save();
//     }

//     // 2. Create Order
//     const order = new Order({
//       orderItems, // ✅ ONE-TO-MANY: One Order -> Many Items
//       user: req.user._id,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice,
//     });

//     const createdOrder = await order.save();
//     res.status(201).json(createdOrder);
//   }
// });

// // @desc    Get Order by ID
// // @route   GET /api/orders/:id
// // @access  Private
// const getOrderById = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id).populate(
//     "user",
//     "name email"
//   );
//   if (order) {
//     res.json(order);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// });

// // @desc    Get logged in user orders
// // @route   GET /api/orders/myorders
// // @access  Private
// const getMyOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find({ user: req.user._id });
//   res.json(orders);
// });

// // @desc    Get all orders
// // @route   GET /api/orders
// // @access  Private/Admin/Pharmacist
// const getAllOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find({})
//     .populate("user", "id name email")
//     .sort({ createdAt: -1 }); // Newest first
//   res.json(orders);
// });

// // @desc    Update order status
// // @route   PUT /api/orders/:id/status
// // @access  Private/Admin/Pharmacist
// const updateOrderStatus = asyncHandler(async (req, res) => {
//   const { status } = req.body; // e.g. "Ready", "Delivered", "Cancelled"
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     order.status = status;

//     // Automated delivery timestamp handling
//     if (status === "Delivered") {
//       order.isDelivered = true;
//       order.deliveredAt = Date.now();
//     } else {
//       order.isDelivered = false;
//     }

//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// });

// module.exports = {
//   addOrderItems,
//   getOrderById,
//   getMyOrders,
//   getAllOrders, // ✅ New export
//   updateOrderStatus, // ✅ New export
// };

// const Order = require("../models/Order");
// const Medicine = require("../models/Medicine");

// // -------------------------------------------------------------------
// // HELPER: Deduct Stock (FEFO - First Expired, First Out)
// // -------------------------------------------------------------------
// async function deductFromBatches(medicineId, neededQty) {
//   const med = await Medicine.findById(medicineId);
//   if (!med) throw new Error("Medicine not found");

//   // Fallback if no batches exist
//   if (!med.batches || med.batches.length === 0) {
//     const available = med.countInStock || 0; // Schema uses countInStock
//     if (available < neededQty) {
//       throw new Error(
//         `Not enough stock for ${med.name} (Requested: ${neededQty}, Available: ${available})`
//       );
//     }
//     med.countInStock = available - neededQty;
//     await med.save();
//     return;
//   }

//   // Sort Batches by Expiry (Oldest Expiry First)
//   med.batches.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

//   let remaining = neededQty;

//   for (const batch of med.batches) {
//     if (remaining <= 0) break;
//     const available = Number(batch.qty) || 0;
//     if (available <= 0) continue;

//     const take = Math.min(available, remaining);
//     batch.qty = available - take;
//     remaining -= take;
//   }

//   if (remaining > 0) {
//     throw new Error(`Not enough stock for ${med.name} in batches.`);
//   }

//   // Remove empty batches (Optional: keeps DB clean)
//   med.batches = med.batches.filter((b) => (Number(b.qty) || 0) > 0);

//   // Recalculate Total Stock
//   if (typeof med.recalculateStock === "function") {
//     med.recalculateStock();
//   } else {
//     med.countInStock = med.batches.reduce(
//       (sum, b) => sum + (Number(b.qty) || 0),
//       0
//     );
//   }

//   await med.save();
// }

// // -------------------------------------------------------------------
// // @desc    Create new order
// // @route   POST /api/orders
// // @access  Private (Customer)
// // -------------------------------------------------------------------
// const addOrderItems = async (req, res) => {
//   try {
//     const { orderItems, shippingAddress, paymentMethod } = req.body;

//     if (!orderItems || orderItems.length === 0) {
//       return res.status(400).json({ message: "No order items" });
//     }

//     let totalPrice = 0;
//     const finalOrderItems = [];

//     // Process each item (Validation, Stock Deduction, Price Calc)
//     for (const item of orderItems) {
//       // Frontend might send 'product' or 'medicineId'
//       const medicineId = item.product || item.medicineId;
//       const medicine = await Medicine.findById(medicineId);

//       if (!medicine) {
//         return res
//           .status(400)
//           .json({ message: `Medicine not found: ${medicineId}` });
//       }

//       // --- UNIT CONVERSION LOGIC ---
//       let multiplier = 1;
//       let pricePerUnit = medicine.price; // Default: Base Unit Price

//       // Determine requested unit (default to base if missing)
//       const requestedUnit = item.unit || medicine.baseUnit || "Tablet";

//       // If requested unit is different from base, check for multiplier
//       if (requestedUnit !== (medicine.baseUnit || "Tablet")) {
//         const packUnit = medicine.units?.find((u) => u.name === requestedUnit);
//         if (packUnit) {
//           multiplier = packUnit.multiplier;
//           pricePerUnit = packUnit.price;
//         }
//       }

//       // Calculate physical quantity to deduct (e.g., 2 Strips * 10 = 20 Tablets)
//       const quantityToDeduct = Number(item.qty || item.quantity) * multiplier;

//       // Deduct Stock
//       try {
//         await deductFromBatches(medicineId, quantityToDeduct);
//       } catch (stockErr) {
//         return res.status(400).json({ message: stockErr.message });
//       }

//       // Calculate Item Total
//       const itemTotal =
//         Number(pricePerUnit) * Number(item.qty || item.quantity);
//       totalPrice += itemTotal;

//       // Push to formatted array matching Order Schema
//       finalOrderItems.push({
//         name: medicine.name,
//         qty: Number(item.qty || item.quantity),
//         image: medicine.image,
//         price: pricePerUnit,
//         product: medicine._id,
//         unit: requestedUnit,
//       });
//     }

//     // Create Order
//     const order = new Order({
//       user: req.user._id, // From Auth Token
//       orderItems: finalOrderItems,
//       shippingAddress,
//       paymentMethod,
//       totalPrice,
//       isPaid: false,
//       status: "Pending",
//     });

//     const createdOrder = await order.save();
//     res.status(201).json(createdOrder);
//   } catch (error) {
//     console.error("Create Order Error:", error);
//     res.status(500).json({ message: "Server error during checkout" });
//   }
// };

// // -------------------------------------------------------------------
// // @desc    Get order by ID
// // @route   GET /api/orders/:id
// // @access  Private
// // -------------------------------------------------------------------
// const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate(
//       "user",
//       "name email"
//     );

//     if (order) {
//       // Security: Only Admin or the Order Owner can view
//       if (
//         req.user.role === "admin" ||
//         req.user.role === "pharmacist" ||
//         order.user._id.toString() === req.user._id.toString()
//       ) {
//         res.json(order);
//       } else {
//         res.status(403).json({ message: "Not authorized to view this order" });
//       }
//     } else {
//       res.status(404).json({ message: "Order not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // -------------------------------------------------------------------
// // @desc    Get logged-in user's orders
// // @route   GET /api/orders/myorders
// // @access  Private
// // -------------------------------------------------------------------
// const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id }).sort({
//       createdAt: -1,
//     });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // -------------------------------------------------------------------
// // @desc    Get all orders (Admin/Pharmacist)
// // @route   GET /api/orders
// // @access  Private (Admin/Pharmacist)
// // -------------------------------------------------------------------
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({})
//       .populate("user", "id name")
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // -------------------------------------------------------------------
// // @desc    Update order status
// // @route   PUT /api/orders/:id/status
// // @access  Private (Admin/Pharmacist)
// // -------------------------------------------------------------------
// const updateOrderStatus = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (order) {
//       order.status = req.body.status || order.status;

//       if (req.body.status === "Delivered") {
//         order.isDelivered = true;
//         order.deliveredAt = Date.now();
//       }

//       const updatedOrder = await order.save();
//       res.json(updatedOrder);
//     } else {
//       res.status(404).json({ message: "Order not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// module.exports = {
//   addOrderItems,
//   getOrderById,
//   getMyOrders,
//   getAllOrders,
//   updateOrderStatus,
// };

// const Order = require("../models/Order");
// const Medicine = require("../models/Medicine");
// const mongoose = require("mongoose");

// // -------------------------------------------------------------------
// // HELPER: Deduct Stock (FEFO - First Expired, First Out)
// // -------------------------------------------------------------------
// async function deductFromBatches(medicineId, neededQty, session) {
//   const med = await Medicine.findById(medicineId).session(session);
//   if (!med) throw new Error("Medicine not found");

//   // Fallback if no batches exist
//   if (!med.batches || med.batches.length === 0) {
//     const available = med.countInStock || 0;
//     if (available < neededQty) {
//       throw new Error(
//         `Insufficient stock for ${med.name}. Available: ${available}`
//       );
//     }
//     med.countInStock = available - neededQty;
//     await med.save({ session });
//     return;
//   }

//   // Sort Batches by Expiry (Oldest Expiry First) - FEFO Logic
//   med.batches.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

//   let remaining = neededQty;
//   for (const batch of med.batches) {
//     if (remaining <= 0) break;
//     const available = Number(batch.qty) || 0;
//     if (available <= 0) continue;

//     const take = Math.min(available, remaining);
//     batch.qty = available - take;
//     remaining -= take;
//   }

//   if (remaining > 0) {
//     throw new Error(`Not enough stock in valid batches for ${med.name}`);
//   }

//   // Recalculate Total Stock from remaining batches
//   med.countInStock = med.batches.reduce(
//     (sum, b) => sum + (Number(b.qty) || 0),
//     0
//   );

//   // Clean up empty batches
//   med.batches = med.batches.filter((b) => (Number(b.qty) || 0) > 0);

//   await med.save({ session });
// }

// // -------------------------------------------------------------------
// // @desc    Create new order
// // @route   POST /api/orders
// // @access  Private (Customer)
// // -------------------------------------------------------------------
// const createOrder = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { orderItems, shippingAddress, paymentMethod } = req.body;

//     if (!orderItems || orderItems.length === 0) {
//       return res.status(400).json({ message: "No order items" });
//     }

//     let totalPrice = 0;
//     const finalOrderItems = [];

//     for (const item of orderItems) {
//       const medicineId = item.product || item.medicineId;
//       const medicine = await Medicine.findById(medicineId).session(session);

//       if (!medicine) {
//         throw new Error(`Medicine not found: ${medicineId}`);
//       }

//       // Unit & Multiplier Logic
//       let multiplier = 1;
//       let pricePerUnit = medicine.price;
//       const requestedUnit = item.unit || medicine.baseUnit || "Tablet";

//       if (requestedUnit !== (medicine.baseUnit || "Tablet")) {
//         const packUnit = medicine.units?.find((u) => u.name === requestedUnit);
//         if (packUnit) {
//           multiplier = packUnit.multiplier;
//           pricePerUnit = packUnit.price;
//         }
//       }

//       const quantityToDeduct = Number(item.qty) * multiplier;

//       // Deduct Stock within the transaction
//       await deductFromBatches(medicineId, quantityToDeduct, session);

//       const itemTotal = Number(pricePerUnit) * Number(item.qty);
//       totalPrice += itemTotal;

//       finalOrderItems.push({
//         name: medicine.name,
//         qty: Number(item.qty),
//         image: medicine.image,
//         price: pricePerUnit,
//         product: medicine._id,
//         unit: requestedUnit,
//       });
//     }

//     const order = new Order({
//       user: req.user._id,
//       orderItems: finalOrderItems,
//       shippingAddress,
//       paymentMethod,
//       totalPrice,
//       status: "Processing", // Standard initial status
//     });

//     const createdOrder = await order.save({ session });

//     // Commit everything if we got here
//     await session.commitTransaction();
//     res.status(201).json(createdOrder);
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Order Creation Failed:", error.message);
//     res
//       .status(400)
//       .json({ message: error.message || "Order placement failed" });
//   } finally {
//     session.endSession();
//   }
// };

// // -------------------------------------------------------------------
// // @desc    Get logged-in user's orders
// // @route   GET /api/orders/my
// // @access  Private
// // -------------------------------------------------------------------
// const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id }).sort({
//       createdAt: -1,
//     });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch your orders" });
//   }
// };

// // -------------------------------------------------------------------
// // @desc    Get all orders (Admin/Pharmacist)
// // @route   GET /api/orders/all
// // @access  Private (Admin/Pharmacist)
// // -------------------------------------------------------------------
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({})
//       .populate("user", "name email")
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch all orders" });
//   }
// };

// // -------------------------------------------------------------------
// // @desc    Update order status
// // @route   PUT /api/orders/:id/status
// // @access  Private (Admin/Pharmacist)
// // -------------------------------------------------------------------
// const updateOrderStatus = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     order.status = req.body.status || order.status;

//     if (req.body.status === "Delivered") {
//       order.isPaid = true; // Auto-mark as paid on delivery if COD
//       order.deliveredAt = Date.now();
//     }

//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update status" });
//   }
// };

// // ✅ EXPORTS (Names now match orderRoutes.js imports exactly)
// module.exports = {
//   createOrder,
//   getMyOrders,
//   getAllOrders,
//   updateOrderStatus,
// };

const Order = require("../models/Order");
const Medicine = require("../models/Medicine");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
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
    const order = new Order({
      orderItems,
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
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
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
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
};

// @desc    Get all orders (Admin/Pharmacist)
// @route   GET /api/orders/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "id name")
    .sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    if (req.body.status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
};

// ✅ Ensure ALL functions are exported here
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderStatus,
};
