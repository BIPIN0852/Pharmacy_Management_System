// import React, { useEffect, useState } from "react";
// import api from "../services/api";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Row,
//   Col,
//   Badge,
//   InputGroup,
//   Spinner,
//   Alert,
// } from "react-bootstrap";
// import {
//   Plus,
//   Edit2,
//   Trash2,
//   Search,
//   Package,
//   FileText,
//   AlertTriangle,
// } from "lucide-react";

// // ✅ STANDARD CATEGORIES (Matching Backend and Customer Dashboard)
// const CATEGORIES = [
//   "Tablet",
//   "Capsule",
//   "Syrup",
//   "Injection",
//   "Ointment",
//   "Drops",
//   "Inhaler",
//   "Surgical",
//   "Device",
//   "Personal Care",
//   "General",
// ];

// const AdminMedicines = () => {
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Search & Filter State
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");

//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   // Form Data
//   const [formData, setFormData] = useState({
//     name: "",
//     manufacturer: "",
//     category: CATEGORIES[0],
//     price: "",
//     quantity: "",
//     batchNumber: "",
//     expiryDate: "",
//     description: "",
//     dosage: "",
//     sideEffects: "",
//     prescriptionRequired: false,
//     image: "",
//   });

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       name: "",
//       manufacturer: "",
//       category: CATEGORIES[0],
//       price: "",
//       quantity: "",
//       batchNumber: "",
//       expiryDate: "",
//       description: "",
//       dosage: "",
//       sideEffects: "",
//       prescriptionRequired: false,
//       image: "",
//     });
//   };

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       // ✅ Using real data from the /admin/medicines route we built
//       const res = await api.get("/admin/medicines");
//       const data = Array.isArray(res) ? res : res.data || [];
//       setMedicines(data);
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load database inventory.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMedicines();
//   }, []);

//   const openCreate = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const openEdit = (med) => {
//     const firstBatch = med.batches && med.batches[0];
//     setEditingId(med._id);
//     setFormData({
//       name: med.name || "",
//       manufacturer: med.brand || med.manufacturer || "",
//       category: med.category || CATEGORIES[0],
//       price: med.price || "",
//       quantity: med.countInStock ?? med.quantity ?? "",
//       batchNumber: firstBatch?.batchNumber || "",
//       expiryDate: firstBatch?.expiryDate
//         ? new Date(firstBatch.expiryDate).toISOString().substring(0, 10)
//         : "",
//       description: med.description || "",
//       dosage: med.dosage || "",
//       sideEffects: med.sideEffects || "",
//       prescriptionRequired: med.prescriptionRequired || false,
//       image: med.image || "",
//     });
//     setShowForm(true);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((f) => ({
//       ...f,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       setSaving(true);
//       const quantity = Number(formData.quantity || 0);

//       const payload = {
//         name: formData.name.trim(),
//         brand: formData.manufacturer.trim(),
//         category: formData.category,
//         price: Number(formData.price),
//         countInStock: quantity,
//         description: formData.description,
//         dosage: formData.dosage,
//         sideEffects: formData.sideEffects,
//         prescriptionRequired: formData.prescriptionRequired,
//         image: formData.image || "/images/sample.jpg",
//         batches: formData.batchNumber
//           ? [
//               {
//                 batchNumber: formData.batchNumber.trim(),
//                 expiryDate: formData.expiryDate || null,
//                 qty: quantity,
//               },
//             ]
//           : [],
//       };

//       if (editingId) {
//         await api.put(`/medicines/${editingId}`, payload);
//         setSuccess(`${formData.name} updated successfully.`);
//       } else {
//         await api.post("/medicines", payload);
//         setSuccess(`${formData.name} added to inventory.`);
//       }

//       setShowForm(false);
//       resetForm();
//       fetchMedicines();
//     } catch (err) {
//       setError(err.response?.data?.message || "Error connecting to database.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (
//       !window.confirm("Permanent Action: Delete this medicine from database?")
//     )
//       return;
//     try {
//       await api.delete(`/medicines/${id}`);
//       setSuccess("Item removed from catalog.");
//       fetchMedicines();
//     } catch (err) {
//       setError("Unauthorized or server error during deletion.");
//     }
//   };

//   const filteredMedicines = medicines.filter((m) => {
//     const matchSearch =
//       m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (m.brand && m.brand.toLowerCase().includes(searchTerm.toLowerCase()));
//     const matchCategory =
//       filterCategory === "All" || m.category === filterCategory;
//     return matchSearch && matchCategory;
//   });

