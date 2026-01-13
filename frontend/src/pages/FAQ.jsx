// // src/pages/FAQ.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const FAQ = () => {
//   const navigate = useNavigate();

//   const faqs = [
//     {
//       q: "How do I create an account?",
//       a: "Go to the Register page from the home screen, choose your role (customer, pharmacist or admin) and complete the form. In a production setup you can add email or OTP verification.",
//     },
//     {
//       q: "Can I upload prescriptions online?",
//       a: "Yes. After logging in as a customer, open your dashboard and use the prescription upload section to attach a clear image and notes. The pharmacist will review it before dispensing.",
//     },
//     {
//       q: "How are roles and permissions managed?",
//       a: "The system uses role‑based access control. Admins can manage users and configuration, pharmacists handle prescriptions and inventory, and customers manage their own orders and appointments.",
//     },
//     {
//       q: "Which payment options are available?",
//       a: "The system supports demo flows for cash on delivery, Khalti and Stripe. To use real payments you must configure live API keys in the backend and follow the payment provider's onboarding steps.",
//     },
//     {
//       q: "Is my data safe and private?",
//       a: "Access is protected by login and role‑based permissions. For production, you should deploy over HTTPS, use strong passwords, and configure backups and audit logging to protect sensitive data.",
//     },
//   ];

//   return (
//     <div className="container py-5">
//       {/* Back button */}
//       <button
//         type="button"
//         className="btn btn-outline-secondary mb-4"
//         onClick={() => navigate(-1)}
//       >
//         ← Back
//       </button>

//       <h1>Frequently Asked Questions</h1>
//       <p className="text-muted mt-2 mb-4">
//         Answers to common questions about using the pharmacy portal. If you
//         cannot find what you are looking for, please contact our support team
//         from the Contact Us page.
//       </p>

//       <div className="accordion" id="faqAccordion">
//         {faqs.map((item, index) => {
//           const headingId = `faq-heading-${index}`;
//           const collapseId = `faq-collapse-${index}`;
//           return (
//             <div className="accordion-item" key={index}>
//               <h2 className="accordion-header" id={headingId}>
//                 <button
//                   className={`accordion-button ${
//                     index !== 0 ? "collapsed" : ""
//                   }`}
//                   type="button"
//                   data-bs-toggle="collapse"
//                   data-bs-target={`#${collapseId}`}
//                   aria-expanded={index === 0 ? "true" : "false"}
//                   aria-controls={collapseId}
//                 >
//                   {item.q}
//                 </button>
//               </h2>
//               <div
//                 id={collapseId}
//                 className={`accordion-collapse collapse ${
//                   index === 0 ? "show" : ""
//                 }`}
//                 aria-labelledby={headingId}
//                 data-bs-parent="#faqAccordion"
//               >
//                 <div className="accordion-body text-muted">{item.a}</div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default FAQ;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  HelpCircle,
  ChevronLeft,
  Search,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

const FAQ = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      q: "How do I create an account?",
      a: "Go to the Register page from the home screen, choose your role (customer, pharmacist or admin) and complete the form. In a production setup you can add email or OTP verification.",
    },
    {
      q: "Can I upload prescriptions online?",
      a: "Yes. After logging in as a customer, open your dashboard and use the prescription upload section to attach a clear image and notes. The pharmacist will review it before dispensing.",
    },
    {
      q: "How are roles and permissions managed?",
      a: "The system uses role‑based access control. Admins can manage users and configuration, pharmacists handle prescriptions and inventory, and customers manage their own orders and appointments.",
    },
    {
      q: "Which payment options are available?",
      a: "The system supports demo flows for cash on delivery, Khalti and Stripe. To use real payments you must configure live API keys in the backend and follow the payment provider's onboarding steps.",
    },
    {
      q: "Is my data safe and private?",
      a: "Access is protected by login and role‑based permissions. For production, you should deploy over HTTPS, use strong passwords, and configure backups and audit logging to protect sensitive data.",
    },
    {
      q: "What happens if a medicine is out of stock?",
      a: "If a medicine is out of stock, the pharmacist can mark the prescription status as 'Out of Stock' or 'Partially Filled'. Admins receive low-stock alerts on their dashboard to reorder supplies.",
    },
  ];

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="container py-5 fade-in"
      style={{ minHeight: "80vh", maxWidth: "800px" }}
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
        <div className="d-inline-flex align-items-center justify-content-center p-3 bg-info bg-opacity-10 text-info rounded-circle mb-3">
          <HelpCircle size={32} />
        </div>
        <h1 className="fw-bold mb-3">Frequently Asked Questions</h1>
        <p className="text-muted">
          Find answers to the most common questions about our Pharmacy
          Management System.
        </p>

        {/* Search Bar */}
        <div
          className="position-relative mt-4 mx-auto"
          style={{ maxWidth: "500px" }}
        >
          <Search
            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            size={20}
          />
          <input
            type="text"
            className="form-control form-control-lg ps-5 rounded-pill border-0 shadow-sm bg-light"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* FAQ List */}
      <div className="accordion" id="faqAccordion">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p>No results found for "{searchQuery}".</p>
          </div>
        ) : (
          filteredFaqs.map((item, index) => {
            const headingId = `faq-heading-${index}`;
            const collapseId = `faq-collapse-${index}`;
            return (
              <div
                className="card border-0 shadow-sm mb-3 rounded-3 overflow-hidden"
                key={index}
              >
                <h2 className="accordion-header" id={headingId}>
                  <button
                    className="accordion-button collapsed fw-semibold bg-white py-3 px-4 shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded="false"
                    aria-controls={collapseId}
                  >
                    {item.q}
                  </button>
                </h2>
                <div
                  id={collapseId}
                  className="accordion-collapse collapse"
                  aria-labelledby={headingId}
                  data-bs-parent="#faqAccordion"
                >
                  <div
                    className="accordion-body text-muted px-4 pb-4 pt-0"
                    style={{ lineHeight: "1.6" }}
                  >
                    {item.a}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Contact CTA */}
      <div className="mt-5 text-center bg-light p-4 rounded-4">
        <div className="d-flex flex-column align-items-center gap-2">
          <MessageCircle size={28} className="text-primary" />
          <h5 className="fw-bold mb-1">Still have questions?</h5>
          <p className="text-muted small mb-3">
            Can't find the answer you're looking for? Please chat to our
            friendly team.
          </p>
          <Link to="/contact" className="btn btn-primary rounded-pill px-4">
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
