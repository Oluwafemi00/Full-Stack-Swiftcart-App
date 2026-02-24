// src/pages/RegisterRider.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

export default function RegisterRider() {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const handleSignup = (e) => {
    e.preventDefault();
    // Simulate signing up and instantly logging in as a Rider!
    switchRole("rider");
    navigate("/rider");
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

        <form className="register-form" onSubmit={handleSignup}>
          <input type="text" placeholder="Full Name" required />
          <input type="tel" placeholder="Phone Number" required />
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
          >
            Join the Fleet
          </button>
        </form>
      </div>
    </main>
  );
}
