// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const { checkout } = require("../controllers/orderController");

// POST /api/orders/checkout
router.post("/checkout", checkout);

module.exports = router;
