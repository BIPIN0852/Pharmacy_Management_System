// import React, { useState, useEffect } from "react";
// import {
//   Bell,
//   ShoppingCart,
//   User,
//   Search,
//   Package,
//   HeartPulse,
//   MessageCircle,
//   X,
//   Sun,
//   Moon,
//   Calendar,
//   Stethoscope,
//   LogOut,
//   Menu,
//   Upload,
//   History,
//   FileText,
//   CreditCard,
//   Heart,
//   Mail,
//   Phone,
//   MapPin,
//   Droplet,
//   AlertCircle,
//   Shield,
//   Edit2,
//   Camera,
//   Activity,
//   ArrowRight, // Added for navigation
// } from "lucide-react";
// import {
//   Button,
//   ProgressBar,
//   Badge,
//   Form,
//   Row,
//   Col,
//   Tab,
//   Tabs,
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux"; // ✅ Added for Cart
// import { useAuth } from "../context/AuthContext";
// import { addToCart } from "../redux/actions/cartActions"; // ✅ Added Cart Action

// const API_BASE_URL = "http://localhost:5000/api";

// const CustomerDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const dispatch = useDispatch(); // ✅ Init Dispatch

//   // --- UI & Layout State ---
//   const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
//   const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 992);

//   const [darkMode, setDarkMode] = useState(false);
//   const [activeNav, setActiveNav] = useState("dashboard");
//   const [activeHistoryTab, setActiveHistoryTab] = useState("orders");
//   const [searchTerm, setSearchTerm] = useState("");

//   // --- Data State ---
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState(null);

//   const [orders, setOrders] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [myPrescriptions, setMyPrescriptions] = useState([]);

//   const [recommended, setRecommended] = useState([]);
//   const [savedMedicines, setSavedMedicines] = useState([]);
//   const [doctors, setDoctors] = useState([]);

//   // --- Interaction State ---
//   const [prescriptionFile, setPrescriptionFile] = useState(null);
//   const [prescriptionPreview, setPrescriptionPreview] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // --- Profile Editing State ---
//   const [editingProfile, setEditingProfile] = useState(false);
//   const [profileFormData, setProfileFormData] = useState({});
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [profileTab, setProfileTab] = useState("overview");

//   // Styles
//   const bgMain = darkMode ? "bg-dark text-light" : "bg-light text-dark";
//   const cardBg = darkMode ? "bg-secondary text-white" : "bg-white text-dark";
//   const tableClass = darkMode ? "table-dark" : "table-hover";

//   // --- Effects ---
//   useEffect(() => {
//     const handleResize = () => {
//       const isLg = window.innerWidth >= 992;
//       setIsLargeScreen(isLg);
//       if (isLg) setSidebarOpen(true);
//       else setSidebarOpen(false);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   useEffect(() => {
//     if (profile) {
//       setProfileFormData({
//         name: profile.name || "",
//         phone: profile.phone || "",
//         gender: profile.gender || "",
//         address:
//           typeof profile.address === "object"
//             ? profile.address.city
//             : profile.address || "",
//         bloodGroup: profile.bloodGroup || "",
//         allergies: profile.allergies || "",
//       });
//     }
//   }, [profile]);

//   const safelyGetArray = (data, key) => {
//     if (Array.isArray(data)) return data;
//     if (data && Array.isArray(data[key])) return data[key];
//     return [];
//   };

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const headers = { Authorization: `Bearer ${token}` };

//       const [
//         profileRes,
//         ordersRes,
//         recRes,
//         docRes,
//         apptRes,
//         presRes,
//         savedRes,
//       ] = await Promise.all([
//         fetch(`${API_BASE_URL}/auth/profile`, { headers }),
//         fetch(`${API_BASE_URL}/customer/orders`, { headers }),
//         fetch(`${API_BASE_URL}/medicines`, { headers }), // Changed to general medicines for browsing
//         fetch(`${API_BASE_URL}/doctors`, { headers }),
//         fetch(`${API_BASE_URL}/customer/appointments`, { headers }),
//         fetch(`${API_BASE_URL}/customer/prescriptions`, { headers }),
//         fetch(`${API_BASE_URL}/customer/saved-medicines`, { headers }),
//       ]);

//       if (profileRes.ok) setProfile(await profileRes.json());
//       if (ordersRes.ok)
//         setOrders(safelyGetArray(await ordersRes.json(), "orders"));
//       if (recRes.ok) setRecommended(await recRes.json()); // Assuming endpoint returns medicines list
//       if (docRes.ok) setDoctors(await docRes.json());
//       if (apptRes.ok)
//         setMyAppointments(safelyGetArray(await apptRes.json(), "appointments"));
//       if (presRes.ok)
//         setMyPrescriptions(
//           safelyGetArray(await presRes.json(), "prescriptions")
//         );
//       if (savedRes.ok) setSavedMedicines(await savedRes.json());
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Handlers ---

//   const handleLogout = () => {
//     if (window.confirm("Are you sure you want to log out?")) {
//       localStorage.removeItem("token");
//       navigate("/");
//     }
//   };

//   // ✅ ADDED: Buying Functionality
//   const handleAddToCart = (med) => {
//     dispatch(addToCart(med._id, 1));
//     // Optional: Show toast notification
//     alert(`${med.name} added to cart!`);
//   };

