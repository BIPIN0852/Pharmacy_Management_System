// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import { X, Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";

// const BookAppointmentModal = ({ show, onClose, onSuccess }) => {
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState("");
//   const [selectedDay, setSelectedDay] = useState("");
//   const [selectedSlot, setSelectedSlot] = useState("");
//   const [availableDays, setAvailableDays] = useState([]);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [notes, setNotes] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch doctors for the initial list
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await api.get("/admin/doctors");
//         const data = res.data?.doctors || res.data || [];
//         setDoctors(data);
//       } catch (err) {
//         console.error("Error fetching medical directory:", err);
//       }
//     };
//     if (show) fetchDoctors();
//   }, [show]);

//   /**
//    * ✅ FIX: Extract recurring available days for the selected doctor
//    * This replaces the calendar date logic.
//    */
//   useEffect(() => {
//     if (selectedDoctor) {
//       const doc = doctors.find((d) => d._id === selectedDoctor);
//       if (doc && doc.slots) {
//         // Get unique days from the doctor's allotments (e.g., ["MONDAY", "FRIDAY"])
//         const uniqueDays = [
//           ...new Set(doc.slots.map((s) => s.day.toUpperCase())),
//         ];
//         setAvailableDays(uniqueDays);
//         setSelectedDay("");
//       }
//     } else {
//       setAvailableDays([]);
//     }
//   }, [selectedDoctor, doctors]);

//   /**
//    * ✅ FIX: Filter specific time slots based on the chosen day
//    */
//   useEffect(() => {
//     if (selectedDoctor && selectedDay) {
//       const doc = doctors.find((d) => d._id === selectedDoctor);
//       if (doc && doc.slots) {
//         const filtered = doc.slots.filter(
//           (slot) => slot.day.toUpperCase() === selectedDay && !slot.isBooked
//         );
//         setAvailableSlots(filtered);
//         setSelectedSlot("");
//       }
//     } else {
//       setAvailableSlots([]);
//     }
//   }, [selectedDay, selectedDoctor, doctors]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedDoctor || !selectedDay || !selectedSlot) {
//       setError("Incomplete selection: Doctor, Day, and Time are required.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const payload = {
//         doctor: selectedDoctor,
//         day: selectedDay,
//         timeSlot: selectedSlot,
//         notes,
//       };

//       await api.post("/appointments", payload);

//       onSuccess();
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.message || "Internal booking error.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <div className="modal show d-block animate-fade-in" tabIndex="-1">
//       <div className="modal-backdrop fade show" onClick={onClose}></div>
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content border-0 shadow-lg rounded-4">
//           <div className="modal-header border-0 pb-0 pe-4">
//             <h5 className="modal-title fw-bold d-flex align-items-center gap-2 text-dark">
//               <Calendar size={22} className="text-primary" /> Schedule
//               Appointment
//             </h5>
//             <button
//               type="button"
//               className="btn-close shadow-none"
//               onClick={onClose}
//             ></button>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="modal-body p-4">
//               {error && (
//                 <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
//                   <AlertCircle size={16} />
//                   {error}
//                 </div>
//               )}

//               {/* Doctor Selection */}
//               <div className="mb-4">
//                 <label className="form-label small fw-bold text-muted text-uppercase">
//                   Medical Specialist *
//                 </label>
//                 <select
//                   className="form-select border-2 py-2 shadow-none"
//                   value={selectedDoctor}
//                   onChange={(e) => setSelectedDoctor(e.target.value)}
//                   required
//                 >
//                   <option value="">Choose Doctor...</option>
//                   {doctors.map((doc) => (
//                     <option key={doc._id} value={doc._id}>
//                       {doc.name} — {doc.speciality}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="row g-3">
//                 {/* Day Selection - Replaces the Date Input */}
//                 <div className="col-md-6">
//                   <label className="form-label small fw-bold text-muted text-uppercase">
//                     Select Day *
//                   </label>
//                   <select
//                     className="form-select border-2 py-2 shadow-none"
//                     value={selectedDay}
//                     onChange={(e) => setSelectedDay(e.target.value)}
//                     disabled={!selectedDoctor || availableDays.length === 0}
//                     required
//                   >
//                     {!selectedDoctor ? (
//                       <option>Select doctor first</option>
//                     ) : availableDays.length > 0 ? (
//                       <>
//                         <option value="">Choose Day...</option>
//                         {availableDays.map((day) => (
//                           <option key={day} value={day}>
//                             {day}
//                           </option>
//                         ))}
//                       </>
//                     ) : (
//                       <option>No schedule found</option>
//                     )}
//                   </select>
//                 </div>

//                 {/* Filtered Time Slot Selection */}
//                 <div className="col-md-6">
//                   <label className="form-label small fw-bold text-muted text-uppercase">
//                     Time Slot *
//                   </label>
//                   <select
//                     className="form-select border-2 py-2 shadow-none"
//                     value={selectedSlot}
//                     onChange={(e) => setSelectedSlot(e.target.value)}
//                     disabled={!selectedDay || availableSlots.length === 0}
//                     required
//                   >
//                     {!selectedDay ? (
//                       <option>Select day first</option>
//                     ) : availableSlots.length > 0 ? (
//                       <>
//                         <option value="">Select Time...</option>
//                         {availableSlots.map((slot) => (
//                           <option
//                             key={slot._id}
//                             value={`${slot.startTime} - ${slot.endTime}`}
//                           >
//                             {slot.startTime} — {slot.endTime}
//                           </option>
//                         ))}
//                       </>
//                     ) : (
//                       <option>None available</option>
//                     )}
//                   </select>
//                 </div>
//               </div>

