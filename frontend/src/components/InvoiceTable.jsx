// import React from "react";

// const InvoiceTable = ({ invoices, deleteInvoice }) => {
//   return (
//     <div style={{ marginTop: "2rem" }}>
//       <h3>🧾 Saved Invoices</h3>
//       {invoices.length === 0 ? (
//         <p>No invoices yet.</p>
//       ) : (
//         <table
//           border="1"
//           cellPadding="8"
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             textAlign: "center",
//           }}
//         >
//           <thead style={{ background: "#e8f5e9" }}>
//             <tr>
//               <th>ID</th>
//               <th>Customer</th>
//               <th>Date</th>
//               <th>Payment</th>
//               <th>Items</th>
//               <th>Total (Rs.)</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoices.map((inv) => (
//               <tr key={inv.id}>
//                 <td>{inv.id}</td>
//                 <td>{inv.customer}</td>
//                 <td>{inv.date}</td>
//                 <td>{inv.paymentMethod}</td>
//                 <td>
//                   {inv.items.map((i, idx) => (
//                     <div key={idx}>
//                       {i.name} × {i.qty} @ Rs.{i.price}
//                     </div>
//                   ))}
//                 </td>
//                 <td>{inv.totals.grandTotal.toFixed(2)}</td>
//                 <td>
//                   <button
//                     style={{ color: "red" }}
//                     onClick={() => deleteInvoice(inv.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default InvoiceTable;

// import React from "react";

// const InvoiceTable = ({ invoices, deleteInvoice }) => {
//   return (
//     <div className="mt-4">
//       <h3>🧾 Saved Invoices</h3>
//       {invoices.length === 0 ? (
//         <p>No invoices yet.</p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-striped align-middle table-bordered text-center">
//             <thead className="table-success">
//               <tr>
//                 <th>ID</th>
//                 <th>Customer</th>
//                 <th>Date</th>
//                 <th>Payment</th>
//                 <th>Items</th>
//                 <th>Total (Rs.)</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {invoices.map((inv) => (
//                 <tr key={inv.id}>
//                   <td>{inv.id}</td>
//                   <td>{inv.customer}</td>
//                   <td>{inv.date}</td>
//                   <td>{inv.paymentMethod}</td>
//                   <td>
//                     {inv.items.map((i, idx) => (
//                       <div key={idx}>
//                         {i.name} × {i.qty} @ Rs.{i.price}
//                       </div>
//                     ))}
//                   </td>
//                   <td>
//                     {inv.totals && inv.totals.grandTotal
//                       ? inv.totals.grandTotal.toFixed(2)
//                       : inv.total
//                       ? Number(inv.total).toFixed(2)
//                       : "0.00"}
//                   </td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => deleteInvoice(inv.id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InvoiceTable;

import React from "react";
import { Trash2, Printer, Eye, FileText } from "lucide-react";

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

  // Helper for payment badges
  const getPaymentBadge = (method) => {
    const colors = {
      Cash: "bg-success",
      Khalti: "bg-purple", // Custom CSS for Khalti purple
      eSewa: "bg-success",
      Stripe: "bg-primary",
      Card: "bg-info",
    };
    return `badge ${colors[method] || "bg-secondary"} rounded-pill px-3 py-2`;
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 bg-white mt-4">
      <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold text-dark">
          <i className="bi bi-journal-text me-2 text-primary"></i>Saved Invoices
        </h5>
        <span className="badge bg-light text-dark border">
          {invoices.length} Total
        </span>
      </div>

      <div className="card-body p-0">
        {invoices.length === 0 ? (
          <div className="text-center py-5">
            <FileText size={48} className="text-muted opacity-25 mb-3" />
            <p className="text-muted">No invoices recorded yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-uppercase text-muted">
                  <th className="ps-4">Invoice ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Items Summary</th>
                  <th>Total Amount</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="ps-4 fw-bold text-primary small">
                      {inv.id.toString().substring(0, 10)}...
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">
                        {inv.customer}
                      </div>
                    </td>
                    <td className="small text-muted">
                      {new Date(inv.date).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={getPaymentBadge(inv.paymentMethod)}>
                        {inv.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <div className="small">
                        {inv.items.length}{" "}
                        {inv.items.length === 1 ? "item" : "items"}
                        <span className="text-muted ms-1">
                          ({inv.items[0]?.name}
                          {inv.items.length > 1 ? "..." : ""})
                        </span>
                      </div>
                    </td>
                    <td className="fw-bold text-dark">
                      {formatCurrency(
                        inv.totalAmount ||
                          inv.totals?.grandTotal ||
                          inv.total ||
                          0
                      )}
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group shadow-sm rounded">
                        <button
                          className="btn btn-white btn-sm border"
                          title="Print/Download PDF"
                          onClick={() =>
                            window.open(
                              `/api/orders/${inv.id}/invoice`,
                              "_blank"
                            )
                          }
                        >
                          <Printer size={16} className="text-secondary" />
                        </button>
                        <button
                          className="btn btn-white btn-sm border"
                          title="View Details"
                          onClick={() => viewInvoice(inv)}
                        >
                          <Eye size={16} className="text-primary" />
                        </button>
                        <button
                          className="btn btn-white btn-sm border"
                          title="Delete Record"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this invoice?"
                              )
                            ) {
                              deleteInvoice(inv.id);
                            }
                          }}
                        >
                          <Trash2 size={16} className="text-danger" />
                        </button>
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
        .bg-purple { background-color: #5d2e8e; color: white; }
        .btn-white { background: white; }
        .btn-white:hover { background: #f8f9fa; }
        .table-hover tbody tr:hover { background-color: rgba(13, 110, 253, 0.02); }
      `}</style>
    </div>
  );
};

export default InvoiceTable;
