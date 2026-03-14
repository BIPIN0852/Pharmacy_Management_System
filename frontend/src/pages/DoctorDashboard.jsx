// import React, { useState, useEffect, useRef } from "react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";
// import { Modal, Form, Button, Spinner, Badge } from "react-bootstrap";
// import {
//   Users,
//   CalendarCheck,
//   Clock,
//   Activity,
//   Loader2,
//   ArrowRight,
//   BellRing,
//   MessageCircle,
//   CheckCircle,
//   Send,
//   User as UserIcon,
//   MessageSquare, // ✅ FIXED: Imported missing icon
//   PlusCircle,
//   FileText,
//   Settings,
//   ChevronRight,
// } from "lucide-react";
// import { useAuth } from "../context/AuthContext";

// const DoctorDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // --- Data States ---
//   const [stats, setStats] = useState({
//     pending: 0,
//     today: 0,
//     totalPatients: 0,
//   });
//   const [recentAppointments, setRecentAppointments] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // --- Chat Modal States ---
//   const [showMessageModal, setShowMessageModal] = useState(false);
//   const [messageTarget, setMessageTarget] = useState(null);
//   const [messageText, setMessageText] = useState("");
//   const [sendingMessage, setSendingMessage] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [chatLoading, setChatLoading] = useState(false);
//   const chatScrollRef = useRef(null);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const [apptRes, patientsRes] = await Promise.all([
//           api.get("/doctor/appointments"),
//           api.get("/doctor/patients"),
//         ]);

//         const appointments = apptRes.data?.appointments || [];
//         const patients = patientsRes.data?.patients || [];

//         // 1. Calculate Stats
//         const todayStr = new Date().toDateString();
//         const pendingAppts = appointments.filter(
//           (a) => a.status?.toLowerCase() === "pending",
//         );
//         const todayAppts = appointments.filter(
//           (a) => new Date(a.date).toDateString() === todayStr,
//         );

//         setStats({
//           pending: pendingAppts.length,
//           today: todayAppts.length,
//           totalPatients: patients.length,
//         });

//         // 2. Generate Notifications
//         const alerts = pendingAppts.map((app) => ({
//           id: app._id,
//           type: "booking",
//           title: "New Appointment Request",
//           message: `${app.patient?.name || "A patient"} has requested a visit on ${new Date(app.date).toLocaleDateString()} at ${app.time}.`,
//           time: new Date(app.createdAt || Date.now()).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         }));
//         setNotifications(alerts);

//         // 3. Get recent pending/upcoming
//         const upcoming = appointments
//           .filter((a) =>
//             ["pending", "confirmed"].includes(a.status?.toLowerCase()),
//           )
//           .slice(0, 5);

//         setRecentAppointments(upcoming);
//       } catch (err) {
//         console.error("Dashboard fetch error", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//     const interval = setInterval(fetchDashboardData, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (chatScrollRef.current) {
//       chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
//     }
//   }, [chatHistory, showMessageModal]);

//   // --- Chat Logic ---
//   const handleOpenChat = async (app) => {
//     setMessageTarget(app);
//     setShowMessageModal(true);
//     setChatLoading(true);
//     setChatHistory([]);

//     try {
//       const res = await api.get(`/messages/appointment/${app._id}`);
//       setChatHistory(res.data.messages || res.data || []);
//     } catch (err) {
//       console.error("Failed to load chat history:", err);
//     } finally {
//       setChatLoading(false);
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e?.preventDefault();
//     if (!messageText.trim() || !messageTarget) return;

//     try {
//       setSendingMessage(true);
//       const payload = {
//         receiverId: messageTarget.patient?._id,
//         appointmentId: messageTarget._id,
//         text: messageText,
//         senderModel: "Doctor",
//       };

//       const res = await api.post("/messages/appointment", payload);

//       const newMsg = res.data?.message ||
//         res.data || {
//           _id: Date.now().toString(),
//           sender: user?._id,
//           senderModel: "Doctor",
//           text: messageText,
//           createdAt: new Date().toISOString(),
//         };

