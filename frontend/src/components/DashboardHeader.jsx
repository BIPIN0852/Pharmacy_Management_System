import React from "react";
import { Bell, UserCircle } from "lucide-react";

const DashboardHeader = ({ title, user }) => {
  return (
    <div
      className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-3"
      style={{ border: "1px solid #D5D9D9" }}
    >
      {/* Title Section */}
      <div>
        <h2 className="h4 fw-bold mb-1" style={{ color: "#0F1111" }}>
          {title}
        </h2>
        <p className="small mb-0" style={{ color: "#565959" }}>
          Welcome back to PharmacyStore
        </p>
      </div>

      {/* User & Actions Section */}
      <div className="d-flex align-items-center gap-4">
        {/* Notification Bell */}
        <div className="position-relative" style={{ cursor: "pointer" }}>
          <Bell size={22} style={{ color: "#0F1111" }} />
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
            style={{
              backgroundColor: "#B12704",
              fontSize: "0.6rem",
              border: "2px solid #fff",
            }}
          >
            3
          </span>
        </div>

        {/* User Info Wrapper */}
        <div
          className="d-flex align-items-center gap-3 border-start ps-4"
          style={{ borderColor: "#D5D9D9" }}
        >
          <div className="text-end d-none d-sm-block">
            <div
              className="fw-bold small"
              style={{ color: "#0F1111", lineHeight: "1.2" }}
            >
              {user?.name || "User"}
            </div>
            <div
              className="fw-medium mt-1"
              style={{
                fontSize: "0.75rem",
                textTransform: "capitalize",
                color: "#007185",
              }}
            >
              {user?.role || "Guest"}
            </div>
          </div>

          {/* Avatar Icon */}
          <div className="d-flex align-items-center justify-content-center">
            <UserCircle
              size={32}
              style={{ color: "#565959", strokeWidth: "1.5" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
