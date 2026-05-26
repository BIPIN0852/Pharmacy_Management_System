// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   Search,
//   Filter,
//   Plus,
//   MoreVertical,
//   MessageSquare,
//   Edit3,
//   AlertCircle,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   CheckCircle,
//   User,
//   Star,
//   Archive,
//   Trash2,
//   Send,
//   Mail,
// } from "lucide-react";
// import { Dropdown, Modal, Button, Form } from "react-bootstrap";

// const AdminCustomers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [pagination, setPagination] = useState({});
//   const [activeTab, setActiveTab] = useState("all");
//   const [sortBy, setSortBy] = useState("newest"); // Filter/Sort State

//   // Modal States
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showMessageModal, setShowMessageModal] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   // Form States
//   const [editForm, setEditForm] = useState({});
//   const [addForm, setAddForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   });
//   const [messageForm, setMessageForm] = useState({ subject: "", body: "" });

//   // ==========================================
//   // FETCH LOGIC
//   // ==========================================
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
//       setPagination(
//         res.data?.pagination || {
//           total: Array.isArray(data) ? data.length : 0,
//           pages: 1,
//         },
//       );
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

//   // ==========================================
//   // TAB & FILTER LOGIC (FRONTEND)
//   // ==========================================
//   let displayedCustomers = customers.filter((c) => {
//     if (activeTab === "fav") return c.isFavourite && !c.isArchived;
//     if (activeTab === "archived") return c.isArchived;
//     return !c.isArchived; // 'all' tab shows unarchived
//   });

//   // Sorting Logic for the Filter Button
//   if (sortBy === "spendHigh")
//     displayedCustomers.sort(
//       (a, b) => (b.totalSpent || 0) - (a.totalSpent || 0),
//     );
//   if (sortBy === "pointsHigh")
//     displayedCustomers.sort(
//       (a, b) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0),
//     );
//   if (sortBy === "nameAsc")
//     displayedCustomers.sort((a, b) =>
//       (a.name || "").localeCompare(b.name || ""),
//     );

//   const favCount = customers.filter(
//     (c) => c.isFavourite && !c.isArchived,
//   ).length;
//   const archCount = customers.filter((c) => c.isArchived).length;
//   const allCount = customers.filter((c) => !c.isArchived).length;

//   // ==========================================
//   // CRUD & ACTIONS
//   // ==========================================

//   // Add Contact
//   const handleAddSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Assuming a generic user creation endpoint
//       await api.post(`/users`, { ...addForm, role: "customer" });
//       setSuccess("New contact added successfully!");
//       setShowAddModal(false);
//       setAddForm({ name: "", email: "", phone: "", password: "" });
//       fetchCustomers(page, search);
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to add contact");
//     }
//   };

//   // Edit Contact
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
//       await api.put(`/users/${selectedCustomer._id}`, editForm);
//       setSuccess("Customer profile updated successfully");
//       setShowEditModal(false);
//       fetchCustomers(page, search);
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update customer");
//     }
//   };

//   // Toggle Favourite / Archive
//   const toggleStatus = async (customer, field, value) => {
//     try {
//       // Optimistic UI update
//       setCustomers(
//         customers.map((c) =>
//           c._id === customer._id ? { ...c, [field]: value } : c,
//         ),
//       );
//       await api.put(`/users/${customer._id}`, { [field]: value });
//     } catch (err) {
//       fetchCustomers(page, search); // Revert on failure
//       setError("Failed to update status");
//     }
//   };

//   // Delete Contact
//   const handleDelete = async (id) => {
//     if (
//       window.confirm(
//         "Are you sure you want to permanently delete this customer? This action cannot be undone.",
//       )
//     ) {
//       try {
//         await api.delete(`/users/${id}`);
//         setSuccess("Customer deleted successfully");
//         fetchCustomers(page, search);
//         setTimeout(() => setSuccess(""), 3000);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to delete customer");
//       }
//     }
//   };

//   // Send Message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     try {
//       // Assuming a generic message endpoint or email service
//       await api.post(`/messages/send`, {
//         userId: selectedCustomer._id,
//         subject: messageForm.subject,
//         body: messageForm.body,
//       });
//       setSuccess(`Message sent to ${selectedCustomer.name}`);
//       setShowMessageModal(false);
//       setMessageForm({ subject: "", body: "" });
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to send message. Ensure email service is configured.",
//       );
//     }
//   };

//   if (loading && customers.length === 0) {
//     return (
//       <div
//         className="d-flex flex-column justify-content-center align-items-center vh-100"
//         style={{ backgroundColor: "#f0f2f2" }}
//       >
//         <Loader2
//           className="spin-animation mb-3"
//           style={{ color: "#007185" }}
//           size={40}
//         />
//         <span className="fw-semibold text-muted small text-uppercase tracking-wider">
//           Loading Contacts...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="container-fluid py-4 px-md-4 min-vh-100 animate-fade-in"
//       style={{ backgroundColor: "#f0f2f2" }}
//     >
//       {/* Alerts */}
//       {error && (
//         <div
//           className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 shadow-sm rounded-1 border-0 mb-3"
//           style={{
//             backgroundColor: "#fef0f0",
//             color: "#B12704",
//             borderLeft: "4px solid #B12704",
//           }}
//         >
//           <AlertCircle size={18} />{" "}
//           <span className="small fw-medium">{error}</span>
//         </div>
//       )}
//       {success && (
//         <div
//           className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 shadow-sm rounded-1 border-0 mb-3"
//           style={{
//             backgroundColor: "#f2fcf5",
//             color: "#067D62",
//             borderLeft: "4px solid #067D62",
//           }}
//         >
//           <CheckCircle size={18} />{" "}
//           <span className="small fw-medium">{success}</span>
//         </div>
//       )}

//       {/* Main Card */}
//       <div
//         className="card border shadow-sm rounded-1 bg-white overflow-hidden"
//         style={{ borderColor: "#D5D9D9" }}
//       >
//         {/* Top Action Bar */}
//         <div className="p-4 pb-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
//           <div>
//             <h4 className="fw-bold mb-1" style={{ color: "#0F1111" }}>
//               Customer Directory
//             </h4>
//             <p className="text-muted small mb-0">
//               Manage patients, profiles, and communications.
//             </p>
//           </div>

