// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";

// import VerifyOtp from "./pages/VerifyOTP";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import AdminDashboard from "./pages/AdminDashboard"; // still used inside AdminLayout
// import PharmacistDashboard from "./pages/PharmacistDashboard";
// import CustomerDashboard from "./pages/CustomerDashboard";
// import Home from "./pages/Home";
// import Cart from "./pages/Cart";
// import Shipping from "./pages/Shipping";
// import PlaceOrder from "./pages/PlaceOrder";
// import "bootstrap/dist/css/bootstrap.min.css";

// import OrderConfirmation from "./components/OrderConfirm";
// import AdminLogin from "./pages/AdminLogin";
// import AdminResetPassword from "./pages/AdminResetPassword";
// import Payment from "./pages/Payment";

// import AdminLayout from "./pages/AdminLayout";
// import ProfilePage from "./pages/ProfilePage";
// import CustomerAppointments from "./pages/CustomerAppointments";
// // customer medicines listing page
// import CustomerMedicines from "./pages/CustomerMedicines";

// // footer info pages
// import RootLayout from "./layouts/RootLayout";

// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import FAQ from "./pages/FAQ";
// import Support from "./pages/Support";
// import Privacy from "./pages/Privacy";

// // PrivateRoute with role-based access
// const PrivateRoute = ({ children, allowedRoles }) => {
//   const { user, initLoading } = useAuth();

//   if (initLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// // Dashboard Redirector
// const DashboardRedirect = () => {
//   const { user } = useAuth();

//   if (!user) return <Navigate to="/login" replace />;

//   switch (user.role) {
//     case "admin":
//       return <Navigate to="/admin/dashboard" replace />;
//     case "pharmacist":
//     case "staff":
//       return <Navigate to="/pharmacist-dashboard" replace />;
//     case "customer":
//       return <Navigate to="/customer-dashboard" replace />;
//     default:
//       return <Navigate to="/login" replace />;
//   }
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/admin/login" element={<AdminLogin />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/verify-otp" element={<VerifyOtp />} />

//           {/* Public informational pages used by footer */}
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/faq" element={<FAQ />} />
//           <Route path="/support" element={<Support />} />
//           <Route path="/privacy" element={<Privacy />} />

//           {/* Role redirect */}
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute>
//                 <DashboardRedirect />
//               </PrivateRoute>
//             }
//           />

//           {/* Profile (any logged-in user) */}
//           <Route
//             path="/profile"
//             element={
//               <PrivateRoute>
//                 <ProfilePage />
//               </PrivateRoute>
//             }
//           />

//           {/* Checkout flow (customer) */}
//           <Route path="/cart" element={<Cart />} />
//           <Route
//             path="/shipping"
//             element={
//               <PrivateRoute allowedRoles={["customer"]}>
//                 <Shipping />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/payment"
//             element={
//               <PrivateRoute allowedRoles={["customer"]}>
//                 <Payment />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/placeorder"
//             element={
//               <PrivateRoute allowedRoles={["customer"]}>
//                 <PlaceOrder />
//               </PrivateRoute>
//             }
//           />

//           {/* Payment Success */}
//           <Route path="/payment-success" element={<OrderConfirmation />} />

//           {/* Admin section – SINGLE layout with internal routing */}
//           <Route
//             path="/admin/*"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <AdminLayout />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/admin-reset-password"
//             element={<AdminResetPassword />}
//           />

//           {/* Pharmacist / staff */}
//           <Route
//             path="/pharmacist-dashboard"
//             element={
//               <PrivateRoute allowedRoles={["pharmacist", "staff"]}>
//                 <PharmacistDashboard />
//               </PrivateRoute>
//             }
//           />

//           {/* Customer */}
//           <Route
//             path="/customer-dashboard"
//             element={
//               <PrivateRoute allowedRoles={["customer"]}>
//                 <CustomerDashboard />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/customer-appointments"
//             element={
//               <PrivateRoute allowedRoles={["customer"]}>
//                 <CustomerAppointments />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/medicines"
//             element={
//               <PrivateRoute allowedRoles={["customer"]}>
//                 <CustomerMedicines />
//               </PrivateRoute>
//             }
//           />

//           {/* Fallback */}
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";

// import VerifyOtp from "./pages/VerifyOTP";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import AdminDashboard from "./pages/AdminDashboard"; // still used inside AdminLayout
// import PharmacistDashboard from "./pages/PharmacistDashboard";
// import CustomerDashboard from "./pages/CustomerDashboard";
// import Home from "./pages/Home";
// import Cart from "./pages/Cart";
// import Shipping from "./pages/Shipping";
// import PlaceOrder from "./pages/PlaceOrder";
// import "bootstrap/dist/css/bootstrap.min.css";

// import OrderConfirmation from "./components/OrderConfirm";
// import AdminLogin from "./pages/AdminLogin";
// import AdminResetPassword from "./pages/AdminResetPassword";
// import Payment from "./pages/Payment";

// import AdminLayout from "./pages/AdminLayout";
// import ProfilePage from "./pages/ProfilePage";
// import CustomerAppointments from "./pages/CustomerAppointments";
// // customer medicines listing page
// import CustomerMedicines from "./pages/CustomerMedicines";

// // footer info pages and layout
// import RootLayout from "./layouts/RootLayout";

// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import FAQ from "./pages/FAQ";
// import Support from "./pages/Support";
// import Privacy from "./pages/Privacy";

