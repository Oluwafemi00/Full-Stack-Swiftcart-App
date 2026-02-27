// controllers/productController.js
const pool = require("../config/db");

const getAllProducts = async (req, res) => {
  try {
    // Query the database for all products
    // We order by created_at to show the newest items first
    const result = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC",
    );

    // Send the rows back to React!
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database Error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch products from the database." });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  const { name, description, price, stock, category, image_url } = req.body;

  // We get the sellerId securely from the JWT token middleware!
  const sellerId = req.user.id;

  // Security Gate: Ensure only Sellers can trigger this
  if (req.user.role !== "seller") {
    return res
      .status(403)
      .json({ error: "Access denied. Only sellers can add products." });
  }

  try {
    const query = `
      INSERT INTO products (seller_id, name, description, price, stock, category, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    // Default image if they don't provide one
    const defaultImage = image_url || "./images/smartwatch.jpg";

    const result = await pool.query(query, [
      sellerId,
      name,
      description,
      price,
      stock,
      category,
      defaultImage,
    ]);

    res.status(201).json({ success: true, product: result.rows[0] });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to add product to the database." });
  }
};
// NEW: POST /api/products/:id/reviews
const addProductReview = async (req, res) => {
  const productId = req.params.id;
  const { rating, comment } = req.body;
  const buyerId = req.user.id; // From the JWT token!

  try {
    // 1. Save the review to the database
    await pool.query(
      `INSERT INTO reviews (product_id, buyer_id, rating, comment) 
       VALUES ($1, $2, $3, $4)`,
      [productId, buyerId, rating, comment],
    );

    // 2. Automatically calculate the new average and update the products table!
    // This is what will make your Seller Dashboard stats update dynamically!
    await pool.query(
      `UPDATE products 
       SET rating = (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE product_id = $1)
       WHERE id = $1`,
      [productId],
    );

    res
      .status(201)
      .json({ success: true, message: "Review added successfully!" });
  } catch (error) {
    console.error("Error adding review:", error.message);
    res.status(500).json({ error: "Failed to submit review." });
  }
};

module.exports = { getAllProducts, createProduct, addProductReview };
