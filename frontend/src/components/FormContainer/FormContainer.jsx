// import React from "react";

// // This component provides a centered, max-width container for forms/pages.
// const FormContainer = ({ children }) => {
//   return (
//     <div
//       className="container d-flex justify-content-center align-items-center"
//       style={{ minHeight: "60vh" }}
//     >
//       <div className="w-100" style={{ maxWidth: 430 }}>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default FormContainer;

import React from "react";

const FormContainer = ({ children, title }) => {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }} // Increased height for better vertical centering
    >
      <div
        className="card shadow-lg p-4 border-0 rounded-4 w-100 bg-white"
        style={{ maxWidth: "450px" }} // Slightly wider for better spacing
      >
        {/* Optional Title Prop for consistency */}
        {title && (
          <h3 className="text-center mb-4 fw-bold text-primary">{title}</h3>
        )}

        {children}
      </div>
    </div>
  );
};

export default FormContainer;
