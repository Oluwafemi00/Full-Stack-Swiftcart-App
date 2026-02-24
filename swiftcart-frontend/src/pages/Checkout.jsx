// src/pages/Checkout.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import the cart!
import "./Checkout.css";

export default function Checkout() {
  const { cartItems, cartSubtotal } = useCart();
  const navigate = useNavigate(); // Replaces window.location.href

  // 1. Setup State for our form (Replaces manual DOM reads)
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRider, setSelectedRider] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Array of riders to prevent repeating HTML labels 9 times!
  const riders = [
    { id: "r1", name: "Abdul Kareem", rating: 4.8, deliveries: 120 },
    { id: "r2", name: "Samuel Adeyemi", rating: 4.6, deliveries: 98 },
    { id: "r3", name: "Sadiq Lawal", rating: 4.5, deliveries: 95 },
    { id: "r4", name: "Daniel Olatunji", rating: 4.7, deliveries: 110 },
    { id: "r5", name: "Hassan Musa", rating: 4.9, deliveries: 150 },
    { id: "r6", name: "Chinedu Okafor", rating: 4.4, deliveries: 70 },
    { id: "r7", name: "Yusuf Bello", rating: 4.6, deliveries: 90 },
    { id: "r8", name: "Emmanuel Johnson", rating: 4.5, deliveries: 85 },
    { id: "r9", name: "Mustapha Ahmed", rating: 4.3, deliveries: 60 },
    { id: "r10", name: "Michael Adebayo", rating: 4.8, deliveries: 130 },
  ];

  // 2. Validation Logic (Replaces the checkForm function)
  const isFormValid =
    address.trim() !== "" &&
    phone.trim() !== "" &&
    selectedRider &&
    selectedPayment;

  // 3. Submission Handler

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    // 1. Package the data to send to Express
    const orderPayload = {
      buyer_id: 1, // Hardcoded for now until you add user authentication!
      cartItems: cartItems,
      payment_method: selectedPayment,
      delivery_address: address,
      delivery_fee: 1000,
    };

    try {
      // 2. Make the POST request to your backend
      const response = await fetch(
        "http://localhost:5000/api/orders/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        },
      );

      const data = await response.json();

      if (data.success) {
        // 3. Navigate to success page using the real order number!
        // You could pass this order_number via React Router state if you wanted
        console.log("Success! Order Number:", data.orderData.order_number);
        navigate("/order-success");
      } else {
        alert(data.error); // E.g., "Insufficient stock"
      }
    } catch (err) {
      console.error("Failed to checkout:", err);
      alert("Something went wrong connecting to the server.");
    }
  };

  return (
    <main className="container">
      <h1>Checkout</h1>
      <p className="sub">Complete your order</p>

      {/* DELIVERY ADDRESS */}
      <div className="card">
        <p className="label">DELIVERY ADDRESS</p>
        <input
          type="text"
          placeholder="Street / Area (e.g. Tanke Junction)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input type="text" value="Ilorin, Kwara State" disabled />
        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* ORDER SUMMARY */}
      <div className="card">
        <p className="label">ORDER SUMMARY</p>
        <div className="item">
          <span>Bluetooth Speaker (x1)</span>
          <span>₦12,000</span>
        </div>
        <div className="item">
          <span>Wireless Earbuds (x2)</span>
          <span>₦8,000</span>
        </div>
        <div className="item">
          <span>Phone Charger (x1)</span>
          <span>₦2,500</span>
        </div>
        <div className="item">
          <span>Power Bank (x1)</span>
          <span>₦10,000</span>
        </div>
        <hr />
        <div className="item">
          <span>Delivery Fee</span>
          <span>₦1,000</span>
        </div>
        <div className="item total">
          <span>Total</span>
          <span>₦33,500</span>
        </div>
      </div>

      {/* SELECT RIDER */}
      <div className="card">
        <p className="label">SELECT RIDER</p>
        <div className="rider-list">
          {riders.map((rider) => (
            <label className="option" key={rider.id}>
              <input
                type="radio"
                name="rider"
                value={rider.id}
                onChange={() => setSelectedRider(rider.id)}
              />
              <div>
                <strong>{rider.name}</strong>
                <p className="sub">
                  <span className="star">★</span> {rider.rating} •{" "}
                  {rider.deliveries} deliveries
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* PAYMENT */}
      <div className="card">
        <p className="label">PAYMENT METHOD</p>
        <label className="option">
          <input
            type="radio"
            name="payment"
            value="POD"
            onChange={(e) => setSelectedPayment(e.target.value)}
          />
          <span>Pay on Delivery</span>
        </label>
        <label className="option">
          <input
            type="radio"
            name="payment"
            value="Online"
            onChange={(e) => setSelectedPayment(e.target.value)}
          />
          <span>Pay Online</span>
        </label>
      </div>

      {/* CONFIRM BUTTON */}
      <button
        id="confirmBtn"
        className="confirm-btn"
        disabled={!isFormValid}
        onClick={handleConfirmOrder}
      >
        Confirm Order
      </button>
    </main>
  );
}
