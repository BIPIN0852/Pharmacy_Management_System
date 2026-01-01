// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";

// import { AuthProvider } from "./context/AuthContext";
// import Layout from "./components/Layout/Layout";
// import Login from "./components/Auth/Login";
// import PrivateRoute from "./components/Auth/PrivateRoute";
// import Dashboard from "./components/Dashboard/Dashboard";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#2c6fbb",
//     },
//     secondary: {
//       main: "#4caf50",
//     },
//   },
// });

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <AuthProvider>
//         <Router>
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route
//               path="/"
//               element={
//                 <PrivateRoute>
//                   <Layout />
//                 </PrivateRoute>
//               }
//             >
//               <Route index element={<Dashboard />} />
//               {/* Add other protected routes here */}
//             </Route>
//             <Route path="*" element={<Navigate to="/" />} />
//           </Routes>
//         </Router>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// export default App;

// // backend/app.js  (Node / Express server)
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const path = require("path");
// require("dotenv").config();

// app.use("/api/payments", paymentRoutes);

// const authRoutes = require("./routes/auth");
// const paymentRoutes = require("./routes/paymentRoutes");
// // if you have other route files, require them too:
// // const customerRoutes = require("./routes/customer");
// // const medicinesRoutes = require("./routes/medicines");
// // etc.

// const app = express();

// // ---------- MIDDLEWARE ----------
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(express.json());

// // simple logger to debug 404
// app.use((req, res, next) => {
//   console.log(req.method, req.url);
//   next();
// });

// // ---------- ROUTES ----------
// app.use("/api/auth", authRoutes);
// // app.use("/api/customers", customerRoutes);
// // app.use("/api/medicines", medicinesRoutes);

// // health check
// app.get("/api/health", (req, res) => {
//   res.json({ status: "ok" });
// });

// // ---------- DB & SERVER START ----------
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pharmacy";

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//     app.listen(PORT, () => {
//       console.log(`Backend server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   });

// // backend/app.js  (Node / Express server)
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const path = require("path");
// require("dotenv").config();

// // Import routes AFTER __app__ is defined!
// const authRoutes = require("./routes/auth");
// const paymentRoutes = require("./routes/paymentRoutes");
// // const customerRoutes = require("./routes/customer");
// // const medicinesRoutes = require("./routes/medicines");

// const app = express();

// // ---------- MIDDLEWARE ----------
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(express.json());

// // Simple logger to debug requests (including 404s)
// app.use((req, res, next) => {
//   console.log(req.method, req.url);
//   next();
// });

// // ---------- ROUTES ----------
// app.use("/api/payments", paymentRoutes);
// app.use("/api/auth", authRoutes);
// // app.use("/api/customers", customerRoutes);
// // app.use("/api/medicines", medicinesRoutes);

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({ status: "ok" });
// });

// // ---------- DB & SERVER START ----------
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pharmacy";

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//     app.listen(PORT, () => {
//       console.log(`Backend server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   });

// module.exports = app;

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const path = require("path");
// const session = require("express-session");
// const passport = require("./utils/passport"); // Ensure this file exists
// const multer = require("multer");
// const fs = require("fs");
// require("dotenv").config();

// // ---------- ROUTES IMPORTS ----------
// const authRoutes = require("./routes/auth");
// const paymentRoutes = require("./routes/paymentRoutes");
// const medicinesRoutes = require("./routes/medicineRoutes");
// const ordersRoutes = require("./routes/orders");
// const customerRoutes = require("./routes/customer");
// const customerOrderRoutes = require("./routes/customerOrders");
// const favouriteRoutes = require("./routes/favourites");
// const adminRoutes = require("./routes/admin");
// const adminOrderRoutes = require("./routes/adminOrderRoutes");
// const adminAnalyticsRoutes = require("./routes/adminAnalytics");
// const adminCustomersRoutes = require("./routes/adminCustomers");
// const pharmacistRoutes = require("./routes/pharmacist");
// const doctorRoutes = require("./routes/doctors");
// const appointmentRoutes = require("./routes/appointments");
// const prescriptionRoutes = require("./routes/prescriptions");

// const app = express();

// // ---------- MULTER CONFIGURATION (Profile Photos) ----------
// const profileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "uploads", "profiles");
//     if (!fs.existsSync(uploadPath))
//       fs.mkdirSync(uploadPath, { recursive: true });
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
//   },
// });
// const uploadProfilePhoto = multer({
//   storage: profileStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) cb(null, true);
//     else cb(new Error("Only image files are allowed!"), false);
//   },
// });

// // ---------- MIDDLEWARE ----------
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://localhost:5173"], // Support both React ports
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // Session & Passport (Required for Auth)
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "pharmacy_secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: process.env.NODE_ENV === "production" },
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// // Static Files (Images)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Logger
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// });

