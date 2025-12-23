import React, { useState, useEffect } from "react";
import BillingForm from "../components/BillingForm";
import InvoiceTable from "../components/InvoiceTable";

const SalesBilling = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(saved);
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem("invoices", JSON.stringify(data));
  };

  const addInvoice = (invoice) => {
    const updated = [...invoices, invoice];
    setInvoices(updated);
    saveToStorage(updated);
  };

  const deleteInvoice = (id) => {
    const updated = invoices.filter((inv) => inv.id !== id);
    setInvoices(updated);
    saveToStorage(updated);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🧾 Sales & Billing Management</h2>
      <BillingForm addInvoice={addInvoice} />
      <InvoiceTable invoices={invoices} deleteInvoice={deleteInvoice} />
    </div>
  );
};

export default SalesBilling;
