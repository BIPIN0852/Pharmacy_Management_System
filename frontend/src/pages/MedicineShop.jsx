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
//   const [debouncedSearch, setDebouncedSearch] = useState(""); // New: For API performance
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // --- Local Quantity State ---
//   const [quantities, setQuantities] = useState({});

//   // --- 1. Debounce Search (Wait 500ms after typing stops) ---
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // --- 2. Fetch Data when Filters Change ---
//   useEffect(() => {
//     fetchMedicines();
//     // eslint-disable-next-line
//   }, [debouncedSearch, selectedCategory]);

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       // Build Query String for Backend
//       const params = new URLSearchParams();
//       if (debouncedSearch) params.append("keyword", debouncedSearch);
//       if (selectedCategory !== "All")
//         params.append("category", selectedCategory);

//       const res = await fetch(`${API_BASE_URL}/medicines?${params.toString()}`);
//       if (!res.ok) throw new Error("Failed to load medicines");

//       const data = await res.json();
//       setMedicines(data.medicines || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Helper: Get Qty for specific item ---
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
//     alert(`${qty} x ${med.name} added to cart!`);
//   };

//   // --- Categories ---
//   const categories = [
//     "All",
//     "Tablet",
//     "Syrup",
//     "Injection",
//     "Capsule",
//     "Ointment",
//     "General",
//   ];

//   // Note: We removed 'filteredMedicines' because the backend now returns
//   // the already filtered list in 'medicines'.

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
//             {searchTerm && (
//               <Button
//                 variant="outline-secondary"
//                 onClick={() => setSearchTerm("")}
//               >
//                 Clear
//               </Button>
//             )}
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
//               Showing {medicines.length} results
//             </span>
//           </div>

//           {medicines.length === 0 ? (
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
//           ) : (
//             <Row xs={1} md={2} xl={3} className="g-4">
//               {medicines.map((med) => {
//                 const qty = getQty(med._id);
//                 // Calculate total price based on selected quantity
//                 const totalPrice = (med.price * qty).toFixed(2);
//                 const isOutOfStock = med.countInStock === 0;

//                 return (
//                   <Col key={med._id}>
//                     <Card
//                       className={`h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative ${
//                         isOutOfStock ? "opacity-75" : ""
//                       }`}
//                     >
//                       {/* --- Product Image & Badges --- */}
//                       <div
//                         className="position-relative text-center bg-light p-4"
//                         style={{ minHeight: "200px" }}
//                       >
//                         {/* Link wrapper for image to go to details */}
//                         <Link to={`/medicine/${med._id}`}>
//                           <img
//                             src={
//                               med.image ||
//                               "https://placehold.co/150x150?text=No+Image"
//                             }
//                             alt={med.name}
//                             className="img-fluid transition-transform"
//                             style={{
//                               height: "140px",
//                               objectFit: "contain",
//                               mixBlendMode: "multiply",
//                             }}
//                           />
//                         </Link>

//                         {/* RX Badge - Industry Standard for Safety */}
//                         {med.prescriptionRequired && (
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>Prescription Required</Tooltip>}
//                           >
//                             <Badge
//                               bg="warning"
//                               text="dark"
//                               className="position-absolute top-0 end-0 m-3 shadow-sm d-flex align-items-center gap-1"
//                             >
//                               <ShieldAlert size={14} /> Rx
//                             </Badge>
//                           </OverlayTrigger>
//                         )}

//                         {/* Stock Badge */}
//                         {isOutOfStock && (
//                           <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center z-2">
//                             <Badge
//                               bg="danger"
//                               className="px-3 py-2 fs-6 shadow"
//                             >
//                               Out of Stock
//                             </Badge>
//                           </div>
//                         )}
//                       </div>

//                       <Card.Body className="d-flex flex-column p-3">
//                         {/* --- Product Details --- */}
//                         <div className="mb-2">
//                           <Badge
//                             bg="info"
//                             className="text-dark bg-opacity-10 border border-info border-opacity-25 mb-2 px-2 py-1"
//                           >
//                             {med.category || "General"}
//                           </Badge>
//                           <h6
//                             className="fw-bold text-truncate mb-1"
//                             title={med.name}
//                           >
//                             <Link
//                               to={`/medicine/${med._id}`}
//                               className="text-dark text-decoration-none hover-primary"
//                             >
//                               {med.name}
//                             </Link>
//                           </h6>
//                           <small className="text-muted d-block text-truncate">
//                             {med.brand || "Generic Manufacturer"}
//                           </small>
//                         </div>

//                         <div className="mt-auto">
//                           {/* --- Dynamic Pricing --- */}
//                           <div className="d-flex justify-content-between align-items-end mb-3 border-top pt-3">
//                             <div>
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Unit Price
//                               </small>
//                               <span className="fw-bold">₹{med.price}</span>
//                             </div>
//                             <div className="text-end">
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Subtotal
//                               </small>
//                               <span className="fw-bold text-primary fs-5">
//                                 ₹{totalPrice}
//                               </span>
//                             </div>
//                           </div>

//                           {/* --- Quantity Selector --- */}
//                           <div className="d-flex align-items-center justify-content-between bg-light rounded-pill p-1 mb-3 border">
//                             <Button
//                               variant="link"
//                               className="text-dark p-0 px-2 text-decoration-none"
//                               disabled={isOutOfStock || qty <= 1}
//                               onClick={() => handleDecrement(med._id)}
//                               aria-label="Decrease quantity"
//                             >
//                               <Minus size={18} />
//                             </Button>

//                             <span className="fw-bold px-3 user-select-none">
//                               {qty}
//                             </span>

//                             <Button
//                               variant="link"
//                               className="text-dark p-0 px-2 text-decoration-none"
//                               disabled={isOutOfStock || qty >= med.countInStock}
//                               onClick={() => handleIncrement(med)}
//                               aria-label="Increase quantity"
//                             >
//                               <Plus size={18} />
//                             </Button>
//                           </div>

//                           {/* --- Actions --- */}
//                           <div className="d-grid gap-2">
//                             <Button
//                               variant="primary"
//                               className="fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center"
//                               disabled={isOutOfStock}
//                               onClick={() => handleAddToCart(med)}
//                             >
//                               <ShoppingCart size={18} className="me-2" /> Add to
//                               Cart
//                             </Button>
//                           </div>
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 );
//               })}
//             </Row>
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
//   Plus,
//   Minus,
//   AlertCircle,
//   CheckCircle,
//   Package,
//   ShieldAlert,
//   Heart, // ✅ New Icon
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../redux/actions/cartActions";
// import api from "../services/api"; // ✅ Use interceptor for API calls

// const MedicineShop = () => {
//   const dispatch = useDispatch();

//   // --- Data State ---
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // --- Filter State ---
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // --- Local State for Quantity & Unit Selection ---
//   // quantities: { [medicineId]: number }
//   const [quantities, setQuantities] = useState({});
//   // selectedUnits: { [medicineId]: { unitName, price, multiplier } }
//   const [selectedUnits, setSelectedUnits] = useState({});

//   // ✅ Saved Items State
//   const [savedIds, setSavedIds] = useState(new Set());
//   const [saveLoading, setSaveLoading] = useState(null);

//   // --- 1. Debounce Search ---
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // --- 2. Fetch Data ---
//   useEffect(() => {
//     fetchMedicines();
//     fetchSavedStatus(); // ✅ Check saved items on load
//     // eslint-disable-next-line
//   }, [debouncedSearch, selectedCategory]);

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const params = new URLSearchParams();
//       if (debouncedSearch) params.append("keyword", debouncedSearch);
//       if (selectedCategory !== "All")
//         params.append("category", selectedCategory);

//       // Using api interceptor for consistency
//       const res = await api.get(`/medicines?${params.toString()}`);

//       // Handle response structure
//       const medList = Array.isArray(res.data)
//         ? res.data
//         : res.data.medicines || [];
//       setMedicines(medList);

//       // Initialize default selections (Base Unit)
//       const defaultUnits = {};
//       medList.forEach((m) => {
//         defaultUnits[m._id] = {
//           unitName: m.baseUnit || "Unit",
//           price: m.price,
//           multiplier: 1,
//         };
//       });
//       setSelectedUnits((prev) => ({ ...prev, ...defaultUnits }));
//     } catch (err) {
//       setError(err.message || "Failed to load medicines");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Fetch Saved Status
//   const fetchSavedStatus = async () => {
//     try {
//       const { data } = await api.get("/customer/saved-medicines");
//       const ids = new Set(data.map((item) => item.medicine._id));
//       setSavedIds(ids);
//     } catch (err) {
//       console.error("Error fetching wishlist", err);
//     }
//   };

//   // --- Helper: Get Qty ---
//   const getQty = (id) => quantities[id] || 1;

//   // --- Quantity Handlers ---
//   const handleIncrement = (med) => {
//     const currentQty = getQty(med._id);
//     const selection = selectedUnits[med._id] || { multiplier: 1 };

//     // Check total stock vs (quantity * pack size)
//     const totalRequired = (currentQty + 1) * selection.multiplier;

//     if (totalRequired <= med.countInStock) {
//       setQuantities({ ...quantities, [med._id]: currentQty + 1 });
//     }
//   };

//   const handleDecrement = (id) => {
//     const currentQty = getQty(id);
//     if (currentQty > 1) {
//       setQuantities({ ...quantities, [id]: currentQty - 1 });
//     }
//   };

//   // --- Unit Change Handler ---
//   const handleUnitChange = (med, unitName) => {
//     let newSelection = {};

//     if (unitName === (med.baseUnit || "Unit")) {
//       newSelection = {
//         unitName: med.baseUnit || "Unit",
//         price: med.price,
//         multiplier: 1,
//       };
//     } else {
//       const unit = med.units.find((u) => u.name === unitName);
//       if (unit) {
//         newSelection = {
//           unitName: unit.name,
//           price: unit.price,
//           multiplier: unit.multiplier,
//         };
//       }
//     }

//     setSelectedUnits((prev) => ({
//       ...prev,
//       [med._id]: newSelection,
//     }));

//     // Reset quantity to 1 when unit changes to avoid confusion
//     setQuantities((prev) => ({ ...prev, [med._id]: 1 }));
//   };

//   // --- Add to Cart Handler ---
//   const handleAddToCart = (med) => {
//     const qty = getQty(med._id);
//     const selection = selectedUnits[med._id] || {
//       unitName: med.baseUnit || "Unit",
//       price: med.price,
//       multiplier: 1,
//     };

//     // Stock Validation
//     if (qty * selection.multiplier > med.countInStock) {
//       alert("Not enough stock available for this quantity!");
//       return;
//     }

//     // Dispatch to Redux with Unit details
//     dispatch(
//       addToCart({
//         medicine: med._id,
//         name: med.name,
//         image: med.image,
//         stock: med.countInStock,
//         unit: selection.unitName,
//         price: selection.price,
//         buyingMultiplier: selection.multiplier,
//         qty: qty,
//       })
//     );

//     alert(`${qty} x ${selection.unitName} of ${med.name} added to cart!`);
//   };

//   // --- Toggle Save Handler ---
//   const handleToggleSave = async (medicineId) => {
//     try {
//       setSaveLoading(medicineId);
//       if (savedIds.has(medicineId)) {
//         await api.delete(`/customer/saved-medicines/${medicineId}`);
//         setSavedIds((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(medicineId);
//           return newSet;
//         });
//       } else {
//         await api.post("/customer/saved-medicines", { medicineId });
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       }
//     } catch (err) {
//       // alert("Error updating wishlist");
//     } finally {
//       setSaveLoading(null);
//     }
//   };

//   const categories = [
//     "All",
//     "Tablet",
//     "Syrup",
//     "Injection",
//     "Capsule",
//     "Ointment",
//     "General",
//   ];

//   // --- Render ---
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
//       {/* 1. Header & Search */}
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
//             {searchTerm && (
//               <Button
//                 variant="outline-secondary"
//                 onClick={() => setSearchTerm("")}
//               >
//                 Clear
//               </Button>
//             )}
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
//               Showing {medicines.length} results
//             </span>
//           </div>

//           {medicines.length === 0 ? (
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
//           ) : (
//             <Row xs={1} md={2} xl={3} className="g-4">
//               {medicines.map((med) => {
//                 const qty = getQty(med._id);
//                 // Get current unit selection
//                 const selection = selectedUnits[med._id] || {
//                   unitName: med.baseUnit || "Unit",
//                   price: med.price,
//                   multiplier: 1,
//                 };

//                 const totalPrice = (selection.price * qty).toFixed(2);
//                 // Determine stock status based on selected pack size
//                 const isOutOfStock = med.countInStock < selection.multiplier;

//                 return (
//                   <Col key={med._id}>
//                     <Card
//                       className={`h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative card-hover`}
//                     >
//                       {/* Image Section */}
//                       <div
//                         className="position-relative text-center bg-light p-4"
//                         style={{ minHeight: "200px" }}
//                       >
//                         <Link to={`/medicine/${med._id}`}>
//                           <img
//                             src={
//                               med.image ||
//                               "https://placehold.co/150x150?text=No+Image"
//                             }
//                             alt={med.name}
//                             className="img-fluid transition-transform"
//                             style={{
//                               height: "140px",
//                               objectFit: "contain",
//                               mixBlendMode: "multiply",
//                             }}
//                           />
//                         </Link>

//                         {/* ✅ Wishlist Heart Button */}
//                         <button
//                           className="position-absolute top-0 end-0 m-2 btn btn-white bg-white rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center border-0"
//                           style={{ width: "35px", height: "35px", zIndex: 5 }}
//                           onClick={() => handleToggleSave(med._id)}
//                           disabled={saveLoading === med._id}
//                         >
//                           {saveLoading === med._id ? (
//                             <Spinner
//                               size="sm"
//                               style={{ width: "14px", height: "14px" }}
//                             />
//                           ) : (
//                             <Heart
//                               size={18}
//                               className={
//                                 savedIds.has(med._id)
//                                   ? "text-danger"
//                                   : "text-muted"
//                               }
//                               fill={savedIds.has(med._id) ? "#dc3545" : "none"}
//                             />
//                           )}
//                         </button>

//                         {med.prescriptionRequired && (
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>Prescription Required</Tooltip>}
//                           >
//                             <Badge
//                               bg="warning"
//                               text="dark"
//                               className="position-absolute top-0 start-0 m-3 shadow-sm d-flex align-items-center gap-1"
//                             >
//                               <ShieldAlert size={14} /> Rx
//                             </Badge>
//                           </OverlayTrigger>
//                         )}

//                         {isOutOfStock && (
//                           <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center z-2">
//                             <Badge
//                               bg="danger"
//                               className="px-3 py-2 fs-6 shadow"
//                             >
//                               Out of Stock
//                             </Badge>
//                           </div>
//                         )}
//                       </div>

//                       <Card.Body className="d-flex flex-column p-3">
//                         <div className="mb-2">
//                           <Badge
//                             bg="info"
//                             className="text-dark bg-opacity-10 border border-info border-opacity-25 mb-2 px-2 py-1"
//                           >
//                             {med.category || "General"}
//                           </Badge>
//                           <h6
//                             className="fw-bold text-truncate mb-1"
//                             title={med.name}
//                           >
//                             <Link
//                               to={`/medicine/${med._id}`}
//                               className="text-dark text-decoration-none hover-primary"
//                             >
//                               {med.name}
//                             </Link>
//                           </h6>
//                           <small className="text-muted d-block text-truncate">
//                             {med.manufacturer || "Generic"}
//                           </small>
//                         </div>

//                         {/* --- Unit Selector --- */}
//                         <div className="mt-auto bg-light rounded-3 p-2 border border-light-subtle">
//                           <div className="d-flex justify-content-between align-items-center mb-2">
//                             <label className="small text-muted fw-medium mb-0">
//                               Pack:
//                             </label>
//                             <select
//                               className="form-select form-select-sm border-0 bg-white shadow-sm py-0 ps-2 pe-4"
//                               style={{
//                                 width: "auto",
//                                 fontSize: "0.8rem",
//                                 height: "24px",
//                               }}
//                               value={selection.unitName}
//                               onChange={(e) =>
//                                 handleUnitChange(med, e.target.value)
//                               }
//                             >
//                               <option value={med.baseUnit || "Unit"}>
//                                 {med.baseUnit || "Unit"} (1x)
//                               </option>
//                               {med.units &&
//                                 med.units.map((u, idx) => (
//                                   <option key={idx} value={u.name}>
//                                     {u.name} (x{u.multiplier})
//                                   </option>
//                                 ))}
//                             </select>
//                           </div>

//                           <div className="d-flex justify-content-between align-items-end mb-3 pt-2 border-top">
//                             <div>
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Price
//                               </small>
//                               <span className="fw-bold">
//                                 ₹{selection.price}
//                               </span>
//                             </div>
//                             <div className="text-end">
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Total
//                               </small>
//                               <span className="fw-bold text-primary">
//                                 ₹{totalPrice}
//                               </span>
//                             </div>
//                           </div>

