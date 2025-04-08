import React, { useState } from "react";

const ChatWindow = ({ currentUser, selectedUser }) => {
  const [messages, setMessages] = useState([
    { from: selectedUser, text: "Hello, how can I assist you today?" },
    { from: currentUser, text: "I'm looking for travel packages to Europe." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [...prev, { from: currentUser, text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Chatting with {selectedUser}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.from === currentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
                msg.from === currentUser
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input field */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
