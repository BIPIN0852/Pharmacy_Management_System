import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const { logout } = useAuth();

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

  const sidebarWidth = collapsed ? "80px" : "260px";

  // Auto-close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (isMobile) {
      setCollapsed(true);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !collapsed && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 z-2 animate-fade-in"
          onClick={() => setCollapsed(true)}
        ></div>
      )}

      <div
        className="d-flex flex-column transition-all shadow-lg z-3 text-white"
        style={{
          width: isMobile ? "260px" : sidebarWidth,
          height: "100vh",
          position: isMobile ? "fixed" : "sticky",
          top: 0,
          left: isMobile && collapsed ? "-260px" : "0",
          overflowX: "hidden",
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)", // Rich dark blue gradient
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Brand Header */}
        <div
          className="d-flex align-items-center justify-content-between p-4 border-bottom"
          style={{ height: "73px", borderColor: "rgba(255,255,255,0.1)" }}
        >
          <div
            className="d-flex align-items-center gap-2 overflow-hidden cursor-pointer"
            style={{ color: "#38bdf8" }} // Bright blue brand color
            onClick={() => {
              navigate("/doctor-dashboard");
              handleLinkClick();
            }}
          >
            <div className="bg-white bg-opacity-10 p-2 rounded-3 d-flex justify-content-center align-items-center">
              <Stethoscope
                size={24}
                strokeWidth={2.5}
                className="flex-shrink-0"
              />
            </div>
            {!collapsed && (
              <span className="fw-black fs-5 tracking-tight text-white text-nowrap">
                Doctor Hub
              </span>
            )}
          </div>

          {/* Mobile Close Button */}
          {isMobile && (
            <button
              className="btn btn-link text-white-50 p-0 hover-white"
              onClick={() => setCollapsed(true)}
            >
              <X size={24} />
            </button>
          )}

          {/* Desktop Toggle Button */}
          {!isMobile && (
            <button
              className="btn btn-link text-white-50 p-0 ms-auto hover-white"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-grow-1 overflow-auto py-4 px-3 custom-scrollbar">
          <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
            {navLinks.map((link) => {
              // Strict matching so only the correct tab highlights
              const isActive =
                location.pathname === link.path ||
                location.pathname.startsWith(`${link.path}/`);

              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={handleLinkClick}
                    className={`d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none transition-all fw-bold ${
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-white-50 hover-nav-item"
                    }`}
                    title={collapsed ? link.name : ""}
                  >
                    <link.icon
                      size={20}
                      className={isActive ? "text-white" : "text-white-50"}
                    />
                    {!collapsed && (
                      <span className="text-nowrap">{link.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout Section */}
        <div
          className="p-3 border-top"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <button
            onClick={handleLogout}
            className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-bold transition-all btn-logout"
            title={collapsed ? "Logout" : ""}
          >
            <LogOut size={20} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>

      <style>{`
        /* Smooth transitions */
        .transition-all { transition: all 0.3s ease; }
        .cursor-pointer { cursor: pointer; }
        .tracking-tight { letter-spacing: -0.025em; }
        
        /* Hover states */
        .hover-white:hover { color: #ffffff !important; }
        .hover-nav-item:hover { 
          background-color: rgba(255, 255, 255, 0.05); 
          color: #ffffff !important; 
        }
        .hover-nav-item:hover svg {
          color: #38bdf8 !important;
        }

        /* Custom Logout Button */
        .btn-logout {
          background-color: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
          border: 1px solid transparent;
        }
        .btn-logout:hover {
          background-color: #ef4444;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        /* Scrollbar styling for dark theme */
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background-color: rgba(255, 255, 255, 0.1); 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background-color: rgba(255, 255, 255, 0.2); 
        }

        /* Fade in overlay */
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.5; }
        }
      `}</style>
    </>
  );
};

export default DoctorSidebar;
