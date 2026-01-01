// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Form, Button, Col, Card, Row, Table, Alert } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import FormContainer from "../components/FormContainer/FormContainer";
// import CheckoutSteps from "../components/CheckoutSteps";
// import { savePaymentMethod } from "../redux/actions/cartActions";

// // Stripe and Khalti keys -- replace with real keys in production!
// const STRIPE_PUBLIC_KEY =
//   "pk_test_51SZ3HcAgufYbIAmejyFQscH1Zt6s2Vk3AY3CWdMSmEnwxL01QSmfF4CKjdJciwlsaMjKlrX5CqUURq4BqcmViYc2003TDl2Vu9";
// const KHALTI_PUBLIC_KEY = "168fa21351e64a2d998016e2093aaae4";
// const API_BASE_URL = "http://localhost:5000/api";

// const Payment = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   // Get cart info (Redux logic)
//   const cart = useSelector((state) => state.cart);
//   const userState = useSelector((state) => state.userLogin || {});
//   const { shippingAddress, orderId, totalPrice, items } = cart;
//   const loggedInUser = userState.userInfo;

//   // Parse query params from CustomerDashboard
//   const searchParams = new URLSearchParams(location.search);
//   const orderIdFromQuery = searchParams.get("orderId");
//   const amountFromQuery = searchParams.get("amount");

//   // State management
//   const [paymentMethod, setPaymentMethod] = useState("Khalti");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [stripePromise, setStripePromise] = useState(null);

//   // Use query params if present (dashboard "Pay Now"), else Redux/cart
//   const paymentOrderId = orderIdFromQuery || orderId;
//   const paymentAmount = Number(amountFromQuery) || Number(totalPrice) || 1000;
//   const taxAmount = (paymentAmount * 0.1).toFixed(2);
//   const finalAmount = (paymentAmount * 1.1).toFixed(2);

//   // Checkout steps state
//   const step1 = true; // Sign In
//   const step2 = !!shippingAddress; // Shipping
//   const step3 = true; // Payment (current)
//   const step4 = false; // Place Order

//   useEffect(() => {
//     // Initialize Stripe
//     loadStripe(STRIPE_PUBLIC_KEY).then(setStripePromise);

//     // Redirect if no shipping address
//     if (!shippingAddress && !orderIdFromQuery) {
//       navigate("/shipping");
//     }
//   }, [shippingAddress, navigate, orderIdFromQuery]);

//   // Stripe payment using backend
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
//             amount: finalAmount * 100, // Stripe uses cents
//             orderId: paymentOrderId,
//             medicineName: items?.[0]?.name || "Order Prescription",
//             customerEmail: loggedInUser?.email,
//           }),
//         }
//       );

//       const data = await res.json();
//       if (!res.ok) {
//         setMessage(data.message || "Stripe payment error.");
//         return;
//       }

//       await stripe.redirectToCheckout({ sessionId: data.sessionId });
//     } catch (error) {
//       setMessage("Stripe payment initiation failed.");
//       console.error("Stripe error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Khalti popup/widget payment (NPR)
//   const handleKhaltiPayment = async () => {
//     if (!window.KhaltiCheckout) {
//       setMessage("Khalti SDK not loaded. Please refresh the page.");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     const khaltiConfig = {
//       publicKey: KHALTI_PUBLIC_KEY,
//       productIdentity: paymentOrderId || "demo",
//       productName: "Pharmacy Order",
//       productUrl: window.location.origin,
//       eventHandler: {
//         onSuccess: async (payload) => {
//           try {
//             // Backend verify after payment
//             const token = localStorage.getItem("token");
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
//               setMessage("✅ Khalti Payment Success! Redirecting...");
//               setTimeout(() => navigate("/placeorder"), 1500);
//             } else {
//               setMessage("❌ Khalti Payment Verification Failed!");
//             }
//           } catch (error) {
//             setMessage("❌ Payment verification error.");
//           }
//         },
//         onError: () => {
//           setMessage("❌ Khalti Payment Failed!");
//           setLoading(false);
//         },
//         onClose: () => {
//           setLoading(false);
//         },
//       },
//     };

//     const checkout = new window.KhaltiCheckout(khaltiConfig);
//     checkout.show({ amount: paymentAmount * 100 }); // NPR to paisa
//   };

//   // COD handler
//   const handleCOD = () => {
//     dispatch(savePaymentMethod("COD"));
//     setMessage("✅ COD selected! Redirecting...");
//     setTimeout(() => navigate("/placeorder"), 1000);
//   };

//   // Main submit handler
//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     if (paymentMethod === "Stripe") {
//       await handleStripePayment();
//     } else if (paymentMethod === "Khalti") {
//       handleKhaltiPayment();
//     } else if (paymentMethod === "COD") {
//       handleCOD();
//     }
//   };

//   return (
//     <>
//       {/* ✅ Updated CheckoutSteps with all 4 steps */}
//       <CheckoutSteps step1={step1} step2={step2} step3={step3} step4={step4} />

//       <FormContainer>
//         <Row>
//           {/* Payment Methods (Left Column) */}
//           <Col md={8}>
//             <Card className="shadow-lg border-0">
//               <Card.Header className="bg-gradient-primary text-white p-4">
//                 <h4 className="mb-0">
//                   <i className="fas fa-credit-card me-2"></i>
//                   Choose Payment Method
//                 </h4>
//               </Card.Header>
//               <Card.Body className="p-4">
//                 <Form onSubmit={submitHandler}>
//                   <Form.Group className="mb-4">
//                     <Form.Label as="legend" className="fw-bold fs-5 mb-3">
//                       Select Your Payment Method
//                     </Form.Label>

//                     {/* Khalti */}
//                     <div
//                       className={`payment-card p-4 mb-3 border rounded-4 cursor-pointer transition-all ${
//                         paymentMethod === "Khalti"
//                           ? "border-primary shadow-lg bg-primary-subtle"
//                           : "border-secondary-subtle hover-border-primary"
//                       }`}
//                       onClick={() => setPaymentMethod("Khalti")}
//                     >
//                       <Form.Check
//                         type="radio"
//                         label={
//                           <div className="d-flex align-items-center">
//                             <img
//                               src="https://khalti.com/assets/img/khalti-logo.svg"
//                               alt="Khalti"
//                               className="me-3"
//                               style={{ height: "40px" }}
//                             />
//                             <div>
//                               <div className="fw-bold">Khalti Wallet</div>
//                               <small className="text-muted">
//                                 Fast & Secure Digital Wallet
//                               </small>
//                             </div>
//                           </div>
//                         }
//                         id="Khalti"
//                         name="paymentMethod"
//                         value="Khalti"
//                         checked={paymentMethod === "Khalti"}
//                         onChange={(e) => setPaymentMethod(e.target.value)}
//                       />
//                     </div>

