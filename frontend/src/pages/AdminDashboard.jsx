// import React, { useEffect, useMemo, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Users,
//   Package,
//   ShoppingCart,
//   DollarSign,
//   Stethoscope,
//   TrendingUp,
//   Activity,
//   Bell,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import api from "../services/api";

// // SORT HOOK
// function useSortableData(items, config = null) {
//   const [sortConfig, setSortConfig] = useState(config);

//   const sortedItems = useMemo(() => {
//     const sortable = [...items];
//     if (sortConfig !== null) {
//       const { key, direction } = sortConfig;
//       sortable.sort((a, b) => {
//         let aVal = a[key];
//         let bVal = b[key];
//         if (typeof aVal === "number" && typeof bVal === "number") {
//           return direction === "ascending" ? aVal - bVal : bVal - aVal;
//         }
//         if (typeof aVal === "string") aVal = aVal.toLowerCase();
//         if (typeof bVal === "string") bVal = bVal.toLowerCase();
//         if (aVal < bVal) return direction === "ascending" ? -1 : 1;
//         if (aVal > bVal) return direction === "ascending" ? 1 : -1;
//         return 0;
//       });
//     }
//     return sortable;
//   }, [items, sortConfig]);

//   const requestSort = (key) => {
//     let direction = "ascending";
//     if (
//       sortConfig &&
//       sortConfig.key === key &&
//       sortConfig.direction === "ascending"
//     ) {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   return { items: sortedItems, requestSort, sortConfig };
// }

// // PAGINATION COMPONENT
// const TablePagination = ({
//   total,
//   page,
//   pageSize,
//   onPageChange,
//   onPageSizeChange,
// }) => {
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//   return (
//     <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
//       <div className="d-flex align-items-center gap-2 flex-wrap">
//         <span className="small">Page</span>
//         <div className="d-inline-flex align-items-center gap-1 border rounded-3 p-1 bg-white">
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(1)}
//             disabled={page === 1}
//             title="First"
//           >
//             <ChevronsLeft size={16} />
//           </button>
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(Math.max(1, page - 1))}
//             disabled={page === 1}
//             title="Previous"
//           >
//             <ChevronLeft size={16} />
//           </button>
//           <div className="px-2 py-1 fw-bold">{page}</div>
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(Math.min(totalPages, page + 1))}
//             disabled={page === totalPages}
//             title="Next"
//           >
//             <ChevronRight size={16} />
//           </button>
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(totalPages)}
//             disabled={page === totalPages}
//             title="Last"
//           >
//             <ChevronsRight size={16} />
//           </button>
//         </div>
//         <span className="small text-muted">of {totalPages}</span>
//       </div>
//       <div className="d-flex align-items-center gap-2 flex-wrap">
//         <span className="small">Rows</span>
//         <select
//           className="form-select form-select-sm"
//           value={pageSize}
//           onChange={(e) => {
//             onPageSizeChange(Number(e.target.value));
//             onPageChange(1);
//           }}
//         >
//           {[5, 10, 15, 25].map((s) => (
//             <option key={s} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>
//         <span className="small text-muted">Total: {total}</span>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     users: 0,
//     medicines: 0,
//     doctors: 0,
//     orders: 0,
//     revenue: 0,
//     salesData: [],
//   });
//   const [orders, setOrders] = useState([]);
//   const [medicines, setMedicines] = useState([]);
//   const [lowStock, setLowStock] = useState([]);
//   const [darkMode, setDarkMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [globalError, setGlobalError] = useState("");

//   // table state
//   const [ordersQuery, setOrdersQuery] = useState("");
//   const [ordersPage, setOrdersPage] = useState(1);
//   const [ordersPageSize, setOrdersPageSize] = useState(10);
//   const [medQuery, setMedQuery] = useState("");
//   const [medPage, setMedPage] = useState(1);
//   const [medPageSize, setMedPageSize] = useState(10);

//   const { items: sortedOrders, requestSort: requestSortOrder } =
//     useSortableData(orders);
//   const { items: sortedMeds, requestSort: requestSortMed } =
//     useSortableData(medicines);

//   const filteredOrders = useMemo(() => {
//     if (!ordersQuery.trim()) return sortedOrders;
//     const q = ordersQuery.trim().toLowerCase();
//     return sortedOrders.filter(
//       (o) =>
//         String(o.orderId).toLowerCase().includes(q) ||
//         o.customer?.toLowerCase().includes(q) ||
//         o.medicine?.toLowerCase().includes(q) ||
//         o.orderStatus?.toLowerCase().includes(q)
//     );
//   }, [ordersQuery, sortedOrders]);

//   const filteredMeds = useMemo(() => {
//     if (!medQuery.trim()) return sortedMeds;
//     const q = medQuery.trim().toLowerCase();
//     return sortedMeds.filter(
//       (m) =>
//         String(m._id).toLowerCase().includes(q) ||
//         m.name?.toLowerCase().includes(q) ||
//         m.category?.toLowerCase().includes(q)
//     );
//   }, [medQuery, sortedMeds]);

//   const ordersTotal = filteredOrders.length;
//   const ordersPageItems = useMemo(() => {
//     const start = (ordersPage - 1) * ordersPageSize;
//     return filteredOrders.slice(start, start + ordersPageSize);
//   }, [filteredOrders, ordersPage, ordersPageSize]);

//   const medsTotal = filteredMeds.length;
//   const medsPageItems = useMemo(() => {
//     const start = (medPage - 1) * medPageSize;
//     return filteredMeds.slice(start, start + medPageSize);
//   }, [filteredMeds, medPage, medPageSize]);

//   // Fetch LIVE data
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setGlobalError("No token found. Please login again.");
//       setLoading(false);
//       return;
//     }

//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         const [statsRes, ordersRes, medsRes, lowStockRes] = await Promise.all([
//           api.get("/admin/stats", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           api.get("/admin/orders", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           api.get("/medicines", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           api.get("/admin/low-stock", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         setStats(statsRes.data || {});
//         setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
//         setMedicines(Array.isArray(medsRes.data) ? medsRes.data : []);
//         setLowStock(Array.isArray(lowStockRes.data) ? lowStockRes.data : []);
//         setGlobalError("");
//       } catch (err) {
//         console.error("Dashboard fetch error:", err);
//         setGlobalError(
//           `Could not load live data: ${
//             err.response?.data?.message || err.message
//           }`
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="d-flex align-items-center justify-content-center vh-100 fw-semibold fs-5">
//         <div className="spinner-border text-primary me-3"></div>
//         Loading admin dashboard...
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//         <div>
//           <h1 className="h3 mb-1 fw-bold">Welcome back, Admin</h1>
//           <p className="mb-0 text-muted">
//             Dashboard overview &amp; quick actions
//           </p>
//         </div>
//         {globalError && (
//           <div className="alert alert-warning small mb-0 flex-grow-1">
//             {globalError}
//           </div>
//         )}
//       </div>

