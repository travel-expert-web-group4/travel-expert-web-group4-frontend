// import React, { useState, useEffect } from "react";
// import "../styles/ChatWidget.css";

// const ChatWidget = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   // 🔁 Load messages from localStorage when component mounts
//   useEffect(() => {
//     const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [
//       { sender: "bot", text: "Hi there! How can we help you today?" }
//     ];
//     setMessages(savedMessages);
//   }, []);

//   // 💾 Save messages to localStorage on change
//   useEffect(() => {
//     localStorage.setItem("chatMessages", JSON.stringify(messages));
//   }, [messages]);

//   const toggleChat = () => setIsOpen(!isOpen);

//   const clearChat = () => {
//     const defaultMessage = [
//         {
//           sender: "bot",
//           text: "Hi there! How can we help you today?",
//           time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//         }
//       ];
      
//     setMessages(defaultMessage);
//     localStorage.removeItem("chatMessages");
//   };
  

//   const handleSend = () => {
//     if (input.trim() === "") return;

//     const now = new Date();
//     const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
//     const userMsg = {
//         sender: "user",
//         senderName: "You",
//         text: input,
//         time: timestamp
//       };
      
//       const botReply = {
//         sender: "bot",
//         senderName: "Travel Agent",
//         text: "Thanks! A travel agent will get back to you shortly.",
//         time: timestamp
//       };
      
    

//     setMessages([...messages, userMsg, botReply]);
//     setInput("");
//   };

//   return (
//     <div className="chat-widget">
//       <button className="chat-toggle" onClick={toggleChat}>
//         💬
//       </button>

//       {isOpen && (
//         <div className="chat-box">
//           <div className="chat-header">
//   <span>Chat with Us</span>
//   <div>
//     <button onClick={clearChat} title="Clear Chat" style={{ marginRight: "0.5rem", background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
//       🗑
//     </button>
//     <button onClick={toggleChat} title="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
//       ✖
//     </button>
//   </div>
// </div>


// <div className="chat-messages">
//   {messages.map((msg, i) => (
//     <div key={i} className={`chat-msg-wrapper ${msg.sender}`}>
//       {msg.sender === "bot" && (
//         <div className="chat-avatar">🧑‍💼</div>
//       )}
//       <div className={`chat-msg ${msg.sender}`}>
//         <div className="chat-sender">
//           {msg.sender === "bot" ? "Travel Agent" : "You"}
//         </div>
//         <div>{msg.text}</div>
//         <div className="chat-time">{msg.time}</div>
//       </div>
//     </div>
//   ))}
// </div>



//           <div className="chat-input">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type your message..."
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             />
//             <button onClick={handleSend}>Send</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatWidget;




import React, { useEffect, useState } from "react";
import { getInteractions } from "../api/chat"; // we'll create this next
import { useAuth } from "../contexts/AuthContext";
import { FaComments } from "react-icons/fa";
import ChatBox from "./ChatBox"; // to be built in Step 3

const ChatWidget = () => {
  const { user, token } = useAuth();
  const [interactions, setInteractions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    console.log("🔍 Auth user object:", user); 
    if (user?.sub) {
      getInteractions(user.sub, token)
        .then(data => setInteractions(data))
        .catch(err => console.error("Error loading chat interactions:", err));
    }
  }, [user]);

  const handleOpenChat = (contact) => {
    setSelectedContact(contact);
    setOpen(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating button */}
      <button
        className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700"
        onClick={() => setOpen(!open)}
      >
        <FaComments size={24} />
      </button>

      {/* Mini interaction list dropdown */}
      {open && !selectedContact && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-xl p-4 max-h-[400px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Recent Chats</h2>
          {interactions.length === 0 ? (
  <div>
    <p className="text-sm text-gray-500">No recent chats</p>
    <button
      className="text-blue-600 underline mt-2"
      onClick={async () => {
        const res = await fetch(
          `http://localhost:8080/api/chat/contacts?userId=${user?.customerId}&role=customer`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        
        const contacts = await res.json();
        if (contacts.length > 0) {
          setSelectedContact(contacts[0]); // open first contact (agent)
          setOpen(true);
        } else {
          alert("No agent assigned!");
        }
      }}
    >
      Start a chat with your agent
    </button>
  </div>
) : (
  interactions.map((item, index) => (
    <div key={index} onClick={() => handleOpenChat(item)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
      <img src={item.profile || "/avatar-default.png"} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-gray-600 truncate max-w-[200px]">{item.lastMessage}</p>
      </div>
    </div>
  ))
)}

          {interactions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleOpenChat(item)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={item.profile || "/avatar-default.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600 truncate max-w-[200px]">{item.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Chat Box (to build next) */}
      {selectedContact && (
        <ChatBox
          contact={selectedContact}
          onClose={() => {
            setSelectedContact(null);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatWidget;
