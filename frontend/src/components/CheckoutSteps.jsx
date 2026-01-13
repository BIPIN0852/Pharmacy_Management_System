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

// import React from "react";

// const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
//   return (
//     <div className="checkout-steps-container mb-5">
//       <div className="d-flex justify-content-center align-items-center flex-wrap gap-4">
//         {/* Step 1: Sign In */}
//         <div
//           className={`text-center step-item p-3 ${step1 ? "active-step" : ""}`}
//         >
//           <div
//             className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 step-circle
//             ${
//               step1
//                 ? "bg-primary text-white shadow-lg"
//                 : "bg-light border border-secondary-subtle shadow-sm"
//             }`}
//           >
//             <span className="fw-bold fs-6">1</span>
//           </div>
//           <div
//             className={`fw-semibold ${step1 ? "text-primary" : "text-muted"}`}
//           >
//             Sign In
//           </div>
//           <small className="d-block text-muted">Login/Guest</small>
//         </div>

//         {/* Step 2: Shipping */}
//         <div
//           className={`text-center step-item p-3 ${step2 ? "active-step" : ""}`}
//         >
//           <div
//             className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 step-circle
//             ${
//               step2
//                 ? "bg-primary text-white shadow-lg"
//                 : "bg-light border border-secondary-subtle shadow-sm"
//             }`}
//           >
//             <span className="fw-bold fs-6">2</span>
//           </div>
//           <div
//             className={`fw-semibold ${step2 ? "text-primary" : "text-muted"}`}
//           >
//             Shipping
//           </div>
//           <small className="d-block text-muted">Address Details</small>
//         </div>

//         {/* Step 3: Payment */}
//         <div
//           className={`text-center step-item p-3 ${step3 ? "active-step" : ""}`}
//         >
//           <div
//             className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 step-circle
//             ${
//               step3
//                 ? "bg-primary text-white shadow-lg"
//                 : "bg-light border border-secondary-subtle shadow-sm"
//             }`}
//           >
//             <span className="fw-bold fs-6">3</span>
//           </div>
//           <div
//             className={`fw-semibold ${step3 ? "text-primary" : "text-muted"}`}
//           >
//             Payment
//           </div>
//           <small className="d-block text-muted">Choose Method</small>
//         </div>

//         {/* Step 4: Place Order */}
//         <div
//           className={`text-center step-item p-3 ${step4 ? "active-step" : ""}`}
//         >
//           <div
//             className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 step-circle
//             ${
//               step4
//                 ? "bg-success text-white shadow-lg"
//                 : "bg-light border border-secondary-subtle shadow-sm"
//             }`}
//           >
//             <span className="fw-bold fs-6">✓</span>
//           </div>
//           <div
//             className={`fw-semibold ${step4 ? "text-success" : "text-muted"}`}
//           >
//             Complete
//           </div>
//           <small className="d-block text-muted">Order Confirmed</small>
//         </div>
//       </div>

//       {/* Bootstrap Progress Bar */}
//       <div
//         className="progress mt-4 mx-auto"
//         style={{ maxWidth: "80%", height: "6px" }}
//       >
//         <div
//           className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
//           role="progressbar"
//           style={{
//             width: step1
//               ? "25%"
//               : step2
//               ? "50%"
//               : step3
//               ? "75%"
//               : step4
//               ? "100%"
//               : "0%",
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default CheckoutSteps;

import React from "react";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  // Calculate Progress Percentage
  const getProgressWidth = () => {
    if (step4) return "100%";
    if (step3) return "75%";
    if (step2) return "50%";
    if (step1) return "25%";
    return "0%";
  };

  const StepIcon = ({
    stepNumber,
    active,
    isLast,
    label,
    subLabel,
    linkTo,
  }) => (
    <div
      className={`text-center flex-fill step-item ${
        active ? "active-step" : ""
      }`}
    >
      {active && !isLast ? (
        <Link to={linkTo} className="text-decoration-none">
          <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 step-circle bg-primary text-white shadow-lg pulse-animation">
            <span className="fw-bold fs-6">{stepNumber}</span>
          </div>
        </Link>
      ) : (
        <div
          className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 step-circle 
          ${
            active
              ? isLast
                ? "bg-success text-white shadow-lg"
                : "bg-primary text-white shadow-lg"
              : "bg-light border border-secondary-subtle"
          }`}
        >
          <span className="fw-bold fs-6">
            {isLast && active ? "✓" : stepNumber}
          </span>
        </div>
      )}

      <div
        className={`fw-bold small ${
          active ? (isLast ? "text-success" : "text-primary") : "text-muted"
        }`}
      >
        {label}
      </div>
      <small
        className="d-none d-md-block text-muted"
        style={{ fontSize: "0.7rem" }}
      >
        {subLabel}
      </small>
    </div>
  );

  return (
    <div className="checkout-steps-container mb-5 mt-3">
      <div className="d-flex justify-content-between align-items-center position-relative px-2 px-md-5">
        <StepIcon
          stepNumber="1"
          active={step1}
          label="Sign In"
          subLabel="Account Access"
          linkTo="/login"
        />

        <StepIcon
          stepNumber="2"
          active={step2}
          label="Shipping"
          subLabel="Delivery Address"
          linkTo="/shipping"
        />

        <StepIcon
          stepNumber="3"
          active={step3}
          label="Payment"
          subLabel="Transaction"
          linkTo="/payment"
        />

        <StepIcon
          stepNumber="4"
          active={step4}
          isLast={true}
          label="Review"
          subLabel="Place Order"
          linkTo="/placeorder"
        />
      </div>

      {/* Progress Bar Container */}
      <div
        className="progress mt-4 mx-auto shadow-sm"
        style={{ maxWidth: "85%", height: "8px", borderRadius: "10px" }}
      >
        <div
          className={`progress-bar progress-bar-striped progress-bar-animated ${
            step4 ? "bg-success" : "bg-primary"
          }`}
          role="progressbar"
          style={{
            width: getProgressWidth(),
            transition: "width 0.5s ease-in-out",
          }}
        />
      </div>

      <style>{`
        .step-circle {
          width: 40px;
          height: 40px;
          transition: all 0.3s ease;
        }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(13, 110, 253, 0); }
          100% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0); }
        }
        @media (max-width: 576px) {
          .step-circle { width: 30px; height: 30px; font-size: 0.8rem; }
        }
      `}</style>
    </div>
  );
};

export default CheckoutSteps;
