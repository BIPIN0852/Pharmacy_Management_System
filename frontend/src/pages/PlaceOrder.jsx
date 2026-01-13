// import React, { useEffect } from "react";
// import {
//   Button,
//   Row,
//   Col,
//   ListGroup,
//   Image,
//   Card,
//   Container,
// } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { createOrder } from "../redux/actions/orderActions"; // Needs this action, see below
// import CheckoutSteps from "../components/CheckoutSteps";

// const API_BASE_URL = "http://localhost:5000/api";

// const PlaceOrder = () => {
//   const navigate = useNavigate();
//   const cart = useSelector((state) => state.cart);

//   // Calculations
//   const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
//   cart.itemsPrice = addDecimals(
//     cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
//   );
//   cart.shippingPrice = addDecimals(cart.itemsPrice > 500 ? 0 : 50); // Free ship over Rs. 500
//   cart.taxPrice = addDecimals(Number((0.1 * cart.itemsPrice).toFixed(2))); // 10% tax
//   cart.totalPrice = (
//     Number(cart.itemsPrice) +
//     Number(cart.shippingPrice) +
//     Number(cart.taxPrice)
//   ).toFixed(2);

//   useEffect(() => {
//     if (!cart.shippingAddress.address) navigate("/shipping");
//   }, [cart.shippingAddress, navigate]);

//   const placeOrderHandler = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE_URL}/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           orderItems: cart.cartItems,
//           shippingAddress: cart.shippingAddress,
//           paymentMethod: "Pending", // Will be set in Payment Page
//           itemsPrice: cart.itemsPrice,
//           shippingPrice: cart.shippingPrice,
//           taxPrice: cart.taxPrice,
//           totalPrice: cart.totalPrice,
//         }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         // ✅ CRITICAL: Redirect to Payment Page with the new Order ID
//         navigate(`/payment?orderId=${data._id}&amount=${cart.totalPrice}`);
//       } else {
//         alert("Order Failed: " + data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Error placing order");
//     }
//   };

//   return (
//     <Container className="py-5">
//       {/* <CheckoutSteps step1 step2 step3 /> */}
//       <Row>
//         <Col md={8}>
//           <ListGroup
//             variant="flush"
//             className="shadow-sm rounded-4 overflow-hidden mb-4"
//           >
//             <ListGroup.Item className="p-4">
//               <h4 className="fw-bold">Shipping</h4>
//               <p>
//                 <strong>Address: </strong>
//                 {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
//                 {cart.shippingAddress.postalCode},{" "}
//                 {cart.shippingAddress.country}
//               </p>
//             </ListGroup.Item>

//             <ListGroup.Item className="p-4">
//               <h4 className="fw-bold">Order Items</h4>
//               {cart.cartItems.length === 0 ? (
//                 <p>Your cart is empty</p>
//               ) : (
//                 <ListGroup variant="flush">
//                   {cart.cartItems.map((item, index) => (
//                     <ListGroup.Item key={index} className="px-0">
//                       <Row className="align-items-center">
//                         <Col md={2}>
//                           <Image
//                             src={item.image}
//                             alt={item.name}
//                             fluid
//                             rounded
//                           />
//                         </Col>
//                         <Col>
//                           <Link
//                             to={`/medicine/${item.product}`}
//                             className="fw-bold text-dark text-decoration-none"
//                           >
//                             {item.name}
//                           </Link>
//                         </Col>
//                         <Col md={4} className="text-end">
//                           {item.qty} x Rs.{item.price} ={" "}
//                           <strong>Rs.{item.qty * item.price}</strong>
//                         </Col>
//                       </Row>
//                     </ListGroup.Item>
//                   ))}
//                 </ListGroup>
//               )}
//             </ListGroup.Item>
//           </ListGroup>
//         </Col>

//         <Col md={4}>
//           <Card className="border-0 shadow-sm rounded-4">
//             <Card.Body>
//               <h4 className="fw-bold mb-4">Order Summary</h4>
//               <ListGroup variant="flush">
//                 <ListGroup.Item className="d-flex justify-content-between px-0">
//                   <span>Items</span>
//                   <span>Rs. {cart.itemsPrice}</span>
//                 </ListGroup.Item>
//                 <ListGroup.Item className="d-flex justify-content-between px-0">
//                   <span>Shipping</span>
//                   <span>Rs. {cart.shippingPrice}</span>
//                 </ListGroup.Item>
//                 <ListGroup.Item className="d-flex justify-content-between px-0">
//                   <span>Tax (10%)</span>
//                   <span>Rs. {cart.taxPrice}</span>
//                 </ListGroup.Item>
//                 <ListGroup.Item className="d-flex justify-content-between px-0 border-top pt-3 mt-2">
//                   <h5 className="fw-bold">Total</h5>
//                   <h5 className="fw-bold text-primary">
//                     Rs. {cart.totalPrice}
//                   </h5>
//                 </ListGroup.Item>

