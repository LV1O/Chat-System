const fs = require('fs');              // File system module to read the SSL files
const https = require('https');        // HTTPS module to create a secure server
const express = require('express');    // Express for handling HTTP requests
const cors = require('cors');          // CORS for handling cross-origin requests
const { Server } = require('socket.io'); // Socket.IO for real-time communication
const { PeerServer } = require('peer');  // PeerJS server for video calls

// SSL options - paths to the SSL certificate and private key files
const sslOptions = {
  key: fs.readFileSync('key.pem'),     // Private key
  cert: fs.readFileSync('cert.pem')    // SSL certificate
};

// Define ports for the HTTPS and PeerJS servers
const PORT0 = 3000;  // HTTPS server for Socket.IO
const PORT1 = 3001;  // PeerJS server for handling video calls

// Initialize Express app
const app = express();
app.use(cors());  // Allow CORS for cross-origin requests

// Create HTTPS server using SSL options
const httpsServer = https.createServer(sslOptions, app);

// Initialize Socket.IO on the HTTPS server
const io = new Server(httpsServer, {
  cors: {
    origin: "http://localhost:4200",  // Allow requests from Angular frontend
    methods: ["GET", "POST"],  // Allow GET and POST requests
  }
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Emit peerID when a user connects
  socket.emit('userid', socket.id);

  // Handle peerID events and broadcast them to other users
  socket.on('peerID', (peerID) => {
    io.emit('peerID', peerID);
    console.log(`Peer ID: ${peerID}`);
  });

  // Handle chat messages and broadcast to other users
  socket.on('message', (msg) => {
    io.emit('message', msg);
    console.log(`Message received: ${msg}`);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the HTTPS server and bind it to localhost
httpsServer.listen(PORT0, 'localhost', () => {
  console.log(`HTTPS server running on https://localhost:${PORT0}`);
});

// Start PeerJS server to handle video call connections
PeerServer({ port: PORT1, path: '/', ssl: sslOptions }).listen(PORT1, 'localhost', () => {
  console.log(`PeerJS server running on https://localhost:${PORT1}`);
});
