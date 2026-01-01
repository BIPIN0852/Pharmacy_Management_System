// const express = require("express");
// const Order = require("../models/Order"); // ✅ matches backend/models/Order.js
// const authenticateToken = require("../middleware/auth");

// const router = express.Router();

// // GET /api/customer/orders - current customer's orders
// router.get("/orders", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.role !== "customer") {
//       return res.status(403).json({ message: "Customer access only" });
//     }

//     const orders = await Order.find({ customer: req.user.id })
//       .populate("orderItems.medicine", "name") // adjust field names to your schema
//       .sort({ createdAt: -1 })
//       .lean();

//     res.json(orders);
//   } catch (err) {
//     console.error("customer orders error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const Order = require("../models/Order");
// // Based on your screenshot, your middleware might be in 'authMiddleware.js' or 'auth.js'
// // Ensure this import points to the file that populates 'req.user'
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// // @route   GET /api/customer/orders
// // @desc    Get current logged-in customer's orders
// // @access  Private
// router.get("/", protect, async (req, res) => {
//   try {
//     // 1. Role Check (Optional if your middleware already handles roles)
//     // If your user model uses "role", keep this.
//     if (req.user.role && req.user.role !== "customer") {
//       return res.status(403).json({ message: "Access denied. Customer only." });
//     }

//     // 2. Fetch Orders
//     // We filter by 'customer: req.user.id'
//     const orders = await Order.find({ customer: req.user.id })
//       .populate("orderItems.medicine", "name image price") // Populating medicine details for the UI
//       .sort({ createdAt: -1 }); // Sort by newest first

//     // 3. Return object structure
//     // This matches the frontend expectation: { orders: [...] }
//     res.json({
//       success: true,
//       count: orders.length,
//       orders: orders
//     });

//   } catch (err) {
//     console.error("Error fetching customer orders:", err);
//     res.status(500).json({ message: "Server error fetching orders" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const Order = require("../models/Order");
// // Ensure this path matches your actual middleware file location
// const authenticateToken = require("../middleware/auth");

// const router = express.Router();

// // GET /api/customer/orders
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     // 1. Role Check
//     if (req.user.role !== "customer") {
//       return res.status(403).json({ message: "Customer access only" });
//     }

//     // 2. Query
//     // Using 'customerId' and 'items' to match your updated Schema
//     const orders = await Order.find({ customerId: req.user.id })
//       .populate({
//         path: "items.medicineId",
//         select: "name price image baseUnit units",
//       })
//       .sort({ createdAt: -1 })
//       .lean();

//     // 3. Response
//     // IMPORTANT: Return an object { orders: [...] }
//     // This ensures your frontend 'safelyGetArray(data, "orders")' works correctly.
//     res.json({
//       success: true,
//       count: orders.length,
//       orders: orders,
//     });
//   } catch (err) {
//     console.error("customer orders error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const Order = require("../models/Order");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// GET /api/customer/orders
router.get("/", authenticateToken, async (req, res) => {
  try {
    // 1. Role Check
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Customer access only" });
    }

    // 2. Query
    // Using 'customerId' and 'items' to match your updated Order Schema
    const orders = await Order.find({ customerId: req.user.id })
      .populate({
        path: "items.medicineId",
        select: "name price image baseUnit units", // Get Medicine details for the cards
      })
      .sort({ createdAt: -1 })
      .lean();

    // 3. Format Data for Frontend
    // The Dashboard expects 'totalAmount', but Schema uses 'total'.
    // We create an alias here to ensure the price shows up in the table.
    const formattedOrders = orders.map((order) => ({
      ...order,
      totalAmount: order.total, // Fixes display issue on Dashboard
    }));

    // 4. Response
    res.json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders,
    });
  } catch (err) {
    console.error("customer orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