//   return (
//     <div className="container-fluid p-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
//             <Package className="text-primary" /> Pharmacy Catalog
//           </h3>
//           <p className="text-muted mb-0">
//             Total Live Products: {medicines.length}
//           </p>
//         </div>
//         <Button
//           variant="primary"
//           onClick={openCreate}
//           className="rounded-pill px-4 shadow-sm"
//         >
//           <Plus size={18} className="me-1" /> New Item
//         </Button>
//       </div>

//       {error && (
//         <Alert
//           variant="danger"
//           className="border-0 shadow-sm"
//           dismissible
//           onClose={() => setError("")}
//         >
//           {error}
//         </Alert>
//       )}
//       {success && (
//         <Alert
//           variant="success"
//           className="border-0 shadow-sm"
//           dismissible
//           onClose={() => setSuccess("")}
//         >
//           {success}
//         </Alert>
//       )}

//       {/* Filter Bar */}
//       <div className="bg-white p-3 rounded-4 shadow-sm mb-4 border-0">
//         <Row className="g-3 align-items-center">
//           <Col md={6}>
//             <InputGroup className="bg-light rounded-pill overflow-hidden border">
//               <InputGroup.Text className="bg-transparent border-0 ps-3">
//                 <Search size={18} className="text-muted" />
//               </InputGroup.Text>
//               <Form.Control
//                 placeholder="Search by name or brand..."
//                 className="bg-transparent border-0 py-2 shadow-none"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </InputGroup>
//           </Col>
//           <Col md={3}>
//             <Form.Select
//               className="rounded-pill border shadow-none"
//               value={filterCategory}
//               onChange={(e) => setFilterCategory(e.target.value)}
//             >
//               <option value="All">All Categories</option>
//               {CATEGORIES.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </Form.Select>
//           </Col>
//         </Row>
//       </div>

//       {/* Table Section */}
//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="grow" variant="primary" />
//           <p className="mt-3 text-muted fw-medium">
//             Syncing database inventory...
//           </p>
//         </div>
//       ) : filteredMedicines.length === 0 ? (
//         <div className="text-center py-5 bg-white rounded-4 shadow-sm border-0">
//           <Package size={60} className="text-muted mb-3 opacity-25" />
//           <h5 className="text-muted">No medicines found matching criteria.</h5>
//         </div>
//       ) : (
//         <div className="bg-white rounded-4 shadow-sm border-0 overflow-hidden">
//           <Table hover responsive className="align-middle mb-0">
//             <thead className="bg-light border-bottom">
//               <tr className="small text-uppercase fw-bold text-muted">
//                 <th className="ps-4 py-3">Medicine</th>
//                 <th className="py-3">Category</th>
//                 <th className="py-3">Stock Level</th>
//                 <th className="py-3">Unit Price</th>
//                 <th className="py-3">Regulations</th>
//                 <th className="text-end pe-4 py-3">Management</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredMedicines.map((m) => (
//                 <tr key={m._id}>
//                   <td className="ps-4">
//                     <div className="fw-bold text-dark">{m.name}</div>
//                     <div className="small text-muted">
//                       {m.brand || m.manufacturer}
//                     </div>
//                   </td>
//                   <td>
//                     <Badge
//                       bg="primary"
//                       className="bg-opacity-10 text-primary border border-primary-subtle px-2 py-1"
//                     >
//                       {m.category}
//                     </Badge>
//                   </td>
//                   <td>
//                     <div
//                       className={`fw-bold ${
//                         m.countInStock < 10 ? "text-danger" : "text-success"
//                       }`}
//                     >
//                       {m.countInStock ?? 0} Units
//                       {m.countInStock < 10 && (
//                         <AlertTriangle size={14} className="ms-1" />
//                       )}
//                     </div>
//                   </td>
//                   <td className="fw-bold">Rs. {m.price?.toLocaleString()}</td>
//                   <td>
//                     {m.prescriptionRequired ? (
//                       <Badge
//                         bg="warning-subtle"
//                         className="text-warning border border-warning-subtle"
//                       >
//                         <FileText size={12} className="me-1" /> Rx Required
//                       </Badge>
//                     ) : (
//                       <span className="text-muted small">OTC Item</span>
//                     )}
//                   </td>
//                   <td className="text-end pe-4">
//                     <div className="d-flex justify-content-end gap-2">
//                       <Button
//                         variant="light"
//                         size="sm"
//                         className="rounded-circle"
//                         onClick={() => openEdit(m)}
//                       >
//                         <Edit2 size={16} className="text-primary" />
//                       </Button>
//                       <Button
//                         variant="light"
//                         size="sm"
//                         className="rounded-circle"
//                         onClick={() => handleDelete(m._id)}
//                       >
//                         <Trash2 size={16} className="text-danger" />
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       )}