// // PrivateRoute with role-based access
// const PrivateRoute = ({ children, allowedRoles }) => {
//   const { user, initLoading } = useAuth();

//   if (initLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// // Dashboard Redirector
// const DashboardRedirect = () => {
//   const { user } = useAuth();

//   if (!user) return <Navigate to="/login" replace />;

//   switch (user.role) {
//     case "admin":
//       return <Navigate to="/admin/dashboard" replace />;
//     case "pharmacist":
//     case "staff":
//       return <Navigate to="/pharmacist-dashboard" replace />;
//     case "customer":
//       return <Navigate to="/customer-dashboard" replace />;
//     default:
//       return <Navigate to="/login" replace />;
//   }
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <RootLayout>
//           <Routes>
//             {/* Public */}
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/admin/login" element={<AdminLogin />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/verify-otp" element={<VerifyOtp />} />

//             {/* Public informational pages used by footer */}
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/faq" element={<FAQ />} />
//             <Route path="/support" element={<Support />} />
//             <Route path="/privacy" element={<Privacy />} />

//             {/* Role redirect */}
//             <Route
//               path="/dashboard"
//               element={
//                 <PrivateRoute>
//                   <DashboardRedirect />
//                 </PrivateRoute>
//               }
//             />

//             {/* Profile (any logged-in user) */}
//             <Route
//               path="/profile"
//               element={
//                 <PrivateRoute>
//                   <ProfilePage />
//                 </PrivateRoute>
//               }
//             />

//             {/* Checkout flow (customer) */}
//             <Route path="/cart" element={<Cart />} />
//             <Route
//               path="/shipping"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <Shipping />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/payment"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <Payment />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/placeorder"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <PlaceOrder />
//                 </PrivateRoute>
//               }
//             />

//             {/* Payment Success */}
//             <Route path="/payment-success" element={<OrderConfirmation />} />

//             {/* Admin section – SINGLE layout with internal routing */}
//             <Route
//               path="/admin/*"
//               element={
//                 <PrivateRoute allowedRoles={["admin"]}>
//                   <AdminLayout />
//                 </PrivateRoute>
//               }
//             />

//             <Route
//               path="/admin-reset-password"
//               element={<AdminResetPassword />}
//             />

//             {/* Pharmacist / staff */}
//             <Route
//               path="/pharmacist-dashboard"
//               element={
//                 <PrivateRoute allowedRoles={["pharmacist", "staff"]}>
//                   <PharmacistDashboard />
//                 </PrivateRoute>
//               }
//             />

//             {/* Customer */}
//             <Route
//               path="/customer-dashboard"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <CustomerDashboard />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/customer-appointments"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <CustomerAppointments />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/medicines"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <CustomerMedicines />
//                 </PrivateRoute>
//               }
//             />

//             {/* Fallback */}
//             <Route path="*" element={<Navigate to="/login" replace />} />
//           </Routes>
//         </RootLayout>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";

// import VerifyOtp from "./pages/VerifyOTP";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import AdminDashboard from "./pages/AdminDashboard";
// import PharmacistDashboard from "./pages/PharmacistDashboard";
// import CustomerDashboard from "./pages/CustomerDashboard";
// import Home from "./pages/Home";
// import Cart from "./pages/Cart";
// import Shipping from "./pages/Shipping";
// import PlaceOrder from "./pages/PlaceOrder";
// import "bootstrap/dist/css/bootstrap.min.css";

// import OrderConfirmation from "./components/OrderConfirm";
// import AdminLogin from "./pages/AdminLogin";
// import AdminResetPassword from "./pages/AdminResetPassword";
// import Payment from "./pages/Payment";

// import AdminLayout from "./pages/AdminLayout";
// import ProfilePage from "./pages/ProfilePage";
// import CustomerAppointments from "./pages/CustomerAppointments";
// // customer medicines listing page
// import CustomerMedicines from "./pages/CustomerMedicines";

// // footer info pages and layout
// import RootLayout from "./layouts/RootLayout";

// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import FAQ from "./pages/FAQ";
// import Support from "./pages/Support";
// import Privacy from "./pages/Privacy";

// // PrivateRoute with role-based access
// const PrivateRoute = ({ children, allowedRoles }) => {
//   const { user, initLoading } = useAuth();

//   if (initLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// // Dashboard Redirector
// const DashboardRedirect = () => {
//   const { user } = useAuth();

//   if (!user) return <Navigate to="/login" replace />;

//   switch (user.role) {
//     case "admin":
//       return <Navigate to="/admin/dashboard" replace />;
//     case "pharmacist":
//     case "staff":
//       return <Navigate to="/pharmacist-dashboard" replace />;
//     case "customer":
//       return <Navigate to="/customer-dashboard" replace />;
//     default:
//       return <Navigate to="/login" replace />;
//   }
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <RootLayout>
//           <Routes>
//             {/* Public */}
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/admin/login" element={<AdminLogin />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/verify-otp" element={<VerifyOtp />} />

//             {/* Public informational pages used by footer */}
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/faq" element={<FAQ />} />
//             <Route path="/support" element={<Support />} />
//             <Route path="/privacy" element={<Privacy />} />

//             {/* Role redirect */}
//             <Route
//               path="/dashboard"
//               element={
//                 <PrivateRoute>
//                   <DashboardRedirect />
//                 </PrivateRoute>
//               }
//             />

//             {/* Profile (any logged-in user) */}
//             <Route
//               path="/profile"
//               element={
//                 <PrivateRoute>
//                   <ProfilePage />
//                 </PrivateRoute>
//               }
//             />

