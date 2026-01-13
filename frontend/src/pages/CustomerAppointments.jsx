// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import { Calendar, BookOpen, AlertCircle } from "lucide-react";

// const CustomerAppointments = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [booking, setBooking] = useState({
//     doctor: "",
//     day: "", // ✅ Updated from date to day
//     timeSlot: "",
//     notes: "",
//   });
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [availableDays, setAvailableDays] = useState([]); // ✅ To store doctor's unique working days

//   // Fetch doctors and my appointments
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Please login again.");
//         setLoading(false);
//         return;
//       }

//       const [doctorsRes, appointmentsRes] = await Promise.all([
//         api.get("/doctors", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         api.get("/appointments/my", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       setDoctors(doctorsRes.data || []);
//       setMyAppointments(appointmentsRes.data || []);
//     } catch (err) {
//       console.error("CustomerAppointments fetch error:", err);
//       setError("Failed to load data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookingChange = (e) => {
//     setBooking({ ...booking, [e.target.name]: e.target.value });
//     setError("");
//     setSuccess("");
//   };

//   // ✅ LOGIC: Extract available days when doctor is selected
//   useEffect(() => {
//     if (booking.doctor) {
//       const doctor = doctors.find((d) => d._id === booking.doctor);
//       if (doctor && Array.isArray(doctor.slots)) {
//         // Get unique days from doctor's slots (e.g., MONDAY, TUESDAY)
//         const uniqueDays = [
//           ...new Set(doctor.slots.map((s) => s.day.toUpperCase())),
//         ];
//         setAvailableDays(uniqueDays);
//       } else {
//         setAvailableDays([]);
//       }
//     }
//   }, [booking.doctor, doctors]);

//   // ✅ LOGIC: Recompute available slots when doctor or day changes
//   useEffect(() => {
//     if (!booking.doctor || !booking.day) {
//       setAvailableSlots([]);
//       return;
//     }

//     const doctor = doctors.find((d) => d._id === booking.doctor);
//     if (!doctor || !Array.isArray(doctor.slots)) {
//       setAvailableSlots([]);
//       return;
//     }

//     // Filter slots for the selected Day
//     const slotsForDay = doctor.slots.filter(
//       (s) => s.day.toUpperCase() === booking.day.toUpperCase()
//     );

//     const mapped = slotsForDay.map((s) => ({
//       value: `${s.startTime} - ${s.endTime}`, // ✅ Matches your current slot string format
//       label: `${s.startTime} - ${s.endTime}`,
//     }));

//     setAvailableSlots(mapped);

//     if (booking.timeSlot && !mapped.some((m) => m.value === booking.timeSlot)) {
//       setBooking((prev) => ({ ...prev, timeSlot: "" }));
//     }
//   }, [booking.doctor, booking.day, doctors]);

//   const submitBooking = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!booking.doctor || !booking.day || !booking.timeSlot) {
//       setError("Please fill all required fields.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Please login again.");
//         return;
//       }

//       await api.post(
//         "/appointments",
//         {
//           doctor: booking.doctor,
//           day: booking.day, // ✅ Sending day instead of date
//           timeSlot: booking.timeSlot,
//           notes: booking.notes,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setSuccess("Appointment booked successfully!");
//       setBooking({ doctor: "", day: "", timeSlot: "", notes: "" });
//       setShowBookingForm(false);
//       fetchData();
//     } catch (err) {
//       console.error("Appointment booking error:", err);
//       setError(err.response?.data?.message || "Failed to book appointment.");
//     }
//   };

//   const getStatusBadge = (status) => {
//     const classes = {
//       pending: "bg-warning text-dark",
//       confirmed: "bg-success",
//       completed: "bg-info text-white",
//       cancelled: "bg-secondary",
//     };
//     return `badge ${classes[status] || "bg-light text-dark"}`;
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-50">
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4">
//       <div className="row">
//         {/* Upcoming Appointments */}
//         <div className="col-lg-8">
//           <div className="card shadow-sm mb-4">
//             <div className="card-header bg-primary text-white">
//               <h5 className="mb-0 d-flex align-items-center gap-2">
//                 <Calendar size={20} />
//                 My Appointments
//               </h5>
//             </div>
//             <div className="card-body">
//               {myAppointments.length === 0 ? (
//                 <div className="text-center py-5 text-muted">
//                   <Calendar size={48} className="mb-3 opacity-50" />
//                   <p>No appointments booked yet.</p>
//                   <button
//                     className="btn btn-primary"
//                     onClick={() => setShowBookingForm(true)}
//                   >
//                     Book Appointment
//                   </button>
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table table-hover">
//                     <thead>
//                       <tr>
//                         <th>Day & Time</th> {/* ✅ Updated Header */}
//                         <th>Doctor</th>
//                         <th>Status</th>
//                         <th>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {myAppointments.map((appt) => (
//                         <tr key={appt._id}>
//                           <td>
//                             <strong>{appt.day}</strong>{" "}
//                             {/* ✅ Now shows Day string */}
//                             <br />
//                             <small>{appt.timeSlot}</small>
//                           </td>
//                           <td>
//                             <strong>{appt.doctor?.name}</strong>
//                             <br />
//                             <small className="text-muted">
//                               {appt.doctor?.speciality}
//                             </small>
//                           </td>
//                           <td>
//                             <span className={getStatusBadge(appt.status)}>
//                               {appt.status?.toUpperCase()}
//                             </span>
//                           </td>
//                           <td>
//                             {appt.status === "pending" && (
//                               <button
//                                 className="btn btn-outline-danger btn-sm"
//                                 onClick={async () => {
//                                   try {
//                                     const token = localStorage.getItem("token");
//                                     if (!token) {
//                                       setError("Please login again.");
//                                       return;
//                                     }
//                                     await api.put(
//                                       `/appointments/${appt._id}/status`,
//                                       { status: "cancelled" },
//                                       {
//                                         headers: {
//                                           Authorization: `Bearer ${token}`,
//                                         },
//                                       }
//                                     );
//                                     fetchData();
//                                   } catch (err) {
//                                     console.error(
//                                       "cancel appointment error:",
//                                       err
//                                     );
//                                     setError(
//                                       err.response?.data?.message ||
//                                         "Failed to cancel appointment."
//                                     );
//                                   }
//                                 }}
//                               >
//                                 Cancel
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Quick Book */}
//         <div className="col-lg-4">
//           <div className="card shadow-sm">
//             <div className="card-header bg-success text-white">
//               <h6 className="mb-0 d-flex align-items-center gap-2">
//                 <BookOpen size={18} />
//                 Quick Book
//               </h6>
//             </div>
//             <div className="card-body">
//               <button
//                 className="btn btn-outline-primary w-100 mb-3"
//                 onClick={() => setShowBookingForm(true)}
//               >
//                 + New Appointment
//               </button>

