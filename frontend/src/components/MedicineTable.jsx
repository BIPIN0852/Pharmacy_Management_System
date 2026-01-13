// import React, { useEffect } from "react";

// const MedicineTable = ({ medicines, deleteMedicine, updateMedicine }) => {
//   // Check for low stock or expiring soon
//   useEffect(() => {
//     const today = new Date();
//     const soon = new Date();
//     soon.setDate(today.getDate() + 30); // 30 days alert window

//     medicines.forEach((m) => {
//       const exp = new Date(m.expiry);
//       if (parseInt(m.quantity) < 10) {
//         alert(`⚠️ Low stock: ${m.name} (only ${m.quantity} left)`);
//       }
//       if (exp <= soon) {
//         alert(`⚠️ ${m.name} expiring soon on ${m.expiry}`);
//       }
//     });
//   }, [medicines]);

//   return (
//     <table
//       border="1"
//       cellPadding="8"
//       style={{
//         width: "100%",
//         marginTop: "1.5rem",
//         borderCollapse: "collapse",
//         textAlign: "center",
//       }}
//     >
//       <thead style={{ background: "#e0f7fa" }}>
//         <tr>
//           <th>Name</th>
//           <th>Category</th>
//           <th>Batch</th>
//           <th>Quantity</th>
//           <th>Expiry</th>
//           <th>Manufacturer</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {medicines.length === 0 ? (
//           <tr>
//             <td colSpan="7">No medicines added yet.</td>
//           </tr>
//         ) : (
//           medicines.map((m) => (
//             <tr
//               key={m.id}
//               style={{
//                 background:
//                   new Date(m.expiry) < new Date() ? "#ffebee" : "white",
//               }}
//             >
//               <td>{m.name}</td>
//               <td>{m.category}</td>
//               <td>{m.batch}</td>
//               <td>{m.quantity}</td>
//               <td>{m.expiry}</td>
//               <td>{m.manufacturer}</td>
//               <td>
//                 <button
//                   onClick={() => {
//                     const newQty = prompt("Enter new quantity:", m.quantity);
//                     if (newQty) updateMedicine({ ...m, quantity: newQty });
//                   }}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   style={{ marginLeft: "5px", color: "red" }}
//                   onClick={() => deleteMedicine(m.id)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))
//         )}
//       </tbody>
//     </table>
//   );
// };

// export default MedicineTable;

// import React, { useEffect } from "react";

// const MedicineTable = ({ medicines, deleteMedicine, updateMedicine }) => {
//   useEffect(() => {
//     const today = new Date();
//     const soon = new Date();
//     soon.setDate(today.getDate() + 30);

//     medicines.forEach((m) => {
//       if (Number(m.quantity) < 10) {
//         // optional: replace alert with toast/snackbar in real UI
//         console.warn(`Low stock: ${m.name} (only ${m.quantity} left)`);
//       }

//       const firstBatch = m.batches && m.batches[0];
//       if (firstBatch?.expiryDate) {
//         const exp = new Date(firstBatch.expiryDate);
//         if (exp <= soon) {
//           console.warn(
//             `Expiring soon: ${m.name} on ${exp.toLocaleDateString()}`
//           );
//         }
//       }
//     });
//   }, [medicines]);

//   return (
//     <table
//       border="1"
//       cellPadding="8"
//       style={{
//         width: "100%",
//         marginTop: "1.5rem",
//         borderCollapse: "collapse",
//         textAlign: "center",
//       }}
//     >
//       <thead style={{ background: "#e0f7fa" }}>
//         <tr>
//           <th>Name</th>
//           <th>Category</th>
//           <th>Batch</th>
//           <th>Quantity</th>
//           <th>Expiry</th>
//           <th>Manufacturer</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {medicines.length === 0 ? (
//           <tr>
//             <td colSpan="7">No medicines added yet.</td>
//           </tr>
//         ) : (
//           medicines.map((m) => {
//             const firstBatch = m.batches && m.batches[0];
//             const expiryDate = firstBatch?.expiryDate
//               ? new Date(firstBatch.expiryDate)
//               : null;

//             return (
//               <tr
//                 key={m._id || m.id}
//                 style={{
//                   background:
//                     expiryDate && expiryDate < new Date() ? "#ffebee" : "white",
//                 }}
//               >
//                 <td>{m.name}</td>
//                 <td>{m.category}</td>
//                 <td>{firstBatch?.batchNumber || "-"}</td>
//                 <td>{m.quantity}</td>
//                 <td>{expiryDate ? expiryDate.toLocaleDateString() : "-"}</td>
//                 <td>{m.manufacturer}</td>
//                 <td>
//                   <button
//                     onClick={() => {
//                       const newQty = prompt("Enter new quantity:", m.quantity);
//                       if (newQty !== null && newQty !== "") {
//                         updateMedicine({
//                           ...m,
//                           quantity: Number(newQty),
//                         });
//                       }
//                     }}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     style={{ marginLeft: "5px", color: "red" }}
//                     onClick={() => deleteMedicine(m._id || m.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             );
//           })
//         )}
//       </tbody>
//     </table>
//   );
// };

