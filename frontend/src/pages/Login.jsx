// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import api from "../services/api"; // ✅ Import API service
// import googleLogo from "../assets/google-logo.png";
// import pharmacyHero from "../assets/pharmacy.jpg";

// const Login = () => {
//   const { login, user } = useAuth(); // Removed loading/error from context, handling locally
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [localLoading, setLocalLoading] = useState(false);
//   const [localError, setLocalError] = useState("");

//   // forgot password modal state
//   const [showForgot, setShowForgot] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotCode, setForgotCode] = useState("");
//   const [forgotStep, setForgotStep] = useState(1); // 1: ask email, 2: code+new pass
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [fpLoading, setFpLoading] = useState(false);
//   const [fpMessage, setFpMessage] = useState("");
//   const [fpError, setFpError] = useState("");

//   const navigate = useNavigate();
//   const location = useLocation();

//   // Handle Google OAuth token in URL
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const token = params.get("token");
//     if (token) {
//       localStorage.setItem("token", token);
//       // We need to fetch the user profile if logging in via Google
//       api
//         .get("/users/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           login(res.data);
//         })
//         .catch((err) => console.error(err));
//     }
//   }, [location, login]);

//   // ✅ Redirect logged-in users by role (Robust & Case-Insensitive)
//   useEffect(() => {
//     if (user) {
//       const role = user.role ? user.role.toLowerCase() : "";

//       switch (role) {
//         case "admin":
//           navigate("/admin/dashboard");
//           break;
//         case "doctor": // ✅ Added Doctor Route
//           navigate("/doctor-dashboard");
//           break;
//         case "pharmacist":
//         case "staff":
//           navigate("/pharmacist/dashboard");
//           break;
//         case "customer":
//         case "user":
//           navigate("/customer-dashboard");
//           break;
//         default:
//           navigate("/dashboard"); // Fallback to route hub
//       }
//     }
//   }, [user, navigate]);

//   // ✅ Normal password login
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       setLocalError("Please enter both email and password");
//       return;
//     }

//     try {
//       setLocalLoading(true);
//       setLocalError("");

//       // 1. Call API
//       const { data } = await api.post("/users/login", { email, password });

//       // 2. Save Token
//       localStorage.setItem("token", data.token);

//       // 3. Update Context (This triggers the useEffect above to redirect)
//       login(data);
//     } catch (err) {
//       console.error(err);
//       setLocalError(err.response?.data?.message || "Invalid email or password");
//     } finally {
//       setLocalLoading(false);
//     }
//   };

//   // Forgot Password handlers
//   const openForgotModal = () => {
//     setShowForgot(true);
//     setForgotEmail(email || "");
//     setForgotCode("");
//     setNewPassword("");
//     setConfirmNewPassword("");
//     setForgotStep(1);
//     setFpMessage("");
//     setFpError("");
//   };

//   const closeForgotModal = () => {
//     setShowForgot(false);
//   };

//   // Step 1: send reset code to email
//   const handleForgotSendCode = async (e) => {
//     e.preventDefault();
//     if (!forgotEmail) {
//       setFpError("Please enter your email.");
//       return;
//     }
//     try {
//       setFpLoading(true);
//       setFpError("");
//       setFpMessage("");

//       // Use API instance instead of fetch for consistency
//       await api.post("/auth/forgot-password", { email: forgotEmail });

//       setFpMessage("Reset code sent to your email.");
//       setForgotStep(2);
//     } catch (err) {
//       setFpError(err.response?.data?.message || "Failed to send reset code.");
//     } finally {
//       setFpLoading(false);
//     }
//   };

