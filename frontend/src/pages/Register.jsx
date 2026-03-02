// import { useState } from "react";
// import api from "../services/api";
// import { Link, useNavigate } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";

// export default function Register() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const navigate = useNavigate();

//   const checkPasswordStrength = (password) => {
//     let strength = 0;
//     if (password.length >= 8) strength++;
//     if (/[A-Z]/.test(password)) strength++;
//     if (/[0-9]/.test(password)) strength++;
//     if (/[^A-Za-z0-9]/.test(password)) strength++;

//     if (strength <= 1) return "Weak";
//     if (strength === 2) return "Medium";
//     return "Strong";
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMessage("");
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (name === "password") {
//       const strength = checkPasswordStrength(value);
//       setPasswordStrength(strength);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     if (formData.password !== formData.confirmPassword) {
//       setMessage("Passwords do not match.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const res = await api.post("/auth/register", {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//       });

//       setMessage(res.message || "Verification code sent to your email.");
//       localStorage.setItem("pendingEmail", formData.email);
//       setTimeout(() => navigate("/verify-otp"), 1500);
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Registration failed.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getStrengthColor = () => {
//     if (passwordStrength === "Weak") return "#dc2626";
//     if (passwordStrength === "Medium") return "#ca8a04";
//     if (passwordStrength === "Strong") return "#16a34a";
//     return "#6b7280";
//   };

//   return (
//     <div style={styles.page}>
//       <Link to="/" style={styles.brandLink}>
//         <span style={styles.brandLogo}>💊</span>
//         <span style={styles.brandText}>Smart Pharmacy System</span>
//       </Link>

//       <form onSubmit={handleSubmit} style={styles.card}>
//         <h2 style={styles.cardTitle}>Create an account</h2>
//         <p style={styles.cardSubtitle}>
//           Register to access the Smart Pharmacy System as a customer.
//         </p>

//         <input
//           type="text"
//           name="name"
//           placeholder="Full name"
//           value={formData.name}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email address"
//           value={formData.email}
//           onChange={handleChange}
//           style={styles.input}
//           required
//         />

//         <div style={styles.passwordField}>
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             style={styles.input}
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword((v) => !v)}
//             style={styles.eyeButton}
//           >
//             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>

//         {formData.password && (
//           <p style={{ ...styles.passwordStrength, color: getStrengthColor() }}>
//             {passwordStrength} password
//           </p>
//         )}

//         <div style={styles.passwordField}>
//           <input
//             type={showConfirmPassword ? "text" : "password"}
//             name="confirmPassword"
//             placeholder="Confirm password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             style={styles.input}
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowConfirmPassword((v) => !v)}
//             style={styles.eyeButton}
//           >
//             {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           style={{
//             ...styles.submitButton,
//             opacity: isLoading ? 0.8 : 1,
//             cursor: isLoading ? "wait" : "pointer",
//           }}
//         >
//           {isLoading
//             ? "Sending verification code..."
//             : "Send verification code"}
//         </button>

//         {message && (
//           <p
//             style={{
//               ...styles.message,
//               color:
//                 message.toLowerCase().includes("success") ||
//                 message.toLowerCase().includes("sent")
//                   ? "#16a34a"
//                   : "#dc2626",
//             }}
//           >
//             {message}
//           </p>
//         )}

