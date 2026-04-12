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

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItems, setUpdatingItems] = useState({});

  // State to track which items the user has checked/selected
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());

  // Determine exactly which items are currently selected for checkout
  const selectedCartItems = cartItems.filter((item) =>
    selectedItemIds.has(String(item.medicine)),
  );

  // --- Financials (Only calculates based on SELECTED items) ---
  const itemsPrice = selectedCartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.qty || 1),
    0,
  );
  const taxPrice = itemsPrice * 0.13;
  const shippingPrice = itemsPrice > 1000 || itemsPrice === 0 ? 0 : 50;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Check if ANY SELECTED item requires a prescription
  const requiresPrescription = selectedCartItems.some(
    (item) =>
      item.prescriptionRequired === true ||
      String(item.prescriptionRequired) === "true",
  );

  // ✅ FIXED: The user only needs to have items selected to proceed.
  // The actual document upload is now strictly handled on the PlaceOrder screen.
  const canProceed = selectedCartItems.length > 0;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      let currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      let allMedicines = [];

      try {
        const medsResponse = await api.get("/medicines");
        const responseData = medsResponse.data;
        allMedicines = Array.isArray(responseData)
          ? responseData
          : responseData.medicines || responseData.data || [];
      } catch (err) {
        console.warn("Failed to fetch master medicines database.");
      }

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

      const enrichedCart = currentCart.map((item) => {
        const rawId =
          typeof item.medicine === "object"
            ? item.medicine?._id
            : item.medicine;
        const fallbackId =
          typeof item.product === "object" ? item.product?._id : item.product;
        const targetId = String(rawId || fallbackId || item._id);

        const truthData = allMedicines.find(
          (m) => String(m._id) === targetId || String(m.id) === targetId,
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

      // By default, select ALL items when cart loads
      setSelectedItemIds(
        new Set(finalCart.map((item) => String(item.medicine))),
      );
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
      await api
        .post("/cart", { medicineId: id, qty: parseInt(newQty) })
        .catch(() => null);
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

      const newSelected = new Set(selectedItemIds);
      newSelected.delete(String(id));
      setSelectedItemIds(newSelected);

      await api.delete(`/cart/${id}`).catch(() => null);
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleToggleItem = (id) => {
    const newSelected = new Set(selectedItemIds);
    if (newSelected.has(String(id))) {
      newSelected.delete(String(id));
    } else {
      newSelected.add(String(id));
    }
    setSelectedItemIds(newSelected);
  };

  const handleToggleAll = () => {
    if (selectedItemIds.size === cartItems.length) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(
        new Set(cartItems.map((item) => String(item.medicine))),
      );
    }
  };

  const checkoutHandler = () => {
    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        cartItems: selectedCartItems,
        totalPrice,
        requiresPrescription,
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
          Synchronizing Cart...
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
            onClick={() => navigate("/medicines")}
          >
            <ArrowLeft size={18} className="me-1" /> Continue Shopping
          </Button>
        </div>

        {cartItems.length > 0 && (
          <Row className="mb-3">
            <Col lg={8}>
              {/* ✅ UPDATED: Informational Alert Only */}
              {requiresPrescription && selectedCartItems.length > 0 && (
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
                        Prescription & ID Will Be Required
                      </h6>
                      <span className="small text-dark">
                        One or more selected items require a valid prescription
                        and a matching supportive ID for verification.{" "}
                        <strong>
                          You will be asked to securely upload these documents
                          during the final checkout step.
                        </strong>
                      </span>
                    </div>
                  </Alert>
                </div>
              )}

              <Card
                className="border-0 rounded-1 shadow-sm mb-3"
                style={{ borderColor: "#D5D9D9" }}
              >
                <Card.Body className="p-4">
                  <h3 className="fw-normal mb-2" style={{ color: "#0F1111" }}>
                    Shopping Cart
                  </h3>

                  <div className="d-flex align-items-center pb-2">
                    <Form.Check
                      type="checkbox"
                      id="select-all"
                      checked={
                        selectedItemIds.size === cartItems.length &&
                        cartItems.length > 0
                      }
                      onChange={handleToggleAll}
                      className="amazon-checkbox me-2"
                      style={{ transform: "scale(1.2)", cursor: "pointer" }}
                    />
                    <label
                      htmlFor="select-all"
                      className="text-muted small"
                      style={{ cursor: "pointer" }}
                    >
                      {selectedItemIds.size === cartItems.length
                        ? "Deselect all items"
                        : "Select all items"}
                    </label>
                  </div>
                  <hr className="mt-0" style={{ borderColor: "#D5D9D9" }} />

                  {error && (
                    <Alert variant="danger" className="border-0 rounded-1">
                      {error}
                    </Alert>
                  )}

                  {cartItems.map((item) => {
                    const itemId = String(item.medicine);
                    const isRx =
                      item.prescriptionRequired === true ||
                      String(item.prescriptionRequired) === "true";
                    const isSelected = selectedItemIds.has(itemId);

                    return (
                      <div
                        key={itemId}
                        className={`mb-4 pb-4 border-bottom border-light-subtle ${!isSelected ? "opacity-50" : ""}`}
                        style={{ transition: "opacity 0.2s" }}
                      >
                        <Row className="align-items-center">
                          <Col xs={1} className="text-center px-0 pe-2">
                            <Form.Check
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleItem(itemId)}
                              className="amazon-checkbox m-0"
                              style={{
                                transform: "scale(1.3)",
                                cursor: "pointer",
                              }}
                            />
                          </Col>

                          <Col xs={3} md={2} className="ps-0">
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

                          <Col xs={8} md={9}>
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
                                      disabled={
                                        updatingItems[itemId] || !isSelected
                                      }
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
                      Subtotal ({selectedCartItems.length} items):{" "}
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
                  {shippingPrice === 0 && selectedCartItems.length > 0 ? (
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
                          NPR {Math.max(0, 1000 - itemsPrice).toFixed(2)}
                        </b>{" "}
                        of eligible items to get <b>FREE Shipping</b>.
                      </div>
                    </div>
                  )}

                  <h4 className="fw-normal mb-3" style={{ color: "#0F1111" }}>
                    Subtotal ({selectedCartItems.length} items):{" "}
                    <span className="fw-bold d-block mt-1">
                      NPR {totalPrice.toFixed(2)}
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
                    {selectedCartItems.length === 0
                      ? "Select items to buy"
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
                      <span>Items ({selectedCartItems.length}):</span>
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
                      <span>NPR {taxPrice.toFixed(2)}</span>
                    </div>
                    <hr style={{ borderColor: "#D5D9D9" }} />
                    <div
                      className="d-flex justify-content-between fw-bold h5 mb-0"
                      style={{ color: "#B12704" }}
                    >
                      <span>Total:</span>
                      <span>NPR {totalPrice.toFixed(2)}</span>
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
        .amazon-checkbox:checked { background-color: #007185 !important; border-color: #007185 !important; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default CartPage;
