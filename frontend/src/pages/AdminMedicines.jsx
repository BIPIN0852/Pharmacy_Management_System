// import React from "react";

// const AdminMedicines = () => {
//   return (
//     <div className="container-fluid">
//       <h3 className="mb-3 fw-bold">Medicines Management</h3>
//       <p className="text-muted">
//         Medicines CRUD screen will go here (you can reuse MedicineForm and
//         MedicineTable components).
//       </p>
//     </div>
//   );
// };

// export default AdminMedicines;

// import React, { useEffect, useState } from "react";
// import api from "../services/api"; // axios instance pointing to backend

// const AdminMedicines = () => {
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     manufacturer: "",
//     category: "",
//     price: "",
//     quantity: "",
//     expiryDate: "",
//   });

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       name: "",
//       manufacturer: "",
//       category: "",
//       price: "",
//       quantity: "",
//       expiryDate: "",
//     });
//   };

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       const res = await api.get("/admin/medicines", {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });
//       setMedicines(res.data || []);
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load medicines from server."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMedicines();
//   }, []);

//   const openCreate = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const openEdit = (med) => {
//     setEditingId(med._id);
//     setFormData({
//       name: med.name || "",
//       manufacturer: med.manufacturer || "",
//       category: med.category || "",
//       price: med.price || "",
//       quantity: med.quantity ?? med.stock ?? "",
//       expiryDate: med.expiryDate ? med.expiryDate.substring(0, 10) : "",
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

//     if (!formData.name || !formData.price) {
//       setError("Name and price are required.");
//       return;
//     }

//     try {
//       setSaving(true);
//       const token = localStorage.getItem("token");
//       const payload = {
//         ...formData,
//         price: Number(formData.price),
//         quantity: Number(formData.quantity || 0),
//       };

//       if (editingId) {
//         await api.put(`/admin/medicines/${editingId}`, payload, {
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         });
//         setSuccess("Medicine updated successfully.");
//       } else {
//         await api.post("/admin/medicines", payload, {
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         });
//         setSuccess("Medicine created successfully.");
//       }

//       setShowForm(false);
//       resetForm();
//       fetchMedicines();
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to save medicine. Please try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this medicine?")) {
//       return;
//     }
//     try {
//       setError("");
//       setSuccess("");
//       const token = localStorage.getItem("token");
//       await api.delete(`/admin/medicines/${id}`, {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });
//       setSuccess("Medicine deleted successfully.");
//       setMedicines((prev) => prev.filter((m) => m._id !== id));
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to delete medicine. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3 className="fw-bold mb-0">Medicines Management</h3>
//         <button className="btn btn-success" onClick={openCreate}>
//           + Add Medicine
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
//           <span>Loading medicines...</span>
//         </div>
//       ) : medicines.length === 0 ? (
//         <p className="text-muted">
//           No medicines found. Click “Add Medicine” to create one.
//         </p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-striped table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>Name</th>
//                 <th>Manufacturer</th>
//                 <th>Category</th>
//                 <th>Qty</th>
//                 <th>Price</th>
//                 <th>Expiry</th>
//                 <th style={{ width: 140 }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {medicines.map((m) => (
//                 <tr key={m._id}>
//                   <td>{m.name}</td>
//                   <td>{m.manufacturer || "-"}</td>
//                   <td>{m.category || "-"}</td>
//                   <td>{m.quantity ?? m.stock ?? 0}</td>
//                   <td>Rs. {Number(m.price || 0).toFixed(2)}</td>
//                   <td>{m.expiryDate ? m.expiryDate.substring(0, 10) : "-"}</td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline-primary me-2"
//                       onClick={() => openEdit(m)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => handleDelete(m._id)}
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

