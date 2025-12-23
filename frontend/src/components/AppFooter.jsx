// src/components/AppFooter.jsx
import React from "react";
import Lottie from "lottie-react";
import footerAnimation from "../assets/health.json";

const AppFooter = ({ context }) => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-top px-4 py-4 small text-muted"
      style={{
        background: "linear-gradient(90deg, #0f172a 0%, #1d4ed8 100%)",
        color: "#e5e7eb",
      }}
    >
      <div className="container-fluid">
        <div className="row gy-3 align-items-start">
          {/* Brand / summary */}
          <div className="col-md-4">
            <div className="fw-semibold text-white fs-6 mb-1">
              Pharmacy Management System
            </div>
            <p className="mb-2">
              A secure digital platform for managing prescriptions, inventory,
              orders and appointments.
            </p>
            {context && <p className="mb-0 text-secondary">{context}</p>}
          </div>

          {/* Navigation links */}
          <div className="col-md-4 d-flex flex-wrap gap-4">
            <div>
              <div className="fw-semibold text-white mb-2">Company</div>
              <ul className="list-unstyled mb-0">
                <li>
                  <a
                    href="/about"
                    className="text-gray-200 text-decoration-none"
                  >
                    About us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-200 text-decoration-none"
                  >
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-gray-200 text-decoration-none">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="fw-semibold text-white mb-2">Resources</div>
              <ul className="list-unstyled mb-0">
                <li>
                  <a
                    href="/support"
                    className="text-gray-200 text-decoration-none"
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href="/status"
                    className="text-gray-200 text-decoration-none"
                  >
                    Privacy &amp; Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Animation + contact info */}
          <div className="col-md-4 d-flex justify-content-end align-items-center gap-3">
            <div style={{ width: 80, height: 80 }}>
              <Lottie
                animationData={footerAnimation}
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div className="text-end small">
              <div className="fw-semibold text-white mb-1">Contact</div>
              <div>Email: support@smartpharmacy.local</div>
              <div>Phone: +977-9800000000</div>
              <div className="mt-1 text-secondary">
                © {year} All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