//       {/* Modal Form */}
//       <Modal
//         show={showForm}
//         onHide={() => !saving && setShowForm(false)}
//         size="lg"
//         centered
//         backdrop="static"
//       >
//         <Modal.Header closeButton className="border-0 pb-0">
//           <Modal.Title className="fw-bold">
//             {editingId ? "Edit Item Record" : "Add Inventory Item"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="p-4">
//           <Form onSubmit={handleSubmit}>
//             <Row className="g-3">
//               <Col md={6}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Medicine Name
//                 </Form.Label>
//                 <Form.Control
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </Col>
//               <Col md={6}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Manufacturer/Brand
//                 </Form.Label>
//                 <Form.Control
//                   name="manufacturer"
//                   value={formData.manufacturer}
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Category
//                 </Form.Label>
//                 <Form.Select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                 >
//                   {CATEGORIES.map((cat) => (
//                     <option key={cat} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Col>
//               <Col md={4}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Price (Rs)
//                 </Form.Label>
//                 <Form.Control
//                   type="number"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleChange}
//                   required
//                 />
//               </Col>
//               <Col md={4}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Opening Stock
//                 </Form.Label>
//                 <Form.Control
//                   type="number"
//                   name="quantity"
//                   value={formData.quantity}
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={12}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Product Description
//                 </Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={2}
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Dosage Guidelines
//                 </Form.Label>
//                 <Form.Control
//                   name="dosage"
//                   value={formData.dosage}
//                   onChange={handleChange}
//                   placeholder="e.g. twice daily"
//                 />
//               </Col>
//               <Col md={6} className="d-flex align-items-center pt-4">
//                 <Form.Check
//                   type="switch"
//                   id="rx-switch"
//                   label="Require Prescription"
//                   name="prescriptionRequired"
//                   checked={formData.prescriptionRequired}
//                   onChange={handleChange}
//                   className="text-danger fw-bold"
//                 />
//               </Col>
//               <Col md={6}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Batch ID
//                 </Form.Label>
//                 <Form.Control
//                   size="sm"
//                   name="batchNumber"
//                   value={formData.batchNumber}
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Expiry Date
//                 </Form.Label>
//                 <Form.Control
//                   size="sm"
//                   type="date"
//                   name="expiryDate"
//                   value={formData.expiryDate}
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>
//             <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
//               <Button
//                 variant="light"
//                 className="rounded-pill px-4"
//                 onClick={() => setShowForm(false)}
//                 disabled={saving}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="primary"
//                 type="submit"
//                 className="rounded-pill px-4 shadow-sm"
//                 disabled={saving}
//               >
//                 {saving ? (
//                   <Spinner size="sm" />
//                 ) : editingId ? (
//                   "Update Database"
//                 ) : (
//                   "Save to Inventory"
//                 )}
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default AdminMedicines;

// import React, { useEffect, useState } from "react";
// import api from "../services/api";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Row,
//   Col,
//   Badge,
//   InputGroup,
//   Spinner,
//   Alert,
// } from "react-bootstrap";
// import {
//   Plus,
//   Edit2,
//   Trash2,
//   Search,
//   Package,
//   FileText,
//   AlertTriangle,
// } from "lucide-react";

// // ✅ STANDARD CATEGORIES (Matching Backend and Customer Dashboard)
// const CATEGORIES = [
//   "Tablet",
//   "Capsule",
//   "Syrup",
//   "Injection",
//   "Ointment",
//   "Drops",
//   "Inhaler",
//   "Surgical",
//   "Device",
//   "Personal Care",
//   "General",
// ];

// const AdminMedicines = () => {
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Search & Filter State
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");

//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   // Image Upload State
//   const [uploadingImage, setUploadingImage] = useState(false);

