// import React, { useEffect, useState } from "react";
// import api from "../services/api";

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//   });

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       name: "",
//       speciality: "",
//       nmcNumber: "",
//     });
//   };

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       const res = await api.get("/admin/doctors", {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });
//       setDoctors(res.data || []);
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load doctors from server."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const openCreate = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const openEdit = (doc) => {
//     setEditingId(doc._id);
//     setFormData({
//       name: doc.name || "",
//       speciality: doc.speciality || "",
//       nmcNumber: doc.nmcNumber || "",
//     });
//     setShowForm(true);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((f) => ({ ...f, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!formData.name || !formData.speciality || !formData.nmcNumber) {
//       setError("Name, speciality and NMC number are required.");
//       return;
//     }

//     try {
//       setSaving(true);
//       const token = localStorage.getItem("token");

//       if (editingId) {
//         await api.put(`/admin/doctors/${editingId}`, formData, {
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         });
//         setSuccess("Doctor updated successfully.");
//       } else {
//         await api.post("/admin/doctors", formData, {
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         });
//         setSuccess("Doctor created successfully.");
//       }

//       setShowForm(false);
//       resetForm();
//       fetchDoctors();
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to save doctor. Please try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this doctor?")) return;
//     try {
//       setError("");
//       setSuccess("");
//       const token = localStorage.getItem("token");
//       await api.delete(`/admin/doctors/${id}`, {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });
//       setSuccess("Doctor deleted successfully.");
//       setDoctors((prev) => prev.filter((d) => d._id !== id));
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to delete doctor. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3 className="fw-bold mb-0">Doctors Management</h3>
//         <button className="btn btn-success" onClick={openCreate}>
//           + Add Doctor
//         </button>
//       </div>

//       {error && (
//         <div className="alert alert-danger py-2" role="alert">
//           {error}
//         </div>
//       )}
//       {success && (
//         <div className="alert alert-success py-2" role="alert">
//           {success}
//         </div>
//       )}

//       {loading ? (
//         <div className="d-flex align-items-center justify-content-center py-5">
//           <div className="spinner-border text-primary me-2" role="status" />
//           <span>Loading doctors...</span>
//         </div>
//       ) : doctors.length === 0 ? (
//         <p className="text-muted">
//           No doctors found. Click “Add Doctor” to create one.
//         </p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-striped table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>Name</th>
//                 <th>Speciality</th>
//                 <th>NMC Number</th>
//                 <th style={{ width: 140 }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.map((d) => (
//                 <tr key={d._id}>
//                   <td>{d.name}</td>
//                   <td>{d.speciality}</td>
//                   <td>{d.nmcNumber}</td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline-primary me-2"
//                       onClick={() => openEdit(d)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => handleDelete(d._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal-like form */}
//       {showForm && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
//           style={{ zIndex: 1050 }}
//         >
//           <div
//             className="bg-white rounded shadow p-4"
//             style={{ maxWidth: 480, width: "100%" }}
//           >
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="mb-0">
//                 {editingId ? "Edit Doctor" : "Add Doctor"}
//               </h5>
//               <button
//                 className="btn btn-sm btn-outline-secondary"
//                 onClick={() => {
//                   if (!saving) {
//                     setShowForm(false);
//                     resetForm();
//                   }
//                 }}
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label className="form-label">Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   className="form-control"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   disabled={saving}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Speciality *</label>
//                 <input
//                   type="text"
//                   name="speciality"
//                   className="form-control"
//                   value={formData.speciality}
//                   onChange={handleChange}
//                   required
//                   disabled={saving}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">NMC Number *</label>
//                 <input
//                   type="text"
//                   name="nmcNumber"
//                   className="form-control"
//                   value={formData.nmcNumber}
//                   onChange={handleChange}
//                   required
//                   disabled={saving || !!editingId} // usually NMC is immutable
//                 />
//               </div>

//               <div className="d-flex justify-content-end gap-2">
//                 <button
//                   type="button"
//                   className="btn btn-outline-secondary"
//                   onClick={() => {
//                     if (!saving) {
//                       setShowForm(false);
//                       resetForm();
//                     }
//                   }}
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                   disabled={saving}
//                 >
//                   {saving
//                     ? editingId
//                       ? "Updating..."
//                       : "Creating..."
//                     : editingId
//                     ? "Update"
//                     : "Create"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDoctors;