//                           <div className="d-flex gap-2">
//                             {/* Qty Control */}
//                             <div className="d-flex align-items-center bg-white rounded border flex-grow-1 justify-content-between px-1">
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0"
//                                 disabled={isOutOfStock || qty <= 1}
//                                 onClick={() => handleDecrement(med._id)}
//                               >
//                                 <Minus size={16} />
//                               </Button>
//                               <span className="fw-bold small">{qty}</span>
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0"
//                                 disabled={
//                                   isOutOfStock ||
//                                   (qty + 1) * selection.multiplier >
//                                     med.countInStock
//                                 }
//                                 onClick={() => handleIncrement(med)}
//                               >
//                                 <Plus size={16} />
//                               </Button>
//                             </div>

//                             <Button
//                               variant="primary"
//                               size="sm"
//                               className="rounded fw-bold d-flex align-items-center"
//                               disabled={isOutOfStock}
//                               onClick={() => handleAddToCart(med)}
//                             >
//                               <ShoppingCart size={16} />
//                             </Button>
//                           </div>
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 );
//               })}
//             </Row>
//           )}
//         </Col>
//       </Row>
//       <style>{`
//         .hover-primary:hover { color: var(--bs-primary) !important; }
//         .card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; transition: all 0.2s ease; }
//         .transition-transform { transition: transform 0.3s ease; }
//         .card:hover .transition-transform { transform: scale(1.05); }
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
//   Plus,
//   Minus,
//   AlertCircle,
//   CheckCircle,
//   Package,
//   ShieldAlert,
//   Heart,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../redux/actions/cartActions";
// import api from "../services/api";

// const MedicineShop = () => {
//   const dispatch = useDispatch();

//   // --- Data State ---
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // --- Filter State ---
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // --- Local State for Quantity & Unit ---
//   const [quantities, setQuantities] = useState({});
//   const [selectedUnits, setSelectedUnits] = useState({});

//   // ✅ Saved Items State
//   const [savedIds, setSavedIds] = useState(new Set());
//   const [saveLoading, setSaveLoading] = useState(null);

//   // --- 1. Debounce Search ---
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // --- 2. Fetch Data ---
//   useEffect(() => {
//     fetchMedicines();
//     fetchSavedStatus();
//     // eslint-disable-next-line
//   }, [debouncedSearch, selectedCategory]);

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const params = new URLSearchParams();
//       if (debouncedSearch) params.append("keyword", debouncedSearch);
//       if (selectedCategory !== "All")
//         params.append("category", selectedCategory);

//       const res = await api.get(`/medicines?${params.toString()}`);

//       const medList = Array.isArray(res.data)
//         ? res.data
//         : res.data.medicines || [];
//       setMedicines(medList);

//       // Initialize default selections
//       const defaultUnits = {};
//       medList.forEach((m) => {
//         defaultUnits[m._id] = {
//           unitName: m.baseUnit || "Unit",
//           price: m.price,
//           multiplier: 1,
//         };
//       });
//       setSelectedUnits((prev) => ({ ...prev, ...defaultUnits }));
//     } catch (err) {
//       setError(err.message || "Failed to load medicines");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ ROBUST FETCH SAVED STATUS
//   const fetchSavedStatus = async () => {
//     try {
//       const { data } = await api.get("/customer/saved-medicines");
//       // Safety Check: Filter out nulls if a medicine was deleted from DB
//       const ids = new Set(
//         data
//           .map((item) => item.medicine?._id) // Use optional chaining
//           .filter((id) => id) // Remove undefined/nulls
//       );
//       setSavedIds(ids);
//     } catch (err) {
//       console.error("Error fetching wishlist", err);
//     }
//   };

//   // --- Helper: Get Qty ---
//   const getQty = (id) => quantities[id] || 1;

//   // --- Quantity Handlers ---
//   const handleIncrement = (med) => {
//     const currentQty = getQty(med._id);
//     const selection = selectedUnits[med._id] || { multiplier: 1 };
//     const totalRequired = (currentQty + 1) * selection.multiplier;

//     if (totalRequired <= med.countInStock) {
//       setQuantities({ ...quantities, [med._id]: currentQty + 1 });
//     }
//   };

//   const handleDecrement = (id) => {
//     const currentQty = getQty(id);
//     if (currentQty > 1) {
//       setQuantities({ ...quantities, [id]: currentQty - 1 });
//     }
//   };

//   // --- Unit Change Handler ---
//   const handleUnitChange = (med, unitName) => {
//     let newSelection = {};

//     if (unitName === (med.baseUnit || "Unit")) {
//       newSelection = {
//         unitName: med.baseUnit || "Unit",
//         price: med.price,
//         multiplier: 1,
//       };
//     } else {
//       const unit = med.units.find((u) => u.name === unitName);
//       if (unit) {
//         newSelection = {
//           unitName: unit.name,
//           price: unit.price,
//           multiplier: unit.multiplier,
//         };
//       }
//     }

//     setSelectedUnits((prev) => ({
//       ...prev,
//       [med._id]: newSelection,
//     }));

//     setQuantities((prev) => ({ ...prev, [med._id]: 1 }));
//   };

//   // --- Add to Cart Handler ---
//   const handleAddToCart = (med) => {
//     const qty = getQty(med._id);
//     const selection = selectedUnits[med._id] || {
//       unitName: med.baseUnit || "Unit",
//       price: med.price,
//       multiplier: 1,
//     };

//     if (qty * selection.multiplier > med.countInStock) {
//       alert("Not enough stock available for this quantity!");
//       return;
//     }

//     dispatch(
//       addToCart({
//         medicine: med._id,
//         name: med.name,
//         image: med.image,
//         stock: med.countInStock,
//         unit: selection.unitName,
//         price: selection.price,
//         buyingMultiplier: selection.multiplier,
//         qty: qty,
//       })
//     );

//     alert(`${qty} x ${selection.unitName} of ${med.name} added to cart!`);
//   };

//   // ✅ FIXED SAVE HANDLER (Handles 400 Errors Gracefully)
//   const handleToggleSave = async (medicineId) => {
//     try {
//       setSaveLoading(medicineId);

//       if (savedIds.has(medicineId)) {
//         // --- UNSAVE ---
//         await api.delete(`/customer/saved-medicines/${medicineId}`);
//         setSavedIds((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(medicineId);
//           return newSet;
//         });
//       } else {
//         // --- SAVE ---
//         await api.post("/customer/saved-medicines", { medicineId });
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       }
//     } catch (err) {
//       // ✅ FIX: If error is 400 (Already Saved), just update UI to show it's saved
//       if (err.response && err.response.status === 400) {
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       } else {
//         console.error("Save Error:", err);
//       }
//     } finally {
//       setSaveLoading(null);
//     }
//   };

//   const categories = [
//     "All",
//     "Tablet",
//     "Syrup",
//     "Injection",
//     "Capsule",
//     "Ointment",
//     "General",
//   ];

//   // --- Render ---
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
//       {/* 1. Header & Search */}
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
//             {searchTerm && (
//               <Button
//                 variant="outline-secondary"
//                 onClick={() => setSearchTerm("")}
//               >
//                 Clear
//               </Button>
//             )}
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
//               Showing {medicines.length} results
//             </span>
//           </div>

//           {medicines.length === 0 ? (
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
//           ) : (
//             <Row xs={1} md={2} xl={3} className="g-4">
//               {medicines.map((med) => {
//                 const qty = getQty(med._id);
//                 const selection = selectedUnits[med._id] || {
//                   unitName: med.baseUnit || "Unit",
//                   price: med.price,
//                   multiplier: 1,
//                 };

//                 const totalPrice = (selection.price * qty).toFixed(2);
//                 const isOutOfStock = med.countInStock < selection.multiplier;

//                 return (
//                   <Col key={med._id}>
//                     <Card
//                       className={`h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative card-hover`}
//                     >
//                       {/* Image Section */}
//                       <div
//                         className="position-relative text-center bg-light p-4"
//                         style={{ minHeight: "200px" }}
//                       >
//                         <Link to={`/medicine/${med._id}`}>
//                           <img
//                             src={
//                               med.image ||
//                               "https://placehold.co/150x150?text=No+Image"
//                             }
//                             alt={med.name}
//                             className="img-fluid transition-transform"
//                             style={{
//                               height: "140px",
//                               objectFit: "contain",
//                               mixBlendMode: "multiply",
//                             }}
//                           />
//                         </Link>

//                         {/* ✅ Wishlist Heart Button */}
//                         <button
//                           className="position-absolute top-0 end-0 m-2 btn btn-white bg-white rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center border-0"
//                           style={{ width: "35px", height: "35px", zIndex: 5 }}
//                           onClick={() => handleToggleSave(med._id)}
//                           disabled={saveLoading === med._id}
//                         >
//                           {saveLoading === med._id ? (
//                             <Spinner
//                               size="sm"
//                               style={{ width: "14px", height: "14px" }}
//                             />
//                           ) : (
//                             <Heart
//                               size={18}
//                               className={
//                                 savedIds.has(med._id)
//                                   ? "text-danger"
//                                   : "text-muted"
//                               }
//                               fill={savedIds.has(med._id) ? "#dc3545" : "none"}
//                             />
//                           )}
//                         </button>

//                         {med.prescriptionRequired && (
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>Prescription Required</Tooltip>}
//                           >
//                             <Badge
//                               bg="warning"
//                               text="dark"
//                               className="position-absolute top-0 start-0 m-3 shadow-sm d-flex align-items-center gap-1"
//                             >
//                               <ShieldAlert size={14} /> Rx
//                             </Badge>
//                           </OverlayTrigger>
//                         )}

//                         {isOutOfStock && (
//                           <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center z-2">
//                             <Badge
//                               bg="danger"
//                               className="px-3 py-2 fs-6 shadow"
//                             >
//                               Out of Stock
//                             </Badge>
//                           </div>
//                         )}
//                       </div>

//                       <Card.Body className="d-flex flex-column p-3">
//                         <div className="mb-2">
//                           <Badge
//                             bg="info"
//                             className="text-dark bg-opacity-10 border border-info border-opacity-25 mb-2 px-2 py-1"
//                           >
//                             {med.category || "General"}
//                           </Badge>
//                           <h6
//                             className="fw-bold text-truncate mb-1"
//                             title={med.name}
//                           >
//                             <Link
//                               to={`/medicine/${med._id}`}
//                               className="text-dark text-decoration-none hover-primary"
//                             >
//                               {med.name}
//                             </Link>
//                           </h6>
//                           <small className="text-muted d-block text-truncate">
//                             {med.manufacturer || "Generic"}
//                           </small>
//                         </div>

//                         {/* --- Unit Selector --- */}
//                         <div className="mt-auto bg-light rounded-3 p-2 border border-light-subtle">
//                           <div className="d-flex justify-content-between align-items-center mb-2">
//                             <label className="small text-muted fw-medium mb-0">
//                               Pack:
//                             </label>
//                             <select
//                               className="form-select form-select-sm border-0 bg-white shadow-sm py-0 ps-2 pe-4"
//                               style={{
//                                 width: "auto",
//                                 fontSize: "0.8rem",
//                                 height: "24px",
//                               }}
//                               value={selection.unitName}
//                               onChange={(e) =>
//                                 handleUnitChange(med, e.target.value)
//                               }
//                             >
//                               <option value={med.baseUnit || "Unit"}>
//                                 {med.baseUnit || "Unit"} (1x)
//                               </option>
//                               {med.units &&
//                                 med.units.map((u, idx) => (
//                                   <option key={idx} value={u.name}>
//                                     {u.name} (x{u.multiplier})
//                                   </option>
//                                 ))}
//                             </select>
//                           </div>

//                           <div className="d-flex justify-content-between align-items-end mb-3 pt-2 border-top">
//                             <div>
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Price
//                               </small>
//                               <span className="fw-bold">
//                                 ₹{selection.price}
//                               </span>
//                             </div>
//                             <div className="text-end">
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Total
//                               </small>
//                               <span className="fw-bold text-primary">
//                                 ₹{totalPrice}
//                               </span>
//                             </div>
//                           </div>

//                           <div className="d-flex gap-2">
//                             {/* Qty Control */}
//                             <div className="d-flex align-items-center bg-white rounded border flex-grow-1 justify-content-between px-1">
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0"
//                                 disabled={isOutOfStock || qty <= 1}
//                                 onClick={() => handleDecrement(med._id)}
//                               >
//                                 <Minus size={16} />
//                               </Button>
//                               <span className="fw-bold small">{qty}</span>
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0"
//                                 disabled={
//                                   isOutOfStock ||
//                                   (qty + 1) * selection.multiplier >
//                                     med.countInStock
//                                 }
//                                 onClick={() => handleIncrement(med)}
//                               >
//                                 <Plus size={16} />
//                               </Button>
//                             </div>

//                             <Button
//                               variant="primary"
//                               size="sm"
//                               className="rounded fw-bold d-flex align-items-center"
//                               disabled={isOutOfStock}
//                               onClick={() => handleAddToCart(med)}
//                             >
//                               <ShoppingCart size={16} />
//                             </Button>
//                           </div>
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 );
//               })}
//             </Row>
//           )}
//         </Col>
//       </Row>
//       <style>{`
//         .hover-primary:hover { color: var(--bs-primary) !important; }
//         .card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; transition: all 0.2s ease; }
//         .transition-transform { transition: transform 0.3s ease; }
//         .card:hover .transition-transform { transform: scale(1.05); }
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
//   Plus,
//   Minus,
//   AlertCircle,
//   CheckCircle,
//   Package,
//   ShieldAlert,
//   Heart,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../redux/actions/cartActions";
// import api from "../services/api";

// const MedicineShop = () => {
//   const dispatch = useDispatch();

//   // --- Data State ---
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // --- Filter State ---
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // --- Local State for Quantity & Unit ---
//   const [quantities, setQuantities] = useState({});
//   const [selectedUnits, setSelectedUnits] = useState({});

//   // ✅ Saved Items State
//   const [savedIds, setSavedIds] = useState(new Set());
//   const [saveLoading, setSaveLoading] = useState(null);

//   // --- 1. Debounce Search ---
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // --- 2. Fetch Data ---
//   useEffect(() => {
//     fetchMedicines();
//     fetchSavedStatus();
//     // eslint-disable-next-line
//   }, [debouncedSearch, selectedCategory]);

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const params = new URLSearchParams();
//       if (debouncedSearch) params.append("keyword", debouncedSearch);
//       if (selectedCategory !== "All")
//         params.append("category", selectedCategory);

//       const res = await api.get(`/medicines?${params.toString()}`);

//       const medList = Array.isArray(res.data)
//         ? res.data
//         : res.data.medicines || [];
//       setMedicines(medList);

//       // Initialize default selections
//       const defaultUnits = {};
//       medList.forEach((m) => {
//         defaultUnits[m._id] = {
//           unitName: m.baseUnit || "Unit",
//           price: m.price,
//           multiplier: 1,
//         };
//       });
//       setSelectedUnits((prev) => ({ ...prev, ...defaultUnits }));
//     } catch (err) {
//       setError(err.message || "Failed to load medicines");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ ROBUST FETCH SAVED STATUS
//   const fetchSavedStatus = async () => {
//     try {
//       const { data } = await api.get("/customer/saved-medicines");
//       // Safety Check: Filter out nulls if a medicine was deleted from DB
//       const ids = new Set(
//         data
//           .map((item) => item.medicine?._id) // Use optional chaining
//           .filter((id) => id) // Remove undefined/nulls
//       );
//       setSavedIds(ids);
//     } catch (err) {
//       console.error("Error fetching wishlist", err);
//     }
//   };

//   // --- Helper: Get Qty ---
//   const getQty = (id) => quantities[id] || 1;

//   // --- Quantity Handlers ---
//   const handleIncrement = (med) => {
//     const currentQty = getQty(med._id);
//     const selection = selectedUnits[med._id] || { multiplier: 1 };
//     const totalRequired = (currentQty + 1) * selection.multiplier;

//     if (totalRequired <= med.countInStock) {
//       setQuantities({ ...quantities, [med._id]: currentQty + 1 });
//     }
//   };

//   const handleDecrement = (id) => {
//     const currentQty = getQty(id);
//     if (currentQty > 1) {
//       setQuantities({ ...quantities, [id]: currentQty - 1 });
//     }
//   };

//   // --- Unit Change Handler ---
//   const handleUnitChange = (med, unitName) => {
//     let newSelection = {};

//     if (unitName === (med.baseUnit || "Unit")) {
//       newSelection = {
//         unitName: med.baseUnit || "Unit",
//         price: med.price,
//         multiplier: 1,
//       };
//     } else {
//       const unit = med.units.find((u) => u.name === unitName);
//       if (unit) {
//         newSelection = {
//           unitName: unit.name,
//           price: unit.price,
//           multiplier: unit.multiplier,
//         };
//       }
//     }

//     setSelectedUnits((prev) => ({
//       ...prev,
//       [med._id]: newSelection,
//     }));

//     setQuantities((prev) => ({ ...prev, [med._id]: 1 }));
//   };

