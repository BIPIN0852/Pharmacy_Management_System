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
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // ✅ FIXED: Paths now match frontend AdminLayout routes precisely
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

  // Auto-collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setCollapsed(true);
      else setCollapsed(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
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
        position: "sticky",
        top: 0,
        zIndex: 1100,
        backgroundColor: "#0f172a", // Deep Slate Navy for Admin
        borderRight: "1px solid #1e293b",
      }}
    >
      {/* Brand Header */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-3"
        style={{ height: "65px", backgroundColor: "#0b1120" }} // Slightly darker header
      >
        {!collapsed && (
          <div className="d-flex align-items-center gap-2 overflow-hidden animate-fade-in">
            <LayoutDashboard size={22} className="text-primary" />
            <div style={{ lineHeight: "1.1" }}>
              <div
                className="fw-bold text-white"
                style={{ fontSize: "1.1rem" }}
              >
                AdminPanel
              </div>
              <small
                className="text-white-50 text-uppercase fw-semibold"
                style={{ fontSize: "0.6rem", letterSpacing: "0.5px" }}
              >
                System Manager
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

      {/* Navigation List */}
      <nav className="flex-grow-1 overflow-y-auto pt-3 sidebar-scroll">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `d-flex align-items-center gap-3 py-3 px-4 text-decoration-none transition-all ${
                isActive ? "active-nav-item fw-bold" : "inactive-nav-item"
              } ${collapsed ? "justify-content-center px-0" : ""}`
            }
            title={collapsed ? item.name : undefined}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? "text-primary" : "text-white-50"}
                />
                {!collapsed && (
                  <span
                    className="small"
                    style={{ fontSize: "0.85rem", letterSpacing: "0.3px" }}
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
      <div className="mt-auto" style={{ backgroundColor: "#0b1120" }}>
        {!collapsed && user && (
          <div
            className="px-4 py-3 border-bottom"
            style={{ borderColor: "rgba(255,255,255,0.05) !important" }}
          >
            <div
              className="text-white small fw-bold text-truncate"
              style={{ fontSize: "0.85rem" }}
            >
              {user.name || "Administrator"}
            </div>
            <div className="d-flex align-items-center gap-2 mt-1">
              <div
                className="rounded-circle bg-success"
                style={{ width: 8, height: 8 }}
              ></div>
              <div className="text-white-50" style={{ fontSize: "0.7rem" }}>
                SuperAdmin
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
          background-color: #1e293b; /* Slightly lighter slate */
          color: #ffffff;
          border-left: 4px solid #3b82f6; /* Bright blue highlight */
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
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
        
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </aside>
  );
};

export default Sidebar;
