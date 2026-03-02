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
//   Loader2,
// } from "lucide-react";

// const AdminCustomers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [search, setSearch] = useState(""); // Tracks input value
//   const [page, setPage] = useState(1);
//   const [pagination, setPagination] = useState({});
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [editForm, setEditForm] = useState({});

//   // ✅ UPDATED: Fetching logic to handle search and nested backend data
//   const fetchCustomers = async (pageNum = 1, searchQuery = "") => {
//     try {
//       setLoading(true);
//       setError("");

//       const params = new URLSearchParams({
//         page: pageNum,
//         limit: 15,
//         search: searchQuery, // ✅ Passed to backend for server-side filtering
//         role: "customer",
//       });

//       const res = await api.get(`/users?${params.toString()}`);

//       // Extract data correctly from backend response structure
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
//     fetchCustomers(1, "");
//   }, []);

//   // ✅ FIX: Search functionality correctly triggers new fetch
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

//   if (loading && customers.length === 0) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-white">
//         <Loader2 className="animate-spin text-primary mb-3" size={40} />
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

//         {/* ✅ Search Input Bar Integration */}
//         <form onSubmit={handleSearch} className="d-flex gap-2">
//           <div className="input-group input-group-sm shadow-sm border rounded-pill overflow-hidden bg-white">
//             <span className="input-group-text bg-white border-0 ps-3">
//               <Search size={16} className="text-muted" />
//             </span>
//             <input
//               type="search"
//               className="form-control border-0 shadow-none"
//               style={{ width: "220px" }}
//               placeholder="Name, email, or phone..."
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
//                     <p>No customer files found matching "{search}"</p>
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
//                               customer.lastPurchaseDate,
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

//         {/* Pagination Logic */}
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
//         .animate-spin { animation: spin 1s linear infinite; }
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//       `}</style>
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
//   Loader2,
//   Activity,
//   ChevronLeft,
//   ChevronRight,
//   FileText,
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

//   // Fetching logic
//   const fetchCustomers = async (pageNum = 1, searchQuery = "") => {
//     try {
//       setLoading(true);
//       setError("");

//       const params = new URLSearchParams({
//         page: pageNum,
//         limit: 15,
//         search: searchQuery,
//         role: "customer",
//       });

//       const res = await api.get(`/users?${params.toString()}`);
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
//     fetchCustomers(1, "");
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

//   // Upgraded badge colors to modern soft-UI variants
//   const getStatusBadge = (points) => {
//     if (points >= 1000)
//       return "badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1";
//     if (points >= 500)
//       return "badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1";
//     return "badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1";
//   };

//   if (loading && customers.length === 0) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary mb-3" size={40} />
//         <span className="fw-semibold text-muted tracking-wider text-uppercase small">
//           Syncing Customer Records...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
//       {/* Header Section */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
//         <div className="d-flex align-items-center gap-3">
//           <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4">
//             <Users size={24} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="fw-bolder mb-1 text-dark tracking-tight">
//               Customer Registry
//             </h3>
//             <p className="text-muted small fw-medium mb-0">
//               Total Records Found:{" "}
//               <span className="fw-bold text-primary">{customers.length}</span>
//             </p>
//           </div>
//         </div>

//         {/* Search Input Bar */}
//         <form onSubmit={handleSearch} className="d-flex gap-2">
//           <div className="position-relative">
//             <Search
//               size={18}
//               className="position-absolute top-50 translate-middle-y text-muted"
//               style={{ left: "16px" }}
//             />
//             <input
//               type="search"
//               className="form-control modern-input rounded-pill ps-5 py-2 shadow-sm border-0"
//               style={{ width: "260px", fontSize: "0.95rem" }}
//               placeholder="Search customers..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <button
//             className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold hover-lift transition-all"
//             type="submit"
//           >
//             Search
//           </button>
//         </form>
//       </div>

//       {/* Alerts */}
//       {error && (
//         <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 shadow-sm mb-4 rounded-3 border-0 bg-danger bg-opacity-10 text-danger small fw-medium">
//           <AlertCircle size={18} /> {error}
//         </div>
//       )}
//       {success && (
//         <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 shadow-sm mb-4 rounded-3 border-0 bg-success bg-opacity-10 text-success small fw-medium">
//           <Award size={18} /> {success}
//         </div>
//       )}