//       setChatHistory((prev) => [...prev, newMsg]);
//       setMessageText("");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send message.");
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   const getPatientInitials = (name) => {
//     if (!name) return "P";
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .substring(0, 2)
//       .toUpperCase();
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary" size={48} />
//       </div>
//     );
//   }

//   return (
//     <div
//       className="container-fluid py-4 px-3 px-md-4 min-vh-100 animate-fade-in"
//       style={{ backgroundColor: "#f4f7fe" }}
//     >
//       {/* 🚀 REAL-TIME NOTIFICATION BANNER */}
//       {notifications.length > 0 && (
//         <div
//           className="alert border-0 shadow-sm rounded-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between p-4 mb-4 animate-slide-down gap-3"
//           style={{
//             background: "linear-gradient(135deg, #f59e0b, #f97316)",
//             color: "white",
//           }}
//         >
//           <div className="d-flex align-items-center gap-3">
//             <div className="bg-white text-warning rounded-circle p-3 shadow-sm flex-shrink-0">
//               <BellRing size={28} className="ring-animation" />
//             </div>
//             <div>
//               <h5 className="fw-black mb-1 text-white">
//                 You have {notifications.length} new booking request(s)!
//               </h5>
//               <p className="mb-0 fw-medium text-white-50">
//                 Review and approve them to confirm your schedule.
//               </p>
//             </div>
//           </div>
//           <button
//             className="btn bg-white text-warning fw-bold rounded-pill px-4 py-2 shadow-sm flex-shrink-0 hover-lift"
//             onClick={() => navigate("/doctor/appointments")}
//           >
//             Review Now
//           </button>
//         </div>
//       )}

//       {/* HEADER */}
//       <div className="mb-4">
//         <h2 className="fw-black text-dark mb-1 tracking-tight">
//           Welcome back, Dr. {user?.name.split(" ")[0]}! 👋
//         </h2>
//         <p className="text-muted fw-medium fs-6">
//           Here is your clinical overview and schedule for today.
//         </p>
//       </div>

//       <div className="row g-4">
//         {/* ========================================================= */}
//         {/* MAIN CONTENT COLUMN (Left Side)                           */
//         /* ========================================================= */}
//         <div className="col-xl-8">
//           {/* STATS CARDS (Colorful Gradients) */}
//           <div className="row g-3 mb-4">
//             <div className="col-md-4">
//               <div
//                 className="card border-0 shadow-sm rounded-4 p-4 text-white hover-lift cursor-pointer h-100"
//                 style={{
//                   background: "linear-gradient(135deg, #3b82f6, #2563eb)",
//                 }}
//                 onClick={() => navigate("/doctor/appointments")}
//               >
//                 <div className="d-flex justify-content-between align-items-start mb-3">
//                   <div className="bg-white bg-opacity-25 p-2 rounded-3">
//                     <CalendarCheck size={24} className="text-white" />
//                   </div>
//                 </div>
//                 <h2 className="fw-black mb-0 text-white display-5">
//                   {stats.today}
//                 </h2>
//                 <p className="fw-medium mb-0 text-white-50 small text-uppercase tracking-wider">
//                   Today's Visits
//                 </p>
//               </div>
//             </div>

//             <div className="col-md-4">
//               <div
//                 className="card border-0 shadow-sm rounded-4 p-4 text-white hover-lift cursor-pointer h-100"
//                 style={{
//                   background: "linear-gradient(135deg, #10b981, #059669)",
//                 }}
//                 onClick={() => navigate("/doctor/patients")}
//               >
//                 <div className="d-flex justify-content-between align-items-start mb-3">
//                   <div className="bg-white bg-opacity-25 p-2 rounded-3">
//                     <Users size={24} className="text-white" />
//                   </div>
//                 </div>
//                 <h2 className="fw-black mb-0 text-white display-5">
//                   {stats.totalPatients}
//                 </h2>
//                 <p className="fw-medium mb-0 text-white-50 small text-uppercase tracking-wider">
//                   Total Patients
//                 </p>
//               </div>
//             </div>

//             <div className="col-md-4">
//               <div
//                 className="card border-0 shadow-sm rounded-4 p-4 text-white hover-lift cursor-pointer h-100"
//                 style={{
//                   background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
//                 }}
//                 onClick={() => navigate("/doctor/appointments")}
//               >
//                 <div className="d-flex justify-content-between align-items-start mb-3">
//                   <div className="bg-white bg-opacity-25 p-2 rounded-3">
//                     <Clock size={24} className="text-white" />
//                   </div>
//                 </div>
//                 <h2 className="fw-black mb-0 text-white display-5">
//                   {stats.pending}
//                 </h2>
//                 <p className="fw-medium mb-0 text-white-50 small text-uppercase tracking-wider">
//                   Pending Approvals
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* RECENT BOOKINGS & TRIAGE */}
//           <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
//             <div className="d-flex justify-content-between align-items-center p-4 border-bottom border-light-subtle">
//               <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
//                 <Activity className="text-primary" size={20} /> Active
//                 Consultations
//               </h5>
//               <button
//                 className="btn btn-light rounded-pill text-primary fw-bold px-3 py-1 btn-sm d-flex align-items-center gap-1 hover-lift"
//                 onClick={() => navigate("/doctor/appointments")}
//               >
//                 View Schedule <ChevronRight size={14} />
//               </button>
//             </div>

//             <div className="p-0">
//               {recentAppointments.length === 0 ? (
//                 <div className="p-5 text-center text-muted">
//                   <CheckCircle
//                     size={48}
//                     className="mb-3 opacity-25 text-success"
//                   />
//                   <h6 className="fw-bold text-dark">You are all caught up!</h6>
//                   <p className="small">
//                     You have no pending or upcoming appointments right now.
//                   </p>
//                 </div>
//               ) : (
//                 <ul className="list-group list-group-flush">
//                   {recentAppointments.map((app) => {
//                     const isPending = app.status?.toLowerCase() === "pending";

