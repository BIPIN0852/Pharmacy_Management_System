import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Modal, Button, Spinner, Badge, Row, Col } from "react-bootstrap";
import {
  CalendarCheck,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  FileText,
  Activity,
  Eye,
  Trash2,
  Mail,
  MapPin,
  Stethoscope,
} from "lucide-react";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // --- NEW: Modal States ---
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [apptToDelete, setApptToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch appointments specific to the logged-in doctor
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/doctor/appointments");
      const data = res.data?.appointments || res.data || [];
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Update the status of an appointment (Approve, Reject, Complete)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setActionLoading(id);

      // Force lowercase to match MongoDB strict Enums
      const dbStatus = newStatus.toLowerCase();

      await api.put(`/doctor/appointments/${id}/status`, { status: dbStatus });

      // Update local state to reflect change instantly
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: dbStatus } : app,
        ),
      );

      // If updating from inside the modal, update that state too
      if (selectedAppt && selectedAppt._id === id) {
        setSelectedAppt({ ...selectedAppt, status: dbStatus });
      }
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to update appointment status",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // --- Delete Appointment Logic ---
  const confirmDelete = (id) => {
    setApptToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (!deleteLoading) {
      setShowDeleteModal(false);
      setTimeout(() => setApptToDelete(null), 300);
    }
  };

  const handleDelete = async () => {
    if (!apptToDelete) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/doctor/appointments/${apptToDelete}`);

      // Remove from UI instantly
      setAppointments((prev) => prev.filter((app) => app._id !== apptToDelete));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete appointment.");
    } finally {
      setShowDeleteModal(false);
      setDeleteLoading(false);
      setApptToDelete(null);
    }
  };

  // --- View Details Logic ---
  const handleViewDetails = (appt) => {
    setSelectedAppt(appt);
    setShowDetailsModal(true);
  };

  // Helper to style status badges
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <Badge
            bg="warning"
            text="dark"
            className="px-3 py-2 rounded-pill shadow-sm border border-warning"
          >
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge
            bg="primary"
            className="px-3 py-2 rounded-pill shadow-sm border border-primary text-white"
          >
            Confirmed
          </Badge>
        );
      case "completed":
        return (
          <Badge
            bg="success"
            className="px-3 py-2 rounded-pill shadow-sm border border-success text-white"
          >
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            bg="danger"
            className="px-3 py-2 rounded-pill shadow-sm border border-danger text-white"
          >
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge bg="secondary" className="px-3 py-2 rounded-pill shadow-sm">
            {status}
          </Badge>
        );
    }
  };

  const getPatientInitials = (name) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
        <Loader2 className="spin-animation text-primary mb-3" size={48} />
        <span className="fw-bold text-secondary tracking-wider text-uppercase small">
          Syncing Schedule...
        </span>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle shadow-sm">
            <CalendarCheck size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="fw-black mb-1 text-dark tracking-tight">
              My Appointments
            </h3>
            <p className="text-muted fw-medium mb-0 small">
              Manage your patient consultations and schedule.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="d-flex gap-3">
          <div className="bg-light px-4 py-2 rounded-3 border shadow-sm text-center">
            <span className="d-block text-muted small fw-bold text-uppercase">
              Pending
            </span>
            <span className="fs-5 fw-black text-warning">
              {
                appointments.filter(
                  (a) => a.status?.toLowerCase() === "pending",
                ).length
              }
            </span>
          </div>
          <div className="bg-light px-4 py-2 rounded-3 border shadow-sm text-center">
            <span className="d-block text-muted small fw-bold text-uppercase">
              Upcoming
            </span>
            <span className="fs-5 fw-black text-primary">
              {
                appointments.filter(
                  (a) => a.status?.toLowerCase() === "confirmed",
                ).length
              }
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* APPOINTMENTS TABLE */}
      <div className="card-modern mb-4 bg-white shadow-sm rounded-4 border border-light-subtle overflow-hidden">
        <div className="table-responsive custom-scrollbar">
          <table className="table table-hover align-middle mb-0 custom-saas-table">
            <thead className="bg-light">
              <tr>
                <th className="ps-4 text-uppercase small fw-bold text-muted py-3">
                  Patient Details
                </th>
                <th className="text-uppercase small fw-bold text-muted py-3">
                  Schedule
                </th>
                <th className="text-uppercase small fw-bold text-muted py-3">
                  Reason / Notes
                </th>
                <th className="text-uppercase small fw-bold text-muted py-3">
                  Status
                </th>
                <th className="text-end pe-4 text-uppercase small fw-bold text-muted py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <div className="bg-secondary bg-opacity-10 p-4 rounded-circle mb-3">
                        <CalendarCheck
                          size={40}
                          className="text-secondary opacity-50"
                        />
                      </div>
                      <h5 className="fw-bolder text-dark mb-1">
                        No Appointments Yet
                      </h5>
                      <p className="fw-medium mb-0 small">
                        When patients book you, they will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                appointments.map((app) => (
                  <tr
                    key={app._id}
                    className="transition-all hover-bg-light border-bottom border-light"
                  >
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "0.9rem",
                          }}
                        >
                          {/* Fallback handles if backend populates 'user' instead of 'patient' */}
                          {getPatientInitials(
                            app.patient?.name || app.user?.name,
                          )}
                        </div>
                        <div>
                          <div
                            className="fw-bolder text-dark mb-1 cursor-pointer hover-text-primary"
                            onClick={() => handleViewDetails(app)}
                          >
                            {app.patient?.name ||
                              app.user?.name ||
                              "Unknown Patient"}
                          </div>
                          <div className="text-muted small d-flex align-items-center gap-1">
                            <Mail size={12} />{" "}
                            {app.patient?.email ||
                              app.user?.email ||
                              "No email provided"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-dark fw-bold d-flex align-items-center gap-2 mb-1">
                        <CalendarCheck size={14} className="text-primary" />{" "}
                        {app.date
                          ? new Date(app.date).toLocaleDateString()
                          : app.day}
                      </div>
                      <div className="text-muted small d-flex align-items-center gap-2">
                        <Clock size={14} /> {app.timeSlot || app.time}
                      </div>
                    </td>
                    <td>
                      <div
                        className="text-muted small d-flex align-items-start gap-2"
                        style={{ maxWidth: "250px" }}
                      >
                        <FileText
                          size={14}
                          className="flex-shrink-0 mt-1 text-secondary"
                        />
                        <span className="text-truncate">
                          {app.reason || "General Consultation"}
                        </span>
                      </div>
                    </td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end align-items-center gap-2">
                        {/* Status Actions */}
                        {app.status?.toLowerCase() === "pending" && (
                          <>
                            <button
                              className="btn btn-sm btn-success rounded-pill px-3 shadow-sm fw-bold d-flex align-items-center gap-1 hover-lift"
                              onClick={() =>
                                handleUpdateStatus(app._id, "Confirmed")
                              }
                              disabled={actionLoading === app._id}
                            >
                              {actionLoading === app._id ? (
                                <Loader2 size={14} className="spin-animation" />
                              ) : (
                                <CheckCircle size={14} />
                              )}
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill px-3 shadow-sm fw-bold d-flex align-items-center gap-1 hover-lift"
                              onClick={() =>
                                handleUpdateStatus(app._id, "Cancelled")
                              }
                              disabled={actionLoading === app._id}
                            >
                              <XCircle size={14} /> Decline
                            </button>
                          </>
                        )}

                        {app.status?.toLowerCase() === "confirmed" && (
                          <button
                            className="btn btn-sm btn-primary rounded-pill px-3 shadow-sm fw-bold d-flex align-items-center gap-1 hover-lift"
                            onClick={() =>
                              handleUpdateStatus(app._id, "Completed")
                            }
                            disabled={actionLoading === app._id}
                          >
                            {actionLoading === app._id ? (
                              <Loader2 size={14} className="spin-animation" />
                            ) : (
                              <Activity size={14} />
                            )}
                            Complete
                          </button>
                        )}

                        {/* View Icon */}
                        <Button
                          variant="light"
                          size="sm"
                          className="border shadow-sm rounded-circle p-2 hover-lift ms-2 d-flex align-items-center justify-content-center"
                          onClick={() => handleViewDetails(app)}
                          title="View Details"
                        >
                          <Eye size={16} className="text-primary" />
                        </Button>

                        {/* Delete Icon */}
                        <Button
                          variant="light"
                          size="sm"
                          className="border shadow-sm rounded-circle p-2 hover-lift hover-bg-danger text-danger d-flex align-items-center justify-content-center"
                          onClick={() => confirmDelete(app._id)}
                          title="Delete/Archive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* DETAILED VIEW MODAL */}
      {/* ====================================================================== */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        centered
        size="lg"
        contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
      >
        {selectedAppt && (
          <>
            <Modal.Header
              className="bg-light border-bottom border-light-subtle p-4"
              closeButton
            >
              <div>
                <Modal.Title className="fw-black text-dark mb-1 d-flex align-items-center gap-2">
                  <User className="text-primary" /> Patient Details
                </Modal.Title>
                <div className="small text-muted font-monospace">
                  Ref ID: {selectedAppt._id.toUpperCase()}
                </div>
              </div>
            </Modal.Header>
            <Modal.Body className="p-4 bg-white">
              <Row className="g-4 mb-4">
                <Col md={6}>
                  <div className="bg-light p-3 rounded-3 border border-light-subtle h-100">
                    <h6 className="fw-bold small text-uppercase text-muted mb-3 d-flex align-items-center gap-2">
                      <User size={14} /> Profile
                    </h6>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 shadow-sm"
                        style={{ width: "60px", height: "60px" }}
                      >
                        {getPatientInitials(
                          selectedAppt.patient?.name || selectedAppt.user?.name,
                        )}
                      </div>
                      <div>
                        <h5 className="fw-bold text-dark mb-0">
                          {selectedAppt.patient?.name ||
                            selectedAppt.user?.name ||
                            "Unknown"}
                        </h5>
                        <Badge bg="secondary" className="mt-1 fw-medium">
                          {selectedAppt.patient?.gender ||
                            selectedAppt.user?.gender ||
                            "Patient"}
                        </Badge>
                      </div>
                    </div>
                    <div className="small text-muted mb-1">
                      <Mail size={14} className="me-2" />{" "}
                      {selectedAppt.patient?.email ||
                        selectedAppt.user?.email ||
                        "No Email"}
                    </div>
                    <div className="small text-muted">
                      <MapPin size={14} className="me-2" />{" "}
                      {selectedAppt.patient?.address ||
                        selectedAppt.user?.address ||
                        "Address not provided"}
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="bg-light p-3 rounded-3 border border-light-subtle h-100">
                    <h6 className="fw-bold small text-uppercase text-muted mb-3 d-flex align-items-center gap-2">
                      <CalendarCheck size={14} /> Appointment Info
                    </h6>
                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-light-subtle small">
                      <span className="text-muted">Date & Time:</span>
                      <span className="fw-bold text-dark">
                        {selectedAppt.date
                          ? new Date(selectedAppt.date).toLocaleDateString()
                          : selectedAppt.day}{" "}
                        at {selectedAppt.timeSlot || selectedAppt.time}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-light-subtle small">
                      <span className="text-muted">Current Status:</span>
                      <span>{getStatusBadge(selectedAppt.status)}</span>
                    </div>
                    <div className="d-flex justify-content-between small">
                      <span className="text-muted">Type:</span>
                      <span className="fw-bold text-primary">
                        <Stethoscope size={14} className="me-1" /> Clinic Visit
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>

              <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <FileText size={16} className="text-primary" /> Reason for Visit
                / Patient Notes
              </h6>
              <div className="bg-light p-3 rounded-3 border border-light-subtle text-dark small lh-lg">
                {selectedAppt.reason ||
                  "No specific reason provided by the patient at the time of booking."}
              </div>
            </Modal.Body>
            <Modal.Footer className="bg-light border-top border-light-subtle p-3 d-flex justify-content-between">
              <div>
                {/* Modal Status Actions */}
                {selectedAppt.status?.toLowerCase() === "pending" && (
                  <>
                    <Button
                      variant="success"
                      className="rounded-pill fw-bold shadow-sm me-2"
                      onClick={() =>
                        handleUpdateStatus(selectedAppt._id, "Confirmed")
                      }
                      disabled={actionLoading === selectedAppt._id}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="rounded-pill fw-bold shadow-sm"
                      onClick={() =>
                        handleUpdateStatus(selectedAppt._id, "Cancelled")
                      }
                      disabled={actionLoading === selectedAppt._id}
                    >
                      Decline
                    </Button>
                  </>
                )}
                {selectedAppt.status?.toLowerCase() === "confirmed" && (
                  <Button
                    variant="primary"
                    className="rounded-pill fw-bold shadow-sm"
                    onClick={() =>
                      handleUpdateStatus(selectedAppt._id, "Completed")
                    }
                    disabled={actionLoading === selectedAppt._id}
                  >
                    Mark as Completed
                  </Button>
                )}
              </div>
              <Button
                variant="secondary"
                className="rounded-pill fw-bold"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* ====================================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ====================================================================== */}
      <Modal
        show={showDeleteModal}
        onHide={closeDeleteModal}
        centered
        contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
      >
        <Modal.Header
          className="bg-light border-bottom border-light-subtle p-4"
          closeButton={!deleteLoading}
        >
          <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2 fs-5">
            <XCircle size={20} className="text-danger" /> Delete Appointment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 bg-white text-center">
          <Trash2 size={48} className="text-danger mb-3 opacity-50" />
          <h5 className="fw-bold text-dark mb-2">Are you sure?</h5>
          <p className="text-muted mb-0">
            This will permanently remove this appointment from your schedule and
            the patient's dashboard. This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer className="bg-light border-top border-light-subtle p-3 d-flex justify-content-center gap-2">
          <Button
            variant="light"
            className="rounded-pill px-4 fw-bold border shadow-sm"
            onClick={closeDeleteModal}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <Trash2 size={16} />
            )}
            Yes, Delete It
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .hover-lift:hover { transform: translateY(-2px); transition: transform 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important; }
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .hover-text-primary:hover { color: #2563eb !important; }
        .hover-bg-danger:hover { background-color: #fee2e2 !important; border-color: #fca5a5 !important; }
        .cursor-pointer { cursor: pointer; }
        .tracking-wider { letter-spacing: 0.05em; }
        .fw-black { font-weight: 900; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default DoctorAppointments;
