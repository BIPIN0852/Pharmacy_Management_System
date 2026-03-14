// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import DoctorSidebar from "./DoctorSidebar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import { Bell, UserCircle, Menu } from "lucide-react";
// import { useAuth } from "../context/AuthContext";

// const DoctorLayout = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // (Optional) Add unread notification state for doctors if you build a doctor messaging system later
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
//       <DoctorSidebar
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
//             {/* Left side: Mobile Menu Toggle & Title */}
//             <div className="d-flex align-items-center gap-3">
//               {isMobile && (
//                 <button
//                   className="btn btn-light p-2 border"
//                   onClick={() => setCollapsed(false)}
//                 >
//                   <Menu size={20} />
//                 </button>
//               )}
//               <div className={isMobile ? "d-none d-sm-block" : ""}>
//                 <h4 className="mb-0 fw-black text-dark tracking-tight">
//                   Clinical Portal
//                 </h4>
//                 <small className="text-muted fw-medium">
//                   Manage appointments & patients
//                 </small>
//               </div>
//             </div>

//             {/* Right Side Icons */}
//             <div className="d-flex align-items-center gap-3 gap-md-4">
//               {/* NOTIFICATION BELL */}
//               <button
//                 className="btn btn-white border border-light-subtle rounded-circle p-2 position-relative shadow-sm hover-lift transition-all"
//                 title="Notifications"
//               >
//                 <Bell size={20} className="text-dark" />
//                 {unreadCount > 0 && (
//                   <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white shadow-sm">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>

//               {/* Profile Info */}
//               <div
//                 className="d-flex align-items-center gap-3 border-start border-light-subtle ps-3 ps-md-4 cursor-pointer hover-opacity transition-all"
//                 onClick={() => navigate("/doctor/profile")}
//                 title="View Profile"
//               >
//                 <div
//                   className="text-end d-none d-md-block"
//                   style={{ lineHeight: "1.2" }}
//                 >
//                   <div className="fw-bold text-dark fs-6">
//                     Dr. {user?.name?.split(" ")[0] || "Provider"}
//                   </div>
//                   <small
//                     className="text-info fw-bold text-uppercase tracking-wider"
//                     style={{ fontSize: "0.65rem" }}
//                   >
//                     {user?.speciality || "General Physician"}
//                   </small>
//                 </div>

//                 {getProfileImage() ? (
//                   <img
//                     src={getProfileImage()}
//                     alt="Profile"
//                     className="rounded-circle object-fit-cover shadow-sm border border-2 border-info border-opacity-25"
//                     style={{ width: "40px", height: "40px" }}
//                   />
//                 ) : (
//                   <div
//                     className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center shadow-sm"
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
//           {/* BREADCRUMBS */}
//           <div className="mb-4">
//             <Breadcrumbs />
//           </div>

//           {/* Renders the specific page (DoctorDashboard, Patients, etc.) */}
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

//         .custom-scrollbar::-webkit-scrollbar { width: 8px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
//       `}</style>
//     </div>
//   );
// };

// export default DoctorLayout;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { Dropdown, Badge } from "react-bootstrap";
// import DoctorSidebar from "./DoctorSidebar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import {
//   Bell,
//   UserCircle,
//   Menu,
//   LogOut,
//   CalendarCheck,
//   CheckCircle2,
// } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import api from "../services/api";

// const DoctorLayout = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth(); // ✅ Added logout here
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

//   // --- Fetch Notifications (Pending Appointments) ---
//   const fetchNotifications = async () => {
//     try {
//       // Fetch doctor's appointments
//       const { data } = await api.get("/doctor/appointments");
//       const appointments = data.appointments || [];

//       const alerts = [];

//       // Find all pending appointments requiring approval
//       const pendingAppts = appointments.filter(
//         (a) => a.status?.toLowerCase() === "pending",
//       );

//       pendingAppts.forEach((app) => {
//         alerts.push({
//           id: `appt-pending-${app._id}`,
//           title: "New Appointment Request",
//           message: `${app.patient?.name || "A patient"} requested a visit on ${new Date(app.date).toLocaleDateString()}.`,
//           link: "/doctor/appointments",
//           icon: CalendarCheck,
//           color: "text-warning",
//         });
//       });

//       // ✅ SECURE LOCAL STORAGE FILTERING
//       // Grab the list of IDs the user has already clicked "Mark as read" on
//       const dismissedIds =
//         JSON.parse(localStorage.getItem("dismissedDoctorAlerts")) || [];

//       // Filter out any alerts that are in the dismissed list
//       const activeAlerts = alerts.filter(
//         (alert) => !dismissedIds.includes(alert.id),
//       );

//       setNotifications(activeAlerts);
//       setUnreadCount(activeAlerts.length);
//     } catch (error) {
//       console.error("Failed to fetch doctor notifications", error);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 15000); // Check every 15s
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ MARK ALL AS READ LOGIC
//   const handleClearNotifications = () => {
//     const currentIds = notifications.map((n) => n.id);
//     const previouslyDismissed =
//       JSON.parse(localStorage.getItem("dismissedDoctorAlerts")) || [];
//     const newDismissed = [...new Set([...previouslyDismissed, ...currentIds])];

//     localStorage.setItem("dismissedDoctorAlerts", JSON.stringify(newDismissed));

