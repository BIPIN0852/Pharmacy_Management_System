// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order");
// const Medicine = require("../models/Medicine");
// const authenticateToken = require("../middleware/auth");

// // GET customer orders
// router.get("/customer/:customerId", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.id !== req.params.customerId && req.user.role !== "admin")
//       return res.status(403).json({ message: "Forbidden" });

//     const orders = await Order.find({
//       customerId: req.params.customerId,
//     }).populate("items.medicineId");
//     res.json(orders);
//   } catch (err) {
//     console.error("Fetch orders error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST create order
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const { customerId, items } = req.body;

//     if (req.user.id !== customerId)
//       return res.status(403).json({ message: "Forbidden" });

//     let total = 0;
//     for (const item of items) {
//       const medicine = await Medicine.findById(item.medicineId);
//       if (!medicine)
//         return res.status(400).json({ message: "Medicine not found" });
//       if (medicine.stock < item.quantity)
//         return res
//           .status(400)
//           .json({ message: `Not enough stock for ${medicine.name}` });

//       medicine.stock -= item.quantity;
//       await medicine.save();

//       total += medicine.price * item.quantity;
//     }

//     const order = new Order({ customerId, items, total });
//     await order.save();
//     res.status(201).json(order);
//   } catch (err) {
//     console.error("Create order error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order");
// const Medicine = require("../models/Medicine");
// const authenticateToken = require("../middleware/auth");

// // helper: deduct quantity from medicine batches FEFO (earliest expiry first)
// async function deductFromBatches(medicineId, neededQty) {
//   const med = await Medicine.findById(medicineId);
//   if (!med) throw new Error("Medicine not found");

//   // fall back to old behaviour if no batches yet
//   if (!med.batches || med.batches.length === 0) {
//     if ((med.quantity || 0) < neededQty) {
//       throw new Error(`Not enough stock for ${med.name}`);
//     }
//     med.quantity = (med.quantity || 0) - neededQty;
//     await med.save();
//     return;
//   }

//   // sort by expiry date ascending (FEFO)
//   med.batches.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

//   let remaining = neededQty;

//   for (const batch of med.batches) {
//     if (remaining <= 0) break;
//     if (batch.qty <= 0) continue;

//     const take = Math.min(batch.qty, remaining);
//     batch.qty -= take;
//     remaining -= take;
//   }

//   if (remaining > 0) {
//     throw new Error(`Not enough stock for ${med.name}`);
//   }

//   // remove empty batches
//   med.batches = med.batches.filter((b) => b.qty > 0);

//   // keep quantity in sync
//   if (typeof med.recalculateQuantityFromBatches === "function") {
//     med.recalculateQuantityFromBatches();
//   } else {
//     med.quantity = med.batches.reduce((sum, b) => sum + (b.qty || 0), 0);
//   }

//   await med.save();
// }

// // GET customer orders
// router.get("/customer/:customerId", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.id !== req.params.customerId && req.user.role !== "admin")
//       return res.status(403).json({ message: "Forbidden" });

//     const orders = await Order.find({
//       customerId: req.params.customerId,
//     }).populate("items.medicineId");
//     res.json(orders);
//   } catch (err) {
//     console.error("Fetch orders error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST create order
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const { customerId, items } = req.body;

//     if (req.user.id !== customerId)
//       return res.status(403).json({ message: "Forbidden" });

//     // validate & reserve stock batch-wise
//     let total = 0;

//     for (const item of items) {
//       const medicine = await Medicine.findById(item.medicineId);
//       if (!medicine) {
//         return res.status(400).json({ message: "Medicine not found" });
//       }

//       // try to deduct from batches (throws if insufficient)
//       await deductFromBatches(item.medicineId, item.quantity);

//       total += medicine.price * item.quantity;
//     }

//     const order = new Order({ customerId, items, total });
//     await order.save();
//     res.status(201).json(order);
//   } catch (err) {
//     console.error("Create order error:", err);
//     if (err.message && err.message.startsWith("Not enough stock")) {
//       return res.status(400).json({ message: err.message });
//     }
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order");
// const Medicine = require("../models/Medicine");
// const authenticateToken = require("../middleware/auth");

// // helper: deduct quantity from medicine batches FEFO (earliest expiry first)
// async function deductFromBatches(medicineId, neededQty) {
//   const med = await Medicine.findById(medicineId);
//   if (!med) throw new Error("Medicine not found");

//   // fallback: no batches yet -> simple quantity deduction
//   if (!med.batches || med.batches.length === 0) {
//     const available = Number(med.quantity) || 0;
//     if (available < neededQty) {
//       throw new Error(`Not enough stock for ${med.name}`);
//     }
//     med.quantity = available - neededQty;
//     await med.save();
//     return;
//   }

