import React, { useEffect } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../redux/actions/orderActions"; // Needs this action, see below
import CheckoutSteps from "../components/CheckoutSteps";

const API_BASE_URL = "http://localhost:5000/api";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  // Calculations
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  cart.shippingPrice = addDecimals(cart.itemsPrice > 500 ? 0 : 50); // Free ship over Rs. 500
  cart.taxPrice = addDecimals(Number((0.1 * cart.itemsPrice).toFixed(2))); // 10% tax
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  useEffect(() => {
    if (!cart.shippingAddress.address) navigate("/shipping");
  }, [cart.shippingAddress, navigate]);

  const placeOrderHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: "Pending", // Will be set in Payment Page
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // ✅ CRITICAL: Redirect to Payment Page with the new Order ID
        navigate(`/payment?orderId=${data._id}&amount=${cart.totalPrice}`);
      } else {
        alert("Order Failed: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error placing order");
    }
  };

  return (
    <Container className="py-5">
      {/* <CheckoutSteps step1 step2 step3 /> */}
      <Row>
        <Col md={8}>
          <ListGroup
            variant="flush"
            className="shadow-sm rounded-4 overflow-hidden mb-4"
          >
            <ListGroup.Item className="p-4">
              <h4 className="fw-bold">Shipping</h4>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item className="p-4">
              <h4 className="fw-bold">Order Items</h4>
              {cart.cartItems.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index} className="px-0">
                      <Row className="align-items-center">
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link
                            to={`/medicine/${item.product}`}
                            className="fw-bold text-dark text-decoration-none"
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4} className="text-end">
                          {item.qty} x Rs.{item.price} ={" "}
                          <strong>Rs.{item.qty * item.price}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body>
              <h4 className="fw-bold mb-4">Order Summary</h4>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Items</span>
                  <span>Rs. {cart.itemsPrice}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Shipping</span>
                  <span>Rs. {cart.shippingPrice}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Tax (10%)</span>
                  <span>Rs. {cart.taxPrice}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0 border-top pt-3 mt-2">
                  <h5 className="fw-bold">Total</h5>
                  <h5 className="fw-bold text-primary">
                    Rs. {cart.totalPrice}
                  </h5>
                </ListGroup.Item>

                <ListGroup.Item className="px-0 pt-4">
                  <Button
                    type="button"
                    className="w-100 btn-primary py-3 rounded-pill fw-bold"
                    disabled={cart.cartItems.length === 0}
                    onClick={placeOrderHandler}
                  >
                    Confirm & Pay
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrder;
