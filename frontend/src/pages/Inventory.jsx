import React, { useEffect, useState } from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import { Package, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import MedicineForm from "../components/MedicineForm";
import MedicineTable from "../components/MedicineTable";
import api from "../services/api";

const Inventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load existing medicines from backend
  const loadMedicines = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/medicines");
      setMedicines(res.data || []);
    } catch (err) {
      console.error("Load Inventory Error:", err);
      setError(err.response?.data?.message || "Failed to load medicines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  // Add New Medicine
  const addMedicine = async (newMedValues) => {
    try {
      setError("");
      setSuccess("");

      const res = await api.post("/medicines", newMedValues);

      setMedicines((prev) => [res.data, ...prev]);
      setSuccess("Medicine added successfully.");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Add Medicine Error:", err);
      setError(err.response?.data?.message || "Failed to add medicine.");
    }
  };

  // Delete Medicine
  const deleteMedicine = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(`/medicines/${id}`);

      setMedicines((prev) => prev.filter((m) => m._id !== id));
      setSuccess("Medicine removed successfully.");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete Medicine Error:", err);
      setError(err.response?.data?.message || "Failed to delete medicine.");
    }
  };

  // Update Medicine
  const updateMedicine = async (updatedMed) => {
    try {
      setError("");
      setSuccess("");

      // Remove _id from body if it exists to avoid immutable field error
      const { _id, ...dataToUpdate } = updatedMed;

      const res = await api.put(`/medicines/${_id}`, dataToUpdate);

      setMedicines((prev) => prev.map((m) => (m._id === _id ? res.data : m)));
      setSuccess("Medicine updated successfully.");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Update Medicine Error:", err);
      setError(err.response?.data?.message || "Failed to update medicine.");
    }
  };

  return (
    <div
      className="container-fluid p-3 p-md-4 animate-fade-in"
      style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
    >
      {/* Header Area */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary-subtle">
        <div>
          <h2
            className="fw-bold mb-1 d-flex align-items-center gap-2"
            style={{ color: "#0F1111", fontSize: "1.5rem" }}
          >
            <Package style={{ color: "#007185" }} size={24} /> Inventory
            Management
          </h2>
          <p className="small mb-0" style={{ color: "#565959" }}>
            Manage stock, add new medicines, and update details.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div
          className="alert border-0 shadow-sm mb-4 rounded-1 d-flex align-items-center justify-content-between gap-2"
          style={{
            backgroundColor: "#fef0f0",
            color: "#B12704",
            borderLeft: "4px solid #B12704",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <AlertCircle size={18} /> <span className="small">{error}</span>
          </div>
          <button
            type="button"
            className="btn-close shadow-none"
            style={{ fontSize: "0.8rem" }}
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {success && (
        <div
          className="alert border-0 shadow-sm mb-4 rounded-1 d-flex align-items-center justify-content-between gap-2"
          style={{
            backgroundColor: "#f2fcf5",
            color: "#067D62",
            borderLeft: "4px solid #067D62",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <CheckCircle size={18} /> <span className="small">{success}</span>
          </div>
          <button
            type="button"
            className="btn-close shadow-none"
            style={{ fontSize: "0.8rem" }}
            onClick={() => setSuccess("")}
          ></button>
        </div>
      )}

      {/* Add Medicine Form Section */}
      <div className="mb-4">
        {/* We assume MedicineForm handles its own interior card styling now */}
        <MedicineForm addMedicine={addMedicine} />
      </div>

      {/* Medicines Table Section */}
      <div
        className="card shadow-sm border bg-white rounded-1"
        style={{ borderColor: "#D5D9D9" }}
      >
        <div className="card-header bg-white border-bottom py-3 px-4">
          <span
            className="small fw-bold text-muted text-uppercase"
            style={{ letterSpacing: "0.5px" }}
          >
            Current Inventory Directory
          </span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <Loader2
                className="spin-animation mb-3"
                style={{ color: "#007185" }}
                size={40}
              />
              <span className="text-secondary fw-medium small">
                Loading Inventory Data...
              </span>
            </div>
          ) : (
            <div className="table-responsive">
              <MedicineTable
                medicines={medicines}
                deleteMedicine={deleteMedicine}
                updateMedicine={updateMedicine}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Inventory;
