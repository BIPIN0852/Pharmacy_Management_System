import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) return "Weak";
    if (strength === 2) return "Medium";
    return "Strong";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage("");
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setMessage(res.message || "Verification code sent to your email.");
      localStorage.setItem("pendingEmail", formData.email);
      setTimeout(() => navigate("/verify-otp"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === "Weak") return "#dc2626";
    if (passwordStrength === "Medium") return "#ca8a04";
    if (passwordStrength === "Strong") return "#16a34a";
    return "#6b7280";
  };

  return (
    <div style={styles.page}>
      <Link to="/" style={styles.brandLink}>
        <span style={styles.brandLogo}>💊</span>
        <span style={styles.brandText}>Smart Pharmacy System</span>
      </Link>

      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.cardTitle}>Create an account</h2>
        <p style={styles.cardSubtitle}>
          Register to access the Smart Pharmacy System as a customer.
        </p>

        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <div style={styles.passwordField}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            style={styles.eyeButton}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {formData.password && (
          <p style={{ ...styles.passwordStrength, color: getStrengthColor() }}>
            {passwordStrength} password
          </p>
        )}

        <div style={styles.passwordField}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            style={styles.eyeButton}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...styles.submitButton,
            opacity: isLoading ? 0.8 : 1,
            cursor: isLoading ? "wait" : "pointer",
          }}
        >
          {isLoading
            ? "Sending verification code..."
            : "Send verification code"}
        </button>

        {message && (
          <p
            style={{
              ...styles.message,
              color:
                message.toLowerCase().includes("success") ||
                message.toLowerCase().includes("sent")
                  ? "#16a34a"
                  : "#dc2626",
            }}
          >
            {message}
          </p>
        )}

        <div style={styles.footerRow}>
          <span style={styles.footerText}>Already have an account? </span>
          <Link to="/login" style={styles.footerLink}>
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #e0f2fe 0, #f9fafb 55%, #f3f4f6 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#111827",
  },
  brandLink: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
    textDecoration: "none",
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: "999px",
    backgroundColor: "#e0f2fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
  },
  brandText: {
    fontSize: "1.1rem",
    fontWeight: 600,
    background: "linear-gradient(to right, #0ea5e9, #2563eb)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: "1.75rem 1.5rem 1.5rem",
    boxShadow: "0 18px 45px rgba(15,23,42,0.16)",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: "0.88rem",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: "9px 10px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: "0.9rem",
    outline: "none",
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  passwordField: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#6b7280",
  },
  passwordStrength: {
    fontSize: "0.78rem",
    marginTop: 4,
    fontWeight: 600,
  },
  submitButton: {
    width: "100%",
    marginTop: 4,
    background: "linear-gradient(to right, #2563eb, #1d4ed8)",
    color: "#ffffff",
    borderRadius: 999,
    border: "none",
    padding: "9px 12px",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  message: {
    marginTop: 8,
    fontSize: "0.85rem",
    textAlign: "center",
  },
  footerRow: {
    marginTop: 10,
    textAlign: "center",
    fontSize: "0.86rem",
  },
  footerText: {
    color: "#6b7280",
  },
  footerLink: {
    color: "#2563eb",
    marginLeft: 4,
    textDecoration: "underline",
    fontWeight: 500,
  },
};

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// const API_BASE_URL = "http://localhost:5000/api";

