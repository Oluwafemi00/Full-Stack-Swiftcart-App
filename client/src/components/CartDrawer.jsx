import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartDrawer.css";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeProduct,
    cartSubtotal,
  } = useCart();

  return (
    <>
      {/* The dark blurry background overlay */}
      <div
        className={`drawer-overlay ${isCartOpen ? "open" : ""}`}
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* The actual sliding panel */}
      <div className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            ✖
          </button>
        </div>

        <div className="drawer-items">
          {cartItems.length === 0 ? (
            <div className="empty-drawer">
              <span className="empty-icon">🛒</span>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="drawer-item" key={item.id}>
                <img
                  src={item.img}
                  alt={item.name}
                  className="drawer-item-img"
                />
                <div className="drawer-item-info">
                  <h4>{item.name}</h4>
                  <p className="drawer-item-price">₦{item.price}</p>

                  <div className="drawer-item-controls">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, -1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>
                        +
                      </button>
                    </div>
                    <button
                      className="trash-btn"
                      onClick={() => removeProduct(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-total">
              <span>Subtotal:</span>
              <span>₦{cartSubtotal.toLocaleString()}</span>
            </div>
            {/* Navigates to checkout and closes the drawer */}
            <Link
              to="/checkout"
              className="btn-primary drawer-checkout"
              onClick={() => setIsCartOpen(false)}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
