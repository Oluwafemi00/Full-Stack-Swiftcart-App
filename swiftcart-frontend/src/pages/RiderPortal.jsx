// src/pages/RiderPortal.jsx
import { useState, useEffect, useCallback } from "react";
import { riderStats, recentDeliveries } from "../data/riderData";
import "./RiderPortal.css";

export default function RiderPortal() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState("available");
  const [availableOrders, setAvailableOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentRiderId = 1;

  // Memoized fetch function so it can be reused safely
  const fetchOrders = useCallback(
    async (signal) => {
      if (!isOnline) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5000/api/riders/available-orders",
          { signal },
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setAvailableOrders(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch orders", error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isOnline],
  );

  useEffect(() => {
    const controller = new AbortController();

    if (isOnline) {
      fetchOrders(controller.signal);
    } else {
      setAvailableOrders([]);
    }

    return () => controller.abort();
  }, [isOnline, fetchOrders]);

  const handleAccept = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/riders/accept-order/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rider_id: currentRiderId }),
        },
      );

      const data = await response.json();

      if (data.success) {
        // Optimistic UI update: Remove immediately
        setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));
        alert("Order Accepted! check 'My Active' tab.");
      } else {
        alert(data.error || "Could not accept order.");
      }
    } catch (error) {
      console.error("Accept Order Error:", error); // Use the variable here!
      alert("Network error while accepting order.");
    }
  };

  return (
    <main className="container">
      <section className="heading">
        <div>
          <h1>Rider Portal</h1>
          <p className="sub">Welcome back, Abdulrahman Sanni</p>
        </div>

        <div className="status">
          <span className="sub">Status:</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isOnline}
              onChange={() => setIsOnline(!isOnline)}
            />
            <span className="slider"></span>
          </label>
          <span className={`badge ${isOnline ? "online" : "offline"}`}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        {riderStats.map((stat, index) => (
          <div className="card" key={index}>
            <p className="sub">{stat.label}</p>
            <h2>
              {stat.hasStar && <span className="star">★</span>} {stat.value}
            </h2>
          </div>
        ))}
      </section>

      {/* TABS */}
      <section className="tabs">
        <button
          className={`tab-btn ${activeTab === "active" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          My Active
        </button>
        <button
          className={`tab-btn ${activeTab === "available" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("available")}
        >
          Available ({availableOrders.length})
        </button>
      </section>

      {/* RENDER LOGIC */}
      {activeTab === "available" && (
        <section id="availableSection">
          {!isOnline ? (
            <div className="empty-state">
              <h3>You are currently offline.</h3>
              <p>Go online to see available delivery requests.</p>
            </div>
          ) : isLoading ? (
            <p style={{ textAlign: "center", padding: "20px" }}>
              Finding orders... 🚲
            </p>
          ) : availableOrders.length === 0 ? (
            <div className="empty-state">
              <h3>No new orders available right now. 🚲</h3>
            </div>
          ) : (
            availableOrders.map((order) => (
              <div className="big-card" key={order.id}>
                <div className="big-top">
                  <div>
                    <div className="row">
                      <h3>Order #{order.order_number || order.id}</h3>
                      <span className="badge available">New</span>
                    </div>
                    <p className="price">
                      ₦{Number(order.total_amount).toLocaleString()}
                    </p>
                  </div>
                  <div className="fee">
                    <p className="sub">Your Earning</p>
                    <p className="fee-amount">
                      ₦{Number(order.delivery_fee).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="info-box">
                  <p className="sub small-title">DELIVER TO</p>
                  <p className="bold">{order.delivery_address}</p>
                </div>

                <div className="actions">
                  <button
                    onClick={() => handleAccept(order.id)}
                    className="btn green"
                  >
                    ✅ Accept Order
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* RECENT HISTORY */}
      <section className="card recent">
        <h3>Recent Deliveries</h3>
        {recentDeliveries.map((delivery) => (
          <div className="recent-item" key={delivery.id}>
            <div>
              <p className="bold">{delivery.location}</p>
              <p className="sub">{delivery.time}</p>
            </div>
            <p className="bold">{delivery.amount}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
