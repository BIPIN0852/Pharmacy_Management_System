// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { ShieldCheck, Users, Activity, Clock } from "lucide-react";
// import pharmacyHero from "../assets/pharmacy.jpg";
// import pharmacyDashboard from "../assets/pharmacy-dashboard.jpg";
// import pharmacyMobile from "../assets/pharmacy1.jpg";

// const Home = () => {
//   const navigate = useNavigate();

//   const [isMobile, setIsMobile] = useState(
//     typeof window !== "undefined" ? window.innerWidth < 768 : false
//   );

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const currentYear = new Date().getFullYear();

//   return (
//     <div
//       className="d-flex flex-column min-vh-100 bg-light text-dark"
//       style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//     >
//       {/* Top navigation */}
//       <header className="d-flex justify-content-between align-items-center px-4 py-3 bg-white shadow-sm sticky-top">
//         <div className="d-flex align-items-center gap-2">
//           <div
//             className="rounded-circle d-flex align-items-center justify-content-center bg-info"
//             style={{ width: 34, height: 34, fontSize: "1.1rem" }}
//           >
//             💊
//           </div>
//           <div>
//             <div className="fw-semibold fs-5 mb-0">Pharmacy Management System</div>
//             <div className="text-muted small">
//               Clinical‑grade pharmacy management software
//             </div>
//           </div>
//         </div>
//         <nav className="d-flex flex-wrap gap-2 align-items-center">
//           {[
//             { label: "Features", id: "features" },
//             { label: "Dashboards", id: "roles" },
//             { label: "Workflow", id: "workflow" },
//           ].map((section) => (
//             <button
//               key={section.id}
//               className="btn btn-link text-secondary px-2"
//               onClick={() => {
//                 const el = document.getElementById(section.id);
//                 if (el) el.scrollIntoView({ behavior: "smooth" });
//               }}
//             >
//               {section.label}
//             </button>
//           ))}
//           <button
//             className="btn btn-outline-primary rounded-pill px-3"
//             onClick={() => navigate("/login")}
//           >
//             Log in
//           </button>
//           <button
//             className="btn btn-primary rounded-pill px-3"
//             onClick={() => navigate("/register")}
//           >
//             Book a demo
//           </button>
//         </nav>
//       </header>

//       {/* Hero */}
//       <motion.section
//         className="container d-flex flex-wrap align-items-center py-5 gap-4"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7 }}
//         style={{ maxWidth: 1200 }}
//       >
//         <div className="flex-grow-1" style={{ minWidth: 280, maxWidth: 540 }}>
//           <div
//             className="badge bg-info text-primary rounded-pill mb-3"
//             style={{ fontSize: "0.78rem" }}
//           >
//             Designed for modern community pharmacies
//           </div>
//           <h1 className="display-5 fw-semibold mb-3">
//             End‑to‑end pharmacy management in one secure platform.
//           </h1>
//           <p className="text-muted fs-6">
//             From prescription intake to dispensing, inventory, billing and
//             doctor appointments — bring every workflow into a single, compliant
//             system with real‑time visibility for admins, pharmacists and
//             customers.
//           </p>

//           <div
//             className={`d-flex gap-3 mt-4 flex-${
//               isMobile ? "column" : "row"
//             } align-items-${isMobile ? "stretch" : "center"}`}
//           >
//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//               className="btn btn-primary rounded-pill flex-grow-1 flex-md-grow-0"
//               style={{ minWidth: isMobile ? "100%" : "auto" }}
//               onClick={() => navigate("/register")}
//             >
//               Get started
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//               className="btn btn-outline-primary rounded-pill flex-grow-1 flex-md-grow-0"
//               style={{ minWidth: isMobile ? "100%" : "auto" }}
//               onClick={() => navigate("/login")}
//             >
//               Log in to workspace
//             </motion.button>
//           </div>

//           <div
//             className="mt-4 d-flex flex-column gap-2 text-muted"
//             style={{ fontSize: "0.86rem" }}
//           >
//             {[
//               "Role‑based access for admin, pharmacist and customer.",
//               "Supports prescription uploads, doctor appointments and payments.",
//               "Optimized for busy retail and clinic‑attached pharmacies.",
//             ].map((text, idx) => (
//               <div key={idx} className="d-flex align-items-center gap-2">
//                 <span
//                   className="rounded-circle bg-success"
//                   style={{ width: 6, height: 6, display: "inline-block" }}
//                 />
//                 {text}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div
//           className="flex-grow-1 d-flex justify-content-center"
//           style={{ minWidth: 260 }}
//         >
//           <motion.div
//             className="position-relative"
//             initial={{ opacity: 0, x: 40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.7 }}
//             style={{ maxWidth: 420, width: "100%" }}
//           >
//             <img
//               src={pharmacyHero}
//               alt="Pharmacy workspace"
//               className="img-fluid rounded-3 shadow-lg"
//             />
//             <div
//               className="position-absolute bottom-0 end-0 bg-dark bg-opacity-75 text-light rounded-3 p-2 m-3"
//               style={{ fontSize: "0.8rem" }}
//             >
//               <div className="fw-semibold fs-5">98%</div>
//               <div>Orders processed on time</div>
//             </div>
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* Metrics strip with icons */}
//       <section
//         className="mx-auto my-3 px-4 py-3 bg-white shadow-sm rounded-3"
//         style={{ maxWidth: 1100 }}
//       >
//         <div className="row row-cols-1 row-cols-md-4 g-3 text-center">
//           <MetricCard
//             icon={ShieldCheck}
//             value="HIPAA‑ready"
//             label="Secure data design"
//           />
//           <MetricCard
//             icon={Users}
//             value="3 roles"
//             label="Admin · Pharmacist · Customer"
//           />
//           <MetricCard
//             icon={Activity}
//             value="Real‑time"
//             label="Stock & order tracking"
//           />
//           <MetricCard
//             icon={Clock}
//             value="< 30 sec"
//             label="Average order entry time"
//           />
//         </div>
//       </section>

//       {/* How it works */}
//       <section
//         className="container py-5 px-3"
//         style={{ maxWidth: 1100 }}
//         id="how-it-works"
//       >
//         <div className="row g-4 align-items-center">
//           <div className="col-md-6">
//             <h2 className="fw-semibold fs-4 mb-2">
//               How Smart Pharmacy System fits your day
//             </h2>
//             <p className="text-muted fs-6 mb-3">
//               Digitize your front counter, dispensary and back‑office in three
//               simple steps.
//             </p>
//             <ol className="text-muted ps-3">
//               <li className="mb-2">
//                 Patients upload prescriptions or place medicine orders online.
//               </li>
//               <li className="mb-2">
//                 Pharmacists verify, dispense and update stock in real time.
//               </li>
//               <li className="mb-2">
//                 Payments, invoices and reports are generated automatically for
//                 admins.
//               </li>
//             </ol>
//           </div>
//           <div className="col-md-6">
//             <div className="row g-3">
//               <div className="col-6">
//                 <img
//                   src={pharmacyDashboard}
//                   alt="Admin and pharmacist dashboards"
//                   className="img-fluid rounded-3 shadow-sm"
//                 />
//               </div>
//               <div className="col-6 d-flex flex-column gap-3">
//                 <img
//                   src={pharmacyMobile}
//                   alt="Customer mobile view"
//                   className="img-fluid rounded-3 shadow-sm"
//                 />
//                 <div className="bg-white rounded-3 shadow-sm p-2 small text-muted">
//                   One system for web and mobile — no separate apps required.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Role-based dashboards */}
//       <section
//         id="roles"
//         className="container py-5 px-3 text-center"
//         style={{ maxWidth: 1100 }}
//       >
//         <h2 className="fw-semibold fs-4 mb-2">Role‑based dashboards</h2>
//         <p className="text-muted fs-6 mb-4">
//           Interfaces tailored to the daily needs of each user in the pharmacy.
//         </p>
//         <div className="row row-cols-1 row-cols-md-3 g-4">
//           <RoleCard
//             title="Admin console"
//             description="Central control for owners and managers. Monitor performance, users and operational risk."
//             features={[
//               "Configure user roles and permissions.",
//               "View revenue, order volume and medicine statistics.",
//               "Audit logs for prescription and status changes.",
//             ]}
//           />
//           <RoleCard
//             title="Pharmacist workspace"
//             description="Streamlined view for processing prescriptions, stock and patient interactions."
//             features={[
//               "See uploaded prescriptions with patient details.",
//               "Check appointment schedule and doctor availability.",
//               "Update stock, expiry and dispensing status in real time.",
//             ]}
//           />
//           <RoleCard
//             title="Customer portal"
//             description="Simple and secure way for patients to engage with your pharmacy digitally."
//             features={[
//               "Upload prescriptions and view fulfillment status.",
//               "Book and manage doctor appointments.",
//               "Track orders, payments and wallet balance.",
//             ]}
//           />
//         </div>
//       </section>

