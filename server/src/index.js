const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(cors());

// When a user connects
io.on("connection", (socket) => {
  
  
  socket.on("newUser ", (username) => {
    socket.username = username; // Store the username in socket object
    socket.broadcast.emit("user-connected", username); // Emit to everyone except the sender
  console.log(username + ' connected')
  });


  // Handle incoming messages
  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

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