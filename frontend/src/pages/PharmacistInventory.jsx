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
//   Card,
//   Row,
//   Col,
// } from "react-bootstrap";
// import {
//   AlertTriangle,
//   Package,
//   Search,
//   RefreshCw,
//   ClipboardList,
//   Activity,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";

// const PharmacistInventory = () => {
//   const navigate = useNavigate();
//   const [key, setKey] = useState("all");
//   const [medicines, setMedicines] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Statistics State
//   const [stats, setStats] = useState({
//     total: 0,
//     lowStock: 0,
//     expired: 0,
//   });

//   useEffect(() => {
//     fetchMedicines();
//   }, []);

//   const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       // Fetch medicines (supports both array and paginated response structures)
//       const res = await api.get("/medicines");
//       const data = Array.isArray(res.data)
//         ? res.data
//         : res.data?.medicines || [];

//       setMedicines(data);
//       calculateStats(data);
//     } catch (err) {
//       console.error("Inventory Fetch Error:", err);
//       setError(
//         err.response?.data?.message ||
//           "Unable to retrieve inventory data. Please check connection.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (data) => {
//     const now = new Date();
//     const low = data.filter((m) => (m.countInStock || 0) < 15).length;
//     const exp = data.filter(
//       (m) => m.expiryDate && new Date(m.expiryDate) < now,
//     ).length;

//     setStats({
//       total: data.length,
//       lowStock: low,
//       expired: exp,
//     });
//   };

//   // Helper Logic
//   const isExpired = (date) => date && new Date(date) < new Date();
//   const isLowStock = (qty) => (qty || 0) < 15;

//   // Filter Logic
//   const filteredMedicines = medicines.filter((m) => {
//     const matchSearch =
//       m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       m.category.toLowerCase().includes(searchTerm.toLowerCase());

//     if (key === "alerts") {
//       return (
//         matchSearch && (isExpired(m.expiryDate) || isLowStock(m.countInStock))
//       );
//     }
//     return matchSearch;
//   });

//   if (loading)
//     return (
//       <div
//         className="d-flex flex-column justify-content-center align-items-center py-5"
//         style={{ minHeight: "60vh", backgroundColor: "#f0f2f2" }}
//       >
//         <Spinner animation="border" style={{ color: "#007185" }} />
//         <p className="mt-3 text-muted small">Loading Inventory Vault...</p>
//       </div>
//     );

//   return (
//     <div
//       className="container-fluid p-3 p-md-4 animate-fade-in"
//       style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
//     >
//       {/* Page Header */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 border-bottom border-secondary-subtle pb-3">
//         <div>
//           <h2
//             className="fw-bold mb-1 d-flex align-items-center gap-2"
//             style={{ color: "#0F1111", fontSize: "1.5rem" }}
//           >
//             <Package style={{ color: "#007185" }} size={24} /> Pharmacy
//             Inventory
//           </h2>
//           <p className="small mb-0" style={{ color: "#565959" }}>
//             Real-time stock monitoring and expiration tracking.
//           </p>
//         </div>

