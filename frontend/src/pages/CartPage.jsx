// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   ListGroup,
//   Image,
//   Alert,
//   Spinner,
// } from "react-bootstrap";
// import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../services/api"; // Ensure this path matches your API service location

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // --- Financials ---
//   const itemsPrice = cartItems.reduce(
//     (acc, item) => acc + item.price * item.qty,
//     0
//   );
//   const taxPrice = itemsPrice * 0.13; // Example 13% Tax
//   const shippingPrice = itemsPrice > 1000 ? 0 : 50; // Free shipping over 1000
//   const totalPrice = itemsPrice + taxPrice + shippingPrice;

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const { data } = await api.get("/cart");
//       // Safety check: ensure cartItems is an array
//       setCartItems(data.cartItems || []);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load cart. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQty = async (id, newQty, maxStock) => {
//     if (newQty < 1 || newQty > maxStock) return;
//     try {
//       // Optimistic UI Update
//       setCartItems((prev) =>
//         prev.map((item) =>
//           item.medicine === id ? { ...item, qty: newQty } : item
//         )
//       );

//       // Call Backend
//       await api.post("/cart", { medicineId: id, qty: newQty });
//     } catch (err) {
//       alert("Could not update quantity.");
//       fetchCart(); // Revert on error
//     }
//   };

//   const removeItem = async (id) => {
//     try {
//       setCartItems((prev) => prev.filter((item) => item.medicine !== id));
//       await api.delete(`/cart/${id}`);
//     } catch (err) {
//       alert("Failed to remove item");
//       fetchCart();
//     }
//   };

//   const checkoutHandler = () => {
//     localStorage.setItem(
//       "checkoutData",
//       JSON.stringify({ cartItems, totalPrice })
//     );
//     navigate("/shipping"); // Proceed to Shipping
//   };

//   if (loading)
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" />
//       </Container>
//     );

//   return (
//     <Container className="py-4">
//       <h2 className="mb-4 fw-bold text-primary">Shopping Cart</h2>

//       {error && <Alert variant="danger">{error}</Alert>}

//       {cartItems.length === 0 ? (
//         <Alert variant="info" className="text-center py-5">
//           <ShoppingBag size={48} className="mb-3 opacity-50" />
//           <h4>Your cart is empty</h4>
//           <Link to="/medicines" className="btn btn-outline-primary mt-3">
//             Go to Store
//           </Link>
//         </Alert>
//       ) : (
//         <Row>
//           {/* --- Cart Items List --- */}
//           <Col md={8}>
//             <ListGroup
//               variant="flush"
//               className="shadow-sm rounded overflow-hidden"
//             >
//               {cartItems.map((item) => (
//                 <ListGroup.Item key={item.medicine} className="p-3">
//                   <Row className="align-items-center">
//                     <Col md={2}>
//                       <Image
//                         src={
//                           item.image?.startsWith("http")
//                             ? item.image
//                             : `http://localhost:5000${item.image}`
//                         }
//                         alt={item.name}
//                         fluid
//                         rounded
//                         style={{ maxHeight: "80px", objectFit: "contain" }}
//                       />
//                     </Col>
//                     <Col md={4}>
//                       <Link
//                         to={`/medicine/${item.medicine}`}
//                         className="text-decoration-none text-dark fw-bold"
//                       >
//                         {item.name}
//                       </Link>
//                       <div className="text-muted small">
//                         Unit Price: ₹{item.price}
//                       </div>
//                     </Col>
//                     <Col md={3} className="d-flex align-items-center">
//                       <Button
//                         variant="light"
//                         size="sm"
//                         onClick={() =>
//                           updateQty(
//                             item.medicine,
//                             item.qty - 1,
//                             item.countInStock
//                           )
//                         }
//                       >
//                         <Minus size={14} />
//                       </Button>
//                       <span className="mx-3 fw-bold">{item.qty}</span>
//                       <Button
//                         variant="light"
//                         size="sm"
//                         onClick={() =>
//                           updateQty(
//                             item.medicine,
//                             item.qty + 1,
//                             item.countInStock
//                           )
//                         }
//                         disabled={item.qty >= item.countInStock}
//                       >
//                         <Plus size={14} />
//                       </Button>
//                     </Col>
//                     <Col md={2} className="fw-bold text-primary">
//                       ₹{(item.qty * item.price).toFixed(2)}
//                     </Col>
//                     <Col md={1}>
//                       <Button
//                         variant="link"
//                         className="text-danger p-0"
//                         onClick={() => removeItem(item.medicine)}
//                       >
//                         <Trash2 size={18} />
//                       </Button>
//                     </Col>
//                   </Row>
//                 </ListGroup.Item>
//               ))}
//             </ListGroup>
//           </Col>

