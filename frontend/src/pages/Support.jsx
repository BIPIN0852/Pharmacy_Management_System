// src/pages/Support.jsx
import React from "react";

const Support = () => {
  return (
    <div className="container py-5">
      <h1>Support</h1>
      <p className="text-muted mt-3">
        For technical issues or questions about configuring the Pharmacy
        Management System, use one of the options below. In production, this
        page can be connected to a real ticketing system or chat widget.
      </p>

      <div className="row gy-4 mt-3">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-semibold mb-2">1. Email support</h5>
              <p className="text-muted mb-2">
                Send detailed information about your issue, including:
              </p>
              <ul className="text-muted mb-0">
                <li>Which page you were on and what you tried to do.</li>
                <li>Any error messages or screenshots.</li>
                <li>Your browser, OS and environment (dev / production).</li>
              </ul>
              <p className="mt-2 mb-0">
                Email: <strong>support@smartpharmacy.local</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-semibold mb-2">2. Self‑service checks</h5>
              <ul className="text-muted mb-0">
                <li>Check the System Status page for ongoing incidents.</li>
                <li>Confirm your internet connection and login credentials.</li>
                <li>
                  If you are an admin, review recent configuration changes in
                  the admin dashboard.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