// export default MedicineTable;

// import React, { useEffect } from "react";

// const MedicineTable = ({ medicines, deleteMedicine, updateMedicine }) => {
//   useEffect(() => {
//     const today = new Date();
//     const soon = new Date();
//     soon.setDate(today.getDate() + 30);

//     medicines.forEach((m) => {
//       // Logic preserved: Warn if stock is low (now context-aware of base unit)
//       if (Number(m.quantity) < 10) {
//         console.warn(`Low stock: ${m.name} (only ${m.quantity} left)`);
//       }

//       const firstBatch = m.batches && m.batches[0];
//       if (firstBatch?.expiryDate) {
//         const exp = new Date(firstBatch.expiryDate);
//         if (exp <= soon) {
//           console.warn(
//             `Expiring soon: ${m.name} on ${exp.toLocaleDateString()}`
//           );
//         }
//       }
//     });
//   }, [medicines]);

//   return (
//     <table
//       border="1"
//       cellPadding="8"
//       style={{
//         width: "100%",
//         marginTop: "1.5rem",
//         borderCollapse: "collapse",
//         textAlign: "center",
//       }}
//     >
//       <thead style={{ background: "#e0f7fa" }}>
//         <tr>
//           <th>Name</th>
//           <th>Category</th>
//           {/* NEW: Price Column */}
//           <th>Price</th>
//           {/* NEW: Packaging Column */}
//           <th>Packaging</th>
//           <th>Batch</th>
//           <th>Quantity</th>
//           <th>Expiry</th>
//           <th>Manufacturer</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {medicines.length === 0 ? (
//           <tr>
//             <td colSpan="9">No medicines added yet.</td>
//           </tr>
//         ) : (
//           medicines.map((m) => {
//             const firstBatch = m.batches && m.batches[0];
//             const expiryDate = firstBatch?.expiryDate
//               ? new Date(firstBatch.expiryDate)
//               : null;

//             // Logic preserved: Use baseUnit or default to empty string if missing
//             const baseUnit = m.baseUnit || "";

//             return (
//               <tr
//                 key={m._id || m.id}
//                 // Logic preserved: Red background for expired items
//                 style={{
//                   background:
//                     expiryDate && expiryDate < new Date() ? "#ffebee" : "white",
//                 }}
//               >
//                 <td>{m.name}</td>
//                 <td>{m.category}</td>

//                 {/* NEW: Show Price per Base Unit */}
//                 <td>
//                   ₹{m.price}{" "}
//                   {baseUnit && (
//                     <small style={{ color: "#666" }}>/{baseUnit}</small>
//                   )}
//                 </td>

//                 {/* NEW: Show Packaging Units (Strip/Box) */}
//                 <td style={{ textAlign: "left", fontSize: "0.85em" }}>
//                   {m.units && m.units.length > 0 ? (
//                     m.units.map((u, i) => (
//                       <div key={i}>
//                         • <b>{u.name}</b>: {u.multiplier} {baseUnit}s (₹
//                         {u.price})
//                       </div>
//                     ))
//                   ) : (
//                     <span style={{ color: "#999", paddingLeft: "10px" }}>
//                       -
//                     </span>
//                   )}
//                 </td>

//                 <td>{firstBatch?.batchNumber || "-"}</td>

//                 {/* Quantity */}
//                 <td>
//                   {m.quantity} {baseUnit}
//                 </td>

//                 <td>{expiryDate ? expiryDate.toLocaleDateString() : "-"}</td>
//                 <td>{m.manufacturer}</td>

//                 {/* Logic preserved: Edit and Delete buttons */}
//                 <td>
//                   <button
//                     onClick={() => {
//                       // Logic preserved: Prompt for new quantity
//                       const newQty = prompt(
//                         `Enter new quantity${
//                           baseUnit ? ` (in ${baseUnit}s)` : ""
//                         }:`,
//                         m.quantity
//                       );
//                       if (newQty !== null && newQty !== "") {
//                         updateMedicine({
//                           ...m,
//                           quantity: Number(newQty),
//                         });
//                       }
//                     }}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     style={{ marginLeft: "5px", color: "red" }}
//                     onClick={() => deleteMedicine(m._id || m.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             );
//           })
//         )}
//       </tbody>
//     </table>
//   );
// };

// export default MedicineTable;

// import React, { useEffect } from "react";

// const MedicineTable = ({ medicines, deleteMedicine, updateMedicine }) => {
//   useEffect(() => {
//     const today = new Date();
//     const soon = new Date();
//     soon.setDate(today.getDate() + 30);

