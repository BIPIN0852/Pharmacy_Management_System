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
//   Clock, // ✅ Added Clock icon
//   Ticket, // ✅ Added Ticket icon for Ref ID
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

//   // --- Profile Editing State ---
//   const [profileFormData, setProfileFormData] = useState({});

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

//   // --- Logic: Find Next Appointment (New Feature) ---
//   const upcomingAppt = myAppointments
//     .filter(
//       (a) =>
//         new Date(a.date) >= new Date().setHours(0, 0, 0, 0) &&
//         a.status !== "cancelled"
//     )
//     .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

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
//       formData.append("image", prescriptionFile);
//       formData.append("notes", notes);

//       let res = await fetch(`${API_BASE_URL}/prescriptions`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (!res.ok) {
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
//         fetchAllData();
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
//       value: "Rs. " + (profile?.loyaltyPoints || 0), // Updated to show points
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

//         {/* 3. Right Sidebar: Next Appointment & Quick Actions */}
//         <Col lg={4}>
//           {/* ✅ NEW: Next Appointment Card */}
//           <Card
//             className="border-0 shadow-sm rounded-4 mb-3 text-white overflow-hidden"
//             style={{
//               background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
//             }}
//           >
//             <Card.Body className="p-4 position-relative">
//               <div className="d-flex justify-content-between mb-4">
//                 <div className="bg-white bg-opacity-25 p-2 rounded-3">
//                   <Calendar size={20} className="text-white" />
//                 </div>
//                 <Badge bg="light" text="primary" className="rounded-pill px-3">
//                   Next Visit
//                 </Badge>
//               </div>

//               {upcomingAppt ? (
//                 <>
//                   <h5 className="fw-bold mb-1">
//                     Dr. {upcomingAppt.doctor?.name}
//                   </h5>
//                   <p className="text-white text-opacity-75 mb-3 small">
//                     {upcomingAppt.doctor?.speciality}
//                   </p>

//                   <div className="bg-white bg-opacity-10 p-3 rounded-3 mb-3">
//                     <div className="d-flex align-items-center gap-2 mb-2">
//                       <Clock size={16} className="text-white text-opacity-75" />
//                       <span className="fw-bold small">
//                         {new Date(upcomingAppt.date).toDateString()}
//                       </span>
//                     </div>
//                     <div className="d-flex align-items-center gap-2">
//                       <Ticket
//                         size={16}
//                         className="text-white text-opacity-75"
//                       />
//                       <span className="fw-bold small font-monospace">
//                         Ref: {upcomingAppt.bookingReference || "N/A"}
//                       </span>
//                     </div>
//                   </div>

//                   <Button
//                     variant="light"
//                     className="w-100 text-primary fw-bold rounded-pill"
//                     onClick={() => navigate("/appointments")}
//                   >
//                     View Details
//                   </Button>
//                 </>
//               ) : (
//                 <div className="text-center py-2">
//                   <p className="opacity-75 small mb-3">
//                     No upcoming visits scheduled.
//                   </p>
//                   <Button
//                     variant="light"
//                     className="w-100 text-primary fw-bold rounded-pill"
//                     onClick={() => navigate("/appointments")}
//                   >
//                     Book Now
//                   </Button>
//                 </div>
//               )}
//               {/* Decoration */}
//               <div
//                 className="position-absolute top-0 end-0 bg-white opacity-10 rounded-circle"
//                 style={{
//                   width: 100,
//                   height: 100,
//                   transform: "translate(30%, -30%)",
//                 }}
//               ></div>
//             </Card.Body>
//           </Card>

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
//               background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
//             }}
//           >
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between mb-3">
//                 <Package size={28} className="opacity-75" />
//                 <Badge bg="warning" text="dark" className="rounded-pill">
//                   Store
//                 </Badge>
//               </div>
//               <h5 className="fw-bold">Order Medicines</h5>
//               <p className="opacity-75 small mb-3">Browse our inventory.</p>
//               <Button
//                 variant="light"
//                 className="w-100 text-success fw-bold rounded-pill"
//                 onClick={() => navigate("/medicines")}
//               >
//                 Go to Store
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* --- Upload Modal --- */}
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

//       <style>{`
//         .hover-scale:hover { transform: translateY(-3px); transition: transform 0.2s ease; }
//         .cursor-pointer { cursor: pointer; }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerDashboard;

// import React, { useState, useEffect } from "react";
// import {
//   Package,
//   Calendar,
//   FileText,
//   CreditCard,
//   Upload,
//   Plus,
//   Clock,
//   Ticket,
//   ChevronRight,
//   Heart, // ✅ Used for Saved Items
//   ShoppingCart,
//   ArrowRight,
// } from "lucide-react";
// import {
//   Button,
//   Badge,
//   Form,
//   Row,
//   Col,
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
//   const [showUploadModal, setShowUploadModal] = useState(false);

//   // --- Data State ---
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [myPrescriptions, setMyPrescriptions] = useState([]);
//   const [savedMedicines, setSavedMedicines] = useState([]); // ✅ Using this state

//   // Unused but kept to match your logic structure
//   const [recommended, setRecommended] = useState([]);
//   const [doctors, setDoctors] = useState([]);

//   // --- Interaction State ---
//   const [prescriptionFile, setPrescriptionFile] = useState(null);
//   const [prescriptionPreview, setPrescriptionPreview] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // --- Effects ---
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // Helper
//   const safelyGetArray = (data, key) => {
//     if (Array.isArray(data)) return data;
//     if (data && Array.isArray(data[key])) return data[key];
//     return [];
//   };

//   // ✅ Image Helper (Handles local vs remote paths)
//   const getImageUrl = (path) => {
//     if (!path) return "https://via.placeholder.com/150";
//     return path.startsWith("http") ? path : `http://localhost:5000${path}`;
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

//   // --- Logic: Find Next Appointment ---
//   const upcomingAppt = myAppointments
//     .filter(
//       (a) =>
//         new Date(a.date) >= new Date().setHours(0, 0, 0, 0) &&
//         a.status !== "cancelled"
//     )
//     .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

//   // --- Handlers ---
//   const handleAddToCart = (med) => {
//     // If med structure is nested (from savedItems: item.medicine) or direct
//     const itemToAdd = med.medicine || med;

//     if (!itemToAdd || itemToAdd.countInStock === 0) return;

//     dispatch(addToCart(itemToAdd._id, 1));
//     alert(`${itemToAdd.name} added to cart!`);
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

//       let res = await fetch(`${API_BASE_URL}/prescriptions`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (!res.ok) {
//         // Fallback route check
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
//         fetchAllData();
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
//       label: "Wallet Points",
//       value: profile?.loyaltyPoints || 0,
//       icon: CreditCard,
//       color: "success",
//       link: "/profile",
//     },
//   ];

//   return (
//     <div className="fade-in container-fluid p-0">
//       {/* 1. Stats Row (Responsive: 2 per row on mobile, 4 on desktop) */}
//       <h5 className="fw-bold mb-3 text-dark">Dashboard Overview</h5>
//       <Row className="g-3 mb-4">
//         {statsCards.map((item, idx) => (
//           <Col xs={6} md={6} xl={3} key={idx}>
//             <Card
//               className="border-0 shadow-sm rounded-4 h-100 cursor-pointer hover-scale"
//               onClick={() => navigate(item.link)}
//             >
//               <Card.Body className="d-flex align-items-center justify-content-between p-3">
//                 <div>
//                   <p
//                     className="text-muted small mb-1 fw-bold text-uppercase"
//                     style={{ fontSize: "0.75rem" }}
//                   >
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
//         {/* LEFT COLUMN */}
//         <Col lg={8}>
//           {/* 2. Recent Orders */}
//           <Card className="border-0 shadow-sm rounded-4 mb-4">
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

//           {/* 3. ✅ NEW: Saved Items Section */}
//           <Card className="border-0 shadow-sm rounded-4">
//             <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
//               <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
//                 <Heart size={18} className="text-danger" /> Saved Medicines
//               </h5>
//               <Button
//                 variant="light"
//                 size="sm"
//                 onClick={() => navigate("/customer/saved")}
//               >
//                 View All
//               </Button>
//             </Card.Header>
//             <Card.Body>
//               {savedMedicines.length > 0 ? (
//                 <Row className="g-3">
//                   {/* Show only top 3 items to save space */}
//                   {savedMedicines.slice(0, 3).map((item) => {
//                     const med = item.medicine;
//                     if (!med) return null;
//                     return (
//                       <Col xs={12} sm={6} md={4} key={item._id}>
//                         <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 h-100 border hover-scale cursor-pointer">
//                           <img
//                             src={getImageUrl(med.image)}
//                             alt={med.name}
//                             className="rounded-3 object-fit-cover"
//                             style={{ width: "50px", height: "50px" }}
//                           />
//                           <div className="flex-grow-1 overflow-hidden">
//                             <h6
//                               className="mb-0 fw-bold text-truncate"
//                               title={med.name}
//                             >
//                               {med.name}
//                             </h6>
//                             <small className="text-primary fw-bold">
//                               Rs. {med.price}
//                             </small>
//                           </div>
//                           <Button
//                             variant="primary"
//                             size="sm"
//                             className="rounded-circle p-2"
//                             onClick={() => handleAddToCart(item)}
//                             title="Add to Cart"
//                           >
//                             <ShoppingCart size={14} />
//                           </Button>
//                         </div>
//                       </Col>
//                     );
//                   })}
//                 </Row>
//               ) : (
//                 <div className="text-center py-3 text-muted">
//                   <Heart size={24} className="mb-2 opacity-25" />
//                   <p className="small mb-0">Your wishlist is empty.</p>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* RIGHT COLUMN */}
//         <Col lg={4}>
//           {/* 4. Next Appointment Card */}
//           <Card
//             className="border-0 shadow-sm rounded-4 mb-3 text-white overflow-hidden"
//             style={{
//               background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
//             }}
//           >
//             <Card.Body className="p-4 position-relative">
//               <div className="d-flex justify-content-between mb-4">
//                 <div className="bg-white bg-opacity-25 p-2 rounded-3">
//                   <Calendar size={20} className="text-white" />
//                 </div>
//                 <Badge bg="light" text="primary" className="rounded-pill px-3">
//                   Next Visit
//                 </Badge>
//               </div>

//               {upcomingAppt ? (
//                 <>
//                   <h5 className="fw-bold mb-1">
//                     Dr. {upcomingAppt.doctor?.name}
//                   </h5>
//                   <p className="text-white text-opacity-75 mb-3 small">
//                     {upcomingAppt.doctor?.speciality}
//                   </p>

//                   <div className="bg-white bg-opacity-10 p-3 rounded-3 mb-3">
//                     <div className="d-flex align-items-center gap-2 mb-2">
//                       <Clock size={16} className="text-white text-opacity-75" />
//                       <span className="fw-bold small">
//                         {new Date(upcomingAppt.date).toDateString()}
//                       </span>
//                     </div>
//                     <div className="d-flex align-items-center gap-2">
//                       <Ticket
//                         size={16}
//                         className="text-white text-opacity-75"
//                       />
//                       <span className="fw-bold small font-monospace">
//                         Ref: {upcomingAppt.bookingReference || "N/A"}
//                       </span>
//                     </div>
//                   </div>

