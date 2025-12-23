// import React, { useState, useEffect } from "react";
// import api from "../services/api";

// const AdminCustomers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [pagination, setPagination] = useState({});
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [editForm, setEditForm] = useState({});

//   const fetchCustomers = async (pageNum = 1, searchQuery = "") => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       const params = new URLSearchParams({
//         page: pageNum,
//         limit: 15,
//         ...(searchQuery && { search: searchQuery }),
//       });

//       const res = await api.get(`/admin/customers?${params}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setCustomers(res.data.customers || []);
//       setPagination(res.data.pagination || {});
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to load customers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers(1, search);
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setPage(1);
//     fetchCustomers(1, search);
//   };

//   const handlePageChange = (newPage) => {
//     fetchCustomers(newPage, search);
//     setPage(newPage);
//   };

//   const openEditModal = (customer) => {
//     setSelectedCustomer(customer);
//     setEditForm({
//       allergies: customer.allergies?.join(", ") || "",
//       notes: customer.notes || "",
//       loyaltyPoints: customer.loyaltyPoints || 0,
//       preferredContact: customer.preferredContact || "email",
//     });
//     setShowEditModal(true);
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setError("");
//       const token = localStorage.getItem("token");
//       const payload = {
//         allergies: editForm.allergies
//           ? editForm.allergies
//               .split(",")
//               .map((s) => s.trim())
//               .filter(Boolean)
//           : [],
//         notes: editForm.notes,
//         loyaltyPoints: Number(editForm.loyaltyPoints),
//         preferredContact: editForm.preferredContact,
//       };

//       await api.put(`/admin/customers/${selectedCustomer._id}`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setSuccess("Customer updated successfully");
//       setShowEditModal(false);
//       fetchCustomers(page, search);

//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update customer");
//     }
//   };

//   const getStatusBadge = (customer) => {
//     if (customer.loyaltyPoints >= 100) return "badge bg-success";
//     if (customer.loyaltyPoints >= 50) return "badge bg-warning text-dark";
//     return "badge bg-secondary";
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-50">
//         <div className="spinner-border text-primary me-2" />
//         <span>Loading customers...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
//         <h3 className="fw-bold mb-0">Customers ({pagination.total || 0})</h3>
//         <div className="d-flex gap-2">
//           <form onSubmit={handleSearch} className="d-flex">
//             <input
//               type="search"
//               className="form-control form-control-sm"
//               style={{ maxWidth: 300 }}
//               placeholder="Search by name, email, phone..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <button
//               className="btn btn-outline-secondary btn-sm ms-1"
//               type="submit"
//             >
//               Search
//             </button>
//           </form>
//         </div>
//       </div>

//       {error && (
//         <div className="alert alert-danger py-2 mb-3" role="alert">
//           {error}
//         </div>
//       )}
//       {success && (
//         <div className="alert alert-success py-2 mb-3" role="alert">
//           {success}
//         </div>
//       )}

