// const express = require("express");
// const bcrypt = require("bcryptjs");
// const { body, validationResult } = require("express-validator");

// const router = express.Router();

// // Models
// const User = require("../models/User");
// const Medicine = require("../models/Medicine");
// const Order = require("../models/Order");
// const Doctor = require("../models/Doctor");
// const Supplier = require("../models/Supplier"); // NEW
// const PurchaseOrder = require("../models/PurchaseOrder");
// const Appointment = require("../models/Appointment");

// // Middleware
// const authenticateToken = require("../middleware/auth");
// const isAdmin = require("../middleware/isAdmin");

// // Valid roles
// const VALID_ROLES = ["admin", "pharmacist", "staff", "customer"];

// /**
//  * GET /api/admin/dashboard
//  * High‑level stats + low stock + optional sales aggregation
//  */
// router.get("/dashboard", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const [usersCount, medicinesCount, doctorsCount, orders] =
//       await Promise.all([
//         User.countDocuments(),
//         Medicine.countDocuments(),
//         Doctor.countDocuments(),
//         Order.find().lean(),
//       ]);

//     const ordersCount = orders.length;
//     const revenue = orders.reduce(
//       (sum, order) => sum + (order.totalPrice || order.total || 0),
//       0
//     );

//     // Monthly sales from orders.createdAt
//     const salesDataMap = {};
//     orders.forEach((order) => {
//       const created = order.createdAt || new Date();
//       const month = new Date(created).toLocaleString("default", {
//         month: "short",
//       });
//       const amount = order.totalPrice || order.total || 0;
//       salesDataMap[month] = (salesDataMap[month] || 0) + amount;
//     });
//     const salesData = Object.keys(salesDataMap).map((m) => ({
//       month: m,
//       sales: salesDataMap[m],
//     }));

//     // low stock: quantity or stock < 20
//     const lowStock = await Medicine.find({
//       $or: [{ quantity: { $lt: 20 } }, { stock: { $lt: 20 } }],
//     })
//       .sort({ quantity: 1 })
//       .limit(8)
//       .lean();

//     res.json({
//       stats: {
//         users: usersCount,
//         medicines: medicinesCount,
//         doctors: doctorsCount,
//         orders: ordersCount,
//         revenue,
//         salesData,
//       },
//       lowStock,
//     });
//   } catch (err) {
//     console.error("Admin dashboard error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * -------- DOCTORS CRUD ----------
//  */

// // GET /api/admin/doctors
// router.get("/doctors", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const doctors = await Doctor.find().sort({ name: 1 }).lean();
//     res.json(doctors);
//   } catch (err) {
//     console.error("Get doctors error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST /api/admin/doctors
// router.post(
//   "/doctors",
//   authenticateToken,
//   isAdmin,
//   [
//     body("name").trim().notEmpty().withMessage("Name is required"),
//     body("speciality").trim().notEmpty().withMessage("Speciality is required"),
//     body("nmcNumber").trim().notEmpty().withMessage("NMC number is required"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const { name, speciality, nmcNumber } = req.body;

//       const existing = await Doctor.findOne({ nmcNumber });
//       if (existing) {
//         return res
//           .status(400)
//           .json({ message: "Doctor with this NMC number already exists" });
//       }

//       const doctor = await Doctor.create({ name, speciality, nmcNumber });
//       res.status(201).json({ message: "Doctor created", doctor });
//     } catch (err) {
//       console.error("Create doctor error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // PUT /api/admin/doctors/:id
// router.put("/doctors/:id", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });
//     res.json({ message: "Doctor updated", doctor });
//   } catch (err) {
//     console.error("Update doctor error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // DELETE /api/admin/doctors/:id
// router.delete("/doctors/:id", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const deleted = await Doctor.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Doctor not found" });
//     res.json({ message: "Doctor deleted" });
//   } catch (err) {
//     console.error("Delete doctor error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * -------- APPOINTMENT MANAGEMENT ----------
//  */

// // GET /api/admin/appointments
// router.get("/appointments", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const { doctor, customer, date, status, page = 1, limit = 20 } = req.query;

//     const query = {};
//     if (doctor) query.doctor = doctor;
//     if (customer) query.customer = customer;
//     if (date)
//       query.date = {
//         $gte: new Date(date),
//         $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
//       };
//     if (status) query.status = status;