//                   <Button
//                     variant="light"
//                     className="w-100 text-primary fw-bold rounded-pill"
//                     onClick={() => navigate("/appointments")}
//                   >
//                     View Details
//                   </Button>
//                 </>
//               ) : (
//                 <div className="text-center py-2">
//                   <p className="opacity-75 small mb-3">
//                     No upcoming visits scheduled.
//                   </p>
//                   <Button
//                     variant="light"
//                     className="w-100 text-primary fw-bold rounded-pill"
//                     onClick={() => navigate("/appointments")}
//                   >
//                     Book Now
//                   </Button>
//                 </div>
//               )}
//               {/* Decoration */}
//               <div
//                 className="position-absolute top-0 end-0 bg-white opacity-10 rounded-circle"
//                 style={{
//                   width: 100,
//                   height: 100,
//                   transform: "translate(30%, -30%)",
//                 }}
//               ></div>
//             </Card.Body>
//           </Card>

//           {/* 5. Quick Upload Prescription */}
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
//               <Button
//                 variant="info"
//                 className="w-100 text-white fw-bold rounded-pill"
//                 onClick={() => setShowUploadModal(true)}
//               >
//                 <Plus size={18} className="me-1" /> Upload Now
//               </Button>
//             </Card.Body>
//           </Card>

//           {/* 6. Shop Now Promo */}
//           <Card
//             className="border-0 shadow-sm rounded-4 text-white"
//             style={{
//               background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
//             }}
//           >
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between mb-3">
//                 <Package size={28} className="opacity-75" />
//                 <Badge bg="warning" text="dark" className="rounded-pill">
//                   Store
//                 </Badge>
//               </div>
//               <h5 className="fw-bold">Order Medicines</h5>
//               <p className="opacity-75 small mb-3">Browse our inventory.</p>
//               <Button
//                 variant="light"
//                 className="w-100 text-success fw-bold rounded-pill"
//                 onClick={() => navigate("/medicines")}
//               >
//                 Go to Store
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* --- Upload Modal --- */}
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

//       <style>{`
//         .hover-scale:hover { transform: translateY(-3px); transition: transform 0.2s ease; }
//         .cursor-pointer { cursor: pointer; }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerDashboard;

// import React, { useState, useEffect } from "react";
// import {
//   Package,
//   Calendar,
//   FileText,
//   CreditCard,
//   Upload,
//   Plus,
//   Clock,
//   Ticket,
//   Heart,
//   ShoppingCart,
//   Loader2,
//   Activity,
//   ArrowUpRight,
//   MessageSquare,
//   Bell,
// } from "lucide-react";
// import { Form, Row, Col, Modal } from "react-bootstrap";
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
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState(null);

//   // --- Data State ---
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [myPrescriptions, setMyPrescriptions] = useState([]);
//   const [savedMedicines, setSavedMedicines] = useState([]);
//   const [myMessages, setMyMessages] = useState([]); // ✅ Added Messages State
//   const [medicines, setMedicines] = useState([]);

//   // --- Interaction State ---
//   const [prescriptionFile, setPrescriptionFile] = useState(null);
//   const [prescriptionPreview, setPrescriptionPreview] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // --- Effects ---
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // Helper
//   const safelyGetArray = (data, key) => {
//     if (Array.isArray(data)) return data;
//     if (data && Array.isArray(data[key])) return data[key];
//     return [];
//   };

//   const getImageUrl = (path) => {
//     if (!path) return "https://via.placeholder.com/150";
//     return path.startsWith("http") ? path : `http://localhost:5000${path}`;
//   };

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       if (!token) return navigate("/login");
//       const headers = { Authorization: `Bearer ${token}` };

//       // ✅ Added `/messages/my` to the Promise.allSettled
//       const results = await Promise.allSettled([
//         fetch(`${API_BASE_URL}/auth/profile`, { headers }),
//         fetch(`${API_BASE_URL}/customer/orders`, { headers }),
//         fetch(`${API_BASE_URL}/medicines`, { headers }),
//         fetch(`${API_BASE_URL}/customer/appointments`, { headers }),
//         fetch(`${API_BASE_URL}/customer/prescriptions`, { headers }),
//         fetch(`${API_BASE_URL}/customer/saved-medicines`, { headers }),
//         fetch(`${API_BASE_URL}/messages/my`, { headers }),
//       ]);

//       const [
//         profileRes,
//         ordersRes,
//         medsRes,
//         apptRes,
//         presRes,
//         savedRes,
//         msgRes,
//       ] = results;

//       if (profileRes.status === "fulfilled" && profileRes.value.ok)
//         setProfile(await profileRes.value.json());
//       if (ordersRes.status === "fulfilled" && ordersRes.value.ok)
//         setOrders(safelyGetArray(await ordersRes.value.json(), "orders"));
//       if (medsRes.status === "fulfilled" && medsRes.value.ok)
//         setMedicines(safelyGetArray(await medsRes.value.json(), "medicines"));
//       if (apptRes.status === "fulfilled" && apptRes.value.ok)
//         setMyAppointments(
//           safelyGetArray(await apptRes.value.json(), "appointments"),
//         );
//       if (presRes.status === "fulfilled" && presRes.value.ok)
//         setMyPrescriptions(
//           safelyGetArray(await presRes.value.json(), "prescriptions"),
//         );
//       if (savedRes.status === "fulfilled" && savedRes.value.ok)
//         setSavedMedicines(await savedRes.value.json());

//       // ✅ Process Messages
//       if (msgRes.status === "fulfilled" && msgRes.value.ok) {
//         setMyMessages(await msgRes.value.json());
//       }
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Logic: Mark Message Reply as Read ---
//   const handleReadMessage = async (msg) => {
//     setSelectedMessage(msg); // Open Modal

//     // If there is a reply and it hasn't been read, tell the backend we read it
//     if (msg.adminReply && !msg.isReplyRead) {
//       try {
//         const token = localStorage.getItem("token");
//         await fetch(`${API_BASE_URL}/messages/${msg._id}/read-reply`, {
//           method: "PUT",
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // Update local state to remove the "NEW" badge immediately
//         setMyMessages((prev) =>
//           prev.map((m) =>
//             m._id === msg._id ? { ...m, isReplyRead: true } : m,
//           ),
//         );
//       } catch (err) {
//         console.error("Failed to mark reply as read", err);
//       }
//     }
//   };

//   const upcomingAppt = myAppointments
//     .filter(
//       (a) =>
//         new Date(a.date) >= new Date().setHours(0, 0, 0, 0) &&
//         a.status !== "cancelled",
//     )
//     .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

//   const handleAddToCart = (med) => {
//     const itemToAdd = med.medicine || med;
//     if (!itemToAdd || itemToAdd.countInStock === 0) return;
//     dispatch(addToCart(itemToAdd._id, 1));
//     alert(`${itemToAdd.name} added to cart!`);
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

//       let res = await fetch(`${API_BASE_URL}/prescriptions`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (!res.ok) {
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
//         fetchAllData();
//       } else {
//         setUploadMessage("Failed to upload.");
//       }
//     } catch (err) {
//       setUploadMessage("Error uploading prescription.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex flex-column align-items-center justify-content-center vh-100 dark-dashboard-container">
//         <Loader2 className="spin-animation text-cyan mb-3" size={48} />
//         <span className="text-light fw-bold tracking-wider text-uppercase small">
//           Initializing Dashboard...
//         </span>
//       </div>
//     );
//   }

//   // Calculate unread replies
//   const unreadRepliesCount = myMessages.filter(
//     (m) => m.adminReply && !m.isReplyRead,
//   ).length;

//   const statsCards = [
//     {
//       label: "Wallet Points",
//       value: profile?.loyaltyPoints || 0,
//       icon: CreditCard,
//       colorClass: "text-red",
//       bgClass: "bg-red",
//       link: "/profile",
//     },
//     {
//       label: "Active Orders",
//       value: orders.filter((o) => !o.isDelivered).length,
//       icon: Package,
//       colorClass: "text-cyan",
//       bgClass: "bg-cyan",
//       link: "/orders",
//     },
//     {
//       label: "Appointments",
//       value: myAppointments.length,
//       icon: Calendar,
//       colorClass: "text-blue",
//       bgClass: "bg-blue",
//       link: "/appointments",
//     },
//     {
//       label: "Prescriptions",
//       value: myPrescriptions.length,
//       icon: FileText,
//       colorClass: "text-yellow",
//       bgClass: "bg-yellow",
//       link: "/prescriptions",
//     },
//   ];

//   return (
//     <div className="dark-dashboard-container min-vh-100 p-3 p-md-4 animate-fade-in">
//       {/* 1. HERO BANNER */}
//       <div className="hero-banner rounded-4 mb-4 p-4 p-md-5 position-relative overflow-hidden shadow-lg d-flex justify-content-between align-items-center flex-wrap gap-3">
//         <div className="position-relative z-1">
//           <h1 className="fw-bolder text-white mb-2 display-5 tracking-tight">
//             Welcome, {profile?.name || user?.name || "Customer"}!
//           </h1>
//           <p className="text-white text-opacity-75 fs-5 mb-0 fw-light">
//             Here's your account overview and recent activities.
//           </p>
//         </div>

//         {/* ✅ Hero Notification Badge */}
//         {unreadRepliesCount > 0 && (
//           <div className="position-relative z-1 bg-white bg-opacity-10 p-3 rounded-4 border border-light-subtle d-flex align-items-center gap-3">
//             <div className="bg-danger p-2 rounded-circle text-white position-relative">
//               <Bell size={24} />
//               <span className="position-absolute top-0 start-100 translate-middle p-1 bg-white border border-danger rounded-circle"></span>
//             </div>
//             <div>
//               <div className="fw-bold text-white">New Notifications</div>
//               <div className="small text-light opacity-75">
//                 You have {unreadRepliesCount} unread replies from support.
//               </div>
//             </div>
//           </div>
//         )}
//         <div className="hero-overlay"></div>
//       </div>

//       {/* 2. KPI STATS ROW */}
//       <Row className="g-3 mb-4">
//         {statsCards.map((item, idx) => (
//           <Col xs={6} xl={3} key={idx}>
//             <div
//               className="dark-card h-100 p-4 rounded-4 cursor-pointer hover-glow transition-all d-flex flex-column justify-content-between"
//               onClick={() => navigate(item.link)}
//             >
//               <div className="d-flex align-items-center gap-3 mb-3">
//                 <div className={`icon-box ${item.bgClass}`}>
//                   <item.icon size={20} className="text-white" />
//                 </div>
//                 <span className="text-light fw-medium small">{item.label}</span>
//               </div>
//               <h2 className={`fw-bolder mb-0 ${item.colorClass}`}>
//                 {item.value}
//               </h2>
//             </div>
//           </Col>
//         ))}
//       </Row>

