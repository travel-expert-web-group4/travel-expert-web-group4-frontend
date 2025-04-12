// src/services/socketService.js
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

/**
 * Connects the current user to WebSocket and sets up listener for messages.
 * @param {string} userId - Typically the email or unique user ID.
 * @param {function} onMessageReceived - Callback when message arrives.
 */
export const connectWebSocket = (userId, onMessageReceived) => {
  // ✅ Let Vite proxy /chat to http://localhost:8080/chat
  const socket = new SockJS("/chat");

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000, // Automatically retry on disconnect
    debug: (str) => console.log(`[STOMP DEBUG]: ${str}`),

    onConnect: () => {
      console.log("✅ WebSocket connected (STOMP)");

      // ✅ Subscribe to private queue for this user
      stompClient.subscribe("/user/queue/messages", (msg) => {
        const body = JSON.parse(msg.body);
        console.log("📩 Incoming message:", body);
        onMessageReceived(body);
      });
    },

    onStompError: (frame) => {
      console.error("❌ STOMP Error:", frame.headers["message"]);
      console.error("Details:", frame.body);
    },
  });

  stompClient.activate();
};

/**
 * Sends a message using STOMP if the connection is active.
 * @param {Object} msg - Message object to send.
 */
export const sendMessage = (msg) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.private", // matches @MessageMapping
      body: JSON.stringify(msg),
    });
    console.log("📤 Message sent:", msg);
  } else {
    console.warn("❌ STOMP client is not connected");
  }
};
