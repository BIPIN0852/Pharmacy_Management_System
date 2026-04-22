// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Form,
//   Button,
//   Col,
//   Row,
//   Card,
//   Container,
//   Alert,
//   Spinner,
// } from "react-bootstrap";
// import {
//   CreditCard,
//   Truck,
//   Wallet,
//   ArrowLeft,
//   ShieldCheck,
// } from "lucide-react";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import CheckoutSteps from "../components/CheckoutSteps";
// import { savePaymentMethod } from "../redux/actions/cartActions";
// import api from "../services/api";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// // ==============================================================================
// // INTERNAL COMPONENT: Stripe Form
// // ==============================================================================
// const StripeCheckoutForm = ({ amount, orderId }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const [error, setError] = useState(null);
//   const [processing, setProcessing] = useState(false);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!stripe || !elements) return;

//     setProcessing(true);
//     setError(null);

//     const { error: submitError, paymentIntent } = await stripe.confirmPayment({
//       elements,
//       redirect: "if_required",
//     });

//     if (submitError) {
//       setError(submitError.message);
//       setProcessing(false);
//       return;
//     }

//     if (paymentIntent && paymentIntent.status === "succeeded") {
//       try {
//         const token = localStorage.getItem("token");
//         await fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             id: paymentIntent.id,
//             status: paymentIntent.status,
//             update_time: new Date().toISOString(),
//             email_address: "stripe_customer",
//           }),
//         });

//         navigate(`/payment-success?method=Stripe&orderId=${orderId}`);
//       } catch (dbError) {
//         setError(
//           "Payment successful, but order failed to sync. Contact support.",
//         );
//       }
//     } else {
//       setError("Payment processing failed or requires further action.");
//     }
//     setProcessing(false);
//   };

//   return (
//     <Form onSubmit={handleSubmit}>
//       <PaymentElement className="mb-3" />
//       {error && (
//         <Alert
//           variant="danger"
//           className="py-2 small rounded-1 d-flex align-items-center gap-2"
//           style={{
//             backgroundColor: "#fef0f0",
//             color: "#B12704",
//             borderLeft: "4px solid #B12704",
//           }}
//         >
//           {error}
//         </Alert>
//       )}
//       <Button
//         type="submit"
//         className="w-100 py-2 shadow-sm border-0 rounded-1 fw-medium"
//         style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
//         disabled={!stripe || processing}
//       >
//         {processing ? (
//           <>
//             <Spinner size="sm" className="me-2" /> Processing Payment...
//           </>
//         ) : (
//           `Confirm Stripe Payment (NPR ${amount.toFixed(2)})`
//         )}
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
//   const { state } = useLocation();

//   // Extract state
//   const orderData = state?.orderData;
//   const finalCartItems = state?.finalCartItems || [];
//   const finalAmount = state?.totalPrice ? Number(state.totalPrice) : 0;

//   const cart = useSelector((state) => state.cart || {});
//   const { shippingAddress } = cart;

//   const [paymentMethod, setPaymentMethod] = useState("Khalti");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const [clientSecret, setClientSecret] = useState("");
//   const [createdOrderId, setCreatedOrderId] = useState(null);

//   // If no data was passed (e.g. user refreshed the page), bounce them back to the start.
//   useEffect(() => {
//     if (!orderData) {
//       navigate("/placeorder");
//     }
//   }, [orderData, navigate]);

//   // CRITICAL LOGIC: Create the order and clear the cart ONLY when they click to pay
//   const createOrderAndClearCart = async () => {
//     const finalOrderData = { ...orderData, paymentMethod };

//     // 1. Create the Order
//     const res = await api.post("/orders", finalOrderData);
//     const data = res.data || res;
//     const orderId =
//       data._id || data.order?._id || data.createdOrder?._id || data.id;

//     if (!orderId) throw new Error("Order creation failed.");

//     // 2. Safely Clear Cart
//     try {
//       await Promise.all(
//         finalCartItems.map((item) => {
//           const id = item.product || item.medicine;
//           return api.delete(`/cart/${id}`).catch(() => null);
//         }),
//       );
//     } catch (e) {}