//       <Row className="g-4">
//         {/* --- LEFT COLUMN --- */}
//         <Col lg={8}>
//           {/* 3. RECENT ORDERS */}
//           <div className="dark-card rounded-4 mb-4 overflow-hidden">
//             <div className="p-4 border-bottom-dark d-flex justify-content-between align-items-center">
//               <h5 className="mb-0 fw-bold text-white">Recent Orders</h5>
//               <button
//                 className="btn btn-link text-cyan text-decoration-none fw-bold p-0 d-flex align-items-center gap-1 hover-text-white transition-all"
//                 onClick={() => navigate("/orders")}
//               >
//                 View all Orders <ArrowUpRight size={18} />
//               </button>
//             </div>
//             <div className="table-responsive p-0 custom-dark-scrollbar">
//               <table className="table dark-table align-middle mb-0">
//                 <thead>
//                   <tr>
//                     <th className="ps-4">Order ID</th>
//                     <th>Date</th>
//                     <th>Status</th>
//                     <th>Amount</th>
//                     <th className="pe-4 text-end">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.slice(0, 5).map((order) => (
//                     <tr key={order._id}>
//                       <td className="ps-4 text-light fw-medium">
//                         #
//                         {order._id
//                           .substring(order._id.length - 6)
//                           .toUpperCase()}
//                       </td>
//                       <td className="text-muted">
//                         {new Date(order.createdAt).toLocaleDateString("en-US", {
//                           month: "2-digit",
//                           day: "2-digit",
//                           year: "2-digit",
//                         })}
//                       </td>
//                       <td>
//                         <div
//                           className={`d-flex align-items-center gap-2 fw-medium ${order.isPaid ? "text-cyan" : "text-warning"}`}
//                         >
//                           <span
//                             className={`status-dot ${order.isPaid ? "bg-cyan" : "bg-warning"}`}
//                           ></span>
//                           {order.isPaid ? "Completed" : "Pending"}
//                         </div>
//                       </td>
//                       <td className="text-light fw-medium">
//                         Rs. {Number(order.totalPrice).toLocaleString()}
//                       </td>
//                       <td className="text-end pe-4">
//                         <button
//                           className="btn btn-link text-cyan text-decoration-none fw-medium p-0 hover-text-white transition-all"
//                           onClick={() => navigate(`/orders`)}
//                         >
//                           Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                   {orders.length === 0 && (
//                     <tr>
//                       <td colSpan="5" className="text-center py-5 text-muted">
//                         No recent orders found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* 4. SAVED MEDICINES */}
//           <div className="dark-card rounded-4 p-4">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h5 className="mb-0 fw-bold text-white d-flex align-items-center gap-2">
//                 <Heart size={20} className="text-red" fill="#ef4444" /> Saved
//                 Items
//               </h5>
//               <button
//                 className="btn btn-link text-cyan text-decoration-none fw-bold p-0 d-flex align-items-center gap-1 hover-text-white transition-all"
//                 onClick={() => navigate("/customer/saved")}
//               >
//                 View all <ArrowUpRight size={18} />
//               </button>
//             </div>
//             {savedMedicines.length > 0 ? (
//               <Row className="g-3">
//                 {savedMedicines.slice(0, 3).map((item) => {
//                   const med = item.medicine;
//                   if (!med) return null;
//                   return (
//                     <Col xs={12} sm={6} md={4} key={item._id}>
//                       <div className="dark-inner-card p-3 rounded-4 d-flex align-items-center gap-3 border-dark-subtle transition-all hover-glow">
//                         <img
//                           src={getImageUrl(med.image)}
//                           alt={med.name}
//                           className="rounded-3 object-fit-cover bg-white"
//                           style={{ width: "50px", height: "50px" }}
//                         />
//                         <div className="flex-grow-1 overflow-hidden">
//                           <h6
//                             className="mb-1 fw-bold text-light text-truncate"
//                             title={med.name}
//                           >
//                             {med.name}
//                           </h6>
//                           <small className="text-cyan fw-bold">
//                             Rs. {med.price}
//                           </small>
//                         </div>
//                         <button
//                           className="btn btn-cyan-glow rounded-circle p-2 d-flex align-items-center justify-content-center"
//                           onClick={() => handleAddToCart(item)}
//                           title="Add to Cart"
//                         >
//                           <ShoppingCart size={16} className="text-white" />
//                         </button>
//                       </div>
//                     </Col>
//                   );
//                 })}
//               </Row>
//             ) : (
//               <div
//                 className="text-center py-4 text-muted border-dark-subtle rounded-4 border"
//                 style={{ borderStyle: "dashed" }}
//               >
//                 <Heart size={24} className="mb-2 opacity-50 text-muted" />
//                 <p className="small mb-0">Your wishlist is empty.</p>
//               </div>
//             )}
//           </div>
//         </Col>

//         {/* --- RIGHT COLUMN --- */}
//         <Col lg={4}>
//           {/* ✅ 5. SUPPORT MESSAGES & NOTIFICATIONS PANEL */}
//           <div
//             className="dark-card rounded-4 mb-4 overflow-hidden d-flex flex-column"
//             style={{ maxHeight: "350px" }}
//           >
//             <div className="p-4 border-bottom-dark d-flex justify-content-between align-items-center bg-dark bg-opacity-50">
//               <h5 className="mb-0 fw-bold text-white d-flex align-items-center gap-2">
//                 <MessageSquare size={18} className="text-cyan" /> Support Hub
//               </h5>
//             </div>
//             <div className="p-3 overflow-auto custom-dark-scrollbar flex-grow-1">
//               {myMessages.length > 0 ? (
//                 <div className="d-flex flex-column gap-2">
//                   {myMessages.slice(0, 5).map((msg) => (
//                     <div
//                       key={msg._id}
//                       className={`dark-inner-card p-3 rounded-4 border ${msg.adminReply && !msg.isReplyRead ? "border-cyan shadow-sm cursor-pointer hover-glow" : "border-dark-subtle cursor-pointer"}`}
//                       onClick={() => handleReadMessage(msg)}
//                     >
//                       <div className="d-flex justify-content-between align-items-start mb-2">
//                         <div
//                           className="text-truncate fw-medium text-light"
//                           style={{ maxWidth: "200px" }}
//                         >
//                           {msg.text}
//                         </div>
//                         {msg.adminReply ? (
//                           !msg.isReplyRead ? (
//                             <span
//                               className="badge bg-cyan text-dark rounded-pill"
//                               style={{ fontSize: "0.6rem" }}
//                             >
//                               NEW REPLY
//                             </span>
//                           ) : (
//                             <span
//                               className="badge bg-success bg-opacity-10 text-success rounded-pill"
//                               style={{ fontSize: "0.6rem" }}
//                             >
//                               Answered
//                             </span>
//                           )
//                         ) : (
//                           <span
//                             className="badge bg-secondary bg-opacity-25 text-light rounded-pill"
//                             style={{ fontSize: "0.6rem" }}
//                           >
//                             Pending
//                           </span>
//                         )}
//                       </div>
//                       <div className="small text-muted d-flex justify-content-between">
//                         <span>
//                           {new Date(msg.createdAt).toLocaleDateString()}
//                         </span>
//                         <span className="text-cyan">View</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-4 text-muted">
//                   <MessageSquare size={24} className="mb-2 opacity-50" />
//                   <p className="small mb-0">No active support tickets.</p>
//                 </div>
//               )}
//             </div>
//             {/* Scroll down to footer to send new message instruction */}
//             <div className="p-3 border-top-dark text-center bg-dark bg-opacity-50">
//               <span className="small text-muted">
//                 Use the footer to send a new message.
//               </span>
//             </div>
//           </div>

//           {/* 6. NEXT APPOINTMENT */}
//           <div className="dark-card rounded-4 mb-4 p-4 position-relative overflow-hidden">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h5 className="fw-bold text-white mb-0">Next Appointment</h5>
//               <div
//                 className="icon-box bg-blue cursor-pointer hover-lift"
//                 onClick={() => navigate("/appointments")}
//                 title="Go to Appointments"
//               >
//                 <Calendar size={18} className="text-white" />
//               </div>
//             </div>

//             {upcomingAppt ? (
//               <div className="dark-inner-card rounded-4 p-3 border-dark-subtle">
//                 <h5 className="fw-bold text-cyan mb-1">
//                   Dr. {upcomingAppt.doctor?.name}
//                 </h5>
//                 <p className="text-muted small mb-3">
//                   {upcomingAppt.doctor?.speciality}
//                 </p>
//                 <div className="d-flex align-items-center gap-2 mb-2 text-light">
//                   <Clock size={16} className="text-blue" />
//                   <span className="fw-medium small">
//                     {new Date(upcomingAppt.date).toDateString()}
//                   </span>
//                 </div>
//                 <button
//                   className="btn btn-outline-cyan w-100 fw-bold rounded-pill mt-3"
//                   onClick={() => navigate("/appointments")}
//                 >
//                   View Details
//                 </button>
//               </div>
//             ) : (
//               <div
//                 className="text-center py-4 dark-inner-card rounded-4 border-dark-subtle border"
//                 style={{ borderStyle: "dashed" }}
//               >
//                 <p className="text-muted small mb-3">
//                   No upcoming visits scheduled.
//                 </p>
//                 <button
//                   className="btn btn-outline-cyan px-4 fw-bold rounded-pill"
//                   onClick={() => navigate("/appointments")}
//                 >
//                   Book Now
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* 7. UPLOAD PRESCRIPTION */}
//           <div className="dark-card rounded-4 mb-4 p-4">
//             <div className="d-flex align-items-center gap-3 mb-4">
//               <div className="icon-box bg-yellow">
//                 <Upload size={20} className="text-white" />
//               </div>
//               <div>
//                 <h5 className="fw-bold text-white mb-0">Upload Script</h5>
//                 <span className="text-muted small">
//                   Quick prescription upload
//                 </span>
//               </div>
//             </div>
//             <button
//               className="btn btn-yellow-glow w-100 fw-bold rounded-pill text-dark d-flex align-items-center justify-content-center gap-2"
//               onClick={() => setShowUploadModal(true)}
//             >
//               <Plus size={18} /> Upload Now
//             </button>
//           </div>
//         </Col>
//       </Row>

