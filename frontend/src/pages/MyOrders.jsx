import React, { useEffect, useState } from "react";
import { Table, Button, Container, Badge, Alert, Spinner, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Eye, Trash2, AlertCircle, ChevronRight } from "lucide-react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const fetchOrders = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      // Fetches the list shown in your Order History
      const { data } = await axios.get("http://localhost:5000/api/orders/myorders", config);
      setOrders(data);
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
      // Sends DELETE request to the route we updated earlier
      await axios.delete(`http://localhost:5000/api/orders/${orderToDelete}`, config);
      setOrders(orders.filter((order) => order._id !== orderToDelete));
      setShowModal(false);
    } catch (err) {
      alert("Failed to delete order.");
    }
  };

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2 className="fw-bold">My Order History</h2>
        <p className="text-muted">Track and manage your previous pharmacy purchases</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="table-responsive shadow-sm rounded-4 border">
          <Table hover className="align-middle bg-white mb-0">
            <thead className="bg-light text-uppercase small fw-bold">
              <tr>
                <th className="py-3 ps-4">Order ID</th>
                <th className="py-3">Date</th>
                <th className="py-3">Total Amount</th>
                <th className="py-3">Payment</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="ps-4 fw-bold text-primary">#{order._id.substring(0, 8).toUpperCase()}</td>
                  <td className="text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="fw-bold">Rs. {order.totalPrice}</td>
                  
                  <td>
                    <div className="d-flex flex-column gap-1">
                      <span className="small text-muted fw-bold">{order.paymentMethod || "N/A"}</span>
                      {order.isPaid ? (
                        <Badge bg="success" className="rounded-pill px-2">Paid</Badge>
                      ) : (
                        <Badge bg="warning" text="dark" className="rounded-pill px-2">Pending</Badge>
                      )}
                    </div>
                  </td>

                  <td>
                    <Badge bg={order.isDelivered ? "success" : "secondary"} className="rounded-pill px-3">
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </Badge>
                  </td>

                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Link to={`/order/${order._id}`}>
                        <Button variant="outline-primary" size="sm" className="rounded-circle p-2"><Eye size={16} /></Button>
                      </Link>
                      {/* ✅ THE REMOVE BUTTON */}
                      <Button 
                        variant="outline-danger" size="sm" className="rounded-circle p-2"
                        onClick={() => { setOrderToDelete(order._id); setShowModal(true); }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title className="text-danger">Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to remove this order? This cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete Order</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyOrders;