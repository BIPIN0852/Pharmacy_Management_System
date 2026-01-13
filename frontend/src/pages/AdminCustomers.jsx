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

//       // ✅ UPDATED PATH: /customers/admin
//       const res = await api.get(`/customers/admin?${params.toString()}`, {
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
//     // eslint-disable-next-line react-hooks/exhaustive-deps
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

//       // ✅ UPDATED PATH: /customers/admin/:id
//       await api.put(`/customers/admin/${selectedCustomer._id}`, payload, {
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

// import React, { useState, useEffect } from "react";
// import api from "../services/api"; // ✅ Uses interceptor for Authorization header

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

//   // Fetch Customers
//   const fetchCustomers = async (pageNum = 1, searchQuery = "") => {
//     try {
//       setLoading(true);
//       setError("");

//       const params = new URLSearchParams({
//         page: pageNum,
//         limit: 15,
//         search: searchQuery,
//       });

//       // ✅ Call API (Interceptor handles the Token)
//       const res = await api.get(`/customers/admin?${params.toString()}`);

//       setCustomers(res.data.customers || []);
//       setPagination(res.data.pagination || {});
//     } catch (err) {
//       console.error("Fetch customers error:", err);
//       setError(
//         err.response?.data?.message ||
//           (err.response?.status === 403
//             ? "Access Denied: Admin only"
//             : "Failed to load customers")
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers(1, search);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setPage(1);
//     fetchCustomers(1, search);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     fetchCustomers(newPage, search);
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

//       // ✅ API Put Request
//       await api.put(`/customers/admin/${selectedCustomer._id}`, payload);

//       setSuccess("Customer updated successfully");
//       setShowEditModal(false);
//       fetchCustomers(page, search); // Refresh list

//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       console.error("Update customer error:", err);
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
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ height: "60vh" }}
//       >
//         <div className="spinner-border text-primary me-2" role="status" />
//         <span>Loading customers...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid p-0">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//         <h3 className="fw-bold mb-0 text-dark">
//           Customers{" "}
//           <span className="text-muted fs-5">({pagination.total || 0})</span>
//         </h3>

//         <div className="d-flex gap-2">
//           <form onSubmit={handleSearch} className="d-flex gap-2">
//             <input
//               type="search"
//               className="form-control form-control-sm"
//               style={{ minWidth: "250px" }}
//               placeholder="Search name, email, phone..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <button className="btn btn-primary btn-sm px-3" type="submit">
//               Search
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* Alerts */}
//       {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
//       {success && (
//         <div className="alert alert-success py-2 mb-3">{success}</div>
//       )}

//       {/* Table Content */}
//       <div className="card shadow-sm border-0 rounded-3">
//         <div className="card-body p-0">
//           <div className="table-responsive">
//             <table className="table table-hover align-middle mb-0">
//               <thead className="bg-light">
//                 <tr className="text-uppercase small text-muted">
//                   <th className="py-3 ps-4">Customer</th>
//                   <th className="py-3">Contact</th>
//                   <th className="py-3">Loyalty</th>
//                   <th className="py-3">Allergies</th>
//                   <th className="py-3">Total Spent</th>
//                   <th className="py-3">Last Purchase</th>
//                   <th className="py-3 pe-4 text-end">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {customers.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="text-center py-5 text-muted">
//                       <div className="mb-2">📭</div>
//                       No customers found matching your search.
//                     </td>
//                   </tr>
//                 ) : (
//                   customers.map((customer) => (
//                     <tr key={customer._id}>
//                       <td className="ps-4">
//                         <div className="fw-bold text-dark">{customer.name}</div>
//                         <div className="small text-muted">{customer.email}</div>
//                       </td>
//                       <td>
//                         {customer.phone ? (
//                           <span className="text-dark">{customer.phone}</span>
//                         ) : (
//                           <span className="text-muted small">--</span>
//                         )}
//                         <div className="small text-muted text-capitalize">
//                           via {customer.preferredContact || "email"}
//                         </div>
//                       </td>
//                       <td>
//                         <span className={getStatusBadge(customer)}>
//                           {customer.loyaltyPoints} pts
//                         </span>
//                       </td>
//                       <td>
//                         {customer.allergies?.length > 0 ? (
//                           <span className="badge bg-danger bg-opacity-75">
//                             {customer.allergies.length} allergy
//                             {customer.allergies.length > 1 ? "s" : ""}
//                           </span>
//                         ) : (
//                           <span className="text-muted small">None</span>
//                         )}
//                       </td>
//                       <td>
//                         <span className="fw-medium">
//                           Rs.{" "}
//                           {Number(customer.totalSpent || 0).toLocaleString()}
//                         </span>
//                       </td>
//                       <td>
//                         {customer.lastPurchaseDate ? (
//                           <span className="small text-dark">
//                             {new Date(
//                               customer.lastPurchaseDate
//                             ).toLocaleDateString()}
//                           </span>
//                         ) : (
//                           <span className="text-muted small">Never</span>
//                         )}
//                       </td>
//                       <td className="pe-4 text-end">
//                         <button
//                           className="btn btn-sm btn-outline-primary"
//                           onClick={() => openEditModal(customer)}
//                         >
//                           Edit
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination Footer */}
//         {pagination.pages > 1 && (
//           <div className="card-footer bg-white border-0 py-3">
//             <nav>
//               <ul className="pagination pagination-sm justify-content-end mb-0">
//                 <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
//                   <button
//                     className="page-link border-0"
//                     onClick={() => handlePageChange(page - 1)}
//                   >
//                     Previous
//                   </button>
//                 </li>
//                 {Array.from(
//                   { length: Math.min(5, pagination.pages) },
//                   (_, i) => {
//                     // Logic to show generic page numbers nicely
//                     let pNum = i + 1;
//                     if (page > 3 && pagination.pages > 5) pNum = page - 2 + i;
//                     if (pNum > pagination.pages) return null;

//                     return (
//                       <li
//                         key={pNum}
//                         className={`page-item ${page === pNum ? "active" : ""}`}
//                       >
//                         <button
//                           className="page-link rounded-circle mx-1"
//                           style={{
//                             width: 30,
//                             height: 30,
//                             padding: 0,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                           }}
//                           onClick={() => handlePageChange(pNum)}
//                         >
//                           {pNum}
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
//                     className="page-link border-0"
//                     onClick={() => handlePageChange(page + 1)}
//                   >
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         )}
//       </div>

//       {/* Edit Modal */}
//       {showEditModal && (
//         <>
//           <div className="modal-backdrop fade show"></div>
//           <div className="modal fade show d-block" tabIndex="-1">
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content shadow">
//                 <div className="modal-header border-bottom-0">
//                   <h5 className="modal-title fw-bold">Edit Customer</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={() => setShowEditModal(false)}
//                   ></button>
//                 </div>
//                 <form onSubmit={handleEditSubmit}>
//                   <div className="modal-body">
//                     <div className="mb-3">
//                       <label className="form-label fw-bold small text-uppercase text-muted">
//                         Customer Name
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control bg-light"
//                         value={selectedCustomer?.name || ""}
//                         disabled
//                       />
//                     </div>

//                     <div className="row g-3 mb-3">
//                       <div className="col-md-6">
//                         <label className="form-label fw-medium">
//                           Loyalty Points
//                         </label>
//                         <input
//                           type="number"
//                           className="form-control"
//                           value={editForm.loyaltyPoints || 0}
//                           onChange={(e) =>
//                             setEditForm({
//                               ...editForm,
//                               loyaltyPoints: e.target.value,
//                             })
//                           }
//                           min="0"
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <label className="form-label fw-medium">
//                           Contact Method
//                         </label>
//                         <select
//                           className="form-select"
//                           value={editForm.preferredContact || "email"}
//                           onChange={(e) =>
//                             setEditForm({
//                               ...editForm,
//                               preferredContact: e.target.value,
//                             })
//                           }
//                         >
//                           <option value="email">Email</option>
//                           <option value="sms">SMS</option>
//                           <option value="phone">Phone Call</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label fw-medium">
//                         Allergies{" "}
//                         <span className="text-muted fw-normal small">
//                           (Comma separated)
//                         </span>
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="e.g. Penicillin, Peanuts"
//                         value={editForm.allergies}
//                         onChange={(e) =>
//                           setEditForm({
//                             ...editForm,
//                             allergies: e.target.value,
//                           })
//                         }
//                       />
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label fw-medium">
//                         Medical Notes
//                       </label>
//                       <textarea
//                         className="form-control"
//                         rows="3"
//                         placeholder="Add internal notes..."
//                         value={editForm.notes}
//                         onChange={(e) =>
//                           setEditForm({ ...editForm, notes: e.target.value })
//                         }
//                       />
//                     </div>
//                   </div>
//                   <div className="modal-footer border-top-0 pt-0">
//                     <button
//                       type="button"
//                       className="btn btn-light text-muted"
//                       onClick={() => setShowEditModal(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button type="submit" className="btn btn-primary px-4">
//                       Save Changes
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminCustomers;

// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Users,
//   Search,
//   Edit3,
//   Mail,
//   Phone,
//   Award,
//   AlertCircle,
//   Calendar,
//   CreditCard,
//   X,
// } from "lucide-react";

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

//   // ✅ UPDATED: Enhanced fetching logic to handle nested backend data
//   const fetchCustomers = async (pageNum = 1, searchQuery = "") => {
//     try {
//       setLoading(true);
//       setError("");

//       const params = new URLSearchParams({
//         page: pageNum,
//         limit: 15,
//         search: searchQuery,
//         role: "customer", // Ensure we only get customer data
//       });

//       const res = await api.get(`/users?${params.toString()}`);

//       // ✅ FIX: Extract data correctly from backend response structure
//       // Checks for res.data.users (standard) or res.data (flat array)
//       const data = res.data?.users || res.data?.customers || res.data || [];

//       setCustomers(Array.isArray(data) ? data : []);
//       setPagination(res.data?.pagination || { total: data.length, pages: 1 });
//     } catch (err) {
//       console.error("Fetch customers error:", err);
//       setError(err.response?.data?.message || "Database connection error");
//       setCustomers([]);
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
//     setPage(newPage);
//     fetchCustomers(newPage, search);
//   };

//   const openEditModal = (customer) => {
//     setSelectedCustomer(customer);
//     setEditForm({
//       allergies: customer.allergies || "",
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
//       await api.put(`/users/${selectedCustomer._id}`, editForm);

//       setSuccess("Customer profile updated successfully");
//       setShowEditModal(false);
//       fetchCustomers(page, search);

//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update customer");
//     }
//   };

//   const getStatusBadge = (points) => {
//     if (points >= 1000)
//       return "badge bg-success-subtle text-success border border-success-subtle";
//     if (points >= 500)
//       return "badge bg-primary-subtle text-primary border border-primary-subtle";
//     return "badge bg-secondary-subtle text-secondary border border-secondary-subtle";
//   };

//   if (loading) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-white">
//         <div className="spinner-border text-primary mb-3" role="status" />
//         <span className="fw-bold text-muted">Syncing Customer Records...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid p-0 animate-fade-in">
//       {/* Header Section */}
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//         <div>
//           <h3 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
//             <Users className="text-primary" /> Customer Registry
//           </h3>
//           <p className="text-muted small mb-0">
//             Total Records Found: {customers.length}
//           </p>
//         </div>

//         <form onSubmit={handleSearch} className="d-flex gap-2">
//           <div className="input-group input-group-sm shadow-sm border rounded-pill overflow-hidden bg-white">
//             <span className="input-group-text bg-white border-0 ps-3">
//               <Search size={16} className="text-muted" />
//             </span>
//             <input
//               type="search"
//               className="form-control border-0 shadow-none"
//               style={{ width: "220px" }}
//               placeholder="Search database..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <button
//             className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm"
//             type="submit"
//           >
//             Search
//           </button>
//         </form>
//       </div>

//       {/* Notifications */}
//       {error && (
//         <div className="alert alert-danger d-flex align-items-center gap-2 py-2 shadow-sm mb-3">
//           <AlertCircle size={18} />
//           {error}
//         </div>
//       )}
//       {success && (
//         <div className="alert alert-success py-2 shadow-sm mb-3 text-center">
//           {success}
//         </div>
//       )}

//       {/* Main Table Card */}
//       <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="table-light border-bottom">
//               <tr className="text-uppercase small text-muted fw-bold">
//                 <th className="py-3 ps-4">Patient Information</th>
//                 <th className="py-3">Contact Detail</th>
//                 <th className="py-3">Loyalty Status</th>
//                 <th className="py-3">Health Alerts</th>
//                 <th className="py-3">Financials</th>
//                 <th className="py-3 pe-4 text-end">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {customers.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="text-center py-5 text-muted">
//                     <Users size={48} className="opacity-25 mb-3" />
//                     <p>No customer files found in the system database.</p>
//                   </td>
//                 </tr>
//               ) : (
//                 customers.map((customer) => (
//                   <tr key={customer._id}>
//                     <td className="ps-4">
//                       <div className="d-flex align-items-center gap-3">
//                         <div
//                           className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
//                           style={{ width: 38, height: 38 }}
//                         >
//                           {customer.name?.charAt(0).toUpperCase() || "?"}
//                         </div>
//                         <div>
//                           <div className="fw-bold text-dark">
//                             {customer.name || "Unknown"}
//                           </div>
//                           <div className="small text-muted d-flex align-items-center gap-1">
//                             <Mail size={12} /> {customer.email}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="small text-dark mb-1 d-flex align-items-center gap-1">
//                         <Phone size={12} className="text-muted" />{" "}
//                         {customer.phone || "No Contact"}
//                       </div>
//                       <div className="small text-muted text-capitalize">
//                         Prefers: {customer.preferredContact || "Email"}
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className={getStatusBadge(customer.loyaltyPoints || 0)}
//                       >
//                         <Award size={12} className="me-1" />{" "}
//                         {customer.loyaltyPoints || 0} Points
//                       </div>
//                     </td>
//                     <td>
//                       {customer.allergies ? (
//                         <span className="badge bg-danger-subtle text-danger border border-danger-subtle small">
//                           Allergic: {customer.allergies}
//                         </span>
//                       ) : (
//                         <span className="text-muted small">
//                           No Allergies Listed
//                         </span>
//                       )}
//                     </td>
//                     <td>
//                       <div className="fw-bold text-dark small">
//                         <CreditCard size={12} className="text-muted me-1" />
//                         Rs. {Number(customer.totalSpent || 0).toLocaleString()}
//                       </div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.7rem" }}
//                       >
//                         <Calendar size={10} className="me-1" /> Last Order:{" "}
//                         {customer.lastPurchaseDate
//                           ? new Date(
//                               customer.lastPurchaseDate
//                             ).toLocaleDateString()
//                           : "Never"}
//                       </div>
//                     </td>
//                     <td className="pe-4 text-end">
//                       <button
//                         className="btn btn-sm btn-outline-primary rounded-pill px-3"
//                         onClick={() => openEditModal(customer)}
//                       >
//                         <Edit3 size={14} className="me-1" /> Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pagination.pages > 1 && (
//           <div className="card-footer bg-white border-0 py-3 d-flex justify-content-between align-items-center">
//             <span className="small text-muted">
//               Showing Page {page} of {pagination.pages}
//             </span>
//             <nav>
//               <ul className="pagination pagination-sm mb-0">
//                 <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
//                   <button
//                     className="page-link border-0 shadow-none"
//                     onClick={() => handlePageChange(page - 1)}
//                   >
//                     Previous
//                   </button>
//                 </li>
//                 <li className="page-item active">
//                   <button
//                     className="page-link rounded-circle mx-1"
//                     style={{ width: 30, height: 30, padding: 0 }}
//                   >
//                     {page}
//                   </button>
//                 </li>
//                 <li
//                   className={`page-item ${
//                     page === pagination.pages ? "disabled" : ""
//                   }`}
//                 >
//                   <button
//                     className="page-link border-0 shadow-none"
//                     onClick={() => handlePageChange(page + 1)}
//                   >
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         )}
//       </div>

//       {/* Edit Customer Modal */}
//       {showEditModal && (
//         <div className="modal show d-block animate-fade-in" tabIndex="-1">
//           <div
//             className="modal-backdrop fade show"
//             onClick={() => setShowEditModal(false)}
//           ></div>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content border-0 shadow-lg rounded-4">
//               <div className="modal-header border-0 pb-0 pe-4">
//                 <h5 className="modal-title fw-bold">Update Customer Data</h5>
//                 <button
//                   type="button"
//                   className="btn-close shadow-none"
//                   onClick={() => setShowEditModal(false)}
//                 ></button>
//               </div>
//               <form onSubmit={handleEditSubmit}>
//                 <div className="modal-body p-4">
//                   <div className="mb-4 text-center">
//                     <div
//                       className="avatar-lg bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
//                       style={{ width: 60, height: 60, fontSize: "1.5rem" }}
//                     >
//                       {selectedCustomer?.name?.charAt(0).toUpperCase() || "?"}
//                     </div>
//                     <h6 className="fw-bold mb-0">{selectedCustomer?.name}</h6>
//                     <small className="text-muted">
//                       {selectedCustomer?.email}
//                     </small>
//                   </div>

