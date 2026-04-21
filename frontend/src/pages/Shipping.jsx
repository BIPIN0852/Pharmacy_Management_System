import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../redux/actions/cartActions"; // Ensure this path is correct
import CheckoutSteps from "../components/CheckoutSteps";
import { MapPin, Lock, ArrowLeft, Phone } from "lucide-react";

const Shipping = () => {
  // Add fallback to prevent crash if state.cart is undefined
  const cart = useSelector((state) => state.cart || {});
  const { shippingAddress } = cart;

  //  Use optional chaining (?.) for initial state
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || "",
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress?.phoneNumber || "",
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  Ensure user is logged in
  const userLogin = useSelector((state) => state.userLogin || {});
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=shipping");
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    // 1. Save data to Redux & LocalStorage
    dispatch(
      saveShippingAddress({ address, city, postalCode, country, phoneNumber }),
    );

    // 2. Redirect to Place Order (review step)
    navigate("/placeorder");
  };

  return (
    <div
      style={{
        backgroundColor: "#f0f2f2",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <Container className="py-4">
        {/* Back Button */}
        <div className="mb-3">
          <Button
            variant="link"
            className="text-decoration-none text-dark p-0 d-flex align-items-center"
            style={{ width: "fit-content" }}
            onClick={() => navigate("/cart")}
          >
            <ArrowLeft size={18} className="me-1" /> Return to Cart
          </Button>
        </div>

        {/* Checkout Steps Indicator */}
        <div className="mb-4">
          <CheckoutSteps step1 step2 />
        </div>

        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 rounded-3 shadow-sm">
              <Card.Header className="bg-white border-bottom p-4">
                <h3 className="fw-normal mb-0 d-flex align-items-center">
                  Select a shipping address
                </h3>
                <p className="text-muted small mb-0 mt-1">
                  Please enter your delivery details below.
                </p>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={submitHandler}>
                  <div className="mb-4">
                    <h5
                      className="fw-bold mb-3 d-flex align-items-center"
                      style={{ fontSize: "1rem" }}
                    >
                      <MapPin
                        className="me-2"
                        size={18}
                        style={{ color: "#007185" }}
                      />
                      Add a new address
                    </h5>

                    <Form.Group controlId="country" className="mb-3">
                      <Form.Label className="fw-bold small mb-1">
                        Country/Region
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. Nepal"
                        value={country}
                        required
                        className="p-2 shadow-none border-secondary-subtle"
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="phoneNumber" className="mb-3">
                      <Form.Label className="fw-bold small mb-1 d-flex align-items-center gap-1">
                        Phone Number
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="e.g. 98XXXXXXXX"
                        value={phoneNumber}
                        required
                        className="p-2 shadow-none border-secondary-subtle"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="address" className="mb-3">
                      <Form.Label className="fw-bold small mb-1">
                        Street address
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Street address, P.O. box, company name, c/o"
                        value={address}
                        required
                        className="p-2 shadow-none border-secondary-subtle"
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="city" className="mb-3">
                          <Form.Label className="fw-bold small mb-1">
                            City
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="e.g. Kathmandu"
                            value={city}
                            required
                            className="p-2 shadow-none border-secondary-subtle"
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="postalCode" className="mb-3">
                          <Form.Label className="fw-bold small mb-1">
                            Postal Code
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="e.g. 44600"
                            value={postalCode}
                            required
                            className="p-2 shadow-none border-secondary-subtle"
                            onChange={(e) => setPostalCode(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  <hr className="my-4" />

                  <Button
                    type="submit"
                    variant="warning"
                    className="w-100 py-2 shadow-sm border-0 mb-3"
                    style={{
                      backgroundColor: "#FFD814",
                      borderRadius: "8px",
                      color: "#0F1111",
                      fontWeight: "500",
                    }}
                  >
                    Use this address
                  </Button>

                  <div className="text-center">
                    <small className="text-muted d-flex align-items-center justify-content-center gap-1">
                      <Lock size={12} /> Secure Connection
                    </small>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Shipping;
