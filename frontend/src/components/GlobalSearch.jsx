import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const fetchResults = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get(
        `/admin/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResults(res.data.results || []);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  const handleSelectResult = (result) => {
    setQuery("");
    setShowResults(false);

    // Navigate based on type
    switch (result.type) {
      case "medicine":
        navigate("/admin/medicines");
        break;
      case "supplier":
        navigate("/admin/suppliers");
        break;
      case "order":
        navigate("/admin/orders");
        break;
      default:
        navigate("/admin/dashboard");
    }
  };

  const getResultTitle = (result) => {
    switch (result.type) {
      case "medicine":
        return `${result.name} (${result.category})`;
      case "supplier":
        return result.name;
      case "doctor":
        return `${result.name} (${result.speciality})`;
      case "user":
        return `${result.name} (${result.role})`;
      case "order":
        return `Order #${result._id?.substring(0, 8)}`;
      default:
        return result.name || "Item";
    }
  };

  return (
    <div className="position-relative">
      <div className="input-group input-group-sm">
        <span className="input-group-text bg-white border-end-0">
          <Search size={16} />
        </span>
        <input
          type="text"
          className="form-control form-control-sm border-start-0 ps-0"
          placeholder="Search medicines, suppliers, doctors, customers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          style={{ borderRadius: "0.375rem 0 0 0.375rem" }}
        />
        {query && (
          <button
            className="btn btn-outline-secondary btn-sm"
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div
          className="position-absolute w-100 bg-white shadow-sm border rounded mt-1"
          style={{
            zIndex: 1000,
            maxHeight: "300px",
            overflowY: "auto",
            top: "100%",
          }}
        >
          {results.map((result, index) => (
            <div
              key={result._id || index}
              className="p-3 border-bottom cursor-pointer hover-bg-light"
              style={{
                borderLeft: `3px solid var(--bs-${
                  result.type === "medicine"
                    ? "success"
                    : result.type === "supplier"
                    ? "info"
                    : "primary"
                })`,
              }}
              onClick={() => handleSelectResult(result)}
            >
              <div className="fw-medium small mb-1">
                {getResultTitle(result)}
              </div>
              <div className="small text-muted">
                {result.type === "medicine" &&
                  `Rs. ${result.price} | Stock: ${result.quantity}`}
                {result.type === "supplier" && result.email}
                {result.type === "doctor" && result.nmcNumber}
                {result.type === "user" && result.email}
                {result.type === "order" && result.status}
              </div>
            </div>
          ))}
          <div className="p-2 small text-center text-muted border-top">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {showResults && query && results.length === 0 && !loading && (
        <div
          className="position-absolute w-100 bg-white shadow-sm border rounded mt-1 p-3 small text-muted text-center"
          style={{ zIndex: 1000, top: "100%" }}
        >
          No results found
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
