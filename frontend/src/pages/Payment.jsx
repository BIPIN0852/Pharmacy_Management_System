// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   Form,
//   Button,
//   Col,
//   Card,
//   Row,
//   Table,
//   Alert,
//   Container,
//   Spinner,
// } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import { CreditCard, Truck, ShieldCheck, Lock, ArrowLeft } from "lucide-react";
// import CheckoutSteps from "../components/CheckoutSteps";
// import { savePaymentMethod } from "../redux/actions/cartActions";

// // Keys
// const STRIPE_PUBLIC_KEY =
//   "pk_test_51SZ3HcAgufYbIAmejyFQscH1Zt6s2Vk3AY3CWdMSmEnwxL01QSmfF4CKjdJciwlsaMjKlrX5CqUURq4BqcmViYc2003TDl2Vu9";

// // ✅ UPDATED: Use your TEST KEY here.
// // Go to Khalti Dashboard > Switch to "Test Mode" > Copy "Test Public Key"
// const KHALTI_PUBLIC_KEY = "aba70c54d2f249bf97c8fb59e8753a1d";

// const API_BASE_URL = "http://localhost:5000/api";

// const Payment = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   // Redux State
//   const cart = useSelector((state) => state.cart);
//   const userState = useSelector((state) => state.userLogin || {});
//   const { shippingAddress, orderId, totalPrice, cartItems } = cart;
//   const loggedInUser = userState.userInfo;

//   // Query Params
//   const searchParams = new URLSearchParams(location.search);
//   const orderIdFromQuery = searchParams.get("orderId");
//   const amountFromQuery = searchParams.get("amount");

//   // Local State
//   const [paymentMethod, setPaymentMethod] = useState("Khalti");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [stripePromise, setStripePromise] = useState(null);

//   // Logic Fallback
//   const savedCheckoutData = JSON.parse(
//     localStorage.getItem("checkoutData") || "{}",
//   );
//   const persistedPrice = savedCheckoutData.totalPrice || 0;

//   const paymentOrderId = orderIdFromQuery || orderId;
//   const rawAmount =
//     Number(amountFromQuery) ||
//     Number(totalPrice) ||
//     Number(persistedPrice) ||
//     0;

//   // Financial Breakdown
//   const subTotal = (rawAmount / 1.1).toFixed(2);
//   const taxAmount = (rawAmount - subTotal).toFixed(2);
//   const finalAmount = rawAmount.toFixed(2);

//   const step1 = true;
//   const step2 = !!shippingAddress;
//   const step3 = true;
//   const step4 = false;

//   useEffect(() => {
//     loadStripe(STRIPE_PUBLIC_KEY).then(setStripePromise);
//     if (!shippingAddress && !orderIdFromQuery) {
//       navigate("/shipping");
//     }
//   }, [shippingAddress, navigate, orderIdFromQuery]);

//   // --- HANDLERS ---

//   const handleStripePayment = async () => {
//     try {
//       setLoading(true);
//       setMessage("");
//       const stripe = await stripePromise;
//       const token = localStorage.getItem("token");

//       const res = await fetch(
//         `${API_BASE_URL}/payments/create-stripe-session`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             amount: Math.round(finalAmount * 100),
//             orderId: paymentOrderId,
//             medicineName: "Pharmacy Order",
//             customerEmail: loggedInUser?.email,
//           }),
//         },
//       );

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Stripe session failed");

//       await stripe.redirectToCheckout({ sessionId: data.sessionId });
//     } catch (error) {
//       setMessage("❌ Stripe Error: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ FIXED KHALTI HANDLER
//   const handleKhaltiPayment = () => {
//     // Check if SDK is loaded
//     if (!window.KhaltiCheckout) {
//       setMessage(
//         "⚠️ Khalti SDK missing. Please check your internet connection or refresh the page.",
//       );
//       return;
//     }

//     // ✅ FIX: Ensure amount is Integer (Paisa)
//     const amountInPaisa = Math.round(Number(finalAmount) * 100);

//     if (amountInPaisa <= 0) {
//       setMessage("❌ Invalid amount. Cannot process 0 payment.");
//       return;
//     }

//     setLoading(true);

//     const khaltiConfig = {
//       publicKey: KHALTI_PUBLIC_KEY,
//       productIdentity: String(paymentOrderId || `ORDER_${Date.now()}`),
//       productName: "Pharmacy Order",
//       productUrl: "http://localhost:3000", // ✅ Must be a valid URL string
//       paymentPreference: [
//         "KHALTI",
//         "EBANKING",
//         "MOBILE_BANKING",
//         "CONNECT_IPS",
//         "SCT",
//       ],
//       eventHandler: {
//         onSuccess: async (payload) => {
//           console.log("Khalti Success:", payload);
//           try {
//             const token = localStorage.getItem("token");

//             // ✅ Send payload to backend (Backend must use SECRET KEY)
//             const res = await fetch(`${API_BASE_URL}/payments/khalti-verify`, {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//               body: JSON.stringify({
//                 token: payload.token,
//                 amount: payload.amount,
//                 orderId: paymentOrderId,
//               }),
//             });
//             const data = await res.json();
//             if (data.success) {
//               dispatch(savePaymentMethod("Khalti"));
//               navigate(
//                 `/payment-success?id=${paymentOrderId || "new"}&method=Khalti`,
//               );
//             } else {
//               setMessage("❌ Payment Verification Failed: " + data.message);
//             }
//           } catch (err) {
//             console.error("Verification Error:", err);
//             setMessage("❌ Server Error during verification.");
//           } finally {
//             setLoading(false);
//           }
//         },
//         onError: (error) => {
//           console.log("Khalti Error:", error);
//           // Don't show generic error to user immediately, log it
//           setLoading(false);
//         },
//         onClose: () => {
//           console.log("Khalti Popup Closed");
//           setLoading(false);
//         },
//       },
//     };

