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
//     // ✅ Include 'slots' and 'phone' to support Admin Edit Form
//     const doctors = await Doctor.find({}).sort({ name: 1 });
//     res.json(doctors);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching medical staff" });
//   }
// };

// const createDoctor = async (req, res) => {
//   try {
//     // ✅ Logic Enhancement: Check unique NMC before creation
//     const existingNMC = await Doctor.findOne({ nmcNumber: req.body.nmcNumber });
//     if (existingNMC) {
//       return res
//         .status(400)
//         .json({ message: "Doctor with this NMC already exists" });
//     }

//     const doctor = new Doctor(req.body);
//     const createdDoctor = await doctor.save();

//     res.status(201).json(createdDoctor);
//   } catch (error) {
//     // ✅ Enhanced Error Handling for Mongoose Validation
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((val) => val.message);
//       return res.status(400).json({ message: messages.join(", ") });
//     }
//     res.status(400).json({ message: error.message || "Invalid doctor data" });
//   }
// };

// const updateDoctor = async (req, res) => {
//   try {
//     // ✅ Basic duplicate check for NMC on update
//     if (req.body.nmcNumber) {
//       const existing = await Doctor.findOne({ nmcNumber: req.body.nmcNumber });
//       if (existing && existing._id.toString() !== req.params.id) {
//         return res.status(400).json({ message: "NMC Number already taken" });
//       }
//     }

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
//   getAllUsers,
//   getAllOrders,
//   updateOrderStatus,
//   getAllSuppliers,
//   createSupplier,
//   updateSupplier,
//   deleteSupplier,
//   getAllMedicines,
//   updateMedicine,
//   getAllDoctors,
//   createDoctor,
//   updateDoctor,
//   deleteDoctor,
//   getAllPurchases,
//   createPurchaseOrder,
//   updatePurchaseStatus,
// };

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

//     // ✅ Added: Count total suppliers
//     const totalSuppliers = await Supplier.countDocuments();

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
//       totalSuppliers, // ✅ Included in response
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
//     // ✅ Include 'slots' and 'phone' to support Admin Edit Form
//     const doctors = await Doctor.find({}).sort({ name: 1 });
//     res.json(doctors);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching medical staff" });
//   }
// };

// const createDoctor = async (req, res) => {
//   try {
//     // ✅ Logic Enhancement: Check unique NMC before creation
//     const existingNMC = await Doctor.findOne({ nmcNumber: req.body.nmcNumber });
//     if (existingNMC) {
//       return res
//         .status(400)
//         .json({ message: "Doctor with this NMC already exists" });
//     }

//     const doctor = new Doctor(req.body);
//     const createdDoctor = await doctor.save();

//     res.status(201).json(createdDoctor);
//   } catch (error) {
//     // ✅ Enhanced Error Handling for Mongoose Validation
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((val) => val.message);
//       return res.status(400).json({ message: messages.join(", ") });
//     }
//     res.status(400).json({ message: error.message || "Invalid doctor data" });
//   }
// };

// const updateDoctor = async (req, res) => {
//   try {
//     // ✅ Basic duplicate check for NMC on update
//     if (req.body.nmcNumber) {
//       const existing = await Doctor.findOne({ nmcNumber: req.body.nmcNumber });
//       if (existing && existing._id.toString() !== req.params.id) {
//         return res.status(400).json({ message: "NMC Number already taken" });
//       }
//     }

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
//   getAllUsers,
//   getAllOrders,
//   updateOrderStatus,
//   getAllSuppliers,
//   createSupplier,
//   updateSupplier,
//   deleteSupplier,
//   getAllMedicines,
//   updateMedicine,
//   getAllDoctors,
//   createDoctor,
//   updateDoctor,
//   deleteDoctor,
//   getAllPurchases,
//   createPurchaseOrder,
//   updatePurchaseStatus,
// };