//       {/* --- UPLOAD PRESCRIPTION MODAL --- */}
//       <Modal
//         show={showUploadModal}
//         onHide={() => setShowUploadModal(false)}
//         centered
//         contentClassName="dark-card border-light-subtle rounded-4"
//         backdropClassName="bg-black opacity-75"
//       >
//         <div className="modal-header border-bottom-dark p-4">
//           <h5 className="modal-title fw-bold text-white d-flex align-items-center gap-2">
//             <Upload className="text-cyan" size={20} /> Upload Prescription
//           </h5>
//           <button
//             type="button"
//             className="btn-close btn-close-white"
//             onClick={() => setShowUploadModal(false)}
//           ></button>
//         </div>
//         <Modal.Body className="p-4 text-light">
//           {uploadMessage && (
//             <div
//               className={`alert fw-bold small py-2 px-3 border-0 rounded-3 ${uploadMessage.includes("Success") ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"}`}
//             >
//               {uploadMessage}
//             </div>
//           )}
//           <Form onSubmit={handleUploadPrescription}>
//             <Form.Group className="mb-4">
//               <Form.Label className="small fw-medium text-muted">
//                 Prescription Image/PDF
//               </Form.Label>
//               <Form.Control
//                 type="file"
//                 className="dark-input border-dark-subtle text-light bg-transparent"
//                 onChange={handlePrescriptionChange}
//                 accept="image/*,application/pdf"
//               />
//               {prescriptionPreview && (
//                 <div className="mt-3 text-center dark-inner-card p-2 rounded-3 border-dark-subtle">
//                   <img
//                     src={prescriptionPreview}
//                     alt="Preview"
//                     className="rounded-2 img-fluid"
//                     style={{ maxHeight: "150px" }}
//                   />
//                 </div>
//               )}
//             </Form.Group>
//             <Form.Group className="mb-4">
//               <Form.Label className="small fw-medium text-muted">
//                 Additional Notes
//               </Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 className="dark-input border-dark-subtle text-light bg-transparent"
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="E.g. I need 2 strips of..."
//                 style={{ resize: "none" }}
//               />
//             </Form.Group>
//             <button
//               type="submit"
//               className="btn btn-cyan-glow w-100 rounded-pill py-2 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
//               disabled={uploadLoading}
//             >
//               {uploadLoading ? (
//                 <>
//                   <Loader2 size={18} className="spin-animation" /> Uploading...
//                 </>
//               ) : (
//                 "Submit Prescription"
//               )}
//             </button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* ✅ VIEW MESSAGE REPLY MODAL */}
//       <Modal
//         show={selectedMessage !== null}
//         onHide={() => setSelectedMessage(null)}
//         centered
//         contentClassName="dark-card border-light-subtle rounded-4"
//         backdropClassName="bg-black opacity-75"
//       >
//         <div className="modal-header border-bottom-dark p-4">
//           <h5 className="modal-title fw-bold text-white d-flex align-items-center gap-2">
//             <MessageSquare className="text-cyan" size={20} /> Support Ticket
//           </h5>
//           <button
//             type="button"
//             className="btn-close btn-close-white"
//             onClick={() => setSelectedMessage(null)}
//           ></button>
//         </div>
//         <Modal.Body className="p-4 text-light">
//           <div className="mb-4">
//             <h6 className="fw-bold text-muted small text-uppercase tracking-wider mb-2">
//               You wrote:
//             </h6>
//             <div className="dark-inner-card p-3 rounded-4 border-dark-subtle fst-italic">
//               "{selectedMessage?.text}"
//             </div>
//             <div className="text-end text-muted small mt-1">
//               {selectedMessage
//                 ? new Date(selectedMessage.createdAt).toLocaleString()
//                 : ""}
//             </div>
//           </div>

//           <div>
//             <h6 className="fw-bold text-cyan small text-uppercase tracking-wider mb-2">
//               Admin Response:
//             </h6>
//             {selectedMessage?.adminReply ? (
//               <div className="bg-cyan bg-opacity-10 border border-cyan border-opacity-25 p-3 rounded-4 text-white">
//                 {selectedMessage.adminReply}
//               </div>
//             ) : (
//               <div
//                 className="dark-inner-card p-3 rounded-4 border-dark-subtle text-muted text-center"
//                 style={{ borderStyle: "dashed" }}
//               >
//                 <Clock size={20} className="mb-2 opacity-50" />
//                 <p className="small mb-0">
//                   Our team is reviewing your message. We usually reply within 24
//                   hours.
//                 </p>
//               </div>
//             )}
//           </div>
//         </Modal.Body>
//         <div className="modal-footer border-top-dark">
//           <button
//             className="btn btn-outline-light rounded-pill px-4"
//             onClick={() => setSelectedMessage(null)}
//           >
//             Close
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default CustomerDashboard;

// import React, { useState, useEffect } from "react";
// import {
//   Package,
//   Calendar,
//   FileText,
//   CreditCard,
//   Upload,
//   Plus,
//   Clock,
//   Ticket,
//   Heart,
//   ShoppingCart,
//   Loader2,
//   Activity,
//   ArrowUpRight,
//   MessageSquare,
//   Bell,
//   CheckCircle2,
//   Send,
// } from "lucide-react";
// import { Form, Row, Col, Modal } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { useAuth } from "../context/AuthContext";
// import { addToCart } from "../redux/actions/cartActions";

// const API_BASE_URL = "http://localhost:5000/api";

// const CustomerDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   // --- UI State ---
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState(null);

//   // ✅ Customer Reply State
//   const [customerReplyText, setCustomerReplyText] = useState("");
//   const [replyLoading, setReplyLoading] = useState(false);

//   // --- Data State ---
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [myPrescriptions, setMyPrescriptions] = useState([]);
//   const [savedMedicines, setSavedMedicines] = useState([]);
//   const [myMessages, setMyMessages] = useState([]);
//   const [medicines, setMedicines] = useState([]);

//   // --- Interaction State ---
//   const [prescriptionFile, setPrescriptionFile] = useState(null);
//   const [prescriptionPreview, setPrescriptionPreview] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // --- Effects ---
//   useEffect(() => {
//     fetchAllData();

//     // Background Sync
//     const syncMessages = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;
//         const res = await fetch(`${API_BASE_URL}/messages/my`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.ok) {
//           const latestMessages = await res.json();
//           setMyMessages(latestMessages);
//         }
//       } catch (err) {}
//     };

//     const interval = setInterval(syncMessages, 15000);
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ Auto-scroll if navigated from the Layout Notification Bell
//   useEffect(() => {
//     if (location.state?.scrollTo === "support-tickets") {
//       scrollToTickets();
//       // Clear the state so it doesn't keep scrolling on every re-render
//       window.history.replaceState({}, document.title);
//     }
//   }, [location]);

//   // Helper function to scroll to tickets and highlight
//   const scrollToTickets = () => {
//     const el = document.getElementById("support-tickets-section");
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth", block: "center" });
//       el.classList.add("border-primary", "shadow-lg");
//       setTimeout(
//         () => el.classList.remove("border-primary", "shadow-lg"),
//         2000,
//       );
//     }
//   };

//   const safelyGetArray = (data, key) => {
//     if (Array.isArray(data)) return data;
//     if (data && Array.isArray(data[key])) return data[key];
//     return [];
//   };

//   const getImageUrl = (path) => {
//     if (!path)
//       return "https://ui-avatars.com/api/?name=Med&background=eff6ff&color=2563eb";
//     return path.startsWith("http") ? path : `http://localhost:5000${path}`;
//   };

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       if (!token) return navigate("/login");
//       const headers = { Authorization: `Bearer ${token}` };

//       const results = await Promise.allSettled([
//         fetch(`${API_BASE_URL}/auth/profile`, { headers }),
//         fetch(`${API_BASE_URL}/customer/orders`, { headers }),
//         fetch(`${API_BASE_URL}/medicines`, { headers }),
//         fetch(`${API_BASE_URL}/customer/appointments`, { headers }),
//         fetch(`${API_BASE_URL}/customer/prescriptions`, { headers }),
//         fetch(`${API_BASE_URL}/customer/saved-medicines`, { headers }),
//         fetch(`${API_BASE_URL}/messages/my`, { headers }),
//       ]);

//       const [
//         profileRes,
//         ordersRes,
//         medsRes,
//         apptRes,
//         presRes,
//         savedRes,
//         msgRes,
//       ] = results;

//       if (profileRes.status === "fulfilled" && profileRes.value.ok)
//         setProfile(await profileRes.value.json());
//       if (ordersRes.status === "fulfilled" && ordersRes.value.ok)
//         setOrders(safelyGetArray(await ordersRes.value.json(), "orders"));
//       if (medsRes.status === "fulfilled" && medsRes.value.ok)
//         setMedicines(safelyGetArray(await medsRes.value.json(), "medicines"));
//       if (apptRes.status === "fulfilled" && apptRes.value.ok)
//         setMyAppointments(
//           safelyGetArray(await apptRes.value.json(), "appointments"),
//         );
//       if (presRes.status === "fulfilled" && presRes.value.ok)
//         setMyPrescriptions(
//           safelyGetArray(await presRes.value.json(), "prescriptions"),
//         );
//       if (savedRes.status === "fulfilled" && savedRes.value.ok)
//         setSavedMedicines(await savedRes.value.json());
//       if (msgRes.status === "fulfilled" && msgRes.value.ok)
//         setMyMessages(await msgRes.value.json());
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mark Message Reply as Read
//   const handleReadMessage = async (msg) => {
//     setSelectedMessage(msg);
//     setCustomerReplyText(""); // Reset reply box when opening

