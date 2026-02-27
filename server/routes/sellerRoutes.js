// swiftcart-backend/routes/sellerRoutes.js
const express = require("express");
const router = express.Router();

// Import all 3 functions from the controller!
const {
  getSellerDashboard,
  getSellerOrders,
  updateOrderStatus,
} = require("../controllers/sellerController");
const { protect } = require("../middleware/authMiddleware");

// 1. Existing Dashboard Route (Kept unprotected so your current frontend fetch still works perfectly)
router.get("/:sellerId/dashboard", getSellerDashboard);

// 2. New Protected Order Routes
router.get("/orders", protect, getSellerOrders);
router.put("/orders/:id/status", protect, updateOrderStatus);

module.exports = router;
