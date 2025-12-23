// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../services/api";
// import logo from "../assets/pharmacy-logo.jpg"; // or any image you like

// export default function AdminLogin() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMessage("");
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);
//     try {
//       const res = await api.post("/auth/login", {
//         email: formData.email,
//         password: formData.password,
//       });

//       // Ensure this user is admin
//       const role = res.user?.role; // backend sends role inside user
//       if (role !== "admin") {
//         setMessage("Access denied. This login is for admin accounts only.");
//         setLoading(false);
//         return;
//       }

//       // store token + role
//       if (res.token) {
//         localStorage.setItem("token", res.token);
//       }
//       if (role) {
//         localStorage.setItem("role", role);
//       }

//       navigate("/admin-dashboard");
//     } catch (err) {
//       setMessage(
//         err.response?.data?.message ||
//           err.message ||
//           "Admin login failed. Check your credentials."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       {/* Left side: image / branding */}
//       <div style={styles.leftPane}>
//         <div style={styles.leftOverlay}>
//           <div style={styles.logoRow}>
//             <img src={logo} alt="Smart Pharmacy" style={styles.logoImage} />
//             <div>
//               <h1 style={styles.brandTitle}>Smart Pharmacy</h1>
//               <p style={styles.brandSubtitle}>Admin Control Panel</p>
//             </div>
//           </div>
//           <h2 style={styles.leftHeading}>
//             Manage your pharmacy with confidence.
//           </h2>
//           <p style={styles.leftText}>
//             Monitor medicines, orders and staff from a single, secure dashboard.
//           </p>
//           <ul style={styles.leftList}>
//             <li>Real‑time stock and low‑inventory alerts.</li>
//             <li>Central control for pharmacists and staff.</li>
//             <li>Secure, role‑based access for your team.</li>
//           </ul>
//         </div>
//       </div>

//       {/* Right side: admin login form */}
//       <div style={styles.rightPane}>
//         <div style={styles.card}>
//           <h1 style={styles.title}>Admin Login</h1>
//           <p style={styles.subtitle}>
//             Sign in to manage pharmacists, staff, medicines and orders.
//           </p>

//           <form onSubmit={handleSubmit} style={styles.form}>
//             <label style={styles.label}>Admin email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="admin@example.com"
//               value={formData.email}
//               onChange={handleChange}
//               style={styles.input}
//               required
//             />