//     try {
//       const checkout = new window.KhaltiCheckout(khaltiConfig);
//       checkout.show({ amount: amountInPaisa });
//     } catch (err) {
//       console.error("Khalti Init Error:", err);
//       setMessage("❌ Failed to initialize Khalti.");
//       setLoading(false);
//     }
//   };

//   const handleCOD = async () => {
//     dispatch(savePaymentMethod("COD"));
//     if (paymentOrderId) {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_BASE_URL}/payments/set-cod`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ orderId: paymentOrderId }),
//         });

//         if (res.ok) {
//           navigate(`/payment-success?id=${paymentOrderId}&method=COD`);
//         } else {
//           setMessage("❌ Failed to update order method.");
//         }
//       } catch (err) {
//         setMessage("❌ Connection Error.");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       navigate("/placeorder");
//     }
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     if (paymentMethod === "Stripe") await handleStripePayment();
//     else if (paymentMethod === "Khalti") handleKhaltiPayment();
//     else if (paymentMethod === "COD") await handleCOD();
//   };

//   return (
//     <Container className="py-5" style={{ minHeight: "80vh" }}>
//       <CheckoutSteps step1 step2 step3 step4={step4} />

//       <Row className="g-4 mt-2">
//         <Col lg={8}>
//           <Card className="border-0 shadow-sm rounded-4 h-100">
//             <Card.Header className="bg-white border-bottom p-4">
//               <h4 className="fw-bold mb-0 text-primary d-flex align-items-center">
//                 <ShieldCheck className="me-2" size={24} /> Secure Payment
//               </h4>
//               <p className="text-muted small mb-0 mt-1">
//                 All transactions are encrypted and secured.
//               </p>
//             </Card.Header>
//             <Card.Body className="p-4">
//               {message && (
//                 <Alert
//                   variant={message.includes("❌") ? "danger" : "warning"}
//                   className="mb-4"
//                 >
//                   {message}
//                 </Alert>
//               )}

//               <Form onSubmit={submitHandler}>
//                 <h6 className="fw-bold mb-3">Select Payment Method</h6>

//                 {/* Khalti Option */}
//                 <div
//                   className={`p-3 mb-3 border rounded-3 cursor-pointer transition-all ${
//                     paymentMethod === "Khalti"
//                       ? "border-primary bg-primary bg-opacity-10"
//                       : "hover-shadow"
//                   }`}
//                   onClick={() => setPaymentMethod("Khalti")}
//                   style={{
//                     borderLeft:
//                       paymentMethod === "Khalti"
//                         ? "5px solid #0d6efd"
//                         : "1px solid #dee2e6",
//                   }}
//                 >
//                   <Form.Check
//                     type="radio"
//                     id="Khalti"
//                     name="paymentMethod"
//                     value="Khalti"
//                     checked={paymentMethod === "Khalti"}
//                     onChange={() => setPaymentMethod("Khalti")}
//                     label={
//                       <div className="d-flex align-items-center w-100">
//                         <img
//                           src="https://web.khalti.com/static/img/logo1.png"
//                           alt="Khalti"
//                           height="30"
//                           className="me-3 img-fluid"
//                         />
//                         <div>
//                           <span className="d-block fw-bold">
//                             Khalti Digital Wallet
//                           </span>
//                           <small className="text-muted">
//                             Pay securely using your Khalti balance.
//                           </small>
//                         </div>
//                       </div>
//                     }
//                     className="w-100"
//                   />
//                 </div>

//                 {/* Stripe Option */}
//                 <div
//                   className={`p-3 mb-3 border rounded-3 cursor-pointer transition-all ${
//                     paymentMethod === "Stripe"
//                       ? "border-primary bg-primary bg-opacity-10"
//                       : "hover-shadow"
//                   }`}
//                   onClick={() => setPaymentMethod("Stripe")}
//                   style={{
//                     borderLeft:
//                       paymentMethod === "Stripe"
//                         ? "5px solid #0d6efd"
//                         : "1px solid #dee2e6",
//                   }}
//                 >
//                   <Form.Check
//                     type="radio"
//                     id="Stripe"
//                     name="paymentMethod"
//                     value="Stripe"
//                     checked={paymentMethod === "Stripe"}
//                     onChange={() => setPaymentMethod("Stripe")}
//                     label={
//                       <div className="d-flex align-items-center w-100">
//                         <div className="me-3 text-primary">
//                           <CreditCard size={30} />
//                         </div>
//                         <div>
//                           <span className="d-block fw-bold">
//                             Credit / Debit Card (Stripe)
//                           </span>
//                           <small className="text-muted">
//                             Visa, Mastercard, Amex supported.
//                           </small>
//                         </div>
//                       </div>
//                     }
//                   />
//                 </div>

