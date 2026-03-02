// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Calendar,
//   Clock,
//   User,
//   FileText,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Filter,
// } from "lucide-react";

// const AdminAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [filters, setFilters] = useState({
//     day: "",
//     status: "",
//     doctor: "",
//   });

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");

//       const params = new URLSearchParams();
//       if (filters.day) params.append("day", filters.day);
//       if (filters.status) params.append("status", filters.status);

//       const res = await api.get(`/appointments?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Handle pagination wrapper if present, otherwise array
//       const data = Array.isArray(res.data)
//         ? res.data
//         : res.data.appointments || [];

//       setAppointments(data);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load appointment registry.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, [filters]);

//   const updateStatus = async (id, status) => {
//     if (!window.confirm(`Mark this appointment as ${status}?`)) return;

//     try {
//       const token = localStorage.getItem("token");
//       await api.put(
//         `/appointments/${id}/status`,
//         { status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchAppointments();
//     } catch {
//       alert("Failed to update status. Please try again.");
//     }
//   };

//   const handleFilterChange = (e) => {
//     setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const dayOptions = [
//     "",
//     "MONDAY",
//     "TUESDAY",
//     "WEDNESDAY",
//     "THURSDAY",
//     "FRIDAY",
//     "SATURDAY",
//     "SUNDAY",
//   ];
//   const statusOptions = [
//     "",
//     "pending",
//     "confirmed",
//     "completed",
//     "cancelled",
//     "missed",
//   ];

//   const getStatusBadge = (status) => {
//     const styles = {
//       pending: "bg-warning text-dark border-warning",
//       confirmed: "bg-primary text-white border-primary",
//       completed: "bg-success text-white border-success",
//       cancelled: "bg-secondary text-white border-secondary",
//       missed: "bg-danger text-white border-danger",
//     };
//     return `badge rounded-pill px-3 py-1 border ${
//       styles[status] || "bg-light text-dark"
//     }`;
//   };

//   return (
//     <div className="container-fluid p-0 animate-fade-in">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="fw-bold m-0 d-flex align-items-center gap-2">
//           <Calendar className="text-primary" /> Appointment Registry
//         </h3>
//         <span className="badge bg-white text-muted border shadow-sm p-2">
//           Total Records: {appointments.length}
//         </span>
//       </div>

//       {error && (
//         <div className="alert alert-danger shadow-sm border-0">
//           <AlertCircle size={16} className="me-2" />
//           {error}
//         </div>
//       )}

//       {/* Control Panel */}
//       <div className="card shadow-sm border-0 rounded-4 mb-4">
//         <div className="card-body p-3 bg-light rounded-4">
//           <div className="row g-3 align-items-end">
//             <div className="col-md-3">
//               <label className="small fw-bold text-muted mb-1">
//                 <Filter size={12} className="me-1" /> Filter by Day
//               </label>
//               <select
//                 name="day"
//                 className="form-select border-0 shadow-sm"
//                 value={filters.day}
//                 onChange={handleFilterChange}
//               >
//                 {dayOptions.map((d) => (
//                   <option key={d} value={d}>
//                     {d === "" ? "All Days" : d}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3">
//               <label className="small fw-bold text-muted mb-1">
//                 <Filter size={12} className="me-1" /> Filter Status
//               </label>
//               <select
//                 name="status"
//                 className="form-select border-0 shadow-sm"
//                 value={filters.status}
//                 onChange={handleFilterChange}
//               >
//                 {statusOptions.map((s) => (
//                   <option key={s} value={s}>
//                     {s === "" ? "All Statuses" : s.toUpperCase()}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-2 ms-auto">
//               <button
//                 className="btn btn-outline-secondary w-100 border-0 shadow-sm bg-white"
//                 onClick={() => setFilters({ day: "", status: "", doctor: "" })}
//               >
//                 Reset Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Registry Table */}
//       <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
//         {loading ? (
//           <div className="text-center py-5">
//             <div className="spinner-border text-primary mb-3" role="status" />
//             <p className="text-muted small fw-bold">Syncing Records...</p>
//           </div>
//         ) : appointments.length === 0 ? (
//           <div className="text-center py-5">
//             <Calendar size={48} className="text-muted opacity-25 mb-3" />
//             <p className="text-muted">
//               No appointments found matching your filters.
//             </p>
//           </div>
//         ) : (
//           <div className="table-responsive">
//             <table className="table table-hover align-middle mb-0">
//               <thead className="bg-light border-bottom">
//                 <tr className="small text-uppercase text-muted">
//                   <th className="ps-4 py-3">Date & Time</th>
//                   <th>Reference</th>
//                   <th>Patient Details</th>
//                   <th>Assigned Doctor</th>
//                   <th>Status</th>
//                   <th className="text-end pe-4">Management</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {appointments.map((appt) => {
//                   // ✅ Prioritize Snapshot Data for integrity
//                   const pName =
//                     appt.customerDetails?.name || appt.user?.name || "Unknown";
//                   const pContact =
//                     appt.customerDetails?.phone || appt.user?.phone || "N/A";

