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

// import React from "react";
// import Lottie from "lottie-react";
// // Ensure this file exists in src/assets/health.json
// // If you don't have it yet, the code below handles the crash gracefully.
// import footerAnimation from "../assets/health.json";

// const AppFooter = ({ context }) => {
//   const year = new Date().getFullYear();

//   return (
//     <footer
//       className="border-top py-5 text-white"
//       style={{
//         // Modern Blue Gradient matching the Medical Theme
//         background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
//         boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
//       }}
//     >
//       <div className="container">
//         <div className="row gy-4">
//           {/* 1. Brand & Description */}
//           <div className="col-lg-4 col-md-6">
//             <h5 className="fw-bold mb-3 d-flex align-items-center">
//               <i className="bi bi-capsule-pill me-2"></i> Smart Pharmacy
//             </h5>
//             <p className="text-white-50 small mb-3">
//               A secure digital platform for managing prescriptions, inventory,
//               orders, and appointments efficiently.
//             </p>
//             {context && (
//               <span className="badge bg-white text-primary rounded-pill px-3 py-2 shadow-sm">
//                 <i className="bi bi-person-badge me-1"></i> {context} Portal
//               </span>
//             )}
//           </div>

//           {/* 2. Navigation Links */}
//           <div className="col-lg-2 col-md-3 col-6">
//             <h6 className="fw-bold mb-3">Company</h6>
//             <ul className="list-unstyled small">
//               <li className="mb-2">
//                 <a
//                   href="/about"
//                   className="text-white-50 text-decoration-none hover-white"
//                 >
//                   About Us
//                 </a>
//               </li>
//               <li className="mb-2">
//                 <a
//                   href="/contact"
//                   className="text-white-50 text-decoration-none hover-white"
//                 >
//                   Contact
//                 </a>
//               </li>
//               <li className="mb-2">
//                 <a
//                   href="/faq"
//                   className="text-white-50 text-decoration-none hover-white"
//                 >
//                   FAQs
//                 </a>
//               </li>
//             </ul>
//           </div>

//           <div className="col-lg-2 col-md-3 col-6">
//             <h6 className="fw-bold mb-3">Legal</h6>
//             <ul className="list-unstyled small">
//               <li className="mb-2">
//                 <a
//                   href="/privacy"
//                   className="text-white-50 text-decoration-none hover-white"
//                 >
//                   Privacy Policy
//                 </a>
//               </li>
//               <li className="mb-2">
//                 <a
//                   href="/terms"
//                   className="text-white-50 text-decoration-none hover-white"
//                 >
//                   Terms of Service
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* 3. Contact & Animation */}
//           <div className="col-lg-4 col-md-12 d-flex flex-column align-items-md-start align-items-lg-end">
//             <div className="d-flex align-items-center mb-3 bg-white bg-opacity-10 p-3 rounded-3">
//               {/* Animation Icon */}
//               <div
//                 style={{ width: 50, height: 50 }}
//                 className="me-3 bg-white rounded-circle p-1 shadow-sm"
//               >
//                 {/* Check if animation file exists, else show icon */}
//                 {footerAnimation ? (
//                   <Lottie
//                     animationData={footerAnimation}
//                     loop
//                     autoplay
//                     style={{ width: "100%", height: "100%" }}
//                   />
//                 ) : (
//                   <i className="bi bi-heart-pulse-fill text-danger fs-3 d-flex justify-content-center align-items-center h-100"></i>
//                 )}
//               </div>

//               {/* Contact Text */}
//               <div>
//                 <h6 className="fw-bold mb-1">Need Support?</h6>
//                 <a
//                   href="mailto:support@smartpharmacy.local"
//                   className="text-white text-decoration-none small d-block"
//                 >
//                   support@smartpharmacy.local
//                 </a>
//                 <a
//                   href="tel:+9779800000000"
//                   className="text-white text-decoration-none small"
//                 >
//                   +977-9800000000
//                 </a>
//               </div>
//             </div>

//             <div className="small text-white-50 mt-auto text-lg-end">
//               &copy; {year} Pharmacy Management System. <br /> All rights
//               reserved.
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default AppFooter;

// import React from "react";
// import Lottie from "lottie-react";
// // Ensure this file exists in src/assets/health.json
// import footerAnimation from "../assets/health.json";

