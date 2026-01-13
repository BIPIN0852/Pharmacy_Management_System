// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   Badge,
//   InputGroup,
//   Spinner,
// } from "react-bootstrap";
// import {
//   Search,
//   Filter,
//   ShoppingCart,
//   Info,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// // Assuming you have this action created, otherwise I can provide it
// import { addToCart } from "../redux/actions/cartActions";

// const API_BASE_URL = "http://localhost:5000/api";

// const MedicineShop = () => {
//   const dispatch = useDispatch();

//   // --- State ---
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Filters
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [filterPrescription, setFilterPrescription] = useState("All"); // All, Required, NotRequired
//   const [showOutOfStock, setShowOutOfStock] = useState(true);

//   // --- Fetch Data ---
//   useEffect(() => {
//     const fetchMedicines = async () => {
//       try {
//         setLoading(true);
//         // Replace with your actual endpoint
//         const res = await fetch(`${API_BASE_URL}/medicines`);
//         if (!res.ok) throw new Error("Failed to fetch medicines");
//         const data = await res.json();
//         setMedicines(data.medicines || data); // Handle { medicines: [] } or []
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMedicines();
//   }, []);

//   // --- Filter Logic ---
//   const filteredMedicines = medicines.filter((med) => {
//     const matchesSearch =
//       med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       med.brand?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory =
//       filterCategory === "All" || med.category === filterCategory;

//     let matchesPrescription = true;
//     if (filterPrescription === "Required")
//       matchesPrescription = med.prescriptionRequired;
//     if (filterPrescription === "NotRequired")
//       matchesPrescription = !med.prescriptionRequired;

//     const matchesStock = showOutOfStock || med.countInStock > 0;

//     return (
//       matchesSearch && matchesCategory && matchesPrescription && matchesStock
//     );
//   });

//   // --- Handlers ---
//   const handleAddToCart = (med) => {
//     if (med.countInStock > 0) {
//       dispatch(addToCart(med._id, 1));
//       alert(`${med.name} added to cart!`);
//     }
//   };

//   if (loading)
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );
//   if (error)
//     return <div className="text-center py-5 text-danger">Error: {error}</div>;

//   return (
//     <Container className="py-5">
//       {/* Header & Search */}
//       <div className="mb-4">
//         <h2 className="fw-bold mb-3">Browse Medicines</h2>
//         <InputGroup className="shadow-sm">
//           <InputGroup.Text className="bg-white border-end-0">
//             <Search size={20} className="text-muted" />
//           </InputGroup.Text>
//           <Form.Control
//             type="text"
//             placeholder="Search by medicine name, brand, or category..."
//             className="border-start-0 py-2"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <Button variant="primary" className="px-4">
//             Search
//           </Button>
//         </InputGroup>
//       </div>

//       <Row>
//         {/* Sidebar Filters */}
//         <Col lg={3} className="mb-4">
//           <Card className="border-0 shadow-sm rounded-4 h-100">
//             <Card.Body className="p-4">
//               <h5 className="fw-bold mb-3 d-flex align-items-center">
//                 <Filter size={20} className="me-2 text-primary" /> Filters
//               </h5>

//               {/* Prescription Filter */}
//               <Form.Group className="mb-4">
//                 <Form.Label className="fw-bold small text-muted">
//                   Prescription
//                 </Form.Label>
//                 <Form.Select
//                   value={filterPrescription}
//                   onChange={(e) => setFilterPrescription(e.target.value)}
//                   className="shadow-sm"
//                 >
//                   <option value="All">All Types</option>
//                   <option value="Required">Prescription Required</option>
//                   <option value="NotRequired">OTC (Not Required)</option>
//                 </Form.Select>
//               </Form.Group>

