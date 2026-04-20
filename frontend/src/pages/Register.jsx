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
// import { Eye, EyeOff, User, Mail, Lock, Loader2 } from "lucide-react";
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
//         <Row
//           className="justify-content-center align-items-stretch g-0 shadow-lg rounded-4 overflow-hidden"
//           style={{ maxWidth: "1000px", margin: "0 auto" }}
//         >
//           {/* Left Column: Brand Image & Features */}
//           <Col
//             lg={6}
//             className="d-none d-lg-flex flex-column justify-content-center p-5 bg-white border-end"
//           >
//             <div className="text-center">
//               <img
//                 src="https://img.freepik.com/free-vector/medical-technology-concept-illustration_114360-6395.jpg"
//                 alt="Healthcare Tech"
//                 className="img-fluid mb-4"
//                 style={{ maxHeight: "280px" }}
//               />
//               <h3 className="fw-bold mb-3" style={{ color: "#0F1111" }}>
//                 Modern Healthcare Management
//               </h3>
//               <p
//                 className="text-muted mb-0 mx-auto"
//                 style={{ maxWidth: "300px" }}
//               >
//                 Securely manage prescriptions, connect with doctors, and order
//                 medicines in one unified console.
//               </p>
//             </div>
//           </Col>

//           {/* Right Column: Register Form */}
//           <Col lg={6} md={10} className="bg-white">
//             <Card className="border-0 rounded-0">
//               <Card.Body className="p-4 p-md-5">
//                 <div className="text-center mb-4">
//                   <div className="d-inline-flex align-items-center gap-2 mb-2">
//                     <span style={{ fontSize: "2rem" }}>💊</span>
//                     <h4 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
//                       SmartPharmacy
//                     </h4>
//                   </div>
//                   <h2 className="fw-bold mb-1" style={{ fontSize: "1.4rem" }}>
//                     Create Account
//                   </h2>
//                 </div>

//                 {/* ✅ FIXED GOOGLE BUTTON */}
//                 <Button
//                   variant="outline-dark"
//                   className="w-100 mb-4 d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm"
//                   style={{
//                     borderColor: "#D5D9D9",
//                     fontWeight: "500",
//                     borderRadius: "8px",
//                   }}
//                   onClick={handleGoogleSignup}
//                 >
//                   <svg
//                     width="20"
//                     height="20"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                       fill="#4285F4"
//                     />
//                     <path
//                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                       fill="#34A853"
//                     />
//                     <path
//                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
//                       fill="#FBBC05"
//                     />
//                     <path
//                       d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                       fill="#EA4335"
//                     />
//                   </svg>
//                   <span>Sign up with Google</span>
//                 </Button>

//                 <div className="position-relative mb-4">
//                   <hr style={{ borderColor: "#D5D9D9" }} />
//                   <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small fw-medium">
//                     OR
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
//                       "Create account"
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

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Alert,
//   ProgressBar,
//   Spinner,
// } from "react-bootstrap";
// import {
//   User,
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
// import api from "../services/api";

// // Assuming you have these assets from the login redesign
// import googleLogo from "../assets/google-logo.png";
// import pharmacyHero from "../assets/pharmacy.jpg";

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
//     }, 5000); // Swaps image every 5 seconds
//     return () => clearInterval(interval);
//   }, [backgroundImages.length]);

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
//     <div className="login-wrapper min-vh-100 d-flex flex-column bg-light">
//       {/* Top Promotional Bar */}
//       <div className="bg-primary text-white py-2 text-center shadow-sm position-relative z-index-1">
//         <marquee
//           behavior="scroll"
//           direction="left"
//           className="m-0 small fw-medium"
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

//             {/* Gradient Overlay */}
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
//                   Create your secure account.
//                 </h2>
//               </div>
//               <div className="row g-4 w-75 slide-up delay-2">
//                 <div className="col-6">
//                   <div className="p-3 border border-light border-opacity-25 rounded-3 bg-white bg-opacity-10 feature-card">
//                     <HeartPulse className="text-danger mb-2" size={28} />
//                     <h5 className="fw-bold fs-6">Genuine Medicine</h5>
//                     <p className="small text-white-50 mb-0">
//                       100% authentic pharmaceuticals delivered directly to you.
//                     </p>
//                   </div>
//                 </div>
//                 <div className="col-6">
//                   <div className="p-3 border border-light border-opacity-25 rounded-3 bg-white bg-opacity-10 feature-card">
//                     <Stethoscope className="text-info mb-2" size={28} />
//                     <h5 className="fw-bold fs-6">Expert Doctors</h5>
//                     <p className="small text-white-50 mb-0">
//                       Connect instantly with certified professionals anytime.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Col>

