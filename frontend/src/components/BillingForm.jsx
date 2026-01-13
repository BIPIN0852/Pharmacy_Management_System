// import React, { useState } from "react";

// const BillingForm = ({ addInvoice }) => {
//   const [customer, setCustomer] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Cash");
//   const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);
//   const [taxRate, setTaxRate] = useState(13);

//   const handleItemChange = (index, field, value) => {
//     const updated = [...items];
//     updated[index][field] = value;
//     setItems(updated);
//   };

//   const addItem = () => {
//     setItems([...items, { name: "", qty: 1, price: 0 }]);
//   };

//   const removeItem = (index) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   const calcTotal = () => {
//     const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
//     const tax = (subtotal * taxRate) / 100;
//     return { subtotal, tax, grandTotal: subtotal + tax };
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const totals = calcTotal();
//     const invoice = {
//       id: Date.now(),
//       customer,
//       paymentMethod,
//       date: new Date().toLocaleString(),
//       items,
//       totals,
//     };
//     addInvoice(invoice);
//     setCustomer("");
//     setPaymentMethod("Cash");
//     setItems([{ name: "", qty: 1, price: 0 }]);
//   };

//   const { subtotal, tax, grandTotal } = calcTotal();

//   return (
//     <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
//       <div style={{ marginBottom: "10px" }}>
//         <input
//           placeholder="Customer Name"
//           value={customer}
//           onChange={(e) => setCustomer(e.target.value)}
//           required
//         />
//         <select
//           value={paymentMethod}
//           onChange={(e) => setPaymentMethod(e.target.value)}
//           style={{ marginLeft: "10px" }}
//         >
//           <option>Cash</option>
//           <option>eSewa</option>
//           <option>Khalti</option>
//           <option>Card</option>
//         </select>
//       </div>

//       {items.map((item, index) => (
//         <div key={index} style={{ marginBottom: "10px" }}>
//           <input
//             placeholder="Medicine Name"
//             value={item.name}
//             onChange={(e) => handleItemChange(index, "name", e.target.value)}
//             required
//           />
//           <input
//             type="number"
//             placeholder="Qty"
//             value={item.qty}
//             min="1"
//             onChange={(e) =>
//               handleItemChange(index, "qty", parseInt(e.target.value))
//             }
//             style={{ width: "60px", marginLeft: "10px" }}
//           />
//           <input
//             type="number"
//             placeholder="Price"
//             value={item.price}
//             min="0"
//             onChange={(e) =>
//               handleItemChange(index, "price", parseFloat(e.target.value))
//             }
//             style={{ width: "80px", marginLeft: "10px" }}
//           />
//           <button
//             type="button"
//             style={{ marginLeft: "10px" }}
//             onClick={() => removeItem(index)}
//           >
//             ❌
//           </button>
//         </div>
//       ))}

//       <button type="button" onClick={addItem}>
//         ➕ Add Medicine
//       </button>

//       <div style={{ marginTop: "10px" }}>
//         <label>Tax %:</label>
//         <input
//           type="number"
//           value={taxRate}
//           onChange={(e) => setTaxRate(e.target.value)}
//           style={{ width: "60px", marginLeft: "5px" }}
//         />
//       </div>

//       <div style={{ marginTop: "10px" }}>
//         <strong>Subtotal:</strong> Rs. {subtotal.toFixed(2)} <br />
//         <strong>Tax ({taxRate}%):</strong> Rs. {tax.toFixed(2)} <br />
//         <strong>Grand Total:</strong> Rs. {grandTotal.toFixed(2)}
//       </div>

//       <button type="submit" style={{ marginTop: "10px" }}>
//         ✅ Generate Invoice
//       </button>
//     </form>
//   );
// };

// export default BillingForm;

// import React, { useState } from "react";

// const BillingForm = ({ addInvoice }) => {
//   const [customer, setCustomer] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Cash");
//   const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);
//   const [taxRate, setTaxRate] = useState(13);

//   const handleItemChange = (index, field, value) => {
//     const updated = [...items];
//     updated[index][field] = value;
//     setItems(updated);
//   };

