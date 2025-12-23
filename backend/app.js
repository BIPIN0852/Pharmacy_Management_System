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

// backend/app.js  (Node / Express server)
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// Import routes AFTER __app__ is defined!
const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/paymentRoutes");
// const customerRoutes = require("./routes/customer");
// const medicinesRoutes = require("./routes/medicines");

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Simple logger to debug requests (including 404s)
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// ---------- ROUTES ----------
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/customers", customerRoutes);
// app.use("/api/medicines", medicinesRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ---------- DB & SERVER START ----------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pharmacy";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = app;
