// import React from "react";
// import { Home, Users, Box, LogOut } from "lucide-react";

// const Sidebar = ({ userRole }) => {
//   return (
//     <div
//       style={{
//         width: "250px",
//         background: "#1f2937",
//         color: "#fff",
//         display: "flex",
//         flexDirection: "column",
//         padding: "20px",
//       }}
//     >
//       <h2>Pharmacy Admin</h2>
//       <nav style={{ marginTop: "30px" }}>
//         <ul style={{ listStyle: "none", padding: 0 }}>
//           <li style={{ marginBottom: "15px" }}>
//             <Home size={20} style={{ marginRight: "8px" }} />
//             Dashboard
//           </li>
//           <li style={{ marginBottom: "15px" }}>
//             <Users size={20} style={{ marginRight: "8px" }} />
//             Users
//           </li>
//           <li style={{ marginBottom: "15px" }}>
//             <Box size={20} style={{ marginRight: "8px" }} />
//             Medicines
//           </li>
//           <li style={{ marginBottom: "15px" }}>
//             <LogOut size={20} style={{ marginRight: "8px" }} />
//             Logout
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Home, Users, Box, LogOut, Menu, X } from "lucide-react";

// const Sidebar = ({ userRole, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false); // for small screens

//   const toggleSidebar = () => setIsOpen((prev) => !prev);

//   return (
//     <>
//       {/* Top bar only for small screens */}
//       <div
//         style={{
//           display: "none",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "0.75rem 1rem",
//           background: "#111827",
//           color: "#fff",
//         }}
//         className="mobile-topbar"
//       >
//         <span style={{ fontWeight: 600 }}>Pharmacy Admin</span>
//         <button
//           onClick={toggleSidebar}
//           style={{
//             background: "transparent",
//             border: "none",
//             color: "#fff",
//             cursor: "pointer",
//           }}
//         >
//           {isOpen ? <X size={22} /> : <Menu size={22} />}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <div
//         style={{
//           width: "250px",
//           background: "#1f2937",
//           color: "#fff",
//           display: "flex",
//           flexDirection: "column",
//           padding: "20px",
//           minHeight: "100vh",
//           transition: "transform 0.25s ease-out",
//           // hide on small screens when closed, always visible on lg screens via CSS
//           transform: isOpen ? "translateX(0)" : "translateX(-100%)",
//         }}
//         className="sidebar"
//       >
//         <h2 style={{ marginBottom: "1.5rem" }}>Pharmacy Admin</h2>

//         <nav>
//           <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
//             <li
//               style={{
//                 marginBottom: "15px",
//                 display: "flex",
//                 alignItems: "center",
//                 cursor: "pointer",
//               }}
//             >
//               <Home size={20} style={{ marginRight: "8px" }} />
//               <Link
//                 to="/admin-dashboard"
//                 style={{ color: "#fff", textDecoration: "none" }}
//                 onClick={() => setIsOpen(false)}
//               >
//                 Dashboard
//               </Link>
//             </li>

//             {userRole === "admin" && (
//               <li
//                 style={{
//                   marginBottom: "15px",
//                   display: "flex",
//                   alignItems: "center",
//                   cursor: "pointer",
//                 }}
//               >
//                 <Users size={20} style={{ marginRight: "8px" }} />
//                 <Link
//                   to="/admin/users"
//                   style={{ color: "#fff", textDecoration: "none" }}
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Users
//                 </Link>
//               </li>
//             )}

//             <li
//               style={{
//                 marginBottom: "15px",
//                 display: "flex",
//                 alignItems: "center",
//                 cursor: "pointer",
//               }}
//             >
//               <Box size={20} style={{ marginRight: "8px" }} />
//               <Link
//                 to="/inventory"
//                 style={{ color: "#fff", textDecoration: "none" }}
//                 onClick={() => setIsOpen(false)}
//               >
//                 Medicines
//               </Link>
//             </li>

//             <li
//               style={{
//                 marginTop: "auto",
//                 display: "flex",
//                 alignItems: "center",
//                 cursor: "pointer",
//                 paddingTop: "1rem",
//                 borderTop: "1px solid #374151",
//               }}
//               onClick={onLogout}
//             >
//               <LogOut size={20} style={{ marginRight: "8px" }} />
//               <span>Logout</span>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Home, Users, Box, LogOut, Menu, X } from "lucide-react";

