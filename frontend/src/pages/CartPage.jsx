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

// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Image,
//   Alert,
//   Spinner,
// } from "react-bootstrap";
// import {
//   Trash2,
//   ShoppingBag,
//   ArrowRight,
//   Minus,
//   Plus,
//   ArrowLeft,
//   ShieldCheck,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../services/api";

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [updatingItems, setUpdatingItems] = useState({});

//   // --- Financials ---
//   const itemsPrice = cartItems.reduce(
//     (acc, item) => acc + item.price * item.qty,
//     0
//   );
//   const taxPrice = itemsPrice * 0.13; // 13% Tax
//   const shippingPrice = itemsPrice > 1000 ? 0 : 50; // Free shipping over 1000
//   const totalPrice = itemsPrice + taxPrice + shippingPrice;

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const { data } = await api.get("/cart");
//       // Safety Check: Ensure we always work with an array
//       if (data && Array.isArray(data.cartItems)) {
//         setCartItems(data.cartItems);
//       } else {
//         setCartItems([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load cart. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQty = async (id, newQty, maxStock) => {
//     if (newQty < 1 || newQty > maxStock) return;

//     setUpdatingItems((prev) => ({ ...prev, [id]: true }));
//     setError("");

//     try {
//       // Optimistic UI Update
//       setCartItems((prev) =>
//         prev.map((item) =>
//           item.medicine === id ? { ...item, qty: newQty } : item
//         )
//       );
//       // Backend Call
//       await api.post("/cart", { medicineId: id, qty: newQty });
//     } catch (err) {
//       console.error("Update error:", err);
//       setError("Could not update quantity.");
//       fetchCart(); // Revert
//     } finally {
//       setUpdatingItems((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   const removeItem = async (id) => {
//     if (!window.confirm("Remove this item from cart?")) return;

//     setUpdatingItems((prev) => ({ ...prev, [id]: true }));
//     setError("");

//     try {
//       setCartItems((prev) => prev.filter((item) => item.medicine !== id));
//       await api.delete(`/cart/${id}`);
//     } catch (err) {
//       console.error("Remove error:", err);
//       setError("Failed to remove item.");
//       fetchCart();
//     } finally {
//       setUpdatingItems((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   const checkoutHandler = () => {
//     localStorage.setItem(
//       "checkoutData",
//       JSON.stringify({ cartItems, totalPrice })
//     );
//     navigate("/shipping");
//   };

//   if (loading)
//     return (
//       <Container className="py-5 text-center" style={{ minHeight: "60vh" }}>
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3 text-muted">Loading your cart...</p>
//       </Container>
//     );

//   return (
//     <Container className="py-5 animate-fade-in" style={{ minHeight: "85vh" }}>
//       {/* Header Section */}
//       <div className="d-flex align-items-center justify-content-between mb-4">
//         <h2 className="fw-bold text-dark mb-0">
//           Shopping Cart ({cartItems.length})
//         </h2>
//         <Button
//           variant="outline-secondary"
//           className="d-none d-md-flex align-items-center rounded-pill px-4"
//           onClick={() => navigate("/medicines")}
//         >
//           <ArrowLeft size={18} className="me-2" /> Continue Shopping
//         </Button>
//       </div>

//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError("")}>
//           {error}
//         </Alert>
//       )}

//       {cartItems.length === 0 ? (
//         <Card className="border-0 shadow-sm text-center py-5 rounded-4">
//           <Card.Body>
//             <div className="mb-4 text-muted opacity-25">
//               <ShoppingBag size={80} />
//             </div>
//             <h3 className="fw-bold text-dark">Your cart is empty</h3>
//             <p className="text-muted mb-4">
//               Looks like you haven't added any medicines yet.
//             </p>
//             <Button
//               variant="primary"
//               size="lg"
//               className="rounded-pill px-5 shadow-sm"
//               onClick={() => navigate("/medicines")}
//             >
//               Start Shopping
//             </Button>
//           </Card.Body>
//         </Card>
//       ) : (
//         <Row className="g-4">
//           {/* --- Cart Items --- */}
//           <Col lg={8}>
//             <div className="d-flex flex-column gap-3">
//               {cartItems.map((item) => (
//                 <Card
//                   key={item.medicine}
//                   className="border-0 shadow-sm rounded-4 overflow-hidden"
//                 >
//                   <Card.Body className="p-0">
//                     <Row className="g-0 align-items-center">
//                       {/* Image */}
//                       <Col
//                         xs={4}
//                         md={3}
//                         lg={2}
//                         className="bg-light p-3 text-center"
//                       >
//                         <Image
//                           src={
//                             item.image?.startsWith("http")
//                               ? item.image
//                               : `http://localhost:5000${item.image}`
//                           }
//                           alt={item.name}
//                           fluid
//                           style={{
//                             maxHeight: "80px",
//                             objectFit: "contain",
//                             mixBlendMode: "multiply",
//                           }}
//                         />
//                       </Col>

//                       {/* Details */}
//                       <Col xs={8} md={5} lg={5} className="p-3">
//                         <h6 className="fw-bold text-dark mb-1">
//                           <Link
//                             to={`/medicine/${item.medicine}`}
//                             className="text-decoration-none text-dark"
//                           >
//                             {item.name}
//                           </Link>
//                         </h6>
//                         <div className="text-muted small mb-2">
//                           Unit Price:{" "}
//                           <span className="fw-medium">NPR {item.price}</span>
//                         </div>
//                         {item.qty >= item.countInStock && (
//                           <span className="badge bg-warning text-dark small">
//                             Max Stock Reached
//                           </span>
//                         )}
//                       </Col>

//                       {/* Quantity & Price */}
//                       <Col
//                         xs={12}
//                         md={4}
//                         lg={5}
//                         className="p-3 border-start-md"
//                       >
//                         <div className="d-flex align-items-center justify-content-between justify-content-md-end gap-3">
//                           {/* Qty Control */}
//                           <div
//                             className="d-flex align-items-center bg-light rounded-pill px-2 py-1 border"
//                             style={{ minWidth: "100px" }}
//                           >
//                             <Button
//                               variant="link"
//                               size="sm"
//                               className="text-dark p-1"
//                               disabled={
//                                 updatingItems[item.medicine] || item.qty <= 1
//                               }
//                               onClick={() =>
//                                 updateQty(
//                                   item.medicine,
//                                   item.qty - 1,
//                                   item.countInStock
//                                 )
//                               }
//                             >
//                               <Minus size={14} />
//                             </Button>
//                             <span className="mx-2 fw-bold small">
//                               {updatingItems[item.medicine] ? (
//                                 <Spinner
//                                   animation="border"
//                                   size="sm"
//                                   variant="primary"
//                                 />
//                               ) : (
//                                 item.qty
//                               )}
//                             </span>
//                             <Button
//                               variant="link"
//                               size="sm"
//                               className="text-dark p-1"
//                               disabled={
//                                 updatingItems[item.medicine] ||
//                                 item.qty >= item.countInStock
//                               }
//                               onClick={() =>
//                                 updateQty(
//                                   item.medicine,
//                                   item.qty + 1,
//                                   item.countInStock
//                                 )
//                               }
//                             >
//                               <Plus size={14} />
//                             </Button>
//                           </div>

