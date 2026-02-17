// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Row,
//   Col,
//   ListGroup,
//   Image,
//   Card,
//   Container,
//   Alert,
//   Badge,
//   Spinner
// } from "react-bootstrap";
// import { useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   MapPin,
//   Package,
//   ChevronRight,
//   AlertCircle,
//   CheckCircle2,
//   ShieldAlert,
//   ArrowLeft
// } from "lucide-react";
// import CheckoutSteps from "../components/CheckoutSteps";
// import api from "../services/api";

// const PlaceOrder = () => {
//   const navigate = useNavigate();
//   const cart = useSelector((state) => state.cart);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // ✅ FIX 1: Robust Data Recovery & Sanitization
//   // This filters out "Ghost Items" that have no ID or Price
//   const getCartItems = () => {
//     let items = [];

//     // Priority 1: Redux State
//     if (cart.cartItems && cart.cartItems.length > 0) {
//       items = cart.cartItems;
//     }
//     // Priority 2: Checkout Data (from Cart -> Checkout click)
//     else {
//       const checkoutData = JSON.parse(localStorage.getItem("checkoutData") || "{}");
//       if (checkoutData.cartItems && checkoutData.cartItems.length > 0) {
//         items = checkoutData.cartItems;
//       }
//       // Priority 3: Raw Cart Data
//       else {
//         items = JSON.parse(localStorage.getItem("cartItems") || "[]");
//       }
//     }

//     // FILTER: Remove items that don't have a valid Product ID or Price
//     return items.filter(item => (item.product || item.medicine) && item.price !== undefined);
//   };

//   const getShippingAddress = () => {
//     if (cart.shippingAddress && cart.shippingAddress.address) {
//       return cart.shippingAddress;
//     }
//     return JSON.parse(localStorage.getItem("shippingAddress") || "{}");
//   };

//   const finalCartItems = getCartItems();
//   const shippingAddress = getShippingAddress();

//   // --- Calculations ---
//   const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

//   // ✅ FIX 2: Safe Calculation (Prevents NaN/0.00)
//   // We explicitly convert to Number and default to 0 if missing
//   const itemsPrice = addDecimals(
//     finalCartItems.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.qty || 1)), 0)
//   );

//   const shippingPrice = addDecimals(Number(itemsPrice) > 500 ? 0 : 50);
//   const taxPrice = addDecimals(Number((0.13 * itemsPrice).toFixed(2)));

//   const totalPrice = (
//     Number(itemsPrice) +
//     Number(shippingPrice) +
//     Number(taxPrice)
//   ).toFixed(2);

//   useEffect(() => {
//     if (!shippingAddress || !shippingAddress.address) {
//       navigate("/shipping");
//     }
//   }, [shippingAddress, navigate]);

//   const placeOrderHandler = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const orderData = {
//         orderItems: finalCartItems.map((item) => ({
//           name: item.name || "Unknown Item",
//           qty: Number(item.qty),
//           image: item.image || "",
//           price: Number(item.price),
//           product: item.product || item.medicine,
//           unit: item.unit || "Pack",
//           buyingMultiplier: item.buyingMultiplier || 1,
//           prescriptionRequired: item.prescriptionRequired || false,
//         })),
//         shippingAddress: shippingAddress,
//         paymentMethod: "Pending",
//         itemsPrice,
//         shippingPrice,
//         taxPrice,
//         totalPrice,
//       };

//       const res = await api.post("/orders", orderData);

//       if (res.data?._id || res._id) {
//         const orderId = res.data?._id || res._id;
//         navigate(`/payment?orderId=${orderId}&amount=${totalPrice}`);
//       }
//     } catch (err) {
//       console.error("Place Order Error:", err);
//       setError(
//         err.response?.data?.message ||
//           "Failed to place order. Please check your connection."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="py-5 animate-fade-in" style={{ minHeight: "80vh" }}>
//       <CheckoutSteps step1 step2 step3 />

//       <Row className="g-4 mt-2">
//         <Col lg={8}>
//           <div className="d-flex flex-column gap-4">

