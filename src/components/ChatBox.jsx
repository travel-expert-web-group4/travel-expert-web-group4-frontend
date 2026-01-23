// import React, { useEffect, useRef, useState } from "react";
// import { getChatHistory } from "../api/chat";
// import { useAuth } from "../contexts/AuthContext";
// import useChat from "../hooks/useChat";
// import { FaTimes } from "react-icons/fa";

// const ChatBox = ({ contact, onClose }) => {
//   const { user, token } = useAuth();
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const messagesEndRef = useRef(null);

//   // ✅ Sender is the logged-in user
//   const senderId = user?.sub;

//   // ✅ Recipient is the agent’s email passed from contact
//   const recipientId = contact?.email;

//   // ✅ Warn if recipient is not available
//   useEffect(() => {
//     if (!recipientId) {
//       console.warn("❌ ChatBox: recipientId (contact.email) is missing!", contact);
//     }
//   }, [recipientId, contact]);

//   // ✅ WebSocket connection with callback
//   const { sendMessage, connected } = useChat(senderId, (incomingMessage) => {
//     if (
//       [incomingMessage.senderId, incomingMessage.recipientId].includes(senderId) &&
//       [incomingMessage.senderId, incomingMessage.recipientId].includes(recipientId)
//     ) {
//       setMessages((prev) => [...prev, incomingMessage]);
//     }
//   });

//   // ✅ Load message history from API
//   useEffect(() => {
//     if (senderId && recipientId) {
//       getChatHistory(senderId, recipientId, token)
//         .then((history) => setMessages(history || []))
//         .catch(console.error);
//     }
//   }, [senderId, recipientId, token]);

//   // ✅ Auto-scroll to bottom on new message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = () => {
//     if (!text.trim()) return;

//     if (!recipientId) {
//       console.error("❌ Cannot send message — recipientId is missing!", contact);
//       return;
//     }

//     const newMsg = {
//       senderEmail: senderId,
//       recipientEmail: recipientId,
//       senderId: senderId,
//       recipientId: recipientId,
//       content: text,
//     };

//     console.log("📤 Sending message:", newMsg);
//     sendMessage(newMsg);

//     setMessages((prev) => [
//       ...prev,
//       { ...newMsg, timestamp: new Date().toISOString() },
//     ]);

//     setText("");
//   };

//   return (
//     <div className="fixed bottom-6 right-6 bg-white shadow-2xl rounded-lg w-96 max-h-[600px] flex flex-col z-50">
//       {/* 🔷 Header */}
//       <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-2 rounded-t-lg">
//         <div className="flex items-center gap-2">
//           <img
//             src={contact.profile || "/avatar-default.png"}
//             alt="profile"
//             className="w-8 h-8 rounded-full object-cover"
//           />
//           <span className="font-semibold">{contact.name || "Unknown"}</span>
//         </div>
//         <button onClick={onClose}>
//           <FaTimes />
//         </button>
//       </div>

//       {/* 🔷 Messages */}
//       <div className="flex-1 p-3 overflow-y-auto space-y-2">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`max-w-[75%] p-2 px-3 rounded-lg text-sm ${
//               msg.senderId === senderId
//                 ? "bg-blue-500 text-white ml-auto"
//                 : "bg-gray-200 text-gray-900"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* 🔷 Input */}
//       <div className="flex items-center gap-2 border-t px-3 py-2">
//         <input
//           type="text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           placeholder={connected ? "Type a message..." : "Connecting..."}
//           disabled={!connected}
//           className="flex-1 text-sm border rounded-full px-3 py-1 focus:outline-none disabled:opacity-50"
//         />
//         <button
//           onClick={handleSend}
//           disabled={!connected}
//           className={`text-sm px-3 py-1 rounded-full ${
//             connected
//               ? "bg-blue-600 text-white hover:bg-blue-700"
//               : "bg-gray-400 text-white cursor-not-allowed"
//           }`}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;


import React, { useEffect, useRef, useState } from "react";
import { getChatHistory } from "../api/chat";
import { useAuth } from "../contexts/AuthContext";
import useChat from "../hooks/useChat";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ChatBox = ({ contact, onClose }) => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const senderId = user?.sub;
  const recipientId = contact?.email;

  useEffect(() => {
    if (!recipientId) {
      console.warn("❌ ChatBox: recipientId (contact.email) is missing!", contact);
    }
  }, [recipientId, contact]);

  const { sendMessage, connected } = useChat(senderId, (incomingMessage) => {
    if (
      [incomingMessage.senderId, incomingMessage.recipientId].includes(senderId) &&
      [incomingMessage.senderId, incomingMessage.recipientId].includes(recipientId)
    ) {
      if (incomingMessage.content === "__typing__") {
        showTypingIndicator();
        return;
      }

      setMessages((prev) => [...prev, incomingMessage]);
    }
  });

  useEffect(() => {
    if (senderId && recipientId) {
      getChatHistory(senderId, recipientId, token)
        .then((history) => setMessages(history || []))
        .catch(console.error);
    }
  }, [senderId, recipientId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showTypingIndicator = () => {
    setTyping(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setTyping(false), 1500);
  };

  const handleSend = () => {
    if (!text.trim() || !recipientId) return;

    const newMsg = {
      senderEmail: senderId,
      recipientEmail: recipientId,
      senderId: senderId,
      recipientId: recipientId,
      content: text,
    };

    sendMessage(newMsg);

    setMessages((prev) => [
      ...prev,
      { ...newMsg, timestamp: new Date().toISOString() },
    ]);

    setText("");
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setText(value);

    sendMessage({
      senderId,
      recipientId,
      content: "__typing__",
    });
  };

  return (
    <div className="fixed bottom-6 right-3 sm:right-6 w-[95%] sm:w-96 bg-white shadow-2xl rounded-lg max-h-[80vh] flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-2 rounded-t-lg">
        <div className="flex items-center gap-2">
          <img
            src={contact.profile || "/avatar-default.png"}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold">{contact.name || "Unknown"}</span>
        </div>
        <button onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0 }}
              className={`flex flex-col max-w-[75%] p-2 px-3 rounded-lg text-sm ${
                msg.senderId === senderId
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <span>{msg.content}</span>
              {msg.timestamp && (
                <span className="text-[10px] text-gray-400 mt-1 self-end">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <div className="text-xs text-gray-400 animate-pulse ml-1">Typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t px-3 py-2">
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={connected ? "Type a message..." : "Connecting..."}
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
