// import React from "react";
// import AdminCreateUser from "../components/Admin/AdminCreateUser";

// const AdminUsers = () => {
//   return (
//     <div className="container-fluid">
//       <h3 className="mb-4 fw-bold">Users Management</h3>
//       <AdminCreateUser />
//     </div>
//   );
// };

// export default AdminUsers;

// import React, { useEffect, useState } from "react";
// import AdminCreateUser from "../components/Admin/AdminCreateUser"; // Assuming this exists
// import api from "../services/api"; // ✅ Uses interceptor
// import { Trash2, RefreshCw, User, Shield, ShieldCheck } from "lucide-react";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Fetch all users
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       // ✅ Assuming GET /api/users returns all users for admin
//       // You might need to check your backend route: usually router.get('/', protect, admin, getUsers)
//       const res = await api.get("/users");
//       setUsers(res.data || []);
//       setError("");
//     } catch (err) {
//       console.error("Fetch users error:", err);
//       setError("Failed to load users list.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Delete User Handler
//   const handleDeleteUser = async (id) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this user? This action cannot be undone."
//       )
//     ) {
//       return;
//     }

//     try {
//       await api.delete(`/users/${id}`); // ✅ Assuming DELETE /api/users/:id exists
//       setSuccess("User deleted successfully.");
//       setUsers(users.filter((user) => user._id !== id));
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       console.error("Delete error:", err);
//       setError(err.response?.data?.message || "Failed to delete user.");
//     }
//   };

//   // Helper for Role Badge
//   const getRoleBadge = (role) => {
//     switch (role) {
//       case "admin":
//         return (
//           <span className="badge bg-danger">
//             <ShieldCheck size={12} className="me-1" /> Admin
//           </span>
//         );
//       case "pharmacist":
//         return (
//           <span className="badge bg-success">
//             <Shield size={12} className="me-1" /> Pharmacist
//           </span>
//         );
//       case "doctor":
//         return (
//           <span className="badge bg-info text-dark">
//             <Stethoscope size={12} className="me-1" /> Doctor
//           </span>
//         );
//       default:
//         return (
//           <span className="badge bg-secondary">
//             <User size={12} className="me-1" /> Customer
//           </span>
//         );
//     }
//   };

//   return (
//     <div className="container-fluid p-0">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="fw-bold mb-0">Users Management</h3>
//         <button
//           className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2"
//           onClick={fetchUsers}
//         >
//           <RefreshCw size={16} /> Refresh List
//         </button>
//       </div>

//       {/* Notifications */}
//       {error && <div className="alert alert-danger py-2">{error}</div>}
//       {success && <div className="alert alert-success py-2">{success}</div>}

//       <div className="row g-4">
//         {/* Left Column: Create User Form */}
//         <div className="col-lg-4">
//           <div className="card shadow-sm border-0 h-100">
//             <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
//               <h5 className="fw-bold mb-0">Create New User</h5>
//             </div>
//             <div className="card-body">
//               {/* Pass fetchUsers callback if AdminCreateUser supports it to auto-refresh */}
//               <AdminCreateUser onUserCreated={fetchUsers} />
//             </div>
//           </div>
//         </div>

//         {/* Right Column: User List */}
//         <div className="col-lg-8">
//           <div className="card shadow-sm border-0 h-100">
//             <div className="card-header bg-white py-3">
//               <h5 className="fw-bold mb-0">All Users ({users.length})</h5>
//             </div>
//             <div className="card-body p-0">
//               {loading ? (
//                 <div className="d-flex justify-content-center align-items-center py-5">
//                   <div
//                     className="spinner-border text-primary me-2"
//                     role="status"
//                   />
//                   <span>Loading users...</span>
//                 </div>
//               ) : users.length === 0 ? (
//                 <div className="text-center py-5 text-muted">
//                   <p>No users found.</p>
//                 </div>
//               ) : (
//                 <div
//                   className="table-responsive"
//                   style={{ maxHeight: "600px" }}
//                 >
//                   <table className="table table-hover align-middle mb-0">
//                     <thead className="bg-light sticky-top">
//                       <tr>
//                         <th className="ps-4">User Details</th>
//                         <th>Role</th>
//                         <th>Joined Date</th>
//                         <th className="text-end pe-4">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {users.map((user) => (
//                         <tr key={user._id}>
//                           <td className="ps-4">
//                             <div className="fw-bold text-dark">{user.name}</div>
//                             <div className="small text-muted">{user.email}</div>
//                           </td>
//                           <td className="text-capitalize">
//                             {getRoleBadge(user.role)}
//                           </td>
//                           <td className="small text-muted">
//                             {user.createdAt
//                               ? new Date(user.createdAt).toLocaleDateString()
//                               : "-"}
//                           </td>
//                           <td className="text-end pe-4">
//                             <button
//                               className="btn btn-sm btn-outline-danger border-0"
//                               onClick={() => handleDeleteUser(user._id)}
//                               title="Delete User"
//                             >
//                               <Trash2 size={18} />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminUsers;
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

      // ✅ FIX: Extract data regardless of whether it's wrapped in an object or a flat array
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
          "Delete failed: " + (err.response?.data?.message || "Server error")
        );
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                          <span
                            className={`badge rounded-pill px-3 py-2 border ${
                              u.role === "admin"
                                ? "bg-danger-subtle text-danger border-danger-subtle"
                                : u.role === "pharmacist"
                                ? "bg-success-subtle text-success border-success-subtle"
                                : "bg-info-subtle text-info border-info-subtle"
                            }`}
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
