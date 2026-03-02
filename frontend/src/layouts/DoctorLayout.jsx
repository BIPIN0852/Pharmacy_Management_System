import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DoctorSidebar from "./DoctorSidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import { Bell, UserCircle, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DoctorLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // (Optional) Add unread notification state for doctors if you build a doctor messaging system later
  const [unreadCount, setUnreadCount] = useState(0);

  // --- Handle Screen Resize ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Profile Image Helper ---
  const getProfileImage = () => {
    if (
      user?.profilePhoto &&
      user.profilePhoto !== "none" &&
      !user.profilePhoto.includes("sample-doctor.jpg")
    ) {
      if (user.profilePhoto.startsWith("http")) return user.profilePhoto;
      let cleanPath = user.profilePhoto.replace(/\\/g, "/");
      if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
      return `http://localhost:5000${cleanPath}`;
    }
    return null;
  };

  return (
    <div
      className="d-flex min-vh-100 bg-light"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* 1. Sidebar */}
      <DoctorSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />

      {/* 2. Main Wrapper */}
      <div
        className="flex-grow-1 d-flex flex-column overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* --- TOP HEADER --- */}
        <header className="bg-white shadow-sm border-bottom border-light-subtle px-4 py-3 flex-shrink-0 z-3">
          <div className="d-flex align-items-center justify-content-between">
            {/* Left side: Mobile Menu Toggle & Title */}
            <div className="d-flex align-items-center gap-3">
              {isMobile && (
                <button
                  className="btn btn-light p-2 border"
                  onClick={() => setCollapsed(false)}
                >
                  <Menu size={20} />
                </button>
              )}
              <div className={isMobile ? "d-none d-sm-block" : ""}>
                <h4 className="mb-0 fw-black text-dark tracking-tight">
                  Clinical Portal
                </h4>
                <small className="text-muted fw-medium">
                  Manage appointments & patients
                </small>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="d-flex align-items-center gap-3 gap-md-4">
              {/* NOTIFICATION BELL */}
              <button
                className="btn btn-white border border-light-subtle rounded-circle p-2 position-relative shadow-sm hover-lift transition-all"
                title="Notifications"
              >
                <Bell size={20} className="text-dark" />
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Info */}
              <div
                className="d-flex align-items-center gap-3 border-start border-light-subtle ps-3 ps-md-4 cursor-pointer hover-opacity transition-all"
                onClick={() => navigate("/doctor/profile")}
                title="View Profile"
              >
                <div
                  className="text-end d-none d-md-block"
                  style={{ lineHeight: "1.2" }}
                >
                  <div className="fw-bold text-dark fs-6">
                    Dr. {user?.name?.split(" ")[0] || "Provider"}
                  </div>
                  <small
                    className="text-info fw-bold text-uppercase tracking-wider"
                    style={{ fontSize: "0.65rem" }}
                  >
                    {user?.speciality || "General Physician"}
                  </small>
                </div>

                {getProfileImage() ? (
                  <img
                    src={getProfileImage()}
                    alt="Profile"
                    className="rounded-circle object-fit-cover shadow-sm border border-2 border-info border-opacity-25"
                    style={{ width: "40px", height: "40px" }}
                  />
                ) : (
                  <div
                    className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <UserCircle size={24} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-grow-1 p-3 p-md-4 overflow-auto bg-light custom-scrollbar">
          {/* BREADCRUMBS */}
          <div className="mb-4">
            <Breadcrumbs />
          </div>

          {/* Renders the specific page (DoctorDashboard, Patients, etc.) */}
          <Outlet />
        </main>
      </div>

      <style>{`
        .tracking-tight { letter-spacing: -0.03em; }
        .tracking-wider { letter-spacing: 0.05em; }
        .transition-all { transition: all 0.2s ease-in-out; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
        .hover-opacity:hover { opacity: 0.8; }
        .cursor-pointer { cursor: pointer; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default DoctorLayout;