// const Order = require("../models/Order");
// const User = require("../models/User");
// const Supplier = require("../models/Supplier");
// const Medicine = require("../models/Medicine");
// const PurchaseOrder = require("../models/PurchaseOrder");
// const Doctor = require("../models/Doctor");

// // -------------------------------------------------------------------
// // 📊 1. DASHBOARD & ANALYTICS
// // -------------------------------------------------------------------

// // @desc    Get Admin Dashboard Stats (Real-time aggregation with Date Filter)
// // @route   GET /api/admin/stats?range=30
// const getAdminStats = async (req, res) => {
//   try {
//     // 1. Determine Date Filter from Query
//     const { range } = req.query;
//     const days = parseInt(range) || 30; // Default to 30 days

//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);
//     startDate.setHours(0, 0, 0, 0);

//     // 2. Fetch FILTERED Stats (Revenue & Orders within range)
//     const orderStats = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startDate },
//           isPaid: true,
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: "$totalPrice" },
//           totalOrders: { $sum: 1 },
//         },
//       },
//     ]);

//     const revenue = orderStats.length > 0 ? orderStats[0].totalRevenue : 0;
//     const orders = orderStats.length > 0 ? orderStats[0].totalOrders : 0;

//     // 3. Fetch Sales Graph Data (Grouped by Day)
//     const salesData = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startDate },
//           isPaid: true,
//         },
//       },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           sales: { $sum: "$totalPrice" },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     // 4. Fetch All-Time Snapshots (Inventory/Users don't depend on date range)
//     const totalCustomers = await User.countDocuments({ role: "customer" });
//     const totalMedicines = await Medicine.countDocuments();
//     const totalDoctors = await Doctor.countDocuments();
//     const totalSuppliers = await Supplier.countDocuments();

//     // Response mapped for the new Report UI
//     res.json({
//       revenue, // Filtered Revenue
//       orders, // Filtered Order Count
//       users: totalCustomers,
//       doctors: totalDoctors,
//       medicines: totalMedicines,
//       salesData, // Graph Data

//       // Keeping legacy keys for backward compatibility
//       totalOrders: orders,
//       totalSales: revenue,
//       totalCustomers,
//       totalMedicines,
//       totalDoctors,
//       totalSuppliers,
//     });
//   } catch (error) {
//     console.error(error);
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
//     // ✅ Include 'slots' and 'phone' to support Admin Edit Form
//     const doctors = await Doctor.find({}).sort({ name: 1 });
//     res.json(doctors);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching medical staff" });
//   }
// };

// const createDoctor = async (req, res) => {
//   try {
//     // ✅ Logic Enhancement: Check unique NMC before creation
//     const existingNMC = await Doctor.findOne({ nmcNumber: req.body.nmcNumber });
//     if (existingNMC) {
//       return res
//         .status(400)
//         .json({ message: "Doctor with this NMC already exists" });
//     }

//     const doctor = new Doctor(req.body);
//     const createdDoctor = await doctor.save();

//     res.status(201).json(createdDoctor);
//   } catch (error) {
//     // ✅ Enhanced Error Handling for Mongoose Validation
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((val) => val.message);
//       return res.status(400).json({ message: messages.join(", ") });
//     }
//     res.status(400).json({ message: error.message || "Invalid doctor data" });
//   }
// };

// const updateDoctor = async (req, res) => {
//   try {
//     // ✅ Basic duplicate check for NMC on update
//     if (req.body.nmcNumber) {
//       const existing = await Doctor.findOne({ nmcNumber: req.body.nmcNumber });
//       if (existing && existing._id.toString() !== req.params.id) {
//         return res.status(400).json({ message: "NMC Number already taken" });
//       }
//     }

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
//   getAllUsers,
//   getAllOrders,
//   updateOrderStatus,
//   getAllSuppliers,
//   createSupplier,
//   updateSupplier,
//   deleteSupplier,
//   getAllMedicines,
//   updateMedicine,
//   getAllDoctors,
//   createDoctor,
//   updateDoctor,
//   deleteDoctor,
//   getAllPurchases,
//   createPurchaseOrder,
//   updatePurchaseStatus,
// };

