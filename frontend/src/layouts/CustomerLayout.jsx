import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Dropdown, Badge, Modal, Form, Button, Spinner } from "react-bootstrap";
import CustomerSidebar from "../components/CustomerSidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  Bell,
  UserCircle,
  ShoppingCart,
  LogOut,
  Package,
  MessageSquare,
  MessageCircle,
  Truck,
  CheckCircle2,
  Sun,
  Moon,
  Globe,
  Send,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

const CustomerLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { isDarkMode, toggleTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Language State
  const [isNepali, setIsNepali] = useState(false);

  // --- Separate Notification States ---
  const [orderAlerts, setOrderAlerts] = useState([]);
  const [msgAlerts, setMsgAlerts] = useState([]);
  const [activeAppointments, setActiveAppointments] = useState([]);

  // --- Chat Modal States ---
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatTarget, setChatTarget] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const chatScrollRef = useRef(null);

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

  // --- Fetch Notifications (Orders + Messages) ---
  const fetchNotifications = async () => {
    try {
      const [msgRes, orderRes, apptRes] = await Promise.all([
        api.get("/messages/my").catch(() => ({ data: [] })),
        api.get("/orders/myorders").catch(() => ({ data: [] })),
        api
          .get("/customer/appointments")
          .catch(() => ({ data: { appointments: [] } })),
      ]);

      const messages = Array.isArray(msgRes.data)
        ? msgRes.data
        : msgRes.data?.messages || [];
      const orders = Array.isArray(orderRes.data)
        ? orderRes.data
        : orderRes.data?.orders || [];
      const appointments =
        apptRes.data?.appointments ||
        (Array.isArray(apptRes.data) ? apptRes.data : []);
      setActiveAppointments(appointments);

      // 1. MESSAGE ALERTS
      const generatedMsgAlerts = [];

      const unreadSupportMsgs = messages.filter(
        (m) => m.adminReply && m.isReplyRead === false,
      );
      if (unreadSupportMsgs.length > 0) {
        generatedMsgAlerts.push({
          id: `support-msg-${unreadSupportMsgs.map((m) => m._id).join("-")}`,
          title: "Support Reply",
          message: `You have ${unreadSupportMsgs.length} unread message(s) from support.`,
          link: "/customer-dashboard",
          icon: MessageSquare,
          color: "text-info",
        });
      }

      const unreadDoctorMsgs = messages.filter((m) => {
        const isChatMsg = Boolean(m.appointment);
        const isUnread = m.isRead === false;
        const isFromSomeoneElse = String(m.sender) !== String(user?._id);
        return isChatMsg && isUnread && isFromSomeoneElse;
      });

      if (unreadDoctorMsgs.length > 0) {
        const groupedDoctorMsgs = {};
        unreadDoctorMsgs.forEach((m) => {
          if (!groupedDoctorMsgs[m.appointment])
            groupedDoctorMsgs[m.appointment] = 0;
          groupedDoctorMsgs[m.appointment]++;
        });

        Object.keys(groupedDoctorMsgs).forEach((apptId) => {
          generatedMsgAlerts.push({
            id: `doc-msg-${apptId}`,
            appointmentId: apptId,
            title: "New Message from Doctor",
            message: `You have ${groupedDoctorMsgs[apptId]} unread message(s) in an active chat.`,
            icon: MessageSquare,
            color: "text-primary",
          });
        });
      }

      setMsgAlerts(generatedMsgAlerts);

      // 2. ORDER ALERTS
      const activeOrders = orders.filter((o) =>
        ["Processing", "Shipped", "Delivered"].includes(o.orderStatus),
      );

      const generatedOrderAlerts = activeOrders
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 3)
        .map((order) => {
          let icon = Package;
          let color = "text-warning";
          let title = "Order Processing";
          let message = `Your order #${order._id.substring(order._id.length - 6).toUpperCase()} is being prepared.`;

          if (order.orderStatus === "Shipped") {
            icon = Truck;
            color = "text-primary";
            title = "Order Shipped!";
            message = `Your order is on the way.`;
          } else if (order.orderStatus === "Delivered") {
            icon = CheckCircle2;
            color = "text-success";
            title = "Order Delivered";
            message = `Your order has been successfully delivered.`;
          }

          return {
            id: `order-${order._id}-${order.orderStatus}`,
            title,
            message,
            link: `/order/${order._id}`,
            icon,
            color,
          };
        });

      const dismissedOrderIds =
        JSON.parse(localStorage.getItem("dismissedOrderAlerts")) || [];
      setOrderAlerts(
        generatedOrderAlerts.filter(
          (alert) => !dismissedOrderIds.includes(alert.id),
        ),
      );
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleClearOrderAlerts = () => {
    const currentOrderIds = orderAlerts.map((n) => n.id);
    const previouslyDismissed =
      JSON.parse(localStorage.getItem("dismissedOrderAlerts")) || [];
    const newDismissed = [
      ...new Set([...previouslyDismissed, ...currentOrderIds]),
    ];

    localStorage.setItem("dismissedOrderAlerts", JSON.stringify(newDismissed));
    setOrderAlerts([]);
  };

  // --- Chat Modal Logic ---
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, showChatModal]);

  const handleOpenChat = async (appointmentId) => {
    // Find the appointment to get doctor info
    let appointment = activeAppointments.find((a) => a._id === appointmentId);

    // If not found locally, fetch from API
    if (!appointment) {
      try {
        const res = await api.get("/customer/appointments");
        const allAppts =
          res.data?.appointments || (Array.isArray(res.data) ? res.data : []);
        appointment = allAppts.find((a) => a._id === appointmentId);
      } catch (err) {
        console.error("Failed to fetch appointment:", err);
      }
    }

    setChatTarget({
      appointmentId,
      doctorName: appointment?.doctor?.name || "Doctor",
      doctorId: appointment?.doctor?._id,
      date: appointment?.date,
    });
    setShowChatModal(true);
    setChatLoading(true);
    setChatHistory([]);

    try {
      const res = await api.get(`/messages/appointment/${appointmentId}`);
      setChatHistory(res.data.messages || res.data || []);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!messageText.trim() || !chatTarget) return;

    try {
      setSendingMessage(true);
      const payload = {
        receiverId: chatTarget.doctorId,
        appointmentId: chatTarget.appointmentId,
        text: messageText,
        senderModel: "User",
      };

      const res = await api.post("/messages/appointment", payload);

      const newMsg = res.data?.message ||
        res.data || {
          _id: Date.now().toString(),
          sender: user?._id,
          senderModel: "User",
          text: messageText,
          createdAt: new Date().toISOString(),
        };

      setChatHistory((prev) => [...prev, newMsg]);
      setMessageText("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    } finally {
      setSendingMessage(false);
    }
  };

  const getDoctorInitials = (name) => {
    if (!name) return "Dr";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // --- Cart Calculation ---
  const cart = useSelector((state) => state.cart);
  const cartItems = cart?.cartItems || [];

  const cartCount = cartItems.reduce((total, item) => {
    if (item && typeof item === "object" && Object.keys(item).length > 0) {
      const qty = Number(item.qty);
      if (!isNaN(qty) && qty > 0) return total + qty;
    }
    return total;
  }, 0);

  // --- Profile Image Helper ---
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

  // Dynamic Theme Classes for Layout Structure
  const themeBg = isDarkMode ? "var(--bg-primary)" : "#f0f2f2";
  const headerBg = isDarkMode ? "var(--bg-secondary)" : "#ffffff";
  const headerBorder = isDarkMode ? "var(--border-color)" : "#D5D9D9";
  const textMuted = isDarkMode ? "var(--text-muted)" : "#565959";

  return (
    <div
      className="d-flex min-vh-100 transition-all"
      style={{
        backgroundColor: themeBg,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <CustomerSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />

      <div
        className="flex-grow-1 d-flex flex-column overflow-hidden"
        style={{ height: "100vh" }}
      >
        <header
          className="px-4 py-3 flex-shrink-0 z-3 shadow-sm transition-all"
          style={{
            backgroundColor: headerBg,
            borderBottom: `1px solid ${headerBorder}`,
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            {/* Page Title */}
            <div>
              <h4
                className="mb-0 fw-bold theme-text"
                style={{ fontSize: "1.25rem" }}
              >
                Patient Portal
              </h4>
              <p className="small mb-0" style={{ color: textMuted }}>
                Manage your health, prescriptions, and orders.
              </p>
            </div>

            {/* Right Side Icons */}
            <div className="d-flex align-items-center gap-4">
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
                  <Sun size={24} className="text-warning" />
                ) : (
                  <Moon size={24} />
                )}
              </button>

              {/* CART ICON */}
              <div
                className="position-relative d-flex align-items-center justify-content-center transition-all hover-opacity"
                style={{
                  cursor: "pointer",
                  color: isDarkMode ? "var(--text-primary)" : "#0F1111",
                }}
                onClick={() => navigate("/cart")}
                title="View Cart"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                    style={{
                      backgroundColor: "#B12704",
                      color: "#fff",
                      fontSize: "0.65rem",
                      border: "2px solid #fff",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>

              {/* 💬 MESSAGE DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity transition-all"
                  title="Messages"
                  style={{
                    color: isDarkMode ? "var(--text-primary)" : "#0F1111",
                  }}
                >
                  <MessageSquare size={24} />
                  {msgAlerts.length > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
                      style={{
                        backgroundColor: "#B12704",
                        color: "#fff",
                        fontSize: "0.65rem",
                        border: "2px solid #fff",
                      }}
                    >
                      {msgAlerts.length}
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-3"
                  style={{ width: "320px" }}
                >
                  <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark mb-0">Messages</span>
                    <Badge bg="primary" className="rounded-pill">
                      {msgAlerts.length} Unread
                    </Badge>
                  </div>
                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {msgAlerts.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <CheckCircle2
                          size={32}
                          className="mb-2 text-success opacity-50"
                        />
                        <p className="small mb-0 fw-medium">Inbox is clear!</p>
                      </div>
                    ) : (
                      msgAlerts.map((n) => (
                        <Dropdown.Item
                          key={n.id}
                          onClick={() => {
                            if (n.title === "Support Reply") {
                              navigate("/customer-dashboard", {
                                state: { scrollTo: "support-tickets" },
                              });
                            } else if (n.appointmentId) {
                              handleOpenChat(n.appointmentId);
                            } else if (n.link) {
                              navigate(n.link);
                            }
                          }}
                          className="p-3 border-bottom text-wrap hover-bg-light transition-all"
                        >
                          <div className="d-flex gap-3 align-items-start">
                            <div className={`mt-1 flex-shrink-0 ${n.color}`}>
                              <n.icon size={18} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark mb-1 fs-6">
                                {n.title}
                              </div>
                              <div className="small text-muted lh-sm">
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

              {/* 🔔 ORDER NOTIFICATION DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity transition-all"
                  title="Notifications"
                  style={{
                    color: isDarkMode ? "var(--text-primary)" : "#0F1111",
                  }}
                >
                  <Bell size={24} />
                  {orderAlerts.length > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
                      style={{
                        backgroundColor: "#B12704",
                        color: "#fff",
                        fontSize: "0.65rem",
                        border: "2px solid #fff",
                      }}
                    >
                      {orderAlerts.length}
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-3"
                  style={{ width: "320px" }}
                >
                  <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark mb-0">
                      System Alerts
                    </span>
                    <Badge bg="secondary" className="rounded-pill">
                      {orderAlerts.length} New
                    </Badge>
                  </div>
                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {orderAlerts.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <CheckCircle2
                          size={32}
                          className="mb-2 text-success opacity-50"
                        />
                        <p className="small mb-0 fw-medium">
                          No new updates right now.
                        </p>
                      </div>
                    ) : (
                      orderAlerts.map((n) => (
                        <Dropdown.Item
                          key={n.id}
                          onClick={() => navigate(n.link)}
                          className="p-3 border-bottom text-wrap hover-bg-light transition-all"
                        >
                          <div className="d-flex gap-3 align-items-start">
                            <div className={`mt-1 flex-shrink-0 ${n.color}`}>
                              <n.icon size={18} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark mb-1 fs-6">
                                {n.title}
                              </div>
                              <div className="small text-muted lh-sm">
                                {n.message}
                              </div>
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))
                    )}
                  </div>
                  {orderAlerts.length > 0 && (
                    <div className="p-2 text-center bg-light border-top">
                      <button
                        className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
                        onClick={handleClearOrderAlerts}
                      >
                        Dismiss Order Alerts
                      </button>
                    </div>
                  )}
                </Dropdown.Menu>
              </Dropdown>

              {/* USER PROFILE DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="d-flex align-items-center gap-3 border-start ps-4 text-decoration-none hide-caret hover-opacity transition-all"
                  style={{
                    borderColor: `${headerBorder} !important`,
                    outline: "none",
                    boxShadow: "none",
                  }}
                >
                  <div
                    className="text-end d-none d-md-block"
                    style={{ lineHeight: "1.2" }}
                  >
                    <div className="fw-bold fs-6 theme-text">
                      {user?.name || "Customer"}
                    </div>
                    <div
                      className="fw-medium text-uppercase mt-1"
                      style={{
                        fontSize: "0.7rem",
                        color: "#007185",
                        letterSpacing: "0.5px",
                      }}
                    >
                      My Account
                    </div>
                  </div>
                  {getProfileImage() ? (
                    <img
                      src={getProfileImage()}
                      alt="Profile"
                      className="rounded-circle object-fit-cover border shadow-sm"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderColor: headerBorder,
                      }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center bg-light rounded-circle p-1">
                      <UserCircle
                        size={32}
                        style={{ color: "#565959", strokeWidth: "1.5" }}
                      />
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
                      {user?.email || "customer@example.com"}
                    </p>
                  </div>
                  <Dropdown.Item
                    onClick={() => navigate("/profile")}
                    className="py-2 d-flex align-items-center gap-2 fw-medium text-dark hover-bg-light"
                  >
                    <UserCircle size={16} className="text-muted" /> My Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="py-2 d-flex align-items-center gap-2 fw-bold text-danger hover-bg-light"
                  >
                    <LogOut size={16} /> Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <main
          className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar transition-all"
          style={{ backgroundColor: themeBg }}
        >
          <Breadcrumbs />
          <div className="mt-2">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ====================================================================== */}
      {/* PATIENT CHAT MODAL */}
      {/* ====================================================================== */}
      <Modal
        show={showChatModal}
        onHide={() => setShowChatModal(false)}
        centered
        contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
      >
        <Modal.Header className="bg-primary text-white border-0 p-4 pb-3">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2 fs-5">
            <MessageCircle size={20} /> Doctor Chat
          </Modal.Title>
          <button
            type="button"
            className="btn-close btn-close-white shadow-none ms-auto"
            onClick={() => setShowChatModal(false)}
          ></button>
        </Modal.Header>

        <Modal.Body className="p-0 bg-white">
          <div className="p-3 bg-light border-bottom border-light-subtle d-flex align-items-center gap-3">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0"
              style={{ width: "40px", height: "40px" }}
            >
              {getDoctorInitials(chatTarget?.doctorName)}
            </div>
            <div>
              <h6 className="fw-bold text-dark mb-0">
                Dr. {chatTarget?.doctorName || "Doctor"}
              </h6>
              <span className="text-muted small fw-medium">
                Appt:{" "}
                {chatTarget?.date
                  ? new Date(chatTarget.date).toLocaleDateString()
                  : "Active"}
              </span>
            </div>
          </div>

          <div
            className="p-3 bg-white d-flex flex-column custom-scrollbar"
            style={{
              height: "350px",
              overflowY: "auto",
            }}
            ref={chatScrollRef}
          >
            {chatLoading ? (
              <div className="m-auto text-center">
                <Spinner
                  animation="border"
                  size="sm"
                  className="text-primary mb-2"
                />
                <p className="small text-muted fw-medium mb-0">
                  Loading history...
                </p>
              </div>
            ) : chatHistory.length === 0 ? (
              <div className="m-auto text-center text-muted opacity-50">
                <MessageSquare size={32} className="mb-2" />
                <p className="small fw-medium mb-0">
                  No messages yet.
                  <br />
                  Say hello to your doctor!
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {chatHistory.map((msg) => {
                  const isMe =
                    msg.senderModel === "User" ||
                    msg.senderModel === "Customer" ||
                    String(msg.sender?._id || msg.sender) === String(user?._id);
                  return (
                    <div
                      key={msg._id}
                      className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"}`}
                    >
                      <div
                        className={`p-3 rounded-4 shadow-sm ${isMe ? "bg-primary text-white" : "bg-light text-dark border border-light-subtle"}`}
                        style={{
                          maxWidth: "85%",
                          borderBottomRightRadius: isMe ? "4px" : "16px",
                          borderBottomLeftRadius: !isMe ? "4px" : "16px",
                        }}
                      >
                        <div className="small mb-1 lh-base">{msg.text}</div>
                        <div
                          className={`text-end fw-medium ${isMe ? "text-white-50" : "text-muted"}`}
                          style={{ fontSize: "0.65rem" }}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-3 bg-light border-top border-light-subtle">
            <Form
              onSubmit={handleSendMessage}
              className="d-flex gap-2 align-items-end"
            >
              <Form.Control
                as="textarea"
                rows={1}
                className="border-light-subtle bg-white shadow-none focus-ring-primary rounded-pill py-2 px-3"
                style={{
                  resize: "none",
                  overflow: "hidden",
                  minHeight: "44px",
                }}
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                type="submit"
                variant="primary"
                className="rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                style={{ width: "44px", height: "44px" }}
                disabled={sendingMessage || !messageText.trim()}
              >
                {sendingMessage ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <Send size={18} className="ms-1" />
                )}
              </Button>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      <style>{`
        .hide-caret::after { display: none !important; }
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .transition-all { transition: background-color 0.3s ease, color 0.3s ease, opacity 0.2s ease-in-out; }
        .hover-opacity:hover { opacity: 0.7; }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

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

export default CustomerLayout;
