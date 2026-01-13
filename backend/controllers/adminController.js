// const Order = require("../models/Order");
// const User = require("../models/User");
// const Supplier = require("../models/Supplier");
// const Medicine = require("../models/Medicine");
// const PurchaseOrder = require("../models/PurchaseOrder");
// const Doctor = require("../models/Doctor");

// // -------------------------------------------------------------------
// // 📊 1. DASHBOARD & ANALYTICS
// // -------------------------------------------------------------------

// // @desc    Get Admin Dashboard Stats (Real-time aggregation)
// // @route   GET /api/admin/stats
// const getAdminStats = async (req, res) => {
//   try {
//     const totalOrders = await Order.countDocuments();
//     const totalCustomers = await User.countDocuments({ role: "customer" });
//     const totalMedicines = await Medicine.countDocuments();
//     const totalDoctors = await Doctor.countDocuments();

//     const paidOrders = await Order.find({ isPaid: true });
//     const totalSales = paidOrders.reduce(
//       (acc, item) => acc + item.totalPrice,
//       0
//     );

//     const salesData = await Order.aggregate([
//       {
//         $match: {
//           isPaid: true,
//           createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: "$createdAt" },
//           sales: { $sum: "$totalPrice" },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     const monthNames = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];
//     const formattedSalesData = salesData.map((item) => ({
//       month: monthNames[item._id - 1],
//       sales: item.sales,
//     }));

//     res.json({
//       totalOrders,
//       totalSales,
//       totalCustomers,
//       totalMedicines,
//       totalDoctors,
//       salesData:
//         formattedSalesData.length > 0
//           ? formattedSalesData
//           : [{ month: "No Data", sales: 0 }],
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching admin stats" });
//   }
// };

// // -------------------------------------------------------------------
// // 👤 2. USER & STAFF MANAGEMENT
// // -------------------------------------------------------------------

// // @desc    Get all registered users (Admins, Doctors, Staff)
// // @route   GET /api/admin/users
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({}).select("-password").sort({ role: 1 });
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching staff registry" });
//   }
// };

// // -------------------------------------------------------------------
// // 🛒 3. ORDER MANAGEMENT (GLOBAL ORDERS)
// // -------------------------------------------------------------------

// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({})
//       .populate("user", "id name email")
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching global order registry" });
//   }
// };

// const updateOrderStatus = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     order.status = req.body.status || order.status;
//     if (order.status === "Delivered") {
//       order.deliveredAt = Date.now();
//     }

//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update order status" });
//   }
// };

// // -------------------------------------------------------------------
// // 🩺 4. DOCTOR MANAGEMENT
// // -------------------------------------------------------------------

// const getAllDoctors = async (req, res) => {
//   try {
//     const doctors = await Doctor.find({}).sort({ name: 1 });
//     res.json(doctors);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching medical staff" });
//   }
// };

// const createDoctor = async (req, res) => {
//   try {
//     // Basic verification: Check if doctor already exists as a User
//     const userExists = await User.findOne({ email: req.body.email });

//     const doctor = new Doctor(req.body);
//     const createdDoctor = await doctor.save();

//     res.status(201).json(createdDoctor);
//   } catch (error) {
//     res.status(400).json({ message: error.message || "Invalid doctor data" });
//   }
// };

// const updateDoctor = async (req, res) => {
//   try {
//     const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });
//     res.json(doctor);
//   } catch (error) {
//     res.status(400).json({ message: "Update failed: " + error.message });
//   }
// };

// const deleteDoctor = async (req, res) => {
//   try {
//     const doctor = await Doctor.findByIdAndDelete(req.params.id);
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });
//     res.json({ message: "Doctor removed from directory" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting doctor profile" });
//   }
// };

// // -------------------------------------------------------------------
// // 🏢 5. SUPPLIER MANAGEMENT
// // -------------------------------------------------------------------

// const getAllSuppliers = async (req, res) => {
//   try {
//     const suppliers = await Supplier.find({}).sort({ name: 1 });
//     res.json(suppliers);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching suppliers" });
//   }
// };