//   // FEFO: sort by expiry date ascending (earliest expiry first)
//   med.batches.sort((a, b) => {
//     const aTime = a.expiryDate ? new Date(a.expiryDate).getTime() : 0;
//     const bTime = b.expiryDate ? new Date(b.expiryDate).getTime() : 0;
//     return aTime - bTime;
//   });

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
//     throw new Error(`Not enough stock for ${med.name}`);
//   }

//   // remove empty batches
//   med.batches = med.batches.filter((b) => (Number(b.qty) || 0) > 0);

//   // keep quantity in sync with batches
//   if (typeof med.recalculateQuantityFromBatches === "function") {
//     med.recalculateQuantityFromBatches();
//   } else {
//     med.quantity = med.batches.reduce(
//       (sum, b) => sum + (Number(b.qty) || 0),
//       0
//     );
//   }

//   await med.save();
// }

// // GET customer orders
// router.get("/customer/:customerId", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.id !== req.params.customerId && req.user.role !== "admin") {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     const orders = await Order.find({
//       customerId: req.params.customerId,
//     }).populate("items.medicineId");

//     res.json(orders);
//   } catch (err) {
//     console.error("Fetch orders error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST create order
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const { customerId, items } = req.body;

//     if (req.user.id !== customerId && req.user.role !== "admin") {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     let total = 0;

//     for (const item of items) {
//       const medicine = await Medicine.findById(item.medicineId);
//       if (!medicine) {
//         return res.status(400).json({ message: "Medicine not found" });
//       }

//       // deduct using FEFO/FIFO logic
//       await deductFromBatches(item.medicineId, item.quantity);

//       total += Number(medicine.price || 0) * item.quantity;
//     }

//     const order = new Order({ customerId, items, total });
//     await order.save();

//     res.status(201).json(order);
//   } catch (err) {
//     console.error("Create order error:", err);
//     if (err.message && err.message.startsWith("Not enough stock")) {
//       return res.status(400).json({ message: err.message });
//     }
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order");
// const Medicine = require("../models/Medicine");
// const authenticateToken = require("../middleware/auth"); // Or '../middleware/authMiddleware'

// // helper: deduct quantity from medicine batches FEFO (earliest expiry first)
// // NOTE: 'neededQty' passed here must be in BASE UNITS (e.g., total tablets)
// async function deductFromBatches(medicineId, neededQty) {
//   const med = await Medicine.findById(medicineId);
//   if (!med) throw new Error("Medicine not found");

//   // fallback: no batches yet -> simple quantity deduction
//   if (!med.batches || med.batches.length === 0) {
//     const available = Number(med.quantity) || 0;
//     if (available < neededQty) {
//       throw new Error(`Not enough stock for ${med.name}`);
//     }
//     med.quantity = available - neededQty;
//     await med.save();
//     return;
//   }

//   // FEFO: sort by expiry date ascending (earliest expiry first)
//   med.batches.sort((a, b) => {
//     const aTime = a.expiryDate ? new Date(a.expiryDate).getTime() : 0;
//     const bTime = b.expiryDate ? new Date(b.expiryDate).getTime() : 0;
//     return aTime - bTime;
//   });

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
//     throw new Error(`Not enough stock for ${med.name}`);
//   }

//   // remove empty batches
//   med.batches = med.batches.filter((b) => (Number(b.qty) || 0) > 0);

//   // keep quantity in sync with batches
//   if (typeof med.recalculateQuantityFromBatches === "function") {
//     med.recalculateQuantityFromBatches();
//   } else {
//     med.quantity = med.batches.reduce(
//       (sum, b) => sum + (Number(b.qty) || 0),
//       0
//     );
//   }

//   await med.save();
// }

// // GET customer orders
// router.get("/customer/:customerId", authenticateToken, async (req, res) => {
//   try {
//     if (req.user.id !== req.params.customerId && req.user.role !== "admin") {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     const orders = await Order.find({
//       customerId: req.params.customerId,
//     }).populate("items.medicineId");

//     res.json(orders);
//   } catch (err) {
//     console.error("Fetch orders error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST create order
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const { customerId, items } = req.body;

//     if (req.user.id !== customerId && req.user.role !== "admin") {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     let total = 0;
//     // We will rebuild the items array to ensure we capture the price/unit snapshot correctly
//     const orderItems = [];

//     for (const item of items) {
//       const medicine = await Medicine.findById(item.medicineId);
//       if (!medicine) {
//         return res.status(400).json({ message: "Medicine not found" });
//       }

//       // --- NEW: UNIT CONVERSION LOGIC ---
//       let multiplier = 1;
//       let pricePerUnit = medicine.price; // Default to Base Unit Price

//       // Check if user requested a specific unit (e.g., "Strip")
//       // item.unit comes from the Frontend Cart
//       const requestedUnit = item.unit || medicine.baseUnit;

