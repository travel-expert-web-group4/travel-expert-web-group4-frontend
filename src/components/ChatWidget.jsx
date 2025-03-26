import React, { useState, useEffect } from "react";
import "../styles/ChatWidget.css";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 🔁 Load messages from localStorage when component mounts
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [
      { sender: "bot", text: "Hi there! How can we help you today?" }
    ];
    setMessages(savedMessages);
  }, []);

  // 💾 Save messages to localStorage on change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const clearChat = () => {
    const defaultMessage = [
        {
          sender: "bot",
          text: "Hi there! How can we help you today?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      
    setMessages(defaultMessage);
    localStorage.removeItem("chatMessages");
  };
  

  const handleSend = () => {
    if (input.trim() === "") return;

    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const userMsg = {
        sender: "user",
        senderName: "You",
        text: input,
        time: timestamp
      };
      
      const botReply = {
        sender: "bot",
        senderName: "Travel Agent",
        text: "Thanks! A travel agent will get back to you shortly.",
        time: timestamp
      };
      
    

    setMessages([...messages, userMsg, botReply]);
    setInput("");
  };

  return (
    <div className="chat-widget">
      <button className="chat-toggle" onClick={toggleChat}>
        💬
      </button>

      {isOpen && (
        <div className="chat-box">
          <div className="chat-header">
  <span>Chat with Us</span>
  <div>
    <button onClick={clearChat} title="Clear Chat" style={{ marginRight: "0.5rem", background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
      🗑
    </button>
    <button onClick={toggleChat} title="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
      ✖
    </button>
  </div>
</div>


<div className="chat-messages">
  {messages.map((msg, i) => (
    <div key={i} className={`chat-msg-wrapper ${msg.sender}`}>
      {msg.sender === "bot" && (
        <div className="chat-avatar">🧑‍💼</div>
      )}
      <div className={`chat-msg ${msg.sender}`}>
        <div className="chat-sender">
          {msg.sender === "bot" ? "Travel Agent" : "You"}
        </div>
        <div>{msg.text}</div>
        <div className="chat-time">{msg.time}</div>
      </div>
    </div>
  ))}
</div>



          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
