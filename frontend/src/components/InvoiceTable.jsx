// // import React from "react";

// // const InvoiceTable = ({ invoices, deleteInvoice }) => {
// //   return (
// //     <div style={{ marginTop: "2rem" }}>
// //       <h3>🧾 Saved Invoices</h3>
// //       {invoices.length === 0 ? (
// //         <p>No invoices yet.</p>
// //       ) : (
// //         <table
// //           border="1"
// //           cellPadding="8"
// //           style={{
// //             width: "100%",
// //             borderCollapse: "collapse",
// //             textAlign: "center",
// //           }}
// //         >
// //           <thead style={{ background: "#e8f5e9" }}>
// //             <tr>
// //               <th>ID</th>
// //               <th>Customer</th>
// //               <th>Date</th>
// //               <th>Payment</th>
// //               <th>Items</th>
// //               <th>Total (Rs.)</th>
// //               <th>Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {invoices.map((inv) => (
// //               <tr key={inv.id}>
// //                 <td>{inv.id}</td>
// //                 <td>{inv.customer}</td>
// //                 <td>{inv.date}</td>
// //                 <td>{inv.paymentMethod}</td>
// //                 <td>
// //                   {inv.items.map((i, idx) => (
// //                     <div key={idx}>
// //                       {i.name} × {i.qty} @ Rs.{i.price}
// //                     </div>
// //                   ))}
// //                 </td>
// //                 <td>{inv.totals.grandTotal.toFixed(2)}</td>
// //                 <td>
// //                   <button
// //                     style={{ color: "red" }}
// //                     onClick={() => deleteInvoice(inv.id)}
// //                   >
// //                     Delete
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       )}
// //     </div>
// //   );
// // };

// // export default InvoiceTable;

// // import React from "react";

// // const InvoiceTable = ({ invoices, deleteInvoice }) => {
// //   return (
// //     <div className="mt-4">
// //       <h3>🧾 Saved Invoices</h3>
// //       {invoices.length === 0 ? (
// //         <p>No invoices yet.</p>
// //       ) : (
// //         <div className="table-responsive">
// //           <table className="table table-striped align-middle table-bordered text-center">
// //             <thead className="table-success">
// //               <tr>
// //                 <th>ID</th>
// //                 <th>Customer</th>
// //                 <th>Date</th>
// //                 <th>Payment</th>
// //                 <th>Items</th>
// //                 <th>Total (Rs.)</th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {invoices.map((inv) => (
// //                 <tr key={inv.id}>
// //                   <td>{inv.id}</td>
// //                   <td>{inv.customer}</td>
// //                   <td>{inv.date}</td>
// //                   <td>{inv.paymentMethod}</td>
// //                   <td>
// //                     {inv.items.map((i, idx) => (
// //                       <div key={idx}>
// //                         {i.name} × {i.qty} @ Rs.{i.price}
// //                       </div>
// //                     ))}
// //                   </td>
// //                   <td>
// //                     {inv.totals && inv.totals.grandTotal
// //                       ? inv.totals.grandTotal.toFixed(2)
// //                       : inv.total
// //                       ? Number(inv.total).toFixed(2)
// //                       : "0.00"}
// //                   </td>
// //                   <td>
// //                     <button
// //                       className="btn btn-sm btn-outline-danger"
// //                       onClick={() => deleteInvoice(inv.id)}
// //                     >
// //                       Delete
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default InvoiceTable;

// // import React from "react";
// // import { Trash2, Printer, Eye, FileText } from "lucide-react";

// // const InvoiceTable = ({ invoices, deleteInvoice, viewInvoice }) => {
// //   // Helper to format currency
// //   const formatCurrency = (amount) => {
// //     return new Intl.NumberFormat("en-NP", {
// //       style: "currency",
// //       currency: "NPR",
// //       minimumFractionDigits: 2,
// //     })
// //       .format(amount)
// //       .replace("NPR", "Rs.");
// //   };

// //   // Helper for payment badges
// //   const getPaymentBadge = (method) => {
// //     const colors = {
// //       Cash: "bg-success",
// //       Khalti: "bg-purple", // Custom CSS for Khalti purple
// //       eSewa: "bg-success",
// //       Stripe: "bg-primary",
// //       Card: "bg-info",
// //     };
// //     return `badge ${colors[method] || "bg-secondary"} rounded-pill px-3 py-2`;
// //   };

