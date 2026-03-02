// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Stethoscope,
//   Plus,
//   Edit,
//   Trash2,
//   Clock,
//   Save,
//   AlertCircle,
//   Mail,
//   X,
// } from "lucide-react";

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Modal & Form State
//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentDoctorId, setCurrentDoctorId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     email: "",
//     phone: "",
//     experience: 0,
//     consultationFee: 500,
//     slots: [],
//   });

//   // Fetch Doctors from DB
//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/admin/doctors");
//       const data = res.data?.doctors || res.data || [];
//       setDoctors(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Failed to load doctor records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   // ✅ FIX: handleEdit correctly maps existing doctor data to form state
//   const handleEdit = (doctor) => {
//     setError("");
//     setIsEditing(true);
//     setCurrentDoctorId(doctor._id);
//     setFormData({
//       name: doctor.name || "",
//       speciality: doctor.speciality || "",
//       nmcNumber: doctor.nmcNumber || "",
//       email: doctor.email || "",
//       phone: doctor.phone || "",
//       experience: doctor.experience || 0,
//       consultationFee: doctor.consultationFee || 500,
//       slots: doctor.slots || [],
//     });
//     setShowModal(true);
//   };

//   const addSlot = () => {
//     setFormData({
//       ...formData,
//       slots: [
//         ...formData.slots,
//         { day: "MONDAY", startTime: "09:00", endTime: "12:00" },
//       ],
//     });
//   };

//   const removeSlot = (index) => {
//     const newSlots = formData.slots.filter((_, i) => i !== index);
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...formData.slots];
//     // Ensure day is uppercase to match Mongoose Schema
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setFormData({ ...formData, slots: newSlots });
//   };

//   // ✅ FIX: handleSubmit ensures correct method (PUT vs POST) is called
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Submit event triggered");

//     try {
//       setSaving(true);
//       setError("");

//       if (isEditing) {
//         // Update existing record
//         await api.put(`/admin/doctors/${currentDoctorId}`, formData);
//         setSuccess("Doctor profile updated successfully!");
//       } else {
//         // Create new record
//         await api.post("/admin/doctors", formData);
//         setSuccess("Doctor registered successfully!");
//       }

//       setShowModal(false);
//       resetForm();
//       fetchDoctors();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       console.error("Save Error:", err.response?.data);
//       setError(err.response?.data?.message || "Failed to save record.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (window.confirm(`Delete ${name}?`)) {
//       try {
//         await api.delete(`/admin/doctors/${id}`);
//         fetchDoctors();
//       } catch (err) {
//         alert("Delete failed.");
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       speciality: "",
//       nmcNumber: "",
//       email: "",
//       phone: "",
//       experience: 0,
//       consultationFee: 500,
//       slots: [],
//     });
//     setIsEditing(false);
//     setCurrentDoctorId(null);
//   };

//   if (loading)
//     return <div className="text-center py-5">Loading Directory...</div>;

//   return (
//     <div className="container-fluid p-0 animate-fade-in">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="fw-bold">
//           <Stethoscope className="text-primary me-2" />
//           Doctors Management
//         </h3>
//         <button
//           className="btn btn-primary rounded-pill px-4"
//           onClick={() => {
//             resetForm();
//             setShowModal(true);
//           }}
//         >
//           <Plus size={18} className="me-2" /> Register Doctor
//         </button>
//       </div>

//       {success && <div className="alert alert-success">{success}</div>}
//       {error && <div className="alert alert-danger">{error}</div>}

//       <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="table-light">
//               <tr className="small text-uppercase fw-bold">
//                 <th className="ps-4">Specialist</th>
//                 <th>Speciality</th>
//                 <th>NMC Number</th>
//                 <th>Availability</th>
//                 <th className="text-end pe-4">Management</th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.map((doc) => (
//                 <tr key={doc._id}>
//                   <td className="ps-4 fw-bold">{doc.name}</td>
//                   <td>
//                     <span className="badge bg-primary-subtle text-primary">
//                       {doc.speciality}
//                     </span>
//                   </td>
//                   <td>{doc.nmcNumber}</td>
//                   <td>
//                     {doc.slots.map((s, i) => (
//                       <div key={i} className="small">
//                         <Clock size={12} className="me-1" /> {s.day}:{" "}
//                         {s.startTime}-{s.endTime}
//                       </div>
//                     ))}
//                   </td>
//                   <td className="text-end pe-4">
//                     {/* ✅ Edit Button - Calls handleEdit */}
//                     <button
//                       className="btn btn-sm btn-outline-primary border-0 me-2"
//                       onClick={() => handleEdit(doc)}
//                     >
//                       <Edit size={16} />
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger border-0"
//                       onClick={() => handleDelete(doc._id, doc.name)}
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ✅ Modal Window */}
//       {showModal && (
//         <div
//           className="modal show d-block"
//           style={{ background: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content border-0 shadow-lg rounded-4">
//               {/* Form strictly wraps the content to ensure Submit works */}
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header border-bottom">
//                   <h5 className="fw-bold m-0">
//                     {isEditing
//                       ? "Update Specialist Info"
//                       : "New Doctor Registration"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <div className="modal-body p-4">
//                   <div className="row g-3">
//                     <div className="col-md-6">
//                       <label className="small fw-bold text-muted">
//                         Full Name *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={formData.name}
//                         onChange={(e) =>
//                           setFormData({ ...formData, name: e.target.value })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="small fw-bold text-muted">
//                         Speciality *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={formData.speciality}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             speciality: e.target.value,
//                           })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="small fw-bold text-muted">
//                         NMC Number *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={formData.nmcNumber}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             nmcNumber: e.target.value,
//                           })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="small fw-bold text-muted">
//                         Contact Email
//                       </label>
//                       <input
//                         type="email"
//                         className="form-control"
//                         value={formData.email}
//                         onChange={(e) =>
//                           setFormData({ ...formData, email: e.target.value })
//                         }
//                       />
//                     </div>

//                     <div className="col-12 mt-4">
//                       <div className="d-flex justify-content-between align-items-center mb-2">
//                         <label className="small fw-bold text-primary">
//                           Working Shifts
//                         </label>
//                         <button
//                           type="button"
//                           className="btn btn-sm btn-outline-primary"
//                           onClick={addSlot}
//                         >
//                           + Add Slot
//                         </button>
//                       </div>
//                       <div className="p-3 bg-light rounded-3 border">
//                         {formData.slots.map((slot, index) => (
//                           <div
//                             key={index}
//                             className="row g-2 mb-2 align-items-end"
//                           >
//                             <div className="col-md-4">
//                               <select
//                                 className="form-select form-select-sm"
//                                 value={slot.day}
//                                 onChange={(e) =>
//                                   updateSlot(index, "day", e.target.value)
//                                 }
//                               >
//                                 <option value="MONDAY">Monday</option>
//                                 <option value="TUESDAY">Tuesday</option>
//                                 <option value="WEDNESDAY">Wednesday</option>
//                                 <option value="THURSDAY">Thursday</option>
//                                 <option value="FRIDAY">Friday</option>
//                                 <option value="SATURDAY">Saturday</option>
//                                 <option value="SUNDAY">Sunday</option>
//                               </select>
//                             </div>
//                             <div className="col-md-3">
//                               <input
//                                 type="text"
//                                 className="form-control form-control-sm"
//                                 placeholder="09:00"
//                                 value={slot.startTime}
//                                 onChange={(e) =>
//                                   updateSlot(index, "startTime", e.target.value)
//                                 }
//                               />
//                             </div>
//                             <div className="col-md-3">
//                               <input
//                                 type="text"
//                                 className="form-control form-control-sm"
//                                 placeholder="17:00"
//                                 value={slot.endTime}
//                                 onChange={(e) =>
//                                   updateSlot(index, "endTime", e.target.value)
//                                 }
//                               />
//                             </div>
//                             <div className="col-md-2">
//                               <button
//                                 type="button"
//                                 className="btn btn-sm text-danger"
//                                 onClick={() => removeSlot(index)}
//                               >
//                                 <Trash2 size={16} />
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="modal-footer border-top">
//                   <button
//                     type="button"
//                     className="btn btn-light rounded-pill"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   {/* ✅ type="submit" is essential for the Update button to work */}
//                   <button
//                     type="submit"
//                     className="btn btn-primary rounded-pill px-4 shadow-sm"
//                     disabled={saving}
//                   >
//                     {saving
//                       ? "Processing..."
//                       : isEditing
//                       ? "Save Changes"
//                       : "Authorize Doctor"}
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

// export default AdminDoctors;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Stethoscope,
//   Plus,
//   Edit,
//   Trash2,
//   Clock,
//   Save,
//   AlertCircle,
//   Mail,
//   Phone, // ✅ Added Phone icon
//   X,
// } from "lucide-react";

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentDoctorId, setCurrentDoctorId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     email: "",
//     phone: "", // ✅ Ensure phone is initialized
//     experience: 0,
//     consultationFee: 500,
//     slots: [],
//   });

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/admin/doctors");
//       const data = res.data?.doctors || res.data || [];
//       setDoctors(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Failed to load doctor records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const handleEdit = (doctor) => {
//     setError("");
//     setIsEditing(true);
//     setCurrentDoctorId(doctor._id);
//     setFormData({
//       name: doctor.name || "",
//       speciality: doctor.speciality || "",
//       nmcNumber: doctor.nmcNumber || "",
//       email: doctor.email || "",
//       phone: doctor.phone || "", // ✅ Load existing phone number
//       experience: doctor.experience || 0,
//       consultationFee: doctor.consultationFee || 500,
//       slots: doctor.slots || [],
//     });
//     setShowModal(true);
//   };

//   const addSlot = () => {
//     setFormData({
//       ...formData,
//       slots: [
//         ...formData.slots,
//         { day: "MONDAY", startTime: "09:00", endTime: "12:00" },
//       ],
//     });
//   };

//   const removeSlot = (index) => {
//     const newSlots = formData.slots.filter((_, i) => i !== index);
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...formData.slots];
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       setError("");

//       if (isEditing) {
//         await api.put(`/admin/doctors/${currentDoctorId}`, formData);
//         setSuccess("Doctor profile updated successfully!");
//       } else {
//         await api.post("/admin/doctors", formData);
//         setSuccess("Doctor registered successfully!");
//       }

//       setShowModal(false);
//       resetForm();
//       fetchDoctors();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save record.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (window.confirm(`Delete ${name}?`)) {
//       try {
//         await api.delete(`/admin/doctors/${id}`);
//         fetchDoctors();
//       } catch (err) {
//         alert("Delete failed.");
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       speciality: "",
//       nmcNumber: "",
//       email: "",
//       phone: "",
//       experience: 0,
//       consultationFee: 500,
//       slots: [],
//     });
//     setIsEditing(false);
//     setCurrentDoctorId(null);
//   };

//   if (loading)
//     return (
//       <div className="text-center py-5 text-muted">Accessing Registry...</div>
//     );

//   return (
//     <div className="container-fluid p-0 animate-fade-in">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="fw-bold">
//           <Stethoscope className="text-primary me-2" />
//           Doctors Management
//         </h3>
//         <button
//           className="btn btn-primary rounded-pill px-4"
//           onClick={() => {
//             resetForm();
//             setShowModal(true);
//           }}
//         >
//           <Plus size={18} className="me-2" /> Register Doctor
//         </button>
//       </div>

//       {success && (
//         <div className="alert alert-success border-0 shadow-sm">{success}</div>
//       )}
//       {error && (
//         <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center gap-2">
//           <AlertCircle size={18} />
//           {error}
//         </div>
//       )}

//       <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="table-light">
//               <tr className="small text-uppercase fw-bold text-muted">
//                 <th className="ps-4">Specialist</th>
//                 <th>Speciality</th>
//                 <th>Contact</th>
//                 <th>Availability</th>
//                 <th className="text-end pe-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.map((doc) => (
//                 <tr key={doc._id}>
//                   <td className="ps-4 fw-bold">{doc.name}</td>
//                   <td>
//                     <span className="badge bg-primary-subtle text-primary">
//                       {doc.speciality}
//                     </span>
//                   </td>
//                   <td>
//                     <div className="small text-dark">
//                       {doc.phone || "No phone"}
//                     </div>
//                     <div className="small text-muted">
//                       {doc.email || "No email"}
//                     </div>
//                   </td>
//                   <td>
//                     {doc.slots.map((s, i) => (
//                       <div key={i} className="small text-muted">
//                         <Clock size={12} className="me-1" /> {s.day}:{" "}
//                         {s.startTime}-{s.endTime}
//                       </div>
//                     ))}
//                   </td>
//                   <td className="text-end pe-4">
//                     <button
//                       className="btn btn-sm btn-outline-primary border-0 me-2"
//                       onClick={() => handleEdit(doc)}
//                     >
//                       <Edit size={16} />
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger border-0"
//                       onClick={() => handleDelete(doc._id, doc.name)}
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showModal && (
//         <div
//           className="modal show d-block"
//           style={{ background: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content border-0 shadow-lg rounded-4">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header border-bottom">
//                   <h5 className="fw-bold m-0">
//                     {isEditing
//                       ? "Update Specialist Info"
//                       : "New Doctor Registration"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <div className="modal-body p-4">
//                   <div className="row g-3">
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Full Name *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2"
//                         value={formData.name}
//                         onChange={(e) =>
//                           setFormData({ ...formData, name: e.target.value })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Speciality *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2"
//                         value={formData.speciality}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             speciality: e.target.value,
//                           })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         NMC Registration No. *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2"
//                         value={formData.nmcNumber}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             nmcNumber: e.target.value,
//                           })
//                         }
//                         required
//                       />
//                     </div>
//                     {/* ✅ FIXED: Added Contact Number field */}
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Contact Number *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2"
//                         value={formData.phone}
//                         onChange={(e) =>
//                           setFormData({ ...formData, phone: e.target.value })
//                         }
//                         required
//                         placeholder="+977-..."
//                       />
//                     </div>
//                     <div className="col-md-12">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         className="form-control border-2"
//                         value={formData.email}
//                         onChange={(e) =>
//                           setFormData({ ...formData, email: e.target.value })
//                         }
//                       />
//                     </div>

//                     <div className="col-12 mt-4">
//                       <div className="d-flex justify-content-between align-items-center mb-2">
//                         <label className="form-label small fw-bold text-primary mb-0 text-uppercase">
//                           Working Shifts
//                         </label>
//                         <button
//                           type="button"
//                           className="btn btn-sm btn-outline-primary rounded-pill px-3"
//                           onClick={addSlot}
//                         >
//                           + Add Slot
//                         </button>
//                       </div>
//                       <div className="p-3 bg-light rounded-3 border">
//                         {formData.slots.length === 0 ? (
//                           <p className="text-center text-muted small m-0">
//                             No shifts scheduled
//                           </p>
//                         ) : (
//                           formData.slots.map((slot, index) => (
//                             <div
//                               key={index}
//                               className="row g-2 mb-2 align-items-end"
//                             >
//                               <div className="col-md-4">
//                                 <select
//                                   className="form-select form-select-sm"
//                                   value={slot.day}
//                                   onChange={(e) =>
//                                     updateSlot(index, "day", e.target.value)
//                                   }
//                                 >
//                                   <option value="MONDAY">Monday</option>
//                                   <option value="TUESDAY">Tuesday</option>
//                                   <option value="WEDNESDAY">Wednesday</option>
//                                   <option value="THURSDAY">Thursday</option>
//                                   <option value="FRIDAY">Friday</option>
//                                   <option value="SATURDAY">Saturday</option>
//                                   <option value="SUNDAY">Sunday</option>
//                                 </select>
//                               </div>
//                               <div className="col-md-3">
//                                 <input
//                                   type="text"
//                                   className="form-control form-control-sm"
//                                   placeholder="09:00"
//                                   value={slot.startTime}
//                                   onChange={(e) =>
//                                     updateSlot(
//                                       index,
//                                       "startTime",
//                                       e.target.value
//                                     )
//                                   }
//                                 />
//                               </div>
//                               <div className="col-md-3">
//                                 <input
//                                   type="text"
//                                   className="form-control form-control-sm"
//                                   placeholder="17:00"
//                                   value={slot.endTime}
//                                   onChange={(e) =>
//                                     updateSlot(index, "endTime", e.target.value)
//                                   }
//                                 />
//                               </div>
//                               <div className="col-md-2">
//                                 <button
//                                   type="button"
//                                   className="btn btn-sm text-danger"
//                                   onClick={() => removeSlot(index)}
//                                 >
//                                   <Trash2 size={16} />
//                                 </button>
//                               </div>
//                             </div>
//                           ))
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="modal-footer border-top p-4 pt-0">
//                   <button
//                     type="button"
//                     className="btn btn-light rounded-pill px-4"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
//                     disabled={saving}
//                   >
//                     {saving ? (
//                       <span className="spinner-border spinner-border-sm me-2" />
//                     ) : (
//                       <Save size={18} className="me-2" />
//                     )}
//                     {isEditing ? "Save Changes" : "Register Professional"}
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

// export default AdminDoctors;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Stethoscope,
//   Plus,
//   Edit,
//   Trash2,
//   Clock,
//   Save,
//   AlertCircle,
//   Mail,
//   Phone,
//   Briefcase, // ✅ Added for Experience
//   DollarSign, // ✅ Added for Fees
//   X,
// } from "lucide-react";

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentDoctorId, setCurrentDoctorId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     email: "",
//     phone: "",
//     experience: 0,
//     consultationFee: 500,
//     slots: [],
//   });

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/admin/doctors");
//       const data = res.data?.doctors || res.data || [];
//       setDoctors(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Failed to load doctor records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const handleEdit = (doctor) => {
//     setError("");
//     setIsEditing(true);
//     setCurrentDoctorId(doctor._id);
//     setFormData({
//       name: doctor.name || "",
//       speciality: doctor.speciality || "",
//       nmcNumber: doctor.nmcNumber || "",
//       email: doctor.email || "",
//       phone: doctor.phone || "",
//       experience: doctor.experience || 0,
//       consultationFee: doctor.consultationFee || 500,
//       slots: doctor.slots || [],
//     });
//     setShowModal(true);
//   };

//   const addSlot = () => {
//     setFormData({
//       ...formData,
//       slots: [
//         ...formData.slots,
//         { day: "MONDAY", startTime: "09:00", endTime: "12:00" },
//       ],
//     });
//   };

//   const removeSlot = (index) => {
//     const newSlots = formData.slots.filter((_, i) => i !== index);
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...formData.slots];
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       setError("");

//       if (isEditing) {
//         await api.put(`/admin/doctors/${currentDoctorId}`, formData);
//         setSuccess("Doctor profile updated successfully!");
//       } else {
//         await api.post("/admin/doctors", formData);
//         setSuccess("Doctor registered successfully!");
//       }

//       setShowModal(false);
//       resetForm();
//       fetchDoctors();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save record.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (window.confirm(`Delete ${name}?`)) {
//       try {
//         await api.delete(`/admin/doctors/${id}`);
//         fetchDoctors();
//       } catch (err) {
//         alert("Delete failed.");
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       speciality: "",
//       nmcNumber: "",
//       email: "",
//       phone: "",
//       experience: 0,
//       consultationFee: 500,
//       slots: [],
//     });
//     setIsEditing(false);
//     setCurrentDoctorId(null);
//   };

//   if (loading)
//     return (
//       <div className="text-center py-5 text-muted">Accessing Registry...</div>
//     );

//   return (
//     <div className="container-fluid p-0 animate-fade-in">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="fw-bold">
//           <Stethoscope className="text-primary me-2" />
//           Doctors Management
//         </h3>
//         <button
//           className="btn btn-primary rounded-pill px-4"
//           onClick={() => {
//             resetForm();
//             setShowModal(true);
//           }}
//         >
//           <Plus size={18} className="me-2" /> Register Doctor
//         </button>
//       </div>

//       {success && (
//         <div className="alert alert-success border-0 shadow-sm">{success}</div>
//       )}
//       {error && (
//         <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center gap-2">
//           <AlertCircle size={18} />
//           {error}
//         </div>
//       )}

//       <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="table-light">
//               <tr className="small text-uppercase fw-bold text-muted">
//                 <th className="ps-4">Specialist</th>
//                 <th>Details</th>
//                 <th>Contact</th>
//                 <th>Availability</th>
//                 <th className="text-end pe-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.map((doc) => (
//                 <tr key={doc._id}>
//                   <td className="ps-4">
//                     <div className="fw-bold text-dark">{doc.name}</div>
//                     <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
//                       {doc.speciality}
//                     </span>
//                   </td>
//                   <td>
//                     <div className="small text-muted d-flex align-items-center gap-1">
//                       <Briefcase size={12} /> {doc.experience} Years Exp.
//                     </div>
//                     <div className="small text-muted d-flex align-items-center gap-1">
//                       <DollarSign size={12} /> Fee: Rs. {doc.consultationFee}
//                     </div>
//                   </td>
//                   <td>
//                     <div className="small text-dark">
//                       <Phone size={12} className="me-1" />
//                       {doc.phone || "No phone"}
//                     </div>
//                     <div className="small text-muted">
//                       <Mail size={12} className="me-1" />
//                       {doc.email || "No email"}
//                     </div>
//                   </td>
//                   <td>
//                     {doc.slots.map((s, i) => (
//                       <div key={i} className="small text-muted">
//                         <Clock size={12} className="me-1" /> {s.day}:{" "}
//                         {s.startTime}-{s.endTime}
//                       </div>
//                     ))}
//                   </td>
//                   <td className="text-end pe-4">
//                     <button
//                       className="btn btn-sm btn-outline-primary border-0 me-2"
//                       onClick={() => handleEdit(doc)}
//                     >
//                       <Edit size={16} />
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger border-0"
//                       onClick={() => handleDelete(doc._id, doc.name)}
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showModal && (
//         <div
//           className="modal show d-block"
//           style={{ background: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content border-0 shadow-lg rounded-4">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header border-bottom">
//                   <h5 className="fw-bold m-0">
//                     {isEditing
//                       ? "Update Specialist Info"
//                       : "New Doctor Registration"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close shadow-none"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <div className="modal-body p-4">
//                   <div className="row g-3">
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Full Name *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2 shadow-none"
//                         value={formData.name}
//                         onChange={(e) =>
//                           setFormData({ ...formData, name: e.target.value })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Speciality *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2 shadow-none"
//                         value={formData.speciality}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             speciality: e.target.value,
//                           })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         NMC Registration No. *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2 shadow-none"
//                         value={formData.nmcNumber}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             nmcNumber: e.target.value,
//                           })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Contact Number *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2 shadow-none"
//                         value={formData.phone}
//                         onChange={(e) =>
//                           setFormData({ ...formData, phone: e.target.value })
//                         }
//                         required
//                         placeholder="+977-..."
//                       />
//                     </div>

//                     {/* ✅ New: Experience and Fees Fields */}
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Years of Experience
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control border-2 shadow-none"
//                         value={formData.experience}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             experience: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Consultation Fee (Rs.)
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control border-2 shadow-none"
//                         value={formData.consultationFee}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             consultationFee: e.target.value,
//                           })
//                         }
//                       />
//                     </div>

//                     <div className="col-md-12">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         className="form-control border-2 shadow-none"
//                         value={formData.email}
//                         onChange={(e) =>
//                           setFormData({ ...formData, email: e.target.value })
//                         }
//                       />
//                     </div>

//                     <div className="col-12 mt-4">
//                       <div className="d-flex justify-content-between align-items-center mb-2">
//                         <label className="form-label small fw-bold text-primary mb-0 text-uppercase">
//                           Working Shifts
//                         </label>
//                         <button
//                           type="button"
//                           className="btn btn-sm btn-outline-primary rounded-pill px-3"
//                           onClick={addSlot}
//                         >
//                           + Add Slot
//                         </button>
//                       </div>
//                       <div className="p-3 bg-light rounded-3 border">
//                         {formData.slots.length === 0 ? (
//                           <p className="text-center text-muted small m-0">
//                             No shifts scheduled
//                           </p>
//                         ) : (
//                           formData.slots.map((slot, index) => (
//                             <div
//                               key={index}
//                               className="row g-2 mb-2 align-items-end"
//                             >
//                               <div className="col-md-4">
//                                 <select
//                                   className="form-select form-select-sm border-2"
//                                   value={slot.day}
//                                   onChange={(e) =>
//                                     updateSlot(index, "day", e.target.value)
//                                   }
//                                 >
//                                   <option value="MONDAY">Monday</option>
//                                   <option value="TUESDAY">Tuesday</option>
//                                   <option value="WEDNESDAY">Wednesday</option>
//                                   <option value="THURSDAY">Thursday</option>
//                                   <option value="FRIDAY">Friday</option>
//                                   <option value="SATURDAY">Saturday</option>
//                                   <option value="SUNDAY">Sunday</option>
//                                 </select>
//                               </div>
//                               <div className="col-md-3">
//                                 <input
//                                   type="text"
//                                   className="form-control form-control-sm border-2"
//                                   placeholder="09:00"
//                                   value={slot.startTime}
//                                   onChange={(e) =>
//                                     updateSlot(
//                                       index,
//                                       "startTime",
//                                       e.target.value
//                                     )
//                                   }
//                                 />
//                               </div>
//                               <div className="col-md-3">
//                                 <input
//                                   type="text"
//                                   className="form-control form-control-sm border-2"
//                                   placeholder="17:00"
//                                   value={slot.endTime}
//                                   onChange={(e) =>
//                                     updateSlot(index, "endTime", e.target.value)
//                                   }
//                                 />
//                               </div>
//                               <div className="col-md-2 text-center">
//                                 <button
//                                   type="button"
//                                   className="btn btn-sm text-danger"
//                                   onClick={() => removeSlot(index)}
//                                 >
//                                   <Trash2 size={16} />
//                                 </button>
//                               </div>
//                             </div>
//                           ))
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="modal-footer border-top p-4 pt-0">
//                   <button
//                     type="button"
//                     className="btn btn-light rounded-pill px-4"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
//                     disabled={saving}
//                   >
//                     {saving ? (
//                       <span className="spinner-border spinner-border-sm me-2" />
//                     ) : (
//                       <Save size={18} className="me-2" />
//                     )}
//                     {isEditing ? "Save Changes" : "Register Professional"}
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

// export default AdminDoctors;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Stethoscope,
//   Plus,
//   Edit,
//   Trash2,
//   Clock,
//   Save,
//   AlertCircle,
//   Mail,
//   Phone,
//   Briefcase,
//   DollarSign,
//   X,
//   CheckCircle2,
//   Loader2,
// } from "lucide-react";

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentDoctorId, setCurrentDoctorId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     email: "",
//     phone: "",
//     experience: 0,
//     consultationFee: 500,
//     slots: [],
//     isAvailable: true, // ✅ Added availability state
//   });

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       // ✅ Use the admin specific route if you have one, or the public one is fine too.
//       // Assuming GET /admin/doctors returns full data including hidden fields.
//       const res = await api.get("/admin/doctors");
//       const data = res.data?.doctors || res.data || [];
//       setDoctors(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Failed to load doctor records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const handleEdit = (doctor) => {
//     setError("");
//     setIsEditing(true);
//     setCurrentDoctorId(doctor._id);
//     setFormData({
//       name: doctor.name || "",
//       speciality: doctor.speciality || "",
//       nmcNumber: doctor.nmcNumber || "",
//       email: doctor.email || "",
//       phone: doctor.phone || "",
//       experience: doctor.experience || 0,
//       consultationFee: doctor.consultationFee || 500,
//       slots: doctor.slots || [],
//       isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
//     });
//     setShowModal(true);
//   };

//   const addSlot = () => {
//     setFormData({
//       ...formData,
//       // ✅ Initialize with safe default times
//       slots: [
//         ...formData.slots,
//         { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
//       ],
//     });
//   };

//   const removeSlot = (index) => {
//     const newSlots = formData.slots.filter((_, i) => i !== index);
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...formData.slots];
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       setError("");