//                 {/* COD Option */}
//                 <div
//                   className={`p-3 mb-4 border rounded-3 cursor-pointer transition-all ${
//                     paymentMethod === "COD"
//                       ? "border-success bg-success bg-opacity-10"
//                       : "hover-shadow"
//                   }`}
//                   onClick={() => setPaymentMethod("COD")}
//                   style={{
//                     borderLeft:
//                       paymentMethod === "COD"
//                         ? "5px solid #198754"
//                         : "1px solid #dee2e6",
//                   }}
//                 >
//                   <Form.Check
//                     type="radio"
//                     id="COD"
//                     name="paymentMethod"
//                     value="COD"
//                     checked={paymentMethod === "COD"}
//                     onChange={() => setPaymentMethod("COD")}
//                     label={
//                       <div className="d-flex align-items-center w-100">
//                         <div className="me-3 text-success">
//                           <Truck size={30} />
//                         </div>
//                         <div>
//                           <span className="d-block fw-bold">
//                             Cash on Delivery
//                           </span>
//                           <small className="text-muted">
//                             Pay when the medicines arrive at your door.
//                           </small>
//                         </div>
//                       </div>
//                     }
//                   />
//                 </div>

//                 <div className="d-flex gap-3 mt-4">
//                   <Button
//                     variant="light"
//                     className="flex-grow-1 py-3 fw-bold text-muted border"
//                     onClick={() => navigate("/shipping")}
//                   >
//                     <ArrowLeft size={18} className="me-2" /> Back
//                   </Button>

//                   <Button
//                     variant="primary"
//                     className="flex-[2] rounded-pill py-3 fw-bold shadow-sm w-100"
//                     type="submit"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Spinner
//                           animation="border"
//                           size="sm"
//                           className="me-2"
//                         />
//                         Processing...
//                       </>
//                     ) : (
//                       <>
//                         <Lock size={18} className="me-2" />{" "}
//                         {paymentMethod === "COD" && !paymentOrderId
//                           ? "Continue to Review"
//                           : `Pay NPR ${Number(finalAmount).toLocaleString()}`}
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* RIGHT: Order Summary */}
//         <Col lg={4}>
//           <Card className="border-0 shadow-sm rounded-4 h-100 bg-light">
//             <Card.Header className="bg-transparent border-0 p-4 pb-0">
//               <h5 className="fw-bold text-dark mb-0">Order Summary</h5>
//             </Card.Header>
//             <Card.Body className="p-4">
//               {cartItems && cartItems.length > 0 && (
//                 <div className="alert alert-info py-2 small mb-3">
//                   <strong>{cartItems.length}</strong> items in cart
//                 </div>
//               )}

//               {paymentOrderId && (
//                 <div className="mb-3 p-2 bg-white rounded border d-flex justify-content-between">
//                   <span className="text-muted">Order ID:</span>
//                   <span className="fw-bold text-primary">
//                     #{paymentOrderId.slice(-6).toUpperCase()}
//                   </span>
//                 </div>
//               )}

//               <Table borderless size="sm" className="mb-0">
//                 <tbody>
//                   <tr>
//                     <td className="text-muted">Subtotal</td>
//                     <td className="text-end fw-medium">NPR {subTotal}</td>
//                   </tr>
//                   <tr>
//                     <td className="text-muted">Tax (10%)</td>
//                     <td className="text-end fw-medium">NPR {taxAmount}</td>
//                   </tr>
//                   <tr>
//                     <td className="text-muted">Delivery</td>
//                     <td className="text-end text-success">Free</td>
//                   </tr>
//                   <tr className="border-top">
//                     <td className="pt-3 h5 fw-bold">Total</td>
//                     <td className="pt-3 h5 fw-bold text-primary text-end">
//                       NPR {Number(finalAmount).toLocaleString()}
//                     </td>
//                   </tr>
//                 </tbody>
//               </Table>

//               <div className="mt-4 pt-3 border-top text-center">
//                 <small className="text-muted d-block mb-2">
//                   <ShieldCheck size={14} className="me-1 text-success" />
//                   100% Secure Transaction
//                 </small>
//                 <div className="d-flex justify-content-center gap-2 opacity-50">
//                   <CreditCard size={24} />
//                   <Truck size={24} />
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       <style>{` .hover-shadow:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); } `}</style>
//     </Container>
//   );
// };

// export default Payment;

// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import {
//   Form,
//   Button,
//   Col,
//   Row,
//   Card,
//   Container,
//   Alert,
//   Spinner,
//   Table,
// } from "react-bootstrap";
// import { CreditCard, Truck, ShieldCheck, Lock, Wallet } from "lucide-react";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import CheckoutSteps from "../components/CheckoutSteps";
// import { savePaymentMethod } from "../redux/actions/cartActions";

// // --- CONFIGURATION ---
// const API_BASE_URL = "http://localhost:5000/api";
// // Replace with your actual Publishable Key from Stripe Dashboard
// const STRIPE_PUBLIC_KEY = "pk_test_YOUR_STRIPE_PUBLISHABLE_KEY";
// const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// // ==============================================================================
// // INTERNAL COMPONENT: Stripe Form
// // ==============================================================================
// const StripeCheckoutForm = ({ amount }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [error, setError] = useState(null);
//   const [processing, setProcessing] = useState(false);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!stripe || !elements) return;

//     setProcessing(true);

//     const { error: submitError } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: `${window.location.origin}/payment-success?method=Stripe`,
//       },
//     });

//     if (submitError) {
//       setError(submitError.message);
//       setProcessing(false);
//     }
//   };