//                           {/* Total & Remove */}
//                           <div
//                             className="text-end"
//                             style={{ minWidth: "80px" }}
//                           >
//                             <div className="fw-bold text-primary mb-1">
//                               NPR {(item.qty * item.price).toFixed(2)}
//                             </div>
//                             <Button
//                               variant="link"
//                               className="text-danger p-0 small text-decoration-none"
//                               style={{ fontSize: "0.85rem" }}
//                               disabled={updatingItems[item.medicine]}
//                               onClick={() => removeItem(item.medicine)}
//                             >
//                               <Trash2 size={14} className="me-1" /> Remove
//                             </Button>
//                           </div>
//                         </div>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               ))}
//             </div>

//             {/* Mobile Back Button */}
//             <div className="d-md-none mt-3">
//               <Button
//                 variant="light"
//                 className="w-100 border py-2"
//                 onClick={() => navigate("/medicines")}
//               >
//                 <ArrowLeft size={16} className="me-2" /> Continue Shopping
//               </Button>
//             </div>
//           </Col>

//           {/* --- Summary --- */}
//           <Col lg={4}>
//             <Card
//               className="border-0 shadow-sm rounded-4 sticky-top bg-white"
//               style={{ top: "20px" }}
//             >
//               <Card.Header className="bg-white border-bottom py-3">
//                 <h5 className="fw-bold mb-0">Order Summary</h5>
//               </Card.Header>
//               <Card.Body className="p-4">
//                 <div className="d-flex justify-content-between mb-2">
//                   <span className="text-muted">Subtotal</span>
//                   <span className="fw-medium">NPR {itemsPrice.toFixed(2)}</span>
//                 </div>
//                 <div className="d-flex justify-content-between mb-2">
//                   <span className="text-muted">Tax (13%)</span>
//                   <span className="fw-medium">NPR {taxPrice.toFixed(2)}</span>
//                 </div>
//                 <div className="d-flex justify-content-between mb-3">
//                   <span className="text-muted">Delivery</span>
//                   <span className="fw-medium text-success">
//                     {shippingPrice === 0 ? "Free" : `NPR ${shippingPrice}`}
//                   </span>
//                 </div>

//                 <div className="border-top pt-3 mb-4">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <span className="fw-bold h5 mb-0">Total</span>
//                     <span className="fw-bold h4 text-primary mb-0">
//                       NPR {totalPrice.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>

//                 <Button
//                   variant="primary"
//                   size="lg"
//                   className="w-100 rounded-pill shadow-sm py-3 fw-bold d-flex align-items-center justify-content-center"
//                   onClick={checkoutHandler}
//                 >
//                   Proceed to Checkout <ArrowRight size={20} className="ms-2" />
//                 </Button>

//                 <div className="mt-4 text-center">
//                   <small className="text-muted d-flex align-items-center justify-content-center gap-1">
//                     <ShieldCheck size={14} /> Secure Checkout
//                   </small>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}

//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.4s ease-in-out; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         .border-start-md { border-left: 0; }
//         @media (min-width: 768px) {
//           .border-start-md { border-left: 1px solid #dee2e6; }
//         }
//       `}</style>
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
//   Image,
//   Alert,
//   Spinner,
//   Form,
// } from "react-bootstrap";
// import {
//   Trash2,
//   ShoppingBag,
//   ArrowRight,
//   ArrowLeft,
//   ShieldCheck,
//   CheckCircle,
//   Info,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../services/api";

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [updatingItems, setUpdatingItems] = useState({});

//   // --- Financials ---
//   const itemsPrice = cartItems.reduce(
//     (acc, item) => acc + item.price * item.qty,
//     0,
//   );
//   const taxPrice = itemsPrice * 0.13;
//   const shippingPrice = itemsPrice > 1000 ? 0 : 50;
//   const totalPrice = itemsPrice + taxPrice + shippingPrice;

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const { data } = await api.get("/cart");
//       if (data && Array.isArray(data.cartItems)) {
//         setCartItems(data.cartItems);
//       } else {
//         setCartItems([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load cart. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQty = async (id, newQty, maxStock) => {
//     if (newQty < 1 || newQty > maxStock) return;
//     setUpdatingItems((prev) => ({ ...prev, [id]: true }));
//     try {
//       setCartItems((prev) =>
//         prev.map((item) =>
//           item.medicine === id ? { ...item, qty: parseInt(newQty) } : item,
//         ),
//       );
//       await api.post("/cart", { medicineId: id, qty: parseInt(newQty) });
//     } catch (err) {
//       setError("Could not update quantity.");
//       fetchCart();
//     } finally {
//       setUpdatingItems((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   const removeItem = async (id) => {
//     setUpdatingItems((prev) => ({ ...prev, [id]: true }));
//     try {
//       setCartItems((prev) => prev.filter((item) => item.medicine !== id));
//       await api.delete(`/cart/${id}`);
//     } catch (err) {
//       setError("Failed to remove item.");
//       fetchCart();
//     } finally {
//       setUpdatingItems((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   const checkoutHandler = () => {
//     localStorage.setItem(
//       "checkoutData",
//       JSON.stringify({ cartItems, totalPrice }),
//     );
//     navigate("/shipping");
//   };

//   if (loading)
//     return (
//       <Container className="py-5 text-center" style={{ minHeight: "60vh" }}>
//         <Spinner animation="border" variant="warning" />
//         {/* Removed Amazon text here */}
//         <p className="mt-3 text-muted">Loading your cart...</p>
//       </Container>
//     );

//   return (
//     <div
//       style={{
//         backgroundColor: "#f0f2f2",
//         minHeight: "100vh",
//         paddingBottom: "50px",
//       }}
//     >
//       <Container className="py-4">
//         {/* ✅ NEW: Back Button added at the top */}
//         <div className="mb-3">
//           <Button
//             variant="link"
//             className="text-decoration-none text-dark p-0 d-flex align-items-center"
//             style={{ width: "fit-content" }}
//             onClick={() => navigate(-1)}
//           >
//             <ArrowLeft size={18} className="me-1" /> Back
//           </Button>
//         </div>

