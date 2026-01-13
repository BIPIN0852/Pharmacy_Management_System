// // import React, { useState, useEffect } from "react";
// // import {
// //   Container,
// //   Row,
// //   Col,
// //   Card,
// //   Button,
// //   Form,
// //   Modal,
// //   Badge,
// //   Spinner,
// //   Alert,
// // } from "react-bootstrap";
// // import {
// //   FileText,
// //   Upload,
// //   Trash2,
// //   Eye,
// //   Clock,
// //   CheckCircle,
// //   XCircle,
// //   Plus,
// // } from "lucide-react";
// // import { useNavigate } from "react-router-dom";

// // const API_BASE_URL = "http://localhost:5000/api";

// // const PrescriptionsPage = () => {
// //   const navigate = useNavigate();

// //   // --- State ---
// //   const [prescriptions, setPrescriptions] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   // Modal State
// //   const [showModal, setShowModal] = useState(false);
// //   const [uploadFile, setUploadFile] = useState(null);
// //   const [notes, setNotes] = useState("");
// //   const [uploading, setUploading] = useState(false);

// //   // --- 1. Fetch Prescriptions ---
// //   useEffect(() => {
// //     fetchPrescriptions();
// //   }, []);

// //   const fetchPrescriptions = async () => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       if (!token) {
// //         navigate("/login");
// //         return;
// //       }

// //       const res = await fetch(`${API_BASE_URL}/prescriptions/my`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (!res.ok) throw new Error("Failed to load prescriptions");

// //       const data = await res.json();
// //       setPrescriptions(data || []);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // --- 2. Handle File Upload ---
// //   const handleFileChange = (e) => {
// //     setUploadFile(e.target.files[0]);
// //   };

// //   const submitHandler = async (e) => {
// //     e.preventDefault();
// //     if (!uploadFile) {
// //       alert("Please select a file to upload.");
// //       return;
// //     }

// //     setUploading(true);
// //     const formData = new FormData();
// //     formData.append("prescriptionImage", uploadFile); // Must match backend multer field
// //     formData.append("notes", notes);

// //     try {
// //       const token = localStorage.getItem("token");
// //       const res = await fetch(`${API_BASE_URL}/prescriptions`, {
// //         method: "POST",
// //         headers: { Authorization: `Bearer ${token}` },
// //         body: formData, // Auto-sets Content-Type to multipart/form-data
// //       });

// //       if (!res.ok) throw new Error("Upload failed");

// //       // Success
// //       setShowModal(false);
// //       setUploadFile(null);
// //       setNotes("");
// //       fetchPrescriptions(); // Refresh list
// //       alert("Prescription uploaded successfully!");
// //     } catch (err) {
// //       alert(err.message);
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// //   // --- 3. Handle Delete ---
// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Are you sure you want to delete this?")) return;

// //     try {
// //       const token = localStorage.getItem("token");
// //       await fetch(`${API_BASE_URL}/prescriptions/${id}`, {
// //         method: "DELETE",
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       fetchPrescriptions();
// //     } catch (err) {
// //       alert("Failed to delete");
// //     }
// //   };

// //   // --- Helper: Status Badge ---
// //   const getStatusBadge = (status) => {
// //     switch (status) {
// //       case "Approved":
// //         return (
// //           <Badge bg="success">
// //             <CheckCircle size={12} /> Approved
// //           </Badge>
// //         );
// //       case "Rejected":
// //         return (
// //           <Badge bg="danger">
// //             <XCircle size={12} /> Rejected
// //           </Badge>
// //         );
// //       default:
// //         return (
// //           <Badge bg="warning" text="dark">
// //             <Clock size={12} /> Pending
// //           </Badge>
// //         );
// //     }
// //   };

// //   if (loading)
// //     return (
// //       <div className="text-center py-5">
// //         <Spinner animation="border" variant="primary" />
// //       </div>
// //     );

// //   return (
// //     <Container className="py-5">
// //       <div className="d-flex justify-content-between align-items-center mb-4">
// //         <div>
// //           <h2 className="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
// //             <FileText size={28} /> My Prescriptions
// //           </h2>
// //           <p className="text-muted mb-0">
// //             Upload prescriptions for medicines requiring approval.
// //           </p>
// //         </div>
// //         <Button
// //           variant="primary"
// //           className="d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm"
// //           onClick={() => setShowModal(true)}
// //         >
// //           <Upload size={18} /> Upload New
// //         </Button>
// //       </div>

// //       {error && <Alert variant="danger">{error}</Alert>}

