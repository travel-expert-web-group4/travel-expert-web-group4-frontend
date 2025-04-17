import { useEffect, useRef, useState } from "react";
import Stomp from "stompjs"; // Still using STOMP protocol

const SOCKET_URL = "ws://localhost:8080/chat/websocket"; // Native WebSocket path

const useChat = (userEmail, onMessageReceive) => {
  const stompClient = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    console.log("🌐 Connecting to native WebSocket:", SOCKET_URL);

    // Create native WebSocket
    const socket = new WebSocket(SOCKET_URL);

    // Wrap with STOMP
    const client = Stomp.over(socket);
    stompClient.current = client;

    client.connect(
      {}, // No auth headers needed
      () => {
        console.log("✅ WebSocket connected");
        setConnected(true);

        // Subscribe to private queue for the user
        client.subscribe(`/user/${userEmail}/queue/messages`, (message) => {
          const payload = JSON.parse(message.body);
          console.log("📥 Received:", payload);
          onMessageReceive(payload);
        });
      },
      (error) => {
        console.error("❌ WebSocket connection error:", error);
        setConnected(false);
      }
    );

    return () => {
      if (client.connected) {
        client.disconnect(() => {
          console.log("🛑 WebSocket disconnected");
        });
      }
    };
  }, [userEmail, onMessageReceive]);

  const sendMessage = (msg) => {
    if (!stompClient.current || !stompClient.current.connected) {
      console.warn("🚫 Cannot send: WebSocket not connected");
      return;
    }

    stompClient.current.send("/app/chat.private", {}, JSON.stringify(msg));
  };

  return { sendMessage, connected };
};

export default useChat;
