import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Card,
  Spinner,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import {
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const PharmacistPrescriptions = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRx, setSelectedRx] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // ✅ UPGRADED: Hybrid Fetcher pulls from BOTH Orders and Prescriptions
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);

      const [ordersRes, rxRes] = await Promise.all([
        api.get("/orders").catch(() => ({ data: [] })),
        api.get("/prescriptions").catch(() => ({ data: [] })),
      ]);

      // 1. Format Checkout Orders
      const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const checkoutDocs = ordersData
        .filter((o) => o.prescriptionImage || o.supportiveDocument)
        .map((o) => ({
          _id: o._id,
          user: o.user,
          createdAt: o.createdAt,
          notes: "Checkout Order Verification",
          displayStatus: o.prescriptionStatus || "Pending",
          displayImage: o.prescriptionImage,
          supportiveDocument: o.supportiveDocument,
          isOrder: true, // Flag to track source
        }));

      // 2. Format Standalone Prescriptions
      const rxData = Array.isArray(rxRes.data)
        ? rxRes.data
        : rxRes.data?.prescriptions || [];
      const standaloneDocs = rxData.map((rx) => ({
        _id: rx._id,
        user: rx.user,
        createdAt: rx.createdAt,
        notes: rx.notes,
        displayStatus: rx.status,
        displayImage: rx.imageUrl || rx.image,
        supportiveDocument: rx.supportiveDocument,
        isOrder: false, // Flag to track source
      }));

      // Combine both lists and sort by newest first
      const combined = [...checkoutDocs, ...standaloneDocs].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setPrescriptions(combined);
    } catch (err) {
      setError("Failed to fetch medical documents.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status) => {
    if (!selectedRx) return;
    setActionLoading(true);

    try {
      // ✅ UPGRADED: Hits the correct API depending on where the doc came from
      if (selectedRx.isOrder) {
        await api.put(`/orders/${selectedRx._id}/prescription`, { status });
      } else {
        await api.put(`/prescriptions/${selectedRx._id}`, {
          status,
          notes: status === "Rejected" ? rejectReason : selectedRx.notes,
        });
      }

      // Update UI locally
      const updatedList = prescriptions.map((p) =>
        p._id === selectedRx._id ? { ...p, displayStatus: status } : p,
      );
      setPrescriptions(updatedList);
      setShowModal(false);
      setRejectReason("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update document status.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved")
      return (
        <Badge
          bg="success-subtle"
          className="text-success border border-success-subtle px-3 py-2 rounded-pill"
        >
          Approved
        </Badge>
      );
    if (s === "rejected")
      return (
        <Badge
          bg="danger-subtle"
          className="text-danger border border-danger-subtle px-3 py-2 rounded-pill"
        >
          Rejected
        </Badge>
      );
    return (
      <Badge
        bg="warning-subtle"
        className="text-warning border border-warning-subtle px-3 py-2 rounded-pill"
      >
        Pending
      </Badge>
    );
  };

  // HELPER: Get correct image URL (Handling localhost ports)
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    return path.startsWith("/")
      ? `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${path}`
      : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}/${path}`;
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-muted small">Loading medical records...</p>
      </div>
    );

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Prescription Verification</h3>
          <p className="text-muted small">
            Verify uploaded medical documents from both Direct Uploads and
            Checkout Orders.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="border-0 shadow-sm">
          {error}
        </Alert>
      )}

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead className="bg-light border-bottom">
              <tr className="small text-uppercase text-muted fw-bold">
                <th className="py-3 ps-4">Record ID</th>
                <th className="py-3">Patient / Customer</th>
                <th className="py-3">Upload Date</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-end pe-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <FileText size={48} className="opacity-25 mb-3" />
                    <p>No prescriptions pending verification.</p>
                  </td>
                </tr>
              ) : (
                prescriptions.map((rx) => (
                  <tr key={rx._id}>
                    <td className="ps-4 fw-bold text-primary">
                      #{rx._id.substring(rx._id.length - 8).toUpperCase()}
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">
                        {rx.user?.name || "Anonymous"}
                      </div>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {rx.notes?.substring(0, 30)}...
                      </div>
                      <Badge
                        bg={rx.isOrder ? "info" : "secondary"}
                        className="mt-1"
                        style={{ fontSize: "0.65rem" }}
                      >
                        {rx.isOrder ? "Checkout Flow" : "Direct Upload"}
                      </Badge>
                    </td>
                    <td className="text-secondary small">
                      {new Date(rx.createdAt).toLocaleDateString()}
                    </td>
                    <td>{getStatusBadge(rx.displayStatus)}</td>
                    <td className="text-end pe-4">
                      <Button
                        size="sm"
                        variant="white"
                        className="border shadow-sm rounded-3 px-3 d-inline-flex align-items-center gap-2"
                        onClick={() => {
                          setSelectedRx(rx);
                          setShowModal(true);
                        }}
                      >
                        <Eye size={16} className="text-primary" /> Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        centered
        className="rx-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <FileText size={22} className="text-primary" /> Document
            Verification
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row className="g-4">
            <Col lg={8}>
              <h6 className="fw-bold text-uppercase text-muted small mb-3">
                Uploaded Documents
              </h6>
              <Row className="g-3 h-100">
                {/* 1. Prescription Box */}
                <Col md={6}>
                  <div
                    className="bg-light rounded-4 p-2 text-center border h-100 d-flex flex-column align-items-center justify-content-center overflow-hidden position-relative"
                    style={{ minHeight: "350px" }}
                  >
                    <Badge
                      bg="primary"
                      className="position-absolute top-0 start-0 m-3 z-1 shadow-sm"
                    >
                      1. Prescription
                    </Badge>
                    {selectedRx?.displayImage ? (
                      <img
                        src={getImageUrl(selectedRx.displayImage)}
                        className="img-fluid rounded-3 shadow-sm cursor-zoom mt-4"
                        style={{ maxHeight: "350px", cursor: "zoom-in" }}
                        alt="Prescription"
                        onClick={() =>
                          window.open(
                            getImageUrl(selectedRx.displayImage),
                            "_blank",
                          )
                        }
                      />
                    ) : (
                      <div className="text-muted p-5">Image not found</div>
                    )}
                  </div>
                </Col>

                {/* 2. Supportive ID Box */}
                <Col md={6}>
                  <div
                    className="bg-light rounded-4 p-2 text-center border h-100 d-flex flex-column align-items-center justify-content-center overflow-hidden position-relative"
                    style={{ minHeight: "350px" }}
                  >
                    <Badge
                      bg="secondary"
                      className="position-absolute top-0 start-0 m-3 z-1 shadow-sm"
                    >
                      2. Supportive ID
                    </Badge>
                    {selectedRx?.supportiveDocument ? (
                      <img
                        src={getImageUrl(selectedRx.supportiveDocument)}
                        className="img-fluid rounded-3 shadow-sm cursor-zoom mt-4"
                        style={{ maxHeight: "350px", cursor: "zoom-in" }}
                        alt="Supportive ID"
                        onClick={() =>
                          window.open(
                            getImageUrl(selectedRx.supportiveDocument),
                            "_blank",
                          )
                        }
                      />
                    ) : (
                      <div className="text-danger small fw-bold p-5 d-flex flex-column align-items-center gap-2">
                        <XCircle size={32} />
                        No ID provided by customer
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
              <div className="text-muted small mt-2 d-flex justify-content-end">
                * Click on any document to open full size in a new tab.
              </div>
            </Col>

            <Col lg={4} className="d-flex flex-column">
              <h6 className="fw-bold text-uppercase text-muted small mb-3">
                Patient Information
              </h6>
              <div className="bg-light p-3 rounded-3 mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <User size={16} className="text-primary" />{" "}
                  <span className="fw-bold">{selectedRx?.user?.name}</span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Calendar size={16} className="text-primary" />{" "}
                  <span className="small">
                    {new Date(selectedRx?.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="small text-muted border-top mt-2 pt-2">
                  <strong>Notes:</strong>{" "}
                  {selectedRx?.notes || "No patient notes provided."}
                </div>
              </div>

              {["pending", "Pending", "Pending Verification"].includes(
                selectedRx?.displayStatus,
              ) ? (
                <div className="mt-auto">
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">
                      Verification Comments
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Add reason if rejecting or pharmacy notes..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="border-2"
                    />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button
                      variant="success"
                      className="flex-grow-1 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                      disabled={actionLoading}
                      onClick={() => handleAction("Approved")}
                    >
                      {actionLoading ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          <CheckCircle size={18} /> Approve
                        </>
                      )}
                    </Button>
                    <Button
                      variant="danger"
                      className="flex-grow-1 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                      disabled={actionLoading}
                      onClick={() => handleAction("Rejected")}
                    >
                      {actionLoading ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          <XCircle size={18} /> Reject
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <Alert
                  variant={
                    selectedRx?.displayStatus === "Approved"
                      ? "success"
                      : "danger"
                  }
                  className="mt-auto border-0 shadow-sm"
                >
                  <div className="fw-bold">
                    Document {selectedRx?.displayStatus}
                  </div>
                  <small>Processed on {new Date().toLocaleDateString()}</small>
                </Alert>
              )}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <style>{`
        .cursor-zoom:hover { transform: scale(1.02); transition: transform 0.3s ease; }
        .rx-modal .modal-content { border-radius: 20px; border: none; }
      `}</style>
    </div>
  );
};

export default PharmacistPrescriptions;
