import React from "react";
import ChatDashboard from "../components/ChatDashboard";
import { useAuth } from "../contexts/AuthContext";

const ChatPage = () => {
  const { user } = useAuth();

  if (!user?.email) {
    return (
      <div className="mt-20 text-center text-red-600">
        You must be logged in to access chat.
      </div>
    );
  }

  return (
    <div className="pt-20 px-4">
      <ChatDashboard user={user} />
    </div>
  );
};

export default ChatPage;