// const Order = require("../models/Order");
// const User = require("../models/User");
// const Supplier = require("../models/Supplier");
// const Medicine = require("../models/Medicine");
// const PurchaseOrder = require("../models/PurchaseOrder");
// const Doctor = require("../models/Doctor");

// // ✅ NEW IMPORTS REQUIRED FOR DOCTOR OTP REGISTRATION
// const bcrypt = require("bcryptjs");
// const sendEmail = require("../utils/sendEmail");
// const mongoose = require("mongoose");

// // ✅ TEMPORARY OTP SCHEMA (Auto-deletes after 10 mins)
// const doctorOtpSchema = new mongoose.Schema({
//   email: String,
//   otp: String,
//   createdAt: { type: Date, default: Date.now, expires: 600 },
// });
// const DoctorOtp =
//   mongoose.models.DoctorOtp || mongoose.model("DoctorOtp", doctorOtpSchema);

// // -------------------------------------------------------------------
// // 📊 1. DASHBOARD & ANALYTICS
// // -------------------------------------------------------------------

// // @desc    Get Admin Dashboard Stats (Real-time aggregation with Date Filter)
// // @route   GET /api/admin/stats?range=30
// const getAdminStats = async (req, res) => {
//   try {
//     // 1. Determine Date Filter from Query
//     const { range } = req.query;
//     const days = parseInt(range) || 30; // Default to 30 days

//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);
//     startDate.setHours(0, 0, 0, 0);

//     // 2. Fetch FILTERED Stats (Revenue & Orders within range)
//     const orderStats = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startDate },
//           isPaid: true,
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: "$totalPrice" },
//           totalOrders: { $sum: 1 },
//         },
//       },
//     ]);

//     const revenue = orderStats.length > 0 ? orderStats[0].totalRevenue : 0;
//     const orders = orderStats.length > 0 ? orderStats[0].totalOrders : 0;

//     // 3. Fetch Sales Graph Data (Grouped by Day)
//     const salesData = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startDate },
//           isPaid: true,
//         },
//       },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           sales: { $sum: "$totalPrice" },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     // 4. Fetch All-Time Snapshots (Inventory/Users don't depend on date range)
//     const totalCustomers = await User.countDocuments({ role: "customer" });
//     const totalMedicines = await Medicine.countDocuments();
//     const totalDoctors = await Doctor.countDocuments();
//     const totalSuppliers = await Supplier.countDocuments();

//     // Response mapped for the new Report UI
//     res.json({
//       revenue, // Filtered Revenue
//       orders, // Filtered Order Count
//       users: totalCustomers,
//       doctors: totalDoctors,
//       medicines: totalMedicines,
//       salesData, // Graph Data

//       // Keeping legacy keys for backward compatibility
//       totalOrders: orders,
//       totalSales: revenue,
//       totalCustomers,
//       totalMedicines,
//       totalDoctors,
//       totalSuppliers,
//     });
//   } catch (error) {
//     console.error(error);
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
//     // ✅ Include 'slots' and 'phone' to support Admin Edit Form
//     const doctors = await Doctor.find({}).sort({ name: 1 });
//     res.json(doctors);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching medical staff" });
//   }
// };

// const createDoctor = async (req, res) => {
//   try {
//     // ✅ Logic Enhancement: Check unique NMC before creation
//     const existingNMC = await Doctor.findOne({ nmcNumber: req.body.nmcNumber });
//     if (existingNMC) {
//       return res
//         .status(400)
//         .json({ message: "Doctor with this NMC already exists" });
//     }

//     const doctor = new Doctor(req.body);
//     const createdDoctor = await doctor.save();

//     res.status(201).json(createdDoctor);
//   } catch (error) {
//     // ✅ Enhanced Error Handling for Mongoose Validation
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((val) => val.message);
//       return res.status(400).json({ message: messages.join(", ") });
//     }
//     res.status(400).json({ message: error.message || "Invalid doctor data" });
//   }
// };

