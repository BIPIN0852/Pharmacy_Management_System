// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Users,
//   Package,
//   ShoppingCart,
//   LogOut,
//   Bell,
//   Sun,
//   Moon,
//   Menu,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import avatar from "../assets/avatar.jpg";

// const API_BASE_URL = "http://localhost:5000/api";

// // Sorting hook
// function useSortableData(items, config = null) {
//   const [sortConfig, setSortConfig] = useState(config);
//   const sortedItems = useMemo(() => {
//     const sortable = [...items];
//     if (sortConfig !== null) {
//       const { key, direction } = sortConfig;
//       sortable.sort((a, b) => {
//         const av = a[key];
//         const bv = b[key];
//         if (typeof av === "number" && typeof bv === "number") {
//           return direction === "ascending" ? av - bv : bv - av;
//         }
//         const sa = String(av ?? "").toLowerCase();
//         const sb = String(bv ?? "").toLowerCase();
//         if (sa < sb) return direction === "ascending" ? -1 : 1;
//         if (sa > sb) return direction === "ascending" ? 1 : -1;
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

// const TablePagination = ({
//   total,
//   page,
//   pageSize,
//   onPageChange,
//   onPageSizeChange,
// }) => {
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//   return (
//     <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
//       <div className="d-flex align-items-center gap-2">
//         <button
//           className="btn btn-primary btn-sm"
//           onClick={() => onPageChange(Math.max(1, page - 1))}
//           disabled={page === 1}
//         >
//           Prev
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           className="btn btn-primary btn-sm"
//           onClick={() => onPageChange(Math.min(totalPages, page + 1))}
//           disabled={page === totalPages}
//         >
//           Next
//         </button>
//       </div>
//       <div className="d-flex align-items-center gap-2">
//         <label className="mb-0">Rows</label>
//         <select
//           value={pageSize}
//           onChange={(e) => onPageSizeChange(Number(e.target.value))}
//           className="form-select form-select-sm"
//           style={{ width: "70px" }}
//         >
//           {[5, 10, 15].map((s) => (
//             <option key={s} value={s}>
//               {s}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// const PharmacistDashboard = () => {
//   const navigate = useNavigate();

//   // layout/ui
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);
//   const [activeSection, setActiveSection] = useState("dashboard"); // dashboard | orders | medicines

//   // orders
//   const [ordersQuery, setOrdersQuery] = useState("");
//   const [ordersPage, setOrdersPage] = useState(1);
//   const [ordersPageSize, setOrdersPageSize] = useState(5);
//   const [orders, setOrders] = useState([]);

//   // medicines
//   const [medicines, setMedicines] = useState([]);
//   const [medQuery, setMedQuery] = useState("");
//   const [medPage, setMedPage] = useState(1);
//   const [medPageSize, setMedPageSize] = useState(5);

//   // extra data
//   const [prescriptionsData, setPrescriptionsData] = useState([]);
//   const [appointmentsData, setAppointmentsData] = useState([]);
//   const [doctorsData, setDoctorsData] = useState([]);
//   const [loadingExtra, setLoadingExtra] = useState(true);
//   const [extraError, setExtraError] = useState("");

//   const [prescriptionsPreview, setPrescriptionsPreview] = useState({});

//   const bgMain = darkMode ? "bg-dark text-light" : "bg-light text-dark";
//   const cardBg = darkMode ? "bg-secondary" : "bg-white";

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login", { replace: true });
//       return;
//     }

//     const fetchAll = async () => {
//       try {
//         setLoadingExtra(true);
//         setExtraError("");
//         const headers = { Authorization: `Bearer ${token}` };

//         const [ordersRes, medsRes, pRes, aRes, dRes] = await Promise.all([
//           fetch(`${API_BASE_URL}/pharmacist/orders`, { headers }),
//           fetch(`${API_BASE_URL}/pharmacist/medicines`, { headers }),
//           fetch(`${API_BASE_URL}/pharmacist/prescriptions`, { headers }),
//           fetch(`${API_BASE_URL}/appointments/pharmacist/appointments`, {
//             headers,
//           }),
//           fetch(`${API_BASE_URL}/pharmacist/doctors`, { headers }),
//         ]);

//         if (!ordersRes.ok) throw new Error("Failed to fetch orders");
//         if (!medsRes.ok) throw new Error("Failed to fetch medicines");
//         if (!pRes.ok) throw new Error("Failed to fetch prescriptions");
//         if (!aRes.ok) throw new Error("Failed to fetch appointments");
//         if (!dRes.ok) throw new Error("Failed to fetch doctors");

//         const [ordersData, medsData, pData, aData, dData] = await Promise.all([
//           ordersRes.json(),
//           medsRes.json(),
//           pRes.json(),
//           aRes.json(),
//           dRes.json(),
//         ]);

