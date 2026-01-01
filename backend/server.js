// require("dotenv").config();
// const cors = require("cors");
// const express = require("express");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const path = require("path");
// const passport = require("./utils/passport");
// const multer = require("multer");
// const fs = require("fs");

// // ---------- ROUTES ----------
// const authRoutes = require("./routes/auth");
// const adminRoutes = require("./routes/admin");
// const medicinesRoutes = require("./routes/medicines");
// const ordersRoutes = require("./routes/orders");
// const customerRoutes = require("./routes/customer");
// const pharmacistRoutes = require("./routes/pharmacist");
// const doctorRoutes = require("./routes/doctors");
// const appointmentRoutes = require("./routes/appointments");
// const prescriptionRoutes = require("./routes/prescriptions");
// const adminOrderRoutes = require("./routes/adminOrderRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
// const adminAnalyticsRoutes = require("./routes/adminAnalytics");
// const customerOrderRoutes = require("./routes/customerOrders");
// const adminCustomersRoutes = require("./routes/adminCustomers");

// const app = express();

// // ---------- MULTER CONFIGURATION (for profile photo upload) ----------
// const profileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "uploads", "profiles");
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       `profile-${req.user?.id || "user"}-${uniqueSuffix}${path.extname(
//         file.originalname
//       )}`
//     );
//   },
// });
// const uploadProfilePhoto = multer({
//   storage: profileStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed!"), false);
//     }
//   },
// });

// // ---------- MIDDLEWARE ----------
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:3000"],
//     credentials: true,
//   })
// );

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(
//   "/uploads/profiles",
//   express.static(path.join(__dirname, "uploads/profiles"))
// );
// app.use(
//   "/uploads/prescriptions",
//   express.static(path.join(__dirname, "uploads/prescriptions"))
// );

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: process.env.NODE_ENV === "production" },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // ---------- ROOT ----------
// app.get("/", (req, res) => {
//   res.json({
//     message: "Pharmacy Backend OK",
//     timestamp: new Date().toISOString(),
//     env: process.env.NODE_ENV || "development",
//     features: ["profile-photos", "prescription-uploads", "role-based-auth"],
//   });
// });

// // ---------- ROUTES MOUNT ----------
// app.use("/api/payments", paymentRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/admin", adminOrderRoutes);
// app.use("/api/admin", adminAnalyticsRoutes);
// app.use("/api/medicines", medicinesRoutes);
// app.use("/api/orders", ordersRoutes);
// app.use("/api/doctors", doctorRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/prescriptions", prescriptionRoutes);
// app.use("/api/customer", customerRoutes);
// app.use("/api/customer", customerOrderRoutes);
// app.use("/api/pharmacist", pharmacistRoutes);
// app.use("/api", adminCustomersRoutes); // ✅ /api/customers/admin, /api/customers/admin/:id

// // ---------- Profile photo upload route example ----------
// app.post(
//   "/api/customer/profile/photo",
//   // add authenticateToken here if needed
//   uploadProfilePhoto.single("profilePhoto"),
//   (req, res) => {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded." });
//     }
//     res.json({
//       filename: req.file.filename,
//       url: `/uploads/profiles/${req.file.filename}`,
//     });
//   }
// );

// // ---------- API HEALTH CHECK ----------
// app.get("/api/health", (req, res) => {
//   res.json({
//     status: "OK ✅",
//     timestamp: new Date().toISOString(),
//     message: "All core APIs working perfectly",
//     newFeatures: [
//       "✅ Profile management (GET/PUT /api/customer/profile)",
//       "✅ Profile photo uploads (/uploads/profiles)",
//       "✅ Favourites & Reminders (DISABLED - files pending)",
//     ],
//     endpoints: {
//       customer: [
//         "/api/customer/profile (GET profile, PUT update)",
//         "/api/customer/orders",
//         "/api/customer/prescriptions",
//         "/api/customer/appointments",
//       ],
//       pharmacist: [
//         "/api/pharmacist/orders",
//         "/api/pharmacist/medicines",
//         "/api/pharmacist/doctors",
//       ],
//       prescriptions: [
//         "/api/prescriptions (upload)",
//         "/api/prescriptions/pharmacist/prescriptions",
//       ],
//       uploads: ["/uploads/prescriptions/...", "/uploads/profiles/..."],
//       admin: [
//         "/api/admin/stats",
//         "/api/admin/low-stock",
//         "/api/customers/admin",
//       ],
//     },
//     staticFiles: {
//       prescriptions: `http://localhost:${
//         process.env.PORT || 5000
//       }/uploads/prescriptions/...`,
//       profiles: `http://localhost:${
//         process.env.PORT || 5000
//       }/uploads/profiles/...`,
//     },
//   });
// });

