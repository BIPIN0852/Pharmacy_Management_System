import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Image,
  Card,
  Container,
  Alert,
  Badge,
  Form,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Package,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  FileText,
  Loader2,
  Lock,
} from "lucide-react";
import CheckoutSteps from "../components/CheckoutSteps";
import api from "../services/api";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [prescriptionImage, setPrescriptionImage] = useState("");

  const getCartItems = () => {
    const checkoutData = JSON.parse(
      localStorage.getItem("checkoutData") || "{}",
    );
    let items = checkoutData.cartItems || [];
    return items.filter(
      (item) => (item.product || item.medicine) && item.price !== undefined,
    );
  };

  const getShippingAddress = () => {
    if (cart.shippingAddress && cart.shippingAddress.address) {
      return cart.shippingAddress;
    }
    return JSON.parse(localStorage.getItem("shippingAddress") || "{}");
  };

  const finalCartItems = getCartItems();
  const shippingAddress = getShippingAddress();

  const requiresPrescription = finalCartItems.some(
    (item) => item.prescriptionRequired === true,
  );

  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

  const itemsPrice = addDecimals(
    finalCartItems.reduce(
      (acc, item) => acc + Number(item.price || 0) * Number(item.qty || 1),
      0,
    ),
  );

  const shippingPrice = addDecimals(Number(itemsPrice) > 1000 ? 0 : 50);
  const taxPrice = addDecimals(Number((0.13 * itemsPrice).toFixed(2)));

  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  useEffect(() => {
    if (!shippingAddress || !shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploadingImage(true);
    setError("");

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await api.post("/upload", formData, config);
      setPrescriptionImage(data.imageUrl || data);
      setUploadingImage(false);
    } catch (err) {
      console.error(err);
      setError("Image upload failed. Please try again.");
      setUploadingImage(false);
    }
  };

  // ✅ FIXED: This NO LONGER creates the order! It just passes the data to the Payment page.
  const placeOrderHandler = () => {
    setError("");

    if (requiresPrescription && !prescriptionImage) {
      setError(
        "You must upload a valid prescription for the restricted medicines in your order.",
      );
      return;
    }

    const orderData = {
      orderItems: finalCartItems.map((item) => ({
        name: item.name || "Unknown Item",
        qty: Number(item.qty),
        image: item.image || "",
        price: Number(item.price),
        product: item.product || item.medicine,
        unit: item.unit || "Pack",
        buyingMultiplier: item.buyingMultiplier || 1,
        prescriptionRequired: item.prescriptionRequired || false,
      })),
      shippingAddress: shippingAddress,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      prescriptionImage: requiresPrescription ? prescriptionImage : null,
    };

    // ✅ Pass data cleanly to the next screen. No database hits, no cart clearing.
    navigate("/payment", {
      state: {
        orderData,
        finalCartItems,
        totalPrice,
        itemsPrice,
        shippingPrice,
        taxPrice,
      },
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#f0f2f2",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <Container className="py-4 animate-fade-in">
        <div className="mb-3">
          <Button
            variant="link"
            className="text-decoration-none text-dark p-0 d-flex align-items-center hover-underline"
            style={{ width: "fit-content" }}
            onClick={() => navigate("/shipping")}
          >
            <ArrowLeft size={18} className="me-1" /> Back to Shipping
          </Button>
        </div>

        <div className="mb-4">
          <CheckoutSteps step1 step2 step3 />
        </div>

        <Row className="g-4 mt-2">
          <Col lg={8}>
            <div className="d-flex flex-column gap-3">
              <Card
                className="border-0 shadow-sm rounded-1 border"
                style={{ borderColor: "#D5D9D9" }}
              >
                <Card.Body className="p-4">
                  <h5
                    className="fw-bold mb-3 d-flex align-items-center"
                    style={{ color: "#0F1111" }}
                  >
                    <MapPin
                      className="me-2"
                      style={{ color: "#007185" }}
                      size={20}
                    />
                    Shipping Destination
                  </h5>

                  {shippingAddress.address ? (
                    <div
                      className="bg-light p-3 rounded-1 border"
                      style={{ borderColor: "#D5D9D9" }}
                    >
                      <p className="mb-1 text-dark fw-bold">Address Details</p>
                      <p className="mb-2 small" style={{ color: "#565959" }}>
                        {shippingAddress.address}, {shippingAddress.city}
                        <br />
                        Postal Code: {shippingAddress.postalCode},{" "}
                        {shippingAddress.country}
                      </p>
                      {/* ✅ FIXED: Correctly displaying the Phone Number */}
                      <p className="mb-0 small" style={{ color: "#565959" }}>
                        <strong className="text-dark">Phone:</strong>{" "}
                        {shippingAddress.phoneNumber ||
                          shippingAddress.phone ||
                          "Not Provided"}
                      </p>
                    </div>
                  ) : (
                    <Alert
                      variant="warning"
                      className="mb-0 rounded-1 border-0 shadow-sm"
                    >
                      No shipping address found.{" "}
                      <Link to="/shipping" className="fw-bold">
                        Add Address
                      </Link>
                    </Alert>
                  )}
                </Card.Body>
              </Card>

              {requiresPrescription && (
                <Card
                  className="border-0 shadow-sm rounded-1"
                  style={{ border: "2px solid #e47911 !important" }}
                >
                  <Card.Body className="p-4">
                    <h5
                      className="fw-bold mb-3 d-flex align-items-center"
                      style={{ color: "#0F1111" }}
                    >
                      <FileText
                        className="me-2"
                        style={{ color: "#e47911" }}
                        size={20}
                      />{" "}
                      Prescription Required
                    </h5>
                    <Alert
                      variant="warning"
                      className="small mb-3 d-flex align-items-start gap-2 border-0 rounded-1 shadow-sm"
                      style={{
                        backgroundColor: "#fff9e6",
                        color: "#B12704",
                        borderLeft: "4px solid #B12704 !important",
                      }}
                    >
                      <AlertCircle size={18} className="mt-1 flex-shrink-0" />
                      <div>
                        <strong>Verification Needed.</strong> One or more items
                        requires a valid doctor's prescription. Your order will
                        be manually verified by our pharmacist.
                      </div>
                    </Alert>

                    <Form.Group controlId="prescriptionImage" className="mb-0">
                      <Form.Label
                        className="fw-bold small mb-2"
                        style={{ color: "#0F1111" }}
                      >
                        Upload Prescription Image (JPG/PNG)
                      </Form.Label>
                      <div className="d-flex align-items-center gap-3">
                        <Form.Control
                          type="file"
                          onChange={uploadFileHandler}
                          accept="image/jpeg, image/png, image/jpg"
                          className="shadow-none border-1 amazon-input"
                          style={{ maxWidth: "400px" }}
                        />
                        {uploadingImage && (
                          <Loader2
                            size={24}
                            style={{ color: "#007185" }}
                            className="spin-animation"
                          />
                        )}
                      </div>
                    </Form.Group>

                    {prescriptionImage && (
                      <div
                        className="mt-3 p-2 border rounded-1 bg-light d-inline-block text-center position-relative shadow-sm"
                        style={{ borderColor: "#D5D9D9" }}
                      >
                        <div
                          className="position-absolute top-0 end-0 translate-middle p-1 bg-success border border-light rounded-circle shadow-sm"
                          style={{ backgroundColor: "#067D62 !important" }}
                        >
                          <CheckCircle2 size={14} className="text-white" />
                        </div>
                        <Image
                          src={
                            prescriptionImage.startsWith("http")
                              ? prescriptionImage
                              : `http://localhost:5000${prescriptionImage}`
                          }
                          alt="Prescription"
                          style={{ height: "100px", objectFit: "contain" }}
                          className="rounded-1"
                        />
                        <div
                          className="small fw-bold mt-2"
                          style={{ color: "#067D62" }}
                        >
                          File Attached
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )}

              <Card
                className="border-0 shadow-sm rounded-1 border"
                style={{ borderColor: "#D5D9D9" }}
              >
                <Card.Body className="p-4">
                  <h5
                    className="fw-bold mb-3 d-flex align-items-center"
                    style={{ color: "#0F1111" }}
                  >
                    <Package
                      className="me-2"
                      style={{ color: "#007185" }}
                      size={20}
                    />{" "}
                    Review Items
                  </h5>

                  {finalCartItems.length === 0 ? (
                    <Alert
                      variant="warning"
                      className="border-0 rounded-1 text-center py-4"
                    >
                      Your cart appears empty. Please add items again.
                      <div className="mt-3">
                        <Link
                          to="/medicines"
                          className="btn btn-dark btn-sm rounded-1"
                        >
                          Browse Medicines
                        </Link>
                      </div>
                    </Alert>
                  ) : (
                    <div>
                      {finalCartItems.map((item, index) => (
                        <div
                          key={index}
                          className="py-3"
                          style={{
                            borderBottom:
                              index !== finalCartItems.length - 1
                                ? "1px solid #D5D9D9"
                                : "none",
                          }}
                        >
                          <Row className="align-items-center g-3">
                            <Col xs={3} md={2}>
                              <Image
                                src={
                                  item.image?.startsWith("http")
                                    ? item.image
                                    : `http://localhost:5000${item.image}`
                                }
                                alt={item.name}
                                fluid
                                className="bg-white border rounded-1 shadow-sm"
                                style={{
                                  maxHeight: "70px",
                                  objectFit: "contain",
                                  borderColor: "#D5D9D9",
                                }}
                              />
                            </Col>
                            <Col xs={6} md={6}>
                              <Link
                                to={`/medicine/${item.product || item.medicine}`}
                                className="fw-bold text-decoration-none hover-underline d-block mb-1"
                                style={{
                                  color: "#007185",
                                  fontSize: "0.95rem",
                                }}
                              >
                                {item.name || "Unknown Medicine"}
                              </Link>
                              <div className="d-flex flex-wrap align-items-center gap-2 mt-1">
                                <Badge
                                  className="bg-light text-dark border fw-medium rounded-1"
                                  style={{ borderColor: "#D5D9D9" }}
                                >
                                  {item.unit || "Pack"}
                                </Badge>
                                {item.prescriptionRequired && (
                                  <Badge
                                    className="border fw-medium rounded-1"
                                    style={{
                                      backgroundColor: "#fef0f0",
                                      color: "#B12704",
                                      borderColor: "#f5c6cb",
                                    }}
                                  >
                                    Rx Required
                                  </Badge>
                                )}
                              </div>
                            </Col>
                            <Col xs={3} md={4} className="text-end">
                              <div
                                className="fw-bold"
                                style={{ color: "#B12704", fontSize: "1.1rem" }}
                              >
                                NPR{" "}
                                {(
                                  Number(item.qty) * Number(item.price || 0)
                                ).toFixed(2)}
                              </div>
                              <div
                                className="small fw-medium mt-1"
                                style={{ color: "#565959" }}
                              >
                                {item.qty} @ NPR{" "}
                                {Number(item.price || 0).toFixed(2)}
                              </div>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          </Col>

          <Col lg={4}>
            <Card
              className="border-0 shadow-sm rounded-1 bg-white sticky-top"
              style={{
                top: "20px",
                borderColor: "#D5D9D9",
                border: "1px solid #D5D9D9",
              }}
            >
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4" style={{ color: "#0F1111" }}>
                  Order Summary
                </h5>

                <div
                  className="d-flex justify-content-between mb-2 small fw-medium"
                  style={{ color: "#565959" }}
                >
                  <span>Items ({finalCartItems.length}):</span>
                  <span>NPR {itemsPrice}</span>
                </div>
                <div
                  className="d-flex justify-content-between mb-2 small fw-medium"
                  style={{ color: "#565959" }}
                >
                  <span>Shipping:</span>
                  <span>
                    {Number(shippingPrice) === 0 ? (
                      <span style={{ color: "#067D62" }}>FREE</span>
                    ) : (
                      `NPR ${shippingPrice}`
                    )}
                  </span>
                </div>
                <div
                  className="d-flex justify-content-between mb-3 small fw-medium"
                  style={{ color: "#565959" }}
                >
                  <span>Tax (13%):</span>
                  <span>NPR {taxPrice}</span>
                </div>

                <hr style={{ borderColor: "#D5D9D9" }} />

                <div className="d-flex justify-content-between mb-4 align-items-center">
                  <h5 className="fw-bold mb-0" style={{ color: "#B12704" }}>
                    Order Total:
                  </h5>
                  <h4 className="fw-bold mb-0" style={{ color: "#B12704" }}>
                    NPR {totalPrice}
                  </h4>
                </div>

                {error && (
                  <Alert
                    variant="danger"
                    className="py-2 small mb-3 border-0 rounded-1 d-flex align-items-start gap-2"
                    style={{ backgroundColor: "#fef0f0", color: "#B12704" }}
                  >
                    <AlertCircle size={16} className="mt-1 flex-shrink-0" />
                    <div>{error}</div>
                  </Alert>
                )}

                <Button
                  className="w-100 py-2 fw-medium shadow-sm border-0 d-flex justify-content-center align-items-center gap-2 mb-3"
                  style={{
                    backgroundColor:
                      finalCartItems.length === 0 || loading
                        ? "#F0F2F2"
                        : "#FFD814",
                    color:
                      finalCartItems.length === 0 || loading
                        ? "#888C8C"
                        : "#0F1111",
                    borderRadius: "8px",
                  }}
                  disabled={
                    finalCartItems.length === 0 || loading || uploadingImage
                  }
                  onClick={placeOrderHandler}
                >
                  {loading ? (
                    <>
                      <Loader2 className="spin-animation" size={18} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={16} className="opacity-75" /> Proceed to
                      Payment
                    </>
                  )}
                </Button>

                <div
                  className="p-3 rounded-1 bg-light border text-center"
                  style={{ borderColor: "#D5D9D9" }}
                >
                  <small
                    className="d-flex flex-column align-items-center gap-1"
                    style={{ color: "#565959", lineHeight: "1.3" }}
                  >
                    <CheckCircle2 size={16} style={{ color: "#067D62" }} />
                    Your items are reserved. You will choose a payment method
                    (Khalti / Stripe / COD) in the next step.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <style>{`
          .animate-fade-in { animation: fadeIn 0.4s ease-out; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .spin-animation { animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
          .hover-underline:hover { text-decoration: underline !important; color: #e47911 !important; }
          .amazon-input:focus { border-color: #e47911 !important; box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; outline: none; }
        `}</style>
      </Container>
    </div>
  );
};

export default PlaceOrder;