//           {/* Right Side - Registration Form */}
//           <Col
//             lg={5}
//             className="d-flex align-items-center justify-content-center position-relative py-5"
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
//                 style={{ maxWidth: "480px", margin: "0 auto" }}
//               >
//                 <div className="text-center mb-4">
//                   <div className="d-inline-flex bg-primary bg-opacity-10 p-3 rounded-circle mb-3">
//                     <User size={32} className="text-primary" />
//                   </div>
//                   <h3 className="fw-bold text-dark mb-1">Create Account ✨</h3>
//                   <p className="text-muted small mb-0">
//                     Fill in your details to get started with SmartPharmacy.
//                   </p>
//                 </div>

//                 {error && (
//                   <Alert
//                     variant="danger"
//                     className="py-2 small border-0 rounded-3 shadow-sm d-flex align-items-center gap-2 shake-animation"
//                   >
//                     <ShieldCheck size={16} className="flex-shrink-0" /> {error}
//                   </Alert>
//                 )}
//                 {message && (
//                   <Alert
//                     variant="success"
//                     className="py-2 small border-0 rounded-3 shadow-sm d-flex align-items-center gap-2"
//                   >
//                     <ShieldCheck size={16} className="flex-shrink-0" />{" "}
//                     {message}
//                   </Alert>
//                 )}

//                 <Form onSubmit={handleSubmit} className="slide-up delay-2">
//                   <Form.Group className="mb-3">
//                     <Form.Label className="small fw-bold text-dark mb-1">
//                       Full Name
//                     </Form.Label>
//                     <div className="input-group modern-input-group shadow-sm">
//                       <span className="input-group-text bg-light border-end-0 text-muted px-3">
//                         <User size={18} />
//                       </span>
//                       <Form.Control
//                         type="text"
//                         name="name"
//                         placeholder="e.g. John Doe"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                         className="bg-light border-start-0 ps-0 shadow-none py-2"
//                       />
//                     </div>
//                   </Form.Group>

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
//                         name="email"
//                         placeholder="name@example.com"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                         className="bg-light border-start-0 ps-0 shadow-none py-2"
//                       />
//                     </div>
//                   </Form.Group>

//                   <Form.Group className="mb-1">
//                     <Form.Label className="small fw-bold text-dark mb-1">
//                       Password
//                     </Form.Label>
//                     <div className="input-group modern-input-group shadow-sm">
//                       <span className="input-group-text bg-light border-end-0 text-muted px-3">
//                         <Lock size={18} />
//                       </span>
//                       <Form.Control
//                         type={showPassword ? "text" : "password"}
//                         name="password"
//                         placeholder="Min 8 characters, 1 uppercase, 1 number"
//                         value={formData.password}
//                         onChange={handleChange}
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

//                   {/* Password Strength Indicator */}
//                   {formData.password && (
//                     <div className="mb-3 px-1 animate-fade-in">
//                       <ProgressBar
//                         now={(passwordStrength / 4) * 100}
//                         variant={getStrengthVariant()}
//                         style={{ height: "4px", borderRadius: "2px" }}
//                         className="mb-1 mt-2 shadow-sm"
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

//                   <Form.Group className="mb-4 mt-2">
//                     <Form.Label className="small fw-bold text-dark mb-1">
//                       Confirm Password
//                     </Form.Label>
//                     <div className="input-group modern-input-group shadow-sm">
//                       <span className="input-group-text bg-light border-end-0 text-muted px-3">
//                         <Lock size={18} />
//                       </span>
//                       <Form.Control
//                         type={showConfirmPassword ? "text" : "password"}
//                         name="confirmPassword"
//                         placeholder="Repeat password"
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                         required
//                         className="bg-light border-start-0 border-end-0 px-0 shadow-none py-2"
//                       />
//                       <span
//                         className="input-group-text bg-light border-start-0 text-muted px-3 cursor-pointer hover-text-primary transition-all"
//                         onClick={() =>
//                           setShowConfirmPassword(!showConfirmPassword)
//                         }
//                       >
//                         {showConfirmPassword ? (
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
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <>
//                         <Spinner
//                           size="sm"
//                           animation="border"
//                           className="opacity-75"
//                         />{" "}
//                         Processing...
//                       </>
//                     ) : (
//                       <>
//                         Create Account <ArrowRight size={18} />
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

//                 <Button
//                   variant="light"
//                   onClick={handleGoogleSignup}
//                   className="w-100 py-2 rounded-3 border border-light-subtle d-flex justify-content-center align-items-center gap-2 text-dark fw-bold shadow-sm hover-bg-white transition-all slide-up delay-3"
//                   style={{ fontSize: "0.95rem" }}
//                 >
//                   <img
//                     src={googleLogo}
//                     alt="Google"
//                     style={{ width: "20px" }}
//                   />
//                   Sign up with Google
//                 </Button>

//                 <p className="text-center mt-4 mb-0 small text-muted slide-up delay-3">
//                   Already have an account?{" "}
//                   <Link
//                     to="/login"
//                     className="fw-black text-primary text-decoration-none hover-underline"
//                   >
//                     Log In
//                   </Link>
//                 </p>
//               </div>