//     if (msg.adminReply && !msg.isReplyRead) {
//       try {
//         const token = localStorage.getItem("token");
//         await fetch(`${API_BASE_URL}/messages/${msg._id}/read-reply`, {
//           method: "PUT",
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setMyMessages((prev) =>
//           prev.map((m) =>
//             m._id === msg._id ? { ...m, isReplyRead: true } : m,
//           ),
//         );
//       } catch (err) {}
//     }
//   };

//   // ✅ Send a Customer Reply back to Admin
//   const handleSendCustomerReply = async () => {
//     if (!customerReplyText.trim()) return;
//     try {
//       setReplyLoading(true);
//       const token = localStorage.getItem("token");

//       // We trigger the standard create message endpoint so it shows as a new ticket for admin
//       await fetch(`${API_BASE_URL}/messages`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: profile?.name || user?.name || "Customer",
//           email: profile?.email || user?.email || "customer@example.com",
//           text: `[Reply to previous ticket]: ${customerReplyText}`,
//         }),
//       });

//       setCustomerReplyText("");
//       setSelectedMessage(null);
//       fetchAllData(); // Refresh list to show the new outgoing message
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send reply.");
//     } finally {
//       setReplyLoading(false);
//     }
//   };

//   // ... (Upload Prescription Logic remains the same)
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
//       let res = await fetch(`${API_BASE_URL}/prescriptions`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });
//       if (!res.ok)
//         res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//           body: formData,
//         });
//       if (res.ok) {
//         setUploadMessage("Prescription uploaded successfully!");
//         setPrescriptionFile(null);
//         setPrescriptionPreview(null);
//         setNotes("");
//         setShowUploadModal(false);
//         fetchAllData();
//       } else {
//         setUploadMessage("Failed to upload.");
//       }
//     } catch (err) {
//       setUploadMessage("Error uploading prescription.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const handleAddToCart = (med) => {
//     const itemToAdd = med.medicine || med;
//     if (!itemToAdd || itemToAdd.countInStock === 0) return;
//     dispatch(addToCart(itemToAdd._id, 1));
//     alert(`${itemToAdd.name} added to cart!`);
//   };

//   if (loading) {
//     return (
//       <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary mb-3" size={48} />
//         <span className="text-muted fw-bold tracking-wider text-uppercase small">
//           Loading Dashboard...
//         </span>
//       </div>
//     );
//   }

//   const unreadRepliesCount = myMessages.filter(
//     (m) => m.adminReply && !m.isReplyRead,
//   ).length;
//   const upcomingAppt = myAppointments
//     .filter(
//       (a) =>
//         new Date(a.date) >= new Date().setHours(0, 0, 0, 0) &&
//         a.status !== "cancelled",
//     )
//     .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

//   const statsCards = [
//     {
//       label: "Wallet Points",
//       value: profile?.loyaltyPoints || 0,
//       icon: CreditCard,
//       colorClass: "text-primary",
//       bgClass: "bg-primary",
//       link: "/profile",
//     },
//     {
//       label: "Active Orders",
//       value: orders.filter((o) => !o.isDelivered).length,
//       icon: Package,
//       colorClass: "text-success",
//       bgClass: "bg-success",
//       link: "/orders",
//     },
//     {
//       label: "Appointments",
//       value: myAppointments.length,
//       icon: Calendar,
//       colorClass: "text-info",
//       bgClass: "bg-info",
//       link: "/appointments",
//     },
//     {
//       label: "Prescriptions",
//       value: myPrescriptions.length,
//       icon: FileText,
//       colorClass: "text-warning",
//       bgClass: "bg-warning",
//       link: "/prescriptions",
//     },
//   ];

//   return (
//     <div
//       className="min-vh-100 bg-light p-3 p-md-4"
//       style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
//     >
//       {/* 1. PROFESSIONAL HERO BANNER */}
//       <div className="bg-white rounded-4 mb-4 p-4 p-md-5 shadow-sm border border-light-subtle d-flex justify-content-between align-items-center flex-wrap gap-4 position-relative overflow-hidden">
//         <div
//           className="position-absolute top-0 end-0 h-100 w-50 bg-primary opacity-10"
//           style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
//         ></div>
//         <div className="position-relative z-1">
//           <h2 className="fw-black text-dark mb-2 tracking-tight">
//             Welcome back, {profile?.name || user?.name || "Customer"}!
//           </h2>
//           <p className="text-muted fs-5 mb-0 fw-medium">
//             Here is your health and activity overview.
//           </p>
//         </div>

//         {/* ✅ LIVE NOTIFICATION BADGE (Scrolls to tickets on click) */}
//         {unreadRepliesCount > 0 && (
//           <div
//             className="position-relative z-1 bg-white p-3 rounded-4 border border-primary shadow-sm d-flex align-items-center gap-3 animate-fade-in cursor-pointer hover-lift transition-all"
//             onClick={scrollToTickets}
//           >
//             <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary position-relative">
//               <Bell size={24} />
//               <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-2 border-white rounded-circle"></span>
//             </div>
//             <div>
//               <div className="fw-bold text-dark">Support Reply</div>
//               <div className="small text-muted fw-medium">
//                 You have {unreadRepliesCount} unread message(s)
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* 2. CLINICAL KPI STATS ROW */}
//       <Row className="g-4 mb-4">
//         {statsCards.map((item, idx) => (
//           <Col xs={6} xl={3} key={idx}>
//             <div
//               className="bg-white h-100 p-4 rounded-4 shadow-sm border border-light-subtle cursor-pointer transition-all hover-lift d-flex flex-column justify-content-between"
//               onClick={() => navigate(item.link)}
//             >
//               <div className="d-flex align-items-center gap-3 mb-3">
//                 <div
//                   className={`${item.bgClass} bg-opacity-10 p-2 rounded-circle ${item.colorClass}`}
//                 >
//                   <item.icon size={20} strokeWidth={2.5} />
//                 </div>
//                 <span className="text-muted fw-bold small text-uppercase tracking-wider">
//                   {item.label}
//                 </span>
//               </div>
//               <h2 className="fw-black mb-0 text-dark">{item.value}</h2>
//             </div>
//           </Col>
//         ))}
//       </Row>

//       <Row className="g-4">
//         <Col lg={8}>
//           {/* 3. RECENT ORDERS TABLE */}
//           <div className="bg-white rounded-4 shadow-sm border border-light-subtle mb-4 overflow-hidden">
//             <div className="p-4 border-bottom border-light-subtle d-flex justify-content-between align-items-center bg-light bg-opacity-50">
//               <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
//                 <Package size={20} className="text-primary" /> Recent Orders
//               </h5>
//               <button
//                 className="btn btn-link text-primary text-decoration-none fw-bold p-0 d-flex align-items-center gap-1"
//                 onClick={() => navigate("/orders")}
//               >
//                 View all <ArrowUpRight size={18} />
//               </button>
//             </div>
//             <div className="table-responsive p-0">
//               <table className="table table-hover align-middle mb-0 border-0">
//                 <thead className="bg-white">
//                   <tr>
//                     <th className="ps-4 border-bottom py-3 text-muted small fw-bold text-uppercase">
//                       Order ID
//                     </th>
//                     <th className="border-bottom py-3 text-muted small fw-bold text-uppercase">
//                       Date
//                     </th>
//                     <th className="border-bottom py-3 text-muted small fw-bold text-uppercase">
//                       Status
//                     </th>
//                     <th className="border-bottom py-3 text-muted small fw-bold text-uppercase">
//                       Amount
//                     </th>
//                     <th className="pe-4 text-end border-bottom py-3 text-muted small fw-bold text-uppercase">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.slice(0, 5).map((order) => (
//                     <tr key={order._id}>
//                       <td className="ps-4 py-3 fw-bold font-monospace text-secondary">
//                         #
//                         {order._id
//                           .substring(order._id.length - 6)
//                           .toUpperCase()}
//                       </td>
//                       <td className="text-dark fw-medium">
//                         {new Date(order.createdAt).toLocaleDateString("en-US", {
//                           month: "short",
//                           day: "numeric",
//                           year: "numeric",
//                         })}
//                       </td>
//                       <td>
//                         <span
//                           className={`badge rounded-pill px-3 py-2 ${order.isPaid ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25" : "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25"}`}
//                         >
//                           {order.isPaid ? "Completed" : "Pending"}
//                         </span>
//                       </td>
//                       <td className="text-dark fw-bold">
//                         Rs. {Number(order.totalPrice).toLocaleString()}
//                       </td>
//                       <td className="text-end pe-4">
//                         <button
//                           className="btn btn-sm btn-light border fw-bold text-primary rounded-pill px-3 hover-lift"
//                           onClick={() => navigate(`/orders`)}
//                         >
//                           Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                   {orders.length === 0 && (
//                     <tr>
//                       <td
//                         colSpan="5"
//                         className="text-center py-5 text-muted fw-medium"
//                       >
//                         No recent orders found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* 4. SAVED MEDICINES */}
//           <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-4">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
//                 <Heart size={20} className="text-danger" fill="#ef4444" /> Saved
//                 Items
//               </h5>
//               <button
//                 className="btn btn-link text-primary text-decoration-none fw-bold p-0 d-flex align-items-center gap-1"
//                 onClick={() => navigate("/customer/saved")}
//               >
//                 View all <ArrowUpRight size={18} />
//               </button>
//             </div>
//             {savedMedicines.length > 0 ? (
//               <Row className="g-3">
//                 {savedMedicines.slice(0, 3).map((item) => {
//                   const med = item.medicine;
//                   if (!med) return null;
//                   return (
//                     <Col xs={12} sm={6} md={4} key={item._id}>
//                       <div className="bg-light p-3 rounded-4 d-flex align-items-center gap-3 border border-light-subtle transition-all hover-lift h-100">
//                         <img
//                           src={getImageUrl(med.image)}
//                           alt={med.name}
//                           className="rounded-3 object-fit-cover bg-white shadow-sm border"
//                           style={{ width: "50px", height: "50px" }}
//                         />
//                         <div className="flex-grow-1 overflow-hidden">
//                           <h6
//                             className="mb-1 fw-bold text-dark text-truncate"
//                             title={med.name}
//                           >
//                             {med.name}
//                           </h6>
//                           <div className="text-primary fw-black small">
//                             Rs. {med.price}
//                           </div>
//                         </div>
//                         <button
//                           className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm"
//                           onClick={() => handleAddToCart(item)}
//                           title="Add to Cart"
//                         >
//                           <ShoppingCart size={16} className="text-white" />
//                         </button>
//                       </div>
//                     </Col>
//                   );
//                 })}
//               </Row>
//             ) : (
//               <div
//                 className="text-center py-5 bg-light rounded-4 border border-light-subtle"
//                 style={{ borderStyle: "dashed !important" }}
//               >
//                 <Heart size={32} className="mb-3 text-muted opacity-50" />
//                 <p className="text-muted fw-medium mb-0">
//                   Your wishlist is empty.
//                 </p>
//                 <button
//                   className="btn btn-link text-primary fw-bold mt-2"
//                   onClick={() => navigate("/medicines")}
//                 >
//                   Browse Catalog
//                 </button>
//               </div>
//             )}
//           </div>
//         </Col>

//         {/* --- RIGHT COLUMN --- */}
//         <Col lg={4}>
//           {/* ✅ 5. SUPPORT TICKETS PANEL (Now with an ID for auto-scrolling) */}
//           <div
//             id="support-tickets-section"
//             className="bg-white rounded-4 mb-4 shadow-sm border border-light-subtle overflow-hidden d-flex flex-column transition-all"
//             style={{ maxHeight: "400px" }}
//           >
//             <div className="p-4 border-bottom border-light-subtle d-flex justify-content-between align-items-center bg-light bg-opacity-50">
//               <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
//                 <MessageSquare size={18} className="text-primary" /> Support
//                 Tickets
//               </h5>
//             </div>

//             {/* TTL Notification */}
//             <div className="bg-warning bg-opacity-10 border-bottom border-warning border-opacity-25 px-3 py-2 text-center">
//               <span className="small fw-bold text-warning d-flex justify-content-center align-items-center gap-1">
//                 <Clock size={14} /> Messages auto-delete after 48 hours.
//               </span>
//             </div>

