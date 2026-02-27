// src/pages/RiderPortal.jsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import "./RiderPortal.css";

export default function RiderPortal() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState("Available");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const tabs = ["Available", "My Deliveries", "Completed"];

  const showNotification = (msg, type = "success") => {
    setNotification({ message: msg, type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  const fetchOrders = useCallback(
    async (signal) => {
      if (!isOnline) return;

      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/riders/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
            signal,
          },
        );

        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setOrders(data);
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
      setOrders([]);
    }

    return () => controller.abort();
  }, [isOnline, fetchOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/riders/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        if (newStatus === "in_transit")
          showNotification(
            "Order Accepted! Check 'My Deliveries' tab.",
            "success",
          );
        if (newStatus === "delivered")
          showNotification("Delivery Completed! Great job.", "success");
        fetchOrders();
      } else {
        showNotification(
          data.error || "Could not update order status.",
          "error",
        );
        fetchOrders();
      }
    } catch (error) {
      console.error("Update Order Error:", error);
      showNotification("Network error while updating order.", "error");
    }
  };

  // --- DYNAMIC DATA CALCULATIONS ---
  const availableOrders = orders.filter((o) => o.status === "pending");
  const activeDeliveries = orders.filter((o) => o.status === "in_transit");
  const completedDeliveries = orders.filter((o) => o.status === "delivered");
  const todayEarnings = completedDeliveries.reduce(
    (sum, o) => sum + Number(o.delivery_fee),
    0,
  );

  // Filter orders for the main feed based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "Available") return order.status === "pending";
    if (activeTab === "My Deliveries") return order.status === "in_transit";
    if (activeTab === "Completed") return order.status === "delivered";
    return false;
  });

  // Dynamically build the stats array for the UI
  const dynamicStats = [
    {
      label: "Completed Trips",
      value: completedDeliveries.length,
      hasStar: false,
    },
    { label: "Active Trips", value: activeDeliveries.length, hasStar: false },
    { label: "Customer Rating", value: "4.9", hasStar: true }, // Placeholder until we build a reviews table
  ];

  return (
    <main className="container">
      {/* HEADING SECTION */}
      <section className="heading">
        <div>
          <h1>Rider Portal</h1>
          <p className="sub">Welcome back, {user.name}</p>
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

      {/* DYNAMIC STATS */}
      <section className="stats">
        {dynamicStats.map((stat, index) => (
          <div className="card" key={index}>
            <p className="sub">{stat.label}</p>
            <h2>
              {stat.hasStar && (
                <span className="star" style={{ color: "#fbbf24" }}>
                  ★
                </span>
              )}{" "}
              {stat.value}
            </h2>
          </div>
        ))}
        {/* Dynamic Earnings Card */}
        <div
          className="card"
          style={{
            border: "1px solid #22c55e",
            background: "rgba(34, 197, 94, 0.05)",
          }}
        >
          <p className="sub">Today's Earnings</p>
          <h2 style={{ color: "#22c55e" }}>
            ₦{todayEarnings.toLocaleString()}
          </h2>
        </div>
      </section>

      {/* TABS */}
      <section className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} {tab === "Available" && `(${availableOrders.length})`}
          </button>
        ))}
      </section>

      {/* NOTIFICATION BANNER */}
      {notification.message && (
        <div
          style={{
            padding: "12px 20px",
            marginBottom: "20px",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "bold",
            background:
              notification.type === "success"
                ? "rgba(34, 197, 94, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
            color: notification.type === "success" ? "#22c55e" : "#ef4444",
            border: `1px solid ${notification.type === "success" ? "#22c55e" : "#ef4444"}`,
            transition: "all 0.3s ease-in-out",
          }}
        >
          {notification.message}
        </div>
      )}

      {/* RENDER LOGIC */}
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
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <h3>No {activeTab.toLowerCase()} orders right now. 🚲</h3>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div className="big-card" key={order.id}>
              <div className="big-top">
                <div>
                  <div className="row">
                    <h3>Order #{order.order_number}</h3>
                    {activeTab === "Available" && (
                      <span className="badge available">New</span>
                    )}
                  </div>
                  <p className="price">
                    ₦{Number(order.total_amount).toLocaleString()}
                  </p>
                </div>
                <div className="fee">
                  <p className="sub">Your Earning</p>
                  <p className="fee-amount" style={{ color: "#22c55e" }}>
                    + ₦{Number(order.delivery_fee).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="info-box">
                <p className="sub small-title">DELIVER TO</p>
                <p className="bold">{order.delivery_address}</p>
                <p
                  style={{
                    fontSize: "14px",
                    marginTop: "5px",
                    color: "var(--text-muted)",
                  }}
                >
                  👤 {order.buyer_name} | 📞{" "}
                  {order.buyer_phone || "No phone provided"}
                </p>
              </div>

              <div className="actions">
                {activeTab === "Available" && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, "in_transit")}
                    className="btn green"
                  >
                    ✅ Accept Order
                  </button>
                )}

                {activeTab === "My Deliveries" && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, "delivered")}
                    className="btn"
                    style={{ background: "#22c55e", color: "white" }}
                  >
                    📦 Mark as Delivered
                  </button>
                )}

                {activeTab === "Completed" && (
                  <span style={{ color: "gray", fontWeight: "bold" }}>
                    ✅ Completed
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </section>

      {/* REAL RECENT DELIVERIES LOGIC */}
      <section className="card recent">
        <h3>Recent Deliveries</h3>
        {completedDeliveries.length === 0 ? (
          <p className="sub" style={{ textAlign: "center", padding: "20px 0" }}>
            No completed deliveries yet.
          </p>
        ) : (
          // Grab the 5 most recently completed deliveries
          completedDeliveries.slice(0, 5).map((delivery) => {
            // Format the date nicely
            const dateObj = new Date(delivery.created_at);
            const timeString = dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                className="recent-item"
                key={delivery.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid var(--border)",
                  padding: "15px 0",
                }}
              >
                <div>
                  <p className="bold">
                    {delivery.delivery_address.substring(0, 30)}...
                  </p>
                  <p
                    className="sub"
                    style={{ fontSize: "12px", marginTop: "4px" }}
                  >
                    {dateObj.toLocaleDateString()} at {timeString}
                  </p>
                </div>
                <p className="bold" style={{ color: "#22c55e" }}>
                  + ₦{Number(delivery.delivery_fee).toLocaleString()}
                </p>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}
