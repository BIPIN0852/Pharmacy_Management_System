import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Alert,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ShoppingCart,
  Upload,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Minus,
  Plus,
  FileText,
} from "lucide-react";
import { addToCart } from "../redux/actions/cartActions";

const API_BASE_URL = "http://localhost:5000/api";

const MedicineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- State ---
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [uploadError, setUploadError] = useState("");

  // --- Fetch Data ---
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/medicines/${id}`);
        if (!res.ok) throw new Error("Medicine not found");
        const data = await res.json();
        setMedicine(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // --- Handlers ---
  const handleAddToCart = () => {
    if (medicine.prescriptionRequired && !prescriptionFile) {
      setUploadError(
        "This medicine requires a prescription. Please upload one to continue."
      );
      return;
    }

    // Dispatch Add To Cart
    dispatch(addToCart(medicine._id, qty, prescriptionFile)); // Assuming your action can handle file or you upload it first
    navigate("/cart");
  };

  const handleFileChange = (e) => {
    setPrescriptionFile(e.target.files[0]);
    setUploadError("");
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;
  if (!medicine) return null;

  return (
    <Container className="py-5">
      <Button
        variant="link"
        className="text-decoration-none mb-4 ps-0 text-muted"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} className="me-2" /> Back to Browse
      </Button>

      <Row className="g-5">
        {/* Left: Image */}
        <Col md={5}>
          <Card className="border-0 shadow-sm rounded-4 p-4 text-center h-100 bg-white">
            <img
              src={medicine.image || "https://via.placeholder.com/400"}
              alt={medicine.name}
              className="img-fluid"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </Card>
        </Col>

        {/* Right: Details */}
        <Col md={7}>
          <div>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Badge bg="info" className="mb-2 text-uppercase">
                  {medicine.category}
                </Badge>
                <h2 className="fw-bold mb-1">{medicine.name}</h2>
                <p className="text-muted mb-3">
                  Brand:{" "}
                  <span className="fw-bold text-dark">{medicine.brand}</span>
                </p>
              </div>
              {medicine.prescriptionRequired ? (
                <Badge bg="warning" text="dark" className="px-3 py-2">
                  <FileText size={14} className="me-1" /> Rx Required
                </Badge>
              ) : (
                <Badge bg="success" className="px-3 py-2">
                  <CheckCircle size={14} className="me-1" /> OTC
                </Badge>
              )}
            </div>

            <h3 className="text-primary fw-bold mb-4">
              Rs. {medicine.price}{" "}
              <small className="text-muted fs-6 fw-normal">/ strip</small>
            </h3>

            <p className="lead fs-6 text-secondary mb-4">
              {medicine.description}
            </p>

            {/* Info Cards */}
            <Row className="g-3 mb-4">
              <Col sm={6}>
                <div className="p-3 bg-light rounded-3 h-100 border">
                  <h6 className="fw-bold">Dosage</h6>
                  <p className="small text-muted mb-0">
                    {medicine.dosage || "As prescribed by physician."}
                  </p>
                </div>
              </Col>
              <Col sm={6}>
                <div className="p-3 bg-light rounded-3 h-100 border">
                  <h6 className="fw-bold text-danger">Side Effects</h6>
                  <p className="small text-muted mb-0">
                    {medicine.sideEffects ||
                      "Nausea, Dizziness (Consult Doctor)"}
                  </p>
                </div>
              </Col>
            </Row>

            <hr className="my-4" />

            {/* Prescription Upload Section */}
            {medicine.prescriptionRequired && (
              <div className="mb-4 p-3 bg-warning bg-opacity-10 border border-warning rounded-3">
                <h6 className="fw-bold d-flex align-items-center text-dark">
                  <Upload size={18} className="me-2" /> Upload Prescription
                </h6>
                <p className="small text-muted mb-2">
                  Government regulations require a valid prescription for this
                  medicine.
                </p>
                <Form.Control
                  type="file"
                  size="sm"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                />
                {uploadError && (
                  <div className="text-danger small mt-2">
                    <AlertTriangle size={14} className="me-1" />
                    {uploadError}
                  </div>
                )}
              </div>
            )}

            {/* Cart Actions */}
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center border rounded-pill px-2"
                style={{ height: "48px" }}
              >
                <Button
                  variant="link"
                  className="text-dark p-2"
                  disabled={qty <= 1}
                  onClick={() => setQty(qty - 1)}
                >
                  <Minus size={18} />
                </Button>
                <span className="fw-bold px-2">{qty}</span>
                <Button
                  variant="link"
                  className="text-dark p-2"
                  disabled={qty >= medicine.countInStock}
                  onClick={() => setQty(qty + 1)}
                >
                  <Plus size={18} />
                </Button>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="rounded-pill flex-grow-1"
                disabled={medicine.countInStock === 0}
                onClick={handleAddToCart}
                style={{ height: "48px" }}
              >
                {medicine.countInStock > 0 ? (
                  <>
                    <ShoppingCart size={20} className="me-2" /> Add to Cart
                  </>
                ) : (
                  "Out of Stock"
                )}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MedicineDetails;
