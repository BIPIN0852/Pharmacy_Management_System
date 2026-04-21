import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Badge, Form, InputGroup } from "react-bootstrap";
import {
  FileSignature,
  Plus,
  CalendarCheck,
  Loader2,
  Send,
  Trash2,
  History,
  Pill,
  Image as ImageIcon,
  Search,
  Grid,
  List,
  User,
} from "lucide-react";

const DoctorPrescriptions = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- UI States ---
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);

  // --- History State ---
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [patientHistory, setPatientHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // --- Prescription Form State ---
  const [items, setItems] = useState([
    { medicine: "", dosageInstructions: "", durationDays: "", quantity: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchEligibleAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/doctor/appointments");
      const eligible = (res.data.appointments || []).filter((a) =>
        ["confirmed", "completed", "pending"].includes(a.status?.toLowerCase()),
      );
      setAppointments(eligible);
    } catch (err) {
      console.error("Error fetching appointments for prescriptions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligibleAppointments();
  }, []);

  // --- History Logic ---
  const handleViewHistory = async (patient) => {
    setSelectedAppt({ patient }); // Store temporarily just for the modal header
    setShowHistoryModal(true);
    setHistoryLoading(true);
    try {
      const res = await api.get(`/prescriptions/patient/${patient._id}`);
      setPatientHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // --- Prescription Logic ---
  const handleAddItem = () =>
    setItems([
      ...items,
      { medicine: "", dosageInstructions: "", durationDays: "", quantity: "" },
    ]);
  const handleRemoveItem = (index) =>
    setItems(items.filter((_, i) => i !== index));
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0 || !items[0].medicine) {
      return alert("Please add at least one medicine to the prescription.");
    }
    setSubmitting(true);
    try {
      await api.post("/doctor/prescriptions/create", {
        appointmentId: selectedAppt._id,
        patientId: selectedAppt.patient?._id || selectedAppt.user?._id,
        patientName: selectedAppt.patient?.name || selectedAppt.user?.name,
        patientEmail: selectedAppt.patient?.email || selectedAppt.user?.email,
        items,
        notes,
      });
      alert("Prescription issued successfully!");
      setShowModal(false);
      setItems([
        {
          medicine: "",
          dosageInstructions: "",
          durationDays: "",
          quantity: "",
        },
      ]);
      setNotes("");
      fetchEligibleAppointments();
    } catch (err) {
      alert(
        "Error: " +
          (err.response?.data?.message || "Failed to issue prescription"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --- Filter Logic ---
  const filteredAppointments = appointments.filter((app) =>
    app.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getPatientInitials = (name) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <Loader2 className="spin-animation text-success" size={48} />
      </div>
    );

  return (
    <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
      {/* HEADER & CONTROLS */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-success">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle shadow-sm">
            <FileSignature size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="fw-black mb-1 text-dark tracking-tight">
              Prescriptions & Records
            </h3>
            <p className="text-muted fw-medium mb-0 small">
              Review patient history and issue new digital prescriptions.
            </p>
          </div>
        </div>

        {/* CONTROLS: Search & View Toggle */}
        <div className="d-flex flex-column flex-sm-row gap-2 align-items-sm-center">
          <InputGroup className="shadow-sm" style={{ width: "250px" }}>
            <InputGroup.Text className="bg-white border-end-0 text-muted">
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search patients..."
              className="border-start-0 bg-white shadow-none focus-ring-success"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <div className="btn-group shadow-sm bg-white p-1 rounded-3 border border-light-subtle">
            <button
              className={`btn btn-sm rounded-2 d-flex align-items-center gap-1 ${viewMode === "grid" ? "btn-success text-white fw-bold" : "btn-light text-muted"}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={16} /> Grid
            </button>
            <button
              className={`btn btn-sm rounded-2 d-flex align-items-center gap-1 ${viewMode === "table" ? "btn-success text-white fw-bold" : "btn-light text-muted"}`}
              onClick={() => setViewMode("table")}
            >
              <List size={16} /> Table
            </button>
          </div>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="col-12 text-center py-5 text-muted bg-white rounded-4 shadow-sm border border-light-subtle">
          <FileSignature size={48} className="mb-3 opacity-50" />
          <h5 className="fw-bold text-dark">No Appointments Found</h5>
          <p className="small">
            No active appointments match your search criteria.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* ========================================== */
        /* GRID VIEW LAYOUT                           */
        /* ========================================== */
        <div className="row g-4">
          {filteredAppointments.map((app) => (
            <div key={app._id} className="col-md-6 col-xl-4 col-xxl-3">
              <div className="card border-light-subtle shadow-sm rounded-4 h-100 bg-white hover-lift transition-all overflow-hidden">
                <div className="card-body p-0">
                  <div className="p-4 border-bottom border-light-subtle d-flex align-items-center gap-3">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                      style={{
                        width: "50px",
                        height: "50px",
                        fontSize: "1.1rem",
                      }}
                    >
                      {getPatientInitials(app.patient?.name)}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 text-dark">
                        {app.patient?.name || "Patient"}
                      </h6>
                      <Badge
                        bg={app.status === "completed" ? "success" : "warning"}
                        text={app.status === "completed" ? "light" : "dark"}
                        className="rounded-1 fw-medium"
                        style={{ fontSize: "0.65rem" }}
                      >
                        {app.status?.toUpperCase() || "PENDING"}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3 bg-light d-flex justify-content-between align-items-center border-bottom border-light-subtle">
                    <div>
                      <span
                        className="d-block small text-muted fw-bold text-uppercase"
                        style={{ fontSize: "0.65rem" }}
                      >
                        Appt Date
                      </span>
                      <span className="small fw-bold text-dark d-flex align-items-center gap-1">
                        <CalendarCheck size={14} className="text-primary" />
                        {new Date(app.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 d-flex gap-2 bg-white">
                    <button
                      className="btn btn-outline-primary btn-sm w-50 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-1 shadow-sm hover-bg-light"
                      onClick={() => handleViewHistory(app.patient)}
                    >
                      <History size={14} /> History
                    </button>
                    <button
                      className="btn btn-success btn-sm w-50 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-1 shadow-sm"
                      onClick={() => {
                        setSelectedAppt(app);
                        setShowModal(true);
                      }}
                    >
                      <Plus size={14} /> Prescribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ========================================== */
        /* TABLE VIEW LAYOUT                          */
        /* ========================================== */
        <div className="card border-light-subtle shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive custom-scrollbar">
            <table className="table table-hover align-middle mb-0 custom-saas-table">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-uppercase small fw-bold text-muted tracking-wider">
                    Patient Name
                  </th>
                  <th className="py-3 text-uppercase small fw-bold text-muted tracking-wider">
                    Appt Date
                  </th>
                  <th className="py-3 text-uppercase small fw-bold text-muted tracking-wider">
                    Status
                  </th>
                  <th className="pe-4 py-3 text-end text-uppercase small fw-bold text-muted tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((app) => (
                  <tr
                    key={app._id}
                    className="transition-all hover-bg-light border-bottom border-light-subtle"
                  >
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "0.9rem",
                          }}
                        >
                          {getPatientInitials(app.patient?.name)}
                        </div>
                        <div>
                          <div className="fw-bolder text-dark mb-0">
                            {app.patient?.name || "Patient"}
                          </div>
                          <div className="small text-muted d-flex align-items-center gap-1 mt-1">
                            <User size={12} /> ID:{" "}
                            {app.patient?._id
                              ? app.patient._id.slice(-6).toUpperCase()
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small fw-bold text-dark d-flex align-items-center gap-2 mb-1">
                        <CalendarCheck size={14} className="text-primary" />
                        {new Date(app.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <Badge
                        bg={app.status === "completed" ? "success" : "warning"}
                        text={app.status === "completed" ? "light" : "dark"}
                        className="rounded-1 fw-medium"
                        style={{ fontSize: "0.65rem" }}
                      >
                        {app.status?.toUpperCase() || "PENDING"}
                      </Badge>
                    </td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-pill fw-bold d-flex align-items-center justify-content-center gap-1 shadow-sm px-3 hover-bg-light"
                          onClick={() => handleViewHistory(app.patient)}
                        >
                          <History size={14} /> History
                        </button>
                        <button
                          className="btn btn-success btn-sm rounded-pill fw-bold d-flex align-items-center justify-content-center gap-1 shadow-sm px-3"
                          onClick={() => {
                            setSelectedAppt(app);
                            setShowModal(true);
                          }}
                        >
                          <Plus size={14} /> Prescribe
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- WRITE PRESCRIPTION MODAL (UNCHANGED NATIVE BOOTSTRAP) --- */}
      {showModal && (
        <div
          className="modal d-block bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-0 p-4 pb-3 bg-light">
                  <h5 className="fw-black mb-0 text-dark d-flex align-items-center gap-2">
                    <FileSignature className="text-success" /> New Prescription
                  </h5>
                  <button
                    type="button"
                    className="btn-close shadow-none"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="bg-success text-white px-4 py-2 small fw-bold">
                  Patient: {selectedAppt?.patient?.name}
                </div>
                <div className="modal-body p-4">
                  <label className="form-label small fw-bold text-uppercase text-muted mb-3">
                    Medicines & Dosage
                  </label>
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="row g-2 mb-3 align-items-end p-3 bg-light rounded-3 border border-light-subtle"
                    >
                      <div className="col-md-4">
                        <label className="small mb-1 fw-medium">
                          Medicine Name
                        </label>
                        <input
                          className="form-control form-control-sm shadow-none focus-ring-success"
                          placeholder="e.g. Paracetamol"
                          required
                          value={item.medicine}
                          onChange={(e) =>
                            updateItem(index, "medicine", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="small mb-1 fw-medium">Dosage</label>
                        <input
                          className="form-control form-control-sm shadow-none focus-ring-success"
                          placeholder="e.g. 1-0-1"
                          required
                          value={item.dosageInstructions}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "dosageInstructions",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="small mb-1 fw-medium">Days</label>
                        <input
                          type="number"
                          className="form-control form-control-sm shadow-none focus-ring-success"
                          placeholder="5"
                          required
                          value={item.durationDays}
                          onChange={(e) =>
                            updateItem(index, "durationDays", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="small mb-1 fw-medium">Qty</label>
                        <input
                          type="number"
                          className="form-control form-control-sm shadow-none focus-ring-success"
                          placeholder="10"
                          required
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(index, "quantity", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-1 text-end">
                        {items.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger border-0 hover-bg-light"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary fw-bold rounded-pill mb-4 shadow-sm"
                    onClick={handleAddItem}
                  >
                    <Plus size={14} /> Add Medicine
                  </button>

                  <div className="mb-2">
                    <label className="form-label small fw-bold text-muted">
                      Additional Notes
                    </label>
                    <textarea
                      className="form-control bg-light shadow-none focus-ring-success"
                      rows="3"
                      style={{ resize: "none" }}
                      placeholder="Drink plenty of water..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top border-light-subtle p-3 bg-light">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4 fw-bold shadow-sm border border-light-subtle"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success rounded-pill px-4 fw-bold d-flex align-items-center gap-2 shadow-sm"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="spin-animation" size={16} />
                    ) : (
                      <Send size={16} />
                    )}{" "}
                    Issue Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 PATIENT MEDICAL HISTORY MODAL (UNCHANGED NATIVE BOOTSTRAP) */}
      {showHistoryModal && (
        <div
          className="modal d-block bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-light border-bottom border-light-subtle p-4">
                <h5 className="modal-title fw-black text-dark d-flex align-items-center gap-2">
                  <History className="text-primary" size={20} /> Medical
                  History: {selectedAppt?.patient?.name}
                </h5>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={() => setShowHistoryModal(false)}
                ></button>
              </div>

              <div
                className="modal-body p-4 bg-white custom-scrollbar"
                style={{ minHeight: "400px" }}
              >
                {historyLoading ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <Loader2
                      className="spin-animation text-primary"
                      size={40}
                    />
                  </div>
                ) : patientHistory.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <FileSignature size={48} className="mb-3 opacity-25" />
                    <h6>No History Found</h6>
                    <p className="small">
                      This patient has no past prescriptions on record.
                    </p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-4">
                    {patientHistory.map((rx) => {
                      const isDigital = rx.items && rx.items.length > 0;
                      return (
                        <div
                          key={rx._id}
                          className="bg-light p-4 rounded-4 border border-light-subtle shadow-sm"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-light-subtle">
                            <div className="fw-bold text-dark d-flex align-items-center gap-2">
                              {isDigital ? (
                                <Pill size={18} className="text-success" />
                              ) : (
                                <ImageIcon size={18} className="text-warning" />
                              )}
                              {isDigital
                                ? `Prescribed by Dr. ${rx.doctor?.name || "Unknown"}`
                                : "Patient Uploaded Scan"}
                            </div>
                            <span className="small text-muted fw-bold">
                              {new Date(rx.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {isDigital ? (
                            <div className="table-responsive">
                              <table className="table table-sm table-bordered border-light-subtle mb-0 bg-white shadow-sm">
                                <thead className="bg-light text-muted small">
                                  <tr>
                                    <th className="px-3 py-2">Medicine</th>
                                    <th className="px-3 py-2">Dosage</th>
                                    <th className="px-3 py-2">Days</th>
                                  </tr>
                                </thead>
                                <tbody className="small fw-medium text-dark">
                                  {rx.items.map((item, idx) => (
                                    <tr key={idx}>
                                      <td className="px-3">{item.medicine}</td>
                                      <td className="px-3">
                                        {item.dosageInstructions}
                                      </td>
                                      <td className="px-3">
                                        {item.durationDays}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-center bg-white p-2 rounded-3 border border-light-subtle shadow-sm">
                              <img
                                src={
                                  rx.imageUrl.startsWith("http")
                                    ? rx.imageUrl
                                    : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${rx.imageUrl}`
                                }
                                alt="Prescription Scan"
                                className="img-fluid rounded-2 object-fit-cover"
                                style={{ maxHeight: "250px" }}
                              />
                            </div>
                          )}

                          {rx.notes && (
                            <div className="mt-3 bg-white p-3 rounded-3 small border border-light-subtle text-muted shadow-sm">
                              <strong className="text-dark">Notes:</strong>{" "}
                              {rx.notes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 6px 15px rgba(0,0,0,0.08) !important; }
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .spin-animation { animation: spin 1s linear infinite; }
        .transition-all { transition: all 0.2s ease; }
        .focus-ring-success:focus { border-color: #198754; box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25); }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default DoctorPrescriptions;