//               {/* Category Filter */}
//               <Form.Group className="mb-4">
//                 <Form.Label className="fw-bold small text-muted">
//                   Category
//                 </Form.Label>
//                 <Form.Select
//                   value={filterCategory}
//                   onChange={(e) => setFilterCategory(e.target.value)}
//                   className="shadow-sm"
//                 >
//                   <option value="All">All Categories</option>
//                   <option value="Antibiotics">Antibiotics</option>
//                   <option value="Pain Relief">Pain Relief</option>
//                   <option value="Vitamins">Vitamins</option>
//                   <option value="Cardiology">Cardiology</option>
//                 </Form.Select>
//               </Form.Group>

//               {/* Stock Filter */}
//               <Form.Group>
//                 <Form.Check
//                   type="switch"
//                   id="stock-switch"
//                   label="Show Out of Stock"
//                   checked={showOutOfStock}
//                   onChange={(e) => setShowOutOfStock(e.target.checked)}
//                 />
//               </Form.Group>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Medicine Grid */}
//         <Col lg={9}>
//           <Row xs={1} md={2} xl={3} className="g-4">
//             {filteredMedicines.map((med) => (
//               <Col key={med._id}>
//                 <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden card-hover transition-all">
//                   <div className="position-relative text-center bg-light p-4">
//                     <img
//                       src={med.image || "https://via.placeholder.com/150"}
//                       alt={med.name}
//                       style={{
//                         height: "140px",
//                         objectFit: "contain",
//                         mixBlendMode: "multiply",
//                       }}
//                     />
//                     {med.prescriptionRequired && (
//                       <Badge
//                         bg="warning"
//                         text="dark"
//                         className="position-absolute top-0 end-0 m-3 shadow-sm"
//                       >
//                         Rx Required
//                       </Badge>
//                     )}
//                     {med.countInStock === 0 && (
//                       <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center">
//                         <Badge bg="danger" className="px-3 py-2 fs-6">
//                           Out of Stock
//                         </Badge>
//                       </div>
//                     )}
//                   </div>

//                   <Card.Body className="d-flex flex-column p-3">
//                     <div className="mb-2">
//                       <small className="text-muted">
//                         {med.category || "General"}
//                       </small>
//                       <h6
//                         className="fw-bold mb-1 text-truncate"
//                         title={med.name}
//                       >
//                         {med.name}
//                       </h6>
//                       <small className="text-muted">{med.brand}</small>
//                     </div>

//                     <div className="mt-auto d-flex justify-content-between align-items-end">
//                       <div>
//                         <span className="fs-5 fw-bold text-primary">
//                           Rs. {med.price}
//                         </span>
//                         <small
//                           className="text-muted d-block"
//                           style={{ fontSize: "0.75rem" }}
//                         >
//                           per strip
//                         </small>
//                       </div>
//                       <div className="d-flex gap-2">
//                         <Link
//                           to={`/medicine/${med._id}`}
//                           className="btn btn-outline-secondary btn-sm rounded-circle p-2"
//                         >
//                           <Info size={18} />
//                         </Link>
//                         <Button
//                           variant="primary"
//                           size="sm"
//                           className="rounded-circle p-2"
//                           disabled={med.countInStock === 0}
//                           onClick={() => handleAddToCart(med)}
//                         >
//                           <ShoppingCart size={18} />
//                         </Button>
//                       </div>
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>

//           {filteredMedicines.length === 0 && (
//             <div className="text-center py-5">
//               <h5 className="text-muted">
//                 No medicines found matching your criteria.
//               </h5>
//               <Button
//                 variant="link"
//                 onClick={() => {
//                   setSearchTerm("");
//                   setFilterCategory("All");
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             </div>
//           )}
//         </Col>
//       </Row>

//       <style>{`
//         .card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
//         .transition-all { transition: all 0.3s ease; }
//       `}</style>
//     </Container>
//   );
// };

// export default MedicineShop;

// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   Badge,
//   InputGroup,
//   Spinner,
//   OverlayTrigger,
//   Tooltip,
// } from "react-bootstrap";
// import {
//   Search,
//   Filter,
//   ShoppingCart,
//   Info,
//   Plus,
//   Minus,
//   AlertCircle,
//   CheckCircle,
//   Package,
//   ShieldAlert,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../redux/actions/cartActions";

