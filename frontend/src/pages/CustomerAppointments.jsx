// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   Plus,
//   AlertCircle,
//   Loader2,
//   ArrowLeft,
//   CalendarCheck,
//   Video,
//   FileText,
//   RotateCcw,
//   UserRound,
// } from "lucide-react";
// import BookAppointmentModal from "../components/BookAppointmentModal";

// const CustomerAppointments = () => {
//   const navigate = useNavigate();
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [actionLoading, setActionLoading] = useState(null);

//   // ✅ NEW STATE: To remember which doctor to pre-fill in the modal
//   const [preselectedDoctorId, setPreselectedDoctorId] = useState(null);

//   const fetchAppointments = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await api.get("/appointments/my", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       // Sort appointments: newest first
//       const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
//       setAppointments(sorted);
//     } catch (err) {
//       console.error("Failed to load appointments", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   // Cancel Appointment Logic
//   const handleCancel = async (apptId) => {
//     if (!window.confirm("Are you sure you want to cancel this appointment?"))
//       return;

//     try {
//       setActionLoading(apptId);
//       await api.put(`/appointments/${apptId}/status`, { status: "cancelled" });
//       fetchAppointments();
//     } catch (err) {
//       alert(err.response?.data?.message || "Cancellation failed");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // Format Dates safely
//   const formatDate = (dateString, dayFallback) => {
//     if (!dateString) return dayFallback || "N/A";
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return dayFallback || "N/A";

//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-warning text-dark border-warning";
//       case "confirmed":
//         return "bg-success bg-opacity-10 text-success border-success";
//       case "completed":
//         return "bg-primary bg-opacity-10 text-primary border-primary";
//       case "cancelled":
//         return "bg-danger bg-opacity-10 text-danger border-danger";
//       default:
//         return "bg-secondary bg-opacity-10 text-secondary border-secondary";
//     }
//   };

//   // Fallback realistic doctor image based on name to make it look professional
//   // ✅ UPDATED: Checks for a real image first, then falls back to initials
//   const getDoctorImage = (doctor) => {
//     // 1. If the doctor has an uploaded image in your database (e.g., doctor.image or doctor.profilePic)
//     if (doctor?.image && doctor.image !== "none") {
//       return doctor.image.startsWith("http")
//         ? doctor.image
//         : `http://localhost:5000${doctor.image}`; // Append your backend URL
//     }

//     // 2. Fallback: Generate an avatar based on their name if no image is uploaded
//     return `https://ui-avatars.com/api/?name=${doctor?.name || "Doctor"}&background=eff6ff&color=2563eb&size=150&font-size=0.33`;
//   };

//   return (
//     <div
//       className="medical-dashboard-bg min-vh-100 py-4 px-3 px-md-4 px-xl-5 animate-fade-in"
//       style={{ backgroundColor: "#f8fafc" }}
//     >
//       {/* --- HEADER SECTION --- */}
//       <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 border-bottom border-light-subtle pb-3">
//         <div className="d-flex align-items-center gap-3">
//           <button
//             className="btn btn-white shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center border-light-subtle text-secondary hover-lift"
//             onClick={() => navigate("/customer-dashboard")}
//             title="Back to Dashboard"
//           >
//             <ArrowLeft size={20} />
//           </button>
//           <div>
//             <h3 className="fw-black mb-0 text-dark tracking-tight d-flex align-items-center gap-2">
//               <CalendarCheck className="text-primary" size={28} />
//               Your Appointments
//             </h3>
//           </div>
//         </div>
//         <button
//           className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift d-flex align-items-center gap-2"
//           onClick={() => {
//             setPreselectedDoctorId(null); // Clear any specific doctor for a general new booking
//             setShowModal(true);
//           }}
//         >
//           <Plus size={18} /> Book New Visit
//         </button>
//       </div>

//       <div className="row g-4">
//         {/* --- LEFT COLUMN: AMAZON STYLE APPOINTMENT LIST --- */}
//         <div className="col-lg-8">
//           {loading ? (
//             <div className="d-flex flex-column justify-content-center align-items-center py-5 my-4 bg-white rounded-4 border border-light-subtle">
//               <Loader2 className="spin-animation text-primary mb-3" size={40} />
//               <span className="text-muted fw-semibold">
//                 Loading your visits...
//               </span>
//             </div>
//           ) : appointments.length === 0 ? (
//             <div className="text-center py-5 my-4 bg-white rounded-4 border border-light-subtle shadow-sm">
//               <img
//                 src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop"
//                 alt="No appointments"
//                 className="mb-4 rounded-circle object-fit-cover shadow-sm"
//                 style={{ width: "150px", height: "150px" }}
//               />
//               <h4 className="fw-black text-dark">No Appointments Yet</h4>
//               <p className="text-muted mb-4">
//                 You haven't scheduled any consultations. Book your first visit
//                 today.
//               </p>
//               <button
//                 className="btn btn-primary rounded-pill px-5 py-2 fw-bold hover-lift shadow-sm"
//                 onClick={() => {
//                   setPreselectedDoctorId(null);
//                   setShowModal(true);
//                 }}
//               >
//                 Book Now
//               </button>
//             </div>
//           ) : (
//             <div className="d-flex flex-column gap-4">
//               {appointments.map((appt) => (
//                 <div
//                   key={appt._id}
//                   className="card border-light-subtle shadow-sm rounded-4 overflow-hidden bg-white"
//                 >
//                   {/* Card Header */}
//                   <div className="bg-light bg-opacity-50 border-bottom border-light-subtle px-4 py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
//                     <div className="d-flex gap-4">
//                       <div>
//                         <span
//                           className="d-block text-muted small text-uppercase fw-bold tracking-wider mb-1"
//                           style={{ fontSize: "0.7rem" }}
//                         >
//                           Appointment Date
//                         </span>
//                         <span className="fw-bold text-dark">
//                           {new Date(appt.date).toString() !== "Invalid Date"
//                             ? formatDate(appt.date)
//                             : appt.day || "N/A"}
//                         </span>
//                       </div>
//                       <div>
//                         <span
//                           className="d-block text-muted small text-uppercase fw-bold tracking-wider mb-1"
//                           style={{ fontSize: "0.7rem" }}
//                         >
//                           Time
//                         </span>
//                         <span className="fw-bold text-dark d-flex align-items-center gap-1">
//                           <Clock size={14} className="text-primary" />{" "}
//                           {appt.timeSlot}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="text-md-end">
//                       <span
//                         className="d-block text-muted small text-uppercase fw-bold tracking-wider mb-1"
//                         style={{ fontSize: "0.7rem" }}
//                       >
//                         Booking Ref #
//                       </span>
//                       <span className="fw-bold font-monospace text-secondary">
//                         {appt.bookingReference || "N/A"}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Card Body */}
//                   <div className="p-4 d-flex flex-column flex-md-row gap-4 align-items-md-start">
//                     {/* Doctor Image */}
//                     <div className="flex-shrink-0 text-center">
//                       <img
//                         src={getDoctorImage(
//                           appt.doctor,
//                         )} /* ✅ Passing the whole doctor object now */
//                         alt="Doctor"
//                         className="rounded-3 border border-light-subtle shadow-sm object-fit-cover"
//                         style={{ width: "100px", height: "100px" }}
//                       />
//                     </div>

