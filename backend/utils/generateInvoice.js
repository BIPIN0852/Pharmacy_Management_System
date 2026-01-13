const PDFDocument = require("pdfkit");
const fs = require("fs");

const createInvoicePDF = (invoiceData, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // Stream PDF directly to the response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${invoiceData.orderId}.pdf`
  );

  doc.pipe(res);

  // --- Header ---
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("SMART PHARMACY", 50, 57)
    .fontSize(10)
    .text("123 Health Street", 200, 50, { align: "right" })
    .text("Kathmandu, Nepal", 200, 65, { align: "right" })
    .moveDown();

  // --- Invoice Info ---
  doc.fillColor("#000000").fontSize(20).text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerTop)
    .font("Helvetica-Bold")
    .text(invoiceData.orderId, 150, customerTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerTop + 15)
    .text(invoiceData.date, 150, customerTop + 15)
    .text("Balance Due:", 50, customerTop + 30)
    .text("NPR " + invoiceData.total, 150, customerTop + 30)

    .font("Helvetica-Bold")
    .text(invoiceData.customer, 300, customerTop)
    .font("Helvetica")
    .text(invoiceData.email, 300, customerTop + 15)
    .moveDown();

  generateHr(doc, 252);

  // --- Table Header ---
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  // --- Table Rows ---
  let i = 0;
  invoiceData.items.forEach((item) => {
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.name,
      "NPR " + item.price,
      item.qty,
      "NPR " + (item.price * item.qty).toFixed(2)
    );

    generateHr(doc, position + 20);
    i++;
  });

  // --- Total ---
  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Total Due",
    "NPR " + invoiceData.total
  );

  // --- Footer ---
  doc
    .fontSize(10)
    .text(
      "Payment received via " +
        invoiceData.paymentMethod +
        ". Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );

  doc.end();
};

function generateTableRow(doc, y, item, unitCost, quantity, lineTotal) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

module.exports = { createInvoicePDF };
