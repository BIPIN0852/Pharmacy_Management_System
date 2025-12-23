// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Table, Button, Form, Alert, Card, Row, Col } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   removeFromCart,
//   updateCartQuantity,
//   emptyCart,
// } from "../redux/actions/cartActions";
// import CheckoutSteps from "../components/CheckoutSteps";

// const Cart = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const cart = useSelector((state) => state.cart);
//   const { cartItems, shippingAddress, paymentMethod } = cart;

//   // ✅ LOAD cart from localStorage on component mount
//   useEffect(() => {
//     const cartItemsFromStorage = localStorage.getItem("cartItems");
//     if (cartItemsFromStorage) {
//       // Dispatch to populate cart from storage
//       // This ensures cart persists across page refreshes
//     }
//   }, [dispatch]);

//   const handleRemove = (id) => {
//     dispatch(removeFromCart(id));
//   };

//   const handleQtyChange = (id, qty) => {
//     if (qty < 1) {
//       handleRemove(id); // Remove if qty becomes 0
//       return;
//     }
//     dispatch(updateCartQuantity(id, qty));
//   };

//   // ✅ Calculate pricing breakdown
//   const subtotal = cartItems.reduce(
//     (acc, item) => acc + item.price * item.qty,
//     0
//   );
//   const tax = subtotal * 0.1;
//   const shipping = subtotal > 500 ? 0 : 50;
//   const totalPrice = subtotal + tax + shipping;

//   const proceedToCheckout = () => {
//     if (cartItems.length === 0) return;
//     navigate("/shipping");
//   };

//   const clearCart = () => {
//     if (window.confirm("Clear all items from cart?")) {
//       dispatch(emptyCart());
//     }
//   };

//   return (
//     <div className="container my-5">
//       {/* ✅ Checkout Steps */}
//       <CheckoutSteps step1={true} step2={false} step3={false} step4={false} />

//       <Row>
//         <Col lg={8}>
//           <h2 className="mb-4">
//             <i className="fas fa-shopping-cart me-2 text-primary"></i>
//             Shopping Cart
//           </h2>

//           {cartItems.length === 0 ? (
//             <Alert variant="info" className="text-center">
//               <i className="fas fa-shopping-bag fa-2x mb-3 d-block"></i>
//               <h5>Your cart is empty</h5>
//               <p>
//                 You have no items in your shopping cart.
//                 <Link to="/medicines" className="btn btn-primary ms-2">
//                   Start Shopping
//                 </Link>
//               </p>
//             </Alert>
//           ) : (
//             <>
//               <Card className="shadow-sm border-0 mb-4">
//                 <Card.Body>
//                   <Table responsive hover className="mb-0">
//                     <thead className="table-light">
//                       <tr>
//                         <th className="w-50">Medicine</th>
//                         <th className="text-center">Price</th>
//                         <th className="text-center">Quantity</th>
//                         <th className="text-center">Subtotal</th>
//                         <th className="text-center"></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {cartItems.map((item) => (
//                         <tr key={item.medicine || item._id}>
//                           <td>
//                             <div className="d-flex align-items-center">
//                               {/* Medicine image placeholder */}
//                               <div
//                                 className="bg-light rounded-circle me-3 d-flex align-items-center justify-content-center"
//                                 style={{ width: 50, height: 50 }}
//                               >
//                                 <i className="fas fa-pills text-muted"></i>
//                               </div>
//                               <div>
//                                 <div className="fw-bold">{item.name}</div>
//                                 <small className="text-muted">
//                                   ID:{" "}
//                                   {item.medicine?.slice(-6) ||
//                                     item._id?.slice(-6)}
//                                 </small>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="text-center fw-semibold">
//                             ₹{item.price.toFixed(2)}
//                           </td>
//                           <td className="text-center">
//                             <Form.Control
//                               type="number"
//                               min={1}
//                               value={item.qty}
//                               onChange={(e) =>
//                                 handleQtyChange(
//                                   item.medicine || item._id,
//                                   Number(e.target.value)
//                                 )
//                               }
//                               className="qty-input"
//                               style={{ maxWidth: 80 }}
//                             />
//                           </td>
//                           <td className="text-center fw-semibold text-primary">
//                             ₹{(item.price * item.qty).toFixed(2)}
//                           </td>
//                           <td className="text-center">
//                             <Button
//                               variant="outline-danger"
//                               size="sm"
//                               onClick={() =>
//                                 handleRemove(item.medicine || item._id)
//                               }
//                               className="rounded-pill px-3"
//                             >
//                               <i className="fas fa-trash me-1"></i>Remove
//                             </Button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </Card.Body>
//               </Card>

