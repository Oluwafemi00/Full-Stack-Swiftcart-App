// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// Protect this route! You must have a valid JWT token to checkout.
router.post("/", protect, createOrder);

// NEW: Fetch orders for the logged-in buyer
router.get("/myorders", protect, getMyOrders);

module.exports = router;
