// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Button,
//   Dropdown,
//   Badge,
//   Spinner,
//   Alert,
// } from "react-bootstrap";
// import {
//   Settings,
//   RefreshCw,
//   Eye,
//   CheckCircle,
//   Package,
//   Truck,
//   XCircle,
//   Clock,
//   CreditCard,
//   FileText, // ✅ Added for Prescription icon
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";

// const PharmacistOrders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [updateLoading, setUpdateLoading] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const { data } = await api.get("/orders");
//       setOrders(Array.isArray(data) ? data : data.orders || []);
//       setError("");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Failed to fetch orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Existing Status Update Function
//   const updateStatus = async (id, newStatus) => {
//     try {
//       setUpdateLoading(id);
//       await api.put(`/orders/${id}/status`, { status: newStatus });

//       const updatedOrders = orders.map((o) =>
//         o._id === id
//           ? {
//               ...o,
//               orderStatus: newStatus,
//               isDelivered: newStatus === "Delivered",
//             }
//           : o,
//       );
//       setOrders(updatedOrders);
//     } catch (err) {
//       alert(err.response?.data?.message || "Could not update status.");
//     } finally {
//       setUpdateLoading(null);
//     }
//   };

//   // ✅ Manual Payment Function
//   const markAsPaid = async (id) => {
//     if (
//       !window.confirm("Confirm: Have you received the cash for this order?")
//     ) {
//       return;
//     }

//     try {
//       setUpdateLoading(id);
//       await api.put(`/orders/${id}/pay-manual`);

//       const updatedOrders = orders.map((o) =>
//         o._id === id ? { ...o, isPaid: true } : o,
//       );
//       setOrders(updatedOrders);
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to update payment.");
//     } finally {
//       setUpdateLoading(null);
//     }
//   };

//   // ✅ NEW: Prescription Approval/Rejection Logic
//   const handlePrescriptionUpdate = async (id, status) => {
//     if (
//       !window.confirm(
//         `Are you sure you want to mark this prescription as ${status}?`,
//       )
//     )
//       return;

//     try {
//       setUpdateLoading(id);
//       await api.put(`/orders/${id}/prescription`, { status });

//       const updatedOrders = orders.map((o) => {
//         if (o._id === id) {
//           return {
//             ...o,
//             prescriptionStatus: status,
//             // If approved, it automatically moves to processing. If rejected, it cancels.
//             orderStatus:
//               status === "Approved"
//                 ? "Processing"
//                 : status === "Rejected"
//                   ? "Cancelled"
//                   : o.orderStatus,
//           };
//         }
//         return o;
//       });
//       setOrders(updatedOrders);
//     } catch (err) {
//       alert(
//         err.response?.data?.message || "Failed to update prescription status.",
//       );
//     } finally {
//       setUpdateLoading(null);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const s = status ? status.toLowerCase() : "";
//     switch (s) {
//       case "delivered":
//         return (
//           <Badge
//             bg="success-subtle"
//             className="text-success border border-success-subtle px-3 py-2 rounded-pill"
//           >
//             <CheckCircle size={12} className="me-1" /> Delivered
//           </Badge>
//         );
//       case "ready":
//         return (
//           <Badge
//             bg="info-subtle"
//             className="text-info border border-info-subtle px-3 py-2 rounded-pill"
//           >
//             <Package size={12} className="me-1" /> Ready
//           </Badge>
//         );
//       case "shipped":
//         return (
//           <Badge
//             bg="primary-subtle"
//             className="text-primary border border-primary-subtle px-3 py-2 rounded-pill"
//           >
//             <Truck size={12} className="me-1" /> Shipped
//           </Badge>
//         );
//       case "cancelled":
//         return (
//           <Badge
//             bg="danger-subtle"
//             className="text-danger border border-danger-subtle px-3 py-2 rounded-pill"
//           >
//             <XCircle size={12} className="me-1" /> Cancelled
//           </Badge>
//         );
//       case "on hold (rx review)": // ✅ Added check for new Rx status
//         return (
//           <Badge
//             bg="warning-subtle"
//             className="text-warning border border-warning-subtle px-3 py-2 rounded-pill"
//           >
//             <FileText size={12} className="me-1" /> Rx Hold
//           </Badge>
//         );
//       default:
//         return (
//           <Badge
//             bg="warning-subtle"
//             className="text-warning border border-warning-subtle px-3 py-2 rounded-pill"
//           >
//             <Clock size={12} className="me-1" /> Processing
//           </Badge>
//         );
//     }
//   };

