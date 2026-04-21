import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Package,
  Filter,
  ShoppingCart,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/actions/cartActions";
import api from "../services/api";
import { Spinner } from "react-bootstrap";

const CustomerMedicines = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- State ---
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  //  Unit Selection State
  // Format: { [medicineId]: { unitName: "Strip", price: 50, multiplier: 10 } }
  const [selectedUnits, setSelectedUnits] = useState({});

  //  Saved Items State
  const [savedIds, setSavedIds] = useState(new Set());
  const [saveLoading, setSaveLoading] = useState(null);

  // --- Effects ---
  useEffect(() => {
    fetchMedicines();
    fetchSavedStatus();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const res = await api.get("/medicines");
      const medList = Array.isArray(res.data)
        ? res.data
        : res.data.medicines || [];
      setMedicines(medList);

      // Initialize default selections (Base Unit)
      const defaults = {};
      medList.forEach((m) => {
        defaults[m._id] = {
          unitName: m.baseUnit || "Unit",
          price: m.price,
          multiplier: 1,
        };
      });
      setSelectedUnits(defaults);
    } catch (err) {
      console.error("Failed to fetch medicines:", err);
      setLoadError("Unable to load medicines.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedStatus = async () => {
    try {
      const { data } = await api.get("/customer/saved-medicines");
      const ids = new Set(data.map((item) => item.medicine._id));
      setSavedIds(ids);
    } catch (error) {
      console.error("Error fetching saved items", error);
    }
  };

  // --- Handlers ---

  // 1. Unit Change Handler
  const handleUnitChange = (medicine, unitName) => {
    let newSelection = {};

    if (unitName === (medicine.baseUnit || "Unit")) {
      newSelection = {
        unitName: medicine.baseUnit || "Unit",
        price: medicine.price,
        multiplier: 1,
      };
    } else {
      const unit = medicine.units.find((u) => u.name === unitName);
      if (unit) {
        newSelection = {
          unitName: unit.name,
          price: unit.price,
          multiplier: unit.multiplier,
        };
      }
    }

    setSelectedUnits((prev) => ({
      ...prev,
      [medicine._id]: newSelection,
    }));
  };

  // 2. Add to Cart Handler
  const handleAddToCart = (med) => {
    const selection = selectedUnits[med._id] || {
      unitName: med.baseUnit || "Unit",
      price: med.price,
      multiplier: 1,
    };

    if ((med.quantity || 0) < selection.multiplier) {
      alert("Insufficient stock for this pack size.");
      return;
    }

    dispatch(
      addToCart({
        medicine: med._id || med.id,
        name: med.name,
        image: med.image,
        stock: med.quantity, // Total base units
        unit: selection.unitName,
        price: selection.price,
        buyingMultiplier: selection.multiplier,
        qty: 1,
      }),
    );
    alert("Added to cart!");
  };

  // 3. Save/Unsave Handler
  const handleToggleSave = async (medicineId) => {
    try {
      setSaveLoading(medicineId);
      if (savedIds.has(medicineId)) {
        await api.delete(`/customer/saved-medicines/${medicineId}`);
        setSavedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(medicineId);
          return newSet;
        });
      } else {
        await api.post("/customer/saved-medicines", { medicineId });
        setSavedIds((prev) => new Set(prev).add(medicineId));
      }
    } catch (error) {
      // alert("Could not update saved status.");
    } finally {
      setSaveLoading(null);
    }
  };

  // --- Image Helper ---
  const getImageUrl = (path) => {
    if (!path)
      return "https://ui-avatars.com/api/?name=Med&background=0f172a&color=00d4ff";
    return path.startsWith("http") ? path : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${path}`;
  };

  // --- Filtering Logic ---
  const categories = useMemo(() => {
    const set = new Set();
    medicines.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return ["All", ...Array.from(set)];
  }, [medicines]);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchSearch =
        !searchTerm.trim() ||
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat =
        category === "All" ||
        (m.category || "").toLowerCase() === category.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [medicines, searchTerm, category]);

  // --- Render ---
  return (
    <div className="dark-dashboard-container py-4 px-3 px-md-4 min-vh-100 animate-fade-in">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-5">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-cyan rounded-circle p-2 d-flex align-items-center justify-content-center"
            onClick={() => navigate("/customer-dashboard")}
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="fw-bolder mb-0 text-white tracking-tight">
              Pharmacy Store
            </h2>
            <p className="text-muted mb-0 fw-medium">
              Browse our catalog and securely add items to your cart.
            </p>
          </div>
        </div>
      </div>

      {/* Filters row */}
      <div className="row g-3 align-items-center mb-5">
        <div className="col-12 col-md-6">
          <div className="position-relative">
            <Search
              size={18}
              className="position-absolute top-50 translate-middle-y text-cyan"
              style={{ left: "16px" }}
            />
            <input
              type="search"
              className="form-control form-control-lg dark-input border-dark-subtle rounded-pill ps-5 bg-transparent shadow-sm"
              placeholder="Search by medicine name or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="position-relative">
            <Filter
              size={18}
              className="position-absolute top-50 translate-middle-y text-cyan"
              style={{ left: "16px" }}
            />
            <select
              className="form-select form-select-lg dark-input border-dark-subtle rounded-pill ps-5 bg-transparent shadow-sm cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="text-dark">
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-12 col-md-2 text-md-end">
          <span className="badge bg-cyan bg-opacity-10 text-cyan border border-cyan px-3 py-2 rounded-pill shadow-sm">
            {filteredMedicines.length} Result
            {filteredMedicines.length !== 1 && "s"}
          </span>
        </div>
      </div>

      {/* Loading / Error / Empty States */}
      {loading && (
        <div className="d-flex flex-column justify-content-center align-items-center py-5">
          <Loader2 size={40} className="spin-animation text-cyan mb-3" />
          <span className="text-muted fw-semibold">Loading inventory...</span>
        </div>
      )}

      {loadError && !loading && (
        <div
          className="alert alert-danger bg-danger bg-opacity-10 border-0 text-danger shadow-sm rounded-4"
          role="alert"
        >
          {loadError}
        </div>
      )}

      {!loading && !loadError && filteredMedicines.length === 0 && (
        <div
          className="text-center text-muted py-5 dark-card rounded-4 border-dashed border-dark-subtle mx-auto"
          style={{ maxWidth: "500px" }}
        >
          <Package size={48} className="mb-3 opacity-50" />
          <h5 className="fw-bold text-white">No medicines found</h5>
          <p className="mb-0 small">
            Try adjusting your search or category filters.
          </p>
        </div>
      )}

      {/* Medicines Grid */}
      {!loading && !loadError && filteredMedicines.length > 0 && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {filteredMedicines.map((med) => {
            const currentSelection = selectedUnits[med._id] || {
              unitName: med.baseUnit || "Unit",
              price: med.price,
              multiplier: 1,
            };

            const isOutOfStock =
              (med.quantity || 0) < currentSelection.multiplier;

            return (
              <div key={med._id || med.id} className="col">
                <div className="dark-card h-100 rounded-4 overflow-hidden hover-glow transition-all d-flex flex-column">
                  {/* Image Area */}
                  <div
                    className="dark-inner-card text-center p-4 position-relative border-bottom-dark"
                    style={{
                      minHeight: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Image Source points to the backend */}
                    <img
                      src={getImageUrl(med.image)}
                      className="img-fluid rounded-3"
                      alt={med.name}
                      style={{
                        maxHeight: "140px",
                        objectFit: "contain",
                        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
                      }}
                    />

                    {/* Heart Save Button */}
                    <button
                      className="position-absolute top-0 end-0 m-3 btn btn-dark rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center border-dark-subtle hover-glow"
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "#0f172a",
                      }}
                      onClick={() => handleToggleSave(med._id)}
                      disabled={saveLoading === med._id}
                      title={
                        savedIds.has(med._id)
                          ? "Remove from Saved"
                          : "Save Item"
                      }
                    >
                      {saveLoading === med._id ? (
                        <Spinner
                          size="sm"
                          style={{ width: "16px", height: "16px" }}
                          className="text-cyan"
                        />
                      ) : (
                        <Heart
                          size={18}
                          className={
                            savedIds.has(med._id) ? "text-red" : "text-muted"
                          }
                          fill={savedIds.has(med._id) ? "#ef4444" : "none"}
                        />
                      )}
                    </button>

                    {isOutOfStock && (
                      <div className="position-absolute top-0 start-0 m-3">
                        <span className="badge bg-danger rounded-pill shadow-sm py-1 px-2 border border-danger border-opacity-50">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="mb-3">
                      <h6
                        className="fw-bold mb-1 text-truncate text-white fs-5"
                        title={med.name}
                      >
                        {med.name}
                      </h6>
                      <p className="text-muted small text-truncate mb-2">
                        {med.manufacturer || "Generic Manufacturer"}
                      </p>
                      <span
                        className="badge bg-cyan bg-opacity-10 text-cyan border border-cyan border-opacity-25 rounded-pill px-2 py-1"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {med.category}
                      </span>
                    </div>

                    {/*  Unit Selector & Price block pushed to bottom */}
                    <div className="mt-auto">
                      <div className="dark-inner-card rounded-3 p-3 border border-dark-subtle mb-3">
                        <label className="small text-muted fw-medium mb-2 d-block">
                          Select Pack Size:
                        </label>
                        <select
                          className="form-select form-select-sm dark-input border-dark-subtle bg-transparent cursor-pointer"
                          value={currentSelection.unitName}
                          onChange={(e) =>
                            handleUnitChange(med, e.target.value)
                          }
                        >
                          <option
                            value={med.baseUnit || "Unit"}
                            className="text-dark"
                          >
                            {med.baseUnit || "Unit"} (1x)
                          </option>
                          {med.units &&
                            med.units.map((u, idx) => (
                              <option
                                key={idx}
                                value={u.name}
                                className="text-dark"
                              >
                                {u.name} (x{u.multiplier})
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="d-flex justify-content-between align-items-end">
                        <div>
                          <div className="small text-muted mb-1">Price</div>
                          <div className="fw-bolder text-cyan fs-4 lh-1">
                            Rs. {currentSelection.price}
                          </div>
                          {!isOutOfStock && (
                            <div
                              className="text-muted mt-1"
                              style={{ fontSize: "0.7rem" }}
                            >
                              Max:{" "}
                              {Math.floor(
                                med.quantity / currentSelection.multiplier,
                              )}{" "}
                              available
                            </div>
                          )}
                        </div>

                        <button
                          className="btn btn-cyan-glow rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
                          style={{ width: "48px", height: "48px" }}
                          onClick={() => handleAddToCart(med)}
                          disabled={isOutOfStock}
                          title="Add to Cart"
                        >
                          <ShoppingCart size={20} className="text-white" />
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
  );
};

export default CustomerMedicines;
