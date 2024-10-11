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
      withCredentials: true,
      transports: ['websocket']
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

  receivePreviousMessages() {
    return new Observable((observer) => {
      this.socket.on('previousMessages', (data: any) => {
        observer.next(data);
      });
    });
  }

  // Upload image
  uploadImage(formData: FormData): Observable<any> {
    return new Observable((observer) => {
      this.socket.emit('uploadImage', formData, (response: any) => {
        observer.next(response);
      });
    });
  }

  // Upload profile image
  uploadProfileImage(formData: FormData): Observable<any> {
    return new Observable((observer) => {
      this.socket.emit('uploadProfileImage', formData, (response: any) => {
        observer.next(response);
      });
    });
  }
}