// const Register = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [role, setRole] = useState("customer"); // "admin" | "pharmacist" | "customer"
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     if (!name || !email || !password || !confirmPassword) {
//       setError("Please fill all required fields.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(`${API_BASE_URL}/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           email,
//           phone,
//           password,
//           role, // <-- important: send role, e.g. "admin"
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Registration failed.");
//       } else {
//         setMessage("Registration successful. You can now login.");
//         // small delay then go to login
//         setTimeout(() => navigate("/login"), 1500);
//       }
//     } catch (err) {
//       setError(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <h1 style={styles.title}>Create an Account</h1>
//         <p style={styles.subtitle}>
//           Register as customer, pharmacist, or admin.
//         </p>

//         <form onSubmit={handleSubmit} style={styles.form}>
//           <input
//             type="text"
//             placeholder="Full name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             type="email"
//             placeholder="Email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             type="tel"
//             placeholder="Phone (optional)"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             style={styles.input}
//           />

//           {/* Role selection including Admin */}
//           <div style={styles.roleGroup}>
//             <span style={styles.roleLabel}>Register as:</span>
//             <div style={styles.roleOptions}>
//               <label style={styles.roleOption}>
//                 <input
//                   type="radio"
//                   name="role"
//                   value="customer"
//                   checked={role === "customer"}
//                   onChange={() => setRole("customer")}
//                 />
//                 <span>Customer</span>
//               </label>
//               <label style={styles.roleOption}>
//                 <input
//                   type="radio"
//                   name="role"
//                   value="pharmacist"
//                   checked={role === "pharmacist"}
//                   onChange={() => setRole("pharmacist")}
//                 />
//                 <span>Pharmacist</span>
//               </label>
//               <label style={styles.roleOption}>
//                 <input
//                   type="radio"
//                   name="role"
//                   value="admin"
//                   checked={role === "admin"}
//                   onChange={() => setRole("admin")}
//                 />
//                 <span>Admin</span>
//               </label>
//             </div>
//           </div>

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             type="password"
//             placeholder="Confirm password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             style={styles.input}
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               ...styles.button,
//               opacity: loading ? 0.7 : 1,
//               cursor: loading ? "default" : "pointer",
//             }}
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         {error && (
//           <p style={{ ...styles.message, color: "#dc2626" }}>{error}</p>
//         )}
//         {message && (
//           <p style={{ ...styles.message, color: "#16a34a" }}>{message}</p>
//         )}

//         <p style={styles.footerText}>
//           Already have an account?{" "}
//           <Link to="/login" style={styles.link}>
//             Login here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   page: {
//     minHeight: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#f3f4f6",
//     fontFamily: "Poppins, system-ui, sans-serif",
//     padding: "1rem",
//   },
//   card: {
//     width: "100%",
//     maxWidth: 420,
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     padding: "1.75rem",
//     boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
//   },
//   title: {
//     fontSize: "1.5rem",
//     fontWeight: 600,
//     marginBottom: 4,
//     color: "#111827",
//   },
//   subtitle: {
//     fontSize: "0.9rem",
//     color: "#6b7280",
//     marginBottom: 16,
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//   },
//   input: {
//     padding: "10px 12px",
//     borderRadius: 8,
//     border: "1px solid #d1d5db",
//     fontSize: "0.9rem",
//     outline: "none",
//   },
//   roleGroup: {
//     marginTop: 4,
//     marginBottom: 4,
//   },
//   roleLabel: {
//     fontSize: "0.85rem",
//     color: "#374151",
//   },
//   roleOptions: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: 8,
//     marginTop: 6,
//   },
//   roleOption: {
//     display: "flex",
//     alignItems: "center",
//     gap: 4,
//     padding: "4px 8px",
//     borderRadius: 999,
//     border: "1px solid #d1d5db",
//     fontSize: "0.8rem",
//     cursor: "pointer",
//   },
//   button: {
//     marginTop: 6,
//     padding: "10px 12px",
//     borderRadius: 8,
//     border: "none",
//     backgroundColor: "#2563eb",
//     color: "#ffffff",
//     fontSize: "0.95rem",
//     fontWeight: 500,
//   },
//   message: {
//     marginTop: 10,
//     fontSize: "0.85rem",
//   },
//   footerText: {
//     marginTop: 14,
//     fontSize: "0.9rem",
//     color: "#4b5563",
//   },
//   link: {
//     color: "#2563eb",
//     textDecoration: "none",
//     fontWeight: 500,
//   },
// };

// export default Register;
