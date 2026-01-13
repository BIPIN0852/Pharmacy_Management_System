// import React, { useState, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // ✅ Use Context
// import {
//   LayoutDashboard,
//   ClipboardList,
//   ShoppingBag,
//   Package,
//   AlertTriangle,
//   FileBarChart,
//   Users,
//   User,
//   LogOut,
//   Menu,
//   Pill,
// } from "lucide-react";

// const menuItems = [
//   { name: "Dashboard", path: "/pharmacist/dashboard", icon: LayoutDashboard },
//   {
//     name: "Prescriptions",
//     path: "/pharmacist/prescriptions",
//     icon: ClipboardList,
//   },
//   { name: "Manage Orders", path: "/pharmacist/orders", icon: ShoppingBag },
//   { name: "Inventory", path: "/pharmacist/inventory", icon: Package },
//   { name: "Alerts", path: "/pharmacist/alerts", icon: AlertTriangle },
//   { name: "Reports", path: "/pharmacist/reports", icon: FileBarChart },
//   { name: "Customers", path: "/pharmacist/customers", icon: Users },
//   { name: "Profile", path: "/profile", icon: User },
// ];

// const PharmacistSidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const { logout } = useAuth(); // ✅ Get logout function

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 992) setCollapsed(true);
//       else setCollapsed(false);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleLogout = () => {
//     logout(); // ✅ Clears state immediately
//     navigate("/login");
//   };

//   return (
//     <aside
//       className={`bg-success text-white d-flex flex-column shadow-lg transition-all`}
//       style={{
//         width: collapsed ? "72px" : "260px",
//         height: "100vh",
//         zIndex: 1000,
//         flexShrink: 0,
//         position: "sticky",
//         top: 0,
//       }}
//     >
//       {/* Header */}
//       <div
//         className="d-flex align-items-center justify-content-between px-3 py-4 border-bottom border-white border-opacity-25"
//         style={{ height: "80px" }}
//       >
//         {!collapsed && (
//           <div className="d-flex align-items-center gap-2 overflow-hidden">
//             <div
//               className="rounded-circle bg-white text-success d-flex align-items-center justify-content-center flex-shrink-0"
//               style={{ width: 40, height: 40 }}
//             >
//               <Pill size={24} />
//             </div>
//             <div style={{ lineHeight: "1.2" }}>
//               <div className="fw-bold text-truncate">PharmaPanel</div>
//               <small className="opacity-75" style={{ fontSize: "0.75rem" }}>
//                 Staff Portal
//               </small>
//             </div>
//           </div>
//         )}
//         <button
//           className={`btn btn-sm p-1 rounded bg-white bg-opacity-10 border-0 text-white hover-bg-opacity-25 ${
//             collapsed ? "mx-auto" : ""
//           }`}
//           onClick={() => setCollapsed(!collapsed)}
//         >
//           <Menu size={20} />
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-grow-1 pt-3 px-2 overflow-y-auto">
//         {menuItems.map(({ name, path, icon: Icon }) => (
//           <NavLink
//             key={name}
//             to={path}
//             className={({ isActive }) =>
//               `d-flex align-items-center gap-3 py-2 px-3 rounded-2 text-white text-decoration-none mb-1 ${
//                 isActive
//                   ? "bg-white bg-opacity-25 fw-bold shadow-sm"
//                   : "opacity-75 hover-opacity-100"
//               } ${collapsed ? "justify-content-center px-2" : ""}`
//             }
//             title={collapsed ? name : undefined}
//           >
//             <Icon size={20} className="flex-shrink-0" />
//             {!collapsed && <span>{name}</span>}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className="p-3 border-top border-white border-opacity-25 mt-auto bg-success">
//         <button
//           className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm"
//           onClick={handleLogout}
//         >
//           <LogOut size={18} />
//           {!collapsed && <span>Logout</span>}
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default PharmacistSidebar;

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  ClipboardList,
  ShoppingBag,
  Package,
  AlertTriangle,
  Users,
  User,
  LogOut,
  Menu,
  Pill,
  BellRing,
} from "lucide-react";

const PharmacistSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // ✅ Updated menu items for frontend routing consistency
  const menuItems = [
    { name: "Dashboard", path: "/pharmacist/dashboard", icon: LayoutDashboard },
    {
      name: "Prescriptions",
      path: "/pharmacist/prescriptions",
      icon: ClipboardList,
    },
    // ✅ Changed from /api/orders to frontend route /pharmacist/orders
    { name: "Manage Orders", path: "/pharmacist/orders", icon: ShoppingBag },
    { name: "Inventory", path: "/pharmacist/inventory", icon: Package },
    { name: "Refill Reminders", path: "/pharmacist/alerts", icon: BellRing },
    { name: "Expiry Alerts", path: "/pharmacist/alerts", icon: AlertTriangle },
    { name: "Customers", path: "/pharmacist/customers", icon: Users },
    { name: "My Profile", path: "/profile", icon: User },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) setCollapsed(true);
      else setCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className="bg-pharmacist d-flex flex-column shadow-lg transition-all"
      style={{
        width: collapsed ? "80px" : "280px",
        height: "100vh",
        zIndex: 1050,
        position: "sticky",
        top: 0,
        backgroundColor: "#166534", // Deep Medical Green
      }}
    >
      {/* Brand Header */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-4 border-bottom border-white border-opacity-10"
        style={{ height: "80px" }}
      >
        {!collapsed && (
          <div className="d-flex align-items-center gap-2 overflow-hidden animate-fade-in">
            <div
              className="rounded-circle bg-white text-success d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: 42, height: 42 }}
            >
              <Pill size={24} />
            </div>
            <div style={{ lineHeight: "1.2" }}>
              <div className="fw-bold text-white fs-5">PharmaPanel</div>
              <small
                className="text-white-50 uppercase tracking-wider"
                style={{ fontSize: "0.65rem" }}
              >
                Pharmacist Portal
              </small>
            </div>
          </div>
        )}
        <button
          className={`btn btn-sm text-white border-0 hover-bg-white-10 ${
            collapsed ? "mx-auto" : ""
          }`}
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-grow-1 pt-4 px-3 overflow-y-auto sidebar-scroll">
        {menuItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `d-flex align-items-center gap-3 py-3 px-3 rounded-3 text-decoration-none mb-2 transition-all ${
                isActive
                  ? "bg-white text-success fw-bold shadow active-pill"
                  : "text-white opacity-75 hover-bg-white-10"
              } ${collapsed ? "justify-content-center px-0" : ""}`
            }
            title={collapsed ? name : undefined}
          >
            {/* ✅ FIXED: isActive is now correctly scoped within NavLink's children function */}
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {!collapsed && <span className="small">{name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-top border-white border-opacity-10 mt-auto">
        {!collapsed && user && (
          <div className="bg-black bg-opacity-20 rounded-3 p-3 mb-3 d-flex align-items-center gap-2">
            <div
              className="bg-white text-success rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{ width: 32, height: 32 }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-white small fw-bold text-truncate">
                {user.name}
              </div>
              <div className="text-white-50" style={{ fontSize: "0.65rem" }}>
                Online
              </div>
            </div>
          </div>
        )}
        <button
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-bold shadow-sm rounded-3"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          {!collapsed && <span className="small">Logout</span>}
        </button>
      </div>

      <style>{`
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-bg-white-10:hover { background-color: rgba(255, 255, 255, 0.1); opacity: 1; }
        .active-pill { transform: translateX(5px); }
        .tracking-wider { letter-spacing: 0.05em; }
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>
    </aside>
  );
};

export default PharmacistSidebar;