//       {customers.length === 0 ? (
//         <div className="text-center py-5">
//           <p className="text-muted mb-0">No customers found</p>
//           {search && (
//             <small className="text-muted">
//               Try adjusting your search terms
//             </small>
//           )}
//         </div>
//       ) : (
//         <>
//           <div className="table-responsive mb-4">
//             <table className="table table-hover align-middle">
//               <thead className="table-light">
//                 <tr>
//                   <th>Customer</th>
//                   <th>Contact</th>
//                   <th>Stats</th>
//                   <th>Allergies</th>
//                   <th>Total Spent</th>
//                   <th>Last Purchase</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {customers.map((customer) => (
//                   <tr key={customer._id}>
//                     <td>
//                       <div className="fw-bold">{customer.name}</div>
//                       <small className="text-muted">{customer.email}</small>
//                     </td>
//                     <td>
//                       {customer.phone || <span className="text-muted">-</span>}
//                     </td>
//                     <td>
//                       <div className={getStatusBadge(customer)}>
//                         {customer.loyaltyPoints} pts
//                       </div>
//                       <small className="text-muted">
//                         {customer.preferredContact}
//                       </small>
//                     </td>
//                     <td>
//                       {customer.allergies?.length > 0 ? (
//                         <span className="badge bg-danger">
//                           {customer.allergies.length} allergy
//                           {customer.allergies.length > 1 ? "s" : ""}
//                         </span>
//                       ) : (
//                         <span className="text-muted small">None</span>
//                       )}
//                     </td>
//                     <td>
//                       <strong>
//                         Rs. {Number(customer.totalSpent || 0).toLocaleString()}
//                       </strong>
//                     </td>
//                     <td>
//                       {customer.lastPurchaseDate ? (
//                         <span className="small">
//                           {new Date(
//                             customer.lastPurchaseDate
//                           ).toLocaleDateString()}
//                         </span>
//                       ) : (
//                         <span className="text-muted small">Never</span>
//                       )}
//                     </td>
//                     <td>
//                       <div className="btn-group btn-group-sm" role="group">
//                         <button
//                           className="btn btn-outline-primary"
//                           onClick={() => openEditModal(customer)}
//                           title="Edit profile"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="btn btn-outline-info"
//                           title="View history"
//                         >
//                           History
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {pagination.pages > 1 && (
//             <nav>
//               <ul className="pagination pagination-sm justify-content-center">
//                 <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
//                   <button
//                     className="page-link"
//                     onClick={() => handlePageChange(page - 1)}
//                     disabled={page === 1}
//                   >
//                     Previous
//                   </button>
//                 </li>
//                 {Array.from(
//                   { length: Math.min(5, pagination.pages) },
//                   (_, i) => {
//                     const pageNum = page > 2 ? page - 2 + i : i + 1;
//                     return (
//                       <li
//                         key={pageNum}
//                         className={`page-item ${
//                           page === pageNum ? "active" : ""
//                         }`}
//                       >
//                         <button
//                           className="page-link"
//                           onClick={() => handlePageChange(pageNum)}
//                         >
//                           {pageNum}
//                         </button>
//                       </li>
//                     );
//                   }
//                 )}
//                 <li
//                   className={`page-item ${
//                     page === pagination.pages ? "disabled" : ""
//                   }`}
//                 >
//                   <button
//                     className="page-link"
//                     onClick={() => handlePageChange(page + 1)}
//                     disabled={page === pagination.pages}
//                   >
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//           )}
//         </>
//       )}

//       {/* Edit Customer Modal */}
//       {showEditModal && (
//         <div
//           className="modal fade show d-block position-fixed top-0 start-0 w-100 h-100 p-4"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
//           tabIndex="-1"
//         >
//           <div className="modal-dialog modal-lg modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title fw-bold">
//                   Edit Customer: {selectedCustomer?.name}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowEditModal(false)}
//                 />
//               </div>
//               <form onSubmit={handleEditSubmit}>
//                 <div className="modal-body">
//                   <div className="row g-3">
//                     <div className="col-md-6">
//                       <label className="form-label fw-medium">Allergies</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="penicillin, nuts, shellfish"
//                         value={editForm.allergies}
//                         onChange={(e) =>
//                           setEditForm({
//                             ...editForm,
//                             allergies: e.target.value,
//                           })
//                         }
//                       />
//                       <div className="form-text">
//                         Comma-separated list (e.g., penicillin, nuts)
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label fw-medium">
//                         Loyalty Points
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={editForm.loyaltyPoints || 0}
//                         onChange={(e) =>
//                           setEditForm({
//                             ...editForm,
//                             loyaltyPoints: Number(e.target.value) || 0,
//                           })
//                         }
//                         min="0"
//                       />
//                     </div>
//                   </div>
//                   <div className="row g-3 mt-2">
//                     <div className="col-md-6">
//                       <label className="form-label fw-medium">
//                         Contact Preference
//                       </label>
//                       <select
//                         className="form-select"
//                         value={editForm.preferredContact || "email"}
//                         onChange={(e) =>
//                           setEditForm({
//                             ...editForm,
//                             preferredContact: e.target.value,
//                           })
//                         }
//                       >
//                         <option value="email">Email</option>
//                         <option value="sms">SMS</option>
//                         <option value="phone">Phone Call</option>
//                         <option value="none">No notifications</option>
//                       </select>
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label fw-medium">
//                         Prescription Count
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={selectedCustomer?.prescriptionCount || 0}
//                         disabled
//                         readOnly
//                       />
//                     </div>
//                   </div>
//                   <div className="mt-3">
//                     <label className="form-label fw-medium">Notes</label>
//                     <textarea
//                       className="form-control"
//                       rows="3"
//                       placeholder="Special instructions, medical notes..."
//                       value={editForm.notes || ""}
//                       onChange={(e) =>
//                         setEditForm({
//                           ...editForm,
//                           notes: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-outline-secondary"
//                     onClick={() => setShowEditModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button type="submit" className="btn btn-primary">
//                     Save Changes
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminCustomers;

import React, { useState, useEffect } from "react";
import api from "../services/api";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchCustomers = async (pageNum = 1, searchQuery = "") => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: pageNum,
        limit: 15,
        ...(searchQuery && { search: searchQuery }),
      });

      // ✅ UPDATED PATH: /customers/admin
      const res = await api.get(`/customers/admin?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCustomers(res.data.customers || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers(1, search);
  };

  const handlePageChange = (newPage) => {
    fetchCustomers(newPage, search);
    setPage(newPage);
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      allergies: customer.allergies?.join(", ") || "",
      notes: customer.notes || "",
      loyaltyPoints: customer.loyaltyPoints || 0,
      preferredContact: customer.preferredContact || "email",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const token = localStorage.getItem("token");
      const payload = {
        allergies: editForm.allergies
          ? editForm.allergies
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        notes: editForm.notes,
        loyaltyPoints: Number(editForm.loyaltyPoints),
        preferredContact: editForm.preferredContact,
      };

      // ✅ UPDATED PATH: /customers/admin/:id
      await api.put(`/customers/admin/${selectedCustomer._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Customer updated successfully");
      setShowEditModal(false);
      fetchCustomers(page, search);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update customer");
    }
  };

  const getStatusBadge = (customer) => {
    if (customer.loyaltyPoints >= 100) return "badge bg-success";
    if (customer.loyaltyPoints >= 50) return "badge bg-warning text-dark";
    return "badge bg-secondary";
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-50">
        <div className="spinner-border text-primary me-2" />
        <span>Loading customers...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3 className="fw-bold mb-0">Customers ({pagination.total || 0})</h3>
        <div className="d-flex gap-2">
          <form onSubmit={handleSearch} className="d-flex">
            <input
              type="search"
              className="form-control form-control-sm"
              style={{ maxWidth: 300 }}
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary btn-sm ms-1"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success py-2 mb-3" role="alert">
          {success}
        </div>
      )}

      {customers.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted mb-0">No customers found</p>
          {search && (
            <small className="text-muted">
              Try adjusting your search terms
            </small>
          )}
        </div>
      ) : (
        <>
          <div className="table-responsive mb-4">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Stats</th>
                  <th>Allergies</th>
                  <th>Total Spent</th>
                  <th>Last Purchase</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>
                      <div className="fw-bold">{customer.name}</div>
                      <small className="text-muted">{customer.email}</small>
                    </td>
                    <td>
                      {customer.phone || <span className="text-muted">-</span>}
                    </td>
                    <td>
                      <div className={getStatusBadge(customer)}>
                        {customer.loyaltyPoints} pts
                      </div>
                      <small className="text-muted">
                        {customer.preferredContact}
                      </small>
                    </td>
                    <td>
                      {customer.allergies?.length > 0 ? (
                        <span className="badge bg-danger">
                          {customer.allergies.length} allergy
                          {customer.allergies.length > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="text-muted small">None</span>
                      )}
                    </td>
                    <td>
                      <strong>
                        Rs. {Number(customer.totalSpent || 0).toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      {customer.lastPurchaseDate ? (
                        <span className="small">
                          {new Date(
                            customer.lastPurchaseDate
                          ).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-muted small">Never</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => openEditModal(customer)}
                          title="Edit profile"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-info"
                          title="View history"
                        >
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <nav>
              <ul className="pagination pagination-sm justify-content-center">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    const pageNum = page > 2 ? page - 2 + i : i + 1;
                    return (
                      <li
                        key={pageNum}
                        className={`page-item ${
                          page === pageNum ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  }
                )}
                <li
                  className={`page-item ${
                    page === pagination.pages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pagination.pages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      {showEditModal && (
        <div
          className="modal fade show d-block position-fixed top-0 start-0 w-100 h-100 p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Edit Customer: {selectedCustomer?.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                />
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Allergies</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="penicillin, nuts, shellfish"
                        value={editForm.allergies}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            allergies: e.target.value,
                          })
                        }
                      />
                      <div className="form-text">
                        Comma-separated list (e.g., penicillin, nuts)
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">
                        Loyalty Points
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={editForm.loyaltyPoints || 0}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            loyaltyPoints: Number(e.target.value) || 0,
                          })
                        }
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="row g-3 mt-2">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">
                        Contact Preference
                      </label>
                      <select
                        className="form-select"
                        value={editForm.preferredContact || "email"}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            preferredContact: e.target.value,
                          })
                        }
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="phone">Phone Call</option>
                        <option value="none">No notifications</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">
                        Prescription Count
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={selectedCustomer?.prescriptionCount || 0}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="form-label fw-medium">Notes</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Special instructions, medical notes..."
                      value={editForm.notes || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
