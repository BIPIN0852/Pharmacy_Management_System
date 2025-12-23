import React, { useEffect, useState } from "react";
import api from "../services/api";

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

  // Create PO form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    supplier: "",
    notes: "",
    items: [],
  });

  const resetForm = () => {
    setFormData({
      supplier: "",
      notes: "",
      items: [],
    });
  };

  // Load all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const [purchasesRes, suppliersRes, medicinesRes] = await Promise.all([
        api.get("/admin/purchases", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/admin/suppliers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/admin/medicines", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPurchases(purchasesRes.data || []);
      setSuppliers(suppliersRes.data || []);
      setMedicines(medicinesRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load purchase data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add item to PO
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
    setError("");
    setSuccess("");

    if (!formData.supplier) {
      setError("Please select a supplier.");
      return;
    }
    if (formData.items.length === 0) {
      setError("Please add at least one item.");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      await api.post("/admin/purchases", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Purchase order created successfully.");
      setShowCreateForm(false);
      resetForm();
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create purchase order."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReceivePO = async (id) => {
    if (
      !window.confirm(
        "Mark this purchase order as received? Stock will be updated."
      )
    ) {
      return;
    }

    try {
      setUpdatingId(id);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      const res = await api.put(
        `/admin/purchases/${id}/status`,
        { status: "Received" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setPurchases((prev) =>
        prev.map((p) => (p._id === id ? res.data.purchase : p))
      );
      setSuccess("Purchase order marked as received. Stock updated.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update purchase order."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredPurchases = purchases.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const supplierName = (p.supplier?.name || "").toLowerCase();
    const status = (p.status || "").toLowerCase();
    return (
      supplierName.includes(q) ||
      status.includes(q) ||
      String(p._id || "").includes(q)
    );
  });

  const totalCost = formData.items.reduce(
    (sum, item) => sum + Number(item.costPrice) * Number(item.quantity),
    0
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3 className="fw-bold mb-0">Purchase Orders</h3>
        <div className="d-flex gap-2">
          <input
            type="search"
            className="form-control form-control-sm"
            style={{ maxWidth: 260 }}
            placeholder="Search purchases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn-success btn-sm"
            onClick={() => setShowCreateForm(true)}
            disabled={saving}
          >
            + New Purchase Order
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
          <span>Loading purchases...</span>
        </div>
      ) : filteredPurchases.length === 0 ? (
        <p className="text-muted">No purchase orders found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Supplier</th>
                <th>Total Cost</th>
                <th>Status</th>
                <th>Ordered</th>
                <th>Received</th>
                <th style={{ width: 150 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((p) => (
                <tr key={p._id}>
                  <td className="small">{p._id?.substring(0, 8)}...</td>
                  <td>{p.supplier?.name || "-"}</td>
                  <td>Rs. {Number(p.totalCost || 0).toLocaleString()}</td>
                  <td>
                    <span
                      className={
                        "badge " +
                        (p.status === "Received"
                          ? "bg-success"
                          : p.status === "Ordered"
                          ? "bg-info text-dark"
                          : p.status === "Pending"
                          ? "bg-warning text-dark"
                          : "bg-secondary")
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="small">
                    {p.orderedAt
                      ? new Date(p.orderedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="small">
                    {p.receivedAt
                      ? new Date(p.receivedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {p.status !== "Received" && p.status !== "Cancelled" && (
                      <button
                        className="btn btn-sm btn-success me-1"
                        onClick={() => handleReceivePO(p._id)}
                        disabled={updatingId === p._id}
                      >
                        {updatingId === p._id
                          ? "Receiving..."
                          : "Mark Received"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Purchase Order Modal */}
      {showCreateForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <div
            className="bg-white rounded shadow p-4"
            style={{
              maxWidth: 700,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">New Purchase Order</h5>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                disabled={saving}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPO}>
              <div className="mb-3">
                <label className="form-label">Supplier *</label>
                <select
                  name="supplier"
                  className="form-select"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      supplier: e.target.value,
                    }))
                  }
                  required
                  disabled={saving}
                >
                  <option value="">Select supplier...</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} {s.isActive ? "" : " (inactive)"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Items *</label>
                {formData.items.length === 0 ? (
                  <p className="text-muted small mb-0">No items added</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Medicine ID</th>
                          <th>Qty</th>
                          <th>Cost/Unit</th>
                          <th>Batch</th>
                          <th>Expiry</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map((item, index) => {
                          const itemTotal =
                            Number(item.costPrice || 0) *
                            Number(item.quantity || 0);
                          return (
                            <tr key={index}>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="Medicine ID"
                                  value={item.medicine}
                                  onChange={(e) =>
                                    updateItem(
                                      index,
                                      "medicine",
                                      e.target.value
                                    )
                                  }
                                  disabled={saving}
                                  list={`medicines-list-${index}`}
                                  style={{ minWidth: 120 }}
                                />
                                <datalist id={`medicines-list-${index}`}>
                                  {medicines.map((m) => (
                                    <option key={m._id} value={m._id}>
                                      {m.name}
                                    </option>
                                  ))}
                                </datalist>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateItem(
                                      index,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  min="1"
                                  disabled={saving}
                                  style={{ width: 70 }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="form-control form-control-sm"
                                  value={item.costPrice}
                                  onChange={(e) =>
                                    updateItem(
                                      index,
                                      "costPrice",
                                      e.target.value
                                    )
                                  }
                                  disabled={saving}
                                  style={{ width: 90 }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={item.batchNumber}
                                  onChange={(e) =>
                                    updateItem(
                                      index,
                                      "batchNumber",
                                      e.target.value
                                    )
                                  }
                                  disabled={saving}
                                  style={{ width: 90 }}
                                />
                              </td>
                              <td>
                                <input
                                  type="date"
                                  className="form-control form-control-sm"
                                  value={item.expiryDate}
                                  onChange={(e) =>
                                    updateItem(
                                      index,
                                      "expiryDate",
                                      e.target.value
                                    )
                                  }
                                  disabled={saving}
                                  style={{ width: 110 }}
                                />
                              </td>
                              <td className="fw-bold text-success">
                                Rs. {itemTotal.toFixed(2)}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeItem(index)}
                                  disabled={saving}
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm mt-2"
                  onClick={addItem}
                  disabled={saving}
                >
                  + Add Item
                </button>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Notes</label>
                  <textarea
                    name="notes"
                    className="form-control form-control-sm"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    disabled={saving}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Total Cost</label>
                  <div className="h5 text-success mb-0 mt-3">
                    Rs. {totalCost.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={saving || formData.items.length === 0}
                >
                  {saving ? "Creating..." : "Create PO"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPurchases;