//         setOrders(Array.isArray(ordersData) ? ordersData : []);
//         setMedicines(Array.isArray(medsData) ? medsData : []);
//         setPrescriptionsData(Array.isArray(pData) ? pData : []);
//         setAppointmentsData(Array.isArray(aData) ? aData : []);
//         setDoctorsData(Array.isArray(dData) ? dData : []);
//       } catch (err) {
//         console.error("Pharmacist dashboard fetch error:", err);
//         setExtraError(err.message || "Failed to load dashboard data");
//         setOrders([]);
//         setMedicines([]);
//         setPrescriptionsData([]);
//         setAppointmentsData([]);
//         setDoctorsData([]);
//       } finally {
//         setLoadingExtra(false);
//       }
//     };

//     fetchAll();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handlePrescriptionUpload = (orderId, file) => {
//     if (!file) return;
//     setPrescriptionsPreview((prev) => ({
//       ...prev,
//       [orderId]: URL.createObjectURL(file),
//     }));
//   };

//   // demo payment handlers
//   const handleStripePayment = (orderId) => {
//     alert("Redirecting to Stripe Checkout (demo)...");
//     setOrders((prev) =>
//       prev.map((o) =>
//         o.id === orderId ? { ...o, paymentStatus: "Paid via Stripe" } : o
//       )
//     );
//   };
//   const handleESWAPayment = (orderId) => {
//     alert("Processing ESWA payment (demo)...");
//     setOrders((prev) =>
//       prev.map((o) =>
//         o.id === orderId ? { ...o, paymentStatus: "Paid via ESWA" } : o
//       )
//     );
//   };
//   const handleCODPayment = (orderId) => {
//     alert("Order marked as Cash on Delivery (demo).");
//     setOrders((prev) =>
//       prev.map((o) =>
//         o.id === orderId ? { ...o, paymentStatus: "Pending (COD)" } : o
//       )
//     );
//   };

//   const menuItems = [
//     { key: "dashboard", name: "Dashboard", icon: Users },
//     { key: "orders", name: "Orders", icon: ShoppingCart },
//     { key: "medicines", name: "Medicines", icon: Package },
//   ];

//   // Orders list
//   const { items: sortedOrders, requestSort: requestSortOrder } =
//     useSortableData(orders);
//   const filteredOrders = sortedOrders.filter((o) => {
//     const q = ordersQuery.toLowerCase();
//     return (
//       o.customer?.toLowerCase().includes(q) ||
//       o.medicine?.toLowerCase().includes(q) ||
//       String(o.id ?? o._id).includes(q)
//     );
//   });
//   const ordersPageItems = filteredOrders.slice(
//     (ordersPage - 1) * ordersPageSize,
//     ordersPage * ordersPageSize
//   );

//   // Medicines list
//   const { items: sortedMeds, requestSort: requestSortMed } =
//     useSortableData(medicines);
//   const filteredMeds = sortedMeds.filter((m) => {
//     const q = medQuery.toLowerCase();
//     return (
//       m.name?.toLowerCase().includes(q) ||
//       m.category?.toLowerCase().includes(q) ||
//       String(m.id ?? m._id).includes(q)
//     );
//   });
//   const medsPageItems = filteredMeds.slice(
//     (medPage - 1) * medPageSize,
//     medPage * medPageSize
//   );

//   return (
//     <div
//       className={`d-flex min-vh-100 flex-column ${bgMain}`}
//       style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//     >
//       {/* Mobile top bar (same pattern as customer) */}
//       <header className="d-flex d-lg-none justify-content-between align-items-center bg-primary text-light px-3 py-2 sticky-top">
//         <button
//           className="btn btn-primary"
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           aria-label="Toggle Menu"
//         >
//           <Menu size={22} />
//         </button>
//         <span className="fs-5 fw-semibold">Pharmacist Workspace</span>
//       </header>

//       {/* Sidebar (same slide logic as CustomerDashboard) */}
//       <aside
//         className={`position-fixed top-0 vh-100 p-3 d-flex flex-column ${cardBg} border-end`}
//         style={{
//           width: "240px",
//           transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
//           transition: "transform 0.25s ease-out",
//           zIndex: 1040,
//         }}
//       >
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h1
//             className="h5 text-primary cursor-pointer mb-0"
//             onClick={() => setActiveSection("dashboard")}
//           >
//             Pharmacy Panel
//           </h1>
//           <button
//             className="btn btn-outline-secondary d-lg-none"
//             onClick={() => setSidebarOpen(false)}
//             aria-label="Close Menu"
//           >
//             ×
//           </button>
//         </div>

