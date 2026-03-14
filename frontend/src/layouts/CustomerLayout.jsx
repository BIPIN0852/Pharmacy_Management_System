// import React from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import CustomerSidebar from "../components/CustomerSidebar"; // Imports the sidebar you provided
// import { Bell, UserCircle, ShoppingCart } from "lucide-react"; // Icons
// import { useSelector } from "react-redux"; // To get cart count

// const CustomerLayout = () => {
//   const navigate = useNavigate();

//   // --- Get Cart Count from Redux ---
//   const cart = useSelector((state) => state.cart);
//   const { cartItems } = cart;
//   const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

//   return (
//     <div className="d-flex min-vh-100 bg-light">
//       {/* 1. Sidebar (Fixed Left) */}
//       <CustomerSidebar />

//       {/* 2. Main Wrapper (Flex Column) */}
//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         {/* --- TOP HEADER --- */}
//         <header className="bg-white shadow-sm border-bottom px-4 py-3 flex-shrink-0">
//           <div className="d-flex align-items-center justify-content-between">
//             {/* Page Title */}
//             <div>
//               <h4 className="mb-0 fw-bold text-dark">Patient Portal</h4>
//               <small className="text-muted">
//                 Manage your health and orders
//               </small>
//             </div>

//             {/* Right Side Icons */}
//             <div className="d-flex align-items-center gap-3">
//               {/* ✅ CART ICON WITH BADGE */}
//               <button
//                 className="btn btn-light rounded-circle p-2 border position-relative"
//                 onClick={() => navigate("/cart")}
//                 title="View Cart"
//               >
//                 <ShoppingCart size={20} className="text-dark" />
//                 {cartCount > 0 && (
//                   <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-light">
//                     {cartCount}
//                   </span>
//                 )}
//               </button>

//               {/* Notifications */}
//               <button className="btn btn-light rounded-circle p-2 border position-relative">
//                 <Bell size={20} className="text-muted" />
//                 <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
//               </button>

//               {/* Profile Info */}
//               <div className="d-flex align-items-center gap-2 border-start ps-3">
//                 <div
//                   className="text-end d-none d-md-block"
//                   style={{ lineHeight: "1.2" }}
//                 >
//                   <div className="fw-bold small">My Account</div>
//                   <small className="text-muted" style={{ fontSize: "0.7rem" }}>
//                     Customer
//                   </small>
//                 </div>
//                 <UserCircle size={36} className="text-primary opacity-75" />
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* --- MAIN CONTENT AREA --- */}
//         <main className="flex-grow-1 p-4 overflow-auto bg-light">
//           {/* This is where Dashboard, Medicines, Orders etc. appear */}
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default CustomerLayout;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import CustomerSidebar from "../components/CustomerSidebar";
// import Breadcrumbs from "../components/Breadcrumbs"; // ✅ IMPORT BREADCRUMBS
// import { Bell, UserCircle, ShoppingCart } from "lucide-react";
// import { useSelector } from "react-redux";

// const CustomerLayout = () => {
//   const navigate = useNavigate();
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // --- Handle Screen Resize ---
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (mobile) setCollapsed(true);
//     };
//     handleResize(); // Initial check
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // --- Get Cart Count from Redux ---
//   const cart = useSelector((state) => state.cart);
//   const { cartItems } = cart;
//   const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

//   return (
//     <div className="d-flex min-vh-100 bg-light">
//       {/* 1. Sidebar (Pass state props for toggle functionality) */}
//       <CustomerSidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         isMobile={isMobile}
//       />

//       {/* 2. Main Wrapper (Flex Column) */}
//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         {/* --- TOP HEADER --- */}
//         <header className="bg-white shadow-sm border-bottom px-4 py-3 flex-shrink-0">
//           <div className="d-flex align-items-center justify-content-between">
//             {/* Page Title */}
//             <div>
//               <h4 className="mb-0 fw-bold text-dark">Patient Portal</h4>
//               <small className="text-muted">
//                 Manage your health and orders
//               </small>
//             </div>

//             {/* Right Side Icons */}
//             <div className="d-flex align-items-center gap-3">
//               {/* ✅ CART ICON WITH BADGE */}
//               <button
//                 className="btn btn-light rounded-circle p-2 border position-relative"
//                 onClick={() => navigate("/cart")}
//                 title="View Cart"
//               >
//                 <ShoppingCart size={20} className="text-dark" />
//                 {cartCount > 0 && (
//                   <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-light">
//                     {cartCount}
//                   </span>
//                 )}
//               </button>

//               {/* Notifications */}
//               <button className="btn btn-light rounded-circle p-2 border position-relative">
//                 <Bell size={20} className="text-muted" />
//                 <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
//               </button>

//               {/* Profile Info */}
//               <div
//                 className="d-flex align-items-center gap-2 border-start ps-3 cursor-pointer"
//                 onClick={() => navigate("/profile")}
//                 style={{ cursor: "pointer" }}
//               >
//                 <div
//                   className="text-end d-none d-md-block"
//                   style={{ lineHeight: "1.2" }}
//                 >
//                   <div className="fw-bold small">My Account</div>
//                   <small className="text-muted" style={{ fontSize: "0.7rem" }}>
//                     Customer
//                   </small>
//                 </div>
//                 <UserCircle size={36} className="text-primary opacity-75" />
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* --- MAIN CONTENT AREA --- */}
//         <main className="flex-grow-1 p-4 overflow-auto bg-light">
//           {/* ✅ ADD BREADCRUMBS HERE */}
//           <Breadcrumbs />

//           {/* This renders the specific page (Dashboard, Medicines, Orders etc.) */}
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default CustomerLayout;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import CustomerSidebar from "../components/CustomerSidebar"; // Adjust path if needed based on folder structure
// import Breadcrumbs from "../components/Breadcrumbs"; // ✅ IMPORT BREADCRUMBS (Ensure file exists)
// import { Bell, UserCircle, ShoppingCart } from "lucide-react";
// import { useSelector } from "react-redux";

// const CustomerLayout = () => {
//   const navigate = useNavigate();
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // --- Handle Screen Resize ---
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (mobile) setCollapsed(true);
//     };
//     handleResize(); // Initial check
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // --- Get Cart Count from Redux ---
//   // Safely handling potential undefined state
//   const cart = useSelector((state) => state.cart || { cartItems: [] });
//   const { cartItems } = cart;
//   const cartCount = cartItems
//     ? cartItems.reduce((acc, item) => acc + item.qty, 0)
//     : 0;

//   return (
//     <div className="d-flex min-vh-100 bg-light">
//       {/* 1. Sidebar (Pass state props for toggle functionality) */}
//       <CustomerSidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         isMobile={isMobile}
//       />

//       {/* 2. Main Wrapper (Flex Column) */}
//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         {/* --- TOP HEADER --- */}
//         <header className="bg-white shadow-sm border-bottom px-4 py-3 flex-shrink-0">
//           <div className="d-flex align-items-center justify-content-between">
//             {/* Page Title */}
//             <div>
//               <h4 className="mb-0 fw-bold text-dark">Patient Portal</h4>
//               <small className="text-muted">
//                 Manage your health and orders
//               </small>
//             </div>

//             {/* Right Side Icons */}
//             <div className="d-flex align-items-center gap-3">
//               {/* ✅ CART ICON WITH BADGE */}
//               <button
//                 className="btn btn-light rounded-circle p-2 border position-relative"
//                 onClick={() => navigate("/cart")}
//                 title="View Cart"
//               >
//                 <ShoppingCart size={20} className="text-dark" />
//                 {cartCount > 0 && (
//                   <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-light">
//                     {cartCount}
//                   </span>
//                 )}
//               </button>

//               {/* Notifications */}
//               <button className="btn btn-light rounded-circle p-2 border position-relative">
//                 <Bell size={20} className="text-muted" />
//                 <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
//               </button>

//               {/* Profile Info */}
//               <div
//                 className="d-flex align-items-center gap-2 border-start ps-3 cursor-pointer"
//                 onClick={() => navigate("/profile")}
//                 style={{ cursor: "pointer" }}
//               >
//                 <div
//                   className="text-end d-none d-md-block"
//                   style={{ lineHeight: "1.2" }}
//                 >
//                   <div className="fw-bold small">My Account</div>
//                   <small className="text-muted" style={{ fontSize: "0.7rem" }}>
//                     Customer
//                   </small>
//                 </div>
//                 <UserCircle size={36} className="text-primary opacity-75" />
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* --- MAIN CONTENT AREA --- */}
//         <main className="flex-grow-1 p-4 overflow-auto bg-light">
//           {/* ✅ ADD BREADCRUMBS HERE */}
//           <div className="mb-4">
//             <Breadcrumbs />
//           </div>

//           {/* This renders the specific page (Dashboard, Medicines, Orders etc.) */}
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default CustomerLayout;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import CustomerSidebar from "../components/CustomerSidebar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import { Bell, UserCircle, ShoppingCart } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useAuth } from "../context/AuthContext";
// import api from "../services/api";

// const CustomerLayout = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   // --- Handle Screen Resize ---
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (mobile) setCollapsed(true);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // --- Fetch Unread Notifications (Background Sync) ---
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const { data } = await api.get("/messages/my");
//         const unread = data.filter(
//           (m) => m.adminReply && !m.isReplyRead,
//         ).length;
//         setUnreadCount(unread);
//       } catch (error) {
//         // Silent catch for background sync
//       }
//     };

//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 15000);

//     return () => clearInterval(interval);
//   }, []);

//   // --- BULLETPROOF CART CALCULATION ---
//   const cart = useSelector((state) => state.cart || {});
//   const rawCartItems = Array.isArray(cart.cartItems) ? cart.cartItems : [];

//   // ✅ 1. Filter out nulls, undefined, and items with 0 quantity (Removes "Ghost" items)
//   const activeCartItems = rawCartItems.filter(
//     (item) => item !== null && item !== undefined && Number(item.qty) > 0,
//   );

//   // ✅ 2. Calculate the exact true count
//   const cartCount = activeCartItems.reduce(
//     (acc, item) => acc + Number(item.qty),
//     0,
//   );

//   // --- Profile Image Helper ---
//   const getProfileImage = () => {
//     if (
//       user?.profilePhoto &&
//       user.profilePhoto !== "none" &&
//       !user.profilePhoto.includes("sample-doctor.jpg")
//     ) {
//       if (user.profilePhoto.startsWith("http")) return user.profilePhoto;
//       let cleanPath = user.profilePhoto.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
//       return `http://localhost:5000${cleanPath}`;
//     }
//     return null;
//   };

//   return (
//     <div
//       className="d-flex min-vh-100 bg-light"
//       style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
//     >
//       {/* 1. Sidebar */}
//       <CustomerSidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         isMobile={isMobile}
//       />

//       {/* 2. Main Wrapper */}
//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         {/* --- TOP HEADER --- */}
//         <header className="bg-white shadow-sm border-bottom border-light-subtle px-4 py-3 flex-shrink-0 z-3">
//           <div className="d-flex align-items-center justify-content-between">
//             {/* Page Title */}
//             <div>
//               <h4 className="mb-0 fw-black text-dark tracking-tight">
//                 Patient Portal
//               </h4>
//               <small className="text-muted fw-medium">
//                 Manage your health and orders
//               </small>
//             </div>

//             {/* Right Side Icons */}
//             <div className="d-flex align-items-center gap-3 gap-md-4">
//               {/* ✅ REAL WORLD CART ICON */}
//               <button
//                 className="btn btn-white border border-light-subtle rounded-circle p-2 position-relative shadow-sm hover-lift transition-all"
//                 onClick={() => navigate("/cart")}
//                 title="View Cart"
//               >
//                 <ShoppingCart size={20} className="text-dark" />
//                 {/* Strict condition: Only show if strictly > 0 and items exist */}
//                 {cartCount > 0 && activeCartItems.length > 0 && (
//                   <span
//                     className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white shadow-sm"
//                     style={{ fontSize: "0.65rem", padding: "0.35em 0.5em" }}
//                   >
//                     {cartCount}
//                   </span>
//                 )}
//               </button>

//               {/* NOTIFICATION BELL */}
//               <button
//                 className="btn btn-white border border-light-subtle rounded-circle p-2 position-relative shadow-sm hover-lift transition-all"
//                 onClick={() =>
//                   navigate("/customer-dashboard", {
//                     state: { scrollTo: "support-tickets" },
//                   })
//                 }
//                 title={
//                   unreadCount > 0
//                     ? `You have ${unreadCount} unread replies`
//                     : "No new notifications"
//                 }
//               >
//                 <Bell
//                   size={20}
//                   className={unreadCount > 0 ? "text-primary" : "text-dark"}
//                 />
//                 {unreadCount > 0 && (
//                   <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white shadow-sm animate-pulse">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>

//               {/* Profile Info */}
//               <div
//                 className="d-flex align-items-center gap-3 border-start border-light-subtle ps-3 ps-md-4 cursor-pointer hover-opacity transition-all"
//                 onClick={() => navigate("/profile")}
//                 title="View Profile"
//               >
//                 <div
//                   className="text-end d-none d-md-block"
//                   style={{ lineHeight: "1.2" }}
//                 >
//                   <div className="fw-bold text-dark fs-6">
//                     {user?.name || "Customer"}
//                   </div>
//                   <small
//                     className="text-primary fw-bold text-uppercase tracking-wider"
//                     style={{ fontSize: "0.65rem" }}
//                   >
//                     My Account
//                   </small>
//                 </div>