// const API_BASE_URL = "http://localhost:5000/api";

// const MedicineShop = () => {
//   const dispatch = useDispatch();

//   // --- Data State ---
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // --- Filter State ---
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // --- Local Quantity State ---
//   // Stores quantity for each medicine ID: { 'med_id_1': 2, 'med_id_2': 1 }
//   const [quantities, setQuantities] = useState({});

//   // --- Fetch Data on Mount ---
//   useEffect(() => {
//     fetchMedicines();
//   }, []);

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE_URL}/medicines`);
//       if (!res.ok) throw new Error("Failed to load medicines");
//       const data = await res.json();
//       setMedicines(data.medicines || data); // Handle both array or { medicines: [] } format
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Helper: Get Qty for specific item ---
//   // Defaults to 1 if user hasn't interacted with it yet
//   const getQty = (id) => quantities[id] || 1;

//   // --- Quantity Handlers ---
//   const handleIncrement = (med) => {
//     const currentQty = getQty(med._id);
//     if (currentQty < med.countInStock) {
//       setQuantities({ ...quantities, [med._id]: currentQty + 1 });
//     }
//   };

//   const handleDecrement = (id) => {
//     const currentQty = getQty(id);
//     if (currentQty > 1) {
//       setQuantities({ ...quantities, [id]: currentQty - 1 });
//     }
//   };

//   const handleAddToCart = (med) => {
//     const qty = getQty(med._id);

//     // 1. Stock Validation
//     if (qty > med.countInStock) {
//       alert("Not enough stock available!");
//       return;
//     }

//     // 2. Dispatch to Redux
//     dispatch(addToCart(med._id, qty));

//     // 3. User Feedback
//     // In a real app, use a Toast/Snackbar instead of alert
//     alert(`${qty} x ${med.name} added to cart!`);
//   };

//   // --- Filter Logic ---
//   // Categories often found in real pharmacies
//   const categories = [
//     "All",
//     "Tablet",
//     "Syrup",
//     "Injection",
//     "Capsule",
//     "Ointment",
//     "General",
//   ];

//   const filteredMedicines = medicines.filter((med) => {
//     const matchesSearch =
//       med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (med.brand && med.brand.toLowerCase().includes(searchTerm.toLowerCase()));

//     const matchesCategory =
//       selectedCategory === "All" ||
//       (med.category && med.category === selectedCategory);

//     return matchesSearch && matchesCategory;
//   });

//   // --- Loading / Error States ---
//   if (loading)
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ minHeight: "60vh" }}
//       >
//         <Spinner animation="border" variant="primary" />
//         <span className="ms-3 text-muted">Loading medicines...</span>
//       </div>
//     );

//   if (error)
//     return (
//       <Container className="py-5 text-center">
//         <div className="text-danger mb-3">
//           <AlertCircle size={64} />
//         </div>
//         <h4>Oops! Something went wrong.</h4>
//         <p className="text-muted">{error}</p>
//         <Button variant="outline-primary" onClick={fetchMedicines}>
//           Try Again
//         </Button>
//       </Container>
//     );

//   return (
//     <Container className="py-5">
//       {/* 1. Page Header & Global Search */}
//       <Row className="mb-4 align-items-center g-3">
//         <Col md={6}>
//           <h2 className="fw-bold mb-0 text-primary">Medicine Store</h2>
//           <p className="text-muted mb-0">
//             Browse generic and branded medicines.
//           </p>
//         </Col>
//         <Col md={6}>
//           <InputGroup className="shadow-sm">
//             <InputGroup.Text className="bg-white border-end-0">
//               <Search size={18} className="text-muted" />
//             </InputGroup.Text>
//             <Form.Control
//               placeholder="Search by medicine name, brand, or salt..."
//               className="border-start-0 py-2"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <Button variant="primary">Search</Button>
//           </InputGroup>
//         </Col>
//       </Row>

//       <Row>
//         {/* 2. Sidebar Filters */}
//         <Col lg={3} className="mb-4">
//           <Card
//             className="border-0 shadow-sm rounded-4 sticky-top"
//             style={{ top: "100px", zIndex: 1 }}
//           >
//             <Card.Header className="bg-white border-bottom-0 pt-4">
//               <h5 className="fw-bold mb-0 d-flex align-items-center">
//                 <Filter size={20} className="me-2 text-primary" /> Filter By
//               </h5>
//             </Card.Header>
//             <Card.Body>
//               <h6 className="text-muted small fw-bold text-uppercase mb-3">
//                 Categories
//               </h6>
//               <div className="d-flex flex-column gap-2">
//                 {categories.map((cat) => (
//                   <Button
//                     key={cat}
//                     variant={selectedCategory === cat ? "primary" : "light"}
//                     className={`text-start d-flex justify-content-between align-items-center px-3 ${
//                       selectedCategory === cat
//                         ? "shadow-sm fw-bold"
//                         : "bg-transparent border-0 text-dark"
//                     }`}
//                     onClick={() => setSelectedCategory(cat)}
//                   >
//                     {cat}
//                     {selectedCategory === cat && <CheckCircle size={16} />}
//                   </Button>
//                 ))}
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* 3. Product Grid */}
//         <Col lg={9}>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <span className="text-muted small">
//               Showing {filteredMedicines.length} results
//             </span>
//             {/* Sort Dropdown could go here */}
//           </div>