//         <nav className="flex-grow-1">
//           <ul className="nav flex-column gap-2">
//             {menuItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = activeSection === item.key;
//               return (
//                 <li key={item.key} className="nav-item">
//                   <button
//                     type="button"
//                     className={`btn align-items-center rounded w-100 text-start d-flex py-2 px-2 ${
//                       isActive ? "bg-primary text-white" : ""
//                     }`}
//                     onClick={() => setActiveSection(item.key)}
//                   >
//                     <Icon size={20} />
//                     <span className="ms-2">{item.name}</span>
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         <div className="mt-auto d-flex flex-column gap-2">
//           <button
//             className="btn btn-outline-primary d-flex align-items-center gap-2"
//             onClick={() => setDarkMode(!darkMode)}
//           >
//             {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//             <span>{darkMode ? "Light" : "Dark"} Mode</span>
//           </button>
//           <button
//             className="btn btn-outline-danger d-flex align-items-center gap-2"
//             onClick={handleLogout}
//           >
//             <LogOut size={20} />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main content – marginLeft tied to sidebarOpen, same as customer */}
//       <main
//         className="flex-grow-1 p-3"
//         style={{
//           marginLeft: sidebarOpen ? "240px" : 0,
//           transition: "margin-left 0.25s ease-out",
//         }}
//       >
//         {/* Top bar */}
//         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
//           <span className="fs-4 fw-semibold">
//             {activeSection === "dashboard"
//               ? "Pharmacist Overview"
//               : activeSection === "orders"
//               ? "Customer Orders"
//               : "Medicine Inventory"}
//           </span>
//           <div className="d-flex align-items-center gap-3">
//             <Bell size={22} className="cursor-pointer" />
//             <img
//               src={avatar}
//               alt="avatar"
//               className="rounded-circle border border-primary"
//               width={40}
//               height={40}
//             />
//           </div>
//         </div>

//         <div className="row g-3">
//           {/* DASHBOARD */}
//           {activeSection === "dashboard" && (
//             <>
//               {/* Prescriptions */}
//               <section className="col-12 col-lg-6">
//                 <div className={`${cardBg} card`}>
//                   <div className="card-header bg-primary text-white">
//                     <h5 className="mb-0">Customer Prescriptions</h5>
//                   </div>
//                   <div
//                     className="card-body"
//                     style={{ maxHeight: 300, overflowY: "auto" }}
//                   >
//                     {loadingExtra && <p>Loading prescriptions...</p>}
//                     {!loadingExtra && prescriptionsData.length === 0 && (
//                       <p>No prescriptions uploaded yet.</p>
//                     )}
//                     {prescriptionsData.map((p) => (
//                       <div
//                         key={p._id}
//                         className="d-flex justify-content-between align-items-center mb-3 border rounded p-2"
//                       >
//                         <div className="me-2">
//                           <div className="fw-semibold">
//                             {p.customerName} ({p.customerEmail})
//                           </div>
//                           <small className="text-muted">
//                             Status: {p.status} · Uploaded:{" "}
//                             {new Date(p.createdAt).toLocaleString()}
//                           </small>
//                         </div>
//                         {p.imageUrl && (
//                           <img
//                             src={p.imageUrl}
//                             alt="prescription"
//                             width={64}
//                             height={64}
//                             className="rounded flex-shrink-0"
//                             style={{ objectFit: "cover" }}
//                           />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </section>

//               {/* Appointments */}
//               <section className="col-12 col-lg-6">
//                 <div className={`${cardBg} card`}>
//                   <div className="card-header bg-primary text-white">
//                     <h5 className="mb-0">Doctor Appointments</h5>
//                   </div>
//                   <div
//                     className="card-body"
//                     style={{ maxHeight: 300, overflowY: "auto" }}
//                   >
//                     {loadingExtra && <p>Loading appointments...</p>}
//                     {!loadingExtra && appointmentsData.length === 0 && (
//                       <p>No appointments reserved yet.</p>
//                     )}
//                     {appointmentsData.map((a) => (
//                       <div
//                         key={a._id}
//                         className="d-flex justify-content-between align-items-center mb-3 border rounded p-2"
//                       >
//                         <div className="me-2">
//                           <div className="fw-semibold">
//                             {a.customerName} ({a.customerEmail})
//                           </div>
//                           <small className="text-muted d-block">
//                             Doctor: {a.doctorName} ({a.doctorSpeciality}) · NMC:{" "}
//                             {a.doctorNMC}
//                           </small>
//                         </div>
//                         <div
//                           className="text-end small flex-shrink-0"
//                           style={{ minWidth: 110 }}
//                         >
//                           <div>{a.date}</div>
//                           <div>{a.timeSlot}</div>
//                           <div>Status: {a.status}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </section>

//               {/* Doctors */}
//               <section className="col-12">
//                 <div className={`${cardBg} card`}>
//                   <div className="card-header bg-primary text-white">
//                     <h5 className="mb-0">Doctors (NMC)</h5>
//                   </div>
//                   <div
//                     className="card-body"
//                     style={{ maxHeight: 240, overflowY: "auto" }}
//                   >
//                     {loadingExtra && <p>Loading doctors...</p>}
//                     {extraError && (
//                       <p className="text-danger mb-2">{extraError}</p>
//                     )}
//                     {!loadingExtra && doctorsData.length === 0 && (
//                       <p>No doctors found.</p>
//                     )}
//                     {doctorsData.map((doc) => (
//                       <div
//                         key={doc._id}
//                         className="d-flex justify-content-between align-items-center mb-2 border rounded p-2"
//                       >
//                         <div className="me-2">
//                           <div className="fw-semibold">{doc.name}</div>
//                           <small className="text-muted">{doc.speciality}</small>
//                         </div>
//                         <div
//                           className="text-end small flex-shrink-0"
//                           style={{ minWidth: 110 }}
//                         >
//                           <div>NMC: {doc.nmcNumber}</div>
//                           <div
//                             style={{
//                               color: doc.isAvailable ? "#22c55e" : "#f97316",
//                             }}
//                           >
//                             {doc.isAvailable ? "Available" : "Not available"}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </section>
//             </>
//           )}