//       if (isEditing) {
//         await api.put(`/admin/doctors/${currentDoctorId}`, formData);
//         setSuccess("Doctor profile updated successfully!");
//       } else {
//         await api.post("/admin/doctors", formData);
//         setSuccess("Doctor registered successfully!");
//       }

//       setShowModal(false);
//       resetForm();
//       fetchDoctors();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save record.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (
//       window.confirm(
//         `Delete ${name}? This will remove them from the booking system.`
//       )
//     ) {
//       try {
//         await api.delete(`/admin/doctors/${id}`);
//         fetchDoctors();
//       } catch (err) {
//         alert(err.response?.data?.message || "Delete failed.");
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       speciality: "",
//       nmcNumber: "",
//       email: "",
//       phone: "",
//       experience: 0,
//       consultationFee: 500,
//       slots: [],
//       isAvailable: true,
//     });
//     setIsEditing(false);
//     setCurrentDoctorId(null);
//   };

//   if (loading && doctors.length === 0)
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <Loader2 className="animate-spin text-primary" size={40} />
//       </div>
//     );

//   return (
//     <div className="container-fluid p-0 animate-fade-in">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="fw-bold d-flex align-items-center gap-2">
//           <Stethoscope className="text-primary" /> Doctors Management
//         </h3>
//         <button
//           className="btn btn-primary rounded-pill px-4 shadow-sm"
//           onClick={() => {
//             resetForm();
//             setShowModal(true);
//           }}
//         >
//           <Plus size={18} className="me-2" /> Register Doctor
//         </button>
//       </div>

//       {success && (
//         <div className="alert alert-success border-0 shadow-sm text-center">
//           {success}
//         </div>
//       )}
//       {error && (
//         <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center gap-2">
//           <AlertCircle size={18} />
//           {error}
//         </div>
//       )}

//       <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="table-light">
//               <tr className="small text-uppercase fw-bold text-muted">
//                 <th className="ps-4">Specialist</th>
//                 <th>Credentials</th>
//                 <th>Contact</th>
//                 <th>Schedule</th>
//                 <th className="text-end pe-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.map((doc) => (
//                 <tr key={doc._id}>
//                   <td className="ps-4">
//                     <div className="fw-bold text-dark">{doc.name}</div>
//                     <span className="badge bg-primary-subtle text-primary border border-primary-subtle me-1">
//                       {doc.speciality}
//                     </span>
//                     {!doc.isAvailable && (
//                       <span className="badge bg-danger">Unavailable</span>
//                     )}
//                   </td>
//                   <td>
//                     <div className="small text-muted d-flex align-items-center gap-1">
//                       <Briefcase size={12} /> {doc.experience} Yrs Exp.
//                     </div>
//                     <div className="small text-muted d-flex align-items-center gap-1">
//                       <DollarSign size={12} /> Fee: Rs. {doc.consultationFee}
//                     </div>
//                     <div
//                       className="small text-muted"
//                       style={{ fontSize: "0.75rem" }}
//                     >
//                       NMC: {doc.nmcNumber}
//                     </div>
//                   </td>
//                   <td>
//                     <div className="small text-dark fw-medium">
//                       <Phone size={12} className="me-1" /> {doc.phone || "N/A"}
//                     </div>
//                     <div className="small text-muted">
//                       <Mail size={12} className="me-1" /> {doc.email || "N/A"}
//                     </div>
//                   </td>
//                   <td>
//                     {/* ✅ Safe Check: doc.slots?.map to prevent crashes */}
//                     {doc.slots && doc.slots.length > 0 ? (
//                       doc.slots.map((s, i) => (
//                         <div key={i} className="small text-muted">
//                           <Clock size={12} className="me-1" />
//                           <span className="fw-bold">
//                             {s.day.slice(0, 3)}
//                           </span>: {s.startTime}-{s.endTime}
//                         </div>
//                       ))
//                     ) : (
//                       <span className="text-muted small fst-italic">
//                         No slots configured
//                       </span>
//                     )}
//                   </td>
//                   <td className="text-end pe-4">
//                     <button
//                       className="btn btn-sm btn-outline-primary border-0 me-2"
//                       onClick={() => handleEdit(doc)}
//                     >
//                       <Edit size={16} />
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger border-0"
//                       onClick={() => handleDelete(doc._id, doc.name)}
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showModal && (
//         <div
//           className="modal show d-block animate-fade-in"
//           style={{ background: "rgba(0,0,0,0.5)" }}
//           tabIndex="-1"
//         >
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content border-0 shadow-lg rounded-4">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header border-bottom px-4">
//                   <h5 className="fw-bold m-0">
//                     {isEditing
//                       ? "Update Specialist Info"
//                       : "New Doctor Registration"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close shadow-none"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <div className="modal-body p-4">
//                   <div className="row g-3">
//                     {/* Basic Info */}
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Full Name *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2 shadow-none"
//                         value={formData.name}
//                         onChange={(e) =>
//                           setFormData({ ...formData, name: e.target.value })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Speciality *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2 shadow-none"
//                         value={formData.speciality}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             speciality: e.target.value,
//                           })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         NMC Registration *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2 shadow-none"
//                         value={formData.nmcNumber}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             nmcNumber: e.target.value,
//                           })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Contact Number *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2 shadow-none"
//                         value={formData.phone}
//                         onChange={(e) =>
//                           setFormData({ ...formData, phone: e.target.value })
//                         }
//                         required
//                         placeholder="+977-..."
//                       />
//                     </div>

//                     {/* Stats */}
//                     <div className="col-md-4">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Experience (Yrs)
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control border-2 shadow-none"
//                         value={formData.experience}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             experience: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className="col-md-4">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Fee (Rs.)
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control border-2 shadow-none"
//                         value={formData.consultationFee}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             consultationFee: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className="col-md-4">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         System Status
//                       </label>
//                       <select
//                         className="form-select border-2 shadow-none"
//                         value={formData.isAvailable}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             isAvailable: e.target.value === "true",
//                           })
//                         }
//                       >
//                         <option value="true">Available</option>
//                         <option value="false">Unavailable</option>
//                       </select>
//                     </div>

//                     <div className="col-md-12">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         className="form-control border-2 shadow-none"
//                         value={formData.email}
//                         onChange={(e) =>
//                           setFormData({ ...formData, email: e.target.value })
//                         }
//                       />
//                     </div>

//                     {/* Schedule Section */}
//                     <div className="col-12 mt-4">
//                       <div className="d-flex justify-content-between align-items-center mb-2">
//                         <label className="form-label small fw-bold text-primary mb-0 text-uppercase">
//                           Weekly Schedule
//                         </label>
//                         <button
//                           type="button"
//                           className="btn btn-sm btn-outline-primary rounded-pill px-3"
//                           onClick={addSlot}
//                         >
//                           + Add Shift
//                         </button>
//                       </div>
//                       <div className="p-3 bg-light rounded-3 border">
//                         {formData.slots.length === 0 ? (
//                           <p className="text-center text-muted small m-0 fst-italic">
//                             No working shifts added yet.
//                           </p>
//                         ) : (
//                           formData.slots.map((slot, index) => (
//                             <div
//                               key={index}
//                               className="row g-2 mb-2 align-items-end"
//                             >
//                               <div className="col-md-4">
//                                 <select
//                                   className="form-select form-select-sm border-2 shadow-none"
//                                   value={slot.day}
//                                   onChange={(e) =>
//                                     updateSlot(index, "day", e.target.value)
//                                   }
//                                 >
//                                   {[
//                                     "MONDAY",
//                                     "TUESDAY",
//                                     "WEDNESDAY",
//                                     "THURSDAY",
//                                     "FRIDAY",
//                                     "SATURDAY",
//                                     "SUNDAY",
//                                   ].map((d) => (
//                                     <option key={d} value={d}>
//                                       {d}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </div>
//                               <div className="col-md-3">
//                                 {/* ✅ FIX: Changed type to 'time' for strict backend compatibility */}
//                                 <input
//                                   type="time"
//                                   className="form-control form-control-sm border-2 shadow-none"
//                                   value={slot.startTime}
//                                   onChange={(e) =>
//                                     updateSlot(
//                                       index,
//                                       "startTime",
//                                       e.target.value
//                                     )
//                                   }
//                                   required
//                                 />
//                               </div>
//                               <div className="col-md-3">
//                                 <input
//                                   type="time"
//                                   className="form-control form-control-sm border-2 shadow-none"
//                                   value={slot.endTime}
//                                   onChange={(e) =>
//                                     updateSlot(index, "endTime", e.target.value)
//                                   }
//                                   required
//                                 />
//                               </div>
//                               <div className="col-md-2 text-center">
//                                 <button
//                                   type="button"
//                                   className="btn btn-sm text-danger"
//                                   onClick={() => removeSlot(index)}
//                                 >
//                                   <Trash2 size={16} />
//                                 </button>
//                               </div>
//                             </div>
//                           ))
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="modal-footer border-top px-4 py-3">
//                   <button
//                     type="button"
//                     className="btn btn-light rounded-pill px-4"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
//                     disabled={saving}
//                   >
//                     {saving ? (
//                       <span className="spinner-border spinner-border-sm me-2" />
//                     ) : (
//                       <Save size={18} className="me-2" />
//                     )}
//                     {isEditing ? "Save Changes" : "Register Doctor"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//       <style>{`.animate-fade-in { animation: fadeIn 0.3s ease; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
//     </div>
//   );
// };

// export default AdminDoctors;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Stethoscope,
//   Plus,
//   Edit,
//   Trash2,
//   Clock,
//   Save,
//   AlertCircle,
//   Mail,
//   Phone,
//   Briefcase,
//   DollarSign,
//   Loader2,
// } from "lucide-react";

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentDoctorId, setCurrentDoctorId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     email: "",
//     phone: "",
//     experience: 0,
//     consultationFee: 500,
//     slots: [],
//     isAvailable: true,
//   });

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/admin/doctors");
//       const data = res.data?.doctors || res.data || [];
//       setDoctors(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Failed to load doctor records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const handleEdit = (doctor) => {
//     setError("");
//     setIsEditing(true);
//     setCurrentDoctorId(doctor._id);
//     setFormData({
//       name: doctor.name || "",
//       speciality: doctor.speciality || "",
//       nmcNumber: doctor.nmcNumber || "",
//       email: doctor.email || "",
//       phone: doctor.phone || "",
//       experience: doctor.experience || 0,
//       consultationFee: doctor.consultationFee || 500,
//       slots: doctor.slots || [],
//       isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
//     });
//     setShowModal(true);
//   };

//   const addSlot = () => {
//     setFormData({
//       ...formData,
//       slots: [
//         ...formData.slots,
//         { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
//       ],
//     });
//   };

//   const removeSlot = (index) => {
//     const newSlots = formData.slots.filter((_, i) => i !== index);
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...formData.slots];
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       setError("");

//       if (isEditing) {
//         await api.put(`/admin/doctors/${currentDoctorId}`, formData);
//         setSuccess("Doctor profile updated successfully!");
//       } else {
//         await api.post("/admin/doctors", formData);
//         setSuccess("Doctor registered successfully!");
//       }

//       setShowModal(false);
//       resetForm();
//       fetchDoctors();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save record.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (
//       window.confirm(
//         `Delete ${name}? This will remove them from the booking system.`
//       )
//     ) {
//       try {
//         await api.delete(`/admin/doctors/${id}`);
//         fetchDoctors();
//       } catch (err) {
//         alert(err.response?.data?.message || "Delete failed.");
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       speciality: "",
//       nmcNumber: "",
//       email: "",
//       phone: "",
//       experience: 0,
//       consultationFee: 500,
//       slots: [],
//       isAvailable: true,
//     });
//     setIsEditing(false);
//     setCurrentDoctorId(null);
//   };

//   if (loading && doctors.length === 0)
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <Loader2 className="animate-spin text-primary" size={40} />
//       </div>
//     );

//   return (
//     <div className="container-fluid p-0 animate-fade-in">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="fw-bold d-flex align-items-center gap-2">
//           <Stethoscope className="text-primary" /> Doctors Management
//         </h3>
//         <button
//           className="btn btn-primary rounded-pill px-4 shadow-sm"
//           onClick={() => {
//             resetForm();
//             setShowModal(true);
//           }}
//         >
//           <Plus size={18} className="me-2" /> Register Doctor
//         </button>
//       </div>

//       {success && (
//         <div className="alert alert-success border-0 shadow-sm text-center">
//           {success}
//         </div>
//       )}
//       {error && (
//         <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center gap-2">
//           <AlertCircle size={18} />
//           {error}
//         </div>
//       )}

//       <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="table-light">
//               <tr className="small text-uppercase fw-bold text-muted">
//                 <th className="ps-4">Specialist</th>
//                 <th>Credentials</th>
//                 <th>Contact</th>
//                 <th>Schedule</th>
//                 <th className="text-end pe-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.map((doc) => (
//                 <tr key={doc._id}>
//                   <td className="ps-4">
//                     <div className="fw-bold text-dark">{doc.name}</div>
//                     <span className="badge bg-primary-subtle text-primary border border-primary-subtle me-1">
//                       {doc.speciality}
//                     </span>
//                     {!doc.isAvailable && (
//                       <span className="badge bg-danger">Unavailable</span>
//                     )}
//                   </td>
//                   <td>
//                     <div className="small text-muted d-flex align-items-center gap-1">
//                       <Briefcase size={12} /> {doc.experience} Yrs Exp.
//                     </div>
//                     <div className="small text-muted d-flex align-items-center gap-1">
//                       <DollarSign size={12} /> Fee: Rs. {doc.consultationFee}
//                     </div>
//                     <div
//                       className="small text-muted"
//                       style={{ fontSize: "0.75rem" }}
//                     >
//                       NMC: {doc.nmcNumber}
//                     </div>
//                   </td>
//                   <td>
//                     <div className="small text-dark fw-medium">
//                       <Phone size={12} className="me-1" /> {doc.phone || "N/A"}
//                     </div>
//                     <div className="small text-muted">
//                       <Mail size={12} className="me-1" /> {doc.email || "N/A"}
//                     </div>
//                   </td>
//                   <td>
//                     {/* ✅ FIX IS HERE: Added safety check (s.day || "") before .slice() */}
//                     {doc.slots && doc.slots.length > 0 ? (
//                       doc.slots.map((s, i) => (
//                         <div key={i} className="small text-muted">
//                           <Clock size={12} className="me-1" />
//                           <span className="fw-bold">
//                             {s.day ? s.day.slice(0, 3) : "UNK"}
//                           </span>
//                           : {s.startTime}-{s.endTime}
//                         </div>
//                       ))
//                     ) : (
//                       <span className="text-muted small fst-italic">
//                         No slots configured
//                       </span>
//                     )}
//                   </td>
//                   <td className="text-end pe-4">
//                     <button
//                       className="btn btn-sm btn-outline-primary border-0 me-2"
//                       onClick={() => handleEdit(doc)}
//                     >
//                       <Edit size={16} />
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger border-0"
//                       onClick={() => handleDelete(doc._id, doc.name)}
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showModal && (
//         <div
//           className="modal show d-block animate-fade-in"
//           style={{ background: "rgba(0,0,0,0.5)" }}
//           tabIndex="-1"
//         >
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content border-0 shadow-lg rounded-4">
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header border-bottom px-4">
//                   <h5 className="fw-bold m-0">
//                     {isEditing
//                       ? "Update Specialist Info"
//                       : "New Doctor Registration"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close shadow-none"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <div className="modal-body p-4">
//                   <div className="row g-3">
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Full Name *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2 shadow-none"
//                         value={formData.name}
//                         onChange={(e) =>
//                           setFormData({ ...formData, name: e.target.value })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Speciality *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2 shadow-none"
//                         value={formData.speciality}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             speciality: e.target.value,
//                           })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         NMC Registration *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2 shadow-none"
//                         value={formData.nmcNumber}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             nmcNumber: e.target.value,
//                           })
//                         }
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Contact Number *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control border-2 shadow-none"
//                         value={formData.phone}
//                         onChange={(e) =>
//                           setFormData({ ...formData, phone: e.target.value })
//                         }
//                         required
//                         placeholder="+977-..."
//                       />
//                     </div>

//                     <div className="col-md-4">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Experience (Yrs)
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control border-2 shadow-none"
//                         value={formData.experience}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             experience: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className="col-md-4">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Fee (Rs.)
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control border-2 shadow-none"
//                         value={formData.consultationFee}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             consultationFee: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className="col-md-4">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         System Status
//                       </label>
//                       <select
//                         className="form-select border-2 shadow-none"
//                         value={formData.isAvailable}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             isAvailable: e.target.value === "true",
//                           })
//                         }
//                       >
//                         <option value="true">Available</option>
//                         <option value="false">Unavailable</option>
//                       </select>
//                     </div>

//                     <div className="col-md-12">
//                       <label className="form-label small fw-bold text-muted text-uppercase">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         className="form-control border-2 shadow-none"
//                         value={formData.email}
//                         onChange={(e) =>
//                           setFormData({ ...formData, email: e.target.value })
//                         }
//                       />
//                     </div>

//                     <div className="col-12 mt-4">
//                       <div className="d-flex justify-content-between align-items-center mb-2">
//                         <label className="form-label small fw-bold text-primary mb-0 text-uppercase">
//                           Weekly Schedule
//                         </label>
//                         <button
//                           type="button"
//                           className="btn btn-sm btn-outline-primary rounded-pill px-3"
//                           onClick={addSlot}
//                         >
//                           + Add Shift
//                         </button>
//                       </div>
//                       <div className="p-3 bg-light rounded-3 border">
//                         {formData.slots.length === 0 ? (
//                           <p className="text-center text-muted small m-0 fst-italic">
//                             No working shifts added yet.
//                           </p>
//                         ) : (
//                           formData.slots.map((slot, index) => (
//                             <div
//                               key={index}
//                               className="row g-2 mb-2 align-items-end"
//                             >
//                               <div className="col-md-4">
//                                 <select
//                                   className="form-select form-select-sm border-2 shadow-none"
//                                   value={slot.day}
//                                   onChange={(e) =>
//                                     updateSlot(index, "day", e.target.value)
//                                   }
//                                 >
//                                   {[
//                                     "MONDAY",
//                                     "TUESDAY",
//                                     "WEDNESDAY",
//                                     "THURSDAY",
//                                     "FRIDAY",
//                                     "SATURDAY",
//                                     "SUNDAY",
//                                   ].map((d) => (
//                                     <option key={d} value={d}>
//                                       {d}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </div>
//                               <div className="col-md-3">
//                                 <input
//                                   type="time"
//                                   className="form-control form-control-sm border-2 shadow-none"
//                                   value={slot.startTime}
//                                   onChange={(e) =>
//                                     updateSlot(
//                                       index,
//                                       "startTime",
//                                       e.target.value
//                                     )
//                                   }
//                                   required
//                                 />
//                               </div>
//                               <div className="col-md-3">
//                                 <input
//                                   type="time"
//                                   className="form-control form-control-sm border-2 shadow-none"
//                                   value={slot.endTime}
//                                   onChange={(e) =>
//                                     updateSlot(index, "endTime", e.target.value)
//                                   }
//                                   required
//                                 />
//                               </div>
//                               <div className="col-md-2 text-center">
//                                 <button
//                                   type="button"
//                                   className="btn btn-sm text-danger"
//                                   onClick={() => removeSlot(index)}
//                                 >
//                                   <Trash2 size={16} />
//                                 </button>
//                               </div>
//                             </div>
//                           ))
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="modal-footer border-top px-4 py-3">
//                   <button
//                     type="button"
//                     className="btn btn-light rounded-pill px-4"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
//                     disabled={saving}
//                   >
//                     {saving ? (
//                       <span className="spinner-border spinner-border-sm me-2" />
//                     ) : (
//                       <Save size={18} className="me-2" />
//                     )}
//                     {isEditing ? "Save Changes" : "Register Doctor"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//       <style>{`.animate-fade-in { animation: fadeIn 0.3s ease; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
//     </div>
//   );
// };

// export default AdminDoctors;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Stethoscope,
//   Plus,
//   Edit,
//   Trash2,
//   Clock,
//   Save,
//   AlertCircle,
//   Mail,
//   Phone,
//   Briefcase,
//   DollarSign,
//   Loader2,
//   User,
//   FileText,
//   Activity,
//   CheckCircle,
// } from "lucide-react";

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentDoctorId, setCurrentDoctorId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     email: "",
//     phone: "",
//     experience: 0,
//     consultationFee: 500,
//     slots: [],
//     isAvailable: true,
//   });

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/admin/doctors");
//       const data = res.data?.doctors || res.data || [];
//       setDoctors(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Failed to load doctor records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const handleEdit = (doctor) => {
//     setError("");
//     setIsEditing(true);
//     setCurrentDoctorId(doctor._id);
//     setFormData({
//       name: doctor.name || "",
//       speciality: doctor.speciality || "",
//       nmcNumber: doctor.nmcNumber || "",
//       email: doctor.email || "",
//       phone: doctor.phone || "",
//       experience: doctor.experience || 0,
//       consultationFee: doctor.consultationFee || 500,
//       slots: doctor.slots || [],
//       isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
//     });
//     setShowModal(true);
//   };

//   const addSlot = () => {
//     setFormData({
//       ...formData,
//       slots: [
//         ...formData.slots,
//         { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
//       ],
//     });
//   };

//   const removeSlot = (index) => {
//     const newSlots = formData.slots.filter((_, i) => i !== index);
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...formData.slots];
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       setError("");

//       if (isEditing) {
//         await api.put(`/admin/doctors/${currentDoctorId}`, formData);
//         setSuccess("Doctor profile updated successfully!");
//       } else {
//         await api.post("/admin/doctors", formData);
//         setSuccess("Doctor registered successfully!");
//       }

//       setShowModal(false);
//       resetForm();
//       fetchDoctors();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save record.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (
//       window.confirm(
//         `Delete ${name}? This will remove them from the booking system.`,
//       )
//     ) {
//       try {
//         await api.delete(`/admin/doctors/${id}`);
//         fetchDoctors();
//       } catch (err) {
//         alert(err.response?.data?.message || "Delete failed.");
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       speciality: "",
//       nmcNumber: "",
//       email: "",
//       phone: "",
//       experience: 0,
//       consultationFee: 500,
//       slots: [],
//       isAvailable: true,
//     });
//     setIsEditing(false);
//     setCurrentDoctorId(null);
//   };

//   if (loading && doctors.length === 0) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary mb-3" size={40} />
//         <span className="fw-semibold text-muted tracking-wider text-uppercase small">
//           Loading Specialist Data...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
//       {/* Header Section */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
//         <div className="d-flex align-items-center gap-3">
//           <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4">
//             <Stethoscope size={24} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="fw-bolder mb-1 text-dark tracking-tight">
//               Doctors Management
//             </h3>
//             <p className="text-muted small fw-medium mb-0">
//               Total Specialists:{" "}
//               <span className="fw-bold text-primary">{doctors.length}</span>
//             </p>
//           </div>
//         </div>
//         <button
//           className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift transition-all d-flex align-items-center"
//           onClick={() => {
//             resetForm();
//             setShowModal(true);
//           }}
//         >
//           <Plus size={18} className="me-2" /> Register Doctor
//         </button>
//       </div>

//       {/* Alerts */}
//       {success && (
//         <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 shadow-sm mb-4 rounded-3 border-0 bg-success bg-opacity-10 text-success small fw-medium">
//           <CheckCircle size={18} /> {success}
//         </div>
//       )}
//       {error && (
//         <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 shadow-sm mb-4 rounded-3 border-0 bg-danger bg-opacity-10 text-danger small fw-medium">
//           <AlertCircle size={18} /> {error}
//         </div>
//       )}

