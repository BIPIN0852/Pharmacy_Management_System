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

// import React, { useEffect, useState } from "react";
// import { CheckCircle } from "lucide-react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

// const OrderConfirmation = () => {
//   const [invoiceData, setInvoiceData] = useState(null);
//   const location = useLocation();

//   useEffect(() => {
//     // Extract possible order details from query params after payment
//     const params = new URLSearchParams(location.search);
//     const orderId =
//       params.get("order_id") || "ORD-" + Math.floor(Math.random() * 1000000);
//     const paymentMethod = localStorage.getItem("paymentMethod") || "Stripe";

//     // TODO: Replace this with actual API call to fetch real order
//     // For demo, simulate order details
//     const mockOrder = {
//       orderId,
//       customer: "John Doe",
//       email: "johndoe@gmail.com",
//       date: new Date().toLocaleString(),
//       items: [
//         { name: "Paracetamol 500mg", qty: 2, price: 50 },
//         { name: "Amoxicillin 250mg", qty: 1, price: 120 },
//       ],
//       total: 220,
//       paymentMethod,
//     };
//     setInvoiceData(mockOrder);
//   }, [location.search]);

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
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Error generating invoice:", error);
//     }
//   };

//   if (!invoiceData) return null;

//   return (
//     <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light p-4">
//       <div
//         className="bg-white shadow-lg rounded-4 p-5 w-100"
//         style={{ maxWidth: 600 }}
//       >
//         <CheckCircle className="text-success mx-auto mb-3" size={64} />
//         <h2 className="h3 fw-bold text-success text-center">
//           Payment Successful 🎉
//         </h2>
//         <p className="text-secondary mb-4 text-center">
//           Thank you for your order, <b>{invoiceData.customer}</b>! Your payment
//           via <b>{invoiceData.paymentMethod}</b> was successful.
//         </p>

//         <div className="mb-3 p-3 rounded bg-light">
//           <p className="mb-1 fw-semibold">
//             Order ID:{" "}
//             <span className="text-primary">{invoiceData.orderId}</span>
//           </p>
//           <p className="mb-1 small text-muted">Date: {invoiceData.date}</p>
//           <p className="mb-1 small text-muted">Email: {invoiceData.email}</p>
//         </div>

//         <table className="table table-sm mb-4">
//           <thead>
//             <tr className="text-secondary">
//               <th>Item</th>
//               <th>Qty</th>
//               <th>Price (NPR)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoiceData.items.map((item, idx) => (
//               <tr key={idx}>
//                 <td>{item.name}</td>
//                 <td>{item.qty}</td>
//                 <td>{item.price}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="text-end h5 mb-4">
//           Total: <span className="text-success">NPR {invoiceData.total}</span>
//         </div>

//         <button onClick={downloadInvoice} className="btn btn-success px-4 py-2">
//           Download Invoice (PDF)
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderConfirmation;

import React, { useEffect, useState } from "react";
import { CheckCircle, Download, ShoppingBag, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useLocation, Link, useParams } from "react-router-dom";
import api from "../services/api";

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Extract orderId from URL (e.g., ?order_id=...) or Params
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        // ✅ UPDATED: Fetch real order data from backend
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const downloadInvoice = async () => {
    try {
      // ✅ UPDATED: Use the specific PDF invoice route we created in backend
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Invoice_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to generate invoice. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <h3 className="text-muted">Order Not Found</h3>
        <Link to="/customer-dashboard" className="btn btn-primary mt-3">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5 animate-fade-in">
      <div className="container d-flex flex-column align-items-center">
        <div
          className="bg-white shadow-lg rounded-4 p-4 p-md-5 w-100 text-center"
          style={{ maxWidth: 700 }}
        >
          {/* Success Header */}
          <div className="mb-4">
            <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
              <CheckCircle className="text-success" size={60} />
            </div>
            <h2 className="fw-bold text-dark">Payment Received!</h2>
            <p className="text-muted">
              Your order has been placed successfully. A confirmation email has
              been sent to
              <span className="text-dark fw-semibold">
                {" "}
                {order.user?.email}
              </span>
              .
            </p>
          </div>

          {/* Order Info Summary */}
          <div className="row g-3 mb-4 text-start">
            <div className="col-sm-6">
              <div className="p-3 border rounded-3 bg-light">
                <small
                  className="text-muted d-block text-uppercase fw-bold"
                  style={{ fontSize: "0.65rem" }}
                >
                  Order ID
                </small>
                <span className="fw-bold text-primary">{order._id}</span>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="p-3 border rounded-3 bg-light">
                <small
                  className="text-muted d-block text-uppercase fw-bold"
                  style={{ fontSize: "0.65rem" }}
                >
                  Payment Method
                </small>
                <span className="fw-bold text-dark">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="table-responsive mb-4 text-start">
            <table className="table table-borderless border-top">
              <thead>
                <tr className="small text-muted text-uppercase">
                  <th className="ps-0">Product</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end pe-0">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, idx) => (
                  <tr key={idx} className="border-bottom-0">
                    <td className="ps-0 py-3 fw-medium text-dark">
                      {item.name}
                    </td>
                    <td className="text-center py-3 text-muted">
                      x {item.qty}
                    </td>
                    <td className="text-end pe-0 py-3 fw-bold">
                      Rs. {item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-top">
                  <td colSpan="2" className="ps-0 py-3 fw-bold fs-5 text-dark">
                    Total Amount
                  </td>
                  <td className="text-end pe-0 py-3 fw-bold fs-5 text-success">
                    Rs. {order.totalPrice}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-2">
            <button
              onClick={downloadInvoice}
              className="btn btn-success btn-lg px-4 d-flex align-items-center justify-content-center gap-2"
            >
              <Download size={20} /> Download Invoice
            </button>
            <Link
              to="/orders"
              className="btn btn-outline-secondary btn-lg px-4 d-flex align-items-center justify-content-center gap-2"
            >
              <ShoppingBag size={20} /> View All Orders
            </Link>
          </div>

          <Link
            to="/customer-dashboard"
            className="d-inline-flex align-items-center text-decoration-none mt-4 text-muted small"
          >
            <ArrowLeft size={14} className="me-1" /> Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