//       {/* Main Table Card */}
//       <div className="card shadow-sm border-0 rounded-4 overflow-hidden modern-card mb-4">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="bg-light border-bottom">
//               <tr>
//                 <th className="py-3 ps-4 text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                   Patient Information
//                 </th>
//                 <th className="py-3 text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                   Contact Detail
//                 </th>
//                 <th className="py-3 text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                   Loyalty Status
//                 </th>
//                 <th className="py-3 text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                   Health Alerts
//                 </th>
//                 <th className="py-3 text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                   Financials
//                 </th>
//                 <th className="py-3 pe-4 text-end text-uppercase tracking-wider small text-secondary fw-semibold border-0">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="border-top-0">
//               {customers.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="text-center py-5 text-muted">
//                     <div className="d-flex flex-column align-items-center justify-content-center">
//                       <div className="bg-secondary bg-opacity-10 p-3 rounded-circle mb-3">
//                         <Users
//                           size={32}
//                           className="text-secondary opacity-50"
//                         />
//                       </div>
//                       <p className="fw-medium mb-0">
//                         No customer files found matching "{search}"
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 customers.map((customer) => (
//                   <tr
//                     key={customer._id}
//                     className="transition-all table-row-hover"
//                   >
//                     <td className="ps-4 py-3">
//                       <div className="d-flex align-items-center gap-3">
//                         <div
//                           className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold border border-primary border-opacity-25 shadow-sm"
//                           style={{ width: 42, height: 42, fontSize: "1.1rem" }}
//                         >
//                           {customer.name?.charAt(0).toUpperCase() || "?"}
//                         </div>
//                         <div>
//                           <div
//                             className="fw-bold text-dark"
//                             style={{ fontSize: "0.95rem" }}
//                           >
//                             {customer.name || "Unknown User"}
//                           </div>
//                           <div
//                             className="text-muted d-flex align-items-center gap-1"
//                             style={{ fontSize: "0.8rem" }}
//                           >
//                             <Mail size={12} /> {customer.email}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className="text-dark mb-1 d-flex align-items-center gap-1 fw-medium"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         <Phone size={14} className="text-muted" />{" "}
//                         {customer.phone || "No Contact"}
//                       </div>
//                       <div
//                         className="text-muted text-capitalize"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         Prefers:{" "}
//                         <span className="fw-semibold">
//                           {customer.preferredContact || "Email"}
//                         </span>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className={getStatusBadge(customer.loyaltyPoints || 0)}
//                       >
//                         <Award size={14} className="me-1" />{" "}
//                         {customer.loyaltyPoints || 0} PTS
//                       </div>
//                     </td>
//                     <td>
//                       {customer.allergies ? (
//                         <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">
//                           <AlertCircle size={12} className="me-1" />{" "}
//                           {customer.allergies}
//                         </span>
//                       ) : (
//                         <span
//                           className="text-muted"
//                           style={{ fontSize: "0.8rem" }}
//                         >
//                           None listed
//                         </span>
//                       )}
//                     </td>
//                     <td>
//                       <div
//                         className="fw-bolder text-dark"
//                         style={{ fontSize: "0.9rem" }}
//                       >
//                         <CreditCard size={14} className="text-primary me-1" />
//                         NPR {Number(customer.totalSpent || 0).toLocaleString()}
//                       </div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         <Calendar size={12} className="me-1" /> Last:{" "}
//                         {customer.lastPurchaseDate
//                           ? new Date(
//                               customer.lastPurchaseDate,
//                             ).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                             })
//                           : "Never"}
//                       </div>
//                     </td>
//                     <td className="pe-4 text-end">
//                       {/* ✅ FIXED: Button z-index and type updated */}
//                       <button
//                         type="button"
//                         className="btn btn-sm btn-light text-primary rounded-pill px-3 fw-semibold border hover-lift transition-all d-inline-flex align-items-center gap-1 position-relative"
//                         style={{ zIndex: 5, cursor: "pointer" }}
//                         onClick={() => openEditModal(customer)}
//                       >
//                         <Edit3 size={14} /> Edit
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
//           <div className="card-footer bg-white border-top py-3 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
//             <span className="small text-muted fw-medium">
//               Showing Page <span className="fw-bold text-dark">{page}</span> of{" "}
//               {pagination.pages}
//             </span>
//             <nav>
//               <ul className="pagination pagination-sm mb-0 gap-1">
//                 <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
//                   <button
//                     className="page-link border-0 rounded-circle shadow-sm modern-page-btn"
//                     onClick={() => handlePageChange(page - 1)}
//                   >
//                     <ChevronLeft size={16} />
//                   </button>
//                 </li>
//                 <li className="page-item">
//                   <div className="page-link border-0 rounded-pill bg-primary text-white fw-bold shadow-sm px-3 mx-1">
//                     {page}
//                   </div>
//                 </li>
//                 <li
//                   className={`page-item ${page === pagination.pages ? "disabled" : ""}`}
//                 >
//                   <button
//                     className="page-link border-0 rounded-circle shadow-sm modern-page-btn"
//                     onClick={() => handlePageChange(page + 1)}
//                   >
//                     <ChevronRight size={16} />
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         )}
//       </div>