//                 {getProfileImage() ? (
//                   <img
//                     src={getProfileImage()}
//                     alt="Profile"
//                     className="rounded-circle object-fit-cover shadow-sm border border-2 border-primary border-opacity-25"
//                     style={{ width: "40px", height: "40px" }}
//                   />
//                 ) : (
//                   <div
//                     className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
//                     style={{ width: "40px", height: "40px" }}
//                   >
//                     <UserCircle size={24} />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* --- MAIN CONTENT AREA --- */}
//         <main className="flex-grow-1 p-3 p-md-4 overflow-auto bg-light custom-scrollbar">
//           <div className="mb-4">
//             <Breadcrumbs />
//           </div>
//           <Outlet />
//         </main>
//       </div>

//       <style>{`
//         .tracking-tight { letter-spacing: -0.03em; }
//         .tracking-wider { letter-spacing: 0.05em; }
//         .transition-all { transition: all 0.2s ease-in-out; }
//         .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
//         .hover-opacity:hover { opacity: 0.8; }
//         .cursor-pointer { cursor: pointer; }

//         /* Custom Scrollbar for Main Content */
//         .custom-scrollbar::-webkit-scrollbar { width: 8px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

//         @keyframes pulse-badge {
//           0% { transform: translate(-50%, -50%) scale(1); }
//           50% { transform: translate(-50%, -50%) scale(1.1); }
//           100% { transform: translate(-50%, -50%) scale(1); }
//         }
//         .animate-pulse { animation: pulse-badge 2s infinite; }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerLayout;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import CustomerSidebar from "../components/CustomerSidebar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import { Bell, UserCircle, ShoppingCart } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useAuth } from "../context/AuthContext";
// import api from "../services/api";

// const CustomerLayout = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   // --- Handle Screen Resize ---
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (mobile) setCollapsed(true);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // --- Fetch Unread Notifications (Background Sync) ---
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const { data } = await api.get("/messages/my");
//         const unread = data.filter(
//           (m) => m.adminReply && !m.isReplyRead,
//         ).length;
//         setUnreadCount(unread);
//       } catch (error) {
//         // Silent catch for background sync
//       }
//     };

//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 15000);

//     return () => clearInterval(interval);
//   }, []);

//   // --- REAL-WORLD CART CALCULATION ---
//   const cart = useSelector((state) => state.cart);
//   const cartItems = cart?.cartItems || [];

//   // Safely sum up the quantity of all valid items in the cart.
//   // This ignores empty "ghost" objects that get left behind when an item is deleted.
//   const cartCount = cartItems.reduce((total, item) => {
//     if (item && typeof item === "object" && Object.keys(item).length > 0) {
//       const qty = Number(item.qty);
//       if (!isNaN(qty) && qty > 0) {
//         return total + qty;
//       }
//     }
//     return total;
//   }, 0);

//   // --- Profile Image Helper ---
//   const getProfileImage = () => {
//     if (
//       user?.profilePhoto &&
//       user.profilePhoto !== "none" &&
//       !user.profilePhoto.includes("sample-doctor.jpg")
//     ) {
//       if (user.profilePhoto.startsWith("http")) return user.profilePhoto;
//       let cleanPath = user.profilePhoto.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
//       return `http://localhost:5000${cleanPath}`;
//     }
//     return null;
//   };

//   return (
//     <div
//       className="d-flex min-vh-100"
//       style={{
//         backgroundColor: "#f0f2f2",
//         fontFamily: "'Inter', system-ui, sans-serif",
//       }}
//     >
//       {/* 1. Sidebar */}
//       <CustomerSidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         isMobile={isMobile}
//       />

//       {/* 2. Main Wrapper */}
//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         {/* --- TOP HEADER (Amazon Enterprise Style) --- */}
//         <header
//           className="bg-white px-4 py-3 flex-shrink-0 z-3"
//           style={{ borderBottom: "1px solid #D5D9D9" }}
//         >
//           <div className="d-flex align-items-center justify-content-between">
//             {/* Page Title */}
//             <div>
//               <h4
//                 className="mb-0 fw-bold"
//                 style={{ color: "#0F1111", fontSize: "1.25rem" }}
//               >
//                 Patient Portal
//               </h4>
//               <p className="small mb-0" style={{ color: "#565959" }}>
//                 Manage your health, prescriptions, and orders.
//               </p>
//             </div>

//             {/* Right Side Icons */}
//             <div className="d-flex align-items-center gap-4">
//               {/* ✅ REAL WORLD CART ICON */}
//               <div
//                 className="position-relative d-flex align-items-center justify-content-center transition-all hover-opacity"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/cart")}
//                 title="View Cart"
//               >
//                 <ShoppingCart size={24} style={{ color: "#0F1111" }} />

//                 {/* Shows the red badge ONLY if there are 1 or more items */}
//                 {cartCount > 0 && (
//                   <span
//                     className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
//                     style={{
//                       backgroundColor: "#B12704",
//                       color: "#fff",
//                       fontSize: "0.65rem",
//                       border: "2px solid #fff",
//                     }}
//                   >
//                     {cartCount}
//                   </span>
//                 )}
//               </div>

//               {/* NOTIFICATION BELL */}
//               <div
//                 className="position-relative d-flex align-items-center justify-content-center transition-all hover-opacity"
//                 style={{ cursor: "pointer" }}
//                 onClick={() =>
//                   navigate("/customer-dashboard", {
//                     state: { scrollTo: "support-tickets" },
//                   })
//                 }
//                 title={
//                   unreadCount > 0
//                     ? `You have ${unreadCount} unread replies`
//                     : "No new notifications"
//                 }
//               >
//                 <Bell size={24} style={{ color: "#0F1111" }} />
//                 {unreadCount > 0 && (
//                   <span
//                     className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
//                     style={{
//                       backgroundColor: "#B12704",
//                       color: "#fff",
//                       fontSize: "0.65rem",
//                       border: "2px solid #fff",
//                     }}
//                   >
//                     {unreadCount}
//                   </span>
//                 )}
//               </div>

//               {/* Profile Info */}
//               <div
//                 className="d-flex align-items-center gap-3 border-start ps-4 transition-all hover-opacity"
//                 onClick={() => navigate("/profile")}
//                 title="View Profile"
//                 style={{ cursor: "pointer", borderColor: "#D5D9D9 !important" }}
//               >
//                 <div
//                   className="text-end d-none d-md-block"
//                   style={{ lineHeight: "1.2" }}
//                 >
//                   <div className="fw-bold fs-6" style={{ color: "#0F1111" }}>
//                     {user?.name || "Customer"}
//                   </div>
//                   <div
//                     className="fw-medium text-uppercase mt-1"
//                     style={{
//                       fontSize: "0.7rem",
//                       color: "#007185",
//                       letterSpacing: "0.5px",
//                     }}
//                   >
//                     My Account
//                   </div>
//                 </div>

//                 {getProfileImage() ? (
//                   <img
//                     src={getProfileImage()}
//                     alt="Profile"
//                     className="rounded-circle object-fit-cover border"
//                     style={{
//                       width: "36px",
//                       height: "36px",
//                       borderColor: "#D5D9D9",
//                     }}
//                   />
//                 ) : (
//                   <div className="d-flex align-items-center justify-content-center">
//                     <UserCircle
//                       size={32}
//                       style={{ color: "#565959", strokeWidth: "1.5" }}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* --- MAIN CONTENT AREA --- */}
//         <main
//           className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar"
//           style={{ backgroundColor: "#f0f2f2" }}
//         >
//           {/* Breadcrumbs */}
//           <Breadcrumbs />

//           <div className="mt-2">
//             <Outlet />
//           </div>
//         </main>
//       </div>

//       <style>{`
//         .transition-all { transition: opacity 0.2s ease-in-out; }
//         .hover-opacity:hover { opacity: 0.7; }

//         /* Custom Scrollbar for Main Content */
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

//         @keyframes pulse-badge {
//           0% { transform: translate(-50%, -50%) scale(1); }
//           50% { transform: translate(-50%, -50%) scale(1.1); }
//           100% { transform: translate(-50%, -50%) scale(1); }
//         }
//         .animate-pulse { animation: pulse-badge 2s infinite; }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerLayout;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { Dropdown, Badge } from "react-bootstrap";
// import CustomerSidebar from "../components/CustomerSidebar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import {
//   Bell,
//   UserCircle,
//   ShoppingCart,
//   LogOut,
//   Package,
//   MessageSquare,
//   Truck,
//   CheckCircle2,
// } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useAuth } from "../context/AuthContext";
// import api from "../services/api";

// const CustomerLayout = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // --- Notification States ---
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);

//   // --- Handle Screen Resize ---
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (mobile) setCollapsed(true);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // --- Fetch Notifications (Orders + Messages) ---
//   const fetchNotifications = async () => {
//     try {
//       const [msgRes, orderRes] = await Promise.all([
//         api.get("/messages/my").catch(() => ({ data: [] })),
//         api.get("/orders/myorders").catch(() => ({ data: [] })),
//       ]);

//       const alerts = [];

//       // 1. Check for unread support messages
//       const unreadMsgs = msgRes.data.filter(
//         (m) => m.adminReply && !m.isReplyRead,
//       );

//       if (unreadMsgs.length > 0) {
//         // Create a unique ID based on the unread messages
//         // If a new message arrives, the ID changes and bypasses the "dismissed" filter
//         const msgIds = unreadMsgs.map((m) => m._id).join("-");
//         alerts.push({
//           id: `msg-${msgIds}`,
//           title: "New Support Reply",
//           message: `You have ${unreadMsgs.length} unread message(s) from support.`,
//           link: "/customer-dashboard",
//           icon: MessageSquare,
//           color: "text-info",
//         });
//       }

//       // 2. Check for active order statuses
//       const activeOrders = orderRes.data.filter((o) =>
//         ["Processing", "Shipped", "Delivered"].includes(o.orderStatus),
//       );

//       activeOrders
//         .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
//         .slice(0, 3)
//         .forEach((order) => {
//           let icon = Package;
//           let color = "text-warning";
//           let title = "Order Processing";
//           let message = `Your order #${order._id.substring(order._id.length - 6).toUpperCase()} is being prepared.`;

//           if (order.orderStatus === "Shipped") {
//             icon = Truck;
//             color = "text-primary";
//             title = "Order Shipped!";
//             message = `Your order is on the way.`;
//           } else if (order.orderStatus === "Delivered") {
//             icon = CheckCircle2;
//             color = "text-success";
//             title = "Order Delivered";
//             message = `Your order has been successfully delivered.`;
//           }

//           // Generate an ID that includes the status.
//           // If status changes from Processing -> Shipped, it generates a new alert.
//           alerts.push({
//             id: `order-${order._id}-${order.orderStatus}`,
//             title,
//             message,
//             link: `/order/${order._id}`,
//             icon,
//             color,
//           });
//         });

//       // ✅ SECURE LOCAL STORAGE FILTERING
//       // Grab the list of IDs the user has already clicked "Mark as read" on
//       const dismissedIds =
//         JSON.parse(localStorage.getItem("dismissedAlerts")) || [];

//       // Filter out any alerts that are in the dismissed list
//       const activeAlerts = alerts.filter(
//         (alert) => !dismissedIds.includes(alert.id),
//       );

//       setNotifications(activeAlerts);
//       setUnreadCount(activeAlerts.length);
//     } catch (error) {
//       console.error("Failed to fetch notifications", error);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 15000); // Check every 15s
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ MARK ALL AS READ LOGIC
//   const handleClearNotifications = () => {
//     // 1. Get current active alert IDs
//     const currentIds = notifications.map((n) => n.id);

//     // 2. Get previously dismissed IDs from storage
//     const previouslyDismissed =
//       JSON.parse(localStorage.getItem("dismissedAlerts")) || [];

//     // 3. Combine them without duplicates
//     const newDismissed = [...new Set([...previouslyDismissed, ...currentIds])];

//     // 4. Save back to local storage
//     localStorage.setItem("dismissedAlerts", JSON.stringify(newDismissed));

//     // 5. Instantly clear the UI
//     setNotifications([]);
//     setUnreadCount(0);
//   };

//   // --- Cart Calculation ---
//   const cart = useSelector((state) => state.cart);
//   const cartItems = cart?.cartItems || [];

//   const cartCount = cartItems.reduce((total, item) => {
//     if (item && typeof item === "object" && Object.keys(item).length > 0) {
//       const qty = Number(item.qty);
//       if (!isNaN(qty) && qty > 0) {
//         return total + qty;
//       }
//     }
//     return total;
//   }, 0);

//   // --- Profile Image Helper ---
//   const getProfileImage = () => {
//     if (
//       user?.profilePhoto &&
//       user.profilePhoto !== "none" &&
//       !user.profilePhoto.includes("sample-doctor.jpg")
//     ) {
//       if (user.profilePhoto.startsWith("http")) return user.profilePhoto;
//       let cleanPath = user.profilePhoto.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
//       return `http://localhost:5000${cleanPath}`;
//     }
//     return null;
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div
//       className="d-flex min-vh-100"
//       style={{
//         backgroundColor: "#f0f2f2",
//         fontFamily: "'Inter', system-ui, sans-serif",
//       }}
//     >
//       <CustomerSidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         isMobile={isMobile}
//       />

//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         <header
//           className="bg-white px-4 py-3 flex-shrink-0 z-3 shadow-sm"
//           style={{ borderBottom: "1px solid #D5D9D9" }}
//         >
//           <div className="d-flex align-items-center justify-content-between">
//             {/* Page Title */}
//             <div>
//               <h4
//                 className="mb-0 fw-bold"
//                 style={{ color: "#0F1111", fontSize: "1.25rem" }}
//               >
//                 Patient Portal
//               </h4>
//               <p className="small mb-0" style={{ color: "#565959" }}>
//                 Manage your health, prescriptions, and orders.
//               </p>
//             </div>