//       {/* Main Table Card */}
//       <div className="card shadow-sm border-0 rounded-4 overflow-hidden modern-card mb-4">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="bg-light border-bottom">
//               <tr>
//                 <th className="py-3 ps-4 text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                   Specialist
//                 </th>
//                 <th className="py-3 text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                   Credentials
//                 </th>
//                 <th className="py-3 text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                   Contact
//                 </th>
//                 <th className="py-3 text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                   Schedule
//                 </th>
//                 <th className="py-3 pe-4 text-end text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="border-top-0">
//               {doctors.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-5 text-muted">
//                     <div className="d-flex flex-column align-items-center justify-content-center">
//                       <div className="bg-secondary bg-opacity-10 p-3 rounded-circle mb-3">
//                         <Stethoscope
//                           size={32}
//                           className="text-secondary opacity-50"
//                         />
//                       </div>
//                       <p className="fw-medium mb-0">
//                         No doctors registered yet.
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 doctors.map((doc) => (
//                   <tr key={doc._id} className="transition-all table-row-hover">
//                     <td className="ps-4 py-3">
//                       <div
//                         className="fw-bold text-dark mb-1"
//                         style={{ fontSize: "0.95rem" }}
//                       >
//                         {doc.name}
//                       </div>
//                       <div className="d-flex align-items-center gap-2">
//                         <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1">
//                           {doc.speciality}
//                         </span>
//                         {!doc.isAvailable && (
//                           <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">
//                             Unavailable
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark d-flex align-items-center gap-1 fw-medium mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Briefcase size={14} className="text-muted" />{" "}
//                         {doc.experience} Yrs Experience
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-1 mb-1"
//                         style={{ fontSize: "0.8rem" }}
//                       >
//                         <DollarSign size={14} /> Fee: NPR {doc.consultationFee}
//                       </div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         <span className="fw-semibold">NMC:</span>{" "}
//                         {doc.nmcNumber}
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark fw-medium d-flex align-items-center gap-1 mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Phone size={14} className="text-muted" />{" "}
//                         {doc.phone || "N/A"}
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-1"
//                         style={{ fontSize: "0.8rem" }}
//                       >
//                         <Mail size={14} /> {doc.email || "N/A"}
//                       </div>
//                     </td>
//                     <td>
//                       {doc.slots && doc.slots.length > 0 ? (
//                         <div className="d-flex flex-column gap-1">
//                           {doc.slots.map((s, i) => (
//                             <div
//                               key={i}
//                               className="text-muted d-flex align-items-center gap-1"
//                               style={{ fontSize: "0.8rem" }}
//                             >
//                               <Clock size={12} className="text-primary" />
//                               <span className="fw-bold text-dark">
//                                 {s.day ? s.day.slice(0, 3) : "UNK"}
//                               </span>
//                               <span>
//                                 {s.startTime} - {s.endTime}
//                               </span>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">
//                           No Schedule
//                         </span>
//                       )}
//                     </td>
//                     <td className="pe-4 text-end">
//                       {/* FIXED: Added type="button" and position-relative to ensure clickability */}
//                       <button
//                         type="button"
//                         className="btn btn-sm btn-light text-primary rounded-circle p-2 mx-1 hover-lift transition-all position-relative"
//                         style={{ zIndex: 5, cursor: "pointer" }}
//                         onClick={() => handleEdit(doc)}
//                         title="Edit Doctor"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         type="button"
//                         className="btn btn-sm btn-light text-danger rounded-circle p-2 mx-1 hover-lift transition-all position-relative"
//                         style={{ zIndex: 5, cursor: "pointer" }}
//                         onClick={() => handleDelete(doc._id, doc.name)}
//                         title="Delete Doctor"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ✅ FIXED: Modal Hierarchy with proper Backdrop placement */}
//       {showModal && (
//         <>
//           <div
//             className="modal-backdrop fade show"
//             style={{ zIndex: 1040 }}
//             onClick={() => setShowModal(false)}
//           ></div>

//           <div
//             className="modal show d-block animate-fade-in"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//           >
//             <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
//               <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//                 <div className="modal-header bg-light border-0 p-4 pb-3">
//                   <h5 className="modal-title fw-bolder text-dark d-flex align-items-center gap-2">
//                     <Stethoscope className="text-primary" size={20} />
//                     {isEditing
//                       ? "Update Specialist Info"
//                       : "New Doctor Registration"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close shadow-none bg-secondary bg-opacity-10 rounded-circle p-2"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <form
//                   onSubmit={handleSubmit}
//                   className="d-flex flex-column overflow-hidden"
//                 >
//                   <div className="modal-body p-4 pt-3 overflow-auto">
//                     <div className="row g-4">
//                       {/* Name */}
//                       <div className="col-md-6">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           Full Name *
//                         </label>
//                         <div className="position-relative">
//                           <User
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={formData.name}
//                             onChange={(e) =>
//                               setFormData({ ...formData, name: e.target.value })
//                             }
//                             required
//                             placeholder="Dr. John Doe"
//                           />
//                         </div>
//                       </div>

//                       {/* Speciality */}
//                       <div className="col-md-6">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           Speciality *
//                         </label>
//                         <div className="position-relative">
//                           <Stethoscope
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={formData.speciality}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 speciality: e.target.value,
//                               })
//                             }
//                             required
//                             placeholder="e.g. Cardiologist"
//                           />
//                         </div>
//                       </div>

//                       {/* NMC Number */}
//                       <div className="col-md-6">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           NMC Registration *
//                         </label>
//                         <div className="position-relative">
//                           <FileText
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={formData.nmcNumber}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 nmcNumber: e.target.value,
//                               })
//                             }
//                             required
//                             placeholder="NMC-XXXX"
//                           />
//                         </div>
//                       </div>

//                       {/* Phone */}
//                       <div className="col-md-6">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           Contact Number *
//                         </label>
//                         <div className="position-relative">
//                           <Phone
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={formData.phone}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 phone: e.target.value,
//                               })
//                             }
//                             required
//                             placeholder="98XXXXXXXX"
//                           />
//                         </div>
//                       </div>

//                       {/* Experience */}
//                       <div className="col-md-4">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           Experience (Yrs)
//                         </label>
//                         <div className="position-relative">
//                           <Briefcase
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="number"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={formData.experience}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 experience: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       {/* Consultation Fee */}
//                       <div className="col-md-4">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           Fee (NPR)
//                         </label>
//                         <div className="position-relative">
//                           <DollarSign
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="number"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={formData.consultationFee}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 consultationFee: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       {/* System Status */}
//                       <div className="col-md-4">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           System Status
//                         </label>
//                         <div className="position-relative">
//                           <Activity
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <select
//                             className="form-select modern-input ps-5 border-light-subtle"
//                             value={formData.isAvailable}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 isAvailable: e.target.value === "true",
//                               })
//                             }
//                           >
//                             <option value="true">Available</option>
//                             <option value="false">Unavailable</option>
//                           </select>
//                         </div>
//                       </div>

//                       {/* Email Address */}
//                       <div className="col-md-12">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           Email Address
//                         </label>
//                         <div className="position-relative">
//                           <Mail
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="email"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={formData.email}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 email: e.target.value,
//                               })
//                             }
//                             placeholder="doctor@hospital.com"
//                           />
//                         </div>
//                       </div>

//                       {/* Weekly Schedule Component */}
//                       <div className="col-12 mt-4">
//                         <div className="d-flex justify-content-between align-items-center mb-3">
//                           <label className="form-label small fw-bold text-primary mb-0 d-flex align-items-center gap-2">
//                             <Clock size={16} /> Weekly Schedule
//                           </label>
//                           <button
//                             type="button"
//                             className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold hover-lift transition-all"
//                             onClick={addSlot}
//                           >
//                             <Plus size={14} className="me-1" /> Add Shift
//                           </button>
//                         </div>

//                         <div className="p-3 bg-primary bg-opacity-10 rounded-4 border border-primary border-opacity-10">
//                           {formData.slots.length === 0 ? (
//                             <div className="text-center py-4 text-muted small fw-medium">
//                               No working shifts added yet. Click "Add Shift" to
//                               assign hours.
//                             </div>
//                           ) : (
//                             formData.slots.map((slot, index) => (
//                               <div
//                                 key={index}
//                                 className="row g-2 mb-2 align-items-center bg-white p-2 rounded-3 shadow-sm border border-light"
//                               >
//                                 <div className="col-md-4">
//                                   <select
//                                     className="form-select form-select-sm modern-input border-light-subtle"
//                                     value={slot.day}
//                                     onChange={(e) =>
//                                       updateSlot(index, "day", e.target.value)
//                                     }
//                                   >
//                                     {[
//                                       "MONDAY",
//                                       "TUESDAY",
//                                       "WEDNESDAY",
//                                       "THURSDAY",
//                                       "FRIDAY",
//                                       "SATURDAY",
//                                       "SUNDAY",
//                                     ].map((d) => (
//                                       <option key={d} value={d}>
//                                         {d}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </div>
//                                 <div className="col-md-3">
//                                   <input
//                                     type="time"
//                                     className="form-control form-control-sm modern-input border-light-subtle text-center"
//                                     value={slot.startTime}
//                                     onChange={(e) =>
//                                       updateSlot(
//                                         index,
//                                         "startTime",
//                                         e.target.value,
//                                       )
//                                     }
//                                     required
//                                   />
//                                 </div>
//                                 <div className="col-auto text-muted fw-bold">
//                                   to
//                                 </div>
//                                 <div className="col-md-3">
//                                   <input
//                                     type="time"
//                                     className="form-control form-control-sm modern-input border-light-subtle text-center"
//                                     value={slot.endTime}
//                                     onChange={(e) =>
//                                       updateSlot(
//                                         index,
//                                         "endTime",
//                                         e.target.value,
//                                       )
//                                     }
//                                     required
//                                   />
//                                 </div>
//                                 <div className="col text-end">
//                                   <button
//                                     type="button"
//                                     className="btn btn-sm text-danger hover-lift"
//                                     onClick={() => removeSlot(index)}
//                                     title="Remove Shift"
//                                   >
//                                     <Trash2 size={16} />
//                                   </button>
//                                 </div>
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Footer Buttons */}
//                   <div className="modal-footer bg-light border-0 p-3 mt-auto">
//                     <button
//                       type="button"
//                       className="btn btn-light rounded-pill px-4 fw-medium border"
//                       onClick={() => setShowModal(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold hover-lift transition-all d-flex align-items-center gap-2"
//                       disabled={saving}
//                     >
//                       {saving ? (
//                         <>
//                           <Loader2 size={18} className="spin-animation" />{" "}
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <Save size={18} />{" "}
//                           {isEditing ? "Save Changes" : "Register Doctor"}
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

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

// export default AdminDoctors;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Stethoscope,
//   Plus,
//   Edit,
//   Trash2,
//   Clock,
//   Save,
//   AlertCircle,
//   Mail,
//   Phone,
//   Briefcase,
//   DollarSign,
//   Loader2,
//   User,
//   FileText,
//   Activity,
//   CheckCircle,
// } from "lucide-react";

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentDoctorId, setCurrentDoctorId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     email: "",
//     phone: "",
//     experience: 0,
//     consultationFee: 500,
//     slots: [],
//     isAvailable: true,
//   });

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/admin/doctors");
//       const data = res.data?.doctors || res.data || [];
//       setDoctors(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Failed to load doctor records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const handleEdit = (doctor) => {
//     setError("");
//     setIsEditing(true);
//     setCurrentDoctorId(doctor._id);
//     setFormData({
//       name: doctor.name || "",
//       speciality: doctor.speciality || "",
//       nmcNumber: doctor.nmcNumber || "",
//       email: doctor.email || "",
//       phone: doctor.phone || "",
//       experience: doctor.experience || 0,
//       consultationFee: doctor.consultationFee || 500,
//       slots: doctor.slots || [],
//       isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
//     });
//     setShowModal(true);
//   };

//   const addSlot = () => {
//     setFormData({
//       ...formData,
//       slots: [
//         ...formData.slots,
//         { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
//       ],
//     });
//   };

//   const removeSlot = (index) => {
//     const newSlots = formData.slots.filter((_, i) => i !== index);
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...formData.slots];
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       setError("");

//       if (isEditing) {
//         await api.put(`/admin/doctors/${currentDoctorId}`, formData);
//         setSuccess("Doctor profile updated successfully!");
//       } else {
//         await api.post("/admin/doctors", formData);
//         setSuccess("Doctor registered successfully!");
//       }

//       setShowModal(false);
//       resetForm();
//       fetchDoctors();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save record.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (
//       window.confirm(
//         `Delete ${name}? This will remove them from the booking system.`,
//       )
//     ) {
//       try {
//         await api.delete(`/admin/doctors/${id}`);
//         fetchDoctors();
//       } catch (err) {
//         alert(err.response?.data?.message || "Delete failed.");
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       speciality: "",
//       nmcNumber: "",
//       email: "",
//       phone: "",
//       experience: 0,
//       consultationFee: 500,
//       slots: [],
//       isAvailable: true,
//     });
//     setIsEditing(false);
//     setCurrentDoctorId(null);
//   };

//   if (loading && doctors.length === 0) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary mb-3" size={48} />
//         <span className="fw-bold text-secondary tracking-wider text-uppercase small">
//           Loading Specialist Data...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
//       {/* --- HEADER SECTION --- */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
//         <div className="d-flex align-items-center gap-3">
//           <div className="bg-primary text-white p-3 rounded-3 shadow-sm">
//             <Stethoscope size={28} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="fw-bolder mb-1 text-dark tracking-tight">
//               Doctors Management
//             </h3>
//             <p className="text-muted fw-medium mb-0">
//               Total Specialists:{" "}
//               <span className="fw-bold text-primary">{doctors.length}</span>
//             </p>
//           </div>
//         </div>
//         <button
//           className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift d-flex align-items-center"
//           onClick={() => {
//             resetForm();
//             setShowModal(true);
//           }}
//         >
//           <Plus size={18} className="me-2" /> Register Doctor
//         </button>
//       </div>

//       {/* --- ALERTS --- */}
//       {success && (
//         <div className="alert alert-success d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold animate-fade-in">
//           <CheckCircle size={20} /> {success}
//         </div>
//       )}
//       {error && (
//         <div className="alert alert-danger d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold animate-fade-in">
//           <AlertCircle size={20} /> {error}
//         </div>
//       )}

//       {/* --- MAIN TABLE CARD --- */}
//       <div className="card-modern mb-4 bg-white">
//         <div className="table-responsive custom-scrollbar">
//           <table className="table table-hover align-middle mb-0 table-modern">
//             <thead>
//               <tr>
//                 <th className="ps-4">Specialist</th>
//                 <th>Credentials</th>
//                 <th>Contact</th>
//                 <th>Schedule</th>
//                 <th className="text-end pe-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-5 text-muted">
//                     <div className="d-flex flex-column align-items-center justify-content-center">
//                       <div className="bg-secondary bg-opacity-10 p-3 rounded-circle mb-3">
//                         <Stethoscope
//                           size={32}
//                           className="text-secondary opacity-50"
//                         />
//                       </div>
//                       <p className="fw-bold mb-0">No doctors registered yet.</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 doctors.map((doc) => (
//                   <tr key={doc._id}>
//                     <td className="ps-4 py-3">
//                       <div
//                         className="fw-bold text-dark mb-1"
//                         style={{ fontSize: "0.95rem" }}
//                       >
//                         {doc.name}
//                       </div>
//                       <div className="d-flex align-items-center gap-2">
//                         <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1">
//                           {doc.speciality}
//                         </span>
//                         {!doc.isAvailable && (
//                           <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">
//                             Unavailable
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark d-flex align-items-center gap-1 fw-medium mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Briefcase size={14} className="text-muted" />{" "}
//                         {doc.experience} Yrs Experience
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-1 mb-1"
//                         style={{ fontSize: "0.8rem" }}
//                       >
//                         <DollarSign size={14} /> Fee: NPR {doc.consultationFee}
//                       </div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         <span className="fw-semibold">NMC:</span>{" "}
//                         {doc.nmcNumber}
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark fw-medium d-flex align-items-center gap-1 mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Phone size={14} className="text-muted" />{" "}
//                         {doc.phone || "N/A"}
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-1"
//                         style={{ fontSize: "0.8rem" }}
//                       >
//                         <Mail size={14} /> {doc.email || "N/A"}
//                       </div>
//                     </td>
//                     <td>
//                       {doc.slots && doc.slots.length > 0 ? (
//                         <div className="d-flex flex-column gap-1">
//                           {doc.slots.map((s, i) => (
//                             <div
//                               key={i}
//                               className="text-muted d-flex align-items-center gap-1"
//                               style={{ fontSize: "0.8rem" }}
//                             >
//                               <Clock size={12} className="text-primary" />
//                               <span className="fw-bold text-dark">
//                                 {s.day ? s.day.slice(0, 3) : "UNK"}
//                               </span>
//                               <span>
//                                 {s.startTime} - {s.endTime}
//                               </span>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">
//                           No Schedule
//                         </span>
//                       )}
//                     </td>
//                     <td className="pe-4 text-end">
//                       <button
//                         type="button"
//                         className="btn btn-sm btn-light text-primary rounded-circle p-2 mx-1 hover-lift position-relative shadow-sm"
//                         style={{ zIndex: 5, cursor: "pointer" }}
//                         onClick={() => handleEdit(doc)}
//                         title="Edit Doctor"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         type="button"
//                         className="btn btn-sm btn-light text-danger rounded-circle p-2 mx-1 hover-lift position-relative shadow-sm"
//                         style={{ zIndex: 5, cursor: "pointer" }}
//                         onClick={() => handleDelete(doc._id, doc.name)}
//                         title="Delete Doctor"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- MODAL SECTION --- */}
//       {showModal && (
//         <>
//           <div
//             className="modal-backdrop fade show"
//             style={{ zIndex: 1040 }}
//             onClick={() => setShowModal(false)}
//           ></div>

//           <div
//             className="modal show d-block animate-fade-in"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//           >
//             <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
//               <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//                 <div className="modal-header bg-light border-0 p-4 pb-3">
//                   <h5 className="modal-title fw-bolder text-dark d-flex align-items-center gap-2">
//                     <Stethoscope className="text-primary" size={20} />
//                     {isEditing
//                       ? "Update Specialist Info"
//                       : "New Doctor Registration"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close shadow-none bg-secondary bg-opacity-10 rounded-circle p-2"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <form
//                   onSubmit={handleSubmit}
//                   className="d-flex flex-column overflow-hidden"
//                 >
//                   <div className="modal-body p-4 pt-3 overflow-auto custom-scrollbar">
//                     <div className="row g-4">
//                       {/* Name */}
//                       <div className="col-md-6">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           Full Name *
//                         </label>
//                         <div className="position-relative">
//                           <User
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={formData.name}
//                             onChange={(e) =>
//                               setFormData({ ...formData, name: e.target.value })
//                             }
//                             required
//                             placeholder="Dr. John Doe"
//                           />
//                         </div>
//                       </div>

//                       {/* Speciality */}
//                       <div className="col-md-6">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           Speciality *
//                         </label>
//                         <div className="position-relative">
//                           <Stethoscope
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={formData.speciality}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 speciality: e.target.value,
//                               })
//                             }
//                             required
//                             placeholder="e.g. Cardiologist"
//                           />
//                         </div>
//                       </div>

//                       {/* NMC Number */}
//                       <div className="col-md-6">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           NMC Registration *
//                         </label>
//                         <div className="position-relative">
//                           <FileText
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={formData.nmcNumber}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 nmcNumber: e.target.value,
//                               })
//                             }
//                             required
//                             placeholder="NMC-XXXX"
//                           />
//                         </div>
//                       </div>

//                       {/* Phone */}
//                       <div className="col-md-6">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           Contact Number *
//                         </label>
//                         <div className="position-relative">
//                           <Phone
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={formData.phone}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 phone: e.target.value,
//                               })
//                             }
//                             required
//                             placeholder="98XXXXXXXX"
//                           />
//                         </div>
//                       </div>

//                       {/* Experience */}
//                       <div className="col-md-4">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           Experience (Yrs)
//                         </label>
//                         <div className="position-relative">
//                           <Briefcase
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="number"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={formData.experience}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 experience: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       {/* Consultation Fee */}
//                       <div className="col-md-4">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           Fee (NPR)
//                         </label>
//                         <div className="position-relative">
//                           <DollarSign
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="number"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={formData.consultationFee}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 consultationFee: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       {/* System Status */}
//                       <div className="col-md-4">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           System Status
//                         </label>
//                         <div className="position-relative">
//                           <Activity
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <select
//                             className="form-select modern-input ps-5 border-light-subtle"
//                             value={formData.isAvailable}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 isAvailable: e.target.value === "true",
//                               })
//                             }
//                           >
//                             <option value="true">Available</option>
//                             <option value="false">Unavailable</option>
//                           </select>
//                         </div>
//                       </div>

//                       {/* Email Address */}
//                       <div className="col-md-12">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           Email Address
//                         </label>
//                         <div className="position-relative">
//                           <Mail
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="email"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={formData.email}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 email: e.target.value,
//                               })
//                             }
//                             placeholder="doctor@hospital.com"
//                           />
//                         </div>
//                       </div>

//                       {/* Weekly Schedule Component */}
//                       <div className="col-12 mt-4">
//                         <div className="d-flex justify-content-between align-items-center mb-3">
//                           <label className="form-label small fw-bold text-primary mb-0 d-flex align-items-center gap-2">
//                             <Clock size={16} /> Weekly Schedule
//                           </label>
//                           <button
//                             type="button"
//                             className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold hover-lift"
//                             onClick={addSlot}
//                           >
//                             <Plus size={14} className="me-1" /> Add Shift
//                           </button>
//                         </div>

//                         <div className="p-3 bg-primary bg-opacity-10 rounded-4 border border-primary border-opacity-10">
//                           {formData.slots.length === 0 ? (
//                             <div className="text-center py-4 text-muted small fw-medium">
//                               No working shifts added yet. Click "Add Shift" to
//                               assign hours.
//                             </div>
//                           ) : (
//                             formData.slots.map((slot, index) => (
//                               <div
//                                 key={index}
//                                 className="row g-2 mb-2 align-items-center bg-white p-2 rounded-3 shadow-sm border border-light"
//                               >
//                                 <div className="col-md-4">
//                                   <select
//                                     className="form-select form-select-sm modern-input border-light-subtle"
//                                     value={slot.day}
//                                     onChange={(e) =>
//                                       updateSlot(index, "day", e.target.value)
//                                     }
//                                   >
//                                     {[
//                                       "MONDAY",
//                                       "TUESDAY",
//                                       "WEDNESDAY",
//                                       "THURSDAY",
//                                       "FRIDAY",
//                                       "SATURDAY",
//                                       "SUNDAY",
//                                     ].map((d) => (
//                                       <option key={d} value={d}>
//                                         {d}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </div>
//                                 <div className="col-md-3">
//                                   <input
//                                     type="time"
//                                     className="form-control form-control-sm modern-input border-light-subtle text-center"
//                                     value={slot.startTime}
//                                     onChange={(e) =>
//                                       updateSlot(
//                                         index,
//                                         "startTime",
//                                         e.target.value,
//                                       )
//                                     }
//                                     required
//                                   />
//                                 </div>
//                                 <div className="col-auto text-muted fw-bold">
//                                   to
//                                 </div>
//                                 <div className="col-md-3">
//                                   <input
//                                     type="time"
//                                     className="form-control form-control-sm modern-input border-light-subtle text-center"
//                                     value={slot.endTime}
//                                     onChange={(e) =>
//                                       updateSlot(
//                                         index,
//                                         "endTime",
//                                         e.target.value,
//                                       )
//                                     }
//                                     required
//                                   />
//                                 </div>
//                                 <div className="col text-end">
//                                   <button
//                                     type="button"
//                                     className="btn btn-sm text-danger hover-lift"
//                                     onClick={() => removeSlot(index)}
//                                     title="Remove Shift"
//                                   >
//                                     <Trash2 size={16} />
//                                   </button>
//                                 </div>
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Footer Buttons */}
//                   <div className="modal-footer bg-light border-0 p-3 mt-auto">
//                     <button
//                       type="button"
//                       className="btn btn-light rounded-pill px-4 fw-medium border hover-lift"
//                       onClick={() => setShowModal(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold hover-lift d-flex align-items-center gap-2"
//                       disabled={saving}
//                     >
//                       {saving ? (
//                         <>
//                           <Loader2 size={18} className="spin-animation" />{" "}
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <Save size={18} />{" "}
//                           {isEditing ? "Save Changes" : "Register Doctor"}
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminDoctors;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Stethoscope,
//   Plus,
//   Edit,
//   Trash2,
//   Clock,
//   Save,
//   AlertCircle,
//   Mail,
//   Phone,
//   Briefcase,
//   DollarSign,
//   Loader2,
//   User,
//   FileText,
//   Activity,
//   CheckCircle,
//   Camera,
// } from "lucide-react";

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentDoctorId, setCurrentDoctorId] = useState(null);

//   // ✅ Image Upload State
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     email: "",
//     phone: "",
//     experience: 0,
//     consultationFee: 500,
//     slots: [],
//     isAvailable: true,
//   });

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/admin/doctors");
//       const data = res.data?.doctors || res.data || [];
//       setDoctors(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Failed to load doctor records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const getDoctorImage = (doctor) => {
//     // ✅ Added a check to ignore the missing "sample-doctor.jpg" file
//     if (
//       doctor?.image &&
//       doctor.image !== "none" &&
//       !doctor.image.includes("sample-doctor.jpg")
//     ) {
//       if (doctor.image.startsWith("http")) return doctor.image;

//       let cleanPath = doctor.image.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) {
//         cleanPath = "/" + cleanPath;
//       }

//       return `http://localhost:5000${cleanPath}`;
//     }