//       {/* Stats Cards */}
//       <div className="row g-3 mb-5">
//         {[
//           {
//             title: "Total Users",
//             value: stats.users || 0,
//             icon: Users,
//             color: "primary",
//           },
//           {
//             title: "Medicines",
//             value: stats.medicines || 0,
//             icon: Package,
//             color: "success",
//           },
//           {
//             title: "Doctors",
//             value: stats.doctors || 0,
//             icon: Stethoscope,
//             color: "info",
//           },
//           {
//             title: "Orders",
//             value: stats.orders || 0,
//             icon: ShoppingCart,
//             color: "warning",
//           },
//           {
//             title: "Revenue",
//             value: `₹${Number(stats.revenue || 0).toLocaleString()}`,
//             icon: DollarSign,
//             color: "danger",
//           },
//         ].map((card, index) => {
//           const Icon = card.icon;
//           return (
//             <motion.div
//               key={card.title}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
//             >
//               <div
//                 className={`card h-100 shadow border-0 rounded-3 hover-shadow-lg transition-all ${
//                   darkMode ? "bg-dark text-white" : "bg-white"
//                 }`}
//               >
//                 <div className="card-body d-flex flex-column p-4">
//                   <div className="d-flex justify-content-between align-items-start mb-3">
//                     <span className="small text-muted text-uppercase">
//                       {card.title}
//                     </span>
//                     <div
//                       className={`p-2 rounded-circle bg-${card.color} bg-opacity-10`}
//                     >
//                       <Icon size={24} className={`text-${card.color}`} />
//                     </div>
//                   </div>
//                   <div className="h4 mb-1 fw-bold">{card.value}</div>
//                   <div className="small text-muted">Updated now</div>
//                 </div>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Charts & Quick Stats */}
//       <div className="row g-4 mb-5">
//         {/* Sales Chart */}
//         <div className="col-xl-8">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header border-0 pb-0">
//               <h5 className="card-title mb-1 fw-semibold">Monthly Sales</h5>
//               <small className="text-muted">Revenue trend overview</small>
//             </div>
//             <div className="card-body p-0">
//               <div style={{ width: "100%", height: 300 }}>
//                 <ResponsiveContainer>
//                   <BarChart data={stats.salesData || []}>
//                     <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Orders Table */}
//         <div className="col-xl-4">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-semibold">
//                 <TrendingUp size={18} className="me-1 text-primary" />
//                 Recent Orders
//               </h6>
//               <input
//                 type="search"
//                 className="form-control form-control-sm w-auto"
//                 placeholder="Search orders..."
//                 value={ordersQuery}
//                 onChange={(e) => {
//                   setOrdersQuery(e.target.value);
//                   setOrdersPage(1);
//                 }}
//                 style={{ maxWidth: "200px" }}
//               />
//             </div>
//             <div className="table-responsive" style={{ maxHeight: "280px" }}>
//               <table className="table table-sm table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th className="small">ID</th>
//                     <th className="small">Customer</th>
//                     <th className="small">Total</th>
//                     <th className="small">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {ordersPageItems.slice(0, 5).map((order) => (
//                     <tr key={order._id}>
//                       <td className="small fw-medium">{order.orderId}</td>
//                       <td className="small">{order.customer}</td>
//                       <td className="small">
//                         ₹{Number(order.totalAmount || 0).toFixed(2)}
//                       </td>
//                       <td>
//                         <span
//                           className={`badge fs-2xs fw-semibold ${
//                             order.orderStatus === "Completed"
//                               ? "bg-success"
//                               : order.orderStatus === "Pending"
//                               ? "bg-warning text-dark"
//                               : order.orderStatus === "Processing"
//                               ? "bg-info text-dark"
//                               : "bg-danger"
//                           }`}
//                         >
//                           {order.orderStatus}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="card-footer bg-transparent border-0 py-2">
//               <small className="text-muted">
//                 Showing {ordersPageItems.length} of {ordersTotal} orders
//               </small>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Action Tables */}
//       <div className="row g-4">
//         {/* Low Stock Alert */}
//         <div className="col-lg-6">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-semibold">
//                 <Bell size={18} className="me-1 text-warning" />
//                 Low Stock Alert
//               </h6>
//               <input
//                 type="search"
//                 className="form-control form-control-sm w-auto"
//                 placeholder="Search medicine..."
//                 value={medQuery}
//                 onChange={(e) => {
//                   setMedQuery(e.target.value);
//                   setMedPage(1);
//                 }}
//                 style={{ maxWidth: "160px" }}
//               />
//             </div>
//             <div className="p-3">
//               {lowStock.length === 0 ? (
//                 <div className="text-center py-4">
//                   <Package size={48} className="text-success opacity-50 mb-2" />
//                   <div className="text-muted small">All medicines in stock</div>
//                 </div>
//               ) : (
//                 lowStock.slice(0, 6).map((item) => (
//                   <div
//                     key={item._id}
//                     className="d-flex justify-content-between align-items-center p-2 bg-light rounded mb-2"
//                   >
//                     <div>
//                       <div className="fw-medium small">{item.name}</div>
//                       <small className="text-muted">
//                         {item.manufacturer || "N/A"}
//                       </small>
//                     </div>
//                     <span className="badge bg-danger fs-2xs">
//                       {item.quantity} left
//                     </span>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Medicines Overview */}
//         <div className="col-lg-6">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-semibold">
//                 <Activity size={18} className="me-1 text-info" />
//                 Medicines Overview
//               </h6>
//               <a
//                 href="/admin/medicines"
//                 className="btn btn-sm btn-outline-primary"
//               >
//                 View All
//               </a>
//             </div>
//             <div className="table-responsive" style={{ maxHeight: "280px" }}>
//               <table className="table table-sm table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th className="small">Name</th>
//                     <th className="small">Category</th>
//                     <th className="small">Stock</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {medsPageItems.slice(0, 5).map((med) => (
//                     <tr key={med._id}>
//                       <td className="small fw-medium">{med.name}</td>
//                       <td>
//                         <span className="badge bg-secondary bg-opacity-50 small">
//                           {med.category}
//                         </span>
//                       </td>
//                       <td className="small">
//                         <span
//                           className={
//                             med.stock <= 10 ? "text-danger fw-bold" : ""
//                           }
//                         >
//                           {med.stock}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminDashboard;

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Users,
//   Package,
//   ShoppingCart,
//   DollarSign,
//   Stethoscope,
//   TrendingUp,
//   Activity,
//   Bell,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import api from "../services/api";

// // SORT HOOK
// function useSortableData(items, config = null) {
//   const [sortConfig, setSortConfig] = useState(config);

//   const sortedItems = useMemo(() => {
//     const sortable = [...items];
//     if (sortConfig !== null) {
//       const { key, direction } = sortConfig;
//       sortable.sort((a, b) => {
//         let aVal = a[key];
//         let bVal = b[key];
//         if (typeof aVal === "number" && typeof bVal === "number") {
//           return direction === "ascending" ? aVal - bVal : bVal - aVal;
//         }
//         if (typeof aVal === "string") aVal = aVal.toLowerCase();
//         if (typeof bVal === "string") bVal = bVal.toLowerCase();
//         if (aVal < bVal) return direction === "ascending" ? -1 : 1;
//         if (aVal > bVal) return direction === "ascending" ? 1 : -1;
//         return 0;
//       });
//     }
//     return sortable;
//   }, [items, sortConfig]);

//   const requestSort = (key) => {
//     let direction = "ascending";
//     if (
//       sortConfig &&
//       sortConfig.key === key &&
//       sortConfig.direction === "ascending"
//     ) {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   return { items: sortedItems, requestSort, sortConfig };
// }

// // PAGINATION COMPONENT
// const TablePagination = ({
//   total,
//   page,
//   pageSize,
//   onPageChange,
//   onPageSizeChange,
// }) => {
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//   return (
//     <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
//       <div className="d-flex align-items-center gap-2 flex-wrap">
//         <span className="small">Page</span>
//         <div className="d-inline-flex align-items-center gap-1 border rounded-3 p-1 bg-white">
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(1)}
//             disabled={page === 1}
//             title="First"
//           >
//             <ChevronsLeft size={16} />
//           </button>
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(Math.max(1, page - 1))}
//             disabled={page === 1}
//             title="Previous"
//           >
//             <ChevronLeft size={16} />
//           </button>
//           <div className="px-2 py-1 fw-bold">{page}</div>
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(Math.min(totalPages, page + 1))}
//             disabled={page === totalPages}
//             title="Next"
//           >
//             <ChevronRight size={16} />
//           </button>
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(totalPages)}
//             disabled={page === totalPages}
//             title="Last"
//           >
//             <ChevronsRight size={16} />
//           </button>
//         </div>
//         <span className="small text-muted">of {totalPages}</span>
//       </div>
//       <div className="d-flex align-items-center gap-2 flex-wrap">
//         <span className="small">Rows</span>
//         <select
//           className="form-select form-select-sm"
//           value={pageSize}
//           onChange={(e) => {
//             onPageSizeChange(Number(e.target.value));
//             onPageChange(1);
//           }}
//         >
//           {[5, 10, 15, 25].map((s) => (
//             <option key={s} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>
//         <span className="small text-muted">Total: {total}</span>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     users: 0,
//     medicines: 0,
//     doctors: 0,
//     orders: 0,
//     revenue: 0,
//     salesData: [],
//   });
//   const [orders, setOrders] = useState([]);
//   const [medicines, setMedicines] = useState([]);
//   const [lowStock, setLowStock] = useState([]);
//   const [loadingLow, setLoadingLow] = useState(true);
//   const [lowError, setLowError] = useState("");
//   const [darkMode, setDarkMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [globalError, setGlobalError] = useState("");