//   if (loading)
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" variant="success" />
//         <p className="mt-2 text-muted">Loading orders...</p>
//       </div>
//     );

//   return (
//     <div className="animate-fade-in px-3">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h3 className="fw-bold text-dark mb-1">Order Management</h3>
//           <p className="text-muted small">
//             Process medicine orders and update fulfillment status
//           </p>
//         </div>
//         <Button
//           variant="white"
//           className="border shadow-sm rounded-pill px-4"
//           onClick={fetchOrders}
//         >
//           <RefreshCw size={18} className="me-2 text-success" /> Refresh List
//         </Button>
//       </div>

//       {error && (
//         <Alert variant="danger" className="rounded-3 shadow-sm">
//           {error}
//         </Alert>
//       )}

//       <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
//         <div className="table-responsive">
//           <Table hover className="align-middle mb-0">
//             <thead className="bg-light border-bottom">
//               <tr className="small text-uppercase text-muted fw-bold">
//                 <th className="py-3 ps-4">Order Details</th>
//                 <th className="py-3">Customer</th>
//                 <th className="py-3">Date</th>
//                 <th className="py-3">Amount</th>
//                 <th className="py-3">Payment</th>
//                 <th className="py-3">Prescription</th> {/* ✅ NEW COLUMN */}
//                 <th className="py-3">Fulfillment</th>
//                 <th className="py-3 text-end pe-4">Manage</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.length === 0 ? (
//                 <tr>
//                   {/* Updated colSpan from 7 to 8 to match new column */}
//                   <td colSpan="8" className="text-center py-5 text-muted">
//                     <Package size={48} className="opacity-25 mb-3" />
//                     <p>No orders available.</p>
//                   </td>
//                 </tr>
//               ) : (
//                 orders.map((order) => (
//                   <tr key={order._id}>
//                     <td className="ps-4">
//                       <div className="fw-bold text-dark">
//                         {order.orderNumber ||
//                           `#${order._id.substring(order._id.length - 8).toUpperCase()}`}
//                       </div>
//                       <div className="text-muted small">
//                         {order.orderItems?.length || 0} items
//                       </div>
//                     </td>
//                     <td>
//                       <div className="fw-semibold text-dark">
//                         {order.user?.name || "Guest"}
//                       </div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         {order.user?.email}
//                       </div>
//                     </td>
//                     <td className="small text-secondary">
//                       {new Date(order.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="fw-bold text-dark">
//                       Rs. {order.totalPrice?.toLocaleString()}
//                     </td>
//                     <td>
//                       <Badge
//                         bg={order.isPaid ? "success" : "warning"}
//                         className="fw-normal"
//                       >
//                         {order.isPaid ? "PAID" : "PENDING"}
//                       </Badge>
//                     </td>

//                     {/* ✅ NEW: Prescription Display Column */}
//                     <td>
//                       {!order.prescriptionStatus ||
//                       order.prescriptionStatus === "Not Required" ? (
//                         <span className="text-muted small">Not Required</span>
//                       ) : (
//                         <div className="d-flex flex-column align-items-start gap-1">
//                           <Badge
//                             bg={
//                               order.prescriptionStatus === "Approved"
//                                 ? "success"
//                                 : order.prescriptionStatus === "Rejected"
//                                   ? "danger"
//                                   : "warning"
//                             }
//                             className={
//                               order.prescriptionStatus ===
//                               "Pending Verification"
//                                 ? "text-dark"
//                                 : "text-white"
//                             }
//                           >
//                             {order.prescriptionStatus}
//                           </Badge>
//                           {order.prescriptionImage && (
//                             <a
//                               href={order.prescriptionImage}
//                               target="_blank"
//                               rel="noreferrer"
//                               className="small text-primary text-decoration-none"
//                             >
//                               <Eye size={12} className="me-1" /> View Image
//                             </a>
//                           )}
//                         </div>
//                       )}
//                     </td>