//               <div className="mt-4">
//                 <label className="form-label small fw-bold text-muted text-uppercase">
//                   Appointment Notes
//                 </label>
//                 <textarea
//                   className="form-control border-2 shadow-none"
//                   rows="3"
//                   placeholder="Describe your symptoms or reason for the visit..."
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                 ></textarea>
//               </div>
//             </div>

//             <div className="modal-footer border-0 pt-0 pe-4 pb-4">
//               <button
//                 type="button"
//                 className="btn btn-light rounded-pill px-4 me-2 border fw-bold text-muted"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
//                 disabled={loading || !selectedSlot}
//               >
//                 {loading ? (
//                   <span className="spinner-border spinner-border-sm me-2" />
//                 ) : (
//                   "Confirm Slot"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookAppointmentModal;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   X,
//   Calendar,
//   Clock,
//   AlertCircle,
//   CheckCircle,
//   Loader2,
// } from "lucide-react";

// const BookAppointmentModal = ({ show, onClose, onSuccess }) => {
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState("");
//   const [selectedDay, setSelectedDay] = useState("");
//   const [selectedDate, setSelectedDate] = useState(""); // ✅ New: Stores actual date
//   const [selectedSlot, setSelectedSlot] = useState("");
//   const [availableDays, setAvailableDays] = useState([]);
//   const [availableSlots, setAvailableSlots] = useState([]); // ✅ Now holds status objects
//   const [notes, setNotes] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [checkingAvailability, setCheckingAvailability] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch doctors (Use public route so it works for everyone)
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await api.get("/doctors"); // ✅ Changed from /admin/doctors to public
//         const data = res.data?.doctors || res.data || [];
//         setDoctors(data);
//       } catch (err) {
//         console.error("Error fetching medical directory:", err);
//       }
//     };
//     if (show) fetchDoctors();
//   }, [show]);

//   // ✅ Helper: Get Next Calendar Date for a Day Name
//   const getNextDateForDay = (dayName) => {
//     const days = [
//       "SUNDAY",
//       "MONDAY",
//       "TUESDAY",
//       "WEDNESDAY",
//       "THURSDAY",
//       "FRIDAY",
//       "SATURDAY",
//     ];
//     const targetIndex = days.indexOf(dayName.toUpperCase());
//     if (targetIndex === -1) return null;

//     const date = new Date();
//     const currentDay = date.getDay();

//     // Calculate difference (0 means today, otherwise future date)
//     let diff = targetIndex - currentDay;
//     if (diff <= 0) diff += 7; // Always get next week's day to be safe, or use < 0 for today inclusive

//     date.setDate(date.getDate() + diff);
//     return date;
//   };

//   // Logic: Extract unique working days
//   useEffect(() => {
//     if (selectedDoctor) {
//       const doc = doctors.find((d) => d._id === selectedDoctor);
//       if (doc && doc.slots) {
//         const uniqueDays = [
//           ...new Set(doc.slots.map((s) => s.day.toUpperCase())),
//         ];
//         setAvailableDays(uniqueDays);
//         setSelectedDay("");
//         setAvailableSlots([]);
//         setSelectedSlot("");
//       }
//     } else {
//       setAvailableDays([]);
//     }
//   }, [selectedDoctor, doctors]);

//   // ✅ Logic: Check Live Availability & Capacity
//   useEffect(() => {
//     const checkSlots = async () => {
//       if (!selectedDoctor || !selectedDay) {
//         setAvailableSlots([]);
//         return;
//       }

//       const doc = doctors.find((d) => d._id === selectedDoctor);
//       if (!doc) return;

//       // 1. Calculate the specific date
//       const targetDate = getNextDateForDay(selectedDay);
//       if (!targetDate) return;

//       setSelectedDate(targetDate.toISOString()); // Store for submission
//       setCheckingAvailability(true);

//       try {
//         // 2. Fetch occupied counts from backend
//         // Note: Ensure /appointments/availability route exists in backend
//         const res = await api.get(`/appointments/availability`, {
//           params: { doctorId: selectedDoctor, date: targetDate.toISOString() },
//         });

//         // 3. Filter slots for the day and merge with live status
//         const daySlots = doc.slots.filter(
//           (s) => s.day.toUpperCase() === selectedDay
//         );

//         const mergedSlots = daySlots.map((slot) => {
//           const slotString = `${slot.startTime} - ${slot.endTime}`;
//           // Check if backend returned status for this specific slot time
//           const statusObj = res.data.find((d) => d.time === slotString);
//           return {
//             value: slotString,
//             label: `${slot.startTime} - ${slot.endTime}`,
//             status: statusObj ? statusObj.status : "available", // available, limited, full
//           };
//         });

//         setAvailableSlots(mergedSlots);
//         setSelectedSlot(""); // Reset selection on day change
//       } catch (err) {
//         console.error("Availability check failed", err);
//         // Fallback: show slots as available if check fails
//         const daySlots = doc.slots.filter(
//           (s) => s.day.toUpperCase() === selectedDay
//         );
//         setAvailableSlots(
//           daySlots.map((slot) => ({
//             value: `${slot.startTime} - ${slot.endTime}`,
//             label: `${slot.startTime} - ${slot.endTime}`,
//             status: "available",
//           }))
//         );
//       } finally {
//         setCheckingAvailability(false);
//       }
//     };

//     checkSlots();
//   }, [selectedDay, selectedDoctor, doctors]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedDoctor || !selectedDate || !selectedSlot) {
//       setError("Incomplete selection.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const payload = {
//         doctor: selectedDoctor,
//         day: selectedDay,
//         date: selectedDate, // ✅ Send specific date
//         timeSlot: selectedSlot,
//         notes,
//       };

//       await api.post("/appointments", payload);