//           {/* --- Order Summary --- */}
//           <Col md={4}>
//             <Card
//               className="shadow-sm border-0 sticky-top"
//               style={{ top: "20px" }}
//             >
//               <Card.Header className="bg-white fw-bold py-3">
//                 Order Summary
//               </Card.Header>
//               <Card.Body>
//                 <ListGroup variant="flush">
//                   <ListGroup.Item className="d-flex justify-content-between px-0">
//                     <span>Subtotal</span>
//                     <span>₹{itemsPrice.toFixed(2)}</span>
//                   </ListGroup.Item>
//                   <ListGroup.Item className="d-flex justify-content-between px-0">
//                     <span>Tax (13%)</span>
//                     <span>₹{taxPrice.toFixed(2)}</span>
//                   </ListGroup.Item>
//                   <ListGroup.Item className="d-flex justify-content-between px-0">
//                     <span>Delivery</span>
//                     <span>
//                       {shippingPrice === 0 ? (
//                         <span className="text-success">Free</span>
//                       ) : (
//                         `₹${shippingPrice}`
//                       )}
//                     </span>
//                   </ListGroup.Item>
//                   <ListGroup.Item className="d-flex justify-content-between px-0 fw-bold fs-5 border-top pt-3">
//                     <span>Total</span>
//                     <span>₹{totalPrice.toFixed(2)}</span>
//                   </ListGroup.Item>
//                 </ListGroup>

//                 <Button
//                   variant="primary"
//                   className="w-100 mt-4 py-2 d-flex align-items-center justify-content-center"
//                   onClick={checkoutHandler}
//                   disabled={cartItems.length === 0}
//                 >
//                   Proceed to Checkout <ArrowRight size={18} className="ms-2" />
//                 </Button>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}
//     </Container>
//   );
// };

// export default CartPage;

// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   ListGroup,
//   Image,
//   Alert,
//   Spinner,
// } from "react-bootstrap";
// import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../services/api"; // Ensure this path matches your API service location

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   // New: Track which items are currently being updated to show loading spinners on buttons
//   const [updatingItems, setUpdatingItems] = useState({});

//   // --- Financials ---
//   const itemsPrice = cartItems.reduce(
//     (acc, item) => acc + item.price * item.qty,
//     0
//   );
//   const taxPrice = itemsPrice * 0.13; // Example 13% Tax
//   const shippingPrice = itemsPrice > 1000 ? 0 : 50; // Free shipping over 1000
//   const totalPrice = itemsPrice + taxPrice + shippingPrice;

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       setError(""); // Clear any previous errors
//       const { data } = await api.get("/cart");
//       // Safety check: ensure cartItems is an array
//       setCartItems(data.cartItems || []);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load cart. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQty = async (id, newQty, maxStock) => {
//     if (newQty < 1 || newQty > maxStock) return;

//     // Mark this specific item as updating
//     setUpdatingItems((prev) => ({ ...prev, [id]: true }));
//     setError(""); // Clear global errors

//     try {
//       // Optimistic UI Update
//       setCartItems((prev) =>
//         prev.map((item) =>
//           item.medicine === id ? { ...item, qty: newQty } : item
//         )
//       );

//       // Call Backend
//       await api.post("/cart", { medicineId: id, qty: newQty });
//     } catch (err) {
//       console.error("Update quantity error:", err);
//       setError("Could not update quantity. Please try again.");
//       // Revert changes by re-fetching (or you could revert optimistically)
//       fetchCart();
//     } finally {
//       // Remove loading state for this item
//       setUpdatingItems((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   const removeItem = async (id) => {
//     if (!window.confirm("Are you sure you want to remove this item?")) return;

//     // Mark this specific item as updating (for the delete button)
//     setUpdatingItems((prev) => ({ ...prev, [id]: true }));
//     setError("");

//     try {
//       // Optimistic update
//       setCartItems((prev) => prev.filter((item) => item.medicine !== id));