// // ✅ NEW: Admin requests OTP to register a doctor securely
// const requestDoctorOtp = async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res
//         .status(400)
//         .json({ message: "Email is already registered in the system." });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     await DoctorOtp.findOneAndDelete({ email });
//     await DoctorOtp.create({ email, otp });

//     await sendEmail({
//       email,
//       subject: "Action Required: Doctor Registration OTP",
//       message: `
//         <h3>Hello Dr. ${name},</h3>
//         <p>An administrator is currently creating your Clinical Account on Smart Pharmacy.</p>
//         <p>Please provide the following One-Time Password (OTP) to your administrator to verify your email address:</p>
//         <h2 style="color: #2563eb; letter-spacing: 2px;">${otp}</h2>
//         <p>This code expires in 10 minutes.</p>
//       `,
//     });

//     res
//       .status(200)
//       .json({ message: "OTP sent successfully to the doctor's email." });
//   } catch (error) {
//     console.error("Email error:", error);
//     res
//       .status(500)
//       .json({
//         message: "Failed to send OTP email. Check email configuration.",
//       });
//   }
// };

// // ✅ NEW: Admin verifies OTP and creates both Auth (User) and Profile (Doctor) records
// const verifyAndCreateDoctor = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       speciality,
//       nmcNumber,
//       phone,
//       experience,
//       consultationFee,
//       isAvailable,
//       slots,
//       otp,
//     } = req.body;

//     // 1. Verify OTP
//     const otpRecord = await DoctorOtp.findOne({ email });
//     if (!otpRecord || otpRecord.otp !== otp) {
//       return res
//         .status(400)
//         .json({ message: "Invalid or expired OTP. Please request a new one." });
//     }

//     // 2. Generate Temporary Password
//     const tempPassword = Math.random().toString(36).slice(-8);
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(tempPassword, salt);

//     // 3. Handle Image Upload
//     let imagePath = "none";
//     if (req.file) {
//       imagePath = `/uploads/${req.file.filename}`;
//     }

//     // 4. Create User Account (Allows them to log in)
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "doctor",
//       speciality: speciality || "General Physician",
//       mustChangePassword: true, // Forces password change on first login
//     });

//     // 5. Create Doctor Profile (Stores clinic details/slots for the directory)
//     const doctorProfile = new Doctor({
//       name,
//       email,
//       speciality: speciality || "General Physician",
//       nmcNumber,
//       phone,
//       experience: experience || 0,
//       consultationFee: consultationFee || 500,
//       isAvailable: isAvailable === "true" || isAvailable === true,
//       slots: slots ? JSON.parse(slots) : [],
//       image: imagePath,
//       userId: newUser._id, // Links profile to the login account
//     });

//     await doctorProfile.save();

//     // 6. Clean up OTP and email credentials
//     await DoctorOtp.findOneAndDelete({ email });

//     await sendEmail({
//       email: newUser.email,
//       subject: "Welcome to Smart Pharmacy - Account Ready",
//       message: `
//         <h3>Welcome aboard, Dr. ${name}!</h3>
//         <p>Your clinical account has been successfully created and verified.</p>
//         <p><strong>Login Email:</strong> ${email}</p>
//         <p><strong>Temporary Password:</strong> ${tempPassword}</p>
//         <p>Log in immediately to set your permanent password and access your dashboard.</p>
//       `,
//     });

//     res.status(201).json({ message: "Doctor created successfully!" });
//   } catch (error) {
//     console.error(error);
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((val) => val.message);
//       return res.status(400).json({ message: messages.join(", ") });
//     }
//     res.status(400).json({ message: error.message || "Invalid user data" });
//   }
// };