// // 404 handler
// app.use((req, res, next) => {
//   if (req.path.startsWith("/api/")) {
//     return res.status(404).json({
//       message: "API route not found",
//       path: req.path,
//       method: req.method,
//       available: ["/api/customer/profile", "/api/health"],
//     });
//   }
//   next();
// });

// // Generic error handler
// app.use((err, req, res, next) => {
//   console.error("❌ Server Error:", {
//     message: err.message,
//     stack: err.stack,
//     url: req.url,
//     method: req.method,
//     timestamp: new Date().toISOString(),
//     ...(req.file && { file: req.file }),
//     ...(req.user && { userId: req.user.id }),
//   });

//   if (err instanceof multer.MulterError) {
//     if (err.code === "LIMIT_FILE_SIZE") {
//       return res.status(400).json({ message: "File too large. Max 5MB." });
//     }
//     return res.status(400).json({ message: err.message });
//   }

//   res.status(err.status || 500).json({
//     message:
//       process.env.NODE_ENV === "production" ? "Server error" : err.message,
//     ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
//   });
// });

// // ---------- MONGODB & SERVER START ----------
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/pharmacy";

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected successfully");
//     console.log(`📊 Database: ${MONGO_URI.split("@")[1] || "local"}`);

//     const server = app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`🌐 API Base: http://localhost:${PORT}/api`);
//       console.log(
//         `👤 Customer Profile: http://localhost:${PORT}/api/customer/profile`
//       );
//       console.log("📁 Uploads:");
//       console.log(
//         `   💊 Prescriptions: http://localhost:${PORT}/uploads/prescriptions`
//       );
//       console.log(`   👤 Profiles: http://localhost:${PORT}/uploads/profiles`);
//       console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
//     });

//     // Graceful shutdown
//     process.on("SIGTERM", () => {
//       console.log("SIGTERM received, shutting down gracefully");
//       server.close(() => {
//         mongoose.connection.close(false, () => {
//           console.log("MongoDB connection closed");
//           process.exit(0);
//         });
//       });
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   });

// module.exports = app;

// require("dotenv").config();
// const cors = require("cors");
// const express = require("express");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const path = require("path");
// const passport = require("./utils/passport");
// const multer = require("multer");
// const fs = require("fs");

// // ---------- ROUTES ----------
// const authRoutes = require("./routes/auth");
// const adminRoutes = require("./routes/admin");
// const medicinesRoutes = require("./routes/medicines");
// const ordersRoutes = require("./routes/orders");
// const customerRoutes = require("./routes/customer");
// const pharmacistRoutes = require("./routes/pharmacist");
// const doctorRoutes = require("./routes/doctors");
// const appointmentRoutes = require("./routes/appointments");
// const prescriptionRoutes = require("./routes/prescriptions");
// const adminOrderRoutes = require("./routes/adminOrderRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
// const adminAnalyticsRoutes = require("./routes/adminAnalytics");
// const customerOrderRoutes = require("./routes/customerOrders");
// const adminCustomersRoutes = require("./routes/adminCustomers");

// const app = express();

// // ---------- MULTER CONFIGURATION (for profile photo upload) ----------
// const profileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "uploads", "profiles");
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       `profile-${req.user?.id || "user"}-${uniqueSuffix}${path.extname(
//         file.originalname
//       )}`
//     );
//   },
// });
// const uploadProfilePhoto = multer({
//   storage: profileStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed!"), false);
//     }
//   },
// });