//                     {/* Stripe */}
//                     <div
//                       className={`payment-card p-4 mb-3 border rounded-4 cursor-pointer transition-all ${
//                         paymentMethod === "Stripe"
//                           ? "border-primary shadow-lg bg-primary-subtle"
//                           : "border-secondary-subtle hover-border-primary"
//                       }`}
//                       onClick={() => setPaymentMethod("Stripe")}
//                     >
//                       <Form.Check
//                         type="radio"
//                         label={
//                           <div className="d-flex align-items-center">
//                             <i className="fab fa-cc-stripe fa-2x text-primary me-3"></i>
//                             <div>
//                               <div className="fw-bold">Stripe (Card)</div>
//                               <small className="text-muted">
//                                 All Credit/Debit Cards
//                               </small>
//                             </div>
//                           </div>
//                         }
//                         id="Stripe"
//                         name="paymentMethod"
//                         value="Stripe"
//                         checked={paymentMethod === "Stripe"}
//                         onChange={(e) => setPaymentMethod(e.target.value)}
//                       />
//                     </div>

//                     {/* COD */}
//                     <div
//                       className={`payment-card p-4 mb-4 border rounded-4 cursor-pointer transition-all ${
//                         paymentMethod === "COD"
//                           ? "border-success shadow-lg bg-success-subtle"
//                           : "border-secondary-subtle hover-border-primary"
//                       }`}
//                       onClick={() => setPaymentMethod("COD")}
//                     >
//                       <Form.Check
//                         type="radio"
//                         label={
//                           <div className="d-flex align-items-center">
//                             <i className="fas fa-truck fa-2x text-success me-3"></i>
//                             <div>
//                               <div className="fw-bold">Cash on Delivery</div>
//                               <small className="text-muted">
//                                 Pay when delivered
//                               </small>
//                             </div>
//                           </div>
//                         }
//                         id="COD"
//                         name="paymentMethod"
//                         value="COD"
//                         checked={paymentMethod === "COD"}
//                         onChange={(e) => setPaymentMethod(e.target.value)}
//                       />
//                     </div>
//                   </Form.Group>
//                 </Form>
//               </Card.Body>
//             </Card>
//           </Col>

//           {/* Order Summary (Right Column) */}
//           <Col md={4}>
//             <Card
//               className="shadow-lg border-0 h-100 sticky-top"
//               style={{ top: "20px" }}
//             >
//               <Card.Header className="bg-light border-0">
//                 <h5 className="mb-0 fw-bold text-primary">Order Summary</h5>
//               </Card.Header>
//               <Card.Body>
//                 <Table className="mb-0">
//                   <tbody>
//                     <tr>
//                       <td>Subtotal:</td>
//                       <td className="text-end fw-semibold">
//                         Rs{paymentAmount}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td>Tax (10%):</td>
//                       <td className="text-end">Rs{taxAmount}</td>
//                     </tr>
//                     <tr className="border-top">
//                       <td className="fw-bold h6 mb-0">Total:</td>
//                       <td className="text-end h5 mb-0 text-primary fw-bold">
//                         ₹{finalAmount}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </Table>

//                 <div className="mt-4 pt-3 border-top">
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <span className="fw-bold">Order ID:</span>
//                     <span className="fw-semibold text-primary">
//                       #{paymentOrderId}
//                     </span>
//                   </div>

//                   <Button
//                     variant="primary"
//                     size="lg"
//                     className="w-100 rounded-pill px-4 py-2 fw-bold shadow-lg mb-2"
//                     onClick={submitHandler}
//                     disabled={loading || !paymentMethod}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2"></span>
//                         Processing...
//                       </>
//                     ) : (
//                       `Pay Rs${finalAmount} Now`
//                     )}
//                   </Button>

//                   <Button
//                     variant="outline-secondary"
//                     size="lg"
//                     className="w-100 rounded-pill"
//                     onClick={() => navigate(-1)}
//                     disabled={loading}
//                   >
//                     ← Back
//                   </Button>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Messages */}
//         {message && (
//           <Alert
//             variant={
//               message.includes("Success") || message.includes("✅")
//                 ? "success"
//                 : "danger"
//             }
//             className="mt-4 shadow-sm"
//           >
//             {message}
//           </Alert>
//         )}

//         {/* Khalti SDK Note */}
//         <div className="mt-4 text-center text-muted small p-3 bg-light rounded-3">
//           <i className="fas fa-info-circle me-2"></i>
//           Make sure to add Khalti SDK via script in your index.html:
//           <br />
//           <code>
//             &lt;script
//             src="https://khalti.com/static/khalti-checkout.js"&gt;&lt;/script&gt;
//           </code>
//         </div>
//       </FormContainer>
//     </>
//   );
// };

// export default Payment;
///////////////////////////////////////////////////////////////////////////////////////////
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
//   Badge,
//   Container,
// } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import CheckoutSteps from "../components/CheckoutSteps";
// import { savePaymentMethod } from "../redux/actions/cartActions";

// // Stripe and Khalti keys -- replace with real keys in production!
// const STRIPE_PUBLIC_KEY =
//   "pk_test_51SZ3HcAgufYbIAmejyFQscH1Zt6s2Vk3AY3CWdMSmEnwxL01QSmfF4CKjdJciwlsaMjKlrX5CqUURq4BqcmViYc2003TDl2Vu9";
// const KHALTI_PUBLIC_KEY = "168fa21351e64a2d998016e2093aaae4";
// const API_BASE_URL = "http://localhost:5000/api";

// const Payment = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   // Get cart info (Redux logic)
//   const cart = useSelector((state) => state.cart);
//   const userState = useSelector((state) => state.userLogin || {});
//   const { shippingAddress, orderId, totalPrice, items } = cart;
//   const loggedInUser = userState.userInfo;

//   // Parse query params from CustomerDashboard or Redirects
//   const searchParams = new URLSearchParams(location.search);
//   const orderIdFromQuery = searchParams.get("orderId");
//   const amountFromQuery = searchParams.get("amount");

//   // State management
//   const [paymentMethod, setPaymentMethod] = useState("Khalti");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [stripePromise, setStripePromise] = useState(null);