//         {cartItems.length > 0 && (
//           <Row className="mb-3">
//             <Col lg={8}>
//               <Card className="border-0 rounded-3 shadow-sm mb-3">
//                 <Card.Body className="p-4">
//                   <h3 className="fw-normal mb-0">Shopping Cart</h3>
//                   <div className="text-muted small">Select all items</div>
//                   <hr />
//                   {error && <Alert variant="danger">{error}</Alert>}

//                   {cartItems.map((item) => (
//                     <div
//                       key={item.medicine}
//                       className="mb-4 pb-4 border-bottom"
//                     >
//                       <Row className="align-items-start">
//                         <Col xs={4} md={3} lg={2}>
//                           <Image
//                             src={
//                               item.image?.startsWith("http")
//                                 ? item.image
//                                 : `http://localhost:5000${item.image}`
//                             }
//                             alt={item.name}
//                             fluid
//                             className="rounded"
//                             style={{ maxHeight: "120px", objectFit: "contain" }}
//                           />
//                         </Col>
//                         <Col xs={8} md={9} lg={10}>
//                           <div className="d-flex justify-content-between align-items-start">
//                             <div>
//                               <h5
//                                 className="mb-1 text-truncate"
//                                 style={{ color: "#007185", maxWidth: "400px" }}
//                               >
//                                 <Link
//                                   to={`/medicine/${item.medicine}`}
//                                   className="text-decoration-none"
//                                   style={{ color: "inherit" }}
//                                 >
//                                   {item.name}
//                                 </Link>
//                               </h5>
//                               <div className="text-success small fw-bold mb-1">
//                                 In Stock
//                               </div>
//                               <div className="text-muted small mb-2">
//                                 Eligible for FREE Shipping
//                               </div>

//                               <div className="d-flex align-items-center gap-3">
//                                 {/* Amazon Style Qty Selector */}
//                                 <div
//                                   className="d-flex align-items-center bg-white border rounded shadow-sm px-2 py-1"
//                                   style={{
//                                     height: "32px",
//                                     backgroundColor: "#F0F2F2",
//                                   }}
//                                 >
//                                   <span className="small me-2">Qty:</span>
//                                   <Form.Select
//                                     size="sm"
//                                     className="border-0 bg-transparent p-0"
//                                     style={{
//                                       width: "50px",
//                                       fontSize: "0.85rem",
//                                       boxShadow: "none",
//                                     }}
//                                     value={item.qty}
//                                     onChange={(e) =>
//                                       updateQty(
//                                         item.medicine,
//                                         e.target.value,
//                                         item.countInStock,
//                                       )
//                                     }
//                                     disabled={updatingItems[item.medicine]}
//                                   >
//                                     {[
//                                       ...Array(
//                                         Math.min(item.countInStock, 10),
//                                       ).keys(),
//                                     ].map((x) => (
//                                       <option key={x + 1} value={x + 1}>
//                                         {x + 1}
//                                       </option>
//                                     ))}
//                                   </Form.Select>
//                                 </div>

//                                 <div
//                                   className="vr"
//                                   style={{ height: "18px" }}
//                                 ></div>

//                                 <Button
//                                   variant="link"
//                                   className="p-0 text-decoration-none small"
//                                   style={{ color: "#007185" }}
//                                   onClick={() => removeItem(item.medicine)}
//                                 >
//                                   Delete
//                                 </Button>
//                               </div>
//                             </div>
//                             <div className="text-end">
//                               <h5 className="fw-bold">
//                                 NPR {item.price.toFixed(2)}
//                               </h5>
//                             </div>
//                           </div>
//                         </Col>
//                       </Row>
//                     </div>
//                   ))}

//                   <div className="text-end mt-2">
//                     <h5 className="fw-normal">
//                       Subtotal ({cartItems.length} items):{" "}
//                       <span className="fw-bold">
//                         NPR {itemsPrice.toFixed(2)}
//                       </span>
//                     </h5>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>

//             <Col lg={4}>
//               {/* Order Summary Sidebar */}
//               <Card className="border-0 rounded-3 shadow-sm mb-3">
//                 <Card.Body className="p-4">
//                   {shippingPrice === 0 ? (
//                     <div className="d-flex align-items-start gap-2 mb-3 text-success">
//                       <CheckCircle size={20} className="mt-1" />
//                       <div>
//                         <div className="small fw-bold">
//                           Your order qualifies for FREE Shipping.
//                         </div>
//                         <div className="text-muted small">
//                           Choose this option at checkout.
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="d-flex align-items-start gap-2 mb-3 text-info">
//                       <Info size={20} className="mt-1" />
//                       <div className="small">
//                         Add <b>NPR {1000 - itemsPrice}</b> of eligible items to
//                         get <b>FREE Shipping</b>.
//                       </div>
//                     </div>
//                   )}

//                   <h4 className="fw-normal mb-3">
//                     Subtotal ({cartItems.length} items):{" "}
//                     <span className="fw-bold">NPR {totalPrice.toFixed(2)}</span>
//                   </h4>

//                   <Button
//                     variant="warning"
//                     className="w-100 py-2 mb-3 shadow-sm border-0"
//                     style={{
//                       backgroundColor: "#FFD814",
//                       borderRadius: "8px",
//                       color: "#0F1111",
//                       fontWeight: "500",
//                     }}
//                     onClick={checkoutHandler}
//                   >
//                     Proceed to Checkout
//                   </Button>

//                   <div className="border rounded p-3 bg-light">
//                     <div className="d-flex justify-content-between small mb-1">
//                       <span>Items ({cartItems.length}):</span>
//                       <span>NPR {itemsPrice.toFixed(2)}</span>
//                     </div>
//                     <div className="d-flex justify-content-between small mb-1">
//                       <span>Shipping:</span>
//                       <span>
//                         {shippingPrice === 0
//                           ? "FREE"
//                           : `NPR ${shippingPrice.toFixed(2)}`}
//                       </span>
//                     </div>
//                     <div className="d-flex justify-content-between small mb-2">
//                       <span>Tax (13%):</span>
//                       <span>NPR {taxPrice.toFixed(2)}</span>
//                     </div>
//                     <hr />
//                     <div className="d-flex justify-content-between fw-bold text-danger h5">
//                       <span>Total:</span>
//                       <span>NPR {totalPrice.toFixed(2)}</span>
//                     </div>
//                   </div>

//                   <div className="mt-3 text-center">
//                     <small className="text-muted d-flex align-items-center justify-content-center gap-1">
//                       <ShieldCheck size={14} /> Secure transaction
//                     </small>
//                   </div>
//                 </Card.Body>
//               </Card>