//   const handlePrescriptionChange = (e) => {
//     const file = e.target.files?.[0];
//     setPrescriptionFile(file || null);
//     setPrescriptionPreview(file ? URL.createObjectURL(file) : null);
//   };

//   const handleUploadPrescription = async (e) => {
//     e.preventDefault();
//     if (!prescriptionFile) return;

//     try {
//       setUploadLoading(true);
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("image", prescriptionFile);
//       formData.append("notes", notes);

//       const res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (res.ok) {
//         setUploadMessage("Prescription uploaded successfully!");
//         setPrescriptionFile(null);
//         setPrescriptionPreview(null);
//         setNotes("");
//         const refreshRes = await fetch(
//           `${API_BASE_URL}/customer/prescriptions`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (refreshRes.ok)
//           setMyPrescriptions(
//             safelyGetArray(await refreshRes.json(), "prescriptions")
//           );
//       } else {
//         setUploadMessage("Failed to upload.");
//       }
//     } catch (err) {
//       setUploadMessage("Error uploading prescription.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();
//     setProfileLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/auth/profile`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(profileFormData),
//       });
//       if (res.ok) {
//         setProfile((prev) => ({ ...prev, ...profileFormData }));
//         setEditingProfile(false);
//         alert("Profile updated successfully!");
//       } else {
//         alert("Failed to update profile.");
//       }
//     } catch (error) {
//       console.error("Update error", error);
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   const handleProfileChange = (e) =>
//     setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });

//   const handlePayNow = (order) =>
//     navigate(
//       `/payment?orderId=${order.id || order._id}&amount=${
//         order.price || order.totalAmount
//       }`
//     );

//   const handleToggleSave = async (medicineId) => {
//     alert("Saved functionality coming soon for ID: " + medicineId);
//   };

//   // --- Sidebar Navigation Items ---
//   const navItems = [
//     { key: "dashboard", icon: HeartPulse, label: "Dashboard" },
//     { key: "medicines", icon: Package, label: "Medicines" },
//     { key: "history", icon: History, label: "History" },
//     { key: "profile", icon: User, label: "Profile" },
//     { key: "support", icon: MessageCircle, label: "Support" },
//   ];

