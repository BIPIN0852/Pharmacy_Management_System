// import React, { useEffect, useState } from "react";
// import { CheckCircle } from "lucide-react";
// import axios from "axios";

// const OrderConfirmation = () => {
//   const [invoiceData, setInvoiceData] = useState(null);

//   useEffect(() => {
//     // Simulate fetching order info after successful payment
//     const order = {
//       orderId: "ORD-" + Math.floor(Math.random() * 1000000),
//       customer: "John Doe",
//       email: "johndoe@gmail.com",
//       date: new Date().toLocaleString(),
//       items: [
//         { name: "Paracetamol 500mg", qty: 2, price: 50 },
//         { name: "Amoxicillin 250mg", qty: 1, price: 120 },
//       ],
//       total: 220,
//       paymentMethod: localStorage.getItem("paymentMethod") || "Stripe",
//     };
//     setInvoiceData(order);
//   }, []);

//   const downloadInvoice = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/invoice",
//         invoiceData,
//         { responseType: "blob" }
//       );
//       const blob = new Blob([response.data], { type: "application/pdf" });
//       const link = document.createElement("a");
//       link.href = window.URL.createObjectURL(blob);
//       link.download = `Invoice_${invoiceData.orderId}.pdf`;
//       link.click();
//     } catch (error) {
//       console.error("Error generating invoice:", error);
//     }
//   };

//   if (!invoiceData) return null;

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//       <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl text-center">
//         <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
//         <h2 className="text-2xl font-bold text-gray-800">
//           Payment Successful 🎉
//         </h2>
//         <p className="text-gray-500 mb-6">
//           Thank you for your order, {invoiceData.customer}! Your payment via{" "}
//           <strong>{invoiceData.paymentMethod}</strong> was successful.
//         </p>

//         <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
//           <p className="text-sm font-semibold">
//             Order ID: {invoiceData.orderId}
//           </p>
//           <p className="text-sm text-gray-600">Date: {invoiceData.date}</p>
//           <p className="text-sm text-gray-600">Email: {invoiceData.email}</p>
//         </div>

//         <table className="w-full text-sm mb-6">
//           <thead>
//             <tr className="border-b text-left text-gray-600">
//               <th>Item</th>
//               <th>Qty</th>
//               <th>Price (NPR)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoiceData.items.map((item, index) => (
//               <tr key={index} className="border-b hover:bg-gray-100">
//                 <td>{item.name}</td>
//                 <td>{item.qty}</td>
//                 <td>{item.price}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="text-right text-lg font-semibold mb-6">
//           Total: NPR {invoiceData.total}
//         </div>

//         <button
//           onClick={downloadInvoice}
//           className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md"
//         >
//           Download Invoice (PDF)
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderConfirmation;

import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Extract possible order details from query params after payment
    const params = new URLSearchParams(location.search);
    const orderId =
      params.get("order_id") || "ORD-" + Math.floor(Math.random() * 1000000);
    const paymentMethod = localStorage.getItem("paymentMethod") || "Stripe";

    // TODO: Replace this with actual API call to fetch real order
    // For demo, simulate order details
    const mockOrder = {
      orderId,
      customer: "John Doe",
      email: "johndoe@gmail.com",
      date: new Date().toLocaleString(),
      items: [
        { name: "Paracetamol 500mg", qty: 2, price: 50 },
        { name: "Amoxicillin 250mg", qty: 1, price: 120 },
      ],
      total: 220,
      paymentMethod,
    };
    setInvoiceData(mockOrder);
  }, [location.search]);

  const downloadInvoice = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/invoice",
        invoiceData,
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Invoice_${invoiceData.orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };

  if (!invoiceData) return null;

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light p-4">
      <div
        className="bg-white shadow-lg rounded-4 p-5 w-100"
        style={{ maxWidth: 600 }}
      >
        <CheckCircle className="text-success mx-auto mb-3" size={64} />
        <h2 className="h3 fw-bold text-success text-center">
          Payment Successful 🎉
        </h2>
        <p className="text-secondary mb-4 text-center">
          Thank you for your order, <b>{invoiceData.customer}</b>! Your payment
          via <b>{invoiceData.paymentMethod}</b> was successful.
        </p>

        <div className="mb-3 p-3 rounded bg-light">
          <p className="mb-1 fw-semibold">
            Order ID:{" "}
            <span className="text-primary">{invoiceData.orderId}</span>
          </p>
          <p className="mb-1 small text-muted">Date: {invoiceData.date}</p>
          <p className="mb-1 small text-muted">Email: {invoiceData.email}</p>
        </div>

        <table className="table table-sm mb-4">
          <thead>
            <tr className="text-secondary">
              <th>Item</th>
              <th>Qty</th>
              <th>Price (NPR)</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-end h5 mb-4">
          Total: <span className="text-success">NPR {invoiceData.total}</span>
        </div>

        <button onClick={downloadInvoice} className="btn btn-success px-4 py-2">
          Download Invoice (PDF)
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
