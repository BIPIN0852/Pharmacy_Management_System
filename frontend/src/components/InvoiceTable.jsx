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

import React from "react";

const InvoiceTable = ({ invoices, deleteInvoice }) => {
  return (
    <div className="mt-4">
      <h3>🧾 Saved Invoices</h3>
      {invoices.length === 0 ? (
        <p>No invoices yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle table-bordered text-center">
            <thead className="table-success">
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Items</th>
                <th>Total (Rs.)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.id}</td>
                  <td>{inv.customer}</td>
                  <td>{inv.date}</td>
                  <td>{inv.paymentMethod}</td>
                  <td>
                    {inv.items.map((i, idx) => (
                      <div key={idx}>
                        {i.name} × {i.qty} @ Rs.{i.price}
                      </div>
                    ))}
                  </td>
                  <td>
                    {inv.totals && inv.totals.grandTotal
                      ? inv.totals.grandTotal.toFixed(2)
                      : inv.total
                      ? Number(inv.total).toFixed(2)
                      : "0.00"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteInvoice(inv.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;
