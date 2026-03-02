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
//     // New Fields for Unit Conversion logic
//     baseUnit: "Tablet",
//     units: [],
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   // --- Handlers for Dynamic Packaging Units (Strip/Box) ---
//   const handleAddUnit = () => {
//     setForm({
//       ...form,
//       units: [...form.units, { name: "", multiplier: "", price: "" }],
//     });
//   };

//   const handleUnitChange = (index, field, value) => {
//     const newUnits = [...form.units];
//     newUnits[index][field] = value;
//     setForm({ ...form, units: newUnits });
//   };

//   const handleRemoveUnit = (index) => {
//     const newUnits = [...form.units];
//     newUnits.splice(index, 1);
//     setForm({ ...form, units: newUnits });
//   };
//   // --------------------------------------------------------

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const quantity = Math.max(Number(form.quantity) || 0, 0);

//     // Clean up units array (convert strings to numbers for backend)
//     const formattedUnits = form.units
//       .map((u) => ({
//         name: u.name.trim(),
//         multiplier: Number(u.multiplier) || 1,
//         price: Number(u.price) || 0,
//       }))
//       .filter((u) => u.name && u.multiplier > 0);

//     const payload = {
//       name: form.name.trim(),
//       category: form.category.trim(),
//       manufacturer: form.manufacturer.trim(),
//       price: Number(form.price) || 0,
//       quantity,

