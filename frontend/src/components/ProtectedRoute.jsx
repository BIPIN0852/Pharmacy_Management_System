// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;
//   return children;
// };

// export default ProtectedRoute;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * @param {Array} allowedRoles - Optional array of roles allowed to access the route
 * @example <ProtectedRoute allowedRoles={['admin', 'pharmacist']}><Dashboard /></ProtectedRoute>
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Handle Loading State
  // Prevents redirecting to login while the AuthContext is still checking the token/session
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // 2. Not Logged In
  // Redirect to login and save the current location so we can redirect back after login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role-Based Authorization
  // If allowedRoles is provided, check if the current user's role matches
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(
      `Access Denied: Role '${user.role}' is not authorized for this route.`
    );

    // Redirect unauthorized users to their respective dashboards
    const fallbackPath =
      user.role === "admin"
        ? "/admin/dashboard"
        : user.role === "pharmacist"
        ? "/pharmacist/dashboard"
        : "/customer-dashboard";

    return <Navigate to={fallbackPath} replace />;
  }

  // 4. Authorized
  return children;
};

export default ProtectedRoute;
