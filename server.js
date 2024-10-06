// server.js
var express = require('express'); // Import express
var app = express(); // Create an instance of express
var http = require('http').Server(app); // Create HTTP server

// Serve static files from the "www" directory
app.use(express.static(__dirname + '/www'));

// Define a route for the root URL
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/www/index.html'); // Serve index.html file
});

// Start the server
let server = http.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("My First Nodejs Server!");
    console.log("Server listening on: " + host + " port: " + port);
});