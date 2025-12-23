import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function AdminResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !code || !newPassword || !confirm) {
      setMessage("Please fill all fields.");
      return;
    }
    if (newPassword !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/reset-password", {
        email,
        code,
        newPassword,
      });

      setMessage(
        res.message ||
          "Password reset successfully. Redirecting to admin login..."
      );
      setTimeout(() => navigate("/admin-login"), 1500);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Invalid or expired code. Please request a new one."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>Admin password reset</h1>
        <p style={styles.subtitle}>
          Enter your admin email, the code sent to you, and a new password.
        </p>

        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="text"
          placeholder="Verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={styles.input}
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.8 : 1,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Updating..." : "Reset password"}
        </button>

        {message && (
          <p
            style={{
              ...styles.message,
              color: message.toLowerCase().includes("success")
                ? "#16a34a"
                : "#dc2626",
            }}
          >
            {message}
          </p>
        )}

        <p style={styles.footer}>
          Back to{" "}
          <Link to="/admin-login" style={styles.link}>
            admin login
          </Link>
        </p>
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
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: "1.9rem 1.5rem 1.6rem",
    boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#6b7280",
    marginBottom: 10,
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
    marginTop: 6,
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
  footer: {
    marginTop: 10,
    fontSize: "0.85rem",
    textAlign: "center",
    color: "#6b7280",
  },
  link: {
    color: "#2563eb",
    textDecoration: "underline",
    marginLeft: 4,
    fontWeight: 500,
  },
};