//             {/* Checkout flow (customer) */}
//             {/* Cart is accessible to everyone, but Checkout button inside it redirects to login */}
//             <Route path="/cart" element={<Cart />} />

//             <Route
//               path="/shipping"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <Shipping />
//                 </PrivateRoute>
//               }
//             />

//             {/* Place Order (Review & Submit) - Critical for buying logic */}
//             <Route
//               path="/placeorder"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <PlaceOrder />
//                 </PrivateRoute>
//               }
//             />

//             {/* Payment (After Order is Created) */}
//             <Route
//               path="/payment"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <Payment />
//                 </PrivateRoute>
//               }
//             />

//             {/* Payment Success */}
//             <Route path="/payment-success" element={<OrderConfirmation />} />

//             {/* Admin section – SINGLE layout with internal routing */}
//             <Route
//               path="/admin/*"
//               element={
//                 <PrivateRoute allowedRoles={["admin"]}>
//                   <AdminLayout />
//                 </PrivateRoute>
//               }
//             />

//             <Route
//               path="/admin-reset-password"
//               element={<AdminResetPassword />}
//             />

//             {/* Pharmacist / staff */}
//             <Route
//               path="/pharmacist-dashboard"
//               element={
//                 <PrivateRoute allowedRoles={["pharmacist", "staff"]}>
//                   <PharmacistDashboard />
//                 </PrivateRoute>
//               }
//             />

//             {/* Customer */}
//             <Route
//               path="/customer-dashboard"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <CustomerDashboard />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/customer-appointments"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <CustomerAppointments />
//                 </PrivateRoute>
//               }
//             />

//             {/* UPDATED: Matches the 'Go Back' link in Cart */}
//             <Route
//               path="/customer-medicines"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <CustomerMedicines />
//                 </PrivateRoute>
//               }
//             />

//             {/* Fallback */}
//             <Route path="*" element={<Navigate to="/login" replace />} />
//           </Routes>
//         </RootLayout>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import "bootstrap/dist/css/bootstrap.min.css";

// // --- Layouts ---
// import RootLayout from "./layouts/RootLayout";
// import AdminLayout from "./pages/AdminLayout";
// import CustomerLayout from "./layouts/CustomerLayout";

// // --- Auth Pages ---
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import VerifyOtp from "./pages/VerifyOTP";
// import AdminLogin from "./pages/AdminLogin";
// import AdminResetPassword from "./pages/AdminResetPassword";

// // --- Public Pages ---
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import FAQ from "./pages/FAQ";
// import Support from "./pages/Support";
// import Privacy from "./pages/Privacy";

// // --- Customer Pages ---

// import CustomerDashboard from "./pages/CustomerDashboard";
// import ProfilePage from "./pages/ProfilePage";
// import Cart from "./pages/Cart";
// import Shipping from "./pages/Shipping";
// import PlaceOrder from "./pages/PlaceOrder";
// import Payment from "./pages/Payment";
// import OrderConfirmation from "./components/OrderConfirm"; // Ensure this matches filename
// import CustomerAppointments from "./pages/CustomerAppointments";
// import OrderHistory from "./pages/OrderHistory"; // ✅ NEW
// import PrescriptionsPage from "./pages/PrescriptionsPage"; // ✅ NEW (Create this file if missing)

// // --- Medicine Shop Pages ---
// import MedicineShop from "./pages/MedicineShop"; // ✅ Replaces CustomerMedicines
// import MedicineDetails from "./pages/MedicineDetails"; // ✅ NEW

// // --- Admin / Staff Pages ---
// import PharmacistDashboard from "./pages/PharmacistDashboard";
// // AdminDashboard is likely handled inside AdminLayout, but importing if needed for direct route
// import AdminDashboard from "./pages/AdminDashboard";

// // --- Private Route Component ---
// const PrivateRoute = ({ children, allowedRoles }) => {
//   const { user, initLoading } = useAuth();

//   if (initLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// // --- Dashboard Redirector ---
// const DashboardRedirect = () => {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;