//   // Use query params if present (dashboard "Pay Now"), else Redux/cart
//   const paymentOrderId = orderIdFromQuery || orderId;
//   const paymentAmount = Number(amountFromQuery) || Number(totalPrice) || 1000; // Default fallback to prevent NaN
//   const taxAmount = (paymentAmount * 0.1).toFixed(2);
//   const finalAmount = (paymentAmount * 1.1).toFixed(2);

//   // Checkout steps state
//   const step1 = true; // Sign In
//   const step2 = !!shippingAddress; // Shipping
//   const step3 = true; // Payment (current)
//   const step4 = !!paymentOrderId; // If Order ID exists, Step 4 is "Active/Done"

//   useEffect(() => {
//     // Initialize Stripe
//     loadStripe(STRIPE_PUBLIC_KEY).then(setStripePromise);

//     // Redirect if no shipping address and not paying for an existing order
//     if (!shippingAddress.address && !orderIdFromQuery) {
//       navigate("/shipping");
//     }
//   }, [shippingAddress, navigate, orderIdFromQuery]);

//   // Stripe payment using backend
//   const handleStripePayment = async () => {
//     if (!paymentOrderId) {
//       setMessage("Order ID missing. Please place order first.");
//       return;
//     }
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
//             amount: Math.round(finalAmount * 100), // Stripe uses cents (Integer)
//             orderId: paymentOrderId,
//             medicineName: "Pharmacy Order", // Generic name if items not loaded
//             customerEmail: loggedInUser?.email,
//           }),
//         }
//       );

//       const data = await res.json();
//       if (!res.ok) {
//         setMessage(data.message || "Stripe payment error.");
//         return;
//       }

//       await stripe.redirectToCheckout({ sessionId: data.sessionId });
//     } catch (error) {
//       setMessage("Stripe payment initiation failed.");
//       console.error("Stripe error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Khalti popup/widget payment (NPR)
//   const handleKhaltiPayment = async () => {
//     if (!paymentOrderId) {
//       setMessage("Order ID missing. Please place order first.");
//       return;
//     }

//     if (!window.KhaltiCheckout) {
//       setMessage("Khalti SDK not loaded. Please refresh the page.");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     const khaltiConfig = {
//       publicKey: KHALTI_PUBLIC_KEY,
//       productIdentity: paymentOrderId || "demo_order",
//       productName: "Pharmacy Order",
//       productUrl: window.location.origin,
//       eventHandler: {
//         onSuccess: async (payload) => {
//           try {
//             // Backend verify after payment
//             const token = localStorage.getItem("token");
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
//               setMessage("✅ Khalti Payment Success! Redirecting...");
//               // ✅ FIX: Redirect to Payment Success page, NOT PlaceOrder loop
//               setTimeout(() => navigate("/payment-success"), 1500);
//             } else {
//               setMessage("❌ Khalti Payment Verification Failed!");
//             }
//           } catch (error) {
//             setMessage("❌ Payment verification error.");
//           } finally {
//             setLoading(false);
//           }
//         },
//         onError: (error) => {
//           console.error(error);
//           setMessage("❌ Khalti Payment Failed!");
//           setLoading(false);
//         },
//         onClose: () => {
//           setLoading(false);
//         },
//       },
//     };

//     const checkout = new window.KhaltiCheckout(khaltiConfig);
//     checkout.show({ amount: Math.round(finalAmount * 100) }); // NPR to paisa
//   };

//   // COD handler
//   const handleCOD = () => {
//     // For COD, we just save the method and go to Review/PlaceOrder page
//     dispatch(savePaymentMethod("COD"));
//     setMessage("✅ COD selected! Redirecting to review...");
//     setTimeout(() => navigate("/placeorder"), 500);
//   };

//   // Main submit handler
//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     if (paymentMethod === "Stripe") {
//       await handleStripePayment();
//     } else if (paymentMethod === "Khalti") {
//       handleKhaltiPayment();
//     } else if (paymentMethod === "COD") {
//       handleCOD();
//     }
//   };

//   return (
//     <Container className="my-5">
//       {/* Checkout Steps */}
//       <CheckoutSteps step1={step1} step2={step2} step3={step3} step4={step4} />

//       <Row>
//         {/* Payment Methods (Left Column) */}
//         <Col md={8}>
//           <Card className="shadow-lg border-0 mb-4">
//             <Card.Header className="bg-primary text-white p-4">
//               <h4 className="mb-0">
//                 <i className="fas fa-credit-card me-2"></i>
//                 Choose Payment Method
//               </h4>
//             </Card.Header>
//             <Card.Body className="p-4">
//               <Form onSubmit={submitHandler}>
//                 <Form.Group className="mb-4">
//                   <Form.Label as="legend" className="fw-bold fs-5 mb-3">
//                     Select Your Payment Method
//                   </Form.Label>

//                   {/* Khalti */}
//                   <div
//                     className={`p-3 mb-3 border rounded-3 cursor-pointer transition-all ${
//                       paymentMethod === "Khalti"
//                         ? "border-primary bg-light shadow-sm"
//                         : "border-light"
//                     }`}
//                     onClick={() => setPaymentMethod("Khalti")}
//                     style={{
//                       cursor: "pointer",
//                       borderLeft:
//                         paymentMethod === "Khalti" ? "5px solid #0d6efd" : "",
//                     }}
//                   >
//                     <Form.Check
//                       type="radio"
//                       label={
//                         <div className="d-flex align-items-center">
//                           <img
//                             src="https://web.khalti.com/static/img/logo1.png"
//                             alt="Khalti"
//                             className="me-3"
//                             style={{ height: "30px" }}
//                           />
//                           <div>
//                             <div className="fw-bold">Khalti Wallet</div>
//                             <small className="text-muted">
//                               Fast & Secure Digital Wallet
//                             </small>
//                           </div>
//                         </div>
//                       }
//                       id="Khalti"
//                       name="paymentMethod"
//                       value="Khalti"
//                       checked={paymentMethod === "Khalti"}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                     />
//                   </div>