//       {/* Features */}
//       <section
//         id="features"
//         className="container py-5 px-3 bg-light"
//         style={{ maxWidth: 1100 }}
//       >
//         <h2 className="fw-semibold fs-4 mb-2 text-center">Core modules</h2>
//         <p className="text-muted fs-6 mb-4 text-center">
//           Built to match the core processes of real‑world retail and clinical
//           pharmacies.
//         </p>
//         <div className="row row-cols-1 row-cols-md-3 g-4">
//           <FeatureCard
//             title="Inventory & stock control"
//             points={[
//               "Track batch numbers, expiries and stock levels.",
//               "Low‑stock alerts for critical medicines.",
//               "Supplier and purchase order records.",
//             ]}
//           />
//           <FeatureCard
//             title="Orders, billing & payments"
//             points={[
//               "Cart‑based ordering with shipping details.",
//               "Supports COD, Khalti and Stripe payments.",
//               "Automatic invoice and receipt generation.",
//             ]}
//           />
//           <FeatureCard
//             title="Clinical workflows"
//             points={[
//               "Prescription upload and verification pipeline.",
//               "Doctor appointment scheduling and follow‑up.",
//               "Patient history for safer dispensing decisions.",
//             ]}
//           />
//         </div>
//       </section>

//       {/* Workflow */}
//       <section
//         id="workflow"
//         className="container py-5 px-3"
//         style={{ maxWidth: 900 }}
//       >
//         <h2 className="fw-semibold fs-4 mb-2 text-center">
//           Typical daily workflow
//         </h2>
//         <p className="text-muted fs-6 mb-4 text-center">
//           Reflecting how pharmacists, doctors and patients work together in
//           practice.
//         </p>
//         <div className="row row-cols-1 row-cols-md-3 g-4">
//           <WorkflowStep
//             step="1"
//             title="Patient intake"
//             items={[
//               "Customer signs in or registers.",
//               "Uploads prescription or selects medicines.",
//               "Chooses pickup or delivery and payment option.",
//             ]}
//           />
//           <WorkflowStep
//             step="2"
//             title="Dispensing & review"
//             items={[
//               "Pharmacist validates prescription and stock.",
//               "Doctor consulted for clarifications where needed.",
//               "Order prepared, labeled and marked ready.",
//             ]}
//           />
//           <WorkflowStep
//             step="3"
//             title="Fulfillment & analytics"
//             items={[
//               "Customer notified and completes payment if pending.",
//               "Order history stored for future visits.",
//               "Admin reviews dashboards and exportable reports.",
//             ]}
//           />
//         </div>
//       </section>

//       {/* Bottom CTA */}
//       <section className="bg-dark text-light py-4 px-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
//         <div className="fw-semibold fs-6">
//           Ready to run your pharmacy like a digital clinic rather than a
//           paper‑based store?
//         </div>
//         <div className="d-flex gap-2">
//           <button
//             className="btn btn-success rounded-pill px-4"
//             onClick={() => navigate("/register")}
//           >
//             Create an account
//           </button>
//           <button
//             className="btn btn-outline-light rounded-pill px-4"
//             onClick={() => navigate("/login")}
//           >
//             Log in to existing workspace
//           </button>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer
//         className="bg-black text-secondary text-center py-3 mt-auto"
//         style={{ fontSize: "0.85rem" }}
//       >
//         <div>© {currentYear} Smart Pharmacy System</div>
//         <div className="small mt-1">
//           Built as a full‑stack pharmacy management platform for education and
//           production use.
//         </div>
//       </footer>
//     </div>
//   );
// };

// const RoleCard = ({ title, description, features }) => (
//   <motion.div
//     className="bg-white rounded-3 shadow p-4 text-secondary h-100"
//     whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(15,23,42,0.12)" }}
//   >
//     <h3 className="fs-5 fw-semibold text-dark mb-3">{title}</h3>
//     <p>{description}</p>
//     <ul className="ps-3 mb-0">
//       {features.map((feat, idx) => (
//         <li key={idx}>{feat}</li>
//       ))}
//     </ul>
//   </motion.div>
// );

// const FeatureCard = ({ title, points }) => (
//   <motion.div
//     className="bg-white rounded-3 shadow-sm p-4 h-100"
//     whileHover={{ y: -3 }}
//   >
//     <h3 className="fs-6 fw-semibold mb-3">{title}</h3>
//     <ul className="ps-3 mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
//       {points.map((p, i) => (
//         <li key={i}>{p}</li>
//       ))}
//     </ul>
//   </motion.div>
// );

// const WorkflowStep = ({ step, title, items }) => (
//   <motion.div
//     className="bg-white rounded-3 shadow-sm p-4 h-100"
//     whileHover={{ y: -3 }}
//   >
//     <div className="d-flex align-items-center gap-2 mb-2">
//       <span className="badge bg-primary rounded-circle">{step}</span>
//       <h3 className="fs-6 fw-semibold mb-0">{title}</h3>
//     </div>
//     <ul className="ps-3 mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
//       {items.map((it, i) => (
//         <li key={i}>{it}</li>
//       ))}
//     </ul>
//   </motion.div>
// );

// const MetricCard = ({ icon: Icon, value, label }) => (
//   <div className="col d-flex flex-column align-items-center gap-1">
//     <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-1">
//       <Icon size={20} className="text-primary m-2" />
//     </div>
//     <div className="fw-semibold">{value}</div>
//     <div className="text-muted small">{label}</div>
//   </div>
// );

// export default Home;

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { ShieldCheck, Users, Activity, Clock } from "lucide-react";
// import pharmacyHero from "../assets/pharmacy.jpg";
// import pharmacyDashboard from "../assets/pharmacy-dashboard.jpg";
// import pharmacyMobile from "../assets/pharmacy1.jpg";
// import AppFooter from "../components/AppFooter"; // ✅ shared animated footer

// const Home = () => {
//   const navigate = useNavigate();

//   const [isMobile, setIsMobile] = useState(
//     typeof window !== "undefined" ? window.innerWidth < 768 : false
//   );

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div
//       className="d-flex flex-column min-vh-100 bg-light text-dark"
//       style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//     >
//       {/* Top navigation */}
//       <header className="d-flex justify-content-between align-items-center px-4 py-3 bg-white shadow-sm sticky-top">
//         <div className="d-flex align-items-center gap-2">
//           <div
//             className="rounded-circle d-flex align-items-center justify-content-center bg-info"
//             style={{ width: 34, height: 34, fontSize: "1.1rem" }}
//           >
//             💊
//           </div>
//           <div>
//             <div className="fw-semibold fs-5 mb-0">
//               Pharmacy Management System
//             </div>
//             <div className="text-muted small">
//               Clinical‑grade pharmacy management software
//             </div>
//           </div>
//         </div>
//         <nav className="d-flex flex-wrap gap-2 align-items-center">
//           {[
//             { label: "Features", id: "features" },
//             { label: "Dashboards", id: "roles" },
//             { label: "Workflow", id: "workflow" },
//           ].map((section) => (
//             <button
//               key={section.id}
//               className="btn btn-link text-secondary px-2"
//               onClick={() => {
//                 const el = document.getElementById(section.id);
//                 if (el) el.scrollIntoView({ behavior: "smooth" });
//               }}
//             >
//               {section.label}
//             </button>
//           ))}
//           <button
//             className="btn btn-outline-primary rounded-pill px-3"
//             onClick={() => navigate("/login")}
//           >
//             Log in
//           </button>
//           <button
//             className="btn btn-primary rounded-pill px-3"
//             onClick={() => navigate("/register")}
//           >
//             Book a demo
//           </button>
//         </nav>
//       </header>

//       {/* Hero */}
//       <motion.section
//         className="container d-flex flex-wrap align-items-center py-5 gap-4"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7 }}
//         style={{ maxWidth: 1200 }}
//       >
//         <div className="flex-grow-1" style={{ minWidth: 280, maxWidth: 540 }}>
//           <div
//             className="badge bg-info text-primary rounded-pill mb-3"
//             style={{ fontSize: "0.78rem" }}
//           >
//             Designed for modern community pharmacies
//           </div>
//           <h1 className="display-5 fw-semibold mb-3">
//             End‑to‑end pharmacy management in one secure platform.
//           </h1>
//           <p className="text-muted fs-6">
//             From prescription intake to dispensing, inventory, billing and
//             doctor appointments — bring every workflow into a single, compliant
//             system with real‑time visibility for admins, pharmacists and
//             customers.
//           </p>

//           <div
//             className={`d-flex gap-3 mt-4 flex-${
//               isMobile ? "column" : "row"
//             } align-items-${isMobile ? "stretch" : "center"}`}
//           >
//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//               className="btn btn-primary rounded-pill flex-grow-1 flex-md-grow-0"
//               style={{ minWidth: isMobile ? "100%" : "auto" }}
//               onClick={() => navigate("/register")}
//             >
//               Get started
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//               className="btn btn-outline-primary rounded-pill flex-grow-1 flex-md-grow-0"
//               style={{ minWidth: isMobile ? "100%" : "auto" }}
//               onClick={() => navigate("/login")}
//             >
//               Log in to workspace
//             </motion.button>
//           </div>

