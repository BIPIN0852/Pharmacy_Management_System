import React, { useEffect, useState } from "react";
import api from "../services/api";

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
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/suppliers", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setSuppliers(res.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load suppliers from server."
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
      const token = localStorage.getItem("token");
      const payload = { ...formData };

      if (editingId) {
        await api.put(`/admin/suppliers/${editingId}`, payload, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        setSuccess("Supplier updated successfully.");
      } else {
        await api.post("/admin/suppliers", payload, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        setSuccess("Supplier created successfully.");
      }

      setShowForm(false);
      resetForm();
      fetchSuppliers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save supplier. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (
      !window.confirm(
        "Deactivate this supplier? They will no longer be active."
      )
    ) {
      return;
    }
    try {
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      await api.delete(`/admin/suppliers/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setSuccess("Supplier deactivated.");
      setSuppliers((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: false } : s))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to deactivate supplier.");
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
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3 className="fw-bold mb-0">Suppliers</h3>
        <div className="d-flex gap-2">
          <input
            type="search"
            className="form-control form-control-sm"
            style={{ maxWidth: 260 }}
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-success btn-sm" onClick={openCreate}>
            + Add Supplier
          </button>
        </div>
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
          <span>Loading suppliers...</span>
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <p className="text-muted">No suppliers found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Active</th>
                <th style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.contactPerson || "-"}</td>
                  <td>{s.phone || "-"}</td>
                  <td>{s.email || "-"}</td>
                  <td>
                    {s.isActive ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Inactive</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEdit(s)}
                    >
                      Edit
                    </button>
                    {s.isActive && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeactivate(s._id)}
                      >
                        Deactivate
                      </button>
                    )}
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
            style={{ maxWidth: 520, width: "100%" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                {editingId ? "Edit Supplier" : "Add Supplier"}
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
              <div className="mb-2">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-sm"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  className="form-control form-control-sm"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
              <div className="row">
                <div className="mb-2 col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control form-control-sm"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
                <div className="mb-2 col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-sm"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  className="form-control form-control-sm"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
              <div className="row">
                <div className="mb-2 col-md-6">
                  <label className="form-label">GST/PAN</label>
                  <input
                    type="text"
                    name="gstOrPan"
                    className="form-control form-control-sm"
                    value={formData.gstOrPan}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
                <div className="mb-2 col-md-6 d-flex align-items-end">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      disabled={saving}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      Active supplier
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  className="form-control form-control-sm"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
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
                  className="btn btn-primary btn-sm"
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

export default AdminSuppliers;