//     const [appointments, total] = await Promise.all([
//       Appointment.find(query)
//         .populate("doctor", "name speciality nmcNumber")
//         .populate("customer", "name email phone")
//         .sort({ date: -1, createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(Number(limit))
//         .lean(),
//       Appointment.countDocuments(query),
//     ]);

//     res.json({
//       appointments,
//       pagination: {
//         page: Number(page),
//         limit: Number(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     console.error("Get appointments error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // PUT /api/admin/appointments/:id/status
// router.put(
//   "/appointments/:id/status",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     try {
//       const { status } = req.body;
//       if (
//         !["pending", "confirmed", "completed", "cancelled"].includes(status)
//       ) {
//         return res.status(400).json({ message: "Invalid status" });
//       }

//       const appointment = await Appointment.findByIdAndUpdate(
//         req.params.id,
//         { status },
//         { new: true }
//       ).populate("doctor customer");

//       if (!appointment) {
//         return res.status(404).json({ message: "Appointment not found" });
//       }

//       res.json({ message: "Appointment status updated", appointment });
//     } catch (err) {
//       console.error("Update appointment status error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// /**
//  * -------- MEDICINES CRUD ----------
//  */

// // GET /api/admin/medicines
// router.get("/medicines", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const medicines = await Medicine.find().lean();
//     res.json(medicines);
//   } catch (err) {
//     console.error("Get medicines error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST /api/admin/medicines
// router.post(
//   "/medicines",
//   authenticateToken,
//   isAdmin,
//   [
//     body("name").trim().notEmpty().withMessage("Name is required"),
//     body("price").isNumeric().withMessage("Price must be a number"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const {
//         name,
//         manufacturer,
//         price,
//         quantity,
//         stock,
//         category,
//         expiryDate,
//       } = req.body;

//       const medicine = await Medicine.create({
//         name,
//         manufacturer,
//         price,
//         quantity: quantity ?? stock ?? 0,
//         stock: stock ?? quantity ?? 0,
//         category,
//         expiryDate,
//       });

//       res.status(201).json({ message: "Medicine added", medicine });
//     } catch (err) {
//       console.error("Add medicine error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // PUT /api/admin/medicines/:id
// router.put("/medicines/:id", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!medicine) {
//       return res.status(404).json({ message: "Medicine not found" });
//     }
//     res.json({ message: "Medicine updated", medicine });
//   } catch (err) {
//     console.error("Update medicine error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // DELETE /api/admin/medicines/:id
// router.delete(
//   "/medicines/:id",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     try {
//       const deleted = await Medicine.findByIdAndDelete(req.params.id);
//       if (!deleted) {
//         return res.status(404).json({ message: "Medicine not found" });
//       }
//       res.json({ message: "Medicine deleted" });
//     } catch (err) {
//       console.error("Delete medicine error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// /**
//  * -------- ORDERS VIEW / STATUS ----------
//  */

// // GET /api/admin/orders
// router.get("/orders", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user", "-password")
//       .populate("items.medicine")
//       .lean();
//     res.json(orders);
//   } catch (err) {
//     console.error("Get orders error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // PUT /api/admin/orders/:id/status
// router.put(
//   "/orders/:id/status",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     const { status } = req.body;
//     if (!status) return res.status(400).json({ message: "Status is required" });

//     try {
//       const order = await Order.findByIdAndUpdate(
//         req.params.id,
//         { status },
//         { new: true }
//       );
//       if (!order) {
//         return res.status(404).json({ message: "Order not found" });
//       }
//       res.json({ message: "Order status updated", order });
//     } catch (err) {
//       console.error("Update order status error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// /**
//  * -------- USERS MANAGEMENT ----------
//  */

// // GET /api/admin/users
// router.get("/users", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const users = await User.find().select("-password").lean();
//     res.json(users);
//   } catch (err) {
//     console.error("Get users error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST /api/admin/users
// router.post("/users", authenticateAdmin, async (req, res) => {
//   try {
//     const { name, email, phone, password, role } = req.body;