//           <div className="d-flex align-items-center gap-3">
//             <form onSubmit={handleSearch} className="position-relative">
//               <Search
//                 size={16}
//                 className="position-absolute top-50 translate-middle-y text-muted"
//                 style={{ left: "12px" }}
//               />
//               <input
//                 type="text"
//                 className="form-control rounded-1 bg-light border-1 ps-5 shadow-none custom-search-input"
//                 style={{
//                   width: "250px",
//                   fontSize: "0.9rem",
//                   borderColor: "#D5D9D9",
//                 }}
//                 placeholder="Search contact, email..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </form>

//             {/* FILTER DROPDOWN */}
//             <Dropdown align="end">
//               <Dropdown.Toggle
//                 variant="light"
//                 className="btn bg-white rounded-1 border px-3 d-flex align-items-center gap-2 small fw-medium shadow-sm hover-lift text-dark hide-caret"
//                 style={{ borderColor: "#D5D9D9" }}
//               >
//                 <Filter size={16} className="text-muted" /> Filter
//               </Dropdown.Toggle>
//               <Dropdown.Menu className="shadow-sm border-secondary-subtle rounded-1 mt-1">
//                 <Dropdown.Header className="text-uppercase tracking-wider small fw-bold">
//                   Sort By
//                 </Dropdown.Header>
//                 <Dropdown.Item
//                   onClick={() => setSortBy("newest")}
//                   className="small"
//                 >
//                   Newest First
//                 </Dropdown.Item>
//                 <Dropdown.Item
//                   onClick={() => setSortBy("spendHigh")}
//                   className="small"
//                 >
//                   Highest Spend (Financials)
//                 </Dropdown.Item>
//                 <Dropdown.Item
//                   onClick={() => setSortBy("pointsHigh")}
//                   className="small"
//                 >
//                   Highest Loyalty Points
//                 </Dropdown.Item>
//                 <Dropdown.Item
//                   onClick={() => setSortBy("nameAsc")}
//                   className="small"
//                 >
//                   Alphabetical (A-Z)
//                 </Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>

//             {/*ADD CONTACT BUTTON */}
//             <button
//               className="btn rounded-1 px-3 d-flex align-items-center gap-2 fw-medium shadow-sm border-0 hover-lift"
//               style={{ backgroundColor: "#007185", color: "#fff" }}
//               onClick={() => setShowAddModal(true)}
//             >
//               <Plus size={18} /> Add Contact
//             </button>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="px-4 mt-4 border-bottom d-flex gap-4">
//           <div
//             className={`pb-2 cursor-pointer fw-semibold tab-item ${activeTab === "all" ? "active-tab" : "text-muted"}`}
//             onClick={() => setActiveTab("all")}
//           >
//             All Contacts ({allCount})
//           </div>
//           <div
//             className={`pb-2 cursor-pointer fw-semibold tab-item d-flex align-items-center gap-1 ${activeTab === "fav" ? "active-tab" : "text-muted"}`}
//             onClick={() => setActiveTab("fav")}
//           >
//             <Star
//               size={14}
//               className={activeTab === "fav" ? "fill-accent" : ""}
//             />{" "}
//             Favourites ({favCount})
//           </div>
//           <div
//             className={`pb-2 cursor-pointer fw-semibold tab-item d-flex align-items-center gap-1 ${activeTab === "archived" ? "active-tab" : "text-muted"}`}
//             onClick={() => setActiveTab("archived")}
//           >
//             <Archive size={14} /> Archived ({archCount})
//           </div>
//         </div>

