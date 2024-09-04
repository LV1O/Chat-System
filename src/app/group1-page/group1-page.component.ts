import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group1-page',
  templateUrl: './group1-page.component.html',
  styleUrls: ['./group1-page.component.css']
})
export class Group1PageComponent {
  username: string | null = '';
  message: string = ''; 

  constructor(private router: Router) {}

  back() {
    this.router.navigate(['/groups']);
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
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