//             {/* Shipping Info */}
//             <Card className="border-0 shadow-sm rounded-4">
//               <Card.Header className="bg-white border-bottom p-4">
//                 <h5 className="fw-bold mb-0 d-flex align-items-center text-dark">
//                   <MapPin className="me-2 text-primary" size={20} /> Shipping Destination
//                 </h5>
//               </Card.Header>
//               <Card.Body className="p-4">
//                 {shippingAddress.address ? (
//                     <>
//                         <p className="mb-1 text-dark fw-bold">Address:</p>
//                         <p className="mb-0 text-muted">
//                         {shippingAddress.address}, {shippingAddress.city}
//                         <br />
//                         Postal Code: {shippingAddress.postalCode}, {shippingAddress.country}
//                         </p>
//                         <p className="mt-2 mb-0 text-muted">
//                         <strong>Phone:</strong> {shippingAddress.phone || "N/A"}
//                         </p>
//                     </>
//                 ) : (
//                     <Alert variant="warning" className="mb-0">
//                         No shipping address found. <Link to="/shipping">Add Address</Link>
//                     </Alert>
//                 )}
//               </Card.Body>
//             </Card>

//             {/* Review Items */}
//             <Card className="border-0 shadow-sm rounded-4">
//               <Card.Header className="bg-white border-bottom p-4">
//                 <h5 className="fw-bold mb-0 d-flex align-items-center text-dark">
//                   <Package className="me-2 text-primary" size={20} /> Review Items
//                 </h5>
//               </Card.Header>
//               <Card.Body className="p-0">
//                 {finalCartItems.length === 0 ? (
//                   <div className="text-center p-5">
//                     <Alert variant="warning" className="d-inline-block">
//                       Your cart appears empty or corrupted. Please add items again.
//                     </Alert>
//                     <div className="mt-3">
//                         <Link to="/pharmacy" className="btn btn-outline-primary">Browse Medicines</Link>
//                     </div>
//                   </div>
//                 ) : (
//                   <ListGroup variant="flush">
//                     {finalCartItems.map((item, index) => (
//                       <ListGroup.Item
//                         key={index}
//                         className="p-4 border-bottom border-light"
//                       >
//                         <Row className="align-items-center g-3">
//                           <Col xs={3} md={2}>
//                             <Image
//                               src={item.image || "https://via.placeholder.com/100"}
//                               alt={item.name}
//                               fluid
//                               rounded
//                               className="bg-light p-1 shadow-sm"
//                               style={{ maxHeight: "60px", objectFit: "contain" }}
//                             />
//                           </Col>
//                           <Col>
//                             <Link
//                               to={`/medicine/${item.product || item.medicine}`}
//                               className="fw-bold text-dark text-decoration-none"
//                             >
//                               {item.name || "Unknown Medicine"}
//                             </Link>
//                             <div className="d-flex align-items-center gap-2 mt-1">
//                               <Badge bg="light" text="dark" className="border">
//                                 {item.unit || "Pack"}
//                               </Badge>
//                               {item.prescriptionRequired && (
//                                 <Badge bg="warning" text="dark">
//                                   Rx Required
//                                 </Badge>
//                               )}
//                             </div>
//                           </Col>
//                           <Col md={4} className="text-end">
//                             <div className="text-muted small mb-1">
//                               {item.qty} x NPR {item.price || 0}
//                             </div>
//                             <div className="fw-bold text-primary">
//                               NPR {(Number(item.qty) * Number(item.price || 0)).toFixed(2)}
//                             </div>
//                           </Col>
//                         </Row>
//                       </ListGroup.Item>
//                     ))}
//                   </ListGroup>
//                 )}
//               </Card.Body>
//             </Card>
//           </div>
//         </Col>

//         <Col lg={4}>
//           <Card
//             className="border-0 shadow-sm rounded-4 sticky-top bg-light"
//             style={{ top: "20px" }}
//           >
//             <Card.Header className="bg-transparent border-0 p-4 pb-0">
//               <h5 className="fw-bold mb-0 text-dark">Price Details</h5>
//             </Card.Header>
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between mb-3 text-muted">
//                 <span>Subtotal ({finalCartItems.length} items)</span>
//                 <span>NPR {itemsPrice}</span>
//               </div>
//               <div className="d-flex justify-content-between mb-3 text-muted">
//                 <span>Shipping Fee</span>
//                 <span>
//                   {Number(shippingPrice) === 0 ? (
//                     <span className="text-success fw-bold">FREE</span>
//                   ) : (
//                     `NPR ${shippingPrice}`
//                   )}
//                 </span>
//               </div>
//               <div className="d-flex justify-content-between mb-3 text-muted">
//                 <span>Tax (13%)</span>
//                 <span>NPR {taxPrice}</span>
//               </div>
//               <hr className="my-4" />
//               <div className="d-flex justify-content-between mb-4">
//                 <h5 className="fw-bold">Payable Amount</h5>
//                 <h5 className="fw-bold text-primary">NPR {totalPrice}</h5>
//               </div>

