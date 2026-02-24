// controllers/riderController.js
const pool = require("../config/db");

// GET /api/riders/available-orders
const getAvailableOrders = async (req, res) => {
  try {
    // Logic: Only show orders that are actually prepared and need a rider
    const query = `
      SELECT id, order_number, total_amount, delivery_fee, delivery_address, status 
      FROM orders 
      WHERE rider_id IS NULL 
      AND status = 'ready_for_pickup' 
      ORDER BY created_at ASC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Fetch Error:", error.message);
    res.status(500).json({ error: "Server error fetching available orders." });
  }
};

// PUT /api/riders/accept-order/:orderId
const acceptOrder = async (req, res) => {
  const { orderId } = req.params;
  const { rider_id } = req.body;

  if (!rider_id) {
    return res.status(400).json({ error: "Rider identification is required." });
  }

  try {
    // RACE CONDITION PROTECTION:
    // The "WHERE rider_id IS NULL" ensures that if two riders click 'Accept'
    // at the exact same millisecond, only the first one succeeds.
    const query = `
      UPDATE orders 
      SET rider_id = $1, 
          status = 'in_transit', 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 
      AND rider_id IS NULL 
      AND status = 'ready_for_pickup'
      RETURNING id, order_number, status;
    `;

    const result = await pool.query(query, [rider_id, orderId]);

    if (result.rowCount === 0) {
      // Either order doesn't exist, is already taken, or isn't ready yet
      return res.status(400).json({
        success: false,
        error: "Order is no longer available or has already been claimed.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order accepted! Navigate to the pickup location.",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Accept Error:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { getAvailableOrders, acceptOrder };
