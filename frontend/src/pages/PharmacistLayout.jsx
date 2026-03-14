// import React from "react";
// import { Outlet } from "react-router-dom";
// import PharmacistSidebar from "../components/PharmacistSidebar";
// import { Bell, User } from "lucide-react";

// const PharmacistLayout = () => {
//   return (
//     <div className="d-flex min-vh-100 bg-light">
//       <PharmacistSidebar />
//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         {/* Header */}
//         <header className="bg-white shadow-sm border-bottom px-4 py-3 flex-shrink-0">
//           <div className="d-flex align-items-center justify-content-between">
//             <h4 className="mb-0 fw-bold text-dark">Pharmacist Dashboard</h4>
//             <div className="d-flex align-items-center gap-3">
//               <button className="btn btn-light rounded-circle p-2 border position-relative">
//                 <Bell size={20} className="text-muted" />
//                 <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
//               </button>
//               <div className="d-flex align-items-center gap-2 border-start ps-3">
//                 <div className="text-end d-none d-md-block">
//                   <div className="fw-bold small">Staff User</div>
//                   <small className="text-muted" style={{ fontSize: "0.7rem" }}>
//                     Pharmacist
//                   </small>
//                 </div>
//                 <div className="bg-success bg-opacity-10 p-2 rounded-circle text-success">
//                   <User size={20} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Content */}
//         <main className="flex-grow-1 p-4 overflow-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default PharmacistLayout;

// import React from "react";
// import { Outlet } from "react-router-dom";
// import PharmacistSidebar from "../components/PharmacistSidebar";
// import Breadcrumbs from "../components/Breadcrumbs"; // ✅ IMPORT BREADCRUMBS
// import { Bell, User } from "lucide-react";

// const PharmacistLayout = () => {
//   return (
//     <div className="d-flex min-vh-100 bg-light">
//       {/* Sidebar */}
//       <PharmacistSidebar />

//       {/* Main Wrapper */}
//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         {/* Header */}
//         <header className="bg-white shadow-sm border-bottom px-4 py-3 flex-shrink-0">
//           <div className="d-flex align-items-center justify-content-between">
//             <h4 className="mb-0 fw-bold text-dark">Pharmacist Dashboard</h4>

//             <div className="d-flex align-items-center gap-3">
//               {/* Notifications */}
//               <button className="btn btn-light rounded-circle p-2 border position-relative">
//                 <Bell size={20} className="text-muted" />
//                 <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
//               </button>

//               {/* User Profile */}
//               <div className="d-flex align-items-center gap-2 border-start ps-3">
//                 <div className="text-end d-none d-md-block">
//                   <div className="fw-bold small">Staff User</div>
//                   <small className="text-muted" style={{ fontSize: "0.7rem" }}>
//                     Pharmacist
//                   </small>
//                 </div>
//                 <div className="bg-success bg-opacity-10 p-2 rounded-circle text-success">
//                   <User size={20} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Content Area */}
//         <main className="flex-grow-1 p-4 overflow-auto bg-light">
//           {/* ✅ ADD BREADCRUMBS HERE */}
//           <Breadcrumbs />

//           {/* Render Page Content */}
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default PharmacistLayout;

// import React from "react";
// import { Outlet } from "react-router-dom";
// import PharmacistSidebar from "../components/PharmacistSidebar";
// import Breadcrumbs from "../components/Breadcrumbs"; // ✅ IMPORT BREADCRUMBS
// import { Bell, UserCircle } from "lucide-react";

// const PharmacistLayout = () => {
//   return (
//     <div className="d-flex min-vh-100" style={{ backgroundColor: "#f0f2f2" }}>
//       {/* Sidebar */}
//       <PharmacistSidebar />

//       {/* Main Wrapper */}
//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         {/* Header */}
//         <header
//           className="bg-white px-4 py-3 flex-shrink-0"
//           style={{ borderBottom: "1px solid #D5D9D9" }}
//         >
//           <div className="d-flex align-items-center justify-content-between">
//             <h4
//               className="mb-0 fw-bold"
//               style={{ color: "#0F1111", fontSize: "1.25rem" }}
//             >
//               Pharmacist Workspace
//             </h4>