// //       {prescriptions.length === 0 ? (
// //         <div className="text-center py-5 bg-light rounded-4 border-0">
// //           <div className="bg-white p-4 rounded-circle d-inline-block shadow-sm mb-3">
// //             <Upload size={48} className="text-muted opacity-50" />
// //           </div>
// //           <h4>No Prescriptions Yet</h4>
// //           <p className="text-muted">
// //             Upload a doctor's prescription to order restricted medicines.
// //           </p>
// //           <Button variant="outline-primary" onClick={() => setShowModal(true)}>
// //             Upload Now
// //           </Button>
// //         </div>
// //       ) : (
// //         <Row xs={1} md={2} lg={3} className="g-4">
// //           {prescriptions.map((pres) => (
// //             <Col key={pres._id}>
// //               <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden">
// //                 {/* Image Preview */}
// //                 <div
// //                   className="bg-light text-center p-3"
// //                   style={{ height: "180px" }}
// //                 >
// //                   <img
// //                     src={
// //                       pres.image ||
// //                       "https://placehold.co/400x300?text=Prescription"
// //                     }
// //                     alt="Prescription"
// //                     className="img-fluid h-100 object-fit-contain rounded shadow-sm"
// //                   />
// //                 </div>

// //                 <Card.Body>
// //                   <div className="d-flex justify-content-between align-items-start mb-2">
// //                     <span className="text-muted small">
// //                       {new Date(pres.createdAt).toLocaleDateString()}
// //                     </span>
// //                     {getStatusBadge(pres.status)}
// //                   </div>

// //                   {pres.notes && (
// //                     <p className="small text-muted bg-light p-2 rounded mb-3">
// //                       <strong>Note:</strong> {pres.notes}
// //                     </p>
// //                   )}

// //                   <div className="d-flex gap-2 mt-auto">
// //                     <Button
// //                       variant="outline-primary"
// //                       size="sm"
// //                       className="flex-grow-1"
// //                       onClick={() => window.open(pres.image, "_blank")}
// //                     >
// //                       <Eye size={16} className="me-1" /> View
// //                     </Button>

// //                     {pres.status === "Pending" && (
// //                       <Button
// //                         variant="outline-danger"
// //                         size="sm"
// //                         onClick={() => handleDelete(pres._id)}
// //                       >
// //                         <Trash2 size={16} />
// //                       </Button>
// //                     )}
// //                   </div>
// //                 </Card.Body>
// //               </Card>
// //             </Col>
// //           ))}
// //         </Row>
// //       )}

// //       {/* --- Upload Modal --- */}
// //       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
// //         <Modal.Header closeButton className="border-0">
// //           <Modal.Title className="fw-bold">Upload Prescription</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           <Form onSubmit={submitHandler}>
// //             <Form.Group className="mb-3">
// //               <Form.Label>Prescription Image</Form.Label>
// //               <Form.Control
// //                 type="file"
// //                 onChange={handleFileChange}
// //                 accept="image/*,application/pdf"
// //                 required
// //               />
// //               <Form.Text className="text-muted">
// //                 Supported: JPG, PNG, PDF (Max 5MB)
// //               </Form.Text>
// //             </Form.Group>

// //             <Form.Group className="mb-4">
// //               <Form.Label>Doctor's Instructions / Notes</Form.Label>
// //               <Form.Control
// //                 as="textarea"
// //                 rows={3}
// //                 placeholder="e.g. Please send 2 strips of Paracetamol..."
// //                 value={notes}
// //                 onChange={(e) => setNotes(e.target.value)}
// //               />
// //             </Form.Group>

// //             <div className="d-grid">
// //               <Button
// //                 variant="primary"
// //                 type="submit"
// //                 disabled={uploading}
// //                 className="rounded-pill fw-bold"
// //               >
// //                 {uploading ? (
// //                   <Spinner size="sm" animation="border" />
// //                 ) : (
// //                   <>
// //                     <Upload size={18} className="me-2" /> Submit Prescription
// //                   </>
// //                 )}
// //               </Button>
// //             </div>
// //           </Form>
// //         </Modal.Body>
// //       </Modal>
// //     </Container>
// //   );
// // };

// // export default PrescriptionsPage;

// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   Modal,
//   Badge,
//   Spinner,
//   Alert,
// } from "react-bootstrap";
// import {
//   FileText,
//   Upload,
//   Trash2,
//   Eye,
//   Clock,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const API_BASE_URL = "http://localhost:5000/api";

// const PrescriptionsPage = () => {
//   const navigate = useNavigate();

//   // --- State ---
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Modal State
//   const [showModal, setShowModal] = useState(false);
//   const [uploadFile, setUploadFile] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploading, setUploading] = useState(false);

//   // --- 1. Fetch Prescriptions ---
//   useEffect(() => {
//     fetchPrescriptions();
//   }, []);

//   const fetchPrescriptions = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       // Try fetching from the customer specific route first
//       let res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Fallback if that route doesn't exist
//       if (!res.ok) {
//         res = await fetch(`${API_BASE_URL}/prescriptions/my`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }

//       if (!res.ok) throw new Error("Failed to load prescriptions");

//       const data = await res.json();
//       // Handle different response structures: { prescriptions: [] } or []
//       setPrescriptions(data.prescriptions || data || []);
//     } catch (err) {
//       console.error(err);
//       setError("Could not load prescription history.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- 2. Handle File Upload ---
//   const handleFileChange = (e) => {
//     setUploadFile(e.target.files[0]);
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     if (!uploadFile) {
//       alert("Please select a file to upload.");
//       return;
//     }

//     setUploading(true);
//     const formData = new FormData();
//     // ✅ FIX: Changed to "image" to match typical backend expectations
//     formData.append("image", uploadFile);
//     formData.append("notes", notes);

//     try {
//       const token = localStorage.getItem("token");

//       // Try Posting to main prescriptions endpoint
//       const res = await fetch(`${API_BASE_URL}/prescriptions`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData, // Content-Type is set automatically
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Upload failed on server.");
//       }

//       // Success
//       setShowModal(false);
//       setUploadFile(null);
//       setNotes("");
//       fetchPrescriptions(); // Refresh list
//       alert("Prescription uploaded successfully!");
//     } catch (err) {
//       console.error(err);
//       alert(`Error: ${err.message}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   // --- 3. Handle Delete ---
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       await fetch(`${API_BASE_URL}/prescriptions/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchPrescriptions();
//     } catch (err) {
//       alert("Failed to delete");
//     }
//   };

//   // --- Helper: Status Badge ---
//   const getStatusBadge = (status) => {
//     switch (status?.toLowerCase()) {
//       case "approved":
//         return (
//           <Badge bg="success">
//             <CheckCircle size={12} /> Approved
//           </Badge>
//         );
//       case "rejected":
//         return (
//           <Badge bg="danger">
//             <XCircle size={12} /> Rejected
//           </Badge>
//         );
//       default:
//         return (
//           <Badge bg="warning" text="dark">
//             <Clock size={12} /> Pending
//           </Badge>
//         );
//     }
//   };

//   if (loading)
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );

//   return (
//     <Container fluid className="p-0">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h2 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
//             <FileText size={28} className="text-primary" /> My Prescriptions
//           </h2>
//           <p className="text-muted mb-0">Manage your uploaded prescriptions.</p>
//         </div>
//         <Button
//           variant="primary"
//           className="d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm"
//           onClick={() => setShowModal(true)}
//         >
//           <Upload size={18} /> Upload New
//         </Button>
//       </div>

//       {error && <Alert variant="danger">{error}</Alert>}

//       {prescriptions.length === 0 ? (
//         <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
//           <div className="bg-light p-4 rounded-circle d-inline-block mb-3">
//             <Upload size={48} className="text-muted opacity-50" />
//           </div>
//           <h4>No Prescriptions Yet</h4>
//           <p className="text-muted">
//             Upload a doctor's prescription to order restricted medicines.
//           </p>
//           <Button variant="outline-primary" onClick={() => setShowModal(true)}>
//             Upload Now
//           </Button>
//         </div>
//       ) : (
//         <Row xs={1} md={2} lg={3} className="g-4">
//           {prescriptions.map((pres) => (
//             <Col key={pres._id}>
//               <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden">
//                 {/* Image Preview */}
//                 <div
//                   className="bg-light text-center p-3 position-relative"
//                   style={{ height: "200px" }}
//                 >
//                   <img
//                     src={
//                       pres.image ||
//                       "https://via.placeholder.com/400x300?text=No+Image"
//                     }
//                     alt="Prescription"
//                     className="img-fluid h-100 object-fit-contain rounded shadow-sm"
//                   />
//                   <div className="position-absolute top-0 end-0 p-3">
//                     {getStatusBadge(pres.status)}
//                   </div>
//                 </div>

//                 <Card.Body>
//                   <div className="d-flex justify-content-between align-items-center mb-2">
//                     <small className="text-muted">
//                       {new Date(pres.createdAt).toLocaleDateString()}
//                     </small>
//                   </div>

//                   {pres.notes ? (
//                     <p className="small text-muted bg-light p-2 rounded mb-3 border">
//                       <strong>Note:</strong> {pres.notes}
//                     </p>
//                   ) : (
//                     <p className="small text-muted mb-3">No notes provided.</p>
//                   )}

//                   <div className="d-flex gap-2 mt-auto">
//                     <Button
//                       variant="outline-primary"
//                       size="sm"
//                       className="flex-grow-1"
//                       onClick={() => window.open(pres.image, "_blank")}
//                     >
//                       <Eye size={16} className="me-1" /> View
//                     </Button>

//                     {(!pres.status ||
//                       pres.status.toLowerCase() === "pending") && (
//                       <Button
//                         variant="outline-danger"
//                         size="sm"
//                         onClick={() => handleDelete(pres._id)}
//                       >
//                         <Trash2 size={16} />
//                       </Button>
//                     )}
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       )}

//       {/* --- Upload Modal --- */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton className="border-0">
//           <Modal.Title className="fw-bold">Upload Prescription</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={submitHandler}>
//             <Form.Group className="mb-3">
//               <Form.Label>Prescription Image</Form.Label>
//               <Form.Control
//                 type="file"
//                 onChange={handleFileChange}
//                 accept="image/*,application/pdf"
//                 required
//               />
//               <Form.Text className="text-muted">
//                 Supported: JPG, PNG, PDF (Max 5MB)
//               </Form.Text>
//             </Form.Group>

//             <Form.Group className="mb-4">
//               <Form.Label>Doctor's Instructions / Notes</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 placeholder="e.g. Please send 2 strips of Paracetamol..."
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//               />
//             </Form.Group>

//             <div className="d-grid">
//               <Button
//                 variant="primary"
//                 type="submit"
//                 disabled={uploading}
//                 className="rounded-pill fw-bold"
//               >
//                 {uploading ? (
//                   <Spinner size="sm" animation="border" />
//                 ) : (
//                   <>
//                     <Upload size={18} className="me-2" /> Submit Prescription
//                   </>
//                 )}
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default PrescriptionsPage;

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FileText,
  Upload,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import api from "../services/api"; // ✅ Using global API (Axios)

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      // ✅ Using /my endpoint which we created in prescriptionRoutes.js
      const { data } = await api.get("/prescriptions/my");
      setPrescriptions(data || []);
    } catch (err) {
      console.error(err);
      setError("Could not load prescription history.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", uploadFile); // Key matches backend multer config
    formData.append("notes", notes);

    try {
      // ✅ Axios handles Content-Type for FormData automatically
      await api.post("/prescriptions", formData);

      setShowModal(false);
      setUploadFile(null);
      setNotes("");
      fetchPrescriptions(); // Refresh list
      alert("Prescription uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await api.delete(`/prescriptions/${id}`);
      fetchPrescriptions();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // Helper for Badges
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <Badge bg="success">
            <CheckCircle size={12} /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge bg="danger">
            <XCircle size={12} /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge bg="warning" text="dark">
            <Clock size={12} /> Pending
          </Badge>
        );
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <FileText size={28} className="text-primary" /> My Prescriptions
          </h2>
          <p className="text-muted mb-0">Manage your uploaded prescriptions.</p>
        </div>
        <Button
          variant="primary"
          className="d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm"
          onClick={() => setShowModal(true)}
        >
          <Upload size={18} /> Upload New
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {prescriptions.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
          <div className="bg-light p-4 rounded-circle d-inline-block mb-3">
            <Upload size={48} className="text-muted opacity-50" />
          </div>
          <h4>No Prescriptions Yet</h4>
          <p className="text-muted">
            Upload a doctor's prescription to order restricted medicines.
          </p>
          <Button variant="outline-primary" onClick={() => setShowModal(true)}>
            Upload Now
          </Button>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {prescriptions.map((pres) => (
            <Col key={pres._id}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <div
                  className="bg-light text-center p-3 position-relative"
                  style={{ height: "200px" }}
                >
                  <img
                    // ✅ Fix image path: server stores relative path, ensuring localhost prefix if needed
                    src={
                      pres.imageUrl
                        ? `http://localhost:5000${pres.imageUrl}`
                        : pres.image
                    }
                    alt="Prescription"
                    className="img-fluid h-100 object-fit-contain rounded shadow-sm"
                  />
                  <div className="position-absolute top-0 end-0 p-3">
                    {getStatusBadge(pres.status)}
                  </div>
                </div>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">
                      {new Date(pres.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <p className="small text-muted bg-light p-2 rounded mb-3 border text-truncate">
                    <strong>Note:</strong> {pres.notes || "No notes"}
                  </p>
                  <div className="d-flex gap-2 mt-auto">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="flex-grow-1"
                      onClick={() =>
                        window.open(
                          `http://localhost:5000${pres.imageUrl}`,
                          "_blank"
                        )
                      }
                    >
                      <Eye size={16} className="me-1" /> View
                    </Button>
                    {pres.status?.toLowerCase() === "pending" && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(pres._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Upload Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Upload Prescription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Prescription Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="e.g. Please send 2 strips..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Form.Group>
            <div className="d-grid">
              <Button
                variant="primary"
                type="submit"
                disabled={uploading}
                className="rounded-pill fw-bold"
              >
                {uploading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <>
                    <Upload size={18} className="me-2" /> Submit
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PrescriptionsPage;
