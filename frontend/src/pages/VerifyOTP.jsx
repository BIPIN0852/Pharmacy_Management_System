import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("pendingEmail");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });

      setMessage(res.message || "Verification successful.");

      if (res.token) {
        localStorage.setItem("token", res.token);
      }
      if (res.role) {
        localStorage.setItem("role", res.role);
      }
      localStorage.removeItem("pendingEmail");

      const role = res.role;
      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "pharmacist") navigate("/pharmacist-dashboard");
      else if (role === "staff") navigate("/pharmacist-dashboard");
      else if (role === "customer") navigate("/customer-dashboard");
      else navigate("/login");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Verification failed. Please check the code."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setMessage("No email found. Please register again.");
      return;
    }
    setMessage("");
    try {
      const res = await api.post("/auth/resend-otp", { email });
      setMessage(res.message || "OTP resent to your email.");
      setResendTimer(60);
    } catch (err) {
      setMessage(
        err.response?.data?.message || err.message || "Failed to resend OTP."
      );
    }
  };

  return (
    <motion.div
      style={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        style={styles.cardWrapper}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div style={styles.header}>
          <div style={styles.logoCircle}>💊</div>
          <div>
            <h1 style={styles.title}>Smart Pharmacy System</h1>
            <p style={styles.subtitle}>Verify your email to continue</p>
          </div>
        </div>

        <p style={styles.infoText}>
          Enter the 6‑digit verification code sent to your registered email
          address. This step helps keep your account secure.
        </p>

        <form onSubmit={handleVerify} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              readOnly
              style={{
                ...styles.input,
                backgroundColor: "#f3f4f6",
                cursor: "not-allowed",
              }}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>OTP code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6‑digit code"
              maxLength={6}
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.verifyButton,
              opacity: loading ? 0.8 : 1,
              cursor: loading ? "wait" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify account"}
          </button>

          {message && <p style={styles.message}>{message}</p>}

          <div style={styles.resendRow}>
            {resendTimer > 0 ? (
              <p style={styles.resendText}>
                You can request a new code in{" "}
                <span style={styles.resendHighlight}>{resendTimer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                style={styles.resendButton}
              >
                Resend verification code
              </button>
            )}
          </div>
        </form>

        <p style={styles.footerNote}>
          If you did not receive the email, please check your spam folder. If it
          still does not appear, contact your pharmacy administrator.
        </p>
      </motion.div>
    </motion.div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at top, #e0f2fe 0, #f9fafb 55%, #f3f4f6 100%)",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#111827",
  },
  cardWrapper: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: "1.75rem 1.5rem 1.5rem",
    boxShadow: "0 18px 45px rgba(15,23,42,0.16)",
    border: "1px solid #e5e7eb",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: "999px",
    backgroundColor: "#e0f2fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
  },
  title: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: 600,
  },
  subtitle: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#6b7280",
  },
  infoText: {
    fontSize: "0.88rem",
    color: "#4b5563",
    marginBottom: 16,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: "0.9rem",
    outline: "none",
    color: "#111827",
  },
  verifyButton: {
    width: "100%",
    marginTop: 4,
    background: "linear-gradient(to right, #2563eb, #1d4ed8)",
    color: "#ffffff",
    fontWeight: 500,
    padding: "9px 12px",
    borderRadius: 999,
    border: "none",
    fontSize: "0.9rem",
  },
  message: {
    marginTop: 8,
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#374151",
  },
  resendRow: {
    marginTop: 8,
    textAlign: "center",
  },
  resendText: {
    fontSize: "0.82rem",
    color: "#6b7280",
  },
  resendHighlight: {
    fontWeight: 600,
    color: "#111827",
  },
  resendButton: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontSize: "0.82rem",
    cursor: "pointer",
    textDecoration: "underline",
  },
  footerNote: {
    marginTop: 14,
    fontSize: "0.78rem",
    color: "#9ca3af",
    textAlign: "center",
  },
};