//         {/* Actions */}
//         <div className="d-flex gap-2 align-items-center">
//           <div
//             className="d-flex bg-white align-items-center"
//             style={{
//               width: "280px",
//               borderRadius: "4px",
//               border: "1px solid #cdcdcd",
//               overflow: "hidden",
//             }}
//           >
//             <div className="ps-3 pe-2 d-flex align-items-center">
//               <Search size={16} style={{ color: "#565959" }} />
//             </div>
//             <input
//               type="search"
//               className="form-control border-0 shadow-none amazon-search-input py-2"
//               placeholder="Search medicines..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{ fontSize: "0.85rem" }}
//             />
//           </div>
//           <Button
//             variant="light"
//             className="border shadow-sm d-flex align-items-center justify-content-center bg-white"
//             onClick={fetchMedicines}
//             title="Refresh Data"
//             style={{
//               width: "38px",
//               height: "38px",
//               borderColor: "#D5D9D9",
//               borderRadius: "4px",
//             }}
//           >
//             <RefreshCw size={18} style={{ color: "#007185" }} />
//           </Button>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <Row className="g-3 mb-4">
//         <Col md={4}>
//           <Card
//             className="border-0 shadow-sm h-100 rounded-1"
//             style={{ borderTop: "4px solid #007185" }}
//           >
//             <Card.Body className="d-flex align-items-center p-3">
//               <div className="p-3 me-3">
//                 <Activity size={28} style={{ color: "#007185" }} />
//               </div>
//               <div>
//                 <h6
//                   className="small fw-bold mb-0 text-uppercase"
//                   style={{ color: "#565959", letterSpacing: "0.5px" }}
//                 >
//                   Total Medicines
//                 </h6>
//                 <h2 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
//                   {stats.total}
//                 </h2>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card
//             className="border-0 shadow-sm h-100 rounded-1"
//             style={{ borderTop: "4px solid #F3A847" }}
//           >
//             <Card.Body className="d-flex align-items-center p-3">
//               <div className="p-3 me-3">
//                 <AlertTriangle size={28} style={{ color: "#F3A847" }} />
//               </div>
//               <div>
//                 <h6
//                   className="small fw-bold mb-0 text-uppercase"
//                   style={{ color: "#565959", letterSpacing: "0.5px" }}
//                 >
//                   Low Stock Alerts
//                 </h6>
//                 <h2 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
//                   {stats.lowStock}
//                 </h2>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card
//             className="border-0 shadow-sm h-100 rounded-1"
//             style={{ borderTop: "4px solid #B12704" }}
//           >
//             <Card.Body className="d-flex align-items-center p-3">
//               <div className="p-3 me-3">
//                 <XCircle size={28} style={{ color: "#B12704" }} />
//               </div>
//               <div>
//                 <h6
//                   className="small fw-bold mb-0 text-uppercase"
//                   style={{ color: "#565959", letterSpacing: "0.5px" }}
//                 >
//                   Expired Items
//                 </h6>
//                 <h2 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
//                   {stats.expired}
//                 </h2>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {error && (
//         <Alert
//           variant="danger"
//           className="rounded-1 shadow-sm border-0 d-flex align-items-center gap-2 mb-4"
//           style={{
//             backgroundColor: "#fef0f0",
//             color: "#B12704",
//             borderLeft: "4px solid #B12704",
//           }}
//         >
//           <AlertTriangle size={18} /> {error}
//         </Alert>
//       )}

//       {/* Tabs & Table */}
//       <div
//         className="card shadow-sm border bg-white rounded-1"
//         style={{ borderColor: "#D5D9D9" }}
//       >
//         <div className="card-header bg-white border-bottom px-3 pt-2 pb-0">
//           <Tabs
//             activeKey={key}
//             onSelect={(k) => setKey(k)}
//             className="amazon-tabs border-bottom-0"
//           >
//             <Tab
//               eventKey="all"
//               title={
//                 <span
//                   className="d-flex align-items-center gap-2 py-2 small fw-bold"
//                   style={{ letterSpacing: "0.3px" }}
//                 >
//                   <ClipboardList size={16} /> ALL INVENTORY
//                 </span>
//               }
//             />
//             <Tab
//               eventKey="alerts"
//               title={
//                 <span
//                   className="d-flex align-items-center gap-2 py-2 small fw-bold"
//                   style={{ letterSpacing: "0.3px" }}
//                 >
//                   <AlertTriangle size={16} /> CRITICAL ALERTS
//                   {(stats.lowStock > 0 || stats.expired > 0) && (
//                     <Badge
//                       style={{ backgroundColor: "#B12704" }}
//                       pill
//                       className="ms-1"
//                     >
//                       {stats.lowStock + stats.expired}
//                     </Badge>
//                   )}
//                 </span>
//               }
//             />
//           </Tabs>
//         </div>