//   // Form Data
//   const [formData, setFormData] = useState({
//     name: "",
//     manufacturer: "",
//     category: CATEGORIES[0],
//     price: "",
//     quantity: "",
//     batchNumber: "",
//     expiryDate: "",
//     description: "",
//     dosage: "",
//     sideEffects: "",
//     prescriptionRequired: false,
//     image: "",
//   });

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({
//       name: "",
//       manufacturer: "",
//       category: CATEGORIES[0],
//       price: "",
//       quantity: "",
//       batchNumber: "",
//       expiryDate: "",
//       description: "",
//       dosage: "",
//       sideEffects: "",
//       prescriptionRequired: false,
//       image: "",
//     });
//   };

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       // Using real data from the /admin/medicines route we built
//       const res = await api.get("/admin/medicines");
//       const data = Array.isArray(res) ? res : res.data || [];
//       setMedicines(data);
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to load database inventory.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMedicines();
//   }, []);

//   // --- IMAGE UPLOAD HANDLER ---
//   const uploadFileHandler = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const uploadData = new FormData();
//     uploadData.append("image", file);
//     setUploadingImage(true);

//     try {
//       // Using your existing api axios instance
//       const { data } = await api.post("/upload", uploadData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Safely grab the returned image URL from your backend
//       setFormData((prev) => ({
//         ...prev,
//         image: data.imagePath || data.url || data.image || data,
//       }));

//       setSuccess("Image uploaded successfully!");
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert(err.response?.data?.message || "Image upload failed");
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const openCreate = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const openEdit = (med) => {
//     const firstBatch = med.batches && med.batches[0];
//     setEditingId(med._id);
//     setFormData({
//       name: med.name || "",
//       manufacturer: med.brand || med.manufacturer || "",
//       category: med.category || CATEGORIES[0],
//       price: med.price || "",
//       quantity: med.countInStock ?? med.quantity ?? "",
//       batchNumber: firstBatch?.batchNumber || "",
//       expiryDate: firstBatch?.expiryDate
//         ? new Date(firstBatch.expiryDate).toISOString().substring(0, 10)
//         : "",
//       description: med.description || "",
//       dosage: med.dosage || "",
//       sideEffects: med.sideEffects || "",
//       prescriptionRequired: med.prescriptionRequired || false,
//       image: med.image || "",
//     });
//     setShowForm(true);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((f) => ({
//       ...f,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       setSaving(true);
//       const quantity = Number(formData.quantity || 0);

//       const payload = {
//         name: formData.name.trim(),
//         brand: formData.manufacturer.trim(),
//         category: formData.category,
//         price: Number(formData.price),
//         countInStock: quantity,
//         description: formData.description,
//         dosage: formData.dosage,
//         sideEffects: formData.sideEffects,
//         prescriptionRequired: formData.prescriptionRequired,
//         image: formData.image || "/images/sample.jpg",
//         batches: formData.batchNumber
//           ? [
//               {
//                 batchNumber: formData.batchNumber.trim(),
//                 expiryDate: formData.expiryDate || null,
//                 qty: quantity,
//               },
//             ]
//           : [],
//       };

//       if (editingId) {
//         await api.put(`/medicines/${editingId}`, payload);
//         setSuccess(`${formData.name} updated successfully.`);
//       } else {
//         await api.post("/medicines", payload);
//         setSuccess(`${formData.name} added to inventory.`);
//       }

//       setShowForm(false);
//       resetForm();
//       fetchMedicines();
//     } catch (err) {
//       setError(err.response?.data?.message || "Error connecting to database.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (
//       !window.confirm("Permanent Action: Delete this medicine from database?")
//     )
//       return;
//     try {
//       await api.delete(`/medicines/${id}`);
//       setSuccess("Item removed from catalog.");
//       fetchMedicines();
//     } catch (err) {
//       setError("Unauthorized or server error during deletion.");
//     }
//   };

//   const filteredMedicines = medicines.filter((m) => {
//     const matchSearch =
//       m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (m.brand && m.brand.toLowerCase().includes(searchTerm.toLowerCase()));
//     const matchCategory =
//       filterCategory === "All" || m.category === filterCategory;
//     return matchSearch && matchCategory;
//   });

//   return (
//     <div className="container-fluid p-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
//             <Package className="text-primary" /> Pharmacy Catalog
//           </h3>
//           <p className="text-muted mb-0">
//             Total Live Products: {medicines.length}
//           </p>
//         </div>
//         <Button
//           variant="primary"
//           onClick={openCreate}
//           className="rounded-pill px-4 shadow-sm"
//         >
//           <Plus size={18} className="me-1" /> New Item
//         </Button>
//       </div>

//       {error && (
//         <Alert
//           variant="danger"
//           className="border-0 shadow-sm"
//           dismissible
//           onClose={() => setError("")}
//         >
//           {error}
//         </Alert>
//       )}
//       {success && (
//         <Alert
//           variant="success"
//           className="border-0 shadow-sm"
//           dismissible
//           onClose={() => setSuccess("")}
//         >
//           {success}
//         </Alert>
//       )}

//       {/* Filter Bar */}
//       <div className="bg-white p-3 rounded-4 shadow-sm mb-4 border-0">
//         <Row className="g-3 align-items-center">
//           <Col md={6}>
//             <InputGroup className="bg-light rounded-pill overflow-hidden border">
//               <InputGroup.Text className="bg-transparent border-0 ps-3">
//                 <Search size={18} className="text-muted" />
//               </InputGroup.Text>
//               <Form.Control
//                 placeholder="Search by name or brand..."
//                 className="bg-transparent border-0 py-2 shadow-none"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </InputGroup>
//           </Col>
//           <Col md={3}>
//             <Form.Select
//               className="rounded-pill border shadow-none"
//               value={filterCategory}
//               onChange={(e) => setFilterCategory(e.target.value)}
//             >
//               <option value="All">All Categories</option>
//               {CATEGORIES.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </Form.Select>
//           </Col>
//         </Row>
//       </div>

//       {/* Table Section */}
//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="grow" variant="primary" />
//           <p className="mt-3 text-muted fw-medium">
//             Syncing database inventory...
//           </p>
//         </div>
//       ) : filteredMedicines.length === 0 ? (
//         <div className="text-center py-5 bg-white rounded-4 shadow-sm border-0">
//           <Package size={60} className="text-muted mb-3 opacity-25" />
//           <h5 className="text-muted">No medicines found matching criteria.</h5>
//         </div>
//       ) : (
//         <div className="bg-white rounded-4 shadow-sm border-0 overflow-hidden">
//           <Table hover responsive className="align-middle mb-0">
//             <thead className="bg-light border-bottom">
//               <tr className="small text-uppercase fw-bold text-muted">
//                 <th className="ps-4 py-3">Medicine</th>
//                 <th className="py-3">Category</th>
//                 <th className="py-3">Stock Level</th>
//                 <th className="py-3">Unit Price</th>
//                 <th className="py-3">Regulations</th>
//                 <th className="text-end pe-4 py-3">Management</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredMedicines.map((m) => (
//                 <tr key={m._id}>
//                   <td className="ps-4">
//                     <div className="fw-bold text-dark">{m.name}</div>
//                     <div className="small text-muted">
//                       {m.brand || m.manufacturer}
//                     </div>
//                   </td>
//                   <td>
//                     <Badge
//                       bg="primary"
//                       className="bg-opacity-10 text-primary border border-primary-subtle px-2 py-1"
//                     >
//                       {m.category}
//                     </Badge>
//                   </td>
//                   <td>
//                     <div
//                       className={`fw-bold ${
//                         m.countInStock < 10 ? "text-danger" : "text-success"
//                       }`}
//                     >
//                       {m.countInStock ?? 0} Units
//                       {m.countInStock < 10 && (
//                         <AlertTriangle size={14} className="ms-1" />
//                       )}
//                     </div>
//                   </td>
//                   <td className="fw-bold">Rs. {m.price?.toLocaleString()}</td>
//                   <td>
//                     {m.prescriptionRequired ? (
//                       <Badge
//                         bg="warning-subtle"
//                         className="text-warning border border-warning-subtle"
//                       >
//                         <FileText size={12} className="me-1" /> Rx Required
//                       </Badge>
//                     ) : (
//                       <span className="text-muted small">OTC Item</span>
//                     )}
//                   </td>
//                   <td className="text-end pe-4">
//                     <div className="d-flex justify-content-end gap-2">
//                       <Button
//                         variant="light"
//                         size="sm"
//                         className="rounded-circle"
//                         onClick={() => openEdit(m)}
//                       >
//                         <Edit2 size={16} className="text-primary" />
//                       </Button>
//                       <Button
//                         variant="light"
//                         size="sm"
//                         className="rounded-circle"
//                         onClick={() => handleDelete(m._id)}
//                       >
//                         <Trash2 size={16} className="text-danger" />
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       )}

//       {/* Modal Form */}
//       <Modal
//         show={showForm}
//         onHide={() => !saving && setShowForm(false)}
//         size="lg"
//         centered
//         backdrop="static"
//       >
//         <Modal.Header closeButton className="border-0 pb-0">
//           <Modal.Title className="fw-bold">
//             {editingId ? "Edit Item Record" : "Add Inventory Item"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="p-4">
//           <Form onSubmit={handleSubmit}>
//             <Row className="g-3">
//               <Col md={6}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Medicine Name
//                 </Form.Label>
//                 <Form.Control
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </Col>
//               <Col md={6}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Manufacturer/Brand
//                 </Form.Label>
//                 <Form.Control
//                   name="manufacturer"
//                   value={formData.manufacturer}
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Category
//                 </Form.Label>
//                 <Form.Select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                 >
//                   {CATEGORIES.map((cat) => (
//                     <option key={cat} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Col>
//               <Col md={4}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Price (Rs)
//                 </Form.Label>
//                 <Form.Control
//                   type="number"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleChange}
//                   required
//                 />
//               </Col>
//               <Col md={4}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Opening Stock
//                 </Form.Label>
//                 <Form.Control
//                   type="number"
//                   name="quantity"
//                   value={formData.quantity}
//                   onChange={handleChange}
//                 />
//               </Col>

//               <Col md={12}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Product Description
//                 </Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={2}
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                 />
//               </Col>

//               {/* ✅ ADDED: IMAGE UPLOAD FIELD */}
//               <Col md={12}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Product Image
//                 </Form.Label>
//                 <Form.Control
//                   type="file"
//                   accept="image/*"
//                   onChange={uploadFileHandler}
//                   className="shadow-none rounded-2 border-light-subtle bg-light"
//                 />
//                 {uploadingImage && (
//                   <div className="mt-2 text-primary small d-flex align-items-center gap-2">
//                     <Spinner animation="border" size="sm" /> Uploading to
//                     server...
//                   </div>
//                 )}
//                 {formData.image && !uploadingImage && (
//                   <div className="mt-2 small text-success fw-medium">
//                     ✓ Image attached: {formData.image.split("/").pop()}
//                   </div>
//                 )}
//               </Col>

//               <Col md={6}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Dosage Guidelines
//                 </Form.Label>
//                 <Form.Control
//                   name="dosage"
//                   value={formData.dosage}
//                   onChange={handleChange}
//                   placeholder="e.g. twice daily"
//                 />
//               </Col>
//               <Col md={6} className="d-flex align-items-center pt-4">
//                 <Form.Check
//                   type="switch"
//                   id="rx-switch"
//                   label="Require Prescription"
//                   name="prescriptionRequired"
//                   checked={formData.prescriptionRequired}
//                   onChange={handleChange}
//                   className="text-danger fw-bold"
//                 />
//               </Col>
//               <Col md={6}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Batch ID
//                 </Form.Label>
//                 <Form.Control
//                   size="sm"
//                   name="batchNumber"
//                   value={formData.batchNumber}
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <Form.Label className="small fw-bold text-muted">
//                   Expiry Date
//                 </Form.Label>
//                 <Form.Control
//                   size="sm"
//                   type="date"
//                   name="expiryDate"
//                   value={formData.expiryDate}
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>
//             <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
//               <Button
//                 variant="light"
//                 className="rounded-pill px-4"
//                 onClick={() => setShowForm(false)}
//                 disabled={saving}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="primary"
//                 type="submit"
//                 className="rounded-pill px-4 shadow-sm"
//                 disabled={saving || uploadingImage}
//               >
//                 {saving ? (
//                   <Spinner size="sm" />
//                 ) : editingId ? (
//                   "Update Database"
//                 ) : (
//                   "Save to Inventory"
//                 )}
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default AdminMedicines;

import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  FileText,
  AlertTriangle,
} from "lucide-react";

