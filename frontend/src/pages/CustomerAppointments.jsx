// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import { Calendar, BookOpen, AlertCircle } from "lucide-react";

// const CustomerAppointments = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [booking, setBooking] = useState({
//     doctor: "",
//     date: "",
//     timeSlot: "",
//     notes: "",
//   });
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const timeSlots = [
//     "09:00-10:00",
//     "10:00-11:00",
//     "11:00-12:00",
//     "14:00-15:00",
//     "15:00-16:00",
//     "16:00-17:00",
//   ];

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
//         // ❌ was /admin/doctors (403 for customers)
//         api.get("/doctors/customer/doctors", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         // ❌ was /api/appointments/my (double /api/api in base)
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
//   };

//   const submitBooking = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!booking.doctor || !booking.date || !booking.timeSlot) {
//       setError("Please fill all required fields.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Please login again.");
//         return;
//       }

//       await api.post("/appointments", booking, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setSuccess("Appointment booked successfully!");
//       setBooking({ doctor: "", date: "", timeSlot: "", notes: "" });
//       setShowBookingForm(false);
//       fetchData(); // Refresh appointments
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
//                         <th>Date & Time</th>
//                         <th>Doctor</th>
//                         <th>Status</th>
//                         <th>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {myAppointments.map((appt) => (
//                         <tr key={appt._id}>
//                           <td>
//                             <strong>
//                               {appt.date
//                                 ? new Date(appt.date).toLocaleDateString()
//                                 : "-"}
//                             </strong>
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
//                               <button className="btn btn-outline-danger btn-sm">
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
//                       setBooking((prev) => ({ ...prev, doctor: doctor._id }));
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
//                   <label className="form-label fw-medium">Date *</label>
//                   <input
//                     type="date"
//                     name="date"
//                     className="form-control"
//                     value={booking.date}
//                     onChange={handleBookingChange}
//                     min={new Date().toISOString().split("T")[0]}
//                     required
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label fw-medium">Time Slot *</label>
//                   <select
//                     name="timeSlot"
//                     className="form-select"
//                     value={booking.timeSlot}
//                     onChange={handleBookingChange}
//                     required
//                     disabled={!booking.doctor || !booking.date}
//                   >
//                     <option value="">Select time...</option>
//                     {timeSlots.map((slot) => (
//                       <option key={slot} value={slot}>
//                         {slot}
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
//                     !booking.doctor || !booking.date || !booking.timeSlot
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
// import { Calendar, BookOpen, AlertCircle } from "lucide-react";

// const CustomerAppointments = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [booking, setBooking] = useState({
//     doctor: "",
//     date: "",
//     timeSlot: "",
//     notes: "",
//   });
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [selectedDoctorSlots, setSelectedDoctorSlots] = useState([]);

//   // ✅ UPDATED: Dynamic time slots from doctor's timeSlots
//   const getAvailableTimeSlots = () => {
//     if (!booking.doctor) return [];

//     const doctor = doctors.find((d) => d._id === booking.doctor);
//     return doctor?.timeSlots || [];
//   };

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
//         api.get("/doctors/customer/doctors", {
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
//   };

//   // ✅ NEW: Update available slots when doctor/date changes
//   useEffect(() => {
//     if (booking.doctor) {
//       const doctor = doctors.find((d) => d._id === booking.doctor);
//       setSelectedDoctorSlots(doctor?.timeSlots || []);
//     } else {
//       setSelectedDoctorSlots([]);
//     }
//   }, [booking.doctor, doctors]);

//   const submitBooking = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!booking.doctor || !booking.date || !booking.timeSlot) {
//       setError("Please fill all required fields.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Please login again.");
//         return;
//       }

//       await api.post("/appointments", booking, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setSuccess("Appointment booked successfully!");
//       setBooking({ doctor: "", date: "", timeSlot: "", notes: "" });
//       setShowBookingForm(false);
//       fetchData(); // Refresh appointments
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
//                         <th>Date & Time</th>
//                         <th>Doctor</th>
//                         <th>Status</th>
//                         <th>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {myAppointments.map((appt) => (
//                         <tr key={appt._id}>
//                           <td>
//                             <strong>
//                               {appt.date
//                                 ? new Date(appt.date).toLocaleDateString()
//                                 : "-"}
//                             </strong>
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
//                               <button className="btn btn-outline-danger btn-sm">
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
//                       setBooking((prev) => ({ ...prev, doctor: doctor._id }));
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
//                       {doctor.timeSlots?.length > 0 && (
//                         <small className="d-block text-success">
//                           {doctor.timeSlots.length} slots available
//                         </small>
//                       )}
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
//                   <label className="form-label fw-medium">Date *</label>
//                   <input
//                     type="date"
//                     name="date"
//                     className="form-control"
//                     value={booking.date}
//                     onChange={handleBookingChange}
//                     min={new Date().toISOString().split("T")[0]}
//                     required
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label fw-medium">Time Slot *</label>
//                   <select
//                     name="timeSlot"
//                     className="form-select"
//                     value={booking.timeSlot}
//                     onChange={handleBookingChange}
//                     required
//                     disabled={!booking.doctor || !booking.date}
//                   >
//                     <option value="">
//                       {booking.doctor && booking.date
//                         ? "Select time..."
//                         : "Select doctor & date first"}
//                     </option>
//                     {/* ✅ UPDATED: Dynamic doctor time slots */}
//                     {selectedDoctorSlots.map((slot) => (
//                       <option key={slot} value={slot}>
//                         {slot}
//                       </option>
//                     ))}
//                   </select>
//                   {selectedDoctorSlots.length === 0 && booking.doctor && (
//                     <small className="text-muted">
//                       No time slots available for this doctor
//                     </small>
//                   )}
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
//                     !booking.doctor || !booking.date || !booking.timeSlot
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

import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Calendar, BookOpen, AlertCircle } from "lucide-react";

const CustomerAppointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    doctor: "",
    date: "",
    timeSlot: "",
    notes: "",
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);

  // Fetch doctors and my appointments
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login again.");
        setLoading(false);
        return;
      }

      const [doctorsRes, appointmentsRes] = await Promise.all([
        api.get("/doctors/customer/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/appointments/my", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setDoctors(doctorsRes.data || []);
      setMyAppointments(appointmentsRes.data || []);
    } catch (err) {
      console.error("CustomerAppointments fetch error:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // Recompute available slots when doctor or date changes
  useEffect(() => {
    if (!booking.doctor || !booking.date) {
      setAvailableSlots([]);
      return;
    }

    const doctor = doctors.find((d) => d._id === booking.doctor);
    if (!doctor || !Array.isArray(doctor.slots)) {
      setAvailableSlots([]);
      return;
    }

    const selectedDay = new Date(booking.date);
    selectedDay.setHours(0, 0, 0, 0);

    const slotsForDay = doctor.slots.filter((s) => {
      if (!s.date) return false;
      const sDay = new Date(s.date);
      sDay.setHours(0, 0, 0, 0);
      return sDay.getTime() === selectedDay.getTime() && !s.isBooked;
    });

    const mapped = slotsForDay.map((s) => ({
      value: `${s.startTime}-${s.endTime}`,
      label: `${s.startTime} - ${s.endTime}`,
    }));

    setAvailableSlots(mapped);

    if (booking.timeSlot && !mapped.some((m) => m.value === booking.timeSlot)) {
      setBooking((prev) => ({ ...prev, timeSlot: "" }));
    }
  }, [booking.doctor, booking.date, doctors]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitBooking = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!booking.doctor || !booking.date || !booking.timeSlot) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login again.");
        return;
      }

      const [startTime, endTime] = booking.timeSlot.split("-");

      await api.post(
        "/appointments",
        {
          doctor: booking.doctor,
          date: booking.date,
          startTime,
          endTime,
          notes: booking.notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Appointment booked successfully!");
      setBooking({ doctor: "", date: "", timeSlot: "", notes: "" });
      setShowBookingForm(false);
      fetchData();
    } catch (err) {
      console.error("Appointment booking error:", err);
      setError(err.response?.data?.message || "Failed to book appointment.");
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      pending: "bg-warning text-dark",
      confirmed: "bg-success",
      completed: "bg-info text-white",
      cancelled: "bg-secondary",
    };
    return `badge ${classes[status] || "bg-light text-dark"}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-50">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Upcoming Appointments */}
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0 d-flex align-items-center gap-2">
                <Calendar size={20} />
                My Appointments
              </h5>
            </div>
            <div className="card-body">
              {myAppointments.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <Calendar size={48} className="mb-3 opacity-50" />
                  <p>No appointments booked yet.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowBookingForm(true)}
                  >
                    Book Appointment
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Doctor</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myAppointments.map((appt) => (
                        <tr key={appt._id}>
                          <td>
                            <strong>
                              {appt.date
                                ? new Date(appt.date).toLocaleDateString()
                                : "-"}
                            </strong>
                            <br />
                            <small>{appt.timeSlot}</small>
                          </td>
                          <td>
                            <strong>{appt.doctor?.name}</strong>
                            <br />
                            <small className="text-muted">
                              {appt.doctor?.speciality}
                            </small>
                          </td>
                          <td>
                            <span className={getStatusBadge(appt.status)}>
                              {appt.status?.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            {appt.status === "pending" && (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={async () => {
                                  try {
                                    const token = localStorage.getItem("token");
                                    if (!token) {
                                      setError("Please login again.");
                                      return;
                                    }
                                    await api.put(
                                      `/appointments/${appt._id}/cancel`,
                                      {},
                                      {
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      }
                                    );
                                    fetchData();
                                  } catch (err) {
                                    console.error(
                                      "cancel appointment error:",
                                      err
                                    );
                                    setError(
                                      err.response?.data?.message ||
                                        "Failed to cancel appointment."
                                    );
                                  }
                                }}
                              >
                                Cancel
                              </button>
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
        </div>

        {/* Quick Book */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0 d-flex align-items-center gap-2">
                <BookOpen size={18} />
                Quick Book
              </h6>
            </div>
            <div className="card-body">
              <button
                className="btn btn-outline-primary w-100 mb-3"
                onClick={() => setShowBookingForm(true)}
              >
                + New Appointment
              </button>

              <div className="list-group list-group-flush">
                {doctors.slice(0, 3).map((doctor) => (
                  <button
                    key={doctor._id}
                    className="list-group-item list-group-item-action d-flex align-items-center gap-3 p-3"
                    onClick={() => {
                      setBooking((prev) => ({
                        ...prev,
                        doctor: doctor._id,
                      }));
                      setShowBookingForm(true);
                    }}
                  >
                    <div
                      className="rounded-circle bg-primary bg-opacity-20 text-primary d-flex align-items-center justify-content-center"
                      style={{ width: 40, height: 40 }}
                    >
                      Dr
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold">{doctor.name}</div>
                      <small className="text-muted">{doctor.speciality}</small>
                      {doctor.slots?.length > 0 && (
                        <small className="d-block text-success">
                          {doctor.slots.length} slots available
                        </small>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div
            className="bg-white rounded-4 shadow-lg p-4"
            style={{ maxWidth: 500, width: "100%" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-bold">
                <Calendar size={20} className="me-2" />
                Book Appointment
              </h5>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowBookingForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitBooking}>
              {error && (
                <div className="alert alert-danger py-2 mb-3" role="alert">
                  <AlertCircle size={16} className="me-2" />
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success py-2 mb-3" role="alert">
                  {success}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-medium">Doctor *</label>
                <select
                  name="doctor"
                  className="form-select"
                  value={booking.doctor}
                  onChange={handleBookingChange}
                  required
                >
                  <option value="">Select doctor...</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.speciality}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Date *</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    value={booking.date}
                    onChange={handleBookingChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">Time Slot *</label>
                  <select
                    name="timeSlot"
                    className="form-select"
                    value={booking.timeSlot}
                    onChange={handleBookingChange}
                    required
                    disabled={
                      !booking.doctor || !booking.date || !availableSlots.length
                    }
                  >
                    <option value="">
                      {booking.doctor && booking.date
                        ? "Select time..."
                        : "Select doctor & date first"}
                    </option>
                    {availableSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  {booking.doctor &&
                    booking.date &&
                    availableSlots.length === 0 && (
                      <small className="text-muted">
                        No time slots available for this doctor on this date
                      </small>
                    )}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Notes</label>
                <textarea
                  name="notes"
                  className="form-control"
                  rows="3"
                  placeholder="Symptoms, reason for visit..."
                  value={booking.notes}
                  onChange={handleBookingChange}
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary flex-grow-1"
                  onClick={() => setShowBookingForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-grow-1"
                  disabled={
                    !booking.doctor || !booking.date || !booking.timeSlot
                  }
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAppointments;