//             <div className="d-flex align-items-center gap-4">
//               {/* Notifications */}
//               <div className="position-relative" style={{ cursor: "pointer" }}>
//                 <Bell size={22} style={{ color: "#565959" }} />
//                 <span
//                   className="position-absolute top-0 start-100 translate-middle rounded-pill"
//                   style={{
//                     backgroundColor: "#B12704",
//                     width: "10px",
//                     height: "10px",
//                     border: "2px solid #fff",
//                   }}
//                 ></span>
//               </div>

//               {/* User Profile */}
//               <div
//                 className="d-flex align-items-center gap-3 border-start ps-4"
//                 style={{ borderColor: "#D5D9D9 !important" }}
//               >
//                 <div className="text-end d-none d-md-block">
//                   <div
//                     className="fw-bold small"
//                     style={{ color: "#0F1111", lineHeight: "1.2" }}
//                   >
//                     Staff User
//                   </div>
//                   <div
//                     className="fw-medium mt-1"
//                     style={{ fontSize: "0.75rem", color: "#007185" }}
//                   >
//                     Pharmacist
//                   </div>
//                 </div>
//                 <div className="d-flex align-items-center justify-content-center">
//                   <UserCircle
//                     size={32}
//                     style={{ color: "#565959", strokeWidth: "1.5" }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Content Area */}
//         <main
//           className="flex-grow-1 p-3 p-md-4 overflow-auto"
//           style={{ backgroundColor: "#f0f2f2" }}
//         >
//           {/* ✅ ADD BREADCRUMBS HERE */}
//           <Breadcrumbs />

//           {/* Render Page Content */}
//           <div className="mt-2">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default PharmacistLayout;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { Dropdown, Badge } from "react-bootstrap";
// import PharmacistSidebar from "../components/PharmacistSidebar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import {
//   Bell,
//   UserCircle,
//   Package,
//   FileText,
//   TrendingDown,
//   CheckCircle2,
//   LogOut,
// } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import api from "../services/api";

// const PharmacistLayout = () => {
//   const { user, logout } = useAuth(); // ✅ Added logout here
//   const navigate = useNavigate();

//   // Notification States
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);

//   // Fetch real-time system alerts
//   const fetchNotifications = async () => {
//     try {
//       const { data } = await api.get("/pharmacist/dashboard");
//       const alerts = [];

//       if (data.pendingOrdersCount > 0) {
//         alerts.push({
//           id: "orders",
//           type: "order",
//           title: "Pending Orders",
//           message: `${data.pendingOrdersCount} orders waiting for fulfillment.`,
//           link: "/pharmacist/orders",
//           icon: Package,
//           color: "text-primary",
//         });
//       }
//       if (data.pendingPrescriptionsCount > 0) {
//         alerts.push({
//           id: "rx",
//           type: "prescription",
//           title: "Rx Verification Required",
//           message: `${data.pendingPrescriptionsCount} digital prescriptions need review.`,
//           link: "/pharmacist/prescriptions",
//           icon: FileText,
//           color: "text-info",
//         });
//       }
//       if (data.lowStockCount > 0) {
//         alerts.push({
//           id: "stock",
//           type: "inventory",
//           title: "Low Stock Alert",
//           message: `${data.lowStockCount} items have fallen below threshold.`,
//           link: "/pharmacist/inventory",
//           icon: TrendingDown,
//           color: "text-danger",
//         });
//       }

//       setNotifications(alerts);
//       setUnreadCount(alerts.length);
//     } catch (err) {
//       console.error("Failed to fetch notifications", err);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     // Poll every 60 seconds to keep notifications fresh
//     const interval = setInterval(fetchNotifications, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleClearNotifications = () => {
//     setUnreadCount(0); // Simulates marking them as read locally
//   };

//   // ✅ Added logout handler
//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className="d-flex min-vh-100" style={{ backgroundColor: "#f0f2f2" }}>
//       {/* Sidebar */}
//       <PharmacistSidebar />

//       {/* Main Wrapper */}
//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         {/* Header */}
//         <header
//           className="bg-white px-4 py-3 flex-shrink-0 position-relative z-3 shadow-sm"
//           style={{ borderBottom: "1px solid #D5D9D9" }}
//         >
//           <div className="d-flex align-items-center justify-content-between">
//             <h4
//               className="mb-0 fw-bold"
//               style={{ color: "#0F1111", fontSize: "1.25rem" }}
//             >
//               Pharmacist Workspace
//             </h4>

