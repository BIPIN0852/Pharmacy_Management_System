import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Badge,
  Button,
  Form,
  InputGroup,
  Modal,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import {
  Users,
  Mail,
  Phone,
  Calendar,
  Loader2,
  AlertCircle,
  Search,
  Grid,
  List,
  MapPin,
  FileText,
  MessageSquare,
  Activity,
  Send,
  XCircle,
  User as UserIcon,
  Droplet,
} from "lucide-react";

const DoctorPatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI States
  const [viewMode, setViewMode] = useState("table"); // 'grid' or 'table'
  const [searchQuery, setSearchQuery] = useState("");

  // --- Modal States ---
  // History Modal
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Chat Modal
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageTarget, setMessageTarget] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/doctor/patients");
        setPatients(res.data.patients || []);
      } catch (err) {
        setError("Failed to load your patient list.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, showMessageModal]);

  // Search Filter Logic
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone?.includes(searchQuery),
  );

  const getPatientInitials = (name) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // --- Action Handlers ---
  const handleViewHistory = (patient) => {
    setSelectedPatient(patient);
    setShowHistoryModal(true);
  };

  const handleOpenChat = (patient) => {
    setMessageTarget(patient);
    setShowMessageModal(true);
    setChatHistory([]); // Clear previous chat context
    // Optionally: Fetch previous chat history with this specific patient here if your backend supports it
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!messageText.trim() || !messageTarget) return;

    try {
      setSendingMessage(true);

      const payload = {
        receiverId: messageTarget.userId || messageTarget._id,
        text: messageText,
        senderModel: "Doctor",
      };

      // Depending on your backend, this sends a direct message
      await api.post("/messages", payload);

      // Optimistically add message to UI
      const newMsg = {
        _id: Date.now().toString(),
        sender: user?._id,
        senderModel: "Doctor",
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

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <Loader2 className="spin-animation text-primary" size={48} />
      </div>
    );

  return (
    <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
      {/* HEADER & STATS */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-info">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle shadow-sm">
            <Users size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="fw-black mb-1 text-dark tracking-tight">
              My Patients
            </h3>
            <p className="text-muted fw-medium mb-0 small">
              Total Unique Patients:{" "}
              <span className="fw-bold text-info">{patients.length}</span>
            </p>
          </div>
        </div>

        {/* CONTROLS: Search & View Toggle */}
        <div className="d-flex flex-column flex-sm-row gap-2 align-items-sm-center">
          <InputGroup className="shadow-sm" style={{ width: "250px" }}>
            <InputGroup.Text className="bg-white border-end-0 text-muted">
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search patients..."
              className="border-start-0 bg-white shadow-none focus-ring-info"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <div className="btn-group shadow-sm bg-white p-1 rounded-3 border border-light-subtle">
            <button
              className={`btn btn-sm rounded-2 d-flex align-items-center gap-1 ${viewMode === "table" ? "btn-info text-white fw-bold" : "btn-light text-muted"}`}
              onClick={() => setViewMode("table")}
            >
              <List size={16} /> Table
            </button>
            <button
              className={`btn btn-sm rounded-2 d-flex align-items-center gap-1 ${viewMode === "grid" ? "btn-info text-white fw-bold" : "btn-light text-muted"}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={16} /> Grid
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger fw-bold shadow-sm rounded-4 border-0 d-flex align-items-center">
          <AlertCircle size={20} className="me-2" />
          {error}
        </div>
      )}

      {filteredPatients.length === 0 ? (
        <div className="bg-white text-center py-5 rounded-4 shadow-sm border border-light-subtle">
          <Users size={48} className="mb-3 text-muted opacity-25" />
          <h5 className="fw-bold text-dark">No Patients Found</h5>
          <p className="text-muted small">
            We couldn't find any patients matching your search criteria.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* ========================================== */
        /* GRID VIEW LAYOUT                           */
        /* ========================================== */
        <div className="row g-4">
          {filteredPatients.map((patient, index) => (
            <div key={index} className="col-md-6 col-xl-4 col-xxl-3">
              <div className="card border-light-subtle shadow-sm rounded-4 h-100 hover-lift transition-all overflow-hidden bg-white">
                <div className="card-body p-0">
                  <div className="p-4 border-bottom border-light-subtle">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                        style={{
                          width: "55px",
                          height: "55px",
                          fontSize: "1.2rem",
                        }}
                      >
                        {getPatientInitials(patient.name)}
                      </div>
                      <div>
                        <h5
                          className="fw-bold mb-0 text-dark hover-text-primary cursor-pointer transition-all"
                          onClick={() => handleViewHistory(patient)}
                        >
                          {patient.name}
                        </h5>
                        <div className="text-muted small mt-1 fw-medium">
                          {patient.gender ? `${patient.gender}` : "Patient"}{" "}
                          {patient.age ? `• ${patient.age} yrs` : ""}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column gap-2 small">
                      <span className="text-muted d-flex align-items-center gap-2">
                        <Mail size={14} className="text-primary" />{" "}
                        <span className="text-truncate">
                          {patient.email || "No Email"}
                        </span>
                      </span>
                      <span className="text-muted d-flex align-items-center gap-2">
                        <Phone size={14} className="text-success" />{" "}
                        {patient.phone || "No Phone"}
                      </span>
                      <span className="text-muted d-flex align-items-start gap-2">
                        <MapPin
                          size={14}
                          className="text-danger mt-1 flex-shrink-0"
                        />
                        <span
                          className="text-truncate"
                          style={{ maxWidth: "200px" }}
                        >
                          {patient.address || "Address not provided"}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-light d-flex justify-content-between align-items-center border-bottom border-light-subtle">
                    <div>
                      <span
                        className="d-block small text-muted fw-bold text-uppercase"
                        style={{ fontSize: "0.65rem" }}
                      >
                        Last Visit
                      </span>
                      <span className="small fw-bold text-dark d-flex align-items-center gap-1">
                        <Calendar size={12} className="text-info" />
                        {patient.lastVisit
                          ? new Date(patient.lastVisit).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="text-end">
                      <span
                        className="d-block small text-muted fw-bold text-uppercase"
                        style={{ fontSize: "0.65rem" }}
                      >
                        Status
                      </span>
                      <Badge
                        bg={
                          patient.status === "Completed" ? "success" : "warning"
                        }
                        text={patient.status === "Completed" ? "light" : "dark"}
                        className="rounded-1"
                      >
                        {patient.status || "Unknown"}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3 d-flex gap-2 bg-white">
                    <Button
                      variant="light"
                      size="sm"
                      className="w-100 fw-bold border shadow-sm d-flex align-items-center justify-content-center gap-1 text-dark hover-bg-light"
                      onClick={() => handleViewHistory(patient)}
                    >
                      <FileText size={14} className="text-primary" /> History
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-100 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1"
                      onClick={() => handleOpenChat(patient)}
                    >
                      <MessageSquare size={14} /> Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ========================================== */
        /* TABLE VIEW LAYOUT                          */
        /* ========================================== */
        <div className="card border-light-subtle shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive custom-scrollbar">
            <table className="table table-hover align-middle mb-0 custom-saas-table">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-uppercase small fw-bold text-muted tracking-wider">
                    Patient Name
                  </th>
                  <th className="py-3 text-uppercase small fw-bold text-muted tracking-wider">
                    Contact Info
                  </th>
                  <th className="py-3 text-uppercase small fw-bold text-muted tracking-wider">
                    Demographics
                  </th>
                  <th className="py-3 text-uppercase small fw-bold text-muted tracking-wider">
                    Last Visit
                  </th>
                  <th className="pe-4 py-3 text-end text-uppercase small fw-bold text-muted tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr
                    key={index}
                    className="transition-all hover-bg-light border-bottom border-light-subtle"
                  >
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "0.9rem",
                          }}
                        >
                          {getPatientInitials(patient.name)}
                        </div>
                        <div>
                          <div
                            className="fw-bolder text-dark mb-0 hover-text-primary cursor-pointer transition-all"
                            onClick={() => handleViewHistory(patient)}
                          >
                            {patient.name}
                          </div>
                          <Badge
                            bg="secondary"
                            className="fw-medium mt-1"
                            style={{ fontSize: "0.65rem" }}
                          >
                            ID:{" "}
                            {patient._id
                              ? patient._id.slice(-6).toUpperCase()
                              : "N/A"}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small text-dark mb-1 d-flex align-items-center gap-2">
                        <Mail size={12} className="text-primary" />{" "}
                        {patient.email || "N/A"}
                      </div>
                      <div className="small text-muted d-flex align-items-center gap-2">
                        <Phone size={12} className="text-success" />{" "}
                        {patient.phone || "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="small text-dark fw-medium mb-1">
                        {patient.gender || "Not specified"}{" "}
                        {patient.age ? `• ${patient.age}y` : ""}
                      </div>
                      <div
                        className="small text-muted d-flex align-items-center gap-1 text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        <Activity size={12} className="text-danger" />{" "}
                        {patient.bloodGroup || "Blood Group: N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="small fw-bold text-dark d-flex align-items-center gap-2 mb-1">
                        <Calendar size={14} className="text-info" />
                        {patient.lastVisit
                          ? new Date(patient.lastVisit).toLocaleDateString()
                          : "N/A"}
                      </div>
                      <Badge
                        bg={
                          patient.status === "Completed" ? "success" : "warning"
                        }
                        text={patient.status === "Completed" ? "light" : "dark"}
                        className="rounded-1 fw-medium"
                        style={{ fontSize: "0.65rem" }}
                      >
                        {patient.status || "Unknown"}
                      </Badge>
                    </td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="light"
                          size="sm"
                          className="border shadow-sm rounded-circle p-2 hover-lift text-primary"
                          title="View Medical History"
                          onClick={() => handleViewHistory(patient)}
                        >
                          <FileText size={16} />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="border shadow-sm rounded-circle p-2 hover-lift text-success"
                          title="Message Patient"
                          onClick={() => handleOpenChat(patient)}
                        >
                          <MessageSquare size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* PATIENT HISTORY MODAL */}
      {/* ====================================================================== */}
      <Modal
        show={showHistoryModal}
        onHide={() => setShowHistoryModal(false)}
        centered
        size="lg"
        contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
      >
        {selectedPatient && (
          <>
            <Modal.Header
              className="bg-light border-bottom border-light-subtle p-4"
              closeButton
            >
              <div>
                <Modal.Title className="fw-black text-dark mb-1 d-flex align-items-center gap-2">
                  <UserIcon className="text-primary" /> Patient Details
                </Modal.Title>
                <div className="small text-muted font-monospace">
                  Patient ID: {selectedPatient._id?.toUpperCase() || "N/A"}
                </div>
              </div>
            </Modal.Header>
            <Modal.Body className="p-4 bg-white">
              <Row className="g-4 mb-4">
                {/* Profile Overview */}
                <Col md={6}>
                  <div className="bg-light p-3 rounded-3 border border-light-subtle h-100">
                    <h6 className="fw-bold small text-uppercase text-muted mb-3 d-flex align-items-center gap-2">
                      <UserIcon size={14} /> Profile
                    </h6>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 shadow-sm"
                        style={{ width: "60px", height: "60px" }}
                      >
                        {getPatientInitials(selectedPatient.name)}
                      </div>
                      <div>
                        <h5 className="fw-bold text-dark mb-0">
                          {selectedPatient.name || "Unknown"}
                        </h5>
                        <Badge bg="secondary" className="mt-1 fw-medium">
                          {selectedPatient.gender || "Not Specified"}
                        </Badge>
                      </div>
                    </div>
                    <div className="small text-muted mb-1">
                      <Mail size={14} className="me-2" />{" "}
                      {selectedPatient.email || "No Email"}
                    </div>
                    <div className="small text-muted mb-1">
                      <Phone size={14} className="me-2" />{" "}
                      {selectedPatient.phone || "No Phone"}
                    </div>
                    <div className="small text-muted">
                      <MapPin size={14} className="me-2" />{" "}
                      {selectedPatient.address || "Address not provided"}
                    </div>
                  </div>
                </Col>

                {/* Medical Overview */}
                <Col md={6}>
                  <div className="bg-light p-3 rounded-3 border border-light-subtle h-100">
                    <h6 className="fw-bold small text-uppercase text-muted mb-3 d-flex align-items-center gap-2">
                      <Activity size={14} /> Clinical Overview
                    </h6>
                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-light-subtle small">
                      <span className="text-muted">Age:</span>
                      <span className="fw-bold text-dark">
                        {selectedPatient.age
                          ? `${selectedPatient.age} Years`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-light-subtle small">
                      <span className="text-muted">Blood Group:</span>
                      <span className="fw-bold text-danger d-flex align-items-center gap-1">
                        <Droplet size={14} />{" "}
                        {selectedPatient.bloodGroup || "N/A"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-light-subtle small">
                      <span className="text-muted">Last Visit:</span>
                      <span className="fw-bold text-dark">
                        {selectedPatient.lastVisit
                          ? new Date(
                              selectedPatient.lastVisit,
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between small">
                      <span className="text-muted">Recent Status:</span>
                      <span>{selectedPatient.status || "N/A"}</span>
                    </div>
                  </div>
                </Col>
              </Row>

              <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <FileText size={16} className="text-primary" /> Medical Notes /
                History
              </h6>
              <div className="bg-light p-3 rounded-3 border border-light-subtle text-dark small lh-lg">
                {selectedPatient.notes ||
                  "No historical medical notes found for this patient."}
              </div>
            </Modal.Body>
            <Modal.Footer className="bg-light border-top border-light-subtle p-3 d-flex justify-content-between">
              <Button
                variant="primary"
                className="rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2"
                onClick={() => {
                  setShowHistoryModal(false);
                  handleOpenChat(selectedPatient);
                }}
              >
                <MessageSquare size={16} /> Send Message
              </Button>
              <Button
                variant="secondary"
                className="rounded-pill fw-bold px-4"
                onClick={() => setShowHistoryModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* ====================================================================== */}
      {/* LIVE CHAT/MESSAGE MODAL */}
      {/* ====================================================================== */}
      <Modal
        show={showMessageModal}
        onHide={() => setShowMessageModal(false)}
        centered
        contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
      >
        <Modal.Header className="bg-primary text-white border-0 p-4 pb-3">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2 fs-5">
            <MessageSquare size={20} /> Message Patient
          </Modal.Title>
          <button
            type="button"
            className="btn-close btn-close-white shadow-none"
            onClick={() => setShowMessageModal(false)}
          ></button>
        </Modal.Header>

        <Modal.Body className="p-0 bg-white">
          <div className="p-3 bg-light border-bottom border-light-subtle d-flex align-items-center gap-3">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
              style={{ width: "45px", height: "45px" }}
            >
              {getPatientInitials(messageTarget?.name)}
            </div>
            <div>
              <h6 className="fw-bold text-dark mb-0">{messageTarget?.name}</h6>
              <span className="text-muted small">
                Patient ID: {messageTarget?._id?.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Chat History View (Scrollable) */}
          <div
            className="p-3 bg-light d-flex flex-column custom-scrollbar"
            style={{ height: "350px", overflowY: "auto" }}
            ref={chatScrollRef}
          >
            {chatHistory.length === 0 ? (
              <div className="m-auto text-center text-muted opacity-50">
                <MessageSquare size={32} className="mb-2" />
                <p className="small fw-medium mb-0">
                  No recent messages.
                  <br />
                  Start a conversation!
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {chatHistory.map((msg) => {
                  const isMe =
                    msg.senderModel === "Doctor" || msg.sender === user?._id;
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

          {/* Chat Input */}
          <div className="p-3 bg-white border-top border-light-subtle">
            <Form
              onSubmit={handleSendMessage}
              className="d-flex gap-2 align-items-end"
            >
              <Form.Control
                as="textarea"
                rows={1}
                className="border-light-subtle bg-light shadow-none focus-ring-primary rounded-pill py-2 px-3"
                style={{
                  resize: "none",
                  overflow: "hidden",
                  minHeight: "44px",
                }}
                placeholder="Type a message to the patient..."
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
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 6px 15px rgba(0,0,0,0.08) !important; }
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .hover-text-primary:hover { color: #2563eb !important; }
        .cursor-pointer { cursor: pointer; }
        .tracking-wider { letter-spacing: 0.05em; }
        .fw-black { font-weight: 900; }
        .spin-animation { animation: spin 1s linear infinite; }
        .transition-all { transition: all 0.2s ease; }
        .focus-ring-info:focus { border-color: #0dcaf0; box-shadow: 0 0 0 0.25rem rgba(13, 202, 240, 0.25); }
        .focus-ring-primary:focus { border-color: #2563eb; box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.25); }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default DoctorPatients;