//       onSuccess();
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.message || "Booking failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <div className="modal show d-block animate-fade-in" tabIndex="-1">
//       <div className="modal-backdrop fade show" onClick={onClose}></div>
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content border-0 shadow-lg rounded-4">
//           <div className="modal-header border-0 pb-0 pe-4 pt-4 px-4">
//             <h5 className="modal-title fw-bold d-flex align-items-center gap-2 text-dark">
//               <Calendar size={22} className="text-primary" /> Schedule
//               Appointment
//             </h5>
//             <button
//               type="button"
//               className="btn-close shadow-none"
//               onClick={onClose}
//             ></button>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="modal-body p-4">
//               {error && (
//                 <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
//                   <AlertCircle size={16} /> {error}
//                 </div>
//               )}

//               {/* Doctor Selection */}
//               <div className="mb-3">
//                 <label className="form-label small fw-bold text-muted text-uppercase">
//                   Medical Specialist
//                 </label>
//                 <select
//                   className="form-select border-2 py-2 shadow-none"
//                   value={selectedDoctor}
//                   onChange={(e) => setSelectedDoctor(e.target.value)}
//                   required
//                 >
//                   <option value="">Choose Doctor...</option>
//                   {doctors.map((doc) => (
//                     <option key={doc._id} value={doc._id}>
//                       {doc.name} — {doc.speciality}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="row g-3">
//                 {/* Day Selection */}
//                 <div className="col-md-6">
//                   <label className="form-label small fw-bold text-muted text-uppercase">
//                     Select Day
//                   </label>
//                   <select
//                     className="form-select border-2 py-2 shadow-none"
//                     value={selectedDay}
//                     onChange={(e) => setSelectedDay(e.target.value)}
//                     disabled={!selectedDoctor}
//                     required
//                   >
//                     <option value="">
//                       {!selectedDoctor
//                         ? "Select doctor first"
//                         : availableDays.length === 0
//                         ? "No schedule available" // ✅ UX Fix
//                         : "Choose Day..."}
//                     </option>
//                     {availableDays.map((day) => (
//                       <option key={day} value={day}>
//                         {day}
//                       </option>
//                     ))}
//                   </select>
//                   {/* Show calculated date hint */}
//                   {selectedDate && (
//                     <div className="form-text small text-primary mt-1 d-flex align-items-center">
//                       <Clock size={12} className="me-1" />
//                       Date: {new Date(selectedDate).toLocaleDateString()}
//                     </div>
//                   )}
//                 </div>

//                 {/* Time Slot Selection with Status */}
//                 <div className="col-md-6">
//                   <label className="form-label small fw-bold text-muted text-uppercase">
//                     Time Slot
//                   </label>
//                   <select
//                     className="form-select border-2 py-2 shadow-none"
//                     value={selectedSlot}
//                     onChange={(e) => setSelectedSlot(e.target.value)}
//                     disabled={!selectedDay || checkingAvailability}
//                     required
//                   >
//                     <option value="">
//                       {checkingAvailability ? "Checking..." : "Select Time..."}
//                     </option>
//                     {availableSlots.map((slot) => (
//                       <option
//                         key={slot.value}
//                         value={slot.value}
//                         disabled={slot.status === "full"} // ✅ Disable full slots
//                         className={
//                           slot.status === "full" ? "text-muted bg-light" : ""
//                         }
//                       >
//                         {slot.label}{" "}
//                         {slot.status === "full"
//                           ? "(FULL)"
//                           : slot.status === "limited"
//                           ? "(Limited)"
//                           : ""}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="mt-3">
//                 <label className="form-label small fw-bold text-muted text-uppercase">
//                   Notes
//                 </label>
//                 <textarea
//                   className="form-control border-2 shadow-none"
//                   rows="3"
//                   placeholder="Reason for visit..."
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                 ></textarea>
//               </div>
//             </div>

//             <div className="modal-footer border-0 pt-0 px-4 pb-4">
//               <button
//                 type="button"
//                 className="btn btn-light rounded-pill px-4 me-2 fw-bold"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
//                 disabled={loading || !selectedSlot}
//               >
//                 {loading ? (
//                   <Loader2 className="animate-spin" size={18} />
//                 ) : (
//                   "Confirm Booking"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookAppointmentModal;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   X,
//   Calendar,
//   Clock,
//   AlertCircle,
//   CheckCircle,
//   Loader2,
// } from "lucide-react";

// const BookAppointmentModal = ({ show, onClose, onSuccess }) => {
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState("");
//   const [selectedDay, setSelectedDay] = useState("");
//   const [selectedDate, setSelectedDate] = useState(""); // Stores actual date
//   const [selectedSlot, setSelectedSlot] = useState("");
//   const [availableDays, setAvailableDays] = useState([]);
//   const [availableSlots, setAvailableSlots] = useState([]); // Holds status objects
//   const [notes, setNotes] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [checkingAvailability, setCheckingAvailability] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch doctors (Use public route so it works for everyone)
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await api.get("/doctors");
//         const data = res.data?.doctors || res.data || [];
//         setDoctors(data);
//       } catch (err) {
//         console.error("Error fetching medical directory:", err);
//       }
//     };
//     if (show) fetchDoctors();
//   }, [show]);

//   // Helper: Get Next Calendar Date for a Day Name
//   const getNextDateForDay = (dayName) => {
//     const days = [
//       "SUNDAY",
//       "MONDAY",
//       "TUESDAY",
//       "WEDNESDAY",
//       "THURSDAY",
//       "FRIDAY",
//       "SATURDAY",
//     ];
//     const targetIndex = days.indexOf(dayName.toUpperCase());
//     if (targetIndex === -1) return null;

//     const date = new Date();
//     const currentDay = date.getDay();

//     // Calculate difference (Always get next week's day to be safe)
//     let diff = targetIndex - currentDay;
//     if (diff <= 0) diff += 7;