//               {/* Continue Shopping Suggestion */}
//               <Card className="border-0 rounded-3 shadow-sm d-none d-lg-block">
//                 <Card.Body className="p-3 text-center">
//                   <p className="small text-muted mb-2">Want to add more?</p>
//                   <Button
//                     variant="outline-dark"
//                     size="sm"
//                     className="w-100 rounded-3"
//                     onClick={() => navigate("/medicines")}
//                   >
//                     Continue Shopping
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         )}

//         {cartItems.length === 0 && (
//           <Card className="border-0 shadow-sm text-center py-5 rounded-4">
//             <Card.Body>
//               <div className="mb-4 text-muted opacity-25">
//                 <ShoppingBag size={80} />
//               </div>
//               {/* Removed Amazon text here */}
//               <h3 className="fw-bold text-dark">Your cart is empty</h3>
//               <p className="text-muted mb-4">
//                 Check your saved medicines or start browsing for what you need.
//               </p>
//               <Button
//                 variant="warning"
//                 className="px-5 py-2 shadow-sm border-0"
//                 style={{
//                   backgroundColor: "#FFD814",
//                   borderRadius: "8px",
//                   color: "#0F1111",
//                 }}
//                 onClick={() => navigate("/medicines")}
//               >
//                 Shop medicines now
//               </Button>
//             </Card.Body>
//           </Card>
//         )}
//       </Container>
//     </div>
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
//   Image,
//   Alert,
//   Spinner,
//   Form,
// } from "react-bootstrap";
// import {
//   Trash2,
//   ShoppingBag,
//   ArrowRight,
//   ArrowLeft,
//   ShieldCheck,
//   CheckCircle,
//   Info,
//   AlertTriangle,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext"; // ✅ Added to get user details
// import PrescriptionUpload from "../components/PrescriptionUpload"; // ✅ Added Upload Component

// const CartPage = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth(); // Get logged-in user
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [updatingItems, setUpdatingItems] = useState({});

//   // ✅ NEW: Track prescription requirement and upload success
//   const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);

//   // --- Financials ---
//   const itemsPrice = cartItems.reduce(
//     (acc, item) => acc + item.price * item.qty,
//     0,
//   );
//   const taxPrice = itemsPrice * 0.13;
//   const shippingPrice = itemsPrice > 1000 ? 0 : 50;
//   const totalPrice = itemsPrice + taxPrice + shippingPrice;

//   // ✅ Check if ANY item in the cart requires a prescription
//   const requiresPrescription = cartItems.some(
//     (item) => item.prescriptionRequired === true,
//   );

//   // ✅ Checkout is blocked if a prescription is required but not yet uploaded
//   const canProceed = !requiresPrescription || prescriptionUploaded;

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const { data } = await api.get("/cart");
//       if (data && Array.isArray(data.cartItems)) {
//         setCartItems(data.cartItems);
//       } else {
//         setCartItems([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load cart. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQty = async (id, newQty, maxStock) => {
//     if (newQty < 1 || newQty > maxStock) return;
//     setUpdatingItems((prev) => ({ ...prev, [id]: true }));
//     try {
//       setCartItems((prev) =>
//         prev.map((item) =>
//           item.medicine === id ? { ...item, qty: parseInt(newQty) } : item,
//         ),
//       );
//       await api.post("/cart", { medicineId: id, qty: parseInt(newQty) });
//     } catch (err) {
//       setError("Could not update quantity.");
//       fetchCart();
//     } finally {
//       setUpdatingItems((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   const removeItem = async (id) => {
//     setUpdatingItems((prev) => ({ ...prev, [id]: true }));
//     try {
//       setCartItems((prev) => prev.filter((item) => item.medicine !== id));
//       await api.delete(`/cart/${id}`);
//     } catch (err) {
//       setError("Failed to remove item.");
//       fetchCart();
//     } finally {
//       setUpdatingItems((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   const checkoutHandler = () => {
//     localStorage.setItem(
//       "checkoutData",
//       // Include prescription status so the checkout page knows if this is a restricted order
//       JSON.stringify({
//         cartItems,
//         totalPrice,
//         requiresPrescription,
//         prescriptionUploaded,
//       }),
//     );
//     navigate("/shipping");
//   };

//   if (loading)
//     return (
//       <Container className="py-5 text-center" style={{ minHeight: "60vh" }}>
//         <Spinner animation="border" variant="warning" />
//         <p className="mt-3 text-muted">Loading your cart...</p>
//       </Container>
//     );

//   return (
//     <div
//       style={{
//         backgroundColor: "#f0f2f2",
//         minHeight: "100vh",
//         paddingBottom: "50px",
//       }}
//     >
//       <Container className="py-4">
//         {/* Back Button */}
//         <div className="mb-3">
//           <Button
//             variant="link"
//             className="text-decoration-none text-dark p-0 d-flex align-items-center"
//             style={{ width: "fit-content" }}
//             onClick={() => navigate(-1)}
//           >
//             <ArrowLeft size={18} className="me-1" /> Back
//           </Button>
//         </div>

//         {cartItems.length > 0 && (
//           <Row className="mb-3">
//             <Col lg={8}>
//               {/* ✅ PRESCRIPTION UPLOAD SECTION */}
//               {requiresPrescription && !prescriptionUploaded && (
//                 <div className="mb-4">
//                   <Alert
//                     variant="danger"
//                     className="border-0 shadow-sm rounded-1 d-flex align-items-start gap-2"
//                     style={{
//                       backgroundColor: "#fef0f0",
//                       color: "#B12704",
//                       borderLeft: "4px solid #B12704",
//                     }}
//                   >
//                     <AlertTriangle size={24} className="mt-1 flex-shrink-0" />
//                     <div>
//                       <h6 className="fw-bold mb-1 fs-6">
//                         Prescription Required
//                       </h6>
//                       <span className="small">
//                         Your cart contains restricted medicines. Please securely
//                         upload a valid doctor's prescription below to unlock
//                         checkout.
//                       </span>
//                     </div>
//                   </Alert>
//                   {/* Reuse the component you built earlier */}
//                   <PrescriptionUpload
//                     user={user}
//                     onUploadSuccess={() => setPrescriptionUploaded(true)}
//                   />
//                 </div>
//               )}