//   // --- Add to Cart Handler ---
//   const handleAddToCart = (med) => {
//     const qty = getQty(med._id);
//     const selection = selectedUnits[med._id] || {
//       unitName: med.baseUnit || "Unit",
//       price: med.price,
//       multiplier: 1,
//     };

//     if (qty * selection.multiplier > med.countInStock) {
//       alert("Not enough stock available for this quantity!");
//       return;
//     }

//     dispatch(
//       addToCart({
//         medicine: med._id,
//         name: med.name,
//         image: med.image,
//         stock: med.countInStock,
//         unit: selection.unitName,
//         price: selection.price,
//         buyingMultiplier: selection.multiplier,
//         qty: qty,
//       })
//     );

//     alert(`${qty} x ${selection.unitName} of ${med.name} added to cart!`);
//   };

//   // ✅ FIXED SAVE HANDLER (Handles 400 Errors Gracefully)
//   const handleToggleSave = async (medicineId) => {
//     try {
//       setSaveLoading(medicineId);

//       if (savedIds.has(medicineId)) {
//         // --- UNSAVE ---
//         await api.delete(`/customer/saved-medicines/${medicineId}`);
//         setSavedIds((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(medicineId);
//           return newSet;
//         });
//       } else {
//         // --- SAVE ---
//         await api.post("/customer/saved-medicines", { medicineId });
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       }
//     } catch (err) {
//       // ✅ FIX: If error is 400 (Already Saved), just update UI to show it's saved
//       if (err.response && err.response.status === 400) {
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       } else {
//         console.error("Save Error:", err);
//       }
//     } finally {
//       setSaveLoading(null);
//     }
//   };

//   // --- Image Helper ---
//   const getImageUrl = (path) => {
//     if (!path) return "https://via.placeholder.com/150";
//     return path.startsWith("http") ? path : `http://localhost:5000${path}`;
//   };

//   const categories = [
//     "All",
//     "Tablet",
//     "Syrup",
//     "Injection",
//     "Capsule",
//     "Ointment",
//     "General",
//   ];

//   // --- Render ---
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
//       {/* 1. Header & Search */}
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
//             {searchTerm && (
//               <Button
//                 variant="outline-secondary"
//                 onClick={() => setSearchTerm("")}
//               >
//                 Clear
//               </Button>
//             )}
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
//               Showing {medicines.length} results
//             </span>
//           </div>

//           {medicines.length === 0 ? (
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
//           ) : (
//             <Row xs={1} md={2} xl={3} className="g-4">
//               {medicines.map((med) => {
//                 const qty = getQty(med._id);
//                 const selection = selectedUnits[med._id] || {
//                   unitName: med.baseUnit || "Unit",
//                   price: med.price,
//                   multiplier: 1,
//                 };

//                 const totalPrice = (selection.price * qty).toFixed(2);
//                 const isOutOfStock = med.countInStock < selection.multiplier;

//                 return (
//                   <Col key={med._id}>
//                     <Card
//                       className={`h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative card-hover`}
//                     >
//                       {/* Image Section */}
//                       <div
//                         className="position-relative text-center bg-light p-4"
//                         style={{ minHeight: "200px" }}
//                       >
//                         <Link to={`/medicine/${med._id}`}>
//                           <img
//                             src={getImageUrl(med.image)}
//                             alt={med.name}
//                             className="img-fluid transition-transform"
//                             style={{
//                               height: "140px",
//                               objectFit: "contain",
//                               mixBlendMode: "multiply",
//                             }}
//                           />
//                         </Link>

//                         {/* ✅ Wishlist Heart Button */}
//                         <button
//                           className="position-absolute top-0 end-0 m-2 btn btn-white bg-white rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center border-0"
//                           style={{ width: "35px", height: "35px", zIndex: 5 }}
//                           onClick={() => handleToggleSave(med._id)}
//                           disabled={saveLoading === med._id}
//                         >
//                           {saveLoading === med._id ? (
//                             <Spinner
//                               size="sm"
//                               style={{ width: "14px", height: "14px" }}
//                             />
//                           ) : (
//                             <Heart
//                               size={18}
//                               className={
//                                 savedIds.has(med._id)
//                                   ? "text-danger"
//                                   : "text-muted"
//                               }
//                               fill={savedIds.has(med._id) ? "#dc3545" : "none"}
//                             />
//                           )}
//                         </button>

//                         {med.prescriptionRequired && (
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>Prescription Required</Tooltip>}
//                           >
//                             <Badge
//                               bg="warning"
//                               text="dark"
//                               className="position-absolute top-0 start-0 m-3 shadow-sm d-flex align-items-center gap-1"
//                             >
//                               <ShieldAlert size={14} /> Rx
//                             </Badge>
//                           </OverlayTrigger>
//                         )}

//                         {isOutOfStock && (
//                           <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center z-2">
//                             <Badge
//                               bg="danger"
//                               className="px-3 py-2 fs-6 shadow"
//                             >
//                               Out of Stock
//                             </Badge>
//                           </div>
//                         )}
//                       </div>

//                       <Card.Body className="d-flex flex-column p-3">
//                         <div className="mb-2">
//                           <Badge
//                             bg="info"
//                             className="text-dark bg-opacity-10 border border-info border-opacity-25 mb-2 px-2 py-1"
//                           >
//                             {med.category || "General"}
//                           </Badge>
//                           <h6
//                             className="fw-bold text-truncate mb-1"
//                             title={med.name}
//                           >
//                             <Link
//                               to={`/medicine/${med._id}`}
//                               className="text-dark text-decoration-none hover-primary"
//                             >
//                               {med.name}
//                             </Link>
//                           </h6>
//                           <small className="text-muted d-block text-truncate">
//                             {med.manufacturer || "Generic"}
//                           </small>
//                         </div>

//                         {/* --- Unit Selector --- */}
//                         <div className="mt-auto bg-light rounded-3 p-2 border border-light-subtle">
//                           <div className="d-flex justify-content-between align-items-center mb-2">
//                             <label className="small text-muted fw-medium mb-0">
//                               Pack:
//                             </label>
//                             <select
//                               className="form-select form-select-sm border-0 bg-white shadow-sm py-0 ps-2 pe-4"
//                               style={{
//                                 width: "auto",
//                                 fontSize: "0.8rem",
//                                 height: "24px",
//                               }}
//                               value={selection.unitName}
//                               onChange={(e) =>
//                                 handleUnitChange(med, e.target.value)
//                               }
//                             >
//                               <option value={med.baseUnit || "Unit"}>
//                                 {med.baseUnit || "Unit"} (1x)
//                               </option>
//                               {med.units &&
//                                 med.units.map((u, idx) => (
//                                   <option key={idx} value={u.name}>
//                                     {u.name} (x{u.multiplier})
//                                   </option>
//                                 ))}
//                             </select>
//                           </div>

//                           <div className="d-flex justify-content-between align-items-end mb-3 pt-2 border-top">
//                             <div>
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Price
//                               </small>
//                               <span className="fw-bold">
//                                 ₹{selection.price}
//                               </span>
//                             </div>
//                             <div className="text-end">
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Total
//                               </small>
//                               <span className="fw-bold text-primary">
//                                 ₹{totalPrice}
//                               </span>
//                             </div>
//                           </div>

//                           <div className="d-flex gap-2">
//                             {/* Qty Control */}
//                             <div className="d-flex align-items-center bg-white rounded border flex-grow-1 justify-content-between px-1">
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0"
//                                 disabled={isOutOfStock || qty <= 1}
//                                 onClick={() => handleDecrement(med._id)}
//                               >
//                                 <Minus size={16} />
//                               </Button>
//                               <span className="fw-bold small">{qty}</span>
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0"
//                                 disabled={
//                                   isOutOfStock ||
//                                   (qty + 1) * selection.multiplier >
//                                     med.countInStock
//                                 }
//                                 onClick={() => handleIncrement(med)}
//                               >
//                                 <Plus size={16} />
//                               </Button>
//                             </div>

//                             <Button
//                               variant="primary"
//                               size="sm"
//                               className="rounded fw-bold d-flex align-items-center"
//                               disabled={isOutOfStock}
//                               onClick={() => handleAddToCart(med)}
//                             >
//                               <ShoppingCart size={16} />
//                             </Button>
//                           </div>
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 );
//               })}
//             </Row>
//           )}
//         </Col>
//       </Row>
//       <style>{`
//         .hover-primary:hover { color: var(--bs-primary) !important; }
//         .card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; transition: all 0.2s ease; }
//         .transition-transform { transition: transform 0.3s ease; }
//         .card:hover .transition-transform { transform: scale(1.05); }
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
//   Plus,
//   Minus,
//   AlertCircle,
//   CheckCircle,
//   Package,
//   ShieldAlert,
//   Heart,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../redux/actions/cartActions";
// import api from "../services/api";

// const MedicineShop = () => {
//   const dispatch = useDispatch();

//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [quantities, setQuantities] = useState({});
//   const [selectedUnits, setSelectedUnits] = useState({});
//   const [savedIds, setSavedIds] = useState(new Set());
//   const [saveLoading, setSaveLoading] = useState(null);

//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   useEffect(() => {
//     fetchMedicines();
//     fetchSavedStatus();
//   }, [debouncedSearch, selectedCategory]);

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const params = new URLSearchParams();
//       if (debouncedSearch) params.append("keyword", debouncedSearch);
//       if (selectedCategory !== "All")
//         params.append("category", selectedCategory);

//       const res = await api.get(`/medicines?${params.toString()}`);
//       const medList = Array.isArray(res.data)
//         ? res.data
//         : res.data.medicines || [];
//       setMedicines(medList);

//       const defaultUnits = {};
//       medList.forEach((m) => {
//         defaultUnits[m._id] = {
//           unitName: m.baseUnit || "Unit",
//           price: m.price,
//           multiplier: 1,
//         };
//       });
//       setSelectedUnits((prev) => ({ ...prev, ...defaultUnits }));
//     } catch (err) {
//       setError(err.message || "Failed to load medicines");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ UPDATED: Safer Fetch
//   const fetchSavedStatus = async () => {
//     try {
//       const { data } = await api.get("/customer/saved-medicines");

//       // If backend sends empty array (which it will now instead of 500), handle it safely
//       if (!Array.isArray(data)) {
//         setSavedIds(new Set());
//         return;
//       }

//       const ids = new Set(
//         data.map((item) => item.medicine?._id).filter((id) => id) // Remove nulls
//       );
//       setSavedIds(ids);
//     } catch (err) {
//       console.error("Error fetching wishlist", err);
//     }
//   };

//   const getQty = (id) => quantities[id] || 1;

//   const handleIncrement = (med) => {
//     const currentQty = getQty(med._id);
//     const selection = selectedUnits[med._id] || { multiplier: 1 };
//     if ((currentQty + 1) * selection.multiplier <= med.countInStock) {
//       setQuantities({ ...quantities, [med._id]: currentQty + 1 });
//     }
//   };

//   const handleDecrement = (id) => {
//     const currentQty = getQty(id);
//     if (currentQty > 1) setQuantities({ ...quantities, [id]: currentQty - 1 });
//   };

//   const handleUnitChange = (med, unitName) => {
//     let newSelection = {};
//     if (unitName === (med.baseUnit || "Unit")) {
//       newSelection = {
//         unitName: med.baseUnit || "Unit",
//         price: med.price,
//         multiplier: 1,
//       };
//     } else {
//       const unit = med.units.find((u) => u.name === unitName);
//       if (unit)
//         newSelection = {
//           unitName: unit.name,
//           price: unit.price,
//           multiplier: unit.multiplier,
//         };
//     }
//     setSelectedUnits((prev) => ({ ...prev, [med._id]: newSelection }));
//     setQuantities((prev) => ({ ...prev, [med._id]: 1 }));
//   };

//   const handleAddToCart = (med) => {
//     const qty = getQty(med._id);
//     const selection = selectedUnits[med._id] || {
//       unitName: "Unit",
//       price: med.price,
//       multiplier: 1,
//     };

//     if (qty * selection.multiplier > med.countInStock) {
//       alert("Not enough stock!");
//       return;
//     }
//     dispatch(
//       addToCart({
//         medicine: med._id,
//         name: med.name,
//         image: med.image,
//         stock: med.countInStock,
//         unit: selection.unitName,
//         price: selection.price,
//         buyingMultiplier: selection.multiplier,
//         qty: qty,
//       })
//     );
//     alert("Added to Cart!");
//   };

//   const handleToggleSave = async (medicineId) => {
//     try {
//       setSaveLoading(medicineId);
//       if (savedIds.has(medicineId)) {
//         await api.delete(`/customer/saved-medicines/${medicineId}`);
//         setSavedIds((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(medicineId);
//           return newSet;
//         });
//       } else {
//         await api.post("/customer/saved-medicines", { medicineId });
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       }
//     } catch (err) {
//       if (err.response && err.response.status === 400) {
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       } else {
//         console.error("Save Error:", err);
//       }
//     } finally {
//       setSaveLoading(null);
//     }
//   };

//   // Image Helper to prevent broken images
//   const getImageUrl = (path) => {
//     if (!path) return "https://via.placeholder.com/150";
//     return path.startsWith("http") ? path : `http://localhost:5000${path}`;
//   };

//   const categories = [
//     "All",
//     "Tablet",
//     "Syrup",
//     "Injection",
//     "Capsule",
//     "Ointment",
//     "General",
//   ];

//   if (loading)
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ minHeight: "60vh" }}
//       >
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );
//   if (error)
//     return (
//       <Container className="py-5 text-center">
//         <div className="text-danger mb-3">
//           <AlertCircle size={64} />
//         </div>
//         <h4>Oops!</h4>
//         <p>{error}</p>
//         <Button onClick={fetchMedicines}>Try Again</Button>
//       </Container>
//     );

//   return (
//     <Container className="py-5">
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
//               <Search size={18} />
//             </InputGroup.Text>
//             <Form.Control
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <Button
//                 variant="outline-secondary"
//                 onClick={() => setSearchTerm("")}
//               >
//                 Clear
//               </Button>
//             )}
//           </InputGroup>
//         </Col>
//       </Row>
//       <Row>
//         <Col lg={3} className="mb-4">
//           <Card
//             className="border-0 shadow-sm rounded-4 sticky-top"
//             style={{ top: "100px", zIndex: 1 }}
//           >
//             <Card.Header className="bg-white border-bottom-0 pt-4">
//               <h5 className="fw-bold mb-0">
//                 <Filter size={20} className="me-2 text-primary" /> Filter By
//               </h5>
//             </Card.Header>
//             <Card.Body>
//               <div className="d-flex flex-column gap-2">
//                 {categories.map((cat) => (
//                   <Button
//                     key={cat}
//                     variant={selectedCategory === cat ? "primary" : "light"}
//                     className={`text-start d-flex justify-content-between px-3 ${
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
//         <Col lg={9}>
//           {medicines.length === 0 ? (
//             <div className="text-center py-5">
//               <Package size={48} className="text-muted opacity-50" />
//               <h5>No medicines found</h5>
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
//           ) : (
//             <Row xs={1} md={2} xl={3} className="g-4">
//               {medicines.map((med) => {
//                 const qty = getQty(med._id);
//                 const selection = selectedUnits[med._id] || {
//                   unitName: "Unit",
//                   price: med.price,
//                   multiplier: 1,
//                 };
//                 const totalPrice = (selection.price * qty).toFixed(2);
//                 const isOutOfStock = med.countInStock < selection.multiplier;

