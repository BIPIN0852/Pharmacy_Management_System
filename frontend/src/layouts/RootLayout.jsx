// // src/layouts/RootLayout.jsx
// import React from "react";
// import { useLocation, useNavigationType } from "react-router-dom";
// import AppFooter from "../components/AppFooter";

// const RootLayout = ({ children }) => {
//   const location = useLocation();
//   const navigationType = useNavigationType();

//   // Simple breadcrumb logic based on current path
//   const getBreadcrumbs = () => {
//     const path = location.pathname;

//     if (path === "/") return [{ label: "Home", href: "/" }];
//     if (path === "/login") return [{ label: "Login", href: "/login" }];
//     if (path === "/register") return [{ label: "Register", href: "/register" }];

//     if (path.startsWith("/admin"))
//       return [
//         { label: "Home", href: "/" },
//         { label: "Admin", href: "/admin/dashboard" },
//       ];

//     if (path.startsWith("/doctor"))
//       return [
//         { label: "Home", href: "/" },
//         { label: "Doctor Portal", href: "/doctor/dashboard" },
//       ];

//     if (path === "/customer-dashboard")
//       return [
//         { label: "Home", href: "/" },
//         { label: "Customer Dashboard", href: "/customer-dashboard" },
//       ];

//     if (path.startsWith("/pharmacist"))
//       return [
//         { label: "Home", href: "/" },
//         { label: "Pharmacist Dashboard", href: "/pharmacist/dashboard" },
//       ];

//     // Specific pages
//     const pages = {
//       "/about": ["Home", "About"],
//       "/contact": ["Home", "Contact"],
//       "/faq": ["Home", "FAQ"],
//       "/support": ["Home", "Support"],
//       "/privacy": ["Home", "Privacy"],
//       "/status": ["Home", "Status"],
//       "/profile": ["Home", "Profile"],
//       "/cart": ["Home", "Cart"],
//       "/medicines": ["Home", "Medicines"],
//     };

//     const pageCrumbs = pages[path];
//     if (pageCrumbs) {
//       return pageCrumbs.map((label, i) => ({
//         label,
//         href: i === 0 ? "/" : path,
//       }));
//     }

//     return [
//       { label: "Home", href: "/" },
//       { label: location.pathname.slice(1), href: path },
//     ];
//   };

//   const breadcrumbs = getBreadcrumbs();

//   // ✅ NEW LOGIC: Determine if we should hide the footer
//   // It checks if the current URL starts with any of the dashboard paths
//   const hideFooterPaths = [
//     "/admin",
//     "/pharmacist",
//     "/doctor",
//     "/customer-dashboard",
//     "/profile",
//   ];
//   const shouldHideFooter = hideFooterPaths.some((path) =>
//     location.pathname.startsWith(path),
//   );

//   return (
//     <div
//       className="d-flex flex-column min-vh-100"
//       style={{
//         backgroundColor: "#f0f2f2",
//         fontFamily: "'Inter', system-ui, sans-serif",
//       }}
//     >
//       {/* Breadcrumbs (Amazon/AWS Style) */}
//       {navigationType !== "POP" && breadcrumbs.length > 1 && (
//         <nav
//           aria-label="breadcrumb"
//           className="bg-white w-100"
//           style={{
//             borderBottom: "1px solid #D5D9D9",
//             padding: "8px 0",
//             zIndex: 10,
//           }}
//         >
//           <div className="container-fluid px-3 px-md-4">
//             <ol className="breadcrumb mb-0" style={{ fontSize: "0.85rem" }}>
//               {breadcrumbs.map((crumb, index) => (
//                 <li
//                   key={crumb.href || index}
//                   className={`breadcrumb-item ${
//                     index === breadcrumbs.length - 1 ? "active" : ""
//                   }`}
//                   aria-current={
//                     index === breadcrumbs.length - 1 ? "page" : undefined
//                   }
//                 >
//                   {index === breadcrumbs.length - 1 ? (
//                     <span style={{ color: "#565959", fontWeight: "500" }}>
//                       {crumb.label}
//                     </span>
//                   ) : (
//                     <a
//                       href={crumb.href}
//                       className="text-decoration-none hover-underline fw-medium"
//                       style={{ color: "#007185" }}
//                     >
//                       {crumb.label}
//                     </a>
//                   )}
//                 </li>
//               ))}
//             </ol>
//           </div>
//         </nav>
//       )}

