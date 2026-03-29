// import React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   CalendarCheck,
//   Users,
//   FileSignature,
//   Settings,
//   LogOut,
//   Stethoscope,
//   X,
//   Menu,
// } from "lucide-react";
// import { useAuth } from "../context/AuthContext";

// const DoctorSidebar = ({ collapsed, setCollapsed, isMobile }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const navLinks = [
//     { name: "Dashboard", path: "/doctor-dashboard", icon: LayoutDashboard },
//     { name: "Appointments", path: "/doctor/appointments", icon: CalendarCheck },
//     { name: "My Patients", path: "/doctor/patients", icon: Users },
//     {
//       name: "Prescriptions",
//       path: "/doctor/prescriptions",
//       icon: FileSignature,
//     },
//     { name: "Profile & Settings", path: "/doctor/profile", icon: Settings },
//   ];

//   const sidebarWidth = collapsed ? "80px" : "260px";

//   // Auto-close sidebar on mobile when a link is clicked
//   const handleLinkClick = () => {
//     if (isMobile) {
//       setCollapsed(true);
//     }
//   };

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isMobile && !collapsed && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 z-2 animate-fade-in"
//           onClick={() => setCollapsed(true)}
//         ></div>
//       )}

//       <div
//         className="d-flex flex-column transition-all shadow-lg z-3 text-white"
//         style={{
//           width: isMobile ? "260px" : sidebarWidth,
//           height: "100vh",
//           position: isMobile ? "fixed" : "sticky",
//           top: 0,
//           left: isMobile && collapsed ? "-260px" : "0",
//           overflowX: "hidden",
//           background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)", // Rich dark blue gradient
//           borderRight: "1px solid rgba(255,255,255,0.05)",
//         }}
//       >
//         {/* Brand Header */}
//         <div
//           className="d-flex align-items-center justify-content-between p-4 border-bottom"
//           style={{ height: "73px", borderColor: "rgba(255,255,255,0.1)" }}
//         >
//           <div
//             className="d-flex align-items-center gap-2 overflow-hidden cursor-pointer"
//             style={{ color: "#38bdf8" }} // Bright blue brand color
//             onClick={() => {
//               navigate("/doctor-dashboard");
//               handleLinkClick();
//             }}
//           >
//             <div className="bg-white bg-opacity-10 p-2 rounded-3 d-flex justify-content-center align-items-center">
//               <Stethoscope
//                 size={24}
//                 strokeWidth={2.5}
//                 className="flex-shrink-0"
//               />
//             </div>
//             {!collapsed && (
//               <span className="fw-black fs-5 tracking-tight text-white text-nowrap">
//                 Doctor Hub
//               </span>
//             )}
//           </div>

//           {/* Mobile Close Button */}
//           {isMobile && (
//             <button
//               className="btn btn-link text-white-50 p-0 hover-white"
//               onClick={() => setCollapsed(true)}
//             >
//               <X size={24} />
//             </button>
//           )}

//           {/* Desktop Toggle Button */}
//           {!isMobile && (
//             <button
//               className="btn btn-link text-white-50 p-0 ms-auto hover-white"
//               onClick={() => setCollapsed(!collapsed)}
//             >
//               <Menu size={20} />
//             </button>
//           )}
//         </div>

//         {/* Navigation Links */}
//         <div className="flex-grow-1 overflow-auto py-4 px-3 custom-scrollbar">
//           <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
//             {navLinks.map((link) => {
//               // Strict matching so only the correct tab highlights
//               const isActive =
//                 location.pathname === link.path ||
//                 location.pathname.startsWith(`${link.path}/`);

//               return (
//                 <li key={link.name}>
//                   <Link
//                     to={link.path}
//                     onClick={handleLinkClick}
//                     className={`d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none transition-all fw-bold ${
//                       isActive
//                         ? "bg-primary text-white shadow-sm"
//                         : "text-white-50 hover-nav-item"
//                     }`}
//                     title={collapsed ? link.name : ""}
//                   >
//                     <link.icon
//                       size={20}
//                       className={isActive ? "text-white" : "text-white-50"}
//                     />
//                     {!collapsed && (
//                       <span className="text-nowrap">{link.name}</span>
//                     )}
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>