//         {/* Data Table */}
//         <div
//           className="table-responsive p-0 custom-scrollbar"
//           style={{ minHeight: "400px" }}
//         >
//           <table className="table align-middle mb-0 custom-saas-table">
//             <thead className="bg-light">
//               <tr>
//                 <th className="ps-4" style={{ width: "40px" }}>
//                   <input
//                     type="checkbox"
//                     className="form-check-input shadow-none custom-checkbox cursor-pointer"
//                   />
//                 </th>
//                 <th className="small text-muted text-uppercase fw-bold tracking-wider">
//                   Name
//                 </th>
//                 <th className="small text-muted text-uppercase fw-bold tracking-wider">
//                   Points / ID
//                 </th>
//                 <th className="small text-muted text-uppercase fw-bold tracking-wider">
//                   Email
//                 </th>
//                 <th className="small text-muted text-uppercase fw-bold tracking-wider">
//                   Phone Number
//                 </th>
//                 <th className="small text-muted text-uppercase fw-bold tracking-wider">
//                   Financials
//                 </th>
//                 <th className="text-end pe-4 small text-muted text-uppercase fw-bold tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {displayedCustomers.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="text-center py-5">
//                     <User size={48} className="text-muted opacity-25 mb-3" />
//                     <p className="text-muted fw-medium mb-0">
//                       No customers found in this view.
//                     </p>
//                   </td>
//                 </tr>
//               ) : (
//                 displayedCustomers.map((customer) => (
//                   <tr
//                     key={customer._id}
//                     className="table-row-hover border-bottom border-light-subtle"
//                   >
//                     <td className="ps-4">
//                       <input
//                         type="checkbox"
//                         className="form-check-input shadow-none custom-checkbox cursor-pointer"
//                       />
//                     </td>
//                     <td>
//                       <div className="d-flex align-items-center gap-3 py-2">
//                         <div
//                           className="avatar-circle fw-bold d-flex align-items-center justify-content-center shadow-sm position-relative"
//                           style={{
//                             backgroundImage: `url('https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}&backgroundColor=007185&textColor=ffffff')`,
//                           }}
//                         >
//                           {customer.isFavourite && (
//                             <div
//                               className="position-absolute"
//                               style={{ top: "-5px", right: "-5px" }}
//                             >
//                               <Star
//                                 size={14}
//                                 className="text-warning fill-warning drop-shadow"
//                               />
//                             </div>
//                           )}
//                         </div>
//                         <span
//                           className={`fw-bold ${customer.isArchived ? "text-muted text-decoration-line-through" : "text-dark"}`}
//                           style={{ fontSize: "0.95rem" }}
//                         >
//                           {customer.name || "Unknown"}
//                         </span>
//                       </div>
//                     </td>
//                     <td
//                       className="text-muted fw-medium"
//                       style={{ fontSize: "0.9rem" }}
//                     >
//                       <span
//                         className="badge bg-light text-dark border"
//                         style={{ borderColor: "#D5D9D9" }}
//                       >
//                         {customer.loyaltyPoints || 0} PTS
//                       </span>
//                     </td>
//                     <td
//                       className="text-muted fw-medium"
//                       style={{ fontSize: "0.9rem" }}
//                     >
//                       {customer.email}
//                     </td>
//                     <td
//                       className="text-muted fw-medium"
//                       style={{ fontSize: "0.9rem" }}
//                     >
//                       {customer.phone || "-"}
//                     </td>
//                     <td>
//                       <div
//                         className="fw-bold"
//                         style={{ color: "#B12704", fontSize: "0.95rem" }}
//                       >
//                         Rs.{" "}
//                         {Number(customer.totalSpent || 0).toLocaleString(
//                           "en-US",
//                           {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           },
//                         )}
//                       </div>
//                     </td>
//                     <td className="pe-4 text-end">
//                       <Dropdown align="end">
//                         <Dropdown.Toggle
//                           variant="link"
//                           className="btn btn-sm text-muted shadow-none p-0 hide-caret"
//                         >
//                           <MoreVertical size={20} />
//                         </Dropdown.Toggle>
//                         <Dropdown.Menu
//                           className="shadow border-0 rounded-1 py-2"
//                           style={{ border: "1px solid #D5D9D9 !important" }}
//                         >
//                           {/* ACTION MENUS */}
//                           <Dropdown.Item
//                             className="small fw-medium d-flex align-items-center gap-2 py-2 text-dark"
//                             onClick={() => {
//                               setSelectedCustomer(customer);
//                               setShowMessageModal(true);
//                             }}
//                           >
//                             <Mail size={14} style={{ color: "#007185" }} /> Send
//                             Message
//                           </Dropdown.Item>
//                           <Dropdown.Item
//                             className="small fw-medium d-flex align-items-center gap-2 py-2 text-dark"
//                             onClick={() => openEditModal(customer)}
//                           >
//                             <Edit3 size={14} style={{ color: "#F3A847" }} />{" "}
//                             Edit Contact
//                           </Dropdown.Item>

//                           <Dropdown.Divider />

//                           <Dropdown.Item
//                             className="small fw-medium d-flex align-items-center gap-2 py-2 text-dark"
//                             onClick={() =>
//                               toggleStatus(
//                                 customer,
//                                 "isFavourite",
//                                 !customer.isFavourite,
//                               )
//                             }
//                           >
//                             <Star
//                               size={14}
//                               className={
//                                 customer.isFavourite
//                                   ? "text-warning fill-warning"
//                                   : "text-muted"
//                               }
//                             />
//                             {customer.isFavourite
//                               ? "Remove Favourite"
//                               : "Add to Favourites"}
//                           </Dropdown.Item>
//                           <Dropdown.Item
//                             className="small fw-medium d-flex align-items-center gap-2 py-2 text-dark"
//                             onClick={() =>
//                               toggleStatus(
//                                 customer,
//                                 "isArchived",
//                                 !customer.isArchived,
//                               )
//                             }
//                           >
//                             <Archive size={14} className="text-secondary" />
//                             {customer.isArchived
//                               ? "Unarchive Customer"
//                               : "Archive Customer"}
//                           </Dropdown.Item>

//                           <Dropdown.Divider />

//                           <Dropdown.Item
//                             className="small fw-bold d-flex align-items-center gap-2 py-2 text-danger"
//                             onClick={() => handleDelete(customer._id)}
//                           >
//                             <Trash2 size={14} /> Delete Customer
//                           </Dropdown.Item>
//                         </Dropdown.Menu>
//                       </Dropdown>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pagination.pages > 1 && (
//           <div className="p-3 border-top d-flex justify-content-between align-items-center bg-light bg-opacity-50">
//             <span className="small text-muted fw-medium ps-2">
//               Showing Page <strong className="text-dark">{page}</strong> of{" "}
//               <strong className="text-dark">{pagination.pages}</strong>
//             </span>
//             <div className="d-flex gap-2 pe-2">
//               <button
//                 className="btn btn-sm bg-white border d-flex align-items-center justify-content-center shadow-sm"
//                 style={{
//                   width: "32px",
//                   height: "32px",
//                   borderRadius: "4px",
//                   borderColor: "#D5D9D9",
//                 }}
//                 disabled={page === 1}
//                 onClick={() => handlePageChange(page - 1)}
//               >
//                 <ChevronLeft size={16} className="text-dark" />
//               </button>
//               <button
//                 className="btn btn-sm bg-white border d-flex align-items-center justify-content-center shadow-sm"
//                 style={{
//                   width: "32px",
//                   height: "32px",
//                   borderRadius: "4px",
//                   borderColor: "#D5D9D9",
//                 }}
//                 disabled={page === pagination.pages}
//                 onClick={() => handlePageChange(page + 1)}
//               >
//                 <ChevronRight size={16} className="text-dark" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ========================================================================= */}
//       {/* MODALS */}
//       {/* ========================================================================= */}

