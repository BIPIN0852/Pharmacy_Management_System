// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Card,
//   Button,
//   Badge,
//   Spinner,
//   Row,
//   Col,
// } from "react-bootstrap";
// import { Link, useSearchParams } from "react-router-dom";
// import {
//   CheckCircle,
//   XCircle,
//   Download,
//   ArrowRight,
//   Receipt,
//   MapPin,
//   User,
//   Clock,
//   Building,
// } from "lucide-react";
// import axios from "axios";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();

//   // State for handling verification status
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [order, setOrder] = useState(null);

//   // Get params from URL
//   const pidx = searchParams.get("pidx"); // Khalti Transaction ID
//   const urlOrderId =
//     searchParams.get("id") ||
//     searchParams.get("order_id") ||
//     searchParams.get("purchase_order_id");

//   // --- 1. FETCH & VERIFY EFFECT ---
//   useEffect(() => {
//     let isMounted = true;

//     const fetchOrVerifyOrder = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         const token = localStorage.getItem("token");
//         const config = {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         // Scenario A: Coming back from Khalti Payment
//         if (pidx) {
//           try {
//             const { data } = await axios.post(
//               "http://localhost:5000/api/payments/khalti-lookup",
//               { pidx },
//               config,
//             );

//             if (data.success && data.order && isMounted) {
//               setOrder(data.order);
//             } else if (urlOrderId && isMounted) {
//               // Fallback: Khalti failed, but we have the order ID, so just fetch the order
//               const orderRes = await axios.get(
//                 `http://localhost:5000/api/orders/${urlOrderId}`,
//                 config,
//               );
//               setOrder(orderRes.data);
//             } else if (isMounted) {
//               setError(data.message || "Payment verification failed.");
//             }
//           } catch (khaltiErr) {
//             console.error("Khalti Error:", khaltiErr);
//             // If Khalti lookup fails completely, try to load the order anyway if we have the ID
//             if (urlOrderId && isMounted) {
//               const orderRes = await axios.get(
//                 `http://localhost:5000/api/orders/${urlOrderId}`,
//                 config,
//               );
//               setOrder(orderRes.data);
//             } else if (isMounted) {
//               setError("Failed to verify payment with Khalti.");
//             }
//           }
//         }
//         // Scenario B: Viewing an existing order (from Order History)
//         else if (urlOrderId) {
//           const { data } = await axios.get(
//             `http://localhost:5000/api/orders/${urlOrderId}`,
//             config,
//           );
//           if (isMounted) {
//             setOrder(data);
//           }
//         } else {
//           if (isMounted) setError("No order reference found in URL.");
//         }
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         if (isMounted) {
//           // ✅ FIX: Now it will ALWAYS set an error if it fails, preventing a blank page
//           setError(
//             err.response?.data?.message ||
//               err.message ||
//               "Failed to load receipt.",
//           );
//         }
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     if (!order) {
//       fetchOrVerifyOrder();
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [pidx, urlOrderId, order]);

//   // --- 2. RENDER: LOADING STATE ---
//   if (isLoading) {
//     return (
//       <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
//         <Spinner
//           animation="border"
//           variant="primary"
//           style={{ width: "3rem", height: "3rem" }}
//         />
//         <h5 className="mt-3 text-muted animate-pulse">Loading Receipt...</h5>
//       </Container>
//     );
//   }

//   // --- 3. RENDER: ERROR STATE ---
//   if (error && !order) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center min-vh-100">
//         <Card
//           className="border-0 shadow-lg rounded-4 text-center p-5"
//           style={{ maxWidth: "500px" }}
//         >
//           <div className="mb-3 text-danger">
//             <XCircle size={64} />
//           </div>
//           <h3 className="fw-bold text-danger mb-3">Error</h3>
//           <p className="text-muted mb-4">{error}</p>
//           <div className="d-grid gap-2">
//             <Link to="/orders" className="btn btn-primary rounded-pill">
//               View My Orders
//             </Link>
//           </div>
//         </Card>
//       </Container>
//     );
//   }

//   // Fallback Catch-all for blank page prevention
//   if (!order) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center min-vh-100">
//         <h5 className="text-muted">Order details could not be loaded.</h5>
//       </Container>
//     );
//   }

//   // --- DYNAMIC UI LOGIC based on actual DB status ---
//   const isPaid = order.isPaid;
//   const isCOD = order.paymentMethod === "COD";

//   let statusIcon = <CheckCircle size={48} strokeWidth={3} />;
//   let statusColor = "bg-success";
//   let title = "Payment Successful!";
//   let subtitle = "Thank you for your purchase. Your order is being processed.";

//   if (!isPaid && !isCOD) {
//     statusIcon = <Clock size={48} strokeWidth={3} />;
//     statusColor = "bg-warning text-dark";
//     title = "Payment Pending / Failed!";
//     subtitle = "Your order is placed but awaiting payment confirmation.";
//   } else if (!isPaid && isCOD) {
//     title = "Order Confirmed!";
//     subtitle = "Your order is placed. Please keep cash ready upon delivery.";
//   }

//   // --- 4. RENDER: RECEIPT STATE ---
//   return (
//     <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5 animate-fade-in">
//       <Card
//         className="border-0 shadow-lg rounded-4 p-4 p-md-5 position-relative overflow-hidden"
//         style={{ maxWidth: "600px", width: "100%" }}
//       >
//         {/* Dynamic Header */}
//         <div className="text-center mb-4">
//           <div
//             className={`${statusColor} ${!isPaid && !isCOD ? "" : "text-white"} rounded-circle d-inline-flex p-3 shadow-sm mb-3`}
//           >
//             {statusIcon}
//           </div>
//           <h2 className="fw-bold mb-2 text-dark">{title}</h2>
//           <p className="text-muted px-3">{subtitle}</p>
//         </div>

//         {/* Detailed Receipt Card */}
//         <div className="bg-light bg-opacity-50 border border-light-subtle p-4 rounded-4 mb-4 shadow-sm">
//           {/* Company Header */}
//           <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-10">
//             <div className="d-flex align-items-center gap-2 text-primary">
//               <Building size={24} />
//               <span className="fw-bold fs-5 tracking-wider">PharmaStore</span>
//             </div>
//             <Receipt size={24} className="text-muted opacity-50" />
//           </div>

//           {/* Customer & Address Info */}
//           <Row className="mb-4 g-3">
//             <Col sm={6}>
//               <div className="small text-muted text-uppercase fw-bold mb-1">
//                 Billed To:
//               </div>
//               <div className="fw-bold text-dark d-flex align-items-center gap-2">
//                 <User size={14} className="text-muted" />{" "}
//                 {order.user?.name || "Customer"}
//               </div>
//               <div className="small text-muted ms-4">{order.user?.email}</div>
//             </Col>
//             <Col sm={6}>
//               <div className="small text-muted text-uppercase fw-bold mb-1">
//                 Shipped To:
//               </div>
//               <div className="small text-dark d-flex align-start gap-2">
//                 <MapPin size={14} className="text-muted mt-1 flex-shrink-0" />
//                 <span>
//                   {order.shippingAddress?.address}
//                   <br />
//                   {order.shippingAddress?.city},{" "}
//                   {order.shippingAddress?.country}
//                   <br />
//                   {order.shippingAddress?.postalCode}
//                 </span>
//               </div>
//             </Col>
//           </Row>

//           <div className="bg-white p-3 rounded-3 border mb-3">
//             <Row className="g-3">
//               <Col xs={6}>
//                 <span className="text-muted small d-block">Order ID</span>
//                 <span className="fw-bold font-monospace">
//                   {order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}
//                 </span>
//               </Col>
//               <Col xs={6}>
//                 <span className="text-muted small d-block">Date</span>
//                 <span className="fw-bold small">
//                   {new Date(order.createdAt).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </span>
//               </Col>
//               <Col xs={6}>
//                 <span className="text-muted small d-block">Payment Method</span>
//                 <span className="fw-bold">{order.paymentMethod}</span>
//               </Col>
//               <Col xs={6}>
//                 <span className="text-muted small d-block">Total Amount</span>
//                 <span className="fw-bold text-primary fs-5">
//                   Rs. {order.totalPrice?.toLocaleString()}
//                 </span>
//               </Col>
//             </Row>
//           </div>

//           <Row className="g-3">
//             <Col xs={6}>
//               <span className="text-muted small d-block mb-1">
//                 Payment Status
//               </span>
//               <Badge
//                 bg={isPaid ? "success" : "warning"}
//                 text={isPaid ? "white" : "dark"}
//                 className="px-3 py-2"
//               >
//                 {isPaid ? "PAID" : "PENDING"}
//               </Badge>
//             </Col>
//             <Col xs={6}>
//               <span className="text-muted small d-block mb-1">
//                 Fulfillment Status
//               </span>
//               <Badge
//                 bg={order.isDelivered ? "info" : "secondary"}
//                 className="px-3 py-2"
//               >
//                 {order.orderStatus ||
//                   (order.isDelivered ? "Delivered" : "Processing")}
//               </Badge>
//             </Col>
//           </Row>
//         </div>

//         {/* Action Buttons */}
//         <div className="d-grid gap-3">
//           <Button
//             variant="outline-secondary"
//             className="rounded-pill border-opacity-25"
//             onClick={() => window.print()}
//           >
//             <Download size={18} className="me-2" /> Download Full Receipt
//           </Button>

//           <Link
//             to="/orders"
//             className="btn btn-primary rounded-pill fw-bold py-2 shadow-sm d-flex justify-content-center align-items-center"
//           >
//             View Order History <ArrowRight size={18} className="ms-2" />
//           </Link>
//         </div>
//       </Card>

//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; opacity: 0; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         .animate-pulse { animation: pulse 2s infinite; }
//         @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
//         @media print {
//           body * { visibility: hidden; }
//           .card, .card * { visibility: visible; }
//           .card { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
//           .btn { display: none !important; }
//         }
//       `}</style>
//     </Container>
//   );
// };

// export default PaymentSuccess;

// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Card,
//   Button,
//   Badge,
//   Spinner,
//   Row,
//   Col,
//   Table,
// } from "react-bootstrap";
// import { Link, useSearchParams, useNavigate } from "react-router-dom";
// import {
//   CheckCircle,
//   XCircle,
//   Download,
//   ArrowRight,
//   Clock,
//   Building,
// } from "lucide-react";
// import axios from "axios";

// const PaymentSuccess = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [order, setOrder] = useState(null);
//   const [countdown, setCountdown] = useState(15);

//   const pidx = searchParams.get("pidx");
//   const khaltiStatus = searchParams.get("status");
//   const transactionId = searchParams.get("transaction_id");
//   const urlOrderId =
//     searchParams.get("id") ||
//     searchParams.get("order_id") ||
//     searchParams.get("purchase_order_id") ||
//     searchParams.get("orderId");

//   useEffect(() => {
//     let isMounted = true;

//     const processPaymentAndFetchOrder = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         const token = localStorage.getItem("token");
//         const config = {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         if (pidx) {
//           if (khaltiStatus === "Completed") {
//             try {
//               await axios.post(
//                 "http://localhost:5000/api/payments/khalti-lookup",
//                 { pidx },
//                 config,
//               );

//               await axios.put(
//                 `http://localhost:5000/api/orders/${urlOrderId}/pay`,
//                 {
//                   id: transactionId || pidx,
//                   status: "COMPLETED",
//                   update_time: new Date().toISOString(),
//                   email_address: "khalti_wallet_user",
//                 },
//                 config,
//               );

//               const finalOrderRes = await axios.get(
//                 `http://localhost:5000/api/orders/${urlOrderId}`,
//                 config,
//               );
//               if (isMounted) setOrder(finalOrderRes.data);
//             } catch (khaltiErr) {
//               console.error("Khalti Verification Error:", khaltiErr);
//               if (isMounted)
//                 setError(
//                   "Payment successful, but failed to update receipt. Please contact support.",
//                 );
//             }
//           } else {
//             if (isMounted)
//               setError(
//                 `Khalti Payment Status: ${khaltiStatus || "Failed/Cancelled"}`,
//               );
//           }
//         } else if (urlOrderId) {
//           const { data } = await axios.get(
//             `http://localhost:5000/api/orders/${urlOrderId}`,
//             config,
//           );
//           if (isMounted) setOrder(data);
//         } else {
//           if (isMounted) setError("No order reference found in URL.");
//         }
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         if (isMounted) {
//           setError(
//             err.response?.data?.message ||
//               err.message ||
//               "Failed to load receipt.",
//           );
//         }
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     if (!order) {
//       processPaymentAndFetchOrder();
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [pidx, khaltiStatus, transactionId, urlOrderId, order]);

//   useEffect(() => {
//     if (order && !error && !isLoading) {
//       const timer = setInterval(() => {
//         setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
//       }, 1000);

//       const redirect = setTimeout(() => {
//         navigate("/orders");
//       }, 15000);

//       return () => {
//         clearInterval(timer);
//         clearTimeout(redirect);
//       };
//     }
//   }, [order, error, isLoading, navigate]);

//   if (isLoading) {
//     return (
//       <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
//         <Spinner
//           animation="border"
//           style={{ color: "#007185", width: "3rem", height: "3rem" }}
//         />
//         <h5 className="mt-3 text-muted animate-pulse">
//           Securing your receipt...
//         </h5>
//       </Container>
//     );
//   }

//   if (error && !order) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center min-vh-100">
//         <Card
//           className="border-0 shadow-lg rounded-4 text-center p-5"
//           style={{ maxWidth: "500px" }}
//         >
//           <div className="mb-3 text-danger">
//             <XCircle size={64} />
//           </div>
//           <h3 className="fw-bold text-danger mb-3">Payment Notice</h3>
//           <p className="text-muted mb-4">{error}</p>
//           <div className="d-grid gap-2">
//             <Link to="/orders" className="btn btn-primary rounded-1">
//               View My Orders
//             </Link>
//           </div>
//         </Card>
//       </Container>
//     );
//   }

//   if (!order) return null;

//   const isPaid = order.isPaid;
//   const isCOD = order.paymentMethod === "COD";

//   let statusIcon = <CheckCircle size={48} strokeWidth={3} />;
//   let statusColor = "text-success";
//   let title = "Payment Successful!";
//   let subtitle = "Thank you for your purchase. Your order is being processed.";

//   if (!isPaid && !isCOD) {
//     statusIcon = <Clock size={48} strokeWidth={3} />;
//     statusColor = "text-warning";
//     title = "Payment Pending / Failed";
//     subtitle = "Your order is placed but awaiting payment confirmation.";
//   } else if (!isPaid && isCOD) {
//     title = "Order Confirmed!";
//     subtitle = "Your order is placed. Please keep cash ready upon delivery.";
//   }

//   return (
//     <div
//       className="print-page-bg"
//       style={{
//         backgroundColor: "#f0f2f2",
//         minHeight: "100vh",
//         padding: "40px 0",
//       }}
//     >
//       {/* Success Notice Header (Hidden on Print) */}
//       <div className="text-center mb-4 d-print-none animate-fade-in">
//         <div className={`${statusColor} mb-3`}>{statusIcon}</div>
//         <h2 className="fw-bold mb-2 text-dark">{title}</h2>
//         <p className="text-muted px-3 mb-3">{subtitle}</p>

//         <div className="d-inline-block px-3 py-1 rounded-pill bg-white border shadow-sm text-muted small">
//           Redirecting to orders in{" "}
//           <span className="fw-bold text-danger">{countdown}</span>s
//         </div>
//       </div>

//       <Container className="d-flex justify-content-center animate-fade-in print-container">
//         {/* ✅ REAL WORLD RECEIPT/INVOICE UI */}
//         <div
//           className="bg-white border p-4 p-md-5 shadow-sm printable-receipt w-100"
//           style={{ maxWidth: "800px", borderColor: "#D5D9D9" }}
//         >
//           {/* Invoice Header */}
//           <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start border-bottom pb-4 mb-4">
//             <div className="mb-3 mb-sm-0">
//               <h2
//                 className="fw-bold mb-1 d-flex align-items-center gap-2"
//                 style={{ color: "#0F1111", letterSpacing: "-0.5px" }}
//               >
//                 <Building size={28} style={{ color: "#007185" }} />{" "}
//                 SmartPharmacy
//               </h2>
//               <p className="text-muted small mb-0 mt-2">
//                 123 Health Avenue, Medical District
//               </p>
//               <p className="text-muted small mb-0">Bagmati Province, Nepal</p>
//               <p className="text-muted small mb-0">
//                 support@smartpharmacy.com | +977-1234567890
//               </p>
//             </div>
//             <div className="text-sm-end text-start">
//               <h1
//                 className="fw-bold text-uppercase mb-1"
//                 style={{
//                   color: "#565959",
//                   letterSpacing: "2px",
//                   fontSize: "2rem",
//                 }}
//               >
//                 Receipt
//               </h1>
//               <p className="mb-1 text-dark small">
//                 <span className="fw-bold text-muted me-2">Order #:</span>
//                 <span className="font-monospace">
//                   {order.orderNumber || order._id.slice(-8).toUpperCase()}
//                 </span>
//               </p>
//               <p className="mb-0 text-dark small">
//                 <span className="fw-bold text-muted me-2">Date:</span>
//                 {new Date(order.createdAt).toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </p>
//             </div>
//           </div>

//           {/* Customer & Address Grid */}
//           <Row className="mb-5 g-4">
//             <Col sm={4}>
//               <h6
//                 className="text-muted text-uppercase small fw-bold mb-2"
//                 style={{ letterSpacing: "0.5px" }}
//               >
//                 Billed To:
//               </h6>
//               <div className="fw-bold text-dark fs-6">
//                 {order.user?.name || "Customer"}
//               </div>
//               <div className="small text-muted">{order.user?.email}</div>
//             </Col>

//             <Col sm={4}>
//               <h6
//                 className="text-muted text-uppercase small fw-bold mb-2"
//                 style={{ letterSpacing: "0.5px" }}
//               >
//                 Shipped To:
//               </h6>
//               <div className="small text-dark lh-base">
//                 <span className="fw-bold">
//                   {order.user?.name || "Customer"}
//                 </span>
//                 <br />
//                 {order.shippingAddress?.address}
//                 <br />
//                 {order.shippingAddress?.city}, {order.shippingAddress?.country}
//                 <br />
//                 {order.shippingAddress?.postalCode}
//               </div>
//             </Col>

//             <Col sm={4} className="text-sm-end mt-4 mt-sm-0">
//               <h6
//                 className="text-muted text-uppercase small fw-bold mb-2"
//                 style={{ letterSpacing: "0.5px" }}
//               >
//                 Payment Details:
//               </h6>
//               <div className="small mb-2">
//                 <span className="text-muted me-2">Method:</span>
//                 <span className="fw-bold text-dark">{order.paymentMethod}</span>
//               </div>
//               <div className="small">
//                 <span className="text-muted me-2">Status:</span>
//                 <Badge
//                   bg={isPaid ? "success" : isCOD ? "info" : "secondary"}
//                   text={isPaid || isCOD ? "white" : "dark"}
//                   className="rounded-1 print-badge"
//                 >
//                   {isPaid ? "PAID" : isCOD ? "PENDING (COD)" : "UNPAID"}
//                 </Badge>
//               </div>
//             </Col>
//           </Row>

//           {/* Itemized Table */}
//           <Table
//             bordered
//             hover
//             responsive
//             size="sm"
//             className="mb-4 print-table border-secondary-subtle"
//           >
//             <thead style={{ backgroundColor: "#f8f9fa" }}>
//               <tr className="text-uppercase small text-muted">
//                 <th className="py-2 px-3 fw-bold">Description</th>
//                 <th className="py-2 text-center fw-bold" width="12%">
//                   Qty
//                 </th>
//                 <th className="py-2 text-end fw-bold" width="20%">
//                   Unit Price
//                 </th>
//                 <th className="py-2 text-end pe-3 fw-bold" width="20%">
//                   Amount
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="small align-middle">
//               {order.orderItems?.map((item, index) => (
//                 <tr key={index} className="print-row">
//                   <td className="py-3 px-3">
//                     <span
//                       className="fw-bold d-block text-dark"
//                       style={{ fontSize: "0.9rem" }}
//                     >
//                       {item.name}
//                     </span>
//                     <span
//                       className="text-muted"
//                       style={{ fontSize: "0.75rem" }}
//                     >
//                       Unit: {item.unit || "Pack"}
//                       {item.batchNumber ? ` | Batch: ${item.batchNumber}` : ""}
//                     </span>
//                   </td>
//                   <td className="text-center py-3">{item.qty}</td>
//                   <td className="text-end py-3 text-muted">
//                     Rs. {Number(item.price).toFixed(2)}
//                   </td>
//                   <td className="text-end py-3 pe-3 fw-bold text-dark">
//                     Rs. {(item.qty * item.price).toFixed(2)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           {/* Financials & Footer Notes */}
//           <Row className="print-avoid-break mt-2">
//             <Col sm={6}>
//               <div
//                 className="p-3 bg-light rounded-1 h-100 border text-muted small lh-base"
//                 style={{ borderColor: "#D5D9D9" }}
//               >
//                 <strong className="text-dark d-block mb-1">
//                   Important Information:
//                 </strong>
//                 Please retain this receipt for your records. For any return or
//                 exchange, this invoice is mandatory. Note that consumable or
//                 unsealed medicines cannot be returned as per company policy.
//               </div>
//             </Col>
//             <Col sm={6}>
//               <div
//                 className="ms-auto"
//                 style={{ width: "100%", maxWidth: "300px" }}
//               >
//                 <Table borderless size="sm" className="text-end mb-0 small">
//                   <tbody>
//                     <tr>
//                       <td className="text-muted pb-2">Items Subtotal:</td>
//                       <td className="pb-2 text-dark fw-medium">
//                         Rs. {order.itemsPrice?.toFixed(2)}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="text-muted pb-2">Shipping & Handling:</td>
//                       <td className="pb-2 text-dark fw-medium">
//                         {order.shippingPrice === 0
//                           ? "FREE"
//                           : `Rs. ${order.shippingPrice?.toFixed(2)}`}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="text-muted pb-3 border-bottom">
//                         Tax (13%):
//                       </td>
//                       <td className="pb-3 border-bottom text-dark fw-medium">
//                         Rs. {order.taxPrice?.toFixed(2)}
//                       </td>
//                     </tr>
//                     <tr className="fs-5">
//                       <td className="pt-3 fw-bold text-dark">Grand Total:</td>
//                       <td className="pt-3 fw-bold" style={{ color: "#B12704" }}>
//                         Rs. {order.totalPrice?.toLocaleString()}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </div>
//             </Col>
//           </Row>

//           <div className="text-center mt-5 pt-4 border-top text-muted small d-print-block">
//             Thank you for trusting SmartPharmacy! Wishing you good health.
//           </div>
//         </div>

//         {/* Action Buttons (Hidden on Print) */}
//         <div
//           className="d-grid gap-3 d-print-none mt-4 mx-auto"
//           style={{ maxWidth: "400px" }}
//         >
//           <Button
//             variant="outline-dark"
//             className="rounded-1 fw-bold py-2 d-flex justify-content-center align-items-center bg-white shadow-sm"
//             style={{ borderColor: "#D5D9D9" }}
//             onClick={() => window.print()}
//           >
//             <Download size={18} className="me-2" /> Download / Print Invoice
//           </Button>

//           <Button
//             className="rounded-1 fw-bold py-2 shadow-sm d-flex justify-content-center align-items-center border-0"
//             style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
//             onClick={() => navigate("/orders")}
//           >
//             Return to My Orders <ArrowRight size={18} className="ms-2" />
//           </Button>
//         </div>
//       </Container>

//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; opacity: 0; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         .animate-pulse { animation: pulse 2s infinite; }
//         @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

//         /* ✅ BULLETPROOF PRINT STYLES */
//         @media print {
//           /* Force colors to print (fixes missing background on badges/headers) */
//           * {
//             -webkit-print-color-adjust: exact !important;
//             print-color-adjust: exact !important;
//           }

//           /* Hide navigation bars, footers, headers, and our custom action buttons */
//           nav, header, footer, .d-print-none, .navbar {
//             display: none !important;
//           }

//           /* Reset the background color of the whole page so it doesn't waste ink */
//           body, html, .print-page-bg {
//             background-color: white !important;
//             margin: 0 !important;
//             padding: 0 !important;
//           }

//           /* Remove container constraints so the receipt naturally fills the paper */
//           .print-container {
//             max-width: 100% !important;
//             width: 100% !important;
//             padding: 0 !important;
//             margin: 0 !important;
//           }

//           /* Strip outer padding and borders on print to look exactly like an A4 document */
//           .printable-receipt {
//             border: none !important;
//             box-shadow: none !important;
//             padding: 0 !important;
//             margin: 0 auto !important;
//             width: 100% !important;
//             max-width: none !important;
//           }

//           /* Maintain the internal borders for the table */
//           .print-table {
//             border: 1px solid #dee2e6 !important;
//           }

//           /* Prevent table rows and the final total block from splitting across pages */
//           tr, .print-avoid-break {
//             page-break-inside: avoid !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PaymentSuccess;

// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Card,
//   Button,
//   Badge,
//   Spinner,
//   Row,
//   Col,
//   Table,
// } from "react-bootstrap";
// import { Link, useSearchParams, useNavigate } from "react-router-dom";
// import {
//   CheckCircle,
//   XCircle,
//   Download,
//   ArrowRight,
//   Clock,
//   Building,
// } from "lucide-react";
// import axios from "axios";

// const PaymentSuccess = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [order, setOrder] = useState(null);
//   const [countdown, setCountdown] = useState(15);

//   const pidx = searchParams.get("pidx");
//   const khaltiStatus = searchParams.get("status");
//   const transactionId = searchParams.get("transaction_id");
//   const urlOrderId =
//     searchParams.get("id") ||
//     searchParams.get("order_id") ||
//     searchParams.get("purchase_order_id") ||
//     searchParams.get("orderId");

//   useEffect(() => {
//     let isMounted = true;

//     const processPaymentAndFetchOrder = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         const token = localStorage.getItem("token");
//         const config = {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         if (pidx) {
//           if (khaltiStatus === "Completed") {
//             try {
//               await axios.post(
//                 "http://localhost:5000/api/payments/khalti-lookup",
//                 { pidx },
//                 config,
//               );

//               await axios.put(
//                 `http://localhost:5000/api/orders/${urlOrderId}/pay`,
//                 {
//                   id: transactionId || pidx,
//                   status: "COMPLETED",
//                   update_time: new Date().toISOString(),
//                   email_address: "khalti_wallet_user",
//                 },
//                 config,
//               );

//               const finalOrderRes = await axios.get(
//                 `http://localhost:5000/api/orders/${urlOrderId}`,
//                 config,
//               );
//               if (isMounted) setOrder(finalOrderRes.data);
//             } catch (khaltiErr) {
//               console.error("Khalti Verification Error:", khaltiErr);
//               if (isMounted)
//                 setError(
//                   "Payment successful, but failed to update receipt. Please contact support.",
//                 );
//             }
//           } else {
//             if (isMounted)
//               setError(
//                 `Khalti Payment Status: ${khaltiStatus || "Failed/Cancelled"}`,
//               );
//           }
//         } else if (urlOrderId) {
//           const { data } = await axios.get(
//             `http://localhost:5000/api/orders/${urlOrderId}`,
//             config,
//           );
//           if (isMounted) setOrder(data);
//         } else {
//           if (isMounted) setError("No order reference found in URL.");
//         }
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         if (isMounted) {
//           setError(
//             err.response?.data?.message ||
//               err.message ||
//               "Failed to load receipt.",
//           );
//         }
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     if (!order) {
//       processPaymentAndFetchOrder();
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [pidx, khaltiStatus, transactionId, urlOrderId, order]);

//   useEffect(() => {
//     if (order && !error && !isLoading) {
//       const timer = setInterval(() => {
//         setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
//       }, 1000);

//       const redirect = setTimeout(() => {
//         navigate("/orders");
//       }, 15000);

//       return () => {
//         clearInterval(timer);
//         clearTimeout(redirect);
//       };
//     }
//   }, [order, error, isLoading, navigate]);

//   if (isLoading) {
//     return (
//       <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
//         <Spinner
//           animation="border"
//           style={{ color: "#007185", width: "3rem", height: "3rem" }}
//         />
//         <h5 className="mt-3 text-muted animate-pulse">
//           Securing your receipt...
//         </h5>
//       </Container>
//     );
//   }

//   if (error && !order) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center min-vh-100">
//         <Card
//           className="border-0 shadow-lg rounded-4 text-center p-5"
//           style={{ maxWidth: "500px" }}
//         >
//           <div className="mb-3 text-danger">
//             <XCircle size={64} />
//           </div>
//           <h3 className="fw-bold text-danger mb-3">Payment Notice</h3>
//           <p className="text-muted mb-4">{error}</p>
//           <div className="d-grid gap-2">
//             <Link to="/orders" className="btn btn-primary rounded-1">
//               View My Orders
//             </Link>
//           </div>
//         </Card>
//       </Container>
//     );
//   }

//   if (!order) return null;

//   const isPaid = order.isPaid;
//   const isCOD = order.paymentMethod === "COD";

//   // ✅ SAFELY CALCULATE SUBTOTAL IF BACKEND MISSES IT
//   const calculatedSubtotal =
//     order.itemsPrice ||
//     order.orderItems?.reduce((acc, item) => acc + item.price * item.qty, 0) ||
//     0;

//   let statusIcon = <CheckCircle size={48} strokeWidth={3} />;
//   let statusColor = "text-success";
//   let title = "Payment Successful!";
//   let subtitle = "Thank you for your purchase. Your order is being processed.";

//   if (!isPaid && !isCOD) {
//     statusIcon = <Clock size={48} strokeWidth={3} />;
//     statusColor = "text-warning";
//     title = "Payment Pending / Failed";
//     subtitle = "Your order is placed but awaiting payment confirmation.";
//   } else if (!isPaid && isCOD) {
//     title = "Order Confirmed!";
//     subtitle = "Your order is placed. Please keep cash ready upon delivery.";
//   }

//   return (
//     <div
//       className="print-page-bg"
//       style={{
//         backgroundColor: "#f0f2f2",
//         minHeight: "100vh",
//         padding: "40px 0",
//       }}
//     >
//       {/* ✅ FIXED LAYOUT: Changed to flex-column so elements stack vertically */}
//       <Container className="d-flex flex-column align-items-center animate-fade-in print-container">
//         {/* Success Notice Header (Hidden on Print) */}
//         <div className="text-center mb-4 d-print-none">
//           <div className={`${statusColor} mb-3`}>{statusIcon}</div>
//           <h2 className="fw-bold mb-2 text-dark">{title}</h2>
//           <p className="text-muted px-3 mb-3">{subtitle}</p>

//           <div className="d-inline-block px-4 py-2 rounded-pill bg-white border shadow-sm text-muted small fw-medium">
//             Redirecting to orders in{" "}
//             <span className="fw-bold text-danger fs-6 mx-1">{countdown}</span>{" "}
//             seconds
//           </div>
//         </div>

//         {/* REAL WORLD RECEIPT/INVOICE UI */}
//         <div
//           className="bg-white border p-4 p-md-5 shadow-sm printable-receipt w-100"
//           style={{ maxWidth: "800px", borderColor: "#D5D9D9" }}
//         >
//           {/* Invoice Header */}
//           <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start border-bottom pb-4 mb-4">
//             <div className="mb-3 mb-sm-0">
//               <h2
//                 className="fw-bold mb-1 d-flex align-items-center gap-2"
//                 style={{ color: "#0F1111", letterSpacing: "-0.5px" }}
//               >
//                 <Building size={28} style={{ color: "#007185" }} />{" "}
//                 SmartPharmacy
//               </h2>
//               <p className="text-muted small mb-0 mt-2">
//                 123 Health Avenue, Medical District
//               </p>
//               <p className="text-muted small mb-0">Bagmati Province, Nepal</p>
//               <p className="text-muted small mb-0">
//                 support@smartpharmacy.com | +977-1234567890
//               </p>
//             </div>
//             <div className="text-sm-end text-start">
//               <h1
//                 className="fw-bold text-uppercase mb-1"
//                 style={{
//                   color: "#565959",
//                   letterSpacing: "2px",
//                   fontSize: "2rem",
//                 }}
//               >
//                 Receipt
//               </h1>
//               <p className="mb-1 text-dark small">
//                 <span className="fw-bold text-muted me-2">Order #:</span>
//                 <span className="font-monospace">
//                   {order.orderNumber || order._id.slice(-8).toUpperCase()}
//                 </span>
//               </p>
//               <p className="mb-0 text-dark small">
//                 <span className="fw-bold text-muted me-2">Date:</span>
//                 {new Date(order.createdAt).toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </p>
//             </div>
//           </div>

//           {/* Customer & Address Grid */}
//           <Row className="mb-5 g-4">
//             <Col sm={4}>
//               <h6
//                 className="text-muted text-uppercase small fw-bold mb-2"
//                 style={{ letterSpacing: "0.5px" }}
//               >
//                 Billed To:
//               </h6>
//               <div className="fw-bold text-dark fs-6">
//                 {order.user?.name || "Customer"}
//               </div>
//               <div className="small text-muted">{order.user?.email}</div>
//             </Col>

//             <Col sm={4}>
//               <h6
//                 className="text-muted text-uppercase small fw-bold mb-2"
//                 style={{ letterSpacing: "0.5px" }}
//               >
//                 Shipped To:
//               </h6>
//               <div className="small text-dark lh-base">
//                 <span className="fw-bold">
//                   {order.user?.name || "Customer"}
//                 </span>
//                 <br />
//                 {order.shippingAddress?.address}
//                 <br />
//                 {order.shippingAddress?.city}, {order.shippingAddress?.country}
//                 <br />
//                 {order.shippingAddress?.postalCode}
//               </div>
//             </Col>

//             <Col sm={4} className="text-sm-end mt-4 mt-sm-0">
//               <h6
//                 className="text-muted text-uppercase small fw-bold mb-2"
//                 style={{ letterSpacing: "0.5px" }}
//               >
//                 Payment Details:
//               </h6>
//               <div className="small mb-2">
//                 <span className="text-muted me-2">Method:</span>
//                 <span className="fw-bold text-dark">{order.paymentMethod}</span>
//               </div>
//               <div className="small">
//                 <span className="text-muted me-2">Status:</span>
//                 <Badge
//                   bg={isPaid ? "success" : isCOD ? "info" : "secondary"}
//                   text={isPaid || isCOD ? "white" : "dark"}
//                   className="rounded-1 print-badge px-2 py-1"
//                 >
//                   {isPaid ? "PAID" : isCOD ? "PENDING (COD)" : "UNPAID"}
//                 </Badge>
//               </div>
//             </Col>
//           </Row>

//           {/* Itemized Table */}
//           <Table
//             bordered
//             hover
//             responsive
//             size="sm"
//             className="mb-4 print-table border-secondary-subtle"
//           >
//             <thead style={{ backgroundColor: "#f8f9fa" }}>
//               <tr className="text-uppercase small text-muted">
//                 <th className="py-2 px-3 fw-bold border-bottom-0">
//                   Description
//                 </th>
//                 <th
//                   className="py-2 text-center fw-bold border-bottom-0"
//                   width="12%"
//                 >
//                   Qty
//                 </th>
//                 <th
//                   className="py-2 text-end fw-bold border-bottom-0"
//                   width="20%"
//                 >
//                   Unit Price
//                 </th>
//                 <th
//                   className="py-2 text-end pe-3 fw-bold border-bottom-0"
//                   width="20%"
//                 >
//                   Amount
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="small align-middle">
//               {order.orderItems?.map((item, index) => (
//                 <tr key={index} className="print-row">
//                   <td className="py-3 px-3">
//                     <span
//                       className="fw-bold d-block text-dark"
//                       style={{ fontSize: "0.9rem" }}
//                     >
//                       {item.name}
//                     </span>
//                     <span
//                       className="text-muted"
//                       style={{ fontSize: "0.75rem" }}
//                     >
//                       Unit: {item.unit || "Pack"}
//                       {item.batchNumber ? ` | Batch: ${item.batchNumber}` : ""}
//                     </span>
//                   </td>
//                   <td className="text-center py-3">{item.qty}</td>
//                   <td className="text-end py-3 text-muted">
//                     Rs. {Number(item.price).toFixed(2)}
//                   </td>
//                   <td className="text-end py-3 pe-3 fw-bold text-dark">
//                     Rs. {(item.qty * item.price).toFixed(2)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           {/* Financials & Footer Notes */}
//           <Row className="print-avoid-break mt-2">
//             <Col sm={6}>
//               <div
//                 className="p-3 bg-light rounded-1 h-100 border text-muted small lh-base"
//                 style={{ borderColor: "#D5D9D9" }}
//               >
//                 <strong className="text-dark d-block mb-1">
//                   Important Information:
//                 </strong>
//                 Please retain this receipt for your records. For any return or
//                 exchange, this invoice is mandatory. Note that consumable or
//                 unsealed medicines cannot be returned as per company policy.
//               </div>
//             </Col>
//             <Col sm={6}>
//               <div
//                 className="ms-auto mt-4 mt-sm-0"
//                 style={{ width: "100%", maxWidth: "300px" }}
//               >
//                 <Table borderless size="sm" className="text-end mb-0 small">
//                   <tbody>
//                     <tr>
//                       <td className="text-muted pb-2">Items Subtotal:</td>
//                       {/* ✅ Fixed: Shows actual calculated subtotal */}
//                       <td className="pb-2 text-dark fw-medium">
//                         Rs. {calculatedSubtotal.toFixed(2)}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="text-muted pb-2">Shipping & Handling:</td>
//                       <td className="pb-2 text-dark fw-medium">
//                         {order.shippingPrice === 0
//                           ? "FREE"
//                           : `Rs. ${order.shippingPrice?.toFixed(2) || "0.00"}`}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="text-muted pb-3 border-bottom">
//                         Tax (13%):
//                       </td>
//                       <td className="pb-3 border-bottom text-dark fw-medium">
//                         Rs. {order.taxPrice?.toFixed(2) || "0.00"}
//                       </td>
//                     </tr>
//                     <tr className="fs-5">
//                       <td className="pt-3 fw-bold text-dark">Grand Total:</td>
//                       {/* ✅ Fixed: Strictly enforces 2 decimal places */}
//                       <td className="pt-3 fw-bold" style={{ color: "#B12704" }}>
//                         Rs.{" "}
//                         {order.totalPrice?.toLocaleString("en-US", {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </div>
//             </Col>
//           </Row>

//           <div className="text-center mt-5 pt-4 border-top text-muted small d-print-block">
//             Thank you for trusting SmartPharmacy! Wishing you good health.
//           </div>
//         </div>

//         {/* Action Buttons - Now properly stacked below the receipt! */}
//         <div
//           className="d-flex flex-column flex-sm-row justify-content-center gap-3 d-print-none mt-2 w-100"
//           style={{ maxWidth: "800px" }}
//         >
//           <Button
//             variant="outline-dark"
//             className="rounded-1 fw-bold px-4 py-2 bg-white shadow-sm border"
//             style={{ borderColor: "#D5D9D9" }}
//             onClick={() => window.print()}
//           >
//             <Download size={18} className="me-2" /> Download Invoice
//           </Button>

//           <Button
//             className="rounded-1 fw-bold px-4 py-2 shadow-sm border-0 d-flex align-items-center justify-content-center"
//             style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
//             onClick={() => navigate("/orders")}
//           >
//             Return to My Orders <ArrowRight size={18} className="ms-2" />
//           </Button>
//         </div>
//       </Container>

//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; opacity: 0; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         .animate-pulse { animation: pulse 2s infinite; }
//         @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

//         /* ✅ BULLETPROOF PRINT STYLES */
//         @media print {
//           * {
//             -webkit-print-color-adjust: exact !important;
//             print-color-adjust: exact !important;
//           }

//           nav, header, footer, .d-print-none, .navbar {
//             display: none !important;
//           }

//           body, html, .print-page-bg {
//             background-color: white !important;
//             margin: 0 !important;
//             padding: 0 !important;
//           }

//           .print-container {
//             max-width: 100% !important;
//             width: 100% !important;
//             padding: 0 !important;
//             margin: 0 !important;
//             display: block !important; /* Disables flexbox for printing to prevent shrinking */
//           }

//           .printable-receipt {
//             border: none !important;
//             box-shadow: none !important;
//             padding: 0 !important;
//             margin: 0 auto !important;
//             width: 100% !important;
//             max-width: none !important;
//           }

//           .print-table {
//             border: 1px solid #dee2e6 !important;
//           }

//           tr, .print-avoid-break {
//             page-break-inside: avoid !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PaymentSuccess;

// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Card,
//   Button,
//   Badge,
//   Spinner,
//   Row,
//   Col,
//   Table,
// } from "react-bootstrap";
// import { Link, useSearchParams, useNavigate } from "react-router-dom";
// import {
//   CheckCircle,
//   XCircle,
//   Download,
//   ArrowRight,
//   Receipt,
//   MapPin,
//   User,
//   Clock,
//   Building,
// } from "lucide-react";
// import axios from "axios";

// const PaymentSuccess = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [order, setOrder] = useState(null);
//   const [countdown, setCountdown] = useState(15);

//   // Safely extract all possible URL parameters
//   const pidx = searchParams.get("pidx");
//   const khaltiStatus = searchParams.get("status");
//   const transactionId = searchParams.get("transaction_id");
//   const urlOrderId =
//     searchParams.get("id") ||
//     searchParams.get("order_id") ||
//     searchParams.get("purchase_order_id") ||
//     searchParams.get("orderId");

//   useEffect(() => {
//     let isMounted = true;

//     const processPaymentAndFetchOrder = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         const token = localStorage.getItem("token");
//         const config = {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         // --- SCENARIO A: KHALTI REDIRECT ---
//         if (pidx) {
//           if (khaltiStatus === "Completed" || !khaltiStatus) {
//             try {
//               // 1. Lookup Khalti Payment
//               const { data } = await axios.post(
//                 "http://localhost:5000/api/payments/khalti-lookup",
//                 { pidx },
//                 config,
//               );

//               // 2. Identify the Order ID (Fallback to data.order._id if URL misses it)
//               const actualOrderId =
//                 urlOrderId || (data.order && data.order._id) || data.orderId;

//               if (actualOrderId) {
//                 // 3. Mark as Paid in Database
//                 await axios.put(
//                   `http://localhost:5000/api/orders/${actualOrderId}/pay`,
//                   {
//                     id: transactionId || pidx,
//                     status: "COMPLETED",
//                     update_time: new Date().toISOString(),
//                     email_address: "khalti_wallet_user",
//                   },
//                   config,
//                 );

//                 // 4. Fetch the fully updated order for the receipt
//                 const finalOrderRes = await axios.get(
//                   `http://localhost:5000/api/orders/${actualOrderId}`,
//                   config,
//                 );
//                 if (isMounted) setOrder(finalOrderRes.data);
//               } else {
//                 if (isMounted)
//                   setError(
//                     "Payment verified, but could not locate the associated order.",
//                   );
//               }
//             } catch (khaltiErr) {
//               console.error("Khalti Verification Error:", khaltiErr);
//               // Fallback: If Khalti fails but we have the order ID, just fetch the order anyway
//               if (urlOrderId && isMounted) {
//                 const fallbackRes = await axios.get(
//                   `http://localhost:5000/api/orders/${urlOrderId}`,
//                   config,
//                 );
//                 setOrder(fallbackRes.data);
//               } else if (isMounted) {
//                 setError(
//                   "Payment successful, but failed to sync receipt with database. Please contact support.",
//                 );
//               }
//             }
//           } else {
//             if (isMounted)
//               setError(
//                 `Khalti Payment Status: ${khaltiStatus || "Failed/Cancelled"}`,
//               );
//           }
//         }

//         // --- SCENARIO B: STRIPE, COD, OR DIRECT HISTORY VIEW ---
//         else if (urlOrderId) {
//           const { data } = await axios.get(
//             `http://localhost:5000/api/orders/${urlOrderId}`,
//             config,
//           );
//           if (isMounted) setOrder(data);
//         }

//         // --- SCENARIO C: NO PARAMETERS FOUND ---
//         else {
//           if (isMounted)
//             setError(
//               "No order reference found in URL. Please check your order history.",
//             );
//         }
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         if (isMounted) {
//           setError(
//             err.response?.data?.message ||
//               err.message ||
//               "Failed to load receipt.",
//           );
//         }
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     if (!order) {
//       processPaymentAndFetchOrder();
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [pidx, khaltiStatus, transactionId, urlOrderId, order]);

//   // Auto-redirect countdown
//   useEffect(() => {
//     if (order && !error && !isLoading) {
//       const timer = setInterval(() => {
//         setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
//       }, 1000);

//       const redirect = setTimeout(() => {
//         navigate("/orders");
//       }, 15000);

//       return () => {
//         clearInterval(timer);
//         clearTimeout(redirect);
//       };
//     }
//   }, [order, error, isLoading, navigate]);

//   // --- RENDER: LOADING ---
//   if (isLoading) {
//     return (
//       <div
//         className="d-flex flex-column justify-content-center align-items-center min-vh-100"
//         style={{ backgroundColor: "#f0f2f2" }}
//       >
//         <Spinner
//           animation="border"
//           style={{ color: "#007185", width: "3rem", height: "3rem" }}
//         />
//         <h5 className="mt-3 text-muted animate-pulse">
//           Securing your receipt...
//         </h5>
//       </div>
//     );
//   }

//   // --- RENDER: ERROR ---
//   if (error && !order) {
//     return (
//       <div
//         style={{
//           backgroundColor: "#f0f2f2",
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <Container className="d-flex justify-content-center align-items-center">
//           <Card
//             className="border-0 shadow-sm rounded-1 text-center p-5 bg-white"
//             style={{ maxWidth: "500px", width: "100%" }}
//           >
//             <div className="mb-3 text-danger">
//               <XCircle size={64} />
//             </div>
//             <h3 className="fw-bold text-danger mb-3">Payment Notice</h3>
//             <p className="text-muted mb-4">{error}</p>
//             <div className="d-grid gap-2">
//               <Link
//                 to="/orders"
//                 className="btn rounded-1 fw-bold text-white shadow-sm py-2"
//                 style={{ backgroundColor: "#007185" }}
//               >
//                 View My Orders
//               </Link>
//             </div>
//           </Card>
//         </Container>
//       </div>
//     );
//   }

//   if (!order) return null;

//   // ----------------------------------------------------
//   // FINANCIAL CALCULATIONS (Strict Formatting)
//   // ----------------------------------------------------
//   const isPaid = order.isPaid;
//   const isCOD = order.paymentMethod === "COD";

//   // Force strict number fallback in case backend misses itemsPrice
//   const itemsPriceNum = Number(order.itemsPrice);
//   const calculatedSubtotal =
//     itemsPriceNum > 0
//       ? itemsPriceNum
//       : order.orderItems?.reduce(
//           (sum, item) => sum + Number(item.price) * Number(item.qty),
//           0,
//         ) || 0;

//   const shipping = Number(order.shippingPrice) || 0;
//   const tax = Number(order.taxPrice) || 0;
//   const total = Number(order.totalPrice) || 0;

//   let statusIcon = <CheckCircle size={48} strokeWidth={3} />;
//   let statusColor = "text-success";
//   let title = "Payment Successful!";
//   let subtitle = "Thank you for your purchase. Your order is being processed.";

//   if (!isPaid && !isCOD) {
//     statusIcon = <Clock size={48} strokeWidth={3} />;
//     statusColor = "text-warning";
//     title = "Payment Pending / Failed";
//     subtitle = "Your order is placed but awaiting payment confirmation.";
//   } else if (!isPaid && isCOD) {
//     title = "Order Confirmed!";
//     subtitle = "Your order is placed. Please keep cash ready upon delivery.";
//   }

//   return (
//     <div
//       className="print-page-bg"
//       style={{
//         backgroundColor: "#f0f2f2",
//         minHeight: "100vh",
//         padding: "40px 0",
//       }}
//     >
//       {/* ✅ FIXED LAYOUT: d-flex flex-column forces the items to stack vertically instead of side-by-side */}
//       <Container className="d-flex flex-column align-items-center animate-fade-in print-container">
//         {/* Success Notice Header (Hidden on Print) */}
//         <div className="text-center mb-4 d-print-none w-100">
//           <div className={`${statusColor} mb-3`}>{statusIcon}</div>
//           <h2 className="fw-bold mb-2 text-dark">{title}</h2>
//           <p className="text-muted px-3 mb-3">{subtitle}</p>

//           <div className="d-inline-block px-4 py-2 rounded-pill bg-white border shadow-sm text-muted small fw-medium">
//             Redirecting to orders in{" "}
//             <span className="fw-bold text-danger fs-6 mx-1">{countdown}</span>{" "}
//             seconds
//           </div>
//         </div>

//         {/* REAL WORLD RECEIPT/INVOICE UI */}
//         <div
//           className="bg-white border p-4 p-md-5 shadow-sm printable-receipt w-100"
//           style={{ maxWidth: "800px", borderColor: "#D5D9D9" }}
//         >
//           {/* Invoice Header */}
//           <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start border-bottom pb-4 mb-4">
//             <div className="mb-3 mb-sm-0">
//               <h2
//                 className="fw-bold mb-1 d-flex align-items-center gap-2"
//                 style={{ color: "#0F1111", letterSpacing: "-0.5px" }}
//               >
//                 <Building size={28} style={{ color: "#007185" }} />{" "}
//                 SmartPharmacy
//               </h2>
//               <p className="text-muted small mb-0 mt-2">
//                 123 Health Avenue, Medical District
//               </p>
//               <p className="text-muted small mb-0">Bagmati Province, Nepal</p>
//               <p className="text-muted small mb-0">
//                 support@smartpharmacy.com | +977-1234567890
//               </p>
//             </div>
//             <div className="text-sm-end text-start">
//               <h1
//                 className="fw-bold text-uppercase mb-1"
//                 style={{
//                   color: "#565959",
//                   letterSpacing: "2px",
//                   fontSize: "2rem",
//                 }}
//               >
//                 Receipt
//               </h1>
//               <p className="mb-1 text-dark small">
//                 <span className="fw-bold text-muted me-2">Order #:</span>
//                 <span className="font-monospace">
//                   {order.orderNumber || order._id.slice(-8).toUpperCase()}
//                 </span>
//               </p>
//               <p className="mb-0 text-dark small">
//                 <span className="fw-bold text-muted me-2">Date:</span>
//                 {new Date(order.createdAt).toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </p>
//             </div>
//           </div>

//           {/* Customer & Address Grid */}
//           <Row className="mb-5 g-4">
//             <Col sm={4}>
//               <h6
//                 className="text-muted text-uppercase small fw-bold mb-2"
//                 style={{ letterSpacing: "0.5px" }}
//               >
//                 Billed To:
//               </h6>
//               <div className="fw-bold text-dark fs-6">
//                 {order.user?.name || "Customer"}
//               </div>
//               <div className="small text-muted">{order.user?.email}</div>
//             </Col>

//             <Col sm={4}>
//               <h6
//                 className="text-muted text-uppercase small fw-bold mb-2"
//                 style={{ letterSpacing: "0.5px" }}
//               >
//                 Shipped To:
//               </h6>
//               <div className="small text-dark lh-base">
//                 <span className="fw-bold">
//                   {order.user?.name || "Customer"}
//                 </span>
//                 <br />
//                 {order.shippingAddress?.address}
//                 <br />
//                 {order.shippingAddress?.city}, {order.shippingAddress?.country}
//                 <br />
//                 {order.shippingAddress?.postalCode}
//               </div>
//             </Col>

//             <Col sm={4} className="text-sm-end mt-4 mt-sm-0">
//               <h6
//                 className="text-muted text-uppercase small fw-bold mb-2"
//                 style={{ letterSpacing: "0.5px" }}
//               >
//                 Payment Details:
//               </h6>
//               <div className="small mb-2">
//                 <span className="text-muted me-2">Method:</span>
//                 <span className="fw-bold text-dark">{order.paymentMethod}</span>
//               </div>
//               <div className="small">
//                 <span className="text-muted me-2">Status:</span>
//                 <Badge
//                   bg={isPaid ? "success" : isCOD ? "info" : "secondary"}
//                   text={isPaid || isCOD ? "white" : "dark"}
//                   className="rounded-1 print-badge px-2 py-1"
//                 >
//                   {isPaid ? "PAID" : isCOD ? "PENDING (COD)" : "UNPAID"}
//                 </Badge>
//               </div>
//             </Col>
//           </Row>

//           {/* Itemized Table */}
//           <Table
//             bordered
//             hover
//             responsive
//             size="sm"
//             className="mb-4 print-table border-secondary-subtle"
//           >
//             <thead style={{ backgroundColor: "#f8f9fa" }}>
//               <tr className="text-uppercase small text-muted">
//                 <th className="py-2 px-3 fw-bold border-bottom-0">
//                   Description
//                 </th>
//                 <th
//                   className="py-2 text-center fw-bold border-bottom-0"
//                   width="12%"
//                 >
//                   Qty
//                 </th>
//                 <th
//                   className="py-2 text-end fw-bold border-bottom-0"
//                   width="20%"
//                 >
//                   Unit Price
//                 </th>
//                 <th
//                   className="py-2 text-end pe-3 fw-bold border-bottom-0"
//                   width="20%"
//                 >
//                   Amount
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="small align-middle">
//               {order.orderItems?.map((item, index) => (
//                 <tr key={index} className="print-row">
//                   <td className="py-3 px-3">
//                     <span
//                       className="fw-bold d-block text-dark"
//                       style={{ fontSize: "0.9rem" }}
//                     >
//                       {item.name}
//                     </span>
//                     <span
//                       className="text-muted"
//                       style={{ fontSize: "0.75rem" }}
//                     >
//                       Unit: {item.unit || "Pack"}
//                       {item.batchNumber ? ` | Batch: ${item.batchNumber}` : ""}
//                     </span>
//                   </td>
//                   <td className="text-center py-3">{item.qty}</td>
//                   <td className="text-end py-3 text-muted">
//                     Rs. {Number(item.price).toFixed(2)}
//                   </td>
//                   <td className="text-end py-3 pe-3 fw-bold text-dark">
//                     Rs. {(item.qty * item.price).toFixed(2)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           {/* Financials & Footer Notes */}
//           <Row className="print-avoid-break mt-2">
//             <Col sm={6}>
//               <div
//                 className="p-3 bg-light rounded-1 h-100 border text-muted small lh-base"
//                 style={{ borderColor: "#D5D9D9" }}
//               >
//                 <strong className="text-dark d-block mb-1">
//                   Important Information:
//                 </strong>
//                 Please retain this receipt for your records. For any return or
//                 exchange, this invoice is mandatory. Note that consumable or
//                 unsealed medicines cannot be returned as per company policy.
//               </div>
//             </Col>
//             <Col sm={6}>
//               <div
//                 className="ms-auto mt-4 mt-sm-0"
//                 style={{ width: "100%", maxWidth: "300px" }}
//               >
//                 <Table borderless size="sm" className="text-end mb-0 small">
//                   <tbody>
//                     <tr>
//                       <td className="text-muted pb-2">Items Subtotal:</td>
//                       {/* ✅ Fixed: Shows actual calculated subtotal */}
//                       <td className="pb-2 text-dark fw-medium">
//                         Rs. {calculatedSubtotal.toFixed(2)}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="text-muted pb-2">Shipping & Handling:</td>
//                       <td className="pb-2 text-dark fw-medium">
//                         {shipping === 0 ? "FREE" : `Rs. ${shipping.toFixed(2)}`}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="text-muted pb-3 border-bottom">
//                         Tax (13%):
//                       </td>
//                       <td className="pb-3 border-bottom text-dark fw-medium">
//                         Rs. {tax.toFixed(2)}
//                       </td>
//                     </tr>
//                     <tr className="fs-5">
//                       <td className="pt-3 fw-bold text-dark">Grand Total:</td>
//                       {/* ✅ Fixed: Strictly enforces 2 decimal places */}
//                       <td className="pt-3 fw-bold" style={{ color: "#B12704" }}>
//                         Rs.{" "}
//                         {total.toLocaleString("en-US", {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </div>
//             </Col>
//           </Row>

//           <div className="text-center mt-5 pt-4 border-top text-muted small d-print-block">
//             Thank you for trusting SmartPharmacy! Wishing you good health.
//           </div>
//         </div>

//         {/* ✅ FIXED LAYOUT: Action Buttons now stack horizontally under the receipt instead of next to it */}
//         <div
//           className="d-flex flex-column flex-sm-row justify-content-center gap-3 d-print-none mt-2 w-100"
//           style={{ maxWidth: "800px" }}
//         >
//           <Button
//             variant="outline-dark"
//             className="rounded-1 fw-bold px-4 py-3 bg-white shadow-sm border d-flex align-items-center justify-content-center flex-grow-1"
//             style={{ borderColor: "#D5D9D9" }}
//             onClick={() => window.print()}
//           >
//             <Download size={18} className="me-2" /> Download / Print Invoice
//           </Button>

//           <Button
//             className="rounded-1 fw-bold px-4 py-3 shadow-sm border-0 d-flex align-items-center justify-content-center flex-grow-1"
//             style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
//             onClick={() => navigate("/orders")}
//           >
//             Return to My Orders <ArrowRight size={18} className="ms-2" />
//           </Button>
//         </div>
//       </Container>

//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; opacity: 0; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         .animate-pulse { animation: pulse 2s infinite; }
//         @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

//         /* ✅ BULLETPROOF PRINT STYLES */
//         @media print {
//           * {
//             -webkit-print-color-adjust: exact !important;
//             print-color-adjust: exact !important;
//           }
//           nav, header, footer, .d-print-none, .navbar {
//             display: none !important;
//           }
//           body, html, .print-page-bg {
//             background-color: white !important;
//             margin: 0 !important;
//             padding: 0 !important;
//           }
//           .print-container {
//             max-width: 100% !important;
//             width: 100% !important;
//             padding: 0 !important;
//             margin: 0 !important;
//             display: block !important;
//           }
//           .printable-receipt {
//             border: none !important;
//             box-shadow: none !important;
//             padding: 0 !important;
//             margin: 0 auto !important;
//             width: 100% !important;
//             max-width: none !important;
//           }
//           .print-table {
//             border: 1px solid #dee2e6 !important;
//           }
//           tr, .print-avoid-break {
//             page-break-inside: avoid !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PaymentSuccess;

import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Badge,
  Spinner,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Download,
  ArrowRight,
  Receipt,
  MapPin,
  User,
  Clock,
  Building,
} from "lucide-react";
import axios from "axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [countdown, setCountdown] = useState(15);

  // Safely extract all possible URL parameters
  const pidx = searchParams.get("pidx");
  const khaltiStatus = searchParams.get("status");
  const transactionId = searchParams.get("transaction_id");
  const urlOrderId =
    searchParams.get("id") ||
    searchParams.get("order_id") ||
    searchParams.get("purchase_order_id") ||
    searchParams.get("orderId");

  useEffect(() => {
    let isMounted = true;

    const processPaymentAndFetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        // --- SCENARIO A: KHALTI REDIRECT ---
        if (pidx) {
          if (khaltiStatus === "Completed" || !khaltiStatus) {
            try {
              // 1. Lookup Khalti Payment
              const { data } = await axios.post(
                "http://localhost:5000/api/payments/khalti-lookup",
                { pidx },
                config,
              );

              // 2. Identify the Order ID (Fallback to data.order._id if URL misses it)
              const actualOrderId =
                urlOrderId || (data.order && data.order._id) || data.orderId;

              if (actualOrderId) {
                // 3. Mark as Paid in Database
                await axios.put(
                  `http://localhost:5000/api/orders/${actualOrderId}/pay`,
                  {
                    id: transactionId || pidx,
                    status: "COMPLETED",
                    update_time: new Date().toISOString(),
                    email_address: "khalti_wallet_user",
                  },
                  config,
                );

                // 4. Fetch the fully updated order for the receipt
                const finalOrderRes = await axios.get(
                  `http://localhost:5000/api/orders/${actualOrderId}`,
                  config,
                );
                if (isMounted) setOrder(finalOrderRes.data);
              } else {
                if (isMounted)
                  setError(
                    "Payment verified, but could not locate the associated order.",
                  );
              }
            } catch (khaltiErr) {
              console.error("Khalti Verification Error:", khaltiErr);
              // Fallback: If Khalti fails but we have the order ID, just fetch the order anyway
              if (urlOrderId && isMounted) {
                const fallbackRes = await axios.get(
                  `http://localhost:5000/api/orders/${urlOrderId}`,
                  config,
                );
                setOrder(fallbackRes.data);
              } else if (isMounted) {
                setError(
                  "Payment successful, but failed to sync receipt with database. Please contact support.",
                );
              }
            }
          } else {
            if (isMounted)
              setError(
                `Khalti Payment Status: ${khaltiStatus || "Failed/Cancelled"}`,
              );
          }
        }

        // --- SCENARIO B: STRIPE, COD, OR DIRECT HISTORY VIEW ---
        else if (urlOrderId) {
          const { data } = await axios.get(
            `http://localhost:5000/api/orders/${urlOrderId}`,
            config,
          );
          if (isMounted) setOrder(data);
        }

        // --- SCENARIO C: NO PARAMETERS FOUND ---
        else {
          if (isMounted)
            setError(
              "No order reference found in URL. Please check your order history.",
            );
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load receipt.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (!order) {
      processPaymentAndFetchOrder();
    }

    return () => {
      isMounted = false;
    };
  }, [pidx, khaltiStatus, transactionId, urlOrderId, order]);

  // Auto-redirect countdown
  useEffect(() => {
    if (order && !error && !isLoading) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      const redirect = setTimeout(() => {
        navigate("/orders");
      }, 15000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirect);
      };
    }
  }, [order, error, isLoading, navigate]);

  // --- RENDER: LOADING ---
  if (isLoading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center min-vh-100"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <Spinner
          animation="border"
          style={{ color: "#007185", width: "3rem", height: "3rem" }}
        />
        <h5 className="mt-3 text-muted animate-pulse">
          Securing your receipt...
        </h5>
      </div>
    );
  }

  // --- RENDER: ERROR ---
  if (error && !order) {
    return (
      <div
        style={{
          backgroundColor: "#f0f2f2",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container className="d-flex justify-content-center align-items-center">
          <Card
            className="border-0 shadow-sm rounded-1 text-center p-5 bg-white"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <div className="mb-3 text-danger">
              <XCircle size={64} />
            </div>
            <h3 className="fw-bold text-danger mb-3">Payment Notice</h3>
            <p className="text-muted mb-4">{error}</p>
            <div className="d-grid gap-2">
              <Link
                to="/orders"
                className="btn rounded-1 fw-bold text-white shadow-sm py-2"
                style={{ backgroundColor: "#007185" }}
              >
                View My Orders
              </Link>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  if (!order) return null;

  // ----------------------------------------------------
  // FINANCIAL CALCULATIONS (Strict Formatting)
  // ----------------------------------------------------
  const isPaid = order.isPaid;
  const isCOD = order.paymentMethod === "COD";

  // Force strict number fallback in case backend misses itemsPrice
  const itemsPriceNum = Number(order.itemsPrice);
  const calculatedSubtotal =
    itemsPriceNum > 0
      ? itemsPriceNum
      : order.orderItems?.reduce(
          (sum, item) => sum + Number(item.price) * Number(item.qty),
          0,
        ) || 0;

  const shipping = Number(order.shippingPrice) || 0;
  const tax = Number(order.taxPrice) || 0;
  const total = Number(order.totalPrice) || 0;

  let statusIcon = <CheckCircle size={48} strokeWidth={3} />;
  let statusColor = "text-success";
  let title = "Payment Successful!";
  let subtitle = "Thank you for your purchase. Your order is being processed.";

  if (!isPaid && !isCOD) {
    statusIcon = <Clock size={48} strokeWidth={3} />;
    statusColor = "text-warning";
    title = "Payment Pending / Failed";
    subtitle = "Your order is placed but awaiting payment confirmation.";
  } else if (!isPaid && isCOD) {
    title = "Order Confirmed!";
    subtitle = "Your order is placed. Please keep cash ready upon delivery.";
  }

  return (
    <div
      className="print-page-bg"
      style={{
        backgroundColor: "#f0f2f2",
        minHeight: "100vh",
        padding: "40px 0",
      }}
    >
      {/* ✅ FIXED LAYOUT: d-flex flex-column forces the items to stack vertically instead of side-by-side */}
      <Container className="d-flex flex-column align-items-center animate-fade-in print-container">
        {/* Success Notice Header (Hidden on Print) */}
        <div className="text-center mb-4 d-print-none w-100">
          <div className={`${statusColor} mb-3`}>{statusIcon}</div>
          <h2 className="fw-bold mb-2 text-dark">{title}</h2>
          <p className="text-muted px-3 mb-3">{subtitle}</p>

          <div className="d-inline-block px-4 py-2 rounded-pill bg-white border shadow-sm text-muted small fw-medium">
            Redirecting to orders in{" "}
            <span className="fw-bold text-danger fs-6 mx-1">{countdown}</span>{" "}
            seconds
          </div>
        </div>

        {/* REAL WORLD RECEIPT/INVOICE UI */}
        <div
          className="bg-white border p-4 p-md-5 shadow-sm printable-receipt w-100"
          style={{ maxWidth: "800px", borderColor: "#D5D9D9" }}
        >
          {/* Invoice Header */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start border-bottom pb-4 mb-4">
            <div className="mb-3 mb-sm-0">
              <h2
                className="fw-bold mb-1 d-flex align-items-center gap-2"
                style={{ color: "#0F1111", letterSpacing: "-0.5px" }}
              >
                <Building size={28} style={{ color: "#007185" }} />{" "}
                SmartPharmacy
              </h2>
              <p className="text-muted small mb-0 mt-2">
                123 Health Avenue, Medical District
              </p>
              <p className="text-muted small mb-0">Bagmati Province, Nepal</p>
              <p className="text-muted small mb-0">
                support@smartpharmacy.com | +977-1234567890
              </p>
            </div>
            <div className="text-sm-end text-start">
              <h1
                className="fw-bold text-uppercase mb-1"
                style={{
                  color: "#565959",
                  letterSpacing: "2px",
                  fontSize: "2rem",
                }}
              >
                Receipt
              </h1>
              <p className="mb-1 text-dark small">
                <span className="fw-bold text-muted me-2">Order #:</span>
                <span className="font-monospace">
                  {order.orderNumber || order._id.slice(-8).toUpperCase()}
                </span>
              </p>
              <p className="mb-0 text-dark small">
                <span className="fw-bold text-muted me-2">Date:</span>
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Customer & Address Grid */}
          <Row className="mb-5 g-4">
            <Col sm={4}>
              <h6
                className="text-muted text-uppercase small fw-bold mb-2"
                style={{ letterSpacing: "0.5px" }}
              >
                Billed To:
              </h6>
              <div className="fw-bold text-dark fs-6">
                {order.user?.name || "Customer"}
              </div>
              <div className="small text-muted">{order.user?.email}</div>
            </Col>

            <Col sm={4}>
              <h6
                className="text-muted text-uppercase small fw-bold mb-2"
                style={{ letterSpacing: "0.5px" }}
              >
                Shipped To:
              </h6>
              <div className="small text-dark lh-base">
                <span className="fw-bold">
                  {order.user?.name || "Customer"}
                </span>
                <br />
                {order.shippingAddress?.address}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.country}
                <br />
                {order.shippingAddress?.postalCode}
              </div>
            </Col>

            <Col sm={4} className="text-sm-end mt-4 mt-sm-0">
              <h6
                className="text-muted text-uppercase small fw-bold mb-2"
                style={{ letterSpacing: "0.5px" }}
              >
                Payment Details:
              </h6>
              <div className="small mb-2">
                <span className="text-muted me-2">Method:</span>
                <span className="fw-bold text-dark">{order.paymentMethod}</span>
              </div>
              <div className="small">
                <span className="text-muted me-2">Status:</span>
                <Badge
                  bg={isPaid ? "success" : isCOD ? "info" : "secondary"}
                  text={isPaid || isCOD ? "white" : "dark"}
                  className="rounded-1 print-badge px-2 py-1"
                >
                  {isPaid ? "PAID" : isCOD ? "PENDING (COD)" : "UNPAID"}
                </Badge>
              </div>
            </Col>
          </Row>

          {/* Itemized Table */}
          <Table
            bordered
            hover
            responsive
            size="sm"
            className="mb-4 print-table border-secondary-subtle"
          >
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr className="text-uppercase small text-muted">
                <th className="py-2 px-3 fw-bold border-bottom-0">
                  Description
                </th>
                <th
                  className="py-2 text-center fw-bold border-bottom-0"
                  width="12%"
                >
                  Qty
                </th>
                <th
                  className="py-2 text-end fw-bold border-bottom-0"
                  width="20%"
                >
                  Unit Price
                </th>
                <th
                  className="py-2 text-end pe-3 fw-bold border-bottom-0"
                  width="20%"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="small align-middle">
              {order.orderItems?.map((item, index) => (
                <tr key={index} className="print-row">
                  <td className="py-3 px-3">
                    <span
                      className="fw-bold d-block text-dark"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {item.name}
                    </span>
                    <span
                      className="text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Unit: {item.unit || "Pack"}
                      {item.batchNumber ? ` | Batch: ${item.batchNumber}` : ""}
                    </span>
                  </td>
                  <td className="text-center py-3">{item.qty}</td>
                  <td className="text-end py-3 text-muted">
                    Rs. {Number(item.price).toFixed(2)}
                  </td>
                  <td className="text-end py-3 pe-3 fw-bold text-dark">
                    Rs. {(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Financials & Footer Notes */}
          <Row className="print-avoid-break mt-2">
            <Col sm={6}>
              <div
                className="p-3 bg-light rounded-1 h-100 border text-muted small lh-base"
                style={{ borderColor: "#D5D9D9" }}
              >
                <strong className="text-dark d-block mb-1">
                  Important Information:
                </strong>
                Please retain this receipt for your records. For any return or
                exchange, this invoice is mandatory. Note that consumable or
                unsealed medicines cannot be returned as per company policy.
              </div>
            </Col>
            <Col sm={6}>
              <div
                className="ms-auto mt-4 mt-sm-0"
                style={{ width: "100%", maxWidth: "300px" }}
              >
                <Table borderless size="sm" className="text-end mb-0 small">
                  <tbody>
                    <tr>
                      <td className="text-muted pb-2">Items Subtotal:</td>
                      {/* ✅ Fixed: Shows actual calculated subtotal */}
                      <td className="pb-2 text-dark fw-medium">
                        Rs. {calculatedSubtotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted pb-2">Shipping & Handling:</td>
                      <td className="pb-2 text-dark fw-medium">
                        {shipping === 0 ? "FREE" : `Rs. ${shipping.toFixed(2)}`}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted pb-3 border-bottom">
                        Tax (13%):
                      </td>
                      <td className="pb-3 border-bottom text-dark fw-medium">
                        Rs. {tax.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="fs-5">
                      <td className="pt-3 fw-bold text-dark">Grand Total:</td>
                      {/* ✅ Fixed: Strictly enforces 2 decimal places */}
                      <td className="pt-3 fw-bold" style={{ color: "#B12704" }}>
                        Rs.{" "}
                        {total.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>

          <div className="text-center mt-5 pt-4 border-top text-muted small d-print-block">
            Thank you for trusting SmartPharmacy! Wishing you good health.
          </div>
        </div>

        {/* ✅ FIXED LAYOUT: Action Buttons now stack horizontally under the receipt instead of next to it */}
        <div
          className="d-flex flex-column flex-sm-row justify-content-center gap-3 d-print-none mt-2 w-100"
          style={{ maxWidth: "800px" }}
        >
          <Button
            variant="outline-dark"
            className="rounded-1 fw-bold px-4 py-3 bg-white shadow-sm border d-flex align-items-center justify-content-center flex-grow-1"
            style={{ borderColor: "#D5D9D9" }}
            onClick={() => window.print()}
          >
            <Download size={18} className="me-2" /> Download / Print Invoice
          </Button>

          <Button
            className="rounded-1 fw-bold px-4 py-3 shadow-sm border-0 d-flex align-items-center justify-content-center flex-grow-1"
            style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
            onClick={() => navigate("/orders")}
          >
            Return to My Orders <ArrowRight size={18} className="ms-2" />
          </Button>
        </div>
      </Container>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

        /* ✅ BULLETPROOF PRINT STYLES */
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          nav, header, footer, .d-print-none, .navbar {
            display: none !important;
          }
          body, html, .print-page-bg {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-container {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }
          .printable-receipt {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: none !important;
          }
          .print-table {
            border: 1px solid #dee2e6 !important;
          }
          tr, .print-avoid-break {
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
