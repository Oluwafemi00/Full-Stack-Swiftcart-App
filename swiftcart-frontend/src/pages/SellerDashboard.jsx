// src/pages/SellerDashboard.jsx
import { useState, useEffect } from "react";
// Removed unused data imports to keep it clean
import "./SellerDashboard.css";

export default function SellerDashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    inventory: [],
    orders: [], // Assuming your API might eventually return orders
  });
  const [activeTab, setActiveTab] = useState("Pending");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentSellerId = 1;

  // Labels for your tabs
  const tabs = ["Pending", "Ready for Pickup", "In Progress"];

  useEffect(() => {
    // AbortController handles the case where the component unmounts before the fetch finishes
    const controller = new AbortController();

    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/sellers/${currentSellerId}/dashboard`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setDashboardData(data);
        setIsLoading(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch dashboard data", err);
          setError("Could not load dashboard. Please try again later.");
          setIsLoading(false);
        }
      }
    };

    fetchDashboard();
    return () => controller.abort(); // Cleanup
  }, [currentSellerId]);

  if (isLoading) {
    return (
      <main
        className="container"
        style={{ textAlign: "center", padding: "100px 0" }}
      >
        <h2>Loading your dashboard... 📊</h2>
      </main>
    );
  }

  if (error) {
    return (
      <main
        className="container"
        style={{ textAlign: "center", padding: "100px 0" }}
      >
        <h2 style={{ color: "red" }}>{error}</h2>
        <button onClick={() => window.location.reload()}>Retry</button>
      </main>
    );
  }

  return (
    <main className="container">
      {/* DASHBOARD HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Seller Dashboard</h1>
          <p>Manage your orders and inventory</p>
        </div>

        <div className="actions">
          <button className="notify">
            🔔 Notifications <span className="badge">3</span>
          </button>
          <button className="add-product">➕ Add Product</button>
        </div>
      </div>

      {/* RENDER DYNAMIC STATS */}
      <section className="stats">
        {dashboardData.stats?.map((stat) => (
          <div className="card" key={stat.id || stat.label}>
            <p>{stat.label}</p>
            <h2>{stat.value}</h2>
            <span
              className={stat.trend.includes("+") ? "positive" : "negative"}
            >
              {stat.trend}
            </span>
          </div>
        ))}
      </section>

      {/* ORDERS SECTION */}
      <section className="orders">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="orders-box">
          {/* Logic to filter/show orders would go here */}
          <div className="empty">
            ⏰<p>No {activeTab.toLowerCase()} orders</p>
          </div>
        </div>
      </section>

      {/* RENDER DYNAMIC INVENTORY */}
      <section className="products-section">
        <div className="products-header">
          <h2>Your Products</h2>
          <p>Manage your listed products</p>
        </div>

        <div className="products-table">
          <div className="table-header">
            <span>Product</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Rating</span>
          </div>

          {dashboardData.inventory.length === 0 ? (
            <p style={{ padding: "20px", color: "gray" }}>
              You haven't listed any products yet.
            </p>
          ) : (
            dashboardData.inventory.map((product) => (
              <div className="table-row" key={product.id}>
                <div className="product-info">
                  <div className="icon">📦</div>
                  <span>{product.name}</span>
                </div>
                <span className="price">₦{product.price.toLocaleString()}</span>
                <span
                  className={`stock ${product.stock < 5 ? "low-stock" : ""}`}
                >
                  {product.stock} units
                </span>
                <span className="rating">⭐ {product.rating}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
