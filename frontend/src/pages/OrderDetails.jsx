import React, { useEffect, useState } from "react";
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Badge,
  Spinner,
  Alert,
  Button,
  Table,
} from "react-bootstrap";
import {
  ArrowLeft,
  MapPin,
  User,
  CreditCard,
  Package,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Calendar,
} from "lucide-react";
import api from "../services/api";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // ✅ Added searchParams

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    const paymentStatus = searchParams.get("status");

    // ✅ AUTOMATIC PAYMENT VERIFICATION LOGIC
    const verifyPaymentAndFetch = async () => {
      try {
        // If the URL contains Khalti success parameters
        if (pidx && (paymentStatus === "Completed" || !paymentStatus)) {
          // 1. Tell backend to verify Khalti
          await api.post("/payments/khalti-lookup", { pidx }).catch(() => null);

          // 2. Automatically mark order as PAID in the database
          await api
            .put(`/orders/${id}/pay`, {
              id: pidx,
              status: "COMPLETED",
              update_time: new Date().toISOString(),
            })
            .catch(() => null);

          // 3. Clean up the URL so it doesn't re-verify on refresh
          setSearchParams({});
        }
      } catch (err) {
        console.error("Auto-verification failed:", err);
      } finally {
        // 4. Fetch the fully updated order details
        fetchOrder();
      }
    };

    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load order details.",
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentAndFetch();
  }, [id, searchParams, setSearchParams]);

  if (loading)
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <Spinner
          animation="border"
          style={{ color: "#007185", width: "3rem", height: "3rem" }}
          className="mb-3"
        />
        <span className="fw-bold text-muted text-uppercase tracking-wider small">
          Loading Order Details...
        </span>
      </div>
    );

  if (error)
    return (
      <Container className="py-5">
        <Alert
          variant="danger"
          className="border-0 shadow-sm rounded-1 d-flex align-items-center gap-2"
          style={{
            backgroundColor: "#fef0f0",
            color: "#B12704",
            borderLeft: "4px solid #B12704",
          }}
        >
          <AlertCircle size={20} /> {error}
        </Alert>
        <Button
          variant="link"
          onClick={() => navigate(-1)}
          style={{ color: "#007185" }}
          className="p-0 text-decoration-none hover-underline fw-medium"
        >
          <ArrowLeft size={18} className="me-1" /> Go Back
        </Button>
      </Container>
    );

  if (!order) return <Alert variant="warning">Order not found</Alert>;

  const status =
    order.orderStatus || (order.isDelivered ? "Delivered" : "Processing");

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
            className="text-decoration-none text-dark p-0 d-flex align-items-center hover-underline fw-medium"
            style={{ width: "fit-content" }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="me-1" /> Back to Orders
          </Button>
        </div>

        {/* Top Status Banner */}
        <Card
          className="border-0 shadow-sm rounded-1 mb-4 bg-white"
          style={{ borderColor: "#D5D9D9" }}
        >
          <Card.Body className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h3 className="fw-bold mb-1" style={{ color: "#0F1111" }}>
                Order #
                {order.orderNumber ||
                  order._id.substring(order._id.length - 6).toUpperCase()}
              </h3>
              <div className="text-muted small d-flex align-items-center gap-2">
                <Calendar size={14} />
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className="d-flex gap-2">
              <Badge
                bg={
                  order.isPaid
                    ? "success"
                    : order.paymentMethod === "COD"
                      ? "secondary"
                      : "warning"
                }
                text={
                  order.isPaid || order.paymentMethod === "COD"
                    ? "light"
                    : "dark"
                }
                className="px-3 py-2 fs-6 rounded-1 shadow-sm d-flex align-items-center gap-2"
              >
                {order.isPaid ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Clock size={16} />
                )}
                {order.isPaid
                  ? "PAID"
                  : order.paymentMethod === "COD"
                    ? "CASH ON DELIVERY"
                    : "PENDING PAYMENT"}
              </Badge>
              <Badge
                bg="light"
                text="dark"
                className="px-3 py-2 fs-6 rounded-1 shadow-sm border d-flex align-items-center gap-2"
                style={{ borderColor: "#D5D9D9" }}
              >
                <Truck size={16} style={{ color: "#007185" }} /> {status}
              </Badge>
            </div>
          </Card.Body>
        </Card>

        <Row className="g-4">
          <Col lg={8}>
            {/* Order Items */}
            <Card
              className="border-0 shadow-sm rounded-1 mb-4 bg-white"
              style={{ borderColor: "#D5D9D9" }}
            >
              <Card.Header className="bg-light border-bottom p-3">
                <h6 className="mb-0 fw-bold d-flex align-items-center text-uppercase tracking-wider text-muted small">
                  <Package
                    className="me-2"
                    size={16}
                    style={{ color: "#007185" }}
                  />{" "}
                  Items in this Order
                </h6>
              </Card.Header>
              <div className="table-responsive">
                <Table hover className="align-middle mb-0 custom-saas-table">
                  <thead className="bg-white text-muted small">
                    <tr>
                      <th className="ps-4">Product</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end pe-4">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, index) => (
                      <tr
                        key={index}
                        className="border-bottom border-light-subtle table-row-hover"
                      >
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="bg-white border rounded-1 p-1 shadow-sm"
                              style={{
                                width: "60px",
                                height: "60px",
                                borderColor: "#D5D9D9",
                              }}
                            >
                              <Image
                                src={
                                  item.image?.startsWith("http")
                                    ? item.image
                                    : `http://localhost:5000${item.image}`
                                }
                                alt={item.name}
                                fluid
                                className="h-100 w-100 object-fit-contain"
                              />
                            </div>
                            <div>
                              <Link
                                to={`/medicine/${item.product}`}
                                className="fw-bold text-decoration-none hover-underline"
                                style={{
                                  color: "#007185",
                                  fontSize: "0.95rem",
                                }}
                              >
                                {item.name}
                              </Link>
                              <div className="text-muted small mt-1">
                                Unit: {item.unit || "Pack"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center text-muted fw-medium">
                          Rs. {Number(item.price).toFixed(2)}
                        </td>
                        <td className="text-center fw-bold">{item.qty}</td>
                        <td className="text-end pe-4 fw-bold text-dark">
                          Rs. {(item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>

          {/* Right Column: Order Summary */}
          <Col lg={4}>
            <Card
              className="border-0 shadow-sm rounded-1 mb-4 sticky-top bg-white"
              style={{ top: "20px", borderColor: "#D5D9D9" }}
            >
              <Card.Header className="bg-light border-bottom p-3">
                <h6 className="mb-0 fw-bold text-uppercase tracking-wider text-muted small">
                  Order Summary
                </h6>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="mb-4">
                  <h6 className="small fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <User size={16} style={{ color: "#007185" }} /> Customer
                    Details
                  </h6>
                  <div
                    className="p-3 bg-light border rounded-1"
                    style={{ borderColor: "#D5D9D9" }}
                  >
                    <p className="mb-1 fw-bold text-dark">
                      {order.user?.name || "Guest Checkout"}
                    </p>
                    <p className="mb-0 text-muted small">
                      {order.user?.email || "No email provided"}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="small fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <MapPin size={16} style={{ color: "#007185" }} /> Shipping
                    Address
                  </h6>
                  <div
                    className="p-3 bg-light border rounded-1"
                    style={{ borderColor: "#D5D9D9" }}
                  >
                    <p
                      className="mb-0 text-dark small"
                      style={{ lineHeight: "1.6" }}
                    >
                      <span className="fw-medium">
                        {order.shippingAddress.address}
                      </span>
                      <br />
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.country}
                      <br />
                      Postal Code: {order.shippingAddress.postalCode}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="small fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <CreditCard size={16} style={{ color: "#007185" }} />{" "}
                    Payment Method
                  </h6>
                  <div
                    className="p-3 bg-light border rounded-1 d-flex justify-content-between align-items-center"
                    style={{ borderColor: "#D5D9D9" }}
                  >
                    <span className="fw-bold text-dark">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                <hr style={{ borderColor: "#D5D9D9" }} />

                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>Items Subtotal:</span>
                  <span>Rs. {order.itemsPrice?.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>Shipping & Handling:</span>
                  <span>
                    {order.shippingPrice === 0
                      ? "FREE"
                      : `Rs. ${order.shippingPrice?.toFixed(2)}`}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-3 small text-muted">
                  <span>Tax (13%):</span>
                  <span>Rs. {order.taxPrice?.toFixed(2)}</span>
                </div>

                <div
                  className="p-3 rounded-1 mt-2"
                  style={{
                    backgroundColor: "#fef0f0",
                    border: "1px solid #f5c6cb",
                  }}
                >
                  <div
                    className="d-flex justify-content-between fw-bold fs-5"
                    style={{ color: "#B12704" }}
                  >
                    <span>Order Total:</span>
                    <span>Rs. {order.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .tracking-wider { letter-spacing: 0.05em; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .hover-underline:hover { text-decoration: underline !important; cursor: pointer; }
        .table-row-hover:hover { background-color: #f8f9fa; }
      `}</style>
    </div>
  );
};

export default OrderDetails;