//             {/* Right Side Icons */}
//             <div className="d-flex align-items-center gap-4">
//               {/* CART ICON */}
//               <div
//                 className="position-relative d-flex align-items-center justify-content-center transition-all hover-opacity"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/cart")}
//                 title="View Cart"
//               >
//                 <ShoppingCart size={24} style={{ color: "#0F1111" }} />
//                 {cartCount > 0 && (
//                   <span
//                     className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
//                     style={{
//                       backgroundColor: "#B12704",
//                       color: "#fff",
//                       fontSize: "0.65rem",
//                       border: "2px solid #fff",
//                     }}
//                   >
//                     {cartCount}
//                   </span>
//                 )}
//               </div>

//               {/* ✅ DYNAMIC NOTIFICATION DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity transition-all"
//                 >
//                   <Bell size={24} style={{ color: "#0F1111" }} />
//                   {unreadCount > 0 && (
//                     <span
//                       className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
//                       style={{
//                         backgroundColor: "#B12704",
//                         color: "#fff",
//                         fontSize: "0.65rem",
//                         border: "2px solid #fff",
//                       }}
//                     >
//                       {unreadCount}
//                     </span>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-3"
//                   style={{ width: "320px" }}
//                 >
//                   <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-dark mb-0">
//                       Notifications
//                     </span>
//                     <Badge bg="secondary" className="rounded-pill">
//                       {unreadCount} New
//                     </Badge>
//                   </div>

//                   <div style={{ maxHeight: "350px", overflowY: "auto" }}>
//                     {notifications.length === 0 ? (
//                       <div className="p-4 text-center text-muted">
//                         <CheckCircle2
//                           size={32}
//                           className="mb-2 text-success opacity-50"
//                         />
//                         <p className="small mb-0 fw-medium">
//                           No new updates right now.
//                         </p>
//                       </div>
//                     ) : (
//                       notifications.map((n) => (
//                         <Dropdown.Item
//                           key={n.id}
//                           onClick={() => navigate(n.link)}
//                           className="p-3 border-bottom text-wrap hover-bg-light transition-all"
//                         >
//                           <div className="d-flex gap-3 align-items-start">
//                             <div className={`mt-1 flex-shrink-0 ${n.color}`}>
//                               <n.icon size={18} />
//                             </div>
//                             <div>
//                               <div className="fw-bold text-dark mb-1 fs-6">
//                                 {n.title}
//                               </div>
//                               <div className="small text-muted lh-sm">
//                                 {n.message}
//                               </div>
//                             </div>
//                           </div>
//                         </Dropdown.Item>
//                       ))
//                     )}
//                   </div>

//                   {notifications.length > 0 && (
//                     <div className="p-2 text-center bg-light border-top">
//                       <button
//                         className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
//                         onClick={handleClearNotifications}
//                       >
//                         Mark all as read
//                       </button>
//                     </div>
//                   )}
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* USER PROFILE DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="d-flex align-items-center gap-3 border-start ps-4 text-decoration-none hide-caret hover-opacity transition-all"
//                   style={{
//                     borderColor: "#D5D9D9 !important",
//                     outline: "none",
//                     boxShadow: "none",
//                   }}
//                 >
//                   <div
//                     className="text-end d-none d-md-block"
//                     style={{ lineHeight: "1.2" }}
//                   >
//                     <div className="fw-bold fs-6" style={{ color: "#0F1111" }}>
//                       {user?.name || "Customer"}
//                     </div>
//                     <div
//                       className="fw-medium text-uppercase mt-1"
//                       style={{
//                         fontSize: "0.7rem",
//                         color: "#007185",
//                         letterSpacing: "0.5px",
//                       }}
//                     >
//                       My Account
//                     </div>
//                   </div>

//                   {getProfileImage() ? (
//                     <img
//                       src={getProfileImage()}
//                       alt="Profile"
//                       className="rounded-circle object-fit-cover border shadow-sm"
//                       style={{
//                         width: "36px",
//                         height: "36px",
//                         borderColor: "#D5D9D9",
//                       }}
//                     />
//                   ) : (
//                     <div className="d-flex align-items-center justify-content-center bg-light rounded-circle p-1">
//                       <UserCircle
//                         size={32}
//                         style={{ color: "#565959", strokeWidth: "1.5" }}
//                       />
//                     </div>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 mt-3"
//                   style={{ minWidth: "200px" }}
//                 >
//                   <div className="px-3 py-2 border-bottom mb-2 bg-light">
//                     <p className="small text-muted mb-0">Signed in as</p>
//                     <p className="fw-bold text-dark mb-0 text-truncate">
//                       {user?.email || "customer@example.com"}
//                     </p>
//                   </div>

//                   <Dropdown.Item
//                     onClick={() => navigate("/profile")}
//                     className="py-2 d-flex align-items-center gap-2 fw-medium text-dark hover-bg-light"
//                   >
//                     <UserCircle size={16} className="text-muted" /> My Profile
//                   </Dropdown.Item>

//                   <Dropdown.Divider />

//                   <Dropdown.Item
//                     onClick={handleLogout}
//                     className="py-2 d-flex align-items-center gap-2 fw-bold text-danger hover-bg-light"
//                   >
//                     <LogOut size={16} /> Sign Out
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//           </div>
//         </header>

//         {/* --- MAIN CONTENT AREA --- */}
//         <main
//           className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar"
//           style={{ backgroundColor: "#f0f2f2" }}
//         >
//           <Breadcrumbs />

//           <div className="mt-2">
//             <Outlet />
//           </div>
//         </main>
//       </div>

//       <style>{`
//         .hide-caret::after { display: none !important; }
//         .hover-bg-light:hover { background-color: #f8fafc !important; }
//         .transition-all { transition: opacity 0.2s ease-in-out; }
//         .hover-opacity:hover { opacity: 0.7; }

//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

//         @keyframes pulse-badge {
//           0% { transform: translate(-50%, -50%) scale(1); }
//           50% { transform: translate(-50%, -50%) scale(1.1); }
//           100% { transform: translate(-50%, -50%) scale(1); }
//         }
//         .animate-pulse { animation: pulse-badge 2s infinite; }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerLayout;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { Dropdown, Badge } from "react-bootstrap";
// import CustomerSidebar from "../components/CustomerSidebar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import {
//   Bell,
//   UserCircle,
//   ShoppingCart,
//   LogOut,
//   Package,
//   MessageSquare,
//   Truck,
//   CheckCircle2,
// } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useAuth } from "../context/AuthContext";
// import api from "../services/api";

// const CustomerLayout = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // --- Notification States ---
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);

//   // --- Handle Screen Resize ---
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (mobile) setCollapsed(true);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // --- Fetch Notifications (Orders + Messages) ---
//   const fetchNotifications = async () => {
//     try {
//       const [msgRes, orderRes] = await Promise.all([
//         api.get("/messages/my").catch(() => ({ data: [] })),
//         api.get("/orders/myorders").catch(() => ({ data: [] })),
//       ]);

//       const alerts = [];

//       // Safely extract arrays
//       const messages = Array.isArray(msgRes.data)
//         ? msgRes.data
//         : msgRes.data?.messages || [];
//       const orders = Array.isArray(orderRes.data)
//         ? orderRes.data
//         : orderRes.data?.orders || [];

//       // 1. Check for unread support messages AND Doctor messages
//       const unreadMsgs = messages.filter((m) => {
//         // Admin replies use isReplyRead. Doctor messages use isRead (or senderModel).
//         const isUnreadSupport = m.adminReply && !m.isReplyRead;
//         // Adjust this check based on how your backend marks Doctor messages as read
//         const isUnreadDoctor = m.senderModel === "Doctor" && m.isRead === false;

//         // If your doctor chat doesn't have `isRead` yet, you can temporarily just check senderModel
//         // const isUnreadDoctor = m.senderModel === "Doctor";

//         return isUnreadSupport || isUnreadDoctor;
//       });

//       if (unreadMsgs.length > 0) {
//         // Separate them to show distinct messages in the dropdown
//         const supportMsgs = unreadMsgs.filter((m) => m.adminReply);
//         const doctorMsgs = unreadMsgs.filter((m) => m.senderModel === "Doctor");

//         if (supportMsgs.length > 0) {
//           alerts.push({
//             id: `support-msg-${supportMsgs.map((m) => m._id).join("-")}`,
//             type: "message", // Protects from being dismissed
//             title: "Support Reply",
//             message: `You have ${supportMsgs.length} unread message(s) from support.`,
//             link: "/customer-dashboard", // Scroll state can be passed in UI
//             icon: MessageSquare,
//             color: "text-info",
//           });
//         }

//         if (doctorMsgs.length > 0) {
//           alerts.push({
//             id: `doc-msg-${doctorMsgs.map((m) => m._id).join("-")}`,
//             type: "message", // Protects from being dismissed
//             title: "New Message from Doctor",
//             message: `You have ${doctorMsgs.length} unread message(s) from your doctor.`,
//             link: "/appointments", // Or wherever your patient chat page is
//             icon: MessageSquare,
//             color: "text-primary",
//           });
//         }
//       }

//       // 2. Check for active order statuses
//       const activeOrders = orders.filter((o) =>
//         ["Processing", "Shipped", "Delivered"].includes(o.orderStatus),
//       );

//       activeOrders
//         .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
//         .slice(0, 3)
//         .forEach((order) => {
//           let icon = Package;
//           let color = "text-warning";
//           let title = "Order Processing";
//           let message = `Your order #${order._id.substring(order._id.length - 6).toUpperCase()} is being prepared.`;

//           if (order.orderStatus === "Shipped") {
//             icon = Truck;
//             color = "text-primary";
//             title = "Order Shipped!";
//             message = `Your order is on the way.`;
//           } else if (order.orderStatus === "Delivered") {
//             icon = CheckCircle2;
//             color = "text-success";
//             title = "Order Delivered";
//             message = `Your order has been successfully delivered.`;
//           }

//           alerts.push({
//             id: `order-${order._id}-${order.orderStatus}`,
//             type: "order",
//             title,
//             message,
//             link: `/order/${order._id}`,
//             icon,
//             color,
//           });
//         });

//       // ✅ SECURE LOCAL STORAGE FILTERING
//       const dismissedIds =
//         JSON.parse(localStorage.getItem("dismissedAlerts")) || [];

//       // Filter out any alerts that are in the dismissed list
//       const activeAlerts = alerts.filter((alert) => {
//         // ALWAYS show unread messages, even if user tried to dismiss them!
//         if (alert.type === "message") return true;
//         return !dismissedIds.includes(alert.id);
//       });

//       setNotifications(activeAlerts);
//       setUnreadCount(activeAlerts.length);
//     } catch (error) {
//       console.error("Failed to fetch notifications", error);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 15000); // Check every 15s
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ MARK ALL AS READ LOGIC (Only dismisses Orders, not Messages!)
//   const handleClearNotifications = () => {
//     // Only target order alerts for dismissal
//     const orderAlerts = notifications.filter((n) => n.type !== "message");
//     const currentOrderIds = orderAlerts.map((n) => n.id);

//     const previouslyDismissed =
//       JSON.parse(localStorage.getItem("dismissedAlerts")) || [];
//     const newDismissed = [
//       ...new Set([...previouslyDismissed, ...currentOrderIds]),
//     ];

//     localStorage.setItem("dismissedAlerts", JSON.stringify(newDismissed));

//     // Keep the unread messages in the dropdown so the user knows they still need to read them!
//     const remainingMessages = notifications.filter((n) => n.type === "message");
//     setNotifications(remainingMessages);
//     setUnreadCount(remainingMessages.length);
//   };

//   // --- Cart Calculation ---
//   const cart = useSelector((state) => state.cart);
//   const cartItems = cart?.cartItems || [];

//   const cartCount = cartItems.reduce((total, item) => {
//     if (item && typeof item === "object" && Object.keys(item).length > 0) {
//       const qty = Number(item.qty);
//       if (!isNaN(qty) && qty > 0) {
//         return total + qty;
//       }
//     }
//     return total;
//   }, 0);

//   // --- Profile Image Helper ---
//   const getProfileImage = () => {
//     if (
//       user?.profilePhoto &&
//       user.profilePhoto !== "none" &&
//       !user.profilePhoto.includes("sample-doctor.jpg")
//     ) {
//       if (user.profilePhoto.startsWith("http")) return user.profilePhoto;
//       let cleanPath = user.profilePhoto.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
//       return `http://localhost:5000${cleanPath}`;
//     }
//     return null;
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div
//       className="d-flex min-vh-100"
//       style={{
//         backgroundColor: "#f0f2f2",
//         fontFamily: "'Inter', system-ui, sans-serif",
//       }}
//     >
//       <CustomerSidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         isMobile={isMobile}
//       />

//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         <header
//           className="bg-white px-4 py-3 flex-shrink-0 z-3 shadow-sm"
//           style={{ borderBottom: "1px solid #D5D9D9" }}
//         >
//           <div className="d-flex align-items-center justify-content-between">
//             {/* Page Title */}
//             <div>
//               <h4
//                 className="mb-0 fw-bold"
//                 style={{ color: "#0F1111", fontSize: "1.25rem" }}
//               >
//                 Patient Portal
//               </h4>
//               <p className="small mb-0" style={{ color: "#565959" }}>
//                 Manage your health, prescriptions, and orders.
//               </p>
//             </div>

