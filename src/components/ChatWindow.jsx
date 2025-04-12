import React, { useEffect, useState, useRef } from 'react';
import { connectWebSocket, disconnectWebSocket, sendPrivateMessage } from '../api/chatService';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080'; // Update if deployed

const ChatWindow = ({ user, recipient }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const chatEndRef = useRef(null);

  const userId = user?.email; // assuming user object contains email
  const recipientId = recipient?.userEmail;

  // 🔄 Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🌐 Fetch chat history on load
  useEffect(() => {
    if (!userId || !recipientId) return;

    axios.get(`${BACKEND_URL}/api/chat/history/${userId}/${recipientId}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error('Error loading chat history:', err));
  }, [userId, recipientId]);

  // 📡 Connect to WebSocket
  useEffect(() => {
    if (!userId) return;

    connectWebSocket(userId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => {
      disconnectWebSocket();
    };
  }, [userId]);

  const handleSend = () => {
    if (messageContent.trim() === '') return;

    const newMsg = {
      senderId: userId,
      recipientId,
      content: messageContent
    };

    sendPrivateMessage(newMsg);
    setMessages(prev => [...prev, { ...newMsg, timestamp: new Date() }]);
    setMessageContent('');
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-md bg-white h-[500px] flex flex-col">
      <div className="font-bold text-lg mb-2">
        Chat with {recipient?.name || recipientId}
      </div>

      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-1 flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-lg ${msg.senderId === userId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Type a message..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