//   switch (user.role) {
//     case "admin":
//       return <Navigate to="/admin/dashboard" replace />;
//     case "pharmacist":
//     case "staff":
//       return <Navigate to="/pharmacist-dashboard" replace />;
//     case "customer":
//       return <Navigate to="/customer-dashboard" replace />;
//     default:
//       return <Navigate to="/login" replace />;
//   }
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <RootLayout>
//           <Routes>
//             {/* ================= PUBLIC ROUTES ================= */}
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/verify-otp" element={<VerifyOtp />} />
//             <Route path="/admin/login" element={<AdminLogin />} />
//             <Route
//               path="/admin-reset-password"
//               element={<AdminResetPassword />}
//             />
//             {/* Info Pages */}
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/faq" element={<FAQ />} />
//             <Route path="/support" element={<Support />} />
//             <Route path="/privacy" element={<Privacy />} />
//             {/* ================= SHARED ROUTES ================= */}
//             {/* Generic Dashboard Redirect */}
//             <Route
//               path="/dashboard"
//               element={
//                 <PrivateRoute>
//                   <DashboardRedirect />
//                 </PrivateRoute>
//               }
//             />
//             {/* Profile (Any Logged-in User) */}
//             <Route
//               path="/profile"
//               element={
//                 <PrivateRoute>
//                   <ProfilePage />
//                 </PrivateRoute>
//               }
//             />
//             {/* ================= CUSTOMER ROUTES ================= */}
//             {/* Wrap all these pages in the Layout */}
//             <Route
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <CustomerLayout />
//                 </PrivateRoute>
//               }
//             >
//               <Route
//                 path="/customer-dashboard"
//                 element={<CustomerDashboard />}
//               />
//               <Route path="/profile" element={<ProfilePage />} />
//               <Route path="/orders" element={<OrderHistory />} />
//               <Route path="/appointments" element={<CustomerAppointments />} />
//               <Route path="/medicines" element={<MedicineShop />} />
//               <Route path="/medicine/:id" element={<MedicineDetails />} />
//               <Route path="/prescriptions" element={<PrescriptionsPage />} />
//             </Route>
//             {/* Appointments */}
//             <Route
//               path="/appointments"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <CustomerAppointments />
//                 </PrivateRoute>
//               }
//             />
//             {/* Keep legacy route for safety, or remove if updated everywhere */}
//             <Route
//               path="/customer-appointments"
//               element={<Navigate to="/appointments" replace />}
//             />
//             {/* Medicine Shop & Details */}
//             <Route
//               path="/medicines"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <MedicineShop />
//                 </PrivateRoute>
//               }
//             />
//             {/* Keep legacy route */}
//             <Route
//               path="/customer-medicines"
//               element={<Navigate to="/medicines" replace />}
//             />
//             <Route
//               path="/medicine/:id"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <MedicineDetails />
//                 </PrivateRoute>
//               }
//             />
//             {/* Prescriptions (New) */}
//             <Route
//               path="/prescriptions"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <PrescriptionsPage />
//                 </PrivateRoute>
//               }
//             />
//             {/* Order History (New) */}
//             <Route
//               path="/orders"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <OrderHistory />
//                 </PrivateRoute>
//               }
//             />
//             {/* ================= CHECKOUT FLOW ================= */}
//             <Route path="/cart" element={<Cart />} />{" "}
//             {/* Publicly viewable, but checkout requires login */}
//             <Route
//               path="/shipping"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <Shipping />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/placeorder"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <PlaceOrder />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/payment"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <Payment />
//                 </PrivateRoute>
//               }
//             />
//             <Route path="/payment-success" element={<OrderConfirmation />} />
//             {/* ================= ADMIN ROUTES ================= */}
//             <Route
//               path="/admin/*"
//               element={
//                 <PrivateRoute allowedRoles={["admin"]}>
//                   <AdminLayout />
//                 </PrivateRoute>
//               }
//             />
//             {/* ================= STAFF ROUTES ================= */}
//             <Route
//               path="/pharmacist-dashboard"
//               element={
//                 <PrivateRoute allowedRoles={["pharmacist", "staff"]}>
//                   <PharmacistDashboard />
//                 </PrivateRoute>
//               }
//             />
//             {/* ================= FALLBACK ================= */}
//             <Route path="*" element={<Navigate to="/login" replace />} />
//           </Routes>
//         </RootLayout>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import "bootstrap/dist/css/bootstrap.min.css";

// // --- Layouts ---
// import RootLayout from "./layouts/RootLayout";
// import AdminLayout from "./pages/AdminLayout";
// import CustomerLayout from "./layouts/CustomerLayout"; // ✅ Correct Import

// // --- Auth Pages ---
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import VerifyOtp from "./pages/VerifyOTP";
// import AdminLogin from "./pages/AdminLogin";
// import AdminResetPassword from "./pages/AdminResetPassword";

// // --- Public Pages ---
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import FAQ from "./pages/FAQ";
// import Support from "./pages/Support";
// import Privacy from "./pages/Privacy";

// // --- Customer Pages ---
// import CustomerDashboard from "./pages/CustomerDashboard";
// import ProfilePage from "./pages/ProfilePage";
// import Cart from "./pages/Cart";
// import Shipping from "./pages/Shipping";
// import PlaceOrder from "./pages/PlaceOrder";
// import Payment from "./pages/Payment";
// import OrderConfirmation from "./components/OrderConfirm";
// import CustomerAppointments from "./pages/CustomerAppointments";
// import OrderHistory from "./pages/OrderHistory";
// import PrescriptionsPage from "./pages/PrescriptionsPage";

// // --- Medicine Shop Pages ---
// import MedicineShop from "./pages/MedicineShop";
// import MedicineDetails from "./pages/MedicineDetails";

// // --- Admin / Staff Pages ---
// import PharmacistDashboard from "./pages/PharmacistDashboard";
// // AdminDashboard is handled inside AdminLayout

// // --- Private Route Component ---
// const PrivateRoute = ({ children, allowedRoles }) => {
//   const { user, initLoading } = useAuth();

//   if (initLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// // --- Dashboard Redirector ---
// const DashboardRedirect = () => {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;

//   switch (user.role) {
//     case "admin":
//       return <Navigate to="/admin/dashboard" replace />;
//     case "pharmacist":
//     case "staff":
//       return <Navigate to="/pharmacist-dashboard" replace />;
//     case "customer":
//       return <Navigate to="/customer-dashboard" replace />;
//     default:
//       return <Navigate to="/login" replace />;
//   }
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <RootLayout>
//           <Routes>
//             {/* ================= PUBLIC ROUTES ================= */}
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/verify-otp" element={<VerifyOtp />} />
//             <Route path="/admin/login" element={<AdminLogin />} />
//             <Route
//               path="/admin-reset-password"
//               element={<AdminResetPassword />}
//             />