//     const currentLocalCart =
//       JSON.parse(localStorage.getItem("cartItems")) || [];
//     const purchasedIds = finalCartItems.map((i) =>
//       String(i.product || i.medicine),
//     );
//     const remainingCart = currentLocalCart.filter((item) => {
//       const id = String(item.medicine?._id || item.medicine || item.product);
//       return !purchasedIds.includes(id);
//     });

//     localStorage.setItem("cartItems", JSON.stringify(remainingCart));
//     localStorage.removeItem("checkoutData");

//     return orderId;
//   };

//   const handlePaymentSubmit = async () => {
//     setLoading(true);
//     setMessage("");

//     try {
//       // Step 1: Securely create the order and clear the cart now that they have chosen to pay
//       const orderId = await createOrderAndClearCart();
//       setCreatedOrderId(orderId);
//       dispatch(savePaymentMethod(paymentMethod));

//       const token = localStorage.getItem("token");

//       // Step 2: Route to the appropriate Payment Gateway
//       if (paymentMethod === "Khalti") {
//         const res = await fetch(`${API_BASE_URL}/payments/khalti-initiate`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ orderId }),
//         });
//         const data = await res.json();
//         if (data.payment_url) {
//           window.location.href = data.payment_url;
//         } else throw new Error("No payment URL received from Khalti.");
//       } else if (paymentMethod === "COD") {
//         await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ status: "Processing" }),
//         });
//         await fetch(`${API_BASE_URL}/payments/cod`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ orderId }),
//         });
//         navigate(`/payment-success?method=COD&orderId=${orderId}`);
//       } else if (paymentMethod === "Stripe") {
//         const res = await fetch(
//           `${API_BASE_URL}/payments/create-stripe-intent`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({ orderId }),
//           },
//         );
//         const data = await res.json();
//         if (!res.ok)
//           throw new Error(data.message || "Stripe initiation failed");

//         setClientSecret(data.clientSecret);
//       }
//     } catch (err) {
//       setMessage(err.message || "An error occurred during payment processing");
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: "#f0f2f2",
//         minHeight: "100vh",
//         paddingBottom: "50px",
//       }}
//     >
//       <Container className="py-4 animate-fade-in">
//         <div className="mb-3">
//           <Button
//             variant="link"
//             className="text-decoration-none p-0 d-flex align-items-center hover-underline fw-medium"
//             style={{ width: "fit-content", color: "#007185" }}
//             onClick={() => navigate(-1)}
//           >
//             <ArrowLeft size={18} className="me-1" /> Return to Review
//           </Button>
//         </div>

//         <div className="mb-4">
//           <CheckoutSteps step1 step2 step3 step4 />
//         </div>

//         <Row className="g-4">
//           <Col lg={8}>
//             <Card
//               className="border-0 shadow-sm rounded-1 h-100 bg-white"
//               style={{ borderColor: "#D5D9D9" }}
//             >
//               <Card.Header className="bg-light border-bottom p-4">
//                 <h4 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
//                   Complete Your Payment
//                 </h4>
//               </Card.Header>

//               <Card.Body className="p-4">
//                 {message && (
//                   <Alert
//                     variant="danger"
//                     className="py-2 small rounded-1 d-flex align-items-center gap-2"
//                   >
//                     <ShieldCheck size={18} /> {message}
//                   </Alert>
//                 )}