//         {/* Logout Section */}
//         <div
//           className="p-3 border-top"
//           style={{ borderColor: "rgba(255,255,255,0.1)" }}
//         >
//           <button
//             onClick={handleLogout}
//             className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-bold transition-all btn-logout"
//             title={collapsed ? "Logout" : ""}
//           >
//             <LogOut size={20} />
//             {!collapsed && <span>Sign Out</span>}
//           </button>
//         </div>
//       </div>

//       <style>{`
//         /* Smooth transitions */
//         .transition-all { transition: all 0.3s ease; }
//         .cursor-pointer { cursor: pointer; }
//         .tracking-tight { letter-spacing: -0.025em; }

//         /* Hover states */
//         .hover-white:hover { color: #ffffff !important; }
//         .hover-nav-item:hover {
//           background-color: rgba(255, 255, 255, 0.05);
//           color: #ffffff !important;
//         }
//         .hover-nav-item:hover svg {
//           color: #38bdf8 !important;
//         }

//         /* Custom Logout Button */
//         .btn-logout {
//           background-color: rgba(239, 68, 68, 0.1);
//           color: #fca5a5;
//           border: 1px solid transparent;
//         }
//         .btn-logout:hover {
//           background-color: #ef4444;
//           color: #ffffff;
//           box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
//         }

//         /* Scrollbar styling for dark theme */
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background-color: rgba(255, 255, 255, 0.1);
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background-color: rgba(255, 255, 255, 0.2);
//         }

//         /* Fade in overlay */
//         .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 0.5; }
//         }
//       `}</style>
//     </>
//   );
// };

// export default DoctorSidebar;