//             {/* Info Pages */}
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/faq" element={<FAQ />} />
//             <Route path="/support" element={<Support />} />
//             <Route path="/privacy" element={<Privacy />} />

//             {/* ================= SHARED ROUTES ================= */}
//             <Route
//               path="/dashboard"
//               element={
//                 <PrivateRoute>
//                   <DashboardRedirect />
//                 </PrivateRoute>
//               }
//             />

//             {/* ================= CUSTOMER PORTAL (WITH SIDEBAR) ================= */}
//             {/* This wrapper applies the CustomerLayout (Sidebar) to all nested routes */}
//             <Route
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <CustomerLayout />
//                 </PrivateRoute>
//               }
//             >
//               <Route
//                 path="/customer-dashboard"
//                 element={<CustomerDashboard />}
//               />
//               <Route path="/medicines" element={<MedicineShop />} />
//               <Route path="/medicine/:id" element={<MedicineDetails />} />
//               <Route path="/appointments" element={<CustomerAppointments />} />
//               <Route path="/orders" element={<OrderHistory />} />
//               <Route path="/prescriptions" element={<PrescriptionsPage />} />
//               <Route path="/profile" element={<ProfilePage />} />
//             </Route>

//             {/* Legacy Redirects (Safety) */}
//             <Route
//               path="/customer-appointments"
//               element={<Navigate to="/appointments" replace />}
//             />
//             <Route
//               path="/customer-medicines"
//               element={<Navigate to="/medicines" replace />}
//             />

//             {/* ================= CHECKOUT FLOW (NO SIDEBAR) ================= */}
//             <Route path="/cart" element={<Cart />} />

//             <Route
//               path="/shipping"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <Shipping />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/placeorder"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <PlaceOrder />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/payment"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <Payment />
//                 </PrivateRoute>
//               }
//             />
//             <Route path="/payment-success" element={<OrderConfirmation />} />

//             {/* ================= ADMIN ROUTES ================= */}
//             <Route
//               path="/admin/*"
//               element={
//                 <PrivateRoute allowedRoles={["admin"]}>
//                   <AdminLayout />
//                 </PrivateRoute>
//               }
//             />

//             {/* ================= STAFF ROUTES ================= */}
//             <Route
//               path="/pharmacist-dashboard"
//               element={
//                 <PrivateRoute allowedRoles={["pharmacist", "staff"]}>
//                   <PharmacistDashboard />
//                 </PrivateRoute>
//               }
//             />

//             {/* ================= FALLBACK ================= */}
//             <Route path="*" element={<Navigate to="/login" replace />} />
//           </Routes>
//         </RootLayout>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import "bootstrap/dist/css/bootstrap.min.css";

// // --- Layouts ---
// import RootLayout from "./layouts/RootLayout";
// import AdminLayout from "./pages/AdminLayout";
// import CustomerLayout from "./layouts/CustomerLayout";
// import PharmacistLayout from "./pages/PharmacistLayout"; // ✅ ADDED

// // --- Auth Pages ---
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import VerifyOtp from "./pages/VerifyOTP";
// import AdminLogin from "./pages/AdminLogin";
// import AdminResetPassword from "./pages/AdminResetPassword";

// // --- Public Pages ---
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import FAQ from "./pages/FAQ";
// import Support from "./pages/Support";
// import Privacy from "./pages/Privacy";

// // --- Customer Pages ---
// import CustomerDashboard from "./pages/CustomerDashboard";
// import ProfilePage from "./pages/ProfilePage";
// import Cart from "./pages/Cart";
// import Shipping from "./pages/Shipping";
// import PlaceOrder from "./pages/PlaceOrder";
// import Payment from "./pages/Payment";
// import OrderConfirmation from "./components/OrderConfirm";
// import CustomerAppointments from "./pages/CustomerAppointments";
// import OrderHistory from "./pages/OrderHistory";
// import PrescriptionsPage from "./pages/PrescriptionsPage";

// // --- Medicine Shop Pages ---
// import MedicineShop from "./pages/MedicineShop";
// import MedicineDetails from "./pages/MedicineDetails";

// // --- Pharmacist / Staff Pages ---
// import PharmacistDashboard from "./pages/PharmacistDashboard"; // ✅ ADDED
// import PharmacistPrescriptions from "./pages/PharmacistPrescriptions"; // ✅ ADDED
// import PharmacistInventory from "./pages/PharmacistInventory"; // ✅ ADDED
// import PharmacistOrders from "./pages/PharmacistOrders"; // ✅ ADDED

// // --- Private Route Component ---
// const PrivateRoute = ({ children, allowedRoles }) => {
//   const { user, initLoading } = useAuth();

//   if (initLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Normalize user role and allowed roles for comparison
//   const userRole = user.role ? user.role.toLowerCase() : "";
//   const normalizedAllowedRoles = allowedRoles
//     ? allowedRoles.map((r) => r.toLowerCase())
//     : [];

//   if (allowedRoles && !normalizedAllowedRoles.includes(userRole)) {
//     console.warn(
//       `Access Denied: Role '${userRole}' is not in [${normalizedAllowedRoles.join(
//         ", "
//       )}]`
//     );
//     return <Navigate to="/login" replace />; // Or a generic "Unauthorized" page
//   }

//   return children;
// };
// // --- Dashboard Redirector ---
// const DashboardRedirect = () => {
//   const { user } = useAuth();

