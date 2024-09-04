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
    { email: 'SuperAdmin', password: '1' },
    { email: 'GroupAdmin', password: '2' },
    { email: 'user', password: '3' },
    { email: 'SuperUser', password: '123' }
  ];

  constructor(private router: Router) {}

  onSubmit() {
    const user = this.users.find(u => u.email === this.email && u.password === this.password);
    if (user) {
      localStorage.setItem('username', this.email);
      this.router.navigate(['/groups']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}