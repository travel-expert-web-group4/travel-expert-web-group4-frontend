import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (userId, onMessageReceived) => {
  const socket = new SockJS("http://localhost:8080/chat");
  // const socket = new SockJS("/chat");

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => console.log(str),
    onConnect: () => {
      console.log("✅ STOMP connected");
      console.log("✅ Connected to WebSocket");
      stompClient.subscribe(`/user/queue/messages`, (msg) => {
        const body = JSON.parse(msg.body);
        console.log("📩 Received via WS:", body);
        onMessageReceived(body);
      });
    },
  });

  stompClient.activate();
};

export const sendMessage = (msg) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.private", // 👈 matches @MessageMapping("/chat.private")
      body: JSON.stringify(msg),
    });
    console.log("📤 Sent via WS:", msg);
  } else {
    console.warn("❌ WebSocket is not connected");
  }
};
