import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
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
  ShieldCheck,
  Package,
  AlertTriangle,
  FileText,
  Info,
  Sparkles, // Sparkles icon for AI
} from "lucide-react";
import api from "../services/api";

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

  // AI Feature States
  const [aiSummary, setAiSummary] = useState("");
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const rawData = await api.get(`/medicines/${id}`);

        // FIXED: Safely extract the medicine object to prevent 'NaN' and undefined errors
        const medData =
          rawData.medicine || rawData.data?.medicine || rawData.data || rawData;

        setMedicine(medData);

        // Initialize with base unit
        setSelectedUnit({
          name: medData.baseUnit || "Tablet",
          price: medData.price,
          multiplier: 1,
        });

        //Reset AI summary when navigating to a new medicine
        setAiSummary("");
      } catch (err) {
        setError(err.message || "Failed to load medicine details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // ADDED: Image URL Helper to fix broken images
  const getImageUrl = (path) => {
    if (!path)
      return "https://ui-avatars.com/api/?name=Med&background=f8fafc&color=0f172a";
    return path.startsWith("http") ? path : `http://localhost:5000${path}`;
  };

  const handleUnitChange = (e) => {
    const unitName = e.target.value;
    if (unitName === (medicine.baseUnit || "Tablet")) {
      setSelectedUnit({
        name: medicine.baseUnit || "Tablet",
        price: medicine.price,
        multiplier: 1,
      });
    } else {
      const unit = medicine.units?.find((u) => u.name === unitName);
      if (unit) {
        setSelectedUnit({
          name: unit.name,
          price: unit.price,
          multiplier: unit.multiplier,
        });
      }
    }
    setQty(1); // Reset quantity when changing packaging
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...medicine,
        medicine: medicine._id || medicine.id, // Ensure ID is passed for the cart
        qty: qty,
        price: selectedUnit.price,
        unit: selectedUnit.name,
        buyingMultiplier: selectedUnit.multiplier,
        prescriptionRequired: medicine.prescriptionRequired,
      }),
    );

    if (window.confirm(`${qty} ${selectedUnit.name}(s) added! View Cart?`)) {
      navigate("/cart");
    }
  };

  //REAL GEMINI AI GENERATOR FUNCTION
  const handleGenerateAI = async () => {
    setGeneratingAi(true);

    try {
      // Calls your new Node.js backend route
      const { data } = await api.post("/medicines/ai-summary", {
        name: medicine.name,
        category: medicine.category,
        description: medicine.description,
      });

      // Saves the real Gemini response to the screen
      setAiSummary(data.summary);
    } catch (err) {
      console.error(err);
      setAiSummary(
        "Sorry, the AI Pharmacist is currently unavailable. Please consult your doctor for medical advice.",
      );
    } finally {
      setGeneratingAi(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
        <Spinner animation="border" variant="dark" className="mb-3" />
        <span className="text-muted fw-semibold small">
          Loading medicine details...
        </span>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <Container className="py-5 text-center min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <AlertTriangle size={48} className="text-danger mb-3 opacity-50" />
        <h4 className="fw-bold text-dark">Medicine not found</h4>
        <p className="text-muted">{error}</p>
        <Link to="/medicines" className="btn btn-dark rounded-pill px-4 mt-3">
          Back to Store
        </Link>
      </Container>
    );
  }

  // Stock Calculations based on the selected multiplier
  const maxAvailableQty = Math.floor(
    (medicine.countInStock || 0) / (selectedUnit?.multiplier || 1),
  );
  const isOutOfStock = maxAvailableQty <= 0;

  return (
    <div
      className="bg-light min-vh-100 py-4 px-3 px-md-5"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="container-fluid max-w-6xl mx-auto animate-fade-in">
        {/* Back Button */}
        <Button
          variant="link"
          className="text-decoration-none text-dark fw-medium p-0 d-flex align-items-center gap-2 mb-4 hover-underline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} /> Back to Pharmacy
        </Button>

        <Row className="g-4">
          {/* LEFT: IMAGE SECTION */}
          <Col lg={5}>
            <div className="bg-white rounded-4 shadow-sm border border-light-subtle d-flex align-items-center justify-content-center p-5 h-100 position-relative">
              {medicine.prescriptionRequired && (
                <Badge
                  bg="warning"
                  text="dark"
                  className="position-absolute top-0 start-0 m-4 rounded-pill px-3 py-2 fw-bold shadow-sm d-flex align-items-center gap-1"
                >
                  <FileText size={14} /> Rx Required
                </Badge>
              )}
              {isOutOfStock && (
                <Badge
                  bg="danger"
                  className="position-absolute top-0 end-0 m-4 rounded-pill px-3 py-2 fw-bold shadow-sm"
                >
                  Out of Stock
                </Badge>
              )}
              <img
                src={getImageUrl(medicine.image)}
                alt={medicine.name}
                className="img-fluid mix-blend-multiply"
                style={{ maxHeight: "350px", objectFit: "contain" }}
              />
            </div>
          </Col>

          {/* RIGHT: DETAILS SECTION */}
          <Col lg={7}>
            <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-4 p-md-5 h-100 d-flex flex-column">
              <div className="mb-4">
                <div className="text-primary fw-bold small text-uppercase tracking-wider mb-2 d-flex align-items-center gap-1">
                  <ShieldCheck size={16} /> {medicine.category}
                </div>
                <h2
                  className="fw-bolder text-dark mb-1"
                  style={{ letterSpacing: "-0.5px" }}
                >
                  {medicine.name}
                </h2>
                <p className="text-muted fw-medium fs-6">
                  by{" "}
                  {medicine.brand ||
                    medicine.manufacturer ||
                    "Generic Manufacturer"}
                </p>
              </div>

              {/* Pricing Box */}
              <div className="bg-light rounded-4 p-4 mb-4 border border-light-subtle">
                <div className="d-flex align-items-end gap-2 mb-1">
                  <span className="fs-2 fw-bolder text-dark lh-1">
                    Rs. {selectedUnit?.price * qty}
                  </span>
                  <span className="text-muted fw-medium mb-1">
                    ({qty} x Rs. {selectedUnit?.price} / {selectedUnit?.name})
                  </span>
                </div>
                {!isOutOfStock ? (
                  <div className="text-success small fw-semibold d-flex align-items-center gap-1 mt-2">
                    <Package size={14} /> In Stock ({medicine.countInStock}{" "}
                    total units available)
                  </div>
                ) : (
                  <div className="text-danger small fw-semibold d-flex align-items-center gap-1 mt-2">
                    <AlertTriangle size={14} /> Currently Unavailable
                  </div>
                )}
              </div>

              {/* Selectors */}
              <Row className="g-3 mb-4">
                {/* Pack Size Selector */}
                {medicine.units && medicine.units.length > 0 && (
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-dark mb-2">
                        Select Packaging:
                      </Form.Label>
                      <Form.Select
                        className="form-select-lg shadow-none border-light-subtle bg-light cursor-pointer fs-6 rounded-3"
                        value={selectedUnit?.name}
                        onChange={handleUnitChange}
                      >
                        <option value={medicine.baseUnit || "Tablet"}>
                          {medicine.baseUnit || "Tablet"} (1x)
                        </option>
                        {medicine.units.map((u, idx) => (
                          <option key={idx} value={u.name}>
                            {u.name} (x{u.multiplier})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                )}

                {/* Quantity Selector */}
                <Col sm={medicine.units && medicine.units.length > 0 ? 6 : 12}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-dark mb-2">
                      Quantity:
                    </Form.Label>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="light"
                        className="border border-light-subtle px-3 py-2 fw-bold"
                        onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                        disabled={isOutOfStock || qty <= 1}
                        style={{
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        }}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        className="text-center border-top border-bottom border-light-subtle shadow-none fw-bold bg-white"
                        style={{
                          width: "70px",
                          borderRadius: "0",
                          pointerEvents: "none",
                        }}
                        value={qty}
                        readOnly
                      />
                      <Button
                        variant="light"
                        className="border border-light-subtle px-3 py-2 fw-bold"
                        onClick={() =>
                          setQty(
                            qty < maxAvailableQty ? qty + 1 : maxAvailableQty,
                          )
                        }
                        disabled={isOutOfStock || qty >= maxAvailableQty}
                        style={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              {/* Add to Cart Button */}
              <Button
                className="w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift mb-4 border-0"
                style={{
                  backgroundColor: !isOutOfStock ? "#FFD814" : "#F0F2F2",
                  color: !isOutOfStock ? "#0F1111" : "#888C8C",
                }}
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                {!isOutOfStock ? (
                  <>
                    <ShoppingCart size={20} /> Add to Cart
                  </>
                ) : (
                  "Out of Stock"
                )}
              </Button>

              {/* Description */}
              <div className="mt-auto pt-4 border-top border-light-subtle">
                <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                  <Info size={16} className="text-primary" /> Product
                  Description
                </h6>
                <p className="text-muted small lh-lg mb-0">
                  {medicine.description ||
                    "No specific description provided for this medicine. Please consult a pharmacist for usage instructions."}
                </p>
              </div>

              {/*  AI INSIGHTS WIDGET */}
              <div className="mt-4 p-4 rounded-4 position-relative overflow-hidden ai-gradient-card">
                <div className="position-relative z-2">
                  <h6
                    className="fw-bolder d-flex align-items-center gap-2 mb-3"
                    style={{ color: "#4f46e5" }}
                  >
                    <Sparkles size={18} /> AI Pharmacist Insights
                  </h6>

                  {!aiSummary && !generatingAi && (
                    <div className="text-center py-2">
                      <p className="text-muted small mb-3">
                        Want to know more about {medicine.name}? Ask our AI for
                        a quick, easy-to-understand medical summary.
                      </p>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="rounded-pill px-4 fw-bold border-2 hover-lift"
                        onClick={handleGenerateAI}
                      >
                        Generate Insights
                      </Button>
                    </div>
                  )}

                  {generatingAi && (
                    <div className="d-flex align-items-center gap-3 text-primary py-3">
                      <Spinner animation="grow" size="sm" />
                      <span className="small fw-semibold ai-typing-text">
                        Analyzing medical data...
                      </span>
                    </div>
                  )}

                  {aiSummary && !generatingAi && (
                    <div
                      className="small text-dark"
                      style={{ lineHeight: "1.7", whiteSpace: "pre-line" }}
                    >
                      {aiSummary}
                      <div
                        className="mt-3 pt-2 border-top border-light-subtle text-muted"
                        style={{ fontSize: "0.65rem" }}
                      >
                        <strong>Disclaimer:</strong> This summary is generated
                        by AI and is for informational purposes only. It does
                        not replace professional medical advice.
                      </div>
                    </div>
                  )}
                </div>

                {/* Background decorative elements for the AI card */}
                <div className="position-absolute top-0 end-0 p-3 opacity-10">
                  <Sparkles size={80} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <style>{`
        .mix-blend-multiply { mix-blend-mode: multiply; }
        .hover-underline:hover { text-decoration: underline !important; color: #0f172a !important; }
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1) !important; }
        .spin-animation { animation: spin 1s linear infinite; }
        .tracking-wider { letter-spacing: 0.05em; }
        
        /* AI Card Styling */
        .ai-gradient-card {
          background: linear-gradient(145deg, #eef2ff 0%, #f5f3ff 100%);
          border: 1px solid #e0e7ff;
          box-shadow: inset 0 2px 10px rgba(79, 70, 229, 0.05);
        }
        .ai-typing-text {
          background: linear-gradient(90deg, #4f46e5, #9333ea, #4f46e5);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          animation: shine 2s linear infinite;
        }

        @keyframes shine { to { background-position: 200% center; } }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default MedicineDetails;
