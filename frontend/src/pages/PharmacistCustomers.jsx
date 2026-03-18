import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Loader2,
} from "lucide-react";

const PharmacistCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCustomers();
  }, [page, searchTerm]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/users?search=${searchTerm}&page=${page}`,
      );

      if (data.users) {
        setCustomers(data.users);
        setTotalPages(data.pagination?.pages || 1);
      } else if (Array.isArray(data)) {
        setCustomers(data);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load customer list. Check if server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  // ✅ FIX: Helper function to safely render address
  const formatAddress = (addr) => {
    if (!addr) return "No address provided";

    // If it's an object (New Schema), format it nicely
    if (typeof addr === "object") {
      const parts = [
        addr.street,
        addr.city,
        addr.province,
        addr.postalCode,
      ].filter(Boolean); // Remove null/undefined values

      return parts.length > 0 ? parts.join(", ") : "Incomplete Address";
    }

    // If it's just a string (Old Schema), return as is
    return addr;
  };

  return (
    <div
      className="container-fluid p-3 p-md-4 animate-fade-in"
      style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary-subtle flex-wrap gap-3">
        <div>
          <h2
            className="fw-bold mb-1 d-flex align-items-center gap-2"
            style={{ color: "#0F1111", fontSize: "1.5rem" }}
          >
            <Users style={{ color: "#007185" }} size={24} /> Customer Directory
          </h2>
          <p className="small mb-0" style={{ color: "#565959" }}>
            View registered pharmacy customers and contact details.
          </p>
        </div>

        {/* Search Bar */}
        <div
          className="d-flex bg-white align-items-center"
          style={{
            maxWidth: "350px",
            width: "100%",
            borderRadius: "4px",
            border: "1px solid #cdcdcd",
            overflow: "hidden",
          }}
        >
          <div className="ps-3 pe-2 d-flex align-items-center">
            <Search size={18} style={{ color: "#565959" }} />
          </div>
          <input
            type="search"
            className="form-control border-0 shadow-none amazon-search-input py-2"
            placeholder="Search name, email..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ fontSize: "0.9rem" }}
          />
        </div>
      </div>

      {error && (
        <div
          className="alert border-0 shadow-sm mb-4 rounded-1 d-flex align-items-center gap-2"
          style={{
            backgroundColor: "#fef0f0",
            color: "#B12704",
            borderLeft: "4px solid #B12704",
          }}
        >
          <Shield size={18} /> {error}
        </div>
      )}

      {/* Customer Table */}
      <div
        className="card shadow-sm border bg-white rounded-1"
        style={{ borderColor: "#D5D9D9" }}
      >
        <div className="table-responsive">
          <table className="table align-middle mb-0 border-0">
            <thead className="bg-light">
              <tr style={{ borderBottom: "1px solid #D5D9D9" }}>
                <th
                  className="ps-4 py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                >
                  Customer Name
                </th>
                <th
                  className="py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                >
                  Contact Info
                </th>
                <th
                  className="py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                >
                  Address
                </th>
                <th
                  className="py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                >
                  Joined Date
                </th>
                <th
                  className="py-2 text-end pe-4 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div
                      className="d-flex justify-content-center align-items-center gap-2"
                      style={{ color: "#007185" }}
                    >
                      <Loader2 className="animate-spin" size={24} />
                      <span className="small fw-medium">
                        Loading customers...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted small">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                customers.map((user) => (
                  <tr key={user._id} className="aws-table-row border-bottom">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                          style={{
                            width: "36px",
                            height: "36px",
                            backgroundColor: "#f0f2f2",
                            border: "1px solid #D5D9D9",
                            color: "#007185",
                            fontSize: "1.1rem",
                          }}
                        >
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div
                            className="fw-bold"
                            style={{ color: "#0F1111", fontSize: "0.9rem" }}
                          >
                            {user.name || "Unknown"}
                          </div>
                          <div
                            style={{ color: "#007185", fontSize: "0.75rem" }}
                          >
                            ID: {user._id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div
                        className="d-flex align-items-center gap-2 mb-1"
                        style={{ fontSize: "0.85rem", color: "#0F1111" }}
                      >
                        <Mail size={14} style={{ color: "#565959" }} />{" "}
                        {user.email}
                      </div>
                      <div
                        className="d-flex align-items-center gap-2"
                        style={{ fontSize: "0.85rem", color: "#0F1111" }}
                      >
                        <Phone size={14} style={{ color: "#565959" }} />{" "}
                        {user.phone || "N/A"}
                      </div>
                    </td>
                    <td className="py-3">
                      <div
                        className="d-flex align-items-start gap-2"
                        style={{ fontSize: "0.85rem", color: "#0F1111" }}
                      >
                        <MapPin
                          size={14}
                          style={{ color: "#565959" }}
                          className="mt-1 flex-shrink-0"
                        />
                        <span
                          style={{ maxWidth: "250px", lineHeight: "1.3" }}
                          className="text-truncate d-inline-block"
                        >
                          {/* ✅ FIX APPLIED HERE */}
                          {formatAddress(user.address)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div
                        className="d-flex align-items-center gap-2 text-muted"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <Calendar size={14} />
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>
                    <td className="text-end pe-4 py-3">
                      <span
                        className="badge rounded-1 px-2 py-1"
                        style={{
                          backgroundColor: "#f2fcf5",
                          color: "#067D62",
                          border: "1px solid #067D62",
                        }}
                      >
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div
            className="bg-light border-top py-2 px-3 d-flex justify-content-end gap-2"
            style={{ borderColor: "#D5D9D9" }}
          >
            <button
              className="btn btn-sm pagination-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span
              className="btn btn-sm"
              style={{ color: "#565959", border: "1px solid transparent" }}
            >
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-sm pagination-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        /* Amazon Table Hover */
        .aws-table-row { transition: background-color 0.1s; }
        .aws-table-row:hover { background-color: #f8f9fa; }
        
        /* Amazon Search Input Focus */
        .amazon-search-input:focus {
          outline: none;
          box-shadow: inset 0 0 0 2px #F90 !important;
          border-color: transparent !important;
        }
        
        /* Pagination Button Styling */
        .pagination-btn {
          border: 1px solid #D5D9D9;
          background-color: #fff;
          color: #0F1111;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        .pagination-btn:hover:not(:disabled) {
          background-color: #f0f2f2;
        }
      `}</style>
    </div>
  );
};

export default PharmacistCustomers;
