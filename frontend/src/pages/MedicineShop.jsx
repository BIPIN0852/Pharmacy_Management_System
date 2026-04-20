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

  // --- 2. Fetch Data (ONLY on load or search, NOT on category change) ---
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

        // ✅ FIXED: Category is no longer sent to the backend to force a reload.
        // We fetch everything matching the search and filter instantly on the frontend.

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
  }, [debouncedSearch]); // ✅ Removed `category` from dependency array so it doesn't trigger API calls

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

  // ✅ INSTANT CLIENT-SIDE CATEGORY FILTERING
  const filteredMedicines = useMemo(() => {
    if (category === "All") return medicines;
    return medicines.filter(
      (med) =>
        med.category?.toLowerCase() === category.toLowerCase() ||
        med.type?.toLowerCase() === category.toLowerCase(),
    );
  }, [medicines, category]);

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
    if (!path || path === "" || path === "none") {
      return "https://images.unsplash.com/photo-1584308666744-24d5e478ac5c?q=80&w=600&auto=format&fit=crop";
    }
    if (path.startsWith("http")) {
      return path;
    }
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
      className="min-vh-100 pb-5 animate-fade-in"
      style={{ backgroundColor: "#f1f5f9" }}
    >
      {/* --- TOP NAVBAR --- */}
      <div className="bg-white shadow-sm border-bottom border-light-subtle mb-4">
        <div className="p-3 p-md-4 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border-0 bg-light-hover text-secondary transition-all"
              onClick={() => navigate("/customer-dashboard")}
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h4 className="fw-bold mb-0 text-dark tracking-tight d-flex align-items-center gap-2">
                Pharmacy <span className="text-primary">Store</span>
              </h4>
            </div>
          </div>

          <div className="w-100 flex-grow-1" style={{ maxWidth: "600px" }}>
            <div className="input-group shadow-sm rounded-2 overflow-hidden border border-light-subtle bg-white search-bar-focus transition-all">
              <span className="input-group-text bg-transparent border-0 ps-3 text-muted">
                <Search size={18} />
              </span>
              <input
                type="search"
                className="form-control border-0 shadow-none py-2 px-2"
                placeholder="Search medicines, brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: "0.9rem" }}
              />
              {searchTerm && (
                <button
                  className="btn btn-white border-0 text-muted pe-3 hover-text-danger transition-all"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* E-commerce Category Pills */}
        <div className="px-3 px-md-4 pb-2">
          <div className="d-flex overflow-auto gap-2 pb-2 hide-scrollbar align-items-center">
            <div
              className="d-flex align-items-center text-muted small fw-bold text-uppercase me-2 tracking-wider"
              style={{ fontSize: "0.75rem" }}
            >
              <Filter size={14} className="me-1" /> Filters:
            </div>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm rounded-pill px-3 py-1 fw-medium transition-all text-nowrap ${
                  category === cat
                    ? "btn-primary shadow-sm text-white border-primary"
                    : "btn-outline-secondary bg-white text-dark border-light-subtle hover-bg-gray"
                }`}
                style={{ fontSize: "0.85rem" }}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-fluid px-3 px-md-4">
        {/* --- ADVERTISEMENT / PROMO BANNER --- */}
        {showPromo && (
          <div className="mb-4 rounded-3 overflow-hidden position-relative shadow-sm promo-banner-gradient border-0">
            <div className="row align-items-center p-4 position-relative z-1">
              <div className="col-md-8 text-white">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Badge
                    bg="warning"
                    text="dark"
                    className="px-2 py-1 rounded-1 fw-bold text-uppercase"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Verified
                  </Badge>
                  <span className="text-white-50 small fw-medium">
                    Quality Guaranteed
                  </span>
                </div>
                <h3 className="fw-bold mb-1">100% Genuine Medicines</h3>
                <p
                  className="small text-white text-opacity-75 mb-0 fw-medium"
                  style={{ maxWidth: "500px" }}
                >
                  Order your prescriptions securely. Fast, reliable delivery
                  trusted by thousands.
                </p>
              </div>
              <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <button
                  className="btn btn-sm btn-light text-primary fw-bold rounded-pill px-4 py-2 shadow-sm hover-scale transition-all"
                  onClick={() => setShowPromo(false)}
                >
                  Dismiss
                </button>
              </div>
            </div>
            {/* Decorative Background Elements */}
            <div
              className="position-absolute top-0 end-0 opacity-10"
              style={{ transform: "translate(10%, -30%) scale(1.5)" }}
            >
              <Package size={200} />
            </div>
          </div>
        )}

        {/* --- STATE HANDLING --- */}
        {loading && (
          <div
            className="d-flex flex-column justify-content-center align-items-center py-5 my-5 bg-white rounded-3 shadow-sm border border-light-subtle mx-auto"
            style={{ maxWidth: "400px" }}
          >
            <Loader2 size={40} className="spin-animation text-primary mb-3" />
            <span className="text-dark fw-bold">Loading catalog...</span>
          </div>
        )}

        {loadError && !loading && (
          <div
            className="alert alert-danger bg-white border border-danger border-opacity-25 text-danger shadow-sm rounded-3 d-flex align-items-center gap-3 p-3 mx-auto mt-4"
            style={{ maxWidth: "500px" }}
          >
            <AlertCircle size={24} className="flex-shrink-0" />
            <div className="fw-medium small">{loadError}</div>
          </div>
        )}

        {/* ✅ FIXED: Use `filteredMedicines` instead of `medicines` */}
        {!loading && !loadError && filteredMedicines.length === 0 && (
          <div
            className="text-center text-muted py-5 my-5 bg-white border border-light-subtle rounded-3 mx-auto shadow-sm p-4"
            style={{ maxWidth: "400px" }}
          >
            <Search size={40} className="text-muted opacity-25 mb-3 mx-auto" />
            <h5 className="fw-bold text-dark mb-1">No products found</h5>
            <p className="small text-muted mb-4">
              We couldn't find anything matching "{searchTerm}" in {category}.
            </p>
            <button
              className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-medium shadow-sm transition-all"
              onClick={() => {
                setSearchTerm("");
                setCategory("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* --- E-COMMERCE PRODUCT GRID --- */}
        {/* ✅ FIXED: Map over `filteredMedicines` instead of `medicines` */}
        {!loading && !loadError && filteredMedicines.length > 0 && (
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 g-3">
            {filteredMedicines.map((med) => {
              const qty = getQty(med._id);
              const selection = selectedUnits[med._id] || {
                unitName: med.baseUnit || "Unit",
                price: med.price,
                multiplier: 1,
              };
              const isOutOfStock =
                (med.countInStock || 0) < selection.multiplier;

              return (
                <div key={med._id} className="col">
                  <div className="card h-100 border-light-subtle shadow-sm product-card bg-white position-relative d-flex flex-column transition-all rounded-3">
                    {/* Top Floating Badges & Save Action */}
                    <div
                      className="position-absolute w-100 p-2 d-flex justify-content-between align-items-start"
                      style={{ zIndex: 10 }}
                    >
                      <div className="d-flex flex-column gap-1">
                        {med.prescriptionRequired && (
                          <Badge
                            bg="danger"
                            className="d-flex align-items-center gap-1 shadow-sm px-1 py-1 rounded-1"
                            style={{ fontSize: "0.6rem" }}
                          >
                            <ShieldAlert size={10} /> Rx
                          </Badge>
                        )}
                        {med.discount > 0 && (
                          <Badge
                            bg="success"
                            className="shadow-sm px-1 py-1 rounded-1"
                            style={{ fontSize: "0.6rem" }}
                          >
                            {med.discount}% OFF
                          </Badge>
                        )}
                      </div>

                      <button
                        className={`btn rounded-circle shadow-sm border d-flex align-items-center justify-content-center p-0 transition-all ${savedIds.has(med._id) ? "bg-danger border-danger" : "bg-white border-light-subtle hover-bg-light"}`}
                        style={{ width: "30px", height: "30px" }}
                        onClick={() => handleToggleSave(med._id)}
                        disabled={saveLoading === med._id}
                      >
                        {saveLoading === med._id ? (
                          <Spinner
                            size="sm"
                            className={
                              savedIds.has(med._id)
                                ? "text-white"
                                : "text-primary"
                            }
                            style={{ width: "14px", height: "14px" }}
                          />
                        ) : (
                          <Heart
                            size={16}
                            className={
                              savedIds.has(med._id)
                                ? "text-white"
                                : "text-muted"
                            }
                            fill={savedIds.has(med._id) ? "#ffffff" : "none"}
                          />
                        )}
                      </button>
                    </div>

                    {/* Product Image Presentation */}
                    <div
                      className="p-3 text-center position-relative d-flex align-items-center justify-content-center border-bottom border-light-subtle bg-white rounded-top-3"
                      style={{ height: "150px", overflow: "hidden" }}
                    >
                      <Link to={`/medicine/${med._id}`}>
                        <img
                          src={getImageUrl(med.image)}
                          alt={med.name}
                          className="img-fluid product-img transition-all"
                          style={{
                            maxHeight: "110px",
                            maxWidth: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </Link>

                      {isOutOfStock && (
                        <div
                          className="position-absolute inset-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 rounded-top-3"
                          style={{ zIndex: 5, backdropFilter: "blur(1px)" }}
                        >
                          <span className="badge bg-secondary px-2 py-1 fs-7 shadow-sm rounded-1 text-uppercase tracking-wider border border-white">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Content Details */}
                    <div className="card-body p-3 d-flex flex-column bg-white rounded-bottom-3">
                      {/* Brand */}
                      <div
                        className="mb-1 text-uppercase fw-bold text-muted text-truncate"
                        style={{ fontSize: "0.65rem", letterSpacing: "0.02em" }}
                      >
                        {med.manufacturer || "Generic"}
                      </div>

                      {/* Title */}
                      <h6
                        className="card-title fw-bold mb-2 lh-sm product-title-clamp"
                        style={{ fontSize: "0.95rem" }}
                      >
                        <Link
                          to={`/medicine/${med._id}`}
                          className="text-dark text-decoration-none hover-text-primary transition-all"
                        >
                          {med.name}
                        </Link>
                      </h6>

                      {/* Variant Selection Dropdown */}
                      <div className="mb-2 position-relative mt-auto">
                        <select
                          className="form-select form-select-sm bg-light border-light-subtle shadow-none text-dark fw-medium cursor-pointer rounded-2 py-1 ps-2 pe-4 w-100 appearance-none"
                          style={{ fontSize: "0.8rem" }}
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
                        <ChevronDown
                          size={14}
                          className="position-absolute top-50 end-0 translate-middle-y me-2 text-muted pointer-events-none"
                        />
                      </div>

                      {/* Pricing & Add to Cart Controls */}
                      <div className="pt-2 d-flex flex-column gap-2">
                        {/* Price */}
                        <div className="d-flex align-items-baseline gap-1">
                          <span className="fw-bold text-dark fs-5 lh-1">
                            Rs.{selection.price}
                          </span>
                          <span
                            className="text-muted small fw-medium mb-0"
                            style={{ fontSize: "0.75rem" }}
                          >
                            /{selection.unitName}
                          </span>
                        </div>

                        {/* Action Grid Row */}
                        <div className="d-flex align-items-center gap-2 mt-1">
                          {/* Qty Box */}
                          <div
                            className="d-flex align-items-center justify-content-between bg-white rounded-2 px-1 border border-light-subtle"
                            style={{ height: "32px", width: "40%" }}
                          >
                            <button
                              className="btn btn-link text-dark p-0 text-decoration-none d-flex align-items-center justify-content-center hover-text-primary transition-all"
                              disabled={isOutOfStock || qty <= 1}
                              onClick={() => handleDecrement(med._id)}
                              style={{ width: "24px", height: "24px" }}
                            >
                              <Minus size={14} />
                            </button>
                            <span
                              className="fw-bold text-dark m-0"
                              style={{ fontSize: "0.85rem" }}
                            >
                              {qty}
                            </span>
                            <button
                              className="btn btn-link text-dark p-0 text-decoration-none d-flex align-items-center justify-content-center hover-text-primary transition-all"
                              disabled={
                                isOutOfStock ||
                                (qty + 1) * selection.multiplier >
                                  med.countInStock
                              }
                              onClick={() => handleIncrement(med)}
                              style={{ width: "24px", height: "24px" }}
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Add Button */}
                          <button
                            className="btn btn-primary btn-sm fw-bold d-flex align-items-center justify-content-center gap-1 border-0 flex-grow-1 hover-lift transition-all rounded-2"
                            style={{ height: "32px", fontSize: "0.8rem" }}
                            disabled={isOutOfStock}
                            onClick={() => handleAddToCart(med)}
                          >
                            <ShoppingCart size={14} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- PREMIUM UI STYLES --- */}
      <style>{`
        /* General Utilities */
        .transition-all { transition: all 0.2s ease-in-out; }
        .tracking-tight { letter-spacing: -0.02em; }
        .tracking-wider { letter-spacing: 0.05em; }
        .fw-black { font-weight: 900; }
        .cursor-pointer { cursor: pointer; }
        .pointer-events-none { pointer-events: none; }
        
        /* Interactive States */
        .hover-bg-light:hover { background-color: #f8fafc !important; }
        .hover-bg-gray:hover { background-color: #e2e8f0 !important; }
        .hover-text-primary:hover { color: #0d6efd !important; }
        .hover-text-danger:hover { color: #dc3545 !important; }
        .hover-scale:hover { transform: scale(1.02); }
        .hover-scale:active { transform: scale(0.98); }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08) !important; }

        /* Search Bar Focus */
        .search-bar-focus:focus-within {
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15) !important;
          border-color: #0d6efd !important;
        }

        /* Banner Gradient */
        .promo-banner-gradient {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
        }

        /* Product Card Styling */
        .product-card {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
        }
        .product-card:hover {
          transform: translateY(-3px);
          border-color: #cbd5e1 !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04) !important;
        }

        /* Product Image Hover Zoom */
        .product-card:hover .product-img {
          transform: scale(1.05);
        }

        /* Text Clamping for Titles */
        .product-title-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          min-height: 2.4em; /* Maintains card height consistency */
        }

        /* Hide Native Select Arrow */
        .appearance-none {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        /* Animations */
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }

        /* Scrollbar Hider for Categories */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MedicineShop;
