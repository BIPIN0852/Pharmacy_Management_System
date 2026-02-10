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
  MapPin,
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

  // ✅ FIX: Auto-initialize with one empty item so the form is ready to use
  const resetForm = () => {
    setFormData({
      supplier: "",
      notes: "",
      items: [{ medicine: "", quantity: 1, costPrice: 0, batchNumber: "" }],
    });
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
        Array.isArray(purchasesRes.data) ? purchasesRes.data : purchasesRes,
      );
      setSuppliers(
        Array.isArray(suppliersRes.data) ? suppliersRes.data : suppliersRes,
      );
      setMedicines(
        Array.isArray(medicinesRes.data?.medicines)
          ? medicinesRes.data.medicines
          : medicinesRes.data || [],
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    resetForm();
    setShowCreateForm(true);
  };

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
    // Filter out invalid rows (no medicine selected)
    const validItems = formData.items.filter(
      (i) => i.medicine && i.quantity > 0,
    );

    if (!formData.supplier || validItems.length === 0) {
      setError("Please select a supplier and add at least one valid item.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/admin/purchases", { ...formData, items: validItems });
      setSuccess("Order logged successfully.");
      setShowCreateForm(false);
      resetForm();
      fetchData();
    } catch (err) {
      setError("Failed to save order.");
    } finally {
      setSaving(false);
    }
  };

  const handleReceivePO = async (id) => {
    if (!window.confirm("Confirm Receipt? This will update stock levels."))
      return;
    try {
      setUpdatingId(id);
      await api.put(`/admin/purchases/${id}/status`, { status: "Received" });
      setSuccess("Stock updated successfully.");
      fetchData();
    } catch (err) {
      setError("Update failed.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredPurchases = Array.isArray(purchases)
    ? purchases.filter((p) => {
        const q = search.trim().toLowerCase();
        return (
          (p.supplier?.name || "").toLowerCase().includes(q) ||
          (p._id || "").includes(q)
        );
      })
    : [];

  const totalCost = formData.items.reduce(
    (sum, item) =>
      sum + Number(item.costPrice || 0) * Number(item.quantity || 0),
    0,
  );

  const selectedSupplier = suppliers.find((s) => s._id === formData.supplier);

  return (
    <div className="container-fluid p-0 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Truck className="text-primary" /> Purchase History
          </h3>
          <p className="text-muted small mb-0">
            Record and track inventory arrivals
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm"
          onClick={openCreate}
        >
          <Plus size={16} className="me-1" /> Log New Arrival
        </button>
      </div>

      {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
      {success && (
        <div className="alert alert-success py-2 mb-3 text-center">
          {success}
        </div>
      )}

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Reference</th>
                <th>Supplier</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Received Date</th>
                <th className="text-end pe-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    Loading...
                  </td>
                </tr>
              ) : filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((p) => (
                  <tr key={p._id}>
                    <td className="ps-4 fw-bold text-primary small">
                      #{p._id.substring(p._id.length - 6).toUpperCase()}
                    </td>
                    <td>{p.supplier?.name || "Unknown"}</td>
                    <td className="fw-bold">
                      Rs. {Number(p.totalCost).toLocaleString()}
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill ${p.status === "Received" ? "bg-success" : "bg-warning"}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="small text-muted">
                      {p.receivedAt
                        ? new Date(p.receivedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="text-end pe-4">
                      {p.status !== "Received" && (
                        <button
                          className="btn btn-sm btn-success rounded-pill px-3"
                          onClick={() => handleReceivePO(p._id)}
                          disabled={updatingId === p._id}
                        >
                          {updatingId === p._id ? "..." : "Receive"}
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

      {/* Modal */}
      {showCreateForm && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Log Arrival</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateForm(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmitPO}>
                <div
                  className="modal-body p-4"
                  style={{ maxHeight: "70vh", overflowY: "auto" }}
                >
                  {/* Supplier Select */}
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">
                      Supplier
                    </label>
                    <select
                      className="form-select"
                      value={formData.supplier}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Supplier...</option>
                      {suppliers.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {selectedSupplier && (
                      <div className="mt-2 small text-muted d-flex align-items-center">
                        <MapPin size={14} className="me-1" />
                        {selectedSupplier.address || "No address"}
                      </div>
                    )}
                  </div>

                  {/* Items Table */}
                  <div className="border rounded bg-light mb-3">
                    <table className="table table-sm mb-0">
                      <thead className="small text-muted">
                        <tr>
                          <th className="ps-3">Item</th>
                          <th style={{ width: 80 }}>Qty</th>
                          <th style={{ width: 100 }}>Cost</th>
                          <th className="text-end pe-3">x</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="ps-3">
                              <select
                                className="form-select form-select-sm border-0"
                                value={item.medicine}
                                onChange={(e) =>
                                  updateItem(idx, "medicine", e.target.value)
                                }
                              >
                                <option value="">Select Medicine</option>
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
                                  updateItem(idx, "quantity", e.target.value)
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
                                  updateItem(idx, "costPrice", e.target.value)
                                }
                              />
                            </td>
                            <td className="text-end pe-3">
                              <button
                                type="button"
                                className="btn btn-link text-danger p-0"
                                onClick={() => removeItem(idx)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="p-2 text-center border-top">
                      <button
                        type="button"
                        className="btn btn-sm btn-light w-100"
                        onClick={addItem}
                      >
                        + Add Another Item
                      </button>
                    </div>
                  </div>

                  <div className="text-end">
                    <span className="small text-muted fw-bold">Total: </span>
                    <span className="h5 fw-bold text-success">
                      Rs. {totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Authorize Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPurchases;