//               {/* ✅ PRESCRIPTION VERIFIED ALERT */}
//               {requiresPrescription && prescriptionUploaded && (
//                 <Alert
//                   variant="success"
//                   className="border-0 shadow-sm rounded-1 d-flex align-items-center gap-2 mb-4"
//                   style={{
//                     backgroundColor: "#f2fcf5",
//                     color: "#067D62",
//                     borderLeft: "4px solid #067D62",
//                   }}
//                 >
//                   <CheckCircle size={20} className="flex-shrink-0" />
//                   <span className="fw-bold small">
//                     Prescription securely attached! You may now proceed to
//                     checkout.
//                   </span>
//                 </Alert>
//               )}

//               <Card
//                 className="border-0 rounded-1 shadow-sm mb-3"
//                 style={{ borderColor: "#D5D9D9" }}
//               >
//                 <Card.Body className="p-4">
//                   <h3 className="fw-normal mb-0" style={{ color: "#0F1111" }}>
//                     Shopping Cart
//                   </h3>
//                   <div className="text-muted small">Select all items</div>
//                   <hr />
//                   {error && (
//                     <Alert variant="danger" className="border-0 rounded-1">
//                       {error}
//                     </Alert>
//                   )}

//                   {cartItems.map((item) => (
//                     <div
//                       key={item.medicine}
//                       className="mb-4 pb-4 border-bottom"
//                     >
//                       <Row className="align-items-start">
//                         <Col xs={4} md={3} lg={2}>
//                           <Image
//                             src={
//                               item.image?.startsWith("http")
//                                 ? item.image
//                                 : `http://localhost:5000${item.image}`
//                             }
//                             alt={item.name}
//                             fluid
//                             className="rounded border"
//                             style={{
//                               maxHeight: "120px",
//                               objectFit: "contain",
//                               borderColor: "#D5D9D9",
//                             }}
//                           />
//                         </Col>
//                         <Col xs={8} md={9} lg={10}>
//                           <div className="d-flex justify-content-between align-items-start">
//                             <div>
//                               <h5
//                                 className="mb-1 text-truncate"
//                                 style={{ color: "#007185", maxWidth: "400px" }}
//                               >
//                                 <Link
//                                   to={`/medicine/${item.medicine}`}
//                                   className="text-decoration-none hover-underline"
//                                   style={{ color: "inherit" }}
//                                 >
//                                   {item.name}
//                                 </Link>
//                               </h5>
//                               <div
//                                 className="text-success small fw-bold mb-1"
//                                 style={{ color: "#067D62 !important" }}
//                               >
//                                 In Stock
//                               </div>

//                               {/* Show tag if this specific item requires RX */}
//                               {item.prescriptionRequired && (
//                                 <div
//                                   className="badge rounded-1 mb-2 me-2"
//                                   style={{
//                                     backgroundColor: "#fef0f0",
//                                     color: "#B12704",
//                                     border: "1px solid #B12704",
//                                   }}
//                                 >
//                                   Rx Required
//                                 </div>
//                               )}

//                               <div className="text-muted small mb-2">
//                                 Eligible for FREE Shipping
//                               </div>

//                               <div className="d-flex align-items-center gap-3">
//                                 {/* Amazon Style Qty Selector */}
//                                 <div
//                                   className="d-flex align-items-center bg-white border rounded shadow-sm px-2 py-1"
//                                   style={{
//                                     height: "32px",
//                                     backgroundColor: "#F0F2F2",
//                                     borderColor: "#D5D9D9",
//                                   }}
//                                 >
//                                   <span
//                                     className="small me-2"
//                                     style={{ color: "#0F1111" }}
//                                   >
//                                     Qty:
//                                   </span>
//                                   <Form.Select
//                                     size="sm"
//                                     className="border-0 bg-transparent p-0 shadow-none amazon-select"
//                                     style={{
//                                       width: "50px",
//                                       fontSize: "0.85rem",
//                                     }}
//                                     value={item.qty}
//                                     onChange={(e) =>
//                                       updateQty(
//                                         item.medicine,
//                                         e.target.value,
//                                         item.countInStock,
//                                       )
//                                     }
//                                     disabled={updatingItems[item.medicine]}
//                                   >
//                                     {[
//                                       ...Array(
//                                         Math.min(item.countInStock, 10),
//                                       ).keys(),
//                                     ].map((x) => (
//                                       <option key={x + 1} value={x + 1}>
//                                         {x + 1}
//                                       </option>
//                                     ))}
//                                   </Form.Select>
//                                 </div>

//                                 <div
//                                   className="vr"
//                                   style={{
//                                     height: "18px",
//                                     backgroundColor: "#D5D9D9",
//                                   }}
//                                 ></div>

//                                 <Button
//                                   variant="link"
//                                   className="p-0 text-decoration-none small hover-underline"
//                                   style={{ color: "#007185" }}
//                                   onClick={() => removeItem(item.medicine)}
//                                 >
//                                   Delete
//                                 </Button>
//                               </div>
//                             </div>
//                             <div className="text-end">
//                               <h5
//                                 className="fw-bold"
//                                 style={{ color: "#0F1111" }}
//                               >
//                                 NPR {item.price.toFixed(2)}
//                               </h5>
//                             </div>
//                           </div>
//                         </Col>
//                       </Row>
//                     </div>
//                   ))}

//                   <div className="text-end mt-2">
//                     <h5 className="fw-normal" style={{ color: "#0F1111" }}>
//                       Subtotal ({cartItems.length} items):{" "}
//                       <span className="fw-bold">
//                         NPR {itemsPrice.toFixed(2)}
//                       </span>
//                     </h5>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>

//             <Col lg={4}>
//               {/* Order Summary Sidebar */}
//               <Card
//                 className="border-0 rounded-1 shadow-sm mb-3 bg-white"
//                 style={{ borderColor: "#D5D9D9" }}
//               >
//                 <Card.Body className="p-4">
//                   {shippingPrice === 0 ? (
//                     <div
//                       className="d-flex align-items-start gap-2 mb-3"
//                       style={{ color: "#067D62" }}
//                     >
//                       <CheckCircle size={20} className="mt-1" />
//                       <div>
//                         <div className="small fw-bold">
//                           Your order qualifies for FREE Shipping.
//                         </div>
//                         <div className="text-muted small">
//                           Choose this option at checkout.
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div
//                       className="d-flex align-items-start gap-2 mb-3"
//                       style={{ color: "#007185" }}
//                     >
//                       <Info size={20} className="mt-1" />
//                       <div className="small">
//                         Add{" "}
//                         <b style={{ color: "#B12704" }}>
//                           NPR {1000 - itemsPrice}
//                         </b>{" "}
//                         of eligible items to get <b>FREE Shipping</b>.
//                       </div>
//                     </div>
//                   )}

//                   <h4 className="fw-normal mb-3" style={{ color: "#0F1111" }}>
//                     Subtotal ({cartItems.length} items):{" "}
//                     <span className="fw-bold d-block mt-1">
//                       NPR {totalPrice.toFixed(2)}
//                     </span>
//                   </h4>