// // ---------- ROUTES MOUNTING ----------
// app.use("/api/auth", authRoutes); // Login, Register, Profile
// app.use("/api/payments", paymentRoutes); // Stripe, Khalti, COD
// app.use("/api/medicines", medicinesRoutes); // Medicine Catalog, Search
// app.use("/api/orders", ordersRoutes); // General Order logic
// app.use("/api/customer", customerRoutes); // Customer specific
// app.use("/api/customer/orders", customerOrderRoutes); // Customer Orders
// app.use("/api/customer/saved-medicines", favouriteRoutes); // Wishlist

// // Admin Routes
// app.use("/api/admin", adminRoutes);
// app.use("/api/admin", adminOrderRoutes);
// app.use("/api/admin", adminAnalyticsRoutes);
// app.use("/api", adminCustomersRoutes); // /api/customers/admin

// // Other Roles
// app.use("/api/pharmacist", pharmacistRoutes);
// app.use("/api/doctors", doctorRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/prescriptions", prescriptionRoutes);

// // Profile Photo Upload Endpoint
// app.post(
//   "/api/customer/profile/photo",
//   uploadProfilePhoto.single("profilePhoto"),
//   (req, res) => {
//     if (!req.file)
//       return res.status(400).json({ message: "No file uploaded." });
//     res.json({
//       filename: req.file.filename,
//       url: `/uploads/profiles/${req.file.filename}`,
//     });
//   }
// );

// // Health Check
// app.get("/api/health", (req, res) => {
//   res.json({ status: "ok", message: "Pharmacy Backend Running 🚀" });
// });

// // 404 Handler
// app.use((req, res) => {
//   res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
// });

// // Error Handler
// app.use((err, req, res, next) => {
//   console.error("❌ Error:", err.message);
//   if (err instanceof multer.MulterError) {
//     return res
//       .status(400)
//       .json({ message: "File upload error: " + err.message });
//   }
//   res
//     .status(err.status || 500)
//     .json({ message: err.message || "Server Error" });
// });

// // ---------- DB & SERVER START ----------
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pharmacy";

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected successfully");
//     app.listen(PORT, () => {
//       console.log(`🚀 Backend server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   });

// module.exports = app;

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const passport = require("./utils/passport"); // Ensure this file exists
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

// ---------- ROUTES IMPORTS ----------
const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/paymentRoutes");
// ✅ FIX: Changed import to match your actual filename 'medicines.js'
const medicinesRoutes = require("./routes/medicines");
const ordersRoutes = require("./routes/orders");
const customerRoutes = require("./routes/customer");
const customerOrderRoutes = require("./routes/customerOrders");
const favouriteRoutes = require("./routes/favourites");
const adminRoutes = require("./routes/admin");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const adminAnalyticsRoutes = require("./routes/adminAnalytics");
const adminCustomersRoutes = require("./routes/adminCustomers");
const pharmacistRoutes = require("./routes/pharmacist");
const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");
const prescriptionRoutes = require("./routes/prescriptions");

const app = express();

// ---------- MULTER CONFIGURATION (Profile Photos) ----------
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads", "profiles");
    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const uploadProfilePhoto = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"), false);
  },
});

// ---------- MIDDLEWARE ----------
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Support both React ports
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Session & Passport (Required for Auth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "pharmacy_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Static Files (Images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ---------- ROUTES MOUNTING ----------
app.use("/api/auth", authRoutes); // Login, Register, Profile
app.use("/api/payments", paymentRoutes); // Stripe, Khalti, COD
app.use("/api/medicines", medicinesRoutes); // Medicine Catalog, Search
app.use("/api/orders", ordersRoutes); // General Order logic
app.use("/api/customer", customerRoutes); // Customer specific
app.use("/api/customer/orders", customerOrderRoutes); // Customer Orders
app.use("/api/customer/saved-medicines", favouriteRoutes); // Wishlist

// Admin Routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminOrderRoutes);
app.use("/api/admin", adminAnalyticsRoutes);
app.use("/api", adminCustomersRoutes); // /api/customers/admin

// Other Roles
app.use("/api/pharmacist", pharmacistRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

// Profile Photo Upload Endpoint
app.post(
  "/api/customer/profile/photo",
  uploadProfilePhoto.single("profilePhoto"),
  (req, res) => {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded." });
    res.json({
      filename: req.file.filename,
      url: `/uploads/profiles/${req.file.filename}`,
    });
  }
);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Pharmacy Backend Running 🚀" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ message: "File upload error: " + err.message });
  }
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
});

// ---------- DB & SERVER START ----------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pharmacy";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = app;