//                 {/* If clientSecret exists, user selected Stripe. Show ONLY the card input box! */}
//                 {clientSecret ? (
//                   <div
//                     className="animate-fade-in border rounded p-4"
//                     style={{ borderColor: "#D5D9D9" }}
//                   >
//                     <h5 className="fw-bold text-dark d-flex align-items-center gap-2 border-bottom pb-3 mb-3">
//                       <CreditCard size={20} style={{ color: "#007185" }} />{" "}
//                       Enter Card Details
//                     </h5>
//                     <Elements stripe={stripePromise} options={{ clientSecret }}>
//                       <StripeCheckoutForm
//                         amount={finalAmount}
//                         orderId={createdOrderId}
//                       />
//                     </Elements>
//                   </div>
//                 ) : (
//                   <div
//                     className="border rounded-1 overflow-hidden"
//                     style={{ borderColor: "#D5D9D9" }}
//                   >
//                     {/* Khalti Option */}
//                     <div
//                       className={`p-3 border-bottom cursor-pointer transition-all ${paymentMethod === "Khalti" ? "bg-light" : "bg-white hover-bg-light"}`}
//                       onClick={() => setPaymentMethod("Khalti")}
//                     >
//                       <div className="d-flex align-items-center">
//                         <Form.Check
//                           type="radio"
//                           name="paymentMethod"
//                           checked={paymentMethod === "Khalti"}
//                           onChange={() => setPaymentMethod("Khalti")}
//                           className="me-3 custom-radio"
//                         />
//                         <div className="w-100 d-flex flex-column m-0">
//                           <span className="fw-bold text-dark d-flex align-items-center">
//                             <Wallet
//                               size={18}
//                               className="me-2"
//                               style={{ color: "#5E35B1" }}
//                             />
//                             Khalti Digital Wallet
//                           </span>
//                           <small className="text-muted ms-4 ps-1">
//                             Pay with Khalti Balance, eBanking, or Mobile Banking
//                           </small>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Stripe Option */}
//                     <div
//                       className={`p-3 border-bottom cursor-pointer transition-all ${paymentMethod === "Stripe" ? "bg-light" : "bg-white hover-bg-light"}`}
//                       onClick={() => setPaymentMethod("Stripe")}
//                     >
//                       <div className="d-flex align-items-center mb-1">
//                         <Form.Check
//                           type="radio"
//                           name="paymentMethod"
//                           checked={paymentMethod === "Stripe"}
//                           onChange={() => setPaymentMethod("Stripe")}
//                           className="me-3 custom-radio"
//                         />
//                         <div className="w-100 d-flex flex-column m-0">
//                           <span className="fw-bold text-dark d-flex align-items-center">
//                             <CreditCard
//                               size={18}
//                               className="me-2"
//                               style={{ color: "#007185" }}
//                             />
//                             Credit or Debit Card
//                           </span>
//                           <small className="text-muted ms-4 ps-1">
//                             Visa, Mastercard, Amex
//                           </small>
//                         </div>
//                       </div>
//                     </div>

//                     {/* COD Option */}
//                     <div
//                       className={`p-3 cursor-pointer transition-all ${paymentMethod === "COD" ? "bg-light" : "bg-white hover-bg-light"}`}
//                       onClick={() => setPaymentMethod("COD")}
//                     >
//                       <div className="d-flex align-items-center">
//                         <Form.Check
//                           type="radio"
//                           name="paymentMethod"
//                           checked={paymentMethod === "COD"}
//                           onChange={() => setPaymentMethod("COD")}
//                           className="me-3 custom-radio"
//                         />
//                         <div className="w-100 d-flex flex-column m-0">
//                           <span className="fw-bold text-dark d-flex align-items-center">
//                             <Truck
//                               size={18}
//                               className="me-2"
//                               style={{ color: "#067D62" }}
//                             />
//                             Cash on Delivery (COD)
//                           </span>
//                           <small className="text-muted ms-4 ps-1">
//                             Pay by cash when your package arrives.
//                           </small>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </Card.Body>
//             </Card>
//           </Col>

//           {/* Sidebar Summary */}
//           <Col lg={4}>
//             <Card
//               className="border-0 shadow-sm rounded-1 bg-white sticky-top"
//               style={{ top: "20px", borderColor: "#D5D9D9" }}
//             >
//               <Card.Body className="p-4">
//                 {/* Hide the top Complete Payment button if they are entering Stripe details */}
//                 {!clientSecret && (
//                   <Button
//                     onClick={handlePaymentSubmit}
//                     className="w-100 py-2 shadow-sm border-0 mb-3 rounded-1 hover-lift fw-medium"
//                     style={{
//                       backgroundColor: "#FFD814",
//                       color: "#0F1111",
//                       fontSize: "0.95rem",
//                     }}
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Spinner
//                           size="sm"
//                           animation="border"
//                           className="me-2"
//                         />{" "}
//                         Processing...
//                       </>
//                     ) : (
//                       `Pay with ${paymentMethod}`
//                     )}
//                   </Button>
//                 )}