//     // Fallback: Professional Name Initials
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || "Doctor")}&background=eff6ff&color=2563eb&size=150&font-size=0.33`;
//   };
//   const handleEdit = (doctor) => {
//     setError("");
//     setIsEditing(true);
//     setCurrentDoctorId(doctor._id);
//     setFormData({
//       name: doctor.name || "",
//       speciality: doctor.speciality || "",
//       nmcNumber: doctor.nmcNumber || "",
//       email: doctor.email || "",
//       phone: doctor.phone || "",
//       experience: doctor.experience || 0,
//       consultationFee: doctor.consultationFee || 500,
//       slots: doctor.slots || [],
//       isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
//     });

//     // Set existing image preview if available
//     setImagePreview(doctor.image ? getDoctorImage(doctor) : null);
//     setImageFile(null);

//     setShowModal(true);
//   };

//   // ✅ Handle Image Selection
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const addSlot = () => {
//     setFormData({
//       ...formData,
//       slots: [
//         ...formData.slots,
//         { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
//       ],
//     });
//   };

//   const removeSlot = (index) => {
//     const newSlots = formData.slots.filter((_, i) => i !== index);
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...formData.slots];
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       setError("");

//       // ✅ Use FormData to support image uploads
//       const submitData = new FormData();
//       submitData.append("name", formData.name);
//       submitData.append("speciality", formData.speciality);
//       submitData.append("nmcNumber", formData.nmcNumber);
//       submitData.append("email", formData.email);
//       submitData.append("phone", formData.phone);
//       submitData.append("experience", formData.experience);
//       submitData.append("consultationFee", formData.consultationFee);
//       submitData.append("isAvailable", formData.isAvailable);

//       // Arrays must be stringified when sent via FormData
//       submitData.append("slots", JSON.stringify(formData.slots));

//       if (imageFile) {
//         submitData.append("image", imageFile);
//       }

//       if (isEditing) {
//         await api.put(`/admin/doctors/${currentDoctorId}`, submitData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         setSuccess("Doctor profile updated successfully!");
//       } else {
//         await api.post("/admin/doctors", submitData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         setSuccess("Doctor registered successfully!");
//       }

//       setShowModal(false);
//       resetForm();
//       fetchDoctors();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save record.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (
//       window.confirm(
//         `Delete Dr. ${name}? This will remove them from the booking system.`,
//       )
//     ) {
//       try {
//         await api.delete(`/admin/doctors/${id}`);
//         fetchDoctors();
//       } catch (err) {
//         alert(err.response?.data?.message || "Delete failed.");
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       speciality: "",
//       nmcNumber: "",
//       email: "",
//       phone: "",
//       experience: 0,
//       consultationFee: 500,
//       slots: [],
//       isAvailable: true,
//     });
//     setImageFile(null);
//     setImagePreview(null);
//     setIsEditing(false);
//     setCurrentDoctorId(null);
//   };

//   if (loading && doctors.length === 0) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary mb-3" size={48} />
//         <span className="fw-bold text-secondary tracking-wider text-uppercase small">
//           Loading Specialist Data...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
//       {/* --- HEADER SECTION --- */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
//         <div className="d-flex align-items-center gap-3">
//           <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle shadow-sm">
//             <Stethoscope size={28} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="fw-black mb-1 text-dark tracking-tight">
//               Doctors Management
//             </h3>
//             <p className="text-muted fw-medium mb-0 small">
//               Total Specialists Active:{" "}
//               <span className="fw-bold text-primary">{doctors.length}</span>
//             </p>
//           </div>
//         </div>
//         <button
//           className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift d-flex align-items-center"
//           onClick={() => {
//             resetForm();
//             setShowModal(true);
//           }}
//         >
//           <Plus size={18} className="me-2" /> Add Specialist
//         </button>
//       </div>

//       {/* --- ALERTS --- */}
//       {success && (
//         <div className="alert alert-success d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold animate-fade-in">
//           <CheckCircle size={20} /> {success}
//         </div>
//       )}
//       {error && (
//         <div className="alert alert-danger d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold animate-fade-in">
//           <AlertCircle size={20} /> {error}
//         </div>
//       )}

//       {/* --- MAIN TABLE CARD --- */}
//       <div className="card-modern mb-4 bg-white">
//         <div className="table-responsive custom-scrollbar">
//           <table className="table table-hover align-middle mb-0 custom-saas-table">
//             <thead>
//               <tr>
//                 <th className="ps-4">Specialist Profile</th>
//                 <th>Credentials</th>
//                 <th>Contact</th>
//                 <th>Schedule Overview</th>
//                 <th className="text-end pe-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-5 text-muted">
//                     <div className="d-flex flex-column align-items-center justify-content-center">
//                       <div className="bg-secondary bg-opacity-10 p-4 rounded-circle mb-3">
//                         <Stethoscope
//                           size={40}
//                           className="text-secondary opacity-50"
//                         />
//                       </div>
//                       <h5 className="fw-bolder text-dark mb-1">
//                         No Doctors Found
//                       </h5>
//                       <p className="fw-medium mb-0 small">
//                         Register a new specialist to see them here.
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 doctors.map((doc) => (
//                   <tr
//                     key={doc._id}
//                     className="transition-all hover-bg-light border-bottom border-light"
//                   >
//                     <td className="ps-4 py-3">
//                       <div className="d-flex align-items-center gap-3">
//                         {/* Avatar Image */}
//                         <img
//                           src={getDoctorImage(doc)}
//                           alt={doc.name}
//                           className="rounded-circle object-fit-cover shadow-sm border border-light-subtle"
//                           style={{ width: "48px", height: "48px" }}
//                         />
//                         <div>
//                           <div className="fw-bolder text-dark mb-1 fs-6">
//                             {doc.name}
//                           </div>
//                           <div className="d-flex align-items-center gap-2">
//                             <span
//                               className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 shadow-sm"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               {doc.speciality}
//                             </span>
//                             {!doc.isAvailable && (
//                               <span
//                                 className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1 shadow-sm"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Unavailable
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark d-flex align-items-center gap-1 fw-medium mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Briefcase size={14} className="text-muted" />{" "}
//                         {doc.experience} Yrs Experience
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-1 mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <DollarSign size={14} className="text-success" /> Fee:
//                         NPR {doc.consultationFee}
//                       </div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         <span className="fw-bold">NMC:</span>{" "}
//                         <span className="font-monospace">{doc.nmcNumber}</span>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark fw-medium d-flex align-items-center gap-2 mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Phone size={14} className="text-muted" />{" "}
//                         {doc.phone || "N/A"}
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-2"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Mail size={14} /> {doc.email || "N/A"}
//                       </div>
//                     </td>
//                     <td>
//                       {doc.slots && doc.slots.length > 0 ? (
//                         <div className="d-flex flex-column gap-1">
//                           {doc.slots.slice(0, 2).map((s, i) => (
//                             <div
//                               key={i}
//                               className="text-muted d-flex align-items-center gap-2"
//                               style={{ fontSize: "0.8rem" }}
//                             >
//                               <Clock size={12} className="text-primary" />
//                               <span
//                                 className="fw-bold text-dark"
//                                 style={{ width: "35px" }}
//                               >
//                                 {s.day ? s.day.slice(0, 3) : "UNK"}
//                               </span>
//                               <span>
//                                 {s.startTime} - {s.endTime}
//                               </span>
//                             </div>
//                           ))}
//                           {doc.slots.length > 2 && (
//                             <div
//                               className="text-primary small fw-bold"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               +{doc.slots.length - 2} more shifts
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">
//                           No Schedule Set
//                         </span>
//                       )}
//                     </td>
//                     <td className="pe-4 text-end">
//                       <button
//                         className="btn btn-sm btn-light text-primary rounded-circle p-2 mx-1 hover-lift shadow-sm border"
//                         onClick={() => handleEdit(doc)}
//                         title="Edit Doctor"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         className="btn btn-sm btn-light text-danger rounded-circle p-2 mx-1 hover-lift shadow-sm border"
//                         onClick={() => handleDelete(doc._id, doc.name)}
//                         title="Delete Doctor"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- MODAL SECTION --- */}
//       {showModal && (
//         <>
//           <div
//             className="modal-backdrop fade show"
//             style={{ zIndex: 1040 }}
//             onClick={() => setShowModal(false)}
//           ></div>
//           <div
//             className="modal show d-block animate-fade-in"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//           >
//             <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
//               <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//                 <div className="modal-header bg-light border-bottom border-light-subtle p-4 pb-3">
//                   <h5 className="modal-title fw-black text-dark d-flex align-items-center gap-2">
//                     <Stethoscope className="text-primary" size={20} />
//                     {isEditing
//                       ? "Update Specialist Profile"
//                       : "Register New Specialist"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close shadow-none bg-secondary bg-opacity-10 rounded-circle p-2"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <form
//                   onSubmit={handleSubmit}
//                   className="d-flex flex-column overflow-hidden"
//                 >
//                   <div className="modal-body p-4 pt-4 overflow-auto custom-scrollbar">
//                     {/* ✅ Image Uploader Section */}
//                     <div className="d-flex flex-column align-items-center justify-content-center mb-4 pb-3 border-bottom border-light-subtle">
//                       <div className="position-relative">
//                         <img
//                           src={
//                             imagePreview ||
//                             getDoctorImage({ name: formData.name })
//                           }
//                           alt="Doctor Preview"
//                           className="rounded-circle object-fit-cover shadow-sm border border-2 border-white"
//                           style={{ width: "100px", height: "100px" }}
//                         />
//                         <label
//                           htmlFor="doctor-image-upload"
//                           className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow cursor-pointer hover-lift border border-2 border-white d-flex align-items-center justify-content-center"
//                         >
//                           <Camera size={16} />
//                         </label>
//                         <input
//                           id="doctor-image-upload"
//                           type="file"
//                           className="d-none"
//                           accept="image/*"
//                           onChange={handleImageChange}
//                         />
//                       </div>
//                       <span className="text-muted small mt-2 fw-medium">
//                         Upload Profile Photo (Optional)
//                       </span>
//                     </div>

//                     <div className="row g-4">
//                       {/* Name */}
//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Full Name *
//                         </label>
//                         <div className="position-relative">
//                           <User
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.name}
//                             onChange={(e) =>
//                               setFormData({ ...formData, name: e.target.value })
//                             }
//                             required
//                             placeholder="Dr. Jane Doe"
//                           />
//                         </div>
//                       </div>

//                       {/* Speciality */}
//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Speciality *
//                         </label>
//                         <div className="position-relative">
//                           <Stethoscope
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.speciality}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 speciality: e.target.value,
//                               })
//                             }
//                             required
//                             placeholder="e.g. Cardiologist"
//                           />
//                         </div>
//                       </div>

//                       {/* NMC Number */}
//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           NMC Registration *
//                         </label>
//                         <div className="position-relative">
//                           <FileText
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.nmcNumber}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 nmcNumber: e.target.value,
//                               })
//                             }
//                             required
//                             placeholder="NMC-XXXX"
//                           />
//                         </div>
//                       </div>

//                       {/* Phone */}
//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Contact Number *
//                         </label>
//                         <div className="position-relative">
//                           <Phone
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.phone}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 phone: e.target.value,
//                               })
//                             }
//                             required
//                             placeholder="98XXXXXXXX"
//                           />
//                         </div>
//                       </div>

//                       {/* Experience */}
//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Experience (Yrs)
//                         </label>
//                         <div className="position-relative">
//                           <Briefcase
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="number"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.experience}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 experience: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       {/* Consultation Fee */}
//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Fee (NPR)
//                         </label>
//                         <div className="position-relative">
//                           <DollarSign
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-success"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="number"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.consultationFee}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 consultationFee: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       {/* System Status */}
//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Status
//                         </label>
//                         <div className="position-relative">
//                           <Activity
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <select
//                             className="form-select modern-input ps-5 border-light-subtle shadow-sm cursor-pointer fw-medium"
//                             value={formData.isAvailable}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 isAvailable: e.target.value === "true",
//                               })
//                             }
//                           >
//                             <option value="true" className="text-success">
//                               Available
//                             </option>
//                             <option value="false" className="text-danger">
//                               Unavailable
//                             </option>
//                           </select>
//                         </div>
//                       </div>

//                       {/* Email Address */}
//                       <div className="col-md-12">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Email Address
//                         </label>
//                         <div className="position-relative">
//                           <Mail
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="email"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.email}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 email: e.target.value,
//                               })
//                             }
//                             placeholder="doctor@hospital.com"
//                           />
//                         </div>
//                       </div>

//                       {/* Weekly Schedule Component */}
//                       <div className="col-12 mt-4 border-top border-light-subtle pt-4">
//                         <div className="d-flex justify-content-between align-items-center mb-3">
//                           <label className="form-label fw-bold text-dark mb-0 d-flex align-items-center gap-2">
//                             <Clock size={18} className="text-primary" /> Weekly
//                             Shift Schedule
//                           </label>
//                           <button
//                             type="button"
//                             className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold hover-lift d-flex align-items-center gap-1 shadow-sm"
//                             onClick={addSlot}
//                           >
//                             <Plus size={14} /> Add Shift
//                           </button>
//                         </div>

//                         <div className="p-3 bg-light bg-opacity-50 rounded-4 border border-light-subtle">
//                           {formData.slots.length === 0 ? (
//                             <div className="text-center py-4 text-muted small fw-medium">
//                               No working shifts added yet. Click "Add Shift" to
//                               assign hours.
//                             </div>
//                           ) : (
//                             formData.slots.map((slot, index) => (
//                               <div
//                                 key={index}
//                                 className="row g-2 mb-2 align-items-center bg-white p-2 rounded-3 shadow-sm border border-light-subtle"
//                               >
//                                 <div className="col-md-4">
//                                   <select
//                                     className="form-select form-select-sm modern-input border-light-subtle fw-medium text-dark cursor-pointer"
//                                     value={slot.day}
//                                     onChange={(e) =>
//                                       updateSlot(index, "day", e.target.value)
//                                     }
//                                   >
//                                     {[
//                                       "MONDAY",
//                                       "TUESDAY",
//                                       "WEDNESDAY",
//                                       "THURSDAY",
//                                       "FRIDAY",
//                                       "SATURDAY",
//                                       "SUNDAY",
//                                     ].map((d) => (
//                                       <option key={d} value={d}>
//                                         {d}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </div>
//                                 <div className="col-md-3">
//                                   <input
//                                     type="time"
//                                     className="form-control form-control-sm modern-input border-light-subtle text-center fw-medium"
//                                     value={slot.startTime}
//                                     onChange={(e) =>
//                                       updateSlot(
//                                         index,
//                                         "startTime",
//                                         e.target.value,
//                                       )
//                                     }
//                                     required
//                                   />
//                                 </div>
//                                 <div className="col-auto text-muted fw-bold small">
//                                   to
//                                 </div>
//                                 <div className="col-md-3">
//                                   <input
//                                     type="time"
//                                     className="form-control form-control-sm modern-input border-light-subtle text-center fw-medium"
//                                     value={slot.endTime}
//                                     onChange={(e) =>
//                                       updateSlot(
//                                         index,
//                                         "endTime",
//                                         e.target.value,
//                                       )
//                                     }
//                                     required
//                                   />
//                                 </div>
//                                 <div className="col text-end">
//                                   <button
//                                     type="button"
//                                     className="btn btn-sm btn-light text-danger rounded-circle p-2 hover-lift border shadow-sm"
//                                     onClick={() => removeSlot(index)}
//                                     title="Remove Shift"
//                                   >
//                                     <Trash2 size={14} />
//                                   </button>
//                                 </div>
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Footer Buttons */}
//                   <div className="modal-footer bg-light border-top border-light-subtle p-3">
//                     <button
//                       type="button"
//                       className="btn btn-white rounded-pill px-4 fw-bold border shadow-sm hover-lift text-secondary"
//                       onClick={() => setShowModal(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold hover-lift d-flex align-items-center gap-2"
//                       disabled={saving}
//                     >
//                       {saving ? (
//                         <>
//                           <Loader2 size={18} className="spin-animation" />{" "}
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <Save size={18} />{" "}
//                           {isEditing ? "Save Changes" : "Register Doctor"}
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminDoctors;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Stethoscope,
//   Plus,
//   Edit,
//   Trash2,
//   Clock,
//   Save,
//   AlertCircle,
//   Mail,
//   Phone,
//   Briefcase,
//   DollarSign,
//   Loader2,
//   User,
//   FileText,
//   Activity,
//   CheckCircle,
//   Camera,
//   ShieldCheck,
// } from "lucide-react";

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentDoctorId, setCurrentDoctorId] = useState(null);

//   // ✅ Image Upload State
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   // ✅ OTP States for Registration
//   const [otpStep, setOtpStep] = useState(false);
//   const [otp, setOtp] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     email: "",
//     phone: "",
//     experience: 0,
//     consultationFee: 500,
//     slots: [],
//     isAvailable: true,
//   });

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/admin/doctors");
//       const data = res.data?.doctors || res.data || [];
//       setDoctors(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Failed to load doctor records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const getDoctorImage = (doctor) => {
//     if (
//       doctor?.image &&
//       doctor.image !== "none" &&
//       !doctor.image.includes("sample-doctor.jpg")
//     ) {
//       if (doctor.image.startsWith("http")) return doctor.image;
//       let cleanPath = doctor.image.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
//       return `http://localhost:5000${cleanPath}`;
//     }
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || "Doctor")}&background=eff6ff&color=2563eb&size=150&font-size=0.33`;
//   };

//   const handleEdit = (doctor) => {
//     setError("");
//     setIsEditing(true);
//     setOtpStep(false); // Reset OTP step just in case
//     setCurrentDoctorId(doctor._id);
//     setFormData({
//       name: doctor.name || "",
//       speciality: doctor.speciality || "",
//       nmcNumber: doctor.nmcNumber || "",
//       email: doctor.email || "",
//       phone: doctor.phone || "",
//       experience: doctor.experience || 0,
//       consultationFee: doctor.consultationFee || 500,
//       slots: doctor.slots || [],
//       isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
//     });

//     setImagePreview(doctor.image ? getDoctorImage(doctor) : null);
//     setImageFile(null);
//     setShowModal(true);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const addSlot = () => {
//     setFormData({
//       ...formData,
//       slots: [
//         ...formData.slots,
//         { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
//       ],
//     });
//   };

//   const removeSlot = (index) => {
//     const newSlots = formData.slots.filter((_, i) => i !== index);
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...formData.slots];
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setFormData({ ...formData, slots: newSlots });
//   };

//   // ✅ HANDLES BOTH REQUESTING OTP AND FINAL SUBMISSION
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     // --- SCENARIO 1: EDITING AN EXISTING DOCTOR (No OTP required) ---
//     if (isEditing) {
//       try {
//         setSaving(true);
//         const submitData = new FormData();
//         Object.keys(formData).forEach((key) => {
//           if (key === "slots")
//             submitData.append("slots", JSON.stringify(formData.slots));
//           else submitData.append(key, formData[key]);
//         });
//         if (imageFile) submitData.append("image", imageFile);

//         await api.put(`/admin/doctors/${currentDoctorId}`, submitData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });

//         setSuccess("Doctor profile updated successfully!");
//         finalizeSuccess();
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to update record.");
//       } finally {
//         setSaving(false);
//       }
//       return;
//     }

//     // --- SCENARIO 2: CREATING A DOCTOR -> STEP 1 (Request OTP) ---
//     if (!isEditing && !otpStep) {
//       try {
//         setSaving(true);
//         await api.post("/admin/request-doctor-otp", {
//           name: formData.name,
//           email: formData.email,
//         });
//         setOtpStep(true); // Move to OTP UI
//         setSuccess("OTP sent to doctor's email!");
//         setTimeout(() => setSuccess(""), 3000);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to send OTP.");
//       } finally {
//         setSaving(false);
//       }
//       return;
//     }

//     // --- SCENARIO 3: CREATING A DOCTOR -> STEP 2 (Verify OTP & Save Data) ---
//     if (!isEditing && otpStep) {
//       if (otp.length < 6) {
//         setError("Please enter a valid 6-digit OTP.");
//         return;
//       }
//       try {
//         setSaving(true);
//         const submitData = new FormData();
//         Object.keys(formData).forEach((key) => {
//           if (key === "slots")
//             submitData.append("slots", JSON.stringify(formData.slots));
//           else submitData.append(key, formData[key]);
//         });
//         if (imageFile) submitData.append("image", imageFile);
//         submitData.append("otp", otp); // ✅ Append OTP to FormData

//         // Submit to the verify route
//         await api.post("/admin/verify-create-doctor", submitData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });

//         setSuccess(
//           "Doctor registered successfully! Temporary password emailed.",
//         );
//         finalizeSuccess();
//       } catch (err) {
//         setError(
//           err.response?.data?.message || "Invalid OTP or creation failed.",
//         );
//       } finally {
//         setSaving(false);
//       }
//     }
//   };

//   const finalizeSuccess = () => {
//     setShowModal(false);
//     resetForm();
//     fetchDoctors();
//     setTimeout(() => setSuccess(""), 4000);
//   };

//   const handleDelete = async (id, name) => {
//     if (
//       window.confirm(
//         `Delete Dr. ${name}? This will remove them from the booking system.`,
//       )
//     ) {
//       try {
//         await api.delete(`/admin/doctors/${id}`);
//         fetchDoctors();
//       } catch (err) {
//         alert(err.response?.data?.message || "Delete failed.");
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       speciality: "",
//       nmcNumber: "",
//       email: "",
//       phone: "",
//       experience: 0,
//       consultationFee: 500,
//       slots: [],
//       isAvailable: true,
//     });
//     setImageFile(null);
//     setImagePreview(null);
//     setIsEditing(false);
//     setCurrentDoctorId(null);
//     setOtpStep(false);
//     setOtp("");
//   };

//   if (loading && doctors.length === 0) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary mb-3" size={48} />
//         <span className="fw-bold text-secondary tracking-wider text-uppercase small">
//           Loading Specialist Data...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
//       {/* --- HEADER SECTION --- */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
//         <div className="d-flex align-items-center gap-3">
//           <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle shadow-sm">
//             <Stethoscope size={28} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="fw-black mb-1 text-dark tracking-tight">
//               Doctors Management
//             </h3>
//             <p className="text-muted fw-medium mb-0 small">
//               Total Specialists Active:{" "}
//               <span className="fw-bold text-primary">{doctors.length}</span>
//             </p>
//           </div>
//         </div>
//         <button
//           className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift d-flex align-items-center"
//           onClick={() => {
//             resetForm();
//             setShowModal(true);
//           }}
//         >
//           <Plus size={18} className="me-2" /> Add Specialist
//         </button>
//       </div>

//       {/* --- ALERTS --- */}
//       {success && (
//         <div className="alert alert-success d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold animate-fade-in">
//           <CheckCircle size={20} /> {success}
//         </div>
//       )}

//       {/* --- MAIN TABLE CARD --- */}
//       <div className="card-modern mb-4 bg-white shadow-sm rounded-4 border border-light-subtle overflow-hidden">
//         <div className="table-responsive custom-scrollbar">
//           <table className="table table-hover align-middle mb-0 custom-saas-table">
//             <thead className="bg-light">
//               <tr>
//                 <th className="ps-4 text-uppercase small fw-bold text-muted py-3">
//                   Specialist Profile
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Credentials
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Contact
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Schedule Overview
//                 </th>
//                 <th className="text-end pe-4 text-uppercase small fw-bold text-muted py-3">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-5 text-muted">
//                     <div className="d-flex flex-column align-items-center justify-content-center">
//                       <div className="bg-secondary bg-opacity-10 p-4 rounded-circle mb-3">
//                         <Stethoscope
//                           size={40}
//                           className="text-secondary opacity-50"
//                         />
//                       </div>
//                       <h5 className="fw-bolder text-dark mb-1">
//                         No Doctors Found
//                       </h5>
//                       <p className="fw-medium mb-0 small">
//                         Register a new specialist to see them here.
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 doctors.map((doc) => (
//                   <tr
//                     key={doc._id}
//                     className="transition-all hover-bg-light border-bottom border-light"
//                   >
//                     <td className="ps-4 py-3">
//                       <div className="d-flex align-items-center gap-3">
//                         <img
//                           src={getDoctorImage(doc)}
//                           alt={doc.name}
//                           className="rounded-circle object-fit-cover shadow-sm border border-light-subtle"
//                           style={{ width: "48px", height: "48px" }}
//                         />
//                         <div>
//                           <div className="fw-bolder text-dark mb-1 fs-6">
//                             {doc.name}
//                           </div>
//                           <div className="d-flex align-items-center gap-2">
//                             <span
//                               className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 shadow-sm"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               {doc.speciality}
//                             </span>
//                             {!doc.isAvailable && (
//                               <span
//                                 className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1 shadow-sm"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Unavailable
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark d-flex align-items-center gap-1 fw-medium mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Briefcase size={14} className="text-muted" />{" "}
//                         {doc.experience} Yrs Experience
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-1 mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <DollarSign size={14} className="text-success" /> Fee:
//                         NPR {doc.consultationFee}
//                       </div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         <span className="fw-bold">NMC:</span>{" "}
//                         <span className="font-monospace">{doc.nmcNumber}</span>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark fw-medium d-flex align-items-center gap-2 mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Phone size={14} className="text-muted" />{" "}
//                         {doc.phone || "N/A"}
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-2"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Mail size={14} /> {doc.email || "N/A"}
//                       </div>
//                     </td>
//                     <td>
//                       {doc.slots && doc.slots.length > 0 ? (
//                         <div className="d-flex flex-column gap-1">
//                           {doc.slots.slice(0, 2).map((s, i) => (
//                             <div
//                               key={i}
//                               className="text-muted d-flex align-items-center gap-2"
//                               style={{ fontSize: "0.8rem" }}
//                             >
//                               <Clock size={12} className="text-primary" />
//                               <span
//                                 className="fw-bold text-dark"
//                                 style={{ width: "35px" }}
//                               >
//                                 {s.day ? s.day.slice(0, 3) : "UNK"}
//                               </span>
//                               <span>
//                                 {s.startTime} - {s.endTime}
//                               </span>
//                             </div>
//                           ))}
//                           {doc.slots.length > 2 && (
//                             <div
//                               className="text-primary small fw-bold"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               +{doc.slots.length - 2} more shifts
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">
//                           No Schedule Set
//                         </span>
//                       )}
//                     </td>
//                     <td className="pe-4 text-end">
//                       <button
//                         className="btn btn-sm btn-light text-primary rounded-circle p-2 mx-1 hover-lift shadow-sm border"
//                         onClick={() => handleEdit(doc)}
//                         title="Edit Doctor"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         className="btn btn-sm btn-light text-danger rounded-circle p-2 mx-1 hover-lift shadow-sm border"
//                         onClick={() => handleDelete(doc._id, doc.name)}
//                         title="Delete Doctor"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- MODAL SECTION --- */}
//       {showModal && (
//         <>
//           <div
//             className="modal-backdrop fade show"
//             style={{ zIndex: 1040 }}
//             onClick={() => setShowModal(false)}
//           ></div>
//           <div
//             className="modal show d-block animate-fade-in"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//           >
//             <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
//               <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//                 <div className="modal-header bg-light border-bottom border-light-subtle p-4 pb-3">
//                   <h5 className="modal-title fw-black text-dark d-flex align-items-center gap-2">
//                     <Stethoscope className="text-primary" size={20} />
//                     {isEditing
//                       ? "Update Specialist Profile"
//                       : otpStep
//                         ? "Verify Email OTP"
//                         : "Register New Specialist"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close shadow-none bg-secondary bg-opacity-10 rounded-circle p-2"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <form
//                   onSubmit={handleSubmit}
//                   className="d-flex flex-column overflow-hidden"
//                 >
//                   <div className="modal-body p-4 pt-4 overflow-auto custom-scrollbar">
//                     {error && (
//                       <div className="alert alert-danger py-2 small fw-bold mb-4">
//                         {error}
//                       </div>
//                     )}

//                     {/* ✅ IF OTP STEP IS ACTIVE, SHOW ONLY OTP INPUT */}
//                     {otpStep && !isEditing ? (
//                       <div className="text-center py-4">
//                         <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle d-inline-flex mb-3 shadow-sm border border-warning border-opacity-25">
//                           <ShieldCheck size={36} />
//                         </div>
//                         <h4 className="fw-black text-dark mb-2">
//                           Verification Required
//                         </h4>
//                         <p className="text-muted fw-medium px-4 mb-4">
//                           We sent a 6-digit verification code to{" "}
//                           <strong>{formData.email}</strong>. Please enter it
//                           below to complete registration.
//                         </p>
//                         <input
//                           type="text"
//                           className="form-control form-control-lg bg-light text-center fw-black tracking-widest fs-3 mx-auto shadow-sm"
//                           style={{ maxWidth: "250px", letterSpacing: "0.25em" }}
//                           maxLength="6"
//                           placeholder="------"
//                           value={otp}
//                           onChange={(e) => setOtp(e.target.value)}
//                           required
//                           autoFocus
//                         />
//                       </div>
//                     ) : (
//                       /* ✅ OTHERWISE, SHOW THE FULL PROFILE FORM */
//                       <>
//                         {/* Image Uploader Section */}
//                         <div className="d-flex flex-column align-items-center justify-content-center mb-4 pb-3 border-bottom border-light-subtle">
//                           <div className="position-relative">
//                             <img
//                               src={
//                                 imagePreview ||
//                                 getDoctorImage({ name: formData.name })
//                               }
//                               alt="Doctor Preview"
//                               className="rounded-circle object-fit-cover shadow-sm border border-2 border-white"
//                               style={{ width: "100px", height: "100px" }}
//                             />
//                             <label
//                               htmlFor="doctor-image-upload"
//                               className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow cursor-pointer hover-lift border border-2 border-white d-flex align-items-center justify-content-center"
//                             >
//                               <Camera size={16} />
//                             </label>
//                             <input
//                               id="doctor-image-upload"
//                               type="file"
//                               className="d-none"
//                               accept="image/*"
//                               onChange={handleImageChange}
//                             />
//                           </div>
//                           <span className="text-muted small mt-2 fw-medium">
//                             Upload Profile Photo (Optional)
//                           </span>
//                         </div>

//                         <div className="row g-4">
//                           <div className="col-md-6">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               Full Name *
//                             </label>
//                             <div className="position-relative">
//                               <User
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-primary"
//                                 style={{ left: "16px" }}
//                               />
//                               <input
//                                 type="text"
//                                 className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                                 value={formData.name}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     name: e.target.value,
//                                   })
//                                 }
//                                 required
//                                 placeholder="Dr. Jane Doe"
//                               />
//                             </div>
//                           </div>

//                           <div className="col-md-6">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               Speciality *
//                             </label>
//                             <div className="position-relative">
//                               <Stethoscope
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-primary"
//                                 style={{ left: "16px" }}
//                               />
//                               <input
//                                 type="text"
//                                 className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                                 value={formData.speciality}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     speciality: e.target.value,
//                                   })
//                                 }
//                                 required
//                                 placeholder="e.g. Cardiologist"
//                               />
//                             </div>
//                           </div>

//                           <div className="col-md-6">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               NMC Registration *
//                             </label>
//                             <div className="position-relative">
//                               <FileText
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-primary"
//                                 style={{ left: "16px" }}
//                               />
//                               <input
//                                 type="text"
//                                 className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                                 value={formData.nmcNumber}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     nmcNumber: e.target.value,
//                                   })
//                                 }
//                                 required
//                                 placeholder="NMC-XXXX"
//                               />
//                             </div>
//                           </div>

//                           <div className="col-md-6">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               Contact Number *
//                             </label>
//                             <div className="position-relative">
//                               <Phone
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-primary"
//                                 style={{ left: "16px" }}
//                               />
//                               <input
//                                 type="text"
//                                 className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                                 value={formData.phone}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     phone: e.target.value,
//                                   })
//                                 }
//                                 required
//                                 placeholder="98XXXXXXXX"
//                               />
//                             </div>
//                           </div>

//                           <div className="col-md-4">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               Experience (Yrs)
//                             </label>
//                             <div className="position-relative">
//                               <Briefcase
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-primary"
//                                 style={{ left: "16px" }}
//                               />
//                               <input
//                                 type="number"
//                                 className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                                 value={formData.experience}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     experience: e.target.value,
//                                   })
//                                 }
//                               />
//                             </div>
//                           </div>

//                           <div className="col-md-4">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               Fee (NPR)
//                             </label>
//                             <div className="position-relative">
//                               <DollarSign
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-success"
//                                 style={{ left: "16px" }}
//                               />
//                               <input
//                                 type="number"
//                                 className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                                 value={formData.consultationFee}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     consultationFee: e.target.value,
//                                   })
//                                 }
//                               />
//                             </div>
//                           </div>

//                           <div className="col-md-4">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               Status
//                             </label>
//                             <div className="position-relative">
//                               <Activity
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-primary"
//                                 style={{ left: "16px" }}
//                               />
//                               <select
//                                 className="form-select modern-input ps-5 border-light-subtle shadow-sm cursor-pointer fw-medium"
//                                 value={formData.isAvailable}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     isAvailable: e.target.value === "true",
//                                   })
//                                 }
//                               >
//                                 <option value="true" className="text-success">
//                                   Available
//                                 </option>
//                                 <option value="false" className="text-danger">
//                                   Unavailable
//                                 </option>
//                               </select>
//                             </div>
//                           </div>

//                           <div className="col-md-12">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               Email Address
//                             </label>
//                             <div className="position-relative">
//                               <Mail
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-primary"
//                                 style={{ left: "16px" }}
//                               />
//                               <input
//                                 type="email"
//                                 className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                                 value={formData.email}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     email: e.target.value,
//                                   })
//                                 }
//                                 placeholder="doctor@hospital.com"
//                                 disabled={isEditing}
//                               />
//                             </div>
//                             {!isEditing && (
//                               <small className="text-primary mt-1 d-block fw-medium">
//                                 <Mail size={12} /> An OTP will be sent here upon
//                                 submission.
//                               </small>
//                             )}
//                           </div>

//                           {/* Weekly Schedule */}
//                           <div className="col-12 mt-4 border-top border-light-subtle pt-4">
//                             <div className="d-flex justify-content-between align-items-center mb-3">
//                               <label className="form-label fw-bold text-dark mb-0 d-flex align-items-center gap-2">
//                                 <Clock size={18} className="text-primary" />{" "}
//                                 Weekly Shift Schedule
//                               </label>
//                               <button
//                                 type="button"
//                                 className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold hover-lift d-flex align-items-center gap-1 shadow-sm"
//                                 onClick={addSlot}
//                               >
//                                 <Plus size={14} /> Add Shift
//                               </button>
//                             </div>
//                             <div className="p-3 bg-light bg-opacity-50 rounded-4 border border-light-subtle">
//                               {formData.slots.length === 0 ? (
//                                 <div className="text-center py-4 text-muted small fw-medium">
//                                   No working shifts added yet.
//                                 </div>
//                               ) : (
//                                 formData.slots.map((slot, index) => (
//                                   <div
//                                     key={index}
//                                     className="row g-2 mb-2 align-items-center bg-white p-2 rounded-3 shadow-sm border border-light-subtle"
//                                   >
//                                     <div className="col-md-4">
//                                       <select
//                                         className="form-select form-select-sm modern-input border-light-subtle fw-medium text-dark cursor-pointer"
//                                         value={slot.day}
//                                         onChange={(e) =>
//                                           updateSlot(
//                                             index,
//                                             "day",
//                                             e.target.value,
//                                           )
//                                         }
//                                       >
//                                         {[
//                                           "MONDAY",
//                                           "TUESDAY",
//                                           "WEDNESDAY",
//                                           "THURSDAY",
//                                           "FRIDAY",
//                                           "SATURDAY",
//                                           "SUNDAY",
//                                         ].map((d) => (
//                                           <option key={d} value={d}>
//                                             {d}
//                                           </option>
//                                         ))}
//                                       </select>
//                                     </div>
//                                     <div className="col-md-3">
//                                       <input
//                                         type="time"
//                                         className="form-control form-control-sm modern-input border-light-subtle text-center fw-medium"
//                                         value={slot.startTime}
//                                         onChange={(e) =>
//                                           updateSlot(
//                                             index,
//                                             "startTime",
//                                             e.target.value,
//                                           )
//                                         }
//                                         required
//                                       />
//                                     </div>
//                                     <div className="col-auto text-muted fw-bold small">
//                                       to
//                                     </div>
//                                     <div className="col-md-3">
//                                       <input
//                                         type="time"
//                                         className="form-control form-control-sm modern-input border-light-subtle text-center fw-medium"
//                                         value={slot.endTime}
//                                         onChange={(e) =>
//                                           updateSlot(
//                                             index,
//                                             "endTime",
//                                             e.target.value,
//                                           )
//                                         }
//                                         required
//                                       />
//                                     </div>
//                                     <div className="col text-end">
//                                       <button
//                                         type="button"
//                                         className="btn btn-sm btn-light text-danger rounded-circle p-2 hover-lift border shadow-sm"
//                                         onClick={() => removeSlot(index)}
//                                         title="Remove Shift"
//                                       >
//                                         <Trash2 size={14} />
//                                       </button>
//                                     </div>
//                                   </div>
//                                 ))
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </div>

//                   {/* Footer Buttons */}
//                   <div className="modal-footer bg-light border-top border-light-subtle p-3 d-flex justify-content-between">
//                     {/* Left side button (Back) if in OTP mode */}
//                     {otpStep && !isEditing ? (
//                       <button
//                         type="button"
//                         className="btn btn-light rounded-pill px-4 fw-bold border shadow-sm hover-lift text-dark"
//                         onClick={() => setOtpStep(false)}
//                       >
//                         Back to Form
//                       </button>
//                     ) : (
//                       <div></div> // empty spacer
//                     )}

//                     <div className="d-flex gap-2">
//                       <button
//                         type="button"
//                         className="btn btn-white rounded-pill px-4 fw-bold border shadow-sm hover-lift text-secondary"
//                         onClick={() => setShowModal(false)}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className={`btn ${otpStep ? "btn-success" : "btn-primary"} rounded-pill px-4 shadow-sm fw-bold hover-lift d-flex align-items-center gap-2`}
//                         disabled={saving}
//                       >
//                         {saving ? (
//                           <>
//                             <Loader2 size={18} className="spin-animation" />{" "}
//                             Saving...
//                           </>
//                         ) : isEditing ? (
//                           <>
//                             <Save size={18} /> Save Changes
//                           </>
//                         ) : otpStep ? (
//                           <>
//                             <CheckCircle size={18} /> Verify & Register
//                           </>
//                         ) : (
//                           <>
//                             <Mail size={18} /> Send OTP & Continue
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminDoctors;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Stethoscope,
//   Plus,
//   Edit,
//   Trash2,
//   Clock,
//   Save,
//   AlertCircle,
//   Mail,
//   Phone,
//   Briefcase,
//   DollarSign,
//   Loader2,
//   User,
//   FileText,
//   Activity,
//   CheckCircle,
//   Camera,
//   ShieldCheck,
// } from "lucide-react";

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentDoctorId, setCurrentDoctorId] = useState(null);

//   // ✅ Image Upload State
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   // ✅ OTP States for Registration
//   const [otpStep, setOtpStep] = useState(false);
//   const [otp, setOtp] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     email: "",
//     phone: "",
//     experience: 0,
//     consultationFee: 500,
//     slots: [],
//     isAvailable: true,
//   });

//   // ✅ UPDATED: Fetch from central /users API so doctors created via AdminCreateUser show up instantly
//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/users");
//       const data = res.data?.users || res.data || [];
//       const allUsers = Array.isArray(data) ? data : [];

//       // Filter strictly for doctors
//       const doctorList = allUsers.filter((u) => u.role === "doctor");
//       setDoctors(doctorList);
//     } catch (err) {
//       setError("Failed to load doctor records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   // ✅ UPDATED: Checks for both 'image' and 'profilePhoto' depending on how the user was created
//   const getDoctorImage = (doctor) => {
//     const imgSource = doctor?.image || doctor?.profilePhoto;
//     if (
//       imgSource &&
//       imgSource !== "none" &&
//       !imgSource.includes("sample-doctor.jpg")
//     ) {
//       if (imgSource.startsWith("http")) return imgSource;
//       let cleanPath = imgSource.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
//       return `http://localhost:5000${cleanPath}`;
//     }
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || "Doctor")}&background=eff6ff&color=2563eb&size=150&font-size=0.33`;
//   };

//   const handleEdit = (doctor) => {
//     setError("");
//     setIsEditing(true);
//     setOtpStep(false); // Reset OTP step just in case
//     setCurrentDoctorId(doctor._id);
//     setFormData({
//       name: doctor.name || "",
//       speciality: doctor.speciality || "",
//       nmcNumber: doctor.nmcNumber || "",
//       email: doctor.email || "",
//       phone: doctor.phone || "",
//       experience: doctor.experience || 0,
//       consultationFee: doctor.consultationFee || 500,
//       slots: doctor.slots || [],
//       isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
//     });

//     setImagePreview(
//       doctor.image || doctor.profilePhoto ? getDoctorImage(doctor) : null,
//     );
//     setImageFile(null);
//     setShowModal(true);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const addSlot = () => {
//     setFormData({
//       ...formData,
//       slots: [
//         ...formData.slots,
//         { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
//       ],
//     });
//   };

//   const removeSlot = (index) => {
//     const newSlots = formData.slots.filter((_, i) => i !== index);
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...formData.slots];
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setFormData({ ...formData, slots: newSlots });
//   };

//   // ✅ HANDLES BOTH REQUESTING OTP AND FINAL SUBMISSION (Logic Kept Intact)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     // --- SCENARIO 1: EDITING AN EXISTING DOCTOR (No OTP required) ---
//     if (isEditing) {
//       try {
//         setSaving(true);
//         const submitData = new FormData();
//         Object.keys(formData).forEach((key) => {
//           if (key === "slots")
//             submitData.append("slots", JSON.stringify(formData.slots));
//           else submitData.append(key, formData[key]);
//         });
//         if (imageFile) submitData.append("image", imageFile);

//         await api.put(`/admin/doctors/${currentDoctorId}`, submitData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });

//         setSuccess("Doctor profile updated successfully!");
//         finalizeSuccess();
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to update record.");
//       } finally {
//         setSaving(false);
//       }
//       return;
//     }

//     // --- SCENARIO 2: CREATING A DOCTOR -> STEP 1 (Request OTP) ---
//     if (!isEditing && !otpStep) {
//       try {
//         setSaving(true);
//         await api.post("/admin/request-doctor-otp", {
//           name: formData.name,
//           email: formData.email,
//         });
//         setOtpStep(true); // Move to OTP UI
//         setSuccess("OTP sent to doctor's email!");
//         setTimeout(() => setSuccess(""), 3000);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to send OTP.");
//       } finally {
//         setSaving(false);
//       }
//       return;
//     }

//     // --- SCENARIO 3: CREATING A DOCTOR -> STEP 2 (Verify OTP & Save Data) ---
//     if (!isEditing && otpStep) {
//       if (otp.length < 6) {
//         setError("Please enter a valid 6-digit OTP.");
//         return;
//       }
//       try {
//         setSaving(true);
//         const submitData = new FormData();
//         Object.keys(formData).forEach((key) => {
//           if (key === "slots")
//             submitData.append("slots", JSON.stringify(formData.slots));
//           else submitData.append(key, formData[key]);
//         });
//         if (imageFile) submitData.append("image", imageFile);
//         submitData.append("otp", otp); // ✅ Append OTP to FormData

//         // Submit to the verify route
//         await api.post("/admin/verify-create-doctor", submitData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });

//         setSuccess(
//           "Doctor registered successfully! Temporary password emailed.",
//         );
//         finalizeSuccess();
//       } catch (err) {
//         setError(
//           err.response?.data?.message || "Invalid OTP or creation failed.",
//         );
//       } finally {
//         setSaving(false);
//       }
//     }
//   };

//   const finalizeSuccess = () => {
//     setShowModal(false);
//     resetForm();
//     fetchDoctors();
//     setTimeout(() => setSuccess(""), 4000);
//   };

//   // ✅ UPDATED: Hit the general /users endpoint to delete the account entirely
//   const handleDelete = async (id, name) => {
//     if (
//       window.confirm(
//         `Delete Dr. ${name}? This will remove them from the booking system.`,
//       )
//     ) {
//       try {
//         await api.delete(`/users/${id}`);
//         fetchDoctors();
//       } catch (err) {
//         alert(err.response?.data?.message || "Delete failed.");
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       speciality: "",
//       nmcNumber: "",
//       email: "",
//       phone: "",
//       experience: 0,
//       consultationFee: 500,
//       slots: [],
//       isAvailable: true,
//     });
//     setImageFile(null);
//     setImagePreview(null);
//     setIsEditing(false);
//     setCurrentDoctorId(null);
//     setOtpStep(false);
//     setOtp("");
//   };

//   if (loading && doctors.length === 0) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary mb-3" size={48} />
//         <span className="fw-bold text-secondary tracking-wider text-uppercase small">
//           Loading Specialist Data...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
//       {/* --- HEADER SECTION --- */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
//         <div className="d-flex align-items-center gap-3">
//           <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle shadow-sm">
//             <Stethoscope size={28} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="fw-black mb-1 text-dark tracking-tight">
//               Doctors Management
//             </h3>
//             <p className="text-muted fw-medium mb-0 small">
//               Total Specialists Active:{" "}
//               <span className="fw-bold text-primary">{doctors.length}</span>
//             </p>
//           </div>
//         </div>
//         <button
//           className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift d-flex align-items-center"
//           onClick={() => {
//             resetForm();
//             setShowModal(true);
//           }}
//         >
//           <Plus size={18} className="me-2" /> Add Specialist
//         </button>
//       </div>

//       {/* --- ALERTS --- */}
//       {success && (
//         <div className="alert alert-success d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold animate-fade-in">
//           <CheckCircle size={20} /> {success}
//         </div>
//       )}

//       {/* --- MAIN TABLE CARD --- */}
//       <div className="card-modern mb-4 bg-white shadow-sm rounded-4 border border-light-subtle overflow-hidden">
//         <div className="table-responsive custom-scrollbar">
//           <table className="table table-hover align-middle mb-0 custom-saas-table">
//             <thead className="bg-light">
//               <tr>
//                 <th className="ps-4 text-uppercase small fw-bold text-muted py-3">
//                   Specialist Profile
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Credentials
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Contact
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Schedule Overview
//                 </th>
//                 <th className="text-end pe-4 text-uppercase small fw-bold text-muted py-3">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-5 text-muted">
//                     <div className="d-flex flex-column align-items-center justify-content-center">
//                       <div className="bg-secondary bg-opacity-10 p-4 rounded-circle mb-3">
//                         <Stethoscope
//                           size={40}
//                           className="text-secondary opacity-50"
//                         />
//                       </div>
//                       <h5 className="fw-bolder text-dark mb-1">
//                         No Doctors Found
//                       </h5>
//                       <p className="fw-medium mb-0 small">
//                         Register a new specialist to see them here.
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 doctors.map((doc) => (
//                   <tr
//                     key={doc._id}
//                     className="transition-all hover-bg-light border-bottom border-light"
//                   >
//                     <td className="ps-4 py-3">
//                       <div className="d-flex align-items-center gap-3">
//                         <img
//                           src={getDoctorImage(doc)}
//                           alt={doc.name}
//                           className="rounded-circle object-fit-cover shadow-sm border border-light-subtle"
//                           style={{ width: "48px", height: "48px" }}
//                         />
//                         <div>
//                           <div className="fw-bolder text-dark mb-1 fs-6">
//                             {doc.name}
//                           </div>
//                           <div className="d-flex align-items-center gap-2">
//                             <span
//                               className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 shadow-sm"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               {doc.speciality || "General Physician"}
//                             </span>
//                             {!doc.isAvailable && (
//                               <span
//                                 className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1 shadow-sm"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Unavailable
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark d-flex align-items-center gap-1 fw-medium mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Briefcase size={14} className="text-muted" />{" "}
//                         {doc.experience || 0} Yrs Experience
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-1 mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <DollarSign size={14} className="text-success" /> Fee:
//                         NPR {doc.consultationFee || 500}
//                       </div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         <span className="fw-bold">NMC:</span>{" "}
//                         <span className="font-monospace">
//                           {doc.nmcNumber || "Not Provided"}
//                         </span>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark fw-medium d-flex align-items-center gap-2 mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Phone size={14} className="text-muted" />{" "}
//                         {doc.phone || "N/A"}
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-2"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Mail size={14} /> {doc.email || "N/A"}
//                       </div>
//                     </td>
//                     <td>
//                       {doc.slots && doc.slots.length > 0 ? (
//                         <div className="d-flex flex-column gap-1">
//                           {doc.slots.slice(0, 2).map((s, i) => (
//                             <div
//                               key={i}
//                               className="text-muted d-flex align-items-center gap-2"
//                               style={{ fontSize: "0.8rem" }}
//                             >
//                               <Clock size={12} className="text-primary" />
//                               <span
//                                 className="fw-bold text-dark"
//                                 style={{ width: "35px" }}
//                               >
//                                 {s.day ? s.day.slice(0, 3) : "UNK"}
//                               </span>
//                               <span>
//                                 {s.startTime} - {s.endTime}
//                               </span>
//                             </div>
//                           ))}
//                           {doc.slots.length > 2 && (
//                             <div
//                               className="text-primary small fw-bold"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               +{doc.slots.length - 2} more shifts
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">
//                           No Schedule Set
//                         </span>
//                       )}
//                     </td>
//                     <td className="pe-4 text-end">
//                       <button
//                         className="btn btn-sm btn-light text-primary rounded-circle p-2 mx-1 hover-lift shadow-sm border"
//                         onClick={() => handleEdit(doc)}
//                         title="Edit Doctor"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         className="btn btn-sm btn-light text-danger rounded-circle p-2 mx-1 hover-lift shadow-sm border"
//                         onClick={() => handleDelete(doc._id, doc.name)}
//                         title="Delete Doctor"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- MODAL SECTION --- */}
//       {showModal && (
//         <>
//           <div
//             className="modal-backdrop fade show"
//             style={{ zIndex: 1040 }}
//             onClick={() => setShowModal(false)}
//           ></div>
//           <div
//             className="modal show d-block animate-fade-in"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//           >
//             <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
//               <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//                 <div className="modal-header bg-light border-bottom border-light-subtle p-4 pb-3">
//                   <h5 className="modal-title fw-black text-dark d-flex align-items-center gap-2">
//                     <Stethoscope className="text-primary" size={20} />
//                     {isEditing
//                       ? "Update Specialist Profile"
//                       : otpStep
//                         ? "Verify Email OTP"
//                         : "Register New Specialist"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close shadow-none bg-secondary bg-opacity-10 rounded-circle p-2"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <form
//                   onSubmit={handleSubmit}
//                   className="d-flex flex-column overflow-hidden"
//                 >
//                   <div className="modal-body p-4 pt-4 overflow-auto custom-scrollbar">
//                     {error && (
//                       <div className="alert alert-danger py-2 small fw-bold mb-4">
//                         {error}
//                       </div>
//                     )}

//                     {/* ✅ IF OTP STEP IS ACTIVE, SHOW ONLY OTP INPUT */}
//                     {otpStep && !isEditing ? (
//                       <div className="text-center py-4">
//                         <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle d-inline-flex mb-3 shadow-sm border border-warning border-opacity-25">
//                           <ShieldCheck size={36} />
//                         </div>
//                         <h4 className="fw-black text-dark mb-2">
//                           Verification Required
//                         </h4>
//                         <p className="text-muted fw-medium px-4 mb-4">
//                           We sent a 6-digit verification code to{" "}
//                           <strong>{formData.email}</strong>. Please enter it
//                           below to complete registration.
//                         </p>
//                         <input
//                           type="text"
//                           className="form-control form-control-lg bg-light text-center fw-black tracking-widest fs-3 mx-auto shadow-sm"
//                           style={{ maxWidth: "250px", letterSpacing: "0.25em" }}
//                           maxLength="6"
//                           placeholder="------"
//                           value={otp}
//                           onChange={(e) => setOtp(e.target.value)}
//                           required
//                           autoFocus
//                         />
//                       </div>
//                     ) : (
//                       /* ✅ OTHERWISE, SHOW THE FULL PROFILE FORM */
//                       <>
//                         {/* Image Uploader Section */}
//                         <div className="d-flex flex-column align-items-center justify-content-center mb-4 pb-3 border-bottom border-light-subtle">
//                           <div className="position-relative">
//                             <img
//                               src={
//                                 imagePreview ||
//                                 getDoctorImage({ name: formData.name })
//                               }
//                               alt="Doctor Preview"
//                               className="rounded-circle object-fit-cover shadow-sm border border-2 border-white"
//                               style={{ width: "100px", height: "100px" }}
//                             />
//                             <label
//                               htmlFor="doctor-image-upload"
//                               className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow cursor-pointer hover-lift border border-2 border-white d-flex align-items-center justify-content-center"
//                             >
//                               <Camera size={16} />
//                             </label>
//                             <input
//                               id="doctor-image-upload"
//                               type="file"
//                               className="d-none"
//                               accept="image/*"
//                               onChange={handleImageChange}
//                             />
//                           </div>
//                           <span className="text-muted small mt-2 fw-medium">
//                             Upload Profile Photo (Optional)
//                           </span>
//                         </div>

//                         <div className="row g-4">
//                           <div className="col-md-6">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               Full Name *
//                             </label>
//                             <div className="position-relative">
//                               <User
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-primary"
//                                 style={{ left: "16px" }}
//                               />
//                               <input
//                                 type="text"
//                                 className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                                 value={formData.name}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     name: e.target.value,
//                                   })
//                                 }
//                                 required
//                                 placeholder="Dr. Jane Doe"
//                               />
//                             </div>
//                           </div>

//                           <div className="col-md-6">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               Speciality *
//                             </label>
//                             <div className="position-relative">
//                               <Stethoscope
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-primary"
//                                 style={{ left: "16px" }}
//                               />
//                               <input
//                                 type="text"
//                                 className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                                 value={formData.speciality}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     speciality: e.target.value,
//                                   })
//                                 }
//                                 required
//                                 placeholder="e.g. Cardiologist"
//                               />
//                             </div>
//                           </div>

//                           <div className="col-md-6">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               NMC Registration *
//                             </label>
//                             <div className="position-relative">
//                               <FileText
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-primary"
//                                 style={{ left: "16px" }}
//                               />
//                               <input
//                                 type="text"
//                                 className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                                 value={formData.nmcNumber}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     nmcNumber: e.target.value,
//                                   })
//                                 }
//                                 required
//                                 placeholder="NMC-XXXX"
//                               />
//                             </div>
//                           </div>

//                           <div className="col-md-6">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               Contact Number *
//                             </label>
//                             <div className="position-relative">
//                               <Phone
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-primary"
//                                 style={{ left: "16px" }}
//                               />
//                               <input
//                                 type="text"
//                                 className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                                 value={formData.phone}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     phone: e.target.value,
//                                   })
//                                 }
//                                 required
//                                 placeholder="98XXXXXXXX"
//                               />
//                             </div>
//                           </div>

//                           <div className="col-md-4">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               Experience (Yrs)
//                             </label>
//                             <div className="position-relative">
//                               <Briefcase
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-primary"
//                                 style={{ left: "16px" }}
//                               />
//                               <input
//                                 type="number"
//                                 className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                                 value={formData.experience}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     experience: e.target.value,
//                                   })
//                                 }
//                               />
//                             </div>
//                           </div>

//                           <div className="col-md-4">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               Fee (NPR)
//                             </label>
//                             <div className="position-relative">
//                               <DollarSign
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-success"
//                                 style={{ left: "16px" }}
//                               />
//                               <input
//                                 type="number"
//                                 className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                                 value={formData.consultationFee}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     consultationFee: e.target.value,
//                                   })
//                                 }
//                               />
//                             </div>
//                           </div>

//                           <div className="col-md-4">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               Status
//                             </label>
//                             <div className="position-relative">
//                               <Activity
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-primary"
//                                 style={{ left: "16px" }}
//                               />
//                               <select
//                                 className="form-select modern-input ps-5 border-light-subtle shadow-sm cursor-pointer fw-medium"
//                                 value={formData.isAvailable}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     isAvailable: e.target.value === "true",
//                                   })
//                                 }
//                               >
//                                 <option value="true" className="text-success">
//                                   Available
//                                 </option>
//                                 <option value="false" className="text-danger">
//                                   Unavailable
//                                 </option>
//                               </select>
//                             </div>
//                           </div>

//                           <div className="col-md-12">
//                             <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                               Email Address
//                             </label>
//                             <div className="position-relative">
//                               <Mail
//                                 size={18}
//                                 className="position-absolute top-50 translate-middle-y text-primary"
//                                 style={{ left: "16px" }}
//                               />
//                               <input
//                                 type="email"
//                                 className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                                 value={formData.email}
//                                 onChange={(e) =>
//                                   setFormData({
//                                     ...formData,
//                                     email: e.target.value,
//                                   })
//                                 }
//                                 placeholder="doctor@hospital.com"
//                                 disabled={isEditing}
//                               />
//                             </div>
//                             {!isEditing && (
//                               <small className="text-primary mt-1 d-block fw-medium">
//                                 <Mail size={12} /> An OTP will be sent here upon
//                                 submission.
//                               </small>
//                             )}
//                           </div>

//                           {/* Weekly Schedule */}
//                           <div className="col-12 mt-4 border-top border-light-subtle pt-4">
//                             <div className="d-flex justify-content-between align-items-center mb-3">
//                               <label className="form-label fw-bold text-dark mb-0 d-flex align-items-center gap-2">
//                                 <Clock size={18} className="text-primary" />{" "}
//                                 Weekly Shift Schedule
//                               </label>
//                               <button
//                                 type="button"
//                                 className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold hover-lift d-flex align-items-center gap-1 shadow-sm"
//                                 onClick={addSlot}
//                               >
//                                 <Plus size={14} /> Add Shift
//                               </button>
//                             </div>
//                             <div className="p-3 bg-light bg-opacity-50 rounded-4 border border-light-subtle">
//                               {formData.slots.length === 0 ? (
//                                 <div className="text-center py-4 text-muted small fw-medium">
//                                   No working shifts added yet.
//                                 </div>
//                               ) : (
//                                 formData.slots.map((slot, index) => (
//                                   <div
//                                     key={index}
//                                     className="row g-2 mb-2 align-items-center bg-white p-2 rounded-3 shadow-sm border border-light-subtle"
//                                   >
//                                     <div className="col-md-4">
//                                       <select
//                                         className="form-select form-select-sm modern-input border-light-subtle fw-medium text-dark cursor-pointer"
//                                         value={slot.day}
//                                         onChange={(e) =>
//                                           updateSlot(
//                                             index,
//                                             "day",
//                                             e.target.value,
//                                           )
//                                         }
//                                       >
//                                         {[
//                                           "MONDAY",
//                                           "TUESDAY",
//                                           "WEDNESDAY",
//                                           "THURSDAY",
//                                           "FRIDAY",
//                                           "SATURDAY",
//                                           "SUNDAY",
//                                         ].map((d) => (
//                                           <option key={d} value={d}>
//                                             {d}
//                                           </option>
//                                         ))}
//                                       </select>
//                                     </div>
//                                     <div className="col-md-3">
//                                       <input
//                                         type="time"
//                                         className="form-control form-control-sm modern-input border-light-subtle text-center fw-medium"
//                                         value={slot.startTime}
//                                         onChange={(e) =>
//                                           updateSlot(
//                                             index,
//                                             "startTime",
//                                             e.target.value,
//                                           )
//                                         }
//                                         required
//                                       />
//                                     </div>
//                                     <div className="col-auto text-muted fw-bold small">
//                                       to
//                                     </div>
//                                     <div className="col-md-3">
//                                       <input
//                                         type="time"
//                                         className="form-control form-control-sm modern-input border-light-subtle text-center fw-medium"
//                                         value={slot.endTime}
//                                         onChange={(e) =>
//                                           updateSlot(
//                                             index,
//                                             "endTime",
//                                             e.target.value,
//                                           )
//                                         }
//                                         required
//                                       />
//                                     </div>
//                                     <div className="col text-end">
//                                       <button
//                                         type="button"
//                                         className="btn btn-sm btn-light text-danger rounded-circle p-2 hover-lift border shadow-sm"
//                                         onClick={() => removeSlot(index)}
//                                         title="Remove Shift"
//                                       >
//                                         <Trash2 size={14} />
//                                       </button>
//                                     </div>
//                                   </div>
//                                 ))
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </div>

//                   {/* Footer Buttons */}
//                   <div className="modal-footer bg-light border-top border-light-subtle p-3 d-flex justify-content-between">
//                     {/* Left side button (Back) if in OTP mode */}
//                     {otpStep && !isEditing ? (
//                       <button
//                         type="button"
//                         className="btn btn-light rounded-pill px-4 fw-bold border shadow-sm hover-lift text-dark"
//                         onClick={() => setOtpStep(false)}
//                       >
//                         Back to Form
//                       </button>
//                     ) : (
//                       <div></div> // empty spacer
//                     )}

//                     <div className="d-flex gap-2">
//                       <button
//                         type="button"
//                         className="btn btn-white rounded-pill px-4 fw-bold border shadow-sm hover-lift text-secondary"
//                         onClick={() => setShowModal(false)}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className={`btn ${otpStep ? "btn-success" : "btn-primary"} rounded-pill px-4 shadow-sm fw-bold hover-lift d-flex align-items-center gap-2`}
//                         disabled={saving}
//                       >
//                         {saving ? (
//                           <>
//                             <Loader2 size={18} className="spin-animation" />{" "}
//                             Saving...
//                           </>
//                         ) : isEditing ? (
//                           <>
//                             <Save size={18} /> Save Changes
//                           </>
//                         ) : otpStep ? (
//                           <>
//                             <CheckCircle size={18} /> Verify & Register
//                           </>
//                         ) : (
//                           <>
//                             <Mail size={18} /> Send OTP & Continue
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminDoctors;

//import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom"; // ✅ Added to redirect to AdminCreateUser
// import {
//   Stethoscope,
//   Plus,
//   Edit,
//   Trash2,
//   Clock,
//   Save,
//   AlertCircle,
//   Mail,
//   Phone,
//   Briefcase,
//   DollarSign,
//   Loader2,
//   User,
//   FileText,
//   Activity,
//   CheckCircle,
//   Camera,
// } from "lucide-react";

// const AdminDoctors = () => {
//   const navigate = useNavigate(); // ✅ Initialize navigation
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [currentDoctorId, setCurrentDoctorId] = useState(null);

//   // Image Upload State
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     email: "",
//     phone: "",
//     experience: 0,
//     consultationFee: 500,
//     slots: [],
//     isAvailable: true,
//   });

//   // ✅ Fetch from the specific Doctor profile endpoint
//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/admin/doctors");
//       const data = res.data?.doctors || res.data || [];
//       setDoctors(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Failed to load doctor records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const getDoctorImage = (doctor) => {
//     if (
//       doctor?.image &&
//       doctor.image !== "none" &&
//       !doctor.image.includes("sample-doctor.jpg")
//     ) {
//       if (doctor.image.startsWith("http")) return doctor.image;
//       let cleanPath = doctor.image.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
//       return `http://localhost:5000${cleanPath}`;
//     }
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || "Doctor")}&background=eff6ff&color=2563eb&size=150&font-size=0.33`;
//   };

//   // ✅ OPEN EDIT MODAL (This page is now ONLY for editing/deleting)
//   const handleEdit = (doctor) => {
//     setError("");
//     setCurrentDoctorId(doctor._id);
//     setFormData({
//       name: doctor.name || "",
//       speciality: doctor.speciality || "",
//       nmcNumber: doctor.nmcNumber || "",
//       email: doctor.email || "",
//       phone: doctor.phone || "",
//       experience: doctor.experience || 0,
//       consultationFee: doctor.consultationFee || 500,
//       slots: doctor.slots || [],
//       isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
//     });

//     setImagePreview(doctor.image ? getDoctorImage(doctor) : null);
//     setImageFile(null);
//     setShowModal(true);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const addSlot = () => {
//     setFormData({
//       ...formData,
//       slots: [
//         ...formData.slots,
//         { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
//       ],
//     });
//   };

//   const removeSlot = (index) => {
//     const newSlots = formData.slots.filter((_, i) => i !== index);
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...formData.slots];
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setFormData({ ...formData, slots: newSlots });
//   };

//   // ✅ ONLY HANDLES EDITING NOW
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       setSaving(true);
//       const submitData = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (key === "slots")
//           submitData.append("slots", JSON.stringify(formData.slots));
//         else submitData.append(key, formData[key]);
//       });
//       if (imageFile) submitData.append("image", imageFile);

//       // Hit the doctor update route
//       await api.put(`/admin/doctors/${currentDoctorId}`, submitData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setSuccess("Doctor profile updated successfully!");
//       setShowModal(false);
//       fetchDoctors();
//       setTimeout(() => setSuccess(""), 4000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update record.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (
//       window.confirm(
//         `Delete Dr. ${name}? This will remove them from the booking system.`,
//       )
//     ) {
//       try {
//         await api.delete(`/admin/doctors/${id}`);
//         fetchDoctors();
//       } catch (err) {
//         alert(err.response?.data?.message || "Delete failed.");
//       }
//     }
//   };

//   if (loading && doctors.length === 0) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary mb-3" size={48} />
//         <span className="fw-bold text-secondary tracking-wider text-uppercase small">
//           Loading Specialist Data...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
//       {/* --- HEADER SECTION --- */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
//         <div className="d-flex align-items-center gap-3">
//           <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle shadow-sm">
//             <Stethoscope size={28} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="fw-black mb-1 text-dark tracking-tight">
//               Doctors Management
//             </h3>
//             <p className="text-muted fw-medium mb-0 small">
//               Total Specialists Active:{" "}
//               <span className="fw-bold text-primary">{doctors.length}</span>
//             </p>
//           </div>
//         </div>

//         {/* ✅ REDIRECTS TO ADMIN CREATE USER INSTEAD OF OPENING MODAL */}
//         <button
//           className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift d-flex align-items-center"
//           onClick={() => navigate("/admin/users")}
//         >
//           <Plus size={18} className="me-2" /> Register New Specialist
//         </button>
//       </div>

//       {/* --- ALERTS --- */}
//       {success && (
//         <div className="alert alert-success d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold animate-fade-in">
//           <CheckCircle size={20} /> {success}
//         </div>
//       )}

//       {/* --- MAIN TABLE CARD --- */}
//       <div className="card-modern mb-4 bg-white shadow-sm rounded-4 border border-light-subtle overflow-hidden">
//         <div className="table-responsive custom-scrollbar">
//           <table className="table table-hover align-middle mb-0 custom-saas-table">
//             <thead className="bg-light">
//               <tr>
//                 <th className="ps-4 text-uppercase small fw-bold text-muted py-3">
//                   Specialist Profile
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Credentials
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Contact
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Schedule Overview
//                 </th>
//                 <th className="text-end pe-4 text-uppercase small fw-bold text-muted py-3">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-5 text-muted">
//                     <div className="d-flex flex-column align-items-center justify-content-center">
//                       <div className="bg-secondary bg-opacity-10 p-4 rounded-circle mb-3">
//                         <Stethoscope
//                           size={40}
//                           className="text-secondary opacity-50"
//                         />
//                       </div>
//                       <h5 className="fw-bolder text-dark mb-1">
//                         No Doctors Found
//                       </h5>
//                       <p className="fw-medium mb-0 small">
//                         Register a new specialist from User Management to see
//                         them here.
//                       </p>
//                       <button
//                         className="btn btn-sm btn-outline-primary mt-3 rounded-pill fw-bold"
//                         onClick={() => navigate("/admin/users")}
//                       >
//                         Go to User Management
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 doctors.map((doc) => (
//                   <tr
//                     key={doc._id}
//                     className="transition-all hover-bg-light border-bottom border-light"
//                   >
//                     <td className="ps-4 py-3">
//                       <div className="d-flex align-items-center gap-3">
//                         <img
//                           src={getDoctorImage(doc)}
//                           alt={doc.name}
//                           className="rounded-circle object-fit-cover shadow-sm border border-light-subtle"
//                           style={{ width: "48px", height: "48px" }}
//                         />
//                         <div>
//                           <div className="fw-bolder text-dark mb-1 fs-6">
//                             {doc.name}
//                           </div>
//                           <div className="d-flex align-items-center gap-2">
//                             <span
//                               className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 shadow-sm"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               {doc.speciality || "General Physician"}
//                             </span>
//                             {!doc.isAvailable && (
//                               <span
//                                 className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1 shadow-sm"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Unavailable
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark d-flex align-items-center gap-1 fw-medium mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Briefcase size={14} className="text-muted" />{" "}
//                         {doc.experience || 0} Yrs Experience
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-1 mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <DollarSign size={14} className="text-success" /> Fee:
//                         NPR {doc.consultationFee || 500}
//                       </div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         <span className="fw-bold">NMC:</span>{" "}
//                         <span className="font-monospace">
//                           {doc.nmcNumber || "Not Provided"}
//                         </span>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark fw-medium d-flex align-items-center gap-2 mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Phone size={14} className="text-muted" />{" "}
//                         {doc.phone || "N/A"}
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-2"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Mail size={14} /> {doc.email || "N/A"}
//                       </div>
//                     </td>
//                     <td>
//                       {doc.slots && doc.slots.length > 0 ? (
//                         <div className="d-flex flex-column gap-1">
//                           {doc.slots.slice(0, 2).map((s, i) => (
//                             <div
//                               key={i}
//                               className="text-muted d-flex align-items-center gap-2"
//                               style={{ fontSize: "0.8rem" }}
//                             >
//                               <Clock size={12} className="text-primary" />
//                               <span
//                                 className="fw-bold text-dark"
//                                 style={{ width: "35px" }}
//                               >
//                                 {s.day ? s.day.slice(0, 3) : "UNK"}
//                               </span>
//                               <span>
//                                 {s.startTime} - {s.endTime}
//                               </span>
//                             </div>
//                           ))}
//                           {doc.slots.length > 2 && (
//                             <div
//                               className="text-primary small fw-bold"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               +{doc.slots.length - 2} more shifts
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">
//                           No Schedule Set
//                         </span>
//                       )}
//                     </td>
//                     <td className="pe-4 text-end">
//                       <button
//                         className="btn btn-sm btn-light text-primary rounded-circle p-2 mx-1 hover-lift shadow-sm border"
//                         onClick={() => handleEdit(doc)}
//                         title="Edit Doctor Profile"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         className="btn btn-sm btn-light text-danger rounded-circle p-2 mx-1 hover-lift shadow-sm border"
//                         onClick={() => handleDelete(doc._id, doc.name)}
//                         title="Delete Doctor"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- EDIT MODAL (ONLY EDITING) --- */}
//       {showModal && (
//         <>
//           <div
//             className="modal-backdrop fade show"
//             style={{ zIndex: 1040 }}
//             onClick={() => setShowModal(false)}
//           ></div>
//           <div
//             className="modal show d-block animate-fade-in"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//           >
//             <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
//               <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//                 <div className="modal-header bg-light border-bottom border-light-subtle p-4 pb-3">
//                   <h5 className="modal-title fw-black text-dark d-flex align-items-center gap-2">
//                     <Edit className="text-primary" size={20} /> Update
//                     Specialist Profile
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close shadow-none bg-secondary bg-opacity-10 rounded-circle p-2"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <form
//                   onSubmit={handleSubmit}
//                   className="d-flex flex-column overflow-hidden"
//                 >
//                   <div className="modal-body p-4 pt-4 overflow-auto custom-scrollbar">
//                     {error && (
//                       <div className="alert alert-danger py-2 small fw-bold mb-4">
//                         {error}
//                       </div>
//                     )}

//                     {/* Image Uploader Section */}
//                     <div className="d-flex flex-column align-items-center justify-content-center mb-4 pb-3 border-bottom border-light-subtle">
//                       <div className="position-relative">
//                         <img
//                           src={
//                             imagePreview ||
//                             getDoctorImage({ name: formData.name })
//                           }
//                           alt="Doctor Preview"
//                           className="rounded-circle object-fit-cover shadow-sm border border-2 border-white"
//                           style={{ width: "100px", height: "100px" }}
//                         />
//                         <label
//                           htmlFor="doctor-image-upload"
//                           className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow cursor-pointer hover-lift border border-2 border-white d-flex align-items-center justify-content-center"
//                         >
//                           <Camera size={16} />
//                         </label>
//                         <input
//                           id="doctor-image-upload"
//                           type="file"
//                           className="d-none"
//                           accept="image/*"
//                           onChange={handleImageChange}
//                         />
//                       </div>
//                       <span className="text-muted small mt-2 fw-medium">
//                         Upload Profile Photo (Optional)
//                       </span>
//                     </div>

//                     <div className="row g-4">
//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Full Name *
//                         </label>
//                         <div className="position-relative">
//                           <User
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.name}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 name: e.target.value,
//                               })
//                             }
//                             required
//                             placeholder="Dr. Jane Doe"
//                           />
//                         </div>
//                       </div>

//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Speciality *
//                         </label>
//                         <div className="position-relative">
//                           <Stethoscope
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.speciality}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 speciality: e.target.value,
//                               })
//                             }
//                             required
//                             placeholder="e.g. Cardiologist"
//                           />
//                         </div>
//                       </div>

//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           NMC Registration *
//                         </label>
//                         <div className="position-relative">
//                           <FileText
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.nmcNumber}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 nmcNumber: e.target.value,
//                               })
//                             }
//                             required
//                             placeholder="NMC-XXXX"
//                           />
//                         </div>
//                       </div>

//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Contact Number *
//                         </label>
//                         <div className="position-relative">
//                           <Phone
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.phone}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 phone: e.target.value,
//                               })
//                             }
//                             required
//                             placeholder="98XXXXXXXX"
//                           />
//                         </div>
//                       </div>

//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Experience (Yrs)
//                         </label>
//                         <div className="position-relative">
//                           <Briefcase
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="number"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.experience}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 experience: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Fee (NPR)
//                         </label>
//                         <div className="position-relative">
//                           <DollarSign
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-success"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="number"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.consultationFee}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 consultationFee: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Status
//                         </label>
//                         <div className="position-relative">
//                           <Activity
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <select
//                             className="form-select modern-input ps-5 border-light-subtle shadow-sm cursor-pointer fw-medium"
//                             value={formData.isAvailable}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 isAvailable: e.target.value === "true",
//                               })
//                             }
//                           >
//                             <option value="true" className="text-success">
//                               Available
//                             </option>
//                             <option value="false" className="text-danger">
//                               Unavailable
//                             </option>
//                           </select>
//                         </div>
//                       </div>

//                       <div className="col-md-12">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Email Address
//                         </label>
//                         <div className="position-relative">
//                           <Mail
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="email"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm bg-light text-muted"
//                             value={formData.email}
//                             disabled={true} // Cannot edit email of existing user
//                           />
//                         </div>
//                       </div>

//                       {/* Weekly Schedule */}
//                       <div className="col-12 mt-4 border-top border-light-subtle pt-4">
//                         <div className="d-flex justify-content-between align-items-center mb-3">
//                           <label className="form-label fw-bold text-dark mb-0 d-flex align-items-center gap-2">
//                             <Clock size={18} className="text-primary" /> Weekly
//                             Shift Schedule
//                           </label>
//                           <button
//                             type="button"
//                             className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold hover-lift d-flex align-items-center gap-1 shadow-sm"
//                             onClick={addSlot}
//                           >
//                             <Plus size={14} /> Add Shift
//                           </button>
//                         </div>
//                         <div className="p-3 bg-light bg-opacity-50 rounded-4 border border-light-subtle">
//                           {formData.slots.length === 0 ? (
//                             <div className="text-center py-4 text-muted small fw-medium">
//                               No working shifts added yet.
//                             </div>
//                           ) : (
//                             formData.slots.map((slot, index) => (
//                               <div
//                                 key={index}
//                                 className="row g-2 mb-2 align-items-center bg-white p-2 rounded-3 shadow-sm border border-light-subtle"
//                               >
//                                 <div className="col-md-4">
//                                   <select
//                                     className="form-select form-select-sm modern-input border-light-subtle fw-medium text-dark cursor-pointer"
//                                     value={slot.day}
//                                     onChange={(e) =>
//                                       updateSlot(index, "day", e.target.value)
//                                     }
//                                   >
//                                     {[
//                                       "MONDAY",
//                                       "TUESDAY",
//                                       "WEDNESDAY",
//                                       "THURSDAY",
//                                       "FRIDAY",
//                                       "SATURDAY",
//                                       "SUNDAY",
//                                     ].map((d) => (
//                                       <option key={d} value={d}>
//                                         {d}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </div>
//                                 <div className="col-md-3">
//                                   <input
//                                     type="time"
//                                     className="form-control form-control-sm modern-input border-light-subtle text-center fw-medium"
//                                     value={slot.startTime}
//                                     onChange={(e) =>
//                                       updateSlot(
//                                         index,
//                                         "startTime",
//                                         e.target.value,
//                                       )
//                                     }
//                                     required
//                                   />
//                                 </div>
//                                 <div className="col-auto text-muted fw-bold small">
//                                   to
//                                 </div>
//                                 <div className="col-md-3">
//                                   <input
//                                     type="time"
//                                     className="form-control form-control-sm modern-input border-light-subtle text-center fw-medium"
//                                     value={slot.endTime}
//                                     onChange={(e) =>
//                                       updateSlot(
//                                         index,
//                                         "endTime",
//                                         e.target.value,
//                                       )
//                                     }
//                                     required
//                                   />
//                                 </div>
//                                 <div className="col text-end">
//                                   <button
//                                     type="button"
//                                     className="btn btn-sm btn-light text-danger rounded-circle p-2 hover-lift border shadow-sm"
//                                     onClick={() => removeSlot(index)}
//                                     title="Remove Shift"
//                                   >
//                                     <Trash2 size={14} />
//                                   </button>
//                                 </div>
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Footer Buttons */}
//                   <div className="modal-footer bg-light border-top border-light-subtle p-3 d-flex justify-content-end">
//                     <div className="d-flex gap-2">
//                       <button
//                         type="button"
//                         className="btn btn-white rounded-pill px-4 fw-bold border shadow-sm hover-lift text-secondary"
//                         onClick={() => setShowModal(false)}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className={`btn btn-primary rounded-pill px-4 shadow-sm fw-bold hover-lift d-flex align-items-center gap-2`}
//                         disabled={saving}
//                       >
//                         {saving ? (
//                           <>
//                             <Loader2 size={18} className="spin-animation" />{" "}
//                             Saving...
//                           </>
//                         ) : (
//                           <>
//                             <Save size={18} /> Save Changes
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminDoctors;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";
// import {
//   Stethoscope,
//   Plus,
//   Edit,
//   Trash2,
//   Clock,
//   Save,
//   AlertCircle,
//   Mail,
//   Phone,
//   Briefcase,
//   DollarSign,
//   Loader2,
//   User,
//   FileText,
//   Activity,
//   CheckCircle,
//   Camera,
// } from "lucide-react";

// const AdminDoctors = () => {
//   const navigate = useNavigate();
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [currentDoctorId, setCurrentDoctorId] = useState(null);

//   // Image Upload State for Edit Mode
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     email: "",
//     phone: "",
//     experience: 0,
//     consultationFee: 500,
//     slots: [],
//     isAvailable: true,
//   });

//   // ✅ GUARANTEED FETCH FROM CLINICAL DATABASE
//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       // Fetch strictly from the doctor profile collection
//       const res = await api.get("/admin/doctors");

//       console.log("Fetched Doctors from DB:", res.data); // Debugging tool

//       // Safely extract the array
//       const data = res.data?.doctors || res.data || [];
//       setDoctors(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Error fetching doctors:", err);
//       setError("Failed to load doctor records. Please refresh.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Run on component mount
//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   // ✅ BULLETPROOF IMAGE RENDERER
//   const getDoctorImage = (doctor) => {
//     const imgSource = doctor?.image || doctor?.profilePhoto;
//     if (
//       imgSource &&
//       typeof imgSource === "string" &&
//       imgSource.trim() !== "" &&
//       imgSource !== "none" &&
//       !imgSource.includes("sample-doctor.jpg")
//     ) {
//       if (imgSource.startsWith("http")) return imgSource;
//       let cleanPath = imgSource.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
//       return `http://localhost:5000${cleanPath}`;
//     }
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || "Doctor")}&background=eff6ff&color=2563eb&size=150&font-size=0.33`;
//   };

//   const handleEdit = (doctor) => {
//     setError("");
//     setCurrentDoctorId(doctor._id);
//     setFormData({
//       name: doctor.name || "",
//       speciality: doctor.speciality || "",
//       nmcNumber: doctor.nmcNumber || "",
//       email: doctor.email || "",
//       phone: doctor.phone || "",
//       experience: doctor.experience || 0,
//       consultationFee: doctor.consultationFee || 500,
//       slots: doctor.slots || [],
//       isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
//     });

//     setImagePreview(
//       doctor.image || doctor.profilePhoto ? getDoctorImage(doctor) : null,
//     );
//     setImageFile(null);
//     setShowModal(true);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const addSlot = () =>
//     setFormData({
//       ...formData,
//       slots: [
//         ...formData.slots,
//         { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
//       ],
//     });
//   const removeSlot = (index) =>
//     setFormData({
//       ...formData,
//       slots: formData.slots.filter((_, i) => i !== index),
//     });
//   const updateSlot = (index, field, value) => {
//     const newSlots = [...formData.slots];
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setFormData({ ...formData, slots: newSlots });
//   };

//   // ✅ ONLY HANDLES EDITING (Registration is handled by AdminCreateUser now)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       setSaving(true);
//       const submitData = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (key === "slots")
//           submitData.append("slots", JSON.stringify(formData.slots));
//         else submitData.append(key, formData[key]);
//       });
//       if (imageFile) submitData.append("image", imageFile);

//       await api.put(`/admin/doctors/${currentDoctorId}`, submitData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setSuccess("Doctor profile updated successfully!");
//       setShowModal(false);
//       fetchDoctors();
//       setTimeout(() => setSuccess(""), 4000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update record.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (
//       window.confirm(
//         `Delete Dr. ${name}? This will remove them from the booking system AND delete their login credentials.`,
//       )
//     ) {
//       try {
//         await api.delete(`/admin/doctors/${id}`);
//         fetchDoctors();
//         setSuccess(`Dr. ${name} has been removed.`);
//         setTimeout(() => setSuccess(""), 3000);
//       } catch (err) {
//         alert(err.response?.data?.message || "Delete failed.");
//       }
//     }
//   };

//   if (loading && doctors.length === 0) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary mb-3" size={48} />
//         <span className="fw-bold text-secondary tracking-wider text-uppercase small">
//           Loading Specialist Data...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
//       {/* --- HEADER --- */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
//         <div className="d-flex align-items-center gap-3">
//           <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle shadow-sm">
//             <Stethoscope size={28} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="fw-black mb-1 text-dark tracking-tight">
//               Doctors Management
//             </h3>
//             <p className="text-muted fw-medium mb-0 small">
//               Total Specialists Active:{" "}
//               <span className="fw-bold text-primary">{doctors.length}</span>
//             </p>
//           </div>
//         </div>

//         {/* ✅ DYNAMIC REDIRECT BUTTON */}
//         <button
//           className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift d-flex align-items-center gap-2"
//           onClick={() => navigate("/admin/create-user")}
//         >
//           <Plus size={18} /> Register New Specialist
//         </button>
//       </div>

//       {/* --- ALERTS --- */}
//       {success && (
//         <div className="alert alert-success d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold animate-fade-in">
//           <CheckCircle size={20} /> {success}
//         </div>
//       )}
//       {error && (
//         <div className="alert alert-danger d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold animate-fade-in">
//           <AlertCircle size={20} /> {error}
//         </div>
//       )}

//       {/* --- TABLE --- */}
//       <div className="card-modern mb-4 bg-white shadow-sm rounded-4 border border-light-subtle overflow-hidden">
//         <div className="table-responsive custom-scrollbar">
//           <table className="table table-hover align-middle mb-0 custom-saas-table">
//             <thead className="bg-light">
//               <tr>
//                 <th className="ps-4 text-uppercase small fw-bold text-muted py-3">
//                   Specialist Profile
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Credentials
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Contact
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Schedule Overview
//                 </th>
//                 <th className="text-end pe-4 text-uppercase small fw-bold text-muted py-3">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-5 text-muted">
//                     <div className="d-flex flex-column align-items-center justify-content-center">
//                       <div className="bg-secondary bg-opacity-10 p-4 rounded-circle mb-3">
//                         <Stethoscope
//                           size={40}
//                           className="text-secondary opacity-50"
//                         />
//                       </div>
//                       <h5 className="fw-bolder text-dark mb-1">
//                         No Doctors Found
//                       </h5>
//                       <p className="fw-medium mb-0 small">
//                         Register a new specialist from User Management to see
//                         them here.
//                       </p>
//                       <button
//                         className="btn btn-sm btn-outline-primary mt-3 rounded-pill fw-bold"
//                         onClick={() => navigate("/admin/create-user")}
//                       >
//                         Go to Registry
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 doctors.map((doc) => (
//                   <tr
//                     key={doc._id}
//                     className="transition-all hover-bg-light border-bottom border-light"
//                   >
//                     <td className="ps-4 py-3">
//                       <div className="d-flex align-items-center gap-3">
//                         <img
//                           src={getDoctorImage(doc)}
//                           alt={doc.name}
//                           className="rounded-circle object-fit-cover shadow-sm border border-light-subtle"
//                           style={{ width: "48px", height: "48px" }}
//                         />
//                         <div>
//                           <div className="fw-bolder text-dark mb-1 fs-6">
//                             {doc.name}
//                           </div>
//                           <div className="d-flex align-items-center gap-2">
//                             <span
//                               className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 shadow-sm"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               {doc.speciality || "General Physician"}
//                             </span>
//                             {!doc.isAvailable && (
//                               <span
//                                 className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1 shadow-sm"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Unavailable
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark d-flex align-items-center gap-1 fw-medium mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Briefcase size={14} className="text-muted" />{" "}
//                         {doc.experience || 0} Yrs Experience
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-1 mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <DollarSign size={14} className="text-success" /> Fee:
//                         NPR {doc.consultationFee || 500}
//                       </div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         <span className="fw-bold">NMC:</span>{" "}
//                         <span className="font-monospace">
//                           {doc.nmcNumber || "Not Provided"}
//                         </span>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark fw-medium d-flex align-items-center gap-2 mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Phone size={14} className="text-muted" />{" "}
//                         {doc.phone || "N/A"}
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-2"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Mail size={14} /> {doc.email || "N/A"}
//                       </div>
//                     </td>
//                     <td>
//                       {doc.slots && doc.slots.length > 0 ? (
//                         <div className="d-flex flex-column gap-1">
//                           {doc.slots.slice(0, 2).map((s, i) => (
//                             <div
//                               key={i}
//                               className="text-muted d-flex align-items-center gap-2"
//                               style={{ fontSize: "0.8rem" }}
//                             >
//                               <Clock size={12} className="text-primary" />
//                               <span
//                                 className="fw-bold text-dark"
//                                 style={{ width: "35px" }}
//                               >
//                                 {s.day ? s.day.slice(0, 3) : "UNK"}
//                               </span>
//                               <span>
//                                 {s.startTime} - {s.endTime}
//                               </span>
//                             </div>
//                           ))}
//                           {doc.slots.length > 2 && (
//                             <div
//                               className="text-primary small fw-bold"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               +{doc.slots.length - 2} more shifts
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <span className="badge bg-secondary bg-opacity-10 text-secondary border px-2 py-1">
//                           No Schedule Set
//                         </span>
//                       )}
//                     </td>
//                     <td className="pe-4 text-end">
//                       <button
//                         className="btn btn-sm btn-light text-primary rounded-circle p-2 mx-1 hover-lift shadow-sm border"
//                         onClick={() => handleEdit(doc)}
//                         title="Edit Doctor Profile"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         className="btn btn-sm btn-light text-danger rounded-circle p-2 mx-1 hover-lift shadow-sm border"
//                         onClick={() => handleDelete(doc._id, doc.name)}
//                         title="Delete Doctor"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- EDIT MODAL --- */}
//       {showModal && (
//         <>
//           <div
//             className="modal-backdrop fade show"
//             style={{ zIndex: 1040 }}
//             onClick={() => setShowModal(false)}
//           ></div>
//           <div
//             className="modal show d-block animate-fade-in"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//           >
//             <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
//               <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//                 <div className="modal-header bg-light border-bottom border-light-subtle p-4 pb-3">
//                   <h5 className="modal-title fw-black text-dark d-flex align-items-center gap-2">
//                     <Edit className="text-primary" size={20} /> Update
//                     Specialist Profile
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close shadow-none bg-secondary bg-opacity-10 rounded-circle p-2"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <form
//                   onSubmit={handleSubmit}
//                   className="d-flex flex-column overflow-hidden"
//                 >
//                   <div className="modal-body p-4 pt-4 overflow-auto custom-scrollbar">
//                     {/* Image Uploader */}
//                     <div className="d-flex flex-column align-items-center justify-content-center mb-4 pb-3 border-bottom border-light-subtle">
//                       <div className="position-relative">
//                         <img
//                           src={
//                             imagePreview ||
//                             getDoctorImage({ name: formData.name })
//                           }
//                           alt="Doctor Preview"
//                           className="rounded-circle object-fit-cover shadow-sm border border-2 border-white"
//                           style={{ width: "100px", height: "100px" }}
//                         />
//                         <label
//                           htmlFor="doctor-image-upload"
//                           className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow cursor-pointer hover-lift border border-2 border-white d-flex align-items-center justify-content-center"
//                         >
//                           <Camera size={16} />
//                         </label>
//                         <input
//                           id="doctor-image-upload"
//                           type="file"
//                           className="d-none"
//                           accept="image/*"
//                           onChange={handleImageChange}
//                         />
//                       </div>
//                       <span className="text-muted small mt-2 fw-medium">
//                         Upload Profile Photo
//                       </span>
//                     </div>

//                     <div className="row g-4">
//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary">
//                           Full Name
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control modern-input ps-3"
//                           value={formData.name}
//                           onChange={(e) =>
//                             setFormData({ ...formData, name: e.target.value })
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary">
//                           Speciality
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control modern-input ps-3"
//                           value={formData.speciality}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               speciality: e.target.value,
//                             })
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary">
//                           NMC Registration
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control modern-input ps-3"
//                           value={formData.nmcNumber}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               nmcNumber: e.target.value,
//                             })
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary">
//                           Contact Number
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control modern-input ps-3"
//                           value={formData.phone}
//                           onChange={(e) =>
//                             setFormData({ ...formData, phone: e.target.value })
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary">
//                           Experience (Yrs)
//                         </label>
//                         <input
//                           type="number"
//                           className="form-control modern-input ps-3"
//                           value={formData.experience}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               experience: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary">
//                           Fee (NPR)
//                         </label>
//                         <input
//                           type="number"
//                           className="form-control modern-input ps-3"
//                           value={formData.consultationFee}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               consultationFee: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary">
//                           Status
//                         </label>
//                         <select
//                           className="form-select modern-input ps-3"
//                           value={formData.isAvailable}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               isAvailable: e.target.value === "true",
//                             })
//                           }
//                         >
//                           <option value="true">Available</option>
//                           <option value="false">Unavailable</option>
//                         </select>
//                       </div>
//                       <div className="col-md-12">
//                         <label className="form-label small fw-bold text-secondary">
//                           Email Address
//                         </label>
//                         <input
//                           type="email"
//                           className="form-control modern-input ps-3 bg-light"
//                           value={formData.email}
//                           disabled
//                         />
//                       </div>

//                       {/* Weekly Schedule */}
//                       <div className="col-12 mt-4 border-top pt-4">
//                         <div className="d-flex justify-content-between mb-3">
//                           <label className="fw-bold">
//                             <Clock size={18} className="text-primary me-2" />{" "}
//                             Shifts
//                           </label>
//                           <button
//                             type="button"
//                             className="btn btn-sm btn-outline-primary"
//                             onClick={addSlot}
//                           >
//                             + Add Shift
//                           </button>
//                         </div>
//                         <div className="p-3 bg-light rounded-4 border">
//                           {formData.slots.length === 0 ? (
//                             <div className="text-center py-3 text-muted small">
//                               No shifts added.
//                             </div>
//                           ) : (
//                             formData.slots.map((slot, index) => (
//                               <div
//                                 key={index}
//                                 className="row g-2 mb-2 align-items-center bg-white p-2 rounded shadow-sm"
//                               >
//                                 <div className="col-md-4">
//                                   <select
//                                     className="form-select form-select-sm"
//                                     value={slot.day}
//                                     onChange={(e) =>
//                                       updateSlot(index, "day", e.target.value)
//                                     }
//                                   >
//                                     {[
//                                       "MONDAY",
//                                       "TUESDAY",
//                                       "WEDNESDAY",
//                                       "THURSDAY",
//                                       "FRIDAY",
//                                       "SATURDAY",
//                                       "SUNDAY",
//                                     ].map((d) => (
//                                       <option key={d} value={d}>
//                                         {d}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </div>
//                                 <div className="col-md-3">
//                                   <input
//                                     type="time"
//                                     className="form-control form-control-sm"
//                                     value={slot.startTime}
//                                     onChange={(e) =>
//                                       updateSlot(
//                                         index,
//                                         "startTime",
//                                         e.target.value,
//                                       )
//                                     }
//                                     required
//                                   />
//                                 </div>
//                                 <div className="col-auto small text-muted">
//                                   to
//                                 </div>
//                                 <div className="col-md-3">
//                                   <input
//                                     type="time"
//                                     className="form-control form-control-sm"
//                                     value={slot.endTime}
//                                     onChange={(e) =>
//                                       updateSlot(
//                                         index,
//                                         "endTime",
//                                         e.target.value,
//                                       )
//                                     }
//                                     required
//                                   />
//                                 </div>
//                                 <div className="col text-end">
//                                   <button
//                                     type="button"
//                                     className="btn btn-sm btn-light text-danger"
//                                     onClick={() => removeSlot(index)}
//                                   >
//                                     <Trash2 size={14} />
//                                   </button>
//                                 </div>
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="modal-footer bg-light p-3 d-flex justify-content-end gap-2">
//                     <button
//                       type="button"
//                       className="btn btn-white rounded-pill px-4 fw-bold"
//                       onClick={() => setShowModal(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
//                       disabled={saving}
//                     >
//                       {saving ? (
//                         <>
//                           <Loader2 size={18} className="spin-animation" />{" "}
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <Save size={18} /> Save
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//       <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// };

// export default AdminDoctors;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom"; // ✅ Added to link to AdminCreateUser
// import {
//   Stethoscope,
//   Plus,
//   Edit,
//   Trash2,
//   Clock,
//   Save,
//   AlertCircle,
//   Mail,
//   Phone,
//   Briefcase,
//   DollarSign,
//   Loader2,
//   User,
//   FileText,
//   Activity,
//   CheckCircle,
//   Camera,
// } from "lucide-react";

// const AdminDoctors = () => {
//   const navigate = useNavigate(); // ✅ Initialize navigation
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [currentDoctorId, setCurrentDoctorId] = useState(null);

//   // ✅ Image Upload State (Exclusively for Edit Mode now)
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     email: "",
//     phone: "",
//     experience: 0,
//     consultationFee: 500,
//     slots: [],
//     isAvailable: true,
//   });

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/admin/doctors");
//       const data = res.data?.doctors || res.data || [];
//       setDoctors(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Failed to load doctor records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   // ✅ FIXED: Bulletproof image logic. Shows initials if no real photo exists.
//   const getDoctorImage = (doctor) => {
//     const imgSource = doctor?.image || doctor?.profilePhoto;

//     if (
//       imgSource &&
//       typeof imgSource === "string" &&
//       imgSource.trim() !== "" &&
//       imgSource !== "none" &&
//       !imgSource.includes("sample-doctor.jpg")
//     ) {
//       if (imgSource.startsWith("http")) return imgSource;
//       let cleanPath = imgSource.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
//       return `http://localhost:5000${cleanPath}`;
//     }

