import React, { useState, useEffect } from "react";
import {
  Package,
  Calendar,
  FileText,
  CreditCard,
  Upload,
  Plus,
  Clock,
  Heart,
  ShoppingCart,
  Loader2,
  ArrowUpRight,
  MessageSquare,
  Bell,
  Send,
  Pill,
  User,
  Eye,
  Trash2,
  MapPin,
  XCircle,
  Image as ImageIcon,
  Activity,
  ArrowRight,
  Stethoscope,
  Search,
  FilePlus,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import {
  Container,
  Row,
  Col,
  Modal,
  Form,
  Badge,
  Button,
  Spinner,
  Table,
} from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { addToCart } from "../redux/actions/cartActions";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // --- UI State ---
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // --- Order Details & Cancellation State ---
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // --- Customer Reply State ---
  const [customerReplyText, setCustomerReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  // --- Data State ---
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [savedMedicines, setSavedMedicines] = useState([]);
  const [myMessages, setMyMessages] = useState([]);
  const [medicines, setMedicines] = useState([]);

  // --- Interaction State ---
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [notes, setNotes] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  // --- Effects ---
  useEffect(() => {
    fetchAllData();
    const syncMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/messages/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const latestMessages = await res.json();
          setMyMessages(latestMessages);
        }
      } catch (err) {}
    };

    const interval = setInterval(syncMessages, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo === "support-tickets") {
      const el = document.getElementById("support-tickets-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("highlight-pulse");
        setTimeout(() => el.classList.remove("highlight-pulse"), 2000);
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  const safelyGetArray = (data, key) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data[key])) return data[key];
    return [];
  };

  const getImageUrl = (path) => {
    if (!path)
      return "https://ui-avatars.com/api/?name=Item&background=f8fafc&color=0284c7";
    return path.startsWith("http")
      ? path
      : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${path}`;
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      const headers = { Authorization: `Bearer ${token}` };

      const results = await Promise.allSettled([
        fetch(`${API_BASE_URL}/auth/profile`, { headers }),
        fetch(`${API_BASE_URL}/customer/orders`, { headers }),
        fetch(`${API_BASE_URL}/medicines`, { headers }),
        fetch(`${API_BASE_URL}/customer/appointments`, { headers }),
        fetch(`${API_BASE_URL}/customer/prescriptions`, { headers }),
        fetch(`${API_BASE_URL}/customer/saved-medicines`, { headers }),
        fetch(`${API_BASE_URL}/messages/my`, { headers }),
      ]);

      const [
        profileRes,
        ordersRes,
        medsRes,
        apptRes,
        presRes,
        savedRes,
        msgRes,
      ] = results;

      if (profileRes.status === "fulfilled" && profileRes.value.ok)
        setProfile(await profileRes.value.json());
      if (ordersRes.status === "fulfilled" && ordersRes.value.ok)
        setOrders(safelyGetArray(await ordersRes.value.json(), "orders"));
      if (medsRes.status === "fulfilled" && medsRes.value.ok)
        setMedicines(safelyGetArray(await medsRes.value.json(), "medicines"));
      if (apptRes.status === "fulfilled" && apptRes.value.ok)
        setMyAppointments(
          safelyGetArray(await apptRes.value.json(), "appointments"),
        );
      if (presRes.status === "fulfilled" && presRes.value.ok)
        setMyPrescriptions(
          safelyGetArray(await presRes.value.json(), "prescriptions"),
        );
      if (savedRes.status === "fulfilled" && savedRes.value.ok)
        setSavedMedicines(await savedRes.value.json());
      if (msgRes.status === "fulfilled" && msgRes.value.ok)
        setMyMessages(await msgRes.value.json());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Actions ---
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const confirmDelete = (id) => {
    setOrderToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/orders/${orderToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Server refused to cancel the order.",
        );
      }
      setOrders((prev) => prev.filter((order) => order._id !== orderToDelete));
    } catch (err) {
      alert(err.message || "Failed to cancel order.");
    } finally {
      setShowDeleteModal(false);
      setDeleteLoading(false);
      setOrderToDelete(null);
    }
  };

  const handleReadMessage = async (msg) => {
    setSelectedMessage(msg);
    setCustomerReplyText("");

    if (msg.adminReply && !msg.isReplyRead) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${API_BASE_URL}/messages/${msg._id}/read-reply`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyMessages((prev) =>
          prev.map((m) =>
            m._id === msg._id ? { ...m, isReplyRead: true } : m,
          ),
        );
      } catch (err) {}
    }
  };

  const handleSendCustomerReply = async () => {
    if (!customerReplyText.trim()) return;
    try {
      setReplyLoading(true);
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile?.name || user?.name || "Customer",
          email: profile?.email || user?.email || "customer@example.com",
          text: `[Reply to previous ticket]: ${customerReplyText}`,
        }),
      });

      setCustomerReplyText("");
      setSelectedMessage(null);
      fetchAllData();
    } catch (err) {
      alert("Failed to send reply.");
    } finally {
      setReplyLoading(false);
    }
  };

  const handlePrescriptionChange = (e) => {
    const file = e.target.files?.[0];
    setPrescriptionFile(file || null);
    setPrescriptionPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleUploadPrescription = async (e) => {
    e.preventDefault();
    if (!prescriptionFile) return;
    try {
      setUploadLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", prescriptionFile);
      formData.append("notes", notes);

      let res = await fetch(`${API_BASE_URL}/prescriptions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      if (res.ok) {
        setUploadMessage("Prescription uploaded successfully!");
        setPrescriptionFile(null);
        setPrescriptionPreview(null);
        setNotes("");
        setShowUploadModal(false);
        fetchAllData();
      } else {
        setUploadMessage("Failed to upload.");
      }
    } catch (err) {
      setUploadMessage("Error uploading prescription.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleAddToCart = (med) => {
    const itemToAdd = med.medicine || med;
    if (!itemToAdd || itemToAdd.countInStock === 0) return;
    dispatch(addToCart(itemToAdd._id, 1));
  };

  const itemsPriceNum = Number(selectedOrder?.itemsPrice);
  const calculatedSubtotal =
    itemsPriceNum > 0
      ? itemsPriceNum
      : selectedOrder?.orderItems?.reduce(
          (acc, item) => acc + Number(item.price) * Number(item.qty),
          0,
        ) || 0;

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center vh-100"
        style={{ backgroundColor: "#F8FAFC" }}
      >
        <div className="bg-white p-5 rounded-4 shadow-sm text-center border-0">
          <div className="spinner-glow mx-auto mb-3"></div>
          <span
            className="text-secondary fw-bold text-uppercase small"
            style={{ letterSpacing: "1px" }}
          >
            Loading Your Portal...
          </span>
        </div>
        <style>{`.spinner-glow { width: 50px; height: 50px; border-radius: 50%; border: 3px solid transparent; border-top-color: #007185; border-right-color: #007185; animation: spin 1s linear infinite; box-shadow: 0 0 15px rgba(0,113,133,0.3); } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const unreadRepliesCount = myMessages.filter(
    (m) => m.adminReply && !m.isReplyRead,
  ).length;
  const upcomingAppt = myAppointments
    .filter(
      (a) =>
        new Date(a.date) >= new Date().setHours(0, 0, 0, 0) &&
        a.status !== "cancelled",
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  const userName = profile?.name || user?.name || "Customer";

  const statsCards = [
    {
      label: "Wallet Points",
      value: profile?.loyaltyPoints || 0,
      icon: CreditCard,
      color: "#10b981",
      bg: "#d1fae5",
      link: "/profile",
    },
    {
      label: "Active Orders",
      value: orders.filter((o) => !o.isDelivered).length,
      icon: Package,
      color: "#f59e0b",
      bg: "#fef3c7",
      link: "/orders",
    },
    {
      label: "Appointments",
      value: myAppointments.length,
      icon: Calendar,
      color: "#3b82f6",
      bg: "#dbeafe",
      link: "/appointments",
    },
    {
      label: "Prescriptions",
      value: myPrescriptions.length,
      icon: FileText,
      color: "#8b5cf6",
      bg: "#ede9fe",
      link: "/prescriptions",
    },
  ];

  return (
    <div
      className="min-vh-100 pb-5"
      style={{ backgroundColor: "#F4F7FA", fontFamily: "'Inter', sans-serif" }}
    >
      {/* 1. APP HEADER & GREETING */}
      <div className="px-4 pt-4 pb-2 d-flex justify-content-between align-items-center animate-fade-in">
        <div className="d-flex align-items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${userName}&background=007185&color=fff&size=128&bold=true`}
            alt="User"
            className="rounded-circle shadow-sm border border-2 border-white"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
          <div>
            <p className="text-muted mb-0 small fw-medium">Hello,</p>
            <h4
              className="fw-bold text-dark mb-0"
              style={{ letterSpacing: "-0.5px" }}
            >
              {userName.split(" ")[0]} 👋
            </h4>
          </div>
        </div>

        {/* Notification Bell */}
        <div
          className="position-relative cursor-pointer hover-scale bg-white p-2 rounded-circle shadow-sm border"
          onClick={() =>
            document
              .getElementById("support-tickets-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <Bell size={24} className="text-secondary" />
          {unreadRepliesCount > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-2 border-white rounded-circle animate-pulse"
              style={{ width: "12px", height: "12px" }}
            ></span>
          )}
        </div>
      </div>

      <Container fluid className="px-3 px-md-4 mt-3">
        {/* 2. STUNNING PROMO BANNER */}
        <div
          className="rounded-4 mb-4 shadow-sm position-relative overflow-hidden cursor-pointer hover-card animate-slide-up"
          onClick={() => navigate("/medicines")}
          style={{
            minHeight: "180px",
            backgroundImage: `url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark Overlay for Text Readability */}
          <div
            className="position-absolute w-100 h-100 top-0 start-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,50,60,0.85) 0%, rgba(0,113,133,0.4) 100%)",
            }}
          ></div>

          <div className="position-relative z-2 p-4 p-md-5 h-100 d-flex flex-column justify-content-center">
            <Badge
              bg="white"
              text="primary"
              className="rounded-pill align-self-start mb-3 px-3 py-2 fw-bold shadow-sm"
            >
              <ShieldCheck size={14} className="me-1" /> Verified Pharmacy
            </Badge>
            <h2
              className="text-white fw-bold mb-2"
              style={{ letterSpacing: "-0.5px" }}
            >
              Manage Your Health.
            </h2>
            <p
              className="text-white text-opacity-75 mb-0 d-none d-md-block"
              style={{ maxWidth: "400px" }}
            >
              Order genuine medicines, book expert consultations, and track your
              prescriptions easily.
            </p>
          </div>
        </div>

        {/* 3. METRICS SCROLL (PILL STYLE) */}
        <div
          className="d-flex gap-3 mb-4 overflow-auto custom-scrollbar pb-2 animate-fade-in"
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          {statsCards.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-pill px-4 py-2 shadow-sm border-0 d-flex align-items-center gap-3 cursor-pointer hover-scale flex-shrink-0"
              onClick={() => navigate(item.link)}
            >
              <div
                className="p-2 rounded-circle"
                style={{ backgroundColor: item.bg }}
              >
                <item.icon
                  size={18}
                  style={{ color: item.color }}
                  strokeWidth={2.5}
                />
              </div>
              <div>
                <h5 className="fw-bold mb-0 text-dark lh-1">{item.value}</h5>
                <span
                  className="text-muted small fw-medium"
                  style={{ fontSize: "0.75rem" }}
                >
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 4. APP-LIKE QUICK ACTIONS */}
        <Row className="g-3 mb-4 position-relative z-3 animate-fade-in">
          {[
            {
              label: "Shop Medicine",
              icon: Search,
              color: "text-primary",
              bg: "bg-primary",
              link: "/medicines",
            },
            {
              label: "Doctor Appointment",
              icon: Stethoscope,
              color: "text-success",
              bg: "bg-success",
              link: "/appointments",
            },
            {
              label: "Upload Rx",
              icon: FilePlus,
              color: "text-warning",
              bg: "bg-warning",
              action: () => setShowUploadModal(true),
            },
            {
              label: "My Orders",
              icon: Package,
              color: "text-info",
              bg: "bg-info",
              link: "/orders",
            },
          ].map((action, idx) => (
            <Col xs={6} md={3} key={idx}>
              <div
                className="bg-white rounded-4 p-3 shadow-sm text-center cursor-pointer hover-card h-100 d-flex flex-column align-items-center justify-content-center border-light-subtle border"
                onClick={
                  action.link ? () => navigate(action.link) : action.action
                }
              >
                <div
                  className={`${action.bg} bg-opacity-10 ${action.color} rounded-circle d-flex align-items-center justify-content-center mb-2`}
                  style={{ width: "50px", height: "50px" }}
                >
                  <action.icon size={24} strokeWidth={2} />
                </div>
                <span className="fw-bold text-dark small">{action.label}</span>
              </div>
            </Col>
          ))}
        </Row>

        {/* 5. MAIN DASHBOARD CONTENT */}
        <Row className="g-4 animate-fade-in">
          <Col lg={8} className="d-flex flex-column gap-4">
            {/* SAVED MEDICINES (HORIZONTAL SCROLL / RICH IMAGES) */}
            <div className="bg-transparent border-0">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0 fs-5 d-flex align-items-center gap-2">
                  Saved for Later
                </h5>
                <Link
                  to="/customer/saved"
                  className="text-decoration-none text-primary fw-medium small hover-underline"
                >
                  See All
                </Link>
              </div>

              {savedMedicines.length > 0 ? (
                <div
                  className="d-flex gap-3 overflow-auto pb-2 custom-scrollbar"
                  style={{ scrollSnapType: "x mandatory" }}
                >
                  {savedMedicines.map((item) => {
                    const med = item.medicine;
                    if (!med) return null;
                    return (
                      <div
                        key={item._id}
                        className="bg-white border border-light-subtle rounded-4 p-3 hover-card transition-all flex-shrink-0"
                        style={{ width: "180px", scrollSnapAlign: "start" }}
                      >
                        <div
                          className="mb-3 position-relative bg-light rounded-3 d-flex align-items-center justify-content-center overflow-hidden"
                          style={{ height: "120px" }}
                        >
                          <img
                            src={getImageUrl(med.image)}
                            alt={med.name}
                            className="img-fluid mix-blend-multiply"
                            style={{ maxHeight: "90%", objectFit: "contain" }}
                          />
                          <button className="btn btn-light rounded-circle p-1 position-absolute top-0 end-0 m-2 shadow-sm text-danger">
                            <Heart size={14} fill="#ef4444" />
                          </button>
                        </div>
                        <h6
                          className="fw-bold text-dark text-truncate mb-1"
                          title={med.name}
                          style={{ fontSize: "0.9rem" }}
                        >
                          {med.name}
                        </h6>
                        <div className="fw-bold text-primary mb-2">
                          Rs. {med.price}
                        </div>
                        <Button
                          variant="outline-primary"
                          className="w-100 rounded-pill fw-bold small py-1 shadow-sm-hover"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart size={14} className="me-1" /> Add
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 bg-white rounded-4 shadow-sm border-0 border-light-subtle">
                  <div className="bg-light p-3 rounded-circle d-inline-block mb-3">
                    <Heart size={28} className="text-muted opacity-50" />
                  </div>
                  <p className="text-dark fw-bold mb-1">
                    Your wishlist is empty
                  </p>
                  <p className="text-muted small mb-3">
                    Save items you buy frequently for quick access.
                  </p>
                  <Button
                    variant="light"
                    className="rounded-pill border fw-medium px-4"
                    onClick={() => navigate("/medicines")}
                  >
                    Browse Catalog
                  </Button>
                </div>
              )}
            </div>

            {/* RECENT ORDERS (TIMELINE LIST) */}
            <div className="bg-white rounded-4 shadow-sm border-0 mb-4 overflow-hidden d-flex flex-column">
              <div className="p-4 border-bottom-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark fs-5">Recent Orders</h5>
                <Link
                  to="/orders"
                  className="btn btn-light rounded-pill text-primary fw-medium px-3 py-1 d-flex align-items-center gap-1 small hover-bg-primary-light"
                >
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div className="p-3 pt-0">
                {orders.length > 0 ? (
                  orders.slice(0, 3).map((order) => {
                    const isPaid = order.isPaid;
                    const status =
                      order.orderStatus ||
                      (order.isDelivered ? "Delivered" : "Processing");
                    return (
                      <div
                        key={order._id}
                        className="bg-light bg-opacity-50 rounded-4 p-3 mb-3 border border-light-subtle hover-lift d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center text-primary"
                            style={{ width: "45px", height: "45px" }}
                          >
                            <Package size={20} />
                          </div>
                          <div>
                            <div className="fw-bold text-dark mb-1">
                              Order #
                              {order.orderNumber ||
                                order._id
                                  .substring(order._id.length - 6)
                                  .toUpperCase()}
                            </div>
                            <div className="text-muted small d-flex align-items-center gap-2">
                              <span>
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" },
                                )}
                              </span>
                              <span style={{ color: "#cbd5e1" }}>•</span>
                              <span className="fw-bold text-dark">
                                Rs. {Number(order.totalPrice).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 justify-content-between">
                          <Badge
                            bg={isPaid ? "success" : "warning"}
                            text={isPaid ? "light" : "dark"}
                            className="rounded-pill px-3 py-2 fw-medium"
                          >
                            {status}
                          </Badge>
                          <div className="d-flex gap-2">
                            <Button
                              variant="white"
                              size="sm"
                              className="rounded-circle p-2 shadow-sm border text-primary"
                              onClick={() => handleViewDetails(order)}
                            >
                              <Eye size={16} />
                            </Button>
                            {(status === "Processing" ||
                              status === "Pending Verification") &&
                              !order.isPaid && (
                                <Button
                                  variant="white"
                                  size="sm"
                                  className="rounded-circle p-2 shadow-sm border text-danger"
                                  onClick={() => confirmDelete(order._id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-5 text-muted border-dashed rounded-4">
                    <Package size={32} className="mb-2 opacity-50" />
                    <p className="fw-medium mb-0">No recent orders found.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RECENT PRESCRIPTIONS */}
            <div className="bg-white rounded-4 shadow-sm border-0 p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom-0">
                <h5 className="mb-0 fw-bold fs-5 text-dark">
                  Active Prescriptions
                </h5>
              </div>

              {myPrescriptions.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {myPrescriptions.slice(0, 2).map((rx) => {
                    const isDigital = rx.items && rx.items.length > 0;
                    return (
                      <div
                        key={rx._id}
                        className="bg-white border border-light-subtle p-3 rounded-4 transition-all hover-lift shadow-sm-hover d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className={`p-3 rounded-circle ${isDigital ? "bg-primary text-white shadow-sm" : "bg-warning text-dark shadow-sm"}`}
                          >
                            {isDigital ? (
                              <Stethoscope size={20} />
                            ) : (
                              <FileText size={20} />
                            )}
                          </div>
                          <div>
                            <div className="fw-bold text-dark fs-6">
                              {isDigital
                                ? `Dr. ${rx.doctor?.name || "Doctor"}`
                                : "Uploaded Document"}
                            </div>
                            <div className="small text-muted">
                              {new Date(rx.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-pill px-3 fw-medium border text-primary"
                          onClick={() => navigate("/prescriptions")}
                        >
                          View
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 bg-light rounded-4 border-dashed">
                  <Pill size={28} className="mb-2 text-muted opacity-50" />
                  <p className="text-dark fw-medium mb-0 small">
                    No active prescriptions.
                  </p>
                </div>
              )}
            </div>
          </Col>

          {/* --- RIGHT COLUMN --- */}
          <Col lg={4} className="d-flex flex-column gap-4">
            {/* NEXT APPOINTMENT TICKET (RICH IMAGE) */}
            <div className="bg-white rounded-4 shadow-sm border-0 p-4 position-relative overflow-hidden">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0 fs-5">Next Visit</h5>
                <Badge bg="success" className="rounded-pill">
                  Upcoming
                </Badge>
              </div>

              {upcomingAppt ? (
                <div className="bg-light rounded-4 p-3 border border-light-subtle text-center hover-lift transition-all">
                  <img
                    src={`https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=faces`}
                    alt="Doctor"
                    className="rounded-circle shadow-sm border border-3 border-white mb-3"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=Dr+${upcomingAppt.doctor?.name}&background=007185&color=fff&size=128`;
                    }}
                  />
                  <h6 className="fw-bold text-dark mb-1 fs-5">
                    Dr. {upcomingAppt.doctor?.name}
                  </h6>
                  <p className="text-muted small mb-3">
                    {upcomingAppt.doctor?.speciality}
                  </p>

                  <div className="bg-white rounded-3 p-3 d-flex justify-content-center align-items-center gap-2 mb-3 border shadow-sm">
                    <Calendar size={18} className="text-primary" />
                    <span className="fw-bold text-dark">
                      {new Date(upcomingAppt.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    className="w-100 rounded-pill fw-bold shadow-sm"
                    onClick={() => navigate("/appointments")}
                  >
                    Manage Appointment
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4 bg-light rounded-4 border-dashed">
                  <Calendar size={32} className="mb-3 text-muted opacity-25" />
                  <p className="text-dark fw-medium mb-3 small">
                    No upcoming visits scheduled.
                  </p>
                  <Button
                    variant="outline-dark"
                    size="sm"
                    className="rounded-pill px-4 fw-medium"
                    onClick={() => navigate("/appointments")}
                  >
                    Book a Doctor
                  </Button>
                </div>
              )}
            </div>

            {/* UPLOAD PRESCRIPTION ACTION CARD (RICH BACKGROUND) */}
            <div
              className="rounded-4 shadow-sm border-0 p-4 position-relative overflow-hidden hover-lift transition-all cursor-pointer text-white"
              onClick={() => setShowUploadModal(true)}
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1587854692152-cbe668df971c?q=80&w=600&auto=format&fit=crop')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="position-absolute w-100 h-100 top-0 start-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,113,133,0.9) 0%, rgba(2,132,199,0.8) 100%)",
                }}
              ></div>
              <div className="position-relative z-2 text-center py-2">
                <div className="bg-white bg-opacity-25 d-inline-flex p-3 rounded-circle mb-3 backdrop-blur shadow-sm">
                  <Upload size={28} className="text-white" />
                </div>
                <h5 className="fw-bold mb-2">Upload Prescription</h5>
                <p className="small text-white text-opacity-75 mb-3 px-2">
                  Snap a photo of your physical prescription to get medicines
                  delivered.
                </p>
                <button className="btn btn-light text-primary fw-bold rounded-pill shadow-sm px-4 py-2">
                  Select Image
                </button>
              </div>
            </div>

            {/* SUPPORT INBOX WIDGET */}
            <div
              id="support-tickets-section"
              className="bg-white rounded-4 shadow-sm border-0 d-flex flex-column transition-all"
              style={{ height: "350px" }}
            >
              <div className="p-4 pb-2 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-dark mb-0 fs-5 d-flex align-items-center gap-2">
                  Support
                </h5>
                <Badge
                  bg="light"
                  text="muted"
                  className="rounded-pill fw-normal border"
                >
                  Auto-clears 48h
                </Badge>
              </div>

              <div className="px-3 pb-3 overflow-auto flex-grow-1 custom-scrollbar">
                {myMessages.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {myMessages.slice(0, 4).map((msg) => (
                      <div
                        key={msg._id}
                        className={`p-3 rounded-4 border cursor-pointer hover-card transition-all ${msg.adminReply && !msg.isReplyRead ? "bg-primary bg-opacity-10 border-primary" : "bg-white border-light-subtle"}`}
                        onClick={() => handleReadMessage(msg)}
                      >
                        <div className="d-flex justify-content-between mb-1">
                          <span
                            className="fw-bold text-dark text-truncate"
                            style={{ fontSize: "0.85rem", maxWidth: "70%" }}
                          >
                            {msg.text}
                          </span>
                          {msg.adminReply && !msg.isReplyRead ? (
                            <span
                              className="badge bg-danger rounded-pill"
                              style={{ fontSize: "0.6rem" }}
                            >
                              NEW
                            </span>
                          ) : null}
                        </div>
                        <div className="small text-muted d-flex justify-content-between">
                          <span style={{ fontSize: "0.7rem" }}>
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                          <ChevronRight
                            size={16}
                            className={
                              msg.adminReply && !msg.isReplyRead
                                ? "text-primary"
                                : "text-muted"
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center p-3">
                    <div className="bg-light p-3 rounded-circle mb-3">
                      <MessageSquare
                        size={28}
                        className="text-muted opacity-50"
                      />
                    </div>
                    <p className="fw-bold text-dark mb-1">How can we help?</p>
                    <p className="small text-muted mb-0">
                      Reach out via the contact page if you have questions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* MODALS */}

      {/* ORDER MODAL */}
      <Modal
        show={showOrderModal}
        onHide={() => setShowOrderModal(false)}
        centered
        size="lg"
        className="animate-fade-in"
      >
        {selectedOrder && (
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <Modal.Header className="bg-white border-bottom p-4">
              <div className="w-100 text-center position-relative">
                <Modal.Title className="fw-bold text-dark fs-4 mb-1">
                  Order Summary
                </Modal.Title>
                <div className="small text-muted fw-medium font-monospace bg-light d-inline-block px-3 py-1 rounded-pill border">
                  REF: #
                  {selectedOrder.orderNumber ||
                    selectedOrder._id
                      .substring(selectedOrder._id.length - 6)
                      .toUpperCase()}
                </div>
                <button
                  type="button"
                  className="btn-close shadow-none position-absolute end-0 top-0"
                  onClick={() => setShowOrderModal(false)}
                ></button>
              </div>
            </Modal.Header>

            <Modal.Body className="p-4 p-md-5 bg-light bg-opacity-50">
              <Row className="g-4 mb-4">
                <Col md={6}>
                  <div className="p-4 bg-white rounded-4 shadow-sm border border-light-subtle h-100">
                    <h6 className="fw-bold small text-uppercase text-primary mb-3 d-flex align-items-center gap-2">
                      <MapPin size={16} /> Delivery Info
                    </h6>
                    <div className="fw-bold text-dark fs-6 mb-2">
                      {selectedOrder.user?.name || user?.name || "Customer"}
                    </div>
                    <div className="small text-muted lh-lg">
                      {selectedOrder.shippingAddress?.address}
                      <br />
                      {selectedOrder.shippingAddress?.city},{" "}
                      {selectedOrder.shippingAddress?.country}
                      <br />
                      ZIP: {selectedOrder.shippingAddress?.postalCode}
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="p-4 bg-white rounded-4 shadow-sm border border-light-subtle h-100">
                    <h6 className="fw-bold small text-uppercase text-primary mb-3 d-flex align-items-center gap-2">
                      <Clock size={16} /> Status
                    </h6>
                    <div className="d-flex justify-content-between mb-3 small border-bottom pb-2">
                      <span className="text-muted">Date:</span>
                      <span className="fw-bold text-dark">
                        {new Date(selectedOrder.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 small border-bottom pb-2">
                      <span className="text-muted">Payment:</span>
                      <Badge
                        bg={selectedOrder.isPaid ? "success" : "warning"}
                        text={selectedOrder.isPaid ? "light" : "dark"}
                        className="rounded-pill px-2"
                      >
                        {selectedOrder.isPaid ? "PAID" : "PENDING"}
                      </Badge>
                    </div>
                    <div className="d-flex justify-content-between small">
                      <span className="text-muted">Fulfillment:</span>
                      <span className="fw-bold text-primary">
                        {selectedOrder.orderStatus ||
                          selectedOrder.status ||
                          "Processing"}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>

              <h6 className="fw-bold text-dark mb-3 ps-1">Items</h6>
              <div className="bg-white rounded-4 shadow-sm border border-light-subtle overflow-hidden mb-4">
                <Table responsive borderless className="mb-0 align-middle">
                  <thead className="bg-light border-bottom">
                    <tr>
                      <th className="py-3 px-4 text-muted small fw-bold text-uppercase">
                        Item
                      </th>
                      <th className="text-center py-3 text-muted small fw-bold text-uppercase">
                        Qty
                      </th>
                      <th className="text-end py-3 text-muted small fw-bold text-uppercase">
                        Price
                      </th>
                      <th className="text-end py-3 px-4 text-muted small fw-bold text-uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems?.map((item, index) => (
                      <tr
                        key={index}
                        className="border-bottom border-light-subtle"
                      >
                        <td className="py-3 px-4 fw-bold text-dark">
                          {item.name}
                        </td>
                        <td className="text-center py-3">{item.qty}</td>
                        <td className="text-end py-3 text-muted">
                          Rs. {Number(item.price).toFixed(2)}
                        </td>
                        <td className="text-end py-3 px-4 fw-bold text-dark">
                          Rs. {(item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex justify-content-end mb-4">
                <div
                  className="bg-white p-4 rounded-4 shadow-sm border border-light-subtle"
                  style={{ width: "300px" }}
                >
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>Subtotal:</span>
                    <span className="text-dark fw-bold">
                      Rs. {Number(calculatedSubtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>Shipping:</span>
                    <span className="text-dark fw-bold">
                      {selectedOrder.shippingPrice === 0
                        ? "FREE"
                        : `Rs. ${Number(selectedOrder.shippingPrice).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mb-3 border-bottom pb-3">
                    <span>Tax (13%):</span>
                    <span className="text-dark fw-bold">
                      Rs. {Number(selectedOrder.taxPrice || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold fs-5 text-dark">
                    <span>Total:</span>
                    <span className="text-primary">
                      Rs.{" "}
                      {selectedOrder.totalPrice?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {selectedOrder.prescriptionImage && (
                <div className="bg-white p-4 rounded-4 shadow-sm border border-light-subtle text-center">
                  <h6 className="fw-bold mb-3 d-flex align-items-center justify-content-center gap-2">
                    <ImageIcon size={18} className="text-primary" /> Attached
                    Prescription
                  </h6>
                  <Badge
                    bg={
                      selectedOrder.prescriptionStatus === "Approved"
                        ? "success"
                        : selectedOrder.prescriptionStatus === "Rejected"
                          ? "danger"
                          : "warning"
                    }
                    text={
                      selectedOrder.prescriptionStatus ===
                      "Pending Verification"
                        ? "dark"
                        : "light"
                    }
                    className="rounded-pill px-3 py-2 mb-3"
                  >
                    Status: {selectedOrder.prescriptionStatus}
                  </Badge>
                  <div>
                    <a
                      href={
                        selectedOrder.prescriptionImage.startsWith("http")
                          ? selectedOrder.prescriptionImage
                          : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${selectedOrder.prescriptionImage}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={
                          selectedOrder.prescriptionImage.startsWith("http")
                            ? selectedOrder.prescriptionImage
                            : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${selectedOrder.prescriptionImage}`
                        }
                        alt="Rx"
                        className="img-fluid rounded-3 border shadow-sm hover-scale transition-all"
                        style={{ maxHeight: "200px", objectFit: "contain" }}
                      />
                    </a>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="bg-white border-top-0 p-4 d-flex justify-content-between pt-0">
              <Link
                to={`/payment-success?orderId=${selectedOrder._id}`}
                className="btn btn-light rounded-pill px-4 fw-medium text-dark border"
              >
                Full Receipt
              </Link>
              <Button
                variant="primary"
                className="rounded-pill px-5 fw-bold shadow-sm"
                onClick={() => setShowOrderModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </div>
        )}
      </Modal>

      {/* CANCEL MODAL */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        className="animate-fade-in"
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden text-center p-4 pb-2">
          <div className="mx-auto bg-danger bg-opacity-10 text-danger p-3 rounded-circle mb-3 d-inline-block">
            <XCircle size={32} />
          </div>
          <h5 className="fw-bold mb-2 text-dark">Cancel Order?</h5>
          <p className="text-muted small mb-4">
            This action cannot be undone. You will need to checkout again.
          </p>
          <div className="d-flex justify-content-center gap-3 mb-3">
            <Button
              variant="light"
              className="rounded-pill px-4 fw-medium border"
              onClick={() => setShowDeleteModal(false)}
            >
              Keep Order
            </Button>
            <Button
              variant="danger"
              className="rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
              disabled={deleteLoading}
              onClick={handleDeleteOrder}
            >
              {deleteLoading ? (
                <Loader2 size={16} className="spin-animation" />
              ) : (
                <Trash2 size={16} />
              )}{" "}
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* UPLOAD MODAL */}
      <Modal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        centered
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div
            className="modal-header text-white border-0 p-4 pb-3 position-relative"
            style={{
              background: "linear-gradient(135deg, #007185 0%, #00A5C4 100%)",
            }}
          >
            <div className="position-relative z-2">
              <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                <Upload size={20} /> Upload Prescription
              </h5>
              <p className="small text-white text-opacity-75 mb-0 mt-1">
                Submit your Rx for verified dispensing.
              </p>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white shadow-none align-self-start position-relative z-2"
              onClick={() => setShowUploadModal(false)}
            ></button>
          </div>
          <Modal.Body className="p-4 bg-white">
            <Form onSubmit={handleUploadPrescription}>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-dark mb-2">
                  Select Image or PDF File
                </Form.Label>
                <Form.Control
                  type="file"
                  className="shadow-none rounded-3 border bg-light p-2 file-upload-custom"
                  onChange={handlePrescriptionChange}
                  accept="image/*,application/pdf"
                />
                {prescriptionPreview && (
                  <div className="mt-3 text-center p-2 rounded-4 bg-light shadow-sm-inner border">
                    <img
                      src={prescriptionPreview}
                      alt="Preview"
                      className="rounded-3 img-fluid"
                      style={{ maxHeight: "160px" }}
                    />
                  </div>
                )}
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-dark mb-2">
                  Instructions (Optional)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className="shadow-none rounded-4 border bg-light custom-input"
                  style={{ resize: "none" }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g. I only need a 10 day supply..."
                />
              </Form.Group>
              <Button
                type="submit"
                variant="primary"
                className="w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift"
                disabled={uploadLoading || !prescriptionFile}
              >
                {uploadLoading ? (
                  <>
                    <Loader2 size={18} className="spin-animation" />{" "}
                    Uploading...
                  </>
                ) : (
                  "Submit Prescription"
                )}
              </Button>
            </Form>
          </Modal.Body>
        </div>
      </Modal>

      {/* SUPPORT TICKET MODAL */}
      <Modal
        show={selectedMessage !== null}
        onHide={() => setSelectedMessage(null)}
        centered
        size="lg"
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-white border-bottom p-4">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <MessageSquare size={20} className="text-primary" /> Support
              Conversation
            </h5>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={() => setSelectedMessage(null)}
            ></button>
          </div>
          <Modal.Body className="p-0 bg-light bg-opacity-50">
            <div
              className="p-4"
              style={{ maxHeight: "50vh", overflowY: "auto" }}
            >
              {/* Customer Bubble */}
              <div className="d-flex flex-column align-items-end mb-4">
                <span className="small text-muted fw-bold text-uppercase tracking-wider mb-1 me-2">
                  You
                </span>
                <div
                  className="bg-primary text-white p-3 rounded-4 shadow-sm"
                  style={{ borderBottomRightRadius: "4px", maxWidth: "80%" }}
                >
                  {selectedMessage?.text}
                </div>
                <div
                  className="small text-muted mt-1 me-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  {selectedMessage
                    ? new Date(selectedMessage.createdAt).toLocaleString()
                    : ""}
                </div>
              </div>

              {/* Admin Bubble */}
              <div className="d-flex flex-column align-items-start mb-2">
                <span className="small text-primary fw-bold text-uppercase tracking-wider mb-1 ms-2">
                  Support Team
                </span>
                {selectedMessage?.adminReply ? (
                  <div
                    className="bg-white border border-light-subtle text-dark p-3 rounded-4 shadow-sm"
                    style={{ borderBottomLeftRadius: "4px", maxWidth: "80%" }}
                  >
                    {selectedMessage.adminReply}
                  </div>
                ) : (
                  <div
                    className="bg-white border-dashed text-muted p-3 rounded-4 small d-flex align-items-center gap-2"
                    style={{ borderBottomLeftRadius: "4px" }}
                  >
                    <Loader2 size={14} className="spin-animation" /> Awaiting
                    response...
                  </div>
                )}
              </div>
            </div>

            {/* CUSTOMER REPLY BOX */}
            <div className="bg-white border-top p-4 d-flex gap-2">
              <Form.Control
                as="textarea"
                rows={1}
                className="shadow-none rounded-pill border-light-subtle bg-light px-4 custom-input flex-grow-1"
                style={{ resize: "none", paddingTop: "10px" }}
                placeholder="Type your reply here..."
                value={customerReplyText}
                onChange={(e) => setCustomerReplyText(e.target.value)}
              />
              <Button
                variant="primary"
                className="rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 hover-lift shadow-sm"
                style={{ width: "45px", height: "45px" }}
                onClick={handleSendCustomerReply}
                disabled={replyLoading || !customerReplyText.trim()}
              >
                {replyLoading ? (
                  <Loader2 size={16} className="spin-animation" />
                ) : (
                  <Send size={16} />
                )}
              </Button>
            </div>
          </Modal.Body>
        </div>
      </Modal>

      <style>{`
        /* Global & Layout */
        .backdrop-blur { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
        .glass-card { background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); }
        .tracking-wider { letter-spacing: 0.05em; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .cursor-pointer { cursor: pointer; }
        .mix-blend-multiply { mix-blend-mode: multiply; }
        
        /* Hover Effects */
        .hover-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(0,0,0,0.1) !important; }
        .hover-scale { transition: transform 0.2s ease; }
        .hover-scale:hover { transform: scale(1.03); }
        .hover-lift { transition: transform 0.2s ease; }
        .hover-lift:hover { transform: translateY(-2px); }
        .hover-underline:hover { text-decoration: underline !important; }
        .hover-bg-primary-light:hover { background-color: #e0f2fe !important; }
        
        .shadow-sm-inner { box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.06); }
        
        /* Borders & Inputs */
        .border-dashed { border: 2px dashed #cbd5e1 !important; }
        .border-dashed-y { border-top: 1px dashed #cbd5e1; border-bottom: 1px dashed #cbd5e1; }
        
        .custom-input { transition: box-shadow 0.2s; }
        .custom-input:focus { border-color: #38bdf8 !important; box-shadow: 0 0 0 4px rgba(56,189,248,0.15) !important; outline: none; }
        .file-upload-custom::file-selector-button { background-color: #fff; border: 1px solid #e2e8f0; border-radius: 50rem; padding: 0.5rem 1rem; margin-right: 1rem; font-weight: 600; color: #0ea5e9; cursor: pointer; transition: background 0.2s; }
        .file-upload-custom::file-selector-button:hover { background-color: #f0f9ff; }

        /* Tables */
        .custom-borderless-table th { background-color: transparent !important; }
        .table-row-hover:hover { background-color: #f8fafc; }

        /* Scrollbars */
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        
        /* Animations */
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); } 70% { transform: scale(1.5); box-shadow: 0 0 0 6px rgba(220, 53, 69, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); } }
        
        .highlight-pulse { animation: highlightPulse 2s ease-out; }
        @keyframes highlightPulse { 0% { box-shadow: 0 0 0 0px rgba(0, 113, 133, 0.4); } 100% { box-shadow: 0 0 0 15px rgba(0, 113, 133, 0); } }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;
