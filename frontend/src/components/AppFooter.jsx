import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pill,
  ShieldCheck,
  CreditCard,
  BadgeCheck,
  PhoneCall,
  Clock,
  MessageSquare,
  X,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import api from "../services/api";

const AppFooter = ({ context }) => {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  // Chat Box States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/messages", formData);
      setSuccess(true);
      setTimeout(() => {
        setIsChatOpen(false);
        setSuccess(false);
        setFormData({ name: "", email: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Failed to send message", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MAIN FOOTER */}
      <footer
        className="mt-auto"
        style={{
          backgroundColor: "#232F3E",
          color: "#FFFFFF",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.85rem",
        }}
      >
        <div className="container py-4">
          <div className="row gy-4">
            {/* 1. Brand & Description */}
            <div className="col-lg-4 pe-lg-4">
              <div
                className="d-flex align-items-center gap-2 mb-2 cursor-pointer footer-brand"
                onClick={() => navigate("/")}
              >
                <Pill size={22} style={{ color: "#FFD814" }} />
                <h5
                  className="fw-bold mb-0 text-white"
                  style={{ letterSpacing: "-0.5px", fontSize: "1.2rem" }}
                >
                  SmartPharmacy
                </h5>
                {context && (
                  <span
                    className="badge rounded-1 ms-1 text-uppercase fw-bold"
                    style={{
                      backgroundColor: "#37475A",
                      color: "#DDD",
                      fontSize: "0.6rem",
                    }}
                  >
                    {context}
                  </span>
                )}
              </div>
              <p className="mb-3" style={{ color: "#CCC", lineHeight: "1.4" }}>
                Providing clinical-grade pharmacy management and accessible
                healthcare for everyone. Better prices, faster delivery,
                superior care.
              </p>
              <div className="d-flex gap-3" style={{ color: "#888C8C" }}>
                <ShieldCheck size={20} />
                <CreditCard size={20} />
                <BadgeCheck size={20} />
              </div>
            </div>

            {/* 2. Patients Links */}
            <div className="col-6 col-lg-2 offset-lg-1">
              <h6
                className="fw-bold mb-2 text-white"
                style={{ fontSize: "0.9rem" }}
              >
                Patients
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-1 mb-0">
                <li>
                  <span
                    className="footer-link cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    How it Works
                  </span>
                </li>
                <li>
                  <span
                    className="footer-link cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    Pricing & Savings
                  </span>
                </li>
                <li>
                  <span
                    className="footer-link cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Medication Search
                  </span>
                </li>
              </ul>
            </div>

            {/* 3. Providers Links */}
            <div className="col-6 col-lg-2">
              <h6
                className="fw-bold mb-2 text-white"
                style={{ fontSize: "0.9rem" }}
              >
                Providers
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-1 mb-0">
                <li>
                  <span
                    className="footer-link cursor-pointer"
                    onClick={() => navigate("/register")}
                  >
                    E-Prescribing
                  </span>
                </li>
                <li>
                  <span
                    className="footer-link cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Pharmacy Admin
                  </span>
                </li>
                <li>
                  <span
                    className="footer-link cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Doctor Portal
                  </span>
                </li>
              </ul>
            </div>

            {/* 4. Contact Us */}
            <div className="col-lg-3">
              <h6
                className="fw-bold mb-2 text-white"
                style={{ fontSize: "0.9rem" }}
              >
                Let Us Help You
              </h6>
              <ul
                className="list-unstyled d-flex flex-column gap-2 mb-0"
                style={{ color: "#CCC" }}
              >
                <li>
                  <a
                    href="tel:+9779800000000"
                    className="footer-link d-flex align-items-center gap-2 text-decoration-none"
                  >
                    <PhoneCall size={14} /> +977-9800000000
                  </a>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <Clock size={14} /> 24/7 Support
                </li>
                <li className="mt-1">
                  {/* Opens the Chat Box */}
                  <button
                    className="btn btn-sm d-flex align-items-center gap-2 border-0 fw-medium shadow-sm"
                    style={{
                      backgroundColor: "#FFD814",
                      color: "#0F1111",
                      borderRadius: "4px",
                    }}
                    onClick={() => setIsChatOpen(true)}
                  >
                    <MessageSquare size={14} /> Support Chat
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div style={{ backgroundColor: "#131A22", padding: "15px 0" }}>
          <div
            className="container d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 gap-md-5"
            style={{ color: "#DDD", fontSize: "0.75rem" }}
          >
            <div className="d-flex gap-4">
              <span
                className="footer-link cursor-pointer"
                onClick={() => navigate("/")}
              >
                Conditions of Use
              </span>
              <span
                className="footer-link cursor-pointer"
                onClick={() => navigate("/")}
              >
                Privacy Notice
              </span>
              <span
                className="footer-link cursor-pointer"
                onClick={() => navigate("/")}
              >
                HIPAA Notice
              </span>
            </div>
            <div>
              &copy; {year} Smart Pharmacy System Inc. All rights reserved.
            </div>
          </div>
        </div>

        {/* Global CSS for Footer */}
        <style>{`
          .cursor-pointer { cursor: pointer; }
          .footer-link { color: #DDD; transition: color 0.1s; text-decoration: none; }
          .footer-link:hover { color: #FFF !important; text-decoration: underline !important; }
          .footer-brand:hover h5 { text-decoration: underline; }
        `}</style>
      </footer>

      {/* FLOATING MESSAGE BOX (AWS Style) */}
      {isChatOpen && (
        <div
          className="position-fixed bottom-0 end-0 m-3 m-md-4 z-3 shadow rounded-1 bg-white text-dark border"
          style={{
            width: "320px",
            maxWidth: "90vw",
            borderColor: "#D5D9D9",
            animation: "slideUp 0.2s ease-out",
          }}
        >
          <div
            className="p-2 px-3 d-flex justify-content-between align-items-center border-bottom"
            style={{ backgroundColor: "#232F3E", color: "#FFF" }}
          >
            <div
              className="fw-bold d-flex align-items-center gap-2"
              style={{ fontSize: "0.9rem" }}
            >
              <MessageSquare size={16} style={{ color: "#FFD814" }} /> Support
              Team
            </div>
            <button
              className="btn btn-link text-white p-0 m-0 opacity-75 hover-opacity-100"
              onClick={() => setIsChatOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-3">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle2
                  size={40}
                  style={{ color: "#067D62" }}
                  className="mb-2 mx-auto"
                />
                <h6 className="fw-bold" style={{ color: "#0F1111" }}>
                  Message Sent!
                </h6>
                <p className="text-muted small mb-0">
                  An admin will review it shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMessageSubmit}>
                <p
                  className="small mb-3"
                  style={{ color: "#565959", lineHeight: "1.3" }}
                >
                  Leave us a message and we'll get back to you within 24 hours.
                </p>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm amazon-chat-input"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="email"
                    className="form-control form-control-sm amazon-chat-input"
                    placeholder="Your Email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control form-control-sm amazon-chat-input"
                    rows="3"
                    placeholder="How can we help?"
                    required
                    value={formData.text}
                    onChange={(e) =>
                      setFormData({ ...formData, text: e.target.value })
                    }
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-sm w-100 fw-medium d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm"
                  disabled={loading}
                  style={{
                    backgroundColor: "#FFD814",
                    color: "#0F1111",
                    borderRadius: "4px",
                  }}
                >
                  {loading ? (
                    <Loader2 size={16} className="spin-animation" />
                  ) : (
                    <>
                      <Send size={14} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Chat Box Animations & Focus Styles */}
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .amazon-chat-input { border: 1px solid #888C8C; border-radius: 3px; font-size: 0.85rem; box-shadow: none; }
        .amazon-chat-input:focus { 
          border-color: #e47911 !important; 
          box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; 
          outline: none; 
        }
        .hover-opacity-100:hover { opacity: 1 !important; }
      `}</style>
    </>
  );
};

export default AppFooter;