/////////////////////////////////////////////////////////////////////////////

// import React, { useEffect, useState } from "react";
// import api from "../services/api";

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     timeSlotsText: "", // comma-separated time slots string for UI
//   });

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       name: "",
//       speciality: "",
//       nmcNumber: "",
//       timeSlotsText: "",
//     });
//   };

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       const res = await api.get("/admin/doctors", {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });
//       const docs = res.data || [];
//       // Map backend timeSlots (array) into text field for display
//       const mapped = docs.map((doc) => ({
//         ...doc,
//         _timeSlotsText: Array.isArray(doc.timeSlots)
//           ? doc.timeSlots.join(", ")
//           : "",
//       }));
//       setDoctors(mapped);
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load doctors from server."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const openCreate = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const openEdit = (doc) => {
//     setEditingId(doc._id);
//     setFormData({
//       name: doc.name || "",
//       speciality: doc.speciality || "",
//       nmcNumber: doc.nmcNumber || "",
//       timeSlotsText: Array.isArray(doc.timeSlots)
//         ? doc.timeSlots.join(", ")
//         : doc._timeSlotsText || "",
//     });
//     setShowForm(true);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((f) => ({ ...f, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!formData.name || !formData.speciality || !formData.nmcNumber) {
//       setError("Name, speciality and NMC number are required.");
//       return;
//     }

//     // Convert comma-separated text into array of trimmed slots
//     const timeSlotsArray = formData.timeSlotsText
//       .split(",")
//       .map((s) => s.trim())
//       .filter((s) => s.length > 0);

//     const payload = {
//       name: formData.name,
//       speciality: formData.speciality,
//       nmcNumber: formData.nmcNumber,
//       timeSlots: timeSlotsArray, // this expects backend doctor model to have `timeSlots: [String]`
//     };

//     try {
//       setSaving(true);
//       const token = localStorage.getItem("token");

//       if (editingId) {
//         await api.put(`/admin/doctors/${editingId}`, payload, {
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         });
//         setSuccess("Doctor updated successfully.");
//       } else {
//         await api.post("/admin/doctors", payload, {
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         });
//         setSuccess("Doctor created successfully.");
//       }

//       setShowForm(false);
//       resetForm();
//       fetchDoctors();
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to save doctor. Please try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this doctor?")) return;
//     try {
//       setError("");
//       setSuccess("");
//       const token = localStorage.getItem("token");
//       await api.delete(`/admin/doctors/${id}`, {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });
//       setSuccess("Doctor deleted successfully.");
//       setDoctors((prev) => prev.filter((d) => d._id !== id));
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to delete doctor. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3 className="fw-bold mb-0">Doctors Management</h3>
//         <button className="btn btn-success" onClick={openCreate}>
//           + Add Doctor
//         </button>
//       </div>

//       {error && (
//         <div className="alert alert-danger py-2" role="alert">
//           {error}
//         </div>
//       )}
//       {success && (
//         <div className="alert alert-success py-2" role="alert">
//           {success}
//         </div>
//       )}

