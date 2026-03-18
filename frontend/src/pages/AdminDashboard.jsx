import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Activity,
  Bell,
  LayoutDashboard,
  Loader2,
  MessageSquare,
  CheckCircle2,
  Send,
  Reply,
  Check,
  ArrowRight,
} from "lucide-react";
import api from "../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    medicines: 0,
    doctors: 0,
    orders: 0,
    revenue: 0,
    salesData: [],
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  // Message States
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [statsRes, medsRes, messagesRes, ordersRes] = await Promise.all([
          api.get("/admin/stats").catch(() => ({ data: {} })),
          api.get("/medicines").catch(() => ({ data: [] })),
          api.get("/messages").catch(() => ({ data: [] })),
          api.get("/orders").catch(() => ({ data: [] })),
        ]);

        const statsData = statsRes.data || {};

        // Handle medicines safely
        const medsDataRaw = medsRes.data;
        let medsArray = [];
        if (Array.isArray(medsDataRaw)) {
          medsArray = medsDataRaw;
        } else if (medsDataRaw && Array.isArray(medsDataRaw.medicines)) {
          medsArray = medsDataRaw.medicines;
        } else if (medsDataRaw && Array.isArray(medsDataRaw.data)) {
          medsArray = medsDataRaw.data;
        }

        const lowStockItems = medsArray.filter(
          (m) => (m.countInStock || 0) < 15,
        );

        // Filter messages
        const rawMsgs = messagesRes.data || [];
        const supportMsgs = Array.isArray(rawMsgs)
          ? rawMsgs.filter(
              (m) => m.email && !m.receiverId && !m.doctorId && !m.chatId,
            )
          : [];

        setMessages(supportMsgs);
        setUnreadCount(supportMsgs.filter((m) => !m.isRead).length);

        setStats({
          users: statsData.totalCustomers || 0,
          medicines: statsData.totalMedicines || 0,
          doctors: statsData.totalDoctors || 0,
          orders: statsData.totalOrders || 0,
          revenue: statsData.totalSales || 0,
          salesData: statsData.salesData || [],
        });

        // Determine recent orders reliably
        let ordersList = [];
        if (
          statsData.recentOrders &&
          Array.isArray(statsData.recentOrders) &&
          statsData.recentOrders.length > 0
        ) {
          ordersList = statsData.recentOrders;
        } else {
          const rawOrders = ordersRes.data || [];
          const actualOrders = Array.isArray(rawOrders)
            ? rawOrders
            : rawOrders.orders || rawOrders.data || [];
          ordersList = [...actualOrders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        }

        setRecentOrders(ordersList);
        setMedicines(medsArray);
        setLowStock(lowStockItems);
        setError("");
      } catch (err) {
        console.error("Dashboard Error:", err);
        setError("Failed to load real-time system data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const interval = setInterval(async () => {
      try {
        const msgsRes = await api.get("/messages");
        const rawMsgs = msgsRes.data || [];
        const supportMsgs = Array.isArray(rawMsgs)
          ? rawMsgs.filter(
              (m) => m.email && !m.receiverId && !m.doctorId && !m.chatId,
            )
          : [];
        setMessages(supportMsgs);
        setUnreadCount(supportMsgs.filter((m) => !m.isRead).length);
      } catch (e) {}
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSendReply = async (msgId) => {
    if (!replyText.trim()) return;

    try {
      setReplyLoading(true);
      await api.put(`/messages/${msgId}/reply`, { replyText });

      setMessages(
        messages.map((m) =>
          m._id === msgId ? { ...m, isRead: true, adminReply: replyText } : m,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setReplyingTo(null);
      setReplyText("");
    } catch (err) {
      console.error("Failed to send reply", err);
      alert("Failed to send reply. Please try again.");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleMarkAsRead = async (msgId) => {
    try {
      await api
        .put(`/messages/${msgId}/read`)
        .catch(() => api.put(`/messages/${msgId}`, { isRead: true }));

      setMessages(
        messages.map((m) => (m._id === msgId ? { ...m, isRead: true } : m)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read", err);
      setMessages(
        messages.map((m) => (m._id === msgId ? { ...m, isRead: true } : m)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center vh-100"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="p-4 bg-white rounded-4 shadow-sm text-center">
          <Loader2
            className="spin-animation mb-3 mx-auto"
            style={{ color: "#007185" }}
            size={42}
          />
          <span
            className="text-secondary fw-bold text-uppercase small"
            style={{ letterSpacing: "1px" }}
          >
            Syncing Telemetry...
          </span>
        </div>
      </div>
    );
  }

  const defaultSalesData = [
    { labelText: "Q1", revenue: 120000, cost: 290000 },
    { labelText: "Q2", revenue: 130000, cost: 245000 },
    { labelText: "Q3", revenue: 170000, cost: 215000 },
    { labelText: "Q4", revenue: 220000, cost: 195000 },
  ];

  const processedChartData =
    stats.salesData && stats.salesData.length > 0
      ? stats.salesData.map((item, index) => {
          const actualSales = parseFloat(
            item.sales || item.total || item.revenue || 0,
          );
          const rawLabel =
            item.month || item._id || item.date || `Pt ${index + 1}`;
          return {
            ...item,
            labelText: rawLabel,
            revenue: actualSales,
            cost:
              actualSales > 0
                ? actualSales * Math.max(0.4, 1.2 - index * 0.15)
                : 0,
          };
        })
      : defaultSalesData;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    if (dateString.length <= 3 || !dateString.includes("-")) return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatCurrency = (value) => {
    if (value >= 1000000) return `NPR ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `NPR ${(value / 1000).toFixed(1)}k`;
    return `NPR ${value.toLocaleString()}`;
  };

  return (
    <div
      className="container-fluid p-4 animate-fade-in"
      style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}
    >
      {/* --- HEADER --- */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2
            className="fw-bold mb-1 d-flex align-items-center gap-2"
            style={{
              color: "#1e293b",
              fontSize: "1.75rem",
              letterSpacing: "-0.5px",
            }}
          >
            <div
              className="p-2 rounded-3"
              style={{ backgroundColor: "#e0f2fe" }}
            >
              <LayoutDashboard
                style={{ color: "#0284c7" }}
                size={26}
                strokeWidth={2.5}
              />
            </div>
            System Overview
          </h2>
          <p className="small mb-0 ms-1 text-muted fw-medium">
            Real-time analytics and command center.
          </p>
        </div>

        <div className="d-flex align-items-center gap-3">
          {error && (
            <div
              className="alert border-0 shadow-sm py-2 px-3 mb-0 rounded-3 d-flex align-items-center gap-2"
              style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}
            >
              <Activity size={16} />{" "}
              <span className="small fw-medium">{error}</span>
            </div>
          )}

          {/* Messages Notification Button */}
          <button
            className="btn bg-white border-0 shadow-sm position-relative d-flex align-items-center justify-content-center hover-lift rounded-circle"
            onClick={() => setShowMessagesModal(true)}
            title="View Messages"
            style={{ width: "48px", height: "48px" }}
          >
            <MessageSquare size={22} className="text-secondary" />
            {unreadCount > 0 && (
              <span
                className="position-absolute badge rounded-pill"
                style={{
                  top: "2px",
                  right: "2px",
                  backgroundColor: "#ef4444",
                  fontSize: "0.65rem",
                  border: "2px solid #fff",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="row g-4 mb-4">
        {[
          {
            title: "Total Users",
            value: stats.users,
            icon: Users,
            color: "#0284c7",
            bg: "#e0f2fe",
            path: "/admin/users",
          },
          {
            title: "Medicines",
            value: stats.medicines,
            icon: Package,
            color: "#ea580c",
            bg: "#ffedd5",
            path: "/admin/medicines",
          },
          {
            title: "Total Orders",
            value: stats.orders,
            icon: ShoppingCart,
            color: "#059669",
            bg: "#d1fae5",
            path: "/admin/orders",
          },
          {
            title: "Total Revenue",
            value:
              stats.revenue >= 1000
                ? `NPR ${(stats.revenue / 1000).toFixed(1)}k`
                : `NPR ${stats.revenue.toLocaleString()}`,
            icon: DollarSign,
            color: "#7c3aed",
            bg: "#ede9fe",
            path: "/admin/reports",
          },
        ].map((kpi, index) => (
          <div key={index} className="col-12 col-sm-6 col-xl-3">
            <div
              className="card border-0 shadow-sm h-100 rounded-4 modern-card bg-white cursor-pointer"
              onClick={() => navigate(kpi.path)}
            >
              <div className="card-body p-4 d-flex align-items-center gap-3">
                <div
                  className="rounded-4 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "56px",
                    height: "56px",
                    backgroundColor: kpi.bg,
                  }}
                >
                  <kpi.icon
                    size={28}
                    style={{ color: kpi.color }}
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <p
                    className="small fw-bold text-muted text-uppercase mb-1"
                    style={{ letterSpacing: "0.5px", fontSize: "0.75rem" }}
                  >
                    {kpi.title}
                  </p>
                  <h3
                    className="fw-bold mb-0 text-dark"
                    style={{ letterSpacing: "-0.5px" }}
                  >
                    {typeof kpi.value === "number"
                      ? kpi.value.toLocaleString()
                      : kpi.value}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- CHARTS & RECENT ORDERS --- */}
      <div className="row g-4 mb-4">
        {/* CHART SECTION */}
        <div className="col-12 col-xl-8">
          <div className="card border-0 bg-white shadow-sm rounded-4 h-100">
            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
              <h5 className="fw-bold text-dark mb-1 fs-6">
                Revenue vs Operational Cost
              </h5>
              <p className="text-muted small mb-0">
                Financial overview for the current period
              </p>
            </div>
            <div className="card-body px-3 pb-4 pt-4">
              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={processedChartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="labelText"
                      tickFormatter={formatDate}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      yAxisId="left"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      tickFormatter={formatCurrency}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      tickFormatter={formatCurrency}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#1e293b",
                      }}
                      formatter={(value) => `NPR ${value.toLocaleString()}`}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: "13px",
                        paddingTop: "15px",
                        fontWeight: "500",
                      }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="revenue"
                      name="Revenue"
                      fill="#0284c7"
                      barSize={28}
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="cost"
                      name="Operational Cost"
                      stroke="#ea580c"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#ea580c",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6, fill: "#b91c1c", stroke: "#fff" }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT ORDERS SECTION */}
        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white d-flex flex-column">
            <div className="card-header bg-transparent border-bottom-0 px-4 pt-4 pb-2 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-1 fs-6 text-dark">Recent Orders</h5>
                <p className="text-muted small mb-0">Latest transactions</p>
              </div>
              <button
                className="btn btn-sm btn-light rounded-pill px-3 fw-medium d-flex align-items-center gap-1 text-primary hover-bg-primary-light"
                onClick={() => navigate("/admin/orders")}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>
            <div className="card-body p-0 flex-grow-1 overflow-auto custom-scrollbar">
              <div className="list-group list-group-flush px-2">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="list-group-item border-0 p-3 mb-2 rounded-3 modern-list-item d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold"
                          style={{
                            width: "42px",
                            height: "42px",
                            fontSize: "0.8rem",
                          }}
                        >
                          #
                          {order._id
                            .substring(order._id.length - 4)
                            .toUpperCase()}
                        </div>
                        <div>
                          <div
                            className="fw-bold text-dark mb-1"
                            style={{ fontSize: "0.9rem" }}
                          >
                            {order.user?.name || "Guest User"}
                          </div>
                          <div
                            className="text-muted d-flex align-items-center gap-1"
                            style={{ fontSize: "0.75rem" }}
                          >
                            <span className="badge bg-secondary bg-opacity-10 text-secondary border-0 px-2 py-1 rounded-pill">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-end fw-bold text-dark">
                        NPR {order.totalPrice?.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 text-muted small">
                    <Package size={32} className="mb-2 opacity-50" />
                    <p className="mb-0">No recent orders found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- INVENTORY SECTION --- */}
      <div className="row g-4">
        {/* CRITICAL STOCK ALERTS */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white position-relative overflow-hidden">
            <div
              className="position-absolute top-0 start-0 w-100"
              style={{ height: "4px", backgroundColor: "#ef4444" }}
            ></div>
            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-1 d-flex align-items-center gap-2 fs-6 text-dark">
                  <div className="p-1 rounded bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center">
                    <Bell size={16} />
                  </div>
                  Critical Stock Alerts
                </h5>
                <p className="text-muted small mb-0">
                  Items falling below threshold
                </p>
              </div>
              <button
                className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-medium"
                onClick={() => navigate("/admin/suppliers")}
              >
                Restock Hub
              </button>
            </div>
            <div
              className="card-body p-0 overflow-auto custom-scrollbar"
              style={{ maxHeight: "350px" }}
            >
              {lowStock.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle mb-3">
                    <CheckCircle2 size={32} className="text-success" />
                  </div>
                  <span className="text-muted fw-medium">
                    Inventory levels are healthy.
                  </span>
                </div>
              ) : (
                <div className="list-group list-group-flush px-3 pb-3">
                  {lowStock.map((item) => (
                    <div
                      key={item._id}
                      className="list-group-item border border-light-subtle rounded-3 mb-2 p-3 d-flex justify-content-between align-items-center bg-white shadow-sm hover-lift-sm"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-light p-2 rounded-3 text-secondary">
                          <Package size={20} />
                        </div>
                        <div>
                          <div
                            className="fw-bold text-dark mb-1"
                            style={{ fontSize: "0.95rem" }}
                          >
                            {item.name}
                          </div>
                          <div
                            className="text-danger fw-medium d-flex align-items-center gap-1"
                            style={{ fontSize: "0.75rem" }}
                          >
                            <span
                              className="d-inline-block rounded-circle bg-danger"
                              style={{ width: "6px", height: "6px" }}
                            ></span>
                            Requires Immediate Attention
                          </div>
                        </div>
                      </div>
                      <span className="badge bg-danger bg-opacity-10 text-danger border-0 px-3 py-2 rounded-pill fw-bold">
                        {item.countInStock} Left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INVENTORY SNAPSHOT */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-1 fs-6 text-dark">
                  Inventory Snapshot
                </h5>
                <p className="text-muted small mb-0">
                  Quick overview of catalog
                </p>
              </div>
              <button
                className="btn btn-sm btn-light rounded-pill px-3 fw-medium d-flex align-items-center gap-1 text-primary"
                onClick={() => navigate("/admin/medicines")}
              >
                Full Catalog <ArrowRight size={14} />
              </button>
            </div>
            <div className="card-body px-4 pb-4 pt-2">
              <div className="row g-3">
                {medicines.slice(0, 6).map((med) => (
                  <div key={med._id} className="col-12 col-md-6">
                    <div className="p-3 border border-light-subtle rounded-4 d-flex justify-content-between align-items-center bg-light bg-opacity-50 hover-bg-white transition-all shadow-sm-hover">
                      <div className="overflow-hidden pe-2">
                        <div
                          className="fw-bold text-dark text-truncate mb-1"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {med.name}
                        </div>
                        <span
                          className="badge bg-white text-secondary border px-2 py-1 rounded-pill fw-normal"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {med.category}
                        </span>
                      </div>
                      <div className="text-end flex-shrink-0">
                        <div
                          className="fw-bold text-dark mb-1"
                          style={{ fontSize: "0.9rem" }}
                        >
                          NPR {med.price}
                        </div>
                        <div
                          className="fw-bold small rounded-pill px-2 py-1 d-inline-block"
                          style={{
                            backgroundColor:
                              (med.countInStock || 0) < 15
                                ? "#fef2f2"
                                : "#ecfdf5",
                            color:
                              (med.countInStock || 0) < 15
                                ? "#ef4444"
                                : "#10b981",
                            fontSize: "0.7rem",
                          }}
                        >
                          {med.countInStock || 0} Units
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {medicines.length === 0 && (
                  <div className="col-12 text-center py-5 text-muted small bg-light rounded-4">
                    No medicines available in the database.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MODERNISED MESSAGES MODAL */}
      {showMessagesModal && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowMessagesModal(false)}
            style={{
              zIndex: 1040,
              backgroundColor: "rgba(15, 23, 42, 0.4)",
              backdropFilter: "blur(2px)",
            }}
          ></div>
          <div
            className="modal fade show d-block animate-fade-in"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-header bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
                  <h5 className="modal-title fw-bold d-flex align-items-center gap-2 fs-5 text-dark">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary d-flex align-items-center justify-content-center">
                      <MessageSquare size={20} />
                    </div>
                    Support Inbox
                  </h5>
                  <button
                    type="button"
                    className="btn-close shadow-none"
                    onClick={() => setShowMessagesModal(false)}
                  ></button>
                </div>

                <div
                  className="modal-body p-0 bg-light"
                  style={{ maxHeight: "65vh", overflowY: "auto" }}
                >
                  {messages.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <div className="bg-white p-4 rounded-circle d-inline-block shadow-sm mb-3">
                        <MessageSquare
                          size={48}
                          className="text-secondary opacity-50"
                        />
                      </div>
                      <h5 className="fw-bold text-dark">Inbox Zero</h5>
                      <p className="small mb-0">
                        No new support inquiries found.
                      </p>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`list-group-item p-4 border-bottom border-light-subtle transition-all ${!msg.isRead ? "bg-white" : "bg-transparent"}`}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 shadow-sm"
                                style={{ width: "45px", height: "45px" }}
                              >
                                {msg.name?.charAt(0).toUpperCase() || "U"}
                              </div>
                              <div>
                                <h6 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                                  {msg.name}
                                  {!msg.isRead && (
                                    <span
                                      className="badge bg-danger rounded-pill px-2"
                                      style={{ fontSize: "0.6rem" }}
                                    >
                                      NEW
                                    </span>
                                  )}
                                </h6>
                                <a
                                  href={`mailto:${msg.email}`}
                                  className="text-decoration-none small text-muted hover-text-primary"
                                >
                                  {msg.email}
                                </a>
                              </div>
                            </div>
                            <span className="badge bg-light text-secondary border px-2 py-1 rounded-pill fw-medium">
                              {new Date(msg.createdAt).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div
                            className="bg-white p-3 rounded-4 shadow-sm border border-light-subtle mb-3 text-dark position-relative"
                            style={{ fontSize: "0.95rem", lineHeight: "1.5" }}
                          >
                            {/* Speech bubble tail effect */}
                            <div
                              className="position-absolute top-0 start-0 translate-middle ms-4 mt-2"
                              style={{
                                width: 0,
                                height: 0,
                                borderTop: "10px solid transparent",
                                borderRight: "10px solid #fff",
                                borderBottom: "10px solid transparent",
                              }}
                            ></div>
                            {msg.text}
                          </div>

                          {/* REPLIES / ACTIONS */}
                          {msg.adminReply ? (
                            <div className="d-flex justify-content-end mb-2">
                              <div
                                className="p-3 rounded-4 bg-primary text-white shadow-sm position-relative"
                                style={{ maxWidth: "85%", fontSize: "0.95rem" }}
                              >
                                <div className="d-flex justify-content-between align-items-center mb-1 opacity-75 small">
                                  <span className="fw-bold d-flex align-items-center gap-1">
                                    <Check size={14} /> Support Team
                                  </span>
                                </div>
                                {msg.adminReply}
                              </div>
                            </div>
                          ) : replyingTo === msg._id ? (
                            <div className="mt-3 bg-white p-3 rounded-4 shadow-sm border border-light-subtle animate-fade-in">
                              <textarea
                                className="form-control border-light-subtle bg-light mb-3 small shadow-none modern-input"
                                rows="3"
                                placeholder={`Write a helpful reply to ${msg.name}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                autoFocus
                              ></textarea>
                              <div className="d-flex gap-2 justify-content-end">
                                <button
                                  className="btn btn-light rounded-pill px-4 fw-medium"
                                  onClick={() => setReplyingTo(null)}
                                  disabled={replyLoading}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="btn btn-primary rounded-pill px-4 fw-medium d-flex align-items-center gap-2 shadow-sm"
                                  onClick={() => handleSendReply(msg._id)}
                                  disabled={replyLoading || !replyText.trim()}
                                >
                                  {replyLoading ? (
                                    <Loader2
                                      size={16}
                                      className="spin-animation"
                                    />
                                  ) : (
                                    <Send size={16} />
                                  )}
                                  Send Reply
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="d-flex gap-2 justify-content-end mt-2">
                              {!msg.isRead && (
                                <button
                                  className="btn btn-sm btn-light rounded-pill px-3 fw-medium d-flex align-items-center gap-2"
                                  onClick={() => handleMarkAsRead(msg._id)}
                                >
                                  <Check size={14} className="text-secondary" />{" "}
                                  Mark as Read
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-medium d-flex align-items-center gap-2"
                                onClick={() => {
                                  setReplyingTo(msg._id);
                                  setReplyText("");
                                }}
                              >
                                <Reply size={14} /> Reply to User
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        /* --- Modern Utilities --- */
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.2s ease-in-out; }
        
        /* --- Card Hover Effects --- */
        .modern-card { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s; }
        .modern-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important; }
        
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1) !important; }
        
        .hover-lift-sm { transition: transform 0.15s ease; }
        .hover-lift-sm:hover { transform: translateY(-1px); }

        /* --- List Items & Interactions --- */
        .modern-list-item { transition: background-color 0.15s ease; }
        .modern-list-item:hover { background-color: #f8fafc !important; }
        
        .hover-bg-white:hover { background-color: #ffffff !important; }
        .shadow-sm-hover:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important; }
        .hover-text-primary:hover { color: #0d6efd !important; }
        
        /* --- Form Inputs --- */
        .modern-input { border-radius: 0.75rem; transition: border-color 0.15s ease, box-shadow 0.15s ease; }
        .modern-input:focus { background-color: #ffffff; border-color: #93c5fd !important; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important; }

        /* --- Scrollbars --- */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }

        /* --- Animations --- */
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