//             {/* Right Side Icons */}
//             <div className="d-flex align-items-center gap-4">
//               {/* CART ICON */}
//               <div
//                 className="position-relative d-flex align-items-center justify-content-center transition-all hover-opacity"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/cart")}
//                 title="View Cart"
//               >
//                 <ShoppingCart size={24} style={{ color: "#0F1111" }} />
//                 {cartCount > 0 && (
//                   <span
//                     className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
//                     style={{
//                       backgroundColor: "#B12704",
//                       color: "#fff",
//                       fontSize: "0.65rem",
//                       border: "2px solid #fff",
//                     }}
//                   >
//                     {cartCount}
//                   </span>
//                 )}
//               </div>

//               {/* ✅ DYNAMIC NOTIFICATION DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity transition-all"
//                 >
//                   <Bell size={24} style={{ color: "#0F1111" }} />
//                   {unreadCount > 0 && (
//                     <span
//                       className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
//                       style={{
//                         backgroundColor: "#B12704",
//                         color: "#fff",
//                         fontSize: "0.65rem",
//                         border: "2px solid #fff",
//                       }}
//                     >
//                       {unreadCount}
//                     </span>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-3"
//                   style={{ width: "320px" }}
//                 >
//                   <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-dark mb-0">
//                       Notifications
//                     </span>
//                     <Badge bg="secondary" className="rounded-pill">
//                       {unreadCount} New
//                     </Badge>
//                   </div>

//                   <div style={{ maxHeight: "350px", overflowY: "auto" }}>
//                     {notifications.length === 0 ? (
//                       <div className="p-4 text-center text-muted">
//                         <CheckCircle2
//                           size={32}
//                           className="mb-2 text-success opacity-50"
//                         />
//                         <p className="small mb-0 fw-medium">
//                           No new updates right now.
//                         </p>
//                       </div>
//                     ) : (
//                       notifications.map((n) => (
//                         <Dropdown.Item
//                           key={n.id}
//                           onClick={() => {
//                             if (
//                               n.type === "message" &&
//                               n.title === "Support Reply"
//                             ) {
//                               navigate("/customer-dashboard", {
//                                 state: { scrollTo: "support-tickets" },
//                               });
//                             } else {
//                               navigate(n.link);
//                             }
//                           }}
//                           className="p-3 border-bottom text-wrap hover-bg-light transition-all"
//                         >
//                           <div className="d-flex gap-3 align-items-start">
//                             <div className={`mt-1 flex-shrink-0 ${n.color}`}>
//                               <n.icon size={18} />
//                             </div>
//                             <div>
//                               <div className="fw-bold text-dark mb-1 fs-6">
//                                 {n.title}
//                               </div>
//                               <div className="small text-muted lh-sm">
//                                 {n.message}
//                               </div>
//                             </div>
//                           </div>
//                         </Dropdown.Item>
//                       ))
//                     )}
//                   </div>

//                   {/* Only show Mark as read if there are dismissible orders */}
//                   {notifications.some((n) => n.type !== "message") && (
//                     <div className="p-2 text-center bg-light border-top">
//                       <button
//                         className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
//                         onClick={handleClearNotifications}
//                       >
//                         Dismiss Order Alerts
//                       </button>
//                     </div>
//                   )}
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* USER PROFILE DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="d-flex align-items-center gap-3 border-start ps-4 text-decoration-none hide-caret hover-opacity transition-all"
//                   style={{
//                     borderColor: "#D5D9D9 !important",
//                     outline: "none",
//                     boxShadow: "none",
//                   }}
//                 >
//                   <div
//                     className="text-end d-none d-md-block"
//                     style={{ lineHeight: "1.2" }}
//                   >
//                     <div className="fw-bold fs-6" style={{ color: "#0F1111" }}>
//                       {user?.name || "Customer"}
//                     </div>
//                     <div
//                       className="fw-medium text-uppercase mt-1"
//                       style={{
//                         fontSize: "0.7rem",
//                         color: "#007185",
//                         letterSpacing: "0.5px",
//                       }}
//                     >
//                       My Account
//                     </div>
//                   </div>

//                   {getProfileImage() ? (
//                     <img
//                       src={getProfileImage()}
//                       alt="Profile"
//                       className="rounded-circle object-fit-cover border shadow-sm"
//                       style={{
//                         width: "36px",
//                         height: "36px",
//                         borderColor: "#D5D9D9",
//                       }}
//                     />
//                   ) : (
//                     <div className="d-flex align-items-center justify-content-center bg-light rounded-circle p-1">
//                       <UserCircle
//                         size={32}
//                         style={{ color: "#565959", strokeWidth: "1.5" }}
//                       />
//                     </div>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 mt-3"
//                   style={{ minWidth: "200px" }}
//                 >
//                   <div className="px-3 py-2 border-bottom mb-2 bg-light">
//                     <p className="small text-muted mb-0">Signed in as</p>
//                     <p className="fw-bold text-dark mb-0 text-truncate">
//                       {user?.email || "customer@example.com"}
//                     </p>
//                   </div>

//                   <Dropdown.Item
//                     onClick={() => navigate("/profile")}
//                     className="py-2 d-flex align-items-center gap-2 fw-medium text-dark hover-bg-light"
//                   >
//                     <UserCircle size={16} className="text-muted" /> My Profile
//                   </Dropdown.Item>

//                   <Dropdown.Divider />

//                   <Dropdown.Item
//                     onClick={handleLogout}
//                     className="py-2 d-flex align-items-center gap-2 fw-bold text-danger hover-bg-light"
//                   >
//                     <LogOut size={16} /> Sign Out
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//           </div>
//         </header>

//         {/* --- MAIN CONTENT AREA --- */}
//         <main
//           className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar"
//           style={{ backgroundColor: "#f0f2f2" }}
//         >
//           <Breadcrumbs />

//           <div className="mt-2">
//             <Outlet />
//           </div>
//         </main>
//       </div>

//       <style>{`
//         .hide-caret::after { display: none !important; }
//         .hover-bg-light:hover { background-color: #f8fafc !important; }
//         .transition-all { transition: opacity 0.2s ease-in-out; }
//         .hover-opacity:hover { opacity: 0.7; }

//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

//         @keyframes pulse-badge {
//           0% { transform: translate(-50%, -50%) scale(1); }
//           50% { transform: translate(-50%, -50%) scale(1.1); }
//           100% { transform: translate(-50%, -50%) scale(1); }
//         }
//         .animate-pulse { animation: pulse-badge 2s infinite; }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerLayout;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { Dropdown, Badge } from "react-bootstrap";
// import CustomerSidebar from "../components/CustomerSidebar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import {
//   Bell,
//   UserCircle,
//   ShoppingCart,
//   LogOut,
//   Package,
//   MessageSquare,
//   Truck,
//   CheckCircle2,
// } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useAuth } from "../context/AuthContext";
// import api from "../services/api";

// const CustomerLayout = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // --- Separate Notification States ---
//   const [orderAlerts, setOrderAlerts] = useState([]);
//   const [msgAlerts, setMsgAlerts] = useState([]);

//   // --- Handle Screen Resize ---
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (mobile) setCollapsed(true);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // --- Fetch Notifications (Orders + Messages) ---
//   const fetchNotifications = async () => {
//     try {
//       const [msgRes, orderRes] = await Promise.all([
//         api.get("/messages/my").catch(() => ({ data: [] })),
//         api.get("/orders/myorders").catch(() => ({ data: [] })),
//       ]);

//       // Safely extract arrays
//       const messages = Array.isArray(msgRes.data)
//         ? msgRes.data
//         : msgRes.data?.messages || [];
//       const orders = Array.isArray(orderRes.data)
//         ? orderRes.data
//         : orderRes.data?.orders || [];

//       // ==========================================
//       // 1. MESSAGE ALERTS (Message Icon)
//       // ==========================================
//       const generatedMsgAlerts = [];

//       const unreadSupportMsgs = messages.filter(
//         (m) => m.adminReply && !m.isReplyRead,
//       );
//       const unreadDoctorMsgs = messages.filter(
//         (m) => m.senderModel === "Doctor" && m.isRead === false,
//       );

//       if (unreadSupportMsgs.length > 0) {
//         generatedMsgAlerts.push({
//           id: `support-msg-${unreadSupportMsgs.map((m) => m._id).join("-")}`,
//           title: "Support Reply",
//           message: `You have ${unreadSupportMsgs.length} unread message(s) from support.`,
//           link: "/customer-dashboard",
//           icon: MessageSquare,
//           color: "text-info",
//         });
//       }

//       if (unreadDoctorMsgs.length > 0) {
//         generatedMsgAlerts.push({
//           id: `doc-msg-${unreadDoctorMsgs.map((m) => m._id).join("-")}`,
//           title: "New Message from Doctor",
//           message: `You have ${unreadDoctorMsgs.length} unread message(s) from your doctor.`,
//           link: "/appointments",
//           icon: MessageSquare,
//           color: "text-primary",
//         });
//       }

//       setMsgAlerts(generatedMsgAlerts); // No localStorage filter for messages! Must read to clear.

//       // ==========================================
//       // 2. ORDER ALERTS (Bell Icon)
//       // ==========================================
//       const activeOrders = orders.filter((o) =>
//         ["Processing", "Shipped", "Delivered"].includes(o.orderStatus),
//       );

//       const generatedOrderAlerts = activeOrders
//         .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
//         .slice(0, 3)
//         .map((order) => {
//           let icon = Package;
//           let color = "text-warning";
//           let title = "Order Processing";
//           let message = `Your order #${order._id.substring(order._id.length - 6).toUpperCase()} is being prepared.`;

//           if (order.orderStatus === "Shipped") {
//             icon = Truck;
//             color = "text-primary";
//             title = "Order Shipped!";
//             message = `Your order is on the way.`;
//           } else if (order.orderStatus === "Delivered") {
//             icon = CheckCircle2;
//             color = "text-success";
//             title = "Order Delivered";
//             message = `Your order has been successfully delivered.`;
//           }

//           return {
//             id: `order-${order._id}-${order.orderStatus}`,
//             title,
//             message,
//             link: `/order/${order._id}`,
//             icon,
//             color,
//           };
//         });

//       // ✅ SECURE LOCAL STORAGE FILTERING (Only for Orders)
//       const dismissedOrderIds =
//         JSON.parse(localStorage.getItem("dismissedOrderAlerts")) || [];
//       setOrderAlerts(
//         generatedOrderAlerts.filter(
//           (alert) => !dismissedOrderIds.includes(alert.id),
//         ),
//       );
//     } catch (error) {
//       console.error("Failed to fetch notifications", error);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 15000); // Check every 15s
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ MARK ALL AS READ LOGIC (Only dismisses Orders)
//   const handleClearOrderAlerts = () => {
//     const currentOrderIds = orderAlerts.map((n) => n.id);
//     const previouslyDismissed =
//       JSON.parse(localStorage.getItem("dismissedOrderAlerts")) || [];
//     const newDismissed = [
//       ...new Set([...previouslyDismissed, ...currentOrderIds]),
//     ];

//     localStorage.setItem("dismissedOrderAlerts", JSON.stringify(newDismissed));
//     setOrderAlerts([]); // Clear the UI
//   };

//   // --- Cart Calculation ---
//   const cart = useSelector((state) => state.cart);
//   const cartItems = cart?.cartItems || [];

//   const cartCount = cartItems.reduce((total, item) => {
//     if (item && typeof item === "object" && Object.keys(item).length > 0) {
//       const qty = Number(item.qty);
//       if (!isNaN(qty) && qty > 0) {
//         return total + qty;
//       }
//     }
//     return total;
//   }, 0);

//   // --- Profile Image Helper ---
//   const getProfileImage = () => {
//     if (
//       user?.profilePhoto &&
//       user.profilePhoto !== "none" &&
//       !user.profilePhoto.includes("sample-doctor.jpg")
//     ) {
//       if (user.profilePhoto.startsWith("http")) return user.profilePhoto;
//       let cleanPath = user.profilePhoto.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
//       return `http://localhost:5000${cleanPath}`;
//     }
//     return null;
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div
//       className="d-flex min-vh-100"
//       style={{
//         backgroundColor: "#f0f2f2",
//         fontFamily: "'Inter', system-ui, sans-serif",
//       }}
//     >
//       <CustomerSidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         isMobile={isMobile}
//       />

//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         <header
//           className="bg-white px-4 py-3 flex-shrink-0 z-3 shadow-sm"
//           style={{ borderBottom: "1px solid #D5D9D9" }}
//         >
//           <div className="d-flex align-items-center justify-content-between">
//             {/* Page Title */}
//             <div>
//               <h4
//                 className="mb-0 fw-bold"
//                 style={{ color: "#0F1111", fontSize: "1.25rem" }}
//               >
//                 Patient Portal
//               </h4>
//               <p className="small mb-0" style={{ color: "#565959" }}>
//                 Manage your health, prescriptions, and orders.
//               </p>
//             </div>

//             {/* Right Side Icons */}
//             <div className="d-flex align-items-center gap-4">
//               {/* CART ICON */}
//               <div
//                 className="position-relative d-flex align-items-center justify-content-center transition-all hover-opacity"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/cart")}
//                 title="View Cart"
//               >
//                 <ShoppingCart size={24} style={{ color: "#0F1111" }} />
//                 {cartCount > 0 && (
//                   <span
//                     className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
//                     style={{
//                       backgroundColor: "#B12704",
//                       color: "#fff",
//                       fontSize: "0.65rem",
//                       border: "2px solid #fff",
//                     }}
//                   >
//                     {cartCount}
//                   </span>
//                 )}
//               </div>