//       {loading ? (
//         <div className="d-flex align-items-center justify-content-center py-5">
//           <div className="spinner-border text-primary me-2" role="status" />
//           <span>Loading doctors...</span>
//         </div>
//       ) : doctors.length === 0 ? (
//         <p className="text-muted">
//           No doctors found. Click “Add Doctor” to create one.
//         </p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-striped table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>Name</th>
//                 <th>Speciality</th>
//                 <th>NMC Number</th>
//                 <th>Time Slots</th>
//                 <th style={{ width: 180 }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.map((d) => (
//                 <tr key={d._id}>
//                   <td>{d.name}</td>
//                   <td>{d.speciality}</td>
//                   <td>{d.nmcNumber}</td>
//                   <td>
//                     {Array.isArray(d.timeSlots) && d.timeSlots.length > 0
//                       ? d.timeSlots.join(", ")
//                       : d._timeSlotsText || (
//                           <span className="text-muted">No slots set</span>
//                         )}
//                   </td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline-primary me-2"
//                       onClick={() => openEdit(d)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => handleDelete(d._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal-like form */}
//       {showForm && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
//           style={{ zIndex: 1050 }}
//         >
//           <div
//             className="bg-white rounded shadow p-4"
//             style={{ maxWidth: 520, width: "100%" }}
//           >
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="mb-0">
//                 {editingId ? "Edit Doctor" : "Add Doctor"}
//               </h5>
//               <button
//                 className="btn btn-sm btn-outline-secondary"
//                 onClick={() => {
//                   if (!saving) {
//                     setShowForm(false);
//                     resetForm();
//                   }
//                 }}
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label className="form-label">Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   className="form-control"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   disabled={saving}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Speciality *</label>
//                 <input
//                   type="text"
//                   name="speciality"
//                   className="form-control"
//                   value={formData.speciality}
//                   onChange={handleChange}
//                   required
//                   disabled={saving}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">NMC Number *</label>
//                 <input
//                   type="text"
//                   name="nmcNumber"
//                   className="form-control"
//                   value={formData.nmcNumber}
//                   onChange={handleChange}
//                   required
//                   disabled={saving || !!editingId} // usually NMC is immutable
//                 />
//               </div>

//               {/* New Time Slots section */}
//               <div className="mb-3">
//                 <label className="form-label">
//                   Time Slots (comma separated, e.g. 09:00-11:00, 14:00-16:00)
//                 </label>
//                 <textarea
//                   name="timeSlotsText"
//                   className="form-control"
//                   rows={2}
//                   placeholder="09:00-11:00, 14:00-16:00"
//                   value={formData.timeSlotsText}
//                   onChange={handleChange}
//                   disabled={saving}
//                 />
//                 <div className="form-text">
//                   These slots will be used to show available appointment times
//                   for this doctor.
//                 </div>
//               </div>

//               <div className="d-flex justify-content-end gap-2">
//                 <button
//                   type="button"
//                   className="btn btn-outline-secondary"
//                   onClick={() => {
//                     if (!saving) {
//                       setShowForm(false);
//                       resetForm();
//                     }
//                   }}
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                   disabled={saving}
//                 >
//                   {saving
//                     ? editingId
//                       ? "Updating..."
//                       : "Creating..."
//                     : editingId
//                     ? "Update"
//                     : "Create"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDoctors;

// import React, { useEffect, useState } from "react";
// import api from "../services/api";

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     timeSlotsText: "", // comma-separated time slots string for UI
//   });

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       name: "",
//       speciality: "",
//       nmcNumber: "",
//       timeSlotsText: "",
//     });
//   };

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");

//       // ✅ UPDATED: use /doctors/pharmacist/doctors
//       const res = await api.get("/doctors/pharmacist/doctors", {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });

//       const docs = res.data || [];

//       // Map backend timeSlots (array) into text field for display
//       const mapped = docs.map((doc) => ({
//         ...doc,
//         _timeSlotsText: Array.isArray(doc.timeSlots)
//           ? doc.timeSlots.join(", ")
//           : "",
//       }));
//       setDoctors(mapped);
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load doctors from server."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const openCreate = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const openEdit = (doc) => {
//     setEditingId(doc._id);
//     setFormData({
//       name: doc.name || "",
//       speciality: doc.speciality || "",
//       nmcNumber: doc.nmcNumber || "",
//       timeSlotsText: Array.isArray(doc.timeSlots)
//         ? doc.timeSlots.join(", ")
//         : doc._timeSlotsText || "",
//     });
//     setShowForm(true);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((f) => ({ ...f, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!formData.name || !formData.speciality || !formData.nmcNumber) {
//       setError("Name, speciality and NMC number are required.");
//       return;
//     }

//     // Convert comma-separated text into array of trimmed slots
//     const timeSlotsArray = formData.timeSlotsText
//       .split(",")
//       .map((s) => s.trim())
//       .filter((s) => s.length > 0);

//     const payload = {
//       name: formData.name,
//       speciality: formData.speciality,
//       nmcNumber: formData.nmcNumber,
//       timeSlots: timeSlotsArray, // backend expects `timeSlots: [String]`
//     };

//     try {
//       setSaving(true);
//       const token = localStorage.getItem("token");