//       {/* Main content */}
//       <main className="flex-grow-1 d-flex flex-column">{children}</main>

//       {/* ✅ DYNAMIC FOOTER: Only shows on public/shopping pages */}
//       {!shouldHideFooter && <AppFooter context="Pharmacy Management System" />}

//       {/* Global Breadcrumb Styling */}
//       <style>{`
//         /* Change the bootstrap slash to an AWS style chevron/arrow */
//         .breadcrumb-item + .breadcrumb-item::before {
//           content: "›";
//           color: #565959;
//           font-size: 1.1rem;
//           line-height: 1;
//           vertical-align: middle;
//         }

//         /* Amazon link hover effect */
//         .hover-underline:hover {
//           text-decoration: underline !important;
//           color: #C7511F !important;
//         }
//       `}</style>
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

    if (path.startsWith("/doctor"))
      return [
        { label: "Home", href: "/" },
        { label: "Doctor Portal", href: "/doctor/dashboard" },
      ];

    if (path === "/customer-dashboard")
      return [
        { label: "Home", href: "/" },
        { label: "Customer Dashboard", href: "/customer-dashboard" },
      ];

    if (path.startsWith("/pharmacist"))
      return [
        { label: "Home", href: "/" },
        { label: "Pharmacist Dashboard", href: "/pharmacist/dashboard" },
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

  // ✅ NEW LOGIC: Strictly show the footer ONLY on the Home Page
  // (If you ever want it on /about or /contact too, just change this to: ["/", "/about", "/contact"].includes(location.pathname) )
  const shouldShowFooter = location.pathname === "/";

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{
        backgroundColor: "#f0f2f2",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Breadcrumbs (Amazon/AWS Style) */}
      {navigationType !== "POP" && breadcrumbs.length > 1 && (
        <nav
          aria-label="breadcrumb"
          className="bg-white w-100"
          style={{
            borderBottom: "1px solid #D5D9D9",
            padding: "8px 0",
            zIndex: 10,
          }}
        >
          <div className="container-fluid px-3 px-md-4">
            <ol className="breadcrumb mb-0" style={{ fontSize: "0.85rem" }}>
              {breadcrumbs.map((crumb, index) => (
                <li
                  key={crumb.href || index}
                  className={`breadcrumb-item ${
                    index === breadcrumbs.length - 1 ? "active" : ""
                  }`}
                  aria-current={
                    index === breadcrumbs.length - 1 ? "page" : undefined
                  }
                >
                  {index === breadcrumbs.length - 1 ? (
                    <span style={{ color: "#565959", fontWeight: "500" }}>
                      {crumb.label}
                    </span>
                  ) : (
                    <a
                      href={crumb.href}
                      className="text-decoration-none hover-underline fw-medium"
                      style={{ color: "#007185" }}
                    >
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
      <main className="flex-grow-1 d-flex flex-column">{children}</main>

      {/* ✅ DYNAMIC FOOTER: Now only renders if the URL is exactly "/" */}
      {shouldShowFooter && <AppFooter context="Pharmacy Management System" />}

      {/* Global Breadcrumb Styling */}
      <style>{`
        /* Change the bootstrap slash to an AWS style chevron/arrow */
        .breadcrumb-item + .breadcrumb-item::before {
          content: "›";
          color: #565959;
          font-size: 1.1rem;
          line-height: 1;
          vertical-align: middle;
        }
        
        /* Amazon link hover effect */
        .hover-underline:hover {
          text-decoration: underline !important;
          color: #C7511F !important;
        }
      `}</style>
    </div>
  );
};

export default RootLayout;
