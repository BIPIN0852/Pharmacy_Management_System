import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Badge,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import {
  AlertTriangle,
  Package,
  Clock,
  FileText,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  Activity,
  ShoppingBag,
  BellRing,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Settings,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const PharmacistDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    pendingRx: 0,
    pendingOrders: 0,
    lowStock: 0,
    expiring: 0,
    todaysOrdersCount: 0,
  });

  const [lowStockItems, setLowStockItems] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Stats from consolidated pharmacist dashboard route
      const statsRes = await api.get("/pharmacist/dashboard");
      const dashboardStats = statsRes.data || statsRes;

      // 2. Data Fetching (Matches the Alerts Page exactly!)
      let lowStockData = [];
      let expiringData = [];

      try {
        // Try the new dedicated alerts route first
        const alertsRes = await api.get("/pharmacist/alerts");
        lowStockData = alertsRes.data.lowStockMedicines || [];
        expiringData = alertsRes.data.expiringMedicines || [];
      } catch (alertErr) {
        // Fallback to client-side math if the alerts route isn't available yet
        const medRes = await api.get("/medicines");
        const allMeds = Array.isArray(medRes.data)
          ? medRes.data
          : medRes.data.medicines || [];

        lowStockData = allMeds.filter((m) => Number(m.countInStock || 0) < 15);

        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
        ninetyDaysFromNow.setHours(23, 59, 59, 999);

        allMeds.forEach((m) => {
          let hasPushed = false;
          const isExpiringSoon = (dateStr) => {
            if (!dateStr) return false;
            const d = new Date(dateStr);
            return !isNaN(d.getTime()) && d <= ninetyDaysFromNow;
          };

          if (m.batches && m.batches.length > 0) {
            m.batches.forEach((b) => {
              if (
                isExpiringSoon(b.expiryDate || b.expireDate) &&
                Number(b.qty || 0) > 0
              ) {
                expiringData.push(b);
                hasPushed = true;
              }
            });
          }
          if (
            !hasPushed &&
            isExpiringSoon(m.expiryDate || m.expireDate) &&
            Number(m.countInStock || 0) > 0
          ) {
            expiringData.push(m);
          }
        });
      }

      // 3. Update State with Real DB Data
      setStats({
        pendingRx: dashboardStats.pendingPrescriptionsCount || 0,
        pendingOrders: dashboardStats.pendingOrdersCount || 0,
        lowStock: lowStockData.length || dashboardStats.lowStockCount || 0,
        expiring: expiringData.length || 0,
        todaysOrdersCount: dashboardStats.todaysOrdersCount || 0,
      });

      // Show top 5 lowest stock items
      setLowStockItems(
        lowStockData
          .sort((a, b) => a.countInStock - b.countInStock)
          .slice(0, 5),
      );

      // 4. Generate Real-World Actionable Notifications
      const alerts = [];
      if (dashboardStats.pendingOrdersCount > 0) {
        alerts.push({
          type: "order",
          title: "Pending Fulfillments",
          message: `You have ${dashboardStats.pendingOrdersCount} orders waiting to be processed and shipped.`,
          action: "/pharmacist/orders",
        });
      }
      if (dashboardStats.pendingPrescriptionsCount > 0) {
        alerts.push({
          type: "prescription",
          title: "Rx Verification Required",
          message: `${dashboardStats.pendingPrescriptionsCount} new digital prescriptions require pharmacist verification.`,
          action: "/pharmacist/prescriptions",
        });
      }
      if (lowStockData.length > 0) {
        alerts.push({
          type: "inventory",
          title: "Critical Inventory",
          message: `${lowStockData.length} medicines have fallen below the minimum stock threshold.`,
          action: "/pharmacist/alerts",
        });
      }
      if (expiringData.length > 0) {
        alerts.push({
          type: "expiry",
          title: "Expiry Warning",
          message: `${expiringData.length} medicine batches are expiring within the next 90 days.`,
          action: "/pharmacist/alerts",
        });
      }
      setNotifications(alerts);

      setError("");
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(
        err.response?.data?.message || "Failed to load dashboard statistics.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <Spinner animation="border" style={{ color: "#007185" }} />
      </div>
    );

  const statCards = [
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      subtext: `${stats.todaysOrdersCount} new orders today`,
      icon: ShoppingBag,
      borderColor: "#007185", // Teal
      bgLight: "#e6f1f3",
      link: "/pharmacist/orders",
    },
    {
      label: "Rx Verification",
      value: stats.pendingRx,
      subtext: "Awaiting approval",
      icon: FileText,
      borderColor: "#0ea5e9", // Sky Blue
      bgLight: "#e0f2fe",
      link: "/pharmacist/prescriptions",
    },
    {
      label: "Low Stock Items",
      value: stats.lowStock,
      subtext: "Below 15 units",
      icon: Package,
      borderColor: "#F3A847", // Orange
      bgLight: "#fef6eb",
      link: "/pharmacist/alerts",
    },
    {
      label: "Expiring Soon",
      value: stats.expiring,
      subtext: "Within next 90 days",
      icon: Calendar,
      borderColor: "#B12704", // Red
      bgLight: "#fce9e5",
      link: "/pharmacist/alerts",
    },
  ];

  return (
    <div
      className="animate-fade-in p-2 p-md-3 p-lg-4"
      style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
    >
      {/* --- REAL-WORLD NOTIFICATION BANNER --- */}
      {notifications.length > 0 && (
        <div
          className="alert border-0 shadow-sm rounded-4 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between p-3 p-md-4 mb-4 animate-slide-down gap-3 bg-white"
          style={{ borderLeft: "5px solid #F3A847" }}
        >
          <div className="d-flex align-items-center gap-3 w-100">
            <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-2 p-md-3 shadow-sm flex-shrink-0">
              <BellRing size={24} className="ring-animation d-md-none" />
              <BellRing
                size={28}
                className="ring-animation d-none d-md-block"
              />
            </div>
            <div>
              <h5 className="fw-black mb-1 text-dark fs-6 fs-md-5">
                Action Required: {notifications.length} System Alerts
              </h5>
              <p className="mb-0 fw-medium text-muted small lh-sm">
                Please clear pending verification queues and review low
                stock/expiring items to maintain operational compliance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- Header Section --- */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4 pb-3 border-bottom border-light-subtle">
        <div>
          <h3
            className="fw-black mb-1 fs-4 fs-md-3"
            style={{ color: "#0F1111" }}
          >
            Pharmacist Command Center
          </h3>
          <p className="small mb-0 text-muted fw-medium lh-sm">
            Real-time telemetry of store operations, dispensing queues, and
            inventory metrics.
          </p>
        </div>
        <Button
          variant="light"
          className="rounded-pill px-3 px-md-4 py-2 border shadow-sm d-flex align-items-center justify-content-center gap-2 bg-white hover-lift w-100 w-sm-auto flex-shrink-0"
          onClick={fetchDashboardData}
          style={{
            borderColor: "#D5D9D9",
            color: "#0F1111",
            fontWeight: "600",
          }}
        >
          <RefreshCw size={16} className="text-primary" />
          <span>Refresh Data</span>
        </Button>
      </div>

      {error && (
        <Alert
          variant="danger"
          className="border-0 shadow-sm mb-4 rounded-3"
          style={{ backgroundColor: "#fef0f0", color: "#B12704" }}
        >
          <AlertTriangle size={18} className="me-2 mb-1" /> {error}
        </Alert>
      )}

      {/* --- Quick Stats Section --- */}
      <Row className="g-3 g-md-4 mb-4">
        {statCards.map((item, idx) => (
          <Col xs={12} sm={6} lg={3} key={idx}>
            <Card
              className="border-0 shadow-sm h-100 rounded-4 cursor-pointer hover-lift overflow-hidden"
              onClick={() => navigate(item.link)}
            >
              <div
                style={{ height: "4px", backgroundColor: item.borderColor }}
              ></div>
              <Card.Body className="p-3 p-md-4 d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div
                    className="p-2 rounded-3 flex-shrink-0"
                    style={{ backgroundColor: item.bgLight }}
                  >
                    <item.icon
                      size={20}
                      className="d-md-none"
                      style={{ color: item.borderColor }}
                    />
                    <item.icon
                      size={24}
                      className="d-none d-md-block"
                      style={{ color: item.borderColor }}
                    />
                  </div>
                  <h2
                    className="fw-black mb-0 fs-2 fs-md-1"
                    style={{ color: "#0F1111" }}
                  >
                    {item.value}
                  </h2>
                </div>
                <div>
                  <p
                    className="fw-bold mb-0 text-uppercase tracking-wider text-dark text-truncate"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {item.label}
                  </p>
                  <small
                    className="text-muted fw-medium d-block text-truncate"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {item.subtext}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3 g-md-4">
        {/* --- MAIN LEFT COLUMN --- */}
        <Col lg={8} className="d-flex flex-column gap-3 gap-md-4">
          {/* Live Activity Chart (CSS Based) */}
          <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            <Card.Header className="bg-white py-3 py-md-4 px-3 px-md-4 border-bottom border-light-subtle d-flex justify-content-between align-items-center">
              <span className="fw-bold fs-6 fs-md-5 text-dark d-flex align-items-center gap-2">
                <TrendingUp size={20} className="text-primary" /> Live
                Fulfillment Activity
              </span>
              <Badge bg="success" className="rounded-pill px-2 px-md-3">
                Real-Time
              </Badge>
            </Card.Header>
            <Card.Body className="p-3 p-md-4 bg-light">
              <div className="d-flex align-items-end justify-content-between pt-4 pb-2 px-1 px-md-2 chart-container">
                {/* CSS Bar Chart Simulation */}
                {[40, 65, 30, 80, 55, 90, 70].map((height, i) => (
                  <div
                    key={i}
                    className="d-flex flex-column align-items-center justify-content-end gap-1 gap-md-2"
                    style={{ width: "12%", height: "100%" }}
                  >
                    <div
                      className="rounded-top w-100 shadow-sm"
                      style={{
                        height: `${height}%`,
                        backgroundColor: i === 6 ? "#007185" : "#cbd5e1",
                        transition: "height 1s ease-out",
                      }}
                    ></div>
                    <small
                      className="text-muted fw-bold mt-auto"
                      style={{ fontSize: "0.65rem" }}
                    >
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"][i]}
                    </small>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Low Stock Table Preview */}
          <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            <Card.Header className="bg-white py-3 px-3 px-md-4 d-flex justify-content-between align-items-center border-bottom border-light-subtle flex-wrap gap-2">
              <span className="fw-bold text-dark fs-6 fs-md-5 d-flex align-items-center gap-2">
                <Activity size={20} className="text-danger" /> Critical
                Inventory Alerts
              </span>
              <Badge
                bg="danger"
                className="rounded-pill px-2 px-md-3 py-1 py-md-2"
              >
                Action Required
              </Badge>
            </Card.Header>
            <div className="table-responsive">
              <Table className="mb-0 align-middle border-0 custom-saas-table">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-3 ps-md-4 py-3 small text-muted text-uppercase fw-bold border-0 tracking-wider">
                      Medicine
                    </th>
                    <th className="py-3 text-center small text-muted text-uppercase fw-bold border-0 tracking-wider">
                      Current Stock
                    </th>
                    <th className="py-3 pe-3 pe-md-4 text-end small text-muted text-uppercase fw-bold border-0 tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 py-md-5">
                        <ShieldCheck
                          size={40}
                          className="text-success mb-2 mb-md-3 opacity-50"
                        />
                        <h6 className="fw-bold text-dark">Inventory Optimal</h6>
                        <div className="text-muted small">
                          All stock levels are above critical thresholds.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    lowStockItems.map((m) => (
                      <tr
                        key={m._id}
                        className="hover-bg-light border-bottom border-light-subtle transition-all"
                      >
                        <td className="ps-3 ps-md-4 py-3">
                          <div className="fw-bold text-dark mb-1 fs-6 fs-md-6">
                            {m.name}
                          </div>
                          <div className="text-muted small d-flex align-items-center gap-1">
                            <Package size={12} /> {m.category || "Generic"}
                          </div>
                        </td>
                        <td className="text-center py-3">
                          <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-2 px-md-3 py-1 py-md-2 rounded-pill fw-bold">
                            {m.countInStock}{" "}
                            <span className="d-none d-sm-inline">
                              {m.baseUnit || "Units"}
                            </span>
                          </span>
                        </td>
                        <td className="text-end pe-3 pe-md-4 py-3">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="rounded-pill px-2 px-md-3 fw-bold shadow-sm hover-lift d-inline-flex align-items-center"
                            onClick={() => navigate("/pharmacist/alerts")}
                          >
                            <span className="d-none d-sm-inline">Review</span>{" "}
                            <ChevronRight size={16} className="ms-sm-1" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
            <Card.Footer className="bg-white border-top py-3 text-center">
              <Button
                variant="link"
                className="text-decoration-none fw-bold p-0 text-primary hover-lift d-flex align-items-center justify-content-center gap-1 mx-auto"
                onClick={() => navigate("/pharmacist/inventory")}
              >
                View Full Inventory Report <ArrowRight size={16} />
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        {/* --- RIGHT COLUMN: Action Center & Live Alerts --- */}
        <Col lg={4}>
          <Card
            className="border-0 shadow-lg rounded-4 overflow-hidden mb-3 mb-md-4 bg-dark text-white"
            style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}
          >
            <Card.Header className="bg-transparent py-3 py-md-4 px-3 px-md-4 border-bottom border-light border-opacity-10">
              <span className="fw-bold fs-5 d-flex align-items-center gap-2">
                <Settings size={20} className="text-info" /> Clinic Operations
              </span>
            </Card.Header>
            <Card.Body className="p-3 p-md-4 d-flex flex-column gap-3">
              <button
                className="btn btn-outline-light rounded-pill py-2 px-3 text-start fw-bold d-flex align-items-center gap-3 border-opacity-25 hover-lift"
                onClick={() => navigate("/pharmacist/orders")}
              >
                <div className="bg-white bg-opacity-10 p-2 rounded-circle flex-shrink-0">
                  <ShoppingBag size={18} className="text-warning" />
                </div>
                <span className="text-truncate">Fulfill E-commerce Orders</span>
              </button>

              <button
                className="btn btn-outline-light rounded-pill py-2 px-3 text-start fw-bold d-flex align-items-center gap-3 border-opacity-25 hover-lift"
                onClick={() => navigate("/pharmacist/prescriptions")}
              >
                <div className="bg-white bg-opacity-10 p-2 rounded-circle flex-shrink-0">
                  <FileText size={18} className="text-success" />
                </div>
                <span className="text-truncate">
                  Verify Digital Prescriptions
                </span>
              </button>
            </Card.Body>
          </Card>

          {/* Active Alerts List */}
          <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            <Card.Header className="bg-white py-3 px-3 px-md-4 border-bottom border-light-subtle">
              <span className="fw-bold text-dark fs-6 d-flex align-items-center gap-2">
                <BellRing size={16} className="text-warning" /> Live Alerts
              </span>
            </Card.Header>
            <div className="p-0">
              <ul className="list-group list-group-flush">
                {notifications.length === 0 ? (
                  <li className="list-group-item p-4 text-center text-muted border-0">
                    <ShieldCheck
                      size={32}
                      className="mb-2 opacity-50 text-success"
                    />
                    <p className="small mb-0">
                      No active alerts. System is nominal.
                    </p>
                  </li>
                ) : (
                  notifications.map((alert, idx) => (
                    <li
                      key={idx}
                      className="list-group-item p-3 px-md-4 hover-bg-light cursor-pointer transition-all"
                      onClick={() => navigate(alert.action)}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className={`mt-1 flex-shrink-0 ${
                            alert.type === "inventory" ||
                            alert.type === "expiry"
                              ? "text-danger"
                              : alert.type === "prescription"
                                ? "text-info"
                                : "text-primary"
                          }`}
                        >
                          {alert.type === "inventory" ? (
                            <TrendingDown size={18} />
                          ) : alert.type === "expiry" ? (
                            <Calendar size={18} />
                          ) : alert.type === "prescription" ? (
                            <FileText size={18} />
                          ) : (
                            <Package size={18} />
                          )}
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark mb-1 fs-6">
                            {alert.title}
                          </h6>
                          <p className="small text-muted mb-0 lh-sm">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </Card>
        </Col>
      </Row>

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .tracking-wider { letter-spacing: 0.05em; }
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
        .hover-bg-light:hover { background-color: #f8fafc; }
        .transition-all { transition: all 0.2s ease; }
        .ring-animation { animation: ring 2s ease infinite; transform-origin: top center; }
        .animate-slide-down { animation: slideDown 0.4s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }

        /* Mobile Specific Utility */
        .w-sm-auto { width: auto !important; }
        @media (max-width: 575.98px) {
          .w-sm-auto { width: 100% !important; }
        }

        /* Responsive Chart Height */
        .chart-container { height: 180px; }
        @media (max-width: 768px) {
          .chart-container { height: 140px; }
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ring {
          0% { transform: rotate(0); }
          5% { transform: rotate(15deg); }
          10% { transform: rotate(-10deg); }
          15% { transform: rotate(15deg); }
          20% { transform: rotate(-10deg); }
          25% { transform: rotate(0); }
          100% { transform: rotate(0); }
        }
      `}</style>
    </div>
  );
};

export default PharmacistDashboard;