//     date.setDate(date.getDate() + diff);
//     return date;
//   };

//   // Logic: Extract unique working days
//   useEffect(() => {
//     setError(""); // Clear error when changing doctor
//     if (selectedDoctor) {
//       const doc = doctors.find((d) => d._id === selectedDoctor);
//       if (doc && doc.slots) {
//         const uniqueDays = [
//           ...new Set(doc.slots.map((s) => s.day.toUpperCase())),
//         ];
//         setAvailableDays(uniqueDays);
//         setSelectedDay("");
//         setAvailableSlots([]);
//         setSelectedSlot("");
//       }
//     } else {
//       setAvailableDays([]);
//     }
//   }, [selectedDoctor, doctors]);

//   // Logic: Check Live Availability & Capacity
//   useEffect(() => {
//     const checkSlots = async () => {
//       if (!selectedDoctor || !selectedDay) {
//         setAvailableSlots([]);
//         return;
//       }

//       setError(""); // Clear error when changing day
//       const doc = doctors.find((d) => d._id === selectedDoctor);
//       if (!doc) return;

//       const targetDate = getNextDateForDay(selectedDay);
//       if (!targetDate) return;

//       setSelectedDate(targetDate.toISOString());
//       setCheckingAvailability(true);

//       try {
//         // Fetch occupied counts from backend
//         const res = await api.get(`/appointments/availability`, {
//           params: { doctorId: selectedDoctor, date: targetDate.toISOString() },
//         });

//         const daySlots = doc.slots.filter(
//           (s) => s.day.toUpperCase() === selectedDay
//         );

//         const mergedSlots = daySlots.map((slot) => {
//           const slotString = `${slot.startTime} - ${slot.endTime}`;
//           const statusObj = res.data.find((d) => d.time === slotString);
//           return {
//             value: slotString,
//             label: `${slot.startTime} - ${slot.endTime}`,
//             status: statusObj ? statusObj.status : "available",
//           };
//         });

//         setAvailableSlots(mergedSlots);
//         setSelectedSlot("");
//       } catch (err) {
//         console.error("Availability check failed", err);
//         // Fallback: show slots as available if check fails
//         const daySlots = doc.slots.filter(
//           (s) => s.day.toUpperCase() === selectedDay
//         );
//         setAvailableSlots(
//           daySlots.map((slot) => ({
//             value: `${slot.startTime} - ${slot.endTime}`,
//             label: `${slot.startTime} - ${slot.endTime}`,
//             status: "available",
//           }))
//         );
//       } finally {
//         setCheckingAvailability(false);
//       }
//     };

//     checkSlots();
//   }, [selectedDay, selectedDoctor, doctors]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Safety check: ensure date is not in the past
//     if (new Date(selectedDate) < new Date().setHours(0, 0, 0, 0)) {
//       setError("Cannot book an appointment for a past date.");
//       return;
//     }

//     if (!selectedDoctor || !selectedDate || !selectedSlot) {
//       setError("Incomplete selection.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const payload = {
//         doctor: selectedDoctor,
//         day: selectedDay,
//         date: selectedDate,
//         timeSlot: selectedSlot,
//         notes,
//       };

//       await api.post("/appointments", payload);

//       onSuccess();
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.message || "Booking failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <div className="modal show d-block animate-fade-in" tabIndex="-1">
//       <div className="modal-backdrop fade show" onClick={onClose}></div>
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content border-0 shadow-lg rounded-4">
//           <div className="modal-header border-0 pb-0 pe-4 pt-4 px-4">
//             <h5 className="modal-title fw-bold d-flex align-items-center gap-2 text-dark">
//               <Calendar size={22} className="text-primary" /> Schedule
//               Appointment
//             </h5>
//             <button
//               type="button"
//               className="btn-close shadow-none"
//               onClick={onClose}
//             ></button>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="modal-body p-4">
//               {error && (
//                 <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
//                   <AlertCircle size={16} /> {error}
//                 </div>
//               )}

//               {/* Doctor Selection */}
//               <div className="mb-3">
//                 <label className="form-label small fw-bold text-muted text-uppercase">
//                   Medical Specialist
//                 </label>
//                 <select
//                   className="form-select border-2 py-2 shadow-none"
//                   value={selectedDoctor}
//                   onChange={(e) => setSelectedDoctor(e.target.value)}
//                   required
//                 >
//                   <option value="">Choose Doctor...</option>
//                   {doctors.map((doc) => (
//                     <option key={doc._id} value={doc._id}>
//                       {doc.name} — {doc.speciality}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="row g-3">
//                 {/* Day Selection */}
//                 <div className="col-md-6">
//                   <label className="form-label small fw-bold text-muted text-uppercase">
//                     Select Day
//                   </label>
//                   <select
//                     className="form-select border-2 py-2 shadow-none"
//                     value={selectedDay}
//                     onChange={(e) => setSelectedDay(e.target.value)}
//                     disabled={!selectedDoctor}
//                     required
//                   >
//                     <option value="">
//                       {!selectedDoctor
//                         ? "Select doctor first"
//                         : availableDays.length === 0
//                         ? "No schedule available"
//                         : "Choose Day..."}
//                     </option>
//                     {availableDays.map((day) => (
//                       <option key={day} value={day}>
//                         {day}
//                       </option>
//                     ))}
//                   </select>
//                   {/* Show calculated date hint */}
//                   {selectedDate && (
//                     <div className="form-text small text-primary mt-1 d-flex align-items-center">
//                       <Clock size={12} className="me-1" />
//                       Date: {new Date(selectedDate).toLocaleDateString()}
//                     </div>
//                   )}
//                 </div>

