import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Pill,
  Stethoscope,
  Calendar,
  ShoppingBag,
  Truck,
  FileBarChart,
  Settings,
  LogOut,
  CreditCard,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Paths match frontend AdminLayout routes precisely
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Staff Management", path: "/admin/users", icon: Users },
    { name: "Customer List", path: "/admin/customers", icon: UserCheck },
    { name: "Medicines", path: "/admin/medicines", icon: Pill },
    { name: "Doctor Management", path: "/admin/doctors", icon: Stethoscope },
    { name: "Appointments", path: "/admin/appointments", icon: Calendar },
    { name: "Global Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Suppliers", path: "/admin/suppliers", icon: Truck },
    { name: "Purchases", path: "/admin/purchases", icon: CreditCard },
    { name: "System Reports", path: "/admin/reports", icon: FileBarChart },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  // Robust resize listener to handle Mobile vs Desktop automatically
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsMobile(true);
        setCollapsed(true);
      } else {
        setIsMobile(false);
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarBgColor = "#0f172a";
  const headerBgColor = "#0b1120";
  const hoverColor = "rgba(255, 255, 255, 0.05)";
  const activeNavColor = "#1e293b";
  const highlightColor = "#3b82f6"; // Bright Blue

  return (
    <>
      {/*  Floating Action Button specifically for Mobile to open the menu */}
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
            backgroundColor: highlightColor,
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
        />
      )}

      <aside
        className={`d-flex flex-column transition-all duration-300 ${
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
          borderRight: `1px solid ${headerBgColor}`,
          boxShadow: isMobile ? "none" : "4px 0 25px rgba(0,0,0,0.1)",
          // Smoothly slides off-screen on mobile instead of crashing/disappearing
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
            backgroundColor: headerBgColor,
            flexShrink: 0,
          }}
        >
          {(!collapsed || isMobile) && (
            <div className="d-flex align-items-center gap-3 overflow-hidden animate-fade-in ps-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                style={{
                  width: "38px",
                  height: "38px",
                  backgroundColor: highlightColor,
                  color: "white",
                }}
              >
                <LayoutDashboard size={20} strokeWidth={2.5} />
              </div>
              <div style={{ lineHeight: "1.2" }}>
                <div
                  className="fw-black text-white tracking-wide"
                  style={{ fontSize: "1.15rem", letterSpacing: "0.5px" }}
                >
                  AdminPanel
                </div>
                <small
                  className="text-white-50 text-uppercase fw-bold"
                  style={{ fontSize: "0.65rem", letterSpacing: "1px" }}
                >
                  System Manager
                </small>
              </div>
            </div>
          )}
          <button
            className="btn btn-link p-2 shadow-none hover-lift text-white"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            style={{
              opacity: 0.8,
              margin: collapsed && !isMobile ? "0 auto" : "0",
            }}
          >
            {isMobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-grow-1 overflow-y-auto p-3 sidebar-scroll d-flex flex-column gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => isMobile && setCollapsed(true)}
              className={({ isActive }) =>
                `d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none transition-all ${
                  isActive
                    ? "active-nav-item fw-bold shadow-sm"
                    : "inactive-nav-item fw-medium"
                } ${collapsed && !isMobile ? "justify-content-center px-0" : ""}`
              }
              title={collapsed ? item.name : undefined}
            >
              {({ isActive }) => (
                <>
                  <item.icon
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
                      {item.name}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Admin Footer */}
        <div
          className="mt-auto"
          style={{ backgroundColor: headerBgColor, flexShrink: 0 }}
        >
          {(!collapsed || isMobile) && user && (
            <div className="px-4 py-3 border-bottom border-light border-opacity-10 d-flex align-items-center gap-3">
              <div
                className="text-white fw-black rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: 40,
                  height: 40,
                  fontSize: "1.1rem",
                  backgroundColor: activeNavColor,
                  border: `1px solid ${highlightColor}`,
                }}
              >
                {user.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="overflow-hidden">
                <div
                  className="text-white fw-bold text-truncate"
                  style={{ fontSize: "0.9rem" }}
                >
                  {user.name || "Administrator"}
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
                    SuperAdmin
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            className={`btn w-100 d-flex align-items-center gap-3 py-3 border-0 rounded-0 logout-btn transition-all ${
              collapsed && !isMobile ? "justify-content-center px-0" : "px-4"
            }`}
            onClick={handleLogout}
            title={collapsed ? "Logout" : ""}
          >
            <LogOut size={20} className="text-white-50" />
            {(!collapsed || isMobile) && (
              <span className="small fw-bold text-white-50">
                Sign Out Securely
              </span>
            )}
          </button>
        </div>
      </aside>

      <style>{`
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-2px); opacity: 1 !important; }
        
        /* Enterprise Flat Active State */
        .active-nav-item {
          background-color: ${activeNavColor}; 
          color: #ffffff;
          border-left: 4px solid ${highlightColor}; 
        }
        
        /* Inactive State Hover */
        .inactive-nav-item {
          color: rgba(255, 255, 255, 0.75);
          border-left: 4px solid transparent;
        }
        .inactive-nav-item:hover {
          background-color: ${hoverColor};
          color: #ffffff;
          transform: translateX(4px);
        }

        /* Logout Hover */
        .logout-btn {
          background-color: transparent;
        }
        .logout-btn:hover {
          background-color: #B12704 !important; /* Safety Red */
        }
        .logout-btn:hover span, .logout-btn:hover svg {
          color: #ffffff !important;
        }

        .tracking-wide { letter-spacing: 0.02em; }
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* Custom Scrollbar */
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
      `}</style>
    </>
  );
};

export default Sidebar;
