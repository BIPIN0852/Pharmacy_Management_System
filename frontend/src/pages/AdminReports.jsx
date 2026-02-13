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

// import React, { useEffect, useState } from "react";
// import api from "../services/api";

// const AdminReports = () => {
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     users: 0,
//     medicines: 0,
//     doctors: 0,
//     orders: 0,
//     revenue: 0,
//     salesData: [],
//   });
//   const [lowStock, setLowStock] = useState([]);
//   const [error, setError] = useState("");

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       const res = await api.get("/admin/dashboard", {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });
//       const data = res.data || {};
//       setStats(data.stats || stats);
//       setLowStock(data.lowStock || []);
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load report data from server."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const totalSales = stats.revenue || 0;
//   const totalOrders = stats.orders || 0;
//   const avgOrderValue =
//     totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : "0.00";

//   const last3Months = (stats.salesData || []).slice(-3);
//   const lastMonth = last3Months[last3Months.length - 1];
//   const prevMonth = last3Months[last3Months.length - 2];

//   let trendText = "Not enough data";
//   if (lastMonth && prevMonth) {
//     const diff = lastMonth.sales - prevMonth.sales;
//     if (diff > 0) {
//       trendText = `Up by Rs. ${diff.toFixed(2)} compared to previous month.`;
//     } else if (diff < 0) {
//       trendText = `Down by Rs. ${Math.abs(diff).toFixed(2)} vs previous month.`;
//     } else {
//       trendText = "Same as previous month.";
//     }
//   }

//   return (
//     <div className="container-fluid">
//       <h3 className="mb-3 fw-bold">Reports</h3>
//       <p className="text-muted">
//         Sales, inventory and performance summaries generated from dashboard
//         data.
//       </p>

//       {error && (
//         <div className="alert alert-danger py-2" role="alert">
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="d-flex align-items-center justify-content-center py-5">
//           <div className="spinner-border text-primary me-2" role="status" />
//           <span>Loading reports...</span>
//         </div>
//       ) : (
//         <>
//           {/* Top KPI cards */}
//           <div className="row g-3 mb-4">
//             <div className="col-md-3 col-sm-6">
//               <div className="card shadow-sm border-0">
//                 <div className="card-body">
//                   <h6 className="text-muted text-uppercase mb-1 small">
//                     Total Revenue
//                   </h6>
//                   <h4 className="fw-bold mb-0">
//                     Rs. {Number(totalSales).toLocaleString()}
//                   </h4>
//                   <small className="text-muted">
//                     From {totalOrders} orders
//                   </small>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3 col-sm-6">
//               <div className="card shadow-sm border-0">
//                 <div className="card-body">
//                   <h6 className="text-muted text-uppercase mb-1 small">
//                     Average Order Value
//                   </h6>
//                   <h4 className="fw-bold mb-0">Rs. {avgOrderValue}</h4>
//                   <small className="text-muted">
//                     Revenue / number of orders
//                   </small>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3 col-sm-6">
//               <div className="card shadow-sm border-0">
//                 <div className="card-body">
//                   <h6 className="text-muted text-uppercase mb-1 small">
//                     Total Medicines
//                   </h6>
//                   <h4 className="fw-bold mb-0">{stats.medicines}</h4>
//                   <small className="text-muted">
//                     Unique medicines in inventory
//                   </small>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3 col-sm-6">
//               <div className="card shadow-sm border-0">
//                 <div className="card-body">
//                   <h6 className="text-muted text-uppercase mb-1 small">
//                     Registered Doctors
//                   </h6>
//                   <h4 className="fw-bold mb-0">{stats.doctors}</h4>
//                   <small className="text-muted">
//                     Linked to this pharmacy system
//                   </small>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Monthly trend card */}
//           <div className="card shadow-sm border-0 mb-4">
//             <div className="card-body">
//               <h5 className="card-title fw-semibold mb-2">
//                 Monthly Revenue Trend
//               </h5>
//               {lastMonth ? (
//                 <>
//                   <p className="mb-1">
//                     Latest month: <strong>{lastMonth.month}</strong> –{" "}
//                     <strong>Rs. {lastMonth.sales.toFixed(2)}</strong>
//                   </p>
//                   <p className="text-muted mb-0 small">{trendText}</p>
//                 </>
//               ) : (
//                 <p className="text-muted mb-0">
//                   Not enough monthly data to calculate trend.
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Low stock table */}
//           <div className="card shadow-sm border-0">
//             <div className="card-body">
//               <h5 className="card-title fw-semibold mb-3">
//                 Low Stock Medicines
//               </h5>
//               {lowStock.length === 0 ? (
//                 <p className="text-muted mb-0">
//                   All medicines currently have healthy stock levels.
//                 </p>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table table-sm table-hover align-middle">
//                     <thead className="table-light">
//                       <tr>
//                         <th>Name</th>
//                         <th>Category</th>
//                         <th>Quantity</th>
//                         <th>Expiry</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {lowStock.map((m) => (
//                         <tr key={m._id || m.id}>
//                           <td>{m.name}</td>
//                           <td>{m.category || "-"}</td>
//                           <td>{m.quantity ?? m.stock ?? 0}</td>
//                           <td>
//                             {m.expiryDate
//                               ? String(m.expiryDate).substring(0, 10)
//                               : "-"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//               <p className="text-muted small mt-2 mb-0">
//                 Consider reordering items with very low quantity to avoid
//                 stock‑outs.
//               </p>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminReports;

