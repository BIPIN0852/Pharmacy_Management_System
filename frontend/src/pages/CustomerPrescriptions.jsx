import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  FileText,
  Loader2,
  Pill,
  Calendar,
  Clock,
  UserRound,
  Image as ImageIcon,
} from "lucide-react";

const CustomerPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await api.get("/prescriptions/my"); // Matches backend getMyPrescriptions
        setPrescriptions(res.data);
      } catch (err) {
        console.error("Failed to load prescriptions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-success bg-opacity-10 text-success border-success";
      case "pending":
        return "bg-warning bg-opacity-10 text-warning border-warning";
      case "rejected":
        return "bg-danger bg-opacity-10 text-danger border-danger";
      default:
        return "bg-secondary bg-opacity-10 text-secondary border-secondary";
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5 min-vh-100 align-items-center bg-light">
        <Loader2 className="spin-animation text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100 animate-fade-in">
      <div className="mb-4 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
        <h3 className="fw-black mb-1 text-dark d-flex align-items-center gap-2">
          <FileText className="text-primary" size={28} /> My Prescriptions
        </h3>
        <p className="text-muted fw-medium mb-0 small">
          View your uploaded prescriptions and digital prescriptions from your
          doctors.
        </p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-5 text-muted bg-white rounded-4 shadow-sm">
          <FileText size={48} className="mb-3 opacity-50" />
          <h5>No Prescriptions Found</h5>
          <p className="small">
            You haven't uploaded any prescriptions, and no doctor has issued one
            yet.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {prescriptions.map((rx) => {
            const isDigital = rx.items && rx.items.length > 0;

            return (
              <div key={rx._id} className="col-lg-6">
                <div className="card border-light-subtle shadow-sm rounded-4 bg-white h-100 overflow-hidden hover-lift">
                  {/* HEADER */}
                  <div className="bg-light bg-opacity-50 p-3 border-bottom border-light-subtle d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      {isDigital ? (
                        <Pill className="text-primary" size={20} />
                      ) : (
                        <ImageIcon className="text-primary" size={20} />
                      )}
                      <h6 className="fw-bold mb-0 text-dark">
                        {isDigital
                          ? "Digital Prescription"
                          : "Uploaded Prescription"}
                      </h6>
                    </div>
                    <span
                      className={`badge border px-3 py-2 rounded-pill ${getStatusBadge(rx.status)}`}
                    >
                      {rx.status || "Pending"}
                    </span>
                  </div>

                  <div className="p-4">
                    {/* DOCTOR INFO (If Digital) */}
                    {isDigital && rx.doctor && (
                      <div className="mb-3 pb-3 border-bottom border-light-subtle">
                        <p className="small text-muted fw-bold text-uppercase mb-1">
                          Prescribed By
                        </p>
                        <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-0">
                          <UserRound size={16} className="text-primary" /> Dr.{" "}
                          {rx.doctor.name}
                        </h6>
                        <small className="text-muted">
                          {rx.doctor.speciality}
                        </small>
                      </div>
                    )}

                    {/* DATE INFO */}
                    <p className="small text-muted d-flex align-items-center gap-2 mb-3">
                      <Calendar size={14} /> Issued on:{" "}
                      {new Date(rx.createdAt).toLocaleDateString()}
                    </p>

                    {/* DIGITAL MEDICINES TABLE */}
                    {isDigital ? (
                      <div className="table-responsive mb-3">
                        <table className="table table-sm table-bordered border-light-subtle mb-0">
                          <thead className="bg-light text-muted small">
                            <tr>
                              <th>Medicine</th>
                              <th>Dosage</th>
                              <th>Days</th>
                              <th>Qty</th>
                            </tr>
                          </thead>
                          <tbody className="small">
                            {rx.items.map((item, idx) => (
                              <tr key={idx}>
                                <td className="fw-bold text-dark">
                                  {item.medicine}
                                </td>
                                <td>{item.dosageInstructions}</td>
                                <td>{item.durationDays}</td>
                                <td>{item.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* SCANNED IMAGE VIEW */
                      <div className="text-center mb-3 bg-light rounded-3 p-2 border border-light-subtle">
                        <img
                          src={
                            rx.imageUrl.startsWith("http")
                              ? rx.imageUrl
                              : `http://localhost:5000${rx.imageUrl}`
                          }
                          alt="Prescription Scan"
                          className="img-fluid rounded-2 object-fit-cover"
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                    )}

                    {/* NOTES */}
                    {rx.notes && (
                      <div className="bg-warning bg-opacity-10 text-dark p-3 rounded-3 small">
                        <strong>Notes: </strong> {rx.notes}
                      </div>
                    )}
                  </div>

                  {/* FOOTER ACTION */}
                  {rx.status?.toLowerCase() === "approved" && (
                    <div className="p-3 border-top border-light-subtle bg-light text-end">
                      <button className="btn btn-primary rounded-pill fw-bold px-4 shadow-sm btn-sm">
                        Order Medicines Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .hover-lift:hover { transform: translateY(-4px); transition: transform 0.2s ease-in-out; }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default CustomerPrescriptions;
