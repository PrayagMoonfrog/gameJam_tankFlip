const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8090 }); // Replace 8080 with the desired port number

// Store connected clients (optional, for broadcasting messages)
const clients = new Set();

// WebSocket server event listeners
wss.on('connection', (ws) => {
  console.log('New client connected',ws);

  // Add the connected client to the clients Set
  clients.add(ws);

  // WebSocket message event listener
  ws.on('message', (message) => {
    const msg = message.toString("utf-8")
    console.log('Received message:', msg);

    // Broadcast the received message to all connected clients (optional)
    for (const client of clients) {
        // if (client.readyState === WebSocket.OPEN) {
        //     client.send(msg);
        //   }
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  });

  // WebSocket close event listener
  ws.on('close', () => {
    console.log('Client disconnected');

    // Remove the disconnected client from the clients Set
    clients.delete(ws);
  });
});

console.log('WebSocket server started on port 9091'); // Replace 8080 with the chosen port number