//               {error && (
//                 <Alert variant="danger" className="py-2 small mb-3">
//                   <AlertCircle size={14} className="me-2" /> {error}
//                 </Alert>
//               )}

//               {/* Action Buttons */}
//               <div className="d-flex gap-3">
//                 <Button
//                   variant="light"
//                   className="flex-grow-1 border fw-bold text-muted"
//                   onClick={() => navigate("/shipping")}
//                 >
//                   <ArrowLeft size={18} className="me-1" /> Back
//                 </Button>

//                 <Button
//                   className="btn-primary rounded-3 py-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
//                   style={{ flex: 2 }}
//                   disabled={finalCartItems.length === 0 || loading}
//                   onClick={placeOrderHandler}
//                 >
//                   {loading ? (
//                     <>
//                       <Spinner animation="border" size="sm" className="me-2" />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       Confirm & Proceed <ChevronRight size={18} />
//                     </>
//                   )}
//                 </Button>
//               </div>

//               <div className="mt-4 p-3 rounded-3 bg-white border border-light">
//                 <small className="text-muted d-flex gap-2 mb-0">
//                   <CheckCircle2 size={20} className="text-success flex-shrink-0" />
//                   Your items are reserved. You will choose a payment method (Khalti / Stripe / COD) in the next step.
//                 </small>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//       `}</style>
//     </Container>
//   );
// };

// export default PlaceOrder;

