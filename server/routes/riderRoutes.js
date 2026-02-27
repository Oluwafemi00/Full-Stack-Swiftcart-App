// swiftcart-backend/routes/riderRoutes.js
const express = require("express");
const router = express.Router();
const {
  getRiderOrders,
  updateOrderStatus,
} = require("../controllers/riderController");
const { protect } = require("../middleware/authMiddleware"); // 👈 Security check

// Only logged-in riders can access these!
router.get("/orders", protect, getRiderOrders);
router.put("/orders/:id/status", protect, updateOrderStatus);

module.exports = router;
