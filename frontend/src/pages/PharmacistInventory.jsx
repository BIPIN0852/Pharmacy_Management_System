// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Button,
//   Badge,
//   Tabs,
//   Tab,
//   Spinner,
//   Alert,
//   Form,
//   InputGroup,
// } from "react-bootstrap";
// import {
//   AlertTriangle,
//   Package,
//   Search,
//   RefreshCw,
//   ClipboardList,
//   Info,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api"; // ✅ Use global api service

// const PharmacistInventory = () => {
//   const navigate = useNavigate();
//   const [key, setKey] = useState("all");
//   const [medicines, setMedicines] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchMedicines();
//   }, []);

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       // ✅ Interceptor handles token automatically
//       const data = await api.get("/medicines");
//       setMedicines(Array.isArray(data) ? data : data.medicines || []);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to load inventory");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isExpired = (date) => {
//     if (!date) return false;
//     return new Date(date) < new Date();
//   };

//   const isLowStock = (qty) => (qty || 0) < 15; // Alert threshold set to 15 units

//   // Filter medicines based on search term
//   const filteredMedicines = medicines.filter(
//     (m) =>
//       m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       m.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading)
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" variant="success" />
//         <p className="mt-2 text-muted small">Accessing inventory vault...</p>
//       </div>
//     );

//   return (
//     <div className="animate-fade-in px-2">
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
//         <div>
//           <h3 className="fw-bold text-dark mb-1">Pharmacy Inventory</h3>
//           <p className="text-muted small mb-0">
//             Monitor stock levels and track medicine expiration dates
//           </p>
//         </div>
//         <div className="d-flex gap-2">
//           <InputGroup className="shadow-sm" style={{ maxWidth: "300px" }}>
//             <InputGroup.Text className="bg-white border-end-0">
//               <Search size={16} className="text-muted" />
//             </InputGroup.Text>
//             <Form.Control
//               placeholder="Search medicine..."
//               className="border-start-0 ps-0 shadow-none"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </InputGroup>
//           <Button
//             variant="white"
//             className="border shadow-sm rounded-pill px-3"
//             onClick={fetchMedicines}
//           >
//             <RefreshCw size={18} className="text-success" />
//           </Button>
//         </div>
//       </div>

//       {error && (
//         <Alert variant="danger" className="rounded-3 shadow-sm">
//           {error}
//         </Alert>
//       )}

//       <Tabs
//         activeKey={key}
//         onSelect={(k) => setKey(k)}
//         className="mb-4 custom-tabs border-bottom-0"
//       >
//         <Tab
//           eventKey="all"
//           title={
//             <>
//               <ClipboardList size={18} className="me-2" /> All Stock
//             </>
//           }
//         >
//           <InventoryTable
//             data={filteredMedicines}
//             isExpired={isExpired}
//             isLowStock={isLowStock}
//           />
//         </Tab>
//         <Tab
//           eventKey="alerts"
//           title={
//             <div
//               className={
//                 medicines.some(
//                   (m) => isExpired(m.expiryDate) || isLowStock(m.countInStock)
//                 )
//                   ? "text-danger fw-bold pulse-alert"
//                   : ""
//               }
//             >
//               <AlertTriangle size={18} className="me-2" /> Critical Alerts
//             </div>
//           }
//         >
//           <InventoryTable
//             data={filteredMedicines.filter(
//               (m) => isExpired(m.expiryDate) || isLowStock(m.countInStock)
//             )}
//             isExpired={isExpired}
//             isLowStock={isLowStock}
//             emptyMsg="Your inventory is currently healthy with no alerts."
//           />
//         </Tab>
//       </Tabs>
//     </div>
//   );
// };

// const InventoryTable = ({
//   data,
//   isExpired,
//   isLowStock,
//   emptyMsg = "No medicines found",
// }) => (
//   <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
//     <div className="table-responsive">
//       <Table hover className="mb-0 align-middle">
//         <thead className="bg-light border-bottom">
//           <tr className="small text-uppercase text-muted fw-bold">
//             <th className="py-3 ps-4">Medicine Name</th>
//             <th className="py-3">Category</th>
//             <th className="py-3">Expiry Date</th>
//             <th className="py-3">Units In Stock</th>
//             <th className="py-3">Base Price</th>
//             <th className="py-3 text-end pe-4">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.length === 0 ? (
//             <tr>
//               <td colSpan="6" className="text-center py-5">
//                 <Package size={48} className="text-muted opacity-25 mb-2" />
//                 <p className="text-muted mb-0">{emptyMsg}</p>
//               </td>
//             </tr>
//           ) : (
//             data.map((m) => {
//               const expired = isExpired(m.expiryDate);
//               const low = isLowStock(m.countInStock);

