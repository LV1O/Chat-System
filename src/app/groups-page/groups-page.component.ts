import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.css']
})
export class GroupsPageComponent {

  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/login']); 
    localStorage.removeItem('authToken');
  }
}