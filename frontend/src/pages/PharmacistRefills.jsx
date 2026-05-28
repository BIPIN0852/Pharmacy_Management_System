import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Badge,
  Spinner,
  Alert,
  Button,
  Row,
  Col,
} from "react-bootstrap";
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

  //State to track which specific email is currently sending
  const [sendingId, setSendingId] = useState(null);

  const fetchRefills = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/orders");
      const allOrders = Array.isArray(res.data) ? res.data : [];

      let extractedRefills = [];

      allOrders.forEach((order) => {
        if (order.orderItems && order.orderItems.length > 0) {
          order.orderItems.forEach((item) => {
            if (item.refillDate) {
              extractedRefills.push({
                orderId: order._id,
                user: order.user,
                medicineName: item.name || "Unknown Medicine",
                qtyBought: item.qty * (item.buyingMultiplier || 1),
                refillDate: item.refillDate,
                reminderSentAutomated: item.refillReminderSent || false,
              });
            }
          });
        }
      });

      extractedRefills.sort(
        (a, b) => new Date(a.refillDate) - new Date(b.refillDate),
      );

      setRefills(extractedRefills);
    } catch (err) {
      console.error("Error fetching refills:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load refill reminders from orders.",
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

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return { text: `${Math.abs(diffDays)} Days Overdue`, color: "danger" };
    if (diffDays === 0) return { text: "Runs out Today", color: "warning" };
    if (diffDays <= 7)
      return { text: `Runs out in ${diffDays} Days`, color: "warning" };
    return { text: `Runs out in ${diffDays} Days`, color: "info" };
  };

  // Real API function to send the email via backend
  const handleSendReminder = async (refill) => {
    try {
      setSendingId(refill.orderId);

      await api.post(`/refill-reminders/send`, {
        orderId: refill.orderId,
        userId: refill.user?._id,
        medicineName: refill.medicineName,
        email: refill.user?.email,
        name: refill.user?.name,
      });

      // Update UI state instantly to show "Sent"
      setRefills(
        refills.map((r) =>
          r.orderId === refill.orderId && r.medicineName === refill.medicineName
            ? { ...r, reminderSentAutomated: true }
            : r,
        ),
      );
    } catch (err) {
      console.error("Failed to send reminder:", err);
      setError(
        err.response?.data?.message ||
          "Failed to send reminder email. Please try again.",
      );
      setTimeout(() => setError(""), 5000);
    } finally {
      setSendingId(null);
    }
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
      className="animate-fade-in p-2 p-md-3 p-lg-4"
      style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
    >
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-3 mb-md-4 pb-3 border-bottom border-light-subtle">
        <div>
          <h3 className="fw-black mb-1 text-dark d-flex align-items-center gap-2 fs-4 fs-md-3">
            <BellRing
              size={24}
              className="d-md-none"
              style={{ color: "#007185" }}
            />
            <BellRing
              size={28}
              className="d-none d-md-block"
              style={{ color: "#007185" }}
            />
            Refill Reminders
          </h3>
          <p className="small mb-0 text-muted fw-medium lh-sm">
            AI-driven alerts for patients who are running low on prescribed
            medications.
          </p>
        </div>
        <Button
          variant="light"
          className="rounded-pill px-3 px-md-4 py-2 border shadow-sm d-flex align-items-center justify-content-center gap-2 bg-white hover-lift text-dark fw-bold w-100 w-sm-auto flex-shrink-0"
          onClick={fetchRefills}
        >
          <RefreshCw size={16} className="text-primary" /> Refresh List
        </Button>
      </div>

      {error && (
        <Alert
          variant="danger"
          className="border-0 shadow-sm rounded-3 d-flex align-items-center"
        >
          <AlertTriangle size={18} className="me-2 flex-shrink-0" />{" "}
          <span className="small fw-medium">{error}</span>
        </Alert>
      )}

      {refills.length === 0 && !loading ? (
        <Card
          className="border-0 shadow-sm rounded-4 bg-white text-center py-5"
          style={{ borderColor: "#D5D9D9" }}
        >
          <Card.Body className="py-5">
            <CheckCircle
              size={56}
              className="text-success mb-3 opacity-25 mx-auto"
            />
            <h5 className="fw-bold text-dark mb-2">No Pending Refills</h5>
            <p className="text-muted mb-0 small">
              All patients have sufficient medication supply right now.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* DESKTOP VIEW */}
          <Card
            className="border-0 shadow-sm rounded-4 bg-white overflow-hidden d-none d-lg-block"
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
                  {refills.map((refill, index) => {
                    const daysStatus = getDaysStatus(refill.refillDate);

                    return (
                      <tr
                        key={index}
                        className="table-row-hover border-bottom border-light-subtle transition-all"
                      >
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
                              <div
                                className="fw-bold text-dark mb-1 text-truncate"
                                style={{ maxWidth: "150px" }}
                              >
                                {refill.user?.name || "Unknown User"}
                              </div>
                              <div className="small text-muted d-flex align-items-center gap-1">
                                <Phone size={12} />{" "}
                                {refill.user?.phone || "No phone"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div
                            className="fw-bold text-dark mb-1 d-flex align-items-center gap-1 text-truncate"
                            style={{ maxWidth: "200px" }}
                          >
                            <Package
                              size={14}
                              className="text-primary flex-shrink-0"
                            />{" "}
                            {refill.medicineName}
                          </div>
                          <div className="small text-muted">
                            Qty Dispensed:{" "}
                            <span className="fw-bold text-dark">
                              {refill.qtyBought} Units
                            </span>
                          </div>
                        </td>

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
                            className={`rounded-1 px-2 py-1 mb-1 border ${
                              daysStatus.color === "warning"
                                ? "border-warning-subtle"
                                : daysStatus.color === "info"
                                  ? "border-info-subtle"
                                  : "border-danger"
                            }`}
                          >
                            {daysStatus.text}
                          </Badge>
                          <div className="small text-muted mt-1 d-flex align-items-center gap-1">
                            <Calendar size={12} /> Exact Date:{" "}
                            {new Date(refill.refillDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </td>

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

                        <td className="pe-4 text-end">
                          <Button
                            variant={
                              refill.reminderSentAutomated
                                ? "light"
                                : "outline-primary"
                            }
                            size="sm"
                            className="rounded-pill px-3 fw-bold shadow-sm hover-lift d-inline-flex align-items-center gap-2"
                            onClick={() => handleSendReminder(refill)}
                            disabled={
                              sendingId === refill.orderId ||
                              refill.reminderSentAutomated
                            }
                          >
                            {sendingId === refill.orderId ? (
                              <Spinner animation="border" size="sm" />
                            ) : refill.reminderSentAutomated ? (
                              <CheckCircle size={14} className="text-success" />
                            ) : (
                              <Mail size={14} />
                            )}
                            {refill.reminderSentAutomated ? "Sent" : "Contact"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card>

          {/* MOBILE VIEW */}
          <div className="d-block d-lg-none">
            <Row className="g-3">
              {refills.map((refill, index) => {
                const daysStatus = getDaysStatus(refill.refillDate);

                return (
                  <Col xs={12} key={index}>
                    <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden transition-all hover-lift">
                      <Card.Body className="p-3 p-md-4">
                        <div className="d-flex justify-content-between align-items-start mb-3 border-bottom pb-3 border-light-subtle">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="text-white fw-bold rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                              style={{
                                width: "36px",
                                height: "36px",
                                backgroundColor: "#0ea5e9",
                                fontSize: "0.9rem",
                              }}
                            >
                              {refill.user?.name
                                ? refill.user.name.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            <div>
                              <div
                                className="fw-bold text-dark lh-sm text-truncate"
                                style={{ maxWidth: "140px" }}
                              >
                                {refill.user?.name || "Unknown"}
                              </div>
                              <div
                                className="small text-muted d-flex align-items-center gap-1"
                                style={{ fontSize: "0.75rem" }}
                              >
                                <Phone size={10} />{" "}
                                {refill.user?.phone || "No phone"}
                              </div>
                            </div>
                          </div>
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
                            className={`rounded-1 px-2 py-1 border text-wrap text-end ${
                              daysStatus.color === "warning"
                                ? "border-warning-subtle"
                                : daysStatus.color === "info"
                                  ? "border-info-subtle"
                                  : "border-danger"
                            }`}
                            style={{
                              maxWidth: "100px",
                              fontSize: "0.65rem",
                              lineHeight: "1.2",
                            }}
                          >
                            {daysStatus.text}
                          </Badge>
                        </div>

                        <div className="mb-3 bg-light p-2 rounded-3">
                          <div className="fw-bold text-dark d-flex align-items-start gap-2 mb-1 fs-6">
                            <Package
                              size={16}
                              className="text-primary mt-1 flex-shrink-0"
                            />
                            <span className="text-wrap lh-sm">
                              {refill.medicineName}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between text-muted small mt-2 fw-medium">
                            <span>
                              Qty:{" "}
                              <span className="text-dark">
                                {refill.qtyBought}
                              </span>
                            </span>
                            <span>
                              Refill:{" "}
                              <span className="text-dark">
                                {new Date(refill.refillDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-2 mt-auto">
                          {refill.reminderSentAutomated ? (
                            <div
                              className="d-flex align-items-center gap-1 text-success small fw-bold"
                              style={{ fontSize: "0.75rem" }}
                            >
                              <CheckCircle size={14} /> Sent
                            </div>
                          ) : (
                            <div
                              className="d-flex align-items-center gap-1 text-warning small fw-bold"
                              style={{ fontSize: "0.75rem" }}
                            >
                              <Clock size={14} /> Pending
                            </div>
                          )}
                          <Button
                            variant={
                              refill.reminderSentAutomated ? "light" : "primary"
                            }
                            size="sm"
                            className="rounded-pill px-3 fw-bold shadow-sm d-flex align-items-center gap-2"
                            onClick={() => handleSendReminder(refill)}
                            disabled={
                              sendingId === refill.orderId ||
                              refill.reminderSentAutomated
                            }
                          >
                            {sendingId === refill.orderId ? (
                              <Spinner animation="border" size="sm" />
                            ) : refill.reminderSentAutomated ? (
                              <CheckCircle size={14} className="text-success" />
                            ) : (
                              <Mail size={14} />
                            )}
                            {refill.reminderSentAutomated
                              ? "Sent"
                              : "Send Email"}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        </>
      )}

      <style>{`
        .tracking-wider { letter-spacing: 0.05em; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .table-row-hover:hover { background-color: #f8fafc; }
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0,0,0,0.08) !important; }
        .transition-all { transition: all 0.2s ease; }
        
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        
        .w-sm-auto { width: auto !important; }
        @media (max-width: 575.98px) {
          .w-sm-auto { width: 100% !important; }
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default PharmacistRefills;
