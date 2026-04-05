import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Button,
} from "react-bootstrap";
import { Receipt, FileText, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BillingForm from "../components/BillingForm";
import InvoiceTable from "../components/InvoiceTable";
import api from "../services/api";

const SalesBilling = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch Invoices from Backend
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      // API Call
      const res = await api.get("/invoices");

      setInvoices(res.data || []);
    } catch (err) {
      console.error("Fetch Invoices Error:", err);
      setError(err.response?.data?.message || "Failed to load sales history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Add Invoice (Called by BillingForm)
  const addInvoice = async (invoiceData) => {
    try {
      setError("");
      setSuccess("");

      // POST Request
      const res = await api.post("/invoices", invoiceData);

      // Optimistic update or re-fetch
      setInvoices((prev) => [res.data, ...prev]);
      setSuccess("Invoice generated successfully.");

      setTimeout(() => setSuccess(""), 3000);
      return true; // Return true to signal the form to reset
    } catch (err) {
      console.error("Create Invoice Error:", err);
      setError(err.response?.data?.message || "Failed to create invoice.");
      return false;
    }
  };

  // Delete Invoice
  const deleteInvoice = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this invoice record?")
    ) {
      return;
    }

    try {
      setError("");

      // DELETE Request
      await api.delete(`/invoices/${id}`);

      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      setSuccess("Invoice record deleted.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete Invoice Error:", err);
      setError(err.response?.data?.message || "Failed to delete invoice.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <Container className="py-4 fade-in">
        <div className="mb-3">
          <Button
            variant="link"
            className="text-decoration-none text-dark p-0 d-flex align-items-center"
            style={{ width: "fit-content" }}
            onClick={() => navigate(-1)} // Goes back to the previous page (e.g., Dashboard)
          >
            <ArrowLeft size={18} className="me-1" /> Back
          </Button>
        </div>

        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success shadow-sm">
            <Receipt size={28} />
          </div>
          <div>
            <h2 className="fw-bold mb-0 text-dark">Sales & Billing</h2>
            <p className="text-muted mb-0 small">
              Generate invoices and manage sales history.
            </p>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <Alert
            variant="danger"
            onClose={() => setError("")}
            dismissible
            className="d-flex align-items-center shadow-sm border-0 rounded-3"
          >
            <AlertCircle size={18} className="me-2" /> {error}
          </Alert>
        )}
        {success && (
          <Alert
            variant="success"
            onClose={() => setSuccess("")}
            dismissible
            className="shadow-sm border-0 rounded-3"
          >
            {success}
          </Alert>
        )}

        <Row className="g-4">
          {/* Left: Billing Form */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Header className="bg-white border-bottom p-3">
                <h5 className="fw-bold mb-0 text-primary">New Invoice</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <BillingForm addInvoice={addInvoice} />
              </Card.Body>
            </Card>
          </Col>

          {/* Right: Invoice History */}
          <Col lg={7}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Header className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 text-dark">Recent Invoices</h5>
                <span className="badge bg-light text-dark border">
                  {invoices.length} Records
                </span>
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center py-5">
                    <Spinner
                      animation="border"
                      variant="primary"
                      className="me-2"
                    />
                    <span className="text-muted fw-medium">
                      Loading history...
                    </span>
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <FileText size={40} className="mb-3 opacity-25" />
                    <h6 className="fw-bold text-dark">No invoices found</h6>
                    <p className="mb-0 small">
                      Generated invoices will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <InvoiceTable
                      invoices={invoices}
                      deleteInvoice={deleteInvoice}
                    />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SalesBilling;
