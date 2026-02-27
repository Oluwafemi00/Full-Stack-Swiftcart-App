// src/pages/OrderSuccess.jsx
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Grab the exact order data passed invisibly from Checkout!
  const order = location.state?.order;

  // 2. Fallback: If someone just types "/order-success" in the URL without buying anything
  if (!order) {
    return (
      <main
        className="success-container container"
        style={{ textAlign: "center", padding: "100px 20px" }}
      >
        <div className="success-card">
          <h2>No recent order found! 🤷‍♂️</h2>
          <button
            onClick={() => navigate("/")}
            className="btn primary"
            style={{ marginTop: "20px" }}
          >
            Return to Shop
          </button>
        </div>
      </main>
    );
  }

  // 3. Your beautiful UI, now powered by real database values!
  return (
    <main className="success-container container">
      <div className="success-card">
        <div className="success-icon">✔</div>

        <h1>Order Successful!</h1>
        <p>
          Your order has been placed successfully and is being processed by the
          seller.
        </p>

        <div className="order-details">
          <div className="detail-row">
            <span>Order Number</span>
            <strong>#{order.order_number || order.id}</strong>
          </div>
          <div className="detail-row">
            <span>Total Amount</span>
            <strong>₦{Number(order.total_amount).toLocaleString()}</strong>
          </div>
          <div className="detail-row">
            <span>Delivery Address</span>
            <strong style={{ textAlign: "right", maxWidth: "60%" }}>
              {order.delivery_address}
            </strong>
          </div>
          <div className="detail-row">
            <span>Status</span>
            <strong style={{ color: "#f59e0b" }}>
              Pending (Awaiting Seller)
            </strong>
          </div>
        </div>

        <div className="actions">
          {/* You can point this to the Buyer History page once we build it! */}
          <Link to="/my-orders" className="btn secondary">
            Back to Dashboard
          </Link>
          <Link to="/" className="btn primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
