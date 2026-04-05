// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const path = require("path");
// const passport = require("./utils/passport");
// const multer = require("multer");
// const fs = require("fs");
// const helmet = require("helmet"); //Added for security headers

// // -------------------------------------------------------------------
// // 1. IMPORT ROUTES
// // -------------------------------------------------------------------
// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const medicineRoutes = require("./routes/medicineRoutes");
// const doctorRoutes = require("./routes/doctorRoutes");
// const doctorDashboardRoutes = require("./routes/doctorDashboardRoutes");
// const appointmentRoutes = require("./routes/appointmentRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const prescriptionRoutes = require("./routes/prescriptionRoutes");
// const customerRoutes = require("./routes/customerRoutes");
// const pharmacistRoutes = require("./routes/pharmacistRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
// const uploadRoutes = require("./routes/uploadRoutes");
// const refillRoutes = require("./routes/refillRoutes");
// const savedMedicineRoutes = require("./routes/savedMedicineRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const cartRoutes = require("./routes/cartRoutes");
// const supplierRoutes = require("./routes/supplierRoutes");
// const purchaseRoutes = require("./routes/purchaseRoutes");
// const messageRoutes = require("./routes/messageRoutes");

// const app = express();

// // -------------------------------------------------------------------
// // 2. MIDDLEWARE & CONFIG
// // -------------------------------------------------------------------
// // Security Headers
// app.use(
//   helmet({
//     crossOriginResourcePolicy: false, // Allows images to be served to the frontend
//   }),
// );

// // CORS: Configured for Frontend Dev Server
// app.use(
//   cors({
//     origin:
//       process.env.NODE_ENV === "production"
//         ? process.env.FRONTEND_URL
//         : ["http://localhost:5173", "http://localhost:3000"],
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     credentials: true,
//   }),
// );

// // Body Parsers: Increased limit for base64 images (Prescriptions)
// app.use(express.json({ limit: "15mb" }));
// app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// // Session Management for Passport & Security
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "pharmacy_secret_key_2026",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production",
//       httpOnly: true,
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     },
//   }),
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // Request Logger
// app.use((req, res, next) => {
//   console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
//   next();
// });

// // -------------------------------------------------------------------
// // 3. STATIC FILES & DIRECTORY SETUP
// // -------------------------------------------------------------------
// /**
//  * Enhanced Directory Setup:
//  * Ensures all subfolders exist to prevent Multer "No such file or directory" errors
//  */
// // ✅ FIXED: Added the closing bracket "]" to the dirs array
// const dirs = [
//   "uploads",
//   "uploads/prescriptions",
//   "uploads/profiles",
//   "uploads/medicines",
//   "images",
// ];

// dirs.forEach((dir) => {
//   const fullPath = path.join(__dirname, dir);
//   if (!fs.existsSync(fullPath)) {
//     fs.mkdirSync(fullPath, { recursive: true });
//     console.log(`📁 Created directory: ${dir}`);
//   }
// });

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/images", express.static(path.join(__dirname, "images")));

// // -------------------------------------------------------------------
// // 4. MOUNT ROUTES
// // -------------------------------------------------------------------

// // Core Auth & Identity
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes); // Handles Login/Register & Admin User Management

// // Pharmacy Commerce & Medical Features
// app.use("/api/medicines", medicineRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/prescriptions", prescriptionRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/admin/suppliers", supplierRoutes);
// app.use("/api/admin/purchases", purchaseRoutes);

// // Messages
// app.use("/api/messages", messageRoutes);

// // PUBLIC & PRIVATE DOCTOR ROUTES
// app.use("/api/doctors", doctorRoutes);
// app.use("/api/doctor", doctorRoutes);
// app.use("/api/doctor", doctorDashboardRoutes);

// // Customer Portal Utilities (Dashboard, Profile Stats)
// app.use("/api/customer", customerRoutes);
// app.use("/api/customer", userRoutes);
// app.use("/api/customer/saved-medicines", savedMedicineRoutes);
// app.use("/api/refill-reminders", refillRoutes);

// // Pharmacist Portal
// app.use("/api/pharmacist", pharmacistRoutes);

// // Admin Portal
// app.use("/api/admin", adminRoutes);

// // File Management
// app.use("/api/upload", uploadRoutes);

// // -------------------------------------------------------------------
// // 5. ERROR HANDLING & SERVER INITIALIZATION
// // -------------------------------------------------------------------

