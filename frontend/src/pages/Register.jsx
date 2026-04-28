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
                <img src={googleLogo} alt="Google" style={{ width: "40px" }} />
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
