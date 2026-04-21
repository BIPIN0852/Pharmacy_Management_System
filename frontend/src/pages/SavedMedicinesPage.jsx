import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import { Trash2, ShoppingCart, Heart, Plus, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/actions/cartActions";
import api from "../services/api";

const SavedMedicinesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const fetchSavedItems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/customer/saved-medicines");

      // Safety Check: Ensure data is an array
      const items = Array.isArray(data) ? data : [];
      setSavedItems(items);

      // Initialize quantities
      const initialQty = {};
      items.forEach((med) => {
        if (med && med._id) initialQty[med._id] = 1;
      });
      setQuantities(initialQty);
    } catch (err) {
      console.error("Error loading wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  // DELETE ACTION HANDLER
  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this saved item?"))
      return;
    try {
      // 1. Call API to delete
      await api.delete(`/customer/saved-medicines/${id}`);

      // 2. Update UI instantly (Optimistic Update)
      setSavedItems((prev) => prev.filter((med) => med._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleQuantityChange = (medId, change, maxStock) => {
    setQuantities((prev) => {
      const current = prev[medId] || 1;
      const newQty = current + change;
      if (newQty < 1 || newQty > maxStock) return prev;
      return { ...prev, [medId]: newQty };
    });
  };

  const handleAddToCart = (med) => {
    if (!med || med.countInStock === 0) return;
    const qty = quantities[med._id] || 1;

    dispatch(
      addToCart({
        medicine: med._id,
        name: med.name,
        image: med.image,
        stock: med.countInStock,
        unit: med.baseUnit || "Unit",
        price: med.price,
        buyingMultiplier: 1,
        qty: qty,
      }),
    );
    alert("Added to cart!");
  };

  if (loading)
    return (
      <Container
        className="py-5 text-center d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" style={{ color: "#007185" }} />
        <p className="mt-3 text-muted small">Loading your saved items...</p>
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
      <Container className="py-4 animate-fade-in">
        <div
          className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-1 border shadow-sm"
          style={{ borderColor: "#D5D9D9" }}
        >
          <h3 className="fw-normal text-dark mb-0 d-flex align-items-center gap-2">
            Your Lists{" "}
            <span className="text-muted fs-5 fw-light">| Saved Medicines</span>
          </h3>
          <span className="text-muted small fw-medium">
            {savedItems.length} items
          </span>
        </div>

        {savedItems.length === 0 ? (
          <div
            className="text-center py-5 bg-white rounded-1 border shadow-sm"
            style={{ borderColor: "#D5D9D9" }}
          >
            <Heart size={48} className="text-muted opacity-25 mb-3" />
            <h5 className="fw-normal text-dark">
              Your list is currently empty
            </h5>
            <p className="text-muted small">
              Browse our store and click the heart icon to save items for later.
            </p>
            <Button
              variant="warning"
              className="mt-3 px-4 py-2 border-0 shadow-sm"
              style={{
                backgroundColor: "#FFD814",
                borderRadius: "8px",
                color: "#0F1111",
                fontWeight: "500",
              }}
              onClick={() => navigate("/medicines")}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <Row className="g-3">
            {savedItems.map((med) => {
              // 1. Handle Broken/Ghost Items (Data integrity check)
              if (!med || !med._id) {
                return null;
              }

              const currentQty = quantities[med._id] || 1;
              const isOutOfStock = (med.countInStock || 0) === 0;

              return (
                <Col key={med._id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    className="h-100 shadow-sm rounded-1 amazon-product-card"
                    style={{ border: "1px solid #D5D9D9" }}
                  >
                    {/* Delete Button (Top Right) */}
                    <button
                      className="btn btn-link position-absolute top-0 end-0 p-2 text-muted hover-danger"
                      style={{ zIndex: 10 }}
                      onClick={() => handleRemove(med._id)}
                      title="Remove from list"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div
                      className="text-center p-4 position-relative bg-white"
                      style={{ minHeight: "160px", cursor: "pointer" }}
                      onClick={() => navigate(`/medicine/${med._id}`)}
                    >
                      <img
                        src={
                          med.image?.startsWith("http")
                            ? med.image
                            : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${med.image}`
                        }
                        alt={med.name}
                        className="img-fluid"
                        style={{
                          height: "120px",
                          objectFit: "contain",
                          mixBlendMode: "multiply",
                        }}
                      />
                    </div>

                    <Card.Body className="d-flex flex-column bg-white pt-0">
                      <div
                        className="fw-medium text-truncate mb-1"
                        title={med.name}
                        style={{
                          color: "#007185",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                        }}
                        onClick={() => navigate(`/medicine/${med._id}`)}
                      >
                        {med.name}
                      </div>
                      <small
                        className="text-muted mb-2"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {med.manufacturer || "Generic Provider"}
                      </small>

                      <div
                        className="h5 fw-bold mb-3"
                        style={{ color: "#B12704" }}
                      >
                        NPR {med.price?.toLocaleString()}
                      </div>

                      {isOutOfStock ? (
                        <div className="text-danger small fw-bold mb-3">
                          Temporarily out of stock
                        </div>
                      ) : (
                        <div
                          className="text-success small fw-bold mb-3"
                          style={{ color: "#067D62 !important" }}
                        >
                          In Stock
                        </div>
                      )}

                      <div className="mt-auto">
                        {/* Quantity Selector */}
                        <div
                          className="d-flex align-items-center justify-content-between rounded-1 p-1 mb-2"
                          style={{
                            backgroundColor: "#F0F2F2",
                            border: "1px solid #D5D9D9",
                          }}
                        >
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 text-dark"
                            onClick={() =>
                              handleQuantityChange(
                                med._id,
                                -1,
                                med.countInStock,
                              )
                            }
                            disabled={isOutOfStock || currentQty <= 1}
                          >
                            <Minus size={16} />
                          </Button>
                          <span
                            className="fw-bold small"
                            style={{ color: "#0F1111" }}
                          >
                            {currentQty}
                          </span>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 text-dark"
                            onClick={() =>
                              handleQuantityChange(med._id, 1, med.countInStock)
                            }
                            disabled={
                              isOutOfStock || currentQty >= med.countInStock
                            }
                          >
                            <Plus size={16} />
                          </Button>
                        </div>

                        {/* Action Button */}
                        <Button
                          variant="warning"
                          size="sm"
                          className="w-100 py-2 border-0 shadow-sm fw-medium d-flex align-items-center justify-content-center"
                          disabled={isOutOfStock}
                          onClick={() => handleAddToCart(med)}
                          style={{
                            backgroundColor: "#FFD814",
                            borderRadius: "8px",
                            color: "#0F1111",
                          }}
                        >
                          <ShoppingCart size={16} className="me-2" /> Add to
                          Cart
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>

      <style>{`
        .amazon-product-card { transition: box-shadow 0.2s; }
        .amazon-product-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; }
        .hover-danger:hover { color: #B12704 !important; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default SavedMedicinesPage;
