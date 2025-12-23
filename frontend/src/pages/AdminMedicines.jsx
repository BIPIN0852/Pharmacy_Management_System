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

import React, { useEffect, useState } from "react";
import api from "../services/api";

const AdminMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    category: "",
    price: "",
    quantity: "",
    batchNumber: "",
    expiryDate: "",
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
    });
  };

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError("");
      const token = getToken();
      const res = await api.get("/admin/medicines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines(res.data || []);
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
    const firstBatch = med.batches && med.batches[0];
    setEditingId(med._id);
    setFormData({
      name: med.name || "",
      manufacturer: med.manufacturer || "",
      category: med.category || "",
      price: med.price || "",
      quantity: med.quantity ?? "",
      batchNumber: firstBatch?.batchNumber || "",
      expiryDate: firstBatch?.expiryDate
        ? firstBatch.expiryDate.substring(0, 10)
        : "",
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
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

      const payload = {
        name: formData.name.trim(),
        manufacturer: formData.manufacturer.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        quantity,
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
        await api.put(`/admin/medicines/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Medicine updated successfully.");
      } else {
        await api.post("/admin/medicines", payload, {
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
      await api.delete(`/admin/medicines/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Medicine deleted successfully.");
      setMedicines((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete medicine. Please try again."
      );
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold mb-0">Medicines Management</h3>
        <button className="btn btn-success" onClick={openCreate}>
          + Add Medicine
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
          <span>Loading medicines...</span>
        </div>
      ) : medicines.length === 0 ? (
        <p className="text-muted">
          No medicines found. Click “Add Medicine” to create one.
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Manufacturer</th>
                <th>Category</th>
                <th>Batch</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Expiry</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((m) => {
                const firstBatch = m.batches && m.batches[0];
                const expiry = firstBatch?.expiryDate
                  ? new Date(firstBatch.expiryDate).toLocaleDateString()
                  : "-";

                return (
                  <tr key={m._id}>
                    <td>{m.name}</td>
                    <td>{m.manufacturer || "-"}</td>
                    <td>{m.category || "-"}</td>
                    <td>{firstBatch?.batchNumber || "-"}</td>
                    <td>{m.quantity ?? 0}</td>
                    <td>Rs. {Number(m.price || 0).toFixed(2)}</td>
                    <td>{expiry}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openEdit(m)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(m._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <div
            className="bg-white rounded shadow p-4"
            style={{ maxWidth: 500, width: "100%" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                {editingId ? "Edit Medicine" : "Add Medicine"}
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
                <label className="form-label">Manufacturer</label>
                <input
                  type="text"
                  name="manufacturer"
                  className="form-control"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label">Price (Rs) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    disabled={saving}
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    value={formData.quantity}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Batch Number</label>
                <input
                  type="text"
                  name="batchNumber"
                  className="form-control"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  className="form-control"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  disabled={saving}
                />
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

export default AdminMedicines;
