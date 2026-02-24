// src/pages/RegisterBuyer.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

export default function RegisterBuyer() {
  const navigate = useNavigate();
  const { registerAccount } = useAuth(); // Get our new API function!

  // 1. State to track what the user types
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // State for showing errors to the user
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 2. Handle typing in the inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit the data to PostgreSQL!
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Call the AuthContext function, explicitly setting the role to 'buyer'
    const result = await registerAccount({
      ...formData,
      role: "buyer",
    });

    if (result.success) {
      navigate("/"); // Success! Send them to the shop
    } else {
      setError(result.error); // Show the error from Express (e.g., "Email taken")
      setIsLoading(false);
    }
  };

  return (
    <main className="register-page container">
      <div className="register-card">
        <span className="register-icon">🛍️</span>
        <h1>Create a Buyer Account</h1>
        <p>
          Join SwiftCart to discover amazing products from verified sellers.
        </p>

        {/* Show database errors here if they happen */}
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
          {/* Add name="" attributes and onChange handlers to track typing */}
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
            type="password"
            name="password"
            placeholder="Create Password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Start Shopping"}
          </button>
        </form>
      </div>
    </main>
  );
}
