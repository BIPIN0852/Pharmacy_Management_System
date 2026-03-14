import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Plus,
  Edit,
  Trash2,
  Clock,
  Save,
  AlertCircle,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Loader2,
  User,
  FileText,
  Activity,
  CheckCircle,
  Camera,
  X,
  UserPlus,
} from "lucide-react";

const AdminDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentDoctorId, setCurrentDoctorId] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    nmcNumber: "",
    email: "",
    phone: "",
    experience: 0,
    consultationFee: 500,
    slots: [],
    isAvailable: true,
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/doctors");
      const data = res.data?.doctors || res.data || [];
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load doctor records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const getDoctorImage = (doctor) => {
    const imgSource = doctor?.image || doctor?.profilePhoto;
    if (
      imgSource &&
      typeof imgSource === "string" &&
      imgSource.trim() !== "" &&
      imgSource !== "none"
    ) {
      if (imgSource.startsWith("http")) return imgSource;
      const baseUrl = api.defaults.baseURL
        ? api.defaults.baseURL.replace(/\/api\/?$/, "")
        : "http://localhost:5000";
      return `${baseUrl}${imgSource.replace(/\\/g, "/").startsWith("/") ? "" : "/"}${imgSource.replace(/\\/g, "/")}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || "Doctor")}&background=f0f2f2&color=007185&size=150`;
  };

  const handleEdit = (doctor) => {
    setError("");
    setCurrentDoctorId(doctor._id);
    setFormData({
      name: doctor.name || "",
      speciality: doctor.speciality || "",
      nmcNumber: doctor.nmcNumber || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      experience: doctor.experience || 0,
      consultationFee: doctor.consultationFee || 500,
      slots: doctor.slots || [],
      isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
    });
    setImagePreview(getDoctorImage(doctor));
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addSlot = () => {
    setFormData({
      ...formData,
      slots: [
        ...formData.slots,
        { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
      ],
    });
  };

  const removeSlot = (index) => {
    setFormData({
      ...formData,
      slots: formData.slots.filter((_, i) => i !== index),
    });
  };

  const updateSlot = (index, field, value) => {
    const newSlots = [...formData.slots];
    newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
    setFormData({ ...formData, slots: newSlots });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSaving(true);
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "slots")
          submitData.append("slots", JSON.stringify(formData.slots));
        else submitData.append(key, formData[key]);
      });
      if (imageFile) submitData.append("image", imageFile);

      await api.put(`/admin/doctors/${currentDoctorId}`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Specialist profile synchronized successfully!");
      setShowModal(false);
      fetchDoctors();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update record.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Permanently delete Dr. ${name}?`)) {
      try {
        await api.delete(`/admin/doctors/${id}`);
        fetchDoctors();
      } catch (err) {
        alert("Delete failed. Specialist may have active appointments.");
      }
    }
  };

  if (loading && doctors.length === 0) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <Loader2
          className="spin-animation"
          style={{ color: "#007185" }}
          size={48}
        />
        <span className="mt-3 text-muted small fw-bold">
          RETRIEVING SPECIALIST DIRECTORY...
        </span>
      </div>
    );
  }

  return (
    <div
      className="container-fluid p-3 p-md-4 animate-fade-in"
      style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
    >
      {/* Header Area */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary-subtle flex-wrap gap-3">
        <div>
          <h2
            className="fw-bold mb-1 d-flex align-items-center gap-2"
            style={{ color: "#0F1111", fontSize: "1.5rem" }}
          >
            <Stethoscope style={{ color: "#007185" }} size={24} /> Doctors
            Management
          </h2>
          <p className="small mb-0" style={{ color: "#565959" }}>
            Review specialist credentials, consultation fees, and shift
            availability.
          </p>
        </div>

        <button
          className="btn btn-warning shadow-sm d-flex align-items-center gap-2 py-2 px-4 border-0 fw-medium"
          style={{
            backgroundColor: "#FFD814",
            borderRadius: "8px",
            color: "#0F1111",
          }}
          onClick={() => navigate("/admin/users")}
        >
          <UserPlus size={18} /> Register New Specialist
        </button>
      </div>

      {success && (
        <div
          className="alert border-0 shadow-sm mb-4 rounded-1 d-flex align-items-center gap-2"
          style={{
            backgroundColor: "#f2fcf5",
            color: "#067D62",
            borderLeft: "4px solid #067D62",
          }}
        >
          <CheckCircle size={20} /> {success}
        </div>
      )}

      {/* Main Table Card */}
      <div
        className="card shadow-sm border bg-white rounded-1 overflow-hidden"
        style={{ borderColor: "#D5D9D9" }}
      >
        <div className="table-responsive">
          <table className="table align-middle mb-0 border-0">
            <thead className="bg-light">
              <tr style={{ borderBottom: "1px solid #D5D9D9" }}>
                <th
                  className="ps-4 py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem" }}
                >
                  Specialist Profile
                </th>
                <th
                  className="py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem" }}
                >
                  Experience & Fee
                </th>
                <th
                  className="py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem" }}
                >
                  Contact
                </th>
                <th
                  className="py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem" }}
                >
                  Schedule
                </th>
                <th
                  className="py-2 text-end pe-4 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc._id} className="aws-table-row border-bottom">
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={getDoctorImage(doc)}
                        alt={doc.name}
                        className="rounded-circle border"
                        style={{
                          width: "45px",
                          height: "45px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <div
                          className="fw-bold"
                          style={{ color: "#0F1111", fontSize: "0.9rem" }}
                        >
                          {doc.name}
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span
                            className="small fw-medium"
                            style={{ color: "#007185" }}
                          >
                            {doc.speciality}
                          </span>
                          {!doc.isAvailable && (
                            <span
                              className="badge rounded-1"
                              style={{
                                backgroundColor: "#fef0f0",
                                color: "#B12704",
                                border: "1px solid #B12704",
                                fontSize: "0.6rem",
                              }}
                            >
                              OFF-DUTY
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small mb-1 text-dark">
                      {doc.experience} Yrs Exp.
                    </div>
                    <div
                      className="fw-bold"
                      style={{ color: "#B12704", fontSize: "0.85rem" }}
                    >
                      NPR {doc.consultationFee}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small d-flex align-items-center gap-2 mb-1">
                      <Phone size={12} className="text-muted" /> {doc.phone}
                    </div>
                    <div className="small d-flex align-items-center gap-2 text-muted">
                      <Mail size={12} /> {doc.email}
                    </div>
                  </td>
                  <td className="py-3">
                    {doc.slots?.length > 0 ? (
                      <div className="d-flex flex-column gap-1">
                        {doc.slots.slice(0, 2).map((s, i) => (
                          <div
                            key={i}
                            className="small d-flex align-items-center gap-2"
                            style={{ fontSize: "0.75rem" }}
                          >
                            <Clock size={12} style={{ color: "#007185" }} />
                            <span className="fw-bold text-dark">
                              {s.day.slice(0, 3)}:
                            </span>{" "}
                            {s.startTime}-{s.endTime}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted small italic">Not Set</span>
                    )}
                  </td>
                  <td className="text-end pe-4 py-3">
                    <div className="btn-group shadow-sm rounded-1 overflow-hidden border">
                      <button
                        className="btn btn-sm btn-white border-0"
                        onClick={() => handleEdit(doc)}
                        title="Edit Profile"
                      >
                        <Edit size={16} style={{ color: "#007185" }} />
                      </button>
                      <button
                        className="btn btn-sm btn-white border-0 border-start"
                        onClick={() => handleDelete(doc._id, doc.name)}
                        title="Delete"
                      >
                        <Trash2 size={16} style={{ color: "#B12704" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- REFINED EDIT MODAL --- */}
      {showModal && (
        <div
          className="modal-overlay d-flex justify-content-center align-items-center animate-fade-in"
          style={{ zIndex: 2000 }}
        >
          <div
            className="modal-content bg-white shadow-lg rounded-1 border overflow-hidden"
            style={{ maxWidth: "850px", width: "95%", borderColor: "#D5D9D9" }}
          >
            <div className="modal-header bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
                Update Specialist Profile: {formData.name}
              </h6>
              <button
                className="btn p-0 border-0"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4"
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              {/* Image & Basic Info */}
              <div className="row g-4 mb-4">
                <div className="col-md-3 text-center border-end">
                  <div className="position-relative d-inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="rounded-circle border shadow-sm"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <label
                      htmlFor="modal-image"
                      className="position-absolute bottom-0 end-0 bg-white border rounded-circle p-1 cursor-pointer shadow-sm"
                    >
                      <Camera size={16} />
                    </label>
                    <input
                      id="modal-image"
                      type="file"
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="x-small text-muted mt-2">
                    Update Profile Image
                  </p>
                </div>
                <div className="col-md-9">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold mb-1">Full Name</label>
                      <input
                        type="text"
                        className="form-control amazon-input shadow-none"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold mb-1">
                        Medical Speciality
                      </label>
                      <input
                        type="text"
                        className="form-control amazon-input shadow-none"
                        value={formData.speciality}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            speciality: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold mb-1">NMC Number</label>
                      <input
                        type="text"
                        className="form-control amazon-input shadow-none"
                        value={formData.nmcNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nmcNumber: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold mb-1">Availability</label>
                      <select
                        className="form-select amazon-input shadow-none"
                        value={formData.isAvailable}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isAvailable: e.target.value === "true",
                          })
                        }
                      >
                        <option value="true">Active / Available</option>
                        <option value="false">On Leave / Unavailable</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Finance & Contact */}
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="small fw-bold mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    className="form-control amazon-input shadow-none"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="small fw-bold mb-1">
                    Consultation Fee (NPR)
                  </label>
                  <input
                    type="number"
                    className="form-control amazon-input shadow-none"
                    value={formData.consultationFee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consultationFee: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="small fw-bold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    className="form-control amazon-input shadow-none"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Weekly Shifts */}
              <div className="border rounded p-3 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0 small text-uppercase">
                    Weekly Shift Schedule
                  </h6>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary fw-bold"
                    onClick={addSlot}
                  >
                    + Add Shift
                  </button>
                </div>
                {formData.slots.map((slot, index) => (
                  <div
                    key={index}
                    className="row g-2 mb-2 align-items-center bg-white p-2 border rounded shadow-xs"
                  >
                    <div className="col-md-4">
                      <select
                        className="form-select form-select-sm"
                        value={slot.day}
                        onChange={(e) =>
                          updateSlot(index, "day", e.target.value)
                        }
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
                    </div>
                    <div className="col-md-3">
                      <input
                        type="time"
                        className="form-control form-control-sm"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateSlot(index, "startTime", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-auto text-muted small">to</div>
                    <div className="col-md-3">
                      <input
                        type="time"
                        className="form-control form-control-sm"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateSlot(index, "endTime", e.target.value)
                        }
                      />
                    </div>
                    <div className="col text-end">
                      <button
                        type="button"
                        className="btn btn-sm text-danger"
                        onClick={() => removeSlot(index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-end mt-4">
                <button
                  type="button"
                  className="btn btn-white border px-4 me-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-warning px-5 shadow-sm border-0 fw-bold"
                  style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
                >
                  {saving ? (
                    <Loader2 className="spin-animation" size={18} />
                  ) : (
                    "Synchronize Record"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .amazon-input:focus { border-color: #e47911 !important; box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; }
        .aws-table-row:hover { background-color: #f8f9fa; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
      `}</style>
    </div>
  );
};

export default AdminDoctors;