//                     {/* Details */}
//                     <div className="flex-grow-1">
//                       <div className="d-flex align-items-center gap-2 mb-2">
//                         {/* ✅ FIXED: Removed 'Unknown Doctor' fallback, strictly displays DB name */}
//                         <h5 className="fw-bolder text-dark mb-0">
//                           {appt.doctor?.name}
//                         </h5>
//                         <span
//                           className={`badge border ${getStatusBadge(appt.status)}`}
//                         >
//                           {appt.status.toUpperCase()}
//                         </span>
//                       </div>
//                       <p className="text-primary fw-bold small mb-2 d-flex align-items-center gap-1">
//                         <UserRound size={14} />{" "}
//                         {appt.doctor?.speciality || "General Physician"}
//                       </p>

//                       <div className="text-muted small d-flex flex-column gap-1 mb-3">
//                         <span className="d-flex align-items-center gap-2">
//                           <MapPin size={14} /> City Care Clinic, Main Branch
//                         </span>
//                         {appt.status === "confirmed" && (
//                           <span className="d-flex align-items-center gap-2 text-success fw-medium">
//                             <Video size={14} /> Telehealth Link will be sent via
//                             SMS
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div
//                       className="d-flex flex-column gap-2 border-start-md border-light-subtle ps-md-4"
//                       style={{ minWidth: "180px" }}
//                     >
//                       {/* Button 1: Primary Context Action */}
//                       {["pending", "confirmed"].includes(appt.status) ? (
//                         <button
//                           className="btn btn-outline-primary w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift"
//                           onClick={() => {
//                             setPreselectedDoctorId(appt.doctor?._id); // ✅ Pass this specific doctor's ID
//                             setShowModal(true);
//                           }}
//                         >
//                           <Calendar size={16} /> Reschedule
//                         </button>
//                       ) : (
//                         <button
//                           className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift"
//                           onClick={() => {
//                             setPreselectedDoctorId(appt.doctor?._id); // ✅ Pass this specific doctor's ID
//                             setShowModal(true);
//                           }}
//                         >
//                           <RotateCcw size={16} /> Book Again
//                         </button>
//                       )}

//                       {/* Button 2: Details */}
//                       <button
//                         className="btn btn-white border-light-subtle w-100 rounded-pill fw-bold text-dark shadow-sm d-flex align-items-center justify-content-center gap-2 hover-bg-light"
//                         onClick={() => navigate(`/appointments/${appt._id}`)}
//                       >
//                         <FileText size={16} className="text-muted" /> View
//                         Details
//                       </button>

//                       {/* Button 3: Cancel */}
//                       {["pending", "confirmed"].includes(appt.status) && (
//                         <button
//                           className="btn btn-link text-danger text-decoration-none fw-bold small mt-1 p-0"
//                           onClick={() => handleCancel(appt._id)}
//                           disabled={actionLoading === appt._id}
//                         >
//                           {actionLoading === appt._id ? (
//                             <>
//                               <Loader2
//                                 size={14}
//                                 className="spin-animation me-1"
//                               />{" "}
//                               Cancelling...
//                             </>
//                           ) : (
//                             "Cancel Appointment"
//                           )}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* --- RIGHT COLUMN: QUICK ACTIONS & INFO --- */}
//         <div className="col-lg-4">
//           <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden position-relative">
//             <img
//               src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"
//               alt="Hospital"
//               className="w-100 object-fit-cover"
//               style={{ height: "140px" }}
//             />
//             <div className="p-4 bg-white">
//               <h5 className="fw-black mb-1 text-dark">Need immediate care?</h5>
//               <p className="text-muted small mb-3">
//                 Check real-time availability and secure your slot with our top
//                 specialists.
//               </p>
//               <button
//                 className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm hover-lift d-flex align-items-center justify-content-center gap-2 py-2"
//                 onClick={() => {
//                   setPreselectedDoctorId(null);
//                   setShowModal(true);
//                 }}
//               >
//                 <Plus size={18} /> Book Appointment
//               </button>
//             </div>
//           </div>

//           <div className="card border-light-subtle shadow-sm rounded-4 bg-white p-4">
//             <h6 className="fw-bolder mb-3 d-flex align-items-center gap-2 text-dark">
//               <AlertCircle size={20} className="text-primary" /> Appointment
//               Guidelines
//             </h6>
//             <ul className="text-muted small mb-0 ps-3 fw-medium lh-lg">
//               <li>
//                 Please arrive <strong className="text-dark">10 minutes</strong>{" "}
//                 before your scheduled time.
//               </li>
//               <li>Carry your previous medical records and prescriptions.</li>
//               <li>
//                 Cancellations must be made at least{" "}
//                 <strong className="text-dark">2 hours</strong> in advance to
//                 avoid a fee.
//               </li>
//               <li>
//                 Pending appointments are subject to doctor confirmation via SMS.
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* --- BOOKING MODAL --- */}
//       <BookAppointmentModal
//         key={showModal ? "open" : "closed"}
//         show={showModal}
//         preselectedDoctorId={preselectedDoctorId} // ✅ Passed the ID down to the Modal!
//         onClose={() => {
//           setShowModal(false);
//           setPreselectedDoctorId(null);
//         }}
//         onSuccess={() => {
//           fetchAppointments();
//         }}
//       />

