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
    : 'https://api.eventdesk.io';

  jobForm: FormGroup;
  selectedFile: any;
  loading: boolean = false;

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

  navigateToHome() {
    this.route.navigate(['/']);
  }
}

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
// import { FormBuilder, FormGroup, Validators , FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { IonicModule } from '@ionic/angular';
// import { Router } from '@angular/router';
// import { FooterComponent } from '../footer/footer.component';
// import { AdminService } from '../service/adminservice';
// import { HttpClientModule } from '@angular/common/http';
// import { PrelaunchFooterComponent } from '../prelaunch-footer/prelaunch-footer.component';
// @Component({
//   selector: 'app-application-page',
//   templateUrl: './application-page.page.html',
//   styleUrls: ['./application-page.page.scss'],
//   standalone: true,
//   imports: [IonContent, IonHeader, IonTitle, IonToolbar,PrelaunchFooterComponent, CommonModule, FormsModule, IonicModule, CommonModule ,FormsModule, ReactiveFormsModule,FooterComponent,HttpClientModule,],
//   // declarations:[ToastrComponent],
//   providers: [AdminService,]
// })
// export class ApplicationPagePage implements OnInit {
//   ngOnInit() {}

//   jobForm: FormGroup;
//   selectedFile: File | null = null;
//   messageText: string = '';

//   constructor(private fb: FormBuilder, private route: Router, private adminService: AdminService ) {
//     this.jobForm = this.fb.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
//       city: ['', Validators.required],
//       state: ['', Validators.required],
//       linkedin: ['', Validators.required],
//       portfolio: [''],
//       resume: [null, Validators.required],
//       // message: ['', Validators.required],
//     });
//   }

//   onFileChange(event: any) {
//     const file = event.target.files[0];
//     this.jobForm.patchValue({ resume: file });
//     this.selectedFile = event.target.files[0];
//   }

//   onMessageChange(event: Event) {
//     const inputElement = event.target as HTMLTextAreaElement;
//     this.messageText = inputElement.value;
//     console.log(this.messageText);
//   }

//   submitForm() {
//     if (this.jobForm.valid && this.selectedFile) {
//       this.adminService.uploadFile(this.selectedFile).subscribe(
//         (fileResponse) => {
//           console.log('File uploaded successfully', fileResponse);
//           let data = this.jobForm.value
//           data['message'] = this.messageText
//           console.log('--------',data)
//           if(this.messageText === ''){
//             alert('Message cannot be null')
//           }
//           this.adminService.saveDetails(data, fileResponse.driveLink).subscribe(
//             (response) => {
//               console.log('Application submitted successfully', response);
//             },
//             (error) => {
//               console.error('Error saving details:', error);
//             }
//           );
//         },
//         (error) => {
//           console.error('Error uploading file:', error);
//         }
//       );
//     } else {
//       alert('Invalid form');
//       console.log('Invalid form');
//     }
//   }

//   navigateToHome() {
//     this.route.navigate(['/']);
//   }
// }
