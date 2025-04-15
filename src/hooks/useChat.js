import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

const SOCKET_URL = "http://localhost:8080/chat";

const useChat = (userEmail, onMessageReceive) => {
  const stompClient = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    console.log("🔌 Opening Web Socket...");

    const socket = new SockJS(SOCKET_URL);
    const client = over(socket);
    stompClient.current = client;

    client.connect(
      {},
      () => {
        console.log("✅ WebSocket Connected");
        setConnected(true);

        client.subscribe(`/user/${userEmail}/queue/messages`, (message) => {
          const payload = JSON.parse(message.body);
          onMessageReceive(payload);
        });
      },
      (error) => {
        console.error("❌ WebSocket connection failed:", error);
        setConnected(false);
      }
    );

    return () => {
      if (client.connected) {
        client.disconnect(() => {
          console.log("🔌 WebSocket disconnected.");
        });
      }
    };
  }, [userEmail, onMessageReceive]);

  const sendMessage = (msg) => {
    if (
      !stompClient.current ||
      stompClient.current.ws.readyState !== WebSocket.OPEN
    ) {
      console.warn("🚫 WebSocket is not connected. Message not sent.");
      return;
    }

    try {
      stompClient.current.send("/app/chat.private", {}, JSON.stringify(msg));
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  return { sendMessage, connected };
};

export default useChat;
