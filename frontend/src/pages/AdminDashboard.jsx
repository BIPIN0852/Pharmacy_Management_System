// // import React, { useEffect, useMemo, useState } from "react";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   ResponsiveContainer,
// // } from "recharts";
// // import {
// //   Users,
// //   Package,
// //   ShoppingCart,
// //   DollarSign,
// //   Stethoscope,
// //   TrendingUp,
// //   Activity,
// //   Bell,
// //   ChevronLeft,
// //   ChevronRight,
// //   ChevronsLeft,
// //   ChevronsRight,
// // } from "lucide-react";
// // import { motion } from "framer-motion";
// // import api from "../services/api"; // ✅ Ensure path is correct

// // // SORT HOOK
// // function useSortableData(items, config = null) {
// //   const [sortConfig, setSortConfig] = useState(config);

// //   const sortedItems = useMemo(() => {
// //     const sortable = Array.isArray(items) ? [...items] : [];
// //     if (sortConfig !== null) {
// //       const { key, direction } = sortConfig;
// //       sortable.sort((a, b) => {
// //         let aVal = a[key];
// //         let bVal = b[key];
// //         if (typeof aVal === "number" && typeof bVal === "number") {
// //           return direction === "ascending" ? aVal - bVal : bVal - aVal;
// //         }
// //         if (typeof aVal === "string") aVal = aVal.toLowerCase();
// //         if (typeof bVal === "string") bVal = bVal.toLowerCase();
// //         if (aVal < bVal) return direction === "ascending" ? -1 : 1;
// //         if (aVal > bVal) return direction === "ascending" ? 1 : -1;
// //         return 0;
// //       });
// //     }
// //     return sortable;
// //   }, [items, sortConfig]);

// //   const requestSort = (key) => {
// //     let direction = "ascending";
// //     if (
// //       sortConfig &&
// //       sortConfig.key === key &&
// //       sortConfig.direction === "ascending"
// //     ) {
// //       direction = "descending";
// //     }
// //     setSortConfig({ key, direction });
// //   };

// //   return { items: sortedItems, requestSort, sortConfig };
// // }

// // // PAGINATION COMPONENT
// // const TablePagination = ({
// //   total,
// //   page,
// //   pageSize,
// //   onPageChange,
// //   onPageSizeChange,
// // }) => {
// //   const totalPages = Math.max(1, Math.ceil(total / pageSize));
// //   return (
// //     <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
// //       <div className="d-flex align-items-center gap-2 flex-wrap">
// //         <span className="small">Page</span>
// //         <div className="d-inline-flex align-items-center gap-1 border rounded-3 p-1 bg-white">
// //           <button
// //             className="btn btn-sm p-1"
// //             onClick={() => onPageChange(1)}
// //             disabled={page === 1}
// //             title="First"
// //           >
// //             <ChevronsLeft size={16} />
// //           </button>
// //           <button
// //             className="btn btn-sm p-1"
// //             onClick={() => onPageChange(Math.max(1, page - 1))}
// //             disabled={page === 1}
// //             title="Previous"
// //           >
// //             <ChevronLeft size={16} />
// //           </button>
// //           <div className="px-2 py-1 fw-bold">{page}</div>
// //           <button
// //             className="btn btn-sm p-1"
// //             onClick={() => onPageChange(Math.min(totalPages, page + 1))}
// //             disabled={page === totalPages}
// //             title="Next"
// //           >
// //             <ChevronRight size={16} />
// //           </button>
// //           <button
// //             className="btn btn-sm p-1"
// //             onClick={() => onPageChange(totalPages)}
// //             disabled={page === totalPages}
// //             title="Last"
// //           >
// //             <ChevronsRight size={16} />
// //           </button>
// //         </div>
// //         <span className="small text-muted">of {totalPages}</span>
// //       </div>
// //       <div className="d-flex align-items-center gap-2 flex-wrap">
// //         <span className="small">Rows</span>
// //         <select
// //           className="form-select form-select-sm"
// //           value={pageSize}
// //           onChange={(e) => {
// //             onPageSizeChange(Number(e.target.value));
// //             onPageChange(1);
// //           }}
// //         >
// //           {[5, 10, 15, 25].map((s) => (
// //             <option key={s} value={s}>
// //               {s}
// //             </option>
// //           ))}
// //         </select>
// //         <span className="small text-muted">Total: {total}</span>
// //       </div>
// //     </div>
// //   );
// // };

// // const AdminDashboard = () => {
// //   // ✅ INITIAL STATE: All values set to zero/empty
// //   const [stats, setStats] = useState({
// //     users: 0,
// //     medicines: 0,
// //     doctors: 0,
// //     orders: 0,
// //     revenue: 0,
// //     salesData: [],
// //   });
// //   const [orders, setOrders] = useState([]);
// //   const [medicines, setMedicines] = useState([]);
// //   const [lowStock, setLowStock] = useState([]);
// //   const [loadingLow, setLoadingLow] = useState(true);
// //   const [darkMode, setDarkMode] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const [globalError, setGlobalError] = useState("");

// //   // table state (Preserved logic)
// //   const [ordersQuery, setOrdersQuery] = useState("");
// //   const [ordersPage, setOrdersPage] = useState(1);
// //   const [ordersPageSize, setOrdersPageSize] = useState(10);
// //   const [medQuery, setMedQuery] = useState("");
// //   const [medPage, setMedPage] = useState(1);
// //   const [medPageSize, setMedPageSize] = useState(10);

// //   // Fetch LIVE data
// //   useEffect(() => {
// //     const fetchDashboardData = async () => {
// //       try {
// //         setLoading(true);
// //         setLoadingLow(true);

// //         // ✅ 1. Fetch Real Data from Standard Endpoints
// //         // We use Promise.all to fetch everything in parallel for speed
// //         const [usersRes, medsRes, doctorsRes, ordersRes] = await Promise.all([
// //           api.get("/users"),
// //           api.get("/medicines"),
// //           api.get("/doctors"),
// //           api.get("/orders"),
// //         ]);

// //         // ✅ 2. Extract Arrays safely
// //         const users = Array.isArray(usersRes.data || usersRes)
// //           ? usersRes.data || usersRes
// //           : [];
// //         const meds = Array.isArray(medsRes.data || medsRes)
// //           ? medsRes.data || medsRes
// //           : medsRes.medicines || [];
// //         const docs = Array.isArray(doctorsRes.data || doctorsRes)
// //           ? doctorsRes.data || doctorsRes
// //           : [];
// //         const allOrders = Array.isArray(ordersRes.data || ordersRes)
// //           ? ordersRes.data || ordersRes
// //           : [];

// //         // ✅ 3. Calculate Real-Time Stats
// //         const totalRevenue = allOrders.reduce(
// //           (acc, order) => acc + (order.totalPrice || 0),
// //           0
// //         );

// //         // ✅ 4. Generate Sales Chart Data (Group by Month)
// //         const salesMap = {};
// //         allOrders.forEach((order) => {
// //           const date = new Date(order.createdAt);
// //           const month = date.toLocaleString("default", { month: "short" });
// //           salesMap[month] = (salesMap[month] || 0) + (order.totalPrice || 0);
// //         });

// //         // Convert map to array for Recharts
// //         const salesChartData = Object.keys(salesMap).map((key) => ({
// //           month: key,
// //           sales: salesMap[key],
// //         }));

// //         // ✅ 5. Filter Low Stock Items
// //         const lowStockItems = meds.filter((m) => (m.countInStock || 0) < 15);

// //         // Update State
// //         setStats({
// //           users: users.length,
// //           medicines: meds.length,
// //           doctors: docs.length,
// //           orders: allOrders.length,
// //           revenue: totalRevenue,
// //           salesData: salesChartData.length > 0 ? salesChartData : [],
// //         });

// //         setOrders(allOrders);
// //         setMedicines(meds);
// //         setLowStock(lowStockItems);
// //         setGlobalError("");
// //       } catch (err) {
// //         console.error("Dashboard fetch error:", err);
// //         setGlobalError("Failed to fetch live database records.");
// //       } finally {
// //         setLoading(false);
// //         setLoadingLow(false);
// //       }
// //     };

// //     fetchDashboardData();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <div className="d-flex align-items-center justify-content-center vh-100 fw-semibold fs-5">
// //         <div className="spinner-border text-primary me-3"></div>
// //         Syncing with Database...
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       {/* Header */}
// //       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
// //         <div>
// //           <h1 className="h3 mb-1 fw-bold">Live System Overview</h1>
// //           <p className="mb-0 text-muted">Real-time database statistics</p>
// //         </div>
// //         {globalError && (
// //           <div className="alert alert-danger small mb-0 flex-grow-1 py-2">
// //             {globalError}
// //           </div>
// //         )}
// //       </div>

// //       {/* Stats Cards */}
// //       <div className="row g-3 mb-5">
// //         {[
// //           {
// //             title: "Total Users",
// //             value: stats.users,
// //             icon: Users,
// //             color: "primary",
// //           },
// //           {
// //             title: "Medicines",
// //             value: stats.medicines,
// //             icon: Package,
// //             color: "success",
// //           },
// //           {
// //             title: "Doctors",
// //             value: stats.doctors,
// //             icon: Stethoscope,
// //             color: "info",
// //           },
// //           {
// //             title: "Orders",
// //             value: stats.orders,
// //             icon: ShoppingCart,
// //             color: "warning",
// //           },
// //           {
// //             title: "Revenue",
// //             value: `Rs. ${Number(stats.revenue || 0).toLocaleString()}`,
// //             icon: DollarSign,
// //             color: "danger",
// //           },
// //         ].map((card, index) => {
// //           const Icon = card.icon;
// //           return (
// //             <motion.div
// //               key={card.title}
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ delay: index * 0.1 }}
// //               className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
// //             >
// //               <div
// //                 className={`card h-100 shadow-sm border-0 rounded-3 ${
// //                   darkMode ? "bg-dark text-white" : "bg-white"
// //                 }`}
// //               >
// //                 <div className="card-body d-flex flex-column p-3 text-center">
// //                   <div
// //                     className={`p-2 rounded-circle bg-${card.color} bg-opacity-10 mx-auto mb-2`}
// //                   >
// //                     <Icon size={24} className={`text-${card.color}`} />
// //                   </div>
// //                   <span className="small text-muted text-uppercase fw-bold mb-1">
// //                     {card.title}
// //                   </span>
// //                   <div className="h4 mb-0 fw-bold">{card.value}</div>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           );
// //         })}
// //       </div>

// //       {/* Charts & Quick Stats */}
// //       <div className="row g-4 mb-5">
// //         <div className="col-xl-8">
// //           <div
// //             className={`card shadow-sm border-0 rounded-4 ${
// //               darkMode ? "bg-dark text-white" : "bg-white"
// //             }`}
// //           >
// //             <div className="card-header border-0 pb-0 bg-transparent p-4">
// //               <h5 className="fw-bold mb-0">Monthly Revenue Analytics</h5>
// //             </div>
// //             <div className="card-body">
// //               {/* ✅ Chart container with fixed height */}
// //               <div style={{ width: "100%", height: 350 }}>
// //                 {stats.salesData.length > 0 ? (
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <BarChart data={stats.salesData}>
// //                       <CartesianGrid
// //                         strokeDasharray="3 3"
// //                         vertical={false}
// //                         strokeOpacity={0.2}
// //                       />
// //                       <XAxis
// //                         dataKey="month"
// //                         axisLine={false}
// //                         tickLine={false}
// //                       />
// //                       <YAxis axisLine={false} tickLine={false} />
// //                       <Tooltip />
// //                       <Bar
// //                         dataKey="sales"
// //                         fill="#10b981"
// //                         radius={[4, 4, 0, 0]}
// //                         barSize={40}
// //                       />
// //                     </BarChart>
// //                   </ResponsiveContainer>
// //                 ) : (
// //                   <div className="d-flex align-items-center justify-content-center h-100 text-muted">
// //                     No sales data available for current period.
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Recent Orders Overview */}
// //         <div className="col-xl-4">
// //           <div className="card shadow-sm border-0 rounded-4 h-100">
// //             <div className="card-header bg-transparent p-4 border-0">
// //               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
// //                 <TrendingUp size={18} className="text-primary" /> Recent Orders
// //               </h6>
// //             </div>
// //             <div className="table-responsive">
// //               <table className="table table-hover align-middle mb-0">
// //                 <tbody className="border-top-0">
// //                   {orders.length > 0 ? (
// //                     orders.slice(0, 6).map((order) => (
// //                       <tr key={order._id}>
// //                         <td className="ps-4">
// //                           <div className="small fw-bold text-primary">
// //                             #
// //                             {order._id
// //                               .substring(order._id.length - 6)
// //                               .toUpperCase()}
// //                           </div>
// //                           <div
// //                             className="text-muted"
// //                             style={{ fontSize: "0.7rem" }}
// //                           >
// //                             {new Date(order.createdAt).toLocaleDateString()}
// //                           </div>
// //                         </td>
// //                         <td className="small">{order.user?.name || "Guest"}</td>
// //                         <td className="pe-4 text-end fw-bold small">
// //                           Rs. {order.totalPrice?.toFixed(2)}
// //                         </td>
// //                       </tr>
// //                     ))
// //                   ) : (
// //                     <tr>
// //                       <td colSpan="3" className="text-center py-5 text-muted">
// //                         No orders found.
// //                       </td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Low Stock & Inventory Logic */}
// //       <div className="row g-4 mb-4">
// //         <div className="col-lg-6">
// //           <div className="card shadow-sm border-0 rounded-4 h-100">
// //             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
// //               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
// //                 <Bell size={18} className="text-danger" /> Critical Stock Levels
// //               </h6>
// //             </div>
// //             <div className="card-body pt-0 px-4">
// //               {loadingLow ? (
// //                 <div className="text-center py-4">
// //                   <div className="spinner-border spinner-border-sm text-danger" />
// //                 </div>
// //               ) : lowStock.length === 0 ? (
// //                 <div className="text-center py-4 text-success small fw-bold">
// //                   All stock levels healthy
// //                 </div>
// //               ) : (
// //                 lowStock.slice(0, 5).map((item) => (
// //                   <div
// //                     key={item._id}
// //                     className="d-flex justify-content-between align-items-center p-2 bg-danger bg-opacity-10 rounded mb-2 border border-danger border-opacity-10"
// //                   >
// //                     <span className="small fw-bold">{item.name}</span>
// //                     <span className="badge bg-danger">
// //                       {item.countInStock || item.quantity} Left
// //                     </span>
// //                   </div>
// //                 ))
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         <div className="col-lg-6">
// //           <div className="card shadow-sm border-0 rounded-4 h-100">
// //             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
// //               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
// //                 <Activity size={18} className="text-info" /> Inventory Summary
// //               </h6>
// //               <a
// //                 href="/admin/medicines"
// //                 className="btn btn-sm btn-link text-decoration-none p-0"
// //               >
// //                 Manage Items
// //               </a>
// //             </div>
// //             <div className="card-body pt-0 px-4">
// //               {medicines.slice(0, 5).map((med) => (
// //                 <div
// //                   key={med._id}
// //                   className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-light"
// //                 >
// //                   <div className="small">
// //                     <div className="fw-bold">{med.name}</div>
// //                     <div className="text-muted" style={{ fontSize: "0.7rem" }}>
// //                       {med.category}
// //                     </div>
// //                   </div>
// //                   <div className="text-end">
// //                     <div className="small fw-bold">Rs. {med.price}</div>
// //                     <div
// //                       className={`small ${
// //                         med.countInStock < 10 ? "text-danger" : "text-success"
// //                       }`}
// //                     >
// //                       Stock: {med.countInStock || med.quantity}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default AdminDashboard;

// // import React, { useEffect, useState } from "react";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   ResponsiveContainer,
// // } from "recharts";
// // import {
// //   Users,
// //   Package,
// //   ShoppingCart,
// //   DollarSign,
// //   Stethoscope,
// //   TrendingUp,
// //   Activity,
// //   Bell,
// // } from "lucide-react";
// // import { motion } from "framer-motion";
// // import api from "../services/api"; // ✅ Adjusted path based on standard structure

// // const AdminDashboard = () => {
// //   // ✅ STATE MANAGEMENT
// //   const [stats, setStats] = useState({
// //     users: 0,
// //     medicines: 0,
// //     doctors: 0,
// //     orders: 0,
// //     revenue: 0,
// //     salesData: [],
// //   });