//       {/* ✅ FIXED: Edit Customer Modal & Overlay Structure */}
//       {showEditModal && (
//         <>
//           {/* Dark Overlay Backdrop - Placed OUTSIDE the modal container */}
//           <div
//             className="modal-backdrop fade show"
//             style={{ zIndex: 1040 }}
//             onClick={() => setShowEditModal(false)}
//           ></div>

//           {/* Actual Modal Container */}
//           <div
//             className="modal show d-block animate-fade-in"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//           >
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//                 <div className="modal-header bg-light border-0 p-4 pb-3">
//                   <h5 className="modal-title fw-bolder text-dark d-flex align-items-center gap-2">
//                     <Edit3 className="text-primary" size={20} /> Update Customer
//                     Data
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close shadow-none bg-secondary bg-opacity-10 rounded-circle p-2"
//                     onClick={() => setShowEditModal(false)}
//                   ></button>
//                 </div>

//                 <form onSubmit={handleEditSubmit}>
//                   <div className="modal-body p-4 pt-3">
//                     {/* User Context Area */}
//                     <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-primary bg-opacity-10 rounded-3 border border-primary border-opacity-10">
//                       <div
//                         className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bolder shadow-sm"
//                         style={{ width: 48, height: 48, fontSize: "1.2rem" }}
//                       >
//                         {selectedCustomer?.name?.charAt(0).toUpperCase() || "?"}
//                       </div>
//                       <div>
//                         <h6 className="fw-bold mb-0 text-dark">
//                           {selectedCustomer?.name}
//                         </h6>
//                         <div className="small text-muted">
//                           {selectedCustomer?.email}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="row g-4 mb-4">
//                       {/* Loyalty Points */}
//                       <div className="col-md-6 position-relative">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           Loyalty Points
//                         </label>
//                         <div className="position-relative">
//                           <Award
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <input
//                             type="number"
//                             className="form-control modern-input ps-5 border-light-subtle"
//                             value={editForm.loyaltyPoints}
//                             onChange={(e) =>
//                               setEditForm({
//                                 ...editForm,
//                                 loyaltyPoints: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       {/* Contact Method */}
//                       <div className="col-md-6 position-relative">
//                         <label className="form-label small fw-semibold text-secondary mb-1">
//                           Contact Method
//                         </label>
//                         <div className="position-relative">
//                           <Phone
//                             size={16}
//                             className="position-absolute top-50 translate-middle-y text-muted"
//                             style={{ left: "12px" }}
//                           />
//                           <select
//                             className="form-select modern-input ps-5 border-light-subtle"
//                             value={editForm.preferredContact}
//                             onChange={(e) =>
//                               setEditForm({
//                                 ...editForm,
//                                 preferredContact: e.target.value,
//                               })
//                             }
//                           >
//                             <option value="email">Email</option>
//                             <option value="sms">SMS</option>
//                             <option value="phone">Phone</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Allergies */}
//                     <div className="mb-4">
//                       <label className="form-label small fw-semibold text-secondary mb-1">
//                         Health Allergies
//                       </label>
//                       <div className="position-relative">
//                         <Activity
//                           size={16}
//                           className="position-absolute top-50 translate-middle-y text-muted"
//                           style={{ left: "12px" }}
//                         />
//                         <input
//                           type="text"
//                           className="form-control modern-input ps-5 border-light-subtle"
//                           placeholder="e.g. Peanuts, Penicillin (Leave blank if none)"
//                           value={editForm.allergies}
//                           onChange={(e) =>
//                             setEditForm({
//                               ...editForm,
//                               allergies: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                     </div>

//                     {/* Internal Notes */}
//                     <div className="mb-2">
//                       <label className="form-label small fw-semibold text-secondary mb-1 d-flex align-items-center gap-1">
//                         <FileText size={14} /> Internal Medical Notes
//                       </label>
//                       <textarea
//                         className="form-control modern-input border-light-subtle p-3"
//                         rows="3"
//                         placeholder="Add secure notes for pharmacist/staff review..."
//                         value={editForm.notes}
//                         onChange={(e) =>
//                           setEditForm({ ...editForm, notes: e.target.value })
//                         }
//                       ></textarea>
//                     </div>
//                   </div>

