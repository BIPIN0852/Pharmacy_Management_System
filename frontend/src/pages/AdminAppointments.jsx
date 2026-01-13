import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
} from "lucide-react";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    day: "",
    status: "",
    doctor: "",
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const params = new URLSearchParams();
      if (filters.day) params.append("day", filters.day);
      if (filters.status) params.append("status", filters.status);

      const res = await api.get(`/appointments?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle pagination wrapper if present, otherwise array
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.appointments || [];

      setAppointments(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointment registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Mark this appointment as ${status}?`)) return;

    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch {
      alert("Failed to update status. Please try again.");
    }
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const dayOptions = [
    "",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  const statusOptions = [
    "",
    "pending",
    "confirmed",
    "completed",
    "cancelled",
    "missed",
  ];

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-warning text-dark border-warning",
      confirmed: "bg-primary text-white border-primary",
      completed: "bg-success text-white border-success",
      cancelled: "bg-secondary text-white border-secondary",
      missed: "bg-danger text-white border-danger",
    };
    return `badge rounded-pill px-3 py-1 border ${
      styles[status] || "bg-light text-dark"
    }`;
  };

  return (
    <div className="container-fluid p-0 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0 d-flex align-items-center gap-2">
          <Calendar className="text-primary" /> Appointment Registry
        </h3>
        <span className="badge bg-white text-muted border shadow-sm p-2">
          Total Records: {appointments.length}
        </span>
      </div>

      {error && (
        <div className="alert alert-danger shadow-sm border-0">
          <AlertCircle size={16} className="me-2" />
          {error}
        </div>
      )}

      {/* Control Panel */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body p-3 bg-light rounded-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="small fw-bold text-muted mb-1">
                <Filter size={12} className="me-1" /> Filter by Day
              </label>
              <select
                name="day"
                className="form-select border-0 shadow-sm"
                value={filters.day}
                onChange={handleFilterChange}
              >
                {dayOptions.map((d) => (
                  <option key={d} value={d}>
                    {d === "" ? "All Days" : d}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="small fw-bold text-muted mb-1">
                <Filter size={12} className="me-1" /> Filter Status
              </label>
              <select
                name="status"
                className="form-select border-0 shadow-sm"
                value={filters.status}
                onChange={handleFilterChange}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s === "" ? "All Statuses" : s.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 ms-auto">
              <button
                className="btn btn-outline-secondary w-100 border-0 shadow-sm bg-white"
                onClick={() => setFilters({ day: "", status: "", doctor: "" })}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Registry Table */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status" />
            <p className="text-muted small fw-bold">Syncing Records...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-5">
            <Calendar size={48} className="text-muted opacity-25 mb-3" />
            <p className="text-muted">
              No appointments found matching your filters.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light border-bottom">
                <tr className="small text-uppercase text-muted">
                  <th className="ps-4 py-3">Date & Time</th>
                  <th>Reference</th>
                  <th>Patient Details</th>
                  <th>Assigned Doctor</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Management</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => {
                  // ✅ Prioritize Snapshot Data for integrity
                  const pName =
                    appt.customerDetails?.name || appt.user?.name || "Unknown";
                  const pContact =
                    appt.customerDetails?.phone || appt.user?.phone || "N/A";

                  return (
                    <tr key={appt._id}>
                      <td className="ps-4">
                        <div className="fw-bold text-dark">
                          {appt.date
                            ? new Date(appt.date).toLocaleDateString()
                            : appt.day}
                        </div>
                        <div className="small text-muted d-flex align-items-center gap-1">
                          <Clock size={12} /> {appt.timeSlot}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border font-monospace">
                          {appt.bookingReference || "N/A"}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold d-flex align-items-center gap-2">
                          <User size={14} className="text-muted" /> {pName}
                        </div>
                        <div className="small text-muted ms-4">{pContact}</div>
                      </td>
                      <td>
                        <div className="fw-medium text-primary">
                          {appt.doctor?.name || "Unassigned"}
                        </div>
                        <small className="text-muted">
                          {appt.doctor?.speciality}
                        </small>
                      </td>
                      <td>
                        <span className={getStatusBadge(appt.status)}>
                          {appt.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        {/* Action Buttons based on Status */}
                        {appt.status === "pending" && (
                          <div className="btn-group shadow-sm">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() =>
                                updateStatus(appt._id, "confirmed")
                              }
                              title="Confirm Booking"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger bg-white"
                              onClick={() =>
                                updateStatus(appt._id, "cancelled")
                              }
                              title="Cancel Booking"
                            >
                              <XCircle size={14} />
                            </button>
                          </div>
                        )}
                        {appt.status === "confirmed" && (
                          <button
                            className="btn btn-sm btn-primary shadow-sm"
                            onClick={() => updateStatus(appt._id, "completed")}
                          >
                            Mark Complete
                          </button>
                        )}
                        {["cancelled", "completed", "missed"].includes(
                          appt.status
                        ) && (
                          <span className="text-muted small fst-italic">
                            Archived
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`.animate-fade-in { animation: fadeIn 0.4s ease; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default AdminAppointments;