//                 {/* Time Slot Selection with Status */}
//                 <div className="col-md-6">
//                   <label className="form-label small fw-bold text-muted text-uppercase">
//                     Time Slot
//                   </label>
//                   <select
//                     className="form-select border-2 py-2 shadow-none"
//                     value={selectedSlot}
//                     onChange={(e) => setSelectedSlot(e.target.value)}
//                     disabled={!selectedDay || checkingAvailability}
//                     required
//                   >
//                     <option value="">
//                       {checkingAvailability ? "Checking..." : "Select Time..."}
//                     </option>
//                     {availableSlots.map((slot) => (
//                       <option
//                         key={slot.value}
//                         value={slot.value}
//                         disabled={slot.status === "full"}
//                         className={
//                           slot.status === "full" ? "text-muted bg-light" : ""
//                         }
//                       >
//                         {slot.label}{" "}
//                         {slot.status === "full"
//                           ? "(FULL)"
//                           : slot.status === "limited"
//                           ? "(Limited)"
//                           : ""}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="mt-3">
//                 <label className="form-label small fw-bold text-muted text-uppercase">
//                   Notes
//                 </label>
//                 <textarea
//                   className="form-control border-2 shadow-none"
//                   rows="3"
//                   placeholder="Reason for visit..."
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                 ></textarea>
//               </div>
//             </div>

//             <div className="modal-footer border-0 pt-0 px-4 pb-4">
//               <button
//                 type="button"
//                 className="btn btn-light rounded-pill px-4 me-2 fw-bold"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
//                 disabled={loading || !selectedSlot}
//               >
//                 {loading ? (
//                   <Loader2 className="animate-spin" size={18} />
//                 ) : (
//                   "Confirm Booking"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookAppointmentModal;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   X,
//   Calendar,
//   Clock,
//   AlertCircle,
//   CheckCircle,
//   Loader2,
// } from "lucide-react";

// const BookAppointmentModal = ({ show, onClose, onSuccess }) => {
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState("");
//   const [selectedDay, setSelectedDay] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedSlot, setSelectedSlot] = useState("");
//   const [availableDays, setAvailableDays] = useState([]);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [notes, setNotes] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [checkingAvailability, setCheckingAvailability] = useState(false);
//   const [error, setError] = useState("");

//   // 1. Fetch doctors on modal show
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await api.get("/doctors");
//         const data = res.data?.doctors || res.data || [];
//         setDoctors(data);
//       } catch (err) {
//         console.error("Error fetching medical directory:", err);
//       }
//     };
//     if (show) fetchDoctors();
//   }, [show]);

//   // ✅ Helper: Get Next Calendar Date for a Day Name
//   const getNextDateForDay = (dayName) => {
//     const days = [
//       "SUNDAY",
//       "MONDAY",
//       "TUESDAY",
//       "WEDNESDAY",
//       "THURSDAY",
//       "FRIDAY",
//       "SATURDAY",
//     ];
//     const targetIndex = days.indexOf(dayName.toUpperCase());
//     if (targetIndex === -1) return null;

//     const date = new Date();
//     const currentDay = date.getDay();

//     let diff = targetIndex - currentDay;
//     if (diff <= 0) diff += 7; // Get the next week's occurrence

//     date.setDate(date.getDate() + diff);
//     return date;
//   };

//   // 2. Extract unique working days when doctor changes
//   useEffect(() => {
//     setError("");
//     if (selectedDoctor) {
//       const doc = doctors.find((d) => d._id === selectedDoctor);
//       if (doc && doc.slots) {
//         const uniqueDays = [
//           ...new Set(doc.slots.map((s) => s.day.toUpperCase())),
//         ];
//         setAvailableDays(uniqueDays);
//         setSelectedDay("");
//         setAvailableSlots([]);
//         setSelectedSlot("");
//         setSelectedDate("");
//       }
//     } else {
//       setAvailableDays([]);
//     }
//   }, [selectedDoctor, doctors]);

//   // 3. Check Live Availability & Set Specific Date when day is chosen
//   useEffect(() => {
//     const checkSlots = async () => {
//       if (!selectedDoctor || !selectedDay) {
//         setAvailableSlots([]);
//         return;
//       }

//       const doc = doctors.find((d) => d._id === selectedDoctor);
//       if (!doc) return;

//       const targetDate = getNextDateForDay(selectedDay);
//       if (!targetDate) return;

//       setSelectedDate(targetDate.toISOString());
//       setCheckingAvailability(true);

//       try {
//         const res = await api.get(`/appointments/availability`, {
//           params: { doctorId: selectedDoctor, date: targetDate.toISOString() },
//         });

//         const daySlots = doc.slots.filter(
//           (s) => s.day.toUpperCase() === selectedDay
//         );

//         const mergedSlots = daySlots.map((slot) => {
//           const slotString = `${slot.startTime} - ${slot.endTime}`;
//           const statusObj = res.data.find((d) => d.time === slotString);
//           return {
//             value: slotString,
//             label: `${slot.startTime} - ${slot.endTime}`,
//             status: statusObj ? statusObj.status : "available",
//           };
//         });

//         setAvailableSlots(mergedSlots);
//         setSelectedSlot("");
//       } catch (err) {
//         console.error("Availability check failed", err);
//         const daySlots = doc.slots.filter(
//           (s) => s.day.toUpperCase() === selectedDay
//         );
//         setAvailableSlots(
//           daySlots.map((s) => ({
//             value: `${s.startTime} - ${s.endTime}`,
//             label: `${s.startTime} - ${s.endTime}`,
//             status: "available",
//           }))
//         );
//       } finally {
//         setCheckingAvailability(false);
//       }
//     };