//     setNotifications([]);
//     setUnreadCount(0);
//   };

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
//       className="d-flex min-vh-100 bg-light"
//       style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
//     >
//       {/* 1. Sidebar */}
//       <DoctorSidebar
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
//             {/* Left side: Mobile Menu Toggle & Title */}
//             <div className="d-flex align-items-center gap-3">
//               {isMobile && (
//                 <button
//                   className="btn btn-light p-2 border"
//                   onClick={() => setCollapsed(false)}
//                 >
//                   <Menu size={20} />
//                 </button>
//               )}
//               <div className={isMobile ? "d-none d-sm-block" : ""}>
//                 <h4 className="mb-0 fw-black text-dark tracking-tight">
//                   Clinical Portal
//                 </h4>
//                 <small className="text-muted fw-medium">
//                   Manage appointments & patients
//                 </small>
//               </div>
//             </div>

//             {/* Right Side Icons */}
//             <div className="d-flex align-items-center gap-3 gap-md-4">
//               {/* ✅ DYNAMIC NOTIFICATION DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="btn btn-white border border-light-subtle rounded-circle p-2 position-relative shadow-sm hover-lift transition-all hide-caret d-flex align-items-center justify-content-center"
//                   style={{ width: "40px", height: "40px" }}
//                 >
//                   <Bell size={20} className="text-dark" />
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
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-2"
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
//                           No pending requests right now.
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

//               {/* ✅ DYNAMIC USER PROFILE DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="d-flex align-items-center gap-3 border-start border-light-subtle ps-3 ps-md-4 text-decoration-none hide-caret hover-opacity transition-all"
//                   style={{ outline: "none", boxShadow: "none" }}
//                 >
//                   <div
//                     className="text-end d-none d-md-block"
//                     style={{ lineHeight: "1.2" }}
//                   >
//                     <div className="fw-bold text-dark fs-6">
//                       Dr. {user?.name?.split(" ")[0] || "Provider"}
//                     </div>
//                     <small
//                       className="text-info fw-bold text-uppercase tracking-wider"
//                       style={{ fontSize: "0.65rem" }}
//                     >
//                       {user?.speciality || "General Physician"}
//                     </small>
//                   </div>

//                   {getProfileImage() ? (
//                     <img
//                       src={getProfileImage()}
//                       alt="Profile"
//                       className="rounded-circle object-fit-cover shadow-sm border border-2 border-info border-opacity-25"
//                       style={{ width: "40px", height: "40px" }}
//                     />
//                   ) : (
//                     <div
//                       className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center shadow-sm"
//                       style={{ width: "40px", height: "40px" }}
//                     >
//                       <UserCircle size={24} />
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
//                       {user?.email || "doctor@clinic.com"}
//                     </p>
//                   </div>

//                   <Dropdown.Item
//                     onClick={() => navigate("/doctor/profile")}
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
//         <main className="flex-grow-1 p-3 p-md-4 overflow-auto bg-light custom-scrollbar">
//           {/* BREADCRUMBS */}
//           <div className="mb-4">
//             <Breadcrumbs />
//           </div>

//           {/* Renders the specific page (DoctorDashboard, Patients, etc.) */}
//           <Outlet />
//         </main>
//       </div>

//       <style>{`
//         .hide-caret::after { display: none !important; }
//         .hover-bg-light:hover { background-color: #f8fafc !important; }
//         .tracking-tight { letter-spacing: -0.03em; }
//         .tracking-wider { letter-spacing: 0.05em; }
//         .transition-all { transition: all 0.2s ease-in-out; }
//         .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
//         .hover-opacity:hover { opacity: 0.8; }
//         .cursor-pointer { cursor: pointer; }

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

// export default DoctorLayout;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { Dropdown, Badge } from "react-bootstrap";
// import DoctorSidebar from "./DoctorSidebar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import {
//   Bell,
//   UserCircle,
//   Menu,
//   LogOut,
//   CalendarCheck,
//   CheckCircle2,
//   MessageSquare,
// } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import api from "../services/api";

// const DoctorLayout = () => {
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

//   // --- Fetch Notifications (Appointments + Smart Chat Check) ---
//   const fetchNotifications = async () => {
//     try {
//       // 1. Fetch doctor's appointments
//       const apptRes = await api
//         .get("/doctor/appointments")
//         .catch(() => ({ data: { appointments: [] } }));
//       const appointments = apptRes.data?.appointments || [];

//       const alerts = [];

//       // ==========================================
//       // A. Check for Pending Appointments
//       // ==========================================
//       const pendingAppts = appointments.filter(
//         (a) => a.status?.toLowerCase() === "pending",
//       );

//       pendingAppts.forEach((app) => {
//         alerts.push({
//           id: `appt-pending-${app._id}`,
//           type: "appointment",
//           title: "New Appointment Request",
//           message: `${app.patient?.name || "A patient"} requested a visit on ${new Date(app.date).toLocaleDateString()}.`,
//           link: "/doctor/appointments",
//           icon: CalendarCheck,
//           color: "text-warning",
//         });
//       });

//       // ==========================================
//       // B. SMART CHECK: Unanswered Patient Messages
//       // ==========================================
//       // Get active appointments (confirmed or pending)
//       const activeAppts = appointments.filter((a) =>
//         ["confirmed", "pending"].includes(a.status?.toLowerCase()),
//       );

//       // Fetch chat histories for all active appointments simultaneously
//       const chatPromises = activeAppts.map((app) =>
//         api.get(`/messages/appointment/${app._id}`).catch(() => ({ data: [] })),
//       );

//       const chatResults = await Promise.all(chatPromises);

//       let patientsWaitingForReply = 0;
//       const waitingApptIds = [];

//       chatResults.forEach((res, index) => {
//         const msgs = res.data?.messages || res.data || [];
//         if (msgs.length > 0) {
//           // Look at the VERY LAST message in the chat
//           const lastMessage = msgs[msgs.length - 1];