//                 <ListGroup.Item className="px-0 pt-4">
//                   <Button
//                     type="button"
//                     className="w-100 btn-primary py-3 rounded-pill fw-bold"
//                     disabled={cart.cartItems.length === 0}
//                     onClick={placeOrderHandler}
//                   >
//                     Confirm & Pay
//                   </Button>
//                 </ListGroup.Item>
//               </ListGroup>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
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
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Package,
  CreditCard,
  ChevronRight,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import CheckoutSteps from "../components/CheckoutSteps";
import api from "../services/api";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Calculations ---
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Free shipping over Rs. 500, else Rs. 50
  const shippingPrice = addDecimals(itemsPrice > 500 ? 0 : 50);

  // Tax (10%)
  const taxPrice = addDecimals(Number((0.1 * itemsPrice).toFixed(2)));

  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress, navigate]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ UPDATED: Payload now includes unit and buyingMultiplier for backend inventory sync
      const orderData = {
        orderItems: cart.cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product,
          unit: item.unit || "Tablet",
          buyingMultiplier: item.buyingMultiplier || 1,
          prescriptionRequired: item.prescriptionRequired || false,
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: "Pending",
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const res = await api.post("/orders", orderData);

      if (res._id || res.data?._id) {
        const orderId = res._id || res.data._id;
        // ✅ Redirect to Payment Page with Order ID
        navigate(`/payment?orderId=${orderId}&amount=${totalPrice}`);
      }
    } catch (err) {
      console.error("Place Order Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to place order. Please check inventory or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 animate-fade-in" style={{ minHeight: "80vh" }}>
      <CheckoutSteps step1 step2 />

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
                <p className="mb-1 text-dark fw-bold">Address:</p>
                <p className="mb-0 text-muted">
                  {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                  <br />
                  Postal Code: {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              </Card.Body>
            </Card>

            {/* Order Items List */}
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Header className="bg-white border-bottom p-4">
                <h5 className="fw-bold mb-0 d-flex align-items-center text-dark">
                  <Package className="me-2 text-primary" size={20} /> Review
                  Items
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                {cart.cartItems.length === 0 ? (
                  <Alert variant="info" className="m-4">
                    Your cart is currently empty.
                  </Alert>
                ) : (
                  <ListGroup variant="flush">
                    {cart.cartItems.map((item, index) => (
                      <ListGroup.Item
                        key={index}
                        className="p-4 border-bottom border-light"
                      >
                        <Row className="align-items-center g-3">
                          <Col xs={3} md={2}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                              className="bg-light p-1 shadow-sm"
                            />
                          </Col>
                          <Col>
                            <Link
                              to={`/medicine/${item.product}`}
                              className="fw-bold text-dark text-decoration-none"
                            >
                              {item.name}
                            </Link>
                            <div className="d-flex align-items-center gap-2 mt-1">
                              <Badge
                                bg="primary-subtle"
                                className="text-primary border border-primary-subtle px-2"
                              >
                                {item.unit}
                              </Badge>
                              {item.prescriptionRequired && (
                                <Badge
                                  bg="danger-subtle"
                                  className="text-danger border border-danger-subtle px-2"
                                >
                                  <ShieldAlert size={12} className="me-1" /> Rx
                                  Required
                                </Badge>
                              )}
                            </div>
                          </Col>
                          <Col md={4} className="text-end">
                            <div className="text-muted small mb-1">
                              {item.qty} x Rs.{item.price}
                            </div>
                            <div className="fw-bold text-primary">
                              Rs.{(item.qty * item.price).toFixed(2)}
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
            className="border-0 shadow-sm rounded-4 sticky-top"
            style={{ top: "20px" }}
          >
            <Card.Header className="bg-white border-bottom p-4">
              <h5 className="fw-bold mb-0 text-dark">Price Details</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Subtotal ({cart.cartItems.length} items)</span>
                <span>Rs. {itemsPrice}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Shipping Fee</span>
                <span>
                  {Number(shippingPrice) === 0 ? (
                    <span className="text-success fw-bold">FREE</span>
                  ) : (
                    `Rs. ${shippingPrice}`
                  )}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Tax (10%)</span>
                <span>Rs. {taxPrice}</span>
              </div>
              <hr className="my-4" />
              <div className="d-flex justify-content-between mb-4">
                <h5 className="fw-bold">Payable Amount</h5>
                <h5 className="fw-bold text-primary">Rs. {totalPrice}</h5>
              </div>

              {error && (
                <Alert variant="danger" className="py-2 small mb-3">
                  <AlertCircle size={14} className="me-2" /> {error}
                </Alert>
              )}

              <Button
                className="w-100 btn-primary rounded-pill py-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
                disabled={cart.cartItems.length === 0 || loading}
                onClick={placeOrderHandler}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <>
                    Confirm Order <ChevronRight size={18} />
                  </>
                )}
              </Button>

              <div className="mt-4 p-3 rounded-3 bg-light border">
                <small className="text-muted d-flex gap-2 mb-0">
                  <ShieldAlert size={20} className="text-info flex-shrink-0" />
                  Your order will be processed after payment confirmation. Rx
                  items require pharmacist verification.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrder;