//           <Row xs={1} md={2} xl={3} className="g-4">
//             {filteredMedicines.map((med) => {
//               const qty = getQty(med._id);
//               // Calculate total price based on selected quantity
//               const totalPrice = (med.price * qty).toFixed(2);
//               const isOutOfStock = med.countInStock === 0;

//               return (
//                 <Col key={med._id}>
//                   <Card
//                     className={`h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative ${
//                       isOutOfStock ? "opacity-75" : ""
//                     }`}
//                   >
//                     {/* --- Product Image & Badges --- */}
//                     <div
//                       className="position-relative text-center bg-light p-4"
//                       style={{ minHeight: "200px" }}
//                     >
//                       {/* Link wrapper for image to go to details */}
//                       <Link to={`/medicine/${med._id}`}>
//                         <img
//                           src={
//                             med.image ||
//                             "https://placehold.co/150x150?text=No+Image"
//                           }
//                           alt={med.name}
//                           className="img-fluid transition-transform"
//                           style={{
//                             height: "140px",
//                             objectFit: "contain",
//                             mixBlendMode: "multiply",
//                           }}
//                         />
//                       </Link>

//                       {/* RX Badge - Industry Standard for Safety */}
//                       {med.prescriptionRequired && (
//                         <OverlayTrigger
//                           placement="top"
//                           overlay={<Tooltip>Prescription Required</Tooltip>}
//                         >
//                           <Badge
//                             bg="warning"
//                             text="dark"
//                             className="position-absolute top-0 end-0 m-3 shadow-sm d-flex align-items-center gap-1"
//                           >
//                             <ShieldAlert size={14} /> Rx
//                           </Badge>
//                         </OverlayTrigger>
//                       )}

//                       {/* Stock Badge */}
//                       {isOutOfStock && (
//                         <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center z-2">
//                           <Badge bg="danger" className="px-3 py-2 fs-6 shadow">
//                             Out of Stock
//                           </Badge>
//                         </div>
//                       )}
//                     </div>

//                     <Card.Body className="d-flex flex-column p-3">
//                       {/* --- Product Details --- */}
//                       <div className="mb-2">
//                         <Badge
//                           bg="info"
//                           className="text-dark bg-opacity-10 border border-info border-opacity-25 mb-2 px-2 py-1"
//                         >
//                           {med.category || "General"}
//                         </Badge>
//                         <h6
//                           className="fw-bold text-truncate mb-1"
//                           title={med.name}
//                         >
//                           <Link
//                             to={`/medicine/${med._id}`}
//                             className="text-dark text-decoration-none hover-primary"
//                           >
//                             {med.name}
//                           </Link>
//                         </h6>
//                         <small className="text-muted d-block text-truncate">
//                           {med.brand || "Generic Manufacturer"}
//                         </small>
//                       </div>