//           // If the patient sent the last message, the doctor hasn't replied yet!
//           if (lastMessage.senderModel === "Patient") {
//             patientsWaitingForReply++;
//             waitingApptIds.push(activeAppts[index]._id);
//           }
//         }
//       });

//       if (patientsWaitingForReply > 0) {
//         alerts.push({
//           id: `patient-msg-${waitingApptIds.join("-")}`,
//           type: "message", // Protects from manual dismissal
//           title: "New Patient Message",
//           message: `You have ${patientsWaitingForReply} patient(s) waiting for a reply.`,
//           link: "/doctor/appointments",
//           icon: MessageSquare,
//           color: "text-primary",
//         });
//       }

//       // ==========================================
//       // C. Filter using Local Storage
//       // ==========================================
//       const dismissedIds =
//         JSON.parse(localStorage.getItem("dismissedDoctorAlerts")) || [];

//       // Filter out any alerts that are in the dismissed list
//       const activeAlerts = alerts.filter((alert) => {
//         if (alert.type === "message") return true; // Unread messages must stay until doctor replies!
//         return !dismissedIds.includes(alert.id);
//       });

//       setNotifications(activeAlerts);
//       setUnreadCount(activeAlerts.length);
//     } catch (error) {
//       console.error("Failed to fetch doctor notifications", error);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 15000); // Check every 15s
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ MARK ALL AS READ LOGIC (Dismisses Appointments, keeps Messages)
//   const handleClearNotifications = () => {
//     const dismissibleAlerts = notifications.filter((n) => n.type !== "message");
//     const currentIds = dismissibleAlerts.map((n) => n.id);

//     const previouslyDismissed =
//       JSON.parse(localStorage.getItem("dismissedDoctorAlerts")) || [];
//     const newDismissed = [...new Set([...previouslyDismissed, ...currentIds])];

//     localStorage.setItem("dismissedDoctorAlerts", JSON.stringify(newDismissed));

//     // Keep the unread messages in the dropdown so the doctor remembers to reply!
//     const remainingMessages = notifications.filter((n) => n.type === "message");
//     setNotifications(remainingMessages);
//     setUnreadCount(remainingMessages.length);
//   };

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
//       className="d-flex min-vh-100 bg-light"
//       style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
//     >
//       {/* 1. Sidebar */}
//       <DoctorSidebar
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
//             {/* Left side: Mobile Menu Toggle & Title */}
//             <div className="d-flex align-items-center gap-3">
//               {isMobile && (
//                 <button
//                   className="btn btn-light p-2 border"
//                   onClick={() => setCollapsed(false)}
//                 >
//                   <Menu size={20} />
//                 </button>
//               )}
//               <div className={isMobile ? "d-none d-sm-block" : ""}>
//                 <h4 className="mb-0 fw-black text-dark tracking-tight">
//                   Clinical Portal
//                 </h4>
//                 <small className="text-muted fw-medium">
//                   Manage appointments & patients
//                 </small>
//               </div>
//             </div>

//             {/* Right Side Icons */}
//             <div className="d-flex align-items-center gap-3 gap-md-4">
//               {/* ✅ DYNAMIC NOTIFICATION DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="btn btn-white border border-light-subtle rounded-circle p-2 position-relative shadow-sm hover-lift transition-all hide-caret d-flex align-items-center justify-content-center"
//                   style={{ width: "40px", height: "40px" }}
//                 >
//                   <Bell size={20} className="text-dark" />
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
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-2"
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
//                           No pending requests right now.
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

//                   {notifications.some((n) => n.type !== "message") && (
//                     <div className="p-2 text-center bg-light border-top">
//                       <button
//                         className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
//                         onClick={handleClearNotifications}
//                       >
//                         Dismiss Alerts
//                       </button>
//                     </div>
//                   )}
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* ✅ DYNAMIC USER PROFILE DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="d-flex align-items-center gap-3 border-start border-light-subtle ps-3 ps-md-4 text-decoration-none hide-caret hover-opacity transition-all"
//                   style={{ outline: "none", boxShadow: "none" }}
//                 >
//                   <div
//                     className="text-end d-none d-md-block"
//                     style={{ lineHeight: "1.2" }}
//                   >
//                     <div className="fw-bold text-dark fs-6">
//                       Dr. {user?.name?.split(" ")[0] || "Provider"}
//                     </div>
//                     <small
//                       className="text-info fw-bold text-uppercase tracking-wider"
//                       style={{ fontSize: "0.65rem" }}
//                     >
//                       {user?.speciality || "General Physician"}
//                     </small>
//                   </div>

//                   {getProfileImage() ? (
//                     <img
//                       src={getProfileImage()}
//                       alt="Profile"
//                       className="rounded-circle object-fit-cover shadow-sm border border-2 border-info border-opacity-25"
//                       style={{ width: "40px", height: "40px" }}
//                     />
//                   ) : (
//                     <div
//                       className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center shadow-sm"
//                       style={{ width: "40px", height: "40px" }}
//                     >
//                       <UserCircle size={24} />
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
//                       {user?.email || "doctor@clinic.com"}
//                     </p>
//                   </div>

//                   <Dropdown.Item
//                     onClick={() => navigate("/doctor/profile")}
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
//         <main className="flex-grow-1 p-3 p-md-4 overflow-auto bg-light custom-scrollbar">
//           {/* BREADCRUMBS */}
//           <div className="mb-4">
//             <Breadcrumbs />
//           </div>

//           {/* Renders the specific page (DoctorDashboard, Patients, etc.) */}
//           <Outlet />
//         </main>
//       </div>

