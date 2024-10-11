import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // This makes the service available globally
})
export class ImguploadService {

  constructor(private http: HttpClient) { }

  imgupload(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:4200/upload', formData); // Replace with your actual backend endpoint
  }
}