import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  FileSignature,
  Settings,
  LogOut,
  Stethoscope,
  X,
  Menu,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DoctorSidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/doctor-dashboard", icon: LayoutDashboard },
    { name: "Appointments", path: "/doctor/appointments", icon: CalendarCheck },
    { name: "My Patients", path: "/doctor/patients", icon: Users },
    {
      name: "Prescriptions",
      path: "/doctor/prescriptions",
      icon: FileSignature,
    },
    { name: "Profile & Settings", path: "/doctor/profile", icon: Settings },
  ];

  // The highlight color used for the Doctor theme
  const highlightColor = "#38bdf8"; // Bright Sky Blue
  const hoverColor = "rgba(255, 255, 255, 0.08)";

  // Auto-close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (isMobile) {
      setCollapsed(true);
    }
  };

  return (
    <>
      {/* ✅ NEW: Floating Action Button specifically for Mobile to open the menu */}
      {isMobile && collapsed && (
        <button
          className="btn position-fixed shadow-lg d-flex align-items-center justify-content-center animate-fade-in"
          onClick={() => setCollapsed(false)}
          style={{
            bottom: "30px",
            right: "24px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            zIndex: 1040,
            backgroundColor: "#0ea5e9", // Solid blue for the button
            border: `2px solid white`,
          }}
        >
          <Menu size={28} className="text-white" />
        </button>
      )}

      {/* Mobile Overlay with blur effect */}
      {isMobile && !collapsed && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 animate-fade-in"
          style={{ zIndex: 1040, backdropFilter: "blur(4px)" }}
          onClick={() => setCollapsed(true)}
        ></div>
      )}

      <aside
        className={`d-flex flex-column transition-all duration-300 ${
          isMobile
            ? "position-fixed top-0 start-0 shadow-lg"
            : "position-sticky top-0"
        }`}
        style={{
          width: collapsed && !isMobile ? "85px" : "280px",
          height: "100vh", // ✅ FIXED: Strictly forces full viewport height
          zIndex: 1050,
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)", // Rich dark blue gradient
          color: "white",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          boxShadow: isMobile ? "none" : "4px 0 25px rgba(0,0,0,0.1)",
          // ✅ FIXED: Smoothly slides off-screen on mobile
          transform:
            isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
          visibility: isMobile && collapsed ? "hidden" : "visible",
        }}
      >
        {/* Brand Header */}
        <div
          className="d-flex align-items-center justify-content-between p-3"
          style={{
            height: "80px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            flexShrink: 0,
          }}
        >
          {(!collapsed || isMobile) && (
            <div
              className="d-flex align-items-center gap-3 overflow-hidden cursor-pointer ps-2 animate-fade-in"
              onClick={() => {
                navigate("/doctor-dashboard");
                handleLinkClick();
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: highlightColor,
                }}
              >
                <Stethoscope size={24} strokeWidth={2.5} />
              </div>
              <div style={{ lineHeight: "1.2" }}>
                <div
                  className="fw-black text-white tracking-wide"
                  style={{ fontSize: "1.15rem", letterSpacing: "0.5px" }}
                >
                  Doctor Hub
                </div>
                <small
                  className="text-white-50 text-uppercase fw-bold"
                  style={{ fontSize: "0.65rem", letterSpacing: "1px" }}
                >
                  Provider Portal
                </small>
              </div>
            </div>
          )}

          <button
            className="btn btn-link p-2 shadow-none hover-white text-white-50"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            style={{ margin: collapsed && !isMobile ? "0 auto" : "0" }}
          >
            {isMobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow-1 overflow-y-auto p-3 custom-scrollbar d-flex flex-column gap-2 mt-2">
          {navLinks.map((link) => {
            // Strict matching so only the correct tab highlights
            const isActive =
              location.pathname === link.path ||
              location.pathname.startsWith(`${link.path}/`);

            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={handleLinkClick}
                className={`d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none transition-all ${
                  isActive
                    ? "active-nav-item fw-bold shadow-sm"
                    : "text-white-50 hover-nav-item fw-medium"
                } ${collapsed && !isMobile ? "justify-content-center px-0" : ""}`}
                title={collapsed ? link.name : ""}
              >
                <link.icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? "text-white" : ""}
                  style={{
                    color: isActive ? "white" : "rgba(255,255,255,0.7)",
                  }}
                />
                {(!collapsed || isMobile) && (
                  <span
                    className="small tracking-wide"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {link.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout Section (Always visible at bottom) */}
        <div
          className="mt-auto"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            flexShrink: 0,
          }}
        >
          {(!collapsed || isMobile) && user && (
            <div className="px-4 py-3 border-bottom border-light border-opacity-10 d-flex align-items-center gap-3">
              <div
                className="text-white fw-black rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: 40,
                  height: 40,
                  fontSize: "1.1rem",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: `1px solid ${highlightColor}`,
                }}
              >
                {user.name?.charAt(0).toUpperCase() || "D"}
              </div>
              <div className="overflow-hidden">
                <div
                  className="text-white fw-bold text-truncate"
                  style={{ fontSize: "0.9rem" }}
                >
                  {user.name || "Dr. Provider"}
                </div>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <div
                    className="rounded-circle bg-success"
                    style={{ width: 8, height: 8 }}
                  ></div>
                  <div
                    className="text-white-50 fw-medium"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Medical Staff
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            className={`btn w-100 d-flex align-items-center gap-3 py-3 border-0 rounded-0 btn-logout transition-all ${
              collapsed && !isMobile ? "justify-content-center px-0" : "px-4"
            }`}
            onClick={handleLogout}
            title={collapsed ? "Logout" : ""}
          >
            <LogOut size={20} className={collapsed ? "mx-auto" : ""} />
            {(!collapsed || isMobile) && (
              <span className="small fw-bold">Sign Out Securely</span>
            )}
          </button>
        </div>
      </aside>

      <style>{`
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .cursor-pointer { cursor: pointer; }
        .tracking-wide { letter-spacing: 0.02em; }
        
        /* Active State */
        .active-nav-item {
          background-color: #0284c7; /* Sky Blue */
          color: #ffffff !important;
          box-shadow: 0 4px 15px rgba(2, 132, 199, 0.35) !important;
        }
        
        /* Hover states */
        .hover-white:hover { color: #ffffff !important; }
        .hover-nav-item:hover { 
          background-color: ${hoverColor} !important; 
          color: #ffffff !important; 
          transform: translateX(4px);
        }

        /* Custom Logout Button */
        .btn-logout {
          background-color: transparent;
          color: #fca5a5;
        }
        .btn-logout:hover {
          background-color: #ef4444 !important;
          color: #ffffff !important;
          box-shadow: 0 -4px 12px rgba(239, 68, 68, 0.15);
        }

        /* Scrollbar styling for dark theme */
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background-color: rgba(255, 255, 255, 0.1); 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background-color: rgba(255, 255, 255, 0.3); 
        }

        /* Fade in overlay */
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default DoctorSidebar;
