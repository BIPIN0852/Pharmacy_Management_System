import React from "react";
import { Trash2, Printer, Eye, ReceiptText } from "lucide-react";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";

const InvoiceTable = ({ invoices, deleteInvoice, viewInvoice }) => {
  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 2,
    })
      .format(amount)
      .replace("NPR", "Rs.");
  };

  // AWS-style Payment Badges
  const renderPaymentBadge = (method) => {
    switch (method?.toLowerCase()) {
      case "khalti":
        return (
          <Badge
            style={{ backgroundColor: "#5E35B1", color: "#fff" }}
            className="rounded-1 px-2 fw-medium"
          >
            Khalti
          </Badge>
        );
      case "stripe":
      case "card":
        return (
          <Badge bg="primary" className="rounded-1 px-2 fw-medium">
            Card / Stripe
          </Badge>
        );
      // case "esewa":
      //   return (
      //     <Badge bg="success" className="rounded-1 px-2 fw-medium">
      //       eSewa
      //     </Badge>
      //   );
      case "cash":
      case "cod":
        return (
          <Badge bg="info" text="dark" className="rounded-1 px-2 fw-medium">
            Cash
          </Badge>
        );
      default:
        return (
          <Badge bg="secondary" className="rounded-1 px-2 fw-medium">
            {method || "Unknown"}
          </Badge>
        );
    }
  };

  return (
    <div className="bg-white" style={{ borderRadius: "0 0 4px 4px" }}>
      <div className="p-0">
        {invoices.length === 0 ? (
          <div className="text-center py-5">
            <ReceiptText size={48} className="text-muted opacity-25 mb-3" />
            <p className="text-muted fw-medium mb-0">
              No invoices recorded yet.
            </p>
          </div>
        ) : (
          <div className="table-responsive custom-scrollbar">
            <table className="table align-middle mb-0 custom-saas-table">
              <thead className="bg-light border-bottom">
                <tr className="small text-uppercase text-muted fw-bold tracking-wider">
                  <th className="ps-4 py-3 border-bottom-0">Invoice ID</th>
                  <th className="py-3 border-bottom-0">Customer</th>
                  <th className="py-3 border-bottom-0">Date</th>
                  <th className="py-3 border-bottom-0">Payment</th>
                  <th className="py-3 border-bottom-0">Items Summary</th>
                  <th className="py-3 border-bottom-0">Total Amount</th>
                  <th className="text-end pe-4 py-3 border-bottom-0">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-bottom border-light-subtle table-row-hover"
                  >
                    <td className="ps-4 py-3">
                      <span
                        className="fw-bold font-monospace cursor-pointer hover-underline"
                        style={{ color: "#007185", fontSize: "0.9rem" }}
                        onClick={() => viewInvoice(inv)}
                      >
                        #{inv.id.toString().substring(0, 8).toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3">
                      <div
                        className="fw-bold text-dark"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {inv.customer || "Guest User"}
                      </div>
                    </td>

                    <td
                      className="small text-muted fw-medium py-3"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {new Date(inv.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="py-3">
                      {renderPaymentBadge(inv.paymentMethod)}
                    </td>

                    <td className="py-3">
                      <div className="small text-dark">
                        <span className="fw-bold">
                          {inv.items?.length || 0}
                        </span>{" "}
                        item(s)
                        {inv.items?.length > 0 && (
                          <span
                            className="text-muted ms-1 d-block d-md-inline"
                            style={{ fontSize: "0.75rem" }}
                          >
                            ({inv.items[0]?.name}
                            {inv.items.length > 1 ? "..." : ""})
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3">
                      <div
                        className="fw-bold"
                        style={{ color: "#B12704", fontSize: "0.95rem" }}
                      >
                        {formatCurrency(
                          inv.totalAmount ||
                            inv.totals?.grandTotal ||
                            inv.total ||
                            0,
                        )}
                      </div>
                    </td>

                    <td className="text-end pe-4 py-3">
                      <div className="d-flex justify-content-end gap-2">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-print-${inv.id}`}>
                              Download PDF
                            </Tooltip>
                          }
                        >
                          <button
                            className="btn btn-sm btn-light border shadow-sm rounded-1 p-2 icon-hover"
                            style={{ borderColor: "#D5D9D9" }}
                            onClick={() =>
                              window.open(
                                `/api/orders/${inv.id}/invoice`,
                                "_blank",
                              )
                            }
                          >
                            <Printer size={16} className="text-secondary" />
                          </button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-view-${inv.id}`}>
                              View Details
                            </Tooltip>
                          }
                        >
                          <button
                            className="btn btn-sm btn-light border shadow-sm rounded-1 p-2 icon-hover"
                            style={{ borderColor: "#D5D9D9" }}
                            onClick={() => viewInvoice(inv)}
                          >
                            <Eye size={16} style={{ color: "#007185" }} />
                          </button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-delete-${inv.id}`}>
                              Delete Invoice
                            </Tooltip>
                          }
                        >
                          <button
                            className="btn btn-sm btn-light border shadow-sm rounded-1 p-2 icon-hover hover-bg-danger"
                            style={{ borderColor: "#D5D9D9" }}
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this invoice record?",
                                )
                              ) {
                                deleteInvoice(inv.id);
                              }
                            }}
                          >
                            <Trash2 size={16} className="text-danger" />
                          </button>
                        </OverlayTrigger>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .tracking-wider { letter-spacing: 0.05em; }
        .table-row-hover:hover { background-color: #f8f9fa; }
        .cursor-pointer { cursor: pointer; }
        .hover-underline:hover { text-decoration: underline !important; color: #C7511F !important; }
        
        .icon-hover { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .icon-hover:hover { transform: translateY(-1px); box-shadow: 0 4px 6px rgba(0,0,0,0.08) !important; }
        .hover-bg-danger:hover { background-color: #fef0f0 !important; border-color: #f5c6cb !important; }
      `}</style>
    </div>
  );
};

export default InvoiceTable;