// // ---------- MIDDLEWARE ----------
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:3000"],
//     credentials: true,
//   })
// );

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(
//   "/uploads/profiles",
//   express.static(path.join(__dirname, "uploads/profiles"))
// );
// app.use(
//   "/uploads/prescriptions",
//   express.static(path.join(__dirname, "uploads/prescriptions"))
// );

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: process.env.NODE_ENV === "production" },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // ---------- ROOT ----------
// app.get("/", (req, res) => {
//   res.json({
//     message: "Pharmacy Backend OK",
//     timestamp: new Date().toISOString(),
//     env: process.env.NODE_ENV || "development",
//     features: ["profile-photos", "prescription-uploads", "role-based-auth"],
//   });
// });

// // ---------- ROUTES MOUNT ----------
// app.use("/api/payments", paymentRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/admin", adminOrderRoutes);
// app.use("/api/admin", adminAnalyticsRoutes);
// app.use("/api/medicines", medicinesRoutes); // <-- /api/medicines/admin/low-stock
// app.use("/api/orders", ordersRoutes);
// app.use("/api/doctors", doctorRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/prescriptions", prescriptionRoutes);
// app.use("/api/customer", customerRoutes);
// app.use("/api/customer", customerOrderRoutes);
// app.use("/api/pharmacist", pharmacistRoutes);
// app.use("/api", adminCustomersRoutes); // /api/customers/admin, /api/customers/admin/:id

// // ---------- Profile photo upload route example ----------
// app.post(
//   "/api/customer/profile/photo",
//   // add authenticateToken here if needed
//   uploadProfilePhoto.single("profilePhoto"),
//   (req, res) => {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded." });
//     }
//     res.json({
//       filename: req.file.filename,
//       url: `/uploads/profiles/${req.file.filename}`,
//     });
//   }
// );

// // ---------- API HEALTH CHECK ----------
// app.get("/api/health", (req, res) => {
//   res.json({
//     status: "OK ✅",
//     timestamp: new Date().toISOString(),
//     message: "All core APIs working perfectly",
//     newFeatures: [
//       "✅ Profile management (GET/PUT /api/customer/profile)",
//       "✅ Profile photo uploads (/uploads/profiles)",
//       "✅ Favourites & Reminders (DISABLED - files pending)",
//     ],
//     endpoints: {
//       customer: [
//         "/api/customer/profile (GET profile, PUT update)",
//         "/api/customer/orders",
//         "/api/customer/prescriptions",
//         "/api/customer/appointments",
//       ],
//       pharmacist: [
//         "/api/pharmacist/orders",
//         "/api/pharmacist/medicines",
//         "/api/pharmacist/doctors",
//       ],
//       prescriptions: [
//         "/api/prescriptions (upload)",
//         "/api/prescriptions/pharmacist/prescriptions",
//       ],
//       uploads: ["/uploads/prescriptions/...", "/uploads/profiles/..."],
//       admin: [
//         "/api/admin/stats",
//         // low stock is under medicines router:
//         "/api/medicines/admin/low-stock",
//         "/api/customers/admin",
//       ],
//     },
//     staticFiles: {
//       prescriptions: `http://localhost:${
//         process.env.PORT || 5000
//       }/uploads/prescriptions/...`,
//       profiles: `http://localhost:${
//         process.env.PORT || 5000
//       }/uploads/profiles/...`,
//     },
//   });
// });

// // 404 handler
// app.use((req, res, next) => {
//   if (req.path.startsWith("/api/")) {
//     return res.status(404).json({
//       message: "API route not found",
//       path: req.path,
//       method: req.method,
//       available: ["/api/customer/profile", "/api/health"],
//     });
//   }
//   next();
// });

// // Generic error handler
// app.use((err, req, res, next) => {
//   console.error("❌ Server Error:", {
//     message: err.message,
//     stack: err.stack,
//     url: req.url,
//     method: req.method,
//     timestamp: new Date().toISOString(),
//     ...(req.file && { file: req.file }),
//     ...(req.user && { userId: req.user.id }),
//   });

//   if (err instanceof multer.MulterError) {
//     if (err.code === "LIMIT_FILE_SIZE") {
//       return res.status(400).json({ message: "File too large. Max 5MB." });
//     }
//     return res.status(400).json({ message: err.message });
//   }

