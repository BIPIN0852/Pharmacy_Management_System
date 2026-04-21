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
  Stethoscope,
  FileText,
  Briefcase,
  DollarSign,
  Activity,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminCreateUser = ({ onUserCreated }) => {
  // Standard User Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("pharmacist"); // Default to pharmacist
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Doctor Fields
  const [speciality, setSpeciality] = useState("");
  const [nmcNumber, setNmcNumber] = useState("");
  const [experience, setExperience] = useState(0);
  const [consultationFee, setConsultationFee] = useState(500);
  const [isAvailable, setIsAvailable] = useState(true);
  const [slots, setSlots] = useState([]);

  // System States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const addSlot = () => {
    setSlots([
      ...slots,
      { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
    ]);
  };

  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
    setSlots(newSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (role === "doctor" && (!speciality || !nmcNumber)) {
      setError("Speciality and NMC Registration are required for Doctors.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = { name, email, password, role, phone };
      if (role === "doctor") {
        payload.speciality = speciality;
        payload.nmcNumber = nmcNumber;
        payload.experience = experience;
        payload.consultationFee = consultationFee;
        payload.isAvailable = isAvailable;
        payload.slots = slots;
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
        if (onUserCreated) onUserCreated();

        // Clear Form
        setName("");
        setEmail("");
        setPhone("");
        setRole("pharmacist");
        setPassword("");
        setConfirmPassword("");
        setSpeciality("");
        setNmcNumber("");
        setExperience(0);
        setConsultationFee(500);
        setIsAvailable(true);
        setSlots([]);
      }
    } catch (err) {
      setError("Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 h-100 bg-white d-flex flex-column">
      {/* HEADER */}
      <div className="card-header bg-white border-0 text-center pt-4 pb-2 flex-shrink-0">
        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3 mb-2 shadow-sm">
          <UserPlus size={28} />
        </div>
        <h5 className="fw-bolder text-dark mb-1">Register Staff</h5>
        <p className="text-muted small mb-0">Create employee accounts.</p>
      </div>

      {/* BODY (Scrollable) */}
      <div
        className="card-body px-4 pb-4 overflow-auto custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        {error && (
          <div className="alert alert-danger small py-2 fw-bold mb-3 d-flex align-items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {message && (
          <div className="alert alert-success small py-2 fw-bold mb-3 d-flex align-items-center gap-2">
            <CheckCircle size={16} /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {/* ROLE DROPDOWN (Restricted to Staff, Pharmacist, Doctor) */}
          <div>
            <label className="form-label small fw-bold text-muted mb-1 d-flex align-items-center gap-1">
              <Shield size={14} /> System Role *
            </label>
            <select
              className="form-select bg-light border-light-subtle shadow-none fw-medium"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="doctor">Doctor</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="staff">Standard Staff</option>
            </select>
          </div>

          <div>
            <label className="form-label small fw-bold text-muted mb-1 d-flex align-items-center gap-1">
              <User size={14} /> Full Name *
            </label>
            <input
              type="text"
              className="form-control bg-light border-light-subtle shadow-none"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="form-label small fw-bold text-muted mb-1 d-flex align-items-center gap-1">
              <Mail size={14} /> Email Address *
            </label>
            <input
              type="email"
              className="form-control bg-light border-light-subtle shadow-none"
              placeholder="jane@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="form-label small fw-bold text-muted mb-1 d-flex align-items-center gap-1">
              <Phone size={14} /> Phone
            </label>
            <input
              type="text"
              className="form-control bg-light border-light-subtle shadow-none"
              placeholder="98XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* DOCTOR ONLY FIELDS (Stacked Vertically) */}
          {role === "doctor" && (
            <div className="bg-info bg-opacity-10 border border-info border-opacity-25 rounded-3 p-3 mt-2 d-flex flex-column gap-3">
              <h6 className="fw-bold text-info mb-0 d-flex align-items-center gap-2">
                <Stethoscope size={16} /> Doctor Details
              </h6>

              <div>
                <label className="form-label small fw-bold text-info mb-1">
                  Speciality *
                </label>
                <input
                  type="text"
                  className="form-control bg-white shadow-none"
                  placeholder="e.g. Cardiologist"
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label small fw-bold text-info mb-1">
                  NMC Registration *
                </label>
                <input
                  type="text"
                  className="form-control bg-white shadow-none"
                  placeholder="NMC-XXXX"
                  value={nmcNumber}
                  onChange={(e) => setNmcNumber(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <div className="w-50">
                  <label className="form-label small fw-bold text-info mb-1">
                    Experience (Yrs)
                  </label>
                  <input
                    type="number"
                    className="form-control bg-white shadow-none"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
                <div className="w-50">
                  <label className="form-label small fw-bold text-info mb-1">
                    Fee (NPR)
                  </label>
                  <input
                    type="number"
                    className="form-control bg-white shadow-none"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                  />
                </div>
              </div>

              {/* Schedule Slots */}
              <div className="pt-2 border-top border-info border-opacity-25">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-bold text-info mb-0">
                    Weekly Shifts
                  </label>
                  <button
                    type="button"
                    className="btn btn-sm btn-info text-white rounded-pill px-2 py-0"
                    style={{ fontSize: "0.7rem" }}
                    onClick={addSlot}
                  >
                    + Add
                  </button>
                </div>
                {slots.map((slot, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 rounded-2 border border-light-subtle mb-2 shadow-sm position-relative"
                  >
                    <button
                      type="button"
                      className="btn btn-link text-danger p-0 position-absolute top-0 end-0 me-2 mt-1"
                      onClick={() => removeSlot(index)}
                    >
                      <Trash2 size={12} />
                    </button>
                    <select
                      className="form-select form-select-sm mb-1 shadow-none border-0 fw-bold text-dark"
                      value={slot.day}
                      onChange={(e) => updateSlot(index, "day", e.target.value)}
                    >
                      {[
                        "MONDAY",
                        "TUESDAY",
                        "WEDNESDAY",
                        "THURSDAY",
                        "FRIDAY",
                        "SATURDAY",
                        "SUNDAY",
                      ].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <div className="d-flex align-items-center gap-1">
                      <input
                        type="time"
                        className="form-control form-control-sm border-0 bg-light"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateSlot(index, "startTime", e.target.value)
                        }
                        required
                      />
                      <span className="small text-muted">to</span>
                      <input
                        type="time"
                        className="form-control form-control-sm border-0 bg-light"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateSlot(index, "endTime", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="form-label small fw-bold text-muted mb-1 d-flex align-items-center gap-1">
              <Lock size={14} /> Password *
            </label>
            <input
              type="password"
              className="form-control bg-light border-light-subtle shadow-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="form-label small fw-bold text-muted mb-1 d-flex align-items-center gap-1">
              <Lock size={14} /> Confirm Password *
            </label>
            <input
              type="password"
              className="form-control bg-light border-light-subtle shadow-none"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 mt-2 rounded-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin-animation" /> Creating...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>

      <style>{`
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminCreateUser;
