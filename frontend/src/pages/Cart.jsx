import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
  Container,
  Alert,
} from "react-bootstrap";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { addToCart, removeFromCart } from "../redux/actions/cartActions";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const checkoutHandler = () => {
    // Navigate to shipping address input
    navigate("/shipping");
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <Alert variant="info" className="d-flex align-items-center">
          <ShoppingCart className="me-2" />
          Your cart is empty.{" "}
          <Link to="/customer-dashboard" className="ms-2 fw-bold">
            Go Back
          </Link>
        </Alert>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup
              variant="flush"
              className="shadow-sm rounded-3 overflow-hidden"
            >
              {cartItems.map((item) => (
                <ListGroup.Item
                  key={item.product}
                  className="p-4 bg-white border-bottom"
                >
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link
                        to={`/medicine/${item.product}`}
                        className="text-decoration-none fw-bold text-dark"
                      >
                        {item.name}
                      </Link>
                      {item.prescriptionRequired && (
                        <span className="d-block text-danger small">
                          Rx Required
                        </span>
                      )}
                    </Col>
                    <Col md={2} className="fw-bold">
                      Rs. {item.price}
                    </Col>
                    <Col md={2}>
                      <Form.Select
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            addToCart(item.product, Number(e.target.value))
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Button
                        type="button"
                        variant="light"
                        className="text-danger"
                        onClick={() => dispatch(removeFromCart(item.product))}
                      >
                        <Trash2 size={20} />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body>
                <h4 className="fw-bold mb-3">Order Summary</h4>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between px-0">
                    <span>
                      Subtotal (
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
                      items)
                    </span>
                    <span className="fw-bold">
                      Rs.{" "}
                      {cartItems
                        .reduce((acc, item) => acc + item.qty * item.price, 0)
                        .toFixed(2)}
                    </span>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 pt-4">
                    <Button
                      type="button"
                      className="w-100 btn-primary py-3 rounded-pill fw-bold"
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                    >
                      Proceed to Checkout{" "}
                      <ArrowRight size={18} className="ms-2" />
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;