//   res.status(err.status || 500).json({
//     message:
//       process.env.NODE_ENV === "production" ? "Server error" : err.message,
//     ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
//   });
// });

// // ---------- MONGODB & SERVER START ----------
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/pharmacy";

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected successfully");
//     console.log(`📊 Database: ${MONGO_URI.split("@")[1] || "local"}`);

//     const server = app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`🌐 API Base: http://localhost:${PORT}/api`);
//       console.log(
//         `👤 Customer Profile: http://localhost:${PORT}/api/customer/profile`
//       );
//       console.log("📁 Uploads:");
//       console.log(
//         `   💊 Prescriptions: http://localhost:${PORT}/uploads/prescriptions`
//       );
//       console.log(`   👤 Profiles: http://localhost:${PORT}/uploads/profiles`);
//       console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
//       console.log(
//         `📉 Low stock endpoint: http://localhost:${PORT}/api/medicines/admin/low-stock`
//       );
//     });

//     // Graceful shutdown
//     process.on("SIGTERM", () => {
//       console.log("SIGTERM received, shutting down gracefully");
//       server.close(() => {
//         mongoose.connection.close(false, () => {
//           console.log("MongoDB connection closed");
//           process.exit(0);
//         });
//       });
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   });

// module.exports = app;

// require("dotenv").config();
// const cors = require("cors");
// const express = require("express");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const path = require("path");
// const passport = require("./utils/passport");
// const multer = require("multer");
// const fs = require("fs");

// // ---------- ROUTES ----------
// const authRoutes = require("./routes/auth");
// const adminRoutes = require("./routes/admin");
// const medicinesRoutes = require("./routes/medicines");
// const ordersRoutes = require("./routes/orders");
// const customerRoutes = require("./routes/customer");
// const pharmacistRoutes = require("./routes/pharmacist");
// const doctorRoutes = require("./routes/doctors");
// const appointmentRoutes = require("./routes/appointments");
// const prescriptionRoutes = require("./routes/prescriptions");
// const adminOrderRoutes = require("./routes/adminOrderRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
// const adminAnalyticsRoutes = require("./routes/adminAnalytics");
// const customerOrderRoutes = require("./routes/customerOrders");
// const adminCustomersRoutes = require("./routes/adminCustomers");
// // [ADDED] Favourites Route for Wishlist
// const favouriteRoutes = require("./routes/favourites");

// const app = express();

// // ---------- MULTER CONFIGURATION (for profile photo upload) ----------
// const profileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "uploads", "profiles");
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       `profile-${req.user?.id || "user"}-${uniqueSuffix}${path.extname(
//         file.originalname
//       )}`
//     );
//   },
// });
// const uploadProfilePhoto = multer({
//   storage: profileStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed!"), false);
//     }
//   },
// });

// // ---------- MIDDLEWARE ----------
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:3000"],
//     credentials: true,
//   })
// );

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(
//   "/uploads/profiles",
//   express.static(path.join(__dirname, "uploads/profiles"))
// );
// app.use(
//   "/uploads/prescriptions",
//   express.static(path.join(__dirname, "uploads/prescriptions"))
// );

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: process.env.NODE_ENV === "production" },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // ---------- ROOT ----------
// app.get("/", (req, res) => {
//   res.json({
//     message: "Pharmacy Backend OK",
//     timestamp: new Date().toISOString(),
//     env: process.env.NODE_ENV || "development",
//     features: ["profile-photos", "prescription-uploads", "role-based-auth"],
//   });
// });

// // ---------- ROUTES MOUNT ----------
// app.use("/api/payments", paymentRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/admin", adminOrderRoutes);
// app.use("/api/admin", adminAnalyticsRoutes);
// app.use("/api/medicines", medicinesRoutes); // <-- /api/medicines/admin/low-stock
// app.use("/api/orders", ordersRoutes);
// app.use("/api/doctors", doctorRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/prescriptions", prescriptionRoutes);
// app.use("/api/customer", customerRoutes);

// // [UPDATED] Mount to specific path so router.get('/') works correctly
// app.use("/api/customer/orders", customerOrderRoutes);