//   // table state
//   const [ordersQuery, setOrdersQuery] = useState("");
//   const [ordersPage, setOrdersPage] = useState(1);
//   const [ordersPageSize, setOrdersPageSize] = useState(10);
//   const [medQuery, setMedQuery] = useState("");
//   const [medPage, setMedPage] = useState(1);
//   const [medPageSize, setMedPageSize] = useState(10);

//   const { items: sortedOrders, requestSort: requestSortOrder } =
//     useSortableData(orders);
//   const { items: sortedMeds, requestSort: requestSortMed } =
//     useSortableData(medicines);

//   const filteredOrders = useMemo(() => {
//     if (!ordersQuery.trim()) return sortedOrders;
//     const q = ordersQuery.trim().toLowerCase();
//     return sortedOrders.filter(
//       (o) =>
//         String(o.orderId).toLowerCase().includes(q) ||
//         o.customer?.toLowerCase().includes(q) ||
//         o.medicine?.toLowerCase().includes(q) ||
//         o.orderStatus?.toLowerCase().includes(q)
//     );
//   }, [ordersQuery, sortedOrders]);

//   const filteredMeds = useMemo(() => {
//     if (!medQuery.trim()) return sortedMeds;
//     const q = medQuery.trim().toLowerCase();
//     return sortedMeds.filter(
//       (m) =>
//         String(m._id).toLowerCase().includes(q) ||
//         m.name?.toLowerCase().includes(q) ||
//         m.category?.toLowerCase().includes(q)
//     );
//   }, [medQuery, sortedMeds]);

//   const ordersTotal = filteredOrders.length;
//   const ordersPageItems = useMemo(() => {
//     const start = (ordersPage - 1) * ordersPageSize;
//     return filteredOrders.slice(start, start + ordersPageSize);
//   }, [filteredOrders, ordersPage, ordersPageSize]);

//   const medsTotal = filteredMeds.length;
//   const medsPageItems = useMemo(() => {
//     const start = (medPage - 1) * medPageSize;
//     return filteredMeds.slice(start, start + medPageSize);
//   }, [filteredMeds, medPage, medPageSize]);

//   // Fetch LIVE data
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setGlobalError("No token found. Please login again.");
//       setLoading(false);
//       setLoadingLow(false);
//       return;
//     }

//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setLoadingLow(true);
//         setLowError("");

//         const [statsRes, ordersRes, medsRes, lowStockRes] = await Promise.all([
//           api.get("/admin/stats", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           api.get("/admin/orders", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           api.get("/medicines", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           api.get("/medicines/admin/low-stock?threshold=10", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         setStats(statsRes.data || {});
//         setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
//         setMedicines(Array.isArray(medsRes.data) ? medsRes.data : []);
//         setLowStock(Array.isArray(lowStockRes.data) ? lowStockRes.data : []);
//         setGlobalError("");
//       } catch (err) {
//         console.error("Dashboard fetch error:", err);
//         setGlobalError(
//           `Could not load live data: ${
//             err.response?.data?.message || err.message
//           }`
//         );
//         if (err.response?.data?.message) {
//           setLowError(err.response.data.message);
//         } else {
//           setLowError("Failed to load low stock medicines.");
//         }
//       } finally {
//         setLoading(false);
//         setLoadingLow(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="d-flex align-items-center justify-content-center vh-100 fw-semibold fs-5">
//         <div className="spinner-border text-primary me-3"></div>
//         Loading admin dashboard...
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//         <div>
//           <h1 className="h3 mb-1 fw-bold">Welcome back, Admin</h1>
//           <p className="mb-0 text-muted">
//             Dashboard overview &amp; quick actions
//           </p>
//         </div>
//         {globalError && (
//           <div className="alert alert-warning small mb-0 flex-grow-1">
//             {globalError}
//           </div>
//         )}
//       </div>

//       {/* Stats Cards */}
//       <div className="row g-3 mb-5">
//         {[
//           {
//             title: "Total Users",
//             value: stats.users || 0,
//             icon: Users,
//             color: "primary",
//           },
//           {
//             title: "Medicines",
//             value: stats.medicines || 0,
//             icon: Package,
//             color: "success",
//           },
//           {
//             title: "Doctors",
//             value: stats.doctors || 0,
//             icon: Stethoscope,
//             color: "info",
//           },
//           {
//             title: "Orders",
//             value: stats.orders || 0,
//             icon: ShoppingCart,
//             color: "warning",
//           },
//           {
//             title: "Revenue",
//             value: `₹${Number(stats.revenue || 0).toLocaleString()}`,
//             icon: DollarSign,
//             color: "danger",
//           },
//         ].map((card, index) => {
//           const Icon = card.icon;
//           return (
//             <motion.div
//               key={card.title}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
//             >
//               <div
//                 className={`card h-100 shadow border-0 rounded-3 hover-shadow-lg transition-all ${
//                   darkMode ? "bg-dark text-white" : "bg-white"
//                 }`}
//               >
//                 <div className="card-body d-flex flex-column p-4">
//                   <div className="d-flex justify-content-between align-items-start mb-3">
//                     <span className="small text-muted text-uppercase">
//                       {card.title}
//                     </span>
//                     <div
//                       className={`p-2 rounded-circle bg-${card.color} bg-opacity-10`}
//                     >
//                       <Icon size={24} className={`text-${card.color}`} />
//                     </div>
//                   </div>
//                   <div className="h4 mb-1 fw-bold">{card.value}</div>
//                   <div className="small text-muted">Updated now</div>
//                 </div>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Charts & Quick Stats */}
//       <div className="row g-4 mb-5">
//         {/* Sales Chart */}
//         <div className="col-xl-8">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header border-0 pb-0">
//               <h5 className="card-title mb-1 fw-semibold">Monthly Sales</h5>
//               <small className="text-muted">Revenue trend overview</small>
//             </div>
//             <div className="card-body p-0">
//               <div style={{ width: "100%", height: 300 }}>
//                 <ResponsiveContainer>
//                   <BarChart data={stats.salesData || []}>
//                     <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Orders Table */}
//         <div className="col-xl-4">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-semibold">
//                 <TrendingUp size={18} className="me-1 text-primary" />
//                 Recent Orders
//               </h6>
//               <input
//                 type="search"
//                 className="form-control form-control-sm w-auto"
//                 placeholder="Search orders..."
//                 value={ordersQuery}
//                 onChange={(e) => {
//                   setOrdersQuery(e.target.value);
//                   setOrdersPage(1);
//                 }}
//                 style={{ maxWidth: "200px" }}
//               />
//             </div>
//             <div className="table-responsive" style={{ maxHeight: "280px" }}>
//               <table className="table table-sm table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th className="small">ID</th>
//                     <th className="small">Customer</th>
//                     <th className="small">Total</th>
//                     <th className="small">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {ordersPageItems.slice(0, 5).map((order) => (
//                     <tr key={order._id}>
//                       <td className="small fw-medium">{order.orderId}</td>
//                       <td className="small">{order.customer}</td>
//                       <td className="small">
//                         ₹{Number(order.totalAmount || 0).toFixed(2)}
//                       </td>
//                       <td>
//                         <span
//                           className={`badge fs-2xs fw-semibold ${
//                             order.orderStatus === "Completed"
//                               ? "bg-success"
//                               : order.orderStatus === "Pending"
//                               ? "bg-warning text-dark"
//                               : order.orderStatus === "Processing"
//                               ? "bg-info text-dark"
//                               : "bg-danger"
//                           }`}
//                         >
//                           {order.orderStatus}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="card-footer bg-transparent border-0 py-2">
//               <small className="text-muted">
//                 Showing {ordersPageItems.length} of {ordersTotal} orders
//               </small>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Action Tables */}
//       <div className="row g-4">
//         {/* Low Stock Alert */}
//         <div className="col-lg-6">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-semibold">
//                 <Bell size={18} className="me-1 text-warning" />
//                 Low Stock Alert
//               </h6>
//               <input
//                 type="search"
//                 className="form-control form-control-sm w-auto"
//                 placeholder="Search medicine..."
//                 value={medQuery}
//                 onChange={(e) => {
//                   setMedQuery(e.target.value);
//                   setMedPage(1);
//                 }}
//                 style={{ maxWidth: "160px" }}
//               />
//             </div>
//             <div className="p-3">
//               {lowError && <p className="text-danger small mb-2">{lowError}</p>}