//               <div className="list-group list-group-flush">
//                 {doctors.slice(0, 3).map((doctor) => (
//                   <button
//                     key={doctor._id}
//                     className="list-group-item list-group-item-action d-flex align-items-center gap-3 p-3"
//                     onClick={() => {
//                       setBooking((prev) => ({
//                         ...prev,
//                         doctor: doctor._id,
//                       }));
//                       setShowBookingForm(true);
//                     }}
//                   >
//                     <div
//                       className="rounded-circle bg-primary bg-opacity-20 text-primary d-flex align-items-center justify-content-center"
//                       style={{ width: 40, height: 40 }}
//                     >
//                       Dr
//                     </div>
//                     <div className="flex-grow-1">
//                       <div className="fw-bold">{doctor.name}</div>
//                       <small className="text-muted">{doctor.speciality}</small>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Booking Modal */}
//       {showBookingForm && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
//         >
//           <div
//             className="bg-white rounded-4 shadow-lg p-4"
//             style={{ maxWidth: 500, width: "100%" }}
//           >
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h5 className="mb-0 fw-bold">
//                 <Calendar size={20} className="me-2" />
//                 Book Appointment
//               </h5>
//               <button
//                 className="btn btn-sm btn-outline-secondary"
//                 onClick={() => setShowBookingForm(false)}
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={submitBooking}>
//               {error && (
//                 <div className="alert alert-danger py-2 mb-3" role="alert">
//                   <AlertCircle size={16} className="me-2" />
//                   {error}
//                 </div>
//               )}
//               {success && (
//                 <div className="alert alert-success py-2 mb-3" role="alert">
//                   {success}
//                 </div>
//               )}

//               <div className="mb-3">
//                 <label className="form-label fw-medium">Doctor *</label>
//                 <select
//                   name="doctor"
//                   className="form-select"
//                   value={booking.doctor}
//                   onChange={handleBookingChange}
//                   required
//                 >
//                   <option value="">Select doctor...</option>
//                   {doctors.map((doctor) => (
//                     <option key={doctor._id} value={doctor._id}>
//                       {doctor.name} - {doctor.speciality}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="row g-3 mb-3">
//                 <div className="col-md-6">
//                   {/* ✅ Replaced date input with Day selection dropdown */}
//                   <label className="form-label fw-medium">Working Day *</label>
//                   <select
//                     name="day"
//                     className="form-select"
//                     value={booking.day}
//                     onChange={handleBookingChange}
//                     required
//                     disabled={!booking.doctor}
//                   >
//                     <option value="">Select Day...</option>
//                     {availableDays.map((day) => (
//                       <option key={day} value={day}>
//                         {day}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label fw-medium">Time Slot *</label>
//                   <select
//                     name="timeSlot"
//                     className="form-select"
//                     value={booking.timeSlot}
//                     onChange={handleBookingChange}
//                     required
//                     disabled={!booking.doctor || !booking.day}
//                   >
//                     <option value="">
//                       {booking.doctor && booking.day
//                         ? availableSlots.length > 0
//                           ? "Select time..."
//                           : "No slots available"
//                         : "Select doctor & day first"}
//                     </option>
//                     {availableSlots.map((slot) => (
//                       <option key={slot.value} value={slot.value}>
//                         {slot.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="form-label fw-medium">Notes</label>
//                 <textarea
//                   name="notes"
//                   className="form-control"
//                   rows="3"
//                   placeholder="Symptoms, reason for visit..."
//                   value={booking.notes}
//                   onChange={handleBookingChange}
//                 />
//               </div>

//               <div className="d-flex gap-2">
//                 <button
//                   type="button"
//                   className="btn btn-outline-secondary flex-grow-1"
//                   onClick={() => setShowBookingForm(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary flex-grow-1"
//                   disabled={
//                     !booking.doctor || !booking.day || !booking.timeSlot
//                   }
//                 >
//                   Book Appointment
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerAppointments;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Calendar,
//   BookOpen,
//   AlertCircle,
//   Clock,
//   ShieldCheck,
//   User,
// } from "lucide-react";

// const CustomerAppointments = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [booking, setBooking] = useState({
//     doctor: "",
//     day: "", // ✅ Updated from date to day
//     timeSlot: "",
//     notes: "",
//   });
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [availableDays, setAvailableDays] = useState([]); // ✅ Tracks doctor's unique working days

//   // Fetch doctors and my appointments
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Session expired. Please login again.");
//         setLoading(false);
//         return;
//       }

//       const [doctorsRes, appointmentsRes] = await Promise.all([
//         api.get("/doctors", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         api.get("/appointments/my", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       // ✅ FIX: Use optional chaining to prevent blank screen if data is malformed
//       setDoctors(doctorsRes.data?.doctors || doctorsRes.data || []);
//       setMyAppointments(
//         appointmentsRes.data?.appointments || appointmentsRes.data || []
//       );
//     } catch (err) {
//       console.error("CustomerAppointments fetch error:", err);
//       setError("Failed to load medical records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookingChange = (e) => {
//     setBooking({ ...booking, [e.target.name]: e.target.value });
//     setError("");
//     setSuccess("");
//   };

//   // ✅ LOGIC: Extract available days when doctor is selected
//   useEffect(() => {
//     if (booking.doctor) {
//       const doctor = doctors.find((d) => d._id === booking.doctor);
//       if (doctor && Array.isArray(doctor.slots)) {
//         // Get unique days from doctor's slots (e.g., MONDAY, TUESDAY)
//         const uniqueDays = [
//           ...new Set(doctor.slots.map((s) => s.day?.toUpperCase())),
//         ].filter(Boolean);
//         setAvailableDays(uniqueDays);
//       } else {
//         setAvailableDays([]);
//       }
//     }
//   }, [booking.doctor, doctors]);

//   // ✅ LOGIC: Recompute available slots when doctor or day changes
//   useEffect(() => {
//     if (!booking.doctor || !booking.day) {
//       setAvailableSlots([]);
//       return;
//     }

//     const doctor = doctors.find((d) => d._id === booking.doctor);
//     if (doctor && Array.isArray(doctor.slots)) {
//       // Filter slots for the selected Day
//       const slotsForDay = doctor.slots.filter(
//         (s) => s.day?.toUpperCase() === booking.day.toUpperCase()
//       );

//       const mapped = slotsForDay.map((s) => ({
//         value: `${s.startTime} - ${s.endTime}`,
//         label: `${s.startTime} — ${s.endTime}`,
//       }));

//       setAvailableSlots(mapped);