//           {/* ORDERS */}
//           {activeSection === "orders" && (
//             <section className="col-12">
//               <div className={`${cardBg} card`}>
//                 <div className="card-header bg-primary text-white d-flex flex-wrap justify-content-between align-items-center gap-2">
//                   <h5 className="mb-0">Customer Orders</h5>
//                   <input
//                     type="search"
//                     className="form-control form-control-sm"
//                     style={{ maxWidth: 220 }}
//                     placeholder="Search orders..."
//                     value={ordersQuery}
//                     onChange={(e) => {
//                       setOrdersQuery(e.target.value);
//                       setOrdersPage(1);
//                     }}
//                   />
//                 </div>
//                 <div className="table-responsive">
//                   <table
//                     className={`table table-striped table-hover ${
//                       darkMode ? "table-dark" : ""
//                     } mb-0`}
//                   >
//                     <thead>
//                       <tr>
//                         <th
//                           role="button"
//                           onClick={() => requestSortOrder("id")}
//                         >
//                           Order ID
//                         </th>
//                         <th>Customer</th>
//                         <th>Medicine</th>
//                         <th>Qty</th>
//                         <th>Prescription</th>
//                         <th>Payment</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {ordersPageItems.map((o) => (
//                         <tr key={o.id ?? o._id}>
//                           <td>#{o.id ?? o._id}</td>
//                           <td>{o.customer}</td>
//                           <td>{o.medicine}</td>
//                           <td>{o.qty}</td>
//                           <td>
//                             <input
//                               type="file"
//                               accept="image/*"
//                               className="form-control form-control-sm"
//                               style={{ maxWidth: 160 }}
//                               onChange={(e) =>
//                                 handlePrescriptionUpload(
//                                   o.id ?? o._id,
//                                   e.target.files[0]
//                                 )
//                               }
//                             />
//                             {prescriptionsPreview[o.id ?? o._id] && (
//                               <motion.img
//                                 src={prescriptionsPreview[o.id ?? o._id]}
//                                 alt="prescription"
//                                 className="img-thumbnail mt-1"
//                                 style={{
//                                   width: 80,
//                                   height: 80,
//                                   objectFit: "cover",
//                                 }}
//                                 whileHover={{ scale: 1.08 }}
//                                 transition={{ duration: 0.3 }}
//                               />
//                             )}
//                           </td>
//                           <td>
//                             <div className="d-flex flex-column flex-sm-row flex-wrap gap-1">
//                               <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 className="btn btn-primary btn-sm"
//                                 onClick={() =>
//                                   handleStripePayment(o.id ?? o._id)
//                                 }
//                               >
//                                 Stripe
//                               </motion.button>
//                               <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 className="btn btn-success btn-sm"
//                                 onClick={() => handleESWAPayment(o.id ?? o._id)}
//                               >
//                                 ESWA
//                               </motion.button>
//                               <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 className="btn btn-warning btn-sm"
//                                 onClick={() => handleCODPayment(o.id ?? o._id)}
//                               >
//                                 COD
//                               </motion.button>
//                             </div>
//                             <small className="text-muted mt-1 d-block">
//                               {o.paymentStatus}
//                             </small>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <TablePagination
//                   total={filteredOrders.length}
//                   page={ordersPage}
//                   pageSize={ordersPageSize}
//                   onPageChange={setOrdersPage}
//                   onPageSizeChange={(s) => {
//                     setOrdersPageSize(s);
//                     setOrdersPage(1);
//                   }}
//                 />
//               </div>
//             </section>
//           )}