//   const addItem = () => {
//     setItems([...items, { name: "", qty: 1, price: 0 }]);
//   };

//   const removeItem = (index) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   const calcTotal = () => {
//     const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
//     const tax = (subtotal * taxRate) / 100;
//     return { subtotal, tax, grandTotal: subtotal + tax };
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const totals = calcTotal();
//     const invoice = {
//       id: Date.now(),
//       customer,
//       paymentMethod,
//       date: new Date().toLocaleString(),
//       items,
//       totals,
//     };
//     addInvoice(invoice);
//     setCustomer("");
//     setPaymentMethod("Cash");
//     setItems([{ name: "", qty: 1, price: 0 }]);
//   };

//   const { subtotal, tax, grandTotal } = calcTotal();

//   return (
//     <form onSubmit={handleSubmit} className="mt-4">
//       <div className="row mb-3">
//         <div className="col-md-6">
//           <input
//             className="form-control mb-2"
//             placeholder="Customer Name"
//             value={customer}
//             onChange={(e) => setCustomer(e.target.value)}
//             required
//           />
//         </div>
//         <div className="col-md-6">
//           <select
//             className="form-select mb-2"
//             value={paymentMethod}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//           >
//             <option>Cash</option>
//             <option>eSewa</option>
//             <option>Khalti</option>
//             <option>Card</option>
//           </select>
//         </div>
//       </div>
//       {items.map((item, index) => (
//         <div className="row align-items-center mb-2" key={index}>
//           <div className="col-md-5">
//             <input
//               className="form-control"
//               placeholder="Medicine Name"
//               value={item.name}
//               onChange={(e) => handleItemChange(index, "name", e.target.value)}
//               required
//             />
//           </div>
//           <div className="col-md-2">
//             <input
//               className="form-control"
//               type="number"
//               placeholder="Qty"
//               value={item.qty}
//               min="1"
//               onChange={(e) =>
//                 handleItemChange(index, "qty", parseInt(e.target.value) || 1)
//               }
//             />
//           </div>
//           <div className="col-md-3">
//             <input
//               className="form-control"
//               type="number"
//               placeholder="Price"
//               value={item.price}
//               min="0"
//               step="0.01"
//               onChange={(e) =>
//                 handleItemChange(
//                   index,
//                   "price",
//                   parseFloat(e.target.value) || 0
//                 )
//               }
//             />
//           </div>
//           <div className="col-md-2 text-end">
//             <button
//               type="button"
//               className="btn btn-outline-danger btn-sm"
//               onClick={() => removeItem(index)}
//               tabIndex={-1}
//               title="Remove item"
//               disabled={items.length === 1}
//             >
//               ❌
//             </button>
//           </div>
//         </div>
//       ))}
//       <div className="mb-3">
//         <button
//           type="button"
//           className="btn btn-outline-primary btn-sm"
//           onClick={addItem}
//         >
//           ➕ Add Medicine
//         </button>
//       </div>
//       <div className="mb-3 row align-items-center">
//         <label className="col-auto col-form-label fw-semibold">Tax %:</label>
//         <div className="col-auto">
//           <input
//             className="form-control"
//             type="number"
//             value={taxRate}
//             min="0"
//             max="100"
//             onChange={(e) => setTaxRate(Number(e.target.value))}
//             style={{ width: "80px" }}
//           />
//         </div>
//       </div>
//       <div className="mb-3">
//         <strong>Subtotal:</strong> Rs. {subtotal.toFixed(2)} <br />
//         <strong>Tax ({taxRate}%):</strong> Rs. {tax.toFixed(2)} <br />
//         <strong>Grand Total:</strong> Rs. {grandTotal.toFixed(2)}
//       </div>
//       <button type="submit" className="btn btn-success fw-semibold">
//         ✅ Generate Invoice
//       </button>
//     </form>
//   );
// };

// export default BillingForm;

import React, { useState } from "react";

