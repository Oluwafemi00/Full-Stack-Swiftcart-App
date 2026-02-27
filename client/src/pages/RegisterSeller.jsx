// src/pages/RegisterSeller.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

export default function RegisterSeller() {
  const navigate = useNavigate();
  const { registerAccount } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Send the data to Express, ensuring the role is 'seller'
    const result = await registerAccount({
      ...formData,
      role: "seller",
    });

    if (result.success) {
      navigate("/seller"); // Instantly redirect to their new dashboard!
    } else {
      setError(result.error);
      setIsLoading(false);
    }
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

        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "15px",
              background: "#ffebee",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {error}
          </div>
        )}

        <form className="register-form" onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Business Name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Business Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Seller Account"}
          </button>
        </form>
      </div>
    </main>
  );
}