//               {loadingLow ? (
//                 <div className="text-center py-4">
//                   <div className="spinner-border text-primary mb-2" />
//                   <div className="text-muted small">Checking stock...</div>
//                 </div>
//               ) : lowStock.length === 0 ? (
//                 <div className="text-center py-4">
//                   <Package size={48} className="text-success opacity-50 mb-2" />
//                   <div className="text-muted small">All medicines in stock</div>
//                 </div>
//               ) : (
//                 lowStock.slice(0, 6).map((item) => (
//                   <div
//                     key={item._id}
//                     className="d-flex justify-content-between align-items-center p-2 bg-light rounded mb-2"
//                   >
//                     <div>
//                       <div className="fw-medium small">{item.name}</div>
//                       <small className="text-muted">
//                         {item.category || "N/A"}
//                       </small>
//                     </div>
//                     <span className="badge bg-danger fs-2xs">
//                       {item.quantity} left
//                     </span>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Medicines Overview */}
//         <div className="col-lg-6">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-semibold">
//                 <Activity size={18} className="me-1 text-info" />
//                 Medicines Overview
//               </h6>
//               <a
//                 href="/admin/medicines"
//                 className="btn btn-sm btn-outline-primary"
//               >
//                 View All
//               </a>
//             </div>
//             <div className="table-responsive" style={{ maxHeight: "280px" }}>
//               <table className="table table-sm table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th className="small">Name</th>
//                     <th className="small">Category</th>
//                     <th className="small">Stock</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {medsPageItems.slice(0, 5).map((med) => (
//                     <tr key={med._id}>
//                       <td className="small fw-medium">{med.name}</td>
//                       <td>
//                         <span className="badge bg-secondary bg-opacity-50 small">
//                           {med.category}
//                         </span>
//                       </td>
//                       <td className="small">
//                         <span
//                           className={
//                             (med.quantity ?? med.stock ?? 0) <= 10
//                               ? "text-danger fw-bold"
//                               : ""
//                           }
//                         >
//                           {med.quantity ?? med.stock ?? 0}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminDashboard;

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Users,
//   Package,
//   ShoppingCart,
//   DollarSign,
//   Stethoscope,
//   TrendingUp,
//   Activity,
//   Bell,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import api from "../services/api";

// // SORT HOOK
// function useSortableData(items, config = null) {
//   const [sortConfig, setSortConfig] = useState(config);

//   const sortedItems = useMemo(() => {
//     const sortable = [...items];
//     if (sortConfig !== null) {
//       const { key, direction } = sortConfig;
//       sortable.sort((a, b) => {
//         let aVal = a[key];
//         let bVal = b[key];
//         if (typeof aVal === "number" && typeof bVal === "number") {
//           return direction === "ascending" ? aVal - bVal : bVal - aVal;
//         }
//         if (typeof aVal === "string") aVal = aVal.toLowerCase();
//         if (typeof bVal === "string") bVal = bVal.toLowerCase();
//         if (aVal < bVal) return direction === "ascending" ? -1 : 1;
//         if (aVal > bVal) return direction === "ascending" ? 1 : -1;
//         return 0;
//       });
//     }
//     return sortable;
//   }, [items, sortConfig]);

//   const requestSort = (key) => {
//     let direction = "ascending";
//     if (
//       sortConfig &&
//       sortConfig.key === key &&
//       sortConfig.direction === "ascending"
//     ) {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   return { items: sortedItems, requestSort, sortConfig };
// }

// // PAGINATION COMPONENT
// const TablePagination = ({
//   total,
//   page,
//   pageSize,
//   onPageChange,
//   onPageSizeChange,
// }) => {
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//   return (
//     <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
//       <div className="d-flex align-items-center gap-2 flex-wrap">
//         <span className="small">Page</span>
//         <div className="d-inline-flex align-items-center gap-1 border rounded-3 p-1 bg-white">
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(1)}
//             disabled={page === 1}
//             title="First"
//           >
//             <ChevronsLeft size={16} />
//           </button>
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(Math.max(1, page - 1))}
//             disabled={page === 1}
//             title="Previous"
//           >
//             <ChevronLeft size={16} />
//           </button>
//           <div className="px-2 py-1 fw-bold">{page}</div>
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(Math.min(totalPages, page + 1))}
//             disabled={page === totalPages}
//             title="Next"
//           >
//             <ChevronRight size={16} />
//           </button>
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(totalPages)}
//             disabled={page === totalPages}
//             title="Last"
//           >
//             <ChevronsRight size={16} />
//           </button>
//         </div>
//         <span className="small text-muted">of {totalPages}</span>
//       </div>
//       <div className="d-flex align-items-center gap-2 flex-wrap">
//         <span className="small">Rows</span>
//         <select
//           className="form-select form-select-sm"
//           value={pageSize}
//           onChange={(e) => {
//             onPageSizeChange(Number(e.target.value));
//             onPageChange(1);
//           }}
//         >
//           {[5, 10, 15, 25].map((s) => (
//             <option key={s} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>
//         <span className="small text-muted">Total: {total}</span>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     users: 0,
//     medicines: 0,
//     doctors: 0,
//     orders: 0,
//     revenue: 0,
//     salesData: [],
//   });
//   const [orders, setOrders] = useState([]);
//   const [medicines, setMedicines] = useState([]);
//   const [lowStock, setLowStock] = useState([]);
//   const [loadingLow, setLoadingLow] = useState(true);
//   const [lowError, setLowError] = useState("");
//   const [darkMode, setDarkMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [globalError, setGlobalError] = useState("");

//   // table state
//   const [ordersQuery, setOrdersQuery] = useState("");
//   const [ordersPage, setOrdersPage] = useState(1);
//   const [ordersPageSize, setOrdersPageSize] = useState(10);
//   const [medQuery, setMedQuery] = useState("");
//   const [medPage, setMedPage] = useState(1);
//   const [medPageSize, setMedPageSize] = useState(10);

//   const { items: sortedOrders, requestSort: requestSortOrder } =
//     useSortableData(orders);
//   const { items: sortedMeds, requestSort: requestSortMed } =
//     useSortableData(medicines);

//   const filteredOrders = useMemo(() => {
//     if (!ordersQuery.trim()) return sortedOrders;
//     const q = ordersQuery.trim().toLowerCase();
//     return sortedOrders.filter(
//       (o) =>
//         String(o.orderId).toLowerCase().includes(q) ||
//         o.customer?.toLowerCase().includes(q) ||
//         o.medicine?.toLowerCase().includes(q) ||
//         o.orderStatus?.toLowerCase().includes(q)
//     );
//   }, [ordersQuery, sortedOrders]);

//   const filteredMeds = useMemo(() => {
//     if (!medQuery.trim()) return sortedMeds;
//     const q = medQuery.trim().toLowerCase();
//     return sortedMeds.filter(
//       (m) =>
//         String(m._id).toLowerCase().includes(q) ||
//         m.name?.toLowerCase().includes(q) ||
//         m.category?.toLowerCase().includes(q)
//     );
//   }, [medQuery, sortedMeds]);