//       if (
//         booking.timeSlot &&
//         !mapped.some((m) => m.value === booking.timeSlot)
//       ) {
//         setBooking((prev) => ({ ...prev, timeSlot: "" }));
//       }
//     }
//   }, [booking.doctor, booking.day, doctors]);

//   const submitBooking = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!booking.doctor || !booking.day || !booking.timeSlot) {
//       setError("Please fill all required fields.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       await api.post(
//         "/appointments",
//         {
//           doctor: booking.doctor,
//           day: booking.day, // ✅ Sending day instead of date
//           timeSlot: booking.timeSlot,
//           notes: booking.notes,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setSuccess("Appointment booked successfully!");
//       setBooking({ doctor: "", day: "", timeSlot: "", notes: "" });

//       setTimeout(() => {
//         setShowBookingForm(false);
//         setSuccess("");
//         fetchData();
//       }, 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to book appointment.");
//     }
//   };

//   const getStatusBadge = (status) => {
//     const classes = {
//       pending: "bg-warning text-dark",
//       confirmed: "bg-success text-white",
//       completed: "bg-info text-white",
//       cancelled: "bg-secondary text-white",
//     };
//     return `badge rounded-pill px-3 py-1 ${
//       classes[status] || "bg-light text-dark"
//     }`;
//   };

//   if (loading && myAppointments.length === 0) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-50">
//         <div className="spinner-border text-primary mb-3" />
//         <span className="fw-bold text-muted">Accessing Patient Portal...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4 animate-fade-in">
//       <div className="row g-4">
//         {/* Upcoming Appointments */}
//         <div className="col-lg-8">
//           <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
//             <div className="card-header bg-white border-bottom py-3">
//               <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
//                 <Calendar size={22} className="text-primary" />
//                 My Appointment Registry
//               </h5>
//             </div>
//             <div className="card-body p-0">
//               {myAppointments.length === 0 ? (
//                 <div className="text-center py-5 text-muted">
//                   <Calendar size={48} className="mb-3 opacity-25" />
//                   <p>No health consultations scheduled yet.</p>
//                   <button
//                     className="btn btn-primary rounded-pill px-4"
//                     onClick={() => setShowBookingForm(true)}
//                   >
//                     Schedule Now
//                   </button>
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table table-hover align-middle mb-0">
//                     <thead className="table-light">
//                       <tr className="small text-uppercase fw-bold text-muted">
//                         <th className="ps-4">Day & Time</th>
//                         <th>Medical Specialist</th>
//                         <th>Status</th>
//                         <th className="pe-4 text-end">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {myAppointments.map((appt) => (
//                         <tr key={appt._id}>
//                           <td className="ps-4">
//                             <div className="fw-bold text-dark">{appt.day}</div>
//                             <small className="text-muted d-flex align-items-center gap-1">
//                               <Clock size={12} /> {appt.timeSlot}
//                             </small>
//                           </td>
//                           <td>
//                             <div className="fw-bold">
//                               {appt.doctor?.name || "Unknown"}
//                             </div>
//                             <small className="text-muted">
//                               {appt.doctor?.speciality}
//                             </small>
//                           </td>
//                           <td>
//                             <span className={getStatusBadge(appt.status)}>
//                               {appt.status?.toUpperCase()}
//                             </span>
//                           </td>
//                           <td className="pe-4 text-end">
//                             {appt.status === "pending" && (
//                               <button
//                                 className="btn btn-link text-danger p-0 small fw-bold text-decoration-none"
//                                 onClick={async () => {
//                                   if (
//                                     !window.confirm("Cancel this appointment?")
//                                   )
//                                     return;
//                                   try {
//                                     await api.put(
//                                       `/appointments/${appt._id}/status`,
//                                       { status: "cancelled" }
//                                     );
//                                     fetchData();
//                                   } catch (err) {
//                                     setError("Cancellation failed.");
//                                   }
//                                 }}
//                               >
//                                 Cancel
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Quick Book */}
//         <div className="col-lg-4">
//           <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
//             <div className="card-header bg-success text-white py-3 border-0">
//               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
//                 <BookOpen size={18} /> Quick Consultation
//               </h6>
//             </div>
//             <div className="card-body">
//               <button
//                 className="btn btn-outline-primary w-100 mb-4 rounded-pill fw-bold"
//                 onClick={() => setShowBookingForm(true)}
//               >
//                 + Schedule Appointment
//               </button>

//               <div className="list-group list-group-flush">
//                 {doctors.slice(0, 3).map((doctor) => (
//                   <button
//                     key={doctor._id}
//                     className="list-group-item list-group-item-action d-flex align-items-center gap-3 p-3 border-0"
//                     onClick={() => {
//                       setBooking((prev) => ({ ...prev, doctor: doctor._id }));
//                       setShowBookingForm(true);
//                     }}
//                   >
//                     <div
//                       className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold"
//                       style={{ width: 40, height: 40 }}
//                     >
//                       <User size={18} />
//                     </div>
//                     <div className="flex-grow-1">
//                       <div className="fw-bold small">{doctor.name}</div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         {doctor.speciality}
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Booking Modal */}
//       {showBookingForm && (
//         <div className="modal show d-block animate-fade-in" tabIndex="-1">
//           <div
//             className="modal-backdrop fade show"
//             onClick={() => setShowBookingForm(false)}
//           ></div>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//               <div className="modal-header bg-primary text-white border-0 py-3">
//                 <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
//                   <Calendar size={20} /> Schedule Consultation
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close btn-close-white shadow-none"
//                   onClick={() => setShowBookingForm(false)}
//                 ></button>
//               </div>

//               <form onSubmit={submitBooking}>
//                 <div className="modal-body p-4">
//                   {error && (
//                     <div className="alert alert-danger py-2 mb-3 small d-flex align-items-center gap-2">
//                       <AlertCircle size={16} />
//                       {error}
//                     </div>
//                   )}
//                   {success && (
//                     <div className="alert alert-success py-2 mb-3 small d-flex align-items-center gap-2">
//                       <ShieldCheck size={16} />
//                       {success}
//                     </div>
//                   )}

