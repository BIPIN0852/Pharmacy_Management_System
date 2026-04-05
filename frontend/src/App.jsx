// import React, { useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Loader2 } from "lucide-react";

// // --- Layouts ---
// import RootLayout from "./layouts/RootLayout";
// import DashboardLayout from "./layouts/DashboardLayout";
// import AdminLayout from "./pages/AdminLayout";
// import CustomerLayout from "./layouts/CustomerLayout";
// import PharmacistLayout from "./pages/PharmacistLayout";
// import DoctorLayout from "./layouts/DoctorLayout";

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
// import AppointmentChat from "./pages/AppointmentChat";

// // --- Customer Pages ---
// import CustomerDashboard from "./pages/CustomerDashboard";
// import ProfilePage from "./pages/ProfilePage";
// import CartPage from "./pages/CartPage";
// import Shipping from "./pages/Shipping";
// import PlaceOrder from "./pages/PlaceOrder";
// import Payment from "./pages/Payment";
// import PaymentSuccess from "./pages/PaymentSuccess";
// import CustomerAppointments from "./pages/CustomerAppointments";
// import OrderHistory from "./pages/OrderHistory";
// import OrderDetails from "./pages/OrderDetails";
// import PrescriptionsPage from "./pages/PrescriptionsPage";
// import SavedMedicinesPage from "./pages/SavedMedicinesPage";

// // --- Medicine Shop Pages ---
// import MedicineShop from "./pages/MedicineShop";
// import MedicineDetails from "./pages/MedicineDetails";

// // --- Pharmacist / Staff Pages ---
// import PharmacistDashboard from "./pages/PharmacistDashboard";
// import PharmacistPrescriptions from "./pages/PharmacistPrescriptions";
// import PharmacistInventory from "./pages/PharmacistInventory";
// import PharmacistOrders from "./pages/PharmacistOrders";
// import PharmacistAlerts from "./pages/PharmacistAlerts";
// import PharmacistCustomers from "./pages/PharmacistCustomers";
// import PharmacistReports from "./pages/PharmacistReports";
// import PharmacistProfile from "./pages/PharmacistProfile";

// // --- Doctor Pages ---
// import DoctorDashboard from "./pages/DoctorDashboard";
// import DoctorAppointments from "./pages/DoctorAppointments";
// import DoctorPatients from "./pages/DoctorPatients";
// import DoctorPrescriptions from "./pages/DoctorPrescriptions";
// import DoctorProfile from "./pages/DoctorProfile";

// // --- Private Route Component ---
// const PrivateRoute = ({ children, allowedRoles }) => {
//   const { user, initLoading } = useAuth();

//   if (initLoading) {
//     return (
//       <div
//         className="d-flex flex-column justify-content-center align-items-center vh-100"
//         style={{ backgroundColor: "#f0f2f2" }}
//       >
//         <Loader2
//           className="spin-animation mb-3"
//           style={{ color: "#007185" }}
//           size={48}
//         />
//         <span
//           className="text-secondary fw-bold text-uppercase small"
//           style={{ letterSpacing: "0.5px" }}
//         >
//           Verifying Session...
//         </span>
//         <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   const userRole = user.role ? user.role.toLowerCase() : "";
//   const normalizedAllowedRoles = allowedRoles
//     ? allowedRoles.map((r) => r.toLowerCase())
//     : [];

//   if (allowedRoles && !normalizedAllowedRoles.includes(userRole)) {
//     console.warn(`Access Denied: Role '${userRole}' not authorized.`);
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// };

// // --- Dashboard Redirector ---
// const DashboardRedirect = () => {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;
//   const role = user.role ? user.role.toLowerCase() : "";

//   switch (role) {
//     case "admin":
//       return <Navigate to="/admin/dashboard" replace />;
//     case "doctor":
//       return <Navigate to="/doctor/dashboard" replace />;
//     case "pharmacist":
//     case "staff":
//       return <Navigate to="/pharmacist/dashboard" replace />;
//     case "customer":
//     case "user":
//       return <Navigate to="/customer/dashboard" replace />;
//     default:
//       return <Navigate to="/login" replace />;
//   }
// };