//   const ordersTotal = filteredOrders.length;
//   const ordersPageItems = useMemo(() => {
//     const start = (ordersPage - 1) * ordersPageSize;
//     return filteredOrders.slice(start, start + ordersPageSize);
//   }, [filteredOrders, ordersPage, ordersPageSize]);

//   const medsTotal = filteredMeds.length;
//   const medsPageItems = useMemo(() => {
//     const start = (medPage - 1) * medPageSize;
//     return filteredMeds.slice(start, start + medPageSize);
//   }, [filteredMeds, medPage, medPageSize]);

//   // Fetch LIVE data
//   useEffect(() => {
//     // If you are using api instance, you usually don't need to manually get token
//     // providing the api service has an interceptor.
//     // However, keeping your logic exactly as requested:
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setGlobalError("No token found. Please login again.");
//       setLoading(false);
//       setLoadingLow(false);
//       return;
//     }

//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setLoadingLow(true);
//         setLowError("");

//         // Note: Make sure your backend routes match these exact paths
//         const [statsRes, ordersRes, medsRes, lowStockRes] = await Promise.all([
//           api.get("/admin/stats", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           api.get("/admin/orders", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           api.get("/medicines", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           api.get("/medicines/admin/low-stock?threshold=10", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         setStats(statsRes.data || {});
//         setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
//         setMedicines(Array.isArray(medsRes.data) ? medsRes.data : []);
//         setLowStock(Array.isArray(lowStockRes.data) ? lowStockRes.data : []);
//         setGlobalError("");
//       } catch (err) {
//         console.error("Dashboard fetch error:", err);
//         setGlobalError(
//           `Could not load live data: ${
//             err.response?.data?.message || err.message
//           }`
//         );
//         if (err.response?.data?.message) {
//           setLowError(err.response.data.message);
//         } else {
//           setLowError("Failed to load low stock medicines.");
//         }
//       } finally {
//         setLoading(false);
//         setLoadingLow(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="d-flex align-items-center justify-content-center vh-100 fw-semibold fs-5">
//         <div className="spinner-border text-primary me-3"></div>
//         Loading admin dashboard...
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//         <div>
//           <h1 className="h3 mb-1 fw-bold">Welcome back, Admin</h1>
//           <p className="mb-0 text-muted">
//             Dashboard overview &amp; quick actions
//           </p>
//         </div>
//         {globalError && (
//           <div className="alert alert-warning small mb-0 flex-grow-1">
//             {globalError}
//           </div>
//         )}
//       </div>

//       {/* Stats Cards */}
//       <div className="row g-3 mb-5">
//         {[
//           {
//             title: "Total Users",
//             value: stats.users || 0,
//             icon: Users,
//             color: "primary",
//           },
//           {
//             title: "Medicines",
//             value: stats.medicines || 0,
//             icon: Package,
//             color: "success",
//           },
//           {
//             title: "Doctors",
//             value: stats.doctors || 0,
//             icon: Stethoscope,
//             color: "info",
//           },
//           {
//             title: "Orders",
//             value: stats.orders || 0,
//             icon: ShoppingCart,
//             color: "warning",
//           },
//           {
//             title: "Revenue",
//             value: `₹${Number(stats.revenue || 0).toLocaleString()}`,
//             icon: DollarSign,
//             color: "danger",
//           },
//         ].map((card, index) => {
//           const Icon = card.icon;
//           return (
//             <motion.div
//               key={card.title}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
//             >
//               <div
//                 className={`card h-100 shadow border-0 rounded-3 hover-shadow-lg transition-all ${
//                   darkMode ? "bg-dark text-white" : "bg-white"
//                 }`}
//               >
//                 <div className="card-body d-flex flex-column p-4">
//                   <div className="d-flex justify-content-between align-items-start mb-3">
//                     <span className="small text-muted text-uppercase">
//                       {card.title}
//                     </span>
//                     <div
//                       className={`p-2 rounded-circle bg-${card.color} bg-opacity-10`}
//                     >
//                       <Icon size={24} className={`text-${card.color}`} />
//                     </div>
//                   </div>
//                   <div className="h4 mb-1 fw-bold">{card.value}</div>
//                   <div className="small text-muted">Updated now</div>
//                 </div>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Charts & Quick Stats */}
//       <div className="row g-4 mb-5">
//         {/* Sales Chart */}
//         <div className="col-xl-8">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header border-0 pb-0">
//               <h5 className="card-title mb-1 fw-semibold">Monthly Sales</h5>
//               <small className="text-muted">Revenue trend overview</small>
//             </div>
//             <div className="card-body p-0">
//               {/* ✅ FIX: Ensuring explicit height container for Recharts to prevent crash */}
//               <div style={{ width: "100%", height: 350 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={stats.salesData || []}>
//                     <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Orders Table */}
//         <div className="col-xl-4">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-semibold">
//                 <TrendingUp size={18} className="me-1 text-primary" />
//                 Recent Orders
//               </h6>
//               <input
//                 type="search"
//                 className="form-control form-control-sm w-auto"
//                 placeholder="Search orders..."
//                 value={ordersQuery}
//                 onChange={(e) => {
//                   setOrdersQuery(e.target.value);
//                   setOrdersPage(1);
//                 }}
//                 style={{ maxWidth: "200px" }}
//               />
//             </div>
//             <div className="table-responsive" style={{ maxHeight: "280px" }}>
//               <table className="table table-sm table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th className="small">ID</th>
//                     <th className="small">Customer</th>
//                     <th className="small">Total</th>
//                     <th className="small">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {ordersPageItems.slice(0, 5).map((order) => (
//                     <tr key={order._id}>
//                       <td className="small fw-medium">{order.orderId}</td>
//                       <td className="small">{order.customer}</td>
//                       <td className="small">
//                         ₹{Number(order.totalAmount || 0).toFixed(2)}
//                       </td>
//                       <td>
//                         <span
//                           className={`badge fs-2xs fw-semibold ${
//                             order.orderStatus === "Completed"
//                               ? "bg-success"
//                               : order.orderStatus === "Pending"
//                               ? "bg-warning text-dark"
//                               : order.orderStatus === "Processing"
//                               ? "bg-info text-dark"
//                               : "bg-danger"
//                           }`}
//                         >
//                           {order.orderStatus}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="card-footer bg-transparent border-0 py-2">
//               <small className="text-muted">
//                 Showing {ordersPageItems.length} of {ordersTotal} orders
//               </small>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Action Tables */}
//       <div className="row g-4">
//         {/* Low Stock Alert */}
//         <div className="col-lg-6">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-semibold">
//                 <Bell size={18} className="me-1 text-warning" />
//                 Low Stock Alert
//               </h6>
//               <input
//                 type="search"
//                 className="form-control form-control-sm w-auto"
//                 placeholder="Search medicine..."
//                 value={medQuery}
//                 onChange={(e) => {
//                   setMedQuery(e.target.value);
//                   setMedPage(1);
//                 }}
//                 style={{ maxWidth: "160px" }}
//               />
//             </div>
//             <div className="p-3">
//               {lowError && <p className="text-danger small mb-2">{lowError}</p>}

