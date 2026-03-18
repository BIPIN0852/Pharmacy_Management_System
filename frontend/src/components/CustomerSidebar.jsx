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

  if (isMobile && collapsed) return null;

  return (
    <>
      {/* Mobile Overlay with blur effect */}
      {isMobile && !collapsed && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 animate-fade-in"
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
          boxShadow: isMobile ? "none" : "4px 0 25px rgba(0,0,0,0.03)",
        }}
      >
        {/* Brand Header */}
        <div
          className="d-flex align-items-center justify-content-between p-4 border-bottom bg-light bg-opacity-50"
          style={{ height: "80px" }}
        >
          {(!collapsed || isMobile) && (
            <div className="fw-black text-primary fs-4 d-flex align-items-center gap-2">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32 }}
              >
                <Plus size={20} strokeWidth={3} />
              </div>
              <span className="ls-tight tracking-tight">PharmaStore</span>
            </div>
          )}

          <button
            className="btn btn-light border-light-subtle btn-sm rounded-circle p-2 shadow-sm hover-lift"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isMobile ? (
              <X size={18} className="text-dark" />
            ) : (
              <Menu size={18} className="text-dark" />
            )}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow-1 p-3 overflow-y-auto sidebar-scroll d-flex flex-column gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => isMobile && setCollapsed(true)}
              className={({ isActive }) =>
                `d-flex align-items-center gap-3 p-3 rounded-4 text-decoration-none transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-sm active-glow"
                    : "text-secondary hover-sidebar-item bg-transparent"
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
                    <span
                      className={`small ${isActive ? "fw-bold" : "fw-medium"}`}
                    >
                      {item.name}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-top bg-light bg-opacity-50 mt-auto">
          {(!collapsed || isMobile) && user && (
            <div className="d-flex align-items-center gap-3 mb-4 bg-white p-3 rounded-4 shadow-sm border border-light-subtle">
              <div
                className="bg-primary bg-opacity-10 text-primary fw-black rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 40, height: 40, fontSize: "1.1rem" }}
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="overflow-hidden">
                <div className="small fw-bold text-dark text-truncate">
                  {user.name}
                </div>
                <div
                  className="text-muted fw-medium"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.02em" }}
                >
                  Customer Portal
                </div>
              </div>
            </div>
          )}

          <button
            className="btn btn-danger bg-opacity-10 text-danger border-0 w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-pill hover-danger shadow-sm transition-all"
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
        .transition-all { transition: all 0.2s ease-in-out; }
        .hover-lift:hover { transform: translateY(-2px); }
        .hover-sidebar-item:hover { background-color: #f8fafc !important; color: #0d6efd !important; transform: translateX(4px); }
        .hover-danger:hover { background-color: #dc3545 !important; color: white !important; }
        .active-glow { box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25) !important; }
        .ls-tight { letter-spacing: -0.5px; }
        .tracking-tight { letter-spacing: -0.02em; }
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
};

export default CustomerSidebar;
