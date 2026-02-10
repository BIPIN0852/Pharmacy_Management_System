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
import {
  Trash2,
  ShoppingCart,
  Heart,
  AlertTriangle,
  Plus,
  Minus,
} from "lucide-react";
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
      setSavedItems(data);

      // Initialize quantities
      const initialQty = {};
      data.forEach((item) => {
        if (item.medicine) initialQty[item.medicine._id] = 1;
      });
      setQuantities(initialQty);
    } catch (err) {
      console.error("Error loading wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE ACTION HANDLER
  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this saved item?"))
      return;
    try {
      // 1. Call API to delete
      await api.delete(`/customer/saved-medicines/${id}`);

      // 2. Update UI instantly (Optimistic Update)
      setSavedItems((prev) =>
        prev.filter((item) => {
          const itemId = item.medicine?._id || item._id;
          return itemId !== id && item._id !== id;
        })
      );
    } catch (err) {
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
      })
    );
    alert("Added to cart!");
  };

  if (loading)
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container className="py-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary mb-0">Saved Medicines</h3>
        <Badge bg="primary">{savedItems.length} Items</Badge>
      </div>

      {savedItems.length === 0 ? (
        <div className="text-center py-5 bg-light rounded border">
          <Heart size={48} className="text-muted opacity-25 mb-3" />
          <h5>Your wishlist is empty</h5>
          <Link to="/medicines" className="btn btn-primary mt-3">
            Browse Store
          </Link>
        </div>
      ) : (
        <Row className="g-4">
          {savedItems.map((item) => {
            const med = item.medicine;
            const fallbackId = item._id; // Use Document ID if medicine is null

            // 1. Handle Broken/Ghost Items (Allows Deleting them!)
            if (!med) {
              return (
                <Col key={fallbackId} md={6} lg={4} xl={3}>
                  <Card className="h-100 border-danger bg-light opacity-75">
                    <Card.Body className="text-center d-flex flex-column align-items-center justify-content-center">
                      <AlertTriangle size={32} className="text-danger mb-2" />
                      <h6 className="text-danger">Item Unavailable</h6>
                      {/* ✅ DELETE BUTTON for broken items */}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleRemove(fallbackId)}
                      >
                        <Trash2 size={14} className="me-1" /> Remove
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            }

            // 2. Normal Item Card
            const currentQty = quantities[med._id] || 1;
            const isOutOfStock = med.countInStock === 0;

            return (
              <Col key={med._id} md={6} lg={4} xl={3}>
                <Card className="h-100 shadow-sm border-0 hover-shadow">
                  <div
                    className="text-center bg-light p-3 position-relative"
                    style={{ minHeight: "180px" }}
                  >
                    <img
                      src={
                        med.image?.startsWith("http")
                          ? med.image
                          : `http://localhost:5000${med.image}`
                      }
                      alt={med.name}
                      className="img-fluid cursor-pointer"
                      style={{
                        height: "140px",
                        objectFit: "contain",
                        mixBlendMode: "multiply",
                      }}
                      onClick={() => navigate(`/medicine/${med._id}`)}
                    />
                    {isOutOfStock && (
                      <Badge
                        bg="danger"
                        className="position-absolute top-0 start-0 m-2"
                      >
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  <Card.Body className="d-flex flex-column">
                    <h6 className="fw-bold text-truncate" title={med.name}>
                      {med.name}
                    </h6>
                    <small className="text-muted mb-2">
                      {med.manufacturer}
                    </small>
                    <div className="h5 text-primary mb-3">₹{med.price}</div>

                    <div className="mt-auto">
                      {/* Quantity Selector */}
                      <div className="d-flex align-items-center justify-content-between bg-light rounded p-1 mb-2">
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-dark"
                          onClick={() =>
                            handleQuantityChange(med._id, -1, med.countInStock)
                          }
                          disabled={isOutOfStock}
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="fw-bold small">{currentQty}</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-dark"
                          onClick={() =>
                            handleQuantityChange(med._id, 1, med.countInStock)
                          }
                          disabled={isOutOfStock}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>

                      <div className="d-flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-grow-1"
                          disabled={isOutOfStock}
                          onClick={() => handleAddToCart(med)}
                        >
                          <ShoppingCart size={16} className="me-1" /> Add
                        </Button>

                        {/* ✅ DELETE BUTTON */}
                        <Button
                          variant="light"
                          className="text-danger border"
                          size="sm"
                          onClick={() => handleRemove(med._id)} // Uses Medicine ID
                          title="Remove from saved"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
      <style>{`.hover-shadow:hover { box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; transition: 0.2s; } .cursor-pointer { cursor: pointer; } .animate-fade-in { animation: fadeIn 0.5s ease; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </Container>
  );
};

export default SavedMedicinesPage;
