// import React from "react";

// const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
//   return (
//     <div className="row checkout-steps d-flex justify-content-center mb-4">
//       <div className={`col-3 ${step1 ? "text-primary fw-bold" : "text-muted"}`}>
//         Sign In
//       </div>
//       <div className={`col-3 ${step2 ? "text-primary fw-bold" : "text-muted"}`}>
//         Shipping
//       </div>
//       <div className={`col-3 ${step3 ? "text-primary fw-bold" : "text-muted"}`}>
//         Payment
//       </div>
//       <div className={`col-3 ${step4 ? "text-primary fw-bold" : "text-muted"}`}>
//         Place Order
//       </div>
//     </div>
//   );
// };

// export default CheckoutSteps;

import React from "react";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="checkout-steps-container mb-5">
      <div className="d-flex justify-content-center align-items-center flex-wrap gap-4">
        {/* Step 1: Sign In */}
        <div
          className={`text-center step-item p-3 ${step1 ? "active-step" : ""}`}
        >
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 step-circle 
            ${
              step1
                ? "bg-primary text-white shadow-lg"
                : "bg-light border border-secondary-subtle shadow-sm"
            }`}
          >
            <span className="fw-bold fs-6">1</span>
          </div>
          <div
            className={`fw-semibold ${step1 ? "text-primary" : "text-muted"}`}
          >
            Sign In
          </div>
          <small className="d-block text-muted">Login/Guest</small>
        </div>

        {/* Step 2: Shipping */}
        <div
          className={`text-center step-item p-3 ${step2 ? "active-step" : ""}`}
        >
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 step-circle 
            ${
              step2
                ? "bg-primary text-white shadow-lg"
                : "bg-light border border-secondary-subtle shadow-sm"
            }`}
          >
            <span className="fw-bold fs-6">2</span>
          </div>
          <div
            className={`fw-semibold ${step2 ? "text-primary" : "text-muted"}`}
          >
            Shipping
          </div>
          <small className="d-block text-muted">Address Details</small>
        </div>

        {/* Step 3: Payment */}
        <div
          className={`text-center step-item p-3 ${step3 ? "active-step" : ""}`}
        >
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 step-circle 
            ${
              step3
                ? "bg-primary text-white shadow-lg"
                : "bg-light border border-secondary-subtle shadow-sm"
            }`}
          >
            <span className="fw-bold fs-6">3</span>
          </div>
          <div
            className={`fw-semibold ${step3 ? "text-primary" : "text-muted"}`}
          >
            Payment
          </div>
          <small className="d-block text-muted">Choose Method</small>
        </div>

        {/* Step 4: Place Order */}
        <div
          className={`text-center step-item p-3 ${step4 ? "active-step" : ""}`}
        >
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 step-circle 
            ${
              step4
                ? "bg-success text-white shadow-lg"
                : "bg-light border border-secondary-subtle shadow-sm"
            }`}
          >
            <span className="fw-bold fs-6">✓</span>
          </div>
          <div
            className={`fw-semibold ${step4 ? "text-success" : "text-muted"}`}
          >
            Complete
          </div>
          <small className="d-block text-muted">Order Confirmed</small>
        </div>
      </div>

      {/* Bootstrap Progress Bar */}
      <div
        className="progress mt-4 mx-auto"
        style={{ maxWidth: "80%", height: "6px" }}
      >
        <div
          className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
          role="progressbar"
          style={{
            width: step1
              ? "25%"
              : step2
              ? "50%"
              : step3
              ? "75%"
              : step4
              ? "100%"
              : "0%",
          }}
        />
      </div>
    </div>
  );
};

export default CheckoutSteps;