//           <div
//             className="mt-4 d-flex flex-column gap-2 text-muted"
//             style={{ fontSize: "0.86rem" }}
//           >
//             {[
//               "Role‑based access for admin, pharmacist and customer.",
//               "Supports prescription uploads, doctor appointments and payments.",
//               "Optimized for busy retail and clinic‑attached pharmacies.",
//             ].map((text, idx) => (
//               <div key={idx} className="d-flex align-items-center gap-2">
//                 <span
//                   className="rounded-circle bg-success"
//                   style={{ width: 6, height: 6, display: "inline-block" }}
//                 />
//                 {text}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div
//           className="flex-grow-1 d-flex justify-content-center"
//           style={{ minWidth: 260 }}
//         >
//           <motion.div
//             className="position-relative"
//             initial={{ opacity: 0, x: 40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.7 }}
//             style={{ maxWidth: 420, width: "100%" }}
//           >
//             <img
//               src={pharmacyHero}
//               alt="Pharmacy workspace"
//               className="img-fluid rounded-3 shadow-lg"
//             />
//             <div
//               className="position-absolute bottom-0 end-0 bg-dark bg-opacity-75 text-light rounded-3 p-2 m-3"
//               style={{ fontSize: "0.8rem" }}
//             >
//               <div className="fw-semibold fs-5">98%</div>
//               <div>Orders processed on time</div>
//             </div>
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* Metrics strip with icons */}
//       <section
//         className="mx-auto my-3 px-4 py-3 bg-white shadow-sm rounded-3"
//         style={{ maxWidth: 1100 }}
//       >
//         <div className="row row-cols-1 row-cols-md-4 g-3 text-center">
//           <MetricCard
//             icon={ShieldCheck}
//             value="HIPAA‑ready"
//             label="Secure data design"
//           />
//           <MetricCard
//             icon={Users}
//             value="3 roles"
//             label="Admin · Pharmacist · Customer"
//           />
//           <MetricCard
//             icon={Activity}
//             value="Real‑time"
//             label="Stock & order tracking"
//           />
//           <MetricCard
//             icon={Clock}
//             value="< 30 sec"
//             label="Average order entry time"
//           />
//         </div>
//       </section>

//       {/* How it works */}
//       <section
//         className="container py-5 px-3"
//         style={{ maxWidth: 1100 }}
//         id="how-it-works"
//       >
//         <div className="row g-4 align-items-center">
//           <div className="col-md-6">
//             <h2 className="fw-semibold fs-4 mb-2">
//               How Smart Pharmacy System fits your day
//             </h2>
//             <p className="text-muted fs-6 mb-3">
//               Digitize your front counter, dispensary and back‑office in three
//               simple steps.
//             </p>
//             <ol className="text-muted ps-3">
//               <li className="mb-2">
//                 Patients upload prescriptions or place medicine orders online.
//               </li>
//               <li className="mb-2">
//                 Pharmacists verify, dispense and update stock in real time.
//               </li>
//               <li className="mb-2">
//                 Payments, invoices and reports are generated automatically for
//                 admins.
//               </li>
//             </ol>
//           </div>
//           <div className="col-md-6">
//             <div className="row g-3">
//               <div className="col-6">
//                 <img
//                   src={pharmacyDashboard}
//                   alt="Admin and pharmacist dashboards"
//                   className="img-fluid rounded-3 shadow-sm"
//                 />
//               </div>
//               <div className="col-6 d-flex flex-column gap-3">
//                 <img
//                   src={pharmacyMobile}
//                   alt="Customer mobile view"
//                   className="img-fluid rounded-3 shadow-sm"
//                 />
//                 <div className="bg-white rounded-3 shadow-sm p-2 small text-muted">
//                   One system for web and mobile — no separate apps required.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Role-based dashboards */}
//       <section
//         id="roles"
//         className="container py-5 px-3 text-center"
//         style={{ maxWidth: 1100 }}
//       >
//         <h2 className="fw-semibold fs-4 mb-2">Role‑based dashboards</h2>
//         <p className="text-muted fs-6 mb-4">
//           Interfaces tailored to the daily needs of each user in the pharmacy.
//         </p>
//         <div className="row row-cols-1 row-cols-md-3 g-4">
//           <RoleCard
//             title="Admin console"
//             description="Central control for owners and managers. Monitor performance, users and operational risk."
//             features={[
//               "Configure user roles and permissions.",
//               "View revenue, order volume and medicine statistics.",
//               "Audit logs for prescription and status changes.",
//             ]}
//           />
//           <RoleCard
//             title="Pharmacist workspace"
//             description="Streamlined view for processing prescriptions, stock and patient interactions."
//             features={[
//               "See uploaded prescriptions with patient details.",
//               "Check appointment schedule and doctor availability.",
//               "Update stock, expiry and dispensing status in real time.",
//             ]}
//           />
//           <RoleCard
//             title="Customer portal"
//             description="Simple and secure way for patients to engage with your pharmacy digitally."
//             features={[
//               "Upload prescriptions and view fulfillment status.",
//               "Book and manage doctor appointments.",
//               "Track orders, payments and wallet balance.",
//             ]}
//           />
//         </div>
//       </section>

//       {/* Features */}
//       <section
//         id="features"
//         className="container py-5 px-3 bg-light"
//         style={{ maxWidth: 1100 }}
//       >
//         <h2 className="fw-semibold fs-4 mb-2 text-center">Core modules</h2>
//         <p className="text-muted fs-6 mb-4 text-center">
//           Built to match the core processes of real‑world retail and clinical
//           pharmacies.
//         </p>
//         <div className="row row-cols-1 row-cols-md-3 g-4">
//           <FeatureCard
//             title="Inventory & stock control"
//             points={[
//               "Track batch numbers, expiries and stock levels.",
//               "Low‑stock alerts for critical medicines.",
//               "Supplier and purchase order records.",
//             ]}
//           />
//           <FeatureCard
//             title="Orders, billing & payments"
//             points={[
//               "Cart‑based ordering with shipping details.",
//               "Supports COD, Khalti and Stripe payments.",
//               "Automatic invoice and receipt generation.",
//             ]}
//           />
//           <FeatureCard
//             title="Clinical workflows"
//             points={[
//               "Prescription upload and verification pipeline.",
//               "Doctor appointment scheduling and follow‑up.",
//               "Patient history for safer dispensing decisions.",
//             ]}
//           />
//         </div>
//       </section>

//       {/* Workflow */}
//       <section
//         id="workflow"
//         className="container py-5 px-3"
//         style={{ maxWidth: 900 }}
//       >
//         <h2 className="fw-semibold fs-4 mb-2 text-center">
//           Typical daily workflow
//         </h2>
//         <p className="text-muted fs-6 mb-4 text-center">
//           Reflecting how pharmacists, doctors and patients work together in
//           practice.
//         </p>
//         <div className="row row-cols-1 row-cols-md-3 g-4">
//           <WorkflowStep
//             step="1"
//             title="Patient intake"
//             items={[
//               "Customer signs in or registers.",
//               "Uploads prescription or selects medicines.",
//               "Chooses pickup or delivery and payment option.",
//             ]}
//           />
//           <WorkflowStep
//             step="2"
//             title="Dispensing & review"
//             items={[
//               "Pharmacist validates prescription and stock.",
//               "Doctor consulted for clarifications where needed.",
//               "Order prepared, labeled and marked ready.",
//             ]}
//           />
//           <WorkflowStep
//             step="3"
//             title="Fulfillment & analytics"
//             items={[
//               "Customer notified and completes payment if pending.",
//               "Order history stored for future visits.",
//               "Admin reviews dashboards and exportable reports.",
//             ]}
//           />
//         </div>
//       </section>

//       {/* Bottom CTA */}
//       <section className="bg-dark text-light py-4 px-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
//         <div className="fw-semibold fs-6">
//           Ready to run your pharmacy like a digital clinic rather than a
//           paper‑based store?
//         </div>
//         <div className="d-flex gap-2">
//           <button
//             className="btn btn-success rounded-pill px-4"
//             onClick={() => navigate("/register")}
//           >
//             Create an account
//           </button>
//           <button
//             className="btn btn-outline-light rounded-pill px-4"
//             onClick={() => navigate("/login")}
//           >
//             Log in to existing workspace
//           </button>
//         </div>
//       </section>

//       {/* Animated shared footer */}
//       <AppFooter context="Landing · Secure digital pharmacy and healthcare platform." />
//     </div>
//   );
// };

// const RoleCard = ({ title, description, features }) => (
//   <motion.div
//     className="bg-white rounded-3 shadow p-4 text-secondary h-100"
//     whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(15,23,42,0.12)" }}
//   >
//     <h3 className="fs-5 fw-semibold text-dark mb-3">{title}</h3>
//     <p>{description}</p>
//     <ul className="ps-3 mb-0">
//       {features.map((feat, idx) => (
//         <li key={idx}>{feat}</li>
//       ))}
//     </ul>
//   </motion.div>
// );

// const FeatureCard = ({ title, points }) => (
//   <motion.div
//     className="bg-white rounded-3 shadow-sm p-4 h-100"
//     whileHover={{ y: -3 }}
//   >
//     <h3 className="fs-6 fw-semibold mb-3">{title}</h3>
//     <ul className="ps-3 mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
//       {points.map((p, i) => (
//         <li key={i}>{p}</li>
//       ))}
//     </ul>
//   </motion.div>
// );

// const WorkflowStep = ({ step, title, items }) => (
//   <motion.div
//     className="bg-white rounded-3 shadow-sm p-4 h-100"
//     whileHover={{ y: -3 }}
//   >
//     <div className="d-flex align-items-center gap-2 mb-2">
//       <span className="badge bg-primary rounded-circle">{step}</span>
//       <h3 className="fs-6 fw-semibold mb-0">{title}</h3>
//     </div>
//     <ul className="ps-3 mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
//       {items.map((it, i) => (
//         <li key={i}>{it}</li>
//       ))}
//     </ul>
//   </motion.div>
// );

