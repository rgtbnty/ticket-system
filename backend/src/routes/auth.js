import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";



const router = express.Router();


// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    // hashing
    const passwordHash = await bcrypt.hash(password, 10);

    // save to DB
    const result = await pool.query(
      `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, role, created_at
      `,
      [email, passwordHash]
    );

    // successful save
    res.status(201).json(result.rows[0]);

  } catch (err) {
    // same email
    if (err.code === "23505") {
      return res.status(409).json({ message: "email already exists" });
    }

    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    // validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await pool.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    // user not exist
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    // incorrect password
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ // 200
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});




export default router;