//         <div className="table-responsive">
//           <Table className="mb-0 align-middle border-0">
//             <thead className="bg-light">
//               <tr style={{ borderBottom: "1px solid #D5D9D9" }}>
//                 <th
//                   className="py-2 ps-4 small text-muted text-uppercase fw-bold border-0"
//                   style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
//                 >
//                   Medicine Name
//                 </th>
//                 <th
//                   className="py-2 small text-muted text-uppercase fw-bold border-0"
//                   style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
//                 >
//                   Category
//                 </th>
//                 <th
//                   className="py-2 small text-muted text-uppercase fw-bold border-0"
//                   style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
//                 >
//                   Expiry Date
//                 </th>
//                 <th
//                   className="py-2 small text-muted text-uppercase fw-bold border-0"
//                   style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
//                 >
//                   Stock Level
//                 </th>
//                 <th
//                   className="py-2 small text-muted text-uppercase fw-bold border-0"
//                   style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
//                 >
//                   Price
//                 </th>
//                 <th
//                   className="py-2 text-end pe-4 small text-muted text-uppercase fw-bold border-0"
//                   style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
//                 >
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredMedicines.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="text-center py-5">
//                     <Package size={36} className="text-muted opacity-50 mb-2" />
//                     <p className="text-muted small mb-0">
//                       No medicines found matching your criteria.
//                     </p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredMedicines.map((m) => {
//                   const expired = isExpired(m.expiryDate);
//                   const low = isLowStock(m.countInStock);

//                   return (
//                     <tr
//                       key={m._id}
//                       className={`aws-table-row border-bottom ${expired ? "expired-row" : ""}`}
//                       style={{
//                         backgroundColor: expired ? "#fef0f0" : "transparent",
//                       }}
//                     >
//                       <td className="ps-4 py-3">
//                         <div
//                           className="fw-bold"
//                           style={{ color: "#007185", fontSize: "0.9rem" }}
//                         >
//                           {m.name}
//                         </div>
//                         <div
//                           className="text-muted mt-1"
//                           style={{ fontSize: "0.75rem" }}
//                         >
//                           {m.manufacturer || m.brand || "Generic"}
//                         </div>
//                       </td>
//                       <td className="py-3">
//                         <span
//                           className="text-dark"
//                           style={{ fontSize: "0.85rem" }}
//                         >
//                           {m.category}
//                         </span>
//                       </td>
//                       <td
//                         className="py-3"
//                         style={{
//                           color: expired ? "#B12704" : "#0F1111",
//                           fontSize: "0.85rem",
//                           fontWeight: expired ? "bold" : "normal",
//                         }}
//                       >
//                         {m.expiryDate ? (
//                           new Date(m.expiryDate).toLocaleDateString()
//                         ) : (
//                           <span className="text-muted">-</span>
//                         )}
//                       </td>
//                       <td className="py-3">
//                         <div
//                           className="d-flex align-items-center gap-2"
//                           style={{
//                             color: low ? "#B12704" : "#067D62",
//                             fontWeight: low ? "bold" : "500",
//                             fontSize: "0.85rem",
//                           }}
//                         >
//                           {low ? (
//                             <AlertTriangle size={14} />
//                           ) : (
//                             <CheckCircle2 size={14} />
//                           )}
//                           {m.countInStock}{" "}
//                           <span
//                             className="text-muted fw-normal"
//                             style={{ fontSize: "0.75rem" }}
//                           >
//                             {m.unit || "Units"}
//                           </span>
//                         </div>
//                       </td>
//                       <td
//                         className="fw-medium text-dark py-3"
//                         style={{ fontSize: "0.85rem" }}
//                       >
//                         NPR {m.price?.toLocaleString()}
//                       </td>
//                       <td className="text-end pe-4 py-3">
//                         {expired ? (
//                           <span
//                             className="badge rounded-1 px-2 py-1"
//                             style={{
//                               backgroundColor: "#B12704",
//                               color: "#fff",
//                               border: "1px solid #8a1f03",
//                             }}
//                           >
//                             Expired
//                           </span>
//                         ) : low ? (
//                           <span
//                             className="badge rounded-1 px-2 py-1 text-dark"
//                             style={{
//                               backgroundColor: "#fcf4e8",
//                               border: "1px solid #F3A847",
//                             }}
//                           >
//                             Low Stock
//                           </span>
//                         ) : (
//                           <span
//                             className="badge rounded-1 px-2 py-1"
//                             style={{
//                               backgroundColor: "#f2fcf5",
//                               color: "#067D62",
//                               border: "1px solid #067D62",
//                             }}
//                           >
//                             In Stock
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </Table>
//         </div>
//       </div>