//                   <div className="mb-3">
//                     <label className="form-label small fw-bold text-muted text-uppercase">
//                       1. Choose Specialist
//                     </label>
//                     <select
//                       name="doctor"
//                       className="form-select border-2"
//                       value={booking.doctor}
//                       onChange={handleBookingChange}
//                       required
//                     >
//                       <option value="">Select doctor...</option>
//                       {doctors.map((d) => (
//                         <option key={d._id} value={d._id}>
//                           {d.name} — {d.speciality}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="row g-3 mb-3">
//                     <div className="col-md-6">
//                       {/* ✅ FIXED: Replaced date input with Working Day dropdown */}
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         2. Working Day
//                       </label>
//                       <select
//                         name="day"
//                         className="form-select border-2"
//                         value={booking.day}
//                         onChange={handleBookingChange}
//                         required
//                         disabled={!booking.doctor}
//                       >
//                         <option value="">Choose Day...</option>
//                         {availableDays.map((day) => (
//                           <option key={day} value={day}>
//                             {day}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         3. Allotted Time
//                       </label>
//                       <select
//                         name="timeSlot"
//                         className="form-select border-2"
//                         value={booking.timeSlot}
//                         onChange={handleBookingChange}
//                         required
//                         disabled={!booking.day}
//                       >
//                         <option value="">
//                           {booking.day ? "Select Time..." : "Pick day first"}
//                         </option>
//                         {availableSlots.map((slot) => (
//                           <option key={slot.value} value={slot.value}>
//                             {slot.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="mb-0">
//                     <label className="form-label small fw-bold text-muted text-uppercase">
//                       Symptoms or reason for visit
//                     </label>
//                     <textarea
//                       name="notes"
//                       className="form-control border-2 shadow-none"
//                       rows="3"
//                       placeholder="Describe your concern..."
//                       value={booking.notes}
//                       onChange={handleBookingChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="modal-footer border-0 p-4 pt-0">
//                   <button
//                     type="button"
//                     className="btn btn-light rounded-pill px-4 fw-bold"
//                     onClick={() => setShowBookingForm(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
//                     disabled={!booking.timeSlot || success}
//                   >
//                     Book Appointment
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.4s ease; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerAppointments;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Calendar,
//   BookOpen,
//   AlertCircle,
//   Clock,
//   ShieldCheck,
//   User,
// } from "lucide-react";

// const CustomerAppointments = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [booking, setBooking] = useState({
//     doctor: "",
//     day: "",
//     timeSlot: "",
//     notes: "",
//   });
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [availableDays, setAvailableDays] = useState([]);

//   // Fetch doctors and my appointments
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Session expired. Please login again.");
//         setLoading(false);
//         return;
//       }

//       const [doctorsRes, appointmentsRes] = await Promise.all([
//         // ✅ FIX: Changed endpoint from /admin/doctors to /doctors to fix sync error
//         api.get("/doctors", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         api.get("/appointments/my", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       // ✅ FIX: Enhanced data extraction with safety guards to prevent blank screens
//       const docData = doctorsRes.data?.doctors || doctorsRes.data || [];
//       const apptData =
//         appointmentsRes.data?.appointments || appointmentsRes.data || [];

//       setDoctors(Array.isArray(docData) ? docData : []);
//       setMyAppointments(Array.isArray(apptData) ? apptData : []);
//     } catch (err) {
//       console.error("CustomerAppointments fetch error:", err);
//       // This error usually appears if the backend route /api/doctors doesn't exist yet
//       setError("Failed to sync with medical database.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookingChange = (e) => {
//     setBooking({ ...booking, [e.target.name]: e.target.value });
//     setError("");
//     setSuccess("");
//   };

//   // ✅ LOGIC: Extract available days when doctor is selected
//   useEffect(() => {
//     if (booking.doctor) {
//       const doctor = doctors.find((d) => d._id === booking.doctor);
//       if (doctor && Array.isArray(doctor.slots)) {
//         // Get unique days and force Uppercase to match DB schema
//         const uniqueDays = [
//           ...new Set(doctor.slots.map((s) => s.day?.toUpperCase())),
//         ].filter(Boolean);
//         setAvailableDays(uniqueDays);
//       } else {
//         setAvailableDays([]);
//       }
//     }
//   }, [booking.doctor, doctors]);

//   // ✅ LOGIC: Recompute available slots when doctor or day changes
//   useEffect(() => {
//     if (!booking.doctor || !booking.day) {
//       setAvailableSlots([]);
//       return;
//     }

//     const doctor = doctors.find((d) => d._id === booking.doctor);
//     if (doctor && Array.isArray(doctor.slots)) {
//       // Filter slots for the selected Day
//       const slotsForDay = doctor.slots.filter(
//         (s) => s.day?.toUpperCase() === booking.day.toUpperCase()
//       );

//       const mapped = slotsForDay.map((s) => ({
//         value: `${s.startTime} - ${s.endTime}`,
//         label: `${s.startTime} — ${s.endTime}`,
//       }));

//       setAvailableSlots(mapped);

//       if (
//         booking.timeSlot &&
//         !mapped.some((m) => m.value === booking.timeSlot)
//       ) {
//         setBooking((prev) => ({ ...prev, timeSlot: "" }));
//       }
//     }
//   }, [booking.doctor, booking.day, doctors]);

//   const submitBooking = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!booking.doctor || !booking.day || !booking.timeSlot) {
//       setError("Please fill all required fields.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       await api.post(
//         "/appointments",
//         {
//           doctor: booking.doctor,
//           day: booking.day,
//           timeSlot: booking.timeSlot,
//           notes: booking.notes,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setSuccess("Appointment booked successfully!");
//       setBooking({ doctor: "", day: "", timeSlot: "", notes: "" });

//       setTimeout(() => {
//         setShowBookingForm(false);
//         setSuccess("");
//         fetchData();
//       }, 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to book appointment.");
//     }
//   };

//   const getStatusBadge = (status) => {
//     const classes = {
//       pending: "bg-warning text-dark",
//       confirmed: "bg-success text-white",
//       completed: "bg-info text-white",
//       cancelled: "bg-secondary text-white",
//     };
//     return `badge rounded-pill px-3 py-1 ${
//       classes[status] || "bg-light text-dark"
//     }`;
//   };