//       if (editingId) {
//         // ✅ UPDATED: /doctors/:id
//         await api.put(`/doctors/${editingId}`, payload, {
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         });
//         setSuccess("Doctor updated successfully.");
//       } else {
//         // ✅ UPDATED: /doctors
//         await api.post("/doctors", payload, {
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         });
//         setSuccess("Doctor created successfully.");
//       }

//       setShowForm(false);
//       resetForm();
//       fetchDoctors();
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to save doctor. Please try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this doctor?")) return;
//     try {
//       setError("");
//       setSuccess("");
//       const token = localStorage.getItem("token");

//       // ✅ UPDATED: /doctors/:id
//       await api.delete(`/doctors/${id}`, {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });

//       setSuccess("Doctor deleted successfully.");
//       setDoctors((prev) => prev.filter((d) => d._id !== id));
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to delete doctor. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3 className="fw-bold mb-0">Doctors Management</h3>
//         <button className="btn btn-success" onClick={openCreate}>
//           + Add Doctor
//         </button>
//       </div>

//       {error && (
//         <div className="alert alert-danger py-2" role="alert">
//           {error}
//         </div>
//       )}
//       {success && (
//         <div className="alert alert-success py-2" role="alert">
//           {success}
//         </div>
//       )}

//       {loading ? (
//         <div className="d-flex align-items-center justify-content-center py-5">
//           <div className="spinner-border text-primary me-2" role="status" />
//           <span>Loading doctors...</span>
//         </div>
//       ) : doctors.length === 0 ? (
//         <p className="text-muted">
//           No doctors found. Click “Add Doctor” to create one.
//         </p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-striped table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>Name</th>
//                 <th>Speciality</th>
//                 <th>NMC Number</th>
//                 <th>Time Slots</th>
//                 <th style={{ width: 180 }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.map((d) => (
//                 <tr key={d._id}>
//                   <td>{d.name}</td>
//                   <td>{d.speciality}</td>
//                   <td>{d.nmcNumber}</td>
//                   <td>
//                     {Array.isArray(d.timeSlots) && d.timeSlots.length > 0
//                       ? d.timeSlots.join(", ")
//                       : d._timeSlotsText || (
//                           <span className="text-muted">No slots set</span>
//                         )}
//                   </td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline-primary me-2"
//                       onClick={() => openEdit(d)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => handleDelete(d._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal-like form */}
//       {showForm && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
//           style={{ zIndex: 1050 }}
//         >
//           <div
//             className="bg-white rounded shadow p-4"
//             style={{ maxWidth: 520, width: "100%" }}
//           >
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="mb-0">
//                 {editingId ? "Edit Doctor" : "Add Doctor"}
//               </h5>
//               <button
//                 className="btn btn-sm btn-outline-secondary"
//                 onClick={() => {
//                   if (!saving) {
//                     setShowForm(false);
//                     resetForm();
//                   }
//                 }}
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label className="form-label">Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   className="form-control"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   disabled={saving}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Speciality *</label>
//                 <input
//                   type="text"
//                   name="speciality"
//                   className="form-control"
//                   value={formData.speciality}
//                   onChange={handleChange}
//                   required
//                   disabled={saving}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">NMC Number *</label>
//                 <input
//                   type="text"
//                   name="nmcNumber"
//                   className="form-control"
//                   value={formData.nmcNumber}
//                   onChange={handleChange}
//                   required
//                   disabled={saving || !!editingId} // usually NMC is immutable
//                 />
//               </div>

//               {/* Time Slots section */}
//               <div className="mb-3">
//                 <label className="form-label">
//                   Time Slots (comma separated, e.g. 09:00-10:00, 14:00-15:00)
//                 </label>
//                 <textarea
//                   name="timeSlotsText"
//                   className="form-control"
//                   rows={2}
//                   placeholder="09:00-10:00, 14:00-15:00"
//                   value={formData.timeSlotsText}
//                   onChange={handleChange}
//                   disabled={saving}
//                 />
//                 <div className="form-text">
//                   These slots will be used to show available appointment times
//                   for this doctor.
//                 </div>
//               </div>