//     // Fallback UI Avatar
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || "Doctor")}&background=eff6ff&color=2563eb&size=150&font-size=0.33`;
//   };

//   // ✅ OPENS EDIT MODAL (No creation logic here anymore)
//   const handleEdit = (doctor) => {
//     setError("");
//     setCurrentDoctorId(doctor._id);
//     setFormData({
//       name: doctor.name || "",
//       speciality: doctor.speciality || "",
//       nmcNumber: doctor.nmcNumber || "",
//       email: doctor.email || "",
//       phone: doctor.phone || "",
//       experience: doctor.experience || 0,
//       consultationFee: doctor.consultationFee || 500,
//       slots: doctor.slots || [],
//       isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
//     });

//     // Set image preview if they already have one
//     setImagePreview(
//       doctor.image && doctor.image !== "none" ? getDoctorImage(doctor) : null,
//     );
//     setImageFile(null);
//     setShowModal(true);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const addSlot = () => {
//     setFormData({
//       ...formData,
//       slots: [
//         ...formData.slots,
//         { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
//       ],
//     });
//   };

//   const removeSlot = (index) => {
//     const newSlots = formData.slots.filter((_, i) => i !== index);
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...formData.slots];
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setFormData({ ...formData, slots: newSlots });
//   };

//   // ✅ ONLY HANDLES UPDATING EXISTING DOCTORS
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       setSaving(true);
//       const submitData = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (key === "slots")
//           submitData.append("slots", JSON.stringify(formData.slots));
//         else submitData.append(key, formData[key]);
//       });

//       // Attach the new image if admin uploaded one
//       if (imageFile) submitData.append("image", imageFile);

//       await api.put(`/admin/doctors/${currentDoctorId}`, submitData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setSuccess("Doctor profile updated successfully!");
//       setShowModal(false);
//       fetchDoctors();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update record.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (
//       window.confirm(
//         `Delete Dr. ${name}? This will remove them from the booking system.`,
//       )
//     ) {
//       try {
//         await api.delete(`/admin/doctors/${id}`);
//         fetchDoctors();
//       } catch (err) {
//         alert(err.response?.data?.message || "Delete failed.");
//       }
//     }
//   };

//   if (loading && doctors.length === 0) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary mb-3" size={48} />
//         <span className="fw-bold text-secondary tracking-wider text-uppercase small">
//           Loading Specialist Data...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
//       {/* --- HEADER SECTION --- */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
//         <div className="d-flex align-items-center gap-3">
//           <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle shadow-sm">
//             <Stethoscope size={28} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="fw-black mb-1 text-dark tracking-tight">
//               Doctors Management
//             </h3>
//             <p className="text-muted fw-medium mb-0 small">
//               Total Specialists Active:{" "}
//               <span className="fw-bold text-primary">{doctors.length}</span>
//             </p>
//           </div>
//         </div>
//         {/* ✅ DYNAMIC BUTTON: Redirects to User Creation Page */}
//         <button
//           className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift d-flex align-items-center"
//           onClick={() => navigate("/admin/create-user")}
//         >
//           <Plus size={18} className="me-2" /> Register New Specialist
//         </button>
//       </div>

//       {/* --- ALERTS --- */}
//       {success && (
//         <div className="alert alert-success d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold animate-fade-in">
//           <CheckCircle size={20} /> {success}
//         </div>
//       )}

//       {/* --- MAIN TABLE CARD --- */}
//       <div className="card-modern mb-4 bg-white shadow-sm rounded-4 border border-light-subtle overflow-hidden">
//         <div className="table-responsive custom-scrollbar">
//           <table className="table table-hover align-middle mb-0 custom-saas-table">
//             <thead className="bg-light">
//               <tr>
//                 <th className="ps-4 text-uppercase small fw-bold text-muted py-3">
//                   Specialist Profile
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Credentials
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Contact
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Schedule Overview
//                 </th>
//                 <th className="text-end pe-4 text-uppercase small fw-bold text-muted py-3">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-5 text-muted">
//                     <div className="d-flex flex-column align-items-center justify-content-center">
//                       <div className="bg-secondary bg-opacity-10 p-4 rounded-circle mb-3">
//                         <Stethoscope
//                           size={40}
//                           className="text-secondary opacity-50"
//                         />
//                       </div>
//                       <h5 className="fw-bolder text-dark mb-1">
//                         No Doctors Found
//                       </h5>
//                       <p className="fw-medium mb-0 small">
//                         Register a new specialist from User Management to see
//                         them here.
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 doctors.map((doc) => (
//                   <tr
//                     key={doc._id}
//                     className="transition-all hover-bg-light border-bottom border-light"
//                   >
//                     <td className="ps-4 py-3">
//                       <div className="d-flex align-items-center gap-3">
//                         <img
//                           src={getDoctorImage(doc)}
//                           alt={doc.name}
//                           className="rounded-circle object-fit-cover shadow-sm border border-light-subtle"
//                           style={{ width: "48px", height: "48px" }}
//                         />
//                         <div>
//                           <div className="fw-bolder text-dark mb-1 fs-6">
//                             {doc.name}
//                           </div>
//                           <div className="d-flex align-items-center gap-2">
//                             <span
//                               className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 shadow-sm"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               {doc.speciality || "General Physician"}
//                             </span>
//                             {!doc.isAvailable && (
//                               <span
//                                 className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1 shadow-sm"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Unavailable
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark d-flex align-items-center gap-1 fw-medium mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Briefcase size={14} className="text-muted" />{" "}
//                         {doc.experience || 0} Yrs Experience
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-1 mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <DollarSign size={14} className="text-success" /> Fee:
//                         NPR {doc.consultationFee || 500}
//                       </div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         <span className="fw-bold">NMC:</span>{" "}
//                         <span className="font-monospace">
//                           {doc.nmcNumber || "N/A"}
//                         </span>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark fw-medium d-flex align-items-center gap-2 mb-1"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Phone size={14} className="text-muted" />{" "}
//                         {doc.phone || "N/A"}
//                       </div>
//                       <div
//                         className="text-muted d-flex align-items-center gap-2"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Mail size={14} /> {doc.email || "N/A"}
//                       </div>
//                     </td>
//                     <td>
//                       {doc.slots && doc.slots.length > 0 ? (
//                         <div className="d-flex flex-column gap-1">
//                           {doc.slots.slice(0, 2).map((s, i) => (
//                             <div
//                               key={i}
//                               className="text-muted d-flex align-items-center gap-2"
//                               style={{ fontSize: "0.8rem" }}
//                             >
//                               <Clock size={12} className="text-primary" />
//                               <span
//                                 className="fw-bold text-dark"
//                                 style={{ width: "35px" }}
//                               >
//                                 {s.day ? s.day.slice(0, 3) : "UNK"}
//                               </span>
//                               <span>
//                                 {s.startTime} - {s.endTime}
//                               </span>
//                             </div>
//                           ))}
//                           {doc.slots.length > 2 && (
//                             <div
//                               className="text-primary small fw-bold"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               +{doc.slots.length - 2} more shifts
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">
//                           No Schedule Set
//                         </span>
//                       )}
//                     </td>
//                     <td className="pe-4 text-end">
//                       <button
//                         className="btn btn-sm btn-light text-primary rounded-circle p-2 mx-1 hover-lift shadow-sm border"
//                         onClick={() => handleEdit(doc)}
//                         title="Upload Image & Edit Details"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         className="btn btn-sm btn-light text-danger rounded-circle p-2 mx-1 hover-lift shadow-sm border"
//                         onClick={() => handleDelete(doc._id, doc.name)}
//                         title="Delete Doctor"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- EDIT MODAL (WITH IMAGE UPLOAD) --- */}
//       {showModal && (
//         <>
//           <div
//             className="modal-backdrop fade show"
//             style={{ zIndex: 1040 }}
//             onClick={() => setShowModal(false)}
//           ></div>
//           <div
//             className="modal show d-block animate-fade-in"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//           >
//             <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
//               <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//                 <div className="modal-header bg-light border-bottom border-light-subtle p-4 pb-3">
//                   <h5 className="modal-title fw-black text-dark d-flex align-items-center gap-2">
//                     <Edit className="text-primary" size={20} /> Update
//                     Specialist Profile
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close shadow-none bg-secondary bg-opacity-10 rounded-circle p-2"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <form
//                   onSubmit={handleSubmit}
//                   className="d-flex flex-column overflow-hidden"
//                 >
//                   <div className="modal-body p-4 pt-4 overflow-auto custom-scrollbar">
//                     {/* ✅ IMAGE UPLOADER IS HERE FOR EDITING */}
//                     <div className="d-flex flex-column align-items-center justify-content-center mb-4 pb-3 border-bottom border-light-subtle">
//                       <div className="position-relative">
//                         <img
//                           src={
//                             imagePreview ||
//                             getDoctorImage({
//                               name: formData.name,
//                               image: "none",
//                             })
//                           }
//                           alt="Doctor Preview"
//                           className="rounded-circle object-fit-cover shadow-sm border border-2 border-white"
//                           style={{ width: "100px", height: "100px" }}
//                         />
//                         <label
//                           htmlFor="doctor-image-upload"
//                           className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow cursor-pointer hover-lift border border-2 border-white d-flex align-items-center justify-content-center"
//                         >
//                           <Camera size={16} />
//                         </label>
//                         <input
//                           id="doctor-image-upload"
//                           type="file"
//                           className="d-none"
//                           accept="image/*"
//                           onChange={handleImageChange}
//                         />
//                       </div>
//                       <span className="text-muted small mt-2 fw-medium">
//                         Upload Profile Photo
//                       </span>
//                     </div>

//                     <div className="row g-4">
//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Full Name *
//                         </label>
//                         <div className="position-relative">
//                           <User
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.name}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 name: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Speciality *
//                         </label>
//                         <div className="position-relative">
//                           <Stethoscope
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.speciality}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 speciality: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           NMC Registration *
//                         </label>
//                         <div className="position-relative">
//                           <FileText
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.nmcNumber}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 nmcNumber: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Contact Number *
//                         </label>
//                         <div className="position-relative">
//                           <Phone
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.phone}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 phone: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Experience (Yrs)
//                         </label>
//                         <div className="position-relative">
//                           <Briefcase
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="number"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.experience}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 experience: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Fee (NPR)
//                         </label>
//                         <div className="position-relative">
//                           <DollarSign
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-success"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="number"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={formData.consultationFee}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 consultationFee: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Status
//                         </label>
//                         <div className="position-relative">
//                           <Activity
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <select
//                             className="form-select modern-input ps-5 border-light-subtle shadow-sm cursor-pointer fw-medium"
//                             value={formData.isAvailable}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 isAvailable: e.target.value === "true",
//                               })
//                             }
//                           >
//                             <option value="true" className="text-success">
//                               Available
//                             </option>
//                             <option value="false" className="text-danger">
//                               Unavailable
//                             </option>
//                           </select>
//                         </div>
//                       </div>

//                       <div className="col-md-12">
//                         <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                           Email Address
//                         </label>
//                         <div className="position-relative">
//                           <Mail
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="email"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm bg-light text-muted"
//                             value={formData.email}
//                             disabled={true}
//                           />
//                         </div>
//                       </div>

//                       {/* Weekly Schedule */}
//                       <div className="col-12 mt-4 border-top border-light-subtle pt-4">
//                         <div className="d-flex justify-content-between align-items-center mb-3">
//                           <label className="form-label fw-bold text-dark mb-0 d-flex align-items-center gap-2">
//                             <Clock size={18} className="text-primary" /> Weekly
//                             Shift Schedule
//                           </label>
//                           <button
//                             type="button"
//                             className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold hover-lift d-flex align-items-center gap-1 shadow-sm"
//                             onClick={addSlot}
//                           >
//                             <Plus size={14} /> Add Shift
//                           </button>
//                         </div>
//                         <div className="p-3 bg-light bg-opacity-50 rounded-4 border border-light-subtle">
//                           {formData.slots.length === 0 ? (
//                             <div className="text-center py-4 text-muted small fw-medium">
//                               No working shifts added yet.
//                             </div>
//                           ) : (
//                             formData.slots.map((slot, index) => (
//                               <div
//                                 key={index}
//                                 className="row g-2 mb-2 align-items-center bg-white p-2 rounded-3 shadow-sm border border-light-subtle"
//                               >
//                                 <div className="col-md-4">
//                                   <select
//                                     className="form-select form-select-sm modern-input border-light-subtle fw-medium text-dark cursor-pointer"
//                                     value={slot.day}
//                                     onChange={(e) =>
//                                       updateSlot(index, "day", e.target.value)
//                                     }
//                                   >
//                                     {[
//                                       "MONDAY",
//                                       "TUESDAY",
//                                       "WEDNESDAY",
//                                       "THURSDAY",
//                                       "FRIDAY",
//                                       "SATURDAY",
//                                       "SUNDAY",
//                                     ].map((d) => (
//                                       <option key={d} value={d}>
//                                         {d}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </div>
//                                 <div className="col-md-3">
//                                   <input
//                                     type="time"
//                                     className="form-control form-control-sm modern-input border-light-subtle text-center fw-medium"
//                                     value={slot.startTime}
//                                     onChange={(e) =>
//                                       updateSlot(
//                                         index,
//                                         "startTime",
//                                         e.target.value,
//                                       )
//                                     }
//                                     required
//                                   />
//                                 </div>
//                                 <div className="col-auto text-muted fw-bold small">
//                                   to
//                                 </div>
//                                 <div className="col-md-3">
//                                   <input
//                                     type="time"
//                                     className="form-control form-control-sm modern-input border-light-subtle text-center fw-medium"
//                                     value={slot.endTime}
//                                     onChange={(e) =>
//                                       updateSlot(
//                                         index,
//                                         "endTime",
//                                         e.target.value,
//                                       )
//                                     }
//                                     required
//                                   />
//                                 </div>
//                                 <div className="col text-end">
//                                   <button
//                                     type="button"
//                                     className="btn btn-sm btn-light text-danger rounded-circle p-2 hover-lift border shadow-sm"
//                                     onClick={() => removeSlot(index)}
//                                     title="Remove Shift"
//                                   >
//                                     <Trash2 size={14} />
//                                   </button>
//                                 </div>
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="modal-footer bg-light border-top border-light-subtle p-3 d-flex justify-content-end">
//                     <div className="d-flex gap-2">
//                       <button
//                         type="button"
//                         className="btn btn-white rounded-pill px-4 fw-bold border shadow-sm hover-lift text-secondary"
//                         onClick={() => setShowModal(false)}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className={`btn btn-primary rounded-pill px-4 shadow-sm fw-bold hover-lift d-flex align-items-center gap-2`}
//                         disabled={saving}
//                       >
//                         {saving ? (
//                           <>
//                             <Loader2 size={18} className="spin-animation" />{" "}
//                             Saving...
//                           </>
//                         ) : (
//                           <>
//                             <Save size={18} /> Save Changes
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//       <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// };

// export default AdminDoctors;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";
// import {
//   Stethoscope,
//   Plus,
//   Edit,
//   Trash2,
//   Clock,
//   Save,
//   AlertCircle,
//   Mail,
//   Phone,
//   Briefcase,
//   DollarSign,
//   Loader2,
//   User,
//   FileText,
//   Activity,
//   CheckCircle,
//   Camera,
// } from "lucide-react";

// const AdminDoctors = () => {
//   const navigate = useNavigate();
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [currentDoctorId, setCurrentDoctorId] = useState(null);

//   // Image Upload State
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     email: "",
//     phone: "",
//     experience: 0,
//     consultationFee: 500,
//     slots: [],
//     isAvailable: true,
//   });

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/admin/doctors");
//       const data = res.data?.doctors || res.data || [];
//       setDoctors(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError("Failed to load doctor records.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   // ✅ DYNAMIC IMAGE URL RESOLVER
//   const getDoctorImage = (doctor) => {
//     const imgSource = doctor?.image || doctor?.profilePhoto;

//     if (
//       imgSource &&
//       typeof imgSource === "string" &&
//       imgSource.trim() !== "" &&
//       imgSource !== "none" &&
//       !imgSource.includes("sample-doctor.jpg")
//     ) {
//       if (imgSource.startsWith("http")) return imgSource;

//       let cleanPath = imgSource.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;

//       // Dynamically get the base URL from your API config (removes '/api' from the end)
//       const baseUrl = api.defaults.baseURL
//         ? api.defaults.baseURL.replace(/\/api\/?$/, "")
//         : "http://localhost:5000";
//       return `${baseUrl}${cleanPath}`;
//     }

//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || "Doctor")}&background=eff6ff&color=2563eb&size=150&font-size=0.33`;
//   };

