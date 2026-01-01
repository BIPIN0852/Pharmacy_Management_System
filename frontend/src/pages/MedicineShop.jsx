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
} from "react-bootstrap";
import {
  Search,
  Filter,
  ShoppingCart,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
// Assuming you have this action created, otherwise I can provide it
import { addToCart } from "../redux/actions/cartActions";

const API_BASE_URL = "http://localhost:5000/api";

const MedicineShop = () => {
  const dispatch = useDispatch();

  // --- State ---
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPrescription, setFilterPrescription] = useState("All"); // All, Required, NotRequired
  const [showOutOfStock, setShowOutOfStock] = useState(true);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        // Replace with your actual endpoint
        const res = await fetch(`${API_BASE_URL}/medicines`);
        if (!res.ok) throw new Error("Failed to fetch medicines");
        const data = await res.json();
        setMedicines(data.medicines || data); // Handle { medicines: [] } or []
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  // --- Filter Logic ---
  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || med.category === filterCategory;

    let matchesPrescription = true;
    if (filterPrescription === "Required")
      matchesPrescription = med.prescriptionRequired;
    if (filterPrescription === "NotRequired")
      matchesPrescription = !med.prescriptionRequired;

    const matchesStock = showOutOfStock || med.countInStock > 0;

    return (
      matchesSearch && matchesCategory && matchesPrescription && matchesStock
    );
  });

  // --- Handlers ---
  const handleAddToCart = (med) => {
    if (med.countInStock > 0) {
      dispatch(addToCart(med._id, 1));
      alert(`${med.name} added to cart!`);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  if (error)
    return <div className="text-center py-5 text-danger">Error: {error}</div>;

  return (
    <Container className="py-5">
      {/* Header & Search */}
      <div className="mb-4">
        <h2 className="fw-bold mb-3">Browse Medicines</h2>
        <InputGroup className="shadow-sm">
          <InputGroup.Text className="bg-white border-end-0">
            <Search size={20} className="text-muted" />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by medicine name, brand, or category..."
            className="border-start-0 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="primary" className="px-4">
            Search
          </Button>
        </InputGroup>
      </div>

      <Row>
        {/* Sidebar Filters */}
        <Col lg={3} className="mb-4">
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                <Filter size={20} className="me-2 text-primary" /> Filters
              </h5>

              {/* Prescription Filter */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold small text-muted">
                  Prescription
                </Form.Label>
                <Form.Select
                  value={filterPrescription}
                  onChange={(e) => setFilterPrescription(e.target.value)}
                  className="shadow-sm"
                >
                  <option value="All">All Types</option>
                  <option value="Required">Prescription Required</option>
                  <option value="NotRequired">OTC (Not Required)</option>
                </Form.Select>
              </Form.Group>

              {/* Category Filter */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold small text-muted">
                  Category
                </Form.Label>
                <Form.Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="shadow-sm"
                >
                  <option value="All">All Categories</option>
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Pain Relief">Pain Relief</option>
                  <option value="Vitamins">Vitamins</option>
                  <option value="Cardiology">Cardiology</option>
                </Form.Select>
              </Form.Group>

              {/* Stock Filter */}
              <Form.Group>
                <Form.Check
                  type="switch"
                  id="stock-switch"
                  label="Show Out of Stock"
                  checked={showOutOfStock}
                  onChange={(e) => setShowOutOfStock(e.target.checked)}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* Medicine Grid */}
        <Col lg={9}>
          <Row xs={1} md={2} xl={3} className="g-4">
            {filteredMedicines.map((med) => (
              <Col key={med._id}>
                <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden card-hover transition-all">
                  <div className="position-relative text-center bg-light p-4">
                    <img
                      src={med.image || "https://via.placeholder.com/150"}
                      alt={med.name}
                      style={{
                        height: "140px",
                        objectFit: "contain",
                        mixBlendMode: "multiply",
                      }}
                    />
                    {med.prescriptionRequired && (
                      <Badge
                        bg="warning"
                        text="dark"
                        className="position-absolute top-0 end-0 m-3 shadow-sm"
                      >
                        Rx Required
                      </Badge>
                    )}
                    {med.countInStock === 0 && (
                      <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center">
                        <Badge bg="danger" className="px-3 py-2 fs-6">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  <Card.Body className="d-flex flex-column p-3">
                    <div className="mb-2">
                      <small className="text-muted">
                        {med.category || "General"}
                      </small>
                      <h6
                        className="fw-bold mb-1 text-truncate"
                        title={med.name}
                      >
                        {med.name}
                      </h6>
                      <small className="text-muted">{med.brand}</small>
                    </div>

                    <div className="mt-auto d-flex justify-content-between align-items-end">
                      <div>
                        <span className="fs-5 fw-bold text-primary">
                          Rs. {med.price}
                        </span>
                        <small
                          className="text-muted d-block"
                          style={{ fontSize: "0.75rem" }}
                        >
                          per strip
                        </small>
                      </div>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/medicine/${med._id}`}
                          className="btn btn-outline-secondary btn-sm rounded-circle p-2"
                        >
                          <Info size={18} />
                        </Link>
                        <Button
                          variant="primary"
                          size="sm"
                          className="rounded-circle p-2"
                          disabled={med.countInStock === 0}
                          onClick={() => handleAddToCart(med)}
                        >
                          <ShoppingCart size={18} />
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {filteredMedicines.length === 0 && (
            <div className="text-center py-5">
              <h5 className="text-muted">
                No medicines found matching your criteria.
              </h5>
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <style>{`
        .card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </Container>
  );
};

export default MedicineShop;
