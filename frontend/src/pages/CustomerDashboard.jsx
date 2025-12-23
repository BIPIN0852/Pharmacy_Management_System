// import React, { useState, useEffect } from "react";
// import {
//   Bell,
//   ShoppingCart,
//   User,
//   Search,
//   Package,
//   HeartPulse,
//   MessageCircle,
//   CreditCard,
//   Wallet,
//   X,
//   Sun,
//   Moon,
//   Calendar,
//   Clock,
//   Stethoscope,
//   LogOut,
//   Menu,
//   Upload,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import PrescriptionUpload from "../components/PrescriptionUpload";

// const API_BASE_URL = "http://localhost:5000/api";

// const CustomerDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // layout / ui
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);
//   const [activeNav, setActiveNav] = useState("orders"); // new: to track active item
//   const [searchTerm, setSearchTerm] = useState("");

//   // modals
//   const [showWalletModal, setShowWalletModal] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);

//   // prescription upload
//   const [prescriptionFile, setPrescriptionFile] = useState(null);
//   const [prescriptionPreview, setPrescriptionPreview] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // payments
//   const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

//   // appointment form
//   const [apptName, setApptName] = useState(user?.name || "");
//   const [apptAge, setApptAge] = useState("");
//   const [apptPhone, setApptPhone] = useState("");
//   const [apptAddress, setApptAddress] = useState("");
//   const [apptProvince, setApptProvince] = useState("");
//   const [apptProblem, setApptProblem] = useState("");
//   const [apptMessage, setApptMessage] = useState("");

//   // data
//   const [orders, setOrders] = useState([]);
//   const [recommended, setRecommended] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const bgMain = darkMode ? "bg-dark text-light" : "bg-light text-dark";
//   const cardBg = darkMode ? "bg-secondary" : "bg-white";

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const [ordersRes, recRes, doctorsRes, apptsRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/customer/orders`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/medicines/recommended`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/doctors`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/customer/appointments`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       if (ordersRes.ok) setOrders(await ordersRes.json());
//       if (recRes.ok) setRecommended(await recRes.json());
//       if (doctorsRes.ok) setDoctors(await doctorsRes.json());
//       if (apptsRes.ok) setMyAppointments(await apptsRes.json());
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handlePrescriptionChange = (e) => {
//     const file = e.target.files?.[0];
//     setUploadMessage("");
//     setPrescriptionFile(file || null);
//     if (file) {
//       setPrescriptionPreview(URL.createObjectURL(file));
//     } else {
//       setPrescriptionPreview(null);
//     }
//   };

//   const handleUploadPrescription = async (e) => {
//     e.preventDefault();
//     setUploadMessage("");

//     if (!user?.name || !user?.email) {
//       setUploadMessage("User details missing. Please login again.");
//       return;
//     }
//     if (!prescriptionFile) {
//       setUploadMessage("Please select a prescription image first.");
//       return;
//     }

//     try {
//       setUploadLoading(true);
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("image", prescriptionFile);
//       formData.append("notes", notes);
//       formData.append("customerName", user.name);
//       formData.append("customerEmail", user.email);

//       const res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setUploadMessage(data.message || "Failed to upload prescription.");
//       } else {
//         setUploadMessage("Prescription uploaded successfully!");
//         setPrescriptionFile(null);
//         setPrescriptionPreview(null);
//         setNotes("");
//       }
//     } catch (err) {
//       setUploadMessage("Something went wrong while uploading prescription.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const reserveAppointment = async (doctor) => {
//     setApptMessage("");
//     if (
//       !apptName.trim() ||
//       !apptAge.trim() ||
//       !apptPhone.trim() ||
//       !apptAddress.trim() ||
//       !apptProvince.trim() ||
//       !apptProblem.trim()
//     ) {
//       setApptMessage("Please fill all appointment form fields.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const selectedSlot = doctor.slots?.[0];
//       if (!selectedSlot) {
//         setApptMessage("No available time slots for this doctor.");
//         return;
//       }

//       const appointmentDate = new Date(doctor.nextSlot);
//       appointmentDate.setHours(0, 0, 0, 0);

//       const payload = {
//         doctor: doctor._id || doctor.id,
//         date: appointmentDate.toISOString(),
//         timeSlot: selectedSlot,
//         notes: apptProblem.trim(),
//         customerDetails: {
//           name: apptName,
//           age: apptAge,
//           phone: apptPhone,
//           address: apptAddress,
//           province: apptProvince,
//         },
//       };

//       const res = await fetch(`${API_BASE_URL}/api/appointments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setApptMessage(data.message || "Failed to reserve appointment.");
//       } else {
//         setApptMessage("Appointment reserved successfully!");
//         setApptName(user?.name || "");
//         setApptAge("");
//         setApptPhone("");
//         setApptAddress("");
//         setApptProvince("");
//         setApptProblem("");
//         fetchDashboardData();
//       }
//     } catch (error) {
//       setApptMessage("Something went wrong reserving appointment.");
//     }
//   };

//   const handlePayNow = (order) => {
//     navigate(
//       `/payment?orderId=${order.id || order._id}&amount=${
//         order.price || order.total
//       }`
//     );
//   };

//   if (loading) {
//     return (
//       <div
//         className={`d-flex min-vh-100 justify-content-center align-items-center ${bgMain}`}
//       >
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   // sidebar nav config with paths
//   const navItems = [
//     {
//       key: "orders",
//       icon: ShoppingCart,
//       label: "My Orders",
//       path: "/customer-dashboard",
//     },
//     {
//       key: "medicines",
//       icon: Package,
//       label: "Medicines",
//       path: "/medicines",
//     },
//     {
//       key: "profile",
//       icon: User,
//       label: "Profile",
//       path: "/profile",
//     },
//     {
//       key: "support",
//       icon: MessageCircle,
//       label: "Support",
//       path: "/support", // create this route/page later
//     },
//   ];

//   return (
//     <div
//       className={`d-flex min-vh-100 flex-column ${bgMain}`}
//       style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//     >
//       {/* Mobile top bar */}
//       <header className="d-flex d-lg-none justify-content-between align-items-center bg-dark text-light px-3 py-2 sticky-top">
//         <button
//           className="btn btn-dark"
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           aria-label="Toggle Menu"
//         >
//           <Menu size={22} />
//         </button>
//         <span className="fs-5 fw-semibold">MyPharmacy</span>
//       </header>

//       {/* Sidebar */}
//       <aside
//         className={`sidebar position-fixed top-0 vh-100 p-3 d-flex flex-column ${cardBg} border-end`}
//         style={{
//           width: "240px",
//           transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
//           transition: "transform 0.25s ease-out",
//           zIndex: 1040,
//         }}
//       >
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h1
//             className="h4 text-primary cursor-pointer"
//             onClick={() => navigate("/customer-dashboard")}
//           >
//             MyPharmacy
//           </h1>
//           <button
//             className="btn btn-outline-secondary d-lg-none"
//             onClick={() => setSidebarOpen(false)}
//             aria-label="Close Menu"
//           >
//             <X />
//           </button>
//         </div>

//         <nav className="flex-grow-1">
//           <ul className="nav flex-column gap-2">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = activeNav === item.key;
//               return (
//                 <li key={item.key} className="nav-item">
//                   <button
//                     type="button"
//                     className={`btn btn-toggle align-items-center rounded w-100 text-start ${
//                       isActive ? "bg-primary bg-opacity-10" : ""
//                     }`}
//                     style={{ color: darkMode ? "#eee" : "#111" }}
//                     onClick={() => {
//                       setActiveNav(item.key);
//                       navigate(item.path);
//                     }}
//                   >
//                     <Icon size={20} />
//                     <span className="ms-2">{item.label}</span>
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         <div className="mt-auto d-flex flex-column gap-2">
//           <button
//             className="btn btn-outline-primary d-flex align-items-center gap-2"
//             onClick={() => setDarkMode(!darkMode)}
//           >
//             {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//             <span>{darkMode ? "Light" : "Dark"} Mode</span>
//           </button>
//           <button
//             className={`btn d-flex align-items-center gap-2 ${
//               darkMode ? "btn-success" : "btn-outline-success"
//             }`}
//             onClick={() => setShowWalletModal(true)}
//           >
//             <Wallet size={20} />
//             <span>Wallet</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main
//         className="flex-grow-1 p-3"
//         style={{
//           marginLeft: sidebarOpen ? "240px" : 0,
//           transition: "margin-left 0.25s ease-out",
//         }}
//       >
//         {/* Top bar */}
//         <div className="d-flex justify-content-between flex-wrap align-items-center mb-3 gap-3">
//           <div className="input-group" style={{ maxWidth: 360 }}>
//             <span className="input-group-text bg-white border-end-0">
//               <Search size={18} />
//             </span>
//             <input
//               type="search"
//               className={`form-control ${
//                 darkMode ? "bg-secondary text-light border-secondary" : ""
//               }`}
//               placeholder="Search medicines..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               aria-label="Search medicines"
//             />
//           </div>
//           <div className="d-flex align-items-center gap-3">
//             <Bell
//               size={20}
//               className={`cursor-pointer ${
//                 darkMode ? "text-light" : "text-dark"
//               }`}
//             />
//             <img
//               src="https://i.pravatar.cc/40"
//               alt="User avatar"
//               className="rounded-circle border border-primary"
//               style={{ width: 36, height: 36, cursor: "pointer" }}
//             />
//             <button
//               className="btn btn-danger d-flex align-items-center gap-1"
//               onClick={handleLogout}
//               aria-label="Logout"
//             >
//               <LogOut size={16} />
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* Stat cards */}
//         <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
//           {[
//             {
//               title: "Wallet Balance",
//               value: "₹2,540",
//               icon: <CreditCard size={28} color="#22c55e" />,
//             },
//             {
//               title: "Active Orders",
//               value: orders.filter((o) => o.paymentStatus !== "Paid").length,
//               icon: <ShoppingCart size={28} color="#3b82f6" />,
//             },
//             {
//               title: "Loyalty Points",
//               value: 125,
//               icon: <HeartPulse size={28} color="#ec4899" />,
//             },
//             {
//               title: "Expiring Medicines",
//               value: 3,
//               icon: <Package size={28} color="#eab308" />,
//             },
//           ].map((card) => (
//             <div key={card.title} className="col">
//               <div
//                 className={`${cardBg} rounded-3 p-3 d-flex justify-content-between align-items-center shadow-sm`}
//                 style={{ minHeight: "100px" }}
//               >
//                 <div>
//                   <p className="mb-1 text-muted small">{card.title}</p>
//                   <h3 className="mb-0 fw-semibold">{card.value}</h3>
//                 </div>
//                 {card.icon}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Prescription upload */}
//         <section className={`${cardBg} rounded-3 p-4 mb-4 shadow-sm`}>
//           <h2 className="mb-3">Upload Doctor&apos;s Prescription</h2>
//           <div
//             className="border border-primary border-dashed rounded-3 d-flex flex-column align-items-center justify-content-center p-4"
//             role="button"
//             tabIndex={0}
//             onClick={() =>
//               document.getElementById("prescription-file")?.click()
//             }
//             onKeyPress={(e) =>
//               e.key === "Enter" &&
//               document.getElementById("prescription-file")?.click()
//             }
//           >
//             <Upload size={40} color="#3b82f6" />
//             <p className="mt-2 text-secondary">
//               Click to select a prescription image (JPG, PNG)
//             </p>
//             <input
//               id="prescription-file"
//               type="file"
//               accept="image/*"
//               className="d-none"
//               onChange={handlePrescriptionChange}
//             />
//             {prescriptionPreview && (
//               <img
//                 src={prescriptionPreview}
//                 alt="Prescription preview"
//                 className="mt-3 rounded-3 shadow"
//                 style={{
//                   maxWidth: "160px",
//                   maxHeight: "160px",
//                   objectFit: "cover",
//                 }}
//               />
//             )}
//           </div>
//           <form
//             onSubmit={handleUploadPrescription}
//             className="mt-3 d-flex flex-column gap-2"
//           >
//             <textarea
//               className="form-control"
//               placeholder="Notes for pharmacist (optional)"
//               rows={4}
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//             />
//             <button
//               type="submit"
//               className="btn btn-primary rounded-pill"
//               disabled={uploadLoading}
//             >
//               {uploadLoading ? "Uploading..." : "Upload Prescription"}
//             </button>
//           </form>
//           {uploadMessage && (
//             <div
//               className={`mt-2 small ${
//                 uploadMessage.includes("success")
//                   ? "text-success"
//                   : "text-danger"
//               }`}
//             >
//               {uploadMessage}
//             </div>
//           )}
//         </section>

//         {/* Orders */}
//         <section className={`${cardBg} rounded-3 p-4 mb-4 shadow-sm`}>
//           <h2 className="mb-3">My Orders</h2>
//           <div className="table-responsive">
//             <table className="table table-striped align-middle mb-0">
//               <thead>
//                 <tr>
//                   <th>Order ID</th>
//                   <th>Medicine</th>
//                   <th>Price</th>
//                   <th>Status</th>
//                   <th>Progress</th>
//                   <th>Date</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((o) => (
//                   <tr key={o._id || o.id}>
//                     <td>{o.id || o._id}</td>
//                     <td>{o.medicine || o.medicines?.join(", ")}</td>
//                     <td>₹{o.price || o.total}</td>
//                     <td>
//                       <span
//                         className={`badge ${
//                           o.status === "Delivered"
//                             ? "bg-success text-success"
//                             : o.status === "Shipped"
//                             ? "bg-primary text-primary"
//                             : "bg-warning text-warning"
//                         } rounded-pill px-3 py-1`}
//                       >
//                         {o.status}
//                       </span>
//                     </td>
//                     <td>
//                       <div
//                         className="progress"
//                         style={{ height: "6px", borderRadius: "999px" }}
//                       >
//                         <div
//                           className={`progress-bar ${
//                             (o.progress || 0) === 100
//                               ? "bg-success"
//                               : (o.progress || 0) > 60
//                               ? "bg-primary"
//                               : "bg-warning"
//                           }`}
//                           role="progressbar"
//                           style={{ width: `${o.progress || 40}%` }}
//                           aria-valuenow={o.progress || 40}
//                           aria-valuemin="0"
//                           aria-valuemax="100"
//                         ></div>
//                       </div>
//                     </td>
//                     <td>
//                       {o.date ? new Date(o.date).toLocaleDateString() : "N/A"}
//                     </td>
//                     <td>
//                       {o.paymentStatus !== "Paid" && (
//                         <button
//                           className="btn btn-primary btn-sm"
//                           onClick={() => handlePayNow(o)}
//                         >
//                           Pay Now
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         {/* Doctor Appointments preview */}
//         <section className="row g-4">
//           <div className={`col-12 ${cardBg} rounded-3 p-4 shadow-sm`}>
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="mb-0 d-flex align-items-center gap-2">
//                 <Stethoscope size={20} />
//                 Doctor Appointments
//               </h2>
//               <button
//                 className="btn btn-primary btn-lg rounded-pill px-4"
//                 onClick={() => navigate("/customer-appointments")}
//               >
//                 Book Now <Calendar className="ms-1" size={16} />
//               </button>
//             </div>

//             <div className="row g-4">
//               {/* Quick Doctor Preview */}
//               <div className="col-md-6">
//                 <div className="text-center p-4 border rounded-3 h-100 d-flex flex-column justify-content-center">
//                   <div
//                     className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
//                     style={{ width: 80, height: 80 }}
//                   >
//                     <Stethoscope size={32} />
//                   </div>
//                   <h4 className="mb-2">Available Doctors</h4>
//                   <p className="text-muted mb-3">
//                     Browse specialists and book appointments online
//                   </p>
//                   <div className="d-flex flex-column gap-2 small">
//                     {doctors.slice(0, 3).map((d) => (
//                       <div
//                         key={d._id || d.id}
//                         className="d-flex align-items-center gap-2 p-2 bg-light rounded"
//                       >
//                         <div className="fw-bold text-truncate flex-grow-1">
//                           {d.name}
//                         </div>
//                         <span className="badge bg-success">{d.speciality}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* My Appointments Preview */}
//               <div className="col-md-6">
//                 <div className="text-center p-4 border rounded-3 h-100 d-flex flex-column justify-content-center position-relative">
//                   <div
//                     className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
//                     style={{ width: 80, height: 80 }}
//                   >
//                     <Calendar size={32} />
//                   </div>
//                   <h4 className="mb-2">My Appointments</h4>
//                   <p className="text-muted mb-3">
//                     {myAppointments.length > 0
//                       ? `${myAppointments.length} appointment${
//                           myAppointments.length !== 1 ? "s" : ""
//                         }`
//                       : "No upcoming appointments"}
//                   </p>
//                   {myAppointments.slice(0, 2).map((appt) => (
//                     <div
//                       key={appt._id}
//                       className="small text-start mb-2 p-2 bg-light rounded"
//                     >
//                       <div className="fw-medium">
//                         {new Date(appt.date).toLocaleDateString()}
//                       </div>
//                       <div className="text-muted">
//                         {appt.doctor?.name} - {appt.timeSlot}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="text-center mt-4 pt-3 border-top">
//               <small className="text-muted me-2">Need help?</small>
//               <button
//                 className="btn btn-link p-0 text-primary fw-medium"
//                 onClick={() => navigate("/customer-appointments")}
//               >
//                 View all appointments →
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* Recommended Medicines */}
//         <section className={`${cardBg} rounded-3 p-4 mt-4 shadow-sm`}>
//           <h2 className="mb-4">Recommended Medicines</h2>
//           <div className="row row-cols-2 row-cols-md-4 g-3">
//             {recommended.map((med) => (
//               <div
//                 key={med._id || med.id}
//                 className="col text-center p-3 border rounded cursor-pointer"
//                 onClick={() => setShowPaymentModal(true)}
//               >
//                 <img
//                   src={
//                     med.image ||
//                     "https://cdn-icons-png.flaticon.com/512/3050/3050525.png"
//                   }
//                   alt={med.name}
//                   className="img-fluid mb-2"
//                   style={{ maxHeight: "70px", objectFit: "contain" }}
//                 />
//                 <h5 className="fs-6">{med.name}</h5>
//                 <p className="mb-0 text-primary">₹{med.price}</p>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>
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
//   CreditCard,
//   Wallet,
//   X,
//   Sun,
//   Moon,
//   Calendar,
//   Clock,
//   Stethoscope,
//   LogOut,
//   Menu,
//   Upload,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const API_BASE_URL = "http://localhost:5000/api";