//       {/* Modal form (simple Bootstrap style div, no portal) */}
//       {showForm && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
//           style={{ zIndex: 1050 }}
//         >
//           <div
//             className="bg-white rounded shadow p-4"
//             style={{ maxWidth: 500, width: "100%" }}
//           >
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="mb-0">
//                 {editingId ? "Edit Medicine" : "Add Medicine"}
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
//                 <label className="form-label">Manufacturer</label>
//                 <input
//                   type="text"
//                   name="manufacturer"
//                   className="form-control"
//                   value={formData.manufacturer}
//                   onChange={handleChange}
//                   disabled={saving}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Category</label>
//                 <input
//                   type="text"
//                   name="category"
//                   className="form-control"
//                   value={formData.category}
//                   onChange={handleChange}
//                   disabled={saving}
//                 />
//               </div>
//               <div className="row">
//                 <div className="mb-3 col-md-6">
//                   <label className="form-label">Price (Rs) *</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     name="price"
//                     className="form-control"
//                     value={formData.price}
//                     onChange={handleChange}
//                     required
//                     disabled={saving}
//                   />
//                 </div>
//                 <div className="mb-3 col-md-6">
//                   <label className="form-label">Quantity</label>
//                   <input
//                     type="number"
//                     name="quantity"
//                     className="form-control"
//                     value={formData.quantity}
//                     onChange={handleChange}
//                     disabled={saving}
//                   />
//                 </div>
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Expiry Date</label>
//                 <input
//                   type="date"
//                   name="expiryDate"
//                   className="form-control"
//                   value={formData.expiryDate}
//                   onChange={handleChange}
//                   disabled={saving}
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

// export default AdminMedicines;

// import React, { useEffect, useState } from "react";
// import api from "../services/api";

// const AdminMedicines = () => {
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     manufacturer: "",
//     category: "",
//     price: "",
//     quantity: "",
//     batchNumber: "",
//     expiryDate: "",
//   });

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       name: "",
//       manufacturer: "",
//       category: "",
//       price: "",
//       quantity: "",
//       batchNumber: "",
//       expiryDate: "",
//     });
//   };

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       const res = await api.get("/admin/medicines", {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });
//       setMedicines(res.data || []);
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load medicines from server."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMedicines();
//   }, []);

//   const openCreate = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const openEdit = (med) => {
//     const firstBatch = med.batches && med.batches[0];
//     setEditingId(med._id);
//     setFormData({
//       name: med.name || "",
//       manufacturer: med.manufacturer || "",
//       category: med.category || "",
//       price: med.price || "",
//       quantity: med.quantity ?? "",
//       batchNumber: firstBatch?.batchNumber || "",
//       expiryDate: firstBatch?.expiryDate
//         ? firstBatch.expiryDate.substring(0, 10)
//         : "",
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

//     if (!formData.name || !formData.price) {
//       setError("Name and price are required.");
//       return;
//     }

//     try {
//       setSaving(true);
//       const token = localStorage.getItem("token");
//       const quantity = Number(formData.quantity || 0);

//       // build payload with first batch
//       const payload = {
//         name: formData.name.trim(),
//         manufacturer: formData.manufacturer.trim(),
//         category: formData.category.trim(),
//         price: Number(formData.price),
//         quantity,
//         batches:
//           formData.batchNumber || formData.expiryDate
//             ? [
//                 {
//                   batchNumber: formData.batchNumber.trim() || "BATCH-1",
//                   expiryDate: formData.expiryDate || null,
//                   qty: quantity,
//                 },
//               ]
//             : [],
//       };

//       if (editingId) {
//         await api.put(`/admin/medicines/${editingId}`, payload, {
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         });
//         setSuccess("Medicine updated successfully.");
//       } else {
//         await api.post("/admin/medicines", payload, {
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         });
//         setSuccess("Medicine created successfully.");
//       }

