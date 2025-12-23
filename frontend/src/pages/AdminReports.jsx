// import React from "react";

// const AdminReports = () => {
//   return (
//     <div className="container-fluid">
//       <h3 className="mb-3 fw-bold">Reports</h3>
//       <p className="text-muted">
//         Sales, inventory and performance reports will be implemented here.
//       </p>
//     </div>
//   );
// };

// export default AdminReports;

import React, { useEffect, useState } from "react";
import api from "../services/api";

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    medicines: 0,
    doctors: 0,
    orders: 0,
    revenue: 0,
    salesData: [],
  });
  const [lowStock, setLowStock] = useState([]);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/dashboard", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = res.data || {};
      setStats(data.stats || stats);
      setLowStock(data.lowStock || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load report data from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSales = stats.revenue || 0;
  const totalOrders = stats.orders || 0;
  const avgOrderValue =
    totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : "0.00";

  const last3Months = (stats.salesData || []).slice(-3);
  const lastMonth = last3Months[last3Months.length - 1];
  const prevMonth = last3Months[last3Months.length - 2];

  let trendText = "Not enough data";
  if (lastMonth && prevMonth) {
    const diff = lastMonth.sales - prevMonth.sales;
    if (diff > 0) {
      trendText = `Up by Rs. ${diff.toFixed(2)} compared to previous month.`;
    } else if (diff < 0) {
      trendText = `Down by Rs. ${Math.abs(diff).toFixed(2)} vs previous month.`;
    } else {
      trendText = "Same as previous month.";
    }
  }

  return (
    <div className="container-fluid">
      <h3 className="mb-3 fw-bold">Reports</h3>
      <p className="text-muted">
        Sales, inventory and performance summaries generated from dashboard
        data.
      </p>

      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="d-flex align-items-center justify-content-center py-5">
          <div className="spinner-border text-primary me-2" role="status" />
          <span>Loading reports...</span>
        </div>
      ) : (
        <>
          {/* Top KPI cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-3 col-sm-6">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h6 className="text-muted text-uppercase mb-1 small">
                    Total Revenue
                  </h6>
                  <h4 className="fw-bold mb-0">
                    Rs. {Number(totalSales).toLocaleString()}
                  </h4>
                  <small className="text-muted">
                    From {totalOrders} orders
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h6 className="text-muted text-uppercase mb-1 small">
                    Average Order Value
                  </h6>
                  <h4 className="fw-bold mb-0">Rs. {avgOrderValue}</h4>
                  <small className="text-muted">
                    Revenue / number of orders
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h6 className="text-muted text-uppercase mb-1 small">
                    Total Medicines
                  </h6>
                  <h4 className="fw-bold mb-0">{stats.medicines}</h4>
                  <small className="text-muted">
                    Unique medicines in inventory
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h6 className="text-muted text-uppercase mb-1 small">
                    Registered Doctors
                  </h6>
                  <h4 className="fw-bold mb-0">{stats.doctors}</h4>
                  <small className="text-muted">
                    Linked to this pharmacy system
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly trend card */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-2">
                Monthly Revenue Trend
              </h5>
              {lastMonth ? (
                <>
                  <p className="mb-1">
                    Latest month: <strong>{lastMonth.month}</strong> –{" "}
                    <strong>Rs. {lastMonth.sales.toFixed(2)}</strong>
                  </p>
                  <p className="text-muted mb-0 small">{trendText}</p>
                </>
              ) : (
                <p className="text-muted mb-0">
                  Not enough monthly data to calculate trend.
                </p>
              )}
            </div>
          </div>

          {/* Low stock table */}
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-3">
                Low Stock Medicines
              </h5>
              {lowStock.length === 0 ? (
                <p className="text-muted mb-0">
                  All medicines currently have healthy stock levels.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Expiry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStock.map((m) => (
                        <tr key={m._id || m.id}>
                          <td>{m.name}</td>
                          <td>{m.category || "-"}</td>
                          <td>{m.quantity ?? m.stock ?? 0}</td>
                          <td>
                            {m.expiryDate
                              ? String(m.expiryDate).substring(0, 10)
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="text-muted small mt-2 mb-0">
                Consider reordering items with very low quantity to avoid
                stock‑outs.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReports;
