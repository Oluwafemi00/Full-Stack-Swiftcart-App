// src/components/Navbar.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar({ setSearchQuery }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();

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

      {/* DYNAMIC LINKS BASED ON ROLE */}
      <nav className={`links ${isMobileMenuOpen ? "open" : ""}`}>
        {/* SHOP LINK */}
        {user.role === "guest" ? (
          <NavLink
            to="/register-buyer"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Shop
          </NavLink>
        ) : (
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
            Shop
          </NavLink>
        )}

        {/* 1. GUEST ONLY VIEW */}
        {user.role === "guest" && (
          <>
            <NavLink
              to="/register-seller"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Become a Seller
            </NavLink>
            <NavLink
              to="/register-rider"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Become a Rider
            </NavLink>
            <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              Log In
            </NavLink>
          </>
        )}

        {/* 2. BUYER ONLY VIEW (Added My Orders!) */}
        {user.role === "buyer" && (
          <NavLink to="/my-orders" onClick={() => setIsMobileMenuOpen(false)}>
            My Orders 📦
          </NavLink>
        )}

        {/* 3. SELLER VIEW */}
        {user.role === "seller" && (
          <NavLink to="/seller" onClick={() => setIsMobileMenuOpen(false)}>
            Seller Dashboard
          </NavLink>
        )}

        {/* 4. RIDER VIEW */}
        {user.role === "rider" && (
          <NavLink to="/rider" onClick={() => setIsMobileMenuOpen(false)}>
            Rider Portal
          </NavLink>
        )}

        {/* LOGOUT BUTTON (Visible to anyone who is logged in!) */}
        {user.role !== "guest" && (
          <button
            onClick={() => {
              logout();
              setIsMobileMenuOpen(false);
            }}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "white",
              padding: "8px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Log Out
          </button>
        )}
      </nav>

      {/* Only Guests and Buyers need the Shopping Cart! */}
      {(user.role === "guest" || user.role === "buyer") && (
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