//               {/* Footer Links */}
//               <div className="text-center mt-4 mb-3 small text-muted fw-medium slide-up delay-3 position-relative z-index-1">
//                 <Link
//                   to="/"
//                   className="text-decoration-none mx-2 text-muted hover-text-primary"
//                 >
//                   Home
//                 </Link>
//                 •
//                 <Link
//                   to="/contact"
//                   className="text-decoration-none mx-2 text-muted hover-text-primary"
//                 >
//                   Help
//                 </Link>
//                 •
//                 <Link
//                   to="/privacy"
//                   className="text-decoration-none mx-2 text-muted hover-text-primary"
//                 >
//                   Privacy Policy
//                 </Link>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>

//       {/* Global CSS & Keyframe Animations */}
//       <style>{`
//         .cursor-pointer { cursor: pointer; }
//         .transition-all { transition: all 0.3s ease; }
//         .tracking-tight { letter-spacing: -1px; }

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
// }

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   InputGroup,
//   Alert,
//   ProgressBar,
//   Spinner,
// } from "react-bootstrap";
// import {
//   User,
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowLeft,
//   ShieldCheck,
// } from "lucide-react";
// import api from "../services/api";
// import googleLogo from "../assets/google-logo.png";
// import pharmacyHero from "../assets/pharmacy.jpg";

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

//   // --- Image Swapping Logic (Right Side) ---
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
//     }, 5000); // Swaps image every 5 seconds
//     return () => clearInterval(interval);
//   }, [backgroundImages.length]);

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
//     <div className="min-vh-100 d-flex flex-column bg-black">
//       {/* ✅ RESTORED: Top Marquee Bar back to Medical Blue */}
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
//           {/* Left Side - Dark Form */}
//           <Col
//             lg={5}
//             className="d-flex flex-column p-4 p-md-5 position-relative"
//             style={{ backgroundColor: "#09090b", color: "#ffffff" }}
//           >
//             {/* Return to Home Button */}
//             <div className="mb-auto slide-up">
//               <Link
//                 to="/"
//                 className="text-white-50 text-decoration-none hover-text-white d-inline-flex align-items-center gap-2 transition-all"
//               >
//                 <ArrowLeft size={18} /> Return to Home
//               </Link>
//             </div>

//             <div
//               className="w-100 mx-auto slide-up delay-1 my-5"
//               style={{ maxWidth: "400px" }}
//             >
//               <h2
//                 className="fw-bold mb-2"
//                 style={{ color: "#0ea5e9", fontSize: "2.2rem" }}
//               >
//                 Create Account
//               </h2>
//               <p className="text-white-50 small mb-4">
//                 Hey, enter your details to sign up to your account
//               </p>

//               {error && (
//                 <Alert
//                   variant="danger"
//                   className="py-2 small border-0 rounded-3 shadow-sm d-flex align-items-center gap-2 shake-animation"
//                 >
//                   <ShieldCheck size={16} className="flex-shrink-0" /> {error}
//                 </Alert>
//               )}
//               {message && (
//                 <Alert
//                   variant="success"
//                   className="py-2 small border-0 rounded-3 shadow-sm d-flex align-items-center gap-2"
//                 >
//                   <ShieldCheck size={16} className="flex-shrink-0" /> {message}
//                 </Alert>
//               )}

//               {/* Google Button */}
//               <Button
//                 variant="outline-light"
//                 className="w-100 rounded-pill py-2 mb-4 d-flex align-items-center justify-content-center gap-2 hover-bg-white transition-all"
//                 onClick={handleGoogleSignup}
//                 style={{ borderColor: "rgba(255,255,255,0.2)" }}
//               >
//                 <img src={googleLogo} alt="Google" style={{ width: "18px" }} />
//                 Sign up with Google
//               </Button>

//               <div className="d-flex align-items-center mb-4">
//                 <hr
//                   className="flex-grow-1"
//                   style={{ borderColor: "rgba(255,255,255,0.1)" }}
//                 />
//                 <span className="mx-3 text-white-50 small">
//                   or sign up with Email
//                 </span>
//                 <hr
//                   className="flex-grow-1"
//                   style={{ borderColor: "rgba(255,255,255,0.1)" }}
//                 />
//               </div>

//               {/* Registration Form */}
//               <Form onSubmit={handleSubmit} className="slide-up delay-2">
//                 <div className="dark-input-group mb-3 d-flex align-items-center">
//                   <span className="ps-3 pe-2 text-white-50">
//                     <User size={18} />
//                   </span>
//                   <Form.Control
//                     type="text"
//                     name="name"
//                     placeholder="Enter your full name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     className="dark-input shadow-none"
//                   />
//                 </div>

//                 <div className="dark-input-group mb-3 d-flex align-items-center">
//                   <span className="ps-3 pe-2 text-white-50">
//                     <Mail size={18} />
//                   </span>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     placeholder="Enter your email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     className="dark-input shadow-none"
//                   />
//                 </div>