//                   {/* Stripe */}
//                   <div
//                     className={`p-3 mb-3 border rounded-3 cursor-pointer transition-all ${
//                       paymentMethod === "Stripe"
//                         ? "border-primary bg-light shadow-sm"
//                         : "border-light"
//                     }`}
//                     onClick={() => setPaymentMethod("Stripe")}
//                     style={{
//                       cursor: "pointer",
//                       borderLeft:
//                         paymentMethod === "Stripe" ? "5px solid #0d6efd" : "",
//                     }}
//                   >
//                     <Form.Check
//                       type="radio"
//                       label={
//                         <div className="d-flex align-items-center">
//                           <i className="fab fa-cc-stripe fa-2x text-primary me-3"></i>
//                           <div>
//                             <div className="fw-bold">Stripe (Card)</div>
//                             <small className="text-muted">
//                               Credit/Debit Cards (Visa/Mastercard)
//                             </small>
//                           </div>
//                         </div>
//                       }
//                       id="Stripe"
//                       name="paymentMethod"
//                       value="Stripe"
//                       checked={paymentMethod === "Stripe"}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                     />
//                   </div>

//                   {/* COD */}
//                   <div
//                     className={`p-3 mb-3 border rounded-3 cursor-pointer transition-all ${
//                       paymentMethod === "COD"
//                         ? "border-success bg-light shadow-sm"
//                         : "border-light"
//                     }`}
//                     onClick={() => setPaymentMethod("COD")}
//                     style={{
//                       cursor: "pointer",
//                       borderLeft:
//                         paymentMethod === "COD" ? "5px solid #198754" : "",
//                     }}
//                   >
//                     <Form.Check
//                       type="radio"
//                       label={
//                         <div className="d-flex align-items-center">
//                           <i className="fas fa-truck fa-2x text-success me-3"></i>
//                           <div>
//                             <div className="fw-bold">Cash on Delivery</div>
//                             <small className="text-muted">
//                               Pay when delivered
//                             </small>
//                           </div>
//                         </div>
//                       }
//                       id="COD"
//                       name="paymentMethod"
//                       value="COD"
//                       checked={paymentMethod === "COD"}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                     />
//                   </div>
//                 </Form.Group>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Order Summary (Right Column) */}
//         <Col md={4}>
//           <Card
//             className="shadow-lg border-0 h-100 sticky-top"
//             style={{ top: "20px" }}
//           >
//             <Card.Header className="bg-light border-0">
//               <h5 className="mb-0 fw-bold text-primary">Order Summary</h5>
//             </Card.Header>
//             <Card.Body>
//               <Table className="mb-0">
//                 <tbody>
//                   <tr>
//                     <td>Subtotal:</td>
//                     <td className="text-end fw-semibold">₹{paymentAmount}</td>
//                   </tr>
//                   <tr>
//                     <td>Tax (10%):</td>
//                     <td className="text-end">₹{taxAmount}</td>
//                   </tr>
//                   <tr className="border-top">
//                     <td className="fw-bold h6 mb-0">Total:</td>
//                     <td className="text-end h5 mb-0 text-primary fw-bold">
//                       ₹{finalAmount}
//                     </td>
//                   </tr>
//                 </tbody>
//               </Table>

//               <div className="mt-4 pt-3 border-top">
//                 {paymentOrderId && (
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <span className="fw-bold">Order ID:</span>
//                     <Badge bg="info">#{paymentOrderId}</Badge>
//                   </div>
//                 )}

//                 <Button
//                   variant="primary"
//                   size="lg"
//                   className="w-100 rounded-pill px-4 py-2 fw-bold shadow-lg mb-2"
//                   onClick={submitHandler}
//                   disabled={loading || !paymentMethod}
//                 >
//                   {loading ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2"></span>
//                       Processing...
//                     </>
//                   ) : paymentMethod === "COD" ? (
//                     "Continue"
//                   ) : (
//                     `Pay ₹${finalAmount}`
//                   )}
//                 </Button>

//                 <Button
//                   variant="outline-secondary"
//                   size="lg"
//                   className="w-100 rounded-pill"
//                   onClick={() => navigate(-1)}
//                   disabled={loading}
//                 >
//                   ← Back
//                 </Button>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Messages */}
//       {message && (
//         <Alert
//           variant={
//             message.includes("Success") || message.includes("✅")
//               ? "success"
//               : "danger"
//           }
//           className="mt-4 shadow-sm"
//         >
//           {message}
//         </Alert>
//       )}

//       {/* Khalti SDK Info */}
//       <div className="mt-4 text-center text-muted small p-3 bg-light rounded-3">
//         <i className="fas fa-info-circle me-2"></i>
//         Secure Payment processed by Khalti/Stripe.
//       </div>
//     </Container>
//   );
// };

// export default Payment;

// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Form, Button, Col, Card, Row, Table, Alert } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import FormContainer from "../components/FormContainer/FormContainer";
// import CheckoutSteps from "../components/CheckoutSteps";
// import { savePaymentMethod } from "../redux/actions/cartActions";

// // Stripe and Khalti keys -- replace with real keys in production!
// const STRIPE_PUBLIC_KEY =
//   "pk_test_51SZ3HcAgufYbIAmejyFQscH1Zt6s2Vk3AY3CWdMSmEnwxL01QSmfF4CKjdJciwlsaMjKlrX5CqUURq4BqcmViYc2003TDl2Vu9";
// const KHALTI_PUBLIC_KEY = "168fa21351e64a2d998016e2093aaae4";
// const API_BASE_URL = "http://localhost:5000/api";

// const Payment = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   // Get cart info (Redux logic)
//   const cart = useSelector((state) => state.cart);
//   const userState = useSelector((state) => state.userLogin || {});
//   const { shippingAddress, orderId, totalPrice, items } = cart;
//   const loggedInUser = userState.userInfo;

//   // Parse query params from CustomerDashboard
//   const searchParams = new URLSearchParams(location.search);
//   const orderIdFromQuery = searchParams.get("orderId");
//   const amountFromQuery = searchParams.get("amount");

//   // State management
//   const [paymentMethod, setPaymentMethod] = useState("Khalti");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [stripePromise, setStripePromise] = useState(null);

//   // Use query params if present (dashboard "Pay Now"), else Redux/cart (no hard-coded fallback)
//   const rawAmount =
//     amountFromQuery !== null && amountFromQuery !== ""
//       ? Number(amountFromQuery)
//       : Number(totalPrice || 0);

//   const paymentAmount =
//     Number.isFinite(rawAmount) && rawAmount > 0 ? rawAmount : 0;

//   const taxRate = 0.1;
//   const taxAmount = (paymentAmount * taxRate).toFixed(2);
//   const finalAmount = (paymentAmount * (1 + taxRate)).toFixed(2);

//   const paymentOrderId = orderIdFromQuery || orderId || "—";

