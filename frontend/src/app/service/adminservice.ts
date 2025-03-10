import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root' 
})

export class AdminService {
  private apiUrl = environment.apiUrl; 


  constructor(private http: HttpClient) {}

  getResumes(page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    console.log(this.apiUrl, window.location.origin,)
    return this.http.get<any>(`${this.apiUrl}/getlist`, { params });
  }

  auth(inp:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/check`, inp);
  }

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
  }

  saveDetails(data: any, fileLink: string): Observable<any> {
    const details = {
      firstName: data['firstName'],
      lastName: data['lastName'],
      email: data['email'],
      phoneNumber:data['phoneNumber'],
      city: data['city'],
      state: data['state'],
      linkedin: data['linkedin'],
      portfolio: data['portfolio'],
      resume: fileLink, 
      message: data['message'],
    };
    return this.http.post<any>(`${this.apiUrl}/savedetails`, details);
  }
  
  updateReviewedStatus(updates: { id: number; reviewed: boolean }[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateReviewed`, { updates });
  }
}