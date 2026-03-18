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