//   // 1. If no user is logged in, send to login
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // 2. Normalize role to lowercase to prevent "Pharmacist" vs "pharmacist" issues
//   const role = user.role ? user.role.toLowerCase() : "";

//   console.log("Redirecting user with role:", role); // Debugging log

//   switch (role) {
//     case "admin":
//       return <Navigate to="/admin/dashboard" replace />;

//     // Check both potential role names
//     case "pharmacist":
//     case "staff":
//       return <Navigate to="/pharmacist/dashboard" replace />;

//     case "customer":
//     case "user": // Some systems default to 'user'
//       return <Navigate to="/customer-dashboard" replace />;

//     default:
//       console.warn("Unknown role:", role);
//       return <Navigate to="/login" replace />;
//   }
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <RootLayout>
//           <Routes>
//             {/* ================= PUBLIC ROUTES ================= */}
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/verify-otp" element={<VerifyOtp />} />
//             <Route path="/admin/login" element={<AdminLogin />} />
//             <Route
//               path="/admin-reset-password"
//               element={<AdminResetPassword />}
//             />

//             {/* Info Pages */}
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/faq" element={<FAQ />} />
//             <Route path="/support" element={<Support />} />
//             <Route path="/privacy" element={<Privacy />} />

//             {/* ================= SHARED ROUTES ================= */}
//             <Route
//               path="/dashboard"
//               element={
//                 <PrivateRoute>
//                   <DashboardRedirect />
//                 </PrivateRoute>
//               }
//             />

//             {/* ================= CUSTOMER PORTAL ================= */}
//             <Route
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <CustomerLayout />
//                 </PrivateRoute>
//               }
//             >
//               <Route
//                 path="/customer-dashboard"
//                 element={<CustomerDashboard />}
//               />
//               <Route path="/medicines" element={<MedicineShop />} />
//               <Route path="/medicine/:id" element={<MedicineDetails />} />
//               <Route path="/appointments" element={<CustomerAppointments />} />
//               <Route path="/orders" element={<OrderHistory />} />
//               <Route path="/prescriptions" element={<PrescriptionsPage />} />
//               <Route path="/profile" element={<ProfilePage />} />
//             </Route>

//             {/* Legacy Redirects */}
//             <Route
//               path="/customer-appointments"
//               element={<Navigate to="/appointments" replace />}
//             />
//             <Route
//               path="/customer-medicines"
//               element={<Navigate to="/medicines" replace />}
//             />

//             {/* ================= CHECKOUT FLOW ================= */}
//             <Route path="/cart" element={<Cart />} />

//             <Route
//               path="/shipping"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <Shipping />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/placeorder"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <PlaceOrder />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/payment"
//               element={
//                 <PrivateRoute allowedRoles={["customer"]}>
//                   <Payment />
//                 </PrivateRoute>
//               }
//             />
//             <Route path="/payment-success" element={<OrderConfirmation />} />

//             {/* ================= ADMIN ROUTES ================= */}
//             <Route
//               path="/admin/*"
//               element={
//                 <PrivateRoute allowedRoles={["admin"]}>
//                   <AdminLayout />
//                 </PrivateRoute>
//               }
//             />

//             {/* ================= PHARMACIST ROUTES ================= */}
//             {/* ✅ NEW: Pharmacist Layout + Module Routes */}
//             <Route
//               element={
//                 <PrivateRoute allowedRoles={["pharmacist", "staff"]}>
//                   <PharmacistLayout />
//                 </PrivateRoute>
//               }
//             >
//               <Route
//                 path="/pharmacist/dashboard"
//                 element={<PharmacistDashboard />}
//               />
//               <Route
//                 path="/pharmacist/prescriptions"
//                 element={<PharmacistPrescriptions />}
//               />
//               <Route
//                 path="/pharmacist/inventory"
//                 element={<PharmacistInventory />}
//               />
//               <Route path="/pharmacist/orders" element={<PharmacistOrders />} />
//               <Route
//                 path="/pharmacist/alerts"
//                 element={<PharmacistInventory />}
//               />
//               <Route
//                 path="/pharmacist/customers"
//                 element={<div>Customer Management (Coming Soon)</div>}
//               />
//               <Route
//                 path="/pharmacist/reports"
//                 element={<div>Reports (Coming Soon)</div>}
//               />
//               {/* Reuse the Profile Page */}
//               <Route path="/profile" element={<ProfilePage />} />
//             </Route>

//             {/* ================= FALLBACK ================= */}
//             <Route path="*" element={<Navigate to="/login" replace />} />
//           </Routes>
//         </RootLayout>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import "bootstrap/dist/css/bootstrap.min.css";

// // --- Layouts ---
// import RootLayout from "./layouts/RootLayout";
// import AdminLayout from "./pages/AdminLayout";
// import CustomerLayout from "./layouts/CustomerLayout";
// import PharmacistLayout from "./pages/PharmacistLayout";

// // --- Auth Pages ---
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import VerifyOtp from "./pages/VerifyOTP";
// import AdminLogin from "./pages/AdminLogin";
// import AdminResetPassword from "./pages/AdminResetPassword";

// // --- Public Pages ---
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import FAQ from "./pages/FAQ";
// import Support from "./pages/Support";
// import Privacy from "./pages/Privacy";

