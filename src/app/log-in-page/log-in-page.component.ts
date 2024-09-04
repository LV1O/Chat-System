import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.css']
})
export class LogInPageComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  users = [
    { email: 'SuperAdmin', password: '1', role: 'SuperAdmin' },
    { email: 'GroupAdmin', password: '2', role: 'GroupAdmin' },
    { email: 'user', password: '3', role: 'User' },
    { email: 'SuperUser', password: '123', role: 'SuperUser' }
  ];

  constructor(private router: Router) {}

  onSubmit() {
    const user = this.users.find(u => u.email === this.email && u.password === this.password);
    if (user) {
      console.log('User found:', user); // Debugging
      
      localStorage.setItem('username', this.email);
      localStorage.setItem('role', user.role);
     
      this.router.navigate(['/groups']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}