// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import CustomerDashboard from "./pages/CustomerDashboard";
// import AdminDashboard from "./pages/AdminDashboard";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<CustomerDashboard />} />
//         <Route path="/admin-dashboard" element={<AdminDashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { Navigate } from "react-router-dom";

// Components
import ProtectedRoute from "../components/ProtectedRoute";

// Pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import CustomerDashboard from "../pages/CustomerDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import PharmacistDashboard from "../pages/PharmacistDashboard";
import AdminCreateUser from "../pages/AdminCreateUser";
import OrderConfirmation from "../pages/OrderConfirmation";

/**
 * Global Route Configuration
 * Define all application routes here for a cleaner App.js
 */
const routes = [
  // --- Public Routes ---
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // --- Customer Protected Routes ---
  {
    path: "/customer-dashboard",
    element: (
      <ProtectedRoute allowedRoles={["customer"]}>
        <CustomerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-success",
    element: (
      <ProtectedRoute allowedRoles={["customer"]}>
        <OrderConfirmation />
      </ProtectedRoute>
    ),
  },

  // --- Pharmacist Protected Routes ---
  {
    path: "/pharmacist/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["pharmacist"]}>
        <PharmacistDashboard />
      </ProtectedRoute>
    ),
  },

  // --- Admin Protected Routes ---
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminCreateUser />
      </ProtectedRoute>
    ),
  },

  // --- Redirects & Fallbacks ---
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/dashboard", // Legacy redirect
    element: <Navigate to="/customer-dashboard" replace />,
  },
  {
    path: "*",
    element: (
      <div className="vh-100 d-flex flex-column align-items-center justify-content-center">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <p className="fs-4 text-muted">Page Not Found</p>
        <Navigate to="/" className="btn btn-primary mt-3">
          Back to Home
        </Navigate>
      </div>
    ),
  },
];

export default routes;
