// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   FileSignature,
//   Plus,
//   User,
//   CalendarCheck,
//   Loader2,
//   Send,
//   X,
//   Trash2,
// } from "lucide-react";

// const DoctorPrescriptions = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedAppt, setSelectedAppt] = useState(null);

//   // Prescription Form State
//   const [items, setItems] = useState([
//     { medicine: "", dosageInstructions: "", durationDays: "", quantity: "" },
//   ]);
//   const [notes, setNotes] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const fetchEligibleAppointments = async () => {
//     try {
//       setLoading(true);
//       // We call the appointments endpoint to find who needs a prescription
//       const res = await api.get("/doctor/appointments");
//       const eligible = (res.data.appointments || []).filter((a) =>
//         ["Confirmed", "Completed", "Pending"].includes(a.status),
//       );
//       setAppointments(eligible);
//     } catch (err) {
//       console.error("Error fetching appointments for prescriptions", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEligibleAppointments();
//   }, []);

//   const handleAddItem = () =>
//     setItems([
//       ...items,
//       { medicine: "", dosageInstructions: "", durationDays: "", quantity: "" },
//     ]);
//   const handleRemoveItem = (index) =>
//     setItems(items.filter((_, i) => i !== index));
//   const updateItem = (index, field, value) => {
//     const newItems = [...items];
//     newItems[index][field] = value;
//     setItems(newItems);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       await api.post("/prescriptions/doctor-create", {
//         appointmentId: selectedAppt._id,
//         patientId: selectedAppt.patient?._id || selectedAppt.user?._id,
//         patientName: selectedAppt.patient?.name || selectedAppt.user?.name,
//         items,
//         notes,
//       });
//       alert("Prescription issued successfully!");
//       setShowModal(false);
//       fetchEligibleAppointments(); // Refresh
//     } catch (err) {
//       alert(
//         "Error: " +
//           (err.response?.data?.message || "Failed to issue prescription"),
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="d-flex justify-content-center py-5">
//         <Loader2 className="spin-animation text-primary" size={40} />
//       </div>
//     );

//   return (
//     <div className="container-fluid py-4 px-4 bg-light min-vh-100 animate-fade-in">
//       <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-success">
//         <div>
//           <h3 className="fw-black mb-1 text-dark d-flex align-items-center gap-2">
//             <FileSignature className="text-success" size={28} /> Prescriptions
//           </h3>
//           <p className="text-muted mb-0 small">
//             Issue digital prescriptions for your scheduled visits.
//           </p>
//         </div>
//       </div>