//                   return (
//                     <tr key={appt._id}>
//                       <td className="ps-4">
//                         <div className="fw-bold text-dark">
//                           {appt.date
//                             ? new Date(appt.date).toLocaleDateString()
//                             : appt.day}
//                         </div>
//                         <div className="small text-muted d-flex align-items-center gap-1">
//                           <Clock size={12} /> {appt.timeSlot}
//                         </div>
//                       </td>
//                       <td>
//                         <span className="badge bg-light text-dark border font-monospace">
//                           {appt.bookingReference || "N/A"}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="fw-bold d-flex align-items-center gap-2">
//                           <User size={14} className="text-muted" /> {pName}
//                         </div>
//                         <div className="small text-muted ms-4">{pContact}</div>
//                       </td>
//                       <td>
//                         <div className="fw-medium text-primary">
//                           {appt.doctor?.name || "Unassigned"}
//                         </div>
//                         <small className="text-muted">
//                           {appt.doctor?.speciality}
//                         </small>
//                       </td>
//                       <td>
//                         <span className={getStatusBadge(appt.status)}>
//                           {appt.status.toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="text-end pe-4">
//                         {/* Action Buttons based on Status */}
//                         {appt.status === "pending" && (
//                           <div className="btn-group shadow-sm">
//                             <button
//                               className="btn btn-sm btn-success"
//                               onClick={() =>
//                                 updateStatus(appt._id, "confirmed")
//                               }
//                               title="Confirm Booking"
//                             >
//                               <CheckCircle size={14} />
//                             </button>
//                             <button
//                               className="btn btn-sm btn-outline-danger bg-white"
//                               onClick={() =>
//                                 updateStatus(appt._id, "cancelled")
//                               }
//                               title="Cancel Booking"
//                             >
//                               <XCircle size={14} />
//                             </button>
//                           </div>
//                         )}
//                         {appt.status === "confirmed" && (
//                           <button
//                             className="btn btn-sm btn-primary shadow-sm"
//                             onClick={() => updateStatus(appt._id, "completed")}
//                           >
//                             Mark Complete
//                           </button>
//                         )}
//                         {["cancelled", "completed", "missed"].includes(
//                           appt.status
//                         ) && (
//                           <span className="text-muted small fst-italic">
//                             Archived
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       <style>{`.animate-fade-in { animation: fadeIn 0.4s ease; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
//     </div>
//   );
// };

// export default AdminAppointments;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Calendar,
//   Clock,
//   User,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Filter,
//   RotateCcw,
//   Loader2,
//   Stethoscope,
//   Hash,
//   Activity, // <--- ADDED THIS HERE
// } from "lucide-react";

// const AdminAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [filters, setFilters] = useState({
//     day: "",
//     status: "",
//     doctor: "",
//   });

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");

//       const params = new URLSearchParams();
//       if (filters.day) params.append("day", filters.day);
//       if (filters.status) params.append("status", filters.status);

//       const res = await api.get(`/appointments?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Handle pagination wrapper if present, otherwise array
//       const data = Array.isArray(res.data)
//         ? res.data
//         : res.data.appointments || [];

//       setAppointments(data);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load appointment registry.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, [filters]);

//   const updateStatus = async (id, status) => {
//     if (!window.confirm(`Mark this appointment as ${status}?`)) return;

//     try {
//       const token = localStorage.getItem("token");
//       await api.put(
//         `/appointments/${id}/status`,
//         { status },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       fetchAppointments();
//     } catch {
//       alert("Failed to update status. Please try again.");
//     }
//   };

//   const handleFilterChange = (e) => {
//     setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const dayOptions = [
//     "",
//     "MONDAY",
//     "TUESDAY",
//     "WEDNESDAY",
//     "THURSDAY",
//     "FRIDAY",
//     "SATURDAY",
//     "SUNDAY",
//   ];

//   const statusOptions = [
//     "",
//     "pending",
//     "confirmed",
//     "completed",
//     "cancelled",
//     "missed",
//   ];

//   // Upgraded to modern Soft UI translucent badges
//   const getStatusBadge = (status) => {
//     const styles = {
//       pending:
//         "bg-warning bg-opacity-10 text-warning border-warning border-opacity-25",
//       confirmed:
//         "bg-primary bg-opacity-10 text-primary border-primary border-opacity-25",
//       completed:
//         "bg-success bg-opacity-10 text-success border-success border-opacity-25",
//       cancelled:
//         "bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-25",
//       missed:
//         "bg-danger bg-opacity-10 text-danger border-danger border-opacity-25",
//     };
//     return `badge rounded-pill px-3 py-1 border ${
//       styles[status] || "bg-light text-dark"
//     }`;
//   };

//   return (
//     <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
//       {/* Header Section */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
//         <div className="d-flex align-items-center gap-3">
//           <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4 shadow-sm">
//             <Calendar size={24} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="fw-bolder mb-1 text-dark tracking-tight">
//               Appointment Registry
//             </h3>
//             <p className="text-muted small fw-medium mb-0">
//               Total Records:{" "}
//               <span className="fw-bold text-primary">
//                 {appointments.length}
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 shadow-sm mb-4 rounded-3 border-0 bg-danger bg-opacity-10 text-danger small fw-medium">
//           <AlertCircle size={18} /> {error}
//         </div>
//       )}

//       {/* Filter Control Panel */}
//       <div className="card shadow-sm border-0 rounded-4 mb-4 modern-card bg-white">
//         <div className="card-body p-4">
//           <div className="row g-4 align-items-end">
//             <div className="col-md-4">
//               <label className="small fw-bold text-secondary mb-2 d-flex align-items-center gap-1">
//                 <Filter size={14} /> Filter by Day
//               </label>
//               <select
//                 name="day"
//                 className="form-select modern-input rounded-pill px-4 py-2 border-light-subtle shadow-sm cursor-pointer"
//                 value={filters.day}
//                 onChange={handleFilterChange}
//               >
//                 {dayOptions.map((d) => (
//                   <option key={d} value={d}>
//                     {d === "" ? "All Days" : d}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-4">
//               <label className="small fw-bold text-secondary mb-2 d-flex align-items-center gap-1">
//                 <Activity size={14} /> Filter by Status
//               </label>
//               <select
//                 name="status"
//                 className="form-select modern-input rounded-pill px-4 py-2 border-light-subtle shadow-sm cursor-pointer"
//                 value={filters.status}
//                 onChange={handleFilterChange}
//               >
//                 {statusOptions.map((s) => (
//                   <option key={s} value={s}>
//                     {s === "" ? "All Statuses" : s.toUpperCase()}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-4">
//               <button
//                 className="btn btn-light w-100 rounded-pill py-2 border text-secondary fw-semibold hover-lift transition-all d-flex align-items-center justify-content-center gap-2"
//                 onClick={() => setFilters({ day: "", status: "", doctor: "" })}
//               >
//                 <RotateCcw size={16} /> Reset Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Registry Table */}
//       <div className="card shadow-sm border-0 rounded-4 overflow-hidden modern-card mb-4 bg-white">
//         {loading ? (
//           <div className="text-center py-5 my-5">
//             <Loader2
//               className="spin-animation text-primary mb-3 mx-auto"
//               size={40}
//             />
//             <p className="text-muted small fw-bold tracking-wider text-uppercase">
//               Syncing Records...
//             </p>
//           </div>
//         ) : appointments.length === 0 ? (
//           <div className="text-center py-5 my-5">
//             <div className="bg-secondary bg-opacity-10 p-4 rounded-circle d-inline-block mb-3">
//               <Calendar size={48} className="text-secondary opacity-50" />
//             </div>
//             <h5 className="fw-bold text-dark mb-1">No Appointments Found</h5>
//             <p className="text-muted small">
//               Try adjusting your filters or search criteria.
//             </p>
//           </div>
//         ) : (
//           <div className="table-responsive">
//             <table className="table table-hover align-middle mb-0">
//               <thead className="bg-light border-bottom">
//                 <tr>
//                   <th className="py-3 ps-4 text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                     Date & Time
//                   </th>
//                   <th className="py-3 text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                     Reference
//                   </th>
//                   <th className="py-3 text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                     Patient Details
//                   </th>
//                   <th className="py-3 text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                     Assigned Doctor
//                   </th>
//                   <th className="py-3 text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                     Status
//                   </th>
//                   <th className="py-3 pe-4 text-end text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                     Management
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="border-top-0">
//                 {appointments.map((appt) => {
//                   // Prioritize Snapshot Data for integrity
//                   const pName =
//                     appt.customerDetails?.name ||
//                     appt.user?.name ||
//                     "Unknown Patient";
//                   const pContact =
//                     appt.customerDetails?.phone ||
//                     appt.user?.phone ||
//                     "No Contact";

//                   return (
//                     <tr
//                       key={appt._id}
//                       className="transition-all table-row-hover"
//                     >
//                       <td className="ps-4 py-3">
//                         <div
//                           className="fw-bolder text-dark mb-1"
//                           style={{ fontSize: "0.95rem" }}
//                         >
//                           {appt.date
//                             ? new Date(appt.date).toLocaleDateString("en-US", {
//                                 month: "short",
//                                 day: "numeric",
//                                 year: "numeric",
//                               })
//                             : appt.day}
//                         </div>
//                         <div className="small text-muted d-flex align-items-center gap-1 fw-medium">
//                           <Clock size={14} className="text-primary" />{" "}
//                           {appt.timeSlot}
//                         </div>
//                       </td>

//                       <td>
//                         <span className="badge bg-light text-secondary border border-secondary border-opacity-25 rounded-pill px-2 py-1 font-monospace d-inline-flex align-items-center gap-1">
//                           <Hash size={12} /> {appt.bookingReference || "N/A"}
//                         </span>
//                       </td>

//                       <td>
//                         <div
//                           className="fw-bold text-dark d-flex align-items-center gap-2 mb-1"
//                           style={{ fontSize: "0.9rem" }}
//                         >
//                           <User size={14} className="text-muted" /> {pName}
//                         </div>
//                         <div
//                           className="small text-muted d-flex align-items-center gap-1 ms-4"
//                           style={{ fontSize: "0.75rem" }}
//                         >
//                           {pContact}
//                         </div>
//                       </td>

//                       <td>
//                         <div
//                           className="fw-bold text-dark d-flex align-items-center gap-1 mb-1"
//                           style={{ fontSize: "0.9rem" }}
//                         >
//                           <Stethoscope size={14} className="text-primary" />{" "}
//                           {appt.doctor?.name || "Unassigned"}
//                         </div>
//                         <div className="small text-muted ms-4">
//                           {appt.doctor?.speciality}
//                         </div>
//                       </td>

//                       <td>
//                         <span className={getStatusBadge(appt.status)}>
//                           {appt.status.toUpperCase()}
//                         </span>
//                       </td>

//                       <td className="text-end pe-4">
//                         {/* Action Buttons based on Status */}
//                         {appt.status === "pending" && (
//                           <div className="d-flex justify-content-end gap-2">
//                             <button
//                               className="btn btn-sm btn-light text-success border border-success border-opacity-25 rounded-pill px-3 py-1 hover-lift transition-all d-flex align-items-center gap-1 fw-semibold"
//                               onClick={() =>
//                                 updateStatus(appt._id, "confirmed")
//                               }
//                               title="Confirm Booking"
//                             >
//                               <CheckCircle size={14} /> Confirm
//                             </button>
//                             <button
//                               className="btn btn-sm btn-light text-danger border border-danger border-opacity-25 rounded-pill px-3 py-1 hover-lift transition-all d-flex align-items-center gap-1 fw-semibold"
//                               onClick={() =>
//                                 updateStatus(appt._id, "cancelled")
//                               }
//                               title="Cancel Booking"
//                             >
//                               <XCircle size={14} /> Cancel
//                             </button>
//                           </div>
//                         )}

//                         {appt.status === "confirmed" && (
//                           <button
//                             className="btn btn-sm btn-primary rounded-pill px-4 py-1 shadow-sm hover-lift transition-all d-flex align-items-center gap-1 fw-semibold ms-auto"
//                             onClick={() => updateStatus(appt._id, "completed")}
//                           >
//                             <CheckCircle size={14} /> Mark Complete
//                           </button>
//                         )}

//                         {["cancelled", "completed", "missed"].includes(
//                           appt.status,
//                         ) && (
//                           <span className="badge bg-light text-muted border px-3 py-2 rounded-pill small fst-italic">
//                             Archived
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Embedded CSS for custom modern styles */}
//       <style>{`
//         .bg-light { background-color: #f8fafc !important; }
//         .modern-card { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03) !important; }

//         /* Input Styling */
//         .modern-input {
//           background-color: #ffffff;
//           transition: all 0.2s ease;
//         }
//         .modern-input:focus {
//           border-color: #0d6efd;
//           box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
//         }

//         /* Table Row Hover */
//         .table-row-hover:hover {
//           background-color: rgba(13, 110, 253, 0.02) !important;
//         }

//         /* Typography */
//         .tracking-wider { letter-spacing: 0.05em; }
//         .tracking-tight { letter-spacing: -0.025em; }
//         .cursor-pointer { cursor: pointer; }

//         /* Animations */
//         .animate-fade-in { animation: fadeIn 0.3s ease-out; }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .spin-animation { animation: spin 1s linear infinite; }
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }

//         .transition-all { transition: all 0.3s ease; }
//         .hover-lift:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 15px rgba(13, 110, 253, 0.15) !important;
//         }
//         .hover-lift:active { transform: translateY(0); }
//       `}</style>
//     </div>
//   );
// };

// export default AdminAppointments;

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
