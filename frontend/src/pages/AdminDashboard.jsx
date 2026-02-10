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
// import api from "../services/api"; // ✅ Ensure path is correct

// // SORT HOOK
// function useSortableData(items, config = null) {
//   const [sortConfig, setSortConfig] = useState(config);

//   const sortedItems = useMemo(() => {
//     const sortable = Array.isArray(items) ? [...items] : [];
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
//   // ✅ INITIAL STATE: All values set to zero/empty
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
//   const [darkMode, setDarkMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [globalError, setGlobalError] = useState("");

//   // table state (Preserved logic)
//   const [ordersQuery, setOrdersQuery] = useState("");
//   const [ordersPage, setOrdersPage] = useState(1);
//   const [ordersPageSize, setOrdersPageSize] = useState(10);
//   const [medQuery, setMedQuery] = useState("");
//   const [medPage, setMedPage] = useState(1);
//   const [medPageSize, setMedPageSize] = useState(10);

//   // Fetch LIVE data
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setLoadingLow(true);

//         // ✅ 1. Fetch Real Data from Standard Endpoints
//         // We use Promise.all to fetch everything in parallel for speed
//         const [usersRes, medsRes, doctorsRes, ordersRes] = await Promise.all([
//           api.get("/users"),
//           api.get("/medicines"),
//           api.get("/doctors"),
//           api.get("/orders"),
//         ]);

//         // ✅ 2. Extract Arrays safely
//         const users = Array.isArray(usersRes.data || usersRes)
//           ? usersRes.data || usersRes
//           : [];
//         const meds = Array.isArray(medsRes.data || medsRes)
//           ? medsRes.data || medsRes
//           : medsRes.medicines || [];
//         const docs = Array.isArray(doctorsRes.data || doctorsRes)
//           ? doctorsRes.data || doctorsRes
//           : [];
//         const allOrders = Array.isArray(ordersRes.data || ordersRes)
//           ? ordersRes.data || ordersRes
//           : [];

//         // ✅ 3. Calculate Real-Time Stats
//         const totalRevenue = allOrders.reduce(
//           (acc, order) => acc + (order.totalPrice || 0),
//           0
//         );

//         // ✅ 4. Generate Sales Chart Data (Group by Month)
//         const salesMap = {};
//         allOrders.forEach((order) => {
//           const date = new Date(order.createdAt);
//           const month = date.toLocaleString("default", { month: "short" });
//           salesMap[month] = (salesMap[month] || 0) + (order.totalPrice || 0);
//         });

//         // Convert map to array for Recharts
//         const salesChartData = Object.keys(salesMap).map((key) => ({
//           month: key,
//           sales: salesMap[key],
//         }));

//         // ✅ 5. Filter Low Stock Items
//         const lowStockItems = meds.filter((m) => (m.countInStock || 0) < 15);

//         // Update State
//         setStats({
//           users: users.length,
//           medicines: meds.length,
//           doctors: docs.length,
//           orders: allOrders.length,
//           revenue: totalRevenue,
//           salesData: salesChartData.length > 0 ? salesChartData : [],
//         });

//         setOrders(allOrders);
//         setMedicines(meds);
//         setLowStock(lowStockItems);
//         setGlobalError("");
//       } catch (err) {
//         console.error("Dashboard fetch error:", err);
//         setGlobalError("Failed to fetch live database records.");
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
//         Syncing with Database...
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//         <div>
//           <h1 className="h3 mb-1 fw-bold">Live System Overview</h1>
//           <p className="mb-0 text-muted">Real-time database statistics</p>
//         </div>
//         {globalError && (
//           <div className="alert alert-danger small mb-0 flex-grow-1 py-2">
//             {globalError}
//           </div>
//         )}
//       </div>