//           {/* MEDICINES */}
//           {activeSection === "medicines" && (
//             <section className="col-12">
//               <div className={`${cardBg} card`}>
//                 <div className="card-header bg-primary text-white d-flex flex-wrap justify-content-between align-items-center gap-2">
//                   <h5 className="mb-0">Medicines</h5>
//                   <input
//                     type="search"
//                     className="form-control form-control-sm"
//                     style={{ maxWidth: 220 }}
//                     placeholder="Search medicines..."
//                     value={medQuery}
//                     onChange={(e) => {
//                       setMedQuery(e.target.value);
//                       setMedPage(1);
//                     }}
//                   />
//                 </div>
//                 <div className="table-responsive">
//                   <table
//                     className={`table table-striped table-hover ${
//                       darkMode ? "table-dark" : ""
//                     } mb-0`}
//                   >
//                     <thead>
//                       <tr>
//                         <th role="button" onClick={() => requestSortMed("_id")}>
//                           ID
//                         </th>
//                         <th>Name</th>
//                         <th>Category</th>
//                         <th>Stock</th>
//                         <th>Expiry</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {medsPageItems.map((m) => (
//                         <tr key={m._id ?? m.id}>
//                           <td>{m._id ?? m.id}</td>
//                           <td>{m.name}</td>
//                           <td>{m.category}</td>
//                           <td>{m.quantity ?? m.stock}</td>
//                           <td>
//                             {m.expiryDate
//                               ? String(m.expiryDate).slice(0, 10)
//                               : "—"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <TablePagination
//                   total={filteredMeds.length}
//                   page={medPage}
//                   pageSize={medPageSize}
//                   onPageChange={setMedPage}
//                   onPageSizeChange={(s) => {
//                     setMedPageSize(s);
//                     setMedPage(1);
//                   }}
//                 />
//               </div>
//             </section>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PharmacistDashboard;

// import React, { useState, useEffect } from "react";
// import { Row, Col, Card, Table, Badge, Spinner, Alert } from "react-bootstrap";
// import {
//   ClipboardList,
//   ShoppingBag,
//   AlertTriangle,
//   TrendingUp,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const API_BASE_URL = "http://localhost:5000/api";

// const PharmacistDashboard = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [stats, setStats] = useState({
//     pendingRx: 0,
//     pendingOrders: 0,
//     lowStock: 0,
//     expired: 0,
//     todaySales: 0,
//   });
//   const [lowStockItems, setLowStockItems] = useState([]);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }
//       const headers = { Authorization: `Bearer ${token}` };

//       // Parallel Fetch: Prescriptions, Orders, Medicines
//       const [presRes, ordersRes, medRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/prescriptions`, { headers }), // Ensure endpoint returns all Rx
//         fetch(`${API_BASE_URL}/orders`, { headers }), // Ensure endpoint returns all Orders
//         fetch(`${API_BASE_URL}/medicines`, { headers }), // Ensure endpoint returns all Medicines
//       ]);

//       if (!presRes.ok || !ordersRes.ok || !medRes.ok) {
//         throw new Error("Failed to fetch dashboard data");
//       }

//       const prescriptions = await presRes.json();
//       const ordersData = await ordersRes.json();
//       const medicinesData = await medRes.json();

//       // Handle data structures (some APIs return { medicines: [...] })
//       const allPrescriptions = Array.isArray(prescriptions)
//         ? prescriptions
//         : prescriptions.prescriptions || [];
//       const allOrders = Array.isArray(ordersData)
//         ? ordersData
//         : ordersData.orders || [];
//       const allMedicines = Array.isArray(medicinesData)
//         ? medicinesData
//         : medicinesData.medicines || [];

//       // --- CALCULATE STATS ---

//       // 1. Pending Prescriptions
//       const pendingRxCount = allPrescriptions.filter(
//         (p) => p.status === "Pending"
//       ).length;

//       // 2. Pending Orders (Processing or Not Paid)
//       const pendingOrdersCount = allOrders.filter(
//         (o) => o.status === "Processing" || o.status === "Pending"
//       ).length;

//       // 3. Low Stock & Expired
//       const lowStockList = allMedicines.filter(
//         (m) => (m.countInStock || 0) < 10
//       );
//       const expiredCount = allMedicines.filter((m) => {
//         if (!m.expiryDate) return false;
//         return new Date(m.expiryDate) < new Date();
//       }).length;

//       // 4. Today's Sales
//       const today = new Date().toDateString();
//       const todaySalesTotal = allOrders
//         .filter(
//           (o) => new Date(o.createdAt).toDateString() === today && o.isPaid
//         )
//         .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

//       setStats({
//         pendingRx: pendingRxCount,
//         pendingOrders: pendingOrdersCount,
//         lowStock: lowStockList.length,
//         expired: expiredCount,
//         todaySales: todaySalesTotal,
//       });

//       setLowStockItems(lowStockList.slice(0, 5)); // Top 5 low stock
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load dashboard data. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" variant="success" />
//       </div>
//     );
//   if (error) return <Alert variant="danger">{error}</Alert>;

//   const statCards = [
//     {
//       label: "Pending Prescriptions",
//       value: stats.pendingRx,
//       icon: ClipboardList,
//       color: "warning",
//     },
//     {
//       label: "Orders To Process",
//       value: stats.pendingOrders,
//       icon: ShoppingBag,
//       color: "primary",
//     },
//     {
//       label: "Low Stock Items",
//       value: stats.lowStock,
//       icon: AlertTriangle,
//       color: "danger",
//     },
//     {
//       label: "Today's Sales",
//       value: `Rs. ${stats.todaySales.toLocaleString()}`,
//       icon: TrendingUp,
//       color: "success",
//     },
//   ];