//                 <div className="dark-input-group mb-1 d-flex align-items-center">
//                   <span className="ps-3 pe-2 text-white-50">
//                     <Lock size={18} />
//                   </span>
//                   <Form.Control
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     className="dark-input shadow-none"
//                   />
//                   <span
//                     className="pe-3 ps-2 text-white-50 cursor-pointer hover-text-blue transition-all"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </span>
//                 </div>

//                 {/* Password Strength Indicator */}
//                 {formData.password && (
//                   <div className="mb-3 px-2 animate-fade-in">
//                     <ProgressBar
//                       now={(passwordStrength / 4) * 100}
//                       variant={getStrengthVariant()}
//                       style={{
//                         height: "4px",
//                         backgroundColor: "rgba(255,255,255,0.1)",
//                       }}
//                       className="mb-1 mt-2 rounded-pill"
//                     />
//                     <div className="d-flex justify-content-between">
//                       <small
//                         className="text-white-50"
//                         style={{ fontSize: "0.65rem" }}
//                       >
//                         Strength
//                       </small>
//                       <small
//                         className={`fw-bold text-${getStrengthVariant()}`}
//                         style={{ fontSize: "0.65rem" }}
//                       >
//                         {passwordStrength <= 1
//                           ? "Weak"
//                           : passwordStrength === 2
//                             ? "Medium"
//                             : "Strong"}
//                       </small>
//                     </div>
//                   </div>
//                 )}

//                 <div className="dark-input-group mb-4 mt-2 d-flex align-items-center">
//                   <span className="ps-3 pe-2 text-white-50">
//                     <Lock size={18} />
//                   </span>
//                   <Form.Control
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     placeholder="Confirm your password"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     required
//                     className="dark-input shadow-none"
//                   />
//                   <span
//                     className="pe-3 ps-2 text-white-50 cursor-pointer hover-text-blue transition-all"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff size={18} />
//                     ) : (
//                       <Eye size={18} />
//                     )}
//                   </span>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-100 py-2 rounded-pill fw-bold border-0 shadow-sm text-white hover-lift slide-up delay-3"
//                   style={{ backgroundColor: "#0ea5e9" }}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <>
//                       <Spinner
//                         size="sm"
//                         animation="border"
//                         className="opacity-75 me-2"
//                       />{" "}
//                       Processing...
//                     </>
//                   ) : (
//                     "REGISTER"
//                   )}
//                 </Button>
//               </Form>

//               <p className="text-center mt-4 mb-0 small text-white-50 slide-up delay-3">
//                 Already registered?{" "}
//                 <Link
//                   to="/login"
//                   className="fw-bold text-decoration-none hover-underline"
//                   style={{ color: "#0ea5e9" }}
//                 >
//                   Sign in here
//                 </Link>
//               </p>
//             </div>

//             <div className="mt-auto"></div>
//           </Col>

//           {/* Right Side - Clean Dark Gradient & Image Slider */}
//           <Col
//             lg={7}
//             className="d-none d-lg-flex flex-column justify-content-center align-items-center position-relative overflow-hidden"
//           >
//             {/* Background Images fading in and out */}
//             {backgroundImages.map((img, index) => (
//               <div
//                 key={index}
//                 className="position-absolute w-100 h-100"
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

//             {/* ✅ RESTORED: Clean Dark Gradient Overlay without the green mixBlendMode */}
//             <div
//               className="position-absolute w-100 h-100"
//               style={{
//                 background:
//                   "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)",
//               }}
//             ></div>

//             {/* Text Overlay */}
//             <div
//               className="position-relative z-1 text-center px-5 text-white slide-up delay-2"
//               style={{ maxWidth: "600px" }}
//             >
//               <h1
//                 className="fw-light mb-1"
//                 style={{ fontSize: "3.5rem", fontFamily: "Georgia, serif" }}
//               >
//                 Welcome
//               </h1>
//               <h2 className="fw-bold mb-4" style={{ fontSize: "2rem" }}>
//                 to SmartPharmacy
//               </h2>
//               <p className="fs-6 opacity-75 lh-lg">
//                 Discover where excellence in healthcare begins. Our dedicated
//                 platform and innovative features empower patients to manage
//                 health effortlessly. Join us for a secure and inspiring medical
//                 journey!
//               </p>

//               {/* Carousel Dots */}
//               <div className="d-flex justify-content-center gap-2 mt-5">
//                 {backgroundImages.map((_, idx) => (
//                   <div
//                     key={idx}
//                     style={{
//                       width: idx === bgIndex ? "24px" : "8px",
//                       height: "8px",
//                       backgroundColor:
//                         idx === bgIndex ? "#ffffff" : "rgba(255,255,255,0.4)",
//                       borderRadius: "4px",
//                       transition: "all 0.3s ease",
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>