//       if (requestedUnit !== medicine.baseUnit) {
//         // Find the unit config (e.g. Strip = 10x, Price = 50)
//         const packUnit = medicine.units.find(u => u.name === requestedUnit);
//         if (packUnit) {
//           multiplier = packUnit.multiplier;
//           pricePerUnit = packUnit.price;
//         }
//       }

//       // Calculate Total Base Units to deduct from Inventory
//       // Example: 2 Strips * 10 Multiplier = Deduct 20 Tablets
//       const quantityToDeduct = item.quantity * multiplier;

//       // ----------------------------------

//       // Deduct using FEFO logic (Pass the converted base quantity)
//       await deductFromBatches(item.medicineId, quantityToDeduct);

//       // Add to Total Price (Price per Unit * Qty User Bought)
//       total += Number(pricePerUnit || 0) * item.quantity;

//       // Add to formatted Items array
//       orderItems.push({
//         medicineId: item.medicineId,
//         quantity: item.quantity,
//         unit: requestedUnit, // Save the unit used
//         price: pricePerUnit  // Save snapshot of price
//       });
//     }

//     // Create Order with calculated total and formatted items
//     const order = new Order({
//         customerId,
//         items: orderItems.length > 0 ? orderItems : items, // Use new items if logic applied, else fallback
//         total
//     });

//     await order.save();

//     res.status(201).json(order);
//   } catch (err) {
//     console.error("Create order error:", err);
//     if (err.message && err.message.startsWith("Not enough stock")) {
//       return res.status(400).json({ message: err.message });
//     }
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Medicine = require("../models/Medicine");
const authenticateToken = require("../middleware/auth");

// helper: deduct quantity from medicine batches FEFO
async function deductFromBatches(medicineId, neededQty) {
  const med = await Medicine.findById(medicineId);
  if (!med) throw new Error("Medicine not found");

  // Fallback if no batches
  if (!med.batches || med.batches.length === 0) {
    const available = Number(med.quantity) || 0;
    if (available < neededQty)
      throw new Error(`Not enough stock for ${med.name}`);
    med.quantity = available - neededQty;
    await med.save();
    return;
  }

  // Sort Batches by Expiry (FEFO)
  med.batches.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

  let remaining = neededQty;

  for (const batch of med.batches) {
    if (remaining <= 0) break;
    const available = Number(batch.qty) || 0;
    if (available <= 0) continue;

    const take = Math.min(available, remaining);
    batch.qty = available - take;
    remaining -= take;
  }

  if (remaining > 0) throw new Error(`Not enough stock for ${med.name}`);

  // Clean up empty batches and sync total quantity
  med.batches = med.batches.filter((b) => (Number(b.qty) || 0) > 0);

  if (typeof med.recalculateQuantityFromBatches === "function") {
    med.recalculateQuantityFromBatches();
  } else {
    med.quantity = med.batches.reduce(
      (sum, b) => sum + (Number(b.qty) || 0),
      0
    );
  }

  await med.save();
}

// POST create order
router.post("/", authenticateToken, async (req, res) => {
  try {
    // FIX: Default to req.user.id if customerId is missing in body
    const customerId = req.body.customerId || req.user.id;
    const { items } = req.body;

    // Security Check: Ensure users can only order for themselves (unless Admin)
    if (req.user.id !== customerId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot place order for others" });
    }

    let total = 0;
    const finalOrderItems = [];

    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) {
        return res
          .status(400)
          .json({ message: `Medicine not found: ${item.medicineId}` });
      }

      // --- UNIT CONVERSION LOGIC ---
      let multiplier = 1;
      let pricePerUnit = medicine.price; // Default: Base Unit Price

      // Use the unit sent from frontend, or default to base
      const requestedUnit = item.unit || medicine.baseUnit || "Tablet";

      if (requestedUnit !== (medicine.baseUnit || "Tablet")) {
        // If user bought a Pack/Strip, find the multiplier
        const packUnit = medicine.units?.find((u) => u.name === requestedUnit);
        if (packUnit) {
          multiplier = packUnit.multiplier;
          pricePerUnit = packUnit.price;
        }
      }

      // Calculate stock to deduct (User Qty * Unit Multiplier)
      // e.g., 2 Strips * 10 tabs = Deduct 20 tabs
      const quantityToDeduct = item.quantity * multiplier;

      // Deduct Stock
      try {
        await deductFromBatches(item.medicineId, quantityToDeduct);
      } catch (stockErr) {
        return res.status(400).json({ message: stockErr.message });
      }

      // Calculate Cost
      total += Number(pricePerUnit) * Number(item.quantity);

      // Add to final array
      finalOrderItems.push({
        medicineId: item.medicineId,
        quantity: item.quantity,
        unit: requestedUnit,
        price: pricePerUnit,
      });
    }

    // Create Order
    const order = new Order({
      customerId,
      items: finalOrderItems,
      total,
      status: "pending",
      paymentStatus: "Pending",
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error during checkout" });
  }
});

module.exports = router;
