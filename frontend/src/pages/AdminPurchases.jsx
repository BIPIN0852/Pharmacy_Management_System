// import React, { useEffect, useState } from "react";
// import api from "../services/api";

// const AdminPurchases = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [updatingId, setUpdatingId] = useState(null);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [search, setSearch] = useState("");

//   // Create PO form state
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [formData, setFormData] = useState({
//     supplier: "",
//     notes: "",
//     items: [],
//   });

//   const resetForm = () => {
//     setFormData({
//       supplier: "",
//       notes: "",
//       items: [],
//     });
//   };

//   // Load all data
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");

//       const [purchasesRes, suppliersRes, medicinesRes] = await Promise.all([
//         api.get("/admin/purchases", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         api.get("/admin/suppliers", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         api.get("/admin/medicines", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       setPurchases(purchasesRes.data || []);
//       setSuppliers(suppliersRes.data || []);
//       setMedicines(medicinesRes.data || []);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to load purchase data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Add item to PO
//   const addItem = () => {
//     setFormData((prev) => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         {
//           medicine: "",
//           quantity: 1,
//           costPrice: 0,
//           batchNumber: "",
//           expiryDate: "",
//         },
//       ],
//     }));
//   };

//   const removeItem = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       items: prev.items.filter((_, i) => i !== index),
//     }));
//   };

//   const updateItem = (index, field, value) => {
//     setFormData((prev) => {
//       const newItems = [...prev.items];
//       newItems[index] = { ...newItems[index], [field]: value };
//       return { ...prev, items: newItems };
//     });
//   };

//   const handleSubmitPO = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!formData.supplier) {
//       setError("Please select a supplier.");
//       return;
//     }
//     if (formData.items.length === 0) {
//       setError("Please add at least one item.");
//       return;
//     }

//     try {
//       setSaving(true);
//       const token = localStorage.getItem("token");
//       await api.post("/admin/purchases", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSuccess("Purchase order created successfully.");
//       setShowCreateForm(false);
//       resetForm();
//       fetchData();
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to create purchase order."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleReceivePO = async (id) => {
//     if (
//       !window.confirm(
//         "Mark this purchase order as received? Stock will be updated."
//       )
//     ) {
//       return;
//     }

//     try {
//       setUpdatingId(id);
//       setError("");
//       setSuccess("");
//       const token = localStorage.getItem("token");
//       const res = await api.put(
//         `/admin/purchases/${id}/status`,
//         { status: "Received" },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Update local state
//       setPurchases((prev) =>
//         prev.map((p) => (p._id === id ? res.data.purchase : p))
//       );
//       setSuccess("Purchase order marked as received. Stock updated.");
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to update purchase order."
//       );
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const filteredPurchases = purchases.filter((p) => {
//     const q = search.trim().toLowerCase();
//     if (!q) return true;
//     const supplierName = (p.supplier?.name || "").toLowerCase();
//     const status = (p.status || "").toLowerCase();
//     return (
//       supplierName.includes(q) ||
//       status.includes(q) ||
//       String(p._id || "").includes(q)
//     );
//   });

//   const totalCost = formData.items.reduce(
//     (sum, item) => sum + Number(item.costPrice) * Number(item.quantity),
//     0
//   );

//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
//         <h3 className="fw-bold mb-0">Purchase Orders</h3>
//         <div className="d-flex gap-2">
//           <input
//             type="search"
//             className="form-control form-control-sm"
//             style={{ maxWidth: 260 }}
//             placeholder="Search purchases..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button
//             className="btn btn-success btn-sm"
//             onClick={() => setShowCreateForm(true)}
//             disabled={saving}
//           >
//             + New Purchase Order
//           </button>
//         </div>
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
//           <span>Loading purchases...</span>
//         </div>
//       ) : filteredPurchases.length === 0 ? (
//         <p className="text-muted">No purchase orders found.</p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-striped table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>ID</th>
//                 <th>Supplier</th>
//                 <th>Total Cost</th>
//                 <th>Status</th>
//                 <th>Ordered</th>
//                 <th>Received</th>
//                 <th style={{ width: 150 }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredPurchases.map((p) => (
//                 <tr key={p._id}>
//                   <td className="small">{p._id?.substring(0, 8)}...</td>
//                   <td>{p.supplier?.name || "-"}</td>
//                   <td>Rs. {Number(p.totalCost || 0).toLocaleString()}</td>
//                   <td>
//                     <span
//                       className={
//                         "badge " +
//                         (p.status === "Received"
//                           ? "bg-success"
//                           : p.status === "Ordered"
//                           ? "bg-info text-dark"
//                           : p.status === "Pending"
//                           ? "bg-warning text-dark"
//                           : "bg-secondary")
//                       }
//                     >
//                       {p.status}
//                     </span>
//                   </td>
//                   <td className="small">
//                     {p.orderedAt
//                       ? new Date(p.orderedAt).toLocaleDateString()
//                       : "-"}
//                   </td>
//                   <td className="small">
//                     {p.receivedAt
//                       ? new Date(p.receivedAt).toLocaleDateString()
//                       : "-"}
//                   </td>
//                   <td>
//                     {p.status !== "Received" && p.status !== "Cancelled" && (
//                       <button
//                         className="btn btn-sm btn-success me-1"
//                         onClick={() => handleReceivePO(p._id)}
//                         disabled={updatingId === p._id}
//                       >
//                         {updatingId === p._id
//                           ? "Receiving..."
//                           : "Mark Received"}
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Create Purchase Order Modal */}
//       {showCreateForm && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
//           style={{ zIndex: 1050 }}
//         >
//           <div
//             className="bg-white rounded shadow p-4"
//             style={{
//               maxWidth: 700,
//               width: "100%",
//               maxHeight: "90vh",
//               overflowY: "auto",
//             }}
//           >
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="mb-0">New Purchase Order</h5>
//               <button
//                 className="btn btn-sm btn-outline-secondary"
//                 onClick={() => {
//                   setShowCreateForm(false);
//                   resetForm();
//                 }}
//                 disabled={saving}
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleSubmitPO}>
//               <div className="mb-3">
//                 <label className="form-label">Supplier *</label>
//                 <select
//                   name="supplier"
//                   className="form-select"
//                   value={formData.supplier}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       supplier: e.target.value,
//                     }))
//                   }
//                   required
//                   disabled={saving}
//                 >
//                   <option value="">Select supplier...</option>
//                   {suppliers.map((s) => (
//                     <option key={s._id} value={s._id}>
//                       {s.name} {s.isActive ? "" : " (inactive)"}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Items *</label>
//                 {formData.items.length === 0 ? (
//                   <p className="text-muted small mb-0">No items added</p>
//                 ) : (
//                   <div className="table-responsive">
//                     <table className="table table-sm">
//                       <thead>
//                         <tr>
//                           <th>Medicine ID</th>
//                           <th>Qty</th>
//                           <th>Cost/Unit</th>
//                           <th>Batch</th>
//                           <th>Expiry</th>
//                           <th>Total</th>
//                           <th></th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {formData.items.map((item, index) => {
//                           const itemTotal =
//                             Number(item.costPrice || 0) *
//                             Number(item.quantity || 0);
//                           return (
//                             <tr key={index}>
//                               <td>
//                                 <input
//                                   type="text"
//                                   className="form-control form-control-sm"
//                                   placeholder="Medicine ID"
//                                   value={item.medicine}
//                                   onChange={(e) =>
//                                     updateItem(
//                                       index,
//                                       "medicine",
//                                       e.target.value
//                                     )
//                                   }
//                                   disabled={saving}
//                                   list={`medicines-list-${index}`}
//                                   style={{ minWidth: 120 }}
//                                 />
//                                 <datalist id={`medicines-list-${index}`}>
//                                   {medicines.map((m) => (
//                                     <option key={m._id} value={m._id}>
//                                       {m.name}
//                                     </option>
//                                   ))}
//                                 </datalist>
//                               </td>
//                               <td>
//                                 <input
//                                   type="number"
//                                   className="form-control form-control-sm"
//                                   value={item.quantity}
//                                   onChange={(e) =>
//                                     updateItem(
//                                       index,
//                                       "quantity",
//                                       e.target.value
//                                     )
//                                   }
//                                   min="1"
//                                   disabled={saving}
//                                   style={{ width: 70 }}
//                                 />
//                               </td>
//                               <td>
//                                 <input
//                                   type="number"
//                                   step="0.01"
//                                   className="form-control form-control-sm"
//                                   value={item.costPrice}
//                                   onChange={(e) =>
//                                     updateItem(
//                                       index,
//                                       "costPrice",
//                                       e.target.value
//                                     )
//                                   }
//                                   disabled={saving}
//                                   style={{ width: 90 }}
//                                 />
//                               </td>
//                               <td>
//                                 <input
//                                   type="text"
//                                   className="form-control form-control-sm"
//                                   value={item.batchNumber}
//                                   onChange={(e) =>
//                                     updateItem(
//                                       index,
//                                       "batchNumber",
//                                       e.target.value
//                                     )
//                                   }
//                                   disabled={saving}
//                                   style={{ width: 90 }}
//                                 />
//                               </td>
//                               <td>
//                                 <input
//                                   type="date"
//                                   className="form-control form-control-sm"
//                                   value={item.expiryDate}
//                                   onChange={(e) =>
//                                     updateItem(
//                                       index,
//                                       "expiryDate",
//                                       e.target.value
//                                     )
//                                   }
//                                   disabled={saving}
//                                   style={{ width: 110 }}
//                                 />
//                               </td>
//                               <td className="fw-bold text-success">
//                                 Rs. {itemTotal.toFixed(2)}
//                               </td>
//                               <td>
//                                 <button
//                                   type="button"
//                                   className="btn btn-sm btn-outline-danger"
//                                   onClick={() => removeItem(index)}
//                                   disabled={saving}
//                                 >
//                                   ×
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//                 <button
//                   type="button"
//                   className="btn btn-outline-secondary btn-sm mt-2"
//                   onClick={addItem}
//                   disabled={saving}
//                 >
//                   + Add Item
//                 </button>
//               </div>

//               <div className="row mb-3">
//                 <div className="col-md-6">
//                   <label className="form-label">Notes</label>
//                   <textarea
//                     name="notes"
//                     className="form-control form-control-sm"
//                     rows={2}
//                     value={formData.notes}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         notes: e.target.value,
//                       }))
//                     }
//                     disabled={saving}
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label fw-bold">Total Cost</label>
//                   <div className="h5 text-success mb-0 mt-3">
//                     Rs. {totalCost.toLocaleString()}
//                   </div>
//                 </div>
//               </div>

//               <div className="d-flex justify-content-end gap-2">
//                 <button
//                   type="button"
//                   className="btn btn-outline-secondary btn-sm"
//                   onClick={() => {
//                     setShowCreateForm(false);
//                     resetForm();
//                   }}
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary btn-sm"
//                   disabled={saving || formData.items.length === 0}
//                 >
//                   {saving ? "Creating..." : "Create PO"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminPurchases;

// import React, { useEffect, useState } from "react";
// import api from "../services/api"; // ✅ Uses interceptor for automatic Token handling

// const AdminPurchases = () => {
//   const [purchases, setPurchases] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [updatingId, setUpdatingId] = useState(null);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [search, setSearch] = useState("");

//   // Create PO form state
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [formData, setFormData] = useState({
//     supplier: "",
//     notes: "",
//     items: [],
//   });

//   const resetForm = () => {
//     setFormData({
//       supplier: "",
//       notes: "",
//       items: [],
//     });
//   };

//   // Load all data
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       // ✅ Clean API calls (Interceptor adds Authorization header)
//       const [purchasesRes, suppliersRes, medicinesRes] = await Promise.all([
//         api.get("/admin/purchases"),
//         api.get("/admin/suppliers"),
//         api.get("/admin/medicines"),
//       ]);

//       setPurchases(purchasesRes.data || []);
//       setSuppliers(suppliersRes.data || []);
//       setMedicines(medicinesRes.data || []);
//     } catch (err) {
//       console.error("Fetch purchases error:", err);
//       setError(
//         err.response?.data?.message ||
//           (err.response?.status === 403
//             ? "Access Denied: Admin only"
//             : "Failed to load purchase data")
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Add item to PO
//   const addItem = () => {
//     setFormData((prev) => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         {
//           medicine: "",
//           quantity: 1,
//           costPrice: 0,
//           batchNumber: "",
//           expiryDate: "",
//         },
//       ],
//     }));
//   };

//   const removeItem = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       items: prev.items.filter((_, i) => i !== index),
//     }));
//   };

//   const updateItem = (index, field, value) => {
//     setFormData((prev) => {
//       const newItems = [...prev.items];
//       newItems[index] = { ...newItems[index], [field]: value };
//       return { ...prev, items: newItems };
//     });
//   };

//   const handleSubmitPO = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!formData.supplier) {
//       setError("Please select a supplier.");
//       return;
//     }
//     if (formData.items.length === 0) {
//       setError("Please add at least one item.");
//       return;
//     }

//     try {
//       setSaving(true);
//       // ✅ POST request using api instance
//       await api.post("/admin/purchases", formData);

//       setSuccess("Purchase order created successfully.");
//       setShowCreateForm(false);
//       resetForm();
//       fetchData(); // Refresh list
//     } catch (err) {
//       console.error("Create PO error:", err);
//       setError(
//         err.response?.data?.message || "Failed to create purchase order."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleReceivePO = async (id) => {
//     if (
//       !window.confirm(
//         "Mark this purchase order as received? Stock will be updated."
//       )
//     ) {
//       return;
//     }

//     try {
//       setUpdatingId(id);
//       setError("");
//       setSuccess("");

//       // ✅ PUT request using api instance
//       const res = await api.put(`/admin/purchases/${id}/status`, {
//         status: "Received",
//       });

//       // Update local state
//       setPurchases((prev) =>
//         prev.map((p) => (p._id === id ? res.data.purchase : p))
//       );
//       setSuccess("Purchase order marked as received. Stock updated.");
//     } catch (err) {
//       console.error("Receive PO error:", err);
//       setError(
//         err.response?.data?.message || "Failed to update purchase order."
//       );
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const filteredPurchases = purchases.filter((p) => {
//     const q = search.trim().toLowerCase();
//     if (!q) return true;
//     const supplierName = (p.supplier?.name || "").toLowerCase();
//     const status = (p.status || "").toLowerCase();
//     return (
//       supplierName.includes(q) ||
//       status.includes(q) ||
//       String(p._id || "").includes(q)
//     );
//   });

//   const totalCost = formData.items.reduce(
//     (sum, item) =>
//       sum + Number(item.costPrice || 0) * Number(item.quantity || 0),
//     0
//   );

//   return (
//     <div className="container-fluid p-0">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//         <h3 className="fw-bold mb-0">Purchase Orders</h3>
//         <div className="d-flex gap-2">
//           <input
//             type="search"
//             className="form-control form-control-sm"
//             style={{ maxWidth: 260 }}
//             placeholder="Search purchases..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button
//             className="btn btn-success btn-sm d-flex align-items-center gap-1"
//             onClick={() => setShowCreateForm(true)}
//             disabled={saving}
//           >
//             <span>+</span> New Order
//           </button>
//         </div>
//       </div>

//       {/* Alerts */}
//       {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
//       {success && (
//         <div className="alert alert-success py-2 mb-3">{success}</div>
//       )}

//       {/* Main Table */}
//       <div className="card shadow-sm border-0 rounded-3">
//         <div className="card-body p-0">
//           {loading ? (
//             <div className="d-flex align-items-center justify-content-center py-5">
//               <div className="spinner-border text-primary me-2" role="status" />
//               <span>Loading purchases...</span>
//             </div>
//           ) : filteredPurchases.length === 0 ? (
//             <div className="text-center py-5 text-muted">
//               <p className="mb-0">No purchase orders found.</p>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="bg-light">
//                   <tr className="text-uppercase small text-muted">
//                     <th className="py-3 ps-4">ID</th>
//                     <th className="py-3">Supplier</th>
//                     <th className="py-3">Total Cost</th>
//                     <th className="py-3">Status</th>
//                     <th className="py-3">Ordered</th>
//                     <th className="py-3">Received</th>
//                     <th className="py-3 pe-4" style={{ width: 150 }}>
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredPurchases.map((p) => (
//                     <tr key={p._id}>
//                       <td className="ps-4 small font-monospace text-muted">
//                         {p._id?.substring(0, 8)}...
//                       </td>
//                       <td className="fw-medium">{p.supplier?.name || "-"}</td>
//                       <td className="fw-bold text-dark">
//                         Rs. {Number(p.totalCost || 0).toLocaleString()}
//                       </td>
//                       <td>
//                         <span
//                           className={
//                             "badge rounded-pill " +
//                             (p.status === "Received"
//                               ? "bg-success"
//                               : p.status === "Ordered"
//                               ? "bg-info text-dark"
//                               : p.status === "Pending"
//                               ? "bg-warning text-dark"
//                               : "bg-secondary")
//                           }
//                         >
//                           {p.status}
//                         </span>
//                       </td>
//                       <td className="small text-muted">
//                         {p.orderedAt
//                           ? new Date(p.orderedAt).toLocaleDateString()
//                           : "-"}
//                       </td>
//                       <td className="small text-muted">
//                         {p.receivedAt
//                           ? new Date(p.receivedAt).toLocaleDateString()
//                           : "-"}
//                       </td>
//                       <td className="pe-4">
//                         {p.status !== "Received" &&
//                           p.status !== "Cancelled" && (
//                             <button
//                               className="btn btn-sm btn-outline-success w-100"
//                               onClick={() => handleReceivePO(p._id)}
//                               disabled={updatingId === p._id}
//                             >
//                               {updatingId === p._id ? (
//                                 <>
//                                   <span className="spinner-border spinner-border-sm me-1" />
//                                   Receiving...
//                                 </>
//                               ) : (
//                                 "Mark Received"
//                               )}
//                             </button>
//                           )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Create Purchase Order Modal */}
//       {showCreateForm && (
//         <>
//           <div className="modal-backdrop fade show"></div>
//           <div className="modal fade show d-block" tabIndex="-1">
//             <div className="modal-dialog modal-lg modal-dialog-centered">
//               <div className="modal-content shadow">
//                 <div className="modal-header border-bottom-0 pb-0">
//                   <h5 className="modal-title fw-bold">New Purchase Order</h5>
//                   <button
//                     className="btn-close"
//                     onClick={() => {
//                       setShowCreateForm(false);
//                       resetForm();
//                     }}
//                     disabled={saving}
//                   ></button>
//                 </div>

//                 <div className="modal-body">
//                   <form onSubmit={handleSubmitPO}>
//                     {/* Supplier Selection */}
//                     <div className="mb-4">
//                       <label className="form-label fw-medium">
//                         Supplier <span className="text-danger">*</span>
//                       </label>
//                       <select
//                         name="supplier"
//                         className="form-select"
//                         value={formData.supplier}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             supplier: e.target.value,
//                           }))
//                         }
//                         required
//                         disabled={saving}
//                       >
//                         <option value="">Select a supplier...</option>
//                         {suppliers.map((s) => (
//                           <option key={s._id} value={s._id}>
//                             {s.name} {s.isActive ? "" : " (inactive)"}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Items Table */}
//                     <div className="mb-3">
//                       <div className="d-flex justify-content-between align-items-center mb-2">
//                         <label className="form-label fw-medium mb-0">
//                           Items <span className="text-danger">*</span>
//                         </label>
//                         <button
//                           type="button"
//                           className="btn btn-outline-primary btn-sm"
//                           onClick={addItem}
//                           disabled={saving}
//                         >
//                           + Add Item
//                         </button>
//                       </div>

//                       <div
//                         className="table-responsive border rounded bg-light p-2"
//                         style={{ maxHeight: "300px" }}
//                       >
//                         {formData.items.length === 0 ? (
//                           <div className="text-center text-muted py-4 small">
//                             No items added yet. Click "+ Add Item" to start.
//                           </div>
//                         ) : (
//                           <table className="table table-sm table-borderless mb-0 align-middle">
//                             <thead className="text-muted small border-bottom">
//                               <tr>
//                                 <th style={{ minWidth: 150 }}>Medicine</th>
//                                 <th style={{ width: 80 }}>Qty</th>
//                                 <th style={{ width: 100 }}>Cost</th>
//                                 <th style={{ width: 100 }}>Batch</th>
//                                 <th style={{ width: 130 }}>Expiry</th>
//                                 <th className="text-end">Total</th>
//                                 <th style={{ width: 40 }}></th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {formData.items.map((item, index) => {
//                                 const itemTotal =
//                                   Number(item.costPrice || 0) *
//                                   Number(item.quantity || 0);
//                                 return (
//                                   <tr key={index}>
//                                     <td>
//                                       <input
//                                         type="text"
//                                         className="form-control form-control-sm"
//                                         placeholder="Search..."
//                                         value={item.medicine}
//                                         onChange={(e) =>
//                                           updateItem(
//                                             index,
//                                             "medicine",
//                                             e.target.value
//                                           )
//                                         }
//                                         disabled={saving}
//                                         list={`medicines-list-${index}`}
//                                       />
//                                       <datalist id={`medicines-list-${index}`}>
//                                         {medicines.map((m) => (
//                                           <option key={m._id} value={m._id}>
//                                             {m.name}
//                                           </option>
//                                         ))}
//                                       </datalist>
//                                     </td>
//                                     <td>
//                                       <input
//                                         type="number"
//                                         className="form-control form-control-sm"
//                                         value={item.quantity}
//                                         onChange={(e) =>
//                                           updateItem(
//                                             index,
//                                             "quantity",
//                                             e.target.value
//                                           )
//                                         }
//                                         min="1"
//                                         disabled={saving}
//                                       />
//                                     </td>
//                                     <td>
//                                       <input
//                                         type="number"
//                                         className="form-control form-control-sm"
//                                         value={item.costPrice}
//                                         onChange={(e) =>
//                                           updateItem(
//                                             index,
//                                             "costPrice",
//                                             e.target.value
//                                           )
//                                         }
//                                         disabled={saving}
//                                       />
//                                     </td>
//                                     <td>
//                                       <input
//                                         type="text"
//                                         className="form-control form-control-sm"
//                                         value={item.batchNumber}
//                                         onChange={(e) =>
//                                           updateItem(
//                                             index,
//                                             "batchNumber",
//                                             e.target.value
//                                           )
//                                         }
//                                         disabled={saving}
//                                       />
//                                     </td>
//                                     <td>
//                                       <input
//                                         type="date"
//                                         className="form-control form-control-sm"
//                                         value={item.expiryDate}
//                                         onChange={(e) =>
//                                           updateItem(
//                                             index,
//                                             "expiryDate",
//                                             e.target.value
//                                           )
//                                         }
//                                         disabled={saving}
//                                       />
//                                     </td>
//                                     <td className="text-end fw-medium text-success">
//                                       {itemTotal.toFixed(2)}
//                                     </td>
//                                     <td className="text-end">
//                                       <button
//                                         type="button"
//                                         className="btn btn-link text-danger p-0"
//                                         onClick={() => removeItem(index)}
//                                         disabled={saving}
//                                         title="Remove item"
//                                       >
//                                         &times;
//                                       </button>
//                                     </td>
//                                   </tr>
//                                 );
//                               })}
//                             </tbody>
//                           </table>
//                         )}
//                       </div>
//                     </div>

//                     {/* Footer / Summary */}
//                     <div className="row g-3 align-items-center bg-light p-3 rounded mx-0">
//                       <div className="col-md-8">
//                         <label className="form-label small text-muted mb-1">
//                           Notes
//                         </label>
//                         <textarea
//                           name="notes"
//                           className="form-control form-control-sm"
//                           rows={2}
//                           value={formData.notes}
//                           onChange={(e) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               notes: e.target.value,
//                             }))
//                           }
//                           disabled={saving}
//                           placeholder="Optional notes..."
//                         />
//                       </div>
//                       <div className="col-md-4 text-end">
//                         <div className="small text-muted">Grand Total</div>
//                         <div className="h4 fw-bold text-success mb-0">
//                           Rs. {totalCost.toLocaleString()}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="d-flex justify-content-end gap-2 mt-4">
//                       <button
//                         type="button"
//                         className="btn btn-light border"
//                         onClick={() => {
//                           setShowCreateForm(false);
//                           resetForm();
//                         }}
//                         disabled={saving}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className="btn btn-primary px-4"
//                         disabled={saving || formData.items.length === 0}
//                       >
//                         {saving ? (
//                           <>
//                             <span className="spinner-border spinner-border-sm me-2" />
//                             Creating...
//                           </>
//                         ) : (
//                           "Create PO"
//                         )}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminPurchases;

import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Plus,
  Search,
  Trash2,
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  X,
} from "lucide-react";

const AdminPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    supplier: "",
    notes: "",
    items: [],
  });

  const resetForm = () => {
    setFormData({ supplier: "", notes: "", items: [] });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [purchasesRes, suppliersRes, medicinesRes] = await Promise.all([
        api.get("/admin/purchases"),
        api.get("/admin/suppliers"),
        api.get("/admin/medicines"),
      ]);

      setPurchases(
        Array.isArray(purchasesRes) ? purchasesRes : purchasesRes.data || []
      );
      setSuppliers(
        Array.isArray(suppliersRes) ? suppliersRes : suppliersRes.data || []
      );
      setMedicines(
        Array.isArray(medicinesRes) ? medicinesRes : medicinesRes.data || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load database records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          medicine: "",
          quantity: 1,
          costPrice: 0,
          batchNumber: "",
          expiryDate: "",
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index, field, value) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const handleSubmitPO = async (e) => {
    e.preventDefault();
    if (!formData.supplier || formData.items.length === 0) {
      setError("Incomplete order: Supplier and at least one item required.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/admin/purchases", formData);
      setSuccess("New Purchase Order logged to database.");
      setShowCreateForm(false);
      resetForm();
      fetchData();
    } catch (err) {
      setError("Database Error: Could not save purchase order.");
    } finally {
      setSaving(false);
    }
  };

  const handleReceivePO = async (id) => {
    if (
      !window.confirm(
        "Verify Receipt: This will update live inventory stock levels."
      )
    )
      return;
    try {
      setUpdatingId(id);
      await api.put(`/admin/purchases/${id}/status`, { status: "Received" });
      setSuccess("Stock updated successfully.");
      fetchData();
    } catch (err) {
      setError("Transaction failed: Check server logs.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredPurchases = purchases.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.supplier?.name || "").toLowerCase().includes(q) ||
      (p.status || "").toLowerCase().includes(q) ||
      p._id.includes(q)
    );
  });

  const totalCost = formData.items.reduce(
    (sum, item) =>
      sum + Number(item.costPrice || 0) * Number(item.quantity || 0),
    0
  );

  return (
    <div className="container-fluid p-0 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Truck className="text-primary" /> Purchase History
          </h3>
          <p className="text-muted small mb-0">
            Record and track inventory arrivals from suppliers
          </p>
        </div>
        <div className="d-flex gap-2">
          <div className="input-group input-group-sm shadow-sm border rounded-pill overflow-hidden bg-white">
            <span className="input-group-text bg-white border-0 ps-3">
              <Search size={16} />
            </span>
            <input
              type="search"
              className="form-control border-0 shadow-none"
              placeholder="Search POs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={16} className="me-1" /> Log New Arrival
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2 d-flex align-items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success py-2 text-center shadow-sm">
          {success}
        </div>
      )}

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light border-bottom">
              <tr className="text-uppercase small text-muted fw-bold">
                <th className="py-3 ps-4">Order Reference</th>
                <th className="py-3">Supplier Name</th>
                <th className="py-3">Financial Value</th>
                <th className="py-3">Process Status</th>
                <th className="py-3">Arrival Date</th>
                <th className="py-3 pe-4 text-end">Stock Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary" />
                  </td>
                </tr>
              ) : filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <Package size={48} className="text-muted opacity-25 mb-2" />
                    <p className="text-muted">
                      No purchase records found in the database.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((p) => (
                  <tr key={p._id}>
                    <td className="ps-4">
                      <div className="fw-bold text-primary small">
                        #PO-{p._id.substring(p._id.length - 6).toUpperCase()}
                      </div>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Database ID: {p._id.substring(0, 8)}...
                      </div>
                    </td>
                    <td>
                      <div className="fw-medium text-dark">
                        {p.supplier?.name || "Unknown Vendor"}
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">
                        Rs. {Number(p.totalCost || 0).toLocaleString()}
                      </div>
                      <div className="small text-muted">
                        {p.items?.length || 0} Products Included
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill px-3 py-1 ${
                          p.status === "Received"
                            ? "bg-success-subtle text-success border border-success-subtle"
                            : p.status === "Ordered"
                            ? "bg-info-subtle text-info border border-info-subtle"
                            : "bg-warning-subtle text-warning border border-warning-subtle"
                        }`}
                      >
                        {p.status === "Received" ? (
                          <CheckCircle size={12} className="me-1" />
                        ) : (
                          <Clock size={12} className="me-1" />
                        )}
                        {p.status}
                      </span>
                    </td>
                    <td className="small text-muted">
                      {p.receivedAt ? (
                        <div>
                          <CheckCircle size={10} />{" "}
                          {new Date(p.receivedAt).toLocaleDateString()}
                        </div>
                      ) : (
                        "Pending Receipt"
                      )}
                    </td>
                    <td className="pe-4 text-end">
                      {p.status !== "Received" && (
                        <button
                          className="btn btn-sm btn-success rounded-pill px-3 shadow-sm"
                          onClick={() => handleReceivePO(p._id)}
                          disabled={updatingId === p._id}
                        >
                          {updatingId === p._id ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            "Verify & Receive"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Modal */}
      {showCreateForm && (
        <div className="modal show d-block animate-fade-in" tabIndex="-1">
          <div
            className="modal-backdrop fade show"
            onClick={() => !saving && setShowCreateForm(false)}
          ></div>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0 ps-4">
                <h5 className="modal-title fw-bold">Log New Stock Arrival</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateForm(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmitPO}>
                <div className="modal-body p-4">
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">
                      Select Supplier Vendor *
                    </label>
                    <select
                      className="form-select border-2"
                      value={formData.supplier}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier: e.target.value })
                      }
                      required
                    >
                      <option value="">Choose from active suppliers...</option>
                      {suppliers.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label small fw-bold text-muted mb-0">
                        Incoming Item List
                      </label>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        onClick={addItem}
                      >
                        + Add Medicine
                      </button>
                    </div>

                    <div className="border rounded-3 overflow-hidden bg-light">
                      <table className="table table-sm mb-0 align-middle">
                        <thead className="small bg-white text-muted">
                          <tr>
                            <th className="ps-3 py-2">Medicine Item</th>
                            <th style={{ width: 80 }}>Qty</th>
                            <th style={{ width: 110 }}>Unit Cost</th>
                            <th style={{ width: 100 }}>Batch #</th>
                            <th className="text-end pe-3">Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.items.map((item, index) => (
                            <tr key={index} className="bg-transparent">
                              <td className="ps-3">
                                <select
                                  className="form-select form-select-sm border-0 bg-white"
                                  value={item.medicine}
                                  onChange={(e) =>
                                    updateItem(
                                      index,
                                      "medicine",
                                      e.target.value
                                    )
                                  }
                                  required
                                >
                                  <option value="">Select Item...</option>
                                  {medicines.map((m) => (
                                    <option key={m._id} value={m._id}>
                                      {m.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm border-0"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateItem(
                                      index,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  min="1"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm border-0"
                                  value={item.costPrice}
                                  onChange={(e) =>
                                    updateItem(
                                      index,
                                      "costPrice",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm border-0"
                                  placeholder="ID"
                                  value={item.batchNumber}
                                  onChange={(e) =>
                                    updateItem(
                                      index,
                                      "batchNumber",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td className="text-end pe-3">
                                <button
                                  type="button"
                                  className="btn btn-link text-danger p-0 shadow-none"
                                  onClick={() => removeItem(index)}
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

                  <div className="row g-3 align-items-center mt-3 bg-light rounded-3 p-3 mx-0 border-dashed border-2">
                    <div className="col-md-7">
                      <label className="form-label small fw-bold text-muted mb-1">
                        Administrative Notes
                      </label>
                      <textarea
                        className="form-control border-0 bg-white"
                        rows={2}
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        placeholder="e.g. Broken seal check, delivery condition..."
                      ></textarea>
                    </div>
                    <div className="col-md-5 text-end">
                      <span className="small text-muted d-block text-uppercase fw-bold">
                        Total Payable Cost
                      </span>
                      <span className="h3 fw-bold text-success">
                        Rs. {totalCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0 pe-4 pb-4">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4 me-2"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 shadow-sm"
                    disabled={saving || formData.items.length === 0}
                  >
                    {saving ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      "Authorize Order"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .border-dashed { border-style: dashed !important; }
      `}</style>
    </div>
  );
};

export default AdminPurchases;
