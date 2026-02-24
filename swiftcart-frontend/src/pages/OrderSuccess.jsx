// src/pages/OrderSuccess.jsx
import { Link } from "react-router-dom";
import "./OrderSuccess.css"; // Assuming you kept your order.css styles here

export default function OrderSuccess() {
  return (
    <main className="success-container container">
      <div className="success-card">
        <div className="success-icon">✔</div>

        <h1>Order Successful!</h1>
        <p>Your order has been placed successfully and is being processed.</p>

        <div className="order-details">
          <div className="detail-row">
            <span>Order ID</span>
            <span>#SC-20491</span>
          </div>
          <div className="detail-row">
            <span>Total Amount</span>
            <span>₦33,500</span>
          </div>
          <div className="detail-row">
            <span>Payment Method</span>
            <span>Card / Online Payment</span>
          </div>
        </div>

        <div className="actions">
          <Link to="/" className="btn secondary">
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
