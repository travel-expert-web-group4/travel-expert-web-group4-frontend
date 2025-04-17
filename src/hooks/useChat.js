import { useEffect, useRef, useState } from "react";
import Stomp from "stompjs";

const SOCKET_URL = "ws://localhost:8080/chat/websocket";

const useChat = (userEmail, onMessageReceive) => {
  const stompClient = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    console.log("🌐 Connecting to WebSocket:", SOCKET_URL);

    const socket = new WebSocket(SOCKET_URL); // Or SockJS if using fallback
    const client = Stomp.over(socket);
    stompClient.current = client;

    // ✅ Send userId as part of STOMP headers
    client.connect(
      { userId: userEmail }, // this is critical!
      () => {
        console.log("✅ WebSocket connected as:", userEmail);
        setConnected(true);

        // ✅ Subscribe to personal message queue
        client.subscribe(`/user/queue/messages`, (message) => {
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
