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
//       // 1. Fetch Appointments
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
//       // We fetch the chat history for each active appointment directly.
//       // This bypasses any bugs with missing receiverIds in the database!
//       const activeAppts = appointments.filter((a) =>
//         ["confirmed", "pending"].includes(a.status?.toLowerCase()),
//       );

//       // Fetch all chats in parallel using the background flag to prevent auto-reading
//       const chatPromises = activeAppts.map((app) =>
//         api
//           .get(`/messages/appointment/${app._id}?background=true`)
//           .catch(() => ({ data: [] })),
//       );

//       const chatResults = await Promise.all(chatPromises);

//       const groupedMsgs = {};

//       chatResults.forEach((res, index) => {
//         const msgs = Array.isArray(res.data)
//           ? res.data
//           : res.data?.messages || [];
//         const apptId = activeAppts[index]._id;

//         msgs.forEach((m) => {
//           // Safely extract IDs (Handles cases where backend populates the sender as an object)
//           const senderId = m.sender?._id
//             ? String(m.sender._id)
//             : String(m.sender);
//           const myId = String(user?._id);

//           // If the message is unread AND the sender is NOT the doctor, it's a notification!
//           if (m.isRead === false && senderId !== myId) {
//             if (!groupedMsgs[apptId]) groupedMsgs[apptId] = 0;
//             groupedMsgs[apptId]++;
//           }
//         });
//       });

//       const generatedMsgAlerts = Object.keys(groupedMsgs).map((apptId) => ({
//         id: `msg-${apptId}`,
//         appointmentId: apptId,
//         title: "New Patient Message",
//         message: `You have ${groupedMsgs[apptId]} new message(s) from a patient.`,
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
//   }, [user?._id]);