//             <div className="p-3 overflow-auto flex-grow-1">
//               {myMessages.length > 0 ? (
//                 <div className="d-flex flex-column gap-3">
//                   {myMessages.slice(0, 5).map((msg) => (
//                     <div
//                       key={msg._id}
//                       className={`p-3 rounded-4 border transition-all cursor-pointer hover-lift ${msg.adminReply && !msg.isReplyRead ? "border-primary bg-primary bg-opacity-10 shadow-sm" : "border-light-subtle bg-light"}`}
//                       onClick={() => handleReadMessage(msg)}
//                     >
//                       <div className="d-flex justify-content-between align-items-start mb-2">
//                         <div
//                           className="text-truncate fw-bold text-dark"
//                           style={{ maxWidth: "200px", fontSize: "0.9rem" }}
//                         >
//                           {msg.text}
//                         </div>
//                         {msg.adminReply ? (
//                           !msg.isReplyRead ? (
//                             <span
//                               className="badge bg-primary text-white rounded-pill shadow-sm"
//                               style={{ fontSize: "0.6rem" }}
//                             >
//                               NEW REPLY
//                             </span>
//                           ) : (
//                             <span
//                               className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill"
//                               style={{ fontSize: "0.6rem" }}
//                             >
//                               Answered
//                             </span>
//                           )
//                         ) : (
//                           <span
//                             className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 rounded-pill"
//                             style={{ fontSize: "0.6rem" }}
//                           >
//                             Pending
//                           </span>
//                         )}
//                       </div>
//                       <div className="small text-muted d-flex justify-content-between align-items-center mt-2">
//                         <span style={{ fontSize: "0.75rem" }}>
//                           {new Date(msg.createdAt).toLocaleDateString()}
//                         </span>
//                         <span
//                           className="text-primary fw-bold"
//                           style={{ fontSize: "0.75rem" }}
//                         >
//                           View &rarr;
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-5 text-muted">
//                   <MessageSquare
//                     size={32}
//                     className="mb-3 opacity-25 text-primary"
//                   />
//                   <p className="small fw-medium mb-0">
//                     No active support tickets.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* 6. NEXT APPOINTMENT */}
//           <div className="bg-white rounded-4 mb-4 shadow-sm border border-light-subtle p-4">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h5 className="fw-bold text-dark mb-0">Next Appointment</h5>
//               <div
//                 className="bg-info bg-opacity-10 p-2 rounded-circle cursor-pointer hover-lift"
//                 onClick={() => navigate("/appointments")}
//               >
//                 <Calendar size={20} className="text-info" />
//               </div>
//             </div>
//             {upcomingAppt ? (
//               <div className="bg-light rounded-4 p-4 border border-light-subtle text-center">
//                 <div className="bg-white rounded-circle shadow-sm d-inline-flex p-3 mb-3 border">
//                   <Activity size={24} className="text-info" />
//                 </div>
//                 <h5 className="fw-bold text-dark mb-1">
//                   Dr. {upcomingAppt.doctor?.name}
//                 </h5>
//                 <p className="text-muted small fw-medium mb-3">
//                   {upcomingAppt.doctor?.speciality}
//                 </p>
//                 <div className="bg-white border rounded-3 p-2 d-flex justify-content-center align-items-center gap-2 mb-3">
//                   <Clock size={16} className="text-info" />
//                   <span className="fw-bold text-dark small">
//                     {new Date(upcomingAppt.date).toDateString()}
//                   </span>
//                 </div>
//                 <button
//                   className="btn btn-outline-info w-100 fw-bold rounded-pill"
//                   onClick={() => navigate("/appointments")}
//                 >
//                   View Details
//                 </button>
//               </div>
//             ) : (
//               <div
//                 className="text-center py-5 bg-light rounded-4 border border-light-subtle"
//                 style={{ borderStyle: "dashed !important" }}
//               >
//                 <p className="text-muted fw-medium mb-3">
//                   No upcoming visits scheduled.
//                 </p>
//                 <button
//                   className="btn btn-info text-white px-4 fw-bold rounded-pill shadow-sm"
//                   onClick={() => navigate("/appointments")}
//                 >
//                   Book Now
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* 7. UPLOAD PRESCRIPTION */}
//           <div className="bg-white rounded-4 mb-4 shadow-sm border border-light-subtle p-4">
//             <div className="d-flex align-items-center gap-3 mb-4">
//               <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
//                 <Upload size={24} />
//               </div>
//               <div>
//                 <h5 className="fw-bold text-dark mb-0">Upload Script</h5>
//                 <span className="text-muted small fw-medium">
//                   Quick digital upload
//                 </span>
//               </div>
//             </div>
//             <button
//               className="btn btn-warning w-100 fw-bold rounded-pill text-white d-flex align-items-center justify-content-center gap-2 shadow-sm"
//               onClick={() => setShowUploadModal(true)}
//             >
//               <Plus size={18} /> Upload Now
//             </button>
//           </div>
//         </Col>
//       </Row>

//       {/* --- UPLOAD MODAL --- */}
//       <Modal
//         show={showUploadModal}
//         onHide={() => setShowUploadModal(false)}
//         centered
//         contentClassName="border-0 shadow-lg rounded-4"
//       >
//         <div className="modal-header bg-light border-bottom border-light-subtle p-4">
//           <h5 className="modal-title fw-black text-dark d-flex align-items-center gap-2">
//             <Upload className="text-warning" size={20} /> Upload Prescription
//           </h5>
//           <button
//             type="button"
//             className="btn-close"
//             onClick={() => setShowUploadModal(false)}
//           ></button>
//         </div>
//         <Modal.Body className="p-4 bg-white">
//           <Form onSubmit={handleUploadPrescription}>
//             <Form.Group className="mb-4">
//               <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">
//                 Prescription Image/PDF
//               </Form.Label>
//               <Form.Control
//                 type="file"
//                 className="border-light-subtle bg-light"
//                 onChange={handlePrescriptionChange}
//                 accept="image/*,application/pdf"
//               />
//               {prescriptionPreview && (
//                 <div className="mt-3 text-center bg-light p-2 rounded-3 border border-light-subtle">
//                   <img
//                     src={prescriptionPreview}
//                     alt="Preview"
//                     className="rounded-2 img-fluid shadow-sm"
//                     style={{ maxHeight: "150px" }}
//                   />
//                 </div>
//               )}
//             </Form.Group>
//             <Form.Group className="mb-4">
//               <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">
//                 Additional Notes
//               </Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 className="border-light-subtle bg-light"
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="E.g. I need 2 strips of..."
//                 style={{ resize: "none" }}
//               />
//             </Form.Group>
//             <button
//               type="submit"
//               className="btn btn-warning w-100 rounded-pill py-2 fw-bold text-white shadow-sm d-flex align-items-center justify-content-center gap-2"
//               disabled={uploadLoading}
//             >
//               {uploadLoading ? (
//                 <>
//                   <Loader2 size={18} className="spin-animation" /> Uploading...
//                 </>
//               ) : (
//                 "Submit Prescription"
//               )}
//             </button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* ✅ VIEW & REPLY MESSAGE MODAL */}
//       <Modal
//         show={selectedMessage !== null}
//         onHide={() => setSelectedMessage(null)}
//         centered
//         contentClassName="border-0 shadow-lg rounded-4"
//       >
//         <div className="modal-header bg-primary text-white border-0 p-4 rounded-top-4">
//           <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
//             <MessageSquare size={20} /> Support Ticket
//           </h5>
//           <button
//             type="button"
//             className="btn-close btn-close-white"
//             onClick={() => setSelectedMessage(null)}
//           ></button>
//         </div>
//         <Modal.Body className="p-4 bg-white">
//           <div className="mb-4">
//             <h6 className="fw-bold text-muted small text-uppercase tracking-wider mb-2">
//               You initially wrote:
//             </h6>
//             <div className="bg-light p-3 rounded-4 border border-light-subtle text-dark fw-medium shadow-sm">
//               "{selectedMessage?.text}"
//             </div>
//             <div className="text-end text-muted small mt-2 fw-medium">
//               Sent:{" "}
//               {selectedMessage
//                 ? new Date(selectedMessage.createdAt).toLocaleString()
//                 : ""}
//             </div>
//           </div>

//           <div className="mb-4">
//             <h6 className="fw-bold text-primary small text-uppercase tracking-wider mb-2">
//               Admin Response:
//             </h6>
//             {selectedMessage?.adminReply ? (
//               <div className="bg-primary bg-opacity-10 border-start border-4 border-primary p-3 rounded-3 text-dark fw-bold shadow-sm">
//                 {selectedMessage.adminReply}
//               </div>
//             ) : (
//               <div
//                 className="bg-light p-4 rounded-4 border border-light-subtle text-muted text-center"
//                 style={{ borderStyle: "dashed" }}
//               >
//                 <Clock size={24} className="mb-2 opacity-50 text-primary" />
//                 <p className="small fw-medium mb-0">
//                   Our team is reviewing your message. We usually reply within 24
//                   hours.
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* ✅ CUSTOMER REPLY BOX */}
//           <div className="border-top border-light-subtle pt-4">
//             <h6 className="fw-bold text-dark small text-uppercase tracking-wider mb-2">
//               Send a Follow-up:
//             </h6>
//             <Form.Control
//               as="textarea"
//               rows={2}
//               className="bg-light border-light-subtle mb-3"
//               placeholder="Need more help? Type your reply here..."
//               value={customerReplyText}
//               onChange={(e) => setCustomerReplyText(e.target.value)}
//               style={{ resize: "none" }}
//             />
//             <button
//               className="btn btn-primary w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
//               onClick={handleSendCustomerReply}
//               disabled={replyLoading || !customerReplyText.trim()}
//             >
//               {replyLoading ? (
//                 <Loader2 size={16} className="spin-animation" />
//               ) : (
//                 <Send size={16} />
//               )}
//               Send Reply
//             </button>
//           </div>
//         </Modal.Body>
//       </Modal>

//       <style>{`
//         .transition-all { transition: all 0.3s ease; }
//         .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
//         .spin-animation { animation: spin 1s linear infinite; }
//         @keyframes spin { 100% { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// };

// export default CustomerDashboard;

import React, { useState, useEffect } from "react";
import {
  Package,
  Calendar,
  FileText,
  CreditCard,
  Upload,
  Plus,
  Clock,
  Ticket,
  Heart,
  ShoppingCart,
  Loader2,
  Activity,
  ArrowUpRight,
  MessageSquare,
  Bell,
  CheckCircle2,
  Send,
  Pill,
  User,
} from "lucide-react";
import { Form, Row, Col, Modal } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { addToCart } from "../redux/actions/cartActions";

