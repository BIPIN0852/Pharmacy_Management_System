// src/pages/Contact.jsx
import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just fake a submit
    setStatus("Thank you for reaching out. Your message has been recorded.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="container py-5">
      <div className="row gy-4">
        <div className="col-lg-6">
          <h1>Contact Us</h1>
          <p className="text-muted mt-3">
            Have feedback, feature ideas, or need help with the Pharmacy
            Management System? Use the form to send a message or reach us
            directly using the contact details.
          </p>

          <ul className="list-unstyled mt-3 text-muted">
            <li>
              <strong>Email:</strong> support@smartpharmacy.local
            </li>
            <li>
              <strong>Phone:</strong> +977‑9800000000
            </li>
            <li>
              <strong>Address:</strong> Your pharmacy / institution address
            </li>
          </ul>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Send us a message</h5>
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    className="form-control"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Message</label>
                  <textarea
                    name="message"
                    className="form-control"
                    rows="4"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary px-4">
                    Submit
                  </button>
                </div>
                {status && (
                  <div className="col-12">
                    <div className="alert alert-success py-2 mb-0">
                      {status}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
