// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // ✅ Use Context
// import {
//   LayoutDashboard,
//   Pill,
//   Calendar,
//   ShoppingBag,
//   FileText,
//   User,
//   LogOut,
//   X,
//   Menu,
// } from "lucide-react";

// const CustomerSidebar = ({ collapsed, setCollapsed, isMobile }) => {
//   const navigate = useNavigate();
//   const { logout } = useAuth(); // ✅ Get logout function

//   const menuItems = [
//     { name: "Dashboard", path: "/customer-dashboard", icon: LayoutDashboard },
//     { name: "Order Medicines", path: "/medicines", icon: Pill },
//     { name: "My Appointments", path: "/appointments", icon: Calendar },
//     { name: "My Orders", path: "/orders", icon: ShoppingBag },
//     { name: "My Prescriptions", path: "/prescriptions", icon: FileText },
//     { name: "My Profile", path: "/profile", icon: User },
//   ];

//   const handleLogout = () => {
//     logout(); // ✅ Clears state immediately
//     navigate("/login");
//   };

//   // Mobile overlay logic
//   if (isMobile && collapsed) return null;

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isMobile && !collapsed && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
//           style={{ zIndex: 1040 }}
//           onClick={() => setCollapsed(true)}
//         />
//       )}

//       <aside
//         className={`bg-white border-end d-flex flex-column transition-all ${
//           isMobile
//             ? "position-fixed top-0 start-0 h-100 shadow-lg"
//             : "position-sticky top-0 h-100"
//         }`}
//         style={{
//           width: collapsed && !isMobile ? "80px" : "280px",
//           height: "100vh",
//           zIndex: 1050,
//         }}
//       >
//         {/* Header */}
//         <div
//           className="d-flex align-items-center justify-content-between p-4 border-bottom"
//           style={{ height: "80px" }}
//         >
//           {(!collapsed || isMobile) && (
//             <div className="fw-bold text-primary fs-4">PharmaStore</div>
//           )}

//           <button
//             className="btn btn-light btn-sm rounded-circle p-2"
//             onClick={() => setCollapsed(!collapsed)}
//           >
//             {isMobile ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-grow-1 p-3 overflow-y-auto">
//           {menuItems.map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               onClick={() => isMobile && setCollapsed(true)}
//               className={({ isActive }) =>
//                 `d-flex align-items-center gap-3 p-3 rounded mb-2 text-decoration-none transition-all ${
//                   isActive
//                     ? "bg-primary text-white shadow-sm"
//                     : "text-secondary hover-bg-light"
//                 } ${collapsed && !isMobile ? "justify-content-center" : ""}`
//               }
//               title={collapsed ? item.name : ""}
//             >
//               <item.icon size={22} />
//               {(!collapsed || isMobile) && <span>{item.name}</span>}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Footer */}
//         <div className="p-3 border-top mt-auto">
//           <button
//             className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2"
//             onClick={handleLogout}
//           >
//             <LogOut size={20} />
//             {(!collapsed || isMobile) && <span>Logout</span>}
//           </button>
//         </div>
//       </aside>

//       <style>{`
//         .hover-bg-light:hover { background-color: #f8f9fa; color: #0d6efd; }
//       `}</style>
//     </>
//   );
// };

// export default CustomerSidebar;
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Pill,
  Calendar,
  ShoppingBag,
  FileText,
  User,
  LogOut,
  X,
  Menu,
  Heart,
  BellRing,
} from "lucide-react";

const CustomerSidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/customer-dashboard", icon: LayoutDashboard },
    { name: "Pharmacy Store", path: "/medicines", icon: Pill },
    { name: "Saved Items", path: "/customer/saved-medicines", icon: Heart },
    { name: "My Appointments", path: "/appointments", icon: Calendar },
    { name: "Order History", path: "/orders", icon: ShoppingBag },
    { name: "Refill Alerts", path: "/refill-reminders", icon: BellRing },
    { name: "My Prescriptions", path: "/prescriptions", icon: FileText },
    { name: "My Profile", path: "/profile", icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isMobile && collapsed) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !collapsed && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-40 animate-fade-in"
          style={{ zIndex: 1040, backdropFilter: "blur(4px)" }}
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`bg-white border-end d-flex flex-column transition-all duration-300 ${
          isMobile
            ? "position-fixed top-0 start-0 h-100 shadow-lg"
            : "position-sticky top-0 h-100"
        }`}
        style={{
          width: collapsed && !isMobile ? "85px" : "280px",
          height: "100vh",
          zIndex: 1050,
          boxShadow: isMobile ? "none" : "4px 0 15px rgba(0,0,0,0.02)",
        }}
      >
        {/* Brand Header */}
        <div
          className="d-flex align-items-center justify-content-between p-4 border-bottom bg-light bg-opacity-50"
          style={{ height: "80px" }}
        >
          {(!collapsed || isMobile) && (
            <div className="fw-bold text-primary fs-4 d-flex align-items-center">
              <i className="bi bi-shield-plus me-2"></i>
              <span className="ls-tight">PharmaStore</span>
            </div>
          )}

          <button
            className="btn btn-outline-primary border-0 btn-sm rounded-circle p-2"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isMobile ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow-1 p-3 overflow-y-auto sidebar-scroll">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => isMobile && setCollapsed(true)}
              className={({ isActive }) =>
                `d-flex align-items-center gap-3 p-3 rounded-3 mb-1 text-decoration-none transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md active-glow"
                    : "text-secondary hover-sidebar-item"
                } ${
                  collapsed && !isMobile ? "justify-content-center px-0" : ""
                }`
              }
              title={collapsed ? item.name : ""}
            >
              {/* ✅ Fixed: strokeWidth now correctly uses internal isActive state */}
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {(!collapsed || isMobile) && (
                    <span className="fw-medium small">{item.name}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-3 border-top bg-light bg-opacity-25 mt-auto">
          {(!collapsed || isMobile) && user && (
            <div className="d-flex align-items-center gap-2 mb-3 px-2">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                style={{ width: 35, height: 35 }}
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="overflow-hidden">
                <div className="small fw-bold text-dark text-truncate">
                  {user.name}
                </div>
                <div className="text-muted" style={{ fontSize: "0.65rem" }}>
                  Customer Portal
                </div>
              </div>
            </div>
          )}

          <button
            className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 shadow-sm"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {(!collapsed || isMobile) && (
              <span className="fw-bold small">Logout</span>
            )}
          </button>
        </div>
      </aside>

      <style>{`
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-sidebar-item:hover { background-color: #f0f4ff; color: #0d6efd; transform: translateX(4px); }
        .active-glow { box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3); }
        .ls-tight { letter-spacing: -0.5px; }
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
};

export default CustomerSidebar;