//   return (
//     <Form onSubmit={handleSubmit} className="mt-3 border-top pt-3">
//       <PaymentElement />
//       {error && (
//         <Alert variant="danger" className="mt-2">
//           {error}
//         </Alert>
//       )}
//       <Button
//         type="submit"
//         variant="primary"
//         className="w-100 mt-3 py-2 fw-bold"
//         disabled={!stripe || processing}
//       >
//         {processing ? <Spinner size="sm" /> : `Pay Rs. ${amount} securely`}
//       </Button>
//     </Form>
//   );
// };

// // ==============================================================================
// // MAIN COMPONENT: Payment Page
// // ==============================================================================
// const Payment = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [searchParams] = useSearchParams();

//   // 1. Get Order ID from URL (Passed from PlaceOrder page)
//   const orderId = searchParams.get("orderId");

//   // Redux State
//   const cart = useSelector((state) => state.cart);
//   const { totalPrice, cartItems } = cart;

//   // Local State
//   const [paymentMethod, setPaymentMethod] = useState("Khalti");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [clientSecret, setClientSecret] = useState("");

//   useEffect(() => {
//     if (!orderId) {
//       navigate("/placeorder");
//     }
//   }, [orderId, navigate]);

//   // --- HANDLER: Fetch Stripe Intent ---
//   const fetchStripeIntent = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/payments/create-stripe-intent`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ orderId }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setClientSecret(data.clientSecret);
//     } catch (err) {
//       setMessage("Failed to load Stripe: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- HANDLER: Initiate Khalti (Server-to-Server Redirect) ---
//   const handleKhaltiPayment = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       // Call YOUR Backend (which talks to a.khalti.com)
//       const res = await fetch(`${API_BASE_URL}/payments/khalti-initiate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ orderId }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Initiation failed");

//       if (data.payment_url) {
//         dispatch(savePaymentMethod("Khalti"));
//         // ✅ CRITICAL: Redirect the browser to Khalti
//         window.location.href = data.payment_url;
//       } else {
//         throw new Error("No payment URL received from Khalti.");
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Khalti Error: " + err.message);
//       setLoading(false);
//     }
//   };

//   // --- HANDLER: Cash on Delivery ---
//   const handleCOD = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/payments/cod`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ orderId }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       dispatch(savePaymentMethod("COD"));
//       navigate(`/payment-success?method=COD&id=${orderId}`);
//     } catch (err) {
//       setMessage("COD Error: " + err.message);
//       setLoading(false);
//     }
//   };

//   // --- HANDLER: Method Selection Change ---
//   const onMethodChange = (method) => {
//     setPaymentMethod(method);
//     setMessage("");
//     if (method === "Stripe" && !clientSecret) {
//       fetchStripeIntent();
//     }
//   };

//   const submitHandler = (e) => {
//     e.preventDefault();
//     if (paymentMethod === "Khalti") handleKhaltiPayment();
//     else if (paymentMethod === "COD") handleCOD();
//   };

//   return (
//     <Container className="py-5" style={{ minHeight: "80vh" }}>
//       <CheckoutSteps step1 step2 step3 />

//       <Row className="g-4 mt-3">
//         <Col lg={8}>
//           <Card className="border-0 shadow-sm rounded-4 h-100">
//             <Card.Header className="bg-white border-bottom p-4">
//               <h4 className="fw-bold mb-0 text-primary d-flex align-items-center">
//                 <ShieldCheck className="me-2" size={24} /> Secure Payment
//               </h4>
//             </Card.Header>
//             <Card.Body className="p-4">
//               {message && <Alert variant="danger">{message}</Alert>}

//               {/* Khalti Option */}
//               <div
//                 className={`p-3 mb-3 border rounded-3 cursor-pointer ${
//                   paymentMethod === "Khalti"
//                     ? "border-primary bg-primary bg-opacity-10"
//                     : ""
//                 }`}
//                 onClick={() => onMethodChange("Khalti")}
//               >
//                 <div className="d-flex align-items-center">
//                   <Form.Check
//                     type="radio"
//                     name="paymentMethod"
//                     checked={paymentMethod === "Khalti"}
//                     onChange={() => onMethodChange("Khalti")}
//                     className="me-3"
//                   />
//                   <div>
//                     <span className="d-block fw-bold d-flex align-items-center">
//                       <Wallet size={20} className="me-2 text-primary" /> Khalti
//                       Digital Wallet
//                     </span>
//                     <small className="text-muted">
//                       Pay with Khalti Balance or eBanking
//                     </small>
//                   </div>
//                 </div>
//               </div>

//               {/* Stripe Option */}
//               <div
//                 className={`p-3 mb-3 border rounded-3 cursor-pointer ${
//                   paymentMethod === "Stripe"
//                     ? "border-primary bg-primary bg-opacity-10"
//                     : ""
//                 }`}
//                 onClick={() => onMethodChange("Stripe")}
//               >
//                 <div className="d-flex align-items-center mb-2">
//                   <Form.Check
//                     type="radio"
//                     name="paymentMethod"
//                     checked={paymentMethod === "Stripe"}
//                     onChange={() => onMethodChange("Stripe")}
//                     className="me-3"
//                   />
//                   <div>
//                     <span className="d-block fw-bold d-flex align-items-center">
//                       <CreditCard size={20} className="me-2 text-info" /> Credit
//                       / Debit Card
//                     </span>
//                     <small className="text-muted">
//                       Visa, Mastercard, Amex (via Stripe)
//                     </small>
//                   </div>
//                 </div>

