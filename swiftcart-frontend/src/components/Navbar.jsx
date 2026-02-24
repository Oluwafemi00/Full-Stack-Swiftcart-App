// src/components/Navbar.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Bring in the cart hook!
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar({ setSearchQuery }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart(); // Get the live count

  // 2. Extract our user and our role switcher function
  const { user, switchRole } = useAuth();

  return (
    <header className="topbar">
      <div className="logo">
        <span className="logo-box">
          <Link to="/">🛒</Link>
        </span>
        <span className="logo-text">SwiftCart</span>
      </div>

      {/* Only show the search bar to buyers! */}
      {user.role === "buyer" && (
        <div className="search desktop-only">
          <span className="search-icon">🔎</span>
          <input
            type="text"
            placeholder="Search products..."
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <button
        className="hamburger"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? "✖" : "☰"}
      </button>

      {/* 3. DYNAMIC LINKS BASED ON ROLE */}
      <nav className={`links ${isMobileMenuOpen ? "open" : ""}`}>
        {/* Buyer Links */}
        {user.role === "buyer" && (
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
            Shop
          </NavLink>
        )}

        {/* Seller Links */}
        {user.role === "seller" && (
          <NavLink to="/seller" onClick={() => setIsMobileMenuOpen(false)}>
            Seller Dashboard
          </NavLink>
        )}

        {/* Rider Links */}
        {user.role === "rider" && (
          <NavLink to="/rider" onClick={() => setIsMobileMenuOpen(false)}>
            Rider Portal
          </NavLink>
        )}

        {/* 4. PORTFOLIO DEMO: A quick dropdown to switch roles to show off your app */}
        <select
          value={user.role}
          onChange={(e) => switchRole(e.target.value)}
          style={{
            background: "#0a1322",
            color: "white",
            border: "1px solid #1f2630",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          <option value="buyer">View as Buyer</option>
          <option value="seller">View as Seller</option>
          <option value="rider">View as Rider</option>
        </select>
      </nav>

      {/* Only show the cart to buyers! */}
      {user.role === "buyer" && (
        <div
          className="cart"
          style={{ cursor: "pointer" }}
          onClick={() => setIsCartOpen(true)}
        >
          🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      )}
    </header>
  );
}
