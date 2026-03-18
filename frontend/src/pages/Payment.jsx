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

// --- CONFIGURATION ---
const API_BASE_URL = "http://localhost:5000/api";
const STRIPE_PUBLIC_KEY = "pk_test_YOUR_STRIPE_PUBLISHABLE_KEY"; // Ensure this is your real key
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// ==============================================================================
// INTERNAL COMPONENT: Stripe Form (Upgraded with DB Sync)
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

    // 1. Confirm payment with Stripe WITHOUT auto-redirecting
    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
      return;
    }

    // 2. If Stripe succeeds, explicitly update our own database BEFORE redirecting
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

        // 3. Now redirect to the success receipt
        navigate(`/payment-success?method=Stripe&orderId=${orderId}`);
      } catch (dbError) {
        console.error("Database update failed:", dbError);
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
    <Form
      onSubmit={handleSubmit}
      className="mt-3 pt-3 border-top"
      style={{ borderColor: "#D5D9D9" }}
    >
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
        className="w-100 mt-2 py-2 shadow-sm border-0 rounded-1 fw-medium"
        style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
        disabled={!stripe || processing}
      >
        {processing ? (
          <>
            <Spinner size="sm" className="me-2" /> Processing Payment...
          </>
        ) : (
          `Pay NPR ${amount.toFixed(2)} Securely`
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
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");
  const urlAmount = searchParams.get("amount");
  const finalAmount = urlAmount ? Number(urlAmount) : 0;

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
      setMessage("Khalti Error: " + err.message);
      setLoading(false);
    }
  };

  // --- HANDLER: Cash on Delivery ---
  const handleCOD = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Hit general status update route
      await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Processing" }),
      });

      // Hit COD route
      await fetch(`${API_BASE_URL}/payments/cod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      dispatch(savePaymentMethod("COD"));
      navigate(`/payment-success?method=COD&orderId=${orderId}`);
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
      <Container className="py-4 animate-fade-in">
        {/* Back Button */}
        <div className="mb-3">
          <Button
            variant="link"
            className="text-decoration-none p-0 d-flex align-items-center hover-underline fw-medium"
            style={{ width: "fit-content", color: "#007185" }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="me-1" /> Return to Shipping
          </Button>
        </div>

        {/* Checkout Steps */}
        <div className="mb-4">
          <CheckoutSteps step1 step2 step3 />
        </div>

        <Row className="g-4">
          <Col lg={8}>
            <Card
              className="border-0 shadow-sm rounded-1 h-100 bg-white"
              style={{ borderColor: "#D5D9D9" }}
            >
              <Card.Header className="bg-light border-bottom p-4">
                <h4 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                  Select a payment method
                </h4>
              </Card.Header>

              <Card.Body className="p-4">
                {message && (
                  <Alert
                    variant="danger"
                    className="py-2 small rounded-1 d-flex align-items-center gap-2"
                    style={{
                      backgroundColor: "#fef0f0",
                      color: "#B12704",
                      borderLeft: "4px solid #B12704",
                    }}
                  >
                    <ShieldCheck size={18} /> {message}
                  </Alert>
                )}

                <div
                  className="border rounded-1 overflow-hidden"
                  style={{ borderColor: "#D5D9D9" }}
                >
                  {/* Khalti Option */}
                  <div
                    className={`p-3 border-bottom cursor-pointer transition-all ${paymentMethod === "Khalti" ? "bg-light" : "bg-white hover-bg-light"}`}
                    onClick={() => onMethodChange("Khalti")}
                    style={{ borderColor: "#D5D9D9" }}
                  >
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "Khalti"}
                        onChange={() => onMethodChange("Khalti")}
                        className="me-3 custom-radio"
                        id="khalti-radio"
                      />
                      <label
                        htmlFor="khalti-radio"
                        className="w-100 d-flex flex-column m-0 cursor-pointer"
                      >
                        <span className="fw-bold text-dark d-flex align-items-center">
                          <Wallet
                            size={18}
                            className="me-2"
                            style={{ color: "#5E35B1" }}
                          />
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
                    className={`p-3 border-bottom cursor-pointer transition-all ${paymentMethod === "Stripe" ? "bg-light" : "bg-white hover-bg-light"}`}
                    onClick={() => onMethodChange("Stripe")}
                    style={{ borderColor: "#D5D9D9" }}
                  >
                    <div className="d-flex align-items-center mb-1">
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "Stripe"}
                        onChange={() => onMethodChange("Stripe")}
                        className="me-3 custom-radio"
                        id="stripe-radio"
                      />
                      <label
                        htmlFor="stripe-radio"
                        className="w-100 d-flex flex-column m-0 cursor-pointer"
                      >
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
                      </label>
                    </div>

                    {/* Stripe Elements Form injected when selected */}
                    {paymentMethod === "Stripe" && clientSecret && (
                      <div className="ms-4 ps-4 pe-2 mt-3 mb-2 animate-fade-in">
                        <Elements
                          stripe={stripePromise}
                          options={{ clientSecret }}
                        >
                          <StripeCheckoutForm
                            amount={finalAmount}
                            orderId={orderId}
                          />
                        </Elements>
                      </div>
                    )}
                    {paymentMethod === "Stripe" && !clientSecret && (
                      <div className="ms-4 ps-4 mt-3 mb-2 text-muted small d-flex align-items-center">
                        <Spinner
                          size="sm"
                          animation="border"
                          className="me-2"
                          style={{ color: "#007185" }}
                        />
                        Securing connection to Stripe...
                      </div>
                    )}
                  </div>

                  {/* COD Option */}
                  <div
                    className={`p-3 cursor-pointer transition-all ${paymentMethod === "COD" ? "bg-light" : "bg-white hover-bg-light"}`}
                    onClick={() => onMethodChange("COD")}
                  >
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "COD"}
                        onChange={() => onMethodChange("COD")}
                        className="me-3 custom-radio"
                        id="cod-radio"
                      />
                      <label
                        htmlFor="cod-radio"
                        className="w-100 d-flex flex-column m-0 cursor-pointer"
                      >
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
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit button for Non-Stripe Methods (Stripe has its own submit inside the Elements provider) */}
                {paymentMethod !== "Stripe" && (
                  <div
                    className="mt-4 pt-3 border-top"
                    style={{ borderColor: "#D5D9D9" }}
                  >
                    <Button
                      onClick={submitHandler}
                      className="py-2 shadow-sm border-0 d-block ms-auto px-5 rounded-1 hover-lift fw-medium"
                      style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                          />{" "}
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
              className="border-0 shadow-sm rounded-1 bg-white sticky-top"
              style={{ top: "20px", borderColor: "#D5D9D9" }}
            >
              <Card.Body className="p-4">
                <Button
                  onClick={
                    paymentMethod !== "Stripe"
                      ? submitHandler
                      : () => {
                          // Trigger Stripe form submission from outside
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
                  className="w-100 py-2 shadow-sm border-0 mb-3 rounded-1 hover-lift fw-medium"
                  style={{
                    backgroundColor: "#FFD814",
                    color: "#0F1111",
                    fontSize: "0.95rem",
                  }}
                  disabled={
                    loading || (paymentMethod === "Stripe" && !clientSecret)
                  }
                >
                  Place your order
                </Button>

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
                    By placing your order, you agree to SmartPharmacy's privacy
                    notice and conditions of use. Secure transaction.
                  </small>
                </div>

                <h5 className="fw-bold text-dark mb-3">Order Summary</h5>
                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-muted">Order Ref:</span>
                  <span className="font-monospace text-dark">
                    {orderId ? `#${orderId.slice(-6).toUpperCase()}` : "..."}
                  </span>
                </div>

                <hr className="my-2" style={{ borderColor: "#D5D9D9" }} />

                <div
                  className="d-flex justify-content-between align-items-center fw-bold h5 mt-3 mb-0"
                  style={{ color: "#B12704" }}
                >
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
        .transition-all { transition: all 0.2s ease-in-out; }
        .hover-bg-light:hover { background-color: #f8f9fa !important; }
        .hover-lift { transition: transform 0.1s ease, box-shadow 0.1s ease; }
        .hover-lift:active { transform: translateY(1px); }
        .hover-underline:hover { text-decoration: underline !important; color: #C7511F !important; }
        
        .custom-radio:checked {
          background-color: #007185;
          border-color: #007185;
        }
        
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