//             <label style={styles.label}>Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter password"
//               value={formData.password}
//               onChange={handleChange}
//               style={styles.input}
//               required
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               style={{
//                 ...styles.button,
//                 opacity: loading ? 0.8 : 1,
//                 cursor: loading ? "wait" : "pointer",
//               }}
//             >
//               {loading ? "Logging in..." : "Login as admin"}
//             </button>
//           </form>

//           {message && (
//             <p
//               style={{
//                 ...styles.message,
//                 color: "#dc2626",
//               }}
//             >
//               {message}
//             </p>
//           )}

//           <p style={styles.footer}>
//             Not an admin?{" "}
//             <Link to="/login" style={styles.link}>
//               Go to user login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     display: "flex",
//     fontFamily:
//       "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
//     color: "#111827",
//     backgroundColor: "#0f172a",
//   },
//   leftPane: {
//     flex: 1.2,
//     position: "relative",
//     overflow: "hidden",
//     display: "flex",
//     alignItems: "stretch",
//     justifyContent: "center",
//   },
//   leftOverlay: {
//     flex: 1,
//     padding: "2.5rem 2rem",
//     backgroundImage:
//       "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,64,175,0.9))",
//     color: "#e5e7eb",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     gap: 16,
//   },
//   logoRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     marginBottom: 12,
//   },
//   logoImage: {
//     width: 44,
//     height: 44,
//     borderRadius: "999px",
//     objectFit: "cover",
//     border: "2px solid rgba(191,219,254,0.7)",
//   },
//   brandTitle: {
//     margin: 0,
//     fontSize: "1.15rem",
//     fontWeight: 600,
//     color: "#e5e7eb",
//   },
//   brandSubtitle: {
//     margin: 0,
//     fontSize: "0.8rem",
//     color: "#9ca3af",
//   },
//   leftHeading: {
//     margin: 0,
//     marginTop: 8,
//     fontSize: "1.5rem",
//     fontWeight: 600,
//     color: "#f9fafb",
//   },
//   leftText: {
//     margin: 0,
//     marginTop: 6,
//     fontSize: "0.9rem",
//     color: "#d1d5db",
//     maxWidth: 360,
//   },
//   leftList: {
//     marginTop: 14,
//     paddingLeft: 18,
//     fontSize: "0.85rem",
//     color: "#e5e7eb",
//     lineHeight: 1.6,
//   },
//   rightPane: {
//     flex: 1,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background:
//       "radial-gradient(circle at top, #e0f2fe 0, #f9fafb 55%, #f3f4f6 100%)",
//     padding: "1.5rem",
//   },
//   card: {
//     width: "100%",
//     maxWidth: 380,
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     padding: "1.9rem 1.5rem 1.6rem",
//     boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
//     border: "1px solid #e5e7eb",
//   },
//   title: {
//     fontSize: "1.35rem",
//     fontWeight: 600,
//     marginBottom: 6,
//     textAlign: "left",
//   },
//   subtitle: {
//     fontSize: "0.9rem",
//     color: "#6b7280",
//     textAlign: "left",
//     marginBottom: 18,
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//   },
//   label: {
//     fontSize: "0.8rem",
//     fontWeight: 500,
//     color: "#4b5563",
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
//   button: {
//     width: "100%",
//     marginTop: 8,
//     background: "linear-gradient(to right, #2563eb, #1d4ed8)",
//     color: "#ffffff",
//     borderRadius: 999,
//     border: "none",
//     padding: "9px 12px",
//     fontSize: "0.9rem",
//     fontWeight: 500,
//   },
//   message: {
//     marginTop: 10,
//     fontSize: "0.85rem",
//     textAlign: "center",
//   },
//   footer: {
//     marginTop: 14,
//     fontSize: "0.85rem",
//     textAlign: "center",
//     color: "#6b7280",
//   },
//   link: {
//     color: "#2563eb",
//     marginLeft: 4,
//     textDecoration: "underline",
//     fontWeight: 500,
//   },
// };

// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../services/api";
// import logo from "../assets/pharmacy-logo.jpg"; // or any image you like

// export default function AdminLogin() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [forgotLoading, setForgotLoading] = useState(false); // NEW
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMessage("");
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);
//     try {
//       const res = await api.post("/auth/login", {
//         email: formData.email,
//         password: formData.password,
//       });

//       // Ensure this user is admin
//       const role = res.user?.role; // backend sends role inside user
//       if (role !== "admin") {
//         setMessage("Access denied. This login is for admin accounts only.");
//         setLoading(false);
//         return;
//       }

//       // store token + role
//       if (res.token) {
//         localStorage.setItem("token", res.token);
//       }
//       if (role) {
//         localStorage.setItem("role", role);
//       }

//       navigate("/admin-dashboard");
//     } catch (err) {
//       setMessage(
//         err.response?.data?.message ||
//           err.message ||
//           "Admin login failed. Check your credentials."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // NEW: forgot password handler (sends verification / reset code to email)
//   const handleForgotPassword = async () => {
//     setMessage("");
//     if (!formData.email) {
//       setMessage("Enter your admin email first, then click Forgot password.");
//       return;
//     }

//     try {
//       setForgotLoading(true);
//       const res = await api.post("/auth/forgot-password", {
//         email: formData.email,
//       });

//       setMessage(
//         res.message ||
//           "Reset code sent to your email. Enter it on the next screen."
//       );
//       navigate("/admin-reset-password"); // <-- IMPORTANT
//     } catch (err) {
//       setMessage(
//         err.response?.data?.message || "Failed to send reset code. Try again."
//       );
//     } finally {
//       setForgotLoading(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       {/* Left side: image / branding */}
//       <div style={styles.leftPane}>
//         <div style={styles.leftOverlay}>
//           <div style={styles.logoRow}>
//             <img src={logo} alt="Smart Pharmacy" style={styles.logoImage} />
//             <div>
//               <h1 style={styles.brandTitle}>Smart Pharmacy</h1>
//               <p style={styles.brandSubtitle}>Admin Control Panel</p>
//             </div>
//           </div>
//           <h2 style={styles.leftHeading}>
//             Manage your pharmacy with confidence.
//           </h2>
//           <p style={styles.leftText}>
//             Monitor medicines, orders and staff from a single, secure dashboard.
//           </p>
//           <ul style={styles.leftList}>
//             <li>Real‑time stock and low‑inventory alerts.</li>
//             <li>Central control for pharmacists and staff.</li>
//             <li>Secure, role‑based access for your team.</li>
//           </ul>
//         </div>
//       </div>

//       {/* Right side: admin login form */}
//       <div style={styles.rightPane}>
//         <div style={styles.card}>
//           <h1 style={styles.title}>Admin Login</h1>
//           <p style={styles.subtitle}>
//             Sign in to manage pharmacists, staff, medicines and orders.
//           </p>

//           <form onSubmit={handleSubmit} style={styles.form}>
//             <label style={styles.label}>Admin email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="admin@example.com"
//               value={formData.email}
//               onChange={handleChange}
//               style={styles.input}
//               required
//             />

//             <label style={styles.label}>Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter password"
//               value={formData.password}
//               onChange={handleChange}
//               style={styles.input}
//               required
//             />

//             {/* NEW: forgot password link under password */}
//             <div
//               style={{
//                 marginTop: 4,
//                 marginBottom: 4,
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 fontSize: "0.8rem",
//               }}
//             >
//               <button
//                 type="button"
//                 onClick={handleForgotPassword}
//                 disabled={forgotLoading}
//                 style={{
//                   border: "none",
//                   background: "transparent",
//                   color: "#2563eb",
//                   textDecoration: "underline",
//                   cursor: forgotLoading ? "wait" : "pointer",
//                   padding: 0,
//                 }}
//               >
//                 {forgotLoading ? "Sending code..." : "Forgot password?"}
//               </button>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               style={{
//                 ...styles.button,
//                 opacity: loading ? 0.8 : 1,
//                 cursor: loading ? "wait" : "pointer",
//               }}
//             >
//               {loading ? "Logging in..." : "Login as admin"}
//             </button>
//           </form>

//           {message && (
//             <p
//               style={{
//                 ...styles.message,
//                 color:
//                   message.toLowerCase().includes("code") ||
//                   message.toLowerCase().includes("sent")
//                     ? "#16a34a"
//                     : "#dc2626",
//               }}
//             >
//               {message}
//             </p>
//           )}

//           <p style={styles.footer}>
//             Not an admin?{" "}
//             <Link to="/login" style={styles.link}>
//               Go to user login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     display: "flex",
//     fontFamily:
//       "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
//     color: "#111827",
//     backgroundColor: "#0f172a",
//   },
//   leftPane: {
//     flex: 1.2,
//     position: "relative",
//     overflow: "hidden",
//     display: "flex",
//     alignItems: "stretch",
//     justifyContent: "center",
//   },
//   leftOverlay: {
//     flex: 1,
//     padding: "2.5rem 2rem",
//     backgroundImage:
//       "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,64,175,0.9))",
//     color: "#e5e7eb",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     gap: 16,
//   },
//   logoRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     marginBottom: 12,
//   },
//   logoImage: {
//     width: 44,
//     height: 44,
//     borderRadius: "999px",
//     objectFit: "cover",
//     border: "2px solid rgba(191,219,254,0.7)",
//   },
//   brandTitle: {
//     margin: 0,
//     fontSize: "1.15rem",
//     fontWeight: 600,
//     color: "#e5e7eb",
//   },
//   brandSubtitle: {
//     margin: 0,
//     fontSize: "0.8rem",
//     color: "#9ca3af",
//   },
//   leftHeading: {
//     margin: 0,
//     marginTop: 8,
//     fontSize: "1.5rem",
//     fontWeight: 600,
//     color: "#f9fafb",
//   },
//   leftText: {
//     margin: 0,
//     marginTop: 6,
//     fontSize: "0.9rem",
//     color: "#d1d5db",
//     maxWidth: 360,
//   },
//   leftList: {
//     marginTop: 14,
//     paddingLeft: 18,
//     fontSize: "0.85rem",
//     color: "#e5e7eb",
//     lineHeight: 1.6,
//   },
//   rightPane: {
//     flex: 1,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background:
//       "radial-gradient(circle at top, #e0f2fe 0, #f9fafb 55%, #f3f4f6 100%)",
//     padding: "1.5rem",
//   },
//   card: {
//     width: "100%",
//     maxWidth: 380,
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     padding: "1.9rem 1.5rem 1.6rem",
//     boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
//     border: "1px solid #e5e7eb",
//   },
//   title: {
//     fontSize: "1.35rem",
//     fontWeight: 600,
//     marginBottom: 6,
//     textAlign: "left",
//   },
//   subtitle: {
//     fontSize: "0.9rem",
//     color: "#6b7280",
//     textAlign: "left",
//     marginBottom: 18,
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//   },
//   label: {
//     fontSize: "0.8rem",
//     fontWeight: 500,
//     color: "#4b5563",
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
//   button: {
//     width: "100%",
//     marginTop: 8,
//     background: "linear-gradient(to right, #2563eb, #1d4ed8)",
//     color: "#ffffff",
//     borderRadius: 999,
//     border: "none",
//     padding: "9px 12px",
//     fontSize: "0.9rem",
//     fontWeight: 500,
//   },
//   message: {
//     marginTop: 10,
//     fontSize: "0.85rem",
//     textAlign: "center",
//   },
//   footer: {
//     marginTop: 14,
//     fontSize: "0.85rem",
//     textAlign: "center",
//     color: "#6b7280",
//   },
//   link: {
//     color: "#2563eb",
//     marginLeft: 4,
//     textDecoration: "underline",
//     fontWeight: 500,
//   },
// };

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/pharmacy-logo.jpg"; // or any image you like

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showLeftPane, setShowLeftPane] = useState(true); // toggle for branding pane

  const navigate = useNavigate();

  // Auto-redirect if already logged in as admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role === "admin") {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [navigate]);

  // Simple responsive behaviour for split layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowLeftPane(false);
      } else {
        setShowLeftPane(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // axios: data is under res.data
      const data = res.data || {};
      const role = data.user?.role;

      if (role !== "admin") {
        setMessage("Access denied. This login is for admin accounts only.");
        setLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (role) {
        localStorage.setItem("role", role);
      }

      navigate("/admin-dashboard", { replace: true });
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Admin login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setMessage("");
    if (!formData.email) {
      setMessage("Enter your admin email first, then click Forgot password.");
      return;
    }

    try {
      setForgotLoading(true);
      const res = await api.post("/auth/forgot-password", {
        email: formData.email,
      });

      const data = res.data || {};
      setMessage(
        data.message ||
          "Reset code sent to your email. Please check it."
      );
      navigate("/admin-reset-password");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to send reset code. Try again."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Top bar for small screens */}
      <div style={styles.mobileTopBar}>
        <div style={styles.mobileBrand}>
          <img src={logo} alt="Smart Pharmacy" style={styles.mobileLogo} />
          <span style={styles.mobileBrandText}>Smart Pharmacy Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setShowLeftPane((prev) => !prev)}
          style={styles.mobileToggleBtn}
        >
          {showLeftPane ? "Hide Info" : "Show Info"}
        </button>
      </div>

      {/* Left side: image / branding */}
      {showLeftPane && (
        <div style={styles.leftPane}>
          <div style={styles.leftOverlay}>
            <div style={styles.logoRow}>
              <img src={logo} alt="Smart Pharmacy" style={styles.logoImage} />
              <div>
                <h1 style={styles.brandTitle}>Smart Pharmacy</h1>
                <p style={styles.brandSubtitle}>Admin Control Panel</p>
              </div>
            </div>
            <h2 style={styles.leftHeading}>
              Manage your pharmacy with confidence.
            </h2>
            <p style={styles.leftText}>
              Monitor medicines, orders and staff from a single, secure
              dashboard.
            </p>
            <ul style={styles.leftList}>
              <li>Real‑time stock and low‑inventory alerts.</li>
              <li>Central control for pharmacists and staff.</li>
              <li>Secure, role‑based access for your team.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Right side: admin login form */}
      <div style={styles.rightPane}>
        <div style={styles.card}>
          <h1 style={styles.title}>Admin Login</h1>
          <p style={styles.subtitle}>
            Sign in to manage pharmacists, staff, medicines and orders.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Admin email</label>
            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <div
              style={{
                marginTop: 4,
                marginBottom: 4,
                display: "flex",
                justifyContent: "flex-end",
                fontSize: "0.8rem",
              }}
            >
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#2563eb",
                  textDecoration: "underline",
                  cursor: forgotLoading ? "wait" : "pointer",
                  padding: 0,
                }}
              >
                {forgotLoading ? "Sending code..." : "Forgot password?"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Logging in..." : "Login as admin"}
            </button>
          </form>

          {message && (
            <p
              style={{
                ...styles.message,
                color:
                  message.toLowerCase().includes("code") ||
                  message.toLowerCase().includes("sent")
                    ? "#16a34a"
                    : "#dc2626",
              }}
            >
              {message}
            </p>
          )}

          <p style={styles.footer}>
            Not an admin?{" "}
            <Link to="/login" style={styles.link}>
              Go to user login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "row",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#111827",
    backgroundColor: "#0f172a",
  },
  mobileTopBar: {
    display: "none",
  },
  mobileBrand: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  mobileLogo: {
    width: 30,
    height: 30,
    borderRadius: "999px",
    objectFit: "cover",
  },
  mobileBrandText: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#e5e7eb",
  },
  mobileToggleBtn: {
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.8)",
    padding: "4px 10px",
    fontSize: "0.8rem",
    backgroundColor: "rgba(15,23,42,0.9)",
    color: "#e5e7eb",
    cursor: "pointer",
  },
  leftPane: {
    flex: 1.2,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
  },
  leftOverlay: {
    flex: 1,
    padding: "2.5rem 2rem",
    backgroundImage:
      "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,64,175,0.9))",
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 16,
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  logoImage: {
    width: 44,
    height: 44,
    borderRadius: "999px",
    objectFit: "cover",
    border: "2px solid rgba(191,219,254,0.7)",
  },
  brandTitle: {
    margin: 0,
    fontSize: "1.15rem",
    fontWeight: 600,
    color: "#e5e7eb",
  },
  brandSubtitle: {
    margin: 0,
    fontSize: "0.8rem",
    color: "#9ca3af",
  },
  leftHeading: {
    margin: 0,
    marginTop: 8,
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#f9fafb",
  },
  leftText: {
    margin: 0,
    marginTop: 6,
    fontSize: "0.9rem",
    color: "#d1d5db",
    maxWidth: 360,
  },
  leftList: {
    marginTop: 14,
    paddingLeft: 18,
    fontSize: "0.85rem",
    color: "#e5e7eb",
    lineHeight: 1.6,
  },
  rightPane: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at top, #e0f2fe 0, #f9fafb 55%, #f3f4f6 100%)",
    padding: "1.5rem",
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: "1.9rem 1.5rem 1.6rem",
    boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
    border: "1px solid #e5e7eb",
  },
  title: {
    fontSize: "1.35rem",
    fontWeight: 600,
    marginBottom: 6,
    textAlign: "left",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#6b7280",
    textAlign: "left",
    marginBottom: 18,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "#4b5563",
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
  button: {
    width: "100%",
    marginTop: 8,
    background: "linear-gradient(to right, #2563eb, #1d4ed8)",
    color: "#ffffff",
    borderRadius: 999,
    border: "none",
    padding: "9px 12px",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  message: {
    marginTop: 10,
    fontSize: "0.85rem",
    textAlign: "center",
  },
  footer: {
    marginTop: 14,
    fontSize: "0.85rem",
    textAlign: "center",
    color: "#6b7280",
  },
  link: {
    color: "#2563eb",
    marginLeft: 4,
    textDecoration: "underline",
    fontWeight: 500,
  },
};

// Responsive overrides via JS (optional, for better UX)
if (typeof window !== "undefined") {
  const applyResponsive = () => {
    const w = window.innerWidth;
    if (w < 768) {
      styles.page.flexDirection = "column";
      styles.rightPane.padding = "1.25rem";
      styles.mobileTopBar.display = "flex";
      styles.mobileTopBar.justifyContent = "space-between";
      styles.mobileTopBar.alignItems = "center";
      styles.mobileTopBar.padding = "0.75rem 0.9rem";
      styles.mobileTopBar.backgroundColor = "#020617";
      styles.mobileTopBar.position = "sticky";
      styles.mobileTopBar.top = 0;
      styles.mobileTopBar.zIndex = 20;
    } else {
      styles.page.flexDirection = "row";
      styles.mobileTopBar.display = "none";
    }
  };
  applyResponsive();
  window.addEventListener("resize", applyResponsive);
}
