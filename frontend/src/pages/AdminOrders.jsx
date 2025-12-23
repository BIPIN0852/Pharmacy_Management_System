// import React, { useEffect, useState } from "react";
// import api from "../services/api";

// const STATUS_OPTIONS = ["Pending", "Processing", "Completed", "Cancelled"];

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingId, setUpdatingId] = useState(null);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [search, setSearch] = useState("");

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       const res = await api.get("/admin/orders", {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });
//       setOrders(res.data || []);
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load orders from server."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const handleStatusChange = async (id, status) => {
//     try {
//       setUpdatingId(id);
//       setError("");
//       setSuccess("");
//       const token = localStorage.getItem("token");
//       await api.put(
//         `/admin/orders/${id}/status`,
//         { status },
//         {
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         }
//       );
//       setOrders((prev) =>
//         prev.map((o) => (o._id === id ? { ...o, status } : o))
//       );
//       setSuccess("Order status updated successfully.");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update order status.");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const filteredOrders = orders.filter((o) => {
//     const q = search.trim().toLowerCase();
//     if (!q) return true;
//     const id = String(o._id || o.id || "").toLowerCase();
//     const customer = (o.user?.name || o.customerName || "").toLowerCase();
//     const status = (o.status || "").toLowerCase();
//     return id.includes(q) || customer.includes(q) || status.includes(q);
//   });

//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
//         <h3 className="fw-bold mb-0">Orders Management</h3>
//         <input
//           type="search"
//           className="form-control form-control-sm"
//           style={{ maxWidth: 260 }}
//           placeholder="Search by id, customer, status..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {error && (
//         <div className="alert alert-danger py-2" role="alert">
//           {error}
//         </div>
//       )}
//       {success && (
//         <div className="alert alert-success py-2" role="alert">
//           {success}
//         </div>
//       )}

//       {loading ? (
//         <div className="d-flex align-items-center justify-content-center py-5">
//           <div className="spinner-border text-primary me-2" role="status" />
//           <span>Loading orders...</span>
//         </div>
//       ) : filteredOrders.length === 0 ? (
//         <p className="text-muted">No orders found.</p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-striped table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>Order ID</th>
//                 <th>Customer</th>
//                 <th>Total</th>
//                 <th>Status</th>
//                 <th>Placed On</th>
//                 <th style={{ width: 180 }}>Update Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((o) => (
//                 <tr key={o._id || o.id}>
//                   <td>{o._id || o.id}</td>
//                   <td>{o.user?.name || o.customerName || "-"}</td>
//                   <td>Rs. {Number(o.totalPrice || o.total || 0).toFixed(2)}</td>
//                   <td>
//                     <span
//                       className={
//                         "badge " +
//                         (o.status === "Completed"
//                           ? "bg-success"
//                           : o.status === "Pending"
//                           ? "bg-warning text-dark"
//                           : o.status === "Processing"
//                           ? "bg-info text-dark"
//                           : "bg-danger")
//                       }
//                     >
//                       {o.status}
//                     </span>
//                   </td>
//                   <td>
//                     {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
//                   </td>
//                   <td>
//                     <select
//                       className="form-select form-select-sm d-inline-block w-auto me-2"
//                       value={o.status}
//                       onChange={(e) =>
//                         handleStatusChange(o._id || o.id, e.target.value)
//                       }
//                       disabled={updatingId === (o._id || o.id)}
//                     >
//                       {STATUS_OPTIONS.map((s) => (
//                         <option key={s} value={s}>
//                           {s}
//                         </option>
//                       ))}
//                     </select>
//                     {updatingId === (o._id || o.id) && (
//                       <span className="small text-muted">Saving...</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminOrders;

import React, { useEffect, useState } from "react";
import api from "../services/api";

const STATUS_OPTIONS = ["Pending", "Processing", "Completed", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/orders", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setOrders(res.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load orders from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      await api.put(
        `/admin/orders/${id}/status`,
        { status },
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
      setSuccess("Order status updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const id = String(o._id || o.id || "").toLowerCase();
    const customer = (o.user?.name || o.customerName || "").toLowerCase();
    const status = (o.status || "").toLowerCase();
    return id.includes(q) || customer.includes(q) || status.includes(q);
  });

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3 className="fw-bold mb-0">Orders Management</h3>
        <input
          type="search"
          className="form-control form-control-sm"
          style={{ maxWidth: 260 }}
          placeholder="Search by id, customer, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success py-2" role="alert">
          {success}
        </div>
      )}

      {loading ? (
        <div className="d-flex align-items-center justify-content-center py-5">
          <div className="spinner-border text-primary me-2" role="status" />
          <span>Loading orders...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <p className="text-muted">No orders found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Placed On</th>
                <th style={{ width: 180 }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o._id || o.id}>
                  <td>{o._id || o.id}</td>
                  <td>{o.user?.name || o.customerName || "-"}</td>
                  <td>Rs. {Number(o.totalPrice || o.total || 0).toFixed(2)}</td>
                  <td>
                    <span
                      className={
                        "badge " +
                        (o.status === "Completed"
                          ? "bg-success"
                          : o.status === "Pending"
                          ? "bg-warning text-dark"
                          : o.status === "Processing"
                          ? "bg-info text-dark"
                          : "bg-danger")
                      }
                    >
                      {o.status}
                    </span>
                  </td>
                  <td>
                    {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm d-inline-block w-auto me-2"
                      value={o.status}
                      onChange={(e) =>
                        handleStatusChange(o._id || o.id, e.target.value)
                      }
                      disabled={updatingId === (o._id || o.id)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {updatingId === (o._id || o.id) && (
                      <span className="small text-muted">Saving...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