//                 <div
//                   className="text-center mb-3 border-bottom pb-3"
//                   style={{ borderColor: "#D5D9D9" }}
//                 >
//                   <small
//                     className="text-muted"
//                     style={{
//                       fontSize: "0.75rem",
//                       lineHeight: "1.4",
//                       display: "block",
//                     }}
//                   >
//                     Your order is secure. By completing this payment, you agree
//                     to SmartPharmacy's conditions of use.
//                   </small>
//                 </div>

//                 <h5 className="fw-bold text-dark mb-3">Payment Summary</h5>
//                 {createdOrderId && (
//                   <div className="d-flex justify-content-between small mb-2 text-success fw-bold">
//                     <span>Order Ref:</span>
//                     <span className="font-monospace">
//                       #{createdOrderId.slice(-6).toUpperCase()}
//                     </span>
//                   </div>
//                 )}

//                 {shippingAddress && (
//                   <div className="bg-light p-3 mt-3 rounded-1 border border-light-subtle">
//                     <div
//                       className="fw-bold text-muted mb-1"
//                       style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
//                     >
//                       SHIPPING TO:
//                     </div>
//                     <div className="small text-dark lh-sm fw-medium">
//                       {shippingAddress.address}, {shippingAddress.city} <br />
//                       {shippingAddress.postalCode}, {shippingAddress.country}
//                     </div>
//                     {shippingAddress.phoneNumber && (
//                       <div className="small text-dark mt-2 fw-bold d-flex align-items-center gap-1">
//                         📞 {shippingAddress.phoneNumber}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 <hr className="my-3" style={{ borderColor: "#D5D9D9" }} />

//                 <div
//                   className="d-flex justify-content-between align-items-center fw-bold h5 mt-3 mb-0"
//                   style={{ color: "#B12704" }}
//                 >
//                   <span>Amount Due:</span>
//                   <span>NPR {finalAmount.toFixed(2)}</span>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>

