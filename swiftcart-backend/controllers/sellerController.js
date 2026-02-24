// controllers/sellerController.js
const pool = require("../config/db");

const getSellerDashboard = async (req, res) => {
  const { sellerId } = req.params;

  try {
    // 1. Total Revenue (JOIN products to verify ownership)
    const revenueQuery = `
      SELECT COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0) as total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE p.seller_id = $1;
    `;

    // 2. Orders Today
    const ordersTodayQuery = `
      SELECT COUNT(DISTINCT oi.order_id) as orders_today
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE p.seller_id = $1 AND o.created_at >= CURRENT_DATE;
    `;

    // 3. Products Count
    const productsCountQuery = `
      SELECT COUNT(*) as total_products
      FROM products
      WHERE seller_id = $1;
    `;

    // 4. Inventory List
    const inventoryQuery = `
      SELECT id, name, price, stock, COALESCE(rating, 0) as rating 
      FROM products 
      WHERE seller_id = $1 
      ORDER BY created_at DESC;
    `;

    const [revenueRes, ordersRes, productsCountRes, inventoryRes] =
      await Promise.all([
        pool.query(revenueQuery, [sellerId]),
        pool.query(ordersTodayQuery, [sellerId]),
        pool.query(productsCountQuery, [sellerId]),
        pool.query(inventoryQuery, [sellerId]), // Fixed: passing query string
      ]);

    const totalRevenue = revenueRes.rows[0].total_revenue;
    const ordersToday = ordersRes.rows[0].orders_today;
    const totalProducts = productsCountRes.rows[0].total_products;

    // Map inventory to match frontend CSS classes and formatting
    const inventory = inventoryRes.rows.map((item) => ({
      ...item,
      // Logic for React CSS classes: 'good', 'low', or 'out'
      status: item.stock === 0 ? "out" : item.stock < 10 ? "low" : "good",
      rating: `⭐ ${Number(item.rating).toFixed(1)}`,
    }));

    res.status(200).json({
      stats: [
        {
          id: 1,
          label: "Total Revenue",
          value: `₦${Number(totalRevenue).toLocaleString()}`,
          trend: "+12% from last week",
        },
        {
          id: 2,
          label: "Orders Today",
          value: ordersToday.toString(),
          trend: "+5 new orders",
        },
        {
          id: 3,
          label: "Active Products",
          value: totalProducts.toString(),
          trend: "Live on store",
        },
      ],
      inventory: inventory,
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).json({ error: "Failed to load seller dashboard." });
  }
};

module.exports = { getSellerDashboard };