//                 return (
//                   <Col key={med._id}>
//                     <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative card-hover">
//                       <div
//                         className="position-relative text-center bg-light p-4"
//                         style={{ minHeight: "200px" }}
//                       >
//                         <Link to={`/medicine/${med._id}`}>
//                           <img
//                             src={getImageUrl(med.image)}
//                             alt={med.name}
//                             className="img-fluid transition-transform"
//                             style={{
//                               height: "140px",
//                               objectFit: "contain",
//                               mixBlendMode: "multiply",
//                             }}
//                           />
//                         </Link>
//                         <button
//                           className="position-absolute top-0 end-0 m-2 btn btn-white bg-white rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center border-0"
//                           style={{ width: "35px", height: "35px", zIndex: 5 }}
//                           onClick={() => handleToggleSave(med._id)}
//                           disabled={saveLoading === med._id}
//                         >
//                           {saveLoading === med._id ? (
//                             <Spinner size="sm" />
//                           ) : (
//                             <Heart
//                               size={18}
//                               className={
//                                 savedIds.has(med._id)
//                                   ? "text-danger"
//                                   : "text-muted"
//                               }
//                               fill={savedIds.has(med._id) ? "#dc3545" : "none"}
//                             />
//                           )}
//                         </button>
//                         {med.prescriptionRequired && (
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>Prescription Required</Tooltip>}
//                           >
//                             <Badge
//                               bg="warning"
//                               text="dark"
//                               className="position-absolute top-0 start-0 m-3 shadow-sm"
//                             >
//                               <ShieldAlert size={14} /> Rx
//                             </Badge>
//                           </OverlayTrigger>
//                         )}
//                         {isOutOfStock && (
//                           <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center z-2">
//                             <Badge
//                               bg="danger"
//                               className="px-3 py-2 fs-6 shadow"
//                             >
//                               Out of Stock
//                             </Badge>
//                           </div>
//                         )}
//                       </div>
//                       <Card.Body className="d-flex flex-column p-3">
//                         <div className="mb-2">
//                           <Badge
//                             bg="info"
//                             className="text-dark bg-opacity-10 border border-info border-opacity-25 mb-2 px-2 py-1"
//                           >
//                             {med.category || "General"}
//                           </Badge>
//                           <h6
//                             className="fw-bold text-truncate mb-1"
//                             title={med.name}
//                           >
//                             <Link
//                               to={`/medicine/${med._id}`}
//                               className="text-dark text-decoration-none hover-primary"
//                             >
//                               {med.name}
//                             </Link>
//                           </h6>
//                           <small className="text-muted d-block text-truncate">
//                             {med.manufacturer || "Generic"}
//                           </small>
//                         </div>
//                         <div className="mt-auto bg-light rounded-3 p-2 border border-light-subtle">
//                           <div className="d-flex justify-content-between align-items-center mb-2">
//                             <label className="small text-muted fw-medium mb-0">
//                               Pack:
//                             </label>
//                             <select
//                               className="form-select form-select-sm border-0 bg-white shadow-sm py-0 ps-2 pe-4"
//                               style={{
//                                 width: "auto",
//                                 fontSize: "0.8rem",
//                                 height: "24px",
//                               }}
//                               value={selection.unitName}
//                               onChange={(e) =>
//                                 handleUnitChange(med, e.target.value)
//                               }
//                             >
//                               <option value={med.baseUnit || "Unit"}>
//                                 {med.baseUnit || "Unit"} (1x)
//                               </option>
//                               {med.units &&
//                                 med.units.map((u, idx) => (
//                                   <option key={idx} value={u.name}>
//                                     {u.name} (x{u.multiplier})
//                                   </option>
//                                 ))}
//                             </select>
//                           </div>
//                           <div className="d-flex justify-content-between align-items-end mb-3 pt-2 border-top">
//                             <div>
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Price
//                               </small>
//                               <span className="fw-bold">
//                                 ₹{selection.price}
//                               </span>
//                             </div>
//                             <div className="text-end">
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Total
//                               </small>
//                               <span className="fw-bold text-primary">
//                                 ₹{totalPrice}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="d-flex gap-2">
//                             <div className="d-flex align-items-center bg-white rounded border flex-grow-1 justify-content-between px-1">
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0"
//                                 disabled={isOutOfStock || qty <= 1}
//                                 onClick={() => handleDecrement(med._id)}
//                               >
//                                 <Minus size={16} />
//                               </Button>
//                               <span className="fw-bold small">{qty}</span>
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0"
//                                 disabled={
//                                   isOutOfStock ||
//                                   (qty + 1) * selection.multiplier >
//                                     med.countInStock
//                                 }
//                                 onClick={() => handleIncrement(med)}
//                               >
//                                 <Plus size={16} />
//                               </Button>
//                             </div>
//                             <Button
//                               variant="primary"
//                               size="sm"
//                               className="rounded fw-bold d-flex align-items-center"
//                               disabled={isOutOfStock}
//                               onClick={() => handleAddToCart(med)}
//                             >
//                               <ShoppingCart size={16} />
//                             </Button>
//                           </div>
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 );
//               })}
//             </Row>
//           )}
//         </Col>
//       </Row>
//       <style>{`.hover-primary:hover { color: var(--bs-primary) !important; } .card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; transition: all 0.2s ease; } .transition-transform { transition: transform 0.3s ease; } .card:hover .transition-transform { transform: scale(1.05); }`}</style>
//     </Container>
//   );
// };

// export default MedicineShop;

//import React, { useState, useEffect } from "react";
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
//   Plus,
//   Minus,
//   AlertCircle,
//   CheckCircle,
//   Package,
//   ShieldAlert,
//   Heart,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../redux/actions/cartActions";
// import api from "../services/api";

// const MedicineShop = () => {
//   const dispatch = useDispatch();

//   // --- Data State ---
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // --- Filter State ---
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // --- Local State for Quantity & Unit ---
//   const [quantities, setQuantities] = useState({});
//   const [selectedUnits, setSelectedUnits] = useState({});

//   // ✅ Saved Items State
//   const [savedIds, setSavedIds] = useState(new Set());
//   const [saveLoading, setSaveLoading] = useState(null);

//   // --- 1. Debounce Search ---
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // --- 2. Fetch Data ---
//   useEffect(() => {
//     fetchMedicines();
//     fetchSavedStatus();
//     // eslint-disable-next-line
//   }, [debouncedSearch, selectedCategory]);

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const params = new URLSearchParams();
//       if (debouncedSearch) params.append("keyword", debouncedSearch);
//       if (selectedCategory !== "All")
//         params.append("category", selectedCategory);

//       const res = await api.get(`/medicines?${params.toString()}`);

//       const medList = Array.isArray(res.data)
//         ? res.data
//         : res.data.medicines || [];
//       setMedicines(medList);

//       // Initialize default selections
//       const defaultUnits = {};
//       medList.forEach((m) => {
//         defaultUnits[m._id] = {
//           unitName: m.baseUnit || "Unit",
//           price: m.price,
//           multiplier: 1,
//         };
//       });
//       setSelectedUnits((prev) => ({ ...prev, ...defaultUnits }));
//     } catch (err) {
//       setError(err.message || "Failed to load medicines");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ ROBUST FETCH SAVED STATUS
//   const fetchSavedStatus = async () => {
//     try {
//       const { data } = await api.get("/customer/saved-medicines");

//       // Safety Check: Ensure data is an array before mapping
//       // This handles cases where backend might return null/undefined/empty object on error
//       if (!Array.isArray(data)) {
//         setSavedIds(new Set());
//         return;
//       }

//       const ids = new Set(
//         data
//           .map((item) => item.medicine?._id) // Use optional chaining
//           .filter((id) => id) // Remove undefined/nulls
//       );
//       setSavedIds(ids);
//     } catch (err) {
//       console.error("Error fetching wishlist", err);
//       // Fail silently for the user, but log for dev.
//       // User just won't see hearts, which is better than a crash.
//     }
//   };

//   // --- Helper: Get Qty ---
//   const getQty = (id) => quantities[id] || 1;

//   // --- Quantity Handlers ---
//   const handleIncrement = (med) => {
//     const currentQty = getQty(med._id);
//     const selection = selectedUnits[med._id] || { multiplier: 1 };
//     const totalRequired = (currentQty + 1) * selection.multiplier;

//     if (totalRequired <= med.countInStock) {
//       setQuantities({ ...quantities, [med._id]: currentQty + 1 });
//     }
//   };

//   const handleDecrement = (id) => {
//     const currentQty = getQty(id);
//     if (currentQty > 1) {
//       setQuantities({ ...quantities, [id]: currentQty - 1 });
//     }
//   };

//   // --- Unit Change Handler ---
//   const handleUnitChange = (med, unitName) => {
//     let newSelection = {};

//     if (unitName === (med.baseUnit || "Unit")) {
//       newSelection = {
//         unitName: med.baseUnit || "Unit",
//         price: med.price,
//         multiplier: 1,
//       };
//     } else {
//       const unit = med.units.find((u) => u.name === unitName);
//       if (unit) {
//         newSelection = {
//           unitName: unit.name,
//           price: unit.price,
//           multiplier: unit.multiplier,
//         };
//       }
//     }

//     setSelectedUnits((prev) => ({
//       ...prev,
//       [med._id]: newSelection,
//     }));

//     setQuantities((prev) => ({ ...prev, [med._id]: 1 }));
//   };

//   // --- Add to Cart Handler ---
//   const handleAddToCart = (med) => {
//     const qty = getQty(med._id);
//     const selection = selectedUnits[med._id] || {
//       unitName: med.baseUnit || "Unit",
//       price: med.price,
//       multiplier: 1,
//     };

//     if (qty * selection.multiplier > med.countInStock) {
//       alert("Not enough stock available for this quantity!");
//       return;
//     }

//     dispatch(
//       addToCart({
//         medicine: med._id,
//         name: med.name,
//         image: med.image,
//         stock: med.countInStock,
//         unit: selection.unitName,
//         price: selection.price,
//         buyingMultiplier: selection.multiplier,
//         qty: qty,
//       })
//     );

//     alert(`${qty} x ${selection.unitName} of ${med.name} added to cart!`);
//   };

//   // ✅ FIXED SAVE HANDLER (Handles 400 Errors Gracefully)
//   const handleToggleSave = async (medicineId) => {
//     try {
//       setSaveLoading(medicineId);

//       if (savedIds.has(medicineId)) {
//         // --- UNSAVE ---
//         await api.delete(`/customer/saved-medicines/${medicineId}`);
//         setSavedIds((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(medicineId);
//           return newSet;
//         });
//       } else {
//         // --- SAVE ---
//         await api.post("/customer/saved-medicines", { medicineId });
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       }
//     } catch (err) {
//       // ✅ FIX: If error is 400 (Already Saved), just update UI to show it's saved
//       if (err.response && err.response.status === 400) {
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       } else {
//         console.error("Save Error:", err);
//       }
//     } finally {
//       setSaveLoading(null);
//     }
//   };

//   // --- Image Helper ---
//   const getImageUrl = (path) => {
//     if (!path) return "https://via.placeholder.com/150";
//     return path.startsWith("http") ? path : `http://localhost:5000${path}`;
//   };

//   const categories = [
//     "All",
//     "Tablet",
//     "Syrup",
//     "Injection",
//     "Capsule",
//     "Ointment",
//     "General",
//   ];

//   // --- Render ---
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
//       {/* 1. Header & Search */}
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
//             {searchTerm && (
//               <Button
//                 variant="outline-secondary"
//                 onClick={() => setSearchTerm("")}
//               >
//                 Clear
//               </Button>
//             )}
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
//               Showing {medicines.length} results
//             </span>
//           </div>

//           {medicines.length === 0 ? (
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
//           ) : (
//             <Row xs={1} md={2} xl={3} className="g-4">
//               {medicines.map((med) => {
//                 const qty = getQty(med._id);
//                 const selection = selectedUnits[med._id] || {
//                   unitName: med.baseUnit || "Unit",
//                   price: med.price,
//                   multiplier: 1,
//                 };

//                 const totalPrice = (selection.price * qty).toFixed(2);
//                 const isOutOfStock = med.countInStock < selection.multiplier;

//                 return (
//                   <Col key={med._id}>
//                     <Card
//                       className={`h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative card-hover`}
//                     >
//                       {/* Image Section */}
//                       <div
//                         className="position-relative text-center bg-light p-4"
//                         style={{ minHeight: "200px" }}
//                       >
//                         <Link to={`/medicine/${med._id}`}>
//                           <img
//                             src={getImageUrl(med.image)}
//                             alt={med.name}
//                             className="img-fluid transition-transform"
//                             style={{
//                               height: "140px",
//                               objectFit: "contain",
//                               mixBlendMode: "multiply",
//                             }}
//                           />
//                         </Link>

//                         {/* ✅ Wishlist Heart Button */}
//                         <button
//                           className="position-absolute top-0 end-0 m-2 btn btn-white bg-white rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center border-0"
//                           style={{ width: "35px", height: "35px", zIndex: 5 }}
//                           onClick={() => handleToggleSave(med._id)}
//                           disabled={saveLoading === med._id}
//                         >
//                           {saveLoading === med._id ? (
//                             <Spinner
//                               size="sm"
//                               style={{ width: "14px", height: "14px" }}
//                             />
//                           ) : (
//                             <Heart
//                               size={18}
//                               className={
//                                 savedIds.has(med._id)
//                                   ? "text-danger"
//                                   : "text-muted"
//                               }
//                               fill={savedIds.has(med._id) ? "#dc3545" : "none"}
//                             />
//                           )}
//                         </button>

//                         {med.prescriptionRequired && (
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>Prescription Required</Tooltip>}
//                           >
//                             <Badge
//                               bg="warning"
//                               text="dark"
//                               className="position-absolute top-0 start-0 m-3 shadow-sm d-flex align-items-center gap-1"
//                             >
//                               <ShieldAlert size={14} /> Rx
//                             </Badge>
//                           </OverlayTrigger>
//                         )}

//                         {isOutOfStock && (
//                           <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center z-2">
//                             <Badge
//                               bg="danger"
//                               className="px-3 py-2 fs-6 shadow"
//                             >
//                               Out of Stock
//                             </Badge>
//                           </div>
//                         )}
//                       </div>

//                       <Card.Body className="d-flex flex-column p-3">
//                         <div className="mb-2">
//                           <Badge
//                             bg="info"
//                             className="text-dark bg-opacity-10 border border-info border-opacity-25 mb-2 px-2 py-1"
//                           >
//                             {med.category || "General"}
//                           </Badge>
//                           <h6
//                             className="fw-bold text-truncate mb-1"
//                             title={med.name}
//                           >
//                             <Link
//                               to={`/medicine/${med._id}`}
//                               className="text-dark text-decoration-none hover-primary"
//                             >
//                               {med.name}
//                             </Link>
//                           </h6>
//                           <small className="text-muted d-block text-truncate">
//                             {med.manufacturer || "Generic"}
//                           </small>
//                         </div>

//                         {/* --- Unit Selector --- */}
//                         <div className="mt-auto bg-light rounded-3 p-2 border border-light-subtle">
//                           <div className="d-flex justify-content-between align-items-center mb-2">
//                             <label className="small text-muted fw-medium mb-0">
//                               Pack:
//                             </label>
//                             <select
//                               className="form-select form-select-sm border-0 bg-white shadow-sm py-0 ps-2 pe-4"
//                               style={{
//                                 width: "auto",
//                                 fontSize: "0.8rem",
//                                 height: "24px",
//                               }}
//                               value={selection.unitName}
//                               onChange={(e) =>
//                                 handleUnitChange(med, e.target.value)
//                               }
//                             >
//                               <option value={med.baseUnit || "Unit"}>
//                                 {med.baseUnit || "Unit"} (1x)
//                               </option>
//                               {med.units &&
//                                 med.units.map((u, idx) => (
//                                   <option key={idx} value={u.name}>
//                                     {u.name} (x{u.multiplier})
//                                   </option>
//                                 ))}
//                             </select>
//                           </div>

//                           <div className="d-flex justify-content-between align-items-end mb-3 pt-2 border-top">
//                             <div>
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Price
//                               </small>
//                               <span className="fw-bold">
//                                 ₹{selection.price}
//                               </span>
//                             </div>
//                             <div className="text-end">
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Total
//                               </small>
//                               <span className="fw-bold text-primary">
//                                 ₹{totalPrice}
//                               </span>
//                             </div>
//                           </div>

//                           <div className="d-flex gap-2">
//                             {/* Qty Control */}
//                             <div className="d-flex align-items-center bg-white rounded border flex-grow-1 justify-content-between px-1">
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0"
//                                 disabled={isOutOfStock || qty <= 1}
//                                 onClick={() => handleDecrement(med._id)}
//                               >
//                                 <Minus size={16} />
//                               </Button>
//                               <span className="fw-bold small">{qty}</span>
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0"
//                                 disabled={
//                                   isOutOfStock ||
//                                   (qty + 1) * selection.multiplier >
//                                     med.countInStock
//                                 }
//                                 onClick={() => handleIncrement(med)}
//                               >
//                                 <Plus size={16} />
//                               </Button>
//                             </div>

//                             <Button
//                               variant="primary"
//                               size="sm"
//                               className="rounded fw-bold d-flex align-items-center"
//                               disabled={isOutOfStock}
//                               onClick={() => handleAddToCart(med)}
//                             >
//                               <ShoppingCart size={16} />
//                             </Button>
//                           </div>
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 );
//               })}
//             </Row>
//           )}
//         </Col>
//       </Row>
//       <style>{`
//         .hover-primary:hover { color: var(--bs-primary) !important; }
//         .card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; transition: all 0.2s ease; }
//         .transition-transform { transition: transform 0.3s ease; }
//         .card:hover .transition-transform { transform: scale(1.05); }
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
//   Plus,
//   Minus,
//   AlertCircle,
//   CheckCircle,
//   Package,
//   ShieldAlert,
//   Heart,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../redux/actions/cartActions";
// import api from "../services/api";

// const MedicineShop = () => {
//   const dispatch = useDispatch();

//   // --- Data State ---
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // --- Filter State ---
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // --- Local State ---
//   const [quantities, setQuantities] = useState({});
//   const [selectedUnits, setSelectedUnits] = useState({});
//   const [savedIds, setSavedIds] = useState(new Set());
//   const [saveLoading, setSaveLoading] = useState(null);

//   // --- 1. Debounce Search ---
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // --- 2. Fetch Data (Combined & Robust) ---
//   useEffect(() => {
//     let isMounted = true;

//     const loadData = async () => {
//       if (isMounted) {
//         setLoading(true);
//         setError("");
//       }