// const updateDoctor = async (req, res) => {
//   try {
//     // ✅ Basic duplicate check for NMC on update
//     if (req.body.nmcNumber) {
//       const existing = await Doctor.findOne({ nmcNumber: req.body.nmcNumber });
//       if (existing && existing._id.toString() !== req.params.id) {
//         return res.status(400).json({ message: "NMC Number already taken" });
//       }
//     }

//     // ✅ Handle image updates if a new file is uploaded
//     let updateData = { ...req.body };
//     if (req.file) {
//       updateData.image = `/uploads/${req.file.filename}`;
//     }

//     // Parse slots if sent as string from FormData
//     if (updateData.slots && typeof updateData.slots === "string") {
//       updateData.slots = JSON.parse(updateData.slots);
//     }

//     const doctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, {
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
//   getAllUsers,
//   getAllOrders,
//   updateOrderStatus,
//   getAllSuppliers,
//   createSupplier,
//   updateSupplier,
//   deleteSupplier,
//   getAllMedicines,
//   updateMedicine,
//   getAllDoctors,
//   createDoctor,
//   requestDoctorOtp, // ✅ Exported New Route
//   verifyAndCreateDoctor, // ✅ Exported New Route
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

// ✅ NEW IMPORTS REQUIRED FOR DOCTOR OTP REGISTRATION
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const mongoose = require("mongoose");

// ✅ TEMPORARY OTP SCHEMA (Auto-deletes after 10 mins)
const doctorOtpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 600 },
});
const DoctorOtp =
  mongoose.models.DoctorOtp || mongoose.model("DoctorOtp", doctorOtpSchema);

// -------------------------------------------------------------------
// 📊 1. DASHBOARD & ANALYTICS
// -------------------------------------------------------------------

