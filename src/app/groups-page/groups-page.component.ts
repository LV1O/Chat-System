import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.css']
})
export class GroupsPageComponent implements OnInit {
  username: string | null = '';

  constructor(private router: Router) {}

  goToGroup1Page() {
    this.router.navigate(['/group1-page']);
  }

  goToGroup2Page() {
    this.router.navigate(['/group2-page']);
  }

  goToGroup3Page() {
    this.router.navigate(['/group3-page']);
  }
  
  ngOnInit(): void {
    this.username = localStorage.getItem('username');
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username'); 
    this.router.navigate(['/login']);
  }
}