//               <div className="d-flex justify-content-end gap-2">
//                 <button
//                   type="button"
//                   className="btn btn-outline-secondary"
//                   onClick={() => {
//                     if (!saving) {
//                       setShowForm(false);
//                       resetForm();
//                     }
//                   }}
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                   disabled={saving}
//                 >
//                   {saving
//                     ? editingId
//                       ? "Updating..."
//                       : "Creating..."
//                     : editingId
//                     ? "Update"
//                     : "Create"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDoctors;

// import React, { useEffect, useState } from "react";
// import api from "../services/api";

// const AdminDoctors = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     speciality: "",
//     nmcNumber: "",
//     timeSlotsText: "", // comma-separated time slots string for UI
//   });

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       name: "",
//       speciality: "",
//       nmcNumber: "",
//       timeSlotsText: "",
//     });
//   };

//   const fetchDoctors = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");

//       // uses /api/doctors/pharmacist/doctors
//       const res = await api.get("/doctors/pharmacist/doctors", {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });

//       const docs = res.data || [];

//       // Map backend timeSlots (array) into text field for display
//       const mapped = docs.map((doc) => ({
//         ...doc,
//         _timeSlotsText: Array.isArray(doc.timeSlots)
//           ? doc.timeSlots.join(", ")
//           : "",
//       }));
//       setDoctors(mapped);
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load doctors from server."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const openCreate = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const openEdit = (doc) => {
//     setEditingId(doc._id);
//     setFormData({
//       name: doc.name || "",
//       speciality: doc.speciality || "",
//       nmcNumber: doc.nmcNumber || "",
//       timeSlotsText: Array.isArray(doc.timeSlots)
//         ? doc.timeSlots.join(", ")
//         : doc._timeSlotsText || "",
//     });
//     setShowForm(true);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((f) => ({ ...f, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!formData.name || !formData.speciality || !formData.nmcNumber) {
//       setError("Name, speciality and NMC number are required.");
//       return;
//     }

//     // Convert comma-separated text into array of trimmed slots
//     const timeSlotsArray = formData.timeSlotsText
//       .split(",")
//       .map((s) => s.trim())
//       .filter((s) => s.length > 0);

//     const payload = {
//       name: formData.name,
//       speciality: formData.speciality,
//       nmcNumber: formData.nmcNumber,
//       timeSlots: timeSlotsArray,
//     };

//     try {
//       setSaving(true);
//       const token = localStorage.getItem("token");

//       if (editingId) {
//         await api.put(`/doctors/${editingId}`, payload, {
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         });
//         setSuccess("Doctor updated successfully.");
//       } else {
//         await api.post("/doctors", payload, {
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         });
//         setSuccess("Doctor created successfully.");
//       }

//       setShowForm(false);
//       resetForm();
//       fetchDoctors();
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to save doctor. Please try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this doctor?")) return;
//     try {
//       setError("");
//       setSuccess("");
//       const token = localStorage.getItem("token");

//       await api.delete(`/doctors/${id}`, {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });

//       setSuccess("Doctor deleted successfully.");
//       setDoctors((prev) => prev.filter((d) => d._id !== id));
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to delete doctor. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3 className="fw-bold mb-0">Doctors Management</h3>
//         <button className="btn btn-success" onClick={openCreate}>
//           + Add Doctor
//         </button>
//       </div>

//       {error && (
//         <div className="alert alert-danger py-2" role="alert">
//           {error}
//         </div>
//       )}
//       {success && (
//         <div className="alert alert-success py-2" role="alert">
//           {success}
//         </div>
//       )}

