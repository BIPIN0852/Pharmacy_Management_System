import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Dropdown,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  Settings,
  RefreshCw,
  Eye,
  CheckCircle,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // ✅ Use global api service

const PharmacistOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // ✅ Using consolidated api service (Interceptor handles token)
      const data = await api.get("/orders");
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdateLoading(id);
      // ✅ Updated to match backend PUT /api/orders/:id/status
      await api.put(`/orders/${id}/status`, { status });

      const updatedOrders = orders.map((o) =>
        o._id === id ? { ...o, status } : o
      );
      setOrders(updatedOrders);
    } catch (err) {
      alert(err.response?.data?.message || "Could not update status.");
    } finally {
      setUpdateLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <Badge
            bg="success-subtle"
            className="text-success border border-success-subtle px-3 py-2 rounded-pill"
          >
            <CheckCircle size={12} className="me-1" /> Delivered
          </Badge>
        );
      case "Ready":
        return (
          <Badge
            bg="info-subtle"
            className="text-info border border-info-subtle px-3 py-2 rounded-pill"
          >
            <Package size={12} className="me-1" /> Ready
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge
            bg="danger-subtle"
            className="text-danger border border-danger-subtle px-3 py-2 rounded-pill"
          >
            <XCircle size={12} className="me-1" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge
            bg="warning-subtle"
            className="text-warning border border-warning-subtle px-3 py-2 rounded-pill"
          >
            <Truck size={12} className="me-1" /> Processing
          </Badge>
        );
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-muted">Loading pharmacy orders...</p>
      </div>
    );

  return (
    <div className="animate-fade-in px-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Order Management</h3>
          <p className="text-muted small">
            Process medicine orders and update fulfillment status
          </p>
        </div>
        <Button
          variant="white"
          className="border shadow-sm rounded-pill px-4"
          onClick={fetchOrders}
        >
          <RefreshCw size={18} className="me-2 text-success" /> Refresh List
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="rounded-3 shadow-sm">
          {error}
        </Alert>
      )}

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead className="bg-light border-bottom">
              <tr className="small text-uppercase text-muted fw-bold">
                <th className="py-3 ps-4">Order Details</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Date</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Payment</th>
                <th className="py-3">Fulfillment</th>
                <th className="py-3 text-end pe-4">Manage</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <Package size={48} className="opacity-25 mb-3" />
                    <p>No customer orders currently available.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">
                        #
                        {order._id
                          .substring(order._id.length - 8)
                          .toUpperCase()}
                      </div>
                      <div className="text-muted small">
                        {order.orderItems?.length || 0} items
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">
                        {order.user?.name || "Guest"}
                      </div>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {order.user?.email}
                      </div>
                    </td>
                    <td className="small text-secondary">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="fw-bold text-dark">
                      Rs. {order.totalPrice.toLocaleString()}
                    </td>
                    <td>
                      <Badge
                        bg={order.isPaid ? "success" : "warning"}
                        className="fw-normal"
                      >
                        {order.isPaid ? "PAID" : "PENDING"}
                      </Badge>
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td className="text-end pe-4">
                      {updateLoading === order._id ? (
                        <Spinner
                          size="sm"
                          animation="border"
                          variant="success"
                        />
                      ) : (
                        <div className="d-flex justify-content-end gap-2">
                          <Button
                            variant="light"
                            size="sm"
                            className="border rounded-circle p-2"
                            onClick={() =>
                              navigate(`/payment-success?order_id=${order._id}`)
                            }
                            title="View Items"
                          >
                            <Eye size={16} className="text-primary" />
                          </Button>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="white"
                              size="sm"
                              className="border shadow-sm rounded-3"
                            >
                              <Settings size={16} className="text-secondary" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                              align="end"
                              className="shadow border-0 rounded-3"
                            >
                              <Dropdown.Header className="small text-uppercase fw-bold">
                                Update Status
                              </Dropdown.Header>
                              <Dropdown.Item
                                onClick={() =>
                                  updateStatus(order._id, "Processing")
                                }
                              >
                                Set Processing
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => updateStatus(order._id, "Ready")}
                              >
                                Ready for Pickup
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  updateStatus(order._id, "Delivered")
                                }
                              >
                                Mark Delivered
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() =>
                                  updateStatus(order._id, "Cancelled")
                                }
                              >
                                Cancel Order
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PharmacistOrders;
