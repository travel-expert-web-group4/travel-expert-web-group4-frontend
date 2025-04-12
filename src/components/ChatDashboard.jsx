import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatWindow from './ChatWindow';

const BACKEND_URL = 'http://localhost:8080'; // Update as needed

const ChatDashboard = ({ user }) => {
  const [interactions, setInteractions] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    axios.get(`${BACKEND_URL}/api/chat/interactions`, {
      params: { userId: user.email }
    })
    .then(res => setInteractions(res.data))
    .catch(err => console.error('Error loading interactions:', err));
  }, [user]);

  return (
    <div className="flex gap-4 p-4">
      {/* Sidebar: Interactions list */}
      <div className="w-1/3 border-r pr-4">
        <h2 className="text-lg font-semibold mb-2">Recent Conversations</h2>
        <ul>
          {interactions.map((contact, idx) => (
            <li
              key={idx}
              className="cursor-pointer flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
              onClick={() => setSelectedContact(contact)}
            >
              <img
                src={contact.profilePicture || '/default-avatar.png'}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-gray-600 truncate">
                  {contact.lastMessage}
                </div>
              </div>
              {contact.isUserTheLastSender ? (
                <span className="text-xs text-green-600">✓</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1">
        {selectedContact ? (
          <ChatWindow user={user} recipient={selectedContact} />
        ) : (
          <div className="text-gray-500 text-center mt-20">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;
