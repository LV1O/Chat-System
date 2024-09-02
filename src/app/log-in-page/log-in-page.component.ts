import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.css']
})
export class LogInPageComponent {
  postResult: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    this.router.navigateByUrl('/groups');
  }
}