import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'assets/data.json'; // Ensure this points to your JSON file

  constructor(private http: HttpClient) {}

  // Fetch users from the JSON file
  getUsers(): Observable<any> {
    return this.http.get(this.dataUrl);
  }

  // Fetch groups from the JSON file
  getGroups(): Observable<any> {
    return this.http.get(this.dataUrl); // Adjust if you want a separate groups endpoint
  }
}
