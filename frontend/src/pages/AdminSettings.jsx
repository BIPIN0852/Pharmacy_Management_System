import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  User,
  Lock,
  Moon,
  Sun,
  Save,
  Shield,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Profile Data
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  // Password Data
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 1. Initial Load (Theme + User Data)
  useEffect(() => {
    const initSettings = async () => {
      try {
        setLoading(true);
        // Load Theme
        const storedTheme = localStorage.getItem("dashboard-dark");
        if (storedTheme === "true") {
          setDarkMode(true);
          document.body.classList.add("bg-dark", "text-light");
        }

        // Load User Profile
        const res = await api.get("/users/profile");
        if (res.data) {
          setProfile({
            name: res.data.name || "",
            email: res.data.email || "",
          });
        }
      } catch (err) {
        console.error("Settings load error:", err);
        setError("Could not load user profile data.");
      } finally {
        setLoading(false);
      }
    };

    initSettings();
  }, []);

  // 2. Handle Theme Toggle
  const handleThemeToggle = () => {
    try {
      setSavingTheme(true);
      const next = !darkMode;
      setDarkMode(next);
      localStorage.setItem("dashboard-dark", String(next));

      if (next) {
        document.body.classList.add("bg-dark", "text-light");
      } else {
        document.body.classList.remove("bg-dark", "text-light");
      }
    } catch (err) {
      console.error("Theme toggle error", err);
    } finally {
      setSavingTheme(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((p) => ({ ...p, [name]: value }));
  };

  // 3. Submit Profile Updates
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.put("/users/profile", {
        name: profile.name,
        email: profile.email,
      });

      // Update local storage user info
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...userInfo, ...res.data }),
      );

      setMessage("Profile details updated successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  // 4. Submit Password Updates
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await api.put("/users/profile", {
        password: passwords.newPassword,
        // Uncomment if backend requires old password
        // oldPassword: passwords.currentPassword
      });

      setMessage("Security credentials updated successfully.");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <Loader2
          className="spin-animation mb-3"
          style={{ color: "#007185" }}
          size={48}
        />
        <span
          className="text-secondary fw-bold text-uppercase small"
          style={{ letterSpacing: "0.5px" }}
        >
          Loading Configuration...
        </span>
        <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      className="container-fluid p-3 p-md-4 animate-fade-in"
      style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
    >
      {/* Header Area */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary-subtle">
        <div>
          <h2
            className="fw-bold mb-1 d-flex align-items-center gap-2"
            style={{ color: "#0F1111", fontSize: "1.5rem" }}
          >
            <Settings style={{ color: "#007185" }} size={24} /> Settings &
            Preferences
          </h2>
          <p className="small mb-0" style={{ color: "#565959" }}>
            Manage your account security and dashboard appearance.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div
          className="alert border-0 shadow-sm mb-4 rounded-1 d-flex align-items-center gap-2"
          style={{
            backgroundColor: "#fef0f0",
            color: "#B12704",
            borderLeft: "4px solid #B12704",
          }}
        >
          <AlertCircle size={18} /> <span className="small">{error}</span>
        </div>
      )}
      {message && (
        <div
          className="alert border-0 shadow-sm mb-4 rounded-1 d-flex align-items-center gap-2"
          style={{
            backgroundColor: "#f2fcf5",
            color: "#067D62",
            borderLeft: "4px solid #067D62",
          }}
        >
          <CheckCircle size={18} /> <span className="small">{message}</span>
        </div>
      )}

      <div className="row g-4">
        {/* 1. Profile Information */}
        <div className="col-lg-4">
          <div
            className="card shadow-sm border bg-white rounded-1 h-100"
            style={{ borderColor: "#D5D9D9" }}
          >
            <div className="card-header bg-white border-bottom pt-4 px-4 pb-3">
              <h5
                className="fw-bold mb-0 d-flex align-items-center gap-2 fs-6"
                style={{ color: "#0F1111" }}
              >
                <User size={18} style={{ color: "#007185" }} /> My Profile
              </h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleProfileSubmit}>
                <div className="mb-3">
                  <label
                    className="form-label small fw-bold mb-1"
                    style={{ color: "#0F1111" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control amazon-input shadow-none"
                    value={profile.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="form-label small fw-bold mb-1"
                    style={{ color: "#0F1111" }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control amazon-input shadow-none"
                    value={profile.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn w-100 fw-medium shadow-sm border-0 d-flex align-items-center justify-content-center py-2"
                  style={{
                    backgroundColor: "#FFD814",
                    color: "#0F1111",
                    borderRadius: "8px",
                  }}
                >
                  <Save size={16} className="me-2" /> Save Profile
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 2. Security & Password */}
        <div className="col-lg-4">
          <div
            className="card shadow-sm border bg-white rounded-1 h-100"
            style={{ borderColor: "#D5D9D9", borderTop: "4px solid #B12704" }}
          >
            <div className="card-header bg-white border-bottom pt-3 px-4 pb-3">
              <h5
                className="fw-bold mb-0 d-flex align-items-center gap-2 fs-6"
                style={{ color: "#0F1111" }}
              >
                <Shield size={18} style={{ color: "#B12704" }} /> Security
              </h5>
            </div>
            <div className="card-body p-4">
              <p className="text-muted small mb-4" style={{ color: "#565959" }}>
                Ensure your account is secure by using a strong password.
              </p>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label
                    className="form-label small fw-bold mb-1"
                    style={{ color: "#0F1111" }}
                  >
                    Current Password
                  </label>
                  <div className="input-group amazon-input-group">
                    <span className="input-group-text bg-light border-secondary-subtle">
                      <Lock size={16} style={{ color: "#565959" }} />
                    </span>
                    <input
                      type="password"
                      name="currentPassword"
                      className="form-control shadow-none"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••"
                      autoComplete="current-password"
                      style={{
                        border: "1px solid #888C8C",
                        borderLeft: "none",
                      }}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    className="form-label small fw-bold mb-1"
                    style={{ color: "#0F1111" }}
                  >
                    New Password
                  </label>
                  <div className="input-group amazon-input-group">
                    <span className="input-group-text bg-light border-secondary-subtle">
                      <Lock size={16} style={{ color: "#565959" }} />
                    </span>
                    <input
                      type="password"
                      name="newPassword"
                      className="form-control shadow-none"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Min 6 chars"
                      autoComplete="new-password"
                      style={{
                        border: "1px solid #888C8C",
                        borderLeft: "none",
                      }}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    className="form-label small fw-bold mb-1"
                    style={{ color: "#0F1111" }}
                  >
                    Confirm Password
                  </label>
                  <div className="input-group amazon-input-group">
                    <span className="input-group-text bg-light border-secondary-subtle">
                      <Lock size={16} style={{ color: "#565959" }} />
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control shadow-none"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      style={{
                        border: "1px solid #888C8C",
                        borderLeft: "none",
                      }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn bg-white w-100 fw-medium shadow-sm py-2"
                  style={{
                    border: "1px solid #D5D9D9",
                    color: "#B12704",
                    borderRadius: "8px",
                  }}
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 3. Appearance Settings */}
        <div className="col-lg-4">
          <div
            className="card shadow-sm border bg-white rounded-1 h-100"
            style={{ borderColor: "#D5D9D9" }}
          >
            <div className="card-header bg-white border-bottom pt-4 px-4 pb-3">
              <h5
                className="fw-bold mb-0 d-flex align-items-center gap-2 fs-6"
                style={{ color: "#0F1111" }}
              >
                {darkMode ? (
                  <Moon size={18} style={{ color: "#007185" }} />
                ) : (
                  <Sun size={18} style={{ color: "#e47911" }} />
                )}
                Appearance
              </h5>
            </div>
            <div className="card-body p-4">
              <p className="text-muted small mb-4" style={{ color: "#565959" }}>
                Customize how the admin dashboard looks on your device.
              </p>

              <div
                className="d-flex align-items-center justify-content-between p-3 rounded-1 bg-white border"
                style={{ borderColor: "#D5D9D9" }}
              >
                <span className="fw-bold small" style={{ color: "#0F1111" }}>
                  Dark Mode
                </span>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input shadow-none m-0"
                    type="checkbox"
                    id="darkModeSwitch"
                    checked={darkMode}
                    onChange={handleThemeToggle}
                    disabled={savingTheme}
                    style={{
                      width: "2.5em",
                      height: "1.25em",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .amazon-input { border: 1px solid #888C8C; border-radius: 3px; font-size: 0.9rem; }
        .amazon-input:focus, .amazon-input-group input:focus { 
          border-color: #e47911 !important; 
          box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; 
          outline: none;
        }
        .form-check-input:checked {
          background-color: #007185 !important;
          border-color: #007185 !important;
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AdminSettings;