//       <style>{`
//         .hide-caret::after { display: none !important; }
//         .hover-bg-light:hover { background-color: #f8fafc !important; }
//         .tracking-tight { letter-spacing: -0.03em; }
//         .tracking-wider { letter-spacing: 0.05em; }
//         .transition-all { transition: all 0.2s ease-in-out; }
//         .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
//         .hover-opacity:hover { opacity: 0.8; }
//         .cursor-pointer { cursor: pointer; }

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

// export default DoctorLayout;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { Dropdown, Badge } from "react-bootstrap";
// import DoctorSidebar from "./DoctorSidebar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import {
//   Bell,
//   UserCircle,
//   Menu,
//   LogOut,
//   CalendarCheck,
//   CheckCircle2,
//   MessageSquare,
// } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import api from "../services/api";

// const DoctorLayout = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // --- Separate States for Appointments and Messages ---
//   const [apptAlerts, setApptAlerts] = useState([]);
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

//   // --- Fetch Notifications ---
//   const fetchNotifications = async () => {
//     try {
//       const apptRes = await api
//         .get("/doctor/appointments")
//         .catch(() => ({ data: { appointments: [] } }));
//       const appointments = apptRes.data?.appointments || [];

//       // ==========================================
//       // 1. APPOINTMENT ALERTS (Bell Icon)
//       // ==========================================
//       const pendingAppts = appointments.filter(
//         (a) => a.status?.toLowerCase() === "pending",
//       );

//       const generatedApptAlerts = pendingAppts.map((app) => ({
//         id: `appt-pending-${app._id}`,
//         title: "New Appointment Request",
//         message: `${app.patient?.name || "A patient"} requested a visit on ${new Date(app.date).toLocaleDateString()}.`,
//         link: "/doctor/appointments",
//         icon: CalendarCheck,
//         color: "text-warning",
//       }));

//       const dismissedAppts =
//         JSON.parse(localStorage.getItem("dismissedDoctorAppts")) || [];
//       setApptAlerts(
//         generatedApptAlerts.filter((a) => !dismissedAppts.includes(a.id)),
//       );

//       // ==========================================
//       // 2. MESSAGE ALERTS (Message Icon)
//       // ==========================================
//       const activeAppts = appointments.filter((a) =>
//         ["confirmed", "pending"].includes(a.status?.toLowerCase()),
//       );

//       let patientsWaitingForReply = 0;
//       let unreadMsgApptIds = [];

//       for (let app of activeAppts) {
//         try {
//           // ✅ SECURE FIX: Pass background=true so the backend DOES NOT mark it as read!
//           const chatRes = await api.get(
//             `/messages/appointment/${app._id}?background=true`,
//           );
//           const msgs = Array.isArray(chatRes.data)
//             ? chatRes.data
//             : chatRes.data?.messages || [];

//           if (msgs.length > 0) {
//             const hasUnreadFromPatient = msgs.some(
//               (m) => m.senderModel === "Patient" && m.isRead === false,
//             );

//             if (hasUnreadFromPatient) {
//               patientsWaitingForReply++;
//               unreadMsgApptIds.push(app._id);
//             }
//           }
//         } catch (err) {
//           // Ignore empty chats
//         }
//       }

//       if (patientsWaitingForReply > 0) {
//         setMsgAlerts([
//           {
//             id: `patient-msg-${unreadMsgApptIds.join("-")}`,
//             title: "New Patient Messages",
//             message: `You have ${patientsWaitingForReply} patient(s) waiting for a reply.`,
//             link: "/doctor/appointments",
//             icon: MessageSquare,
//             color: "text-primary",
//           },
//         ]);
//       } else {
//         setMsgAlerts([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch doctor notifications", error);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 15000);
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ Dismiss only Appointment Alerts
//   const handleClearApptAlerts = () => {
//     const currentIds = apptAlerts.map((n) => n.id);
//     const previouslyDismissed =
//       JSON.parse(localStorage.getItem("dismissedDoctorAppts")) || [];
//     const newDismissed = [...new Set([...previouslyDismissed, ...currentIds])];

//     localStorage.setItem("dismissedDoctorAppts", JSON.stringify(newDismissed));
//     setApptAlerts([]);
//   };

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
//       className="d-flex min-vh-100 bg-light"
//       style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
//     >
//       <DoctorSidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         isMobile={isMobile}
//       />

//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         <header className="bg-white shadow-sm border-bottom border-light-subtle px-4 py-3 flex-shrink-0 z-3">
//           <div className="d-flex align-items-center justify-content-between">
//             <div className="d-flex align-items-center gap-3">
//               {isMobile && (
//                 <button
//                   className="btn btn-light p-2 border"
//                   onClick={() => setCollapsed(false)}
//                 >
//                   <Menu size={20} />
//                 </button>
//               )}
//               <div className={isMobile ? "d-none d-sm-block" : ""}>
//                 <h4 className="mb-0 fw-black text-dark tracking-tight">
//                   Clinical Portal
//                 </h4>
//                 <small className="text-muted fw-medium">
//                   Manage appointments & patients
//                 </small>
//               </div>
//             </div>