//         <div style={styles.footerRow}>
//           <span style={styles.footerText}>Already have an account? </span>
//           <Link to="/login" style={styles.footerLink}>
//             Log in
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background:
//       "radial-gradient(circle at top, #e0f2fe 0, #f9fafb 55%, #f3f4f6 100%)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "1.5rem",
//     fontFamily:
//       "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
//     color: "#111827",
//   },
//   brandLink: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 24,
//     textDecoration: "none",
//   },
//   brandLogo: {
//     width: 36,
//     height: 36,
//     borderRadius: "999px",
//     backgroundColor: "#e0f2fe",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "1.2rem",
//   },
//   brandText: {
//     fontSize: "1.1rem",
//     fontWeight: 600,
//     background: "linear-gradient(to right, #0ea5e9, #2563eb)",
//     WebkitBackgroundClip: "text",
//     color: "transparent",
//   },
//   card: {
//     width: "100%",
//     maxWidth: 420,
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     padding: "1.75rem 1.5rem 1.5rem",
//     boxShadow: "0 18px 45px rgba(15,23,42,0.16)",
//     border: "1px solid #e5e7eb",
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//   },
//   cardTitle: {
//     fontSize: "1.2rem",
//     fontWeight: 600,
//     textAlign: "center",
//     marginBottom: 4,
//   },
//   cardSubtitle: {
//     fontSize: "0.88rem",
//     color: "#6b7280",
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   input: {
//     width: "100%",
//     padding: "9px 10px",
//     borderRadius: 8,
//     border: "1px solid #d1d5db",
//     fontSize: "0.9rem",
//     outline: "none",
//     color: "#111827",
//     backgroundColor: "#ffffff",
//   },
//   passwordField: {
//     position: "relative",
//   },
//   eyeButton: {
//     position: "absolute",
//     right: 8,
//     top: "50%",
//     transform: "translateY(-50%)",
//     border: "none",
//     background: "transparent",
//     cursor: "pointer",
//     color: "#6b7280",
//   },
//   passwordStrength: {
//     fontSize: "0.78rem",
//     marginTop: 4,
//     fontWeight: 600,
//   },
//   submitButton: {
//     width: "100%",
//     marginTop: 4,
//     background: "linear-gradient(to right, #2563eb, #1d4ed8)",
//     color: "#ffffff",
//     borderRadius: 999,
//     border: "none",
//     padding: "9px 12px",
//     fontSize: "0.9rem",
//     fontWeight: 500,
//   },
//   message: {
//     marginTop: 8,
//     fontSize: "0.85rem",
//     textAlign: "center",
//   },
//   footerRow: {
//     marginTop: 10,
//     textAlign: "center",
//     fontSize: "0.86rem",
//   },
//   footerText: {
//     color: "#6b7280",
//   },
//   footerLink: {
//     color: "#2563eb",
//     marginLeft: 4,
//     textDecoration: "underline",
//     fontWeight: 500,
//   },
// };

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Container,
//   Card,
//   Form,
//   Button,
//   InputGroup,
//   Alert,
//   ProgressBar,
// } from "react-bootstrap";
// import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react";
// import api from "../services/api";

// export default function Register() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState(0);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Calculate Password Strength (0-4)
//   const calculateStrength = (password) => {
//     let strength = 0;
//     if (password.length >= 8) strength += 1;
//     if (/[A-Z]/.test(password)) strength += 1;
//     if (/[0-9]/.test(password)) strength += 1;
//     if (/[^A-Za-z0-9]/.test(password)) strength += 1;
//     return strength;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setError("");
//     setMessage("");

//     if (name === "password") {
//       setPasswordStrength(calculateStrength(value));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     if (passwordStrength < 2) {
//       setError("Please choose a stronger password.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // ✅ API Call
//       const res = await api.post("/auth/register", {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//       });

//       setMessage(res.data?.message || "Verification code sent to your email.");

//       // Store email for the OTP page
//       localStorage.setItem("pendingEmail", formData.email);

//       // Redirect after short delay
//       setTimeout(() => navigate("/verify-otp"), 1500);
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Registration failed. Please try again.",
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Helper for strength bar color
//   const getStrengthVariant = () => {
//     if (passwordStrength <= 1) return "danger";
//     if (passwordStrength === 2) return "warning";
//     if (passwordStrength >= 3) return "success";
//     return "secondary";
//   };

//   return (
//     <div
//       className="d-flex align-items-center min-vh-100 fade-in"
//       style={{
//         background:
//           "radial-gradient(circle at top left, #e0f2fe, #f0f9ff, #ffffff)",
//       }}
//     >
//       <Container style={{ maxWidth: "480px" }}>
//         {/* Brand Logo */}
//         <div className="text-center mb-4">
//           <div
//             className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-2 shadow-sm"
//             style={{ width: 48, height: 48, fontSize: "1.5rem" }}
//           >
//             💊
//           </div>
//           <h4 className="fw-bold text-primary mb-0">Smart Pharmacy</h4>
//         </div>

//         <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
//           <Card.Body className="p-4 p-md-5">
//             <div className="text-center mb-4">
//               <h2 className="fw-bold mb-1">Create Account</h2>
//               <p className="text-muted small">
//                 Join us to manage your health better.
//               </p>
//             </div>

//             {error && (
//               <Alert variant="danger" className="py-2 small">
//                 {error}
//               </Alert>
//             )}
//             {message && (
//               <Alert variant="success" className="py-2 small">
//                 {message}
//               </Alert>
//             )}

//             <Form onSubmit={handleSubmit}>
//               {/* Full Name */}
//               <Form.Group className="mb-3">
//                 <Form.Label className="small fw-medium">Full Name</Form.Label>
//                 <InputGroup>
//                   <InputGroup.Text className="bg-light border-end-0 text-muted">
//                     <User size={18} />
//                   </InputGroup.Text>
//                   <Form.Control
//                     type="text"
//                     name="name"
//                     placeholder="John Doe"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="bg-light border-start-0 shadow-none"
//                     required
//                   />
//                 </InputGroup>
//               </Form.Group>

//               {/* Email */}
//               <Form.Group className="mb-3">
//                 <Form.Label className="small fw-medium">
//                   Email Address
//                 </Form.Label>
//                 <InputGroup>
//                   <InputGroup.Text className="bg-light border-end-0 text-muted">
//                     <Mail size={18} />
//                   </InputGroup.Text>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     placeholder="name@example.com"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="bg-light border-start-0 shadow-none"
//                     required
//                   />
//                 </InputGroup>
//               </Form.Group>

//               {/* Password */}
//               <Form.Group className="mb-2">
//                 <Form.Label className="small fw-medium">Password</Form.Label>
//                 <InputGroup>
//                   <InputGroup.Text className="bg-light border-end-0 text-muted">
//                     <Lock size={18} />
//                   </InputGroup.Text>
//                   <Form.Control
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     placeholder="Create a password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="bg-light border-start-0 border-end-0 shadow-none"
//                     required
//                   />
//                   <InputGroup.Text
//                     className="bg-light border-start-0 text-muted cursor-pointer"
//                     onClick={() => setShowPassword(!showPassword)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </InputGroup.Text>
//                 </InputGroup>
//               </Form.Group>

//               {/* Password Strength Meter */}
//               {formData.password && (
//                 <div className="mb-3">
//                   <ProgressBar
//                     now={(passwordStrength / 4) * 100}
//                     variant={getStrengthVariant()}
//                     style={{ height: "4px" }}
//                     className="mb-1"
//                   />
//                   <div className="d-flex justify-content-between">
//                     <small
//                       className="text-muted"
//                       style={{ fontSize: "0.7rem" }}
//                     >
//                       Strength
//                     </small>
//                     <small
//                       className={`fw-bold text-${getStrengthVariant()}`}
//                       style={{ fontSize: "0.7rem" }}
//                     >
//                       {passwordStrength <= 1
//                         ? "Weak"
//                         : passwordStrength === 2
//                           ? "Medium"
//                           : "Strong"}
//                     </small>
//                   </div>
//                 </div>
//               )}

//               {/* Confirm Password */}
//               <Form.Group className="mb-4">
//                 <Form.Label className="small fw-medium">
//                   Confirm Password
//                 </Form.Label>
//                 <InputGroup>
//                   <InputGroup.Text className="bg-light border-end-0 text-muted">
//                     <Lock size={18} />
//                   </InputGroup.Text>
//                   <Form.Control
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     placeholder="Repeat password"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className="bg-light border-start-0 border-end-0 shadow-none"
//                     required
//                   />
//                   <InputGroup.Text
//                     className="bg-light border-start-0 text-muted cursor-pointer"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff size={18} />
//                     ) : (
//                       <Eye size={18} />
//                     )}
//                   </InputGroup.Text>
//                 </InputGroup>
//               </Form.Group>

//               <Button
//                 type="submit"
//                 variant="primary"
//                 className="w-100 rounded-pill py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm" />{" "}
//                     Sending Code...
//                   </>
//                 ) : (
//                   <>
//                     Sign Up <ArrowRight size={18} />
//                   </>
//                 )}
//               </Button>
//             </Form>

//             <div className="text-center mt-4 pt-3 border-top">
//               <span className="text-muted small">
//                 Already have an account?{" "}
//               </span>
//               <Link
//                 to="/login"
//                 className="text-decoration-none fw-bold text-primary"
//               >
//                 Log In
//               </Link>
//             </div>
//           </Card.Body>
//         </Card>

//         {/* Footer Links */}
//         <div className="text-center mt-4">
//           <Link to="/" className="text-muted text-decoration-none small mx-2">
//             Home
//           </Link>
//           <span className="text-muted small">•</span>
//           <Link
//             to="/contact"
//             className="text-muted text-decoration-none small mx-2"
//           >
//             Help
//           </Link>
//           <span className="text-muted small">•</span>
//           <Link
//             to="/privacy"
//             className="text-muted text-decoration-none small mx-2"
//           >
//             Privacy
//           </Link>
//         </div>
//       </Container>
//     </div>
//   );
// }

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Container,
//   Card,
//   Form,
//   Button,
//   InputGroup,
//   Alert,
//   ProgressBar,
//   Row,
//   Col,
// } from "react-bootstrap";
// import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react";
// import api from "../services/api";

// export default function Register() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState(0);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const calculateStrength = (password) => {
//     let strength = 0;
//     if (password.length >= 8) strength += 1;
//     if (/[A-Z]/.test(password)) strength += 1;
//     if (/[0-9]/.test(password)) strength += 1;
//     if (/[^A-Za-z0-9]/.test(password)) strength += 1;
//     return strength;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setError("");
//     setMessage("");
//     if (name === "password") {
//       setPasswordStrength(calculateStrength(value));
//     }
//   };

//   const handleGoogleSignup = () => {
//     // Redirect to your backend Google Auth route
//     window.location.href = "http://localhost:5000/api/auth/google";
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     if (passwordStrength < 2) {
//       setError("Please choose a stronger password.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const res = await api.post("/auth/register", {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//       });

//       setMessage(res.data?.message || "Verification code sent to your email.");
//       localStorage.setItem("pendingEmail", formData.email);
//       setTimeout(() => navigate("/verify-otp"), 1500);
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Registration failed. Please try again.",
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getStrengthVariant = () => {
//     if (passwordStrength <= 1) return "danger";
//     if (passwordStrength === 2) return "warning";
//     if (passwordStrength >= 3) return "success";
//     return "secondary";
//   };

//   return (
//     <div
//       className="d-flex align-items-center min-vh-100 py-5"
//       style={{ backgroundColor: "#f0f2f2", fontFamily: "'Inter', sans-serif" }}
//     >
//       <Container>
//         <Row className="justify-content-center align-items-center g-0">
//           {/* Left Column: Image & Marketing (Hidden on Mobile) */}
//           <Col lg={5} className="d-none d-lg-block">
//             <div className="p-5 text-center bg-white rounded-start-4 shadow-lg h-100 d-flex flex-column justify-content-center border-end">
//               <img
//                 src="https://img.freepik.com/free-vector/pharmacist-concept-illustration_114360-3031.jpg"
//                 alt="Healthcare Professional"
//                 className="img-fluid mb-4 rounded-3"
//                 style={{ maxHeight: "300px", objectFit: "cover" }}
//               />
//               <h3 className="fw-bold text-dark mb-3">
//                 Your Health, Simplified.
//               </h3>
//               <p className="text-muted">
//                 Join thousands of patients managing prescriptions and healthcare
//                 needs through our secure platform.
//               </p>
//             </div>
//           </Col>

//           {/* Right Column: Register Form */}
//           <Col lg={5} md={8}>
//             <Card className="border-0 shadow-lg rounded-4 rounded-lg-start-0 overflow-hidden">
//               <Card.Body className="p-4 p-md-5">
//                 <div className="text-center mb-4">
//                   <div className="d-inline-flex align-items-center gap-2 mb-2">
//                     <span style={{ fontSize: "2rem" }}>💊</span>
//                     <h4 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
//                       SmartPharmacy
//                     </h4>
//                   </div>
//                   <h2 className="fw-bold mb-1" style={{ fontSize: "1.5rem" }}>
//                     Create Account
//                   </h2>
//                 </div>

//                 {/* Google Signup Button */}
//                 <Button
//                   variant="outline-dark"
//                   className="w-100 mb-4 d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm rounded-1"
//                   style={{ borderColor: "#D5D9D9", fontWeight: "500" }}
//                   onClick={handleGoogleSignup}
//                 >
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
//                     alt="Google"
//                     width="18"
//                   />
//                   Sign up with Google
//                 </Button>

//                 <div className="position-relative mb-4">
//                   <hr style={{ borderColor: "#D5D9D9" }} />
//                   <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
//                     or
//                   </span>
//                 </div>

//                 {error && (
//                   <Alert
//                     variant="danger"
//                     className="py-2 small border-0 rounded-1"
//                   >
//                     {error}
//                   </Alert>
//                 )}
//                 {message && (
//                   <Alert
//                     variant="success"
//                     className="py-2 small border-0 rounded-1"
//                   >
//                     {message}
//                   </Alert>
//                 )}

//                 <Form onSubmit={handleSubmit}>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="small fw-bold">Full Name</Form.Label>
//                     <InputGroup className="amazon-input-group">
//                       <InputGroup.Text className="bg-white border-end-0">
//                         <User size={18} />
//                       </InputGroup.Text>
//                       <Form.Control
//                         type="text"
//                         name="name"
//                         placeholder="John Doe"
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="border-start-0 shadow-none"
//                         required
//                       />
//                     </InputGroup>
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label className="small fw-bold">
//                       Email Address
//                     </Form.Label>
//                     <InputGroup className="amazon-input-group">
//                       <InputGroup.Text className="bg-white border-end-0">
//                         <Mail size={18} />
//                       </InputGroup.Text>
//                       <Form.Control
//                         type="email"
//                         name="email"
//                         placeholder="name@example.com"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className="border-start-0 shadow-none"
//                         required
//                       />
//                     </InputGroup>
//                   </Form.Group>

//                   <Form.Group className="mb-2">
//                     <Form.Label className="small fw-bold">Password</Form.Label>
//                     <InputGroup className="amazon-input-group">
//                       <InputGroup.Text className="bg-white border-end-0">
//                         <Lock size={18} />
//                       </InputGroup.Text>
//                       <Form.Control
//                         type={showPassword ? "text" : "password"}
//                         name="password"
//                         placeholder="Min 8 characters"
//                         value={formData.password}
//                         onChange={handleChange}
//                         className="border-start-0 border-end-0 shadow-none"
//                         required
//                       />
//                       <InputGroup.Text
//                         className="bg-white border-start-0 text-muted"
//                         onClick={() => setShowPassword(!showPassword)}
//                         style={{ cursor: "pointer" }}
//                       >
//                         {showPassword ? (
//                           <EyeOff size={18} />
//                         ) : (
//                           <Eye size={18} />
//                         )}
//                       </InputGroup.Text>
//                     </InputGroup>
//                   </Form.Group>

//                   {formData.password && (
//                     <div className="mb-3">
//                       <ProgressBar
//                         now={(passwordStrength / 4) * 100}
//                         variant={getStrengthVariant()}
//                         style={{ height: "4px" }}
//                         className="mb-1"
//                       />
//                       <div className="d-flex justify-content-between">
//                         <small
//                           className="text-muted"
//                           style={{ fontSize: "0.65rem" }}
//                         >
//                           Strength
//                         </small>
//                         <small
//                           className={`fw-bold text-${getStrengthVariant()}`}
//                           style={{ fontSize: "0.65rem" }}
//                         >
//                           {passwordStrength <= 1
//                             ? "Weak"
//                             : passwordStrength === 2
//                               ? "Medium"
//                               : "Strong"}
//                         </small>
//                       </div>
//                     </div>
//                   )}

//                   <Form.Group className="mb-4">
//                     <Form.Label className="small fw-bold">
//                       Confirm Password
//                     </Form.Label>
//                     <InputGroup className="amazon-input-group">
//                       <InputGroup.Text className="bg-white border-end-0">
//                         <Lock size={18} />
//                       </InputGroup.Text>
//                       <Form.Control
//                         type={showConfirmPassword ? "text" : "password"}
//                         name="confirmPassword"
//                         placeholder="Repeat password"
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                         className="border-start-0 border-end-0 shadow-none"
//                         required
//                       />
//                       <InputGroup.Text
//                         className="bg-white border-start-0 text-muted"
//                         onClick={() =>
//                           setShowConfirmPassword(!showConfirmPassword)
//                         }
//                         style={{ cursor: "pointer" }}
//                       >
//                         {showConfirmPassword ? (
//                           <EyeOff size={18} />
//                         ) : (
//                           <Eye size={18} />
//                         )}
//                       </InputGroup.Text>
//                     </InputGroup>
//                   </Form.Group>

//                   <Button
//                     type="submit"
//                     className="w-100 py-2 fw-bold shadow-sm border-0 mb-3"
//                     style={{
//                       backgroundColor: "#FFD814",
//                       color: "#0F1111",
//                       borderRadius: "8px",
//                     }}
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <Loader2 className="spin-animation" size={18} />
//                     ) : (
//                       "Create your account"
//                     )}
//                   </Button>
//                 </Form>

//                 <div className="text-center mt-3 small">
//                   <span className="text-muted">Already have an account? </span>
//                   <Link
//                     to="/login"
//                     className="text-decoration-none fw-bold"
//                     style={{ color: "#007185" }}
//                   >
//                     Log In
//                   </Link>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         <div className="text-center mt-5 small text-muted">
//           <Link to="/" className="text-decoration-none mx-2 text-muted">
//             Home
//           </Link>
//           •
//           <Link to="/contact" className="text-decoration-none mx-2 text-muted">
//             Help
//           </Link>
//           •
//           <Link to="/privacy" className="text-decoration-none mx-2 text-muted">
//             Privacy
//           </Link>
//         </div>
//       </Container>

//       <style>{`
//         .amazon-input-group input:focus { border-color: #e47911 !important; box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; z-index: 10; }
//         .spin-animation { animation: spin 1s linear infinite; }
//         @keyframes spin { 100% { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  InputGroup,
  Alert,
  ProgressBar,
  Row,
  Col,
} from "react-bootstrap";
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from "lucide-react";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setMessage("");
    if (name === "password") {
      setPasswordStrength(calculateStrength(value));
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (passwordStrength < 2) {
      setError("Please choose a stronger password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setMessage(res.data?.message || "Verification code sent to your email.");
      localStorage.setItem("pendingEmail", formData.email);
      setTimeout(() => navigate("/verify-otp"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthVariant = () => {
    if (passwordStrength <= 1) return "danger";
    if (passwordStrength === 2) return "warning";
    if (passwordStrength >= 3) return "success";
    return "secondary";
  };

  return (
    <div
      className="d-flex align-items-center min-vh-100 py-5"
      style={{ backgroundColor: "#f0f2f2", fontFamily: "'Inter', sans-serif" }}
    >
      <Container>
        <Row
          className="justify-content-center align-items-stretch g-0 shadow-lg rounded-4 overflow-hidden"
          style={{ maxWidth: "1000px", margin: "0 auto" }}
        >
          {/* Left Column: Brand Image & Features */}
          <Col
            lg={6}
            className="d-none d-lg-flex flex-column justify-content-center p-5 bg-white border-end"
          >
            <div className="text-center">
              <img
                src="https://img.freepik.com/free-vector/medical-technology-concept-illustration_114360-6395.jpg"
                alt="Healthcare Tech"
                className="img-fluid mb-4"
                style={{ maxHeight: "280px" }}
              />
              <h3 className="fw-bold mb-3" style={{ color: "#0F1111" }}>
                Modern Healthcare Management
              </h3>
              <p
                className="text-muted mb-0 mx-auto"
                style={{ maxWidth: "300px" }}
              >
                Securely manage prescriptions, connect with doctors, and order
                medicines in one unified console.
              </p>
            </div>
          </Col>

          {/* Right Column: Register Form */}
          <Col lg={6} md={10} className="bg-white">
            <Card className="border-0 rounded-0">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="d-inline-flex align-items-center gap-2 mb-2">
                    <span style={{ fontSize: "2rem" }}>💊</span>
                    <h4 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
                      SmartPharmacy
                    </h4>
                  </div>
                  <h2 className="fw-bold mb-1" style={{ fontSize: "1.4rem" }}>
                    Create Account
                  </h2>
                </div>

                {/* ✅ FIXED GOOGLE BUTTON */}
                <Button
                  variant="outline-dark"
                  className="w-100 mb-4 d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm"
                  style={{
                    borderColor: "#D5D9D9",
                    fontWeight: "500",
                    borderRadius: "8px",
                  }}
                  onClick={handleGoogleSignup}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Sign up with Google</span>
                </Button>

                <div className="position-relative mb-4">
                  <hr style={{ borderColor: "#D5D9D9" }} />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small fw-medium">
                    OR
                  </span>
                </div>

                {error && (
                  <Alert
                    variant="danger"
                    className="py-2 small border-0 rounded-1"
                  >
                    {error}
                  </Alert>
                )}
                {message && (
                  <Alert
                    variant="success"
                    className="py-2 small border-0 rounded-1"
                  >
                    {message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Full Name</Form.Label>
                    <InputGroup className="amazon-input-group">
                      <InputGroup.Text className="bg-white border-end-0">
                        <User size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="border-start-0 shadow-none"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">
                      Email Address
                    </Form.Label>
                    <InputGroup className="amazon-input-group">
                      <InputGroup.Text className="bg-white border-end-0">
                        <Mail size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="border-start-0 shadow-none"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="small fw-bold">Password</Form.Label>
                    <InputGroup className="amazon-input-group">
                      <InputGroup.Text className="bg-white border-end-0">
                        <Lock size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Min 8 characters"
                        value={formData.password}
                        onChange={handleChange}
                        className="border-start-0 border-end-0 shadow-none"
                        required
                      />
                      <InputGroup.Text
                        className="bg-white border-start-0 text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  {formData.password && (
                    <div className="mb-3">
                      <ProgressBar
                        now={(passwordStrength / 4) * 100}
                        variant={getStrengthVariant()}
                        style={{ height: "4px" }}
                        className="mb-1"
                      />
                      <div className="d-flex justify-content-between">
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.65rem" }}
                        >
                          Strength
                        </small>
                        <small
                          className={`fw-bold text-${getStrengthVariant()}`}
                          style={{ fontSize: "0.65rem" }}
                        >
                          {passwordStrength <= 1
                            ? "Weak"
                            : passwordStrength === 2
                              ? "Medium"
                              : "Strong"}
                        </small>
                      </div>
                    </div>
                  )}

                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold">
                      Confirm Password
                    </Form.Label>
                    <InputGroup className="amazon-input-group">
                      <InputGroup.Text className="bg-white border-end-0">
                        <Lock size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Repeat password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="border-start-0 border-end-0 shadow-none"
                        required
                      />
                      <InputGroup.Text
                        className="bg-white border-start-0 text-muted"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 py-2 fw-bold shadow-sm border-0 mb-3"
                    style={{
                      backgroundColor: "#FFD814",
                      color: "#0F1111",
                      borderRadius: "8px",
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="spin-animation" size={18} />
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-3 small">
                  <span className="text-muted">Already have an account? </span>
                  <Link
                    to="/login"
                    className="text-decoration-none fw-bold"
                    style={{ color: "#007185" }}
                  >
                    Log In
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-5 small text-muted">
          <Link to="/" className="text-decoration-none mx-2 text-muted">
            Home
          </Link>
          •
          <Link to="/contact" className="text-decoration-none mx-2 text-muted">
            Help
          </Link>
          •
          <Link to="/privacy" className="text-decoration-none mx-2 text-muted">
            Privacy
          </Link>
        </div>
      </Container>

      <style>{`
        .amazon-input-group input:focus { border-color: #e47911 !important; box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; z-index: 10; }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
