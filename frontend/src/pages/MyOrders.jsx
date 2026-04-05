import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container,
  Badge,
  Alert,
  Spinner,
  Modal,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Eye,
  Trash2,
  AlertCircle,
  ShoppingBag,
  CreditCard,
  Wallet,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  MapPin,
  User,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get(
        "http://localhost:5000/api/orders/myorders",
        config,
      );
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) fetchOrders();
  }, [userInfo]);

  const handleDelete = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.delete(
        `http://localhost:5000/api/orders/${orderToDelete}`,
        config,
      );
      setOrders(orders.filter((order) => order._id !== orderToDelete));
      setShowCancelModal(false);
    } catch (err) {
      alert("Failed to cancel order.");
    }
  };

  // Trigger Modal
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const getPaymentIcon = (method) => {
    if (method === "Stripe")
      return <CreditCard size={14} className="me-1 text-primary" />;
    if (method === "Khalti")
      return <Wallet size={14} className="me-1" style={{ color: "#5E35B1" }} />;
    return <Truck size={14} className="me-1 text-success" />;
  };

  return (
    <div
      style={{
        backgroundColor: "#f0f2f2",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <Container className="py-5">
        {/* Header */}
        <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <ShoppingBag style={{ color: "#007185" }} /> My Order History
            </h3>
          </div>
          <Link
            to="/medicines"
            className="btn fw-medium shadow-sm rounded-1 px-4 border-0"
            style={{ backgroundColor: "#FFD814" }}
          >
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#007185" }} />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Card className="shadow-sm border-0 rounded-1 overflow-hidden">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="bg-light">
                  <tr className="text-uppercase small text-muted fw-bold">
                    <th className="py-3 ps-4">Order ID</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3">Payment</th>
                    <th className="py-3">Fulfillment</th>
                    <th className="py-3 text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="ps-4">
                        {/* Clickable Order ID */}
                        <Button
                          variant="link"
                          className="p-0 fw-bold text-decoration-none shadow-none"
                          style={{ color: "#007185" }}
                          onClick={() => handleViewDetails(order)}
                        >
                          #
                          {order.orderNumber ||
                            order._id
                              .substring(order._id.length - 6)
                              .toUpperCase()}
                        </Button>
                      </td>
                      <td className="small text-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="fw-bold text-dark">
                        Rs. {order.totalPrice?.toLocaleString()}
                      </td>
                      <td>
                        <Badge
                          bg={order.isPaid ? "success" : "warning"}
                          text={order.isPaid ? "light" : "dark"}
                          className="rounded-1"
                        >
                          {order.isPaid ? "PAID" : "PENDING"}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          bg="light"
                          text="dark"
                          className="border rounded-1"
                        >
                          {order.orderStatus || "Processing"}
                        </Badge>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          {/* Details Button */}
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="rounded-1"
                            onClick={() => handleViewDetails(order)}
                          >
                            <Eye size={16} />
                          </Button>

                          {!order.isPaid &&
                            order.orderStatus === "Processing" && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="rounded-1"
                                onClick={() => {
                                  setOrderToDelete(order._id);
                                  setShowCancelModal(true);
                                }}
                              >
                                <Trash2 size={16} />
                              </Button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        )}

        {/* ORDER DETAILS MODAL */}
        <Modal
          show={showOrderModal}
          onHide={() => setShowOrderModal(false)}
          centered
          size="lg"
        >
          {selectedOrder && (
            <>
              <Modal.Header closeButton className="bg-light">
                <Modal.Title className="fw-bold fs-5">
                  Order Details: #
                  {selectedOrder.orderNumber ||
                    selectedOrder._id
                      .substring(selectedOrder._id.length - 6)
                      .toUpperCase()}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-4">
                <Row className="mb-4 g-3">
                  <Col md={6}>
                    <div className="p-3 bg-light border rounded-1 h-100">
                      <h6 className="fw-bold small text-uppercase text-muted mb-2">
                        <MapPin size={14} className="me-1" /> Shipping Info
                      </h6>
                      <div className="fw-bold">
                        {selectedOrder.user?.name || userInfo.name}
                      </div>
                      <div className="small text-muted">
                        {selectedOrder.shippingAddress?.address},{" "}
                        {selectedOrder.shippingAddress?.city}
                        <br />
                        {selectedOrder.shippingAddress?.country} -{" "}
                        {selectedOrder.shippingAddress?.postalCode}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-3 bg-light border rounded-1 h-100">
                      <h6 className="fw-bold small text-uppercase text-muted mb-2">
                        <CreditCard size={14} className="me-1" /> Payment &
                        Status
                      </h6>
                      <div className="small">
                        <strong>Method:</strong> {selectedOrder.paymentMethod}
                      </div>
                      <div className="small">
                        <strong>Paid:</strong>{" "}
                        {selectedOrder.isPaid ? "Yes" : "No"}
                      </div>
                      <div className="small">
                        <strong>Fulfillment:</strong>{" "}
                        {selectedOrder.orderStatus || "Processing"}
                      </div>
                    </div>
                  </Col>
                </Row>

                <h6 className="fw-bold border-bottom pb-2 mb-3">
                  <Package size={16} className="me-2" /> Order Items
                </h6>
                <Table size="sm" borderless className="mb-4">
                  <thead>
                    <tr className="text-muted small border-bottom">
                      <th>Item</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems?.map((item, i) => (
                      <tr key={i} className="small border-bottom">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2 text-center">{item.qty}</td>
                        <td className="py-2 text-end">Rs. {item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-end">
                  <div
                    className="text-end border-top pt-2"
                    style={{ width: "200px" }}
                  >
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Subtotal:</span>
                      <span>Rs. {selectedOrder.itemsPrice}</span>
                    </div>
                    <div
                      className="d-flex justify-content-between fw-bold fs-5 mt-1"
                      style={{ color: "#B12704" }}
                    >
                      <span>Total:</span>
                      <span>Rs. {selectedOrder.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {selectedOrder.prescriptionImage && (
                  <div className="mt-4 pt-3 border-top">
                    <h6 className="fw-bold small text-uppercase text-muted mb-2">
                      <FileText size={14} className="me-1" /> Prescription
                      Attached
                    </h6>
                    <img
                      src={
                        selectedOrder.prescriptionImage.startsWith("http")
                          ? selectedOrder.prescriptionImage
                          : `http://localhost:5000${selectedOrder.prescriptionImage}`
                      }
                      alt="Rx"
                      className="img-fluid rounded border"
                      style={{ maxHeight: "150px" }}
                    />
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer className="bg-light">
                <Link
                  to={`/payment-success?orderId=${selectedOrder._id}`}
                  className="btn btn-outline-dark btn-sm rounded-1"
                >
                  View Full Receipt
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-1"
                  onClick={() => setShowOrderModal(false)}
                >
                  Close
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>

        {/* Cancel Modal */}
        <Modal
          show={showCancelModal}
          onHide={() => setShowCancelModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="fs-5 fw-bold">Cancel Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to cancel this order? This cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowCancelModal(false)}>
              Back
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Yes, Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default MyOrders;
