import React from "react";
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
  FileText,
  X,
} from "lucide-react";

const PharmacistSidebar = ({ collapsed, setCollapsed, isMobile }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/pharmacist/dashboard", icon: LayoutDashboard },
    {
      name: "Prescriptions",
      path: "/pharmacist/prescriptions",
      icon: ClipboardList,
    },
    { name: "Manage Orders", path: "/pharmacist/orders", icon: ShoppingBag },
    { name: "Inventory", path: "/pharmacist/inventory", icon: Package },
    { name: "Sales & Reports", path: "/pharmacist/reports", icon: FileText },
    { name: "Refill Reminders", path: "/pharmacist/refills", icon: BellRing }, // Updated path
    { name: "Expiry Alerts", path: "/pharmacist/alerts", icon: AlertTriangle },
    { name: "Customers", path: "/pharmacist/customers", icon: Users },
    { name: "My Profile", path: "/pharmacist/profile", icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarBgColor = "#0f766e";
  const headerBgColor = "#0d5f58";
  const hoverColor = "rgba(255, 255, 255, 0.08)";
  const activeNavColor = "#115e59";
  const highlightColor = "#5eead4";

  return (
    <>
      <aside
        className={`d-flex flex-column transition-all duration-300 ${
          isMobile
            ? "position-fixed top-0 start-0 shadow-lg"
            : "position-sticky top-0"
        }`}
        style={{
          width: collapsed && !isMobile ? "85px" : "280px",
          height: "100vh", // Strictly forces it to take the full page height
          zIndex: 1050,
          backgroundColor: sidebarBgColor,
          color: "white",
          borderRight: `1px solid ${headerBgColor}`,
          boxShadow: isMobile ? "none" : "4px 0 25px rgba(0,0,0,0.05)",
          // Smoothly slides off-screen on mobile instead of disappearing/crashing
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
                className="d-flex align-items-center justify-content-center rounded-circle shadow-sm flex-shrink-0"
                style={{
                  width: "38px",
                  height: "38px",
                  backgroundColor: highlightColor,
                  color: sidebarBgColor,
                }}
              >
                <Pill size={22} strokeWidth={2.5} />
              </div>
              <div style={{ lineHeight: "1.2" }}>
                <div
                  className="fw-black text-white tracking-wide"
                  style={{ fontSize: "1.15rem", letterSpacing: "0.5px" }}
                >
                  PharmaStore
                </div>
                <small
                  className="text-white-50 text-uppercase fw-bold"
                  style={{ fontSize: "0.65rem", letterSpacing: "1px" }}
                >
                  Pharmacist Portal
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

        {/* Navigation Section */}
        <nav className="flex-grow-1 p-3 overflow-y-auto sidebar-scroll d-flex flex-column gap-1">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              // ✅ ADDED end PROP: This strictly ensures that sub-routes don't trigger multiple highlights
              end
              onClick={() => isMobile && setCollapsed(true)}
              className={({ isActive }) =>
                `d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none transition-all ${
                  isActive
                    ? "active-nav-item fw-bold shadow-sm"
                    : "inactive-nav-item fw-medium"
                } ${collapsed && !isMobile ? "justify-content-center px-0" : ""}`
              }
              title={collapsed ? name : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={
                      isActive ? "text-white flex-shrink-0" : "flex-shrink-0"
                    }
                    style={{
                      color: isActive ? "white" : "rgba(255,255,255,0.7)",
                    }}
                  />
                  {(!collapsed || isMobile) && (
                    <span
                      className="small tracking-wide text-truncate"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {name}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout Footer */}
        <div
          className="mt-auto"
          style={{ backgroundColor: headerBgColor, flexShrink: 0 }}
        >
          {(!collapsed || isMobile) && user && (
            <div className="px-4 py-3 border-bottom border-light border-opacity-10 d-flex align-items-center gap-3">
              <div
                className="text-white fw-black rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                style={{
                  width: 40,
                  height: 40,
                  fontSize: "1.1rem",
                  backgroundColor: activeNavColor,
                  border: `1px solid ${highlightColor}`,
                }}
              >
                {user.name?.charAt(0).toUpperCase() || "P"}
              </div>
              <div className="overflow-hidden">
                <div
                  className="text-white fw-bold text-truncate"
                  style={{ fontSize: "0.9rem" }}
                >
                  {user.name || "Pharmacist"}
                </div>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <div
                    className="rounded-circle flex-shrink-0"
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: highlightColor,
                    }}
                  ></div>
                  <div
                    className="text-white-50 fw-medium text-truncate"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Online Staff
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
            <LogOut size={20} className="text-white-50 flex-shrink-0" />
            {(!collapsed || isMobile) && (
              <span className="small fw-bold text-white-50 text-truncate">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      <style>{`
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-2px); opacity: 1 !important; }
        
        /* Clinical Theme Active State */
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

export default PharmacistSidebar;