//   // Checkout steps state
//   const step1 = true; // Sign In
//   const step2 = !!shippingAddress; // Shipping
//   const step3 = true; // Payment (current)
//   const step4 = false; // Place Order

//   useEffect(() => {
//     // Initialize Stripe
//     loadStripe(STRIPE_PUBLIC_KEY).then(setStripePromise);

//     // Redirect if nothing to pay
//     if (!shippingAddress && !orderIdFromQuery && !paymentAmount) {
//       navigate("/shipping");
//     }
//   }, [shippingAddress, navigate, orderIdFromQuery, paymentAmount]);

//   // Stripe payment using backend
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
//             amount: Math.round(Number(finalAmount) * 100), // Stripe uses cents
//             orderId: paymentOrderId,
//             medicineName: items?.[0]?.name || "Order Prescription",
//             customerEmail: loggedInUser?.email,
//           }),
//         }
//       );

//       const data = await res.json();
//       if (!res.ok) {
//         setMessage(data.message || "Stripe payment error.");
//         return;
//       }

//       await stripe.redirectToCheckout({ sessionId: data.sessionId });
//     } catch (error) {
//       setMessage("Stripe payment initiation failed.");
//       console.error("Stripe error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Khalti popup/widget payment (NPR)
//   const handleKhaltiPayment = async () => {
//     if (!window.KhaltiCheckout) {
//       setMessage("Khalti SDK not loaded. Please refresh the page.");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     const khaltiConfig = {
//       publicKey: KHALTI_PUBLIC_KEY,
//       productIdentity: paymentOrderId || "demo",
//       productName: "Pharmacy Order",
//       productUrl: window.location.origin,
//       eventHandler: {
//         onSuccess: async (payload) => {
//           try {
//             const token = localStorage.getItem("token");
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
//               setMessage("✅ Khalti Payment Success! Redirecting...");
//               setTimeout(() => navigate("/placeorder"), 1500);
//             } else {
//               setMessage("❌ Khalti Payment Verification Failed!");
//             }
//           } catch (error) {
//             setMessage("❌ Payment verification error.");
//           } finally {
//             setLoading(false);
//           }
//         },
//         onError: () => {
//           setMessage("❌ Khalti Payment Failed!");
//           setLoading(false);
//         },
//         onClose: () => {
//           setLoading(false);
//         },
//       },
//     };

//     const checkout = new window.KhaltiCheckout(khaltiConfig);
//     checkout.show({ amount: paymentAmount * 100 }); // NPR to paisa
//   };

//   // COD handler
//   const handleCOD = () => {
//     dispatch(savePaymentMethod("COD"));
//     setMessage("✅ COD selected! Redirecting...");
//     setTimeout(() => navigate("/placeorder"), 1000);
//   };

//   // Main submit handler
//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     if (!paymentAmount) {
//       setMessage("Payment amount is missing. Please go back to cart.");
//       return;
//     }

//     if (paymentMethod === "Stripe") {
//       await handleStripePayment();
//     } else if (paymentMethod === "Khalti") {
//       handleKhaltiPayment();
//     } else if (paymentMethod === "COD") {
//       handleCOD();
//     }
//   };

//   return (
//     <>
//       <CheckoutSteps step1={step1} step2={step2} step3={step3} step4={step4} />

//       <FormContainer>
//         <Row>
//           {/* Payment Methods (Left Column) */}
//           <Col xs={12} md={8} className="mb-4 mb-md-0">
//             <Card className="shadow-lg border-0 h-100">
//               <Card.Header className="bg-gradient-primary text-white p-4">
//                 <h4 className="mb-0">
//                   <i className="fas fa-credit-card me-2"></i>
//                   Choose Payment Method
//                 </h4>
//               </Card.Header>
//               <Card.Body className="p-4">
//                 <Form onSubmit={submitHandler}>
//                   <Form.Group className="mb-4">
//                     <Form.Label as="legend" className="fw-bold fs-5 mb-3">
//                       Select Your Payment Method
//                     </Form.Label>

//                     {/* Khalti */}
//                     <div
//                       className={`payment-card p-4 mb-3 border rounded-4 cursor-pointer transition-all ${
//                         paymentMethod === "Khalti"
//                           ? "border-primary shadow-lg bg-primary-subtle"
//                           : "border-secondary-subtle hover-border-primary"
//                       }`}
//                       onClick={() => setPaymentMethod("Khalti")}
//                     >
//                       <Form.Check
//                         type="radio"
//                         label={
//                           <div className="d-flex align-items-center">
//                             <img
//                               src="https://khalti.com/assets/img/khalti-logo.svg"
//                               alt="Khalti"
//                               className="me-3"
//                               style={{ height: "40px" }}
//                             />
//                             <div>
//                               <div className="fw-bold">Khalti Wallet</div>
//                               <small className="text-muted">
//                                 Fast & Secure Digital Wallet
//                               </small>
//                             </div>
//                           </div>
//                         }
//                         id="Khalti"
//                         name="paymentMethod"
//                         value="Khalti"
//                         checked={paymentMethod === "Khalti"}
//                         onChange={(e) => setPaymentMethod(e.target.value)}
//                       />
//                     </div>

//                     {/* Stripe */}
//                     <div
//                       className={`payment-card p-4 mb-3 border rounded-4 cursor-pointer transition-all ${
//                         paymentMethod === "Stripe"
//                           ? "border-primary shadow-lg bg-primary-subtle"
//                           : "border-secondary-subtle hover-border-primary"
//                       }`}
//                       onClick={() => setPaymentMethod("Stripe")}
//                     >
//                       <Form.Check
//                         type="radio"
//                         label={
//                           <div className="d-flex align-items-center">
//                             <i className="fab fa-cc-stripe fa-2x text-primary me-3"></i>
//                             <div>
//                               <div className="fw-bold">Stripe (Card)</div>
//                               <small className="text-muted">
//                                 All Credit/Debit Cards
//                               </small>
//                             </div>
//                           </div>
//                         }
//                         id="Stripe"
//                         name="paymentMethod"
//                         value="Stripe"
//                         checked={paymentMethod === "Stripe"}
//                         onChange={(e) => setPaymentMethod(e.target.value)}
//                       />
//                     </div>