//                   {/* ✅ DYNAMIC CHECKOUT BUTTON */}
//                   <Button
//                     className="w-100 py-2 mb-3 shadow-sm border-0"
//                     style={{
//                       backgroundColor: canProceed ? "#FFD814" : "#F0F2F2",
//                       borderRadius: "8px",
//                       color: canProceed ? "#0F1111" : "#888C8C",
//                       fontWeight: "500",
//                       cursor: canProceed ? "pointer" : "not-allowed",
//                     }}
//                     onClick={checkoutHandler}
//                     disabled={!canProceed}
//                   >
//                     {!canProceed
//                       ? "Upload Rx to Checkout"
//                       : "Proceed to Checkout"}
//                   </Button>

//                   <div
//                     className="border rounded-1 p-3 bg-light"
//                     style={{ borderColor: "#D5D9D9" }}
//                   >
//                     <div
//                       className="d-flex justify-content-between small mb-1"
//                       style={{ color: "#565959" }}
//                     >
//                       <span>Items ({cartItems.length}):</span>
//                       <span>NPR {itemsPrice.toFixed(2)}</span>
//                     </div>
//                     <div
//                       className="d-flex justify-content-between small mb-1"
//                       style={{ color: "#565959" }}
//                     >
//                       <span>Shipping:</span>
//                       <span>
//                         {shippingPrice === 0
//                           ? "FREE"
//                           : `NPR ${shippingPrice.toFixed(2)}`}
//                       </span>
//                     </div>
//                     <div
//                       className="d-flex justify-content-between small mb-2"
//                       style={{ color: "#565959" }}
//                     >
//                       <span>Tax (13%):</span>
//                       <span>NPR {taxPrice.toFixed(2)}</span>
//                     </div>
//                     <hr style={{ borderColor: "#D5D9D9" }} />
//                     <div
//                       className="d-flex justify-content-between fw-bold h5 mb-0"
//                       style={{ color: "#B12704" }}
//                     >
//                       <span>Total:</span>
//                       <span>NPR {totalPrice.toFixed(2)}</span>
//                     </div>
//                   </div>

//                   <div className="mt-3 text-center">
//                     <small
//                       className="d-flex align-items-center justify-content-center gap-1"
//                       style={{ color: "#007185" }}
//                     >
//                       <ShieldCheck size={14} /> Secure transaction
//                     </small>
//                   </div>
//                 </Card.Body>
//               </Card>

//               {/* Continue Shopping Suggestion */}
//               <Card
//                 className="border-0 rounded-1 shadow-sm d-none d-lg-block bg-white"
//                 style={{ borderColor: "#D5D9D9" }}
//               >
//                 <Card.Body className="p-3 text-center">
//                   <p className="small text-muted mb-2">Want to add more?</p>
//                   <Button
//                     variant="outline-dark"
//                     size="sm"
//                     className="w-100 rounded-3 fw-medium"
//                     style={{ borderColor: "#D5D9D9" }}
//                     onClick={() => navigate("/medicines")}
//                   >
//                     Continue Shopping
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         )}

