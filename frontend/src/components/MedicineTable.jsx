import React, { useEffect } from "react";
import {
  AlertTriangle,
  Trash2,
  Edit3,
  Pill,
  CheckCircle,
  XCircle,
} from "lucide-react";

const MedicineTable = ({ medicines, deleteMedicine, updateMedicine }) => {
  useEffect(() => {
    const today = new Date();
    const soon = new Date();
    soon.setDate(today.getDate() + 30);

    medicines.forEach((m) => {
      // Alert logic for Low Stock
      if ((m.countInStock || 0) < 10) {
        console.warn(`⚠️ Low stock: ${m.name} (only ${m.countInStock} left)`);
      }

      // Alert logic for Near Expiry
      const firstBatch = m.batches && m.batches[0];
      if (firstBatch?.expiryDate) {
        const exp = new Date(firstBatch.expiryDate);
        if (exp <= soon) {
          console.warn(
            `⏰ Expiring soon: ${m.name} on ${exp.toLocaleDateString()}`,
          );
        }
      }
    });
  }, [medicines]);

  // Helper for Stock Status Color
  const getStockStatus = (count) => {
    if (count <= 0) return { label: "Out of Stock", class: "status-danger" };
    if (count < 10) return { label: "Low Stock", class: "status-warning" };
    return { label: "In Stock", class: "status-success" };
  };

  return (
    <div className="bg-white">
      <div className="table-responsive">
        <table className="table align-middle mb-0 border-0">
          <thead className="bg-light">
            <tr style={{ borderBottom: "1px solid #D5D9D9" }}>
              <th
                className="ps-4 py-2 border-0 small text-muted text-uppercase fw-bold"
                style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
              >
                Medicine & Brand
              </th>
              <th
                className="py-2 border-0 small text-muted text-uppercase fw-bold"
                style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
              >
                Category
              </th>
              <th
                className="py-2 border-0 small text-muted text-uppercase fw-bold"
                style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
              >
                Pricing
              </th>
              <th
                className="py-2 border-0 small text-muted text-uppercase fw-bold"
                style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
              >
                Packaging
              </th>
              <th
                className="py-2 border-0 small text-muted text-uppercase fw-bold"
                style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
              >
                Batch / Stock
              </th>
              <th
                className="py-2 border-0 small text-muted text-uppercase fw-bold"
                style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
              >
                Expiry
              </th>
              <th
                className="py-2 border-0 small text-muted text-uppercase fw-bold text-center"
                style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
              >
                Rx
              </th>
              <th
                className="py-2 border-0 small text-muted text-uppercase fw-bold text-end pe-4"
                style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {medicines.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-5 text-muted small">
                  <Pill
                    size={40}
                    className="mb-2"
                    style={{ color: "#D5D9D9" }}
                  />
                  <p className="mb-0">No medicines found in inventory.</p>
                </td>
              </tr>
            ) : (
              medicines.map((m) => {
                const firstBatch = m.batches && m.batches[0];
                const expiryDate = firstBatch?.expiryDate
                  ? new Date(firstBatch.expiryDate)
                  : null;
                const isExpired = expiryDate && expiryDate < new Date();
                const baseUnit = m.baseUnit || "Unit";
                const stockStatus = getStockStatus(m.countInStock || 0);

                return (
                  <tr
                    key={m._id || m.id}
                    className={`aws-table-row border-bottom border-light-subtle ${isExpired ? "table-danger-light" : ""}`}
                  >
                    {/* Name & Brand */}
                    <td className="ps-4 py-3 border-0">
                      <div
                        className="fw-bold"
                        style={{ color: "#007185", fontSize: "0.9rem" }}
                      >
                        {m.name}
                      </div>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {m.brand || "Generic"}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 border-0">
                      <span
                        className="badge rounded-1"
                        style={{
                          backgroundColor: "#f0f2f2",
                          color: "#565959",
                          border: "1px solid #D5D9D9",
                          fontWeight: "500",
                        }}
                      >
                        {m.category || "General"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 border-0">
                      <div
                        className="fw-bold"
                        style={{ color: "#0F1111", fontSize: "0.9rem" }}
                      >
                        NPR {m.price}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#565959" }}>
                        per {baseUnit}
                      </div>
                    </td>

                    {/* Packaging Units */}
                    <td
                      className="py-3 border-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {m.units && m.units.length > 0 ? (
                        <div className="d-flex flex-column gap-1">
                          {m.units.map((u, i) => (
                            <div
                              key={i}
                              className="text-nowrap pb-1"
                              style={{
                                borderBottom:
                                  i !== m.units.length - 1
                                    ? "1px dashed #D5D9D9"
                                    : "none",
                              }}
                            >
                              <span
                                className="fw-bold"
                                style={{ color: "#0F1111" }}
                              >
                                {u.name}
                              </span>
                              : NPR {u.price}
                              <span
                                style={{
                                  color: "#565959",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {" "}
                                ({u.multiplier} {baseUnit[0]})
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span
                          className="italic"
                          style={{ color: "#888C8C", fontSize: "0.75rem" }}
                        >
                          Standard only
                        </span>
                      )}
                    </td>

                    {/* Batch & Stock */}
                    <td className="py-3 border-0">
                      <div
                        className="mb-1 fw-medium"
                        style={{ fontSize: "0.7rem", color: "#565959" }}
                      >
                        #{firstBatch?.batchNumber || "N/A"}
                      </div>
                      <span
                        className={`badge rounded-1 ${stockStatus.class}`}
                        style={{ fontSize: "0.7rem", fontWeight: "600" }}
                      >
                        {m.countInStock || 0} {baseUnit}s
                      </span>
                    </td>

                    {/* Expiry */}
                    <td className="py-3 border-0">
                      <div
                        className="fw-medium"
                        style={{
                          fontSize: "0.85rem",
                          color: isExpired ? "#B12704" : "#0F1111",
                        }}
                      >
                        {expiryDate ? expiryDate.toLocaleDateString() : "-"}
                      </div>
                      {isExpired && (
                        <div
                          className="fw-bold mt-1"
                          style={{
                            fontSize: "0.65rem",
                            color: "#B12704",
                            letterSpacing: "0.5px",
                          }}
                        >
                          EXPIRED
                        </div>
                      )}
                    </td>

                    {/* Prescription Required */}
                    <td className="text-center py-3 border-0">
                      {m.prescriptionRequired ? (
                        <AlertTriangle
                          size={18}
                          style={{ color: "#B12704" }}
                          title="Rx Required"
                        />
                      ) : (
                        <CheckCircle
                          size={18}
                          style={{ color: "#067D62" }}
                          title="OTC Medicine"
                        />
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-end pe-4 py-3 border-0">
                      <div
                        className="btn-group shadow-sm border rounded-1 bg-white overflow-hidden"
                        style={{ borderColor: "#D5D9D9" }}
                      >
                        <button
                          className="btn btn-sm btn-white border-0"
                          title="Quick Update Stock"
                          onClick={() => {
                            const newQty = prompt(
                              `Update stock for ${m.name} (current: ${m.countInStock}):`,
                              m.countInStock,
                            );
                            if (newQty !== null && newQty !== "") {
                              updateMedicine({
                                ...m,
                                countInStock: Number(newQty),
                              });
                            }
                          }}
                        >
                          <Edit3 size={16} style={{ color: "#007185" }} />
                        </button>
                        <button
                          className="btn btn-sm btn-white border-0 border-start"
                          title="Remove Medicine"
                          style={{ borderColor: "#D5D9D9 !important" }}
                          onClick={() => {
                            if (
                              window.confirm(
                                `Permanently delete ${m.name} from inventory?`,
                              )
                            ) {
                              deleteMedicine(m._id || m.id);
                            }
                          }}
                        >
                          <Trash2 size={16} style={{ color: "#B12704" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .aws-table-row { transition: background-color 0.1s; }
        .aws-table-row:hover { background-color: #f8f9fa; }
        .table-danger-light { background-color: #fef0f0 !important; }
        .btn-white { background: #fff; }
        .btn-white:hover { background: #f0f2f2; }
        
        /* Custom Status Badge Colors */
        .status-success { background-color: #f2fcf5; color: #067D62; border: 1px solid #067D62; }
        .status-warning { background-color: #fff9e6; color: #e47911; border: 1px solid #e47911; }
        .status-danger { background-color: #fef0f0; color: #B12704; border: 1px solid #B12704; }
      `}</style>
    </div>
  );
};

export default MedicineTable;