//     checkSlots();
//   }, [selectedDay, selectedDoctor, doctors]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedDoctor || !selectedDate || !selectedSlot) {
//       setError("Incomplete selection.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       await api.post("/appointments", {
//         doctor: selectedDoctor,
//         day: selectedDay,
//         date: selectedDate,
//         timeSlot: selectedSlot,
//         notes,
//       });
//       onSuccess();
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.message || "Booking failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <div
//       className="modal show d-block animate-fade-in"
//       style={{ background: "rgba(0,0,0,0.5)" }}
//     >
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//           <div className="modal-header border-0 pb-0 px-4 pt-4">
//             <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
//               <Calendar size={22} className="text-primary" /> Schedule
//               Appointment
//             </h5>
//             <button
//               type="button"
//               className="btn-close shadow-none"
//               onClick={onClose}
//             ></button>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="modal-body p-4">
//               {error && (
//                 <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
//                   <AlertCircle size={16} /> {error}
//                 </div>
//               )}

//               <div className="mb-3">
//                 <label className="form-label small fw-bold text-muted text-uppercase">
//                   Medical Specialist
//                 </label>
//                 <select
//                   className="form-select border-2 py-2 shadow-none"
//                   value={selectedDoctor}
//                   onChange={(e) => setSelectedDoctor(e.target.value)}
//                   required
//                 >
//                   <option value="">Choose Doctor...</option>
//                   {doctors.map((doc) => (
//                     <option key={doc._id} value={doc._id}>
//                       {doc.name} — {doc.speciality}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="row g-3">
//                 <div className="col-md-6">
//                   <label className="form-label small fw-bold text-muted text-uppercase">
//                     Select Day
//                   </label>
//                   <select
//                     className="form-select border-2 py-2 shadow-none"
//                     value={selectedDay}
//                     onChange={(e) => setSelectedDay(e.target.value)}
//                     disabled={!selectedDoctor}
//                     required
//                   >
//                     <option value="">
//                       {!selectedDoctor
//                         ? "Select doctor first"
//                         : "Choose Day..."}
//                     </option>
//                     {availableDays.map((day) => (
//                       <option key={day} value={day}>
//                         {day}
//                       </option>
//                     ))}
//                   </select>

//                   {/* ✅ Added Date Indicator */}
//                   {selectedDate && (
//                     <div className="mt-2 p-2 bg-light rounded-3 border small d-flex align-items-center gap-2 text-primary fw-semibold">
//                       <Calendar size={14} />
//                       Date:{" "}
//                       {new Date(selectedDate).toLocaleDateString("en-GB", {
//                         day: "2-digit",
//                         month: "long",
//                         year: "numeric",
//                       })}
//                     </div>
//                   )}
//                 </div>

//                 <div className="col-md-6">
//                   <label className="form-label small fw-bold text-muted text-uppercase">
//                     Time Slot
//                   </label>
//                   <select
//                     className="form-select border-2 py-2 shadow-none"
//                     value={selectedSlot}
//                     onChange={(e) => setSelectedSlot(e.target.value)}
//                     disabled={!selectedDay || checkingAvailability}
//                     required
//                   >
//                     <option value="">
//                       {checkingAvailability ? "Checking..." : "Select Time..."}
//                     </option>
//                     {availableSlots.map((slot) => (
//                       <option
//                         key={slot.value}
//                         value={slot.value}
//                         disabled={slot.status === "full"}
//                       >
//                         {slot.label} {slot.status === "full" ? "(FULL)" : ""}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="mt-3">
//                 <label className="form-label small fw-bold text-muted text-uppercase">
//                   Notes
//                 </label>
//                 <textarea
//                   className="form-control border-2 shadow-none"
//                   rows="3"
//                   placeholder="Reason for visit..."
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                 ></textarea>
//               </div>
//             </div>

//             <div className="modal-footer border-0 pt-0 px-4 pb-4">
//               <button
//                 type="button"
//                 className="btn btn-light rounded-pill px-4 fw-bold"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
//                 disabled={loading || !selectedSlot}
//               >
//                 {loading ? (
//                   <Loader2 className="animate-spin" size={18} />
//                 ) : (
//                   "Confirm Booking"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookAppointmentModal;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   X,
//   Calendar,
//   Clock,
//   AlertCircle,
//   CheckCircle,
//   Loader2,
// } from "lucide-react";

// const BookAppointmentModal = ({ show, onClose, onSuccess }) => {
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState("");
//   const [selectedDate, setSelectedDate] = useState(""); // Stores actual selected calendar date
//   const [selectedSlot, setSelectedSlot] = useState("");
//   const [availableDays, setAvailableDays] = useState([]);
//   const [availableSlots, setAvailableSlots] = useState([]); // Holds status objects
//   const [notes, setNotes] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [checkingAvailability, setCheckingAvailability] = useState(false);
//   const [error, setError] = useState("");

//   // 1. Fetch doctors on modal show
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await api.get("/doctors");
//         const data = res.data?.doctors || res.data || [];
//         setDoctors(data);
//       } catch (err) {
//         console.error("Error fetching medical directory:", err);
//       }
//     };
//     if (show) fetchDoctors();
//   }, [show]);

//   // 2. Extract unique working days when doctor changes
//   useEffect(() => {
//     setError("");
//     if (selectedDoctor) {
//       const doc = doctors.find((d) => d._id === selectedDoctor);
//       if (doc && doc.slots) {
//         const uniqueDays = [
//           ...new Set(doc.slots.map((s) => s.day.toUpperCase())),
//         ];
//         setAvailableDays(uniqueDays);
//         setSelectedDate("");
//         setAvailableSlots([]);
//         setSelectedSlot("");
//       }
//     } else {
//       setAvailableDays([]);
//     }
//   }, [selectedDoctor, doctors]);

//   // 3. Check Live Availability & Load Slots when Date is chosen
//   useEffect(() => {
//     const checkSlots = async () => {
//       if (!selectedDoctor || !selectedDate) {
//         setAvailableSlots([]);
//         return;
//       }