//     medicines.forEach((m) => {
//       // Logic preserved: Warn if stock is low (using new countInStock field)
//       if ((m.countInStock || 0) < 10) {
//         console.warn(`Low stock: ${m.name} (only ${m.countInStock} left)`);
//       }

//       // Check first batch for expiry
//       const firstBatch = m.batches && m.batches[0];
//       if (firstBatch?.expiryDate) {
//         const exp = new Date(firstBatch.expiryDate);
//         if (exp <= soon) {
//           console.warn(
//             `Expiring soon: ${m.name} on ${exp.toLocaleDateString()}`
//           );
//         }
//       }
//     });
//   }, [medicines]);

//   return (
//     <div className="table-responsive mt-4">
//       <table
//         className="table table-bordered table-hover align-middle"
//         style={{ textAlign: "center" }}
//       >
//         <thead className="table-light">
//           <tr>
//             <th>Name</th>
//             <th>Category</th>
//             <th>Price</th>
//             <th>Packaging</th>
//             <th>Batch</th>
//             <th>Stock</th>
//             <th>Expiry</th>
//             <th>Brand</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {medicines.length === 0 ? (
//             <tr>
//               <td colSpan="9" className="text-muted py-4">
//                 No medicines added yet.
//               </td>
//             </tr>
//           ) : (
//             medicines.map((m) => {
//               const firstBatch = m.batches && m.batches[0];
//               const expiryDate = firstBatch?.expiryDate
//                 ? new Date(firstBatch.expiryDate)
//                 : null;

//               // Use baseUnit or default
//               const baseUnit = m.baseUnit || "Unit";

//               return (
//                 <tr
//                   key={m._id || m.id}
//                   // Highlight expired items in red-ish background
//                   style={{
//                     backgroundColor:
//                       expiryDate && expiryDate < new Date()
//                         ? "#ffebee"
//                         : "inherit",
//                   }}
//                 >
//                   <td className="fw-medium">{m.name}</td>
//                   <td>{m.category}</td>

//                   {/* Price per Base Unit */}
//                   <td>
//                     ₹{m.price} <small className="text-muted">/{baseUnit}</small>
//                   </td>

//                   {/* Packaging Units (Strip/Box) */}
//                   <td className="text-start" style={{ fontSize: "0.85rem" }}>
//                     {m.units && m.units.length > 0 ? (
//                       <ul className="mb-0 ps-3">
//                         {m.units.map((u, i) => (
//                           <li key={i}>
//                             <b>{u.name}</b>: {u.multiplier} {baseUnit}s (₹
//                             {u.price})
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <span className="text-muted ps-2">-</span>
//                     )}
//                   </td>

//                   <td>{firstBatch?.batchNumber || "-"}</td>

//                   {/* Stock Quantity */}
//                   <td
//                     className={
//                       (m.countInStock || 0) < 10
//                         ? "text-danger fw-bold"
//                         : "text-success fw-bold"
//                     }
//                   >
//                     {m.countInStock || 0} {baseUnit}s
//                   </td>

//                   <td>{expiryDate ? expiryDate.toLocaleDateString() : "-"}</td>

//                   {/* Brand / Manufacturer */}
//                   <td>{m.brand || m.manufacturer || "-"}</td>

//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline-primary me-2"
//                       onClick={() => {
//                         const newQty = prompt(
//                           `Enter new stock quantity${
//                             baseUnit ? ` (in ${baseUnit}s)` : ""
//                           }:`,
//                           m.countInStock
//                         );
//                         if (newQty !== null && newQty !== "") {
//                           updateMedicine({
//                             ...m,
//                             countInStock: Number(newQty), // Updated field
//                             quantity: Number(newQty), // Fallback for legacy
//                           });
//                         }
//                       }}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => deleteMedicine(m._id || m.id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default MedicineTable;

import React, { useEffect } from "react";
import {
  AlertTriangle,
  Trash2,
  Edit3,
  Pill,
  CheckCircle,
  XCircle,
} from "lucide-react";

