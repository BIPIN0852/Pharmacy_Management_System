// import React from "react";
// import { Container, Card, Button, Badge } from "react-bootstrap";
// import { Link, useSearchParams } from "react-router-dom";
// import { CheckCircle, Download, ArrowRight, Home } from "lucide-react";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const orderId = searchParams.get("id");
//   const method = searchParams.get("method");
//   const date = new Date().toLocaleDateString();

//   return (
//     <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5">
//       <Card
//         className="border-0 shadow-lg rounded-4 text-center p-5"
//         style={{ maxWidth: "500px", width: "100%" }}
//       >
//         <div className="mb-4">
//           <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-4">
//             <CheckCircle size={64} className="text-success" />
//           </div>
//         </div>

//         <h2 className="fw-bold mb-2">
//           {method === "COD"
//             ? "Order Placed Successfully!"
//             : "Payment Successful!"}
//         </h2>
//         <p className="text-muted mb-4">
//           {method === "COD"
//             ? "Your order has been received. Please pay cash upon delivery."
//             : "Thank you for your purchase. Your payment has been confirmed."}
//         </p>

//         <div className="bg-light p-3 rounded-3 mb-4 text-start">
//           <div className="d-flex justify-content-between mb-2">
//             <span className="text-muted small">Transaction ID</span>
//             <span className="fw-bold small text-dark">
//               TXN-{Math.floor(Math.random() * 1000000)}
//             </span>
//           </div>
//           <div className="d-flex justify-content-between mb-2">
//             <span className="text-muted small">Order ID</span>
//             <span className="fw-bold small text-primary">
//               {orderId && orderId !== "new"
//                 ? `#${orderId.slice(-6).toUpperCase()}`
//                 : "Processing..."}
//             </span>
//           </div>
//           <div className="d-flex justify-content-between mb-2">
//             <span className="text-muted small">Payment Method</span>
//             <Badge bg="info" className="text-uppercase">
//               {method || "Online"}
//             </Badge>
//           </div>
//           <div className="d-flex justify-content-between">
//             <span className="text-muted small">Date</span>
//             <span className="fw-bold small">{date}</span>
//           </div>
//         </div>

//         <div className="d-grid gap-2">
//           <Button variant="outline-dark" className="rounded-pill">
//             <Download size={18} className="me-2" /> Download Invoice
//           </Button>
//           <Link
//             to="/customer-dashboard"
//             className="btn btn-primary rounded-pill fw-bold"
//           >
//             Go to Dashboard <ArrowRight size={18} className="ms-2" />
//           </Link>
//           <Link to="/" className="btn btn-link text-decoration-none text-muted">
//             <Home size={16} className="me-1" /> Return Home
//           </Link>
//         </div>
//       </Card>
//     </Container>
//   );
// };

// export default PaymentSuccess;

// import React, { useEffect } from "react";
// import { Container, Card, Button, Badge } from "react-bootstrap";
// import { Link, useSearchParams } from "react-router-dom";
// import { CheckCircle, Download, ArrowRight, Home, Receipt } from "lucide-react";
// import confetti from "canvas-confetti"; // Optional: adds celebration effect

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const orderId = searchParams.get("id");
//   const method = searchParams.get("method");
//   const date = new Date().toLocaleDateString(undefined, {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   useEffect(() => {
//     // Trigger confetti on mount
//     confetti({
//       particleCount: 100,
//       spread: 70,
//       origin: { y: 0.6 },
//     });
//   }, []);

//   return (
//     <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5 fade-in">
//       <Card
//         className="border-0 shadow-lg rounded-4 text-center p-4 p-md-5 position-relative overflow-hidden"
//         style={{ maxWidth: "500px", width: "100%" }}
//       >
//         {/* Decorative background circle */}
//         <div
//           className="position-absolute top-0 start-50 translate-middle rounded-circle bg-success opacity-10"
//           style={{ width: "300px", height: "300px", marginTop: "-100px" }}
//         />

//         <div className="position-relative z-1">
//           <div className="mb-4">
//             <div className="bg-success text-white rounded-circle d-inline-flex p-3 shadow-sm">
//               <CheckCircle size={48} strokeWidth={3} />
//             </div>
//           </div>

