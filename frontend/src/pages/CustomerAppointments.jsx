import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { Form, Modal, Badge, Button, Spinner } from "react-bootstrap";

import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CalendarCheck,
  FileText,
  RotateCcw,
  UserRound,
  MessageCircle,
  Stethoscope,
  GraduationCap,
  Send,
} from "lucide-react";

import BookAppointmentModal from "../components/BookAppointmentModal";

const CustomerAppointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState(null);

  // --- Doctor Details Modal State ---
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  // --- LIVE CHAT MODAL STATE ---
  const [messageTarget, setMessageTarget] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let response;
      try {
        response = await api.get("/appointments/my");
      } catch (err) {
        if (err.response && err.response.status === 404) {
          response = await api.get("/appointments/my-appointments");
        } else {
          throw err;
        }
      }

      let apptList = [];
      if (Array.isArray(response.data)) {
        apptList = response.data;
      } else if (response.data && Array.isArray(response.data.appointments)) {
        apptList = response.data.appointments;
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        apptList = response.data.data;
      }

      const sorted = apptList.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });

      setAppointments(sorted);
    } catch (err) {
      console.error("❌ Failed to load appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Auto-scroll chat to bottom when messages load/update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, showMessageModal]);

  const handleCancel = async (apptId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;
    try {
      setActionLoading(apptId);
      await api.put(`/appointments/${apptId}/status`, { status: "cancelled" });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Cancellation failed");
    } finally {
      setActionLoading(null);
    }
  };

  // OPEN CHAT & FETCH HISTORY
  const openChatModal = async (appt) => {
    setMessageTarget(appt);
    setShowMessageModal(true);
    setChatLoading(true);
    setChatHistory([]); // Clear old messages before opening

    try {
      // Fetch chat history specifically for this appointment
      const res = await api.get(`/messages/appointment/${appt._id}`);
      setChatHistory(res.data.messages || res.data || []);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    } finally {
      setChatLoading(false);
    }
  };

  // SEND CHAT MESSAGE

  const handleSendMessage = async () => {
    if (!messageText.trim() || !messageTarget) return;

    try {
      setSendingMessage(true);

      const payload = {
        receiverId: messageTarget.doctor?._id,
        appointmentId: messageTarget._id,
        text: messageText,
        senderModel: "User",
      };

      const res = await api.post("/messages/appointment", payload);

      // Optimistically add the new message to the chat UI instantly
      const newMsg = res.data || {
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
      alert("Failed to send message. Please try again later.");
    } finally {
      setSendingMessage(false);
    }
  };

  const formatDate = (dateString, dayFallback) => {
    if (!dateString) return dayFallback || "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dayFallback || "N/A";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-warning text-dark border-warning";
      case "confirmed":
        return "bg-success bg-opacity-10 text-success border-success";
      case "completed":
        return "bg-primary bg-opacity-10 text-primary border-primary";
      case "cancelled":
        return "bg-danger bg-opacity-10 text-danger border-danger";
      default:
        return "bg-secondary bg-opacity-10 text-secondary border-secondary";
    }
  };

  const getDoctorImage = (doctor) => {
    if (doctor?.image && doctor.image !== "none") {
      return doctor.image.startsWith("http")
        ? doctor.image
        : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${doctor.image}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || "Doctor")}&background=eff6ff&color=2563eb&size=150&font-size=0.33`;
  };

  return (
    <div
      className="medical-dashboard-bg min-vh-100 py-4 px-3 px-md-4 px-xl-5 animate-fade-in"
      style={{ backgroundColor: "#f8fafc" }}
    >
      {/* --- HEADER SECTION --- */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 border-bottom border-light-subtle pb-3">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-white shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center border-light-subtle text-secondary hover-lift"
            onClick={() => navigate("/customer/dashboard")}
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="fw-black mb-0 text-dark tracking-tight d-flex align-items-center gap-2">
              <CalendarCheck className="text-primary" size={28} /> Your
              Appointments
            </h3>
          </div>
        </div>
        <button
          className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift d-flex align-items-center gap-2"
          onClick={() => {
            setPreselectedDoctorId(null);
            setShowModal(true);
          }}
        >
          <Plus size={18} /> Book New Visit
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {loading ? (
            <div className="d-flex flex-column justify-content-center align-items-center py-5 my-4 bg-white rounded-4 border border-light-subtle">
              <Loader2 className="spin-animation text-primary mb-3" size={40} />
              <span className="text-muted fw-semibold">
                Loading your visits...
              </span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-5 my-4 bg-white rounded-4 border border-light-subtle shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop"
                alt="No appointments"
                className="mb-4 rounded-circle object-fit-cover shadow-sm"
                style={{ width: "150px", height: "150px" }}
              />
              <h4 className="fw-black text-dark">No Appointments Yet</h4>
              <p className="text-muted mb-4">
                You haven't scheduled any consultations. Book your first visit
                today.
              </p>
              <button
                className="btn btn-primary rounded-pill px-5 py-2 fw-bold hover-lift shadow-sm"
                onClick={() => {
                  setPreselectedDoctorId(null);
                  setShowModal(true);
                }}
              >
                Book Now
              </button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-4">
              {appointments.map((appt) => {
                const isConfirmed = appt.status?.toLowerCase() === "confirmed";

                return (
                  <div
                    key={appt._id}
                    className="card border-light-subtle shadow-sm rounded-4 overflow-hidden bg-white transition-all"
                  >
                    {/* Card Header */}
                    <div className="bg-light bg-opacity-50 border-bottom border-light-subtle px-4 py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
                      <div className="d-flex gap-4">
                        <div>
                          <span
                            className="d-block text-muted small text-uppercase fw-bold tracking-wider mb-1"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Appointment Date
                          </span>
                          <span className="fw-bold text-dark">
                            {new Date(appt.date).toString() !== "Invalid Date"
                              ? formatDate(appt.date)
                              : appt.day || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span
                            className="d-block text-muted small text-uppercase fw-bold tracking-wider mb-1"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Time
                          </span>
                          <span className="fw-bold text-dark d-flex align-items-center gap-1">
                            <Clock size={14} className="text-primary" />{" "}
                            {appt.timeSlot || appt.time}
                          </span>
                        </div>
                      </div>
                      <div className="text-md-end">
                        <span
                          className="d-block text-muted small text-uppercase fw-bold tracking-wider mb-1"
                          style={{ fontSize: "0.7rem" }}
                        >
                          Booking Ref #
                        </span>
                        <span className="fw-bold font-monospace text-secondary">
                          {appt.bookingReference ||
                            appt._id?.slice(-6).toUpperCase() ||
                            "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 d-flex flex-column flex-md-row gap-4 align-items-md-start">
                      <div className="flex-shrink-0 text-center">
                        <img
                          src={getDoctorImage(appt.doctor)}
                          alt="Doctor"
                          className="rounded-3 border border-light-subtle shadow-sm object-fit-cover cursor-pointer"
                          style={{ width: "100px", height: "100px" }}
                          onClick={() => {
                            setSelectedDoctor(appt.doctor);
                            setShowDoctorModal(true);
                          }}
                        />
                      </div>

                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <h5
                            className="fw-bolder text-dark mb-0 cursor-pointer hover-text-primary"
                            onClick={() => {
                              setSelectedDoctor(appt.doctor);
                              setShowDoctorModal(true);
                            }}
                          >
                            Dr. {appt.doctor?.name || "Unknown Doctor"}
                          </h5>
                          <span
                            className={`badge border ${getStatusBadge(appt.status)}`}
                          >
                            {appt.status?.toUpperCase() || "UNKNOWN"}
                          </span>
                        </div>
                        <p className="text-primary fw-bold small mb-2 d-flex align-items-center gap-1">
                          <UserRound size={14} />{" "}
                          {appt.doctor?.speciality || "General Physician"}
                        </p>
                        <div className="text-muted small d-flex flex-column gap-1 mb-3">
                          <span className="d-flex align-items-center gap-2">
                            <MapPin size={14} /> City Care Clinic, Kathmandu
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        className="d-flex flex-column gap-2 border-start-md border-light-subtle ps-md-4"
                        style={{ minWidth: "180px" }}
                      >
                        {/* 💬 CHAT BUTTON */}
                        {isConfirmed && (
                          <Button
                            variant="primary"
                            className="w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift animate-fade-in"
                            onClick={() => openChatModal(appt)}
                          >
                            <MessageCircle size={16} /> Message Doctor
                          </Button>
                        )}

                        {["pending", "confirmed"].includes(
                          appt.status?.toLowerCase(),
                        ) ? (
                          <Button
                            variant="outline-primary"
                            className="w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift"
                            onClick={() => {
                              setPreselectedDoctorId(appt.doctor?._id);
                              setShowModal(true);
                            }}
                          >
                            <Calendar size={16} /> Reschedule
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            className="w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift"
                            onClick={() => {
                              setPreselectedDoctorId(appt.doctor?._id);
                              setShowModal(true);
                            }}
                          >
                            <RotateCcw size={16} /> Book Again
                          </Button>
                        )}

                        <Button
                          variant="light"
                          className="border-light-subtle w-100 rounded-pill fw-bold text-dark shadow-sm d-flex align-items-center justify-content-center gap-2 hover-bg-light"
                          onClick={() => {
                            setSelectedDoctor(appt.doctor);
                            setShowDoctorModal(true);
                          }}
                        >
                          <FileText size={16} className="text-muted" /> View
                          Details
                        </Button>

                        {["pending", "confirmed"].includes(
                          appt.status?.toLowerCase(),
                        ) && (
                          <button
                            className="btn btn-link text-danger text-decoration-none fw-bold small mt-1 p-0"
                            onClick={() => handleCancel(appt._id)}
                            disabled={actionLoading === appt._id}
                          >
                            {actionLoading === appt._id ? (
                              <Loader2
                                size={14}
                                className="spin-animation me-1"
                              />
                            ) : (
                              "Cancel Appointment"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden position-relative shadow-hover">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"
              alt="Hospital"
              className="w-100 object-fit-cover"
              style={{ height: "140px" }}
            />
            <div className="p-4 bg-white">
              <h5 className="fw-black mb-1 text-dark">Need immediate care?</h5>
              <p className="text-muted small mb-3">
                Check real-time availability and secure your slot with our top
                specialists.
              </p>
              <Button
                variant="primary"
                className="w-100 rounded-pill fw-bold shadow-sm hover-lift d-flex align-items-center justify-content-center gap-2 py-2"
                onClick={() => {
                  setPreselectedDoctorId(null);
                  setShowModal(true);
                }}
              >
                <Plus size={18} /> Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BookAppointmentModal
        key={showModal ? "open" : "closed"}
        show={showModal}
        preselectedDoctorId={preselectedDoctorId}
        onClose={() => {
          setShowModal(false);
          setPreselectedDoctorId(null);
        }}
        onSuccess={() => {
          setShowModal(false);
          fetchAppointments();
        }}
      />

      {/* ====================================================================== */}
      {/* DOCTOR DETAILS MODAL */}
      {/* ====================================================================== */}
      <Modal
        show={showDoctorModal}
        onHide={() => setShowDoctorModal(false)}
        centered
        contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
      >
        {selectedDoctor && (
          <>
            <div className="bg-primary pt-5 pb-4 px-4 position-relative text-center">
              <button
                type="button"
                className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                onClick={() => setShowDoctorModal(false)}
              ></button>
              <img
                src={getDoctorImage(selectedDoctor)}
                alt={selectedDoctor.name}
                className="rounded-circle border border-4 border-white shadow-sm object-fit-cover bg-white mb-3"
                style={{ width: "120px", height: "120px" }}
              />
              <h4 className="fw-black text-white mb-1">
                Dr. {selectedDoctor.name}
              </h4>
              <Badge
                bg="white"
                text="primary"
                className="fw-bold rounded-pill px-3 py-2 shadow-sm"
              >
                {selectedDoctor.speciality || "General Physician"}
              </Badge>
            </div>
            <Modal.Body className="p-4 bg-white">
              <div className="d-flex flex-column gap-3">
                <div className="bg-light rounded-3 p-3 border border-light-subtle d-flex align-items-center gap-3">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark small text-uppercase tracking-wider">
                      Qualifications
                    </h6>
                    <span className="text-muted fw-medium">
                      {selectedDoctor.qualification || "MD, MBBS"}
                    </span>
                  </div>
                </div>
                <div className="bg-light rounded-3 p-3 border border-light-subtle d-flex align-items-center gap-3">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark small text-uppercase tracking-wider">
                      Experience
                    </h6>
                    <span className="text-muted fw-medium">
                      {selectedDoctor.experience
                        ? `${selectedDoctor.experience} Years`
                        : "10+ Years"}
                    </span>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>

      {/* ====================================================================== */}
      {/* LIVE CHAT HISTORY MODAL */}
      {/* ====================================================================== */}
      <Modal
        show={showMessageModal}
        onHide={() => setShowMessageModal(false)}
        centered
        contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-primary text-white p-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <img
              src={getDoctorImage(messageTarget?.doctor)}
              alt="doctor"
              className="rounded-circle object-fit-cover bg-white p-1"
              style={{ width: "40px", height: "40px" }}
            />
            <div className="lh-1">
              <h6 className="fw-bold mb-1">
                Dr. {messageTarget?.doctor?.name}
              </h6>
              <small className="text-white-50" style={{ fontSize: "0.75rem" }}>
                Consultation Chat
              </small>
            </div>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white shadow-none"
            onClick={() => setShowMessageModal(false)}
          ></button>
        </div>

        {/* Chat History Body */}
        <div
          className="p-3 bg-light d-flex flex-column custom-scrollbar"
          style={{ height: "400px", overflowY: "auto" }}
          ref={chatScrollRef}
        >
          {chatLoading ? (
            <div className="m-auto text-center">
              <Spinner
                animation="border"
                size="sm"
                className="text-primary mb-2"
              />
              <p className="small text-muted mb-0">Loading messages...</p>
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="m-auto text-center text-muted opacity-50">
              <MessageCircle size={32} className="mb-2" />
              <p className="small fw-medium mb-0">
                No messages yet.
                <br />
                Say hello to your doctor!
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {chatHistory.map((msg) => {
                // Determine if the message was sent by the patient
                const isMe =
                  msg.senderModel === "User" || msg.sender === user?._id;

                return (
                  <div
                    key={msg._id}
                    className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"}`}
                  >
                    <div
                      className={`p-3 rounded-4 shadow-sm ${isMe ? "bg-primary text-white" : "bg-white text-dark border border-light-subtle"}`}
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

        {/* Chat Input Footer */}
        <div className="p-3 bg-white border-top border-light-subtle">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="d-flex gap-2 align-items-end"
          >
            <Form.Control
              as="textarea"
              rows={1}
              className="border-light-subtle bg-light shadow-none focus-ring-primary rounded-pill py-2 px-3"
              style={{ resize: "none", overflow: "hidden", minHeight: "44px" }}
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
              className="rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0"
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
      </Modal>

      <style>{`
        .border-start-md { border-left: none; }
        @media (min-width: 768px) { .border-start-md { border-left: 1px solid #e2e8f0; } }
        .fw-black { font-weight: 900; }
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .hover-text-primary:hover { color: #2563eb !important; }
        .tracking-wider { letter-spacing: 0.05em; }
        .btn-white { background-color: #ffffff; }
        .spin-animation { animation: spin 1s linear infinite; }
        .transition-all { transition: all 0.3s ease; }
        .cursor-pointer { cursor: pointer; }
        .focus-ring-primary:focus { border-color: #2563eb; box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.25); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default CustomerAppointments;
