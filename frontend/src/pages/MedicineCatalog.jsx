// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   Badge,
//   Container,
//   Alert,
// } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { addToCart } from "../redux/actions/cartActions";
// import api from "../services/api";

// const MedicineCatalog = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.userLogin || {});

//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const [sortBy, setSortBy] = useState("name");

//   // Categories for filter
//   const categories = [
//     "All",
//     "Pain Relief",
//     "Antibiotics",
//     "Vitamins",
//     "Cold & Flu",
//     "Digestive",
//   ];

//   useEffect(() => {
//     fetchMedicines();
//   }, []);

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       const res = await api.get("/medicines", {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });
//       setMedicines(res.data || []);
//     } catch (err) {
//       setError("Failed to load medicines. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCartHandler = (medicine) => {
//     dispatch(
//       addToCart({
//         ...medicine,
//         medicine: medicine._id,
//         qty: 1,
//         name: medicine.name,
//         price: medicine.price,
//       })
//     );
//   };

//   // Filter and sort medicines
//   const filteredMedicines = medicines
//     .filter((medicine) => {
//       const matchesSearch =
//         medicine.name.toLowerCase().includes(search.toLowerCase()) ||
//         medicine.description?.toLowerCase().includes(search.toLowerCase());
//       const matchesCategory =
//         category === "All" || medicine.category === category;
//       return matchesSearch && matchesCategory;
//     })
//     .sort((a, b) => {
//       if (sortBy === "price-low") return a.price - b.price;
//       if (sortBy === "price-high") return b.price - a.price;
//       if (sortBy === "name") return a.name.localeCompare(b.name);
//       return 0;
//     });

//   if (loading) {
//     return (
//       <Container className="my-5 text-center">
//         <div
//           className="spinner-border text-primary mb-3"
//           style={{ width: "3rem", height: "3rem" }}
//         />
//         <h4>Loading medicines...</h4>
//       </Container>
//     );
//   }

//   return (
//     <Container className="my-5">
//       {/* Header */}
//       <div className="text-center mb-5">
//         <h1 className="display-4 fw-bold mb-3">Medicines</h1>
//         <p className="lead text-muted">
//           Browse our wide selection of quality medicines
//         </p>
//       </div>

//       {/* Filters */}
//       <Card className="shadow-sm mb-4">
//         <Card.Body>
//           <Row className="g-3 align-items-center">
//             <Col md={4}>
//               <Form.Control
//                 type="text"
//                 placeholder="Search medicines..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </Col>
//             <Col md={3}>
//               <Form.Select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//               >
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Col>
//             <Col md={3}>
//               <Form.Select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//               >
//                 <option value="name">Sort by Name</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//               </Form.Select>
//             </Col>
//             <Col md={2}>
//               <Button
//                 variant="outline-primary"
//                 className="w-100"
//                 onClick={fetchMedicines}
//               >
//                 Clear
//               </Button>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Error */}
//       {error && <Alert variant="danger">{error}</Alert>}

//       {/* Medicines Grid */}
//       <Row className="g-4">
//         {filteredMedicines.length === 0 ? (
//           <Col className="text-center py-5">
//             <i className="fas fa-search fa-3x text-muted mb-3"></i>
//             <h4>No medicines found</h4>
//             <p className="text-muted">Try adjusting your search or filters</p>
//             <Button variant="primary" onClick={fetchMedicines}>
//               Load All Medicines
//             </Button>
//           </Col>
//         ) : (
//           filteredMedicines.map((medicine) => (
//             <Col key={medicine._id} md={6} lg={4} xl={3}>
//               <Card className="h-100 shadow-sm hover-shadow transition-all border-0 position-relative">
//                 <Card.Body className="p-4">
//                   {/* Category Badge */}
//                   <Badge
//                     bg="primary"
//                     className="mb-2 position-absolute top-0 end-0 m-2"
//                   >
//                     {medicine.category}
//                   </Badge>

//                   {/* Medicine Image */}
//                   <div className="text-center mb-3">
//                     <div
//                       className="bg-gradient mx-auto rounded-circle d-flex align-items-center justify-content-center mb-2"
//                       style={{
//                         width: 80,
//                         height: 80,
//                         background:
//                           "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                       }}
//                     >
//                       <i className="fas fa-pills fa-2x text-white"></i>
//                     </div>
//                   </div>

//                   {/* Name & Price */}
//                   <Card.Title
//                     className="fw-bold mb-2"
//                     style={{ height: "60px", overflow: "hidden" }}
//                   >
//                     {medicine.name}
//                   </Card.Title>