// app.get("/api/health", (req, res) =>
//   res.json({
//     status: "OK",
//     timestamp: new Date(),
//     dbConnected: mongoose.connection.readyState === 1,
//   }),
// );

// // Catch-all for 404s
// app.use((req, res) =>
//   res.status(404).json({
//     success: false,
//     message: `API route not found: ${req.originalUrl}`,
//   }),
// );

// // Global Error Handler
// app.use((err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   console.error(`❌ Server Error: ${err.message}`);

//   if (err instanceof multer.MulterError) {
//     return res
//       .status(400)
//       .json({ success: false, message: `Upload error: ${err.message}` });
//   }

//   res.status(statusCode).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// });

// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/pharmacy";

// // Mongoose Connection Event Listeners
// mongoose.connection.on("disconnected", () => {
//   console.log("⚠️ MongoDB Disconnected");
// });

// mongoose.connection.on("error", (err) => {
//   console.error("❌ MongoDB Error:", err);
// });

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB Connected Successfully");
//     const server = app.listen(PORT, () =>
//       console.log(`🚀 Smart Pharmacy Server active on port ${PORT}`),
//     );

//     // Graceful Shutdown Handler
//     process.on("SIGTERM", () => {
//       console.info("SIGTERM signal received. Closing server...");
//       server.close(() => {
//         mongoose.connection.close(false, () => {
//           console.log("MongoDB connection closed.");
//           process.exit(0);
//         });
//       });
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Critical MongoDB Connection Error:", err.message);
//     process.exit(1);
//   });

// module.exports = app;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const passport = require("./utils/passport");
const multer = require("multer");
const fs = require("fs");
const helmet = require("helmet");

// -------------------------------------------------------------------
// 1. IMPORT ROUTES & UTILS
// -------------------------------------------------------------------
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const doctorDashboardRoutes = require("./routes/doctorDashboardRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const customerRoutes = require("./routes/customerRoutes");
const pharmacistRoutes = require("./routes/pharmacistRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const refillRoutes = require("./routes/refillRoutes");
const savedMedicineRoutes = require("./routes/savedMedicineRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const messageRoutes = require("./routes/messageRoutes");

// ✅ IMPORT THE NEW CRON JOB WORKER
const startRefillReminders = require("./utils/cronJobs");

const app = express();

// -------------------------------------------------------------------
// 2. MIDDLEWARE & CONFIG
// -------------------------------------------------------------------
// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// CORS: Configured for Frontend Dev Server
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  }),
);

// Body Parsers: Increased limit for base64 images (Prescriptions)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Session Management for Passport & Security
app.use(
  session({
    secret: process.env.SESSION_SECRET || "pharmacy_secret_key_2026",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

// -------------------------------------------------------------------
// 3. STATIC FILES & DIRECTORY SETUP
// -------------------------------------------------------------------
const dirs = [
  "uploads",
  "uploads/prescriptions",
  "uploads/profiles",
  "uploads/medicines",
  "images",
];

dirs.forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "images")));

// -------------------------------------------------------------------
// 4. MOUNT ROUTES
// -------------------------------------------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin/suppliers", supplierRoutes);
app.use("/api/admin/purchases", purchaseRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/doctor", doctorDashboardRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/customer", userRoutes);
app.use("/api/customer/saved-medicines", savedMedicineRoutes);
app.use("/api/refill-reminders", refillRoutes);
app.use("/api/pharmacist", pharmacistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// -------------------------------------------------------------------
// 5. ERROR HANDLING & SERVER INITIALIZATION
// -------------------------------------------------------------------

app.get("/api/health", (req, res) =>
  res.json({
    status: "OK",
    timestamp: new Date(),
    dbConnected: mongoose.connection.readyState === 1,
  }),
);

app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  }),
);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`❌ Server Error: ${err.message}`);

  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ success: false, message: `Upload error: ${err.message}` });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/pharmacy";

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB Disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Error:", err);
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    const server = app.listen(PORT, () =>
      console.log(`🚀 Smart Pharmacy Server active on port ${PORT}`),
    );

    // ✅ INITIALIZE AUTOMATED REFILL REMINDERS
    startRefillReminders();

    process.on("SIGTERM", () => {
      console.info("SIGTERM signal received. Closing server...");
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log("MongoDB connection closed.");
          process.exit(0);
        });
      });
    });
  })
  .catch((err) => {
    console.error("❌ Critical MongoDB Connection Error:", err.message);
    process.exit(1);
  });

module.exports = app;
