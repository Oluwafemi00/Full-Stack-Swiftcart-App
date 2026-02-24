// routes/sellerRoutes.js
const express = require("express");
const router = express.Router();
const { getSellerDashboard } = require("../controllers/sellerController");

// Define the endpoint
router.get("/:sellerId/dashboard", getSellerDashboard);

module.exports = router;