//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h4 className="text-primary mb-0 fw-bold">
//                       ₹{medicine.price}
//                     </h4>
//                     {medicine.stock > 0 ? (
//                       <Badge bg="success">In Stock</Badge>
//                     ) : (
//                       <Badge bg="danger">Out of Stock</Badge>
//                     )}
//                   </div>

//                   {/* Description */}
//                   <p
//                     className="text-muted small mb-3"
//                     style={{ height: "80px", overflow: "hidden" }}
//                   >
//                     {medicine.description ||
//                       "High quality medicine for your health needs."}
//                   </p>

//                   {/* Add to Cart Button */}
//                   <Button
//                     variant="primary"
//                     className="w-100 rounded-pill fw-bold py-2 shadow-sm"
//                     onClick={() => addToCartHandler(medicine)}
//                     disabled={medicine.stock === 0}
//                   >
//                     {medicine.stock === 0 ? (
//                       <>
//                         <i className="fas fa-ban me-2"></i>Out of Stock
//                       </>
//                     ) : (
//                       <>
//                         <i className="fas fa-cart-plus me-2"></i>
//                         Add to Cart
//                       </>
//                     )}
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))
//         )}
//       </Row>

//       {/* Cart Summary */}
//       {filteredMedicines.length > 0 && (
//         <div className="text-center mt-5">
//           <Link
//             to="/cart"
//             className="btn btn-success btn-lg rounded-pill px-5 py-3 shadow-lg"
//           >
//             <i className="fas fa-shopping-cart me-2"></i>
//             View Cart & Checkout
//           </Link>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default MedicineCatalog;

// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   Badge,
//   Container,
//   Alert,
// } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { addToCart } from "../redux/actions/cartActions";
// import api from "../services/api";

// const MedicineCatalog = () => {
//   const dispatch = useDispatch();

//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const [sortBy, setSortBy] = useState("name");

//   // Track user selection for units: { [medId]: { unitName: "Strip", price: 50, multiplier: 10 } }
//   const [selectedUnits, setSelectedUnits] = useState({});

//   // Categories for filter
//   const categories = [
//     "All",
//     "Pain Relief",
//     "Antibiotics",
//     "Vitamins",
//     "Cold & Flu",
//     "Digestive",
//   ];

//   useEffect(() => {
//     fetchMedicines();
//   }, []);

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");
//       const res = await api.get("/medicines", {
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });

//       const medList = res.data || [];
//       setMedicines(medList);

//       // Initialize default selections (Base Unit)
//       const defaults = {};
//       medList.forEach((m) => {
//         defaults[m._id] = {
//           unitName: m.baseUnit || "Unit",
//           price: m.price,
//           multiplier: 1,
//         };
//       });
//       setSelectedUnits(defaults);
//     } catch (err) {
//       setError("Failed to load medicines. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Unit Dropdown Change
//   const handleUnitChange = (medicine, unitName) => {
//     let newSelection = {};

//     if (unitName === (medicine.baseUnit || "Unit")) {
//       // Base Unit Selected
//       newSelection = {
//         unitName: medicine.baseUnit || "Unit",
//         price: medicine.price,
//         multiplier: 1,
//       };
//     } else {
//       // Pack Unit Selected
//       const unit = medicine.units.find((u) => u.name === unitName);
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
//       [medicine._id]: newSelection,
//     }));
//   };

//   const addToCartHandler = (medicine) => {
//     // Get current selection or fallback to defaults
//     const selection = selectedUnits[medicine._id] || {
//       unitName: medicine.baseUnit || "Unit",
//       price: medicine.price,
//       multiplier: 1,
//     };

//     dispatch(
//       addToCart({
//         ...medicine,
//         medicine: medicine._id,
//         name: medicine.name,
//         qty: 1,
//         // Send specific selection details to cart
//         unit: selection.unitName,
//         price: selection.price,
//         buyingMultiplier: selection.multiplier,
//       })
//     );
//   };

//   // Filter and sort medicines
//   const filteredMedicines = medicines
//     .filter((medicine) => {
//       const matchesSearch =
//         medicine.name.toLowerCase().includes(search.toLowerCase()) ||
//         medicine.description?.toLowerCase().includes(search.toLowerCase());
//       const matchesCategory =
//         category === "All" || medicine.category === category;
//       return matchesSearch && matchesCategory;
//     })
//     .sort((a, b) => {
//       // Sort logic adjusted to use base price for consistency
//       if (sortBy === "price-low") return a.price - b.price;
//       if (sortBy === "price-high") return b.price - a.price;
//       if (sortBy === "name") return a.name.localeCompare(b.name);
//       return 0;
//     });

