import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  RotateCcw,
  Loader2,
  Stethoscope,
  Hash,
  Activity,
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
        { headers: { Authorization: `Bearer ${token}` } },
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

  // Modern Soft UI translucent badges
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-warning bg-opacity-10 text-warning border-warning",
      confirmed: "bg-primary bg-opacity-10 text-primary border-primary",
      completed: "bg-success bg-opacity-10 text-success border-success",
      cancelled: "bg-secondary bg-opacity-10 text-secondary border-secondary",
      missed: "bg-danger bg-opacity-10 text-danger border-danger",
    };
    return `badge rounded-pill px-3 py-2 border border-opacity-25 shadow-sm fw-bold ${
      styles[status] || "bg-light text-dark"
    }`;
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
      {/* --- HEADER SECTION --- */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary text-white p-3 rounded-3 shadow-sm">
            <Calendar size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="fw-bolder mb-1 text-dark tracking-tight">
              Appointment Registry
            </h3>
            <p className="text-muted fw-medium mb-0">
              Total Records:{" "}
              <span className="fw-bold text-primary fs-6">
                {appointments.length}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* --- ERROR ALERT --- */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold animate-fade-in">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* --- FILTER CONTROL PANEL --- */}
      <div className="card-modern mb-5 bg-white p-4">
        <div className="row g-4 align-items-end">
          <div className="col-md-4">
            <label className="small fw-bold text-secondary mb-2 d-flex align-items-center gap-2 text-uppercase tracking-wider">
              <Filter size={16} className="text-primary" /> Filter by Day
            </label>
            <select
              name="day"
              className="form-select modern-input fw-semibold text-dark cursor-pointer shadow-sm"
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

          <div className="col-md-4">
            <label className="small fw-bold text-secondary mb-2 d-flex align-items-center gap-2 text-uppercase tracking-wider">
              <Activity size={16} className="text-info" /> Filter by Status
            </label>
            <select
              name="status"
              className="form-select modern-input fw-semibold text-dark cursor-pointer shadow-sm"
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

          <div className="col-md-4">
            <button
              className="btn btn-dark w-100 rounded-pill py-2 shadow-sm fw-bold hover-lift d-flex align-items-center justify-content-center gap-2"
              onClick={() => setFilters({ day: "", status: "", doctor: "" })}
            >
              <RotateCcw size={16} /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN REGISTRY TABLE --- */}
      <div className="card-modern overflow-hidden mb-4 bg-white">
        {loading ? (
          <div className="text-center py-5 my-5">
            <Loader2
              className="spin-animation text-primary mb-3 mx-auto"
              size={48}
            />
            <p className="text-muted fw-bolder tracking-wider text-uppercase small">
              Syncing Records...
            </p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-5 my-5 animate-fade-in">
            <div className="bg-secondary bg-opacity-10 p-4 rounded-circle d-inline-block mb-3">
              <Calendar size={48} className="text-secondary opacity-50" />
            </div>
            <h4 className="fw-bolder text-dark mb-2">No Appointments Found</h4>
            <p className="text-muted fw-medium">
              Try adjusting your filters or search criteria to find what you're
              looking for.
            </p>
          </div>
        ) : (
          <div className="table-responsive custom-scrollbar">
            <table className="table table-hover align-middle mb-0 table-modern">
              <thead>
                <tr>
                  <th className="ps-4">Date & Time</th>
                  <th>Reference</th>
                  <th>Patient Details</th>
                  <th>Assigned Doctor</th>
                  <th>Status</th>
                  <th className="pe-4 text-end">Management</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => {
                  // Prioritize Snapshot Data for integrity
                  const pName =
                    appt.customerDetails?.name ||
                    appt.user?.name ||
                    "Unknown Patient";
                  const pContact =
                    appt.customerDetails?.phone ||
                    appt.user?.phone ||
                    "No Contact";

                  return (
                    <tr
                      key={appt._id}
                      className="transition-all hover-lift-sm border-bottom border-light"
                    >
                      <td className="ps-4 py-3">
                        <div className="fw-bolder text-dark mb-1 fs-6">
                          {appt.date
                            ? new Date(appt.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : appt.day}
                        </div>
                        <div className="small text-muted d-flex align-items-center gap-1 fw-bold">
                          <Clock size={14} className="text-primary" />{" "}
                          {appt.timeSlot}
                        </div>
                      </td>

                      <td>
                        <span className="badge bg-light text-secondary border border-secondary border-opacity-25 rounded-pill px-3 py-2 font-monospace d-inline-flex align-items-center gap-1 shadow-sm">
                          <Hash size={14} className="text-primary" />{" "}
                          {appt.bookingReference || "N/A"}
                        </span>
                      </td>

                      <td>
                        <div className="fw-bold text-dark d-flex align-items-center gap-2 mb-1 fs-6">
                          <User size={16} className="text-muted" /> {pName}
                        </div>
                        <div className="small text-muted fw-medium ms-4">
                          {pContact}
                        </div>
                      </td>

                      <td>
                        <div className="fw-bold text-dark d-flex align-items-center gap-2 mb-1 fs-6">
                          <Stethoscope size={16} className="text-info" />{" "}
                          {appt.doctor?.name || "Unassigned"}
                        </div>
                        <div className="small text-muted fw-medium ms-4">
                          {appt.doctor?.speciality}
                        </div>
                      </td>

                      <td>
                        <span className={getStatusBadge(appt.status)}>
                          {appt.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="text-end pe-4">
                        {/* Action Buttons based on Status */}
                        {appt.status === "pending" && (
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              className="btn btn-sm btn-outline-success rounded-pill px-3 py-2 hover-lift d-flex align-items-center gap-1 fw-bold shadow-sm"
                              onClick={() =>
                                updateStatus(appt._id, "confirmed")
                              }
                              title="Confirm Booking"
                            >
                              <CheckCircle size={16} strokeWidth={2.5} />{" "}
                              Confirm
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 hover-lift d-flex align-items-center gap-1 fw-bold shadow-sm"
                              onClick={() =>
                                updateStatus(appt._id, "cancelled")
                              }
                              title="Cancel Booking"
                            >
                              <XCircle size={16} strokeWidth={2.5} /> Cancel
                            </button>
                          </div>
                        )}

                        {appt.status === "confirmed" && (
                          <button
                            className="btn btn-sm btn-primary rounded-pill px-4 py-2 shadow-sm hover-lift d-flex align-items-center gap-2 fw-bold ms-auto"
                            onClick={() => updateStatus(appt._id, "completed")}
                          >
                            <CheckCircle size={16} strokeWidth={2.5} /> Mark
                            Complete
                          </button>
                        )}

                        {["cancelled", "completed", "missed"].includes(
                          appt.status,
                        ) && (
                          <span className="badge bg-light text-muted border px-4 py-2 rounded-pill small fst-italic shadow-sm">
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
    </div>
  );
};

export default AdminAppointments;