const BillingForm = ({ addInvoice, medicines = [] }) => {
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [items, setItems] = useState([
    { medicineId: "", name: "", qty: 1, price: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(13); // Default Nepal VAT

  // Handle changes for specific item rows
  const handleItemChange = (index, field, value) => {
    const updated = [...items];

    // If selecting a medicine from the list, auto-fill the price
    if (field === "name") {
      const selectedMed = medicines.find((m) => m.name === value);
      if (selectedMed) {
        updated[index].medicineId = selectedMed._id;
        updated[index].price = selectedMed.price;
      }
    }

    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { medicineId: "", name: "", qty: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calcTotal = () => {
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const tax = (subtotal * taxRate) / 100;
    return { subtotal, tax, grandTotal: subtotal + tax };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totals = calcTotal();

    const invoice = {
      id: `INV-${Date.now()}`,
      customer,
      paymentMethod,
      date: new Date().toISOString(),
      items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      totalAmount: totals.grandTotal,
    };

    addInvoice(invoice);

    // Reset Form
    setCustomer("");
    setPaymentMethod("Cash");
    setItems([{ medicineId: "", name: "", qty: 1, price: 0 }]);
  };

  const { subtotal, tax, grandTotal } = calcTotal();

  return (
    <div className="card shadow-sm border-0 p-4 bg-white">
      <h4 className="mb-4 fw-bold text-primary">
        <i className="bi bi-receipt-cutoff me-2"></i>New Billing Entry
      </h4>

      <form onSubmit={handleSubmit}>
        {/* Customer & Payment Info */}
        <div className="row g-3 mb-4">
          <div className="col-md-7">
            <label className="form-label small fw-bold text-muted uppercase">
              Customer Name
            </label>
            <input
              className="form-control form-control-lg"
              placeholder="Enter customer name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
            />
          </div>
          <div className="col-md-5">
            <label className="form-label small fw-bold text-muted uppercase">
              Payment Method
            </label>
            <select
              className="form-select form-select-lg"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option>Cash</option>
              <option>eSewa</option>
              <option>Khalti</option>
              <option>Card</option>
              <option>Stripe</option>
            </select>
          </div>
        </div>

        {/* Medicine Items Table */}
        <div className="table-responsive">
          <table className="table table-borderless align-middle">
            <thead className="table-light text-muted small">
              <tr>
                <th style={{ width: "45%" }}>Medicine Item</th>
                <th style={{ width: "15%" }}>Qty</th>
                <th style={{ width: "20%" }}>Price (Rs.)</th>
                <th style={{ width: "15%" }}>Total</th>
                <th style={{ width: "5%" }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      className="form-control"
                      list="medicineOptions"
                      placeholder="Search medicine..."
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                      required
                    />
                    <datalist id="medicineOptions">
                      {medicines.map((m) => (
                        <option key={m._id} value={m.name} />
                      ))}
                    </datalist>
                  </td>
                  <td>
                    <input
                      className="form-control"
                      type="number"
                      value={item.qty}
                      min="1"
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "qty",
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="form-control"
                      type="number"
                      value={item.price}
                      min="0"
                      step="0.01"
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td className="fw-semibold text-dark">
                    Rs. {(item.qty * item.price).toFixed(2)}
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-link text-danger p-0"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <i className="bi bi-trash-fill fs-5"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary btn-sm mb-4"
          onClick={addItem}
        >
          <i className="bi bi-plus-lg me-1"></i> Add Another Medicine
        </button>

        <hr className="text-muted opacity-25" />

        {/* Calculation Section */}
        <div className="row justify-content-end">
          <div className="col-md-5">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal:</span>
              <span className="fw-semibold">Rs. {subtotal.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">VAT (%):</span>
              <input
                className="form-control form-control-sm text-end"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                style={{ width: "60px" }}
              />
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Tax Amount:</span>
              <span className="fw-semibold">Rs. {tax.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between border-top pt-3 mb-4">
              <h5 className="fw-bold">Grand Total:</h5>
              <h5 className="fw-bold text-success">
                Rs. {grandTotal.toFixed(2)}
              </h5>
            </div>

            <button
              type="submit"
              className="btn btn-success btn-lg w-100 fw-bold shadow-sm"
            >
              <i className="bi bi-check-circle-fill me-2"></i> Complete
              Transaction
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BillingForm;