//             <div className="d-flex align-items-center gap-3 gap-md-4">
//               {/* 💬 DEDICATED MESSAGE DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="btn btn-white border border-light-subtle rounded-circle p-2 position-relative shadow-sm hover-lift transition-all hide-caret d-flex align-items-center justify-content-center"
//                   style={{ width: "40px", height: "40px" }}
//                   title="Messages"
//                 >
//                   <MessageSquare size={20} className="text-primary" />
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
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-2"
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
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* 🔔 DEDICATED APPOINTMENT NOTIFICATION DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="btn btn-white border border-light-subtle rounded-circle p-2 position-relative shadow-sm hover-lift transition-all hide-caret d-flex align-items-center justify-content-center"
//                   style={{ width: "40px", height: "40px" }}
//                   title="Notifications"
//                 >
//                   <Bell size={20} className="text-dark" />
//                   {apptAlerts.length > 0 && (
//                     <span
//                       className="position-absolute top-0 start-100 translate-middle badge rounded-pill animate-pulse"
//                       style={{
//                         backgroundColor: "#B12704",
//                         color: "#fff",
//                         fontSize: "0.65rem",
//                         border: "2px solid #fff",
//                       }}
//                     >
//                       {apptAlerts.length}
//                     </span>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-2"
//                   style={{ width: "320px" }}
//                 >
//                   <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
//                     <span className="fw-bold text-dark mb-0">
//                       System Alerts
//                     </span>
//                     <Badge bg="secondary" className="rounded-pill">
//                       {apptAlerts.length} New
//                     </Badge>
//                   </div>

//                   <div style={{ maxHeight: "350px", overflowY: "auto" }}>
//                     {apptAlerts.length === 0 ? (
//                       <div className="p-4 text-center text-muted">
//                         <CheckCircle2
//                           size={32}
//                           className="mb-2 text-success opacity-50"
//                         />
//                         <p className="small mb-0 fw-medium">
//                           No pending requests.
//                         </p>
//                       </div>
//                     ) : (
//                       apptAlerts.map((n) => (
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

//                   {apptAlerts.length > 0 && (
//                     <div className="p-2 text-center bg-light border-top">
//                       <button
//                         className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
//                         onClick={handleClearApptAlerts}
//                       >
//                         Dismiss Alerts
//                       </button>
//                     </div>
//                   )}
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* 👤 DYNAMIC USER PROFILE DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="d-flex align-items-center gap-3 border-start border-light-subtle ps-3 ps-md-4 text-decoration-none hide-caret hover-opacity transition-all"
//                   style={{ outline: "none", boxShadow: "none" }}
//                 >
//                   <div
//                     className="text-end d-none d-md-block"
//                     style={{ lineHeight: "1.2" }}
//                   >
//                     <div className="fw-bold text-dark fs-6">
//                       Dr. {user?.name?.split(" ")[0] || "Provider"}
//                     </div>
//                     <small
//                       className="text-info fw-bold text-uppercase tracking-wider"
//                       style={{ fontSize: "0.65rem" }}
//                     >
//                       {user?.speciality || "General Physician"}
//                     </small>
//                   </div>

//                   {getProfileImage() ? (
//                     <img
//                       src={getProfileImage()}
//                       alt="Profile"
//                       className="rounded-circle object-fit-cover shadow-sm border border-2 border-info border-opacity-25"
//                       style={{ width: "40px", height: "40px" }}
//                     />
//                   ) : (
//                     <div
//                       className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center shadow-sm"
//                       style={{ width: "40px", height: "40px" }}
//                     >
//                       <UserCircle size={24} />
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
//                       {user?.email || "doctor@clinic.com"}
//                     </p>
//                   </div>

//                   <Dropdown.Item
//                     onClick={() => navigate("/doctor/profile")}
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

//         <main className="flex-grow-1 p-3 p-md-4 overflow-auto bg-light custom-scrollbar">
//           <div className="mb-4">
//             <Breadcrumbs />
//           </div>
//           <Outlet />
//         </main>
//       </div>

//       <style>{`
//         .hide-caret::after { display: none !important; }
//         .hover-bg-light:hover { background-color: #f8fafc !important; }
//         .tracking-tight { letter-spacing: -0.03em; }
//         .tracking-wider { letter-spacing: 0.05em; }
//         .transition-all { transition: all 0.2s ease-in-out; }
//         .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
//         .hover-opacity:hover { opacity: 0.8; }
//         .cursor-pointer { cursor: pointer; }

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

// export default DoctorLayout;

// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { Dropdown, Badge } from "react-bootstrap";
// import DoctorSidebar from "./DoctorSidebar";
// import Breadcrumbs from "../components/Breadcrumbs";
// import {
//   Bell,
//   UserCircle,
//   Menu,
//   LogOut,
//   CalendarCheck,
//   CheckCircle2,
//   MessageSquare,
// } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import api from "../services/api";

// const DoctorLayout = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // --- Separate Notification States ---
//   const [apptAlerts, setApptAlerts] = useState([]);
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

//   // --- Fetch Notifications ---
//   const fetchNotifications = async () => {
//     try {
//       // 1. Fetch Appointments & Messages in parallel
//       // Pass background=true to prevent backend from auto-marking as read
//       const [apptRes, msgRes] = await Promise.all([
//         api
//           .get("/doctor/appointments")
//           .catch(() => ({ data: { appointments: [] } })),
//         api.get("/messages/my?background=true").catch(() => ({ data: [] })),
//       ]);

//       const appointments = apptRes.data?.appointments || [];
//       const messages = Array.isArray(msgRes.data)
//         ? msgRes.data
//         : msgRes.data?.messages || [];

//       // ==========================================
//       // 1. APPOINTMENT ALERTS (Bell Icon)
//       // ==========================================
//       const pendingAppts = appointments.filter(
//         (a) => a.status?.toLowerCase() === "pending",
//       );