//       <style>{`
//         .border-start-md { border-left: none; }
//         @media (min-width: 768px) {
//           .border-start-md { border-left: 1px solid #e2e8f0; }
//         }
//         .fw-black { font-weight: 900; }
//         .hover-bg-light:hover { background-color: #f8fafc !important; }
//         .tracking-wider { letter-spacing: 0.05em; }
//         .btn-white { background-color: #ffffff; }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerAppointments;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   Plus,
//   AlertCircle,
//   Loader2,
//   ArrowLeft,
//   CalendarCheck,
//   Video,
//   FileText,
//   RotateCcw,
//   UserRound,
//   CheckCircle,
// } from "lucide-react";

// // ✅ We no longer need an external component for the modal,
// // we are rendering the sleek, unified form right inside this file!
// // import BookAppointmentModal from "../components/BookAppointmentModal";

// const CustomerAppointments = () => {
//   const navigate = useNavigate();
//   const [appointments, setAppointments] = useState([]);
//   const [doctors, setDoctors] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);
//   const [bookingLoading, setBookingLoading] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Form State
//   const [formData, setFormData] = useState({
//     doctorId: "",
//     date: "",
//     time: "",
//     reason: "",
//   });

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       // Fetch both appointments and available doctors simultaneously
//       const [apptRes, docsRes] = await Promise.all([
//         api.get("/appointments/my-appointments"),
//         api.get("/appointments/available-doctors"),
//       ]);

//       const sorted = (apptRes.data || []).sort(
//         (a, b) => new Date(b.date) - new Date(a.date),
//       );
//       setAppointments(sorted);
//       setDoctors(docsRes.data || []);
//     } catch (err) {
//       console.error("Failed to load appointments", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Cancel Appointment Logic
//   const handleCancel = async (apptId) => {
//     if (!window.confirm("Are you sure you want to cancel this appointment?"))
//       return;

//     try {
//       setActionLoading(apptId);
//       await api.put(`/appointments/${apptId}/status`, { status: "cancelled" });
//       fetchData();
//     } catch (err) {
//       alert(err.response?.data?.message || "Cancellation failed");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // ✅ NEW: Handle Booking Form Submission
//   const handleBook = async (e) => {
//     e.preventDefault();
//     setBookingLoading(true);
//     setError("");

//     try {
//       await api.post("/appointments", formData);
//       setSuccess(
//         "Appointment booked successfully! Waiting for doctor confirmation.",
//       );
//       setShowModal(false);
//       fetchData(); // Refresh list to show new booking

//       // Reset form
//       setFormData({ doctorId: "", date: "", time: "", reason: "" });

//       setTimeout(() => setSuccess(""), 5000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to book appointment.");
//     } finally {
//       setBookingLoading(false);
//     }
//   };

//   // Format Dates safely
//   const formatDate = (dateString, dayFallback) => {
//     if (!dateString) return dayFallback || "N/A";
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return dayFallback || "N/A";

//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const getStatusBadge = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return "bg-warning text-dark border-warning";
//       case "confirmed":
//         return "bg-success bg-opacity-10 text-success border-success";
//       case "completed":
//         return "bg-primary bg-opacity-10 text-primary border-primary";
//       case "cancelled":
//         return "bg-danger bg-opacity-10 text-danger border-danger";
//       default:
//         return "bg-secondary bg-opacity-10 text-secondary border-secondary";
//     }
//   };

