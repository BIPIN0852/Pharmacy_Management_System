import React, { useState, useEffect } from "react";
import api from "../services/api";
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
} from "lucide-react";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch appointments specific to the logged-in doctor
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      // Note: We will build this backend route next!
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
      await api.put(`/doctor/appointments/${id}/status`, { status: newStatus });

      // Update local state to reflect change instantly without full refresh
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: newStatus } : app,
        ),
      );
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to update appointment status",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Helper to style status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="badge bg-warning text-dark border border-warning px-3 py-2 rounded-pill shadow-sm">
            Pending
          </span>
        );
      case "Confirmed":
        return (
          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill shadow-sm">
            Confirmed
          </span>
        );
      case "Completed":
        return (
          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill shadow-sm">
            Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-2 rounded-pill shadow-sm">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary px-3 py-2 rounded-pill shadow-sm">
            {status}
          </span>
        );
    }
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
              {appointments.filter((a) => a.status === "Pending").length}
            </span>
          </div>
          <div className="bg-light px-4 py-2 rounded-3 border shadow-sm text-center">
            <span className="d-block text-muted small fw-bold text-uppercase">
              Upcoming
            </span>
            <span className="fs-5 fw-black text-primary">
              {appointments.filter((a) => a.status === "Confirmed").length}
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
                          style={{ width: "40px", height: "40px" }}
                        >
                          {app.patient?.name?.charAt(0).toUpperCase() || "P"}
                        </div>
                        <div>
                          <div className="fw-bolder text-dark mb-1">
                            {app.patient?.name || "Unknown Patient"}
                          </div>
                          <div className="text-muted small d-flex align-items-center gap-1">
                            <User size={12} />{" "}
                            {app.patient?.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-dark fw-bold d-flex align-items-center gap-2 mb-1">
                        <CalendarCheck size={14} className="text-primary" />{" "}
                        {new Date(app.date).toLocaleDateString()}
                      </div>
                      <div className="text-muted small d-flex align-items-center gap-2">
                        <Clock size={14} /> {app.time}
                      </div>
                    </td>
                    <td>
                      <div
                        className="text-muted small d-flex align-items-start gap-2"
                        style={{ maxWidth: "250px", whiteSpace: "normal" }}
                      >
                        <FileText
                          size={14}
                          className="flex-shrink-0 mt-1 text-secondary"
                        />
                        <span>{app.reason || "General Consultation"}</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td className="pe-4 text-end">
                      {app.status === "Pending" && (
                        <div className="d-flex justify-content-end gap-2">
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
                            )}{" "}
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
                        </div>
                      )}

                      {app.status === "Confirmed" && (
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
                          )}{" "}
                          Mark Complete
                        </button>
                      )}

                      {(app.status === "Completed" ||
                        app.status === "Cancelled") && (
                        <span className="text-muted small fw-bold">
                          No further action
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .hover-lift:hover { transform: translateY(-2px); transition: transform 0.2s ease; }
      `}</style>
    </div>
  );
};

export default DoctorAppointments;
