// import React, { useState, useEffect, useRef } from "react";
// import { Search, X } from "lucide-react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";

// const GlobalSearch = () => {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const navigate = useNavigate();
//   const timeoutRef = useRef(null);

//   const fetchResults = async (searchQuery) => {
//     if (searchQuery.length < 2) {
//       setResults([]);
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await api.get(
//         `/admin/search?q=${encodeURIComponent(searchQuery)}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setResults(res.data.results || []);
//     } catch (err) {
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);

//     timeoutRef.current = setTimeout(() => {
//       fetchResults(query);
//     }, 300);

//     return () => clearTimeout(timeoutRef.current);
//   }, [query]);

//   const handleSelectResult = (result) => {
//     setQuery("");
//     setShowResults(false);

//     // Navigate based on type
//     switch (result.type) {
//       case "medicine":
//         navigate("/admin/medicines");
//         break;
//       case "supplier":
//         navigate("/admin/suppliers");
//         break;
//       case "order":
//         navigate("/admin/orders");
//         break;
//       default:
//         navigate("/admin/dashboard");
//     }
//   };

//   const getResultTitle = (result) => {
//     switch (result.type) {
//       case "medicine":
//         return `${result.name} (${result.category})`;
//       case "supplier":
//         return result.name;
//       case "doctor":
//         return `${result.name} (${result.speciality})`;
//       case "user":
//         return `${result.name} (${result.role})`;
//       case "order":
//         return `Order #${result._id?.substring(0, 8)}`;
//       default:
//         return result.name || "Item";
//     }
//   };

//   return (
//     <div className="position-relative">
//       <div className="input-group input-group-sm">
//         <span className="input-group-text bg-white border-end-0">
//           <Search size={16} />
//         </span>
//         <input
//           type="text"
//           className="form-control form-control-sm border-start-0 ps-0"
//           placeholder="Search medicines, suppliers, doctors, customers..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onFocus={() => results.length > 0 && setShowResults(true)}
//           style={{ borderRadius: "0.375rem 0 0 0.375rem" }}
//         />
//         {query && (
//           <button
//             className="btn btn-outline-secondary btn-sm"
//             type="button"
//             onClick={() => {
//               setQuery("");
//               setResults([]);
//             }}
//           >
//             <X size={16} />
//           </button>
//         )}
//       </div>

//       {showResults && results.length > 0 && (
//         <div
//           className="position-absolute w-100 bg-white shadow-sm border rounded mt-1"
//           style={{
//             zIndex: 1000,
//             maxHeight: "300px",
//             overflowY: "auto",
//             top: "100%",
//           }}
//         >
//           {results.map((result, index) => (
//             <div
//               key={result._id || index}
//               className="p-3 border-bottom cursor-pointer hover-bg-light"
//               style={{
//                 borderLeft: `3px solid var(--bs-${
//                   result.type === "medicine"
//                     ? "success"
//                     : result.type === "supplier"
//                     ? "info"
//                     : "primary"
//                 })`,
//               }}
//               onClick={() => handleSelectResult(result)}
//             >
//               <div className="fw-medium small mb-1">
//                 {getResultTitle(result)}
//               </div>
//               <div className="small text-muted">
//                 {result.type === "medicine" &&
//                   `Rs. ${result.price} | Stock: ${result.quantity}`}
//                 {result.type === "supplier" && result.email}
//                 {result.type === "doctor" && result.nmcNumber}
//                 {result.type === "user" && result.email}
//                 {result.type === "order" && result.status}
//               </div>
//             </div>
//           ))}
//           <div className="p-2 small text-center text-muted border-top">
//             {results.length} result{results.length !== 1 ? "s" : ""}
//           </div>
//         </div>
//       )}

//       {showResults && query && results.length === 0 && !loading && (
//         <div
//           className="position-absolute w-100 bg-white shadow-sm border rounded mt-1 p-3 small text-muted text-center"
//           style={{ zIndex: 1000, top: "100%" }}
//         >
//           No results found
//         </div>
//       )}
//     </div>
//   );
// };

// export default GlobalSearch;

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Pill,
  Truck,
  User,
  ShoppingBag,
  Stethoscope,
} from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const searchRef = useRef(null); // ✅ Ref to detect clicks outside

  // ✅ Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchResults = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      // ✅ UPDATED: Points to consolidated search endpoint
      // Adjust this URL to /api/medicines/search or /api/users/search depending on user role if needed
      const res = await api.get(
        `/medicines?search=${encodeURIComponent(searchQuery)}`
      );

      // Transform backend data to match search result format if necessary
      // Assuming backend returns a list of medicines
      const transformedResults = (res.data.medicines || []).map((item) => ({
        ...item,
        type: "medicine",
      }));

      setResults(transformedResults);
      setShowResults(true);
    } catch (err) {
      console.error("Search Error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  const handleSelectResult = (result) => {
    setQuery("");
    setShowResults(false);

    // ✅ Navigation logic matching our new route structure
    switch (result.type) {
      case "medicine":
        navigate(`/medicine/${result._id}`);
        break;
      case "order":
        navigate(`/orders/${result._id}`);
        break;
      default:
        navigate("/customer-dashboard");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "medicine":
        return <Pill size={14} className="text-success" />;
      case "supplier":
        return <Truck size={14} className="text-info" />;
      case "doctor":
        return <Stethoscope size={14} className="text-primary" />;
      case "order":
        return <ShoppingBag size={14} className="text-warning" />;
      default:
        return <User size={14} className="text-secondary" />;
    }
  };

  return (
    <div
      className="position-relative w-100"
      ref={searchRef}
      style={{ maxWidth: "400px" }}
    >
      <div className="input-group">
        <span className="input-group-text bg-light border-end-0 rounded-start-pill ps-3">
          {loading ? (
            <div
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            ></div>
          ) : (
            <Search size={18} className="text-muted" />
          )}
        </span>
        <input
          type="text"
          className="form-control border-start-0 bg-light rounded-end-pill py-2"
          placeholder="Search medicines..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
        />
        {query && (
          <button
            className="btn position-absolute end-0 top-50 translate-middle-y border-0 me-2"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            style={{ zIndex: 10 }}
          >
            <X size={16} className="text-muted" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (results.length > 0 || loading) && (
        <div
          className="position-absolute w-100 bg-white shadow-lg border-0 rounded-3 mt-2 overflow-hidden animate-fade-in"
          style={{ zIndex: 2000, top: "100%" }}
        >
          <div
            className="list-group list-group-flush"
            style={{ maxHeight: "350px", overflowY: "auto" }}
          >
            {results.map((result) => (
              <button
                key={result._id}
                className="list-group-item list-group-item-action border-0 d-flex align-items-center gap-3 py-3"
                onClick={() => handleSelectResult(result)}
              >
                <div className="bg-light p-2 rounded-circle d-flex align-items-center justify-content-center">
                  {getIcon(result.type)}
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="fw-bold text-dark text-truncate small">
                    {result.name || `Order #${result._id.substring(0, 8)}`}
                  </div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                    {result.category || result.role || "Medicine"} • Rs.{" "}
                    {result.price || 0}
                  </div>
                </div>
              </button>
            ))}
          </div>
          {results.length > 0 && (
            <div className="bg-light p-2 text-center small text-muted border-top">
              Showing {results.length} matching items
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
