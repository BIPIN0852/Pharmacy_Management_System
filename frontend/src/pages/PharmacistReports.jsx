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
  Filter,
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

  //  Actual CSV Download Logic
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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center py-5"
        style={{ minHeight: "60vh", backgroundColor: "#f0f2f2" }}
      >
        <div className="spinner-border" style={{ color: "#007185" }} />
        <span className="text-muted ms-3 small">
          Aggregating database records...
        </span>
      </div>
    );
  }

  return (
    <div
      className="container-fluid p-3 p-md-4 animate-fade-in"
      style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary-subtle flex-wrap gap-3">
        <div>
          <h2
            className="fw-bold mb-1 d-flex align-items-center gap-2"
            style={{ color: "#0F1111", fontSize: "1.5rem" }}
          >
            <FileText style={{ color: "#007185" }} size={24} /> Analytics &
            Reports
          </h2>
          <p className="small mb-0" style={{ color: "#565959" }}>
            Real-time financial telemetry and sales trends.
          </p>
        </div>
        <button
          className="btn btn-warning shadow-sm d-flex align-items-center gap-2 py-2 px-4 border-0 fw-medium"
          style={{
            backgroundColor: "#FFD814",
            borderRadius: "4px",
            color: "#0F1111",
          }}
          onClick={handleDownload}
        >
          <Download size={16} /> Export CSV Data
        </button>
      </div>

      {error && (
        <div
          className="alert border-0 shadow-sm mb-4 rounded-1 d-flex align-items-center gap-2"
          style={{
            backgroundColor: "#fef0f0",
            color: "#B12704",
            borderLeft: "4px solid #B12704",
          }}
        >
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="row g-4 mb-4">
        {/* Revenue Card  */}
        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm h-100 rounded-1 text-white aws-card"
            style={{
              backgroundColor: "#064E3B",
              borderTop: "4px solid #34D399",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p
                    className="mb-1 text-white-50 small text-uppercase fw-bold"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Total Revenue
                  </p>
                  <h3 className="fw-bold mb-0">
                    NPR {reportData.totalSales.toLocaleString()}
                  </h3>
                </div>
                <div className="p-2" style={{ color: "#34D399" }}>
                  <DollarSign size={28} />
                </div>
              </div>
              <div className="mt-4 small text-white-50 d-flex align-items-center">
                <TrendingUp size={14} className="me-2" /> Lifetime validated
                sales
              </div>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="col-md-4">
          <div
            className="card shadow-sm h-100 rounded-1 bg-white aws-card border"
            style={{ borderColor: "#D5D9D9", borderTop: "4px solid #007185" }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p
                    className="mb-1 small text-uppercase fw-bold"
                    style={{ color: "#565959", letterSpacing: "0.5px" }}
                  >
                    Orders Processed
                  </p>
                  <h3 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
                    {reportData.totalOrders.toLocaleString()}
                  </h3>
                </div>
                <div className="p-2" style={{ color: "#007185" }}>
                  <FileText size={28} />
                </div>
              </div>
              <p className="mt-4 small mb-0" style={{ color: "#565959" }}>
                Total transactions in database
              </p>
            </div>
          </div>
        </div>

        {/* Inventory Card */}
        <div className="col-md-4">
          <div
            className="card shadow-sm h-100 rounded-1 bg-white aws-card border"
            style={{ borderColor: "#D5D9D9", borderTop: "4px solid #F3A847" }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p
                    className="mb-1 small text-uppercase fw-bold"
                    style={{ color: "#565959", letterSpacing: "0.5px" }}
                  >
                    Inventory Value
                  </p>
                  <h3 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
                    NPR {reportData.inventoryValue.toLocaleString()}
                  </h3>
                </div>
                <div className="p-2" style={{ color: "#F3A847" }}>
                  <Package size={28} />
                </div>
              </div>
              <p className="mt-4 small mb-0" style={{ color: "#565959" }}>
                Total estimated stock asset value
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4">
        {/* Chart */}
        <div className="col-lg-8">
          <div
            className="card shadow-sm rounded-1 h-100 bg-white border"
            style={{ borderColor: "#D5D9D9" }}
          >
            <div className="card-header bg-white border-bottom pt-3 px-4 pb-3">
              <h6 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
                Sales Trend (Last 7 Days)
              </h6>
            </div>
            <div className="card-body px-4 pb-4 pt-4">
              <div style={{ width: "100%", height: "300px" }}>
                <ResponsiveContainer>
                  <BarChart
                    data={reportData.salesData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={{ stroke: "#D5D9D9" }}
                      tickLine={false}
                      tick={{ fill: "#565959", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#565959", fontSize: 12 }}
                      tickFormatter={(value) => `NPR ${value}`}
                    />
                    <Tooltip
                      cursor={{ fill: "#f0f2f2" }}
                      contentStyle={{
                        borderRadius: "4px",
                        border: "1px solid #D5D9D9",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        fontSize: "13px",
                        color: "#0F1111",
                      }}
                      formatter={(value) => [
                        `NPR ${value.toLocaleString()}`,
                        "Revenue",
                      ]}
                    />
                    <Bar
                      dataKey="sales"
                      fill="#007185" // Amazon Teal for bars
                      radius={[2, 2, 0, 0]}
                      barSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Box */}
        <div className="col-lg-4">
          <div
            className="card shadow-sm rounded-1 h-100 bg-white border"
            style={{ borderColor: "#D5D9D9" }}
          >
            <div className="card-header bg-white border-bottom pt-3 px-4 pb-3 d-flex align-items-center gap-2">
              <Filter size={16} style={{ color: "#565959" }} />
              <h6 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
                Report Parameters
              </h6>
            </div>
            <div className="card-body p-4 d-flex flex-column">
              <div className="mb-4">
                <label
                  className="form-label small fw-bold mb-1"
                  style={{ color: "#0F1111" }}
                >
                  Date Range
                </label>
                <select className="form-select shadow-none border-secondary-subtle py-2">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Year to Date</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="form-label small fw-bold mb-1"
                  style={{ color: "#0F1111" }}
                >
                  Item Category
                </label>
                <select className="form-select shadow-none border-secondary-subtle py-2">
                  <option>All Categories</option>
                  <option>Prescription</option>
                  <option>Over-The-Counter (OTC)</option>
                  <option>Surgicals</option>
                </select>
              </div>

              <div className="d-grid mt-2">
                <button
                  className="btn py-2 shadow-sm border-0 fw-medium"
                  style={{
                    backgroundColor: "#F3A847",
                    color: "#0F1111",
                    borderRadius: "4px",
                  }}
                >
                  Apply Filter
                </button>
              </div>

              <div className="mt-auto pt-4 border-top border-secondary-subtle">
                <div
                  className="d-flex align-items-center gap-2 small"
                  style={{ color: "#565959" }}
                >
                  <Calendar size={14} />
                  <span>
                    Report generated on:{" "}
                    <span className="fw-medium text-dark">
                      {new Date().toLocaleDateString()}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .aws-card { transition: transform 0.2s, box-shadow 0.2s; }
        .aws-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
};

export default PharmacistReports;