//     // Only allow staff & pharmacist from this screen
//     const allowedRoles = ["staff", "pharmacist"];
//     if (!allowedRoles.includes(role)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid role for this endpoint" });
//     }

//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ message: "Email already in use" });
//     }

//     const passwordHash = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       phone,
//       role,
//       passwordHash,
//     });

//     res.status(201).json({
//       message: "User created",
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("admin create user error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // PUT /api/admin/users/:id/role
// router.put("/users/:id/role", authenticateToken, isAdmin, async (req, res) => {
//   const { role } = req.body;
//   if (!VALID_ROLES.includes(role)) {
//     return res.status(400).json({ message: "Invalid role" });
//   }

//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { role },
//       { new: true }
//     ).select("-password");

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json({ message: "User role updated", user });
//   } catch (err) {
//     console.error("Update user role error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * -------- SUPPLIERS CRUD ----------
//  */

// // GET /api/admin/suppliers
// router.get("/suppliers", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const suppliers = await Supplier.find().sort({ name: 1 }).lean();
//     res.json(suppliers);
//   } catch (err) {
//     console.error("Get suppliers error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST /api/admin/suppliers
// router.post(
//   "/suppliers",
//   authenticateToken,
//   isAdmin,
//   [
//     body("name").trim().notEmpty().withMessage("Name is required"),
//     body("email").optional().isEmail().withMessage("Invalid email"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const supplier = await Supplier.create({
//         name: req.body.name,
//         contactPerson: req.body.contactPerson,
//         phone: req.body.phone,
//         email: req.body.email,
//         address: req.body.address,
//         gstOrPan: req.body.gstOrPan,
//         notes: req.body.notes,
//         isActive: req.body.isActive !== false,
//       });
//       res.status(201).json({ message: "Supplier created", supplier });
//     } catch (err) {
//       console.error("Create supplier error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // PUT /api/admin/suppliers/:id
// router.put(
//   "/suppliers/:id",
//   authenticateToken,
//   isAdmin,
//   [
//     body("name")
//       .optional()
//       .trim()
//       .notEmpty()
//       .withMessage("Name cannot be empty"),
//     body("email").optional().isEmail().withMessage("Invalid email"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const supplier = await Supplier.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true }
//       );
//       if (!supplier) {
//         return res.status(404).json({ message: "Supplier not found" });
//       }
//       res.json({ message: "Supplier updated", supplier });
//     } catch (err) {
//       console.error("Update supplier error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // DELETE /api/admin/suppliers/:id  (soft delete)
// router.delete(
//   "/suppliers/:id",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     try {
//       const supplier = await Supplier.findByIdAndUpdate(
//         req.params.id,
//         { isActive: false },
//         { new: true }
//       );
//       if (!supplier) {
//         return res.status(404).json({ message: "Supplier not found" });
//       }
//       res.json({ message: "Supplier deactivated", supplier });
//     } catch (err) {
//       console.error("Delete supplier error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // GET /api/admin/purchases  (list all purchase orders)
// router.get("/purchases", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const purchases = await PurchaseOrder.find()
//       .populate("supplier")
//       .populate("items.medicine")
//       .sort({ orderedAt: -1 })
//       .lean();

//     res.json(purchases);
//   } catch (err) {
//     console.error("Get purchases error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST /api/admin/purchases  (create new purchase order)
// router.post(
//   "/purchases",
//   authenticateToken,
//   isAdmin,
//   [
//     body("supplier").notEmpty().withMessage("Supplier is required"),
//     body("items")
//       .isArray({ min: 1 })
//       .withMessage("At least one item is required"),
//     body("items.*.medicine")
//       .notEmpty()
//       .withMessage("Medicine id is required for each item"),
//     body("items.*.quantity")
//       .isNumeric()
//       .withMessage("Quantity must be a number"),
//     body("items.*.costPrice")
//       .isNumeric()
//       .withMessage("Cost price must be a number"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const { supplier, items, notes } = req.body;

//       const totalCost = items.reduce(
//         (sum, it) => sum + Number(it.costPrice || 0) * Number(it.quantity || 0),
//         0
//       );

//       const po = await PurchaseOrder.create({
//         supplier,
//         items,
//         status: "Pending",
//         totalCost,
//         orderedAt: new Date(),
//         createdBy: req.user?.id,
//         notes,
//       });

//       res.status(201).json({ message: "Purchase order created", purchase: po });
//     } catch (err) {
//       console.error("Create purchase error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// /**
//  * -------- PURCHASE ORDERS ----------
//  */

// // PUT /api/admin/purchases/:id/status  (update status, receive stock)
// router.put(
//   "/purchases/:id/status",
//   authenticateToken,
//   isAdmin,
//   [
//     body("status")
//       .isIn(["Pending", "Ordered", "Received", "Cancelled"])
//       .withMessage("Invalid status"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { status } = req.body;

//     try {
//       const po = await PurchaseOrder.findById(req.params.id);
//       if (!po) {
//         return res.status(404).json({ message: "Purchase order not found" });
//       }

//       // If moving to Received and was not received before, update stock
//       const isReceiving = status === "Received" && po.status !== "Received";

//       po.status = status;
//       if (isReceiving) {
//         po.receivedAt = new Date();
//       }

//       await po.save();

//       if (isReceiving) {
//         // Increment medicine stock/quantity for each item
//         for (const item of po.items) {
//           await Medicine.findByIdAndUpdate(
//             item.medicine,
//             {
//               $inc: {
//                 quantity: item.quantity,
//                 stock: item.quantity,
//               },
//             },
//             { new: true }
//           );
//         }
//       }

//       const populated = await PurchaseOrder.findById(po._id)
//         .populate("supplier")
//         .populate("items.medicine")
//         .lean();

//       res.json({
//         message: "Purchase order status updated",
//         purchase: populated,
//       });
//     } catch (err) {
//       console.error("Update purchase status error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// /**
//  * -------- GLOBAL SEARCH ----------
//  */

// // GET /api/admin/search?q=paracetamol
// router.get("/search", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const { q, type, limit = 10 } = req.query;

//     if (!q || q.trim().length < 2) {
//       return res.json({ results: [] });
//     }

//     const searchTerm = q.trim().toLowerCase();

//     // Multi-collection search
//     const [medicines, suppliers, doctors, users, orders] = await Promise.all([
//       Medicine.find({
//         $or: [
//           { name: { $regex: searchTerm, $options: "i" } },
//           { manufacturer: { $regex: searchTerm, $options: "i" } },
//           { category: { $regex: searchTerm, $options: "i" } },
//         ],
//       })
//         .select("name manufacturer category price quantity stock")
//         .limit(Number(limit))
//         .lean(),

//       Supplier.find({
//         $or: [
//           { name: { $regex: searchTerm, $options: "i" } },
//           { contactPerson: { $regex: searchTerm, $options: "i" } },
//         ],
//         isActive: true,
//       })
//         .select("name contactPerson phone email")
//         .limit(Number(limit))
//         .lean(),

//       Doctor.find({
//         $or: [
//           { name: { $regex: searchTerm, $options: "i" } },
//           { speciality: { $regex: searchTerm, $options: "i" } },
//           { nmcNumber: searchTerm },
//         ],
//       })
//         .select("name speciality nmcNumber")
//         .limit(Number(limit))
//         .lean(),

//       User.find({
//         role: { $in: ["customer", "pharmacist", "staff"] },
//         $or: [
//           { name: { $regex: searchTerm, $options: "i" } },
//           { email: { $regex: searchTerm, $options: "i" } },
//         ],
//       })
//         .select("name email role phone")
//         .limit(Number(limit))
//         .lean(),

//       Order.find({
//         $or: [
//           { "items.medicine.name": { $regex: searchTerm, $options: "i" } },
//           { status: { $regex: searchTerm, $options: "i" } },
//         ],
//       })
//         .populate("user", "name")
//         .limit(Number(limit))
//         .lean(),
//     ]);

//     res.json({
//       results: [
//         ...medicines.map((m) => ({ ...m, type: "medicine" })),
//         ...suppliers.map((s) => ({ ...s, type: "supplier" })),
//         ...doctors.map((d) => ({ ...d, type: "doctor" })),
//         ...users.map((u) => ({ ...u, type: "user" })),
//         ...orders.map((o) => ({ ...o, type: "order" })),
//       ],
//     });
//   } catch (err) {
//     console.error("Search error:", err);
//     res.status(500).json({ message: "Search failed" });
//   }
// });

// /**
//  * -------- CUSTOMER MANAGEMENT ----------
//  */

// // GET /api/admin/customers  (list customers with stats)
// router.get("/customers", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const { search, page = 1, limit = 20 } = req.query;

//     const query = {
//       role: "customer",
//       ...(search && {
//         $or: [
//           { name: { $regex: search, $options: "i" } },
//           { email: { $regex: search, $options: "i" } },
//           { phone: { $regex: search, $options: "i" } },
//         ],
//       }),
//     };

//     const [customers, total] = await Promise.all([
//       User.find(query)
//         .select("-password")
//         .sort({ lastPurchaseDate: -1, createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(Number(limit))
//         .lean(),
//       User.countDocuments(query),
//     ]);

//     res.json({
//       customers,
//       pagination: {
//         page: Number(page),
//         limit: Number(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     console.error("Get customers error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/admin/customers/:id/history
// router.get(
//   "/customers/:id/history",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     try {
//       const customer = await User.findById(req.params.id)
//         .select("-password")
//         .lean();
//       if (!customer || customer.role !== "customer") {
//         return res.status(404).json({ message: "Customer not found" });
//       }

//       const [orders, prescriptions] = await Promise.all([
//         Order.find({ user: req.params.id })
//           .populate("items.medicine", "name")
//           .sort({ createdAt: -1 })
//           .limit(10)
//           .lean(),
//         // Assuming you have a Prescription model
//         Prescription?.find({ customer: req.params.id })
//           .populate("doctor", "name nmcNumber")
//           .sort({ createdAt: -1 })
//           .limit(5)
//           .lean() || [],
//       ]);

//       res.json({
//         customer,
//         orders,
//         prescriptions,
//       });
//     } catch (err) {
//       console.error("Get customer history error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // PUT /api/admin/customers/:id  (update customer profile)
// router.put("/customers/:id", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const customer = await User.findOneAndUpdate(
//       { _id: req.params.id, role: "customer" },
//       {
//         $set: req.body,
//       },
//       { new: true, runValidators: true }
//     ).select("-password");

//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     res.json({ message: "Customer updated", customer });
//   } catch (err) {
//     console.error("Update customer error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * -------- CUSTOMER MANAGEMENT ----------
//  */

// // GET /api/admin/customers
// router.get("/customers", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const { search, page = 1, limit = 20 } = req.query;

//     const query = {
//       role: "customer",
//       ...(search && {
//         $or: [
//           { name: { $regex: search, $options: "i" } },
//           { email: { $regex: search, $options: "i" } },
//           { phone: { $regex: search, $options: "i" } },
//         ],
//       }),
//     };

//     const [customers, total] = await Promise.all([
//       User.find(query)
//         .select("-password")
//         .sort({ lastPurchaseDate: -1, createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(Number(limit))
//         .lean(),
//       User.countDocuments(query),
//     ]);

//     res.json({
//       customers,
//       pagination: {
//         page: Number(page),
//         limit: Number(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     console.error("Get customers error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/admin/customers/:id/history
// router.get(
//   "/customers/:id/history",
//   authenticateToken,
//   isAdmin,
//   async (req, res) => {
//     try {
//       const customer = await User.findById(req.params.id)
//         .select("-password")
//         .lean();
//       if (!customer || customer.role !== "customer") {
//         return res.status(404).json({ message: "Customer not found" });
//       }

//       // Assuming you have Prescription model imported if used
//       const [orders, prescriptions] = await Promise.all([
//         Order.find({ user: req.params.id })
//           .populate("items.medicine", "name")
//           .sort({ createdAt: -1 })
//           .limit(10)
//           .lean(),
//         Prescription?.find({ customer: req.params.id })
//           .populate("doctor", "name nmcNumber")
//           .sort({ createdAt: -1 })
//           .limit(5)
//           .lean() || [],
//       ]);

//       res.json({
//         customer,
//         orders,
//         prescriptions,
//       });
//     } catch (err) {
//       console.error("Get customer history error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // PUT /api/admin/customers/:id
// router.put("/customers/:id", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const customer = await User.findOneAndUpdate(
//       { _id: req.params.id, role: "customer" },
//       { $set: req.body },
//       { new: true, runValidators: true }
//     ).select("-password");

//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     res.json({ message: "Customer updated", customer });
//   } catch (err) {
//     console.error("Update customer error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Models
const User = require("../models/User");
const Medicine = require("../models/Medicine");
const Order = require("../models/Order");
const Doctor = require("../models/Doctor");
const Supplier = require("../models/Supplier");
const PurchaseOrder = require("../models/PurchaseOrder");
const Appointment = require("../models/Appointment");

// Middleware
const authenticateToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// Valid roles
const VALID_ROLES = ["admin", "pharmacist", "staff", "customer"];

/**
 * GET /api/admin/dashboard
 */
router.get("/dashboard", authenticateToken, isAdmin, async (req, res) => {
  try {
    const [usersCount, medicinesCount, doctorsCount, orders] =
      await Promise.all([
        User.countDocuments(),
        Medicine.countDocuments(),
        Doctor.countDocuments(),
        Order.find().lean(),
      ]);

    const ordersCount = orders.length;
    const revenue = orders.reduce(
      (sum, order) => sum + (order.totalPrice || order.total || 0),
      0
    );

    const salesDataMap = {};
    orders.forEach((order) => {
      const created = order.createdAt || new Date();
      const month = new Date(created).toLocaleString("default", {
        month: "short",
      });
      const amount = order.totalPrice || order.total || 0;
      salesDataMap[month] = (salesDataMap[month] || 0) + amount;
    });
    const salesData = Object.keys(salesDataMap).map((m) => ({
      month: m,
      sales: salesDataMap[m],
    }));

    const lowStock = await Medicine.find({
      $or: [{ quantity: { $lt: 20 } }, { stock: { $lt: 20 } }],
    })
      .sort({ quantity: 1 })
      .limit(8)
      .lean();

    res.json({
      stats: {
        users: usersCount,
        medicines: medicinesCount,
        doctors: doctorsCount,
        orders: ordersCount,
        revenue,
        salesData,
      },
      lowStock,
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * -------- DOCTORS CRUD ----------
 */

// GET /api/admin/doctors
router.get("/doctors", authenticateToken, isAdmin, async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 }).lean();
    res.json(doctors);
  } catch (err) {
    console.error("Get doctors error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/doctors
router.post(
  "/doctors",
  authenticateToken,
  isAdmin,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("speciality").trim().notEmpty().withMessage("Speciality is required"),
    body("nmcNumber").trim().notEmpty().withMessage("NMC number is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, speciality, nmcNumber } = req.body;

      const existing = await Doctor.findOne({ nmcNumber });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Doctor with this NMC number already exists" });
      }

      const doctor = await Doctor.create({ name, speciality, nmcNumber });
      res.status(201).json({ message: "Doctor created", doctor });
    } catch (err) {
      console.error("Create doctor error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/admin/doctors/:id
router.put("/doctors/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor updated", doctor });
  } catch (err) {
    console.error("Update doctor error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/admin/doctors/:id
router.delete("/doctors/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Doctor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor deleted" });
  } catch (err) {
    console.error("Delete doctor error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * -------- APPOINTMENT MANAGEMENT ----------
 */

// GET /api/admin/appointments
router.get("/appointments", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { doctor, customer, date, status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (doctor) query.doctor = doctor;
    if (customer) query.customer = customer;
    if (date)
      query.date = {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
      };
    if (status) query.status = status;

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate("doctor", "name speciality nmcNumber")
        .populate("customer", "name email phone")
        .sort({ date: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      Appointment.countDocuments(query),
    ]);

    res.json({
      appointments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get appointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/appointments/:id/status
router.put(
  "/appointments/:id/status",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;
      if (
        !["pending", "confirmed", "completed", "cancelled"].includes(status)
      ) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate("doctor customer");

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.json({ message: "Appointment status updated", appointment });
    } catch (err) {
      console.error("Update appointment status error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * -------- MEDICINES CRUD ----------
 */

// GET /api/admin/medicines
router.get("/medicines", authenticateToken, isAdmin, async (req, res) => {
  try {
    const medicines = await Medicine.find().lean();
    res.json(medicines);
  } catch (err) {
    console.error("Get medicines error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/medicines
router.post(
  "/medicines",
  authenticateToken,
  isAdmin,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        name,
        manufacturer,
        price,
        quantity,
        stock,
        category,
        expiryDate,
      } = req.body;

      const medicine = await Medicine.create({
        name,
        manufacturer,
        price,
        quantity: quantity ?? stock ?? 0,
        stock: stock ?? quantity ?? 0,
        category,
        expiryDate,
      });

      res.status(201).json({ message: "Medicine added", medicine });
    } catch (err) {
      console.error("Add medicine error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/admin/medicines/:id
router.put("/medicines/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.json({ message: "Medicine updated", medicine });
  } catch (err) {
    console.error("Update medicine error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/admin/medicines/:id
router.delete(
  "/medicines/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const deleted = await Medicine.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Medicine not found" });
      }
      res.json({ message: "Medicine deleted" });
    } catch (err) {
      console.error("Delete medicine error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * -------- ORDERS VIEW / STATUS ----------
 */

// GET /api/admin/orders
router.get("/orders", authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "-password")
      .populate("items.medicine")
      .lean();
    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/orders/:id/status
router.put(
  "/orders/:id/status",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json({ message: "Order status updated", order });
    } catch (err) {
      console.error("Update order status error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * -------- USERS MANAGEMENT ----------
 */

// GET /api/admin/users
router.get("/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/users  (admin creates staff & pharmacist only)
router.post("/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const allowedRoles = ["staff", "pharmacist"];
    if (!allowedRoles.includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role for this endpoint" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      role,
      passwordHash,
    });

    res.status(201).json({
      message: "User created",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("admin create user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/users/:id/role
router.put("/users/:id/role", authenticateToken, isAdmin, async (req, res) => {
  const { role } = req.body;
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User role updated", user });
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * -------- SUPPLIERS CRUD ----------
 */

// GET /api/admin/suppliers
router.get("/suppliers", authenticateToken, isAdmin, async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 }).lean();
    res.json(suppliers);
  } catch (err) {
    console.error("Get suppliers error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/suppliers
router.post(
  "/suppliers",
  authenticateToken,
  isAdmin,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").optional().isEmail().withMessage("Invalid email"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const supplier = await Supplier.create({
        name: req.body.name,
        contactPerson: req.body.contactPerson,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        gstOrPan: req.body.gstOrPan,
        notes: req.body.notes,
        isActive: req.body.isActive !== false,
      });
      res.status(201).json({ message: "Supplier created", supplier });
    } catch (err) {
      console.error("Create supplier error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/admin/suppliers/:id
router.put(
  "/suppliers/:id",
  authenticateToken,
  isAdmin,
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Invalid email"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json({ message: "Supplier updated", supplier });
    } catch (err) {
      console.error("Update supplier error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE /api/admin/suppliers/:id (soft delete)
router.delete(
  "/suppliers/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json({ message: "Supplier deactivated", supplier });
    } catch (err) {
      console.error("Delete supplier error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * -------- PURCHASES ----------
 */

// GET /api/admin/purchases
router.get("/purchases", authenticateToken, isAdmin, async (req, res) => {
  try {
    const purchases = await PurchaseOrder.find()
      .populate("supplier")
      .populate("items.medicine")
      .sort({ orderedAt: -1 })
      .lean();

    res.json(purchases);
  } catch (err) {
    console.error("Get purchases error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/purchases
router.post(
  "/purchases",
  authenticateToken,
  isAdmin,
  [
    body("supplier").notEmpty().withMessage("Supplier is required"),
    body("items")
      .isArray({ min: 1 })
      .withMessage("At least one item is required"),
    body("items.*.medicine")
      .notEmpty()
      .withMessage("Medicine id is required for each item"),
    body("items.*.quantity")
      .isNumeric()
      .withMessage("Quantity must be a number"),
    body("items.*.costPrice")
      .isNumeric()
      .withMessage("Cost price must be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { supplier, items, notes } = req.body;

      const totalCost = items.reduce(
        (sum, it) => sum + Number(it.costPrice || 0) * Number(it.quantity || 0),
        0
      );

      const po = await PurchaseOrder.create({
        supplier,
        items,
        status: "Pending",
        totalCost,
        orderedAt: new Date(),
        createdBy: req.user?.id,
        notes,
      });

      res.status(201).json({ message: "Purchase order created", purchase: po });
    } catch (err) {
      console.error("Create purchase error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/admin/purchases/:id/status
router.put(
  "/purchases/:id/status",
  authenticateToken,
  isAdmin,
  [
    body("status")
      .isIn(["Pending", "Ordered", "Received", "Cancelled"])
      .withMessage("Invalid status"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    try {
      const po = await PurchaseOrder.findById(req.params.id);
      if (!po) {
        return res.status(404).json({ message: "Purchase order not found" });
      }

      const isReceiving = status === "Received" && po.status !== "Received";

      po.status = status;
      if (isReceiving) {
        po.receivedAt = new Date();
      }

      await po.save();

      if (isReceiving) {
        // For each item in PO, push/merge a batch and recalc quantity
        for (const item of po.items) {
          const med = await Medicine.findById(item.medicine);
          if (!med) continue;

          // Expect these fields to exist on item:
          // item.batchNumber, item.expiryDate, item.quantity, item.costPrice
          const batchNumber = item.batchNumber || po._id.toString();
          const expiryDate = item.expiryDate ? new Date(item.expiryDate) : null;

          if (!expiryDate) {
            // fallback: keep old behaviour if no expiry provided
            med.quantity = (med.quantity || 0) + Number(item.quantity || 0);
          } else {
            // find existing batch with same batchNumber + expiry
            const existingBatch = med.batches.find(
              (b) =>
                b.batchNumber === batchNumber &&
                b.expiryDate.getTime() === expiryDate.getTime()
            );

            if (existingBatch) {
              existingBatch.qty += Number(item.quantity || 0);
            } else {
              med.batches.push({
                batchNumber,
                expiryDate,
                qty: Number(item.quantity || 0),
                costPrice: item.costPrice,
              });
            }

            // keep total quantity in sync with batches
            if (typeof med.recalculateQuantityFromBatches === "function") {
              med.recalculateQuantityFromBatches();
            } else {
              med.quantity = med.batches.reduce(
                (sum, b) => sum + (b.qty || 0),
                0
              );
            }
          }

          await med.save();
        }
      }

      const populated = await PurchaseOrder.findById(po._id)
        .populate("supplier")
        .populate("items.medicine")
        .lean();

      res.json({
        message: "Purchase order status updated",
        purchase: populated,
      });
    } catch (err) {
      console.error("Update purchase status error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * -------- GLOBAL SEARCH ----------
 */

router.get("/search", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ results: [] });
    }

    const searchTerm = q.trim().toLowerCase();

    const [medicines, suppliers, doctors, users, orders] = await Promise.all([
      Medicine.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { manufacturer: { $regex: searchTerm, $options: "i" } },
          { category: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .select("name manufacturer category price quantity stock")
        .limit(Number(limit))
        .lean(),

      Supplier.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { contactPerson: { $regex: searchTerm, $options: "i" } },
        ],
        isActive: true,
      })
        .select("name contactPerson phone email")
        .limit(Number(limit))
        .lean(),

      Doctor.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { speciality: { $regex: searchTerm, $options: "i" } },
          { nmcNumber: searchTerm },
        ],
      })
        .select("name speciality nmcNumber")
        .limit(Number(limit))
        .lean(),

      User.find({
        role: { $in: ["customer", "pharmacist", "staff"] },
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .select("name email role phone")
        .limit(Number(limit))
        .lean(),

      Order.find({
        $or: [
          { "items.medicine.name": { $regex: searchTerm, $options: "i" } },
          { status: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .populate("user", "name")
        .limit(Number(limit))
        .lean(),
    ]);

    res.json({
      results: [
        ...medicines.map((m) => ({ ...m, type: "medicine" })),
        ...suppliers.map((s) => ({ ...s, type: "supplier" })),
        ...doctors.map((d) => ({ ...d, type: "doctor" })),
        ...users.map((u) => ({ ...u, type: "user" })),
        ...orders.map((o) => ({ ...o, type: "order" })),
      ],
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
});

module.exports = router;
