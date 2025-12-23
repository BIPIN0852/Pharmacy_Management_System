// backend/generateInvoice.js
import PDFDocument from "pdfkit";
import fs from "fs";

export const createInvoicePDF = (invoiceData, res) => {
  const doc = new PDFDocument({ margin: 40 });
  res.setHeader("Content-Type", "application/pdf");

  doc.fontSize(20).text("💊 Pharmacy Invoice", { align: "center" }).moveDown();

  doc.fontSize(12).text(`Order ID: ${invoiceData.orderId}`);
  doc.text(`Customer: ${invoiceData.customer}`);
  doc.text(`Email: ${invoiceData.email}`);
  doc.text(`Date: ${invoiceData.date}`);
  doc.moveDown();

  doc.text("Items:", { underline: true });
  invoiceData.items.forEach((item) => {
    doc.text(`${item.name} (${item.qty} x NPR ${item.price})`);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total: NPR ${invoiceData.total}`, { bold: true });
  doc.moveDown();

  doc
    .fontSize(12)
    .text(`Payment Method: ${invoiceData.paymentMethod}`)
    .moveDown(2);

  doc.text("Thank you for your purchase!", { align: "center" });
  doc.end();
  doc.pipe(res);
};