// const AppFooter = ({ context }) => {
//   const year = new Date().getFullYear();

//   return (
//     <footer
//       className="border-top py-3 text-white" // Reduced padding from py-5 to py-3
//       style={{
//         background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
//         boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
//       }}
//     >
//       <div className="container">
//         <div className="row gy-2 align-items-center">
//           {" "}
//           {/* Reduced gutter */}
//           {/* 1. Brand & Description */}
//           <div className="col-lg-4 col-md-6">
//             <h6 className="fw-bold mb-1 d-flex align-items-center">
//               <i className="bi bi-capsule-pill me-2"></i> Smart Pharmacy
//             </h6>
//             <p
//               className="text-white-50 small mb-2"
//               style={{ fontSize: "0.8rem", lineHeight: "1.2" }}
//             >
//               Secure digital platform for prescriptions, inventory, and orders.
//             </p>
//             {context && (
//               <span
//                 className="badge bg-white text-primary rounded-pill px-2 py-1 shadow-sm"
//                 style={{ fontSize: "0.7rem" }}
//               >
//                 <i className="bi bi-person-badge me-1"></i> {context} Portal
//               </span>
//             )}
//           </div>
//           {/* 2. Navigation Links (Combined into one compact column for space) */}
//           <div className="col-lg-4 col-md-6 d-flex justify-content-lg-center justify-content-start gap-4">
//             <div>
//               <h6 className="fw-bold mb-1" style={{ fontSize: "0.9rem" }}>
//                 Company
//               </h6>
//               <ul
//                 className="list-unstyled small mb-0"
//                 style={{ fontSize: "0.8rem" }}
//               >
//                 <li>
//                   <a
//                     href="/about"
//                     className="text-white-50 text-decoration-none hover-white"
//                   >
//                     About
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="/contact"
//                     className="text-white-50 text-decoration-none hover-white"
//                   >
//                     Contact
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h6 className="fw-bold mb-1" style={{ fontSize: "0.9rem" }}>
//                 Legal
//               </h6>
//               <ul
//                 className="list-unstyled small mb-0"
//                 style={{ fontSize: "0.8rem" }}
//               >
//                 <li>
//                   <a
//                     href="/privacy"
//                     className="text-white-50 text-decoration-none hover-white"
//                   >
//                     Privacy
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="/terms"
//                     className="text-white-50 text-decoration-none hover-white"
//                   >
//                     Terms
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           {/* 3. Contact & Copyright */}
//           <div className="col-lg-4 col-md-12 d-flex flex-row align-items-center justify-content-lg-end justify-content-start mt-3 mt-lg-0">
//             <div className="d-flex align-items-center bg-white bg-opacity-10 p-2 rounded-3 me-3">
//               {/* Animation Icon (Smaller) */}
//               <div
//                 style={{ width: 35, height: 35 }}
//                 className="me-2 bg-white rounded-circle p-1 shadow-sm d-flex align-items-center justify-content-center"
//               >
//                 {footerAnimation ? (
//                   <Lottie
//                     animationData={footerAnimation}
//                     loop
//                     autoplay
//                     style={{ width: "100%", height: "100%" }}
//                   />
//                 ) : (
//                   <i className="bi bi-heart-pulse-fill text-danger fs-6"></i>
//                 )}
//               </div>

//               <div>
//                 <a
//                   href="tel:+9779800000000"
//                   className="text-white text-decoration-none fw-bold small d-block"
//                   style={{ fontSize: "0.85rem" }}
//                 >
//                   +977-9800000000
//                 </a>
//               </div>
//             </div>

//             <div
//               className="small text-white-50 text-end"
//               style={{ fontSize: "0.75rem", lineHeight: "1.1" }}
//             >
//               &copy; {year} PMS.
//               <br />
//               All rights reserved.
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default AppFooter;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Pill,
//   ShieldCheck,
//   CreditCard,
//   BadgeCheck,
//   PhoneCall,
//   Clock,
//   MessageSquare,
//   X,
//   Send,
//   CheckCircle2,
//   Loader2,
// } from "lucide-react";
// import api from "../services/api"; // Make sure this path is correct for your axios instance

// const AppFooter = ({ context }) => {
//   const year = new Date().getFullYear();
//   const navigate = useNavigate();

