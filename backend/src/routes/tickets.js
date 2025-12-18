// routes/tickets.js
import express from "express";
import {pool} from "../db.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

// create ticket
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

// retrieve ticket list
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT id, title, status, created_at
      FROM tickets
      WHERE created_by = $1
        AND is_deleted = false
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET /tickets error:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

export default router;
