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

import React, { useEffect, useState } from "react";
import MedicineForm from "../components/MedicineForm";
import MedicineTable from "../components/MedicineTable";
import { getMedicines, createMedicine } from "../pages/Pharmacyapi";

const Inventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load existing medicines from backend
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setLoading(true);
        setMessage("");
        const data = await getMedicines();
        setMedicines(data || []);
      } catch (err) {
        setMessage(
          err.response?.data?.message ||
            err.message ||
            "Failed to load medicines."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, []);

  const addMedicine = async (newMedValues) => {
    try {
      setMessage("");
      const created = await createMedicine(newMedValues);
      setMedicines((prev) => [created, ...prev]);
      setMessage("Medicine added successfully.");
    } catch (err) {
      setMessage(
        err.response?.data?.message || err.message || "Failed to add medicine."
      );
    }
  };

  const deleteMedicine = async (id) => {
    try {
      setMessage("");
      // optional: call DELETE /medicines/:id if you create that route
      // await deleteMedicineApi(id);
      setMedicines((prev) => prev.filter((m) => m._id !== id));
      setMessage("Medicine removed.");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete medicine."
      );
    }
  };

  const updateMedicine = async (updatedMed) => {
    try {
      setMessage("");
      // optional: call PUT /medicines/:id if you create that route
      // const saved = await updateMedicineApi(updatedMed._id, updatedMed);
      const saved = updatedMed; // for now just update locally
      setMedicines((prev) =>
        prev.map((m) => (m._id === saved._id ? saved : m))
      );
      setMessage("Medicine updated.");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Failed to update medicine."
      );
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>💊 Inventory Management</h2>

      {message && (
        <p style={{ marginTop: "0.5rem", color: "#dc2626" }}>{message}</p>
      )}

      <MedicineForm addMedicine={addMedicine} />

      {loading ? (
        <p style={{ marginTop: "1rem" }}>Loading medicines...</p>
      ) : (
        <MedicineTable
          medicines={medicines}
          deleteMedicine={deleteMedicine}
          updateMedicine={updateMedicine}
        />
      )}
    </div>
  );
};

export default Inventory;