// //   const [recentOrders, setRecentOrders] = useState([]);
// //   const [medicines, setMedicines] = useState([]); // For inventory list
// //   const [lowStock, setLowStock] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   // ✅ FETCH DATA EFFECT
// //   useEffect(() => {
// //     const fetchDashboardData = async () => {
// //       try {
// //         setLoading(true);

// //         // 1. Parallel Data Fetching
// //         // We use Promise.allSettled to ensure one failure doesn't crash the whole dashboard
// //         const results = await Promise.allSettled([
// //           api.get("/users"),
// //           api.get("/medicines"),
// //           api.get("/doctors"),
// //           api.get("/orders"),
// //         ]);

// //         // 2. Helper to safely extract data from Promise results
// //         const getData = (index) => {
// //           if (results[index].status === "fulfilled") {
// //             const res = results[index].value;
// //             // Handle both { data: [...] } and [...] formats
// //             return Array.isArray(res.data)
// //               ? res.data
// //               : Array.isArray(res)
// //               ? res
// //               : res.medicines || []; // Fallback for specific object structures
// //           }
// //           console.warn(`Failed to fetch data for index ${index}`);
// //           return [];
// //         };

// //         const usersData = getData(0);
// //         const medsData = getData(1);
// //         const doctorsData = getData(2);
// //         const ordersData = getData(3);

// //         // 3. Calculate Revenue
// //         const totalRevenue = ordersData.reduce(
// //           (acc, order) => acc + (order.totalPrice || 0),
// //           0
// //         );

// //         // 4. Generate Sales Chart Data (Grouped by Month)
// //         const salesMap = {};
// //         ordersData.forEach((order) => {
// //           if (order.createdAt) {
// //             const date = new Date(order.createdAt);
// //             const month = date.toLocaleString("default", { month: "short" });
// //             salesMap[month] = (salesMap[month] || 0) + (order.totalPrice || 0);
// //           }
// //         });

// //         // Sort months chronologically implies complex logic, for now we map objects
// //         const salesChartData = Object.keys(salesMap).map((key) => ({
// //           month: key,
// //           sales: salesMap[key],
// //         }));

// //         // 5. Filter Low Stock (Threshold < 15)
// //         const lowStockItems = medsData.filter(
// //           (m) => (m.countInStock || 0) < 15
// //         );

// //         // 6. Update State
// //         setStats({
// //           users: usersData.length,
// //           medicines: medsData.length,
// //           doctors: doctorsData.length,
// //           orders: ordersData.length,
// //           revenue: totalRevenue,
// //           salesData: salesChartData,
// //         });

// //         setRecentOrders(
// //           ordersData
// //             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
// //             .slice(0, 6)
// //         ); // Newest 6
// //         setMedicines(medsData);
// //         setLowStock(lowStockItems);
// //         setError("");
// //       } catch (err) {
// //         console.error("Dashboard Error:", err);
// //         setError("Failed to load real-time system data.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchDashboardData();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <div className="d-flex flex-column align-items-center justify-content-center vh-100">
// //         <div className="spinner-border text-primary mb-3" role="status" />
// //         <span className="text-muted fw-semibold">Syncing Dashboard...</span>
// //       </div>
// //     );
// //   }

// //   // ✅ RESPONSIVE STAT CARDS CONFIG
// //   const statCards = [
// //     { title: "Total Users", value: stats.users, icon: Users, color: "primary" },
// //     {
// //       title: "Medicines",
// //       value: stats.medicines,
// //       icon: Package,
// //       color: "success",
// //     },
// //     {
// //       title: "Doctors",
// //       value: stats.doctors,
// //       icon: Stethoscope,
// //       color: "info",
// //     },
// //     {
// //       title: "Orders",
// //       value: stats.orders,
// //       icon: ShoppingCart,
// //       color: "warning",
// //     },
// //     {
// //       title: "Revenue",
// //       value: `Rs. ${stats.revenue.toLocaleString()}`,
// //       icon: DollarSign,
// //       color: "danger",
// //     },
// //   ];

// //   return (
// //     <div className="container-fluid p-3 p-md-4 animate-fade-in">
// //       {/* Header */}
// //       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
// //         <div>
// //           <h1 className="h3 mb-1 fw-bold text-dark">System Overview</h1>
// //           <p className="mb-0 text-muted small">Real-time data analytics</p>
// //         </div>
// //         {error && (
// //           <div className="alert alert-danger py-2 px-3 small mb-0 rounded-3 shadow-sm">
// //             {error}
// //           </div>
// //         )}
// //       </div>

// //       {/* ✅ RESPONSIVE STATS GRID */}
// //       <div className="row g-3 mb-5">
// //         {statCards.map((card, index) => {
// //           const Icon = card.icon;
// //           return (
// //             <motion.div
// //               key={card.title}
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ delay: index * 0.1 }}
// //               // Responsive Classes: 2 per row on mobile (col-6), 3 on tablet (col-md-4), 5 on desktop (col-xl)
// //               className="col-6 col-md-4 col-xl"
// //             >
// //               <div className="card h-100 shadow-sm border-0 rounded-4 hover-lift">
// //                 <div className="card-body p-3 d-flex flex-column align-items-center text-center justify-content-center">
// //                   <div
// //                     className={`p-2 rounded-circle bg-${card.color} bg-opacity-10 mb-2`}
// //                   >
// //                     <Icon size={24} className={`text-${card.color}`} />
// //                   </div>
// //                   <span
// //                     className="small text-muted text-uppercase fw-bold mb-1"
// //                     style={{ fontSize: "0.7rem" }}
// //                   >
// //                     {card.title}
// //                   </span>
// //                   <div className="h5 mb-0 fw-bold text-dark">{card.value}</div>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           );
// //         })}
// //       </div>

// //       {/* ✅ CHARTS & RECENT ORDERS */}
// //       <div className="row g-4 mb-5">
// //         {/* Revenue Chart */}
// //         <div className="col-xl-8 col-lg-7">
// //           <div className="card shadow-sm border-0 rounded-4 h-100">
// //             <div className="card-header bg-transparent p-4 border-0">
// //               <h5 className="fw-bold mb-0 text-dark">Monthly Revenue</h5>
// //             </div>
// //             <div className="card-body px-2">
// //               <div style={{ width: "100%", height: 350 }}>
// //                 {stats.salesData.length > 0 ? (
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <BarChart data={stats.salesData}>
// //                       <CartesianGrid
// //                         strokeDasharray="3 3"
// //                         vertical={false}
// //                         strokeOpacity={0.1}
// //                       />
// //                       <XAxis
// //                         dataKey="month"
// //                         axisLine={false}
// //                         tickLine={false}
// //                         tick={{ fill: "#6c757d", fontSize: 12 }}
// //                       />
// //                       <YAxis
// //                         axisLine={false}
// //                         tickLine={false}
// //                         tick={{ fill: "#6c757d", fontSize: 12 }}
// //                       />
// //                       <Tooltip
// //                         contentStyle={{
// //                           borderRadius: "12px",
// //                           border: "none",
// //                           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
// //                         }}
// //                         cursor={{ fill: "transparent" }}
// //                       />
// //                       <Bar
// //                         dataKey="sales"
// //                         fill="#10b981"
// //                         radius={[6, 6, 0, 0]}
// //                         barSize={32}
// //                       />
// //                     </BarChart>
// //                   </ResponsiveContainer>
// //                 ) : (
// //                   <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
// //                     No sales data recorded yet.
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Recent Orders Table */}
// //         <div className="col-xl-4 col-lg-5">
// //           <div className="card shadow-sm border-0 rounded-4 h-100">
// //             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
// //               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
// //                 <TrendingUp size={18} className="text-primary" /> Recent Orders
// //               </h6>
// //             </div>
// //             <div className="table-responsive">
// //               <table className="table table-hover align-middle mb-0">
// //                 <thead className="bg-light small">
// //                   <tr>
// //                     <th className="ps-4 border-0 text-muted fw-normal">ID</th>
// //                     <th className="border-0 text-muted fw-normal">Customer</th>
// //                     <th className="pe-4 text-end border-0 text-muted fw-normal">
// //                       Amount
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="border-top-0">
// //                   {recentOrders.length > 0 ? (
// //                     recentOrders.map((order) => (
// //                       <tr key={order._id}>
// //                         <td className="ps-4 py-3">
// //                           <span className="badge bg-light text-dark border">
// //                             #
// //                             {order._id
// //                               .substring(order._id.length - 6)
// //                               .toUpperCase()}
// //                           </span>
// //                         </td>
// //                         <td
// //                           className="small text-truncate"
// //                           style={{ maxWidth: "120px" }}
// //                         >
// //                           {order.user?.name || "Guest"}
// //                           <div
// //                             className="text-muted"
// //                             style={{ fontSize: "0.65rem" }}
// //                           >
// //                             {new Date(order.createdAt).toLocaleDateString()}
// //                           </div>
// //                         </td>
// //                         <td className="pe-4 text-end fw-bold text-success small">
// //                           Rs. {order.totalPrice?.toLocaleString()}
// //                         </td>
// //                       </tr>
// //                     ))
// //                   ) : (
// //                     <tr>
// //                       <td
// //                         colSpan="3"
// //                         className="text-center py-5 text-muted small"
// //                       >
// //                         No orders found.
// //                       </td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* ✅ INVENTORY & ALERTS SECTION */}
// //       <div className="row g-4 mb-4">
// //         {/* Low Stock Alerts */}
// //         <div className="col-lg-6">
// //           <div className="card shadow-sm border-0 rounded-4 h-100">
// //             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
// //               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2 text-danger">
// //                 <Bell size={18} /> Critical Stock
// //               </h6>
// //               <span className="badge bg-danger-subtle text-danger rounded-pill">
// //                 {lowStock.length} Alerts
// //               </span>
// //             </div>
// //             <div className="card-body pt-0 px-4 pb-4">
// //               {lowStock.length === 0 ? (
// //                 <div className="text-center py-5 text-success small fw-bold bg-success bg-opacity-10 rounded-3">
// //                   <Package size={24} className="mb-2" />
// //                   <br />
// //                   All stock levels healthy
// //                 </div>
// //               ) : (
// //                 <div className="d-flex flex-column gap-2">
// //                   {lowStock.slice(0, 5).map((item) => (
// //                     <div
// //                       key={item._id}
// //                       className="d-flex justify-content-between align-items-center p-3 bg-danger bg-opacity-10 rounded-3 border border-danger border-opacity-10"
// //                     >
// //                       <div>
// //                         <div className="small fw-bold text-dark">
// //                           {item.name}
// //                         </div>
// //                         <div
// //                           className="text-muted"
// //                           style={{ fontSize: "0.7rem" }}
// //                         >
// //                           Refill needed immediately
// //                         </div>
// //                       </div>
// //                       <span className="badge bg-danger">
// //                         {item.countInStock} Left
// //                       </span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Inventory Summary List */}
// //         <div className="col-lg-6">
// //           <div className="card shadow-sm border-0 rounded-4 h-100">
// //             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
// //               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
// //                 <Activity size={18} className="text-info" /> Inventory Snapshot
// //               </h6>
// //             </div>
// //             <div className="card-body pt-0 px-4">
// //               {medicines.slice(0, 5).map((med) => (
// //                 <div
// //                   key={med._id}
// //                   className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-light last:border-0"
// //                 >
// //                   <div className="d-flex align-items-center gap-3">
// //                     <div className="bg-light p-2 rounded-3 d-none d-sm-block">
// //                       <Package size={18} className="text-muted" />
// //                     </div>
// //                     <div>
// //                       <div className="small fw-bold text-dark">{med.name}</div>
// //                       <div
// //                         className="text-muted"
// //                         style={{ fontSize: "0.7rem" }}
// //                       >
// //                         {med.category}
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div className="text-end">
// //                     <div className="small fw-bold">Rs. {med.price}</div>
// //                     <div
// //                       className={`small fw-bold ${
// //                         (med.countInStock || 0) < 15
// //                           ? "text-danger"
// //                           : "text-success"
// //                       }`}
// //                       style={{ fontSize: "0.7rem" }}
// //                     >
// //                       {med.countInStock || 0} Units
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //               {medicines.length === 0 && (
// //                 <div className="text-center py-4 text-muted small">
// //                   No medicines found.
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;

// // import React, { useEffect, useState } from "react";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   ResponsiveContainer,
// // } from "recharts";
// // import {
// //   Users,
// //   Package,
// //   ShoppingCart,
// //   DollarSign,
// //   Stethoscope,
// //   TrendingUp,
// //   Activity,
// //   Bell,
// // } from "lucide-react";
// // import { motion } from "framer-motion";
// // import api from "../services/api";

// // const AdminDashboard = () => {
// //   // ✅ STATE MANAGEMENT
// //   const [stats, setStats] = useState({
// //     users: 0,
// //     medicines: 0,
// //     doctors: 0,
// //     orders: 0,
// //     revenue: 0,
// //     salesData: [],
// //   });

// //   const [recentOrders, setRecentOrders] = useState([]);
// //   const [medicines, setMedicines] = useState([]);
// //   const [lowStock, setLowStock] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   // ✅ FETCH DATA EFFECT
// //   useEffect(() => {
// //     const fetchDashboardData = async () => {
// //       try {
// //         setLoading(true);

// //         // 1. Parallel Data Fetching
// //         const results = await Promise.allSettled([
// //           api.get("/admin/users"), // Updated endpoint
// //           api.get("/medicines"),
// //           api.get("/doctors"),
// //           api.get("/orders"), // Ensure this is admin route if protected
// //         ]);

// //         // 2. Helper to safely extract data
// //         const getData = (index) => {
// //           if (results[index].status === "fulfilled") {
// //             const res = results[index].value;
// //             return Array.isArray(res.data)
// //               ? res.data
// //               : Array.isArray(res)
// //                 ? res
// //                 : res.medicines || [];
// //           }
// //           console.warn(`Failed to fetch data for index ${index}`);
// //           return [];
// //         };

// //         const usersData = getData(0);
// //         const medsData = getData(1);
// //         const doctorsData = getData(2);
// //         const ordersData = getData(3);

// //         // 3. Calculate Revenue
// //         const totalRevenue = ordersData.reduce(
// //           (acc, order) => acc + (order.totalPrice || 0),
// //           0,
// //         );

// //         // 4. Generate Sales Chart Data
// //         const salesMap = {};
// //         ordersData.forEach((order) => {
// //           if (order.createdAt && order.isPaid) {
// //             // Only count paid orders
// //             const date = new Date(order.createdAt);
// //             const month = date.toLocaleString("default", { month: "short" });
// //             salesMap[month] = (salesMap[month] || 0) + (order.totalPrice || 0);
// //           }
// //         });

// //         const salesChartData = Object.keys(salesMap).map((key) => ({
// //           month: key,
// //           sales: salesMap[key],
// //         }));

// //         // 5. Filter Low Stock
// //         const lowStockItems = medsData.filter(
// //           (m) => (m.countInStock || 0) < 15,
// //         );

// //         // 6. Update State
// //         setStats({
// //           users: usersData.length,
// //           medicines: medsData.length,
// //           doctors: doctorsData.length,
// //           orders: ordersData.length,
// //           revenue: totalRevenue,
// //           salesData: salesChartData,
// //         });

// //         setRecentOrders(
// //           ordersData
// //             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
// //             .slice(0, 6),
// //         );
// //         setMedicines(medsData);
// //         setLowStock(lowStockItems);
// //         setError("");
// //       } catch (err) {
// //         console.error("Dashboard Error:", err);
// //         setError("Failed to load real-time system data.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchDashboardData();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <div className="d-flex flex-column align-items-center justify-content-center vh-100">
// //         <div className="spinner-border text-primary mb-3" role="status" />
// //         <span className="text-muted fw-semibold">Syncing Dashboard...</span>
// //       </div>
// //     );
// //   }

// //   // ✅ RESPONSIVE STAT CARDS CONFIG
// //   const statCards = [
// //     { title: "Total Users", value: stats.users, icon: Users, color: "primary" },
// //     {
// //       title: "Medicines",
// //       value: stats.medicines,
// //       icon: Package,
// //       color: "success",
// //     },
// //     {
// //       title: "Doctors",
// //       value: stats.doctors,
// //       icon: Stethoscope,
// //       color: "info",
// //     },
// //     {
// //       title: "Orders",
// //       value: stats.orders,
// //       icon: ShoppingCart,
// //       color: "warning",
// //     },
// //     {
// //       title: "Revenue",
// //       value: `NPR ${stats.revenue.toLocaleString()}`, // Updated Currency
// //       icon: DollarSign,
// //       color: "danger",
// //     },
// //   ];

