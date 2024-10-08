import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

const SERVER_URL = 'https://localhost:3000'; 

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket: any;

  constructor() {
    this.socket = io(SERVER_URL, {
      withCredentials: true,  // Use credentials if needed
      transports: ['websocket']  // Force WebSocket transport
    });
  }

  // Emit the peer ID to the server
  peerID(message: string) {
    this.socket.emit('peerID', message);
  }

  // Receive peer ID from the server
  getPeerID() {
    return new Observable((observer) => {
      this.socket.on('peerID', (data: string) => {
        observer.next(data);
      });
    });
  }

  // Send chat message
  sendMessage(message: any) {
    this.socket.emit('message', message);
  }

  // Listen for incoming chat messages
  receiveMessages() {
    return new Observable((observer) => {
      this.socket.on('message', (data: any) => {
        observer.next(data);
      });
    });
  }
}