//       {/* Footer / Copyright */}
//       <footer
//         className="py-3 text-center position-relative z-index-1"
//         style={{
//           backgroundColor: "#09090b",
//           borderTop: "1px solid rgba(255,255,255,0.05)",
//         }}
//       >
//         <small className="text-white-50">
//           © {new Date().getFullYear()} Smart Pharmacy System | All Rights
//           Reserved
//         </small>
//       </footer>

//       {/* Global CSS & Keyframe Animations */}
//       <style>{`
//         .cursor-pointer { cursor: pointer; }
//         .transition-all { transition: all 0.3s ease; }

//         .hover-text-white:hover { color: #ffffff !important; }
//         .hover-text-blue:hover { color: #0ea5e9 !important; }
//         .hover-bg-white:hover { background-color: #ffffff !important; color: #000 !important; }
//         .hover-underline:hover { text-decoration: underline !important; }

//         .hover-lift { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease; }
//         .hover-lift:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3) !important; }
//         .hover-lift:active:not(:disabled) { transform: translateY(0); }

//         /* Dark Mode Pill Input Styling */
//         .dark-input-group {
//           background-color: #18181b; /* Dark Zinc */
//           border-radius: 50px;
//           overflow: hidden;
//           border: 1px solid transparent;
//           transition: all 0.3s ease;
//         }
//         .dark-input-group:focus-within {
//           border-color: #0ea5e9;
//           box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
//         }
//         .dark-input {
//           background-color: transparent !important;
//           color: #ffffff !important;
//           border: none !important;
//           padding: 14px 20px 14px 0;
//         }
//         .dark-input::placeholder { color: #71717a !important; }
//         .dark-input:focus { box-shadow: none !important; }

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
//           from { opacity: 0; transform: translateY(20px); }
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
// }

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Alert,
//   ProgressBar,
//   Spinner,
// } from "react-bootstrap";
// import {
//   User,
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowLeft,
//   ShieldCheck,
// } from "lucide-react";
// import api from "../services/api";
// import googleLogo from "../assets/google-logo.png";

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

//   // --- UNIQUE Image Swapping Logic for Register Page ---
//   const backgroundImages = [
//     "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop", // Hospital Tech
//     "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop", // Medical Desk/Stethoscope
//     "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop", // Laboratory/Research
//     "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=1200&auto=format&fit=crop", // Clean Clinical Room
//   ];
//   const [bgIndex, setBgIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
//     }, 5000); // Swaps image every 5 seconds
//     return () => clearInterval(interval);
//   }, [backgroundImages.length]);

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
//     <div className="min-vh-100 d-flex flex-column bg-black">
//       {/* Top Marquee Bar */}
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
//           {/* Left Side - Dark Form */}
//           <Col
//             lg={5}
//             className="d-flex flex-column p-4 p-md-5 position-relative"
//             style={{ backgroundColor: "#09090b", color: "#ffffff" }}
//           >
//             {/* Return to Login Button */}
//             <div className="mb-auto slide-up">
//               <Link
//                 to="/login"
//                 className="text-white-50 text-decoration-none hover-text-white d-inline-flex align-items-center gap-2 transition-all fw-medium"
//               >
//                 <ArrowLeft size={18} /> Return to Login
//               </Link>
//             </div>

//             <div
//               className="w-100 mx-auto slide-up delay-1 my-5"
//               style={{ maxWidth: "400px" }}
//             >
//               <h2
//                 className="fw-bold mb-2"
//                 style={{ color: "#0ea5e9", fontSize: "2.2rem" }}
//               >
//                 Create Account
//               </h2>
//               <p className="text-white-50 small mb-4">
//                 Hey, enter your details to sign up for your account
//               </p>

//               {error && (
//                 <Alert
//                   variant="danger"
//                   className="py-2 small border-0 rounded-3 shadow-sm d-flex align-items-center gap-2 shake-animation"
//                 >
//                   <ShieldCheck size={16} className="flex-shrink-0" /> {error}
//                 </Alert>
//               )}
//               {message && (
//                 <Alert
//                   variant="success"
//                   className="py-2 small border-0 rounded-3 shadow-sm d-flex align-items-center gap-2"
//                 >
//                   <ShieldCheck size={16} className="flex-shrink-0" /> {message}
//                 </Alert>
//               )}

//               {/* Google Button */}
//               <Button
//                 variant="outline-light"
//                 className="w-100 rounded-pill py-2 mb-4 d-flex align-items-center justify-content-center gap-2 hover-bg-white transition-all"
//                 onClick={handleGoogleSignup}
//                 style={{ borderColor: "rgba(255,255,255,0.2)" }}
//               >
//                 <img src={googleLogo} alt="Google" style={{ width: "18px" }} />
//                 Sign up with Google
//               </Button>

//               <div className="d-flex align-items-center mb-4">
//                 <hr
//                   className="flex-grow-1"
//                   style={{ borderColor: "rgba(255,255,255,0.1)" }}
//                 />
//                 <span className="mx-3 text-white-50 small">
//                   or sign up with Email
//                 </span>
//                 <hr
//                   className="flex-grow-1"
//                   style={{ borderColor: "rgba(255,255,255,0.1)" }}
//                 />
//               </div>