//                   {/* Footer Buttons */}
//                   <div className="modal-footer bg-light border-0 p-3">
//                     <button
//                       type="button"
//                       className="btn btn-light rounded-pill px-4 fw-medium border"
//                       onClick={() => setShowEditModal(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold hover-lift transition-all"
//                     >
//                       Save Changes
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Embedded CSS for custom modern styles */}
//       <style>{`
//         .bg-light { background-color: #f8fafc !important; }
//         .modern-card { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03) !important; }

//         /* Input Styling */
//         .modern-input {
//           background-color: #ffffff;
//           transition: all 0.2s ease;
//         }
//         .modern-input:focus {
//           border-color: #0d6efd;
//           box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
//         }

//         /* Table Row Hover */
//         .table-row-hover:hover {
//           background-color: rgba(13, 110, 253, 0.02) !important;
//         }

//         /* Pagination Buttons */
//         .modern-page-btn {
//           width: 32px;
//           height: 32px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: #6c757d;
//           background-color: #fff;
//           transition: all 0.2s;
//         }
//         .modern-page-btn:hover:not(:disabled) {
//           background-color: #e9ecef;
//           color: #0d6efd;
//         }

//         /* Typography */
//         .tracking-wider { letter-spacing: 0.05em; }
//         .tracking-tight { letter-spacing: -0.025em; }

//         /* Animations */
//         .animate-fade-in { animation: fadeIn 0.3s ease-out; }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .spin-animation { animation: spin 1s linear infinite; }
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }

//         .transition-all { transition: all 0.3s ease; }
//         .hover-lift:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 15px rgba(13, 110, 253, 0.2) !important;
//         }
//         .hover-lift:active { transform: translateY(0); }
//       `}</style>
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
//   Loader2,
//   Activity,
//   ChevronLeft,
//   ChevronRight,
//   FileText,
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

//   // Fetching logic
//   const fetchCustomers = async (pageNum = 1, searchQuery = "") => {
//     try {
//       setLoading(true);
//       setError("");

//       const params = new URLSearchParams({
//         page: pageNum,
//         limit: 15,
//         search: searchQuery,
//         role: "customer",
//       });

//       const res = await api.get(`/users?${params.toString()}`);
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
//     fetchCustomers(1, "");
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

//   // Upgraded badge colors to modern soft-UI variants
//   const getStatusBadge = (points) => {
//     if (points >= 1000)
//       return "badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 shadow-sm";
//     if (points >= 500)
//       return "badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 shadow-sm";
//     return "badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1 shadow-sm";
//   };

//   if (loading && customers.length === 0) {
//     return (
//       <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
//         <Loader2 className="spin-animation text-primary mb-3" size={48} />
//         <span className="fw-bolder text-secondary tracking-wider text-uppercase small">
//           Syncing Customer Records...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in">
//       {/* --- HEADER SECTION --- */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3 bg-white p-4 rounded-4 shadow-sm border-start border-5 border-primary">
//         <div className="d-flex align-items-center gap-3">
//           <div className="bg-primary text-white p-3 rounded-3 shadow-sm">
//             <Users size={28} strokeWidth={2.5} />
//           </div>
//           <div>
//             <h3 className="fw-bolder mb-1 text-dark tracking-tight">
//               Customer Registry
//             </h3>
//             <p className="text-muted fw-medium mb-0">
//               Total Records Found:{" "}
//               <span className="fw-bold text-primary fs-6">
//                 {customers.length}
//               </span>
//             </p>
//           </div>
//         </div>

//         {/* Search Input Bar */}
//         <form
//           onSubmit={handleSearch}
//           className="d-flex gap-2 w-100"
//           style={{ maxWidth: "350px" }}
//         >
//           <div className="position-relative flex-grow-1">
//             <Search
//               size={18}
//               className="position-absolute top-50 translate-middle-y text-primary"
//               style={{ left: "16px" }}
//             />
//             <input
//               type="search"
//               className="form-control modern-input rounded-pill ps-5 py-2 shadow-sm"
//               style={{ fontSize: "0.95rem" }}
//               placeholder="Search customers..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <button
//             className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold hover-lift transition-all"
//             type="submit"
//           >
//             Search
//           </button>
//         </form>
//       </div>