// // --- Customer Pages ---
// import CustomerDashboard from "./pages/CustomerDashboard";
// import ProfilePage from "./pages/ProfilePage";
// import Cart from "./pages/Cart";
// import Shipping from "./pages/Shipping";
// import PlaceOrder from "./pages/PlaceOrder";
// import Payment from "./pages/Payment";
// import OrderConfirmation from "./components/OrderConfirm";
// import CustomerAppointments from "./pages/CustomerAppointments";
// import OrderHistory from "./pages/OrderHistory";
// import PrescriptionsPage from "./pages/PrescriptionsPage";

// // --- Medicine Shop Pages ---
// import MedicineShop from "./pages/MedicineShop";
// import MedicineDetails from "./pages/MedicineDetails";

// // --- Pharmacist / Staff Pages ---
// import PharmacistDashboard from "./pages/PharmacistDashboard";
// import PharmacistPrescriptions from "./pages/PharmacistPrescriptions";
// import PharmacistInventory from "./pages/PharmacistInventory";
// import PharmacistOrders from "./pages/PharmacistOrders";

// // --- Private Route Component ---
// const PrivateRoute = ({ children, allowedRoles }) => {
//   const { user, initLoading } = useAuth();

//   if (initLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Normalize user role and allowed roles for comparison
//   const userRole = user.role ? user.role.toLowerCase() : "";
//   const normalizedAllowedRoles = allowedRoles
//     ? allowedRoles.map((r) => r.toLowerCase())
//     : [];

//   if (allowedRoles && !normalizedAllowedRoles.includes(userRole)) {
//     console.warn(
//       `Access Denied: Role '${userRole}' is not in [${normalizedAllowedRoles.join(
//         ", "
//       )}]`
//     );
//     // If unauthorized, send back to login or their specific dashboard
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// };

// // --- Dashboard Redirector ---
// const DashboardRedirect = () => {
//   const { user } = useAuth();

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   const role = user.role ? user.role.toLowerCase() : "";

//   console.log("Redirecting user with role:", role);

//   switch (role) {
//     case "admin":
//       return <Navigate to="/admin/dashboard" replace />;
//     case "pharmacist":
//     case "staff":
//       return <Navigate to="/pharmacist/dashboard" replace />;
//     case "customer":
//     case "user":
//       return <Navigate to="/customer-dashboard" replace />;
//     default:
//       console.warn("Unknown role:", role);
//       return <Navigate to="/login" replace />;
//   }
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <RootLayout>
//           <Routes>
//             {/* ================= PUBLIC ROUTES ================= */}
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/verify-otp" element={<VerifyOtp />} />
//             <Route path="/admin/login" element={<AdminLogin />} />
//             <Route
//               path="/admin-reset-password"
//               element={<AdminResetPassword />}
//             />

//             {/* Info Pages */}
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/faq" element={<FAQ />} />
//             <Route path="/support" element={<Support />} />
//             <Route path="/privacy" element={<Privacy />} />

//             {/* ================= SHARED ROUTES ================= */}
//             <Route
//               path="/dashboard"
//               element={
//                 <PrivateRoute>
//                   <DashboardRedirect />
//                 </PrivateRoute>
//               }
//             />

//             {/* ================= CUSTOMER PORTAL ================= */}
//             <Route
//               element={
//                 <PrivateRoute allowedRoles={["customer", "user"]}>
//                   <CustomerLayout />
//                 </PrivateRoute>
//               }
//             >
//               <Route
//                 path="/customer-dashboard"
//                 element={<CustomerDashboard />}
//               />
//               <Route path="/medicines" element={<MedicineShop />} />
//               <Route path="/medicine/:id" element={<MedicineDetails />} />
//               <Route path="/appointments" element={<CustomerAppointments />} />
//               <Route path="/orders" element={<OrderHistory />} />
//               <Route path="/prescriptions" element={<PrescriptionsPage />} />
//               <Route path="/profile" element={<ProfilePage />} />
//             </Route>

//             {/* Legacy Redirects */}
//             <Route
//               path="/customer-appointments"
//               element={<Navigate to="/appointments" replace />}
//             />
//             <Route
//               path="/customer-medicines"
//               element={<Navigate to="/medicines" replace />}
//             />

//             {/* ================= CHECKOUT FLOW ================= */}
//             <Route path="/cart" element={<Cart />} />
//             <Route
//               path="/shipping"
//               element={
//                 <PrivateRoute allowedRoles={["customer", "user"]}>
//                   <Shipping />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/placeorder"
//               element={
//                 <PrivateRoute allowedRoles={["customer", "user"]}>
//                   <PlaceOrder />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/payment"
//               element={
//                 <PrivateRoute allowedRoles={["customer", "user"]}>
//                   <Payment />
//                 </PrivateRoute>
//               }
//             />
//             <Route path="/payment-success" element={<OrderConfirmation />} />

//             {/* ================= ADMIN ROUTES ================= */}
//             <Route
//               path="/admin/*"
//               element={
//                 <PrivateRoute allowedRoles={["admin"]}>
//                   <AdminLayout />
//                 </PrivateRoute>
//               }
//             />

