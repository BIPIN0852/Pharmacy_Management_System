// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { ChevronRight, Home } from "lucide-react";

// const Breadcrumbs = () => {
//   const location = useLocation();
//   const pathnames = location.pathname.split("/").filter((x) => x);

//   // Skip breadcrumbs on Home, Login, and Register pages
//   const skipPaths = ["/", "/login", "/register", "/verify-otp", "/admin/login"];
//   if (skipPaths.includes(location.pathname) || pathnames.length === 0) {
//     return null;
//   }

//   // Map URL paths to readable names
//   const routeNameMap = {
//     // --- Customer ---
//     "customer-dashboard": "Dashboard",
//     medicines: "Medicine Store",
//     medicine: "Medicine Details",
//     cart: "Shopping Cart",
//     appointments: "My Appointments",
//     orders: "Order History",
//     prescriptions: "My Prescriptions",
//     profile: "My Profile",
//     shipping: "Shipping Address",
//     placeorder: "Order Summary",
//     payment: "Payment",
//     "payment-success": "Order Confirmed",

//     // --- Admin ---
//     admin: "Admin Panel",
//     dashboard: "Dashboard",
//     users: "User Management",
//     doctors: "Doctor Management",
//     suppliers: "Suppliers",
//     purchases: "Purchase Orders",
//     reports: "System Reports",
//     settings: "Settings",

//     // --- Pharmacist ---
//     pharmacist: "Staff Portal", // Root for /pharmacist
//     inventory: "Inventory Management",
//     alerts: "Stock Alerts",
//     customers: "Customer Database",
//   };

//   // Helper to check if a segment looks like a MongoDB ID (24 hex chars)
//   const isId = (segment) => /^[a-f\d]{24}$/i.test(segment);

//   return (
//     <nav aria-label="breadcrumb" className="mb-4 fade-in">
//       <ol className="breadcrumb mb-0 align-items-center bg-white px-3 py-2 rounded shadow-sm border">
//         {/* Home Link */}
//         <li className="breadcrumb-item">
//           <Link
//             to="/"
//             className="text-decoration-none text-muted d-flex align-items-center hover-primary"
//           >
//             <Home size={14} className="me-1" /> Home
//           </Link>
//         </li>

//         {pathnames.map((value, index) => {
//           // Build the path up to this segment
//           const to = `/${pathnames.slice(0, index + 1).join("/")}`;
//           const isLast = index === pathnames.length - 1;

//           // Determine display name
//           let displayName = routeNameMap[value.toLowerCase()];

//           // Fallback logic for names not in map
//           if (!displayName) {
//             if (isId(value)) {
//               displayName = "Details"; // or "Item #..."
//             } else {
//               // Capitalize first letter: "prescriptions" -> "Prescriptions"
//               displayName = value.charAt(0).toUpperCase() + value.slice(1);
//             }
//           }

//           return isLast ? (
//             <li
//               key={to}
//               className="breadcrumb-item active d-flex align-items-center text-primary fw-bold"
//               aria-current="page"
//             >
//               <ChevronRight size={14} className="mx-2 text-muted" />
//               {displayName}
//             </li>
//           ) : (
//             <li key={to} className="breadcrumb-item d-flex align-items-center">
//               <ChevronRight size={14} className="mx-2 text-muted" />
//               {/* Disable link if it's just a grouping path like '/admin' without dashboard */}
//               {value === "admin" || value === "pharmacist" ? (
//                 <span className="text-muted">{displayName}</span>
//               ) : (
//                 <Link
//                   to={to}
//                   className="text-decoration-none text-muted hover-primary"
//                 >
//                   {displayName}
//                 </Link>
//               )}
//             </li>
//           );
//         })}
//       </ol>
//       <style>{`
//         .hover-primary:hover { color: var(--bs-primary) !important; text-decoration: underline !important; }
//       `}</style>
//     </nav>
//   );
// };

// export default Breadcrumbs;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

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
    cart: "My Cart",
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
      className="mb-4 animate-fade-in d-none d-sm-block"
    >
      <ol className="breadcrumb mb-0 align-items-center bg-white px-3 py-2 rounded-3 shadow-sm border border-light">
        {/* Home Link */}
        <li className="breadcrumb-item">
          <Link
            to={getDashboardPath()}
            className="text-decoration-none text-muted d-flex align-items-center breadcrumb-hover"
          >
            <Home size={14} className="me-1" />
            <span className="small fw-medium">Home</span>
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
              className="breadcrumb-item active d-flex align-items-center text-primary fw-bold small"
              aria-current="page"
            >
              <ChevronRight
                size={14}
                className="mx-2 text-secondary opacity-50"
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
                className="mx-2 text-secondary opacity-50"
              />
              {/* Logic to keep parent paths unclickable if they are just segments */}
              {["admin", "pharmacist"].includes(value.toLowerCase()) ? (
                <span className="text-muted fw-medium">{displayName}</span>
              ) : (
                <Link
                  to={to}
                  className="text-decoration-none text-muted fw-medium breadcrumb-hover"
                >
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      <style>{`
        .breadcrumb-hover {
          transition: color 0.2s ease;
        }
        .breadcrumb-hover:hover {
          color: #0d6efd !important;
          text-decoration: underline !important;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
};

export default Breadcrumbs;