//                   <div className="row g-3 mb-3">
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted">
//                         Loyalty Points
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control border-2"
//                         value={editForm.loyaltyPoints}
//                         onChange={(e) =>
//                           setEditForm({
//                             ...editForm,
//                             loyaltyPoints: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold text-muted">
//                         Contact Method
//                       </label>
//                       <select
//                         className="form-select border-2"
//                         value={editForm.preferredContact}
//                         onChange={(e) =>
//                           setEditForm({
//                             ...editForm,
//                             preferredContact: e.target.value,
//                           })
//                         }
//                       >
//                         <option value="email">Email</option>
//                         <option value="sms">SMS</option>
//                         <option value="phone">Phone</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label small fw-bold text-muted">
//                       Health Allergies
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control border-2"
//                       placeholder="e.g. Peanuts, Penicillin"
//                       value={editForm.allergies}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, allergies: e.target.value })
//                       }
//                     />
//                   </div>

//                   <div className="mb-0">
//                     <label className="form-label small fw-bold text-muted">
//                       Internal Medical Notes
//                     </label>
//                     <textarea
//                       className="form-control border-2"
//                       rows="3"
//                       placeholder="Notes for pharmacist/staff only..."
//                       value={editForm.notes}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, notes: e.target.value })
//                       }
//                     ></textarea>
//                   </div>
//                 </div>
//                 <div className="modal-footer border-0 pt-0 pe-4 pb-4">
//                   <button
//                     type="button"
//                     className="btn btn-light rounded-pill px-4"
//                     onClick={() => setShowEditModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary rounded-pill px-4 shadow-sm"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.3s ease; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//       `}</style>
//     </div>
//   );
// };

// export default AdminCustomers;