//       await api.delete(`/cart/${id}`);
//     } catch (err) {
//       console.error("Remove item error:", err);
//       setError("Failed to remove item. Please check your connection.");
//       fetchCart(); // Revert on error
//     } finally {
//       setUpdatingItems((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   const checkoutHandler = () => {
//     localStorage.setItem(
//       "checkoutData",
//       JSON.stringify({ cartItems, totalPrice })
//     );
//     navigate("/shipping"); // Proceed to Shipping
//   };

//   if (loading)
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3 text-muted">Loading your cart...</p>
//       </Container>
//     );

//   return (
//     <Container className="py-4">
//       <h2 className="mb-4 fw-bold text-primary">Shopping Cart</h2>

//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError("")}>
//           {error}
//         </Alert>
//       )}

//       {cartItems.length === 0 ? (
//         <Alert variant="info" className="text-center py-5">
//           <ShoppingBag size={48} className="mb-3 opacity-50" />
//           <h4>Your cart is empty</h4>
//           <p className="mb-4">
//             Looks like you haven't added any medicines yet.
//           </p>
//           <Link to="/medicines" className="btn btn-outline-primary">
//             Go to Store
//           </Link>
//         </Alert>
//       ) : (
//         <Row>
//           {/* --- Cart Items List --- */}
//           <Col md={8}>
//             <ListGroup
//               variant="flush"
//               className="shadow-sm rounded overflow-hidden"
//             >
//               {cartItems.map((item) => (
//                 <ListGroup.Item key={item.medicine} className="p-3">
//                   <Row className="align-items-center">
//                     <Col md={2}>
//                       <Image
//                         src={
//                           item.image?.startsWith("http")
//                             ? item.image
//                             : `http://localhost:5000${item.image}`
//                         }
//                         alt={item.name}
//                         fluid
//                         rounded
//                         style={{ maxHeight: "80px", objectFit: "contain" }}
//                       />
//                     </Col>
//                     <Col md={4}>
//                       <Link
//                         to={`/medicine/${item.medicine}`}
//                         className="text-decoration-none text-dark fw-bold"
//                       >
//                         {item.name}
//                       </Link>
//                       <div className="text-muted small">
//                         Unit Price: NPR{item.price}
//                       </div>
//                     </Col>
//                     <Col md={3} className="d-flex align-items-center">
//                       <Button
//                         variant="light"
//                         size="sm"
//                         disabled={updatingItems[item.medicine] || item.qty <= 1}
//                         onClick={() =>
//                           updateQty(
//                             item.medicine,
//                             item.qty - 1,
//                             item.countInStock
//                           )
//                         }
//                       >
//                         <Minus size={14} />
//                       </Button>
//                       <span className="mx-3 fw-bold">
//                         {updatingItems[item.medicine] ? (
//                           <Spinner animation="border" size="sm" />
//                         ) : (
//                           item.qty
//                         )}
//                       </span>
//                       <Button
//                         variant="light"
//                         size="sm"
//                         disabled={
//                           updatingItems[item.medicine] ||
//                           item.qty >= item.countInStock
//                         }
//                         onClick={() =>
//                           updateQty(
//                             item.medicine,
//                             item.qty + 1,
//                             item.countInStock
//                           )
//                         }
//                       >
//                         <Plus size={14} />
//                       </Button>
//                     </Col>
//                     <Col md={2} className="fw-bold text-primary">
//                       NPR{(item.qty * item.price).toFixed(2)}
//                     </Col>
//                     <Col md={1}>
//                       <Button
//                         variant="link"
//                         className="text-danger p-0"
//                         disabled={updatingItems[item.medicine]}
//                         onClick={() => removeItem(item.medicine)}
//                       >
//                         {updatingItems[item.medicine] ? (
//                           <Spinner
//                             animation="border"
//                             size="sm"
//                             variant="danger"
//                           />
//                         ) : (
//                           <Trash2 size={18} />
//                         )}
//                       </Button>
//                     </Col>
//                   </Row>
//                 </ListGroup.Item>
//               ))}
//             </ListGroup>
//           </Col>

