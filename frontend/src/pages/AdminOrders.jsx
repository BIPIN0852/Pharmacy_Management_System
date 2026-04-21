import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  ShoppingBag,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Filter,
  CreditCard,
  Truck,
  Wallet,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  User,
  Package,
  Image as ImageIcon,
} from "lucide-react";
import { Badge, Spinner, Row, Col, Table } from "react-bootstrap";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  // State for Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api
        .get("/admin/orders")
        .catch(() => api.get("/orders"));
      const data = response.data?.orders || response.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Failed to sync global order registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
      // If modal is open for this order, close it or refetch it (closing is safer)
      if (selectedOrder && selectedOrder._id === orderId) {
        setShowOrderModal(false);
      }
    } catch (err) {
      alert(
        "Status update failed: " +
          (err.response?.data?.message || "Server Error"),
      );
    }
  };

  const handleMarkAsPaid = async (orderId) => {
    if (
      window.confirm(
        "Are you sure you want to mark this order as PAID? This will send a receipt to the customer.",
      )
    ) {
      try {
        await api.put(`/orders/${orderId}/pay-manual`);
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId)
          setShowOrderModal(false);
      } catch (err) {
        alert(
          "Failed to mark as paid: " +
            (err.response?.data?.message || "Server Error"),
        );
      }
    }
  };

  const handleRxStatus = async (orderId, rxStatus) => {
    if (
      window.confirm(
        `Are you sure you want to mark this prescription as ${rxStatus}?`,
      )
    ) {
      try {
        await api.put(`/orders/${orderId}/prescription`, { status: rxStatus });
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId)
          setShowOrderModal(false);
      } catch (err) {
        alert("Failed to update prescription status.");
      }
    }
  };

  // Open Modal Handler
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      order.orderStatus === statusFilter ||
      order.status === statusFilter;

    const matchesPayment =
      paymentFilter === "All"
        ? true
        : paymentFilter === "Paid"
          ? order.isPaid
          : !order.isPaid;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getPaymentIcon = (method) => {
    if (method === "Stripe")
      return <CreditCard size={14} className="me-1 text-primary" />;
    if (method === "Khalti")
      return <Wallet size={14} className="me-1" style={{ color: "#5E35B1" }} />;
    return <Truck size={14} className="me-1 text-success" />;
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center py-5 vh-100"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <Spinner
          animation="border"
          style={{ color: "#007185", width: "3rem", height: "3rem" }}
          className="mb-3"
        />
        <span className="fw-bold text-muted text-uppercase tracking-wider small">
          Syncing Global Orders...
        </span>
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-4 px-md-4 animate-fade-in min-vh-100"
      style={{ backgroundColor: "#f0f2f2" }}
    >
      {/* Header Section */}
      <div
        className="card border-0 shadow-sm rounded-1 bg-white mb-4"
        style={{ borderColor: "#D5D9D9" }}
      >
        <div className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h4
              className="fw-bold mb-1 d-flex align-items-center gap-2"
              style={{ color: "#0F1111" }}
            >
              <ShoppingBag style={{ color: "#007185" }} /> Global Order Registry
            </h4>
            <p className="text-muted small mb-0">
              Manage purchases, fulfillment, payments, and prescriptions.
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <select
              className="form-select form-select-sm rounded-1 shadow-none border"
              style={{ width: "140px", borderColor: "#D5D9D9" }}
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid Only</option>
              <option value="Unpaid">Pending/Unpaid</option>
            </select>

            <select
              className="form-select form-select-sm rounded-1 shadow-none border"
              style={{ width: "150px", borderColor: "#D5D9D9" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Fulfillment</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="On Hold (Rx Review)">On Hold (Rx)</option>
            </select>

            <div
              className="input-group input-group-sm shadow-none border rounded-1 bg-white"
              style={{ borderColor: "#D5D9D9" }}
            >
              <span className="input-group-text bg-white border-0 ps-3">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="search"
                className="form-control border-0 shadow-none custom-search-input"
                style={{ width: "200px" }}
                placeholder="Search Order ID or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="alert alert-danger py-2 shadow-sm mb-3 rounded-1 border-0 d-flex align-items-center gap-2"
          style={{
            backgroundColor: "#fef0f0",
            color: "#B12704",
            borderLeft: "4px solid #B12704",
          }}
        >
          <AlertCircle size={18} />{" "}
          <span className="small fw-medium">{error}</span>
        </div>
      )}

      {/* Main Table */}
      <div
        className="card shadow-sm border-0 rounded-1 overflow-hidden bg-white"
        style={{ borderColor: "#D5D9D9" }}
      >
        <div
          className="table-responsive custom-scrollbar"
          style={{ minHeight: "500px" }}
        >
          <table className="table table-hover align-middle mb-0 custom-saas-table">
            <thead className="bg-light">
              <tr className="text-uppercase small text-muted fw-bold tracking-wider">
                <th className="py-3 ps-4">Order ID</th>
                <th className="py-3">Customer & Date</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Payment</th>
                <th className="py-3">Fulfillment</th>
                <th className="py-3">Rx Status</th>
                <th className="py-3 pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <ShoppingBag
                      size={48}
                      className="text-muted opacity-25 mb-3"
                    />
                    <p className="text-muted fw-medium mb-0">
                      No orders found matching your filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status =
                    order.orderStatus || order.status || "Processing";

                  return (
                    <tr
                      key={order._id}
                      className="border-bottom border-light-subtle table-row-hover"
                    >
                      <td className="ps-4">
                        {/* CLICKABLE ORDER ID */}
                        <button
                          className="btn btn-link p-0 fw-bold font-monospace shadow-none text-decoration-none hover-underline"
                          style={{ color: "#007185", fontSize: "0.9rem" }}
                          onClick={() => handleViewDetails(order)}
                        >
                          #
                          {order.orderNumber ||
                            order._id
                              .substring(order._id.length - 6)
                              .toUpperCase()}
                        </button>
                      </td>

                      <td>
                        <div
                          className="fw-bold text-dark"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {order.user?.name || "Guest User"}
                        </div>
                        <div className="small text-muted">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </td>

                      <td
                        className="fw-bold"
                        style={{ color: "#B12704", fontSize: "0.95rem" }}
                      >
                        Rs. {order.totalPrice?.toFixed(2)}
                      </td>

                      {/* UPDATED PAYMENT STATUS BADGE (TABLE) */}
                      <td>
                        <div className="d-flex flex-column align-items-start">
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
                            className="mb-1 rounded-1 fw-medium shadow-sm d-flex align-items-center gap-1"
                          >
                            {order.isPaid ? (
                              <CheckCircle size={12} />
                            ) : (
                              <Clock size={12} />
                            )}
                            {order.isPaid
                              ? "PAID"
                              : order.paymentMethod === "COD"
                                ? "COD"
                                : "PENDING"}
                          </Badge>
                          <small
                            className="text-muted fw-bold d-flex align-items-center mt-1"
                            style={{ fontSize: "0.7rem" }}
                          >
                            {getPaymentIcon(order.paymentMethod)}{" "}
                            {order.paymentMethod}
                          </small>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`badge rounded-1 px-3 py-1 fw-medium border shadow-sm ${
                            status === "Delivered"
                              ? "bg-success-subtle text-success border-success-subtle"
                              : status === "Cancelled"
                                ? "bg-danger-subtle text-danger border-danger-subtle"
                                : status === "Shipped"
                                  ? "bg-info-subtle text-info border-info-subtle"
                                  : status === "On Hold (Rx Review)"
                                    ? "bg-warning-subtle text-dark border-warning-subtle"
                                    : "bg-light text-dark border-secondary-subtle"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        {order.prescriptionStatus === "Not Required" ? (
                          <span className="text-muted small">-</span>
                        ) : order.prescriptionStatus ===
                          "Pending Verification" ? (
                          <Badge
                            bg="warning"
                            text="dark"
                            className="rounded-1 d-flex align-items-center gap-1"
                            style={{ width: "fit-content" }}
                          >
                            <FileText size={12} /> Pending Rx
                          </Badge>
                        ) : order.prescriptionStatus === "Approved" ? (
                          <Badge
                            bg="success"
                            className="rounded-1 d-flex align-items-center gap-1"
                            style={{ width: "fit-content" }}
                          >
                            <CheckCircle2 size={12} /> Rx Approved
                          </Badge>
                        ) : (
                          <Badge
                            bg="danger"
                            className="rounded-1 d-flex align-items-center gap-1"
                            style={{ width: "fit-content" }}
                          >
                            <XCircle size={12} /> Rx Rejected
                          </Badge>
                        )}
                      </td>

                      <td className="pe-4 text-end">
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-light border shadow-sm rounded-1 p-1"
                            type="button"
                            data-bs-toggle="dropdown"
                            style={{ borderColor: "#D5D9D9" }}
                          >
                            <MoreVertical size={18} className="text-dark" />
                          </button>

                          <ul
                            className="dropdown-menu dropdown-menu-end shadow border-0 rounded-1 py-2"
                            style={{
                              border: "1px solid #D5D9D9 !important",
                              minWidth: "200px",
                            }}
                          >
                            {/* VIEW DETAILS */}
                            <li>
                              <button
                                className="dropdown-item small fw-bold d-flex align-items-center gap-2"
                                style={{ color: "#007185" }}
                                onClick={() => handleViewDetails(order)}
                              >
                                <Eye size={14} /> View Order Details
                              </button>
                            </li>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>

                            {/* PRESCRIPTION CONTROLS */}
                            {order.prescriptionStatus ===
                              "Pending Verification" && (
                              <>
                                <li>
                                  <h6 className="dropdown-header small fw-bold text-uppercase text-primary">
                                    Rx Verification
                                  </h6>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item small text-success fw-medium d-flex align-items-center gap-2"
                                    onClick={() =>
                                      handleRxStatus(order._id, "Approved")
                                    }
                                  >
                                    <CheckCircle2 size={14} /> Approve
                                    Prescription
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item small text-danger fw-medium d-flex align-items-center gap-2"
                                    onClick={() =>
                                      handleRxStatus(order._id, "Rejected")
                                    }
                                  >
                                    <XCircle size={14} /> Reject & Cancel Order
                                  </button>
                                </li>
                                <li>
                                  <hr className="dropdown-divider" />
                                </li>
                              </>
                            )}

                            {/* PAYMENT CONTROLS */}
                            {!order.isPaid && status !== "Cancelled" && (
                              <>
                                <li>
                                  <button
                                    className="dropdown-item small fw-bold d-flex align-items-center gap-2"
                                    style={{ color: "#067D62" }}
                                    onClick={() => handleMarkAsPaid(order._id)}
                                  >
                                    <Wallet size={14} /> Mark as PAID
                                  </button>
                                </li>
                                <li>
                                  <hr className="dropdown-divider" />
                                </li>
                              </>
                            )}

                            {/* FULFILLMENT CONTROLS */}
                            <li>
                              <h6 className="dropdown-header small fw-bold text-uppercase text-secondary">
                                Update Status
                              </h6>
                            </li>
                            <li>
                              <button
                                className="dropdown-item small text-dark"
                                onClick={() =>
                                  handleUpdateStatus(order._id, "Processing")
                                }
                              >
                                Set Processing
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item small text-dark"
                                onClick={() =>
                                  handleUpdateStatus(order._id, "Shipped")
                                }
                              >
                                Set Shipped
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item small fw-bold text-success"
                                onClick={() =>
                                  handleUpdateStatus(order._id, "Delivered")
                                }
                              >
                                Set Delivered
                              </button>
                            </li>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <button
                                className="dropdown-item small fw-bold text-danger"
                                onClick={() =>
                                  handleUpdateStatus(order._id, "Cancelled")
                                }
                              >
                                Cancel Order
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================================== */}
      {/*  ORDER DETAILS MODAL */}
      {/* ==================================================================================== */}
      {showOrderModal && selectedOrder && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={() => setShowOrderModal(false)}
          ></div>
          <div
            className="modal show d-block animate-fade-in"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
              <div
                className="modal-content border border-secondary shadow-lg rounded-1"
                style={{ borderColor: "#D5D9D9 !important" }}
              >
                {/* Modal Header */}
                <div className="modal-header bg-light border-bottom p-4 pb-3">
                  <div>
                    <h5 className="modal-title fw-bold text-dark mb-1">
                      Order Details
                    </h5>
                    <div className="small text-muted font-monospace">
                      ID: #
                      {selectedOrder.orderNumber ||
                        selectedOrder._id.toUpperCase()}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close shadow-none"
                    onClick={() => setShowOrderModal(false)}
                  ></button>
                </div>

                {/* Modal Body */}
                <div className="modal-body p-4 bg-white">
                  {/* Top Info Cards */}
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <div
                        className="p-3 bg-light rounded-1 border h-100"
                        style={{ borderColor: "#D5D9D9" }}
                      >
                        <h6 className="fw-bold small text-uppercase text-muted mb-2 d-flex align-items-center gap-2">
                          <User size={14} /> Customer Info
                        </h6>
                        <div className="fw-bold text-dark">
                          {selectedOrder.user?.name || "Guest User"}
                        </div>
                        <div className="small text-muted">
                          {selectedOrder.user?.email || "No email provided"}
                        </div>

                        <hr
                          className="my-2"
                          style={{ borderColor: "#D5D9D9" }}
                        />

                        <h6 className="fw-bold small text-uppercase text-muted mb-1 d-flex align-items-center gap-2 mt-2">
                          <MapPin size={14} /> Shipping Address
                        </h6>
                        <div className="small text-dark">
                          {selectedOrder.shippingAddress?.address}
                          <br />
                          {selectedOrder.shippingAddress?.city},{" "}
                          {selectedOrder.shippingAddress?.country}
                          <br />
                          Postal Code:{" "}
                          {selectedOrder.shippingAddress?.postalCode}
                        </div>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div
                        className="p-3 bg-light rounded-1 border h-100"
                        style={{ borderColor: "#D5D9D9" }}
                      >
                        <h6 className="fw-bold small text-uppercase text-muted mb-2 d-flex align-items-center gap-2">
                          <Wallet size={14} /> Payment & Status
                        </h6>

                        <div className="d-flex justify-content-between mb-2 small">
                          <span className="text-muted">Payment Method:</span>
                          <span className="fw-bold">
                            {selectedOrder.paymentMethod}
                          </span>
                        </div>

                        {/* PAYMENT STATUS BADGE (MODAL) */}
                        <div className="d-flex justify-content-between mb-2 small">
                          <span className="text-muted">Payment Status:</span>
                          <Badge
                            bg={
                              selectedOrder.isPaid
                                ? "success"
                                : selectedOrder.paymentMethod === "COD"
                                  ? "secondary"
                                  : "warning"
                            }
                            text={
                              selectedOrder.isPaid ||
                              selectedOrder.paymentMethod === "COD"
                                ? "light"
                                : "dark"
                            }
                            className="rounded-1"
                          >
                            {selectedOrder.isPaid
                              ? "PAID"
                              : selectedOrder.paymentMethod === "COD"
                                ? "COD"
                                : "PENDING"}
                          </Badge>
                        </div>

                        <div className="d-flex justify-content-between mb-2 small">
                          <span className="text-muted">Fulfillment:</span>
                          <span className="fw-bold text-dark">
                            {selectedOrder.orderStatus ||
                              selectedOrder.status ||
                              "Processing"}
                          </span>
                        </div>

                        {/* Transaction ID if paid */}
                        {selectedOrder.isPaid &&
                          selectedOrder.paymentResult?.id && (
                            <div
                              className="d-flex flex-column mt-2 pt-2 border-top small"
                              style={{ borderColor: "#D5D9D9" }}
                            >
                              <span className="text-muted">
                                Transaction ID:
                              </span>
                              <span
                                className="font-monospace text-truncate"
                                style={{ color: "#007185" }}
                              >
                                {selectedOrder.paymentResult.id}
                              </span>
                            </div>
                          )}
                      </div>
                    </Col>
                  </Row>

                  {/* Order Items Table */}
                  <h6 className="fw-bold border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                    <Package size={18} style={{ color: "#007185" }} /> Purchased
                    Items
                  </h6>
                  <div className="table-responsive mb-4">
                    <Table size="sm" bordered className="mb-0">
                      <thead className="bg-light text-muted small text-uppercase tracking-wider">
                        <tr>
                          <th className="py-2 px-3">Item Name</th>
                          <th className="text-center py-2">Qty</th>
                          <th className="text-end py-2">Unit Price</th>
                          <th className="text-end py-2 px-3">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="small">
                        {selectedOrder.orderItems?.map((item, index) => (
                          <tr key={index}>
                            <td className="py-2 px-3 fw-medium text-dark">
                              {item.name}
                              <div
                                className="text-muted"
                                style={{ fontSize: "0.7rem" }}
                              >
                                Unit: {item.unit || "Pack"}
                              </div>
                            </td>
                            <td className="text-center py-2 align-middle">
                              {item.qty}
                            </td>
                            <td className="text-end py-2 align-middle text-muted">
                              Rs. {Number(item.price).toFixed(2)}
                            </td>
                            <td className="text-end py-2 px-3 align-middle fw-bold">
                              Rs. {(item.qty * item.price).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {/* Financial Summary */}
                  <div className="d-flex justify-content-end mb-4">
                    <div
                      style={{ width: "250px" }}
                      className="p-3 bg-light rounded-1 border"
                    >
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span>Items Subtotal:</span>
                        <span>
                          Rs. {selectedOrder.itemsPrice?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span>Shipping:</span>
                        <span>
                          {selectedOrder.shippingPrice === 0
                            ? "FREE"
                            : `Rs. ${selectedOrder.shippingPrice?.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted mb-2">
                        <span>Tax (13%):</span>
                        <span>
                          Rs. {selectedOrder.taxPrice?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      <div
                        className="d-flex justify-content-between fw-bold fs-6 text-dark border-top pt-2"
                        style={{ borderColor: "#D5D9D9" }}
                      >
                        <span>Total Paid:</span>
                        <span style={{ color: "#B12704" }}>
                          Rs. {selectedOrder.totalPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Prescription Section (If Applicable) */}
                  {selectedOrder.prescriptionImage && (
                    <>
                      <h6 className="fw-bold border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                        <ImageIcon size={18} style={{ color: "#007185" }} />{" "}
                        Prescription Attachment
                      </h6>
                      <div
                        className="p-3 border rounded-1 text-center bg-light"
                        style={{ borderColor: "#D5D9D9" }}
                      >
                        <div className="mb-2 d-flex justify-content-center gap-2">
                          <Badge
                            bg={
                              selectedOrder.prescriptionStatus === "Approved"
                                ? "success"
                                : selectedOrder.prescriptionStatus ===
                                    "Rejected"
                                  ? "danger"
                                  : "warning"
                            }
                            text={
                              selectedOrder.prescriptionStatus ===
                              "Pending Verification"
                                ? "dark"
                                : "light"
                            }
                          >
                            Status: {selectedOrder.prescriptionStatus}
                          </Badge>
                        </div>
                        <a
                          href={
                            selectedOrder.prescriptionImage.startsWith("http")
                              ? selectedOrder.prescriptionImage
                              : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${selectedOrder.prescriptionImage}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={
                              selectedOrder.prescriptionImage.startsWith("http")
                                ? selectedOrder.prescriptionImage
                                : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${selectedOrder.prescriptionImage}`
                            }
                            alt="Prescription"
                            className="img-fluid rounded border shadow-sm mt-2 cursor-pointer"
                            style={{
                              maxHeight: "300px",
                              objectFit: "contain",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform = "scale(1.02)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          />
                        </a>
                        <p className="small text-muted mt-2 mb-0">
                          Click image to view full size
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="modal-footer bg-light border-top p-3">
                  <button
                    type="button"
                    className="btn bg-white rounded-1 px-4 fw-medium border shadow-sm hover-lift"
                    style={{ borderColor: "#D5D9D9", color: "#0F1111" }}
                    onClick={() => setShowOrderModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .tracking-wider { letter-spacing: 0.05em; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .custom-search-input:focus { border-color: #e47911 !important; box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; outline: none; }
        .table-row-hover:hover { background-color: #f8f9fa; }
        .dropdown-item:hover { background-color: #f0f2f2; }
        .hover-underline:hover { text-decoration: underline !important; }
        .hover-lift { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .hover-lift:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default AdminOrders;
