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
  FileText,
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
    { name: "Manage Orders", path: "/pharmacist/orders", icon: ShoppingBag },
    { name: "Inventory", path: "/pharmacist/inventory", icon: Package },
    { name: "Sales & Reports", path: "/pharmacist/reports", icon: FileText },
    { name: "Refill Reminders", path: "/pharmacist/alerts", icon: BellRing }, // Note: Points to alerts page
    { name: "Expiry Alerts", path: "/pharmacist/alerts", icon: AlertTriangle },
    { name: "Customers", path: "/pharmacist/customers", icon: Users },
    { name: "My Profile", path: "/pharmacist/profile", icon: User },
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
      className="d-flex flex-column transition-all"
      style={{
        width: collapsed ? "65px" : "250px",
        height: "100vh",
        zIndex: 1050,
        position: "sticky",
        top: 0,
        backgroundColor: "#166534", // Deep Medical Green
        borderRight: "1px solid #14532D",
      }}
    >
      {/* Brand Header */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-3"
        style={{ height: "65px", backgroundColor: "#14532D" }} // Slightly darker header
      >
        {!collapsed && (
          <div className="d-flex align-items-center gap-2 overflow-hidden animate-fade-in">
            <Pill size={24} style={{ color: "#fff" }} />
            <div style={{ lineHeight: "1.1" }}>
              <div
                className="fw-bold text-white"
                style={{ fontSize: "1.1rem" }}
              >
                PharmaPanel
              </div>
              <small
                className="text-white-50 text-uppercase fw-semibold"
                style={{ fontSize: "0.6rem", letterSpacing: "0.5px" }}
              >
                Pharmacist Portal
              </small>
            </div>
          </div>
        )}
        <button
          className={`btn btn-sm text-white border-0 p-1 ${collapsed ? "mx-auto" : ""}`}
          onClick={() => setCollapsed(!collapsed)}
          style={{ opacity: 0.8 }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseOut={(e) => (e.currentTarget.style.opacity = 0.8)}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-grow-1 pt-3 overflow-y-auto sidebar-scroll">
        {menuItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `d-flex align-items-center gap-3 py-3 px-4 text-decoration-none transition-all ${
                isActive ? "active-nav-item fw-bold" : "inactive-nav-item"
              } ${collapsed ? "justify-content-center px-0" : ""}`
            }
            title={collapsed ? name : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? "text-white" : "text-white-50"}
                />
                {!collapsed && (
                  <span
                    className="small"
                    style={{ fontSize: "0.85rem", letterSpacing: "0.3px" }}
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
      <div className="mt-auto" style={{ backgroundColor: "#14532D" }}>
        {!collapsed && user && (
          <div
            className="px-4 py-3 border-bottom"
            style={{ borderColor: "rgba(255,255,255,0.05) !important" }}
          >
            <div
              className="text-white small fw-bold text-truncate"
              style={{ fontSize: "0.85rem" }}
            >
              {user.name || "Pharmacist"}
            </div>
            <div className="d-flex align-items-center gap-2 mt-1">
              <div
                className="rounded-circle bg-success"
                style={{ width: 8, height: 8 }}
              ></div>
              <div className="text-white-50" style={{ fontSize: "0.7rem" }}>
                Online
              </div>
            </div>
          </div>
        )}

        <button
          className="btn w-100 d-flex align-items-center gap-3 py-3 px-4 border-0 rounded-0 logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={20} className="text-white-50" />
          {!collapsed && (
            <span className="small fw-medium text-white-50">Sign Out</span>
          )}
        </button>
      </div>

      <style>{`
        .transition-all { transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        
        /* Enterprise Flat Active State */
        .active-nav-item {
          background-color: #064E3B; /* Deepest Green */
          color: #ffffff;
          border-left: 4px solid #34D399; /* Bright mint highlight */
        }
        
        /* Inactive State Hover */
        .inactive-nav-item {
          color: rgba(255, 255, 255, 0.7);
          border-left: 4px solid transparent;
        }
        .inactive-nav-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        /* Logout Hover */
        .logout-btn {
          background-color: transparent;
          transition: background-color 0.2s;
        }
        .logout-btn:hover {
          background-color: #B12704 !important; /* Amazon Error Red */
        }
        .logout-btn:hover span, .logout-btn:hover svg {
          color: #ffffff !important;
        }

        /* Custom Scrollbar */
        .sidebar-scroll::-webkit-scrollbar { width: 5px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
      `}</style>
    </aside>
  );
};

export default PharmacistSidebar;