//                     <td>{getStatusBadge(order.orderStatus)}</td>
//                     <td className="text-end pe-4">
//                       {updateLoading === order._id ? (
//                         <Spinner
//                           size="sm"
//                           animation="border"
//                           variant="success"
//                         />
//                       ) : (
//                         <div className="d-flex justify-content-end gap-2">
//                           <Button
//                             variant="light"
//                             size="sm"
//                             className="border rounded-circle p-2"
//                             onClick={() => navigate(`/order/${order._id}`)}
//                             title="View Items"
//                           >
//                             <Eye size={16} className="text-primary" />
//                           </Button>
//                           <Dropdown>
//                             <Dropdown.Toggle
//                               variant="white"
//                               size="sm"
//                               className="border shadow-sm rounded-3"
//                             >
//                               <Settings size={16} className="text-secondary" />
//                             </Dropdown.Toggle>
//                             <Dropdown.Menu
//                               align="end"
//                               className="shadow border-0 rounded-3"
//                             >
//                               {/* ✅ NEW: Prescription Actions Menu Items */}
//                               {order.prescriptionStatus ===
//                                 "Pending Verification" && (
//                                 <>
//                                   <Dropdown.Header className="small text-uppercase fw-bold text-info">
//                                     Rx Verification
//                                   </Dropdown.Header>
//                                   <Dropdown.Item
//                                     className="text-success fw-bold"
//                                     onClick={() =>
//                                       handlePrescriptionUpdate(
//                                         order._id,
//                                         "Approved",
//                                       )
//                                     }
//                                   >
//                                     <CheckCircle size={14} className="me-2" />{" "}
//                                     Approve Rx
//                                   </Dropdown.Item>
//                                   <Dropdown.Item
//                                     className="text-danger fw-bold"
//                                     onClick={() =>
//                                       handlePrescriptionUpdate(
//                                         order._id,
//                                         "Rejected",
//                                       )
//                                     }
//                                   >
//                                     <XCircle size={14} className="me-2" />{" "}
//                                     Reject Rx
//                                   </Dropdown.Item>
//                                   <Dropdown.Divider />
//                                 </>
//                               )}

//                               <Dropdown.Header className="small text-uppercase fw-bold text-success">
//                                 Payment
//                               </Dropdown.Header>
//                               <Dropdown.Item
//                                 onClick={() => markAsPaid(order._id)}
//                                 disabled={order.isPaid}
//                                 className={
//                                   order.isPaid
//                                     ? "text-muted"
//                                     : "text-success fw-bold"
//                                 }
//                               >
//                                 <CreditCard size={14} className="me-2" />
//                                 {order.isPaid ? "Already Paid" : "Mark as Paid"}
//                               </Dropdown.Item>

//                               <Dropdown.Divider />