//   if (loading && myAppointments.length === 0) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-50">
//         <div className="spinner-border text-primary mb-3" />
//         <span className="fw-bold text-muted">Accessing Patient Portal...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4 animate-fade-in">
//       <div className="row g-4">
//         {/* Upcoming Appointments */}
//         <div className="col-lg-8">
//           <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
//             <div className="card-header bg-white border-bottom py-3">
//               <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
//                 <Calendar size={22} className="text-primary" />
//                 My Appointment Registry
//               </h5>
//             </div>
//             <div className="card-body p-0">
//               {myAppointments.length === 0 ? (
//                 <div className="text-center py-5 text-muted">
//                   <Calendar size={48} className="mb-3 opacity-25" />
//                   <p>No health consultations scheduled yet.</p>
//                   <button
//                     className="btn btn-primary rounded-pill px-4"
//                     onClick={() => setShowBookingForm(true)}
//                   >
//                     Schedule Now
//                   </button>
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table table-hover align-middle mb-0">
//                     <thead className="table-light">
//                       <tr className="small text-uppercase fw-bold text-muted">
//                         <th className="ps-4">Day & Time</th>
//                         <th>Medical Specialist</th>
//                         <th>Status</th>
//                         <th className="pe-4 text-end">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {myAppointments.map((appt) => (
//                         <tr key={appt._id}>
//                           <td className="ps-4">
//                             <div className="fw-bold text-dark">{appt.day}</div>
//                             <small className="text-muted d-flex align-items-center gap-1">
//                               <Clock size={12} /> {appt.timeSlot}
//                             </small>
//                           </td>
//                           <td>
//                             <div className="fw-bold">
//                               {appt.doctor?.name || "Unknown"}
//                             </div>
//                             <small className="text-muted">
//                               {appt.doctor?.speciality}
//                             </small>
//                           </td>
//                           <td>
//                             <span className={getStatusBadge(appt.status)}>
//                               {appt.status?.toUpperCase()}
//                             </span>
//                           </td>
//                           <td className="pe-4 text-end">
//                             {appt.status === "pending" && (
//                               <button
//                                 className="btn btn-link text-danger p-0 small fw-bold text-decoration-none"
//                                 onClick={async () => {
//                                   if (
//                                     !window.confirm("Cancel this appointment?")
//                                   )
//                                     return;
//                                   try {
//                                     await api.put(
//                                       `/appointments/${appt._id}/status`,
//                                       { status: "cancelled" }
//                                     );
//                                     fetchData();
//                                   } catch (err) {
//                                     setError("Cancellation failed.");
//                                   }
//                                 }}
//                               >
//                                 Cancel
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Quick Book Panel */}
//         <div className="col-lg-4">
//           <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
//             <div className="card-header bg-success text-white py-3 border-0">
//               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
//                 <BookOpen size={18} /> Quick Consultation
//               </h6>
//             </div>
//             <div className="card-body">
//               <button
//                 className="btn btn-outline-primary w-100 mb-4 rounded-pill fw-bold"
//                 onClick={() => setShowBookingForm(true)}
//               >
//                 + Schedule Appointment
//               </button>

//               <div className="list-group list-group-flush">
//                 {doctors.slice(0, 3).map((doctor) => (
//                   <button
//                     key={doctor._id}
//                     className="list-group-item list-group-item-action d-flex align-items-center gap-3 p-3 border-0"
//                     onClick={() => {
//                       setBooking((prev) => ({ ...prev, doctor: doctor._id }));
//                       setShowBookingForm(true);
//                     }}
//                   >
//                     <div
//                       className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold"
//                       style={{ width: 40, height: 40 }}
//                     >
//                       <User size={18} />
//                     </div>
//                     <div className="flex-grow-1">
//                       <div className="fw-bold small">{doctor.name}</div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         {doctor.speciality}
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Booking Modal */}
//       {showBookingForm && (
//         <div className="modal show d-block animate-fade-in" tabIndex="-1">
//           <div
//             className="modal-backdrop fade show"
//             onClick={() => setShowBookingForm(false)}
//           ></div>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//               <div className="modal-header bg-primary text-white border-0 py-3">
//                 <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
//                   <Calendar size={20} /> Schedule Consultation
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close btn-close-white shadow-none"
//                   onClick={() => setShowBookingForm(false)}
//                 ></button>
//               </div>

//               <form onSubmit={submitBooking}>
//                 <div className="modal-body p-4">
//                   {error && (
//                     <div className="alert alert-danger py-2 mb-3 small d-flex align-items-center gap-2">
//                       <AlertCircle size={16} />
//                       {error}
//                     </div>
//                   )}
//                   {success && (
//                     <div className="alert alert-success py-2 mb-3 small d-flex align-items-center gap-2">
//                       <ShieldCheck size={16} />
//                       {success}
//                     </div>
//                   )}

//                   <div className="mb-3">
//                     <label className="form-label small fw-bold text-muted text-uppercase">
//                       1. Choose Specialist
//                     </label>
//                     <select
//                       name="doctor"
//                       className="form-select border-2"
//                       value={booking.doctor}
//                       onChange={handleBookingChange}
//                       required
//                     >
//                       <option value="">Select doctor...</option>
//                       {doctors.map((d) => (
//                         <option key={d._id} value={d._id}>
//                           {d.name} — {d.speciality}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="row g-3 mb-3">
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         2. Working Day
//                       </label>
//                       <select
//                         name="day"
//                         className="form-select border-2"
//                         value={booking.day}
//                         onChange={handleBookingChange}
//                         required
//                         disabled={!booking.doctor}
//                       >
//                         <option value="">Choose Day...</option>
//                         {availableDays.map((day) => (
//                           <option key={day} value={day}>
//                             {day}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         3. Allotted Time
//                       </label>
//                       <select
//                         name="timeSlot"
//                         className="form-select border-2"
//                         value={booking.timeSlot}
//                         onChange={handleBookingChange}
//                         required
//                         disabled={!booking.day}
//                       >
//                         <option value="">
//                           {booking.day ? "Select Time..." : "Pick day first"}
//                         </option>
//                         {availableSlots.map((slot) => (
//                           <option key={slot.value} value={slot.value}>
//                             {slot.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="mb-0">
//                     <label className="form-label small fw-bold text-muted text-uppercase">
//                       Symptoms or reason for visit
//                     </label>
//                     <textarea
//                       name="notes"
//                       className="form-control border-2 shadow-none"
//                       rows="3"
//                       placeholder="Describe your concern..."
//                       value={booking.notes}
//                       onChange={handleBookingChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="modal-footer border-0 p-4 pt-0">
//                   <button
//                     type="button"
//                     className="btn btn-light rounded-pill px-4 fw-bold"
//                     onClick={() => setShowBookingForm(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
//                     disabled={!booking.timeSlot || success}
//                   >
//                     Book Appointment
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.4s ease; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerAppointments;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Calendar,
//   BookOpen,
//   AlertCircle,
//   Clock,
//   ShieldCheck,
//   User,
//   Loader2,
// } from "lucide-react";

// const CustomerAppointments = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [booking, setBooking] = useState({
//     doctor: "",
//     day: "",
//     timeSlot: "",
//     notes: "",
//   });
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [availableDays, setAvailableDays] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       // ✅ FIX: Using public route /doctors instead of admin route to avoid 403 error
//       const [doctorsRes, appointmentsRes] = await Promise.all([
//         api.get("/doctors", { headers: { Authorization: `Bearer ${token}` } }),
//         api.get("/appointments/my", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);
//       setDoctors(doctorsRes.data?.doctors || doctorsRes.data || []);
//       setMyAppointments(
//         appointmentsRes.data?.appointments || appointmentsRes.data || []
//       );
//     } catch (err) {
//       setError("Failed to sync with medical database.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (booking.doctor) {
//       const doctor = doctors.find((d) => d._id === booking.doctor);
//       if (doctor?.slots) {
//         // ✅ FIX: Normalize days to Uppercase for dropdown population
//         const uniqueDays = [
//           ...new Set(doctor.slots.map((s) => s.day?.toUpperCase())),
//         ].filter(Boolean);
//         setAvailableDays(uniqueDays);
//       }
//     }
//   }, [booking.doctor, doctors]);

