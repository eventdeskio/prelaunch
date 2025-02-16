import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,ChangeDetectorRef 
} from '@angular/core';
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
import posthog from 'posthog-js';
import { Subscription } from 'rxjs';
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
  isDemoScheduled: boolean = false;
  sessionStartTime!: number;
  private subscription: Subscription = new Subscription();
  shouldShowTerms:boolean=false;
  termsAccepted:boolean=false;
  

  constructor(
    private route: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log(localStorage.getItem("terms_accepted"))

    if(localStorage.getItem("terms_accepted")!==null && localStorage.getItem("terms_accepted")==="true"){
      console.log("insddnjdnjfn")
      this.termsAccepted = true;

    }
    posthog.onFeatureFlags((e) => {
      console.log(e)
      if (posthog.isFeatureEnabled('terms_and_conditions')) {
        this.shouldShowTerms = true;
        this.changeDetector.detectChanges();
      }
    });
    this.sessionStartTime = Date.now();
    if (localStorage.getItem('demoScheduled') === 'true') {
      this.isDemoScheduled = true;
      let email: any;
      email = localStorage.getItem('userEmail');
      posthog.identify(email, {
        name: '',
        email: email,
      });
    }
    console.log('test');
    
  }

  termsAccept(){
    this.termsAccepted = true;
    localStorage.setItem("terms_accepted","true")
  }

  @HostListener('document:scroll', ['$event'])
  onScroll(event: Event) {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / docHeight) * 100;

    console.log(`Scroll Percentage: ${scrollPercentage}%`);

    if (scrollPercentage > 50) {
      console.log('User scrolled 50%');
      posthog.capture('scrolled_50_percent');
    }
    if (scrollPercentage > 90) {
      console.log('User scrolled 90%');
      posthog.capture('scrolled_90_percent');
    }
  }

  saveEmail(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/saveEmail`, data);
  }

  onEmailChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.emailText = inputElement.value;
  }

  scheduleDemo(buttonName: String): void {
    this.emailText = this.emailText.trim().toLowerCase();

    if (!this.isValidEmail(this.emailText)) {
      this.toastr.error('Invalid email address. Please enter a valid email.');
      return;
    }
    let data = {
      email: this.emailText,
    };
    posthog.capture('schedule_demo_clicked', {
      action: buttonName,
      email: this.emailText,
      timestamp: new Date(),
    });
    this.saveEmail(data).subscribe(
      (response) => {
        this.toastr.success('Demo Scheduled Successfully!');
        localStorage.setItem('demoScheduled', 'true');
        localStorage.setItem('userEmail', this.emailText);

        this.isDemoScheduled = true;
      },
      (error) => {
        this.toastr.error(`${error.error.error}`);

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
  ngOnDestroy() {
    const sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
    console.log(`Session duration: ${sessionDuration} seconds`);
    posthog.capture('session_duration', { duration: sessionDuration });

    // Unsubscribe if there are active subscriptions
    this.subscription.unsubscribe();
  }
}
