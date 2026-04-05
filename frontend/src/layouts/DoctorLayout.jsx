import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Dropdown, Badge } from "react-bootstrap";
import DoctorSidebar from "./DoctorSidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  Bell,
  UserCircle,
  Menu,
  LogOut,
  CalendarCheck,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const DoctorLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // --- Separate Notification States ---
  const [apptAlerts, setApptAlerts] = useState([]);
  const [msgAlerts, setMsgAlerts] = useState([]);

  // --- Handle Screen Resize ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Fetch Notifications ---
  const fetchNotifications = async () => {
    try {
      // 1. Fetch Appointments
      const apptRes = await api
        .get("/doctor/appointments")
        .catch(() => ({ data: { appointments: [] } }));

      const appointments = apptRes.data?.appointments || [];

      // ==========================================
      // 1. APPOINTMENT ALERTS (Bell Icon)
      // ==========================================
      const pendingAppts = appointments.filter(
        (a) => a.status?.toLowerCase() === "pending",
      );

      const generatedApptAlerts = pendingAppts.map((app) => ({
        id: `appt-pending-${app._id}`,
        title: "New Appointment Request",
        message: `${app.patient?.name || "A patient"} requested a visit on ${new Date(app.date).toLocaleDateString()}.`,
        link: "/doctor/appointments",
        icon: CalendarCheck,
        color: "text-warning",
      }));

      const dismissedAppts =
        JSON.parse(localStorage.getItem("dismissedDoctorAppts")) || [];
      setApptAlerts(
        generatedApptAlerts.filter((a) => !dismissedAppts.includes(a.id)),
      );

      // ==========================================
      // 2. MESSAGE ALERTS (Message Icon)
      // ==========================================
      // We fetch the chat history for each active appointment directly.
      // This bypasses any bugs with missing receiverIds in the database!
      const activeAppts = appointments.filter((a) =>
        ["confirmed", "pending"].includes(a.status?.toLowerCase()),
      );

      // Fetch all chats in parallel using the background flag to prevent auto-reading
      const chatPromises = activeAppts.map((app) =>
        api
          .get(`/messages/appointment/${app._id}?background=true`)
          .catch(() => ({ data: [] })),
      );

      const chatResults = await Promise.all(chatPromises);

      const groupedMsgs = {};

      chatResults.forEach((res, index) => {
        const msgs = Array.isArray(res.data)
          ? res.data
          : res.data?.messages || [];
        const apptId = activeAppts[index]._id;

        msgs.forEach((m) => {
          // Safely extract IDs (Handles cases where backend populates the sender as an object)
          const senderId = m.sender?._id
            ? String(m.sender._id)
            : String(m.sender);
          const myId = String(user?._id);

          // If the message is unread AND the sender is NOT the doctor, it's a notification!
          if (m.isRead === false && senderId !== myId) {
            if (!groupedMsgs[apptId]) groupedMsgs[apptId] = 0;
            groupedMsgs[apptId]++;
          }
        });
      });

      const generatedMsgAlerts = Object.keys(groupedMsgs).map((apptId) => ({
        id: `msg-${apptId}`,
        appointmentId: apptId,
        title: "New Patient Message",
        message: `You have ${groupedMsgs[apptId]} new message(s) from a patient.`,
        icon: MessageSquare,
        color: "text-primary",
      }));

      setMsgAlerts(generatedMsgAlerts);
    } catch (error) {
      console.error("Failed to fetch doctor notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user?._id]);

  // Dismiss only Appointment Alerts
  const handleClearApptAlerts = () => {
    const currentIds = apptAlerts.map((n) => n.id);
    const previouslyDismissed =
      JSON.parse(localStorage.getItem("dismissedDoctorAppts")) || [];
    const newDismissed = [...new Set([...previouslyDismissed, ...currentIds])];

    localStorage.setItem("dismissedDoctorAppts", JSON.stringify(newDismissed));
    setApptAlerts([]);
  };

  const getProfileImage = () => {
    if (
      user?.profilePhoto &&
      user.profilePhoto !== "none" &&
      !user.profilePhoto.includes("sample-doctor.jpg")
    ) {
      if (user.profilePhoto.startsWith("http")) return user.profilePhoto;
      let cleanPath = user.profilePhoto.replace(/\\/g, "/");
      if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
      return `http://localhost:5000${cleanPath}`;
    }
    return null;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="d-flex min-vh-100 bg-light"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <DoctorSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />

      <div
        className="flex-grow-1 d-flex flex-column overflow-hidden"
        style={{ height: "100vh" }}
      >
        <header className="bg-white shadow-sm border-bottom px-4 py-3 flex-shrink-0 z-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              {isMobile && (
                <button
                  className="btn btn-light p-2 border"
                  onClick={() => setCollapsed(false)}
                >
                  <Menu size={20} />
                </button>
              )}
              <div>
                <h4 className="mb-0 fw-bold">Clinical Portal</h4>
                <small className="text-muted">
                  Manage appointments & patients
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 gap-md-4">
              {/* 💬 MESSAGE DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="btn btn-white border rounded-circle p-2 position-relative shadow-sm hide-caret d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <MessageSquare size={20} className="text-primary" />
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
                    <span className="fw-bold">Messages</span>
                    <Badge bg="primary" className="rounded-pill">
                      {msgAlerts.length} New
                    </Badge>
                  </div>
                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {msgAlerts.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <CheckCircle2
                          size={32}
                          className="mb-2 text-success opacity-50"
                        />
                        <p className="small mb-0">Inbox is clear!</p>
                      </div>
                    ) : (
                      msgAlerts.map((n) => (
                        <Dropdown.Item
                          key={n.id}
                          onClick={() =>
                            navigate("/doctor/dashboard", {
                              state: {
                                openChatForAppointment: n.appointmentId,
                              },
                            })
                          }
                          className="p-3 border-bottom text-wrap transition-all"
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

              {/* 🔔 APPOINTMENT NOTIFICATION DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="btn btn-white border rounded-circle p-2 position-relative shadow-sm hide-caret d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <Bell size={20} className="text-dark" />
                  {apptAlerts.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white animate-pulse">
                      {apptAlerts.length}
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-2"
                  style={{ width: "320px" }}
                >
                  <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-bold">System Alerts</span>
                    <Badge bg="secondary" className="rounded-pill">
                      {apptAlerts.length} New
                    </Badge>
                  </div>
                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {apptAlerts.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <CheckCircle2
                          size={32}
                          className="mb-2 text-success opacity-50"
                        />
                        <p className="small mb-0">No new requests.</p>
                      </div>
                    ) : (
                      apptAlerts.map((n) => (
                        <Dropdown.Item
                          key={n.id}
                          onClick={() => navigate(n.link)}
                          className="p-3 border-bottom text-wrap transition-all"
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
                  {apptAlerts.length > 0 && (
                    <div className="p-2 text-center bg-light border-top">
                      <button
                        className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
                        onClick={handleClearApptAlerts}
                      >
                        Dismiss Alerts
                      </button>
                    </div>
                  )}
                </Dropdown.Menu>
              </Dropdown>

              {/* 👤 USER PROFILE DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="d-flex align-items-center gap-3 border-start ps-3 text-decoration-none hide-caret"
                >
                  <div className="text-end d-none d-md-block">
                    <div className="fw-bold text-dark">
                      Dr. {user?.name?.split(" ")[0]}
                    </div>
                    <small className="text-info fw-bold">
                      {user?.speciality || "Physician"}
                    </small>
                  </div>
                  <div className="bg-light rounded-circle p-1">
                    <UserCircle size={32} className="text-muted" />
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow-lg border-0 rounded-4 mt-3">
                  <Dropdown.Item onClick={() => navigate("/doctor/profile")}>
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="text-danger fw-bold"
                  >
                    <LogOut size={16} /> Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </header>

        <main className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      <style>{`
        .hide-caret::after { display: none !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
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

export default DoctorLayout;
