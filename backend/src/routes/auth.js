import express from "express";
import bcrypt from "bcrypt";
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

export default router;