//       {/* Stats Cards */}
//       <div className="row g-3 mb-5">
//         {[
//           {
//             title: "Total Users",
//             value: stats.users,
//             icon: Users,
//             color: "primary",
//           },
//           {
//             title: "Medicines",
//             value: stats.medicines,
//             icon: Package,
//             color: "success",
//           },
//           {
//             title: "Doctors",
//             value: stats.doctors,
//             icon: Stethoscope,
//             color: "info",
//           },
//           {
//             title: "Orders",
//             value: stats.orders,
//             icon: ShoppingCart,
//             color: "warning",
//           },
//           {
//             title: "Revenue",
//             value: `Rs. ${Number(stats.revenue || 0).toLocaleString()}`,
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
//                 className={`card h-100 shadow-sm border-0 rounded-3 ${
//                   darkMode ? "bg-dark text-white" : "bg-white"
//                 }`}
//               >
//                 <div className="card-body d-flex flex-column p-3 text-center">
//                   <div
//                     className={`p-2 rounded-circle bg-${card.color} bg-opacity-10 mx-auto mb-2`}
//                   >
//                     <Icon size={24} className={`text-${card.color}`} />
//                   </div>
//                   <span className="small text-muted text-uppercase fw-bold mb-1">
//                     {card.title}
//                   </span>
//                   <div className="h4 mb-0 fw-bold">{card.value}</div>
//                 </div>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Charts & Quick Stats */}
//       <div className="row g-4 mb-5">
//         <div className="col-xl-8">
//           <div
//             className={`card shadow-sm border-0 rounded-4 ${
//               darkMode ? "bg-dark text-white" : "bg-white"
//             }`}
//           >
//             <div className="card-header border-0 pb-0 bg-transparent p-4">
//               <h5 className="fw-bold mb-0">Monthly Revenue Analytics</h5>
//             </div>
//             <div className="card-body">
//               {/* ✅ Chart container with fixed height */}
//               <div style={{ width: "100%", height: 350 }}>
//                 {stats.salesData.length > 0 ? (
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={stats.salesData}>
//                       <CartesianGrid
//                         strokeDasharray="3 3"
//                         vertical={false}
//                         strokeOpacity={0.2}
//                       />
//                       <XAxis
//                         dataKey="month"
//                         axisLine={false}
//                         tickLine={false}
//                       />
//                       <YAxis axisLine={false} tickLine={false} />
//                       <Tooltip />
//                       <Bar
//                         dataKey="sales"
//                         fill="#10b981"
//                         radius={[4, 4, 0, 0]}
//                         barSize={40}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 ) : (
//                   <div className="d-flex align-items-center justify-content-center h-100 text-muted">
//                     No sales data available for current period.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Orders Overview */}
//         <div className="col-xl-4">
//           <div className="card shadow-sm border-0 rounded-4 h-100">
//             <div className="card-header bg-transparent p-4 border-0">
//               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
//                 <TrendingUp size={18} className="text-primary" /> Recent Orders
//               </h6>
//             </div>
//             <div className="table-responsive">
//               <table className="table table-hover align-middle mb-0">
//                 <tbody className="border-top-0">
//                   {orders.length > 0 ? (
//                     orders.slice(0, 6).map((order) => (
//                       <tr key={order._id}>
//                         <td className="ps-4">
//                           <div className="small fw-bold text-primary">
//                             #
//                             {order._id
//                               .substring(order._id.length - 6)
//                               .toUpperCase()}
//                           </div>
//                           <div
//                             className="text-muted"
//                             style={{ fontSize: "0.7rem" }}
//                           >
//                             {new Date(order.createdAt).toLocaleDateString()}
//                           </div>
//                         </td>
//                         <td className="small">{order.user?.name || "Guest"}</td>
//                         <td className="pe-4 text-end fw-bold small">
//                           Rs. {order.totalPrice?.toFixed(2)}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="3" className="text-center py-5 text-muted">
//                         No orders found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Low Stock & Inventory Logic */}
//       <div className="row g-4 mb-4">
//         <div className="col-lg-6">
//           <div className="card shadow-sm border-0 rounded-4 h-100">
//             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
//                 <Bell size={18} className="text-danger" /> Critical Stock Levels
//               </h6>
//             </div>
//             <div className="card-body pt-0 px-4">
//               {loadingLow ? (
//                 <div className="text-center py-4">
//                   <div className="spinner-border spinner-border-sm text-danger" />
//                 </div>
//               ) : lowStock.length === 0 ? (
//                 <div className="text-center py-4 text-success small fw-bold">
//                   All stock levels healthy
//                 </div>
//               ) : (
//                 lowStock.slice(0, 5).map((item) => (
//                   <div
//                     key={item._id}
//                     className="d-flex justify-content-between align-items-center p-2 bg-danger bg-opacity-10 rounded mb-2 border border-danger border-opacity-10"
//                   >
//                     <span className="small fw-bold">{item.name}</span>
//                     <span className="badge bg-danger">
//                       {item.countInStock || item.quantity} Left
//                     </span>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="col-lg-6">
//           <div className="card shadow-sm border-0 rounded-4 h-100">
//             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
//                 <Activity size={18} className="text-info" /> Inventory Summary
//               </h6>
//               <a
//                 href="/admin/medicines"
//                 className="btn btn-sm btn-link text-decoration-none p-0"
//               >
//                 Manage Items
//               </a>
//             </div>
//             <div className="card-body pt-0 px-4">
//               {medicines.slice(0, 5).map((med) => (
//                 <div
//                   key={med._id}
//                   className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-light"
//                 >
//                   <div className="small">
//                     <div className="fw-bold">{med.name}</div>
//                     <div className="text-muted" style={{ fontSize: "0.7rem" }}>
//                       {med.category}
//                     </div>
//                   </div>
//                   <div className="text-end">
//                     <div className="small fw-bold">Rs. {med.price}</div>
//                     <div
//                       className={`small ${
//                         med.countInStock < 10 ? "text-danger" : "text-success"
//                       }`}
//                     >
//                       Stock: {med.countInStock || med.quantity}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminDashboard;

