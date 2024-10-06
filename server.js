// server.js
var express = require('express'); // Import express
var cors = require('cors'); // Import CORS package
var http = require('http'); // Import http module
var { Server } = require('socket.io'); // Import Socket.io

var app = express(); // Create an instance of express
var server = http.createServer(app); // Create HTTP server with Express
var io = new Server(server, { // Initialize Socket.io with server
    cors: {
        origin: "http://localhost:4200", // Allow Angular app to connect
        methods: ["GET", "POST"],
    }
});

// Use CORS middleware to allow all origins
app.use(cors());

// Serve static files from the "www" directory
app.use(express.static(__dirname + '/www'));

// Define a route for the root URL
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/www/index.html'); // Serve index.html file
});

// Sample API endpoint
app.get('/api/auth', function (req, res) {
    res.json({ message: 'Login check endpoint' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle incoming chat messages
    socket.on('chat message', (msg) => {
        console.log('Message received:', msg);
        // Emit message to all connected clients
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
let PORT = 3000;
server.listen(PORT, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("My First Nodejs Server!");
    console.log("Server listening on: " + host + " port: " + port);
});
