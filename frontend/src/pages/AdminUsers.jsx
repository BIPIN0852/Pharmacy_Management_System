import React, { useState, useEffect } from "react";
import api from "../services/api";
import AdminCreateUser from "../components/Admin/AdminCreateUser";
import {
  Users,
  Trash2,
  Search,
  UserX,
  Mail,
  Phone as PhoneIcon,
  Shield,
} from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");

      // Extract data regardless of whether it's wrapped in an object or a flat array
      const userData = response.data?.users || response.data || response || [];
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error("Fetch users error:", err);
      setUsers([]); // Fallback to empty to prevent crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert(
          "Delete failed: " + (err.response?.data?.message || "Server error"),
        );
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ✅ Helper function to uniquely style different roles
  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-danger bg-opacity-10 text-danger border-danger border-opacity-25";
      case "doctor":
        return "bg-primary bg-opacity-10 text-primary border-primary border-opacity-25";
      case "pharmacist":
        return "bg-success bg-opacity-10 text-success border-success border-opacity-25";
      case "staff":
        return "bg-warning bg-opacity-10 text-warning border-warning border-opacity-25";
      default:
        return "bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-25";
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-3 fw-bold text-muted">Accessing Database...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="row g-4">
        {/* CREATE USER COMPONENT */}
        <div className="col-xl-4 col-lg-5">
          <AdminCreateUser onUserCreated={fetchUsers} />
        </div>

        <div className="col-xl-8 col-lg-7">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-white p-4 border-0">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Users className="text-primary" /> User Registry
                </h5>
                <div className="input-group" style={{ maxWidth: "300px" }}>
                  <span className="input-group-text bg-light border-end-0">
                    <Search size={16} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0"
                    placeholder="Search name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-uppercase fw-bold text-muted">
                    <th className="ps-4">User</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u._id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="avatar-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center rounded-circle"
                              style={{ width: "40px", height: "40px" }}
                            >
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-bold text-dark">{u.name}</div>
                              <div className="text-muted small d-flex align-items-center gap-1">
                                <Mail size={12} /> {u.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small text-dark fw-medium d-flex align-items-center gap-1">
                            <PhoneIcon size={14} className="text-muted" />
                            {u.phone || "No Phone"}
                          </div>
                        </td>
                        <td>
                          {/* ✅ Applied dynamic role badge styling */}
                          <span
                            className={`badge rounded-pill px-3 py-2 border ${getRoleBadgeStyle(u.role)}`}
                          >
                            <Shield size={12} className="me-1" />
                            {u.role?.toUpperCase()}
                          </span>
                        </td>
                        <td className="text-muted small">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="text-end pe-4">
                          <button
                            className="btn btn-outline-danger btn-sm border-0 rounded-circle p-2"
                            onClick={() => handleDelete(u._id, u.name)}
                            disabled={u.role === "admin"}
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <UserX
                          size={48}
                          className="text-muted opacity-25 mb-2"
                        />
                        <p className="text-muted">
                          No users found in database.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="card-footer bg-white border-0 py-3 ps-4">
              <small className="text-muted">
                Total Users: {filteredUsers.length}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
