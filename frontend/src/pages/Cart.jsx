// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Row,
//   Col,
//   ListGroup,
//   Image,
//   Form,
//   Button,
//   Card,
//   Container,
//   Alert,
// } from "react-bootstrap";
// import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
// import { addToCart, removeFromCart } from "../redux/actions/cartActions";

// const Cart = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const cart = useSelector((state) => state.cart);
//   const { cartItems } = cart;

//   const checkoutHandler = () => {
//     // Navigate to shipping address input
//     navigate("/shipping");
//   };

//   return (
//     <Container className="py-5">
//       <h2 className="mb-4 fw-bold">Shopping Cart</h2>
//       {cartItems.length === 0 ? (
//         <Alert variant="info" className="d-flex align-items-center">
//           <ShoppingCart className="me-2" />
//           Your cart is empty.{" "}
//           <Link to="/customer-dashboard" className="ms-2 fw-bold">
//             Go Back
//           </Link>
//         </Alert>
//       ) : (
//         <Row>
//           <Col md={8}>
//             <ListGroup
//               variant="flush"
//               className="shadow-sm rounded-3 overflow-hidden"
//             >
//               {cartItems.map((item) => (
//                 <ListGroup.Item
//                   key={item.product}
//                   className="p-4 bg-white border-bottom"
//                 >
//                   <Row className="align-items-center">
//                     <Col md={2}>
//                       <Image src={item.image} alt={item.name} fluid rounded />
//                     </Col>
//                     <Col md={3}>
//                       <Link
//                         to={`/medicine/${item.product}`}
//                         className="text-decoration-none fw-bold text-dark"
//                       >
//                         {item.name}
//                       </Link>
//                       {item.prescriptionRequired && (
//                         <span className="d-block text-danger small">
//                           Rx Required
//                         </span>
//                       )}
//                     </Col>
//                     <Col md={2} className="fw-bold">
//                       Rs. {item.price}
//                     </Col>
//                     <Col md={2}>
//                       <Form.Select
//                         value={item.qty}
//                         onChange={(e) =>
//                           dispatch(
//                             addToCart(item.product, Number(e.target.value))
//                           )
//                         }
//                       >
//                         {[...Array(item.countInStock).keys()].map((x) => (
//                           <option key={x + 1} value={x + 1}>
//                             {x + 1}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Col>
//                     <Col md={2}>
//                       <Button
//                         type="button"
//                         variant="light"
//                         className="text-danger"
//                         onClick={() => dispatch(removeFromCart(item.product))}
//                       >
//                         <Trash2 size={20} />
//                       </Button>
//                     </Col>
//                   </Row>
//                 </ListGroup.Item>
//               ))}
//             </ListGroup>
//           </Col>
//           <Col md={4}>
//             <Card className="border-0 shadow-sm rounded-4">
//               <Card.Body>
//                 <h4 className="fw-bold mb-3">Order Summary</h4>
//                 <ListGroup variant="flush">
//                   <ListGroup.Item className="d-flex justify-content-between px-0">
//                     <span>
//                       Subtotal (
//                       {cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
//                       items)
//                     </span>
//                     <span className="fw-bold">
//                       Rs.{" "}
//                       {cartItems
//                         .reduce((acc, item) => acc + item.qty * item.price, 0)
//                         .toFixed(2)}
//                     </span>
//                   </ListGroup.Item>
//                   <ListGroup.Item className="px-0 pt-4">
//                     <Button
//                       type="button"
//                       className="w-100 btn-primary py-3 rounded-pill fw-bold"
//                       disabled={cartItems.length === 0}
//                       onClick={checkoutHandler}
//                     >
//                       Proceed to Checkout{" "}
//                       <ArrowRight size={18} className="ms-2" />
//                     </Button>
//                   </ListGroup.Item>
//                 </ListGroup>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}
//     </Container>
//   );
// };

// export default Cart;

