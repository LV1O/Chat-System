import { Component, OnInit } from '@angular/core';
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
  isCallStarted = false;
  ownID = this.peerService.myPeerId;
  currentCall: any;
  peerList: string[] = [];
  videos: VideoElement[] = [];
  currentStream: any;
  calls: any[] = [];  // Declare the calls array here

  constructor(private socketService: SocketService, private peerService: PeerService) {}

  ngOnInit() {
    this.socketService.getPeerID().subscribe((peerID: any) => {
      if (peerID !== this.ownID) {
        this.peerList.push(peerID);
      }
    });
  }

  async streamCamera() {
    this.currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.addMyVideo(this.currentStream);
    this.socketService.peerID(this.peerService.myPeerId);
    this.isCallStarted = true;
  }

  async streamScreen() {
    this.currentStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    this.addMyVideo(this.currentStream);
    this.socketService.peerID(this.peerService.myPeerId);
    this.isCallStarted = true;
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
      this.calls.push(call);  // Push the new call to the calls array

      call.on('stream', (remoteStream: MediaStream) => {
        this.addOtherUserVideo(peerID, remoteStream);
      });

      call.on('close', () => {
        this.videos = this.videos.filter((video) => video.userId !== peerID);
        this.calls = this.calls.filter((c: any) => c !== call);  // Remove the closed call from the calls array
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
    this.currentCall.close();
    this.isCallStarted = false;
  }
}
