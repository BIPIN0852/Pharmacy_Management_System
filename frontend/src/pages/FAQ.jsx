// src/pages/FAQ.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const navigate = useNavigate();

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
  ];

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

      <h1>Frequently Asked Questions</h1>
      <p className="text-muted mt-2 mb-4">
        Answers to common questions about using the pharmacy portal. If you
        cannot find what you are looking for, please contact our support team
        from the Contact Us page.
      </p>

      <div className="accordion" id="faqAccordion">
        {faqs.map((item, index) => {
          const headingId = `faq-heading-${index}`;
          const collapseId = `faq-collapse-${index}`;
          return (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header" id={headingId}>
                <button
                  className={`accordion-button ${
                    index !== 0 ? "collapsed" : ""
                  }`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${collapseId}`}
                  aria-expanded={index === 0 ? "true" : "false"}
                  aria-controls={collapseId}
                >
                  {item.q}
                </button>
              </h2>
              <div
                id={collapseId}
                className={`accordion-collapse collapse ${
                  index === 0 ? "show" : ""
                }`}
                aria-labelledby={headingId}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body text-muted">{item.a}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
