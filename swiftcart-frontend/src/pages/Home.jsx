// src/pages/Home.jsx
import { useState, useEffect } from "react"; // Import useEffect
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "./Home.css";
// We no longer import { featuredProducts } from '../data/products'!

export default function Home({ searchQuery }) {
  const [activeCategory, setActiveCategory] = useState("All");

  // 1. Create state to hold our database products and loading status
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "All",
    "Electronics",
    "Sports",
    "Food and Beverages",
    "Accessories",
    "Home & Garden",
  ];

  // 2. Fetch data when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();

        // THE FIX: Check if the backend actually sent us an array!
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Backend sent an error instead of an array:", data);
          setProducts([]); // Fallback to an empty array so .filter() won't crash
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // Fallback to empty array on network failure
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs ONCE when the page loads

  // 3. Update the filter logic to use the new 'products' state
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes((searchQuery || "").toLowerCase());
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <h1>
          <span>Unified</span> Commerce <br />& Logistics Platform
        </h1>
        <p>
          Connect buyers, sellers, and riders in one seamless marketplace.
          Experience real-time delivery tracking and instant order management.
        </p>
        <div className="hero-buttons">
          <button className="button1">
            <a href="#featured-section">Start Shopping →</a>
          </button>
          <button className="button2">
            <Link to="/seller">Become a Seller</Link>
          </button>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <div className="feature-box">
          {/* Changed duplicate IDs to classes */}
          <div className="feature-item">
            <h3>Fast Delivery</h3>
            <p>Real-time rider tracking</p>
          </div>
          <div className="feature-item">
            <h3>Secure Payments</h3>
            <p>Protected transactions</p>
          </div>
          <div className="feature-item">
            <h3>24/7 Support</h3>
            <p>Always here for you</p>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section id="statistics" className="stats">
        <div className="stat">
          <h2>10K+</h2>
          <p>Active Buyers</p>
        </div>
        <div className="stat">
          <h2>500+</h2>
          <p>Verified Sellers</p>
        </div>
        <div className="stat">
          <h2>1K+</h2>
          <p>Riders</p>
        </div>
        <div className="stat">
          <h2>98%</h2>
          <p>On-time Delivery</p>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section>
        <div id="featured-section" className="featured-section">
          <div>
            <h2>Featured Products</h2>
            <p>Discover amazing products from verified sellers</p>
          </div>

          <div className="btn-display">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? "active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Handle Loading State gracefully */}
        <div className="products-container">
          {isLoading ? (
            <div
              style={{
                textAlign: "center",
                gridColumn: "1/-1",
                padding: "40px",
                color: "var(--text-muted)",
              }}
            >
              <h2>Loading products... ⏳</h2>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                gridColumn: "1 / -1",
                padding: "60px 0",
                color: "var(--text-muted)",
              }}
            >
              <h3>No products found!</h3>
              <button
                className="btn-primary"
                onClick={() => setActiveCategory("All")}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="info">
        <div>
          <h3>How SwiftCart Works</h3>
        </div>
        <div className="info-container">
          <div>
            <h3 className="num">01</h3>
            <h3>Browse & Order</h3>
            <p>
              Explore Product from trusted sellers and place your order securely
            </p>
          </div>
          <div>
            <h3 className="num">02</h3>
            <h3>Seller Prepares</h3>
            <p>The seller receive your order and prepare it for delivery</p>
          </div>
          <div>
            <h3 className="num">03</h3>
            <h3>Rider Delivers</h3>
            <p>A nearby rider picks up and delivers your order in real-time</p>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer>
        <div className="favicon">
          <h3>SwiftCart</h3>
          <p>Connecting buyers, sellers, and riders seamlessly.</p>
        </div>
      </footer>
    </>
  );
}
