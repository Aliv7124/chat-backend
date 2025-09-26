

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors({
  origin: "https://chat-z89o.vercel.app",
  credentials: true,
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chat-z89o.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId;
  if (userId) {
    users[userId] = socket.id;
    console.log("User connected:", userId);
  }

  io.emit("getOnlineUsers", Object.keys(users));

  socket.on("send_message", ({ to, message }) => {
    const receiverSocketId = users[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", message);
    }
  });

  socket.on("disconnect", () => {
    if (userId) delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4002, () => console.log("Server running on 4002"));
