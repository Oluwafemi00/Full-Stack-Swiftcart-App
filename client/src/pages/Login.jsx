// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

export default function Login() {
  const navigate = useNavigate();
  const { loginAccount } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await loginAccount(formData);
    console.log("LOGIN RESULT:", result);

    if (result.success) {
      const cleanRole = result.role ? result.role.trim().toLowerCase() : "";
      console.log(`Cleaned Role is: '${cleanRole}'`);

      // We can use the smooth navigate again!
      if (cleanRole === "seller") {
        navigate("/seller");
      } else if (cleanRole === "rider") {
        navigate("/rider");
      } else {
        navigate("/");
      }
    } else {
      setError(result.error || "Failed to log in.");
      setIsLoading(false);
    }
  };
  return (
    <main className="register-page container">
      <div className="register-card">
        <span className="register-icon">🔐</span>
        <h1>Welcome Back</h1>
        <p>Log in to access your SwiftCart account.</p>

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

        <form className="register-form" onSubmit={handleLogin}>
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
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Log In"}
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/register-buyer" style={{ color: "var(--primary)" }}>
            Sign up here
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
