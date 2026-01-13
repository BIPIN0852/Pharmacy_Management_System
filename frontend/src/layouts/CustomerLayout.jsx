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

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import CustomerSidebar from "../components/CustomerSidebar";
import Breadcrumbs from "../components/Breadcrumbs"; // ✅ IMPORT BREADCRUMBS
import { Bell, UserCircle, ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";

const CustomerLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // --- Handle Screen Resize ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Get Cart Count from Redux ---
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* 1. Sidebar (Pass state props for toggle functionality) */}
      <CustomerSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />

      {/* 2. Main Wrapper (Flex Column) */}
      <div
        className="flex-grow-1 d-flex flex-column overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* --- TOP HEADER --- */}
        <header className="bg-white shadow-sm border-bottom px-4 py-3 flex-shrink-0">
          <div className="d-flex align-items-center justify-content-between">
            {/* Page Title */}
            <div>
              <h4 className="mb-0 fw-bold text-dark">Patient Portal</h4>
              <small className="text-muted">
                Manage your health and orders
              </small>
            </div>

            {/* Right Side Icons */}
            <div className="d-flex align-items-center gap-3">
              {/* ✅ CART ICON WITH BADGE */}
              <button
                className="btn btn-light rounded-circle p-2 border position-relative"
                onClick={() => navigate("/cart")}
                title="View Cart"
              >
                <ShoppingCart size={20} className="text-dark" />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-light">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Notifications */}
              <button className="btn btn-light rounded-circle p-2 border position-relative">
                <Bell size={20} className="text-muted" />
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
              </button>

              {/* Profile Info */}
              <div
                className="d-flex align-items-center gap-2 border-start ps-3 cursor-pointer"
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="text-end d-none d-md-block"
                  style={{ lineHeight: "1.2" }}
                >
                  <div className="fw-bold small">My Account</div>
                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                    Customer
                  </small>
                </div>
                <UserCircle size={36} className="text-primary opacity-75" />
              </div>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-grow-1 p-4 overflow-auto bg-light">
          {/* ✅ ADD BREADCRUMBS HERE */}
          <Breadcrumbs />

          {/* This renders the specific page (Dashboard, Medicines, Orders etc.) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
