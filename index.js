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

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",           // dev
  "https://chat-z89o.vercel.app",   // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman, mobile apps
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error(`CORS policy: This origin (${origin}) is not allowed`), false);
      }
      return callback(null, true);
    },
    credentials: true, // allow cookies/auth
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

// ✅ Socket.IO with proper CORS for credentials
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = {}; // userId => socket.id

io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId;
  if (userId) {
    onlineUsers[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
    console.log("User connected:", userId, socket.id);
  }

  // Listen to messages
  socket.on("send_message", ({ to, message }) => {
    const receiverSocketId = onlineUsers[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", message);
    }
  });

  socket.on("disconnect", () => {
    if (userId) delete onlineUsers[userId];
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4002;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