// const CustomerDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // layout / ui
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [activeNav, setActiveNav] = useState("orders");
//   const [searchTerm, setSearchTerm] = useState("");

//   // modals
//   const [showWalletModal, setShowWalletModal] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);

//   // prescription upload
//   const [prescriptionFile, setPrescriptionFile] = useState(null);
//   const [prescriptionPreview, setPrescriptionPreview] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // payments
//   const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

//   // appointment form
//   const [apptName, setApptName] = useState(user?.name || "");
//   const [apptAge, setApptAge] = useState("");
//   const [apptPhone, setApptPhone] = useState("");
//   const [apptAddress, setApptAddress] = useState("");
//   const [apptProvince, setApptProvince] = useState("");
//   const [apptProblem, setApptProblem] = useState("");
//   const [apptMessage, setApptMessage] = useState("");

//   // Profile states
//   const [profile, setProfile] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(true);
//   const [profileUpdating, setProfileUpdating] = useState(false);
//   const [editingProfile, setEditingProfile] = useState({
//     phone: "",
//     street: "",
//     city: "",
//     province: "",
//     postalCode: "",
//   });

//   // data
//   const [orders, setOrders] = useState([]);
//   const [recommended, setRecommended] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const bgMain = darkMode ? "bg-dark text-light" : "bg-light text-dark";
//   const cardBg = darkMode ? "bg-secondary" : "bg-white";

