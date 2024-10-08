import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.css']
})
export class GroupsPageComponent implements OnInit {
  username: string | null = '';
  userRole: string = '';
  message: string = '';

  constructor(private router: Router) {}

  goToGroup1Page() {
    this.router.navigate(['/group1']); // Adjusted path for Group 1
  }

  goToGroup2Page() {
    this.router.navigate(['/group2']); // Adjusted path for Group 2
  }

  goToGroup3Page() {
    this.router.navigate(['/group3']); // Adjusted path for Group 3
  }
  
  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.userRole = localStorage.getItem('role') || '';
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username'); 
    this.router.navigate(['/login']); // Redirect to login on logout
  }
}