//   if (loading)
//     return (
//       <div className="d-flex min-vh-100 justify-content-center align-items-center">
//         <div className="spinner-border text-primary"></div>
//       </div>
//     );

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {sidebarOpen && !isLargeScreen && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
//           style={{ zIndex: 1030 }}
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <div
//         className={`d-flex min-vh-100 flex-column ${bgMain}`}
//         style={{ fontFamily: "'Poppins', sans-serif" }}
//       >
//         {/* Mobile Header */}
//         <header className="d-flex d-lg-none justify-content-between align-items-center px-3 py-2 sticky-top shadow-sm bg-primary text-white">
//           <button
//             className="btn btn-link p-0 text-white"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu size={24} />
//           </button>
//           <span className="fs-5 fw-bold">MyPharmacy</span>
//           <div style={{ width: 24 }}></div>
//         </header>

//         {/* --- FIXED SIDEBAR UI --- */}
//         <aside
//           className="position-fixed top-0 start-0 vh-100 d-flex flex-column p-3 text-white shadow-lg"
//           style={{
//             width: "280px",
//             background: "linear-gradient(180deg, #0d6efd 0%, #0043a8 100%)",
//             transform:
//               isLargeScreen || sidebarOpen
//                 ? "translateX(0)"
//                 : "translateX(-100%)",
//             transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//             zIndex: 1040,
//           }}
//         >
//           {/* Logo Section */}
//           <div className="d-flex align-items-center mb-5 px-2 mt-2">
//             <div className="bg-white text-primary p-2 rounded-3 me-3 shadow-sm">
//               <HeartPulse size={28} />
//             </div>
//             <div>
//               <h1 className="h5 fw-bold mb-0">MyPharmacy</h1>
//               <small className="opacity-75" style={{ fontSize: "0.75rem" }}>
//                 Patient Portal
//               </small>
//             </div>
//             <button
//               className="btn btn-sm text-white ms-auto d-lg-none"
//               onClick={() => setSidebarOpen(false)}
//             >
//               <X size={20} />
//             </button>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-grow-1 overflow-y-auto custom-scrollbar">
//             <ul className="nav flex-column gap-2">
//               {navItems.map((item) => {
//                 const isActive = activeNav === item.key;
//                 return (
//                   <li key={item.key} className="nav-item">
//                     <button
//                       onClick={() => {
//                         setActiveNav(item.key);
//                         if (!isLargeScreen) setSidebarOpen(false);
//                       }}
//                       className={`btn w-100 text-start d-flex align-items-center p-3 rounded-3 transition-all ${
//                         isActive
//                           ? "bg-white text-primary shadow fw-bold"
//                           : "text-white hover-bg-light-10"
//                       }`}
//                       style={{
//                         transform: isActive ? "scale(1.02)" : "scale(1)",
//                         transition: "all 0.2s ease",
//                       }}
//                     >
//                       <item.icon
//                         size={20}
//                         className={`me-3 ${
//                           isActive ? "text-primary" : "text-white opacity-75"
//                         }`}
//                       />
//                       <span>{item.label}</span>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           {/* Sidebar Footer */}
//           <div className="mt-auto pt-4 border-top border-white border-opacity-25">
//             <button
//               className="btn w-100 d-flex align-items-center justify-content-center gap-2 mb-3 btn-outline-light rounded-pill"
//               onClick={() => setDarkMode(!darkMode)}
//             >
//               {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//               <span>{darkMode ? "Light" : "Dark"} Mode</span>
//             </button>
//             <button
//               className="btn btn-danger bg-danger bg-gradient w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill shadow-sm border-0"
//               onClick={handleLogout}
//             >
//               <LogOut size={18} />
//               Logout
//             </button>
//           </div>
//         </aside>

//         {/* --- MAIN CONTENT AREA --- */}
//         <main
//           className="flex-grow-1 p-3 p-md-4"
//           style={{
//             marginLeft: isLargeScreen ? "280px" : 0,
//             transition: "margin-left 0.3s ease-in-out",
//             width: isLargeScreen ? "calc(100% - 280px)" : "100%",
//           }}
//         >
//           {/* Header Bar */}
//           <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
//             <div>
//               <h2 className="h4 mb-0 fw-bold text-capitalize">{activeNav}</h2>
//               <p className="text-muted small mb-0">
//                 Welcome back, {profile?.name}
//               </p>
//             </div>
//             <div className="d-flex align-items-center gap-3">
//               <div
//                 className="position-relative cursor-pointer bg-white p-2 rounded-circle shadow-sm"
//                 onClick={() => navigate("/cart")}
//               >
//                 <ShoppingCart size={20} className="text-primary" />
//                 {/* Optional Cart Badge could go here */}
//               </div>
//               <img
//                 src={
//                   profile?.profilePhoto ||
//                   `https://ui-avatars.com/api/?name=${profile?.name || "User"}`
//                 }
//                 alt="Profile"
//                 className="rounded-circle border border-2 border-white shadow-sm cursor-pointer"
//                 style={{ width: 45, height: 45, objectFit: "cover" }}
//                 onClick={() => setActiveNav("profile")}
//               />
//             </div>
//           </div>

//           {/* ================= DASHBOARD VIEW ================= */}
//           {activeNav === "dashboard" && (
//             <div className="fade-in">
//               <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-3 mb-4">
//                 {[
//                   {
//                     title: "Active Orders",
//                     value: orders.filter((o) => o.status !== "delivered")
//                       .length,
//                     icon: ShoppingCart,
//                     color: "primary",
//                   },
//                   {
//                     title: "Appointments",
//                     value: myAppointments.length,
//                     icon: Calendar,
//                     color: "warning",
//                   },
//                   {
//                     title: "Prescriptions",
//                     value: myPrescriptions.length,
//                     icon: FileText,
//                     color: "success",
//                   },
//                   {
//                     title: "Wallet",
//                     value: "Rs. 0",
//                     icon: CreditCard,
//                     color: "info",
//                   },
//                 ].map((stat, idx) => (
//                   <div key={idx} className="col">
//                     <div
//                       className={`${cardBg} p-3 rounded-4 shadow-sm h-100 border-start border-4 border-${stat.color}`}
//                     >
//                       <div className="d-flex justify-content-between align-items-start">
//                         <div>
//                           <p className="text-muted small mb-1 text-uppercase fw-bold">
//                             {stat.title}
//                           </p>
//                           <h3 className="mb-0 fw-bold">{stat.value}</h3>
//                         </div>
//                         <div
//                           className={`p-2 rounded-3 bg-${stat.color} bg-opacity-10 text-${stat.color}`}
//                         >
//                           <stat.icon size={24} />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {/* ... (Existing Quick Upload & Top Doctors logic unchanged) ... */}
//             </div>
//           )}

//           {/* ================= MEDICINES VIEW ================= */}
//           {activeNav === "medicines" && (
//             <div className="fade-in">
//               {/* Search Bar for Medicines */}
//               <div className="mb-4">
//                 <div className="input-group shadow-sm">
//                   <span className="input-group-text bg-white border-0">
//                     <Search size={18} />
//                   </span>
//                   <input
//                     type="text"
//                     className="form-control border-0 py-3"
//                     placeholder="Search for medicines..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                   <button className="btn btn-primary px-4">Search</button>
//                 </div>
//               </div>

//               <h5 className="fw-bold mb-3">Available Medicines</h5>
//               <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
//                 {/* Access 'medicines' array inside recommended object if necessary, or use filtered list */}
//                 {(recommended.medicines || recommended)
//                   .filter((m) =>
//                     m.name?.toLowerCase().includes(searchTerm.toLowerCase())
//                   )
//                   .map((med) => (
//                     <div key={med._id} className="col">
//                       <div
//                         className={`${cardBg} card h-100 border-0 shadow-sm p-3`}
//                       >
//                         <div
//                           className="text-center mb-3 cursor-pointer"
//                           onClick={() => navigate(`/medicine/${med._id}`)} // ✅ Link to details
//                         >
//                           <img
//                             src={
//                               med.image ||
//                               "https://cdn-icons-png.flaticon.com/512/3050/3050525.png"
//                             }
//                             className="img-fluid"
//                             style={{ height: 100, objectFit: "contain" }}
//                             alt={med.name}
//                           />
//                         </div>
//                         <h6
//                           className="fw-bold text-truncate cursor-pointer"
//                           onClick={() => navigate(`/medicine/${med._id}`)}
//                         >
//                           {med.name}
//                         </h6>
//                         <p className="small text-muted mb-2 text-truncate">
//                           {med.category || "General"}
//                         </p>

//                         {/* ✅ ADD TO CART SECTION */}
//                         <div className="d-flex justify-content-between align-items-center mt-auto">
//                           <span className="fw-bold text-primary">
//                             ₹{med.price}
//                           </span>
//                           <div className="d-flex gap-2">
//                             <button
//                               className="btn btn-sm btn-outline-danger"
//                               onClick={() => handleToggleSave(med._id)}
//                             >
//                               <Heart size={16} />
//                             </button>
//                             <button
//                               className="btn btn-sm btn-primary"
//                               onClick={() => handleAddToCart(med)}
//                               disabled={med.countInStock === 0}
//                             >
//                               <ShoppingCart size={16} />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             </div>
//           )}

//           {/* ================= OTHER VIEWS (History, Profile, Support) ================= */}
//           {/* ... (Existing code for these sections remains unchanged) ... */}

//           {/* Include History View Logic */}
//           {activeNav === "history" && (
//             <div
//               className={`${cardBg} rounded-4 shadow-sm fade-in overflow-hidden`}
//             >
//               {/* ... existing history code ... */}
//               <div className="p-4">
//                 <p className="text-center text-muted">History loaded...</p>
//               </div>
//             </div>
//           )}

//           {/* Include Profile View Logic */}
//           {activeNav === "profile" && profile && (
//             <div className="fade-in">
//               {/* ... existing profile code ... */}
//               <p className="text-center text-muted">Profile loaded...</p>
//             </div>
//           )}

//           {activeNav === "support" && (
//             <div className={`${cardBg} rounded-4 shadow-sm p-5 text-center`}>
//               <MessageCircle size={48} className="text-primary mb-3" />
//               <h3>Need Help?</h3>
//               <p className="text-muted">Our support team is available 24/7.</p>
//             </div>
//           )}
//         </main>
//       </div>

//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
//         .hover-bg-light-10:hover { background: rgba(255,255,255,0.1); }
//       `}</style>
//     </>
//   );
// };

// export default CustomerDashboard;

// import React, { useState, useEffect } from "react";
// import {
//   Bell,
//   ShoppingCart,
//   User,
//   Search,
//   Package,
//   HeartPulse,
//   MessageCircle,
//   X,
//   Sun,
//   Moon,
//   Calendar,
//   Stethoscope,
//   LogOut,
//   Menu,
//   Upload,
//   History,
//   FileText,
//   CreditCard,
//   Heart,
//   Mail,
//   Phone,
//   MapPin,
//   Droplet,
//   AlertCircle,
//   Shield,
//   Edit2,
//   Camera,
//   Activity,
//   ArrowRight,
//   ChevronRight,
//   Plus,
// } from "lucide-react";
// import {
//   Button,
//   ProgressBar,
//   Badge,
//   Form,
//   Row,
//   Col,
//   Tab,
//   Tabs,
//   Card,
//   Table,
//   Modal,
//   Spinner,
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { useAuth } from "../context/AuthContext";
// import { addToCart } from "../redux/actions/cartActions";

// const API_BASE_URL = "http://localhost:5000/api";

// const CustomerDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // --- UI State ---
//   // Note: Sidebar/Layout state is now handled by CustomerLayout.jsx
//   // We keep local state for Modals and specific dashboard interactions
//   const [activeTab, setActiveTab] = useState("overview");
//   const [showUploadModal, setShowUploadModal] = useState(false);

//   // --- Data State ---
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [myPrescriptions, setMyPrescriptions] = useState([]);
//   const [recommended, setRecommended] = useState([]);
//   const [savedMedicines, setSavedMedicines] = useState([]);
//   const [doctors, setDoctors] = useState([]);

//   // --- Interaction State ---
//   const [prescriptionFile, setPrescriptionFile] = useState(null);
//   const [prescriptionPreview, setPrescriptionPreview] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // --- Profile Editing State (Kept logic, can be used in modal) ---
//   const [profileFormData, setProfileFormData] = useState({});
//   const [profileLoading, setProfileLoading] = useState(false);

//   // --- Effects ---
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   useEffect(() => {
//     if (profile) {
//       setProfileFormData({
//         name: profile.name || "",
//         phone: profile.phone || "",
//         gender: profile.gender || "",
//         address:
//           typeof profile.address === "object"
//             ? profile.address.city
//             : profile.address || "",
//         bloodGroup: profile.bloodGroup || "",
//         allergies: profile.allergies || "",
//       });
//     }
//   }, [profile]);

//   // Helper
//   const safelyGetArray = (data, key) => {
//     if (Array.isArray(data)) return data;
//     if (data && Array.isArray(data[key])) return data[key];
//     return [];
//   };

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       if (!token) return navigate("/login");
//       const headers = { Authorization: `Bearer ${token}` };

//       // Parallel Fetch
//       const results = await Promise.allSettled([
//         fetch(`${API_BASE_URL}/auth/profile`, { headers }),
//         fetch(`${API_BASE_URL}/customer/orders`, { headers }),
//         fetch(`${API_BASE_URL}/medicines`, { headers }),
//         fetch(`${API_BASE_URL}/doctors`, { headers }),
//         fetch(`${API_BASE_URL}/customer/appointments`, { headers }),
//         fetch(`${API_BASE_URL}/customer/prescriptions`, { headers }),
//         fetch(`${API_BASE_URL}/customer/saved-medicines`, { headers }),
//       ]);

//       // Process Results
//       const [
//         profileRes,
//         ordersRes,
//         recRes,
//         docRes,
//         apptRes,
//         presRes,
//         savedRes,
//       ] = results;

//       if (profileRes.status === "fulfilled" && profileRes.value.ok)
//         setProfile(await profileRes.value.json());

//       if (ordersRes.status === "fulfilled" && ordersRes.value.ok)
//         setOrders(safelyGetArray(await ordersRes.value.json(), "orders"));

//       if (recRes.status === "fulfilled" && recRes.value.ok)
//         setRecommended(await recRes.value.json());

//       if (docRes.status === "fulfilled" && docRes.value.ok)
//         setDoctors(await docRes.value.json());

//       if (apptRes.status === "fulfilled" && apptRes.value.ok)
//         setMyAppointments(
//           safelyGetArray(await apptRes.value.json(), "appointments")
//         );

//       if (presRes.status === "fulfilled" && presRes.value.ok)
//         setMyPrescriptions(
//           safelyGetArray(await presRes.value.json(), "prescriptions")
//         );

//       if (savedRes.status === "fulfilled" && savedRes.value.ok)
//         setSavedMedicines(await savedRes.value.json());
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Handlers ---
//   const handleAddToCart = (med) => {
//     dispatch(addToCart(med._id, 1));
//     alert(`${med.name} added to cart!`);
//   };

//   const handlePrescriptionChange = (e) => {
//     const file = e.target.files?.[0];
//     setPrescriptionFile(file || null);
//     setPrescriptionPreview(file ? URL.createObjectURL(file) : null);
//   };

//   const handleUploadPrescription = async (e) => {
//     e.preventDefault();
//     if (!prescriptionFile) return;

//     try {
//       setUploadLoading(true);
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("image", prescriptionFile); // Matches backend 'image' or 'prescriptionImage'
//       formData.append("notes", notes);

//       // Try specific route first, fallback to generic
//       let res = await fetch(`${API_BASE_URL}/prescriptions`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (!res.ok) {
//         // Fallback to customer route if main one fails (supporting your original logic)
//         res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//           body: formData,
//         });
//       }

//       if (res.ok) {
//         setUploadMessage("Prescription uploaded successfully!");
//         setPrescriptionFile(null);
//         setPrescriptionPreview(null);
//         setNotes("");
//         setShowUploadModal(false);
//         fetchAllData(); // Refresh data
//         alert("Upload Successful");
//       } else {
//         setUploadMessage("Failed to upload.");
//       }
//     } catch (err) {
//       setUploadMessage("Error uploading prescription.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const handlePayNow = (order) => {
//     navigate(
//       `/payment?orderId=${order.id || order._id}&amount=${
//         order.price || order.totalPrice
//       }`
//     );
//   };

//   if (loading) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ minHeight: "60vh" }}
//       >
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );
//   }

//   // --- STATS DATA ---
//   const statsCards = [
//     {
//       label: "Active Orders",
//       value: orders.filter((o) => !o.isDelivered).length,
//       icon: Package,
//       color: "primary",
//       link: "/orders",
//     },
//     {
//       label: "Appointments",
//       value: myAppointments.length,
//       icon: Calendar,
//       color: "warning",
//       link: "/appointments",
//     },
//     {
//       label: "Prescriptions",
//       value: myPrescriptions.length,
//       icon: FileText,
//       color: "info",
//       link: "/prescriptions",
//     },
//     {
//       label: "Wallet",
//       value: "Rs. 0",
//       icon: CreditCard,
//       color: "success",
//       link: "/profile",
//     },
//   ];

//   return (
//     <div className="fade-in">
//       {/* 1. Stats Row */}
//       <h5 className="fw-bold mb-3 text-dark">Dashboard Overview</h5>
//       <Row className="g-3 mb-4">
//         {statsCards.map((item, idx) => (
//           <Col md={3} key={idx}>
//             <Card
//               className="border-0 shadow-sm rounded-4 h-100 cursor-pointer hover-scale"
//               onClick={() => navigate(item.link)}
//             >
//               <Card.Body className="d-flex align-items-center justify-content-between">
//                 <div>
//                   <p className="text-muted small mb-1 fw-bold text-uppercase">
//                     {item.label}
//                   </p>
//                   <h3 className="fw-bold mb-0 text-dark">{item.value}</h3>
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
//         {/* 2. Recent Orders */}
//         <Col lg={8}>
//           <Card className="border-0 shadow-sm rounded-4 h-100">
//             <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
//               <h5 className="mb-0 fw-bold">Recent Orders</h5>
//               <Button
//                 variant="light"
//                 size="sm"
//                 onClick={() => navigate("/orders")}
//               >
//                 View All
//               </Button>
//             </Card.Header>
//             <Card.Body className="p-0 table-responsive">
//               <Table hover className="mb-0 align-middle">
//                 <thead className="bg-light">
//                   <tr>
//                     <th className="ps-4 border-0 text-muted small text-uppercase">
//                       Order ID
//                     </th>
//                     <th className="border-0 text-muted small text-uppercase">
//                       Date
//                     </th>
//                     <th className="border-0 text-muted small text-uppercase">
//                       Total
//                     </th>
//                     <th className="border-0 text-muted small text-uppercase">
//                       Status
//                     </th>
//                     <th className="border-0"></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.slice(0, 5).map((order) => (
//                     <tr key={order._id}>
//                       <td className="ps-4 fw-bold text-primary">
//                         #{order._id.substring(0, 8)}
//                       </td>
//                       <td>{new Date(order.createdAt).toLocaleDateString()}</td>
//                       <td className="fw-bold">Rs. {order.totalPrice}</td>
//                       <td>
//                         <Badge
//                           bg={order.isPaid ? "success" : "warning"}
//                           className="px-3 py-2 rounded-pill fw-normal"
//                         >
//                           {order.isPaid ? "Paid" : "Pending"}
//                         </Badge>
//                       </td>
//                       <td className="text-end pe-4">
//                         <Button
//                           variant="light"
//                           size="sm"
//                           className="rounded-circle"
//                           onClick={() => navigate(`/orders`)}
//                         >
//                           <ChevronRight size={16} />
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                   {orders.length === 0 && (
//                     <tr>
//                       <td colSpan="5" className="text-center py-4 text-muted">
//                         No recent orders found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* 3. Quick Actions */}
//         <Col lg={4}>
//           {/* Quick Upload Prescription */}
//           <Card className="border-0 shadow-sm rounded-4 mb-3 bg-white">
//             <Card.Body className="p-4">
//               <div className="d-flex align-items-center gap-3 mb-3">
//                 <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info">
//                   <Upload size={24} />
//                 </div>
//                 <div>
//                   <h6 className="fw-bold mb-0">Quick Upload</h6>
//                   <small className="text-muted">Prescription</small>
//                 </div>
//               </div>
//               <p className="small text-muted mb-3">
//                 Upload your doctor's prescription directly here to skip the
//                 queue.
//               </p>
//               <Button
//                 variant="info"
//                 className="w-100 text-white fw-bold rounded-pill"
//                 onClick={() => setShowUploadModal(true)}
//               >
//                 <Plus size={18} className="me-1" /> Upload Now
//               </Button>
//             </Card.Body>
//           </Card>

//           {/* Shop Now Promo */}
//           <Card
//             className="border-0 shadow-sm rounded-4 text-white"
//             style={{
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             }}
//           >
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between mb-4">
//                 <Package size={32} className="opacity-75" />
//                 <Badge bg="warning" text="dark" className="rounded-pill">
//                   New
//                 </Badge>
//               </div>
//               <h4>Order Medicines</h4>
//               <p className="opacity-75 small mb-4">
//                 Browse our generic and branded medicines inventory.
//               </p>
//               <Button
//                 variant="light"
//                 className="w-100 text-primary fw-bold rounded-pill"
//                 onClick={() => navigate("/medicines")}
//               >
//                 Go to Store
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* --- Upload Modal (Reusing your logic) --- */}
//       <Modal
//         show={showUploadModal}
//         onHide={() => setShowUploadModal(false)}
//         centered
//       >
//         <Modal.Header closeButton className="border-0">
//           <Modal.Title className="fw-bold">Upload Prescription</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {uploadMessage && (
//             <div
//               className={`alert ${
//                 uploadMessage.includes("Success")
//                   ? "alert-success"
//                   : "alert-danger"
//               }`}
//             >
//               {uploadMessage}
//             </div>
//           )}
//           <Form onSubmit={handleUploadPrescription}>
//             <Form.Group className="mb-3">
//               <Form.Label>Prescription Image</Form.Label>
//               <Form.Control
//                 type="file"
//                 onChange={handlePrescriptionChange}
//                 accept="image/*,application/pdf"
//               />
//               {prescriptionPreview && (
//                 <div className="mt-2 text-center bg-light p-2 rounded">
//                   <img
//                     src={prescriptionPreview}
//                     alt="Preview"
//                     style={{ maxHeight: "150px" }}
//                   />
//                 </div>
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Notes</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="E.g. I need 2 strips of..."
//               />
//             </Form.Group>
//             <Button
//               type="submit"
//               variant="primary"
//               className="w-100 rounded-pill"
//               disabled={uploadLoading}
//             >
//               {uploadLoading ? (
//                 <Spinner size="sm" animation="border" />
//               ) : (
//                 "Submit"
//               )}
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* --- Styles --- */}
//       <style>{`
//         .hover-scale:hover { transform: translateY(-3px); transition: transform 0.2s ease; }
//         .cursor-pointer { cursor: pointer; }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerDashboard;

