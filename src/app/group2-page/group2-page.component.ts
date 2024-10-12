import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { PeerService } from '../services/peer.service';
import { ImguploadService } from '../services/imgupload.service'; 

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
export class Group2PageComponent implements OnInit, OnDestroy {
  username: string | null = '';
  userRole: string = '';
  message: string = '';
  messages: any[] = []; 
  isCallStarted = false;
  ownID = this.peerService.myPeerId; 
  currentCall: any;
  peerList: string[] = [];
  videos: VideoElement[] = [];
  currentStream: any; 
  uploadedImageUrl: string | null = null; 
  selectedfile: any = null; 
  imagepath = ""; 

  constructor(
    private router: Router, 
    private socketService: SocketService, 
    private peerService: PeerService,
    private imguploadService: ImguploadService
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.userRole = localStorage.getItem('role') || '';
  
    console.log('Socket connection initialized for Group 2.');
    console.log(`Current user: ${this.username}, Role: ${this.userRole}`);
  
    // Fetch past messages for the group from MongoDB
    this.fetchMessages();
  
    // Emit the event that the user has joined the group
    this.socketService.emitUserJoined({ username: this.username!, group: 'group2' });
  
    // Listen for real-time incoming chat messages
    this.socketService.receiveMessages().subscribe({
      next: (message) => {
        console.log('Real-time message received:', message);
        this.messages.push(message); // Add the message to the list in real-time
      },
      error: (err) => {
        console.error('Error receiving real-time messages:', err);
      }
    });
  }
  

  ngOnDestroy(): void {
    console.log('User is leaving the channel.');
    this.socketService.emitUserLeft({ username: this.username!, group: 'group2' });
  }

  // Fetch messages from the server when entering the chat
  fetchMessages() {
    this.socketService.getMessages('group2').subscribe({
      next: (messages) => {
        console.log('Fetched messages from the database:', messages);
        this.messages = messages;
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
      }
    });
  }

  // Navigate back to group list
  back() {
    console.log('Navigating back to group list.');
    this.socketService.emitUserLeft({ username: this.username!, group: 'group2' });
    this.router.navigate(['/groups']);
  }

  submitMessage() {
    if (this.message.trim() && this.username) {
      const messageData = {
        groupId: 'group2',
        messageContent: this.message, 
        sender: this.username, 
        timestamp: new Date(), 
        imageUrl: this.uploadedImageUrl || null
      };
  
      console.log('Sending message:', messageData);
      this.socketService.sendMessage(messageData);  // Real-time message sending
  
      // Add the message locally immediately
      this.messages.push(messageData);
  
      this.message = '';  // Clear the message input
      this.uploadedImageUrl = null;  // Reset uploaded image URL
    } else {
      alert('Please enter a message.');
    }
  }
  

  // Handle peer-to-peer call
  calling(peerID: string) {
    if (confirm(`Do you want to call ${peerID}?`)) {
      console.log(`Calling peer: ${peerID}`);
      const call = this.peerService.myPeer.call(peerID, this.currentStream); 
      this.currentCall = call;

      call.on('stream', (remoteStream: MediaStream) => {
        console.log(`Receiving stream from peer: ${peerID}`);
        this.addOtherUserVideo(peerID, remoteStream); 
      });

      call.on('close', () => {
        console.log(`Call with peer ${peerID} has ended.`);
        this.videos = this.videos.filter((video) => video.userId !== peerID); 
      });
    }
  }

  // Add user's video to the grid
  addMyVideo(stream: MediaStream) {
    console.log('Adding own video to the video grid.');
    this.videos.push({
      muted: true,
      srcObject: stream,
      userId: this.peerService.myPeerId
    });
  }

  // Add other user's video to the grid
  addOtherUserVideo(userId: string, stream: MediaStream) {
    console.log(`Adding video for peer: ${userId}`);
    this.videos.push({
      muted: false,
      srcObject: stream,
      userId
    });
  }

  // Start video stream from the camera
  async streamCamera() {
    try {
      this.currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log('Camera stream started.');
      this.addMyVideo(this.currentStream);
      this.socketService.peerID(this.peerService.myPeerId);
      this.isCallStarted = true;
    } catch (error) {
      console.error('Error accessing media devices for camera stream.', error);
    }
  }

  // Start screen sharing
  async streamScreen() {
    try {
      this.currentStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      console.log('Screen sharing stream started.');
      this.addMyVideo(this.currentStream);
      this.socketService.peerID(this.peerService.myPeerId);
      this.isCallStarted = true;
    } catch (error) {
      console.error('Error accessing media devices for screen sharing.', error);
    }
  }

  // End the current call
  endCall() {
    if (this.currentCall) {
      console.log('Ending current call.');
      this.currentCall.close();
      this.isCallStarted = false;

      if (this.currentStream) {
        this.currentStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        console.log('All media tracks stopped.');
      }
      this.videos = [];
    }
  }

  // Handle image file selection for profile picture
  onFileSelected(event: any) {
    this.selectedfile = event.target.files[0]; 
    console.log('Selected image file:', this.selectedfile);
  }

  // Delete a message
deleteMessage(msg: any) {
  const messageId = msg._id;  // Ensure only the _id is passed
  console.log('Attempting to delete message with ID:', messageId);  // Log the message ID
  this.socketService.deleteMessage(messageId).subscribe({
    next: (response) => {
      console.log('Message deleted:', response);
      this.messages = this.messages.filter((message) => message._id !== messageId);  // Remove from local list
    },
    error: (err) => {
      console.error('Error deleting message:', err);
    }
  });
}


  // Handle image file selection for profile picture
  onProfileImageSelected(event: Event, msg: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);
      formData.append('username', this.username!);

      console.log('Selected profile image file:', file);

      this.socketService.uploadProfileImage(formData).subscribe(
        (response: any) => {
          console.log('Profile image uploaded successfully:', response);
          msg.profileImageUrl = response.imageUrl;
          this.messages = [...this.messages];  // Update the messages array
        },
        (error: any) => {
          console.error('Error uploading profile image:', error);
        }
      );
    }
  }
}