//               {loadingLow ? (
//                 <div className="text-center py-4">
//                   <div className="spinner-border text-primary mb-2" />
//                   <div className="text-muted small">Checking stock...</div>
//                 </div>
//               ) : lowStock.length === 0 ? (
//                 <div className="text-center py-4">
//                   <Package size={48} className="text-success opacity-50 mb-2" />
//                   <div className="text-muted small">All medicines in stock</div>
//                 </div>
//               ) : (
//                 lowStock.slice(0, 6).map((item) => (
//                   <div
//                     key={item._id}
//                     className="d-flex justify-content-between align-items-center p-2 bg-light rounded mb-2"
//                   >
//                     <div>
//                       <div className="fw-medium small">{item.name}</div>
//                       <small className="text-muted">
//                         {item.category || "N/A"}
//                       </small>
//                     </div>
//                     <span className="badge bg-danger fs-2xs">
//                       {item.quantity} left
//                     </span>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Medicines Overview */}
//         <div className="col-lg-6">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-semibold">
//                 <Activity size={18} className="me-1 text-info" />
//                 Medicines Overview
//               </h6>
//               <a
//                 href="/admin/medicines"
//                 className="btn btn-sm btn-outline-primary"
//               >
//                 View All
//               </a>
//             </div>
//             <div className="table-responsive" style={{ maxHeight: "280px" }}>
//               <table className="table table-sm table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th className="small">Name</th>
//                     <th className="small">Category</th>
//                     <th className="small">Stock</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {medsPageItems.slice(0, 5).map((med) => (
//                     <tr key={med._id}>
//                       <td className="small fw-medium">{med.name}</td>
//                       <td>
//                         <span className="badge bg-secondary bg-opacity-50 small">
//                           {med.category}
//                         </span>
//                       </td>
//                       <td className="small">
//                         <span
//                           className={
//                             (med.quantity ?? med.stock ?? 0) <= 10
//                               ? "text-danger fw-bold"
//                               : ""
//                           }
//                         >
//                           {med.quantity ?? med.stock ?? 0}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminDashboard;

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Users,
//   Package,
//   ShoppingCart,
//   DollarSign,
//   Stethoscope,
//   TrendingUp,
//   Activity,
//   Bell,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import api from "../services/api";

// // SORT HOOK
// function useSortableData(items, config = null) {
//   const [sortConfig, setSortConfig] = useState(config);

//   const sortedItems = useMemo(() => {
//     const sortable = [...items];
//     if (sortConfig !== null) {
//       const { key, direction } = sortConfig;
//       sortable.sort((a, b) => {
//         let aVal = a[key];
//         let bVal = b[key];
//         if (typeof aVal === "number" && typeof bVal === "number") {
//           return direction === "ascending" ? aVal - bVal : bVal - aVal;
//         }
//         if (typeof aVal === "string") aVal = aVal.toLowerCase();
//         if (typeof bVal === "string") bVal = bVal.toLowerCase();
//         if (aVal < bVal) return direction === "ascending" ? -1 : 1;
//         if (aVal > bVal) return direction === "ascending" ? 1 : -1;
//         return 0;
//       });
//     }
//     return sortable;
//   }, [items, sortConfig]);

//   const requestSort = (key) => {
//     let direction = "ascending";
//     if (
//       sortConfig &&
//       sortConfig.key === key &&
//       sortConfig.direction === "ascending"
//     ) {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   return { items: sortedItems, requestSort, sortConfig };
// }

// // PAGINATION COMPONENT
// const TablePagination = ({
//   total,
//   page,
//   pageSize,
//   onPageChange,
//   onPageSizeChange,
// }) => {
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//   return (
//     <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
//       <div className="d-flex align-items-center gap-2 flex-wrap">
//         <span className="small">Page</span>
//         <div className="d-inline-flex align-items-center gap-1 border rounded-3 p-1 bg-white">
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(1)}
//             disabled={page === 1}
//             title="First"
//           >
//             <ChevronsLeft size={16} />
//           </button>
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(Math.max(1, page - 1))}
//             disabled={page === 1}
//             title="Previous"
//           >
//             <ChevronLeft size={16} />
//           </button>
//           <div className="px-2 py-1 fw-bold">{page}</div>
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(Math.min(totalPages, page + 1))}
//             disabled={page === totalPages}
//             title="Next"
//           >
//             <ChevronRight size={16} />
//           </button>
//           <button
//             className="btn btn-sm p-1"
//             onClick={() => onPageChange(totalPages)}
//             disabled={page === totalPages}
//             title="Last"
//           >
//             <ChevronsRight size={16} />
//           </button>
//         </div>
//         <span className="small text-muted">of {totalPages}</span>
//       </div>
//       <div className="d-flex align-items-center gap-2 flex-wrap">
//         <span className="small">Rows</span>
//         <select
//           className="form-select form-select-sm"
//           value={pageSize}
//           onChange={(e) => {
//             onPageSizeChange(Number(e.target.value));
//             onPageChange(1);
//           }}
//         >
//           {[5, 10, 15, 25].map((s) => (
//             <option key={s} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>
//         <span className="small text-muted">Total: {total}</span>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     users: 0,
//     medicines: 0,
//     doctors: 0,
//     orders: 0,
//     revenue: 0,
//     salesData: [],
//   });
//   const [orders, setOrders] = useState([]);
//   const [medicines, setMedicines] = useState([]);
//   const [lowStock, setLowStock] = useState([]);
//   const [loadingLow, setLoadingLow] = useState(true);
//   const [lowError, setLowError] = useState("");
//   const [darkMode, setDarkMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [globalError, setGlobalError] = useState("");

//   // table state
//   const [ordersQuery, setOrdersQuery] = useState("");
//   const [ordersPage, setOrdersPage] = useState(1);
//   const [ordersPageSize, setOrdersPageSize] = useState(10);
//   const [medQuery, setMedQuery] = useState("");
//   const [medPage, setMedPage] = useState(1);
//   const [medPageSize, setMedPageSize] = useState(10);

//   const { items: sortedOrders, requestSort: requestSortOrder } =
//     useSortableData(orders);
//   const { items: sortedMeds, requestSort: requestSortMed } =
//     useSortableData(medicines);

//   const filteredOrders = useMemo(() => {
//     if (!ordersQuery.trim()) return sortedOrders;
//     const q = ordersQuery.trim().toLowerCase();
//     return sortedOrders.filter(
//       (o) =>
//         String(o.orderId).toLowerCase().includes(q) ||
//         o.customer?.toLowerCase().includes(q) ||
//         o.medicine?.toLowerCase().includes(q) ||
//         o.orderStatus?.toLowerCase().includes(q)
//     );
//   }, [ordersQuery, sortedOrders]);

//   const filteredMeds = useMemo(() => {
//     if (!medQuery.trim()) return sortedMeds;
//     const q = medQuery.trim().toLowerCase();
//     return sortedMeds.filter(
//       (m) =>
//         String(m._id).toLowerCase().includes(q) ||
//         m.name?.toLowerCase().includes(q) ||
//         m.category?.toLowerCase().includes(q)
//     );
//   }, [medQuery, sortedMeds]);

//   const ordersTotal = filteredOrders.length;
//   const ordersPageItems = useMemo(() => {
//     const start = (ordersPage - 1) * ordersPageSize;
//     return filteredOrders.slice(start, start + ordersPageSize);
//   }, [filteredOrders, ordersPage, ordersPageSize]);

//   const medsTotal = filteredMeds.length;
//   const medsPageItems = useMemo(() => {
//     const start = (medPage - 1) * medPageSize;
//     return filteredMeds.slice(start, start + medPageSize);
//   }, [filteredMeds, medPage, medPageSize]);

//   // Fetch LIVE data
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setGlobalError("No token found. Please login again.");
//       setLoading(false);
//       setLoadingLow(false);
//       return;
//     }

//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setLoadingLow(true);
//         setLowError("");

//         const [statsRes, ordersRes, medsRes, lowStockRes] = await Promise.all([
//           api.get("/admin/stats", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           api.get("/admin/orders", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           api.get("/medicines", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           api.get("/medicines/admin/low-stock?threshold=10", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         setStats(statsRes.data || {});
//         setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
//         setMedicines(Array.isArray(medsRes.data) ? medsRes.data : []);
//         setLowStock(Array.isArray(lowStockRes.data) ? lowStockRes.data : []);
//         setGlobalError("");
//       } catch (err) {
//         console.error("Dashboard fetch error:", err);
//         setGlobalError(
//           `Could not load live data: ${
//             err.response?.data?.message || err.message
//           }`
//         );
//         if (err.response?.data?.message) {
//           setLowError(err.response.data.message);
//         } else {
//           setLowError("Failed to load low stock medicines.");
//         }
//       } finally {
//         setLoading(false);
//         setLoadingLow(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="d-flex align-items-center justify-content-center vh-100 fw-semibold fs-5">
//         <div className="spinner-border text-primary me-3"></div>
//         Loading admin dashboard...
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//         <div>
//           <h1 className="h3 mb-1 fw-bold">Welcome back, Admin</h1>
//           <p className="mb-0 text-muted">
//             Dashboard overview &amp; quick actions
//           </p>
//         </div>
//         {globalError && (
//           <div className="alert alert-warning small mb-0 flex-grow-1">
//             {globalError}
//           </div>
//         )}
//       </div>

