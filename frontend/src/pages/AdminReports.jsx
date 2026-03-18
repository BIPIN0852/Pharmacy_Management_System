import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADDED React Router Navigation
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
  TrendingDown,
  Minus,
  AlertCircle,
  Package,
  Users,
  Loader2,
  ShoppingCart,
  Plus,
  BarChart2,
} from "lucide-react";

const AdminReports = () => {
  const navigate = useNavigate(); // ✅ INITIALIZED Navigation Hook

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
    salesData: [],
  });

  const [lowStock, setLowStock] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // Vibrant Palette for Pie Chart
  const COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#F9A826",
    "#9B59B6",
    "#FF8C94",
  ];

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError("");

      const statsRes = await api.get(`/admin/stats?range=${dateRange}`);
      const lowStockRes = await api.get(
        "/medicines/admin/low-stock?threshold=10",
      );
      const medicinesRes = await api.get("/medicines?all=true");

      const allMedicines = Array.isArray(medicinesRes.data)
        ? medicinesRes.data
        : medicinesRes.data.medicines || [];

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

      setStats(
        statsRes.data || {
          users: 0,
          medicines: 0,
          orders: 0,
          revenue: 0,
          salesData: [],
        },
      );

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
    if (data.length < 2) return { text: "No trend data", icon: Minus };

    const last = Number(data[data.length - 1]?.sales || 0);
    const prev = Number(data[data.length - 2]?.sales || 0);
    const diff = last - prev;

    if (diff > 0) return { text: `+${diff} vs prev`, icon: TrendingUp };
    if (diff < 0) return { text: `${diff} vs prev`, icon: TrendingDown };
    return { text: "Stable", icon: Minus };
  };

  const trend = calculateTrend();
  const TrendIcon = trend.icon;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleDownloadCSV = () => {
    const rows = [
      ["Report Type", "Admin Summary"],
      ["Date Range", `Last ${dateRange} Days`],
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

  // ✅ UPDATED: Now navigates to the supplier page and passes the medicine data!
  const handleOrderStock = (itemId, itemName) => {
    // Change '/admin/suppliers' to whatever route your supplier page is actually on
    navigate("/admin/suppliers", {
      state: {
        restockItemId: itemId,
        restockItemName: itemName,
      },
    });
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <Loader2 className="spin-animation text-primary mb-3" size={50} />
        <span className="fw-bolder text-secondary tracking-wider text-uppercase">
          Generating Vibrant Analytics...
        </span>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
      {/* --- HEADER --- */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary text-white p-3 rounded-3 shadow-sm">
            <BarChart2 size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="fw-bolder mb-1 text-dark tracking-tight">
              Performance Analytics
            </h3>
            <p className="text-muted fw-medium mb-0">
              Interactive dashboard & system reports for the{" "}
              <strong className="text-primary">Last {dateRange} Days</strong>
            </p>
          </div>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <select
            className="form-select border-2 border-primary border-opacity-25 rounded-pill shadow-sm cursor-pointer fw-semibold text-dark"
            style={{ width: "160px", backgroundColor: "#f8faff" }}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last Quarter</option>
          </select>
          <button
            className="btn btn-dark rounded-pill px-4 shadow-lg d-flex align-items-center gap-2 fw-bold hover-lift transition-all"
            onClick={handleDownloadCSV}
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* --- 1. VIBRANT KPI CARDS --- */}
      <div className="row g-4 mb-5">
        {/* Revenue Card (Purple/Blue) */}
        <div className="col-sm-6 col-xl-3">
          <div className="card gradient-card-1 border-0 shadow-lg rounded-4 h-100 hover-lift text-white overflow-hidden position-relative">
            <div className="card-body p-4 position-relative z-1">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="glass-icon-box">
                  <DollarSign size={24} />
                </div>
                <div className="glass-badge small fw-bold d-flex align-items-center gap-1">
                  <TrendIcon size={14} /> {trend.text}
                </div>
              </div>
              <div className="small text-uppercase fw-bolder tracking-wider mb-1 opacity-75">
                Total Revenue
              </div>
              <h2 className="fw-bolder mb-0 display-6">
                Rs. {Number(stats.revenue || 0).toLocaleString()}
              </h2>
            </div>
            <div className="card-decorator-circle"></div>
          </div>
        </div>

        {/* Orders Card (Emerald/Teal) */}
        <div className="col-sm-6 col-xl-3">
          <div className="card gradient-card-2 border-0 shadow-lg rounded-4 h-100 hover-lift text-white overflow-hidden position-relative">
            <div className="card-body p-4 position-relative z-1">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="glass-icon-box">
                  <ShoppingCart size={24} />
                </div>
              </div>
              <div className="small text-uppercase fw-bolder tracking-wider mb-1 opacity-75">
                Total Orders
              </div>
              <h2 className="fw-bolder mb-0 display-6">{stats.orders}</h2>
              <div className="mt-2 fw-medium opacity-75 small">
                Avg Value: Rs.{" "}
                {(stats.orders > 0 ? stats.revenue / stats.orders : 0).toFixed(
                  0,
                )}
              </div>
            </div>
            <div className="card-decorator-circle"></div>
          </div>
        </div>

        {/* Medicines Card (Orange/Pink) */}
        <div className="col-sm-6 col-xl-3">
          <div className="card gradient-card-3 border-0 shadow-lg rounded-4 h-100 hover-lift text-white overflow-hidden position-relative">
            <div className="card-body p-4 position-relative z-1">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="glass-icon-box">
                  <Package size={24} />
                </div>
              </div>
              <div className="small text-uppercase fw-bolder tracking-wider mb-1 opacity-75">
                Medicine Catalog
              </div>
              <h2 className="fw-bolder mb-0 display-6">{stats.medicines}</h2>
              <div className="mt-2 fw-medium opacity-75 small">
                Across {categoryData.length} distinct categories
              </div>
            </div>
            <div className="card-decorator-circle"></div>
          </div>
        </div>

        {/* Users Card (Blue/Cyan) */}
        <div className="col-sm-6 col-xl-3">
          <div className="card gradient-card-4 border-0 shadow-lg rounded-4 h-100 hover-lift text-white overflow-hidden position-relative">
            <div className="card-body p-4 position-relative z-1">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="glass-icon-box">
                  <Users size={24} />
                </div>
              </div>
              <div className="small text-uppercase fw-bolder tracking-wider mb-1 opacity-75">
                Active Users
              </div>
              <h2 className="fw-bolder mb-0 display-6">{stats.users}</h2>
              <div className="mt-2 fw-medium opacity-75 small">
                Including {stats.doctors} Registered Doctors
              </div>
            </div>
            <div className="card-decorator-circle"></div>
          </div>
        </div>
      </div>

      {/* --- 2. CHARTS SECTION --- */}
      <div className="row g-4 mb-5">
        {/* Sales Trend Chart */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div className="card-header bg-white border-bottom pt-4 px-4 pb-3">
              <h5 className="fw-bolder text-dark mb-0 d-flex align-items-center gap-2">
                <TrendingUp className="text-primary" /> Sales Performance
                Timeline
              </h5>
            </div>
            <div className="card-body px-4 pb-4 pt-4">
              <div style={{ width: "100%", height: 340 }}>
                {stats.salesData && stats.salesData.length > 0 ? (
                  <ResponsiveContainer>
                    <BarChart
                      data={stats.salesData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      {/* Beautiful Gradient for Bars */}
                      <defs>
                        <linearGradient
                          id="barGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#8b5cf6"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="4 4"
                        vertical={false}
                        stroke="#e2e8f0"
                      />
                      <XAxis
                        dataKey="_id"
                        tickFormatter={formatDate}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#64748b",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#64748b",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                          fontWeight: "bold",
                          color: "#1e293b",
                        }}
                        labelFormatter={formatDate}
                      />
                      <Bar
                        dataKey="sales"
                        fill="url(#barGradient)"
                        radius={[6, 6, 0, 0]}
                        barSize={32}
                        name="Revenue (NPR)"
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                    <TrendingUp size={48} className="opacity-25 mb-2" />
                    <span className="fw-bold">
                      No sales data available for this period.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div className="card-header bg-white border-bottom pt-4 px-4 pb-3">
              <h5 className="fw-bolder text-dark mb-0 d-flex align-items-center gap-2">
                <Package className="text-warning" /> Inventory Distribution
              </h5>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center pt-4">
              <div style={{ width: "100%", height: 340 }}>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={4}
                        dataKey="value"
                        animationDuration={1500}
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                          fontWeight: "bold",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={40}
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#475569",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                    <Package size={48} className="opacity-25 mb-2" />
                    <span className="fw-bold">
                      No inventory categories found.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. BOLD LOW STOCK TABLE --- */}
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden bg-white mb-4">
        {/* Bold Table Header */}
        <div
          className="card-header border-0 px-4 py-4 d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "#0f172a" }}
        >
          <div>
            <h5 className="fw-bolder text-white mb-1 d-flex align-items-center gap-2">
              <AlertCircle size={22} className="text-danger" /> Critical Stock
              Alerts
            </h5>
            <span className="text-light opacity-75 small">
              Medicines requiring immediate supplier reorders
            </span>
          </div>
          <span className="badge bg-danger text-white rounded-pill px-3 py-2 fs-6 shadow">
            {lowStock.length} Alerts
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-4 py-3 text-secondary tracking-wider small text-uppercase fw-bold border-0">
                  Medicine Name
                </th>
                <th className="py-3 text-secondary tracking-wider small text-uppercase fw-bold border-0">
                  Category
                </th>
                <th className="py-3 text-secondary tracking-wider small text-uppercase fw-bold border-0">
                  Stock Remaining
                </th>
                <th className="py-3 text-secondary tracking-wider small text-uppercase fw-bold border-0">
                  Status
                </th>
                <th className="py-3 pe-4 text-end text-secondary tracking-wider small text-uppercase fw-bold border-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {lowStock.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-block mb-3">
                      <Package size={40} className="text-success" />
                    </div>
                    <h5 className="fw-bold text-dark mb-0">
                      All inventory levels are healthy!
                    </h5>
                    <p className="text-muted small">
                      No items fall below the threshold.
                    </p>
                  </td>
                </tr>
              ) : (
                lowStock.map((item) => (
                  <tr
                    key={item._id}
                    className="transition-all table-row-hover border-bottom"
                  >
                    <td className="ps-4 py-4 fw-bolder text-dark fs-6">
                      {item.name}
                    </td>
                    <td>
                      <span className="badge bg-dark bg-opacity-10 text-dark border px-3 py-1 rounded-pill">
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="fw-black text-danger display-6 mb-0"
                          style={{ fontSize: "1.5rem" }}
                        >
                          {item.countInStock}
                        </span>
                        <span className="text-muted small fw-bold text-uppercase tracking-wider">
                          Units
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger text-white px-3 py-2 rounded-pill shadow-sm d-inline-flex align-items-center gap-1">
                        <AlertCircle size={12} /> Restock Required
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      {/* ✅ NOW USES ROUTER NAVIGATION */}
                      <button
                        type="button"
                        className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm hover-lift transition-all d-inline-flex align-items-center gap-2"
                        onClick={() => handleOrderStock(item._id, item.name)}
                      >
                        <Plus size={16} strokeWidth={3} /> Order Stock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- CUSTOM CSS FOR VIBRANT UI --- */}
      <style>{`
        .bg-light { background-color: #f4f7fe !important; } 
        
        /* Vibrant Gradient Cards */
        .gradient-card-1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .gradient-card-2 { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
        .gradient-card-3 { background: linear-gradient(135deg, #FF8008 0%, #FFC837 100%); }
        .gradient-card-4 { background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%); }

        /* Glassmorphism elements inside cards */
        .glass-icon-box {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.3);
        }
        .glass-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 4px 12px;
          border-radius: 50px;
        }

        /* Decorative Background Circles on Cards */
        .card-decorator-circle {
          position: absolute;
          width: 150px;
          height: 150px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          top: -30px;
          right: -30px;
          z-index: 0;
        }

        /* Table Row Hover */
        .table-row-hover:hover { background-color: #f8faff !important; }

        /* Typography */
        .tracking-wider { letter-spacing: 0.05em; }
        .tracking-tight { letter-spacing: -0.025em; }
        .fw-black { font-weight: 900; }

        /* Animations */
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .transition-all { transition: all 0.3s ease; }
        .hover-lift { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease; }
        .hover-lift:hover { 
          transform: translateY(-5px); 
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15) !important; 
        }
        .hover-lift:active { transform: translateY(0); }
      `}</style>
    </div>
  );
};

export default AdminReports;
