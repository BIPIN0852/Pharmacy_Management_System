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

import React, { useEffect } from "react";
import { Container, Card, Button, Badge } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Download, ArrowRight, Home, Receipt } from "lucide-react";
import confetti from "canvas-confetti"; // Optional: adds celebration effect

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const method = searchParams.get("method");
  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    // Trigger confetti on mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5 fade-in">
      <Card
        className="border-0 shadow-lg rounded-4 text-center p-4 p-md-5 position-relative overflow-hidden"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        {/* Decorative background circle */}
        <div
          className="position-absolute top-0 start-50 translate-middle rounded-circle bg-success opacity-10"
          style={{ width: "300px", height: "300px", marginTop: "-100px" }}
        />

        <div className="position-relative z-1">
          <div className="mb-4">
            <div className="bg-success text-white rounded-circle d-inline-flex p-3 shadow-sm">
              <CheckCircle size={48} strokeWidth={3} />
            </div>
          </div>

          <h2 className="fw-bold mb-2 text-dark">
            {method === "COD" ? "Order Placed!" : "Payment Successful!"}
          </h2>
          <p className="text-muted mb-4 px-3">
            {method === "COD"
              ? "Your order has been confirmed. Please keep cash ready upon delivery."
              : "Thank you for your purchase. A confirmation email has been sent to you."}
          </p>

          {/* Receipt Details Card */}
          <div className="bg-light bg-opacity-50 border border-light-subtle p-4 rounded-4 mb-4 text-start shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary border-opacity-10">
              <span className="text-muted small text-uppercase fw-bold tracking-wider">
                Order Receipt
              </span>
              <Receipt size={16} className="text-muted opacity-50" />
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Order ID</span>
              <span className="fw-bold text-dark font-monospace">
                {orderId && orderId !== "new"
                  ? `#${orderId.slice(-6).toUpperCase()}`
                  : "PROCESSING"}
              </span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Date</span>
              <span className="fw-medium small text-dark">{date}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Payment Method</span>
              <Badge
                bg={method === "COD" ? "warning" : "success"}
                text={method === "COD" ? "dark" : "white"}
                className="fw-medium px-2"
              >
                {method === "COD"
                  ? "Cash on Delivery"
                  : method || "Online Payment"}
              </Badge>
            </div>

            <div className="d-flex justify-content-between">
              <span className="text-muted small">Transaction ID</span>
              <span className="text-muted small font-monospace">
                TXN-{Math.floor(Math.random() * 10000000)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-grid gap-3">
            <Button
              variant="outline-secondary"
              className="rounded-pill border-opacity-25 hover-bg-light"
            >
              <Download size={18} className="me-2" /> Download Receipt
            </Button>

            <Link
              to="/customer-dashboard"
              className="btn btn-primary rounded-pill fw-bold py-2 shadow-sm d-flex justify-content-center align-items-center"
            >
              Go to Dashboard <ArrowRight size={18} className="ms-2" />
            </Link>

            <Link
              to="/"
              className="btn btn-link text-decoration-none text-muted small mt-2"
            >
              <Home size={14} className="me-1" /> Return to Home
            </Link>
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default PaymentSuccess;
