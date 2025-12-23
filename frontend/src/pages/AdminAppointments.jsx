// import React, { useState, useEffect } from "react";
// import api from "../services/api";

// const AdminAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({});

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const params = new URLSearchParams(filters);
//       const res = await api.get(`/admin/appointments?${params}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAppointments(res.data.appointments || []);
//     } catch (err) {
//       console.error("Failed to fetch appointments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, [filters]);

//   const updateStatus = async (id, status) => {
//     try {
//       const token = localStorage.getItem("token");
//       await api.put(
//         `/admin/appointments/${id}/status`,
//         { status },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       fetchAppointments();
//     } catch (err) {
//       console.error("Failed to update status");
//     }
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: "bg-warning text-dark",
//       confirmed: "bg-info text-white",
//       completed: "bg-success",
//       cancelled: "bg-secondary",
//     };
//     return `badge ${badges[status] || "bg-secondary"}`;
//   };

//   if (loading)
//     return <div className="spinner-border text-primary mx-auto d-block mt-5" />;

//   return (
//     <div className="container-fluid">
//       <h3 className="fw-bold mb-4">Appointments</h3>

//       <div className="table-responsive">
//         <table className="table table-hover">
//           <thead className="table-light">
//             <tr>
//               <th>Date & Time</th>
//               <th>Doctor</th>
//               <th>Customer</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {appointments.map((appt) => (
//               <tr key={appt._id}>
//                 <td>
//                   <div>{new Date(appt.date).toLocaleDateString()}</div>
//                   <small>{appt.timeSlot}</small>
//                 </td>
//                 <td>
//                   <div className="fw-medium">{appt.doctor?.name}</div>
//                   <small>{appt.doctor?.speciality}</small>
//                 </td>
//                 <td>
//                   <div>{appt.customer?.name}</div>
//                   <small>{appt.customer?.email}</small>
//                 </td>
//                 <td>
//                   <span className={getStatusBadge(appt.status)}>
//                     {appt.status.toUpperCase()}
//                   </span>
//                 </td>
//                 <td>
//                   {appt.status === "pending" && (
//                     <select
//                       className="form-select form-select-sm"
//                       defaultValue={appt.status}
//                       onChange={(e) => updateStatus(appt._id, e.target.value)}
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="confirmed">Confirm</option>
//                       <option value="cancelled">Cancel</option>
//                     </select>
//                   )}
//                   {appt.status !== "pending" && (
//                     <span className="small text-muted">{appt.status}</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminAppointments;

import React, { useState, useEffect } from "react";
import api from "../services/api";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    date: "",
    status: "",
    doctor: "",
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const params = new URLSearchParams(filters);
      const res = await api.get(`/admin/appointments?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data.appointments || []);
    } catch (err) {
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/admin/appointments/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAppointments();
    } catch {
      setError("Failed to update status.");
    }
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const statusOptions = ["", "pending", "confirmed", "completed", "cancelled"];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "confirmed":
        return "bg-info text-white";
      case "completed":
        return "bg-success";
      case "cancelled":
        return "bg-secondary";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Manage Appointments</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex gap-3 mb-4 flex-wrap">
        <input
          type="date"
          name="date"
          className="form-control form-control-sm"
          value={filters.date}
          onChange={handleFilterChange}
          style={{ maxWidth: 180 }}
        />
        <select
          name="status"
          className="form-select form-select-sm"
          value={filters.status}
          onChange={handleFilterChange}
          style={{ maxWidth: 150 }}
        >
          {statusOptions.map((sts) => (
            <option key={sts} value={sts}>
              {sts === ""
                ? "All Statuses"
                : sts.charAt(0).toUpperCase() + sts.slice(1)}
            </option>
          ))}
        </select>
        {/* Doctor filter can be added when you have doctor list */}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : appointments.length === 0 ? (
        <p className="text-muted">No appointments found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Doctor</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{new Date(appt.date).toLocaleDateString()}</td>
                  <td>{appt.timeSlot}</td>
                  <td>
                    <div>{appt.doctor?.name || "-"}</div>
                    <small className="text-muted">
                      {appt.doctor?.speciality || ""}
                    </small>
                  </td>
                  <td>
                    <div>{appt.customer?.name || "-"}</div>
                    <small className="text-muted">
                      {appt.customer?.email || ""}
                    </small>
                  </td>
                  <td>
                    <span
                      className={`badge ${getStatusBadgeClass(appt.status)}`}
                    >
                      {appt.status.charAt(0).toUpperCase() +
                        appt.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {appt.status === "pending" && (
                      <select
                        className="form-select form-select-sm"
                        defaultValue={appt.status}
                        onChange={(e) => updateStatus(appt._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    )}
                    {appt.status !== "pending" && (
                      <small className="text-muted">{appt.status}</small>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
