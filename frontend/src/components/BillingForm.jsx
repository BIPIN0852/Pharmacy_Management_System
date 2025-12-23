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

import React, { useState } from "react";

const BillingForm = ({ addInvoice }) => {
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState(13);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { name: "", qty: 1, price: 0 }]);
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
      id: Date.now(),
      customer,
      paymentMethod,
      date: new Date().toLocaleString(),
      items,
      totals,
    };
    addInvoice(invoice);
    setCustomer("");
    setPaymentMethod("Cash");
    setItems([{ name: "", qty: 1, price: 0 }]);
  };

  const { subtotal, tax, grandTotal } = calcTotal();

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            className="form-control mb-2"
            placeholder="Customer Name"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select mb-2"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option>Cash</option>
            <option>eSewa</option>
            <option>Khalti</option>
            <option>Card</option>
          </select>
        </div>
      </div>
      {items.map((item, index) => (
        <div className="row align-items-center mb-2" key={index}>
          <div className="col-md-5">
            <input
              className="form-control"
              placeholder="Medicine Name"
              value={item.name}
              onChange={(e) => handleItemChange(index, "name", e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              type="number"
              placeholder="Qty"
              value={item.qty}
              min="1"
              onChange={(e) =>
                handleItemChange(index, "qty", parseInt(e.target.value) || 1)
              }
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="number"
              placeholder="Price"
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
          </div>
          <div className="col-md-2 text-end">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => removeItem(index)}
              tabIndex={-1}
              title="Remove item"
              disabled={items.length === 1}
            >
              ❌
            </button>
          </div>
        </div>
      ))}
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={addItem}
        >
          ➕ Add Medicine
        </button>
      </div>
      <div className="mb-3 row align-items-center">
        <label className="col-auto col-form-label fw-semibold">Tax %:</label>
        <div className="col-auto">
          <input
            className="form-control"
            type="number"
            value={taxRate}
            min="0"
            max="100"
            onChange={(e) => setTaxRate(Number(e.target.value))}
            style={{ width: "80px" }}
          />
        </div>
      </div>
      <div className="mb-3">
        <strong>Subtotal:</strong> Rs. {subtotal.toFixed(2)} <br />
        <strong>Tax ({taxRate}%):</strong> Rs. {tax.toFixed(2)} <br />
        <strong>Grand Total:</strong> Rs. {grandTotal.toFixed(2)}
      </div>
      <button type="submit" className="btn btn-success fw-semibold">
        ✅ Generate Invoice
      </button>
    </form>
  );
};

export default BillingForm;
