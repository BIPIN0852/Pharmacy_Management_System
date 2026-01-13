// import React, { useEffect, useState } from "react";
// import api from "../services/api"; // ✅ Uses interceptor for Token

// const AdminSuppliers = () => {
//   const [suppliers, setSuppliers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [search, setSearch] = useState("");

//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     contactPerson: "",
//     phone: "",
//     email: "",
//     address: "",
//     gstOrPan: "",
//     notes: "",
//     isActive: true,
//   });

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       name: "",
//       contactPerson: "",
//       phone: "",
//       email: "",
//       address: "",
//       gstOrPan: "",
//       notes: "",
//       isActive: true,
//     });
//   };

//   const fetchSuppliers = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       // ✅ Call API (Interceptor handles Token)
//       const res = await api.get("/admin/suppliers");

//       setSuppliers(res.data || []);
//     } catch (err) {
//       console.error("Fetch suppliers error:", err);
//       setError(
//         err.response?.data?.message ||
//           (err.response?.status === 403
//             ? "Access Denied: Admin only"
//             : "Failed to load suppliers")
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSuppliers();
//   }, []);

//   const openCreate = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const openEdit = (supplier) => {
//     setEditingId(supplier._id);
//     setFormData({
//       name: supplier.name || "",
//       contactPerson: supplier.contactPerson || "",
//       phone: supplier.phone || "",
//       email: supplier.email || "",
//       address: supplier.address || "",
//       gstOrPan: supplier.gstOrPan || "",
//       notes: supplier.notes || "",
//       isActive: supplier.isActive !== false,
//     });
//     setShowForm(true);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!formData.name.trim()) {
//       setError("Supplier name is required.");
//       return;
//     }

//     try {
//       setSaving(true);
//       const payload = { ...formData };

//       if (editingId) {
//         // ✅ PUT Request
//         await api.put(`/admin/suppliers/${editingId}`, payload);
//         setSuccess("Supplier updated successfully.");
//       } else {
//         // ✅ POST Request
//         await api.post("/admin/suppliers", payload);
//         setSuccess("Supplier created successfully.");
//       }

//       setShowForm(false);
//       resetForm();
//       fetchSuppliers(); // Refresh list

//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       console.error("Save supplier error:", err);
//       setError(
//         err.response?.data?.message ||
//           "Failed to save supplier. Please try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDeactivate = async (id) => {
//     if (
//       !window.confirm(
//         "Deactivate this supplier? They will no longer be active."
//       )
//     ) {
//       return;
//     }
//     try {
//       setError("");
//       setSuccess("");

//       // ✅ DELETE Request
//       await api.delete(`/admin/suppliers/${id}`);

//       setSuccess("Supplier deactivated.");
//       setSuppliers((prev) =>
//         prev.map((s) => (s._id === id ? { ...s, isActive: false } : s))
//       );

//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       console.error("Deactivate error:", err);
//       setError(err.response?.data?.message || "Failed to deactivate supplier.");
//     }
//   };

//   const filteredSuppliers = suppliers.filter((s) => {
//     const q = search.trim().toLowerCase();
//     if (!q) return true;
//     return (
//       (s.name || "").toLowerCase().includes(q) ||
//       (s.contactPerson || "").toLowerCase().includes(q) ||
//       (s.phone || "").toLowerCase().includes(q) ||
//       (s.email || "").toLowerCase().includes(q)
//     );
//   });

//   return (
//     <div className="container-fluid p-0">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//         <h3 className="fw-bold mb-0">Suppliers</h3>
//         <div className="d-flex gap-2">
//           <input
//             type="search"
//             className="form-control form-control-sm"
//             style={{ maxWidth: 260 }}
//             placeholder="Search suppliers..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button
//             className="btn btn-success btn-sm d-flex align-items-center gap-1"
//             onClick={openCreate}
//           >
//             <span>+</span> Add Supplier
//           </button>
//         </div>
//       </div>

//       {/* Notifications */}
//       {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
//       {success && (
//         <div className="alert alert-success py-2 mb-3">{success}</div>
//       )}