//       setShowForm(false);
//       resetForm();
//       fetchMedicines();
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to save medicine. Please try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this medicine?")) {
//       return;
//     }
//     try {
//       setError("");
//       setSuccess("");
//       const token = localStorage.getItem("token");
//       await api.delete(`/admin/medicines/${id}`, {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });
//       setSuccess("Medicine deleted successfully.");
//       setMedicines((prev) => prev.filter((m) => m._id !== id));
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to delete medicine. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3 className="fw-bold mb-0">Medicines Management</h3>
//         <button className="btn btn-success" onClick={openCreate}>
//           + Add Medicine
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
//           <span>Loading medicines...</span>
//         </div>
//       ) : medicines.length === 0 ? (
//         <p className="text-muted">
//           No medicines found. Click “Add Medicine” to create one.
//         </p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-striped table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>Name</th>
//                 <th>Manufacturer</th>
//                 <th>Category</th>
//                 <th>Batch</th>
//                 <th>Qty</th>
//                 <th>Price</th>
//                 <th>Expiry</th>
//                 <th style={{ width: 160 }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {medicines.map((m) => {
//                 const firstBatch = m.batches && m.batches[0];
//                 const expiry = firstBatch?.expiryDate
//                   ? new Date(firstBatch.expiryDate).toLocaleDateString()
//                   : "-";

//                 return (
//                   <tr key={m._id}>
//                     <td>{m.name}</td>
//                     <td>{m.manufacturer || "-"}</td>
//                     <td>{m.category || "-"}</td>
//                     <td>{firstBatch?.batchNumber || "-"}</td>
//                     <td>{m.quantity ?? 0}</td>
//                     <td>Rs. {Number(m.price || 0).toFixed(2)}</td>
//                     <td>{expiry}</td>
//                     <td>
//                       <button
//                         className="btn btn-sm btn-outline-primary me-2"
//                         onClick={() => openEdit(m)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={() => handleDelete(m._id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {showForm && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
//           style={{ zIndex: 1050 }}
//         >
//           <div
//             className="bg-white rounded shadow p-4"
//             style={{ maxWidth: 500, width: "100%" }}
//           >
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="mb-0">
//                 {editingId ? "Edit Medicine" : "Add Medicine"}
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
//                 <label className="form-label">Manufacturer</label>
//                 <input
//                   type="text"
//                   name="manufacturer"
//                   className="form-control"
//                   value={formData.manufacturer}
//                   onChange={handleChange}
//                   disabled={saving}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Category</label>
//                 <input
//                   type="text"
//                   name="category"
//                   className="form-control"
//                   value={formData.category}
//                   onChange={handleChange}
//                   disabled={saving}
//                 />
//               </div>
//               <div className="row">
//                 <div className="mb-3 col-md-6">
//                   <label className="form-label">Price (Rs) *</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     name="price"
//                     className="form-control"
//                     value={formData.price}
//                     onChange={handleChange}
//                     required
//                     disabled={saving}
//                   />
//                 </div>
//                 <div className="mb-3 col-md-6">
//                   <label className="form-label">Quantity</label>
//                   <input
//                     type="number"
//                     name="quantity"
//                     className="form-control"
//                     value={formData.quantity}
//                     onChange={handleChange}
//                     disabled={saving}
//                   />
//                 </div>
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Batch Number</label>
//                 <input
//                   type="text"
//                   name="batchNumber"
//                   className="form-control"
//                   value={formData.batchNumber}
//                   onChange={handleChange}
//                   disabled={saving}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Expiry Date</label>
//                 <input
//                   type="date"
//                   name="expiryDate"
//                   className="form-control"
//                   value={formData.expiryDate}
//                   onChange={handleChange}
//                   disabled={saving}
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

// export default AdminMedicines;

// import React, { useEffect, useState } from "react";
// import api from "../services/api";

// const AdminMedicines = () => {
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     manufacturer: "",
//     category: "",
//     price: "",
//     quantity: "",
//     batchNumber: "",
//     expiryDate: "",
//   });

//   const getToken = () => localStorage.getItem("token") || "";

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       name: "",
//       manufacturer: "",
//       category: "",
//       price: "",
//       quantity: "",
//       batchNumber: "",
//       expiryDate: "",
//     });
//   };

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = getToken();
//       const res = await api.get("/admin/medicines", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMedicines(res.data || []);
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load medicines from server."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMedicines();
//   }, []);