//             {/* ================= PHARMACIST ROUTES ================= */}
//             <Route
//               element={
//                 <PrivateRoute allowedRoles={["pharmacist", "staff"]}>
//                   <PharmacistLayout />
//                 </PrivateRoute>
//               }
//             >
//               <Route
//                 path="/pharmacist/dashboard"
//                 element={<PharmacistDashboard />}
//               />
//               <Route
//                 path="/pharmacist/prescriptions"
//                 element={<PharmacistPrescriptions />}
//               />
//               <Route
//                 path="/pharmacist/inventory"
//                 element={<PharmacistInventory />}
//               />
//               <Route path="/pharmacist/orders" element={<PharmacistOrders />} />
//               <Route
//                 path="/pharmacist/alerts"
//                 element={<PharmacistInventory />}
//               />
//               <Route
//                 path="/pharmacist/customers"
//                 element={<div>Customer Management (Coming Soon)</div>}
//               />
//               <Route
//                 path="/pharmacist/reports"
//                 element={<div>Reports (Coming Soon)</div>}
//               />
//               <Route path="/pharmacist/profile" element={<ProfilePage />} />
//             </Route>

//             {/* ================= FALLBACK ================= */}
//             <Route path="*" element={<Navigate to="/login" replace />} />
//           </Routes>
//         </RootLayout>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

// --- Layouts ---
import RootLayout from "./layouts/RootLayout";
import AdminLayout from "./pages/AdminLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import PharmacistLayout from "./pages/PharmacistLayout";

// --- Auth Pages ---
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOTP";
import AdminLogin from "./pages/AdminLogin";
import AdminResetPassword from "./pages/AdminResetPassword";

// --- Public Pages ---
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import Privacy from "./pages/Privacy";

// --- Customer Pages ---
import CustomerDashboard from "./pages/CustomerDashboard";
import ProfilePage from "./pages/ProfilePage";
import Cart from "./pages/Cart";
import Shipping from "./pages/Shipping";
import PlaceOrder from "./pages/PlaceOrder";
import Payment from "./pages/Payment";
import OrderConfirmation from "./components/OrderConfirm";
import CustomerAppointments from "./pages/CustomerAppointments";
import OrderHistory from "./pages/OrderHistory";
import PrescriptionsPage from "./pages/PrescriptionsPage";

// --- Medicine Shop Pages ---
import MedicineShop from "./pages/MedicineShop";
import MedicineDetails from "./pages/MedicineDetails";

// --- Pharmacist / Staff Pages ---
import PharmacistDashboard from "./pages/PharmacistDashboard";
import PharmacistPrescriptions from "./pages/PharmacistPrescriptions";
import PharmacistInventory from "./pages/PharmacistInventory";
import PharmacistOrders from "./pages/PharmacistOrders";

// --- Private Route Component ---
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, initLoading } = useAuth();

  if (initLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize user role
  const userRole = user.role ? user.role.toLowerCase() : "";
  const normalizedAllowedRoles = allowedRoles
    ? allowedRoles.map((r) => r.toLowerCase())
    : [];

  if (allowedRoles && !normalizedAllowedRoles.includes(userRole)) {
    console.warn(`Access Denied: Role '${userRole}' not authorized.`);
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// --- Dashboard Redirector ---
const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const role = user.role ? user.role.toLowerCase() : "";

  switch (role) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "pharmacist":
    case "staff":
      return <Navigate to="/pharmacist/dashboard" replace />;
    case "customer":
    case "user":
      return <Navigate to="/customer-dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <RootLayout>
          <Routes>
            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin-reset-password"
              element={<AdminResetPassword />}
            />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* ================= SHARED ROUTES ================= */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardRedirect />
                </PrivateRoute>
              }
            />

            {/* ================= CUSTOMER PORTAL ================= */}
            <Route
              element={
                <PrivateRoute allowedRoles={["customer", "user"]}>
                  <CustomerLayout />
                </PrivateRoute>
              }
            >
              <Route
                path="/customer-dashboard"
                element={<CustomerDashboard />}
              />
              <Route path="/medicines" element={<MedicineShop />} />
              <Route path="/medicine/:id" element={<MedicineDetails />} />
              <Route path="/appointments" element={<CustomerAppointments />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/prescriptions" element={<PrescriptionsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Legacy Redirects */}
            <Route
              path="/customer-appointments"
              element={<Navigate to="/appointments" replace />}
            />
            <Route
              path="/customer-medicines"
              element={<Navigate to="/medicines" replace />}
            />

            {/* ================= CHECKOUT FLOW ================= */}
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/shipping"
              element={
                <PrivateRoute allowedRoles={["customer", "user"]}>
                  <Shipping />
                </PrivateRoute>
              }
            />
            <Route
              path="/placeorder"
              element={
                <PrivateRoute allowedRoles={["customer", "user"]}>
                  <PlaceOrder />
                </PrivateRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <PrivateRoute allowedRoles={["customer", "user"]}>
                  <Payment />
                </PrivateRoute>
              }
            />
            <Route path="/payment-success" element={<OrderConfirmation />} />

            {/* ================= ADMIN ROUTES ================= */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </PrivateRoute>
              }
            />

            {/* ================= PHARMACIST ROUTES ================= */}
            <Route
              element={
                <PrivateRoute allowedRoles={["pharmacist", "staff"]}>
                  <PharmacistLayout />
                </PrivateRoute>
              }
            >
              <Route
                path="/pharmacist/dashboard"
                element={<PharmacistDashboard />}
              />
              <Route
                path="/pharmacist/prescriptions"
                element={<PharmacistPrescriptions />}
              />
              <Route
                path="/pharmacist/inventory"
                element={<PharmacistInventory />}
              />
              <Route path="/pharmacist/orders" element={<PharmacistOrders />} />
              <Route
                path="/pharmacist/alerts"
                element={<PharmacistInventory />}
              />
              <Route path="/pharmacist/profile" element={<ProfilePage />} />
            </Route>

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </RootLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
