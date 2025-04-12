import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
let connected = false;

const SOCKET_URL = 'http://localhost:8080/chat'; // Adjust if deployed

// Message listeners (subscribers)
let messageCallback = null;

export const connectWebSocket = (userEmail, onMessageReceived) => {
  return new Promise((resolve, reject) => {
    const socket = new SockJS(SOCKET_URL);
    stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        connected = true;
        console.log('WebSocket connected!');
        messageCallback = onMessageReceived;

        // Subscribe to private messages
        stompClient.subscribe('/user/queue/messages', (message) => {
          if (messageCallback) {
            const msgBody = JSON.parse(message.body);
            messageCallback(msgBody);
          }
        });

        resolve();
      },
      onStompError: (frame) => {
        console.error('WebSocket error', frame);
        reject(frame);
      },
      debug: (str) => {
        console.log(str); // Optional: Comment this out in production
      }
    });

    stompClient.activate();
  });
};

export const disconnectWebSocket = () => {
  if (stompClient && connected) {
    stompClient.deactivate();
    console.log('WebSocket disconnected.');
  }
};

export const sendPrivateMessage = (messageObj) => {
  if (stompClient && connected) {
    stompClient.publish({
      destination: '/app/chat.private',
      body: JSON.stringify(messageObj)
    });
  }
};
