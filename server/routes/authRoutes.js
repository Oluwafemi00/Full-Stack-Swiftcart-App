// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware"); // 👈 Import middleware

router.post("/register", registerUser);
router.post("/login", loginUser);

// 👈 This route uses the 'protect' middleware before running 'getMe'
router.get("/me", protect, getMe);

module.exports = router;