//           <h2 className="fw-bold mb-2 text-dark">
//             {method === "COD" ? "Order Placed!" : "Payment Successful!"}
//           </h2>
//           <p className="text-muted mb-4 px-3">
//             {method === "COD"
//               ? "Your order has been confirmed. Please keep cash ready upon delivery."
//               : "Thank you for your purchase. A confirmation email has been sent to you."}
//           </p>

//           {/* Receipt Details Card */}
//           <div className="bg-light bg-opacity-50 border border-light-subtle p-4 rounded-4 mb-4 text-start shadow-sm">
//             <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary border-opacity-10">
//               <span className="text-muted small text-uppercase fw-bold tracking-wider">
//                 Order Receipt
//               </span>
//               <Receipt size={16} className="text-muted opacity-50" />
//             </div>

//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted small">Order ID</span>
//               <span className="fw-bold text-dark font-monospace">
//                 {orderId && orderId !== "new"
//                   ? `#${orderId.slice(-6).toUpperCase()}`
//                   : "PROCESSING"}
//               </span>
//             </div>

//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted small">Date</span>
//               <span className="fw-medium small text-dark">{date}</span>
//             </div>

//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted small">Payment Method</span>
//               <Badge
//                 bg={method === "COD" ? "warning" : "success"}
//                 text={method === "COD" ? "dark" : "white"}
//                 className="fw-medium px-2"
//               >
//                 {method === "COD"
//                   ? "Cash on Delivery"
//                   : method || "Online Payment"}
//               </Badge>
//             </div>

//             <div className="d-flex justify-content-between">
//               <span className="text-muted small">Transaction ID</span>
//               <span className="text-muted small font-monospace">
//                 TXN-{Math.floor(Math.random() * 10000000)}
//               </span>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="d-grid gap-3">
//             <Button
//               variant="outline-secondary"
//               className="rounded-pill border-opacity-25 hover-bg-light"
//             >
//               <Download size={18} className="me-2" /> Download Receipt
//             </Button>

//             <Link
//               to="/customer-dashboard"
//               className="btn btn-primary rounded-pill fw-bold py-2 shadow-sm d-flex justify-content-center align-items-center"
//             >
//               Go to Dashboard <ArrowRight size={18} className="ms-2" />
//             </Link>

//             <Link
//               to="/"
//               className="btn btn-link text-decoration-none text-muted small mt-2"
//             >
//               <Home size={14} className="me-1" /> Return to Home
//             </Link>
//           </div>
//         </div>
//       </Card>
//     </Container>
//   );
// };

// export default PaymentSuccess;

// import React, { useEffect } from "react";
// import { Container, Card, Button, Badge } from "react-bootstrap";
// import { Link, useSearchParams } from "react-router-dom";
// import { CheckCircle, Download, ArrowRight, Home, Receipt } from "lucide-react";

// // Optional: If you installed 'canvas-confetti', uncomment the import and useEffect below
// // import confetti from "canvas-confetti";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const orderId = searchParams.get("id") || searchParams.get("order_id"); // Handle both param names
//   const method = searchParams.get("method");

//   const date = new Date().toLocaleDateString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   /* // Uncomment if you installed canvas-confetti
//   useEffect(() => {
//     confetti({
//       particleCount: 100,
//       spread: 70,
//       origin: { y: 0.6 },
//     });
//   }, []);
//   */

//   return (
//     <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5 animate-fade-in">
//       <Card
//         className="border-0 shadow-lg rounded-4 text-center p-4 p-md-5 position-relative overflow-hidden"
//         style={{ maxWidth: "500px", width: "100%" }}
//       >
//         {/* Decorative Background Circle */}
//         <div
//           className="position-absolute top-0 start-50 translate-middle rounded-circle bg-success opacity-10"
//           style={{ width: "300px", height: "300px", marginTop: "-100px", opacity: 0.1 }}
//         />

//         <div className="position-relative z-1">
//           {/* Success Icon */}
//           <div className="mb-4">
//             <div className="bg-success text-white rounded-circle d-inline-flex p-3 shadow-sm">
//               <CheckCircle size={48} strokeWidth={3} />
//             </div>
//           </div>