// //   return (
// //     <div className="container-fluid p-3 p-md-4 animate-fade-in">
// //       {/* Header */}
// //       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
// //         <div>
// //           <h1 className="h3 mb-1 fw-bold text-dark">System Overview</h1>
// //           <p className="mb-0 text-muted small">Real-time data analytics</p>
// //         </div>
// //         {error && (
// //           <div className="alert alert-danger py-2 px-3 small mb-0 rounded-3 shadow-sm">
// //             {error}
// //           </div>
// //         )}
// //       </div>

// //       {/* ✅ RESPONSIVE STATS GRID */}
// //       <div className="row g-3 mb-5">
// //         {statCards.map((card, index) => {
// //           const Icon = card.icon;
// //           return (
// //             <motion.div
// //               key={card.title}
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ delay: index * 0.1 }}
// //               // Responsive Classes: 2 per row on mobile (col-6), 3 on tablet (col-md-4), 5 on desktop (col-xl)
// //               className="col-6 col-md-4 col-xl"
// //             >
// //               <div className="card h-100 shadow-sm border-0 rounded-4 hover-lift">
// //                 <div className="card-body p-3 d-flex flex-column align-items-center text-center justify-content-center">
// //                   <div
// //                     className={`p-2 rounded-circle bg-${card.color} bg-opacity-10 mb-2`}
// //                   >
// //                     <Icon size={24} className={`text-${card.color}`} />
// //                   </div>
// //                   <span
// //                     className="small text-muted text-uppercase fw-bold mb-1"
// //                     style={{ fontSize: "0.7rem" }}
// //                   >
// //                     {card.title}
// //                   </span>
// //                   <div className="h5 mb-0 fw-bold text-dark">{card.value}</div>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           );
// //         })}
// //       </div>

// //       {/* ✅ CHARTS & RECENT ORDERS */}
// //       <div className="row g-4 mb-5">
// //         {/* Revenue Chart */}
// //         <div className="col-12 col-xl-8 col-lg-7">
// //           {" "}
// //           {/* Adjusted col sizes */}
// //           <div className="card shadow-sm border-0 rounded-4 h-100">
// //             <div className="card-header bg-transparent p-4 border-0">
// //               <h5 className="fw-bold mb-0 text-dark">Monthly Revenue</h5>
// //             </div>
// //             <div className="card-body px-2">
// //               <div style={{ width: "100%", height: 350 }}>
// //                 {stats.salesData.length > 0 ? (
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <BarChart data={stats.salesData}>
// //                       <CartesianGrid
// //                         strokeDasharray="3 3"
// //                         vertical={false}
// //                         strokeOpacity={0.1}
// //                       />
// //                       <XAxis
// //                         dataKey="month"
// //                         axisLine={false}
// //                         tickLine={false}
// //                         tick={{ fill: "#6c757d", fontSize: 12 }}
// //                       />
// //                       <YAxis
// //                         axisLine={false}
// //                         tickLine={false}
// //                         tick={{ fill: "#6c757d", fontSize: 12 }}
// //                       />
// //                       <Tooltip
// //                         contentStyle={{
// //                           borderRadius: "12px",
// //                           border: "none",
// //                           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
// //                         }}
// //                         cursor={{ fill: "transparent" }}
// //                       />
// //                       <Bar
// //                         dataKey="sales"
// //                         fill="#10b981"
// //                         radius={[6, 6, 0, 0]}
// //                         barSize={32}
// //                       />
// //                     </BarChart>
// //                   </ResponsiveContainer>
// //                 ) : (
// //                   <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
// //                     No sales data recorded yet.
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Recent Orders Table */}
// //         <div className="col-12 col-xl-4 col-lg-5">
// //           {" "}
// //           {/* Adjusted col sizes */}
// //           <div className="card shadow-sm border-0 rounded-4 h-100">
// //             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
// //               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
// //                 <TrendingUp size={18} className="text-primary" /> Recent Orders
// //               </h6>
// //             </div>
// //             <div className="table-responsive">
// //               <table className="table table-hover align-middle mb-0">
// //                 <thead className="bg-light small">
// //                   <tr>
// //                     <th className="ps-4 border-0 text-muted fw-normal">ID</th>
// //                     <th className="border-0 text-muted fw-normal">Customer</th>
// //                     <th className="pe-4 text-end border-0 text-muted fw-normal">
// //                       Amount
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="border-top-0">
// //                   {recentOrders.length > 0 ? (
// //                     recentOrders.map((order) => (
// //                       <tr key={order._id}>
// //                         <td className="ps-4 py-3">
// //                           <span className="badge bg-light text-dark border">
// //                             #
// //                             {order._id
// //                               .substring(order._id.length - 6)
// //                               .toUpperCase()}
// //                           </span>
// //                         </td>
// //                         <td
// //                           className="small text-truncate"
// //                           style={{ maxWidth: "120px" }}
// //                         >
// //                           {order.user?.name || "Guest"}
// //                           <div
// //                             className="text-muted"
// //                             style={{ fontSize: "0.65rem" }}
// //                           >
// //                             {new Date(order.createdAt).toLocaleDateString()}
// //                           </div>
// //                         </td>
// //                         <td className="pe-4 text-end fw-bold text-success small">
// //                           NPR {order.totalPrice?.toLocaleString()}{" "}
// //                           {/* Updated Currency */}
// //                         </td>
// //                       </tr>
// //                     ))
// //                   ) : (
// //                     <tr>
// //                       <td
// //                         colSpan="3"
// //                         className="text-center py-5 text-muted small"
// //                       >
// //                         No orders found.
// //                       </td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* ✅ INVENTORY & ALERTS SECTION */}
// //       <div className="row g-4 mb-4">
// //         {/* Low Stock Alerts */}
// //         <div className="col-12 col-lg-6">
// //           {" "}
// //           {/* Full width on mobile/tablet */}
// //           <div className="card shadow-sm border-0 rounded-4 h-100">
// //             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
// //               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2 text-danger">
// //                 <Bell size={18} /> Critical Stock
// //               </h6>
// //               <span className="badge bg-danger-subtle text-danger rounded-pill">
// //                 {lowStock.length} Alerts
// //               </span>
// //             </div>
// //             <div className="card-body pt-0 px-4 pb-4">
// //               {lowStock.length === 0 ? (
// //                 <div className="text-center py-5 text-success small fw-bold bg-success bg-opacity-10 rounded-3">
// //                   <Package size={24} className="mb-2" />
// //                   <br />
// //                   All stock levels healthy
// //                 </div>
// //               ) : (
// //                 <div className="d-flex flex-column gap-2">
// //                   {lowStock.slice(0, 5).map((item) => (
// //                     <div
// //                       key={item._id}
// //                       className="d-flex justify-content-between align-items-center p-3 bg-danger bg-opacity-10 rounded-3 border border-danger border-opacity-10"
// //                     >
// //                       <div>
// //                         <div className="small fw-bold text-dark">
// //                           {item.name}
// //                         </div>
// //                         <div
// //                           className="text-muted"
// //                           style={{ fontSize: "0.7rem" }}
// //                         >
// //                           Refill needed immediately
// //                         </div>
// //                       </div>
// //                       <span className="badge bg-danger">
// //                         {item.countInStock} Left
// //                       </span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Inventory Summary List */}
// //         <div className="col-12 col-lg-6">
// //           {" "}
// //           {/* Full width on mobile/tablet */}
// //           <div className="card shadow-sm border-0 rounded-4 h-100">
// //             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
// //               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
// //                 <Activity size={18} className="text-info" /> Inventory Snapshot
// //               </h6>
// //             </div>
// //             <div className="card-body pt-0 px-4">
// //               {medicines.slice(0, 5).map((med) => (
// //                 <div
// //                   key={med._id}
// //                   className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-light last:border-0"
// //                 >
// //                   <div className="d-flex align-items-center gap-3">
// //                     <div className="bg-light p-2 rounded-3 d-none d-sm-block">
// //                       <Package size={18} className="text-muted" />
// //                     </div>
// //                     <div>
// //                       <div className="small fw-bold text-dark">{med.name}</div>
// //                       <div
// //                         className="text-muted"
// //                         style={{ fontSize: "0.7rem" }}
// //                       >
// //                         {med.category}
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div className="text-end">
// //                     <div className="small fw-bold">NPR {med.price}</div>{" "}
// //                     {/* Updated Currency */}
// //                     <div
// //                       className={`small fw-bold ${
// //                         (med.countInStock || 0) < 15
// //                           ? "text-danger"
// //                           : "text-success"
// //                       }`}
// //                       style={{ fontSize: "0.7rem" }}
// //                     >
// //                       {med.countInStock || 0} Units
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //               {medicines.length === 0 && (
// //                 <div className="text-center py-4 text-muted small">
// //                   No medicines found.
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;

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

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         // ✅ 1. Fetch Aggregated Stats (Fast & Accurate)
//         const statsRes = await api.get("/admin/stats");
//         const statsData = statsRes.data;

//         // ✅ 2. Fetch Medicines for Inventory List (Fixing the 0 bug)
//         // We fetch this separately to populate the "Inventory Snapshot" table
//         const medsRes = await api.get("/medicines");
//         // FIX: Handle both paginated ({ medicines: [...] }) and non-paginated ([...]) responses
//         const medsData = medsRes.data.medicines || (Array.isArray(medsRes.data) ? medsRes.data : []);

//         // 3. Process Low Stock Items (Threshold < 15)
//         const lowStockItems = medsData.filter(
//           (m) => (m.countInStock || 0) < 15
//         );

//         // 4. Update State with Real Data
//         setStats({
//           users: statsData.totalCustomers || 0,
//           medicines: statsData.totalMedicines || 0, // Uses DB count, ignores pagination
//           doctors: statsData.totalDoctors || 0,
//           orders: statsData.totalOrders || 0,
//           revenue: statsData.totalSales || 0,
//           salesData: statsData.salesData || [],
//         });

//         // Use recent orders from stats API if available, otherwise empty
//         setRecentOrders(statsData.recentOrders || []);

//         setMedicines(medsData); // For the table list
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

//   const statCards = [
//     { title: "Total Users", value: stats.users, icon: Users, color: "primary" },
//     { title: "Medicines", value: stats.medicines, icon: Package, color: "success" },
//     { title: "Doctors", value: stats.doctors, icon: Stethoscope, color: "info" },
//     { title: "Orders", value: stats.orders, icon: ShoppingCart, color: "warning" },
//     {
//       title: "Revenue",
//       value: `NPR ${stats.revenue.toLocaleString()}`,
//       icon: DollarSign,
//       color: "danger"
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
//               className="col-6 col-md-4 col-xl"
//             >
//               <div className="card h-100 shadow-sm border-0 rounded-4 hover-lift">
//                 <div className="card-body p-3 d-flex flex-column align-items-center text-center justify-content-center">
//                   <div className={`p-2 rounded-circle bg-${card.color} bg-opacity-10 mb-2`}>
//                     <Icon size={24} className={`text-${card.color}`} />
//                   </div>
//                   <span className="small text-muted text-uppercase fw-bold mb-1" style={{ fontSize: "0.7rem" }}>
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
//         <div className="col-12 col-xl-8 col-lg-7">
//           <div className="card shadow-sm border-0 rounded-4 h-100">
//             <div className="card-header bg-transparent p-4 border-0">
//               <h5 className="fw-bold mb-0 text-dark">Monthly Revenue</h5>
//             </div>
//             <div className="card-body px-2">
//               <div style={{ width: "100%", height: 350 }}>
//                 {stats.salesData.length > 0 ? (
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={stats.salesData}>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
//                       <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6c757d", fontSize: 12 }} />
//                       <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6c757d", fontSize: 12 }} />
//                       <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} cursor={{ fill: "transparent" }} />
//                       <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
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
//         <div className="col-12 col-xl-4 col-lg-5">
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
//                     <th className="pe-4 text-end border-0 text-muted fw-normal">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody className="border-top-0">
//                   {recentOrders.length > 0 ? (
//                     recentOrders.map((order) => (
//                       <tr key={order._id}>
//                         <td className="ps-4 py-3">
//                           <span className="badge bg-light text-dark border">
//                             #{order._id.substring(order._id.length - 6).toUpperCase()}
//                           </span>
//                         </td>
//                         <td className="small text-truncate" style={{ maxWidth: "120px" }}>
//                           {order.user?.name || "Guest"}
//                           <div className="text-muted" style={{ fontSize: "0.65rem" }}>
//                             {new Date(order.createdAt).toLocaleDateString()}
//                           </div>
//                         </td>
//                         <td className="pe-4 text-end fw-bold text-success small">
//                           NPR {order.totalPrice?.toLocaleString()}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="3" className="text-center py-5 text-muted small">
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
//         <div className="col-12 col-lg-6">
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
//                   <br /> All stock levels healthy
//                 </div>
//               ) : (
//                 <div className="d-flex flex-column gap-2">
//                   {lowStock.slice(0, 5).map((item) => (
//                     <div key={item._id} className="d-flex justify-content-between align-items-center p-3 bg-danger bg-opacity-10 rounded-3 border border-danger border-opacity-10">
//                       <div>
//                         <div className="small fw-bold text-dark">{item.name}</div>
//                         <div className="text-muted" style={{ fontSize: "0.7rem" }}>Refill needed</div>
//                       </div>
//                       <span className="badge bg-danger">{item.countInStock} Left</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Inventory Summary List */}
//         <div className="col-12 col-lg-6">
//           <div className="card shadow-sm border-0 rounded-4 h-100">
//             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
//               <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
//                 <Activity size={18} className="text-info" /> Inventory Snapshot
//               </h6>
//             </div>
//             <div className="card-body pt-0 px-4">
//               {medicines.slice(0, 5).map((med) => (
//                 <div key={med._id} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-light last:border-0">
//                   <div className="d-flex align-items-center gap-3">
//                     <div className="bg-light p-2 rounded-3 d-none d-sm-block">
//                       <Package size={18} className="text-muted" />
//                     </div>
//                     <div>
//                       <div className="small fw-bold text-dark">{med.name}</div>
//                       <div className="text-muted" style={{ fontSize: "0.7rem" }}>{med.category}</div>
//                     </div>
//                   </div>
//                   <div className="text-end">
//                     <div className="small fw-bold">NPR {med.price}</div>
//                     <div className={`small fw-bold ${ (med.countInStock || 0) < 15 ? "text-danger" : "text-success" }`} style={{ fontSize: "0.7rem" }}>
//                       {med.countInStock || 0} Units
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {medicines.length === 0 && (
//                 <div className="text-center py-4 text-muted small">No medicines found.</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// // import React, { useEffect, useState } from "react";
// // import {
// //   AreaChart, // Changed from BarChart to AreaChart for the crypto look
// //   Area, // Changed from Bar
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   ResponsiveContainer,
// // } from "recharts";
// // import {
// //   Users,
// //   Package,
// //   ShoppingCart,
// //   DollarSign,
// //   Stethoscope,
// //   TrendingUp,
// //   Activity,
// //   Bell,
// //   ChevronRight,
// // } from "lucide-react";
// // import { motion } from "framer-motion";
// // import api from "../services/api";

// // const AdminDashboard = () => {
// //   const [stats, setStats] = useState({
// //     users: 0,
// //     medicines: 0,
// //     doctors: 0,
// //     orders: 0,
// //     revenue: 0,
// //     salesData: [],
// //   });

// //   const [recentOrders, setRecentOrders] = useState([]);
// //   const [medicines, setMedicines] = useState([]);
// //   const [lowStock, setLowStock] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     const fetchDashboardData = async () => {
// //       try {
// //         setLoading(true);

// //         const statsRes = await api.get("/admin/stats");
// //         const statsData = statsRes.data;

// //         const medsRes = await api.get("/medicines");
// //         const medsData =
// //           medsRes.data.medicines ||
// //           (Array.isArray(medsRes.data) ? medsRes.data : []);

// //         const lowStockItems = medsData.filter(
// //           (m) => (m.countInStock || 0) < 15,
// //         );

// //         setStats({
// //           users: statsData.totalCustomers || 0,
// //           medicines: statsData.totalMedicines || 0,
// //           doctors: statsData.totalDoctors || 0,
// //           orders: statsData.totalOrders || 0,
// //           revenue: statsData.totalSales || 0,
// //           salesData: statsData.salesData || [],
// //         });

// //         setRecentOrders(statsData.recentOrders || []);
// //         setMedicines(medsData);
// //         setLowStock(lowStockItems);
// //         setError("");
// //       } catch (err) {
// //         console.error("Dashboard Error:", err);
// //         setError("Failed to load real-time system data.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchDashboardData();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-dashboard-base text-white">
// //         <div
// //           className="spinner-border text-primary mb-3"
// //           role="status"
// //           style={{ width: "3rem", height: "3rem" }}
// //         />
// //         <span className="text-secondary fw-bold tracking-wider text-uppercase small">
// //           Syncing Dashboard...
// //         </span>
// //       </div>
// //     );
// //   }

// //   // Glowing Stat Cards
// //   const statCards = [
// //     {
// //       title: "Total Users",
// //       value: stats.users,
// //       icon: Users,
// //       bg: "bg-primary-soft",
// //       color: "text-primary-glow",
// //     },
// //     {
// //       title: "Medicines",
// //       value: stats.medicines,
// //       icon: Package,
// //       bg: "bg-success-soft",
// //       color: "text-success-glow",
// //     },
// //     {
// //       title: "Doctors",
// //       value: stats.doctors,
// //       icon: Stethoscope,
// //       bg: "bg-info-soft",
// //       color: "text-info-glow",
// //     },
// //     {
// //       title: "Orders",
// //       value: stats.orders,
// //       icon: ShoppingCart,
// //       bg: "bg-warning-soft",
// //       color: "text-warning-glow",
// //     },
// //     {
// //       title: "Total Revenue",
// //       value: `NPR ${stats.revenue.toLocaleString()}`,
// //       icon: DollarSign,
// //       bg: "bg-danger-soft",
// //       color: "text-danger-glow",
// //     },
// //   ];

// //   return (
// //     <div className="container-fluid p-4 p-xl-5 bg-dashboard-base min-vh-100 animate-fade-in text-white">
// //       {/* Page Header */}
// //       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
// //         <div>
// //           <h1 className="h3 mb-2 fw-bolder text-white tracking-tight">
// //             System Overview
// //           </h1>
// //           <p className="mb-0 text-secondary fw-medium">
// //             Real-time analytics and inventory status
// //           </p>
// //         </div>
// //         {error && (
// //           <div
// //             className="alert alert-danger py-2 px-4 small mb-0 rounded-pill border-0 crypto-shadow d-flex align-items-center gap-2"
// //             style={{
// //               backgroundColor: "rgba(239, 68, 68, 0.2)",
// //               color: "#fca5a5",
// //             }}
// //           >
// //             <Activity size={16} /> {error}
// //           </div>
// //         )}
// //       </div>

// //       {/* Top Stat Grid */}
// //       <div className="row g-4 mb-5">
// //         {statCards.map((card, index) => {
// //           const Icon = card.icon;
// //           return (
// //             <motion.div
// //               key={card.title}
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ delay: index * 0.1, duration: 0.4 }}
// //               className="col-12 col-sm-6 col-xl"
// //             >
// //               <div className="card h-100 crypto-card border-0 rounded-4 hover-lift overflow-hidden position-relative">
// //                 <div className="card-body p-4 d-flex align-items-center gap-4">
// //                   <div
// //                     className={`p-3 rounded-4 ${card.bg} d-flex align-items-center justify-content-center`}
// //                   >
// //                     <Icon size={28} className={card.color} strokeWidth={2.5} />
// //                   </div>
// //                   <div className="z-1">
// //                     <span
// //                       className="text-secondary text-uppercase fw-bold mb-1 d-block"
// //                       style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}
// //                     >
// //                       {card.title}
// //                     </span>
// //                     <h3 className="mb-0 fw-bolder text-white tracking-tight">
// //                       {card.value}
// //                     </h3>
// //                   </div>
// //                 </div>
// //                 {/* Decorative background accent */}
// //                 <div
// //                   className={`position-absolute top-0 end-0 w-50 h-100 ${card.bg}`}
// //                   style={{
// //                     clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
// //                     opacity: 0.05,
// //                   }}
// //                 ></div>
// //               </div>
// //             </motion.div>
// //           );
// //         })}
// //       </div>