//       {/* 1. ADD CONTACT MODAL */}
//       <Modal
//         show={showAddModal}
//         onHide={() => setShowAddModal(false)}
//         centered
//         contentClassName="border-0 shadow-lg rounded-1"
//       >
//         <Modal.Header className="bg-light border-bottom p-4 pb-3" closeButton>
//           <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2 fs-5">
//             <User size={20} style={{ color: "#007185" }} /> Add New Contact
//           </Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleAddSubmit}>
//           <Modal.Body className="p-4 bg-white">
//             <div className="mb-3">
//               <label className="form-label small fw-bold">Full Name</label>
//               <input
//                 type="text"
//                 required
//                 className="form-control shadow-none rounded-1 modern-input"
//                 value={addForm.name}
//                 onChange={(e) =>
//                   setAddForm({ ...addForm, name: e.target.value })
//                 }
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label small fw-bold">Email Address</label>
//               <input
//                 type="email"
//                 required
//                 className="form-control shadow-none rounded-1 modern-input"
//                 value={addForm.email}
//                 onChange={(e) =>
//                   setAddForm({ ...addForm, email: e.target.value })
//                 }
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label small fw-bold">Phone Number</label>
//               <input
//                 type="text"
//                 className="form-control shadow-none rounded-1 modern-input"
//                 value={addForm.phone}
//                 onChange={(e) =>
//                   setAddForm({ ...addForm, phone: e.target.value })
//                 }
//               />
//             </div>
//             <div className="mb-1">
//               <label className="form-label small fw-bold">
//                 Temporary Password
//               </label>
//               <input
//                 type="password"
//                 required
//                 className="form-control shadow-none rounded-1 modern-input"
//                 placeholder="Set initial password"
//                 value={addForm.password}
//                 onChange={(e) =>
//                   setAddForm({ ...addForm, password: e.target.value })
//                 }
//               />
//             </div>
//           </Modal.Body>
//           <Modal.Footer className="bg-light border-top p-3 d-flex justify-content-end gap-2">
//             <Button
//               variant="light"
//               className="rounded-1 px-4 fw-medium border shadow-sm"
//               onClick={() => setShowAddModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="primary"
//               className="rounded-1 px-4 shadow-sm fw-medium border-0"
//               style={{ backgroundColor: "#007185" }}
//             >
//               Create Profile
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>

//       {/* 2. EDIT CONTACT MODAL */}
//       <Modal
//         show={showEditModal}
//         onHide={() => setShowEditModal(false)}
//         centered
//         contentClassName="border-0 shadow-lg rounded-1"
//       >
//         <Modal.Header className="bg-light border-bottom p-4 pb-3" closeButton>
//           <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2 fs-5">
//             <Edit3 size={20} style={{ color: "#007185" }} /> Edit Contact Info
//           </Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleEditSubmit}>
//           <Modal.Body className="p-4 bg-white">
//             <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-1 border bg-light">
//               <div
//                 className="avatar-circle-lg border shadow-sm"
//                 style={{
//                   backgroundImage: `url('https://api.dicebear.com/7.x/initials/svg?seed=${selectedCustomer?.name}&backgroundColor=007185&textColor=ffffff')`,
//                 }}
//               ></div>
//               <div>
//                 <h5 className="fw-bold mb-0 text-dark">
//                   {selectedCustomer?.name}
//                 </h5>
//                 <div className="text-muted small">
//                   {selectedCustomer?.email}
//                 </div>
//               </div>
//             </div>
//             <div className="row g-3 mb-3">
//               <div className="col-md-6">
//                 <label className="form-label small fw-bold">
//                   Loyalty Points
//                 </label>
//                 <input
//                   type="number"
//                   className="form-control modern-input shadow-none rounded-1 border"
//                   value={editForm.loyaltyPoints}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, loyaltyPoints: e.target.value })
//                   }
//                 />
//               </div>
//               <div className="col-md-6">
//                 <label className="form-label small fw-bold">
//                   Preferred Contact
//                 </label>
//                 <select
//                   className="form-select modern-input shadow-none rounded-1 border cursor-pointer"
//                   value={editForm.preferredContact}
//                   onChange={(e) =>
//                     setEditForm({
//                       ...editForm,
//                       preferredContact: e.target.value,
//                     })
//                   }
//                 >
//                   <option value="email">Email</option>
//                   <option value="sms">SMS</option>
//                   <option value="phone">Phone Call</option>
//                 </select>
//               </div>
//             </div>
//             <div className="mb-3">
//               <label className="form-label small fw-bold">
//                 Health Allergies / Flags
//               </label>
//               <input
//                 type="text"
//                 className="form-control modern-input shadow-none rounded-1 border"
//                 placeholder="Leave blank if none"
//                 value={editForm.allergies}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, allergies: e.target.value })
//                 }
//               />
//             </div>
//             <div className="mb-1">
//               <label className="form-label small fw-bold">Internal Notes</label>
//               <textarea
//                 className="form-control modern-input shadow-none rounded-1 border"
//                 rows="3"
//                 placeholder="Add internal admin notes..."
//                 value={editForm.notes}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, notes: e.target.value })
//                 }
//               ></textarea>
//             </div>
//           </Modal.Body>
//           <Modal.Footer className="bg-light border-top p-3 d-flex justify-content-end gap-2">
//             <Button
//               variant="light"
//               className="rounded-1 px-4 fw-medium border shadow-sm"
//               onClick={() => setShowEditModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="warning"
//               className="rounded-1 px-4 shadow-sm fw-medium border-0"
//               style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
//             >
//               Save Changes
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>