//       {/* --- ALERTS --- */}
//       {error && (
//         <div className="alert alert-danger d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold animate-fade-in">
//           <AlertCircle size={20} /> {error}
//         </div>
//       )}
//       {success && (
//         <div className="alert alert-success d-flex align-items-center gap-2 py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold animate-fade-in">
//           <Award size={20} /> {success}
//         </div>
//       )}

//       {/* --- MAIN TABLE CARD --- */}
//       <div className="card-modern mb-4 bg-white">
//         <div className="table-responsive custom-scrollbar">
//           <table className="table table-hover align-middle mb-0 table-modern">
//             <thead>
//               <tr>
//                 <th className="ps-4">Patient Information</th>
//                 <th>Contact Detail</th>
//                 <th>Loyalty Status</th>
//                 <th>Health Alerts</th>
//                 <th>Financials</th>
//                 <th className="pe-4 text-end">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {customers.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="text-center py-5 text-muted">
//                     <div className="d-flex flex-column align-items-center justify-content-center">
//                       <div className="bg-secondary bg-opacity-10 p-4 rounded-circle mb-3">
//                         <Users
//                           size={40}
//                           className="text-secondary opacity-50"
//                         />
//                       </div>
//                       <h5 className="fw-bolder text-dark mb-1">
//                         No Customers Found
//                       </h5>
//                       <p className="fw-medium mb-0">
//                         We couldn't find any records matching "{search}".
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 customers.map((customer) => (
//                   <tr
//                     key={customer._id}
//                     className="transition-all table-row-hover border-bottom border-light"
//                   >
//                     <td className="ps-4 py-3">
//                       <div className="d-flex align-items-center gap-3">
//                         <div
//                           className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bolder border border-primary border-opacity-25 shadow-sm"
//                           style={{ width: 48, height: 48, fontSize: "1.2rem" }}
//                         >
//                           {customer.name?.charAt(0).toUpperCase() || "?"}
//                         </div>
//                         <div>
//                           <div className="fw-bold text-dark mb-1 fs-6">
//                             {customer.name || "Unknown User"}
//                           </div>
//                           <div className="text-muted d-flex align-items-center gap-1 small fw-medium">
//                             <Mail size={12} /> {customer.email}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="text-dark mb-1 d-flex align-items-center gap-2 fw-medium fs-6">
//                         <Phone size={14} className="text-muted" />{" "}
//                         {customer.phone || "No Contact"}
//                       </div>
//                       <div className="text-muted text-capitalize small">
//                         Prefers:{" "}
//                         <span className="fw-bold text-dark">
//                           {customer.preferredContact || "Email"}
//                         </span>
//                       </div>
//                     </td>
//                     <td>
//                       <div
//                         className={getStatusBadge(customer.loyaltyPoints || 0)}
//                       >
//                         <Award size={14} className="me-1" />{" "}
//                         {customer.loyaltyPoints || 0} PTS
//                       </div>
//                     </td>
//                     <td>
//                       {customer.allergies ? (
//                         <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-2 shadow-sm">
//                           <AlertCircle size={14} className="me-1" />{" "}
//                           {customer.allergies}
//                         </span>
//                       ) : (
//                         <span className="text-muted small fw-medium">
//                           None listed
//                         </span>
//                       )}
//                     </td>
//                     <td>
//                       <div className="fw-bolder text-dark mb-1 fs-6">
//                         <CreditCard size={14} className="text-success me-1" />
//                         NPR {Number(customer.totalSpent || 0).toLocaleString()}
//                       </div>
//                       <div className="text-muted small">
//                         <Calendar size={12} className="me-1" /> Last:{" "}
//                         {customer.lastPurchaseDate
//                           ? new Date(
//                               customer.lastPurchaseDate,
//                             ).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                             })
//                           : "Never"}
//                       </div>
//                     </td>
//                     <td className="pe-4 text-end">
//                       <button
//                         type="button"
//                         className="btn btn-sm btn-light text-primary rounded-pill px-3 py-2 fw-bold border hover-lift shadow-sm d-inline-flex align-items-center gap-2"
//                         onClick={() => openEditModal(customer)}
//                       >
//                         <Edit3 size={16} /> Edit Profile
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* --- PAGINATION --- */}
//         {pagination.pages > 1 && (
//           <div className="card-footer bg-white border-top py-3 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
//             <span className="small text-muted fw-medium">
//               Showing Page{" "}
//               <span className="fw-bolder text-primary">{page}</span> of{" "}
//               {pagination.pages}
//             </span>
//             <nav>
//               <ul className="pagination pagination-sm mb-0 gap-1">
//                 <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
//                   <button
//                     className="page-link border-0 rounded-circle shadow-sm"
//                     onClick={() => handlePageChange(page - 1)}
//                     style={{
//                       width: "32px",
//                       height: "32px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <ChevronLeft size={16} />
//                   </button>
//                 </li>
//                 <li className="page-item">
//                   <div className="page-link border-0 rounded-pill bg-primary text-white fw-bold shadow-sm px-3 mx-1">
//                     {page}
//                   </div>
//                 </li>
//                 <li
//                   className={`page-item ${page === pagination.pages ? "disabled" : ""}`}
//                 >
//                   <button
//                     className="page-link border-0 rounded-circle shadow-sm"
//                     onClick={() => handlePageChange(page + 1)}
//                     style={{
//                       width: "32px",
//                       height: "32px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <ChevronRight size={16} />
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         )}
//       </div>

