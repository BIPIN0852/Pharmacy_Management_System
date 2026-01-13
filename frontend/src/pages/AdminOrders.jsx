import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  ShoppingBag,
  Search,
  Eye,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  MoreVertical,
  Filter,
} from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // ✅ Fetching from the admin endpoint we created in adminRoutes
      const response = await api.get("/admin/orders");

      // Extraction logic similar to Users/Customers for consistency
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
      // ✅ Hits the specific order status update route
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); // Refresh list to show updated status
    } catch (err) {
      alert(
        "Status update failed: " +
          (err.response?.data?.message || "Server Error")
      );
    }
  };

  // Filter Logic: Search (ID or Name) + Status Dropdown
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary mb-3" role="status" />
        <span className="fw-bold text-muted">Loading Global Orders...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0 animate-fade-in">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <ShoppingBag className="text-primary" /> Global Order Registry
          </h3>
          <p className="text-muted small mb-0">
            Manage customer purchases and fulfillment status
          </p>
        </div>

        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm rounded-pill px-3 border-0 shadow-sm"
            style={{ width: "150px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div className="input-group input-group-sm shadow-sm border rounded-pill overflow-hidden bg-white">
            <span className="input-group-text bg-white border-0 ps-3">
              <Search size={16} className="text-muted" />
            </span>
            <input
              type="search"
              className="form-control border-0 shadow-none"
              style={{ width: "200px" }}
              placeholder="Order ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2 shadow-sm mb-3">{error}</div>
      )}

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light border-bottom">
              <tr className="text-uppercase small text-muted fw-bold">
                <th className="py-3 ps-4">Order ID</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Status</th>
                <th className="py-3">Payment</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Date</th>
                <th className="py-3 pe-4 text-end">Manage</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <ShoppingBag
                      size={48}
                      className="text-muted opacity-25 mb-2"
                    />
                    <p className="text-muted">
                      No orders found matching your filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="ps-4">
                      <span className="fw-bold text-primary small">
                        #
                        {order._id
                          .substring(order._id.length - 8)
                          .toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">
                        {order.user?.name || "Guest"}
                      </div>
                      <div className="small text-muted">
                        {order.user?.email || "No Email"}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill px-3 py-1 ${
                          order.status === "Delivered"
                            ? "bg-success-subtle text-success border border-success-subtle"
                            : order.status === "Cancelled"
                            ? "bg-danger-subtle text-danger border border-danger-subtle"
                            : "bg-info-subtle text-info border border-info-subtle"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.isPaid ? (
                        <div className="text-success small fw-bold d-flex align-items-center gap-1">
                          <CheckCircle size={14} /> Paid
                        </div>
                      ) : (
                        <div className="text-warning small fw-bold d-flex align-items-center gap-1">
                          <Clock size={14} /> Unpaid
                        </div>
                      )}
                    </td>
                    <td className="fw-bold text-dark">
                      Rs. {order.totalPrice.toFixed(2)}
                    </td>
                    <td className="small text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="pe-4 text-end">
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-light rounded-circle p-2"
                          type="button"
                          data-bs-toggle="dropdown"
                        >
                          <MoreVertical size={16} />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                          <li>
                            <h6 className="dropdown-header">Update Status</h6>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                handleUpdateStatus(order._id, "Processing")
                              }
                            >
                              Mark Processing
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                handleUpdateStatus(order._id, "Shipped")
                              }
                            >
                              Mark Shipped
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-success"
                              onClick={() =>
                                handleUpdateStatus(order._id, "Delivered")
                              }
                            >
                              Mark Delivered
                            </button>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AdminOrders;
