// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Container,
//   Badge,
//   Card,
//   Spinner,
// } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import { Package, ChevronRight } from "lucide-react";

// const API_BASE_URL = "http://localhost:5000/api";

// const OrderHistory = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           return;
//         }
//         const res = await fetch(`${API_BASE_URL}/customer/orders`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setOrders(data.orders || []);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [navigate]);

//   if (loading)
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );

//   return (
//     <Container className="py-5">
//       <h2 className="mb-4 fw-bold">My Order History</h2>

//       {orders.length === 0 ? (
//         <div className="text-center py-5 bg-light rounded-4">
//           <Package size={64} className="text-muted opacity-25 mb-3" />
//           <h4>No orders found</h4>
//           <p className="text-muted">You haven't placed any orders yet.</p>
//           <Link to="/medicines" className="btn btn-primary rounded-pill px-4">
//             Start Shopping
//           </Link>
//         </div>
//       ) : (
//         <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
//           <div className="table-responsive">
//             <Table hover className="align-middle mb-0">
//               <thead className="bg-light">
//                 <tr>
//                   <th className="py-3 ps-4">Order ID</th>
//                   <th className="py-3">Date</th>
//                   <th className="py-3">Total</th>
//                   <th className="py-3">Payment</th>
//                   <th className="py-3">Status</th>
//                   <th className="py-3 pe-4 text-end">Details</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((order) => (
//                   <tr key={order._id}>
//                     <td className="ps-4 fw-bold text-primary">
//                       #{order._id.substring(0, 10)}...
//                     </td>
//                     <td>{new Date(order.createdAt).toLocaleDateString()}</td>
//                     <td className="fw-bold">Rs. {order.totalPrice}</td>
//                     <td>
//                       {order.isPaid ? (
//                         <Badge bg="success" className="rounded-pill">
//                           Paid
//                         </Badge>
//                       ) : (
//                         <Badge
//                           bg="warning"
//                           text="dark"
//                           className="rounded-pill"
//                         >
//                           Pending
//                         </Badge>
//                       )}
//                     </td>
//                     <td>
//                       <Badge
//                         bg={order.isDelivered ? "info" : "secondary"}
//                         className="rounded-pill"
//                       >
//                         {order.isDelivered ? "Delivered" : "Processing"}
//                       </Badge>
//                     </td>
//                     <td className="pe-4 text-end">
//                       {/* Note: Ensure you have an OrderDetails page or remove this link if not needed yet */}
//                       {/* For now, we point to a generic order view or placeholder */}
//                       <Button
//                         variant="light"
//                         size="sm"
//                         className="rounded-circle"
//                         disabled
//                       >
//                         <ChevronRight size={18} />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </Card>
//       )}
//     </Container>
//   );
// };

// export default OrderHistory;

// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Container,
//   Badge,
//   Card,
//   Spinner,
//   Alert,
// } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Package,
//   ChevronRight,
//   ShoppingBag,
//   Clock,
//   CheckCircle,
// } from "lucide-react";
// import api from "../services/api"; // ✅ Using consolidated api service

// const OrderHistory = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         // ✅ UPDATED: Points to consolidated backend route /api/orders/my
//         const data = await api.get("/orders/my");
//         setOrders(data || []);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch orders.");
//         console.error("Fetch Orders Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading)
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );

//   return (
//     <Container className="py-5 animate-fade-in">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h2 className="fw-bold text-dark mb-1">My Order History</h2>
//           <p className="text-muted small">
//             Track and manage your previous pharmacy purchases
//           </p>
//         </div>
//         <Link
//           to="/medicines"
//           className="btn btn-outline-primary rounded-pill px-4 btn-sm"
//         >
//           <ShoppingBag size={16} className="me-2" /> New Order
//         </Link>
//       </div>

//       {error && <Alert variant="danger">{error}</Alert>}