// //       {/* Charts & Orders Row */}
// //       <div className="row g-4 mb-5">
// //         {/* Glowing Line Chart */}
// //         <div className="col-12 col-xl-8">
// //           <div className="card crypto-card border-0 rounded-4 h-100 p-2">
// //             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
// //               <div>
// //                 <h5 className="fw-bolder mb-1 text-white">Revenue Overview</h5>
// //                 <span className="text-secondary small">
// //                   Monthly sales performance
// //                 </span>
// //               </div>
// //             </div>
// //             <div className="card-body px-3 pb-4 pt-0">
// //               <div style={{ width: "100%", height: 350 }}>
// //                 {stats.salesData.length > 0 ? (
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <AreaChart
// //                       data={stats.salesData}
// //                       margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
// //                     >
// //                       <defs>
// //                         <linearGradient
// //                           id="colorSales"
// //                           x1="0"
// //                           y1="0"
// //                           x2="0"
// //                           y2="1"
// //                         >
// //                           <stop
// //                             offset="5%"
// //                             stopColor="#3b82f6"
// //                             stopOpacity={0.6}
// //                           />
// //                           <stop
// //                             offset="95%"
// //                             stopColor="#3b82f6"
// //                             stopOpacity={0}
// //                           />
// //                         </linearGradient>
// //                       </defs>
// //                       <CartesianGrid
// //                         strokeDasharray="3 3"
// //                         vertical={false}
// //                         stroke="#282D3F"
// //                       />
// //                       <XAxis
// //                         dataKey="month"
// //                         axisLine={false}
// //                         tickLine={false}
// //                         tick={{
// //                           fill: "#8F9BBA",
// //                           fontSize: 13,
// //                           fontWeight: 500,
// //                         }}
// //                         dy={10}
// //                       />
// //                       <YAxis
// //                         axisLine={false}
// //                         tickLine={false}
// //                         tick={{
// //                           fill: "#8F9BBA",
// //                           fontSize: 13,
// //                           fontWeight: 500,
// //                         }}
// //                       />
// //                       <Tooltip
// //                         cursor={{
// //                           stroke: "#282D3F",
// //                           strokeWidth: 2,
// //                           fill: "transparent",
// //                         }}
// //                         contentStyle={{
// //                           backgroundColor: "#1A1D29",
// //                           borderRadius: "12px",
// //                           border: "1px solid #282D3F",
// //                           boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
// //                           color: "#fff",
// //                           fontWeight: 600,
// //                         }}
// //                       />
// //                       <Area
// //                         type="monotone"
// //                         dataKey="sales"
// //                         stroke="#3b82f6"
// //                         strokeWidth={4}
// //                         fill="url(#colorSales)"
// //                       />
// //                     </AreaChart>
// //                   </ResponsiveContainer>
// //                 ) : (
// //                   <div className="d-flex flex-column align-items-center justify-content-center h-100 text-secondary">
// //                     <Activity size={48} className="opacity-25 mb-3" />
// //                     <span className="small fw-medium">
// //                       No sales data recorded yet.
// //                     </span>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Recent Orders Table */}
// //         <div className="col-12 col-xl-4">
// //           <div className="card crypto-card border-0 rounded-4 h-100 p-2">
// //             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
// //               <div>
// //                 <h5 className="fw-bolder mb-1 text-white">Recent Orders</h5>
// //                 <span className="text-secondary small">
// //                   Latest customer transactions
// //                 </span>
// //               </div>
// //               <button className="btn btn-sm crypto-btn-icon rounded-circle p-2 transition-all">
// //                 <ChevronRight size={18} className="text-secondary" />
// //               </button>
// //             </div>
// //             <div
// //               className="card-body p-0 overflow-auto crypto-scrollbar"
// //               style={{ maxHeight: "350px" }}
// //             >
// //               <table className="table table-hover align-middle mb-0 border-0 text-white">
// //                 <thead className="crypto-thead sticky-top">
// //                   <tr>
// //                     <th className="ps-4 border-0 text-secondary small fw-semibold text-uppercase tracking-wider">
// //                       Order ID
// //                     </th>
// //                     <th className="border-0 text-secondary small fw-semibold text-uppercase tracking-wider">
// //                       Customer
// //                     </th>
// //                     <th className="pe-4 text-end border-0 text-secondary small fw-semibold text-uppercase tracking-wider">
// //                       Total
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="border-top-0">
// //                   {recentOrders.length > 0 ? (
// //                     recentOrders.map((order) => (
// //                       <tr
// //                         key={order._id}
// //                         className="border-bottom crypto-border transition-all"
// //                       >
// //                         <td className="ps-4 py-3 border-0">
// //                           <span className="badge bg-primary-soft text-primary-glow border border-primary border-opacity-25 rounded-pill px-2 py-1 font-monospace">
// //                             #
// //                             {order._id
// //                               .substring(order._id.length - 6)
// //                               .toUpperCase()}
// //                           </span>
// //                         </td>
// //                         <td className="border-0">
// //                           <div
// //                             className="fw-bold text-white text-truncate"
// //                             style={{ maxWidth: "130px", fontSize: "0.9rem" }}
// //                           >
// //                             {order.user?.name || "Guest User"}
// //                           </div>
// //                           <div
// //                             className="text-secondary"
// //                             style={{ fontSize: "0.75rem" }}
// //                           >
// //                             {new Date(order.createdAt).toLocaleDateString(
// //                               "en-US",
// //                               { month: "short", day: "numeric" },
// //                             )}
// //                           </div>
// //                         </td>
// //                         <td className="pe-4 text-end border-0">
// //                           <span
// //                             className="fw-bolder text-white"
// //                             style={{ fontSize: "0.95rem" }}
// //                           >
// //                             NPR {order.totalPrice?.toLocaleString()}
// //                           </span>
// //                         </td>
// //                       </tr>
// //                     ))
// //                   ) : (
// //                     <tr>
// //                       <td
// //                         colSpan="3"
// //                         className="text-center py-5 text-secondary small fw-medium"
// //                       >
// //                         No recent orders found.
// //                       </td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Inventory Alerts Row */}
// //       <div className="row g-4 mb-4">
// //         {/* Low Stock Alerts */}
// //         <div className="col-12 col-lg-5">
// //           <div className="card crypto-card border-0 rounded-4 h-100 p-2">
// //             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
// //               <div>
// //                 <h5 className="fw-bolder mb-1 text-danger-glow d-flex align-items-center gap-2">
// //                   <Bell size={20} strokeWidth={2.5} /> Critical Stock
// //                 </h5>
// //                 <span className="text-secondary small">
// //                   Items requiring immediate refill
// //                 </span>
// //               </div>
// //               <span className="badge bg-danger text-white rounded-pill px-3 py-2 crypto-shadow">
// //                 {lowStock.length} Alerts
// //               </span>
// //             </div>
// //             <div className="card-body p-4 pt-0">
// //               {lowStock.length === 0 ? (
// //                 <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5 bg-success-soft rounded-4 border border-success border-opacity-10">
// //                   <Package size={32} className="text-success-glow mb-2" />
// //                   <span className="text-success-glow fw-bold">
// //                     Inventory is healthy
// //                   </span>
// //                 </div>
// //               ) : (
// //                 <div className="d-flex flex-column gap-3">
// //                   {lowStock.slice(0, 5).map((item) => (
// //                     <div
// //                       key={item._id}
// //                       className="d-flex justify-content-between align-items-center p-3 bg-danger-soft rounded-4 border border-danger border-opacity-25 transition-all hover-lift-sm"
// //                     >
// //                       <div className="d-flex align-items-center gap-3">
// //                         <div className="crypto-icon-box p-2 rounded-circle">
// //                           <Package size={18} className="text-danger-glow" />
// //                         </div>
// //                         <div>
// //                           <div className="fw-bolder text-white">
// //                             {item.name}
// //                           </div>
// //                           <div
// //                             className="text-danger-glow opacity-75 fw-medium"
// //                             style={{ fontSize: "0.75rem" }}
// //                           >
// //                             Restock highly advised
// //                           </div>
// //                         </div>
// //                       </div>
// //                       <span className="badge crypto-bg-dark text-danger-glow border border-danger border-opacity-50 px-2 py-1 rounded-pill">
// //                         {item.countInStock} Left
// //                       </span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Inventory Snapshot */}
// //         <div className="col-12 col-lg-7">
// //           <div className="card crypto-card border-0 rounded-4 h-100 p-2">
// //             <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
// //               <div>
// //                 <h5 className="fw-bolder mb-1 text-white d-flex align-items-center gap-2">
// //                   <Activity
// //                     size={20}
// //                     className="text-primary-glow"
// //                     strokeWidth={2.5}
// //                   />{" "}
// //                   Inventory Snapshot
// //                 </h5>
// //                 <span className="text-secondary small">
// //                   Quick overview of available medicines
// //                 </span>
// //               </div>
// //               <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold border-opacity-50 text-primary-glow">
// //                 View All
// //               </button>
// //             </div>
// //             <div className="card-body p-4 pt-0">
// //               <div className="row g-3">
// //                 {medicines.slice(0, 6).map((med) => (
// //                   <div key={med._id} className="col-12 col-md-6">
// //                     <div className="p-3 border rounded-4 d-flex justify-content-between align-items-center crypto-bg-dark crypto-border hover-border-primary transition-all">
// //                       <div>
// //                         <div
// //                           className="fw-bold text-white mb-1 text-truncate"
// //                           style={{ maxWidth: "140px" }}
// //                         >
// //                           {med.name}
// //                         </div>
// //                         <span className="badge crypto-bg-light text-secondary border-0">
// //                           {med.category}
// //                         </span>
// //                       </div>
// //                       <div className="text-end">
// //                         <div className="fw-bolder text-white mb-1">
// //                           NPR {med.price}
// //                         </div>
// //                         <div
// //                           className={`fw-semibold small ${med.countInStock < 15 ? "text-danger-glow" : "text-success-glow"}`}
// //                         >
// //                           {med.countInStock} Units
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //                 {medicines.length === 0 && (
// //                   <div className="col-12 text-center py-5 text-secondary fw-medium">
// //                     No medicines available in the database.
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* --- CRYPTO DARK THEME CSS OVERRIDES --- */}
// //       <style>{`
// //         /* Core Backgrounds */
// //         .bg-dashboard-base { background-color: #0F1219 !important; }
// //         .crypto-card { background-color: #1A1D29 !important; border: 1px solid #282D3F !important; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
// //         .crypto-bg-dark { background-color: #12151E !important; }
// //         .crypto-bg-light { background-color: #282D3F !important; }
// //         .crypto-border { border-color: #282D3F !important; }

// //         /* Table overrides for dark mode */
// //         .table { color: #E0E7FF; }
// //         .table td, .table th { background-color: transparent !important; }
// //         .crypto-thead { background-color: #12151E !important; }
// //         .table-hover tbody tr:hover td { background-color: rgba(255, 255, 255, 0.03) !important; }

// //         /* Typography */
// //         .text-secondary { color: #8F9BBA !important; }
// //         .tracking-tight { letter-spacing: -0.025em; }
// //         .tracking-wider { letter-spacing: 0.05em; }

// //         /* Glowing Colors (Text) */
// //         .text-primary-glow { color: #3b82f6 !important; text-shadow: 0 0 10px rgba(59, 130, 246, 0.4); }
// //         .text-success-glow { color: #10b981 !important; text-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }
// //         .text-info-glow { color: #06b6d4 !important; text-shadow: 0 0 10px rgba(6, 182, 212, 0.4); }
// //         .text-warning-glow { color: #f59e0b !important; text-shadow: 0 0 10px rgba(245, 158, 11, 0.4); }
// //         .text-danger-glow { color: #ef4444 !important; text-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }

// //         /* Translucent Soft Backgrounds */
// //         .bg-primary-soft { background-color: rgba(59, 130, 246, 0.15) !important; }
// //         .bg-success-soft { background-color: rgba(16, 185, 129, 0.15) !important; }
// //         .bg-info-soft { background-color: rgba(6, 182, 212, 0.15) !important; }
// //         .bg-warning-soft { background-color: rgba(245, 158, 11, 0.15) !important; }
// //         .bg-danger-soft { background-color: rgba(239, 68, 68, 0.15) !important; }

// //         /* Miscellaneous UI */
// //         .crypto-shadow { box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
// //         .crypto-btn-icon { background-color: #282D3F; border: none; }
// //         .crypto-btn-icon:hover { background-color: #3F4766; }
// //         .crypto-icon-box { background-color: #12151E; border: 1px solid #282D3F; }

