import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import Peer from 'peerjs';

@Injectable({
  providedIn: 'root',
})
export class PeerService {
  public myPeerId = uuidv4();
  public myPeer: any;

  constructor() {
    // Initialize PeerJS connection with HTTPS and WebSocket (wss)
    this.myPeer = new Peer(this.myPeerId, {
      host: 'localhost',
      port: 3001,        // Use the port where your PeerJS server is running
      path: '/',         // Update path if needed, e.g., '/peerjs' if set on your PeerJS server
      secure: true,      // Set secure to true because you're using HTTPS
    });

    // Log the peer ID when the connection is established
    this.myPeer.on('open', (id: string) => {
      console.log(`My peer ID is: ${id}`);
    });
  }

  // Reconnect if disconnected
  reconnect() {
    this.myPeer.reconnect();
  }
}