//                     {/* COD */}
//                     <div
//                       className={`payment-card p-4 mb-4 border rounded-4 cursor-pointer transition-all ${
//                         paymentMethod === "COD"
//                           ? "border-success shadow-lg bg-success-subtle"
//                           : "border-secondary-subtle hover-border-primary"
//                       }`}
//                       onClick={() => setPaymentMethod("COD")}
//                     >
//                       <Form.Check
//                         type="radio"
//                         label={
//                           <div className="d-flex align-items-center">
//                             <i className="fas fa-truck fa-2x text-success me-3"></i>
//                             <div>
//                               <div className="fw-bold">Cash on Delivery</div>
//                               <small className="text-muted">
//                                 Pay when delivered
//                               </small>
//                             </div>
//                           </div>
//                         }
//                         id="COD"
//                         name="paymentMethod"
//                         value="COD"
//                         checked={paymentMethod === "COD"}
//                         onChange={(e) => setPaymentMethod(e.target.value)}
//                       />
//                     </div>
//                   </Form.Group>
//                 </Form>
//               </Card.Body>
//             </Card>
//           </Col>

//           {/* Order Summary (Right Column) */}
//           <Col xs={12} md={4}>
//             <Card
//               className="shadow-lg border-0 h-100"
//               // sticky only on md+ screens
//               style={
//                 typeof window !== "undefined" && window.innerWidth >= 768
//                   ? { position: "sticky", top: "20px" }
//                   : {}
//               }
//             >
//               <Card.Header className="bg-light border-0">
//                 <h5 className="mb-0 fw-bold text-primary">Order Summary</h5>
//               </Card.Header>
//               <Card.Body>
//                 <Table className="mb-0">
//                   <tbody>
//                     <tr>
//                       <td>Subtotal:</td>
//                       <td className="text-end fw-semibold">
//                         Rs{paymentAmount.toFixed(2)}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td>Tax (10%):</td>
//                       <td className="text-end">Rs{taxAmount}</td>
//                     </tr>
//                     <tr className="border-top">
//                       <td className="fw-bold h6 mb-0">Total:</td>
//                       <td className="text-end h5 mb-0 text-primary fw-bold">
//                         ₹{finalAmount}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </Table>

//                 <div className="mt-4 pt-3 border-top">
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <span className="fw-bold">Order ID:</span>
//                     <span className="fw-semibold text-primary">
//                       #{paymentOrderId}
//                     </span>
//                   </div>

//                   <Button
//                     variant="primary"
//                     size="lg"
//                     className="w-100 rounded-pill px-4 py-2 fw-bold shadow-lg mb-2"
//                     onClick={submitHandler}
//                     disabled={loading || !paymentMethod || !paymentAmount}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2"></span>
//                         Processing...
//                       </>
//                     ) : (
//                       `Pay Rs${finalAmount} Now`
//                     )}
//                   </Button>

//                   <Button
//                     variant="outline-secondary"
//                     size="lg"
//                     className="w-100 rounded-pill"
//                     onClick={() => navigate(-1)}
//                     disabled={loading}
//                   >
//                     ← Back
//                   </Button>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Messages */}
//         {message && (
//           <Alert
//             variant={
//               message.includes("Success") || message.includes("✅")
//                 ? "success"
//                 : "danger"
//             }
//             className="mt-4 shadow-sm"
//           >
//             {message}
//           </Alert>
//         )}

//         {/* Khalti SDK Note */}
//         <div className="mt-4 text-center text-muted small p-3 bg-light rounded-3">
//           <i className="fas fa-info-circle me-2"></i>
//           Make sure to add Khalti SDK via script in your index.html:
//           <br />
//           <code>
//             &lt;script
//             src="https://khalti.com/static/khalti-checkout.js"&gt;&lt;/script&gt;
//           </code>
//         </div>
//       </FormContainer>
//     </>
//   );
// };

// export default Payment;
///////////////////////////////////////////////////////

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
//   Badge,
//   Container,
// } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   CreditCard,
//   Truck,
//   ShieldCheck,
//   Lock,
//   FileText,
//   CheckCircle,
//   AlertTriangle,
//   ChevronRight,
// } from "lucide-react";
// import CheckoutSteps from "../components/CheckoutSteps";
// import { savePaymentMethod } from "../redux/actions/cartActions";

// // Keys (Replace with env variables in production)
// const STRIPE_PUBLIC_KEY =
//   "pk_test_51SZ3HcAgufYbIAmejyFQscH1Zt6s2Vk3AY3CWdMSmEnwxL01QSmfF4CKjdJciwlsaMjKlrX5CqUURq4BqcmViYc2003TDl2Vu9";
// const KHALTI_PUBLIC_KEY = "168fa21351e64a2d998016e2093aaae4"; // Test Key
// const API_BASE_URL = "http://localhost:5000/api";

// const Payment = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   // Redux State
//   const cart = useSelector((state) => state.cart);
//   const userState = useSelector((state) => state.userLogin || {});
//   const { shippingAddress, orderId, totalPrice, items } = cart;
//   const loggedInUser = userState.userInfo;

//   // Query Params (from Dashboard "Pay Now" or Cart flow)
//   const searchParams = new URLSearchParams(location.search);
//   const orderIdFromQuery = searchParams.get("orderId");
//   const amountFromQuery = searchParams.get("amount");

//   // Local State
//   const [paymentMethod, setPaymentMethod] = useState("Khalti");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [stripePromise, setStripePromise] = useState(null);

//   // Calculations
//   const paymentOrderId = orderIdFromQuery || orderId;
//   const rawAmount = Number(amountFromQuery) || Number(totalPrice) || 0;

//   // Financial Breakdown
//   const subTotal = (rawAmount / 1.1).toFixed(2); // Assuming total included tax
//   const taxAmount = (rawAmount - subTotal).toFixed(2);
//   const finalAmount = rawAmount.toFixed(2);

//   // Steps Active State
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

//   // 1. Stripe
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
//             amount: Math.round(finalAmount * 100), // Cents
//             orderId: paymentOrderId,
//             medicineName: "Pharmacy Order #" + (paymentOrderId || "New"),
//             customerEmail: loggedInUser?.email,
//           }),
//         }
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

//   // 2. Khalti
//   const handleKhaltiPayment = async () => {
//     if (!window.KhaltiCheckout) {
//       setMessage("⚠️ Khalti SDK missing. Please refresh.");
//       return;
//     }

