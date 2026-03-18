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
  Trash2,
  Package,
  XCircle,
} from "lucide-react";

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [tempItem, setTempItem] = useState({
    medicineId: "",
    quantity: 1,
  });

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    gstOrPan: "",
    paymentTerms: "Cash",
    notes: "",
    isActive: true,
    suppliedMedicines: [],
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
      paymentTerms: "Cash",
      notes: "",
      isActive: true,
      suppliedMedicines: [],
    });
    setTempItem({ medicineId: "", quantity: 1 });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resSuppliers, resMedicines] = await Promise.all([
        api.get("/admin/suppliers"),
        api.get("/medicines"),
      ]);

      setSuppliers(
        Array.isArray(resSuppliers.data) ? resSuppliers.data : resSuppliers,
      );
      setMedicines(
        Array.isArray(resMedicines.data?.medicines)
          ? resMedicines.data.medicines
          : resMedicines.data || [],
      );
    } catch (err) {
      console.error("Data Load Error:", err);
      setError("Failed to load data from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      paymentTerms: supplier.paymentTerms || "Cash",
      notes: supplier.notes || "",
      isActive: supplier.isActive !== false,
      suppliedMedicines: (supplier.suppliedMedicines || [])
        .map((item) => ({
          medicine: item.medicine?._id || item.medicine,
          quantity: item.quantity || 1,
        }))
        .filter((item) => item.medicine),
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

  // --- Item Management ---

  const handleAddItem = () => {
    if (!tempItem.medicineId) return alert("Please select a medicine");
    if (tempItem.quantity < 1) return alert("Quantity must be at least 1");

    const exists = formData.suppliedMedicines.find(
      (i) => i.medicine === tempItem.medicineId,
    );
    if (exists)
      return alert(
        "Item already added. Please remove it first to update quantity.",
      );

    setFormData((prev) => ({
      ...prev,
      suppliedMedicines: [
        ...prev.suppliedMedicines,
        {
          medicine: tempItem.medicineId,
          quantity: parseInt(tempItem.quantity) || 1,
        },
      ],
    }));

    setTempItem({ medicineId: "", quantity: 1 });
  };

  const handleRemoveItem = (index) => {
    const updated = [...formData.suppliedMedicines];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, suppliedMedicines: updated }));
  };

  const getMedicineName = (id) => {
    const med = medicines.find((m) => m._id === id);
    return med ? `${med.name} (${med.manufacturer})` : "Unknown / Deleted Item";
  };

  // --- Submit ---

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
        await api.put(`/admin/suppliers/${editingId}`, payload);
        setSuccess("Supplier record updated.");
      } else {
        await api.post("/admin/suppliers", payload);
        setSuccess("New supplier registered.");
      }

      setShowForm(false);
      resetForm();
      fetchData();
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
      await api.delete(`/admin/suppliers/${id}`);
      setSuccess("Supplier status updated.");
      fetchData();
    } catch (err) {
      setError("Server error.");
    }
  };

  const filteredSuppliers = suppliers.filter((s) => {
    const q = search.trim().toLowerCase();
    return (
      (s.name || "").toLowerCase().includes(q) ||
      (s.contactPerson || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="container-fluid p-0 animate-fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
            Supplier Management
          </h3>
          <p className="text-muted small mb-0">
            Manage wholesale vendors and supplies
          </p>
        </div>
        <div className="d-flex gap-2">
          {/* Search Input */}
          <div className="input-group input-group-sm shadow-sm border rounded-pill overflow-hidden bg-white">
            <span className="input-group-text bg-white border-0 ps-3">
              <Search size={16} className="text-muted" />
            </span>
            <input
              type="search"
              className="form-control border-0 shadow-none"
              style={{ width: 220 }}
              placeholder="Filter suppliers..."
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

      {success && (
        <div className="alert alert-success text-center py-2 mb-3">
          {success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger text-center py-2 mb-3">{error}</div>
      )}

      {/* Main Table */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Company</th>
                <th>Contact</th>
                <th>Supply History</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    Loading...
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No suppliers found.
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((s) => (
                  <tr key={s._id}>
                    <td className="ps-4">
                      <div className="fw-bold">{s.name}</div>
                      <div className="small text-muted">
                        {s.address || "No Address"}
                      </div>
                    </td>
                    <td>
                      <div className="small fw-bold">
                        {s.contactPerson || "N/A"}
                      </div>
                      <div className="small text-muted">{s.phone}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {s.suppliedMedicines?.length || 0} Items
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill ${s.isActive ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"}`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-light me-2"
                        onClick={() => openEdit(s)}
                      >
                        <Edit3 size={16} />
                      </button>
                      {s.isActive && (
                        <button
                          className="btn btn-sm btn-light text-danger"
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
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editingId ? "Edit Supplier" : "New Supplier"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div
                  className="modal-body p-4"
                  style={{ maxHeight: "70vh", overflowY: "auto" }}
                >
                  <div className="row g-3">
                    {/* Basic Details */}
                    <div className="col-md-6">
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
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    {/* ✅ Added Address Field */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">
                        Address
                      </label>
                      <textarea
                        name="address"
                        className="form-control"
                        rows="2"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Full street address..."
                      ></textarea>
                    </div>

                    {/* Supply Items Section */}
                    <div className="col-12 mt-4">
                      <div className="card bg-light border-0 p-3">
                        <h6 className="fw-bold d-flex align-items-center mb-3">
                          <Package size={18} className="me-2" /> Supply Items
                          Log
                        </h6>

                        {/* Add Item Row */}
                        <div className="d-flex gap-2 align-items-end mb-3">
                          <div className="flex-grow-1">
                            <label className="small text-muted">
                              Select Item
                            </label>
                            <select
                              className="form-select form-select-sm"
                              value={tempItem.medicineId}
                              onChange={(e) =>
                                setTempItem({
                                  ...tempItem,
                                  medicineId: e.target.value,
                                })
                              }
                            >
                              <option value="">-- Choose Medicine --</option>
                              {medicines.map((m) => (
                                <option key={m._id} value={m._id}>
                                  {m.name} ({m.manufacturer})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div style={{ width: "100px" }}>
                            <label className="small text-muted">Qty</label>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              min="1"
                              value={tempItem.quantity}
                              onChange={(e) =>
                                setTempItem({
                                  ...tempItem,
                                  quantity: e.target.value,
                                })
                              }
                            />
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={handleAddItem}
                          >
                            <Plus size={16} /> Add
                          </button>
                        </div>

                        {/* List of Added Items */}
                        {formData.suppliedMedicines.length > 0 ? (
                          <div className="table-responsive bg-white rounded border">
                            <table className="table table-sm mb-0 align-middle">
                              <thead className="table-light">
                                <tr>
                                  <th className="ps-3">Item Name</th>
                                  <th>Qty</th>
                                  <th className="text-end pe-3">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {formData.suppliedMedicines.map((item, idx) => (
                                  <tr key={idx}>
                                    <td className="ps-3 small">
                                      {getMedicineName(item.medicine)}
                                    </td>
                                    <td className="small">{item.quantity}</td>
                                    <td className="text-end pe-3">
                                      <button
                                        type="button"
                                        className="btn btn-link text-danger p-0"
                                        onClick={() => handleRemoveItem(idx)}
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center text-muted small py-2 border rounded bg-white border-dashed">
                            No items added to supply list.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-12 mt-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleChange}
                        />
                        <label className="form-check-label small fw-bold">
                          Active Vendor
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Supplier"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <style>{` .animate-fade-in { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } `}</style>
    </div>
  );
};

export default AdminSuppliers;