// import React, { useEffect, useState } from "react";
// import api from "../services/api"; // ✅ Uses interceptor for Token

// const AdminReports = () => {
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     users: 0,
//     medicines: 0,
//     doctors: 0,
//     orders: 0,
//     revenue: 0,
//     salesData: [],
//   });
//   const [lowStock, setLowStock] = useState([]);
//   const [error, setError] = useState("");

//   const fetchReportData = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       // ✅ Fetch data using the robust endpoints (matching AdminDashboard)
//       const [statsRes, lowStockRes] = await Promise.all([
//         api.get("/admin/stats"),
//         api.get("/medicines/admin/low-stock?threshold=10"),
//       ]);

//       setStats(statsRes.data || {});
//       setLowStock(lowStockRes.data || []);
//     } catch (err) {
//       console.error("Report fetch error:", err);
//       setError(
//         err.response?.data?.message ||
//           (err.response?.status === 403
//             ? "Access Denied: Admin only"
//             : "Failed to load report data")
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//   }, []);

//   // --- Calculations ---
//   const totalSales = stats.revenue || 0;
//   const totalOrders = stats.orders || 0;
//   const avgOrderValue =
//     totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : "0.00";

//   const last3Months = (stats.salesData || []).slice(-3);
//   const lastMonth = last3Months[last3Months.length - 1];
//   const prevMonth = last3Months[last3Months.length - 2];

//   let trendText = "Not enough data";
//   if (lastMonth && prevMonth) {
//     const diff = lastMonth.sales - prevMonth.sales;
//     if (diff > 0) {
//       trendText = `Up by Rs. ${diff.toFixed(2)} compared to previous month.`;
//     } else if (diff < 0) {
//       trendText = `Down by Rs. ${Math.abs(diff).toFixed(2)} vs previous month.`;
//     } else {
//       trendText = "Same as previous month.";
//     }
//   }

//   return (
//     <div className="container-fluid p-0">
//       <div className="mb-4">
//         <h3 className="fw-bold mb-1">Reports</h3>
//         <p className="text-muted mb-0">
//           Sales, inventory and performance summaries generated from live data.
//         </p>
//       </div>