//       <div className="row g-4">
//         {appointments.length === 0 ? (
//           <div className="col-12 text-center py-5 text-muted bg-white rounded-4 shadow-sm">
//             <FileSignature size={48} className="mb-3 opacity-50" />
//             <h5>No Active Appointments</h5>
//           </div>
//         ) : (
//           appointments.map((app) => (
//             <div key={app._id} className="col-md-6 col-lg-4">
//               <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 hover-lift">
//                 <h6 className="fw-bold mb-1 text-dark">
//                   {app.patient?.name || "Patient"}
//                 </h6>
//                 <p className="small text-muted mb-3 d-flex align-items-center gap-2">
//                   <CalendarCheck size={14} />{" "}
//                   {new Date(app.date).toLocaleDateString()}
//                 </p>
//                 <button
//                   className="btn btn-success w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
//                   onClick={() => {
//                     setSelectedAppt(app);
//                     setShowModal(true);
//                   }}
//                 >
//                   <Plus size={16} /> Write Prescription
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* --- WRITE PRESCRIPTION MODAL --- */}
//       {showModal && (
//         <div
//           className="modal d-block bg-dark bg-opacity-50"
//           style={{ zIndex: 1050 }}
//         >
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content rounded-4 border-0 shadow-lg">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header border-0 p-4">
//                   <h5 className="fw-black mb-0">
//                     New Prescription for {selectedAppt?.patient?.name}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>
//                 <div className="modal-body p-4 pt-0">
//                   <label className="form-label small fw-bold text-uppercase text-muted">
//                     Medicines & Dosage
//                   </label>
//                   {items.map((item, index) => (
//                     <div
//                       key={index}
//                       className="row g-2 mb-3 align-items-end p-3 bg-light rounded-3 border border-light-subtle"
//                     >
//                       <div className="col-md-4">
//                         <label className="small mb-1">Medicine Name</label>
//                         <input
//                           className="form-control form-control-sm"
//                           placeholder="e.g. Paracetamol"
//                           required
//                           value={item.medicine}
//                           onChange={(e) =>
//                             updateItem(index, "medicine", e.target.value)
//                           }
//                         />
//                       </div>
//                       <div className="col-md-3">
//                         <label className="small mb-1">Dosage (1-0-1)</label>
//                         <input
//                           className="form-control form-control-sm"
//                           placeholder="e.g. 1-0-1 after food"
//                           required
//                           value={item.dosageInstructions}
//                           onChange={(e) =>
//                             updateItem(
//                               index,
//                               "dosageInstructions",
//                               e.target.value,
//                             )
//                           }
//                         />
//                       </div>
//                       <div className="col-md-2">
//                         <label className="small mb-1">Days</label>
//                         <input
//                           type="number"
//                           className="form-control form-control-sm"
//                           placeholder="5"
//                           required
//                           value={item.durationDays}
//                           onChange={(e) =>
//                             updateItem(index, "durationDays", e.target.value)
//                           }
//                         />
//                       </div>
//                       <div className="col-md-2">
//                         <label className="small mb-1">Qty</label>
//                         <input
//                           type="number"
//                           className="form-control form-control-sm"
//                           placeholder="10"
//                           required
//                           value={item.quantity}
//                           onChange={(e) =>
//                             updateItem(index, "quantity", e.target.value)
//                           }
//                         />
//                       </div>
//                       <div className="col-md-1 text-end">
//                         <button
//                           type="button"
//                           className="btn btn-sm btn-outline-danger border-0"
//                           onClick={() => handleRemoveItem(index)}
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                   <button
//                     type="button"
//                     className="btn btn-sm btn-outline-primary fw-bold rounded-pill mb-4"
//                     onClick={handleAddItem}
//                   >
//                     <Plus size={14} /> Add Medicine
//                   </button>

//                   <div className="mb-3">
//                     <label className="form-label small fw-bold text-muted">
//                       Additional Notes
//                     </label>
//                     <textarea
//                       className="form-control bg-light"
//                       rows="2"
//                       placeholder="Drink plenty of water..."
//                       value={notes}
//                       onChange={(e) => setNotes(e.target.value)}
//                     ></textarea>
//                   </div>
//                 </div>
//                 <div className="modal-footer border-0 p-4 pt-0">
//                   <button
//                     type="button"
//                     className="btn btn-light rounded-pill px-4 fw-bold"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
//                     disabled={submitting}
//                   >
//                     {submitting ? (
//                       <Loader2 className="spin-animation" size={16} />
//                     ) : (
//                       <Send size={16} />
//                     )}{" "}
//                     Issue Prescription
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//       <style>{`.hover-lift:hover { transform: translateY(-4px); transition: 0.2s; } .spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// };

// export default DoctorPrescriptions;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   FileSignature,
//   Plus,
//   User,
//   CalendarCheck,
//   Loader2,
//   Send,
//   X,
//   Trash2,
// } from "lucide-react";

// const DoctorPrescriptions = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedAppt, setSelectedAppt] = useState(null);

//   // Prescription Form State
//   const [items, setItems] = useState([
//     { medicine: "", dosageInstructions: "", durationDays: "", quantity: "" },
//   ]);
//   const [notes, setNotes] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const fetchEligibleAppointments = async () => {
//     try {
//       setLoading(true);
//       // We call the appointments endpoint to find who needs a prescription
//       const res = await api.get("/doctor/appointments");