//       try {
//         // 1. Fetch Medicines
//         const params = new URLSearchParams();
//         if (debouncedSearch) params.append("keyword", debouncedSearch);
//         if (selectedCategory !== "All")
//           params.append("category", selectedCategory);

//         const res = await api.get(`/medicines?${params.toString()}`);

//         if (isMounted) {
//           const medList = Array.isArray(res.data)
//             ? res.data
//             : res.data.medicines || [];
//           setMedicines(medList);

//           // Initialize units
//           const defaultUnits = {};
//           medList.forEach((m) => {
//             defaultUnits[m._id] = {
//               unitName: m.baseUnit || "Unit",
//               price: m.price,
//               multiplier: 1,
//             };
//           });
//           setSelectedUnits((prev) => ({ ...prev, ...defaultUnits }));
//         }

//         // 2. Fetch Saved Status (Independent try/catch so it doesn't block medicines)
//         if (isMounted) {
//           await fetchSavedStatus();
//         }
//       } catch (err) {
//         if (isMounted) setError(err.message || "Failed to load medicines");
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     loadData();

//     return () => {
//       isMounted = false;
//     };
//   }, [debouncedSearch, selectedCategory]);

//   // ✅ ROBUST FETCH SAVED STATUS (Fixed Logic)
//   const fetchSavedStatus = async () => {
//     try {
//       const { data } = await api.get("/customer/saved-medicines");

//       // Safety Check: Ensure data is an array
//       if (!Array.isArray(data)) {
//         console.warn("Saved items format invalid", data);
//         setSavedIds(new Set());
//         return;
//       }

//       const ids = new Set(
//         data
//           .map((item) => {
//             // ⚠️ LOGIC FIX: Prioritize the nested medicine ID.
//             // item.medicine can be an object (populated) or string (unpopulated ID)
//             if (item.medicine && typeof item.medicine === "object") {
//               return item.medicine._id;
//             }
//             return item.medicine; // Fallback if not populated
//           })
//           .filter((id) => id) // Remove nulls/undefined
//       );
//       setSavedIds(ids);
//     } catch (err) {
//       // Gracefully handle 500 errors by logging them but not breaking UI
//       console.error(
//         "Wishlist sync failed (Backend might be down):",
//         err.message
//       );
//       setSavedIds(new Set()); // Default to empty wishlist on error
//     }
//   };

//   // --- Helper Functions ---
//   const getQty = (id) => quantities[id] || 1;

//   const handleIncrement = (med) => {
//     const currentQty = getQty(med._id);
//     const selection = selectedUnits[med._id] || { multiplier: 1 };
//     if ((currentQty + 1) * selection.multiplier <= med.countInStock) {
//       setQuantities({ ...quantities, [med._id]: currentQty + 1 });
//     }
//   };

//   const handleDecrement = (id) => {
//     const currentQty = getQty(id);
//     if (currentQty > 1) setQuantities({ ...quantities, [id]: currentQty - 1 });
//   };

//   const handleUnitChange = (med, unitName) => {
//     let newSelection = {};
//     if (unitName === (med.baseUnit || "Unit")) {
//       newSelection = {
//         unitName: med.baseUnit || "Unit",
//         price: med.price,
//         multiplier: 1,
//       };
//     } else {
//       const unit = med.units.find((u) => u.name === unitName);
//       if (unit)
//         newSelection = {
//           unitName: unit.name,
//           price: unit.price,
//           multiplier: unit.multiplier,
//         };
//     }
//     setSelectedUnits((prev) => ({ ...prev, [med._id]: newSelection }));
//     setQuantities((prev) => ({ ...prev, [med._id]: 1 }));
//   };

//   const handleAddToCart = (med) => {
//     const qty = getQty(med._id);
//     const selection = selectedUnits[med._id] || {
//       unitName: "Unit",
//       price: med.price,
//       multiplier: 1,
//     };
//     if (qty * selection.multiplier > med.countInStock) {
//       alert("Not enough stock available!");
//       return;
//     }
//     dispatch(
//       addToCart({
//         medicine: med._id,
//         name: med.name,
//         image: med.image,
//         stock: med.countInStock,
//         unit: selection.unitName,
//         price: selection.price,
//         buyingMultiplier: selection.multiplier,
//         qty: qty,
//       })
//     );
//     alert("Added to Cart!");
//   };

//   const handleToggleSave = async (medicineId) => {
//     try {
//       setSaveLoading(medicineId);
//       if (savedIds.has(medicineId)) {
//         await api.delete(`/customer/saved-medicines/${medicineId}`);
//         setSavedIds((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(medicineId);
//           return newSet;
//         });
//       } else {
//         await api.post("/customer/saved-medicines", { medicineId });
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       }
//     } catch (err) {
//       // Optimistic update for "Already Saved" (400)
//       if (err.response && err.response.status === 400) {
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       } else {
//         console.error("Save Error:", err);
//         alert("Could not save item. Please try again.");
//       }
//     } finally {
//       setSaveLoading(null);
//     }
//   };

//   const getImageUrl = (path) => {
//     if (!path) return "https://via.placeholder.com/150";
//     return path.startsWith("http") ? path : `http://localhost:5000${path}`;
//   };

//   const categories = [
//     "All",
//     "Tablet",
//     "Syrup",
//     "Injection",
//     "Capsule",
//     "Ointment",
//     "General",
//   ];

//   // --- Render ---
//   if (loading)
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ minHeight: "60vh" }}
//       >
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );
//   if (error)
//     return (
//       <Container className="py-5 text-center">
//         <div className="text-danger mb-3">
//           <AlertCircle size={64} />
//         </div>
//         <h4>Oops!</h4>
//         <p>{error}</p>
//         <Button onClick={() => window.location.reload()}>Try Again</Button>
//       </Container>
//     );

//   return (
//     <Container className="py-5">
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
//               <Search size={18} />
//             </InputGroup.Text>
//             <Form.Control
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <Button
//                 variant="outline-secondary"
//                 onClick={() => setSearchTerm("")}
//               >
//                 Clear
//               </Button>
//             )}
//           </InputGroup>
//         </Col>
//       </Row>
//       <Row>
//         <Col lg={3} className="mb-4">
//           <Card
//             className="border-0 shadow-sm rounded-4 sticky-top"
//             style={{ top: "100px", zIndex: 1 }}
//           >
//             <Card.Header className="bg-white border-bottom-0 pt-4">
//               <h5 className="fw-bold mb-0">
//                 <Filter size={20} className="me-2 text-primary" /> Filter By
//               </h5>
//             </Card.Header>
//             <Card.Body>
//               <div className="d-flex flex-column gap-2">
//                 {categories.map((cat) => (
//                   <Button
//                     key={cat}
//                     variant={selectedCategory === cat ? "primary" : "light"}
//                     className={`text-start d-flex justify-content-between px-3 ${
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
//         <Col lg={9}>
//           {medicines.length === 0 ? (
//             <div className="text-center py-5">
//               <Package size={48} className="text-muted opacity-50" />
//               <h5>No medicines found</h5>
//             </div>
//           ) : (
//             <Row xs={1} md={2} xl={3} className="g-4">
//               {medicines.map((med) => {
//                 const qty = getQty(med._id);
//                 const selection = selectedUnits[med._id] || {
//                   unitName: "Unit",
//                   price: med.price,
//                   multiplier: 1,
//                 };
//                 const totalPrice = (selection.price * qty).toFixed(2);
//                 const isOutOfStock = med.countInStock < selection.multiplier;
//                 return (
//                   <Col key={med._id}>
//                     <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative card-hover">
//                       <div
//                         className="position-relative text-center bg-light p-4"
//                         style={{ minHeight: "200px" }}
//                       >
//                         <Link to={`/medicine/${med._id}`}>
//                           <img
//                             src={getImageUrl(med.image)}
//                             alt={med.name}
//                             className="img-fluid transition-transform"
//                             style={{
//                               height: "140px",
//                               objectFit: "contain",
//                               mixBlendMode: "multiply",
//                             }}
//                           />
//                         </Link>
//                         <button
//                           className="position-absolute top-0 end-0 m-2 btn btn-white bg-white rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center border-0"
//                           style={{ width: "35px", height: "35px", zIndex: 5 }}
//                           onClick={() => handleToggleSave(med._id)}
//                           disabled={saveLoading === med._id}
//                         >
//                           {saveLoading === med._id ? (
//                             <Spinner size="sm" />
//                           ) : (
//                             <Heart
//                               size={18}
//                               className={
//                                 savedIds.has(med._id)
//                                   ? "text-danger"
//                                   : "text-muted"
//                               }
//                               fill={savedIds.has(med._id) ? "#dc3545" : "none"}
//                             />
//                           )}
//                         </button>
//                         {med.prescriptionRequired && (
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>Prescription Required</Tooltip>}
//                           >
//                             <Badge
//                               bg="warning"
//                               text="dark"
//                               className="position-absolute top-0 start-0 m-3 shadow-sm"
//                             >
//                               <ShieldAlert size={14} /> Rx
//                             </Badge>
//                           </OverlayTrigger>
//                         )}
//                         {isOutOfStock && (
//                           <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center z-2">
//                             <Badge
//                               bg="danger"
//                               className="px-3 py-2 fs-6 shadow"
//                             >
//                               Out of Stock
//                             </Badge>
//                           </div>
//                         )}
//                       </div>
//                       <Card.Body className="d-flex flex-column p-3">
//                         <div className="mb-2">
//                           <Badge
//                             bg="info"
//                             className="text-dark bg-opacity-10 border border-info border-opacity-25 mb-2 px-2 py-1"
//                           >
//                             {med.category || "General"}
//                           </Badge>
//                           <h6 className="fw-bold text-truncate mb-1">
//                             <Link
//                               to={`/medicine/${med._id}`}
//                               className="text-dark text-decoration-none hover-primary"
//                             >
//                               {med.name}
//                             </Link>
//                           </h6>
//                           <small className="text-muted d-block text-truncate">
//                             {med.manufacturer || "Generic"}
//                           </small>
//                         </div>
//                         <div className="mt-auto bg-light rounded-3 p-2 border border-light-subtle">
//                           <div className="d-flex justify-content-between align-items-center mb-2">
//                             <label className="small text-muted fw-medium mb-0">
//                               Pack:
//                             </label>
//                             <select
//                               className="form-select form-select-sm border-0 bg-white shadow-sm py-0 ps-2 pe-4"
//                               style={{
//                                 width: "auto",
//                                 fontSize: "0.8rem",
//                                 height: "24px",
//                               }}
//                               value={selection.unitName}
//                               onChange={(e) =>
//                                 handleUnitChange(med, e.target.value)
//                               }
//                             >
//                               <option value={med.baseUnit || "Unit"}>
//                                 {med.baseUnit || "Unit"} (1x)
//                               </option>
//                               {med.units &&
//                                 med.units.map((u, idx) => (
//                                   <option key={idx} value={u.name}>
//                                     {u.name} (x{u.multiplier})
//                                   </option>
//                                 ))}
//                             </select>
//                           </div>
//                           <div className="d-flex justify-content-between align-items-end mb-3 pt-2 border-top">
//                             <div>
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Price
//                               </small>
//                               <span className="fw-bold">
//                                 ₹{selection.price}
//                               </span>
//                             </div>
//                             <div className="text-end">
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Total
//                               </small>
//                               <span className="fw-bold text-primary">
//                                 ₹{totalPrice}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="d-flex gap-2">
//                             <div className="d-flex align-items-center bg-white rounded border flex-grow-1 justify-content-between px-1">
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0"
//                                 disabled={isOutOfStock || qty <= 1}
//                                 onClick={() => handleDecrement(med._id)}
//                               >
//                                 <Minus size={16} />
//                               </Button>
//                               <span className="fw-bold small">{qty}</span>
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0"
//                                 disabled={
//                                   isOutOfStock ||
//                                   (qty + 1) * selection.multiplier >
//                                     med.countInStock
//                                 }
//                                 onClick={() => handleIncrement(med)}
//                               >
//                                 <Plus size={16} />
//                               </Button>
//                             </div>
//                             <Button
//                               variant="primary"
//                               size="sm"
//                               className="rounded fw-bold d-flex align-items-center"
//                               disabled={isOutOfStock}
//                               onClick={() => handleAddToCart(med)}
//                             >
//                               <ShoppingCart size={16} />
//                             </Button>
//                           </div>
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 );
//               })}
//             </Row>
//           )}
//         </Col>
//       </Row>
//       <style>{`.hover-primary:hover { color: var(--bs-primary) !important; } .card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; transition: all 0.2s ease; } .transition-transform { transition: transform 0.3s ease; } .card:hover .transition-transform { transform: scale(1.05); }`}</style>
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
//   Plus,
//   Minus,
//   AlertCircle,
//   CheckCircle,
//   Package,
//   ShieldAlert,
//   Heart,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import api from "../services/api";

// const MedicineShop = () => {
//   // --- Data State ---
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // --- Filter State ---
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // --- Local State ---
//   const [quantities, setQuantities] = useState({});
//   const [selectedUnits, setSelectedUnits] = useState({});
//   const [savedIds, setSavedIds] = useState(new Set());
//   const [saveLoading, setSaveLoading] = useState(null);

//   // --- 1. Debounce Search ---
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // --- 2. Fetch Data (Combined & Robust) ---
//   useEffect(() => {
//     let isMounted = true;

//     const loadData = async () => {
//       if (isMounted) {
//         setLoading(true);
//         setError("");
//       }

//       try {
//         // 1. Fetch Medicines
//         const params = new URLSearchParams();
//         if (debouncedSearch) params.append("keyword", debouncedSearch);
//         if (selectedCategory !== "All")
//           params.append("category", selectedCategory);

//         const res = await api.get(`/medicines?${params.toString()}`);

//         if (isMounted) {
//           const medList = Array.isArray(res.data)
//             ? res.data
//             : res.data.medicines || [];
//           setMedicines(medList);

//           // Initialize units
//           const defaultUnits = {};
//           medList.forEach((m) => {
//             defaultUnits[m._id] = {
//               unitName: m.baseUnit || "Unit",
//               price: m.price,
//               multiplier: 1,
//             };
//           });
//           setSelectedUnits((prev) => ({ ...prev, ...defaultUnits }));
//         }

//         // 2. Fetch Saved Status (Independent try/catch so it doesn't block medicines)
//         if (isMounted) {
//           await fetchSavedStatus();
//         }
//       } catch (err) {
//         if (isMounted) setError(err.message || "Failed to load medicines");
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     loadData();

//     return () => {
//       isMounted = false;
//     };
//   }, [debouncedSearch, selectedCategory]);

//   // ✅ ROBUST FETCH SAVED STATUS (Fixed Logic)
//   const fetchSavedStatus = async () => {
//     try {
//       const { data } = await api.get("/customer/saved-medicines");

//       // Safety Check: Ensure data is an array
//       if (!Array.isArray(data)) {
//         console.warn("Saved items format invalid", data);
//         setSavedIds(new Set());
//         return;
//       }

//       const ids = new Set(
//         data
//           .map((item) => {
//             // ⚠️ LOGIC FIX: Prioritize the nested medicine ID.
//             // item.medicine can be an object (populated) or string (unpopulated ID)
//             if (item.medicine && typeof item.medicine === "object") {
//               return item.medicine._id;
//             }
//             return item.medicine; // Fallback if not populated
//           })
//           .filter((id) => id) // Remove nulls/undefined
//       );
//       setSavedIds(ids);
//     } catch (err) {
//       // Gracefully handle 500 errors by logging them but not breaking UI
//       console.error(
//         "Wishlist sync failed (Backend might be down):",
//         err.message
//       );
//       setSavedIds(new Set()); // Default to empty wishlist on error
//     }
//   };

//   // --- Helper Functions ---
//   const getQty = (id) => quantities[id] || 1;

//   const handleIncrement = (med) => {
//     const currentQty = getQty(med._id);
//     const selection = selectedUnits[med._id] || { multiplier: 1 };
//     if ((currentQty + 1) * selection.multiplier <= med.countInStock) {
//       setQuantities({ ...quantities, [med._id]: currentQty + 1 });
//     }
//   };

//   const handleDecrement = (id) => {
//     const currentQty = getQty(id);
//     if (currentQty > 1) setQuantities({ ...quantities, [id]: currentQty - 1 });
//   };

//   const handleUnitChange = (med, unitName) => {
//     let newSelection = {};
//     if (unitName === (med.baseUnit || "Unit")) {
//       newSelection = {
//         unitName: med.baseUnit || "Unit",
//         price: med.price,
//         multiplier: 1,
//       };
//     } else {
//       const unit = med.units.find((u) => u.name === unitName);
//       if (unit)
//         newSelection = {
//           unitName: unit.name,
//           price: unit.price,
//           multiplier: unit.multiplier,
//         };
//     }
//     setSelectedUnits((prev) => ({ ...prev, [med._id]: newSelection }));
//     setQuantities((prev) => ({ ...prev, [med._id]: 1 }));
//   };

