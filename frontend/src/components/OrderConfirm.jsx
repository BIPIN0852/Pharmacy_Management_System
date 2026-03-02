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

// import React, { useEffect, useState } from "react";
// import { CheckCircle, Download, ShoppingBag, ArrowLeft } from "lucide-react";
// import axios from "axios";
// import { useLocation, Link, useParams } from "react-router-dom";
// import api from "../services/api";

// const OrderConfirmation = () => {
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   // Extract orderId from URL (e.g., ?order_id=...) or Params
//   const queryParams = new URLSearchParams(location.search);
//   const orderId = queryParams.get("order_id");

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       if (!orderId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         // ✅ UPDATED: Fetch real order data from backend
//         const { data } = await api.get(`/orders/${orderId}`);
//         setOrder(data);
//       } catch (error) {
//         console.error("Error fetching order:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrderDetails();
//   }, [orderId]);

//   const downloadInvoice = async () => {
//     try {
//       // ✅ UPDATED: Use the specific PDF invoice route we created in backend
//       const response = await api.get(`/orders/${orderId}/invoice`, {
//         responseType: "blob",
//       });

//       const blob = new Blob([response.data], { type: "application/pdf" });
//       const link = document.createElement("a");
//       link.href = window.URL.createObjectURL(blob);
//       link.download = `Invoice_${orderId}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Error downloading invoice:", error);
//       alert("Failed to generate invoice. Please try again later.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-vh-100 d-flex justify-content-center align-items-center">
//         <div className="spinner-border text-primary" role="status"></div>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
//         <h3 className="text-muted">Order Not Found</h3>
//         <Link to="/customer-dashboard" className="btn btn-primary mt-3">
//           Go to Dashboard
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-vh-100 bg-light py-5 animate-fade-in">
//       <div className="container d-flex flex-column align-items-center">
//         <div
//           className="bg-white shadow-lg rounded-4 p-4 p-md-5 w-100 text-center"
//           style={{ maxWidth: 700 }}
//         >
//           {/* Success Header */}
//           <div className="mb-4">
//             <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
//               <CheckCircle className="text-success" size={60} />
//             </div>
//             <h2 className="fw-bold text-dark">Payment Received!</h2>
//             <p className="text-muted">
//               Your order has been placed successfully. A confirmation email has
//               been sent to
//               <span className="text-dark fw-semibold">
//                 {" "}
//                 {order.user?.email}
//               </span>
//               .
//             </p>
//           </div>

//           {/* Order Info Summary */}
//           <div className="row g-3 mb-4 text-start">
//             <div className="col-sm-6">
//               <div className="p-3 border rounded-3 bg-light">
//                 <small
//                   className="text-muted d-block text-uppercase fw-bold"
//                   style={{ fontSize: "0.65rem" }}
//                 >
//                   Order ID
//                 </small>
//                 <span className="fw-bold text-primary">{order._id}</span>
//               </div>
//             </div>
//             <div className="col-sm-6">
//               <div className="p-3 border rounded-3 bg-light">
//                 <small
//                   className="text-muted d-block text-uppercase fw-bold"
//                   style={{ fontSize: "0.65rem" }}
//                 >
//                   Payment Method
//                 </small>
//                 <span className="fw-bold text-dark">{order.paymentMethod}</span>
//               </div>
//             </div>
//           </div>

//           {/* Items Table */}
//           <div className="table-responsive mb-4 text-start">
//             <table className="table table-borderless border-top">
//               <thead>
//                 <tr className="small text-muted text-uppercase">
//                   <th className="ps-0">Product</th>
//                   <th className="text-center">Qty</th>
//                   <th className="text-end pe-0">Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {order.orderItems.map((item, idx) => (
//                   <tr key={idx} className="border-bottom-0">
//                     <td className="ps-0 py-3 fw-medium text-dark">
//                       {item.name}
//                     </td>
//                     <td className="text-center py-3 text-muted">
//                       x {item.qty}
//                     </td>
//                     <td className="text-end pe-0 py-3 fw-bold">
//                       Rs. {item.price}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot>
//                 <tr className="border-top">
//                   <td colSpan="2" className="ps-0 py-3 fw-bold fs-5 text-dark">
//                     Total Amount
//                   </td>
//                   <td className="text-end pe-0 py-3 fw-bold fs-5 text-success">
//                     Rs. {order.totalPrice}
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>

//           {/* Action Buttons */}
//           <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-2">
//             <button
//               onClick={downloadInvoice}
//               className="btn btn-success btn-lg px-4 d-flex align-items-center justify-content-center gap-2"
//             >
//               <Download size={20} /> Download Invoice
//             </button>
//             <Link
//               to="/orders"
//               className="btn btn-outline-secondary btn-lg px-4 d-flex align-items-center justify-content-center gap-2"
//             >
//               <ShoppingBag size={20} /> View All Orders
//             </Link>
//           </div>

//           <Link
//             to="/customer-dashboard"
//             className="d-inline-flex align-items-center text-decoration-none mt-4 text-muted small"
//           >
//             <ArrowLeft size={14} className="me-1" /> Return to Dashboard
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderConfirmation;

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Download,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
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
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3 text-muted small">
          Confirming your order details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <h3 className="fw-normal text-dark">Order Not Found</h3>
        <p className="text-muted">
          We couldn't locate this order in our system.
        </p>
        <Link
          to="/customer-dashboard"
          className="btn btn-warning mt-3 px-4 shadow-sm border-0"
          style={{
            backgroundColor: "#FFD814",
            borderRadius: "8px",
            color: "#0F1111",
          }}
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#f0f2f2",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <div className="container py-5 d-flex flex-column align-items-center animate-fade-in">
        <div
          className="bg-white shadow-sm border rounded-3 p-4 p-md-5 w-100"
          style={{ maxWidth: 750, borderColor: "#D5D9D9" }}
        >
          {/* Success Header (Amazon Style) */}
          <div className="d-flex align-items-start mb-4 pb-3 border-bottom border-secondary-subtle">
            <CheckCircle
              className="text-success me-3 mt-1 flex-shrink-0"
              size={36}
              strokeWidth={2.5}
            />
            <div>
              <h2
                className="fw-normal text-success mb-2"
                style={{ color: "#067D62" }}
              >
                Order placed, thank you!
              </h2>
              <p className="text-dark mb-1">
                Confirmation will be sent to{" "}
                <span className="fw-bold">{order.user?.email}</span>.
              </p>
              <p className="text-dark mb-0">
                <span className="fw-bold">Order Number:</span>{" "}
                <span style={{ color: "#007185" }}>{order._id}</span>
              </p>
            </div>
          </div>

          {/* Order Info Summary */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <h5 className="fw-bold text-dark fs-6 mb-2">Payment Method</h5>
              <div className="text-muted small">
                {order.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : order.paymentMethod}
              </div>
            </div>
            <div className="col-md-6">
              <h5 className="fw-bold text-dark fs-6 mb-2">
                Shipping Information
              </h5>
              <div className="text-muted small">
                {order.shippingAddress ? (
                  <>
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}
                    <br />
                    {order.shippingAddress.country}
                  </>
                ) : (
                  "Address provided during checkout."
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border rounded-3 overflow-hidden mb-4">
            <div className="bg-light px-3 py-2 border-bottom">
              <h5 className="fw-bold text-dark fs-6 mb-0">Order Details</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-borderless mb-0 align-middle">
                <tbody>
                  {order.orderItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className={
                        idx !== order.orderItems.length - 1
                          ? "border-bottom"
                          : ""
                      }
                    >
                      <td
                        className="ps-4 py-3 fw-bold text-dark"
                        style={{ color: "#007185", width: "60%" }}
                      >
                        {item.name}
                      </td>
                      <td className="text-center py-3 text-muted small">
                        Qty: {item.qty}
                      </td>
                      <td className="text-end pe-4 py-3 fw-bold text-dark">
                        NPR {item.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-light border-top">
                  <tr>
                    <td
                      colSpan="2"
                      className="ps-4 py-3 fw-bold text-dark text-end"
                    >
                      Order Total:
                    </td>
                    <td
                      className="text-end pe-4 py-3 fw-bold text-danger h5 mb-0"
                      style={{ color: "#B12704" }}
                    >
                      NPR {order.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-column flex-sm-row gap-3 mt-4 pt-2">
            <button
              onClick={downloadInvoice}
              className="btn btn-warning py-2 px-4 shadow-sm border-0 d-flex align-items-center justify-content-center flex-grow-1"
              style={{
                backgroundColor: "#FFD814",
                borderRadius: "8px",
                color: "#0F1111",
                fontWeight: "500",
              }}
            >
              <Download size={18} className="me-2" /> Download Invoice
            </button>
            <Link
              to="/orders"
              className="btn bg-white py-2 px-4 shadow-sm d-flex align-items-center justify-content-center flex-grow-1"
              style={{
                border: "1px solid #D5D9D9",
                borderRadius: "8px",
                color: "#0F1111",
                fontWeight: "500",
              }}
            >
              <ShoppingBag
                size={18}
                className="me-2"
                style={{ color: "#007185" }}
              />{" "}
              Review your orders
            </Link>
          </div>

          <div className="text-center mt-4 pt-3 border-top">
            <Link
              to="/medicines"
              className="d-inline-flex align-items-center text-decoration-none fw-medium"
              style={{ color: "#007185", fontSize: "0.9rem" }}
            >
              Continue shopping <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;
