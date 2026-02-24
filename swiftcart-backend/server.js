// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Allows React to make requests
app.use(express.json()); // Allows Express to read JSON data from requests

// Import Routes
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const riderRoutes = require("./routes/riderRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const authRoutes = require("./routes/authRoutes");
// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/riders", riderRoutes);
app.use("/api/sellers", sellerRoutes);
// Basic Health Check Route
app.get("/", (req, res) => {
  res.send("SwiftCart API is running smoothly! 🛒🚀");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
