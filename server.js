const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const { MongoClient, ObjectId } = require('mongodb'); // Import ObjectId for message deletion
const { PeerServer } = require('peer');
const path = require('path');

// MongoDB connection
const mongoUrl = 'mongodb://localhost:27017';
const client = new MongoClient(mongoUrl);
let db;

const sslOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const PORT0 = 3000;  // For HTTPS and Socket.IO
const PORT1 = 3001;  // For PeerJS

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

client.connect().then(() => {
  console.log('Connected to MongoDB');
  db = client.db('chat-app-db');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Serve static images
app.use('/images', express.static(path.join(__dirname, './images')));

// Route to fetch messages for a specific group
app.get('/messages/:groupId', async (req, res) => {
  const { groupId } = req.params;
  console.log(`Fetching messages for group: ${groupId}`);

  try {
    const messages = await db.collection('messages').find({ groupId }).toArray();
    if (messages.length > 0) {
      console.log(`Messages retrieved for group ${groupId}:`, messages);
      res.status(200).json(messages);
    } else {
      console.log(`No messages found for group: ${groupId}`);
      res.status(404).send('No messages found for this group');
    }
  } catch (err) {
    console.error('Error fetching messages from MongoDB:', err);
    res.status(500).send('Error retrieving messages');
  }
});

// Route to delete a specific message by its ID
app.delete('/messages/:messageId', async (req, res) => {
  const { messageId } = req.params;
  console.log(`Deleting message with ID: ${messageId}`);

  try {
    const result = await db.collection('messages').deleteOne({ _id: new ObjectId(messageId) });

    if (result.deletedCount === 1) {
      console.log(`Message with ID ${messageId} deleted.`);
      res.status(200).json({ message: 'Message deleted successfully' });  // Return JSON instead of plain text
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ message: 'Error deleting message' });
  }
});


const httpsServer = https.createServer(sslOptions, app);

const io = new Server(httpsServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.emit('userid', socket.id);

  socket.on('userJoined', (data) => {
    console.log(`User ${data.username} joined group ${data.group}`);
    socket.broadcast.emit('userJoined', data);
  });

  socket.on('message', async (msg) => {
    console.log(`Message received: ${msg}`);

    try {
      const messagesCollection = db.collection('messages');
      const result = await messagesCollection.insertOne({
        groupId: msg.groupId,
        sender: msg.sender,
        messageContent: msg.messageContent,
        timestamp: msg.timestamp,
        imageUrl: msg.imageUrl || null
      });

      console.log('Message saved to MongoDB:', result.ops[0]);

      // Emit the message to all clients, including the sender
      io.emit('message', msg);  // This ensures all clients get the message in real-time
    } catch (err) {
      console.error('Error saving message to MongoDB:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


// Start the HTTPS server
httpsServer.listen(PORT0, () => {
  console.log(`Server running on https://localhost:${PORT0}`);
});

// Start PeerJS server for video call connections
PeerServer({ port: PORT1, path: '/', ssl: sslOptions }).listen(PORT1, 'localhost', () => {
  console.log(`PeerJS server running on https://localhost:${PORT1}`);
});