import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
  Alert,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux"; // ✅ Added useDispatch
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Package,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import CheckoutSteps from "../components/CheckoutSteps";
import api from "../services/api";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ Initialize dispatch
  const cart = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ FIX 1: Robust Data Recovery & Sanitization
  // This filters out "Ghost Items" that have no ID or Price
  const getCartItems = () => {
    let items = [];

    // Priority 1: Redux State
    if (cart.cartItems && cart.cartItems.length > 0) {
      items = cart.cartItems;
    }
    // Priority 2: Checkout Data (from Cart -> Checkout click)
    else {
      const checkoutData = JSON.parse(
        localStorage.getItem("checkoutData") || "{}",
      );
      if (checkoutData.cartItems && checkoutData.cartItems.length > 0) {
        items = checkoutData.cartItems;
      }
      // Priority 3: Raw Cart Data
      else {
        items = JSON.parse(localStorage.getItem("cartItems") || "[]");
      }
    }

    // FILTER: Remove items that don't have a valid Product ID or Price
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

  // --- Calculations ---
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

  // ✅ FIX 2: Safe Calculation (Prevents NaN/0.00)
  // We explicitly convert to Number and default to 0 if missing
  const itemsPrice = addDecimals(
    finalCartItems.reduce(
      (acc, item) => acc + Number(item.price || 0) * Number(item.qty || 1),
      0,
    ),
  );

  const shippingPrice = addDecimals(Number(itemsPrice) > 500 ? 0 : 50);
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

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      setError("");

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
        // ✅ FIX 3: Default to a valid method like "Khalti" instead of "Pending"
        // This prevents 400 Bad Request errors on strict backends
        paymentMethod: "Khalti",
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const res = await api.post("/orders", orderData);

      // ✅ FIX 4: Smart ID Finder
      // Safely find the ID whether it's in res.data._id or res.data.order._id
      const data = res.data || res;
      const orderId =
        data._id || data.order?._id || data.createdOrder?._id || data.id;

      if (orderId) {
        // Navigate to payment page with the ID and Amount
        navigate(`/payment?orderId=${orderId}&amount=${totalPrice}`);
      } else {
        throw new Error("Order created but ID was missing from response.");
      }
    } catch (err) {
      console.error("Place Order Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to place order. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 animate-fade-in" style={{ minHeight: "80vh" }}>
      <CheckoutSteps step1 step2 step3 />

      <Row className="g-4 mt-2">
        <Col lg={8}>
          <div className="d-flex flex-column gap-4">
            {/* Shipping Info */}
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Header className="bg-white border-bottom p-4">
                <h5 className="fw-bold mb-0 d-flex align-items-center text-dark">
                  <MapPin className="me-2 text-primary" size={20} /> Shipping
                  Destination
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                {shippingAddress.address ? (
                  <>
                    <p className="mb-1 text-dark fw-bold">Address:</p>
                    <p className="mb-0 text-muted">
                      {shippingAddress.address}, {shippingAddress.city}
                      <br />
                      Postal Code: {shippingAddress.postalCode},{" "}
                      {shippingAddress.country}
                    </p>
                    <p className="mt-2 mb-0 text-muted">
                      <strong>Phone:</strong> {shippingAddress.phone || "N/A"}
                    </p>
                  </>
                ) : (
                  <Alert variant="warning" className="mb-0">
                    No shipping address found.{" "}
                    <Link to="/shipping">Add Address</Link>
                  </Alert>
                )}
              </Card.Body>
            </Card>

            {/* Review Items */}
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Header className="bg-white border-bottom p-4">
                <h5 className="fw-bold mb-0 d-flex align-items-center text-dark">
                  <Package className="me-2 text-primary" size={20} /> Review
                  Items
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                {finalCartItems.length === 0 ? (
                  <div className="text-center p-5">
                    <Alert variant="warning" className="d-inline-block">
                      Your cart appears empty or corrupted. Please add items
                      again.
                    </Alert>
                    <div className="mt-3">
                      <Link to="/pharmacy" className="btn btn-outline-primary">
                        Browse Medicines
                      </Link>
                    </div>
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {finalCartItems.map((item, index) => (
                      <ListGroup.Item
                        key={index}
                        className="p-4 border-bottom border-light"
                      >
                        <Row className="align-items-center g-3">
                          <Col xs={3} md={2}>
                            <Image
                              src={
                                item.image || "https://via.placeholder.com/100"
                              }
                              alt={item.name}
                              fluid
                              rounded
                              className="bg-light p-1 shadow-sm"
                              style={{
                                maxHeight: "60px",
                                objectFit: "contain",
                              }}
                            />
                          </Col>
                          <Col>
                            <Link
                              to={`/medicine/${item.product || item.medicine}`}
                              className="fw-bold text-dark text-decoration-none"
                            >
                              {item.name || "Unknown Medicine"}
                            </Link>
                            <div className="d-flex align-items-center gap-2 mt-1">
                              <Badge bg="light" text="dark" className="border">
                                {item.unit || "Pack"}
                              </Badge>
                              {item.prescriptionRequired && (
                                <Badge bg="warning" text="dark">
                                  Rx Required
                                </Badge>
                              )}
                            </div>
                          </Col>
                          <Col md={4} className="text-end">
                            <div className="text-muted small mb-1">
                              {item.qty} x NPR {item.price || 0}
                            </div>
                            <div className="fw-bold text-primary">
                              NPR{" "}
                              {(
                                Number(item.qty) * Number(item.price || 0)
                              ).toFixed(2)}
                            </div>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </div>
        </Col>

        <Col lg={4}>
          <Card
            className="border-0 shadow-sm rounded-4 sticky-top bg-light"
            style={{ top: "20px" }}
          >
            <Card.Header className="bg-transparent border-0 p-4 pb-0">
              <h5 className="fw-bold mb-0 text-dark">Price Details</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Subtotal ({finalCartItems.length} items)</span>
                <span>NPR {itemsPrice}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Shipping Fee</span>
                <span>
                  {Number(shippingPrice) === 0 ? (
                    <span className="text-success fw-bold">FREE</span>
                  ) : (
                    `NPR ${shippingPrice}`
                  )}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Tax (13%)</span>
                <span>NPR {taxPrice}</span>
              </div>
              <hr className="my-4" />
              <div className="d-flex justify-content-between mb-4">
                <h5 className="fw-bold">Payable Amount</h5>
                <h5 className="fw-bold text-primary">NPR {totalPrice}</h5>
              </div>

              {error && (
                <Alert variant="danger" className="py-2 small mb-3">
                  <AlertCircle size={14} className="me-2" /> {error}
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="d-flex gap-3">
                <Button
                  variant="light"
                  className="flex-grow-1 border fw-bold text-muted"
                  onClick={() => navigate("/shipping")}
                >
                  <ArrowLeft size={18} className="me-1" /> Back
                </Button>

                <Button
                  className="btn-primary rounded-3 py-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
                  style={{ flex: 2 }}
                  disabled={finalCartItems.length === 0 || loading}
                  onClick={placeOrderHandler}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm & Proceed <ChevronRight size={18} />
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-4 p-3 rounded-3 bg-white border border-light">
                <small className="text-muted d-flex gap-2 mb-0">
                  <CheckCircle2
                    size={20}
                    className="text-success flex-shrink-0"
                  />
                  Your items are reserved. You will choose a payment method
                  (Khalti / Stripe / COD) in the next step.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </Container>
  );
};

export default PlaceOrder;
