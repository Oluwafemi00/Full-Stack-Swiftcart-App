// src/pages/MyOrders.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/orders/myorders",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) throw new Error("Failed to load orders");

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Could not load your order history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  // A helper function to make our statuses look gorgeous!
  const getStatusDisplay = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "Processing",
          color: "#f59e0b",
          bg: "rgba(245, 158, 11, 0.1)",
        };
      case "ready_for_pickup":
        return {
          text: "Packed & Ready",
          color: "#3b82f6",
          bg: "rgba(59, 130, 246, 0.1)",
        };
      case "in_transit":
        return {
          text: "Out for Delivery 🛵",
          color: "#a855f7",
          bg: "rgba(168, 85, 247, 0.1)",
        };
      case "delivered":
        return {
          text: "Delivered ✅",
          color: "#22c55e",
          bg: "rgba(34, 197, 94, 0.1)",
        };
      default:
        return { text: status, color: "gray", bg: "#333" };
    }
  };

  if (isLoading)
    return (
      <main
        className="container"
        style={{ textAlign: "center", padding: "100px 0" }}
      >
        <h2>Loading your history... 📦</h2>
      </main>
    );
  if (error)
    return (
      <main
        className="container"
        style={{ textAlign: "center", padding: "100px 0", color: "red" }}
      >
        <h2>{error}</h2>
      </main>
    );

  return (
    <main className="container" style={{ padding: "40px 20px" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1>My Orders</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Track your recent purchases, {user.name}
        </p>
      </div>

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "var(--bg-card)",
            borderRadius: "15px",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: "50px", marginBottom: "15px" }}>🛍️</div>
          <h2>No orders yet!</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            Looks like you haven't bought anything yet.
          </p>
          <Link
            to="/"
            className="btn-primary"
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {orders.map((order) => {
            const statusUI = getStatusDisplay(order.status);
            const orderDate = new Date(order.created_at).toLocaleDateString();

            return (
              <div
                key={order.id}
                style={{
                  background: "var(--bg-card)",
                  padding: "25px",
                  borderRadius: "15px",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Left Side: Order Info */}
                <div>
                  <h3 style={{ margin: "0 0 10px 0" }}>
                    Order #{order.order_number}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 5px 0",
                      color: "var(--text-muted)",
                      fontSize: "14px",
                    }}
                  >
                    Placed on: {orderDate}
                  </p>
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    📍 {order.delivery_address}
                  </p>
                </div>

                {/* Right Side: Status & Price */}
                <div style={{ textAlign: "right" }}>
                  <h3 style={{ margin: "0 0 15px 0" }}>
                    ₦{Number(order.total_amount).toLocaleString()}
                  </h3>
                  <span
                    style={{
                      padding: "8px 15px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: statusUI.color,
                      background: statusUI.bg,
                      border: `1px solid ${statusUI.color}`,
                    }}
                  >
                    {statusUI.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