//       {/* Stats Cards */}
//       <div className="row g-3 mb-5">
//         {[
//           {
//             title: "Total Users",
//             value: stats.users || 0,
//             icon: Users,
//             color: "primary",
//           },
//           {
//             title: "Medicines",
//             value: stats.medicines || 0,
//             icon: Package,
//             color: "success",
//           },
//           {
//             title: "Doctors",
//             value: stats.doctors || 0,
//             icon: Stethoscope,
//             color: "info",
//           },
//           {
//             title: "Orders",
//             value: stats.orders || 0,
//             icon: ShoppingCart,
//             color: "warning",
//           },
//           {
//             title: "Revenue",
//             value: `₹${Number(stats.revenue || 0).toLocaleString()}`,
//             icon: DollarSign,
//             color: "danger",
//           },
//         ].map((card, index) => {
//           const Icon = card.icon;
//           return (
//             <motion.div
//               key={card.title}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
//             >
//               <div
//                 className={`card h-100 shadow border-0 rounded-3 hover-shadow-lg transition-all ${
//                   darkMode ? "bg-dark text-white" : "bg-white"
//                 }`}
//               >
//                 <div className="card-body d-flex flex-column p-4">
//                   <div className="d-flex justify-content-between align-items-start mb-3">
//                     <span className="small text-muted text-uppercase">
//                       {card.title}
//                     </span>
//                     <div
//                       className={`p-2 rounded-circle bg-${card.color} bg-opacity-10`}
//                     >
//                       <Icon size={24} className={`text-${card.color}`} />
//                     </div>
//                   </div>
//                   <div className="h4 mb-1 fw-bold">{card.value}</div>
//                   <div className="small text-muted">Updated now</div>
//                 </div>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Charts & Quick Stats */}
//       <div className="row g-4 mb-5">
//         {/* Sales Chart */}
//         <div className="col-xl-8">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header border-0 pb-0">
//               <h5 className="card-title mb-1 fw-semibold">Monthly Sales</h5>
//               <small className="text-muted">Revenue trend overview</small>
//             </div>
//             <div className="card-body p-0">
//               {/* ✅ FIX: Ensuring explicit height container for Recharts to prevent crash */}
//               <div style={{ width: "100%", height: 350 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={stats.salesData || []}>
//                     <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Orders Table */}
//         <div className="col-xl-4">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-semibold">
//                 <TrendingUp size={18} className="me-1 text-primary" />
//                 Recent Orders
//               </h6>
//               <input
//                 type="search"
//                 className="form-control form-control-sm w-auto"
//                 placeholder="Search orders..."
//                 value={ordersQuery}
//                 onChange={(e) => {
//                   setOrdersQuery(e.target.value);
//                   setOrdersPage(1);
//                 }}
//                 style={{ maxWidth: "200px" }}
//               />
//             </div>
//             <div className="table-responsive" style={{ maxHeight: "280px" }}>
//               <table className="table table-sm table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th className="small">ID</th>
//                     <th className="small">Customer</th>
//                     <th className="small">Total</th>
//                     <th className="small">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {ordersPageItems.slice(0, 5).map((order) => (
//                     <tr key={order._id}>
//                       <td className="small fw-medium">{order.orderId}</td>
//                       <td className="small">{order.customer}</td>
//                       <td className="small">
//                         ₹{Number(order.totalAmount || 0).toFixed(2)}
//                       </td>
//                       <td>
//                         <span
//                           className={`badge fs-2xs fw-semibold ${
//                             order.orderStatus === "Completed"
//                               ? "bg-success"
//                               : order.orderStatus === "Pending"
//                               ? "bg-warning text-dark"
//                               : order.orderStatus === "Processing"
//                               ? "bg-info text-dark"
//                               : "bg-danger"
//                           }`}
//                         >
//                           {order.orderStatus}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="card-footer bg-transparent border-0 py-2">
//               <small className="text-muted">
//                 Showing {ordersPageItems.length} of {ordersTotal} orders
//               </small>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Action Tables */}
//       <div className="row g-4">
//         {/* Low Stock Alert */}
//         <div className="col-lg-6">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-semibold">
//                 <Bell size={18} className="me-1 text-warning" />
//                 Low Stock Alert
//               </h6>
//               <input
//                 type="search"
//                 className="form-control form-control-sm w-auto"
//                 placeholder="Search medicine..."
//                 value={medQuery}
//                 onChange={(e) => {
//                   setMedQuery(e.target.value);
//                   setMedPage(1);
//                 }}
//                 style={{ maxWidth: "160px" }}
//               />
//             </div>
//             <div className="p-3">
//               {lowError && <p className="text-danger small mb-2">{lowError}</p>}

//               {loadingLow ? (
//                 <div className="text-center py-4">
//                   <div className="spinner-border text-primary mb-2" />
//                   <div className="text-muted small">Checking stock...</div>
//                 </div>
//               ) : lowStock.length === 0 ? (
//                 <div className="text-center py-4">
//                   <Package size={48} className="text-success opacity-50 mb-2" />
//                   <div className="text-muted small">All medicines in stock</div>
//                 </div>
//               ) : (
//                 lowStock.slice(0, 6).map((item) => (
//                   <div
//                     key={item._id}
//                     className="d-flex justify-content-between align-items-center p-2 bg-light rounded mb-2"
//                   >
//                     <div>
//                       <div className="fw-medium small">{item.name}</div>
//                       <small className="text-muted">
//                         {item.category || "N/A"}
//                       </small>
//                     </div>
//                     <span className="badge bg-danger fs-2xs">
//                       {item.quantity} left
//                     </span>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Medicines Overview */}
//         <div className="col-lg-6">
//           <div
//             className={`card shadow border-0 rounded-3 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-semibold">
//                 <Activity size={18} className="me-1 text-info" />
//                 Medicines Overview
//               </h6>
//               <a
//                 href="/admin/medicines"
//                 className="btn btn-sm btn-outline-primary"
//               >
//                 View All
//               </a>
//             </div>
//             <div className="table-responsive" style={{ maxHeight: "280px" }}>
//               <table className="table table-sm table-hover mb-0">
//                 <thead>
//                   <tr>
//                     <th className="small">Name</th>
//                     <th className="small">Category</th>
//                     <th className="small">Stock</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {medsPageItems.slice(0, 5).map((med) => (
//                     <tr key={med._id}>
//                       <td className="small fw-medium">{med.name}</td>
//                       <td>
//                         <span className="badge bg-secondary bg-opacity-50 small">
//                           {med.category}
//                         </span>
//                       </td>
//                       <td className="small">
//                         <span
//                           className={
//                             (med.quantity ?? med.stock ?? 0) <= 10
//                               ? "text-danger fw-bold"
//                               : ""
//                           }
//                         >
//                           {med.quantity ?? med.stock ?? 0}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Stethoscope,
  TrendingUp,
  Activity,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";

