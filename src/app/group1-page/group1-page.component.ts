import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';  // Import the Socket service

@Component({
  selector: 'app-group1-page',
  templateUrl: './group1-page.component.html',
  styleUrls: ['./group1-page.component.css']
})
export class Group1PageComponent implements OnInit {
  username: string | null = '';
  userRole: string = '';
  message: string = ''; 
  messages: any[] = [];  // Store received messages

  constructor(private router: Router, private socketService: SocketService) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.userRole = localStorage.getItem('role') || '';

    // Listen for messages from Group 1
    this.socketService.receiveMessages().subscribe({
      next: (message) => {
        this.messages.push(message);  // Add the received message to the list
      },
      error: (err) => {
        console.error('Error receiving message:', err);
      }
    });
  }

  back() {
    this.router.navigate(['/groups']);
  }

  submitMessage() {
    if (this.message.trim() && this.username) {
      const messageData = {
        groupId: 'group1',
        messageContent: this.message,
        sender: this.username,
        timestamp: new Date() // Add the current timestamp
      };
  
      // Send the message via the socket service
      this.socketService.sendMessage(messageData);
      this.message = '';  // Clear the input field
    } else {
      alert('Please enter a message.');
    }
  }
}
