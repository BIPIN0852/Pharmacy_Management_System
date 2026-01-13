import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Badge,
  Tabs,
  Tab,
  Spinner,
  Alert,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  AlertTriangle,
  Package,
  Search,
  RefreshCw,
  ClipboardList,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // ✅ Use global api service

const PharmacistInventory = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState("all");
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      // ✅ Interceptor handles token automatically
      const data = await api.get("/medicines");
      setMedicines(Array.isArray(data) ? data : data.medicines || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const isLowStock = (qty) => (qty || 0) < 15; // Alert threshold set to 15 units

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-muted small">Accessing inventory vault...</p>
      </div>
    );

  return (
    <div className="animate-fade-in px-2">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">Pharmacy Inventory</h3>
          <p className="text-muted small mb-0">
            Monitor stock levels and track medicine expiration dates
          </p>
        </div>
        <div className="d-flex gap-2">
          <InputGroup className="shadow-sm" style={{ maxWidth: "300px" }}>
            <InputGroup.Text className="bg-white border-end-0">
              <Search size={16} className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search medicine..."
              className="border-start-0 ps-0 shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Button
            variant="white"
            className="border shadow-sm rounded-pill px-3"
            onClick={fetchMedicines}
          >
            <RefreshCw size={18} className="text-success" />
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="rounded-3 shadow-sm">
          {error}
        </Alert>
      )}

      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-4 custom-tabs border-bottom-0"
      >
        <Tab
          eventKey="all"
          title={
            <>
              <ClipboardList size={18} className="me-2" /> All Stock
            </>
          }
        >
          <InventoryTable
            data={filteredMedicines}
            isExpired={isExpired}
            isLowStock={isLowStock}
          />
        </Tab>
        <Tab
          eventKey="alerts"
          title={
            <div
              className={
                medicines.some(
                  (m) => isExpired(m.expiryDate) || isLowStock(m.countInStock)
                )
                  ? "text-danger fw-bold pulse-alert"
                  : ""
              }
            >
              <AlertTriangle size={18} className="me-2" /> Critical Alerts
            </div>
          }
        >
          <InventoryTable
            data={filteredMedicines.filter(
              (m) => isExpired(m.expiryDate) || isLowStock(m.countInStock)
            )}
            isExpired={isExpired}
            isLowStock={isLowStock}
            emptyMsg="Your inventory is currently healthy with no alerts."
          />
        </Tab>
      </Tabs>
    </div>
  );
};

const InventoryTable = ({
  data,
  isExpired,
  isLowStock,
  emptyMsg = "No medicines found",
}) => (
  <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
    <div className="table-responsive">
      <Table hover className="mb-0 align-middle">
        <thead className="bg-light border-bottom">
          <tr className="small text-uppercase text-muted fw-bold">
            <th className="py-3 ps-4">Medicine Name</th>
            <th className="py-3">Category</th>
            <th className="py-3">Expiry Date</th>
            <th className="py-3">Units In Stock</th>
            <th className="py-3">Base Price</th>
            <th className="py-3 text-end pe-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-5">
                <Package size={48} className="text-muted opacity-25 mb-2" />
                <p className="text-muted mb-0">{emptyMsg}</p>
              </td>
            </tr>
          ) : (
            data.map((m) => {
              const expired = isExpired(m.expiryDate);
              const low = isLowStock(m.countInStock);

              return (
                <tr
                  key={m._id}
                  className={expired ? "bg-danger bg-opacity-10" : ""}
                >
                  <td className="ps-4">
                    <div className="fw-bold text-dark">{m.name}</div>
                    <div className="text-muted x-small">{m.brand}</div>
                  </td>
                  <td>
                    <Badge
                      bg="info-subtle"
                      className="text-info border border-info-subtle px-3 py-1 fw-normal"
                    >
                      {m.category}
                    </Badge>
                  </td>
                  <td
                    className={
                      expired ? "text-danger fw-bold" : "text-secondary"
                    }
                  >
                    {m.expiryDate
                      ? new Date(m.expiryDate).toLocaleDateString()
                      : "No Date"}
                  </td>
                  <td>
                    <div
                      className={`fw-bold ${
                        low ? "text-danger" : "text-success"
                      }`}
                    >
                      {m.countInStock} {m.baseUnit || "Units"}
                    </div>
                  </td>
                  <td className="text-dark">Rs. {m.price}</td>
                  <td className="text-end pe-4">
                    {expired && (
                      <Badge bg="danger" className="me-1 px-2 py-1 shadow-sm">
                        Expired
                      </Badge>
                    )}
                    {low && !expired && (
                      <Badge
                        bg="warning"
                        text="dark"
                        className="px-2 py-1 shadow-sm"
                      >
                        Refill Soon
                      </Badge>
                    )}
                    {!expired && !low && (
                      <Badge
                        bg="success-subtle"
                        className="text-success border border-success-subtle px-3"
                      >
                        Active
                      </Badge>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  </div>
);

export default PharmacistInventory;