//       // ✅ FIXED: Using toLowerCase() to prevent case-sensitivity bugs
//       const eligible = (res.data.appointments || []).filter((a) =>
//         ["confirmed", "completed", "pending"].includes(a.status?.toLowerCase()),
//       );
//       setAppointments(eligible);
//     } catch (err) {
//       console.error("Error fetching appointments for prescriptions", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEligibleAppointments();
//   }, []);

//   const handleAddItem = () =>
//     setItems([
//       ...items,
//       { medicine: "", dosageInstructions: "", durationDays: "", quantity: "" },
//     ]);

//   const handleRemoveItem = (index) =>
//     setItems(items.filter((_, i) => i !== index));

//   const updateItem = (index, field, value) => {
//     const newItems = [...items];
//     newItems[index][field] = value;
//     setItems(newItems);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Quick validation: Ensure at least one medicine is added and filled
//     if (items.length === 0 || !items[0].medicine) {
//       return alert("Please add at least one medicine to the prescription.");
//     }

//     setSubmitting(true);
//     try {
//       // ✅ FIXED: Updated endpoint to match the new doctorRoutes.js
//       await api.post("/doctor/prescriptions/create", {
//         appointmentId: selectedAppt._id,
//         patientId: selectedAppt.patient?._id || selectedAppt.user?._id,
//         patientName: selectedAppt.patient?.name || selectedAppt.user?.name,
//         patientEmail: selectedAppt.patient?.email || selectedAppt.user?.email,
//         items,
//         notes,
//       });

//       alert("Prescription issued successfully!");
//       setShowModal(false);

//       // Reset form fields
//       setItems([
//         {
//           medicine: "",
//           dosageInstructions: "",
//           durationDays: "",
//           quantity: "",
//         },
//       ]);
//       setNotes("");

//       fetchEligibleAppointments(); // Refresh the list
//     } catch (err) {
//       alert(
//         "Error: " +
//           (err.response?.data?.message || "Failed to issue prescription"),
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="d-flex justify-content-center py-5">
//         <Loader2 className="spin-animation text-primary" size={40} />
//       </div>
//     );

//   return (
//     <div className="container-fluid py-4 px-4 bg-light min-vh-100 animate-fade-in">
//       <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-success">
//         <div>
//           <h3 className="fw-black mb-1 text-dark d-flex align-items-center gap-2">
//             <FileSignature className="text-success" size={28} /> Prescriptions
//           </h3>
//           <p className="text-muted mb-0 small">
//             Issue digital prescriptions for your scheduled visits.
//           </p>
//         </div>
//       </div>