// // [ADDED] Mount Favourites for Saved Medicines
// app.use("/api/customer/saved-medicines", favouriteRoutes);

// app.use("/api/pharmacist", pharmacistRoutes);
// app.use("/api", adminCustomersRoutes); // /api/customers/admin, /api/customers/admin/:id

// // ---------- Profile photo upload route example ----------
// app.post(
//   "/api/customer/profile/photo",
//   // add authenticateToken here if needed
//   uploadProfilePhoto.single("profilePhoto"),
//   (req, res) => {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded." });
//     }
//     res.json({
//       filename: req.file.filename,
//       url: `/uploads/profiles/${req.file.filename}`,
//     });
//   }
// );

// // ---------- API HEALTH CHECK ----------
// app.get("/api/health", (req, res) => {
//   res.json({
//     status: "OK ✅",
//     timestamp: new Date().toISOString(),
//     message: "All core APIs working perfectly",
//     newFeatures: [
//       "✅ Profile management (GET/PUT /api/customer/profile)",
//       "✅ Profile photo uploads (/uploads/profiles)",
//       "✅ Favourites & Reminders (Active)",
//     ],
//     endpoints: {
//       customer: [
//         "/api/customer/profile (GET profile, PUT update)",
//         "/api/customer/orders",
//         "/api/customer/prescriptions",
//         "/api/customer/appointments",
//         "/api/customer/saved-medicines",
//       ],
//       pharmacist: [
//         "/api/pharmacist/orders",
//         "/api/pharmacist/medicines",
//         "/api/pharmacist/doctors",
//       ],
//       prescriptions: [
//         "/api/prescriptions (upload)",
//         "/api/prescriptions/pharmacist/prescriptions",
//       ],
//       uploads: ["/uploads/prescriptions/...", "/uploads/profiles/..."],
//       admin: [
//         "/api/admin/stats",
//         // low stock is under medicines router:
//         "/api/medicines/admin/low-stock",
//         "/api/customers/admin",
//       ],
//     },
//     staticFiles: {
//       prescriptions: `http://localhost:${
//         process.env.PORT || 5000
//       }/uploads/prescriptions/...`,
//       profiles: `http://localhost:${
//         process.env.PORT || 5000
//       }/uploads/profiles/...`,
//     },
//   });
// });

// // 404 handler
// app.use((req, res, next) => {
//   if (req.path.startsWith("/api/")) {
//     return res.status(404).json({
//       message: "API route not found",
//       path: req.path,
//       method: req.method,
//       available: ["/api/customer/profile", "/api/health"],
//     });
//   }
//   next();
// });

// // Generic error handler
// app.use((err, req, res, next) => {
//   console.error("❌ Server Error:", {
//     message: err.message,
//     stack: err.stack,
//     url: req.url,
//     method: req.method,
//     timestamp: new Date().toISOString(),
//     ...(req.file && { file: req.file }),
//     ...(req.user && { userId: req.user.id }),
//   });

//   if (err instanceof multer.MulterError) {
//     if (err.code === "LIMIT_FILE_SIZE") {
//       return res.status(400).json({ message: "File too large. Max 5MB." });
//     }
//     return res.status(400).json({ message: err.message });
//   }

//   res.status(err.status || 500).json({
//     message:
//       process.env.NODE_ENV === "production" ? "Server error" : err.message,
//     ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
//   });
// });

// // ---------- MONGODB & SERVER START ----------
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/pharmacy";

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected successfully");
//     console.log(`📊 Database: ${MONGO_URI.split("@")[1] || "local"}`);

//     const server = app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`🌐 API Base: http://localhost:${PORT}/api`);
//       console.log(
//         `👤 Customer Profile: http://localhost:${PORT}/api/customer/profile`
//       );
//       console.log("📁 Uploads:");
//       console.log(
//         `   💊 Prescriptions: http://localhost:${PORT}/uploads/prescriptions`
//       );
//       console.log(`   👤 Profiles: http://localhost:${PORT}/uploads/profiles`);
//       console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
//       console.log(
//         `📉 Low stock endpoint: http://localhost:${PORT}/api/medicines/admin/low-stock`
//       );
//     });

