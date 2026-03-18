
import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Calendar,
  Save,
  UserCircle,
} from "lucide-react";

const PharmacistProfile = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Profile Form State
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    joinDate: "",
  });

  // Password Form State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 1. Fetch Profile Data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/profile");
      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "Pharmacist",
        joinDate: data.createdAt
          ? new Date(data.createdAt).toLocaleDateString()
          : "N/A",
      });
    } catch (err) {
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Input Changes
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // 3. Update Profile Details
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.put("/users/profile", {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      });

      // Update Local Storage User Info
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...userInfo, ...res.data }),
      );

      setMessage("Profile details updated successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    }
  };

  // 4. Update Password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await api.put("/users/profile", {
        password: passwords.newPassword,
      });
      setMessage("Password changed successfully.");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Password update failed.");
    }
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center py-5"
        style={{ minHeight: "60vh", backgroundColor: "#f0f2f2" }}
      >
        <div className="spinner-border text-success me-2" />
        <span className="text-muted small">Loading secure profile...</span>
      </div>
    );

  return (
    <div
      className="container-fluid p-3 p-md-4 animate-fade-in"
      style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="mb-4 pb-3 border-bottom border-secondary-subtle">
        <h2
          className="fw-bold mb-1 d-flex align-items-center gap-2"
          style={{ color: "#0F1111", fontSize: "1.5rem" }}
        >
          <UserCircle style={{ color: "#007185" }} size={24} /> Account Settings
        </h2>
        <p className="small mb-0" style={{ color: "#565959" }}>
          Manage your professional identity and account security.
        </p>
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
          <AlertCircle size={18} /> {error}
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
          <CheckCircle size={18} /> {message}
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Profile Card */}
        <div className="col-lg-4">
          <div
            className="card shadow-sm border rounded-1 h-100 overflow-hidden bg-white"
            style={{ borderColor: "#D5D9D9" }}
          >
            <div
              className="card-body text-center p-5"
              style={{ backgroundColor: "#F0F2F2" }}
            >
              <div className="position-relative d-inline-block mb-3">
                <div
                  className="bg-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                  style={{
                    width: "90px",
                    height: "90px",
                    fontSize: "2.2rem",
                    color: "#007185",
                    border: "2px solid #D5D9D9",
                  }}
                >
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <span className="position-absolute bottom-0 end-0 p-1 bg-white border rounded-circle shadow-sm">
                  <Shield size={18} style={{ color: "#067D62" }} />
                </span>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: "#0F1111" }}>
                {profile.name}
              </h5>
              <div
                className="badge rounded-1 px-3 py-1 mb-3"
                style={{
                  backgroundColor: "#f2fcf5",
                  color: "#067D62",
                  border: "1px solid #067D62",
                  fontSize: "0.7rem",
                  letterSpacing: "0.5px",
                }}
              >
                {profile.role.toUpperCase()}
              </div>

              <div
                className="text-start mt-4 pt-4 border-top"
                style={{ borderColor: "#D5D9D9" }}
              >
                <div
                  className="d-flex align-items-center gap-3 mb-3 small"
                  style={{ color: "#565959" }}
                >
                  <Mail size={16} /> {profile.email}
                </div>
                <div
                  className="d-flex align-items-center gap-3 mb-3 small"
                  style={{ color: "#565959" }}
                >
                  <Calendar size={16} /> Joined: {profile.joinDate}
                </div>
                <div
                  className="d-flex align-items-center gap-3 small"
                  style={{ color: "#565959" }}
                >
                  <Stethoscope size={16} />
                  <span>
                    License:{" "}
                    <span className="fw-bold text-dark">PH-882910</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="col-lg-8">
          <div
            className="card shadow-sm border rounded-1 bg-white"
            style={{ borderColor: "#D5D9D9" }}
          >
            <div className="card-header bg-white border-bottom px-4 pt-4 pb-0">
              <ul className="nav amazon-tabs">
                <li className="nav-item">
                  <button className="nav-link active fw-bold">
                    Edit Profile
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body p-4">
              {/* Personal Details Form */}
              <h6
                className="fw-bold mb-3 d-flex align-items-center gap-2"
                style={{ color: "#0F1111", fontSize: "0.95rem" }}
              >
                <User size={18} style={{ color: "#007185" }} /> Personal
                Information
              </h6>

              <form onSubmit={handleProfileUpdate}>
                <div className="row g-3">
                  <div className="col-md-6">
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
                  <div className="col-md-6">
                    <label
                      className="form-label small fw-bold mb-1"
                      style={{ color: "#0F1111" }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control amazon-input shadow-none"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      placeholder="+977..."
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold mb-1 text-muted">
                      Email Address (Primary)
                    </label>
                    <input
                      type="email"
                      className="form-control bg-light text-muted border-secondary-subtle"
                      value={profile.email}
                      disabled
                      style={{ cursor: "not-allowed" }}
                    />
                  </div>
                  <div className="col-12 text-end">
                    <button
                      type="submit"
                      className="btn px-4 shadow-sm border-0 fw-medium"
                      style={{
                        backgroundColor: "#FFD814",
                        borderRadius: "8px",
                        color: "#0F1111",
                      }}
                    >
                      <Save size={16} className="me-2" /> Update Profile
                    </button>
                  </div>
                </div>
              </form>

              <hr className="my-5" style={{ borderColor: "#D5D9D9" }} />

              {/* Security Form */}
              <h6
                className="fw-bold mb-3 d-flex align-items-center gap-2"
                style={{ color: "#0F1111", fontSize: "0.95rem" }}
              >
                <Lock size={18} style={{ color: "#B12704" }} /> Security & Login
              </h6>

              <form onSubmit={handlePasswordUpdate}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label
                      className="form-label small fw-bold mb-1"
                      style={{ color: "#0F1111" }}
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      className="form-control amazon-input shadow-none"
                      placeholder="Min 6 characters"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      className="form-label small fw-bold mb-1"
                      style={{ color: "#0F1111" }}
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control amazon-input shadow-none"
                      placeholder="Repeat new password"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="col-12">
                    <div
                      className="d-flex align-items-center gap-2 p-2 rounded-1 bg-light small"
                      style={{ color: "#565959", border: "1px solid #D5D9D9" }}
                    >
                      <Shield size={14} />
                      For security, your session may reset after a password
                      update.
                    </div>
                  </div>
                  <div className="col-12 text-end">
                    <button
                      type="submit"
                      className="btn py-2 px-4 shadow-sm fw-medium bg-white border"
                      disabled={!passwords.newPassword}
                      style={{
                        borderColor: "#D5D9D9",
                        borderRadius: "8px",
                        color: "#B12704",
                      }}
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .amazon-tabs .nav-link { 
          color: #0F1111; 
          border: none; 
          border-bottom: 2.5px solid #e47911;
          border-radius: 0;
          padding: 0.5rem 1.5rem;
          background: transparent;
        }

        .amazon-input:focus {
          border-color: #e47911 !important;
          box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important;
        }

        .amazon-input {
          border: 1px solid #888C8C;
          border-radius: 3px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default PharmacistProfile;