//           {/* Heading */}
//           <h2 className="fw-bold mb-2 text-dark">
//             {method === "COD" ? "Order Placed!" : "Payment Successful!"}
//           </h2>
//           <p className="text-muted mb-4 px-3">
//             {method === "COD"
//               ? "Your order has been confirmed. Please keep cash ready upon delivery."
//               : "Thank you for your purchase. A confirmation email has been sent to you."}
//           </p>

//           {/* Receipt Details Card */}
//           <div className="bg-light bg-opacity-50 border border-light-subtle p-4 rounded-4 mb-4 text-start shadow-sm">
//             <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary border-opacity-10">
//               <span className="text-muted small text-uppercase fw-bold tracking-wider">
//                 Order Receipt
//               </span>
//               <Receipt size={16} className="text-muted opacity-50" />
//             </div>

//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted small">Order ID</span>
//               <span className="fw-bold text-dark font-monospace">
//                 {orderId && orderId !== "new"
//                   ? `#${orderId.slice(-6).toUpperCase()}`
//                   : "PROCESSING"}
//               </span>
//             </div>

//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted small">Date</span>
//               <span className="fw-medium small text-dark">{date}</span>
//             </div>

//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted small">Payment Method</span>
//               <Badge
//                 bg={method === "COD" ? "warning" : "success"}
//                 text={method === "COD" ? "dark" : "white"}
//                 className="fw-medium px-2"
//               >
//                 {method === "COD"
//                   ? "Cash on Delivery"
//                   : method || "Online Payment"}
//               </Badge>
//             </div>

//             <div className="d-flex justify-content-between">
//               <span className="text-muted small">Transaction ID</span>
//               <span className="text-muted small font-monospace">
//                 TXN-{Math.floor(10000000 + Math.random() * 90000000)}
//               </span>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="d-grid gap-3">
//             <Button
//               variant="outline-secondary"
//               className="rounded-pill border-opacity-25 hover-bg-light"
//               onClick={() => window.print()} // Simple print functionality
//             >
//               <Download size={18} className="me-2" /> Download Receipt
//             </Button>

//             <Link
//               to="/customer-dashboard"
//               className="btn btn-primary rounded-pill fw-bold py-2 shadow-sm d-flex justify-content-center align-items-center"
//             >
//               Go to Dashboard <ArrowRight size={18} className="ms-2" />
//             </Link>

//             <Link
//               to="/"
//               className="btn btn-link text-decoration-none text-muted small mt-2"
//             >
//               <Home size={14} className="me-1" /> Return to Home
//             </Link>
//           </div>
//         </div>
//       </Card>

//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
//         @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
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
//   Alert,
// } from "react-bootstrap";
// import { Link, useSearchParams } from "react-router-dom";
// import {
//   CheckCircle,
//   XCircle,
//   Download,
//   ArrowRight,
//   Home,
//   Receipt,
// } from "lucide-react";
// import axios from "axios";

// // Optional: If you installed 'canvas-confetti', uncomment the import and useEffect below
// // import confetti from "canvas-confetti";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();

//   // State for handling verification status
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [error, setError] = useState(null);
//   const [verifiedOrder, setVerifiedOrder] = useState(null);

//   // Get params from URL
//   const pidx = searchParams.get("pidx"); // Khalti Transaction ID
//   const method = searchParams.get("method"); // 'COD', 'Stripe', or 'Khalti'
//   // Khalti returns 'purchase_order_id', Stripe/COD might send 'id'
//   const urlOrderId =
//     searchParams.get("id") ||
//     searchParams.get("order_id") ||
//     searchParams.get("purchase_order_id");

//   // Use the verified order ID if available, otherwise fallback to URL param
//   const finalOrderId = verifiedOrder?._id || urlOrderId;

//   const date = new Date().toLocaleDateString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   // --- 1. VERIFICATION EFFECT ---
//   useEffect(() => {
//     const verifyPayment = async () => {
//       // If we have a pidx (Khalti) and haven't verified yet
//       if (pidx && !verifiedOrder) {
//         setIsVerifying(true);
//         try {
//           const token = localStorage.getItem("token");
//           const config = {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           };

//           // Call your Backend Lookup Route
//           const { data } = await axios.post(
//             "http://localhost:5000/api/payments/khalti-lookup",
//             { pidx },
//             config,
//           );