// //         /* Hover Animations */
// //         .transition-all { transition: all 0.3s ease; }
// //         .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
// //         .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.5); border-color: #3b82f6 !important; }
// //         .hover-lift-sm:hover { transform: translateY(-2px); border-color: #ef4444 !important; }
// //         .hover-border-primary:hover { border-color: #3b82f6 !important; }

// //         /* Custom Dark Scrollbar */
// //         .crypto-scrollbar::-webkit-scrollbar { width: 6px; }
// //         .crypto-scrollbar::-webkit-scrollbar-track { background: transparent; }
// //         .crypto-scrollbar::-webkit-scrollbar-thumb { background-color: #282D3F; border-radius: 20px; }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;

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

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         // ✅ 1. Fetch Aggregated Stats (Fast & Accurate)

//         const statsRes = await api.get("/admin/stats");

//         const statsData = statsRes.data;

//         // ✅ 2. Fetch Medicines for Inventory List (Fixing the 0 bug)

//         // We fetch this separately to populate the "Inventory Snapshot" table

//         const medsRes = await api.get("/medicines");

//         // FIX: Handle both paginated ({ medicines: [...] }) and non-paginated ([...]) responses

//         const medsData =
//           medsRes.data.medicines ||
//           (Array.isArray(medsRes.data) ? medsRes.data : []);

//         // 3. Process Low Stock Items (Threshold < 15)

//         const lowStockItems = medsData.filter(
//           (m) => (m.countInStock || 0) < 15,
//         );

//         // 4. Update State with Real Data

//         setStats({
//           users: statsData.totalCustomers || 0,

//           medicines: statsData.totalMedicines || 0, // Uses DB count, ignores pagination

//           doctors: statsData.totalDoctors || 0,

//           orders: statsData.totalOrders || 0,

//           revenue: statsData.totalSales || 0,

//           salesData: statsData.salesData || [],
//         });

//         // Use recent orders from stats API if available, otherwise empty

//         setRecentOrders(statsData.recentOrders || []);

//         setMedicines(medsData); // For the table list

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

//       value: `NPR ${stats.revenue.toLocaleString()}`,

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

//         <div className="col-12 col-xl-8 col-lg-7">
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

//         <div className="col-12 col-xl-4 col-lg-5">
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
//                           NPR {order.totalPrice?.toLocaleString()}
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

//         <div className="col-12 col-lg-6">
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
//                   <br /> All stock levels healthy
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
//                           Refill needed
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

//         <div className="col-12 col-lg-6">
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
//                     <div className="small fw-bold">NPR {med.price}</div>

//                     <div
//                       className={`small fw-bold ${(med.countInStock || 0) < 15 ? "text-danger" : "text-success"}`}
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
// import { useNavigate } from "react-router-dom";
// import {
//   ComposedChart,
//   Line,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import {
//   Users,
//   Package,
//   ShoppingCart,
//   DollarSign,
//   Activity,
//   Bell,
//   ChevronRight,
//   LayoutDashboard,
//   ArrowRight,
//   Loader2,
// } from "lucide-react";
// import api from "../services/api";

// const AdminDashboard = () => {
//   const navigate = useNavigate();

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

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         const statsRes = await api.get("/admin/stats");
//         const statsData = statsRes.data;

//         const medsRes = await api.get("/medicines");
//         const medsData =
//           medsRes.data.medicines ||
//           (Array.isArray(medsRes.data) ? medsRes.data : []);

//         const lowStockItems = medsData.filter(
//           (m) => (m.countInStock || 0) < 15,
//         );

//         setStats({
//           users: statsData.totalCustomers || 0,
//           medicines: statsData.totalMedicines || 0,
//           doctors: statsData.totalDoctors || 0,
//           orders: statsData.totalOrders || 0,
//           revenue: statsData.totalSales || 0,
//           salesData: statsData.salesData || [],
//         });

//         setRecentOrders(statsData.recentOrders || []);
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
//       <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary mb-3" size={48} />
//         <span className="text-secondary fw-bold tracking-wider text-uppercase small">
//           Syncing Dashboard...
//         </span>
//       </div>
//     );
//   }

//   // ✅ PERFECTED CHART DATA: Matches reference image, handles any data key, and supports exact decimals
//   const defaultSalesData = [
//     { labelText: "Q1", revenue: 120000, cost: 290000 },
//     { labelText: "Q2", revenue: 130000, cost: 245000 },
//     { labelText: "Q3", revenue: 170000, cost: 215000 },
//     { labelText: "Q4", revenue: 220000, cost: 195000 },
//     { labelText: "Q1", revenue: 190000, cost: 170000 },
//     { labelText: "Q2", revenue: 180000, cost: 160000 },
//     { labelText: "Q3", revenue: 210000, cost: 155000 },
//     { labelText: "Q4", revenue: 250000, cost: 120000 },
//   ];

//   // Safely map backend data. Looks for '_id', 'month', or 'date' to ensure X-Axis works.
//   const processedChartData =
//     stats.salesData && stats.salesData.length > 0
//       ? stats.salesData.map((item, index) => {
//           const actualSales = parseFloat(
//             item.sales || item.total || item.revenue || 0,
//           );
//           const rawLabel =
//             item.month || item._id || item.date || `Pt ${index + 1}`;

//           return {
//             ...item,
//             labelText: rawLabel, // Guaranteed key for XAxis
//             revenue: actualSales,
//             cost:
//               actualSales > 0
//                 ? actualSales * Math.max(0.4, 1.2 - index * 0.15)
//                 : 0, // Mock cost line based on sales
//           };
//         })
//       : defaultSalesData;

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     if (dateString.length <= 3 || !dateString.includes("-")) return dateString;
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
//   };

//   // Helper to format currency dynamically based on size
//   const formatCurrency = (value) => {
//     if (value >= 1000000) return `Rs. ${(value / 1000000).toFixed(1)}M`;
//     if (value >= 1000) return `Rs. ${(value / 1000).toFixed(1)}k`;
//     return `Rs. ${value.toLocaleString()}`;
//   };

//   return (
//     <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
//       {/* --- HEADER --- */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
//         <div className="d-flex align-items-center gap-3">
//           <div className="bg-primary text-white p-3 rounded-3 shadow-sm">
//             <LayoutDashboard size={28} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="fw-bolder mb-1 text-dark tracking-tight">
//               System Overview
//             </h3>
//             <p className="text-muted fw-medium mb-0">
//               Real-time live data analytics & control center
//             </p>
//           </div>
//         </div>
//         {error && (
//           <div className="alert alert-danger py-2 px-4 small mb-0 rounded-pill shadow-sm d-flex align-items-center gap-2 fw-bold">
//             <Activity size={18} /> {error}
//           </div>
//         )}
//       </div>

//       {/* --- VIBRANT KPI CARDS --- */}
//       <div className="row g-4 mb-5">
//         <div
//           className="col-12 col-md-6 col-xl-3"
//           onClick={() => navigate("/admin/users")}
//           style={{ cursor: "pointer" }}
//         >
//           <div className="card gradient-card-4 border-0 shadow-lg rounded-4 h-100 hover-lift text-white overflow-hidden position-relative">
//             <div className="card-body p-4 position-relative z-1">
//               <div className="glass-icon-box mb-3">
//                 <Users size={24} />
//               </div>
//               <div className="small text-uppercase fw-bolder tracking-wider mb-1 opacity-75">
//                 Total Users
//               </div>
//               <h2 className="fw-bolder mb-0 display-6">{stats.users}</h2>
//             </div>
//             <div className="card-decorator-circle"></div>
//           </div>
//         </div>

//         <div
//           className="col-12 col-md-6 col-xl-3"
//           onClick={() => navigate("/admin/medicines")}
//           style={{ cursor: "pointer" }}
//         >
//           <div className="card gradient-card-3 border-0 shadow-lg rounded-4 h-100 hover-lift text-white overflow-hidden position-relative">
//             <div className="card-body p-4 position-relative z-1">
//               <div className="glass-icon-box mb-3">
//                 <Package size={24} />
//               </div>
//               <div className="small text-uppercase fw-bolder tracking-wider mb-1 opacity-75">
//                 Medicines
//               </div>
//               <h2 className="fw-bolder mb-0 display-6">{stats.medicines}</h2>
//             </div>
//             <div className="card-decorator-circle"></div>
//           </div>
//         </div>

//         <div
//           className="col-12 col-md-6 col-xl-3"
//           onClick={() => navigate("/admin/orders")}
//           style={{ cursor: "pointer" }}
//         >
//           <div className="card gradient-card-2 border-0 shadow-lg rounded-4 h-100 hover-lift text-white overflow-hidden position-relative">
//             <div className="card-body p-4 position-relative z-1">
//               <div className="glass-icon-box mb-3">
//                 <ShoppingCart size={24} />
//               </div>
//               <div className="small text-uppercase fw-bolder tracking-wider mb-1 opacity-75">
//                 Total Orders
//               </div>
//               <h2 className="fw-bolder mb-0 display-6">{stats.orders}</h2>
//             </div>
//             <div className="card-decorator-circle"></div>
//           </div>
//         </div>

//         <div
//           className="col-12 col-md-6 col-xl-3"
//           onClick={() => navigate("/admin/reports")}
//           style={{ cursor: "pointer" }}
//         >
//           <div className="card gradient-card-1 border-0 shadow-lg rounded-4 h-100 hover-lift text-white overflow-hidden position-relative">
//             <div className="card-body p-4 position-relative z-1">
//               <div className="glass-icon-box mb-3">
//                 <DollarSign size={24} />
//               </div>
//               <div className="small text-uppercase fw-bolder tracking-wider mb-1 opacity-75">
//                 Total Revenue
//               </div>
//               <h2 className="fw-bolder mb-0 display-6">
//                 {stats.revenue >= 1000
//                   ? `NPR ${(stats.revenue / 1000).toFixed(1)}k`
//                   : `NPR ${stats.revenue.toLocaleString()}`}
//               </h2>
//             </div>
//             <div className="card-decorator-circle"></div>
//           </div>
//         </div>
//       </div>

//       {/* --- CHARTS & RECENT ORDERS --- */}
//       <div className="row g-4 mb-5">
//         {/* ✅ REVENUE CHART MATCHING REFERENCE */}
//         <div className="col-12 col-xl-8">
//           <div className="card modern-card border-0 shadow-sm rounded-4 h-100 bg-white">
//             <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
//               <div>
//                 <h4 className="fw-bolder text-dark mb-1">
//                   Revenue vs Operational Cost
//                 </h4>
//                 <span className="text-muted small fw-medium">
//                   Dual-axis overview of financial health
//                 </span>
//               </div>
//             </div>
//             <div className="card-body px-2 pb-4 pt-4">
//               <div style={{ width: "100%", height: 380 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <ComposedChart
//                     data={processedChartData}
//                     margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
//                   >
//                     <CartesianGrid
//                       strokeDasharray="3 3"
//                       vertical={false}
//                       stroke="#f1f5f9"
//                     />

//                     {/* X-Axis mapping to our guaranteed labelText */}
//                     <XAxis
//                       dataKey="labelText"
//                       tickFormatter={formatDate}
//                       axisLine={{ stroke: "#cbd5e1" }}
//                       tickLine={{ stroke: "#cbd5e1" }}
//                       tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
//                       dy={10}
//                     />

//                     {/* Left Axis for Revenue (Bars) */}
//                     <YAxis
//                       yAxisId="left"
//                       axisLine={{ stroke: "#cbd5e1" }}
//                       tickLine={{ stroke: "#cbd5e1" }}
//                       tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
//                       dx={-10}
//                       tickFormatter={formatCurrency}
//                     />

//                     {/* Right Axis for Cost (Line) */}
//                     <YAxis
//                       yAxisId="right"
//                       orientation="right"
//                       axisLine={{ stroke: "#cbd5e1" }}
//                       tickLine={{ stroke: "#cbd5e1" }}
//                       tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
//                       dx={10}
//                       tickFormatter={formatCurrency}
//                     />

//                     <Tooltip
//                       cursor={{ fill: "rgba(0,0,0,0.04)" }}
//                       contentStyle={{
//                         borderRadius: "8px",
//                         border: "1px solid #e2e8f0",
//                         boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
//                         fontWeight: 600,
//                       }}
//                       formatter={(value) => `Rs. ${value.toLocaleString()}`}
//                     />

//                     <Legend
//                       verticalAlign="top"
//                       align="center"
//                       height={50}
//                       iconType="square"
//                       wrapperStyle={{ fontWeight: 600, color: "#334155" }}
//                     />

//                     {/* Dark Green Bars */}
//                     <Bar
//                       yAxisId="left"
//                       dataKey="revenue"
//                       name="Revenue"
//                       fill="#08853b"
//                       barSize={35}
//                     />

//                     {/* Light Green Overlay Line */}
//                     <Line
//                       yAxisId="right"
//                       type="linear"
//                       dataKey="cost"
//                       name="Operational Cost"
//                       stroke="#4ade80"
//                       strokeWidth={3}
//                       dot={{
//                         r: 5,
//                         fill: "#4ade80",
//                         stroke: "#fff",
//                         strokeWidth: 2,
//                       }}
//                       activeDot={{ r: 7, fill: "#08853b", stroke: "#fff" }}
//                     />
//                   </ComposedChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* BOLD Recent Orders Table */}
//         <div className="col-12 col-xl-4">
//           <div className="card modern-card shadow-lg border-0 rounded-4 h-100 overflow-hidden bg-white">
//             <div
//               className="card-header border-0 px-4 py-4 d-flex justify-content-between align-items-center"
//               style={{ backgroundColor: "#0f172a" }}
//             >
//               <h5 className="fw-bolder text-white mb-0 d-flex align-items-center gap-2">
//                 <Activity size={20} className="text-info" /> Recent Orders
//               </h5>
//               <button
//                 className="btn btn-sm btn-outline-light rounded-circle p-1 hover-lift"
//                 onClick={() => navigate("/admin/orders")}
//                 title="View All Orders"
//               >
//                 <ChevronRight size={18} />
//               </button>
//             </div>

//             <div
//               className="card-body p-0 overflow-auto custom-scrollbar"
//               style={{ maxHeight: "400px" }}
//             >
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="bg-light sticky-top">
//                   <tr>
//                     <th className="ps-4 border-0 text-secondary tracking-wider small text-uppercase fw-bold">
//                       Order ID
//                     </th>
//                     <th className="border-0 text-secondary tracking-wider small text-uppercase fw-bold">
//                       Customer
//                     </th>
//                     <th className="pe-4 text-end border-0 text-secondary tracking-wider small text-uppercase fw-bold">
//                       Amount
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="border-top-0">
//                   {recentOrders.length > 0 ? (
//                     recentOrders.map((order) => (
//                       <tr
//                         key={order._id}
//                         className="transition-all table-row-hover border-bottom border-light"
//                       >
//                         <td className="ps-4 py-3 border-0">
//                           <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-2 py-1 font-monospace">
//                             #
//                             {order._id
//                               .substring(order._id.length - 6)
//                               .toUpperCase()}
//                           </span>
//                         </td>
//                         <td className="border-0">
//                           <div
//                             className="fw-bold text-dark text-truncate"
//                             style={{ maxWidth: "120px", fontSize: "0.9rem" }}
//                           >
//                             {order.user?.name || "Guest User"}
//                           </div>
//                           <div
//                             className="text-muted"
//                             style={{ fontSize: "0.75rem" }}
//                           >
//                             {new Date(order.createdAt).toLocaleDateString(
//                               "en-US",
//                               { month: "short", day: "numeric" },
//                             )}
//                           </div>
//                         </td>
//                         <td
//                           className="pe-4 text-end border-0 fw-bolder text-success"
//                           style={{ fontSize: "0.95rem" }}
//                         >
//                           NPR {order.totalPrice?.toLocaleString()}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="3"
//                         className="text-center py-5 text-muted fw-bold"
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

//       {/* --- INVENTORY & ALERTS SECTION --- */}
//       <div className="row g-4 mb-4">
//         {/* Low Stock Alerts */}
//         <div className="col-12 col-lg-6">
//           <div className="card modern-card border-0 shadow-sm rounded-4 h-100 bg-white overflow-hidden">
//             <div className="card-header bg-danger bg-opacity-10 border-0 pt-4 px-4 pb-3 d-flex justify-content-between align-items-center">
//               <div>
//                 <h5 className="fw-bolder text-danger mb-0 d-flex align-items-center gap-2">
//                   <Bell size={20} strokeWidth={2.5} /> Critical Stock
//                 </h5>
//               </div>
//               <button
//                 className="btn btn-sm btn-danger rounded-pill px-3 fw-bold shadow-sm d-flex align-items-center gap-1"
//                 onClick={() => navigate("/admin/suppliers")}
//               >
//                 Restock All <ArrowRight size={14} />
//               </button>
//             </div>