// import React, { useEffect, useState } from "react";
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
// } from "lucide-react";
// import { motion } from "framer-motion";
// import api from "../services/api"; // ✅ Adjusted path based on standard structure

// const AdminDashboard = () => {
//   // ✅ STATE MANAGEMENT
//   const [stats, setStats] = useState({
//     users: 0,
//     medicines: 0,
//     doctors: 0,
//     orders: 0,
//     revenue: 0,
//     salesData: [],
//   });

//   const [recentOrders, setRecentOrders] = useState([]);
//   const [medicines, setMedicines] = useState([]); // For inventory list
//   const [lowStock, setLowStock] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ✅ FETCH DATA EFFECT
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         // 1. Parallel Data Fetching
//         // We use Promise.allSettled to ensure one failure doesn't crash the whole dashboard
//         const results = await Promise.allSettled([
//           api.get("/users"),
//           api.get("/medicines"),
//           api.get("/doctors"),
//           api.get("/orders"),
//         ]);

//         // 2. Helper to safely extract data from Promise results
//         const getData = (index) => {
//           if (results[index].status === "fulfilled") {
//             const res = results[index].value;
//             // Handle both { data: [...] } and [...] formats
//             return Array.isArray(res.data)
//               ? res.data
//               : Array.isArray(res)
//               ? res
//               : res.medicines || []; // Fallback for specific object structures
//           }
//           console.warn(`Failed to fetch data for index ${index}`);
//           return [];
//         };

//         const usersData = getData(0);
//         const medsData = getData(1);
//         const doctorsData = getData(2);
//         const ordersData = getData(3);

//         // 3. Calculate Revenue
//         const totalRevenue = ordersData.reduce(
//           (acc, order) => acc + (order.totalPrice || 0),
//           0
//         );

//         // 4. Generate Sales Chart Data (Grouped by Month)
//         const salesMap = {};
//         ordersData.forEach((order) => {
//           if (order.createdAt) {
//             const date = new Date(order.createdAt);
//             const month = date.toLocaleString("default", { month: "short" });
//             salesMap[month] = (salesMap[month] || 0) + (order.totalPrice || 0);
//           }
//         });

//         // Sort months chronologically implies complex logic, for now we map objects
//         const salesChartData = Object.keys(salesMap).map((key) => ({
//           month: key,
//           sales: salesMap[key],
//         }));

//         // 5. Filter Low Stock (Threshold < 15)
//         const lowStockItems = medsData.filter(
//           (m) => (m.countInStock || 0) < 15
//         );

//         // 6. Update State
//         setStats({
//           users: usersData.length,
//           medicines: medsData.length,
//           doctors: doctorsData.length,
//           orders: ordersData.length,
//           revenue: totalRevenue,
//           salesData: salesChartData,
//         });

//         setRecentOrders(
//           ordersData
//             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//             .slice(0, 6)
//         ); // Newest 6
//         setMedicines(medsData);
//         setLowStock(lowStockItems);
//         setError("");
//       } catch (err) {
//         console.error("Dashboard Error:", err);
//         setError("Failed to load real-time system data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="d-flex flex-column align-items-center justify-content-center vh-100">
//         <div className="spinner-border text-primary mb-3" role="status" />
//         <span className="text-muted fw-semibold">Syncing Dashboard...</span>
//       </div>
//     );
//   }

//   // ✅ RESPONSIVE STAT CARDS CONFIG
//   const statCards = [
//     { title: "Total Users", value: stats.users, icon: Users, color: "primary" },
//     {
//       title: "Medicines",
//       value: stats.medicines,
//       icon: Package,
//       color: "success",
//     },
//     {
//       title: "Doctors",
//       value: stats.doctors,
//       icon: Stethoscope,
//       color: "info",
//     },
//     {
//       title: "Orders",
//       value: stats.orders,
//       icon: ShoppingCart,
//       color: "warning",
//     },
//     {
//       title: "Revenue",
//       value: `Rs. ${stats.revenue.toLocaleString()}`,
//       icon: DollarSign,
//       color: "danger",
//     },
//   ];

//   return (
//     <div className="container-fluid p-3 p-md-4 animate-fade-in">
//       {/* Header */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
//         <div>
//           <h1 className="h3 mb-1 fw-bold text-dark">System Overview</h1>
//           <p className="mb-0 text-muted small">Real-time data analytics</p>
//         </div>
//         {error && (
//           <div className="alert alert-danger py-2 px-3 small mb-0 rounded-3 shadow-sm">
//             {error}
//           </div>
//         )}
//       </div>

