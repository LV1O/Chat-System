import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group2-page',
  templateUrl: './group2-page.component.html',
  styleUrls: ['./group2-page.component.css']
})
export class Group2PageComponent {
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