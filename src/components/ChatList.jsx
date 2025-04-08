import React from "react";

const ChatList = ({ userId, onSelectUser }) => {
  // For now, let's simulate some dummy users
  const dummyUsers = [
    { name: "Agent Smith", email: "agent.smith@example.com" },
    { name: "Travel Support", email: "support@example.com" },
    { name: "Vacation Specialist", email: "specialist@example.com" },
  ];

  return (
    <div className="h-full overflow-y-auto">
      {dummyUsers.map((user) => (
        <div
          key={user.email}
          onClick={() => onSelectUser(user.email)}
          className="cursor-pointer px-4 py-3 hover:bg-gray-100 border-b transition duration-150 ease-in-out"
        >
          <div className="text-gray-800 font-medium">{user.name}</div>
          <div className="text-sm text-gray-500 truncate">{user.email}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