//       const dateObj = new Date(selectedDate);
//       const dayName = dateObj
//         .toLocaleDateString("en-US", { weekday: "long" })
//         .toUpperCase();

//       // Check if doctor works on this specific day
//       if (!availableDays.includes(dayName)) {
//         setError(`This doctor does not have a schedule on ${dayName}.`);
//         setAvailableSlots([]);
//         return;
//       }

//       const doc = doctors.find((d) => d._id === selectedDoctor);
//       if (!doc) return;

//       setError("");
//       setCheckingAvailability(true);

//       try {
//         const res = await api.get(`/appointments/availability`, {
//           params: { doctorId: selectedDoctor, date: selectedDate },
//         });

//         const daySlots = doc.slots.filter(
//           (s) => s.day.toUpperCase() === dayName
//         );

//         const mergedSlots = daySlots.map((slot) => {
//           const slotString = `${slot.startTime} - ${slot.endTime}`;
//           const statusObj = res.data.find((d) => d.time === slotString);
//           return {
//             value: slotString,
//             label: `${slot.startTime} - ${slot.endTime}`,
//             status: statusObj ? statusObj.status : "available",
//           };
//         });

//         setAvailableSlots(mergedSlots);
//         setSelectedSlot("");
//       } catch (err) {
//         console.error("Availability check failed", err);
//         setError("Could not verify slot availability. Please try again.");
//       } finally {
//         setCheckingAvailability(false);
//       }
//     };

//     checkSlots();
//   }, [selectedDate, selectedDoctor, doctors, availableDays]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedDoctor || !selectedDate || !selectedSlot) {
//       setError("Please complete all required fields.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const dayName = new Date(selectedDate)
//         .toLocaleDateString("en-US", { weekday: "long" })
//         .toUpperCase();

//       await api.post("/appointments", {
//         doctor: selectedDoctor,
//         day: dayName,
//         date: selectedDate,
//         timeSlot: selectedSlot,
//         notes,
//       });

//       onSuccess();
//       onClose();
//       // Reset form
//       setSelectedDoctor("");
//       setSelectedDate("");
//       setSelectedSlot("");
//       setNotes("");
//     } catch (err) {
//       setError(err.response?.data?.message || "Booking failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <div
//       className="modal show d-block animate-fade-in"
//       style={{ background: "rgba(0,0,0,0.5)" }}
//     >
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//           <div className="modal-header border-0 pb-0 px-4 pt-4">
//             <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
//               <Calendar size={22} className="text-primary" /> Schedule
//               Appointment
//             </h5>
//             <button
//               type="button"
//               className="btn-close shadow-none"
//               onClick={onClose}
//             ></button>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="modal-body p-4">
//               {error && (
//                 <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
//                   <AlertCircle size={16} /> {error}
//                 </div>
//               )}

//               {/* Doctor Selection */}
//               <div className="mb-3">
//                 <label className="form-label small fw-bold text-muted text-uppercase">
//                   Medical Specialist
//                 </label>
//                 <select
//                   className="form-select border-2 py-2 shadow-none"
//                   value={selectedDoctor}
//                   onChange={(e) => setSelectedDoctor(e.target.value)}
//                   required
//                 >
//                   <option value="">Choose Doctor...</option>
//                   {doctors.map((doc) => (
//                     <option key={doc._id} value={doc._id}>
//                       {doc.name} — {doc.speciality}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="row g-3">
//                 {/* Manual Date Selection */}
//                 <div className="col-md-6">
//                   <label className="form-label small fw-bold text-muted text-uppercase">
//                     Choose Date
//                   </label>
//                   <input
//                     type="date"
//                     className="form-control border-2 py-2 shadow-none"
//                     value={selectedDate}
//                     min={new Date().toISOString().split("T")[0]}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     disabled={!selectedDoctor}
//                     required
//                   />
//                   {availableDays.length > 0 && (
//                     <div className="form-text small text-muted mt-1">
//                       Works on: {availableDays.join(", ")}
//                     </div>
//                   )}
//                 </div>

//                 {/* Time Slot Selection */}
//                 <div className="col-md-6">
//                   <label className="form-label small fw-bold text-muted text-uppercase">
//                     Time Slot
//                   </label>
//                   <select
//                     className="form-select border-2 py-2 shadow-none"
//                     value={selectedSlot}
//                     onChange={(e) => setSelectedSlot(e.target.value)}
//                     disabled={
//                       !selectedDate ||
//                       checkingAvailability ||
//                       availableSlots.length === 0
//                     }
//                     required
//                   >
//                     <option value="">
//                       {checkingAvailability
//                         ? "Checking..."
//                         : availableSlots.length === 0 && selectedDate
//                         ? "No slots available"
//                         : "Select Time..."}
//                     </option>
//                     {availableSlots.map((slot) => (
//                       <option
//                         key={slot.value}
//                         value={slot.value}
//                         disabled={slot.status === "full"}
//                       >
//                         {slot.label} {slot.status === "full" ? "(FULL)" : ""}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="mt-3">
//                 <label className="form-label small fw-bold text-muted text-uppercase">
//                   Notes
//                 </label>
//                 <textarea
//                   className="form-control border-2 shadow-none"
//                   rows="3"
//                   placeholder="Reason for visit..."
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                 ></textarea>
//               </div>
//             </div>

//             <div className="modal-footer border-0 pt-0 px-4 pb-4">
//               <button
//                 type="button"
//                 className="btn btn-light rounded-pill px-4 fw-bold"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
//                 disabled={loading || !selectedSlot}
//               >
//                 {loading ? (
//                   <Loader2 className="animate-spin" size={18} />
//                 ) : (
//                   "Confirm Booking"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookAppointmentModal;

