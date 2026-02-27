// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  addProductReview,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware"); // 👈 Import our security guard!

// GET /api/products
router.get("/", getAllProducts);

// NEW: Protected route for sellers to add a product
router.post("/", protect, createProduct);

// NEW: Protected route for leaving a review
router.post("/:id/reviews", protect, addProductReview);

module.exports = router;
