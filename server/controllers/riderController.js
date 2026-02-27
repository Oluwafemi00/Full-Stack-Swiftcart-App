// swiftcart-backend/controllers/riderController.js
const pool = require("../config/db");

// GET /api/riders/orders
const getRiderOrders = async (req, res) => {
  const riderId = req.user.id; // Securely grabbed from JWT!

  try {
    // Logic: Fetch orders that are waiting for a rider (rider_id IS NULL)
    // OR orders that are already claimed by THIS specific rider.
    const query = `
      SELECT o.id, o.order_number, o.total_amount, o.delivery_fee, o.status, o.delivery_address, o.created_at,
             u.name AS buyer_name, u.phone AS buyer_phone
      FROM orders o
      JOIN users u ON o.buyer_id = u.id
      WHERE (o.status = 'pending' AND o.rider_id IS NULL) 
         OR o.rider_id = $1
      ORDER BY o.created_at DESC;
    `;
    const result = await pool.query(query, [riderId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Fetch Error:", error.message);
    res.status(500).json({ error: "Server error fetching rider orders." });
  }
};

// PUT /api/riders/orders/:id/status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'in_transit' or 'delivered'
  const riderId = req.user.id; // Securely grabbed from JWT!

  try {
    let query;
    let params;

    // 🚀 RACE CONDITION PROTECTION: Only accept if rider_id is still NULL
    if (status === "in_transit") {
      query = `
        UPDATE orders 
        SET status = $1, rider_id = $2, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $3 AND rider_id IS NULL
        RETURNING *
      `;
      params = [status, riderId, id];
    }
    // Normal update (e.g., marking as delivered): Ensure THIS rider owns the order
    else {
      query = `
        UPDATE orders 
        SET status = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2 AND rider_id = $3
        RETURNING *
      `;
      params = [status, id, riderId];
    }

    const result = await pool.query(query, params);

    if (result.rowCount === 0) {
      return res.status(400).json({
        success: false,
        error:
          "Order is no longer available or you are not authorized to update it.",
      });
    }

    res.status(200).json({ success: true, order: result.rows[0] });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ error: "Failed to update order status." });
  }
};

module.exports = { getRiderOrders, updateOrderStatus };
