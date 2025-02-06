import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators , FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { AdminService } from '../service/adminservice';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-application-page',
  templateUrl: './application-page.page.html',
  styleUrls: ['./application-page.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule, CommonModule ,FormsModule, ReactiveFormsModule,FooterComponent,HttpClientModule,],
  // declarations:[ToastrComponent],
  providers: [AdminService,]
})
export class ApplicationPagePage implements OnInit {
  ngOnInit() {}

  jobForm: FormGroup;
  selectedFile: File | null = null;
  messageText: string = '';


  constructor(private fb: FormBuilder, private route: Router, private adminService: AdminService ) {
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
      // message: ['', Validators.required],
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.jobForm.patchValue({ resume: file });
    this.selectedFile = event.target.files[0];
  }

  onMessageChange(event: Event) {
    const inputElement = event.target as HTMLTextAreaElement;
    this.messageText = inputElement.value;
    console.log(this.messageText);
  }
  
  submitForm() {
    if (this.jobForm.valid && this.selectedFile) {
      this.adminService.uploadFile(this.selectedFile).subscribe(
        (fileResponse) => {
          console.log('File uploaded successfully', fileResponse);
          let data = this.jobForm.value
          data['message'] = this.messageText
          console.log('--------',data)
          if(this.messageText === ''){
            alert('Message cannot be null')
          }
          this.adminService.saveDetails(data, fileResponse.driveLink).subscribe(
            (response) => {
              console.log('Application submitted successfully', response);
            },
            (error) => {
              console.error('Error saving details:', error);
            }
          );
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    } else {
      alert('Invalid form');
      console.log('Invalid form');
    }
  }

  navigateToHome() {
    this.route.navigate(['/']);
  }
}
