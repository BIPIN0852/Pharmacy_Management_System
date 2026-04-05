import React, { useState, useEffect } from "react";
import { Card, Table, Badge, Spinner, Alert, Button } from "react-bootstrap";
import {
  BellRing,
  RefreshCw,
  AlertTriangle,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  Package,
} from "lucide-react";
import api from "../services/api";

const PharmacistRefills = () => {
  const [refills, setRefills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRefills = async () => {
    try {
      setLoading(true);
      setError("");
      // Adjust this URL if your route in server.js is slightly different (e.g. /api/pharmacist/refills)
      const res = await api.get("/pharmacist/refills");
      setRefills(res.data || []);
    } catch (err) {
      console.error("Error fetching refills:", err);
      setError(
        err.response?.data?.message || "Failed to load refill reminders.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefills();
  }, []);

  const getDaysStatus = (refillDate) => {
    const today = new Date();
    const target = new Date(refillDate);

    // Strip time for accurate day calculation
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return { text: `${Math.abs(diffDays)} Days Overdue`, color: "danger" };
    if (diffDays === 0) return { text: "Runs out Today", color: "warning" };
    return { text: `Runs out in ${diffDays} Days`, color: "info" };
  };

  if (loading && refills.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center min-vh-100"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <Spinner animation="border" style={{ color: "#007185" }} />
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in p-3 p-md-4"
      style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
    >
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-light-subtle">
        <div>
          <h3 className="fw-black mb-1 text-dark d-flex align-items-center gap-2">
            <BellRing size={26} style={{ color: "#007185" }} /> Refill Reminders
          </h3>
          <p className="small mb-0 text-muted fw-medium">
            AI-driven alerts for patients who are running low on prescribed
            medications.
          </p>
        </div>
        <Button
          variant="light"
          className="rounded-pill px-4 py-2 border shadow-sm d-flex align-items-center gap-2 bg-white hover-lift text-dark fw-bold"
          onClick={fetchRefills}
        >
          <RefreshCw size={16} className="text-primary" /> Refresh List
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="border-0 shadow-sm rounded-3">
          <AlertTriangle size={18} className="me-2 mb-1" /> {error}
        </Alert>
      )}

      {/* Main Data Card */}
      <Card
        className="border-0 shadow-sm rounded-4 bg-white overflow-hidden"
        style={{ borderColor: "#D5D9D9" }}
      >
        <div
          className="table-responsive custom-scrollbar"
          style={{ minHeight: "400px" }}
        >
          <Table hover className="align-middle mb-0 custom-saas-table">
            <thead className="bg-light border-bottom border-light-subtle">
              <tr className="small text-uppercase text-muted fw-bold tracking-wider">
                <th className="py-3 ps-4">Patient Details</th>
                <th className="py-3">Medicine Dispensed</th>
                <th className="py-3">Supply Timeline</th>
                <th className="py-3">System Status</th>
                <th className="py-3 pe-4 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {refills.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <CheckCircle
                      size={48}
                      className="text-success mb-3 opacity-25"
                    />
                    <h5 className="fw-bold text-dark">No Pending Refills</h5>
                    <p className="text-muted mb-0 small">
                      All patients have sufficient medication supply right now.
                    </p>
                  </td>
                </tr>
              ) : (
                refills.map((refill, index) => {
                  const daysStatus = getDaysStatus(refill.refillDate);

                  return (
                    <tr
                      key={index}
                      className="table-row-hover border-bottom border-light-subtle"
                    >
                      {/* Patient Details */}
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="text-white fw-bold rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                            style={{
                              width: "42px",
                              height: "42px",
                              backgroundColor: "#0ea5e9",
                            }}
                          >
                            {refill.user?.name
                              ? refill.user.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <div>
                            <div className="fw-bold text-dark mb-1">
                              {refill.user?.name || "Unknown User"}
                            </div>
                            <div className="small text-muted d-flex align-items-center gap-2">
                              <Phone size={12} />{" "}
                              {refill.user?.phone || "No phone"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Medicine Dispensed */}
                      <td>
                        <div className="fw-bold text-dark mb-1 d-flex align-items-center gap-1">
                          <Package size={14} className="text-primary" />{" "}
                          {refill.medicineName}
                        </div>
                        <div className="small text-muted">
                          Qty Dispensed:{" "}
                          <span className="fw-bold text-dark">
                            {refill.qtyBought} Units
                          </span>
                        </div>
                      </td>

                      {/* Supply Timeline */}
                      <td>
                        <Badge
                          bg={
                            daysStatus.color === "warning" ||
                            daysStatus.color === "info"
                              ? `${daysStatus.color}-subtle`
                              : "danger"
                          }
                          text={
                            daysStatus.color === "danger" ? "light" : "dark"
                          }
                          className={`rounded-1 px-2 py-1 mb-1 border ${daysStatus.color === "warning" ? "border-warning-subtle" : daysStatus.color === "info" ? "border-info-subtle" : "border-danger"}`}
                        >
                          {daysStatus.text}
                        </Badge>
                        <div className="small text-muted mt-1 d-flex align-items-center gap-1">
                          <Calendar size={12} /> Exact Date:{" "}
                          {new Date(refill.refillDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </div>
                      </td>

                      {/* System Status (Cron Job Check) */}
                      <td>
                        {refill.reminderSentAutomated ? (
                          <div className="d-flex align-items-center gap-1 text-success small fw-bold">
                            <CheckCircle size={14} /> Auto-Emailed
                          </div>
                        ) : (
                          <div className="d-flex align-items-center gap-1 text-warning small fw-bold">
                            <Clock size={14} /> Pending Alert
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="pe-4 text-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-pill px-3 fw-bold shadow-sm hover-lift d-inline-flex align-items-center gap-1"
                          onClick={() =>
                            (window.location.href = `mailto:${refill.user?.email}?subject=Refill Reminder: ${refill.medicineName}&body=Hi ${refill.user?.name}, it looks like you are running low on ${refill.medicineName}. Please visit our website to reorder.`)
                          }
                        >
                          <Mail size={14} /> Contact
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      <style>{`
        .tracking-wider { letter-spacing: 0.05em; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .table-row-hover:hover { background-color: #f8fafc; }
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.08) !important; }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default PharmacistRefills;