//   const openCreate = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const openEdit = (med) => {
//     const firstBatch = med.batches && med.batches[0];
//     setEditingId(med._id);
//     setFormData({
//       name: med.name || "",
//       manufacturer: med.manufacturer || "",
//       category: med.category || "",
//       price: med.price || "",
//       quantity: med.quantity ?? "",
//       batchNumber: firstBatch?.batchNumber || "",
//       expiryDate: firstBatch?.expiryDate
//         ? firstBatch.expiryDate.substring(0, 10)
//         : "",
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

//     if (!formData.name || !formData.price) {
//       setError("Name and price are required.");
//       return;
//     }

//     try {
//       setSaving(true);
//       const token = getToken();
//       const quantity = Number(formData.quantity || 0);

//       const payload = {
//         name: formData.name.trim(),
//         manufacturer: formData.manufacturer.trim(),
//         category: formData.category.trim(),
//         price: Number(formData.price),
//         quantity,
//         batches:
//           formData.batchNumber || formData.expiryDate
//             ? [
//                 {
//                   batchNumber: formData.batchNumber.trim() || "BATCH-1",
//                   expiryDate: formData.expiryDate || null,
//                   qty: quantity,
//                 },
//               ]
//             : [],
//       };

//       if (editingId) {
//         await api.put(`/admin/medicines/${editingId}`, payload, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSuccess("Medicine updated successfully.");
//       } else {
//         await api.post("/admin/medicines", payload, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSuccess("Medicine created successfully.");
//       }

//       setShowForm(false);
//       resetForm();
//       fetchMedicines();
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to save medicine. Please try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this medicine?")) {
//       return;
//     }
//     try {
//       setError("");
//       setSuccess("");
//       const token = getToken();
//       await api.delete(`/admin/medicines/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSuccess("Medicine deleted successfully.");
//       setMedicines((prev) => prev.filter((m) => m._id !== id));
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to delete medicine. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3 className="fw-bold mb-0">Medicines Management</h3>
//         <button className="btn btn-success" onClick={openCreate}>
//           + Add Medicine
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
//           <span>Loading medicines...</span>
//         </div>
//       ) : medicines.length === 0 ? (
//         <p className="text-muted">
//           No medicines found. Click “Add Medicine” to create one.
//         </p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-striped table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>Name</th>
//                 <th>Manufacturer</th>
//                 <th>Category</th>
//                 <th>Batch</th>
//                 <th>Qty</th>
//                 <th>Price</th>
//                 <th>Expiry</th>
//                 <th style={{ width: 160 }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {medicines.map((m) => {
//                 const firstBatch = m.batches && m.batches[0];
//                 const expiry = firstBatch?.expiryDate
//                   ? new Date(firstBatch.expiryDate).toLocaleDateString()
//                   : "-";

//                 return (
//                   <tr key={m._id}>
//                     <td>{m.name}</td>
//                     <td>{m.manufacturer || "-"}</td>
//                     <td>{m.category || "-"}</td>
//                     <td>{firstBatch?.batchNumber || "-"}</td>
//                     <td>{m.quantity ?? 0}</td>
//                     <td>Rs. {Number(m.price || 0).toFixed(2)}</td>
//                     <td>{expiry}</td>
//                     <td>
//                       <button
//                         className="btn btn-sm btn-outline-primary me-2"
//                         onClick={() => openEdit(m)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={() => handleDelete(m._id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {showForm && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
//           style={{ zIndex: 1050 }}
//         >
//           <div
//             className="bg-white rounded shadow p-4"
//             style={{ maxWidth: 500, width: "100%" }}
//           >
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="mb-0">
//                 {editingId ? "Edit Medicine" : "Add Medicine"}
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
//                 <label className="form-label">Manufacturer</label>
//                 <input
//                   type="text"
//                   name="manufacturer"
//                   className="form-control"
//                   value={formData.manufacturer}
//                   onChange={handleChange}
//                   disabled={saving}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Category</label>
//                 <input
//                   type="text"
//                   name="category"
//                   className="form-control"
//                   value={formData.category}
//                   onChange={handleChange}
//                   disabled={saving}
//                 />
//               </div>
//               <div className="row">
//                 <div className="mb-3 col-md-6">
//                   <label className="form-label">Price (Rs) *</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     name="price"
//                     className="form-control"
//                     value={formData.price}
//                     onChange={handleChange}
//                     required
//                     disabled={saving}
//                   />
//                 </div>
//                 <div className="mb-3 col-md-6">
//                   <label className="form-label">Quantity</label>
//                   <input
//                     type="number"
//                     name="quantity"
//                     className="form-control"
//                     value={formData.quantity}
//                     onChange={handleChange}
//                     disabled={saving}
//                   />
//                 </div>
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Batch Number</label>
//                 <input
//                   type="text"
//                   name="batchNumber"
//                   className="form-control"
//                   value={formData.batchNumber}
//                   onChange={handleChange}
//                   disabled={saving}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Expiry Date</label>
//                 <input
//                   type="date"
//                   name="expiryDate"
//                   className="form-control"
//                   value={formData.expiryDate}
//                   onChange={handleChange}
//                   disabled={saving}
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

