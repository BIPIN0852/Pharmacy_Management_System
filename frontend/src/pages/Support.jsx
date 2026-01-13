// // src/pages/Support.jsx
// import React from "react";

// const Support = () => {
//   return (
//     <div className="container py-5">
//       <h1>Support</h1>
//       <p className="text-muted mt-3">
//         For technical issues or questions about configuring the Pharmacy
//         Management System, use one of the options below. In production, this
//         page can be connected to a real ticketing system or chat widget.
//       </p>

//       <div className="row gy-4 mt-3">
//         <div className="col-md-6">
//           <div className="card h-100 shadow-sm border-0">
//             <div className="card-body">
//               <h5 className="fw-semibold mb-2">1. Email support</h5>
//               <p className="text-muted mb-2">
//                 Send detailed information about your issue, including:
//               </p>
//               <ul className="text-muted mb-0">
//                 <li>Which page you were on and what you tried to do.</li>
//                 <li>Any error messages or screenshots.</li>
//                 <li>Your browser, OS and environment (dev / production).</li>
//               </ul>
//               <p className="mt-2 mb-0">
//                 Email: <strong>support@smartpharmacy.local</strong>
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-6">
//           <div className="card h-100 shadow-sm border-0">
//             <div className="card-body">
//               <h5 className="fw-semibold mb-2">2. Self‑service checks</h5>
//               <ul className="text-muted mb-0">
//                 <li>Check the System Status page for ongoing incidents.</li>
//                 <li>Confirm your internet connection and login credentials.</li>
//                 <li>
//                   If you are an admin, review recent configuration changes in
//                   the admin dashboard.
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Support;

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LifeBuoy,
  Mail,
  CheckSquare,
  ChevronLeft,
  Server,
  Wifi,
  ShieldAlert,
} from "lucide-react";

const Support = () => {
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
        <div className="d-inline-flex align-items-center justify-content-center p-3 bg-danger bg-opacity-10 text-danger rounded-circle mb-3">
          <LifeBuoy size={32} />
        </div>
        <h1 className="fw-bold mb-3">Support Center</h1>
        <p
          className="text-muted"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          Need help with the Pharmacy Management System? Choose the best way to
          get your issue resolved below.
        </p>
      </div>

      <div className="row g-4">
        {/* Option 1: Email Support */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
                  <Mail size={24} />
                </div>
                <h5 className="fw-bold mb-0">Email Support</h5>
              </div>
              <p className="text-muted small mb-3">
                For detailed technical issues, bugs, or configuration questions.
                Please include:
              </p>
              <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-4">
                <li className="d-flex align-items-start gap-2">
                  <span
                    className="mt-1 bg-primary rounded-circle"
                    style={{ width: 6, height: 6 }}
                  ></span>
                  <span>
                    Steps to reproduce the issue (page, action taken).
                  </span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span
                    className="mt-1 bg-primary rounded-circle"
                    style={{ width: 6, height: 6 }}
                  ></span>
                  <span>Screenshots or error messages received.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span
                    className="mt-1 bg-primary rounded-circle"
                    style={{ width: 6, height: 6 }}
                  ></span>
                  <span>Your Browser, OS, and User Role.</span>
                </li>
              </ul>
              <div className="mt-auto pt-3 border-top">
                <p className="mb-0 small text-muted">
                  Write to us at: <br />
                  <a
                    href="mailto:support@smartpharmacy.local"
                    className="fw-bold text-primary text-decoration-none fs-6"
                  >
                    support@smartpharmacy.local
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Option 2: Self Service Checks */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-success bg-opacity-10 p-2 rounded-circle text-success">
                  <CheckSquare size={24} />
                </div>
                <h5 className="fw-bold mb-0">Quick Troubleshooting</h5>
              </div>
              <p className="text-muted small mb-3">
                Before reaching out, try these common fixes to resolve issues
                faster:
              </p>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center bg-light p-2 rounded border border-light-subtle">
                  <Server size={18} className="text-muted me-3 ms-1" />
                  <span className="small text-dark">
                    Check System Status page for outages.
                  </span>
                </div>
                <div className="d-flex align-items-center bg-light p-2 rounded border border-light-subtle">
                  <Wifi size={18} className="text-muted me-3 ms-1" />
                  <span className="small text-dark">
                    Verify your internet connection.
                  </span>
                </div>
                <div className="d-flex align-items-center bg-light p-2 rounded border border-light-subtle">
                  <ShieldAlert size={18} className="text-muted me-3 ms-1" />
                  <span className="small text-dark">
                    Admins: Review recent audit logs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <p className="text-muted small mb-0">
          <strong>Note:</strong> In a production environment, this page would
          connect to a live ticketing system (e.g., Zendesk, Jira).
        </p>
      </div>
    </div>
  );
};

export default Support;
