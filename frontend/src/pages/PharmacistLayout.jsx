// import React from "react";
// import { Outlet } from "react-router-dom";
// import PharmacistSidebar from "../components/PharmacistSidebar";
// import { Bell, User } from "lucide-react";

// const PharmacistLayout = () => {
//   return (
//     <div className="d-flex min-vh-100 bg-light">
//       <PharmacistSidebar />
//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         {/* Header */}
//         <header className="bg-white shadow-sm border-bottom px-4 py-3 flex-shrink-0">
//           <div className="d-flex align-items-center justify-content-between">
//             <h4 className="mb-0 fw-bold text-dark">Pharmacist Dashboard</h4>
//             <div className="d-flex align-items-center gap-3">
//               <button className="btn btn-light rounded-circle p-2 border position-relative">
//                 <Bell size={20} className="text-muted" />
//                 <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
//               </button>
//               <div className="d-flex align-items-center gap-2 border-start ps-3">
//                 <div className="text-end d-none d-md-block">
//                   <div className="fw-bold small">Staff User</div>
//                   <small className="text-muted" style={{ fontSize: "0.7rem" }}>
//                     Pharmacist
//                   </small>
//                 </div>
//                 <div className="bg-success bg-opacity-10 p-2 rounded-circle text-success">
//                   <User size={20} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Content */}
//         <main className="flex-grow-1 p-4 overflow-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default PharmacistLayout;

import React from "react";
import { Outlet } from "react-router-dom";
import PharmacistSidebar from "../components/PharmacistSidebar";
import Breadcrumbs from "../components/Breadcrumbs"; // ✅ IMPORT BREADCRUMBS
import { Bell, User } from "lucide-react";

const PharmacistLayout = () => {
  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <PharmacistSidebar />

      {/* Main Wrapper */}
      <div
        className="flex-grow-1 d-flex flex-column overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-bottom px-4 py-3 flex-shrink-0">
          <div className="d-flex align-items-center justify-content-between">
            <h4 className="mb-0 fw-bold text-dark">Pharmacist Dashboard</h4>

            <div className="d-flex align-items-center gap-3">
              {/* Notifications */}
              <button className="btn btn-light rounded-circle p-2 border position-relative">
                <Bell size={20} className="text-muted" />
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
              </button>

              {/* User Profile */}
              <div className="d-flex align-items-center gap-2 border-start ps-3">
                <div className="text-end d-none d-md-block">
                  <div className="fw-bold small">Staff User</div>
                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                    Pharmacist
                  </small>
                </div>
                <div className="bg-success bg-opacity-10 p-2 rounded-circle text-success">
                  <User size={20} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow-1 p-4 overflow-auto bg-light">
          {/* ✅ ADD BREADCRUMBS HERE */}
          <Breadcrumbs />

          {/* Render Page Content */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PharmacistLayout;