//   const handleEdit = (doctor) => {
//     setError("");
//     setCurrentDoctorId(doctor._id);
//     setFormData({
//       name: doctor.name || "",
//       speciality: doctor.speciality || "",
//       nmcNumber: doctor.nmcNumber || "",
//       email: doctor.email || "",
//       phone: doctor.phone || "",
//       experience: doctor.experience || 0,
//       consultationFee: doctor.consultationFee || 500,
//       slots: doctor.slots || [],
//       isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
//     });

//     setImagePreview(
//       doctor.image && doctor.image !== "none" ? getDoctorImage(doctor) : null,
//     );
//     setImageFile(null);
//     setShowModal(true);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const addSlot = () => {
//     setFormData({
//       ...formData,
//       slots: [
//         ...formData.slots,
//         { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
//       ],
//     });
//   };

//   const removeSlot = (index) => {
//     const newSlots = formData.slots.filter((_, i) => i !== index);
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...formData.slots];
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setFormData({ ...formData, slots: newSlots });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       setSaving(true);
//       const submitData = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (key === "slots")
//           submitData.append("slots", JSON.stringify(formData.slots));
//         else submitData.append(key, formData[key]);
//       });
//       if (imageFile) submitData.append("image", imageFile);

//       await api.put(`/admin/doctors/${currentDoctorId}`, submitData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setSuccess("Doctor profile updated successfully!");
//       setShowModal(false);
//       fetchDoctors();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update record.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (
//       window.confirm(
//         `Delete Dr. ${name}? This will remove them from the booking system.`,
//       )
//     ) {
//       try {
//         await api.delete(`/admin/doctors/${id}`);
//         fetchDoctors();
//       } catch (err) {
//         alert(err.response?.data?.message || "Delete failed.");
//       }
//     }
//   };