//   if (loading) {
//     return (
//       <Container className="my-5 text-center">
//         <div
//           className="spinner-border text-primary mb-3"
//           style={{ width: "3rem", height: "3rem" }}
//         />
//         <h4>Loading medicines...</h4>
//       </Container>
//     );
//   }

//   return (
//     <Container className="my-5">
//       {/* Header */}
//       <div className="text-center mb-5">
//         <h1 className="display-4 fw-bold mb-3">Medicines</h1>
//         <p className="lead text-muted">
//           Browse our wide selection of quality medicines
//         </p>
//       </div>

//       {/* Filters */}
//       <Card className="shadow-sm mb-4">
//         <Card.Body>
//           <Row className="g-3 align-items-center">
//             <Col md={4}>
//               <Form.Control
//                 type="text"
//                 placeholder="Search medicines..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </Col>
//             <Col md={3}>
//               <Form.Select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//               >
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Col>
//             <Col md={3}>
//               <Form.Select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//               >
//                 <option value="name">Sort by Name</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//               </Form.Select>
//             </Col>
//             <Col md={2}>
//               <Button
//                 variant="outline-primary"
//                 className="w-100"
//                 onClick={fetchMedicines}
//               >
//                 Clear
//               </Button>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Error */}
//       {error && <Alert variant="danger">{error}</Alert>}

//       {/* Medicines Grid */}
//       <Row className="g-4">
//         {filteredMedicines.length === 0 ? (
//           <Col className="text-center py-5">
//             <i className="fas fa-search fa-3x text-muted mb-3"></i>
//             <h4>No medicines found</h4>
//             <p className="text-muted">Try adjusting your search or filters</p>
//             <Button variant="primary" onClick={fetchMedicines}>
//               Load All Medicines
//             </Button>
//           </Col>
//         ) : (
//           filteredMedicines.map((medicine) => {
//             // Get current selection for rendering
//             const currentSelection = selectedUnits[medicine._id] || {
//               unitName: medicine.baseUnit || "Unit",
//               price: medicine.price,
//               multiplier: 1,
//             };

//             // Check Stock
//             const isOutOfStock =
//               (medicine.quantity || 0) < currentSelection.multiplier;

//             return (
//               <Col key={medicine._id} md={6} lg={4} xl={3}>
//                 <Card className="h-100 shadow-sm hover-shadow transition-all border-0 position-relative">
//                   <Card.Body className="p-4 d-flex flex-column">
//                     {/* Category Badge */}
//                     <Badge
//                       bg="primary"
//                       className="mb-2 position-absolute top-0 end-0 m-2"
//                     >
//                       {medicine.category}
//                     </Badge>

//                     {/* Medicine Image */}
//                     <div className="text-center mb-3">
//                       <div
//                         className="bg-gradient mx-auto rounded-circle d-flex align-items-center justify-content-center mb-2"
//                         style={{
//                           width: 80,
//                           height: 80,
//                           background:
//                             "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                         }}
//                       >
//                         <i className="fas fa-pills fa-2x text-white"></i>
//                       </div>
//                     </div>

//                     {/* Name */}
//                     <Card.Title
//                       className="fw-bold mb-1 text-truncate"
//                       title={medicine.name}
//                     >
//                       {medicine.name}
//                     </Card.Title>

//                     {/* Unit Selector */}
//                     <Form.Group className="mb-3">
//                       <Form.Label className="small text-muted mb-1">
//                         Select Pack:
//                       </Form.Label>
//                       <Form.Select
//                         size="sm"
//                         value={currentSelection.unitName}
//                         onChange={(e) =>
//                           handleUnitChange(medicine, e.target.value)
//                         }
//                       >
//                         <option value={medicine.baseUnit || "Unit"}>
//                           {medicine.baseUnit || "Unit"}
//                         </option>
//                         {medicine.units &&
//                           medicine.units.map((u, idx) => (
//                             <option key={idx} value={u.name}>
//                               {u.name} (x{u.multiplier})
//                             </option>
//                           ))}
//                       </Form.Select>
//                     </Form.Group>

//                     {/* Price & Stock Status */}
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                       <h4 className="text-primary mb-0 fw-bold">
//                         ₹{currentSelection.price}
//                       </h4>
//                       {!isOutOfStock ? (
//                         <Badge bg="success">In Stock</Badge>
//                       ) : (
//                         <Badge bg="danger">Out of Stock</Badge>
//                       )}
//                     </div>

//                     {/* Description */}
//                     <p
//                       className="text-muted small mb-3 flex-grow-1"
//                       style={{ height: "40px", overflow: "hidden" }}
//                     >
//                       {medicine.description ||
//                         "High quality medicine for your health needs."}
//                     </p>