//       const generatedApptAlerts = pendingAppts.map((app) => ({
//         id: `appt-pending-${app._id}`,
//         title: "New Appointment Request",
//         message: `${app.patient?.name || "A patient"} requested a visit on ${new Date(app.date).toLocaleDateString()}.`,
//         link: "/doctor/appointments",
//         icon: CalendarCheck,
//         color: "text-warning",
//       }));

//       const dismissedAppts =
//         JSON.parse(localStorage.getItem("dismissedDoctorAppts")) || [];
//       setApptAlerts(
//         generatedApptAlerts.filter((a) => !dismissedAppts.includes(a.id)),
//       );

//       // ==========================================
//       // 2. MESSAGE ALERTS (Message Icon) - FIXED LOGIC
//       // ==========================================
//       // Filter unread messages where the current user (Doctor) is NOT the sender
//       const unreadFromPatients = messages.filter((m) => {
//         const isChatMsg = Boolean(m.appointment);
//         const isUnread = m.isRead === false;
//         // String conversion ensures IDs match even if one is an object/string
//         const isNotFromMe = String(m.sender) !== String(user?._id);

//         return isChatMsg && isUnread && isNotFromMe;
//       });

//       // Group unread messages by appointment to avoid duplicates
//       const groupedMsgs = {};
//       unreadFromPatients.forEach((m) => {
//         if (!groupedMsgs[m.appointment]) groupedMsgs[m.appointment] = 0;
//         groupedMsgs[m.appointment]++;
//       });

//       const generatedMsgAlerts = Object.keys(groupedMsgs).map((apptId) => ({
//         id: `msg-${apptId}`,
//         title: "New Patient Message",
//         message: `You have ${groupedMsgs[apptId]} new message(s) from a patient.`,
//         link: "/doctor/appointments",
//         icon: MessageSquare,
//         color: "text-primary",
//       }));

//       setMsgAlerts(generatedMsgAlerts);
//     } catch (error) {
//       console.error("Failed to fetch doctor notifications", error);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 15000);
//     return () => clearInterval(interval);
//   }, [user?._id]); // Re-run if user ID changes

//   // Dismiss only Appointment Alerts
//   const handleClearApptAlerts = () => {
//     const currentIds = apptAlerts.map((n) => n.id);
//     const previouslyDismissed =
//       JSON.parse(localStorage.getItem("dismissedDoctorAppts")) || [];
//     const newDismissed = [...new Set([...previouslyDismissed, ...currentIds])];

//     localStorage.setItem("dismissedDoctorAppts", JSON.stringify(newDismissed));
//     setApptAlerts([]);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div
//       className="d-flex min-vh-100 bg-light"
//       style={{ fontFamily: "'Inter', sans-serif" }}
//     >
//       <DoctorSidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         isMobile={isMobile}
//       />

//       <div
//         className="flex-grow-1 d-flex flex-column overflow-hidden"
//         style={{ height: "100vh" }}
//       >
//         <header className="bg-white shadow-sm border-bottom px-4 py-3 flex-shrink-0 z-3">
//           <div className="d-flex align-items-center justify-content-between">
//             <div className="d-flex align-items-center gap-3">
//               {isMobile && (
//                 <button
//                   className="btn btn-light p-2 border"
//                   onClick={() => setCollapsed(false)}
//                 >
//                   <Menu size={20} />
//                 </button>
//               )}
//               <div>
//                 <h4 className="mb-0 fw-bold">Clinical Portal</h4>
//                 <small className="text-muted">
//                   Manage appointments & patients
//                 </small>
//               </div>
//             </div>

//             <div className="d-flex align-items-center gap-3 gap-md-4">
//               {/* 💬 MESSAGE DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="btn btn-white border rounded-circle p-2 position-relative shadow-sm hide-caret d-flex align-items-center justify-content-center"
//                   style={{ width: "40px", height: "40px" }}
//                 >
//                   <MessageSquare size={20} className="text-primary" />
//                   {msgAlerts.length > 0 && (
//                     <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white animate-pulse">
//                       {msgAlerts.length}
//                     </span>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-2"
//                   style={{ width: "320px" }}
//                 >
//                   <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
//                     <span className="fw-bold">Messages</span>
//                     <Badge bg="primary" className="rounded-pill">
//                       {msgAlerts.length} New
//                     </Badge>
//                   </div>
//                   <div style={{ maxHeight: "350px", overflowY: "auto" }}>
//                     {msgAlerts.length === 0 ? (
//                       <div className="p-4 text-center text-muted">
//                         <CheckCircle2
//                           size={32}
//                           className="mb-2 text-success opacity-50"
//                         />
//                         <p className="small mb-0">Inbox is clear!</p>
//                       </div>
//                     ) : (
//                       msgAlerts.map((n) => (
//                         <Dropdown.Item
//                           key={n.id}
//                           onClick={() => navigate(n.link)}
//                           className="p-3 border-bottom text-wrap transition-all"
//                         >
//                           <div className="d-flex gap-3 align-items-start">
//                             <div className={`mt-1 flex-shrink-0 ${n.color}`}>
//                               <n.icon size={18} />
//                             </div>
//                             <div>
//                               <div className="fw-bold text-dark mb-1 fs-6">
//                                 {n.title}
//                               </div>
//                               <div className="small text-muted">
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

