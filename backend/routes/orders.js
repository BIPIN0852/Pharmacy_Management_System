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

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Medicine = require("../models/Medicine");
const authenticateToken = require("../middleware/auth");

// helper: deduct quantity from medicine batches FEFO (earliest expiry first)
async function deductFromBatches(medicineId, neededQty) {
  const med = await Medicine.findById(medicineId);
  if (!med) throw new Error("Medicine not found");

  // fallback: no batches yet -> simple quantity deduction
  if (!med.batches || med.batches.length === 0) {
    const available = Number(med.quantity) || 0;
    if (available < neededQty) {
      throw new Error(`Not enough stock for ${med.name}`);
    }
    med.quantity = available - neededQty;
    await med.save();
    return;
  }

  // FEFO: sort by expiry date ascending (earliest expiry first)
  med.batches.sort((a, b) => {
    const aTime = a.expiryDate ? new Date(a.expiryDate).getTime() : 0;
    const bTime = b.expiryDate ? new Date(b.expiryDate).getTime() : 0;
    return aTime - bTime;
  });

  let remaining = neededQty;

  for (const batch of med.batches) {
    if (remaining <= 0) break;
    const available = Number(batch.qty) || 0;
    if (available <= 0) continue;

    const take = Math.min(available, remaining);
    batch.qty = available - take;
    remaining -= take;
  }

  if (remaining > 0) {
    throw new Error(`Not enough stock for ${med.name}`);
  }

  // remove empty batches
  med.batches = med.batches.filter((b) => (Number(b.qty) || 0) > 0);

  // keep quantity in sync with batches
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

// GET customer orders
router.get("/customer/:customerId", authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.customerId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await Order.find({
      customerId: req.params.customerId,
    }).populate("items.medicineId");

    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST create order
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { customerId, items } = req.body;

    if (req.user.id !== customerId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    let total = 0;

    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) {
        return res.status(400).json({ message: "Medicine not found" });
      }

      // deduct using FEFO/FIFO logic
      await deductFromBatches(item.medicineId, item.quantity);

      total += Number(medicine.price || 0) * item.quantity;
    }

    const order = new Order({ customerId, items, total });
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    if (err.message && err.message.startsWith("Not enough stock")) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
