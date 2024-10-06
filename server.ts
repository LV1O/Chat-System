import express, { Request, Response, NextFunction } from 'express';
import { MongoClient, Db, Collection, Document } from 'mongodb';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import { AppServerModule } from './src/app/app.module.server';
import fs from 'fs';
import http from 'http';

// MongoDB connection setup
const url = 'mongodb://localhost:27017';
const dbName = 'chatAppDB';
let db: Db;
let channelsCollection: Collection<Document>;
let messagesCollection: Collection<Document>;

MongoClient.connect(url)
  .then((client: MongoClient) => {
    db = client.db(dbName);
    channelsCollection = db.collection('channels');
    messagesCollection = db.collection('messages');
    console.log('Connected to MongoDB');
  })
  .catch((err: Error) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Express setup
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  server.use(cors());
  server.use(express.json());

  // Set up Angular SSR engine
  const commonEngine = new CommonEngine();

  server.engine(
    'html',
    (filePath: string, options: any, callback) => {
      commonEngine
        .render({
          bootstrap: AppServerModule,
          documentFilePath: indexHtml,
          url: options.req.url,
          publicPath: browserDistFolder,
          providers: [{ provide: APP_BASE_HREF, useValue: options.req.baseUrl }],
        })
        .then((html: string) => callback(null, html))
        .catch(callback);
    }
  );

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // Universal route handler for server-side rendering
  server.get('*', (req: Request, res: Response, next: NextFunction) => {
    res.render(indexHtml, { req }, (err: Error | null, html: string) => {
      if (err) {
        return next(err);
      }
      res.send(html);
    });
  });

  // API: Join Group (Predefined or Created by Admin)
  server.post('/joinGroup', (req: Request, res: Response) => {
    const { groupId, userId, username } = req.body;

    // Find the group in MongoDB or create a new one if it's a new group
    channelsCollection.updateOne(
      { groupId },
      { $addToSet: { users: { userId, username } } },  // Add user if not already in group
      { upsert: true }  // Create the group if it doesn't exist
    )
    .then(() => res.send(`User ${username} joined ${groupId}`))
    .catch((err) => res.status(500).send(err.message));
  });

  // API: Create a New Group (Admin Only)
  server.post('/createGroup', (req: Request, res: Response) => {
    const { groupId, groupName, adminId } = req.body;

    // Check if the user is an admin (in your logic)
    const isAdmin = true;  // You should implement your admin check here

    if (isAdmin) {
      // Create the new group in the database
      channelsCollection.insertOne({
        groupId,
        groupName,
        adminId,
        users: []
      })
      .then(() => res.send(`Group ${groupName} created with ID ${groupId}`))
      .catch((err) => res.status(500).send(err.message));
    } else {
      res.status(403).send('Only admins can create groups.');
    }
  });

  return server;
}

// Socket.IO and HTTP Server integration
function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  const httpServer = http.createServer(server);

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected via Socket.IO');

    // Handle incoming messages for any group
    socket.on('message', (data: { groupId: string, messageContent: string, sender: string }) => {
      const { groupId, messageContent, sender } = data;

      // Save message to MongoDB
      const chatMessage = {
        groupId,
        messageContent,
        sender,
        timestamp: new Date(),
      };

      messagesCollection.insertOne(chatMessage)
        .then(() => {
          console.log('Message saved to MongoDB:', chatMessage);

          // Broadcast message to all users in the specified group
          io.emit(`message-${groupId}`, chatMessage);  // Emit to all users in this group
        })
        .catch((err) => {
          console.error('Error saving message to MongoDB:', err);
        });
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

run();