//               {/* ✅ Cart Actions */}
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <Button
//                   variant="outline-secondary"
//                   onClick={clearCart}
//                   disabled={cartItems.length === 0}
//                 >
//                   <i className="fas fa-trash-alt me-2"></i>
//                   Clear Cart
//                 </Button>
//                 <Link to="/medicines" className="btn btn-outline-primary">
//                   ← Continue Shopping
//                 </Link>
//               </div>
//             </>
//           )}
//         </Col>

//         {/* ✅ Order Summary */}
//         <Col lg={4}>
//           <Card className="shadow-lg sticky-top" style={{ top: "20px" }}>
//             <Card.Header className="bg-primary text-white">
//               <h5 className="mb-0">
//                 <i className="fas fa-receipt me-2"></i>Order Summary
//               </h5>
//             </Card.Header>
//             <Card.Body>
//               <Table className="mb-0 small">
//                 <tbody>
//                   <tr>
//                     <td>
//                       Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)}{" "}
//                       items):
//                     </td>
//                     <td className="text-end fw-bold">₹{subtotal.toFixed(2)}</td>
//                   </tr>
//                   <tr>
//                     <td>Tax (10%):</td>
//                     <td className="text-end">₹{tax.toFixed(2)}</td>
//                   </tr>
//                   <tr>
//                     <td>Shipping:</td>
//                     <td className="text-end">
//                       {shipping === 0 ? (
//                         <span className="text-success fw-bold">FREE</span>
//                       ) : (
//                         `₹${shipping.toFixed(2)}`
//                       )}
//                     </td>
//                   </tr>
//                   <tr className="border-top">
//                     <td className="h5 mb-0 fw-bold">Total:</td>
//                     <td className="h4 mb-0 text-primary fw-bold">
//                       ₹{totalPrice.toFixed(2)}
//                     </td>
//                   </tr>
//                 </tbody>
//               </Table>

//               <Button
//                 variant="success"
//                 size="lg"
//                 className="w-100 mt-3 rounded-pill fw-bold py-3 shadow-lg"
//                 onClick={proceedToCheckout}
//                 disabled={cartItems.length === 0}
//               >
//                 <i className="fas fa-credit-card me-2"></i>
//                 Proceed to Checkout ₹{totalPrice.toFixed(0)}
//               </Button>

