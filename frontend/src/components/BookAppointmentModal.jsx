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

//   // ✅ HELPER: Format minutes back to HH:MM
//   const formatTime = (minutes) => {
//     const h = Math.floor(minutes / 60)
//       .toString()
//       .padStart(2, "0");
//     const m = (minutes % 60).toString().padStart(2, "0");
//     return `${h}:${m}`;
//   };

//   // ✅ HELPER: Generate 15-minute intervals from a range
//   const generate15MinSlots = (startStr, endStr) => {
//     const slots = [];
//     let [startH, startM] = startStr.split(":").map(Number);
//     let [endH, endM] = endStr.split(":").map(Number);

//     // Convert to minutes from midnight
//     let currentMins = startH * 60 + startM;
//     const endMins = endH * 60 + endM;

//     // Loop until we can't fit another 15 min slot
//     while (currentMins + 15 <= endMins) {
//       const start = formatTime(currentMins);
//       const end = formatTime(currentMins + 15);
//       slots.push(`${start} - ${end}`);
//       currentMins += 15;
//     }
//     return slots;
//   };

//   // 3. Check Live Availability & Load Slots (Modified for 15-min chunks)
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

//         // 1. Get doctor's shifts for this day
//         const dayShifts = doc.slots.filter(
//           (s) => s.day.toUpperCase() === dayName
//         );

//         // 2. Break shifts into 15-minute chunks
//         let allChunks = [];
//         dayShifts.forEach((shift) => {
//           const chunks = generate15MinSlots(shift.startTime, shift.endTime);
//           allChunks = [...allChunks, ...chunks];
//         });

//         // 3. Map chunks to status from backend
//         const detailedSlots = allChunks.map((slotString) => {
//           const statusObj = res.data.find((d) => d.time === slotString);
//           return {
//             value: slotString,
//             label: slotString,
//             status: statusObj ? statusObj.status : "available",
//           };
//         });

//         setAvailableSlots(detailedSlots);
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
//                     15-Min Slot
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

        // Backend should return an array of booked slots, e.g., [{ time: "10:00 - 10:15", status: "booked" }]
        const bookedSlotsFromServer = res.data || [];

        // 1. Get doctor's shifts for this day
        const dayShifts = doc.slots.filter(
          (s) => s.day.toUpperCase() === dayName,
        );

        // 2. Break shifts into 15-minute chunks
        let allChunks = [];
        dayShifts.forEach((shift) => {
          const chunks = generate15MinSlots(shift.startTime, shift.endTime);
          allChunks = [...allChunks, ...chunks];
        });

        // 3. Map chunks to status from backend (Strict Checking)
        const detailedSlots = allChunks.map((slotString) => {
          // Check if this specific time slot exists in the booked slots array from the backend
          const isBooked = bookedSlotsFromServer.find(
            (b) => b.time === slotString || b.timeSlot === slotString, // Handle both key variations just in case
          );

          return {
            value: slotString,
            label: slotString,
            // If the backend returned this slot as booked, mark it "full", else "available"
            status:
              isBooked &&
              (isBooked.status === "booked" ||
                isBooked.status === "full" ||
                isBooked.status === "confirmed" ||
                isBooked.status === "pending")
                ? "full"
                : "available",
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
      // ✅ Provide a clear error if the backend rejects due to double-booking (Step 1 from previous response)
      setError(
        err.response?.data?.message ||
          "Booking failed. This slot might have just been taken.",
      );
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
                        disabled={slot.status === "full"} // ✅ Disables the HTML select option
                      >
                        {slot.label}{" "}
                        {slot.status === "full" ? "(Already Booked)" : ""}
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
