// src/pages/SellerDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import "./SellerDashboard.css";

export default function SellerDashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    inventory: [],
  });

  // 1. New State for the Orders Queue!
  const [orders, setOrders] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Electronics",
    image_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const [activeTab, setActiveTab] = useState("Pending");
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const currentSellerId = 1; // Used for fetching the legacy dashboard stats

  // Labels for your tabs
  const tabs = ["Pending", "Ready for Pickup", "In Progress"];

  // Fetch Dashboard Stats (Legacy)
  const fetchDashboard = useCallback(
    async (signal = null) => {
      try {
        const fetchOptions = signal ? { signal } : {};
        const response = await fetch(
          `http://localhost:5000/api/sellers/${currentSellerId}/dashboard`,
          fetchOptions,
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch dashboard data", err);
          setPageError("Could not load dashboard. Please try again later.");
        }
      }
    },
    [currentSellerId],
  );

  // 2. NEW: Fetch Seller Orders
  const fetchOrders = useCallback(async (signal = null) => {
    try {
      const token = localStorage.getItem("token");
      const fetchOptions = {
        headers: { Authorization: `Bearer ${token}` },
        ...(signal && { signal }),
      };

      const response = await fetch(
        "http://localhost:5000/api/sellers/orders",
        fetchOptions,
      );
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      if (err.name !== "AbortError")
        console.error("Failed to fetch orders", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run both fetches on load
  useEffect(() => {
    const controller = new AbortController();
    fetchDashboard(controller.signal);
    fetchOrders(controller.signal);
    return () => controller.abort();
  }, [fetchDashboard, fetchOrders]);

  // Handle typing in the product form
  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // Submit new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage("");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      const data = await response.json();
      if (response.ok) {
        setFormMessage("✅ Product added successfully!");
        setNewProduct({
          name: "",
          description: "",
          price: "",
          stock: "",
          category: "Electronics",
          image_url: "",
        });
        fetchDashboard();
      } else {
        setFormMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.log(err.formMessage);
      setFormMessage("❌ Failed to connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. NEW: Handle updating order status to 'ready_for_pickup'
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/sellers/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        fetchOrders(); // Instantly refresh the orders array so it moves tabs!
      } else {
        alert("Failed to update order. Please try again.");
      }
    } catch (error) {
      console.error("Status Update Error:", error);
    }
  };

  // 4. NEW: Filter orders dynamically based on the active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "Pending") return order.status === "pending";
    if (activeTab === "Ready for Pickup")
      return order.status === "ready_for_pickup";
    if (activeTab === "In Progress")
      return order.status === "in_transit" || order.status === "delivered";
    return false;
  });

  if (isLoading)
    return (
      <main
        className="container"
        style={{ textAlign: "center", padding: "100px 0" }}
      >
        <h2>Loading your dashboard... 📊</h2>
      </main>
    );
  if (pageError)
    return (
      <main
        className="container"
        style={{ textAlign: "center", padding: "100px 0" }}
      >
        <h2 style={{ color: "red" }}>{pageError}</h2>
        <button onClick={() => window.location.reload()}>Retry</button>
      </main>
    );

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

      {/* STATS */}
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

      {/* ADD PRODUCT FORM */}
      <div
        style={{
          background: "var(--bg-card)",
          padding: "30px",
          borderRadius: "15px",
          marginTop: "30px",
        }}
      >
        <h3>Add New Product</h3>
        {formMessage && (
          <div
            style={{
              margin: "15px 0",
              padding: "10px",
              background: formMessage.includes("✅") ? "#e8f5e9" : "#ffebee",
              color: formMessage.includes("✅") ? "green" : "red",
              borderRadius: "5px",
            }}
          >
            {formMessage}
          </div>
        )}
        <form
          onSubmit={handleAddProduct}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginTop: "15px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            required
            value={newProduct.name}
            onChange={handleInputChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              background: "#0a1322",
              color: "white",
              border: "1px solid var(--border)",
            }}
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₦)"
            required
            value={newProduct.price}
            onChange={handleInputChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              background: "#0a1322",
              color: "white",
              border: "1px solid var(--border)",
            }}
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            required
            value={newProduct.stock}
            onChange={handleInputChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              background: "#0a1322",
              color: "white",
              border: "1px solid var(--border)",
            }}
          />
          <select
            name="category"
            value={newProduct.category}
            onChange={handleInputChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              background: "#0a1322",
              color: "white",
              border: "1px solid var(--border)",
            }}
          >
            <option value="Electronics">Electronics</option>
            <option value="Groceries">Groceries</option>
            <option value="Fashion">Fashion</option>
            <option value="Accessories">Accessories</option>
          </select>
          <input
            type="text"
            name="image_url"
            placeholder="Image URL (optional)"
            value={newProduct.image_url}
            onChange={handleInputChange}
            style={{
              gridColumn: "span 2",
              padding: "10px",
              borderRadius: "5px",
              background: "#0a1322",
              color: "white",
              border: "1px solid var(--border)",
            }}
          />
          <textarea
            name="description"
            placeholder="Product Description"
            rows="3"
            required
            value={newProduct.description}
            onChange={handleInputChange}
            style={{
              gridColumn: "span 2",
              padding: "10px",
              borderRadius: "5px",
              background: "#0a1322",
              color: "white",
              border: "1px solid var(--border)",
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ gridColumn: "span 2", marginTop: "10px" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Publish Product"}
          </button>
        </form>
      </div>

      {/* ORDERS SECTION (Fully Dynamic!) */}
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
          {filteredOrders.length === 0 ? (
            <div className="empty">
              ⏰<p>No {activeTab.toLowerCase()} orders right now.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "15px", width: "100%" }}>
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#0a1322",
                    padding: "20px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 5px 0" }}>
                      Order #{order.order_number}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--text-muted)",
                        fontSize: "14px",
                      }}
                    >
                      Buyer: {order.buyer_name}
                    </p>
                    <p style={{ margin: "5px 0 0 0", fontWeight: "bold" }}>
                      Total: ₦{Number(order.total_amount).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    {activeTab === "Pending" && (
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(order.id, "ready_for_pickup")
                        }
                        style={{
                          background: "var(--primary)",
                          color: "white",
                          padding: "10px 20px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        📦 Pack & Mark Ready
                      </button>
                    )}
                    {activeTab === "Ready for Pickup" && (
                      <span style={{ color: "#f59e0b", fontWeight: "bold" }}>
                        Waiting for Rider... 🛵
                      </span>
                    )}
                    {activeTab === "In Progress" && (
                      <span
                        style={{
                          color:
                            order.status === "delivered"
                              ? "#22c55e"
                              : "#3b82f6",
                          fontWeight: "bold",
                        }}
                      >
                        {order.status === "delivered"
                          ? "✅ Delivered"
                          : "🚚 In Transit"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* INVENTORY */}
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
          {dashboardData.inventory?.length === 0 ? (
            <p style={{ padding: "20px", color: "gray" }}>
              You haven't listed any products yet.
            </p>
          ) : (
            dashboardData.inventory?.map((product) => (
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
                <span className="rating">{product.rating}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
