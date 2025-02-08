import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { PrelaunchFooterComponent } from '../prelaunch-footer/prelaunch-footer.component';
import { ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-application-page',
  templateUrl: './application-page.page.html',
  styleUrls: ['./application-page.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    HttpClientModule,
    CommonModule,
    FormsModule,
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrelaunchFooterComponent,
  ],
})
export class ApplicationPagePage implements OnInit {
  ngOnInit() {}

  private apiUrl = window.location.origin.includes('localhost')
    ? 'http://localhost:5000'
    : 'https://devb.eventdesk.io';

  jobForm: FormGroup;
  selectedFile: any;
  loading: boolean = false;
  roles = ['User Research', 'Website Design', 'Content Writer', 'Marketing', 'UX Design', 'Others'];
  selectedRoles: string[] = [];
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: Router,
    private toastr: ToastrService
  ) {
    this.jobForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      selectedRoles: [[]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      linkedin: ['', Validators.required],
      portfolio: [''],
      resume: [null, Validators.required],
      message: ['', Validators.required],
    });
  }

  getResumes(page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    console.log(this.apiUrl, window.location.origin);
    return this.http.get<any>(`${this.apiUrl}/getlist`, { params });
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
      phoneNumber: data['phoneNumber'],
      city: data['city'],
      state: data['state'],
      linkedin: data['linkedin'],
      portfolio: data['portfolio'],
      selectedRoles:data['selectedRoles'],
      resume: fileLink,
      message: data['message'],
    };
    return this.http.post<any>(`${this.apiUrl}/savedetails`, details);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.jobForm.patchValue({ resume: file });
    this.selectedFile = event.target.files[0];
  }

  submitForm() {
    this.jobForm.patchValue({ selectedRoles: this.selectedRoles });

    if (this.jobForm.valid) {
      console.log('Form Data:', this.jobForm.value);
      this.loading = true;
      this.uploadFile(this.selectedFile).subscribe(
        (fileResponse) => {
          let data = this.jobForm.value;
          console.log('--------', data);

          this.saveDetails(data, fileResponse.driveLink).subscribe(
            (response) => {
              this.toastr.success('Application submitted successfully');

              this.loading = false;
            },
            (error) => {
              this.toastr.error(`${error}`);
              this.loading = false;

              console.error('Error saving details:', error);
            }
          );
        },
        (error) => {
          this.loading = false;

          console.error('Error uploading file:', error);
        }
      );
    } else {
      this.loading = false;

      console.log('Invalid Form');
      Object.keys(this.jobForm.controls).forEach((key) => {
        const controlErrors = this.jobForm.get(key)?.errors;
        if (controlErrors) {
          this.toastr.error(`Error in ${key}`);
          console.log(`Error in ${key}:`, controlErrors);
        }
      });
    }
  }

  toggleRole(role: string) {
    if (this.selectedRoles.includes(role)) {
      this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    } else {
      this.selectedRoles.push(role);
    }
  }
  navigateToHome() {
    this.route.navigate(['/']);
  }
}