import React, { useState, useEffect } from "react";
import {
  Bell,
  ShoppingCart,
  User,
  Search,
  Package,
  HeartPulse,
  MessageCircle,
  X,
  Sun,
  Moon,
  Calendar,
  Stethoscope,
  LogOut,
  Menu,
  Upload,
  History,
  FileText,
  CreditCard,
  Heart,
  Mail,
  Phone,
  MapPin,
  Droplet,
  AlertCircle,
  Shield,
  Edit2,
  Camera,
  Activity,
  ArrowRight,
  ChevronRight,
  Plus,
  Clock, // ✅ Added Clock icon
  Ticket, // ✅ Added Ticket icon for Ref ID
} from "lucide-react";
import {
  Button,
  ProgressBar,
  Badge,
  Form,
  Row,
  Col,
  Tab,
  Tabs,
  Card,
  Table,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { addToCart } from "../redux/actions/cartActions";

const API_BASE_URL = "http://localhost:5000/api";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- UI State ---
  const [activeTab, setActiveTab] = useState("overview");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // --- Data State ---
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [savedMedicines, setSavedMedicines] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // --- Interaction State ---
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [notes, setNotes] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  // --- Profile Editing State ---
  const [profileFormData, setProfileFormData] = useState({});

  // --- Effects ---
  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (profile) {
      setProfileFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
        address:
          typeof profile.address === "object"
            ? profile.address.city
            : profile.address || "",
        bloodGroup: profile.bloodGroup || "",
        allergies: profile.allergies || "",
      });
    }
  }, [profile]);

  // Helper
  const safelyGetArray = (data, key) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data[key])) return data[key];
    return [];
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      const headers = { Authorization: `Bearer ${token}` };

      // Parallel Fetch
      const results = await Promise.allSettled([
        fetch(`${API_BASE_URL}/auth/profile`, { headers }),
        fetch(`${API_BASE_URL}/customer/orders`, { headers }),
        fetch(`${API_BASE_URL}/medicines`, { headers }),
        fetch(`${API_BASE_URL}/doctors`, { headers }),
        fetch(`${API_BASE_URL}/customer/appointments`, { headers }),
        fetch(`${API_BASE_URL}/customer/prescriptions`, { headers }),
        fetch(`${API_BASE_URL}/customer/saved-medicines`, { headers }),
      ]);

      // Process Results
      const [
        profileRes,
        ordersRes,
        recRes,
        docRes,
        apptRes,
        presRes,
        savedRes,
      ] = results;

      if (profileRes.status === "fulfilled" && profileRes.value.ok)
        setProfile(await profileRes.value.json());

      if (ordersRes.status === "fulfilled" && ordersRes.value.ok)
        setOrders(safelyGetArray(await ordersRes.value.json(), "orders"));

      if (recRes.status === "fulfilled" && recRes.value.ok)
        setRecommended(await recRes.value.json());

      if (docRes.status === "fulfilled" && docRes.value.ok)
        setDoctors(await docRes.value.json());

      if (apptRes.status === "fulfilled" && apptRes.value.ok)
        setMyAppointments(
          safelyGetArray(await apptRes.value.json(), "appointments")
        );

      if (presRes.status === "fulfilled" && presRes.value.ok)
        setMyPrescriptions(
          safelyGetArray(await presRes.value.json(), "prescriptions")
        );

      if (savedRes.status === "fulfilled" && savedRes.value.ok)
        setSavedMedicines(await savedRes.value.json());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Logic: Find Next Appointment (New Feature) ---
  const upcomingAppt = myAppointments
    .filter(
      (a) =>
        new Date(a.date) >= new Date().setHours(0, 0, 0, 0) &&
        a.status !== "cancelled"
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  // --- Handlers ---
  const handleAddToCart = (med) => {
    dispatch(addToCart(med._id, 1));
    alert(`${med.name} added to cart!`);
  };

  const handlePrescriptionChange = (e) => {
    const file = e.target.files?.[0];
    setPrescriptionFile(file || null);
    setPrescriptionPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleUploadPrescription = async (e) => {
    e.preventDefault();
    if (!prescriptionFile) return;

    try {
      setUploadLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", prescriptionFile);
      formData.append("notes", notes);

      let res = await fetch(`${API_BASE_URL}/prescriptions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      if (res.ok) {
        setUploadMessage("Prescription uploaded successfully!");
        setPrescriptionFile(null);
        setPrescriptionPreview(null);
        setNotes("");
        setShowUploadModal(false);
        fetchAllData();
        alert("Upload Successful");
      } else {
        setUploadMessage("Failed to upload.");
      }
    } catch (err) {
      setUploadMessage("Error uploading prescription.");
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // --- STATS DATA ---
  const statsCards = [
    {
      label: "Active Orders",
      value: orders.filter((o) => !o.isDelivered).length,
      icon: Package,
      color: "primary",
      link: "/orders",
    },
    {
      label: "Appointments",
      value: myAppointments.length,
      icon: Calendar,
      color: "warning",
      link: "/appointments",
    },
    {
      label: "Prescriptions",
      value: myPrescriptions.length,
      icon: FileText,
      color: "info",
      link: "/prescriptions",
    },
    {
      label: "Wallet",
      value: "Rs. " + (profile?.loyaltyPoints || 0), // Updated to show points
      icon: CreditCard,
      color: "success",
      link: "/profile",
    },
  ];

  return (
    <div className="fade-in">
      {/* 1. Stats Row */}
      <h5 className="fw-bold mb-3 text-dark">Dashboard Overview</h5>
      <Row className="g-3 mb-4">
        {statsCards.map((item, idx) => (
          <Col md={3} key={idx}>
            <Card
              className="border-0 shadow-sm rounded-4 h-100 cursor-pointer hover-scale"
              onClick={() => navigate(item.link)}
            >
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted small mb-1 fw-bold text-uppercase">
                    {item.label}
                  </p>
                  <h3 className="fw-bold mb-0 text-dark">{item.value}</h3>
                </div>
                <div
                  className={`bg-${item.color} bg-opacity-10 p-3 rounded-circle text-${item.color}`}
                >
                  <item.icon size={24} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        {/* 2. Recent Orders */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Recent Orders</h5>
              <Button
                variant="light"
                size="sm"
                onClick={() => navigate("/orders")}
              >
                View All
              </Button>
            </Card.Header>
            <Card.Body className="p-0 table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 border-0 text-muted small text-uppercase">
                      Order ID
                    </th>
                    <th className="border-0 text-muted small text-uppercase">
                      Date
                    </th>
                    <th className="border-0 text-muted small text-uppercase">
                      Total
                    </th>
                    <th className="border-0 text-muted small text-uppercase">
                      Status
                    </th>
                    <th className="border-0"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id}>
                      <td className="ps-4 fw-bold text-primary">
                        #{order._id.substring(0, 8)}
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="fw-bold">Rs. {order.totalPrice}</td>
                      <td>
                        <Badge
                          bg={order.isPaid ? "success" : "warning"}
                          className="px-3 py-2 rounded-pill fw-normal"
                        >
                          {order.isPaid ? "Paid" : "Pending"}
                        </Badge>
                      </td>
                      <td className="text-end pe-4">
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => navigate(`/orders`)}
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* 3. Right Sidebar: Next Appointment & Quick Actions */}
        <Col lg={4}>
          {/* ✅ NEW: Next Appointment Card */}
          <Card
            className="border-0 shadow-sm rounded-4 mb-3 text-white overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
            }}
          >
            <Card.Body className="p-4 position-relative">
              <div className="d-flex justify-content-between mb-4">
                <div className="bg-white bg-opacity-25 p-2 rounded-3">
                  <Calendar size={20} className="text-white" />
                </div>
                <Badge bg="light" text="primary" className="rounded-pill px-3">
                  Next Visit
                </Badge>
              </div>

              {upcomingAppt ? (
                <>
                  <h5 className="fw-bold mb-1">
                    Dr. {upcomingAppt.doctor?.name}
                  </h5>
                  <p className="text-white text-opacity-75 mb-3 small">
                    {upcomingAppt.doctor?.speciality}
                  </p>

                  <div className="bg-white bg-opacity-10 p-3 rounded-3 mb-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Clock size={16} className="text-white text-opacity-75" />
                      <span className="fw-bold small">
                        {new Date(upcomingAppt.date).toDateString()}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Ticket
                        size={16}
                        className="text-white text-opacity-75"
                      />
                      <span className="fw-bold small font-monospace">
                        Ref: {upcomingAppt.bookingReference || "N/A"}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="light"
                    className="w-100 text-primary fw-bold rounded-pill"
                    onClick={() => navigate("/appointments")}
                  >
                    View Details
                  </Button>
                </>
              ) : (
                <div className="text-center py-2">
                  <p className="opacity-75 small mb-3">
                    No upcoming visits scheduled.
                  </p>
                  <Button
                    variant="light"
                    className="w-100 text-primary fw-bold rounded-pill"
                    onClick={() => navigate("/appointments")}
                  >
                    Book Now
                  </Button>
                </div>
              )}
              {/* Decoration */}
              <div
                className="position-absolute top-0 end-0 bg-white opacity-10 rounded-circle"
                style={{
                  width: 100,
                  height: 100,
                  transform: "translate(30%, -30%)",
                }}
              ></div>
            </Card.Body>
          </Card>

          {/* Quick Upload Prescription */}
          <Card className="border-0 shadow-sm rounded-4 mb-3 bg-white">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info">
                  <Upload size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Quick Upload</h6>
                  <small className="text-muted">Prescription</small>
                </div>
              </div>
              <Button
                variant="info"
                className="w-100 text-white fw-bold rounded-pill"
                onClick={() => setShowUploadModal(true)}
              >
                <Plus size={18} className="me-1" /> Upload Now
              </Button>
            </Card.Body>
          </Card>

          {/* Shop Now Promo */}
          <Card
            className="border-0 shadow-sm rounded-4 text-white"
            style={{
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between mb-3">
                <Package size={28} className="opacity-75" />
                <Badge bg="warning" text="dark" className="rounded-pill">
                  Store
                </Badge>
              </div>
              <h5 className="fw-bold">Order Medicines</h5>
              <p className="opacity-75 small mb-3">Browse our inventory.</p>
              <Button
                variant="light"
                className="w-100 text-success fw-bold rounded-pill"
                onClick={() => navigate("/medicines")}
              >
                Go to Store
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- Upload Modal --- */}
      <Modal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Upload Prescription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {uploadMessage && (
            <div
              className={`alert ${
                uploadMessage.includes("Success")
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {uploadMessage}
            </div>
          )}
          <Form onSubmit={handleUploadPrescription}>
            <Form.Group className="mb-3">
              <Form.Label>Prescription Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handlePrescriptionChange}
                accept="image/*,application/pdf"
              />
              {prescriptionPreview && (
                <div className="mt-2 text-center bg-light p-2 rounded">
                  <img
                    src={prescriptionPreview}
                    alt="Preview"
                    style={{ maxHeight: "150px" }}
                  />
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g. I need 2 strips of..."
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="w-100 rounded-pill"
              disabled={uploadLoading}
            >
              {uploadLoading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Submit"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <style>{`
        .hover-scale:hover { transform: translateY(-3px); transition: transform 0.2s ease; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;
