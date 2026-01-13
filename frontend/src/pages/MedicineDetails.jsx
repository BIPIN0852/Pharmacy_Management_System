// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Image,
//   Button,
//   Badge,
//   Spinner,
//   Alert,
// } from "react-bootstrap";
// import { useParams, Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../redux/actions/cartActions";
// import { ArrowLeft, ShoppingCart, ShieldAlert } from "lucide-react";

// const API_BASE_URL = "http://localhost:5000/api";

// const MedicineDetails = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const [medicine, setMedicine] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [qty, setQty] = useState(1);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/medicines/${id}`);
//         if (!res.ok) throw new Error("Medicine not found");
//         const data = await res.json();
//         setMedicine(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDetails();
//   }, [id]);

//   const handleAddToCart = () => {
//     dispatch(addToCart(medicine._id, qty));
//     alert("Added to cart");
//   };

//   if (loading)
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" />
//       </div>
//     );
//   if (error)
//     return (
//       <Alert variant="danger" className="m-5">
//         {error}
//       </Alert>
//     );

//   return (
//     <Container className="py-5">
//       <Link to="/medicines" className="btn btn-light mb-4">
//         <ArrowLeft size={18} /> Back
//       </Link>
//       <Row>
//         <Col md={5}>
//           <Image
//             src={medicine.image}
//             alt={medicine.name}
//             fluid
//             className="rounded-4 shadow-sm"
//           />
//         </Col>
//         <Col md={7}>
//           <h2 className="fw-bold">{medicine.name}</h2>
//           <p className="text-muted">{medicine.brand}</p>
//           <hr />
//           <h3 className="text-primary fw-bold">Rs. {medicine.price}</h3>

//           <div className="my-3">
//             {medicine.countInStock > 0 ? (
//               <Badge bg="success">In Stock</Badge>
//             ) : (
//               <Badge bg="danger">Out of Stock</Badge>
//             )}
//             {medicine.prescriptionRequired && (
//               <Badge bg="warning" text="dark" className="ms-2">
//                 <ShieldAlert size={14} /> Rx Required
//               </Badge>
//             )}
//           </div>

//           <p className="mt-4">{medicine.description}</p>

//           <div className="d-flex align-items-center gap-3 mt-4">
//             <select
//               value={qty}
//               onChange={(e) => setQty(Number(e.target.value))}
//               className="form-select w-auto"
//               disabled={medicine.countInStock === 0}
//             >
//               {[...Array(medicine.countInStock).keys()].map((x) => (
//                 <option key={x + 1} value={x + 1}>
//                   {x + 1}
//                 </option>
//               ))}
//             </select>
//             <Button
//               variant="primary"
//               size="lg"
//               disabled={medicine.countInStock === 0}
//               onClick={handleAddToCart}
//               className="px-5 rounded-pill"
//             >
//               <ShoppingCart size={20} className="me-2" /> Add to Cart
//             </Button>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default MedicineDetails;

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Badge,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/actions/cartActions";
import {
  ArrowLeft,
  ShoppingCart,
  ShieldAlert,
  Package,
  CheckCircle,
} from "lucide-react";
import api from "../services/api"; // ✅ Use global api service

const MedicineDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // User Selection States
  const [qty, setQty] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // ✅ Updated: Using global api service with error handling
        const data = await api.get(`/medicines/${id}`);
        setMedicine(data);

        // Initialize with base unit
        setSelectedUnit({
          name: data.baseUnit || "Tablet",
          price: data.price,
          multiplier: 1,
        });
      } catch (err) {
        setError(err.message || "Failed to load medicine details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAddToCart = () => {
    // ✅ Updated: Passing the full medicine object with selected unit and manual qty
    dispatch(
      addToCart({
        ...medicine,
        qty: qty,
        price: selectedUnit.price,
        unit: selectedUnit.name,
        buyingMultiplier: selectedUnit.multiplier,
      })
    );

    // Optional: navigate to cart or show a toast
    if (window.confirm(`${qty} ${selectedUnit.name}(s) added! View Cart?`)) {
      navigate("/cart");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error}</Alert>
        <Link to="/medicines" className="btn btn-primary">
          Back to Shop
        </Link>
      </Container>
    );

  return (
    <Container className="py-5 animate-fade-in">
      <Link
        to="/medicines"
        className="text-decoration-none text-muted d-inline-flex align-items-center mb-4 hover-primary"
      >
        <ArrowLeft size={18} className="me-2" /> Back to Pharmacy
      </Link>

      <Row className="bg-white rounded-4 shadow-sm p-4 overflow-hidden g-5">
        <Col md={5}>
          <div className="bg-light rounded-4 p-4 text-center h-100 d-flex align-items-center justify-content-center">
            <Image
              src={
                medicine.image ||
                "https://via.placeholder.com/400x400?text=Medicine"
              }
              alt={medicine.name}
              fluid
              className="rounded-3"
              style={{ maxHeight: "400px" }}
            />
          </div>
        </Col>

        <Col md={7}>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="fw-bold text-dark mb-1">{medicine.name}</h2>
              <p className="text-primary fw-medium mb-2">
                {medicine.brand || "Generic Name"}
              </p>
            </div>
            <Badge
              bg={
                medicine.countInStock > 0 ? "success-subtle" : "danger-subtle"
              }
              className={`text-${
                medicine.countInStock > 0 ? "success" : "danger"
              } border px-3 py-2`}
            >
              {medicine.countInStock > 0 ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>

          <div className="mt-3 d-flex gap-2">
            <Badge bg="info-subtle" className="text-info border px-2 py-1">
              <Package size={14} className="me-1" /> {medicine.category}
            </Badge>
            {medicine.prescriptionRequired && (
              <Badge
                bg="danger-subtle"
                className="text-danger border px-2 py-1"
              >
                <ShieldAlert size={14} className="me-1" /> Rx Required
              </Badge>
            )}
          </div>

          <hr className="my-4 opacity-50" />

          <div className="mb-4">
            <h6 className="text-muted small fw-bold text-uppercase">
              Pricing & Units
            </h6>
            <h3 className="text-dark fw-bold mb-0">
              Rs. {selectedUnit?.price * qty}
              <span className="fs-6 text-muted fw-normal ms-2">
                ({qty} x Rs. {selectedUnit?.price})
              </span>
            </h3>
          </div>

          {/* Unit Selection Logic */}
          <div className="mb-4">
            <label className="form-label small fw-bold">
              Select Packaging:
            </label>
            <div className="d-flex gap-2 flex-wrap">
              <Button
                variant={
                  selectedUnit?.name === medicine.baseUnit
                    ? "primary"
                    : "outline-secondary"
                }
                size="sm"
                onClick={() =>
                  setSelectedUnit({
                    name: medicine.baseUnit,
                    price: medicine.price,
                    multiplier: 1,
                  })
                }
              >
                {medicine.baseUnit}
              </Button>
              {medicine.units?.map((u, i) => (
                <Button
                  key={i}
                  variant={
                    selectedUnit?.name === u.name
                      ? "primary"
                      : "outline-secondary"
                  }
                  size="sm"
                  onClick={() =>
                    setSelectedUnit({
                      name: u.name,
                      price: u.price,
                      multiplier: u.multiplier,
                    })
                  }
                >
                  {u.name} (x{u.multiplier})
                </Button>
              ))}
            </div>
          </div>

          <Row className="g-3 align-items-end">
            <Col xs={4} md={3}>
              <Form.Group>
                <Form.Label className="small fw-bold">Quantity:</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={Math.floor(
                    medicine.countInStock / (selectedUnit?.multiplier || 1)
                  )}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  className="py-2 border-2"
                />
              </Form.Group>
            </Col>
            <Col xs={8} md={9}>
              <Button
                variant="primary"
                disabled={medicine.countInStock === 0}
                onClick={handleAddToCart}
                className="w-100 py-2 fs-5 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3 shadow-sm"
              >
                <ShoppingCart size={22} /> Add to Cart
              </Button>
            </Col>
          </Row>

          <div className="mt-5">
            <h6 className="fw-bold border-bottom pb-2">Description</h6>
            <p className="text-secondary" style={{ lineHeight: "1.7" }}>
              {medicine.description ||
                "No specific description provided for this medicine. Please consult a pharmacist for usage instructions."}
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MedicineDetails;
