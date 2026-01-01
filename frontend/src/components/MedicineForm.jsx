// import React, { useState } from "react";

// const MedicineForm = ({ addMedicine }) => {
//   const [form, setForm] = useState({
//     name: "",
//     category: "",
//     quantity: "",
//     batch: "",
//     expiry: "",
//     manufacturer: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newMed = { ...form, id: Date.now() };
//     addMedicine(newMed);
//     setForm({
//       name: "",
//       category: "",
//       quantity: "",
//       batch: "",
//       expiry: "",
//       manufacturer: "",
//     });
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       style={{
//         marginTop: "1rem",
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//         gap: "10px",
//       }}
//     >
//       <input
//         name="name"
//         placeholder="Medicine Name"
//         value={form.name}
//         onChange={handleChange}
//         required
//       />
//       <input
//         name="category"
//         placeholder="Category"
//         value={form.category}
//         onChange={handleChange}
//       />
//       <input
//         type="number"
//         name="quantity"
//         placeholder="Quantity"
//         value={form.quantity}
//         onChange={handleChange}
//         required
//       />
//       <input
//         name="batch"
//         placeholder="Batch Number"
//         value={form.batch}
//         onChange={handleChange}
//       />
//       <input
//         type="date"
//         name="expiry"
//         value={form.expiry}
//         onChange={handleChange}
//         required
//       />
//       <input
//         name="manufacturer"
//         placeholder="Manufacturer"
//         value={form.manufacturer}
//         onChange={handleChange}
//       />
//       <button style={{ gridColumn: "span 2" }}>Add Medicine</button>
//     </form>
//   );
// };

// export default MedicineForm;

//

// import React, { useState } from "react";

// const MedicineForm = ({ addMedicine }) => {
//   const [form, setForm] = useState({
//     name: "",
//     category: "",
//     quantity: "",
//     batchNumber: "",
//     expiryDate: "",
//     manufacturer: "",
//     price: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const quantity = Math.max(Number(form.quantity) || 0, 0);

//     const payload = {
//       name: form.name.trim(),
//       category: form.category.trim(),
//       manufacturer: form.manufacturer.trim(),
//       price: Number(form.price) || 0,
//       quantity,
//       batches: [
//         {
//           batchNumber: form.batchNumber.trim() || "BATCH-1",
//           expiryDate: form.expiryDate, // backend parses to Date
//           qty: quantity,
//         },
//       ],
//     };

//     addMedicine(payload);

//     setForm({
//       name: "",
//       category: "",
//       quantity: "",
//       batchNumber: "",
//       expiryDate: "",
//       manufacturer: "",
//       price: "",
//     });
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       style={{
//         marginTop: "1rem",
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//         gap: "10px",
//       }}
//     >
//       <input
//         name="name"
//         placeholder="Medicine Name"
//         value={form.name}
//         onChange={handleChange}
//         required
//       />
//       <input
//         name="category"
//         placeholder="Category"
//         value={form.category}
//         onChange={handleChange}
//       />
//       <input
//         name="manufacturer"
//         placeholder="Manufacturer"
//         value={form.manufacturer}
//         onChange={handleChange}
//       />
//       <input
//         type="number"
//         name="price"
//         placeholder="Price"
//         value={form.price}
//         onChange={handleChange}
//         required
//         min="0"
//       />
//       <input
//         type="number"
//         name="quantity"
//         placeholder="Quantity"
//         value={form.quantity}
//         onChange={handleChange}
//         required
//         min="0"
//       />
//       <input
//         name="batchNumber"
//         placeholder="Batch Number"
//         value={form.batchNumber}
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="date"
//         name="expiryDate"
//         value={form.expiryDate}
//         onChange={handleChange}
//         required
//       />
//       <button style={{ gridColumn: "span 2" }}>Add Medicine</button>
//     </form>
//   );
// };

// export default MedicineForm;

import React, { useState } from "react";

const MedicineForm = ({ addMedicine }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    batchNumber: "",
    expiryDate: "",
    manufacturer: "",
    price: "",
    // New Fields for Unit Conversion logic
    baseUnit: "Tablet",
    units: [],
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // --- Handlers for Dynamic Packaging Units (Strip/Box) ---
  const handleAddUnit = () => {
    setForm({
      ...form,
      units: [...form.units, { name: "", multiplier: "", price: "" }],
    });
  };

  const handleUnitChange = (index, field, value) => {
    const newUnits = [...form.units];
    newUnits[index][field] = value;
    setForm({ ...form, units: newUnits });
  };

  const handleRemoveUnit = (index) => {
    const newUnits = [...form.units];
    newUnits.splice(index, 1);
    setForm({ ...form, units: newUnits });
  };
  // --------------------------------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();

    const quantity = Math.max(Number(form.quantity) || 0, 0);

    // Clean up units array (convert strings to numbers for backend)
    const formattedUnits = form.units
      .map((u) => ({
        name: u.name.trim(),
        multiplier: Number(u.multiplier) || 1,
        price: Number(u.price) || 0,
      }))
      .filter((u) => u.name && u.multiplier > 0);

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      manufacturer: form.manufacturer.trim(),
      price: Number(form.price) || 0,
      quantity,

      // Pass the new unit fields to the backend
      baseUnit: form.baseUnit.trim() || "Tablet",
      units: formattedUnits,

      batches: [
        {
          batchNumber: form.batchNumber.trim() || "BATCH-1",
          expiryDate: form.expiryDate, // backend parses to Date
          qty: quantity,
        },
      ],
    };

    addMedicine(payload);

    setForm({
      name: "",
      category: "",
      quantity: "",
      batchNumber: "",
      expiryDate: "",
      manufacturer: "",
      price: "",
      baseUnit: "Tablet",
      units: [],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        background: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid #ddd",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "10px",
        }}
      >
        <input
          name="name"
          placeholder="Medicine Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: "8px" }}
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          style={{ padding: "8px" }}
        />
        <input
          name="manufacturer"
          placeholder="Manufacturer"
          value={form.manufacturer}
          onChange={handleChange}
          style={{ padding: "8px" }}
        />
        <input
          type="number"
          name="price"
          placeholder={`Price per ${form.baseUnit}`}
          value={form.price}
          onChange={handleChange}
          required
          min="0"
          style={{ padding: "8px" }}
        />
        <input
          type="number"
          name="quantity"
          placeholder={`Total Quantity (${form.baseUnit}s)`}
          value={form.quantity}
          onChange={handleChange}
          required
          min="0"
          style={{ padding: "8px" }}
        />
        <input
          name="batchNumber"
          placeholder="Batch Number"
          value={form.batchNumber}
          onChange={handleChange}
          required
          style={{ padding: "8px" }}
        />
        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          required
          style={{ padding: "8px" }}
        />

        {/* New Field: Base Unit Name */}
        <input
          name="baseUnit"
          placeholder="Base Unit (e.g. Tablet)"
          value={form.baseUnit}
          onChange={handleChange}
          required
          style={{ padding: "8px", border: "1px solid #0d6efd" }}
        />
      </div>

      {/* --- Dynamic Packaging Units Section --- */}
      <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
        <h5 style={{ margin: "0 0 10px 0" }}>Packaging Units (Optional)</h5>
        {form.units.map((unit, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr auto",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <input
              placeholder="Unit Name (e.g. Strip)"
              value={unit.name}
              onChange={(e) => handleUnitChange(index, "name", e.target.value)}
              style={{ padding: "8px" }}
            />
            <input
              placeholder={`Multiplier (e.g. 10)`}
              type="number"
              value={unit.multiplier}
              onChange={(e) =>
                handleUnitChange(index, "multiplier", e.target.value)
              }
              style={{ padding: "8px" }}
            />
            <input
              placeholder="Price"
              type="number"
              value={unit.price}
              onChange={(e) => handleUnitChange(index, "price", e.target.value)}
              style={{ padding: "8px" }}
            />
            <button
              type="button"
              onClick={() => handleRemoveUnit(index)}
              style={{
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                padding: "0 15px",
              }}
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddUnit}
          style={{
            background: "#6c757d",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9em",
          }}
        >
          + Add Packaging Unit (e.g. Strip/Box)
        </button>
      </div>

      <button
        style={{
          padding: "10px",
          background: "#0d6efd",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Add Medicine
      </button>
    </form>
  );
};

export default MedicineForm;