//               {/* ========================================== */}
//               {/* 💬 DEDICATED MESSAGE DROPDOWN */}
//               {/* ========================================== */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity transition-all"
//                   title="Messages"
//                 >
//                   <MessageSquare size={24} style={{ color: "#0F1111" }} />
//                   {msgAlerts.length > 0 && (
//                     <span
//                       className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
//                       style={{
//                         backgroundColor: "#B12704",
//                         color: "#fff",
//                         fontSize: "0.65rem",
//                         border: "2px solid #fff",
//                       }}
//                     >
//                       {msgAlerts.length}
//                     </span>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-3"
//                   style={{ width: "320px" }}
//                 >
//                   <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-dark mb-0">Messages</span>
//                     <Badge bg="primary" className="rounded-pill">
//                       {msgAlerts.length} Unread
//                     </Badge>
//                   </div>

//                   <div style={{ maxHeight: "350px", overflowY: "auto" }}>
//                     {msgAlerts.length === 0 ? (
//                       <div className="p-4 text-center text-muted">
//                         <CheckCircle2
//                           size={32}
//                           className="mb-2 text-success opacity-50"
//                         />
//                         <p className="small mb-0 fw-medium">Inbox is clear!</p>
//                       </div>
//                     ) : (
//                       msgAlerts.map((n) => (
//                         <Dropdown.Item
//                           key={n.id}
//                           onClick={() => {
//                             if (n.title === "Support Reply") {
//                               navigate("/customer-dashboard", {
//                                 state: { scrollTo: "support-tickets" },
//                               });
//                             } else {
//                               navigate(n.link);
//                             }
//                           }}
//                           className="p-3 border-bottom text-wrap hover-bg-light transition-all"
//                         >
//                           <div className="d-flex gap-3 align-items-start">
//                             <div className={`mt-1 flex-shrink-0 ${n.color}`}>
//                               <n.icon size={18} />
//                             </div>
//                             <div>
//                               <div className="fw-bold text-dark mb-1 fs-6">
//                                 {n.title}
//                               </div>
//                               <div className="small text-muted lh-sm">
//                                 {n.message}
//                               </div>
//                             </div>
//                           </div>
//                         </Dropdown.Item>
//                       ))
//                     )}
//                   </div>
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* ========================================== */}
//               {/* 🔔 DEDICATED ORDER NOTIFICATION DROPDOWN */}
//               {/* ========================================== */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity transition-all"
//                   title="Notifications"
//                 >
//                   <Bell size={24} style={{ color: "#0F1111" }} />
//                   {orderAlerts.length > 0 && (
//                     <span
//                       className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
//                       style={{
//                         backgroundColor: "#B12704",
//                         color: "#fff",
//                         fontSize: "0.65rem",
//                         border: "2px solid #fff",
//                       }}
//                     >
//                       {orderAlerts.length}
//                     </span>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-3"
//                   style={{ width: "320px" }}
//                 >
//                   <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-dark mb-0">
//                       System Alerts
//                     </span>
//                     <Badge bg="secondary" className="rounded-pill">
//                       {orderAlerts.length} New
//                     </Badge>
//                   </div>

//                   <div style={{ maxHeight: "350px", overflowY: "auto" }}>
//                     {orderAlerts.length === 0 ? (
//                       <div className="p-4 text-center text-muted">
//                         <CheckCircle2
//                           size={32}
//                           className="mb-2 text-success opacity-50"
//                         />
//                         <p className="small mb-0 fw-medium">
//                           No new updates right now.
//                         </p>
//                       </div>
//                     ) : (
//                       orderAlerts.map((n) => (
//                         <Dropdown.Item
//                           key={n.id}
//                           onClick={() => navigate(n.link)}
//                           className="p-3 border-bottom text-wrap hover-bg-light transition-all"
//                         >
//                           <div className="d-flex gap-3 align-items-start">
//                             <div className={`mt-1 flex-shrink-0 ${n.color}`}>
//                               <n.icon size={18} />
//                             </div>
//                             <div>
//                               <div className="fw-bold text-dark mb-1 fs-6">
//                                 {n.title}
//                               </div>
//                               <div className="small text-muted lh-sm">
//                                 {n.message}
//                               </div>
//                             </div>
//                           </div>
//                         </Dropdown.Item>
//                       ))
//                     )}
//                   </div>

//                   {orderAlerts.length > 0 && (
//                     <div className="p-2 text-center bg-light border-top">
//                       <button
//                         className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
//                         onClick={handleClearOrderAlerts}
//                       >
//                         Dismiss Order Alerts
//                       </button>
//                     </div>
//                   )}
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* ========================================== */}
//               {/* USER PROFILE DROPDOWN */}
//               {/* ========================================== */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="d-flex align-items-center gap-3 border-start ps-4 text-decoration-none hide-caret hover-opacity transition-all"
//                   style={{
//                     borderColor: "#D5D9D9 !important",
//                     outline: "none",
//                     boxShadow: "none",
//                   }}
//                 >
//                   <div
//                     className="text-end d-none d-md-block"
//                     style={{ lineHeight: "1.2" }}
//                   >
//                     <div className="fw-bold fs-6" style={{ color: "#0F1111" }}>
//                       {user?.name || "Customer"}
//                     </div>
//                     <div
//                       className="fw-medium text-uppercase mt-1"
//                       style={{
//                         fontSize: "0.7rem",
//                         color: "#007185",
//                         letterSpacing: "0.5px",
//                       }}
//                     >
//                       My Account
//                     </div>
//                   </div>

//                   {getProfileImage() ? (
//                     <img
//                       src={getProfileImage()}
//                       alt="Profile"
//                       className="rounded-circle object-fit-cover border shadow-sm"
//                       style={{
//                         width: "36px",
//                         height: "36px",
//                         borderColor: "#D5D9D9",
//                       }}
//                     />
//                   ) : (
//                     <div className="d-flex align-items-center justify-content-center bg-light rounded-circle p-1">
//                       <UserCircle
//                         size={32}
//                         style={{ color: "#565959", strokeWidth: "1.5" }}
//                       />
//                     </div>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 mt-3"
//                   style={{ minWidth: "200px" }}
//                 >
//                   <div className="px-3 py-2 border-bottom mb-2 bg-light">
//                     <p className="small text-muted mb-0">Signed in as</p>
//                     <p className="fw-bold text-dark mb-0 text-truncate">
//                       {user?.email || "customer@example.com"}
//                     </p>
//                   </div>

//                   <Dropdown.Item
//                     onClick={() => navigate("/profile")}
//                     className="py-2 d-flex align-items-center gap-2 fw-medium text-dark hover-bg-light"
//                   >
//                     <UserCircle size={16} className="text-muted" /> My Profile
//                   </Dropdown.Item>

//                   <Dropdown.Divider />

//                   <Dropdown.Item
//                     onClick={handleLogout}
//                     className="py-2 d-flex align-items-center gap-2 fw-bold text-danger hover-bg-light"
//                   >
//                     <LogOut size={16} /> Sign Out
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//           </div>
//         </header>

//         {/* --- MAIN CONTENT AREA --- */}
//         <main
//           className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar"
//           style={{ backgroundColor: "#f0f2f2" }}
//         >
//           <Breadcrumbs />

//           <div className="mt-2">
//             <Outlet />
//           </div>
//         </main>
//       </div>

//       <style>{`
//         .hide-caret::after { display: none !important; }
//         .hover-bg-light:hover { background-color: #f8fafc !important; }
//         .transition-all { transition: opacity 0.2s ease-in-out; }
//         .hover-opacity:hover { opacity: 0.7; }

//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

//         @keyframes pulse-badge {
//           0% { transform: translate(-50%, -50%) scale(1); }
//           50% { transform: translate(-50%, -50%) scale(1.1); }
//           100% { transform: translate(-50%, -50%) scale(1); }
//         }
//         .animate-pulse { animation: pulse-badge 2s infinite; }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerLayout;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { Dropdown, Badge } from "react-bootstrap";
// import CustomerSidebar from "../components/CustomerSidebar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import {
//   Bell,
//   UserCircle,
//   ShoppingCart,
//   LogOut,
//   Package,
//   MessageSquare,
//   Truck,
//   CheckCircle2,
// } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useAuth } from "../context/AuthContext";
// import api from "../services/api";

// const CustomerLayout = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // --- Separate Notification States ---
//   const [orderAlerts, setOrderAlerts] = useState([]);
//   const [msgAlerts, setMsgAlerts] = useState([]);

//   // --- Handle Screen Resize ---
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (mobile) setCollapsed(true);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // --- Fetch Notifications (Orders + Messages) ---
//   const fetchNotifications = async () => {
//     try {
//       const [msgRes, orderRes] = await Promise.all([
//         api.get("/messages/my").catch(() => ({ data: [] })),
//         api.get("/orders/myorders").catch(() => ({ data: [] })),
//       ]);

//       // Safely extract arrays
//       const messages = Array.isArray(msgRes.data)
//         ? msgRes.data
//         : msgRes.data?.messages || [];
//       const orders = Array.isArray(orderRes.data)
//         ? orderRes.data
//         : orderRes.data?.orders || [];

//       // ==========================================
//       // 1. MESSAGE ALERTS (Message Icon)
//       // ==========================================
//       const generatedMsgAlerts = [];

//       // A. Support tickets: Admin has replied, but user hasn't read it
//       const unreadSupportMsgs = messages.filter(
//         (m) => m.adminReply && m.isReplyRead === false,
//       );

//       if (unreadSupportMsgs.length > 0) {
//         generatedMsgAlerts.push({
//           id: `support-msg-${unreadSupportMsgs.map((m) => m._id).join("-")}`,
//           title: "Support Reply",
//           message: `You have ${unreadSupportMsgs.length} unread message(s) from support.`,
//           link: "/customer-dashboard", // Scroll state can be passed in UI
//           icon: MessageSquare,
//           color: "text-info",
//         });
//       }

//       // B. BULLETPROOF Doctor Chats check:
//       // Message belongs to an appointment, is unread, and was NOT sent by the patient
//       const unreadDoctorMsgs = messages.filter((m) => {
//         const isChatMsg = Boolean(m.appointment);
//         const isUnread = m.isRead === false;
//         // Safely compare IDs as strings to prevent type mismatches
//         const isFromSomeoneElse = String(m.sender) !== String(user?._id);

//         return isChatMsg && isUnread && isFromSomeoneElse;
//       });

//       if (unreadDoctorMsgs.length > 0) {
//         // Group by appointment so we don't show 5 alerts for the same chat
//         const groupedDoctorMsgs = {};
//         unreadDoctorMsgs.forEach((m) => {
//           if (!groupedDoctorMsgs[m.appointment])
//             groupedDoctorMsgs[m.appointment] = 0;
//           groupedDoctorMsgs[m.appointment]++;
//         });

//         Object.keys(groupedDoctorMsgs).forEach((apptId) => {
//           generatedMsgAlerts.push({
//             id: `doc-msg-${apptId}`,
//             title: "New Message from Doctor",
//             message: `You have ${groupedDoctorMsgs[apptId]} unread message(s) in an active chat.`,
//             link: "/appointments", // Or route directly to the chat if you have a specific URL
//             icon: MessageSquare,
//             color: "text-primary",
//           });
//         });
//       }

//       setMsgAlerts(generatedMsgAlerts); // No localStorage filter for messages! Must read to clear.

//       // ==========================================
//       // 2. ORDER ALERTS (Bell Icon)
//       // ==========================================
//       const activeOrders = orders.filter((o) =>
//         ["Processing", "Shipped", "Delivered"].includes(o.orderStatus),
//       );

//       const generatedOrderAlerts = activeOrders
//         .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
//         .slice(0, 3)
//         .map((order) => {
//           let icon = Package;
//           let color = "text-warning";
//           let title = "Order Processing";
//           let message = `Your order #${order._id.substring(order._id.length - 6).toUpperCase()} is being prepared.`;

//           if (order.orderStatus === "Shipped") {
//             icon = Truck;
//             color = "text-primary";
//             title = "Order Shipped!";
//             message = `Your order is on the way.`;
//           } else if (order.orderStatus === "Delivered") {
//             icon = CheckCircle2;
//             color = "text-success";
//             title = "Order Delivered";
//             message = `Your order has been successfully delivered.`;
//           }

//           return {
//             id: `order-${order._id}-${order.orderStatus}`,
//             title,
//             message,
//             link: `/order/${order._id}`,
//             icon,
//             color,
//           };
//         });

//       // ✅ SECURE LOCAL STORAGE FILTERING (Only for Orders)
//       const dismissedOrderIds =
//         JSON.parse(localStorage.getItem("dismissedOrderAlerts")) || [];
//       setOrderAlerts(
//         generatedOrderAlerts.filter(
//           (alert) => !dismissedOrderIds.includes(alert.id),
//         ),
//       );
//     } catch (error) {
//       console.error("Failed to fetch notifications", error);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 15000); // Check every 15s
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ MARK ALL AS READ LOGIC (Only dismisses Orders)
//   const handleClearOrderAlerts = () => {
//     const currentOrderIds = orderAlerts.map((n) => n.id);
//     const previouslyDismissed =
//       JSON.parse(localStorage.getItem("dismissedOrderAlerts")) || [];
//     const newDismissed = [
//       ...new Set([...previouslyDismissed, ...currentOrderIds]),
//     ];

//     localStorage.setItem("dismissedOrderAlerts", JSON.stringify(newDismissed));
//     setOrderAlerts([]); // Clear the UI
//   };

//   // --- Cart Calculation ---
//   const cart = useSelector((state) => state.cart);
//   const cartItems = cart?.cartItems || [];

//   const cartCount = cartItems.reduce((total, item) => {
//     if (item && typeof item === "object" && Object.keys(item).length > 0) {
//       const qty = Number(item.qty);
//       if (!isNaN(qty) && qty > 0) {
//         return total + qty;
//       }
//     }
//     return total;
//   }, 0);