//       {/* Table */}
//       <div className="card shadow-sm border-0 rounded-3">
//         <div className="card-body p-0">
//           {loading ? (
//             <div className="d-flex align-items-center justify-content-center py-5">
//               <div className="spinner-border text-primary me-2" role="status" />
//               <span>Loading suppliers...</span>
//             </div>
//           ) : filteredSuppliers.length === 0 ? (
//             <div className="text-center py-5 text-muted">
//               <p className="mb-0">No suppliers found.</p>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="bg-light">
//                   <tr className="text-uppercase small text-muted">
//                     <th className="py-3 ps-4">Name</th>
//                     <th className="py-3">Contact Person</th>
//                     <th className="py-3">Phone</th>
//                     <th className="py-3">Email</th>
//                     <th className="py-3">Status</th>
//                     <th className="py-3 pe-4 text-end" style={{ width: 180 }}>
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredSuppliers.map((s) => (
//                     <tr key={s._id}>
//                       <td className="ps-4 fw-medium text-dark">{s.name}</td>
//                       <td>{s.contactPerson || "-"}</td>
//                       <td>{s.phone || "-"}</td>
//                       <td>{s.email || "-"}</td>
//                       <td>
//                         {s.isActive ? (
//                           <span className="badge bg-success bg-opacity-75">
//                             Active
//                           </span>
//                         ) : (
//                           <span className="badge bg-secondary">Inactive</span>
//                         )}
//                       </td>
//                       <td className="pe-4 text-end">
//                         <button
//                           className="btn btn-sm btn-outline-primary me-2"
//                           onClick={() => openEdit(s)}
//                         >
//                           Edit
//                         </button>
//                         {s.isActive && (
//                           <button
//                             className="btn btn-sm btn-outline-danger"
//                             onClick={() => handleDeactivate(s._id)}
//                           >
//                             Deactivate
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal Form */}
//       {showForm && (
//         <>
//           <div className="modal-backdrop fade show"></div>
//           <div className="modal fade show d-block" tabIndex="-1">
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content shadow">
//                 <div className="modal-header border-bottom-0">
//                   <h5 className="modal-title fw-bold">
//                     {editingId ? "Edit Supplier" : "Add New Supplier"}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => {
//                       if (!saving) {
//                         setShowForm(false);
//                         resetForm();
//                       }
//                     }}
//                   ></button>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                   <div className="modal-body">
//                     <div className="mb-3">
//                       <label className="form-label fw-medium">
//                         Name <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="name"
//                         className="form-control"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                         disabled={saving}
//                       />
//                     </div>

//                     <div className="row g-3 mb-3">
//                       <div className="col-md-6">
//                         <label className="form-label fw-medium">
//                           Contact Person
//                         </label>
//                         <input
//                           type="text"
//                           name="contactPerson"
//                           className="form-control"
//                           value={formData.contactPerson}
//                           onChange={handleChange}
//                           disabled={saving}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label fw-medium">GST/PAN</label>
//                         <input
//                           type="text"
//                           name="gstOrPan"
//                           className="form-control"
//                           value={formData.gstOrPan}
//                           onChange={handleChange}
//                           disabled={saving}
//                         />
//                       </div>
//                     </div>

//                     <div className="row g-3 mb-3">
//                       <div className="col-md-6">
//                         <label className="form-label fw-medium">Phone</label>
//                         <input
//                           type="text"
//                           name="phone"
//                           className="form-control"
//                           value={formData.phone}
//                           onChange={handleChange}
//                           disabled={saving}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label fw-medium">Email</label>
//                         <input
//                           type="email"
//                           name="email"
//                           className="form-control"
//                           value={formData.email}
//                           onChange={handleChange}
//                           disabled={saving}
//                         />
//                       </div>
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label fw-medium">Address</label>
//                       <textarea
//                         name="address"
//                         className="form-control"
//                         rows="2"
//                         value={formData.address}
//                         onChange={handleChange}
//                         disabled={saving}
//                       />
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label fw-medium">Notes</label>
//                       <textarea
//                         name="notes"
//                         className="form-control"
//                         rows="2"
//                         value={formData.notes}
//                         onChange={handleChange}
//                         disabled={saving}
//                       />
//                     </div>

//                     <div className="form-check">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id="isActive"
//                         name="isActive"
//                         checked={formData.isActive}
//                         onChange={handleChange}
//                         disabled={saving}
//                       />
//                       <label className="form-check-label" htmlFor="isActive">
//                         Active supplier
//                       </label>
//                     </div>
//                   </div>

//                   <div className="modal-footer border-top-0 pt-0">
//                     <button
//                       type="button"
//                       className="btn btn-light"
//                       onClick={() => {
//                         if (!saving) {
//                           setShowForm(false);
//                           resetForm();
//                         }
//                       }}
//                       disabled={saving}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="btn btn-primary px-4"
//                       disabled={saving}
//                     >
//                       {saving ? (
//                         <>
//                           <span className="spinner-border spinner-border-sm me-2" />
//                           Saving...
//                         </>
//                       ) : editingId ? (
//                         "Update Supplier"
//                       ) : (
//                         "Create Supplier"
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

// export default AdminSuppliers;

import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Plus,
  Search,
  Edit3,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  UserX,
  AlertCircle,
  X,
} from "lucide-react";

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    gstOrPan: "",
    notes: "",
    isActive: true,
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      gstOrPan: "",
      notes: "",
      isActive: true,
    });
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError("");
      // ✅ Hits the real backend route /api/admin/suppliers
      const res = await api.get("/admin/suppliers");
      const data = Array.isArray(res) ? res : res.data || [];
      setSuppliers(data);
    } catch (err) {
      console.error("Fetch suppliers error:", err);
      setError(
        err.response?.data?.message || "Failed to load database suppliers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (supplier) => {
    setEditingId(supplier._id);
    setFormData({
      name: supplier.name || "",
      contactPerson: supplier.contactPerson || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
      gstOrPan: supplier.gstOrPan || "",
      notes: supplier.notes || "",
      isActive: supplier.isActive !== false,
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Supplier name is required.");
      return;
    }

    try {
      setSaving(true);
      const payload = { ...formData };

      if (editingId) {
        // ✅ Real PUT request to database
        await api.put(`/admin/suppliers/${editingId}`, payload);
        setSuccess("Supplier record updated.");
      } else {
        // ✅ Real POST request to database
        await api.post("/admin/suppliers", payload);
        setSuccess("New supplier registered.");
      }

      setShowForm(false);
      resetForm();
      fetchSuppliers();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Database save error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Mark this supplier as inactive?")) return;
    try {
      setError("");
      // ✅ Actual DELETE or Patch to DB
      await api.delete(`/admin/suppliers/${id}`);
      setSuccess("Supplier status changed.");
      fetchSuppliers();
    } catch (err) {
      setError("Server error during status update.");
    }
  };

  const filteredSuppliers = suppliers.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (s.name || "").toLowerCase().includes(q) ||
      (s.contactPerson || "").toLowerCase().includes(q) ||
      (s.phone || "").toLowerCase().includes(q) ||
      (s.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="container-fluid p-0 animate-fade-in">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
            Supplier Management
          </h3>
          <p className="text-muted small mb-0">
            Manage wholesale vendors and contact points
          </p>
        </div>
        <div className="d-flex gap-2">
          <div className="input-group input-group-sm shadow-sm border rounded-pill overflow-hidden bg-white">
            <span className="input-group-text bg-white border-0 ps-3">
              <Search size={16} className="text-muted" />
            </span>
            <input
              type="search"
              className="form-control border-0 shadow-none"
              style={{ width: 220 }}
              placeholder="Filter vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm d-flex align-items-center gap-1"
            onClick={openCreate}
          >
            <Plus size={16} /> Add Vendor
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 border-0 shadow-sm mb-3">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success py-2 border-0 shadow-sm mb-3 text-center">
          {success}
        </div>
      )}

      {/* Main Table Card */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light border-bottom">
              <tr className="text-uppercase small text-muted fw-bold">
                <th className="py-3 ps-4">Company Details</th>
                <th className="py-3">Contact Person</th>
                <th className="py-3">Contact Info</th>
                <th className="py-3">Accounting</th>
                <th className="py-3">Status</th>
                <th className="py-3 pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border text-primary spinner-border-sm me-2" />
                    <span className="text-muted small">
                      Loading Database...
                    </span>
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <UserX size={48} className="text-muted opacity-25 mb-2" />
                    <p className="text-muted">
                      No suppliers registered in system.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((s) => (
                  <tr key={s._id}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{s.name}</div>
                      <div className="small text-muted d-flex align-items-center gap-1">
                        <MapPin size={12} /> {s.address || "No Address"}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 30, height: 30 }}
                        >
                          <User size={14} />
                        </div>
                        <span className="small fw-medium">
                          {s.contactPerson || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="small d-flex align-items-center gap-1 text-dark mb-1">
                        <Phone size={12} className="text-muted" />{" "}
                        {s.phone || "--"}
                      </div>
                      <div className="small d-flex align-items-center gap-1 text-muted">
                        <Mail size={12} /> {s.email || "--"}
                      </div>
                    </td>
                    <td>
                      <div className="badge bg-light text-dark border small fw-normal">
                        <FileText size={10} className="me-1" />{" "}
                        {s.gstOrPan || "No ID"}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill px-3 py-1 ${
                          s.isActive
                            ? "bg-success-subtle text-success border border-success-subtle"
                            : "bg-secondary-subtle text-secondary"
                        }`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button
                        className="btn btn-sm btn-outline-primary border-0 rounded-circle me-1 p-2"
                        onClick={() => openEdit(s)}
                      >
                        <Edit3 size={16} />
                      </button>
                      {s.isActive && (
                        <button
                          className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2"
                          onClick={() => handleDeactivate(s._id)}
                        >
                          <UserX size={16} />
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

      {/* Modal Form */}
      {showForm && (
        <div className="modal show d-block animate-fade-in" tabIndex="-1">
          <div
            className="modal-backdrop fade show"
            onClick={() => !saving && setShowForm(false)}
          ></div>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editingId
                    ? "Update Supplier File"
                    : "New Supplier Onboarding"}
                </h5>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        className="form-control"
                        value={formData.contactPerson}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        GST / PAN ID
                      </label>
                      <input
                        type="text"
                        name="gstOrPan"
                        className="form-control"
                        value={formData.gstOrPan}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">
                        Office Address
                      </label>
                      <textarea
                        name="address"
                        className="form-control"
                        rows="2"
                        value={formData.address}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isActiveSwitch"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label small fw-bold"
                          htmlFor="isActiveSwitch"
                        >
                          Authorize as Active Vendor
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setShowForm(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 shadow-sm"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : editingId ? (
                      "Update Info"
                    ) : (
                      "Register Supplier"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AdminSuppliers;
