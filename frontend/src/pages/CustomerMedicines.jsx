// import React, { useEffect, useState, useMemo } from "react";
// import { Search, Package, Filter, Loader2, ShoppingCart } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../redux/actions/cartActions";

// const API_BASE_URL = "http://localhost:5000/api";

// const CustomerMedicines = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState("All");

//   useEffect(() => {
//     const fetchMedicines = async () => {
//       try {
//         setLoading(true);
//         setLoadError("");
//         const res = await fetch(`${API_BASE_URL}/medicines`);
//         if (!res.ok) {
//           const data = await res.json().catch(() => ({}));
//           throw new Error(data.message || "Failed to load medicines");
//         }
//         const data = await res.json();
//         setMedicines(Array.isArray(data) ? data : data.medicines || []);
//       } catch (err) {
//         console.error("Failed to fetch medicines:", err);
//         setLoadError(err.message || "Unable to load medicines.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMedicines();
//   }, []);

//   // derive category list
//   const categories = useMemo(() => {
//     const set = new Set();
//     medicines.forEach((m) => {
//       if (m.category) set.add(m.category);
//     });
//     return ["All", ...Array.from(set)];
//   }, [medicines]);

//   // filtered medicines
//   const filteredMedicines = useMemo(() => {
//     return medicines.filter((m) => {
//       const matchSearch =
//         !searchTerm.trim() ||
//         m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         m.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchCat =
//         category === "All" ||
//         (m.category || "").toLowerCase() === category.toLowerCase();
//       return matchSearch && matchCat;
//     });
//   }, [medicines, searchTerm, category]);

//   const handleAddToCart = (med) => {
//     if (!med || !med.price) return;

//     dispatch(
//       addToCart({
//         medicine: med._id || med.id,
//         name: med.name,
//         price: med.price,
//         qty: 1,
//         stock: med.stock,
//         image: med.image,
//       })
//     );

//     navigate("/cart");
//   };

//   return (
//     <div className="container py-4">
//       {/* Header */}
//       <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
//         <div>
//           <h1 className="h4 mb-1 fw-semibold">Browse Medicines</h1>
//           <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
//             Search and filter the catalog, then add medicines directly to your
//             cart.
//           </p>
//         </div>
//         <button
//           className="btn btn-outline-secondary rounded-pill"
//           onClick={() => navigate("/customer-dashboard")}
//         >
//           ← Back to dashboard
//         </button>
//       </div>

//       {/* Filters row */}
//       <div className="row g-3 align-items-center mb-4">
//         <div className="col-12 col-md-6">
//           <div className="input-group shadow-sm">
//             <span className="input-group-text bg-white border-end-0">
//               <Search size={18} />
//             </span>
//             <input
//               type="search"
//               className="form-control border-start-0"
//               placeholder="Search by medicine or manufacturer..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="col-12 col-md-3">
//           <div className="input-group shadow-sm">
//             <span className="input-group-text bg-white">
//               <Filter size={16} />
//             </span>
//             <select
//               className="form-select"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//             >
//               {categories.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat === "All" ? "All categories" : cat}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//         <div className="col-12 col-md-3 text-md-end">
//           <span className="text-muted small">
//             Showing {filteredMedicines.length} of {medicines.length} medicines
//           </span>
//         </div>
//       </div>

//       {/* Loading / error states */}
//       {loading && (
//         <div className="d-flex justify-content-center align-items-center py-5">
//           <Loader2 className="me-2 text-primary" size={20} />
//           <span>Loading medicines...</span>
//         </div>
//       )}

//       {loadError && !loading && (
//         <div className="alert alert-danger" role="alert">
//           {loadError}
//         </div>
//       )}

//       {!loading && !loadError && filteredMedicines.length === 0 && (
//         <div className="text-center text-muted py-5">
//           <Package size={40} className="mb-2" />
//           <p className="mb-0">No medicines match your filters.</p>
//         </div>
//       )}

//       {/* Medicines grid */}
//       {!loading && !loadError && filteredMedicines.length > 0 && (
//         <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
//           {filteredMedicines.map((med) => (
//             <div key={med._id || med.id} className="col d-flex">
//               <div className="card shadow-sm border-0 rounded-3 flex-fill h-100">
//                 {med.image && (
//                   <div className="bg-light rounded-top">
//                     <img
//                       src={med.image}
//                       className="card-img-top"
//                       alt={med.name}
//                       style={{
//                         height: 140,
//                         objectFit: "contain",
//                         padding: "0.75rem",
//                       }}
//                     />
//                   </div>
//                 )}
//                 <div className="card-body d-flex flex-column">
//                   <h5
//                     className="card-title mb-1"
//                     style={{ fontSize: "0.95rem", minHeight: "2.4em" }}
//                   >
//                     {med.name}
//                   </h5>
//                   <p className="card-subtitle mb-1 text-muted small">
//                     {med.manufacturer || "Manufacturer not specified"}
//                   </p>
//                   <p className="small text-secondary mb-2">
//                     {med.category || "General"}
//                   </p>
//                   <div className="d-flex justify-content-between align-items-end mt-auto">
//                     <div>
//                       <span className="fw-semibold text-primary">
//                         ₹
//                         {med.price?.toFixed
//                           ? med.price.toFixed(2)
//                           : med.price || 0}
//                       </span>
//                       {typeof med.stock === "number" && (
//                         <div className="small text-muted">
//                           Stock:{" "}
//                           <span
//                             className={
//                               med.stock <= 5 ? "text-danger fw-semibold" : ""
//                             }
//                           >
//                             {med.stock}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                     <button
//                       className="btn btn-sm btn-primary d-flex align-items-center gap-1 rounded-pill px-3"
//                       onClick={() => handleAddToCart(med)}
//                       disabled={med.stock === 0}
//                     >
//                       <ShoppingCart size={16} />
//                       <span>{med.stock === 0 ? "Out of stock" : "Add"}</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerMedicines;

