// swiftcart-backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // Check if the request has an authorization header with a "Bearer" token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get the token string (Remove the word "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // Decode the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user's ID and Role to the request so the next function can use it!
      req.user = decoded;

      next(); // Pass the request to the controller
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