//           {/* --- Order Summary --- */}
//           <Col md={4}>
//             <Card
//               className="shadow-sm border-0 sticky-top"
//               style={{ top: "20px" }}
//             >
//               <Card.Header className="bg-white fw-bold py-3">
//                 Order Summary
//               </Card.Header>
//               <Card.Body>
//                 <ListGroup variant="flush">
//                   <ListGroup.Item className="d-flex justify-content-between px-0">
//                     <span>Subtotal</span>
//                     <span>NPR{itemsPrice.toFixed(2)}</span>
//                   </ListGroup.Item>
//                   <ListGroup.Item className="d-flex justify-content-between px-0">
//                     <span>Tax (13%)</span>
//                     <span>NPR{taxPrice.toFixed(2)}</span>
//                   </ListGroup.Item>
//                   <ListGroup.Item className="d-flex justify-content-between px-0">
//                     <span>Delivery</span>
//                     <span>
//                       {shippingPrice === 0 ? (
//                         <span className="text-success">Free</span>
//                       ) : (
//                         `NPR${shippingPrice}`
//                       )}
//                     </span>
//                   </ListGroup.Item>
//                   <ListGroup.Item className="d-flex justify-content-between px-0 fw-bold fs-5 border-top pt-3">
//                     <span>Total</span>
//                     <span>NPR{totalPrice.toFixed(2)}</span>
//                   </ListGroup.Item>
//                 </ListGroup>

//                 <Button
//                   variant="primary"
//                   className="w-100 mt-4 py-2 d-flex align-items-center justify-content-center"
//                   onClick={checkoutHandler}
//                   disabled={cartItems.length === 0}
//                 >
//                   Proceed to Checkout <ArrowRight size={18} className="ms-2" />
//                 </Button>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}
//     </Container>
//   );
// };

// export default CartPage;