//       {/* --- MODAL SECTION --- */}
//       {showEditModal && (
//         <>
//           {/* Dark Overlay Backdrop */}
//           <div
//             className="modal-backdrop fade show"
//             style={{ zIndex: 1040 }}
//             onClick={() => setShowEditModal(false)}
//           ></div>

//           {/* Modal Container */}
//           <div
//             className="modal show d-block animate-fade-in"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//           >
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
//                 <div className="modal-header bg-light border-0 p-4 pb-3">
//                   <h5 className="modal-title fw-bolder text-dark d-flex align-items-center gap-2">
//                     <Edit3 className="text-primary" size={20} /> Update Customer
//                     Data
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close shadow-none bg-secondary bg-opacity-10 rounded-circle p-2"
//                     onClick={() => setShowEditModal(false)}
//                   ></button>
//                 </div>

//                 <form onSubmit={handleEditSubmit}>
//                   <div className="modal-body p-4 pt-3">
//                     {/* User Context Area */}
//                     <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-primary bg-opacity-10 rounded-4 border border-primary border-opacity-10 shadow-sm">
//                       <div
//                         className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bolder shadow-sm"
//                         style={{ width: 56, height: 56, fontSize: "1.4rem" }}
//                       >
//                         {selectedCustomer?.name?.charAt(0).toUpperCase() || "?"}
//                       </div>
//                       <div>
//                         <h5 className="fw-bolder mb-1 text-dark">
//                           {selectedCustomer?.name}
//                         </h5>
//                         <div className="small text-muted fw-medium">
//                           {selectedCustomer?.email}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="row g-4 mb-4">
//                       {/* Loyalty Points */}
//                       <div className="col-md-6 position-relative">
//                         <label className="form-label text-secondary fw-bold small mb-2 text-uppercase tracking-wider">
//                           Loyalty Points
//                         </label>
//                         <div className="position-relative">
//                           <Award
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <input
//                             type="number"
//                             className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                             value={editForm.loyaltyPoints}
//                             onChange={(e) =>
//                               setEditForm({
//                                 ...editForm,
//                                 loyaltyPoints: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       {/* Contact Method */}
//                       <div className="col-md-6 position-relative">
//                         <label className="form-label text-secondary fw-bold small mb-2 text-uppercase tracking-wider">
//                           Contact Method
//                         </label>
//                         <div className="position-relative">
//                           <Phone
//                             size={18}
//                             className="position-absolute top-50 translate-middle-y text-primary"
//                             style={{ left: "16px" }}
//                           />
//                           <select
//                             className="form-select modern-input ps-5 border-light-subtle shadow-sm cursor-pointer"
//                             value={editForm.preferredContact}
//                             onChange={(e) =>
//                               setEditForm({
//                                 ...editForm,
//                                 preferredContact: e.target.value,
//                               })
//                             }
//                           >
//                             <option value="email">Email</option>
//                             <option value="sms">SMS</option>
//                             <option value="phone">Phone</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Allergies */}
//                     <div className="mb-4">
//                       <label className="form-label text-secondary fw-bold small mb-2 text-uppercase tracking-wider">
//                         Health Allergies
//                       </label>
//                       <div className="position-relative">
//                         <Activity
//                           size={18}
//                           className="position-absolute top-50 translate-middle-y text-danger"
//                           style={{ left: "16px" }}
//                         />
//                         <input
//                           type="text"
//                           className="form-control modern-input ps-5 border-light-subtle shadow-sm"
//                           placeholder="e.g. Peanuts, Penicillin (Leave blank if none)"
//                           value={editForm.allergies}
//                           onChange={(e) =>
//                             setEditForm({
//                               ...editForm,
//                               allergies: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                     </div>