//       {/* ✅ RESPONSIVE STATS GRID */}
//       <div className="row g-3 mb-5">
//         {statCards.map((card, index) => {
//           const Icon = card.icon;
//           return (
//             <motion.div
//               key={card.title}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               // Responsive Classes: 2 per row on mobile (col-6), 3 on tablet (col-md-4), 5 on desktop (col-xl)
//               className="col-6 col-md-4 col-xl"
//             >
//               <div className="card h-100 shadow-sm border-0 rounded-4 hover-lift">
//                 <div className="card-body p-3 d-flex flex-column align-items-center text-center justify-content-center">
//                   <div
//                     className={`p-2 rounded-circle bg-${card.color} bg-opacity-10 mb-2`}
//                   >
//                     <Icon size={24} className={`text-${card.color}`} />
//                   </div>
//                   <span
//                     className="small text-muted text-uppercase fw-bold mb-1"
//                     style={{ fontSize: "0.7rem" }}
//                   >
//                     {card.title}
//                   </span>
//                   <div className="h5 mb-0 fw-bold text-dark">{card.value}</div>
//                 </div>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* ✅ CHARTS & RECENT ORDERS */}
//       <div className="row g-4 mb-5">
//         {/* Revenue Chart */}
//         <div className="col-xl-8 col-lg-7">
//           <div className="card shadow-sm border-0 rounded-4 h-100">
//             <div className="card-header bg-transparent p-4 border-0">
//               <h5 className="fw-bold mb-0 text-dark">Monthly Revenue</h5>
//             </div>
//             <div className="card-body px-2">
//               <div style={{ width: "100%", height: 350 }}>
//                 {stats.salesData.length > 0 ? (
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={stats.salesData}>
//                       <CartesianGrid
//                         strokeDasharray="3 3"
//                         vertical={false}
//                         strokeOpacity={0.1}
//                       />
//                       <XAxis
//                         dataKey="month"
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fill: "#6c757d", fontSize: 12 }}
//                       />
//                       <YAxis
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fill: "#6c757d", fontSize: 12 }}
//                       />
//                       <Tooltip
//                         contentStyle={{
//                           borderRadius: "12px",
//                           border: "none",
//                           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                         }}
//                         cursor={{ fill: "transparent" }}
//                       />
//                       <Bar
//                         dataKey="sales"
//                         fill="#10b981"
//                         radius={[6, 6, 0, 0]}
//                         barSize={32}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 ) : (
//                   <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
//                     No sales data recorded yet.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Orders Table */}
//         <div className="col-xl-4 col-lg-5">
//           <div className="card shadow-sm border-0 rounded-4 h-100">
//             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
//                 <TrendingUp size={18} className="text-primary" /> Recent Orders
//               </h6>
//             </div>
//             <div className="table-responsive">
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="bg-light small">
//                   <tr>
//                     <th className="ps-4 border-0 text-muted fw-normal">ID</th>
//                     <th className="border-0 text-muted fw-normal">Customer</th>
//                     <th className="pe-4 text-end border-0 text-muted fw-normal">
//                       Amount
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="border-top-0">
//                   {recentOrders.length > 0 ? (
//                     recentOrders.map((order) => (
//                       <tr key={order._id}>
//                         <td className="ps-4 py-3">
//                           <span className="badge bg-light text-dark border">
//                             #
//                             {order._id
//                               .substring(order._id.length - 6)
//                               .toUpperCase()}
//                           </span>
//                         </td>
//                         <td
//                           className="small text-truncate"
//                           style={{ maxWidth: "120px" }}
//                         >
//                           {order.user?.name || "Guest"}
//                           <div
//                             className="text-muted"
//                             style={{ fontSize: "0.65rem" }}
//                           >
//                             {new Date(order.createdAt).toLocaleDateString()}
//                           </div>
//                         </td>
//                         <td className="pe-4 text-end fw-bold text-success small">
//                           Rs. {order.totalPrice?.toLocaleString()}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="3"
//                         className="text-center py-5 text-muted small"
//                       >
//                         No orders found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ✅ INVENTORY & ALERTS SECTION */}
//       <div className="row g-4 mb-4">
//         {/* Low Stock Alerts */}
//         <div className="col-lg-6">
//           <div className="card shadow-sm border-0 rounded-4 h-100">
//             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2 text-danger">
//                 <Bell size={18} /> Critical Stock
//               </h6>
//               <span className="badge bg-danger-subtle text-danger rounded-pill">
//                 {lowStock.length} Alerts
//               </span>
//             </div>
//             <div className="card-body pt-0 px-4 pb-4">
//               {lowStock.length === 0 ? (
//                 <div className="text-center py-5 text-success small fw-bold bg-success bg-opacity-10 rounded-3">
//                   <Package size={24} className="mb-2" />
//                   <br />
//                   All stock levels healthy
//                 </div>
//               ) : (
//                 <div className="d-flex flex-column gap-2">
//                   {lowStock.slice(0, 5).map((item) => (
//                     <div
//                       key={item._id}
//                       className="d-flex justify-content-between align-items-center p-3 bg-danger bg-opacity-10 rounded-3 border border-danger border-opacity-10"
//                     >
//                       <div>
//                         <div className="small fw-bold text-dark">
//                           {item.name}
//                         </div>
//                         <div
//                           className="text-muted"
//                           style={{ fontSize: "0.7rem" }}
//                         >
//                           Refill needed immediately
//                         </div>
//                       </div>
//                       <span className="badge bg-danger">
//                         {item.countInStock} Left
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Inventory Summary List */}
//         <div className="col-lg-6">
//           <div className="card shadow-sm border-0 rounded-4 h-100">
//             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
//                 <Activity size={18} className="text-info" /> Inventory Snapshot
//               </h6>
//             </div>
//             <div className="card-body pt-0 px-4">
//               {medicines.slice(0, 5).map((med) => (
//                 <div
//                   key={med._id}
//                   className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-light last:border-0"
//                 >
//                   <div className="d-flex align-items-center gap-3">
//                     <div className="bg-light p-2 rounded-3 d-none d-sm-block">
//                       <Package size={18} className="text-muted" />
//                     </div>
//                     <div>
//                       <div className="small fw-bold text-dark">{med.name}</div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.7rem" }}
//                       >
//                         {med.category}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-end">
//                     <div className="small fw-bold">Rs. {med.price}</div>
//                     <div
//                       className={`small fw-bold ${
//                         (med.countInStock || 0) < 15
//                           ? "text-danger"
//                           : "text-success"
//                       }`}
//                       style={{ fontSize: "0.7rem" }}
//                     >
//                       {med.countInStock || 0} Units
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {medicines.length === 0 && (
//                 <div className="text-center py-4 text-muted small">
//                   No medicines found.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


// import React, { useEffect, useState } from "react";
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
// } from "lucide-react";
// import { motion } from "framer-motion";
// import api from "../services/api";

// const AdminDashboard = () => {
//   // ✅ STATE MANAGEMENT
//   const [stats, setStats] = useState({
//     users: 0,
//     medicines: 0,
//     doctors: 0,
//     orders: 0,
//     revenue: 0,
//     salesData: [],
//   });

//   const [recentOrders, setRecentOrders] = useState([]);
//   const [medicines, setMedicines] = useState([]);
//   const [lowStock, setLowStock] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ✅ FETCH DATA EFFECT
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         // 1. Parallel Data Fetching
//         const results = await Promise.allSettled([
//           api.get("/admin/users"),    // Updated endpoint
//           api.get("/medicines"),
//           api.get("/doctors"),
//           api.get("/orders"),         // Ensure this is admin route if protected
//         ]);

//         // 2. Helper to safely extract data
//         const getData = (index) => {
//           if (results[index].status === "fulfilled") {
//             const res = results[index].value;
//             return Array.isArray(res.data)
//               ? res.data
//               : Array.isArray(res)
//               ? res
//               : res.medicines || [];
//           }
//           console.warn(`Failed to fetch data for index ${index}`);
//           return [];
//         };

//         const usersData = getData(0);
//         const medsData = getData(1);
//         const doctorsData = getData(2);
//         const ordersData = getData(3);

//         // 3. Calculate Revenue
//         const totalRevenue = ordersData.reduce(
//           (acc, order) => acc + (order.totalPrice || 0),
//           0
//         );

//         // 4. Generate Sales Chart Data
//         const salesMap = {};
//         ordersData.forEach((order) => {
//           if (order.createdAt && order.isPaid) { // Only count paid orders
//             const date = new Date(order.createdAt);
//             const month = date.toLocaleString("default", { month: "short" });
//             salesMap[month] = (salesMap[month] || 0) + (order.totalPrice || 0);
//           }
//         });

//         const salesChartData = Object.keys(salesMap).map((key) => ({
//           month: key,
//           sales: salesMap[key],
//         }));

//         // 5. Filter Low Stock
//         const lowStockItems = medsData.filter(
//           (m) => (m.countInStock || 0) < 15
//         );

//         // 6. Update State
//         setStats({
//           users: usersData.length,
//           medicines: medsData.length,
//           doctors: doctorsData.length,
//           orders: ordersData.length,
//           revenue: totalRevenue,
//           salesData: salesChartData,
//         });

//         setRecentOrders(
//           ordersData
//             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//             .slice(0, 6)
//         );
//         setMedicines(medsData);
//         setLowStock(lowStockItems);
//         setError("");
//       } catch (err) {
//         console.error("Dashboard Error:", err);
//         setError("Failed to load real-time system data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="d-flex flex-column align-items-center justify-content-center vh-100">
//         <div className="spinner-border text-primary mb-3" role="status" />
//         <span className="text-muted fw-semibold">Syncing Dashboard...</span>
//       </div>
//     );
//   }

//   // ✅ RESPONSIVE STAT CARDS CONFIG
//   const statCards = [
//     { title: "Total Users", value: stats.users, icon: Users, color: "primary" },
//     {
//       title: "Medicines",
//       value: stats.medicines,
//       icon: Package,
//       color: "success",
//     },
//     {
//       title: "Doctors",
//       value: stats.doctors,
//       icon: Stethoscope,
//       color: "info",
//     },
//     {
//       title: "Orders",
//       value: stats.orders,
//       icon: ShoppingCart,
//       color: "warning",
//     },
//     {
//       title: "Revenue",
//       value: `NPR ${stats.revenue.toLocaleString()}`, // Updated Currency
//       icon: DollarSign,
//       color: "danger",
//     },
//   ];

//   return (
//     <div className="container-fluid p-3 p-md-4 animate-fade-in">
//       {/* Header */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
//         <div>
//           <h1 className="h3 mb-1 fw-bold text-dark">System Overview</h1>
//           <p className="mb-0 text-muted small">Real-time data analytics</p>
//         </div>
//         {error && (
//           <div className="alert alert-danger py-2 px-3 small mb-0 rounded-3 shadow-sm">
//             {error}
//           </div>
//         )}
//       </div>

//       {/* ✅ RESPONSIVE STATS GRID */}
//       <div className="row g-3 mb-5">
//         {statCards.map((card, index) => {
//           const Icon = card.icon;
//           return (
//             <motion.div
//               key={card.title}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               // Responsive Classes: 2 per row on mobile (col-6), 3 on tablet (col-md-4), 5 on desktop (col-xl)
//               className="col-6 col-md-4 col-xl"
//             >
//               <div className="card h-100 shadow-sm border-0 rounded-4 hover-lift">
//                 <div className="card-body p-3 d-flex flex-column align-items-center text-center justify-content-center">
//                   <div
//                     className={`p-2 rounded-circle bg-${card.color} bg-opacity-10 mb-2`}
//                   >
//                     <Icon size={24} className={`text-${card.color}`} />
//                   </div>
//                   <span
//                     className="small text-muted text-uppercase fw-bold mb-1"
//                     style={{ fontSize: "0.7rem" }}
//                   >
//                     {card.title}
//                   </span>
//                   <div className="h5 mb-0 fw-bold text-dark">{card.value}</div>
//                 </div>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* ✅ CHARTS & RECENT ORDERS */}
//       <div className="row g-4 mb-5">
//         {/* Revenue Chart */}
//         <div className="col-12 col-xl-8 col-lg-7"> {/* Adjusted col sizes */}
//           <div className="card shadow-sm border-0 rounded-4 h-100">
//             <div className="card-header bg-transparent p-4 border-0">
//               <h5 className="fw-bold mb-0 text-dark">Monthly Revenue</h5>
//             </div>
//             <div className="card-body px-2">
//               <div style={{ width: "100%", height: 350 }}>
//                 {stats.salesData.length > 0 ? (
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={stats.salesData}>
//                       <CartesianGrid
//                         strokeDasharray="3 3"
//                         vertical={false}
//                         strokeOpacity={0.1}
//                       />
//                       <XAxis
//                         dataKey="month"
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fill: "#6c757d", fontSize: 12 }}
//                       />
//                       <YAxis
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fill: "#6c757d", fontSize: 12 }}
//                       />
//                       <Tooltip
//                         contentStyle={{
//                           borderRadius: "12px",
//                           border: "none",
//                           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                         }}
//                         cursor={{ fill: "transparent" }}
//                       />
//                       <Bar
//                         dataKey="sales"
//                         fill="#10b981"
//                         radius={[6, 6, 0, 0]}
//                         barSize={32}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 ) : (
//                   <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
//                     No sales data recorded yet.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Orders Table */}
//         <div className="col-12 col-xl-4 col-lg-5"> {/* Adjusted col sizes */}
//           <div className="card shadow-sm border-0 rounded-4 h-100">
//             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
//                 <TrendingUp size={18} className="text-primary" /> Recent Orders
//               </h6>
//             </div>
//             <div className="table-responsive">
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="bg-light small">
//                   <tr>
//                     <th className="ps-4 border-0 text-muted fw-normal">ID</th>
//                     <th className="border-0 text-muted fw-normal">Customer</th>
//                     <th className="pe-4 text-end border-0 text-muted fw-normal">
//                       Amount
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="border-top-0">
//                   {recentOrders.length > 0 ? (
//                     recentOrders.map((order) => (
//                       <tr key={order._id}>
//                         <td className="ps-4 py-3">
//                           <span className="badge bg-light text-dark border">
//                             #
//                             {order._id
//                               .substring(order._id.length - 6)
//                               .toUpperCase()}
//                           </span>
//                         </td>
//                         <td
//                           className="small text-truncate"
//                           style={{ maxWidth: "120px" }}
//                         >
//                           {order.user?.name || "Guest"}
//                           <div
//                             className="text-muted"
//                             style={{ fontSize: "0.65rem" }}
//                           >
//                             {new Date(order.createdAt).toLocaleDateString()}
//                           </div>
//                         </td>
//                         <td className="pe-4 text-end fw-bold text-success small">
//                           NPR {order.totalPrice?.toLocaleString()} {/* Updated Currency */}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="3"
//                         className="text-center py-5 text-muted small"
//                       >
//                         No orders found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ✅ INVENTORY & ALERTS SECTION */}
//       <div className="row g-4 mb-4">
//         {/* Low Stock Alerts */}
//         <div className="col-12 col-lg-6"> {/* Full width on mobile/tablet */}
//           <div className="card shadow-sm border-0 rounded-4 h-100">
//             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2 text-danger">
//                 <Bell size={18} /> Critical Stock
//               </h6>
//               <span className="badge bg-danger-subtle text-danger rounded-pill">
//                 {lowStock.length} Alerts
//               </span>
//             </div>
//             <div className="card-body pt-0 px-4 pb-4">
//               {lowStock.length === 0 ? (
//                 <div className="text-center py-5 text-success small fw-bold bg-success bg-opacity-10 rounded-3">
//                   <Package size={24} className="mb-2" />
//                   <br />
//                   All stock levels healthy
//                 </div>
//               ) : (
//                 <div className="d-flex flex-column gap-2">
//                   {lowStock.slice(0, 5).map((item) => (
//                     <div
//                       key={item._id}
//                       className="d-flex justify-content-between align-items-center p-3 bg-danger bg-opacity-10 rounded-3 border border-danger border-opacity-10"
//                     >
//                       <div>
//                         <div className="small fw-bold text-dark">
//                           {item.name}
//                         </div>
//                         <div
//                           className="text-muted"
//                           style={{ fontSize: "0.7rem" }}
//                         >
//                           Refill needed immediately
//                         </div>
//                       </div>
//                       <span className="badge bg-danger">
//                         {item.countInStock} Left
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Inventory Summary List */}
//         <div className="col-12 col-lg-6"> {/* Full width on mobile/tablet */}
//           <div className="card shadow-sm border-0 rounded-4 h-100">
//             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
//                 <Activity size={18} className="text-info" /> Inventory Snapshot
//               </h6>
//             </div>
//             <div className="card-body pt-0 px-4">
//               {medicines.slice(0, 5).map((med) => (
//                 <div
//                   key={med._id}
//                   className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-light last:border-0"
//                 >
//                   <div className="d-flex align-items-center gap-3">
//                     <div className="bg-light p-2 rounded-3 d-none d-sm-block">
//                       <Package size={18} className="text-muted" />
//                     </div>
//                     <div>
//                       <div className="small fw-bold text-dark">{med.name}</div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.7rem" }}
//                       >
//                         {med.category}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-end">
//                     <div className="small fw-bold">NPR {med.price}</div> {/* Updated Currency */}
//                     <div
//                       className={`small fw-bold ${
//                         (med.countInStock || 0) < 15
//                           ? "text-danger"
//                           : "text-success"
//                       }`}
//                       style={{ fontSize: "0.7rem" }}
//                     >
//                       {med.countInStock || 0} Units
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {medicines.length === 0 && (
//                 <div className="text-center py-4 text-muted small">
//                   No medicines found.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;



import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    medicines: 0,
    doctors: 0,
    orders: 0,
    revenue: 0,
    salesData: [],
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // ✅ 1. Fetch Aggregated Stats (Fast & Accurate)
        const statsRes = await api.get("/admin/stats");
        const statsData = statsRes.data;

        // ✅ 2. Fetch Medicines for Inventory List (Fixing the 0 bug)
        // We fetch this separately to populate the "Inventory Snapshot" table
        const medsRes = await api.get("/medicines");
        // FIX: Handle both paginated ({ medicines: [...] }) and non-paginated ([...]) responses
        const medsData = medsRes.data.medicines || (Array.isArray(medsRes.data) ? medsRes.data : []);

        // 3. Process Low Stock Items (Threshold < 15)
        const lowStockItems = medsData.filter(
          (m) => (m.countInStock || 0) < 15
        );

        // 4. Update State with Real Data
        setStats({
          users: statsData.totalCustomers || 0,
          medicines: statsData.totalMedicines || 0, // Uses DB count, ignores pagination
          doctors: statsData.totalDoctors || 0,
          orders: statsData.totalOrders || 0,
          revenue: statsData.totalSales || 0,
          salesData: statsData.salesData || [],
        });

        // Use recent orders from stats API if available, otherwise empty
        setRecentOrders(statsData.recentOrders || []);
        
        setMedicines(medsData); // For the table list
        setLowStock(lowStockItems);
        setError("");
      } catch (err) {
        console.error("Dashboard Error:", err);
        setError("Failed to load real-time system data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary mb-3" role="status" />
        <span className="text-muted fw-semibold">Syncing Dashboard...</span>
      </div>
    );
  }

  const statCards = [
    { title: "Total Users", value: stats.users, icon: Users, color: "primary" },
    { title: "Medicines", value: stats.medicines, icon: Package, color: "success" },
    { title: "Doctors", value: stats.doctors, icon: Stethoscope, color: "info" },
    { title: "Orders", value: stats.orders, icon: ShoppingCart, color: "warning" },
    { 
      title: "Revenue", 
      value: `NPR ${stats.revenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: "danger" 
    },
  ];

  return (
    <div className="container-fluid p-3 p-md-4 animate-fade-in">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3 mb-1 fw-bold text-dark">System Overview</h1>
          <p className="mb-0 text-muted small">Real-time data analytics</p>
        </div>
        {error && (
          <div className="alert alert-danger py-2 px-3 small mb-0 rounded-3 shadow-sm">
            {error}
          </div>
        )}
      </div>

      {/* ✅ RESPONSIVE STATS GRID */}
      <div className="row g-3 mb-5">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="col-6 col-md-4 col-xl"
            >
              <div className="card h-100 shadow-sm border-0 rounded-4 hover-lift">
                <div className="card-body p-3 d-flex flex-column align-items-center text-center justify-content-center">
                  <div className={`p-2 rounded-circle bg-${card.color} bg-opacity-10 mb-2`}>
                    <Icon size={24} className={`text-${card.color}`} />
                  </div>
                  <span className="small text-muted text-uppercase fw-bold mb-1" style={{ fontSize: "0.7rem" }}>
                    {card.title}
                  </span>
                  <div className="h5 mb-0 fw-bold text-dark">{card.value}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ✅ CHARTS & RECENT ORDERS */}
      <div className="row g-4 mb-5">
        {/* Revenue Chart */}
        <div className="col-12 col-xl-8 col-lg-7">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-header bg-transparent p-4 border-0">
              <h5 className="fw-bold mb-0 text-dark">Monthly Revenue</h5>
            </div>
            <div className="card-body px-2">
              <div style={{ width: "100%", height: 350 }}>
                {stats.salesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.salesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6c757d", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6c757d", fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} cursor={{ fill: "transparent" }} />
                      <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
                    No sales data recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="col-12 col-xl-4 col-lg-5">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <TrendingUp size={18} className="text-primary" /> Recent Orders
              </h6>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light small">
                  <tr>
                    <th className="ps-4 border-0 text-muted fw-normal">ID</th>
                    <th className="border-0 text-muted fw-normal">Customer</th>
                    <th className="pe-4 text-end border-0 text-muted fw-normal">Amount</th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="ps-4 py-3">
                          <span className="badge bg-light text-dark border">
                            #{order._id.substring(order._id.length - 6).toUpperCase()}
                          </span>
                        </td>
                        <td className="small text-truncate" style={{ maxWidth: "120px" }}>
                          {order.user?.name || "Guest"}
                          <div className="text-muted" style={{ fontSize: "0.65rem" }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="pe-4 text-end fw-bold text-success small">
                          NPR {order.totalPrice?.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-5 text-muted small">
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

      {/* ✅ INVENTORY & ALERTS SECTION */}
      <div className="row g-4 mb-4">
        {/* Low Stock Alerts */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold d-flex align-items-center gap-2 text-danger">
                <Bell size={18} /> Critical Stock
              </h6>
              <span className="badge bg-danger-subtle text-danger rounded-pill">
                {lowStock.length} Alerts
              </span>
            </div>
            <div className="card-body pt-0 px-4 pb-4">
              {lowStock.length === 0 ? (
                <div className="text-center py-5 text-success small fw-bold bg-success bg-opacity-10 rounded-3">
                  <Package size={24} className="mb-2" />
                  <br /> All stock levels healthy
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {lowStock.slice(0, 5).map((item) => (
                    <div key={item._id} className="d-flex justify-content-between align-items-center p-3 bg-danger bg-opacity-10 rounded-3 border border-danger border-opacity-10">
                      <div>
                        <div className="small fw-bold text-dark">{item.name}</div>
                        <div className="text-muted" style={{ fontSize: "0.7rem" }}>Refill needed</div>
                      </div>
                      <span className="badge bg-danger">{item.countInStock} Left</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inventory Summary List */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <Activity size={18} className="text-info" /> Inventory Snapshot
              </h6>
            </div>
            <div className="card-body pt-0 px-4">
              {medicines.slice(0, 5).map((med) => (
                <div key={med._id} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-light last:border-0">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2 rounded-3 d-none d-sm-block">
                      <Package size={18} className="text-muted" />
                    </div>
                    <div>
                      <div className="small fw-bold text-dark">{med.name}</div>
                      <div className="text-muted" style={{ fontSize: "0.7rem" }}>{med.category}</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="small fw-bold">NPR {med.price}</div>
                    <div className={`small fw-bold ${ (med.countInStock || 0) < 15 ? "text-danger" : "text-success" }`} style={{ fontSize: "0.7rem" }}>
                      {med.countInStock || 0} Units
                    </div>
                  </div>
                </div>
              ))}
              {medicines.length === 0 && (
                <div className="text-center py-4 text-muted small">No medicines found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;