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

module.exports = { getAllProducts };