// function App() {
//   // Safely load Google Translate AFTER React renders
//   useEffect(() => {
//     if (!document.getElementById("google-translate-script")) {
//       window.googleTranslateElementInit = () => {
//         new window.google.translate.TranslateElement(
//           {
//             pageLanguage: "en",
//             includedLanguages: "en,ne",
//             autoDisplay: false,
//           },
//           "google_translate_element",
//         );
//       };

//       const script = document.createElement("script");
//       script.id = "google-translate-script";
//       script.src =
//         "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//       script.async = true;
//       document.body.appendChild(script);
//     }
//   }, []);
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
//                 <PrivateRoute
//                   allowedRoles={[
//                     "customer",
//                     "user",
//                     "admin",
//                     "pharmacist",
//                     "staff",
//                   ]}
//                 >
//                   <CustomerLayout />
//                 </PrivateRoute>
//               }
//             >
//               <Route
//                 path="/customer/dashboard"
//                 element={<CustomerDashboard />}
//               />
//               <Route
//                 path="/customer-dashboard"
//                 element={<Navigate to="/customer/dashboard" replace />}
//               />
//               <Route path="/medicines" element={<MedicineShop />} />
//               <Route path="/medicine/:id" element={<MedicineDetails />} />
//               <Route path="/appointments" element={<CustomerAppointments />} />
//               <Route path="/orders" element={<OrderHistory />} />
//               <Route path="/order/:id" element={<OrderDetails />} />
//               <Route path="/prescriptions" element={<PrescriptionsPage />} />
//               <Route path="/profile" element={<ProfilePage />} />
//               <Route path="/customer/saved" element={<SavedMedicinesPage />} />
//               <Route
//                 path="/customer/chat/:appointmentId"
//                 element={<AppointmentChat />}
//               />
//             </Route>

//             {/* ================= CHECKOUT FLOW ================= */}
//             <Route
//               path="/cart"
//               element={
//                 <PrivateRoute allowedRoles={["customer", "user"]}>
//                   <CartPage />
//                 </PrivateRoute>
//               }
//             />
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
//             <Route
//               path="/payment-success"
//               element={
//                 <PrivateRoute allowedRoles={["customer", "user"]}>
//                   <PaymentSuccess />
//                 </PrivateRoute>
//               }
//             />

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
//               <Route path="/pharmacist/alerts" element={<PharmacistAlerts />} />
//               <Route
//                 path="/pharmacist/customers"
//                 element={<PharmacistCustomers />}
//               />
//               <Route
//                 path="/pharmacist/reports"
//                 element={<PharmacistReports />}
//               />
//               <Route
//                 path="/pharmacist/profile"
//                 element={<PharmacistProfile />}
//               />
//             </Route>

//             {/* ================= DOCTOR ROUTES ================= */}
//             <Route
//               element={
//                 <PrivateRoute allowedRoles={["doctor"]}>
//                   <DoctorLayout />
//                 </PrivateRoute>
//               }
//             >
//               <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
//               <Route
//                 path="/doctor-dashboard"
//                 element={<Navigate to="/doctor/dashboard" replace />}
//               />
//               <Route
//                 path="/doctor/appointments"
//                 element={<DoctorAppointments />}
//               />
//               <Route path="/doctor/patients" element={<DoctorPatients />} />
//               <Route
//                 path="/doctor/prescriptions"
//                 element={<DoctorPrescriptions />}
//               />
//               <Route path="/doctor/profile" element={<DoctorProfile />} />
//               <Route
//                 path="/doctor/chat/:appointmentId"
//                 element={<AppointmentChat />}
//               />
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

import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Loader2 } from "lucide-react";

// --- Layouts ---
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./pages/AdminLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import PharmacistLayout from "./pages/PharmacistLayout";
import DoctorLayout from "./layouts/DoctorLayout";

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
import AppointmentChat from "./pages/AppointmentChat";

// --- Customer Pages ---
import CustomerDashboard from "./pages/CustomerDashboard";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import Shipping from "./pages/Shipping";
import PlaceOrder from "./pages/PlaceOrder";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import CustomerAppointments from "./pages/CustomerAppointments";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/OrderDetails";
import PrescriptionsPage from "./pages/PrescriptionsPage";
import SavedMedicinesPage from "./pages/SavedMedicinesPage";

// --- Medicine Shop Pages ---
import MedicineShop from "./pages/MedicineShop";
import MedicineDetails from "./pages/MedicineDetails";

