// server/services/websocketService.js
import { WebSocketServer } from 'ws';

// Function to send a prompt to the ComfyUI WebSocket server
export function sendPromptToComfyUI(prompt, negativePrompt = '', callback) {
  const ws = new WebSocket('ws://localhost:8188');  // Adjust this to match your ComfyUI WebSocket endpoint

  ws.on('open', function open() {
    console.log('Connected to ComfyUI WebSocket');
    
    // Send the prompt to the CLIPTextEncode node via WebSocket
    const message = JSON.stringify({
      node_type: 'CLIPTextEncode',
      parameters: {
        prompt: prompt,
        negative_prompt: negativePrompt
      }
    });

    ws.send(message);
  });

  ws.on('message', function incoming(data) {
    console.log('Response from ComfyUI:', data);
    if (callback) {
      callback(null, data);  // Call the callback with the received data
    }
  });

  ws.on('error', function error(error) {
    console.error('WebSocket Error:', error);
    if (callback) {
      callback(error, null);  // Call the callback with the error
    }
  });

  ws.on('close', function close() {
    console.log('Connection to ComfyUI WebSocket closed');
  });
}

export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
      console.log('Received message:', message);
      // Handle incoming messages here
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });
};