//   // Dismiss only Appointment Alerts
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
//       return `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${cleanPath}`;
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
//                           onClick={() =>
//                             navigate("/doctor/dashboard", {
//                               state: {
//                                 openChatForAppointment: n.appointmentId,
//                               },
//                             })
//                           }
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
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
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

  // --- Auto-Collapse Sidebar on Route Change (Mobile Only) ---
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [location.pathname, isMobile]);

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
      // 2. MESSAGE ALERTS (Message Icon)
      // ==========================================
      const activeAppts = appointments.filter((a) =>
        ["confirmed", "pending"].includes(a.status?.toLowerCase()),
      );

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
          const senderId = m.sender?._id
            ? String(m.sender._id)
            : String(m.sender);
          const myId = String(user?._id);

          if (m.isRead === false && senderId !== myId) {
            if (!groupedMsgs[apptId]) groupedMsgs[apptId] = 0;
            groupedMsgs[apptId]++;
          }
        });
      });

      const generatedMsgAlerts = Object.keys(groupedMsgs).map((apptId) => ({
        id: `msg-${apptId}`,
        appointmentId: apptId,
        title: "New Patient Message",
        message: `You have ${groupedMsgs[apptId]} new message(s) from a patient.`,
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
      return `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${cleanPath}`;
    }
    return null;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`doctor-layout-wrapper d-flex transition-all ${collapsed ? "sidebar-collapsed" : "sidebar-open"}`}
      style={{
        backgroundColor: "#f8f9fa",
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 1. MOBILE OVERLAY (Dismisses sidebar when clicked outside) */}
      {isMobile && !collapsed && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 transition-all"
          onClick={() => setCollapsed(true)}
          style={{ zIndex: 1040 }}
        />
      )}

      {/* 2. SIDEBAR */}
      <div
        className="sidebar-container transition-all"
        style={{
          width: isMobile
            ? collapsed
              ? "0"
              : "280px"
            : collapsed
              ? "80px"
              : "260px",
          zIndex: 1050,
          position: isMobile ? "fixed" : "relative",
          height: "100%",
        }}
      >
        <DoctorSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
        />
      </div>

      {/* 3. MAIN AREA */}
      <div
        className="flex-grow-1 d-flex flex-column transition-all w-100"
        style={{ height: "100vh", overflow: "hidden", minWidth: 0 }}
      >
        <header className="bg-white shadow-sm border-bottom px-3 px-md-4 py-3 flex-shrink-0 z-1 transition-all">
          <div className="d-flex align-items-center justify-content-between">
            {/* Left Side: Hamburger (Mobile) + Page Title */}
            <div className="d-flex align-items-center gap-2 gap-md-3">
              {/* CSS-driven mobile hamburger button */}
              <button
                className="btn p-1 border-0 shadow-none hover-opacity d-flex align-items-center justify-content-center d-md-none flex-shrink-0"
                onClick={() => setCollapsed(!collapsed)}
                style={{ color: "#0F1111" }}
                aria-label="Toggle Sidebar"
              >
                <Menu size={24} />
              </button>

              <div className="text-truncate">
                <h4
                  className="mb-0 fw-bold d-none d-sm-block text-truncate"
                  style={{ fontSize: "1.25rem" }}
                >
                  Clinical Portal
                </h4>
                <h4
                  className="mb-0 fw-bold d-block d-sm-none text-truncate"
                  style={{ fontSize: "1.1rem" }}
                >
                  Portal
                </h4>
                <small className="text-muted d-none d-md-block text-truncate">
                  Manage appointments & patients
                </small>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="d-flex align-items-center gap-3 gap-md-4 flex-shrink-0">
              {/* 💬 MESSAGE DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="btn btn-white border rounded-circle p-0 position-relative shadow-sm hide-caret d-flex align-items-center justify-content-center hover-opacity transition-all"
                  style={{ width: "40px", height: "40px" }}
                >
                  <MessageSquare size={20} className="text-primary" />
                  {msgAlerts.length > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white animate-pulse"
                      style={{ fontSize: "0.65rem", padding: "0.25em 0.4em" }}
                    >
                      {msgAlerts.length}
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-2"
                  style={{ width: "300px", maxWidth: "90vw", zIndex: 1060 }}
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
                        <p className="small mb-0 fw-medium">Inbox is clear!</p>
                      </div>
                    ) : (
                      msgAlerts.map((n) => (
                        <Dropdown.Item
                          key={n.id}
                          onClick={() =>
                            navigate("/doctor/dashboard", {
                              state: {
                                openChatForAppointment: n.appointmentId,
                              },
                            })
                          }
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

              {/* 🔔 APPOINTMENT NOTIFICATION DROPDOWN */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="btn btn-white border rounded-circle p-0 position-relative shadow-sm hide-caret d-flex align-items-center justify-content-center hover-opacity transition-all"
                  style={{ width: "40px", height: "40px" }}
                >
                  <Bell size={20} className="text-dark" />
                  {apptAlerts.length > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white animate-pulse"
                      style={{ fontSize: "0.65rem", padding: "0.25em 0.4em" }}
                    >
                      {apptAlerts.length}
                    </span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 p-0 overflow-hidden mt-2"
                  style={{ width: "300px", maxWidth: "90vw", zIndex: 1060 }}
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
                        <p className="small mb-0 fw-medium">No new requests.</p>
                      </div>
                    ) : (
                      apptAlerts.map((n) => (
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
                  className="d-flex align-items-center gap-2 gap-md-3 border-start ps-2 ps-md-3 text-decoration-none hide-caret hover-opacity transition-all"
                  style={{ outline: "none", boxShadow: "none" }}
                >
                  <div className="text-end d-none d-lg-block text-truncate">
                    <div
                      className="fw-bold text-dark text-truncate"
                      style={{ lineHeight: "1.2", maxWidth: "120px" }}
                    >
                      Dr. {user?.name?.split(" ")[0]}
                    </div>
                    <small
                      className="text-info fw-bold text-truncate d-block"
                      style={{ fontSize: "0.75rem", maxWidth: "120px" }}
                    >
                      {user?.speciality || "Physician"}
                    </small>
                  </div>

                  {/* Dynamic Avatar Image or Icon */}
                  {getProfileImage() ? (
                    <img
                      src={getProfileImage()}
                      alt="Profile"
                      className="rounded-circle object-fit-cover border shadow-sm flex-shrink-0"
                      style={{
                        width: "36px",
                        height: "36px",
                      }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center bg-light rounded-circle p-1 flex-shrink-0">
                      <UserCircle size={28} className="text-muted" />
                    </div>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 rounded-4 mt-3"
                  style={{ minWidth: "200px", zIndex: 1060 }}
                >
                  <div className="px-3 py-2 border-bottom mb-2 bg-light d-lg-none">
                    <p className="small text-muted mb-0">Signed in as</p>
                    <p className="fw-bold text-dark mb-0 text-truncate">
                      Dr. {user?.name || "Provider"}
                    </p>
                  </div>
                  <Dropdown.Item
                    onClick={() => navigate("/doctor/profile")}
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

        <main className="flex-grow-1 p-3 p-md-4 overflow-auto custom-scrollbar position-relative">
          <Breadcrumbs />
          <div className="mt-2">
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        /* Layout Structure */
        .doctor-layout-wrapper {
          position: relative;
          width: 100vw;
        }

        .hide-caret::after { display: none !important; }
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .hover-opacity:hover { opacity: 0.7; }
        .transition-all { transition: background-color 0.3s ease, color 0.3s ease, opacity 0.2s ease-in-out, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s ease; }
        
        /* Mobile Drawer & Nuke Duplicate Buttons */
        @media (max-width: 767.98px) {
          .sidebar-container {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            overflow: hidden;
            z-index: 1050;
          }
          .sidebar-collapsed .sidebar-container {
            transform: translateX(-100%);
          }
          .sidebar-open .sidebar-container {
            transform: translateX(0);
          }
          
          /* 🔥 ABSOLUTE NUKE: FORCE HIDE ANY INTERNAL SIDEBAR BUTTONS ON MOBILE 🔥 */
          .sidebar-container button.position-fixed,
          .sidebar-container .rounded-circle.shadow-lg,
          .sidebar-container .sidebar-toggle-btn,
          .sidebar-container .pro-sidebar-toggle {
             display: none !important;
             visibility: hidden !important;
             opacity: 0 !important;
          }
        }

        /* Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        /* Animations */
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