import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  X,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const BookAppointmentModal = ({ show, onClose, onSuccess }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // Stores actual selected calendar date
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]); // Holds status objects
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [error, setError] = useState("");

  // 1. Fetch doctors on modal show
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors");
        const data = res.data?.doctors || res.data || [];
        setDoctors(data);
      } catch (err) {
        console.error("Error fetching medical directory:", err);
      }
    };
    if (show) fetchDoctors();
  }, [show]);

  // 2. Extract unique working days when doctor changes
  useEffect(() => {
    setError("");
    if (selectedDoctor) {
      const doc = doctors.find((d) => d._id === selectedDoctor);
      if (doc && doc.slots) {
        const uniqueDays = [
          ...new Set(doc.slots.map((s) => s.day.toUpperCase())),
        ];
        setAvailableDays(uniqueDays);
        setSelectedDate("");
        setAvailableSlots([]);
        setSelectedSlot("");
      }
    } else {
      setAvailableDays([]);
    }
  }, [selectedDoctor, doctors]);

  // ✅ HELPER: Format minutes back to HH:MM
  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const m = (minutes % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  // ✅ HELPER: Generate 15-minute intervals from a range
  const generate15MinSlots = (startStr, endStr) => {
    const slots = [];
    let [startH, startM] = startStr.split(":").map(Number);
    let [endH, endM] = endStr.split(":").map(Number);

    // Convert to minutes from midnight
    let currentMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;

    // Loop until we can't fit another 15 min slot
    while (currentMins + 15 <= endMins) {
      const start = formatTime(currentMins);
      const end = formatTime(currentMins + 15);
      slots.push(`${start} - ${end}`);
      currentMins += 15;
    }
    return slots;
  };

  // 3. Check Live Availability & Load Slots (Modified for 15-min chunks)
  useEffect(() => {
    const checkSlots = async () => {
      if (!selectedDoctor || !selectedDate) {
        setAvailableSlots([]);
        return;
      }

      const dateObj = new Date(selectedDate);
      const dayName = dateObj
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();

      // Check if doctor works on this specific day
      if (!availableDays.includes(dayName)) {
        setError(`This doctor does not have a schedule on ${dayName}.`);
        setAvailableSlots([]);
        return;
      }

      const doc = doctors.find((d) => d._id === selectedDoctor);
      if (!doc) return;

      setError("");
      setCheckingAvailability(true);

      try {
        const res = await api.get(`/appointments/availability`, {
          params: { doctorId: selectedDoctor, date: selectedDate },
        });

        // 1. Get doctor's shifts for this day
        const dayShifts = doc.slots.filter(
          (s) => s.day.toUpperCase() === dayName
        );

        // 2. Break shifts into 15-minute chunks
        let allChunks = [];
        dayShifts.forEach((shift) => {
          const chunks = generate15MinSlots(shift.startTime, shift.endTime);
          allChunks = [...allChunks, ...chunks];
        });

        // 3. Map chunks to status from backend
        const detailedSlots = allChunks.map((slotString) => {
          const statusObj = res.data.find((d) => d.time === slotString);
          return {
            value: slotString,
            label: slotString,
            status: statusObj ? statusObj.status : "available",
          };
        });

        setAvailableSlots(detailedSlots);
        setSelectedSlot("");
      } catch (err) {
        console.error("Availability check failed", err);
        setError("Could not verify slot availability. Please try again.");
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkSlots();
  }, [selectedDate, selectedDoctor, doctors, availableDays]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const dayName = new Date(selectedDate)
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();

      await api.post("/appointments", {
        doctor: selectedDoctor,
        day: dayName,
        date: selectedDate,
        timeSlot: selectedSlot,
        notes,
      });

      onSuccess();
      onClose();
      // Reset form
      setSelectedDoctor("");
      setSelectedDate("");
      setSelectedSlot("");
      setNotes("");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block animate-fade-in"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header border-0 pb-0 px-4 pt-4">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <Calendar size={22} className="text-primary" /> Schedule
              Appointment
            </h5>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {/* Doctor Selection */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">
                  Medical Specialist
                </label>
                <select
                  className="form-select border-2 py-2 shadow-none"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  required
                >
                  <option value="">Choose Doctor...</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name} — {doc.speciality}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row g-3">
                {/* Manual Date Selection */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">
                    Choose Date
                  </label>
                  <input
                    type="date"
                    className="form-control border-2 py-2 shadow-none"
                    value={selectedDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    disabled={!selectedDoctor}
                    required
                  />
                  {availableDays.length > 0 && (
                    <div className="form-text small text-muted mt-1">
                      Works on: {availableDays.join(", ")}
                    </div>
                  )}
                </div>

                {/* Time Slot Selection */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">
                    15-Min Slot
                  </label>
                  <select
                    className="form-select border-2 py-2 shadow-none"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    disabled={
                      !selectedDate ||
                      checkingAvailability ||
                      availableSlots.length === 0
                    }
                    required
                  >
                    <option value="">
                      {checkingAvailability
                        ? "Checking..."
                        : availableSlots.length === 0 && selectedDate
                        ? "No slots available"
                        : "Select Time..."}
                    </option>
                    {availableSlots.map((slot) => (
                      <option
                        key={slot.value}
                        value={slot.value}
                        disabled={slot.status === "full"}
                      >
                        {slot.label} {slot.status === "full" ? "(FULL)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="form-label small fw-bold text-muted text-uppercase">
                  Notes
                </label>
                <textarea
                  className="form-control border-2 shadow-none"
                  rows="3"
                  placeholder="Reason for visit..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer border-0 pt-0 px-4 pb-4">
              <button
                type="button"
                className="btn btn-light rounded-pill px-4 fw-bold"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
                disabled={loading || !selectedSlot}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
