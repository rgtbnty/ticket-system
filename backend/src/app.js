import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/auth.js";
import ticketRouter from "./routes/tickets.js";
import commentRouter from "./routes/comments.js";

const app = express();

app.use(express.json());
app.use("/auth", authRouter);
app.use("/tickets", ticketRouter);
app.use("/comments", commentRouter);

export default app;
