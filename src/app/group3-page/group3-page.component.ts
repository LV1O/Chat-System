import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group3-page',
  templateUrl: './group3-page.component.html',
  styleUrls: ['./group3-page.component.css']
})

  export class Group3PageComponent implements OnInit {
    username: string | null = '';
    userRole: string = '';
    message: string = ''; 
  
    constructor(private router: Router) {}
  
    ngOnInit(): void {
      this.username = localStorage.getItem('username');
      this.userRole = localStorage.getItem('role') || '';
    }
  

  back() {
    this.router.navigate(['/groups']);
  }

  submitMessage() {
    if (this.message.trim()) {
      console.log('Message submitted:', this.message);
      this.message = ''; 
    } else {
      alert('Please enter a message.');
    }
  }
}