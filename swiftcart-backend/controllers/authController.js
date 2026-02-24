// controllers/authController.js
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
const registerUser = async (req, res) => {
  // We extract the role from the frontend request!
  const { name, email, password, role, phone, address } = req.body;

  try {
    // 1. Check if the user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (userExists.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "A user with this email already exists." });
    }

    // 2. Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Insert the new user into the database
    // We default to 'buyer' if no role is explicitly sent
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, phone, address) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, email, role`,
      [name, email, password_hash, role || "buyer", phone, address],
    );

    // 4. Generate a JWT Token
    const user = newUser.rows[0];
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Token lasts for 7 days
    );

    // 5. Send back the user data and token
    res.status(201).json({ message: "Registration successful", user, token });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ error: "Server error during registration." });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user by email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = result.rows[0];

    // 2. Compare the submitted password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // 3. Generate a JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 4. Send back the user data (excluding the password hash!)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Server error during login." });
  }
};

module.exports = { registerUser, loginUser };