const MedicineTable = ({ medicines, deleteMedicine, updateMedicine }) => {
  useEffect(() => {
    const today = new Date();
    const soon = new Date();
    soon.setDate(today.getDate() + 30);

    medicines.forEach((m) => {
      // Alert logic for Low Stock
      if ((m.countInStock || 0) < 10) {
        console.warn(`⚠️ Low stock: ${m.name} (only ${m.countInStock} left)`);
      }

      // Alert logic for Near Expiry
      const firstBatch = m.batches && m.batches[0];
      if (firstBatch?.expiryDate) {
        const exp = new Date(firstBatch.expiryDate);
        if (exp <= soon) {
          console.warn(
            `⏰ Expiring soon: ${m.name} on ${exp.toLocaleDateString()}`
          );
        }
      }
    });
  }, [medicines]);

  // Helper for Stock Status Color
  const getStockStatus = (count) => {
    if (count <= 0) return { label: "Out of Stock", class: "bg-danger" };
    if (count < 10)
      return { label: "Low Stock", class: "bg-warning text-dark" };
    return { label: "In Stock", class: "bg-success" };
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 bg-white mt-4 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light text-uppercase small fw-bold text-muted">
            <tr>
              <th className="ps-4">Medicine & Brand</th>
              <th>Category</th>
              <th>Pricing</th>
              <th>Packaging</th>
              <th>Batch / Stock</th>
              <th>Expiry</th>
              <th>Rx</th>
              <th className="text-end pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-5 text-muted">
                  <Pill size={40} className="opacity-25 mb-2" />
                  <p>No medicines found in inventory.</p>
                </td>
              </tr>
            ) : (
              medicines.map((m) => {
                const firstBatch = m.batches && m.batches[0];
                const expiryDate = firstBatch?.expiryDate
                  ? new Date(firstBatch.expiryDate)
                  : null;
                const isExpired = expiryDate && expiryDate < new Date();
                const baseUnit = m.baseUnit || "Unit";
                const stockStatus = getStockStatus(m.countInStock || 0);

                return (
                  <tr
                    key={m._id || m.id}
                    className={isExpired ? "table-danger-light" : ""}
                  >
                    {/* Name & Brand */}
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{m.name}</div>
                      <div className="text-muted small">
                        {m.brand || "Generic"}
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="badge bg-light text-secondary border px-2 py-1">
                        {m.category || "General"}
                      </span>
                    </td>

                    {/* Price */}
                    <td>
                      <div className="fw-bold">Rs. {m.price}</div>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        per {baseUnit}
                      </div>
                    </td>

                    {/* Packaging Units */}
                    <td style={{ fontSize: "0.8rem" }}>
                      {m.units && m.units.length > 0 ? (
                        <div className="d-flex flex-column gap-1">
                          {m.units.map((u, i) => (
                            <div
                              key={i}
                              className="text-nowrap border-bottom border-light pb-1"
                            >
                              <span className="fw-bold">{u.name}</span>: Rs.
                              {u.price}
                              <span className="text-muted">
                                {" "}
                                ({u.multiplier} {baseUnit[0]})
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted italic">Standard only</span>
                      )}
                    </td>

                    {/* Batch & Stock */}
                    <td>
                      <div className="small text-muted mb-1">
                        #{firstBatch?.batchNumber || "N/A"}
                      </div>
                      <span
                        className={`badge ${stockStatus.class} rounded-pill`}
                      >
                        {m.countInStock || 0} {baseUnit}s
                      </span>
                    </td>

                    {/* Expiry */}
                    <td>
                      <div
                        className={
                          isExpired ? "text-danger fw-bold" : "text-dark"
                        }
                      >
                        {expiryDate ? expiryDate.toLocaleDateString() : "-"}
                      </div>
                      {isExpired && (
                        <div
                          className="text-danger small"
                          style={{ fontSize: "0.65rem" }}
                        >
                          EXPIRED
                        </div>
                      )}
                    </td>

                    {/* Prescription Required */}
                    <td className="text-center">
                      {m.prescriptionRequired ? (
                        <AlertTriangle
                          size={18}
                          className="text-danger"
                          title="Rx Required"
                        />
                      ) : (
                        <CheckCircle
                          size={18}
                          className="text-success"
                          title="OTC Medicine"
                        />
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-end pe-4">
                      <div className="btn-group shadow-sm border rounded">
                        <button
                          className="btn btn-white btn-sm px-3"
                          title="Quick Update Stock"
                          onClick={() => {
                            const newQty = prompt(
                              `Update stock for ${m.name} (current: ${m.countInStock}):`,
                              m.countInStock
                            );
                            if (newQty !== null && newQty !== "") {
                              updateMedicine({
                                ...m,
                                countInStock: Number(newQty),
                              });
                            }
                          }}
                        >
                          <Edit3 size={16} className="text-primary" />
                        </button>
                        <button
                          className="btn btn-white btn-sm px-3"
                          title="Remove Medicine"
                          onClick={() => {
                            if (
                              window.confirm(`Delete ${m.name} from inventory?`)
                            ) {
                              deleteMedicine(m._id || m.id);
                            }
                          }}
                        >
                          <Trash2 size={16} className="text-danger" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .table-danger-light { background-color: #fff5f5 !important; }
        .btn-white { background: #fff; }
        .btn-white:hover { background: #f8f9fa; }
        .badge.bg-purple { background-color: #6f42c1; }
      `}</style>
    </div>
  );
};

export default MedicineTable;
