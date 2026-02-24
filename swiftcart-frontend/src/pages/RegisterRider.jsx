// src/pages/RegisterRider.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

export default function RegisterRider() {
  const navigate = useNavigate();
  const { registerAccount } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "", // Extra field for the rider to be contacted!
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

    // Send the data to Express, ensuring the role is 'rider'
    const result = await registerAccount({
      ...formData,
      role: "rider",
    });

    if (result.success) {
      navigate("/rider"); // Instantly redirect to the logistics portal!
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <main className="register-page container">
      <div className="register-card">
        <span className="register-icon">🛵</span>
        <h1>Deliver & Earn Daily</h1>
        <p>
          Join the SwiftCart fleet. Earn money on your own schedule by
          connecting local sellers with happy buyers.
        </p>

        <ul className="register-benefits">
          <li>
            ⏱️ <strong>Flexible hours.</strong> Work when you want.
          </li>
          <li>
            💰 <strong>Keep 100% of your tips.</strong> Plus competitive
            delivery fees.
          </li>
          <li>
            📱 <strong>Smart routing.</strong> Our app makes deliveries
            effortless.
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
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            value={formData.phone}
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
          {/* We keep the vehicle select purely for visual UI, though we aren't saving it to the DB right now */}
          <select
            style={{
              padding: "14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "#0a1322",
              color: "white",
            }}
          >
            <option value="bike">Motorcycle / Bike</option>
            <option value="car">Car</option>
            <option value="van">Van / Truck</option>
          </select>
          <button
            type="submit"
            className="btn-primary"
            style={{ background: "#22c55e" }}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Join the Fleet"}
          </button>
        </form>
      </div>
    </main>
  );
}
