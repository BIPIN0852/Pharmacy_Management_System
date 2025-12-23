import React from "react";
import AdminCreateUser from "../components/Admin/AdminCreateUser";

const AdminUsers = () => {
  return (
    <div className="container-fluid">
      <h3 className="mb-4 fw-bold">Users Management</h3>
      <AdminCreateUser />
    </div>
  );
};

export default AdminUsers;