//                 {paymentMethod === "Stripe" && clientSecret && (
//                   <div className="bg-white p-3 rounded border">
//                     <Elements stripe={stripePromise} options={{ clientSecret }}>
//                       <StripeCheckoutForm amount={totalPrice} />
//                     </Elements>
//                   </div>
//                 )}
//                 {paymentMethod === "Stripe" && !clientSecret && (
//                   <div className="text-center py-3">
//                     <Spinner size="sm" animation="border" /> Loading secure card
//                     fields...
//                   </div>
//                 )}
//               </div>

//               {/* COD Option */}
//               <div
//                 className={`p-3 mb-3 border rounded-3 cursor-pointer ${
//                   paymentMethod === "COD"
//                     ? "border-success bg-success bg-opacity-10"
//                     : ""
//                 }`}
//                 onClick={() => onMethodChange("COD")}
//               >
//                 <div className="d-flex align-items-center">
//                   <Form.Check
//                     type="radio"
//                     name="paymentMethod"
//                     checked={paymentMethod === "COD"}
//                     onChange={() => onMethodChange("COD")}
//                     className="me-3"
//                   />
//                   <div>
//                     <span className="d-block fw-bold d-flex align-items-center">
//                       <Truck size={20} className="me-2 text-success" /> Cash on
//                       Delivery
//                     </span>
//                     <small className="text-muted">
//                       Pay securely when you receive your order.
//                     </small>
//                   </div>
//                 </div>
//               </div>

//               {paymentMethod !== "Stripe" && (
//                 <Button
//                   onClick={submitHandler}
//                   variant="primary"
//                   className="w-100 py-3 fw-bold rounded-pill mt-3 shadow-sm"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <Spinner animation="border" size="sm" className="me-2" />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <Lock size={18} className="me-2" />
//                       {paymentMethod === "COD"
//                         ? "Place Order"
//                         : `Pay Rs. ${totalPrice || 0}`}
//                     </>
//                   )}
//                 </Button>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col lg={4}>
//           <Card className="border-0 shadow-sm rounded-4 h-100 bg-light">
//             <Card.Header className="bg-transparent border-0 p-4 pb-0">
//               <h5 className="fw-bold text-dark mb-0">Order Summary</h5>
//             </Card.Header>
//             <Card.Body className="p-4">
//               {cartItems && (
//                 <div className="alert alert-info py-2 small mb-3">
//                   <strong>{cartItems.length}</strong> items in cart
//                 </div>
//               )}
//               <Table borderless size="sm" className="mb-0">
//                 <tbody>
//                   <tr>
//                     <td className="text-muted">Order ID</td>
//                     <td className="text-end font-monospace">
//                       {orderId ? `#${orderId.slice(-6)}` : "..."}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="text-muted">Total Amount</td>
//                     <td className="text-end fw-bold text-primary h5">
//                       Rs. {totalPrice}
//                     </td>
//                   </tr>
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Payment;

// import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import {
//   Form,
//   Button,
//   Col,
//   Row,
//   Card,
//   Container,
//   Alert,
//   Spinner,
//   Table,
// } from "react-bootstrap";
// import { CreditCard, Truck, ShieldCheck, Lock, Wallet } from "lucide-react";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import CheckoutSteps from "../components/CheckoutSteps";
// import { savePaymentMethod } from "../redux/actions/cartActions";

// // --- CONFIGURATION ---
// const API_BASE_URL = "http://localhost:5000/api";
// const STRIPE_PUBLIC_KEY = "pk_test_YOUR_STRIPE_PUBLISHABLE_KEY";
// const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// // ==============================================================================
// // INTERNAL COMPONENT: Stripe Form
// // ==============================================================================
// const StripeCheckoutForm = ({ amount }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [error, setError] = useState(null);
//   const [processing, setProcessing] = useState(false);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!stripe || !elements) return;

//     setProcessing(true);

//     const { error: submitError } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: `${window.location.origin}/payment-success?method=Stripe`,
//       },
//     });

//     if (submitError) {
//       setError(submitError.message);
//       setProcessing(false);
//     }
//   };

//   return (
//     <Form onSubmit={handleSubmit} className="mt-3 border-top pt-3">
//       <PaymentElement />
//       {error && (
//         <Alert variant="danger" className="mt-2">
//           {error}
//         </Alert>
//       )}
//       <Button
//         type="submit"
//         variant="primary"
//         className="w-100 mt-3 py-2 fw-bold"
//         disabled={!stripe || processing}
//       >
//         {processing ? <Spinner size="sm" /> : `Pay Rs. ${amount} securely`}
//       </Button>
//     </Form>
//   );
// };

// // ==============================================================================
// // MAIN COMPONENT: Payment Page
// // ==============================================================================
// const Payment = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [searchParams] = useSearchParams();

//   // ✅ FIX: Get Order ID AND Amount directly from URL
//   const orderId = searchParams.get("orderId");
//   const urlAmount = searchParams.get("amount");

//   // Fallback to 0 if amount is missing
//   const finalAmount = urlAmount ? Number(urlAmount) : 0;

//   // Local State
//   const [paymentMethod, setPaymentMethod] = useState("Khalti");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [clientSecret, setClientSecret] = useState("");

//   useEffect(() => {
//     if (!orderId) {
//       navigate("/placeorder");
//     }
//   }, [orderId, navigate]);