// const Sidebar = ({ userRole, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false); // for small screens

//   const toggleSidebar = () => setIsOpen((prev) => !prev);

//   return (
//     <>
//       {/* Top bar only for small screens */}
//       <div
//         className="mobile-topbar d-flex d-lg-none align-items-center justify-content-between px-3 py-2"
//         style={{
//           backgroundColor: "var(--dark-teal-text)",
//           color: "var(--neutral-light)",
//         }}
//       >
//         <span className="fw-semibold">Pharmacy Admin</span>
//         <button
//           onClick={toggleSidebar}
//           className="btn btn-outline-light p-1"
//           aria-label="Toggle menu"
//         >
//           {isOpen ? <X size={22} /> : <Menu size={22} />}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <div
//         className={`sidebar d-flex flex-column text-white position-fixed vh-100 p-4 ${
//           isOpen ? "translate-x-0" : "translate-x-n100"
//         } d-lg-block`}
//         style={{
//           width: "250px",
//           backgroundColor: "var(--green-accent)",
//           transition: "transform 0.25s ease-out",
//           zIndex: 1030,
//         }}
//       >
//         <h2 className="mb-4">Pharmacy Admin</h2>

//         <nav>
//           <ul className="list-unstyled p-0 m-0 d-flex flex-column h-100">
//             <li className="mb-3 d-flex align-items-center">
//               <Home size={20} className="me-2" />
//               <Link
//                 to="/admin-dashboard"
//                 className="text-white text-decoration-none flex-grow-1"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Dashboard
//               </Link>
//             </li>

//             {userRole === "admin" && (
//               <li className="mb-3 d-flex align-items-center">
//                 <Users size={20} className="me-2" />
//                 <Link
//                   to="/admin/users"
//                   className="text-white text-decoration-none flex-grow-1"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Users
//                 </Link>
//               </li>
//             )}

//             <li className="mb-3 d-flex align-items-center">
//               <Box size={20} className="me-2" />
//               <Link
//                 to="/inventory"
//                 className="text-white text-decoration-none flex-grow-1"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Medicines
//               </Link>
//             </li>

//             <li
//               className="mt-auto pt-3 border-top border-white border-opacity-25 d-flex align-items-center cursor-pointer"
//               onClick={onLogout}
//               role="button"
//               tabIndex={0}
//               onKeyDown={(e) => e.key === "Enter" && onLogout()}
//             >
//               <LogOut size={20} className="me-2" />
//               <span>Logout</span>
//             </li>
//           </ul>
//         </nav>
//       </div>

//       <style jsx>{`
//         /* Custom translate classes to control sidebar slide */
//         .translate-x-0 {
//           transform: translateX(0) !important;
//         }
//         .translate-x-n100 {
//           transform: translateX(-100%) !important;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Sidebar;

// import React, { useState, useEffect } from "react";
// import {
//   LayoutDashboard,
//   Users,
//   Package,
//   ShoppingCart,
//   FileText,
//   Settings,
//   LogOut,
//   Menu,
// } from "lucide-react";
// import { NavLink, useNavigate } from "react-router-dom";

// const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();