//   const getDoctorImage = (doctor) => {
//     if (doctor?.image && doctor.image !== "none") {
//       return doctor.image.startsWith("http")
//         ? doctor.image
//         : `http://localhost:5000${doctor.image}`;
//     }
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || "Doctor")}&background=eff6ff&color=2563eb&size=150&font-size=0.33`;
//   };

//   return (
//     <div
//       className="medical-dashboard-bg min-vh-100 py-4 px-3 px-md-4 px-xl-5 animate-fade-in"
//       style={{ backgroundColor: "#f8fafc" }}
//     >
//       {/* --- HEADER SECTION --- */}
//       <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 border-bottom border-light-subtle pb-3">
//         <div className="d-flex align-items-center gap-3">
//           <button
//             className="btn btn-white shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center border-light-subtle text-secondary hover-lift"
//             onClick={() => navigate("/customer-dashboard")}
//             title="Back to Dashboard"
//           >
//             <ArrowLeft size={20} />
//           </button>
//           <div>
//             <h3 className="fw-black mb-0 text-dark tracking-tight d-flex align-items-center gap-2">
//               <CalendarCheck className="text-primary" size={28} />
//               Your Appointments
//             </h3>
//           </div>
//         </div>
//         <button
//           className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift d-flex align-items-center gap-2"
//           onClick={() => {
//             setFormData({ ...formData, doctorId: "" });
//             setShowModal(true);
//           }}
//         >
//           <Plus size={18} /> Book New Visit
//         </button>
//       </div>

//       {success && (
//         <div className="alert alert-success d-flex align-items-center gap-2 fw-bold shadow-sm rounded-4 border-0 mb-4 animate-fade-in">
//           <CheckCircle size={20} /> {success}
//         </div>
//       )}

//       <div className="row g-4">
//         {/* --- LEFT COLUMN: APPOINTMENT LIST --- */}
//         <div className="col-lg-8">
//           {loading ? (
//             <div className="d-flex flex-column justify-content-center align-items-center py-5 my-4 bg-white rounded-4 border border-light-subtle">
//               <Loader2 className="spin-animation text-primary mb-3" size={40} />
//               <span className="text-muted fw-semibold">
//                 Loading your visits...
//               </span>
//             </div>
//           ) : appointments.length === 0 ? (
//             <div className="text-center py-5 my-4 bg-white rounded-4 border border-light-subtle shadow-sm">
//               <img
//                 src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop"
//                 alt="No appointments"
//                 className="mb-4 rounded-circle object-fit-cover shadow-sm"
//                 style={{ width: "150px", height: "150px" }}
//               />
//               <h4 className="fw-black text-dark">No Appointments Yet</h4>
//               <p className="text-muted mb-4">
//                 You haven't scheduled any consultations. Book your first visit
//                 today.
//               </p>
//               <button
//                 className="btn btn-primary rounded-pill px-5 py-2 fw-bold hover-lift shadow-sm"
//                 onClick={() => setShowModal(true)}
//               >
//                 Book Now
//               </button>
//             </div>
//           ) : (
//             <div className="d-flex flex-column gap-4">
//               {appointments.map((appt) => (
//                 <div
//                   key={appt._id}
//                   className="card border-light-subtle shadow-sm rounded-4 overflow-hidden bg-white"
//                 >
//                   {/* Card Header */}
//                   <div className="bg-light bg-opacity-50 border-bottom border-light-subtle px-4 py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
//                     <div className="d-flex gap-4">
//                       <div>
//                         <span
//                           className="d-block text-muted small text-uppercase fw-bold tracking-wider mb-1"
//                           style={{ fontSize: "0.7rem" }}
//                         >
//                           Appointment Date
//                         </span>
//                         <span className="fw-bold text-dark">
//                           {new Date(appt.date).toString() !== "Invalid Date"
//                             ? formatDate(appt.date)
//                             : appt.day || "N/A"}
//                         </span>
//                       </div>
//                       <div>
//                         <span
//                           className="d-block text-muted small text-uppercase fw-bold tracking-wider mb-1"
//                           style={{ fontSize: "0.7rem" }}
//                         >
//                           Time
//                         </span>
//                         <span className="fw-bold text-dark d-flex align-items-center gap-1">
//                           <Clock size={14} className="text-primary" />{" "}
//                           {appt.time || appt.timeSlot}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="text-md-end">
//                       <span
//                         className="d-block text-muted small text-uppercase fw-bold tracking-wider mb-1"
//                         style={{ fontSize: "0.7rem" }}
//                       >
//                         Booking Ref #
//                       </span>
//                       <span className="fw-bold font-monospace text-secondary">
//                         {appt.bookingReference || "N/A"}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Card Body */}
//                   <div className="p-4 d-flex flex-column flex-md-row gap-4 align-items-md-start">
//                     <div className="flex-shrink-0 text-center">
//                       <img
//                         src={getDoctorImage(appt.doctor)}
//                         alt="Doctor"
//                         className="rounded-3 border border-light-subtle shadow-sm object-fit-cover"
//                         style={{ width: "100px", height: "100px" }}
//                       />
//                     </div>

//                     <div className="flex-grow-1">
//                       <div className="d-flex align-items-center gap-2 mb-2">
//                         <h5 className="fw-bolder text-dark mb-0">
//                           {appt.doctor?.name || "Dr. Unavailable"}
//                         </h5>
//                         <span
//                           className={`badge border ${getStatusBadge(appt.status)}`}
//                         >
//                           {appt.status?.toUpperCase() || "UNKNOWN"}
//                         </span>
//                       </div>
//                       <p className="text-primary fw-bold small mb-2 d-flex align-items-center gap-1">
//                         <UserRound size={14} />{" "}
//                         {appt.doctor?.speciality || "General Physician"}
//                       </p>

//                       <div className="text-muted small d-flex flex-column gap-1 mb-3">
//                         <span className="d-flex align-items-center gap-2">
//                           <MapPin size={14} /> City Care Clinic, Main Branch
//                         </span>
//                         {appt.status === "confirmed" && (
//                           <span className="d-flex align-items-center gap-2 text-success fw-medium">
//                             <Video size={14} /> Telehealth Link will be sent via
//                             SMS
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     <div
//                       className="d-flex flex-column gap-2 border-start-md border-light-subtle ps-md-4"
//                       style={{ minWidth: "180px" }}
//                     >
//                       {["pending", "confirmed"].includes(
//                         appt.status?.toLowerCase(),
//                       ) ? (
//                         <button
//                           className="btn btn-outline-primary w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift"
//                           onClick={() => {
//                             setFormData({
//                               ...formData,
//                               doctorId: appt.doctor?._id,
//                             });
//                             setShowModal(true);
//                           }}
//                         >
//                           <Calendar size={16} /> Reschedule
//                         </button>
//                       ) : (
//                         <button
//                           className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift"
//                           onClick={() => {
//                             setFormData({
//                               ...formData,
//                               doctorId: appt.doctor?._id,
//                             });
//                             setShowModal(true);
//                           }}
//                         >
//                           <RotateCcw size={16} /> Book Again
//                         </button>
//                       )}

//                       <button
//                         className="btn btn-white border-light-subtle w-100 rounded-pill fw-bold text-dark shadow-sm d-flex align-items-center justify-content-center gap-2 hover-bg-light"
//                         onClick={() => navigate(`/appointments/${appt._id}`)}
//                       >
//                         <FileText size={16} className="text-muted" /> View
//                         Details
//                       </button>

//                       {["pending", "confirmed"].includes(
//                         appt.status?.toLowerCase(),
//                       ) && (
//                         <button
//                           className="btn btn-link text-danger text-decoration-none fw-bold small mt-1 p-0"
//                           onClick={() => handleCancel(appt._id)}
//                           disabled={actionLoading === appt._id}
//                         >
//                           {actionLoading === appt._id ? (
//                             <>
//                               <Loader2
//                                 size={14}
//                                 className="spin-animation me-1"
//                               />{" "}
//                               Cancelling...
//                             </>
//                           ) : (
//                             "Cancel Appointment"
//                           )}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* --- RIGHT COLUMN: QUICK ACTIONS --- */}
//         <div className="col-lg-4">
//           <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden position-relative">
//             <img
//               src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"
//               alt="Hospital"
//               className="w-100 object-fit-cover"
//               style={{ height: "140px" }}
//             />
//             <div className="p-4 bg-white">
//               <h5 className="fw-black mb-1 text-dark">Need immediate care?</h5>
//               <p className="text-muted small mb-3">
//                 Check real-time availability and secure your slot with our top
//                 specialists.
//               </p>
//               <button
//                 className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm hover-lift d-flex align-items-center justify-content-center gap-2 py-2"
//                 onClick={() => setShowModal(true)}
//               >
//                 <Plus size={18} /> Book Appointment
//               </button>
//             </div>
//           </div>

//           <div className="card border-light-subtle shadow-sm rounded-4 bg-white p-4">
//             <h6 className="fw-bolder mb-3 d-flex align-items-center gap-2 text-dark">
//               <AlertCircle size={20} className="text-primary" /> Appointment
//               Guidelines
//             </h6>
//             <ul className="text-muted small mb-0 ps-3 fw-medium lh-lg">
//               <li>
//                 Please arrive <strong className="text-dark">10 minutes</strong>{" "}
//                 before your scheduled time.
//               </li>
//               <li>Carry your previous medical records and prescriptions.</li>
//               <li>
//                 Cancellations must be made at least{" "}
//                 <strong className="text-dark">2 hours</strong> in advance to
//                 avoid a fee.
//               </li>
//               <li>
//                 Pending appointments are subject to doctor confirmation via SMS.
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* --- INTEGRATED BOOKING MODAL --- */}
//       {showModal && (
//         <div
//           className="modal d-block bg-dark bg-opacity-50 animate-fade-in"
//           tabIndex="-1"
//           style={{ zIndex: 1050 }}
//         >
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
//               <div className="modal-header bg-light border-bottom border-light-subtle p-4 pb-3">
//                 <h5 className="modal-title fw-black text-dark d-flex align-items-center gap-2">
//                   <CalendarCheck className="text-primary" size={20} /> Book
//                   Appointment
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close shadow-none bg-secondary bg-opacity-10 rounded-circle p-2"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>
//               <div className="modal-body p-4">
//                 {error && (
//                   <div className="alert alert-danger py-2 small fw-bold mb-4">
//                     {error}
//                   </div>
//                 )}
//                 <form onSubmit={handleBook}>
//                   <div className="mb-4">
//                     <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
//                       Select Specialist *
//                     </label>
//                     <select
//                       className="form-select bg-light fw-medium border-light-subtle shadow-sm cursor-pointer"
//                       required
//                       value={formData.doctorId}
//                       onChange={(e) =>
//                         setFormData({ ...formData, doctorId: e.target.value })
//                       }
//                     >
//                       <option value="">-- Choose a Doctor --</option>
//                       {doctors.map((doc) => (
//                         <option key={doc._id} value={doc._id}>
//                           Dr. {doc.name} ({doc.speciality}) - Fee: NPR{" "}
//                           {doc.consultationFee || 500}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="row g-3 mb-4">
//                     <div className="col-6">
//                       <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
//                         Date *
//                       </label>
//                       <input
//                         type="date"
//                         className="form-control bg-light border-light-subtle shadow-sm fw-medium text-dark"
//                         required
//                         min={new Date().toISOString().split("T")[0]}
//                         value={formData.date}
//                         onChange={(e) =>
//                           setFormData({ ...formData, date: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div className="col-6">
//                       <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
//                         Time *
//                       </label>
//                       <input
//                         type="time"
//                         className="form-control bg-light border-light-subtle shadow-sm fw-medium text-dark text-center"
//                         required
//                         value={formData.time}
//                         onChange={(e) =>
//                           setFormData({ ...formData, time: e.target.value })
//                         }
//                       />
//                     </div>
//                   </div>
//                   <div className="mb-4">
//                     <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
//                       Reason for Visit *
//                     </label>
//                     <textarea
//                       className="form-control bg-light border-light-subtle shadow-sm fw-medium text-dark"
//                       rows="3"
//                       required
//                       placeholder="Describe your symptoms or reason for visit..."
//                       value={formData.reason}
//                       onChange={(e) =>
//                         setFormData({ ...formData, reason: e.target.value })
//                       }
//                     ></textarea>
//                   </div>
//                   <div className="d-flex justify-content-end gap-2 pt-2 border-top border-light-subtle mt-4">
//                     <button
//                       type="button"
//                       className="btn btn-white rounded-pill px-4 fw-bold shadow-sm border border-light-subtle"
//                       onClick={() => setShowModal(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2 shadow-sm hover-lift"
//                       disabled={bookingLoading}
//                     >
//                       {bookingLoading ? (
//                         <Loader2 size={16} className="spin-animation" />
//                       ) : (
//                         "Confirm Booking"
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         .border-start-md { border-left: none; }
//         @media (min-width: 768px) {
//           .border-start-md { border-left: 1px solid #e2e8f0; }
//         }
//         .fw-black { font-weight: 900; }
//         .hover-bg-light:hover { background-color: #f8fafc !important; }
//         .tracking-wider { letter-spacing: 0.05em; }
//         .btn-white { background-color: #ffffff; }
//         .spin-animation { animation: spin 1s linear infinite; }
//         @keyframes spin { 100% { transform: rotate(360deg); } }
//         .hover-lift:hover { transform: translateY(-2px); transition: transform 0.2s ease; }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerAppointments;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   Plus,
//   AlertCircle,
//   Loader2,
//   ArrowLeft,
//   CalendarCheck,
//   Video,
//   FileText,
//   RotateCcw,
//   UserRound,
// } from "lucide-react";

// // Using your original external modal component
// import BookAppointmentModal from "../components/BookAppointmentModal";

// const CustomerAppointments = () => {
//   const navigate = useNavigate();
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [actionLoading, setActionLoading] = useState(null);

//   // Remembering which doctor to pre-fill in the modal
//   const [preselectedDoctorId, setPreselectedDoctorId] = useState(null);

//   // ✅ BULLETPROOF FETCH FUNCTION
//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);

//       let response;
//       // 1. Try the standard /my route first
//       try {
//         response = await api.get("/appointments/my");
//       } catch (err) {
//         // 2. If it 404s, gracefully fallback to /my-appointments
//         if (err.response && err.response.status === 404) {
//           response = await api.get("/appointments/my-appointments");
//         } else {
//           throw err;
//         }
//       }

//       console.log("✅ RAW BACKEND RESPONSE:", response.data);

//       // 3. Extract the array safely, regardless of how the backend structures it
//       let apptList = [];
//       if (Array.isArray(response.data)) {
//         apptList = response.data;
//       } else if (response.data && Array.isArray(response.data.appointments)) {
//         apptList = response.data.appointments;
//       } else if (
//         response.data &&
//         response.data.data &&
//         Array.isArray(response.data.data)
//       ) {
//         apptList = response.data.data;
//       }

//       console.log("✅ EXTRACTED APPOINTMENTS:", apptList);

//       // 4. Safe sorting logic (won't crash if date is missing)
//       const sorted = apptList.sort((a, b) => {
//         const dateA = a.date ? new Date(a.date).getTime() : 0;
//         const dateB = b.date ? new Date(b.date).getTime() : 0;
//         return dateB - dateA;
//       });

//       setAppointments(sorted);
//     } catch (err) {
//       console.error("❌ Failed to load appointments:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   // Cancel Appointment Logic
//   const handleCancel = async (apptId) => {
//     if (!window.confirm("Are you sure you want to cancel this appointment?"))
//       return;

//     try {
//       setActionLoading(apptId);
//       await api.put(`/appointments/${apptId}/status`, { status: "cancelled" });
//       fetchAppointments();
//     } catch (err) {
//       alert(err.response?.data?.message || "Cancellation failed");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // Format Dates safely
//   const formatDate = (dateString, dayFallback) => {
//     if (!dateString) return dayFallback || "N/A";
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return dayFallback || "N/A";

//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const getStatusBadge = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return "bg-warning text-dark border-warning";
//       case "confirmed":
//         return "bg-success bg-opacity-10 text-success border-success";
//       case "completed":
//         return "bg-primary bg-opacity-10 text-primary border-primary";
//       case "cancelled":
//         return "bg-danger bg-opacity-10 text-danger border-danger";
//       default:
//         return "bg-secondary bg-opacity-10 text-secondary border-secondary";
//     }
//   };

//   // Fallback realistic doctor image based on name to make it look professional
//   const getDoctorImage = (doctor) => {
//     if (doctor?.image && doctor.image !== "none") {
//       return doctor.image.startsWith("http")
//         ? doctor.image
//         : `http://localhost:5000${doctor.image}`; // Append your backend URL
//     }
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(
//       doctor?.name || "Doctor",
//     )}&background=eff6ff&color=2563eb&size=150&font-size=0.33`;
//   };

//   return (
//     <div
//       className="medical-dashboard-bg min-vh-100 py-4 px-3 px-md-4 px-xl-5 animate-fade-in"
//       style={{ backgroundColor: "#f8fafc" }}
//     >
//       {/* --- HEADER SECTION --- */}
//       <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 border-bottom border-light-subtle pb-3">
//         <div className="d-flex align-items-center gap-3">
//           <button
//             className="btn btn-white shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center border-light-subtle text-secondary hover-lift"
//             onClick={() => navigate("/customer-dashboard")}
//             title="Back to Dashboard"
//           >
//             <ArrowLeft size={20} />
//           </button>
//           <div>
//             <h3 className="fw-black mb-0 text-dark tracking-tight d-flex align-items-center gap-2">
//               <CalendarCheck className="text-primary" size={28} />
//               Your Appointments
//             </h3>
//           </div>
//         </div>
//         <button
//           className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift d-flex align-items-center gap-2"
//           onClick={() => {
//             setPreselectedDoctorId(null);
//             setShowModal(true);
//           }}
//         >
//           <Plus size={18} /> Book New Visit
//         </button>
//       </div>

//       <div className="row g-4">
//         {/* --- LEFT COLUMN: AMAZON STYLE APPOINTMENT LIST --- */}
//         <div className="col-lg-8">
//           {loading ? (
//             <div className="d-flex flex-column justify-content-center align-items-center py-5 my-4 bg-white rounded-4 border border-light-subtle">
//               <Loader2 className="spin-animation text-primary mb-3" size={40} />
//               <span className="text-muted fw-semibold">
//                 Loading your visits...
//               </span>
//             </div>
//           ) : appointments.length === 0 ? (
//             <div className="text-center py-5 my-4 bg-white rounded-4 border border-light-subtle shadow-sm">
//               <img
//                 src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop"
//                 alt="No appointments"
//                 className="mb-4 rounded-circle object-fit-cover shadow-sm"
//                 style={{ width: "150px", height: "150px" }}
//               />
//               <h4 className="fw-black text-dark">No Appointments Yet</h4>
//               <p className="text-muted mb-4">
//                 You haven't scheduled any consultations. Book your first visit
//                 today.
//               </p>
//               <button
//                 className="btn btn-primary rounded-pill px-5 py-2 fw-bold hover-lift shadow-sm"
//                 onClick={() => {
//                   setPreselectedDoctorId(null);
//                   setShowModal(true);
//                 }}
//               >
//                 Book Now
//               </button>
//             </div>
//           ) : (
//             <div className="d-flex flex-column gap-4">
//               {appointments.map((appt) => (
//                 <div
//                   key={appt._id}
//                   className="card border-light-subtle shadow-sm rounded-4 overflow-hidden bg-white"
//                 >
//                   {/* Card Header */}
//                   <div className="bg-light bg-opacity-50 border-bottom border-light-subtle px-4 py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
//                     <div className="d-flex gap-4">
//                       <div>
//                         <span
//                           className="d-block text-muted small text-uppercase fw-bold tracking-wider mb-1"
//                           style={{ fontSize: "0.7rem" }}
//                         >
//                           Appointment Date
//                         </span>
//                         <span className="fw-bold text-dark">
//                           {new Date(appt.date).toString() !== "Invalid Date"
//                             ? formatDate(appt.date)
//                             : appt.day || "N/A"}
//                         </span>
//                       </div>
//                       <div>
//                         <span
//                           className="d-block text-muted small text-uppercase fw-bold tracking-wider mb-1"
//                           style={{ fontSize: "0.7rem" }}
//                         >
//                           Time
//                         </span>
//                         <span className="fw-bold text-dark d-flex align-items-center gap-1">
//                           <Clock size={14} className="text-primary" />{" "}
//                           {appt.timeSlot || appt.time}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="text-md-end">
//                       <span
//                         className="d-block text-muted small text-uppercase fw-bold tracking-wider mb-1"
//                         style={{ fontSize: "0.7rem" }}
//                       >
//                         Booking Ref #
//                       </span>
//                       <span className="fw-bold font-monospace text-secondary">
//                         {appt.bookingReference || "N/A"}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Card Body */}
//                   <div className="p-4 d-flex flex-column flex-md-row gap-4 align-items-md-start">
//                     {/* Doctor Image */}
//                     <div className="flex-shrink-0 text-center">
//                       <img
//                         src={getDoctorImage(appt.doctor)}
//                         alt="Doctor"
//                         className="rounded-3 border border-light-subtle shadow-sm object-fit-cover"
//                         style={{ width: "100px", height: "100px" }}
//                       />
//                     </div>

//                     {/* Details */}
//                     <div className="flex-grow-1">
//                       <div className="d-flex align-items-center gap-2 mb-2">
//                         <h5 className="fw-bolder text-dark mb-0">
//                           {appt.doctor?.name || "Unknown Doctor"}
//                         </h5>
//                         <span
//                           className={`badge border ${getStatusBadge(
//                             appt.status,
//                           )}`}
//                         >
//                           {appt.status?.toUpperCase() || "UNKNOWN"}
//                         </span>
//                       </div>
//                       <p className="text-primary fw-bold small mb-2 d-flex align-items-center gap-1">
//                         <UserRound size={14} />{" "}
//                         {appt.doctor?.speciality || "General Physician"}
//                       </p>

//                       <div className="text-muted small d-flex flex-column gap-1 mb-3">
//                         <span className="d-flex align-items-center gap-2">
//                           <MapPin size={14} /> City Care Clinic, Main Branch
//                         </span>
//                         {appt.status === "confirmed" && (
//                           <span className="d-flex align-items-center gap-2 text-success fw-medium">
//                             <Video size={14} /> Telehealth Link will be sent via
//                             SMS
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div
//                       className="d-flex flex-column gap-2 border-start-md border-light-subtle ps-md-4"
//                       style={{ minWidth: "180px" }}
//                     >
//                       {/* Button 1: Primary Context Action */}
//                       {["pending", "confirmed"].includes(
//                         appt.status?.toLowerCase(),
//                       ) ? (
//                         <button
//                           className="btn btn-outline-primary w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift"
//                           onClick={() => {
//                             setPreselectedDoctorId(appt.doctor?._id);
//                             setShowModal(true);
//                           }}
//                         >
//                           <Calendar size={16} /> Reschedule
//                         </button>
//                       ) : (
//                         <button
//                           className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift"
//                           onClick={() => {
//                             setPreselectedDoctorId(appt.doctor?._id);
//                             setShowModal(true);
//                           }}
//                         >
//                           <RotateCcw size={16} /> Book Again
//                         </button>
//                       )}

//                       {/* Button 2: Details */}
//                       <button
//                         className="btn btn-white border-light-subtle w-100 rounded-pill fw-bold text-dark shadow-sm d-flex align-items-center justify-content-center gap-2 hover-bg-light"
//                         onClick={() => navigate(`/appointments/${appt._id}`)}
//                       >
//                         <FileText size={16} className="text-muted" /> View
//                         Details
//                       </button>

//                       {/* Button 3: Cancel */}
//                       {["pending", "confirmed"].includes(
//                         appt.status?.toLowerCase(),
//                       ) && (
//                         <button
//                           className="btn btn-link text-danger text-decoration-none fw-bold small mt-1 p-0"
//                           onClick={() => handleCancel(appt._id)}
//                           disabled={actionLoading === appt._id}
//                         >
//                           {actionLoading === appt._id ? (
//                             <>
//                               <Loader2
//                                 size={14}
//                                 className="spin-animation me-1"
//                               />{" "}
//                               Cancelling...
//                             </>
//                           ) : (
//                             "Cancel Appointment"
//                           )}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* --- RIGHT COLUMN: QUICK ACTIONS & INFO --- */}
//         <div className="col-lg-4">
//           <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden position-relative">
//             <img
//               src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"
//               alt="Hospital"
//               className="w-100 object-fit-cover"
//               style={{ height: "140px" }}
//             />
//             <div className="p-4 bg-white">
//               <h5 className="fw-black mb-1 text-dark">Need immediate care?</h5>
//               <p className="text-muted small mb-3">
//                 Check real-time availability and secure your slot with our top
//                 specialists.
//               </p>
//               <button
//                 className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm hover-lift d-flex align-items-center justify-content-center gap-2 py-2"
//                 onClick={() => {
//                   setPreselectedDoctorId(null);
//                   setShowModal(true);
//                 }}
//               >
//                 <Plus size={18} /> Book Appointment
//               </button>
//             </div>
//           </div>

//           <div className="card border-light-subtle shadow-sm rounded-4 bg-white p-4">
//             <h6 className="fw-bolder mb-3 d-flex align-items-center gap-2 text-dark">
//               <AlertCircle size={20} className="text-primary" /> Appointment
//               Guidelines
//             </h6>
//             <ul className="text-muted small mb-0 ps-3 fw-medium lh-lg">
//               <li>
//                 Please arrive <strong className="text-dark">10 minutes</strong>{" "}
//                 before your scheduled time.
//               </li>
//               <li>Carry your previous medical records and prescriptions.</li>
//               <li>
//                 Cancellations must be made at least{" "}
//                 <strong className="text-dark">2 hours</strong> in advance to
//                 avoid a fee.
//               </li>
//               <li>
//                 Pending appointments are subject to doctor confirmation via SMS.
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* --- RESTORED: BOOKING MODAL --- */}
//       <BookAppointmentModal
//         key={showModal ? "open" : "closed"}
//         show={showModal}
//         preselectedDoctorId={preselectedDoctorId}
//         onClose={() => {
//           setShowModal(false);
//           setPreselectedDoctorId(null);
//         }}
//         onSuccess={() => {
//           // Force close modal and fetch data simultaneously
//           setShowModal(false);
//           fetchAppointments();
//         }}
//       />