//               return (
//                 <tr
//                   key={m._id}
//                   className={expired ? "bg-danger bg-opacity-10" : ""}
//                 >
//                   <td className="ps-4">
//                     <div className="fw-bold text-dark">{m.name}</div>
//                     <div className="text-muted x-small">{m.brand}</div>
//                   </td>
//                   <td>
//                     <Badge
//                       bg="info-subtle"
//                       className="text-info border border-info-subtle px-3 py-1 fw-normal"
//                     >
//                       {m.category}
//                     </Badge>
//                   </td>
//                   <td
//                     className={
//                       expired ? "text-danger fw-bold" : "text-secondary"
//                     }
//                   >
//                     {m.expiryDate
//                       ? new Date(m.expiryDate).toLocaleDateString()
//                       : "No Date"}
//                   </td>
//                   <td>
//                     <div
//                       className={`fw-bold ${
//                         low ? "text-danger" : "text-success"
//                       }`}
//                     >
//                       {m.countInStock} {m.baseUnit || "Units"}
//                     </div>
//                   </td>
//                   <td className="text-dark">Rs. {m.price}</td>
//                   <td className="text-end pe-4">
//                     {expired && (
//                       <Badge bg="danger" className="me-1 px-2 py-1 shadow-sm">
//                         Expired
//                       </Badge>
//                     )}
//                     {low && !expired && (
//                       <Badge
//                         bg="warning"
//                         text="dark"
//                         className="px-2 py-1 shadow-sm"
//                       >
//                         Refill Soon
//                       </Badge>
//                     )}
//                     {!expired && !low && (
//                       <Badge
//                         bg="success-subtle"
//                         className="text-success border border-success-subtle px-3"
//                       >
//                         Active
//                       </Badge>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </Table>
//     </div>
//   </div>
// );