//                     return (
//                       <li
//                         key={app._id}
//                         className="list-group-item p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 hover-bg-light transition-all"
//                       >
//                         <div className="d-flex align-items-center gap-3">
//                           <div
//                             className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0"
//                             style={{
//                               width: "48px",
//                               height: "48px",
//                               fontSize: "1.1rem",
//                             }}
//                           >
//                             {getPatientInitials(app.patient?.name)}
//                           </div>
//                           <div>
//                             <div className="d-flex align-items-center gap-2 mb-1">
//                               <h6 className="fw-bold mb-0 text-dark">
//                                 {app.patient?.name || "Unknown Patient"}
//                               </h6>
//                               {isPending ? (
//                                 <Badge
//                                   bg="warning"
//                                   text="dark"
//                                   className="rounded-pill"
//                                   style={{ fontSize: "0.6rem" }}
//                                 >
//                                   Needs Approval
//                                 </Badge>
//                               ) : (
//                                 <Badge
//                                   bg="success"
//                                   className="rounded-pill"
//                                   style={{ fontSize: "0.6rem" }}
//                                 >
//                                   Confirmed
//                                 </Badge>
//                               )}
//                             </div>
//                             <small className="text-muted d-flex align-items-center gap-2 fw-medium">
//                               <CalendarCheck size={14} className="text-info" />{" "}
//                               {new Date(app.date).toLocaleDateString()} at{" "}
//                               {app.time}
//                             </small>
//                             {!isPending && (
//                               <small className="text-muted d-flex align-items-start gap-1 mt-1">
//                                 <span className="fw-bold text-dark">
//                                   Reason:
//                                 </span>{" "}
//                                 <span
//                                   className="text-truncate d-inline-block"
//                                   style={{ maxWidth: "250px" }}
//                                 >
//                                   {app.reason || "General Checkup"}
//                                 </span>
//                               </small>
//                             )}
//                           </div>
//                         </div>

//                         <div className="d-flex gap-2">
//                           <Button
//                             variant="light"
//                             className="rounded-pill fw-bold shadow-sm d-flex align-items-center gap-1 border border-light-subtle hover-lift text-dark btn-sm px-3"
//                             onClick={() => navigate("/doctor/patients")}
//                           >
//                             <UserIcon size={14} className="text-primary" />{" "}
//                             Profile
//                           </Button>

//                           {!isPending && (
//                             <Button
//                               variant="primary"
//                               className="rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2 hover-lift btn-sm px-3"
//                               onClick={() => handleOpenChat(app)}
//                             >
//                               <MessageCircle size={14} /> Chat
//                             </Button>
//                           )}
//                         </div>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ========================================================= */}
//         {/* COLORFUL QUICK ACTIONS SIDEBAR (Right Side)               */}
//         {/* ========================================================= */}
//         <div className="col-xl-4">
//           <div
//             className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4 bg-dark text-white"
//             style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}
//           >
//             <div className="p-4 border-bottom border-white border-opacity-10">
//               <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
//                 <Activity size={20} className="text-info" /> Clinic Tools
//               </h5>
//             </div>
//             <div className="p-4 d-flex flex-column gap-3">
//               <button
//                 className="btn btn-outline-light rounded-pill py-2 text-start fw-bold d-flex align-items-center gap-3 border-opacity-25 hover-lift"
//                 onClick={() => navigate("/doctor/prescriptions")}
//               >
//                 <div className="bg-white bg-opacity-10 p-2 rounded-circle">
//                   <FileText size={18} className="text-info" />
//                 </div>
//                 Write Prescription
//               </button>

//               <button
//                 className="btn btn-outline-light rounded-pill py-2 text-start fw-bold d-flex align-items-center gap-3 border-opacity-25 hover-lift"
//                 onClick={() => navigate("/doctor/appointments")}
//               >
//                 <div className="bg-white bg-opacity-10 p-2 rounded-circle">
//                   <PlusCircle size={18} className="text-success" />
//                 </div>
//                 Schedule Walk-in
//               </button>

//               <button
//                 className="btn btn-outline-light rounded-pill py-2 text-start fw-bold d-flex align-items-center gap-3 border-opacity-25 hover-lift"
//                 onClick={() => navigate("/doctor/profile")}
//               >
//                 <div className="bg-white bg-opacity-10 p-2 rounded-circle">
//                   <Settings size={18} className="text-warning" />
//                 </div>
//                 Update Clinic Profile
//               </button>
//             </div>
//           </div>