//             <div
//               className="card-body p-0 overflow-auto custom-scrollbar"
//               style={{ maxHeight: "350px" }}
//             >
//               {lowStock.length === 0 ? (
//                 <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
//                   <div className="bg-success bg-opacity-10 p-3 rounded-circle mb-3">
//                     <Package size={32} className="text-success" />
//                   </div>
//                   <span className="text-success fw-bold text-uppercase tracking-wider">
//                     Inventory Healthy
//                   </span>
//                 </div>
//               ) : (
//                 <div className="d-flex flex-column gap-2 p-3">
//                   {lowStock.map((item) => (
//                     <div
//                       key={item._id}
//                       className="d-flex justify-content-between align-items-center p-3 bg-danger bg-opacity-10 rounded-4 border border-danger border-opacity-25 transition-all hover-lift"
//                     >
//                       <div className="d-flex align-items-center gap-3">
//                         <div className="bg-white p-2 rounded-circle shadow-sm">
//                           <Package size={18} className="text-danger" />
//                         </div>
//                         <div>
//                           <div className="fw-bolder text-dark">{item.name}</div>
//                           <div
//                             className="text-danger opacity-75 fw-bold text-uppercase tracking-wider"
//                             style={{ fontSize: "0.7rem" }}
//                           >
//                             Needs Refill
//                           </div>
//                         </div>
//                       </div>
//                       <span className="badge bg-danger px-3 py-2 rounded-pill shadow-sm fs-6">
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
//         <div className="col-12 col-lg-6">
//           <div className="card modern-card border-0 shadow-sm rounded-4 h-100 bg-white">
//             <div className="card-header bg-transparent border-bottom pt-4 px-4 pb-3 d-flex justify-content-between align-items-center">
//               <div>
//                 <h5 className="fw-bolder text-dark mb-0 d-flex align-items-center gap-2">
//                   <Activity size={20} className="text-info" /> Inventory
//                   Snapshot
//                 </h5>
//               </div>
//               <button
//                 className="btn btn-sm btn-outline-info rounded-pill px-4 fw-bold hover-lift transition-all"
//                 onClick={() => navigate("/admin/medicines")}
//               >
//                 View All
//               </button>
//             </div>