//               {/* Registration Form */}
//               <Form onSubmit={handleSubmit} className="slide-up delay-2">
//                 <div className="dark-input-group mb-3 d-flex align-items-center">
//                   <span className="ps-3 pe-2 text-white-50">
//                     <User size={18} />
//                   </span>
//                   <Form.Control
//                     type="text"
//                     name="name"
//                     placeholder="Enter your full name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     className="dark-input shadow-none"
//                   />
//                 </div>

//                 <div className="dark-input-group mb-3 d-flex align-items-center">
//                   <span className="ps-3 pe-2 text-white-50">
//                     <Mail size={18} />
//                   </span>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     placeholder="Enter your email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     className="dark-input shadow-none"
//                   />
//                 </div>

//                 <div className="dark-input-group mb-1 d-flex align-items-center">
//                   <span className="ps-3 pe-2 text-white-50">
//                     <Lock size={18} />
//                   </span>
//                   <Form.Control
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     className="dark-input shadow-none"
//                   />
//                   <span
//                     className="pe-3 ps-2 text-white-50 cursor-pointer hover-text-blue transition-all"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </span>
//                 </div>

//                 {/* Password Strength Indicator */}
//                 {formData.password && (
//                   <div className="mb-3 px-2 animate-fade-in">
//                     <ProgressBar
//                       now={(passwordStrength / 4) * 100}
//                       variant={getStrengthVariant()}
//                       style={{
//                         height: "4px",
//                         backgroundColor: "rgba(255,255,255,0.1)",
//                       }}
//                       className="mb-1 mt-2 rounded-pill"
//                     />
//                     <div className="d-flex justify-content-between">
//                       <small
//                         className="text-white-50"
//                         style={{ fontSize: "0.65rem" }}
//                       >
//                         Strength
//                       </small>
//                       <small
//                         className={`fw-bold text-${getStrengthVariant()}`}
//                         style={{ fontSize: "0.65rem" }}
//                       >
//                         {passwordStrength <= 1
//                           ? "Weak"
//                           : passwordStrength === 2
//                             ? "Medium"
//                             : "Strong"}
//                       </small>
//                     </div>
//                   </div>
//                 )}

//                 <div className="dark-input-group mb-4 mt-2 d-flex align-items-center">
//                   <span className="ps-3 pe-2 text-white-50">
//                     <Lock size={18} />
//                   </span>
//                   <Form.Control
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     placeholder="Confirm your password"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     required
//                     className="dark-input shadow-none"
//                   />
//                   <span
//                     className="pe-3 ps-2 text-white-50 cursor-pointer hover-text-blue transition-all"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff size={18} />
//                     ) : (
//                       <Eye size={18} />
//                     )}
//                   </span>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-100 py-2 rounded-pill fw-bold border-0 shadow-sm text-white hover-lift slide-up delay-3"
//                   style={{ backgroundColor: "#0ea5e9" }}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <>
//                       <Spinner
//                         size="sm"
//                         animation="border"
//                         className="opacity-75 me-2"
//                       />{" "}
//                       Processing...
//                     </>
//                   ) : (
//                     "REGISTER"
//                   )}
//                 </Button>
//               </Form>

//               <p className="text-center mt-4 mb-0 small text-white-50 slide-up delay-3">
//                 Already registered?{" "}
//                 <Link
//                   to="/login"
//                   className="fw-bold text-decoration-none hover-underline"
//                   style={{ color: "#0ea5e9" }}
//                 >
//                   Sign in here
//                 </Link>
//               </p>
//             </div>

//             <div className="mt-auto"></div>
//           </Col>

//           {/* Right Side - Clean Dark Gradient & Image Slider */}
//           <Col
//             lg={7}
//             className="d-none d-lg-flex flex-column justify-content-center align-items-center position-relative overflow-hidden"
//           >
//             {/* Background Images fading in and out */}
//             {backgroundImages.map((img, index) => (
//               <div
//                 key={index}
//                 className="position-absolute w-100 h-100"
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

//             {/* Clean Dark Gradient Overlay */}
//             <div
//               className="position-absolute w-100 h-100"
//               style={{
//                 background:
//                   "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)",
//               }}
//             ></div>

//             {/* Text Overlay */}
//             <div
//               className="position-relative z-1 text-center px-5 text-white slide-up delay-2"
//               style={{ maxWidth: "600px" }}
//             >
//               <h1
//                 className="fw-light mb-1"
//                 style={{ fontSize: "3.5rem", fontFamily: "Georgia, serif" }}
//               >
//                 Welcome
//               </h1>
//               <h2 className="fw-bold mb-4" style={{ fontSize: "2rem" }}>
//                 to SmartPharmacy
//               </h2>
//               <p className="fs-6 opacity-75 lh-lg">
//                 Discover where excellence in healthcare begins. Our dedicated
//                 platform and innovative features empower patients to manage
//                 health effortlessly. Join us for a secure and inspiring medical
//                 journey!
//               </p>