//     setLoading(true);
//     const khaltiConfig = {
//       publicKey: KHALTI_PUBLIC_KEY,
//       productIdentity: paymentOrderId || "ORDER_" + Date.now(),
//       productName: "Pharmacy Medicines",
//       productUrl: window.location.origin,
//       eventHandler: {
//         onSuccess: async (payload) => {
//           try {
//             const token = localStorage.getItem("token");
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
//               navigate(`/payment-success?id=${paymentOrderId}&method=Khalti`);
//             } else {
//               setMessage("❌ Verification Failed: " + data.message);
//             }
//           } catch (err) {
//             setMessage("❌ Server Error during verification.");
//           } finally {
//             setLoading(false);
//           }
//         },
//         onError: (error) => {
//           console.error(error);
//           setMessage("❌ Khalti Transaction Failed.");
//           setLoading(false);
//         },
//         onClose: () => setLoading(false),
//       },
//     };

//     const checkout = new window.KhaltiCheckout(khaltiConfig);
//     checkout.show({ amount: Math.round(finalAmount * 100) }); // Paisa
//   };

//   // 3. COD
//   const handleCOD = () => {
//     dispatch(savePaymentMethod("COD"));
//     // Redirect to place order to finalize, or success if already placed
//     if (paymentOrderId) {
//       // If order exists, just update status
//       navigate(`/payment-success?id=${paymentOrderId}&method=COD`);
//     } else {
//       navigate("/placeorder");
//     }
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     if (paymentMethod === "Stripe") await handleStripePayment();
//     else if (paymentMethod === "Khalti") handleKhaltiPayment();
//     else if (paymentMethod === "COD") handleCOD();
//   };

//   return (
//     <Container className="py-5" style={{ minHeight: "80vh" }}>
//       <CheckoutSteps step1 step2 step3 />

//       <Row className="g-4 mt-2">
//         {/* LEFT: Payment Methods */}
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
//                           className="me-3"
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

//                 <div className="d-grid mt-4">
//                   <Button
//                     variant="primary"
//                     size="lg"
//                     type="submit"
//                     disabled={loading}
//                     className="rounded-pill py-3 fw-bold shadow-sm"
//                   >
//                     {loading ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" />
//                         Processing...
//                       </>
//                     ) : (
//                       <>
//                         <Lock size={18} className="me-2" /> Pay NPR{" "}
//                         {finalAmount}
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
//                       NPR {finalAmount}
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

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  Button,
  Col,
  Card,
  Row,
  Table,
  Alert,
  Badge,
  Container,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  Lock,
  AlertTriangle,
} from "lucide-react";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../redux/actions/cartActions";

// Keys (Replace with env variables in production)
const STRIPE_PUBLIC_KEY =
  "pk_test_51SZ3HcAgufYbIAmejyFQscH1Zt6s2Vk3AY3CWdMSmEnwxL01QSmfF4CKjdJciwlsaMjKlrX5CqUURq4BqcmViYc2003TDl2Vu9";