//   // Chat Box States
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [formData, setFormData] = useState({ name: "", email: "", text: "" });
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const handleMessageSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.post("/messages", formData);
//       setSuccess(true);
//       setTimeout(() => {
//         setIsChatOpen(false);
//         setSuccess(false);
//         setFormData({ name: "", email: "", text: "" });
//       }, 3000);
//     } catch (error) {
//       console.error("Failed to send message", error);
//       alert("Failed to send message. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <footer
//         className="bg-dark text-light pt-5 pb-3 mt-auto"
//         style={{
//           fontFamily: "'Inter', system-ui, sans-serif",
//           position: "relative",
//         }}
//       >
//         <div className="container">
//           <div className="row gy-4 mb-5">
//             {/* 1. Brand & Description */}
//             <div className="col-lg-4 pe-lg-5">
//               <div
//                 className="d-flex align-items-center gap-2 mb-3 cursor-pointer"
//                 onClick={() => navigate("/")}
//               >
//                 <div className="bg-white text-primary rounded p-1 d-flex align-items-center justify-content-center">
//                   <Pill size={20} />
//                 </div>
//                 <h5
//                   className="fw-black mb-0 text-white"
//                   style={{ fontWeight: 900, letterSpacing: "-0.5px" }}
//                 >
//                   SmartPharmacy
//                 </h5>
//                 {context && (
//                   <span
//                     className="badge bg-primary bg-opacity-25 text-info px-2 py-1 rounded-pill ms-2 text-uppercase"
//                     style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}
//                   >
//                     {context} Portal
//                   </span>
//                 )}
//               </div>
//               <p className="small text-light opacity-75 mb-4">
//                 Providing clinical-grade pharmacy management and accessible
//                 healthcare for everyone. Better prices, faster delivery,
//                 superior care.
//               </p>
//               <div className="d-flex gap-3">
//                 <ShieldCheck size={24} className="opacity-50" />
//                 <CreditCard size={24} className="opacity-50" />
//                 <BadgeCheck size={24} className="opacity-50" />
//               </div>
//             </div>

//             {/* 2. Patients Links */}
//             <div className="col-6 col-lg-2 offset-lg-1">
//               <h6
//                 className="fw-bold text-uppercase tracking-wider mb-3 small text-white opacity-50"
//                 style={{ letterSpacing: "0.05em" }}
//               >
//                 Patients
//               </h6>
//               <ul className="list-unstyled d-flex flex-column gap-2 small">
//                 <li>
//                   <span
//                     className="text-light opacity-75 text-decoration-none footer-link cursor-pointer"
//                     onClick={() => navigate("/")}
//                   >
//                     How it Works
//                   </span>
//                 </li>
//                 <li>
//                   <span
//                     className="text-light opacity-75 text-decoration-none footer-link cursor-pointer"
//                     onClick={() => navigate("/")}
//                   >
//                     Pricing & Savings
//                   </span>
//                 </li>
//                 <li>
//                   <span
//                     className="text-light opacity-75 text-decoration-none footer-link cursor-pointer"
//                     onClick={() => navigate("/login")}
//                   >
//                     Medication Search
//                   </span>
//                 </li>
//               </ul>
//             </div>

//             {/* 3. Providers Links */}
//             <div className="col-6 col-lg-2">
//               <h6
//                 className="fw-bold text-uppercase tracking-wider mb-3 small text-white opacity-50"
//                 style={{ letterSpacing: "0.05em" }}
//               >
//                 Providers
//               </h6>
//               <ul className="list-unstyled d-flex flex-column gap-2 small">
//                 <li>
//                   <span
//                     className="text-light opacity-75 text-decoration-none footer-link cursor-pointer"
//                     onClick={() => navigate("/register")}
//                   >
//                     E-Prescribing
//                   </span>
//                 </li>
//                 <li>
//                   <span
//                     className="text-light opacity-75 text-decoration-none footer-link cursor-pointer"
//                     onClick={() => navigate("/login")}
//                   >
//                     Pharmacy Admin
//                   </span>
//                 </li>
//                 <li>
//                   <span
//                     className="text-light opacity-75 text-decoration-none footer-link cursor-pointer"
//                     onClick={() => navigate("/login")}
//                   >
//                     Doctor Portal
//                   </span>
//                 </li>
//               </ul>
//             </div>

