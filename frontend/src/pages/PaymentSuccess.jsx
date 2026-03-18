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

  // Extract all possible URL parameters
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

    // Helper to retry fetching until the database reflects the paid status
    const fetchOrderWithRetry = async (orderId, config, retries = 4) => {
      for (let i = 0; i < retries; i++) {
        const res = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          config,
        );

        if (res.data.isPaid || res.data.paymentMethod === "COD") {
          return res;
        }

        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } else {
          return res;
        }
      }
    };

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
            if (urlOrderId) {
              // 🚨 FIX 1: GUARANTEE THE DATABASE UPDATES FIRST!
              // We directly hit the standard order pay route before doing anything else.
              try {
                await axios.put(
                  `http://localhost:5000/api/orders/${urlOrderId}/pay`,
                  {
                    id: transactionId || pidx,
                    status: "COMPLETED",
                    update_time: new Date().toISOString(),
                    email_address: "khalti_wallet_user",
                  },
                  config,
                );
              } catch (putErr) {
                console.error("Direct payment DB update failed:", putErr);
              }

              // 2. Optional: Hit the Khalti lookup route to trigger emails/transaction records
              try {
                await axios.post(
                  "http://localhost:5000/api/payments/khalti-lookup",
                  { pidx, orderId: urlOrderId },
                  config,
                );
              } catch (lookupErr) {
                // We ignore this error because Step 1 already saved the database!
                console.error("Khalti Lookup Failed (Ignored):", lookupErr);
              }

              // 3. Fetch the fully updated order for the UI
              const finalOrderRes = await fetchOrderWithRetry(
                urlOrderId,
                config,
              );
              if (isMounted) setOrder(finalOrderRes.data);
            } else {
              if (isMounted)
                setError(
                  "Payment verified, but could not locate the associated order ID.",
                );
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
          const res = await fetchOrderWithRetry(urlOrderId, config);
          if (isMounted) setOrder(res.data);
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

  // 🚨 FIX 2: We removed the visual "override".
  // It now strictly reads from the actual Database. If it says PAID here, it WILL say PAID everywhere.
  const isPaid = order.isPaid;
  const isCOD = order.paymentMethod === "COD";

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
                      Unit: {item.unit || "Pack"}{" "}
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

        {/* Action Buttons */}
        <div
          className="d-flex flex-column flex-sm-row justify-content-center gap-3 d-print-none mt-4 w-100"
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

        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          nav, header, footer, .d-print-none, .navbar { display: none !important; }
          body, html, .print-page-bg { background-color: white !important; margin: 0 !important; padding: 0 !important; }
          .print-container { max-width: 100% !important; width: 100% !important; padding: 0 !important; margin: 0 !important; display: block !important; }
          .printable-receipt { border: none !important; box-shadow: none !important; padding: 0 !important; margin: 0 auto !important; width: 100% !important; max-width: none !important; }
          .print-table { border: 1px solid #dee2e6 !important; }
          tr, .print-avoid-break { page-break-inside: avoid !important; }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
