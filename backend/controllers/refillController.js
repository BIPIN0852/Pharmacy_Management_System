// const asyncHandler = require("express-async-handler");
// const Order = require("../models/Order");

// // @desc    Get customers needing refills
// // @route   GET /api/refills
// // @access  Private/Pharmacist
// const getRefillReminders = asyncHandler(async (req, res) => {
//   // Logic: Find orders from 30 days ago (assuming 30-day supply)
//   const daysAgo30 = new Date();
//   daysAgo30.setDate(daysAgo30.getDate() - 25); // Start reminding 5 days early

//   const refills = await Order.find({
//     createdAt: { $lte: daysAgo30 }, // Orders older than 25 days
//     isPaid: true,
//   })
//     .populate("user", "name email phone")
//     .populate("orderItems.product", "name")
//     .limit(20);

//   res.json(refills);
// });

// module.exports = { getRefillReminders };

// const asyncHandler = require("express-async-handler");
// const Order = require("../models/Order");

// // @desc    Get customers needing refills
// // @route   GET /api/refills
// // @access  Private/Pharmacist
// const getRefillReminders = asyncHandler(async (req, res) => {
//   // 1. Look for medicines that will run out within the next 5 days
//   const targetDate = new Date();
//   targetDate.setDate(targetDate.getDate() + 5);

//   // 2. Query the exact refillDate we calculated during checkout
//   const rawOrders = await Order.find({
//     isPaid: true,
//     isCancelled: false, // Ignore cancelled orders
//     "orderItems.refillDate": { $lte: targetDate },
//   })
//     .populate("user", "name email phone")
//     .sort({ createdAt: -1 });

//   // 3. Clean up and format the response
//   // An order might have 3 items, but only 1 needs a refill today.
//   // We extract ONLY the specific items that need a refill to send to the frontend.
//   const formattedRefills = [];

//   rawOrders.forEach((order) => {
//     // Make sure the user still exists in the DB (prevents crashes if a user was deleted)
//     if (!order.user) return;

//     order.orderItems.forEach((item) => {
//       // Check if this specific item is the one causing the refill alert
//       if (item.refillDate && new Date(item.refillDate) <= targetDate) {
//         formattedRefills.push({
//           orderId: order._id,
//           user: order.user,
//           medicineName: item.name,
//           qtyBought: item.qty * (item.buyingMultiplier || 1),
//           refillDate: item.refillDate,
//           reminderSentAutomated: item.refillReminderSent, // Did the Cron Job email them already?
//           originalOrderDate: order.createdAt,
//         });
//       }
//     });
//   });

//   // 4. Sort the list so the most urgent/past-due refills are at the very top
//   formattedRefills.sort(
//     (a, b) => new Date(a.refillDate) - new Date(b.refillDate),
//   );

//   res.json(formattedRefills);
// });

// module.exports = { getRefillReminders };

const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");

// @desc    Get customers needing refills
// @route   GET /api/refills
// @access  Private/Pharmacist
const getRefillReminders = asyncHandler(async (req, res) => {
  // 1. Look for medicines that will run out within the next 100 days (Expanded for testing!)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 100);

  // 2. Query the exact refillDate we calculated during checkout
  const rawOrders = await Order.find({
    isPaid: true,
    isCancelled: false, // Ignore cancelled orders
    "orderItems.refillDate": { $lte: targetDate },
  })
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });

  // 3. Clean up and format the response
  // An order might have 3 items, but only 1 needs a refill today.
  // We extract ONLY the specific items that need a refill to send to the frontend.
  const formattedRefills = [];

  rawOrders.forEach((order) => {
    // Make sure the user still exists in the DB (prevents crashes if a user was deleted)
    if (!order.user) return;

    order.orderItems.forEach((item) => {
      // Check if this specific item is the one causing the refill alert
      if (item.refillDate && new Date(item.refillDate) <= targetDate) {
        formattedRefills.push({
          orderId: order._id,
          user: order.user,
          medicineName: item.name,
          qtyBought: item.qty * (item.buyingMultiplier || 1),
          refillDate: item.refillDate,
          reminderSentAutomated: item.refillReminderSent, // Did the Cron Job email them already?
          originalOrderDate: order.createdAt,
        });
      }
    });
  });

  // 4. Sort the list so the most urgent/past-due refills are at the very top
  formattedRefills.sort(
    (a, b) => new Date(a.refillDate) - new Date(b.refillDate),
  );

  res.json(formattedRefills);
});

module.exports = { getRefillReminders };