//       {loading ? (
//         <div className="d-flex align-items-center justify-content-center py-5">
//           <div className="spinner-border text-primary me-2" role="status" />
//           <span>Loading doctors...</span>
//         </div>
//       ) : doctors.length === 0 ? (
//         <p className="text-muted">
//           No doctors found. Click “Add Doctor” to create one.
//         </p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-striped table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>Name</th>
//                 <th>Speciality</th>
//                 <th>NMC Number</th>
//                 <th>Time Slots</th> {/* added column */}
//                 <th style={{ width: 180 }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {doctors.map((d) => (
//                 <tr key={d._id}>
//                   <td>{d.name}</td>
//                   <td>{d.speciality}</td>
//                   <td>{d.nmcNumber}</td>
//                   <td>
//                     {Array.isArray(d.timeSlots) && d.timeSlots.length > 0
//                       ? d.timeSlots.join(", ")
//                       : d._timeSlotsText || (
//                           <span className="text-muted">No slots set</span>
//                         )}
//                   </td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline-primary me-2"
//                       onClick={() => openEdit(d)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => handleDelete(d._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal-like form */}
//       {showForm && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
//           style={{ zIndex: 1050 }}
//         >
//           <div
//             className="bg-white rounded shadow p-4"
//             style={{ maxWidth: 520, width: "100%" }}
//           >
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="mb-0">
//                 {editingId ? "Edit Doctor" : "Add Doctor"}
//               </h5>
//               <button
//                 className="btn btn-sm btn-outline-secondary"
//                 onClick={() => {
//                   if (!saving) {
//                     setShowForm(false);
//                     resetForm();
//                   }
//                 }}
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label className="form-label">Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   className="form-control"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   disabled={saving}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Speciality *</label>
//                 <input
//                   type="text"
//                   name="speciality"
//                   className="form-control"
//                   value={formData.speciality}
//                   onChange={handleChange}
//                   required
//                   disabled={saving}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">NMC Number *</label>
//                 <input
//                   type="text"
//                   name="nmcNumber"
//                   className="form-control"
//                   value={formData.nmcNumber}
//                   onChange={handleChange}
//                   required
//                   disabled={saving || !!editingId}
//                 />
//               </div>

//               {/* Time Slots section */}
//               <div className="mb-3">
//                 <label className="form-label">
//                   Time Slots (comma separated, e.g. 09:00-10:00, 14:00-15:00)
//                 </label>
//                 <textarea
//                   name="timeSlotsText"
//                   className="form-control"
//                   rows={2}
//                   placeholder="09:00-10:00, 14:00-15:00"
//                   value={formData.timeSlotsText}
//                   onChange={handleChange}
//                   disabled={saving}
//                 />
//                 <div className="form-text">
//                   These slots will be used to show available appointment times
//                   for this doctor.
//                 </div>
//               </div>

//               <div className="d-flex justify-content-end gap-2">
//                 <button
//                   type="button"
//                   className="btn btn-outline-secondary"
//                   onClick={() => {
//                     if (!saving) {
//                       setShowForm(false);
//                       resetForm();
//                     }
//                   }}
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                   disabled={saving}
//                 >
//                   {saving
//                     ? editingId
//                       ? "Updating..."
//                       : "Creating..."
//                     : editingId
//                     ? "Update"
//                     : "Create"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDoctors;

import React, { useEffect, useState } from "react";
import api from "../services/api";