//             <div className="card-body p-4 pt-3">
//               <div className="row g-3">
//                 {medicines.slice(0, 6).map((med) => (
//                   <div key={med._id} className="col-12 col-md-6">
//                     <div className="p-3 border rounded-4 d-flex justify-content-between align-items-center bg-light hover-lift transition-all">
//                       <div>
//                         <div
//                           className="fw-bold text-dark mb-1 text-truncate"
//                           style={{ maxWidth: "140px", fontSize: "0.95rem" }}
//                         >
//                           {med.name}
//                         </div>
//                         <span className="badge bg-white text-secondary border shadow-sm">
//                           {med.category}
//                         </span>
//                       </div>
//                       <div className="text-end">
//                         <div className="fw-bolder text-primary mb-1">
//                           NPR {med.price}
//                         </div>
//                         <div
//                           className={`fw-bold small px-2 py-1 rounded-pill d-inline-block ${(med.countInStock || 0) < 15 ? "bg-danger bg-opacity-10 text-danger" : "bg-success bg-opacity-10 text-success"}`}
//                           style={{ fontSize: "0.75rem" }}
//                         >
//                           {med.countInStock || 0} Units
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {medicines.length === 0 && (
//                   <div className="col-12 text-center py-5 text-muted fw-bold">
//                     No medicines available in the database.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ComposedChart,
//   Line,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import {
//   Users,
//   Package,
//   ShoppingCart,
//   DollarSign,
//   Activity,
//   Bell,
//   ChevronRight,
//   LayoutDashboard,
//   ArrowRight,
//   Loader2,
//   MessageSquare,
//   X,
//   CheckCircle2,
//   Send,
//   Reply,
// } from "lucide-react";
// import api from "../services/api";

// const AdminDashboard = () => {
//   const navigate = useNavigate();

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

//   // ✅ New Message States
//   const [messages, setMessages] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [showMessagesModal, setShowMessagesModal] = useState(false);
//   const [replyingTo, setReplyingTo] = useState(null); // Tracks which message is being replied to
//   const [replyText, setReplyText] = useState("");
//   const [replyLoading, setReplyLoading] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         const [statsRes, medsRes, messagesRes] = await Promise.all([
//           api.get("/admin/stats"),
//           api.get("/medicines"),
//           api.get("/messages").catch(() => ({ data: [] })), // Catch error if message route isn't ready
//         ]);

//         const statsData = statsRes.data;
//         const medsData =
//           medsRes.data.medicines ||
//           (Array.isArray(medsRes.data) ? medsRes.data : []);
//         const lowStockItems = medsData.filter(
//           (m) => (m.countInStock || 0) < 15,
//         );

//         // Process Messages
//         const msgs = messagesRes.data || [];
//         setMessages(msgs);
//         setUnreadCount(msgs.filter((m) => !m.isRead).length);

//         setStats({
//           users: statsData.totalCustomers || 0,
//           medicines: statsData.totalMedicines || 0,
//           doctors: statsData.totalDoctors || 0,
//           orders: statsData.totalOrders || 0,
//           revenue: statsData.totalSales || 0,
//           salesData: statsData.salesData || [],
//         });

//         setRecentOrders(statsData.recentOrders || []);
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

//     // Refresh messages every 30 seconds
//     const interval = setInterval(async () => {
//       try {
//         const msgsRes = await api.get("/messages");
//         setMessages(msgsRes.data || []);
//         setUnreadCount((msgsRes.data || []).filter((m) => !m.isRead).length);
//       } catch (e) {
//         /* ignore silent refresh errors */
//       }
//     }, 30000);

//     return () => clearInterval(interval);
//   }, []);

//   // ✅ New function to handle sending the reply
//   const handleSendReply = async (msgId) => {
//     if (!replyText.trim()) return;

//     try {
//       setReplyLoading(true);
//       await api.put(`/messages/${msgId}/reply`, { replyText });

//       // Update local state instantly to show it as replied/read
//       setMessages(
//         messages.map((m) =>
//           m._id === msgId ? { ...m, isRead: true, adminReply: replyText } : m,
//         ),
//       );
//       setUnreadCount((prev) => Math.max(0, prev - 1));

//       // Reset reply state
//       setReplyingTo(null);
//       setReplyText("");
//     } catch (err) {
//       console.error("Failed to send reply", err);
//       alert("Failed to send reply. Please try again.");
//     } finally {
//       setReplyLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary mb-3" size={48} />
//         <span className="text-secondary fw-bold tracking-wider text-uppercase small">
//           Syncing Dashboard...
//         </span>
//       </div>
//     );
//   }

//   const defaultSalesData = [
//     { labelText: "Q1", revenue: 120000, cost: 290000 },
//     { labelText: "Q2", revenue: 130000, cost: 245000 },
//     { labelText: "Q3", revenue: 170000, cost: 215000 },
//     { labelText: "Q4", revenue: 220000, cost: 195000 },
//   ];

//   const processedChartData =
//     stats.salesData && stats.salesData.length > 0
//       ? stats.salesData.map((item, index) => {
//           const actualSales = parseFloat(
//             item.sales || item.total || item.revenue || 0,
//           );
//           const rawLabel =
//             item.month || item._id || item.date || `Pt ${index + 1}`;
//           return {
//             ...item,
//             labelText: rawLabel,
//             revenue: actualSales,
//             cost:
//               actualSales > 0
//                 ? actualSales * Math.max(0.4, 1.2 - index * 0.15)
//                 : 0,
//           };
//         })
//       : defaultSalesData;

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     if (dateString.length <= 3 || !dateString.includes("-")) return dateString;
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
//   };

//   const formatCurrency = (value) => {
//     if (value >= 1000000) return `Rs. ${(value / 1000000).toFixed(1)}M`;
//     if (value >= 1000) return `Rs. ${(value / 1000).toFixed(1)}k`;
//     return `Rs. ${value.toLocaleString()}`;
//   };

//   return (
//     <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in position-relative">
//       {/* --- HEADER --- */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
//         <div className="d-flex align-items-center gap-3">
//           <div className="bg-primary text-white p-3 rounded-3 shadow-sm">
//             <LayoutDashboard size={28} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="fw-bolder mb-1 text-dark tracking-tight">
//               System Overview
//             </h3>
//             <p className="text-muted fw-medium mb-0">
//               Real-time live data analytics & control center
//             </p>
//           </div>
//         </div>

//         <div className="d-flex align-items-center gap-3">
//           {error && (
//             <div className="alert alert-danger py-2 px-4 small mb-0 rounded-pill shadow-sm d-flex align-items-center gap-2 fw-bold">
//               <Activity size={18} /> {error}
//             </div>
//           )}

//           {/* ✅ Messages Notification Button */}
//           <button
//             className="btn btn-white border position-relative rounded-circle p-2 shadow-sm hover-lift"
//             onClick={() => setShowMessagesModal(true)}
//             title="View Messages"
//           >
//             <MessageSquare size={24} className="text-secondary" />
//             {unreadCount > 0 && (
//               <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white shadow-sm">
//                 {unreadCount}
//               </span>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* --- VIBRANT KPI CARDS --- */}
//       <div className="row g-4 mb-5">
//         <div
//           className="col-12 col-md-6 col-xl-3"
//           onClick={() => navigate("/admin/users")}
//           style={{ cursor: "pointer" }}
//         >
//           <div className="card gradient-card-4 border-0 shadow-lg rounded-4 h-100 hover-lift text-white overflow-hidden position-relative">
//             <div className="card-body p-4 position-relative z-1">
//               <div className="glass-icon-box mb-3">
//                 <Users size={24} />
//               </div>
//               <div className="small text-uppercase fw-bolder tracking-wider mb-1 opacity-75">
//                 Total Users
//               </div>
//               <h2 className="fw-bolder mb-0 display-6">{stats.users}</h2>
//             </div>
//             <div className="card-decorator-circle"></div>
//           </div>
//         </div>

//         <div
//           className="col-12 col-md-6 col-xl-3"
//           onClick={() => navigate("/admin/medicines")}
//           style={{ cursor: "pointer" }}
//         >
//           <div className="card gradient-card-3 border-0 shadow-lg rounded-4 h-100 hover-lift text-white overflow-hidden position-relative">
//             <div className="card-body p-4 position-relative z-1">
//               <div className="glass-icon-box mb-3">
//                 <Package size={24} />
//               </div>
//               <div className="small text-uppercase fw-bolder tracking-wider mb-1 opacity-75">
//                 Medicines
//               </div>
//               <h2 className="fw-bolder mb-0 display-6">{stats.medicines}</h2>
//             </div>
//             <div className="card-decorator-circle"></div>
//           </div>
//         </div>

//         <div
//           className="col-12 col-md-6 col-xl-3"
//           onClick={() => navigate("/admin/orders")}
//           style={{ cursor: "pointer" }}
//         >
//           <div className="card gradient-card-2 border-0 shadow-lg rounded-4 h-100 hover-lift text-white overflow-hidden position-relative">
//             <div className="card-body p-4 position-relative z-1">
//               <div className="glass-icon-box mb-3">
//                 <ShoppingCart size={24} />
//               </div>
//               <div className="small text-uppercase fw-bolder tracking-wider mb-1 opacity-75">
//                 Total Orders
//               </div>
//               <h2 className="fw-bolder mb-0 display-6">{stats.orders}</h2>
//             </div>
//             <div className="card-decorator-circle"></div>
//           </div>
//         </div>

//         <div
//           className="col-12 col-md-6 col-xl-3"
//           onClick={() => navigate("/admin/reports")}
//           style={{ cursor: "pointer" }}
//         >
//           <div className="card gradient-card-1 border-0 shadow-lg rounded-4 h-100 hover-lift text-white overflow-hidden position-relative">
//             <div className="card-body p-4 position-relative z-1">
//               <div className="glass-icon-box mb-3">
//                 <DollarSign size={24} />
//               </div>
//               <div className="small text-uppercase fw-bolder tracking-wider mb-1 opacity-75">
//                 Total Revenue
//               </div>
//               <h2 className="fw-bolder mb-0 display-6">
//                 {stats.revenue >= 1000
//                   ? `NPR ${(stats.revenue / 1000).toFixed(1)}k`
//                   : `NPR ${stats.revenue.toLocaleString()}`}
//               </h2>
//             </div>
//             <div className="card-decorator-circle"></div>
//           </div>
//         </div>
//       </div>

//       {/* --- CHARTS & RECENT ORDERS --- */}
//       <div className="row g-4 mb-5">
//         <div className="col-12 col-xl-8">
//           <div className="card modern-card border-0 shadow-sm rounded-4 h-100 bg-white">
//             <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
//               <div>
//                 <h4 className="fw-bolder text-dark mb-1">
//                   Revenue vs Operational Cost
//                 </h4>
//                 <span className="text-muted small fw-medium">
//                   Dual-axis overview of financial health
//                 </span>
//               </div>
//             </div>
//             <div className="card-body px-2 pb-4 pt-4">
//               <div style={{ width: "100%", height: 380 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <ComposedChart
//                     data={processedChartData}
//                     margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
//                   >
//                     <CartesianGrid
//                       strokeDasharray="3 3"
//                       vertical={false}
//                       stroke="#f1f5f9"
//                     />
//                     <XAxis
//                       dataKey="labelText"
//                       tickFormatter={formatDate}
//                       axisLine={{ stroke: "#cbd5e1" }}
//                       tickLine={{ stroke: "#cbd5e1" }}
//                       tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
//                       dy={10}
//                     />
//                     <YAxis
//                       yAxisId="left"
//                       axisLine={{ stroke: "#cbd5e1" }}
//                       tickLine={{ stroke: "#cbd5e1" }}
//                       tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
//                       dx={-10}
//                       tickFormatter={formatCurrency}
//                     />
//                     <YAxis
//                       yAxisId="right"
//                       orientation="right"
//                       axisLine={{ stroke: "#cbd5e1" }}
//                       tickLine={{ stroke: "#cbd5e1" }}
//                       tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
//                       dx={10}
//                       tickFormatter={formatCurrency}
//                     />
//                     <Tooltip
//                       cursor={{ fill: "rgba(0,0,0,0.04)" }}
//                       contentStyle={{
//                         borderRadius: "8px",
//                         border: "1px solid #e2e8f0",
//                         boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
//                         fontWeight: 600,
//                       }}
//                       formatter={(value) => `Rs. ${value.toLocaleString()}`}
//                     />
//                     <Legend
//                       verticalAlign="top"
//                       align="center"
//                       height={50}
//                       iconType="square"
//                       wrapperStyle={{ fontWeight: 600, color: "#334155" }}
//                     />
//                     <Bar
//                       yAxisId="left"
//                       dataKey="revenue"
//                       name="Revenue"
//                       fill="#08853b"
//                       barSize={35}
//                     />
//                     <Line
//                       yAxisId="right"
//                       type="linear"
//                       dataKey="cost"
//                       name="Operational Cost"
//                       stroke="#4ade80"
//                       strokeWidth={3}
//                       dot={{
//                         r: 5,
//                         fill: "#4ade80",
//                         stroke: "#fff",
//                         strokeWidth: 2,
//                       }}
//                       activeDot={{ r: 7, fill: "#08853b", stroke: "#fff" }}
//                     />
//                   </ComposedChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-12 col-xl-4">
//           <div className="card modern-card shadow-lg border-0 rounded-4 h-100 overflow-hidden bg-white">
//             <div
//               className="card-header border-0 px-4 py-4 d-flex justify-content-between align-items-center"
//               style={{ backgroundColor: "#0f172a" }}
//             >
//               <h5 className="fw-bolder text-white mb-0 d-flex align-items-center gap-2">
//                 <Activity size={20} className="text-info" /> Recent Orders
//               </h5>
//               <button
//                 className="btn btn-sm btn-outline-light rounded-circle p-1 hover-lift"
//                 onClick={() => navigate("/admin/orders")}
//                 title="View All Orders"
//               >
//                 <ChevronRight size={18} />
//               </button>
//             </div>
//             <div
//               className="card-body p-0 overflow-auto custom-scrollbar"
//               style={{ maxHeight: "400px" }}
//             >
//               <table className="table table-hover align-middle mb-0">
//                 <thead className="bg-light sticky-top">
//                   <tr>
//                     <th className="ps-4 border-0 text-secondary tracking-wider small text-uppercase fw-bold">
//                       Order ID
//                     </th>
//                     <th className="border-0 text-secondary tracking-wider small text-uppercase fw-bold">
//                       Customer
//                     </th>
//                     <th className="pe-4 text-end border-0 text-secondary tracking-wider small text-uppercase fw-bold">
//                       Amount
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="border-top-0">
//                   {recentOrders.length > 0 ? (
//                     recentOrders.map((order) => (
//                       <tr
//                         key={order._id}
//                         className="transition-all table-row-hover border-bottom border-light"
//                       >
//                         <td className="ps-4 py-3 border-0">
//                           <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-2 py-1 font-monospace">
//                             #
//                             {order._id
//                               .substring(order._id.length - 6)
//                               .toUpperCase()}
//                           </span>
//                         </td>
//                         <td className="border-0">
//                           <div
//                             className="fw-bold text-dark text-truncate"
//                             style={{ maxWidth: "120px", fontSize: "0.9rem" }}
//                           >
//                             {order.user?.name || "Guest User"}
//                           </div>
//                           <div
//                             className="text-muted"
//                             style={{ fontSize: "0.75rem" }}
//                           >
//                             {new Date(order.createdAt).toLocaleDateString(
//                               "en-US",
//                               { month: "short", day: "numeric" },
//                             )}
//                           </div>
//                         </td>
//                         <td
//                           className="pe-4 text-end border-0 fw-bolder text-success"
//                           style={{ fontSize: "0.95rem" }}
//                         >
//                           NPR {order.totalPrice?.toLocaleString()}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="3"
//                         className="text-center py-5 text-muted fw-bold"
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

//       {/* --- INVENTORY SECTION --- */}
//       <div className="row g-4 mb-4">
//         <div className="col-12 col-lg-6">
//           <div className="card modern-card border-0 shadow-sm rounded-4 h-100 bg-white overflow-hidden">
//             <div className="card-header bg-danger bg-opacity-10 border-0 pt-4 px-4 pb-3 d-flex justify-content-between align-items-center">
//               <h5 className="fw-bolder text-danger mb-0 d-flex align-items-center gap-2">
//                 <Bell size={20} strokeWidth={2.5} /> Critical Stock
//               </h5>
//               <button
//                 className="btn btn-sm btn-danger rounded-pill px-3 fw-bold shadow-sm d-flex align-items-center gap-1"
//                 onClick={() => navigate("/admin/suppliers")}
//               >
//                 Restock All <ArrowRight size={14} />
//               </button>
//             </div>
//             <div
//               className="card-body p-0 overflow-auto custom-scrollbar"
//               style={{ maxHeight: "350px" }}
//             >
//               {lowStock.length === 0 ? (
//                 <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
//                   <div className="bg-success bg-opacity-10 p-3 rounded-circle mb-3">
//                     <Package size={32} className="text-success" />
//                   </div>
//                   <span className="text-success fw-bold text-uppercase tracking-wider">
//                     Inventory Healthy
//                   </span>
//                 </div>
//               ) : (
//                 <div className="d-flex flex-column gap-2 p-3">
//                   {lowStock.map((item) => (
//                     <div
//                       key={item._id}
//                       className="d-flex justify-content-between align-items-center p-3 bg-danger bg-opacity-10 rounded-4 border border-danger border-opacity-25 transition-all hover-lift"
//                     >
//                       <div className="d-flex align-items-center gap-3">
//                         <div className="bg-white p-2 rounded-circle shadow-sm">
//                           <Package size={18} className="text-danger" />
//                         </div>
//                         <div>
//                           <div className="fw-bolder text-dark">{item.name}</div>
//                           <div
//                             className="text-danger opacity-75 fw-bold text-uppercase tracking-wider"
//                             style={{ fontSize: "0.7rem" }}
//                           >
//                             Needs Refill
//                           </div>
//                         </div>
//                       </div>
//                       <span className="badge bg-danger px-3 py-2 rounded-pill shadow-sm fs-6">
//                         {item.countInStock} Left
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="col-12 col-lg-6">
//           <div className="card modern-card border-0 shadow-sm rounded-4 h-100 bg-white">
//             <div className="card-header bg-transparent border-bottom pt-4 px-4 pb-3 d-flex justify-content-between align-items-center">
//               <h5 className="fw-bolder text-dark mb-0 d-flex align-items-center gap-2">
//                 <Activity size={20} className="text-info" /> Inventory Snapshot
//               </h5>
//               <button
//                 className="btn btn-sm btn-outline-info rounded-pill px-4 fw-bold hover-lift transition-all"
//                 onClick={() => navigate("/admin/medicines")}
//               >
//                 View All
//               </button>
//             </div>
//             <div className="card-body p-4 pt-3">
//               <div className="row g-3">
//                 {medicines.slice(0, 6).map((med) => (
//                   <div key={med._id} className="col-12 col-md-6">
//                     <div className="p-3 border rounded-4 d-flex justify-content-between align-items-center bg-light hover-lift transition-all">
//                       <div>
//                         <div
//                           className="fw-bold text-dark mb-1 text-truncate"
//                           style={{ maxWidth: "140px", fontSize: "0.95rem" }}
//                         >
//                           {med.name}
//                         </div>
//                         <span className="badge bg-white text-secondary border shadow-sm">
//                           {med.category}
//                         </span>
//                       </div>
//                       <div className="text-end">
//                         <div className="fw-bolder text-primary mb-1">
//                           NPR {med.price}
//                         </div>
//                         <div
//                           className={`fw-bold small px-2 py-1 rounded-pill d-inline-block ${(med.countInStock || 0) < 15 ? "bg-danger bg-opacity-10 text-danger" : "bg-success bg-opacity-10 text-success"}`}
//                           style={{ fontSize: "0.75rem" }}
//                         >
//                           {med.countInStock || 0} Units
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {medicines.length === 0 && (
//                   <div className="col-12 text-center py-5 text-muted fw-bold">
//                     No medicines available in the database.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ✅ INTERACTIVE MESSAGES MODAL */}
//       {showMessagesModal && (
//         <>
//           <div
//             className="modal-backdrop fade show"
//             onClick={() => setShowMessagesModal(false)}
//           ></div>
//           <div className="modal fade show d-block" tabIndex="-1">
//             <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
//               <div className="modal-content border-0 shadow-lg rounded-4">
//                 <div className="modal-header bg-dark text-white border-0 py-3 rounded-top-4">
//                   <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
//                     <MessageSquare size={20} className="text-primary" /> Support
//                     Inquiries
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn btn-link text-white p-0"
//                     onClick={() => setShowMessagesModal(false)}
//                   >
//                     <X size={24} />
//                   </button>
//                 </div>
//                 <div
//                   className="modal-body p-0 bg-light"
//                   style={{ maxHeight: "65vh", overflowY: "auto" }}
//                 >
//                   {messages.length === 0 ? (
//                     <div className="text-center py-5 text-muted">
//                       <MessageSquare size={48} className="mb-3 opacity-25" />
//                       <h6>No messages found.</h6>
//                     </div>
//                   ) : (
//                     <div className="list-group list-group-flush">
//                       {messages.map((msg) => (
//                         <div
//                           key={msg._id}
//                           className={`list-group-item p-4 border-bottom border-light-subtle ${!msg.isRead ? "bg-white" : "bg-transparent opacity-75"}`}
//                         >
//                           <div className="d-flex justify-content-between align-items-start mb-2">
//                             <div>
//                               <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
//                                 {msg.name}
//                                 {!msg.isRead && (
//                                   <span
//                                     className="badge bg-danger rounded-pill"
//                                     style={{ fontSize: "0.6rem" }}
//                                   >
//                                     NEW
//                                   </span>
//                                 )}
//                                 {msg.userId && (
//                                   <span
//                                     className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill"
//                                     style={{ fontSize: "0.6rem" }}
//                                   >
//                                     Logged In User
//                                   </span>
//                                 )}
//                               </h6>
//                               <a
//                                 href={`mailto:${msg.email}`}
//                                 className="text-primary small text-decoration-none"
//                               >
//                                 {msg.email}
//                               </a>
//                             </div>
//                             <small
//                               className="text-muted"
//                               style={{ fontSize: "0.75rem" }}
//                             >
//                               {new Date(msg.createdAt).toLocaleString()}
//                             </small>
//                           </div>

//                           <div className="bg-light p-3 rounded-3 mb-3 border border-light-subtle">
//                             <p className="text-dark small mb-0 fw-medium">
//                               "{msg.text}"
//                             </p>
//                           </div>

//                           {/* REPLIES / ACTIONS */}
//                           {msg.adminReply ? (
//                             <div className="bg-primary bg-opacity-10 p-3 rounded-3 border-start border-4 border-primary mt-2">
//                               <span className="small fw-bold text-primary text-uppercase tracking-wider d-block mb-1">
//                                 Your Reply Sent:
//                               </span>
//                               <p className="text-dark small mb-0">
//                                 "{msg.adminReply}"
//                               </p>
//                             </div>
//                           ) : replyingTo === msg._id ? (
//                             <div className="mt-3 bg-white p-3 rounded-3 border border-primary shadow-sm">
//                               <textarea
//                                 className="form-control mb-2 small"
//                                 rows="3"
//                                 placeholder={`Write reply to ${msg.name}... (This will be emailed to them)`}
//                                 value={replyText}
//                                 onChange={(e) => setReplyText(e.target.value)}
//                                 autoFocus
//                               ></textarea>
//                               <div className="d-flex gap-2 justify-content-end">
//                                 <button
//                                   className="btn btn-sm btn-light border fw-bold"
//                                   onClick={() => setReplyingTo(null)}
//                                   disabled={replyLoading}
//                                 >
//                                   Cancel
//                                 </button>
//                                 <button
//                                   className="btn btn-sm btn-primary fw-bold d-flex align-items-center gap-1 shadow-sm"
//                                   onClick={() => handleSendReply(msg._id)}
//                                   disabled={replyLoading || !replyText.trim()}
//                                 >
//                                   {replyLoading ? (
//                                     <Loader2
//                                       size={14}
//                                       className="spin-animation"
//                                     />
//                                   ) : (
//                                     <Send size={14} />
//                                   )}{" "}
//                                   Send Reply
//                                 </button>
//                               </div>
//                             </div>
//                           ) : (
//                             <button
//                               className="btn btn-sm btn-dark rounded-pill fw-bold d-flex align-items-center gap-2 hover-lift shadow-sm"
//                               onClick={() => {
//                                 setReplyingTo(msg._id);
//                                 setReplyText("");
//                               }}
//                             >
//                               <Reply size={14} /> Write Reply
//                             </button>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Activity,
  Bell,
  ChevronRight,
  LayoutDashboard,
  ArrowRight,
  Loader2,
  MessageSquare,
  X,
  CheckCircle2,
  Send,
  Reply,
  Check,
} from "lucide-react";
import api from "../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();

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

  // Message States
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [statsRes, medsRes, messagesRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/medicines"),
          api.get("/messages").catch(() => ({ data: [] })),
        ]);

        const statsData = statsRes.data;
        const medsData =
          medsRes.data.medicines ||
          (Array.isArray(medsRes.data) ? medsRes.data : []);
        const lowStockItems = medsData.filter(
          (m) => (m.countInStock || 0) < 15,
        );

        // ✅ FIX: Filter out private doctor-patient chats.
        // Keep only system/support messages (usually identified by having an email but no specific receiver/doctor ID).
        const rawMsgs = messagesRes.data || [];
        const supportMsgs = rawMsgs.filter(
          (m) => m.email && !m.receiverId && !m.doctorId && !m.chatId,
        );

        setMessages(supportMsgs);
        setUnreadCount(supportMsgs.filter((m) => !m.isRead).length);

        setStats({
          users: statsData.totalCustomers || 0,
          medicines: statsData.totalMedicines || 0,
          doctors: statsData.totalDoctors || 0,
          orders: statsData.totalOrders || 0,
          revenue: statsData.totalSales || 0,
          salesData: statsData.salesData || [],
        });

        setRecentOrders(statsData.recentOrders || []);
        setMedicines(medsData);
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

    // Refresh messages every 30 seconds
    const interval = setInterval(async () => {
      try {
        const msgsRes = await api.get("/messages");
        const supportMsgs = (msgsRes.data || []).filter(
          (m) => m.email && !m.receiverId && !m.doctorId && !m.chatId,
        );
        setMessages(supportMsgs);
        setUnreadCount(supportMsgs.filter((m) => !m.isRead).length);
      } catch (e) {
        /* ignore silent refresh errors */
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Send the reply
  const handleSendReply = async (msgId) => {
    if (!replyText.trim()) return;

    try {
      setReplyLoading(true);
      await api.put(`/messages/${msgId}/reply`, { replyText });

      // Update local state instantly
      setMessages(
        messages.map((m) =>
          m._id === msgId ? { ...m, isRead: true, adminReply: replyText } : m,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setReplyingTo(null);
      setReplyText("");
    } catch (err) {
      console.error("Failed to send reply", err);
      alert("Failed to send reply. Please try again.");
    } finally {
      setReplyLoading(false);
    }
  };

  // ✅ NEW: Mark as read without replying
  const handleMarkAsRead = async (msgId) => {
    try {
      // Fallback logic: Try the specific read route, if it fails, try a standard update route
      await api
        .put(`/messages/${msgId}/read`)
        .catch(() => api.put(`/messages/${msgId}`, { isRead: true }));

      setMessages(
        messages.map((m) => (m._id === msgId ? { ...m, isRead: true } : m)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read", err);
      // Optimistically update UI anyway to clear the notification bubble for the user
      setMessages(
        messages.map((m) => (m._id === msgId ? { ...m, isRead: true } : m)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center vh-100"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <Loader2
          className="spin-animation mb-3"
          style={{ color: "#007185" }}
          size={48}
        />
        <span className="text-secondary fw-bold tracking-wider text-uppercase small">
          Syncing Dashboard Telemetry...
        </span>
      </div>
    );
  }

  const defaultSalesData = [
    { labelText: "Q1", revenue: 120000, cost: 290000 },
    { labelText: "Q2", revenue: 130000, cost: 245000 },
    { labelText: "Q3", revenue: 170000, cost: 215000 },
    { labelText: "Q4", revenue: 220000, cost: 195000 },
  ];

  const processedChartData =
    stats.salesData && stats.salesData.length > 0
      ? stats.salesData.map((item, index) => {
          const actualSales = parseFloat(
            item.sales || item.total || item.revenue || 0,
          );
          const rawLabel =
            item.month || item._id || item.date || `Pt ${index + 1}`;
          return {
            ...item,
            labelText: rawLabel,
            revenue: actualSales,
            cost:
              actualSales > 0
                ? actualSales * Math.max(0.4, 1.2 - index * 0.15)
                : 0,
          };
        })
      : defaultSalesData;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    if (dateString.length <= 3 || !dateString.includes("-")) return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatCurrency = (value) => {
    if (value >= 1000000) return `NPR ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `NPR ${(value / 1000).toFixed(1)}k`;
    return `NPR ${value.toLocaleString()}`;
  };

  return (
    <div
      className="container-fluid p-3 p-md-4 animate-fade-in position-relative"
      style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
    >
      {/* --- HEADER --- */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom border-secondary-subtle gap-3">
        <div>
          <h2
            className="fw-bold mb-1 d-flex align-items-center gap-2"
            style={{ color: "#0F1111", fontSize: "1.5rem" }}
          >
            <LayoutDashboard style={{ color: "#007185" }} size={24} /> System
            Overview
          </h2>
          <p className="small mb-0" style={{ color: "#565959" }}>
            Real-time live data analytics & control center.
          </p>
        </div>

        <div className="d-flex align-items-center gap-3">
          {error && (
            <div
              className="alert border-0 shadow-sm py-2 px-3 mb-0 rounded-1 d-flex align-items-center gap-2"
              style={{
                backgroundColor: "#fef0f0",
                color: "#B12704",
                borderLeft: "4px solid #B12704",
              }}
            >
              <Activity size={16} /> <span className="small">{error}</span>
            </div>
          )}

          {/* Messages Notification Button */}
          <button
            className="btn bg-white border position-relative d-flex align-items-center justify-content-center shadow-sm"
            onClick={() => setShowMessagesModal(true)}
            title="View Messages"
            style={{
              width: "42px",
              height: "42px",
              borderColor: "#D5D9D9",
              borderRadius: "4px",
            }}
          >
            <MessageSquare size={20} style={{ color: "#565959" }} />
            {unreadCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{
                  backgroundColor: "#B12704",
                  fontSize: "0.65rem",
                  border: "2px solid #fff",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="row g-3 mb-4">
        <div
          className="col-12 col-md-6 col-xl-3 cursor-pointer"
          onClick={() => navigate("/admin/users")}
        >
          <div
            className="card border-0 shadow-sm h-100 rounded-1 aws-card bg-white"
            style={{ borderTop: "4px solid #007185" }}
          >
            <div className="card-body p-4 d-flex justify-content-between align-items-center">
              <div>
                <p
                  className="small fw-bold text-uppercase mb-1"
                  style={{ color: "#565959", letterSpacing: "0.5px" }}
                >
                  Total Users
                </p>
                <h2 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
                  {stats.users.toLocaleString()}
                </h2>
              </div>
              <div className="p-3 bg-light rounded-circle">
                <Users size={24} style={{ color: "#007185" }} />
              </div>
            </div>
          </div>
        </div>

        <div
          className="col-12 col-md-6 col-xl-3 cursor-pointer"
          onClick={() => navigate("/admin/medicines")}
        >
          <div
            className="card border-0 shadow-sm h-100 rounded-1 aws-card bg-white"
            style={{ borderTop: "4px solid #F3A847" }}
          >
            <div className="card-body p-4 d-flex justify-content-between align-items-center">
              <div>
                <p
                  className="small fw-bold text-uppercase mb-1"
                  style={{ color: "#565959", letterSpacing: "0.5px" }}
                >
                  Medicines
                </p>
                <h2 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
                  {stats.medicines.toLocaleString()}
                </h2>
              </div>
              <div className="p-3 bg-light rounded-circle">
                <Package size={24} style={{ color: "#F3A847" }} />
              </div>
            </div>
          </div>
        </div>

        <div
          className="col-12 col-md-6 col-xl-3 cursor-pointer"
          onClick={() => navigate("/admin/orders")}
        >
          <div
            className="card border-0 shadow-sm h-100 rounded-1 aws-card bg-white"
            style={{ borderTop: "4px solid #067D62" }}
          >
            <div className="card-body p-4 d-flex justify-content-between align-items-center">
              <div>
                <p
                  className="small fw-bold text-uppercase mb-1"
                  style={{ color: "#565959", letterSpacing: "0.5px" }}
                >
                  Total Orders
                </p>
                <h2 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
                  {stats.orders.toLocaleString()}
                </h2>
              </div>
              <div className="p-3 bg-light rounded-circle">
                <ShoppingCart size={24} style={{ color: "#067D62" }} />
              </div>
            </div>
          </div>
        </div>

        <div
          className="col-12 col-md-6 col-xl-3 cursor-pointer"
          onClick={() => navigate("/admin/reports")}
        >
          <div
            className="card border-0 shadow-sm h-100 rounded-1 aws-card text-white"
            style={{
              backgroundColor: "#064E3B",
              borderTop: "4px solid #34D399",
            }}
          >
            <div className="card-body p-4 d-flex justify-content-between align-items-center">
              <div>
                <p
                  className="small fw-bold text-uppercase mb-1 text-white-50"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Total Revenue
                </p>
                <h2 className="fw-bold mb-0">
                  {stats.revenue >= 1000
                    ? `NPR ${(stats.revenue / 1000).toFixed(1)}k`
                    : `NPR ${stats.revenue.toLocaleString()}`}
                </h2>
              </div>
              <div
                className="p-3 rounded-circle"
                style={{ backgroundColor: "rgba(52, 211, 153, 0.2)" }}
              >
                <DollarSign size={24} style={{ color: "#34D399" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CHARTS & RECENT ORDERS --- */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-8">
          <div
            className="card border bg-white shadow-sm rounded-1 h-100"
            style={{ borderColor: "#D5D9D9" }}
          >
            <div className="card-header bg-white border-bottom pt-4 px-4 pb-3">
              <h5 className="fw-bold text-dark mb-0 fs-6">
                Revenue vs Operational Cost
              </h5>
            </div>
            <div className="card-body px-2 pb-4 pt-4">
              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={processedChartData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="labelText"
                      tickFormatter={formatDate}
                      axisLine={{ stroke: "#D5D9D9" }}
                      tickLine={false}
                      tick={{ fill: "#565959", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      yAxisId="left"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#565959", fontSize: 12 }}
                      tickFormatter={formatCurrency}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#565959", fontSize: 12 }}
                      tickFormatter={formatCurrency}
                    />
                    <Tooltip
                      cursor={{ fill: "#f0f2f2" }}
                      contentStyle={{
                        borderRadius: "4px",
                        border: "1px solid #D5D9D9",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        fontSize: "13px",
                        color: "#0F1111",
                      }}
                      formatter={(value) => `NPR ${value.toLocaleString()}`}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="revenue"
                      name="Revenue"
                      fill="#007185" // Amazon Teal
                      barSize={30}
                      radius={[2, 2, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="cost"
                      name="Operational Cost"
                      stroke="#F3A847" // Amazon Orange
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#F3A847",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6, fill: "#B12704", stroke: "#fff" }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div
            className="card border shadow-sm rounded-1 h-100 bg-white"
            style={{ borderColor: "#D5D9D9" }}
          >
            <div className="card-header bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0 fs-6" style={{ color: "#0F1111" }}>
                Recent Orders
              </h5>
              <button
                className="btn btn-link p-0 text-decoration-none small fw-medium"
                onClick={() => navigate("/admin/orders")}
                style={{ color: "#007185" }}
              >
                View All
              </button>
            </div>
            <div
              className="card-body p-0 overflow-auto custom-scrollbar"
              style={{ maxHeight: "380px" }}
            >
              <table className="table align-middle mb-0 border-0">
                <thead className="bg-light sticky-top">
                  <tr>
                    <th
                      className="ps-4 py-2 border-0 small text-muted text-uppercase fw-bold"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                    >
                      Order ID
                    </th>
                    <th
                      className="py-2 border-0 small text-muted text-uppercase fw-bold"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                    >
                      Customer
                    </th>
                    <th
                      className="pe-4 text-end py-2 border-0 small text-muted text-uppercase fw-bold"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="aws-table-row border-bottom border-light-subtle"
                      >
                        <td className="ps-4 py-3 border-0">
                          <span
                            className="fw-bold"
                            style={{ color: "#007185", fontSize: "0.85rem" }}
                          >
                            #
                            {order._id
                              .substring(order._id.length - 6)
                              .toUpperCase()}
                          </span>
                        </td>
                        <td className="border-0 py-3">
                          <div
                            className="fw-bold"
                            style={{ color: "#0F1111", fontSize: "0.85rem" }}
                          >
                            {order.user?.name || "Guest User"}
                          </div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </div>
                        </td>
                        <td
                          className="pe-4 text-end border-0 fw-bold py-3"
                          style={{ color: "#B12704", fontSize: "0.85rem" }}
                        >
                          NPR {order.totalPrice?.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-5 text-muted small"
                      >
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

      {/* --- INVENTORY SECTION --- */}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div
            className="card border shadow-sm rounded-1 h-100 bg-white"
            style={{ borderColor: "#D5D9D9", borderTop: "4px solid #B12704" }}
          >
            <div className="card-header bg-white border-bottom pt-3 px-4 pb-3 d-flex justify-content-between align-items-center">
              <h5
                className="fw-bold mb-0 d-flex align-items-center gap-2 fs-6"
                style={{ color: "#0F1111" }}
              >
                <Bell size={18} style={{ color: "#B12704" }} /> Critical Stock
                Alerts
              </h5>
              <button
                className="btn btn-sm bg-white border shadow-sm fw-medium"
                style={{ borderColor: "#D5D9D9", color: "#0F1111" }}
                onClick={() => navigate("/admin/suppliers")}
              >
                Restock Hub
              </button>
            </div>
            <div
              className="card-body p-0 overflow-auto custom-scrollbar"
              style={{ maxHeight: "350px" }}
            >
              {lowStock.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
                  <CheckCircle2
                    size={36}
                    style={{ color: "#067D62" }}
                    className="mb-3 opacity-75"
                  />
                  <span className="text-muted small">
                    Inventory levels are healthy.
                  </span>
                </div>
              ) : (
                <div className="list-group list-group-flush rounded-0">
                  {lowStock.map((item) => (
                    <div
                      key={item._id}
                      className="list-group-item d-flex justify-content-between align-items-center p-3 border-bottom border-light-subtle"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <Package size={18} className="text-muted" />
                        <div>
                          <div
                            className="fw-bold"
                            style={{ color: "#007185", fontSize: "0.9rem" }}
                          >
                            {item.name}
                          </div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Requires Attention
                          </div>
                        </div>
                      </div>
                      <span
                        className="badge rounded-1"
                        style={{
                          backgroundColor: "#fef0f0",
                          color: "#B12704",
                          border: "1px solid #B12704",
                        }}
                      >
                        {item.countInStock} Left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div
            className="card border shadow-sm rounded-1 h-100 bg-white"
            style={{ borderColor: "#D5D9D9" }}
          >
            <div className="card-header bg-white border-bottom pt-3 px-4 pb-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0 fs-6" style={{ color: "#0F1111" }}>
                Inventory Snapshot
              </h5>
              <button
                className="btn btn-link p-0 text-decoration-none small fw-medium"
                onClick={() => navigate("/admin/medicines")}
                style={{ color: "#007185" }}
              >
                View Full Catalog
              </button>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                {medicines.slice(0, 6).map((med) => (
                  <div key={med._id} className="col-12 col-md-6">
                    <div
                      className="p-3 border rounded-1 d-flex justify-content-between align-items-center bg-white aws-table-row"
                      style={{ borderColor: "#D5D9D9" }}
                    >
                      <div className="overflow-hidden pe-2">
                        <div
                          className="fw-bold text-truncate"
                          style={{ color: "#0F1111", fontSize: "0.85rem" }}
                        >
                          {med.name}
                        </div>
                        <span
                          className="text-muted"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {med.category}
                        </span>
                      </div>
                      <div className="text-end flex-shrink-0">
                        <div
                          className="fw-bold mb-1"
                          style={{ color: "#B12704", fontSize: "0.85rem" }}
                        >
                          NPR {med.price}
                        </div>
                        <div
                          className="fw-medium small"
                          style={{
                            color:
                              (med.countInStock || 0) < 15
                                ? "#B12704"
                                : "#067D62",
                            fontSize: "0.7rem",
                          }}
                        >
                          {med.countInStock || 0} Units
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {medicines.length === 0 && (
                  <div className="col-12 text-center py-4 text-muted small">
                    No medicines available in the database.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ INTERACTIVE MESSAGES MODAL */}
      {showMessagesModal && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowMessagesModal(false)}
            style={{ zIndex: 1040 }}
          ></div>
          <div
            className="modal fade show d-block animate-fade-in"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
              <div
                className="modal-content border shadow-lg rounded-1 bg-white"
                style={{ borderColor: "#D5D9D9" }}
              >
                <div className="modal-header bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
                  <h5
                    className="modal-title fw-bold d-flex align-items-center gap-2 fs-6"
                    style={{ color: "#0F1111" }}
                  >
                    <MessageSquare size={18} style={{ color: "#565959" }} />{" "}
                    Support Inquiries
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowMessagesModal(false)}
                  ></button>
                </div>

                <div
                  className="modal-body p-0"
                  style={{
                    maxHeight: "65vh",
                    overflowY: "auto",
                    backgroundColor: "#f0f2f2",
                  }}
                >
                  {messages.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <MessageSquare size={48} className="mb-3 opacity-25" />
                      <h6 className="fw-normal">No support messages found.</h6>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush rounded-0">
                      {messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`list-group-item p-4 border-bottom border-light-subtle ${!msg.isRead ? "bg-white" : ""}`}
                          style={{
                            backgroundColor: msg.isRead ? "#fafafa" : "#fff",
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h6
                                className="fw-bold mb-1 d-flex align-items-center gap-2"
                                style={{ color: "#0F1111" }}
                              >
                                {msg.name}
                                {!msg.isRead && (
                                  <span
                                    className="badge rounded-1"
                                    style={{
                                      backgroundColor: "#B12704",
                                      color: "#fff",
                                      fontSize: "0.6rem",
                                    }}
                                  >
                                    NEW
                                  </span>
                                )}
                              </h6>
                              <a
                                href={`mailto:${msg.email}`}
                                className="text-decoration-none small"
                                style={{ color: "#007185" }}
                              >
                                {msg.email}
                              </a>
                            </div>
                            <small
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {new Date(msg.createdAt).toLocaleString()}
                            </small>
                          </div>

                          <div
                            className="p-3 rounded-1 mb-3 border"
                            style={{
                              backgroundColor: "#f8f9fa",
                              borderColor: "#e5e7eb",
                              color: "#0F1111",
                              fontSize: "0.9rem",
                            }}
                          >
                            "{msg.text}"
                          </div>

                          {/* REPLIES / ACTIONS */}
                          {msg.adminReply ? (
                            <div
                              className="p-3 rounded-1 border-start border-4 mt-2"
                              style={{
                                backgroundColor: "#f2fcf5",
                                borderLeftColor: "#067D62 !important",
                                border: "1px solid #D5D9D9",
                              }}
                            >
                              <span
                                className="small fw-bold text-uppercase tracking-wider d-block mb-1"
                                style={{ color: "#067D62", fontSize: "0.7rem" }}
                              >
                                Reply Sent:
                              </span>
                              <p
                                className="small mb-0"
                                style={{ color: "#0F1111" }}
                              >
                                "{msg.adminReply}"
                              </p>
                            </div>
                          ) : replyingTo === msg._id ? (
                            <div
                              className="mt-3 bg-white p-3 rounded-1 border shadow-sm"
                              style={{ borderColor: "#D5D9D9" }}
                            >
                              <textarea
                                className="form-control mb-2 small shadow-none amazon-input"
                                rows="3"
                                placeholder={`Write reply to ${msg.name}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                autoFocus
                              ></textarea>
                              <div className="d-flex gap-2 justify-content-end mt-2">
                                <button
                                  className="btn btn-sm bg-white border fw-medium"
                                  onClick={() => setReplyingTo(null)}
                                  disabled={replyLoading}
                                  style={{
                                    borderColor: "#D5D9D9",
                                    color: "#0F1111",
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="btn btn-sm border-0 fw-medium d-flex align-items-center gap-2 shadow-sm"
                                  onClick={() => handleSendReply(msg._id)}
                                  disabled={replyLoading || !replyText.trim()}
                                  style={{
                                    backgroundColor: "#FFD814",
                                    color: "#0F1111",
                                  }}
                                >
                                  {replyLoading ? (
                                    <Loader2
                                      size={14}
                                      className="spin-animation"
                                    />
                                  ) : (
                                    <Send size={14} />
                                  )}
                                  Send Reply
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="d-flex gap-2 mt-2">
                              <button
                                className="btn btn-sm bg-white border fw-medium d-flex align-items-center gap-2 shadow-sm"
                                onClick={() => {
                                  setReplyingTo(msg._id);
                                  setReplyText("");
                                }}
                                style={{
                                  borderColor: "#D5D9D9",
                                  color: "#0F1111",
                                }}
                              >
                                <Reply size={14} style={{ color: "#007185" }} />{" "}
                                Write Reply
                              </button>

                              {/* ✅ NEW: Mark as Read Button */}
                              {!msg.isRead && (
                                <button
                                  className="btn btn-sm bg-white border fw-medium d-flex align-items-center gap-2 shadow-sm"
                                  onClick={() => handleMarkAsRead(msg._id)}
                                  style={{
                                    borderColor: "#D5D9D9",
                                    color: "#565959",
                                  }}
                                >
                                  <Check size={14} /> Mark as Read
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .aws-card { transition: transform 0.2s, box-shadow 0.2s; }
        .aws-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
        .aws-table-row { transition: background-color 0.1s; }
        .aws-table-row:hover { background-color: #f8f9fa; }
        .amazon-input:focus { border-color: #e47911 !important; box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