//             <div className="d-flex align-items-center gap-4">
//               {/* ✅ DYNAMIC NOTIFICATIONS DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center"
//                 >
//                   <Bell size={24} style={{ color: "#565959" }} />
//                   {unreadCount > 0 && (
//                     <span
//                       className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white"
//                       style={{ fontSize: "0.65rem", padding: "0.25em 0.4em" }}
//                     >
//                       {unreadCount}
//                     </span>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden"
//                   style={{ width: "320px", marginTop: "12px" }}
//                 >
//                   <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-dark mb-0">
//                       System Alerts
//                     </span>
//                     <Badge bg="secondary" className="rounded-pill">
//                       {unreadCount} New
//                     </Badge>
//                   </div>

//                   <div style={{ maxHeight: "350px", overflowY: "auto" }}>
//                     {notifications.length === 0 ? (
//                       <div className="p-4 text-center text-muted">
//                         <CheckCircle2
//                           size={32}
//                           className="mb-2 text-success opacity-50"
//                         />
//                         <p className="small mb-0 fw-medium">
//                           You are all caught up!
//                         </p>
//                       </div>
//                     ) : (
//                       notifications.map((n) => (
//                         <Dropdown.Item
//                           key={n.id}
//                           onClick={() => navigate(n.link)}
//                           className="p-3 border-bottom text-wrap hover-bg-light transition-all"
//                         >
//                           <div className="d-flex gap-3 align-items-start">
//                             <div className={`mt-1 flex-shrink-0 ${n.color}`}>
//                               <n.icon size={18} />
//                             </div>
//                             <div>
//                               <div className="fw-bold text-dark mb-1 fs-6">
//                                 {n.title}
//                               </div>
//                               <div className="small text-muted lh-sm">
//                                 {n.message}
//                               </div>
//                             </div>
//                           </div>
//                         </Dropdown.Item>
//                       ))
//                     )}
//                   </div>

//                   {notifications.length > 0 && (
//                     <div className="p-2 text-center bg-light border-top">
//                       <button
//                         className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
//                         onClick={handleClearNotifications}
//                       >
//                         Dismiss Alerts
//                       </button>
//                     </div>
//                   )}
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* ✅ DYNAMIC USER PROFILE (NOW CLICKABLE) */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="d-flex align-items-center gap-3 border-start ps-4 text-decoration-none hide-caret"
//                   style={{
//                     borderColor: "#D5D9D9 !important",
//                     outline: "none",
//                     boxShadow: "none",
//                   }}
//                 >
//                   <div className="text-end d-none d-md-block text-dark">
//                     <div
//                       className="fw-bold small"
//                       style={{ lineHeight: "1.2" }}
//                     >
//                       {user?.name || "Staff User"}
//                     </div>
//                     <div
//                       className="fw-medium mt-1"
//                       style={{ fontSize: "0.75rem", color: "#007185" }}
//                     >
//                       Pharmacist Lead
//                     </div>
//                   </div>
//                   <div className="d-flex align-items-center justify-content-center bg-light rounded-circle p-1 hover-lift">
//                     <UserCircle
//                       size={32}
//                       style={{ color: "#565959", strokeWidth: "1.5" }}
//                     />
//                   </div>
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 mt-3"
//                   style={{ minWidth: "200px" }}
//                 >
//                   <div className="px-3 py-2 border-bottom mb-2 bg-light">
//                     <p className="small text-muted mb-0">Signed in as</p>
//                     <p className="fw-bold text-dark mb-0 text-truncate">
//                       {user?.email || "staff@pharmacy.com"}
//                     </p>
//                   </div>

//                   <Dropdown.Item
//                     onClick={() => navigate("/pharmacist/profile")}
//                     className="py-2 d-flex align-items-center gap-2 fw-medium text-dark hover-bg-light"
//                   >
//                     <UserCircle size={16} className="text-muted" /> My Profile
//                   </Dropdown.Item>

//                   <Dropdown.Divider />

//                   <Dropdown.Item
//                     onClick={handleLogout}
//                     className="py-2 d-flex align-items-center gap-2 fw-bold text-danger hover-bg-light"
//                   >
//                     <LogOut size={16} /> Sign Out
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//           </div>
//         </header>

//         {/* Content Area */}
//         <main
//           className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar"
//           style={{ backgroundColor: "#f0f2f2" }}
//         >
//           {/* Breadcrumbs */}
//           <Breadcrumbs />

//           {/* Render Page Content */}
//           <div className="mt-2">
//             <Outlet />
//           </div>
//         </main>
//       </div>

