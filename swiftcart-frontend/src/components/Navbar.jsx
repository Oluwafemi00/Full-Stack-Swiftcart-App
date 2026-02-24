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
  const { user, switchRole, logout } = useAuth();

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
        {/* DYNAMIC SHOP LINK */}
        {user.role === "guest" ? (
          // If they are a guest, clicking Shop forces them to register
          <NavLink
            to="/register-buyer"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Shop
          </NavLink>
        ) : (
          // If they are already logged in (buyer, etc), it acts normally
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
            Shop
          </NavLink>
        )}

        {/* 1. GUEST & BUYER VIEW */}
        {(user.role === "guest" || user.role === "buyer") && (
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
          </>
        )}

        {/* 2. SELLER VIEW */}
        {user.role === "seller" && (
          <NavLink to="/seller" onClick={() => setIsMobileMenuOpen(false)}>
            Seller Dashboard
          </NavLink>
        )}

        {/* 3. RIDER VIEW */}
        {user.role === "rider" && (
          <NavLink to="/rider" onClick={() => setIsMobileMenuOpen(false)}>
            Rider Portal
          </NavLink>
        )}

        {/* 1. Show Login for Guests */}
        {user.role === "guest" && (
          <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            Log In
          </NavLink>
        )}

        {/* 2. Show Logout for anyone who is logged in! */}
        {user.role !== "guest" && (
          <button
            onClick={() => {
              logout(); // Destroy token and reset state
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

        {/* DEMO DROPDOWN: So you can keep testing your UI easily */}
        {/* <select
          value={user.role}
          onChange={(e) => switchRole(e.target.value)}
          style={{
            background: "#0a1322",
            color: "white",
            border: "1px solid #1f2630",
            padding: "5px",
            borderRadius: "5px",
            marginLeft: "10px",
          }}
        >
          <option value="guest">View as Guest</option>
          <option value="buyer">View as Buyer</option>
          <option value="seller">View as Seller</option>
          <option value="rider">View as Rider</option>
        </select> */}
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