//       {error && (
//         <div className="alert alert-danger py-2" role="alert">
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="d-flex align-items-center justify-content-center py-5">
//           <div className="spinner-border text-primary me-2" role="status" />
//           <span>Loading reports...</span>
//         </div>
//       ) : (
//         <>
//           {/* Top KPI cards */}
//           <div className="row g-3 mb-4">
//             <div className="col-md-3 col-sm-6">
//               <div className="card shadow-sm border-0 h-100">
//                 <div className="card-body">
//                   <h6 className="text-muted text-uppercase mb-1 small fw-bold">
//                     Total Revenue
//                   </h6>
//                   <h4 className="fw-bold mb-0 text-primary">
//                     Rs. {Number(totalSales).toLocaleString()}
//                   </h4>
//                   <small className="text-muted">
//                     From {totalOrders} orders
//                   </small>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3 col-sm-6">
//               <div className="card shadow-sm border-0 h-100">
//                 <div className="card-body">
//                   <h6 className="text-muted text-uppercase mb-1 small fw-bold">
//                     Avg Order Value
//                   </h6>
//                   <h4 className="fw-bold mb-0">Rs. {avgOrderValue}</h4>
//                   <small className="text-muted">
//                     Revenue / number of orders
//                   </small>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3 col-sm-6">
//               <div className="card shadow-sm border-0 h-100">
//                 <div className="card-body">
//                   <h6 className="text-muted text-uppercase mb-1 small fw-bold">
//                     Total Medicines
//                   </h6>
//                   <h4 className="fw-bold mb-0">{stats.medicines}</h4>
//                   <small className="text-muted">
//                     Unique medicines in inventory
//                   </small>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3 col-sm-6">
//               <div className="card shadow-sm border-0 h-100">
//                 <div className="card-body">
//                   <h6 className="text-muted text-uppercase mb-1 small fw-bold">
//                     Registered Doctors
//                   </h6>
//                   <h4 className="fw-bold mb-0">{stats.doctors}</h4>
//                   <small className="text-muted">
//                     Linked to this pharmacy system
//                   </small>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Monthly trend card */}
//           <div className="card shadow-sm border-0 mb-4">
//             <div className="card-body">
//               <h5 className="card-title fw-bold mb-3">Monthly Revenue Trend</h5>
//               {lastMonth ? (
//                 <div className="bg-light p-3 rounded">
//                   <p className="mb-1 fs-5">
//                     Latest month: <strong>{lastMonth.month}</strong> –{" "}
//                     <span className="text-success fw-bold">
//                       Rs. {lastMonth.sales.toLocaleString()}
//                     </span>
//                   </p>
//                   <p className="text-muted mb-0 small">
//                     <span
//                       className={
//                         trendText.includes("Up")
//                           ? "text-success"
//                           : trendText.includes("Down")
//                           ? "text-danger"
//                           : "text-muted"
//                       }
//                     >
//                       {trendText}
//                     </span>
//                   </p>
//                 </div>
//               ) : (
//                 <p className="text-muted mb-0">
//                   Not enough monthly data to calculate trend.
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Low stock table */}
//           <div className="card shadow-sm border-0">
//             <div className="card-body">
//               <h5 className="card-title fw-bold mb-3">Low Stock Medicines</h5>
//               {lowStock.length === 0 ? (
//                 <div className="text-center py-4 bg-light rounded">
//                   <p className="text-success fw-medium mb-0">
//                     ✅ All medicines currently have healthy stock levels.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table table-hover align-middle mb-0">
//                     <thead className="table-light">
//                       <tr>
//                         <th>Name</th>
//                         <th>Category</th>
//                         <th>Quantity</th>
//                         <th>Expiry</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {lowStock.map((m) => (
//                         <tr key={m._id || m.id}>
//                           <td className="fw-medium">{m.name}</td>
//                           <td>{m.category || "-"}</td>
//                           <td>
//                             <span className="badge bg-danger">
//                               {m.quantity ?? m.stock ?? 0}
//                             </span>
//                           </td>
//                           <td className="small text-muted">
//                             {m.expiryDate
//                               ? new Date(m.expiryDate).toLocaleDateString()
//                               : "-"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//               <div className="mt-3">
//                 <small className="text-muted">
//                   * Consider reordering items with low quantity to avoid
//                   stock‑outs.
//                 </small>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminReports;