const emptySlot = { date: "", startTime: "", endTime: "" };

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    nmcNumber: "",
    slots: [emptySlot],
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      speciality: "",
      nmcNumber: "",
      slots: [emptySlot],
    });
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      // uses /api/doctors/pharmacist/doctors
      const res = await api.get("/doctors/pharmacist/doctors", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      const docs = res.data || [];
      setDoctors(docs);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load doctors from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (doc) => {
    setEditingId(doc._id);
    setFormData({
      name: doc.name || "",
      speciality: doc.speciality || "",
      nmcNumber: doc.nmcNumber || "",
      slots:
        Array.isArray(doc.slots) && doc.slots.length > 0
          ? doc.slots.map((s) => ({
              date: s.date ? String(s.date).substring(0, 10) : "",
              startTime: s.startTime || "",
              endTime: s.endTime || "",
            }))
          : [emptySlot],
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSlotChange = (index, field, value) => {
    setFormData((f) => {
      const nextSlots = [...f.slots];
      nextSlots[index] = { ...nextSlots[index], [field]: value };
      return { ...f, slots: nextSlots };
    });
  };

  const addSlotRow = () => {
    setFormData((f) => ({ ...f, slots: [...f.slots, emptySlot] }));
  };

  const removeSlotRow = (index) => {
    setFormData((f) => {
      const nextSlots = f.slots.filter((_, i) => i !== index);
      return { ...f, slots: nextSlots.length ? nextSlots : [emptySlot] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.speciality || !formData.nmcNumber) {
      setError("Name, speciality and NMC number are required.");
      return;
    }

    // clean slots: remove completely empty rows
    const cleanedSlots = (formData.slots || [])
      .map((s) => ({
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
      }))
      .filter((s) => s.date && s.startTime && s.endTime);

    const payload = {
      name: formData.name,
      speciality: formData.speciality,
      nmcNumber: formData.nmcNumber,
      slots: cleanedSlots,
    };

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      if (editingId) {
        await api.put(`/doctors/${editingId}`, payload, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        setSuccess("Doctor updated successfully.");
      } else {
        await api.post("/doctors", payload, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        setSuccess("Doctor created successfully.");
      }

      setShowForm(false);
      resetForm();
      fetchDoctors();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save doctor. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      await api.delete(`/doctors/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      setSuccess("Doctor deleted successfully.");
      setDoctors((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete doctor. Please try again."
      );
    }
  };

  const formatSlotsForTable = (slots) => {
    if (!Array.isArray(slots) || slots.length === 0) return "No slots set";
    return slots
      .map((s) => {
        const d = s.date ? String(s.date).substring(0, 10) : "";
        return `${d} ${s.startTime || ""}-${s.endTime || ""}`;
      })
      .join(", ");
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold mb-0">Doctors Management</h3>
        <button className="btn btn-success" onClick={openCreate}>
          + Add Doctor
        </button>
      </div>

      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success py-2" role="alert">
          {success}
        </div>
      )}

      {loading ? (
        <div className="d-flex align-items-center justify-content-center py-5">
          <div className="spinner-border text-primary me-2" role="status" />
          <span>Loading doctors...</span>
        </div>
      ) : doctors.length === 0 ? (
        <p className="text-muted">
          No doctors found. Click “Add Doctor” to create one.
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Speciality</th>
                <th>NMC Number</th>
                <th>Slots (Date &amp; Time)</th>
                <th style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.speciality}</td>
                  <td>{d.nmcNumber}</td>
                  <td>
                    {Array.isArray(d.slots) && d.slots.length > 0 ? (
                      formatSlotsForTable(d.slots)
                    ) : (
                      <span className="text-muted">No slots set</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEdit(d)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(d._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal-like form */}
      {showForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <div
            className="bg-white rounded shadow p-4"
            style={{ maxWidth: 600, width: "100%" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                {editingId ? "Edit Doctor" : "Add Doctor"}
              </h5>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  if (!saving) {
                    setShowForm(false);
                    resetForm();
                  }
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Speciality *</label>
                <input
                  type="text"
                  name="speciality"
                  className="form-control"
                  value={formData.speciality}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">NMC Number *</label>
                <input
                  type="text"
                  name="nmcNumber"
                  className="form-control"
                  value={formData.nmcNumber}
                  onChange={handleChange}
                  required
                  disabled={saving || !!editingId}
                />
              </div>

              {/* Slots section */}
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <label className="form-label mb-0">
                  Time Slots (with date)
                </label>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success"
                  onClick={addSlotRow}
                  disabled={saving}
                >
                  + Add Slot
                </button>
              </div>

              {formData.slots.map((slot, index) => (
                <div className="row g-2 align-items-end mb-2" key={index}>
                  <div className="col-md-4">
                    <label className="form-label small mb-1">Date</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={slot.date}
                      onChange={(e) =>
                        handleSlotChange(index, "date", e.target.value)
                      }
                      disabled={saving}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small mb-1">Start</label>
                    <input
                      type="time"
                      className="form-control form-control-sm"
                      value={slot.startTime}
                      onChange={(e) =>
                        handleSlotChange(index, "startTime", e.target.value)
                      }
                      disabled={saving}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small mb-1">End</label>
                    <input
                      type="time"
                      className="form-control form-control-sm"
                      value={slot.endTime}
                      onChange={(e) =>
                        handleSlotChange(index, "endTime", e.target.value)
                      }
                      disabled={saving}
                    />
                  </div>
                  <div className="col-md-2 d-flex">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger w-100"
                      onClick={() => removeSlotRow(index)}
                      disabled={saving}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="form-text mb-3">
                Each slot will be stored with a specific date and start/end time
                for appointment booking.
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    if (!saving) {
                      setShowForm(false);
                      resetForm();
                    }
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
