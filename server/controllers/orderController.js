// controllers/orderController.js
const pool = require("../config/db");

// POST /api/orders
const createOrder = async (req, res) => {
  const { cartItems, deliveryAddress, paymentMethod, deliveryFee } = req.body;
  const buyerId = req.user.id; // We get this securely from our auth middleware!

  // 1. Grab a dedicated client from the pool to run a Transaction
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // 🚀 START TRANSACTION

    // 2. Calculate the exact total amount from the cart items
    let totalAmount = 0;
    for (let item of cartItems) {
      totalAmount += item.price * item.quantity;
    }

    // 3. Generate a unique Order Number (e.g., ORD-1678234-543)
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 4. Create the main Order record
    const orderQuery = `
      INSERT INTO orders (order_number, buyer_id, total_amount, delivery_fee, payment_method, delivery_address)
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id;
    `;
    const orderRes = await client.query(orderQuery, [
      orderNumber,
      buyerId,
      totalAmount,
      deliveryFee || 1000,
      paymentMethod,
      deliveryAddress,
    ]);
    const newOrderId = orderRes.rows[0].id;

    // 5. Loop through the cart to save Order Items AND deduct Inventory
    for (let item of cartItems) {
      // Save the item
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [newOrderId, item.id, item.quantity, item.price],
      );

      // Deduct the stock
      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [item.quantity, item.id],
      );
    }

    await client.query("COMMIT"); // ✅ SAVE EVERYTHING TO DATABASE

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrderId,
    });
  } catch (error) {
    await client.query("ROLLBACK"); // ❌ CANCEL EVERYTHING IF ANYTHING FAILS
    console.error("Checkout Transaction Error:", error);
    res.status(500).json({ error: "Checkout failed. Please try again." });
  } finally {
    client.release(); // Return the client back to the pool
  }
};

// swiftcart-backend/controllers/orderController.js

// ... your existing createOrder function is up here ...

// NEW: GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  const buyerId = req.user.id; // Securely grab the logged-in buyer's ID

  try {
    const query = `
      SELECT id, order_number, total_amount, delivery_fee, status, created_at, delivery_address 
      FROM orders 
      WHERE buyer_id = $1 
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [buyerId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    res.status(500).json({ error: "Failed to fetch your orders." });
  }
};

// Make sure to export it alongside your createOrder function!
// Example: module.exports = { createOrder, getMyOrders };

module.exports = { createOrder, getMyOrders };