// export default PharmacistInventory;

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
  Card,
  Row,
  Col,
} from "react-bootstrap";
import {
  AlertTriangle,
  Package,
  Search,
  RefreshCw,
  ClipboardList,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const PharmacistInventory = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState("all");
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Statistics State
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    expired: 0,
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError("");
      // ✅ Fetch medicines (supports both array and paginated response structures)
      const res = await api.get("/medicines");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.medicines || [];

      setMedicines(data);
      calculateStats(data);
    } catch (err) {
      console.error("Inventory Fetch Error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to retrieve inventory data. Please check connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const now = new Date();
    const low = data.filter((m) => (m.countInStock || 0) < 15).length;
    const exp = data.filter(
      (m) => m.expiryDate && new Date(m.expiryDate) < now,
    ).length;

    setStats({
      total: data.length,
      lowStock: low,
      expired: exp,
    });
  };

  // Helper Logic
  const isExpired = (date) => date && new Date(date) < new Date();
  const isLowStock = (qty) => (qty || 0) < 15;

  // Filter Logic
  const filteredMedicines = medicines.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (key === "alerts") {
      return (
        matchSearch && (isExpired(m.expiryDate) || isLowStock(m.countInStock))
      );
    }
    return matchSearch;
  });

  if (loading)
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center py-5"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading Inventory Vault...</p>
      </div>
    );

  return (
    <div className="container-fluid p-0 animate-fade-in">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <Package className="text-primary" /> Pharmacy Inventory
          </h3>
          <p className="text-muted small mb-0">
            Real-time stock monitoring and expiration tracking
          </p>
        </div>

        {/* Actions */}
        <div className="d-flex gap-2">
          <InputGroup
            className="shadow-sm border rounded-pill overflow-hidden bg-white"
            style={{ maxWidth: "320px" }}
          >
            <InputGroup.Text className="bg-white border-0 ps-3">
              <Search size={18} className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search medicines..."
              className="border-0 shadow-none ps-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Button
            variant="light"
            className="border shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
            onClick={fetchMedicines}
            title="Refresh Data"
            style={{ width: "40px", height: "40px" }}
          >
            <RefreshCw size={20} className="text-primary" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-primary bg-opacity-10">
            <Card.Body className="d-flex align-items-center p-3">
              <div className="bg-white p-3 rounded-circle text-primary me-3 shadow-sm">
                <Activity size={24} />
              </div>
              <div>
                <h6 className="text-muted small fw-bold mb-1">
                  Total Medicines
                </h6>
                <h3 className="fw-bold mb-0 text-dark">{stats.total}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-warning bg-opacity-10">
            <Card.Body className="d-flex align-items-center p-3">
              <div className="bg-white p-3 rounded-circle text-warning me-3 shadow-sm">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h6 className="text-muted small fw-bold mb-1">
                  Low Stock Alerts
                </h6>
                <h3 className="fw-bold mb-0 text-dark">{stats.lowStock}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100 bg-danger bg-opacity-10">
            <Card.Body className="d-flex align-items-center p-3">
              <div className="bg-white p-3 rounded-circle text-danger me-3 shadow-sm">
                <XCircle size={24} />
              </div>
              <div>
                <h6 className="text-muted small fw-bold mb-1">Expired Items</h6>
                <h3 className="fw-bold mb-0 text-dark">{stats.expired}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert
          variant="danger"
          className="rounded-3 shadow-sm d-flex align-items-center gap-2"
        >
          <AlertTriangle size={18} /> {error}
        </Alert>
      )}

      {/* Tabs & Table */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-white border-bottom px-4 pt-3">
          <Tabs
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="custom-tabs border-bottom-0"
          >
            <Tab
              eventKey="all"
              title={
                <span className="d-flex align-items-center gap-2 py-2">
                  <ClipboardList size={16} /> All Stock
                </span>
              }
            />
            <Tab
              eventKey="alerts"
              title={
                <span
                  className={`d-flex align-items-center gap-2 py-2 ${stats.lowStock > 0 || stats.expired > 0 ? "text-danger fw-bold" : ""}`}
                >
                  <AlertTriangle size={16} /> Critical Alerts
                  {(stats.lowStock > 0 || stats.expired > 0) && (
                    <Badge bg="danger" pill className="ms-1">
                      {stats.lowStock + stats.expired}
                    </Badge>
                  )}
                </span>
              }
            />
          </Tabs>
        </div>

        <div className="table-responsive">
          <Table hover className="mb-0 align-middle">
            <thead className="bg-light">
              <tr className="small text-uppercase text-muted fw-bold">
                <th className="py-3 ps-4">Medicine Name</th>
                <th className="py-3">Category</th>
                <th className="py-3">Expiry Date</th>
                <th className="py-3">Stock Level</th>
                <th className="py-3">Price</th>
                <th className="py-3 text-end pe-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <Package size={48} className="text-muted opacity-25 mb-2" />
                    <p className="text-muted mb-0">
                      No medicines found matching your criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((m) => {
                  const expired = isExpired(m.expiryDate);
                  const low = isLowStock(m.countInStock);

                  return (
                    <tr
                      key={m._id}
                      className={expired ? "bg-danger bg-opacity-10" : ""}
                    >
                      <td className="ps-4">
                        <div className="fw-bold text-dark">{m.name}</div>
                        <div className="text-muted x-small">
                          {m.manufacturer || m.brand || "Generic"}
                        </div>
                      </td>
                      <td>
                        <Badge
                          bg="light"
                          text="dark"
                          className="border px-3 py-1 fw-normal"
                        >
                          {m.category}
                        </Badge>
                      </td>
                      <td
                        className={
                          expired ? "text-danger fw-bold" : "text-secondary"
                        }
                      >
                        {m.expiryDate ? (
                          new Date(m.expiryDate).toLocaleDateString()
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <div
                          className={`fw-bold d-flex align-items-center gap-2 ${low ? "text-danger" : "text-success"}`}
                        >
                          {low ? (
                            <AlertTriangle size={14} />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          {m.countInStock} {m.unit || "Units"}
                        </div>
                      </td>
                      <td className="fw-medium text-dark">
                        Rs. {m.price?.toLocaleString()}
                      </td>
                      <td className="text-end pe-4">
                        {expired ? (
                          <Badge bg="danger" className="px-3 py-2 shadow-sm">
                            Expired
                          </Badge>
                        ) : low ? (
                          <Badge
                            bg="warning"
                            text="dark"
                            className="px-3 py-2 shadow-sm"
                          >
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge
                            bg="success-subtle"
                            text="success"
                            className="px-3 py-2 border border-success-subtle"
                          >
                            In Stock
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

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .custom-tabs .nav-link { color: #6c757d; border: none; border-bottom: 2px solid transparent; }
        .custom-tabs .nav-link.active { color: #0d6efd; border-bottom: 2px solid #0d6efd; background: transparent; font-weight: 600; }
        .x-small { font-size: 0.75rem; }
      `}</style>
    </div>
  );
};

export default PharmacistInventory;
