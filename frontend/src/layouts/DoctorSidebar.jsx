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
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 z-2"
          onClick={() => setCollapsed(true)}
        ></div>
      )}

      <div
        className="bg-white border-end border-light-subtle d-flex flex-column transition-all shadow-sm z-3"
        style={{
          width: isMobile ? "260px" : sidebarWidth,
          height: "100vh",
          position: isMobile ? "fixed" : "sticky",
          top: 0,
          left: isMobile && collapsed ? "-260px" : "0",
          overflowX: "hidden",
        }}
      >
        {/* Brand Header */}
        <div
          className="d-flex align-items-center justify-content-between p-4 border-bottom border-light-subtle"
          style={{ height: "73px" }}
        >
          <div
            className="d-flex align-items-center gap-2 text-info overflow-hidden cursor-pointer"
            onClick={() => {
              navigate("/doctor-dashboard");
              handleLinkClick();
            }}
          >
            <Stethoscope
              size={28}
              strokeWidth={2.5}
              className="flex-shrink-0"
            />
            {!collapsed && (
              <span className="fw-black fs-5 text-dark tracking-tight text-nowrap">
                Provider Hub
              </span>
            )}
          </div>

          {/* Mobile Close Button */}
          {isMobile && (
            <button
              className="btn btn-link text-dark p-0"
              onClick={() => setCollapsed(true)}
            >
              <X size={24} />
            </button>
          )}

          {/* Desktop Toggle Button */}
          {!isMobile && (
            <button
              className="btn btn-link text-muted p-0 ms-auto hover-info"
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
              // ✅ FIXED: Strict matching so only the correct tab highlights
              const isActive =
                location.pathname === link.path ||
                location.pathname.startsWith(`${link.path}/`);

              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={handleLinkClick} // ✅ FIXED: Closes sidebar on mobile
                    className={`d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none transition-all fw-bold ${
                      isActive
                        ? "bg-info bg-opacity-10 text-info"
                        : "text-muted hover-bg-light hover-text-dark"
                    }`}
                    title={collapsed ? link.name : ""}
                  >
                    <link.icon
                      size={20}
                      className={isActive ? "text-info" : ""}
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
        <div className="p-3 border-top border-light-subtle">
          <button
            onClick={handleLogout}
            className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 text-danger fw-bold hover-bg-danger transition-all"
            title={collapsed ? "Logout" : ""}
          >
            <LogOut size={20} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>

      <style>{`
        .hover-bg-light:hover { background-color: #f8fafc; }
        .hover-text-dark:hover { color: #0f172a !important; }
        .hover-info:hover { color: #0dcaf0 !important; }
        .hover-bg-danger:hover { background-color: #fee2e2; border-color: #fecaca; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </>
  );
};

export default DoctorSidebar;