// export default AdminMedicines;

import React, { useEffect, useState } from "react";
import api from "../services/api"; // Ensure this path is correct
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Package,
  FileText,
  AlertTriangle,
} from "lucide-react";

const AdminMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Expanded Form Data to include new fields
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "", // Mapped to 'brand' in backend often, or separate
    category: "",
    price: "",
    quantity: "",
    batchNumber: "",
    expiryDate: "",
    description: "",
    dosage: "",
    sideEffects: "",
    prescriptionRequired: false,
    image: "", // URL string
  });

  const getToken = () => localStorage.getItem("token") || "";

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      manufacturer: "",
      category: "",
      price: "",
      quantity: "",
      batchNumber: "",
      expiryDate: "",
      description: "",
      dosage: "",
      sideEffects: "",
      prescriptionRequired: false,
      image: "",
    });
  };

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError("");
      const token = getToken();
      // Using the public endpoint since it returns all meds, or specific admin one
      const res = await api.get("/medicines");
      // Handle different API structures { medicines: [...] } or [...]
      const data = res.data.medicines || res.data || [];
      setMedicines(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load medicines from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (med) => {
    const firstBatch = med.batches && med.batches[0]; // If using batches logic
    setEditingId(med._id);
    setFormData({
      name: med.name || "",
      manufacturer: med.brand || med.manufacturer || "", // Handle brand alias
      category: med.category || "",
      price: med.price || "",
      quantity: med.countInStock ?? med.quantity ?? "", // Handle countInStock alias
      batchNumber: firstBatch?.batchNumber || "",
      expiryDate: firstBatch?.expiryDate
        ? new Date(firstBatch.expiryDate).toISOString().substring(0, 10)
        : "",
      description: med.description || "",
      dosage: med.dosage || "",
      sideEffects: med.sideEffects || "",
      prescriptionRequired: med.prescriptionRequired || false,
      image: med.image || "",
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.price) {
      setError("Name and price are required.");
      return;
    }

    try {
      setSaving(true);
      const token = getToken();
      const quantity = Number(formData.quantity || 0);

      // Map form data to backend schema
      const payload = {
        name: formData.name.trim(),
        brand: formData.manufacturer.trim(), // Backend uses 'brand'
        category: formData.category.trim(),
        price: Number(formData.price),
        countInStock: quantity, // Backend uses 'countInStock'
        description: formData.description,
        dosage: formData.dosage,
        sideEffects: formData.sideEffects,
        prescriptionRequired: formData.prescriptionRequired,
        image: formData.image || "/images/sample.jpg", // Default if empty
        // Legacy Batch Support (Optional depending on backend)
        batches:
          formData.batchNumber || formData.expiryDate
            ? [
                {
                  batchNumber: formData.batchNumber.trim() || "BATCH-1",
                  expiryDate: formData.expiryDate || null,
                  qty: quantity,
                },
              ]
            : [],
      };

      if (editingId) {
        await api.put(`/medicines/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Medicine updated successfully.");
      } else {
        await api.post("/medicines", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Medicine created successfully.");
      }

      setShowForm(false);
      resetForm();
      fetchMedicines();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save medicine. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) {
      return;
    }
    try {
      setError("");
      setSuccess("");
      const token = getToken();
      await api.delete(`/medicines/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Medicine deleted successfully.");
      setMedicines((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete medicine.");
    }
  };

  // Filter Logic
  const filteredMedicines = medicines.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.brand && m.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory =
      filterCategory === "All" || m.category === filterCategory;
    return matchSearch && matchCategory;
  });

  // Unique Categories for Filter
  const categories = [
    "All",
    ...new Set(medicines.map((m) => m.category).filter(Boolean)),
  ];

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Medicines Inventory</h3>
          <p className="text-muted mb-0">Manage catalog, stock, and pricing.</p>
        </div>
        <Button variant="primary" onClick={openCreate} className="shadow-sm">
          <Plus size={18} className="me-2" /> Add Medicine
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess("")} dismissible>
          {success}
        </Alert>
      )}

      {/* Filters */}
      <div className="bg-white p-3 rounded-3 shadow-sm mb-4 border">
        <Row className="g-3">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <Search size={18} className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search medicines..."
                className="border-start-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading Inventory...</p>
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-3 border border-dashed">
          <Package size={40} className="text-muted mb-3 opacity-50" />
          <h5 className="text-muted">No medicines found.</h5>
          <Button variant="link" onClick={openCreate}>
            Create New Medicine
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-3 shadow-sm border overflow-hidden">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Name</th>
                  <th>Brand/Manufacturer</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Rx Required</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((m) => (
                  <tr key={m._id}>
                    <td className="ps-4 fw-bold text-primary">{m.name}</td>
                    <td>{m.brand || m.manufacturer || "-"}</td>
                    <td>
                      <Badge
                        bg="info"
                        className="text-dark bg-opacity-25 border border-info"
                      >
                        {m.category}
                      </Badge>
                    </td>
                    <td>
                      <span
                        className={
                          m.countInStock > 0
                            ? "text-success fw-bold"
                            : "text-danger fw-bold"
                        }
                      >
                        {m.countInStock ?? m.quantity ?? 0}
                      </span>
                    </td>
                    <td>Rs. {Number(m.price).toFixed(2)}</td>
                    <td>
                      {m.prescriptionRequired ? (
                        <Badge bg="warning" text="dark">
                          <FileText size={10} className="me-1" /> Yes
                        </Badge>
                      ) : (
                        <span className="text-muted small">No</span>
                      )}
                    </td>
                    <td className="text-end pe-4">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => openEdit(m)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(m._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        show={showForm}
        onHide={() => {
          if (!saving) {
            setShowForm(false);
            resetForm();
          }
        }}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Edit Medicine" : "Add New Medicine"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              {/* Basic Info */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Brand / Manufacturer</Form.Label>
                  <Form.Control
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    list="categoriesList"
                  />
                  <datalist id="categoriesList">
                    <option value="Antibiotics" />
                    <option value="Pain Relief" />
                    <option value="Vitamins" />
                  </datalist>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    Price (Rs) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Stock Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Medical Details */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Dosage Info</Form.Label>
                  <Form.Control
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleChange}
                    placeholder="e.g. 1 tablet twice daily"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Side Effects</Form.Label>
                  <Form.Control
                    name="sideEffects"
                    value={formData.sideEffects}
                    onChange={handleChange}
                    placeholder="e.g. Drowsiness"
                  />
                </Form.Group>
              </Col>

              {/* Settings */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="/images/sample.jpg"
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-center pt-4">
                <Form.Check
                  type="switch"
                  id="rx-switch"
                  label="Prescription Required"
                  name="prescriptionRequired"
                  checked={formData.prescriptionRequired}
                  onChange={handleChange}
                  className="fw-bold text-danger"
                />
              </Col>

              {/* Batch Info (Optional/Legacy) */}
              <Col md={12} className="mt-4">
                <h6 className="text-muted border-bottom pb-2">
                  Batch Information (Optional)
                </h6>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted">
                    Batch Number
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted">
                    Expiry Date
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <Button
                variant="light"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Update Medicine"
                ) : (
                  "Create Medicine"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminMedicines;
