import express from "express";
import { pool } from "../db.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.delete("/:id", authenticate, async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `
      UPDATE comments
      SET is_deleted = true,
          deleted_at = NOW()
      WHERE id = $1
        AND user_id = $2
        AND is_deleted = false
      RETURNING id
      `,
      [commentId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default router;
