// controllers/orderController.js
const pool = require("../config/db");

const checkout = async (req, res) => {
  // 1. Grab the data sent from the React frontend
  const {
    buyer_id,
    cartItems,
    payment_method,
    delivery_address,
    delivery_fee,
  } = req.body;

  // We request a dedicated client from the pool to run our Transaction
  const client = await pool.connect();

  try {
    // Start the SQL Transaction
    await client.query("BEGIN");

    // 2. Calculate the total amount
    const itemsTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const total_amount = itemsTotal + delivery_fee;

    // Generate a unique order number (e.g., SC-167890123)
    const order_number = `SC-${Date.now().toString().slice(-6)}`;

    // 3. Insert the main order into the `orders` table
    const orderQuery = `
      INSERT INTO orders (order_number, buyer_id, total_amount, delivery_fee, payment_method, delivery_address)
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, order_number;
    `;
    const orderValues = [
      order_number,
      buyer_id,
      total_amount,
      delivery_fee,
      payment_method,
      delivery_address,
    ];

    const orderResult = await client.query(orderQuery, orderValues);
    const newOrder = orderResult.rows[0]; // Get the ID of the newly created order

    // 4. Insert each item into the `order_items` table
    const itemQuery = `
      INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
      VALUES ($1, $2, $3, $4);
    `;

    // 5. Update the product stock in the `products` table
    const stockQuery = `
      UPDATE products 
      SET stock = stock - $1 
      WHERE id = $2 AND stock >= $1;
    `;

    for (let item of cartItems) {
      // Save the item to the receipt
      await client.query(itemQuery, [
        newOrder.id,
        item.id,
        item.quantity,
        item.price,
      ]);

      // Deduct the stock
      const stockResult = await client.query(stockQuery, [
        item.quantity,
        item.id,
      ]);

      // If stockResult.rowCount is 0, it means they tried to buy more than we have!
      if (stockResult.rowCount === 0) {
        throw new Error(`Insufficient stock for product ID: ${item.id}`);
      }
    }

    // If we made it here without errors, save EVERYTHING to the database
    await client.query("COMMIT");

    // Send success back to React!
    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderData: newOrder,
    });
  } catch (error) {
    // If ANY part of the process fails, undo everything!
    await client.query("ROLLBACK");
    console.error("Checkout Error:", error.message);

    res.status(400).json({
      success: false,
      error: error.message || "Checkout failed. Please try again.",
    });
  } finally {
    // Always return the client to the pool, whether it succeeded or failed
    client.release();
  }
};

module.exports = {
  checkout,
};