// const MetricCard = ({ icon: Icon, value, label }) => (
//   <div className="col d-flex flex-column align-items-center gap-1">
//     <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-1">
//       <Icon size={20} className="text-primary m-2" />
//     </div>
//     <div className="fw-semibold">{value}</div>
//     <div className="text-muted small">{label}</div>
//   </div>
// );

// export default Home;

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { ShieldCheck, Users, Activity, Clock } from "lucide-react";
// import pharmacyHero from "../assets/pharmacy.jpg";
// import pharmacyDashboard from "../assets/pharmacy-dashboard.jpg";
// import pharmacyMobile from "../assets/pharmacy1.jpg";

// const Home = () => {
//   const navigate = useNavigate();
//   const [isMobile, setIsMobile] = useState(false);
//   const [currentAd, setCurrentAd] = useState(0);

//   // Rotating ad content - changes every 10 seconds
//   const ads = [
//     {
//       img: "https://via.placeholder.com/300x150/28a745/ffffff?text=Rx+Specials",
//       title: "💊 20% OFF Chronic Prescriptions",
//       desc: "Diabetes, hypertension, cholesterol meds. Valid through Dec 31st.",
//       btnText: "Shop Now",
//       btnColor: "btn-success",
//     },
//     {
//       img: "https://via.placeholder.com/300x150/17a2b8/ffffff?text=Vaccines",
//       title: "🩺 Free Flu Vaccine This Week",
//       desc: "Walk-ins welcome. No appointment needed for seasonal vaccines.",
//       btnText: "Book Now",
//       btnColor: "btn-primary",
//     },
//   ];

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Auto-rotate ads every 10 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentAd((prev) => (prev + 1) % ads.length);
//     }, 10000); // 10 seconds

//     return () => clearInterval(interval);
//   }, [ads.length]);

//   return (
//     <div
//       className="d-flex flex-column min-vh-100 bg-light text-dark"
//       style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//     >
//       {/* Top navigation - Login/Register buttons only here */}
//       <header className="d-flex justify-content-between align-items-center px-4 py-3 bg-white shadow-sm sticky-top">
//         <div className="d-flex align-items-center gap-2">
//           <div
//             className="rounded-circle d-flex align-items-center justify-content-center bg-info"
//             style={{ width: 34, height: 34, fontSize: "1.1rem" }}
//           >
//             💊
//           </div>
//           <div>
//             <div className="fw-semibold fs-5 mb-0">
//               Pharmacy Management System
//             </div>
//             <div className="text-muted small">
//               Clinical‑grade pharmacy management software
//             </div>
//           </div>
//         </div>
//         <nav className="d-flex flex-wrap gap-2 align-items-center">
//           {[
//             { label: "Features", id: "features" },
//             { label: "Dashboards", id: "roles" },
//             { label: "Workflow", id: "workflow" },
//           ].map((section) => (
//             <button
//               key={section.id}
//               className="btn btn-link text-secondary px-2"
//               onClick={() => {
//                 const el = document.getElementById(section.id);
//                 if (el) el.scrollIntoView({ behavior: "smooth" });
//               }}
//             >
//               {section.label}
//             </button>
//           ))}
//           <button
//             className="btn btn-outline-primary rounded-pill px-3"
//             onClick={() => navigate("/login")}
//           >
//             Log in
//           </button>
//           <button
//             className="btn btn-primary rounded-pill px-3"
//             onClick={() => navigate("/register")}
//           >
//             Get started
//           </button>
//         </nav>
//       </header>

//       {/* Hero */}
//       <motion.section
//         className="container d-flex flex-wrap align-items-center py-5 gap-4"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7 }}
//         style={{ maxWidth: 1200 }}
//       >
//         <div className="flex-grow-1" style={{ minWidth: 280, maxWidth: 540 }}>
//           <div
//             className="badge bg-info text-primary rounded-pill mb-3"
//             style={{ fontSize: "0.78rem" }}
//           >
//             Designed for modern community pharmacies
//           </div>
//           <h1 className="display-5 fw-semibold mb-3">
//             End‑to‑end pharmacy management in one secure platform.
//           </h1>
//           <p className="text-muted fs-6">
//             From prescription intake to dispensing, inventory, billing and
//             doctor appointments — bring every workflow into a single, compliant
//             system with real‑time visibility for admins, pharmacists and
//             customers.
//           </p>

//           <div
//             className={`d-flex gap-3 mt-4 flex-${
//               isMobile ? "column" : "row"
//             } align-items-${isMobile ? "stretch" : "center"}`}
//           >
//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//               className="btn btn-primary rounded-pill flex-grow-1 flex-md-grow-0"
//               style={{ minWidth: isMobile ? "100%" : "auto" }}
//               onClick={() => navigate("/register")}
//             >
//               Get started
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//               className="btn btn-outline-primary rounded-pill flex-grow-1 flex-md-grow-0"
//               style={{ minWidth: isMobile ? "100%" : "auto" }}
//               onClick={() => navigate("/login")}
//             >
//               Log in to workspace
//             </motion.button>
//           </div>

//           <div
//             className="mt-4 d-flex flex-column gap-2 text-muted"
//             style={{ fontSize: "0.86rem" }}
//           >
//             {[
//               "Role‑based access for admin, pharmacist and customer.",
//               "Supports prescription uploads, doctor appointments and payments.",
//               "Optimized for busy retail and clinic‑attached pharmacies.",
//             ].map((text, idx) => (
//               <div key={idx} className="d-flex align-items-center gap-2">
//                 <span
//                   className="rounded-circle bg-success"
//                   style={{ width: 6, height: 6, display: "inline-block" }}
//                 />
//                 {text}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div
//           className="flex-grow-1 d-flex justify-content-center"
//           style={{ minWidth: 260 }}
//         >
//           <motion.div
//             className="position-relative"
//             initial={{ opacity: 0, x: 40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.7 }}
//             style={{ maxWidth: 420, width: "100%" }}
//           >
//             <img
//               src={pharmacyHero}
//               alt="Pharmacy workspace"
//               className="img-fluid rounded-3 shadow-lg"
//             />
//             <div
//               className="position-absolute bottom-0 end-0 bg-dark bg-opacity-75 text-light rounded-3 p-2 m-3"
//               style={{ fontSize: "0.8rem" }}
//             >
//               <div className="fw-semibold fs-5">98%</div>
//               <div>Orders processed on time</div>
//             </div>
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* AD 1 - Rotating banner after hero */}
//       <motion.section
//         className="container my-4"
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="card shadow-sm border-0 overflow-hidden">
//           <div className="card-body p-4">
//             <div className="row align-items-center g-3">
//               <div className="col-md-3">
//                 <motion.img
//                   key={`ad-img-${currentAd}`}
//                   src={ads[currentAd].img}
//                   alt="Special offer"
//                   className="img-fluid rounded-3"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.5 }}
//                 />
//               </div>
//               <div className="col-md-6">
//                 <h5 className="fw-bold mb-1">{ads[currentAd].title}</h5>
//                 <p className="mb-2 text-muted small">{ads[currentAd].desc}</p>
//               </div>
//               <div className="col-md-3 text-md-end">
//                 <button
//                   className={`btn ${ads[currentAd].btnColor} btn-sm px-3`}
//                 >
//                   {ads[currentAd].btnText} →
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.section>

//       {/* Metrics strip with icons */}
//       <section
//         className="mx-auto my-3 px-4 py-3 bg-white shadow-sm rounded-3"
//         style={{ maxWidth: 1100 }}
//       >
//         <div className="row row-cols-1 row-cols-md-4 g-3 text-center">
//           <MetricCard
//             icon={ShieldCheck}
//             value="HIPAA‑ready"
//             label="Secure data design"
//           />
//           <MetricCard
//             icon={Users}
//             value="3 roles"
//             label="Admin · Pharmacist · Customer"
//           />
//           <MetricCard
//             icon={Activity}
//             value="Real‑time"
//             label="Stock & order tracking"
//           />
//           <MetricCard
//             icon={Clock}
//             value="< 30 sec"
//             label="Average order entry time"
//           />
//         </div>
//       </section>

