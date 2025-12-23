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

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import VerifyOtp from "./pages/VerifyOTP";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard"; // still used inside AdminLayout
import PharmacistDashboard from "./pages/PharmacistDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Shipping from "./pages/Shipping";
import PlaceOrder from "./pages/PlaceOrder";
import "bootstrap/dist/css/bootstrap.min.css";

import OrderConfirmation from "./components/OrderConfirm";
import AdminLogin from "./pages/AdminLogin";
import AdminResetPassword from "./pages/AdminResetPassword";
import Payment from "./pages/Payment";

import AdminLayout from "./pages/AdminLayout";
import ProfilePage from "./pages/ProfilePage";
import CustomerAppointments from "./pages/CustomerAppointments";
// customer medicines listing page
import CustomerMedicines from "./pages/CustomerMedicines";

// footer info pages and layout
import RootLayout from "./layouts/RootLayout";

import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import Privacy from "./pages/Privacy";

// PrivateRoute with role-based access
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

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Dashboard Redirector
const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "pharmacist":
    case "staff":
      return <Navigate to="/pharmacist-dashboard" replace />;
    case "customer":
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
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* Public informational pages used by footer */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Role redirect */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardRedirect />
                </PrivateRoute>
              }
            />

            {/* Profile (any logged-in user) */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            {/* Checkout flow (customer) */}
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/shipping"
              element={
                <PrivateRoute allowedRoles={["customer"]}>
                  <Shipping />
                </PrivateRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <PrivateRoute allowedRoles={["customer"]}>
                  <Payment />
                </PrivateRoute>
              }
            />
            <Route
              path="/placeorder"
              element={
                <PrivateRoute allowedRoles={["customer"]}>
                  <PlaceOrder />
                </PrivateRoute>
              }
            />

            {/* Payment Success */}
            <Route path="/payment-success" element={<OrderConfirmation />} />

            {/* Admin section – SINGLE layout with internal routing */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin-reset-password"
              element={<AdminResetPassword />}
            />

            {/* Pharmacist / staff */}
            <Route
              path="/pharmacist-dashboard"
              element={
                <PrivateRoute allowedRoles={["pharmacist", "staff"]}>
                  <PharmacistDashboard />
                </PrivateRoute>
              }
            />

            {/* Customer */}
            <Route
              path="/customer-dashboard"
              element={
                <PrivateRoute allowedRoles={["customer"]}>
                  <CustomerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer-appointments"
              element={
                <PrivateRoute allowedRoles={["customer"]}>
                  <CustomerAppointments />
                </PrivateRoute>
              }
            />
            <Route
              path="/medicines"
              element={
                <PrivateRoute allowedRoles={["customer"]}>
                  <CustomerMedicines />
                </PrivateRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </RootLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
