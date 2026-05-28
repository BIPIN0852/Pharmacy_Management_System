import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  // Calculate Progress Percentage for the connecting line
  const getProgressWidth = () => {
    if (step4) return "100%";
    if (step3) return "75%";
    if (step2) return "50%";
    if (step1) return "25%";
    return "0%";
  };

  const activeColor = "#007185";
  const inactiveBorder = "#D5D9D9";
  const inactiveText = "#565959";

  const StepIcon = ({
    stepNumber,
    active,
    isLast,
    label,
    subLabel,
    linkTo,
  }) => {
    const isCompleted = active && !isLast;

    const circleContent = (
      <div
        className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 step-circle bg-white"
        style={{
          border: `2px solid ${active ? activeColor : inactiveBorder}`,
          backgroundColor: active ? activeColor : "#fff",
          color: active ? "#fff" : inactiveText,
          zIndex: 2,
          position: "relative",
          transition: "all 0.3s ease",
        }}
      >
        <span className="fw-bold" style={{ fontSize: "0.95rem" }}>
          {/* Show checkmark if completed, otherwise show number */}
          {isCompleted ? <Check size={18} strokeWidth={3} /> : stepNumber}
        </span>
      </div>
    );

    return (
      <div
        className="text-center flex-fill step-item position-relative"
        style={{ zIndex: 2 }}
      >
        {isCompleted && linkTo ? (
          <Link to={linkTo} className="text-decoration-none">
            {circleContent}
          </Link>
        ) : (
          circleContent
        )}

        <div
          className="fw-bold mt-1"
          style={{
            fontSize: "0.85rem",
            color: active ? "#0F1111" : inactiveText,
          }}
        >
          {label}
        </div>
        <div
          className="d-none d-md-block"
          style={{ fontSize: "0.75rem", color: inactiveText }}
        >
          {subLabel}
        </div>
      </div>
    );
  };

  return (
    <div className="checkout-steps-container mb-4 mt-2 position-relative pt-3">
      {/* Sleek Background Connecting Line */}
      <div
        className="position-absolute w-100"
        style={{
          top: "35px",
          left: "0",
          height: "3px",
          backgroundColor: inactiveBorder,
          zIndex: 1,
        }}
      >
        {/* Active Progress Fill */}
        <div
          style={{
            height: "100%",
            backgroundColor: activeColor,
            width: getProgressWidth(),
            transition: "width 0.4s ease-in-out",
          }}
        />
      </div>

      <div className="d-flex justify-content-between align-items-center position-relative px-1 px-md-4">
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

      <style>{`
        .step-circle {
          width: 36px;
          height: 36px;
        }
        @media (max-width: 576px) {
          .step-circle { width: 28px; height: 28px; }
          .checkout-steps-container > div.position-absolute { top: 29px !important; }
        }
      `}</style>
    </div>
  );
};

export default CheckoutSteps;