//       {/* How it works */}
//       <section
//         className="container py-5 px-3"
//         style={{ maxWidth: 1100 }}
//         id="how-it-works"
//       >
//         <div className="row g-4 align-items-center">
//           <div className="col-md-6">
//             <h2 className="fw-semibold fs-4 mb-2">
//               How Smart Pharmacy System fits your day
//             </h2>
//             <p className="text-muted fs-6 mb-3">
//               Digitize your front counter, dispensary and back‑office in three
//               simple steps.
//             </p>
//             <ol className="text-muted ps-3">
//               <li className="mb-2">
//                 Patients upload prescriptions or place medicine orders online.
//               </li>
//               <li className="mb-2">
//                 Pharmacists verify, dispense and update stock in real time.
//               </li>
//               <li className="mb-2">
//                 Payments, invoices and reports are generated automatically for
//                 admins.
//               </li>
//             </ol>
//           </div>
//           <div className="col-md-6">
//             <div className="row g-3">
//               <div className="col-6">
//                 <img
//                   src={pharmacyDashboard}
//                   alt="Admin and pharmacist dashboards"
//                   className="img-fluid rounded-3 shadow-sm"
//                 />
//               </div>
//               <div className="col-6 d-flex flex-column gap-3">
//                 <img
//                   src={pharmacyMobile}
//                   alt="Customer mobile view"
//                   className="img-fluid rounded-3 shadow-sm"
//                 />
//                 <div className="bg-white rounded-3 shadow-sm p-2 small text-muted">
//                   One system for web and mobile — no separate apps required.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Role-based dashboards */}
//       <section
//         id="roles"
//         className="container py-5 px-3 text-center"
//         style={{ maxWidth: 1100 }}
//       >
//         <h2 className="fw-semibold fs-4 mb-2">Role‑based dashboards</h2>
//         <p className="text-muted fs-6 mb-4">
//           Interfaces tailored to the daily needs of each user in the pharmacy.
//         </p>
//         <div className="row row-cols-1 row-cols-md-3 g-4">
//           <RoleCard
//             title="Admin console"
//             description="Central control for owners and managers. Monitor performance, users and operational risk."
//             features={[
//               "Configure user roles and permissions.",
//               "View revenue, order volume and medicine statistics.",
//               "Audit logs for prescription and status changes.",
//             ]}
//           />
//           <RoleCard
//             title="Pharmacist workspace"
//             description="Streamlined view for processing prescriptions, stock and patient interactions."
//             features={[
//               "See uploaded prescriptions with patient details.",
//               "Check appointment schedule and doctor availability.",
//               "Update stock, expiry and dispensing status in real time.",
//             ]}
//           />
//           <RoleCard
//             title="Customer portal"
//             description="Simple and secure way for patients to engage with your pharmacy digitally."
//             features={[
//               "Upload prescriptions and view fulfillment status.",
//               "Book and manage doctor appointments.",
//               "Track orders, payments and wallet balance.",
//             ]}
//           />
//         </div>
//       </section>

//       {/* Features */}
//       <section
//         id="features"
//         className="container py-5 px-3 bg-light"
//         style={{ maxWidth: 1100 }}
//       >
//         <h2 className="fw-semibold fs-4 mb-2 text-center">Core modules</h2>
//         <p className="text-muted fs-6 mb-4 text-center">
//           Built to match the core processes of real‑world retail and clinical
//           pharmacies.
//         </p>
//         <div className="row row-cols-1 row-cols-md-3 g-4">
//           <FeatureCard
//             title="Inventory & stock control"
//             points={[
//               "Track batch numbers, expiries and stock levels.",
//               "Low‑stock alerts for critical medicines.",
//               "Supplier and purchase order records.",
//             ]}
//           />
//           <FeatureCard
//             title="Orders, billing & payments"
//             points={[
//               "Cart‑based ordering with shipping details.",
//               "Supports COD, Khalti and Stripe payments.",
//               "Automatic invoice and receipt generation.",
//             ]}
//           />
//           <FeatureCard
//             title="Clinical workflows"
//             points={[
//               "Prescription upload and verification pipeline.",
//               "Doctor appointment scheduling and follow‑up.",
//               "Patient history for safer dispensing decisions.",
//             ]}
//           />
//         </div>
//       </section>

//       {/* Workflow */}
//       <section
//         id="workflow"
//         className="container py-5 px-3"
//         style={{ maxWidth: 900 }}
//       >
//         <h2 className="fw-semibold fs-4 mb-2 text-center">
//           Typical daily workflow
//         </h2>
//         <p className="text-muted fs-6 mb-4 text-center">
//           Reflecting how pharmacists, doctors and patients work together in
//           practice.
//         </p>
//         <div className="row row-cols-1 row-cols-md-3 g-4">
//           <WorkflowStep
//             step="1"
//             title="Patient intake"
//             items={[
//               "Customer signs in or registers.",
//               "Uploads prescription or selects medicines.",
//               "Chooses pickup or delivery and payment option.",
//             ]}
//           />
//           <WorkflowStep
//             step="2"
//             title="Dispensing & review"
//             items={[
//               "Pharmacist validates prescription and stock.",
//               "Doctor consulted for clarifications where needed.",
//               "Order prepared, labeled and marked ready.",
//             ]}
//           />
//           <WorkflowStep
//             step="3"
//             title="Fulfillment & analytics"
//             items={[
//               "Customer notified and completes payment if pending.",
//               "Order history stored for future visits.",
//               "Admin reviews dashboards and exportable reports.",
//             ]}
//           />
//         </div>
//       </section>

//       {/* AD 2 - Before bottom CTA */}
//       <motion.section
//         className="container my-4"
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div
//           className="card shadow-lg border-0 overflow-hidden"
//           style={{
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             color: "white",
//           }}
//         >
//           <div className="card-body p-4">
//             <div className="row align-items-center g-3">
//               <div className="col-md-3">
//                 <div
//                   className="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center mx-auto"
//                   style={{ width: "80px", height: "80px" }}
//                 >
//                   🩺
//                 </div>
//               </div>
//               <div className="col-md-6">
//                 <h5 className="fw-bold mb-1">Doctor Consultations Available</h5>
//                 <p className="mb-0 opacity-90 small">
//                   Book online with certified doctors. Available 24/7 for
//                   prescription refills and health advice.
//                 </p>
//               </div>
//               <div className="col-md-3 text-md-end">
//                 <button className="btn btn-light btn-sm px-4">
//                   Book Appointment
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.section>

//       {/* Bottom CTA - No buttons here anymore */}

//       {/* NO FOOTER HERE - RootLayout provides it */}
//     </div>
//   );
// };

// // Component definitions (unchanged)
// const RoleCard = ({ title, description, features }) => (
//   <motion.div
//     className="bg-white rounded-3 shadow p-4 text-secondary h-100"
//     whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(15,23,42,0.12)" }}
//   >
//     <h3 className="fs-5 fw-semibold text-dark mb-3">{title}</h3>
//     <p>{description}</p>
//     <ul className="ps-3 mb-0">
//       {features.map((feat, idx) => (
//         <li key={idx}>{feat}</li>
//       ))}
//     </ul>
//   </motion.div>
// );

// const FeatureCard = ({ title, points }) => (
//   <motion.div
//     className="bg-white rounded-3 shadow-sm p-4 h-100"
//     whileHover={{ y: -3 }}
//   >
//     <h3 className="fs-6 fw-semibold mb-3">{title}</h3>
//     <ul className="ps-3 mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
//       {points.map((p, i) => (
//         <li key={i}>{p}</li>
//       ))}
//     </ul>
//   </motion.div>
// );

// const WorkflowStep = ({ step, title, items }) => (
//   <motion.div
//     className="bg-white rounded-3 shadow-sm p-4 h-100"
//     whileHover={{ y: -3 }}
//   >
//     <div className="d-flex align-items-center gap-2 mb-2">
//       <span className="badge bg-primary rounded-circle">{step}</span>
//       <h3 className="fs-6 fw-semibold mb-0">{title}</h3>
//     </div>
//     <ul className="ps-3 mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
//       {items.map((it, i) => (
//         <li key={i}>{it}</li>
//       ))}
//     </ul>
//   </motion.div>
// );

// const MetricCard = ({ icon: Icon, value, label }) => (
//   <div className="col d-flex flex-column align-items-center gap-1">
//     <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-1">
//       <Icon size={20} className="text-primary m-2" />
//     </div>
//     <div className="fw-semibold">{value}</div>
//     <div className="text-muted small">{label}</div>
//   </div>
// );

// export default Home;

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import {
//   ShieldCheck,
//   Users,
//   Activity,
//   Clock,
//   ChevronRight,
// } from "lucide-react";

// const Home = () => {
//   const navigate = useNavigate();
//   const [isMobile, setIsMobile] = useState(false);
//   const [currentAd, setCurrentAd] = useState(0);

//   // Rotating ad content
//   const ads = [
//     {
//       img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
//       title: "💊 20% OFF Chronic Prescriptions",
//       desc: "Diabetes, hypertension, cholesterol meds. Valid through Dec 31st.",
//       btnText: "Shop Now",
//       btnColor: "btn-success",
//     },
//     {
//       img: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=400&q=80",
//       title: "🩺 Free Flu Vaccine This Week",
//       desc: "Walk-ins welcome. No appointment needed for seasonal vaccines.",
//       btnText: "Book Now",
//       btnColor: "btn-primary",
//     },
//   ];

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Auto-rotate ads every 10 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentAd((prev) => (prev + 1) % ads.length);
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [ads.length]);