//                     {/* Add to Cart Button */}
//                     <Button
//                       variant="primary"
//                       className="w-100 rounded-pill fw-bold py-2 shadow-sm mt-auto"
//                       onClick={() => addToCartHandler(medicine)}
//                       disabled={isOutOfStock}
//                     >
//                       {isOutOfStock ? (
//                         <>
//                           <i className="fas fa-ban me-2"></i>Out of Stock
//                         </>
//                       ) : (
//                         <>
//                           <i className="fas fa-cart-plus me-2"></i>
//                           Add to Cart
//                         </>
//                       )}
//                     </Button>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             );
//           })
//         )}
//       </Row>

//       {/* Cart Summary */}
//       {filteredMedicines.length > 0 && (
//         <div className="text-center mt-5">
//           <Link
//             to="/cart"
//             className="btn btn-success btn-lg rounded-pill px-5 py-3 shadow-lg"
//           >
//             <i className="fas fa-shopping-cart me-2"></i>
//             View Cart & Checkout
//           </Link>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default MedicineCatalog;

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Container,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Filter, Ban, Plus, Package } from "lucide-react";
import { addToCart } from "../redux/actions/cartActions";
import api from "../services/api"; // ✅ Uses interceptor for token

const MedicineCatalog = () => {
  const dispatch = useDispatch();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  // Track user selection for units: { [medId]: { unitName: "Strip", price: 50, multiplier: 10 } }
  const [selectedUnits, setSelectedUnits] = useState({});

  // Categories for filter
  const categories = [
    "All",
    "Pain Relief",
    "Antibiotics",
    "Vitamins",
    "Cold & Flu",
    "Digestive",
    "Cardiology",
    "Dermatology",
  ];

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ Call API (Interceptor handles Token)
      const res = await api.get("/medicines");

      // Handle potentially different response structures
      const medList = Array.isArray(res.data)
        ? res.data
        : res.data.medicines || [];
      setMedicines(medList);

      // Initialize default selections (Base Unit)
      const defaults = {};
      medList.forEach((m) => {
        defaults[m._id] = {
          unitName: m.baseUnit || "Unit",
          price: m.price,
          multiplier: 1,
        };
      });
      setSelectedUnits(defaults);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Unit Dropdown Change
  const handleUnitChange = (medicine, unitName) => {
    let newSelection = {};

    if (unitName === (medicine.baseUnit || "Unit")) {
      // Base Unit Selected
      newSelection = {
        unitName: medicine.baseUnit || "Unit",
        price: medicine.price,
        multiplier: 1,
      };
    } else {
      // Pack Unit Selected
      const unit = medicine.units.find((u) => u.name === unitName);
      if (unit) {
        newSelection = {
          unitName: unit.name,
          price: unit.price,
          multiplier: unit.multiplier,
        };
      }
    }

    setSelectedUnits((prev) => ({
      ...prev,
      [medicine._id]: newSelection,
    }));
  };

  const addToCartHandler = (medicine) => {
    // Get current selection or fallback to defaults
    const selection = selectedUnits[medicine._id] || {
      unitName: medicine.baseUnit || "Unit",
      price: medicine.price,
      multiplier: 1,
    };

    dispatch(
      addToCart({
        ...medicine,
        medicine: medicine._id,
        name: medicine.name,
        image: medicine.image,
        qty: 1,
        stock: medicine.quantity,
        // Send specific selection details to cart
        unit: selection.unitName,
        price: selection.price,
        buyingMultiplier: selection.multiplier,
      })
    );
  };

  // Filter and sort medicines
  const filteredMedicines = medicines
    .filter((medicine) => {
      const matchesSearch =
        medicine.name.toLowerCase().includes(search.toLowerCase()) ||
        medicine.manufacturer?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "All" ||
        (medicine.category || "").toLowerCase() === category.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  if (loading) {
    return (
      <Container className="my-5 text-center py-5">
        <Spinner
          animation="border"
          variant="primary"
          style={{ width: "3rem", height: "3rem" }}
        />
        <h5 className="mt-3 text-muted">Loading catalog...</h5>
      </Container>
    );
  }

  return (
    <Container className="my-5 fade-in">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-2">Medicine Catalog</h1>
        <p className="lead text-muted">
          Browse our wide selection of quality medicines and healthcare
          products.
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-0 mb-5 rounded-4">
        <Card.Body className="p-4">
          <Row className="g-3 align-items-center">
            <Col md={5}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search medicines or manufacturers..."
                  className="border-start-0 shadow-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <Filter size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Select
                  className="border-start-0 shadow-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ cursor: "pointer" }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="shadow-none"
                style={{ cursor: "pointer" }}
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </Form.Select>
            </Col>
            <Col md={1}>
              <Button
                variant="outline-secondary"
                className="w-100"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setSortBy("name");
                }}
                title="Reset Filters"
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Error Alert */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Medicines Grid */}
      <Row className="g-4">
        {filteredMedicines.length === 0 ? (
          <Col className="text-center py-5">
            <div className="text-muted opacity-50 mb-3">
              <Search size={64} />
            </div>
            <h4>No medicines found</h4>
            <p className="text-muted">Try adjusting your search or filters.</p>
            <Button
              variant="primary"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              Clear Filters
            </Button>
          </Col>
        ) : (
          filteredMedicines.map((medicine) => {
            // Get current selection for rendering
            const currentSelection = selectedUnits[medicine._id] || {
              unitName: medicine.baseUnit || "Unit",
              price: medicine.price,
              multiplier: 1,
            };

            // Check Stock
            const isOutOfStock =
              (medicine.quantity || 0) < currentSelection.multiplier;

            return (
              <Col key={medicine._id} md={6} lg={4} xl={3}>
                <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden position-relative hover-shadow transition-all">
                  {/* Image Area */}
                  <div
                    className="bg-light text-center p-4"
                    style={{
                      minHeight: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {medicine.image ? (
                      <img
                        src={medicine.image}
                        alt={medicine.name}
                        className="img-fluid"
                        style={{
                          maxHeight: "140px",
                          objectFit: "contain",
                          mixBlendMode: "multiply",
                        }}
                      />
                    ) : (
                      <div className="text-muted opacity-25">
                        <Package size={64} />
                      </div>
                    )}
                  </div>

                  {/* Category Badge */}
                  <Badge
                    bg="info"
                    className="position-absolute top-0 end-0 m-3 shadow-sm text-dark bg-opacity-25 border border-info border-opacity-25"
                  >
                    {medicine.category || "General"}
                  </Badge>

                  <Card.Body className="d-flex flex-column p-4">
                    <Card.Title
                      className="fw-bold mb-1 text-truncate"
                      title={medicine.name}
                    >
                      {medicine.name}
                    </Card.Title>
                    <div className="text-muted small mb-3 text-truncate">
                      {medicine.manufacturer || "Generic"}
                    </div>

                    {/* Unit Selector */}
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted mb-1 fw-bold">
                        Pack Size
                      </Form.Label>
                      <Form.Select
                        size="sm"
                        className="rounded-3 shadow-none border-secondary border-opacity-25"
                        value={currentSelection.unitName}
                        onChange={(e) =>
                          handleUnitChange(medicine, e.target.value)
                        }
                      >
                        <option value={medicine.baseUnit || "Unit"}>
                          {medicine.baseUnit || "Unit"}
                        </option>
                        {medicine.units &&
                          medicine.units.map((u, idx) => (
                            <option key={idx} value={u.name}>
                              {u.name} (x{u.multiplier})
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>

                    {/* Price & Stock */}
                    <div className="d-flex justify-content-between align-items-end mt-auto mb-3">
                      <div>
                        <div className="small text-muted mb-0">Price</div>
                        <div className="h4 mb-0 fw-bold text-primary">
                          Rs. {currentSelection.price}
                        </div>
                      </div>
                      <div className="text-end">
                        {isOutOfStock ? (
                          <Badge
                            bg="danger"
                            className="bg-opacity-10 text-danger border border-danger"
                          >
                            Out of Stock
                          </Badge>
                        ) : (
                          <small className="text-success fw-bold">
                            <i className="fas fa-check-circle me-1"></i>In Stock
                          </small>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      variant={isOutOfStock ? "light" : "primary"}
                      className={`w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2 ${
                        isOutOfStock ? "text-muted border" : "shadow-sm"
                      }`}
                      onClick={() => addToCartHandler(medicine)}
                      disabled={isOutOfStock}
                    >
                      {isOutOfStock ? (
                        <>
                          <Ban size={18} /> Out of Stock
                        </>
                      ) : (
                        <>
                          <Plus size={18} /> Add to Cart
                        </>
                      )}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        )}
      </Row>

      {/* View Cart Floating Button (visible if cart has items - optional logic) */}
      {filteredMedicines.length > 0 && (
        <div className="text-center mt-5">
          <Link
            to="/cart"
            className="btn btn-success rounded-pill px-5 py-3 shadow-lg fw-bold d-inline-flex align-items-center gap-2"
          >
            <ShoppingCart size={20} />
            Go to Cart
          </Link>
        </div>
      )}
    </Container>
  );
};

export default MedicineCatalog;
