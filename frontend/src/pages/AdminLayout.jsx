// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import GlobalSearch from "../components/GlobalSearch";

// import AdminDashboard from "./AdminDashboard";
// import AdminUsers from "./AdminUsers";
// import AdminCustomers from "./AdminCustomers";
// import AdminMedicines from "./AdminMedicines";
// import AdminDoctors from "./AdminDoctors";
// import AdminAppointments from "./AdminAppointments";
// import AdminOrders from "./AdminOrders";
// import AdminSuppliers from "./AdminSuppliers";
// import AdminPurchases from "./AdminPurchases";
// import AdminReports from "./AdminReports";
// import AdminSettings from "./AdminSettings";

// const AdminLayout = () => {
//   return (
//     <div className="d-flex min-vh-100 bg-light">
//       <Sidebar />

//       <div className="flex-grow-1 d-flex flex-column overflow-hidden">
//         {/* Header with search */}
//         <header className="bg-white shadow-sm border-bottom px-4 py-3">
//           <div className="d-flex align-items-center justify-content-between">
//             <h4 className="mb-0 fw-bold text-dark">Admin Dashboard</h4>
//             <div style={{ minWidth: "300px" }}>
//               <GlobalSearch />
//             </div>
//           </div>
//         </header>

//         {/* Main content area with nested admin routes */}
//         <main className="flex-grow-1 p-4 overflow-auto">
//           <Routes>
//             <Route path="dashboard" element={<AdminDashboard />} />
//             <Route path="users" element={<AdminUsers />} />
//             <Route path="customers" element={<AdminCustomers />} />
//             <Route path="medicines" element={<AdminMedicines />} />
//             <Route path="doctors" element={<AdminDoctors />} />
//             <Route path="appointments" element={<AdminAppointments />} />
//             <Route path="orders" element={<AdminOrders />} />
//             <Route path="suppliers" element={<AdminSuppliers />} />
//             <Route path="purchases" element={<AdminPurchases />} />
//             <Route path="reports" element={<AdminReports />} />
//             <Route path="settings" element={<AdminSettings />} />
//             {/* default /admin -> /admin/dashboard */}
//             <Route index element={<Navigate to="dashboard" replace />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import GlobalSearch from "../components/GlobalSearch";
// import Breadcrumbs from "../components/Breadcrumbs"; // ✅ IMPORT BREADCRUMBS

// import AdminDashboard from "./AdminDashboard";
// import AdminUsers from "./AdminUsers";
// import AdminCustomers from "./AdminCustomers";
// import AdminMedicines from "./AdminMedicines";
// import AdminDoctors from "./AdminDoctors";
// import AdminAppointments from "./AdminAppointments";
// import AdminOrders from "./AdminOrders";
// import AdminSuppliers from "./AdminSuppliers";
// import AdminPurchases from "./AdminPurchases";
// import AdminReports from "./AdminReports";
// import AdminSettings from "./AdminSettings";

// const AdminLayout = () => {
//   return (
//     <div className="d-flex min-vh-100 bg-light">
//       {/* Sidebar Navigation */}
//       <Sidebar />

//       {/* Main Content Wrapper */}
//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         {/* Header with Search */}
//         <header className="bg-white shadow-sm border-bottom px-4 py-3 flex-shrink-0">
//           <div className="d-flex align-items-center justify-content-between">
//             <h4 className="mb-0 fw-bold text-dark">Admin Dashboard</h4>
//             <div style={{ minWidth: "300px" }}>
//               <GlobalSearch />
//             </div>
//           </div>
//         </header>

//         {/* Scrollable Main Content Area */}
//         <main className="flex-grow-1 p-4 overflow-auto bg-light">
//           {/* ✅ ADD BREADCRUMBS HERE */}
//           <Breadcrumbs />

//           {/* Nested Admin Routes */}
//           <Routes>
//             <Route path="dashboard" element={<AdminDashboard />} />
//             <Route path="users" element={<AdminUsers />} />
//             <Route path="customers" element={<AdminCustomers />} />
//             <Route path="medicines" element={<AdminMedicines />} />
//             <Route path="doctors" element={<AdminDoctors />} />
//             <Route path="appointments" element={<AdminAppointments />} />
//             <Route path="orders" element={<AdminOrders />} />
//             <Route path="suppliers" element={<AdminSuppliers />} />
//             <Route path="purchases" element={<AdminPurchases />} />
//             <Route path="reports" element={<AdminReports />} />
//             <Route path="settings" element={<AdminSettings />} />

//             {/* Default Redirect: /admin -> /admin/dashboard */}
//             <Route index element={<Navigate to="dashboard" replace />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import GlobalSearch from "../components/GlobalSearch";
import Breadcrumbs from "../components/Breadcrumbs";

// Import Admin Sub-Pages
import AdminDashboard from "./AdminDashboard";
import AdminUsers from "./AdminUsers";
import AdminCustomers from "./AdminCustomers"; // ✅ Ensure this is imported correctly
import AdminMedicines from "./AdminMedicines";
import AdminDoctors from "./AdminDoctors";
import AdminAppointments from "./AdminAppointments";
import AdminOrders from "./AdminOrders";
import AdminSuppliers from "./AdminSuppliers";
import AdminPurchases from "./AdminPurchases";
import AdminReports from "./AdminReports";
import AdminSettings from "./AdminSettings";

const AdminLayout = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    switch (path) {
      case "dashboard":
        return "Analytics Overview";
      case "users":
        return "Staff Management";
      case "customers":
        return "Customer Registry"; // ✅ Matches path name
      case "medicines":
        return "Pharmacy Inventory";
      case "doctors":
        return "Doctor Panel";
      case "appointments":
        return "Appointment Logs";
      case "orders":
        return "Global Orders";
      case "suppliers":
        return "Supplier Management";
      case "purchases":
        return "Stock Purchases";
      case "reports":
        return "Business Reports";
      case "settings":
        return "System Settings";
      default:
        return "Admin Portal";
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <div className="flex-shrink-0 shadow-lg" style={{ zIndex: 1100 }}>
        <Sidebar />
      </div>

      <div
        className="flex-grow-1 d-flex flex-column overflow-hidden"
        style={{ height: "100vh" }}
      >
        <header className="bg-white shadow-sm border-bottom px-4 py-3 flex-shrink-0 sticky-top">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="mb-0 fw-bold text-dark">{getPageTitle()}</h4>
              <small className="text-muted d-none d-md-block">
                Pharmacy Management System v1.0
              </small>
            </div>

            <div
              className="d-flex align-items-center gap-3"
              style={{ minWidth: "350px" }}
            >
              <GlobalSearch />
            </div>
          </div>
        </header>

        <main className="flex-grow-1 p-4 overflow-auto bg-light custom-scrollbar">
          <div className="mb-3">
            <Breadcrumbs />
          </div>

          <div className="animate-fade-in">
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />

              {/* ✅ FIX: Route name must match Sidebar link precisely */}
              <Route path="customers" element={<AdminCustomers />} />

              <Route path="medicines" element={<AdminMedicines />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="suppliers" element={<AdminSuppliers />} />
              <Route path="purchases" element={<AdminPurchases />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />

              {/* Redirect any unmatched path within /admin to dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
