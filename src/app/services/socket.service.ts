import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

const SERVER_URL = 'https://localhost:3000'; 

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket: any;
  private apiUrl = SERVER_URL;  // Backend URL for API calls

  constructor(private http: HttpClient) { 
    this.socket = io(SERVER_URL, {
      withCredentials: true,
      transports: ['websocket']
    });
  }

  // Emit the peer ID to the server
  peerID(peerId: string) {
    this.socket.emit('peerID', peerId);
  }

  // Receive peer ID from the server
  getPeerID(): Observable<string> {
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
  receiveMessages(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('message', (data: any) => {
        observer.next(data);
      });
    });
  }

  // Upload profile image via Socket.IO
  uploadProfileImage(formData: FormData): Observable<any> {
    return new Observable((observer) => {
      this.socket.emit('uploadProfileImage', formData, (response: any) => {
        observer.next(response);
      });
    });
  }

  // Emit when a user joins a group
  emitUserJoined(data: { username: string; group: string }) {
    this.socket.emit('userJoined', data);
  }

  // Listen for when other users join the group
  onUserJoined(): Observable<{ username: string; group: string }> {
    return new Observable((observer) => {
      this.socket.on('userJoined', (data: { username: string; group: string }) => {
        observer.next(data);
      });
    });
  }

  // Emit when a user leaves a group
  emitUserLeft(data: { username: string; group: string }) {
    this.socket.emit('userLeft', data);
  }

  // Listen for when other users leave the group
  onUserLeft(): Observable<{ username: string; group: string }> {
    return new Observable((observer) => {
      this.socket.on('userLeft', (data: { username: string; group: string }) => {
        observer.next(data);
      });
    });
  }

  // Fetch messages for a specific group from MongoDB via HTTP GET
  getMessages(groupId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages/${groupId}`);
  }

  // Delete a message from the database
  deleteMessage(messageId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/messages/${messageId}`);
  }
}