//       {/* 3. SEND MESSAGE MODAL */}
//       <Modal
//         show={showMessageModal}
//         onHide={() => setShowMessageModal(false)}
//         centered
//         contentClassName="border-0 shadow-lg rounded-1"
//       >
//         <Modal.Header className="bg-light border-bottom p-4 pb-3" closeButton>
//           <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2 fs-5">
//             <Send size={20} style={{ color: "#007185" }} /> Compose Message
//           </Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleSendMessage}>
//           <Modal.Body className="p-4 bg-white">
//             <div className="mb-3 small">
//               <span className="text-muted fw-bold">To: </span>{" "}
//               <span className="badge bg-secondary text-white rounded-1">
//                 {selectedCustomer?.email}
//               </span>
//             </div>
//             <div className="mb-3">
//               <label className="form-label small fw-bold">Subject</label>
//               <input
//                 type="text"
//                 required
//                 className="form-control shadow-none rounded-1 modern-input"
//                 placeholder="Enter message subject"
//                 value={messageForm.subject}
//                 onChange={(e) =>
//                   setMessageForm({ ...messageForm, subject: e.target.value })
//                 }
//               />
//             </div>
//             <div className="mb-1">
//               <label className="form-label small fw-bold">Message</label>
//               <textarea
//                 required
//                 className="form-control shadow-none rounded-1 modern-input"
//                 rows="5"
//                 placeholder="Type your message here..."
//                 value={messageForm.body}
//                 onChange={(e) =>
//                   setMessageForm({ ...messageForm, body: e.target.value })
//                 }
//               ></textarea>
//             </div>
//           </Modal.Body>
//           <Modal.Footer className="bg-light border-top p-3 d-flex justify-content-end gap-2">
//             <Button
//               variant="light"
//               className="rounded-1 px-4 fw-medium border shadow-sm"
//               onClick={() => setShowMessageModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="primary"
//               className="rounded-1 px-4 shadow-sm fw-medium border-0 d-flex align-items-center gap-2"
//               style={{ backgroundColor: "#007185" }}
//             >
//               <Send size={16} /> Send Now
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>

//       {/* --- ALL CUSTOM STYLES NEEDED --- */}
//       <style>{`
//         .tracking-wider { letter-spacing: 0.05em; }
//         .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

//         .spin-animation { animation: spin 1s linear infinite; }
//         @keyframes spin { 100% { transform: rotate(360deg); } }

//         .hover-lift { transition: transform 0.15s ease, box-shadow 0.15s ease; }
//         .hover-lift:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important; }

//         .custom-search-input:focus { border-color: #e47911 !important; box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; }
//         .modern-input:focus { border-color: #e47911 !important; box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; }

//         .tab-item { border-bottom: 2px solid transparent; transition: all 0.2s; font-size: 0.95rem; }
//         .active-tab { color: #007185 !important; border-bottom: 2px solid #007185 !important; }
//         .fill-accent { fill: #007185; }

//         .table-row-hover:hover { background-color: #f8f9fa; }

//         .custom-checkbox { width: 1.1em; height: 1.1em; }
//         .custom-checkbox:checked { background-color: #007185; border-color: #007185; }

//         .avatar-circle { width: 38px; height: 38px; border-radius: 50%; background-size: cover; background-position: center; }
//         .avatar-circle-lg { width: 56px; height: 56px; border-radius: 50%; background-size: cover; background-position: center; }

