import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Image,
  Badge,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { ArrowLeft, MapPin, User, CreditCard, Package } from "lucide-react";
import api from "../services/api";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!order) return <Alert variant="warning">Order not found</Alert>;

  return (
    <Container className="py-5">
      <Link
        to={-1}
        className="btn btn-outline-secondary mb-4 rounded-pill px-4"
      >
        <ArrowLeft size={18} className="me-2" /> Back
      </Link>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          Order #{order._id.slice(-6).toUpperCase()}
        </h2>
        <Badge
          bg={order.isPaid ? "success" : "warning"}
          className="px-3 py-2 fs-6"
        >
          {order.isPaid ? "PAID" : "PENDING"}
        </Badge>
      </div>

      <Row className="g-4">
        {/* Left Column: Items */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Header className="bg-white border-bottom p-4">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <Package className="me-2 text-primary" size={20} /> Order Items
              </h5>
            </Card.Header>
            <ListGroup variant="flush">
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index} className="p-4">
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link
                        to={`/medicine/${item.product}`}
                        className="fw-bold text-dark text-decoration-none"
                      >
                        {item.name}
                      </Link>
                      <div className="text-muted small">
                        Unit Price: Rs. {item.price}
                      </div>
                    </Col>
                    <Col md={4} className="text-end">
                      <div className="fw-bold">
                        {item.qty} x Rs. {item.price} = Rs.{" "}
                        {(item.qty * item.price).toFixed(2)}
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Right Column: Info */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">Order Summary</h5>

              <div className="mb-4">
                <h6 className="text-muted small fw-bold text-uppercase mb-2">
                  <User size={14} className="me-1" /> Customer
                </h6>
                <p className="mb-0 fw-bold">{order.user?.name}</p>
                <p className="mb-0 text-muted small">{order.user?.email}</p>
              </div>

              <div className="mb-4">
                <h6 className="text-muted small fw-bold text-uppercase mb-2">
                  <MapPin size={14} className="me-1" /> Shipping
                </h6>
                <p className="mb-0 text-muted">
                  {order.shippingAddress.address}, {order.shippingAddress.city}
                  <br />
                  {order.shippingAddress.country},{" "}
                  {order.shippingAddress.postalCode}
                </p>
              </div>

              <div className="mb-4">
                <h6 className="text-muted small fw-bold text-uppercase mb-2">
                  <CreditCard size={14} className="me-1" /> Payment Method
                </h6>
                <p className="mb-0 fw-bold">{order.paymentMethod}</p>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Items</span>
                <span>Rs. {order.itemsPrice}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>Rs. {order.shippingPrice}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>Rs. {order.taxPrice}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 mt-3 pt-3 border-top">
                <span>Total</span>
                <span className="text-primary">Rs. {order.totalPrice}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetails;