//           {/* Mini Calendar / To-Do placeholder */}
//           <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
//             <h6 className="fw-bold text-dark mb-3">Today's Timeline</h6>
//             <div className="border-start border-2 border-primary ms-2 ps-3 py-2 position-relative mb-3">
//               <div className="position-absolute top-0 start-0 translate-middle p-1 bg-primary border border-white border-2 rounded-circle"></div>
//               <div className="small fw-bold text-dark">Morning Shift</div>
//               <div className="small text-muted">9:00 AM - 1:00 PM</div>
//             </div>
//             <div className="border-start border-2 border-light-subtle ms-2 ps-3 py-2 position-relative">
//               <div className="position-absolute top-0 start-0 translate-middle p-1 bg-secondary border border-white border-2 rounded-circle"></div>
//               <div className="small fw-bold text-dark">Evening Shift</div>
//               <div className="small text-muted">4:00 PM - 8:00 PM</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ====================================================================== */}
//       {/* ✅ LIVE CHAT/MESSAGE MODAL */}
//       {/* ====================================================================== */}
//       <Modal
//         show={showMessageModal}
//         onHide={() => setShowMessageModal(false)}
//         centered
//         contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
//       >
//         <Modal.Header className="bg-primary text-white border-0 p-4 pb-3">
//           <Modal.Title className="fw-bold d-flex align-items-center gap-2 fs-5">
//             <MessageCircle size={20} /> Patient Chat
//           </Modal.Title>
//           <button
//             type="button"
//             className="btn-close btn-close-white shadow-none"
//             onClick={() => setShowMessageModal(false)}
//           ></button>
//         </Modal.Header>

//         <Modal.Body className="p-0 bg-white">
//           <div className="p-3 bg-light border-bottom border-light-subtle d-flex align-items-center gap-3">
//             <div
//               className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0"
//               style={{ width: "40px", height: "40px" }}
//             >
//               {getPatientInitials(messageTarget?.patient?.name)}
//             </div>
//             <div>
//               <h6 className="fw-bold text-dark mb-0">
//                 {messageTarget?.patient?.name || "Patient"}
//               </h6>
//               <span className="text-muted small fw-medium">
//                 Appt:{" "}
//                 {messageTarget?.date
//                   ? new Date(messageTarget.date).toLocaleDateString()
//                   : ""}
//               </span>
//             </div>
//           </div>

//           <div
//             className="p-3 bg-white d-flex flex-column custom-scrollbar"
//             style={{ height: "350px", overflowY: "auto" }}
//             ref={chatScrollRef}
//           >
//             {chatLoading ? (
//               <div className="m-auto text-center">
//                 <Spinner
//                   animation="border"
//                   size="sm"
//                   className="text-primary mb-2"
//                 />
//                 <p className="small text-muted fw-medium mb-0">
//                   Loading history...
//                 </p>
//               </div>
//             ) : chatHistory.length === 0 ? (
//               <div className="m-auto text-center text-muted opacity-50">
//                 <MessageSquare size={32} className="mb-2" />
//                 <p className="small fw-medium mb-0">
//                   No messages yet.
//                   <br />
//                   Say hello to your patient!
//                 </p>
//               </div>
//             ) : (
//               <div className="d-flex flex-column gap-3">
//                 {chatHistory.map((msg) => {
//                   const isMe =
//                     msg.senderModel === "Doctor" || msg.sender === user?._id;
//                   return (
//                     <div
//                       key={msg._id}
//                       className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"}`}
//                     >
//                       <div
//                         className={`p-3 rounded-4 shadow-sm ${isMe ? "bg-primary text-white" : "bg-light text-dark border border-light-subtle"}`}
//                         style={{
//                           maxWidth: "85%",
//                           borderBottomRightRadius: isMe ? "4px" : "16px",
//                           borderBottomLeftRadius: !isMe ? "4px" : "16px",
//                         }}
//                       >
//                         <div className="small mb-1 lh-base">{msg.text}</div>
//                         <div
//                           className={`text-end fw-medium ${isMe ? "text-white-50" : "text-muted"}`}
//                           style={{ fontSize: "0.65rem" }}
//                         >
//                           {new Date(msg.createdAt).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           <div className="p-3 bg-light border-top border-light-subtle">
//             <Form
//               onSubmit={handleSendMessage}
//               className="d-flex gap-2 align-items-end"
//             >
//               <Form.Control
//                 as="textarea"
//                 rows={1}
//                 className="border-light-subtle bg-white shadow-none focus-ring-primary rounded-pill py-2 px-3"
//                 style={{
//                   resize: "none",
//                   overflow: "hidden",
//                   minHeight: "44px",
//                 }}
//                 placeholder="Type your message..."
//                 value={messageText}
//                 onChange={(e) => setMessageText(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSendMessage();
//                   }
//                 }}
//               />
//               <Button
//                 type="submit"
//                 variant="primary"
//                 className="rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
//                 style={{ width: "44px", height: "44px" }}
//                 disabled={sendingMessage || !messageText.trim()}
//               >
//                 {sendingMessage ? (
//                   <Spinner size="sm" animation="border" />
//                 ) : (
//                   <Send size={18} className="ms-1" />
//                 )}
//               </Button>
//             </Form>
//           </div>
//         </Modal.Body>
//       </Modal>

//       <style>{`
//         .cursor-pointer { cursor: pointer; }
//         .tracking-wider { letter-spacing: 0.05em; }
//         .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
//         .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
//         .hover-bg-light:hover { background-color: #f8fafc; }
//         .transition-all { transition: all 0.2s ease; }
//         .spin-animation { animation: spin 1s linear infinite; }
//         .ring-animation { animation: ring 2s ease infinite; transform-origin: top center; }
//         .animate-slide-down { animation: slideDown 0.4s ease-out forwards; }
//         .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
//         .focus-ring-primary:focus { border-color: #2563eb; box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.25); }
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }

//         @keyframes spin { 100% { transform: rotate(360deg); } }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes slideDown {
//           from { opacity: 0; transform: translateY(-20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes ring {
//           0% { transform: rotate(0); }
//           5% { transform: rotate(15deg); }
//           10% { transform: rotate(-10deg); }
//           15% { transform: rotate(15deg); }
//           20% { transform: rotate(-10deg); }
//           25% { transform: rotate(0); }
//           100% { transform: rotate(0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DoctorDashboard;

import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Modal, Form, Button, Spinner, Badge } from "react-bootstrap";
import {
  Users,
  CalendarCheck,
  Clock,
  Activity,
  Loader2,
  ArrowRight,
  BellRing,
  MessageCircle,
  CheckCircle,
  Send,
  User as UserIcon,
  MessageSquare,
  PlusCircle,
  FileText,
  Settings,
  ChevronRight,
  Sparkles, // ✅ ADDED AI ICON
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- Data States ---
  const [stats, setStats] = useState({
    pending: 0,
    today: 0,
    totalPatients: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Chat Modal States ---
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageTarget, setMessageTarget] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef(null);

  // ✅ NEW: AI Feature States
  const [smartReplies, setSmartReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [chatSummary, setChatSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [apptRes, patientsRes] = await Promise.all([
          api.get("/doctor/appointments"),
          api.get("/doctor/patients"),
        ]);

        const appointments = apptRes.data?.appointments || [];
        const patients = patientsRes.data?.patients || [];

        // 1. Calculate Stats
        const todayStr = new Date().toDateString();
        const pendingAppts = appointments.filter(
          (a) => a.status?.toLowerCase() === "pending",
        );
        const todayAppts = appointments.filter(
          (a) => new Date(a.date).toDateString() === todayStr,
        );

        setStats({
          pending: pendingAppts.length,
          today: todayAppts.length,
          totalPatients: patients.length,
        });

        // 2. Generate Notifications
        const alerts = pendingAppts.map((app) => ({
          id: app._id,
          type: "booking",
          title: "New Appointment Request",
          message: `${app.patient?.name || "A patient"} has requested a visit on ${new Date(app.date).toLocaleDateString()} at ${app.time}.`,
          time: new Date(app.createdAt || Date.now()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setNotifications(alerts);

        // 3. Get recent pending/upcoming
        const upcoming = appointments
          .filter((a) =>
            ["pending", "confirmed"].includes(a.status?.toLowerCase()),
          )
          .slice(0, 5);

        setRecentAppointments(upcoming);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, showMessageModal]);

  // --- Chat Logic ---
  const handleOpenChat = async (app) => {
    setMessageTarget(app);
    setShowMessageModal(true);
    setChatLoading(true);
    setChatHistory([]);
    setSmartReplies([]); // Clear old replies
    setChatSummary(null); // Clear old summary

    try {
      const res = await api.get(`/messages/appointment/${app._id}`);
      setChatHistory(res.data.messages || res.data || []);

      // ✅ Trigger AI to fetch smart replies based on loaded history
      fetchSmartReplies(app._id);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!messageText.trim() || !messageTarget) return;

    try {
      setSendingMessage(true);
      const payload = {
        receiverId: messageTarget.patient?._id,
        appointmentId: messageTarget._id,
        text: messageText,
        senderModel: "Doctor",
      };

      const res = await api.post("/messages/appointment", payload);

      const newMsg = res.data?.message ||
        res.data || {
          _id: Date.now().toString(),
          sender: user?._id,
          senderModel: "Doctor",
          text: messageText,
          createdAt: new Date().toISOString(),
        };

      setChatHistory((prev) => [...prev, newMsg]);
      setMessageText("");
      setSmartReplies([]); // Clear replies once sent
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    } finally {
      setSendingMessage(false);
    }
  };

  // ✅ NEW: AI API CALLS
  const fetchSmartReplies = async (appointmentId) => {
    try {
      setLoadingReplies(true);
      const res = await api.get(`/doctor/ai/smart-replies/${appointmentId}`);
      if (res.data?.replies) setSmartReplies(res.data.replies);
    } catch (err) {
      console.error("Failed to fetch smart replies");
    } finally {
      setLoadingReplies(false);
    }
  };

  const generateSummary = async () => {
    if (!messageTarget) return;
    try {
      setLoadingSummary(true);
      const res = await api.get(`/doctor/ai/summarize/${messageTarget._id}`);
      if (res.data?.summary) setChatSummary(res.data.summary);
    } catch (err) {
      alert("Failed to generate AI summary. Ensure backend is configured.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const getPatientInitials = (name) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <Loader2 className="spin-animation text-primary" size={48} />
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-4 px-3 px-md-4 min-vh-100 animate-fade-in"
      style={{ backgroundColor: "#f4f7fe" }}
    >
      {/* 🚀 REAL-TIME NOTIFICATION BANNER */}
      {notifications.length > 0 && (
        <div
          className="alert border-0 shadow-sm rounded-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between p-4 mb-4 animate-slide-down gap-3"
          style={{
            background: "linear-gradient(135deg, #f59e0b, #f97316)",
            color: "white",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div className="bg-white text-warning rounded-circle p-3 shadow-sm flex-shrink-0">
              <BellRing size={28} className="ring-animation" />
            </div>
            <div>
              <h5 className="fw-black mb-1 text-white">
                You have {notifications.length} new booking request(s)!
              </h5>
              <p className="mb-0 fw-medium text-white-50">
                Review and approve them to confirm your schedule.
              </p>
            </div>
          </div>
          <button
            className="btn bg-white text-warning fw-bold rounded-pill px-4 py-2 shadow-sm flex-shrink-0 hover-lift"
            onClick={() => navigate("/doctor/appointments")}
          >
            Review Now
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-black text-dark mb-1 tracking-tight">
          Welcome back, Dr. {user?.name.split(" ")[0]}! 👋
        </h2>
        <p className="text-muted fw-medium fs-6">
          Here is your clinical overview and schedule for today.
        </p>
      </div>

      <div className="row g-4">
        {/* ========================================================= */}
        {/* MAIN CONTENT COLUMN (Left Side)                           */}
        {/* ========================================================= */}
        <div className="col-xl-8">
          {/* STATS CARDS (Colorful Gradients) */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm rounded-4 p-4 text-white hover-lift cursor-pointer h-100"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                }}
                onClick={() => navigate("/doctor/appointments")}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-white bg-opacity-25 p-2 rounded-3">
                    <CalendarCheck size={24} className="text-white" />
                  </div>
                </div>
                <h2 className="fw-black mb-0 text-white display-5">
                  {stats.today}
                </h2>
                <p className="fw-medium mb-0 text-white-50 small text-uppercase tracking-wider">
                  Today's Visits
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm rounded-4 p-4 text-white hover-lift cursor-pointer h-100"
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                }}
                onClick={() => navigate("/doctor/patients")}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-white bg-opacity-25 p-2 rounded-3">
                    <Users size={24} className="text-white" />
                  </div>
                </div>
                <h2 className="fw-black mb-0 text-white display-5">
                  {stats.totalPatients}
                </h2>
                <p className="fw-medium mb-0 text-white-50 small text-uppercase tracking-wider">
                  Total Patients
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm rounded-4 p-4 text-white hover-lift cursor-pointer h-100"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                }}
                onClick={() => navigate("/doctor/appointments")}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-white bg-opacity-25 p-2 rounded-3">
                    <Clock size={24} className="text-white" />
                  </div>
                </div>
                <h2 className="fw-black mb-0 text-white display-5">
                  {stats.pending}
                </h2>
                <p className="fw-medium mb-0 text-white-50 small text-uppercase tracking-wider">
                  Pending Approvals
                </p>
              </div>
            </div>
          </div>

          {/* RECENT BOOKINGS & TRIAGE */}
          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom border-light-subtle">
              <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                <Activity className="text-primary" size={20} /> Active
                Consultations
              </h5>
              <button
                className="btn btn-light rounded-pill text-primary fw-bold px-3 py-1 btn-sm d-flex align-items-center gap-1 hover-lift"
                onClick={() => navigate("/doctor/appointments")}
              >
                View Schedule <ChevronRight size={14} />
              </button>
            </div>

            <div className="p-0">
              {recentAppointments.length === 0 ? (
                <div className="p-5 text-center text-muted">
                  <CheckCircle
                    size={48}
                    className="mb-3 opacity-25 text-success"
                  />
                  <h6 className="fw-bold text-dark">You are all caught up!</h6>
                  <p className="small">
                    You have no pending or upcoming appointments right now.
                  </p>
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {recentAppointments.map((app) => {
                    const isPending = app.status?.toLowerCase() === "pending";

                    return (
                      <li
                        key={app._id}
                        className="list-group-item p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 hover-bg-light transition-all"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0"
                            style={{
                              width: "48px",
                              height: "48px",
                              fontSize: "1.1rem",
                            }}
                          >
                            {getPatientInitials(app.patient?.name)}
                          </div>
                          <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <h6 className="fw-bold mb-0 text-dark">
                                {app.patient?.name || "Unknown Patient"}
                              </h6>
                              {isPending ? (
                                <Badge
                                  bg="warning"
                                  text="dark"
                                  className="rounded-pill"
                                  style={{ fontSize: "0.6rem" }}
                                >
                                  Needs Approval
                                </Badge>
                              ) : (
                                <Badge
                                  bg="success"
                                  className="rounded-pill"
                                  style={{ fontSize: "0.6rem" }}
                                >
                                  Confirmed
                                </Badge>
                              )}
                            </div>
                            <small className="text-muted d-flex align-items-center gap-2 fw-medium">
                              <CalendarCheck size={14} className="text-info" />{" "}
                              {new Date(app.date).toLocaleDateString()} at{" "}
                              {app.time}
                            </small>
                            {!isPending && (
                              <small className="text-muted d-flex align-items-start gap-1 mt-1">
                                <span className="fw-bold text-dark">
                                  Reason:
                                </span>{" "}
                                <span
                                  className="text-truncate d-inline-block"
                                  style={{ maxWidth: "250px" }}
                                >
                                  {app.reason || "General Checkup"}
                                </span>
                              </small>
                            )}
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <Button
                            variant="light"
                            className="rounded-pill fw-bold shadow-sm d-flex align-items-center gap-1 border border-light-subtle hover-lift text-dark btn-sm px-3"
                            onClick={() => navigate("/doctor/patients")}
                          >
                            <UserIcon size={14} className="text-primary" />{" "}
                            Profile
                          </Button>

                          {!isPending && (
                            <Button
                              variant="primary"
                              className="rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2 hover-lift btn-sm px-3"
                              onClick={() => handleOpenChat(app)}
                            >
                              <MessageCircle size={14} /> Chat
                            </Button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLORFUL QUICK ACTIONS SIDEBAR (Right Side)               */}
        {/* ========================================================= */}
        <div className="col-xl-4">
          <div
            className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4 bg-dark text-white"
            style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}
          >
            <div className="p-4 border-bottom border-white border-opacity-10">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Activity size={20} className="text-info" /> Clinic Tools
              </h5>
            </div>
            <div className="p-4 d-flex flex-column gap-3">
              <button
                className="btn btn-outline-light rounded-pill py-2 text-start fw-bold d-flex align-items-center gap-3 border-opacity-25 hover-lift"
                onClick={() => navigate("/doctor/prescriptions")}
              >
                <div className="bg-white bg-opacity-10 p-2 rounded-circle">
                  <FileText size={18} className="text-info" />
                </div>
                Write Prescription
              </button>

              <button
                className="btn btn-outline-light rounded-pill py-2 text-start fw-bold d-flex align-items-center gap-3 border-opacity-25 hover-lift"
                onClick={() => navigate("/doctor/appointments")}
              >
                <div className="bg-white bg-opacity-10 p-2 rounded-circle">
                  <PlusCircle size={18} className="text-success" />
                </div>
                Schedule Walk-in
              </button>

              <button
                className="btn btn-outline-light rounded-pill py-2 text-start fw-bold d-flex align-items-center gap-3 border-opacity-25 hover-lift"
                onClick={() => navigate("/doctor/profile")}
              >
                <div className="bg-white bg-opacity-10 p-2 rounded-circle">
                  <Settings size={18} className="text-warning" />
                </div>
                Update Clinic Profile
              </button>
            </div>
          </div>

          {/* Mini Calendar / To-Do placeholder */}
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
            <h6 className="fw-bold text-dark mb-3">Today's Timeline</h6>
            <div className="border-start border-2 border-primary ms-2 ps-3 py-2 position-relative mb-3">
              <div className="position-absolute top-0 start-0 translate-middle p-1 bg-primary border border-white border-2 rounded-circle"></div>
              <div className="small fw-bold text-dark">Morning Shift</div>
              <div className="small text-muted">9:00 AM - 1:00 PM</div>
            </div>
            <div className="border-start border-2 border-light-subtle ms-2 ps-3 py-2 position-relative">
              <div className="position-absolute top-0 start-0 translate-middle p-1 bg-secondary border border-white border-2 rounded-circle"></div>
              <div className="small fw-bold text-dark">Evening Shift</div>
              <div className="small text-muted">4:00 PM - 8:00 PM</div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* ✅ LIVE CHAT & AI MODAL */}
      {/* ====================================================================== */}
      <Modal
        show={showMessageModal}
        onHide={() => {
          setShowMessageModal(false);
          setChatSummary(null);
          setSmartReplies([]);
        }}
        centered
        contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
      >
        <Modal.Header className="bg-primary text-white border-0 p-4 pb-3">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2 fs-5">
            <MessageCircle size={20} /> Patient Chat
          </Modal.Title>

          {/* ✅ NEW: AI Summary Button */}
          <Button
            variant="light"
            size="sm"
            className="ms-auto me-3 text-primary fw-bold d-flex align-items-center gap-1 shadow-sm hover-lift"
            onClick={generateSummary}
            disabled={loadingSummary || chatHistory.length < 2}
            title={
              chatHistory.length < 2
                ? "Need more messages to summarize"
                : "Generate Clinical Summary"
            }
          >
            {loadingSummary ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <Sparkles size={14} />
            )}
            AI Summary
          </Button>

          <button
            type="button"
            className="btn-close btn-close-white shadow-none"
            onClick={() => {
              setShowMessageModal(false);
              setChatSummary(null);
            }}
          ></button>
        </Modal.Header>

        <Modal.Body className="p-0 bg-white">
          <div className="p-3 bg-light border-bottom border-light-subtle d-flex align-items-center gap-3">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0"
              style={{ width: "40px", height: "40px" }}
            >
              {getPatientInitials(messageTarget?.patient?.name)}
            </div>
            <div>
              <h6 className="fw-bold text-dark mb-0">
                {messageTarget?.patient?.name || "Patient"}
              </h6>
              <span className="text-muted small fw-medium">
                Appt:{" "}
                {messageTarget?.date
                  ? new Date(messageTarget.date).toLocaleDateString()
                  : ""}
              </span>
            </div>
          </div>

          {/* ✅ NEW: AI SUMMARY BANNER */}
          {chatSummary && (
            <div className="bg-primary bg-opacity-10 p-3 border-bottom border-primary border-opacity-25 d-flex gap-3 align-items-start animate-fade-in">
              <Sparkles size={20} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h6 className="fw-bold text-primary mb-1">
                  AI Clinical Summary
                </h6>
                <p className="small text-dark mb-0 fw-medium lh-sm">
                  {chatSummary}
                </p>
              </div>
              <button
                className="btn-close ms-auto flex-shrink-0"
                onClick={() => setChatSummary(null)}
              ></button>
            </div>
          )}

          <div
            className="p-3 bg-white d-flex flex-column custom-scrollbar"
            style={{
              height: chatSummary ? "260px" : "350px",
              overflowY: "auto",
            }}
            ref={chatScrollRef}
          >
            {chatLoading ? (
              <div className="m-auto text-center">
                <Spinner
                  animation="border"
                  size="sm"
                  className="text-primary mb-2"
                />
                <p className="small text-muted fw-medium mb-0">
                  Loading history...
                </p>
              </div>
            ) : chatHistory.length === 0 ? (
              <div className="m-auto text-center text-muted opacity-50">
                <MessageSquare size={32} className="mb-2" />
                <p className="small fw-medium mb-0">
                  No messages yet.
                  <br />
                  Say hello to your patient!
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {chatHistory.map((msg) => {
                  const isMe =
                    msg.senderModel === "Doctor" || msg.sender === user?._id;
                  return (
                    <div
                      key={msg._id}
                      className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"}`}
                    >
                      <div
                        className={`p-3 rounded-4 shadow-sm ${isMe ? "bg-primary text-white" : "bg-light text-dark border border-light-subtle"}`}
                        style={{
                          maxWidth: "85%",
                          borderBottomRightRadius: isMe ? "4px" : "16px",
                          borderBottomLeftRadius: !isMe ? "4px" : "16px",
                        }}
                      >
                        <div className="small mb-1 lh-base">{msg.text}</div>
                        <div
                          className={`text-end fw-medium ${isMe ? "text-white-50" : "text-muted"}`}
                          style={{ fontSize: "0.65rem" }}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ✅ NEW: AI SMART REPLIES CHIPS */}
          {loadingReplies ? (
            <div className="px-3 py-2 bg-light d-flex gap-2 align-items-center border-top border-light-subtle">
              <Spinner animation="grow" size="sm" className="text-primary" />
              <span className="small text-muted fw-bold">
                AI generating replies...
              </span>
            </div>
          ) : smartReplies.length > 0 ? (
            <div className="px-3 py-2 bg-light d-flex gap-2 overflow-auto custom-scrollbar border-top border-light-subtle align-items-center">
              <span className="small text-primary fw-bold d-flex align-items-center me-1 flex-shrink-0">
                <Sparkles size={14} className="me-1" /> AI:
              </span>
              {smartReplies.map((reply, idx) => (
                <button
                  key={idx}
                  className="btn btn-sm btn-outline-primary rounded-pill text-nowrap shadow-sm bg-white"
                  style={{ fontSize: "0.75rem", fontWeight: "600" }}
                  onClick={() => setMessageText(reply)} // Auto-fills the input box
                >
                  {reply}
                </button>
              ))}
            </div>
          ) : null}

          <div className="p-3 bg-light border-top border-light-subtle">
            <Form
              onSubmit={handleSendMessage}
              className="d-flex gap-2 align-items-end"
            >
              <Form.Control
                as="textarea"
                rows={1}
                className="border-light-subtle bg-white shadow-none focus-ring-primary rounded-pill py-2 px-3"
                style={{
                  resize: "none",
                  overflow: "hidden",
                  minHeight: "44px",
                }}
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                type="submit"
                variant="primary"
                className="rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                style={{ width: "44px", height: "44px" }}
                disabled={sendingMessage || !messageText.trim()}
              >
                {sendingMessage ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <Send size={18} className="ms-1" />
                )}
              </Button>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .tracking-wider { letter-spacing: 0.05em; }
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
        .hover-bg-light:hover { background-color: #f8fafc; }
        .transition-all { transition: all 0.2s ease; }
        .spin-animation { animation: spin 1s linear infinite; }
        .ring-animation { animation: ring 2s ease infinite; transform-origin: top center; }
        .animate-slide-down { animation: slideDown 0.4s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .focus-ring-primary:focus { border-color: #2563eb; box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.25); }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { 
          from { opacity: 0; transform: translateY(-20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes ring {
          0% { transform: rotate(0); }
          5% { transform: rotate(15deg); }
          10% { transform: rotate(-10deg); }
          15% { transform: rotate(15deg); }
          20% { transform: rotate(-10deg); }
          25% { transform: rotate(0); }
          100% { transform: rotate(0); }
        }
      `}</style>
    </div>
  );
};

export default DoctorDashboard;
