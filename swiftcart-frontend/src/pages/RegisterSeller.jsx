// src/pages/RegisterSeller.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

export default function RegisterSeller() {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const handleSignup = (e) => {
    e.preventDefault();
    // Simulate signing up and instantly logging in as a Seller!
    switchRole("seller");
    navigate("/seller");
  };

  return (
    <main className="register-page container">
      <div className="register-card">
        <span className="register-icon">🏪</span>
        <h1>Partner with SwiftCart</h1>
        <p>
          Turn your inventory into revenue. Reach thousands of buyers and manage
          your store with our powerful dashboard.
        </p>

        <ul className="register-benefits">
          <li>
            ✅ <strong>Zero setup fees.</strong> Start selling instantly.
          </li>
          <li>
            ✅ <strong>Next-day payouts.</strong> Keep your cash flow healthy.
          </li>
          <li>
            ✅ <strong>Automated logistics.</strong> Our riders handle delivery.
          </li>
        </ul>

        <form className="register-form" onSubmit={handleSignup}>
          <input type="text" placeholder="Business Name" required />
          <input type="email" placeholder="Business Email" required />
          <input type="password" placeholder="Create Password" required />
          <button type="submit" className="btn-primary">
            Create Seller Account
          </button>
        </form>
      </div>
    </main>
  );
}
