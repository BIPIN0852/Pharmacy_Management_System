import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  AlertTriangle,
  Calendar,
  Package,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle,
} from "lucide-react";

const PharmacistAlerts = () => {
  const [expiringMedicines, setExpiringMedicines] = useState([]);
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      // 1. Fetch Expiring Medicines (Backend API)
      const expiredRes = await api.get("/medicines/expired");
      setExpiringMedicines(expiredRes.data);

      // 2. Fetch All Medicines to filter Low Stock (Client Side Logic)
      const stockRes = await api.get("/medicines");
      const allMeds = Array.isArray(stockRes.data)
        ? stockRes.data
        : stockRes.data.medicines;

      // Filter for items with less than 15 units
      const lowStock = allMeds.filter((m) => (m.countInStock || 0) < 15);
      setLowStockMedicines(lowStock);
    } catch (err) {
      console.error("Alert Fetch Error:", err);
      setError("Failed to load alerts. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center py-5"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-danger me-2" />
        <span className="text-muted">Scanning inventory for risks...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0 animate-fade-in">
      {/* Header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
          <ShieldAlert className="text-danger" /> Critical Alerts
        </h3>
        <p className="text-muted small mb-0">
          Action required: Expiring batches and stock shortages
        </p>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      <div className="row g-4">
        {/* ------------------------------------------- */}
        {/* 1. EXPIRY ALERTS COLUMN */}
        {/* ------------------------------------------- */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100 rounded-4">
            <div className="card-header bg-danger bg-opacity-10 border-0 pt-4 px-4 pb-2">
              <h5 className="card-title fw-bold text-danger d-flex align-items-center gap-2">
                <Calendar size={20} /> Expiry Warnings
                <span className="badge bg-danger rounded-pill ms-auto">
                  {expiringMedicines.length}
                </span>
              </h5>
              <p className="small text-danger text-opacity-75 mb-0">
                Medicines expiring within the next 90 days
              </p>
            </div>
            <div className="card-body p-0">
              {expiringMedicines.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <CheckCircle
                    size={40}
                    className="text-success opacity-50 mb-2"
                  />
                  <p>No expiring medicines found.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-white text-muted small text-uppercase">
                      <tr>
                        <th className="ps-4">Medicine</th>
                        <th>Expiry Date</th>
                        <th className="text-end pe-4">Days Left</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expiringMedicines.map((m) => {
                        const daysLeft = getDaysRemaining(m.expiryDate);
                        return (
                          <tr key={m._id}>
                            <td className="ps-4">
                              <div className="fw-bold text-dark">{m.name}</div>
                              <div className="x-small text-muted">
                                Batch: {m.batchNumber || "N/A"}
                              </div>
                            </td>
                            <td className="text-danger fw-medium">
                              {new Date(m.expiryDate).toLocaleDateString()}
                            </td>
                            <td className="text-end pe-4">
                              <span
                                className={`badge rounded-pill ${daysLeft < 30 ? "bg-danger" : "bg-warning text-dark"}`}
                              >
                                {daysLeft} Days
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------------------------- */}
        {/* 2. LOW STOCK ALERTS COLUMN */}
        {/* ------------------------------------------- */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100 rounded-4">
            <div className="card-header bg-warning bg-opacity-10 border-0 pt-4 px-4 pb-2">
              <h5 className="card-title fw-bold text-warning-emphasis d-flex align-items-center gap-2">
                <Package size={20} /> Low Stock
                <span className="badge bg-warning text-dark rounded-pill ms-auto">
                  {lowStockMedicines.length}
                </span>
              </h5>
              <p className="small text-warning-emphasis text-opacity-75 mb-0">
                Items below threshold (15 units)
              </p>
            </div>
            <div className="card-body p-0">
              {lowStockMedicines.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <CheckCircle
                    size={40}
                    className="text-success opacity-50 mb-2"
                  />
                  <p>Inventory levels are healthy.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-white text-muted small text-uppercase">
                      <tr>
                        <th className="ps-4">Medicine</th>
                        <th>Category</th>
                        <th className="text-end pe-4">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockMedicines.map((m) => (
                        <tr key={m._id}>
                          <td className="ps-4">
                            <div className="fw-bold text-dark">{m.name}</div>
                            <div className="x-small text-muted">{m.brand}</div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {m.category}
                            </span>
                          </td>
                          <td className="text-end pe-4">
                            <div className="d-flex align-items-center justify-content-end gap-2 text-danger fw-bold">
                              <AlertTriangle size={14} />
                              {m.countInStock} Units
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .x-small { font-size: 0.75rem; }
      `}</style>
    </div>
  );
};

export default PharmacistAlerts;
