import React, { useState } from "react";

const API_BASE_URL = "http://localhost:5000/api/admin";

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
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name, email, password, role, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create user.");
      } else {
        setMessage("User created successfully.");
        setName("");
        setEmail("");
        setPhone("");
        setRole("staff");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container my-4 p-4 shadow rounded bg-white"
      style={{
        maxWidth: "520px",
        fontFamily: "Poppins, system-ui, sans-serif",
      }}
    >
      <h2 className="text-center mb-4 text-success fw-semibold">
        Create User (Admin)
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Phone (optional)"
          className="form-control mb-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
        />
        <select
          className="form-select mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={loading}
        >
          <option value="staff">Staff</option>
          <option value="pharmacist">Pharmacist</option>
        </select>
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="form-control mb-3"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-success w-100 fw-semibold"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-danger text-center" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-3 text-success text-center" role="alert">
          {message}
        </p>
      )}
    </div>
  );
};

export default AdminCreateUser;