//                     {/* Internal Notes */}
//                     <div className="mb-2">
//                       <label className="form-label text-secondary fw-bold small mb-2 text-uppercase tracking-wider d-flex align-items-center gap-2">
//                         <FileText size={16} className="text-info" /> Internal
//                         Medical Notes
//                       </label>
//                       <textarea
//                         className="form-control modern-input border-light-subtle p-3 shadow-sm"
//                         rows="3"
//                         placeholder="Add secure notes for pharmacist/staff review..."
//                         value={editForm.notes}
//                         onChange={(e) =>
//                           setEditForm({ ...editForm, notes: e.target.value })
//                         }
//                       ></textarea>
//                     </div>
//                   </div>

//                   {/* Footer Buttons */}
//                   <div className="modal-footer bg-light border-0 p-3 mt-2">
//                     <button
//                       type="button"
//                       className="btn btn-light rounded-pill px-4 fw-bold border shadow-sm hover-lift"
//                       onClick={() => setShowEditModal(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold hover-lift transition-all"
//                     >
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

import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Mail,
  Edit3,
  MessageSquare,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("all");

  // Fetching logic
  const fetchCustomers = async (pageNum = 1, searchQuery = "") => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: pageNum,
        limit: 15,
        search: searchQuery,
        role: "customer",
      });

      const res = await api.get(`/users?${params.toString()}`);
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

  if (loading && customers.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-white">
        <Loader2 className="spin-animation text-indigo mb-3" size={40} />
        <span className="fw-semibold text-muted small">
          Loading Contacts...
        </span>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100 animate-fade-in">
      {/* Alerts */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 shadow-sm rounded-3 border-0 bg-danger bg-opacity-10 text-danger small fw-medium mb-3">
          <AlertCircle size={18} /> {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 shadow-sm rounded-3 border-0 bg-success bg-opacity-10 text-success small fw-medium mb-3">
          <CheckCircle size={18} /> {success}
        </div>
      )}

      {/* Main SaaS Card */}
      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        {/* Top Action Bar */}
        <div className="p-4 pb-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <h4 className="fw-bold text-dark mb-0 tracking-tight">Customers</h4>

          <div className="d-flex align-items-center gap-3">
            <form onSubmit={handleSearch} className="position-relative">
              <Search
                size={16}
                className="position-absolute top-50 translate-middle-y text-muted"
                style={{ left: "12px" }}
              />
              <input
                type="text"
                className="form-control rounded-pill bg-light border-0 ps-5"
                style={{ width: "250px", fontSize: "0.9rem" }}
                placeholder="Search contact, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <button className="btn btn-light rounded-pill border px-3 d-flex align-items-center gap-2 small fw-medium text-secondary hover-lift">
              <Filter size={16} /> Filter
            </button>

            <button className="btn btn-indigo rounded-pill px-4 d-flex align-items-center gap-2 fw-medium shadow-sm hover-lift">
              <Plus size={18} /> Add Contact
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 mt-4 border-bottom d-flex gap-4">
          <div
            className={`pb-2 cursor-pointer fw-semibold ${activeTab === "all" ? "text-indigo border-indigo" : "text-muted"}`}
            style={{
              borderBottom:
                activeTab === "all"
                  ? "2px solid var(--primary-indigo)"
                  : "2px solid transparent",
              fontSize: "0.95rem",
            }}
            onClick={() => setActiveTab("all")}
          >
            All Contacts ({pagination.total || customers.length})
          </div>
          <div
            className={`pb-2 cursor-pointer fw-semibold ${activeTab === "fav" ? "text-indigo border-indigo" : "text-muted"}`}
            style={{
              borderBottom:
                activeTab === "fav"
                  ? "2px solid var(--primary-indigo)"
                  : "2px solid transparent",
              fontSize: "0.95rem",
            }}
            onClick={() => setActiveTab("fav")}
          >
            Favourites (0)
          </div>
          <div
            className={`pb-2 cursor-pointer fw-semibold ${activeTab === "archived" ? "text-indigo border-indigo" : "text-muted"}`}
            style={{
              borderBottom:
                activeTab === "archived"
                  ? "2px solid var(--primary-indigo)"
                  : "2px solid transparent",
              fontSize: "0.95rem",
            }}
            onClick={() => setActiveTab("archived")}
          >
            Archived (0)
          </div>
        </div>

        {/* Data Table */}
        <div className="table-responsive p-0 custom-scrollbar">
          <table className="table align-middle mb-0 custom-saas-table">
            <thead>
              <tr>
                <th className="ps-4" style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    className="form-check-input shadow-none custom-checkbox"
                  />
                </th>
                <th>Name</th>
                <th>Points / ID</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Financials</th>
                <th className="text-end pe-4"></th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id}>
                    <td className="ps-4">
                      <input
                        type="checkbox"
                        className="form-check-input shadow-none custom-checkbox"
                      />
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="avatar-circle fw-bold text-indigo"
                          style={{
                            backgroundImage: `url('https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}&backgroundColor=e0e7ff&textColor=4f46e5')`,
                          }}
                        ></div>
                        <span
                          className="fw-bold text-dark"
                          style={{ fontSize: "0.95rem" }}
                        >
                          {customer.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td
                      className="text-muted fw-medium"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {customer.loyaltyPoints || 0} PTS
                    </td>
                    <td
                      className="text-muted fw-medium"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {customer.email}
                    </td>
                    <td
                      className="text-muted fw-medium"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {customer.phone || "-"}
                    </td>
                    <td>
                      <div
                        className="fw-semibold text-dark"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Rs. {Number(customer.totalSpent || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="pe-4 text-end">
                      {/* 3-Dot Dropdown Menu */}
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-link text-muted shadow-none"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <MoreVertical size={18} />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 py-2">
                          <li>
                            <button className="dropdown-item d-flex align-items-center gap-2 small text-secondary py-2 hover-bg-light">
                              <MessageSquare size={14} /> Send Message
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item d-flex align-items-center gap-2 small text-secondary py-2 hover-bg-light"
                              onClick={() => openEditModal(customer)}
                            >
                              <Edit3 size={14} /> Edit Contact
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-3 border-top d-flex justify-content-between align-items-center">
            <span className="small text-muted fw-medium ps-2">
              Showing Page {page} of {pagination.pages}
            </span>
            <div className="d-flex gap-1 pe-2">
              <button
                className="btn btn-sm btn-light border d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px", borderRadius: "8px" }}
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="btn btn-sm btn-light border d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px", borderRadius: "8px" }}
                disabled={page === pagination.pages}
                onClick={() => handlePageChange(page + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- EDIT MODAL --- */}
      {showEditModal && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={() => setShowEditModal(false)}
          ></div>
          <div
            className="modal show d-block animate-fade-in"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-header bg-white border-bottom p-4 pb-3">
                  <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                    <Edit3 className="text-indigo" size={20} /> Edit Contact
                  </h5>
                  <button
                    type="button"
                    className="btn-close shadow-none"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>

                <form onSubmit={handleEditSubmit}>
                  <div className="modal-body p-4 bg-light bg-opacity-50">
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div
                        className="avatar-circle-lg border shadow-sm"
                        style={{
                          backgroundImage: `url('https://api.dicebear.com/7.x/initials/svg?seed=${selectedCustomer?.name}&backgroundColor=e0e7ff&textColor=4f46e5')`,
                        }}
                      ></div>
                      <div>
                        <h6 className="fw-bold mb-0 text-dark fs-5">
                          {selectedCustomer?.name}
                        </h6>
                        <div className="text-muted small">
                          {selectedCustomer?.email}
                        </div>
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary mb-1">
                          Loyalty Points
                        </label>
                        <input
                          type="number"
                          className="form-control modern-input bg-white"
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
                        <label className="form-label small fw-semibold text-secondary mb-1">
                          Preferred Contact
                        </label>
                        <select
                          className="form-select modern-input bg-white cursor-pointer"
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
                      <label className="form-label small fw-semibold text-secondary mb-1">
                        Health Allergies
                      </label>
                      <input
                        type="text"
                        className="form-control modern-input bg-white"
                        placeholder="Leave blank if none"
                        value={editForm.allergies}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            allergies: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-1">
                      <label className="form-label small fw-semibold text-secondary mb-1">
                        Notes
                      </label>
                      <textarea
                        className="form-control modern-input bg-white"
                        rows="3"
                        placeholder="Add notes..."
                        value={editForm.notes}
                        onChange={(e) =>
                          setEditForm({ ...editForm, notes: e.target.value })
                        }
                      ></textarea>
                    </div>
                  </div>

                  <div className="modal-footer bg-white border-top p-3">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4 fw-medium border hover-lift"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-indigo rounded-pill px-4 shadow-sm fw-medium hover-lift"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCustomers;