//   useEffect(() => {
//     if (booking.doctor && booking.day) {
//       const doctor = doctors.find((d) => d._id === booking.doctor);
//       const slots = doctor.slots.filter(
//         (s) => s.day?.toUpperCase() === booking.day.toUpperCase()
//       );
//       setAvailableSlots(
//         slots.map((s) => ({
//           value: `${s.startTime} - ${s.endTime}`,
//           label: `${s.startTime} — ${s.endTime}`,
//         }))
//       );
//     }
//   }, [booking.doctor, booking.day, doctors]);

//   const submitBooking = async (e) => {
//     e.preventDefault(); // ✅ Ensures the button click is handled
//     try {
//       await api.post("/appointments", booking);
//       setSuccess("Booked successfully!");
//       setTimeout(() => {
//         setShowBookingForm(false);
//         fetchData();
//       }, 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Booking failed.");
//     }
//   };

//   const getStatusBadge = (s) => {
//     const colors = {
//       pending: "bg-warning",
//       confirmed: "bg-success text-white",
//       cancelled: "bg-secondary text-white",
//     };
//     return `badge rounded-pill px-3 py-1 ${colors[s] || "bg-light"}`;
//   };

//   if (loading && myAppointments.length === 0)
//     return (
//       <div className="text-center py-5">
//         <Loader2 className="animate-spin text-primary" />
//       </div>
//     );

//   return (
//     <div className="container-fluid py-4 animate-fade-in">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h5 className="fw-bold mb-0">My Appointment Registry</h5>
//         <button
//           className="btn btn-primary rounded-pill px-4"
//           onClick={() => setShowBookingForm(true)}
//         >
//           Book New
//         </button>
//       </div>

