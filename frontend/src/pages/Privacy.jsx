import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Lock,
  Database,
  Eye,
  AlertTriangle,
  ChevronLeft,
  FileText,
  Server,
} from "lucide-react";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div
      className="container py-5 fade-in"
      style={{ maxWidth: "900px", minHeight: "80vh" }}
    >
      {/* Back button */}
      <button
        type="button"
        className="btn btn-light btn-sm mb-4 d-flex align-items-center gap-2 shadow-sm border"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="text-center mb-5">
        <div className="d-inline-flex align-items-center justify-content-center p-3 bg-primary bg-opacity-10 text-primary rounded-circle mb-3">
          <Shield size={32} />
        </div>
        <h1 className="fw-bold mb-3">Privacy Policy & Terms</h1>
        <p
          className="text-muted"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          Transparency is key to our relationship. Below is an overview of how
          the Pharmacy Management System handles data, security, and usage
          rights.
        </p>
      </div>

      <div className="row g-4">
        {/* Section 1: Data Storage */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Database className="text-info" size={24} />
                <h5 className="fw-bold mb-0">Data We Store</h5>
              </div>
              <ul className="list-unstyled text-muted d-flex flex-column gap-2 mb-0">
                <li className="d-flex align-items-start gap-2">
                  <span
                    className="mt-1 bg-info rounded-circle"
                    style={{ width: 6, height: 6 }}
                  ></span>
                  <span>
                    <strong>Account details:</strong> Name, email, role, and
                    contact info.
                  </span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span
                    className="mt-1 bg-info rounded-circle"
                    style={{ width: 6, height: 6 }}
                  ></span>
                  <span>
                    <strong>Operational data:</strong> Prescriptions, order
                    history, appointments, and payments.
                  </span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span
                    className="mt-1 bg-info rounded-circle"
                    style={{ width: 6, height: 6 }}
                  ></span>
                  <span>
                    <strong>System logs:</strong> Timestamps and technical
                    metadata for auditing.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2: Data Usage */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Eye className="text-success" size={24} />
                <h5 className="fw-bold mb-0">How Data is Used</h5>
              </div>
              <ul className="list-unstyled text-muted d-flex flex-column gap-2 mb-0">
                <li className="d-flex align-items-start gap-2">
                  <span
                    className="mt-1 bg-success rounded-circle"
                    style={{ width: 6, height: 6 }}
                  ></span>
                  <span>
                    To facilitate core pharmacy workflows (dispensing, billing).
                  </span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span
                    className="mt-1 bg-success rounded-circle"
                    style={{ width: 6, height: 6 }}
                  ></span>
                  <span>
                    To improve system performance and troubleshoot errors.
                  </span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span
                    className="mt-1 bg-success rounded-circle"
                    style={{ width: 6, height: 6 }}
                  ></span>
                  <span>
                    To provide aggregated analytics to admins (no raw secrets).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Security */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Lock className="text-primary" size={24} />
                <h5 className="fw-bold mb-0">Security Practices</h5>
              </div>
              <ul className="list-unstyled text-muted d-flex flex-column gap-2 mb-0">
                <li className="d-flex align-items-start gap-2">
                  <span
                    className="mt-1 bg-primary rounded-circle"
                    style={{ width: 6, height: 6 }}
                  ></span>
                  <span>
                    Role-based access control (RBAC) enforces strict data
                    permissions.
                  </span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span
                    className="mt-1 bg-primary rounded-circle"
                    style={{ width: 6, height: 6 }}
                  ></span>
                  <span>
                    Sensitive secrets and tokens are managed via environment
                    variables.
                  </span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span
                    className="mt-1 bg-primary rounded-circle"
                    style={{ width: 6, height: 6 }}
                  ></span>
                  <span>
                    <strong>Recommendation:</strong> Use HTTPS and regular
                    backups in production.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Disclaimer */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm rounded-4 bg-warning bg-opacity-10">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <AlertTriangle className="text-warning" size={24} />
                <h5 className="fw-bold mb-0 text-dark">Legal Disclaimer</h5>
              </div>
              <p
                className="text-muted mb-0 small"
                style={{ lineHeight: "1.6" }}
              >
                This project is provided "as-is" for educational and internal
                management purposes. It is <strong>not</strong> a substitute for
                professional legal advice or full regulatory compliance (such as
                HIPAA or GDPR) in a real-world healthcare setting.
                <br />
                <br />
                <strong>
                  Always consult your compliance team before deploying with real
                  patient data.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-5 text-muted small">
        <p className="mb-0">
          Have concerns about your data?{" "}
          <a href="/contact" className="text-primary text-decoration-none">
            Contact our Data Protection Officer
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Privacy;
