import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Col, Card, Row, Table, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import FormContainer from "../components/FormContainer/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../redux/actions/cartActions";

// Stripe and Khalti keys -- replace with real keys in production!
const STRIPE_PUBLIC_KEY =
  "pk_test_51SZ3HcAgufYbIAmejyFQscH1Zt6s2Vk3AY3CWdMSmEnwxL01QSmfF4CKjdJciwlsaMjKlrX5CqUURq4BqcmViYc2003TDl2Vu9";
const KHALTI_PUBLIC_KEY = "168fa21351e64a2d998016e2093aaae4";
const API_BASE_URL = "http://localhost:5000/api";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get cart info (Redux logic)
  const cart = useSelector((state) => state.cart);
  const userState = useSelector((state) => state.userLogin || {});
  const { shippingAddress, orderId, totalPrice, items } = cart;
  const loggedInUser = userState.userInfo;

  // Parse query params from CustomerDashboard
  const searchParams = new URLSearchParams(location.search);
  const orderIdFromQuery = searchParams.get("orderId");
  const amountFromQuery = searchParams.get("amount");

  // State management
  const [paymentMethod, setPaymentMethod] = useState("Khalti");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);

  // Use query params if present (dashboard "Pay Now"), else Redux/cart
  const paymentOrderId = orderIdFromQuery || orderId;
  const paymentAmount = Number(amountFromQuery) || Number(totalPrice) || 1000;
  const taxAmount = (paymentAmount * 0.1).toFixed(2);
  const finalAmount = (paymentAmount * 1.1).toFixed(2);

  // Checkout steps state
  const step1 = true; // Sign In
  const step2 = !!shippingAddress; // Shipping
  const step3 = true; // Payment (current)
  const step4 = false; // Place Order

  useEffect(() => {
    // Initialize Stripe
    loadStripe(STRIPE_PUBLIC_KEY).then(setStripePromise);

    // Redirect if no shipping address
    if (!shippingAddress && !orderIdFromQuery) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate, orderIdFromQuery]);

  // Stripe payment using backend
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
            amount: finalAmount * 100, // Stripe uses cents
            orderId: paymentOrderId,
            medicineName: items?.[0]?.name || "Order Prescription",
            customerEmail: loggedInUser?.email,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Stripe payment error.");
        return;
      }

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      setMessage("Stripe payment initiation failed.");
      console.error("Stripe error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Khalti popup/widget payment (NPR)
  const handleKhaltiPayment = async () => {
    if (!window.KhaltiCheckout) {
      setMessage("Khalti SDK not loaded. Please refresh the page.");
      return;
    }

    setLoading(true);
    setMessage("");

    const khaltiConfig = {
      publicKey: KHALTI_PUBLIC_KEY,
      productIdentity: paymentOrderId || "demo",
      productName: "Pharmacy Order",
      productUrl: window.location.origin,
      eventHandler: {
        onSuccess: async (payload) => {
          try {
            // Backend verify after payment
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
                orderId: paymentOrderId,
              }),
            });

            const data = await res.json();
            if (data.success) {
              dispatch(savePaymentMethod("Khalti"));
              setMessage("✅ Khalti Payment Success! Redirecting...");
              setTimeout(() => navigate("/placeorder"), 1500);
            } else {
              setMessage("❌ Khalti Payment Verification Failed!");
            }
          } catch (error) {
            setMessage("❌ Payment verification error.");
          }
        },
        onError: () => {
          setMessage("❌ Khalti Payment Failed!");
          setLoading(false);
        },
        onClose: () => {
          setLoading(false);
        },
      },
    };

    const checkout = new window.KhaltiCheckout(khaltiConfig);
    checkout.show({ amount: paymentAmount * 100 }); // NPR to paisa
  };

  // COD handler
  const handleCOD = () => {
    dispatch(savePaymentMethod("COD"));
    setMessage("✅ COD selected! Redirecting...");
    setTimeout(() => navigate("/placeorder"), 1000);
  };

  // Main submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage("");

    if (paymentMethod === "Stripe") {
      await handleStripePayment();
    } else if (paymentMethod === "Khalti") {
      handleKhaltiPayment();
    } else if (paymentMethod === "COD") {
      handleCOD();
    }
  };

  return (
    <>
      {/* ✅ Updated CheckoutSteps with all 4 steps */}
      <CheckoutSteps step1={step1} step2={step2} step3={step3} step4={step4} />

      <FormContainer>
        <Row>
          {/* Payment Methods (Left Column) */}
          <Col md={8}>
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-gradient-primary text-white p-4">
                <h4 className="mb-0">
                  <i className="fas fa-credit-card me-2"></i>
                  Choose Payment Method
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-4">
                    <Form.Label as="legend" className="fw-bold fs-5 mb-3">
                      Select Your Payment Method
                    </Form.Label>

                    {/* Khalti */}
                    <div
                      className={`payment-card p-4 mb-3 border rounded-4 cursor-pointer transition-all ${
                        paymentMethod === "Khalti"
                          ? "border-primary shadow-lg bg-primary-subtle"
                          : "border-secondary-subtle hover-border-primary"
                      }`}
                      onClick={() => setPaymentMethod("Khalti")}
                    >
                      <Form.Check
                        type="radio"
                        label={
                          <div className="d-flex align-items-center">
                            <img
                              src="https://khalti.com/assets/img/khalti-logo.svg"
                              alt="Khalti"
                              className="me-3"
                              style={{ height: "40px" }}
                            />
                            <div>
                              <div className="fw-bold">Khalti Wallet</div>
                              <small className="text-muted">
                                Fast & Secure Digital Wallet
                              </small>
                            </div>
                          </div>
                        }
                        id="Khalti"
                        name="paymentMethod"
                        value="Khalti"
                        checked={paymentMethod === "Khalti"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                    </div>

                    {/* Stripe */}
                    <div
                      className={`payment-card p-4 mb-3 border rounded-4 cursor-pointer transition-all ${
                        paymentMethod === "Stripe"
                          ? "border-primary shadow-lg bg-primary-subtle"
                          : "border-secondary-subtle hover-border-primary"
                      }`}
                      onClick={() => setPaymentMethod("Stripe")}
                    >
                      <Form.Check
                        type="radio"
                        label={
                          <div className="d-flex align-items-center">
                            <i className="fab fa-cc-stripe fa-2x text-primary me-3"></i>
                            <div>
                              <div className="fw-bold">Stripe (Card)</div>
                              <small className="text-muted">
                                All Credit/Debit Cards
                              </small>
                            </div>
                          </div>
                        }
                        id="Stripe"
                        name="paymentMethod"
                        value="Stripe"
                        checked={paymentMethod === "Stripe"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                    </div>

                    {/* COD */}
                    <div
                      className={`payment-card p-4 mb-4 border rounded-4 cursor-pointer transition-all ${
                        paymentMethod === "COD"
                          ? "border-success shadow-lg bg-success-subtle"
                          : "border-secondary-subtle hover-border-primary"
                      }`}
                      onClick={() => setPaymentMethod("COD")}
                    >
                      <Form.Check
                        type="radio"
                        label={
                          <div className="d-flex align-items-center">
                            <i className="fas fa-truck fa-2x text-success me-3"></i>
                            <div>
                              <div className="fw-bold">Cash on Delivery</div>
                              <small className="text-muted">
                                Pay when delivered
                              </small>
                            </div>
                          </div>
                        }
                        id="COD"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                    </div>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Order Summary (Right Column) */}
          <Col md={4}>
            <Card
              className="shadow-lg border-0 h-100 sticky-top"
              style={{ top: "20px" }}
            >
              <Card.Header className="bg-light border-0">
                <h5 className="mb-0 fw-bold text-primary">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <Table className="mb-0">
                  <tbody>
                    <tr>
                      <td>Subtotal:</td>
                      <td className="text-end fw-semibold">
                        Rs{paymentAmount}
                      </td>
                    </tr>
                    <tr>
                      <td>Tax (10%):</td>
                      <td className="text-end">Rs{taxAmount}</td>
                    </tr>
                    <tr className="border-top">
                      <td className="fw-bold h6 mb-0">Total:</td>
                      <td className="text-end h5 mb-0 text-primary fw-bold">
                        ₹{finalAmount}
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold">Order ID:</span>
                    <span className="fw-semibold text-primary">
                      #{paymentOrderId}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100 rounded-pill px-4 py-2 fw-bold shadow-lg mb-2"
                    onClick={submitHandler}
                    disabled={loading || !paymentMethod}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : (
                      `Pay Rs${finalAmount} Now`
                    )}
                  </Button>

                  <Button
                    variant="outline-secondary"
                    size="lg"
                    className="w-100 rounded-pill"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    ← Back
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Messages */}
        {message && (
          <Alert
            variant={
              message.includes("Success") || message.includes("✅")
                ? "success"
                : "danger"
            }
            className="mt-4 shadow-sm"
          >
            {message}
          </Alert>
        )}

        {/* Khalti SDK Note */}
        <div className="mt-4 text-center text-muted small p-3 bg-light rounded-3">
          <i className="fas fa-info-circle me-2"></i>
          Make sure to add Khalti SDK via script in your index.html:
          <br />
          <code>
            &lt;script
            src="https://khalti.com/static/khalti-checkout.js"&gt;&lt;/script&gt;
          </code>
        </div>
      </FormContainer>
    </>
  );
};

export default Payment;

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
