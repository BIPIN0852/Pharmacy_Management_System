import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Dropdown, Badge } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import GlobalSearch from "../components/GlobalSearch";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  Bell,
  UserCircle,
  Menu,
  LogOut,
  Package,
  MessageSquare,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

// Import Admin Sub-Pages
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
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  //  Extract theme variables
  const { isDarkMode, toggleTheme } = useTheme();

  // Language State
  const [isNepali, setIsNepali] = useState(false);

  // --- Notification States ---
  const [sysAlerts, setSysAlerts] = useState([]);
  const [msgAlerts, setMsgAlerts] = useState([]);

  // Global Language Toggle Function
  const toggleLanguage = () => {
    const newLang = isNepali ? "en" : "ne"; // Switch between English and Nepali
    const select = document.querySelector(".goog-te-combo");

    if (select) {
      select.value = newLang;
      select.dispatchEvent(new Event("change"));
      setIsNepali(!isNepali);
    } else {
      console.warn("Google Translate script not loaded yet.");
    }
  };

  // --- Fetch Admin Notifications ---
  const fetchNotifications = async () => {
    try {
      const [msgRes, orderRes] = await Promise.all([
        api.get("/messages").catch(() => ({ data: [] })),
        api.get("/orders").catch(() => ({ data: [] })),
      ]);

      const messages = Array.isArray(msgRes.data)
        ? msgRes.data
        : msgRes.data?.messages || [];
      const orders = Array.isArray(orderRes.data)
        ? orderRes.data
        : orderRes.data?.orders || [];

      // 1. MESSAGE ALERTS (Support Tickets)
      const pendingTickets = messages.filter(
        (m) => !m.appointment && !m.adminReply,
      );
      const generatedMsgAlerts = pendingTickets.map((t) => ({
        id: `ticket-${t._id}`,
        title: "Support Ticket",
        message: `${t.name || "A user"} is requesting assistance.`,
        link: "/admin/dashboard",
        icon: MessageSquare,
        color: "text-primary",
      }));

      setMsgAlerts(generatedMsgAlerts);

      // 2. SYSTEM ALERTS (New Orders)
      const pendingOrders = orders.filter(
        (o) => o.orderStatus === "Processing",
      );
      const generatedSysAlerts = pendingOrders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((o) => ({
          id: `order-${o._id}`,
          title: "New Order Pending",
          message: `Order #${o._id.substring(o._id.length - 6).toUpperCase()} needs fulfillment.`,
          link: "/admin/orders",
          icon: Package,
          color: "text-warning",
        }));

      const dismissedSys =
        JSON.parse(localStorage.getItem("dismissedAdminSysAlerts")) || [];
      setSysAlerts(
        generatedSysAlerts.filter((a) => !dismissedSys.includes(a.id)),
      );
    } catch (error) {
      console.error("Failed to fetch admin notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleClearSysAlerts = () => {
    const currentIds = sysAlerts.map((n) => n.id);
    const previouslyDismissed =
      JSON.parse(localStorage.getItem("dismissedAdminSysAlerts")) || [];
    const newDismissed = [...new Set([...previouslyDismissed, ...currentIds])];
    localStorage.setItem(
      "dismissedAdminSysAlerts",
      JSON.stringify(newDismissed),
    );
    setSysAlerts([]);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getProfileImage = () => {
    if (user?.profilePhoto && user.profilePhoto !== "none") {
      if (user.profilePhoto.startsWith("http")) return user.profilePhoto;
      let cleanPath = user.profilePhoto.replace(/\\/g, "/");
      if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
      return `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${cleanPath}`;
    }
    return null;
  };

  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    switch (path) {
      case "dashboard":
        return "Analytics Overview";
      case "users":
        return "Staff Management";
      case "customers":
        return "Customer Registry";
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

  // Dynamic Theme Classes for Layout Structure
  const themeBg = isDarkMode ? "var(--bg-primary)" : "#f0f2f2";
  const headerBg = isDarkMode ? "var(--bg-secondary)" : "#ffffff";
  const headerBorder = isDarkMode ? "var(--border-color)" : "#D5D9D9";
  const textMuted = isDarkMode ? "var(--text-muted)" : "#6c757d";

  return (
    <div
      className="d-flex min-vh-100 transition-all"
      style={{ backgroundColor: themeBg, fontFamily: "'Inter', sans-serif" }}
    >
      <div className="flex-shrink-0 shadow-lg" style={{ zIndex: 1100 }}>
        <Sidebar />
      </div>

      <div
        className="flex-grow-1 d-flex flex-column overflow-hidden"
        style={{ height: "100vh" }}
      >
        <header
          className="shadow-sm px-4 py-3 flex-shrink-0 sticky-top transition-all"
          style={{
            backgroundColor: headerBg,
            borderBottom: `1px solid ${headerBorder}`,
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="mb-0 fw-bold theme-text">{getPageTitle()}</h4>
              <small className="d-none d-md-block" style={{ color: textMuted }}>
                Pharmacy Management System v1.0
              </small>
            </div>

            <div className="d-flex align-items-center gap-3 gap-md-4">
              <div className="d-none d-lg-block" style={{ width: "250px" }}>
                <GlobalSearch />
              </div>

              {/* LANGUAGE TOGGLE BUTTON */}
              <button
                className="btn btn-link p-0 border-0 shadow-none d-flex align-items-center gap-1 transition-all hover-opacity fw-bold"
                onClick={toggleLanguage}
                title="Translate Page"
                style={{
                  color: isDarkMode ? "var(--text-primary)" : "#0F1111",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                <Globe size={20} />
                <span className="d-none d-sm-inline">
                  {isNepali ? "EN" : "नेपाली"}
                </span>
              </button>

              {/* THEME TOGGLE BUTTON */}
              <button
                className="btn btn-link p-0 border-0 shadow-none d-flex align-items-center transition-all hover-opacity"
                onClick={toggleTheme}
                title="Toggle Theme"
                style={{
                  color: isDarkMode ? "var(--text-primary)" : "#0F1111",
                }}
              >
                {isDarkMode ? (
                  <Sun size={22} className="text-warning" />
                ) : (
                  <Moon size={22} />
                )}
              </button>

              {/* 💬 MESSAGE NOTIFICATIONS (Support Tickets) */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="btn btn-white border rounded-circle p-2 position-relative shadow-sm hide-caret d-flex align-items-center justify-content-center transition-all hover-lift"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderColor: headerBorder,
                  }}
                >
                  <MessageSquare
                    size={18}
                    style={{
                      color: isDarkMode ? "var(--text-primary)" : "#007185",
                    }}
                  />
                  {msgAlerts.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white animate-pulse">
                      {msgAlerts.length}
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-2"
                  style={{ width: "320px" }}
                >
                  <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark">Support Tickets</span>
                    <Badge bg="primary" className="rounded-pill">
                      {msgAlerts.length} Pending
                    </Badge>
                  </div>
                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {msgAlerts.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <CheckCircle2
                          size={32}
                          className="mb-2 text-success opacity-50"
                        />
                        <p className="small mb-0">All tickets resolved!</p>
                      </div>
                    ) : (
                      msgAlerts.map((n) => (
                        <Dropdown.Item
                          key={n.id}
                          onClick={() => navigate(n.link)}
                          className="p-3 border-bottom text-wrap transition-all hover-bg-light"
                        >
                          <div className="d-flex gap-3 align-items-start">
                            <div className={`mt-1 flex-shrink-0 ${n.color}`}>
                              <n.icon size={18} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark mb-1 fs-6">
                                {n.title}
                              </div>
                              <div className="small text-muted">
                                {n.message}
                              </div>
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))
                    )}
                  </div>
                </Dropdown.Menu>
              </Dropdown>

              {/* 🔔 SYSTEM NOTIFICATIONS (Orders) */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="btn btn-white border rounded-circle p-2 position-relative shadow-sm hide-caret d-flex align-items-center justify-content-center transition-all hover-lift"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderColor: headerBorder,
                  }}
                >
                  <Bell size={18} className="theme-text" />
                  {sysAlerts.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white animate-pulse">
                      {sysAlerts.length}
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-2"
                  style={{ width: "320px" }}
                >
                  <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark">System Alerts</span>
                    <Badge bg="secondary" className="rounded-pill">
                      {sysAlerts.length} New
                    </Badge>
                  </div>
                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {sysAlerts.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <CheckCircle2
                          size={32}
                          className="mb-2 text-success opacity-50"
                        />
                        <p className="small mb-0">No pending orders.</p>
                      </div>
                    ) : (
                      sysAlerts.map((n) => (
                        <Dropdown.Item
                          key={n.id}
                          onClick={() => navigate(n.link)}
                          className="p-3 border-bottom text-wrap transition-all hover-bg-light"
                        >
                          <div className="d-flex gap-3 align-items-start">
                            <div className={`mt-1 flex-shrink-0 ${n.color}`}>
                              <n.icon size={18} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark mb-1 fs-6">
                                {n.title}
                              </div>
                              <div className="small text-muted">
                                {n.message}
                              </div>
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))
                    )}
                  </div>
                  {sysAlerts.length > 0 && (
                    <div className="p-2 text-center bg-light border-top">
                      <button
                        className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
                        onClick={handleClearSysAlerts}
                      >
                        Dismiss Alerts
                      </button>
                    </div>
                  )}
                </Dropdown.Menu>
              </Dropdown>

              {/* 👤 ADMIN PROFILE DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="d-flex align-items-center gap-3 border-start ps-3 text-decoration-none hide-caret hover-opacity transition-all"
                  style={{
                    borderColor: `${headerBorder} !important`,
                    outline: "none",
                  }}
                >
                  <div className="text-end d-none d-md-block">
                    <div className="fw-bold theme-text">
                      {user?.name || "Admin"}
                    </div>
                    <small className="text-success fw-bold">
                      Administrator
                    </small>
                  </div>
                  {getProfileImage() ? (
                    <img
                      src={getProfileImage()}
                      alt="Profile"
                      className="rounded-circle object-fit-cover shadow-sm border"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderColor: headerBorder,
                      }}
                    />
                  ) : (
                    <div className="bg-light rounded-circle p-1">
                      <UserCircle size={32} className="text-muted" />
                    </div>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 mt-3"
                  style={{ minWidth: "200px" }}
                >
                  <div className="px-3 py-2 border-bottom mb-2 bg-light">
                    <p className="small text-muted mb-0">Signed in as</p>
                    <p className="fw-bold text-dark mb-0 text-truncate">
                      {user?.email || "admin@pharmacy.com"}
                    </p>
                  </div>
                  <Dropdown.Item
                    onClick={() => navigate("/admin/settings")}
                    className="py-2 d-flex align-items-center gap-2 fw-medium text-dark hover-bg-light"
                  >
                    <UserCircle size={16} className="text-muted" /> Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="py-2 d-flex align-items-center gap-2 text-danger fw-bold hover-bg-light"
                  >
                    <LogOut size={16} /> Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </header>

        <main
          className="flex-grow-1 p-4 overflow-auto custom-scrollbar transition-all"
          style={{ backgroundColor: themeBg }}
        >
          <div className="mb-3">
            <Breadcrumbs />
          </div>
          <div className="animate-fade-in">
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
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      <style>{`
        .hide-caret::after { display: none !important; }
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
        .hover-opacity:hover { opacity: 0.8; }
        .transition-all { transition: background-color 0.3s ease, color 0.3s ease, opacity 0.2s ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .animate-fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-badge {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        .animate-pulse { animation: pulse-badge 2s infinite; }
      `}</style>
    </div>
  );
};

export default AdminLayout;