// const createSupplier = async (req, res) => {
//   try {
//     const supplier = new Supplier(req.body);
//     const createdSupplier = await supplier.save();
//     res.status(201).json(createdSupplier);
//   } catch (error) {
//     res.status(400).json({ message: error.message || "Invalid supplier data" });
//   }
// };

// const updateSupplier = async (req, res) => {
//   try {
//     const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!supplier)
//       return res.status(404).json({ message: "Supplier not found" });
//     res.json(supplier);
//   } catch (error) {
//     res.status(400).json({ message: "Update failed" });
//   }
// };

// const deleteSupplier = async (req, res) => {
//   try {
//     const supplier = await Supplier.findById(req.params.id);
//     if (supplier) {
//       supplier.isActive = false;
//       await supplier.save();
//       res.json({ message: "Supplier deactivated" });
//     } else {
//       res.status(404).json({ message: "Supplier not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error deactivating supplier" });
//   }
// };

// // -------------------------------------------------------------------
// // 💊 6. INVENTORY & MEDICINES
// // -------------------------------------------------------------------

// const getAllMedicines = async (req, res) => {
//   try {
//     const medicines = await Medicine.find({}).sort({ name: 1 });
//     res.json(medicines);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching inventory data" });
//   }
// };

// const updateMedicine = async (req, res) => {
//   try {
//     const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!medicine)
//       return res.status(404).json({ message: "Medicine not found" });
//     res.json(medicine);
//   } catch (error) {
//     res.status(400).json({ message: "Update failed" });
//   }
// };

// // -------------------------------------------------------------------
// // 📦 7. PURCHASE ORDER LOGIC
// // -------------------------------------------------------------------

// const getAllPurchases = async (req, res) => {
//   try {
//     const purchases = await PurchaseOrder.find({})
//       .populate("supplier", "name")
//       .sort({ createdAt: -1 });
//     res.json(purchases);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching purchase records" });
//   }
// };

// const createPurchaseOrder = async (req, res) => {
//   try {
//     const { supplier, items, notes } = req.body;
//     const purchaseOrder = new PurchaseOrder({ supplier, items, notes });
//     const createdPO = await purchaseOrder.save();
//     res.status(201).json(createdPO);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// const updatePurchaseStatus = async (req, res) => {
//   try {
//     const po = await PurchaseOrder.findById(req.params.id);
//     if (!po) return res.status(404).json({ message: "PO not found" });

//     const oldStatus = po.status;
//     po.status = req.body.status || po.status;

//     if (oldStatus !== "Received" && po.status === "Received") {
//       for (const item of po.items) {
//         await Medicine.findByIdAndUpdate(item.medicine, {
//           $inc: { countInStock: item.quantity },
//         });
//       }
//       po.receivedAt = Date.now();
//     }

//     const updatedPO = await po.save();
//     res.json({ purchase: updatedPO });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update purchase order status" });
//   }
// };

// module.exports = {
//   getAdminStats,
//   getAllUsers, // ✅ Added
//   getAllOrders,
//   updateOrderStatus,
//   getAllSuppliers,
//   createSupplier,
//   updateSupplier,
//   deleteSupplier,
//   getAllMedicines,
//   updateMedicine, // ✅ Added
//   getAllDoctors,
//   createDoctor,
//   updateDoctor,
//   deleteDoctor,
//   getAllPurchases,
//   createPurchaseOrder,
//   updatePurchaseStatus,
// };

const Order = require("../models/Order");
const User = require("../models/User");
const Supplier = require("../models/Supplier");
const Medicine = require("../models/Medicine");
const PurchaseOrder = require("../models/PurchaseOrder");
const Doctor = require("../models/Doctor");

// -------------------------------------------------------------------
// 📊 1. DASHBOARD & ANALYTICS
// -------------------------------------------------------------------

// @desc    Get Admin Dashboard Stats (Real-time aggregation)
// @route   GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalMedicines = await Medicine.countDocuments();
    const totalDoctors = await Doctor.countDocuments();

    const paidOrders = await Order.find({ isPaid: true });
    const totalSales = paidOrders.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    const salesData = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedSalesData = salesData.map((item) => ({
      month: monthNames[item._id - 1],
      sales: item.sales,
    }));

    res.json({
      totalOrders,
      totalSales,
      totalCustomers,
      totalMedicines,
      totalDoctors,
      salesData:
        formattedSalesData.length > 0
          ? formattedSalesData
          : [{ month: "No Data", sales: 0 }],
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin stats" });
  }
};