//           if (data.success) {
//             setVerifiedOrder(data.order); // Save verified order details
//             // Optional: Trigger confetti here on success
//             // confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
//           } else {
//             setError(data.message || "Payment verification failed.");
//           }
//         } catch (err) {
//           console.error(err);
//           setError(
//             err.response?.data?.message || "Server error during verification.",
//           );
//         } finally {
//           setIsVerifying(false);
//         }
//       }
//       // Handle Stripe Redirect Status
//       else if (searchParams.get("redirect_status") === "failed") {
//         setError("Payment failed or was cancelled.");
//       }
//     };

//     // Only run verification if not COD (COD is already confirmed)
//     if (method !== "COD") {
//       verifyPayment();
//     }
//   }, [pidx, method, searchParams, verifiedOrder]);

//   // --- 2. RENDER: LOADING STATE ---
//   if (isVerifying) {
//     return (
//       <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
//         <Spinner
//           animation="border"
//           variant="primary"
//           style={{ width: "3rem", height: "3rem" }}
//         />
//         <h5 className="mt-3 text-muted animate-pulse">
//           Verifying your payment...
//         </h5>
//         <p className="text-muted small">Please do not close this window.</p>
//       </Container>
//     );
//   }

//   // --- 3. RENDER: ERROR STATE ---
//   if (error) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center min-vh-100">
//         <Card
//           className="border-0 shadow-lg rounded-4 text-center p-5"
//           style={{ maxWidth: "500px" }}
//         >
//           <div className="mb-3 text-danger">
//             <XCircle size={64} />
//           </div>
//           <h3 className="fw-bold text-danger mb-3">Payment Failed</h3>
//           <p className="text-muted mb-4">{error}</p>
//           <div className="d-grid gap-2">
//             <Link to="/payment" className="btn btn-primary rounded-pill">
//               Try Again
//             </Link>
//             <Link to="/" className="btn btn-outline-secondary rounded-pill">
//               Go Home
//             </Link>
//           </div>
//         </Card>
//       </Container>
//     );
//   }

//   // --- 4. RENDER: SUCCESS STATE (Your Original UI) ---
//   return (
//     <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5 animate-fade-in">
//       <Card
//         className="border-0 shadow-lg rounded-4 text-center p-4 p-md-5 position-relative overflow-hidden"
//         style={{ maxWidth: "500px", width: "100%" }}
//       >
//         {/* Decorative Background Circle */}
//         <div
//           className="position-absolute top-0 start-50 translate-middle rounded-circle bg-success opacity-10"
//           style={{
//             width: "300px",
//             height: "300px",
//             marginTop: "-100px",
//             opacity: 0.1,
//           }}
//         />

//         <div className="position-relative z-1">
//           {/* Success Icon */}
//           <div className="mb-4">
//             <div className="bg-success text-white rounded-circle d-inline-flex p-3 shadow-sm">
//               <CheckCircle size={48} strokeWidth={3} />
//             </div>
//           </div>

//           {/* Heading */}
//           <h2 className="fw-bold mb-2 text-dark">
//             {method === "COD" ? "Order Placed!" : "Payment Successful!"}
//           </h2>
//           <p className="text-muted mb-4 px-3">
//             {method === "COD"
//               ? "Your order has been confirmed. Please keep cash ready upon delivery."
//               : "Thank you for your purchase. A confirmation email has been sent to you."}
//           </p>

//           {/* Receipt Details Card */}
//           <div className="bg-light bg-opacity-50 border border-light-subtle p-4 rounded-4 mb-4 text-start shadow-sm">
//             <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary border-opacity-10">
//               <span className="text-muted small text-uppercase fw-bold tracking-wider">
//                 Order Receipt
//               </span>
//               <Receipt size={16} className="text-muted opacity-50" />
//             </div>

//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted small">Order ID</span>
//               <span className="fw-bold text-dark font-monospace">
//                 {finalOrderId && finalOrderId !== "new"
//                   ? `#${finalOrderId.slice(-6).toUpperCase()}`
//                   : "PROCESSING..."}
//               </span>
//             </div>

//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted small">Date</span>
//               <span className="fw-medium small text-dark">{date}</span>
//             </div>

