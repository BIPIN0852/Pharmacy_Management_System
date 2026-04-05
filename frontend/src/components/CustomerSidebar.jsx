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
  Plus,
} from "lucide-react";

const CustomerSidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/customer/dashboard", icon: LayoutDashboard },
    { name: "Pharmacy Store", path: "/medicines", icon: Pill },
    { name: "Saved Items", path: "/customer/saved", icon: Heart },
    { name: "My Appointments", path: "/appointments", icon: Calendar },
    { name: "Order History", path: "/orders", icon: ShoppingBag },
    { name: "My Prescriptions", path: "/prescriptions", icon: FileText },
    { name: "My Profile", path: "/profile", icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // The primary color used for the sidebar background
  const sidebarBgColor = "#0f172a"; // Deep slate blue
  const hoverColor = "#1e293b"; // Slightly lighter slate

  return (
    <>
      {/*  Floating Action Button specifically for Mobile to open the menu */}
      {isMobile && collapsed && (
        <button
          className="btn btn-primary position-fixed shadow-lg d-flex align-items-center justify-content-center animate-fade-in"
          onClick={() => setCollapsed(false)}
          style={{
            bottom: "30px",
            right: "24px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            zIndex: 1040,
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
        />
      )}

      <aside
        className={`border-end d-flex flex-column transition-all duration-300 ${
          isMobile
            ? "position-fixed top-0 start-0 shadow-lg"
            : "position-sticky top-0"
        }`}
        style={{
          width: collapsed && !isMobile ? "85px" : "280px",
          height: "100vh",
          zIndex: 1050,
          backgroundColor: sidebarBgColor,
          color: "white",
          boxShadow: isMobile ? "none" : "4px 0 25px rgba(0,0,0,0.1)",
          // Smoothly slides off-screen on mobile
          transform:
            isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
          visibility: isMobile && collapsed ? "hidden" : "visible",
        }}
      >
        {/* Brand Header */}
        <div
          className="d-flex align-items-center justify-content-between p-4"
          style={{
            height: "80px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            flexShrink: 0,
          }}
        >
          {(!collapsed || isMobile) && (
            <div className="fw-black text-white fs-4 d-flex align-items-center gap-2">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                style={{ width: 32, height: 32 }}
              >
                <Plus size={20} strokeWidth={3} />
              </div>
              <span className="ls-tight tracking-tight">PharmaStore</span>
            </div>
          )}

          <button
            className="btn btn-link p-2 shadow-none hover-lift text-white"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            style={{ opacity: 0.8 }}
          >
            {isMobile ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow-1 p-3 overflow-y-auto sidebar-scroll d-flex flex-column gap-2 mt-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => isMobile && setCollapsed(true)}
              className={({ isActive }) =>
                `d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-sm active-glow fw-bold"
                    : "text-white opacity-75 hover-sidebar-item fw-medium"
                } ${
                  collapsed && !isMobile ? "justify-content-center px-0" : ""
                }`
              }
              title={collapsed ? item.name : ""}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {(!collapsed || isMobile) && (
                    <span className="small tracking-wide">{item.name}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout (Always visible at bottom) */}
        <div
          className="p-4 mt-auto"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            flexShrink: 0,
          }}
        >
          {(!collapsed || isMobile) && user && (
            <div
              className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3 shadow-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <div
                className="bg-primary text-white fw-black rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: 40,
                  height: 40,
                  fontSize: "1.1rem",
                  flexShrink: 0,
                }}
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="overflow-hidden">
                <div className="small fw-bold text-white text-truncate">
                  {user.name}
                </div>
                <div
                  className="text-white opacity-50 fw-medium d-flex align-items-center gap-1"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                >
                  <div
                    className="bg-success rounded-circle"
                    style={{ width: "6px", height: "6px" }}
                  ></div>
                  Online
                </div>
              </div>
            </div>
          )}

          <button
            className={`btn border-0 w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-pill hover-danger transition-all ${
              collapsed && !isMobile ? "px-0" : ""
            }`}
            style={{
              backgroundColor: "rgba(220, 53, 69, 0.1)",
              color: "#ff6b6b",
            }}
            onClick={handleLogout}
            title={collapsed ? "Logout" : ""}
          >
            <LogOut size={18} strokeWidth={2.5} />
            {(!collapsed || isMobile) && (
              <span className="fw-bold small">Logout</span>
            )}
          </button>
        </div>
      </aside>

      <style>{`
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-2px); opacity: 1 !important; }
        
        /* Dark Theme Sidebar Hover Effects */
        .hover-sidebar-item:hover { 
          background-color: ${hoverColor} !important; 
          opacity: 1 !important;
          transform: translateX(4px); 
        }
        
        .hover-danger:hover { 
          background-color: #dc3545 !important; 
          color: white !important; 
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3) !important;
        }
        
        .active-glow { box-shadow: 0 4px 15px rgba(13, 110, 253, 0.35) !important; }
        .ls-tight { letter-spacing: -0.5px; }
        .tracking-tight { letter-spacing: -0.02em; }
        .tracking-wide { letter-spacing: 0.02em; }
        
        /* Custom Scrollbar for Dark Sidebar */
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
};

export default CustomerSidebar;