//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.4s ease-out; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

//         /* Amazon Tab Styling */
//         .amazon-tabs .nav-link {
//           color: #565959;
//           border: none;
//           border-bottom: 2px solid transparent;
//           border-radius: 0;
//           padding: 0.5rem 1rem;
//         }
//         .amazon-tabs .nav-link:hover {
//           color: #C7511F;
//         }
//         .amazon-tabs .nav-link.active {
//           color: #007185 !important;
//           border-bottom: 2px solid #e47911 !important;
//           background: transparent;
//         }

//         /* Amazon Search Input Focus */
//         .amazon-search-input:focus {
//           outline: none;
//           box-shadow: inset 0 0 0 2px #F90 !important;
//           border-color: transparent !important;
//         }

//         /* Table Hover */
//         .aws-table-row { transition: background-color 0.1s; }
//         .aws-table-row:hover:not(.expired-row) { background-color: #f8f9fa !important; }
//       `}</style>
//     </div>
//   );
// };

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

  // ✅ HELPER: Extracts the closest expiry date from the FEFO batches array
  const getNearestExpiry = (med) => {
    if (med.expiryDate) return med.expiryDate;
    if (med.batches && med.batches.length > 0) {
      const validBatches = med.batches.filter((b) => b.expiryDate);
      if (validBatches.length > 0) {
        validBatches.sort(
          (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate),
        );
        return validBatches[0].expiryDate;
      }
    }
    return null;
  };

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ SMART ENDPOINT: Checks user role so it fetches full batch data without Access Denied errors
      const userInfoString = localStorage.getItem("userInfo");
      const userInfo = userInfoString ? JSON.parse(userInfoString) : {};
      const isAdmin = userInfo?.role === "admin";
      //const endpoint = isAdmin ? "/admin/medicines" : "/pharmacist/medicines";
      const endpoint = isAdmin
        ? "/medicines/admin/medicines"
        : "/medicines/pharmacist/medicines";

      // Fetch medicines
      const res = await api.get(endpoint);
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

    // ✅ FIXED: Calculate expired using the exact batch expiry dates
    const exp = data.filter((m) => {
      const expDate = getNearestExpiry(m);
      return expDate && new Date(expDate) < now;
    }).length;

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
        // ✅ FIXED: Filters alerts based on real expiry date
        matchSearch &&
        (isExpired(getNearestExpiry(m)) || isLowStock(m.countInStock))
      );
    }
    return matchSearch;
  });

  if (loading)
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center py-5"
        style={{ minHeight: "60vh", backgroundColor: "#f0f2f2" }}
      >
        <Spinner animation="border" style={{ color: "#007185" }} />
        <p className="mt-3 text-muted small">Loading Inventory Vault...</p>
      </div>
    );

  return (
    <div
      className="container-fluid p-3 p-md-4 animate-fade-in"
      style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
    >
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 border-bottom border-secondary-subtle pb-3">
        <div>
          <h2
            className="fw-bold mb-1 d-flex align-items-center gap-2"
            style={{ color: "#0F1111", fontSize: "1.5rem" }}
          >
            <Package style={{ color: "#007185" }} size={24} /> Pharmacy
            Inventory
          </h2>
          <p className="small mb-0" style={{ color: "#565959" }}>
            Real-time stock monitoring and expiration tracking.
          </p>
        </div>

        {/* Actions */}
        <div className="d-flex gap-2 align-items-center">
          <div
            className="d-flex bg-white align-items-center"
            style={{
              width: "280px",
              borderRadius: "4px",
              border: "1px solid #cdcdcd",
              overflow: "hidden",
            }}
          >
            <div className="ps-3 pe-2 d-flex align-items-center">
              <Search size={16} style={{ color: "#565959" }} />
            </div>
            <input
              type="search"
              className="form-control border-0 shadow-none amazon-search-input py-2"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: "0.85rem" }}
            />
          </div>
          <Button
            variant="light"
            className="border shadow-sm d-flex align-items-center justify-content-center bg-white"
            onClick={fetchMedicines}
            title="Refresh Data"
            style={{
              width: "38px",
              height: "38px",
              borderColor: "#D5D9D9",
              borderRadius: "4px",
            }}
          >
            <RefreshCw size={18} style={{ color: "#007185" }} />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card
            className="border-0 shadow-sm h-100 rounded-1"
            style={{ borderTop: "4px solid #007185" }}
          >
            <Card.Body className="d-flex align-items-center p-3">
              <div className="p-3 me-3">
                <Activity size={28} style={{ color: "#007185" }} />
              </div>
              <div>
                <h6
                  className="small fw-bold mb-0 text-uppercase"
                  style={{ color: "#565959", letterSpacing: "0.5px" }}
                >
                  Total Medicines
                </h6>
                <h2 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
                  {stats.total}
                </h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            className="border-0 shadow-sm h-100 rounded-1"
            style={{ borderTop: "4px solid #F3A847" }}
          >
            <Card.Body className="d-flex align-items-center p-3">
              <div className="p-3 me-3">
                <AlertTriangle size={28} style={{ color: "#F3A847" }} />
              </div>
              <div>
                <h6
                  className="small fw-bold mb-0 text-uppercase"
                  style={{ color: "#565959", letterSpacing: "0.5px" }}
                >
                  Low Stock Alerts
                </h6>
                <h2 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
                  {stats.lowStock}
                </h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            className="border-0 shadow-sm h-100 rounded-1"
            style={{ borderTop: "4px solid #B12704" }}
          >
            <Card.Body className="d-flex align-items-center p-3">
              <div className="p-3 me-3">
                <XCircle size={28} style={{ color: "#B12704" }} />
              </div>
              <div>
                <h6
                  className="small fw-bold mb-0 text-uppercase"
                  style={{ color: "#565959", letterSpacing: "0.5px" }}
                >
                  Expired Items
                </h6>
                <h2 className="fw-bold mb-0" style={{ color: "#0F1111" }}>
                  {stats.expired}
                </h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert
          variant="danger"
          className="rounded-1 shadow-sm border-0 d-flex align-items-center gap-2 mb-4"
          style={{
            backgroundColor: "#fef0f0",
            color: "#B12704",
            borderLeft: "4px solid #B12704",
          }}
        >
          <AlertTriangle size={18} /> {error}
        </Alert>
      )}

      {/* Tabs & Table */}
      <div
        className="card shadow-sm border bg-white rounded-1"
        style={{ borderColor: "#D5D9D9" }}
      >
        <div className="card-header bg-white border-bottom px-3 pt-2 pb-0">
          <Tabs
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="amazon-tabs border-bottom-0"
          >
            <Tab
              eventKey="all"
              title={
                <span
                  className="d-flex align-items-center gap-2 py-2 small fw-bold"
                  style={{ letterSpacing: "0.3px" }}
                >
                  <ClipboardList size={16} /> ALL INVENTORY
                </span>
              }
            />
            <Tab
              eventKey="alerts"
              title={
                <span
                  className="d-flex align-items-center gap-2 py-2 small fw-bold"
                  style={{ letterSpacing: "0.3px" }}
                >
                  <AlertTriangle size={16} /> CRITICAL ALERTS
                  {(stats.lowStock > 0 || stats.expired > 0) && (
                    <Badge
                      style={{ backgroundColor: "#B12704" }}
                      pill
                      className="ms-1"
                    >
                      {stats.lowStock + stats.expired}
                    </Badge>
                  )}
                </span>
              }
            />
          </Tabs>
        </div>

        <div className="table-responsive">
          <Table className="mb-0 align-middle border-0">
            <thead className="bg-light">
              <tr style={{ borderBottom: "1px solid #D5D9D9" }}>
                <th
                  className="py-2 ps-4 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                >
                  Medicine Name
                </th>
                <th
                  className="py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                >
                  Category
                </th>
                <th
                  className="py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                >
                  Expiry Date
                </th>
                <th
                  className="py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                >
                  Stock Level
                </th>
                <th
                  className="py-2 small text-muted text-uppercase fw-bold border-0"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                >
                  Price
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
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <Package size={36} className="text-muted opacity-50 mb-2" />
                    <p className="text-muted small mb-0">
                      No medicines found matching your criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((m) => {
                  // ✅ Use the helper to extract the exact batch expiry date
                  const expiryDate = getNearestExpiry(m);
                  const expired = isExpired(expiryDate);
                  const low = isLowStock(m.countInStock);

                  return (
                    <tr
                      key={m._id}
                      className={`aws-table-row border-bottom ${expired ? "expired-row" : ""}`}
                      style={{
                        backgroundColor: expired ? "#fef0f0" : "transparent",
                      }}
                    >
                      <td className="ps-4 py-3">
                        <div
                          className="fw-bold"
                          style={{ color: "#007185", fontSize: "0.9rem" }}
                        >
                          {m.name}
                        </div>
                        <div
                          className="text-muted mt-1"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {m.manufacturer || m.brand || "Generic"}
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className="text-dark"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {m.category}
                        </span>
                      </td>
                      <td
                        className="py-3"
                        style={{
                          color: expired ? "#B12704" : "#0F1111",
                          fontSize: "0.85rem",
                          fontWeight: expired ? "bold" : "normal",
                        }}
                      >
                        {/* ✅ Renders the correctly extracted expiry date */}
                        {expiryDate ? (
                          new Date(expiryDate).toLocaleDateString()
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div
                          className="d-flex align-items-center gap-2"
                          style={{
                            color: low ? "#B12704" : "#067D62",
                            fontWeight: low ? "bold" : "500",
                            fontSize: "0.85rem",
                          }}
                        >
                          {low ? (
                            <AlertTriangle size={14} />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          {m.countInStock}{" "}
                          <span
                            className="text-muted fw-normal"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {m.unit || "Units"}
                          </span>
                        </div>
                      </td>
                      <td
                        className="fw-medium text-dark py-3"
                        style={{ fontSize: "0.85rem" }}
                      >
                        NPR {m.price?.toLocaleString()}
                      </td>
                      <td className="text-end pe-4 py-3">
                        {expired ? (
                          <span
                            className="badge rounded-1 px-2 py-1"
                            style={{
                              backgroundColor: "#B12704",
                              color: "#fff",
                              border: "1px solid #8a1f03",
                            }}
                          >
                            Expired
                          </span>
                        ) : low ? (
                          <span
                            className="badge rounded-1 px-2 py-1 text-dark"
                            style={{
                              backgroundColor: "#fcf4e8",
                              border: "1px solid #F3A847",
                            }}
                          >
                            Low Stock
                          </span>
                        ) : (
                          <span
                            className="badge rounded-1 px-2 py-1"
                            style={{
                              backgroundColor: "#f2fcf5",
                              color: "#067D62",
                              border: "1px solid #067D62",
                            }}
                          >
                            In Stock
                          </span>
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

        /* Amazon Tab Styling */
        .amazon-tabs .nav-link {
          color: #565959;
          border: none;
          border-bottom: 2px solid transparent;
          border-radius: 0;
          padding: 0.5rem 1rem;
        }
        .amazon-tabs .nav-link:hover {
          color: #C7511F;
        }
        .amazon-tabs .nav-link.active {
          color: #007185 !important;
          border-bottom: 2px solid #e47911 !important;
          background: transparent;
        }

        /* Amazon Search Input Focus */
        .amazon-search-input:focus {
          outline: none;
          box-shadow: inset 0 0 0 2px #F90 !important;
          border-color: transparent !important;
        }

        /* Table Hover */
        .aws-table-row { transition: background-color 0.1s; }
        .aws-table-row:hover:not(.expired-row) { background-color: #f8f9fa !important; }
      `}</style>
    </div>
  );
};

export default PharmacistInventory;