//                       <div className="mt-auto">
//                         {/* --- Dynamic Pricing --- */}
//                         <div className="d-flex justify-content-between align-items-end mb-3 border-top pt-3">
//                           <div>
//                             <small
//                               className="text-muted d-block"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               Unit Price
//                             </small>
//                             <span className="fw-bold">₹{med.price}</span>
//                           </div>
//                           <div className="text-end">
//                             <small
//                               className="text-muted d-block"
//                               style={{ fontSize: "0.7rem" }}
//                             >
//                               Subtotal
//                             </small>
//                             <span className="fw-bold text-primary fs-5">
//                               ₹{totalPrice}
//                             </span>
//                           </div>
//                         </div>

//                         {/* --- Quantity Selector --- */}
//                         <div className="d-flex align-items-center justify-content-between bg-light rounded-pill p-1 mb-3 border">
//                           <Button
//                             variant="link"
//                             className="text-dark p-0 px-2 text-decoration-none"
//                             disabled={isOutOfStock || qty <= 1}
//                             onClick={() => handleDecrement(med._id)}
//                             aria-label="Decrease quantity"
//                           >
//                             <Minus size={18} />
//                           </Button>

//                           <span className="fw-bold px-3 user-select-none">
//                             {qty}
//                           </span>

//                           <Button
//                             variant="link"
//                             className="text-dark p-0 px-2 text-decoration-none"
//                             disabled={isOutOfStock || qty >= med.countInStock}
//                             onClick={() => handleIncrement(med)}
//                             aria-label="Increase quantity"
//                           >
//                             <Plus size={18} />
//                           </Button>
//                         </div>

//                         {/* --- Actions --- */}
//                         <div className="d-grid gap-2">
//                           <Button
//                             variant="primary"
//                             className="fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center"
//                             disabled={isOutOfStock}
//                             onClick={() => handleAddToCart(med)}
//                           >
//                             <ShoppingCart size={18} className="me-2" /> Add to
//                             Cart
//                           </Button>
//                         </div>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               );
//             })}
//           </Row>

//           {/* 4. Empty State */}
//           {filteredMedicines.length === 0 && (
//             <div className="text-center py-5">
//               <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
//                 <Package size={48} className="text-muted opacity-50" />
//               </div>
//               <h5>No medicines found</h5>
//               <p className="text-muted">
//                 Try adjusting your search or category filters.
//               </p>
//               <Button
//                 variant="link"
//                 onClick={() => {
//                   setSearchTerm("");
//                   setSelectedCategory("All");
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             </div>
//           )}
//         </Col>
//       </Row>

//       {/* CSS for hover effects */}
//       <style>{`
//         .hover-primary:hover { color: var(--bs-primary) !important; }
//         .transition-transform { transition: transform 0.3s ease; }
//         .card:hover .transition-transform { transform: scale(1.05); }
//       `}</style>
//     </Container>
//   );
// };

// export default MedicineShop;

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  InputGroup,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  Search,
  Filter,
  ShoppingCart,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Package,
  ShieldAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/actions/cartActions";

const API_BASE_URL = "http://localhost:5000/api";

