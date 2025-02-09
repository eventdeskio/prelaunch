import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { PrelaunchFooterComponent } from '../prelaunch-footer/prelaunch-footer.component';
import { ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
register();

@Component({
  selector: 'app-prelaunch-page',
  templateUrl: './prelaunch-page.page.html',
  styleUrls: ['./prelaunch-page.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FooterComponent,
    HttpClientModule,
    PrelaunchFooterComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrelaunchPagePage implements OnInit {
  private apiUrl = environment.apiUrl;
  featureimages: any[] = [
    {
      imagesrc: '../../assets/1 3.png',
      context: 'Manage Events, vendors, guests, and invitations seamlessly.',
    },
    {
      imagesrc: '../../assets/2 3.png',
      context: 'Track event budgets and manage tasks effortlessly.',
    },
    {
      imagesrc: '../../assets/3 4.png',
      context: 'Drive engagement with a collaborative chat interface.',
    },
  ];

  deviceImages: any[] = [
    {
      imagesrc: '../../assets/Mobile.svg',
      title: 'Adapt to Your Workflow',
      context:
        'From quick updates on the go to in-depth planning sessions, our platform is designed to fit seamlessly into your routine.',
    },
    {
      imagesrc: '../../assets/Tab.svg',
      title: 'Collaborate with Ease',
      context:
        'Whether you`re coordinating tasks or sharing updates, our tools provide an intuitive experience tailored for every role in your team.',
    },
    {
      imagesrc: '../../assets/Desktop.svg',
      title: 'Access the Full Picture',
      context:
        'Enjoy a complete suite of features with interfaces that scale perfectly to meet your needs, delivering clarity and control at every level.',
    },
  ];
  emailText: string = '';
  isDemoScheduled:boolean=false;

  constructor(private route: Router,  private http: HttpClient,private toastr: ToastrService) {}

  ngOnInit() {
    if (localStorage.getItem('demoScheduled') === 'true') {
      this.isDemoScheduled = true;
    }
  }

   saveEmail(data: any): Observable<any> {
     
      return this.http.post<any>(`${this.apiUrl}/saveEmail`, data);
    }
  
  onEmailChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.emailText = inputElement.value;
  }

  scheduleDemo(): void {
    this.emailText = this.emailText.trim().toLowerCase();

    if (!this.isValidEmail(this.emailText)) {
      this.toastr.error('Invalid email address. Please enter a valid email.');
      return;
    }
    let data = {
      email:this.emailText
    }
    this.saveEmail(data).subscribe(
      (response) => {
        this.toastr.success('Demo Scheduled Successfully!');
        localStorage.setItem('demoScheduled', 'true');
        localStorage.setItem('userEmail', this.emailText);
  
        this.isDemoScheduled = true;
      },
      (error) => {
        this.toastr.error(`${error}`);

        console.error('Error saving details:', error);
      }
    );
    console.log('Entered Email:', this.emailText);
  }

  navigateToApplication() {
    this.route.navigate(['/application']);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return false;
    }

    if (email.length > 254) {
      return false;
    }

    const [localPart, domain] = email.split('@');
    if (
      !localPart ||
      !domain ||
      domain.startsWith('-') ||
      domain.startsWith('.') ||
      domain.endsWith('-') ||
      domain.endsWith('.')
    ) {
      return false;
    }

    return true;
  }
  navigateToHome() {
    this.route.navigate(['/']);
  }
}