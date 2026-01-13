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

import React, { useState, useEffect } from "react";
import api from "../services/api";
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
} from "lucide-react";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDoctorId, setCurrentDoctorId] = useState(null);

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

  const handleEdit = (doctor) => {
    setError("");
    setIsEditing(true);
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
    setShowModal(true);
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
    const newSlots = formData.slots.filter((_, i) => i !== index);
    setFormData({ ...formData, slots: newSlots });
  };

  const updateSlot = (index, field, value) => {
    const newSlots = [...formData.slots];
    newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
    setFormData({ ...formData, slots: newSlots });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      if (isEditing) {
        await api.put(`/admin/doctors/${currentDoctorId}`, formData);
        setSuccess("Doctor profile updated successfully!");
      } else {
        await api.post("/admin/doctors", formData);
        setSuccess("Doctor registered successfully!");
      }

      setShowModal(false);
      resetForm();
      fetchDoctors();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save record.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (
      window.confirm(
        `Delete ${name}? This will remove them from the booking system.`
      )
    ) {
      try {
        await api.delete(`/admin/doctors/${id}`);
        fetchDoctors();
      } catch (err) {
        alert(err.response?.data?.message || "Delete failed.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
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
    setIsEditing(false);
    setCurrentDoctorId(null);
  };

  if (loading && doctors.length === 0)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  return (
    <div className="container-fluid p-0 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold d-flex align-items-center gap-2">
          <Stethoscope className="text-primary" /> Doctors Management
        </h3>
        <button
          className="btn btn-primary rounded-pill px-4 shadow-sm"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus size={18} className="me-2" /> Register Doctor
        </button>
      </div>

      {success && (
        <div className="alert alert-success border-0 shadow-sm text-center">
          {success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-uppercase fw-bold text-muted">
                <th className="ps-4">Specialist</th>
                <th>Credentials</th>
                <th>Contact</th>
                <th>Schedule</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc._id}>
                  <td className="ps-4">
                    <div className="fw-bold text-dark">{doc.name}</div>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle me-1">
                      {doc.speciality}
                    </span>
                    {!doc.isAvailable && (
                      <span className="badge bg-danger">Unavailable</span>
                    )}
                  </td>
                  <td>
                    <div className="small text-muted d-flex align-items-center gap-1">
                      <Briefcase size={12} /> {doc.experience} Yrs Exp.
                    </div>
                    <div className="small text-muted d-flex align-items-center gap-1">
                      <DollarSign size={12} /> Fee: Rs. {doc.consultationFee}
                    </div>
                    <div
                      className="small text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      NMC: {doc.nmcNumber}
                    </div>
                  </td>
                  <td>
                    <div className="small text-dark fw-medium">
                      <Phone size={12} className="me-1" /> {doc.phone || "N/A"}
                    </div>
                    <div className="small text-muted">
                      <Mail size={12} className="me-1" /> {doc.email || "N/A"}
                    </div>
                  </td>
                  <td>
                    {/* ✅ FIX IS HERE: Added safety check (s.day || "") before .slice() */}
                    {doc.slots && doc.slots.length > 0 ? (
                      doc.slots.map((s, i) => (
                        <div key={i} className="small text-muted">
                          <Clock size={12} className="me-1" />
                          <span className="fw-bold">
                            {s.day ? s.day.slice(0, 3) : "UNK"}
                          </span>
                          : {s.startTime}-{s.endTime}
                        </div>
                      ))
                    ) : (
                      <span className="text-muted small fst-italic">
                        No slots configured
                      </span>
                    )}
                  </td>
                  <td className="text-end pe-4">
                    <button
                      className="btn btn-sm btn-outline-primary border-0 me-2"
                      onClick={() => handleEdit(doc)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger border-0"
                      onClick={() => handleDelete(doc._id, doc.name)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div
          className="modal show d-block animate-fade-in"
          style={{ background: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-bottom px-4">
                  <h5 className="fw-bold m-0">
                    {isEditing
                      ? "Update Specialist Info"
                      : "New Doctor Registration"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close shadow-none"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="form-control border-2 shadow-none"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        Speciality *
                      </label>
                      <input
                        type="text"
                        className="form-control border-2 shadow-none"
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
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        NMC Registration *
                      </label>
                      <input
                        type="text"
                        className="form-control border-2 shadow-none"
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
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        Contact Number *
                      </label>
                      <input
                        type="text"
                        className="form-control border-2 shadow-none"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                        placeholder="+977-..."
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        Experience (Yrs)
                      </label>
                      <input
                        type="number"
                        className="form-control border-2 shadow-none"
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        Fee (Rs.)
                      </label>
                      <input
                        type="number"
                        className="form-control border-2 shadow-none"
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
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        System Status
                      </label>
                      <select
                        className="form-select border-2 shadow-none"
                        value={formData.isAvailable}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isAvailable: e.target.value === "true",
                          })
                        }
                      >
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                      </select>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control border-2 shadow-none"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-12 mt-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label small fw-bold text-primary mb-0 text-uppercase">
                          Weekly Schedule
                        </label>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                          onClick={addSlot}
                        >
                          + Add Shift
                        </button>
                      </div>
                      <div className="p-3 bg-light rounded-3 border">
                        {formData.slots.length === 0 ? (
                          <p className="text-center text-muted small m-0 fst-italic">
                            No working shifts added yet.
                          </p>
                        ) : (
                          formData.slots.map((slot, index) => (
                            <div
                              key={index}
                              className="row g-2 mb-2 align-items-end"
                            >
                              <div className="col-md-4">
                                <select
                                  className="form-select form-select-sm border-2 shadow-none"
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
                                  className="form-control form-control-sm border-2 shadow-none"
                                  value={slot.startTime}
                                  onChange={(e) =>
                                    updateSlot(
                                      index,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="time"
                                  className="form-control form-control-sm border-2 shadow-none"
                                  value={slot.endTime}
                                  onChange={(e) =>
                                    updateSlot(index, "endTime", e.target.value)
                                  }
                                  required
                                />
                              </div>
                              <div className="col-md-2 text-center">
                                <button
                                  type="button"
                                  className="btn btn-sm text-danger"
                                  onClick={() => removeSlot(index)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="spinner-border spinner-border-sm me-2" />
                    ) : (
                      <Save size={18} className="me-2" />
                    )}
                    {isEditing ? "Save Changes" : "Register Doctor"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <style>{`.animate-fade-in { animation: fadeIn 0.3s ease; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
};

export default AdminDoctors;
