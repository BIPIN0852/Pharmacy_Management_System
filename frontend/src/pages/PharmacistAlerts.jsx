// import React, { useState, useEffect } from "react";
// import api from "../services/api";
// import {
//   AlertTriangle,
//   Calendar,
//   Package,
//   ShieldAlert,
//   CheckCircle,
// } from "lucide-react";

// const PharmacistAlerts = () => {
//   const [expiringMedicines, setExpiringMedicines] = useState([]);
//   const [lowStockMedicines, setLowStockMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchAlerts();
//   }, []);

//   const fetchAlerts = async () => {
//     try {
//       setLoading(true);

//       // 1. Fetch Expiring Medicines (Backend API)
//       const expiredRes = await api.get("/medicines/expired");
//       setExpiringMedicines(expiredRes.data);

//       // 2. Fetch All Medicines to filter Low Stock (Client Side Logic)
//       const stockRes = await api.get("/medicines");
//       const allMeds = Array.isArray(stockRes.data)
//         ? stockRes.data
//         : stockRes.data.medicines;

//       // Filter for items with less than 15 units
//       const lowStock = allMeds.filter((m) => (m.countInStock || 0) < 15);
//       setLowStockMedicines(lowStock);
//     } catch (err) {
//       console.error("Alert Fetch Error:", err);
//       setError("Failed to load alerts. Please check server connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDaysRemaining = (date) => {
//     const diff = new Date(date) - new Date();
//     return Math.ceil(diff / (1000 * 60 * 60 * 24));
//   };

//   if (loading) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center py-5"
//         style={{ minHeight: "60vh" }}
//       >
//         <div className="spinner-border text-danger me-3" />
//         <span className="text-muted small">
//           Scanning inventory for risk factors...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="container-fluid p-3 p-md-4 animate-fade-in"
//       style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
//     >
//       {/* Header */}
//       <div className="mb-4 pb-3 border-bottom border-secondary-subtle">
//         <h2
//           className="fw-bold mb-1 d-flex align-items-center gap-2"
//           style={{ color: "#0F1111", fontSize: "1.5rem" }}
//         >
//           <ShieldAlert
//             style={{ color: "#B12704" }}
//             size={24}
//             strokeWidth={2.5}
//           />{" "}
//           Critical Alerts
//         </h2>
//         <p className="small mb-0" style={{ color: "#565959" }}>
//           Action required: Expiring batches and stock shortages requiring
//           immediate attention.
//         </p>
//       </div>

//       {error && (
//         <div
//           className="alert border-0 shadow-sm mb-4 rounded-1 d-flex align-items-center gap-2"
//           style={{
//             backgroundColor: "#fef0f0",
//             color: "#B12704",
//             borderLeft: "4px solid #B12704",
//           }}
//         >
//           <AlertTriangle size={18} /> {error}
//         </div>
//       )}

//       <div className="row g-4">
//         {/* ------------------------------------------- */}
//         {/* 1. EXPIRY ALERTS COLUMN */}
//         {/* ------------------------------------------- */}
//         <div className="col-lg-6">
//           <div
//             className="card border-0 shadow-sm h-100 rounded-1"
//             style={{ borderTop: "4px solid #B12704" }}
//           >
//             <div className="card-header bg-white border-bottom pt-3 px-4 pb-3 d-flex justify-content-between align-items-center">
//               <div>
//                 <h5
//                   className="card-title fw-bold mb-1 d-flex align-items-center gap-2"
//                   style={{ color: "#0F1111", fontSize: "1rem" }}
//                 >
//                   <Calendar size={18} style={{ color: "#B12704" }} /> Expiry
//                   Warnings
//                 </h5>
//                 <p
//                   className="small mb-0"
//                   style={{ color: "#565959", fontSize: "0.75rem" }}
//                 >
//                   Medicines expiring within the next 90 days
//                 </p>
//               </div>
//               <span
//                 className="badge rounded-1 px-2 py-1"
//                 style={{
//                   backgroundColor: "#fef0f0",
//                   color: "#B12704",
//                   border: "1px solid #B12704",
//                 }}
//               >
//                 {expiringMedicines.length} Alerts
//               </span>
//             </div>