//     // Graceful shutdown
//     process.on("SIGTERM", () => {
//       console.log("SIGTERM received, shutting down gracefully");
//       server.close(() => {
//         mongoose.connection.close(false, () => {
//           console.log("MongoDB connection closed");
//           process.exit(0);
//         });
//       });
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   });

// module.exports = app;

require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const passport = require("./utils/passport");
const multer = require("multer");
const fs = require("fs");

// ---------- ROUTES IMPORTS ----------
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
//const medicinesRoutes = require("./routes/medicineRoutes"); // ✅ Updated filename match
const medicinesRoutes = require("./routes/medicines");
const ordersRoutes = require("./routes/orders");
const customerRoutes = require("./routes/customer");
const pharmacistRoutes = require("./routes/pharmacist");
const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");
const prescriptionRoutes = require("./routes/prescriptions");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const paymentRoutes = require("./routes/paymentRoutes"); // ✅ Payment logic
const adminAnalyticsRoutes = require("./routes/adminAnalytics");
const customerOrderRoutes = require("./routes/customerOrders");
const adminCustomersRoutes = require("./routes/adminCustomers");
const favouriteRoutes = require("./routes/favourites"); // ✅ Wishlist logic

const app = express();

// ---------- MULTER CONFIGURATION ----------
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads", "profiles");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `profile-${req.user?.id || "user"}-${uniqueSuffix}${path.extname(
        file.originalname
      )}`
    );
  },
});
const uploadProfilePhoto = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// ---------- MIDDLEWARE ----------
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

// Serve Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/profiles",
  express.static(path.join(__dirname, "uploads/profiles"))
);
app.use(
  "/uploads/prescriptions",
  express.static(path.join(__dirname, "uploads/prescriptions"))
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ---------- ROOT CHECK ----------
app.get("/", (req, res) => {
  res.json({
    message: "Pharmacy Backend OK",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
    features: [
      "profile-photos",
      "prescription-uploads",
      "role-based-auth",
      "payments",
    ],
  });
});

// ---------- API ROUTES MOUNT ----------
app.use("/api/auth", authRoutes); // Auth & Profile
app.use("/api/admin", adminRoutes); // Admin Core
app.use("/api/admin", adminOrderRoutes); // Admin Orders
app.use("/api/admin", adminAnalyticsRoutes); // Admin Analytics
app.use("/api/medicines", medicinesRoutes); // ✅ Medicine Catalog (Search/Filter)

app.use("/api/orders", ordersRoutes); // General Orders
app.use("/api/doctors", doctorRoutes); // Doctors
app.use("/api/appointments", appointmentRoutes); // Appointments
app.use("/api/prescriptions", prescriptionRoutes); // Prescriptions
app.use("/api/customer", customerRoutes); // Customer specific
app.use("/api/payments", paymentRoutes); // ✅ Payment Gateways (Stripe/Khalti)

// Specific Customer Features
app.use("/api/customer/orders", customerOrderRoutes);
app.use("/api/customer/saved-medicines", favouriteRoutes);

// Pharmacist & Admin Extras
app.use("/api/pharmacist", pharmacistRoutes);
app.use("/api", adminCustomersRoutes);

// ---------- PROFILE PHOTO UPLOAD ----------
app.post(
  "/api/customer/profile/photo",
  uploadProfilePhoto.single("profilePhoto"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    res.json({
      filename: req.file.filename,
      url: `/uploads/profiles/${req.file.filename}`,
    });
  }
);

// ---------- API HEALTH CHECK ----------
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK ✅",
    timestamp: new Date().toISOString(),
    message: "All core APIs working perfectly",
    endpoints: {
      auth: "/api/auth",
      medicines: "/api/medicines",
      payments: "/api/payments",
    },
  });
});

// ---------- ERROR HANDLING ----------
// 404 handler
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      message: "API route not found",
      path: req.path,
      method: req.method,
    });
  }
  next();
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ message: "File upload error: " + err.message });
  }
  res.status(err.status || 500).json({
    message:
      process.env.NODE_ENV === "production" ? "Server error" : err.message,
  });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/pharmacy";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 API Base: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = app;
