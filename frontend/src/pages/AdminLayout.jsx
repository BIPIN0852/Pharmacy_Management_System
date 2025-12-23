import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import GlobalSearch from "../components/GlobalSearch";

import AdminDashboard from "./AdminDashboard";
import AdminUsers from "./AdminUsers";
import AdminCustomers from "./AdminCustomers";
import AdminMedicines from "./AdminMedicines";
import AdminDoctors from "./AdminDoctors";
import AdminAppointments from "./AdminAppointments";
import AdminOrders from "./AdminOrders";
import AdminSuppliers from "./AdminSuppliers";
import AdminPurchases from "./AdminPurchases";
import AdminReports from "./AdminReports";
import AdminSettings from "./AdminSettings";

const AdminLayout = () => {
  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />

      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Header with search */}
        <header className="bg-white shadow-sm border-bottom px-4 py-3">
          <div className="d-flex align-items-center justify-content-between">
            <h4 className="mb-0 fw-bold text-dark">Admin Dashboard</h4>
            <div style={{ minWidth: "300px" }}>
              <GlobalSearch />
            </div>
          </div>
        </header>

        {/* Main content area with nested admin routes */}
        <main className="flex-grow-1 p-4 overflow-auto">
          <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="medicines" element={<AdminMedicines />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="suppliers" element={<AdminSuppliers />} />
            <Route path="purchases" element={<AdminPurchases />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            {/* default /admin -> /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