//   useEffect(() => {
//     fetchDashboardData();
//     fetchProfile();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const [ordersRes, recRes, doctorsRes, apptsRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/customer/orders`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/medicines/recommended`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/doctors`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/customer/appointments`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       if (ordersRes.ok) setOrders(await ordersRes.json());
//       if (recRes.ok) setRecommended(await recRes.json());
//       if (doctorsRes.ok) setDoctors(await doctorsRes.json());
//       if (apptsRes.ok) setMyAppointments(await apptsRes.json());
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProfile = async () => {
//     try {
//       setProfileLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/customer/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setProfile(data);
//         setEditingProfile({
//           phone: data.phone || "",
//           street: data.address?.street || "",
//           city: data.address?.city || "",
//           province: data.address?.province || "",
//           postalCode: data.address?.postalCode || "",
//         });
//       }
//     } catch (err) {
//       console.error("Profile fetch error:", err);
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     setProfileUpdating(true);

//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       Object.entries(editingProfile).forEach(([key, value]) => {
//         formData.append(key, value);
//       });

//       const res = await fetch(`${API_BASE_URL}/customer/profile`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (res.ok) {
//         const updatedProfile = await res.json();
//         setProfile(updatedProfile);
//         setShowProfileModal(false);
//         fetchProfile();
//       } else {
//         const error = await res.json();
//         alert(error.message || "Update failed");
//       }
//     } catch (err) {
//       alert("Something went wrong");
//     } finally {
//       setProfileUpdating(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handlePrescriptionChange = (e) => {
//     const file = e.target.files?.[0];
//     setUploadMessage("");
//     setPrescriptionFile(file || null);
//     if (file) {
//       setPrescriptionPreview(URL.createObjectURL(file));
//     } else {
//       setPrescriptionPreview(null);
//     }
//   };

//   const handleUploadPrescription = async (e) => {
//     e.preventDefault();
//     setUploadMessage("");

//     if (!user?.name || !user?.email) {
//       setUploadMessage("User details missing. Please login again.");
//       return;
//     }
//     if (!prescriptionFile) {
//       setUploadMessage("Please select a prescription image first.");
//       return;
//     }

//     try {
//       setUploadLoading(true);
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("image", prescriptionFile);
//       formData.append("notes", notes);
//       formData.append("customerName", user.name);
//       formData.append("customerEmail", user.email);

//       const res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setUploadMessage(data.message || "Failed to upload prescription.");
//       } else {
//         setUploadMessage("Prescription uploaded successfully!");
//         setPrescriptionFile(null);
//         setPrescriptionPreview(null);
//         setNotes("");
//       }
//     } catch (err) {
//       setUploadMessage("Something went wrong while uploading prescription.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const reserveAppointment = async (doctor) => {
//     setApptMessage("");
//     if (
//       !apptName.trim() ||
//       !apptAge.trim() ||
//       !apptPhone.trim() ||
//       !apptAddress.trim() ||
//       !apptProvince.trim() ||
//       !apptProblem.trim()
//     ) {
//       setApptMessage("Please fill all appointment form fields.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const selectedSlot = doctor.slots?.[0];
//       if (!selectedSlot) {
//         setApptMessage("No available time slots for this doctor.");
//         return;
//       }

//       const appointmentDate = new Date(doctor.nextSlot);
//       appointmentDate.setHours(0, 0, 0, 0);

//       const payload = {
//         doctor: doctor._id || doctor.id,
//         date: appointmentDate.toISOString(),
//         timeSlot: selectedSlot,
//         notes: apptProblem.trim(),
//         customerDetails: {
//           name: apptName,
//           age: apptAge,
//           phone: apptPhone,
//           address: apptAddress,
//           province: apptProvince,
//         },
//       };

//       const res = await fetch(`${API_BASE_URL}/api/appointments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setApptMessage(data.message || "Failed to reserve appointment.");
//       } else {
//         setApptMessage("Appointment reserved successfully!");
//         setApptName(user?.name || "");
//         setApptAge("");
//         setApptPhone("");
//         setApptAddress("");
//         setApptProvince("");
//         setApptProblem("");
//         fetchDashboardData();
//       }
//     } catch (error) {
//       setApptMessage("Something went wrong reserving appointment.");
//     }
//   };

//   const handlePayNow = (order) => {
//     navigate(
//       `/payment?orderId=${order.id || order._id}&amount=${
//         order.price || order.total
//       }`
//     );
//   };

//   if (loading) {
//     return (
//       <div
//         className={`d-flex min-vh-100 justify-content-center align-items-center ${bgMain}`}
//       >
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   // Sidebar nav config
//   const navItems = [
//     {
//       key: "orders",
//       icon: ShoppingCart,
//       label: "My Orders",
//       path: "/customer-dashboard",
//     },
//     { key: "medicines", icon: Package, label: "Medicines", path: "/medicines" },
//     { key: "profile", icon: User, label: "Profile", path: "/profile" },
//     { key: "support", icon: MessageCircle, label: "Support", path: "/support" },
//   ];

//   return (
//     <>
//       {/* Sidebar overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
//           style={{ zIndex: 1040 }}
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <div
//         className={`d-flex min-vh-100 flex-column ${bgMain}`}
//         style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//       >
//         {/* Top bar */}
//         <header className="d-flex justify-content-between align-items-center bg-white border-bottom shadow-sm px-3 py-2 sticky-top z-index-1050">
//           <div className="d-flex align-items-center gap-2">
//             {/* Hamburger Menu for mobile */}
//             <button
//               className="btn btn-link p-0 d-lg-none text-dark"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               style={{ width: 40, height: 40 }}
//             >
//               <Menu size={24} />
//             </button>
//             <h1 className="h5 mb-0 fw-bold text-primary d-none d-md-inline">
//               MyPharmacy
//             </h1>
//             <span className="h6 mb-0 fw-semibold d-md-none">MyPharmacy</span>
//           </div>

//           <div className="d-flex align-items-center gap-2">
//             <Bell size={20} className="text-muted cursor-pointer" />
//             <img
//               src={
//                 profile?.profilePhoto ||
//                 user?.profilePhoto ||
//                 "https://i.pravatar.cc/40"
//               }
//               alt="User avatar"
//               className="rounded-circle border border-primary"
//               style={{ width: 36, height: 36, cursor: "pointer" }}
//               onClick={() => setShowProfileModal(true)}
//             />
//             <button
//               className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-2"
//               onClick={handleLogout}
//             >
//               <LogOut size={16} />
//               <span className="d-none d-md-inline">Logout</span>
//             </button>
//           </div>
//         </header>

//         {/* Sidebar */}
//         <aside
//           className={`position-lg-fixed top-0 start-0 h-100 p-3 d-flex flex-column border-end shadow-sm transition-all ${cardBg}`}
//           style={{
//             width: sidebarOpen ? "280px" : "0px",
//             minWidth: sidebarOpen ? "280px" : "0px",
//             maxWidth: "280px",
//             zIndex: 1045,
//             transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//             transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
//           }}
//         >
//           <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
//             <h2 className="h4 mb-0 fw-bold text-primary">MyPharmacy</h2>
//             <button
//               className="btn btn-sm btn-outline-secondary d-lg-none"
//               onClick={() => setSidebarOpen(false)}
//             >
//               <X size={20} />
//             </button>
//           </div>

//           <nav className="flex-grow-1">
//             <ul className="nav flex-column gap-2">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = activeNav === item.key;
//                 return (
//                   <li key={item.key} className="nav-item">
//                     <button
//                       type="button"
//                       className={`btn w-100 text-start rounded-2 p-3 transition-all ${
//                         isActive
//                           ? "bg-primary text-white shadow-sm"
//                           : "text-muted hover:bg-light hover:text-dark"
//                       }`}
//                       onClick={() => {
//                         setActiveNav(item.key);
//                         setSidebarOpen(false);
//                         navigate(item.path);
//                       }}
//                     >
//                       <div className="d-flex align-items-center gap-3">
//                         <Icon size={20} />
//                         <span>{item.label}</span>
//                       </div>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           <div className="mt-auto pt-3 border-top">
//             <button
//               className="btn btn-outline-primary w-100 d-flex align-items-center gap-2 mb-2 p-2 rounded-2"
//               onClick={() => setDarkMode(!darkMode)}
//             >
//               {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//               {darkMode ? "Light" : "Dark"} Mode
//             </button>
//             <button
//               className={`btn w-100 d-flex align-items-center gap-2 p-2 rounded-2 ${
//                 darkMode ? "btn-success" : "btn-outline-success"
//               }`}
//               onClick={() => setShowWalletModal(true)}
//             >
//               <Wallet size={20} />
//               Wallet
//             </button>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main
//           className={`flex-grow-1 p-3 p-lg-4 transition-all ${bgMain}`}
//           style={{
//             marginLeft:
//               sidebarOpen && window.innerWidth >= 992 ? "280px" : "0px",
//           }}
//         >
//           {/* Search Bar */}
//           <div className="input-group mb-4" style={{ maxWidth: 500 }}>
//             <span className="input-group-text bg-white border-end-0 shadow-sm">
//               <Search size={18} />
//             </span>
//             <input
//               type="search"
//               className={`form-control border-start-0 shadow-sm ${
//                 darkMode ? "bg-secondary text-light" : "bg-white"
//               }`}
//               placeholder="Search medicines, orders..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           {/* Profile Overview Card */}
//           <section className={`${cardBg} rounded-3 p-4 mb-4 shadow-sm border`}>
//             <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
//               <div className="d-flex align-items-center gap-2">
//                 <User size={22} className="text-primary" />
//                 <h2 className="h5 mb-0 fw-semibold">Profile Overview</h2>
//               </div>
//               <button
//                 className="btn btn-outline-primary btn-sm rounded-pill px-3"
//                 onClick={() => setShowProfileModal(true)}
//               >
//                 Edit Profile
//               </button>
//             </div>

//             {profileLoading ? (
//               <div className="text-center py-4">
//                 <div className="spinner-border spinner-border-sm text-primary" />
//                 <p className="mt-2 text-muted small">Loading profile...</p>
//               </div>
//             ) : (
//               <div className="row g-3 align-items-center">
//                 <div className="col-md-2 col-3 text-center">
//                   <img
//                     src={
//                       profile?.profilePhoto || "https://i.pravatar.cc/80?img=1"
//                     }
//                     alt="Profile"
//                     className="rounded-circle border border-3 border-primary shadow-sm img-fluid"
//                     style={{ width: 72, height: 72, objectFit: "cover" }}
//                   />
//                   <div className="mt-2">
//                     <span
//                       className={`badge fs-2xs fw-semibold px-2 py-1 rounded-pill ${
//                         profile?.accountStatus === "verified"
//                           ? "bg-success text-white"
//                           : "bg-warning text-dark"
//                       }`}
//                     >
//                       {profile?.accountStatus || "pending"}
//                       {profile?.accountStatus === "verified" && " ✅"}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="col-md-10 col-9">
//                   <div className="row g-3">
//                     <div className="col-md-3 col-sm-6">
//                       <label className="small text-muted mb-1 d-block">
//                         Name
//                       </label>
//                       <p className="mb-0 fw-semibold">
//                         {profile?.name || user?.name}
//                       </p>
//                     </div>
//                     <div className="col-md-3 col-sm-6">
//                       <label className="small text-muted mb-1 d-block">
//                         Email
//                       </label>
//                       <p className="mb-0 text-truncate">{profile?.email}</p>
//                     </div>
//                     <div className="col-md-3 col-sm-6">
//                       <label className="small text-muted mb-1 d-block">
//                         Phone
//                       </label>
//                       <p className="mb-0">{profile?.phone || "Not set"}</p>
//                     </div>
//                     <div className="col-md-3 col-sm-6">
//                       <label className="small text-muted mb-1 d-block">
//                         Location
//                       </label>
//                       <p className="mb-0 small">
//                         {profile?.address?.city || "N/A"}
//                         {profile?.address?.province && (
//                           <>
//                             <br />
//                             <small className="text-muted">
//                               {profile.address.province}
//                             </small>
//                           </>
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </section>

//           {/* Existing sections like Stat cards, Prescription upload, Orders, Doctor Appointments, Recommended Medicines ... */}

//           {/* Profile Edit Modal */}
//           {showProfileModal && (
//             <div
//               className="modal fade show d-block position-fixed top-0 start-0 w-100 h-100 p-3"
//               style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
//             >
//               <div className="modal-dialog modal-lg modal-dialog-centered">
//                 <div className={`${cardBg} modal-content border-0 shadow-lg`}>
//                   <div className="modal-header border-0 pb-0">
//                     <h5 className="modal-title fw-bold">Edit Profile</h5>
//                     <button
//                       className="btn btn-sm btn-outline-secondary"
//                       onClick={() => setShowProfileModal(false)}
//                     >
//                       <X size={18} />
//                     </button>
//                   </div>
//                   <form
//                     onSubmit={handleUpdateProfile}
//                     className="modal-body p-4"
//                   >
//                     <div className="row g-3">
//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold">
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           className="form-control"
//                           value={editingProfile.phone}
//                           onChange={(e) =>
//                             setEditingProfile({
//                               ...editingProfile,
//                               phone: e.target.value,
//                             })
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold">
//                           Street Address
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={editingProfile.street}
//                           onChange={(e) =>
//                             setEditingProfile({
//                               ...editingProfile,
//                               street: e.target.value,
//                             })
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label fw-semibold">City</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={editingProfile.city}
//                           onChange={(e) =>
//                             setEditingProfile({
//                               ...editingProfile,
//                               city: e.target.value,
//                             })
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label fw-semibold">
//                           Province
//                         </label>
//                         <select
//                           className="form-select"
//                           value={editingProfile.province}
//                           onChange={(e) =>
//                             setEditingProfile({
//                               ...editingProfile,
//                               province: e.target.value,
//                             })
//                           }
//                           required
//                         >
//                           <option value="">Select Province</option>
//                           <option value="Bagmati">Bagmati</option>
//                           <option value="Gandaki">Gandaki</option>
//                           <option value="Lumbini">Lumbini</option>
//                           <option value="Koshi">Koshi</option>
//                           <option value="Madhesh">Madhesh</option>
//                         </select>
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label fw-semibold">
//                           Postal Code
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={editingProfile.postalCode}
//                           onChange={(e) =>
//                             setEditingProfile({
//                               ...editingProfile,
//                               postalCode: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                     </div>
//                     <div className="d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
//                       <button
//                         type="button"
//                         className="btn btn-outline-secondary px-4"
//                         onClick={() => setShowProfileModal(false)}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className="btn btn-primary px-4"
//                         disabled={profileUpdating}
//                       >
//                         {profileUpdating ? (
//                           <>
//                             <span className="spinner-border spinner-border-sm me-2" />
//                             Saving...
//                           </>
//                         ) : (
//                           "Save Changes"
//                         )}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
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
//   CreditCard,
//   Wallet,
//   X,
//   Sun,
//   Moon,
//   Calendar,
//   Clock,
//   Stethoscope,
//   LogOut,
//   Menu,
//   Upload,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const API_BASE_URL = "http://localhost:5000/api";

// const CustomerDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // layout / ui
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [activeNav, setActiveNav] = useState("orders");
//   const [searchTerm, setSearchTerm] = useState("");

//   // modals
//   const [showWalletModal, setShowWalletModal] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);

//   // prescription upload
//   const [prescriptionFile, setPrescriptionFile] = useState(null);
//   const [prescriptionPreview, setPrescriptionPreview] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // payments
//   const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

//   // appointment form
//   const [apptName, setApptName] = useState(user?.name || "");
//   const [apptAge, setApptAge] = useState("");
//   const [apptPhone, setApptPhone] = useState("");
//   const [apptAddress, setApptAddress] = useState("");
//   const [apptProvince, setApptProvince] = useState("");
//   const [apptProblem, setApptProblem] = useState("");
//   const [apptMessage, setApptMessage] = useState("");

//   // Profile states
//   const [profile, setProfile] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(true);
//   const [profileUpdating, setProfileUpdating] = useState(false);
//   const [editingProfile, setEditingProfile] = useState({
//     phone: "",
//     street: "",
//     city: "",
//     province: "",
//     postalCode: "",
//   });

//   // data
//   const [orders, setOrders] = useState([]);
//   const [recommended, setRecommended] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const bgMain = darkMode ? "bg-dark text-light" : "bg-light text-dark";
//   const cardBg = darkMode ? "bg-secondary" : "bg-white";

//   useEffect(() => {
//     fetchDashboardData();
//     fetchProfile();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const [ordersRes, recRes, doctorsRes, apptsRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/customer/orders`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/medicines/recommended`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/doctors`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/customer/appointments`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       if (ordersRes.ok) setOrders(await ordersRes.json());
//       if (recRes.ok) setRecommended(await recRes.json());
//       if (doctorsRes.ok) setDoctors(await doctorsRes.json());
//       if (apptsRes.ok) setMyAppointments(await apptsRes.json());
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProfile = async () => {
//     try {
//       setProfileLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/customer/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setProfile(data);
//         setEditingProfile({
//           phone: data.phone || "",
//           street: data.address?.street || "",
//           city: data.address?.city || "",
//           province: data.address?.province || "",
//           postalCode: data.address?.postalCode || "",
//         });
//       }
//     } catch (err) {
//       console.error("Profile fetch error:", err);
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     setProfileUpdating(true);

//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       Object.entries(editingProfile).forEach(([key, value]) => {
//         formData.append(key, value);
//       });

//       const res = await fetch(`${API_BASE_URL}/customer/profile`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (res.ok) {
//         const updatedProfile = await res.json();
//         setProfile(updatedProfile);
//         setShowProfileModal(false);
//         fetchProfile();
//       } else {
//         const error = await res.json();
//         alert(error.message || "Update failed");
//       }
//     } catch (err) {
//       alert("Something went wrong");
//     } finally {
//       setProfileUpdating(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handlePrescriptionChange = (e) => {
//     const file = e.target.files?.[0];
//     setUploadMessage("");
//     setPrescriptionFile(file || null);
//     if (file) {
//       setPrescriptionPreview(URL.createObjectURL(file));
//     } else {
//       setPrescriptionPreview(null);
//     }
//   };

//   const handleUploadPrescription = async (e) => {
//     e.preventDefault();
//     setUploadMessage("");

//     if (!user?.name || !user?.email) {
//       setUploadMessage("User details missing. Please login again.");
//       return;
//     }
//     if (!prescriptionFile) {
//       setUploadMessage("Please select a prescription image first.");
//       return;
//     }

//     try {
//       setUploadLoading(true);
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("image", prescriptionFile);
//       formData.append("notes", notes);
//       formData.append("customerName", user.name);
//       formData.append("customerEmail", user.email);

//       const res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setUploadMessage(data.message || "Failed to upload prescription.");
//       } else {
//         setUploadMessage("Prescription uploaded successfully!");
//         setPrescriptionFile(null);
//         setPrescriptionPreview(null);
//         setNotes("");
//       }
//     } catch (err) {
//       setUploadMessage("Something went wrong while uploading prescription.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const reserveAppointment = async (doctor) => {
//     setApptMessage("");
//     if (
//       !apptName.trim() ||
//       !apptAge.trim() ||
//       !apptPhone.trim() ||
//       !apptAddress.trim() ||
//       !apptProvince.trim() ||
//       !apptProblem.trim()
//     ) {
//       setApptMessage("Please fill all appointment form fields.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const selectedSlot = doctor.slots?.[0];
//       if (!selectedSlot) {
//         setApptMessage("No available time slots for this doctor.");
//         return;
//       }

//       const appointmentDate = new Date(doctor.nextSlot);
//       appointmentDate.setHours(0, 0, 0, 0);

//       const payload = {
//         doctor: doctor._id || doctor.id,
//         date: appointmentDate.toISOString(),
//         timeSlot: selectedSlot,
//         notes: apptProblem.trim(),
//         customerDetails: {
//           name: apptName,
//           age: apptAge,
//           phone: apptPhone,
//           address: apptAddress,
//           province: apptProvince,
//         },
//       };

//       const res = await fetch(`${API_BASE_URL}/api/appointments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setApptMessage(data.message || "Failed to reserve appointment.");
//       } else {
//         setApptMessage("Appointment reserved successfully!");
//         setApptName(user?.name || "");
//         setApptAge("");
//         setApptPhone("");
//         setApptAddress("");
//         setApptProvince("");
//         setApptProblem("");
//         fetchDashboardData();
//       }
//     } catch (error) {
//       setApptMessage("Something went wrong reserving appointment.");
//     }
//   };

//   const handlePayNow = (order) => {
//     navigate(
//       `/payment?orderId=${order.id || order._id}&amount=${
//         order.price || order.total
//       }`
//     );
//   };

//   const navItems = [
//     {
//       key: "orders",
//       icon: ShoppingCart,
//       label: "My Orders",
//       path: "/customer-dashboard",
//     },
//     { key: "medicines", icon: Package, label: "Medicines", path: "/medicines" },
//     { key: "profile", icon: User, label: "Profile", path: "/profile" },
//     { key: "support", icon: MessageCircle, label: "Support", path: "/support" },
//   ];

//   if (loading) {
//     return (
//       <div
//         className={`d-flex min-vh-100 justify-content-center align-items-center ${bgMain}`}
//       >
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {sidebarOpen && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
//           style={{ zIndex: 1040 }}
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <div
//         className={`d-flex min-vh-100 flex-column ${bgMain}`}
//         style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//       >
//         {/* Top bar */}
//         <header className="d-flex justify-content-between align-items-center bg-white border-bottom shadow-sm px-3 py-2 sticky-top z-index-1050">
//           <div className="d-flex align-items-center gap-2">
//             <button
//               className="btn btn-link p-0 d-lg-none text-dark"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               style={{ width: 40, height: 40 }}
//               aria-label="Toggle sidebar"
//             >
//               <Menu size={24} />
//             </button>
//             <h1 className="h5 mb-0 fw-bold text-primary d-none d-md-inline">
//               MyPharmacy
//             </h1>
//             <span className="h6 mb-0 fw-semibold d-md-none">MyPharmacy</span>
//           </div>

//           <div className="d-flex align-items-center gap-2">
//             <Bell size={20} className="text-muted cursor-pointer" />
//             <img
//               src={
//                 profile?.profilePhoto ||
//                 user?.profilePhoto ||
//                 "https://i.pravatar.cc/40"
//               }
//               alt="User avatar"
//               className="rounded-circle border border-primary"
//               style={{ width: 36, height: 36, cursor: "pointer" }}
//               onClick={() => setShowProfileModal(true)}
//             />
//             <button
//               className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-2"
//               onClick={handleLogout}
//               aria-label="Logout"
//             >
//               <LogOut size={16} />
//               <span className="d-none d-md-inline">Logout</span>
//             </button>
//           </div>
//         </header>

//         {/* Sidebar */}
//         <aside
//           className={`position-lg-fixed top-0 start-0 h-100 p-3 d-flex flex-column border-end shadow-sm transition-all ${cardBg}`}
//           style={{
//             width: sidebarOpen ? "280px" : "0px",
//             minWidth: sidebarOpen ? "280px" : "0px",
//             maxWidth: "280px",
//             zIndex: 1045,
//             transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//             transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
//           }}
//           aria-label="Sidebar navigation"
//         >
//           <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
//             <h2 className="h4 mb-0 fw-bold text-primary">MyPharmacy</h2>
//             <button
//               className="btn btn-sm btn-outline-secondary d-lg-none"
//               onClick={() => setSidebarOpen(false)}
//               aria-label="Close sidebar"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           <nav className="flex-grow-1">
//             <ul className="nav flex-column gap-2">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = activeNav === item.key;
//                 return (
//                   <li key={item.key} className="nav-item">
//                     <button
//                       type="button"
//                       className={`btn w-100 text-start rounded-2 p-3 transition-all ${
//                         isActive
//                           ? "bg-primary text-white shadow-sm"
//                           : "text-muted hover:bg-light hover:text-dark"
//                       }`}
//                       onClick={() => {
//                         setActiveNav(item.key);
//                         setSidebarOpen(false);
//                         navigate(item.path);
//                       }}
//                       aria-current={isActive ? "page" : undefined}
//                     >
//                       <div className="d-flex align-items-center gap-3">
//                         <Icon size={20} />
//                         <span>{item.label}</span>
//                       </div>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           <div className="mt-auto pt-3 border-top">
//             <button
//               className="btn btn-outline-primary w-100 d-flex align-items-center gap-2 mb-2 p-2 rounded-2"
//               onClick={() => setDarkMode(!darkMode)}
//               aria-pressed={darkMode}
//             >
//               {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//               {darkMode ? "Light" : "Dark"} Mode
//             </button>
//             <button
//               className={`btn w-100 d-flex align-items-center gap-2 p-2 rounded-2 ${
//                 darkMode ? "btn-success" : "btn-outline-success"
//               }`}
//               onClick={() => setShowWalletModal(true)}
//             >
//               <Wallet size={20} />
//               Wallet
//             </button>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main
//           className={`flex-grow-1 p-3 p-lg-4 transition-all ${bgMain}`}
//           style={{
//             marginLeft:
//               sidebarOpen && window.innerWidth >= 992 ? "280px" : "0px",
//           }}
//         >
//           {/* Dashboard content sections go here */}

//           {/* Profile Edit Modal */}
//           {showProfileModal && (
//             <div
//               className="modal fade show d-block position-fixed top-0 start-0 w-100 h-100 p-3"
//               style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
//               role="dialog"
//               aria-modal="true"
//               aria-labelledby="profileModalTitle"
//             >
//               <div className="modal-dialog modal-lg modal-dialog-centered">
//                 <div className={`${cardBg} modal-content border-0 shadow-lg`}>
//                   <div className="modal-header border-0 pb-0">
//                     <h5 id="profileModalTitle" className="modal-title fw-bold">
//                       Edit Profile
//                     </h5>
//                     <button
//                       className="btn btn-sm btn-outline-secondary"
//                       onClick={() => setShowProfileModal(false)}
//                       aria-label="Close profile edit modal"
//                     >
//                       <X size={18} />
//                     </button>
//                   </div>
//                   <form
//                     onSubmit={handleUpdateProfile}
//                     className="modal-body p-4"
//                   >
//                     <div className="row g-3">
//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold">
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           className="form-control"
//                           value={editingProfile.phone}
//                           onChange={(e) =>
//                             setEditingProfile({
//                               ...editingProfile,
//                               phone: e.target.value,
//                             })
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label fw-semibold">
//                           Street Address
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={editingProfile.street}
//                           onChange={(e) =>
//                             setEditingProfile({
//                               ...editingProfile,
//                               street: e.target.value,
//                             })
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label fw-semibold">City</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={editingProfile.city}
//                           onChange={(e) =>
//                             setEditingProfile({
//                               ...editingProfile,
//                               city: e.target.value,
//                             })
//                           }
//                           required
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label fw-semibold">
//                           Province
//                         </label>
//                         <select
//                           className="form-select"
//                           value={editingProfile.province}
//                           onChange={(e) =>
//                             setEditingProfile({
//                               ...editingProfile,
//                               province: e.target.value,
//                             })
//                           }
//                           required
//                         >
//                           <option value="">Select Province</option>
//                           <option value="Bagmati">Bagmati</option>
//                           <option value="Gandaki">Gandaki</option>
//                           <option value="Lumbini">Lumbini</option>
//                           <option value="Koshi">Koshi</option>
//                           <option value="Madhesh">Madhesh</option>
//                         </select>
//                       </div>
//                       <div className="col-md-4">
//                         <label className="form-label fw-semibold">
//                           Postal Code
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={editingProfile.postalCode}
//                           onChange={(e) =>
//                             setEditingProfile({
//                               ...editingProfile,
//                               postalCode: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                     </div>
//                     <div className="d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
//                       <button
//                         type="button"
//                         className="btn btn-outline-secondary px-4"
//                         onClick={() => setShowProfileModal(false)}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className="btn btn-primary px-4"
//                         disabled={profileUpdating}
//                       >
//                         {profileUpdating ? (
//                           <>
//                             <span className="spinner-border spinner-border-sm me-2" />
//                             Saving...
//                           </>
//                         ) : (
//                           "Save Changes"
//                         )}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </>
//   );
// };

// export default CustomerDashboard;

// import React, { useState, useEffect } from "react";
// import {
//   Bell,
//   ShoppingCart,
//   User,
//   MessageCircle,
//   Wallet,
//   LogOut,
//   Menu,
//   Sun,
//   Moon,
//   Package,
//   X,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const API_BASE_URL = "http://localhost:5000/api";

// const CustomerDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // Layout / UI states
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [activeNav, setActiveNav] = useState("orders");
//   const [searchTerm, setSearchTerm] = useState("");

//   // Modals
//   const [showWalletModal, setShowWalletModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);

//   // Profile states
//   const [profile, setProfile] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(true);
//   const [profileUpdating, setProfileUpdating] = useState(false);
//   const [editingProfile, setEditingProfile] = useState({
//     phone: "",
//     street: "",
//     city: "",
//     province: "",
//     postalCode: "",
//   });

//   // Data states
//   const [orders, setOrders] = useState([]);
//   const [recommended, setRecommended] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const bgMain = darkMode ? "bg-dark text-light" : "bg-light text-dark";
//   const cardBg = darkMode ? "bg-secondary" : "bg-white";

//   useEffect(() => {
//     fetchDashboardData();
//     fetchProfile();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const [ordersRes, recRes, doctorsRes, apptsRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/customer/orders`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/medicines/recommended`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/doctors`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/customer/appointments`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       if (ordersRes.ok) setOrders(await ordersRes.json());
//       if (recRes.ok) setRecommended(await recRes.json());
//       if (doctorsRes.ok) setDoctors(await doctorsRes.json());
//       if (apptsRes.ok) setMyAppointments(await apptsRes.json());
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProfile = async () => {
//     try {
//       setProfileLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/customer/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setProfile(data);
//         setEditingProfile({
//           phone: data.phone || "",
//           street: data.address?.street || "",
//           city: data.address?.city || "",
//           province: data.address?.province || "",
//           postalCode: data.address?.postalCode || "",
//         });
//       }
//     } catch (err) {
//       console.error("Profile fetch error:", err);
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     setProfileUpdating(true);
//     try {
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       Object.entries(editingProfile).forEach(([key, value]) => {
//         formData.append(key, value);
//       });
//       const res = await fetch(`${API_BASE_URL}/customer/profile`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });
//       if (res.ok) {
//         const updatedProfile = await res.json();
//         setProfile(updatedProfile);
//         setShowProfileModal(false);
//         fetchProfile();
//       } else {
//         const error = await res.json();
//         alert(error.message || "Update failed");
//       }
//     } catch (err) {
//       alert("Something went wrong");
//     } finally {
//       setProfileUpdating(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   // Navigation items
//   const navItems = [
//     {
//       key: "orders",
//       icon: ShoppingCart,
//       label: "My Orders",
//       path: "/customer-dashboard",
//     },
//     { key: "medicines", icon: Package, label: "Medicines", path: "/medicines" },
//     { key: "profile", icon: User, label: "Profile", path: "/profile" },
//     { key: "support", icon: MessageCircle, label: "Support", path: "/support" },
//   ];

//   if (loading || profileLoading) {
//     return (
//       <div
//         className={`d-flex min-vh-100 justify-content-center align-items-center ${bgMain}`}
//       >
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {sidebarOpen && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
//           style={{ zIndex: 1040 }}
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//       <div
//         className={`d-flex min-vh-100 flex-column ${bgMain}`}
//         style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//       >
//         {/* Top bar */}
//         <header className="d-flex justify-content-between align-items-center bg-white border-bottom shadow-sm px-3 py-2 sticky-top z-index-1050">
//           <div className="d-flex align-items-center gap-2">
//             <button
//               className="btn btn-link p-0 d-lg-none text-dark"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               style={{ width: 40, height: 40 }}
//               aria-label="Toggle sidebar"
//             >
//               <Menu size={24} />
//             </button>
//             <h1 className="h5 mb-0 fw-bold text-primary d-none d-md-inline">
//               MyPharmacy
//             </h1>
//             <span className="h6 mb-0 fw-semibold d-md-none">MyPharmacy</span>
//           </div>
//           <div className="d-flex align-items-center gap-2">
//             <Bell size={20} className="text-muted cursor-pointer" />
//             <img
//               src={
//                 profile?.profilePhoto ||
//                 user?.profilePhoto ||
//                 "https://i.pravatar.cc/40"
//               }
//               alt="User avatar"
//               className="rounded-circle border border-primary"
//               style={{ width: 36, height: 36, cursor: "pointer" }}
//               onClick={() => setShowProfileModal(true)}
//             />
//             <button
//               className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-2"
//               onClick={handleLogout}
//               aria-label="Logout"
//             >
//               <LogOut size={16} />
//               <span className="d-none d-md-inline">Logout</span>
//             </button>
//           </div>
//         </header>

//         {/* Sidebar */}
//         <aside
//           className={`position-lg-fixed top-0 start-0 h-100 p-3 d-flex flex-column border-end shadow-sm transition-all ${cardBg}`}
//           style={{
//             width: sidebarOpen ? "280px" : "0px",
//             minWidth: sidebarOpen ? "280px" : "0px",
//             maxWidth: "280px",
//             zIndex: 1045,
//             transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//             transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
//           }}
//           aria-label="Sidebar navigation"
//         >
//           <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
//             <h2 className="h4 mb-0 fw-bold text-primary">MyPharmacy</h2>
//             <button
//               className="btn btn-sm btn-outline-secondary d-lg-none"
//               onClick={() => setSidebarOpen(false)}
//               aria-label="Close sidebar"
//             >
//               <X size={20} />
//             </button>
//           </div>
//           <nav className="flex-grow-1">
//             <ul className="nav flex-column gap-2">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = activeNav === item.key;
//                 return (
//                   <li key={item.key} className="nav-item">
//                     <button
//                       type="button"
//                       className={`btn w-100 text-start rounded-2 p-3 transition-all ${
//                         isActive
//                           ? "bg-primary text-white shadow-sm"
//                           : "text-muted hover:bg-light hover:text-dark"
//                       }`}
//                       onClick={() => {
//                         setActiveNav(item.key);
//                         setSidebarOpen(false);
//                         navigate(item.path);
//                       }}
//                       aria-current={isActive ? "page" : undefined}
//                     >
//                       <div className="d-flex align-items-center gap-3">
//                         <Icon size={20} />
//                         <span>{item.label}</span>
//                       </div>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>
//           <div className="mt-auto pt-3 border-top">
//             <button
//               className="btn btn-outline-primary w-100 d-flex align-items-center gap-2 mb-2 p-2 rounded-2"
//               onClick={() => setDarkMode(!darkMode)}
//               aria-pressed={darkMode}
//             >
//               {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//               {darkMode ? "Light" : "Dark"} Mode
//             </button>
//           </div>
//         </aside>

//         {/* Main content */}
//         <main
//           className={`flex-grow-1 p-3 p-lg-4 transition-all ${bgMain}`}
//           style={{
//             marginLeft:
//               sidebarOpen && window.innerWidth >= 992 ? "280px" : "0px",
//           }}
//         >
//           {/* Content based on activeNav */}
//           <div>
//             {activeNav === "orders" && (
//               <div>
//                 <h3>My Orders ({orders.length})</h3>
//                 {/* Orders list rendering here */}
//               </div>
//             )}
//             {activeNav === "medicines" && (
//               <div>
//                 <h3>Recommended Medicines ({recommended.length})</h3>
//                 {/* Medicines list rendering here */}
//               </div>
//             )}
//             {activeNav === "profile" && (
//               <div>
//                 <h3>Profile</h3>
//                 {/* Profile details / edit UI */}
//               </div>
//             )}
//             {activeNav === "support" && (
//               <div>
//                 <h3>Support</h3>
//                 {/* Support related UI */}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>

//       {/* Profile Edit Modal */}
//       {showProfileModal && (
//         <div
//           className="modal fade show d-block position-fixed top-0 start-0 w-100 h-100 p-3"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="profileModalTitle"
//           tabIndex={-1}
//         >
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className={`${cardBg} modal-content border-0 shadow-lg`}>
//               <div className="modal-header border-0 pb-0">
//                 <h5 id="profileModalTitle" className="modal-title fw-bold">
//                   Edit Profile
//                 </h5>
//                 <button
//                   className="btn btn-sm btn-outline-secondary"
//                   onClick={() => setShowProfileModal(false)}
//                   aria-label="Close profile edit modal"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//               <form onSubmit={handleUpdateProfile} className="modal-body p-4">
//                 <div className="row g-3">
//                   <div className="col-md-6">
//                     <label className="form-label fw-semibold">
//                       Phone Number
//                     </label>
//                     <input
//                       type="tel"
//                       className="form-control"
//                       value={editingProfile.phone}
//                       onChange={(e) =>
//                         setEditingProfile({
//                           ...editingProfile,
//                           phone: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label className="form-label fw-semibold">
//                       Street Address
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={editingProfile.street}
//                       onChange={(e) =>
//                         setEditingProfile({
//                           ...editingProfile,
//                           street: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <label className="form-label fw-semibold">City</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={editingProfile.city}
//                       onChange={(e) =>
//                         setEditingProfile({
//                           ...editingProfile,
//                           city: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <label className="form-label fw-semibold">Province</label>
//                     <select
//                       className="form-select"
//                       value={editingProfile.province}
//                       onChange={(e) =>
//                         setEditingProfile({
//                           ...editingProfile,
//                           province: e.target.value,
//                         })
//                       }
//                       required
//                     >
//                       <option value="">Select Province</option>
//                       <option value="Bagmati">Bagmati</option>
//                       <option value="Gandaki">Gandaki</option>
//                       <option value="Lumbini">Lumbini</option>
//                       <option value="Koshi">Koshi</option>
//                       <option value="Madhesh">Madhesh</option>
//                     </select>
//                   </div>
//                   <div className="col-md-4">
//                     <label className="form-label fw-semibold">
//                       Postal Code
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={editingProfile.postalCode}
//                       onChange={(e) =>
//                         setEditingProfile({
//                           ...editingProfile,
//                           postalCode: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
//                   <button
//                     type="button"
//                     className="btn btn-outline-secondary px-4"
//                     onClick={() => setShowProfileModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary px-4"
//                     disabled={profileUpdating}
//                   >
//                     {profileUpdating ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" />
//                         Saving...
//                       </>
//                     ) : (
//                       "Save Changes"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
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
//   CreditCard,
//   Wallet,
//   X,
//   Sun,
//   Moon,
//   Calendar,
//   Clock,
//   Stethoscope,
//   LogOut,
//   Menu,
//   Upload,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import PrescriptionUpload from "../components/PrescriptionUpload";

// const API_BASE_URL = "http://localhost:5000/api";

// const CustomerDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // layout / ui
//   const [sidebarOpen, setSidebarOpen] = useState(
//     typeof window !== "undefined" ? window.innerWidth >= 992 : true
//   );
//   const [darkMode, setDarkMode] = useState(false);
//   const [activeNav, setActiveNav] = useState("orders"); // new: to track active item
//   const [searchTerm, setSearchTerm] = useState("");

//   // modals
//   const [showWalletModal, setShowWalletModal] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);

//   // prescription upload
//   const [prescriptionFile, setPrescriptionFile] = useState(null);
//   const [prescriptionPreview, setPrescriptionPreview] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // payments
//   const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

//   // appointment form
//   const [apptName, setApptName] = useState(user?.name || "");
//   const [apptAge, setApptAge] = useState("");
//   const [apptPhone, setApptPhone] = useState("");
//   const [apptAddress, setApptAddress] = useState("");
//   const [apptProvince, setApptProvince] = useState("");
//   const [apptProblem, setApptProblem] = useState("");
//   const [apptMessage, setApptMessage] = useState("");

//   // data
//   const [orders, setOrders] = useState([]);
//   const [recommended, setRecommended] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const bgMain = darkMode ? "bg-dark text-light" : "bg-light text-dark";
//   const cardBg = darkMode ? "bg-secondary" : "bg-white";

//   // Keep sidebar always open on desktop (>=992px)
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 992) {
//         setSidebarOpen(true);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   const isDesktop = typeof window !== "undefined" && window.innerWidth >= 992;

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const [ordersRes, recRes, doctorsRes, apptsRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/customer/orders`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/medicines/recommended`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/doctors`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/customer/appointments`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       if (ordersRes.ok) setOrders(await ordersRes.json());
//       if (recRes.ok) setRecommended(await recRes.json());
//       if (doctorsRes.ok) setDoctors(await doctorsRes.json());
//       if (apptsRes.ok) setMyAppointments(await apptsRes.json());
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handlePrescriptionChange = (e) => {
//     const file = e.target.files?.[0];
//     setUploadMessage("");
//     setPrescriptionFile(file || null);
//     if (file) {
//       setPrescriptionPreview(URL.createObjectURL(file));
//     } else {
//       setPrescriptionPreview(null);
//     }
//   };

//   const handleUploadPrescription = async (e) => {
//     e.preventDefault();
//     setUploadMessage("");

//     if (!user?.name || !user?.email) {
//       setUploadMessage("User details missing. Please login again.");
//       return;
//     }
//     if (!prescriptionFile) {
//       setUploadMessage("Please select a prescription image first.");
//       return;
//     }

//     try {
//       setUploadLoading(true);
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("image", prescriptionFile);
//       formData.append("notes", notes);
//       formData.append("customerName", user.name);
//       formData.append("customerEmail", user.email);

//       const res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setUploadMessage(data.message || "Failed to upload prescription.");
//       } else {
//         setUploadMessage("Prescription uploaded successfully!");
//         setPrescriptionFile(null);
//         setPrescriptionPreview(null);
//         setNotes("");
//       }
//     } catch (err) {
//       setUploadMessage("Something went wrong while uploading prescription.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const reserveAppointment = async (doctor) => {
//     setApptMessage("");
//     if (
//       !apptName.trim() ||
//       !apptAge.trim() ||
//       !apptPhone.trim() ||
//       !apptAddress.trim() ||
//       !apptProvince.trim() ||
//       !apptProblem.trim()
//     ) {
//       setApptMessage("Please fill all appointment form fields.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const selectedSlot = doctor.slots?.[0];
//       if (!selectedSlot) {
//         setApptMessage("No available time slots for this doctor.");
//         return;
//       }

//       const appointmentDate = new Date(doctor.nextSlot);
//       appointmentDate.setHours(0, 0, 0, 0);

//       const payload = {
//         doctor: doctor._id || doctor.id,
//         date: appointmentDate.toISOString(),
//         timeSlot: selectedSlot,
//         notes: apptProblem.trim(),
//         customerDetails: {
//           name: apptName,
//           age: apptAge,
//           phone: apptPhone,
//           address: apptAddress,
//           province: apptProvince,
//         },
//       };

//       const res = await fetch(`${API_BASE_URL}/api/appointments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setApptMessage(data.message || "Failed to reserve appointment.");
//       } else {
//         setApptMessage("Appointment reserved successfully!");
//         setApptName(user?.name || "");
//         setApptAge("");
//         setApptPhone("");
//         setApptAddress("");
//         setApptProvince("");
//         setApptProblem("");
//         fetchDashboardData();
//       }
//     } catch (error) {
//       setApptMessage("Something went wrong reserving appointment.");
//     }
//   };

//   const handlePayNow = (order) => {
//     navigate(
//       `/payment?orderId=${order.id || order._id}&amount=${
//         order.price || order.total
//       }`
//     );
//   };

//   if (loading) {
//     return (
//       <div
//         className={`d-flex min-vh-100 justify-content-center align-items-center ${bgMain}`}
//       >
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   // sidebar nav config with paths
//   const navItems = [
//     {
//       key: "orders",
//       icon: ShoppingCart,
//       label: "My Orders",
//       path: "/customer-dashboard",
//     },
//     {
//       key: "medicines",
//       icon: Package,
//       label: "Medicines",
//       path: "/medicines",
//     },
//     {
//       key: "profile",
//       icon: User,
//       label: "Profile",
//       path: "/profile",
//     },
//     {
//       key: "support",
//       icon: MessageCircle,
//       label: "Support",
//       path: "/support",
//     },
//   ];

//   return (
//     <>
//       {sidebarOpen && !isDesktop && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
//           style={{ zIndex: 1030 }}
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <div
//         className={`d-flex min-vh-100 flex-column ${bgMain}`}
//         style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//       >
//         {/* Mobile top bar */}
//         <header className="d-flex d-lg-none justify-content-between align-items-center bg-dark text-light px-3 py-2 sticky-top">
//           <button
//             className="btn btn-dark"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             aria-label="Toggle Menu"
//           >
//             <Menu size={22} />
//           </button>
//           <span className="fs-5 fw-semibold">MyPharmacy</span>
//         </header>

//         {/* Sidebar */}
//         <aside
//           className={`position-fixed top-0 vh-100 p-3 d-flex flex-column ${cardBg} border-end`}
//           style={{
//             width: "240px",
//             transform:
//               isDesktop || sidebarOpen ? "translateX(0)" : "translateX(-100%)",
//             transition: "transform 0.25s ease-out",
//             zIndex: 1040,
//           }}
//         >
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h1
//               className="h4 text-primary cursor-pointer"
//               onClick={() => navigate("/customer-dashboard")}
//             >
//               MyPharmacy
//             </h1>
//             <button
//               className="btn btn-outline-secondary d-lg-none"
//               onClick={() => setSidebarOpen(false)}
//               aria-label="Close Menu"
//             >
//               <X />
//             </button>
//           </div>

//           <nav className="flex-grow-1">
//             <ul className="nav flex-column gap-2">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = activeNav === item.key;
//                 return (
//                   <li key={item.key} className="nav-item">
//                     <button
//                       type="button"
//                       className={`btn btn-toggle align-items-center rounded w-100 text-start ${
//                         isActive ? "bg-primary bg-opacity-10" : ""
//                       }`}
//                       style={{ color: darkMode ? "#eee" : "#111" }}
//                       onClick={() => {
//                         setActiveNav(item.key);
//                         navigate(item.path);
//                         if (!isDesktop) setSidebarOpen(false);
//                       }}
//                     >
//                       <Icon size={20} />
//                       <span className="ms-2">{item.label}</span>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           <div className="mt-auto d-flex flex-column gap-2">
//             <button
//               className="btn btn-outline-primary d-flex align-items-center gap-2"
//               onClick={() => setDarkMode(!darkMode)}
//             >
//               {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//               <span>{darkMode ? "Light" : "Dark"} Mode</span>
//             </button>
//             <button
//               className={`btn d-flex align-items-center gap-2 ${
//                 darkMode ? "btn-success" : "btn-outline-success"
//               }`}
//               onClick={() => setShowWalletModal(true)}
//             >
//               <Wallet size={20} />
//               <span>Wallet</span>
//             </button>
//           </div>
//         </aside>

//         {/* Main content */}
//         <main
//           className="flex-grow-1 p-3"
//           style={{
//             marginLeft: isDesktop ? "240px" : 0,
//             transition: "margin-left 0.25s ease-out",
//           }}
//         >
//           {/* ORDERS SECTION */}
//           {activeNav === "orders" && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">My Orders</h2>
//               {orders.length === 0 ? (
//                 <p>No orders found.</p>
//               ) : (
//                 <div className="table-responsive">
//                   <table
//                     className={`table table-striped ${
//                       darkMode ? "table-dark" : ""
//                     }`}
//                   >
//                     <thead>
//                       <tr>
//                         <th>Order ID</th>
//                         <th>Medicine</th>
//                         <th>Price</th>
//                         <th>Status</th>
//                         <th>Date</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {orders.map((order) => (
//                         <tr key={order._id}>
//                           <td>{order.id || order._id}</td>
//                           <td>
//                             {order.medicine || order.medicines?.join(", ")}
//                           </td>
//                           <td>₹{order.price || order.total}</td>
//                           <td>{order.status}</td>
//                           <td>
//                             {order.date
//                               ? new Date(order.date).toLocaleDateString()
//                               : "—"}
//                           </td>
//                           <td>
//                             {order.paymentStatus !== "Paid" && (
//                               <button
//                                 className="btn btn-primary btn-sm"
//                                 onClick={() => handlePayNow(order)}
//                               >
//                                 Pay Now
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>
//           )}

//           {/* MEDICINES SECTION */}
//           {activeNav === "medicines" && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">Recommended Medicines</h2>
//               {recommended.length === 0 ? (
//                 <p>No recommended medicines available.</p>
//               ) : (
//                 <div className="row row-cols-1 row-cols-md-3 g-3">
//                   {recommended.map((med) => (
//                     <div
//                       key={med._id}
//                       className="col text-center p-3 border rounded cursor-pointer"
//                     >
//                       <img
//                         src={
//                           med.image ||
//                           "https://cdn-icons-png.flaticon.com/512/3050/3050525.png"
//                         }
//                         alt={med.name}
//                         className="img-fluid mb-2"
//                         style={{ maxHeight: "70px", objectFit: "contain" }}
//                       />
//                       <h5 className="fs-6">{med.name}</h5>
//                       <p className="mb-0 text-primary">₹{med.price}</p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </section>
//           )}

//           {/* PROFILE SECTION */}
//           {activeNav === "profile" && profile && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">My Profile</h2>
//               <p>
//                 <strong>Name:</strong> {user?.name}
//               </p>
//               <p>
//                 <strong>Email:</strong> {user?.email}
//               </p>
//               <p>
//                 <strong>Phone:</strong> {profile.phone || "-"}
//               </p>
//               <p>
//                 <strong>Address:</strong>{" "}
//                 {[
//                   profile.address?.street,
//                   profile.address?.city,
//                   profile.address?.province,
//                   profile.address?.postalCode,
//                 ]
//                   .filter(Boolean)
//                   .join(", ") || "-"}
//               </p>
//               <button
//                 className="btn btn-primary"
//                 onClick={() => setShowProfileModal(true)}
//               >
//                 Edit Profile
//               </button>
//             </section>
//           )}

//           {/* SUPPORT SECTION */}
//           {activeNav === "support" && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">Support</h2>
//               <p>
//                 For support, please contact us by email at{" "}
//                 <a href="mailto:support@mypharmacy.com">
//                   support@mypharmacy.com
//                 </a>{" "}
//                 or call (123) 456-7890.
//               </p>
//               <p>
//                 We are here to help you with any issues or questions about your
//                 orders, prescriptions, or appointments.
//               </p>
//             </section>
//           )}
//         </main>
//       </div>
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
//   CreditCard,
//   Wallet,
//   X,
//   Sun,
//   Moon,
//   Calendar,
//   Clock,
//   Stethoscope,
//   LogOut,
//   Menu,
//   Upload,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import PrescriptionUpload from "../components/PrescriptionUpload";

// const API_BASE_URL = "http://localhost:5000/api";

// const CustomerDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // layout / ui
//   const [sidebarOpen, setSidebarOpen] = useState(
//     typeof window !== "undefined" ? window.innerWidth >= 992 : true
//   );
//   const [darkMode, setDarkMode] = useState(false);
//   const [activeNav, setActiveNav] = useState("orders");
//   const [searchTerm, setSearchTerm] = useState("");

//   // modals
//   const [showWalletModal, setShowWalletModal] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);

//   // prescription upload
//   const [prescriptionFile, setPrescriptionFile] = useState(null);
//   const [prescriptionPreview, setPrescriptionPreview] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // payments
//   const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

//   // appointment form
//   const [apptName, setApptName] = useState(user?.name || "");
//   const [apptAge, setApptAge] = useState("");
//   const [apptPhone, setApptPhone] = useState("");
//   const [apptAddress, setApptAddress] = useState("");
//   const [apptProvince, setApptProvince] = useState("");
//   const [apptProblem, setApptProblem] = useState("");
//   const [apptMessage, setApptMessage] = useState("");

//   // data
//   const [orders, setOrders] = useState([]);
//   const [recommended, setRecommended] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(true);

//   const bgMain = darkMode ? "bg-dark text-light" : "bg-light text-dark";
//   const cardBg = darkMode ? "bg-secondary" : "bg-white";

//   // Keep sidebar always open on desktop (>=992px)
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 992) {
//         setSidebarOpen(true);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     fetchDashboardData();
//     fetchProfile();
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   const isDesktop = typeof window !== "undefined" && window.innerWidth >= 992;

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const [ordersRes, recRes, doctorsRes, apptsRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/customer/orders`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/medicines/recommended`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/doctors`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/customer/appointments`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       if (ordersRes.ok) setOrders(await ordersRes.json());
//       if (recRes.ok) setRecommended(await recRes.json());
//       if (doctorsRes.ok) setDoctors(await doctorsRes.json());
//       if (apptsRes.ok) setMyAppointments(await apptsRes.json());
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProfile = async () => {
//     try {
//       setProfileLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/customer/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setProfile(data);
//       }
//     } catch (err) {
//       console.error("Profile fetch error:", err);
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handlePrescriptionChange = (e) => {
//     const file = e.target.files?.[0];
//     setUploadMessage("");
//     setPrescriptionFile(file || null);
//     if (file) {
//       setPrescriptionPreview(URL.createObjectURL(file));
//     } else {
//       setPrescriptionPreview(null);
//     }
//   };

//   const handleUploadPrescription = async (e) => {
//     e.preventDefault();
//     setUploadMessage("");

//     if (!user?.name || !user?.email) {
//       setUploadMessage("User details missing. Please login again.");
//       return;
//     }
//     if (!prescriptionFile) {
//       setUploadMessage("Please select a prescription image first.");
//       return;
//     }

//     try {
//       setUploadLoading(true);
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("image", prescriptionFile);
//       formData.append("notes", notes);
//       formData.append("customerName", user.name);
//       formData.append("customerEmail", user.email);

//       const res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setUploadMessage(data.message || "Failed to upload prescription.");
//       } else {
//         setUploadMessage("Prescription uploaded successfully!");
//         setPrescriptionFile(null);
//         setPrescriptionPreview(null);
//         setNotes("");
//       }
//     } catch (err) {
//       setUploadMessage("Something went wrong while uploading prescription.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const reserveAppointment = async (doctor) => {
//     setApptMessage("");
//     if (
//       !apptName.trim() ||
//       !apptAge.trim() ||
//       !apptPhone.trim() ||
//       !apptAddress.trim() ||
//       !apptProvince.trim() ||
//       !apptProblem.trim()
//     ) {
//       setApptMessage("Please fill all appointment form fields.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const selectedSlot = doctor.slots?.[0];
//       if (!selectedSlot) {
//         setApptMessage("No available time slots for this doctor.");
//         return;
//       }

//       const appointmentDate = new Date(doctor.nextSlot);
//       appointmentDate.setHours(0, 0, 0, 0);

//       const payload = {
//         doctor: doctor._id || doctor.id,
//         date: appointmentDate.toISOString(),
//         timeSlot: selectedSlot,
//         notes: apptProblem.trim(),
//         customerDetails: {
//           name: apptName,
//           age: apptAge,
//           phone: apptPhone,
//           address: apptAddress,
//           province: apptProvince,
//         },
//       };

//       const res = await fetch(`${API_BASE_URL}/api/appointments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setApptMessage(data.message || "Failed to reserve appointment.");
//       } else {
//         setApptMessage("Appointment reserved successfully!");
//         setApptName(user?.name || "");
//         setApptAge("");
//         setApptPhone("");
//         setApptAddress("");
//         setApptProvince("");
//         setApptProblem("");
//         fetchDashboardData();
//       }
//     } catch (error) {
//       setApptMessage("Something went wrong reserving appointment.");
//     }
//   };

//   const handlePayNow = (order) => {
//     navigate(
//       `/payment?orderId=${order.id || order._id}&amount=${
//         order.price || order.total
//       }`
//     );
//   };

//   if (loading || profileLoading) {
//     return (
//       <div
//         className={`d-flex min-vh-100 justify-content-center align-items-center ${bgMain}`}
//       >
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   // sidebar nav config with paths
//   const navItems = [
//     {
//       key: "orders",
//       icon: ShoppingCart,
//       label: "My Orders",
//       path: "/customer-dashboard",
//     },
//     {
//       key: "medicines",
//       icon: Package,
//       label: "Medicines",
//       path: "/medicines",
//     },
//     {
//       key: "profile",
//       icon: User,
//       label: "Profile",
//       path: "/profile",
//     },
//     {
//       key: "support",
//       icon: MessageCircle,
//       label: "Support",
//       path: "/support",
//     },
//   ];

//   return (
//     <>
//       {sidebarOpen && !isDesktop && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
//           style={{ zIndex: 1030 }}
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <div
//         className={`d-flex min-vh-100 flex-column ${bgMain}`}
//         style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//       >
//         {/* Mobile top bar */}
//         <header className="d-flex d-lg-none justify-content-between align-items-center bg-dark text-light px-3 py-2 sticky-top">
//           <button
//             className="btn btn-dark"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             aria-label="Toggle Menu"
//           >
//             <Menu size={22} />
//           </button>
//           <span className="fs-5 fw-semibold">MyPharmacy</span>
//         </header>

//         {/* Sidebar */}
//         <aside
//           className={`position-fixed top-0 vh-100 p-3 d-flex flex-column ${cardBg} border-end`}
//           style={{
//             width: "240px",
//             transform:
//               isDesktop || sidebarOpen ? "translateX(0)" : "translateX(-100%)",
//             transition: "transform 0.25s ease-out",
//             zIndex: 1040,
//           }}
//         >
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h1
//               className="h4 text-primary cursor-pointer"
//               onClick={() => navigate("/customer-dashboard")}
//             >
//               MyPharmacy
//             </h1>
//             <button
//               className="btn btn-outline-secondary d-lg-none"
//               onClick={() => setSidebarOpen(false)}
//               aria-label="Close Menu"
//             >
//               <X />
//             </button>
//           </div>

//           <nav className="flex-grow-1">
//             <ul className="nav flex-column gap-2">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = activeNav === item.key;
//                 return (
//                   <li key={item.key} className="nav-item">
//                     <button
//                       type="button"
//                       className={`btn btn-toggle align-items-center rounded w-100 text-start ${
//                         isActive ? "bg-primary bg-opacity-10" : ""
//                       }`}
//                       style={{ color: darkMode ? "#eee" : "#111" }}
//                       onClick={() => {
//                         setActiveNav(item.key);
//                         navigate(item.path);
//                         if (!isDesktop) setSidebarOpen(false);
//                       }}
//                     >
//                       <Icon size={20} />
//                       <span className="ms-2">{item.label}</span>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           <div className="mt-auto d-flex flex-column gap-2">
//             <button
//               className="btn btn-outline-primary d-flex align-items-center gap-2"
//               onClick={() => setDarkMode(!darkMode)}
//             >
//               {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//               <span>{darkMode ? "Light" : "Dark"} Mode</span>
//             </button>
//             <button
//               className={`btn d-flex align-items-center gap-2 ${
//                 darkMode ? "btn-success" : "btn-outline-success"
//               }`}
//               onClick={() => setShowWalletModal(true)}
//             >
//               <Wallet size={20} />
//               <span>Wallet</span>
//             </button>
//           </div>
//         </aside>

//         {/* Main content */}
//         <main
//           className="flex-grow-1 p-3"
//           style={{
//             marginLeft: isDesktop ? "240px" : 0,
//             transition: "margin-left 0.25s ease-out",
//           }}
//         >
//           {/* Top bar with search and profile */}
//           <div className="d-flex justify-content-between flex-wrap align-items-center mb-4 gap-3">
//             <div className="input-group" style={{ maxWidth: 360 }}>
//               <span className="input-group-text bg-white border-end-0">
//                 <Search size={18} />
//               </span>
//               <input
//                 type="search"
//                 className={`form-control ${
//                   darkMode ? "bg-secondary text-light border-secondary" : ""
//                 }`}
//                 placeholder="Search medicines..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 aria-label="Search medicines"
//               />
//             </div>
//             <div className="d-flex align-items-center gap-3">
//               <Bell
//                 size={20}
//                 className={`cursor-pointer ${
//                   darkMode ? "text-light" : "text-dark"
//                 }`}
//               />
//               <img
//                 src={
//                   profile?.profilePhoto ||
//                   user?.profilePhoto ||
//                   "https://i.pravatar.cc/40"
//                 }
//                 alt="User avatar"
//                 className="rounded-circle border border-primary"
//                 style={{ width: 36, height: 36, cursor: "pointer" }}
//               />
//               <button
//                 className="btn btn-danger d-flex align-items-center gap-1 px-2"
//                 onClick={handleLogout}
//                 aria-label="Logout"
//               >
//                 <LogOut size={16} />
//                 <span className="d-none d-md-inline">Logout</span>
//               </button>
//             </div>
//           </div>

//           {/* Stat cards */}
//           <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
//             {[
//               {
//                 title: "Wallet Balance",
//                 value: "₹2,540",
//                 icon: <CreditCard size={28} color="#22c55e" />,
//               },
//               {
//                 title: "Active Orders",
//                 value: orders.filter((o) => o.paymentStatus !== "Paid").length,
//                 icon: <ShoppingCart size={28} color="#3b82f6" />,
//               },
//               {
//                 title: "Loyalty Points",
//                 value: 125,
//                 icon: <HeartPulse size={28} color="#ec4899" />,
//               },
//               {
//                 title: "Appointments",
//                 value: myAppointments.length,
//                 icon: <Calendar size={28} color="#eab308" />,
//               },
//             ].map((card) => (
//               <div key={card.title} className="col">
//                 <div
//                   className={`${cardBg} rounded-3 p-3 d-flex justify-content-between align-items-center shadow-sm`}
//                   style={{ minHeight: "100px" }}
//                 >
//                   <div>
//                     <p className="mb-1 text-muted small">{card.title}</p>
//                     <h3 className="mb-0 fw-semibold">{card.value}</h3>
//                   </div>
//                   {card.icon}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* ORDERS SECTION */}
//           {activeNav === "orders" && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">My Orders</h2>
//               {orders.length === 0 ? (
//                 <p>No orders found.</p>
//               ) : (
//                 <div className="table-responsive">
//                   <table
//                     className={`table table-striped align-middle ${
//                       darkMode ? "table-dark" : ""
//                     }`}
//                   >
//                     <thead>
//                       <tr>
//                         <th>Order ID</th>
//                         <th>Medicine</th>
//                         <th>Price</th>
//                         <th>Status</th>
//                         <th>Date</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {orders.map((order) => (
//                         <tr key={order._id || order.id}>
//                           <td>#{order.id || order._id}</td>
//                           <td>
//                             {order.medicine || order.medicines?.join(", ")}
//                           </td>
//                           <td>₹{order.price || order.total}</td>
//                           <td>
//                             <span className="badge bg-info">
//                               {order.status}
//                             </span>
//                           </td>
//                           <td>
//                             {order.date
//                               ? new Date(order.date).toLocaleDateString()
//                               : "—"}
//                           </td>
//                           <td>
//                             {order.paymentStatus !== "Paid" && (
//                               <button
//                                 className="btn btn-primary btn-sm"
//                                 onClick={() => handlePayNow(order)}
//                               >
//                                 Pay Now
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>
//           )}

//           {/* MEDICINES SECTION */}
//           {activeNav === "medicines" && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">Recommended Medicines</h2>
//               {recommended.length === 0 ? (
//                 <p>No recommended medicines available.</p>
//               ) : (
//                 <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3">
//                   {recommended.map((med) => (
//                     <div
//                       key={med._id || med.id}
//                       className="col text-center p-3 border rounded cursor-pointer"
//                     >
//                       <img
//                         src={
//                           med.image ||
//                           "https://cdn-icons-png.flaticon.com/512/3050/3050525.png"
//                         }
//                         alt={med.name}
//                         className="img-fluid mb-2"
//                         style={{ maxHeight: "70px", objectFit: "contain" }}
//                       />
//                       <h5 className="fs-6">{med.name}</h5>
//                       <p className="mb-0 text-primary fw-bold">₹{med.price}</p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </section>
//           )}

//           {/* PROFILE SECTION */}
//           {activeNav === "profile" && profile && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">My Profile</h2>
//               <div className="row g-3">
//                 <div className="col-md-6">
//                   <p>
//                     <strong>Name:</strong> {user?.name}
//                   </p>
//                 </div>
//                 <div className="col-md-6">
//                   <p>
//                     <strong>Email:</strong> {user?.email}
//                   </p>
//                 </div>
//                 <div className="col-md-6">
//                   <p>
//                     <strong>Phone:</strong> {profile.phone || "-"}
//                   </p>
//                 </div>
//                 <div className="col-md-6">
//                   <p>
//                     <strong>Address:</strong>{" "}
//                     {[
//                       profile.address?.street,
//                       profile.address?.city,
//                       profile.address?.province,
//                       profile.address?.postalCode,
//                     ]
//                       .filter(Boolean)
//                       .join(", ") || "-"}
//                   </p>
//                 </div>
//               </div>
//               <button className="btn btn-primary">Edit Profile</button>
//             </section>
//           )}

//           {/* SUPPORT SECTION */}
//           {activeNav === "support" && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">Support</h2>
//               <p>
//                 For support, please contact us by email at{" "}
//                 <a href="mailto:support@mypharmacy.com">
//                   support@mypharmacy.com
//                 </a>{" "}
//                 or call (123) 456-7890.
//               </p>
//               <p>
//                 We are here to help you with any issues or questions about your
//                 orders, prescriptions, or appointments.
//               </p>
//             </section>
//           )}

//           {/* Prescription upload section (visible on all tabs) */}
//           <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//             <h3 className="mb-3">Upload Doctor's Prescription</h3>
//             <div
//               className="border border-primary border-dashed rounded-3 d-flex flex-column align-items-center justify-content-center p-4"
//               role="button"
//               tabIndex={0}
//               onClick={() =>
//                 document.getElementById("prescription-file")?.click()
//               }
//               onKeyPress={(e) =>
//                 e.key === "Enter" &&
//                 document.getElementById("prescription-file")?.click()
//               }
//             >
//               <Upload size={40} color="#3b82f6" />
//               <p className="mt-2 text-secondary">
//                 Click to select a prescription image (JPG, PNG)
//               </p>
//               <input
//                 id="prescription-file"
//                 type="file"
//                 accept="image/*"
//                 className="d-none"
//                 onChange={handlePrescriptionChange}
//               />
//               {prescriptionPreview && (
//                 <img
//                   src={prescriptionPreview}
//                   alt="Prescription preview"
//                   className="mt-3 rounded-3 shadow"
//                   style={{
//                     maxWidth: "160px",
//                     maxHeight: "160px",
//                     objectFit: "cover",
//                   }}
//                 />
//               )}
//             </div>
//             <form
//               onSubmit={handleUploadPrescription}
//               className="mt-3 d-flex flex-column gap-2"
//             >
//               <textarea
//                 className="form-control"
//                 placeholder="Notes for pharmacist (optional)"
//                 rows={4}
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//               />
//               <button
//                 type="submit"
//                 className="btn btn-primary rounded-pill"
//                 disabled={uploadLoading}
//               >
//                 {uploadLoading ? "Uploading..." : "Upload Prescription"}
//               </button>
//             </form>
//             {uploadMessage && (
//               <div
//                 className={`mt-2 small ${
//                   uploadMessage.includes("success")
//                     ? "text-success"
//                     : "text-danger"
//                 }`}
//               >
//                 {uploadMessage}
//               </div>
//             )}
//           </section>

//           {/* Doctor Appointments */}
//           <section className="row g-4 mb-4">
//             <div className={`col-12 ${cardBg} rounded-3 p-4 shadow-sm`}>
//               <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
//                 <h2 className="mb-0 d-flex align-items-center gap-2">
//                   <Stethoscope size={20} />
//                   Doctor Appointments
//                 </h2>
//                 <button
//                   className="btn btn-primary rounded-pill px-4"
//                   onClick={() => navigate("/customer-appointments")}
//                 >
//                   Book Now <Calendar className="ms-1" size={16} />
//                 </button>
//               </div>

//               <div className="row g-4">
//                 {/* Quick Doctor Preview */}
//                 <div className="col-md-6">
//                   <div className="text-center p-4 border rounded-3 h-100 d-flex flex-column justify-content-center">
//                     <div
//                       className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
//                       style={{ width: 80, height: 80 }}
//                     >
//                       <Stethoscope size={32} />
//                     </div>
//                     <h4 className="mb-2">Available Doctors</h4>
//                     <p className="text-muted mb-3">
//                       Browse specialists and book appointments online
//                     </p>
//                     <div className="d-flex flex-column gap-2 small">
//                       {doctors.slice(0, 3).map((d) => (
//                         <div
//                           key={d._id || d.id}
//                           className="d-flex align-items-center gap-2 p-2 bg-light rounded"
//                         >
//                           <div className="fw-bold text-truncate flex-grow-1">
//                             {d.name}
//                           </div>
//                           <span className="badge bg-success">
//                             {d.speciality}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* My Appointments Preview */}
//                 <div className="col-md-6">
//                   <div className="text-center p-4 border rounded-3 h-100 d-flex flex-column justify-content-center position-relative">
//                     <div
//                       className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
//                       style={{ width: 80, height: 80 }}
//                     >
//                       <Calendar size={32} />
//                     </div>
//                     <h4 className="mb-2">My Appointments</h4>
//                     <p className="text-muted mb-3">
//                       {myAppointments.length > 0
//                         ? `${myAppointments.length} appointment${
//                             myAppointments.length !== 1 ? "s" : ""
//                           }`
//                         : "No upcoming appointments"}
//                     </p>
//                     {myAppointments.slice(0, 2).map((appt) => (
//                       <div
//                         key={appt._id}
//                         className="small text-start mb-2 p-2 bg-light rounded"
//                       >
//                         <div className="fw-medium">
//                           {new Date(appt.date).toLocaleDateString()}
//                         </div>
//                         <div className="text-muted">
//                           {appt.doctor?.name} - {appt.timeSlot}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="text-center mt-4 pt-3 border-top">
//                 <small className="text-muted me-2">Need help?</small>
//                 <button
//                   className="btn btn-link p-0 text-primary fw-medium"
//                   onClick={() => navigate("/customer-appointments")}
//                 >
//                   View all appointments →
//                 </button>
//               </div>
//             </div>
//           </section>
//         </main>
//       </div>
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
//   CreditCard,
//   X,
//   Sun,
//   Moon,
//   Calendar,
//   Stethoscope,
//   LogOut,
//   Menu,
//   Upload,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const API_BASE_URL = "http://localhost:5000/api";

// const CustomerDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // layout / ui
//   const [sidebarOpen, setSidebarOpen] = useState(
//     typeof window !== "undefined" ? window.innerWidth >= 992 : true
//   );
//   const [darkMode, setDarkMode] = useState(false);
//   const [activeNav, setActiveNav] = useState("orders");
//   const [searchTerm, setSearchTerm] = useState("");

//   // modals
//   const [showPaymentModal, setShowPaymentModal] = useState(false);

//   // prescription upload
//   const [prescriptionFile, setPrescriptionFile] = useState(null);
//   const [prescriptionPreview, setPrescriptionPreview] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // payments
//   const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

//   // appointment form
//   const [apptName, setApptName] = useState(user?.name || "");
//   const [apptAge, setApptAge] = useState("");
//   const [apptPhone, setApptPhone] = useState("");
//   const [apptAddress, setApptAddress] = useState("");
//   const [apptProvince, setApptProvince] = useState("");
//   const [apptProblem, setApptProblem] = useState("");
//   const [apptMessage, setApptMessage] = useState("");

//   // data
//   const [orders, setOrders] = useState([]);
//   const [recommended, setRecommended] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(true);

//   const bgMain = darkMode ? "bg-dark text-light" : "bg-light text-dark";
//   const cardBg = darkMode ? "bg-secondary" : "bg-white";

//   // Keep sidebar always open on desktop (>=992px)
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 992) {
//         setSidebarOpen(true);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     fetchDashboardData();
//     fetchProfile();
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   const isDesktop = typeof window !== "undefined" && window.innerWidth >= 992;

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const [ordersRes, recRes, doctorsRes, apptsRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/customer/orders`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/medicines/recommended`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/doctors`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/customer/appointments`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       if (ordersRes.ok) setOrders(await ordersRes.json());
//       if (recRes.ok) setRecommended(await recRes.json());
//       if (doctorsRes.ok) setDoctors(await doctorsRes.json());
//       if (apptsRes.ok) setMyAppointments(await apptsRes.json());
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProfile = async () => {
//     try {
//       setProfileLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/customer/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setProfile(data);
//       }
//     } catch (err) {
//       console.error("Profile fetch error:", err);
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handlePrescriptionChange = (e) => {
//     const file = e.target.files?.[0];
//     setUploadMessage("");
//     setPrescriptionFile(file || null);
//     if (file) {
//       setPrescriptionPreview(URL.createObjectURL(file));
//     } else {
//       setPrescriptionPreview(null);
//     }
//   };

//   const handleUploadPrescription = async (e) => {
//     e.preventDefault();
//     setUploadMessage("");

//     if (!user?.name || !user?.email) {
//       setUploadMessage("User details missing. Please login again.");
//       return;
//     }
//     if (!prescriptionFile) {
//       setUploadMessage("Please select a prescription image first.");
//       return;
//     }

//     try {
//       setUploadLoading(true);
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("image", prescriptionFile);
//       formData.append("notes", notes);
//       formData.append("customerName", user.name);
//       formData.append("customerEmail", user.email);

//       const res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setUploadMessage(data.message || "Failed to upload prescription.");
//       } else {
//         setUploadMessage("Prescription uploaded successfully!");
//         setPrescriptionFile(null);
//         setPrescriptionPreview(null);
//         setNotes("");
//       }
//     } catch (err) {
//       setUploadMessage("Something went wrong while uploading prescription.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const reserveAppointment = async (doctor) => {
//     setApptMessage("");
//     if (
//       !apptName.trim() ||
//       !apptAge.trim() ||
//       !apptPhone.trim() ||
//       !apptAddress.trim() ||
//       !apptProvince.trim() ||
//       !apptProblem.trim()
//     ) {
//       setApptMessage("Please fill all appointment form fields.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const selectedSlot = doctor.slots?.[0];
//       if (!selectedSlot) {
//         setApptMessage("No available time slots for this doctor.");
//         return;
//       }

//       const appointmentDate = new Date(doctor.nextSlot);
//       appointmentDate.setHours(0, 0, 0, 0);

//       const payload = {
//         doctor: doctor._id || doctor.id,
//         date: appointmentDate.toISOString(),
//         timeSlot: selectedSlot,
//         notes: apptProblem.trim(),
//         customerDetails: {
//           name: apptName,
//           age: apptAge,
//           phone: apptPhone,
//           address: apptAddress,
//           province: apptProvince,
//         },
//       };

//       const res = await fetch(`${API_BASE_URL}/api/appointments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setApptMessage(data.message || "Failed to reserve appointment.");
//       } else {
//         setApptMessage("Appointment reserved successfully!");
//         setApptName(user?.name || "");
//         setApptAge("");
//         setApptPhone("");
//         setApptAddress("");
//         setApptProvince("");
//         setApptProblem("");
//         fetchDashboardData();
//       }
//     } catch (error) {
//       setApptMessage("Something went wrong reserving appointment.");
//     }
//   };

//   const handlePayNow = (order) => {
//     navigate(
//       `/payment?orderId=${order.id || order._id}&amount=${
//         order.price || order.total
//       }`
//     );
//   };

//   if (loading || profileLoading) {
//     return (
//       <div
//         className={`d-flex min-vh-100 justify-content-center align-items-center ${bgMain}`}
//       >
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   // sidebar nav config with paths
//   const navItems = [
//     {
//       key: "orders",
//       icon: ShoppingCart,
//       label: "My Orders",
//       path: "/customer-dashboard",
//     },
//     {
//       key: "medicines",
//       icon: Package,
//       label: "Medicines",
//       path: "/medicines",
//     },
//     {
//       key: "profile",
//       icon: User,
//       label: "Profile",
//       path: "/profile",
//     },
//     {
//       key: "support",
//       icon: MessageCircle,
//       label: "Support",
//       path: "/support",
//     },
//   ];

//   return (
//     <>
//       {/* Mobile overlay when sidebar open */}
//       {sidebarOpen && !isDesktop && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
//           style={{ zIndex: 1030 }}
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <div
//         className={`d-flex min-vh-100 flex-column ${bgMain}`}
//         style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//       >
//         {/* Mobile top bar */}
//         <header className="d-flex d-lg-none justify-content-between align-items-center bg-dark text-light px-3 py-2 sticky-top">
//           <button
//             className="btn btn-dark"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             aria-label="Toggle Menu"
//           >
//             <Menu size={22} />
//           </button>
//           <span className="fs-5 fw-semibold">MyPharmacy</span>
//         </header>

//         {/* Sidebar */}
//         <aside
//           className={`position-fixed top-0 vh-100 p-3 d-flex flex-column ${cardBg} border-end`}
//           style={{
//             width: "240px",
//             transform:
//               isDesktop || sidebarOpen ? "translateX(0)" : "translateX(-100%)",
//             transition: "transform 0.25s ease-out",
//             zIndex: 1040,
//           }}
//         >
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h1
//               className="h4 text-primary cursor-pointer"
//               onClick={() => {
//                 setActiveNav("orders");
//                 navigate("/customer-dashboard");
//                 if (!isDesktop) setSidebarOpen(false);
//               }}
//             >
//               MyPharmacy
//             </h1>
//             <button
//               className="btn btn-outline-secondary d-lg-none"
//               onClick={() => setSidebarOpen(false)}
//               aria-label="Close Menu"
//             >
//               <X />
//             </button>
//           </div>

//           <nav className="flex-grow-1">
//             <ul className="nav flex-column gap-2">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = activeNav === item.key;
//                 return (
//                   <li key={item.key} className="nav-item">
//                     <button
//                       type="button"
//                       className={`btn btn-toggle align-items-center rounded w-100 text-start ${
//                         isActive ? "bg-primary bg-opacity-10" : ""
//                       }`}
//                       style={{ color: darkMode ? "#eee" : "#111" }}
//                       onClick={() => {
//                         setActiveNav(item.key);
//                         navigate(item.path);
//                         if (!isDesktop) setSidebarOpen(false);
//                       }}
//                     >
//                       <Icon size={20} />
//                       <span className="ms-2">{item.label}</span>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           <div className="mt-auto d-flex flex-column gap-2">
//             <button
//               className="btn btn-outline-primary d-flex align-items-center gap-2"
//               onClick={() => setDarkMode(!darkMode)}
//             >
//               {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//               <span>{darkMode ? "Light" : "Dark"} Mode</span>
//             </button>
//           </div>
//         </aside>

//         {/* Main content */}
//         <main
//           className="flex-grow-1 p-3"
//           style={{
//             marginLeft: isDesktop ? "240px" : 0,
//             transition: "margin-left 0.25s ease-out",
//           }}
//         >
//           {/* Top bar with search and profile */}
//           <div className="d-flex justify-content-between flex-wrap align-items-center mb-4 gap-3">
//             <div className="input-group" style={{ maxWidth: 360 }}>
//               <span className="input-group-text bg-white border-end-0">
//                 <Search size={18} />
//               </span>
//               <input
//                 type="search"
//                 className={`form-control ${
//                   darkMode ? "bg-secondary text-light border-secondary" : ""
//                 }`}
//                 placeholder="Search medicines..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 aria-label="Search medicines"
//               />
//             </div>
//             <div className="d-flex align-items-center gap-3">
//               <Bell
//                 size={20}
//                 className={`cursor-pointer ${
//                   darkMode ? "text-light" : "text-dark"
//                 }`}
//               />
//               <img
//                 src={
//                   profile?.profilePhoto ||
//                   user?.profilePhoto ||
//                   "https://i.pravatar.cc/40"
//                 }
//                 alt="User avatar"
//                 className="rounded-circle border border-primary"
//                 style={{ width: 36, height: 36, cursor: "pointer" }}
//                 onClick={() => setActiveNav("profile")}
//               />
//               <button
//                 className="btn btn-danger d-flex align-items-center gap-1 px-2"
//                 onClick={handleLogout}
//                 aria-label="Logout"
//               >
//                 <LogOut size={16} />
//                 <span className="d-none d-md-inline">Logout</span>
//               </button>
//             </div>
//           </div>

//           {/* Stat cards (wallet card removed) */}
//           <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
//             {[
//               {
//                 title: "Active Orders",
//                 value: orders.filter((o) => o.paymentStatus !== "Paid").length,
//                 icon: <ShoppingCart size={28} color="#3b82f6" />,
//               },
//               {
//                 title: "Loyalty Points",
//                 value: 125,
//                 icon: <HeartPulse size={28} color="#ec4899" />,
//               },
//               {
//                 title: "Appointments",
//                 value: myAppointments.length,
//                 icon: <Calendar size={28} color="#eab308" />,
//               },
//             ].map((card) => (
//               <div key={card.title} className="col">
//                 <div
//                   className={`${cardBg} rounded-3 p-3 d-flex justify-content-between align-items-center shadow-sm`}
//                   style={{ minHeight: "100px" }}
//                 >
//                   <div>
//                     <p className="mb-1 text-muted small">{card.title}</p>
//                     <h3 className="mb-0 fw-semibold">{card.value}</h3>
//                   </div>
//                   {card.icon}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* ORDERS SECTION */}
//           {activeNav === "orders" && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">My Orders</h2>
//               {orders.length === 0 ? (
//                 <p>No orders found.</p>
//               ) : (
//                 <div className="table-responsive">
//                   <table
//                     className={`table table-striped align-middle ${
//                       darkMode ? "table-dark" : ""
//                     }`}
//                   >
//                     <thead>
//                       <tr>
//                         <th>Order ID</th>
//                         <th>Medicine</th>
//                         <th>Price</th>
//                         <th>Status</th>
//                         <th>Date</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {orders.map((order) => (
//                         <tr key={order._id || order.id}>
//                           <td>#{order.id || order._id}</td>
//                           <td>
//                             {order.medicine || order.medicines?.join(", ")}
//                           </td>
//                           <td>₹{order.price || order.total}</td>
//                           <td>
//                             <span className="badge bg-info">
//                               {order.status}
//                             </span>
//                           </td>
//                           <td>
//                             {order.date
//                               ? new Date(order.date).toLocaleDateString()
//                               : "—"}
//                           </td>
//                           <td>
//                             {order.paymentStatus !== "Paid" && (
//                               <button
//                                 className="btn btn-primary btn-sm"
//                                 onClick={() => handlePayNow(order)}
//                               >
//                                 Pay Now
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>
//           )}

//           {/* MEDICINES SECTION */}
//           {activeNav === "medicines" && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">Recommended Medicines</h2>
//               {recommended.length === 0 ? (
//                 <p>No recommended medicines available.</p>
//               ) : (
//                 <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3">
//                   {recommended.map((med) => (
//                     <div
//                       key={med._id || med.id}
//                       className="col text-center p-3 border rounded cursor-pointer"
//                     >
//                       <img
//                         src={
//                           med.image ||
//                           "https://cdn-icons-png.flaticon.com/512/3050/3050525.png"
//                         }
//                         alt={med.name}
//                         className="img-fluid mb-2"
//                         style={{ maxHeight: "70px", objectFit: "contain" }}
//                       />
//                       <h5 className="fs-6">{med.name}</h5>
//                       <p className="mb-0 text-primary fw-bold">₹{med.price}</p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </section>
//           )}

//           {/* PROFILE SECTION */}
//           {activeNav === "profile" && profile && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">My Profile</h2>
//               <div className="row g-3">
//                 <div className="col-md-6">
//                   <p>
//                     <strong>Name:</strong> {user?.name}
//                   </p>
//                 </div>
//                 <div className="col-md-6">
//                   <p>
//                     <strong>Email:</strong> {user?.email}
//                   </p>
//                 </div>
//                 <div className="col-md-6">
//                   <p>
//                     <strong>Phone:</strong> {profile.phone || "-"}
//                   </p>
//                 </div>
//                 <div className="col-md-6">
//                   <p>
//                     <strong>Address:</strong>{" "}
//                     {[
//                       profile.address?.street,
//                       profile.address?.city,
//                       profile.address?.province,
//                       profile.address?.postalCode,
//                     ]
//                       .filter(Boolean)
//                       .join(", ") || "-"}
//                   </p>
//                 </div>
//               </div>
//               <button className="btn btn-primary">Edit Profile</button>
//             </section>
//           )}

//           {/* SUPPORT SECTION */}
//           {activeNav === "support" && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">Support</h2>
//               <p>
//                 For support, please contact us by email at{" "}
//                 <a href="mailto:support@mypharmacy.com">
//                   support@mypharmacy.com
//                 </a>{" "}
//                 or call (123) 456-7890.
//               </p>
//               <p>
//                 We are here to help you with any issues or questions about your
//                 orders, prescriptions, or appointments.
//               </p>
//             </section>
//           )}

//           {/* Prescription upload */}
//           <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//             <h3 className="mb-3">Upload Doctor's Prescription</h3>
//             <div
//               className="border border-primary border-dashed rounded-3 d-flex flex-column align-items-center justify-content-center p-4"
//               role="button"
//               tabIndex={0}
//               onClick={() =>
//                 document.getElementById("prescription-file")?.click()
//               }
//               onKeyPress={(e) =>
//                 e.key === "Enter" &&
//                 document.getElementById("prescription-file")?.click()
//               }
//             >
//               <Upload size={40} color="#3b82f6" />
//               <p className="mt-2 text-secondary">
//                 Click to select a prescription image (JPG, PNG)
//               </p>
//               <input
//                 id="prescription-file"
//                 type="file"
//                 accept="image/*"
//                 className="d-none"
//                 onChange={handlePrescriptionChange}
//               />
//               {prescriptionPreview && (
//                 <img
//                   src={prescriptionPreview}
//                   alt="Prescription preview"
//                   className="mt-3 rounded-3 shadow"
//                   style={{
//                     maxWidth: "160px",
//                     maxHeight: "160px",
//                     objectFit: "cover",
//                   }}
//                 />
//               )}
//             </div>
//             <form
//               onSubmit={handleUploadPrescription}
//               className="mt-3 d-flex flex-column gap-2"
//             >
//               <textarea
//                 className="form-control"
//                 placeholder="Notes for pharmacist (optional)"
//                 rows={4}
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//               />
//               <button
//                 type="submit"
//                 className="btn btn-primary rounded-pill"
//                 disabled={uploadLoading}
//               >
//                 {uploadLoading ? "Uploading..." : "Upload Prescription"}
//               </button>
//             </form>
//             {uploadMessage && (
//               <div
//                 className={`mt-2 small ${
//                   uploadMessage.includes("success")
//                     ? "text-success"
//                     : "text-danger"
//                 }`}
//               >
//                 {uploadMessage}
//               </div>
//             )}
//           </section>

//           {/* Doctor Appointments */}
//           <section className="row g-4 mb-4">
//             <div className={`col-12 ${cardBg} rounded-3 p-4 shadow-sm`}>
//               <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
//                 <h2 className="mb-0 d-flex align-items-center gap-2">
//                   <Stethoscope size={20} />
//                   Doctor Appointments
//                 </h2>
//                 <button
//                   className="btn btn-primary rounded-pill px-4"
//                   onClick={() => navigate("/customer-appointments")}
//                 >
//                   Book Now <Calendar className="ms-1" size={16} />
//                 </button>
//               </div>

//               <div className="row g-4">
//                 {/* Quick Doctor Preview */}
//                 <div className="col-md-6">
//                   <div className="text-center p-4 border rounded-3 h-100 d-flex flex-column justify-content-center">
//                     <div
//                       className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
//                       style={{ width: 80, height: 80 }}
//                     >
//                       <Stethoscope size={32} />
//                     </div>
//                     <h4 className="mb-2">Available Doctors</h4>
//                     <p className="text-muted mb-3">
//                       Browse specialists and book appointments online
//                     </p>
//                     <div className="d-flex flex-column gap-2 small">
//                       {doctors.slice(0, 3).map((d) => (
//                         <div
//                           key={d._id || d.id}
//                           className="d-flex align-items-center gap-2 p-2 bg-light rounded"
//                         >
//                           <div className="fw-bold text-truncate flex-grow-1">
//                             {d.name}
//                           </div>
//                           <span className="badge bg-success">
//                             {d.speciality}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* My Appointments Preview */}
//                 <div className="col-md-6">
//                   <div className="text-center p-4 border rounded-3 h-100 d-flex flex-column justify-content-center position-relative">
//                     <div
//                       className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
//                       style={{ width: 80, height: 80 }}
//                     >
//                       <Calendar size={32} />
//                     </div>
//                     <h4 className="mb-2">My Appointments</h4>
//                     <p className="text-muted mb-3">
//                       {myAppointments.length > 0
//                         ? `${myAppointments.length} appointment${
//                             myAppointments.length !== 1 ? "s" : ""
//                           }`
//                         : "No upcoming appointments"}
//                     </p>
//                     {myAppointments.slice(0, 2).map((appt) => (
//                       <div
//                         key={appt._id}
//                         className="small text-start mb-2 p-2 bg-light rounded"
//                       >
//                         <div className="fw-medium">
//                           {new Date(appt.date).toLocaleDateString()}
//                         </div>
//                         <div className="text-muted">
//                           {appt.doctor?.name} - {appt.timeSlot}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="text-center mt-4 pt-3 border-top">
//                 <small className="text-muted me-2">Need help?</small>
//                 <button
//                   className="btn btn-link p-0 text-primary fw-medium"
//                   onClick={() => navigate("/customer-appointments")}
//                 >
//                   View all appointments →
//                 </button>
//               </div>
//             </div>
//           </section>
//         </main>
//       </div>
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
//   CreditCard,
//   X,
//   Sun,
//   Moon,
//   Calendar,
//   Stethoscope,
//   LogOut,
//   Menu,
//   Upload,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const API_BASE_URL = "http://localhost:5000/api";

// // Responsive hook similar to a media query
// const useIsDesktop = () => {
//   const getValue = () =>
//     typeof window !== "undefined" ? window.innerWidth >= 992 : true;

//   const [isDesktop, setIsDesktop] = useState(getValue);

//   useEffect(() => {
//     const handleResize = () => setIsDesktop(getValue());
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return isDesktop;
// };

// const CustomerDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const isDesktop = useIsDesktop();

//   // layout / ui
//   const [sidebarOpen, setSidebarOpen] = useState(
//     typeof window !== "undefined" ? window.innerWidth >= 992 : true
//   );
//   const [darkMode, setDarkMode] = useState(false);
//   const [activeNav, setActiveNav] = useState("orders");
//   const [searchTerm, setSearchTerm] = useState("");

//   // modals
//   const [showPaymentModal, setShowPaymentModal] = useState(false);

//   // prescription upload
//   const [prescriptionFile, setPrescriptionFile] = useState(null);
//   const [prescriptionPreview, setPrescriptionPreview] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // payments
//   const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

//   // appointment form
//   const [apptName, setApptName] = useState(user?.name || "");
//   const [apptAge, setApptAge] = useState("");
//   const [apptPhone, setApptPhone] = useState("");
//   const [apptAddress, setApptAddress] = useState("");
//   const [apptProvince, setApptProvince] = useState("");
//   const [apptProblem, setApptProblem] = useState("");
//   const [apptMessage, setApptMessage] = useState("");

//   // data
//   const [orders, setOrders] = useState([]);
//   const [recommended, setRecommended] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [myAppointments, setMyAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(true);

//   const bgMain = darkMode ? "bg-dark text-light" : "bg-light text-dark";
//   const cardBg = darkMode ? "bg-secondary" : "bg-white";

//   // keep sidebar always open on desktop
//   useEffect(() => {
//     if (isDesktop) setSidebarOpen(true);
//   }, [isDesktop]);

//   useEffect(() => {
//     fetchDashboardData();
//     fetchProfile();
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const [ordersRes, recRes, doctorsRes, apptsRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/customer/orders`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/medicines/recommended`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/doctors`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_BASE_URL}/customer/appointments`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       if (ordersRes.ok) setOrders(await ordersRes.json());
//       if (recRes.ok) setRecommended(await recRes.json());
//       if (doctorsRes.ok) setDoctors(await doctorsRes.json());
//       if (apptsRes.ok) setMyAppointments(await apptsRes.json());
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProfile = async () => {
//     try {
//       setProfileLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/customer/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setProfile(data);
//       }
//     } catch (err) {
//       console.error("Profile fetch error:", err);
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handlePrescriptionChange = (e) => {
//     const file = e.target.files?.[0];
//     setUploadMessage("");
//     setPrescriptionFile(file || null);
//     if (file) {
//       setPrescriptionPreview(URL.createObjectURL(file));
//     } else {
//       setPrescriptionPreview(null);
//     }
//   };

//   const handleUploadPrescription = async (e) => {
//     e.preventDefault();
//     setUploadMessage("");

//     if (!user?.name || !user?.email) {
//       setUploadMessage("User details missing. Please login again.");
//       return;
//     }
//     if (!prescriptionFile) {
//       setUploadMessage("Please select a prescription image first.");
//       return;
//     }

//     try {
//       setUploadLoading(true);
//       const token = localStorage.getItem("token");
//       const formData = new FormData();
//       formData.append("image", prescriptionFile);
//       formData.append("notes", notes);
//       formData.append("customerName", user.name);
//       formData.append("customerEmail", user.email);

//       const res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setUploadMessage(data.message || "Failed to upload prescription.");
//       } else {
//         setUploadMessage("Prescription uploaded successfully!");
//         setPrescriptionFile(null);
//         setPrescriptionPreview(null);
//         setNotes("");
//       }
//     } catch (err) {
//       setUploadMessage("Something went wrong while uploading prescription.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const reserveAppointment = async (doctor) => {
//     setApptMessage("");
//     if (
//       !apptName.trim() ||
//       !apptAge.trim() ||
//       !apptPhone.trim() ||
//       !apptAddress.trim() ||
//       !apptProvince.trim() ||
//       !apptProblem.trim()
//     ) {
//       setApptMessage("Please fill all appointment form fields.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const selectedSlot = doctor.slots?.[0];
//       if (!selectedSlot) {
//         setApptMessage("No available time slots for this doctor.");
//         return;
//       }

//       const appointmentDate = new Date(doctor.nextSlot);
//       appointmentDate.setHours(0, 0, 0, 0);

//       const payload = {
//         doctor: doctor._id || doctor.id,
//         date: appointmentDate.toISOString(),
//         timeSlot: selectedSlot,
//         notes: apptProblem.trim(),
//         customerDetails: {
//           name: apptName,
//           age: apptAge,
//           phone: apptPhone,
//           address: apptAddress,
//           province: apptProvince,
//         },
//       };

//       const res = await fetch(`${API_BASE_URL}/api/appointments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setApptMessage(data.message || "Failed to reserve appointment.");
//       } else {
//         setApptMessage("Appointment reserved successfully!");
//         setApptName(user?.name || "");
//         setApptAge("");
//         setApptPhone("");
//         setApptAddress("");
//         setApptProvince("");
//         setApptProblem("");
//         fetchDashboardData();
//       }
//     } catch (error) {
//       setApptMessage("Something went wrong reserving appointment.");
//     }
//   };

//   const handlePayNow = (order) => {
//     navigate(
//       `/payment?orderId=${order.id || order._id}&amount=${
//         order.price || order.total
//       }`
//     );
//   };

//   if (loading || profileLoading) {
//     return (
//       <div
//         className={`d-flex min-vh-100 justify-content-center align-items-center ${bgMain}`}
//       >
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   const navItems = [
//     {
//       key: "orders",
//       icon: ShoppingCart,
//       label: "My Orders",
//       path: "/customer-dashboard",
//     },
//     {
//       key: "medicines",
//       icon: Package,
//       label: "Medicines",
//       path: "/medicines",
//     },
//     {
//       key: "profile",
//       icon: User,
//       label: "Profile",
//       path: "/profile",
//     },
//     {
//       key: "support",
//       icon: MessageCircle,
//       label: "Support",
//       path: "/support",
//     },
//   ];

//   return (
//     <>
//       {/* Mobile overlay when sidebar open */}
//       {sidebarOpen && !isDesktop && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
//           style={{ zIndex: 1030 }}
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <div
//         className={`d-flex min-vh-100 flex-column ${bgMain}`}
//         style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//       >
//         {/* Mobile top bar */}
//         <header className="d-flex d-lg-none justify-content-between align-items-center bg-dark text-light px-3 py-2 sticky-top">
//           <button
//             className="btn btn-dark"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             aria-label="Toggle Menu"
//           >
//             <Menu size={22} />
//           </button>
//           <span className="fs-5 fw-semibold">MyPharmacy</span>
//         </header>

//         {/* Sidebar */}
//         <aside
//           className={`position-fixed top-0 vh-100 p-3 d-flex flex-column ${cardBg} border-end`}
//           style={{
//             width: "240px",
//             transform:
//               isDesktop || sidebarOpen ? "translateX(0)" : "translateX(-100%)",
//             transition: "transform 0.25s ease-out",
//             zIndex: 1040,
//           }}
//         >
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h1
//               className="h4 text-primary cursor-pointer"
//               onClick={() => {
//                 setActiveNav("orders");
//                 navigate("/customer-dashboard");
//                 if (!isDesktop) setSidebarOpen(false);
//               }}
//             >
//               MyPharmacy
//             </h1>
//             <button
//               className="btn btn-outline-secondary d-lg-none"
//               onClick={() => setSidebarOpen(false)}
//               aria-label="Close Menu"
//             >
//               <X />
//             </button>
//           </div>

//           <nav className="flex-grow-1">
//             <ul className="nav flex-column gap-2">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = activeNav === item.key;
//                 return (
//                   <li key={item.key} className="nav-item">
//                     <button
//                       type="button"
//                       className={`btn btn-toggle align-items-center rounded w-100 text-start ${
//                         isActive ? "bg-primary bg-opacity-10" : ""
//                       }`}
//                       style={{ color: darkMode ? "#eee" : "#111" }}
//                       onClick={() => {
//                         setActiveNav(item.key);
//                         navigate(item.path);
//                         if (!isDesktop) setSidebarOpen(false);
//                       }}
//                     >
//                       <Icon size={20} />
//                       <span className="ms-2">{item.label}</span>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           <div className="mt-auto d-flex flex-column gap-2">
//             <button
//               className="btn btn-outline-primary d-flex align-items-center gap-2"
//               onClick={() => setDarkMode(!darkMode)}
//             >
//               {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//               <span>{darkMode ? "Light" : "Dark"} Mode</span>
//             </button>
//           </div>
//         </aside>

//         {/* Main content; on desktop, shifted to make space for fixed sidebar */}
//         <main
//           className="flex-grow-1 p-3"
//           style={{
//             marginLeft: isDesktop ? "240px" : 0,
//             transition: "margin-left 0.25s ease-out",
//           }}
//         >
//           {/* Top bar with search and profile */}
//           <div className="d-flex justify-content-between flex-wrap align-items-center mb-4 gap-3">
//             <div className="input-group" style={{ maxWidth: 360 }}>
//               <span className="input-group-text bg-white border-end-0">
//                 <Search size={18} />
//               </span>
//               <input
//                 type="search"
//                 className={`form-control ${
//                   darkMode ? "bg-secondary text-light border-secondary" : ""
//                 }`}
//                 placeholder="Search medicines..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 aria-label="Search medicines"
//               />
//             </div>
//             <div className="d-flex align-items-center gap-3">
//               <Bell
//                 size={20}
//                 className={`cursor-pointer ${
//                   darkMode ? "text-light" : "text-dark"
//                 }`}
//               />
//               <img
//                 src={
//                   profile?.profilePhoto ||
//                   user?.profilePhoto ||
//                   "https://i.pravatar.cc/40"
//                 }
//                 alt="User avatar"
//                 className="rounded-circle border border-primary"
//                 style={{ width: 36, height: 36, cursor: "pointer" }}
//                 onClick={() => setActiveNav("profile")}
//               />
//               <button
//                 className="btn btn-danger d-flex align-items-center gap-1 px-2"
//                 onClick={handleLogout}
//                 aria-label="Logout"
//               >
//                 <LogOut size={16} />
//                 <span className="d-none d-md-inline">Logout</span>
//               </button>
//             </div>
//           </div>

//           {/* Stat cards */}
//           <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
//             {[
//               {
//                 title: "Active Orders",
//                 value: orders.filter((o) => o.paymentStatus !== "Paid").length,
//                 icon: <ShoppingCart size={28} color="#3b82f6" />,
//               },
//               {
//                 title: "Loyalty Points",
//                 value: 125,
//                 icon: <HeartPulse size={28} color="#ec4899" />,
//               },
//               {
//                 title: "Appointments",
//                 value: myAppointments.length,
//                 icon: <Calendar size={28} color="#eab308" />,
//               },
//             ].map((card) => (
//               <div key={card.title} className="col">
//                 <div
//                   className={`${cardBg} rounded-3 p-3 d-flex justify-content-between align-items-center shadow-sm`}
//                   style={{ minHeight: "100px" }}
//                 >
//                   <div>
//                     <p className="mb-1 text-muted small">{card.title}</p>
//                     <h3 className="mb-0 fw-semibold">{card.value}</h3>
//                   </div>
//                   {card.icon}
//                 </div>
//               </div>
//             ))}
//           </div>

//            {/* ORDERS SECTION */}
//           {activeNav === "orders" && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">My Orders</h2>
//               {orders.length === 0 ? (
//                 <p>No orders found.</p>
//               ) : (
//                 <div className="table-responsive">
//                   <table
//                     className={`table table-striped align-middle ${
//                       darkMode ? "table-dark" : ""
//                     }`}
//                   >
//                     <thead>
//                       <tr>
//                         <th>Order ID</th>
//                         <th>Medicine</th>
//                         <th>Price</th>
//                         <th>Status</th>
//                         <th>Date</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {orders.map((order) => (
//                         <tr key={order._id || order.id}>
//                           <td>#{order.id || order._id}</td>
//                           <td>
//                             {order.medicine || order.medicines?.join(", ")}
//                           </td>
//                           <td>₹{order.price || order.total}</td>
//                           <td>
//                             <span className="badge bg-info">
//                               {order.status}
//                             </span>
//                           </td>
//                           <td>
//                             {order.date
//                               ? new Date(order.date).toLocaleDateString()
//                               : "—"}
//                           </td>
//                           <td>
//                             {order.paymentStatus !== "Paid" && (
//                               <button
//                                 className="btn btn-primary btn-sm"
//                                 onClick={() => handlePayNow(order)}
//                               >
//                                 Pay Now
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>
//           )}

//           {/* MEDICINES SECTION */}
//           {activeNav === "medicines" && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">Recommended Medicines</h2>
//               {recommended.length === 0 ? (
//                 <p>No recommended medicines available.</p>
//               ) : (
//                 <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3">
//                   {recommended.map((med) => (
//                     <div
//                       key={med._id || med.id}
//                       className="col text-center p-3 border rounded cursor-pointer"
//                     >
//                       <img
//                         src={
//                           med.image ||
//                           "https://cdn-icons-png.flaticon.com/512/3050/3050525.png"
//                         }
//                         alt={med.name}
//                         className="img-fluid mb-2"
//                         style={{ maxHeight: "70px", objectFit: "contain" }}
//                       />
//                       <h5 className="fs-6">{med.name}</h5>
//                       <p className="mb-0 text-primary fw-bold">₹{med.price}</p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </section>
//           )}

//           {/* PROFILE SECTION */}
//           {activeNav === "profile" && profile && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">My Profile</h2>
//               <div className="row g-3">
//                 <div className="col-md-6">
//                   <p>
//                     <strong>Name:</strong> {user?.name}
//                   </p>
//                 </div>
//                 <div className="col-md-6">
//                   <p>
//                     <strong>Email:</strong> {user?.email}
//                   </p>
//                 </div>
//                 <div className="col-md-6">
//                   <p>
//                     <strong>Phone:</strong> {profile.phone || "-"}
//                   </p>
//                 </div>
//                 <div className="col-md-6">
//                   <p>
//                     <strong>Address:</strong>{" "}
//                     {[
//                       profile.address?.street,
//                       profile.address?.city,
//                       profile.address?.province,
//                       profile.address?.postalCode,
//                     ]
//                       .filter(Boolean)
//                       .join(", ") || "-"}
//                   </p>
//                 </div>
//               </div>
//               <button className="btn btn-primary">Edit Profile</button>
//             </section>
//           )}

//           {/* SUPPORT SECTION */}
//           {activeNav === "support" && (
//             <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//               <h2 className="mb-4">Support</h2>
//               <p>
//                 For support, please contact us by email at{" "}
//                 <a href="mailto:support@mypharmacy.com">
//                   support@mypharmacy.com
//                 </a>{" "}
//                 or call (123) 456-7890.
//               </p>
//               <p>
//                 We are here to help you with any issues or questions about your
//                 orders, prescriptions, or appointments.
//               </p>
//             </section>
//           )}

//           {/* Prescription upload section (visible on all tabs) */}
//           <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
//             <h3 className="mb-3">Upload Doctor's Prescription</h3>
//             <div
//               className="border border-primary border-dashed rounded-3 d-flex flex-column align-items-center justify-content-center p-4"
//               role="button"
//               tabIndex={0}
//               onClick={() =>
//                 document.getElementById("prescription-file")?.click()
//               }
//               onKeyPress={(e) =>
//                 e.key === "Enter" &&
//                 document.getElementById("prescription-file")?.click()
//               }
//             >
//               <Upload size={40} color="#3b82f6" />
//               <p className="mt-2 text-secondary">
//                 Click to select a prescription image (JPG, PNG)
//               </p>
//               <input
//                 id="prescription-file"
//                 type="file"
//                 accept="image/*"
//                 className="d-none"
//                 onChange={handlePrescriptionChange}
//               />
//               {prescriptionPreview && (
//                 <img
//                   src={prescriptionPreview}
//                   alt="Prescription preview"
//                   className="mt-3 rounded-3 shadow"
//                   style={{
//                     maxWidth: "160px",
//                     maxHeight: "160px",
//                     objectFit: "cover",
//                   }}
//                 />
//               )}
//             </div>
//             <form
//               onSubmit={handleUploadPrescription}
//               className="mt-3 d-flex flex-column gap-2"
//             >
//               <textarea
//                 className="form-control"
//                 placeholder="Notes for pharmacist (optional)"
//                 rows={4}
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//               />
//               <button
//                 type="submit"
//                 className="btn btn-primary rounded-pill"
//                 disabled={uploadLoading}
//               >
//                 {uploadLoading ? "Uploading..." : "Upload Prescription"}
//               </button>
//             </form>
//             {uploadMessage && (
//               <div
//                 className={`mt-2 small ${
//                   uploadMessage.includes("success")
//                     ? "text-success"
//                     : "text-danger"
//                 }`}
//               >
//                 {uploadMessage}
//               </div>
//             )}
//           </section>

//           {/* Doctor Appointments */}
//           <section className="row g-4 mb-4">
//             <div className={`col-12 ${cardBg} rounded-3 p-4 shadow-sm`}>
//               <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
//                 <h2 className="mb-0 d-flex align-items-center gap-2">
//                   <Stethoscope size={20} />
//                   Doctor Appointments
//                 </h2>
//                 <button
//                   className="btn btn-primary rounded-pill px-4"
//                   onClick={() => navigate("/customer-appointments")}
//                 >
//                   Book Now <Calendar className="ms-1" size={16} />
//                 </button>
//               </div>

//               <div className="row g-4">
//                 {/* Quick Doctor Preview */}
//                 <div className="col-md-6">
//                   <div className="text-center p-4 border rounded-3 h-100 d-flex flex-column justify-content-center">
//                     <div
//                       className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
//                       style={{ width: 80, height: 80 }}
//                     >
//                       <Stethoscope size={32} />
//                     </div>
//                     <h4 className="mb-2">Available Doctors</h4>
//                     <p className="text-muted mb-3">
//                       Browse specialists and book appointments online
//                     </p>
//                     <div className="d-flex flex-column gap-2 small">
//                       {doctors.slice(0, 3).map((d) => (
//                         <div
//                           key={d._id || d.id}
//                           className="d-flex align-items-center gap-2 p-2 bg-light rounded"
//                         >
//                           <div className="fw-bold text-truncate flex-grow-1">
//                             {d.name}
//                           </div>
//                           <span className="badge bg-success">
//                             {d.speciality}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* My Appointments Preview */}
//                 <div className="col-md-6">
//                   <div className="text-center p-4 border rounded-3 h-100 d-flex flex-column justify-content-center position-relative">
//                     <div
//                       className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
//                       style={{ width: 80, height: 80 }}
//                     >
//                       <Calendar size={32} />
//                     </div>
//                     <h4 className="mb-2">My Appointments</h4>
//                     <p className="text-muted mb-3">
//                       {myAppointments.length > 0
//                         ? `${myAppointments.length} appointment${
//                             myAppointments.length !== 1 ? "s" : ""
//                           }`
//                         : "No upcoming appointments"}
//                     </p>
//                     {myAppointments.slice(0, 2).map((appt) => (
//                       <div
//                         key={appt._id}
//                         className="small text-start mb-2 p-2 bg-light rounded"
//                       >
//                         <div className="fw-medium">
//                           {new Date(appt.date).toLocaleDateString()}
//                         </div>
//                         <div className="text-muted">
//                           {appt.doctor?.name} - {appt.timeSlot}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="text-center mt-4 pt-3 border-top">
//                 <small className="text-muted me-2">Need help?</small>
//                 <button
//                   className="btn btn-link p-0 text-primary fw-medium"
//                   onClick={() => navigate("/customer-appointments")}
//                 >
//                   View all appointments →
//                 </button>
//               </div>
//             </div>
//           </section>
//         </main>
//       </div>
//     </>
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
  CreditCard,
  X,
  Sun,
  Moon,
  Calendar,
  Stethoscope,
  LogOut,
  Menu,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // layout / ui
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 992 : true
  );
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState("orders");
  const [searchTerm, setSearchTerm] = useState("");

  // modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // prescription upload
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [notes, setNotes] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  // payments
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // appointment form
  const [apptName, setApptName] = useState(user?.name || "");
  const [apptAge, setApptAge] = useState("");
  const [apptPhone, setApptPhone] = useState("");
  const [apptAddress, setApptAddress] = useState("");
  const [apptProvince, setApptProvince] = useState("");
  const [apptProblem, setApptProblem] = useState("");
  const [apptMessage, setApptMessage] = useState("");

  // data
  const [orders, setOrders] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const bgMain = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const cardBg = darkMode ? "bg-secondary" : "bg-white";

  // Keep sidebar always open on desktop (>=992px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 992;

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [ordersRes, recRes, doctorsRes, apptsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/customer/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/medicines/recommended`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/doctors`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/customer/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (recRes.ok) setRecommended(await recRes.json());
      if (doctorsRes.ok) setDoctors(await doctorsRes.json());
      if (apptsRes.ok) setMyAppointments(await apptsRes.json());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/customer/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handlePrescriptionChange = (e) => {
    const file = e.target.files?.[0];
    setUploadMessage("");
    setPrescriptionFile(file || null);
    if (file) {
      setPrescriptionPreview(URL.createObjectURL(file));
    } else {
      setPrescriptionPreview(null);
    }
  };

  const handleUploadPrescription = async (e) => {
    e.preventDefault();
    setUploadMessage("");

    if (!user?.name || !user?.email) {
      setUploadMessage("User details missing. Please login again.");
      return;
    }
    if (!prescriptionFile) {
      setUploadMessage("Please select a prescription image first.");
      return;
    }

    try {
      setUploadLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", prescriptionFile);
      formData.append("notes", notes);
      formData.append("customerName", user.name);
      formData.append("customerEmail", user.email);

      const res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadMessage(data.message || "Failed to upload prescription.");
      } else {
        setUploadMessage("Prescription uploaded successfully!");
        setPrescriptionFile(null);
        setPrescriptionPreview(null);
        setNotes("");
      }
    } catch (err) {
      setUploadMessage("Something went wrong while uploading prescription.");
    } finally {
      setUploadLoading(false);
    }
  };

  const reserveAppointment = async (doctor) => {
    setApptMessage("");
    if (
      !apptName.trim() ||
      !apptAge.trim() ||
      !apptPhone.trim() ||
      !apptAddress.trim() ||
      !apptProvince.trim() ||
      !apptProblem.trim()
    ) {
      setApptMessage("Please fill all appointment form fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const selectedSlot = doctor.slots?.[0];
      if (!selectedSlot) {
        setApptMessage("No available time slots for this doctor.");
        return;
      }

      const appointmentDate = new Date(doctor.nextSlot);
      appointmentDate.setHours(0, 0, 0, 0);

      const payload = {
        doctor: doctor._id || doctor.id,
        date: appointmentDate.toISOString(),
        timeSlot: selectedSlot,
        notes: apptProblem.trim(),
        customerDetails: {
          name: apptName,
          age: apptAge,
          phone: apptPhone,
          address: apptAddress,
          province: apptProvince,
        },
      };

      const res = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setApptMessage(data.message || "Failed to reserve appointment.");
      } else {
        setApptMessage("Appointment reserved successfully!");
        setApptName(user?.name || "");
        setApptAge("");
        setApptPhone("");
        setApptAddress("");
        setApptProvince("");
        setApptProblem("");
        fetchDashboardData();
      }
    } catch (error) {
      setApptMessage("Something went wrong reserving appointment.");
    }
  };

  const handlePayNow = (order) => {
    navigate(
      `/payment?orderId=${order.id || order._id}&amount=${
        order.price || order.total
      }`
    );
  };

  if (loading || profileLoading) {
    return (
      <div
        className={`d-flex min-vh-100 justify-content-center align-items-center ${bgMain}`}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // sidebar nav config with paths
  const navItems = [
    {
      key: "orders",
      icon: ShoppingCart,
      label: "My Orders",
      path: "/customer-dashboard",
    },
    {
      key: "medicines",
      icon: Package,
      label: "Medicines",
      path: "/medicines",
    },
    {
      key: "profile",
      icon: User,
      label: "Profile",
      path: "/profile",
    },
    {
      key: "support",
      icon: MessageCircle,
      label: "Support",
      path: "/support",
    },
  ];

  return (
    <>
      {/* Mobile overlay when sidebar open */}
      {sidebarOpen && !isDesktop && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1030 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`d-flex min-vh-100 flex-column ${bgMain}`}
        style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
      >
        {/* Mobile top bar */}
        <header className="d-flex d-lg-none justify-content-between align-items-center bg-dark text-light px-3 py-2 sticky-top">
          <button
            className="btn btn-dark"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Menu"
          >
            <Menu size={22} />
          </button>
          <span className="fs-5 fw-semibold">MyPharmacy</span>
        </header>

        {/* Sidebar */}
        <aside
          className={`position-fixed top-0 vh-100 p-3 d-flex flex-column ${cardBg} border-end`}
          style={{
            width: "240px",
            transform:
              isDesktop || sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.25s ease-out",
            zIndex: 1040,
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1
              className="h4 text-primary cursor-pointer"
              onClick={() => {
                setActiveNav("orders");
                navigate("/customer-dashboard");
                if (!isDesktop) setSidebarOpen(false);
              }}
            >
              MyPharmacy
            </h1>
            <button
              className="btn btn-outline-secondary d-lg-none"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close Menu"
            >
              <X />
            </button>
          </div>

          <nav className="flex-grow-1">
            <ul className="nav flex-column gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.key;
                return (
                  <li key={item.key} className="nav-item">
                    <button
                      type="button"
                      className={`btn btn-toggle align-items-center rounded w-100 text-start ${
                        isActive ? "bg-primary bg-opacity-10" : ""
                      }`}
                      style={{ color: darkMode ? "#eee" : "#111" }}
                      onClick={() => {
                        setActiveNav(item.key);
                        navigate(item.path);
                        if (!isDesktop) setSidebarOpen(false);
                      }}
                    >
                      <Icon size={20} />
                      <span className="ms-2">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto d-flex flex-column gap-2">
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span>{darkMode ? "Light" : "Dark"} Mode</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main
          className="flex-grow-1 p-3"
          style={{
            marginLeft: isDesktop ? "240px" : 0,
            transition: "margin-left 0.25s ease-out",
          }}
        >
          {/* Top bar with search and profile */}
          <div className="d-flex justify-content-between flex-wrap align-items-center mb-4 gap-3">
            <div className="input-group" style={{ maxWidth: 360 }}>
              <span className="input-group-text bg-white border-end-0">
                <Search size={18} />
              </span>
              <input
                type="search"
                className={`form-control ${
                  darkMode ? "bg-secondary text-light border-secondary" : ""
                }`}
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search medicines"
              />
            </div>
            <div className="d-flex align-items-center gap-3">
              <Bell
                size={20}
                className={`cursor-pointer ${
                  darkMode ? "text-light" : "text-dark"
                }`}
              />
              <img
                src={
                  profile?.profilePhoto ||
                  user?.profilePhoto ||
                  "https://i.pravatar.cc/40"
                }
                alt="User avatar"
                className="rounded-circle border border-primary"
                style={{ width: 36, height: 36, cursor: "pointer" }}
                onClick={() => setActiveNav("profile")}
              />
              <button
                className="btn btn-danger d-flex align-items-center gap-1 px-2"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut size={16} />
                <span className="d-none d-md-inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Stat cards (wallet card removed) */}
          <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
            {[
              {
                title: "Active Orders",
                value: orders.filter((o) => o.paymentStatus !== "Paid").length,
                icon: <ShoppingCart size={28} color="#3b82f6" />,
              },
              {
                title: "Loyalty Points",
                value: 125,
                icon: <HeartPulse size={28} color="#ec4899" />,
              },
              {
                title: "Appointments",
                value: myAppointments.length,
                icon: <Calendar size={28} color="#eab308" />,
              },
            ].map((card) => (
              <div key={card.title} className="col">
                <div
                  className={`${cardBg} rounded-3 p-3 d-flex justify-content-between align-items-center shadow-sm`}
                  style={{ minHeight: "100px" }}
                >
                  <div>
                    <p className="mb-1 text-muted small">{card.title}</p>
                    <h3 className="mb-0 fw-semibold">{card.value}</h3>
                  </div>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>

          {/* ORDERS SECTION */}
          {activeNav === "orders" && (
            <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
              <h2 className="mb-4">My Orders</h2>
              {orders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                <div className="table-responsive">
                  <table
                    className={`table table-striped align-middle ${
                      darkMode ? "table-dark" : ""
                    }`}
                  >
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Medicine</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id || order.id}>
                          <td>#{order.id || order._id}</td>
                          <td>
                            {order.medicine || order.medicines?.join(", ")}
                          </td>
                          <td>₹{order.price || order.total}</td>
                          <td>
                            <span className="badge bg-info">
                              {order.status}
                            </span>
                          </td>
                          <td>
                            {order.date
                              ? new Date(order.date).toLocaleDateString()
                              : "—"}
                          </td>
                          <td>
                            {order.paymentStatus !== "Paid" && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handlePayNow(order)}
                              >
                                Pay Now
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* MEDICINES SECTION */}
          {activeNav === "medicines" && (
            <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
              <h2 className="mb-4">Recommended Medicines</h2>
              {recommended.length === 0 ? (
                <p>No recommended medicines available.</p>
              ) : (
                <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3">
                  {recommended.map((med) => (
                    <div
                      key={med._id || med.id}
                      className="col text-center p-3 border rounded cursor-pointer"
                    >
                      <img
                        src={
                          med.image ||
                          "https://cdn-icons-png.flaticon.com/512/3050/3050525.png"
                        }
                        alt={med.name}
                        className="img-fluid mb-2"
                        style={{ maxHeight: "70px", objectFit: "contain" }}
                      />
                      <h5 className="fs-6">{med.name}</h5>
                      <p className="mb-0 text-primary fw-bold">₹{med.price}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* PROFILE SECTION */}
          {activeNav === "profile" && profile && (
            <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
              <h2 className="mb-4">My Profile</h2>
              <div className="row g-3">
                <div className="col-md-6">
                  <p>
                    <strong>Name:</strong> {user?.name}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Phone:</strong> {profile.phone || "-"}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Address:</strong>{" "}
                    {[
                      profile.address?.street,
                      profile.address?.city,
                      profile.address?.province,
                      profile.address?.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </p>
                </div>
              </div>
              <button className="btn btn-primary">Edit Profile</button>
            </section>
          )}

          {/* SUPPORT SECTION */}
          {activeNav === "support" && (
            <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
              <h2 className="mb-4">Support</h2>
              <p>
                For support, please contact us by email at{" "}
                <a href="mailto:support@mypharmacy.com">
                  support@mypharmacy.com
                </a>{" "}
                or call (123) 456-7890.
              </p>
              <p>
                We are here to help you with any issues or questions about your
                orders, prescriptions, or appointments.
              </p>
            </section>
          )}

          {/* Prescription upload */}
          <section className={`${cardBg} rounded-3 p-4 shadow-sm mb-4`}>
            <h3 className="mb-3">Upload Doctor's Prescription</h3>
            <div
              className="border border-primary border-dashed rounded-3 d-flex flex-column align-items-center justify-content-center p-4"
              role="button"
              tabIndex={0}
              onClick={() =>
                document.getElementById("prescription-file")?.click()
              }
              onKeyPress={(e) =>
                e.key === "Enter" &&
                document.getElementById("prescription-file")?.click()
              }
            >
              <Upload size={40} color="#3b82f6" />
              <p className="mt-2 text-secondary">
                Click to select a prescription image (JPG, PNG)
              </p>
              <input
                id="prescription-file"
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handlePrescriptionChange}
              />
              {prescriptionPreview && (
                <img
                  src={prescriptionPreview}
                  alt="Prescription preview"
                  className="mt-3 rounded-3 shadow"
                  style={{
                    maxWidth: "160px",
                    maxHeight: "160px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
            <form
              onSubmit={handleUploadPrescription}
              className="mt-3 d-flex flex-column gap-2"
            >
              <textarea
                className="form-control"
                placeholder="Notes for pharmacist (optional)"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary rounded-pill"
                disabled={uploadLoading}
              >
                {uploadLoading ? "Uploading..." : "Upload Prescription"}
              </button>
            </form>
            {uploadMessage && (
              <div
                className={`mt-2 small ${
                  uploadMessage.includes("success")
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {uploadMessage}
              </div>
            )}
          </section>

          {/* Doctor Appointments */}
          <section className="row g-4 mb-4">
            <div className={`col-12 ${cardBg} rounded-3 p-4 shadow-sm`}>
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h2 className="mb-0 d-flex align-items-center gap-2">
                  <Stethoscope size={20} />
                  Doctor Appointments
                </h2>
                <button
                  className="btn btn-primary rounded-pill px-4"
                  onClick={() => navigate("/customer-appointments")}
                >
                  Book Now <Calendar className="ms-1" size={16} />
                </button>
              </div>

              <div className="row g-4">
                {/* Quick Doctor Preview */}
                <div className="col-md-6">
                  <div className="text-center p-4 border rounded-3 h-100 d-flex flex-column justify-content-center">
                    <div
                      className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ width: 80, height: 80 }}
                    >
                      <Stethoscope size={32} />
                    </div>
                    <h4 className="mb-2">Available Doctors</h4>
                    <p className="text-muted mb-3">
                      Browse specialists and book appointments online
                    </p>
                    <div className="d-flex flex-column gap-2 small">
                      {doctors.slice(0, 3).map((d) => (
                        <div
                          key={d._id || d.id}
                          className="d-flex align-items-center gap-2 p-2 bg-light rounded"
                        >
                          <div className="fw-bold text-truncate flex-grow-1">
                            {d.name}
                          </div>
                          <span className="badge bg-success">
                            {d.speciality}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* My Appointments Preview */}
                <div className="col-md-6">
                  <div className="text-center p-4 border rounded-3 h-100 d-flex flex-column justify-content-center position-relative">
                    <div
                      className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ width: 80, height: 80 }}
                    >
                      <Calendar size={32} />
                    </div>
                    <h4 className="mb-2">My Appointments</h4>
                    <p className="text-muted mb-3">
                      {myAppointments.length > 0
                        ? `${myAppointments.length} appointment${
                            myAppointments.length !== 1 ? "s" : ""
                          }`
                        : "No upcoming appointments"}
                    </p>
                    {myAppointments.slice(0, 2).map((appt) => (
                      <div
                        key={appt._id}
                        className="small text-start mb-2 p-2 bg-light rounded"
                      >
                        <div className="fw-medium">
                          {new Date(appt.date).toLocaleDateString()}
                        </div>
                        <div className="text-muted">
                          {appt.doctor?.name} - {appt.timeSlot}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center mt-4 pt-3 border-top">
                <small className="text-muted me-2">Need help?</small>
                <button
                  className="btn btn-link p-0 text-primary fw-medium"
                  onClick={() => navigate("/customer-appointments")}
                >
                  View all appointments →
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default CustomerDashboard;
