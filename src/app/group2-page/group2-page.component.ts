import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { PeerService } from '../services/peer.service';
import { ImguploadService } from '../services/imgupload.service'; // Correct path for ImguploadService

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
  uploadedImageUrl: string | null = null; // Track uploaded image URL
  selectedfile: any = null; // Track the selected image file
  imagepath = ""; // Store the uploaded image path

  constructor(
    private router: Router, 
    private socketService: SocketService, 
    private peerService: PeerService,
    private imguploadService: ImguploadService
  ) {}

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

      call.on('stream', (remoteStream: MediaStream) => {
        this.addOtherUserVideo(peerID, remoteStream);
      });

      call.on('close', () => {
        this.videos = this.videos.filter((video) => video.userId !== peerID);
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
    if (this.currentCall) {
      this.currentCall.close();
      this.isCallStarted = false;

      // Stop all media tracks
      if (this.currentStream) {
        this.currentStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
      this.videos = [];
    }
  }

  submitMessage() {
    if (this.message.trim() && this.username) {
      const messageData = {
        groupId: 'group2',
        messageContent: this.message,
        sender: this.username,
        timestamp: new Date(),
        imageUrl: this.uploadedImageUrl || null // Include image URL if exists
      };

      // Send the message via the socket service
      this.socketService.sendMessage(messageData);
      this.message = ''; // Clear the input field
      this.uploadedImageUrl = null; // Reset uploaded image URL
    } else {
      alert('Please enter a message.');
    }
  }

  // Method to handle image file selection for message
  onFileSelected(event: any) {
    this.selectedfile = event.target.files[0]; // Get the file selected by the user
  }

  // Method to handle image upload
  onUpload() {
    const fd = new FormData();
    fd.append('image', this.selectedfile, this.selectedfile.name);
    this.imguploadService.imgupload(fd).subscribe(
      (res: any) => {
        this.imagepath = res.data.filename;
        console.log('Image uploaded successfully:', this.imagepath);
      },
      (err) => {
        console.error('Error uploading image:', err);
      }
    );
  }

// Method to handle image file selection for profile picture
onProfileImageSelected(event: Event, msg: any) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('username', this.username!);
    
    console.log('Selected file:', file); // Log the selected file

    // Assuming your socket service has an uploadProfileImage method
    this.socketService.uploadProfileImage(formData).subscribe(
      (response: any) => {
        console.log('Profile image uploaded successfully:', response);
        // Update the message object with the new profile image URL
        msg.profileImageUrl = response.imageUrl; // Set the image URL
        console.log('Updated message with new profile image URL:', msg); // Log the updated message
        
        // Force Angular to detect changes if necessary
        this.messages = [...this.messages]; // Create a new reference to trigger change detection
      },
      (error) => {
        console.error('Error uploading profile image:', error);
      }
    );
  } else {
    console.warn('No file selected.'); // Log if no file was selected
  }
}
}

