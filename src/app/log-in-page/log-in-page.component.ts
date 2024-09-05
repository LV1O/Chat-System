import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.css']
})
export class LogInPageComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  users: any[] = []; 

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getUsers().subscribe({
      next: (data) => {
        this.users = data.users;
      },
    });
  }

  onSubmit() {
    const user = this.users.find(u => u.email === this.email && u.password === this.password);
    if (user) {
      localStorage.setItem('username', this.email);
      localStorage.setItem('role', user.role);
      this.router.navigate(['/groups']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}