//             {/* 4. Contact Us */}
//             <div className="col-lg-3">
//               <h6
//                 className="fw-bold text-uppercase tracking-wider mb-3 small text-white opacity-50"
//                 style={{ letterSpacing: "0.05em" }}
//               >
//                 Contact Us
//               </h6>
//               <ul className="list-unstyled d-flex flex-column gap-3 small">
//                 <li>
//                   <a
//                     href="tel:+9779800000000"
//                     className="text-light opacity-75 text-decoration-none footer-link d-flex align-items-center gap-2"
//                   >
//                     <PhoneCall size={16} /> +977-9800000000
//                   </a>
//                 </li>
//                 <li className="d-flex align-items-center gap-2 text-light opacity-75">
//                   <Clock size={16} /> 24/7 Pharmacist Support
//                 </li>
//                 <li>
//                   {/* ✅ Opens the Chat Box */}
//                   <button
//                     className="btn btn-primary btn-sm rounded-pill mt-2 fw-bold px-4 d-flex align-items-center gap-2 shadow"
//                     onClick={() => setIsChatOpen(true)}
//                   >
//                     <MessageSquare size={16} /> Send a Message
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Bottom Copyright & Legal */}
//           <div className="border-top border-secondary border-opacity-50 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 small text-light opacity-50">
//             <div>
//               &copy; {year} Smart Pharmacy System Inc. All rights reserved.
//             </div>
//             <div className="d-flex gap-3">
//               <span
//                 className="text-light text-decoration-none footer-link cursor-pointer"
//                 onClick={() => navigate("/")}
//               >
//                 Privacy Policy
//               </span>
//               <span
//                 className="text-light text-decoration-none footer-link cursor-pointer"
//                 onClick={() => navigate("/")}
//               >
//                 Terms of Service
//               </span>
//               <span
//                 className="text-light text-decoration-none footer-link cursor-pointer"
//                 onClick={() => navigate("/")}
//               >
//                 HIPAA Notice
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Global CSS for Footer Interactions */}
//         <style>{`
//           .cursor-pointer { cursor: pointer; }
//           .footer-link { transition: all 0.2s ease-in-out; }
//           .footer-link:hover { color: #fff !important; opacity: 1 !important; text-decoration: underline !important; }
//         `}</style>
//       </footer>

//       {/* 🟢 FLOATING MESSAGE BOX */}
//       {isChatOpen && (
//         <div
//           className="position-fixed bottom-0 end-0 m-4 z-3 shadow-lg rounded-4 overflow-hidden bg-white text-dark border border-light-subtle"
//           style={{
//             width: "350px",
//             maxWidth: "90vw",
//             animation: "slideUp 0.3s ease-out",
//           }}
//         >
//           <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
//             <div className="fw-bold d-flex align-items-center gap-2">
//               <MessageSquare size={18} /> Support Team
//             </div>
//             <button
//               className="btn btn-link text-white p-0 m-0"
//               onClick={() => setIsChatOpen(false)}
//             >
//               <X size={20} />
//             </button>
//           </div>

//           <div className="p-4">
//             {success ? (
//               <div className="text-center py-4">
//                 <CheckCircle2 size={48} className="text-success mb-3 mx-auto" />
//                 <h5 className="fw-bold">Message Sent!</h5>
//                 <p className="text-muted small">
//                   An admin will review it shortly.
//                 </p>
//               </div>
//             ) : (
//               <form onSubmit={handleMessageSubmit}>
//                 <p className="small text-muted mb-3">
//                   Leave us a message and we'll get back to you within 24 hours.
//                 </p>
//                 <div className="mb-2">
//                   <input
//                     type="text"
//                     className="form-control form-control-sm"
//                     placeholder="Your Name"
//                     required
//                     value={formData.name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, name: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="mb-2">
//                   <input
//                     type="email"
//                     className="form-control form-control-sm"
//                     placeholder="Your Email"
//                     required
//                     value={formData.email}
//                     onChange={(e) =>
//                       setFormData({ ...formData, email: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <textarea
//                     className="form-control form-control-sm"
//                     rows="3"
//                     placeholder="How can we help?"
//                     required
//                     value={formData.text}
//                     onChange={(e) =>
//                       setFormData({ ...formData, text: e.target.value })
//                     }
//                   ></textarea>
//                 </div>
//                 <button
//                   type="submit"
//                   className="btn btn-primary btn-sm w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <Loader2 size={16} className="spin-animation" />
//                   ) : (
//                     <>
//                       <Send size={16} /> Send Message
//                     </>
//                   )}
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
//         .spin-animation { animation: spin 1s linear infinite; }
//         @keyframes spin { 100% { transform: rotate(360deg); } }
//       `}</style>
//     </>
//   );
// };

