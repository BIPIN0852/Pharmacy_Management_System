// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import googleLogo from "../assets/google-logo.png";
// import pharmacyHero from "../assets/pharmacy.jpg"; // add a nice pharmacy/healthcare image to your assets folder

// const Login = () => {
//   const { login, error, loading, user } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Handle Google OAuth token in URL
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const token = params.get("token");
//     if (token) {
//       localStorage.setItem("token", token);
//       navigate("/dashboard");
//     }
//   }, [location, navigate]);

//   // Redirect logged-in users by role
//   useEffect(() => {
//     if (user) {
//       switch (user.role) {
//         case "admin":
//           navigate("/admin-dashboard");
//           break;
//         case "pharmacist":
//           navigate("/pharmacist-dashboard");
//           break;
//         case "customer":
//           navigate("/customer-dashboard");
//           break;
//         default:
//           navigate("/dashboard");
//       }
//     }
//   }, [user, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       alert("Please enter both email and password");
//       return;
//     }
//     await login(email, password);
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
//             <button type="submit" disabled={loading} style={styles.button}>
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>

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

//           {error && <p style={styles.error}>{error}</p>}
//           <p style={styles.registerText}>
//             Don’t have an account?{" "}
//             <Link to="/register" style={styles.link}>
//               Register here
//             </Link>
//           </p>
//         </div>
//       </div>

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
// };

// export default Login;

// src/pages/Login.jsx
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import googleLogo from "../assets/google-logo.png";
// import pharmacyHero from "../assets/pharmacy.jpg";

// const Login = () => {
//   const { login, error, loading, user } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   // NEW: email-code login state
//   const [loginMode, setLoginMode] = useState("password"); // "password" | "code"
//   const [loginCode, setLoginCode] = useState("");
//   const [isSendingLoginCode, setIsSendingLoginCode] = useState(false);
//   const [isVerifyingLoginCode, setIsVerifyingLoginCode] = useState(false);
//   const [loginMessage, setLoginMessage] = useState("");

//   // NEW: forgot password modal state
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
//       navigate("/dashboard");
//     }
//   }, [location, navigate]);

//   // Redirect logged-in users by role
//   useEffect(() => {
//     if (user) {
//       switch (user.role) {
//         case "admin":
//           navigate("/admin-dashboard");
//           break;
//         case "pharmacist":
//           navigate("/pharmacist-dashboard");
//           break;
//         case "customer":
//           navigate("/customer-dashboard");
//           break;
//         default:
//           navigate("/dashboard");
//       }
//     }
//   }, [user, navigate]);

//   // -------------------------
//   // Normal password login
//   // -------------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       alert("Please enter both email and password");
//       return;
//     }
//     await login(email, password);
//   };