//   if (loading && doctors.length === 0) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary mb-3" size={48} />
//         <span className="fw-bold text-secondary tracking-wider text-uppercase small">
//           Loading Specialist Data...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
//         <div className="d-flex align-items-center gap-3">
//           <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle shadow-sm">
//             <Stethoscope size={28} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="fw-black mb-1 text-dark tracking-tight">
//               Doctors Management
//             </h3>
//             <p className="text-muted fw-medium mb-0 small">
//               Total Specialists Active:{" "}
//               <span className="fw-bold text-primary">{doctors.length}</span>
//             </p>
//           </div>
//         </div>
//         <button
//           className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold hover-lift d-flex align-items-center"
//           onClick={() => navigate("/admin/create-user")}
//         >
//           <Plus size={18} className="me-2" /> Register New Specialist
//         </button>
//       </div>

//       {success && (
//         <div className="alert alert-success d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold animate-fade-in">
//           <CheckCircle size={20} /> {success}
//         </div>
//       )}

//       <div className="card-modern mb-4 bg-white shadow-sm rounded-4 border border-light-subtle overflow-hidden">
//         <div className="table-responsive custom-scrollbar">
//           <table className="table table-hover align-middle mb-0 custom-saas-table">
//             <thead className="bg-light">
//               <tr>
//                 <th className="ps-4 text-uppercase small fw-bold text-muted py-3">
//                   Specialist Profile
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Credentials
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Contact
//                 </th>
//                 <th className="text-uppercase small fw-bold text-muted py-3">
//                   Schedule Overview
//                 </th>
//                 <th className="text-end pe-4 text-uppercase small fw-bold text-muted py-3">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.map((doc) => (
//                 <tr
//                   key={doc._id}
//                   className="transition-all hover-bg-light border-bottom border-light"
//                 >
//                   <td className="ps-4 py-3">
//                     <div className="d-flex align-items-center gap-3">
//                       {/* ✅ ON-ERROR IMAGE FALLBACK: Never shows a broken image icon */}
//                       <img
//                         src={getDoctorImage(doc)}
//                         alt={doc.name}
//                         className="rounded-circle object-fit-cover shadow-sm border border-light-subtle bg-light"
//                         style={{ width: "48px", height: "48px" }}
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || "Doctor")}&background=eff6ff&color=2563eb&size=150&font-size=0.33`;
//                         }}
//                       />
//                       <div>
//                         <div className="fw-bolder text-dark mb-1 fs-6">
//                           {doc.name}
//                         </div>
//                         <div className="d-flex align-items-center gap-2">
//                           <span
//                             className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 shadow-sm"
//                             style={{ fontSize: "0.7rem" }}
//                           >
//                             {doc.speciality || "General Physician"}
//                           </span>
//                           {!doc.isAvailable && (
//                             <span
//                               className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1 shadow-sm"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               Unavailable
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td>
//                     <div
//                       className="text-dark d-flex align-items-center gap-1 fw-medium mb-1"
//                       style={{ fontSize: "0.85rem" }}
//                     >
//                       <Briefcase size={14} className="text-muted" />{" "}
//                       {doc.experience || 0} Yrs Experience
//                     </div>
//                     <div
//                       className="text-muted d-flex align-items-center gap-1 mb-1"
//                       style={{ fontSize: "0.85rem" }}
//                     >
//                       <DollarSign size={14} className="text-success" /> Fee: NPR{" "}
//                       {doc.consultationFee || 500}
//                     </div>
//                     <div className="text-muted" style={{ fontSize: "0.75rem" }}>
//                       <span className="fw-bold">NMC:</span>{" "}
//                       <span className="font-monospace">
//                         {doc.nmcNumber || "N/A"}
//                       </span>
//                     </div>
//                   </td>
//                   <td>
//                     <div
//                       className="text-dark fw-medium d-flex align-items-center gap-2 mb-1"
//                       style={{ fontSize: "0.85rem" }}
//                     >
//                       <Phone size={14} className="text-muted" />{" "}
//                       {doc.phone || "N/A"}
//                     </div>
//                     <div
//                       className="text-muted d-flex align-items-center gap-2"
//                       style={{ fontSize: "0.85rem" }}
//                     >
//                       <Mail size={14} /> {doc.email || "N/A"}
//                     </div>
//                   </td>
//                   <td>
//                     {doc.slots && doc.slots.length > 0 ? (
//                       <div className="d-flex flex-column gap-1">
//                         {doc.slots.slice(0, 2).map((s, i) => (
//                           <div
//                             key={i}
//                             className="text-muted d-flex align-items-center gap-2"
//                             style={{ fontSize: "0.8rem" }}
//                           >
//                             <Clock size={12} className="text-primary" />
//                             <span
//                               className="fw-bold text-dark"
//                               style={{ width: "35px" }}
//                             >
//                               {s.day ? s.day.slice(0, 3) : "UNK"}
//                             </span>
//                             <span>
//                               {s.startTime} - {s.endTime}
//                             </span>
//                           </div>
//                         ))}
//                         {doc.slots.length > 2 && (
//                           <div
//                             className="text-primary small fw-bold"
//                             style={{ fontSize: "0.7rem" }}
//                           >
//                             +{doc.slots.length - 2} more shifts
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <span className="badge bg-secondary bg-opacity-10 text-secondary border px-2 py-1">
//                         No Schedule
//                       </span>
//                     )}
//                   </td>
//                   <td className="pe-4 text-end">
//                     <button
//                       className="btn btn-sm btn-light text-primary rounded-circle p-2 mx-1 hover-lift shadow-sm border"
//                       onClick={() => handleEdit(doc)}
//                     >
//                       <Edit size={16} />
//                     </button>
//                     <button
//                       className="btn btn-sm btn-light text-danger rounded-circle p-2 mx-1 hover-lift shadow-sm border"
//                       onClick={() => handleDelete(doc._id, doc.name)}
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- EDIT MODAL --- */}
//       {showModal && (
//         <>
//           <div
//             className="modal-backdrop fade show"
//             style={{ zIndex: 1040 }}
//             onClick={() => setShowModal(false)}
//           ></div>
//           <div
//             className="modal show d-block animate-fade-in"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//           >
//             <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
//               <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//                 <div className="modal-header bg-light border-bottom border-light-subtle p-4 pb-3">
//                   <h5 className="modal-title fw-black text-dark d-flex align-items-center gap-2">
//                     <Edit className="text-primary" size={20} /> Update
//                     Specialist Profile
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close shadow-none bg-secondary bg-opacity-10 rounded-circle p-2"
//                     onClick={() => setShowModal(false)}
//                   ></button>
//                 </div>

//                 <form
//                   onSubmit={handleSubmit}
//                   className="d-flex flex-column overflow-hidden"
//                 >
//                   <div className="modal-body p-4 pt-4 overflow-auto custom-scrollbar">
//                     {/* Image Uploader */}
//                     <div className="d-flex flex-column align-items-center justify-content-center mb-4 pb-3 border-bottom border-light-subtle">
//                       <div className="position-relative">
//                         <img
//                           src={
//                             imagePreview ||
//                             getDoctorImage(
//                               doctors.find((d) => d._id === currentDoctorId),
//                             )
//                           }
//                           alt="Preview"
//                           className="rounded-circle object-fit-cover shadow-sm border border-2 border-white bg-light"
//                           style={{ width: "100px", height: "100px" }}
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "Doctor")}&background=eff6ff&color=2563eb&size=150&font-size=0.33`;
//                           }}
//                         />
//                         <label
//                           htmlFor="doctor-image-upload"
//                           className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow cursor-pointer hover-lift border border-2 border-white d-flex align-items-center justify-content-center"
//                         >
//                           <Camera size={16} />
//                         </label>
//                         <input
//                           id="doctor-image-upload"
//                           type="file"
//                           className="d-none"
//                           accept="image/*"
//                           onChange={handleImageChange}
//                         />
//                       </div>
//                       <span className="text-muted small mt-2 fw-medium">
//                         Upload Profile Photo
//                       </span>
//                     </div>