// export default AppFooter;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pill,
  ShieldCheck,
  CreditCard,
  BadgeCheck,
  PhoneCall,
  Clock,
  MessageSquare,
  X,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import api from "../services/api"; // Make sure this path is correct for your axios instance

const AppFooter = ({ context }) => {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  // Chat Box States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/messages", formData);
      setSuccess(true);
      setTimeout(() => {
        setIsChatOpen(false);
        setSuccess(false);
        setFormData({ name: "", email: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Failed to send message", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MAIN FOOTER (Amazon Dark Style) */}
      <footer
        className="mt-auto"
        style={{
          backgroundColor: "#232F3E",
          color: "#FFFFFF",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.85rem",
        }}
      >
        <div className="container py-4">
          <div className="row gy-4">
            {/* 1. Brand & Description */}
            <div className="col-lg-4 pe-lg-4">
              <div
                className="d-flex align-items-center gap-2 mb-2 cursor-pointer footer-brand"
                onClick={() => navigate("/")}
              >
                <Pill size={22} style={{ color: "#FFD814" }} />
                <h5
                  className="fw-bold mb-0 text-white"
                  style={{ letterSpacing: "-0.5px", fontSize: "1.2rem" }}
                >
                  SmartPharmacy
                </h5>
                {context && (
                  <span
                    className="badge rounded-1 ms-1 text-uppercase fw-bold"
                    style={{
                      backgroundColor: "#37475A",
                      color: "#DDD",
                      fontSize: "0.6rem",
                    }}
                  >
                    {context}
                  </span>
                )}
              </div>
              <p className="mb-3" style={{ color: "#CCC", lineHeight: "1.4" }}>
                Providing clinical-grade pharmacy management and accessible
                healthcare for everyone. Better prices, faster delivery,
                superior care.
              </p>
              <div className="d-flex gap-3" style={{ color: "#888C8C" }}>
                <ShieldCheck size={20} />
                <CreditCard size={20} />
                <BadgeCheck size={20} />
              </div>
            </div>

            {/* 2. Patients Links */}
            <div className="col-6 col-lg-2 offset-lg-1">
              <h6
                className="fw-bold mb-2 text-white"
                style={{ fontSize: "0.9rem" }}
              >
                Patients
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-1 mb-0">
                <li>
                  <span
                    className="footer-link cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    How it Works
                  </span>
                </li>
                <li>
                  <span
                    className="footer-link cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    Pricing & Savings
                  </span>
                </li>
                <li>
                  <span
                    className="footer-link cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Medication Search
                  </span>
                </li>
              </ul>
            </div>

            {/* 3. Providers Links */}
            <div className="col-6 col-lg-2">
              <h6
                className="fw-bold mb-2 text-white"
                style={{ fontSize: "0.9rem" }}
              >
                Providers
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-1 mb-0">
                <li>
                  <span
                    className="footer-link cursor-pointer"
                    onClick={() => navigate("/register")}
                  >
                    E-Prescribing
                  </span>
                </li>
                <li>
                  <span
                    className="footer-link cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Pharmacy Admin
                  </span>
                </li>
                <li>
                  <span
                    className="footer-link cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Doctor Portal
                  </span>
                </li>
              </ul>
            </div>

            {/* 4. Contact Us */}
            <div className="col-lg-3">
              <h6
                className="fw-bold mb-2 text-white"
                style={{ fontSize: "0.9rem" }}
              >
                Let Us Help You
              </h6>
              <ul
                className="list-unstyled d-flex flex-column gap-2 mb-0"
                style={{ color: "#CCC" }}
              >
                <li>
                  <a
                    href="tel:+9779800000000"
                    className="footer-link d-flex align-items-center gap-2 text-decoration-none"
                  >
                    <PhoneCall size={14} /> +977-9800000000
                  </a>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <Clock size={14} /> 24/7 Support
                </li>
                <li className="mt-1">
                  {/* ✅ Opens the Chat Box */}
                  <button
                    className="btn btn-sm d-flex align-items-center gap-2 border-0 fw-medium shadow-sm"
                    style={{
                      backgroundColor: "#FFD814",
                      color: "#0F1111",
                      borderRadius: "4px",
                    }}
                    onClick={() => setIsChatOpen(true)}
                  >
                    <MessageSquare size={14} /> Support Chat
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div style={{ backgroundColor: "#131A22", padding: "15px 0" }}>
          <div
            className="container d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 gap-md-5"
            style={{ color: "#DDD", fontSize: "0.75rem" }}
          >
            <div className="d-flex gap-4">
              <span
                className="footer-link cursor-pointer"
                onClick={() => navigate("/")}
              >
                Conditions of Use
              </span>
              <span
                className="footer-link cursor-pointer"
                onClick={() => navigate("/")}
              >
                Privacy Notice
              </span>
              <span
                className="footer-link cursor-pointer"
                onClick={() => navigate("/")}
              >
                HIPAA Notice
              </span>
            </div>
            <div>
              &copy; {year} Smart Pharmacy System Inc. All rights reserved.
            </div>
          </div>
        </div>

        {/* Global CSS for Footer */}
        <style>{`
          .cursor-pointer { cursor: pointer; }
          .footer-link { color: #DDD; transition: color 0.1s; text-decoration: none; }
          .footer-link:hover { color: #FFF !important; text-decoration: underline !important; }
          .footer-brand:hover h5 { text-decoration: underline; }
        `}</style>
      </footer>

      {/* 🟢 FLOATING MESSAGE BOX (AWS Style) */}
      {isChatOpen && (
        <div
          className="position-fixed bottom-0 end-0 m-3 m-md-4 z-3 shadow rounded-1 bg-white text-dark border"
          style={{
            width: "320px",
            maxWidth: "90vw",
            borderColor: "#D5D9D9",
            animation: "slideUp 0.2s ease-out",
          }}
        >
          <div
            className="p-2 px-3 d-flex justify-content-between align-items-center border-bottom"
            style={{ backgroundColor: "#232F3E", color: "#FFF" }}
          >
            <div
              className="fw-bold d-flex align-items-center gap-2"
              style={{ fontSize: "0.9rem" }}
            >
              <MessageSquare size={16} style={{ color: "#FFD814" }} /> Support
              Team
            </div>
            <button
              className="btn btn-link text-white p-0 m-0 opacity-75 hover-opacity-100"
              onClick={() => setIsChatOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-3">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle2
                  size={40}
                  style={{ color: "#067D62" }}
                  className="mb-2 mx-auto"
                />
                <h6 className="fw-bold" style={{ color: "#0F1111" }}>
                  Message Sent!
                </h6>
                <p className="text-muted small mb-0">
                  An admin will review it shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMessageSubmit}>
                <p
                  className="small mb-3"
                  style={{ color: "#565959", lineHeight: "1.3" }}
                >
                  Leave us a message and we'll get back to you within 24 hours.
                </p>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm amazon-chat-input"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="email"
                    className="form-control form-control-sm amazon-chat-input"
                    placeholder="Your Email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control form-control-sm amazon-chat-input"
                    rows="3"
                    placeholder="How can we help?"
                    required
                    value={formData.text}
                    onChange={(e) =>
                      setFormData({ ...formData, text: e.target.value })
                    }
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-sm w-100 fw-medium d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm"
                  disabled={loading}
                  style={{
                    backgroundColor: "#FFD814",
                    color: "#0F1111",
                    borderRadius: "4px",
                  }}
                >
                  {loading ? (
                    <Loader2 size={16} className="spin-animation" />
                  ) : (
                    <>
                      <Send size={14} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Chat Box Animations & Focus Styles */}
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .amazon-chat-input { border: 1px solid #888C8C; border-radius: 3px; font-size: 0.85rem; box-shadow: none; }
        .amazon-chat-input:focus { 
          border-color: #e47911 !important; 
          box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; 
          outline: none; 
        }
        .hover-opacity-100:hover { opacity: 1 !important; }
      `}</style>
    </>
  );
};

export default AppFooter;
