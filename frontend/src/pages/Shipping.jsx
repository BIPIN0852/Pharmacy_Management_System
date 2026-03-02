// import React, { useState } from "react";
// import { Form, Button, Container, Card, ProgressBar } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { saveShippingAddress } from "../redux/actions/cartActions"; // This import works now

// const Shipping = () => {
//   const cart = useSelector((state) => state.cart);
//   const { shippingAddress } = cart;

//   const [address, setAddress] = useState(shippingAddress.address || "");
//   const [city, setCity] = useState(shippingAddress.city || "");
//   const [postalCode, setPostalCode] = useState(
//     shippingAddress.postalCode || ""
//   );
//   const [phone, setPhone] = useState(shippingAddress.phone || ""); // Added Phone for delivery

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const submitHandler = (e) => {
//     e.preventDefault();
//     dispatch(saveShippingAddress({ address, city, postalCode, phone }));
//     navigate("/payment"); // Proceed to Payment Method
//   };

//   return (
//     <Container className="py-5" style={{ maxWidth: "600px" }}>
//       {/* Progress Bar: Cart -> Shipping(Active) -> Payment -> Order */}
//       <ProgressBar now={50} label="Shipping" className="mb-4" variant="info" />

//       <Card className="shadow-sm border-0 p-4">
//         <h2 className="mb-4 fw-bold text-primary">Shipping Details</h2>
//         <Form onSubmit={submitHandler}>
//           <Form.Group controlId="address" className="mb-3">
//             <Form.Label>Address</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter street address"
//               value={address}
//               required
//               onChange={(e) => setAddress(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group controlId="city" className="mb-3">
//             <Form.Label>City</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter city"
//               value={city}
//               required
//               onChange={(e) => setCity(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group controlId="postalCode" className="mb-3">
//             <Form.Label>Postal Code</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter postal code"
//               value={postalCode}
//               required
//               onChange={(e) => setPostalCode(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group controlId="phone" className="mb-4">
//             <Form.Label>Phone Number</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="For delivery contact"
//               value={phone}
//               required
//               onChange={(e) => setPhone(e.target.value)}
//             />
//           </Form.Group>

//           <Button type="submit" variant="primary" className="w-100 py-2">
//             Continue to Payment
//           </Button>
//         </Form>
//       </Card>
//     </Container>
//   );
// };

// export default Shipping;

// import React, { useState } from "react";
// import {
//   Form,
//   Button,
//   Container,
//   Card,
//   Row,
//   Col,
//   InputGroup,
// } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { saveShippingAddress } from "../redux/actions/cartActions";
// import {
//   MapPin,
//   Building,
//   Phone,
//   Truck,
//   CreditCard,
//   CheckCircle,
//   ChevronRight,
//   Globe,
// } from "lucide-react";

// const Shipping = () => {
//   const cart = useSelector((state) => state.cart);
//   const { shippingAddress } = cart;

//   const [address, setAddress] = useState(shippingAddress.address || "");
//   const [city, setCity] = useState(shippingAddress.city || "");
//   const [postalCode, setPostalCode] = useState(
//     shippingAddress.postalCode || ""
//   );
//   const [phone, setPhone] = useState(shippingAddress.phone || "");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const submitHandler = (e) => {
//     e.preventDefault();
//     dispatch(saveShippingAddress({ address, city, postalCode, phone }));
//     navigate("/payment");
//   };

//   // --- Custom Step Component ---
//   const CheckoutSteps = ({ step1, step2, step3 }) => {
//     return (
//       <div className="d-flex justify-content-center align-items-center mb-5">
//         {/* Step 1: Shipping */}
//         <div className="text-center position-relative">
//           <div
//             className={`rounded-circle d-flex align-items-center justify-content-center mx-auto ${
//               step1 ? "bg-primary text-white" : "bg-light text-muted"
//             }`}
//             style={{ width: "50px", height: "50px", transition: "0.3s" }}
//           >
//             <Truck size={24} />
//           </div>
//           <small
//             className={`fw-bold mt-2 d-block ${
//               step1 ? "text-primary" : "text-muted"
//             }`}
//           >
//             Shipping
//           </small>
//         </div>

//         {/* Connector Line */}
//         <div
//           className={`mx-3 border-top flex-grow-1 ${
//             step2 ? "border-primary" : "border-muted"
//           }`}
//           style={{ width: "60px", borderTopWidth: "2px" }}
//         ></div>

//         {/* Step 2: Payment */}
//         <div className="text-center position-relative">
//           <div
//             className={`rounded-circle d-flex align-items-center justify-content-center mx-auto ${
//               step2 ? "bg-primary text-white" : "bg-light text-muted"
//             }`}
//             style={{ width: "50px", height: "50px", transition: "0.3s" }}
//           >
//             <CreditCard size={24} />
//           </div>
//           <small
//             className={`fw-bold mt-2 d-block ${
//               step2 ? "text-primary" : "text-muted"
//             }`}
//           >
//             Payment
//           </small>
//         </div>

//         {/* Connector Line */}
//         <div
//           className={`mx-3 border-top flex-grow-1 ${
//             step3 ? "border-primary" : "border-muted"
//           }`}
//           style={{ width: "60px", borderTopWidth: "2px" }}
//         ></div>

//         {/* Step 3: Confirm */}
//         <div className="text-center position-relative">
//           <div
//             className={`rounded-circle d-flex align-items-center justify-content-center mx-auto ${
//               step3 ? "bg-primary text-white" : "bg-light text-muted"
//             }`}
//             style={{ width: "50px", height: "50px", transition: "0.3s" }}
//           >
//             <CheckCircle size={24} />
//           </div>
//           <small
//             className={`fw-bold mt-2 d-block ${
//               step3 ? "text-primary" : "text-muted"
//             }`}
//           >
//             Confirm
//           </small>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Container className="py-5 animate-fade-in" style={{ maxWidth: "700px" }}>
//       {/* 1. Checkout Steps Visual */}
//       <CheckoutSteps step1 />

//       <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
//         <div className="bg-primary p-4 text-white text-center position-relative">
//           <div
//             className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-10"
//             style={{
//               backgroundImage:
//                 "radial-gradient(circle, #ffffff 1px, transparent 1px)",
//               backgroundSize: "10px 10px",
//             }}
//           ></div>
//           <h3 className="fw-bold mb-0 position-relative">
//             Where should we deliver?
//           </h3>
//           <p className="mb-0 small opacity-75 position-relative">
//             Please enter your shipping details below.
//           </p>
//         </div>

//         <div className="p-4 p-md-5">
//           <Form onSubmit={submitHandler}>
//             {/* Address */}
//             <Form.Group controlId="address" className="mb-4">
//               <Form.Label className="fw-bold small text-uppercase text-muted">
//                 Street Address
//               </Form.Label>
//               <InputGroup>
//                 <InputGroup.Text className="bg-light border-end-0 text-muted">
//                   <MapPin size={18} />
//                 </InputGroup.Text>
//                 <Form.Control
//                   type="text"
//                   placeholder="e.g. 123 Main Street, Apt 4B"
//                   value={address}
//                   required
//                   className="border-start-0 bg-light py-2"
//                   onChange={(e) => setAddress(e.target.value)}
//                 />
//               </InputGroup>
//             </Form.Group>

//             <Row>
//               <Col md={6}>
//                 {/* City */}
//                 <Form.Group controlId="city" className="mb-4">
//                   <Form.Label className="fw-bold small text-uppercase text-muted">
//                     City
//                   </Form.Label>
//                   <InputGroup>
//                     <InputGroup.Text className="bg-light border-end-0 text-muted">
//                       <Building size={18} />
//                     </InputGroup.Text>
//                     <Form.Control
//                       type="text"
//                       placeholder="City"
//                       value={city}
//                       required
//                       className="border-start-0 bg-light py-2"
//                       onChange={(e) => setCity(e.target.value)}
//                     />
//                   </InputGroup>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 {/* Postal Code */}
//                 <Form.Group controlId="postalCode" className="mb-4">
//                   <Form.Label className="fw-bold small text-uppercase text-muted">
//                     Postal Code
//                   </Form.Label>
//                   <InputGroup>
//                     <InputGroup.Text className="bg-light border-end-0 text-muted">
//                       <Globe size={18} />
//                     </InputGroup.Text>
//                     <Form.Control
//                       type="text"
//                       placeholder="Postal Code"
//                       value={postalCode}
//                       required
//                       className="border-start-0 bg-light py-2"
//                       onChange={(e) => setPostalCode(e.target.value)}
//                     />
//                   </InputGroup>
//                 </Form.Group>
//               </Col>
//             </Row>

//             {/* Phone */}
//             <Form.Group controlId="phone" className="mb-5">
//               <Form.Label className="fw-bold small text-uppercase text-muted">
//                 Phone Number
//               </Form.Label>
//               <InputGroup>
//                 <InputGroup.Text className="bg-light border-end-0 text-muted">
//                   <Phone size={18} />
//                 </InputGroup.Text>
//                 <Form.Control
//                   type="text"
//                   placeholder="For delivery updates"
//                   value={phone}
//                   required
//                   className="border-start-0 bg-light py-2"
//                   onChange={(e) => setPhone(e.target.value)}
//                 />
//               </InputGroup>
//             </Form.Group>

//             {/* Submit Button */}
//             <Button
//               type="submit"
//               variant="primary"
//               size="lg"
//               className="w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center"
//             >
//               Continue to Payment <ChevronRight size={20} className="ms-2" />
//             </Button>
//           </Form>
//         </div>
//       </Card>

//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         .form-control:focus { box-shadow: none; border-color: var(--bs-primary); background-color: #fff !important; }
//         .input-group-text { border-color: #dee2e6; }
//         .form-control:focus + .input-group-text, .input-group:focus-within .input-group-text { border-color: var(--bs-primary); background-color: #fff !important; color: var(--bs-primary) !important; }
//       `}</style>
//     </Container>
//   );
// };

// export default Shipping;

// import React, { useState } from "react";
// import {
//   Form,
//   Button,
//   Container,
//   Card,
//   Row,
//   Col,
//   InputGroup,
// } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { saveShippingAddress } from "../redux/actions/cartActions";
// import {
//   MapPin,
//   Building,
//   Phone,
//   Truck,
//   CreditCard,
//   CheckCircle,
//   ChevronRight,
//   Globe,
//   ArrowLeft, // ✅ Imported ArrowLeft
// } from "lucide-react";

// const Shipping = () => {
//   const cart = useSelector((state) => state.cart);
//   const { shippingAddress } = cart;

//   const [address, setAddress] = useState(shippingAddress.address || "");
//   const [city, setCity] = useState(shippingAddress.city || "");
//   const [postalCode, setPostalCode] = useState(
//     shippingAddress.postalCode || ""
//   );
//   const [phone, setPhone] = useState(shippingAddress.phone || "");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const submitHandler = (e) => {
//     e.preventDefault();
//     dispatch(saveShippingAddress({ address, city, postalCode, phone }));
//     navigate("/payment");
//   };

//   // --- Custom Step Component ---
//   const CheckoutSteps = ({ step1, step2, step3 }) => {
//     return (
//       <div className="d-flex justify-content-center align-items-center mb-5">
//         {/* Step 1: Shipping */}
//         <div className="text-center position-relative">
//           <div
//             className={`rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm ${
//               step1 ? "bg-primary text-white" : "bg-light text-muted"
//             }`}
//             style={{ width: "50px", height: "50px", transition: "0.3s" }}
//           >
//             <Truck size={24} />
//           </div>
//           <small
//             className={`fw-bold mt-2 d-block ${
//               step1 ? "text-primary" : "text-muted"
//             }`}
//           >
//             Shipping
//           </small>
//         </div>

//         {/* Connector Line */}
//         <div
//           className={`mx-3 border-top flex-grow-1 ${
//             step2 ? "border-primary" : "border-muted opacity-25"
//           }`}
//           style={{ width: "60px", borderTopWidth: "3px" }}
//         ></div>

//         {/* Step 2: Payment */}
//         <div className="text-center position-relative">
//           <div
//             className={`rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm ${
//               step2 ? "bg-primary text-white" : "bg-light text-muted"
//             }`}
//             style={{ width: "50px", height: "50px", transition: "0.3s" }}
//           >
//             <CreditCard size={24} />
//           </div>
//           <small
//             className={`fw-bold mt-2 d-block ${
//               step2 ? "text-primary" : "text-muted"
//             }`}
//           >
//             Payment
//           </small>
//         </div>

//         {/* Connector Line */}
//         <div
//           className={`mx-3 border-top flex-grow-1 ${
//             step3 ? "border-primary" : "border-muted opacity-25"
//           }`}
//           style={{ width: "60px", borderTopWidth: "3px" }}
//         ></div>

//         {/* Step 3: Confirm */}
//         <div className="text-center position-relative">
//           <div
//             className={`rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm ${
//               step3 ? "bg-primary text-white" : "bg-light text-muted"
//             }`}
//             style={{ width: "50px", height: "50px", transition: "0.3s" }}
//           >
//             <CheckCircle size={24} />
//           </div>
//           <small
//             className={`fw-bold mt-2 d-block ${
//               step3 ? "text-primary" : "text-muted"
//             }`}
//           >
//             Confirm
//           </small>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Container className="py-5 animate-fade-in" style={{ maxWidth: "700px" }}>
//       {/* 1. Checkout Steps Visual */}
//       <CheckoutSteps step1 />

//       <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
//         {/* 2. Attractive Header Section */}
//         <div className="bg-primary p-4 text-white text-center position-relative overflow-hidden">
//           <div
//             className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-10"
//             style={{
//               backgroundImage:
//                 "radial-gradient(circle, #ffffff 2px, transparent 2px)",
//               backgroundSize: "20px 20px",
//               opacity: 0.1,
//             }}
//           ></div>
//           <h3 className="fw-bold mb-1 position-relative">
//             Where should we deliver?
//           </h3>
//           <p className="mb-0 small opacity-75 position-relative">
//             Enter your shipping details below.
//           </p>
//         </div>

//         <div className="p-4 p-md-5 bg-white">
//           <Form onSubmit={submitHandler}>
//             {/* Address */}
//             <Form.Group controlId="address" className="mb-4">
//               <Form.Label className="fw-bold small text-uppercase text-muted">
//                 Street Address
//               </Form.Label>
//               <InputGroup className="shadow-sm rounded-3 overflow-hidden">
//                 <InputGroup.Text className="bg-light border-0 text-primary ps-3">
//                   <MapPin size={20} />
//                 </InputGroup.Text>
//                 <Form.Control
//                   type="text"
//                   placeholder="e.g. 123 Main Street, Apt 4B"
//                   value={address}
//                   required
//                   className="border-0 bg-light py-3 ps-2"
//                   onChange={(e) => setAddress(e.target.value)}
//                 />
//               </InputGroup>
//             </Form.Group>

//             <Row>
//               <Col md={6}>
//                 {/* City */}
//                 <Form.Group controlId="city" className="mb-4">
//                   <Form.Label className="fw-bold small text-uppercase text-muted">
//                     City
//                   </Form.Label>
//                   <InputGroup className="shadow-sm rounded-3 overflow-hidden">
//                     <InputGroup.Text className="bg-light border-0 text-primary ps-3">
//                       <Building size={20} />
//                     </InputGroup.Text>
//                     <Form.Control
//                       type="text"
//                       placeholder="Kathmandu"
//                       value={city}
//                       required
//                       className="border-0 bg-light py-3 ps-2"
//                       onChange={(e) => setCity(e.target.value)}
//                     />
//                   </InputGroup>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 {/* Postal Code */}
//                 <Form.Group controlId="postalCode" className="mb-4">
//                   <Form.Label className="fw-bold small text-uppercase text-muted">
//                     Postal Code
//                   </Form.Label>
//                   <InputGroup className="shadow-sm rounded-3 overflow-hidden">
//                     <InputGroup.Text className="bg-light border-0 text-primary ps-3">
//                       <Globe size={20} />
//                     </InputGroup.Text>
//                     <Form.Control
//                       type="text"
//                       placeholder="44600"
//                       value={postalCode}
//                       required
//                       className="border-0 bg-light py-3 ps-2"
//                       onChange={(e) => setPostalCode(e.target.value)}
//                     />
//                   </InputGroup>
//                 </Form.Group>
//               </Col>
//             </Row>

//             {/* Phone */}
//             <Form.Group controlId="phone" className="mb-5">
//               <Form.Label className="fw-bold small text-uppercase text-muted">
//                 Phone Number
//               </Form.Label>
//               <InputGroup className="shadow-sm rounded-3 overflow-hidden">
//                 <InputGroup.Text className="bg-light border-0 text-primary ps-3">
//                   <Phone size={20} />
//                 </InputGroup.Text>
//                 <Form.Control
//                   type="text"
//                   placeholder="98XXXXXXXX"
//                   value={phone}
//                   required
//                   className="border-0 bg-light py-3 ps-2"
//                   onChange={(e) => setPhone(e.target.value)}
//                 />
//               </InputGroup>
//             </Form.Group>

//             {/* Action Buttons */}
//             <div className="d-flex gap-3">
//               {/* ✅ BACK BUTTON */}
//               <Button
//                 variant="light"
//                 className="flex-grow-1 py-3 fw-bold text-muted border"
//                 onClick={() => navigate("/cart")}
//               >
//                 <ArrowLeft size={20} className="me-2" /> Back
//               </Button>

//               {/* CONTINUE BUTTON */}
//               <Button
//                 type="submit"
//                 variant="primary"
//                 className="flex-[2] w-100 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center py-3"
//                 style={{ letterSpacing: "0.5px" }}
//               >
//                 Continue <ChevronRight size={20} className="ms-2" />
//               </Button>
//             </div>
//           </Form>
//         </div>
//       </Card>

//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

//         /* Custom Input Focus Styles */
//         .form-control:focus { box-shadow: none; background-color: #fff !important; }
//         .input-group:focus-within { box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25) !important; transition: box-shadow 0.2s; }
//         .input-group:focus-within .input-group-text { background-color: #fff !important; }
//       `}</style>
//     </Container>
//   );
// };

// export default Shipping;

// import React, { useState, useEffect } from "react";
// import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { saveShippingAddress } from "../redux/actions/cartActions"; // Ensure this path is correct
// import CheckoutSteps from "../components/CheckoutSteps";
// import { MapPin, Navigation } from "lucide-react";

// const Shipping = () => {
//   // ✅ FIX 1: Add fallback to prevent crash if state.cart is undefined
//   const cart = useSelector((state) => state.cart || {});
//   const { shippingAddress } = cart;

//   // ✅ FIX 2: Use optional chaining (?.) for initial state
//   const [address, setAddress] = useState(shippingAddress?.address || "");
//   const [city, setCity] = useState(shippingAddress?.city || "");
//   const [postalCode, setPostalCode] = useState(
//     shippingAddress?.postalCode || "",
//   );
//   const [country, setCountry] = useState(shippingAddress?.country || "");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // ✅ FIX 3: Ensure user is logged in
//   const userLogin = useSelector((state) => state.userLogin || {});
//   const { userInfo } = userLogin;

//   useEffect(() => {
//     if (!userInfo) {
//       navigate("/login?redirect=shipping");
//     }
//   }, [userInfo, navigate]);

//   const submitHandler = (e) => {
//     e.preventDefault();

//     // 1. Save data to Redux & LocalStorage
//     dispatch(saveShippingAddress({ address, city, postalCode, country }));

//     // 2. Redirect to Payment
//     navigate("/payment");
//   };

//   return (
//     <Container className="py-5" style={{ minHeight: "80vh" }}>
//       <CheckoutSteps step1 step2 />

//       <Row className="justify-content-center mt-4">
//         <Col md={8} lg={6}>
//           <Card className="shadow-sm border-0 rounded-4">
//             <Card.Header className="bg-white border-bottom p-4">
//               <h4 className="fw-bold mb-0 text-primary d-flex align-items-center">
//                 <MapPin className="me-2" size={24} /> Shipping Address
//               </h4>
//               <p className="text-muted small mb-0 mt-1">
//                 Where should we deliver your order?
//               </p>
//             </Card.Header>
//             <Card.Body className="p-4">
//               <Form onSubmit={submitHandler}>
//                 <Form.Group controlId="address" className="mb-3">
//                   <Form.Label className="fw-bold small">Address</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="e.g. 123 Main St"
//                     value={address}
//                     required
//                     onChange={(e) => setAddress(e.target.value)}
//                   />
//                 </Form.Group>

//                 <Row>
//                   <Col md={6}>
//                     <Form.Group controlId="city" className="mb-3">
//                       <Form.Label className="fw-bold small">City</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="e.g. Kathmandu"
//                         value={city}
//                         required
//                         onChange={(e) => setCity(e.target.value)}
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group controlId="postalCode" className="mb-3">
//                       <Form.Label className="fw-bold small">
//                         Postal Code
//                       </Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="e.g. 44600"
//                         value={postalCode}
//                         required
//                         onChange={(e) => setPostalCode(e.target.value)}
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Form.Group controlId="country" className="mb-4">
//                   <Form.Label className="fw-bold small">Country</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="e.g. Nepal"
//                     value={country}
//                     required
//                     onChange={(e) => setCountry(e.target.value)}
//                   />
//                 </Form.Group>

//                 <Button
//                   type="submit"
//                   variant="primary"
//                   className="w-100 py-3 fw-bold rounded-pill shadow-sm"
//                 >
//                   Confirm and Proceed <Navigation size={18} className="ms-2" />
//                 </Button>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Shipping;

import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../redux/actions/cartActions"; // Ensure this path is correct
import CheckoutSteps from "../components/CheckoutSteps";
import { MapPin, Lock, ArrowLeft } from "lucide-react";

const Shipping = () => {
  // ✅ FIX 1: Add fallback to prevent crash if state.cart is undefined
  const cart = useSelector((state) => state.cart || {});
  const { shippingAddress } = cart;

  // ✅ FIX 2: Use optional chaining (?.) for initial state
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || "",
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ FIX 3: Ensure user is logged in
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
    dispatch(saveShippingAddress({ address, city, postalCode, country }));

    // 2. Redirect to Payment
    navigate("/payment");
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
        {/* ✅ NEW: Back Button */}
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