//               {shippingAddress.address && (
//                 <Alert variant="info" className="mt-3 small">
//                   <i className="fas fa-map-marker-alt me-2"></i>
//                   Address saved: {shippingAddress.address?.substring(0, 30)}...
//                 </Alert>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <style jsx>{`
//         .qty-input {
//           text-align: center;
//         }
//         .qty-input::-webkit-outer-spin-button,
//         .qty-input::-webkit-inner-spin-button {
//           -webkit-appearance: none;
//           margin: 0;
//         }
//         .qty-input {
//           -moz-appearance: textfield;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Cart;

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Form, Alert, Card, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  removeFromCart,
  updateCartQuantity,
  emptyCart,
  setCartFromStorage, // ✅ NEW
} from "../redux/actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress } = cart;

  // ✅ LOAD cart from localStorage on component mount
  useEffect(() => {
    const cartItemsFromStorage = localStorage.getItem("cartItems");
    if (cartItemsFromStorage) {
      try {
        const parsed = JSON.parse(cartItemsFromStorage);
        if (Array.isArray(parsed)) {
          dispatch(setCartFromStorage(parsed));
        }
      } catch (e) {
        console.error("Failed to parse cartItems from storage", e);
      }
    }
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQtyChange = (id, qty) => {
    if (qty < 1) {
      handleRemove(id);
      return;
    }
    dispatch(updateCartQuantity(id, qty));
  };

  // ✅ Calculate pricing breakdown
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = subtotal > 500 ? 0 : 50;
  const totalPrice = subtotal + tax + shipping;

  const proceedToCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/shipping");
  };

  const clearCart = () => {
    if (window.confirm("Clear all items from cart?")) {
      dispatch(emptyCart());
    }
  };

  return (
    <div className="container my-5">
      {/* ✅ Checkout Steps */}
      <CheckoutSteps step1={true} step2={false} step3={false} step4={false} />

      <Row>
        <Col lg={8}>
          <h2 className="mb-4">
            <i className="fas fa-shopping-cart me-2 text-primary"></i>
            Shopping Cart
          </h2>

          {cartItems.length === 0 ? (
            <Alert variant="info" className="text-center">
              <i className="fas fa-shopping-bag fa-2x mb-3 d-block"></i>
              <h5>Your cart is empty</h5>
              <p>
                You have no items in your shopping cart.
                <Link to="/medicines" className="btn btn-primary ms-2">
                  Start Shopping
                </Link>
              </p>
            </Alert>
          ) : (
            <>
              <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                  <Table responsive hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="w-50">Medicine</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-center">Subtotal</th>
                        <th className="text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.medicine || item._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {/* Medicine image placeholder */}
                              <div
                                className="bg-light rounded-circle me-3 d-flex align-items-center justify-content-center"
                                style={{ width: 50, height: 50 }}
                              >
                                <i className="fas fa-pills text-muted"></i>
                              </div>
                              <div>
                                <div className="fw-bold">{item.name}</div>
                                <small className="text-muted">
                                  ID:{" "}
                                  {item.medicine?.slice(-6) ||
                                    item._id?.slice(-6)}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td className="text-center fw-semibold">
                            ₹{item.price.toFixed(2)}
                          </td>
                          <td className="text-center">
                            <Form.Control
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={(e) =>
                                handleQtyChange(
                                  item.medicine || item._id,
                                  Number(e.target.value)
                                )
                              }
                              className="qty-input"
                              style={{ maxWidth: 80 }}
                            />
                          </td>
                          <td className="text-center fw-semibold text-primary">
                            ₹{(item.price * item.qty).toFixed(2)}
                          </td>
                          <td className="text-center">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>
                                handleRemove(item.medicine || item._id)
                              }
                              className="rounded-pill px-3"
                            >
                              <i className="fas fa-trash me-1"></i>Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              {/* ✅ Cart Actions */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Button
                  variant="outline-secondary"
                  onClick={clearCart}
                  disabled={cartItems.length === 0}
                >
                  <i className="fas fa-trash-alt me-2"></i>
                  Clear Cart
                </Button>
                <Link to="/medicines" className="btn btn-outline-primary">
                  ← Continue Shopping
                </Link>
              </div>
            </>
          )}
        </Col>

        {/* ✅ Order Summary */}
        <Col lg={4}>
          <Card className="shadow-lg sticky-top" style={{ top: "20px" }}>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-receipt me-2"></i>Order Summary
              </h5>
            </Card.Header>
            <Card.Body>
              <Table className="mb-0 small">
                <tbody>
                  <tr>
                    <td>
                      Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)}{" "}
                      items):
                    </td>
                    <td className="text-end fw-bold">₹{subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Tax (10%):</td>
                    <td className="text-end">₹{tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Shipping:</td>
                    <td className="text-end">
                      {shipping === 0 ? (
                        <span className="text-success fw-bold">FREE</span>
                      ) : (
                        `₹${shipping.toFixed(2)}`
                      )}
                    </td>
                  </tr>
                  <tr className="border-top">
                    <td className="h5 mb-0 fw-bold">Total:</td>
                    <td className="h4 mb-0 text-primary fw-bold">
                      ₹{totalPrice.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </Table>

              <Button
                variant="success"
                size="lg"
                className="w-100 mt-3 rounded-pill fw-bold py-3 shadow-lg"
                onClick={proceedToCheckout}
                disabled={cartItems.length === 0}
              >
                <i className="fas fa-credit-card me-2"></i>
                Proceed to Checkout ₹{totalPrice.toFixed(0)}
              </Button>

              {shippingAddress.address && (
                <Alert variant="info" className="mt-3 small">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Address saved: {shippingAddress.address?.substring(0, 30)}...
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .qty-input {
          text-align: center;
        }
        .qty-input::-webkit-outer-spin-button,
        .qty-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .qty-input {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default Cart;
