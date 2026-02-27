import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Import navigate
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // 👈 Import Auth

import "./ProductCard.css";

export default function ProductCard({ product }) {
  const [showToast, setShowToast] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth(); // 👈 Extract user
  const navigate = useNavigate(); // 👈 Initialize navigate

  const handleAddToCart = () => {
    // THE GATE: If they are a guest, kick them to the signup page!
    if (user.role === "guest") {
      navigate("/register-buyer");
      return; // Stop the function here so the item doesn't get added
    }

    addToCart(product);

    // Trigger the modern toast
    setShowToast(true);

    // Hide it after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="product">
      <img src={product.img} alt={product.name} />
      <h3 className={product.isStand ? "stands" : ""}>{product.name}</h3>
      <p className={product.isStand ? "con" : ""}>{product.desc}</p>

      <p className="rating">
        <span className="star">★</span> {product.rating}
        <span className="reviews">({product.reviews} reviews)</span>
      </p>

      <div
        className="price-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
        }}
      >
        <h2 style={{ margin: 0 }}>₦{product.price}</h2>
        {/* Changed from a Link to a button with an onClick handler */}
        <button
          className="btn-add"
          onClick={handleAddToCart}
          style={{ margin: 0, width: "auto", padding: "8px 16px" }}
        >
          🛒 Add
        </button>
      </div>

      {/* The Toast Notification Portal */}
      {showToast && (
        <div className="toast-container">
          <div className="toast">
            <span>✅</span> {product.name} added to cart!
          </div>
        </div>
      )}
    </div>
  );
}