//       <style>{`
//         .cursor-pointer { cursor: pointer; }
//         .transition-all { transition: all 0.2s ease-in-out; }
//         .hover-bg-light:hover { background-color: #f8f9fa !important; }
//         .hover-lift { transition: transform 0.1s ease, box-shadow 0.1s ease; }
//         .hover-lift:active { transform: translateY(1px); }
//         .hover-underline:hover { text-decoration: underline !important; color: #C7511F !important; }
//         .custom-radio:checked { background-color: #007185; border-color: #007185; }
//         .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(5px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Payment;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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
import {
  CreditCard,
  Truck,
  Wallet,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../redux/actions/cartActions";
import api from "../services/api";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ==============================================================================
// INLINE SVG ICONS for Payment Methods
// ==============================================================================
const KhaltiLogo = () => (
  <svg
    className="d-none d-sm-block"
    height="28"
    viewBox="0 0 110 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.9, flexShrink: 0 }}
    aria-label="Khalti"
  >
    {/* Purple badge background */}
    <rect width="30" height="30" rx="6" fill="#5C2D91" />
    {/* Stylised "K" letterform */}
    <path
      d="M7 7h4v6.2l4.8-6.2h4.8L15 14.5l6 8.5h-4.8L13 17.2l-2 2.3V23H7V7z"
      fill="white"
    />
    {/* Wordmark */}
    <text
      x="36"
      y="21"
      fontFamily="'Segoe UI', Arial, sans-serif"
      fontWeight="700"
      fontSize="13.5"
      fill="#5C2D91"
      letterSpacing="0.3"
    >
      khalti
    </text>
  </svg>
);

const StripeLogo = () => (
  <svg
    className="d-none d-sm-block"
    height="26"
    viewBox="0 0 80 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.9, flexShrink: 0 }}
    aria-label="Stripe"
  >
    {/* Stripe blue-purple pill background */}
    <rect width="80" height="32" rx="6" fill="#635BFF" />
    {/* Wordmark in white */}
    <text
      x="12"
      y="22"
      fontFamily="'Segoe UI', Arial, sans-serif"
      fontWeight="700"
      fontSize="15"
      fill="white"
      letterSpacing="0.5"
    >
      stripe
    </text>
  </svg>
);

// ==============================================================================
// INTERNAL COMPONENT: Stripe Form
// ==============================================================================
const StripeCheckoutForm = ({ amount, orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
            email_address: "stripe_customer",
          }),
        });

        navigate(`/payment-success?method=Stripe&orderId=${orderId}`);
      } catch (dbError) {
        setError(
          "Payment successful, but order failed to sync. Contact support.",
        );
      }
    } else {
      setError("Payment processing failed or requires further action.");
    }
    setProcessing(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <PaymentElement className="mb-3" />
      {error && (
        <Alert
          variant="danger"
          className="py-2 small rounded-1 d-flex align-items-center gap-2"
          style={{
            backgroundColor: "#fef0f0",
            color: "#B12704",
            borderLeft: "4px solid #B12704",
          }}
        >
          {error}
        </Alert>
      )}
      <Button
        type="submit"
        className="w-100 py-2 shadow-sm border-0 rounded-1 fw-medium"
        style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
        disabled={!stripe || processing}
      >
        {processing ? (
          <>
            <Spinner size="sm" className="me-2" /> Processing Payment...
          </>
        ) : (
          `Confirm Stripe Payment (NPR ${amount.toFixed(2)})`
        )}
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
  const { state } = useLocation();

  // Extract state
  const orderData = state?.orderData;
  const finalCartItems = state?.finalCartItems || [];
  const finalAmount = state?.totalPrice ? Number(state.totalPrice) : 0;

  const cart = useSelector((state) => state.cart || {});
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("Khalti");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [clientSecret, setClientSecret] = useState("");
  const [createdOrderId, setCreatedOrderId] = useState(null);

  // If no data was passed (e.g. user refreshed the page), bounce them back to the start.
  useEffect(() => {
    if (!orderData) {
      navigate("/placeorder");
    }
  }, [orderData, navigate]);

  // CRITICAL LOGIC: Create the order and clear the cart ONLY when they click to pay
  const createOrderAndClearCart = async () => {
    const finalOrderData = { ...orderData, paymentMethod };

    // 1. Create the Order
    const res = await api.post("/orders", finalOrderData);
    const data = res.data || res;
    const orderId =
      data._id || data.order?._id || data.createdOrder?._id || data.id;

    if (!orderId) throw new Error("Order creation failed.");

    // 2. Safely Clear Cart
    try {
      await Promise.all(
        finalCartItems.map((item) => {
          const id = item.product || item.medicine;
          return api.delete(`/cart/${id}`).catch(() => null);
        }),
      );
    } catch (e) {}

    const currentLocalCart =
      JSON.parse(localStorage.getItem("cartItems")) || [];
    const purchasedIds = finalCartItems.map((i) =>
      String(i.product || i.medicine),
    );
    const remainingCart = currentLocalCart.filter((item) => {
      const id = String(item.medicine?._id || item.medicine || item.product);
      return !purchasedIds.includes(id);
    });

    localStorage.setItem("cartItems", JSON.stringify(remainingCart));
    localStorage.removeItem("checkoutData");

    return orderId;
  };

  const handlePaymentSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Step 1: Securely create the order and clear the cart now that they have chosen to pay
      const orderId = await createOrderAndClearCart();
      setCreatedOrderId(orderId);
      dispatch(savePaymentMethod(paymentMethod));

      const token = localStorage.getItem("token");

      // Step 2: Route to the appropriate Payment Gateway
      if (paymentMethod === "Khalti") {
        const res = await fetch(`${API_BASE_URL}/payments/khalti-initiate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId }),
        });
        const data = await res.json();
        if (data.payment_url) {
          window.location.href = data.payment_url;
        } else throw new Error("No payment URL received from Khalti.");
      } else if (paymentMethod === "COD") {
        await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Processing" }),
        });
        await fetch(`${API_BASE_URL}/payments/cod`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId }),
        });
        navigate(`/payment-success?method=COD&orderId=${orderId}`);
      } else if (paymentMethod === "Stripe") {
        const res = await fetch(
          `${API_BASE_URL}/payments/create-stripe-intent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ orderId }),
          },
        );
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Stripe initiation failed");

        setClientSecret(data.clientSecret);
      }
    } catch (err) {
      setMessage(err.message || "An error occurred during payment processing");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f0f2f2",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <Container className="py-4 animate-fade-in">
        <div className="mb-3">
          <Button
            variant="link"
            className="text-decoration-none p-0 d-flex align-items-center hover-underline fw-medium"
            style={{ width: "fit-content", color: "#007185" }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="me-1" /> Return to Review
          </Button>
        </div>

        <div className="mb-4">
          <CheckoutSteps step1 step2 step3 step4 />
        </div>

        <Row className="g-4">
          <Col lg={8}>
            <Card
              className="border-0 shadow-sm rounded-1 h-100 bg-white"
              style={{ borderColor: "#D5D9D9" }}
            >
              <Card.Header className="bg-light border-bottom p-4">
                <h4 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                  Complete Your Payment
                </h4>
              </Card.Header>

              <Card.Body className="p-4">
                {message && (
                  <Alert
                    variant="danger"
                    className="py-2 small rounded-1 d-flex align-items-center gap-2"
                  >
                    <ShieldCheck size={18} /> {message}
                  </Alert>
                )}

                {/* If clientSecret exists, user selected Stripe. Show ONLY the card input box! */}
                {clientSecret ? (
                  <div
                    className="animate-fade-in border rounded p-4"
                    style={{ borderColor: "#D5D9D9" }}
                  >
                    <h5 className="fw-bold text-dark d-flex align-items-center gap-2 border-bottom pb-3 mb-3">
                      <CreditCard size={20} style={{ color: "#007185" }} />{" "}
                      Enter Card Details
                    </h5>
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripeCheckoutForm
                        amount={finalAmount}
                        orderId={createdOrderId}
                      />
                    </Elements>
                  </div>
                ) : (
                  <div
                    className="border rounded-1 overflow-hidden"
                    style={{ borderColor: "#D5D9D9" }}
                  >
                    {/* Khalti Option */}
                    <div
                      className={`p-3 border-bottom cursor-pointer transition-all ${paymentMethod === "Khalti" ? "bg-light" : "bg-white hover-bg-light"}`}
                      onClick={() => setPaymentMethod("Khalti")}
                    >
                      <div className="d-flex align-items-center">
                        <Form.Check
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "Khalti"}
                          onChange={() => setPaymentMethod("Khalti")}
                          className="me-3 custom-radio flex-shrink-0"
                        />
                        <div className="d-flex justify-content-between align-items-center w-100 m-0">
                          <div className="d-flex flex-column">
                            <span className="fw-bold text-dark d-flex align-items-center">
                              <Wallet
                                size={18}
                                className="me-2"
                                style={{ color: "#5E35B1" }}
                              />
                              Khalti Digital Wallet
                            </span>
                            <small className="text-muted ms-4 ps-1">
                              Pay with Khalti Balance, eBanking, or Mobile
                              Banking
                            </small>
                          </div>
                          <KhaltiLogo />
                        </div>
                      </div>
                    </div>

                    {/* Stripe Option */}
                    <div
                      className={`p-3 border-bottom cursor-pointer transition-all ${paymentMethod === "Stripe" ? "bg-light" : "bg-white hover-bg-light"}`}
                      onClick={() => setPaymentMethod("Stripe")}
                    >
                      <div className="d-flex align-items-center">
                        <Form.Check
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "Stripe"}
                          onChange={() => setPaymentMethod("Stripe")}
                          className="me-3 custom-radio flex-shrink-0"
                        />
                        <div className="d-flex justify-content-between align-items-center w-100 m-0">
                          <div className="d-flex flex-column">
                            <span className="fw-bold text-dark d-flex align-items-center">
                              <CreditCard
                                size={18}
                                className="me-2"
                                style={{ color: "#007185" }}
                              />
                              Credit or Debit Card
                            </span>
                            <small className="text-muted ms-4 ps-1">
                              Visa, Mastercard, Amex
                            </small>
                          </div>
                          <StripeLogo />
                        </div>
                      </div>
                    </div>

                    {/* COD Option */}
                    <div
                      className={`p-3 cursor-pointer transition-all ${paymentMethod === "COD" ? "bg-light" : "bg-white hover-bg-light"}`}
                      onClick={() => setPaymentMethod("COD")}
                    >
                      <div className="d-flex align-items-center">
                        <Form.Check
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "COD"}
                          onChange={() => setPaymentMethod("COD")}
                          className="me-3 custom-radio flex-shrink-0"
                        />
                        <div className="d-flex justify-content-between align-items-center w-100 m-0">
                          <div className="d-flex flex-column">
                            <span className="fw-bold text-dark d-flex align-items-center">
                              <Truck
                                size={18}
                                className="me-2"
                                style={{ color: "#067D62" }}
                              />
                              Cash on Delivery (COD)
                            </span>
                            <small className="text-muted ms-4 ps-1">
                              Pay by cash when your package arrives.
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar Summary */}
          <Col lg={4}>
            <Card
              className="border-0 shadow-sm rounded-1 bg-white sticky-top"
              style={{ top: "20px", borderColor: "#D5D9D9" }}
            >
              <Card.Body className="p-4">
                {/* Hide the top Complete Payment button if they are entering Stripe details */}
                {!clientSecret && (
                  <Button
                    onClick={handlePaymentSubmit}
                    className="w-100 py-2 shadow-sm border-0 mb-3 rounded-1 hover-lift fw-medium"
                    style={{
                      backgroundColor: "#FFD814",
                      color: "#0F1111",
                      fontSize: "0.95rem",
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          size="sm"
                          animation="border"
                          className="me-2"
                        />{" "}
                        Processing...
                      </>
                    ) : (
                      `Pay with ${paymentMethod}`
                    )}
                  </Button>
                )}

                <div
                  className="text-center mb-3 border-bottom pb-3"
                  style={{ borderColor: "#D5D9D9" }}
                >
                  <small
                    className="text-muted"
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1.4",
                      display: "block",
                    }}
                  >
                    Your order is secure. By completing this payment, you agree
                    to SmartPharmacy's conditions of use.
                  </small>
                </div>

                <h5 className="fw-bold text-dark mb-3">Payment Summary</h5>
                {createdOrderId && (
                  <div className="d-flex justify-content-between small mb-2 text-success fw-bold">
                    <span>Order Ref:</span>
                    <span className="font-monospace">
                      #{createdOrderId.slice(-6).toUpperCase()}
                    </span>
                  </div>
                )}

                {shippingAddress && (
                  <div className="bg-light p-3 mt-3 rounded-1 border border-light-subtle">
                    <div
                      className="fw-bold text-muted mb-1"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                    >
                      SHIPPING TO:
                    </div>
                    <div className="small text-dark lh-sm fw-medium">
                      {shippingAddress.address}, {shippingAddress.city} <br />
                      {shippingAddress.postalCode}, {shippingAddress.country}
                    </div>
                    {shippingAddress.phoneNumber && (
                      <div className="small text-dark mt-2 fw-bold d-flex align-items-center gap-1">
                        📞 {shippingAddress.phoneNumber}
                      </div>
                    )}
                  </div>
                )}

                <hr className="my-3" style={{ borderColor: "#D5D9D9" }} />

                <div
                  className="d-flex justify-content-between align-items-center fw-bold h5 mt-3 mb-0"
                  style={{ color: "#B12704" }}
                >
                  <span>Amount Due:</span>
                  <span>NPR {finalAmount.toFixed(2)}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.2s ease-in-out; }
        .hover-bg-light:hover { background-color: #f8f9fa !important; }
        .hover-lift { transition: transform 0.1s ease, box-shadow 0.1s ease; }
        .hover-lift:active { transform: translateY(1px); }
        .hover-underline:hover { text-decoration: underline !important; color: #C7511F !important; }
        .custom-radio:checked { background-color: #007185; border-color: #007185; }
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Payment;