//   // ✅ UPDATED: Add to Cart via API (Persistent)
//   const handleAddToCart = async (med) => {
//     const qty = getQty(med._id);
//     const selection = selectedUnits[med._id] || {
//       unitName: "Unit",
//       price: med.price,
//       multiplier: 1,
//     };

//     if (qty * selection.multiplier > med.countInStock) {
//       alert("Not enough stock available!");
//       return;
//     }

//     try {
//       await api.post("/cart", {
//         medicineId: med._id,
//         qty: qty,
//         unit: selection.unitName, // Optional: if backend supports units
//       });
//       alert(`${qty} x ${med.name} added to your cart!`);
//     } catch (err) {
//       console.error("Add to cart error:", err);
//       alert("Failed to add to cart. Please try again.");
//     }
//   };

//   const handleToggleSave = async (medicineId) => {
//     try {
//       setSaveLoading(medicineId);
//       if (savedIds.has(medicineId)) {
//         await api.delete(`/customer/saved-medicines/${medicineId}`);
//         setSavedIds((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(medicineId);
//           return newSet;
//         });
//       } else {
//         await api.post("/customer/saved-medicines", { medicineId });
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       }
//     } catch (err) {
//       // Optimistic update for "Already Saved" (400)
//       if (err.response && err.response.status === 400) {
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       } else {
//         console.error("Save Error:", err);
//         alert("Could not save item. Please try again.");
//       }
//     } finally {
//       setSaveLoading(null);
//     }
//   };

//   const getImageUrl = (path) => {
//     if (!path) return "https://via.placeholder.com/150";
//     return path.startsWith("http") ? path : `http://localhost:5000${path}`;
//   };

//   const categories = [
//     "All",
//     "Tablet",
//     "Syrup",
//     "Injection",
//     "Capsule",
//     "Ointment",
//     "General",
//   ];

//   // --- Render ---
//   if (loading)
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ minHeight: "60vh" }}
//       >
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );
//   if (error)
//     return (
//       <Container className="py-5 text-center">
//         <div className="text-danger mb-3">
//           <AlertCircle size={64} />
//         </div>
//         <h4>Oops!</h4>
//         <p>{error}</p>
//         <Button onClick={() => window.location.reload()}>Try Again</Button>
//       </Container>
//     );

//   return (
//     <Container className="py-5">
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
//               <Search size={18} />
//             </InputGroup.Text>
//             <Form.Control
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <Button
//                 variant="outline-secondary"
//                 onClick={() => setSearchTerm("")}
//               >
//                 Clear
//               </Button>
//             )}
//           </InputGroup>
//         </Col>
//       </Row>
//       <Row>
//         <Col lg={3} className="mb-4">
//           <Card
//             className="border-0 shadow-sm rounded-4 sticky-top"
//             style={{ top: "100px", zIndex: 1 }}
//           >
//             <Card.Header className="bg-white border-bottom-0 pt-4">
//               <h5 className="fw-bold mb-0">
//                 <Filter size={20} className="me-2 text-primary" /> Filter By
//               </h5>
//             </Card.Header>
//             <Card.Body>
//               <div className="d-flex flex-column gap-2">
//                 {categories.map((cat) => (
//                   <Button
//                     key={cat}
//                     variant={selectedCategory === cat ? "primary" : "light"}
//                     className={`text-start d-flex justify-content-between px-3 ${
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
//         <Col lg={9}>
//           {medicines.length === 0 ? (
//             <div className="text-center py-5">
//               <Package size={48} className="text-muted opacity-50" />
//               <h5>No medicines found</h5>
//             </div>
//           ) : (
//             <Row xs={1} md={2} xl={3} className="g-4">
//               {medicines.map((med) => {
//                 const qty = getQty(med._id);
//                 const selection = selectedUnits[med._id] || {
//                   unitName: "Unit",
//                   price: med.price,
//                   multiplier: 1,
//                 };
//                 const totalPrice = (selection.price * qty).toFixed(2);
//                 const isOutOfStock = med.countInStock < selection.multiplier;
//                 return (
//                   <Col key={med._id}>
//                     <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative card-hover">
//                       <div
//                         className="position-relative text-center bg-light p-4"
//                         style={{ minHeight: "200px" }}
//                       >
//                         <Link to={`/medicine/${med._id}`}>
//                           <img
//                             src={getImageUrl(med.image)}
//                             alt={med.name}
//                             className="img-fluid transition-transform"
//                             style={{
//                               height: "140px",
//                               objectFit: "contain",
//                               mixBlendMode: "multiply",
//                             }}
//                           />
//                         </Link>
//                         <button
//                           className="position-absolute top-0 end-0 m-2 btn btn-white bg-white rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center border-0"
//                           style={{ width: "35px", height: "35px", zIndex: 5 }}
//                           onClick={() => handleToggleSave(med._id)}
//                           disabled={saveLoading === med._id}
//                         >
//                           {saveLoading === med._id ? (
//                             <Spinner size="sm" />
//                           ) : (
//                             <Heart
//                               size={18}
//                               className={
//                                 savedIds.has(med._id)
//                                   ? "text-danger"
//                                   : "text-muted"
//                               }
//                               fill={savedIds.has(med._id) ? "#dc3545" : "none"}
//                             />
//                           )}
//                         </button>
//                         {med.prescriptionRequired && (
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>Prescription Required</Tooltip>}
//                           >
//                             <Badge
//                               bg="warning"
//                               text="dark"
//                               className="position-absolute top-0 start-0 m-3 shadow-sm"
//                             >
//                               <ShieldAlert size={14} /> Rx
//                             </Badge>
//                           </OverlayTrigger>
//                         )}
//                         {isOutOfStock && (
//                           <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center z-2">
//                             <Badge
//                               bg="danger"
//                               className="px-3 py-2 fs-6 shadow"
//                             >
//                               Out of Stock
//                             </Badge>
//                           </div>
//                         )}
//                       </div>
//                       <Card.Body className="d-flex flex-column p-3">
//                         <div className="mb-2">
//                           <Badge
//                             bg="info"
//                             className="text-dark bg-opacity-10 border border-info border-opacity-25 mb-2 px-2 py-1"
//                           >
//                             {med.category || "General"}
//                           </Badge>
//                           <h6 className="fw-bold text-truncate mb-1">
//                             <Link
//                               to={`/medicine/${med._id}`}
//                               className="text-dark text-decoration-none hover-primary"
//                             >
//                               {med.name}
//                             </Link>
//                           </h6>
//                           <small className="text-muted d-block text-truncate">
//                             {med.manufacturer || "Generic"}
//                           </small>
//                         </div>
//                         <div className="mt-auto bg-light rounded-3 p-2 border border-light-subtle">
//                           <div className="d-flex justify-content-between align-items-center mb-2">
//                             <label className="small text-muted fw-medium mb-0">
//                               Pack:
//                             </label>
//                             <select
//                               className="form-select form-select-sm border-0 bg-white shadow-sm py-0 ps-2 pe-4"
//                               style={{
//                                 width: "auto",
//                                 fontSize: "0.8rem",
//                                 height: "24px",
//                               }}
//                               value={selection.unitName}
//                               onChange={(e) =>
//                                 handleUnitChange(med, e.target.value)
//                               }
//                             >
//                               <option value={med.baseUnit || "Unit"}>
//                                 {med.baseUnit || "Unit"} (1x)
//                               </option>
//                               {med.units &&
//                                 med.units.map((u, idx) => (
//                                   <option key={idx} value={u.name}>
//                                     {u.name} (x{u.multiplier})
//                                   </option>
//                                 ))}
//                             </select>
//                           </div>
//                           <div className="d-flex justify-content-between align-items-end mb-3 pt-2 border-top">
//                             <div>
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Price
//                               </small>
//                               <span className="fw-bold">
//                                 ₹{selection.price}
//                               </span>
//                             </div>
//                             <div className="text-end">
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Total
//                               </small>
//                               <span className="fw-bold text-primary">
//                                 ₹{totalPrice}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="d-flex gap-2">
//                             <div className="d-flex align-items-center bg-white rounded border flex-grow-1 justify-content-between px-1">
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0"
//                                 disabled={isOutOfStock || qty <= 1}
//                                 onClick={() => handleDecrement(med._id)}
//                               >
//                                 <Minus size={16} />
//                               </Button>
//                               <span className="fw-bold small">{qty}</span>
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0"
//                                 disabled={
//                                   isOutOfStock ||
//                                   (qty + 1) * selection.multiplier >
//                                     med.countInStock
//                                 }
//                                 onClick={() => handleIncrement(med)}
//                               >
//                                 <Plus size={16} />
//                               </Button>
//                             </div>
//                             <Button
//                               variant="primary"
//                               size="sm"
//                               className="rounded fw-bold d-flex align-items-center"
//                               disabled={isOutOfStock}
//                               onClick={() => handleAddToCart(med)}
//                             >
//                               <ShoppingCart size={16} />
//                             </Button>
//                           </div>
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 );
//               })}
//             </Row>
//           )}
//         </Col>
//       </Row>
//       <style>{`.hover-primary:hover { color: var(--bs-primary) !important; } .card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; transition: all 0.2s ease; } .transition-transform { transition: transform 0.3s ease; } .card:hover .transition-transform { transform: scale(1.05); }`}</style>
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
//   Plus,
//   Minus,
//   AlertCircle,
//   CheckCircle,
//   Package,
//   ShieldAlert,
//   Heart,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import api from "../services/api";

// const MedicineShop = () => {
//   // --- Data State ---
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // --- Filter State ---
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // --- Local State ---
//   const [quantities, setQuantities] = useState({});
//   const [selectedUnits, setSelectedUnits] = useState({});
//   const [savedIds, setSavedIds] = useState(new Set());
//   const [saveLoading, setSaveLoading] = useState(null);

//   // --- 1. Debounce Search ---
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // --- 2. Fetch Data (Combined & Robust) ---
//   useEffect(() => {
//     let isMounted = true;

//     const loadData = async () => {
//       if (isMounted) {
//         setLoading(true);
//         setError("");
//       }

//       try {
//         // 1. Fetch Medicines
//         const params = new URLSearchParams();
//         if (debouncedSearch) params.append("keyword", debouncedSearch);
//         if (selectedCategory !== "All")
//           params.append("category", selectedCategory);

//         const res = await api.get(`/medicines?${params.toString()}`);

//         if (isMounted) {
//           const medList = Array.isArray(res.data)
//             ? res.data
//             : res.data.medicines || [];
//           setMedicines(medList);

//           // Initialize units
//           const defaultUnits = {};
//           medList.forEach((m) => {
//             defaultUnits[m._id] = {
//               unitName: m.baseUnit || "Unit",
//               price: m.price,
//               multiplier: 1,
//             };
//           });
//           setSelectedUnits((prev) => ({ ...prev, ...defaultUnits }));
//         }

//         // 2. Fetch Saved Status (Independent try/catch so it doesn't block medicines)
//         if (isMounted) {
//           await fetchSavedStatus();
//         }
//       } catch (err) {
//         if (isMounted) setError(err.message || "Failed to load medicines");
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     loadData();

//     return () => {
//       isMounted = false;
//     };
//   }, [debouncedSearch, selectedCategory]);

//   // ✅ ROBUST FETCH SAVED STATUS
//   const fetchSavedStatus = async () => {
//     try {
//       const { data } = await api.get("/customer/saved-medicines");

//       if (!Array.isArray(data)) {
//         setSavedIds(new Set());
//         return;
//       }

//       const ids = new Set(
//         data
//           .map((item) => {
//             if (item.medicine && typeof item.medicine === "object") {
//               return item.medicine._id;
//             }
//             return item.medicine;
//           })
//           .filter((id) => id)
//       );
//       setSavedIds(ids);
//     } catch (err) {
//       console.error("Wishlist sync failed:", err.message);
//       setSavedIds(new Set());
//     }
//   };

//   // --- Helper Functions ---
//   const getQty = (id) => quantities[id] || 1;

//   const handleIncrement = (med) => {
//     const currentQty = getQty(med._id);
//     const selection = selectedUnits[med._id] || { multiplier: 1 };
//     if ((currentQty + 1) * selection.multiplier <= med.countInStock) {
//       setQuantities({ ...quantities, [med._id]: currentQty + 1 });
//     }
//   };

//   const handleDecrement = (id) => {
//     const currentQty = getQty(id);
//     if (currentQty > 1) setQuantities({ ...quantities, [id]: currentQty - 1 });
//   };

//   const handleUnitChange = (med, unitName) => {
//     let newSelection = {};
//     if (unitName === (med.baseUnit || "Unit")) {
//       newSelection = {
//         unitName: med.baseUnit || "Unit",
//         price: med.price,
//         multiplier: 1,
//       };
//     } else {
//       const unit = med.units.find((u) => u.name === unitName);
//       if (unit)
//         newSelection = {
//           unitName: unit.name,
//           price: unit.price,
//           multiplier: unit.multiplier,
//         };
//     }
//     setSelectedUnits((prev) => ({ ...prev, [med._id]: newSelection }));
//     setQuantities((prev) => ({ ...prev, [med._id]: 1 }));
//   };

//   // ✅ UPDATED: Add to Cart via API (Persistent)
//   const handleAddToCart = async (med) => {
//     const qty = getQty(med._id);
//     const selection = selectedUnits[med._id] || {
//       unitName: "Unit",
//       price: med.price,
//       multiplier: 1,
//     };

//     if (qty * selection.multiplier > med.countInStock) {
//       alert("Not enough stock available!");
//       return;
//     }

//     try {
//       await api.post("/cart", {
//         medicineId: med._id,
//         qty: qty,
//         unit: selection.unitName,
//       });
//       alert(`${qty} x ${med.name} added to your cart!`);
//     } catch (err) {
//       console.error("Add to cart error:", err);
//       alert("Failed to add to cart. Please try again.");
//     }
//   };

//   const handleToggleSave = async (medicineId) => {
//     try {
//       setSaveLoading(medicineId);
//       if (savedIds.has(medicineId)) {
//         await api.delete(`/customer/saved-medicines/${medicineId}`);
//         setSavedIds((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(medicineId);
//           return newSet;
//         });
//       } else {
//         await api.post("/customer/saved-medicines", { medicineId });
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       }
//     } catch (err) {
//       if (err.response && err.response.status === 400) {
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       } else {
//         console.error("Save Error:", err);
//         alert("Could not save item. Please try again.");
//       }
//     } finally {
//       setSaveLoading(null);
//     }
//   };

//   const getImageUrl = (path) => {
//     if (!path) return "https://via.placeholder.com/150";
//     return path.startsWith("http") ? path : `http://localhost:5000${path}`;
//   };

//   const categories = [
//     "All",
//     "Tablet",
//     "Syrup",
//     "Injection",
//     "Capsule",
//     "Ointment",
//     "General",
//   ];

//   // --- Render ---
//   if (loading)
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ minHeight: "60vh" }}
//       >
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );
//   if (error)
//     return (
//       <Container className="py-5 text-center">
//         <div className="text-danger mb-3">
//           <AlertCircle size={64} />
//         </div>
//         <h4>Oops!</h4>
//         <p>{error}</p>
//         <Button onClick={() => window.location.reload()}>Try Again</Button>
//       </Container>
//     );