import React, { useEffect, useState, useMemo } from "react";
import { Search, Package, Filter, Loader2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/actions/cartActions";

const API_BASE_URL = "http://localhost:5000/api";

const CustomerMedicines = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  // State to track selected unit for each medicine card
  // Format: { [medicineId]: { unitName: "Strip", price: 50, multiplier: 10 } }
  const [selectedUnits, setSelectedUnits] = useState({});

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const res = await fetch(`${API_BASE_URL}/medicines`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load medicines");
        }
        const data = await res.json();
        // Handle array or object response
        const medList = Array.isArray(data) ? data : data.medicines || [];
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
        setLoadError(err.message || "Unable to load medicines.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // Handle Dropdown Change
  const handleUnitChange = (medicine, unitName) => {
    let newSelection = {};

    if (unitName === (medicine.baseUnit || "Unit")) {
      // User selected Base Unit
      newSelection = {
        unitName: medicine.baseUnit || "Unit",
        price: medicine.price,
        multiplier: 1,
      };
    } else {
      // User selected a Pack (Strip/Box)
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

  const handleAddToCart = (med) => {
    const selection = selectedUnits[med._id] || {
      unitName: med.baseUnit || "Unit",
      price: med.price,
      multiplier: 1,
    };

    dispatch(
      addToCart({
        medicine: med._id || med.id,
        name: med.name,
        image: med.image,
        stock: med.quantity, // This is total base units
        // Send specific selection details
        unit: selection.unitName,
        price: selection.price,
        buyingMultiplier: selection.multiplier,
        qty: 1,
      })
    );

    navigate("/cart");
  };

  // Derive categories
  const categories = useMemo(() => {
    const set = new Set();
    medicines.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return ["All", ...Array.from(set)];
  }, [medicines]);

  // Filter medicines
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

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h4 mb-1 fw-semibold">Browse Medicines</h1>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
            Search and filter the catalog, then add medicines directly to your
            cart.
          </p>
        </div>
        <button
          className="btn btn-outline-secondary rounded-pill"
          onClick={() => navigate("/customer-dashboard")}
        >
          ← Back to dashboard
        </button>
      </div>

      {/* Filters row */}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-12 col-md-6">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white border-end-0">
              <Search size={18} />
            </span>
            <input
              type="search"
              className="form-control border-start-0"
              placeholder="Search by medicine or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <Filter size={16} />
            </span>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-12 col-md-3 text-md-end">
          <span className="text-muted small">
            Showing {filteredMedicines.length} of {medicines.length} medicines
          </span>
        </div>
      </div>

      {/* Loading / error states */}
      {loading && (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Loader2 className="me-2 text-primary" size={20} />
          <span>Loading medicines...</span>
        </div>
      )}

      {loadError && !loading && (
        <div className="alert alert-danger" role="alert">
          {loadError}
        </div>
      )}

      {!loading && !loadError && filteredMedicines.length === 0 && (
        <div className="text-center text-muted py-5">
          <Package size={40} className="mb-2" />
          <p className="mb-0">No medicines match your filters.</p>
        </div>
      )}

      {/* Medicines grid */}
      {!loading && !loadError && filteredMedicines.length > 0 && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-3">
          {filteredMedicines.map((med) => {
            // Get current selection state for this card
            const currentSelection = selectedUnits[med._id] || {
              unitName: med.baseUnit || "Unit",
              price: med.price,
              multiplier: 1,
            };

            // Check if stock is sufficient for the multiplier
            const isOutOfStock =
              (med.quantity || 0) < currentSelection.multiplier;

            return (
              <div key={med._id || med.id} className="col">
                <div className="card shadow-sm border-0 rounded-3 h-100">
                  {med.image && (
                    <div className="bg-light rounded-top text-center p-3">
                      <img
                        src={med.image}
                        className="img-fluid"
                        alt={med.name}
                        style={{ height: 120, objectFit: "contain" }}
                      />
                    </div>
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5
                      className="card-title mb-1 text-truncate"
                      title={med.name}
                    >
                      {med.name}
                    </h5>
                    <p className="card-subtitle mb-2 text-muted small">
                      {med.manufacturer || "Generic"} • {med.category}
                    </p>

                    {/* --- UNIT SELECTOR --- */}
                    <div className="mb-3">
                      <label className="small text-muted mb-1 d-block">
                        Select Pack:
                      </label>
                      <select
                        className="form-select form-select-sm"
                        value={currentSelection.unitName}
                        onChange={(e) => handleUnitChange(med, e.target.value)}
                      >
                        {/* Base Unit Option */}
                        <option value={med.baseUnit || "Unit"}>
                          {med.baseUnit || "Unit"}
                        </option>

                        {/* Packaging Unit Options */}
                        {med.units &&
                          med.units.map((u, idx) => (
                            <option key={idx} value={u.name}>
                              {u.name} (x{u.multiplier})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-bold text-primary fs-5">
                          ₹{currentSelection.price}
                        </span>
                        <div
                          className="small text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {isOutOfStock ? (
                            <span className="text-danger">Out of Stock</span>
                          ) : (
                            <span>
                              Avail:{" "}
                              {Math.floor(
                                med.quantity / currentSelection.multiplier
                              )}{" "}
                              packs
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        className="btn btn-sm btn-primary rounded-pill px-3"
                        onClick={() => handleAddToCart(med)}
                        disabled={isOutOfStock}
                      >
                        <ShoppingCart size={16} className="me-1" /> Add
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
  );
};

export default CustomerMedicines;