//               {/* Carousel Dots */}
//               <div className="d-flex justify-content-center gap-2 mt-5">
//                 {backgroundImages.map((_, idx) => (
//                   <div
//                     key={idx}
//                     style={{
//                       width: idx === bgIndex ? "24px" : "8px",
//                       height: "8px",
//                       backgroundColor:
//                         idx === bgIndex ? "#ffffff" : "rgba(255,255,255,0.4)",
//                       borderRadius: "4px",
//                       transition: "all 0.3s ease",
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//       <footer
//         className="py-3 position-relative z-index-1"
//         style={{
//           backgroundColor: "#09090b",
//           borderTop: "1px solid rgba(255,255,255,0.05)",
//         }}
//       >
//         <Container fluid>
//           <Row className="align-items-center text-center text-md-start px-2 px-md-4">
//             <Col md={6} className="mb-2 mb-md-0">
//               <small className="text-white-50">
//                 © {new Date().getFullYear()} Smart Pharmacy System | All Rights
//                 Reserved
//               </small>
//             </Col>
//             <Col md={6} className="text-md-end">
//               <div className="small text-white-50 fw-medium">
//                 <Link
//                   to="/"
//                   className="text-decoration-none mx-2 text-white-50 hover-text-blue transition-all"
//                 >
//                   Home
//                 </Link>
//                 •
//                 <Link
//                   to="/contact"
//                   className="text-decoration-none mx-2 text-white-50 hover-text-blue transition-all"
//                 >
//                   Help
//                 </Link>
//                 •
//                 <Link
//                   to="/privacy"
//                   className="text-decoration-none mx-2 text-white-50 hover-text-blue transition-all"
//                 >
//                   Privacy Policy
//                 </Link>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </footer>

//       {/* Global CSS & Keyframe Animations */}
//       <style>{`
//         .cursor-pointer { cursor: pointer; }
//         .transition-all { transition: all 0.3s ease; }

//         .hover-text-white:hover { color: #ffffff !important; }
//         .hover-text-blue:hover { color: #0ea5e9 !important; }
//         .hover-bg-white:hover { background-color: #ffffff !important; color: #000 !important; }
//         .hover-underline:hover { text-decoration: underline !important; }

//         .hover-lift { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease; }
//         .hover-lift:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3) !important; }
//         .hover-lift:active:not(:disabled) { transform: translateY(0); }

