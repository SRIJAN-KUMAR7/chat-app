const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(cors());

// When a user connects
io.on("connection", (socket) => {
  console.log("A user connected");

  // Notify others when a user joins
  socket.on("newUser ", (username) => {
    socket.username = username; // Store the username in socket object
    socket.broadcast.emit("user-connected", username); // Emit to everyone except the sender
  });

  // Handle incoming messages
  socket.on("sendMessage", (message) => {
    io.emit("message", message); // Broadcast message to all users
  });

  // Notify when a user disconnects
  socket.on("disconnect", () => {
    if (socket.username) {
      socket.broadcast.emit("user-disconnected", socket.username); //namaste dunia
    }
  });
});

// Start the server
server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});