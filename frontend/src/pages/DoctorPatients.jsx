import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Users,
  Mail,
  Phone,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/doctor/patients");
        setPatients(res.data.patients || []);
      } catch (err) {
        setError("Failed to load your patient list.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Loader2 className="spin-animation text-primary" size={48} />
      </div>
    );

  return (
    <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
      <div className="d-flex align-items-center gap-3 mb-4 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-info">
        <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle shadow-sm">
          <Users size={28} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="fw-black mb-1 text-dark tracking-tight">
            My Patients
          </h3>
          <p className="text-muted fw-medium mb-0 small">
            Total Unique Patients:{" "}
            <span className="fw-bold text-info">{patients.length}</span>
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger fw-bold">
          <AlertCircle size={20} className="me-2" />
          {error}
        </div>
      )}

      <div className="row g-4">
        {patients.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            <Users size={48} className="mb-3 opacity-50" />
            <h5>No Patients Yet</h5>
            <p>Patients who book appointments with you will appear here.</p>
          </div>
        ) : (
          patients.map((patient, index) => (
            <div key={index} className="col-md-6 col-xl-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 hover-lift transition-all">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                    <div
                      className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                      style={{
                        width: "50px",
                        height: "50px",
                        fontSize: "1.2rem",
                      }}
                    >
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0 text-dark">{patient.name}</h5>
                      <span
                        className={`badge mt-1 ${patient.status === "Completed" ? "bg-success" : "bg-warning text-dark"}`}
                      >
                        Last Status: {patient.status}
                      </span>
                    </div>
                  </div>
                  <p className="mb-2 text-muted fw-medium d-flex align-items-center gap-2">
                    <Mail size={16} className="text-primary" /> {patient.email}
                  </p>
                  <p className="mb-2 text-muted fw-medium d-flex align-items-center gap-2">
                    <Phone size={16} className="text-success" /> {patient.phone}
                  </p>
                  <p className="mb-0 text-muted fw-medium d-flex align-items-center gap-2">
                    <Calendar size={16} className="text-info" /> Last Visit:{" "}
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <style>{`.hover-lift:hover { transform: translateY(-5px); } .spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default DoctorPatients;