const API_BASE_URL = "http://localhost:5000/api";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // --- UI State ---
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // ✅ Customer Reply State
  const [customerReplyText, setCustomerReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  // --- Data State ---
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [savedMedicines, setSavedMedicines] = useState([]);
  const [myMessages, setMyMessages] = useState([]);
  const [medicines, setMedicines] = useState([]);

  // --- Interaction State ---
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [notes, setNotes] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  // --- Effects ---
  useEffect(() => {
    fetchAllData();

    // Background Sync
    const syncMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/messages/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const latestMessages = await res.json();
          setMyMessages(latestMessages);
        }
      } catch (err) {}
    };

    const interval = setInterval(syncMessages, 15000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Auto-scroll if navigated from the Layout Notification Bell
  useEffect(() => {
    if (location.state?.scrollTo === "support-tickets") {
      scrollToTickets();
      // Clear the state so it doesn't keep scrolling on every re-render
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Helper function to scroll to tickets and highlight
  const scrollToTickets = () => {
    const el = document.getElementById("support-tickets-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("border-primary", "shadow-lg");
      setTimeout(
        () => el.classList.remove("border-primary", "shadow-lg"),
        2000,
      );
    }
  };

  const safelyGetArray = (data, key) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data[key])) return data[key];
    return [];
  };

  const getImageUrl = (path) => {
    if (!path)
      return "https://ui-avatars.com/api/?name=Med&background=eff6ff&color=2563eb";
    return path.startsWith("http") ? path : `http://localhost:5000${path}`;
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      const headers = { Authorization: `Bearer ${token}` };

      const results = await Promise.allSettled([
        fetch(`${API_BASE_URL}/auth/profile`, { headers }),
        fetch(`${API_BASE_URL}/customer/orders`, { headers }),
        fetch(`${API_BASE_URL}/medicines`, { headers }),
        fetch(`${API_BASE_URL}/customer/appointments`, { headers }),
        fetch(`${API_BASE_URL}/customer/prescriptions`, { headers }),
        fetch(`${API_BASE_URL}/customer/saved-medicines`, { headers }),
        fetch(`${API_BASE_URL}/messages/my`, { headers }),
      ]);

      const [
        profileRes,
        ordersRes,
        medsRes,
        apptRes,
        presRes,
        savedRes,
        msgRes,
      ] = results;

      if (profileRes.status === "fulfilled" && profileRes.value.ok)
        setProfile(await profileRes.value.json());
      if (ordersRes.status === "fulfilled" && ordersRes.value.ok)
        setOrders(safelyGetArray(await ordersRes.value.json(), "orders"));
      if (medsRes.status === "fulfilled" && medsRes.value.ok)
        setMedicines(safelyGetArray(await medsRes.value.json(), "medicines"));
      if (apptRes.status === "fulfilled" && apptRes.value.ok)
        setMyAppointments(
          safelyGetArray(await apptRes.value.json(), "appointments"),
        );
      if (presRes.status === "fulfilled" && presRes.value.ok)
        setMyPrescriptions(
          safelyGetArray(await presRes.value.json(), "prescriptions"),
        );
      if (savedRes.status === "fulfilled" && savedRes.value.ok)
        setSavedMedicines(await savedRes.value.json());
      if (msgRes.status === "fulfilled" && msgRes.value.ok)
        setMyMessages(await msgRes.value.json());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark Message Reply as Read
  const handleReadMessage = async (msg) => {
    setSelectedMessage(msg);
    setCustomerReplyText(""); // Reset reply box when opening

    if (msg.adminReply && !msg.isReplyRead) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${API_BASE_URL}/messages/${msg._id}/read-reply`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });

        setMyMessages((prev) =>
          prev.map((m) =>
            m._id === msg._id ? { ...m, isReplyRead: true } : m,
          ),
        );
      } catch (err) {}
    }
  };

  // ✅ Send a Customer Reply back to Admin
  const handleSendCustomerReply = async () => {
    if (!customerReplyText.trim()) return;
    try {
      setReplyLoading(true);
      const token = localStorage.getItem("token");

      // We trigger the standard create message endpoint so it shows as a new ticket for admin
      await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile?.name || user?.name || "Customer",
          email: profile?.email || user?.email || "customer@example.com",
          text: `[Reply to previous ticket]: ${customerReplyText}`,
        }),
      });

      setCustomerReplyText("");
      setSelectedMessage(null);
      fetchAllData(); // Refresh list to show the new outgoing message
    } catch (err) {
      console.error(err);
      alert("Failed to send reply.");
    } finally {
      setReplyLoading(false);
    }
  };

  // ... (Upload Prescription Logic remains the same)
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
      if (!res.ok)
        res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      if (res.ok) {
        setUploadMessage("Prescription uploaded successfully!");
        setPrescriptionFile(null);
        setPrescriptionPreview(null);
        setNotes("");
        setShowUploadModal(false);
        fetchAllData();
      } else {
        setUploadMessage("Failed to upload.");
      }
    } catch (err) {
      setUploadMessage("Error uploading prescription.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleAddToCart = (med) => {
    const itemToAdd = med.medicine || med;
    if (!itemToAdd || itemToAdd.countInStock === 0) return;
    dispatch(addToCart(itemToAdd._id, 1));
    alert(`${itemToAdd.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        <Loader2 className="spin-animation text-primary mb-3" size={48} />
        <span className="text-muted fw-bold tracking-wider text-uppercase small">
          Loading Dashboard...
        </span>
      </div>
    );
  }

  const unreadRepliesCount = myMessages.filter(
    (m) => m.adminReply && !m.isReplyRead,
  ).length;
  const upcomingAppt = myAppointments
    .filter(
      (a) =>
        new Date(a.date) >= new Date().setHours(0, 0, 0, 0) &&
        a.status !== "cancelled",
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const statsCards = [
    {
      label: "Wallet Points",
      value: profile?.loyaltyPoints || 0,
      icon: CreditCard,
      colorClass: "text-primary",
      bgClass: "bg-primary",
      link: "/profile",
    },
    {
      label: "Active Orders",
      value: orders.filter((o) => !o.isDelivered).length,
      icon: Package,
      colorClass: "text-success",
      bgClass: "bg-success",
      link: "/orders",
    },
    {
      label: "Appointments",
      value: myAppointments.length,
      icon: Calendar,
      colorClass: "text-info",
      bgClass: "bg-info",
      link: "/appointments",
    },
    {
      label: "Prescriptions",
      value: myPrescriptions.length,
      icon: FileText,
      colorClass: "text-warning",
      bgClass: "bg-warning",
      link: "/prescriptions",
    },
  ];

  return (
    <div
      className="min-vh-100 bg-light p-3 p-md-4"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* 1. PROFESSIONAL HERO BANNER */}
      <div className="bg-white rounded-4 mb-4 p-4 p-md-5 shadow-sm border border-light-subtle d-flex justify-content-between align-items-center flex-wrap gap-4 position-relative overflow-hidden">
        <div
          className="position-absolute top-0 end-0 h-100 w-50 bg-primary opacity-10"
          style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
        ></div>
        <div className="position-relative z-1">
          <h2 className="fw-black text-dark mb-2 tracking-tight">
            Welcome back, {profile?.name || user?.name || "Customer"}!
          </h2>
          <p className="text-muted fs-5 mb-0 fw-medium">
            Here is your health and activity overview.
          </p>
        </div>

        {/* ✅ LIVE NOTIFICATION BADGE (Scrolls to tickets on click) */}
        {unreadRepliesCount > 0 && (
          <div
            className="position-relative z-1 bg-white p-3 rounded-4 border border-primary shadow-sm d-flex align-items-center gap-3 animate-fade-in cursor-pointer hover-lift transition-all"
            onClick={scrollToTickets}
          >
            <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary position-relative">
              <Bell size={24} />
              <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-2 border-white rounded-circle"></span>
            </div>
            <div>
              <div className="fw-bold text-dark">Support Reply</div>
              <div className="small text-muted fw-medium">
                You have {unreadRepliesCount} unread message(s)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. CLINICAL KPI STATS ROW */}
      <Row className="g-4 mb-4">
        {statsCards.map((item, idx) => (
          <Col xs={6} xl={3} key={idx}>
            <div
              className="bg-white h-100 p-4 rounded-4 shadow-sm border border-light-subtle cursor-pointer transition-all hover-lift d-flex flex-column justify-content-between"
              onClick={() => navigate(item.link)}
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className={`${item.bgClass} bg-opacity-10 p-2 rounded-circle ${item.colorClass}`}
                >
                  <item.icon size={20} strokeWidth={2.5} />
                </div>
                <span className="text-muted fw-bold small text-uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
              <h2 className="fw-black mb-0 text-dark">{item.value}</h2>
            </div>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          {/* 3. RECENT ORDERS TABLE */}
          <div className="bg-white rounded-4 shadow-sm border border-light-subtle mb-4 overflow-hidden">
            <div className="p-4 border-bottom border-light-subtle d-flex justify-content-between align-items-center bg-light bg-opacity-50">
              <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                <Package size={20} className="text-primary" /> Recent Orders
              </h5>
              <button
                className="btn btn-link text-primary text-decoration-none fw-bold p-0 d-flex align-items-center gap-1"
                onClick={() => navigate("/orders")}
              >
                View all <ArrowUpRight size={18} />
              </button>
            </div>
            <div className="table-responsive p-0">
              <table className="table table-hover align-middle mb-0 border-0">
                <thead className="bg-white">
                  <tr>
                    <th className="ps-4 border-bottom py-3 text-muted small fw-bold text-uppercase">
                      Order ID
                    </th>
                    <th className="border-bottom py-3 text-muted small fw-bold text-uppercase">
                      Date
                    </th>
                    <th className="border-bottom py-3 text-muted small fw-bold text-uppercase">
                      Status
                    </th>
                    <th className="border-bottom py-3 text-muted small fw-bold text-uppercase">
                      Amount
                    </th>
                    <th className="pe-4 text-end border-bottom py-3 text-muted small fw-bold text-uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id}>
                      <td className="ps-4 py-3 fw-bold font-monospace text-secondary">
                        #
                        {order._id
                          .substring(order._id.length - 6)
                          .toUpperCase()}
                      </td>
                      <td className="text-dark fw-medium">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-2 ${order.isPaid ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25" : "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25"}`}
                        >
                          {order.isPaid ? "Completed" : "Pending"}
                        </span>
                      </td>
                      <td className="text-dark fw-bold">
                        Rs. {Number(order.totalPrice).toLocaleString()}
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-light border fw-bold text-primary rounded-pill px-3 hover-lift"
                          onClick={() => navigate(`/orders`)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-5 text-muted fw-medium"
                      >
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. SAVED MEDICINES */}
          <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                <Heart size={20} className="text-danger" fill="#ef4444" /> Saved
                Items
              </h5>
              <button
                className="btn btn-link text-primary text-decoration-none fw-bold p-0 d-flex align-items-center gap-1"
                onClick={() => navigate("/customer/saved")}
              >
                View all <ArrowUpRight size={18} />
              </button>
            </div>
            {savedMedicines.length > 0 ? (
              <Row className="g-3">
                {savedMedicines.slice(0, 3).map((item) => {
                  const med = item.medicine;
                  if (!med) return null;
                  return (
                    <Col xs={12} sm={6} md={4} key={item._id}>
                      <div className="bg-light p-3 rounded-4 d-flex align-items-center gap-3 border border-light-subtle transition-all hover-lift h-100">
                        <img
                          src={getImageUrl(med.image)}
                          alt={med.name}
                          className="rounded-3 object-fit-cover bg-white shadow-sm border"
                          style={{ width: "50px", height: "50px" }}
                        />
                        <div className="flex-grow-1 overflow-hidden">
                          <h6
                            className="mb-1 fw-bold text-dark text-truncate"
                            title={med.name}
                          >
                            {med.name}
                          </h6>
                          <div className="text-primary fw-black small">
                            Rs. {med.price}
                          </div>
                        </div>
                        <button
                          className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm"
                          onClick={() => handleAddToCart(item)}
                          title="Add to Cart"
                        >
                          <ShoppingCart size={16} className="text-white" />
                        </button>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <div
                className="text-center py-5 bg-light rounded-4 border border-light-subtle"
                style={{ borderStyle: "dashed !important" }}
              >
                <Heart size={32} className="mb-3 text-muted opacity-50" />
                <p className="text-muted fw-medium mb-0">
                  Your wishlist is empty.
                </p>
                <button
                  className="btn btn-link text-primary fw-bold mt-2"
                  onClick={() => navigate("/medicines")}
                >
                  Browse Catalog
                </button>
              </div>
            )}
          </div>

          {/* 🚀 8. DOCTOR'S RECENT PRESCRIPTIONS (NEW SECTION) */}
          <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                <Pill size={20} className="text-success" /> Recent Prescriptions
              </h5>
              <button
                className="btn btn-link text-primary text-decoration-none fw-bold p-0 d-flex align-items-center gap-1"
                onClick={() => navigate("/prescriptions")}
              >
                View all <ArrowUpRight size={18} />
              </button>
            </div>

            {myPrescriptions.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {myPrescriptions.slice(0, 2).map((rx) => {
                  const isDigital = rx.items && rx.items.length > 0;
                  return (
                    <div
                      key={rx._id}
                      className="bg-light p-3 rounded-4 border border-light-subtle transition-all hover-lift"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-light-subtle">
                        <div className="fw-bold text-dark d-flex align-items-center gap-2">
                          {isDigital ? (
                            <>
                              <User size={16} className="text-primary" />
                              Dr. {rx.doctor?.name || "Doctor"}
                            </>
                          ) : (
                            <>
                              <Upload size={16} className="text-warning" />
                              Uploaded Prescription
                            </>
                          )}
                        </div>
                        <span
                          className={`badge rounded-pill px-2 py-1 ${rx.status?.toLowerCase() === "approved" ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25" : "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25"}`}
                        >
                          {rx.status || "Pending"}
                        </span>
                      </div>

                      {isDigital ? (
                        <div>
                          <span className="small text-muted fw-bold text-uppercase tracking-wider">
                            Prescribed Medicines:
                          </span>
                          <ul className="mb-0 mt-1 small text-dark fw-medium ps-3">
                            {rx.items.slice(0, 3).map((item, idx) => (
                              <li key={idx}>
                                {item.medicine} -{" "}
                                <span className="text-muted">
                                  {item.dosageInstructions} ({item.durationDays}{" "}
                                  days)
                                </span>
                              </li>
                            ))}
                            {rx.items.length > 3 && (
                              <li>
                                <span className="text-primary">
                                  + {rx.items.length - 3} more
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                      ) : (
                        <p className="small text-muted mb-0 fw-medium">
                          You uploaded a scanned prescription image. Waiting for
                          review.
                        </p>
                      )}

                      <div className="text-end mt-2">
                        <button
                          className="btn btn-sm btn-white border shadow-sm rounded-pill fw-bold text-primary px-3"
                          onClick={() => navigate("/prescriptions")}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="text-center py-4 bg-light rounded-4 border border-light-subtle"
                style={{ borderStyle: "dashed !important" }}
              >
                <Pill size={32} className="mb-2 text-muted opacity-50" />
                <p className="text-muted fw-medium mb-0 small">
                  No active prescriptions right now.
                </p>
              </div>
            )}
          </div>
        </Col>

        {/* --- RIGHT COLUMN --- */}
        <Col lg={4}>
          {/* ✅ 5. SUPPORT TICKETS PANEL (Now with an ID for auto-scrolling) */}
          <div
            id="support-tickets-section"
            className="bg-white rounded-4 mb-4 shadow-sm border border-light-subtle overflow-hidden d-flex flex-column transition-all"
            style={{ maxHeight: "400px" }}
          >
            <div className="p-4 border-bottom border-light-subtle d-flex justify-content-between align-items-center bg-light bg-opacity-50">
              <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                <MessageSquare size={18} className="text-primary" /> Support
                Tickets
              </h5>
            </div>

            {/* TTL Notification */}
            <div className="bg-warning bg-opacity-10 border-bottom border-warning border-opacity-25 px-3 py-2 text-center">
              <span className="small fw-bold text-warning d-flex justify-content-center align-items-center gap-1">
                <Clock size={14} /> Messages auto-delete after 48 hours.
              </span>
            </div>

            <div className="p-3 overflow-auto flex-grow-1">
              {myMessages.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {myMessages.slice(0, 5).map((msg) => (
                    <div
                      key={msg._id}
                      className={`p-3 rounded-4 border transition-all cursor-pointer hover-lift ${msg.adminReply && !msg.isReplyRead ? "border-primary bg-primary bg-opacity-10 shadow-sm" : "border-light-subtle bg-light"}`}
                      onClick={() => handleReadMessage(msg)}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div
                          className="text-truncate fw-bold text-dark"
                          style={{ maxWidth: "200px", fontSize: "0.9rem" }}
                        >
                          {msg.text}
                        </div>
                        {msg.adminReply ? (
                          !msg.isReplyRead ? (
                            <span
                              className="badge bg-primary text-white rounded-pill shadow-sm"
                              style={{ fontSize: "0.6rem" }}
                            >
                              NEW REPLY
                            </span>
                          ) : (
                            <span
                              className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill"
                              style={{ fontSize: "0.6rem" }}
                            >
                              Answered
                            </span>
                          )
                        ) : (
                          <span
                            className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 rounded-pill"
                            style={{ fontSize: "0.6rem" }}
                          >
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="small text-muted d-flex justify-content-between align-items-center mt-2">
                        <span style={{ fontSize: "0.75rem" }}>
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                        <span
                          className="text-primary fw-bold"
                          style={{ fontSize: "0.75rem" }}
                        >
                          View &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <MessageSquare
                    size={32}
                    className="mb-3 opacity-25 text-primary"
                  />
                  <p className="small fw-medium mb-0">
                    No active support tickets.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 6. NEXT APPOINTMENT */}
          <div className="bg-white rounded-4 mb-4 shadow-sm border border-light-subtle p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold text-dark mb-0">Next Appointment</h5>
              <div
                className="bg-info bg-opacity-10 p-2 rounded-circle cursor-pointer hover-lift"
                onClick={() => navigate("/appointments")}
              >
                <Calendar size={20} className="text-info" />
              </div>
            </div>
            {upcomingAppt ? (
              <div className="bg-light rounded-4 p-4 border border-light-subtle text-center">
                <div className="bg-white rounded-circle shadow-sm d-inline-flex p-3 mb-3 border">
                  <Activity size={24} className="text-info" />
                </div>
                <h5 className="fw-bold text-dark mb-1">
                  Dr. {upcomingAppt.doctor?.name}
                </h5>
                <p className="text-muted small fw-medium mb-3">
                  {upcomingAppt.doctor?.speciality}
                </p>
                <div className="bg-white border rounded-3 p-2 d-flex justify-content-center align-items-center gap-2 mb-3">
                  <Clock size={16} className="text-info" />
                  <span className="fw-bold text-dark small">
                    {new Date(upcomingAppt.date).toDateString()}
                  </span>
                </div>
                <button
                  className="btn btn-outline-info w-100 fw-bold rounded-pill"
                  onClick={() => navigate("/appointments")}
                >
                  View Details
                </button>
              </div>
            ) : (
              <div
                className="text-center py-5 bg-light rounded-4 border border-light-subtle"
                style={{ borderStyle: "dashed !important" }}
              >
                <p className="text-muted fw-medium mb-3">
                  No upcoming visits scheduled.
                </p>
                <button
                  className="btn btn-info text-white px-4 fw-bold rounded-pill shadow-sm"
                  onClick={() => navigate("/appointments")}
                >
                  Book Now
                </button>
              </div>
            )}
          </div>

          {/* 7. UPLOAD PRESCRIPTION */}
          <div className="bg-white rounded-4 mb-4 shadow-sm border border-light-subtle p-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                <Upload size={24} />
              </div>
              <div>
                <h5 className="fw-bold text-dark mb-0">Upload Script</h5>
                <span className="text-muted small fw-medium">
                  Quick digital upload
                </span>
              </div>
            </div>
            <button
              className="btn btn-warning w-100 fw-bold rounded-pill text-white d-flex align-items-center justify-content-center gap-2 shadow-sm"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={18} /> Upload Now
            </button>
          </div>
        </Col>
      </Row>

      {/* --- UPLOAD MODAL --- */}
      <Modal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        centered
        contentClassName="border-0 shadow-lg rounded-4"
      >
        <div className="modal-header bg-light border-bottom border-light-subtle p-4">
          <h5 className="modal-title fw-black text-dark d-flex align-items-center gap-2">
            <Upload className="text-warning" size={20} /> Upload Prescription
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowUploadModal(false)}
          ></button>
        </div>
        <Modal.Body className="p-4 bg-white">
          <Form onSubmit={handleUploadPrescription}>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">
                Prescription Image/PDF
              </Form.Label>
              <Form.Control
                type="file"
                className="border-light-subtle bg-light"
                onChange={handlePrescriptionChange}
                accept="image/*,application/pdf"
              />
              {prescriptionPreview && (
                <div className="mt-3 text-center bg-light p-2 rounded-3 border border-light-subtle">
                  <img
                    src={prescriptionPreview}
                    alt="Preview"
                    className="rounded-2 img-fluid shadow-sm"
                    style={{ maxHeight: "150px" }}
                  />
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">
                Additional Notes
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="border-light-subtle bg-light"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g. I need 2 strips of..."
                style={{ resize: "none" }}
              />
            </Form.Group>
            <button
              type="submit"
              className="btn btn-warning w-100 rounded-pill py-2 fw-bold text-white shadow-sm d-flex align-items-center justify-content-center gap-2"
              disabled={uploadLoading}
            >
              {uploadLoading ? (
                <>
                  <Loader2 size={18} className="spin-animation" /> Uploading...
                </>
              ) : (
                "Submit Prescription"
              )}
            </button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ✅ VIEW & REPLY MESSAGE MODAL */}
      <Modal
        show={selectedMessage !== null}
        onHide={() => setSelectedMessage(null)}
        centered
        contentClassName="border-0 shadow-lg rounded-4"
      >
        <div className="modal-header bg-primary text-white border-0 p-4 rounded-top-4">
          <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
            <MessageSquare size={20} /> Support Ticket
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setSelectedMessage(null)}
          ></button>
        </div>
        <Modal.Body className="p-4 bg-white">
          <div className="mb-4">
            <h6 className="fw-bold text-muted small text-uppercase tracking-wider mb-2">
              You initially wrote:
            </h6>
            <div className="bg-light p-3 rounded-4 border border-light-subtle text-dark fw-medium shadow-sm">
              "{selectedMessage?.text}"
            </div>
            <div className="text-end text-muted small mt-2 fw-medium">
              Sent:{" "}
              {selectedMessage
                ? new Date(selectedMessage.createdAt).toLocaleString()
                : ""}
            </div>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold text-primary small text-uppercase tracking-wider mb-2">
              Admin Response:
            </h6>
            {selectedMessage?.adminReply ? (
              <div className="bg-primary bg-opacity-10 border-start border-4 border-primary p-3 rounded-3 text-dark fw-bold shadow-sm">
                {selectedMessage.adminReply}
              </div>
            ) : (
              <div
                className="bg-light p-4 rounded-4 border border-light-subtle text-muted text-center"
                style={{ borderStyle: "dashed" }}
              >
                <Clock size={24} className="mb-2 opacity-50 text-primary" />
                <p className="small fw-medium mb-0">
                  Our team is reviewing your message. We usually reply within 24
                  hours.
                </p>
              </div>
            )}
          </div>

          {/* ✅ CUSTOMER REPLY BOX */}
          <div className="border-top border-light-subtle pt-4">
            <h6 className="fw-bold text-dark small text-uppercase tracking-wider mb-2">
              Send a Follow-up:
            </h6>
            <Form.Control
              as="textarea"
              rows={2}
              className="bg-light border-light-subtle mb-3"
              placeholder="Need more help? Type your reply here..."
              value={customerReplyText}
              onChange={(e) => setCustomerReplyText(e.target.value)}
              style={{ resize: "none" }}
            />
            <button
              className="btn btn-primary w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
              onClick={handleSendCustomerReply}
              disabled={replyLoading || !customerReplyText.trim()}
            >
              {replyLoading ? (
                <Loader2 size={16} className="spin-animation" />
              ) : (
                <Send size={16} />
              )}
              Send Reply
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <style>{`
        .transition-all { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;