//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted small">Payment Method</span>
//               <Badge
//                 bg={method === "COD" ? "warning" : "success"}
//                 text={method === "COD" ? "dark" : "white"}
//                 className="fw-medium px-2"
//               >
//                 {method === "COD"
//                   ? "Cash on Delivery"
//                   : pidx
//                     ? "Khalti Wallet"
//                     : "Online Payment"}
//               </Badge>
//             </div>

//             <div className="d-flex justify-content-between">
//               <span className="text-muted small">Transaction ID</span>
//               <span className="text-muted small font-monospace">
//                 {pidx ||
//                   `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`}
//               </span>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="d-grid gap-3">
//             <Button
//               variant="outline-secondary"
//               className="rounded-pill border-opacity-25 hover-bg-light"
//               onClick={() => window.print()}
//             >
//               <Download size={18} className="me-2" /> Download Receipt
//             </Button>

//             <Link
//               to="/orders" // Updated to standard orders page
//               className="btn btn-primary rounded-pill fw-bold py-2 shadow-sm d-flex justify-content-center align-items-center"
//             >
//               Go to Dashboard <ArrowRight size={18} className="ms-2" />
//             </Link>

//             <Link
//               to="/"
//               className="btn btn-link text-decoration-none text-muted small mt-2"
//             >
//               <Home size={14} className="me-1" /> Return to Home
//             </Link>
//           </div>
//         </div>
//       </Card>

//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
//         .animate-pulse { animation: pulse 2s infinite; }
//         @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
//         @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
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
//   Alert,
// } from "react-bootstrap";
// import { Link, useSearchParams } from "react-router-dom";
// import {
//   CheckCircle,
//   XCircle,
//   Download,
//   ArrowRight,
//   Home,
//   Receipt,
// } from "lucide-react";
// import axios from "axios";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();

//   // State for handling verification status
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [error, setError] = useState(null);
//   const [verifiedOrder, setVerifiedOrder] = useState(null);

//   // Get params from URL
//   const pidx = searchParams.get("pidx"); // Khalti Transaction ID
//   const method = searchParams.get("method"); // 'COD', 'Stripe', or 'Khalti'

//   // ✅ Robust ID Recovery: Checks all possible keys Khalti or Stripe might send
//   const urlOrderId =
//     searchParams.get("id") ||
//     searchParams.get("order_id") ||
//     searchParams.get("purchase_order_id");

//   // Use the verified order ID if available, otherwise fallback to URL param
//   const finalOrderId = verifiedOrder?._id || urlOrderId;

//   const date = new Date().toLocaleDateString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   // --- 1. VERIFICATION EFFECT ---
//   useEffect(() => {
//     let isMounted = true;

//     const verifyPayment = async () => {
//       // ✅ Only verify if it's Khalti and we haven't verified it in this session yet
//       if (pidx && !verifiedOrder && !error) {
//         setIsVerifying(true);
//         try {
//           const token = localStorage.getItem("token");
//           const config = {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           };

//           // ✅ Fix: Ensure this matches the backend route in paymentRoutes.js
//           const { data } = await axios.post(
//             "http://localhost:5000/api/payments/khalti-lookup",
//             { pidx },
//             config,
//           );

//           if (isMounted) {
//             if (data.success) {
//               setVerifiedOrder(data.order);
//             } else {
//               // If we have a URL ID, we don't show a hard error to avoid flickering
//               if (!urlOrderId) setError(data.message || "Verification failed.");
//             }
//           }
//         } catch (err) {
//           console.error("Verification Error:", err);
//           // Only show error screen if we have absolutely no order context
//           if (isMounted && !urlOrderId) {
//             setError(
//               err.response?.data?.message ||
//                 "Server error during verification.",
//             );
//           }
//         } finally {
//           if (isMounted) setIsVerifying(false);
//         }
//       }
//     };

//     // Skip verification for Cash on Delivery as it is confirmed on the previous page
//     if (method !== "COD") {
//       verifyPayment();
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [pidx, method, urlOrderId, verifiedOrder, error]);

//   // --- 2. RENDER: LOADING STATE ---
//   if (isVerifying && !urlOrderId) {
//     return (
//       <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
//         <Spinner
//           animation="border"
//           variant="primary"
//           style={{ width: "3rem", height: "3rem" }}
//         />
//         <h5 className="mt-3 text-muted animate-pulse">
//           Verifying your payment...
//         </h5>
//         <p className="text-muted small">Please do not close this window.</p>
//       </Container>
//     );
//   }

