// import React, { useState } from "react";
// import { Form, Button, Container, Card } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { saveShippingAddress } from "../redux/actions/cartActions";
// import CheckoutSteps from "../components/CheckoutSteps"; // You can create a simple breadcrumb component

// const Shipping = () => {
//   const cart = useSelector((state) => state.cart);
//   const { shippingAddress } = cart;

//   const [address, setAddress] = useState(shippingAddress.address || "");
//   const [city, setCity] = useState(shippingAddress.city || "");
//   const [postalCode, setPostalCode] = useState(
//     shippingAddress.postalCode || ""
//   );
//   const [country, setCountry] = useState(shippingAddress.country || "Nepal");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const submitHandler = (e) => {
//     e.preventDefault();
//     dispatch(saveShippingAddress({ address, city, postalCode, country }));
//     navigate("/placeorder"); // Go to next step
//   };

//   return (
//     <Container className="py-5" style={{ maxWidth: "600px" }}>
//       {/* <CheckoutSteps step1 step2 /> */}
//       <Card className="shadow-sm border-0 rounded-4 p-4">
//         <h2 className="mb-4 fw-bold">Shipping Address</h2>
//         <Form onSubmit={submitHandler}>
//           <Form.Group className="mb-3">
//             <Form.Label>Address</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter street address"
//               value={address}
//               required
//               onChange={(e) => setAddress(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>City</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter city"
//               value={city}
//               required
//               onChange={(e) => setCity(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Postal Code</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter postal code"
//               value={postalCode}
//               required
//               onChange={(e) => setPostalCode(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group className="mb-4">
//             <Form.Label>Country</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter country"
//               value={country}
//               required
//               onChange={(e) => setCountry(e.target.value)}
//             />
//           </Form.Group>

//           <Button
//             type="submit"
//             variant="primary"
//             className="w-100 py-3 rounded-pill fw-bold"
//           >
//             Continue to Order Review
//           </Button>
//         </Form>
//       </Card>
//     </Container>
//   );
// };

// export default Shipping;

import React, { useState } from "react";
import { Form, Button, Container, Card, Breadcrumb } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Globe, Signpost, Building, ArrowLeft } from "lucide-react";
import { saveShippingAddress } from "../redux/actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "Nepal");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/placeorder");
  };

  return (
    <Container className="py-5 animate-fade-in" style={{ minHeight: "85vh" }}>
      {/* Navigation Breadcrumbs */}
      <div className="mb-4">
        <Link
          to="/cart"
          className="text-decoration-none text-muted small d-flex align-items-center gap-1 mb-2 hover-primary"
        >
          <ArrowLeft size={14} /> Back to Cart
        </Link>
        <CheckoutSteps step1 step2 />
      </div>

      <div className="d-flex justify-content-center">
        <Card
          className="shadow-lg border-0 rounded-4 overflow-hidden w-100"
          style={{ maxWidth: "600px" }}
        >
          {/* Decorative Top Bar */}
          <div className="bg-primary" style={{ height: "6px" }}></div>

          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-5">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3 text-primary shadow-sm">
                <MapPin size={32} />
              </div>
              <h2 className="fw-bold text-dark">Delivery Address</h2>
              <p className="text-muted small">
                Please provide your precise location for faster delivery
              </p>
            </div>

            <Form onSubmit={submitHandler}>
              {/* Street Address */}
              <Form.Group className="mb-4" controlId="address">
                <Form.Label className="fw-bold small text-muted text-uppercase mb-2">
                  Street Address
                </Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Signpost size={18} className="text-muted" />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Area, Street Name, House No."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border-start-0 shadow-none py-2 px-3"
                    required
                  />
                </div>
              </Form.Group>

              {/* City */}
              <Form.Group className="mb-4" controlId="city">
                <Form.Label className="fw-bold small text-muted text-uppercase mb-2">
                  City / Town
                </Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Building size={18} className="text-muted" />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border-start-0 shadow-none py-2 px-3"
                    required
                  />
                </div>
              </Form.Group>

              <Row className="g-3 mb-5">
                {/* Postal Code */}
                <Col md={6}>
                  <Form.Group controlId="postalCode">
                    <Form.Label className="fw-bold small text-muted text-uppercase mb-2">
                      Postal Code
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. 44600"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="shadow-none py-2 px-3 bg-light border-0"
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Country */}
                <Col md={6}>
                  <Form.Group controlId="country">
                    <Form.Label className="fw-bold small text-muted text-uppercase mb-2">
                      Country
                    </Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 border-0 bg-light">
                        <Globe size={18} className="text-muted" />
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="border-start-0 shadow-none py-2 px-3 bg-light border-0"
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Button
                type="submit"
                variant="primary"
                className="w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: "1.1rem" }}
              >
                Continue to Review Order
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Shipping;
