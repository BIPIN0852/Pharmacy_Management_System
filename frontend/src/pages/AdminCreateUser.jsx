import React, { useState } from "react";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Stethoscope, // ✅ Added icon for Doctor speciality
} from "lucide-react";

// Point to the correct base API URL
const API_BASE_URL = "http://localhost:5000/api";

const AdminCreateUser = ({ onUserCreated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("staff");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ New state specifically for doctors
  const [speciality, setSpeciality] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Basic Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // If role is doctor, ensure speciality is filled (optional, but good practice)
    if (role === "doctor" && !speciality) {
      setError("Please provide a medical speciality for the doctor.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Payload building
      const payload = { name, email, password, role, phone };
      if (role === "doctor") {
        payload.speciality = speciality;
      }

      const res = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create user.");
      } else {
        setMessage(`User (${role}) created successfully!`);

        // Refresh the table on the right side
        if (onUserCreated) onUserCreated();

        // Clear Form
        setName("");
        setEmail("");
        setPhone("");
        setRole("staff");
        setPassword("");
        setConfirmPassword("");
        setSpeciality("");
      }
    } catch (err) {
      console.error("Create User Error:", err);
      setError("Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
      // Auto-hide success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="h-100 d-flex flex-column animate-fade-in">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden flex-grow-1 bg-white">
        {/* --- HEADER SECTION --- */}
        <div className="card-header bg-transparent border-0 pt-4 pb-2 text-center">
          <div
            className="d-inline-flex align-items-center justify-content-center text-white rounded-circle mb-3 shadow-sm"
            style={{
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", // Matches primary gradient
            }}
          >
            <UserPlus size={28} strokeWidth={2.5} />
          </div>
          <h4 className="fw-bolder text-dark mb-1 tracking-tight">
            Create New User
          </h4>
          <p className="text-muted small px-3 fw-medium">
            Add a new staff member, pharmacist, doctor, or administrator.
          </p>
        </div>

        <div className="card-body p-4 pt-2">
          {/* --- ALERTS --- */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 border-0 shadow-sm bg-danger bg-opacity-10 text-danger small py-2 fw-bold mb-3 animate-fade-in">
              <AlertCircle size={18} /> {error}
            </div>
          )}
          {message && (
            <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 border-0 shadow-sm bg-success bg-opacity-10 text-success small py-2 fw-bold mb-3 animate-fade-in">
              <CheckCircle size={18} /> {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Assign Role (Moved to top for better UX flow) */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
                Assign Role <span className="text-danger">*</span>
              </label>
              <div className="position-relative">
                <Shield
                  size={18}
                  className="position-absolute top-50 translate-middle-y text-primary"
                  style={{ left: "14px" }}
                />
                <select
                  className="form-select bg-light border-light-subtle ps-5 py-2 shadow-none cursor-pointer"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (e.target.value !== "doctor") setSpeciality("");
                  }}
                  disabled={loading}
                >
                  <option value="customer">Patient / Customer</option>
                  <option value="doctor">Doctor</option>{" "}
                  {/* ✅ ADDED DOCTOR ROLE */}
                  <option value="pharmacist">Pharmacist</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            {/* ✅ CONDITIONAL RENDER: Doctor Speciality */}
            {role === "doctor" && (
              <div className="mb-3 animate-fade-in">
                <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
                  Medical Speciality <span className="text-danger">*</span>
                </label>
                <div className="position-relative">
                  <Stethoscope
                    size={18}
                    className="position-absolute top-50 translate-middle-y text-primary"
                    style={{ left: "14px" }}
                  />
                  <input
                    type="text"
                    placeholder="e.g. Cardiologist, General Physician"
                    className="form-control bg-white border-primary border-opacity-50 ps-5 py-2 shadow-none"
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    required={role === "doctor"}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
                Full Name <span className="text-danger">*</span>
              </label>
              <div className="position-relative">
                <User
                  size={18}
                  className="position-absolute top-50 translate-middle-y text-primary"
                  style={{ left: "14px" }}
                />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
                Email Address <span className="text-danger">*</span>
              </label>
              <div className="position-relative">
                <Mail
                  size={18}
                  className="position-absolute top-50 translate-middle-y text-primary"
                  style={{ left: "14px" }}
                />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Phone (Optional) */}
            <div className="mb-3">
              <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
                Phone{" "}
                <span className="text-muted fw-normal text-lowercase">
                  (Optional)
                </span>
              </label>
              <div className="position-relative">
                <Phone
                  size={18}
                  className="position-absolute top-50 translate-middle-y text-primary"
                  style={{ left: "14px" }}
                />
                <input
                  type="text"
                  placeholder="98XXXXXXXX"
                  className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="row g-3 mb-4">
              {/* Password */}
              <div className="col-sm-6">
                <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
                  Password <span className="text-danger">*</span>
                </label>
                <div className="position-relative">
                  <Lock
                    size={18}
                    className="position-absolute top-50 translate-middle-y text-primary"
                    style={{ left: "14px" }}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="col-sm-6">
                <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <div className="position-relative">
                  <Lock
                    size={18}
                    className="position-absolute top-50 translate-middle-y text-primary"
                    style={{ left: "14px" }}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 rounded-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2 hover-lift"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin-animation" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(37, 99, 235, 0.2) !important; transition: all 0.2s ease; }
      `}</style>
    </div>
  );
};

export default AdminCreateUser;
