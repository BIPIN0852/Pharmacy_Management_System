// // src/components/AppFooter.jsx
// import React from "react";
// import Lottie from "lottie-react";
// import footerAnimation from "../assets/health.json";

// const AppFooter = ({ context }) => {
//   const year = new Date().getFullYear();

//   return (
//     <footer
//       className="border-top px-4 py-4 small text-muted"
//       style={{
//         background: "linear-gradient(90deg, #0f172a 0%, #1d4ed8 100%)",
//         color: "#e5e7eb",
//       }}
//     >
//       <div className="container-fluid">
//         <div className="row gy-3 align-items-start">
//           {/* Brand / summary */}
//           <div className="col-md-4">
//             <div className="fw-semibold text-white fs-6 mb-1">
//               Pharmacy Management System
//             </div>
//             <p className="mb-2">
//               A secure digital platform for managing prescriptions, inventory,
//               orders and appointments.
//             </p>
//             {context && <p className="mb-0 text-secondary">{context}</p>}
//           </div>

//           {/* Navigation links */}
//           <div className="col-md-4 d-flex flex-wrap gap-4">
//             <div>
//               <div className="fw-semibold text-white mb-2">Company</div>
//               <ul className="list-unstyled mb-0">
//                 <li>
//                   <a
//                     href="/about"
//                     className="text-gray-200 text-decoration-none"
//                   >
//                     About us
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="/contact"
//                     className="text-gray-200 text-decoration-none"
//                   >
//                     Contact us
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/faq" className="text-gray-200 text-decoration-none">
//                     FAQs
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <div className="fw-semibold text-white mb-2">Resources</div>
//               <ul className="list-unstyled mb-0">
//                 <li>
//                   <a
//                     href="/support"
//                     className="text-gray-200 text-decoration-none"
//                   >
//                     Support
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="/status"
//                     className="text-gray-200 text-decoration-none"
//                   >
//                     Privacy &amp; Terms
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Animation + contact info */}
//           <div className="col-md-4 d-flex justify-content-end align-items-center gap-3">
//             <div style={{ width: 80, height: 80 }}>
//               <Lottie
//                 animationData={footerAnimation}
//                 loop
//                 autoplay
//                 style={{ width: "100%", height: "100%" }}
//               />
//             </div>
//             <div className="text-end small">
//               <div className="fw-semibold text-white mb-1">Contact</div>
//               <div>Email: support@smartpharmacy.local</div>
//               <div>Phone: +977-9800000000</div>
//               <div className="mt-1 text-secondary">
//                 © {year} All rights reserved.
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default AppFooter;

import React from "react";
import Lottie from "lottie-react";
// Ensure this file exists in src/assets/health.json
// If you don't have it yet, the code below handles the crash gracefully.
import footerAnimation from "../assets/health.json";

const AppFooter = ({ context }) => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-top py-5 text-white"
      style={{
        // Modern Blue Gradient matching the Medical Theme
        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <div className="container">
        <div className="row gy-4">
          {/* 1. Brand & Description */}
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold mb-3 d-flex align-items-center">
              <i className="bi bi-capsule-pill me-2"></i> Smart Pharmacy
            </h5>
            <p className="text-white-50 small mb-3">
              A secure digital platform for managing prescriptions, inventory,
              orders, and appointments efficiently.
            </p>
            {context && (
              <span className="badge bg-white text-primary rounded-pill px-3 py-2 shadow-sm">
                <i className="bi bi-person-badge me-1"></i> {context} Portal
              </span>
            )}
          </div>

          {/* 2. Navigation Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold mb-3">Company</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a
                  href="/about"
                  className="text-white-50 text-decoration-none hover-white"
                >
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/contact"
                  className="text-white-50 text-decoration-none hover-white"
                >
                  Contact
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/faq"
                  className="text-white-50 text-decoration-none hover-white"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold mb-3">Legal</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a
                  href="/privacy"
                  className="text-white-50 text-decoration-none hover-white"
                >
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/terms"
                  className="text-white-50 text-decoration-none hover-white"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Contact & Animation */}
          <div className="col-lg-4 col-md-12 d-flex flex-column align-items-md-start align-items-lg-end">
            <div className="d-flex align-items-center mb-3 bg-white bg-opacity-10 p-3 rounded-3">
              {/* Animation Icon */}
              <div
                style={{ width: 50, height: 50 }}
                className="me-3 bg-white rounded-circle p-1 shadow-sm"
              >
                {/* Check if animation file exists, else show icon */}
                {footerAnimation ? (
                  <Lottie
                    animationData={footerAnimation}
                    loop
                    autoplay
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <i className="bi bi-heart-pulse-fill text-danger fs-3 d-flex justify-content-center align-items-center h-100"></i>
                )}
              </div>

              {/* Contact Text */}
              <div>
                <h6 className="fw-bold mb-1">Need Support?</h6>
                <a
                  href="mailto:support@smartpharmacy.local"
                  className="text-white text-decoration-none small d-block"
                >
                  support@smartpharmacy.local
                </a>
                <a
                  href="tel:+9779800000000"
                  className="text-white text-decoration-none small"
                >
                  +977-9800000000
                </a>
              </div>
            </div>

            <div className="small text-white-50 mt-auto text-lg-end">
              &copy; {year} Pharmacy Management System. <br /> All rights
              reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