const KHALTI_PUBLIC_KEY = "168fa21351e64a2d998016e2093aaae4";
const API_BASE_URL = "http://localhost:5000/api";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux State
  const cart = useSelector((state) => state.cart);
  const userState = useSelector((state) => state.userLogin || {});
  const { shippingAddress, orderId, totalPrice } = cart;
  const loggedInUser = userState.userInfo;

  // Query Params (from Dashboard "Pay Now" or Cart flow)
  const searchParams = new URLSearchParams(location.search);
  const orderIdFromQuery = searchParams.get("orderId");
  const amountFromQuery = searchParams.get("amount");

  // Local State
  const [paymentMethod, setPaymentMethod] = useState("Khalti");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);

  // Calculations
  const paymentOrderId = orderIdFromQuery || orderId;
  const rawAmount = Number(amountFromQuery) || Number(totalPrice) || 0;

  // Financial Breakdown
  const subTotal = (rawAmount / 1.1).toFixed(2); // Assuming total included 10% tax
  const taxAmount = (rawAmount - subTotal).toFixed(2);
  const finalAmount = rawAmount.toFixed(2);

  // Steps Active State
  const step1 = true;
  const step2 = !!shippingAddress;
  const step3 = true;
  const step4 = false;

  useEffect(() => {
    loadStripe(STRIPE_PUBLIC_KEY).then(setStripePromise);

    // Redirect if no shipping address and not paying for an existing order
    if (!shippingAddress && !orderIdFromQuery) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate, orderIdFromQuery]);

  // --- HANDLERS ---

  // 1. Stripe Payment
  const handleStripePayment = async () => {
    try {
      setLoading(true);
      setMessage("");
      const stripe = await stripePromise;
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE_URL}/payments/create-stripe-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Math.round(finalAmount * 100), // Stripe uses cents
            orderId: paymentOrderId, // Optional: might be null if new order
            medicineName: "Pharmacy Order",
            customerEmail: loggedInUser?.email,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Stripe session failed");

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      setMessage("❌ Stripe Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Khalti Payment
  const handleKhaltiPayment = async () => {
    if (!window.KhaltiCheckout) {
      setMessage("⚠️ Khalti SDK missing. Please refresh.");
      return;
    }

    setLoading(true);
    const khaltiConfig = {
      publicKey: KHALTI_PUBLIC_KEY,
      productIdentity: paymentOrderId || "ORDER_NEW",
      productName: "Pharmacy Medicines",
      productUrl: window.location.origin,
      eventHandler: {
        onSuccess: async (payload) => {
          try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/payments/khalti-verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                token: payload.token,
                amount: payload.amount,
                orderId: paymentOrderId, // Passing ID if existing
              }),
            });
            const data = await res.json();
            if (data.success) {
              dispatch(savePaymentMethod("Khalti"));
              navigate(
                `/payment-success?id=${paymentOrderId || "new"}&method=Khalti`
              );
            } else {
              setMessage("❌ Verification Failed: " + data.message);
            }
          } catch (err) {
            setMessage("❌ Server Error during verification.");
          } finally {
            setLoading(false);
          }
        },
        onError: (error) => {
          console.error(error);
          setMessage("❌ Khalti Transaction Failed.");
          setLoading(false);
        },
        onClose: () => setLoading(false),
      },
    };

    const checkout = new window.KhaltiCheckout(khaltiConfig);
    checkout.show({ amount: Math.round(finalAmount * 100) }); // Paisa
  };

  // 3. COD Payment
  const handleCOD = async () => {
    dispatch(savePaymentMethod("COD"));

    // Scenario A: Paying for an EXISTING Order (Dashboard -> Pay Now)
    if (paymentOrderId) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/payments/set-cod`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId: paymentOrderId }),
        });

        if (res.ok) {
          navigate(`/payment-success?id=${paymentOrderId}&method=COD`);
        } else {
          setMessage("❌ Failed to update order method.");
        }
      } catch (err) {
        setMessage("❌ Connection Error.");
      } finally {
        setLoading(false);
      }
    }
    // Scenario B: New Order Checkout Flow
    else {
      navigate("/placeorder"); // Go to review page to finalize creation
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage("");
    if (paymentMethod === "Stripe") await handleStripePayment();
    else if (paymentMethod === "Khalti") handleKhaltiPayment();
    else if (paymentMethod === "COD") await handleCOD();
  };

  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <CheckoutSteps step1 step2 step3 />

      <Row className="g-4 mt-2">
        {/* LEFT: Payment Methods */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Header className="bg-white border-bottom p-4">
              <h4 className="fw-bold mb-0 text-primary d-flex align-items-center">
                <ShieldCheck className="me-2" size={24} /> Secure Payment
              </h4>
              <p className="text-muted small mb-0 mt-1">
                All transactions are encrypted and secured.
              </p>
            </Card.Header>
            <Card.Body className="p-4">
              {message && (
                <Alert
                  variant={message.includes("❌") ? "danger" : "warning"}
                  className="mb-4"
                >
                  {message}
                </Alert>
              )}

              <Form onSubmit={submitHandler}>
                <h6 className="fw-bold mb-3">Select Payment Method</h6>

                {/* Khalti Option */}
                <div
                  className={`p-3 mb-3 border rounded-3 cursor-pointer transition-all ${
                    paymentMethod === "Khalti"
                      ? "border-primary bg-primary bg-opacity-10"
                      : "hover-shadow"
                  }`}
                  onClick={() => setPaymentMethod("Khalti")}
                  style={{
                    borderLeft:
                      paymentMethod === "Khalti"
                        ? "5px solid #0d6efd"
                        : "1px solid #dee2e6",
                  }}
                >
                  <Form.Check
                    type="radio"
                    id="Khalti"
                    name="paymentMethod"
                    value="Khalti"
                    checked={paymentMethod === "Khalti"}
                    onChange={() => setPaymentMethod("Khalti")}
                    label={
                      <div className="d-flex align-items-center w-100">
                        <img
                          src="https://web.khalti.com/static/img/logo1.png"
                          alt="Khalti"
                          height="30"
                          className="me-3"
                        />
                        <div>
                          <span className="d-block fw-bold">
                            Khalti Digital Wallet
                          </span>
                          <small className="text-muted">
                            Pay securely using your Khalti balance.
                          </small>
                        </div>
                      </div>
                    }
                    className="w-100"
                  />
                </div>

                {/* Stripe Option */}
                <div
                  className={`p-3 mb-3 border rounded-3 cursor-pointer transition-all ${
                    paymentMethod === "Stripe"
                      ? "border-primary bg-primary bg-opacity-10"
                      : "hover-shadow"
                  }`}
                  onClick={() => setPaymentMethod("Stripe")}
                  style={{
                    borderLeft:
                      paymentMethod === "Stripe"
                        ? "5px solid #0d6efd"
                        : "1px solid #dee2e6",
                  }}
                >
                  <Form.Check
                    type="radio"
                    id="Stripe"
                    name="paymentMethod"
                    value="Stripe"
                    checked={paymentMethod === "Stripe"}
                    onChange={() => setPaymentMethod("Stripe")}
                    label={
                      <div className="d-flex align-items-center w-100">
                        <div className="me-3 text-primary">
                          <CreditCard size={30} />
                        </div>
                        <div>
                          <span className="d-block fw-bold">
                            Credit / Debit Card (Stripe)
                          </span>
                          <small className="text-muted">
                            Visa, Mastercard, Amex supported.
                          </small>
                        </div>
                      </div>
                    }
                  />
                </div>

                {/* COD Option */}
                <div
                  className={`p-3 mb-4 border rounded-3 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-success bg-success bg-opacity-10"
                      : "hover-shadow"
                  }`}
                  onClick={() => setPaymentMethod("COD")}
                  style={{
                    borderLeft:
                      paymentMethod === "COD"
                        ? "5px solid #198754"
                        : "1px solid #dee2e6",
                  }}
                >
                  <Form.Check
                    type="radio"
                    id="COD"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    label={
                      <div className="d-flex align-items-center w-100">
                        <div className="me-3 text-success">
                          <Truck size={30} />
                        </div>
                        <div>
                          <span className="d-block fw-bold">
                            Cash on Delivery
                          </span>
                          <small className="text-muted">
                            Pay when the medicines arrive at your door.
                          </small>
                        </div>
                      </div>
                    }
                  />
                </div>

                <div className="d-grid mt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={loading}
                    className="rounded-pill py-3 fw-bold shadow-sm"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={18} className="me-2" />{" "}
                        {paymentMethod === "COD" && !paymentOrderId
                          ? "Continue to Review"
                          : `Pay NPR ${finalAmount}`}
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT: Order Summary */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-light">
            <Card.Header className="bg-transparent border-0 p-4 pb-0">
              <h5 className="fw-bold text-dark mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body className="p-4">
              {paymentOrderId && (
                <div className="mb-3 p-2 bg-white rounded border d-flex justify-content-between">
                  <span className="text-muted">Order ID:</span>
                  <span className="fw-bold text-primary">
                    #{paymentOrderId.slice(-6).toUpperCase()}
                  </span>
                </div>
              )}

              <Table borderless size="sm" className="mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted">Subtotal</td>
                    <td className="text-end fw-medium">NPR {subTotal}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Tax (10%)</td>
                    <td className="text-end fw-medium">NPR {taxAmount}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Delivery</td>
                    <td className="text-end text-success">Free</td>
                  </tr>
                  <tr className="border-top">
                    <td className="pt-3 h5 fw-bold">Total</td>
                    <td className="pt-3 h5 fw-bold text-primary text-end">
                      NPR {finalAmount}
                    </td>
                  </tr>
                </tbody>
              </Table>

              <div className="mt-4 pt-3 border-top text-center">
                <small className="text-muted d-block mb-2">
                  <ShieldCheck size={14} className="me-1 text-success" />
                  100% Secure Transaction
                </small>
                <div className="d-flex justify-content-center gap-2 opacity-50">
                  <CreditCard size={24} />
                  <Truck size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <style>{` .hover-shadow:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); } `}</style>
    </Container>
  );
};

export default Payment;