//                     <div className="row g-4">
//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary">
//                           Full Name
//                         </label>
//                         <div className="position-relative">
//                           <User
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 shadow-sm"
//                             value={formData.name}
//                             onChange={(e) =>
//                               setFormData({ ...formData, name: e.target.value })
//                             }
//                             required
//                           />
//                         </div>
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary">
//                           Speciality
//                         </label>
//                         <div className="position-relative">
//                           <Stethoscope
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 shadow-sm"
//                             value={formData.speciality}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 speciality: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary">
//                           NMC Registration
//                         </label>
//                         <div className="position-relative">
//                           <FileText
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 shadow-sm"
//                             value={formData.nmcNumber}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 nmcNumber: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label small fw-bold text-secondary">
//                           Contact Number
//                         </label>
//                         <div className="position-relative">
//                           <Phone
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="text"
//                             className="form-control modern-input ps-5 shadow-sm"
//                             value={formData.phone}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 phone: e.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary">
//                           Experience (Yrs)
//                         </label>
//                         <div className="position-relative">
//                           <Briefcase
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="number"
//                             className="form-control modern-input ps-5 shadow-sm"
//                             value={formData.experience}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 experience: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary">
//                           Fee (NPR)
//                         </label>
//                         <div className="position-relative">
//                           <DollarSign
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-success"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="number"
//                             className="form-control modern-input ps-5 shadow-sm"
//                             value={formData.consultationFee}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 consultationFee: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label small fw-bold text-secondary">
//                           Status
//                         </label>
//                         <div className="position-relative">
//                           <Activity
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <select
//                             className="form-select modern-input ps-5 shadow-sm"
//                             value={formData.isAvailable}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 isAvailable: e.target.value === "true",
//                               })
//                             }
//                           >
//                             <option value="true" className="text-success">
//                               Available
//                             </option>
//                             <option value="false" className="text-danger">
//                               Unavailable
//                             </option>
//                           </select>
//                         </div>
//                       </div>
//                       <div className="col-md-12">
//                         <label className="form-label small fw-bold text-secondary">
//                           Email Address
//                         </label>
//                         <div className="position-relative">
//                           <Mail
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="email"
//                             className="form-control modern-input ps-5 shadow-sm bg-light text-muted"
//                             value={formData.email}
//                             disabled
//                           />
//                         </div>
//                       </div>

//                       <div className="col-12 mt-4 border-top border-light-subtle pt-4">
//                         <div className="d-flex justify-content-between mb-3">
//                           <label className="fw-bold">
//                             <Clock size={18} className="text-primary me-2" />{" "}
//                             Weekly Shifts
//                           </label>
//                           <button
//                             type="button"
//                             className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
//                             onClick={addSlot}
//                           >
//                             + Add Shift
//                           </button>
//                         </div>
//                         <div className="p-3 bg-light rounded-4 border">
//                           {formData.slots.length === 0 ? (
//                             <div className="text-center py-4 text-muted small">
//                               No working shifts added yet.
//                             </div>
//                           ) : (
//                             formData.slots.map((slot, index) => (
//                               <div
//                                 key={index}
//                                 className="row g-2 mb-2 align-items-center bg-white p-2 rounded-3 shadow-sm border"
//                               >
//                                 <div className="col-md-4">
//                                   <select
//                                     className="form-select form-select-sm"
//                                     value={slot.day}
//                                     onChange={(e) =>
//                                       updateSlot(index, "day", e.target.value)
//                                     }
//                                   >
//                                     {[
//                                       "MONDAY",
//                                       "TUESDAY",
//                                       "WEDNESDAY",
//                                       "THURSDAY",
//                                       "FRIDAY",
//                                       "SATURDAY",
//                                       "SUNDAY",
//                                     ].map((d) => (
//                                       <option key={d} value={d}>
//                                         {d}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </div>
//                                 <div className="col-md-3">
//                                   <input
//                                     type="time"
//                                     className="form-control form-control-sm"
//                                     value={slot.startTime}
//                                     onChange={(e) =>
//                                       updateSlot(
//                                         index,
//                                         "startTime",
//                                         e.target.value,
//                                       )
//                                     }
//                                     required
//                                   />
//                                 </div>
//                                 <div className="col-auto text-muted small">
//                                   to
//                                 </div>
//                                 <div className="col-md-3">
//                                   <input
//                                     type="time"
//                                     className="form-control form-control-sm"
//                                     value={slot.endTime}
//                                     onChange={(e) =>
//                                       updateSlot(
//                                         index,
//                                         "endTime",
//                                         e.target.value,
//                                       )
//                                     }
//                                     required
//                                   />
//                                 </div>
//                                 <div className="col text-end">
//                                   <button
//                                     type="button"
//                                     className="btn btn-sm btn-light text-danger rounded-circle p-2"
//                                     onClick={() => removeSlot(index)}
//                                   >
//                                     <Trash2 size={14} />
//                                   </button>
//                                 </div>
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="modal-footer bg-light p-3 d-flex justify-content-end gap-2">
//                     <button
//                       type="button"
//                       className="btn btn-white rounded-pill px-4 fw-bold shadow-sm"
//                       onClick={() => setShowModal(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
//                       disabled={saving}
//                     >
//                       {saving ? (
//                         <>
//                           <Loader2 size={18} className="spin-animation" />{" "}
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <Save size={18} /> Save Changes
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//       <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// };

// export default AdminDoctors;

import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Plus,
  Edit,
  Trash2,
  Clock,
  Save,
  AlertCircle,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Loader2,
  User,
  FileText,
  Activity,
  CheckCircle,
  Camera,
  X,
  UserPlus,
} from "lucide-react";

const AdminDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentDoctorId, setCurrentDoctorId] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    nmcNumber: "",
    email: "",
    phone: "",
    experience: 0,
    consultationFee: 500,
    slots: [],
    isAvailable: true,
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/doctors");
      const data = res.data?.doctors || res.data || [];
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load doctor records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const getDoctorImage = (doctor) => {
    const imgSource = doctor?.image || doctor?.profilePhoto;
    if (
      imgSource &&
      typeof imgSource === "string" &&
      imgSource.trim() !== "" &&
      imgSource !== "none"
    ) {
      if (imgSource.startsWith("http")) return imgSource;
      const baseUrl = api.defaults.baseURL
        ? api.defaults.baseURL.replace(/\/api\/?$/, "")
        : "http://localhost:5000";
      return `${baseUrl}${imgSource.replace(/\\/g, "/").startsWith("/") ? "" : "/"}${imgSource.replace(/\\/g, "/")}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || "Doctor")}&background=f0f2f2&color=007185&size=150`;
  };

  const handleEdit = (doctor) => {
    setError("");
    setCurrentDoctorId(doctor._id);
    setFormData({
      name: doctor.name || "",
      speciality: doctor.speciality || "",
      nmcNumber: doctor.nmcNumber || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      experience: doctor.experience || 0,
      consultationFee: doctor.consultationFee || 500,
      slots: doctor.slots || [],
      isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
    });
    setImagePreview(getDoctorImage(doctor));
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addSlot = () => {
    setFormData({
      ...formData,
      slots: [
        ...formData.slots,
        { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
      ],
    });
  };

  const removeSlot = (index) => {
    setFormData({
      ...formData,
      slots: formData.slots.filter((_, i) => i !== index),
    });
  };

  const updateSlot = (index, field, value) => {
    const newSlots = [...formData.slots];
    newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
    setFormData({ ...formData, slots: newSlots });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSaving(true);
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "slots")
          submitData.append("slots", JSON.stringify(formData.slots));
        else submitData.append(key, formData[key]);
      });
      if (imageFile) submitData.append("image", imageFile);

      await api.put(`/admin/doctors/${currentDoctorId}`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Specialist profile synchronized successfully!");
      setShowModal(false);
      fetchDoctors();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update record.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Permanently delete Dr. ${name}?`)) {
      try {
        await api.delete(`/admin/doctors/${id}`);
        fetchDoctors();
      } catch (err) {
        alert("Delete failed. Specialist may have active appointments.");
      }
    }
  };

  if (loading && doctors.length === 0) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <Loader2
          className="spin-animation"
          style={{ color: "#007185" }}
          size={48}
        />
        <span className="mt-3 text-muted small fw-bold">
          RETRIEVING SPECIALIST DIRECTORY...
        </span>
      </div>
    );
  }

  return (
    <div
      className="container-fluid p-3 p-md-4 animate-fade-in"
      style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
    >
      {/* Header Area */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary-subtle flex-wrap gap-3">
        <div>
          <h2
            className="fw-bold mb-1 d-flex align-items-center gap-2"
            style={{ color: "#0F1111", fontSize: "1.5rem" }}
          >
            <Stethoscope style={{ color: "#007185" }} size={24} /> Doctors
            Management
          </h2>
          <p className="small mb-0" style={{ color: "#565959" }}>
            Review specialist credentials, consultation fees, and shift
            availability.
          </p>
        </div>

        <button
          className="btn btn-warning shadow-sm d-flex align-items-center gap-2 py-2 px-4 border-0 fw-medium"
          style={{
            backgroundColor: "#FFD814",
            borderRadius: "8px",
            color: "#0F1111",
          }}
          onClick={() => navigate("/admin/users")}
        >
          <UserPlus size={18} /> Register New Specialist
        </button>
      </div>

      {success && (
        <div
          className="alert border-0 shadow-sm mb-4 rounded-1 d-flex align-items-center gap-2"
          style={{
            backgroundColor: "#f2fcf5",
            color: "#067D62",
            borderLeft: "4px solid #067D62",
          }}
        >
          <CheckCircle size={20} /> {success}
        </div>
      )}

      {/* Main Table Card */}
      <div
        className="card shadow-sm border bg-white rounded-1 overflow-hidden"
        style={{ borderColor: "#D5D9D9" }}
      >
        <div className="table-responsive">
          <table className="table align-middle mb-0 border-0">
            <thead className="bg-light">
              <tr style={{ borderBottom: "1px solid #D5D9D9" }}>
                <th
                  className="ps-4 py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem" }}
                >
                  Specialist Profile
                </th>
                <th
                  className="py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem" }}
                >
                  Experience & Fee
                </th>
                <th
                  className="py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem" }}
                >
                  Contact
                </th>
                <th
                  className="py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem" }}
                >
                  Schedule
                </th>
                <th
                  className="py-2 text-end pe-4 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc._id} className="aws-table-row border-bottom">
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={getDoctorImage(doc)}
                        alt={doc.name}
                        className="rounded-circle border"
                        style={{
                          width: "45px",
                          height: "45px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <div
                          className="fw-bold"
                          style={{ color: "#0F1111", fontSize: "0.9rem" }}
                        >
                          {doc.name}
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span
                            className="small fw-medium"
                            style={{ color: "#007185" }}
                          >
                            {doc.speciality}
                          </span>
                          {!doc.isAvailable && (
                            <span
                              className="badge rounded-1"
                              style={{
                                backgroundColor: "#fef0f0",
                                color: "#B12704",
                                border: "1px solid #B12704",
                                fontSize: "0.6rem",
                              }}
                            >
                              OFF-DUTY
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small mb-1 text-dark">
                      {doc.experience} Yrs Exp.
                    </div>
                    <div
                      className="fw-bold"
                      style={{ color: "#B12704", fontSize: "0.85rem" }}
                    >
                      NPR {doc.consultationFee}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small d-flex align-items-center gap-2 mb-1">
                      <Phone size={12} className="text-muted" /> {doc.phone}
                    </div>
                    <div className="small d-flex align-items-center gap-2 text-muted">
                      <Mail size={12} /> {doc.email}
                    </div>
                  </td>
                  <td className="py-3">
                    {doc.slots?.length > 0 ? (
                      <div className="d-flex flex-column gap-1">
                        {doc.slots.slice(0, 2).map((s, i) => (
                          <div
                            key={i}
                            className="small d-flex align-items-center gap-2"
                            style={{ fontSize: "0.75rem" }}
                          >
                            <Clock size={12} style={{ color: "#007185" }} />
                            <span className="fw-bold text-dark">
                              {s.day.slice(0, 3)}:
                            </span>{" "}
                            {s.startTime}-{s.endTime}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted small italic">Not Set</span>
                    )}
                  </td>
                  <td className="text-end pe-4 py-3">
                    <div className="btn-group shadow-sm rounded-1 overflow-hidden border">
                      <button
                        className="btn btn-sm btn-white border-0"
                        onClick={() => handleEdit(doc)}
                        title="Edit Profile"
                      >
                        <Edit size={16} style={{ color: "#007185" }} />
                      </button>
                      <button
                        className="btn btn-sm btn-white border-0 border-start"
                        onClick={() => handleDelete(doc._id, doc.name)}
                        title="Delete"
                      >
                        <Trash2 size={16} style={{ color: "#B12704" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- REFINED EDIT MODAL --- */}
      {showModal && (
        <div
          className="modal-overlay d-flex justify-content-center align-items-center animate-fade-in"
          style={{ zIndex: 2000 }}
        >
          <div
            className="modal-content bg-white shadow-lg rounded-1 border overflow-hidden"
            style={{ maxWidth: "850px", width: "95%", borderColor: "#D5D9D9" }}
          >
            <div className="modal-header bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
                Update Specialist Profile: {formData.name}
              </h6>
              <button
                className="btn p-0 border-0"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4"
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              {/* Image & Basic Info */}
              <div className="row g-4 mb-4">
                <div className="col-md-3 text-center border-end">
                  <div className="position-relative d-inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="rounded-circle border shadow-sm"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <label
                      htmlFor="modal-image"
                      className="position-absolute bottom-0 end-0 bg-white border rounded-circle p-1 cursor-pointer shadow-sm"
                    >
                      <Camera size={16} />
                    </label>
                    <input
                      id="modal-image"
                      type="file"
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="x-small text-muted mt-2">
                    Update Profile Image
                  </p>
                </div>
                <div className="col-md-9">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold mb-1">Full Name</label>
                      <input
                        type="text"
                        className="form-control amazon-input shadow-none"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold mb-1">
                        Medical Speciality
                      </label>
                      <input
                        type="text"
                        className="form-control amazon-input shadow-none"
                        value={formData.speciality}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            speciality: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold mb-1">NMC Number</label>
                      <input
                        type="text"
                        className="form-control amazon-input shadow-none"
                        value={formData.nmcNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nmcNumber: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold mb-1">Availability</label>
                      <select
                        className="form-select amazon-input shadow-none"
                        value={formData.isAvailable}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isAvailable: e.target.value === "true",
                          })
                        }
                      >
                        <option value="true">Active / Available</option>
                        <option value="false">On Leave / Unavailable</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Finance & Contact */}
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="small fw-bold mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    className="form-control amazon-input shadow-none"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="small fw-bold mb-1">
                    Consultation Fee (NPR)
                  </label>
                  <input
                    type="number"
                    className="form-control amazon-input shadow-none"
                    value={formData.consultationFee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consultationFee: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="small fw-bold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    className="form-control amazon-input shadow-none"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Weekly Shifts */}
              <div className="border rounded p-3 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0 small text-uppercase">
                    Weekly Shift Schedule
                  </h6>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary fw-bold"
                    onClick={addSlot}
                  >
                    + Add Shift
                  </button>
                </div>
                {formData.slots.map((slot, index) => (
                  <div
                    key={index}
                    className="row g-2 mb-2 align-items-center bg-white p-2 border rounded shadow-xs"
                  >
                    <div className="col-md-4">
                      <select
                        className="form-select form-select-sm"
                        value={slot.day}
                        onChange={(e) =>
                          updateSlot(index, "day", e.target.value)
                        }
                      >
                        {[
                          "MONDAY",
                          "TUESDAY",
                          "WEDNESDAY",
                          "THURSDAY",
                          "FRIDAY",
                          "SATURDAY",
                          "SUNDAY",
                        ].map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="time"
                        className="form-control form-control-sm"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateSlot(index, "startTime", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-auto text-muted small">to</div>
                    <div className="col-md-3">
                      <input
                        type="time"
                        className="form-control form-control-sm"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateSlot(index, "endTime", e.target.value)
                        }
                      />
                    </div>
                    <div className="col text-end">
                      <button
                        type="button"
                        className="btn btn-sm text-danger"
                        onClick={() => removeSlot(index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-end mt-4">
                <button
                  type="button"
                  className="btn btn-white border px-4 me-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-warning px-5 shadow-sm border-0 fw-bold"
                  style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
                >
                  {saving ? (
                    <Loader2 className="spin-animation" size={18} />
                  ) : (
                    "Synchronize Record"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .amazon-input:focus { border-color: #e47911 !important; box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; }
        .aws-table-row:hover { background-color: #f8f9fa; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
      `}</style>
    </div>
  );
};

export default AdminDoctors;
