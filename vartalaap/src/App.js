import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";
import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import NewUser from "./components/NewUser";
import Chat from "./components/Chat";
import "./App.css";

const socket = io("http://localhost:4000");

function App() {
  const [newUser, setNewUser] = useState("");
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (newMessage) => {
      
      if(newMessage.user!==user){
        console.log(messages);
        
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
     
    });

    socket.on("user-connected", (username) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "System", text: `${username} has joined the chat.` },
      ]);
    });

    socket.on("user-disconnected", (username) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "System", text: `${username} has left the chat.` },
      ]);
    });

    return () => {
      socket.off("message");
      socket.off("user-connected");
      socket.off("user-disconnected");
    };
  }, []);

  function handleChange(event) {
    setNewUser(event.target.value);
  }

  function logNewUser(event) {
    event.preventDefault();
    if (newUser.trim() !== "") {
      setUser(newUser);
      socket.emit("newUser", newUser);
      setNewUser("");
    }
  }

  function handleMessageChange(event) {
    setMessage(event.target.value);
  }

  function handleSendMessage(event) {
    event.preventDefault();
    if (message.trim() !== "") {
      const newMessage = { user, text: message };
      socket.emit("sendMessage", newMessage);
      // setMessages([...messages, newMessage]); //corrected this problem 
      
      setMessage("");
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && message.trim() !== "") {
      handleSendMessage(event);
    }
  }

  return (
    <main className="content bg-dark text-white min-vh-100">
      <div className="container mt-3">
        {user ? (
          <Chat
            user={user}
            message={message}
            messages={messages}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            handleKeyPress={handleKeyPress}
            handleMessageChange={handleMessageChange}
          />
        ) : (
          <NewUser
            newUser={newUser}
            onChange={handleChange}
            onSubmit={logNewUser}
          />
        )}
      </div>
    </main>
  );
}

export default App;