//       <div className="row g-4">
//         {appointments.length === 0 ? (
//           <div className="col-12 text-center py-5 text-muted bg-white rounded-4 shadow-sm">
//             <FileSignature size={48} className="mb-3 opacity-50" />
//             <h5>No Active Appointments</h5>
//           </div>
//         ) : (
//           appointments.map((app) => (
//             <div key={app._id} className="col-md-6 col-lg-4">
//               <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 hover-lift">
//                 <h6 className="fw-bold mb-1 text-dark">
//                   {app.patient?.name || "Patient"}
//                 </h6>
//                 <p className="small text-muted mb-3 d-flex align-items-center gap-2">
//                   <CalendarCheck size={14} />{" "}
//                   {new Date(app.date).toLocaleDateString()}
//                 </p>
//                 <button
//                   className="btn btn-success w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
//                   onClick={() => {
//                     setSelectedAppt(app);
//                     setShowModal(true);
//                   }}
//                 >
//                   <Plus size={16} /> Write Prescription
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* --- WRITE PRESCRIPTION MODAL --- */}
//       {showModal && (
//         <div
//           className="modal d-block bg-dark bg-opacity-50"
//           style={{ zIndex: 1050 }}
//         >
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content rounded-4 border-0 shadow-lg">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header border-0 p-4">
//                   <h5 className="fw-black mb-0">
//                     New Prescription for {selectedAppt?.patient?.name}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>
//                 <div className="modal-body p-4 pt-0">
//                   <label className="form-label small fw-bold text-uppercase text-muted">
//                     Medicines & Dosage
//                   </label>
//                   {items.map((item, index) => (
//                     <div
//                       key={index}
//                       className="row g-2 mb-3 align-items-end p-3 bg-light rounded-3 border border-light-subtle"
//                     >
//                       <div className="col-md-4">
//                         <label className="small mb-1">Medicine Name</label>
//                         <input
//                           className="form-control form-control-sm"
//                           placeholder="e.g. Paracetamol"
//                           required
//                           value={item.medicine}
//                           onChange={(e) =>
//                             updateItem(index, "medicine", e.target.value)
//                           }
//                         />
//                       </div>
//                       <div className="col-md-3">
//                         <label className="small mb-1">Dosage (1-0-1)</label>
//                         <input
//                           className="form-control form-control-sm"
//                           placeholder="e.g. 1-0-1 after food"
//                           required
//                           value={item.dosageInstructions}
//                           onChange={(e) =>
//                             updateItem(
//                               index,
//                               "dosageInstructions",
//                               e.target.value,
//                             )
//                           }
//                         />
//                       </div>
//                       <div className="col-md-2">
//                         <label className="small mb-1">Days</label>
//                         <input
//                           type="number"
//                           className="form-control form-control-sm"
//                           placeholder="5"
//                           required
//                           value={item.durationDays}
//                           onChange={(e) =>
//                             updateItem(index, "durationDays", e.target.value)
//                           }
//                         />
//                       </div>
//                       <div className="col-md-2">
//                         <label className="small mb-1">Qty</label>
//                         <input
//                           type="number"
//                           className="form-control form-control-sm"
//                           placeholder="10"
//                           required
//                           value={item.quantity}
//                           onChange={(e) =>
//                             updateItem(index, "quantity", e.target.value)
//                           }
//                         />
//                       </div>
//                       <div className="col-md-1 text-end">
//                         {items.length > 1 && (
//                           <button
//                             type="button"
//                             className="btn btn-sm btn-outline-danger border-0"
//                             onClick={() => handleRemoveItem(index)}
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                   <button
//                     type="button"
//                     className="btn btn-sm btn-outline-primary fw-bold rounded-pill mb-4"
//                     onClick={handleAddItem}
//                   >
//                     <Plus size={14} /> Add Medicine
//                   </button>

//                   <div className="mb-3">
//                     <label className="form-label small fw-bold text-muted">
//                       Additional Notes
//                     </label>
//                     <textarea
//                       className="form-control bg-light"
//                       rows="2"
//                       placeholder="Drink plenty of water..."
//                       value={notes}
//                       onChange={(e) => setNotes(e.target.value)}
//                     ></textarea>
//                   </div>
//                 </div>
//                 <div className="modal-footer border-0 p-4 pt-0">
//                   <button
//                     type="button"
//                     className="btn btn-light rounded-pill px-4 fw-bold"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
//                     disabled={submitting}
//                   >
//                     {submitting ? (
//                       <Loader2 className="spin-animation" size={16} />
//                     ) : (
//                       <Send size={16} />
//                     )}{" "}
//                     Issue Prescription
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//       <style>{`.hover-lift:hover { transform: translateY(-4px); transition: 0.2s; } .spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// };

// export default DoctorPrescriptions;

import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  FileSignature,
  Plus,
  CalendarCheck,
  Loader2,
  Send,
  Trash2,
  History,
  Pill,
  Image as ImageIcon,
} from "lucide-react";

