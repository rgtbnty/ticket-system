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

// get ticket detail
router.get("/:id", authenticate, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT id, title, description, status, created_at
      FROM tickets
      WHERE id = $1
        AND created_by = $2
        AND is_deleted = false
      `,
      [ticketId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET /tickets/:id error:", err);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

// update ticket
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.userId;

    // no change
    if (!title && !description && !status) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const result = await pool.query(
      `
      UPDATE tickets
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        updated_at = NOW()
      WHERE id = $4
        AND created_by = $5
        AND is_deleted = false
      RETURNING id, title, description, status, updated_at
      `,
      [title, description, status, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// logical delete ticket
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `
      UPDATE tickets
      SET is_deleted = true,
          updated_at = NOW()
      WHERE id = $1
        AND created_by = $2
        AND is_deleted = false
      `,
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /tickets/:id/comments
 * Create a comment for a ticket
 */
router.post("/:id/comments", authenticate, async (req, res) => {
  const ticketId = req.params.id;
  const userId = req.user.userId;
  const { body } = req.body;

  if (!body) {
    return res.status(400).json({ error: "Comment body is required" });
  }

  try {
    // Check ticket exists and not deleted
    const ticketResult = await pool.query(
      `
      SELECT id
      FROM tickets
      WHERE id = $1 AND is_deleted = false
      `,
      [ticketId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Insert comment
    const commentResult = await pool.query(
      `
      INSERT INTO comments (ticket_id, user_id, body)
      VALUES ($1, $2, $3)
      RETURNING id, body, user_id, created_at
      `,
      [ticketId, userId, body]
    );

    res.status(201).json(commentResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

/**
 * GET /tickets/:id/comments
 * Get comments for a ticket
 */
router.get("/:id/comments", authenticate, async (req, res) => {
  const ticketId = req.params.id;

  try {
    // Check ticket exists and not deleted
    const ticketResult = await pool.query(
      `
      SELECT id
      FROM tickets
      WHERE id = $1 AND is_deleted = false
      `,
      [ticketId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Get comments
    const commentsResult = await pool.query(
      `
      SELECT id, body, user_id, created_at
      FROM comments
      WHERE ticket_id = $1
      ORDER BY created_at ASC
      `,
      [ticketId]
    );

    res.json(commentsResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

export default router;
