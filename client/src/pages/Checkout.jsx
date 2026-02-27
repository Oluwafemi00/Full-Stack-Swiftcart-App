// src/pages/Checkout.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  // 1. Grab the cart items and the function to clear the cart
  const { cartItems = [], clearCart } = useCart();

  const [formData, setFormData] = useState({
    deliveryAddress: "",
    paymentMethod: "POD",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. Calculate the cart total right here using standard JavaScript!
  const deliveryFee = 1000;

  // Safely calculate the total, ensuring we always use an array
  const cartTotal = (cartItems || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = cartTotal + deliveryFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Your cart is empty!");

    setIsLoading(true);
    setError("");

    // 2. Grab the JWT token from storage to prove who we are
    const token = localStorage.getItem("token");

    try {
      // 3. Send the entire cart and form to our secure Express endpoint
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach the secure token!
        },
        body: JSON.stringify({
          cartItems: cartItems,
          deliveryAddress: formData.deliveryAddress,
          paymentMethod: formData.paymentMethod,
          deliveryFee: deliveryFee,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        clearCart();

        // 💡 THE FIX: Manually construct the order object by combining the
        // backend's ID with the form data and totals we already calculated!
        const finalOrderData = {
          order_number: data.orderId || data.id || "Pending", // Catch the ID
          total_amount: total, // Use the calculated total
          delivery_address: formData.deliveryAddress, // Use the typed address
        };

        // Pass our newly constructed, complete object to the success page
        navigate("/order-success", { state: { order: finalOrderData } });
      } else {
        setError(data.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setError("Failed to connect to the server.");
      setIsLoading(false);
    }
  };

  return (
    <main className="container" style={{ padding: "40px 20px" }}>
      <h1>Checkout</h1>

      {error && (
        <div
          style={{
            color: "red",
            background: "#ffebee",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginTop: "20px",
        }}
      >
        {/* FORM SECTION */}
        <div
          className="checkout-form"
          style={{
            background: "var(--bg-card)",
            padding: "30px",
            borderRadius: "15px",
          }}
        >
          <h3>Delivery Details</h3>
          <form
            onSubmit={handleConfirmOrder}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            <textarea
              name="deliveryAddress"
              placeholder="Full Delivery Address"
              required
              rows="3"
              value={formData.deliveryAddress}
              onChange={handleChange}
              style={{
                padding: "10px",
                borderRadius: "5px",
                background: "#0a1322",
                color: "white",
                border: "1px solid var(--border)",
              }}
            />

            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              style={{
                padding: "10px",
                borderRadius: "5px",
                background: "#0a1322",
                color: "white",
                border: "1px solid var(--border)",
              }}
            >
              <option value="POD">Pay on Delivery</option>
              <option value="Online">Pay with Card (Online)</option>
            </select>

            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: "10px" }}
              disabled={isLoading || cartItems.length === 0}
            >
              {isLoading ? "Processing..." : "Confirm Order"}
            </button>
          </form>
        </div>

        {/* SUMMARY SECTION */}
        <div
          className="order-summary"
          style={{
            background: "var(--bg-card)",
            padding: "30px",
            borderRadius: "15px",
          }}
        >
          <h3>Order Summary</h3>
          <div style={{ marginTop: "15px" }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span>₦{item.price * item.quantity}</span>
              </div>
            ))}
            <hr style={{ borderColor: "var(--border)", margin: "15px 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span>Delivery Fee</span>
              <span>₦{deliveryFee}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: "1.2rem",
                marginTop: "10px",
              }}
            >
              <span>Total</span>
              <span>₦{total}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
