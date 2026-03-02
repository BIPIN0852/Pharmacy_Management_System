// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;
//   return children;
// };

// export default ProtectedRoute;

// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// /**
//  * @param {Array} allowedRoles - Optional array of roles allowed to access the route
//  * @example <ProtectedRoute allowedRoles={['admin', 'pharmacist']}><Dashboard /></ProtectedRoute>
//  */
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   // 1. Handle Loading State
//   // Prevents redirecting to login while the AuthContext is still checking the token/session
//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   // 2. Not Logged In
//   // Redirect to login and save the current location so we can redirect back after login
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // 3. Role-Based Authorization
//   // If allowedRoles is provided, check if the current user's role matches
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     console.warn(
//       `Access Denied: Role '${user.role}' is not authorized for this route.`
//     );

//     // Redirect unauthorized users to their respective dashboards
//     const fallbackPath =
//       user.role === "admin"
//         ? "/admin/dashboard"
//         : user.role === "pharmacist"
//         ? "/pharmacist/dashboard"
//         : "/customer-dashboard";

//     return <Navigate to={fallbackPath} replace />;
//   }

//   // 4. Authorized
//   return children;
// };

// export default ProtectedRoute;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, initLoading } = useAuth();
  const location = useLocation();

  if (initLoading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <Loader2
          className="spin-animation mb-3"
          style={{ color: "#007185" }}
          size={48}
        />
        <span className="text-secondary fw-bold tracking-wider text-uppercase small">
          Verifying Secure Session...
        </span>
        <style>{`
          .spin-animation { animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
          .tracking-wider { letter-spacing: 0.05em; }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Access Denied: Role '${user.role}' is not authorized.`);

    // ✅ UPDATED: Added the Doctor fallback path
    const fallbackPath =
      user.role === "admin"
        ? "/admin/dashboard"
        : user.role === "pharmacist"
          ? "/pharmacist/dashboard"
          : user.role === "doctor"
            ? "/doctor/dashboard" // <-- Sends doctors to their dashboard
            : "/customer-dashboard";

    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