//   // --- Profile Image Helper ---
//   const getProfileImage = () => {
//     if (
//       user?.profilePhoto &&
//       user.profilePhoto !== "none" &&
//       !user.profilePhoto.includes("sample-doctor.jpg")
//     ) {
//       if (user.profilePhoto.startsWith("http")) return user.profilePhoto;
//       let cleanPath = user.profilePhoto.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
//       return `http://localhost:5000${cleanPath}`;
//     }
//     return null;
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div
//       className="d-flex min-vh-100"
//       style={{
//         backgroundColor: "#f0f2f2",
//         fontFamily: "'Inter', system-ui, sans-serif",
//       }}
//     >
//       <CustomerSidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         isMobile={isMobile}
//       />

//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         <header
//           className="bg-white px-4 py-3 flex-shrink-0 z-3 shadow-sm"
//           style={{ borderBottom: "1px solid #D5D9D9" }}
//         >
//           <div className="d-flex align-items-center justify-content-between">
//             {/* Page Title */}
//             <div>
//               <h4
//                 className="mb-0 fw-bold"
//                 style={{ color: "#0F1111", fontSize: "1.25rem" }}
//               >
//                 Patient Portal
//               </h4>
//               <p className="small mb-0" style={{ color: "#565959" }}>
//                 Manage your health, prescriptions, and orders.
//               </p>
//             </div>

//             {/* Right Side Icons */}
//             <div className="d-flex align-items-center gap-4">
//               {/* CART ICON */}
//               <div
//                 className="position-relative d-flex align-items-center justify-content-center transition-all hover-opacity"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/cart")}
//                 title="View Cart"
//               >
//                 <ShoppingCart size={24} style={{ color: "#0F1111" }} />
//                 {cartCount > 0 && (
//                   <span
//                     className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
//                     style={{
//                       backgroundColor: "#B12704",
//                       color: "#fff",
//                       fontSize: "0.65rem",
//                       border: "2px solid #fff",
//                     }}
//                   >
//                     {cartCount}
//                   </span>
//                 )}
//               </div>

//               {/* ========================================== */}
//               {/* 💬 DEDICATED MESSAGE DROPDOWN */}
//               {/* ========================================== */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity transition-all"
//                   title="Messages"
//                 >
//                   <MessageSquare size={24} style={{ color: "#0F1111" }} />
//                   {msgAlerts.length > 0 && (
//                     <span
//                       className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
//                       style={{
//                         backgroundColor: "#B12704",
//                         color: "#fff",
//                         fontSize: "0.65rem",
//                         border: "2px solid #fff",
//                       }}
//                     >
//                       {msgAlerts.length}
//                     </span>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-3"
//                   style={{ width: "320px" }}
//                 >
//                   <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-dark mb-0">Messages</span>
//                     <Badge bg="primary" className="rounded-pill">
//                       {msgAlerts.length} Unread
//                     </Badge>
//                   </div>

//                   <div style={{ maxHeight: "350px", overflowY: "auto" }}>
//                     {msgAlerts.length === 0 ? (
//                       <div className="p-4 text-center text-muted">
//                         <CheckCircle2
//                           size={32}
//                           className="mb-2 text-success opacity-50"
//                         />
//                         <p className="small mb-0 fw-medium">Inbox is clear!</p>
//                       </div>
//                     ) : (
//                       msgAlerts.map((n) => (
//                         <Dropdown.Item
//                           key={n.id}
//                           onClick={() => {
//                             if (n.title === "Support Reply") {
//                               navigate("/customer-dashboard", {
//                                 state: { scrollTo: "support-tickets" },
//                               });
//                             } else {
//                               navigate(n.link);
//                             }
//                           }}
//                           className="p-3 border-bottom text-wrap hover-bg-light transition-all"
//                         >
//                           <div className="d-flex gap-3 align-items-start">
//                             <div className={`mt-1 flex-shrink-0 ${n.color}`}>
//                               <n.icon size={18} />
//                             </div>
//                             <div>
//                               <div className="fw-bold text-dark mb-1 fs-6">
//                                 {n.title}
//                               </div>
//                               <div className="small text-muted lh-sm">
//                                 {n.message}
//                               </div>
//                             </div>
//                           </div>
//                         </Dropdown.Item>
//                       ))
//                     )}
//                   </div>
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* ========================================== */}
//               {/* 🔔 DEDICATED ORDER NOTIFICATION DROPDOWN */}
//               {/* ========================================== */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity transition-all"
//                   title="Notifications"
//                 >
//                   <Bell size={24} style={{ color: "#0F1111" }} />
//                   {orderAlerts.length > 0 && (
//                     <span
//                       className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
//                       style={{
//                         backgroundColor: "#B12704",
//                         color: "#fff",
//                         fontSize: "0.65rem",
//                         border: "2px solid #fff",
//                       }}
//                     >
//                       {orderAlerts.length}
//                     </span>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-3"
//                   style={{ width: "320px" }}
//                 >
//                   <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-dark mb-0">
//                       System Alerts
//                     </span>
//                     <Badge bg="secondary" className="rounded-pill">
//                       {orderAlerts.length} New
//                     </Badge>
//                   </div>

//                   <div style={{ maxHeight: "350px", overflowY: "auto" }}>
//                     {orderAlerts.length === 0 ? (
//                       <div className="p-4 text-center text-muted">
//                         <CheckCircle2
//                           size={32}
//                           className="mb-2 text-success opacity-50"
//                         />
//                         <p className="small mb-0 fw-medium">
//                           No new updates right now.
//                         </p>
//                       </div>
//                     ) : (
//                       orderAlerts.map((n) => (
//                         <Dropdown.Item
//                           key={n.id}
//                           onClick={() => navigate(n.link)}
//                           className="p-3 border-bottom text-wrap hover-bg-light transition-all"
//                         >
//                           <div className="d-flex gap-3 align-items-start">
//                             <div className={`mt-1 flex-shrink-0 ${n.color}`}>
//                               <n.icon size={18} />
//                             </div>
//                             <div>
//                               <div className="fw-bold text-dark mb-1 fs-6">
//                                 {n.title}
//                               </div>
//                               <div className="small text-muted lh-sm">
//                                 {n.message}
//                               </div>
//                             </div>
//                           </div>
//                         </Dropdown.Item>
//                       ))
//                     )}
//                   </div>

//                   {orderAlerts.length > 0 && (
//                     <div className="p-2 text-center bg-light border-top">
//                       <button
//                         className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
//                         onClick={handleClearOrderAlerts}
//                       >
//                         Dismiss Order Alerts
//                       </button>
//                     </div>
//                   )}
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* ========================================== */}
//               {/* USER PROFILE DROPDOWN */}
//               {/* ========================================== */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="d-flex align-items-center gap-3 border-start ps-4 text-decoration-none hide-caret hover-opacity transition-all"
//                   style={{
//                     borderColor: "#D5D9D9 !important",
//                     outline: "none",
//                     boxShadow: "none",
//                   }}
//                 >
//                   <div
//                     className="text-end d-none d-md-block"
//                     style={{ lineHeight: "1.2" }}
//                   >
//                     <div className="fw-bold fs-6" style={{ color: "#0F1111" }}>
//                       {user?.name || "Customer"}
//                     </div>
//                     <div
//                       className="fw-medium text-uppercase mt-1"
//                       style={{
//                         fontSize: "0.7rem",
//                         color: "#007185",
//                         letterSpacing: "0.5px",
//                       }}
//                     >
//                       My Account
//                     </div>
//                   </div>

//                   {getProfileImage() ? (
//                     <img
//                       src={getProfileImage()}
//                       alt="Profile"
//                       className="rounded-circle object-fit-cover border shadow-sm"
//                       style={{
//                         width: "36px",
//                         height: "36px",
//                         borderColor: "#D5D9D9",
//                       }}
//                     />
//                   ) : (
//                     <div className="d-flex align-items-center justify-content-center bg-light rounded-circle p-1">
//                       <UserCircle
//                         size={32}
//                         style={{ color: "#565959", strokeWidth: "1.5" }}
//                       />
//                     </div>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 mt-3"
//                   style={{ minWidth: "200px" }}
//                 >
//                   <div className="px-3 py-2 border-bottom mb-2 bg-light">
//                     <p className="small text-muted mb-0">Signed in as</p>
//                     <p className="fw-bold text-dark mb-0 text-truncate">
//                       {user?.email || "customer@example.com"}
//                     </p>
//                   </div>

//                   <Dropdown.Item
//                     onClick={() => navigate("/profile")}
//                     className="py-2 d-flex align-items-center gap-2 fw-medium text-dark hover-bg-light"
//                   >
//                     <UserCircle size={16} className="text-muted" /> My Profile
//                   </Dropdown.Item>

//                   <Dropdown.Divider />

//                   <Dropdown.Item
//                     onClick={handleLogout}
//                     className="py-2 d-flex align-items-center gap-2 fw-bold text-danger hover-bg-light"
//                   >
//                     <LogOut size={16} /> Sign Out
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//           </div>
//         </header>

//         {/* --- MAIN CONTENT AREA --- */}
//         <main
//           className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar"
//           style={{ backgroundColor: "#f0f2f2" }}
//         >
//           <Breadcrumbs />

//           <div className="mt-2">
//             <Outlet />
//           </div>
//         </main>
//       </div>

//       <style>{`
//         .hide-caret::after { display: none !important; }
//         .hover-bg-light:hover { background-color: #f8fafc !important; }
//         .transition-all { transition: opacity 0.2s ease-in-out; }
//         .hover-opacity:hover { opacity: 0.7; }

//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

//         @keyframes pulse-badge {
//           0% { transform: translate(-50%, -50%) scale(1); }
//           50% { transform: translate(-50%, -50%) scale(1.1); }
//           100% { transform: translate(-50%, -50%) scale(1); }
//         }
//         .animate-pulse { animation: pulse-badge 2s infinite; }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerLayout;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { Dropdown, Badge } from "react-bootstrap";
// import CustomerSidebar from "../components/CustomerSidebar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import {
//   Bell,
//   UserCircle,
//   ShoppingCart,
//   LogOut,
//   Package,
//   MessageSquare,
//   Truck,
//   CheckCircle2,
//   Sun,
//   Moon,
// } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useAuth } from "../context/AuthContext";
// import { useTheme } from "../context/ThemeContext"; // ✅ Import Theme Context
// import api from "../services/api";

// const CustomerLayout = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   // ✅ Extract theme variables
//   const { isDarkMode, toggleTheme } = useTheme();

//   const [collapsed, setCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // --- Separate Notification States ---
//   const [orderAlerts, setOrderAlerts] = useState([]);
//   const [msgAlerts, setMsgAlerts] = useState([]);

//   // --- Handle Screen Resize ---
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (mobile) setCollapsed(true);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // --- Fetch Notifications (Orders + Messages) ---
//   const fetchNotifications = async () => {
//     try {
//       const [msgRes, orderRes] = await Promise.all([
//         api.get("/messages/my").catch(() => ({ data: [] })),
//         api.get("/orders/myorders").catch(() => ({ data: [] })),
//       ]);

//       const messages = Array.isArray(msgRes.data)
//         ? msgRes.data
//         : msgRes.data?.messages || [];
//       const orders = Array.isArray(orderRes.data)
//         ? orderRes.data
//         : orderRes.data?.orders || [];

//       // ==========================================
//       // 1. MESSAGE ALERTS (Message Icon)
//       // ==========================================
//       const generatedMsgAlerts = [];

//       const unreadSupportMsgs = messages.filter(
//         (m) => m.adminReply && m.isReplyRead === false,
//       );
//       if (unreadSupportMsgs.length > 0) {
//         generatedMsgAlerts.push({
//           id: `support-msg-${unreadSupportMsgs.map((m) => m._id).join("-")}`,
//           title: "Support Reply",
//           message: `You have ${unreadSupportMsgs.length} unread message(s) from support.`,
//           link: "/customer-dashboard",
//           icon: MessageSquare,
//           color: "text-info",
//         });
//       }

//       const unreadDoctorMsgs = messages.filter((m) => {
//         const isChatMsg = Boolean(m.appointment);
//         const isUnread = m.isRead === false;
//         const isFromSomeoneElse = String(m.sender) !== String(user?._id);
//         return isChatMsg && isUnread && isFromSomeoneElse;
//       });

//       if (unreadDoctorMsgs.length > 0) {
//         const groupedDoctorMsgs = {};
//         unreadDoctorMsgs.forEach((m) => {
//           if (!groupedDoctorMsgs[m.appointment])
//             groupedDoctorMsgs[m.appointment] = 0;
//           groupedDoctorMsgs[m.appointment]++;
//         });

//         Object.keys(groupedDoctorMsgs).forEach((apptId) => {
//           generatedMsgAlerts.push({
//             id: `doc-msg-${apptId}`,
//             title: "New Message from Doctor",
//             message: `You have ${groupedDoctorMsgs[apptId]} unread message(s) in an active chat.`,
//             link: "/appointments",
//             icon: MessageSquare,
//             color: "text-primary",
//           });
//         });
//       }

//       setMsgAlerts(generatedMsgAlerts);

//       // ==========================================
//       // 2. ORDER ALERTS (Bell Icon)
//       // ==========================================
//       const activeOrders = orders.filter((o) =>
//         ["Processing", "Shipped", "Delivered"].includes(o.orderStatus),
//       );

//       const generatedOrderAlerts = activeOrders
//         .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
//         .slice(0, 3)
//         .map((order) => {
//           let icon = Package;
//           let color = "text-warning";
//           let title = "Order Processing";
//           let message = `Your order #${order._id.substring(order._id.length - 6).toUpperCase()} is being prepared.`;

