// // src/layouts/RootLayout.jsx
// import React from "react";
// import AppFooter from "../components/AppFooter";

// const RootLayout = ({ children }) => {
//   return (
//     <div className="d-flex flex-column min-vh-100 bg-light">
//       <main className="flex-grow-1">{children}</main>

//       {/* Footer on EVERY page */}
//       <AppFooter context="Pharmacy Management System" />
//     </div>
//   );
// };

// export default RootLayout;

// src/layouts/RootLayout.jsx
import React from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import AppFooter from "../components/AppFooter";

const RootLayout = ({ children }) => {
  const location = useLocation();
  const navigationType = useNavigationType();

  // Simple breadcrumb logic based on current path
  const getBreadcrumbs = () => {
    const path = location.pathname;

    if (path === "/") return [{ label: "Home", href: "/" }];
    if (path === "/login") return [{ label: "Login", href: "/login" }];
    if (path === "/register") return [{ label: "Register", href: "/register" }];
    if (path.startsWith("/admin"))
      return [
        { label: "Home", href: "/" },
        { label: "Admin", href: "/admin/dashboard" },
      ];
    if (path === "/customer-dashboard")
      return [
        { label: "Home", href: "/" },
        { label: "Customer Dashboard", href: "/customer-dashboard" },
      ];
    if (path === "/pharmacist-dashboard")
      return [
        { label: "Home", href: "/" },
        { label: "Pharmacist Dashboard", href: "/pharmacist-dashboard" },
      ];

    // Specific pages
    const pages = {
      "/about": ["Home", "About"],
      "/contact": ["Home", "Contact"],
      "/faq": ["Home", "FAQ"],
      "/support": ["Home", "Support"],
      "/privacy": ["Home", "Privacy"],
      "/status": ["Home", "Status"],
      "/profile": ["Home", "Profile"],
      "/cart": ["Home", "Cart"],
      "/medicines": ["Home", "Medicines"],
    };

    const pageCrumbs = pages[path];
    if (pageCrumbs) {
      return pageCrumbs.map((label, i) => ({
        label,
        href: i === 0 ? "/" : path,
      }));
    }

    return [
      { label: "Home", href: "/" },
      { label: location.pathname.slice(1), href: path },
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Breadcrumbs */}
      {navigationType !== "POP" && breadcrumbs.length > 1 && (
        <nav
          aria-label="breadcrumb"
          className="bg-white border-bottom shadow-sm"
        >
          <div className="container py-2">
            <ol className="breadcrumb mb-0">
              {breadcrumbs.map((crumb, index) => (
                <li
                  key={crumb.href || index}
                  className={`breadcrumb-item ${
                    index === breadcrumbs.length - 1 ? "active" : ""
                  }`}
                >
                  {index === breadcrumbs.length - 1 ? (
                    crumb.label
                  ) : (
                    <a href={crumb.href} className="text-decoration-none">
                      {crumb.label}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className="flex-grow-1">{children}</main>

      {/* Footer on EVERY page */}
      <AppFooter context="Pharmacy Management System" />
    </div>
  );
};

export default RootLayout;
