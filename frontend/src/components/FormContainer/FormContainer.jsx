import React from "react";

// This component provides a centered, max-width container for forms/pages.
const FormContainer = ({ children }) => {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "60vh" }}
    >
      <div className="w-100" style={{ maxWidth: 430 }}>
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