import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Minus,
  Plus,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItems, setUpdatingItems] = useState({});

  // --- Financials ---
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const taxPrice = itemsPrice * 0.13; // 13% Tax
  const shippingPrice = itemsPrice > 1000 ? 0 : 50; // Free shipping over 1000
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/cart");
      // Safety Check: Ensure we always work with an array
      if (data && Array.isArray(data.cartItems)) {
        setCartItems(data.cartItems);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (id, newQty, maxStock) => {
    if (newQty < 1 || newQty > maxStock) return;

    setUpdatingItems((prev) => ({ ...prev, [id]: true }));
    setError("");

    try {
      // Optimistic UI Update
      setCartItems((prev) =>
        prev.map((item) =>
          item.medicine === id ? { ...item, qty: newQty } : item
        )
      );
      // Backend Call
      await api.post("/cart", { medicineId: id, qty: newQty });
    } catch (err) {
      console.error("Update error:", err);
      setError("Could not update quantity.");
      fetchCart(); // Revert
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("Remove this item from cart?")) return;

    setUpdatingItems((prev) => ({ ...prev, [id]: true }));
    setError("");

    try {
      setCartItems((prev) => prev.filter((item) => item.medicine !== id));
      await api.delete(`/cart/${id}`);
    } catch (err) {
      console.error("Remove error:", err);
      setError("Failed to remove item.");
      fetchCart();
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  const checkoutHandler = () => {
    localStorage.setItem(
      "checkoutData",
      JSON.stringify({ cartItems, totalPrice })
    );
    navigate("/shipping");
  };

  if (loading)
    return (
      <Container className="py-5 text-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading your cart...</p>
      </Container>
    );

  return (
    <Container className="py-5 animate-fade-in" style={{ minHeight: "85vh" }}>
      {/* Header Section */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold text-dark mb-0">
          Shopping Cart ({cartItems.length})
        </h2>
        <Button
          variant="outline-secondary"
          className="d-none d-md-flex align-items-center rounded-pill px-4"
          onClick={() => navigate("/medicines")}
        >
          <ArrowLeft size={18} className="me-2" /> Continue Shopping
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Card className="border-0 shadow-sm text-center py-5 rounded-4">
          <Card.Body>
            <div className="mb-4 text-muted opacity-25">
              <ShoppingBag size={80} />
            </div>
            <h3 className="fw-bold text-dark">Your cart is empty</h3>
            <p className="text-muted mb-4">
              Looks like you haven't added any medicines yet.
            </p>
            <Button
              variant="primary"
              size="lg"
              className="rounded-pill px-5 shadow-sm"
              onClick={() => navigate("/medicines")}
            >
              Start Shopping
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {/* --- Cart Items --- */}
          <Col lg={8}>
            <div className="d-flex flex-column gap-3">
              {cartItems.map((item) => (
                <Card
                  key={item.medicine}
                  className="border-0 shadow-sm rounded-4 overflow-hidden"
                >
                  <Card.Body className="p-0">
                    <Row className="g-0 align-items-center">
                      {/* Image */}
                      <Col
                        xs={4}
                        md={3}
                        lg={2}
                        className="bg-light p-3 text-center"
                      >
                        <Image
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `http://localhost:5000${item.image}`
                          }
                          alt={item.name}
                          fluid
                          style={{
                            maxHeight: "80px",
                            objectFit: "contain",
                            mixBlendMode: "multiply",
                          }}
                        />
                      </Col>

                      {/* Details */}
                      <Col xs={8} md={5} lg={5} className="p-3">
                        <h6 className="fw-bold text-dark mb-1">
                          <Link
                            to={`/medicine/${item.medicine}`}
                            className="text-decoration-none text-dark"
                          >
                            {item.name}
                          </Link>
                        </h6>
                        <div className="text-muted small mb-2">
                          Unit Price:{" "}
                          <span className="fw-medium">NPR {item.price}</span>
                        </div>
                        {item.qty >= item.countInStock && (
                          <span className="badge bg-warning text-dark small">
                            Max Stock Reached
                          </span>
                        )}
                      </Col>

                      {/* Quantity & Price */}
                      <Col
                        xs={12}
                        md={4}
                        lg={5}
                        className="p-3 border-start-md"
                      >
                        <div className="d-flex align-items-center justify-content-between justify-content-md-end gap-3">
                          {/* Qty Control */}
                          <div
                            className="d-flex align-items-center bg-light rounded-pill px-2 py-1 border"
                            style={{ minWidth: "100px" }}
                          >
                            <Button
                              variant="link"
                              size="sm"
                              className="text-dark p-1"
                              disabled={
                                updatingItems[item.medicine] || item.qty <= 1
                              }
                              onClick={() =>
                                updateQty(
                                  item.medicine,
                                  item.qty - 1,
                                  item.countInStock
                                )
                              }
                            >
                              <Minus size={14} />
                            </Button>
                            <span className="mx-2 fw-bold small">
                              {updatingItems[item.medicine] ? (
                                <Spinner
                                  animation="border"
                                  size="sm"
                                  variant="primary"
                                />
                              ) : (
                                item.qty
                              )}
                            </span>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-dark p-1"
                              disabled={
                                updatingItems[item.medicine] ||
                                item.qty >= item.countInStock
                              }
                              onClick={() =>
                                updateQty(
                                  item.medicine,
                                  item.qty + 1,
                                  item.countInStock
                                )
                              }
                            >
                              <Plus size={14} />
                            </Button>
                          </div>

                          {/* Total & Remove */}
                          <div
                            className="text-end"
                            style={{ minWidth: "80px" }}
                          >
                            <div className="fw-bold text-primary mb-1">
                              NPR {(item.qty * item.price).toFixed(2)}
                            </div>
                            <Button
                              variant="link"
                              className="text-danger p-0 small text-decoration-none"
                              style={{ fontSize: "0.85rem" }}
                              disabled={updatingItems[item.medicine]}
                              onClick={() => removeItem(item.medicine)}
                            >
                              <Trash2 size={14} className="me-1" /> Remove
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Mobile Back Button */}
            <div className="d-md-none mt-3">
              <Button
                variant="light"
                className="w-100 border py-2"
                onClick={() => navigate("/medicines")}
              >
                <ArrowLeft size={16} className="me-2" /> Continue Shopping
              </Button>
            </div>
          </Col>

          {/* --- Summary --- */}
          <Col lg={4}>
            <Card
              className="border-0 shadow-sm rounded-4 sticky-top bg-white"
              style={{ top: "20px" }}
            >
              <Card.Header className="bg-white border-bottom py-3">
                <h5 className="fw-bold mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-medium">NPR {itemsPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tax (13%)</span>
                  <span className="fw-medium">NPR {taxPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Delivery</span>
                  <span className="fw-medium text-success">
                    {shippingPrice === 0 ? "Free" : `NPR ${shippingPrice}`}
                  </span>
                </div>

                <div className="border-top pt-3 mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold h5 mb-0">Total</span>
                    <span className="fw-bold h4 text-primary mb-0">
                      NPR {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 rounded-pill shadow-sm py-3 fw-bold d-flex align-items-center justify-content-center"
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout <ArrowRight size={20} className="ms-2" />
                </Button>

                <div className="mt-4 text-center">
                  <small className="text-muted d-flex align-items-center justify-content-center gap-1">
                    <ShieldCheck size={14} /> Secure Checkout
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .border-start-md { border-left: 0; }
        @media (min-width: 768px) {
          .border-start-md { border-left: 1px solid #dee2e6; }
        }
      `}</style>
    </Container>
  );
};

export default CartPage;
