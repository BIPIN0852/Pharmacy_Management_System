import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Heart,
  Clock,
  Users,
  Activity,
  Stethoscope,
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5 fade-in">
      {/* Back button */}
      <button
        type="button"
        className="btn btn-light btn-sm mb-4 d-flex align-items-center gap-2 shadow-sm border"
        onClick={() => navigate(-1)}
      >
        <span>&larr;</span> Back
      </button>

      {/* Hero section */}
      <div className="row align-items-center gy-5 mb-5">
        <div className="col-lg-6">
          <div className="pe-lg-4">
            <span className="badge bg-primary bg-opacity-10 text-primary mb-2 px-3 py-2 rounded-pill">
              Since 2024
            </span>
            <h1 className="display-5 fw-bold mb-3 text-dark">
              Reimagining <span className="text-primary">Healthcare</span> for
              Your Community
            </h1>
            <p className="lead text-muted mb-4">
              Smart Pharmacy is a modern community pharmacy focused on safe,
              convenient, and patient‑centered care. We combine trusted
              face‑to‑face service with digital tools so you can manage your
              health from home.
            </p>
            <div className="d-flex gap-4">
              <div>
                <h4 className="fw-bold mb-0 text-primary">5k+</h4>
                <small className="text-muted">Happy Patients</small>
              </div>
              <div>
                <h4 className="fw-bold mb-0 text-primary">100%</h4>
                <small className="text-muted">Quality Meds</small>
              </div>
              <div>
                <h4 className="fw-bold mb-0 text-primary">24/7</h4>
                <small className="text-muted">Support</small>
              </div>
            </div>
          </div>
        </div>

        {/* Image Collage */}
        <div className="col-lg-6">
          <div className="row g-3">
            <div className="col-6">
              <img
                src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80"
                alt="Pharmacy Shelves"
                className="img-fluid rounded-4 shadow w-100 h-100"
                style={{ objectFit: "cover", minHeight: "300px" }}
              />
            </div>
            <div className="col-6 d-flex flex-column gap-3">
              <img
                src="https://images.unsplash.com/photo-1576091160550-217358c7e618?auto=format&fit=crop&w=600&q=80"
                alt="Pharmacist"
                className="img-fluid rounded-4 shadow"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="bg-primary p-4 rounded-4 shadow text-white d-flex align-items-center justify-content-center flex-grow-1">
                <div className="text-center">
                  <Heart size={32} className="mb-2" />
                  <h6 className="mb-0 fw-bold">We Care</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Choose Us?</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            We go beyond just dispensing medicine. We provide a comprehensive
            healthcare ecosystem tailored to your needs.
          </p>
        </div>

        <div className="row g-4">
          {[
            {
              icon: ShieldCheck,
              title: "Safety First",
              desc: "Every prescription is double-checked by qualified pharmacists for interactions and dosage accuracy.",
              color: "text-success",
              bg: "bg-success",
            },
            {
              icon: Clock,
              title: "Fast Delivery",
              desc: "Order online and get your medicines delivered to your doorstep within hours.",
              color: "text-warning",
              bg: "bg-warning",
            },
            {
              icon: Stethoscope,
              title: "Expert Advice",
              desc: "Free consultations with our experienced pharmacists for all your medication queries.",
              color: "text-info",
              bg: "bg-info",
            },
            {
              icon: Activity,
              title: "Digital Health",
              desc: "Track your vitals, manage prescriptions, and book doctor appointments all in one app.",
              color: "text-danger",
              bg: "bg-danger",
            },
          ].map((item, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body p-4 text-center">
                  <div
                    className={`d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3 ${item.bg} bg-opacity-10`}
                  >
                    <item.icon size={28} className={item.color} />
                  </div>
                  <h5 className="fw-bold mb-2">{item.title}</h5>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-light rounded-4 p-5 my-5 shadow-sm">
        <div className="row align-items-center">
          <div className="col-lg-8 mx-auto text-center">
            <Users size={40} className="text-primary mb-3" />
            <h3 className="fw-bold mb-3">Our Mission</h3>
            <p className="lead text-muted mb-0">
              "To provide safe, accessible, and affordable medicines to our
              community, while supporting patients with clear information and
              compassionate follow‑up. We believe a pharmacy is not just a
              counter, but a healthcare partner that people can trust."
            </p>
          </div>
        </div>
      </div>

      {/* Team Snippet (Optional) */}
      <div className="text-center py-4">
        <p className="text-muted mb-0">
          Have questions?{" "}
          <a
            href="/contact"
            className="text-primary text-decoration-none fw-bold"
          >
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
};

export default About;