//               {/* 🔔 APPOINTMENT NOTIFICATION DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="btn btn-white border rounded-circle p-2 position-relative shadow-sm hide-caret d-flex align-items-center justify-content-center"
//                   style={{ width: "40px", height: "40px" }}
//                 >
//                   <Bell size={20} className="text-dark" />
//                   {apptAlerts.length > 0 && (
//                     <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white animate-pulse">
//                       {apptAlerts.length}
//                     </span>
//                   )}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu
//                   className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-2"
//                   style={{ width: "320px" }}
//                 >
//                   <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
//                     <span className="fw-bold">System Alerts</span>
//                     <Badge bg="secondary" className="rounded-pill">
//                       {apptAlerts.length} New
//                     </Badge>
//                   </div>
//                   <div style={{ maxHeight: "350px", overflowY: "auto" }}>
//                     {apptAlerts.length === 0 ? (
//                       <div className="p-4 text-center text-muted">
//                         <CheckCircle2
//                           size={32}
//                           className="mb-2 text-success opacity-50"
//                         />
//                         <p className="small mb-0">No new requests.</p>
//                       </div>
//                     ) : (
//                       apptAlerts.map((n) => (
//                         <Dropdown.Item
//                           key={n.id}
//                           onClick={() => navigate(n.link)}
//                           className="p-3 border-bottom text-wrap transition-all"
//                         >
//                           <div className="d-flex gap-3 align-items-start">
//                             <div className={`mt-1 flex-shrink-0 ${n.color}`}>
//                               <n.icon size={18} />
//                             </div>
//                             <div>
//                               <div className="fw-bold text-dark mb-1 fs-6">
//                                 {n.title}
//                               </div>
//                               <div className="small text-muted">
//                                 {n.message}
//                               </div>
//                             </div>
//                           </div>
//                         </Dropdown.Item>
//                       ))
//                     )}
//                   </div>
//                   {apptAlerts.length > 0 && (
//                     <div className="p-2 text-center bg-light border-top">
//                       <button
//                         className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
//                         onClick={handleClearApptAlerts}
//                       >
//                         Dismiss Alerts
//                       </button>
//                     </div>
//                   )}
//                 </Dropdown.Menu>
//               </Dropdown>

//               {/* 👤 USER PROFILE DROPDOWN */}
//               <Dropdown align="end">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="d-flex align-items-center gap-3 border-start ps-3 text-decoration-none hide-caret"
//                 >
//                   <div className="text-end d-none d-md-block">
//                     <div className="fw-bold text-dark">
//                       Dr. {user?.name?.split(" ")[0]}
//                     </div>
//                     <small className="text-info fw-bold">
//                       {user?.speciality || "Physician"}
//                     </small>
//                   </div>
//                   <div className="bg-light rounded-circle p-1">
//                     <UserCircle size={32} className="text-muted" />
//                   </div>
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu className="shadow-lg border-0 rounded-4 mt-3">
//                   <Dropdown.Item onClick={() => navigate("/doctor/profile")}>
//                     My Profile
//                   </Dropdown.Item>
//                   <Dropdown.Divider />
//                   <Dropdown.Item
//                     onClick={handleLogout}
//                     className="text-danger fw-bold"
//                   >
//                     <LogOut size={16} /> Sign Out
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//           </div>
//         </header>

//         <main className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar">
//           <Breadcrumbs />
//           <Outlet />
//         </main>
//       </div>

//       <style>{`
//         .hide-caret::after { display: none !important; }
//         .custom-scrollbar::-webkit-scrollbar { width: 8px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
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

