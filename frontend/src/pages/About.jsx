// src/pages/About.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import pharmacyInterior from "../assets/pharmacy.jpg"; // reuse or add better images
import pharmacistTeam from "../assets/pharmacy-dashboard.jpg";
import customerCare from "../assets/pharmacy1.jpg";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      {/* Back button */}
      <button
        type="button"
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* Hero section */}
      <div className="row align-items-center gy-4">
        <div className="col-lg-6">
          <h1 className="fw-bold mb-3">About Our Pharmacy</h1>
          <p className="text-muted">
            Smart Pharmacy is a modern community pharmacy focused on safe,
            convenient and patient‑centered care. Every prescription we fill and
            every consultation we provide is handled by qualified pharmacists
            who take the time to understand your medical history and needs.
          </p>
          <p className="text-muted">
            From chronic disease management to quick over‑the‑counter advice,
            our goal is to become your first point of contact for everyday
            healthcare questions. We combine trusted face‑to‑face service with
            digital tools so you can manage your medicines from home.
          </p>
        </div>

        <div className="col-lg-6">
          <div className="row g-3">
            <div className="col-6">
              <img
                src={pharmacyInterior}
                alt="Pharmacy interior"
                className="img-fluid rounded-3 shadow-sm w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="col-6 d-flex flex-column gap-3">
              <img
                src={pharmacistTeam}
                alt="Pharmacist team"
                className="img-fluid rounded-3 shadow-sm"
              />
              <img
                src={customerCare}
                alt="Customer care desk"
                className="img-fluid rounded-3 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* What we offer */}
      <div className="row gy-4 mt-5">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-semibold mb-2">Personalized care</h5>
              <p className="text-muted mb-0">
                Our pharmacists review each prescription for interactions,
                allergies and dosage, and are available for counseling on how
                and when to take your medicines safely.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-semibold mb-2">Reliable availability</h5>
              <p className="text-muted mb-0">
                We maintain a broad range of essential medicines and vaccines,
                with inventory alerts to reduce “out of stock” surprises for
                patients with ongoing treatment.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-semibold mb-2">Digital convenience</h5>
              <p className="text-muted mb-0">
                Patients can upload prescriptions, track orders, book doctor
                appointments and receive notifications, while still having the
                option to visit us in person.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & values */}
      <div className="row gy-4 mt-5">
        <div className="col-lg-6">
          <h4 className="fw-semibold mb-3">Our mission</h4>
          <p className="text-muted">
            To provide safe, accessible and affordable medicines to our
            community, while supporting patients with clear information and
            follow‑up. We believe a pharmacy is not just a counter, but a
            healthcare partner that people can trust.
          </p>
        </div>
        <div className="col-lg-6">
          <h4 className="fw-semibold mb-3">Our values</h4>
          <ul className="text-muted mb-0">
            <li>
              <strong>Safety first:</strong> Every prescription is checked
              carefully.
            </li>
            <li>
              <strong>Respect & privacy:</strong> Patient information is treated
              confidentially.
            </li>
            <li>
              <strong>Education:</strong> We explain therapies in clear, simple
              language.
            </li>
            <li>
              <strong>Continuous improvement:</strong> We use data and feedback
              to improve service quality.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
