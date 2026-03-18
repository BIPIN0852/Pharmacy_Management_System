import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Skip breadcrumbs on core authentication/landing pages
  const skipPaths = ["/", "/login", "/register", "/verify-otp", "/admin/login"];
  if (skipPaths.includes(location.pathname) || pathnames.length === 0) {
    return null;
  }

  // Map URL segments to human-readable titles
  const routeNameMap = {
    // --- Customer ---
    "customer-dashboard": "Dashboard",
    medicines: "Pharmacy Store",
    medicine: "Product Details",
    cart: "Shopping Cart",
    appointments: "My Appointments",
    orders: "Order History",
    prescriptions: "My Prescriptions",
    profile: "User Profile",
    shipping: "Shipping",
    placeorder: "Review Order",
    payment: "Checkout",
    "payment-success": "Confirmation",

    // --- Admin & Staff ---
    admin: "Administration",
    dashboard: "Analytics",
    users: "User List",
    doctors: "Medical Staff",
    suppliers: "Inventory Sources",
    reports: "Business Reports",
    settings: "System Config",

    // --- Pharmacist ---
    pharmacist: "Staff Portal",
    inventory: "Stock Management",
    alerts: "Expiry Alerts",
    customers: "Patient Records",
    "refill-reminders": "Refill Queue",
  };

  const isId = (segment) => /^[a-f\d]{24}$/i.test(segment);

  // Helper to determine the correct dashboard link based on the URL context
  const getDashboardPath = () => {
    if (location.pathname.startsWith("/admin")) return "/admin/dashboard";
    if (location.pathname.startsWith("/pharmacist"))
      return "/pharmacist/dashboard";
    return "/customer-dashboard";
  };

  return (
    <nav
      aria-label="breadcrumb"
      className="mb-3 animate-fade-in d-none d-sm-block mt-2"
    >
      <ol className="breadcrumb mb-0 align-items-center bg-transparent px-0 py-0">
        {/* Home Link */}
        <li className="breadcrumb-item d-flex align-items-center">
          <Link
            to={getDashboardPath()}
            className="text-decoration-none d-flex align-items-center amazon-breadcrumb-link"
            style={{ color: "#565959" }}
          >
            <span className="small">Home</span>
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          let displayName = routeNameMap[value.toLowerCase()];

          // Fallback logic
          if (!displayName) {
            if (isId(value)) {
              displayName = "Reference ID";
            } else {
              displayName =
                value.replace(/-/g, " ").charAt(0).toUpperCase() +
                value.slice(1).replace(/-/g, " ");
            }
          }

          return isLast ? (
            <li
              key={to}
              className="breadcrumb-item active d-flex align-items-center small"
              aria-current="page"
              style={{ color: "#007185", fontWeight: "600" }}
            >
              <ChevronRight
                size={14}
                className="mx-1"
                style={{ color: "#565959" }}
              />
              {displayName}
            </li>
          ) : (
            <li
              key={to}
              className="breadcrumb-item d-flex align-items-center small"
            >
              <ChevronRight
                size={14}
                className="mx-1"
                style={{ color: "#565959" }}
              />
              {/* Logic to keep parent paths unclickable if they are just segments */}
              {["admin", "pharmacist"].includes(value.toLowerCase()) ? (
                <span style={{ color: "#565959" }}>{displayName}</span>
              ) : (
                <Link
                  to={to}
                  className="text-decoration-none amazon-breadcrumb-link"
                  style={{ color: "#565959" }}
                >
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      <style>{`
        .breadcrumb-item + .breadcrumb-item::before {
          display: none; /* Remove default Bootstrap slash separators */
        }
        .amazon-breadcrumb-link {
          transition: color 0.1s ease;
        }
        .amazon-breadcrumb-link:hover {
          color: #C7511F !important; /* Amazon Hover Orange/Red */
          text-decoration: underline !important;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </nav>
  );
};

export default Breadcrumbs;