//                               <Dropdown.Header className="small text-uppercase fw-bold">
//                                 Status
//                               </Dropdown.Header>
//                               <Dropdown.Item
//                                 onClick={() =>
//                                   updateStatus(order._id, "Processing")
//                                 }
//                               >
//                                 Set Processing
//                               </Dropdown.Item>
//                               <Dropdown.Item
//                                 onClick={() =>
//                                   updateStatus(order._id, "Shipped")
//                                 }
//                               >
//                                 Mark Shipped
//                               </Dropdown.Item>
//                               <Dropdown.Item
//                                 onClick={() =>
//                                   updateStatus(order._id, "Delivered")
//                                 }
//                               >
//                                 Mark Delivered
//                               </Dropdown.Item>
//                               <Dropdown.Divider />
//                               <Dropdown.Item
//                                 className="text-danger"
//                                 onClick={() =>
//                                   updateStatus(order._id, "Cancelled")
//                                 }
//                               >
//                                 Cancel Order
//                               </Dropdown.Item>
//                             </Dropdown.Menu>
//                           </Dropdown>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </Table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PharmacistOrders;

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Dropdown,
  Badge,
  Spinner,
  Alert,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import {
  Settings,
  RefreshCw,
  Eye,
  CheckCircle,
  Package,
  Truck,
  XCircle,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const PharmacistOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(null);

  // ✅ NEW: Modal States for viewing order details securely
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/orders");
      setOrders(Array.isArray(data) ? data : data.orders || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Existing Status Update Function
  const updateStatus = async (id, newStatus) => {
    try {
      setUpdateLoading(id);
      await api.put(`/orders/${id}/status`, { status: newStatus });

      const updatedOrders = orders.map((o) =>
        o._id === id
          ? {
              ...o,
              orderStatus: newStatus,
              isDelivered: newStatus === "Delivered",
            }
          : o,
      );
      setOrders(updatedOrders);
    } catch (err) {
      alert(err.response?.data?.message || "Could not update status.");
    } finally {
      setUpdateLoading(null);
    }
  };

  // ✅ Manual Payment Function
  const markAsPaid = async (id) => {
    if (
      !window.confirm("Confirm: Have you received the cash for this order?")
    ) {
      return;
    }

    try {
      setUpdateLoading(id);
      await api.put(`/orders/${id}/pay-manual`);

      const updatedOrders = orders.map((o) =>
        o._id === id ? { ...o, isPaid: true } : o,
      );
      setOrders(updatedOrders);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update payment.");
    } finally {
      setUpdateLoading(null);
    }
  };

  // ✅ Prescription Approval/Rejection Logic
  const handlePrescriptionUpdate = async (id, status) => {
    if (
      !window.confirm(
        `Are you sure you want to mark this prescription as ${status}?`,
      )
    )
      return;

    try {
      setUpdateLoading(id);
      await api.put(`/orders/${id}/prescription`, { status });

      const updatedOrders = orders.map((o) => {
        if (o._id === id) {
          return {
            ...o,
            prescriptionStatus: status,
            // If approved, it automatically moves to processing. If rejected, it cancels.
            orderStatus:
              status === "Approved"
                ? "Processing"
                : status === "Rejected"
                  ? "Cancelled"
                  : o.orderStatus,
          };
        }
        return o;
      });
      setOrders(updatedOrders);
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to update prescription status.",
      );
    } finally {
      setUpdateLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "";
    switch (s) {
      case "delivered":
        return (
          <Badge
            bg="success-subtle"
            className="text-success border border-success-subtle px-3 py-2 rounded-pill"
          >
            <CheckCircle size={12} className="me-1" /> Delivered
          </Badge>
        );
      case "ready":
        return (
          <Badge
            bg="info-subtle"
            className="text-info border border-info-subtle px-3 py-2 rounded-pill"
          >
            <Package size={12} className="me-1" /> Ready
          </Badge>
        );
      case "shipped":
        return (
          <Badge
            bg="primary-subtle"
            className="text-primary border border-primary-subtle px-3 py-2 rounded-pill"
          >
            <Truck size={12} className="me-1" /> Shipped
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            bg="danger-subtle"
            className="text-danger border border-danger-subtle px-3 py-2 rounded-pill"
          >
            <XCircle size={12} className="me-1" /> Cancelled
          </Badge>
        );
      case "on hold (rx review)":
        return (
          <Badge
            bg="warning-subtle"
            className="text-warning border border-warning-subtle px-3 py-2 rounded-pill"
          >
            <FileText size={12} className="me-1" /> Rx Hold
          </Badge>
        );
      default:
        return (
          <Badge
            bg="warning-subtle"
            className="text-warning border border-warning-subtle px-3 py-2 rounded-pill"
          >
            <Clock size={12} className="me-1" /> Processing
          </Badge>
        );
    }
  };

  // ✅ NEW: Open Order Details Modal
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-muted">Loading orders...</p>
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
                <th className="py-3">Prescription</th>
                <th className="py-3">Fulfillment</th>
                <th className="py-3 text-end pe-4">Manage</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <Package size={48} className="opacity-25 mb-3" />
                    <p>No orders available.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">
                        {order.orderNumber ||
                          `#${order._id.substring(order._id.length - 8).toUpperCase()}`}
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
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="fw-bold text-dark">
                      Rs. {order.totalPrice?.toLocaleString()}
                    </td>
                    <td>
                      <Badge
                        bg={order.isPaid ? "success" : "warning"}
                        className="fw-normal"
                      >
                        {order.isPaid ? "PAID" : "PENDING"}
                      </Badge>
                    </td>

                    <td>
                      {!order.prescriptionStatus ||
                      order.prescriptionStatus === "Not Required" ? (
                        <span className="text-muted small">Not Required</span>
                      ) : (
                        <div className="d-flex flex-column align-items-start gap-1">
                          <Badge
                            bg={
                              order.prescriptionStatus === "Approved"
                                ? "success"
                                : order.prescriptionStatus === "Rejected"
                                  ? "danger"
                                  : "warning"
                            }
                            className={
                              order.prescriptionStatus ===
                              "Pending Verification"
                                ? "text-dark"
                                : "text-white"
                            }
                          >
                            {order.prescriptionStatus}
                          </Badge>
                          {order.prescriptionImage && (
                            <a
                              href={order.prescriptionImage}
                              target="_blank"
                              rel="noreferrer"
                              className="small text-primary text-decoration-none"
                            >
                              <Eye size={12} className="me-1" /> View Image
                            </a>
                          )}
                        </div>
                      )}
                    </td>

                    <td>{getStatusBadge(order.orderStatus)}</td>
                    <td className="text-end pe-4">
                      {updateLoading === order._id ? (
                        <Spinner
                          size="sm"
                          animation="border"
                          variant="success"
                        />
                      ) : (
                        <div className="d-flex justify-content-end gap-2">
                          {/* ✅ REPLACED: Now opens the local secure Modal instead of navigating */}
                          <Button
                            variant="light"
                            size="sm"
                            className="border rounded-circle p-2"
                            onClick={() => handleViewOrder(order)}
                            title="View Order Details"
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
                              {order.prescriptionStatus ===
                                "Pending Verification" && (
                                <>
                                  <Dropdown.Header className="small text-uppercase fw-bold text-info">
                                    Rx Verification
                                  </Dropdown.Header>
                                  <Dropdown.Item
                                    className="text-success fw-bold"
                                    onClick={() =>
                                      handlePrescriptionUpdate(
                                        order._id,
                                        "Approved",
                                      )
                                    }
                                  >
                                    <CheckCircle size={14} className="me-2" />{" "}
                                    Approve Rx
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    className="text-danger fw-bold"
                                    onClick={() =>
                                      handlePrescriptionUpdate(
                                        order._id,
                                        "Rejected",
                                      )
                                    }
                                  >
                                    <XCircle size={14} className="me-2" />{" "}
                                    Reject Rx
                                  </Dropdown.Item>
                                  <Dropdown.Divider />
                                </>
                              )}

                              <Dropdown.Header className="small text-uppercase fw-bold text-success">
                                Payment
                              </Dropdown.Header>
                              <Dropdown.Item
                                onClick={() => markAsPaid(order._id)}
                                disabled={order.isPaid}
                                className={
                                  order.isPaid
                                    ? "text-muted"
                                    : "text-success fw-bold"
                                }
                              >
                                <CreditCard size={14} className="me-2" />
                                {order.isPaid ? "Already Paid" : "Mark as Paid"}
                              </Dropdown.Item>

                              <Dropdown.Divider />

                              <Dropdown.Header className="small text-uppercase fw-bold">
                                Status
                              </Dropdown.Header>
                              <Dropdown.Item
                                onClick={() =>
                                  updateStatus(order._id, "Processing")
                                }
                              >
                                Set Processing
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  updateStatus(order._id, "Shipped")
                                }
                              >
                                Mark Shipped
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

      {/* ====================================================================== */}
      {/* ✅ SECURE ORDER DETAILS MODAL FOR PHARMACIST */}
      {/* ====================================================================== */}
      <Modal
        show={showOrderModal}
        onHide={() => setShowOrderModal(false)}
        size="lg"
        centered
        contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
      >
        {selectedOrder && (
          <>
            <Modal.Header className="bg-light border-bottom p-4" closeButton>
              <Modal.Title className="fw-bold text-dark fs-5">
                Order Details{" "}
                <span className="text-muted ms-2 fw-medium fs-6">
                  {selectedOrder.orderNumber ||
                    `#${selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}`}
                </span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4 bg-white">
              <Row className="g-4 mb-4">
                {/* Customer Details */}
                <Col md={6}>
                  <div className="bg-light p-3 rounded-3 h-100 border border-light-subtle">
                    <h6 className="fw-bold text-muted small text-uppercase mb-3 d-flex align-items-center gap-2">
                      <User size={16} className="text-primary" /> Customer Info
                    </h6>
                    <div className="fw-bold text-dark">
                      {selectedOrder.user?.name || "Guest User"}
                    </div>
                    <div className="small text-muted mb-1">
                      {selectedOrder.user?.email || "No email provided"}
                    </div>
                    <div className="small text-muted">
                      Payment:{" "}
                      <Badge
                        bg={selectedOrder.isPaid ? "success" : "warning"}
                        className="ms-1"
                      >
                        {selectedOrder.isPaid ? "PAID" : "PENDING"}
                      </Badge>
                    </div>
                  </div>
                </Col>

                {/* Shipping Details */}
                <Col md={6}>
                  <div className="bg-light p-3 rounded-3 h-100 border border-light-subtle">
                    <h6 className="fw-bold text-muted small text-uppercase mb-3 d-flex align-items-center gap-2">
                      <MapPin size={16} className="text-danger" /> Shipping
                      Address
                    </h6>
                    <div className="small text-dark lh-sm">
                      {selectedOrder.shippingAddress?.address ? (
                        <>
                          <div>{selectedOrder.shippingAddress.address}</div>
                          <div>
                            {selectedOrder.shippingAddress.city},{" "}
                            {selectedOrder.shippingAddress.postalCode}
                          </div>
                          <div>{selectedOrder.shippingAddress.country}</div>
                        </>
                      ) : (
                        <span className="text-muted italic">
                          No shipping address provided.
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Order Items Table */}
              <h6 className="fw-bold text-dark mb-3">Purchased Items</h6>
              <div className="table-responsive rounded-3 border border-light-subtle mb-4">
                <Table className="mb-0 align-middle">
                  <thead className="bg-light text-muted small">
                    <tr>
                      <th className="px-3 py-2">Item Name</th>
                      <th className="px-3 py-2 text-center">Qty</th>
                      <th className="px-3 py-2 text-end">Price</th>
                      <th className="px-3 py-2 text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 fw-medium">{item.name}</td>
                        <td className="px-3 py-2 text-center">{item.qty}</td>
                        <td className="px-3 py-2 text-end">Rs. {item.price}</td>
                        <td className="px-3 py-2 text-end fw-bold">
                          Rs. {item.qty * item.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Summary Totals */}
              <div className="d-flex justify-content-end">
                <div style={{ width: "250px" }}>
                  <div className="d-flex justify-content-between small mb-2 text-muted">
                    <span>Subtotal:</span>
                    <span>Rs. {selectedOrder.itemsPrice || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-2 text-muted">
                    <span>Shipping:</span>
                    <span>Rs. {selectedOrder.shippingPrice || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-2 text-muted border-bottom pb-2">
                    <span>Tax:</span>
                    <span>Rs. {selectedOrder.taxPrice || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-black text-dark mt-2 fs-5">
                    <span>Total:</span>
                    <span>Rs. {selectedOrder.totalPrice || 0}</span>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="bg-light border-top p-3">
              <Button
                variant="secondary"
                className="rounded-pill px-4 fw-bold"
                onClick={() => setShowOrderModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default PharmacistOrders;