//   // Step 2: verify code + new password
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     if (!forgotEmail || !forgotCode || !newPassword || !confirmNewPassword) {
//       setFpError("All fields are required.");
//       return;
//     }
//     if (newPassword !== confirmNewPassword) {
//       setFpError("Passwords do not match.");
//       return;
//     }
//     try {
//       setFpLoading(true);
//       setFpError("");
//       setFpMessage("");

//       await api.post("/auth/reset-password", {
//         email: forgotEmail,
//         code: forgotCode,
//         newPassword,
//       });

//       setFpMessage(
//         "Password reset successfully. You can login with new password.",
//       );
//       setTimeout(() => {
//         setShowForgot(false);
//       }, 2000);
//     } catch (err) {
//       setFpError(err.response?.data?.message || "Failed to reset password.");
//     } finally {
//       setFpLoading(false);
//     }
//   };

//   return (
//     <div className="login-container" style={styles.container}>
//       {/* Header Section */}
//       <header style={styles.header}>
//         <h1 style={styles.title}>💊 Welcome to Smart Pharmacy System</h1>
//         <marquee behavior="scroll" direction="left" style={styles.marquee}>
//           🚑 24/7 Online Medicine Ordering | 💉 Get Discounts on Prescriptions |
//           🏥 Trusted by 10,000+ Customers | 🌿 Health is Wealth!
//         </marquee>
//       </header>

//       {/* Main Content */}
//       <div style={styles.content}>
//         {/* Left Side - Hero / Info */}
//         <div style={styles.left}>
//           <img src={pharmacyHero} alt="Pharmacy" style={styles.heroImage} />
//           <h2 style={styles.slogan}>
//             Your Trusted Partner for Health and Wellness 🌿
//           </h2>
//           <p style={styles.description}>
//             Manage prescriptions, track medicine stock, and connect with
//             pharmacists easily. Simplify healthcare management in one place.
//           </p>
//         </div>

//         {/* Right Side - Login Form */}
//         <div style={styles.right}>
//           <h2 style={styles.loginTitle}>🔐 Login to Continue</h2>

//           {/* Single password login form */}
//           <form onSubmit={handleSubmit} style={styles.form}>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               style={styles.input}
//             />
//             <div style={{ position: "relative" }}>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 style={styles.input}
//               />
//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 style={styles.eyeIcon}
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </span>
//             </div>
//             <button type="submit" disabled={localLoading} style={styles.button}>
//               {localLoading ? "Logging in..." : "Login"}
//             </button>
//           </form>

//           <div style={{ marginTop: "10px" }}>
//             <button
//               type="button"
//               onClick={openForgotModal}
//               style={{
//                 border: "none",
//                 background: "transparent",
//                 color: "#007bff",
//                 cursor: "pointer",
//                 fontSize: "0.9rem",
//               }}
//             >
//               Forgot Password?
//             </button>
//           </div>

//           <div style={{ margin: "15px 0" }}>
//             <a
//               href="http://localhost:5000/api/auth/google"
//               style={styles.googleBtn}
//             >
//               <img
//                 src={googleLogo}
//                 alt="Google"
//                 style={{ width: 20, marginRight: 8 }}
//               />
//               Login with Google
//             </a>
//           </div>

//           {localError && <p style={styles.error}>{localError}</p>}
//           <p style={styles.registerText}>
//             Don’t have an account?{" "}
//             <Link to="/register" style={styles.link}>
//               Register here
//             </Link>
//           </p>
//         </div>
//       </div>

//       {/* Forgot Password Modal */}
//       {showForgot && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modal}>
//             <h3 style={{ marginBottom: "1rem", color: "#007bff" }}>
//               Reset Password
//             </h3>

//             {forgotStep === 1 && (
//               <form onSubmit={handleForgotSendCode} style={styles.form}>
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   required
//                   value={forgotEmail}
//                   onChange={(e) => setForgotEmail(e.target.value)}
//                   style={styles.input}
//                 />
//                 <button
//                   type="submit"
//                   disabled={fpLoading}
//                   style={styles.button}
//                 >
//                   {fpLoading ? "Sending..." : "Send Reset Code"}
//                 </button>
//               </form>
//             )}

//             {forgotStep === 2 && (
//               <form onSubmit={handleResetPassword} style={styles.form}>
//                 <input
//                   type="text"
//                   placeholder="Enter reset code"
//                   required
//                   value={forgotCode}
//                   onChange={(e) => setForgotCode(e.target.value)}
//                   style={styles.input}
//                 />
//                 <input
//                   type="password"
//                   placeholder="New password"
//                   required
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   style={styles.input}
//                 />
//                 <input
//                   type="password"
//                   placeholder="Confirm new password"
//                   required
//                   value={confirmNewPassword}
//                   onChange={(e) => setConfirmNewPassword(e.target.value)}
//                   style={styles.input}
//                 />
//                 <button
//                   type="submit"
//                   disabled={fpLoading}
//                   style={styles.button}
//                 >
//                   {fpLoading ? "Resetting..." : "Reset Password"}
//                 </button>
//               </form>
//             )}

//             {fpError && (
//               <p
//                 style={{ color: "red", marginTop: "10px", fontSize: "0.9rem" }}
//               >
//                 {fpError}
//               </p>
//             )}
//             {fpMessage && (
//               <p
//                 style={{
//                   color: "green",
//                   marginTop: "10px",
//                   fontSize: "0.9rem",
//                 }}
//               >
//                 {fpMessage}
//               </p>
//             )}

//             <button
//               type="button"
//               onClick={closeForgotModal}
//               style={{
//                 marginTop: "15px",
//                 background: "transparent",
//                 border: "1px solid #ccc",
//                 borderRadius: "6px",
//                 padding: "6px 12px",
//                 cursor: "pointer",
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <footer style={styles.footer}>
//         © {new Date().getFullYear()} Smart Pharmacy System | All Rights Reserved
//       </footer>
//     </div>
//   );
// };

// // -------------------------
// // Inline Styles
// // -------------------------
// const styles = {
//   container: {
//     fontFamily: "Poppins, sans-serif",
//     color: "#333",
//     backgroundColor: "#f9f9f9",
//     minHeight: "100vh",
//     display: "flex",
//     flexDirection: "column",
//   },
//   header: {
//     backgroundColor: "#007bff",
//     color: "white",
//     padding: "1rem",
//     textAlign: "center",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//   },
//   title: {
//     margin: 0,
//     fontSize: "1.6rem",
//     fontWeight: "600",
//   },
//   marquee: {
//     marginTop: "8px",
//     color: "#fff",
//     fontSize: "0.95rem",
//   },
//   content: {
//     display: "flex",
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: "2rem",
//     gap: "3rem",
//     flexWrap: "wrap",
//   },
//   left: {
//     flex: 1,
//     minWidth: "300px",
//     maxWidth: "500px",
//     textAlign: "center",
//   },
//   heroImage: {
//     width: "100%",
//     maxWidth: "450px",
//     borderRadius: "12px",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
//   },
//   slogan: {
//     marginTop: "1rem",
//     fontSize: "1.3rem",
//     fontWeight: "600",
//     color: "#007bff",
//   },
//   description: {
//     fontSize: "0.95rem",
//     marginTop: "0.5rem",
//     color: "#555",
//   },
//   right: {
//     flex: 1,
//     minWidth: "300px",
//     maxWidth: "400px",
//     backgroundColor: "white",
//     borderRadius: "12px",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//     padding: "2rem",
//     textAlign: "center",
//   },
//   loginTitle: {
//     marginBottom: "1.5rem",
//     fontWeight: "600",
//     color: "#007bff",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   input: {
//     padding: "10px",
//     marginBottom: "12px",
//     borderRadius: "6px",
//     border: "1px solid #ccc",
//     width: "100%",
//     outline: "none",
//     transition: "0.3s",
//   },
//   eyeIcon: {
//     position: "absolute",
//     right: 10,
//     top: 12,
//     cursor: "pointer",
//   },
//   button: {
//     backgroundColor: "#007bff",
//     color: "white",
//     padding: "10px",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     transition: "0.3s",
//   },
//   googleBtn: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     textDecoration: "none",
//     border: "1px solid #ccc",
//     padding: "8px",
//     borderRadius: "5px",
//     backgroundColor: "#fff",
//   },
//   error: {
//     color: "red",
//     marginTop: "10px",
//   },
//   registerText: {
//     marginTop: "10px",
//     fontSize: "0.95rem",
//   },
//   link: {
//     color: "#007bff",
//     textDecoration: "none",
//     fontWeight: "500",
//   },
//   footer: {
//     backgroundColor: "#f1f1f1",
//     textAlign: "center",
//     padding: "10px",
//     fontSize: "0.9rem",
//     color: "#555",
//   },
//   modalOverlay: {
//     position: "fixed",
//     inset: 0,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   modal: {
//     backgroundColor: "#fff",
//     padding: "1.5rem",
//     borderRadius: "10px",
//     width: "100%",
//     maxWidth: "400px",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//   },
// };

// export default Login;

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import api from "../services/api";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Alert,
//   Spinner,
//   Modal,
// } from "react-bootstrap";
// import {
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   ShieldCheck,
//   Activity,
//   HeartPulse,
//   Stethoscope,
// } from "lucide-react";
// import googleLogo from "../assets/google-logo.png";
// import pharmacyHero from "../assets/pharmacy.jpg"; // Your local image used as the first slide

// const Login = () => {
//   const { login, user } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [localLoading, setLocalLoading] = useState(false);
//   const [localError, setLocalError] = useState("");

//   // Forgot password modal state
//   const [showForgot, setShowForgot] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotCode, setForgotCode] = useState("");
//   const [forgotStep, setForgotStep] = useState(1);
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [fpLoading, setFpLoading] = useState(false);
//   const [fpMessage, setFpMessage] = useState("");
//   const [fpError, setFpError] = useState("");

//   const navigate = useNavigate();
//   const location = useLocation();

//   // --- Image Swapping Logic ---
//   const backgroundImages = [
//     pharmacyHero,
//     "https://images.unsplash.com/photo-1584308666744-24d5e478ac5c?q=80&w=1200&auto=format&fit=crop", // Pills/Pharmacy
//     "https://images.unsplash.com/photo-1576091160550-2173ff9e5fe5?q=80&w=1200&auto=format&fit=crop", // Clinical
//     "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1200&auto=format&fit=crop", // Modern Medical
//   ];
//   const [bgIndex, setBgIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
//     }, 5000); // Swaps image every 5 seconds
//     return () => clearInterval(interval);
//   }, [backgroundImages.length]);

//   // Handle Google OAuth token in URL
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const token = params.get("token");
//     if (token) {
//       localStorage.setItem("token", token);
//       api
//         .get("/users/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           login(res.data);
//         })
//         .catch((err) => console.error(err));
//     }
//   }, [location, login]);

//   // Redirect logged-in users by role
//   useEffect(() => {
//     if (user) {
//       const role = user.role ? user.role.toLowerCase() : "";
//       switch (role) {
//         case "admin":
//           navigate("/admin/dashboard");
//           break;
//         case "doctor":
//           navigate("/doctor-dashboard");
//           break;
//         case "pharmacist":
//         case "staff":
//           navigate("/pharmacist/dashboard");
//           break;
//         case "customer":
//         case "user":
//           navigate("/customer-dashboard");
//           break;
//         default:
//           navigate("/dashboard");
//       }
//     }
//   }, [user, navigate]);

//   // Normal password login
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       setLocalError("Please enter both email and password");
//       return;
//     }

//     try {
//       setLocalLoading(true);
//       setLocalError("");
//       const { data } = await api.post("/users/login", { email, password });
//       localStorage.setItem("token", data.token);
//       login(data);
//     } catch (err) {
//       console.error(err);
//       setLocalError(err.response?.data?.message || "Invalid email or password");
//     } finally {
//       setLocalLoading(false);
//     }
//   };

//   // Forgot Password handlers
//   const openForgotModal = () => {
//     setShowForgot(true);
//     setForgotEmail(email || "");
//     setForgotCode("");
//     setNewPassword("");
//     setConfirmNewPassword("");
//     setForgotStep(1);
//     setFpMessage("");
//     setFpError("");
//   };

//   const closeForgotModal = () => setShowForgot(false);

//   const handleForgotSendCode = async (e) => {
//     e.preventDefault();
//     if (!forgotEmail) {
//       setFpError("Please enter your email.");
//       return;
//     }
//     try {
//       setFpLoading(true);
//       setFpError("");
//       setFpMessage("");
//       await api.post("/auth/forgot-password", { email: forgotEmail });
//       setFpMessage("Reset code sent to your email.");
//       setForgotStep(2);
//     } catch (err) {
//       setFpError(err.response?.data?.message || "Failed to send reset code.");
//     } finally {
//       setFpLoading(false);
//     }
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     if (!forgotEmail || !forgotCode || !newPassword || !confirmNewPassword) {
//       setFpError("All fields are required.");
//       return;
//     }
//     if (newPassword !== confirmNewPassword) {
//       setFpError("Passwords do not match.");
//       return;
//     }
//     try {
//       setFpLoading(true);
//       setFpError("");
//       setFpMessage("");
//       await api.post("/auth/reset-password", {
//         email: forgotEmail,
//         code: forgotCode,
//         newPassword,
//       });

//       setFpMessage(
//         "Password reset successfully. You can login with new password.",
//       );
//       setTimeout(() => setShowForgot(false), 2000);
//     } catch (err) {
//       setFpError(err.response?.data?.message || "Failed to reset password.");
//     } finally {
//       setFpLoading(false);
//     }
//   };

//   return (
//     <div className="login-wrapper min-vh-100 d-flex flex-column bg-light">
//       <Container fluid className="flex-grow-1 p-0">
//         <Row className="g-0 min-vh-100">
//           {/* Left Side - Dynamic Image Slider */}
//           <Col
//             lg={7}
//             className="d-none d-lg-block position-relative overflow-hidden bg-dark"
//           >
//             {backgroundImages.map((img, index) => (
//               <div
//                 key={index}
//                 className="position-absolute w-100 h-100 bg-image-layer"
//                 style={{
//                   backgroundImage: `url(${img})`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                   opacity: index === bgIndex ? 1 : 0,
//                   transform: index === bgIndex ? "scale(1)" : "scale(1.05)",
//                   transition:
//                     "opacity 1.5s ease-in-out, transform 3s ease-in-out",
//                 }}
//               ></div>
//             ))}

//             {/* Gradient Overlay for Text Readability */}
//             <div
//               className="position-absolute w-100 h-100"
//               style={{
//                 background:
//                   "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)",
//               }}
//             ></div>

//             {/* Animated Floating Elements */}
//             <div className="position-relative z-index-1 d-flex flex-column justify-content-center h-100 p-5 text-white">
//               <div className="slide-up">
//                 <div className="d-flex align-items-center gap-3 mb-4">
//                   <div
//                     className="bg-primary bg-opacity-25 p-3 rounded-circle d-flex align-items-center justify-content-center"
//                     style={{ backdropFilter: "blur(10px)" }}
//                   >
//                     <Activity size={40} className="text-info" />
//                   </div>
//                   <h1 className="display-5 fw-black tracking-tight mb-0">
//                     SmartPharmacy
//                   </h1>
//                 </div>
//                 <h2 className="fs-3 fw-light text-info mb-4 slide-up delay-1">
//                   Healthcare, elevated.
//                 </h2>
//               </div>
//               <div className="row g-4 w-75 slide-up delay-2">
//                 <div className="col-6">
//                   <div className="p-3 border border-light border-opacity-25 rounded-3 bg-white bg-opacity-10 feature-card">
//                     <HeartPulse className="text-danger mb-2" size={28} />
//                     <h5 className="fw-bold fs-6">Genuine Medicine</h5>
//                     <p className="small text-white-50 mb-0">
//                       100% authentic pharmaceuticals delivered.
//                     </p>
//                   </div>
//                 </div>
//                 <div className="col-6">
//                   <div className="p-3 border border-light border-opacity-25 rounded-3 bg-white bg-opacity-10 feature-card">
//                     <Stethoscope className="text-info mb-2" size={28} />
//                     <h5 className="fw-bold fs-6">Expert Doctors</h5>
//                     <p className="small text-white-50 mb-0">
//                       Connect instantly with certified professionals.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Col>

//           {/* Right Side - Form Section */}
//           <Col
//             lg={5}
//             className="d-flex align-items-center justify-content-center position-relative"
//           >
//             {/* Mobile-only background blur */}
//             <div
//               className="d-lg-none position-absolute w-100 h-100 z-0"
//               style={{
//                 backgroundImage: `url(${pharmacyHero})`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 filter: "blur(8px) brightness(0.4)",
//               }}
//             ></div>

//             <div className="w-100 z-1 slide-up delay-1 px-4 px-md-5">
//               <div
//                 className="bg-white p-4 p-md-5 rounded-4 shadow-xl"
//                 style={{ maxWidth: "450px", margin: "0 auto" }}
//               >
//                 <div className="text-center mb-4">
//                   <div className="d-inline-flex bg-primary bg-opacity-10 p-3 rounded-circle mb-3">
//                     <ShieldCheck size={32} className="text-primary" />
//                   </div>
//                   <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
//                   <p className="text-muted small mb-0">
//                     Enter your credentials to access your account.
//                   </p>
//                 </div>

//                 {localError && (
//                   <Alert
//                     variant="danger"
//                     className="py-2 small border-0 rounded-3 shadow-sm d-flex align-items-center gap-2 shake-animation"
//                   >
//                     <ShieldCheck size={16} className="flex-shrink-0" />{" "}
//                     {localError}
//                   </Alert>
//                 )}

//                 <Form onSubmit={handleSubmit} className="slide-up delay-2">
//                   <Form.Group className="mb-3">
//                     <Form.Label className="small fw-bold text-dark mb-1">
//                       Email Address
//                     </Form.Label>
//                     <div className="input-group modern-input-group shadow-sm">
//                       <span className="input-group-text bg-light border-end-0 text-muted px-3">
//                         <Mail size={18} />
//                       </span>
//                       <Form.Control
//                         type="email"
//                         placeholder="name@example.com"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         className="bg-light border-start-0 ps-0 shadow-none py-2"
//                       />
//                     </div>
//                   </Form.Group>

//                   <Form.Group className="mb-4">
//                     <div className="d-flex justify-content-between align-items-center mb-1">
//                       <Form.Label className="small fw-bold text-dark mb-0">
//                         Password
//                       </Form.Label>
//                       <button
//                         type="button"
//                         onClick={openForgotModal}
//                         className="btn btn-link text-primary p-0 text-decoration-none small fw-medium hover-text-dark transition-all"
//                         style={{ fontSize: "0.8rem" }}
//                       >
//                         Forgot password?
//                       </button>
//                     </div>
//                     <div className="input-group modern-input-group shadow-sm">
//                       <span className="input-group-text bg-light border-end-0 text-muted px-3">
//                         <Lock size={18} />
//                       </span>
//                       <Form.Control
//                         type={showPassword ? "text" : "password"}
//                         placeholder="••••••••"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         className="bg-light border-start-0 border-end-0 px-0 shadow-none py-2"
//                       />
//                       <span
//                         className="input-group-text bg-light border-start-0 text-muted px-3 cursor-pointer hover-text-primary transition-all"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? (
//                           <EyeOff size={18} />
//                         ) : (
//                           <Eye size={18} />
//                         )}
//                       </span>
//                     </div>
//                   </Form.Group>

//                   <Button
//                     type="submit"
//                     className="w-100 py-2 rounded-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2 btn-gradient-primary hover-lift"
//                     disabled={localLoading}
//                   >
//                     {localLoading ? (
//                       <>
//                         <Spinner
//                           size="sm"
//                           animation="border"
//                           className="opacity-75"
//                         />{" "}
//                         Authenticating...
//                       </>
//                     ) : (
//                       <>
//                         Sign In <ArrowRight size={18} />
//                       </>
//                     )}
//                   </Button>
//                 </Form>

//                 <div className="position-relative my-4 text-center slide-up delay-3">
//                   <hr className="text-muted opacity-25" />
//                   <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 small text-muted fw-bold">
//                     OR
//                   </span>
//                 </div>

//                 <a
//                   href="http://localhost:5000/api/auth/google"
//                   className="btn btn-light w-100 py-2 rounded-3 border border-light-subtle d-flex justify-content-center align-items-center gap-2 text-dark fw-bold shadow-sm hover-bg-white transition-all slide-up delay-3"
//                   style={{ fontSize: "0.95rem" }}
//                 >
//                   <img
//                     src={googleLogo}
//                     alt="Google"
//                     style={{ width: "20px" }}
//                   />
//                   Continue with Google
//                 </a>

//                 <p className="text-center mt-4 mb-0 small text-muted slide-up delay-3">
//                   Don't have an account?{" "}
//                   <Link
//                     to="/register"
//                     className="fw-black text-primary text-decoration-none hover-underline"
//                   >
//                     Create an account
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>

//       {/* Forgot Password Modal */}
//       <Modal
//         show={showForgot}
//         onHide={closeForgotModal}
//         centered
//         backdrop="static"
//         contentClassName="rounded-4 border-0 shadow-lg"
//       >
//         <Modal.Header closeButton className="border-0 pb-0">
//           <Modal.Title className="fw-black text-dark fs-5 d-flex align-items-center gap-2">
//             <Lock size={20} className="text-primary" /> Reset Password
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="pt-3 pb-4 px-4">
//           {fpError && (
//             <Alert variant="danger" className="py-2 small rounded-3 border-0">
//               {fpError}
//             </Alert>
//           )}
//           {fpMessage && (
//             <Alert
//               variant="success"
//               className="py-2 small rounded-3 border-0 bg-success bg-opacity-10 text-success"
//             >
//               {fpMessage}
//             </Alert>
//           )}

//           {forgotStep === 1 && (
//             <Form onSubmit={handleForgotSendCode} className="animate-fade-in">
//               <p className="small text-muted mb-3 lh-sm">
//                 Enter your registered email address. We'll send you a secure
//                 6-digit code to reset your password.
//               </p>
//               <Form.Group className="mb-4">
//                 <Form.Control
//                   type="email"
//                   placeholder="name@example.com"
//                   required
//                   value={forgotEmail}
//                   onChange={(e) => setForgotEmail(e.target.value)}
//                   className="shadow-none py-2 rounded-3 bg-light border-light-subtle"
//                 />
//               </Form.Group>
//               <Button
//                 type="submit"
//                 className="w-100 py-2 fw-bold rounded-3 btn-gradient-primary hover-lift"
//                 disabled={fpLoading}
//               >
//                 {fpLoading ? (
//                   <Spinner size="sm" animation="border" />
//                 ) : (
//                   "Send Reset Code"
//                 )}
//               </Button>
//             </Form>
//           )}

//           {forgotStep === 2 && (
//             <Form onSubmit={handleResetPassword} className="animate-fade-in">
//               <p className="small text-muted mb-3 lh-sm">
//                 Code sent! Please check your email and enter the code below to
//                 secure your new password.
//               </p>
//               <Form.Group className="mb-3">
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter 6-digit code"
//                   required
//                   value={forgotCode}
//                   onChange={(e) => setForgotCode(e.target.value)}
//                   className="shadow-none py-2 mb-3 rounded-3 bg-light border-light-subtle text-center fw-bold tracking-widest"
//                   maxLength="6"
//                 />
//                 <Form.Control
//                   type="password"
//                   placeholder="New password"
//                   required
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className="shadow-none py-2 mb-3 rounded-3 bg-light border-light-subtle"
//                 />
//                 <Form.Control
//                   type="password"
//                   placeholder="Confirm new password"
//                   required
//                   value={confirmNewPassword}
//                   onChange={(e) => setConfirmNewPassword(e.target.value)}
//                   className="shadow-none py-2 rounded-3 bg-light border-light-subtle"
//                 />
//               </Form.Group>
//               <Button
//                 type="submit"
//                 variant="success"
//                 className="w-100 py-2 fw-bold rounded-3 hover-lift border-0 shadow-sm"
//                 disabled={fpLoading}
//                 style={{ backgroundColor: "#067D62" }}
//               >
//                 {fpLoading ? (
//                   <Spinner size="sm" animation="border" />
//                 ) : (
//                   "Confirm New Password"
//                 )}
//               </Button>
//             </Form>
//           )}
//         </Modal.Body>
//       </Modal>

//       {/* Global CSS & Keyframe Animations */}
//       <style>{`
//         .cursor-pointer { cursor: pointer; }
//         .transition-all { transition: all 0.3s ease; }
//         .tracking-tight { letter-spacing: -1px; }
//         .tracking-widest { letter-spacing: 4px; }

//         .hover-text-primary:hover { color: #007185 !important; }
//         .hover-text-dark:hover { color: #0F1111 !important; }
//         .hover-bg-white:hover { background-color: #ffffff !important; transform: translateY(-1px); }
//         .hover-underline:hover { text-decoration: underline !important; }

//         .hover-lift { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease; }
//         .hover-lift:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(0, 113, 133, 0.2) !important; }
//         .hover-lift:active:not(:disabled) { transform: translateY(0); }

//         .feature-card { transition: background 0.3s ease; backdrop-filter: blur(5px); }
//         .feature-card:hover { background: rgba(255, 255, 255, 0.2) !important; }

//         .shadow-xl { box-shadow: 0 20px 40px rgba(0,0,0,0.08); }

//         .btn-gradient-primary {
//           background: linear-gradient(135deg, #007185 0%, #005969 100%);
//           border: none;
//           color: white;
//         }

//         /* Modern Input Focus Effect */
//         .modern-input-group .form-control { border-color: #dee2e6; transition: all 0.3s ease; }
//         .modern-input-group .input-group-text { border-color: #dee2e6; transition: all 0.3s ease; }
//         .modern-input-group:focus-within .form-control,
//         .modern-input-group:focus-within .input-group-text {
//           border-color: #007185 !important;
//           background-color: #fff !important;
//         }
//         .modern-input-group:focus-within {
//           box-shadow: 0 0 0 4px rgba(0, 113, 133, 0.1) !important;
//           border-radius: 0.375rem;
//         }

//         /* Smooth Animations */
//         .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }

//         .slide-up {
//           opacity: 0;
//           animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//         }
//         .delay-1 { animation-delay: 0.1s; }
//         .delay-2 { animation-delay: 0.2s; }
//         .delay-3 { animation-delay: 0.3s; }

//         .shake-animation { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }

//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }

//         @keyframes slideUpFade {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @keyframes shake {
//           10%, 90% { transform: translate3d(-1px, 0, 0); }
//           20%, 80% { transform: translate3d(2px, 0, 0); }
//           30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
//           40%, 60% { transform: translate3d(4px, 0, 0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Login;

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import api from "../services/api";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Alert,
//   Spinner,
//   Modal,
// } from "react-bootstrap";
// import {
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   ShieldCheck,
//   Activity,
//   HeartPulse,
//   Stethoscope,
//   ArrowLeft, // ✅ Added for the back button
// } from "lucide-react";
// import googleLogo from "../assets/google-logo.png";
// import pharmacyHero from "../assets/pharmacy.jpg";

// const Login = () => {
//   const { login, user } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [localLoading, setLocalLoading] = useState(false);
//   const [localError, setLocalError] = useState("");

//   // Forgot password modal state
//   const [showForgot, setShowForgot] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotCode, setForgotCode] = useState("");
//   const [forgotStep, setForgotStep] = useState(1);
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [fpLoading, setFpLoading] = useState(false);
//   const [fpMessage, setFpMessage] = useState("");
//   const [fpError, setFpError] = useState("");

//   const navigate = useNavigate();
//   const location = useLocation();

//   // --- Image Swapping Logic ---
//   const backgroundImages = [
//     pharmacyHero,
//     "https://images.unsplash.com/photo-1584308666744-24d5e478ac5c?q=80&w=1200&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1576091160550-2173ff9e5fe5?q=80&w=1200&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1200&auto=format&fit=crop",
//   ];
//   const [bgIndex, setBgIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [backgroundImages.length]);

//   // Handle Google OAuth token in URL
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const token = params.get("token");
//     if (token) {
//       localStorage.setItem("token", token);
//       api
//         .get("/users/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           login(res.data);
//         })
//         .catch((err) => console.error(err));
//     }
//   }, [location, login]);

//   // Redirect logged-in users by role
//   useEffect(() => {
//     if (user) {
//       const role = user.role ? user.role.toLowerCase() : "";
//       switch (role) {
//         case "admin":
//           navigate("/admin/dashboard");
//           break;
//         case "doctor":
//           navigate("/doctor-dashboard");
//           break;
//         case "pharmacist":
//         case "staff":
//           navigate("/pharmacist/dashboard");
//           break;
//         case "customer":
//         case "user":
//           navigate("/customer-dashboard");
//           break;
//         default:
//           navigate("/dashboard");
//       }
//     }
//   }, [user, navigate]);

//   // Normal password login
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       setLocalError("Please enter both email and password");
//       return;
//     }

//     try {
//       setLocalLoading(true);
//       setLocalError("");
//       const { data } = await api.post("/users/login", { email, password });
//       localStorage.setItem("token", data.token);
//       login(data);
//     } catch (err) {
//       console.error(err);
//       setLocalError(err.response?.data?.message || "Invalid email or password");
//     } finally {
//       setLocalLoading(false);
//     }
//   };

//   // Forgot Password handlers
//   const openForgotModal = () => {
//     setShowForgot(true);
//     setForgotEmail(email || "");
//     setForgotCode("");
//     setNewPassword("");
//     setConfirmNewPassword("");
//     setForgotStep(1);
//     setFpMessage("");
//     setFpError("");
//   };

//   const closeForgotModal = () => setShowForgot(false);

//   const handleForgotSendCode = async (e) => {
//     e.preventDefault();
//     if (!forgotEmail) {
//       setFpError("Please enter your email.");
//       return;
//     }
//     try {
//       setFpLoading(true);
//       setFpError("");
//       setFpMessage("");
//       await api.post("/auth/forgot-password", { email: forgotEmail });
//       setFpMessage("Reset code sent to your email.");
//       setForgotStep(2);
//     } catch (err) {
//       setFpError(err.response?.data?.message || "Failed to send reset code.");
//     } finally {
//       setFpLoading(false);
//     }
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     if (!forgotEmail || !forgotCode || !newPassword || !confirmNewPassword) {
//       setFpError("All fields are required.");
//       return;
//     }
//     if (newPassword !== confirmNewPassword) {
//       setFpError("Passwords do not match.");
//       return;
//     }
//     try {
//       setFpLoading(true);
//       setFpError("");
//       setFpMessage("");
//       await api.post("/auth/reset-password", {
//         email: forgotEmail,
//         code: forgotCode,
//         newPassword,
//       });

//       setFpMessage(
//         "Password reset successfully. You can login with new password.",
//       );
//       setTimeout(() => setShowForgot(false), 2000);
//     } catch (err) {
//       setFpError(err.response?.data?.message || "Failed to reset password.");
//     } finally {
//       setFpLoading(false);
//     }
//   };

//   return (
//     <div className="login-wrapper min-vh-100 d-flex flex-column bg-light">
//       {/* ✅ ADDED: Top Marquee Bar */}
//       <div
//         className="text-white py-2 text-center position-relative z-index-1"
//         style={{ backgroundColor: "#007185" }}
//       >
//         <marquee
//           behavior="scroll"
//           direction="left"
//           className="m-0 small fw-bold"
//           style={{ letterSpacing: "0.5px" }}
//         >
//           🚀 Join 10,000+ Customers &nbsp; | &nbsp; 🚑 24/7 Fast Delivery &nbsp;
//           | &nbsp; 🔒 100% Secure Prescriptions &nbsp; | &nbsp; 🌿 Health is
//           Wealth!
//         </marquee>
//       </div>

//       <Container fluid className="flex-grow-1 p-0">
//         <Row className="g-0 min-vh-100">
//           {/* Left Side - Dynamic Image Slider */}
//           <Col
//             lg={7}
//             className="d-none d-lg-block position-relative overflow-hidden bg-dark"
//           >
//             {backgroundImages.map((img, index) => (
//               <div
//                 key={index}
//                 className="position-absolute w-100 h-100 bg-image-layer"
//                 style={{
//                   backgroundImage: `url(${img})`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                   opacity: index === bgIndex ? 1 : 0,
//                   transform: index === bgIndex ? "scale(1)" : "scale(1.05)",
//                   transition:
//                     "opacity 1.5s ease-in-out, transform 3s ease-in-out",
//                 }}
//               ></div>
//             ))}

//             {/* Gradient Overlay for Text Readability */}
//             <div
//               className="position-absolute w-100 h-100"
//               style={{
//                 background:
//                   "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)",
//               }}
//             ></div>

//             {/* Animated Floating Elements */}
//             <div className="position-relative z-index-1 d-flex flex-column justify-content-center h-100 p-5 text-white">
//               <div className="slide-up">
//                 <div className="d-flex align-items-center gap-3 mb-4">
//                   <div
//                     className="bg-primary bg-opacity-25 p-3 rounded-circle d-flex align-items-center justify-content-center"
//                     style={{ backdropFilter: "blur(10px)" }}
//                   >
//                     <Activity size={40} className="text-info" />
//                   </div>
//                   <h1 className="display-5 fw-black tracking-tight mb-0">
//                     SmartPharmacy
//                   </h1>
//                 </div>
//                 <h2 className="fs-3 fw-light text-info mb-4 slide-up delay-1">
//                   Healthcare, elevated.
//                 </h2>
//               </div>
//               <div className="row g-4 w-75 slide-up delay-2">
//                 <div className="col-6">
//                   <div className="p-3 border border-light border-opacity-25 rounded-3 bg-white bg-opacity-10 feature-card">
//                     <HeartPulse className="text-danger mb-2" size={28} />
//                     <h5 className="fw-bold fs-6">Genuine Medicine</h5>
//                     <p className="small text-white-50 mb-0">
//                       100% authentic pharmaceuticals delivered.
//                     </p>
//                   </div>
//                 </div>
//                 <div className="col-6">
//                   <div className="p-3 border border-light border-opacity-25 rounded-3 bg-white bg-opacity-10 feature-card">
//                     <Stethoscope className="text-info mb-2" size={28} />
//                     <h5 className="fw-bold fs-6">Expert Doctors</h5>
//                     <p className="small text-white-50 mb-0">
//                       Connect instantly with certified professionals.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Col>

//           {/* Right Side - Form Section */}
//           <Col
//             lg={5}
//             className="d-flex align-items-center justify-content-center position-relative"
//           >
//             {/* ✅ ADDED: Return to Home Button */}
//             <div className="position-absolute top-0 start-0 m-4 z-1 slide-up">
//               <Link
//                 to="/"
//                 className="text-muted text-decoration-none hover-text-primary d-inline-flex align-items-center gap-2 transition-all fw-medium"
//               >
//                 <ArrowLeft size={18} /> Return to Home
//               </Link>
//             </div>

//             {/* Mobile-only background blur */}
//             <div
//               className="d-lg-none position-absolute w-100 h-100 z-0"
//               style={{
//                 backgroundImage: `url(${pharmacyHero})`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 filter: "blur(8px) brightness(0.4)",
//               }}
//             ></div>

//             <div className="w-100 z-1 slide-up delay-1 px-4 px-md-5">
//               <div
//                 className="bg-white p-4 p-md-5 rounded-4 shadow-xl"
//                 style={{ maxWidth: "450px", margin: "0 auto" }}
//               >
//                 <div className="text-center mb-4">
//                   <div className="d-inline-flex bg-primary bg-opacity-10 p-3 rounded-circle mb-3">
//                     <ShieldCheck size={32} className="text-primary" />
//                   </div>
//                   <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
//                   <p className="text-muted small mb-0">
//                     Enter your credentials to access your account.
//                   </p>
//                 </div>

//                 {localError && (
//                   <Alert
//                     variant="danger"
//                     className="py-2 small border-0 rounded-3 shadow-sm d-flex align-items-center gap-2 shake-animation"
//                   >
//                     <ShieldCheck size={16} className="flex-shrink-0" />{" "}
//                     {localError}
//                   </Alert>
//                 )}

//                 <Form onSubmit={handleSubmit} className="slide-up delay-2">
//                   <Form.Group className="mb-3">
//                     <Form.Label className="small fw-bold text-dark mb-1">
//                       Email Address
//                     </Form.Label>
//                     <div className="input-group modern-input-group shadow-sm">
//                       <span className="input-group-text bg-light border-end-0 text-muted px-3">
//                         <Mail size={18} />
//                       </span>
//                       <Form.Control
//                         type="email"
//                         placeholder="name@example.com"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         className="bg-light border-start-0 ps-0 shadow-none py-2"
//                       />
//                     </div>
//                   </Form.Group>

//                   <Form.Group className="mb-4">
//                     <div className="d-flex justify-content-between align-items-center mb-1">
//                       <Form.Label className="small fw-bold text-dark mb-0">
//                         Password
//                       </Form.Label>
//                       <button
//                         type="button"
//                         onClick={openForgotModal}
//                         className="btn btn-link text-primary p-0 text-decoration-none small fw-medium hover-text-dark transition-all"
//                         style={{ fontSize: "0.8rem" }}
//                       >
//                         Forgot password?
//                       </button>
//                     </div>
//                     <div className="input-group modern-input-group shadow-sm">
//                       <span className="input-group-text bg-light border-end-0 text-muted px-3">
//                         <Lock size={18} />
//                       </span>
//                       <Form.Control
//                         type={showPassword ? "text" : "password"}
//                         placeholder="••••••••"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         className="bg-light border-start-0 border-end-0 px-0 shadow-none py-2"
//                       />
//                       <span
//                         className="input-group-text bg-light border-start-0 text-muted px-3 cursor-pointer hover-text-primary transition-all"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? (
//                           <EyeOff size={18} />
//                         ) : (
//                           <Eye size={18} />
//                         )}
//                       </span>
//                     </div>
//                   </Form.Group>

//                   <Button
//                     type="submit"
//                     className="w-100 py-2 rounded-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2 btn-gradient-primary hover-lift"
//                     disabled={localLoading}
//                   >
//                     {localLoading ? (
//                       <>
//                         <Spinner
//                           size="sm"
//                           animation="border"
//                           className="opacity-75"
//                         />{" "}
//                         Authenticating...
//                       </>
//                     ) : (
//                       <>
//                         Sign In <ArrowRight size={18} />
//                       </>
//                     )}
//                   </Button>
//                 </Form>

//                 <div className="position-relative my-4 text-center slide-up delay-3">
//                   <hr className="text-muted opacity-25" />
//                   <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 small text-muted fw-bold">
//                     OR
//                   </span>
//                 </div>

//                 <a
//                   href="http://localhost:5000/api/auth/google"
//                   className="btn btn-light w-100 py-2 rounded-3 border border-light-subtle d-flex justify-content-center align-items-center gap-2 text-dark fw-bold shadow-sm hover-bg-white transition-all slide-up delay-3"
//                   style={{ fontSize: "0.95rem" }}
//                 >
//                   <img
//                     src={googleLogo}
//                     alt="Google"
//                     style={{ width: "20px" }}
//                   />
//                   Continue with Google
//                 </a>

//                 <p className="text-center mt-4 mb-0 small text-muted slide-up delay-3">
//                   Don't have an account?{" "}
//                   <Link
//                     to="/register"
//                     className="fw-black text-primary text-decoration-none hover-underline"
//                   >
//                     Create an account
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>

//       {/* ✅ ADDED: Footer / Copyright / Links */}
//       <footer className="py-3 bg-white border-top position-relative z-1 mt-auto">
//         <Container fluid>
//           <Row className="align-items-center text-center text-md-start px-2 px-md-4">
//             <Col md={6} className="mb-2 mb-md-0">
//               <small className="text-muted">
//                 © {new Date().getFullYear()} Smart Pharmacy System | All Rights
//                 Reserved
//               </small>
//             </Col>
//             <Col md={6} className="text-md-end">
//               <div className="small text-muted fw-medium">
//                 <Link
//                   to="/"
//                   className="text-decoration-none mx-2 text-muted hover-text-primary transition-all"
//                 >
//                   Home
//                 </Link>
//                 •
//                 <Link
//                   to="/contact"
//                   className="text-decoration-none mx-2 text-muted hover-text-primary transition-all"
//                 >
//                   Help
//                 </Link>
//                 •
//                 <Link
//                   to="/privacy"
//                   className="text-decoration-none mx-2 text-muted hover-text-primary transition-all"
//                 >
//                   Privacy Policy
//                 </Link>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </footer>

//       {/* Forgot Password Modal */}
//       <Modal
//         show={showForgot}
//         onHide={closeForgotModal}
//         centered
//         backdrop="static"
//         contentClassName="rounded-4 border-0 shadow-lg"
//       >
//         <Modal.Header closeButton className="border-0 pb-0">
//           <Modal.Title className="fw-black text-dark fs-5 d-flex align-items-center gap-2">
//             <Lock size={20} className="text-primary" /> Reset Password
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="pt-3 pb-4 px-4">
//           {fpError && (
//             <Alert variant="danger" className="py-2 small rounded-3 border-0">
//               {fpError}
//             </Alert>
//           )}
//           {fpMessage && (
//             <Alert
//               variant="success"
//               className="py-2 small rounded-3 border-0 bg-success bg-opacity-10 text-success"
//             >
//               {fpMessage}
//             </Alert>
//           )}

//           {forgotStep === 1 && (
//             <Form onSubmit={handleForgotSendCode} className="animate-fade-in">
//               <p className="small text-muted mb-3 lh-sm">
//                 Enter your registered email address. We'll send you a secure
//                 6-digit code to reset your password.
//               </p>
//               <Form.Group className="mb-4">
//                 <Form.Control
//                   type="email"
//                   placeholder="name@example.com"
//                   required
//                   value={forgotEmail}
//                   onChange={(e) => setForgotEmail(e.target.value)}
//                   className="shadow-none py-2 rounded-3 bg-light border-light-subtle"
//                 />
//               </Form.Group>
//               <Button
//                 type="submit"
//                 className="w-100 py-2 fw-bold rounded-3 btn-gradient-primary hover-lift"
//                 disabled={fpLoading}
//               >
//                 {fpLoading ? (
//                   <Spinner size="sm" animation="border" />
//                 ) : (
//                   "Send Reset Code"
//                 )}
//               </Button>
//             </Form>
//           )}

//           {forgotStep === 2 && (
//             <Form onSubmit={handleResetPassword} className="animate-fade-in">
//               <p className="small text-muted mb-3 lh-sm">
//                 Code sent! Please check your email and enter the code below to
//                 secure your new password.
//               </p>
//               <Form.Group className="mb-3">
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter 6-digit code"
//                   required
//                   value={forgotCode}
//                   onChange={(e) => setForgotCode(e.target.value)}
//                   className="shadow-none py-2 mb-3 rounded-3 bg-light border-light-subtle text-center fw-bold tracking-widest"
//                   maxLength="6"
//                 />
//                 <Form.Control
//                   type="password"
//                   placeholder="New password"
//                   required
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className="shadow-none py-2 mb-3 rounded-3 bg-light border-light-subtle"
//                 />
//                 <Form.Control
//                   type="password"
//                   placeholder="Confirm new password"
//                   required
//                   value={confirmNewPassword}
//                   onChange={(e) => setConfirmNewPassword(e.target.value)}
//                   className="shadow-none py-2 rounded-3 bg-light border-light-subtle"
//                 />
//               </Form.Group>
//               <Button
//                 type="submit"
//                 variant="success"
//                 className="w-100 py-2 fw-bold rounded-3 hover-lift border-0 shadow-sm"
//                 disabled={fpLoading}
//                 style={{ backgroundColor: "#067D62" }}
//               >
//                 {fpLoading ? (
//                   <Spinner size="sm" animation="border" />
//                 ) : (
//                   "Confirm New Password"
//                 )}
//               </Button>
//             </Form>
//           )}
//         </Modal.Body>
//       </Modal>

//       {/* Global CSS & Keyframe Animations */}
//       <style>{`
//         .cursor-pointer { cursor: pointer; }
//         .transition-all { transition: all 0.3s ease; }
//         .tracking-tight { letter-spacing: -1px; }
//         .tracking-widest { letter-spacing: 4px; }

//         .hover-text-primary:hover { color: #007185 !important; }
//         .hover-text-dark:hover { color: #0F1111 !important; }
//         .hover-bg-white:hover { background-color: #ffffff !important; transform: translateY(-1px); }
//         .hover-underline:hover { text-decoration: underline !important; }

//         .hover-lift { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease; }
//         .hover-lift:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(0, 113, 133, 0.2) !important; }
//         .hover-lift:active:not(:disabled) { transform: translateY(0); }

//         .feature-card { transition: background 0.3s ease; backdrop-filter: blur(5px); }
//         .feature-card:hover { background: rgba(255, 255, 255, 0.2) !important; }

//         .shadow-xl { box-shadow: 0 20px 40px rgba(0,0,0,0.08); }

//         .btn-gradient-primary {
//           background: linear-gradient(135deg, #007185 0%, #005969 100%);
//           border: none;
//           color: white;
//         }

//         /* Modern Input Focus Effect */
//         .modern-input-group .form-control { border-color: #dee2e6; transition: all 0.3s ease; }
//         .modern-input-group .input-group-text { border-color: #dee2e6; transition: all 0.3s ease; }
//         .modern-input-group:focus-within .form-control,
//         .modern-input-group:focus-within .input-group-text {
//           border-color: #007185 !important;
//           background-color: #fff !important;
//         }
//         .modern-input-group:focus-within {
//           box-shadow: 0 0 0 4px rgba(0, 113, 133, 0.1) !important;
//           border-radius: 0.375rem;
//         }

//         /* Smooth Animations */
//         .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }

//         .slide-up {
//           opacity: 0;
//           animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//         }
//         .delay-1 { animation-delay: 0.1s; }
//         .delay-2 { animation-delay: 0.2s; }
//         .delay-3 { animation-delay: 0.3s; }

//         .shake-animation { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }

//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }

//         @keyframes slideUpFade {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @keyframes shake {
//           10%, 90% { transform: translate3d(-1px, 0, 0); }
//           20%, 80% { transform: translate3d(2px, 0, 0); }
//           30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
//           40%, 60% { transform: translate3d(4px, 0, 0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../services/api";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Activity,
  HeartPulse,
  Stethoscope,
  ArrowLeft,
} from "lucide-react";
import googleLogo from "../assets/google-logo.png";
import pharmacyHero from "../assets/pharmacy.jpg";

const Login = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotStep, setForgotStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMessage, setFpMessage] = useState("");
  const [fpError, setFpError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // --- Image Swapping Logic ---
  const backgroundImages = [
    pharmacyHero,
    "https://images.unsplash.com/photo-1584308666744-24d5e478ac5c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576091160550-2173ff9e5fe5?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1200&auto=format&fit=crop",
  ];
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Handle Google OAuth token in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      api
        .get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          login(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [location, login]);

  // Redirect logged-in users by role
  useEffect(() => {
    if (user) {
      const role = user.role ? user.role.toLowerCase() : "";
      switch (role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "doctor":
          navigate("/doctor-dashboard");
          break;
        case "pharmacist":
        case "staff":
          navigate("/pharmacist/dashboard");
          break;
        case "customer":
        case "user":
          navigate("/customer-dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  // Normal password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError("Please enter both email and password");
      return;
    }

    try {
      setLocalLoading(true);
      setLocalError("");
      const { data } = await api.post("/users/login", { email, password });
      localStorage.setItem("token", data.token);
      login(data);
    } catch (err) {
      console.error(err);
      setLocalError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLocalLoading(false);
    }
  };

  // Forgot Password handlers
  const openForgotModal = () => {
    setShowForgot(true);
    setForgotEmail(email || "");
    setForgotCode("");
    setNewPassword("");
    setConfirmNewPassword("");
    setForgotStep(1);
    setFpMessage("");
    setFpError("");
  };

  const closeForgotModal = () => setShowForgot(false);

  const handleForgotSendCode = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setFpError("Please enter your email.");
      return;
    }
    try {
      setFpLoading(true);
      setFpError("");
      setFpMessage("");
      await api.post("/auth/forgot-password", { email: forgotEmail });
      setFpMessage("Reset code sent to your email.");
      setForgotStep(2);
    } catch (err) {
      setFpError(err.response?.data?.message || "Failed to send reset code.");
    } finally {
      setFpLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotCode || !newPassword || !confirmNewPassword) {
      setFpError("All fields are required.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setFpError("Passwords do not match.");
      return;
    }
    try {
      setFpLoading(true);
      setFpError("");
      setFpMessage("");
      await api.post("/auth/reset-password", {
        email: forgotEmail,
        code: forgotCode,
        newPassword,
      });

      setFpMessage(
        "Password reset successfully. You can login with new password.",
      );
      setTimeout(() => setShowForgot(false), 2000);
    } catch (err) {
      setFpError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="login-wrapper min-vh-100 d-flex flex-column bg-light">
      {/* Top Marquee Bar */}
      <div
        className="text-white py-2 text-center position-relative z-index-1"
        style={{ backgroundColor: "#007185" }}
      >
        <marquee
          behavior="scroll"
          direction="left"
          className="m-0 small fw-bold"
          style={{ letterSpacing: "0.5px" }}
        >
          🚀 Join 10,000+ Customers &nbsp; | &nbsp; 🚑 24/7 Fast Delivery &nbsp;
          | &nbsp; 🔒 100% Secure Prescriptions &nbsp; | &nbsp; 🌿 Health is
          Wealth!
        </marquee>
      </div>

      <Container fluid className="flex-grow-1 p-0">
        <Row className="g-0 min-vh-100">
          {/* Left Side - Form Section */}
          <Col
            lg={5}
            className="d-flex align-items-center justify-content-center position-relative"
          >
            {/* Return to Home Button */}
            <div className="position-absolute top-0 start-0 m-4 z-1 slide-up">
              <Link
                to="/"
                className="text-muted text-decoration-none hover-text-primary d-inline-flex align-items-center gap-2 transition-all fw-medium"
              >
                <ArrowLeft size={18} /> Return to Home
              </Link>
            </div>

            {/* Mobile-only background blur */}
            <div
              className="d-lg-none position-absolute w-100 h-100 z-0"
              style={{
                backgroundImage: `url(${pharmacyHero})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(8px) brightness(0.4)",
              }}
            ></div>

            {/*  REDESIGNED WHITE LOGIN CARD */}
            <div className="w-100 z-1 slide-up delay-1 px-4 px-md-5">
              <div
                className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light-subtle"
                style={{ maxWidth: "420px", margin: "0 auto" }}
              >
                <div className="text-center mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: "56px",
                      height: "56px",
                      backgroundColor: "#e0f2fe",
                    }}
                  >
                    <ShieldCheck size={28} style={{ color: "#2563eb" }} />
                  </div>
                  <h3
                    className="fw-bold mb-1"
                    style={{ color: "#1e293b", letterSpacing: "-0.5px" }}
                  >
                    Welcome Back
                  </h3>
                  <p className="small mb-0" style={{ color: "#64748b" }}>
                    Enter your credentials to access your account.
                  </p>
                </div>

                {localError && (
                  <Alert
                    variant="danger"
                    className="py-2 small border-0 rounded-3 shadow-sm d-flex align-items-center gap-2 shake-animation"
                  >
                    <ShieldCheck size={16} className="flex-shrink-0" />{" "}
                    {localError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} className="slide-up delay-2">
                  {/* Email Field */}
                  <Form.Group className="mb-3">
                    <Form.Label
                      className="small fw-bold mb-1"
                      style={{ color: "#334155" }}
                    >
                      Email Address
                    </Form.Label>
                    <div className="input-group clean-input-group shadow-sm">
                      <span
                        className="input-group-text bg-white border-end-0 px-3"
                        style={{ color: "#94a3b8" }}
                      >
                        <Mail size={18} />
                      </span>
                      <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white border-start-0 ps-0 shadow-none py-2"
                      />
                    </div>
                  </Form.Group>

                  {/* Password Field */}
                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <Form.Label
                        className="small fw-bold mb-0"
                        style={{ color: "#334155" }}
                      >
                        Password
                      </Form.Label>
                      <button
                        type="button"
                        onClick={openForgotModal}
                        className="btn btn-link p-0 text-decoration-none small fw-medium transition-all"
                        style={{ fontSize: "0.8rem", color: "#2563eb" }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="input-group clean-input-group shadow-sm">
                      <span
                        className="input-group-text bg-white border-end-0 px-3"
                        style={{ color: "#94a3b8" }}
                      >
                        <Lock size={18} />
                      </span>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white border-start-0 border-end-0 px-0 shadow-none py-2"
                      />
                      <span
                        className="input-group-text bg-white border-start-0 px-3 cursor-pointer transition-all"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ color: "#94a3b8" }}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </span>
                    </div>
                  </Form.Group>

                  {/* Sign In Button */}
                  <Button
                    type="submit"
                    className="w-100 py-2 rounded-2 fw-bold border-0 shadow-sm d-flex justify-content-center align-items-center gap-2 hover-lift slide-up delay-3"
                    disabled={localLoading}
                    style={{
                      backgroundColor: "#006d77",
                    }} /* Reference Image Teal */
                  >
                    {localLoading ? (
                      <>
                        <Spinner
                          size="sm"
                          animation="border"
                          className="opacity-75"
                        />{" "}
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Sign In <ArrowRight size={18} />
                      </>
                    )}
                  </Button>
                </Form>

                {/* Divider */}
                <div className="d-flex align-items-center my-4 slide-up delay-3">
                  <hr
                    className="flex-grow-1 m-0"
                    style={{ borderColor: "#e2e8f0" }}
                  />
                  <span
                    className="mx-3 small fw-bold"
                    style={{ color: "#94a3b8", fontSize: "0.75rem" }}
                  >
                    OR
                  </span>
                  <hr
                    className="flex-grow-1 m-0"
                    style={{ borderColor: "#e2e8f0" }}
                  />
                </div>

                {/* Google Button */}
                <Button
                  variant="light"
                  className="w-100 py-2 rounded-2 d-flex justify-content-center align-items-center gap-2 text-dark fw-bold shadow-sm hover-bg-light transition-all slide-up delay-3 bg-white"
                  onClick={() =>
                    (window.location.href =
                      "http://localhost:5000/api/auth/google")
                  }
                  style={{ fontSize: "0.95rem", border: "1px solid #e2e8f0" }}
                >
                  <img
                    src={googleLogo}
                    alt="Google"
                    style={{ width: "18px" }}
                  />
                  Continue with Google
                </Button>

                {/* Create Account Link */}
                <p
                  className="text-center mt-4 mb-0 small slide-up delay-3"
                  style={{ color: "#64748b" }}
                >
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="fw-bold text-decoration-none hover-underline"
                    style={{ color: "#2563eb" }}
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-auto"></div>
          </Col>

          {/* Right Side - Dark Gradient & Image Slider */}
          <Col
            lg={7}
            className="d-none d-lg-flex flex-column justify-content-center align-items-center position-relative overflow-hidden"
          >
            {backgroundImages.map((img, index) => (
              <div
                key={index}
                className="position-absolute w-100 h-100 bg-image-layer"
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: index === bgIndex ? 1 : 0,
                  transform: index === bgIndex ? "scale(1)" : "scale(1.05)",
                  transition:
                    "opacity 1.5s ease-in-out, transform 3s ease-in-out",
                }}
              ></div>
            ))}

            {/* Gradient Overlay */}
            <div
              className="position-absolute w-100 h-100"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)",
              }}
            ></div>

            <div
              className="position-relative z-1 text-center px-5 text-white slide-up delay-2"
              style={{ maxWidth: "600px" }}
            >
              <h1
                className="fw-light mb-1"
                style={{ fontSize: "3.5rem", fontFamily: "Georgia, serif" }}
              >
                Welcome
              </h1>
              <h2 className="fw-bold mb-4" style={{ fontSize: "2rem" }}>
                to SmartPharmacy
              </h2>
              <p className="fs-6 opacity-75 lh-lg">
                Discover where excellence in healthcare begins. Our dedicated
                platform and innovative features empower patients to manage
                health effortlessly. Join us for a secure and inspiring medical
                journey!
              </p>

              <div className="d-flex justify-content-center gap-2 mt-5">
                {backgroundImages.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: idx === bgIndex ? "24px" : "8px",
                      height: "8px",
                      backgroundColor:
                        idx === bgIndex ? "#ffffff" : "rgba(255,255,255,0.4)",
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Footer / Copyright */}
      <footer
        className="py-3 position-relative z-index-1"
        style={{
          backgroundColor: "#09090b",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Container fluid>
          <Row className="align-items-center text-center text-md-start px-2 px-md-4">
            <Col md={6} className="mb-2 mb-md-0">
              <small className="text-white-50">
                © {new Date().getFullYear()} Smart Pharmacy System | All Rights
                Reserved
              </small>
            </Col>
            <Col md={6} className="text-md-end">
              <div className="small text-white-50 fw-medium">
                <Link
                  to="/"
                  className="text-decoration-none mx-2 text-white-50 hover-text-blue transition-all"
                >
                  Home
                </Link>
                •
                <Link
                  to="/contact"
                  className="text-decoration-none mx-2 text-white-50 hover-text-blue transition-all"
                >
                  Help
                </Link>
                •
                <Link
                  to="/privacy"
                  className="text-decoration-none mx-2 text-white-50 hover-text-blue transition-all"
                >
                  Privacy Policy
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Forgot Password Modal */}
      <Modal
        show={showForgot}
        onHide={closeForgotModal}
        centered
        backdrop="static"
        contentClassName="rounded-4 border-0 shadow-lg"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-black text-dark fs-5 d-flex align-items-center gap-2">
            <Lock size={20} style={{ color: "#006d77" }} /> Reset Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3 pb-4 px-4">
          {fpError && (
            <Alert variant="danger" className="py-2 small rounded-3 border-0">
              {fpError}
            </Alert>
          )}
          {fpMessage && (
            <Alert
              variant="success"
              className="py-2 small rounded-3 border-0 bg-success bg-opacity-10 text-success"
            >
              {fpMessage}
            </Alert>
          )}

          {forgotStep === 1 && (
            <Form onSubmit={handleForgotSendCode} className="animate-fade-in">
              <p className="small text-muted mb-3 lh-sm">
                Enter your registered email address. We'll send you a secure
                6-digit code to reset your password.
              </p>
              <Form.Group className="mb-4">
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="shadow-none py-2 rounded-3 bg-light border-light-subtle"
                />
              </Form.Group>
              <Button
                type="submit"
                className="w-100 py-2 fw-bold rounded-3 border-0 text-white hover-lift"
                disabled={fpLoading}
                style={{ backgroundColor: "#006d77" }}
              >
                {fpLoading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  "Send Reset Code"
                )}
              </Button>
            </Form>
          )}

          {forgotStep === 2 && (
            <Form onSubmit={handleResetPassword} className="animate-fade-in">
              <p className="small text-muted mb-3 lh-sm">
                Code sent! Please check your email and enter the code below to
                secure your new password.
              </p>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter 6-digit code"
                  required
                  value={forgotCode}
                  onChange={(e) => setForgotCode(e.target.value)}
                  className="shadow-none py-2 mb-3 rounded-3 bg-light border-light-subtle text-center fw-bold tracking-widest"
                  maxLength="6"
                />
                <Form.Control
                  type="password"
                  placeholder="New password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="shadow-none py-2 mb-3 rounded-3 bg-light border-light-subtle"
                />
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="shadow-none py-2 rounded-3 bg-light border-light-subtle"
                />
              </Form.Group>
              <Button
                type="submit"
                variant="success"
                className="w-100 py-2 fw-bold rounded-3 hover-lift border-0 shadow-sm"
                disabled={fpLoading}
                style={{ backgroundColor: "#067D62" }}
              >
                {fpLoading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  "Confirm New Password"
                )}
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Global CSS & Keyframe Animations */}
      <style>{`
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.3s ease; }
        
        .hover-text-primary:hover { color: #007185 !important; }
        .hover-text-blue:hover { color: #0ea5e9 !important; }
        .hover-bg-light:hover { background-color: #f8f9fa !important; }
        .hover-underline:hover { text-decoration: underline !important; }
        
        .hover-lift { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease; }
        .hover-lift:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 109, 119, 0.25) !important; }
        .hover-lift:active:not(:disabled) { transform: translateY(0); }

        /* Clean Input Group Styling (Reference Image Match) */
        .clean-input-group {
          border-radius: 0.375rem;
          border: 1px solid #cbd5e1;
          transition: all 0.2s ease;
          overflow: hidden;
        }
        .clean-input-group:focus-within {
          border-color: #006d77;
          box-shadow: 0 0 0 3px rgba(0, 109, 119, 0.15);
        }
        .clean-input-group .form-control::placeholder {
          color: #94a3b8;
        }

        /* Smooth Animations */
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        
        .slide-up {
          opacity: 0;
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }

        .shake-animation { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default Login;