//           if (order.orderStatus === "Shipped") {
//             icon = Truck;
//             color = "text-primary";
//             title = "Order Shipped!";
//             message = `Your order is on the way.`;
//           } else if (order.orderStatus === "Delivered") {
//             icon = CheckCircle2;
//             color = "text-success";
//             title = "Order Delivered";
//             message = `Your order has been successfully delivered.`;
//           }

//           return {
//             id: `order-${order._id}-${order.orderStatus}`,
//             title,
//             message,
//             link: `/order/${order._id}`,
//             icon,
//             color,
//           };
//         });

//       const dismissedOrderIds =
//         JSON.parse(localStorage.getItem("dismissedOrderAlerts")) || [];
//       setOrderAlerts(
//         generatedOrderAlerts.filter(
//           (alert) => !dismissedOrderIds.includes(alert.id),
//         ),
//       );
//     } catch (error) {
//       console.error("Failed to fetch notifications", error);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 15000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleClearOrderAlerts = () => {
//     const currentOrderIds = orderAlerts.map((n) => n.id);
//     const previouslyDismissed =
//       JSON.parse(localStorage.getItem("dismissedOrderAlerts")) || [];
//     const newDismissed = [
//       ...new Set([...previouslyDismissed, ...currentOrderIds]),
//     ];

//     localStorage.setItem("dismissedOrderAlerts", JSON.stringify(newDismissed));
//     setOrderAlerts([]);
//   };

//   // --- Cart Calculation ---
//   const cart = useSelector((state) => state.cart);
//   const cartItems = cart?.cartItems || [];

//   const cartCount = cartItems.reduce((total, item) => {
//     if (item && typeof item === "object" && Object.keys(item).length > 0) {
//       const qty = Number(item.qty);
//       if (!isNaN(qty) && qty > 0) return total + qty;
//     }
//     return total;
//   }, 0);

//   // --- Profile Image Helper ---
//   const getProfileImage = () => {
//     if (
//       user?.profilePhoto &&
//       user.profilePhoto !== "none" &&
//       !user.profilePhoto.includes("sample-doctor.jpg")
//     ) {
//       if (user.profilePhoto.startsWith("http")) return user.profilePhoto;
//       let cleanPath = user.profilePhoto.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
//       return `http://localhost:5000${cleanPath}`;
//     }
//     return null;
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   // Dynamic Theme Classes for Layout Structure
//   const themeBg = isDarkMode ? "var(--bg-primary)" : "#f0f2f2";
//   const headerBg = isDarkMode ? "var(--bg-secondary)" : "#ffffff";
//   const headerBorder = isDarkMode ? "var(--border-color)" : "#D5D9D9";
//   const textMuted = isDarkMode ? "var(--text-muted)" : "#565959";

//   return (
//     <div
//       className="d-flex min-vh-100 transition-all"
//       style={{
//         backgroundColor: themeBg,
//         fontFamily: "'Inter', system-ui, sans-serif",
//       }}
//     >
//       <CustomerSidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         isMobile={isMobile}
//       />

//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         <header
//           className="px-4 py-3 flex-shrink-0 z-3 shadow-sm transition-all"
//           style={{
//             backgroundColor: headerBg,
//             borderBottom: `1px solid ${headerBorder}`,
//           }}
//         >
//           <div className="d-flex align-items-center justify-content-between">
//             {/* Page Title */}
//             <div>
//               <h4
//                 className="mb-0 fw-bold theme-text"
//                 style={{ fontSize: "1.25rem" }}
//               >
//                 Patient Portal
//               </h4>
//               <p className="small mb-0" style={{ color: textMuted }}>
//                 Manage your health, prescriptions, and orders.
//               </p>
//             </div>

//             {/* Right Side Icons */}
//             <div className="d-flex align-items-center gap-4">
//               {/* ✅ THEME TOGGLE BUTTON */}
//               <button
//                 className="btn btn-link p-0 border-0 shadow-none d-flex align-items-center transition-all hover-opacity"
//                 onClick={toggleTheme}
//                 title="Toggle Theme"
//                 style={{
//                   color: isDarkMode ? "var(--text-primary)" : "#0F1111",
//                 }}
//               >
//                 {isDarkMode ? (
//                   <Sun size={24} className="text-warning" />
//                 ) : (
//                   <Moon size={24} />
//                 )}
//               </button>

//               {/* CART ICON */}
//               <div
//                 className="position-relative d-flex align-items-center justify-content-center transition-all hover-opacity"
//                 style={{
//                   cursor: "pointer",
//                   color: isDarkMode ? "var(--text-primary)" : "#0F1111",
//                 }}
//                 onClick={() => navigate("/cart")}
//                 title="View Cart"
//               >
//                 <ShoppingCart size={24} />
//                 {cartCount > 0 && (
//                   <span
//                     className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
//                     style={{
//                       backgroundColor: "#B12704",
//                       color: "#fff",
//                       fontSize: "0.65rem",
//                       border: "2px solid #fff",
//                     }}
//                   >
//                     {cartCount}
//                   </span>
//                 )}
//               </div>

//               {/* 💬 MESSAGE DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity transition-all"
//                   title="Messages"
//                   style={{
//                     color: isDarkMode ? "var(--text-primary)" : "#0F1111",
//                   }}
//                 >
//                   <MessageSquare size={24} />
//                   {msgAlerts.length > 0 && (
//                     <span
//                       className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
//                       style={{
//                         backgroundColor: "#B12704",
//                         color: "#fff",
//                         fontSize: "0.65rem",
//                         border: "2px solid #fff",
//                       }}
//                     >
//                       {msgAlerts.length}
//                     </span>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-3"
//                   style={{ width: "320px" }}
//                 >
//                   <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-dark mb-0">Messages</span>
//                     <Badge bg="primary" className="rounded-pill">
//                       {msgAlerts.length} Unread
//                     </Badge>
//                   </div>
//                   <div style={{ maxHeight: "350px", overflowY: "auto" }}>
//                     {msgAlerts.length === 0 ? (
//                       <div className="p-4 text-center text-muted">
//                         <CheckCircle2
//                           size={32}
//                           className="mb-2 text-success opacity-50"
//                         />
//                         <p className="small mb-0 fw-medium">Inbox is clear!</p>
//                       </div>
//                     ) : (
//                       msgAlerts.map((n) => (
//                         <Dropdown.Item
//                           key={n.id}
//                           onClick={() => {
//                             if (n.title === "Support Reply") {
//                               navigate("/customer-dashboard", {
//                                 state: { scrollTo: "support-tickets" },
//                               });
//                             } else {
//                               navigate(n.link);
//                             }
//                           }}
//                           className="p-3 border-bottom text-wrap hover-bg-light transition-all"
//                         >
//                           <div className="d-flex gap-3 align-items-start">
//                             <div className={`mt-1 flex-shrink-0 ${n.color}`}>
//                               <n.icon size={18} />
//                             </div>
//                             <div>
//                               <div className="fw-bold text-dark mb-1 fs-6">
//                                 {n.title}
//                               </div>
//                               <div className="small text-muted lh-sm">
//                                 {n.message}
//                               </div>
//                             </div>
//                           </div>
//                         </Dropdown.Item>
//                       ))
//                     )}
//                   </div>
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* 🔔 ORDER NOTIFICATION DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity transition-all"
//                   title="Notifications"
//                   style={{
//                     color: isDarkMode ? "var(--text-primary)" : "#0F1111",
//                   }}
//                 >
//                   <Bell size={24} />
//                   {orderAlerts.length > 0 && (
//                     <span
//                       className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
//                       style={{
//                         backgroundColor: "#B12704",
//                         color: "#fff",
//                         fontSize: "0.65rem",
//                         border: "2px solid #fff",
//                       }}
//                     >
//                       {orderAlerts.length}
//                     </span>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-3"
//                   style={{ width: "320px" }}
//                 >
//                   <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-dark mb-0">
//                       System Alerts
//                     </span>
//                     <Badge bg="secondary" className="rounded-pill">
//                       {orderAlerts.length} New
//                     </Badge>
//                   </div>
//                   <div style={{ maxHeight: "350px", overflowY: "auto" }}>
//                     {orderAlerts.length === 0 ? (
//                       <div className="p-4 text-center text-muted">
//                         <CheckCircle2
//                           size={32}
//                           className="mb-2 text-success opacity-50"
//                         />
//                         <p className="small mb-0 fw-medium">
//                           No new updates right now.
//                         </p>
//                       </div>
//                     ) : (
//                       orderAlerts.map((n) => (
//                         <Dropdown.Item
//                           key={n.id}
//                           onClick={() => navigate(n.link)}
//                           className="p-3 border-bottom text-wrap hover-bg-light transition-all"
//                         >
//                           <div className="d-flex gap-3 align-items-start">
//                             <div className={`mt-1 flex-shrink-0 ${n.color}`}>
//                               <n.icon size={18} />
//                             </div>
//                             <div>
//                               <div className="fw-bold text-dark mb-1 fs-6">
//                                 {n.title}
//                               </div>
//                               <div className="small text-muted lh-sm">
//                                 {n.message}
//                               </div>
//                             </div>
//                           </div>
//                         </Dropdown.Item>
//                       ))
//                     )}
//                   </div>
//                   {orderAlerts.length > 0 && (
//                     <div className="p-2 text-center bg-light border-top">
//                       <button
//                         className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
//                         onClick={handleClearOrderAlerts}
//                       >
//                         Dismiss Order Alerts
//                       </button>
//                     </div>
//                   )}
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* USER PROFILE DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="d-flex align-items-center gap-3 border-start ps-4 text-decoration-none hide-caret hover-opacity transition-all"
//                   style={{
//                     borderColor: `${headerBorder} !important`,
//                     outline: "none",
//                     boxShadow: "none",
//                   }}
//                 >
//                   <div
//                     className="text-end d-none d-md-block"
//                     style={{ lineHeight: "1.2" }}
//                   >
//                     <div className="fw-bold fs-6 theme-text">
//                       {user?.name || "Customer"}
//                     </div>
//                     <div
//                       className="fw-medium text-uppercase mt-1"
//                       style={{
//                         fontSize: "0.7rem",
//                         color: "#007185",
//                         letterSpacing: "0.5px",
//                       }}
//                     >
//                       My Account
//                     </div>
//                   </div>
//                   {getProfileImage() ? (
//                     <img
//                       src={getProfileImage()}
//                       alt="Profile"
//                       className="rounded-circle object-fit-cover border shadow-sm"
//                       style={{
//                         width: "36px",
//                         height: "36px",
//                         borderColor: headerBorder,
//                       }}
//                     />
//                   ) : (
//                     <div className="d-flex align-items-center justify-content-center bg-light rounded-circle p-1">
//                       <UserCircle
//                         size={32}
//                         style={{ color: "#565959", strokeWidth: "1.5" }}
//                       />
//                     </div>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 mt-3"
//                   style={{ minWidth: "200px" }}
//                 >
//                   <div className="px-3 py-2 border-bottom mb-2 bg-light">
//                     <p className="small text-muted mb-0">Signed in as</p>
//                     <p className="fw-bold text-dark mb-0 text-truncate">
//                       {user?.email || "customer@example.com"}
//                     </p>
//                   </div>
//                   <Dropdown.Item
//                     onClick={() => navigate("/profile")}
//                     className="py-2 d-flex align-items-center gap-2 fw-medium text-dark hover-bg-light"
//                   >
//                     <UserCircle size={16} className="text-muted" /> My Profile
//                   </Dropdown.Item>
//                   <Dropdown.Divider />
//                   <Dropdown.Item
//                     onClick={handleLogout}
//                     className="py-2 d-flex align-items-center gap-2 fw-bold text-danger hover-bg-light"
//                   >
//                     <LogOut size={16} /> Sign Out
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//           </div>
//         </header>

//         {/* --- MAIN CONTENT AREA --- */}
//         <main
//           className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar transition-all"
//           style={{ backgroundColor: themeBg }}
//         >
//           <Breadcrumbs />
//           <div className="mt-2">
//             <Outlet />
//           </div>
//         </main>
//       </div>

//       <style>{`
//         .hide-caret::after { display: none !important; }
//         .hover-bg-light:hover { background-color: #f8fafc !important; }
//         .transition-all { transition: background-color 0.3s ease, color 0.3s ease, opacity 0.2s ease-in-out; }
//         .hover-opacity:hover { opacity: 0.7; }

//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

//         @keyframes pulse-badge {
//           0% { transform: translate(-50%, -50%) scale(1); }
//           50% { transform: translate(-50%, -50%) scale(1.1); }
//           100% { transform: translate(-50%, -50%) scale(1); }
//         }
//         .animate-pulse { animation: pulse-badge 2s infinite; }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerLayout;

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Dropdown, Badge } from "react-bootstrap";
import CustomerSidebar from "../components/CustomerSidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  Bell,
  UserCircle,
  ShoppingCart,
  LogOut,
  Package,
  MessageSquare,
  Truck,
  CheckCircle2,
  Sun,
  Moon,
  Globe, // ✅ Added Globe icon for language
} from "lucide-react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

const CustomerLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { isDarkMode, toggleTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Language State
  const [isNepali, setIsNepali] = useState(false);

  // --- Separate Notification States ---
  const [orderAlerts, setOrderAlerts] = useState([]);
  const [msgAlerts, setMsgAlerts] = useState([]);

  // --- Handle Screen Resize ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Global Language Toggle Function
  const toggleLanguage = () => {
    const newLang = isNepali ? "en" : "ne"; // Switch between English and Nepali
    const select = document.querySelector(".goog-te-combo");

    if (select) {
      select.value = newLang;
      select.dispatchEvent(new Event("change"));
      setIsNepali(!isNepali);
    } else {
      console.warn("Google Translate script not loaded yet.");
    }
  };

  // --- Fetch Notifications (Orders + Messages) ---
  const fetchNotifications = async () => {
    try {
      const [msgRes, orderRes] = await Promise.all([
        api.get("/messages/my").catch(() => ({ data: [] })),
        api.get("/orders/myorders").catch(() => ({ data: [] })),
      ]);

      const messages = Array.isArray(msgRes.data)
        ? msgRes.data
        : msgRes.data?.messages || [];
      const orders = Array.isArray(orderRes.data)
        ? orderRes.data
        : orderRes.data?.orders || [];

      // 1. MESSAGE ALERTS
      const generatedMsgAlerts = [];

      const unreadSupportMsgs = messages.filter(
        (m) => m.adminReply && m.isReplyRead === false,
      );
      if (unreadSupportMsgs.length > 0) {
        generatedMsgAlerts.push({
          id: `support-msg-${unreadSupportMsgs.map((m) => m._id).join("-")}`,
          title: "Support Reply",
          message: `You have ${unreadSupportMsgs.length} unread message(s) from support.`,
          link: "/customer-dashboard",
          icon: MessageSquare,
          color: "text-info",
        });
      }

      const unreadDoctorMsgs = messages.filter((m) => {
        const isChatMsg = Boolean(m.appointment);
        const isUnread = m.isRead === false;
        const isFromSomeoneElse = String(m.sender) !== String(user?._id);
        return isChatMsg && isUnread && isFromSomeoneElse;
      });

      if (unreadDoctorMsgs.length > 0) {
        const groupedDoctorMsgs = {};
        unreadDoctorMsgs.forEach((m) => {
          if (!groupedDoctorMsgs[m.appointment])
            groupedDoctorMsgs[m.appointment] = 0;
          groupedDoctorMsgs[m.appointment]++;
        });

        Object.keys(groupedDoctorMsgs).forEach((apptId) => {
          generatedMsgAlerts.push({
            id: `doc-msg-${apptId}`,
            title: "New Message from Doctor",
            message: `You have ${groupedDoctorMsgs[apptId]} unread message(s) in an active chat.`,
            link: "/appointments",
            icon: MessageSquare,
            color: "text-primary",
          });
        });
      }

      setMsgAlerts(generatedMsgAlerts);

      // 2. ORDER ALERTS
      const activeOrders = orders.filter((o) =>
        ["Processing", "Shipped", "Delivered"].includes(o.orderStatus),
      );

      const generatedOrderAlerts = activeOrders
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 3)
        .map((order) => {
          let icon = Package;
          let color = "text-warning";
          let title = "Order Processing";
          let message = `Your order #${order._id.substring(order._id.length - 6).toUpperCase()} is being prepared.`;

          if (order.orderStatus === "Shipped") {
            icon = Truck;
            color = "text-primary";
            title = "Order Shipped!";
            message = `Your order is on the way.`;
          } else if (order.orderStatus === "Delivered") {
            icon = CheckCircle2;
            color = "text-success";
            title = "Order Delivered";
            message = `Your order has been successfully delivered.`;
          }

          return {
            id: `order-${order._id}-${order.orderStatus}`,
            title,
            message,
            link: `/order/${order._id}`,
            icon,
            color,
          };
        });

      const dismissedOrderIds =
        JSON.parse(localStorage.getItem("dismissedOrderAlerts")) || [];
      setOrderAlerts(
        generatedOrderAlerts.filter(
          (alert) => !dismissedOrderIds.includes(alert.id),
        ),
      );
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleClearOrderAlerts = () => {
    const currentOrderIds = orderAlerts.map((n) => n.id);
    const previouslyDismissed =
      JSON.parse(localStorage.getItem("dismissedOrderAlerts")) || [];
    const newDismissed = [
      ...new Set([...previouslyDismissed, ...currentOrderIds]),
    ];

    localStorage.setItem("dismissedOrderAlerts", JSON.stringify(newDismissed));
    setOrderAlerts([]);
  };

  // --- Cart Calculation ---
  const cart = useSelector((state) => state.cart);
  const cartItems = cart?.cartItems || [];

  const cartCount = cartItems.reduce((total, item) => {
    if (item && typeof item === "object" && Object.keys(item).length > 0) {
      const qty = Number(item.qty);
      if (!isNaN(qty) && qty > 0) return total + qty;
    }
    return total;
  }, 0);

  // --- Profile Image Helper ---
  const getProfileImage = () => {
    if (
      user?.profilePhoto &&
      user.profilePhoto !== "none" &&
      !user.profilePhoto.includes("sample-doctor.jpg")
    ) {
      if (user.profilePhoto.startsWith("http")) return user.profilePhoto;
      let cleanPath = user.profilePhoto.replace(/\\/g, "/");
      if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
      return `http://localhost:5000${cleanPath}`;
    }
    return null;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Dynamic Theme Classes for Layout Structure
  const themeBg = isDarkMode ? "var(--bg-primary)" : "#f0f2f2";
  const headerBg = isDarkMode ? "var(--bg-secondary)" : "#ffffff";
  const headerBorder = isDarkMode ? "var(--border-color)" : "#D5D9D9";
  const textMuted = isDarkMode ? "var(--text-muted)" : "#565959";

  return (
    <div
      className="d-flex min-vh-100 transition-all"
      style={{
        backgroundColor: themeBg,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <CustomerSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />

      <div
        className="flex-grow-1 d-flex flex-column overflow-hidden"
        style={{ height: "100vh" }}
      >
        <header
          className="px-4 py-3 flex-shrink-0 z-3 shadow-sm transition-all"
          style={{
            backgroundColor: headerBg,
            borderBottom: `1px solid ${headerBorder}`,
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            {/* Page Title */}
            <div>
              <h4
                className="mb-0 fw-bold theme-text"
                style={{ fontSize: "1.25rem" }}
              >
                Patient Portal
              </h4>
              <p className="small mb-0" style={{ color: textMuted }}>
                Manage your health, prescriptions, and orders.
              </p>
            </div>

            {/* Right Side Icons */}
            <div className="d-flex align-items-center gap-4">
              {/* ✅ LANGUAGE TOGGLE BUTTON */}
              <button
                className="btn btn-link p-0 border-0 shadow-none d-flex align-items-center gap-1 transition-all hover-opacity fw-bold"
                onClick={toggleLanguage}
                title="Translate Page"
                style={{
                  color: isDarkMode ? "var(--text-primary)" : "#0F1111",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                <Globe size={20} />
                <span className="d-none d-sm-inline">
                  {isNepali ? "EN" : "नेपाली"}
                </span>
              </button>

              {/* THEME TOGGLE BUTTON */}
              <button
                className="btn btn-link p-0 border-0 shadow-none d-flex align-items-center transition-all hover-opacity"
                onClick={toggleTheme}
                title="Toggle Theme"
                style={{
                  color: isDarkMode ? "var(--text-primary)" : "#0F1111",
                }}
              >
                {isDarkMode ? (
                  <Sun size={24} className="text-warning" />
                ) : (
                  <Moon size={24} />
                )}
              </button>

              {/* CART ICON */}
              <div
                className="position-relative d-flex align-items-center justify-content-center transition-all hover-opacity"
                style={{
                  cursor: "pointer",
                  color: isDarkMode ? "var(--text-primary)" : "#0F1111",
                }}
                onClick={() => navigate("/cart")}
                title="View Cart"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                    style={{
                      backgroundColor: "#B12704",
                      color: "#fff",
                      fontSize: "0.65rem",
                      border: "2px solid #fff",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>

              {/* 💬 MESSAGE DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity transition-all"
                  title="Messages"
                  style={{
                    color: isDarkMode ? "var(--text-primary)" : "#0F1111",
                  }}
                >
                  <MessageSquare size={24} />
                  {msgAlerts.length > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
                      style={{
                        backgroundColor: "#B12704",
                        color: "#fff",
                        fontSize: "0.65rem",
                        border: "2px solid #fff",
                      }}
                    >
                      {msgAlerts.length}
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-3"
                  style={{ width: "320px" }}
                >
                  <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark mb-0">Messages</span>
                    <Badge bg="primary" className="rounded-pill">
                      {msgAlerts.length} Unread
                    </Badge>
                  </div>
                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {msgAlerts.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <CheckCircle2
                          size={32}
                          className="mb-2 text-success opacity-50"
                        />
                        <p className="small mb-0 fw-medium">Inbox is clear!</p>
                      </div>
                    ) : (
                      msgAlerts.map((n) => (
                        <Dropdown.Item
                          key={n.id}
                          onClick={() => {
                            if (n.title === "Support Reply") {
                              navigate("/customer-dashboard", {
                                state: { scrollTo: "support-tickets" },
                              });
                            } else {
                              navigate(n.link);
                            }
                          }}
                          className="p-3 border-bottom text-wrap hover-bg-light transition-all"
                        >
                          <div className="d-flex gap-3 align-items-start">
                            <div className={`mt-1 flex-shrink-0 ${n.color}`}>
                              <n.icon size={18} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark mb-1 fs-6">
                                {n.title}
                              </div>
                              <div className="small text-muted lh-sm">
                                {n.message}
                              </div>
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))
                    )}
                  </div>
                </Dropdown.Menu>
              </Dropdown>

              {/* 🔔 ORDER NOTIFICATION DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="p-0 position-relative border-0 shadow-none hide-caret d-flex align-items-center hover-opacity transition-all"
                  title="Notifications"
                  style={{
                    color: isDarkMode ? "var(--text-primary)" : "#0F1111",
                  }}
                >
                  <Bell size={24} />
                  {orderAlerts.length > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
                      style={{
                        backgroundColor: "#B12704",
                        color: "#fff",
                        fontSize: "0.65rem",
                        border: "2px solid #fff",
                      }}
                    >
                      {orderAlerts.length}
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-3"
                  style={{ width: "320px" }}
                >
                  <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark mb-0">
                      System Alerts
                    </span>
                    <Badge bg="secondary" className="rounded-pill">
                      {orderAlerts.length} New
                    </Badge>
                  </div>
                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {orderAlerts.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <CheckCircle2
                          size={32}
                          className="mb-2 text-success opacity-50"
                        />
                        <p className="small mb-0 fw-medium">
                          No new updates right now.
                        </p>
                      </div>
                    ) : (
                      orderAlerts.map((n) => (
                        <Dropdown.Item
                          key={n.id}
                          onClick={() => navigate(n.link)}
                          className="p-3 border-bottom text-wrap hover-bg-light transition-all"
                        >
                          <div className="d-flex gap-3 align-items-start">
                            <div className={`mt-1 flex-shrink-0 ${n.color}`}>
                              <n.icon size={18} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark mb-1 fs-6">
                                {n.title}
                              </div>
                              <div className="small text-muted lh-sm">
                                {n.message}
                              </div>
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))
                    )}
                  </div>
                  {orderAlerts.length > 0 && (
                    <div className="p-2 text-center bg-light border-top">
                      <button
                        className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
                        onClick={handleClearOrderAlerts}
                      >
                        Dismiss Order Alerts
                      </button>
                    </div>
                  )}
                </Dropdown.Menu>
              </Dropdown>

              {/* USER PROFILE DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="d-flex align-items-center gap-3 border-start ps-4 text-decoration-none hide-caret hover-opacity transition-all"
                  style={{
                    borderColor: `${headerBorder} !important`,
                    outline: "none",
                    boxShadow: "none",
                  }}
                >
                  <div
                    className="text-end d-none d-md-block"
                    style={{ lineHeight: "1.2" }}
                  >
                    <div className="fw-bold fs-6 theme-text">
                      {user?.name || "Customer"}
                    </div>
                    <div
                      className="fw-medium text-uppercase mt-1"
                      style={{
                        fontSize: "0.7rem",
                        color: "#007185",
                        letterSpacing: "0.5px",
                      }}
                    >
                      My Account
                    </div>
                  </div>
                  {getProfileImage() ? (
                    <img
                      src={getProfileImage()}
                      alt="Profile"
                      className="rounded-circle object-fit-cover border shadow-sm"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderColor: headerBorder,
                      }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center bg-light rounded-circle p-1">
                      <UserCircle
                        size={32}
                        style={{ color: "#565959", strokeWidth: "1.5" }}
                      />
                    </div>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 mt-3"
                  style={{ minWidth: "200px" }}
                >
                  <div className="px-3 py-2 border-bottom mb-2 bg-light">
                    <p className="small text-muted mb-0">Signed in as</p>
                    <p className="fw-bold text-dark mb-0 text-truncate">
                      {user?.email || "customer@example.com"}
                    </p>
                  </div>
                  <Dropdown.Item
                    onClick={() => navigate("/profile")}
                    className="py-2 d-flex align-items-center gap-2 fw-medium text-dark hover-bg-light"
                  >
                    <UserCircle size={16} className="text-muted" /> My Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="py-2 d-flex align-items-center gap-2 fw-bold text-danger hover-bg-light"
                  >
                    <LogOut size={16} /> Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <main
          className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar transition-all"
          style={{ backgroundColor: themeBg }}
        >
          <Breadcrumbs />
          <div className="mt-2">
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        .hide-caret::after { display: none !important; }
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .transition-all { transition: background-color 0.3s ease, color 0.3s ease, opacity 0.2s ease-in-out; }
        .hover-opacity:hover { opacity: 0.7; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        @keyframes pulse-badge {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        .animate-pulse { animation: pulse-badge 2s infinite; }
      `}</style>
    </div>
  );
};

export default CustomerLayout;