// @desc    Get Admin Dashboard Stats (Real-time aggregation with Date Filter)
// @route   GET /api/admin/stats?range=30
const getAdminStats = async (req, res) => {
  try {
    // 1. Determine Date Filter from Query
    const { range } = req.query;
    const days = parseInt(range) || 30; // Default to 30 days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // 2. Fetch FILTERED Stats (Revenue & Orders within range)
    const orderStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isPaid: true,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const revenue = orderStats.length > 0 ? orderStats[0].totalRevenue : 0;
    const orders = orderStats.length > 0 ? orderStats[0].totalOrders : 0;

    // 3. Fetch Sales Graph Data (Grouped by Day)
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isPaid: true,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 4. Fetch All-Time Snapshots (Inventory/Users don't depend on date range)
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalMedicines = await Medicine.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();

    // Response mapped for the new Report UI
    res.json({
      revenue, // Filtered Revenue
      orders, // Filtered Order Count
      users: totalCustomers,
      doctors: totalDoctors,
      medicines: totalMedicines,
      salesData, // Graph Data

      // Keeping legacy keys for backward compatibility
      totalOrders: orders,
      totalSales: revenue,
      totalCustomers,
      totalMedicines,
      totalDoctors,
      totalSuppliers,
    });
  } catch (error) {
    console.error(error);
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

// ✅ UPDATED: Auto-Syncs new doctors created via User Management
const getAllDoctors = async (req, res) => {
  try {
    // 1. Fetch existing doctor profiles
    let doctors = await Doctor.find({}).sort({ name: 1 });

    // 2. Fetch ALL users who have the role 'doctor'
    const doctorUsers = await User.find({ role: "doctor" });

    // 3. AUTO-SYNC: Check if any doctor user is missing a profile
    let addedNewProfile = false;

    for (const user of doctorUsers) {
      const profileExists = doctors.some((doc) => doc.email === user.email);

      // If they exist in Users but NOT in Doctors, create a blank profile for them automatically!
      if (!profileExists) {
        const newProfile = await Doctor.create({
          name: user.name,
          email: user.email,
          userId: user._id, // Link to login account
          speciality: "Pending Setup",
          nmcNumber: "PENDING-" + Math.floor(Math.random() * 10000), // Temporary placeholder
          phone: user.phone || "",
          experience: 0,
          consultationFee: 500,
          isAvailable: false, // Keep them unavailable until admin edits their profile
          slots: [],
        });

        doctors.push(newProfile);
        addedNewProfile = true;
      }
    }

    // Re-sort the list if new profiles were synced
    if (addedNewProfile) {
      doctors.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json(doctors);
  } catch (error) {
    console.error("Error auto-syncing doctors:", error);
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

// ✅ NEW: Admin requests OTP to register a doctor securely
const requestDoctorOtp = async (req, res) => {
  try {
    const { name, email } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Email is already registered in the system." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await DoctorOtp.findOneAndDelete({ email });
    await DoctorOtp.create({ email, otp });

    await sendEmail({
      email,
      subject: "Action Required: Doctor Registration OTP",
      message: `
        <h3>Hello Dr. ${name},</h3>
        <p>An administrator is currently creating your Clinical Account on Smart Pharmacy.</p>
        <p>Please provide the following One-Time Password (OTP) to your administrator to verify your email address:</p>
        <h2 style="color: #2563eb; letter-spacing: 2px;">${otp}</h2>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    res
      .status(200)
      .json({ message: "OTP sent successfully to the doctor's email." });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      message: "Failed to send OTP email. Check email configuration.",
    });
  }
};

// ✅ NEW: Admin verifies OTP and creates both Auth (User) and Profile (Doctor) records
const verifyAndCreateDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      speciality,
      nmcNumber,
      phone,
      experience,
      consultationFee,
      isAvailable,
      slots,
      otp,
    } = req.body;

    // 1. Verify OTP
    const otpRecord = await DoctorOtp.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP. Please request a new one." });
    }

    // 2. Generate Temporary Password
    const tempPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // 3. Handle Image Upload
    let imagePath = "none";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    // 4. Create User Account (Allows them to log in)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      speciality: speciality || "General Physician",
      mustChangePassword: true, // Forces password change on first login
    });

    // 5. Create Doctor Profile (Stores clinic details/slots for the directory)
    const doctorProfile = new Doctor({
      name,
      email,
      speciality: speciality || "General Physician",
      nmcNumber,
      phone,
      experience: experience || 0,
      consultationFee: consultationFee || 500,
      isAvailable: isAvailable === "true" || isAvailable === true,
      slots: slots ? JSON.parse(slots) : [],
      image: imagePath,
      userId: newUser._id, // Links profile to the login account
    });

    await doctorProfile.save();

    // 6. Clean up OTP and email credentials
    await DoctorOtp.findOneAndDelete({ email });

    await sendEmail({
      email: newUser.email,
      subject: "Welcome to Smart Pharmacy - Account Ready",
      message: `
        <h3>Welcome aboard, Dr. ${name}!</h3>
        <p>Your clinical account has been successfully created and verified.</p>
        <p><strong>Login Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p>Log in immediately to set your permanent password and access your dashboard.</p>
      `,
    });

    res.status(201).json({ message: "Doctor created successfully!" });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(400).json({ message: error.message || "Invalid user data" });
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

    // ✅ Handle image updates if a new file is uploaded
    let updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Parse slots if sent as string from FormData
    if (updateData.slots && typeof updateData.slots === "string") {
      updateData.slots = JSON.parse(updateData.slots);
    }

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ message: "Update failed: " + error.message });
  }
};

// ✅ UPDATED: Deletes BOTH the clinical profile and the user login account!
const deleteDoctor = async (req, res) => {
  try {
    // 1. Delete the clinical profile
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // 2. Delete the associated user login credentials to prevent ghost accounts
    await User.findOneAndDelete({ email: doctor.email });

    res.json({
      message: "Doctor profile and login credentials removed successfully",
    });
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
  requestDoctorOtp, // ✅ Exported New Route
  verifyAndCreateDoctor, // ✅ Exported New Route
  updateDoctor,
  deleteDoctor,
  getAllPurchases,
  createPurchaseOrder,
  updatePurchaseStatus,
};
