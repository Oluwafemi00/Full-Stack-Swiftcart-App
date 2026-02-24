// routes/riderRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAvailableOrders,
  acceptOrder,
} = require("../controllers/riderController");

router.get("/available-orders", getAvailableOrders);
router.put("/accept-order/:orderId", acceptOrder);

module.exports = router;