//       {orders.length === 0 ? (
//         <Card className="border-0 shadow-sm rounded-4 text-center py-5">
//           <Card.Body>
//             <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
//               <Package size={64} className="text-muted opacity-50" />
//             </div>
//             <h4 className="fw-bold">No orders yet</h4>
//             <p className="text-muted mb-4">
//               When you buy medicines, they will appear here.
//             </p>
//             <Button
//               as={Link}
//               to="/medicines"
//               variant="primary"
//               className="rounded-pill px-5"
//             >
//               Browse Medicine Shop
//             </Button>
//           </Card.Body>
//         </Card>
//       ) : (
//         <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
//           <div className="table-responsive">
//             <Table hover className="align-middle mb-0">
//               <thead className="bg-light border-bottom">
//                 <tr className="small text-uppercase text-muted fw-bold">
//                   <th className="py-3 ps-4">Order ID</th>
//                   <th className="py-3">Date</th>
//                   <th className="py-3">Total Amount</th>
//                   <th className="py-3">Payment</th>
//                   <th className="py-3">Status</th>
//                   <th className="py-3 pe-4 text-end">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((order) => (
//                   <tr key={order._id}>
//                     <td className="ps-4">
//                       <span className="fw-bold text-primary small">
//                         #
//                         {order._id
//                           .substring(order._id.length - 8)
//                           .toUpperCase()}
//                       </span>
//                     </td>
//                     <td className="text-secondary small">
//                       {new Date(order.createdAt).toLocaleDateString(undefined, {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </td>
//                     <td className="fw-bold text-dark">
//                       Rs. {order.totalPrice.toLocaleString()}
//                     </td>
//                     <td>
//                       {order.isPaid ? (
//                         <Badge
//                           bg="success-subtle"
//                           className="text-success border border-success-subtle rounded-pill px-3"
//                         >
//                           <CheckCircle size={12} className="me-1" /> Paid
//                         </Badge>
//                       ) : (
//                         <Badge
//                           bg="warning-subtle"
//                           className="text-warning border border-warning-subtle rounded-pill px-3"
//                         >
//                           <Clock size={12} className="me-1" /> Pending
//                         </Badge>
//                       )}
//                     </td>
//                     <td>
//                       <Badge
//                         bg={
//                           order.isDelivered ? "info-subtle" : "secondary-subtle"
//                         }
//                         className={`rounded-pill px-3 border ${
//                           order.isDelivered
//                             ? "text-info border-info-subtle"
//                             : "text-secondary border-secondary-subtle"
//                         }`}
//                       >
//                         {order.isDelivered ? "Delivered" : "Processing"}
//                       </Badge>
//                     </td>
//                     <td className="pe-4 text-end">
//                       <Button
//                         variant="white"
//                         size="sm"
//                         className="border shadow-sm rounded-circle p-2"
//                         onClick={() =>
//                           navigate(`/payment-success?order_id=${order._id}`)
//                         }
//                       >
//                         <ChevronRight size={18} className="text-primary" />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </Card>
//       )}
//     </Container>
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
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import api from "../services/api"; // ✅ Using consolidated api service

const OrderHistory = () => {
  const [orders, setOrders] = useState([]); // ✅ Initialized as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // ✅ Fetches from consolidated backend route
        const response = await api.get("/orders/my");

        /**
         * ✅ FIX: Defensive check to prevent .map() crash
         * Ensures we always set an array even if backend returns null or an object
         */
        const orderData = Array.isArray(response)
          ? response
          : response.data || [];
        setOrders(orderData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders.");
        console.error("Fetch Orders Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <Container className="py-5 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">My Order History</h2>
          <p className="text-muted small">
            Track and manage your previous pharmacy purchases
          </p>
        </div>
        <Link
          to="/medicines"
          className="btn btn-outline-primary rounded-pill px-4 btn-sm"
        >
          <ShoppingBag size={16} className="me-2" /> New Order
        </Link>
      </div>

      {error && (
        <Alert variant="danger" className="d-flex align-items-center">
          <AlertTriangle size={20} className="me-2" />
          {error}
        </Alert>
      )}

      {/* ✅ FIX: Verified array length check */}
      {!Array.isArray(orders) || orders.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4 text-center py-5">
          <Card.Body>
            <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
              <Package size={64} className="text-muted opacity-50" />
            </div>
            <h4 className="fw-bold">No orders yet</h4>
            <p className="text-muted mb-4">
              When you buy medicines, they will appear here.
            </p>
            <Button
              as={Link}
              to="/medicines"
              variant="primary"
              className="rounded-pill px-5"
            >
              Browse Medicine Shop
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light border-bottom">
                <tr className="small text-uppercase text-muted fw-bold">
                  <th className="py-3 ps-4">Order ID</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Total Amount</th>
                  <th className="py-3">Payment</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 pe-4 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="ps-4">
                      <span className="fw-bold text-primary small">
                        #
                        {order._id
                          .substring(order._id.length - 8)
                          .toUpperCase()}
                      </span>
                    </td>
                    <td className="text-secondary small">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="fw-bold text-dark">
                      Rs. {order.totalPrice?.toLocaleString() || 0}
                    </td>
                    <td>
                      {order.isPaid ? (
                        <Badge
                          bg="success-subtle"
                          className="text-success border border-success-subtle rounded-pill px-3"
                        >
                          <CheckCircle size={12} className="me-1" /> Paid
                        </Badge>
                      ) : (
                        <Badge
                          bg="warning-subtle"
                          className="text-warning border border-warning-subtle rounded-pill px-3"
                        >
                          <Clock size={12} className="me-1" /> Pending
                        </Badge>
                      )}
                    </td>
                    <td>
                      <Badge
                        bg={
                          order.isDelivered ? "info-subtle" : "secondary-subtle"
                        }
                        className={`rounded-pill px-3 border ${
                          order.isDelivered
                            ? "text-info border-info-subtle"
                            : "text-secondary border-secondary-subtle"
                        }`}
                      >
                        {order.isDelivered ? "Delivered" : "Processing"}
                      </Badge>
                    </td>
                    <td className="pe-4 text-end">
                      <Button
                        variant="white"
                        size="sm"
                        className="border shadow-sm rounded-circle p-2"
                        onClick={() =>
                          navigate(`/payment-success?order_id=${order._id}`)
                        }
                      >
                        <ChevronRight size={18} className="text-primary" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </Container>
  );
};

export default OrderHistory;
