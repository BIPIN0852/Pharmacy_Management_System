import React from "react";
import { Container, Card, Button, Badge } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Download, ArrowRight, Home } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const method = searchParams.get("method");
  const date = new Date().toLocaleDateString();

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5">
      <Card
        className="border-0 shadow-lg rounded-4 text-center p-5"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="mb-4">
          <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-4">
            <CheckCircle size={64} className="text-success" />
          </div>
        </div>

        <h2 className="fw-bold mb-2">
          {method === "COD"
            ? "Order Placed Successfully!"
            : "Payment Successful!"}
        </h2>
        <p className="text-muted mb-4">
          {method === "COD"
            ? "Your order has been received. Please pay cash upon delivery."
            : "Thank you for your purchase. Your payment has been confirmed."}
        </p>

        <div className="bg-light p-3 rounded-3 mb-4 text-start">
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted small">Transaction ID</span>
            <span className="fw-bold small text-dark">
              TXN-{Math.floor(Math.random() * 1000000)}
            </span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted small">Order ID</span>
            <span className="fw-bold small text-primary">
              {orderId && orderId !== "new"
                ? `#${orderId.slice(-6).toUpperCase()}`
                : "Processing..."}
            </span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted small">Payment Method</span>
            <Badge bg="info" className="text-uppercase">
              {method || "Online"}
            </Badge>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-muted small">Date</span>
            <span className="fw-bold small">{date}</span>
          </div>
        </div>

        <div className="d-grid gap-2">
          <Button variant="outline-dark" className="rounded-pill">
            <Download size={18} className="me-2" /> Download Invoice
          </Button>
          <Link
            to="/customer-dashboard"
            className="btn btn-primary rounded-pill fw-bold"
          >
            Go to Dashboard <ArrowRight size={18} className="ms-2" />
          </Link>
          <Link to="/" className="btn btn-link text-decoration-none text-muted">
            <Home size={16} className="me-1" /> Return Home
          </Link>
        </div>
      </Card>
    </Container>
  );
};

export default PaymentSuccess;
