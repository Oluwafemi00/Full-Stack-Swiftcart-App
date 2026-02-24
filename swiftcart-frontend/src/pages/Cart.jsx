// src/pages/Cart.jsx
import { Link } from "react-router-dom"; // Removed useState here
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const { cartItems, setCartItems } = useCart();
  const deliveryFee = 2000;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal + deliveryFee;

  const updateQuantity = (id, change) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
  };

  if (cartItems.length === 0) {
    return (
      <main className="cart-container container empty-state">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is feeling a little light!</h2>
        <p className="sub">Discover amazing products from verified sellers.</p>
        <Link
          to="/"
          className="btn-primary" // Cleaned up class and removed inline style
          style={{ width: "auto", display: "inline-block", marginTop: "20px" }}
        >
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="cart-container container">
      <header className="cart-header">
        <h1>Your Cart</h1>
        <p>Review your items before checkout</p>
      </header>

      <section className="cart-grid">
        <div className="cart-items">
          <div className="cart-table-header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          {cartItems.map((item) => (
            <div className="cart-row" key={item.id}>
              <div className="product">
                <div className="icon">{item.icon || "📦"}</div>
                <div>
                  <strong>{item.name}</strong>
                  <p>₦{item.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="quantity">
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>

              <div className="price">
                ₦{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <aside className="summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>₦{deliveryFee.toLocaleString()}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>

          {/* Styled Link as a button instead of nesting it */}
          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
        </aside>
      </section>
    </main>
  );
}