//       <style>{`
//         /* Hide default bootstrap caret in dropdown */
//         .hide-caret::after { display: none !important; }
//         .hover-lift { transition: transform 0.2s ease; }
//         .hover-lift:hover { transform: scale(1.05); }
//         .hover-bg-light:hover { background-color: #f8fafc !important; }
//         .transition-all { transition: all 0.2s ease; }
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
//       `}</style>
//     </div>
//   );
// };

// export default PharmacistLayout;

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Dropdown, Badge } from "react-bootstrap";
import PharmacistSidebar from "../components/PharmacistSidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  Bell,
  UserCircle,
  Package,
  FileText,
  TrendingDown,
  CheckCircle2,
  LogOut,
  Globe, // ✅ Added for language toggle
  Sun, // ✅ Added for theme toggle
  Moon, // ✅ Added for theme toggle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // ✅ Import Theme Context
import api from "../services/api";

const PharmacistLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ Extract theme variables
  const { isDarkMode, toggleTheme } = useTheme();

  // ✅ Language State
  const [isNepali, setIsNepali] = useState(false);

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ Global Language Toggle Function
  const toggleLanguage = () => {
    const newLang = isNepali ? "en" : "ne"; // Switch between English and Nepali
    const select = document.querySelector(".goog-te-combo");

    if (select) {
      select.value = newLang;
      select.dispatchEvent(new Event("change"));
      setIsNepali(!isNepali);
    } else {
      console.warn("Google Translate script not loaded yet.");
    }
  };

  // Fetch real-time system alerts
  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/pharmacist/dashboard");
      const alerts = [];

      if (data.pendingOrdersCount > 0) {
        alerts.push({
          id: "orders",
          type: "order",
          title: "Pending Orders",
          message: `${data.pendingOrdersCount} orders waiting for fulfillment.`,
          link: "/pharmacist/orders",
          icon: Package,
          color: "text-primary",
        });
      }
      if (data.pendingPrescriptionsCount > 0) {
        alerts.push({
          id: "rx",
          type: "prescription",
          title: "Rx Verification Required",
          message: `${data.pendingPrescriptionsCount} digital prescriptions need review.`,
          link: "/pharmacist/prescriptions",
          icon: FileText,
          color: "text-info",
        });
      }
      if (data.lowStockCount > 0) {
        alerts.push({
          id: "stock",
          type: "inventory",
          title: "Low Stock Alert",
          message: `${data.lowStockCount} items have fallen below threshold.`,
          link: "/pharmacist/inventory",
          icon: TrendingDown,
          color: "text-danger",
        });
      }

      setNotifications(alerts);
      setUnreadCount(alerts.length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds to keep notifications fresh
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClearNotifications = () => {
    setUnreadCount(0); // Simulates marking them as read locally
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Dynamic Theme Classes for Layout Structure
  const themeBg = isDarkMode ? "var(--bg-primary)" : "#f0f2f2";
  const headerBg = isDarkMode ? "var(--bg-secondary)" : "#ffffff";
  const headerBorder = isDarkMode ? "var(--border-color)" : "#D5D9D9";
  const textMuted = isDarkMode ? "var(--text-muted)" : "#565959";

  return (
    <div
      className="d-flex min-vh-100 transition-all"
      style={{ backgroundColor: themeBg }}
    >
      {/* Sidebar */}
      <PharmacistSidebar />

      {/* Main Wrapper */}
      <div
        className="flex-grow-1 d-flex flex-column overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* Header */}
        <header
          className="px-4 py-3 flex-shrink-0 position-relative z-3 shadow-sm transition-all"
          style={{
            backgroundColor: headerBg,
            borderBottom: `1px solid ${headerBorder}`,
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <h4
              className="mb-0 fw-bold theme-text"
              style={{ fontSize: "1.25rem" }}
            >
              Pharmacist Workspace
            </h4>

            <div className="d-flex align-items-center gap-4">
              {/* ✅ LANGUAGE TOGGLE BUTTON */}
              <button
                className="btn btn-link p-0 border-0 shadow-none d-flex align-items-center gap-1 transition-all hover-opacity fw-bold"
                onClick={toggleLanguage}
                title="Translate Page"
                style={{
                  color: isDarkMode ? "var(--text-primary)" : "#0F1111",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                <Globe size={20} />
                <span className="d-none d-sm-inline">
                  {isNepali ? "EN" : "नेपाली"}
                </span>
              </button>

              {/* ✅ THEME TOGGLE BUTTON */}
              <button
                className="btn btn-link p-0 border-0 shadow-none d-flex align-items-center transition-all hover-opacity"
                onClick={toggleTheme}
                title="Toggle Theme"
                style={{
                  color: isDarkMode ? "var(--text-primary)" : "#0F1111",
                }}
              >
                {isDarkMode ? (
                  <Sun size={24} className="text-warning" />
                ) : (
                  <Moon size={24} />
                )}
              </button>

              {/* ✅ DYNAMIC NOTIFICATIONS DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity"
                  style={{
                    color: isDarkMode ? "var(--text-primary)" : "#565959",
                  }}
                >
                  <Bell size={24} />
                  {unreadCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white"
                      style={{ fontSize: "0.65rem", padding: "0.25em 0.4em" }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 p-0 overflow-hidden"
                  style={{ width: "320px", marginTop: "12px" }}
                >
                  <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark mb-0">
                      System Alerts
                    </span>
                    <Badge bg="secondary" className="rounded-pill">
                      {unreadCount} New
                    </Badge>
                  </div>

                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <CheckCircle2
                          size={32}
                          className="mb-2 text-success opacity-50"
                        />
                        <p className="small mb-0 fw-medium">
                          You are all caught up!
                        </p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <Dropdown.Item
                          key={n.id}
                          onClick={() => navigate(n.link)}
                          className="p-3 border-bottom text-wrap hover-bg-light transition-all"
                        >
                          <div className="d-flex gap-3 align-items-start">
                            <div className={`mt-1 flex-shrink-0 ${n.color}`}>
                              <n.icon size={18} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark mb-1 fs-6">
                                {n.title}
                              </div>
                              <div className="small text-muted lh-sm">
                                {n.message}
                              </div>
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-2 text-center bg-light border-top">
                      <button
                        className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
                        onClick={handleClearNotifications}
                      >
                        Dismiss Alerts
                      </button>
                    </div>
                  )}
                </Dropdown.Menu>
              </Dropdown>

              {/* ✅ DYNAMIC USER PROFILE */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="d-flex align-items-center gap-3 border-start ps-4 text-decoration-none hide-caret hover-opacity"
                  style={{
                    borderColor: `${headerBorder} !important`,
                    outline: "none",
                    boxShadow: "none",
                  }}
                >
                  <div className="text-end d-none d-md-block theme-text">
                    <div
                      className="fw-bold small"
                      style={{ lineHeight: "1.2" }}
                    >
                      {user?.name || "Staff User"}
                    </div>
                    <div
                      className="fw-medium mt-1"
                      style={{ fontSize: "0.75rem", color: "#007185" }}
                    >
                      Pharmacist Lead
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center bg-light rounded-circle p-1 hover-lift">
                    <UserCircle
                      size={32}
                      style={{ color: "#565959", strokeWidth: "1.5" }}
                    />
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 mt-3"
                  style={{ minWidth: "200px" }}
                >
                  <div className="px-3 py-2 border-bottom mb-2 bg-light">
                    <p className="small text-muted mb-0">Signed in as</p>
                    <p className="fw-bold text-dark mb-0 text-truncate">
                      {user?.email || "staff@pharmacy.com"}
                    </p>
                  </div>

                  <Dropdown.Item
                    onClick={() => navigate("/pharmacist/profile")}
                    className="py-2 d-flex align-items-center gap-2 fw-medium text-dark hover-bg-light"
                  >
                    <UserCircle size={16} className="text-muted" /> My Profile
                  </Dropdown.Item>

                  <Dropdown.Divider />

                  <Dropdown.Item
                    onClick={handleLogout}
                    className="py-2 d-flex align-items-center gap-2 fw-bold text-danger hover-bg-light"
                  >
                    <LogOut size={16} /> Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main
          className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar transition-all"
          style={{ backgroundColor: themeBg }}
        >
          {/* Breadcrumbs */}
          <Breadcrumbs />

          {/* Render Page Content */}
          <div className="mt-2">
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        /* Hide default bootstrap caret in dropdown */
        .hide-caret::after { display: none !important; }
        .hover-lift { transition: transform 0.2s ease; }
        .hover-lift:hover { transform: scale(1.05); }
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .hover-opacity:hover { opacity: 0.7; }
        .transition-all { transition: all 0.2s ease; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default PharmacistLayout;