//         .hide-caret::after { display: none !important; }
//         .dropdown-item:hover { background-color: #f8f9fa; cursor: pointer; }
//         .drop-shadow { filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2)); }
//       `}</style>
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
  Edit3,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  User,
  Star,
  Archive,
  Trash2,
  Send,
  Mail,
} from "lucide-react";
import { Dropdown, Modal, Button } from "react-bootstrap";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // Inline modal error — separate from global error
  const [modalError, setModalError] = useState("");

  // Form States
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [messageForm, setMessageForm] = useState({ subject: "", body: "" });

  // ==========================================
  // FETCH LOGIC
  // ==========================================
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
      setPagination(
        res.data?.pagination || {
          total: Array.isArray(data) ? data.length : 0,
          pages: 1,
        },
      );
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

  // ==========================================
  // TAB & FILTER LOGIC
  // ==========================================
  let displayedCustomers = customers.filter((c) => {
    if (activeTab === "fav") return c.isFavourite && !c.isArchived;
    if (activeTab === "archived") return c.isArchived;
    return !c.isArchived;
  });

  if (sortBy === "spendHigh")
    displayedCustomers.sort(
      (a, b) => (b.totalSpent || 0) - (a.totalSpent || 0),
    );
  if (sortBy === "pointsHigh")
    displayedCustomers.sort(
      (a, b) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0),
    );
  if (sortBy === "nameAsc")
    displayedCustomers.sort((a, b) =>
      (a.name || "").localeCompare(b.name || ""),
    );

  const favCount = customers.filter(
    (c) => c.isFavourite && !c.isArchived,
  ).length;
  const archCount = customers.filter((c) => c.isArchived).length;
  const allCount = customers.filter((c) => !c.isArchived).length;

  // ==========================================
  // CRUD & ACTIONS
  // ==========================================

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/users`, { ...addForm, role: "customer" });
      setSuccess("New contact added successfully!");
      setShowAddModal(false);
      setAddForm({ name: "", email: "", phone: "", password: "" });
      fetchCustomers(page, search);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add contact");
    }
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
      await api.put(`/users/${selectedCustomer._id}`, editForm);
      setSuccess("Customer profile updated successfully");
      setShowEditModal(false);
      fetchCustomers(page, search);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update customer");
    }
  };

  const toggleStatus = async (customer, field, value) => {
    try {
      setCustomers(
        customers.map((c) =>
          c._id === customer._id ? { ...c, [field]: value } : c,
        ),
      );
      await api.put(`/users/${customer._id}`, { [field]: value });
    } catch (err) {
      fetchCustomers(page, search);
      setError("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this customer? This action cannot be undone.",
      )
    ) {
      try {
        await api.delete(`/users/${id}`);
        setSuccess("Customer deleted successfully");
        fetchCustomers(page, search);
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete customer");
      }
    }
  };

  // ==========================================
  // SEND MESSAGE — FULLY FIXED
  // Uses onClick directly on the button instead of Form onSubmit
  // to avoid Bootstrap Modal footer being outside the Form DOM tree
  // ==========================================
  const openMessageModal = (customer) => {
    setSelectedCustomer(customer);
    setMessageForm({ subject: "", body: "" });
    setModalError("");
    setIsSending(false);
    setShowMessageModal(true);
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setModalError("");
    setIsSending(false);
  };

  const handleSendMessage = async () => {
    // Validate — modal stays open, error shown inside
    if (!messageForm.subject.trim()) {
      setModalError("Subject is required.");
      return;
    }
    if (!messageForm.body.trim()) {
      setModalError("Message body is required.");
      return;
    }

    setModalError("");
    setIsSending(true);

    try {
      await api.post(`/messages/send`, {
        userId: selectedCustomer._id,
        subject: messageForm.subject.trim(),
        body: messageForm.body.trim(),
      });
      setSuccess(`Message sent to ${selectedCustomer.name}`);
      closeMessageModal();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("=== SEND MESSAGE ERROR DEBUG ===");
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      console.error("Error message:", err.message);
      console.error("Full error:", err);
      setIsSending(false);
      setModalError(
        err.response?.data?.message ||
          "Failed to send message. Please ensure the email service is configured.",
      );
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (loading && customers.length === 0) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <Loader2
          className="spin-animation mb-3"
          style={{ color: "#007185" }}
          size={40}
        />
        <span className="fw-semibold text-muted small text-uppercase tracking-wider">
          Loading Contacts...
        </span>
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-4 px-md-4 min-vh-100 animate-fade-in"
      style={{ backgroundColor: "#f0f2f2" }}
    >
      {/* Global Alerts */}
      {error && (
        <div
          className="alert d-flex align-items-center gap-2 py-2 px-3 shadow-sm rounded-1 border-0 mb-3"
          style={{
            backgroundColor: "#fef0f0",
            color: "#B12704",
            borderLeft: "4px solid #B12704",
          }}
        >
          <AlertCircle size={18} />
          <span className="small fw-medium">{error}</span>
        </div>
      )}
      {success && (
        <div
          className="alert d-flex align-items-center gap-2 py-2 px-3 shadow-sm rounded-1 border-0 mb-3"
          style={{
            backgroundColor: "#f2fcf5",
            color: "#067D62",
            borderLeft: "4px solid #067D62",
          }}
        >
          <CheckCircle size={18} />
          <span className="small fw-medium">{success}</span>
        </div>
      )}

      {/* Main Card */}
      <div
        className="card border shadow-sm rounded-1 bg-white overflow-hidden"
        style={{ borderColor: "#D5D9D9" }}
      >
        {/* Top Action Bar */}
        <div className="p-4 pb-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h4 className="fw-bold mb-1" style={{ color: "#0F1111" }}>
              Customer Directory
            </h4>
            <p className="text-muted small mb-0">
              Manage patients, profiles, and communications.
            </p>
          </div>

          <div className="d-flex align-items-center gap-3">
            <form onSubmit={handleSearch} className="position-relative">
              <Search
                size={16}
                className="position-absolute top-50 translate-middle-y text-muted"
                style={{ left: "12px" }}
              />
              <input
                type="text"
                className="form-control rounded-1 bg-light border-1 ps-5 shadow-none custom-search-input"
                style={{
                  width: "250px",
                  fontSize: "0.9rem",
                  borderColor: "#D5D9D9",
                }}
                placeholder="Search contact, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                className="btn bg-white rounded-1 border px-3 d-flex align-items-center gap-2 small fw-medium shadow-sm hover-lift text-dark hide-caret"
                style={{ borderColor: "#D5D9D9" }}
              >
                <Filter size={16} className="text-muted" /> Filter
              </Dropdown.Toggle>
              <Dropdown.Menu className="shadow-sm border-secondary-subtle rounded-1 mt-1">
                <Dropdown.Header className="text-uppercase tracking-wider small fw-bold">
                  Sort By
                </Dropdown.Header>
                <Dropdown.Item
                  onClick={() => setSortBy("newest")}
                  className="small"
                >
                  Newest First
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy("spendHigh")}
                  className="small"
                >
                  Highest Spend (Financials)
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy("pointsHigh")}
                  className="small"
                >
                  Highest Loyalty Points
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSortBy("nameAsc")}
                  className="small"
                >
                  Alphabetical (A-Z)
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <button
              className="btn rounded-1 px-3 d-flex align-items-center gap-2 fw-medium shadow-sm border-0 hover-lift"
              style={{ backgroundColor: "#007185", color: "#fff" }}
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} /> Add Contact
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 mt-4 border-bottom d-flex gap-4">
          <div
            className={`pb-2 cursor-pointer fw-semibold tab-item ${activeTab === "all" ? "active-tab" : "text-muted"}`}
            onClick={() => setActiveTab("all")}
          >
            All Contacts ({allCount})
          </div>
          <div
            className={`pb-2 cursor-pointer fw-semibold tab-item d-flex align-items-center gap-1 ${activeTab === "fav" ? "active-tab" : "text-muted"}`}
            onClick={() => setActiveTab("fav")}
          >
            <Star
              size={14}
              className={activeTab === "fav" ? "fill-accent" : ""}
            />
            Favourites ({favCount})
          </div>
          <div
            className={`pb-2 cursor-pointer fw-semibold tab-item d-flex align-items-center gap-1 ${activeTab === "archived" ? "active-tab" : "text-muted"}`}
            onClick={() => setActiveTab("archived")}
          >
            <Archive size={14} /> Archived ({archCount})
          </div>
        </div>

        {/* Data Table */}
        <div
          className="table-responsive p-0 custom-scrollbar"
          style={{ minHeight: "400px" }}
        >
          <table className="table align-middle mb-0 custom-saas-table">
            <thead className="bg-light">
              <tr>
                <th className="ps-4" style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    className="form-check-input shadow-none custom-checkbox cursor-pointer"
                  />
                </th>
                <th className="small text-muted text-uppercase fw-bold tracking-wider">
                  Name
                </th>
                <th className="small text-muted text-uppercase fw-bold tracking-wider">
                  Points / ID
                </th>
                <th className="small text-muted text-uppercase fw-bold tracking-wider">
                  Email
                </th>
                <th className="small text-muted text-uppercase fw-bold tracking-wider">
                  Phone Number
                </th>
                <th className="small text-muted text-uppercase fw-bold tracking-wider">
                  Financials
                </th>
                <th className="text-end pe-4 small text-muted text-uppercase fw-bold tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <User size={48} className="text-muted opacity-25 mb-3" />
                    <p className="text-muted fw-medium mb-0">
                      No customers found in this view.
                    </p>
                  </td>
                </tr>
              ) : (
                displayedCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="table-row-hover border-bottom border-light-subtle"
                  >
                    <td className="ps-4">
                      <input
                        type="checkbox"
                        className="form-check-input shadow-none custom-checkbox cursor-pointer"
                      />
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-3 py-2">
                        <div
                          className="avatar-circle fw-bold d-flex align-items-center justify-content-center shadow-sm position-relative"
                          style={{
                            backgroundImage: `url('https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}&backgroundColor=007185&textColor=ffffff')`,
                          }}
                        >
                          {customer.isFavourite && (
                            <div
                              className="position-absolute"
                              style={{ top: "-5px", right: "-5px" }}
                            >
                              <Star
                                size={14}
                                className="text-warning fill-warning drop-shadow"
                              />
                            </div>
                          )}
                        </div>
                        <span
                          className={`fw-bold ${customer.isArchived ? "text-muted text-decoration-line-through" : "text-dark"}`}
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
                      <span
                        className="badge bg-light text-dark border"
                        style={{ borderColor: "#D5D9D9" }}
                      >
                        {customer.loyaltyPoints || 0} PTS
                      </span>
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
                        className="fw-bold"
                        style={{ color: "#B12704", fontSize: "0.95rem" }}
                      >
                        Rs.{" "}
                        {Number(customer.totalSpent || 0).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </div>
                    </td>
                    <td className="pe-4 text-end">
                      <Dropdown align="end">
                        <Dropdown.Toggle
                          variant="link"
                          className="btn btn-sm text-muted shadow-none p-0 hide-caret"
                        >
                          <MoreVertical size={20} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                          className="shadow border-0 rounded-1 py-2"
                          style={{ border: "1px solid #D5D9D9 !important" }}
                        >
                          <Dropdown.Item
                            className="small fw-medium d-flex align-items-center gap-2 py-2 text-dark"
                            onClick={() => openMessageModal(customer)}
                          >
                            <Mail size={14} style={{ color: "#007185" }} /> Send
                            Message
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="small fw-medium d-flex align-items-center gap-2 py-2 text-dark"
                            onClick={() => openEditModal(customer)}
                          >
                            <Edit3 size={14} style={{ color: "#F3A847" }} />{" "}
                            Edit Contact
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item
                            className="small fw-medium d-flex align-items-center gap-2 py-2 text-dark"
                            onClick={() =>
                              toggleStatus(
                                customer,
                                "isFavourite",
                                !customer.isFavourite,
                              )
                            }
                          >
                            <Star
                              size={14}
                              className={
                                customer.isFavourite
                                  ? "text-warning fill-warning"
                                  : "text-muted"
                              }
                            />
                            {customer.isFavourite
                              ? "Remove Favourite"
                              : "Add to Favourites"}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="small fw-medium d-flex align-items-center gap-2 py-2 text-dark"
                            onClick={() =>
                              toggleStatus(
                                customer,
                                "isArchived",
                                !customer.isArchived,
                              )
                            }
                          >
                            <Archive size={14} className="text-secondary" />
                            {customer.isArchived
                              ? "Unarchive Customer"
                              : "Archive Customer"}
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item
                            className="small fw-bold d-flex align-items-center gap-2 py-2 text-danger"
                            onClick={() => handleDelete(customer._id)}
                          >
                            <Trash2 size={14} /> Delete Customer
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-3 border-top d-flex justify-content-between align-items-center bg-light bg-opacity-50">
            <span className="small text-muted fw-medium ps-2">
              Showing Page <strong className="text-dark">{page}</strong> of{" "}
              <strong className="text-dark">{pagination.pages}</strong>
            </span>
            <div className="d-flex gap-2 pe-2">
              <button
                className="btn btn-sm bg-white border d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "4px",
                  borderColor: "#D5D9D9",
                }}
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                <ChevronLeft size={16} className="text-dark" />
              </button>
              <button
                className="btn btn-sm bg-white border d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "4px",
                  borderColor: "#D5D9D9",
                }}
                disabled={page === pagination.pages}
                onClick={() => handlePageChange(page + 1)}
              >
                <ChevronRight size={16} className="text-dark" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* MODALS                                                             */}
      {/* ================================================================= */}

      {/* 1. ADD CONTACT MODAL */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        contentClassName="border-0 shadow-lg rounded-1"
      >
        <Modal.Header className="bg-light border-bottom p-4 pb-3" closeButton>
          <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2 fs-5">
            <User size={20} style={{ color: "#007185" }} /> Add New Contact
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleAddSubmit}>
          <Modal.Body className="p-4 bg-white">
            <div className="mb-3">
              <label className="form-label small fw-bold">Full Name</label>
              <input
                type="text"
                required
                className="form-control shadow-none rounded-1 modern-input"
                value={addForm.name}
                onChange={(e) =>
                  setAddForm({ ...addForm, name: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Email Address</label>
              <input
                type="email"
                required
                className="form-control shadow-none rounded-1 modern-input"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm({ ...addForm, email: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Phone Number</label>
              <input
                type="text"
                className="form-control shadow-none rounded-1 modern-input"
                value={addForm.phone}
                onChange={(e) =>
                  setAddForm({ ...addForm, phone: e.target.value })
                }
              />
            </div>
            <div className="mb-1">
              <label className="form-label small fw-bold">
                Temporary Password
              </label>
              <input
                type="password"
                required
                className="form-control shadow-none rounded-1 modern-input"
                placeholder="Set initial password"
                value={addForm.password}
                onChange={(e) =>
                  setAddForm({ ...addForm, password: e.target.value })
                }
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-light border-top p-3 d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-light rounded-1 px-4 fw-medium border shadow-sm"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn rounded-1 px-4 shadow-sm fw-medium border-0"
              style={{ backgroundColor: "#007185", color: "#fff" }}
            >
              Create Profile
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* 2. EDIT CONTACT MODAL */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        contentClassName="border-0 shadow-lg rounded-1"
      >
        <Modal.Header className="bg-light border-bottom p-4 pb-3" closeButton>
          <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2 fs-5">
            <Edit3 size={20} style={{ color: "#007185" }} /> Edit Contact Info
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleEditSubmit}>
          <Modal.Body className="p-4 bg-white">
            <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-1 border bg-light">
              <div
                className="avatar-circle-lg border shadow-sm"
                style={{
                  backgroundImage: `url('https://api.dicebear.com/7.x/initials/svg?seed=${selectedCustomer?.name}&backgroundColor=007185&textColor=ffffff')`,
                }}
              ></div>
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  {selectedCustomer?.name}
                </h5>
                <div className="text-muted small">
                  {selectedCustomer?.email}
                </div>
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">
                  Loyalty Points
                </label>
                <input
                  type="number"
                  className="form-control modern-input shadow-none rounded-1 border"
                  value={editForm.loyaltyPoints}
                  onChange={(e) =>
                    setEditForm({ ...editForm, loyaltyPoints: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">
                  Preferred Contact
                </label>
                <select
                  className="form-select modern-input shadow-none rounded-1 border"
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
                  <option value="phone">Phone Call</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">
                Health Allergies / Flags
              </label>
              <input
                type="text"
                className="form-control modern-input shadow-none rounded-1 border"
                placeholder="Leave blank if none"
                value={editForm.allergies}
                onChange={(e) =>
                  setEditForm({ ...editForm, allergies: e.target.value })
                }
              />
            </div>
            <div className="mb-1">
              <label className="form-label small fw-bold">Internal Notes</label>
              <textarea
                className="form-control modern-input shadow-none rounded-1 border"
                rows="3"
                placeholder="Add internal admin notes..."
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm({ ...editForm, notes: e.target.value })
                }
              ></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-light border-top p-3 d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-light rounded-1 px-4 fw-medium border shadow-sm"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn rounded-1 px-4 shadow-sm fw-medium border-0"
              style={{ backgroundColor: "#FFD814", color: "#0F1111" }}
            >
              Save Changes
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* 3. SEND MESSAGE MODAL — ROOT FIX: no <Form>, button uses onClick directly */}
      <Modal
        show={showMessageModal}
        onHide={closeMessageModal}
        centered
        contentClassName="border-0 shadow-lg rounded-1"
      >
        <Modal.Header className="bg-light border-bottom p-4 pb-3" closeButton>
          <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2 fs-5">
            <Send size={20} style={{ color: "#007185" }} /> Compose Message
          </Modal.Title>
        </Modal.Header>

        {/* No <form> or <Form> wrapper — avoids the Bootstrap Modal footer DOM issue */}
        <Modal.Body className="p-4 bg-white">
          {/* Inline validation / API error — stays inside modal */}
          {modalError && (
            <div
              className="d-flex align-items-center gap-2 py-2 px-3 rounded-1 mb-3"
              style={{
                backgroundColor: "#fef0f0",
                color: "#B12704",
                borderLeft: "4px solid #B12704",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              <AlertCircle size={16} />
              <span>{modalError}</span>
            </div>
          )}

          <div className="mb-3 small">
            <span className="text-muted fw-bold">To: </span>
            <span className="badge bg-secondary text-white rounded-1">
              {selectedCustomer?.email}
            </span>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">
              Subject <span style={{ color: "#B12704" }}>*</span>
            </label>
            <input
              type="text"
              className={`form-control shadow-none rounded-1 modern-input ${modalError && !messageForm.subject.trim() ? "border-danger" : ""}`}
              placeholder="Enter message subject"
              value={messageForm.subject}
              onChange={(e) => {
                setMessageForm({ ...messageForm, subject: e.target.value });
                if (modalError) setModalError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>

          <div className="mb-1">
            <label className="form-label small fw-bold">
              Message <span style={{ color: "#B12704" }}>*</span>
            </label>
            <textarea
              className={`form-control shadow-none rounded-1 modern-input ${modalError && !messageForm.body.trim() ? "border-danger" : ""}`}
              rows="5"
              placeholder="Type your message here..."
              value={messageForm.body}
              onChange={(e) => {
                setMessageForm({ ...messageForm, body: e.target.value });
                if (modalError) setModalError("");
              }}
            ></textarea>
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-light border-top p-3 d-flex justify-content-end gap-2">
          <Button
            variant="light"
            className="rounded-1 px-4 fw-medium border shadow-sm"
            onClick={closeMessageModal}
            disabled={isSending}
          >
            Cancel
          </Button>
          {/* onClick calls handleSendMessage directly — no form submit involved */}
          <Button
            className="rounded-1 px-4 shadow-sm fw-medium border-0 d-flex align-items-center gap-2"
            style={{ backgroundColor: "#007185", color: "#fff" }}
            onClick={handleSendMessage}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 size={15} className="spin-animation" /> Sending…
              </>
            ) : (
              <>
                <Send size={15} /> Send Now
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ================================================================= */}
      {/* STYLES                                                             */}
      {/* ================================================================= */}
      <style>{`
        .tracking-wider { letter-spacing: 0.05em; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .hover-lift { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .hover-lift:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important; }
        .custom-search-input:focus { border-color: #e47911 !important; box-shadow: 0 0 3px 2px rgba(228,121,17,.5) !important; }
        .modern-input:focus { border-color: #e47911 !important; box-shadow: 0 0 3px 2px rgba(228,121,17,.5) !important; }
        .tab-item { border-bottom: 2px solid transparent; transition: all 0.2s; font-size: 0.95rem; }
        .active-tab { color: #007185 !important; border-bottom: 2px solid #007185 !important; }
        .fill-accent { fill: #007185; }
        .table-row-hover:hover { background-color: #f8f9fa; }
        .custom-checkbox { width: 1.1em; height: 1.1em; }
        .custom-checkbox:checked { background-color: #007185; border-color: #007185; }
        .avatar-circle { width: 38px; height: 38px; border-radius: 50%; background-size: cover; background-position: center; }
        .avatar-circle-lg { width: 56px; height: 56px; border-radius: 50%; background-size: cover; background-position: center; }
        .hide-caret::after { display: none !important; }
        .dropdown-item:hover { background-color: #f8f9fa; cursor: pointer; }
        .drop-shadow { filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2)); }
      `}</style>
    </div>
  );
};

export default AdminCustomers;