//   // --- 3. RENDER: ERROR STATE ---
//   if (error && !urlOrderId) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center min-vh-100">
//         <Card
//           className="border-0 shadow-lg rounded-4 text-center p-5"
//           style={{ maxWidth: "500px" }}
//         >
//           <div className="mb-3 text-danger">
//             <XCircle size={64} />
//           </div>
//           <h3 className="fw-bold text-danger mb-3">Payment Failed</h3>
//           <p className="text-muted mb-4">{error}</p>
//           <div className="d-grid gap-2">
//             <Link to="/placeorder" className="btn btn-primary rounded-pill">
//               Try Again
//             </Link>
//             <Link to="/" className="btn btn-outline-secondary rounded-pill">
//               Go Home
//             </Link>
//           </div>
//         </Card>
//       </Container>
//     );
//   }

//   // --- 4. RENDER: SUCCESS STATE ---
//   return (
//     <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5 animate-fade-in">
//       <Card
//         className="border-0 shadow-lg rounded-4 text-center p-4 p-md-5 position-relative overflow-hidden"
//         style={{ maxWidth: "500px", width: "100%" }}
//       >
//         <div className="position-relative z-1">
//           <div className="mb-4">
//             <div className="bg-success text-white rounded-circle d-inline-flex p-3 shadow-sm">
//               <CheckCircle size={48} strokeWidth={3} />
//             </div>
//           </div>

//           <h2 className="fw-bold mb-2 text-dark">
//             {method === "COD" ? "Order Placed!" : "Payment Successful!"}
//           </h2>
//           <p className="text-muted mb-4 px-3">
//             {method === "COD"
//               ? "Your order has been confirmed. Please keep cash ready upon delivery."
//               : "Thank you for your purchase. Your order is being processed."}
//           </p>

//           {/* Receipt Details */}
//           <div className="bg-light bg-opacity-50 border border-light-subtle p-4 rounded-4 mb-4 text-start shadow-sm">
//             <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary border-opacity-10">
//               <span className="text-muted small text-uppercase fw-bold">
//                 Order Receipt
//               </span>
//               <Receipt size={16} className="text-muted opacity-50" />
//             </div>

//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted small">Order ID</span>
//               <span className="fw-bold text-dark font-monospace">
//                 {finalOrderId
//                   ? `#${finalOrderId.slice(-6).toUpperCase()}`
//                   : "..."}
//               </span>
//             </div>

//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted small">Date</span>
//               <span className="fw-medium small text-dark">{date}</span>
//             </div>

//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted small">Payment Method</span>
//               <Badge
//                 bg={method === "COD" ? "warning" : "success"}
//                 text={method === "COD" ? "dark" : "white"}
//                 className="fw-medium px-2"
//               >
//                 {method === "COD"
//                   ? "Cash on Delivery"
//                   : pidx
//                     ? "Khalti Wallet"
//                     : "Stripe/Card"}
//               </Badge>
//             </div>

//             <div className="d-flex justify-content-between">
//               <span className="text-muted small">Status</span>
//               <span className="text-success small fw-bold">
//                 {isVerifying ? "VERIFYING..." : "CONFIRMED"}
//               </span>
//             </div>
//           </div>

//           <div className="d-grid gap-3">
//             <Button
//               variant="outline-secondary"
//               className="rounded-pill border-opacity-25"
//               onClick={() => window.print()}
//             >
//               <Download size={18} className="me-2" /> Download Receipt
//             </Button>

//             <Link
//               to="/orders"
//               className="btn btn-primary rounded-pill fw-bold py-2 shadow-sm d-flex justify-content-center align-items-center"
//             >
//               View Order History <ArrowRight size={18} className="ms-2" />
//             </Link>
//           </div>
//         </div>
//       </Card>

