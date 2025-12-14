import "dotenv/config";
import express from "express";
import { pool } from "./db.js";



const app = express();
app.use(express.json());

try {
    await pool.query("SELECT 1");
    console.log("DB connected");
} catch (err) {
    console.error("DB connection failed", err);
    process.exit(1);
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("API running");
});


