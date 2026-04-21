import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  UserCircle,
  Phone,
  Mail,
  Stethoscope,
  Award,
  DollarSign,
  Clock,
  Save,
  Loader2,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";

const DoctorProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    speciality: "",
    nmcNumber: "",
    experience: 0,
    consultationFee: 0,
    image: "",
    isAvailable: true,
    slots: [],
  });

  const validDays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/doctor/profile/me");
        if (res.data.doctor) {
          setFormData({
            ...res.data.doctor,
            slots: res.data.doctor.slots || [],
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // --- Slot Management ---
  const handleAddSlot = () => {
    setFormData({
      ...formData,
      slots: [
        ...formData.slots,
        { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
      ],
    });
  };

  const handleRemoveSlot = (index) => {
    const newSlots = formData.slots.filter((_, i) => i !== index);
    setFormData({ ...formData, slots: newSlots });
  };

  const handleSlotChange = (index, field, value) => {
    const newSlots = [...formData.slots];
    newSlots[index][field] = value;
    setFormData({ ...formData, slots: newSlots });
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    try {
      await api.put("/doctor/profile/me", formData);
      setSuccessMsg("Profile and schedule updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <Loader2 className="spin-animation text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100 animate-fade-in">
      <div className="mb-4">
        <h3 className="fw-black text-dark mb-1 d-flex align-items-center gap-2">
          <UserCircle className="text-primary" size={28} /> My Profile &
          Settings
        </h3>
        <p className="text-muted fw-medium">
          Manage your clinic details, fees, and schedule.
        </p>
      </div>

      {successMsg && (
        <div className="alert alert-success border-success shadow-sm rounded-4 d-flex align-items-center gap-2 mb-4 animate-slide-down">
          <CheckCircle size={20} />{" "}
          <span className="fw-bold">{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="row g-4">
        {/* LEFT COLUMN: Photo & Status */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 text-center h-100">
            <div className="mb-4 position-relative d-inline-block">
              <img
                src={
                  formData.image && formData.image !== "none"
                    ? formData.image.startsWith("http")
                      ? formData.image
                      : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${formData.image}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "Doctor")}&background=eff6ff&color=2563eb&size=150`
                }
                alt="Profile"
                className="rounded-circle object-fit-cover shadow-sm border border-4 border-white"
                style={{
                  width: "150px",
                  height: "150px",
                  backgroundColor: "#f8fafc",
                }}
              />
            </div>

            <h5 className="fw-bold text-dark mb-1">
              Dr. {formData.name || user?.name}
            </h5>
            <p className="text-primary fw-medium small mb-4">
              {formData.speciality || "General Physician"}
            </p>

            <div className="text-start bg-light p-3 rounded-4 mb-4">
              <label className="fw-bold small text-muted text-uppercase mb-2 d-flex align-items-center gap-2">
                <ImageIcon size={14} /> Image URL
              </label>
              <input
                type="text"
                className="form-control form-control-sm border-light-subtle"
                name="image"
                placeholder="Paste an image URL..."
                value={formData.image}
                onChange={handleChange}
              />
              <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                Leave blank or "none" to use auto-avatar.
              </small>
            </div>

            <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded-4 border border-light-subtle">
              <span className="fw-bold text-dark small">
                Accepting Patients?
              </span>
              <div className="form-check form-switch m-0 p-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  style={{
                    width: "40px",
                    height: "20px",
                    cursor: "pointer",
                    marginLeft: 0,
                    float: "right",
                  }}
                />
              </div>
            </div>
            {!formData.isAvailable && (
              <p className="text-danger small mt-2 fw-medium">
                You are currently hidden from the patient booking directory.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Details & Slots */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
            <h5 className="fw-bold mb-4 border-bottom pb-2">
              Professional Details
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <UserCircle size={14} /> Full Name
                </label>
                <input
                  type="text"
                  className="form-control bg-light"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Phone size={14} /> Phone Number
                </label>
                <input
                  type="text"
                  className="form-control bg-light"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Award size={14} /> Years of Experience
                </label>
                <input
                  type="number"
                  className="form-control bg-light"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <DollarSign size={14} /> Consultation Fee (NPR)
                </label>
                <input
                  type="number"
                  className="form-control bg-light"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                />
              </div>

              {/* Read Only Fields from Admin */}
              <div className="col-md-6 mt-4">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Mail size={14} /> Login Email
                </label>
                <input
                  type="email"
                  className="form-control bg-secondary bg-opacity-10 text-muted"
                  value={formData.email}
                  disabled
                />
              </div>
              <div className="col-md-6 mt-4">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Stethoscope size={14} /> NMC Number
                </label>
                <input
                  type="text"
                  className="form-control bg-secondary bg-opacity-10 text-muted"
                  value={formData.nmcNumber}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Clock className="text-primary" size={20} /> My Schedule & Slots
              </h5>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary rounded-pill fw-bold"
                onClick={handleAddSlot}
              >
                <Plus size={14} /> Add Time Slot
              </button>
            </div>

            {formData.slots.length === 0 ? (
              <div className="text-center p-4 text-muted bg-light rounded-4">
                <Clock size={32} className="opacity-50 mb-2" />
                <p className="mb-0">You have no active time slots.</p>
                <small>
                  Patients cannot book you until you add availability.
                </small>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {formData.slots.map((slot, index) => (
                  <div
                    key={index}
                    className="row g-2 align-items-center bg-light p-3 rounded-4 border border-light-subtle"
                  >
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-1">
                        Day of Week
                      </label>
                      <select
                        className="form-select border-0 shadow-sm"
                        value={slot.day}
                        onChange={(e) =>
                          handleSlotChange(index, "day", e.target.value)
                        }
                      >
                        {validDays.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        className="form-control border-0 shadow-sm text-center"
                        value={slot.startTime}
                        onChange={(e) =>
                          handleSlotChange(index, "startTime", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        className="form-control border-0 shadow-sm text-center"
                        value={slot.endTime}
                        onChange={(e) =>
                          handleSlotChange(index, "endTime", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-2 text-end pt-4">
                      <button
                        type="button"
                        className="btn btn-outline-danger border-0 p-2"
                        onClick={() => handleRemoveSlot(index)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-5 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="spin-animation" size={18} />
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .spin-animation { animation: spin 1s linear infinite; }
        .animate-slide-down { animation: slideDown 0.4s ease-out forwards; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes slideDown { 
          from { opacity: 0; transform: translateY(-10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
};

export default DoctorProfile;
