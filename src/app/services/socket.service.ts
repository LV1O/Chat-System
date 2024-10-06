import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private SERVER_URL = 'http://localhost:4000';  // Your backend server URL

  constructor() {
    // Connect to Socket.IO server
    this.socket = io(this.SERVER_URL);
  }

  // Send a message to the server
  sendMessage(message: { groupId: string, messageContent: string, sender: string }) {
    this.socket.emit('message', message);
  }

  // Listen for messages from a specific group
  receiveMessages(groupId: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(`message-${groupId}`, (message) => {
        observer.next(message);
      });
    });
  }
}