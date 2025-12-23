import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  Button,
  Col,
  Row,
  Card,
  Alert,
  Container,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../redux/actions/cartActions";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems, paymentMethod } = cart;

  // Form state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [saveAddress, setSaveAddress] = useState(false);

  // Load saved address from Redux/localStorage
  useEffect(() => {
    if (shippingAddress) {
      setAddress(shippingAddress.address || "");
      setCity(shippingAddress.city || "");
      setPostalCode(shippingAddress.postalCode || "");
      setCountry(shippingAddress.country || "");
      setPhone(shippingAddress.phone || "");
    }
  }, [shippingAddress]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = subtotal > 500 ? 0 : 50;
  const totalPrice = subtotal + tax + shipping;

  const submitHandler = (e) => {
    e.preventDefault();

    const shippingData = {
      address,
      city,
      postalCode,
      country,
      phone,
    };

    dispatch(saveShippingAddress(shippingData));

    if (saveAddress) {
      // Save to user profile (optional)
      localStorage.setItem(
        "defaultShippingAddress",
        JSON.stringify(shippingData)
      );
    }

    navigate("/payment");
  };

  return (
    <Container className="my-5">
      <CheckoutSteps step1 step2 step3={false} step4={false} />

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white p-4">
              <h4 className="mb-0">
                <i className="fas fa-map-marker-alt me-2"></i>
                Shipping Address
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={submitHandler}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Full Address <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="House number, street, landmark"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        as="textarea"
                        rows={2}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Phone Number <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="98XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        City <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Kathmandu"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Postal Code <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="44600"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Country <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="Nepal">Nepal</option>
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Save this address for future orders"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/cart")}
                    className="rounded-pill px-4"
                  >
                    ← Back to Cart
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="rounded-pill px-4 fw-bold"
                    disabled={
                      !address || !city || !postalCode || !country || !phone
                    }
                  >
                    Continue to Payment
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col lg={4}>
          <Card className="shadow-lg sticky-top" style={{ top: "20px" }}>
            <Card.Header className="bg-light border-0">
              <h5 className="mb-0 fw-bold text-primary">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3 small">
                <div className="d-flex justify-content-between mb-2">
                  <span>{cartItems.reduce((a, c) => a + c.qty, 0)} items</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (10%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping</span>
                  <span
                    className={shipping === 0 ? "text-success fw-bold" : ""}
                  >
                    {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between h5 mb-0 fw-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-3">
                <small className="text-success">
                  <i className="fas fa-shipping-fast me-1"></i>
                  {shipping === 0 ? "Free delivery" : "Fast delivery"}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Shipping;
