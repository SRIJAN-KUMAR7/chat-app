const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Proper CORS setup for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Middleware for Express (optional, mainly for REST APIs)
app.use(cors());

// When a user connects
io.on("connection", (socket) => {
  console.log("A user connected");

  // Fix the typo in "newUser" event
  socket.on("newUser", (username) => {
    socket.username = username; // Store the username in socket object
    socket.broadcast.emit("user-connected", username); // Emit to everyone except the sender
    console.log(`${username} connected`);
  });

  // Handle incoming messages
  socket.on("sendMessage", (message) => {
    io.emit("message", message);
    console.log(`Message received: ${message}`);
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    if (socket.username) {
      socket.broadcast.emit("user-disconnected", socket.username);
      console.log(`${socket.username} disconnected`);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