const MedicineShop = () => {
  const dispatch = useDispatch();

  // --- Data State ---
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Filter State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // New: For API performance
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- Local Quantity State ---
  const [quantities, setQuantities] = useState({});

  // --- 1. Debounce Search (Wait 500ms after typing stops) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- 2. Fetch Data when Filters Change ---
  useEffect(() => {
    fetchMedicines();
    // eslint-disable-next-line
  }, [debouncedSearch, selectedCategory]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError("");

      // Build Query String for Backend
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("keyword", debouncedSearch);
      if (selectedCategory !== "All")
        params.append("category", selectedCategory);

      const res = await fetch(`${API_BASE_URL}/medicines?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load medicines");

      const data = await res.json();
      setMedicines(data.medicines || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Helper: Get Qty for specific item ---
  const getQty = (id) => quantities[id] || 1;

  // --- Quantity Handlers ---
  const handleIncrement = (med) => {
    const currentQty = getQty(med._id);
    if (currentQty < med.countInStock) {
      setQuantities({ ...quantities, [med._id]: currentQty + 1 });
    }
  };

  const handleDecrement = (id) => {
    const currentQty = getQty(id);
    if (currentQty > 1) {
      setQuantities({ ...quantities, [id]: currentQty - 1 });
    }
  };

  const handleAddToCart = (med) => {
    const qty = getQty(med._id);

    // 1. Stock Validation
    if (qty > med.countInStock) {
      alert("Not enough stock available!");
      return;
    }

    // 2. Dispatch to Redux
    dispatch(addToCart(med._id, qty));

    // 3. User Feedback
    alert(`${qty} x ${med.name} added to cart!`);
  };

  // --- Categories ---
  const categories = [
    "All",
    "Tablet",
    "Syrup",
    "Injection",
    "Capsule",
    "Ointment",
    "General",
  ];

  // Note: We removed 'filteredMedicines' because the backend now returns
  // the already filtered list in 'medicines'.

  // --- Loading / Error States ---
  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-3 text-muted">Loading medicines...</span>
      </div>
    );

  if (error)
    return (
      <Container className="py-5 text-center">
        <div className="text-danger mb-3">
          <AlertCircle size={64} />
        </div>
        <h4>Oops! Something went wrong.</h4>
        <p className="text-muted">{error}</p>
        <Button variant="outline-primary" onClick={fetchMedicines}>
          Try Again
        </Button>
      </Container>
    );

  return (
    <Container className="py-5">
      {/* 1. Page Header & Global Search */}
      <Row className="mb-4 align-items-center g-3">
        <Col md={6}>
          <h2 className="fw-bold mb-0 text-primary">Medicine Store</h2>
          <p className="text-muted mb-0">
            Browse generic and branded medicines.
          </p>
        </Col>
        <Col md={6}>
          <InputGroup className="shadow-sm">
            <InputGroup.Text className="bg-white border-end-0">
              <Search size={18} className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by medicine name, brand, or salt..."
              className="border-start-0 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </Button>
            )}
          </InputGroup>
        </Col>
      </Row>

      <Row>
        {/* 2. Sidebar Filters */}
        <Col lg={3} className="mb-4">
          <Card
            className="border-0 shadow-sm rounded-4 sticky-top"
            style={{ top: "100px", zIndex: 1 }}
          >
            <Card.Header className="bg-white border-bottom-0 pt-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center">
                <Filter size={20} className="me-2 text-primary" /> Filter By
              </h5>
            </Card.Header>
            <Card.Body>
              <h6 className="text-muted small fw-bold text-uppercase mb-3">
                Categories
              </h6>
              <div className="d-flex flex-column gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "primary" : "light"}
                    className={`text-start d-flex justify-content-between align-items-center px-3 ${
                      selectedCategory === cat
                        ? "shadow-sm fw-bold"
                        : "bg-transparent border-0 text-dark"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                    {selectedCategory === cat && <CheckCircle size={16} />}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 3. Product Grid */}
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">
              Showing {medicines.length} results
            </span>
          </div>

          {medicines.length === 0 ? (
            <div className="text-center py-5">
              <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                <Package size={48} className="text-muted opacity-50" />
              </div>
              <h5>No medicines found</h5>
              <p className="text-muted">
                Try adjusting your search or category filters.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <Row xs={1} md={2} xl={3} className="g-4">
              {medicines.map((med) => {
                const qty = getQty(med._id);
                // Calculate total price based on selected quantity
                const totalPrice = (med.price * qty).toFixed(2);
                const isOutOfStock = med.countInStock === 0;

                return (
                  <Col key={med._id}>
                    <Card
                      className={`h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative ${
                        isOutOfStock ? "opacity-75" : ""
                      }`}
                    >
                      {/* --- Product Image & Badges --- */}
                      <div
                        className="position-relative text-center bg-light p-4"
                        style={{ minHeight: "200px" }}
                      >
                        {/* Link wrapper for image to go to details */}
                        <Link to={`/medicine/${med._id}`}>
                          <img
                            src={
                              med.image ||
                              "https://placehold.co/150x150?text=No+Image"
                            }
                            alt={med.name}
                            className="img-fluid transition-transform"
                            style={{
                              height: "140px",
                              objectFit: "contain",
                              mixBlendMode: "multiply",
                            }}
                          />
                        </Link>

                        {/* RX Badge - Industry Standard for Safety */}
                        {med.prescriptionRequired && (
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Prescription Required</Tooltip>}
                          >
                            <Badge
                              bg="warning"
                              text="dark"
                              className="position-absolute top-0 end-0 m-3 shadow-sm d-flex align-items-center gap-1"
                            >
                              <ShieldAlert size={14} /> Rx
                            </Badge>
                          </OverlayTrigger>
                        )}

                        {/* Stock Badge */}
                        {isOutOfStock && (
                          <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center z-2">
                            <Badge
                              bg="danger"
                              className="px-3 py-2 fs-6 shadow"
                            >
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                      </div>

                      <Card.Body className="d-flex flex-column p-3">
                        {/* --- Product Details --- */}
                        <div className="mb-2">
                          <Badge
                            bg="info"
                            className="text-dark bg-opacity-10 border border-info border-opacity-25 mb-2 px-2 py-1"
                          >
                            {med.category || "General"}
                          </Badge>
                          <h6
                            className="fw-bold text-truncate mb-1"
                            title={med.name}
                          >
                            <Link
                              to={`/medicine/${med._id}`}
                              className="text-dark text-decoration-none hover-primary"
                            >
                              {med.name}
                            </Link>
                          </h6>
                          <small className="text-muted d-block text-truncate">
                            {med.brand || "Generic Manufacturer"}
                          </small>
                        </div>

                        <div className="mt-auto">
                          {/* --- Dynamic Pricing --- */}
                          <div className="d-flex justify-content-between align-items-end mb-3 border-top pt-3">
                            <div>
                              <small
                                className="text-muted d-block"
                                style={{ fontSize: "0.7rem" }}
                              >
                                Unit Price
                              </small>
                              <span className="fw-bold">₹{med.price}</span>
                            </div>
                            <div className="text-end">
                              <small
                                className="text-muted d-block"
                                style={{ fontSize: "0.7rem" }}
                              >
                                Subtotal
                              </small>
                              <span className="fw-bold text-primary fs-5">
                                ₹{totalPrice}
                              </span>
                            </div>
                          </div>

                          {/* --- Quantity Selector --- */}
                          <div className="d-flex align-items-center justify-content-between bg-light rounded-pill p-1 mb-3 border">
                            <Button
                              variant="link"
                              className="text-dark p-0 px-2 text-decoration-none"
                              disabled={isOutOfStock || qty <= 1}
                              onClick={() => handleDecrement(med._id)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={18} />
                            </Button>

                            <span className="fw-bold px-3 user-select-none">
                              {qty}
                            </span>

                            <Button
                              variant="link"
                              className="text-dark p-0 px-2 text-decoration-none"
                              disabled={isOutOfStock || qty >= med.countInStock}
                              onClick={() => handleIncrement(med)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={18} />
                            </Button>
                          </div>

                          {/* --- Actions --- */}
                          <div className="d-grid gap-2">
                            <Button
                              variant="primary"
                              className="fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center"
                              disabled={isOutOfStock}
                              onClick={() => handleAddToCart(med)}
                            >
                              <ShoppingCart size={18} className="me-2" /> Add to
                              Cart
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Col>
      </Row>

      {/* CSS for hover effects */}
      <style>{`
        .hover-primary:hover { color: var(--bs-primary) !important; }
        .transition-transform { transition: transform 0.3s ease; }
        .card:hover .transition-transform { transform: scale(1.05); }
      `}</style>
    </Container>
  );
};

export default MedicineShop;