//         /* Dark Mode Pill Input Styling */
//         .dark-input-group {
//           background-color: #18181b; /* Dark Zinc */
//           border-radius: 50px;
//           overflow: hidden;
//           border: 1px solid transparent;
//           transition: all 0.3s ease;
//         }
//         .dark-input-group:focus-within {
//           border-color: #0ea5e9;
//           box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
//         }
//         .dark-input {
//           background-color: transparent !important;
//           color: #ffffff !important;
//           border: none !important;
//           padding: 14px 20px 14px 0;
//         }
//         .dark-input::placeholder { color: #71717a !important; }
//         .dark-input:focus { box-shadow: none !important; }

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
//           from { opacity: 0; transform: translateY(20px); }
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
// }

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";
import googleLogo from "../assets/google-logo.png";

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

  // --- UNIQUE Image Swapping Logic for Register Page ---
  const backgroundImages = [
    "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop", // Hospital Tech
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop", // Medical Desk/Stethoscope
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop", // Laboratory/Research
    "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=1200&auto=format&fit=crop", // Clean Clinical Room
  ];
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Swaps image every 5 seconds
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

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
    const backendUrl =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    window.location.href = `${backendUrl}/auth/google`;
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
    <div className="min-vh-100 d-flex flex-column bg-black">
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
          {/* Left Side - Dark Form */}
          <Col
            lg={5}
            className="d-flex flex-column p-4 p-md-5 position-relative"
            style={{ backgroundColor: "#09090b", color: "#ffffff" }}
          >
            {/* Return to Login Button */}
            <div className="mb-auto slide-up">
              <Link
                to="/login"
                className="text-white-50 text-decoration-none hover-text-white d-inline-flex align-items-center gap-2 transition-all fw-medium"
              >
                <ArrowLeft size={18} /> Return to Login
              </Link>
            </div>

            <div
              className="w-100 mx-auto slide-up delay-1 my-5"
              style={{ maxWidth: "400px" }}
            >
              <h2
                className="fw-bold mb-2"
                style={{ color: "#0ea5e9", fontSize: "2.2rem" }}
              >
                Create Account
              </h2>
              <p className="text-white-50 small mb-4">
                Hey, enter your details to sign up for your account
              </p>

              {error && (
                <Alert
                  variant="danger"
                  className="py-2 small border-0 rounded-3 shadow-sm d-flex align-items-center gap-2 shake-animation"
                >
                  <ShieldCheck size={16} className="flex-shrink-0" /> {error}
                </Alert>
              )}
              {message && (
                <Alert
                  variant="success"
                  className="py-2 small border-0 rounded-3 shadow-sm d-flex align-items-center gap-2"
                >
                  <ShieldCheck size={16} className="flex-shrink-0" /> {message}
                </Alert>
              )}

              {/* Google Button */}
              <Button
                variant="outline-light"
                className="w-100 rounded-pill py-2 mb-4 d-flex align-items-center justify-content-center gap-2 hover-bg-white transition-all"
                onClick={handleGoogleSignup}
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                <img src={googleLogo} alt="Google" style={{ width: "18px" }} />
                Sign up with Google
              </Button>

              <div className="d-flex align-items-center mb-4">
                <hr
                  className="flex-grow-1"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                />
                <span className="mx-3 text-white-50 small">
                  or sign up with Email
                </span>
                <hr
                  className="flex-grow-1"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                />
              </div>

              {/* Registration Form */}
              <Form onSubmit={handleSubmit} className="slide-up delay-2">
                <div className="dark-input-group mb-3 d-flex align-items-center">
                  <span className="ps-3 pe-2 text-white-50">
                    <User size={18} />
                  </span>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="dark-input shadow-none"
                  />
                </div>

                <div className="dark-input-group mb-3 d-flex align-items-center">
                  <span className="ps-3 pe-2 text-white-50">
                    <Mail size={18} />
                  </span>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="dark-input shadow-none"
                  />
                </div>

                <div className="dark-input-group mb-1 d-flex align-items-center">
                  <span className="ps-3 pe-2 text-white-50">
                    <Lock size={18} />
                  </span>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="dark-input shadow-none"
                  />
                  <span
                    className="pe-3 ps-2 text-white-50 cursor-pointer hover-text-blue transition-all"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mb-3 px-2 animate-fade-in">
                    <ProgressBar
                      now={(passwordStrength / 4) * 100}
                      variant={getStrengthVariant()}
                      style={{
                        height: "4px",
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                      className="mb-1 mt-2 rounded-pill"
                    />
                    <div className="d-flex justify-content-between">
                      <small
                        className="text-white-50"
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

                <div className="dark-input-group mb-4 mt-2 d-flex align-items-center">
                  <span className="ps-3 pe-2 text-white-50">
                    <Lock size={18} />
                  </span>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="dark-input shadow-none"
                  />
                  <span
                    className="pe-3 ps-2 text-white-50 cursor-pointer hover-text-blue transition-all"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-100 py-2 rounded-pill fw-bold border-0 shadow-sm text-white hover-lift slide-up delay-3"
                  style={{ backgroundColor: "#0ea5e9" }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        size="sm"
                        animation="border"
                        className="opacity-75 me-2"
                      />{" "}
                      Processing...
                    </>
                  ) : (
                    "REGISTER"
                  )}
                </Button>
              </Form>

              <p className="text-center mt-4 mb-0 small text-white-50 slide-up delay-3">
                Already registered?{" "}
                <Link
                  to="/login"
                  className="fw-bold text-decoration-none hover-underline"
                  style={{ color: "#0ea5e9" }}
                >
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-auto"></div>
          </Col>

          {/* Right Side - Clean Dark Gradient & Image Slider */}
          <Col
            lg={7}
            className="d-none d-lg-flex flex-column justify-content-center align-items-center position-relative overflow-hidden"
          >
            {/* Background Images fading in and out */}
            {backgroundImages.map((img, index) => (
              <div
                key={index}
                className="position-absolute w-100 h-100"
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

            {/* Clean Dark Gradient Overlay */}
            <div
              className="position-absolute w-100 h-100"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)",
              }}
            ></div>

            {/* Text Overlay */}
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

              {/* Carousel Dots */}
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

      {/* Global CSS & Keyframe Animations */}
      <style>{`
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.3s ease; }
        
        .hover-text-white:hover { color: #ffffff !important; }
        .hover-text-blue:hover { color: #0ea5e9 !important; }
        .hover-bg-white:hover { background-color: #ffffff !important; color: #000 !important; }
        .hover-underline:hover { text-decoration: underline !important; }
        
        .hover-lift { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease; }
        .hover-lift:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3) !important; }
        .hover-lift:active:not(:disabled) { transform: translateY(0); }

        /* Dark Mode Pill Input Styling */
        .dark-input-group {
          background-color: #18181b; /* Dark Zinc */
          border-radius: 50px;
          overflow: hidden;
          border: 1px solid transparent;
          transition: all 0.3s ease;
        }
        .dark-input-group:focus-within {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
        }
        .dark-input {
          background-color: transparent !important;
          color: #ffffff !important;
          border: none !important;
          padding: 14px 20px 14px 0;
        }
        .dark-input::placeholder { color: #71717a !important; }
        .dark-input:focus { box-shadow: none !important; }

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
}
