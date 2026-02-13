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
    <div className="container-fluid p-0 animate-fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Users className="text-primary" /> Customer Directory
          </h3>
          <p className="text-muted small mb-0">
            View registered pharmacy customers and contact details
          </p>
        </div>

        {/* Search Bar */}
        <div
          className="input-group shadow-sm border rounded-pill overflow-hidden bg-white"
          style={{ maxWidth: "300px" }}
        >
          <span className="input-group-text bg-white border-0 ps-3">
            <Search size={16} className="text-muted" />
          </span>
          <input
            type="search"
            className="form-control border-0 shadow-none"
            placeholder="Search name, email..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2 d-flex align-items-center gap-2">
          <Shield size={18} /> {error}
        </div>
      )}

      {/* Customer Table */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted text-uppercase fw-bold">
                <th className="ps-4 py-3">Customer Name</th>
                <th className="py-3">Contact Info</th>
                <th className="py-3">Address</th>
                <th className="py-3">Joined Date</th>
                <th className="py-3 text-end pe-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="d-flex justify-content-center align-items-center gap-2 text-primary">
                      <Loader2 className="animate-spin" size={24} />
                      <span>Loading customers...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                customers.map((user) => (
                  <tr key={user._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: "40px", height: "40px" }}
                        >
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">
                            {user.name || "Unknown"}
                          </div>
                          <div className="small text-muted">
                            ID: {user._id.substring(0, 6)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 small mb-1">
                        <Mail size={14} className="text-muted" /> {user.email}
                      </div>
                      <div className="d-flex align-items-center gap-2 small">
                        <Phone size={14} className="text-muted" />{" "}
                        {user.phone || "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-start gap-2 small">
                        <MapPin
                          size={14}
                          className="text-muted mt-1 flex-shrink-0"
                        />
                        <span
                          style={{ maxWidth: "250px" }}
                          className="text-truncate d-inline-block"
                        >
                          {/* ✅ FIX APPLIED HERE */}
                          {formatAddress(user.address)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 small text-muted">
                        <Calendar size={14} />
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>
                    <td className="text-end pe-4">
                      <span className="badge bg-success-subtle text-success rounded-pill px-3">
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
          <div className="card-footer bg-white border-top-0 py-3 d-flex justify-content-end gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span className="btn btn-sm btn-light disabled">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-sm btn-outline-secondary"
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
      `}</style>
    </div>
  );
};

export default PharmacistCustomers;