//   return (
//     <Container className="py-5">
//       <Row className="mb-4 align-items-center g-3">
//         <Col md={6}>
//           <h2 className="fw-bold mb-0 text-primary">Medicine Store</h2>
//           <p className="text-muted mb-0">
//             Browse generic and branded medicines.
//           </p>
//         </Col>
//         <Col md={6}>
//           <InputGroup className="shadow-sm rounded-pill overflow-hidden">
//             <InputGroup.Text className="bg-white border-end-0 ps-3">
//               <Search size={18} className="text-muted" />
//             </InputGroup.Text>
//             <Form.Control
//               className="border-start-0 ps-2"
//               placeholder="Search medicines..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <Button
//                 variant="white"
//                 className="border-top border-bottom border-end pe-3"
//                 onClick={() => setSearchTerm("")}
//               >
//                 Clear
//               </Button>
//             )}
//           </InputGroup>
//         </Col>
//       </Row>
//       <Row>
//         <Col lg={3} className="mb-4">
//           <Card
//             className="border-0 shadow-sm rounded-4 sticky-top"
//             style={{ top: "100px", zIndex: 1 }}
//           >
//             <Card.Header className="bg-white border-bottom-0 pt-4 pb-2">
//               <h5 className="fw-bold mb-0">
//                 <Filter size={20} className="me-2 text-primary" /> Filter By
//               </h5>
//             </Card.Header>
//             <Card.Body>
//               <div className="d-flex flex-column gap-2">
//                 {categories.map((cat) => (
//                   <Button
//                     key={cat}
//                     variant={selectedCategory === cat ? "primary" : "light"}
//                     className={`text-start d-flex justify-content-between px-3 ${
//                       selectedCategory === cat
//                         ? "shadow-sm fw-bold"
//                         : "bg-transparent border-0 text-dark hover-bg-light"
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
//         <Col lg={9}>
//           {medicines.length === 0 ? (
//             <div className="text-center py-5">
//               <Package size={48} className="text-muted opacity-50" />
//               <h5 className="mt-3 text-muted">No medicines found</h5>
//             </div>
//           ) : (
//             <Row xs={1} md={2} xl={3} className="g-4">
//               {medicines.map((med) => {
//                 const qty = getQty(med._id);
//                 const selection = selectedUnits[med._id] || {
//                   unitName: "Unit",
//                   price: med.price,
//                   multiplier: 1,
//                 };
//                 const totalPrice = (selection.price * qty).toFixed(2);
//                 const isOutOfStock = med.countInStock < selection.multiplier;
//                 return (
//                   <Col key={med._id}>
//                     <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative card-hover">
//                       <div
//                         className="position-relative text-center bg-white p-4"
//                         style={{ minHeight: "200px" }}
//                       >
//                         <Link to={`/medicine/${med._id}`}>
//                           <img
//                             src={getImageUrl(med.image)}
//                             alt={med.name}
//                             className="img-fluid transition-transform"
//                             style={{
//                               height: "140px",
//                               objectFit: "contain",
//                               mixBlendMode: "multiply",
//                             }}
//                           />
//                         </Link>
//                         <button
//                           className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center border-0"
//                           style={{ width: "32px", height: "32px", zIndex: 5 }}
//                           onClick={() => handleToggleSave(med._id)}
//                           disabled={saveLoading === med._id}
//                         >
//                           {saveLoading === med._id ? (
//                             <Spinner size="sm" />
//                           ) : (
//                             <Heart
//                               size={16}
//                               className={
//                                 savedIds.has(med._id)
//                                   ? "text-danger"
//                                   : "text-muted"
//                               }
//                               fill={savedIds.has(med._id) ? "#dc3545" : "none"}
//                             />
//                           )}
//                         </button>
//                         {med.prescriptionRequired && (
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>Prescription Required</Tooltip>}
//                           >
//                             <Badge
//                               bg="warning"
//                               text="dark"
//                               className="position-absolute top-0 start-0 m-3 shadow-sm"
//                             >
//                               <ShieldAlert size={14} /> Rx
//                             </Badge>
//                           </OverlayTrigger>
//                         )}
//                         {isOutOfStock && (
//                           <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center z-2">
//                             <Badge
//                               bg="danger"
//                               className="px-3 py-2 fs-6 shadow"
//                             >
//                               Out of Stock
//                             </Badge>
//                           </div>
//                         )}
//                       </div>
//                       <Card.Body className="d-flex flex-column p-3 bg-light bg-opacity-25">
//                         <div className="mb-2">
//                           <Badge
//                             bg="info"
//                             className="text-dark bg-opacity-10 border border-info border-opacity-25 mb-2 px-2 py-1 font-monospace"
//                           >
//                             {med.category || "General"}
//                           </Badge>
//                           <h6 className="fw-bold text-truncate mb-1">
//                             <Link
//                               to={`/medicine/${med._id}`}
//                               className="text-dark text-decoration-none hover-primary"
//                             >
//                               {med.name}
//                             </Link>
//                           </h6>
//                           <small className="text-muted d-block text-truncate">
//                             {med.manufacturer || "Generic"}
//                           </small>
//                         </div>
//                         <div className="mt-auto bg-white rounded-3 p-2 border shadow-sm">
//                           <div className="d-flex justify-content-between align-items-center mb-2">
//                             <label className="small text-muted fw-medium mb-0">
//                               Pack:
//                             </label>
//                             <select
//                               className="form-select form-select-sm border-0 bg-transparent py-0 ps-2 pe-4 fw-bold text-primary"
//                               style={{
//                                 width: "auto",
//                                 fontSize: "0.8rem",
//                                 height: "24px",
//                                 cursor: "pointer",
//                               }}
//                               value={selection.unitName}
//                               onChange={(e) =>
//                                 handleUnitChange(med, e.target.value)
//                               }
//                             >
//                               <option value={med.baseUnit || "Unit"}>
//                                 {med.baseUnit || "Unit"} (1x)
//                               </option>
//                               {med.units &&
//                                 med.units.map((u, idx) => (
//                                   <option key={idx} value={u.name}>
//                                     {u.name} (x{u.multiplier})
//                                   </option>
//                                 ))}
//                             </select>
//                           </div>
//                           <div className="d-flex justify-content-between align-items-end mb-3 pt-2 border-top">
//                             <div>
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Price
//                               </small>
//                               <span className="fw-bold">
//                                 NPR {selection.price}
//                               </span>
//                             </div>
//                             <div className="text-end">
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Total
//                               </small>
//                               <span className="fw-bold text-primary">
//                                 NPR {totalPrice}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="d-flex gap-2">
//                             <div className="d-flex align-items-center bg-light rounded border flex-grow-1 justify-content-between px-1">
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0 hover-bg-gray"
//                                 disabled={isOutOfStock || qty <= 1}
//                                 onClick={() => handleDecrement(med._id)}
//                               >
//                                 <Minus size={16} />
//                               </Button>
//                               <span className="fw-bold small">{qty}</span>
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0 hover-bg-gray"
//                                 disabled={
//                                   isOutOfStock ||
//                                   (qty + 1) * selection.multiplier >
//                                     med.countInStock
//                                 }
//                                 onClick={() => handleIncrement(med)}
//                               >
//                                 <Plus size={16} />
//                               </Button>
//                             </div>
//                             <Button
//                               variant="primary"
//                               size="sm"
//                               className="rounded fw-bold d-flex align-items-center px-3"
//                               disabled={isOutOfStock}
//                               onClick={() => handleAddToCart(med)}
//                             >
//                               <ShoppingCart size={16} />
//                             </Button>
//                           </div>
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 );
//               })}
//             </Row>
//           )}
//         </Col>
//       </Row>
//       <style>{`.hover-primary:hover { color: var(--bs-primary) !important; } .card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; transition: all 0.3s ease; } .transition-transform { transition: transform 0.3s ease; } .card:hover .transition-transform { transform: scale(1.08); } .hover-bg-light:hover { background-color: #f8f9fa !important; } .hover-bg-gray:hover { background-color: #e9ecef; border-radius: 4px; }`}</style>
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
//   Plus,
//   Minus,
//   AlertCircle,
//   Package,
//   ShieldAlert,
//   Heart,
//   ChevronDown, // Added for dropdown icon styling if needed
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import api from "../services/api";

// const MedicineShop = () => {
//   // --- Data State ---
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // --- Filter State ---
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // --- Local State ---
//   const [quantities, setQuantities] = useState({});
//   const [selectedUnits, setSelectedUnits] = useState({});
//   const [savedIds, setSavedIds] = useState(new Set());
//   const [saveLoading, setSaveLoading] = useState(null);

//   // --- 1. Debounce Search ---
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // --- 2. Fetch Data (Combined & Robust) ---
//   useEffect(() => {
//     let isMounted = true;

//     const loadData = async () => {
//       if (isMounted) {
//         setLoading(true);
//         setError("");
//       }

//       try {
//         // 1. Fetch Medicines
//         const params = new URLSearchParams();
//         if (debouncedSearch) params.append("keyword", debouncedSearch);
//         if (selectedCategory !== "All")
//           params.append("category", selectedCategory);

//         const res = await api.get(`/medicines?${params.toString()}`);

//         if (isMounted) {
//           const medList = Array.isArray(res.data)
//             ? res.data
//             : res.data.medicines || [];
//           setMedicines(medList);

//           // Initialize units
//           const defaultUnits = {};
//           medList.forEach((m) => {
//             defaultUnits[m._id] = {
//               unitName: m.baseUnit || "Unit",
//               price: m.price,
//               multiplier: 1,
//             };
//           });
//           setSelectedUnits((prev) => ({ ...prev, ...defaultUnits }));
//         }

//         // 2. Fetch Saved Status (Independent try/catch so it doesn't block medicines)
//         if (isMounted) {
//           await fetchSavedStatus();
//         }
//       } catch (err) {
//         if (isMounted) setError(err.message || "Failed to load medicines");
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     loadData();

//     return () => {
//       isMounted = false;
//     };
//   }, [debouncedSearch, selectedCategory]);

//   // ✅ ROBUST FETCH SAVED STATUS
//   const fetchSavedStatus = async () => {
//     try {
//       const { data } = await api.get("/customer/saved-medicines");

//       if (!Array.isArray(data)) {
//         setSavedIds(new Set());
//         return;
//       }

//       const ids = new Set(
//         data
//           .map((item) => {
//             if (item.medicine && typeof item.medicine === "object") {
//               return item.medicine._id;
//             }
//             return item.medicine;
//           })
//           .filter((id) => id)
//       );
//       setSavedIds(ids);
//     } catch (err) {
//       console.error("Wishlist sync failed:", err.message);
//       setSavedIds(new Set());
//     }
//   };

//   // --- Helper Functions ---
//   const getQty = (id) => quantities[id] || 1;

//   const handleIncrement = (med) => {
//     const currentQty = getQty(med._id);
//     const selection = selectedUnits[med._id] || { multiplier: 1 };
//     if ((currentQty + 1) * selection.multiplier <= med.countInStock) {
//       setQuantities({ ...quantities, [med._id]: currentQty + 1 });
//     }
//   };

//   const handleDecrement = (id) => {
//     const currentQty = getQty(id);
//     if (currentQty > 1) setQuantities({ ...quantities, [id]: currentQty - 1 });
//   };

//   const handleUnitChange = (med, unitName) => {
//     let newSelection = {};
//     if (unitName === (med.baseUnit || "Unit")) {
//       newSelection = {
//         unitName: med.baseUnit || "Unit",
//         price: med.price,
//         multiplier: 1,
//       };
//     } else {
//       const unit = med.units.find((u) => u.name === unitName);
//       if (unit)
//         newSelection = {
//           unitName: unit.name,
//           price: unit.price,
//           multiplier: unit.multiplier,
//         };
//     }
//     setSelectedUnits((prev) => ({ ...prev, [med._id]: newSelection }));
//     setQuantities((prev) => ({ ...prev, [med._id]: 1 }));
//   };

//   // ✅ UPDATED: Add to Cart via API (Persistent)
//   const handleAddToCart = async (med) => {
//     const qty = getQty(med._id);
//     const selection = selectedUnits[med._id] || {
//       unitName: "Unit",
//       price: med.price,
//       multiplier: 1,
//     };

//     if (qty * selection.multiplier > med.countInStock) {
//       alert("Not enough stock available!");
//       return;
//     }

//     try {
//       await api.post("/cart", {
//         medicineId: med._id,
//         qty: qty,
//         unit: selection.unitName,
//       });
//       alert(`${qty} x ${med.name} added to your cart!`);
//     } catch (err) {
//       console.error("Add to cart error:", err);
//       alert("Failed to add to cart. Please try again.");
//     }
//   };

//   const handleToggleSave = async (medicineId) => {
//     try {
//       setSaveLoading(medicineId);
//       if (savedIds.has(medicineId)) {
//         await api.delete(`/customer/saved-medicines/${medicineId}`);
//         setSavedIds((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(medicineId);
//           return newSet;
//         });
//       } else {
//         await api.post("/customer/saved-medicines", { medicineId });
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       }
//     } catch (err) {
//       if (err.response && err.response.status === 400) {
//         setSavedIds((prev) => new Set(prev).add(medicineId));
//       } else {
//         console.error("Save Error:", err);
//         alert("Could not save item. Please try again.");
//       }
//     } finally {
//       setSaveLoading(null);
//     }
//   };

//   const getImageUrl = (path) => {
//     if (!path) return "https://via.placeholder.com/150";
//     return path.startsWith("http") ? path : `http://localhost:5000${path}`;
//   };

//   // ✅ Complete Category List
//   const categories = [
//     "All",
//     "Tablet",
//     "Capsule",
//     "Syrup",
//     "Injection",
//     "Ointment",
//     "Drops",
//     "Inhaler",
//     "Surgical",
//     "Device",
//     "Personal Care",
//     "General",
//   ];

//   // --- Render ---
//   if (loading)
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ minHeight: "60vh" }}
//       >
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );
//   if (error)
//     return (
//       <Container className="py-5 text-center">
//         <div className="text-danger mb-3">
//           <AlertCircle size={64} />
//         </div>
//         <h4>Oops!</h4>
//         <p>{error}</p>
//         <Button onClick={() => window.location.reload()}>Try Again</Button>
//       </Container>
//     );

//   return (
//     <Container className="py-5">
//       <Row className="mb-4 align-items-center g-3">
//         <Col md={6}>
//           <h2 className="fw-bold mb-0 text-primary">Medicine Store</h2>
//           <p className="text-muted mb-0">
//             Browse generic and branded medicines.
//           </p>
//         </Col>
//         <Col md={6}>
//           <InputGroup className="shadow-sm rounded-pill overflow-hidden">
//             <InputGroup.Text className="bg-white border-end-0 ps-3">
//               <Search size={18} className="text-muted" />
//             </InputGroup.Text>
//             <Form.Control
//               className="border-start-0 ps-2"
//               placeholder="Search medicines..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <Button
//                 variant="white"
//                 className="border-top border-bottom border-end pe-3"
//                 onClick={() => setSearchTerm("")}
//               >
//                 Clear
//               </Button>
//             )}
//           </InputGroup>
//         </Col>
//       </Row>
//       <Row>
//         {/* ✅ UPDATED: Sidebar with Proper Dropdown Effect */}
//         <Col lg={3} className="mb-4">
//           <Card
//             className="border-0 shadow-sm rounded-4 sticky-top"
//             style={{ top: "100px", zIndex: 1 }}
//           >
//             <Card.Header className="bg-white border-bottom-0 pt-4 pb-2">
//               <h5 className="fw-bold mb-0 d-flex align-items-center">
//                 <Filter size={20} className="me-2 text-primary" /> Filter By
//               </h5>
//             </Card.Header>
//             <Card.Body>
//               <Form.Group>
//                 <Form.Label className="small text-muted fw-bold text-uppercase mb-2">
//                   Select Category
//                 </Form.Label>
//                 <div className="position-relative">
//                   <Form.Select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="form-select-lg border-0 bg-light shadow-sm rounded-3 text-dark fw-bold py-3 ps-3 pe-5"
//                     style={{
//                       cursor: "pointer",
//                       appearance: "none", // Cleaner look across browsers
//                       backgroundImage: "none", // Remove default arrow
//                     }}
//                   >
//                     {categories.map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </Form.Select>
//                   {/* Custom Arrow Icon for Better UI */}
//                   <ChevronDown
//                     size={20}
//                     className="position-absolute top-50 end-0 translate-middle-y me-3 text-primary"
//                     style={{ pointerEvents: "none" }}
//                   />
//                 </div>
//               </Form.Group>

