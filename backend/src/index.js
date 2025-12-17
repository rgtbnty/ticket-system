import app from "./app.js";
import { pool } from "./db.js";

const PORT = 3000;

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log("API running");
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
})();
