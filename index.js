import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "https://your-frontend.vercel.app", // replace with your frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// HTTP + Socket.IO server
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4002;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