//       // Pass the new unit fields to the backend
//       baseUnit: form.baseUnit.trim() || "Tablet",
//       units: formattedUnits,

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
//       baseUnit: "Tablet",
//       units: [],
//     });
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       style={{
//         marginTop: "1rem",
//         display: "flex",
//         flexDirection: "column",
//         gap: "15px",
//         background: "#f9f9f9",
//         padding: "20px",
//         borderRadius: "8px",
//         border: "1px solid #ddd",
//       }}
//     >
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//           gap: "10px",
//         }}
//       >
//         <input
//           name="name"
//           placeholder="Medicine Name"
//           value={form.name}
//           onChange={handleChange}
//           required
//           style={{ padding: "8px" }}
//         />
//         <input
//           name="category"
//           placeholder="Category"
//           value={form.category}
//           onChange={handleChange}
//           style={{ padding: "8px" }}
//         />
//         <input
//           name="manufacturer"
//           placeholder="Manufacturer"
//           value={form.manufacturer}
//           onChange={handleChange}
//           style={{ padding: "8px" }}
//         />
//         <input
//           type="number"
//           name="price"
//           placeholder={`Price per ${form.baseUnit}`}
//           value={form.price}
//           onChange={handleChange}
//           required
//           min="0"
//           style={{ padding: "8px" }}
//         />
//         <input
//           type="number"
//           name="quantity"
//           placeholder={`Total Quantity (${form.baseUnit}s)`}
//           value={form.quantity}
//           onChange={handleChange}
//           required
//           min="0"
//           style={{ padding: "8px" }}
//         />
//         <input
//           name="batchNumber"
//           placeholder="Batch Number"
//           value={form.batchNumber}
//           onChange={handleChange}
//           required
//           style={{ padding: "8px" }}
//         />
//         <input
//           type="date"
//           name="expiryDate"
//           value={form.expiryDate}
//           onChange={handleChange}
//           required
//           style={{ padding: "8px" }}
//         />

//         {/* New Field: Base Unit Name */}
//         <input
//           name="baseUnit"
//           placeholder="Base Unit (e.g. Tablet)"
//           value={form.baseUnit}
//           onChange={handleChange}
//           required
//           style={{ padding: "8px", border: "1px solid #0d6efd" }}
//         />
//       </div>

//       {/* --- Dynamic Packaging Units Section --- */}
//       <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
//         <h5 style={{ margin: "0 0 10px 0" }}>Packaging Units (Optional)</h5>
//         {form.units.map((unit, index) => (
//           <div
//             key={index}
//             style={{
//               display: "grid",
//               gridTemplateColumns: "2fr 1fr 1fr auto",
//               gap: "10px",
//               marginBottom: "10px",
//             }}
//           >
//             <input
//               placeholder="Unit Name (e.g. Strip)"
//               value={unit.name}
//               onChange={(e) => handleUnitChange(index, "name", e.target.value)}
//               style={{ padding: "8px" }}
//             />
//             <input
//               placeholder={`Multiplier (e.g. 10)`}
//               type="number"
//               value={unit.multiplier}
//               onChange={(e) =>
//                 handleUnitChange(index, "multiplier", e.target.value)
//               }
//               style={{ padding: "8px" }}
//             />
//             <input
//               placeholder="Price"
//               type="number"
//               value={unit.price}
//               onChange={(e) => handleUnitChange(index, "price", e.target.value)}
//               style={{ padding: "8px" }}
//             />
//             <button
//               type="button"
//               onClick={() => handleRemoveUnit(index)}
//               style={{
//                 background: "#dc3545",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//                 padding: "0 15px",
//               }}
//             >
//               X
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={handleAddUnit}
//           style={{
//             background: "#6c757d",
//             color: "white",
//             border: "none",
//             padding: "8px 15px",
//             borderRadius: "4px",
//             cursor: "pointer",
//             fontSize: "0.9em",
//           }}
//         >
//           + Add Packaging Unit (e.g. Strip/Box)
//         </button>
//       </div>

//       <button
//         style={{
//           padding: "10px",
//           background: "#0d6efd",
//           color: "white",
//           border: "none",
//           borderRadius: "4px",
//           cursor: "pointer",
//           fontWeight: "bold",
//         }}
//       >
//         Add Medicine
//       </button>
//     </form>
//   );
// };

// export default MedicineForm;

// import React, { useState } from "react";

// const MedicineForm = ({ addMedicine }) => {
//   const [form, setForm] = useState({
//     name: "",
//     category: "",
//     countInStock: "", // Updated from quantity
//     batchNumber: "",
//     expiryDate: "",
//     brand: "", // Updated from manufacturer
//     price: "",
//     prescriptionRequired: false, // Updated from requiresPrescription
//     // Unit Conversion logic
//     baseUnit: "Tablet",
//     units: [],
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//   };

//   // --- Handlers for Dynamic Packaging Units (Strip/Box) ---
//   const handleAddUnit = () => {
//     setForm({
//       ...form,
//       units: [...form.units, { name: "", multiplier: "", price: "" }],
//     });
//   };

//   const handleUnitChange = (index, field, value) => {
//     const newUnits = [...form.units];
//     newUnits[index][field] = value;
//     setForm({ ...form, units: newUnits });
//   };

//   const handleRemoveUnit = (index) => {
//     const newUnits = [...form.units];
//     newUnits.splice(index, 1);
//     setForm({ ...form, units: newUnits });
//   };
//   // --------------------------------------------------------

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const quantity = Math.max(Number(form.countInStock) || 0, 0);

//     // Clean up units array (convert strings to numbers for backend)
//     const formattedUnits = form.units
//       .map((u) => ({
//         name: u.name.trim(),
//         multiplier: Number(u.multiplier) || 1,
//         price: Number(u.price) || 0,
//       }))
//       .filter((u) => u.name && u.multiplier > 0);

//     const payload = {
//       name: form.name.trim(),
//       category: form.category.trim(),
//       brand: form.brand.trim(), // Updated
//       price: Number(form.price) || 0,
//       countInStock: quantity, // Updated
//       prescriptionRequired: form.prescriptionRequired, // Updated

//       // Pass the unit fields to the backend
//       baseUnit: form.baseUnit.trim() || "Tablet",
//       units: formattedUnits,

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
//       countInStock: "",
//       batchNumber: "",
//       expiryDate: "",
//       brand: "",
//       price: "",
//       prescriptionRequired: false,
//       baseUnit: "Tablet",
//       units: [],
//     });
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       style={{
//         marginTop: "1rem",
//         display: "flex",
//         flexDirection: "column",
//         gap: "15px",
//         background: "#f9f9f9",
//         padding: "20px",
//         borderRadius: "8px",
//         border: "1px solid #ddd",
//       }}
//     >
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//           gap: "10px",
//         }}
//       >
//         <input
//           name="name"
//           placeholder="Medicine Name"
//           value={form.name}
//           onChange={handleChange}
//           required
//           style={{ padding: "8px" }}
//         />
//         <input
//           name="category"
//           placeholder="Category"
//           value={form.category}
//           onChange={handleChange}
//           style={{ padding: "8px" }}
//         />
//         <input
//           name="brand"
//           placeholder="Brand / Manufacturer"
//           value={form.brand}
//           onChange={handleChange}
//           style={{ padding: "8px" }}
//         />
//         <input
//           type="number"
//           name="price"
//           placeholder={`Price per ${form.baseUnit}`}
//           value={form.price}
//           onChange={handleChange}
//           required
//           min="0"
//           style={{ padding: "8px" }}
//         />
//         <input
//           type="number"
//           name="countInStock"
//           placeholder={`Total Stock (${form.baseUnit}s)`}
//           value={form.countInStock}
//           onChange={handleChange}
//           required
//           min="0"
//           style={{ padding: "8px" }}
//         />
//         <input
//           name="batchNumber"
//           placeholder="Batch Number"
//           value={form.batchNumber}
//           onChange={handleChange}
//           required
//           style={{ padding: "8px" }}
//         />
//         <input
//           type="date"
//           name="expiryDate"
//           value={form.expiryDate}
//           onChange={handleChange}
//           required
//           style={{ padding: "8px" }}
//         />

//         {/* Base Unit Name */}
//         <input
//           name="baseUnit"
//           placeholder="Base Unit (e.g. Tablet)"
//           value={form.baseUnit}
//           onChange={handleChange}
//           required
//           style={{ padding: "8px", border: "1px solid #0d6efd" }}
//         />
//       </div>

//       {/* Prescription Toggle */}
//       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//         <input
//           type="checkbox"
//           name="prescriptionRequired"
//           checked={form.prescriptionRequired}
//           onChange={handleChange}
//           id="rxReq"
//         />
//         <label htmlFor="rxReq" style={{ fontWeight: "bold", color: "#dc3545" }}>
//           Prescription Required
//         </label>
//       </div>

//       {/* --- Dynamic Packaging Units Section --- */}
//       <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
//         <h5 style={{ margin: "0 0 10px 0" }}>Packaging Units (Optional)</h5>
//         {form.units.map((unit, index) => (
//           <div
//             key={index}
//             style={{
//               display: "grid",
//               gridTemplateColumns: "2fr 1fr 1fr auto",
//               gap: "10px",
//               marginBottom: "10px",
//             }}
//           >
//             <input
//               placeholder="Unit Name (e.g. Strip)"
//               value={unit.name}
//               onChange={(e) => handleUnitChange(index, "name", e.target.value)}
//               style={{ padding: "8px" }}
//             />
//             <input
//               placeholder={`Multiplier (e.g. 10)`}
//               type="number"
//               value={unit.multiplier}
//               onChange={(e) =>
//                 handleUnitChange(index, "multiplier", e.target.value)
//               }
//               style={{ padding: "8px" }}
//             />
//             <input
//               placeholder="Price"
//               type="number"
//               value={unit.price}
//               onChange={(e) => handleUnitChange(index, "price", e.target.value)}
//               style={{ padding: "8px" }}
//             />
//             <button
//               type="button"
//               onClick={() => handleRemoveUnit(index)}
//               style={{
//                 background: "#dc3545",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//                 padding: "0 15px",
//               }}
//             >
//               X
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={handleAddUnit}
//           style={{
//             background: "#6c757d",
//             color: "white",
//             border: "none",
//             padding: "8px 15px",
//             borderRadius: "4px",
//             cursor: "pointer",
//             fontSize: "0.9em",
//           }}
//         >
//           + Add Packaging Unit (e.g. Strip/Box)
//         </button>
//       </div>

//       <button
//         style={{
//           padding: "10px",
//           background: "#0d6efd",
//           color: "white",
//           border: "none",
//           borderRadius: "4px",
//           cursor: "pointer",
//           fontWeight: "bold",
//         }}
//       >
//         Add Medicine
//       </button>
//     </form>
//   );
// };

// export default MedicineForm;

// import React, { useState } from "react";
// import { PlusCircle, Trash2, Save, Info } from "lucide-react";

// const MedicineForm = ({ addMedicine }) => {
//   const [form, setForm] = useState({
//     name: "",
//     category: "",
//     countInStock: "",
//     batchNumber: "",
//     expiryDate: "",
//     brand: "",
//     price: "",
//     prescriptionRequired: false,
//     baseUnit: "Tablet",
//     units: [],
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//   };

//   const handleAddUnit = () => {
//     setForm({
//       ...form,
//       units: [...form.units, { name: "", multiplier: "", price: "" }],
//     });
//   };

//   const handleUnitChange = (index, field, value) => {
//     const newUnits = [...form.units];
//     newUnits[index][field] = value;
//     setForm({ ...form, units: newUnits });
//   };

//   const handleRemoveUnit = (index) => {
//     const newUnits = form.units.filter((_, i) => i !== index);
//     setForm({ ...form, units: newUnits });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const quantity = Math.max(Number(form.countInStock) || 0, 0);

//     const formattedUnits = form.units
//       .map((u) => ({
//         name: u.name.trim(),
//         multiplier: Number(u.multiplier) || 1,
//         price: Number(u.price) || 0,
//       }))
//       .filter((u) => u.name && u.multiplier > 0);

//     const payload = {
//       name: form.name.trim(),
//       category: form.category.trim(),
//       brand: form.brand.trim(),
//       price: Number(form.price) || 0,
//       countInStock: quantity,
//       prescriptionRequired: form.prescriptionRequired,
//       baseUnit: form.baseUnit.trim() || "Tablet",
//       units: formattedUnits,
//       batches: [
//         {
//           batchNumber: form.batchNumber.trim() || "BATCH-1",
//           expiryDate: form.expiryDate,
//           qty: quantity,
//         },
//       ],
//     };

//     addMedicine(payload);

//     setForm({
//       name: "",
//       category: "",
//       countInStock: "",
//       batchNumber: "",
//       expiryDate: "",
//       brand: "",
//       price: "",
//       prescriptionRequired: false,
//       baseUnit: "Tablet",
//       units: [],
//     });
//   };

//   return (
//     <div className="card shadow-sm border-0 rounded-3 bg-white p-4 mt-3">
//       <h5 className="mb-4 fw-bold text-primary">
//         <PlusCircle size={20} className="me-2" />
//         Add New Medicine to Inventory
//       </h5>

//       <form onSubmit={handleSubmit}>
//         {/* Basic Information Section */}
//         <div className="row g-3">
//           <div className="col-md-6">
//             <label className="form-label small fw-bold text-muted">
//               Medicine Name
//             </label>
//             <input
//               name="name"
//               className="form-control"
//               placeholder="e.g. Paracetamol"
//               value={form.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="col-md-3">
//             <label className="form-label small fw-bold text-muted">
//               Category
//             </label>
//             <input
//               name="category"
//               className="form-control"
//               placeholder="e.g. Analgesic"
//               value={form.category}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="col-md-3">
//             <label className="form-label small fw-bold text-muted">
//               Brand/Manufacturer
//             </label>
//             <input
//               name="brand"
//               className="form-control"
//               placeholder="e.g. Pfizer"
//               value={form.brand}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="col-md-3">
//             <label className="form-label small fw-bold text-muted">
//               Base Unit
//             </label>
//             <input
//               name="baseUnit"
//               className="form-control border-primary bg-light-subtle"
//               placeholder="e.g. Tablet"
//               value={form.baseUnit}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="col-md-3">
//             <label className="form-label small fw-bold text-muted">
//               Price (Per {form.baseUnit})
//             </label>
//             <div className="input-group">
//               <span className="input-group-text">Rs.</span>
//               <input
//                 type="number"
//                 name="price"
//                 className="form-control"
//                 value={form.price}
//                 onChange={handleChange}
//                 required
//                 min="0"
//               />
//             </div>
//           </div>
//           <div className="col-md-3">
//             <label className="form-label small fw-bold text-muted">
//               Total Stock ({form.baseUnit}s)
//             </label>
//             <input
//               type="number"
//               name="countInStock"
//               className="form-control"
//               value={form.countInStock}
//               onChange={handleChange}
//               required
//               min="0"
//             />
//           </div>
//           <div className="col-md-3">
//             <label className="form-label small fw-bold text-muted">
//               Batch Number
//             </label>
//             <input
//               name="batchNumber"
//               className="form-control"
//               placeholder="B-102"
//               value={form.batchNumber}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="col-md-3">
//             <label className="form-label small fw-bold text-muted">
//               Expiry Date
//             </label>
//             <input
//               type="date"
//               name="expiryDate"
//               className="form-control"
//               value={form.expiryDate}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         {/* Prescription Checkbox */}
//         <div className="form-check form-switch my-4 border p-3 rounded bg-light bg-opacity-50">
//           <input
//             className="form-check-input ms-0 me-2"
//             type="checkbox"
//             name="prescriptionRequired"
//             checked={form.prescriptionRequired}
//             onChange={handleChange}
//             id="rxReq"
//           />
//           <label
//             className="form-check-label fw-bold text-danger"
//             htmlFor="rxReq"
//           >
//             <Info size={16} className="me-1 mb-1" />
//             Prescription Required for Sale
//           </label>
//         </div>

//         {/* Dynamic Packaging Units Section */}
//         <div className="border rounded p-3 mb-4 bg-light bg-opacity-25">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h6 className="fw-bold text-dark mb-0">
//               Packaging Units (Optional)
//             </h6>
//             <button
//               type="button"
//               className="btn btn-sm btn-outline-secondary"
//               onClick={handleAddUnit}
//             >
//               <PlusCircle size={14} className="me-1" /> Add Unit (Strip/Box)
//             </button>
//           </div>

//           {form.units.length === 0 ? (
//             <p className="text-muted small italic">
//               No alternative units added. Selling only by {form.baseUnit}.
//             </p>
//           ) : (
//             form.units.map((unit, index) => (
//               <div key={index} className="row g-2 mb-2 align-items-end">
//                 <div className="col-md-4">
//                   <input
//                     placeholder="Unit Name (e.g. Strip)"
//                     className="form-control form-control-sm"
//                     value={unit.name}
//                     onChange={(e) =>
//                       handleUnitChange(index, "name", e.target.value)
//                     }
//                   />
//                 </div>
//                 <div className="col-md-3">
//                   <input
//                     placeholder={`Qty per unit (e.g. 10)`}
//                     type="number"
//                     className="form-control form-control-sm"
//                     value={unit.multiplier}
//                     onChange={(e) =>
//                       handleUnitChange(index, "multiplier", e.target.value)
//                     }
//                   />
//                 </div>
//                 <div className="col-md-3">
//                   <div className="input-group input-group-sm">
//                     <span className="input-group-text">Rs.</span>
//                     <input
//                       placeholder="Price"
//                       type="number"
//                       className="form-control"
//                       value={unit.price}
//                       onChange={(e) =>
//                         handleUnitChange(index, "price", e.target.value)
//                       }
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-2">
//                   <button
//                     type="button"
//                     className="btn btn-sm btn-danger w-100"
//                     onClick={() => handleRemoveUnit(index)}
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         <button
//           type="submit"
//           className="btn btn-primary w-100 fw-bold py-2 shadow-sm"
//         >
//           <Save size={18} className="me-2" />
//           Save Medicine to Inventory
//         </button>
//       </form>
//     </div>
//   );
// };

// export default MedicineForm;

import React, { useState } from "react";
import { PlusCircle, Trash2, Save, Info } from "lucide-react";

const MedicineForm = ({ addMedicine }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    countInStock: "",
    batchNumber: "",
    expiryDate: "",
    brand: "",
    price: "",
    prescriptionRequired: false,
    baseUnit: "Tablet",
    units: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

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
    const newUnits = form.units.filter((_, i) => i !== index);
    setForm({ ...form, units: newUnits });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const quantity = Math.max(Number(form.countInStock) || 0, 0);

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
      brand: form.brand.trim(),
      price: Number(form.price) || 0,
      countInStock: quantity,
      prescriptionRequired: form.prescriptionRequired,
      baseUnit: form.baseUnit.trim() || "Tablet",
      units: formattedUnits,
      batches: [
        {
          batchNumber: form.batchNumber.trim() || "BATCH-1",
          expiryDate: form.expiryDate,
          qty: quantity,
        },
      ],
    };

    addMedicine(payload);

    setForm({
      name: "",
      category: "",
      countInStock: "",
      batchNumber: "",
      expiryDate: "",
      brand: "",
      price: "",
      prescriptionRequired: false,
      baseUnit: "Tablet",
      units: [],
    });
  };

  return (
    <div
      className="card shadow-sm border bg-white rounded-1 p-4 mt-3"
      style={{ borderColor: "#D5D9D9" }}
    >
      <h5
        className="mb-4 fw-bold d-flex align-items-center"
        style={{ color: "#0F1111", fontSize: "1.15rem" }}
      >
        <PlusCircle size={20} className="me-2" style={{ color: "#007185" }} />
        Add New Medicine to Inventory
      </h5>

      <form onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <div className="row g-3">
          <div className="col-md-6">
            <label
              className="form-label small fw-bold mb-1"
              style={{ color: "#0F1111" }}
            >
              Medicine Name
            </label>
            <input
              name="name"
              className="form-control amazon-input shadow-none"
              placeholder="e.g. Paracetamol"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label
              className="form-label small fw-bold mb-1"
              style={{ color: "#0F1111" }}
            >
              Category
            </label>
            <input
              name="category"
              className="form-control amazon-input shadow-none"
              placeholder="e.g. Analgesic"
              value={form.category}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label
              className="form-label small fw-bold mb-1"
              style={{ color: "#0F1111" }}
            >
              Brand/Manufacturer
            </label>
            <input
              name="brand"
              className="form-control amazon-input shadow-none"
              placeholder="e.g. Pfizer"
              value={form.brand}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <label
              className="form-label small fw-bold mb-1"
              style={{ color: "#0F1111" }}
            >
              Base Unit
            </label>
            <input
              name="baseUnit"
              className="form-control amazon-input shadow-none bg-light"
              placeholder="e.g. Tablet"
              value={form.baseUnit}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label
              className="form-label small fw-bold mb-1"
              style={{ color: "#0F1111" }}
            >
              Price (Per {form.baseUnit})
            </label>
            <div className="input-group amazon-input-group">
              <span
                className="input-group-text bg-light border-secondary-subtle small fw-medium"
                style={{ color: "#565959" }}
              >
                NPR
              </span>
              <input
                type="number"
                name="price"
                className="form-control shadow-none"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                style={{ border: "1px solid #888C8C", borderLeft: "none" }}
              />
            </div>
          </div>
          <div className="col-md-3">
            <label
              className="form-label small fw-bold mb-1"
              style={{ color: "#0F1111" }}
            >
              Total Stock ({form.baseUnit}s)
            </label>
            <input
              type="number"
              name="countInStock"
              className="form-control amazon-input shadow-none"
              value={form.countInStock}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="col-md-3">
            <label
              className="form-label small fw-bold mb-1"
              style={{ color: "#0F1111" }}
            >
              Batch Number
            </label>
            <input
              name="batchNumber"
              className="form-control amazon-input shadow-none"
              placeholder="B-102"
              value={form.batchNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label
              className="form-label small fw-bold mb-1"
              style={{ color: "#0F1111" }}
            >
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              className="form-control amazon-input shadow-none"
              value={form.expiryDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Prescription Checkbox */}
        <div
          className="form-check form-switch my-4 border p-3 rounded-1 d-flex align-items-center"
          style={{
            backgroundColor: "#fef0f0",
            borderColor: "#f5c6cb !important",
          }}
        >
          <input
            className="form-check-input ms-0 me-3 shadow-none mt-0"
            type="checkbox"
            name="prescriptionRequired"
            checked={form.prescriptionRequired}
            onChange={handleChange}
            id="rxReq"
            style={{ width: "2rem", height: "1rem", cursor: "pointer" }}
          />
          <label
            className="form-check-label fw-bold mb-0"
            htmlFor="rxReq"
            style={{ color: "#B12704", cursor: "pointer", fontSize: "0.9rem" }}
          >
            <Info size={16} className="me-2 mb-1" />
            Prescription Required for Sale
          </label>
        </div>

        {/* Dynamic Packaging Units Section */}
        <div
          className="border rounded-1 p-3 mb-4"
          style={{ backgroundColor: "#FAFAFA", borderColor: "#D5D9D9" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0 fs-6" style={{ color: "#0F1111" }}>
              Packaging Units (Optional)
            </h6>
            <button
              type="button"
              className="btn btn-sm bg-white border fw-medium shadow-sm d-flex align-items-center"
              onClick={handleAddUnit}
              style={{ borderColor: "#D5D9D9", color: "#0F1111" }}
            >
              <PlusCircle
                size={14}
                className="me-2"
                style={{ color: "#007185" }}
              />{" "}
              Add Unit (Strip/Box)
            </button>
          </div>

          {form.units.length === 0 ? (
            <p className="text-muted small italic mb-0">
              No alternative units added. Selling only by {form.baseUnit}.
            </p>
          ) : (
            form.units.map((unit, index) => (
              <div
                key={index}
                className="row g-2 mb-2 align-items-end p-2 bg-white border rounded-1 shadow-sm"
                style={{ borderColor: "#D5D9D9" }}
              >
                <div className="col-md-4">
                  <label
                    className="form-label small fw-bold mb-1"
                    style={{ color: "#565959" }}
                  >
                    Unit Name
                  </label>
                  <input
                    placeholder="e.g. Strip"
                    className="form-control form-control-sm amazon-input shadow-none"
                    value={unit.name}
                    onChange={(e) =>
                      handleUnitChange(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label
                    className="form-label small fw-bold mb-1"
                    style={{ color: "#565959" }}
                  >
                    Qty per Unit
                  </label>
                  <input
                    placeholder="e.g. 10"
                    type="number"
                    className="form-control form-control-sm amazon-input shadow-none"
                    value={unit.multiplier}
                    onChange={(e) =>
                      handleUnitChange(index, "multiplier", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label
                    className="form-label small fw-bold mb-1"
                    style={{ color: "#565959" }}
                  >
                    Price
                  </label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light border-secondary-subtle">
                      NPR
                    </span>
                    <input
                      placeholder="0.00"
                      type="number"
                      className="form-control shadow-none"
                      value={unit.price}
                      onChange={(e) =>
                        handleUnitChange(index, "price", e.target.value)
                      }
                      style={{
                        border: "1px solid #888C8C",
                        borderLeft: "none",
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-white border w-100 hover-danger"
                    onClick={() => handleRemoveUnit(index)}
                    style={{ borderColor: "#D5D9D9", color: "#565959" }}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          type="submit"
          className="btn w-100 fw-medium py-2 shadow-sm border-0 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "#FFD814",
            color: "#0F1111",
            borderRadius: "8px",
          }}
        >
          <Save size={18} className="me-2" />
          Save Medicine to Inventory
        </button>
      </form>

      <style>{`
        .amazon-input { border: 1px solid #888C8C; border-radius: 3px; font-size: 0.9rem; }
        .amazon-input:focus, .amazon-input-group input:focus { 
          border-color: #e47911 !important; 
          box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; 
          outline: none;
        }
        .hover-danger:hover {
          color: #B12704 !important;
          border-color: #B12704 !important;
          background-color: #fef0f0;
        }
      `}</style>
    </div>
  );
};

export default MedicineForm;
