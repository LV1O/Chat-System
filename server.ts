import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express, { Request, Response, NextFunction } from 'express'; // Importing Express types
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import cors from 'cors';
import AppServerModule from './src/main.server';
import fs from 'fs'; // For JSON file operations
import { MongoClient, Db, Collection, WithId, Document } from 'mongodb'; // MongoDB types

// MongoDB connection setup
const url = 'mongodb://localhost:27017';
const dbName = 'chatAppDB';
let db: Db;
let channelsCollection: Collection<Document>;

// Connect to MongoDB using a Promise
MongoClient.connect(url)
  .then((client: MongoClient) => {
    db = client.db(dbName);
    channelsCollection = db.collection('channels');
  })
  .catch((err: Error) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Paths for JSON file storage of users and groups
const usersFilePath = './data/users.json';
const groupsFilePath = './data/groups.json';

// JSON File Operations: Reading/Writing Users and Groups
interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  groups: string[];
}

interface Group {
  name: string;
  admin: string;
}

function getUsers(): User[] {
  return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8')) as User[];
}

function saveUsers(users: User[]): void {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

function getGroups(): Group[] {
  return JSON.parse(fs.readFileSync(groupsFilePath, 'utf-8')) as Group[];
}

function saveGroups(groups: Group[]): void {
  fs.writeFileSync(groupsFilePath, JSON.stringify(groups, null, 2));
}

// Channel Interface
interface Channel {
  name: string;
  groupId: string;
}

// Get Channels and map the result to the Channel interface
function getChannels(): Promise<Channel[]> {
  return channelsCollection
    .find({})
    .toArray()
    .then((channels: WithId<Document>[]) =>
      channels.map((channel) => ({
        name: channel['name'] as string,       // Accessing properties using bracket notation
        groupId: channel['groupId'] as string  // Accessing properties using bracket notation
      }))
    );
}

// Save a Channel
function saveChannel(channel: Channel): Promise<void> {
  return channelsCollection.insertOne(channel).then(() => {});
}

// Helper Function to Get User by ID
function getUserById(userId: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.id === userId);
}

// The Express app is exported so that it can be used by serverless functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  server.use(cors());
  server.use(express.json()); // To parse JSON request bodies

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // API: Promote a User to Group Admin (Super Admin Only)
  server.post('/promoteToAdmin', (req: Request, res: Response) => {
    const { superAdminId, userId } = req.body;
    const superAdmin = getUserById(superAdminId);
    const user = getUserById(userId);

    if (superAdmin && superAdmin.roles.includes('superAdmin')) {
      if (user) {
        user.roles.push('groupAdmin');
        saveUsers(getUsers());  // Save updated users
        res.send(`User ${user.username} promoted to Group Admin`);
      } else {
        res.status(404).send('User not found');
      }
    } else {
      res.status(403).send('Only Super Admin can promote users to Group Admin');
    }
  });

  // API: Create Group (Group Admin Only)
  server.post('/createGroup', (req: Request, res: Response) => {
    const { groupAdminId, groupName } = req.body;
    const groupAdmin = getUserById(groupAdminId);

    if (groupAdmin && groupAdmin.roles.includes('groupAdmin')) {
      const groups = getGroups();
      groups.push({ name: groupName, admin: groupAdminId });
      saveGroups(groups);
      res.send(`Group ${groupName} created by ${groupAdmin.username}`);
    } else {
      res.status(403).send('Only Group Admin can create groups');
    }
  });

  // API: Remove User from Group (Group Admin Only)
  server.post('/removeUserFromGroup', (req: Request, res: Response) => {
    const { groupAdminId, groupId, userId } = req.body;
    const groupAdmin = getUserById(groupAdminId);
    const user = getUserById(userId);

    if (groupAdmin && groupAdmin.roles.includes('groupAdmin') && groupAdmin.groups.includes(groupId)) {
      if (user) {
        user.groups = user.groups.filter(g => g !== groupId);
        saveUsers(getUsers());  // Save updated users
        res.send(`User ${user.username} removed from group ${groupId}`);
      } else {
        res.status(404).send('User not found');
      }
    } else {
      res.status(403).send('Only Group Admin can remove users from their groups');
    }
  });

  // API: Super Admin Removes Any User
  server.post('/removeUser', (req: Request, res: Response) => {
    const { superAdminId, userId } = req.body;
    const superAdmin = getUserById(superAdminId);

    if (superAdmin && superAdmin.roles.includes('superAdmin')) {
      const users = getUsers().filter(user => user.id !== userId);
      saveUsers(users);  // Save after removal
      res.send(`User ${userId} removed by Super Admin`);
    } else {
      res.status(403).send('Only Super Admin can remove users');
    }
  });

  // API: Chat User Joins Group
  server.post('/joinGroup', (req: Request, res: Response) => {
    const { userId, groupId } = req.body;
    const user = getUserById(userId);

    if (user && !user.groups.includes(groupId)) {
      user.groups.push(groupId);
      saveUsers(getUsers());  // Save updated users
      res.send(`User ${user.username} joined group ${groupId}`);
    } else {
      res.status(400).send('User is already a member of this group or not found');
    }
  });

  // API: Super Admin Access to All Groups
  server.get('/allGroups', (req: Request, res: Response) => {
    const { superAdminId } = req.body;
    const superAdmin = getUserById(superAdminId);

    if (superAdmin && superAdmin.roles.includes('superAdmin')) {
      const groups = getGroups();  // Get all groups
      res.send(groups);
    } else {
      res.status(403).send('Only Super Admin can access all groups');
    }
  });

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req: Request, res: Response, next: NextFunction) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