// export default DoctorLayout;

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Dropdown, Badge } from "react-bootstrap";
import DoctorSidebar from "./DoctorSidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  Bell,
  UserCircle,
  Menu,
  LogOut,
  CalendarCheck,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const DoctorLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // --- Separate Notification States ---
  const [apptAlerts, setApptAlerts] = useState([]);
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

  // --- Fetch Notifications ---
  const fetchNotifications = async () => {
    try {
      // 1. Fetch Appointments
      const apptRes = await api
        .get("/doctor/appointments")
        .catch(() => ({ data: { appointments: [] } }));

      const appointments = apptRes.data?.appointments || [];

      // ==========================================
      // 1. APPOINTMENT ALERTS (Bell Icon)
      // ==========================================
      const pendingAppts = appointments.filter(
        (a) => a.status?.toLowerCase() === "pending",
      );

      const generatedApptAlerts = pendingAppts.map((app) => ({
        id: `appt-pending-${app._id}`,
        title: "New Appointment Request",
        message: `${app.patient?.name || "A patient"} requested a visit on ${new Date(app.date).toLocaleDateString()}.`,
        link: "/doctor/appointments",
        icon: CalendarCheck,
        color: "text-warning",
      }));

      const dismissedAppts =
        JSON.parse(localStorage.getItem("dismissedDoctorAppts")) || [];
      setApptAlerts(
        generatedApptAlerts.filter((a) => !dismissedAppts.includes(a.id)),
      );

      // ==========================================
      // 2. MESSAGE ALERTS (Message Icon) - BULLETPROOF FIX
      // ==========================================
      // We fetch the chat history for each active appointment directly.
      // This bypasses any bugs with missing receiverIds in the database!
      const activeAppts = appointments.filter((a) =>
        ["confirmed", "pending"].includes(a.status?.toLowerCase()),
      );

      // Fetch all chats in parallel using the background flag to prevent auto-reading
      const chatPromises = activeAppts.map((app) =>
        api
          .get(`/messages/appointment/${app._id}?background=true`)
          .catch(() => ({ data: [] })),
      );

      const chatResults = await Promise.all(chatPromises);

      const groupedMsgs = {};

      chatResults.forEach((res, index) => {
        const msgs = Array.isArray(res.data)
          ? res.data
          : res.data?.messages || [];
        const apptId = activeAppts[index]._id;

        msgs.forEach((m) => {
          // Safely extract IDs (Handles cases where backend populates the sender as an object)
          const senderId = m.sender?._id
            ? String(m.sender._id)
            : String(m.sender);
          const myId = String(user?._id);

          // If the message is unread AND the sender is NOT the doctor, it's a notification!
          if (m.isRead === false && senderId !== myId) {
            if (!groupedMsgs[apptId]) groupedMsgs[apptId] = 0;
            groupedMsgs[apptId]++;
          }
        });
      });

      const generatedMsgAlerts = Object.keys(groupedMsgs).map((apptId) => ({
        id: `msg-${apptId}`,
        title: "New Patient Message",
        message: `You have ${groupedMsgs[apptId]} new message(s) from a patient.`,
        link: "/doctor/appointments",
        icon: MessageSquare,
        color: "text-primary",
      }));

      setMsgAlerts(generatedMsgAlerts);
    } catch (error) {
      console.error("Failed to fetch doctor notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user?._id]);

  // Dismiss only Appointment Alerts
  const handleClearApptAlerts = () => {
    const currentIds = apptAlerts.map((n) => n.id);
    const previouslyDismissed =
      JSON.parse(localStorage.getItem("dismissedDoctorAppts")) || [];
    const newDismissed = [...new Set([...previouslyDismissed, ...currentIds])];

    localStorage.setItem("dismissedDoctorAppts", JSON.stringify(newDismissed));
    setApptAlerts([]);
  };

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

  return (
    <div
      className="d-flex min-vh-100 bg-light"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <DoctorSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />

      <div
        className="flex-grow-1 d-flex flex-column overflow-hidden"
        style={{ height: "100vh" }}
      >
        <header className="bg-white shadow-sm border-bottom px-4 py-3 flex-shrink-0 z-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              {isMobile && (
                <button
                  className="btn btn-light p-2 border"
                  onClick={() => setCollapsed(false)}
                >
                  <Menu size={20} />
                </button>
              )}
              <div>
                <h4 className="mb-0 fw-bold">Clinical Portal</h4>
                <small className="text-muted">
                  Manage appointments & patients
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 gap-md-4">
              {/* 💬 MESSAGE DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="btn btn-white border rounded-circle p-2 position-relative shadow-sm hide-caret d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <MessageSquare size={20} className="text-primary" />
                  {msgAlerts.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white animate-pulse">
                      {msgAlerts.length}
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-2"
                  style={{ width: "320px" }}
                >
                  <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Messages</span>
                    <Badge bg="primary" className="rounded-pill">
                      {msgAlerts.length} New
                    </Badge>
                  </div>
                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {msgAlerts.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <CheckCircle2
                          size={32}
                          className="mb-2 text-success opacity-50"
                        />
                        <p className="small mb-0">Inbox is clear!</p>
                      </div>
                    ) : (
                      msgAlerts.map((n) => (
                        <Dropdown.Item
                          key={n.id}
                          onClick={() => navigate(n.link)}
                          className="p-3 border-bottom text-wrap transition-all"
                        >
                          <div className="d-flex gap-3 align-items-start">
                            <div className={`mt-1 flex-shrink-0 ${n.color}`}>
                              <n.icon size={18} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark mb-1 fs-6">
                                {n.title}
                              </div>
                              <div className="small text-muted">
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

              {/* 🔔 APPOINTMENT NOTIFICATION DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="btn btn-white border rounded-circle p-2 position-relative shadow-sm hide-caret d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <Bell size={20} className="text-dark" />
                  {apptAlerts.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white animate-pulse">
                      {apptAlerts.length}
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-2"
                  style={{ width: "320px" }}
                >
                  <div className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-bold">System Alerts</span>
                    <Badge bg="secondary" className="rounded-pill">
                      {apptAlerts.length} New
                    </Badge>
                  </div>
                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    {apptAlerts.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <CheckCircle2
                          size={32}
                          className="mb-2 text-success opacity-50"
                        />
                        <p className="small mb-0">No new requests.</p>
                      </div>
                    ) : (
                      apptAlerts.map((n) => (
                        <Dropdown.Item
                          key={n.id}
                          onClick={() => navigate(n.link)}
                          className="p-3 border-bottom text-wrap transition-all"
                        >
                          <div className="d-flex gap-3 align-items-start">
                            <div className={`mt-1 flex-shrink-0 ${n.color}`}>
                              <n.icon size={18} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark mb-1 fs-6">
                                {n.title}
                              </div>
                              <div className="small text-muted">
                                {n.message}
                              </div>
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))
                    )}
                  </div>
                  {apptAlerts.length > 0 && (
                    <div className="p-2 text-center bg-light border-top">
                      <button
                        className="btn btn-link text-decoration-none small text-primary fw-bold p-0"
                        onClick={handleClearApptAlerts}
                      >
                        Dismiss Alerts
                      </button>
                    </div>
                  )}
                </Dropdown.Menu>
              </Dropdown>

              {/* 👤 USER PROFILE DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="d-flex align-items-center gap-3 border-start ps-3 text-decoration-none hide-caret"
                >
                  <div className="text-end d-none d-md-block">
                    <div className="fw-bold text-dark">
                      Dr. {user?.name?.split(" ")[0]}
                    </div>
                    <small className="text-info fw-bold">
                      {user?.speciality || "Physician"}
                    </small>
                  </div>
                  <div className="bg-light rounded-circle p-1">
                    <UserCircle size={32} className="text-muted" />
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow-lg border-0 rounded-4 mt-3">
                  <Dropdown.Item onClick={() => navigate("/doctor/profile")}>
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="text-danger fw-bold"
                  >
                    <LogOut size={16} /> Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </header>

        <main className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      <style>{`
        .hide-caret::after { display: none !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
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

export default DoctorLayout;
