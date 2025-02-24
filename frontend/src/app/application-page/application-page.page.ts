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
import { environment } from 'src/environments/environment';
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
  // private textToType: string =
  //   '"Your career is more than a job—it’s a journey. Let’s take it together."';

  private leftContianer!: HTMLElement | null;
  private rightContainer!: HTMLElement | null;
  siteKey: String = environment.siteKey;

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
      // city: ['', Validators.required],
      // state: ['', Validators.required],
      linkedin: ['', Validators.required],
      portfolio: [''],
      resume: [null, Validators.required],
      message: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.addScript();
  }

  addScript() {
    let script = document.createElement('script');
    // script.src = `https://www.google.com/recaptcha/api.js?render=${environment.siteKey}`;
    script.src = `https://www.google.com/recaptcha/api.js`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      document.querySelector('.left-container')?.classList.add('visible');
      document.querySelector('.right-container')?.classList.add('visible');
      document.querySelector('.navbar')?.classList.add('visible');
    }, 300);

    const target = document.getElementById('typing-text');
    if (!target) return;

    // const observer = new IntersectionObserver(
    //   (entries) => {
    //     console.log('hellooo');
    //     if (entries[0].isIntersecting) {
    //       observer.unobserve(target); // Stop observing after animation starts
    //       // this.startTypingEffect(target);
    //     }
    //   },
    //   { threshold: 0.6 } // Trigger when 60% of the text is visible
    // );

    // observer.observe(target);
  }

  // private startTypingEffect(target: HTMLElement): void {
  //   target.innerHTML = ''; // Clear existing text
  //   let index = 0;

  //   const typingInterval = setInterval(() => {
  //     if (index < this.textToType.length) {
  //       target.innerHTML += this.textToType[index];
  //       index++;
  //     } else {
  //       clearInterval(typingInterval); // Stop animation when text is fully typed
  //     }
  //   }, 50); // Adjust speed (lower = faster)
  // }

  private apiUrl = environment.apiUrl;

  jobForm: FormGroup;
  selectedFile: any;
  loading: boolean = false;
  roles = [
    'User Research',
    'Website Design',
    'Content Writer',
    'Marketing',
    'UX Design',
    'Others',
  ];
  selectedRoles: string[] = [];

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
      // city: data['city'],
      // state: data['state'],
      linkedin: data['linkedin'],
      portfolio: data['portfolio'],
      selectedRoles: data['selectedRoles'],
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
  // CAPTCHA VERSION 3
  // submitForm(event: Event) {
  //   event.preventDefault();
  //   grecaptcha.ready(() => {
  //     grecaptcha.execute(environment.siteKey, { action: 'submit' }).then((token) => {
  //       console.log(token,"------");
  //       console.log(this.apiUrl)
  //       // this.http.post<any>(`${this.apiUrl}/verify-recaptcha`,{recaptchaToken:token})
  //       this.http.post('http://localhost:5000/verify-recaptcha', {recaptchaToken:token}).subscribe(
  //         response => {
  //           console.log("Server Response:", response);
  //         },
  //         error => {
  //           console.error("Request Failed!", error);
  //         }
  //       );

  //     });
  //   });
  // }

  async submitForm(event: Event) {
    event.preventDefault();

    if (this.jobForm.valid) {
      const recaptchaResponse = (
        document.getElementById('g-recaptcha-response') as HTMLInputElement
      ).value;
      if (!recaptchaResponse) {
        alert('Please complete the reCAPTCHA');
        return;
      }
      const formData = {
        ...this.jobForm.value,
        recaptchaToken: recaptchaResponse,
      };
      let res: any = await this.http
        .post(`${this.apiUrl}/verify-recaptcha`, {
          recaptchaToken: recaptchaResponse,
        })
        .toPromise();
      console.log(res);

      if (res.success === true && res.message === 'Valid reCAPTCHA') {
        this.jobForm.patchValue({ selectedRoles: this.selectedRoles });
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
                grecaptcha.reset();
              },
              (error) => {
                this.toastr.error(`${error.error.details}`);
                this.loading = false;
                grecaptcha.reset();
                console.error('Error saving details:', error.error.details);
              }
            );
          },
          (error) => {
            this.loading = false;
            grecaptcha.reset();
            console.error('Error uploading file:', error);
          }
        );
      } else {
        this.toastr.error('Invalid captcha');
      }
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

  // submitForm(e) {
  //   e.preventDefault();
  //   grecaptcha.ready(function() {
  //     grecaptcha.execute(environment.siteKey, {action: 'submit'}).then(function(token) {
  //         // Add your logic to submit to your backend server here.
  //         console.log(token)
  //     });
  // });
  // // this.jobForm.patchValue({ selectedRoles: this.selectedRoles });

  // // if (this.jobForm.valid) {
  // //   console.log('Form Data:', this.jobForm.value);
  // //   this.loading = true;
  // //   this.uploadFile(this.selectedFile).subscribe(
  // //     (fileResponse) => {
  // //       let data = this.jobForm.value;
  // //       console.log('--------', data);

  // //       this.saveDetails(data, fileResponse.driveLink).subscribe(
  // //         (response) => {
  // //           this.toastr.success('Application submitted successfully');

  // //           this.loading = false;
  // //         },
  // //         (error) => {
  // //           this.toastr.error(`${error}`);
  // //           this.loading = false;

  // //           console.error('Error saving details:', error);
  // //         }
  // //       );
  // //     },
  // //     (error) => {
  // //       this.loading = false;

  // //       console.error('Error uploading file:', error);
  // //     }
  // //   );
  // // } else {
  // //   this.loading = false;

  // //   console.log('Invalid Form');
  // //   Object.keys(this.jobForm.controls).forEach((key) => {
  // //     const controlErrors = this.jobForm.get(key)?.errors;
  // //     if (controlErrors) {
  // //       this.toastr.error(`Error in ${key}`);
  // //       console.log(`Error in ${key}:`, controlErrors);
  // //     }
  // //   });
  // // }
  // }

  toggleRole(role: string) {
    if (this.selectedRoles.includes(role)) {
      this.selectedRoles = this.selectedRoles.filter((r) => r !== role);
    } else {
      this.selectedRoles.push(role);
    }
  }
  navigateToHome() {
    this.route.navigate(['/']);
  }
}
