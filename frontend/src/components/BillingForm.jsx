import React, { useState } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { Receipt, Trash2, Plus, CheckCircle } from "lucide-react";

const BillingForm = ({ addInvoice, medicines = [] }) => {
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [items, setItems] = useState([
    { medicineId: "", name: "", qty: 1, price: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(13); // Default Nepal VAT

  // Handle changes for specific item rows
  const handleItemChange = (index, field, value) => {
    const updated = [...items];

    // If selecting a medicine from the list, auto-fill the price
    if (field === "name") {
      const selectedMed = medicines.find((m) => m.name === value);
      if (selectedMed) {
        updated[index].medicineId = selectedMed._id;
        updated[index].price = selectedMed.price;
      }
    }

    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { medicineId: "", name: "", qty: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calcTotal = () => {
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const tax = (subtotal * taxRate) / 100;
    return { subtotal, tax, grandTotal: subtotal + tax };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totals = calcTotal();

    const invoice = {
      id: `INV-${Date.now()}`,
      customer,
      paymentMethod,
      date: new Date().toISOString(),
      items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      totalAmount: totals.grandTotal,
    };

    addInvoice(invoice);

    // Reset Form
    setCustomer("");
    setPaymentMethod("Cash");
    setItems([{ medicineId: "", name: "", qty: 1, price: 0 }]);
  };

  const { subtotal, tax, grandTotal } = calcTotal();

  return (
    <div className="bg-white p-2">
      <h4 className="mb-4 fw-bold text-dark d-flex align-items-center">
        <Receipt className="me-2 text-primary" size={24} /> New Billing Entry
      </h4>

      <Form onSubmit={handleSubmit}>
        {/* Customer & Payment Info */}
        <Row className="g-3 mb-4 pb-3 border-bottom">
          <Col md={7}>
            <Form.Group controlId="customerName">
              <Form.Label className="small fw-bold text-muted text-uppercase mb-1">
                Customer Name
              </Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder="Enter customer name"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                required
                className="shadow-none border-secondary-subtle"
              />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group controlId="paymentMethod">
              <Form.Label className="small fw-bold text-muted text-uppercase mb-1">
                Payment Method
              </Form.Label>
              <Form.Select
                size="lg"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="shadow-none border-secondary-subtle"
              >
                <option value="Cash">Cash</option>
                <option value="eSewa">eSewa</option>
                <option value="Khalti">Khalti</option>
                <option value="Card">Card</option>
                <option value="Stripe">Stripe</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Medicine Items Table */}
        <div className="table-responsive mb-3">
          <Table borderless className="align-middle mb-0">
            <thead className="bg-light text-muted small text-uppercase">
              <tr>
                <th
                  style={{ width: "45%", borderRadius: "8px 0 0 8px" }}
                  className="py-2 ps-3"
                >
                  Medicine Item
                </th>
                <th style={{ width: "15%" }} className="py-2">
                  Qty
                </th>
                <th style={{ width: "20%" }} className="py-2">
                  Price (NPR)
                </th>
                <th style={{ width: "15%" }} className="py-2">
                  Total
                </th>
                <th
                  style={{ width: "5%", borderRadius: "0 8px 8px 0" }}
                  className="py-2"
                ></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-bottom border-light-subtle">
                  <td className="ps-0 py-3">
                    <Form.Control
                      list={`medicineOptions-${index}`}
                      placeholder="Search medicine..."
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                      required
                      className="shadow-none border-secondary-subtle"
                    />
                    <datalist id={`medicineOptions-${index}`}>
                      {medicines.map((m) => (
                        <option key={m._id} value={m.name} />
                      ))}
                    </datalist>
                  </td>
                  <td className="py-3">
                    <Form.Control
                      type="number"
                      value={item.qty}
                      min="1"
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "qty",
                          parseInt(e.target.value) || 1,
                        )
                      }
                      className="shadow-none border-secondary-subtle"
                    />
                  </td>
                  <td className="py-3">
                    <Form.Control
                      type="number"
                      value={item.price}
                      min="0"
                      step="0.01"
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "price",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="shadow-none border-secondary-subtle"
                    />
                  </td>
                  <td className="fw-semibold text-dark py-3">
                    NPR {(item.qty * item.price).toFixed(2)}
                  </td>
                  <td className="text-end py-3 pe-0">
                    <Button
                      variant="link"
                      className="text-danger p-0 d-flex align-items-center justify-content-center"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Button
          variant="outline-primary"
          size="sm"
          className="mb-4 rounded-pill px-3 d-flex align-items-center fw-medium"
          onClick={addItem}
        >
          <Plus size={16} className="me-1" /> Add Another Item
        </Button>

        {/* Calculation Section */}
        <div className="bg-light p-4 rounded-4">
          <Row className="justify-content-end">
            <Col md={8} lg={6}>
              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Subtotal:</span>
                <span className="fw-semibold text-dark">
                  NPR {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2 small">
                <span className="text-muted">VAT (%):</span>
                <Form.Control
                  size="sm"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  style={{ width: "70px", textAlign: "right" }}
                  className="shadow-none border-secondary-subtle"
                />
              </div>

              <div className="d-flex justify-content-between mb-3 small">
                <span className="text-muted">Tax Amount:</span>
                <span className="fw-semibold text-dark">
                  NPR {tax.toFixed(2)}
                </span>
              </div>

              <div className="d-flex justify-content-between border-top border-secondary-subtle pt-3 mb-4">
                <h5 className="fw-bold mb-0">Grand Total:</h5>
                <h5 className="fw-bold text-primary mb-0">
                  NPR {grandTotal.toFixed(2)}
                </h5>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-100 fw-bold shadow-sm d-flex align-items-center justify-content-center"
                style={{ borderRadius: "8px" }}
              >
                <CheckCircle size={20} className="me-2" /> Complete Transaction
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
};

export default BillingForm;
