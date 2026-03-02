import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Loader2, Info } from "lucide-react";
import api from "../services/api";

const SetupPassword = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Strong Password Regex
  // Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Regex Validation Check
    if (!passwordRegex.test(newPassword)) {
      setError("Password does not meet the security requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Call backend to update password and remove mustChangePassword flag
      await api.put("/users/first-login-setup", { newPassword });

      // Update the user context locally so the app knows the flag is gone
      const updatedUser = { ...user, mustChangePassword: false };
      login({ user: updatedUser, token: localStorage.getItem("token") });

      // Send them to their dashboard!
      navigate("/doctor-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light-subtle w-100"
        style={{ maxWidth: "480px" }}
      >
        <div className="text-center mb-4">
          <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-inline-flex mb-3">
            <ShieldCheck size={40} />
          </div>
          <h3 className="fw-black text-dark tracking-tight mb-1">
            Secure Your Account
          </h3>
          <p className="text-muted small">
            Welcome, Dr. {user?.name?.split(" ")[0] || "Provider"}. Since this
            is your first time logging in, please set a new, secure password.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small fw-bold text-center animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted text-uppercase tracking-wider">
              New Password
            </label>
            <input
              type="password"
              className={`form-control bg-light ${newPassword && !passwordRegex.test(newPassword) ? "border-danger" : ""} ${newPassword && passwordRegex.test(newPassword) ? "border-success" : ""}`}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError(""); // Clear error when typing
              }}
              required
            />
            {/* Password Hint Box */}
            <div className="bg-light border border-light-subtle rounded-3 p-3 mt-2 small text-muted">
              <div className="d-flex align-items-center gap-1 fw-bold text-dark mb-1">
                <Info size={14} className="text-primary" /> Password
                Requirements:
              </div>
              <ul className="mb-0 ps-3">
                <li
                  className={
                    newPassword.length >= 8 ? "text-success fw-medium" : ""
                  }
                >
                  At least 8 characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(newPassword) ? "text-success fw-medium" : ""
                  }
                >
                  At least one uppercase letter (A-Z)
                </li>
                <li
                  className={
                    /[a-z]/.test(newPassword) ? "text-success fw-medium" : ""
                  }
                >
                  At least one lowercase letter (a-z)
                </li>
                <li
                  className={
                    /\d/.test(newPassword) ? "text-success fw-medium" : ""
                  }
                >
                  At least one number (0-9)
                </li>
                <li
                  className={
                    /[@$!%*?&]/.test(newPassword)
                      ? "text-success fw-medium"
                      : ""
                  }
                >
                  At least one special character (@$!%*?&)
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-muted text-uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              type="password"
              className={`form-control bg-light ${confirmPassword && newPassword !== confirmPassword ? "border-danger" : ""} ${confirmPassword && newPassword === confirmPassword && newPassword !== "" ? "border-success" : ""}`}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold rounded-pill shadow-sm d-flex justify-content-center align-items-center gap-2 py-2"
            disabled={
              loading ||
              !passwordRegex.test(newPassword) ||
              newPassword !== confirmPassword
            }
          >
            {loading ? (
              <Loader2 size={18} className="spin-animation" />
            ) : (
              "Save & Continue to Dashboard"
            )}
          </button>
        </form>
      </div>

      <style>{`
        .tracking-tight { letter-spacing: -0.03em; }
        .tracking-wider { letter-spacing: 0.05em; }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default SetupPassword;