// ✅ STANDARD CATEGORIES (Matching Backend and Customer Dashboard)
const CATEGORIES = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Ointment",
  "Drops",
  "Inhaler",
  "Surgical",
  "Device",
  "Personal Care",
  "General",
];

const AdminMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    category: CATEGORIES[0],
    price: "",
    quantity: "",
    batchNumber: "",
    expiryDate: "",
    description: "",
    dosage: "",
    sideEffects: "",
    prescriptionRequired: false,
    image: "",
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      manufacturer: "",
      category: CATEGORIES[0],
      price: "",
      quantity: "",
      batchNumber: "BATCH-1", // Default to prevent wiping stock
      expiryDate: "",
      description: "",
      dosage: "",
      sideEffects: "",
      prescriptionRequired: false,
      image: "",
    });
  };

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/admin/medicines");
      const data = Array.isArray(res) ? res : res.data || [];
      setMedicines(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load database inventory.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // --- IMAGE UPLOAD HANDLER ---
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("image", file);
    setUploadingImage(true);

    try {
      const { data } = await api.post("/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData((prev) => ({
        ...prev,
        image: data.imagePath || data.url || data.image || data,
      }));

      setSuccess("Image uploaded successfully! Hit 'Update Database' to save.");
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (med) => {
    const firstBatch =
      med.batches && med.batches.length > 0 ? med.batches[0] : null;
    setEditingId(med._id);

    // ✅ FIXED: Safely load countInStock and default to BATCH-1 if missing
    setFormData({
      name: med.name || "",
      manufacturer: med.brand || med.manufacturer || "",
      category: med.category || CATEGORIES[0],
      price: med.price || "",
      quantity:
        med.countInStock !== undefined ? med.countInStock : med.quantity || "",
      batchNumber: firstBatch?.batchNumber || "BATCH-1",
      expiryDate: firstBatch?.expiryDate
        ? new Date(firstBatch.expiryDate).toISOString().substring(0, 10)
        : "",
      description: med.description || "",
      dosage: med.dosage || "",
      sideEffects: med.sideEffects || "",
      prescriptionRequired: med.prescriptionRequired || false,
      image: med.image || "",
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);
      const quantity = Number(formData.quantity || 0);

      const payload = {
        name: formData.name.trim(),
        brand: formData.manufacturer.trim(),
        category: formData.category,
        price: Number(formData.price),
        countInStock: quantity,
        description: formData.description,
        dosage: formData.dosage,
        sideEffects: formData.sideEffects,
        prescriptionRequired: formData.prescriptionRequired,
        image: formData.image || "/images/sample.jpg",

        // ✅ FIXED: Always send at least one batch to prevent stock from being wiped to 0
        batches: [
          {
            batchNumber: formData.batchNumber.trim() || "BATCH-1",
            expiryDate: formData.expiryDate || null,
            qty: quantity,
          },
        ],
      };

      if (editingId) {
        await api.put(`/medicines/${editingId}`, payload);
        setSuccess(`${formData.name} updated successfully.`);
      } else {
        await api.post("/medicines", payload);
        setSuccess(`${formData.name} added to inventory.`);
      }

      setShowForm(false);
      resetForm();
      fetchMedicines();
    } catch (err) {
      setError(err.response?.data?.message || "Error connecting to database.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Permanent Action: Delete this medicine from database?")
    )
      return;
    try {
      await api.delete(`/medicines/${id}`);
      setSuccess("Item removed from catalog.");
      fetchMedicines();
    } catch (err) {
      setError("Unauthorized or server error during deletion.");
    }
  };

  const filteredMedicines = medicines.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.brand && m.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory =
      filterCategory === "All" || m.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Package className="text-primary" /> Pharmacy Catalog
          </h3>
          <p className="text-muted mb-0">
            Total Live Products: {medicines.length}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openCreate}
          className="rounded-pill px-4 shadow-sm"
        >
          <Plus size={18} className="me-1" /> New Item
        </Button>
      </div>

      {error && (
        <Alert
          variant="danger"
          className="border-0 shadow-sm"
          dismissible
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          variant="success"
          className="border-0 shadow-sm"
          dismissible
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-4 shadow-sm mb-4 border-0">
        <Row className="g-3 align-items-center">
          <Col md={6}>
            <InputGroup className="bg-light rounded-pill overflow-hidden border">
              <InputGroup.Text className="bg-transparent border-0 ps-3">
                <Search size={18} className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search by name or brand..."
                className="bg-transparent border-0 py-2 shadow-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              className="rounded-pill border shadow-none"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="grow" variant="primary" />
          <p className="mt-3 text-muted fw-medium">
            Syncing database inventory...
          </p>
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm border-0">
          <Package size={60} className="text-muted mb-3 opacity-25" />
          <h5 className="text-muted">No medicines found matching criteria.</h5>
        </div>
      ) : (
        <div className="bg-white rounded-4 shadow-sm border-0 overflow-hidden">
          <Table hover responsive className="align-middle mb-0">
            <thead className="bg-light border-bottom">
              <tr className="small text-uppercase fw-bold text-muted">
                <th className="ps-4 py-3">Medicine</th>
                <th className="py-3">Category</th>
                <th className="py-3">Stock Level</th>
                <th className="py-3">Unit Price</th>
                <th className="py-3">Regulations</th>
                <th className="text-end pe-4 py-3">Management</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((m) => (
                <tr key={m._id}>
                  <td className="ps-4">
                    <div className="fw-bold text-dark">{m.name}</div>
                    <div className="small text-muted">
                      {m.brand || m.manufacturer}
                    </div>
                  </td>
                  <td>
                    <Badge
                      bg="primary"
                      className="bg-opacity-10 text-primary border border-primary-subtle px-2 py-1"
                    >
                      {m.category}
                    </Badge>
                  </td>
                  <td>
                    <div
                      className={`fw-bold ${
                        m.countInStock < 10 ? "text-danger" : "text-success"
                      }`}
                    >
                      {m.countInStock ?? 0} Units
                      {m.countInStock < 10 && (
                        <AlertTriangle size={14} className="ms-1" />
                      )}
                    </div>
                  </td>
                  <td className="fw-bold">Rs. {m.price?.toLocaleString()}</td>
                  <td>
                    {m.prescriptionRequired ? (
                      <Badge
                        bg="warning-subtle"
                        className="text-warning border border-warning-subtle"
                      >
                        <FileText size={12} className="me-1" /> Rx Required
                      </Badge>
                    ) : (
                      <span className="text-muted small">OTC Item</span>
                    )}
                  </td>
                  <td className="text-end pe-4">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="light"
                        size="sm"
                        className="rounded-circle shadow-sm border"
                        onClick={() => openEdit(m)}
                      >
                        <Edit2 size={16} className="text-primary" />
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        className="rounded-circle shadow-sm border"
                        onClick={() => handleDelete(m._id)}
                      >
                        <Trash2 size={16} className="text-danger" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal Form */}
      <Modal
        show={showForm}
        onHide={() => !saving && setShowForm(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            {editingId ? "Edit Item Record" : "Add Inventory Item"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="small fw-bold text-muted">
                  Medicine Name
                </Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-bold text-muted">
                  Manufacturer/Brand
                </Form.Label>
                <Form.Control
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Label className="small fw-bold text-muted">
                  Category
                </Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label className="small fw-bold text-muted">
                  Price (Rs)
                </Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Label className="small fw-bold text-muted">
                  Total Stock
                </Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col md={12}>
                <Form.Label className="small fw-bold text-muted">
                  Product Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Col>

              {/* IMAGE UPLOAD FIELD */}
              <Col md={12}>
                <Form.Label className="small fw-bold text-muted">
                  Product Image
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="shadow-none rounded-2 border-light-subtle bg-light p-2"
                />
                {uploadingImage && (
                  <div className="mt-2 text-primary small d-flex align-items-center gap-2">
                    <Spinner animation="border" size="sm" /> Uploading to
                    server...
                  </div>
                )}
                {formData.image && !uploadingImage && (
                  <div className="mt-2 small text-success fw-medium">
                    ✓ Image attached successfully!
                  </div>
                )}
              </Col>

              <Col md={6}>
                <Form.Label className="small fw-bold text-muted">
                  Dosage Guidelines
                </Form.Label>
                <Form.Control
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  placeholder="e.g. twice daily"
                />
              </Col>
              <Col md={6} className="d-flex align-items-center pt-4">
                <Form.Check
                  type="switch"
                  id="rx-switch"
                  label="Require Prescription"
                  name="prescriptionRequired"
                  checked={formData.prescriptionRequired}
                  onChange={handleChange}
                  className="text-danger fw-bold"
                />
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-bold text-muted">
                  Batch ID
                </Form.Label>
                <Form.Control
                  size="sm"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  placeholder="e.g. BATCH-1"
                />
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-bold text-muted">
                  Expiry Date
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <Button
                variant="light"
                className="rounded-pill px-4 border"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="rounded-pill px-4 shadow-sm"
                disabled={saving || uploadingImage}
              >
                {saving ? (
                  <Spinner size="sm" />
                ) : editingId ? (
                  "Update Database"
                ) : (
                  "Save to Inventory"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminMedicines;
