// import React, { useEffect, useState } from "react";
// import MedicineForm from "../components/MedicineForm";
// import MedicineTable from "../components/MedicineTable";

// const Inventory = () => {
//   const [medicines, setMedicines] = useState([]);

//   // Load existing medicines from backend (simulate or connect API)
//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("medicines")) || [];
//     setMedicines(stored);
//   }, []);

//   const saveToStorage = (data) => {
//     localStorage.setItem("medicines", JSON.stringify(data));
//   };

//   const addMedicine = (newMed) => {
//     const updated = [...medicines, newMed];
//     setMedicines(updated);
//     saveToStorage(updated);
//   };

//   const deleteMedicine = (id) => {
//     const updated = medicines.filter((m) => m.id !== id);
//     setMedicines(updated);
//     saveToStorage(updated);
//   };

//   const updateMedicine = (updatedMed) => {
//     const updated = medicines.map((m) =>
//       m.id === updatedMed.id ? updatedMed : m
//     );
//     setMedicines(updated);
//     saveToStorage(updated);
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>💊 Inventory Management</h2>
//       <MedicineForm addMedicine={addMedicine} />
//       <MedicineTable
//         medicines={medicines}
//         deleteMedicine={deleteMedicine}
//         updateMedicine={updateMedicine}
//       />
//     </div>
//   );
// };

// export default Inventory;

// import React, { useEffect, useState } from "react";
// import MedicineForm from "../components/MedicineForm";
// import MedicineTable from "../components/MedicineTable";
// import { getMedicines, createMedicine } from "../pages/Pharmacyapi";

// const Inventory = () => {
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");

//   // Load existing medicines from backend
//   useEffect(() => {
//     const loadMedicines = async () => {
//       try {
//         setLoading(true);
//         setMessage("");
//         const data = await getMedicines();
//         setMedicines(data || []);
//       } catch (err) {
//         setMessage(
//           err.response?.data?.message ||
//             err.message ||
//             "Failed to load medicines."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadMedicines();
//   }, []);

//   const addMedicine = async (newMedValues) => {
//     try {
//       setMessage("");
//       const created = await createMedicine(newMedValues);
//       setMedicines((prev) => [created, ...prev]);
//       setMessage("Medicine added successfully.");
//     } catch (err) {
//       setMessage(
//         err.response?.data?.message || err.message || "Failed to add medicine."
//       );
//     }
//   };

//   const deleteMedicine = async (id) => {
//     try {
//       setMessage("");
//       // optional: call DELETE /medicines/:id if you create that route
//       // await deleteMedicineApi(id);
//       setMedicines((prev) => prev.filter((m) => m._id !== id));
//       setMessage("Medicine removed.");
//     } catch (err) {
//       setMessage(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to delete medicine."
//       );
//     }
//   };

//   const updateMedicine = async (updatedMed) => {
//     try {
//       setMessage("");
//       // optional: call PUT /medicines/:id if you create that route
//       // const saved = await updateMedicineApi(updatedMed._id, updatedMed);
//       const saved = updatedMed; // for now just update locally
//       setMedicines((prev) =>
//         prev.map((m) => (m._id === saved._id ? saved : m))
//       );
//       setMessage("Medicine updated.");
//     } catch (err) {
//       setMessage(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to update medicine."
//       );
//     }
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>💊 Inventory Management</h2>

//       {message && (
//         <p style={{ marginTop: "0.5rem", color: "#dc2626" }}>{message}</p>
//       )}

//       <MedicineForm addMedicine={addMedicine} />

//       {loading ? (
//         <p style={{ marginTop: "1rem" }}>Loading medicines...</p>
//       ) : (
//         <MedicineTable
//           medicines={medicines}
//           deleteMedicine={deleteMedicine}
//           updateMedicine={updateMedicine}
//         />
//       )}
//     </div>
//   );
// };

// export default Inventory;

import React, { useEffect, useState } from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import { Package } from "lucide-react";
import MedicineForm from "../components/MedicineForm";
import MedicineTable from "../components/MedicineTable";
import api from "../services/api"; // ✅ Uses interceptor for token

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
    <Container className="py-5 fade-in">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
          <Package size={28} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Inventory Management</h2>
          <p className="text-muted mb-0 small">
            Manage stock, add new medicines, and update details.
          </p>
        </div>
      </div>

      {/* Notifications */}
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

      {/* Add Medicine Form Section */}
      <div className="card shadow-sm border-0 mb-5 rounded-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Add New Medicine</h5>
          <MedicineForm addMedicine={addMedicine} />
        </div>
      </div>

      {/* Medicines Table Section */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-0">
          {loading ? (
            <div className="d-flex align-items-center justify-content-center py-5">
              <Spinner animation="border" variant="primary" className="me-2" />
              <span>Loading medicines...</span>
            </div>
          ) : (
            <MedicineTable
              medicines={medicines}
              deleteMedicine={deleteMedicine}
              updateMedicine={updateMedicine}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default Inventory;