//   // --- HANDLER: Fetch Stripe Intent ---
//   const fetchStripeIntent = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/payments/create-stripe-intent`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ orderId }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setClientSecret(data.clientSecret);
//     } catch (err) {
//       setMessage("Failed to load Stripe: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- HANDLER: Initiate Khalti ---
//   const handleKhaltiPayment = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${API_BASE_URL}/payments/khalti-initiate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ orderId }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Initiation failed");

//       if (data.payment_url) {
//         dispatch(savePaymentMethod("Khalti"));
//         window.location.href = data.payment_url;
//       } else {
//         throw new Error("No payment URL received.");
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Khalti Error: " + err.message);
//       setLoading(false);
//     }
//   };

//   // --- HANDLER: Cash on Delivery ---
//   const handleCOD = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/payments/cod`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ orderId }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       dispatch(savePaymentMethod("COD"));
//       navigate(`/payment-success?method=COD&id=${orderId}`);
//     } catch (err) {
//       setMessage("COD Error: " + err.message);
//       setLoading(false);
//     }
//   };

//   const onMethodChange = (method) => {
//     setPaymentMethod(method);
//     setMessage("");
//     if (method === "Stripe" && !clientSecret) {
//       fetchStripeIntent();
//     }
//   };

//   const submitHandler = (e) => {
//     e.preventDefault();
//     if (paymentMethod === "Khalti") handleKhaltiPayment();
//     else if (paymentMethod === "COD") handleCOD();
//   };

//   return (
//     <Container className="py-5" style={{ minHeight: "80vh" }}>
//       <CheckoutSteps step1 step2 step3 />

//       <Row className="g-4 mt-3">
//         <Col lg={8}>
//           <Card className="border-0 shadow-sm rounded-4 h-100">
//             <Card.Header className="bg-white border-bottom p-4">
//               <h4 className="fw-bold mb-0 text-primary d-flex align-items-center">
//                 <ShieldCheck className="me-2" size={24} /> Secure Payment
//               </h4>
//             </Card.Header>
//             <Card.Body className="p-4">
//               {message && <Alert variant="danger">{message}</Alert>}

//               {/* Khalti Option */}
//               <div
//                 className={`p-3 mb-3 border rounded-3 cursor-pointer ${
//                   paymentMethod === "Khalti"
//                     ? "border-primary bg-primary bg-opacity-10"
//                     : ""
//                 }`}
//                 onClick={() => onMethodChange("Khalti")}
//               >
//                 <div className="d-flex align-items-center">
//                   <Form.Check
//                     type="radio"
//                     name="paymentMethod"
//                     checked={paymentMethod === "Khalti"}
//                     onChange={() => onMethodChange("Khalti")}
//                     className="me-3"
//                   />
//                   <div>
//                     <span className="d-block fw-bold d-flex align-items-center">
//                       <Wallet size={20} className="me-2 text-primary" /> Khalti
//                       Digital Wallet
//                     </span>
//                     <small className="text-muted">
//                       Pay with Khalti Balance or eBanking
//                     </small>
//                   </div>
//                 </div>
//               </div>

//               {/* Stripe Option */}
//               <div
//                 className={`p-3 mb-3 border rounded-3 cursor-pointer ${
//                   paymentMethod === "Stripe"
//                     ? "border-primary bg-primary bg-opacity-10"
//                     : ""
//                 }`}
//                 onClick={() => onMethodChange("Stripe")}
//               >
//                 <div className="d-flex align-items-center mb-2">
//                   <Form.Check
//                     type="radio"
//                     name="paymentMethod"
//                     checked={paymentMethod === "Stripe"}
//                     onChange={() => onMethodChange("Stripe")}
//                     className="me-3"
//                   />
//                   <div>
//                     <span className="d-block fw-bold d-flex align-items-center">
//                       <CreditCard size={20} className="me-2 text-info" /> Credit
//                       / Debit Card
//                     </span>
//                     <small className="text-muted">
//                       Visa, Mastercard, Amex (via Stripe)
//                     </small>
//                   </div>
//                 </div>

//                 {paymentMethod === "Stripe" && clientSecret && (
//                   <div className="bg-white p-3 rounded border">
//                     <Elements stripe={stripePromise} options={{ clientSecret }}>
//                       <StripeCheckoutForm amount={finalAmount} />
//                     </Elements>
//                   </div>
//                 )}
//                 {paymentMethod === "Stripe" && !clientSecret && (
//                   <div className="text-center py-3">
//                     <Spinner size="sm" animation="border" /> Loading secure card
//                     fields...
//                   </div>
//                 )}
//               </div>

//               {/* COD Option */}
//               <div
//                 className={`p-3 mb-3 border rounded-3 cursor-pointer ${
//                   paymentMethod === "COD"
//                     ? "border-success bg-success bg-opacity-10"
//                     : ""
//                 }`}
//                 onClick={() => onMethodChange("COD")}
//               >
//                 <div className="d-flex align-items-center">
//                   <Form.Check
//                     type="radio"
//                     name="paymentMethod"
//                     checked={paymentMethod === "COD"}
//                     onChange={() => onMethodChange("COD")}
//                     className="me-3"
//                   />
//                   <div>
//                     <span className="d-block fw-bold d-flex align-items-center">
//                       <Truck size={20} className="me-2 text-success" /> Cash on
//                       Delivery
//                     </span>
//                     <small className="text-muted">
//                       Pay securely when you receive your order.
//                     </small>
//                   </div>
//                 </div>
//               </div>

