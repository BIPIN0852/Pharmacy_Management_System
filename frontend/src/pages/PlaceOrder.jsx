import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Card,
  Row,
  Col,
  Table,
  Alert,
  Badge,
  Container,
} from "react-bootstrap";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { emptyCart } from "../redux/actions/cartActions";
import { useAuth } from "../context/AuthContext";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, cartItems, totalPrice } = cart;

  // Parse success params
  const sessionId = searchParams.get("session_id");
  const orderIdFromQuery = searchParams.get("order_id");
  const cancelled = searchParams.get("cancelled");
  const orderId = orderIdFromQuery || cart.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("processing");

  // Checkout steps - all complete
  const step1 = true;
  const step2 = true;
  const step3 = true;
  const step4 = true;

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      if (orderId) {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/customer/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const orderData = await res.json();
          setOrder(orderData);
          setStatus(orderData.isPaid ? "paid" : "pending");
        }
      }
    } catch (error) {
      console.error("Order fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleContinueShopping = () => {
    dispatch(emptyCart());
    navigate("/customer-dashboard");
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary mb-3"
            style={{ width: "3rem", height: "3rem" }}
          />
          <h4>Processing your order...</h4>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <CheckoutSteps step1={step1} step2={step2} step3={step3} step4={step4} />

      <Row className="justify-content-center">
        <Col lg={10}>
          {cancelled ? (
            <Alert variant="danger" className="text-center shadow-lg">
              <h4>Payment Cancelled</h4>
              <p>
                Your payment was cancelled. <Link to="/payment">Try again</Link>
              </p>
            </Alert>
          ) : (
            <Card className="shadow-lg border-0 overflow-hidden">
              <Card.Header className="bg-gradient-success text-white text-center py-4 position-relative">
                <div className="position-absolute top-0 start-0 p-3">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={handlePrintInvoice}
                  >
                    <i className="fas fa-print me-1"></i>Print Invoice
                  </Button>
                </div>
                <div>
                  <i className="fas fa-check-circle fa-3x mb-3"></i>
                  <h2 className="mb-2">Order Confirmed!</h2>
                  <h5 className="mb-0 opacity-90">
                    Order #{order?.id || orderId}
                    <Badge bg="light" text="dark" className="ms-2 fs-6">
                      {status === "paid" ? "PAID" : "PENDING"}
                    </Badge>
                  </h5>
                </div>
              </Card.Header>

              <Card.Body className="p-0">
                <Row className="g-0">
                  {/* Order Summary */}
                  <Col lg={8}>
                    <div className="p-4 border-end">
                      <h5 className="mb-4">
                        <i className="fas fa-receipt me-2 text-primary"></i>
                        Order Summary
                      </h5>

                      {/* Items Table */}
                      <Table className="mb-4">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(order?.items || cartItems).map((item, idx) => (
                            <tr key={idx}>
                              <td className="fw-semibold">{item.name}</td>
                              <td>{item.qty}</td>
                              <td>₹{item.price}</td>
                              <td>₹{(item.qty * item.price).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>

                      {/* Address & Payment */}
                      <div className="row mb-4">
                        <Col md={6}>
                          <h6>
                            <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                            Shipping Address
                          </h6>
                          <address className="text-muted small">
                            {shippingAddress?.address}
                            <br />
                            {shippingAddress?.city},{" "}
                            {shippingAddress?.postalCode}
                            <br />
                            {shippingAddress?.country}
                          </address>
                        </Col>
                        <Col md={6}>
                          <h6>
                            <i className="fas fa-credit-card me-2 text-success"></i>
                            Payment
                          </h6>
                          <div className="text-muted small">
                            Method: <strong>{paymentMethod || "COD"}</strong>
                            <br />
                            Status:{" "}
                            <Badge
                              bg={status === "paid" ? "success" : "warning"}
                            >
                              {status === "paid" ? "Paid" : "Pending"}
                            </Badge>
                          </div>
                        </Col>
                      </div>

                      {/* Order Status Timeline */}
                      <div className="order-timeline">
                        <div className="timeline-item active">
                          <div className="timeline-icon bg-success">
                            <i className="fas fa-check"></i>
                          </div>
                          <div className="timeline-content">
                            <h6>Order Confirmed</h6>
                            <small>{new Date().toLocaleDateString()}</small>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <div className="timeline-icon bg-info">
                            <i className="fas fa-shipping-fast"></i>
                          </div>
                          <div className="timeline-content">
                            <h6>Processing</h6>
                            <small>Preparing your order</small>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <div className="timeline-icon bg-primary">
                            <i className="fas fa-truck"></i>
                          </div>
                          <div className="timeline-content">
                            <h6>Shipped</h6>
                            <small>On the way</small>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <div className="timeline-icon bg-warning">
                            <i className="fas fa-home"></i>
                          </div>
                          <div className="timeline-content">
                            <h6>Delivered</h6>
                            <small>Arriving soon</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>

                  {/* Totals & Actions */}
                  <Col lg={4} className="bg-light">
                    <div className="p-4">
                      <h5 className="mb-4 text-primary">Order Total</h5>

                      <Table className="mb-4">
                        <tbody>
                          <tr>
                            <td>Subtotal:</td>
                            <td className="text-end fw-semibold">
                              ₹{(totalPrice || 0).toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td>Shipping:</td>
                            <td className="text-end text-success">FREE</td>
                          </tr>
                          <tr>
                            <td>Tax (10%):</td>
                            <td className="text-end">
                              ₹{((totalPrice || 0) * 0.1).toFixed(2)}
                            </td>
                          </tr>
                          <tr className="border-top">
                            <td className="h5 mb-0 fw-bold">Total:</td>
                            <td className="h4 mb-0 text-success fw-bold">
                              ₹{((totalPrice || 0) * 1.1).toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </Table>

                      <div className="d-grid gap-2">
                        <Button
                          variant="success"
                          size="lg"
                          className="rounded-pill fw-bold py-3 shadow-lg"
                          onClick={handleContinueShopping}
                        >
                          <i className="fas fa-tachometer-alt me-2"></i>
                          Continue Shopping
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="lg"
                          className="rounded-pill fw-bold py-3"
                          as={Link}
                          to="/customer-dashboard"
                        >
                          <i className="fas fa-chart-line me-2"></i>
                          Track Orders
                        </Button>
                      </div>

                      <div className="mt-4 p-3 bg-white rounded-3 border">
                        <h6 className="mb-3">
                          <i className="fas fa-shield-alt me-2 text-success"></i>
                          Delivery Promise
                        </h6>
                        <ul className="small mb-0">
                          <li>✅ Free delivery on orders above ₹500</li>
                          <li>✅ 7-day return policy</li>
                          <li>✅ Genuine medicines guaranteed</li>
                          <li>✅ 24/7 customer support</li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <style jsx>{`
        .order-timeline {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
        }
        .timeline-item {
          display: flex;
          align-items: flex-start;
          position: relative;
        }
        .timeline-item:not(:last-child)::after {
          content: "";
          position: absolute;
          left: 12px;
          top: 32px;
          bottom: -16px;
          width: 2px;
          background: #e9ecef;
        }
        .timeline-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          margin-right: 16px;
          flex-shrink: 0;
          margin-top: 4px;
        }
        .timeline-content h6 {
          margin-bottom: 4px;
          color: #333;
        }
        @media print {
          .d-none-print {
            display: none !important;
          }
        }
      `}</style>
    </Container>
  );
};

export default PlaceOrder;