// --- Pharmacist / Staff Pages ---
import PharmacistDashboard from "./pages/PharmacistDashboard";
import PharmacistPrescriptions from "./pages/PharmacistPrescriptions";
import PharmacistInventory from "./pages/PharmacistInventory";
import PharmacistOrders from "./pages/PharmacistOrders";
import PharmacistAlerts from "./pages/PharmacistAlerts";
import PharmacistCustomers from "./pages/PharmacistCustomers";
import PharmacistReports from "./pages/PharmacistReports";
import PharmacistProfile from "./pages/PharmacistProfile";
// ✅ NEW IMPORT FOR REFILL REMINDERS
import PharmacistRefills from "./pages/PharmacistRefills";

// --- Doctor Pages ---
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorPrescriptions from "./pages/DoctorPrescriptions";
import DoctorProfile from "./pages/DoctorProfile";

// --- Private Route Component ---
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, initLoading } = useAuth();

  if (initLoading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <Loader2
          className="spin-animation mb-3"
          style={{ color: "#007185" }}
          size={48}
        />
        <span
          className="text-secondary fw-bold text-uppercase small"
          style={{ letterSpacing: "0.5px" }}
        >
          Verifying Session...
        </span>
        <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
    case "doctor":
      return <Navigate to="/doctor/dashboard" replace />;
    case "pharmacist":
    case "staff":
      return <Navigate to="/pharmacist/dashboard" replace />;
    case "customer":
    case "user":
      return <Navigate to="/customer/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  // Safely load Google Translate AFTER React renders
  useEffect(() => {
    if (!document.getElementById("google-translate-script")) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ne",
            autoDisplay: false,
          },
          "google_translate_element",
        );
      };

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
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
                <PrivateRoute
                  allowedRoles={[
                    "customer",
                    "user",
                    "admin",
                    "pharmacist",
                    "staff",
                  ]}
                >
                  <CustomerLayout />
                </PrivateRoute>
              }
            >
              <Route
                path="/customer/dashboard"
                element={<CustomerDashboard />}
              />
              <Route
                path="/customer-dashboard"
                element={<Navigate to="/customer/dashboard" replace />}
              />
              <Route path="/medicines" element={<MedicineShop />} />
              <Route path="/medicine/:id" element={<MedicineDetails />} />
              <Route path="/appointments" element={<CustomerAppointments />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/prescriptions" element={<PrescriptionsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/customer/saved" element={<SavedMedicinesPage />} />
              <Route
                path="/customer/chat/:appointmentId"
                element={<AppointmentChat />}
              />
            </Route>

            {/* ================= CHECKOUT FLOW ================= */}
            <Route
              path="/cart"
              element={
                <PrivateRoute allowedRoles={["customer", "user"]}>
                  <CartPage />
                </PrivateRoute>
              }
            />
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
            <Route
              path="/payment-success"
              element={
                <PrivateRoute allowedRoles={["customer", "user"]}>
                  <PaymentSuccess />
                </PrivateRoute>
              }
            />

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
              <Route path="/pharmacist/alerts" element={<PharmacistAlerts />} />

              {/* ✅ NEW ROUTE FOR REFILL REMINDERS */}
              <Route
                path="/pharmacist/refills"
                element={<PharmacistRefills />}
              />

              <Route
                path="/pharmacist/customers"
                element={<PharmacistCustomers />}
              />
              <Route
                path="/pharmacist/reports"
                element={<PharmacistReports />}
              />
              <Route
                path="/pharmacist/profile"
                element={<PharmacistProfile />}
              />
            </Route>

            {/* ================= DOCTOR ROUTES ================= */}
            <Route
              element={
                <PrivateRoute allowedRoles={["doctor"]}>
                  <DoctorLayout />
                </PrivateRoute>
              }
            >
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route
                path="/doctor-dashboard"
                element={<Navigate to="/doctor/dashboard" replace />}
              />
              <Route
                path="/doctor/appointments"
                element={<DoctorAppointments />}
              />
              <Route path="/doctor/patients" element={<DoctorPatients />} />
              <Route
                path="/doctor/prescriptions"
                element={<DoctorPrescriptions />}
              />
              <Route path="/doctor/profile" element={<DoctorProfile />} />
              <Route
                path="/doctor/chat/:appointmentId"
                element={<AppointmentChat />}
              />
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