const DoctorPrescriptions = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);

  // --- History State ---
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [patientHistory, setPatientHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // --- Prescription Form State ---
  const [items, setItems] = useState([
    { medicine: "", dosageInstructions: "", durationDays: "", quantity: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchEligibleAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/doctor/appointments");
      const eligible = (res.data.appointments || []).filter((a) =>
        ["confirmed", "completed", "pending"].includes(a.status?.toLowerCase()),
      );
      setAppointments(eligible);
    } catch (err) {
      console.error("Error fetching appointments for prescriptions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligibleAppointments();
  }, []);

  // --- History Logic ---
  const handleViewHistory = async (patient) => {
    setSelectedAppt({ patient }); // Store temporarily just for the modal header
    setShowHistoryModal(true);
    setHistoryLoading(true);
    try {
      // Call the new backend route we just made
      const res = await api.get(`/prescriptions/patient/${patient._id}`);
      setPatientHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // --- Prescription Logic ---
  const handleAddItem = () =>
    setItems([
      ...items,
      { medicine: "", dosageInstructions: "", durationDays: "", quantity: "" },
    ]);
  const handleRemoveItem = (index) =>
    setItems(items.filter((_, i) => i !== index));
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0 || !items[0].medicine) {
      return alert("Please add at least one medicine to the prescription.");
    }
    setSubmitting(true);
    try {
      await api.post("/doctor/prescriptions/create", {
        appointmentId: selectedAppt._id,
        patientId: selectedAppt.patient?._id || selectedAppt.user?._id,
        patientName: selectedAppt.patient?.name || selectedAppt.user?.name,
        patientEmail: selectedAppt.patient?.email || selectedAppt.user?.email,
        items,
        notes,
      });
      alert("Prescription issued successfully!");
      setShowModal(false);
      setItems([
        {
          medicine: "",
          dosageInstructions: "",
          durationDays: "",
          quantity: "",
        },
      ]);
      setNotes("");
      fetchEligibleAppointments();
    } catch (err) {
      alert(
        "Error: " +
          (err.response?.data?.message || "Failed to issue prescription"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center py-5">
        <Loader2 className="spin-animation text-primary" size={40} />
      </div>
    );

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-success">
        <div>
          <h3 className="fw-black mb-1 text-dark d-flex align-items-center gap-2">
            <FileSignature className="text-success" size={28} /> Prescriptions &
            Records
          </h3>
          <p className="text-muted mb-0 small">
            Review patient history and issue new digital prescriptions.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {appointments.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted bg-white rounded-4 shadow-sm">
            <FileSignature size={48} className="mb-3 opacity-50" />
            <h5>No Active Appointments</h5>
          </div>
        ) : (
          appointments.map((app) => (
            <div key={app._id} className="col-md-6 col-xl-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 hover-lift">
                <h6 className="fw-bold mb-1 text-dark">
                  {app.patient?.name || "Patient"}
                </h6>
                <p className="small text-muted mb-3 d-flex align-items-center gap-2">
                  <CalendarCheck size={14} />{" "}
                  {new Date(app.date).toLocaleDateString()}
                </p>

                {/* ✅ NEW BUTTON LAYOUT: History + Prescribe */}
                <div className="d-flex gap-2 mt-auto pt-2">
                  <button
                    className="btn btn-outline-primary w-50 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-1 shadow-sm"
                    onClick={() => handleViewHistory(app.patient)}
                  >
                    <History size={16} /> History
                  </button>
                  <button
                    className="btn btn-success w-50 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-1 shadow-sm"
                    onClick={() => {
                      setSelectedAppt(app);
                      setShowModal(true);
                    }}
                  >
                    <Plus size={16} /> Prescribe
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- WRITE PRESCRIPTION MODAL --- */}
      {showModal && (
        <div
          className="modal d-block bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-0 p-4">
                  <h5 className="fw-black mb-0">
                    New Prescription for {selectedAppt?.patient?.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body p-4 pt-0">
                  <label className="form-label small fw-bold text-uppercase text-muted">
                    Medicines & Dosage
                  </label>
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="row g-2 mb-3 align-items-end p-3 bg-light rounded-3 border border-light-subtle"
                    >
                      <div className="col-md-4">
                        <label className="small mb-1">Medicine Name</label>
                        <input
                          className="form-control form-control-sm"
                          placeholder="e.g. Paracetamol"
                          required
                          value={item.medicine}
                          onChange={(e) =>
                            updateItem(index, "medicine", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="small mb-1">Dosage</label>
                        <input
                          className="form-control form-control-sm"
                          placeholder="e.g. 1-0-1"
                          required
                          value={item.dosageInstructions}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "dosageInstructions",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="small mb-1">Days</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="5"
                          required
                          value={item.durationDays}
                          onChange={(e) =>
                            updateItem(index, "durationDays", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="small mb-1">Qty</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="10"
                          required
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(index, "quantity", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-1 text-end">
                        {items.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger border-0"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary fw-bold rounded-pill mb-4"
                    onClick={handleAddItem}
                  >
                    <Plus size={14} /> Add Medicine
                  </button>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">
                      Additional Notes
                    </label>
                    <textarea
                      className="form-control bg-light"
                      rows="2"
                      placeholder="Drink plenty of water..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4 fw-bold"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="spin-animation" size={16} />
                    ) : (
                      <Send size={16} />
                    )}{" "}
                    Issue Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 PATIENT MEDICAL HISTORY MODAL */}
      {showHistoryModal && (
        <div
          className="modal d-block bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-light border-bottom border-light-subtle p-4">
                <h5 className="modal-title fw-black text-dark d-flex align-items-center gap-2">
                  <History className="text-primary" size={20} /> Medical
                  History: {selectedAppt?.patient?.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowHistoryModal(false)}
                ></button>
              </div>

              <div
                className="modal-body p-4 bg-white"
                style={{ minHeight: "400px" }}
              >
                {historyLoading ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <Loader2
                      className="spin-animation text-primary"
                      size={40}
                    />
                  </div>
                ) : patientHistory.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <FileSignature size={48} className="mb-3 opacity-25" />
                    <h6>No History Found</h6>
                    <p className="small">
                      This patient has no past prescriptions on record.
                    </p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-4">
                    {patientHistory.map((rx) => {
                      const isDigital = rx.items && rx.items.length > 0;
                      return (
                        <div
                          key={rx._id}
                          className="bg-light p-4 rounded-4 border border-light-subtle shadow-sm"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-light-subtle">
                            <div className="fw-bold text-dark d-flex align-items-center gap-2">
                              {isDigital ? (
                                <Pill size={18} className="text-success" />
                              ) : (
                                <ImageIcon size={18} className="text-warning" />
                              )}
                              {isDigital
                                ? `Prescribed by Dr. ${rx.doctor?.name || "Unknown"}`
                                : "Patient Uploaded Scan"}
                            </div>
                            <span className="small text-muted fw-bold">
                              {new Date(rx.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {isDigital ? (
                            <div className="table-responsive">
                              <table className="table table-sm table-bordered border-light-subtle mb-0 bg-white">
                                <thead className="bg-light text-muted small">
                                  <tr>
                                    <th>Medicine</th>
                                    <th>Dosage</th>
                                    <th>Days</th>
                                  </tr>
                                </thead>
                                <tbody className="small fw-medium text-dark">
                                  {rx.items.map((item, idx) => (
                                    <tr key={idx}>
                                      <td>{item.medicine}</td>
                                      <td>{item.dosageInstructions}</td>
                                      <td>{item.durationDays}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-center bg-white p-2 rounded-3 border border-light-subtle">
                              <img
                                src={
                                  rx.imageUrl.startsWith("http")
                                    ? rx.imageUrl
                                    : `http://localhost:5000${rx.imageUrl}`
                                }
                                alt="Prescription Scan"
                                className="img-fluid rounded-2 object-fit-cover"
                                style={{ maxHeight: "250px" }}
                              />
                            </div>
                          )}

                          {rx.notes && (
                            <div className="mt-3 bg-white p-2 rounded-3 small border border-light-subtle text-muted">
                              <strong>Notes:</strong> {rx.notes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hover-lift:hover { transform: translateY(-4px); transition: 0.2s; } 
        .spin-animation { animation: spin 1s linear infinite; } 
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DoctorPrescriptions;
