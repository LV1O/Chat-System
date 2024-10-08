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
    // Initialize PeerJS connection
    this.myPeer = new Peer(this.myPeerId, {
      host: 'your-server-url-here',  // Replace with your actual server URL
      port: 3001,
      path: '/',
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
