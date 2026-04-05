import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Download,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import api from "../services/api";

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Extract orderId from URL (e.g., ?order_id=...) or Params
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch real order data from backend
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const downloadInvoice = async () => {
    try {
      // Use the specific PDF invoice route created in backend
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Invoice_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to generate invoice. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3 text-muted small">
          Confirming your order details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <h3 className="fw-normal text-dark">Order Not Found</h3>
        <p className="text-muted">
          We couldn't locate this order in our system.
        </p>
        <Link
          to="/customer-dashboard"
          className="btn btn-warning mt-3 px-4 shadow-sm border-0"
          style={{
            backgroundColor: "#FFD814",
            borderRadius: "8px",
            color: "#0F1111",
          }}
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#f0f2f2",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <div className="container py-5 d-flex flex-column align-items-center animate-fade-in">
        <div
          className="bg-white shadow-sm border rounded-3 p-4 p-md-5 w-100"
          style={{ maxWidth: 750, borderColor: "#D5D9D9" }}
        >
          {/* Success Header  */}
          <div className="d-flex align-items-start mb-4 pb-3 border-bottom border-secondary-subtle">
            <CheckCircle
              className="text-success me-3 mt-1 flex-shrink-0"
              size={36}
              strokeWidth={2.5}
            />
            <div>
              <h2
                className="fw-normal text-success mb-2"
                style={{ color: "#067D62" }}
              >
                Order placed, thank you!
              </h2>
              <p className="text-dark mb-1">
                Confirmation will be sent to{" "}
                <span className="fw-bold">{order.user?.email}</span>.
              </p>
              <p className="text-dark mb-0">
                <span className="fw-bold">Order Number:</span>{" "}
                <span style={{ color: "#007185" }}>{order._id}</span>
              </p>
            </div>
          </div>

          {/* Order Info Summary */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <h5 className="fw-bold text-dark fs-6 mb-2">Payment Method</h5>
              <div className="text-muted small">
                {order.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : order.paymentMethod}
              </div>
            </div>
            <div className="col-md-6">
              <h5 className="fw-bold text-dark fs-6 mb-2">
                Shipping Information
              </h5>
              <div className="text-muted small">
                {order.shippingAddress ? (
                  <>
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}
                    <br />
                    {order.shippingAddress.country}
                  </>
                ) : (
                  "Address provided during checkout."
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border rounded-3 overflow-hidden mb-4">
            <div className="bg-light px-3 py-2 border-bottom">
              <h5 className="fw-bold text-dark fs-6 mb-0">Order Details</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-borderless mb-0 align-middle">
                <tbody>
                  {order.orderItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className={
                        idx !== order.orderItems.length - 1
                          ? "border-bottom"
                          : ""
                      }
                    >
                      <td
                        className="ps-4 py-3 fw-bold text-dark"
                        style={{ color: "#007185", width: "60%" }}
                      >
                        {item.name}
                      </td>
                      <td className="text-center py-3 text-muted small">
                        Qty: {item.qty}
                      </td>
                      <td className="text-end pe-4 py-3 fw-bold text-dark">
                        NPR {item.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-light border-top">
                  <tr>
                    <td
                      colSpan="2"
                      className="ps-4 py-3 fw-bold text-dark text-end"
                    >
                      Order Total:
                    </td>
                    <td
                      className="text-end pe-4 py-3 fw-bold text-danger h5 mb-0"
                      style={{ color: "#B12704" }}
                    >
                      NPR {order.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-column flex-sm-row gap-3 mt-4 pt-2">
            <button
              onClick={downloadInvoice}
              className="btn btn-warning py-2 px-4 shadow-sm border-0 d-flex align-items-center justify-content-center flex-grow-1"
              style={{
                backgroundColor: "#FFD814",
                borderRadius: "8px",
                color: "#0F1111",
                fontWeight: "500",
              }}
            >
              <Download size={18} className="me-2" /> Download Invoice
            </button>
            <Link
              to="/orders"
              className="btn bg-white py-2 px-4 shadow-sm d-flex align-items-center justify-content-center flex-grow-1"
              style={{
                border: "1px solid #D5D9D9",
                borderRadius: "8px",
                color: "#0F1111",
                fontWeight: "500",
              }}
            >
              <ShoppingBag
                size={18}
                className="me-2"
                style={{ color: "#007185" }}
              />{" "}
              Review your orders
            </Link>
          </div>

          <div className="text-center mt-4 pt-3 border-top">
            <Link
              to="/medicines"
              className="d-inline-flex align-items-center text-decoration-none fw-medium"
              style={{ color: "#007185", fontSize: "0.9rem" }}
            >
              Continue shopping <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;
