// src/components/Navbar.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Bring in the cart hook!
import "./Navbar.css";

export default function Navbar({ setSearchQuery }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart(); // Get the live count

  return (
    <header className="topbar">
      <div className="logo">
        <span className="logo-box">
          <Link to="/">🛒</Link>
        </span>
        <span className="logo-text">SwiftCart</span>
      </div>

      <div className="search desktop-only">
        <span className="search-icon">🔎</span>
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Hamburger Button (Hidden on Desktop) */}
      <button
        className="hamburger"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? "✖" : "☰"}
      </button>

      {/* Mobile-responsive nav links */}
      <nav className={`links ${isMobileMenuOpen ? "open" : ""}`}>
        <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
          Shop
        </NavLink>
        <NavLink to="/seller" onClick={() => setIsMobileMenuOpen(false)}>
          Seller Dashboard
        </NavLink>
        <NavLink to="/rider" onClick={() => setIsMobileMenuOpen(false)}>
          Rider Portal
        </NavLink>
      </nav>

      <div
        className="cart"
        style={{ cursor: "pointer" }}
        onClick={() => setIsCartOpen(true)}
      >
        🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </div>
    </header>
  );
}