//       <style>{`
//         .border-start-md { border-left: none; }
//         @media (min-width: 768px) {
//           .border-start-md { border-left: 1px solid #e2e8f0; }
//         }
//         .fw-black { font-weight: 900; }
//         .hover-bg-light:hover { background-color: #f8fafc !important; }
//         .tracking-wider { letter-spacing: 0.05em; }
//         .btn-white { background-color: #ffffff; }
//         .spin-animation { animation: spin 1s linear infinite; }
//         @keyframes spin { 100% { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerAppointments;
////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CalendarCheck,
  Video,
  FileText,
  RotateCcw,
  UserRound,
  MessageCircle, // ✅ Added for Chat icon
} from "lucide-react";

// Using your original external modal component
import BookAppointmentModal from "../components/BookAppointmentModal";

const CustomerAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Remembering which doctor to pre-fill in the modal
  const [preselectedDoctorId, setPreselectedDoctorId] = useState(null);

  // ✅ BULLETPROOF FETCH FUNCTION
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      let response;
      // 1. Try the standard /my route first
      try {
        response = await api.get("/appointments/my");
      } catch (err) {
        // 2. If it 404s, gracefully fallback to /my-appointments
        if (err.response && err.response.status === 404) {
          response = await api.get("/appointments/my-appointments");
        } else {
          throw err;
        }
      }

      console.log("✅ RAW BACKEND RESPONSE:", response.data);

      // 3. Extract the array safely
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

      console.log("✅ EXTRACTED APPOINTMENTS:", apptList);

      // 4. Safe sorting logic
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
        : `http://localhost:5000${doctor.image}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      doctor?.name || "Doctor",
    )}&background=eff6ff&color=2563eb&size=150&font-size=0.33`;
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
              <CalendarCheck className="text-primary" size={28} />
              Your Appointments
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
                          className="rounded-3 border border-light-subtle shadow-sm object-fit-cover"
                          style={{ width: "100px", height: "100px" }}
                        />
                      </div>

                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <h5 className="fw-bolder text-dark mb-0">
                            Dr. {appt.doctor?.name || "Unknown Doctor"}
                          </h5>
                          <span
                            className={`badge border ${getStatusBadge(
                              appt.status,
                            )}`}
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
                        {/* 💬 CHAT BUTTON: Only shows if confirmed */}
                        {isConfirmed && (
                          <button
                            className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift animate-fade-in"
                            onClick={() =>
                              navigate(`/customer/chat/${appt._id}`, {
                                state: {
                                  partnerId: appt.doctor?._id,
                                  partnerName: `Dr. ${appt.doctor?.name}`,
                                },
                              })
                            }
                          >
                            <MessageCircle size={16} /> Message Doctor
                          </button>
                        )}

                        {/* Reschedule / Book Again */}
                        {["pending", "confirmed"].includes(
                          appt.status?.toLowerCase(),
                        ) ? (
                          <button
                            className="btn btn-outline-primary w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift"
                            onClick={() => {
                              setPreselectedDoctorId(appt.doctor?._id);
                              setShowModal(true);
                            }}
                          >
                            <Calendar size={16} /> Reschedule
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift"
                            onClick={() => {
                              setPreselectedDoctorId(appt.doctor?._id);
                              setShowModal(true);
                            }}
                          >
                            <RotateCcw size={16} /> Book Again
                          </button>
                        )}

                        <button
                          className="btn btn-white border-light-subtle w-100 rounded-pill fw-bold text-dark shadow-sm d-flex align-items-center justify-content-center gap-2 hover-bg-light"
                          onClick={() => navigate(`/order/${appt._id}`)}
                        >
                          <FileText size={16} className="text-muted" /> View
                          Details
                        </button>

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
              <button
                className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm hover-lift d-flex align-items-center justify-content-center gap-2 py-2"
                onClick={() => {
                  setPreselectedDoctorId(null);
                  setShowModal(true);
                }}
              >
                <Plus size={18} /> Book Appointment
              </button>
            </div>
          </div>

          <div className="card border-light-subtle shadow-sm rounded-4 bg-white p-4">
            <h6 className="fw-bolder mb-3 d-flex align-items-center gap-2 text-dark">
              <AlertCircle size={20} className="text-primary" /> Appointment
              Guidelines
            </h6>
            <ul className="text-muted small mb-0 ps-3 fw-medium lh-lg">
              <li>
                Arrive <strong className="text-dark">10 minutes</strong> early.
              </li>
              <li>Carry previous medical records.</li>
              <li>
                Cancellations must be made{" "}
                <strong className="text-dark">2 hours</strong> in advance.
              </li>
              <li>
                Confirmed appointments allow{" "}
                <strong className="text-primary">Instant Messaging</strong> with
                your doctor.
              </li>
            </ul>
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

      <style>{`
        .border-start-md { border-left: none; }
        @media (min-width: 768px) {
          .border-start-md { border-left: 1px solid #e2e8f0; }
        }
        .fw-black { font-weight: 900; }
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .tracking-wider { letter-spacing: 0.05em; }
        .btn-white { background-color: #ffffff; }
        .spin-animation { animation: spin 1s linear infinite; }
        .transition-all { transition: all 0.3s ease; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default CustomerAppointments;
