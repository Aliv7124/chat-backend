/* import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",               // desktop dev
      "http://192.168.x.x:5173",             // mobile dev (LAN IP)
      "https://chat-z89o.vercel.app",        // deployed frontend
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = {}; // store userId => socket.id

io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId; // use auth instead of query
  if (userId) {
    users[userId] = socket.id;
    console.log("User connected:", userId, socket.id);
  }

  // Emit online users to everyone
  io.emit("getOnlineUsers", Object.keys(users));

  // Listen to send_message event from client
  socket.on("send_message", ({ to, message }) => {
    const receiverSocketId = users[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", message);
    }
  });

  // On disconnect
  socket.on("disconnect", () => {
    if (userId) delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
    console.log("User disconnected:", socket.id);
  });
});

export { app, io, server };
*/





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