// -------------------------------------------------------------------
// 👤 2. USER & STAFF MANAGEMENT
// -------------------------------------------------------------------

// @desc    Get all registered users (Admins, Doctors, Staff)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ role: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff registry" });
  }
};

// -------------------------------------------------------------------
// 🛒 3. ORDER MANAGEMENT (GLOBAL ORDERS)
// -------------------------------------------------------------------

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching global order registry" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    if (order.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// -------------------------------------------------------------------
// 🩺 4. DOCTOR MANAGEMENT
// -------------------------------------------------------------------

const getAllDoctors = async (req, res) => {
  try {
    // ✅ Include 'slots' and 'phone' to support Admin Edit Form
    const doctors = await Doctor.find({}).sort({ name: 1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medical staff" });
  }
};

const createDoctor = async (req, res) => {
  try {
    // ✅ Logic Enhancement: Check unique NMC before creation
    const existingNMC = await Doctor.findOne({ nmcNumber: req.body.nmcNumber });
    if (existingNMC) {
      return res
        .status(400)
        .json({ message: "Doctor with this NMC already exists" });
    }

    const doctor = new Doctor(req.body);
    const createdDoctor = await doctor.save();

    res.status(201).json(createdDoctor);
  } catch (error) {
    // ✅ Enhanced Error Handling for Mongoose Validation
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(400).json({ message: error.message || "Invalid doctor data" });
  }
};

const updateDoctor = async (req, res) => {
  try {
    // ✅ Basic duplicate check for NMC on update
    if (req.body.nmcNumber) {
      const existing = await Doctor.findOne({ nmcNumber: req.body.nmcNumber });
      if (existing && existing._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "NMC Number already taken" });
      }
    }

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ message: "Update failed: " + error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor removed from directory" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting doctor profile" });
  }
};

// -------------------------------------------------------------------
// 🏢 5. SUPPLIER MANAGEMENT
// -------------------------------------------------------------------

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({}).sort({ name: 1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching suppliers" });
  }
};

const createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const createdSupplier = await supplier.save();
    res.status(201).json(createdSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message || "Invalid supplier data" });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (supplier) {
      supplier.isActive = false;
      await supplier.save();
      res.json({ message: "Supplier deactivated" });
    } else {
      res.status(404).json({ message: "Supplier not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deactivating supplier" });
  }
};

// -------------------------------------------------------------------
// 💊 6. INVENTORY & MEDICINES
// -------------------------------------------------------------------

const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({}).sort({ name: 1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory data" });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!medicine)
      return res.status(404).json({ message: "Medicine not found" });
    res.json(medicine);
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
};

// -------------------------------------------------------------------
// 📦 7. PURCHASE ORDER LOGIC
// -------------------------------------------------------------------

const getAllPurchases = async (req, res) => {
  try {
    const purchases = await PurchaseOrder.find({})
      .populate("supplier", "name")
      .sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: "Error fetching purchase records" });
  }
};

const createPurchaseOrder = async (req, res) => {
  try {
    const { supplier, items, notes } = req.body;
    const purchaseOrder = new PurchaseOrder({ supplier, items, notes });
    const createdPO = await purchaseOrder.save();
    res.status(201).json(createdPO);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePurchaseStatus = async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) return res.status(404).json({ message: "PO not found" });

    const oldStatus = po.status;
    po.status = req.body.status || po.status;

    if (oldStatus !== "Received" && po.status === "Received") {
      for (const item of po.items) {
        await Medicine.findByIdAndUpdate(item.medicine, {
          $inc: { countInStock: item.quantity },
        });
      }
      po.receivedAt = Date.now();
    }

    const updatedPO = await po.save();
    res.json({ purchase: updatedPO });
  } catch (error) {
    res.status(500).json({ message: "Failed to update purchase order status" });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getAllMedicines,
  updateMedicine,
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAllPurchases,
  createPurchaseOrder,
  updatePurchaseStatus,
};
