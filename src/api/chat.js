// src/api/chat.js
export const getInteractions = async (email, token) => {
    const res = await fetch(`http://localhost:8080/api/chat/interactions?userId=${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch interactions");
    return await res.json();
  };
  export const getChatHistory = async (user1, user2, token) => {
    const res = await fetch(`http://localhost:8080/api/chat/history/${user1}/${user2}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch chat history");
    return await res.json();
  };
    