// //   return (
// //     <div className="card shadow-sm border-0 rounded-3 bg-white mt-4">
// //       <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
// //         <h5 className="mb-0 fw-bold text-dark">
// //           <i className="bi bi-journal-text me-2 text-primary"></i>Saved Invoices
// //         </h5>
// //         <span className="badge bg-light text-dark border">
// //           {invoices.length} Total
// //         </span>
// //       </div>

// //       <div className="card-body p-0">
// //         {invoices.length === 0 ? (
// //           <div className="text-center py-5">
// //             <FileText size={48} className="text-muted opacity-25 mb-3" />
// //             <p className="text-muted">No invoices recorded yet.</p>
// //           </div>
// //         ) : (
// //           <div className="table-responsive">
// //             <table className="table table-hover align-middle mb-0">
// //               <thead className="table-light">
// //                 <tr className="small text-uppercase text-muted">
// //                   <th className="ps-4">Invoice ID</th>
// //                   <th>Customer</th>
// //                   <th>Date</th>
// //                   <th>Payment</th>
// //                   <th>Items Summary</th>
// //                   <th>Total Amount</th>
// //                   <th className="text-end pe-4">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {invoices.map((inv) => (
// //                   <tr key={inv.id}>
// //                     <td className="ps-4 fw-bold text-primary small">
// //                       {inv.id.toString().substring(0, 10)}...
// //                     </td>
// //                     <td>
// //                       <div className="fw-semibold text-dark">
// //                         {inv.customer}
// //                       </div>
// //                     </td>
// //                     <td className="small text-muted">
// //                       {new Date(inv.date).toLocaleDateString()}
// //                     </td>
// //                     <td>
// //                       <span className={getPaymentBadge(inv.paymentMethod)}>
// //                         {inv.paymentMethod}
// //                       </span>
// //                     </td>
// //                     <td>
// //                       <div className="small">
// //                         {inv.items.length}{" "}
// //                         {inv.items.length === 1 ? "item" : "items"}
// //                         <span className="text-muted ms-1">
// //                           ({inv.items[0]?.name}
// //                           {inv.items.length > 1 ? "..." : ""})
// //                         </span>
// //                       </div>
// //                     </td>
// //                     <td className="fw-bold text-dark">
// //                       {formatCurrency(
// //                         inv.totalAmount ||
// //                           inv.totals?.grandTotal ||
// //                           inv.total ||
// //                           0
// //                       )}
// //                     </td>
// //                     <td className="text-end pe-4">
// //                       <div className="btn-group shadow-sm rounded">
// //                         <button
// //                           className="btn btn-white btn-sm border"
// //                           title="Print/Download PDF"
// //                           onClick={() =>
// //                             window.open(
// //                               `/api/orders/${inv.id}/invoice`,
// //                               "_blank"
// //                             )
// //                           }
// //                         >
// //                           <Printer size={16} className="text-secondary" />
// //                         </button>
// //                         <button
// //                           className="btn btn-white btn-sm border"
// //                           title="View Details"
// //                           onClick={() => viewInvoice(inv)}
// //                         >
// //                           <Eye size={16} className="text-primary" />
// //                         </button>
// //                         <button
// //                           className="btn btn-white btn-sm border"
// //                           title="Delete Record"
// //                           onClick={() => {
// //                             if (
// //                               window.confirm(
// //                                 "Are you sure you want to delete this invoice?"
// //                               )
// //                             ) {
// //                               deleteInvoice(inv.id);
// //                             }
// //                           }}
// //                         >
// //                           <Trash2 size={16} className="text-danger" />
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>

// //       <style>{`
// //         .bg-purple { background-color: #5d2e8e; color: white; }
// //         .btn-white { background: white; }
// //         .btn-white:hover { background: #f8f9fa; }
// //         .table-hover tbody tr:hover { background-color: rgba(13, 110, 253, 0.02); }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default InvoiceTable;

// import React from "react";
// import { Trash2, Printer, Eye, FileText, ReceiptText } from "lucide-react";

// const InvoiceTable = ({ invoices, deleteInvoice, viewInvoice }) => {
//   // Helper to format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-NP", {
//       style: "currency",
//       currency: "NPR",
//       minimumFractionDigits: 2,
//     })
//       .format(amount)
//       .replace("NPR", "Rs.");
//   };

//   // Helper for payment badges
//   const getPaymentBadge = (method) => {
//     const colors = {
//       Cash: "bg-success",
//       Khalti: "bg-purple", // Custom CSS for Khalti purple
//       eSewa: "bg-success",
//       Stripe: "bg-primary",
//       Card: "bg-info",
//     };
//     return `badge ${colors[method] || "bg-secondary"} rounded-pill px-3 py-2 fw-medium`;
//   };