import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Users,
  Search,
  Edit3,
  Mail,
  Phone,
  Award,
  AlertCircle,
  Calendar,
  CreditCard,
  X,
  Loader2,
} from "lucide-react";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState(""); // Tracks input value
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editForm, setEditForm] = useState({});

  // ✅ UPDATED: Fetching logic to handle search and nested backend data
  const fetchCustomers = async (pageNum = 1, searchQuery = "") => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: pageNum,
        limit: 15,
        search: searchQuery, // ✅ Passed to backend for server-side filtering
        role: "customer",
      });

      const res = await api.get(`/users?${params.toString()}`);

      // Extract data correctly from backend response structure
      const data = res.data?.users || res.data?.customers || res.data || [];

      setCustomers(Array.isArray(data) ? data : []);
      setPagination(res.data?.pagination || { total: data.length, pages: 1 });
    } catch (err) {
      console.error("Fetch customers error:", err);
      setError(err.response?.data?.message || "Database connection error");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1, "");
  }, []);

  // ✅ FIX: Search functionality correctly triggers new fetch
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers(1, search);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchCustomers(newPage, search);
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      allergies: customer.allergies || "",
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
      await api.put(`/users/${selectedCustomer._id}`, editForm);

      setSuccess("Customer profile updated successfully");
      setShowEditModal(false);
      fetchCustomers(page, search);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update customer");
    }
  };

  const getStatusBadge = (points) => {
    if (points >= 1000)
      return "badge bg-success-subtle text-success border border-success-subtle";
    if (points >= 500)
      return "badge bg-primary-subtle text-primary border border-primary-subtle";
    return "badge bg-secondary-subtle text-secondary border border-secondary-subtle";
  };

  if (loading && customers.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-white">
        <Loader2 className="animate-spin text-primary mb-3" size={40} />
        <span className="fw-bold text-muted">Syncing Customer Records...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0 animate-fade-in">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <Users className="text-primary" /> Customer Registry
          </h3>
          <p className="text-muted small mb-0">
            Total Records Found: {customers.length}
          </p>
        </div>

        {/* ✅ Search Input Bar Integration */}
        <form onSubmit={handleSearch} className="d-flex gap-2">
          <div className="input-group input-group-sm shadow-sm border rounded-pill overflow-hidden bg-white">
            <span className="input-group-text bg-white border-0 ps-3">
              <Search size={16} className="text-muted" />
            </span>
            <input
              type="search"
              className="form-control border-0 shadow-none"
              style={{ width: "220px" }}
              placeholder="Name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 shadow-sm mb-3">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success py-2 shadow-sm mb-3 text-center">
          {success}
        </div>
      )}

      {/* Main Table Card */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light border-bottom">
              <tr className="text-uppercase small text-muted fw-bold">
                <th className="py-3 ps-4">Patient Information</th>
                <th className="py-3">Contact Detail</th>
                <th className="py-3">Loyalty Status</th>
                <th className="py-3">Health Alerts</th>
                <th className="py-3">Financials</th>
                <th className="py-3 pe-4 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <Users size={48} className="opacity-25 mb-3" />
                    <p>No customer files found matching "{search}"</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: 38, height: 38 }}
                        >
                          {customer.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">
                            {customer.name || "Unknown"}
                          </div>
                          <div className="small text-muted d-flex align-items-center gap-1">
                            <Mail size={12} /> {customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small text-dark mb-1 d-flex align-items-center gap-1">
                        <Phone size={12} className="text-muted" />{" "}
                        {customer.phone || "No Contact"}
                      </div>
                      <div className="small text-muted text-capitalize">
                        Prefers: {customer.preferredContact || "Email"}
                      </div>
                    </td>
                    <td>
                      <div
                        className={getStatusBadge(customer.loyaltyPoints || 0)}
                      >
                        <Award size={12} className="me-1" />{" "}
                        {customer.loyaltyPoints || 0} Points
                      </div>
                    </td>
                    <td>
                      {customer.allergies ? (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle small">
                          Allergic: {customer.allergies}
                        </span>
                      ) : (
                        <span className="text-muted small">
                          No Allergies Listed
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="fw-bold text-dark small">
                        <CreditCard size={12} className="text-muted me-1" />
                        Rs. {Number(customer.totalSpent || 0).toLocaleString()}
                      </div>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.7rem" }}
                      >
                        <Calendar size={10} className="me-1" /> Last Order:{" "}
                        {customer.lastPurchaseDate
                          ? new Date(
                              customer.lastPurchaseDate
                            ).toLocaleDateString()
                          : "Never"}
                      </div>
                    </td>
                    <td className="pe-4 text-end">
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        onClick={() => openEditModal(customer)}
                      >
                        <Edit3 size={14} className="me-1" /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Logic */}
        {pagination.pages > 1 && (
          <div className="card-footer bg-white border-0 py-3 d-flex justify-content-between align-items-center">
            <span className="small text-muted">
              Showing Page {page} of {pagination.pages}
            </span>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link border-0 shadow-none"
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Previous
                  </button>
                </li>
                <li className="page-item active">
                  <button
                    className="page-link rounded-circle mx-1"
                    style={{ width: 30, height: 30, padding: 0 }}
                  >
                    {page}
                  </button>
                </li>
                <li
                  className={`page-item ${
                    page === pagination.pages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link border-0 shadow-none"
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Edit Customer Modal */}
      {showEditModal && (
        <div className="modal show d-block animate-fade-in" tabIndex="-1">
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowEditModal(false)}
          ></div>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0 pe-4">
                <h5 className="modal-title fw-bold">Update Customer Data</h5>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-4 text-center">
                    <div
                      className="avatar-lg bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                      style={{ width: 60, height: 60, fontSize: "1.5rem" }}
                    >
                      {selectedCustomer?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <h6 className="fw-bold mb-0">{selectedCustomer?.name}</h6>
                    <small className="text-muted">
                      {selectedCustomer?.email}
                    </small>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        Loyalty Points
                      </label>
                      <input
                        type="number"
                        className="form-control border-2"
                        value={editForm.loyaltyPoints}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            loyaltyPoints: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        Contact Method
                      </label>
                      <select
                        className="form-select border-2"
                        value={editForm.preferredContact}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            preferredContact: e.target.value,
                          })
                        }
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="phone">Phone</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">
                      Health Allergies
                    </label>
                    <input
                      type="text"
                      className="form-control border-2"
                      placeholder="e.g. Peanuts, Penicillin"
                      value={editForm.allergies}
                      onChange={(e) =>
                        setEditForm({ ...editForm, allergies: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-0">
                    <label className="form-label small fw-bold text-muted">
                      Internal Medical Notes
                    </label>
                    <textarea
                      className="form-control border-2"
                      rows="3"
                      placeholder="Notes for pharmacist/staff only..."
                      value={editForm.notes}
                      onChange={(e) =>
                        setEditForm({ ...editForm, notes: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0 pe-4 pb-4">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminCustomers;
