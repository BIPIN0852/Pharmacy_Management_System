// src/pages/Privacy.jsx
import React from "react";

const Privacy = () => {
  return (
    <div className="container py-5">
      <h1>Privacy &amp; Terms</h1>
      <p className="text-muted mt-3">
        This section explains how the Pharmacy Management System handles user
        data. Adapt this content to your real legal and regulatory requirements
        when deploying in production.
      </p>

      <div className="row gy-4 mt-2">
        <div className="col-md-6">
          <h5 className="fw-semibold">Data we store</h5>
          <ul className="text-muted">
            <li>Account details: name, email, role and basic contact info.</li>
            <li>
              Operational data: prescriptions, orders, appointments and payments
              linked to those operations.
            </li>
            <li>
              System logs: timestamps, actions and technical metadata used for
              debugging and audit trails.
            </li>
          </ul>
        </div>
        <div className="col-md-6">
          <h5 className="fw-semibold">How data is used</h5>
          <ul className="text-muted">
            <li>To run core pharmacy workflows and dashboards.</li>
            <li>To troubleshoot issues and improve system performance.</li>
            <li>
              To provide admins with aggregated analytics (never raw credentials
              or sensitive secrets).
            </li>
          </ul>
        </div>
      </div>

      <div className="row gy-4 mt-1">
        <div className="col-md-6">
          <h5 className="fw-semibold">Security practices</h5>
          <ul className="text-muted">
            <li>Authentication and role‑based authorization for all users.</li>
            <li>
              Tokens and secrets should be stored using environment variables on
              the server.
            </li>
            <li>
              For real deployments, you should enable HTTPS, regular backups and
              access auditing.
            </li>
          </ul>
        </div>
        <div className="col-md-6">
          <h5 className="fw-semibold">Legal disclaimer</h5>
          <p className="text-muted mb-0">
            This project is provided as‑is for learning and internal use. It is
            not a substitute for legal advice or full regulatory compliance in
            healthcare. Always consult your legal and compliance teams before
            using such a system in production.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