//               {paymentMethod !== "Stripe" && (
//                 <Button
//                   onClick={submitHandler}
//                   variant="primary"
//                   className="w-100 py-3 fw-bold rounded-pill mt-3 shadow-sm"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <Spinner animation="border" size="sm" className="me-2" />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <Lock size={18} className="me-2" />
//                       {paymentMethod === "COD"
//                         ? "Place Order"
//                         : `Pay Rs. ${finalAmount}`}
//                     </>
//                   )}
//                 </Button>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col lg={4}>
//           <Card className="border-0 shadow-sm rounded-4 h-100 bg-light">
//             <Card.Header className="bg-transparent border-0 p-4 pb-0">
//               <h5 className="fw-bold text-dark mb-0">Order Summary</h5>
//             </Card.Header>
//             <Card.Body className="p-4">
//               <Table borderless size="sm" className="mb-0">
//                 <tbody>
//                   <tr>
//                     <td className="text-muted">Order ID</td>
//                     <td className="text-end font-monospace">
//                       {orderId ? `#${orderId.slice(-6)}` : "..."}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="text-muted">Total Amount</td>
//                     <td className="text-end fw-bold text-primary h5">
//                       Rs. {finalAmount}
//                     </td>
//                   </tr>
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Payment;

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Form,
  Button,
  Col,
  Row,
  Card,
  Container,
  Alert,
  Spinner,
} from "react-bootstrap";
import { CreditCard, Truck, Lock, Wallet, ArrowLeft } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../redux/actions/cartActions";

