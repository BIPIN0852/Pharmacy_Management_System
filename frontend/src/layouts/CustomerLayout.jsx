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

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import CustomerSidebar from "../components/CustomerSidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import { Bell, UserCircle, ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const CustomerLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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

  // --- Fetch Unread Notifications (Background Sync) ---
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/messages/my");
        const unread = data.filter(
          (m) => m.adminReply && !m.isReplyRead,
        ).length;
        setUnreadCount(unread);
      } catch (error) {
        // Silent catch for background sync
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);

    return () => clearInterval(interval);
  }, []);

  // --- REAL-WORLD CART CALCULATION ---
  const cart = useSelector((state) => state.cart);
  const cartItems = cart?.cartItems || [];

  // Safely sum up the quantity of all valid items in the cart.
  // This ignores empty "ghost" objects that get left behind when an item is deleted.
  const cartCount = cartItems.reduce((total, item) => {
    if (item && typeof item === "object" && Object.keys(item).length > 0) {
      const qty = Number(item.qty);
      if (!isNaN(qty) && qty > 0) {
        return total + qty;
      }
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

  return (
    <div
      className="d-flex min-vh-100"
      style={{
        backgroundColor: "#f0f2f2",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* 1. Sidebar */}
      <CustomerSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />

      {/* 2. Main Wrapper */}
      <div
        className="flex-grow-1 d-flex flex-column overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* --- TOP HEADER (Amazon Enterprise Style) --- */}
        <header
          className="bg-white px-4 py-3 flex-shrink-0 z-3"
          style={{ borderBottom: "1px solid #D5D9D9" }}
        >
          <div className="d-flex align-items-center justify-content-between">
            {/* Page Title */}
            <div>
              <h4
                className="mb-0 fw-bold"
                style={{ color: "#0F1111", fontSize: "1.25rem" }}
              >
                Patient Portal
              </h4>
              <p className="small mb-0" style={{ color: "#565959" }}>
                Manage your health, prescriptions, and orders.
              </p>
            </div>

            {/* Right Side Icons */}
            <div className="d-flex align-items-center gap-4">
              {/* ✅ REAL WORLD CART ICON */}
              <div
                className="position-relative d-flex align-items-center justify-content-center transition-all hover-opacity"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/cart")}
                title="View Cart"
              >
                <ShoppingCart size={24} style={{ color: "#0F1111" }} />

                {/* Shows the red badge ONLY if there are 1 or more items */}
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

              {/* NOTIFICATION BELL */}
              <div
                className="position-relative d-flex align-items-center justify-content-center transition-all hover-opacity"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate("/customer-dashboard", {
                    state: { scrollTo: "support-tickets" },
                  })
                }
                title={
                  unreadCount > 0
                    ? `You have ${unreadCount} unread replies`
                    : "No new notifications"
                }
              >
                <Bell size={24} style={{ color: "#0F1111" }} />
                {unreadCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
                    style={{
                      backgroundColor: "#B12704",
                      color: "#fff",
                      fontSize: "0.65rem",
                      border: "2px solid #fff",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>

              {/* Profile Info */}
              <div
                className="d-flex align-items-center gap-3 border-start ps-4 transition-all hover-opacity"
                onClick={() => navigate("/profile")}
                title="View Profile"
                style={{ cursor: "pointer", borderColor: "#D5D9D9 !important" }}
              >
                <div
                  className="text-end d-none d-md-block"
                  style={{ lineHeight: "1.2" }}
                >
                  <div className="fw-bold fs-6" style={{ color: "#0F1111" }}>
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
                    className="rounded-circle object-fit-cover border"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderColor: "#D5D9D9",
                    }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center">
                    <UserCircle
                      size={32}
                      style={{ color: "#565959", strokeWidth: "1.5" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <main
          className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar"
          style={{ backgroundColor: "#f0f2f2" }}
        >
          {/* Breadcrumbs */}
          <Breadcrumbs />

          <div className="mt-2">
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        .transition-all { transition: opacity 0.2s ease-in-out; }
        .hover-opacity:hover { opacity: 0.7; }
        
        /* Custom Scrollbar for Main Content */
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