//             <div className="card-body p-0">
//               {expiringMedicines.length === 0 ? (
//                 <div className="text-center py-5">
//                   <CheckCircle
//                     size={36}
//                     style={{ color: "#067D62" }}
//                     className="mb-3 opacity-75"
//                   />
//                   <p className="text-muted small mb-0">
//                     No expiring medicines found.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table align-middle mb-0 border-0">
//                     <thead className="bg-light">
//                       <tr style={{ borderBottom: "1px solid #D5D9D9" }}>
//                         <th
//                           className="ps-4 py-2 small text-muted text-uppercase fw-bold border-0"
//                           style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
//                         >
//                           Medicine
//                         </th>
//                         <th
//                           className="py-2 small text-muted text-uppercase fw-bold border-0"
//                           style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
//                         >
//                           Expiry Date
//                         </th>
//                         <th
//                           className="text-end pe-4 py-2 small text-muted text-uppercase fw-bold border-0"
//                           style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
//                         >
//                           Days Left
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {expiringMedicines.map((m) => {
//                         const daysLeft = getDaysRemaining(m.expiryDate);
//                         return (
//                           <tr
//                             key={m._id}
//                             className="aws-table-row border-bottom"
//                           >
//                             <td className="ps-4 py-3">
//                               <div
//                                 className="fw-bold"
//                                 style={{ color: "#007185", fontSize: "0.9rem" }}
//                               >
//                                 {m.name}
//                               </div>
//                               <div
//                                 className="text-muted mt-1"
//                                 style={{ fontSize: "0.75rem" }}
//                               >
//                                 Batch:{" "}
//                                 <span className="fw-medium text-dark">
//                                   {m.batchNumber || "N/A"}
//                                 </span>
//                               </div>
//                             </td>
//                             <td
//                               className="fw-medium py-3"
//                               style={{ color: "#0F1111", fontSize: "0.85rem" }}
//                             >
//                               {new Date(m.expiryDate).toLocaleDateString()}
//                             </td>
//                             <td className="text-end pe-4 py-3">
//                               <span
//                                 className={`fw-bold ${daysLeft < 30 ? "text-danger" : "text-warning"}`}
//                                 style={{
//                                   color: daysLeft < 30 ? "#B12704" : "#e47911",
//                                 }}
//                               >
//                                 {daysLeft} Days
//                               </span>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ------------------------------------------- */}
//         {/* 2. LOW STOCK ALERTS COLUMN */}
//         {/* ------------------------------------------- */}
//         <div className="col-lg-6">
//           <div
//             className="card border-0 shadow-sm h-100 rounded-1"
//             style={{ borderTop: "4px solid #F3A847" }}
//           >
//             <div className="card-header bg-white border-bottom pt-3 px-4 pb-3 d-flex justify-content-between align-items-center">
//               <div>
//                 <h5
//                   className="card-title fw-bold mb-1 d-flex align-items-center gap-2"
//                   style={{ color: "#0F1111", fontSize: "1rem" }}
//                 >
//                   <Package size={18} style={{ color: "#F3A847" }} /> Low Stock
//                 </h5>
//                 <p
//                   className="small mb-0"
//                   style={{ color: "#565959", fontSize: "0.75rem" }}
//                 >
//                   Items below operational threshold (15 units)
//                 </p>
//               </div>
//               <span
//                 className="badge rounded-1 px-2 py-1 text-dark"
//                 style={{
//                   backgroundColor: "#fcf4e8",
//                   border: "1px solid #F3A847",
//                 }}
//               >
//                 {lowStockMedicines.length} Alerts
//               </span>
//             </div>

//             <div className="card-body p-0">
//               {lowStockMedicines.length === 0 ? (
//                 <div className="text-center py-5">
//                   <CheckCircle
//                     size={36}
//                     style={{ color: "#067D62" }}
//                     className="mb-3 opacity-75"
//                   />
//                   <p className="text-muted small mb-0">
//                     Inventory levels are healthy.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table align-middle mb-0 border-0">
//                     <thead className="bg-light">
//                       <tr style={{ borderBottom: "1px solid #D5D9D9" }}>
//                         <th
//                           className="ps-4 py-2 small text-muted text-uppercase fw-bold border-0"
//                           style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
//                         >
//                           Medicine
//                         </th>
//                         <th
//                           className="py-2 small text-muted text-uppercase fw-bold border-0"
//                           style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
//                         >
//                           Category
//                         </th>
//                         <th
//                           className="text-end pe-4 py-2 small text-muted text-uppercase fw-bold border-0"
//                           style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
//                         >
//                           Current Stock
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {lowStockMedicines.map((m) => (
//                         <tr key={m._id} className="aws-table-row border-bottom">
//                           <td className="ps-4 py-3">
//                             <div
//                               className="fw-bold"
//                               style={{ color: "#007185", fontSize: "0.9rem" }}
//                             >
//                               {m.name}
//                             </div>
//                             <div
//                               className="text-muted mt-1"
//                               style={{ fontSize: "0.75rem" }}
//                             >
//                               {m.brand || "Generic"}
//                             </div>
//                           </td>
//                           <td className="py-3">
//                             <span
//                               className="text-dark"
//                               style={{ fontSize: "0.85rem" }}
//                             >
//                               {m.category}
//                             </span>
//                           </td>
//                           <td className="text-end pe-4 py-3">
//                             <div
//                               className="d-flex align-items-center justify-content-end gap-2 fw-bold"
//                               style={{ color: "#B12704" }}
//                             >
//                               <AlertTriangle size={14} />
//                               {m.countInStock}{" "}
//                               <span
//                                 className="fw-normal text-muted"
//                                 style={{ fontSize: "0.75rem" }}
//                               >
//                                 Units
//                               </span>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.4s ease-out; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         .aws-table-row { transition: background-color 0.1s; }
//         .aws-table-row:hover { background-color: #f8f9fa; }
//       `}</style>
//     </div>
//   );
// };

// export default PharmacistAlerts;

import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  AlertTriangle,
  Calendar,
  Package,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";

const PharmacistAlerts = () => {
  const [expiringMedicines, setExpiringMedicines] = useState([]);
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      // ✅ Now fetching from the dedicated, un-paginated admin route!
      const res = await api.get("/pharmacist/alerts");

      setLowStockMedicines(res.data.lowStockMedicines || []);
      setExpiringMedicines(res.data.expiringMedicines || []);
    } catch (err) {
      console.error("Alert Fetch Error:", err);
      setError("Failed to load alerts. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (date) => {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const diff = target - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days < 0 ? 0 : days;
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center py-5"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-danger me-3" />
        <span className="text-muted small">
          Scanning inventory for risk factors...
        </span>
      </div>
    );
  }

  return (
    <div
      className="container-fluid p-3 p-md-4 animate-fade-in"
      style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="mb-4 pb-3 border-bottom border-secondary-subtle">
        <h2
          className="fw-bold mb-1 d-flex align-items-center gap-2"
          style={{ color: "#0F1111", fontSize: "1.5rem" }}
        >
          <ShieldAlert
            style={{ color: "#B12704" }}
            size={24}
            strokeWidth={2.5}
          />{" "}
          Critical Alerts
        </h2>
        <p className="small mb-0" style={{ color: "#565959" }}>
          Action required: Expiring batches and stock shortages requiring
          immediate attention.
        </p>
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
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      <div className="row g-4">
        {/* ------------------------------------------- */}
        {/* 1. EXPIRY ALERTS COLUMN */}
        {/* ------------------------------------------- */}
        <div className="col-lg-6">
          <div
            className="card border-0 shadow-sm h-100 rounded-1"
            style={{ borderTop: "4px solid #B12704" }}
          >
            <div className="card-header bg-white border-bottom pt-3 px-4 pb-3 d-flex justify-content-between align-items-center">
              <div>
                <h5
                  className="card-title fw-bold mb-1 d-flex align-items-center gap-2"
                  style={{ color: "#0F1111", fontSize: "1rem" }}
                >
                  <Calendar size={18} style={{ color: "#B12704" }} /> Expiry
                  Warnings
                </h5>
                <p
                  className="small mb-0"
                  style={{ color: "#565959", fontSize: "0.75rem" }}
                >
                  Medicines expiring within the next 90 days
                </p>
              </div>
              <span
                className="badge rounded-1 px-2 py-1"
                style={{
                  backgroundColor: "#fef0f0",
                  color: "#B12704",
                  border: "1px solid #B12704",
                }}
              >
                {expiringMedicines.length} Alerts
              </span>
            </div>

            <div className="card-body p-0">
              {expiringMedicines.length === 0 ? (
                <div className="text-center py-5">
                  <CheckCircle
                    size={36}
                    style={{ color: "#067D62" }}
                    className="mb-3 opacity-75"
                  />
                  <p className="text-muted small mb-0">
                    No expiring medicines found.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0 border-0">
                    <thead className="bg-light">
                      <tr style={{ borderBottom: "1px solid #D5D9D9" }}>
                        <th
                          className="ps-4 py-2 small text-muted text-uppercase fw-bold border-0"
                          style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                        >
                          Medicine
                        </th>
                        <th
                          className="py-2 small text-muted text-uppercase fw-bold border-0"
                          style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                        >
                          Expiry Date
                        </th>
                        <th
                          className="text-end pe-4 py-2 small text-muted text-uppercase fw-bold border-0"
                          style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                        >
                          Days Left
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {expiringMedicines.map((m) => {
                        const daysLeft = getDaysRemaining(m.expiryDate);
                        return (
                          <tr
                            key={m._id}
                            className="aws-table-row border-bottom"
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
                                Batch:{" "}
                                <span className="fw-medium text-dark">
                                  {m.batchNumber}
                                </span>
                                <span className="ms-2 text-dark">
                                  (Qty: {m.qty})
                                </span>
                              </div>
                            </td>
                            <td
                              className="fw-medium py-3"
                              style={{ color: "#0F1111", fontSize: "0.85rem" }}
                            >
                              {new Date(m.expiryDate).toLocaleDateString()}
                            </td>
                            <td className="text-end pe-4 py-3">
                              <span
                                className={`fw-bold ${daysLeft < 30 ? "text-danger" : "text-warning"}`}
                                style={{
                                  color: daysLeft < 30 ? "#B12704" : "#e47911",
                                }}
                              >
                                {daysLeft === 0
                                  ? "Expired"
                                  : `${daysLeft} Days`}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------------------------- */}
        {/* 2. LOW STOCK ALERTS COLUMN */}
        {/* ------------------------------------------- */}
        <div className="col-lg-6">
          <div
            className="card border-0 shadow-sm h-100 rounded-1"
            style={{ borderTop: "4px solid #F3A847" }}
          >
            <div className="card-header bg-white border-bottom pt-3 px-4 pb-3 d-flex justify-content-between align-items-center">
              <div>
                <h5
                  className="card-title fw-bold mb-1 d-flex align-items-center gap-2"
                  style={{ color: "#0F1111", fontSize: "1rem" }}
                >
                  <Package size={18} style={{ color: "#F3A847" }} /> Low Stock
                </h5>
                <p
                  className="small mb-0"
                  style={{ color: "#565959", fontSize: "0.75rem" }}
                >
                  Items below operational threshold (15 units)
                </p>
              </div>
              <span
                className="badge rounded-1 px-2 py-1 text-dark"
                style={{
                  backgroundColor: "#fcf4e8",
                  border: "1px solid #F3A847",
                }}
              >
                {lowStockMedicines.length} Alerts
              </span>
            </div>

            <div className="card-body p-0">
              {lowStockMedicines.length === 0 ? (
                <div className="text-center py-5">
                  <CheckCircle
                    size={36}
                    style={{ color: "#067D62" }}
                    className="mb-3 opacity-75"
                  />
                  <p className="text-muted small mb-0">
                    Inventory levels are healthy.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0 border-0">
                    <thead className="bg-light">
                      <tr style={{ borderBottom: "1px solid #D5D9D9" }}>
                        <th
                          className="ps-4 py-2 small text-muted text-uppercase fw-bold border-0"
                          style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                        >
                          Medicine
                        </th>
                        <th
                          className="py-2 small text-muted text-uppercase fw-bold border-0"
                          style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                        >
                          Category
                        </th>
                        <th
                          className="text-end pe-4 py-2 small text-muted text-uppercase fw-bold border-0"
                          style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                        >
                          Current Stock
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockMedicines.map((m) => (
                        <tr key={m._id} className="aws-table-row border-bottom">
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
                              {m.brand || "Generic"}
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
                          <td className="text-end pe-4 py-3">
                            <div
                              className="d-flex align-items-center justify-content-end gap-2 fw-bold"
                              style={{ color: "#B12704" }}
                            >
                              <AlertTriangle size={14} />
                              {m.countInStock}{" "}
                              <span
                                className="fw-normal text-muted"
                                style={{ fontSize: "0.75rem" }}
                              >
                                Units
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .aws-table-row { transition: background-color 0.1s; }
        .aws-table-row:hover { background-color: #f8f9fa; }
      `}</style>
    </div>
  );
};

export default PharmacistAlerts;
