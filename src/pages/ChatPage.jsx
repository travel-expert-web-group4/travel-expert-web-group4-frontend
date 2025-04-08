import React, { useState } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../contexts/AuthContext";

const ChatPage = () => {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);

  console.log("ChatPage user:", user);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Please log in to view your messages.
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100 shadow-inner rounded-lg overflow-hidden border border-gray-200 m-4">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b text-lg font-semibold text-gray-700 bg-gray-50">
          Chats
        </div>
        <ChatList userId={user.email} onSelectUser={setSelectedUser} />
      </aside>

      {/* Main Chat Window */}
      <main className="flex-1 p-6 overflow-y-auto bg-white">
        {selectedUser ? (
          <ChatWindow
            currentUser={user?.email || "customer1@example.com"}
            selectedUser={selectedUser}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xl">
            Select a conversation to start chatting
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