// --- CONFIGURATION ---
const API_BASE_URL = "http://localhost:5000/api";
const STRIPE_PUBLIC_KEY = "pk_test_YOUR_STRIPE_PUBLISHABLE_KEY";
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// ==============================================================================
// INTERNAL COMPONENT: Stripe Form
// ==============================================================================
const StripeCheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?method=Stripe`,
      },
    });

    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3 pt-3">
      <PaymentElement />
      {error && (
        <Alert variant="danger" className="mt-3 py-2 small">
          {error}
        </Alert>
      )}
      <Button
        type="submit"
        variant="warning"
        className="w-100 mt-4 py-2 shadow-sm border-0"
        style={{
          backgroundColor: "#FFD814",
          borderRadius: "8px",
          color: "#0F1111",
          fontWeight: "500",
        }}
        disabled={!stripe || processing}
      >
        {processing ? <Spinner size="sm" /> : `Use this payment method`}
      </Button>
    </Form>
  );
};

// ==============================================================================
// MAIN COMPONENT: Payment Page
// ==============================================================================
const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // ✅ FIX: Get Order ID AND Amount directly from URL
  const orderId = searchParams.get("orderId");
  const urlAmount = searchParams.get("amount");

  // Fallback to 0 if amount is missing
  const finalAmount = urlAmount ? Number(urlAmount) : 0;

  // Local State
  const [paymentMethod, setPaymentMethod] = useState("Khalti");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!orderId) {
      navigate("/placeorder");
    }
  }, [orderId, navigate]);

  // --- HANDLER: Fetch Stripe Intent ---
  const fetchStripeIntent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/payments/create-stripe-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setClientSecret(data.clientSecret);
    } catch (err) {
      setMessage("Failed to load Stripe: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER: Initiate Khalti ---
  const handleKhaltiPayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/payments/khalti-initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Initiation failed");

      if (data.payment_url) {
        dispatch(savePaymentMethod("Khalti"));
        window.location.href = data.payment_url;
      } else {
        throw new Error("No payment URL received.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Khalti Error: " + err.message);
      setLoading(false);
    }
  };

  // --- HANDLER: Cash on Delivery ---
  const handleCOD = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/payments/cod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      dispatch(savePaymentMethod("COD"));
      navigate(`/payment-success?method=COD&id=${orderId}`);
    } catch (err) {
      setMessage("COD Error: " + err.message);
      setLoading(false);
    }
  };

  const onMethodChange = (method) => {
    setPaymentMethod(method);
    setMessage("");
    if (method === "Stripe" && !clientSecret) {
      fetchStripeIntent();
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (paymentMethod === "Khalti") handleKhaltiPayment();
    else if (paymentMethod === "COD") handleCOD();
  };

  return (
    <div
      style={{
        backgroundColor: "#f0f2f2",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <Container className="py-4">
        {/* ✅ NEW: Back Button */}
        <div className="mb-3">
          <Button
            variant="link"
            className="text-decoration-none text-dark p-0 d-flex align-items-center"
            style={{ width: "fit-content" }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="me-1" /> Return to Shipping
          </Button>
        </div>

        {/* Checkout Steps Indicator */}
        <div className="mb-4">
          <CheckoutSteps step1 step2 step3 />
        </div>

        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-3 h-100">
              <Card.Header className="bg-white border-bottom p-4">
                <h3 className="fw-normal mb-0 d-flex align-items-center">
                  Select a payment method
                </h3>
              </Card.Header>
              <Card.Body className="p-4">
                {message && (
                  <Alert variant="danger" className="py-2 small">
                    {message}
                  </Alert>
                )}

                <div className="border rounded-3 overflow-hidden">
                  {/* Khalti Option */}
                  <div
                    className={`p-3 border-bottom cursor-pointer ${
                      paymentMethod === "Khalti" ? "bg-light" : "bg-white"
                    }`}
                    onClick={() => onMethodChange("Khalti")}
                    style={{ transition: "background-color 0.2s ease" }}
                  >
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "Khalti"}
                        onChange={() => onMethodChange("Khalti")}
                        className="me-3"
                        id="khalti-radio"
                      />
                      <label
                        htmlFor="khalti-radio"
                        className="w-100 d-flex flex-column m-0"
                        style={{ cursor: "pointer" }}
                      >
                        <span className="fw-bold text-dark d-flex align-items-center">
                          <Wallet
                            size={18}
                            className="me-2"
                            style={{ color: "#5E35B1" }}
                          />{" "}
                          Khalti Digital Wallet
                        </span>
                        <small className="text-muted ms-4 ps-1">
                          Pay with Khalti Balance, eBanking, or Mobile Banking
                        </small>
                      </label>
                    </div>
                  </div>

                  {/* Stripe Option */}
                  <div
                    className={`p-3 border-bottom cursor-pointer ${
                      paymentMethod === "Stripe" ? "bg-light" : "bg-white"
                    }`}
                    onClick={() => onMethodChange("Stripe")}
                    style={{ transition: "background-color 0.2s ease" }}
                  >
                    <div className="d-flex align-items-center mb-1">
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "Stripe"}
                        onChange={() => onMethodChange("Stripe")}
                        className="me-3"
                        id="stripe-radio"
                      />
                      <label
                        htmlFor="stripe-radio"
                        className="w-100 d-flex flex-column m-0"
                        style={{ cursor: "pointer" }}
                      >
                        <span className="fw-bold text-dark d-flex align-items-center">
                          <CreditCard
                            size={18}
                            className="me-2"
                            style={{ color: "#007185" }}
                          />{" "}
                          Credit or Debit Card
                        </span>
                        <small className="text-muted ms-4 ps-1">
                          Visa, Mastercard, Amex
                        </small>
                      </label>
                    </div>

                    {paymentMethod === "Stripe" && clientSecret && (
                      <div className="ms-4 ps-4 pe-2 mt-3 mb-2 animate-fade-in">
                        <Elements
                          stripe={stripePromise}
                          options={{ clientSecret }}
                        >
                          <StripeCheckoutForm amount={finalAmount} />
                        </Elements>
                      </div>
                    )}
                    {paymentMethod === "Stripe" && !clientSecret && (
                      <div className="ms-4 ps-4 mt-3 mb-2 text-muted small">
                        <Spinner
                          size="sm"
                          animation="border"
                          className="me-2"
                        />{" "}
                        Secure connection established...
                      </div>
                    )}
                  </div>

                  {/* COD Option */}
                  <div
                    className={`p-3 cursor-pointer ${
                      paymentMethod === "COD" ? "bg-light" : "bg-white"
                    }`}
                    onClick={() => onMethodChange("COD")}
                    style={{ transition: "background-color 0.2s ease" }}
                  >
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "COD"}
                        onChange={() => onMethodChange("COD")}
                        className="me-3"
                        id="cod-radio"
                      />
                      <label
                        htmlFor="cod-radio"
                        className="w-100 d-flex flex-column m-0"
                        style={{ cursor: "pointer" }}
                      >
                        <span className="fw-bold text-dark d-flex align-items-center">
                          <Truck size={18} className="me-2 text-success" /> Cash
                          on Delivery (COD)
                        </span>
                        <small className="text-muted ms-4 ps-1">
                          Pay by cash when your package arrives.
                        </small>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit button for Non-Stripe Methods */}
                {paymentMethod !== "Stripe" && (
                  <div className="mt-4 pt-3 border-top">
                    <Button
                      onClick={submitHandler}
                      variant="warning"
                      className="py-2 shadow-sm border-0 d-block ms-auto px-5"
                      style={{
                        backgroundColor: "#FFD814",
                        borderRadius: "8px",
                        color: "#0F1111",
                        fontWeight: "500",
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Processing...
                        </>
                      ) : (
                        `Use this payment method`
                      )}
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar Summary */}
          <Col lg={4}>
            <Card
              className="border-0 shadow-sm rounded-3 bg-white sticky-top"
              style={{ top: "20px" }}
            >
              <Card.Body className="p-4">
                <Button
                  onClick={
                    paymentMethod !== "Stripe"
                      ? submitHandler
                      : () => {
                          document
                            .querySelector("form")
                            .dispatchEvent(
                              new Event("submit", {
                                cancelable: true,
                                bubbles: true,
                              }),
                            );
                        }
                  }
                  variant="warning"
                  className="w-100 py-2 shadow-sm border-0 mb-3"
                  style={{
                    backgroundColor: "#FFD814",
                    borderRadius: "8px",
                    color: "#0F1111",
                    fontWeight: "500",
                    fontSize: "0.95rem",
                  }}
                  disabled={
                    loading || (paymentMethod === "Stripe" && !clientSecret)
                  }
                >
                  Place your order
                </Button>
                <div className="text-center mb-3 border-bottom pb-3">
                  <small
                    className="text-muted"
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1.2",
                      display: "block",
                    }}
                  >
                    By placing your order, you agree to PharmacyStore's privacy
                    notice and conditions of use.
                  </small>
                </div>

                <h5 className="fw-bold text-dark mb-3">Order Summary</h5>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">Order Ref:</span>
                  <span className="font-monospace text-dark">
                    {orderId ? `#${orderId.slice(-6).toUpperCase()}` : "..."}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between align-items-center fw-bold text-danger h5 mt-3 mb-0">
                  <span>Order Total:</span>
                  <span>NPR {finalAmount.toFixed(2)}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Payment;