//   return (
//     <div className="fade-in">
//       <h5 className="fw-bold mb-4">Dashboard Overview</h5>
//       <Row className="g-3 mb-4">
//         {statCards.map((item, idx) => (
//           <Col md={3} key={idx}>
//             <Card className="border-0 shadow-sm h-100">
//               <Card.Body className="d-flex align-items-center justify-content-between">
//                 <div>
//                   <p className="text-muted small mb-1 fw-bold text-uppercase">
//                     {item.label}
//                   </p>
//                   <h3 className="fw-bold mb-0">{item.value}</h3>
//                 </div>
//                 <div
//                   className={`bg-${item.color} bg-opacity-10 p-3 rounded-circle text-${item.color}`}
//                 >
//                   <item.icon size={24} />
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       <Row className="g-4">
//         <Col md={6}>
//           <Card className="border-0 shadow-sm h-100">
//             <Card.Header className="bg-white py-3 fw-bold border-bottom">
//               Recent Low Stock Alerts
//             </Card.Header>
//             <Card.Body className="p-0 table-responsive">
//               <Table hover className="mb-0 align-middle">
//                 <thead className="bg-light">
//                   <tr>
//                     <th>Medicine</th>
//                     <th>Stock</th>
//                     <th>Price</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {lowStockItems.length === 0 ? (
//                     <tr>
//                       <td colSpan="3" className="text-center py-4 text-muted">
//                         No low stock items
//                       </td>
//                     </tr>
//                   ) : (
//                     lowStockItems.map((m) => (
//                       <tr key={m._id}>
//                         <td className="fw-medium">{m.name}</td>
//                         <td>
//                           <Badge bg="danger">{m.countInStock}</Badge>
//                         </td>
//                         <td>Rs. {m.price}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6}>
//           <Card className="border-0 shadow-sm h-100">
//             <Card.Header className="bg-white py-3 fw-bold border-bottom">
//               Pending Prescriptions
//             </Card.Header>
//             <Card.Body className="d-flex align-items-center justify-content-center flex-column py-5">
//               {stats.pendingRx > 0 ? (
//                 <>
//                   <div className="bg-warning bg-opacity-10 p-4 rounded-circle mb-3 text-warning">
//                     <ClipboardList size={40} />
//                   </div>
//                   <h4 className="fw-bold">{stats.pendingRx}</h4>
//                   <p className="text-muted">Prescriptions waiting for review</p>
//                   <button
//                     className="btn btn-outline-primary btn-sm rounded-pill px-4"
//                     onClick={() => navigate("/pharmacist/prescriptions")}
//                   >
//                     Review Now
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <ClipboardList
//                     size={40}
//                     className="mb-3 text-muted opacity-25"
//                   />
//                   <p className="text-muted mb-0">
//                     All caught up! No pending prescriptions.
//                   </p>
//                 </>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default PharmacistDashboard;

// import React, { useState, useEffect } from "react";
// import { Row, Col, Card, Table, Badge, Spinner, Alert } from "react-bootstrap";
// import {
//   ClipboardList,
//   ShoppingBag,
//   AlertTriangle,
//   TrendingUp,
//   Package, // Added for Total Medicines icon
//   Clock, // Added for Pending Orders icon
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api"; // ✅ Use configured Axios instance

// const PharmacistDashboard = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Stats State
//   const [stats, setStats] = useState({
//     pendingRx: 0, // Requires prescription endpoint if you have one
//     pendingOrders: 0,
//     lowStock: 0,
//     totalMedicines: 0,
//     todaySales: 0, // Backend currently sends count, you might need sum logic later
//     todaysOrdersCount: 0,
//   });

//   const [lowStockItems, setLowStockItems] = useState([]);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);

//       // 1. Fetch Stats from Optimized Backend Route
//       const { data: dashboardStats } = await api.get("/pharmacist/dashboard"); //

//       // 2. Fetch Low Stock Items Detail (for the table)
//       // We reuse the filtered medicine route or a specific one if available
//       // Here we fetch all medicines and filter top 5 locally since it's a small list usually
//       // Ideally, create a backend route: /api/pharmacist/medicines?lowStock=true&limit=5
//       const { data: allMedicines } = await api.get("/pharmacist/medicines"); //

//       const lowStockList = allMedicines
//         .filter((m) => (m.countInStock || 0) < 10)
//         .slice(0, 5);

//       // 3. Update State
//       setStats({
//         pendingRx: 0, // Backend route needs to return this if you have Rx model
//         pendingOrders: dashboardStats.pendingOrdersCount,
//         lowStock: dashboardStats.lowStockCount,
//         totalMedicines: dashboardStats.totalMedicines,
//         todaySales: 0, // Requires calculating sum from backend if needed
//         todaysOrdersCount: dashboardStats.todaysOrdersCount,
//       });

