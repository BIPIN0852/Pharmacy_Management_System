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
  const searchRef = useRef(null);

  // Close search results when clicking outside
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
      const res = await api.get(
        `/medicines?search=${encodeURIComponent(searchQuery)}`,
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
        return <Pill size={14} style={{ color: "#007185" }} />;
      case "supplier":
        return <Truck size={14} className="text-muted" />;
      case "doctor":
        return <Stethoscope size={14} className="text-muted" />;
      case "order":
        return <ShoppingBag size={14} style={{ color: "#B12704" }} />;
      default:
        return <User size={14} className="text-muted" />;
    }
  };

  return (
    <div
      className="position-relative w-100 amazon-search-container"
      ref={searchRef}
      style={{ maxWidth: "600px" }}
    >
      <div className="d-flex position-relative">
        <input
          type="text"
          className="form-control amazon-search-input"
          placeholder="Search medicines, categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          style={{
            padding: "10px 40px 10px 15px",
            borderRadius: "4px 0 0 4px",
            border: "1px solid #cdcdcd",
            borderRight: "none",
            boxShadow: "none",
            fontSize: "15px",
          }}
        />

        {/* Clear Button (X) inside the input */}
        {query && (
          <button
            className="btn position-absolute border-0 p-0"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            style={{
              right: "55px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              backgroundColor: "transparent",
            }}
          >
            <X size={18} style={{ color: "#565959" }} />
          </button>
        )}

        <button
          className="btn amazon-search-button d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "#FEBD69",
            border: "1px solid #F3A847",
            borderRadius: "0 4px 4px 0",
            width: "45px",
            padding: "0",
          }}
          onClick={() => query && fetchResults(query)}
        >
          {loading ? (
            <div
              className="spinner-border spinner-border-sm"
              role="status"
              style={{ color: "#0F1111" }}
            ></div>
          ) : (
            <Search size={20} style={{ color: "#0F1111" }} />
          )}
        </button>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (results.length > 0 || loading) && (
        <div
          className="position-absolute w-100 bg-white border mt-1"
          style={{
            zIndex: 2000,
            top: "100%",
            borderRadius: "4px",
            borderColor: "#D5D9D9",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          }}
        >
          <div
            className="list-group list-group-flush rounded-0"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {results.map((result) => (
              <button
                key={result._id}
                className="list-group-item list-group-item-action border-0 d-flex align-items-center gap-3 py-2 amazon-search-result"
                onClick={() => handleSelectResult(result)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: "24px" }}
                >
                  {getIcon(result.type)}
                </div>
                <div className="flex-grow-1 overflow-hidden d-flex justify-content-between align-items-center">
                  <div
                    className="text-truncate text-dark"
                    style={{ fontSize: "14px" }}
                  >
                    {result.name || `Order #${result._id.substring(0, 8)}`}
                  </div>
                  <div
                    className="text-end fw-bold"
                    style={{ fontSize: "13px", color: "#B12704" }}
                  >
                    NPR {result.price ? result.price.toFixed(2) : "0.00"}
                  </div>
                </div>
              </button>
            ))}
          </div>
          {results.length > 0 && (
            <div
              className="p-2 text-center"
              style={{
                fontSize: "12px",
                backgroundColor: "#f8f9fa",
                borderTop: "1px solid #D5D9D9",
                color: "#565959",
              }}
            >
              Showing {results.length} matching items
            </div>
          )}
        </div>
      )}

      <style>{`
        .amazon-search-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #F90, 0 0 0 3px rgba(255, 153, 0, 0.5) !important;
          border-color: #F90 !important;
          z-index: 5; /* Ensures the focus ring overlaps the button border */
        }
        .amazon-search-button:hover {
          background-color: #F3A847 !important;
        }
        .amazon-search-result {
          background-color: #ffffff;
          transition: background-color 0.1s;
        }
        .amazon-search-result:hover {
          background-color: #f0f2f2 !important; /* Amazon Grey hover */
        }
      `}</style>
    </div>
  );
};

export default GlobalSearch;