import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FileText,
  Download,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Package,
  Users,
} from "lucide-react";

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("30"); // Default 30 days

  // Stats State
  const [stats, setStats] = useState({
    users: 0,
    medicines: 0,
    doctors: 0,
    orders: 0,
    revenue: 0,
    salesData: [], // Format from backend: [{ _id: '2023-01-01', sales: 100 }]
  });

  const [lowStock, setLowStock] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // Colors for Charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Fetch Core Stats (existing endpoint)
      const statsRes = await api.get("/admin/stats");

      // 2. Fetch Low Stock (existing endpoint)
      const lowStockRes = await api.get(
        "/medicines/admin/low-stock?threshold=10",
      );

      // 3. Fetch Medicines for Category Analysis (for Pie Chart)
      const medicinesRes = await api.get("/medicines?all=true");
      const allMedicines = medicinesRes.data.medicines || [];

      // Process Category Data for Pie Chart
      const catMap = {};
      allMedicines.forEach((m) => {
        const cat = m.category || "Uncategorized";
        catMap[cat] = (catMap[cat] || 0) + 1;
      });
      const processedCatData = Object.keys(catMap).map((key) => ({
        name: key,
        value: catMap[key],
      }));

      setStats(statsRes.data || {});
      setLowStock(lowStockRes.data || []);
      setCategoryData(processedCatData);
    } catch (err) {
      console.error("Report fetch error:", err);
      setError("Failed to load report data. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  // --- Calculations for Trends ---
  const calculateTrend = () => {
    const data = stats.salesData || [];
    if (data.length < 2)
      return { text: "Insufficient data", color: "text-muted" };

    const last = data[data.length - 1]?.sales || 0;
    const prev = data[data.length - 2]?.sales || 0;
    const diff = last - prev;

    if (diff > 0)
      return { text: `+${diff} vs prev period`, color: "text-success" };
    if (diff < 0)
      return { text: `${diff} vs prev period`, color: "text-danger" };
    return { text: "Stable", color: "text-muted" };
  };

  const trend = calculateTrend();

  const handleDownloadCSV = () => {
    // CSV Export Logic
    const rows = [
      ["Report Type", "Admin Summary"],
      ["Generated On", new Date().toLocaleString()],
      [],
      ["Metric", "Value"],
      ["Total Revenue", stats.revenue],
      ["Total Orders", stats.orders],
      ["Total Users", stats.users],
      [],
      ["Low Stock Items"],
      ["Name", "Stock", "Category"],
      ...lowStock.map((m) => [m.name, m.countInStock, m.category]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `admin_report_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center py-5"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-primary mb-2" role="status" />
        <span className="text-muted">Analyzing system data...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0 animate-fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <FileText className="text-primary" /> System Reports
          </h3>
          <p className="text-muted small mb-0">
            Comprehensive analytics for pharmacy performance
          </p>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm rounded-pill shadow-sm"
            style={{ width: "150px" }}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last Quarter</option>
          </select>
          <button
            className="btn btn-outline-primary btn-sm rounded-pill px-3 shadow-sm d-flex align-items-center gap-2"
            onClick={handleDownloadCSV}
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2 d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* 1. KPI Cards Row */}
      <div className="row g-3 mb-4">
        {/* Revenue */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 border-start border-4 border-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="text-muted small text-uppercase fw-bold">
                  Total Revenue
                </div>
                <div className="bg-primary bg-opacity-10 p-1 rounded">
                  <DollarSign size={18} className="text-primary" />
                </div>
              </div>
              <h3 className="fw-bold mb-1 text-dark">
                Rs. {Number(stats.revenue || 0).toLocaleString()}
              </h3>
              <div
                className={`small fw-medium ${trend.color} d-flex align-items-center gap-1`}
              >
                <TrendingUp size={12} /> {trend.text}
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 border-start border-4 border-success">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="text-muted small text-uppercase fw-bold">
                  Total Orders
                </div>
                <div className="bg-success bg-opacity-10 p-1 rounded">
                  <Package size={18} className="text-success" />
                </div>
              </div>
              <h3 className="fw-bold mb-1 text-dark">{stats.orders}</h3>
              <div className="small text-muted">
                Avg Value: Rs.{" "}
                {(stats.orders > 0 ? stats.revenue / stats.orders : 0).toFixed(
                  0,
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Medicines */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 border-start border-4 border-warning">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="text-muted small text-uppercase fw-bold">
                  Medicines
                </div>
                <div className="bg-warning bg-opacity-10 p-1 rounded">
                  <FileText size={18} className="text-warning" />
                </div>
              </div>
              <h3 className="fw-bold mb-1 text-dark">{stats.medicines}</h3>
              <div className="small text-muted">
                {categoryData.length} Categories
              </div>
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 border-start border-4 border-info">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="text-muted small text-uppercase fw-bold">
                  Active Users
                </div>
                <div className="bg-info bg-opacity-10 p-1 rounded">
                  <Users size={18} className="text-info" />
                </div>
              </div>
              <h3 className="fw-bold mb-1 text-dark">{stats.users}</h3>
              <div className="small text-muted">Doctors: {stats.doctors}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="row g-4 mb-4">
        {/* Sales Trend Chart */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">Sales Performance</h5>
            </div>
            <div className="card-body px-4 pb-4">
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={
                      stats.salesData && stats.salesData.length > 0
                        ? stats.salesData
                        : [{ _id: "No Data", sales: 0 }]
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="_id"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#888", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#888", fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8f9fa" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="sales"
                      fill="#0d6efd"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                      name="Revenue (Rs)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">Inventory by Category</h5>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Low Stock Alert Table */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-danger bg-opacity-10 px-4 py-3 border-0">
          <h5 className="fw-bold text-danger mb-0 d-flex align-items-center gap-2">
            <AlertCircle size={20} /> Low Stock Alerts
          </h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-white">
              <tr>
                <th className="ps-4 py-3 text-muted small text-uppercase">
                  Medicine Name
                </th>
                <th className="py-3 text-muted small text-uppercase">
                  Category
                </th>
                <th className="py-3 text-muted small text-uppercase">
                  Stock Level
                </th>
                <th className="py-3 text-muted small text-uppercase text-end pe-4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {lowStock.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    ✅ All inventory levels are healthy.
                  </td>
                </tr>
              ) : (
                lowStock.map((item) => (
                  <tr key={item._id}>
                    <td className="ps-4 fw-medium text-dark">{item.name}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <span className="fw-bold text-danger">
                        {item.countInStock} Units
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <span className="badge bg-danger">Restock Needed</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AdminReports;