//   // -------------------------
//   // Email code login
//   // -------------------------
//   const handleSendLoginCode = async () => {
//     if (!email) {
//       setLoginMessage("Please enter your email first.");
//       return;
//     }
//     try {
//       setIsSendingLoginCode(true);
//       setLoginMessage("");
//       const res = await fetch(
//         "http://localhost:5000/api/auth/send-login-code",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email }),
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) {
//         setLoginMessage(data.message || "Failed to send code.");
//       } else {
//         setLoginMessage("Verification code sent to your email.");
//       }
//     } catch (err) {
//       setLoginMessage("Something went wrong sending the code.");
//     } finally {
//       setIsSendingLoginCode(false);
//     }
//   };

//   const handleVerifyLoginCode = async (e) => {
//     e.preventDefault();
//     if (!email || !loginCode) {
//       setLoginMessage("Email and code are required.");
//       return;
//     }
//     try {
//       setIsVerifyingLoginCode(true);
//       setLoginMessage("");
//       const res = await fetch(
//         "http://localhost:5000/api/auth/verify-login-code",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, code: loginCode }),
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) {
//         setLoginMessage(data.message || "Invalid or expired code.");
//         return;
//       }

//       // Here backend should return token + user info
//       if (data.token) {
//         localStorage.setItem("token", data.token);
//       }
//       if (data.user) {
//         // If your AuthContext has a method like setUser, you should call it here
//         // or you can expose a dedicated "loginWithToken" function from context.
//         // Example:
//         // setUser(data.user);
//       }
//       setLoginMessage("Login successful.");
//       // Redirect by role similar to effect (or just navigate("/dashboard"))
//       navigate("/dashboard");
//     } catch (err) {
//       setLoginMessage("Something went wrong verifying the code.");
//     } finally {
//       setIsVerifyingLoginCode(false);
//     }
//   };

//   // -------------------------
//   // Forgot Password handlers
//   // -------------------------
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
//       const res = await fetch(
//         "http://localhost:5000/api/auth/forgot-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: forgotEmail }),
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) {
//         setFpError(data.message || "Failed to send reset code.");
//       } else {
//         setFpMessage("Reset code sent to your email.");
//         setForgotStep(2);
//       }
//     } catch (err) {
//       setFpError("Something went wrong.");
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
//       const res = await fetch("http://localhost:5000/api/auth/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: forgotEmail,
//           code: forgotCode,
//           newPassword,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setFpError(data.message || "Failed to reset password.");
//       } else {
//         setFpMessage(
//           "Password reset successfully. You can login with new password."
//         );
//         // Optionally auto-close the modal after a short delay
//         setTimeout(() => {
//           setShowForgot(false);
//         }, 2000);
//       }
//     } catch (err) {
//       setFpError("Something went wrong.");
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

//           {/* Toggle between password login and code login */}
//           <div
//             style={{
//               marginBottom: "1rem",
//               display: "flex",
//               gap: "8px",
//               justifyContent: "center",
//             }}
//           >
//             <button
//               type="button"
//               onClick={() => setLoginMode("password")}
//               style={{
//                 ...styles.toggleBtn,
//                 backgroundColor:
//                   loginMode === "password" ? "#007bff" : "#e9ecef",
//                 color: loginMode === "password" ? "#fff" : "#333",
//               }}
//             >
//               Password Login
//             </button>
//             <button
//               type="button"
//               onClick={() => setLoginMode("code")}
//               style={{
//                 ...styles.toggleBtn,
//                 backgroundColor: loginMode === "code" ? "#007bff" : "#e9ecef",
//                 color: loginMode === "code" ? "#fff" : "#333",
//               }}
//             >
//               Email Code Login
//             </button>
//           </div>

//           {loginMode === "password" && (
//             <form onSubmit={handleSubmit} style={styles.form}>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 style={styles.input}
//               />
//               <div style={{ position: "relative" }}>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   style={styles.input}
//                 />
//                 <span
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={styles.eyeIcon}
//                 >
//                   {showPassword ? "🙈" : "👁️"}
//                 </span>
//               </div>
//               <button type="submit" disabled={loading} style={styles.button}>
//                 {loading ? "Logging in..." : "Login"}
//               </button>
//             </form>
//           )}

//           {loginMode === "code" && (
//             <form onSubmit={handleVerifyLoginCode} style={styles.form}>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 style={styles.input}
//               />
//               <div
//                 style={{ display: "flex", gap: "8px", marginBottom: "12px" }}
//               >
//                 <input
//                   type="text"
//                   placeholder="Enter verification code"
//                   value={loginCode}
//                   onChange={(e) => setLoginCode(e.target.value)}
//                   style={{ ...styles.input, marginBottom: 0 }}
//                 />
//                 <button
//                   type="button"
//                   onClick={handleSendLoginCode}
//                   disabled={isSendingLoginCode}
//                   style={{ ...styles.smallButton }}
//                 >
//                   {isSendingLoginCode ? "Sending..." : "Send Code"}
//                 </button>
//               </div>
//               <button
//                 type="submit"
//                 disabled={isVerifyingLoginCode}
//                 style={styles.button}
//               >
//                 {isVerifyingLoginCode ? "Verifying..." : "Login with Code"}
//               </button>
//             </form>
//           )}

//           {loginMessage && (
//             <p style={{ marginTop: "10px", color: "#555", fontSize: "0.9rem" }}>
//               {loginMessage}
//             </p>
//           )}

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

//           {error && <p style={styles.error}>{error}</p>}
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
//   smallButton: {
//     backgroundColor: "#28a745",
//     color: "white",
//     padding: "10px 12px",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     whiteSpace: "nowrap",
//     fontSize: "0.85rem",
//   },
//   toggleBtn: {
//     padding: "6px 10px",
//     borderRadius: "6px",
//     border: "1px solid #ccc",
//     cursor: "pointer",
//     fontSize: "0.8rem",
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
//   // Modal styles
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
// import googleLogo from "../assets/google-logo.png";
// import pharmacyHero from "../assets/pharmacy.jpg";

// const Login = () => {
//   const { login, error, loading, user } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

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
//       navigate("/dashboard");
//     }
//   }, [location, navigate]);

//   // Redirect logged-in users by role
//   useEffect(() => {
//     if (user) {
//       switch (user.role) {
//         // case "admin":
//         //   navigate("/admin-dashboard");
//         //   break;
//         case "pharmacist":
//           navigate("/pharmacist-dashboard");
//           break;
//         case "customer":
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
//       alert("Please enter both email and password");
//       return;
//     }
//     await login(email, password);
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
//       const res = await fetch(
//         "http://localhost:5000/api/auth/forgot-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: forgotEmail }),
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) {
//         setFpError(data.message || "Failed to send reset code.");
//       } else {
//         setFpMessage("Reset code sent to your email.");
//         setForgotStep(2);
//       }
//     } catch (err) {
//       setFpError("Something went wrong.");
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
//       const res = await fetch("http://localhost:5000/api/auth/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: forgotEmail,
//           code: forgotCode,
//           newPassword,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setFpError(data.message || "Failed to reset password.");
//       } else {
//         setFpMessage(
//           "Password reset successfully. You can login with new password."
//         );
//         setTimeout(() => {
//           setShowForgot(false);
//         }, 2000);
//       }
//     } catch (err) {
//       setFpError("Something went wrong.");
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
//             <button type="submit" disabled={loading} style={styles.button}>
//               {loading ? "Logging in..." : "Login"}
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

//           {error && <p style={styles.error}>{error}</p>}
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

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../services/api"; // ✅ Import API service
import googleLogo from "../assets/google-logo.png";
import pharmacyHero from "../assets/pharmacy.jpg";

const Login = () => {
  const { login, user } = useAuth(); // Removed loading/error from context, handling locally
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  // forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1: ask email, 2: code+new pass
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMessage, setFpMessage] = useState("");
  const [fpError, setFpError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Handle Google OAuth token in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // We need to fetch the user profile if logging in via Google
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

  // ✅ Redirect logged-in users by role (Robust & Case-Insensitive)
  useEffect(() => {
    if (user) {
      const role = user.role ? user.role.toLowerCase() : "";

      switch (role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "pharmacist":
        case "staff":
          navigate("/pharmacist/dashboard"); // ✅ Fixed Pharmacist Route
          break;
        case "customer":
          navigate("/customer-dashboard");
          break;
        default:
          navigate("/dashboard"); // Fallback to route hub
      }
    }
  }, [user, navigate]);

  // ✅ Normal password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError("Please enter both email and password");
      return;
    }

    try {
      setLocalLoading(true);
      setLocalError("");

      // 1. Call API
      const { data } = await api.post("/users/login", { email, password });

      // 2. Save Token
      localStorage.setItem("token", data.token);

      // 3. Update Context (This triggers the useEffect above to redirect)
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

  const closeForgotModal = () => {
    setShowForgot(false);
  };

  // Step 1: send reset code to email
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

      // Use API instance instead of fetch for consistency
      await api.post("/auth/forgot-password", { email: forgotEmail });

      setFpMessage("Reset code sent to your email.");
      setForgotStep(2);
    } catch (err) {
      setFpError(err.response?.data?.message || "Failed to send reset code.");
    } finally {
      setFpLoading(false);
    }
  };

  // Step 2: verify code + new password
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
        "Password reset successfully. You can login with new password."
      );
      setTimeout(() => {
        setShowForgot(false);
      }, 2000);
    } catch (err) {
      setFpError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="login-container" style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.title}>💊 Welcome to Smart Pharmacy System</h1>
        <marquee behavior="scroll" direction="left" style={styles.marquee}>
          🚑 24/7 Online Medicine Ordering | 💉 Get Discounts on Prescriptions |
          🏥 Trusted by 10,000+ Customers | 🌿 Health is Wealth!
        </marquee>
      </header>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Left Side - Hero / Info */}
        <div style={styles.left}>
          <img src={pharmacyHero} alt="Pharmacy" style={styles.heroImage} />
          <h2 style={styles.slogan}>
            Your Trusted Partner for Health and Wellness 🌿
          </h2>
          <p style={styles.description}>
            Manage prescriptions, track medicine stock, and connect with
            pharmacists easily. Simplify healthcare management in one place.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div style={styles.right}>
          <h2 style={styles.loginTitle}>🔐 Login to Continue</h2>

          {/* Single password login form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <button type="submit" disabled={localLoading} style={styles.button}>
              {localLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={{ marginTop: "10px" }}>
            <button
              type="button"
              onClick={openForgotModal}
              style={{
                border: "none",
                background: "transparent",
                color: "#007bff",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Forgot Password?
            </button>
          </div>

          <div style={{ margin: "15px 0" }}>
            <a
              href="http://localhost:5000/api/auth/google"
              style={styles.googleBtn}
            >
              <img
                src={googleLogo}
                alt="Google"
                style={{ width: 20, marginRight: 8 }}
              />
              Login with Google
            </a>
          </div>

          {localError && <p style={styles.error}>{localError}</p>}
          <p style={styles.registerText}>
            Don’t have an account?{" "}
            <Link to="/register" style={styles.link}>
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ marginBottom: "1rem", color: "#007bff" }}>
              Reset Password
            </h3>

            {forgotStep === 1 && (
              <form onSubmit={handleForgotSendCode} style={styles.form}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  style={styles.input}
                />
                <button
                  type="submit"
                  disabled={fpLoading}
                  style={styles.button}
                >
                  {fpLoading ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleResetPassword} style={styles.form}>
                <input
                  type="text"
                  placeholder="Enter reset code"
                  required
                  value={forgotCode}
                  onChange={(e) => setForgotCode(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="password"
                  placeholder="New password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  style={styles.input}
                />
                <button
                  type="submit"
                  disabled={fpLoading}
                  style={styles.button}
                >
                  {fpLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            {fpError && (
              <p
                style={{ color: "red", marginTop: "10px", fontSize: "0.9rem" }}
              >
                {fpError}
              </p>
            )}
            {fpMessage && (
              <p
                style={{
                  color: "green",
                  marginTop: "10px",
                  fontSize: "0.9rem",
                }}
              >
                {fpMessage}
              </p>
            )}

            <button
              type="button"
              onClick={closeForgotModal}
              style={{
                marginTop: "15px",
                background: "transparent",
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        © {new Date().getFullYear()} Smart Pharmacy System | All Rights Reserved
      </footer>
    </div>
  );
};

// -------------------------
// Inline Styles
// -------------------------
const styles = {
  container: {
    fontFamily: "Poppins, sans-serif",
    color: "#333",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "1rem",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    fontSize: "1.6rem",
    fontWeight: "600",
  },
  marquee: {
    marginTop: "8px",
    color: "#fff",
    fontSize: "0.95rem",
  },
  content: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    gap: "3rem",
    flexWrap: "wrap",
  },
  left: {
    flex: 1,
    minWidth: "300px",
    maxWidth: "500px",
    textAlign: "center",
  },
  heroImage: {
    width: "100%",
    maxWidth: "450px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  slogan: {
    marginTop: "1rem",
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#007bff",
  },
  description: {
    fontSize: "0.95rem",
    marginTop: "0.5rem",
    color: "#555",
  },
  right: {
    flex: 1,
    minWidth: "300px",
    maxWidth: "400px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "2rem",
    textAlign: "center",
  },
  loginTitle: {
    marginBottom: "1.5rem",
    fontWeight: "600",
    color: "#007bff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    outline: "none",
    transition: "0.3s",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
    cursor: "pointer",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.3s",
  },
  googleBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    border: "1px solid #ccc",
    padding: "8px",
    borderRadius: "5px",
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  registerText: {
    marginTop: "10px",
    fontSize: "0.95rem",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "500",
  },
  footer: {
    backgroundColor: "#f1f1f1",
    textAlign: "center",
    padding: "10px",
    fontSize: "0.9rem",
    color: "#555",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
};

export default Login;