//         {cartItems.length === 0 && (
//           <Card
//             className="border-0 shadow-sm text-center py-5 rounded-1 bg-white"
//             style={{ borderColor: "#D5D9D9" }}
//           >
//             <Card.Body>
//               <div className="mb-4 opacity-25" style={{ color: "#565959" }}>
//                 <ShoppingBag size={80} />
//               </div>
//               <h3 className="fw-bold mb-3" style={{ color: "#0F1111" }}>
//                 Your cart is empty
//               </h3>
//               <p className="text-muted mb-4">
//                 Check your saved medicines or start browsing for what you need.
//               </p>
//               <Button
//                 className="px-5 py-2 shadow-sm border-0 fw-medium"
//                 style={{
//                   backgroundColor: "#FFD814",
//                   borderRadius: "8px",
//                   color: "#0F1111",
//                 }}
//                 onClick={() => navigate("/medicines")}
//               >
//                 Shop medicines now
//               </Button>
//             </Card.Body>
//           </Card>
//         )}
//       </Container>
//       <style>{`
//         .hover-underline:hover { text-decoration: underline !important; color: #C7511F !important; }
//         .amazon-select:focus { box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; outline: none; }
//       `}</style>
//     </div>
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
  Form,
} from "react-bootstrap";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import PrescriptionUpload from "../components/PrescriptionUpload";

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItems, setUpdatingItems] = useState({});

  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);

  // --- Financials ---
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.qty || 1),
    0,
  );
  const taxPrice = itemsPrice * 0.13;
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // ✅ Guaranteed Rx Check
  const requiresPrescription = cartItems.some(
    (item) =>
      item.prescriptionRequired === true ||
      String(item.prescriptionRequired) === "true",
  );

  const canProceed = !requiresPrescription || prescriptionUploaded;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Prioritize Local Storage initially
      let currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];

      // 2. Fetch Master Database (WITH SAFE ARRAY EXTRACTION)
      let allMedicines = [];
      try {
        const medsResponse = await api.get("/medicines");
        const responseData = medsResponse.data;

        // 🚨 CRITICAL FIX: Ensure allMedicines is an array regardless of backend structure
        if (Array.isArray(responseData)) {
          allMedicines = responseData; // Direct array
        } else if (responseData && Array.isArray(responseData.medicines)) {
          allMedicines = responseData.medicines; // Common paginated structure
        } else if (responseData && Array.isArray(responseData.data)) {
          allMedicines = responseData.data; // Another common structure
        } else {
          allMedicines = []; // Absolute fallback
        }
      } catch (err) {
        console.warn("Failed to fetch master medicines database.");
        allMedicines = [];
      }

      // Safety check: ensure it's an array before moving on
      if (!Array.isArray(allMedicines)) allMedicines = [];

      // 3. Fetch Backend Cart
      try {
        const cartResponse = await api.get("/cart");
        const backendCart =
          cartResponse.data?.cartItems || cartResponse.data || [];

        if (
          currentCart.length === 0 &&
          Array.isArray(backendCart) &&
          backendCart.length > 0
        ) {
          currentCart = backendCart;
        }
      } catch (err) {
        console.warn("No backend cart found, relying on local storage.");
      }

      // 4. MERGE DATA
      const enrichedCart = currentCart.map((item) => {
        const rawId =
          typeof item.medicine === "object"
            ? item.medicine?._id
            : item.medicine;
        const fallbackId =
          typeof item.product === "object" ? item.product?._id : item.product;
        const targetId = rawId || fallbackId || item._id;

        // Since allMedicines is safely guaranteed to be an array, .find() will not crash
        const truthData = allMedicines.find(
          (m) =>
            String(m._id) === String(targetId) ||
            String(m.id) === String(targetId),
        );

        return {
          ...item,
          medicine: targetId,
          name: truthData ? truthData.name : item.name,
          image: truthData ? truthData.image : item.image,
          price: truthData ? truthData.price : item.price,
          countInStock: truthData ? truthData.countInStock : item.countInStock,
          prescriptionRequired: truthData
            ? Boolean(truthData.prescriptionRequired)
            : Boolean(item.prescriptionRequired),
        };
      });

      const finalCart = enrichedCart.filter(
        (item) => item.name && item.price !== undefined,
      );

      setCartItems(finalCart);
      localStorage.setItem("cartItems", JSON.stringify(finalCart));
    } catch (err) {
      console.error("Cart Sync Error:", err);
      setError("We had trouble fully syncing your cart. Showing local items.");
      setCartItems(JSON.parse(localStorage.getItem("cartItems")) || []);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (id, newQty, maxStock) => {
    if (newQty < 1 || newQty > maxStock) return;
    setUpdatingItems((prev) => ({ ...prev, [id]: true }));
    try {
      const updatedCart = cartItems.map((item) => {
        return String(item.medicine) === String(id)
          ? { ...item, qty: parseInt(newQty) }
          : item;
      });

      setCartItems(updatedCart);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));

      try {
        await api.post("/cart", { medicineId: id, qty: parseInt(newQty) });
      } catch (e) {
        console.warn("Backend qty update failed, but updated locally");
      }
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  const removeItem = async (id) => {
    setUpdatingItems((prev) => ({ ...prev, [id]: true }));
    try {
      const updatedCart = cartItems.filter(
        (item) => String(item.medicine) !== String(id),
      );

      setCartItems(updatedCart);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));

      try {
        await api.delete(`/cart/${id}`);
      } catch (e) {
        console.warn("Backend delete failed, but deleted locally");
      }
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  const checkoutHandler = () => {
    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        cartItems,
        totalPrice,
        requiresPrescription,
        prescriptionUploaded,
      }),
    );
    navigate("/shipping");
  };

  if (loading)
    return (
      <Container
        className="py-5 text-center d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner
          animation="border"
          style={{ color: "#007185", width: "3rem", height: "3rem" }}
        />
        <p
          className="mt-3 text-muted fw-bold text-uppercase"
          style={{ letterSpacing: "1px", fontSize: "0.85rem" }}
        >
          Synchronizing Cart Data...
        </p>
      </Container>
    );

  return (
    <div
      style={{
        backgroundColor: "#f0f2f2",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <Container className="py-4">
        <div className="mb-3">
          <Button
            variant="link"
            className="text-decoration-none text-dark p-0 d-flex align-items-center hover-underline fw-medium"
            style={{ width: "fit-content" }}
            onClick={() => navigate("/medicines")}
          >
            <ArrowLeft size={18} className="me-1" /> Continue Shopping
          </Button>
        </div>

        {cartItems.length > 0 && (
          <Row className="mb-3">
            <Col lg={8}>
              {requiresPrescription && !prescriptionUploaded && (
                <div className="mb-4 animate-fade-in">
                  <Alert
                    variant="warning"
                    className="border-0 shadow-sm rounded-1 d-flex align-items-start gap-2"
                    style={{
                      backgroundColor: "#fff9e6",
                      color: "#B12704",
                      borderLeft: "4px solid #B12704",
                    }}
                  >
                    <AlertTriangle size={24} className="mt-1 flex-shrink-0" />
                    <div>
                      <h6 className="fw-bold mb-1 fs-6">
                        Prescription Required
                      </h6>
                      <span className="small text-dark">
                        Your cart contains restricted medicines. Please securely
                        upload a valid doctor's prescription below to unlock
                        checkout.
                      </span>
                    </div>
                  </Alert>
                  <PrescriptionUpload
                    user={user}
                    onUploadSuccess={() => setPrescriptionUploaded(true)}
                  />
                </div>
              )}

              {requiresPrescription && prescriptionUploaded && (
                <Alert
                  variant="success"
                  className="border-0 shadow-sm rounded-1 d-flex align-items-center gap-2 mb-4 animate-fade-in"
                  style={{
                    backgroundColor: "#f2fcf5",
                    color: "#067D62",
                    borderLeft: "4px solid #067D62",
                  }}
                >
                  <CheckCircle size={20} className="flex-shrink-0" />
                  <span className="fw-bold small">
                    Prescription securely attached! You may now proceed to
                    checkout.
                  </span>
                </Alert>
              )}

              <Card
                className="border-0 rounded-1 shadow-sm mb-3"
                style={{ borderColor: "#D5D9D9" }}
              >
                <Card.Body className="p-4">
                  <h3 className="fw-normal mb-0" style={{ color: "#0F1111" }}>
                    Shopping Cart
                  </h3>
                  <div className="text-muted small">Select all items</div>
                  <hr style={{ borderColor: "#D5D9D9" }} />
                  {error && (
                    <Alert variant="danger" className="border-0 rounded-1">
                      {error}
                    </Alert>
                  )}

                  {cartItems.map((item) => {
                    const itemId = item.medicine;
                    const isRx =
                      item.prescriptionRequired === true ||
                      String(item.prescriptionRequired) === "true";

                    return (
                      <div
                        key={itemId}
                        className="mb-4 pb-4 border-bottom border-light-subtle"
                      >
                        <Row className="align-items-start">
                          <Col xs={4} md={3} lg={2}>
                            <Image
                              src={
                                item.image?.startsWith("http")
                                  ? item.image
                                  : `http://localhost:5000${item.image}`
                              }
                              alt={item.name}
                              fluid
                              className="rounded-1 border bg-white shadow-sm"
                              style={{
                                maxHeight: "100px",
                                objectFit: "contain",
                                borderColor: "#D5D9D9",
                              }}
                            />
                          </Col>
                          <Col xs={8} md={9} lg={10}>
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h5
                                  className="mb-1 text-truncate"
                                  style={{ maxWidth: "400px" }}
                                >
                                  <Link
                                    to={`/medicine/${itemId}`}
                                    className="text-decoration-none hover-underline fw-bold"
                                    style={{
                                      color: "#007185",
                                      fontSize: "1.1rem",
                                    }}
                                  >
                                    {item.name}
                                  </Link>
                                </h5>
                                <div
                                  className="small fw-bold mb-2"
                                  style={{ color: "#067D62" }}
                                >
                                  In Stock
                                </div>

                                <div className="d-flex flex-wrap gap-2 mb-3">
                                  {isRx && (
                                    <span
                                      className="badge rounded-1"
                                      style={{
                                        backgroundColor: "#fef0f0",
                                        color: "#B12704",
                                        border: "1px solid #f5c6cb",
                                      }}
                                    >
                                      Rx Required
                                    </span>
                                  )}
                                  <span
                                    className="badge bg-light text-dark border rounded-1"
                                    style={{ borderColor: "#D5D9D9" }}
                                  >
                                    Eligible for FREE Shipping
                                  </span>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                  <div
                                    className="d-flex align-items-center bg-white border rounded-1 shadow-sm px-2 py-1"
                                    style={{
                                      height: "32px",
                                      borderColor: "#D5D9D9",
                                    }}
                                  >
                                    <span
                                      className="small me-2 fw-medium"
                                      style={{ color: "#0F1111" }}
                                    >
                                      Qty:
                                    </span>
                                    <Form.Select
                                      size="sm"
                                      className="border-0 bg-transparent p-0 shadow-none amazon-select fw-bold"
                                      style={{
                                        width: "45px",
                                        fontSize: "0.85rem",
                                        color: "#0F1111",
                                      }}
                                      value={item.qty}
                                      onChange={(e) =>
                                        updateQty(
                                          itemId,
                                          e.target.value,
                                          item.countInStock,
                                        )
                                      }
                                      disabled={updatingItems[itemId]}
                                    >
                                      {[
                                        ...Array(
                                          Math.min(item.countInStock || 10, 10),
                                        ).keys(),
                                      ].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                          {x + 1}
                                        </option>
                                      ))}
                                    </Form.Select>
                                  </div>
                                  <div
                                    className="vr"
                                    style={{
                                      height: "18px",
                                      backgroundColor: "#D5D9D9",
                                    }}
                                  ></div>
                                  <Button
                                    variant="link"
                                    className="p-0 text-decoration-none small hover-underline"
                                    style={{ color: "#007185" }}
                                    onClick={() => removeItem(itemId)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                              <div className="text-end">
                                <h4
                                  className="fw-bold"
                                  style={{ color: "#0F1111" }}
                                >
                                  NPR {Number(item.price).toFixed(2)}
                                </h4>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}

                  <div className="text-end mt-2">
                    <h5 className="fw-normal" style={{ color: "#0F1111" }}>
                      Subtotal ({cartItems.length} items):{" "}
                      <span className="fw-bold">
                        NPR {itemsPrice.toFixed(2)}
                      </span>
                    </h5>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card
                className="border-0 rounded-1 shadow-sm mb-3 bg-white sticky-top"
                style={{ top: "20px", borderColor: "#D5D9D9" }}
              >
                <Card.Body className="p-4">
                  {shippingPrice === 0 ? (
                    <div
                      className="d-flex align-items-start gap-2 mb-3"
                      style={{ color: "#067D62" }}
                    >
                      <CheckCircle size={20} className="mt-1" />
                      <div>
                        <div className="small fw-bold">
                          Your order qualifies for FREE Shipping.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="d-flex align-items-start gap-2 mb-3"
                      style={{ color: "#007185" }}
                    >
                      <Info size={20} className="mt-1" />
                      <div className="small">
                        Add{" "}
                        <b style={{ color: "#B12704" }}>
                          NPR {(1000 - itemsPrice).toFixed(2)}
                        </b>{" "}
                        of eligible items to get <b>FREE Shipping</b>.
                      </div>
                    </div>
                  )}

                  <h4 className="fw-normal mb-3" style={{ color: "#0F1111" }}>
                    Subtotal ({cartItems.length} items):{" "}
                    <span className="fw-bold d-block mt-1">
                      NPR {totalPrice}
                    </span>
                  </h4>

                  <Button
                    className="w-100 py-2 mb-3 shadow-sm border-0 fw-medium"
                    style={{
                      backgroundColor: canProceed ? "#FFD814" : "#F0F2F2",
                      borderRadius: "8px",
                      color: canProceed ? "#0F1111" : "#888C8C",
                      cursor: canProceed ? "pointer" : "not-allowed",
                    }}
                    onClick={checkoutHandler}
                    disabled={!canProceed}
                  >
                    {!canProceed
                      ? "Upload Rx to Checkout"
                      : "Proceed to Checkout"}
                  </Button>

                  <div
                    className="border rounded-1 p-3 bg-light"
                    style={{ borderColor: "#D5D9D9" }}
                  >
                    <div
                      className="d-flex justify-content-between small mb-1"
                      style={{ color: "#565959" }}
                    >
                      <span>Items ({cartItems.length}):</span>
                      <span>NPR {itemsPrice.toFixed(2)}</span>
                    </div>
                    <div
                      className="d-flex justify-content-between small mb-1"
                      style={{ color: "#565959" }}
                    >
                      <span>Shipping:</span>
                      <span>
                        {Number(shippingPrice) === 0
                          ? "FREE"
                          : `NPR ${shippingPrice}`}
                      </span>
                    </div>
                    <div
                      className="d-flex justify-content-between small mb-2"
                      style={{ color: "#565959" }}
                    >
                      <span>Tax (13%):</span>
                      <span>NPR {taxPrice}</span>
                    </div>
                    <hr style={{ borderColor: "#D5D9D9" }} />
                    <div
                      className="d-flex justify-content-between fw-bold h5 mb-0"
                      style={{ color: "#B12704" }}
                    >
                      <span>Total:</span>
                      <span>NPR {totalPrice}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {cartItems.length === 0 && (
          <Card
            className="border-0 shadow-sm text-center py-5 rounded-1 bg-white"
            style={{ borderColor: "#D5D9D9" }}
          >
            <Card.Body className="py-5">
              <div className="mb-4 opacity-25" style={{ color: "#565959" }}>
                <ShoppingBag size={80} />
              </div>
              <h3 className="fw-bold mb-3" style={{ color: "#0F1111" }}>
                Your cart is empty
              </h3>
              <p className="text-muted mb-4">
                Check your saved medicines or start browsing for what you need.
              </p>
              <Button
                className="px-5 py-2 shadow-sm border-0 fw-medium"
                style={{
                  backgroundColor: "#FFD814",
                  borderRadius: "8px",
                  color: "#0F1111",
                }}
                onClick={() => navigate("/medicines")}
              >
                Shop medicines now
              </Button>
            </Card.Body>
          </Card>
        )}
      </Container>
      <style>{`
        .hover-underline:hover { text-decoration: underline !important; color: #C7511F !important; cursor: pointer; }
        .amazon-select:focus { box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; outline: none; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default CartPage;