//   // Auto-collapse on small screens
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 992) {
//         setCollapsed(true);
//       } else {
//         setCollapsed(false);
//       }
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const menuItems = [
//     { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
//     { name: "Users", path: "/admin/users", icon: Users },
//     { name: "Medicines", path: "/admin/medicines", icon: Package },
//     { name: "Doctors", path: "/admin/doctors", icon: Users },
//     { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
//     { name: "Reports", path: "/admin/reports", icon: FileText },
//     { name: "Settings", path: "/admin/settings", icon: Settings },
//   ];

//   return (
//     <>
//       <style jsx>{`
//         .sidebar-collapsed nav a span {
//           display: none !important;
//         }
//         .sidebar-collapsed {
//           overflow-x: hidden;
//         }
//         .sidebar-menu-item:hover {
//           background-color: rgba(255, 255, 255, 0.1) !important;
//           border-radius: 8px;
//         }
//       `}</style>

//       <aside
//         className={`bg-primary text-white vh-100 d-flex flex-column transition-all ${
//           collapsed ? "sidebar-collapsed" : ""
//         }`}
//         style={{
//           width: collapsed ? "72px" : "260px",
//           transition: "width 0.3s ease-in-out",
//         }}
//       >
//         {/* Header */}
//         <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom border-white border-opacity-25">
//           {!collapsed && (
//             <div className="d-flex align-items-center gap-2 flex-grow-1">
//               <img
//                 src="/logo.png"
//                 alt="Pharmacy Logo"
//                 className="rounded-circle"
//                 style={{ width: 46, height: 46, objectFit: "cover" }}
//                 onError={(e) => {
//                   e.target.src =
//                     "https://via.placeholder.com/46x46/2563eb/ffffff?text=PA";
//                 }}
//               />
//               <div>
//                 <div className="fw-bold fs-6 mb-0">Pharmacy Admin</div>
//                 <small className="opacity-75">Manager Panel</small>
//               </div>
//             </div>
//           )}
//           <button
//             className="btn btn-sm p-1 rounded-circle bg-white bg-opacity-20 border-0 text-white hover:bg-opacity-30 transition-all"
//             onClick={() => setCollapsed(!collapsed)}
//             title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
//           >
//             <Menu size={20} />
//           </button>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="flex-grow-1 pt-3 px-2 sidebar-menu">
//           {menuItems.map(({ name, path, icon: Icon }) => (
//             <NavLink
//               key={name}
//               to={path}
//               className={({ isActive }) =>
//                 `d-flex align-items-center gap-3 py-2 px-3 rounded-2 text-white text-decoration-none mb-1 sidebar-menu-item transition-all ${
//                   isActive
//                     ? "bg-white bg-opacity-20 border-start border-3 border-white shadow-sm"
//                     : "opacity-75 hover:opacity-100"
//                 }`
//               }
//               style={{ fontSize: "0.95rem" }}
//               title={name}
//             >
//               <Icon size={20} />
//               <span className="fw-medium">{name}</span>
//             </NavLink>
//           ))}
//         </nav>

//         {/* Footer */}
//         <div className="p-3 border-top border-white border-opacity-25">
//           <div className="d-flex align-items-center gap-2 mb-2 opacity-75">
//             <img
//               src={avatar}
//               alt="Admin"
//               className="rounded-circle"
//               style={{ width: 32, height: 32 }}
//               onError={(e) => {
//                 e.target.src =
//                   "https://via.placeholder.com/32x32/6b7280/ffffff?text=AD";
//               }}
//             />
//             {!collapsed && <span className="small fw-medium">Admin User</span>}
//           </div>
//           <button
//             className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2"
//             onClick={handleLogout}
//           >
//             <LogOut size={18} />
//             {!collapsed && <span>Logout</span>}
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;

// import React, { useState, useEffect } from "react";
// import {
//   LayoutDashboard,
//   Users,
//   Package,
//   ShoppingCart,
//   FileText,
//   Settings,
//   LogOut,
//   Menu,
// } from "lucide-react";
// import { NavLink, useNavigate } from "react-router-dom";
// import avatar from "../assets/avatar.jpg";

// const menuItems = [
//   { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
//   { name: "Users", path: "/admin/users", icon: Users },
//   { name: "Medicines", path: "/admin/medicines", icon: Package },
//   { name: "Doctors", path: "/admin/doctors", icon: Users },
//   { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
//   { name: "Reports", path: "/admin/reports", icon: FileText },
//   { name: "Settings", path: "/admin/settings", icon: Settings },
// ];

// const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const onResize = () => {
//       if (window.innerWidth < 992) setCollapsed(true);
//       else setCollapsed(false);
//     };
//     onResize();
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <>
//       <style>{`
//         .sidebar-collapsed nav a span { display: none !important; }
//         .sidebar-collapsed { overflow-x: hidden; }
//       `}</style>

//       <aside
//         className={`bg-primary text-white vh-100 d-flex flex-column ${
//           collapsed ? "sidebar-collapsed" : ""
//         }`}
//         style={{
//           width: collapsed ? "72px" : "260px",
//           transition: "width 0.3s",
//         }}
//       >
//         {/* Header */}
//         <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom border-white border-opacity-25">
//           {!collapsed && (
//             <div className="d-flex align-items-center gap-2">
//               <div
//                 className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center"
//                 style={{ width: 40, height: 40 }}
//               >
//                 <span className="fw-bold">PA</span>
//               </div>
//               <div>
//                 <div className="fw-bold">Pharmacy Admin</div>
//                 <small className="opacity-75">Manager Panel</small>
//               </div>
//             </div>
//           )}
//           <button
//             className="btn btn-sm p-1 rounded-circle bg-white bg-opacity-25 border-0 text-white"
//             onClick={() => setCollapsed(!collapsed)}
//             title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//           >
//             <Menu size={20} />
//           </button>
//         </div>

//         {/* Menu */}
//         <nav className="flex-grow-1 pt-2 px-2">
//           {menuItems.map(({ name, path, icon: Icon }) => (
//             <NavLink
//               key={name}
//               to={path}
//               className={({ isActive }) =>
//                 `d-flex align-items-center gap-3 py-2 px-3 rounded-2 text-white text-decoration-none mb-1 ${
//                   isActive ? "bg-white bg-opacity-25" : "opacity-75"
//                 }`
//               }
//               title={collapsed ? name : undefined}
//             >
//               <Icon size={20} />
//               <span className="fw-medium small">{name}</span>
//             </NavLink>
//           ))}
//         </nav>

//         {/* Footer */}
//         <div className="p-3 border-top border-white border-opacity-25">
//           <div className="d-flex align-items-center gap-2 mb-2">
//             <img
//               src={avatar}
//               alt="Admin"
//               className="rounded-circle"
//               style={{ width: 32, height: 32, objectFit: "cover" }}
//             />
//             {!collapsed && <span className="small fw-medium">Admin</span>}
//           </div>
//           <button
//             className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
//             onClick={handleLogout}
//           >
//             <LogOut size={18} />
//             {!collapsed && <span>Logout</span>}
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
  Menu,
  Truck, // NEW: for Suppliers
  Receipt, // NEW: for Purchases
  Calendar, // ✅ FIX: import Calendar icon
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.jpg";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Medicines", path: "/admin/medicines", icon: Package },
  { name: "Doctors", path: "/admin/doctors", icon: Users },
  { name: "Appointments", path: "/admin/appointments", icon: Calendar },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Suppliers", path: "/admin/suppliers", icon: Truck }, // NEW
  { name: "Purchases", path: "/admin/purchases", icon: Receipt }, // NEW
  { name: "Reports", path: "/admin/reports", icon: FileText },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 992) setCollapsed(true);
      else setCollapsed(false);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .sidebar-collapsed nav a span { display: none !important; }
        .sidebar-collapsed { overflow-x: hidden; }
      `}</style>

      <aside
        className={`bg-primary text-white vh-100 d-flex flex-column ${
          collapsed ? "sidebar-collapsed" : ""
        }`}
        style={{
          width: collapsed ? "72px" : "260px",
          transition: "width 0.3s",
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom border-white border-opacity-25">
          {!collapsed && (
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center"
                style={{ width: 40, height: 40 }}
              >
                <span className="fw-bold">PA</span>
              </div>
              <div>
                <div className="fw-bold">Pharmacy Admin</div>
                <small className="opacity-75">Manager Panel</small>
              </div>
            </div>
          )}
          <button
            className="btn btn-sm p-1 rounded-circle bg-white bg-opacity-25 border-0 text-white"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-grow-1 pt-2 px-2">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `d-flex align-items-center gap-3 py-2 px-3 rounded-2 text-white text-decoration-none mb-1 ${
                  isActive ? "bg-white bg-opacity-25" : "opacity-75"
                }`
              }
              title={collapsed ? name : undefined}
            >
              <Icon size={20} />
              <span className="fw-medium small">{name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-top border-white border-opacity-25">
          <div className="d-flex align-items-center gap-2 mb-2">
            <img
              src={avatar}
              alt="Admin"
              className="rounded-circle"
              style={{ width: 32, height: 32, objectFit: "cover" }}
            />
            {!collapsed && <span className="small fw-medium">Admin</span>}
          </div>
          <button
            className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
