// // src/pages/Privacy.jsx
// import React from "react";

// const Privacy = () => {
//   return (
//     <div className="container py-5">
//       <h1>Privacy &amp; Terms</h1>
//       <p className="text-muted mt-3">
//         This section explains how the Pharmacy Management System handles user
//         data. Adapt this content to your real legal and regulatory requirements
//         when deploying in production.
//       </p>

//       <div className="row gy-4 mt-2">
//         <div className="col-md-6">
//           <h5 className="fw-semibold">Data we store</h5>
//           <ul className="text-muted">
//             <li>Account details: name, email, role and basic contact info.</li>
//             <li>
//               Operational data: prescriptions, orders, appointments and payments
//               linked to those operations.
//             </li>
//             <li>
//               System logs: timestamps, actions and technical metadata used for
//               debugging and audit trails.
//             </li>
//           </ul>
//         </div>
//         <div className="col-md-6">
//           <h5 className="fw-semibold">How data is used</h5>
//           <ul className="text-muted">
//             <li>To run core pharmacy workflows and dashboards.</li>
//             <li>To troubleshoot issues and improve system performance.</li>
//             <li>
//               To provide admins with aggregated analytics (never raw credentials
//               or sensitive secrets).
//             </li>
//           </ul>
//         </div>
//       </div>

//       <div className="row gy-4 mt-1">
//         <div className="col-md-6">
//           <h5 className="fw-semibold">Security practices</h5>
//           <ul className="text-muted">
//             <li>Authentication and role‑based authorization for all users.</li>
//             <li>
//               Tokens and secrets should be stored using environment variables on
//               the server.
//             </li>
//             <li>
//               For real deployments, you should enable HTTPS, regular backups and
//               access auditing.
//             </li>
//           </ul>
//         </div>
//         <div className="col-md-6">
//           <h5 className="fw-semibold">Legal disclaimer</h5>
//           <p className="text-muted mb-0">
//             This project is provided as‑is for learning and internal use. It is
//             not a substitute for legal advice or full regulatory compliance in
//             healthcare. Always consult your legal and compliance teams before
//             using such a system in production.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Privacy;

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
