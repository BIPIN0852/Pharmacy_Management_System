// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Container,
//   Badge,
//   Card,
//   Spinner,
//   Alert,
//   Modal,
//   Row,
//   Col,
// } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import {
//   Package,
//   ChevronRight,
//   ShoppingBag,
//   Clock,
//   CheckCircle,
//   AlertTriangle,
//   Trash2,
//   MapPin,
//   User,
//   CreditCard,
//   FileText,
//   XCircle,
//   Image as ImageIcon,
// } from "lucide-react";
// import axios from "axios";

// const OrderHistory = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // State for Delete Confirmation Modal
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [orderToDelete, setOrderToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   // State for Order Details Modal
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);

//   const userLogin = useSelector((state) => state.userLogin);
//   const { userInfo } = userLogin;

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const config = {
//         headers: { Authorization: `Bearer ${userInfo?.token}` },
//       };
//       const response = await axios.get(
//         "http://localhost:5000/api/orders/myorders",
//         config,
//       );
//       const orderData = Array.isArray(response.data)
//         ? response.data
//         : response.data?.orders || [];
//       setOrders(orderData);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch orders.");
//       console.error("Fetch Orders Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userInfo) {
//       fetchOrders();
//     }
//   }, [userInfo]);

//   // ✅ PROPER STATE CLEANUP: Safely closes modal and resets ID
//   const handleCloseDelete = () => {
//     if (!deleteLoading) {
//       setShowDeleteModal(false);
//       setTimeout(() => setOrderToDelete(null), 300); // Clears after animation finishes
//     }
//   };

//   // ✅ ABSOLUTE FAILSAFE CANCELLATION
//   const handleDeleteOrder = async () => {
//     if (!orderToDelete) return;

//     try {
//       setDeleteLoading(true);
//       const token = userInfo?.token || localStorage.getItem("token");

//       await axios.delete(`http://localhost:5000/api/orders/${orderToDelete}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 8000, // 8 second strict timeout to prevent infinite hanging
//       });

//       // On Success: Filter it out immediately
//       setOrders((prev) => prev.filter((order) => order._id !== orderToDelete));

//       // Close immediately on success
//       setShowDeleteModal(false);
//       setOrderToDelete(null);
//     } catch (err) {
//       console.error("Cancel Error:", err);
//       const msg =
//         err.code === "ECONNABORTED"
//           ? "Server took too long to respond. Please refresh the page."
//           : err.response?.data?.message || "Failed to delete order.";
//       alert(msg);

//       // Close immediately even on error
//       setShowDeleteModal(false);
//       setOrderToDelete(null);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const confirmDelete = (id) => {
//     setOrderToDelete(id);
//     setShowDeleteModal(true);
//   };

//   const handleViewDetails = (order) => {
//     setSelectedOrder(order);
//     setShowOrderModal(true);
//   };

//   const itemsPriceNum = Number(selectedOrder?.itemsPrice);
//   const calculatedSubtotal =
//     itemsPriceNum > 0
//       ? itemsPriceNum
//       : selectedOrder?.orderItems?.reduce(
//           (acc, item) => acc + Number(item.price) * Number(item.qty),
//           0,
//         ) || 0;

//   if (loading)
//     return (
//       <div
//         className="d-flex flex-column justify-content-center align-items-center vh-100"
//         style={{ backgroundColor: "#f0f2f2" }}
//       >
//         <Spinner
//           animation="border"
//           style={{ color: "#007185", width: "3rem", height: "3rem" }}
//           className="mb-3"
//         />
//         <span className="fw-bold text-muted text-uppercase tracking-wider small">
//           Fetching your orders...
//         </span>
//       </div>
//     );

//   return (
//     <div
//       style={{
//         backgroundColor: "#f0f2f2",
//         minHeight: "100vh",
//         paddingBottom: "50px",
//       }}
//     >
//       <Container className="py-5 animate-fade-in">
//         <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
//           <div>
//             <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
//               <ShoppingBag style={{ color: "#007185" }} /> My Order History
//             </h3>
//             <p className="text-muted small mb-0">
//               Track and manage your previous pharmacy purchases
//             </p>
//           </div>
//           <Link
//             to="/medicines"
//             className="btn fw-medium shadow-sm rounded-1 px-4 border-0"
//             style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
//           >
//             Continue Shopping
//           </Link>
//         </div>

//         {error && (
//           <Alert
//             variant="danger"
//             className="d-flex align-items-center border-0 shadow-sm rounded-1"
//             style={{
//               backgroundColor: "#fef0f0",
//               color: "#B12704",
//               borderLeft: "4px solid #B12704",
//             }}
//           >
//             <AlertTriangle size={20} className="me-2" />
//             <span className="small fw-medium">{error}</span>
//           </Alert>
//         )}

//         {!Array.isArray(orders) || orders.length === 0 ? (
//           <Card
//             className="border-0 shadow-sm rounded-1 text-center py-5 bg-white"
//             style={{ borderColor: "#D5D9D9" }}
//           >
//             <Card.Body className="py-5">
//               <div className="mb-4 opacity-25" style={{ color: "#565959" }}>
//                 <ShoppingBag size={80} />
//               </div>
//               <h4 className="fw-bold text-dark mb-3">No orders yet</h4>
//               <p className="text-muted mb-4">
//                 When you buy medicines, they will appear here.
//               </p>
//               <Button
//                 as={Link}
//                 to="/medicines"
//                 className="px-5 py-2 shadow-sm border-0 fw-medium rounded-1"
//                 style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
//               >
//                 Browse Medicine Shop
//               </Button>
//             </Card.Body>
//           </Card>
//         ) : (
//           <Card
//             className="border-0 shadow-sm rounded-1 overflow-hidden bg-white"
//             style={{ borderColor: "#D5D9D9" }}
//           >
//             <div className="table-responsive custom-scrollbar">
//               <Table hover className="align-middle mb-0 custom-saas-table">
//                 <thead className="bg-light border-bottom">
//                   <tr className="small text-uppercase text-muted fw-bold tracking-wider">
//                     <th className="py-3 ps-4">Order ID</th>
//                     <th className="py-3">Items</th>
//                     <th className="py-3">Date</th>
//                     <th className="py-3">Total Amount</th>
//                     <th className="py-3">Payment</th>
//                     <th className="py-3">Status</th>
//                     <th className="py-3 pe-4 text-end">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => {
//                     const status =
//                       order.orderStatus ||
//                       (order.isDelivered ? "Delivered" : "Processing");

//                     return (
//                       <tr
//                         key={order._id}
//                         className="table-row-hover border-bottom border-light-subtle"
//                       >
//                         <td className="ps-4">
//                           <button
//                             className="btn btn-link p-0 fw-bold font-monospace shadow-none text-decoration-none hover-underline"
//                             style={{ color: "#007185", fontSize: "0.95rem" }}
//                             onClick={() => handleViewDetails(order)}
//                           >
//                             #
//                             {order.orderNumber ||
//                               order._id
//                                 .substring(order._id.length - 6)
//                                 .toUpperCase()}
//                           </button>
//                         </td>

//                         <td>
//                           {order.orderItems && order.orderItems.length > 0 ? (
//                             <ul className="list-unstyled mb-0 small">
//                               {order.orderItems
//                                 .slice(0, 2)
//                                 .map((item, index) => (
//                                   <li
//                                     key={index}
//                                     className="text-muted text-truncate"
//                                     style={{ maxWidth: "200px" }}
//                                     title={item.name}
//                                   >
//                                     <span className="fw-semibold text-dark">
//                                       {item.qty}x
//                                     </span>{" "}
//                                     {item.name}
//                                   </li>
//                                 ))}
//                               {order.orderItems.length > 2 && (
//                                 <li className="text-primary small fw-medium mt-1">
//                                   + {order.orderItems.length - 2} more item(s)
//                                 </li>
//                               )}
//                             </ul>
//                           ) : (
//                             <span className="text-muted small">No items</span>
//                           )}
//                         </td>

//                         <td className="text-secondary small fw-medium">
//                           {new Date(order.createdAt).toLocaleDateString(
//                             "en-US",
//                             { month: "short", day: "numeric", year: "numeric" },
//                           )}
//                         </td>

//                         <td
//                           className="fw-bold text-dark"
//                           style={{ fontSize: "0.95rem" }}
//                         >
//                           Rs.{" "}
//                           {order.totalPrice?.toLocaleString("en-US", {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           }) || "0.00"}
//                         </td>

//                         <td>
//                           <div className="d-flex flex-column align-items-start">
//                             <span
//                               className="x-small text-muted fw-bold mb-1 text-uppercase"
//                               style={{ fontSize: "10px" }}
//                             >
//                               {order.paymentMethod || "COD"}
//                             </span>
//                             {order.isPaid ? (
//                               <Badge
//                                 bg="success"
//                                 className="rounded-1 fw-medium shadow-sm d-flex align-items-center gap-1"
//                               >
//                                 <CheckCircle size={12} /> PAID
//                               </Badge>
//                             ) : (
//                               <Badge
//                                 bg="warning"
//                                 text="dark"
//                                 className="rounded-1 fw-medium shadow-sm d-flex align-items-center gap-1"
//                               >
//                                 <Clock size={12} /> PENDING
//                               </Badge>
//                             )}
//                           </div>
//                         </td>

//                         <td>
//                           <span
//                             className={`badge rounded-1 px-3 py-1 fw-medium border shadow-sm ${
//                               status === "Delivered"
//                                 ? "bg-success-subtle text-success border-success-subtle"
//                                 : status === "Cancelled"
//                                   ? "bg-danger-subtle text-danger border-danger-subtle"
//                                   : status === "Shipped"
//                                     ? "bg-info-subtle text-info border-info-subtle"
//                                     : status === "On Hold (Rx Review)"
//                                       ? "bg-warning-subtle text-dark border-warning-subtle"
//                                       : "bg-light text-dark border-secondary-subtle"
//                             }`}
//                           >
//                             {status}
//                           </span>
//                         </td>

//                         <td className="pe-4 text-end">
//                           <div className="d-flex justify-content-end gap-2">
//                             <Button
//                               variant="light"
//                               size="sm"
//                               className="border shadow-sm rounded-1 d-flex align-items-center justify-content-center p-2"
//                               style={{ borderColor: "#D5D9D9" }}
//                               onClick={() =>
//                                 navigate(
//                                   `/payment-success?orderId=${order._id}`,
//                                 )
//                               }
//                               title="View Full Receipt"
//                             >
//                               <ChevronRight
//                                 size={18}
//                                 style={{ color: "#007185" }}
//                               />
//                             </Button>

//                             {(status === "Processing" ||
//                               status === "Pending Verification") &&
//                               !order.isPaid && (
//                                 <Button
//                                   variant="light"
//                                   size="sm"
//                                   className="border shadow-sm rounded-1 text-danger hover-bg-danger p-2"
//                                   style={{ borderColor: "#D5D9D9" }}
//                                   onClick={() => confirmDelete(order._id)}
//                                   title="Cancel Order"
//                                 >
//                                   <Trash2 size={16} />
//                                 </Button>
//                               )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </Table>
//             </div>
//           </Card>
//         )}

//         {/* ============================================================================== */}
//         {/* ✅ ORDER DETAILS MODAL (Fixed DOM Structure) */}
//         {/* ============================================================================== */}
//         <Modal
//           show={showOrderModal}
//           onHide={() => setShowOrderModal(false)}
//           centered
//           size="lg"
//           contentClassName="border-0 shadow-lg rounded-1 overflow-hidden"
//         >
//           {selectedOrder && (
//             <>
//               <Modal.Header
//                 className="bg-light border-bottom p-4 pb-3"
//                 closeButton
//               >
//                 <div>
//                   <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2 fs-5 mb-1">
//                     Order Summary
//                   </Modal.Title>
//                   <div className="small text-muted font-monospace">
//                     Reference: #
//                     {selectedOrder.orderNumber ||
//                       selectedOrder._id
//                         .substring(selectedOrder._id.length - 6)
//                         .toUpperCase()}
//                   </div>
//                 </div>
//               </Modal.Header>

//               <Modal.Body className="p-4 bg-white">
//                 <Row className="g-3 mb-4">
//                   {/* Delivery Info */}
//                   <Col md={6}>
//                     <div
//                       className="p-3 bg-light rounded-1 border h-100"
//                       style={{ borderColor: "#D5D9D9" }}
//                     >
//                       <h6 className="fw-bold small text-uppercase text-muted mb-2 d-flex align-items-center gap-2">
//                         <MapPin size={14} /> Delivery Details
//                       </h6>
//                       <div className="fw-bold text-dark">
//                         {selectedOrder.user?.name ||
//                           userInfo?.name ||
//                           "Customer"}
//                       </div>
//                       <div className="small text-dark mt-1">
//                         {selectedOrder.shippingAddress?.address}
//                         <br />
//                         {selectedOrder.shippingAddress?.city},{" "}
//                         {selectedOrder.shippingAddress?.country}
//                         <br />
//                         Postal Code: {selectedOrder.shippingAddress?.postalCode}
//                       </div>
//                     </div>
//                   </Col>

//                   {/* Status Info */}
//                   <Col md={6}>
//                     <div
//                       className="p-3 bg-light rounded-1 border h-100"
//                       style={{ borderColor: "#D5D9D9" }}
//                     >
//                       <h6 className="fw-bold small text-uppercase text-muted mb-2 d-flex align-items-center gap-2">
//                         <Clock size={14} /> Order Status
//                       </h6>

//                       <div className="d-flex justify-content-between mb-2 small">
//                         <span className="text-muted">Placed On:</span>
//                         <span className="fw-bold text-dark">
//                           {new Date(selectedOrder.createdAt).toLocaleDateString(
//                             "en-US",
//                             { month: "short", day: "numeric", year: "numeric" },
//                           )}
//                         </span>
//                       </div>
//                       <div className="d-flex justify-content-between mb-2 small">
//                         <span className="text-muted">Payment Method:</span>
//                         <span className="fw-bold text-dark">
//                           {selectedOrder.paymentMethod}
//                         </span>
//                       </div>
//                       <div className="d-flex justify-content-between mb-2 small">
//                         <span className="text-muted">Payment Status:</span>
//                         <Badge
//                           bg={selectedOrder.isPaid ? "success" : "warning"}
//                           text={selectedOrder.isPaid ? "light" : "dark"}
//                         >
//                           {selectedOrder.isPaid ? "PAID" : "PENDING"}
//                         </Badge>
//                       </div>
//                       <div className="d-flex justify-content-between small">
//                         <span className="text-muted">Fulfillment:</span>
//                         <span className="fw-bold text-dark">
//                           {selectedOrder.orderStatus ||
//                             selectedOrder.status ||
//                             "Processing"}
//                         </span>
//                       </div>
//                     </div>
//                   </Col>
//                 </Row>

//                 {/* Items Purchased */}
//                 <h6 className="fw-bold border-bottom pb-2 mb-3 d-flex align-items-center gap-2 text-dark">
//                   <Package size={18} style={{ color: "#007185" }} /> Items
//                   Purchased
//                 </h6>
//                 <div className="table-responsive mb-4">
//                   <Table size="sm" bordered className="mb-0">
//                     <thead className="bg-light text-muted small text-uppercase tracking-wider">
//                       <tr>
//                         <th className="py-2 px-3">Item Name</th>
//                         <th className="text-center py-2">Qty</th>
//                         <th className="text-end py-2">Unit Price</th>
//                         <th className="text-end py-2 px-3">Total</th>
//                       </tr>
//                     </thead>
//                     <tbody className="small">
//                       {selectedOrder.orderItems?.map((item, index) => (
//                         <tr key={index}>
//                           <td className="py-2 px-3 fw-medium text-dark">
//                             {item.name}
//                             <div
//                               className="text-muted"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               Unit: {item.unit || "Pack"}
//                             </div>
//                           </td>
//                           <td className="text-center py-2 align-middle">
//                             {item.qty}
//                           </td>
//                           <td className="text-end py-2 align-middle text-muted">
//                             Rs. {Number(item.price).toFixed(2)}
//                           </td>
//                           <td className="text-end py-2 px-3 align-middle fw-bold text-dark">
//                             Rs. {(item.qty * item.price).toFixed(2)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>

//                 <div className="d-flex justify-content-end mb-4">
//                   <div
//                     style={{ width: "250px" }}
//                     className="p-3 bg-light rounded-1 border"
//                   >
//                     <div className="d-flex justify-content-between small text-muted mb-1">
//                       <span>Subtotal:</span>
//                       <span className="text-dark fw-medium">
//                         Rs. {Number(calculatedSubtotal).toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="d-flex justify-content-between small text-muted mb-1">
//                       <span>Shipping:</span>
//                       <span className="text-dark fw-medium">
//                         {selectedOrder.shippingPrice === 0
//                           ? "FREE"
//                           : `Rs. ${Number(selectedOrder.shippingPrice).toFixed(2)}`}
//                       </span>
//                     </div>
//                     <div className="d-flex justify-content-between small text-muted mb-2">
//                       <span>Tax (13%):</span>
//                       <span className="text-dark fw-medium">
//                         Rs. {Number(selectedOrder.taxPrice || 0).toFixed(2)}
//                       </span>
//                     </div>
//                     <div
//                       className="d-flex justify-content-between fw-bold fs-6 text-dark border-top pt-2"
//                       style={{ borderColor: "#D5D9D9" }}
//                     >
//                       <span>Total:</span>
//                       <span style={{ color: "#B12704" }}>
//                         Rs.{" "}
//                         {selectedOrder.totalPrice?.toLocaleString("en-US", {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Prescription Image (if applicable) */}
//                 {selectedOrder.prescriptionImage && (
//                   <>
//                     <h6 className="fw-bold border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
//                       <ImageIcon size={18} style={{ color: "#007185" }} /> Your
//                       Uploaded Prescription
//                     </h6>
//                     <div
//                       className="p-3 border rounded-1 text-center bg-light"
//                       style={{ borderColor: "#D5D9D9" }}
//                     >
//                       <div className="mb-2 d-flex justify-content-center gap-2">
//                         <Badge
//                           bg={
//                             selectedOrder.prescriptionStatus === "Approved"
//                               ? "success"
//                               : selectedOrder.prescriptionStatus === "Rejected"
//                                 ? "danger"
//                                 : "warning"
//                           }
//                           text={
//                             selectedOrder.prescriptionStatus ===
//                             "Pending Verification"
//                               ? "dark"
//                               : "light"
//                           }
//                         >
//                           Rx Status: {selectedOrder.prescriptionStatus}
//                         </Badge>
//                       </div>
//                       <a
//                         href={
//                           selectedOrder.prescriptionImage.startsWith("http")
//                             ? selectedOrder.prescriptionImage
//                             : `http://localhost:5000${selectedOrder.prescriptionImage}`
//                         }
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <img
//                           src={
//                             selectedOrder.prescriptionImage.startsWith("http")
//                               ? selectedOrder.prescriptionImage
//                               : `http://localhost:5000${selectedOrder.prescriptionImage}`
//                           }
//                           alt="Prescription"
//                           className="img-fluid rounded border shadow-sm mt-2 cursor-pointer"
//                           style={{
//                             maxHeight: "200px",
//                             objectFit: "contain",
//                             transition: "transform 0.2s",
//                           }}
//                           onMouseOver={(e) =>
//                             (e.currentTarget.style.transform = "scale(1.02)")
//                           }
//                           onMouseOut={(e) =>
//                             (e.currentTarget.style.transform = "scale(1)")
//                           }
//                         />
//                       </a>
//                     </div>
//                   </>
//                 )}
//               </Modal.Body>
//               <Modal.Footer className="bg-light border-top p-3 d-flex justify-content-between">
//                 <Link
//                   to={`/payment-success?orderId=${selectedOrder._id}`}
//                   className="btn btn-outline-dark rounded-1 fw-medium small"
//                 >
//                   Open Full Receipt
//                 </Link>
//                 <Button
//                   variant="primary"
//                   className="rounded-1 fw-medium border-0"
//                   style={{ backgroundColor: "#007185" }}
//                   onClick={() => setShowOrderModal(false)}
//                 >
//                   Close Summary
//                 </Button>
//               </Modal.Footer>
//             </>
//           )}
//         </Modal>

//         {/* ✅ FIXED CANCEL CONFIRMATION MODAL (Fixed DOM Structure) */}
//         <Modal
//           show={showDeleteModal}
//           onHide={handleCloseDelete}
//           centered
//           contentClassName="border-0 shadow-lg rounded-1 overflow-hidden"
//         >
//           <Modal.Header
//             className="bg-light border-bottom p-4 pb-3"
//             closeButton={!deleteLoading}
//           >
//             <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2 fs-5">
//               <XCircle size={20} className="text-danger" /> Cancel Order
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body className="p-4 bg-white">
//             <p className="text-dark mb-0">
//               Are you sure you want to cancel and remove this order from your
//               history? This action cannot be undone.
//             </p>
//           </Modal.Body>
//           <Modal.Footer className="bg-light border-top p-3 d-flex justify-content-end gap-2">
//             <Button
//               variant="light"
//               className="rounded-1 px-4 fw-medium border shadow-sm hover-lift"
//               style={{ borderColor: "#D5D9D9", color: "#0F1111" }}
//               onClick={handleCloseDelete}
//               disabled={deleteLoading}
//             >
//               Keep Order
//             </Button>
//             <Button
//               variant="danger"
//               className="rounded-1 px-4 shadow-sm fw-medium border-0 hover-lift"
//               disabled={deleteLoading}
//               onClick={handleDeleteOrder}
//             >
//               {deleteLoading ? (
//                 <Spinner size="sm" animation="border" />
//               ) : (
//                 "Yes, Cancel Order"
//               )}
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>

//       <style>{`
//         .tracking-wider { letter-spacing: 0.05em; }
//         .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

//         .table-row-hover:hover { background-color: #f8f9fa; }
//         .hover-underline:hover { text-decoration: underline !important; }
//         .hover-lift { transition: transform 0.15s ease, box-shadow 0.15s ease; }
//         .hover-lift:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important; }
//         .hover-bg-danger:hover { background-color: #fef0f0; color: #B12704 !important; border-color: #f5c6cb !important; }
//         .x-small { font-size: 0.7rem; }
//       `}</style>
//     </div>
//   );
// };

// export default OrderHistory;

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container,
  Badge,
  Card,
  Spinner,
  Alert,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Package,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trash2,
  MapPin,
  User,
  CreditCard,
  FileText,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // State for Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // State for Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      };
      const response = await axios.get(
        "http://localhost:5000/api/orders/myorders",
        config,
      );
      const orderData = Array.isArray(response.data)
        ? response.data
        : response.data?.orders || [];
      setOrders(orderData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders.");
      console.error("Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchOrders();
    }
  }, [userInfo]);

  // ✅ PROPER STATE CLEANUP: Safely closes modal and resets ID
  const handleCloseDelete = () => {
    if (!deleteLoading) {
      setShowDeleteModal(false);
      setTimeout(() => setOrderToDelete(null), 300); // Clears after animation finishes
    }
  };

  // ✅ ABSOLUTE FAILSAFE CANCELLATION
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      setDeleteLoading(true);
      const token = userInfo?.token || localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/orders/${orderToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 8000, // 8 second strict timeout to prevent infinite hanging
      });

      // On Success: Filter it out immediately
      setOrders((prev) => prev.filter((order) => order._id !== orderToDelete));

      // Close immediately on success
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (err) {
      console.error("Cancel Error:", err);
      const msg =
        err.code === "ECONNABORTED"
          ? "Server took too long to respond. Please refresh the page."
          : err.response?.data?.message || "Failed to delete order.";
      alert(msg);

      // Close immediately even on error
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setOrderToDelete(id);
    setShowDeleteModal(true);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const itemsPriceNum = Number(selectedOrder?.itemsPrice);
  const calculatedSubtotal =
    itemsPriceNum > 0
      ? itemsPriceNum
      : selectedOrder?.orderItems?.reduce(
          (acc, item) => acc + Number(item.price) * Number(item.qty),
          0,
        ) || 0;

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
          Fetching your orders...
        </span>
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: "#f0f2f2",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <Container className="py-5 animate-fade-in">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
              <ShoppingBag style={{ color: "#007185" }} /> My Order History
            </h3>
            <p className="text-muted small mb-0">
              Track and manage your previous pharmacy purchases
            </p>
          </div>
          <Link
            to="/medicines"
            className="btn fw-medium shadow-sm rounded-1 px-4 border-0"
            style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
          >
            Continue Shopping
          </Link>
        </div>

        {error && (
          <Alert
            variant="danger"
            className="d-flex align-items-center border-0 shadow-sm rounded-1"
            style={{
              backgroundColor: "#fef0f0",
              color: "#B12704",
              borderLeft: "4px solid #B12704",
            }}
          >
            <AlertTriangle size={20} className="me-2" />
            <span className="small fw-medium">{error}</span>
          </Alert>
        )}

        {!Array.isArray(orders) || orders.length === 0 ? (
          <Card
            className="border-0 shadow-sm rounded-1 text-center py-5 bg-white"
            style={{ borderColor: "#D5D9D9" }}
          >
            <Card.Body className="py-5">
              <div className="mb-4 opacity-25" style={{ color: "#565959" }}>
                <ShoppingBag size={80} />
              </div>
              <h4 className="fw-bold text-dark mb-3">No orders yet</h4>
              <p className="text-muted mb-4">
                When you buy medicines, they will appear here.
              </p>
              <Button
                as={Link}
                to="/medicines"
                className="px-5 py-2 shadow-sm border-0 fw-medium rounded-1"
                style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
              >
                Browse Medicine Shop
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Card
            className="border-0 shadow-sm rounded-1 overflow-hidden bg-white"
            style={{ borderColor: "#D5D9D9" }}
          >
            <div className="table-responsive custom-scrollbar">
              <Table hover className="align-middle mb-0 custom-saas-table">
                <thead className="bg-light border-bottom">
                  <tr className="small text-uppercase text-muted fw-bold tracking-wider">
                    <th className="py-3 ps-4">Order ID</th>
                    <th className="py-3">Items</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Total Amount</th>
                    <th className="py-3">Payment</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 pe-4 text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const status =
                      order.orderStatus ||
                      (order.isDelivered ? "Delivered" : "Processing");

                    return (
                      <tr
                        key={order._id}
                        className="table-row-hover border-bottom border-light-subtle"
                      >
                        <td className="ps-4">
                          <button
                            className="btn btn-link p-0 fw-bold font-monospace shadow-none text-decoration-none hover-underline"
                            style={{ color: "#007185", fontSize: "0.95rem" }}
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
                          {order.orderItems && order.orderItems.length > 0 ? (
                            <ul className="list-unstyled mb-0 small">
                              {order.orderItems
                                .slice(0, 2)
                                .map((item, index) => (
                                  <li
                                    key={index}
                                    className="text-muted text-truncate"
                                    style={{ maxWidth: "200px" }}
                                    title={item.name}
                                  >
                                    <span className="fw-semibold text-dark">
                                      {item.qty}x
                                    </span>{" "}
                                    {item.name}
                                  </li>
                                ))}
                              {order.orderItems.length > 2 && (
                                <li className="text-primary small fw-medium mt-1">
                                  + {order.orderItems.length - 2} more item(s)
                                </li>
                              )}
                            </ul>
                          ) : (
                            <span className="text-muted small">No items</span>
                          )}
                        </td>

                        <td className="text-secondary small fw-medium">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </td>

                        <td
                          className="fw-bold text-dark"
                          style={{ fontSize: "0.95rem" }}
                        >
                          Rs.{" "}
                          {order.totalPrice?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || "0.00"}
                        </td>

                        {/* ✅ UPDATED PAYMENT STATUS BADGE (TABLE) */}
                        <td>
                          <div className="d-flex flex-column align-items-start">
                            <span
                              className="x-small text-muted fw-bold mb-1 text-uppercase"
                              style={{ fontSize: "10px" }}
                            >
                              {order.paymentMethod || "COD"}
                            </span>
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
                              className="rounded-1 fw-medium shadow-sm d-flex align-items-center gap-1"
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

                        <td className="pe-4 text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <Button
                              variant="light"
                              size="sm"
                              className="border shadow-sm rounded-1 d-flex align-items-center justify-content-center p-2"
                              style={{ borderColor: "#D5D9D9" }}
                              onClick={() =>
                                navigate(
                                  `/payment-success?orderId=${order._id}`,
                                )
                              }
                              title="View Full Receipt"
                            >
                              <ChevronRight
                                size={18}
                                style={{ color: "#007185" }}
                              />
                            </Button>

                            {(status === "Processing" ||
                              status === "Pending Verification") &&
                              !order.isPaid && (
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="border shadow-sm rounded-1 text-danger hover-bg-danger p-2"
                                  style={{ borderColor: "#D5D9D9" }}
                                  onClick={() => confirmDelete(order._id)}
                                  title="Cancel Order"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card>
        )}

        {/* ============================================================================== */}
        {/* ✅ ORDER DETAILS MODAL */}
        {/* ============================================================================== */}
        <Modal
          show={showOrderModal}
          onHide={() => setShowOrderModal(false)}
          centered
          size="lg"
          contentClassName="border-0 shadow-lg rounded-1 overflow-hidden"
        >
          {selectedOrder && (
            <>
              <Modal.Header
                className="bg-light border-bottom p-4 pb-3"
                closeButton
              >
                <div>
                  <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2 fs-5 mb-1">
                    Order Summary
                  </Modal.Title>
                  <div className="small text-muted font-monospace">
                    Reference: #
                    {selectedOrder.orderNumber ||
                      selectedOrder._id
                        .substring(selectedOrder._id.length - 6)
                        .toUpperCase()}
                  </div>
                </div>
              </Modal.Header>

              <Modal.Body className="p-4 bg-white">
                <Row className="g-3 mb-4">
                  {/* Delivery Info */}
                  <Col md={6}>
                    <div
                      className="p-3 bg-light rounded-1 border h-100"
                      style={{ borderColor: "#D5D9D9" }}
                    >
                      <h6 className="fw-bold small text-uppercase text-muted mb-2 d-flex align-items-center gap-2">
                        <MapPin size={14} /> Delivery Details
                      </h6>
                      <div className="fw-bold text-dark">
                        {selectedOrder.user?.name ||
                          userInfo?.name ||
                          "Customer"}
                      </div>
                      <div className="small text-dark mt-1">
                        {selectedOrder.shippingAddress?.address}
                        <br />
                        {selectedOrder.shippingAddress?.city},{" "}
                        {selectedOrder.shippingAddress?.country}
                        <br />
                        Postal Code: {selectedOrder.shippingAddress?.postalCode}
                      </div>
                    </div>
                  </Col>

                  {/* Status Info */}
                  <Col md={6}>
                    <div
                      className="p-3 bg-light rounded-1 border h-100"
                      style={{ borderColor: "#D5D9D9" }}
                    >
                      <h6 className="fw-bold small text-uppercase text-muted mb-2 d-flex align-items-center gap-2">
                        <Clock size={14} /> Order Status
                      </h6>

                      <div className="d-flex justify-content-between mb-2 small">
                        <span className="text-muted">Placed On:</span>
                        <span className="fw-bold text-dark">
                          {new Date(selectedOrder.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2 small">
                        <span className="text-muted">Payment Method:</span>
                        <span className="fw-bold text-dark">
                          {selectedOrder.paymentMethod}
                        </span>
                      </div>

                      {/* ✅ UPDATED PAYMENT STATUS BADGE (MODAL) */}
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

                      <div className="d-flex justify-content-between small">
                        <span className="text-muted">Fulfillment:</span>
                        <span className="fw-bold text-dark">
                          {selectedOrder.orderStatus ||
                            selectedOrder.status ||
                            "Processing"}
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Items Purchased */}
                <h6 className="fw-bold border-bottom pb-2 mb-3 d-flex align-items-center gap-2 text-dark">
                  <Package size={18} style={{ color: "#007185" }} /> Items
                  Purchased
                </h6>
                <div className="table-responsive mb-4">
                  <Table size="sm" bordered className="mb-0">
                    <thead className="bg-light text-muted small text-uppercase tracking-wider">
                      <tr>
                        <th className="py-2 px-3">Item Name</th>
                        <th className="text-center py-2">Qty</th>
                        <th className="text-end py-2">Unit Price</th>
                        <th className="text-end py-2 px-3">Total</th>
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
                          <td className="text-end py-2 px-3 align-middle fw-bold text-dark">
                            Rs. {(item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <div className="d-flex justify-content-end mb-4">
                  <div
                    style={{ width: "250px" }}
                    className="p-3 bg-light rounded-1 border"
                  >
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>Subtotal:</span>
                      <span className="text-dark fw-medium">
                        Rs. {Number(calculatedSubtotal).toFixed(2)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>Shipping:</span>
                      <span className="text-dark fw-medium">
                        {selectedOrder.shippingPrice === 0
                          ? "FREE"
                          : `Rs. ${Number(selectedOrder.shippingPrice).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>Tax (13%):</span>
                      <span className="text-dark fw-medium">
                        Rs. {Number(selectedOrder.taxPrice || 0).toFixed(2)}
                      </span>
                    </div>
                    <div
                      className="d-flex justify-content-between fw-bold fs-6 text-dark border-top pt-2"
                      style={{ borderColor: "#D5D9D9" }}
                    >
                      <span>Total:</span>
                      <span style={{ color: "#B12704" }}>
                        Rs.{" "}
                        {selectedOrder.totalPrice?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prescription Image (if applicable) */}
                {selectedOrder.prescriptionImage && (
                  <>
                    <h6 className="fw-bold border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                      <ImageIcon size={18} style={{ color: "#007185" }} /> Your
                      Uploaded Prescription
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
                              : selectedOrder.prescriptionStatus === "Rejected"
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
                          Rx Status: {selectedOrder.prescriptionStatus}
                        </Badge>
                      </div>
                      <a
                        href={
                          selectedOrder.prescriptionImage.startsWith("http")
                            ? selectedOrder.prescriptionImage
                            : `http://localhost:5000${selectedOrder.prescriptionImage}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={
                            selectedOrder.prescriptionImage.startsWith("http")
                              ? selectedOrder.prescriptionImage
                              : `http://localhost:5000${selectedOrder.prescriptionImage}`
                          }
                          alt="Prescription"
                          className="img-fluid rounded border shadow-sm mt-2 cursor-pointer"
                          style={{
                            maxHeight: "200px",
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
                    </div>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer className="bg-light border-top p-3 d-flex justify-content-between">
                <Link
                  to={`/payment-success?orderId=${selectedOrder._id}`}
                  className="btn btn-outline-dark rounded-1 fw-medium small"
                >
                  Open Full Receipt
                </Link>
                <Button
                  variant="primary"
                  className="rounded-1 fw-medium border-0"
                  style={{ backgroundColor: "#007185" }}
                  onClick={() => setShowOrderModal(false)}
                >
                  Close Summary
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>

        {/* ✅ CANCEL CONFIRMATION MODAL */}
        <Modal
          show={showDeleteModal}
          onHide={handleCloseDelete}
          centered
          contentClassName="border-0 shadow-lg rounded-1 overflow-hidden"
        >
          <Modal.Header
            className="bg-light border-bottom p-4 pb-3"
            closeButton={!deleteLoading}
          >
            <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2 fs-5">
              <XCircle size={20} className="text-danger" /> Cancel Order
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4 bg-white">
            <p className="text-dark mb-0">
              Are you sure you want to cancel and remove this order from your
              history? This action cannot be undone.
            </p>
          </Modal.Body>
          <Modal.Footer className="bg-light border-top p-3 d-flex justify-content-end gap-2">
            <Button
              variant="light"
              className="rounded-1 px-4 fw-medium border shadow-sm hover-lift"
              style={{ borderColor: "#D5D9D9", color: "#0F1111" }}
              onClick={handleCloseDelete}
              disabled={deleteLoading}
            >
              Keep Order
            </Button>
            <Button
              variant="danger"
              className="rounded-1 px-4 shadow-sm fw-medium border-0 hover-lift"
              disabled={deleteLoading}
              onClick={handleDeleteOrder}
            >
              {deleteLoading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Yes, Cancel Order"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      <style>{`
        .tracking-wider { letter-spacing: 0.05em; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .table-row-hover:hover { background-color: #f8f9fa; }
        .hover-underline:hover { text-decoration: underline !important; }
        .hover-lift { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .hover-lift:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important; }
        .hover-bg-danger:hover { background-color: #fef0f0; color: #B12704 !important; border-color: #f5c6cb !important; }
        .x-small { font-size: 0.7rem; }
      `}</style>
    </div>
  );
};

export default OrderHistory;
