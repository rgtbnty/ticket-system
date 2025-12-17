// routes/tickets.js
import express from "express";
import {pool} from "../db.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const result = await pool.query(
      `
      INSERT INTO tickets (title, description, created_by)
      VALUES ($1, $2, $3)
      RETURNING id, title, description, created_by, created_at
      `,
      [title, description || null, req.user.userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

export default router;
