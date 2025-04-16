import React, { useEffect, useRef, useState } from "react";
import { getChatHistory } from "../api/chat";
import { useAuth } from "../contexts/AuthContext";
import useChat from "../hooks/useChat";
import { FaTimes } from "react-icons/fa";

const ChatBox = ({ contact, onClose }) => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // ✅ Using userId or email — replace `sub` with `id` if needed
  const senderId = user?.id;
  const recipientId = contact?.id;
  const senderEmail =  user?.sub;
  const recipientEmail = contact?.email;

  // ✅ Setup WebSocket connection
  const { sendMessage, connected } = useChat(senderEmail, (incomingMessage) => {
    // Only add if it's from or to this contact
    if (
      [incomingMessage.senderEmail, incomingMessage.recipientEmail].includes(rec)
    ) {
      // setMessages((prev) => {
      //   const isDuplicate = prev.some(
      //     (msg) =>
      //       msg.timestamp === incomingMessage.timestamp &&
      //       msg.content === incomingMessage.content
      //   );
      //   return isDuplicate ? prev : [...prev, incomingMessage];
      // });
    }
  });

  // ✅ Load history once on mount
  useEffect(() => {
    if (senderEmail && recipientEmail) {
      getChatHistory(senderEmail, recipientEmail, token)
        .then((history) => {
          setMessages(history || []);
        })
        .catch(console.error);
    }
  }, [senderEmail, recipientEmail, token]);

  // ✅ Scroll to latest
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (text.trim() === "") return;

    const newMsg = {
      senderEmail,
      recipientEmail,
      content: text,
    };

    sendMessage(newMsg);
    setMessages((prev) => [
      ...prev,
      { ...newMsg, timestamp: new Date().toISOString() },
    ]);
    setText("");
  };

  return (
    <div className="fixed bottom-6 right-6 bg-white shadow-2xl rounded-lg w-96 max-h-[600px] flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-2 rounded-t-lg">
        <div className="flex items-center gap-2">
          <img
            src={contact.profile || "/avatar-default.png"}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold">{contact.name}</span>
        </div>
        <button onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] p-2 px-3 rounded-lg text-sm ${
              msg.senderId === senderEmail
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t px-3 py-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={connected ? "Type a message..." : "Connecting to chat..."}
          disabled={!connected}
          className="flex-1 text-sm border rounded-full px-3 py-1 focus:outline-none disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!connected}
          className={`text-sm px-3 py-1 rounded-full ${
            connected
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
