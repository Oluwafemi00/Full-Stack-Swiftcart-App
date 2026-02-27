// swiftcart-backend/controllers/sellerController.js
const pool = require("../config/db");

// ==========================================
// 1. DASHBOARD LOGIC (Your existing code!)
// ==========================================
const getSellerDashboard = async (req, res) => {
  const { sellerId } = req.params;

  try {
    // 1. Total Revenue
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
        pool.query(inventoryQuery, [sellerId]),
      ]);

    const totalRevenue = revenueRes.rows[0].total_revenue;
    const ordersToday = ordersRes.rows[0].orders_today;
    const totalProducts = productsCountRes.rows[0].total_products;

    const inventory = inventoryRes.rows.map((item) => ({
      ...item,
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

// ==========================================
// 2. ORDER QUEUE LOGIC (The new features!)
// ==========================================

// GET /api/sellers/orders
const getSellerOrders = async (req, res) => {
  const sellerId = req.user.id; // Securely grabbed from JWT

  try {
    const query = `
      SELECT DISTINCT o.id, o.order_number, o.total_amount, o.status, o.created_at, u.name as buyer_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON o.buyer_id = u.id
      WHERE p.seller_id = $1
      ORDER BY o.created_at DESC;
    `;
    const result = await pool.query(query, [sellerId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ error: "Failed to fetch your orders." });
  }
};

// PUT /api/sellers/orders/:id/status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'ready_for_pickup'

  try {
    const result = await pool.query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [status, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json({ success: true, order: result.rows[0] });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order status." });
  }
};

// EXPORT ALL 3 FUNCTIONS!
module.exports = { getSellerDashboard, getSellerOrders, updateOrderStatus };