//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
//         @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
//         .animate-pulse { animation: pulse 2s infinite; }
//         @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
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
//   Alert,
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
//         const token = localStorage.getItem("token");
//         const config = {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         // Scenario A: Coming back from Khalti Payment
//         if (pidx && !order) {
//           const { data } = await axios.post(
//             "http://localhost:5000/api/payments/khalti-lookup",
//             { pidx },
//             config,
//           );
//           if (isMounted) {
//             if (data.success) {
//               setOrder(data.order);
//             } else {
//               if (!urlOrderId) setError(data.message || "Verification failed.");
//             }
//           }
//         }
//         // Scenario B: Viewing an existing order (from Order History)
//         else if (urlOrderId && !order) {
//           const { data } = await axios.get(
//             `http://localhost:5000/api/orders/${urlOrderId}`,
//             config,
//           );
//           if (isMounted) {
//             setOrder(data);
//           }
//         } else {
//           if (isMounted) setError("No order reference found.");
//         }
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         if (isMounted && !urlOrderId) {
//           setError(err.response?.data?.message || "Failed to load receipt.");
//         }
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     fetchOrVerifyOrder();

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

//   if (!order) return null;

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
//     title = "Payment Pending!";
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
//                   #{order._id.slice(-6).toUpperCase()}
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

import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();

  // State for handling verification status
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  // Get params from URL
  const pidx = searchParams.get("pidx"); // Khalti Transaction ID
  const urlOrderId =
    searchParams.get("id") ||
    searchParams.get("order_id") ||
    searchParams.get("purchase_order_id");

  // --- 1. FETCH & VERIFY EFFECT ---
  useEffect(() => {
    let isMounted = true;

    const fetchOrVerifyOrder = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        // Scenario A: Coming back from Khalti Payment
        if (pidx && !order) {
          const { data } = await axios.post(
            "http://localhost:5000/api/payments/khalti-lookup",
            { pidx },
            config,
          );
          if (isMounted) {
            if (data.success) {
              setOrder(data.order);
            } else {
              if (!urlOrderId) setError(data.message || "Verification failed.");
            }
          }
        }
        // Scenario B: Viewing an existing order (from Order History)
        else if (urlOrderId && !order) {
          const { data } = await axios.get(
            `http://localhost:5000/api/orders/${urlOrderId}`,
            config,
          );
          if (isMounted) {
            setOrder(data);
          }
        } else {
          if (isMounted) setError("No order reference found.");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        if (isMounted && !urlOrderId) {
          setError(err.response?.data?.message || "Failed to load receipt.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchOrVerifyOrder();

    return () => {
      isMounted = false;
    };
  }, [pidx, urlOrderId, order]);

  // --- 2. RENDER: LOADING STATE ---
  if (isLoading) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
        <Spinner
          animation="border"
          variant="primary"
          style={{ width: "3rem", height: "3rem" }}
        />
        <h5 className="mt-3 text-muted animate-pulse">Loading Receipt...</h5>
      </Container>
    );
  }

  // --- 3. RENDER: ERROR STATE ---
  if (error && !order) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card
          className="border-0 shadow-lg rounded-4 text-center p-5"
          style={{ maxWidth: "500px" }}
        >
          <div className="mb-3 text-danger">
            <XCircle size={64} />
          </div>
          <h3 className="fw-bold text-danger mb-3">Error</h3>
          <p className="text-muted mb-4">{error}</p>
          <div className="d-grid gap-2">
            <Link to="/orders" className="btn btn-primary rounded-pill">
              View My Orders
            </Link>
          </div>
        </Card>
      </Container>
    );
  }

  if (!order) return null;

  // --- DYNAMIC UI LOGIC based on actual DB status ---
  const isPaid = order.isPaid;
  const isCOD = order.paymentMethod === "COD";

  let statusIcon = <CheckCircle size={48} strokeWidth={3} />;
  let statusColor = "bg-success";
  let title = "Payment Successful!";
  let subtitle = "Thank you for your purchase. Your order is being processed.";

  if (!isPaid && !isCOD) {
    statusIcon = <Clock size={48} strokeWidth={3} />;
    statusColor = "bg-warning text-dark";
    title = "Payment Pending!";
    subtitle = "Your order is placed but awaiting payment confirmation.";
  } else if (!isPaid && isCOD) {
    title = "Order Confirmed!";
    subtitle = "Your order is placed. Please keep cash ready upon delivery.";
  }

  // --- 4. RENDER: RECEIPT STATE ---
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5 animate-fade-in">
      <Card
        className="border-0 shadow-lg rounded-4 p-4 p-md-5 position-relative overflow-hidden"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        {/* Dynamic Header */}
        <div className="text-center mb-4">
          <div
            className={`${statusColor} ${!isPaid && !isCOD ? "" : "text-white"} rounded-circle d-inline-flex p-3 shadow-sm mb-3`}
          >
            {statusIcon}
          </div>
          <h2 className="fw-bold mb-2 text-dark">{title}</h2>
          <p className="text-muted px-3">{subtitle}</p>
        </div>

        {/* Detailed Receipt Card */}
        <div className="bg-light bg-opacity-50 border border-light-subtle p-4 rounded-4 mb-4 shadow-sm">
          {/* Company Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-10">
            <div className="d-flex align-items-center gap-2 text-primary">
              <Building size={24} />
              <span className="fw-bold fs-5 tracking-wider">PharmaStore</span>
            </div>
            <Receipt size={24} className="text-muted opacity-50" />
          </div>

          {/* Customer & Address Info */}
          <Row className="mb-4 g-3">
            <Col sm={6}>
              <div className="small text-muted text-uppercase fw-bold mb-1">
                Billed To:
              </div>
              <div className="fw-bold text-dark d-flex align-items-center gap-2">
                <User size={14} className="text-muted" />{" "}
                {order.user?.name || "Customer"}
              </div>
              <div className="small text-muted ms-4">{order.user?.email}</div>
            </Col>
            <Col sm={6}>
              <div className="small text-muted text-uppercase fw-bold mb-1">
                Shipped To:
              </div>
              <div className="small text-dark d-flex align-start gap-2">
                <MapPin size={14} className="text-muted mt-1 flex-shrink-0" />
                <span>
                  {order.shippingAddress?.address}
                  <br />
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.country}
                  <br />
                  {order.shippingAddress?.postalCode}
                </span>
              </div>
            </Col>
          </Row>

          <div className="bg-white p-3 rounded-3 border mb-3">
            <Row className="g-3">
              <Col xs={6}>
                <span className="text-muted small d-block">Order ID</span>
                <span className="fw-bold font-monospace">
                  {/* ✅ UPDATED: Uses Real-World Order ID if available */}
                  {order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}
                </span>
              </Col>
              <Col xs={6}>
                <span className="text-muted small d-block">Date</span>
                <span className="fw-bold small">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </Col>
              <Col xs={6}>
                <span className="text-muted small d-block">Payment Method</span>
                <span className="fw-bold">{order.paymentMethod}</span>
              </Col>
              <Col xs={6}>
                <span className="text-muted small d-block">Total Amount</span>
                <span className="fw-bold text-primary fs-5">
                  Rs. {order.totalPrice?.toLocaleString()}
                </span>
              </Col>
            </Row>
          </div>

          <Row className="g-3">
            <Col xs={6}>
              <span className="text-muted small d-block mb-1">
                Payment Status
              </span>
              <Badge
                bg={isPaid ? "success" : "warning"}
                text={isPaid ? "white" : "dark"}
                className="px-3 py-2"
              >
                {isPaid ? "PAID" : "PENDING"}
              </Badge>
            </Col>
            <Col xs={6}>
              <span className="text-muted small d-block mb-1">
                Fulfillment Status
              </span>
              <Badge
                bg={order.isDelivered ? "info" : "secondary"}
                className="px-3 py-2"
              >
                {order.orderStatus ||
                  (order.isDelivered ? "Delivered" : "Processing")}
              </Badge>
            </Col>
          </Row>
        </div>

        {/* Action Buttons */}
        <div className="d-grid gap-3">
          <Button
            variant="outline-secondary"
            className="rounded-pill border-opacity-25"
            onClick={() => window.print()}
          >
            <Download size={18} className="me-2" /> Download Full Receipt
          </Button>

          <Link
            to="/orders"
            className="btn btn-primary rounded-pill fw-bold py-2 shadow-sm d-flex justify-content-center align-items-center"
          >
            View Order History <ArrowRight size={18} className="ms-2" />
          </Link>
        </div>
      </Card>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        @media print {
          body * { visibility: hidden; }
          .card, .card * { visibility: visible; }
          .card { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
          .btn { display: none !important; }
        }
      `}</style>
    </Container>
  );
};

export default PaymentSuccess;