//   return (
//     <div className="bg-white" style={{ borderRadius: "0 0 8px 8px" }}>
//       {/* Note: I removed the duplicate "Card Header" here because your
//         parent component (SalesBilling.jsx) already provides a header for this section.
//       */}

//       <div className="p-0">
//         {invoices.length === 0 ? (
//           <div className="text-center py-5">
//             <ReceiptText size={48} className="text-muted opacity-25 mb-3" />
//             <p className="text-muted mb-0">No invoices recorded yet.</p>
//           </div>
//         ) : (
//           <div className="table-responsive">
//             <table className="table align-middle mb-0 border-0">
//               <thead className="bg-light">
//                 <tr
//                   className="small text-uppercase text-muted"
//                   style={{ letterSpacing: "0.5px" }}
//                 >
//                   <th className="ps-4 py-3 border-bottom-0 fw-bold">
//                     Invoice ID
//                   </th>
//                   <th className="py-3 border-bottom-0 fw-bold">Customer</th>
//                   <th className="py-3 border-bottom-0 fw-bold">Date</th>
//                   <th className="py-3 border-bottom-0 fw-bold">Payment</th>
//                   <th className="py-3 border-bottom-0 fw-bold">
//                     Items Summary
//                   </th>
//                   <th className="py-3 border-bottom-0 fw-bold">Total Amount</th>
//                   <th className="text-end pe-4 py-3 border-bottom-0 fw-bold">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {invoices.map((inv) => (
//                   <tr
//                     key={inv.id}
//                     className="border-bottom border-light-subtle amazon-row"
//                   >
//                     <td
//                       className="ps-4 fw-bold small py-3"
//                       style={{ color: "#007185" }}
//                     >
//                       {inv.id.toString().substring(0, 10)}...
//                     </td>
//                     <td className="py-3">
//                       <div className="fw-semibold text-dark">
//                         {inv.customer}
//                       </div>
//                     </td>
//                     <td className="small text-muted py-3">
//                       {new Date(inv.date).toLocaleDateString()}
//                     </td>
//                     <td className="py-3">
//                       <span
//                         className={getPaymentBadge(inv.paymentMethod)}
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         {inv.paymentMethod}
//                       </span>
//                     </td>
//                     <td className="py-3">
//                       <div className="small">
//                         {inv.items.length}{" "}
//                         {inv.items.length === 1 ? "item" : "items"}
//                         <span className="text-muted ms-1">
//                           ({inv.items[0]?.name}
//                           {inv.items.length > 1 ? "..." : ""})
//                         </span>
//                       </div>
//                     </td>
//                     <td className="fw-bold text-dark py-3">
//                       {formatCurrency(
//                         inv.totalAmount ||
//                           inv.totals?.grandTotal ||
//                           inv.total ||
//                           0,
//                       )}
//                     </td>
//                     <td className="text-end pe-4 py-3">
//                       <div className="btn-group shadow-sm rounded-3">
//                         <button
//                           className="btn btn-white btn-sm border-secondary-subtle"
//                           title="Print/Download PDF"
//                           onClick={() =>
//                             window.open(
//                               `/api/orders/${inv.id}/invoice`,
//                               "_blank",
//                             )
//                           }
//                         >
//                           <Printer size={16} className="text-secondary" />
//                         </button>
//                         <button
//                           className="btn btn-white btn-sm border-secondary-subtle border-start-0 border-end-0"
//                           title="View Details"
//                           onClick={() => viewInvoice(inv)}
//                         >
//                           <Eye size={16} style={{ color: "#007185" }} />
//                         </button>
//                         <button
//                           className="btn btn-white btn-sm border-secondary-subtle"
//                           title="Delete Record"
//                           onClick={() => {
//                             if (
//                               window.confirm(
//                                 "Are you sure you want to delete this invoice?",
//                               )
//                             ) {
//                               deleteInvoice(inv.id);
//                             }
//                           }}
//                         >
//                           <Trash2 size={16} className="text-danger" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <style>{`
//         .bg-purple { background-color: #5E35B1; color: white; }
//         .btn-white { background: white; transition: background-color 0.2s; }
//         .btn-white:hover { background: #f0f2f2; }
//         .amazon-row { transition: background-color 0.2s ease; }
//         .amazon-row:hover { background-color: #f8f9fa; }
//       `}</style>
//     </div>
//   );
// };

// export default InvoiceTable;

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
      case "esewa":
        return (
          <Badge bg="success" className="rounded-1 px-2 fw-medium">
            eSewa
          </Badge>
        );
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
