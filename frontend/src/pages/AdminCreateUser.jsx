// import React, { useState } from "react";

// const API_BASE_URL = "http://localhost:5000/api/admin";

// const AdminCreateUser = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [role, setRole] = useState("staff");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     if (!name || !email || !password || !confirmPassword) {
//       setError("Please fill all required fields.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/users`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         body: JSON.stringify({ name, email, password, role, phone }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setError(data.message || "Failed to create user.");
//       } else {
//         setMessage("User created successfully.");
//         setName("");
//         setEmail("");
//         setPhone("");
//         setRole("staff");
//         setPassword("");
//         setConfirmPassword("");
//       }
//     } catch (err) {
//       setError("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="container my-4 p-4 shadow rounded bg-white"
//       style={{
//         maxWidth: "520px",
//         fontFamily: "Poppins, system-ui, sans-serif",
//       }}
//     >
//       <h2 className="text-center mb-4 text-success fw-semibold">
//         Create User (Admin)
//       </h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Full Name"
//           className="form-control mb-3"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           disabled={loading}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           className="form-control mb-3"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           disabled={loading}
//         />
//         <input
//           type="text"
//           placeholder="Phone (optional)"
//           className="form-control mb-3"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           disabled={loading}
//         />
//         <select
//           className="form-select mb-3"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           disabled={loading}
//         >
//           <option value="staff">Staff</option>
//           <option value="pharmacist">Pharmacist</option>
//         </select>
//         <input
//           type="password"
//           placeholder="Password"
//           className="form-control mb-3"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           disabled={loading}
//         />
//         <input
//           type="password"
//           placeholder="Confirm Password"
//           className="form-control mb-3"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//           disabled={loading}
//         />
//         <button
//           type="submit"
//           className="btn btn-success w-100 fw-semibold"
//           disabled={loading}
//         >
//           {loading ? "Creating..." : "Create User"}
//         </button>
//       </form>

//       {error && (
//         <p className="mt-3 text-danger text-center" role="alert">
//           {error}
//         </p>
//       )}
//       {message && (
//         <p className="mt-3 text-success text-center" role="alert">
//           {message}
//         </p>
//       )}
//     </div>
//   );
// };

// export default AdminCreateUser;

import React, { useState } from "react";

// ✅ UPDATED: Point to the correct base API URL (Backend runs on port 5000)
const API_BASE_URL = "http://localhost:5000/api";

const AdminCreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("staff");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Basic Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // ✅ UPDATED: The route is now POST /api/users (based on your server.js)
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        // Sending the role is crucial so the backend knows it's not a regular customer
        body: JSON.stringify({ name, email, password, role, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create user.");
      } else {
        setMessage(`User (${role}) created successfully!`);
        // Clear Form
        setName("");
        setEmail("");
        setPhone("");
        setRole("staff");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Create User Error:", err);
      setError("Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container my-5 p-4 shadow rounded bg-white"
      style={{
        maxWidth: "520px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h2 className="text-center mb-4 text-primary fw-bold">
        <i className="bi bi-person-plus-fill me-2"></i>Create New User
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Email Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Email Address</label>
          <input
            type="email"
            placeholder="name@example.com"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Phone Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Phone (Optional)</label>
          <input
            type="text"
            placeholder="98XXXXXXXX"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Role Selection */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Assign Role</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
          >
            <option value="staff">Staff</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Password Fields */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-100 fw-bold py-2 mt-2"
          disabled={loading}
        >
          {loading ? (
            <span>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Creating...
            </span>
          ) : (
            "Create User"
          )}
        </button>
      </form>

      {/* Messages */}
      {error && (
        <div className="alert alert-danger mt-3 text-center" role="alert">
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          {error}
        </div>
      )}
      {message && (
        <div className="alert alert-success mt-3 text-center" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {message}
        </div>
      )}
    </div>
  );
};

export default AdminCreateUser;