//       <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="table-light">
//               <tr className="small text-uppercase fw-bold text-muted">
//                 <th className="ps-4">Schedule</th>
//                 <th>Specialist</th>
//                 <th>Status</th>
//                 <th className="text-end pe-4">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {myAppointments.map((appt) => (
//                 <tr key={appt._id}>
//                   <td className="ps-4">
//                     <strong>{appt.day}</strong>
//                     <br />
//                     <small>{appt.timeSlot}</small>
//                   </td>
//                   <td>{appt.doctor?.name}</td>
//                   <td>
//                     <span className={getStatusBadge(appt.status)}>
//                       {appt.status?.toUpperCase()}
//                     </span>
//                   </td>
//                   <td className="text-end pe-4">
//                     {appt.status === "pending" && (
//                       <button
//                         className="btn btn-link text-danger p-0"
//                         onClick={() => fetchData()}
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showBookingForm && (
//         <div
//           className="modal show d-block"
//           tabIndex="-1"
//           style={{ background: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//               <form onSubmit={submitBooking}>
//                 {" "}
//                 {/* ✅ Form MUST wrap everything */}
//                 <div className="modal-header bg-primary text-white border-0">
//                   <h5 className="modal-title fw-bold">New Consultation</h5>
//                   <button
//                     type="button"
//                     className="btn-close btn-close-white"
//                     onClick={() => setShowBookingForm(false)}
//                   ></button>
//                 </div>
//                 <div className="modal-body p-4">
//                   {error && (
//                     <div className="alert alert-danger py-2 mb-3">{error}</div>
//                   )}
//                   {success && (
//                     <div className="alert alert-success py-2 mb-3">
//                       {success}
//                     </div>
//                   )}
//                   <div className="mb-3">
//                     <label className="small fw-bold text-muted">
//                       Specialist
//                     </label>
//                     <select
//                       name="doctor"
//                       className="form-select"
//                       value={booking.doctor}
//                       onChange={(e) =>
//                         setBooking({ ...booking, doctor: e.target.value })
//                       }
//                       required
//                     >
//                       <option value="">Select...</option>
//                       {doctors.map((d) => (
//                         <option key={d._id} value={d._id}>
//                           {d.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="row g-3">
//                     <div className="col-6">
//                       <label className="small fw-bold text-muted">
//                         Working Day
//                       </label>
//                       <select
//                         name="day"
//                         className="form-select"
//                         value={booking.day}
//                         onChange={(e) =>
//                           setBooking({ ...booking, day: e.target.value })
//                         }
//                         required
//                         disabled={!booking.doctor}
//                       >
//                         <option value="">Day...</option>
//                         {availableDays.map((d) => (
//                           <option key={d} value={d}>
//                             {d}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="col-6">
//                       <label className="small fw-bold text-muted">
//                         Time Slot
//                       </label>
//                       <select
//                         name="timeSlot"
//                         className="form-select"
//                         value={booking.timeSlot}
//                         onChange={(e) =>
//                           setBooking({ ...booking, timeSlot: e.target.value })
//                         }
//                         required
//                         disabled={!booking.day}
//                       >
//                         <option value="">Time...</option>
//                         {availableSlots.map((s) => (
//                           <option key={s.value} value={s.value}>
//                             {s.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="modal-footer border-0 p-4 pt-0">
//                   <button
//                     type="submit"
//                     className="btn btn-primary w-100 rounded-pill fw-bold"
//                     disabled={!booking.timeSlot}
//                   >
//                     Confirm Booking
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerAppointments;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   Hash,
//   Plus,
//   AlertCircle,
//   Loader2,
// } from "lucide-react";
// import BookAppointmentModal from "../components/BookAppointmentModal";

// const CustomerAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);

//   const fetchAppointments = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await api.get("/appointments/my", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAppointments(data);
//     } catch (err) {
//       console.error("Failed to load appointments", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   // ✅ Helper to safely format dates
//   const formatDate = (dateString, dayFallback) => {
//     if (!dateString) return dayFallback || "N/A";
//     const date = new Date(dateString);
//     // Check if date is valid
//     if (isNaN(date.getTime())) return dayFallback || "N/A";

//     return date.toLocaleDateString("en-US", {
//       weekday: "short",
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const getStatusBadge = (status) => {
//     const colors = {
//       pending: "bg-warning text-dark",
//       confirmed: "bg-primary text-white",
//       completed: "bg-success text-white",
//       cancelled: "bg-danger text-white",
//     };
//     return `badge rounded-pill px-3 py-2 ${colors[status] || "bg-secondary"}`;
//   };

//   return (
//     <div className="container-fluid p-4">
//       {/* Header Section */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h3 className="fw-bold text-dark mb-1">My Appointments</h3>
//           <p className="text-muted small mb-0">
//             Manage your upcoming and past visits.
//           </p>
//         </div>
//       </div>

//       <div className="row g-4">
//         {/* Left Column: Appointment List */}
//         <div className="col-lg-8">
//           <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
//             {loading ? (
//               <div className="text-center py-5">
//                 <Loader2 className="animate-spin text-primary" size={40} />
//               </div>
//             ) : appointments.length === 0 ? (
//               <div className="text-center py-5">
//                 <Calendar size={48} className="text-muted opacity-25 mb-3" />
//                 <h5>No Appointments Yet</h5>
//                 <p className="text-muted">
//                   Book your first consultation today.
//                 </p>
//                 <button
//                   className="btn btn-primary rounded-pill px-4 mt-2"
//                   onClick={() => setShowModal(true)}
//                 >
//                   Book Now
//                 </button>
//               </div>
//             ) : (
//               <div className="table-responsive">
//                 <table className="table table-hover align-middle mb-0">
//                   <thead className="bg-light">
//                     <tr>
//                       <th className="ps-4 py-3 text-muted small text-uppercase border-0">
//                         Date & Time
//                       </th>
//                       <th className="text-muted small text-uppercase border-0">
//                         Doctor
//                       </th>
//                       <th className="text-muted small text-uppercase border-0">
//                         Reference
//                       </th>
//                       <th className="text-end pe-4 text-muted small text-uppercase border-0">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {appointments.map((appt) => (
//                       <tr key={appt._id}>
//                         <td className="ps-4">
//                           {/* ✅ If date is invalid, fallback to the 'day' string (e.g. 'FRIDAY') */}
//                           <div className="fw-bold text-dark">
//                             {new Date(appt.date).toString() !== "Invalid Date"
//                               ? new Date(appt.date).toLocaleDateString()
//                               : appt.day || "N/A"}
//                           </div>
//                           <div className="small text-muted d-flex align-items-center gap-1">
//                             <Clock size={12} /> {appt.timeSlot}
//                           </div>
//                         </td>
//                         <td>
//                           <div className="fw-bold text-dark">
//                             Dr. {appt.doctor?.name || "Unknown"}
//                           </div>
//                           <div className="small text-muted">
//                             {appt.doctor?.speciality}
//                           </div>
//                         </td>
//                         <td>
//                           <span className="badge bg-light text-dark border font-monospace">
//                             {appt.bookingReference || "N/A"}
//                           </span>
//                         </td>
//                         <td className="text-end pe-4">
//                           <span className={getStatusBadge(appt.status)}>
//                             {appt.status.toUpperCase()}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Column: Quick Actions */}
//         <div className="col-lg-4">
//           <div className="card border-0 shadow-sm rounded-4 bg-primary text-white p-4 mb-3 position-relative overflow-hidden">
//             <div className="position-relative z-1">
//               <h4 className="fw-bold mb-1">Quick Book</h4>
//               <p className="text-white text-opacity-75 mb-4">
//                 Need a consultation? Check real-time availability.
//               </p>
//               <button
//                 className="btn btn-light w-100 rounded-pill fw-bold text-primary shadow-sm"
//                 onClick={() => setShowModal(true)}
//               >
//                 <Plus size={18} className="me-2" /> New Appointment
//               </button>
//             </div>
//             <div
//               className="position-absolute top-0 end-0 bg-white opacity-10 rounded-circle"
//               style={{
//                 width: 150,
//                 height: 150,
//                 transform: "translate(30%, -30%)",
//               }}
//             ></div>
//           </div>

//           <div className="card border-0 shadow-sm rounded-4 p-4">
//             <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
//               <AlertCircle size={18} className="text-warning" /> Important Note
//             </h6>
//             <p className="text-muted small mb-0">
//               Please arrive 10 minutes before your scheduled time. If you need
//               to cancel, please do so at least 2 hours in advance.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Booking Modal */}
//       <BookAppointmentModal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         onSuccess={() => {
//           fetchAppointments(); // Refresh list after booking
//         }}
//       />
//     </div>
//   );
// };

// export default CustomerAppointments;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   Hash,
//   Plus,
//   AlertCircle,
//   Loader2,
// } from "lucide-react";
// import BookAppointmentModal from "../components/BookAppointmentModal";

// const CustomerAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);

//   const fetchAppointments = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await api.get("/appointments/my", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAppointments(data);
//     } catch (err) {
//       console.error("Failed to load appointments", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   // ✅ Helper to safely format dates with a reliable fallback
//   const formatDate = (dateString, dayFallback) => {
//     if (!dateString) return dayFallback || "N/A";
//     const date = new Date(dateString);

//     // Check if date is valid
//     if (isNaN(date.getTime())) return dayFallback || "N/A";

//     return date.toLocaleDateString("en-US", {
//       weekday: "short",
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const getStatusBadge = (status) => {
//     const colors = {
//       pending: "bg-warning text-dark",
//       confirmed: "bg-primary text-white",
//       completed: "bg-success text-white",
//       cancelled: "bg-danger text-white",
//     };
//     return `badge rounded-pill px-3 py-2 ${colors[status] || "bg-secondary"}`;
//   };

//   return (
//     <div className="container-fluid p-4">
//       {/* Header Section */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h3 className="fw-bold text-dark mb-1">My Appointments</h3>
//           <p className="text-muted small mb-0">
//             Manage your upcoming and past visits.
//           </p>
//         </div>
//       </div>

//       <div className="row g-4">
//         {/* Left Column: Appointment List */}
//         <div className="col-lg-8">
//           <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
//             {loading ? (
//               <div className="text-center py-5">
//                 <Loader2 className="animate-spin text-primary" size={40} />
//               </div>
//             ) : appointments.length === 0 ? (
//               <div className="text-center py-5">
//                 <Calendar size={48} className="text-muted opacity-25 mb-3" />
//                 <h5>No Appointments Yet</h5>
//                 <p className="text-muted">
//                   Book your first consultation today.
//                 </p>
//                 <button
//                   className="btn btn-primary rounded-pill px-4 mt-2"
//                   onClick={() => setShowModal(true)}
//                 >
//                   Book Now
//                 </button>
//               </div>
//             ) : (
//               <div className="table-responsive">
//                 <table className="table table-hover align-middle mb-0">
//                   <thead className="bg-light">
//                     <tr>
//                       <th className="ps-4 py-3 text-muted small text-uppercase border-0">
//                         Date & Time
//                       </th>
//                       <th className="text-muted small text-uppercase border-0">
//                         Doctor
//                       </th>
//                       <th className="text-muted small text-uppercase border-0">
//                         Reference
//                       </th>
//                       <th className="text-end pe-4 text-muted small text-uppercase border-0">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {appointments.map((appt) => (
//                       <tr key={appt._id}>
//                         <td className="ps-4">
//                           <div className="fw-bold text-dark">
//                             {new Date(appt.date).toString() !== "Invalid Date"
//                               ? formatDate(appt.date)
//                               : appt.day || "N/A"}
//                           </div>
//                           <div className="small text-muted d-flex align-items-center gap-1">
//                             <Clock size={12} /> {appt.timeSlot}
//                           </div>
//                         </td>
//                         <td>
//                           <div className="fw-bold text-dark">
//                             Dr. {appt.doctor?.name || "Unknown"}
//                           </div>
//                           <div className="small text-muted">
//                             {appt.doctor?.speciality}
//                           </div>
//                         </td>
//                         <td>
//                           <span className="badge bg-light text-dark border font-monospace">
//                             {appt.bookingReference || "N/A"}
//                           </span>
//                         </td>
//                         <td className="text-end pe-4">
//                           <span className={getStatusBadge(appt.status)}>
//                             {appt.status.toUpperCase()}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Column: Quick Actions */}
//         <div className="col-lg-4">
//           <div className="card border-0 shadow-sm rounded-4 bg-primary text-white p-4 mb-3 position-relative overflow-hidden">
//             <div className="position-relative z-1">
//               <h4 className="fw-bold mb-1">Quick Book</h4>
//               <p className="text-white text-opacity-75 mb-4">
//                 Need a consultation? Check real-time availability.
//               </p>
//               <button
//                 className="btn btn-light w-100 rounded-pill fw-bold text-primary shadow-sm"
//                 onClick={() => setShowModal(true)}
//               >
//                 <Plus size={18} className="me-2" /> New Appointment
//               </button>
//             </div>
//             <div
//               className="position-absolute top-0 end-0 bg-white opacity-10 rounded-circle"
//               style={{
//                 width: 150,
//                 height: 150,
//                 transform: "translate(30%, -30%)",
//               }}
//             ></div>
//           </div>

//           <div className="card border-0 shadow-sm rounded-4 p-4">
//             <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
//               <AlertCircle size={18} className="text-warning" /> Important Note
//             </h6>
//             <p className="text-muted small mb-0">
//               Please arrive 10 minutes before your scheduled time. If you need
//               to cancel, please do so at least 2 hours in advance.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Booking Modal */}
//       <BookAppointmentModal
//         key={showModal ? "open" : "closed"}
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         onSuccess={() => {
//           fetchAppointments(); // Refresh list after booking
//         }}
//       />
//     </div>
//   );
// };

// export default CustomerAppointments;

import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Calendar,
  Clock,
  MapPin,
  Hash,
  Plus,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import BookAppointmentModal from "../components/BookAppointmentModal";

const CustomerAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get("/appointments/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Cancel Appointment Logic
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

  // ✅ Helper to safely format dates
  const formatDate = (dateString, dayFallback) => {
    if (!dateString) return dayFallback || "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dayFallback || "N/A";

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-warning text-dark",
      confirmed: "bg-primary text-white",
      completed: "bg-success text-white",
      cancelled: "bg-danger text-white",
    };
    return `badge rounded-pill px-3 py-2 ${colors[status] || "bg-secondary"}`;
  };

  return (
    <div className="container-fluid p-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">My Appointments</h3>
          <p className="text-muted small mb-0">
            Manage your upcoming and past visits.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Appointment List */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            {loading ? (
              <div className="text-center py-5">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-5">
                <Calendar size={48} className="text-muted opacity-25 mb-3" />
                <h5>No Appointments Yet</h5>
                <p className="text-muted">
                  Book your first consultation today.
                </p>
                <button
                  className="btn btn-primary rounded-pill px-4 mt-2"
                  onClick={() => setShowModal(true)}
                >
                  Book Now
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-4 py-3 text-muted small text-uppercase border-0">
                        Date & Time
                      </th>
                      <th className="text-muted small text-uppercase border-0">
                        Doctor
                      </th>
                      <th className="text-muted small text-uppercase border-0">
                        Reference
                      </th>
                      <th className="text-muted small text-uppercase border-0 text-center">
                        Status
                      </th>
                      <th className="text-end pe-4 text-muted small text-uppercase border-0">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt._id}>
                        <td className="ps-4">
                          <div className="fw-bold text-dark">
                            {new Date(appt.date).toString() !== "Invalid Date"
                              ? formatDate(appt.date)
                              : appt.day || "N/A"}
                          </div>
                          <div className="small text-muted d-flex align-items-center gap-1">
                            <Clock size={12} /> {appt.timeSlot}
                          </div>
                        </td>
                        <td>
                          <div className="fw-bold text-dark">
                            Dr. {appt.doctor?.name || "Unknown"}
                          </div>
                          <div className="small text-muted">
                            {appt.doctor?.speciality}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border font-monospace">
                            {appt.bookingReference || "N/A"}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className={getStatusBadge(appt.status)}>
                            {appt.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="text-end pe-4">
                          {["pending", "confirmed"].includes(appt.status) ? (
                            <button
                              className="btn btn-outline-danger btn-sm rounded-pill px-3"
                              onClick={() => handleCancel(appt._id)}
                              disabled={actionLoading === appt._id}
                            >
                              {actionLoading === appt._id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                "Cancel"
                              )}
                            </button>
                          ) : (
                            <span className="text-muted small">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 bg-primary text-white p-4 mb-3 position-relative overflow-hidden">
            <div className="position-relative z-1">
              <h4 className="fw-bold mb-1">Quick Book</h4>
              <p className="text-white text-opacity-75 mb-4">
                Need a consultation? Check real-time availability.
              </p>
              <button
                className="btn btn-light w-100 rounded-pill fw-bold text-primary shadow-sm"
                onClick={() => setShowModal(true)}
              >
                <Plus size={18} className="me-2" /> New Appointment
              </button>
            </div>
            <div
              className="position-absolute top-0 end-0 bg-white opacity-10 rounded-circle"
              style={{
                width: 150,
                height: 150,
                transform: "translate(30%, -30%)",
              }}
            ></div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <AlertCircle size={18} className="text-warning" /> Important Note
            </h6>
            <p className="text-muted small mb-0">
              Please arrive 10 minutes before your scheduled time. If you need
              to cancel, please do so at least 2 hours in advance.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookAppointmentModal
        key={showModal ? "open" : "closed"}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          fetchAppointments(); // Refresh list after booking
        }}
      />
    </div>
  );
};

export default CustomerAppointments;
