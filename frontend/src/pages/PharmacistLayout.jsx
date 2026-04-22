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
//   Globe,
//   Sun,
//   Moon,
// } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import { useTheme } from "../context/ThemeContext";
// import api from "../services/api";

// const PharmacistLayout = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const { isDarkMode, toggleTheme } = useTheme();

//   const [isNepali, setIsNepali] = useState(false);

//   // Notification States
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const toggleLanguage = () => {
//     const newLang = isNepali ? "en" : "ne"; // Switch between English and Nepali
//     const select = document.querySelector(".goog-te-combo");

//     if (select) {
//       select.value = newLang;
//       select.dispatchEvent(new Event("change"));
//       setIsNepali(!isNepali);
//     } else {
//       console.warn("Google Translate script not loaded yet.");
//     }
//   };

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

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   // Dynamic Theme Classes for Layout Structure
//   const themeBg = isDarkMode ? "var(--bg-primary)" : "#f0f2f2";
//   const headerBg = isDarkMode ? "var(--bg-secondary)" : "#ffffff";
//   const headerBorder = isDarkMode ? "var(--border-color)" : "#D5D9D9";
//   const textMuted = isDarkMode ? "var(--text-muted)" : "#565959";

//   return (
//     <div
//       className="d-flex min-vh-100 transition-all"
//       style={{ backgroundColor: themeBg }}
//     >
//       {/* Sidebar */}
//       <PharmacistSidebar />

//       {/* Main Wrapper */}
//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         {/* Header */}
//         <header
//           className="px-4 py-3 flex-shrink-0 position-relative z-3 shadow-sm transition-all"
//           style={{
//             backgroundColor: headerBg,
//             borderBottom: `1px solid ${headerBorder}`,
//           }}
//         >
//           <div className="d-flex align-items-center justify-content-between">
//             <h4
//               className="mb-0 fw-bold theme-text"
//               style={{ fontSize: "1.25rem" }}
//             >
//               Pharmacist Workspace
//             </h4>

//             <div className="d-flex align-items-center gap-4">
//               {/* LANGUAGE TOGGLE BUTTON */}
//               <button
//                 className="btn btn-link p-0 border-0 shadow-none d-flex align-items-center gap-1 transition-all hover-opacity fw-bold"
//                 onClick={toggleLanguage}
//                 title="Translate Page"
//                 style={{
//                   color: isDarkMode ? "var(--text-primary)" : "#0F1111",
//                   textDecoration: "none",
//                   fontSize: "0.9rem",
//                 }}
//               >
//                 <Globe size={20} />
//                 <span className="d-none d-sm-inline">
//                   {isNepali ? "EN" : "नेपाली"}
//                 </span>
//               </button>

//               {/* THEME TOGGLE BUTTON */}
//               <button
//                 className="btn btn-link p-0 border-0 shadow-none d-flex align-items-center transition-all hover-opacity"
//                 onClick={toggleTheme}
//                 title="Toggle Theme"
//                 style={{
//                   color: isDarkMode ? "var(--text-primary)" : "#0F1111",
//                 }}
//               >
//                 {isDarkMode ? (
//                   <Sun size={24} className="text-warning" />
//                 ) : (
//                   <Moon size={24} />
//                 )}
//               </button>

//               {/* DYNAMIC NOTIFICATIONS DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity"
//                   style={{
//                     color: isDarkMode ? "var(--text-primary)" : "#565959",
//                   }}
//                 >
//                   <Bell size={24} />
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

//               {/* DYNAMIC USER PROFILE */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="d-flex align-items-center gap-3 border-start ps-4 text-decoration-none hide-caret hover-opacity"
//                   style={{
//                     borderColor: `${headerBorder} !important`,
//                     outline: "none",
//                     boxShadow: "none",
//                   }}
//                 >
//                   <div className="text-end d-none d-md-block theme-text">
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
//           className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar transition-all"
//           style={{ backgroundColor: themeBg }}
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
//         .hover-opacity:hover { opacity: 0.7; }
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
  Globe,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

const PharmacistLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { isDarkMode, toggleTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [isNepali, setIsNepali] = useState(false);

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- Handle Screen Resize ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <div
      className={`pharmacist-layout-wrapper d-flex transition-all ${collapsed ? "sidebar-collapsed" : "sidebar-open"}`}
      style={{
        backgroundColor: themeBg,
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 1. MOBILE OVERLAY (Dismisses sidebar when clicked outside) */}
      {isMobile && !collapsed && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 transition-all"
          onClick={() => setCollapsed(true)}
          style={{ zIndex: 1040 }}
        />
      )}

      {/* 2. SIDEBAR */}
      <div
        className="sidebar-container transition-all"
        style={{
          width: isMobile
            ? collapsed
              ? "0"
              : "280px"
            : collapsed
              ? "80px"
              : "260px",
          zIndex: 1050,
          position: isMobile ? "fixed" : "relative",
          height: "100%",
        }}
      >
        <PharmacistSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
        />
      </div>

      {/* 3. MAIN AREA */}
      <div
        className="flex-grow-1 d-flex flex-column transition-all w-100"
        style={{ height: "100vh", overflow: "hidden", minWidth: 0 }}
      >
        {/* Header */}
        <header
          className="px-3 px-md-4 py-3 flex-shrink-0 position-relative z-1 shadow-sm transition-all"
          style={{
            backgroundColor: headerBg,
            borderBottom: `1px solid ${headerBorder}`,
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            {/* Left Side: Hamburger (Mobile) + Page Title */}
            <div className="d-flex align-items-center gap-2 gap-md-3">
              {/* CSS-driven mobile hamburger button */}
              <button
                className="btn p-1 border-0 shadow-none hover-opacity d-flex align-items-center justify-content-center d-md-none"
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  color: isDarkMode ? "var(--text-primary)" : "#0F1111",
                }}
                aria-label="Toggle Sidebar"
              >
                <Menu size={24} />
              </button>

              {/* Title Wrapper (Crucial for Flexbox layout) */}
              <div>
                <h4
                  className="mb-0 fw-bold theme-text d-none d-sm-block"
                  style={{ fontSize: "1.25rem" }}
                >
                  Pharmacist Workspace
                </h4>
                <h4
                  className="mb-0 fw-bold theme-text d-block d-sm-none"
                  style={{ fontSize: "1.1rem" }}
                >
                  Workspace
                </h4>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="d-flex align-items-center gap-3 gap-md-4">
              {/* LANGUAGE TOGGLE BUTTON */}
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

              {/* THEME TOGGLE BUTTON */}
              <button
                className="btn btn-link p-0 border-0 shadow-none d-flex align-items-center transition-all hover-opacity"
                onClick={toggleTheme}
                title="Toggle Theme"
                style={{
                  color: isDarkMode ? "var(--text-primary)" : "#0F1111",
                }}
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-warning d-sm-none" />
                ) : (
                  <Moon size={20} className="d-sm-none" />
                )}
                {isDarkMode ? (
                  <Sun size={24} className="text-warning d-none d-sm-block" />
                ) : (
                  <Moon size={24} className="d-none d-sm-block" />
                )}
              </button>

              {/* DYNAMIC NOTIFICATIONS DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity"
                  style={{
                    color: isDarkMode ? "var(--text-primary)" : "#565959",
                  }}
                >
                  <Bell size={20} className="d-sm-none" />
                  <Bell size={24} className="d-none d-sm-block" />
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
                  style={{
                    width: "300px",
                    maxWidth: "90vw",
                    marginTop: "12px",
                    zIndex: 1060,
                  }}
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

              {/* DYNAMIC USER PROFILE */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="d-flex align-items-center gap-2 gap-md-3 border-start ps-2 ps-md-4 text-decoration-none hide-caret hover-opacity"
                  style={{
                    borderColor: `${headerBorder} !important`,
                    outline: "none",
                    boxShadow: "none",
                  }}
                >
                  <div className="text-end d-none d-lg-block theme-text">
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
                      size={isMobile ? 26 : 32}
                      style={{ color: "#565959", strokeWidth: "1.5" }}
                    />
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 mt-3"
                  style={{ minWidth: "200px", zIndex: 1060 }}
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
          className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar transition-all position-relative"
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
        /* Layout Structure Basics */
        .pharmacist-layout-wrapper {
          position: relative;
          width: 100vw;
        }
      
        /* Hide default bootstrap caret in dropdown */
        .hide-caret::after { display: none !important; }
        .hover-lift { transition: transform 0.2s ease; }
        .hover-lift:hover { transform: scale(1.05); }
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .hover-opacity:hover { opacity: 0.7; }
        .transition-all { transition: background-color 0.3s ease, color 0.3s ease, opacity 0.2s ease-in-out, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s ease; }
        
        /* Responsive Mobile Drawer Styling */
        @media (max-width: 767.98px) {
          .sidebar-container {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            overflow: hidden;
            z-index: 1050;
          }
          .sidebar-collapsed .sidebar-container {
            transform: translateX(-100%);
          }
          .sidebar-open .sidebar-container {
            transform: translateX(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDarkMode ? "#334155" : "#cbd5e1"}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${isDarkMode ? "#475569" : "#94a3b8"}; }
      `}</style>
    </div>
  );
};

export default PharmacistLayout;
