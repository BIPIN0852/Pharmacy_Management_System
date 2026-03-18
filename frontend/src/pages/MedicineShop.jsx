import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Package,
  Filter,
  ShoppingCart,
  Heart,
  ArrowLeft,
  ShieldAlert,
  Plus,
  Minus,
  ChevronDown,
  AlertCircle,
  Loader2,
  Tag,
  X,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/actions/cartActions";
import api from "../services/api";
import { Spinner, OverlayTrigger, Tooltip, Badge } from "react-bootstrap";

const MedicineShop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- State ---
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [showPromo, setShowPromo] = useState(true);

  // Unit Selection State
  const [quantities, setQuantities] = useState({});
  const [selectedUnits, setSelectedUnits] = useState({});

  // Saved Items State
  const [savedIds, setSavedIds] = useState(new Set());
  const [saveLoading, setSaveLoading] = useState(null);

  // --- 1. Debounce Search ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- 2. Fetch Data ---
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        setLoading(true);
        setLoadError("");
      }

      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append("keyword", debouncedSearch);
        if (category !== "All") params.append("category", category);

        const res = await api.get(`/medicines?${params.toString()}`);

        if (isMounted) {
          const medList = Array.isArray(res.data)
            ? res.data
            : res.data.medicines || [];
          setMedicines(medList);

          const defaultUnits = {};
          medList.forEach((m) => {
            defaultUnits[m._id] = {
              unitName: m.baseUnit || "Unit",
              price: m.price,
              multiplier: 1,
            };
          });
          setSelectedUnits((prev) => ({ ...prev, ...defaultUnits }));
        }

        if (isMounted) {
          await fetchSavedStatus();
        }
      } catch (err) {
        if (isMounted) setLoadError(err.message || "Failed to load medicines");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, category]);

  // ROBUST FETCH SAVED STATUS
  const fetchSavedStatus = async () => {
    try {
      const { data } = await api.get("/customer/saved-medicines");
      if (!Array.isArray(data)) {
        setSavedIds(new Set());
        return;
      }
      const ids = new Set(
        data
          .map((item) => {
            if (item.medicine && typeof item.medicine === "object")
              return item.medicine._id;
            return item.medicine || item._id;
          })
          .filter((id) => id),
      );
      setSavedIds(ids);
    } catch (err) {
      console.error("Wishlist sync failed:", err.message);
      setSavedIds(new Set());
    }
  };

  // --- Handlers ---
  const getQty = (id) => quantities[id] || 1;

  const handleIncrement = (med) => {
    const currentQty = getQty(med._id);
    const selection = selectedUnits[med._id] || { multiplier: 1 };
    if ((currentQty + 1) * selection.multiplier <= med.countInStock) {
      setQuantities({ ...quantities, [med._id]: currentQty + 1 });
    }
  };

  const handleDecrement = (id) => {
    const currentQty = getQty(id);
    if (currentQty > 1) setQuantities({ ...quantities, [id]: currentQty - 1 });
  };

  const handleUnitChange = (med, unitName) => {
    let newSelection = {};
    if (unitName === (med.baseUnit || "Unit")) {
      newSelection = {
        unitName: med.baseUnit || "Unit",
        price: med.price,
        multiplier: 1,
      };
    } else {
      const unit = med.units.find((u) => u.name === unitName);
      if (unit)
        newSelection = {
          unitName: unit.name,
          price: unit.price,
          multiplier: unit.multiplier,
        };
    }
    setSelectedUnits((prev) => ({ ...prev, [med._id]: newSelection }));
    setQuantities((prev) => ({ ...prev, [med._id]: 1 }));
  };

  const handleAddToCart = async (med) => {
    const qty = getQty(med._id);
    const selection = selectedUnits[med._id] || {
      unitName: "Unit",
      price: med.price,
      multiplier: 1,
    };

    if (qty * selection.multiplier > med.countInStock) {
      alert("Not enough stock available!");
      return;
    }

    try {
      await api.post("/cart", {
        medicineId: med._id,
        qty: qty,
        unit: selection.unitName,
      });

      dispatch(
        addToCart({
          medicine: med._id || med.id,
          name: med.name,
          image: med.image,
          stock: med.quantity,
          unit: selection.unitName,
          price: selection.price,
          buyingMultiplier: selection.multiplier,
          qty: qty,
        }),
      );

      alert(`${qty} x ${med.name} added to your cart!`);
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const handleToggleSave = async (medicineId) => {
    try {
      setSaveLoading(medicineId);
      const { data } = await api.post("/customer/saved-medicines", {
        medicineId,
      });
      setSavedIds((prev) => {
        const newSet = new Set(prev);
        if (data.isSaved) newSet.add(medicineId);
        else newSet.delete(medicineId);
        return newSet;
      });
    } catch (err) {
      alert("Could not update wishlist.");
    } finally {
      setSaveLoading(null);
    }
  };

  const getImageUrl = (path) => {
    // 1. If there is no image in the database, show a premium default medical image
    if (!path || path === "" || path === "none") {
      // You can swap this URL with any image you like!
      return "https://images.unsplash.com/photo-1584308666744-24d5e478ac5c?q=80&w=600&auto=format&fit=crop";
    }

    // 2. If the database has a full web link, use it directly
    if (path.startsWith("http")) {
      return path;
    }

    // 3. If it's an uploaded file path from your backend (e.g., /uploads/med.jpg)
    return `http://localhost:5000${path}`;
  };
  const categoriesList = [
    "All",
    "Tablet",
    "Capsule",
    "Syrup",
    "Injection",
    "Ointment",
    "Drops",
    "Inhaler",
    "Surgical",
    "Device",
    "Personal Care",
    "General",
  ];

  return (
    <div
      className="medical-dashboard-bg min-vh-100 py-4 px-3 px-md-4 px-xl-5 animate-fade-in"
      style={{ backgroundColor: "#f4f7fe" }}
    >
      {/* --- TOP NAVBAR --- */}
      <div
        className="bg-white border-bottom sticky-top shadow-sm"
        style={{ top: 0, zIndex: 1020, padding: "12px 0" }}
      >
        <div className="container-fluid px-4 px-xl-5 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border text-secondary"
              onClick={() => navigate("/customer-dashboard")}
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
            <h3 className="fw-black mb-0 text-dark tracking-tight d-flex align-items-center gap-2">
              <Package className="text-primary" size={28} />
              Pharmacy <span className="text-primary">Store</span>
            </h3>
          </div>

          <div className="w-100 flex-grow-1" style={{ maxWidth: "600px" }}>
            <div className="input-group shadow-sm rounded-pill overflow-hidden border border-primary border-opacity-25">
              <span className="input-group-text bg-white border-0 ps-4 text-primary">
                <Search size={18} />
              </span>
              <input
                type="search"
                className="form-control border-0 shadow-none py-2"
                placeholder="Search for medicines, health products, brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: "0.95rem" }}
              />
              {searchTerm && (
                <button
                  className="btn btn-white border-0 text-muted pe-4"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* E-commerce Category Pills */}
        <div className="container-fluid px-4 px-xl-5 mt-3">
          <div className="d-flex overflow-auto gap-2 pb-2 hide-scrollbar align-items-center">
            <div className="d-flex align-items-center text-muted small fw-bold text-uppercase me-2">
              <Filter size={14} className="me-1" /> Categories:
            </div>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm rounded-pill px-4 fw-medium transition-all text-nowrap border ${
                  category === cat
                    ? "btn-primary shadow-sm"
                    : "btn-white text-dark hover-bg-light"
                }`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 px-xl-5 pt-4">
        {/* --- ADVERTISEMENT / PROMO BANNER --- */}
        {showPromo && (
          <div
            className="mb-4 rounded-4 overflow-hidden position-relative shadow-sm"
            style={{
              background: "linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%)",
            }}
          >
            <div className="row align-items-center p-4 p-md-4 position-relative z-1">
              <div className="col-md-8 text-white">
                <h4 className="fw-black mb-1">100% Genuine Medicines</h4>
                <p className="fs-6 text-white text-opacity-75 mb-0 fw-light">
                  Order your prescription and health products securely. Fast
                  delivery, trusted by thousands.
                </p>
              </div>
              <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <button
                  className="btn btn-info fw-bold rounded-pill px-5 shadow"
                  onClick={() => setShowPromo(false)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STATE HANDLING --- */}
        {loading && (
          <div className="d-flex flex-column justify-content-center align-items-center py-5 my-5">
            <Loader2 size={48} className="spin-animation text-primary mb-3" />
            <span className="text-muted fw-bold">Fetching inventory...</span>
          </div>
        )}

        {loadError && !loading && (
          <div className="alert alert-danger bg-danger bg-opacity-10 border-0 text-danger shadow-sm rounded-4 d-flex align-items-center gap-2 max-w-md mx-auto mt-4">
            <AlertCircle size={20} /> {loadError}
          </div>
        )}

        {!loading && !loadError && medicines.length === 0 && (
          <div
            className="text-center text-muted py-5 my-5 bg-white border rounded-4 mx-auto shadow-sm"
            style={{ maxWidth: "500px" }}
          >
            <Package
              size={48}
              className="mb-3 opacity-25 mx-auto text-primary"
            />
            <h5 className="fw-bold text-dark">No products found</h5>
            <p className="mb-0 small">
              Try adjusting your search criteria or category filter.
            </p>
            <button
              className="btn btn-outline-primary rounded-pill mt-4 px-4 fw-bold"
              onClick={() => {
                setSearchTerm("");
                setCategory("All");
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* --- E-COMMERCE PRODUCT GRID --- */}
        {!loading && !loadError && medicines.length > 0 && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3 g-xl-4">
            {medicines.map((med) => {
              const qty = getQty(med._id);
              const selection = selectedUnits[med._id] || {
                unitName: med.baseUnit || "Unit",
                price: med.price,
                multiplier: 1,
              };
              const totalPrice = (selection.price * qty).toFixed(2);
              const isOutOfStock =
                (med.countInStock || 0) < selection.multiplier;

              return (
                <div key={med._id} className="col">
                  <div className="card h-100 border-light-subtle shadow-sm rounded-4 overflow-hidden ecom-card bg-white position-relative d-flex flex-column">
                    {/* ✅ FIXED: Wishlist Button (Removed btn class padding issues) */}
                    <button
                      className="position-absolute top-0 end-0 m-2 bg-white rounded-circle shadow-sm border border-light-subtle d-flex align-items-center justify-content-center hover-lift p-0"
                      style={{ width: "36px", height: "36px", zIndex: 10 }}
                      onClick={() => handleToggleSave(med._id)}
                      disabled={saveLoading === med._id}
                    >
                      {saveLoading === med._id ? (
                        <Spinner
                          size="sm"
                          className="text-primary"
                          style={{ width: "16px", height: "16px" }}
                        />
                      ) : (
                        <Heart
                          size={18}
                          className={
                            savedIds.has(med._id) ? "text-danger" : "text-muted"
                          }
                          fill={savedIds.has(med._id) ? "#ef4444" : "none"}
                        />
                      )}
                    </button>

                    {/* Rx Badge */}
                    {med.prescriptionRequired && (
                      <div
                        className="position-absolute top-0 start-0 m-2"
                        style={{ zIndex: 10 }}
                      >
                        <Badge
                          bg="warning"
                          text="dark"
                          className="d-flex align-items-center gap-1 shadow-sm border border-warning px-2 py-1"
                        >
                          <ShieldAlert size={12} /> Rx
                        </Badge>
                      </div>
                    )}

                    {/* Product Image */}
                    <div
                      className="bg-white p-3 text-center position-relative border-bottom border-light-subtle d-flex align-items-center justify-content-center"
                      style={{ height: "180px" }}
                    >
                      <Link to={`/medicine/${med._id}`}>
                        <img
                          src={getImageUrl(med.image)}
                          alt={med.name}
                          className="img-fluid ecom-img transition-all"
                          style={{ maxHeight: "130px", objectFit: "contain" }}
                        />
                      </Link>

                      {isOutOfStock && (
                        <div
                          className="position-absolute inset-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75"
                          style={{ zIndex: 5 }}
                        >
                          <span className="badge bg-danger px-3 py-2 fs-6 shadow-sm">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="card-body p-3 d-flex flex-column">
                      <div className="mb-1 text-muted small text-truncate">
                        {med.manufacturer || "Generic Manufacturer"}
                      </div>
                      <h6 className="card-title fw-bold mb-2">
                        <Link
                          to={`/medicine/${med._id}`}
                          className="text-dark text-decoration-none hover-text-primary lh-sm product-title"
                        >
                          {med.name}
                        </Link>
                      </h6>

                      {/* Price Display */}
                      <div className="mb-3 d-flex align-items-end gap-1">
                        <span className="fw-black text-dark fs-5 lh-1">
                          Rs.{selection.price}
                        </span>
                        <span className="text-muted small mb-0 lh-1">
                          / {selection.unitName}
                        </span>
                      </div>

                      {/* Variant Selector */}
                      <div className="mt-auto mb-3">
                        <select
                          className="form-select form-select-sm border-light-subtle bg-light text-dark cursor-pointer fw-medium shadow-none w-100"
                          value={selection.unitName}
                          onChange={(e) =>
                            handleUnitChange(med, e.target.value)
                          }
                        >
                          <option value={med.baseUnit || "Unit"}>
                            {med.baseUnit || "Unit"} (1x)
                          </option>
                          {med.units &&
                            med.units.map((u, idx) => (
                              <option key={idx} value={u.name}>
                                {u.name} (x{u.multiplier})
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* ✅ FIXED: Quantity & Add to Cart (Responsive split) */}
                      <div className="d-flex align-items-center gap-2 mt-1">
                        {/* 45% Width for Qty */}
                        <div
                          className="d-flex align-items-center justify-content-between border border-primary border-opacity-50 rounded-pill bg-white px-2 shadow-sm"
                          style={{ height: "36px", width: "45%" }}
                        >
                          <button
                            className="btn btn-link text-primary p-0 m-0 text-decoration-none d-flex align-items-center justify-content-center"
                            disabled={isOutOfStock || qty <= 1}
                            onClick={() => handleDecrement(med._id)}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="fw-bold text-dark small m-0">
                            {qty}
                          </span>
                          <button
                            className="btn btn-link text-primary p-0 m-0 text-decoration-none d-flex align-items-center justify-content-center"
                            disabled={
                              isOutOfStock ||
                              (qty + 1) * selection.multiplier >
                                med.countInStock
                            }
                            onClick={() => handleIncrement(med)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* 55% Width for Add Button */}
                        <button
                          className="btn btn-primary rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1 ecom-btn p-0"
                          style={{ height: "36px", width: "55%" }}
                          disabled={isOutOfStock}
                          onClick={() => handleAddToCart(med)}
                        >
                          <ShoppingCart size={16} />{" "}
                          <span className="small">Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineShop;