//   return (
//     <div
//       className="d-flex flex-column min-vh-100 bg-light text-dark fade-in"
//       style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//     >
//       {/* Top navigation */}
//       <header className="d-flex justify-content-between align-items-center px-4 py-3 bg-white shadow-sm sticky-top z-3">
//         <div className="d-flex align-items-center gap-2">
//           <div
//             className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
//             style={{ width: 40, height: 40, fontSize: "1.2rem" }}
//           >
//             💊
//           </div>
//           <div>
//             <div className="fw-bold fs-5 mb-0 text-primary">Smart Pharmacy</div>
//             <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
//               Clinical‑grade management system
//             </div>
//           </div>
//         </div>
//         <nav className="d-none d-md-flex gap-3 align-items-center">
//           {[
//             { label: "Features", id: "features" },
//             { label: "Dashboards", id: "roles" },
//             { label: "Workflow", id: "workflow" },
//           ].map((section) => (
//             <button
//               key={section.id}
//               className="btn btn-link text-decoration-none text-secondary fw-medium px-2"
//               onClick={() => {
//                 const el = document.getElementById(section.id);
//                 if (el) el.scrollIntoView({ behavior: "smooth" });
//               }}
//             >
//               {section.label}
//             </button>
//           ))}
//         </nav>
//         <div className="d-flex gap-2">
//           <button
//             className="btn btn-outline-primary rounded-pill px-4 btn-sm"
//             onClick={() => navigate("/login")}
//           >
//             Log in
//           </button>
//           <button
//             className="btn btn-primary rounded-pill px-4 btn-sm"
//             onClick={() => navigate("/register")}
//           >
//             Get started
//           </button>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <motion.section
//         className="container py-5"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7 }}
//       >
//         <div className="row align-items-center gy-5">
//           <div className="col-lg-6">
//             <span className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill">
//               🏥 Trusted by 500+ Pharmacies
//             </span>
//             <h1 className="display-4 fw-bold mb-4 text-dark lh-sm">
//               End‑to‑end pharmacy management in one{" "}
//               <span className="text-primary">secure platform</span>.
//             </h1>
//             <p className="lead text-muted mb-5">
//               From prescription intake to dispensing, inventory, billing and
//               doctor appointments — bring every workflow into a single,
//               compliant system with real‑time visibility.
//             </p>

//             <div className="d-flex gap-3 flex-wrap">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm"
//                 onClick={() => navigate("/register")}
//               >
//                 Start Free Trial
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="btn btn-white border btn-lg rounded-pill px-5 shadow-sm"
//                 onClick={() => navigate("/login")}
//               >
//                 Login
//               </motion.button>
//             </div>

//             <div className="mt-5 d-flex gap-4 text-muted small">
//               <div className="d-flex align-items-center gap-2">
//                 <ShieldCheck className="text-success" size={18} />
//                 <span>HIPAA Compliant</span>
//               </div>
//               <div className="d-flex align-items-center gap-2">
//                 <Activity className="text-primary" size={18} />
//                 <span>99.9% Uptime</span>
//               </div>
//               <div className="d-flex align-items-center gap-2">
//                 <Users className="text-info" size={18} />
//                 <span>Multi-User Support</span>
//               </div>
//             </div>
//           </div>

//           <div className="col-lg-6">
//             <div className="position-relative">
//               <div
//                 className="position-absolute top-0 end-0 bg-warning rounded-circle p-3 shadow-lg z-2 d-none d-lg-block"
//                 style={{ marginTop: "-20px", marginRight: "-20px" }}
//               >
//                 <Clock className="text-white" size={32} />
//               </div>
//               <img
//                 src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80"
//                 alt="Pharmacist working"
//                 className="img-fluid rounded-4 shadow-lg w-100"
//                 style={{ objectFit: "cover", minHeight: "400px" }}
//               />
//               <motion.div
//                 className="position-absolute bottom-0 start-0 bg-white p-3 rounded-4 shadow m-4 d-flex align-items-center gap-3"
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//               >
//                 <div className="bg-success bg-opacity-10 p-2 rounded-circle">
//                   <Activity className="text-success" size={24} />
//                 </div>
//                 <div>
//                   <div className="fw-bold">Orders Processed</div>
//                   <div className="small text-muted">1,240 Today</div>
//                 </div>
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </motion.section>

//       {/* Metrics Strip */}
//       <div className="bg-white py-4 border-top border-bottom">
//         <div className="container">
//           <div className="row g-4 text-center">
//             <MetricCard
//               icon={ShieldCheck}
//               value="Secure"
//               label="Data Encryption"
//             />
//             <MetricCard
//               icon={Users}
//               value="3 Roles"
//               label="Admin · Pharmacist · User"
//             />
//             <MetricCard
//               icon={Activity}
//               value="Real-time"
//               label="Inventory Sync"
//             />
//             <MetricCard icon={Clock} value="< 30s" label="Order Entry Time" />
//           </div>
//         </div>
//       </div>

//       {/* AD 1 - Rotating Banner */}
//       <motion.section
//         className="container my-5"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//       >
//         <div className="card border-0 shadow-sm overflow-hidden bg-white rounded-4">
//           <div className="card-body p-0">
//             <div className="row g-0 align-items-center">
//               <div className="col-md-4">
//                 <motion.img
//                   key={`ad-img-${currentAd}`}
//                   src={ads[currentAd].img}
//                   alt="Offer"
//                   className="img-fluid h-100 object-fit-cover w-100"
//                   style={{ minHeight: "200px" }}
//                   initial={{ opacity: 0.5 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.5 }}
//                 />
//               </div>
//               <div className="col-md-8 p-4 p-lg-5">
//                 <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//                   <div>
//                     <h3 className="fw-bold mb-2">{ads[currentAd].title}</h3>
//                     <p className="text-muted mb-0 fs-5">
//                       {ads[currentAd].desc}
//                     </p>
//                   </div>
//                   <button
//                     className={`btn ${ads[currentAd].btnColor} btn-lg rounded-pill px-4 shadow-sm`}
//                   >
//                     {ads[currentAd].btnText}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.section>

//       {/* How It Works */}
//       <section id="how-it-works" className="container py-5">
//         <div className="row g-5 align-items-center">
//           <div className="col-lg-5 order-lg-2">
//             <div className="d-flex flex-column gap-3">
//               <img
//                 src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
//                 alt="Dashboard"
//                 className="img-fluid rounded-4 shadow-sm"
//               />
//               <img
//                 src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80"
//                 alt="Mobile App"
//                 className="img-fluid rounded-4 shadow-sm w-75 align-self-end"
//                 style={{ marginTop: "-50px", border: "5px solid white" }}
//               />
//             </div>
//           </div>
//           <div className="col-lg-7 order-lg-1">
//             <h2 className="fw-bold display-6 mb-4">Seamless Workflow</h2>
//             <div className="d-flex flex-column gap-4">
//               <WorkflowItem
//                 step={1}
//                 title="Upload & Order"
//                 desc="Patients upload prescriptions securely or browse the medicine catalog to place orders."
//               />
//               <WorkflowItem
//                 step={2}
//                 title="Verify & Dispense"
//                 desc="Pharmacists receive alerts, verify prescriptions with doctors, and process the dispensing."
//               />
//               <WorkflowItem
//                 step={3}
//                 title="Track & Deliver"
//                 desc="Real-time updates are sent to patients. Inventory is auto-deducted upon completion."
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Role Dashboards */}
//       <section id="roles" className="bg-light py-5">
//         <div className="container">
//           <div className="text-center mb-5">
//             <h2 className="fw-bold">Tailored for Every Role</h2>
//             <p className="text-muted">
//               Dedicated interfaces to maximize efficiency for everyone.
//             </p>
//           </div>
//           <div className="row g-4">
//             <RoleCard
//               title="Admin Console"
//               desc="Full oversight of revenue, inventory, users, and audit logs."
//               icon="⚡"
//             />
//             <RoleCard
//               title="Pharmacist Panel"
//               desc="Fast order processing, stock checks, and doctor coordination."
//               icon="💊"
//             />
//             <RoleCard
//               title="Patient App"
//               desc="Easy ordering, history tracking, and appointment booking."
//               icon="📱"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Core Features */}
//       <section id="features" className="container py-5">
//         <h2 className="fw-bold text-center mb-5">Everything You Need</h2>
//         <div className="row g-4">
//           <FeatureCard
//             title="Smart Inventory"
//             points={["Batch tracking", "Expiry alerts", "Auto-reorder"]}
//           />
//           <FeatureCard
//             title="Clinical Tools"
//             points={["Interaction checks", "Patient history", "Doctor notes"]}
//           />
//           <FeatureCard
//             title="Billing & Payments"
//             points={["Stripe & Khalti", "Invoicing", "Insurance logs"]}
//           />
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="container mb-5">
//         <div className="bg-primary rounded-4 p-5 text-center text-white shadow-lg position-relative overflow-hidden">
//           <div className="position-relative z-2">
//             <h2 className="fw-bold mb-3">Ready to modernize your pharmacy?</h2>
//             <p className="lead mb-4 opacity-75">
//               Join hundreds of pharmacies using our system today.
//             </p>
//             <button
//               className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-primary"
//               onClick={() => navigate("/register")}
//             >
//               Get Started Now
//             </button>
//           </div>
//           <div
//             className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-10"
//             style={{ transform: "skewY(-10deg) scale(1.5)" }}
//           ></div>
//         </div>
//       </section>
//     </div>
//   );
// };

// // --- Sub Components ---

// const MetricCard = ({ icon: Icon, value, label }) => (
//   <div className="col-6 col-md-3">
//     <div className="d-flex flex-column align-items-center">
//       <div className="bg-primary bg-opacity-10 p-3 rounded-circle mb-2 text-primary">
//         <Icon size={24} />
//       </div>
//       <h5 className="fw-bold mb-0">{value}</h5>
//       <small className="text-muted">{label}</small>
//     </div>
//   </div>
// );

// const WorkflowItem = ({ step, title, desc }) => (
//   <div className="d-flex gap-3">
//     <div className="flex-shrink-0">
//       <div
//         className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
//         style={{ width: 40, height: 40 }}
//       >
//         {step}
//       </div>
//     </div>
//     <div>
//       <h5 className="fw-bold mb-1">{title}</h5>
//       <p className="text-muted mb-0">{desc}</p>
//     </div>
//   </div>
// );