//       setLowStockItems(lowStockList);
//       setError("");
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       // Handle 403 specifically
//       if (err.response && err.response.status === 403) {
//         setError("Access Denied: You are not authorized to view this page.");
//       } else {
//         setError(
//           "Failed to load dashboard data. Please check your connection."
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" variant="success" />
//       </div>
//     );

//   if (error) return <Alert variant="danger">{error}</Alert>;

//   const statCards = [
//     {
//       label: "Orders To Process",
//       value: stats.pendingOrders,
//       icon: Clock, // Changed Icon
//       color: "warning",
//     },
//     {
//       label: "Orders Today",
//       value: stats.todaysOrdersCount,
//       icon: ShoppingBag,
//       color: "primary",
//     },
//     {
//       label: "Low Stock Items",
//       value: stats.lowStock,
//       icon: AlertTriangle,
//       color: "danger",
//     },
//     {
//       label: "Total Medicines",
//       value: stats.totalMedicines,
//       icon: Package, // Changed Icon
//       color: "success",
//     },
//   ];

//   return (
//     <div className="fade-in">
//       <h5 className="fw-bold mb-4">Dashboard Overview</h5>
//       <Row className="g-3 mb-4">
//         {statCards.map((item, idx) => (
//           <Col md={3} key={idx}>
//             <Card className="border-0 shadow-sm h-100">
//               <Card.Body className="d-flex align-items-center justify-content-between">
//                 <div>
//                   <p className="text-muted small mb-1 fw-bold text-uppercase">
//                     {item.label}
//                   </p>
//                   <h3 className="fw-bold mb-0">{item.value}</h3>
//                 </div>
//                 <div
//                   className={`bg-${item.color} bg-opacity-10 p-3 rounded-circle text-${item.color}`}
//                 >
//                   <item.icon size={24} />
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       <Row className="g-4">
//         {/* Low Stock Table */}
//         <Col md={6}>
//           <Card className="border-0 shadow-sm h-100">
//             <Card.Header className="bg-white py-3 fw-bold border-bottom">
//               Recent Low Stock Alerts
//             </Card.Header>
//             <Card.Body className="p-0 table-responsive">
//               <Table hover className="mb-0 align-middle">
//                 <thead className="bg-light">
//                   <tr>
//                     <th>Medicine</th>
//                     <th>Stock</th>
//                     <th>Price</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {lowStockItems.length === 0 ? (
//                     <tr>
//                       <td colSpan="3" className="text-center py-4 text-muted">
//                         No low stock items
//                       </td>
//                     </tr>
//                   ) : (
//                     lowStockItems.map((m) => (
//                       <tr key={m._id}>
//                         <td className="fw-medium">{m.name}</td>
//                         <td>
//                           <Badge bg="danger">{m.countInStock}</Badge>
//                         </td>
//                         <td>Rs. {m.price}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Pending Prescriptions / Quick Actions */}
//         <Col md={6}>
//           <Card className="border-0 shadow-sm h-100">
//             <Card.Header className="bg-white py-3 fw-bold border-bottom">
//               Quick Actions
//             </Card.Header>
//             <Card.Body className="d-flex align-items-center justify-content-center flex-column py-5">
//               <ClipboardList
//                 size={40}
//                 className="mb-3 text-primary opacity-50"
//               />
//               <h5 className="fw-bold">Manage Store</h5>
//               <p className="text-muted text-center mb-4">
//                 Quickly access common pharmacist tasks.
//               </p>
//               <div className="d-flex gap-2">
//                 <button
//                   className="btn btn-outline-primary btn-sm rounded-pill px-4"
//                   onClick={() => navigate("/pharmacist/orders")}
//                 >
//                   View All Orders
//                 </button>
//                 <button
//                   className="btn btn-outline-success btn-sm rounded-pill px-4"
//                   onClick={() => navigate("/pharmacist/inventory")}
//                 >
//                   Check Inventory
//                 </button>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default PharmacistDashboard;

