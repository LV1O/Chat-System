import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { PeerService } from '../services/peer.service';

interface VideoElement {
  muted: boolean;
  srcObject: MediaStream;
  userId: string;
}

@Component({
  selector: 'app-group2-page',
  templateUrl: './group2-page.component.html',
  styleUrls: ['./group2-page.component.css']
})
export class Group2PageComponent implements OnInit {
  username: string | null = '';
  userRole: string = '';
  message: string = '';
  messages: any[] = []; // Store received messages
  isCallStarted = false;
  ownID = this.peerService.myPeerId; // Ensure myPeerId is correctly defined in PeerService
  currentCall: any;
  peerList: string[] = [];
  videos: VideoElement[] = [];
  currentStream: any;
  calls: any[] = []; // Declare the calls array here

  constructor(private router: Router, private socketService: SocketService, private peerService: PeerService) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.userRole = localStorage.getItem('role') || '';

    // Listen for messages from Group 2
    this.socketService.receiveMessages().subscribe({
      next: (message) => {
        this.messages.push(message); // Add the received message to the list
      },
      error: (err) => {
        console.error('Error receiving message:', err);
      }
    });

    // Subscribe to peer IDs
    this.socketService.getPeerID().subscribe((peerID: any) => {
      if (peerID !== this.ownID) {
        this.peerList.push(peerID);
      }
    });
  }

  back() {
    this.router.navigate(['/groups']);
  }

  async streamCamera() {
    try {
      this.currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.addMyVideo(this.currentStream);
      this.socketService.peerID(this.peerService.myPeerId);
      this.isCallStarted = true;
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  }

  async streamScreen() {
    try {
      this.currentStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      this.addMyVideo(this.currentStream);
      this.socketService.peerID(this.peerService.myPeerId);
      this.isCallStarted = true;
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  }

  addMyVideo(stream: MediaStream) {
    this.videos.push({
      muted: true,
      srcObject: stream,
      userId: this.peerService.myPeerId
    });
  }

  calling(peerID: string) {
    if (confirm(`Do you want to call ${peerID}?`)) {
      const call = this.peerService.myPeer.call(peerID, this.currentStream);
      this.currentCall = call;
      this.calls.push(call); // Push the new call to the calls array

      call.on('stream', (remoteStream: MediaStream) => {
        this.addOtherUserVideo(peerID, remoteStream);
      });

      call.on('close', () => {
        console.log('Call closed'); // Debug log
        this.videos = this.videos.filter((video) => video.userId !== peerID);
        this.calls = this.calls.filter((c: any) => c !== call); // Remove the closed call from the calls array
      });
    }
  }

  addOtherUserVideo(userId: string, stream: MediaStream) {
    this.videos.push({
      muted: false,
      srcObject: stream,
      userId
    });
  }

  endCall() {
    console.log('End call button pressed'); // Debug log
    if (this.currentCall) {
      this.currentCall.close();
      this.isCallStarted = false;

      // Stop all media tracks
      if (this.currentStream) {
        console.log('Stopping media tracks'); // Debug log
        this.currentStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      } else {
        console.log('No current stream to stop'); // Debug log
      }

      // Clear the videos array to remove video streams
      this.videos = [];
      console.log('Call ended and streams cleared'); // Debug log
    } else {
      console.log('No active call to end'); // Debug log
    }
  }

  submitMessage() {
    if (this.message.trim() && this.username) {
      const messageData = {
        groupId: 'group2', // Update group ID for Group 2
        messageContent: this.message,
        sender: this.username,
        timestamp: new Date() // Add the current timestamp
      };

      // Send the message via the socket service
      this.socketService.sendMessage(messageData);
      this.message = ''; // Clear the input field
    } else {
      alert('Please enter a message.');
    }
  }
}