// const RoleCard = ({ title, desc, icon }) => (
//   <div className="col-md-4">
//     <motion.div
//       className="card h-100 border-0 shadow-sm p-4 text-center"
//       whileHover={{ y: -5 }}
//     >
//       <div className="fs-1 mb-3">{icon}</div>
//       <h4 className="fw-bold mb-2">{title}</h4>
//       <p className="text-muted mb-0">{desc}</p>
//     </motion.div>
//   </div>
// );

// const FeatureCard = ({ title, points }) => (
//   <div className="col-md-4">
//     <div className="card h-100 border p-4 bg-light">
//       <h5 className="fw-bold mb-3">{title}</h5>
//       <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
//         {points.map((p, i) => (
//           <li key={i} className="d-flex align-items-center gap-2 text-muted">
//             <ChevronRight size={14} className="text-primary" /> {p}
//           </li>
//         ))}
//       </ul>
//     </div>
//   </div>
// );

// export default Home;

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Search,
  Truck,
  Pill,
  HeartPulse,
  Stethoscope,
  BadgeCheck,
  Star,
  ArrowRight,
  CheckCircle2,
  Clock,
  Package,
  CreditCard,
  UserPlus,
  PhoneCall,
  HelpCircle,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // FAQ State
  const [faqSearch, setFaqSearch] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) navigate("/login");
  };

  // Professional FAQ Data tailored to your platform
  const faqs = [
    {
      q: "How do I transfer my prescription?",
      a: "Create a free account, provide your current pharmacy details or doctor's information, and we will handle the entire transfer process for you automatically.",
    },
    {
      q: "How long does delivery take?",
      a: "We offer free standard 2-day delivery on all active orders. You can track your order status directly from your Patient Portal.",
    },
    {
      q: "Is my medical data secure?",
      a: "Absolutely. Our platform is fully HIPAA-compliant, utilizing end-to-end data encryption. Your privacy and medical history are strictly protected.",
    },
    {
      q: "How do I contact support?",
      a: "You can use the 'Send a Message' feature in the footer of your dashboard. To ensure utmost privacy, all support messages are automatically and permanently deleted after 48 hours.",
    },
    {
      q: "Do you accept my insurance?",
      a: "We accept most major insurance plans including Medicare, Aetna, Cigna, and BlueCross. You can add your insurance details to your profile to see your exact copay before ordering.",
    },
    {
      q: "What happens if a medicine is out of stock?",
      a: "If a medication is critically low, our system alerts the admin to restock immediately. If your specific order is affected, our pharmacists will notify you and can coordinate with your doctor for a suitable alternative.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.a.toLowerCase().includes(faqSearch.toLowerCase()),
  );

  return (
    <div
      className="d-flex flex-column min-vh-100 bg-light text-dark"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* 1. TOP PROMO BANNER */}
      <div className="bg-primary text-white text-center py-2 px-3 small fw-medium">
        <span className="badge bg-white text-primary me-2">UPDATE</span>
        We now accept most major insurance plans, including Medicare.
        <span
          className="text-decoration-underline ms-2 cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Check your coverage
        </span>
      </div>

      {/* 2. PROFESSIONAL NAVBAR */}
      <header className="bg-white shadow-sm sticky-top z-3 border-bottom border-light-subtle">
        <div className="container-fluid px-4 py-3 d-flex justify-content-between align-items-center gap-3">
          {/* Logo */}
          <div
            className="d-flex align-items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-primary text-white rounded p-2 d-flex align-items-center justify-content-center shadow-sm">
              <Pill size={24} />
            </div>
            <div className="d-none d-sm-block">
              <div
                className="fw-black fs-5 lh-1 text-dark"
                style={{ letterSpacing: "-0.5px" }}
              >
                SmartPharmacy
              </div>
              <div
                className="text-primary fw-bold"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Clinical Care
              </div>
            </div>
          </div>

          {/* Central Search */}
          <form
            onSubmit={handleSearch}
            className="flex-grow-1 max-w-2xl d-none d-md-flex align-items-center bg-light border border-light-subtle rounded-pill px-2 py-1 focus-ring-primary transition-all"
          >
            <Search className="text-muted ms-2 me-2" size={18} />
            <input
              type="text"
              className="form-control border-0 bg-transparent shadow-none"
              placeholder="Search medications, conditions, or vitamins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary rounded-pill fw-bold px-4 py-2 text-uppercase"
              style={{ fontSize: "0.8rem" }}
            >
              Search
            </button>
          </form>

          {/* Auth Actions */}
          <div className="d-flex gap-2 align-items-center flex-shrink-0">
            <button
              className="btn btn-link text-decoration-none text-dark fw-bold d-none d-lg-block hover-primary"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
            <button
              className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm hover-lift d-flex align-items-center gap-2"
              onClick={() => navigate("/register")}
            >
              <UserPlus size={16} /> Get Started
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="bg-white overflow-hidden position-relative pt-5 pb-5">
        <div className="container position-relative z-2">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6 pe-lg-5 text-center text-lg-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill mb-4 fw-bold">
                  <Star size={14} className="me-1 mb-1 fill-success" /> #1 Rated
                  Online Pharmacy
                </div>
                <h1
                  className="display-3 fw-black text-dark lh-sm mb-4"
                  style={{ letterSpacing: "-1px" }}
                >
                  Your medication, <br />
                  <span className="text-primary">delivered directly</span>{" "}
                  <br />
                  to your door.
                </h1>
                <p className="fs-5 text-muted mb-5 pe-lg-4">
                  Transparent pricing, free 2-day delivery, and 24/7 access to
                  licensed pharmacists. We make managing your health effortless.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                  <button
                    className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-lg hover-lift"
                    onClick={() => navigate("/register")}
                  >
                    Transfer a Prescription
                  </button>
                  <button
                    className="btn btn-outline-dark btn-lg rounded-pill px-5 fw-bold hover-lift"
                    onClick={() => navigate("/login")}
                  >
                    Browse Medications
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="col-lg-6 position-relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="position-absolute top-0 start-0 translate-middle-y bg-white rounded-4 p-3 shadow-lg z-3 border border-light-subtle d-none d-md-flex align-items-center gap-3 ms-4 mt-4">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <div className="fw-bolder text-dark small text-uppercase tracking-wider">
                      Secure & Private
                    </div>
                    <div className="small text-muted fw-medium">
                      HIPAA Compliant Platform
                    </div>
                  </div>
                </div>

                <img
                  src="https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80"
                  alt="Pharmacist organizing medication"
                  className="img-fluid rounded-5 shadow-lg w-100 object-fit-cover border border-4 border-white"
                  style={{ height: "500px" }}
                />

                <motion.div
                  className="position-absolute bottom-0 end-0 bg-white p-3 rounded-4 shadow-lg z-3 border border-light-subtle me-md-4 mb-4 d-flex flex-column gap-1"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <div className="text-muted small fw-bold text-uppercase">
                    Generic Atorvastatin
                  </div>
                  <div className="d-flex align-items-end gap-2">
                    <span className="text-decoration-line-through text-muted small">
                      Rs. 3500
                    </span>
                    <span className="fw-black text-success fs-4">Rs. 400</span>
                  </div>
                  <div className="badge bg-success bg-opacity-10 text-success mt-1">
                    You save 88%
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUST & INSURANCE STRIP */}
      <div className="bg-white border-top border-bottom border-light-subtle py-4">
        <div className="container text-center">
          <p className="text-muted small fw-bold text-uppercase tracking-wider mb-4">
            Trusted by Doctors & Compatible with Major Insurance
          </p>
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 gap-md-5 opacity-50 grayscale">
            <h4 className="fw-black m-0 text-secondary">Aetna</h4>
            <h4 className="fw-black m-0 text-secondary">Cigna</h4>
            <h4 className="fw-black m-0 text-secondary">UnitedHealthcare</h4>
            <h4 className="fw-black m-0 text-secondary">BlueCross</h4>
            <h4 className="fw-black m-0 text-secondary">Medicare</h4>
          </div>
        </div>
      </div>

      {/* 5. SHOP BY CATEGORY */}
      <section className="container py-5 my-4">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <h3 className="fw-black text-dark mb-0">Shop by Category</h3>
          <span
            className="text-primary fw-bold cursor-pointer hover-primary d-none d-sm-block"
            onClick={() => navigate("/login")}
          >
            View all <ArrowRight size={16} />
          </span>
        </div>
        <div className="row g-4">
          <CategoryCard
            title="Daily Prescriptions"
            icon={Pill}
            color="primary"
            img="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=400&q=80"
          />
          <CategoryCard
            title="Online Consults"
            icon={Stethoscope}
            color="success"
            img="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80"
          />
          <CategoryCard
            title="Vitamins & OTC"
            icon={HeartPulse}
            color="warning"
            img="https://images.unsplash.com/photo-1643321522066-6b225574044c?auto=format&fit=crop&w=400&q=80"
          />
          <CategoryCard
            title="First Aid & Care"
            icon={Package}
            color="danger"
            img="https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=400&q=80"
          />
        </div>
      </section>

      {/* 6. TRANSPARENT PRICING SHOWCASE */}
      <section className="bg-dark text-white py-5">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <h2 className="display-6 fw-black mb-4">
                Pricing that actually makes sense.
              </h2>
              <p className="fs-5 text-light opacity-75 mb-4">
                We cut out the middlemen so you pay less. Whether you use
                insurance or pay out-of-pocket, we always show you the lowest
                possible price before you check out.
              </p>
              <ul className="list-unstyled d-flex flex-column gap-3 mb-4">
                <li className="d-flex align-items-center gap-3 fs-5">
                  <CheckCircle2 className="text-success" /> No hidden membership
                  fees
                </li>
                <li className="d-flex align-items-center gap-3 fs-5">
                  <CheckCircle2 className="text-success" /> Free standard
                  delivery
                </li>
                <li className="d-flex align-items-center gap-3 fs-5">
                  <CheckCircle2 className="text-success" /> Automatic refill
                  management
                </li>
              </ul>
              <button
                className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold"
                onClick={() => navigate("/login")}
              >
                Check Medication Prices
              </button>
            </div>

            <div className="col-lg-6 offset-lg-1">
              <div className="bg-white rounded-4 p-1 shadow-lg">
                <div className="bg-light rounded-3 p-4">
                  <h5 className="text-dark fw-bold mb-4 border-bottom border-light-subtle pb-3">
                    Popular Generics Pricing
                  </h5>
                  <PriceRow
                    name="Lisinopril (Blood Pressure)"
                    retail="Rs. 2200"
                    ourPrice="Rs. 350"
                  />
                  <PriceRow
                    name="Escitalopram (Anxiety)"
                    retail="Rs. 3800"
                    ourPrice="Rs. 500"
                  />
                  <PriceRow
                    name="Metformin (Cholesterol)"
                    retail="Rs. 1800"
                    ourPrice="Rs. 300"
                  />
                  <PriceRow
                    name="Sertraline (Depression)"
                    retail="Rs. 4200"
                    ourPrice="Rs. 600"
                  />
                  <div className="text-center mt-4">
                    <span
                      className="text-primary fw-bold cursor-pointer small"
                      onClick={() => navigate("/login")}
                    >
                      Search all 10,000+ medications
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section id="workflow" className="container py-5 my-5">
        <div className="text-center mb-5">
          <h2 className="fw-black display-6 text-dark mb-3">
            Switching takes less than 2 minutes.
          </h2>
          <p className="text-muted fs-5">
            We handle the stressful parts. You just sit back and relax.
          </p>
        </div>

        <div className="row g-4 position-relative">
          <div className="col-md-4">
            <StepCard
              step="1"
              title="Create your profile"
              desc="Sign up, add your basic info, and input your insurance details if you have them."
              icon={UserPlus}
            />
          </div>
          <div className="col-md-4">
            <StepCard
              step="2"
              title="We do the work"
              desc="Give us your doctor's name or current pharmacy. We’ll contact them to transfer your Rx."
              icon={Stethoscope}
            />
          </div>
          <div className="col-md-4">
            <StepCard
              step="3"
              title="Fast, free delivery"
              desc="Once approved, our pharmacists review your order and ship it directly to your home."
              icon={Truck}
            />
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="bg-white py-5 border-top border-light-subtle">
        <div className="container py-4" style={{ maxWidth: "850px" }}>
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center justify-content-center p-3 bg-primary bg-opacity-10 text-primary rounded-circle mb-3 shadow-sm">
              <HelpCircle size={32} />
            </div>
            <h2 className="fw-black display-6 text-dark mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-muted fs-5">
              Find answers to the most common questions about Smart Pharmacy.
            </p>

            <div
              className="position-relative mt-4 mx-auto shadow-sm rounded-pill focus-ring-primary"
              style={{ maxWidth: "500px" }}
            >
              <Search
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                size={20}
              />
              <input
                type="text"
                className="form-control form-control-lg ps-5 rounded-pill border border-light-subtle bg-light"
                placeholder="Search for answers..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex flex-column gap-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-5 text-muted fw-medium">
                No results found for "{faqSearch}".
              </div>
            ) : (
              filteredFaqs.map((item, index) => (
                <div
                  key={index}
                  className={`border rounded-4 overflow-hidden transition-all ${activeFaq === index ? "border-primary shadow-sm" : "border-light-subtle"}`}
                >
                  <button
                    className={`w-100 border-0 p-4 d-flex justify-content-between align-items-center text-start fw-bold transition-all ${activeFaq === index ? "bg-primary bg-opacity-10 text-primary" : "bg-white text-dark hover-bg-light"}`}
                    onClick={() =>
                      setActiveFaq(activeFaq === index ? null : index)
                    }
                  >
                    <span className="pe-3 fs-6">{item.q}</span>
                    <ChevronDown
                      size={20}
                      className={`transition-all flex-shrink-0 ${activeFaq === index ? "rotate-180 text-primary" : "text-muted"}`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 bg-primary bg-opacity-10"
                      >
                        <p className="text-dark opacity-75 mb-0 fw-medium lh-lg pt-2 border-top border-primary border-opacity-25">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>

          {/* Contact Support CTA */}
          <div className="mt-5 text-center bg-light p-5 rounded-4 border border-light-subtle shadow-sm">
            <MessageCircle size={32} className="text-primary mb-3" />
            <h4 className="fw-black text-dark mb-2">Still have questions?</h4>
            <p className="text-muted mb-4">
              Can't find the answer you're looking for? Log in to chat directly
              with our licensed pharmacists.
            </p>
            <button
              className="btn btn-dark rounded-pill px-5 fw-bold shadow-sm hover-lift"
              onClick={() => navigate("/login")}
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="bg-light py-5 border-top border-light-subtle mb-5">
        <div className="container py-4">
          <h3 className="fw-black text-center mb-5">
            Don't just take our word for it.
          </h3>
          <div className="row g-4">
            <TestimonialCard
              text="I was paying Rs. 4500 a month for my blood pressure medication at my local pharmacy. Here, I pay Rs. 400. Plus, I don't have to wait in line anymore."
              author="Sarah M."
              location="Verified Patient"
            />
            <TestimonialCard
              text="The app is incredibly easy to use. I get a notification when my refill is due, click one button, and it shows up at my door two days later."
              author="James T."
              location="Verified Patient"
            />
            <TestimonialCard
              text="Being able to message a pharmacist at 10 PM to ask about a drug interaction gave me so much peace of mind. Fantastic service."
              author="Elena R."
              location="Verified Patient"
            />
          </div>
        </div>
      </section>

      {/* Global Custom CSS */}
      <style>{`
        .fw-black { font-weight: 900; }
        .tracking-tight { letter-spacing: -0.04em; }
        .tracking-wider { letter-spacing: 0.05em; }
        .transition-all { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important; }
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .hover-primary:hover { color: #2563eb !important; }
        .cursor-pointer { cursor: pointer; }
        .rotate-180 { transform: rotate(180deg); }
        .focus-ring-primary:focus-within { border-color: #2563eb !important; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important; }
        .max-w-2xl { max-width: 42rem; }
        .grayscale { filter: grayscale(100%); }
      `}</style>
    </div>
  );
};

// --- Sub Components ---

const CategoryCard = ({ title, icon: Icon, color, img }) => (
  <div className="col-6 col-lg-3">
    <motion.div
      whileHover={{ y: -5 }}
      className="card border-0 rounded-4 overflow-hidden shadow-sm h-100 cursor-pointer text-decoration-none text-dark"
    >
      <div className="position-relative" style={{ height: "120px" }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25 z-1"></div>
        <img src={img} alt={title} className="w-100 h-100 object-fit-cover" />
        <div
          className={`position-absolute top-50 start-50 translate-middle z-2 bg-white text-${color} p-3 rounded-circle shadow`}
        >
          <Icon size={24} />
        </div>
      </div>
      <div className="card-body text-center p-3">
        <h6 className="fw-bold mb-0">{title}</h6>
      </div>
    </motion.div>
  </div>
);

const PriceRow = ({ name, retail, ourPrice }) => (
  <div className="d-flex justify-content-between align-items-center border-bottom border-light-subtle pb-3 mb-3 last-child-no-border">
    <div className="fw-semibold text-dark">{name}</div>
    <div className="d-flex align-items-center gap-3">
      <div className="text-muted small text-decoration-line-through d-none d-sm-block">
        Retail: {retail}
      </div>
      <div className="fw-black text-success fs-5">{ourPrice}</div>
    </div>
  </div>
);

const StepCard = ({ step, title, desc, icon: Icon }) => (
  <motion.div
    className="bg-white p-4 rounded-4 shadow-sm border border-light-subtle h-100 text-center"
    whileHover={{ y: -5 }}
  >
    <div
      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4 shadow"
      style={{ width: 60, height: 60 }}
    >
      <Icon size={28} />
    </div>
    <h5 className="fw-bold mb-2">
      Step {step}: {title}
    </h5>
    <p className="text-muted small mb-0">{desc}</p>
  </motion.div>
);

const TestimonialCard = ({ text, author, location }) => (
  <div className="col-md-4">
    <div className="bg-white p-4 rounded-4 shadow-sm border border-light-subtle h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="text-warning mb-3 d-flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={16} fill="currentColor" />
          ))}
        </div>
        <p className="text-dark fst-italic mb-4">"{text}"</p>
      </div>
      <div className="d-flex align-items-center gap-3 border-top border-light-subtle pt-3">
        <div
          className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
          style={{ width: 40, height: 40 }}
        >
          {author.charAt(0)}
        </div>
        <div>
          <div className="fw-bold text-dark small">{author}</div>
          <div className="text-success small fw-medium d-flex align-items-center gap-1">
            <ShieldCheck size={12} /> {location}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