import React from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  Image,
  Form,
  Card,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Minus,
  Plus,
  AlertCircle,
} from "lucide-react";
import { addToCart, removeFromCart } from "../redux/actions/cartActions";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const updateQtyHandler = (item, newQty) => {
    if (
      newQty > 0 &&
      newQty <= Math.floor(item.countInStock / item.buyingMultiplier)
    ) {
      dispatch(addToCart({ ...item, qty: Number(newQty) }));
    }
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <Container className="py-5 animate-fade-in">
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <ShoppingBag className="text-primary" /> Your Pharmacy Cart
      </h2>

      {cartItems.length === 0 ? (
        <Card className="text-center p-5 border-0 shadow-sm rounded-4">
          <div className="mb-4">
            <ShoppingBag size={80} className="text-muted opacity-25" />
          </div>
          <h4 className="text-muted">Your cart is empty</h4>
          <p className="mb-4">
            Looks like you haven't added any medicines yet.
          </p>
          <Link
            to="/medicines"
            className="btn btn-primary px-4 py-2 rounded-pill"
          >
            Browse Medicines
          </Link>
        </Card>
      ) : (
        <Row className="g-4">
          {/* Cart Items List */}
          <Col lg={8}>
            <ListGroup
              variant="flush"
              className="shadow-sm rounded-4 overflow-hidden"
            >
              {cartItems.map((item) => (
                <ListGroup.Item
                  key={item.product}
                  className="p-4 border-bottom"
                >
                  <Row className="align-items-center g-3">
                    <Col md={2} xs={4}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fluid
                        rounded
                        className="bg-light p-1"
                      />
                    </Col>

                    <Col md={4} xs={8}>
                      <Link
                        to={`/medicine/${item.product}`}
                        className="text-decoration-none"
                      >
                        <h6 className="fw-bold text-dark mb-1">{item.name}</h6>
                      </Link>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                          {item.unit}
                        </span>
                        {item.prescriptionRequired && (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                            Rx Req.
                          </span>
                        )}
                      </div>
                      <small className="text-muted d-block">
                        Price: Rs. {item.price}
                      </small>
                    </Col>

                    <Col
                      md={3}
                      xs={6}
                      className="d-flex justify-content-center"
                    >
                      <div
                        className="input-group input-group-sm border rounded-pill overflow-hidden"
                        style={{ width: "120px" }}
                      >
                        <Button
                          variant="white"
                          className="border-0"
                          onClick={() => updateQtyHandler(item, item.qty - 1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <Form.Control
                          className="text-center border-0 bg-transparent fw-bold"
                          value={item.qty}
                          readOnly
                        />
                        <Button
                          variant="white"
                          className="border-0"
                          onClick={() => updateQtyHandler(item, item.qty + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </Col>

                    <Col md={2} xs={4} className="text-end">
                      <div className="fw-bold text-dark">
                        Rs. {(item.price * item.qty).toFixed(2)}
                      </div>
                    </Col>

                    <Col md={1} xs={2} className="text-end">
                      <Button
                        variant="link"
                        className="text-danger p-0"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <Trash2 size={20} />
                      </Button>
                    </Col>
                  </Row>

                  {/* Stock Warning Logic */}
                  {item.qty * item.buyingMultiplier > item.countInStock && (
                    <div className="mt-2 text-danger small d-flex align-items-center gap-1">
                      <AlertCircle size={14} /> Insufficient stock. Only{" "}
                      {Math.floor(item.countInStock / item.buyingMultiplier)}{" "}
                      {item.unit}s left.
                    </div>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          {/* Order Summary Sidebar */}
          <Col lg={4}>
            <Card
              className="border-0 shadow-sm rounded-4 p-4 sticky-top"
              style={{ top: "100px" }}
            >
              <h5 className="fw-bold mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">
                  Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                </span>
                <span className="fw-medium">
                  Rs.{" "}
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tax (GST 13%)</span>
                <span className="fw-medium">Included</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <h5 className="fw-bold">Total</h5>
                <h5 className="fw-bold text-primary">
                  Rs.{" "}
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </h5>
              </div>

              <Button
                variant="primary"
                className="w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout <ArrowRight size={20} />
              </Button>

              <div className="mt-4 p-3 bg-light rounded-3">
                <small className="text-muted d-flex gap-2">
                  <AlertCircle size={16} className="text-info flex-shrink-0" />
                  Prescription-required items will need to be verified by our
                  pharmacist before shipping.
                </small>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;
