// // src/pages/Contact.jsx
// import React, { useState } from "react";

// const Contact = () => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });
//   const [status, setStatus] = useState("");

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // For now just fake a submit
//     setStatus("Thank you for reaching out. Your message has been recorded.");
//     setForm({ name: "", email: "", subject: "", message: "" });
//   };

//   return (
//     <div className="container py-5">
//       <div className="row gy-4">
//         <div className="col-lg-6">
//           <h1>Contact Us</h1>
//           <p className="text-muted mt-3">
//             Have feedback, feature ideas, or need help with the Pharmacy
//             Management System? Use the form to send a message or reach us
//             directly using the contact details.
//           </p>

//           <ul className="list-unstyled mt-3 text-muted">
//             <li>
//               <strong>Email:</strong> support@smartpharmacy.local
//             </li>
//             <li>
//               <strong>Phone:</strong> +977‑9800000000
//             </li>
//             <li>
//               <strong>Address:</strong> Your pharmacy / institution address
//             </li>
//           </ul>
//         </div>

//         <div className="col-lg-6">
//           <div className="card shadow-sm border-0">
//             <div className="card-body">
//               <h5 className="fw-semibold mb-3">Send us a message</h5>
//               <form onSubmit={handleSubmit} className="row g-3">
//                 <div className="col-md-6">
//                   <label className="form-label">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     className="form-control"
//                     value={form.name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     className="form-control"
//                     value={form.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="col-12">
//                   <label className="form-label">Subject</label>
//                   <input
//                     type="text"
//                     name="subject"
//                     className="form-control"
//                     value={form.subject}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="col-12">
//                   <label className="form-label">Message</label>
//                   <textarea
//                     name="message"
//                     className="form-control"
//                     rows="4"
//                     value={form.message}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="col-12 d-flex justify-content-end">
//                   <button type="submit" className="btn btn-primary px-4">
//                     Submit
//                   </button>
//                 </div>
//                 {status && (
//                   <div className="col-12">
//                     <div className="alert alert-success py-2 mb-0">
//                       {status}
//                     </div>
//                   </div>
//                 )}
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setLoading(false);

      // Clear success message after 5 seconds
      setTimeout(() => setStatus(null), 5000);
    }, 1500);
  };

  return (
    <div className="container py-5 fade-in">
      {/* Header */}
      <div
        className="text-center mb-5"
        style={{ maxWidth: "700px", margin: "0 auto" }}
      >
        <div className="d-inline-flex align-items-center justify-content-center p-3 bg-primary bg-opacity-10 text-primary rounded-circle mb-3">
          <MessageSquare size={24} />
        </div>
        <h1 className="fw-bold mb-3">Get in Touch</h1>
        <p className="text-muted lead fs-6">
          Have feedback, feature ideas, or need help with the Pharmacy
          Management System? We'd love to hear from you.
        </p>
      </div>

      <div className="row g-5">
        {/* Left Column: Contact Info */}
        <div className="col-lg-5">
          <div className="d-flex flex-column gap-4">
            {/* Contact Cards */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 d-flex align-items-start gap-3">
                <div className="bg-primary text-white p-2 rounded-2">
                  <Mail size={20} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Email Us</h6>
                  <p className="text-muted small mb-1">
                    Our friendly team is here to help.
                  </p>
                  <a
                    href="mailto:support@smartpharmacy.local"
                    className="text-primary text-decoration-none fw-medium"
                  >
                    support@smartpharmacy.local
                  </a>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 d-flex align-items-start gap-3">
                <div className="bg-success text-white p-2 rounded-2">
                  <Phone size={20} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Call Us</h6>
                  <p className="text-muted small mb-1">
                    Mon-Fri from 8am to 5pm.
                  </p>
                  <a
                    href="tel:+9779800000000"
                    className="text-success text-decoration-none fw-medium"
                  >
                    +977‑9800000000
                  </a>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 d-flex align-items-start gap-3">
                <div className="bg-danger text-white p-2 rounded-2">
                  <MapPin size={20} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Visit Us</h6>
                  <p className="text-muted small mb-1">
                    Come say hello at our office HQ.
                  </p>
                  <span className="text-dark small">
                    123 Health Street, Bagmati Province,
                    <br />
                    Kageshwori Manohara, Nepal
                  </span>
                </div>
              </div>
            </div>

            {/* Operating Hours Snippet */}
            <div className="p-4 bg-light rounded-3 border border-light-subtle">
              <div className="d-flex align-items-center gap-2 mb-3 text-muted">
                <Clock size={18} />
                <span className="fw-semibold">Operating Hours</span>
              </div>
              <ul className="list-unstyled small mb-0 text-secondary d-flex flex-column gap-2">
                <li className="d-flex justify-content-between">
                  <span>Monday - Friday</span>
                  <span className="fw-medium text-dark">
                    08:00 AM - 08:00 PM
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>Saturday</span>
                  <span className="fw-medium text-dark">
                    09:00 AM - 06:00 PM
                  </span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>Sunday</span>
                  <span className="fw-medium text-danger">Closed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="col-lg-7">
          <div className="card shadow border-0 h-100">
            <div className="card-body p-4 p-md-5">
              <h4 className="fw-bold mb-4">Send us a message</h4>

              {status === "success" ? (
                <div
                  className="alert alert-success d-flex align-items-center gap-3 py-4"
                  role="alert"
                >
                  <CheckCircle size={24} />
                  <div>
                    <strong>Message Sent!</strong>
                    <br />
                    Thank you for reaching out. We'll get back to you shortly.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium small">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control bg-light border-0 py-2"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium small">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control bg-light border-0 py-2"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium small">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control bg-light border-0 py-2"
                      placeholder="How can we help?"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium small">
                      Message
                    </label>
                    <textarea
                      name="message"
                      className="form-control bg-light border-0"
                      rows="5"
                      placeholder="Tell us more about your inquiry..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary px-5 py-2 fw-medium rounded-pill d-flex align-items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            aria-hidden="true"
                          ></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message <Send size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