// SORT HOOK
function useSortableData(items, config = null) {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    const sortable = Array.isArray(items) ? [...items] : [];
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      sortable.sort((a, b) => {
        let aVal = a[key];
        let bVal = b[key];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return direction === "ascending" ? aVal - bVal : bVal - aVal;
        }
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        if (aVal < bVal) return direction === "ascending" ? -1 : 1;
        if (aVal > bVal) return direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
}

// PAGINATION COMPONENT
const TablePagination = ({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <span className="small">Page</span>
        <div className="d-inline-flex align-items-center gap-1 border rounded-3 p-1 bg-white">
          <button
            className="btn btn-sm p-1"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            title="First"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            className="btn btn-sm p-1"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            title="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="px-2 py-1 fw-bold">{page}</div>
          <button
            className="btn btn-sm p-1"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            title="Next"
          >
            <ChevronRight size={16} />
          </button>
          <button
            className="btn btn-sm p-1"
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            title="Last"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
        <span className="small text-muted">of {totalPages}</span>
      </div>
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <span className="small">Rows</span>
        <select
          className="form-select form-select-sm"
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
        >
          {[5, 10, 15, 25].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="small text-muted">Total: {total}</span>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  // ✅ INITIAL STATE: All values set to zero/empty, no mock data
  const [stats, setStats] = useState({
    users: 0,
    medicines: 0,
    doctors: 0,
    orders: 0,
    revenue: 0,
    salesData: [],
  });
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loadingLow, setLoadingLow] = useState(true);
  const [lowError, setLowError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState("");

  // table state
  const [ordersQuery, setOrdersQuery] = useState("");
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPageSize, setOrdersPageSize] = useState(10);
  const [medQuery, setMedQuery] = useState("");
  const [medPage, setMedPage] = useState(1);
  const [medPageSize, setMedPageSize] = useState(10);

  const { items: sortedOrders, requestSort: requestSortOrder } =
    useSortableData(orders);
  const { items: sortedMeds, requestSort: requestSortMed } =
    useSortableData(medicines);

  const filteredOrders = useMemo(() => {
    if (!ordersQuery.trim()) return sortedOrders;
    const q = ordersQuery.trim().toLowerCase();
    return sortedOrders.filter(
      (o) =>
        String(o._id).toLowerCase().includes(q) ||
        o.user?.name?.toLowerCase().includes(q) ||
        o.orderStatus?.toLowerCase().includes(q)
    );
  }, [ordersQuery, sortedOrders]);

  const filteredMeds = useMemo(() => {
    if (!medQuery.trim()) return sortedMeds;
    const q = medQuery.trim().toLowerCase();
    return sortedMeds.filter(
      (m) =>
        String(m._id).toLowerCase().includes(q) ||
        m.name?.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q)
    );
  }, [medQuery, sortedMeds]);

  const ordersTotal = filteredOrders.length;
  const ordersPageItems = useMemo(() => {
    const start = (ordersPage - 1) * ordersPageSize;
    return filteredOrders.slice(start, start + ordersPageSize);
  }, [filteredOrders, ordersPage, ordersPageSize]);

  const medsTotal = filteredMeds.length;
  const medsPageItems = useMemo(() => {
    const start = (medPage - 1) * medPageSize;
    return filteredMeds.slice(start, start + medPageSize);
  }, [filteredMeds, medPage, medPageSize]);

  // Fetch LIVE data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setLoadingLow(true);

        // Fetch real data from the admin endpoints we created
        const [statsRes, ordersRes, medsRes, lowStockRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/orders"),
          api.get("/admin/medicines"),
          api.get("/medicines/admin/low-stock?threshold=10"),
        ]);

        // ✅ DATA MAPPING: Extracting real values from database responses
        setStats({
          users: statsRes.totalCustomers || 0,
          medicines: statsRes.totalMedicines || 0,
          doctors: statsRes.totalDoctors || 0,
          orders: statsRes.totalOrders || 0,
          revenue: statsRes.totalSales || 0,
          salesData: statsRes.salesData || [],
        });

        setOrders(Array.isArray(ordersRes) ? ordersRes : []);
        setMedicines(Array.isArray(medsRes) ? medsRes : []);
        setLowStock(Array.isArray(lowStockRes) ? lowStockRes : []);

        setGlobalError("");
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setGlobalError("Failed to fetch live database records.");
        setLowError("Low stock data unavailable.");
      } finally {
        setLoading(false);
        setLoadingLow(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 fw-semibold fs-5">
        <div className="spinner-border text-primary me-3"></div>
        Syncing with Database...
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 className="h3 mb-1 fw-bold">Live System Overview</h1>
          <p className="mb-0 text-muted">Real-time database statistics</p>
        </div>
        {globalError && (
          <div className="alert alert-danger small mb-0 flex-grow-1 py-2">
            {globalError}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-5">
        {[
          {
            title: "Total Users",
            value: stats.users,
            icon: Users,
            color: "primary",
          },
          {
            title: "Medicines",
            value: stats.medicines,
            icon: Package,
            color: "success",
          },
          {
            title: "Doctors",
            value: stats.doctors,
            icon: Stethoscope,
            color: "info",
          },
          {
            title: "Orders",
            value: stats.orders,
            icon: ShoppingCart,
            color: "warning",
          },
          {
            title: "Revenue",
            value: `Rs. ${Number(stats.revenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: "danger",
          },
        ].map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
            >
              <div
                className={`card h-100 shadow-sm border-0 rounded-3 ${
                  darkMode ? "bg-dark text-white" : "bg-white"
                }`}
              >
                <div className="card-body d-flex flex-column p-3 text-center">
                  <div
                    className={`p-2 rounded-circle bg-${card.color} bg-opacity-10 mx-auto mb-2`}
                  >
                    <Icon size={24} className={`text-${card.color}`} />
                  </div>
                  <span className="small text-muted text-uppercase fw-bold mb-1">
                    {card.title}
                  </span>
                  <div className="h4 mb-0 fw-bold">{card.value}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts & Quick Stats */}
      <div className="row g-4 mb-5">
        <div className="col-xl-8">
          <div
            className={`card shadow-sm border-0 rounded-4 ${
              darkMode ? "bg-dark text-white" : "bg-white"
            }`}
          >
            <div className="card-header border-0 pb-0 bg-transparent p-4">
              <h5 className="fw-bold mb-0">Monthly Revenue Analytics</h5>
            </div>
            <div className="card-body">
              {/* ✅ Chart container with fixed height to prevent Recharts crash */}
              <div style={{ width: "100%", height: 350 }}>
                {stats.salesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.salesData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        strokeOpacity={0.2}
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar
                        dataKey="sales"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                    No sales data available for current period.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="col-xl-4">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-header bg-transparent p-4 border-0">
              <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <TrendingUp size={18} className="text-primary" /> Recent Orders
              </h6>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <tbody className="border-top-0">
                  {orders.length > 0 ? (
                    orders.slice(0, 6).map((order) => (
                      <tr key={order._id}>
                        <td className="ps-4">
                          <div className="small fw-bold text-primary">
                            #
                            {order._id
                              .substring(order._id.length - 6)
                              .toUpperCase()}
                          </div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="small">{order.user?.name || "Guest"}</td>
                        <td className="pe-4 text-end fw-bold small">
                          Rs. {order.totalPrice?.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-5 text-muted">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock & Inventory Logic */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <Bell size={18} className="text-danger" /> Critical Stock Levels
              </h6>
            </div>
            <div className="card-body pt-0 px-4">
              {loadingLow ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-danger" />
                </div>
              ) : lowStock.length === 0 ? (
                <div className="text-center py-4 text-success small fw-bold">
                  All stock levels healthy
                </div>
              ) : (
                lowStock.slice(0, 5).map((item) => (
                  <div
                    key={item._id}
                    className="d-flex justify-content-between align-items-center p-2 bg-danger bg-opacity-10 rounded mb-2 border border-danger border-opacity-10"
                  >
                    <span className="small fw-bold">{item.name}</span>
                    <span className="badge bg-danger">
                      {item.countInStock || item.quantity} Left
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <Activity size={18} className="text-info" /> Inventory Summary
              </h6>
              <a
                href="/admin/medicines"
                className="btn btn-sm btn-link text-decoration-none p-0"
              >
                Manage Items
              </a>
            </div>
            <div className="card-body pt-0 px-4">
              {medicines.slice(0, 5).map((med) => (
                <div
                  key={med._id}
                  className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-light"
                >
                  <div className="small">
                    <div className="fw-bold">{med.name}</div>
                    <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                      {med.category}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="small fw-bold">Rs. {med.price}</div>
                    <div
                      className={`small ${
                        med.countInStock < 10 ? "text-danger" : "text-success"
                      }`}
                    >
                      Stock: {med.countInStock || med.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