import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Badge,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import {
  ClipboardList,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  Package,
  Clock,
  FileText,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const PharmacistDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    pendingRx: 0,
    pendingOrders: 0,
    lowStock: 0,
    totalMedicines: 0,
    todaysOrdersCount: 0,
  });

  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Stats
      // Handles both raw Axios response and Interceptor response
      const statsRes = await api.get("/pharmacist/dashboard");
      const dashboardStats = statsRes.data || statsRes;

      // 2. Fetch Low Stock Items (✅ FIXED LOGIC)
      const medRes = await api.get("/medicines");

      // Determine if we have the array directly or if it's wrapped in an object
      const medPayload = medRes.data || medRes;

      // If the payload is NOT an array, try to find the '.medicines' property
      const allMedicines = Array.isArray(medPayload)
        ? medPayload
        : medPayload.medicines || [];

      // Now .filter() will work because we are sure it's an array
      const lowStockList = allMedicines
        .filter((m) => (m.countInStock || 0) < 15)
        .slice(0, 5);

      // 3. Update State
      setStats({
        pendingRx: dashboardStats.pendingPrescriptionsCount || 0,
        pendingOrders: dashboardStats.pendingOrdersCount || 0,
        lowStock: dashboardStats.lowStockCount || 0,
        totalMedicines: dashboardStats.totalMedicines || 0,
        todaysOrdersCount: dashboardStats.todaysOrdersCount || 0,
      });

      setLowStockItems(lowStockList);
      setError("");
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(
        err.response?.data?.message || "Failed to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="success" />
      </div>
    );

  const statCards = [
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "warning",
      link: "/pharmacist/orders",
    },
    {
      label: "New Prescriptions",
      value: stats.pendingRx,
      icon: FileText,
      color: "info",
      link: "/pharmacist/prescriptions",
    },
    {
      label: "Inventory Alerts",
      value: stats.lowStock,
      icon: AlertTriangle,
      color: "danger",
      link: "/pharmacist/inventory",
    },
    {
      label: "Stock Medicines",
      value: stats.totalMedicines,
      icon: Package,
      color: "success",
      link: "/pharmacist/inventory",
    },
  ];

  return (
    <div className="animate-fade-in px-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Pharmacist Portal</h3>
          <p className="text-muted small">
            Real-time overview of store operations and inventory
          </p>
        </div>
        <Button
          variant="outline-success"
          className="rounded-pill btn-sm px-3"
          onClick={fetchDashboardData}
        >
          Update Data
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="rounded-4 border-0 shadow-sm mb-4">
          {error}
        </Alert>
      )}

      {/* --- Quick Stats Section --- */}
      <Row className="g-3 mb-4">
        {statCards.map((item, idx) => (
          <Col md={3} sm={6} key={idx}>
            <Card
              className="border-0 shadow-sm h-100 card-modern hover-lift cursor-pointer"
              onClick={() => navigate(item.link)}
            >
              <Card.Body className="d-flex align-items-center justify-content-between p-4">
                <div>
                  <p className="text-muted small mb-1 fw-bold text-uppercase tracking-wider">
                    {item.label}
                  </p>
                  <h2 className="fw-bold mb-0">{item.value}</h2>
                </div>
                <div
                  className={`bg-${item.color} bg-opacity-10 p-3 rounded-4 text-${item.color}`}
                >
                  <item.icon size={28} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        {/* --- Low Stock Table Preview --- */}
        <Col lg={7}>
          <Card className="border-0 shadow-sm h-100 rounded-4 overflow-hidden">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
              <span className="fw-bold">Critical Inventory Alerts</span>
              <Badge
                bg="danger-subtle"
                className="text-danger border border-danger-subtle"
              >
                Requires Attention
              </Badge>
            </Card.Header>
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-light small text-uppercase text-muted">
                  <tr>
                    <th className="ps-4 py-3">Medicine</th>
                    <th className="py-3 text-center">Current Stock</th>
                    <th className="py-3 pe-4 text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-5 text-muted">
                        All medicines are currently well-stocked.
                      </td>
                    </tr>
                  ) : (
                    lowStockItems.map((m) => (
                      <tr key={m._id}>
                        <td className="ps-4">
                          <div className="fw-bold">{m.name}</div>
                          <small className="text-muted">{m.category}</small>
                        </td>
                        <td className="text-center">
                          <Badge
                            bg="danger-subtle"
                            className="text-danger rounded-pill px-3"
                          >
                            {m.countInStock} {m.baseUnit || "Left"}
                          </Badge>
                        </td>
                        <td className="text-end pe-4">
                          <Button
                            variant="light"
                            size="sm"
                            className="rounded-circle border"
                            onClick={() => navigate("/pharmacist/inventory")}
                          >
                            <ChevronRight size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
            <Card.Footer className="bg-white border-0 py-3 text-center">
              <Button
                variant="link"
                className="text-decoration-none small p-0"
                onClick={() => navigate("/pharmacist/inventory")}
              >
                View Full Inventory Report
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        {/* --- Quick Navigation Hub --- */}
        <Col lg={5}>
          <Card className="border-0 shadow-sm h-100 rounded-4 overflow-hidden bg-primary bg-opacity-10 border-primary border-opacity-10">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-5">
              <div className="bg-white p-4 rounded-circle shadow-sm mb-4">
                <TrendingUp size={48} className="text-primary" />
              </div>
              <h4 className="fw-bold text-dark">Management Hub</h4>
              <p className="text-muted mb-4 px-3">
                Monitor prescriptions, orders, and customer data from one
                central location.
              </p>
              <div className="d-grid gap-3 w-100 px-4">
                <Button
                  variant="primary"
                  className="py-2 rounded-pill fw-bold"
                  onClick={() => navigate("/pharmacist/orders")}
                >
                  Manage Orders
                </Button>
                <Button
                  variant="outline-primary"
                  className="py-2 rounded-pill fw-bold"
                  onClick={() => navigate("/pharmacist/prescriptions")}
                >
                  Verify Prescriptions
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PharmacistDashboard;
