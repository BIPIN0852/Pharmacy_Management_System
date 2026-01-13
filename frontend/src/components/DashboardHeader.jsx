// import React from "react";

// const DashboardHeader = ({ title, user }) => {
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "30px",
//       }}
//     >
//       <h1>{title}</h1>
//       <div>
//         <strong>{user?.name}</strong> ({user?.role})
//       </div>
//     </div>
//   );
// };

// export default DashboardHeader;

import React from "react";
import { Bell, UserCircle } from "lucide-react";

const DashboardHeader = ({ title, user }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-3 shadow-sm border-bottom">
      {/* Title Section */}
      <div>
        <h2 className="h4 fw-bold text-dark mb-0">{title}</h2>
        <p className="text-muted small mb-0">Welcome back to Smart Pharmacy</p>
      </div>

      {/* User & Actions Section */}
      <div className="d-flex align-items-center gap-4">
        {/* Notification Bell */}
        <div className="position-relative cursor-pointer">
          <Bell size={20} className="text-secondary" />
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.6rem" }}
          >
            3
          </span>
        </div>

        {/* User Info Wrapper */}
        <div className="d-flex align-items-center gap-2 border-start ps-4">
          <div className="text-end d-none d-sm-block">
            <div className="fw-bold text-dark small">
              {user?.name || "User"}
            </div>
            <div
              className="text-primary fw-medium"
              style={{ fontSize: "0.75rem", textTransform: "capitalize" }}
            >
              {user?.role || "Guest"}
            </div>
          </div>

          {/* Avatar Icon */}
          <div className="bg-light rounded-circle p-1">
            <UserCircle size={32} className="text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