//               {/* Optional: Show active filters below for clarity */}
//               {selectedCategory !== "All" && (
//                 <div className="mt-3">
//                   <Badge bg="primary" className="p-2 px-3 rounded-pill d-flex align-items-center justify-content-between" style={{maxWidth: 'fit-content'}}>
//                     <span>{selectedCategory}</span>
//                     <span
//                       className="ms-2 cursor-pointer"
//                       style={{cursor: 'pointer'}}
//                       onClick={() => setSelectedCategory("All")}
//                     >
//                       &times;
//                     </span>
//                   </Badge>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* ✅ Medicines Grid */}
//         <Col lg={9}>
//           {medicines.length === 0 ? (
//             <div className="text-center py-5">
//               <Package size={48} className="text-muted opacity-50" />
//               <h5 className="mt-3 text-muted">No medicines found</h5>
//             </div>
//           ) : (
//             <Row xs={1} md={2} xl={3} className="g-4">
//               {medicines.map((med) => {
//                 const qty = getQty(med._id);
//                 const selection = selectedUnits[med._id] || {
//                   unitName: "Unit",
//                   price: med.price,
//                   multiplier: 1,
//                 };
//                 const totalPrice = (selection.price * qty).toFixed(2);
//                 const isOutOfStock = med.countInStock < selection.multiplier;
//                 return (
//                   <Col key={med._id}>
//                     <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative card-hover">
//                       <div
//                         className="position-relative text-center bg-white p-4"
//                         style={{ minHeight: "200px" }}
//                       >
//                         <Link to={`/medicine/${med._id}`}>
//                           <img
//                             src={getImageUrl(med.image)}
//                             alt={med.name}
//                             className="img-fluid transition-transform"
//                             style={{
//                               height: "140px",
//                               objectFit: "contain",
//                               mixBlendMode: "multiply",
//                             }}
//                           />
//                         </Link>
//                         <button
//                           className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center border-0"
//                           style={{ width: "32px", height: "32px", zIndex: 5 }}
//                           onClick={() => handleToggleSave(med._id)}
//                           disabled={saveLoading === med._id}
//                         >
//                           {saveLoading === med._id ? (
//                             <Spinner size="sm" />
//                           ) : (
//                             <Heart
//                               size={16}
//                               className={
//                                 savedIds.has(med._id)
//                                   ? "text-danger"
//                                   : "text-muted"
//                               }
//                               fill={savedIds.has(med._id) ? "#dc3545" : "none"}
//                             />
//                           )}
//                         </button>
//                         {med.prescriptionRequired && (
//                           <OverlayTrigger
//                             placement="top"
//                             overlay={<Tooltip>Prescription Required</Tooltip>}
//                           >
//                             <Badge
//                               bg="warning"
//                               text="dark"
//                               className="position-absolute top-0 start-0 m-3 shadow-sm"
//                             >
//                               <ShieldAlert size={14} /> Rx
//                             </Badge>
//                           </OverlayTrigger>
//                         )}
//                         {isOutOfStock && (
//                           <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center z-2">
//                             <Badge
//                               bg="danger"
//                               className="px-3 py-2 fs-6 shadow"
//                             >
//                               Out of Stock
//                             </Badge>
//                           </div>
//                         )}
//                       </div>
//                       <Card.Body className="d-flex flex-column p-3 bg-light bg-opacity-25">
//                         <div className="mb-2">
//                           <Badge
//                             bg="info"
//                             className="text-dark bg-opacity-10 border border-info border-opacity-25 mb-2 px-2 py-1 font-monospace"
//                           >
//                             {med.category || "General"}
//                           </Badge>
//                           <h6 className="fw-bold text-truncate mb-1">
//                             <Link
//                               to={`/medicine/${med._id}`}
//                               className="text-dark text-decoration-none hover-primary"
//                             >
//                               {med.name}
//                             </Link>
//                           </h6>
//                           <small className="text-muted d-block text-truncate">
//                             {med.manufacturer || "Generic"}
//                           </small>
//                         </div>
//                         <div className="mt-auto bg-white rounded-3 p-2 border shadow-sm">
//                           <div className="d-flex justify-content-between align-items-center mb-2">
//                             <label className="small text-muted fw-medium mb-0">
//                               Pack:
//                             </label>
//                             <select
//                               className="form-select form-select-sm border-0 bg-transparent py-0 ps-2 pe-4 fw-bold text-primary"
//                               style={{
//                                 width: "auto",
//                                 fontSize: "0.8rem",
//                                 height: "24px",
//                                 cursor: "pointer",
//                               }}
//                               value={selection.unitName}
//                               onChange={(e) =>
//                                 handleUnitChange(med, e.target.value)
//                               }
//                             >
//                               <option value={med.baseUnit || "Unit"}>
//                                 {med.baseUnit || "Unit"} (1x)
//                               </option>
//                               {med.units &&
//                                 med.units.map((u, idx) => (
//                                   <option key={idx} value={u.name}>
//                                     {u.name} (x{u.multiplier})
//                                   </option>
//                                 ))}
//                             </select>
//                           </div>
//                           <div className="d-flex justify-content-between align-items-end mb-3 pt-2 border-top">
//                             <div>
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Price
//                               </small>
//                               <span className="fw-bold">
//                                 NPR {selection.price}
//                               </span>
//                             </div>
//                             <div className="text-end">
//                               <small
//                                 className="text-muted d-block"
//                                 style={{ fontSize: "0.7rem" }}
//                               >
//                                 Total
//                               </small>
//                               <span className="fw-bold text-primary">
//                                 NPR {totalPrice}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="d-flex gap-2">
//                             <div className="d-flex align-items-center bg-light rounded border flex-grow-1 justify-content-between px-1">
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0 hover-bg-gray"
//                                 disabled={isOutOfStock || qty <= 1}
//                                 onClick={() => handleDecrement(med._id)}
//                               >
//                                 <Minus size={16} />
//                               </Button>
//                               <span className="fw-bold small">{qty}</span>
//                               <Button
//                                 variant="link"
//                                 className="text-dark p-0 hover-bg-gray"
//                                 disabled={
//                                   isOutOfStock ||
//                                   (qty + 1) * selection.multiplier >
//                                     med.countInStock
//                                 }
//                                 onClick={() => handleIncrement(med)}
//                               >
//                                 <Plus size={16} />
//                               </Button>
//                             </div>
//                             <Button
//                               variant="primary"
//                               size="sm"
//                               className="rounded fw-bold d-flex align-items-center px-3"
//                               disabled={isOutOfStock}
//                               onClick={() => handleAddToCart(med)}
//                             >
//                               <ShoppingCart size={16} />
//                             </Button>
//                           </div>
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 );
//               })}
//             </Row>
//           )}
//         </Col>
//       </Row>
//       <style>{`.hover-primary:hover { color: var(--bs-primary) !important; } .card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; transition: all 0.3s ease; } .transition-transform { transition: transform 0.3s ease; } .card:hover .transition-transform { transform: scale(1.08); } .hover-bg-light:hover { background-color: #f8f9fa !important; } .hover-bg-gray:hover { background-color: #e9ecef; border-radius: 4px; }`}</style>
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
  Package,
  ShieldAlert,
  Heart,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

const MedicineShop = () => {
  // --- Data State ---
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Filter State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- Local State ---
  const [quantities, setQuantities] = useState({});
  const [selectedUnits, setSelectedUnits] = useState({});
  const [savedIds, setSavedIds] = useState(new Set());
  const [saveLoading, setSaveLoading] = useState(null);

  // --- 1. Debounce Search ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- 2. Fetch Data (Combined & Robust) ---
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        setLoading(true);
        setError("");
      }

      try {
        // 1. Fetch Medicines
        const params = new URLSearchParams();
        if (debouncedSearch) params.append("keyword", debouncedSearch);
        if (selectedCategory !== "All")
          params.append("category", selectedCategory);

        const res = await api.get(`/medicines?${params.toString()}`);

        if (isMounted) {
          const medList = Array.isArray(res.data)
            ? res.data
            : res.data.medicines || [];
          setMedicines(medList);

          // Initialize units
          const defaultUnits = {};
          medList.forEach((m) => {
            defaultUnits[m._id] = {
              unitName: m.baseUnit || "Unit",
              price: m.price,
              multiplier: 1,
            };
          });
          setSelectedUnits((prev) => ({ ...prev, ...defaultUnits }));
        }

        // 2. Fetch Saved Status (Independent try/catch so it doesn't block medicines)
        if (isMounted) {
          await fetchSavedStatus();
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load medicines");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, selectedCategory]);

  // ✅ ROBUST FETCH SAVED STATUS
  const fetchSavedStatus = async () => {
    try {
      const { data } = await api.get("/customer/saved-medicines");

      if (!Array.isArray(data)) {
        setSavedIds(new Set());
        return;
      }

      const ids = new Set(
        data
          .map((item) => {
            // Handle population vs direct ID
            if (item.medicine && typeof item.medicine === "object") {
              return item.medicine._id;
            }
            // Fallback for cases where population might differ
            return item.medicine || item._id;
          })
          .filter((id) => id),
      );
      setSavedIds(ids);
    } catch (err) {
      console.error("Wishlist sync failed:", err.message);
      setSavedIds(new Set());
    }
  };

  // --- Helper Functions ---
  const getQty = (id) => quantities[id] || 1;

  const handleIncrement = (med) => {
    const currentQty = getQty(med._id);
    const selection = selectedUnits[med._id] || { multiplier: 1 };
    if ((currentQty + 1) * selection.multiplier <= med.countInStock) {
      setQuantities({ ...quantities, [med._id]: currentQty + 1 });
    }
  };

  const handleDecrement = (id) => {
    const currentQty = getQty(id);
    if (currentQty > 1) setQuantities({ ...quantities, [id]: currentQty - 1 });
  };

  const handleUnitChange = (med, unitName) => {
    let newSelection = {};
    if (unitName === (med.baseUnit || "Unit")) {
      newSelection = {
        unitName: med.baseUnit || "Unit",
        price: med.price,
        multiplier: 1,
      };
    } else {
      const unit = med.units.find((u) => u.name === unitName);
      if (unit)
        newSelection = {
          unitName: unit.name,
          price: unit.price,
          multiplier: unit.multiplier,
        };
    }
    setSelectedUnits((prev) => ({ ...prev, [med._id]: newSelection }));
    setQuantities((prev) => ({ ...prev, [med._id]: 1 }));
  };

  const handleAddToCart = async (med) => {
    const qty = getQty(med._id);
    const selection = selectedUnits[med._id] || {
      unitName: "Unit",
      price: med.price,
      multiplier: 1,
    };

    if (qty * selection.multiplier > med.countInStock) {
      alert("Not enough stock available!");
      return;
    }

    try {
      await api.post("/cart", {
        medicineId: med._id,
        qty: qty,
        unit: selection.unitName,
      });
      alert(`${qty} x ${med.name} added to your cart!`);
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add to cart. Please try again.");
    }
  };

  // ✅ UPDATED: Use the new TOGGLE route from backend
  const handleToggleSave = async (medicineId) => {
    try {
      setSaveLoading(medicineId);

      // We use POST for both add and remove (handled by backend toggle logic)
      const { data } = await api.post("/customer/saved-medicines", {
        medicineId,
      });

      // Update UI based on backend response
      setSavedIds((prev) => {
        const newSet = new Set(prev);
        if (data.isSaved) {
          newSet.add(medicineId);
        } else {
          newSet.delete(medicineId);
        }
        return newSet;
      });
    } catch (err) {
      console.error("Save Error:", err);
      alert("Could not update wishlist. Please ensure you are logged in.");
    } finally {
      setSaveLoading(null);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    return path.startsWith("http") ? path : `http://localhost:5000${path}`;
  };

  const categories = [
    "All",
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

  // --- Render ---
  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  if (error)
    return (
      <Container className="py-5 text-center">
        <div className="text-danger mb-3">
          <AlertCircle size={64} />
        </div>
        <h4>Oops!</h4>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </Container>
    );

  return (
    <Container className="py-5">
      <Row className="mb-4 align-items-center g-3">
        <Col md={6}>
          <h2 className="fw-bold mb-0 text-primary">Medicine Store</h2>
          <p className="text-muted mb-0">
            Browse generic and branded medicines.
          </p>
        </Col>
        <Col md={6}>
          <InputGroup className="shadow-sm rounded-pill overflow-hidden">
            <InputGroup.Text className="bg-white border-end-0 ps-3">
              <Search size={18} className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              className="border-start-0 ps-2"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="white"
                className="border-top border-bottom border-end pe-3"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </Button>
            )}
          </InputGroup>
        </Col>
      </Row>
      <Row>
        {/* Sidebar */}
        <Col lg={3} className="mb-4">
          <Card
            className="border-0 shadow-sm rounded-4 sticky-top"
            style={{ top: "100px", zIndex: 1 }}
          >
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-2">
              <h5 className="fw-bold mb-0 d-flex align-items-center">
                <Filter size={20} className="me-2 text-primary" /> Filter By
              </h5>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label className="small text-muted fw-bold text-uppercase mb-2">
                  Select Category
                </Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="form-select-lg border-0 bg-light shadow-sm rounded-3 text-dark fw-bold py-3 ps-3 pe-5"
                    style={{
                      cursor: "pointer",
                      appearance: "none",
                      backgroundImage: "none",
                    }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Form.Select>
                  <ChevronDown
                    size={20}
                    className="position-absolute top-50 end-0 translate-middle-y me-3 text-primary"
                    style={{ pointerEvents: "none" }}
                  />
                </div>
              </Form.Group>

              {selectedCategory !== "All" && (
                <div className="mt-3">
                  <Badge
                    bg="primary"
                    className="p-2 px-3 rounded-pill d-flex align-items-center justify-content-between"
                    style={{ maxWidth: "fit-content" }}
                  >
                    <span>{selectedCategory}</span>
                    <span
                      className="ms-2 cursor-pointer"
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedCategory("All")}
                    >
                      &times;
                    </span>
                  </Badge>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Medicines Grid */}
        <Col lg={9}>
          {medicines.length === 0 ? (
            <div className="text-center py-5">
              <Package size={48} className="text-muted opacity-50" />
              <h5 className="mt-3 text-muted">No medicines found</h5>
            </div>
          ) : (
            <Row xs={1} md={2} xl={3} className="g-4">
              {medicines.map((med) => {
                const qty = getQty(med._id);
                const selection = selectedUnits[med._id] || {
                  unitName: "Unit",
                  price: med.price,
                  multiplier: 1,
                };
                const totalPrice = (selection.price * qty).toFixed(2);
                const isOutOfStock = med.countInStock < selection.multiplier;
                return (
                  <Col key={med._id}>
                    <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative card-hover">
                      <div
                        className="position-relative text-center bg-white p-4"
                        style={{ minHeight: "200px" }}
                      >
                        <Link to={`/medicine/${med._id}`}>
                          <img
                            src={getImageUrl(med.image)}
                            alt={med.name}
                            className="img-fluid transition-transform"
                            style={{
                              height: "140px",
                              objectFit: "contain",
                              mixBlendMode: "multiply",
                            }}
                          />
                        </Link>
                        {/* Heart Button */}
                        <button
                          className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center border-0"
                          style={{ width: "32px", height: "32px", zIndex: 5 }}
                          onClick={() => handleToggleSave(med._id)}
                          disabled={saveLoading === med._id}
                        >
                          {saveLoading === med._id ? (
                            <Spinner size="sm" />
                          ) : (
                            <Heart
                              size={16}
                              className={
                                savedIds.has(med._id)
                                  ? "text-danger"
                                  : "text-muted"
                              }
                              fill={savedIds.has(med._id) ? "#dc3545" : "none"}
                            />
                          )}
                        </button>
                        {med.prescriptionRequired && (
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Prescription Required</Tooltip>}
                          >
                            <Badge
                              bg="warning"
                              text="dark"
                              className="position-absolute top-0 start-0 m-3 shadow-sm"
                            >
                              <ShieldAlert size={14} /> Rx
                            </Badge>
                          </OverlayTrigger>
                        )}
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
                      <Card.Body className="d-flex flex-column p-3 bg-light bg-opacity-25">
                        <div className="mb-2">
                          <Badge
                            bg="info"
                            className="text-dark bg-opacity-10 border border-info border-opacity-25 mb-2 px-2 py-1 font-monospace"
                          >
                            {med.category || "General"}
                          </Badge>
                          <h6 className="fw-bold text-truncate mb-1">
                            <Link
                              to={`/medicine/${med._id}`}
                              className="text-dark text-decoration-none hover-primary"
                            >
                              {med.name}
                            </Link>
                          </h6>
                          <small className="text-muted d-block text-truncate">
                            {med.manufacturer || "Generic"}
                          </small>
                        </div>
                        <div className="mt-auto bg-white rounded-3 p-2 border shadow-sm">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="small text-muted fw-medium mb-0">
                              Pack:
                            </label>
                            <select
                              className="form-select form-select-sm border-0 bg-transparent py-0 ps-2 pe-4 fw-bold text-primary"
                              style={{
                                width: "auto",
                                fontSize: "0.8rem",
                                height: "24px",
                                cursor: "pointer",
                              }}
                              value={selection.unitName}
                              onChange={(e) =>
                                handleUnitChange(med, e.target.value)
                              }
                            >
                              <option value={med.baseUnit || "Unit"}>
                                {med.baseUnit || "Unit"} (1x)
                              </option>
                              {med.units &&
                                med.units.map((u, idx) => (
                                  <option key={idx} value={u.name}>
                                    {u.name} (x{u.multiplier})
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="d-flex justify-content-between align-items-end mb-3 pt-2 border-top">
                            <div>
                              <small
                                className="text-muted d-block"
                                style={{ fontSize: "0.7rem" }}
                              >
                                Price
                              </small>
                              <span className="fw-bold">
                                NPR {selection.price}
                              </span>
                            </div>
                            <div className="text-end">
                              <small
                                className="text-muted d-block"
                                style={{ fontSize: "0.7rem" }}
                              >
                                Total
                              </small>
                              <span className="fw-bold text-primary">
                                NPR {totalPrice}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <div className="d-flex align-items-center bg-light rounded border flex-grow-1 justify-content-between px-1">
                              <Button
                                variant="link"
                                className="text-dark p-0 hover-bg-gray"
                                disabled={isOutOfStock || qty <= 1}
                                onClick={() => handleDecrement(med._id)}
                              >
                                <Minus size={16} />
                              </Button>
                              <span className="fw-bold small">{qty}</span>
                              <Button
                                variant="link"
                                className="text-dark p-0 hover-bg-gray"
                                disabled={
                                  isOutOfStock ||
                                  (qty + 1) * selection.multiplier >
                                    med.countInStock
                                }
                                onClick={() => handleIncrement(med)}
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              className="rounded fw-bold d-flex align-items-center px-3"
                              disabled={isOutOfStock}
                              onClick={() => handleAddToCart(med)}
                            >
                              <ShoppingCart size={16} />
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
      <style>{`.hover-primary:hover { color: var(--bs-primary) !important; } .card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; transition: all 0.3s ease; } .transition-transform { transition: transform 0.3s ease; } .card:hover .transition-transform { transform: scale(1.08); } .hover-bg-light:hover { background-color: #f8f9fa !important; } .hover-bg-gray:hover { background-color: #e9ecef; border-radius: 4px; }`}</style>
    </Container>
  );
};

export default MedicineShop;
