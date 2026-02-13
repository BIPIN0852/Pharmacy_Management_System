import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  TrendingUp,
  DollarSign,
  Package,
  Download,
  Calendar,
  AlertCircle,
} from "lucide-react";

const PharmacistReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState({
    totalSales: 0,
    totalOrders: 0,
    inventoryValue: 0,
    salesData: [],
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      const [ordersRes, medicinesRes] = await Promise.all([
        api.get("/orders"),
        api.get("/medicines?all=true"),
      ]);

      const orders = Array.isArray(ordersRes.data)
        ? ordersRes.data
        : ordersRes.data.orders || [];
      const medicines = Array.isArray(medicinesRes.data)
        ? medicinesRes.data
        : medicinesRes.data.medicines || [];

      const totalSales = orders
        .filter((o) => o.isPaid)
        .reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0);

      const inventoryValue = medicines.reduce(
        (acc, curr) =>
          acc + Number(curr.price || 0) * Number(curr.countInStock || 0),
        0,
      );

      const last7Days = [...Array(7)]
        .map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split("T")[0];
        })
        .reverse();

      const salesChartData = last7Days.map((dateStr) => {
        const daySales = orders.reduce((sum, order) => {
          if (!order.isPaid || !order.createdAt) return sum;
          const orderDate = new Date(order.createdAt)
            .toISOString()
            .split("T")[0];
          if (orderDate === dateStr) {
            return sum + (Number(order.totalPrice) || 0);
          }
          return sum;
        }, 0);

        return {
          date: new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          fullDate: dateStr, // Kept for CSV export
          sales: daySales,
        };
      });

      setReportData({
        totalSales,
        totalOrders: orders.length,
        inventoryValue,
        salesData: salesChartData,
      });
    } catch (err) {
      console.error("Report Error:", err);
      setError("Failed to load report data from database.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Actual CSV Download Logic
  const handleDownload = () => {
    // 1. Prepare the CSV content
    const csvRows = [];

    // Add Summary Section
    csvRows.push(["PHARMACY SALES REPORT"]);
    csvRows.push(["Generated On", new Date().toLocaleString()]);
    csvRows.push([]); // Spacer
    csvRows.push(["SUMMARY METRICS"]);
    csvRows.push(["Metric", "Value"]);
    csvRows.push(["Total Revenue", `Rs. ${reportData.totalSales}`]);
    csvRows.push(["Total Orders", reportData.totalOrders]);
    csvRows.push(["Inventory Value", `Rs. ${reportData.inventoryValue}`]);
    csvRows.push([]); // Spacer

    // Add Detailed Data Section (Daily Sales)
    csvRows.push(["DAILY SALES DATA (Last 7 Days)"]);
    csvRows.push(["Date", "Day", "Sales Amount (Rs)"]);

    reportData.salesData.forEach((row) => {
      csvRows.push([
        row.fullDate, // YYYY-MM-DD
        row.date, // Mon, Tue, etc.
        row.sales,
      ]);
    });

    // 2. Convert array of arrays to CSV string
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");

    // 3. Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `pharmacy_report_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center py-5"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-primary me-2" />
        <span className="text-muted">Analyzing database records...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0 animate-fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <FileText className="text-primary" /> Sales & Inventory Reports
          </h3>
          <p className="text-muted small mb-0">
            Real-time financial overview from database
          </p>
        </div>
        <button
          className="btn btn-outline-primary rounded-pill px-4 shadow-sm d-flex align-items-center gap-2"
          onClick={handleDownload}
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {error && (
        <div className="alert alert-danger py-2 d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-primary text-white">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 opacity-75 small text-uppercase fw-bold">
                    Total Revenue
                  </p>
                  <h3 className="fw-bold mb-0">
                    Rs. {reportData.totalSales.toLocaleString()}
                  </h3>
                </div>
                <div className="bg-white bg-opacity-25 p-2 rounded-circle">
                  <DollarSign size={24} />
                </div>
              </div>
              <div className="mt-3 small opacity-75">
                <TrendingUp size={14} className="me-1" /> Lifetime sales
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 text-muted small text-uppercase fw-bold">
                    Orders Processed
                  </p>
                  <h3 className="fw-bold mb-0 text-dark">
                    {reportData.totalOrders}
                  </h3>
                </div>
                <div className="bg-success bg-opacity-10 p-2 rounded-circle text-success">
                  <FileText size={24} />
                </div>
              </div>
              <p className="mt-3 small text-muted mb-0">
                Transactions in database
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1 text-muted small text-uppercase fw-bold">
                    Inventory Value
                  </p>
                  <h3 className="fw-bold mb-0 text-dark">
                    Rs. {reportData.inventoryValue.toLocaleString()}
                  </h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-2 rounded-circle text-warning">
                  <Package size={24} />
                </div>
              </div>
              <p className="mt-3 small text-muted mb-0">
                Current stock asset value
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">Sales Trend (Last 7 Days)</h5>
            </div>
            <div className="card-body px-4 pb-4">
              <div style={{ width: "100%", height: "300px" }}>
                <ResponsiveContainer>
                  <BarChart data={reportData.salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6c757d", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6c757d", fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8f9fa" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value) => [`Rs. ${value}`, "Sales"]}
                    />
                    <Bar
                      dataKey="sales"
                      fill="#0d6efd"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">Report Filters</h5>
            </div>
            <div className="card-body p-4">
              <label className="form-label small fw-bold text-muted">
                Date Range
              </label>
              <select className="form-select mb-3">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>

              <label className="form-label small fw-bold text-muted">
                Category
              </label>
              <select className="form-select mb-4">
                <option>All Categories</option>
                <option>Prescription</option>
                <option>OTC</option>
              </select>

              <div className="d-grid">
                <button className="btn btn-primary rounded-pill py-2">
                  Apply Filters
                </button>
              </div>

              <hr className="my-4" />

              <div className="d-flex align-items-center gap-3 text-muted small">
                <Calendar size={16} />
                <span>Auto-generated on {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default PharmacistReports;
