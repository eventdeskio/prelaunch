import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';
import { PrelaunchFooterComponent } from '../prelaunch-footer/prelaunch-footer.component';
import { ToastrService } from 'ngx-toastr';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { ParallaxCarouselComponent } from '../parallax-carousel/parallax-carousel.component';

import posthog from 'posthog-js';
import { Subscription } from 'rxjs';

import { ElementRef } from '@angular/core';

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
    HttpClientModule,
    PrelaunchFooterComponent,
    ParallaxCarouselComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrelaunchPagePage implements OnInit {
  private apiUrl = environment.apiUrl;
  private heroSection!: HTMLElement | null;
  siteKey: String = environment.siteKey;
  private featureSection!: HTMLElement | null;

  @ViewChild('recaptchaContainer') container!: ElementRef;
  @ViewChild('recaptcha') recaptcha!: ElementRef;

  // private textToType: string =
  //   '"…It’s the tool you didn’t know you needed until now."';

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
  shouldShowTerms: boolean = false;
  termsAccepted: boolean = false;

  constructor(
    private route: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.addScript();

    console.log(localStorage.getItem('terms_accepted'));

    if (
      localStorage.getItem('terms_accepted') !== null &&
      localStorage.getItem('terms_accepted') === 'true'
    ) {
      this.termsAccepted = true;
    }
    posthog.onFeatureFlags((e) => {
      console.log(e);
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
  }


  private resizeRecaptcha() {
    const containerWidth = this.container.nativeElement.offsetWidth;
    const recaptchaWidth = 304; // Default reCAPTCHA width
    
    if (containerWidth < recaptchaWidth) {
      const scale = containerWidth / recaptchaWidth;
      const transform = `scale(${scale})`;
      this.recaptcha.nativeElement.style.transform = transform;
    } else {
      this.recaptcha.nativeElement.style.transform = 'none';
    }
  }

  termsAccept() {
    this.termsAccepted = true;
    localStorage.setItem('terms_accepted', 'true');
  }
  addScript() {
    let script = document.createElement('script');
    // script.src = `https://www.google.com/recaptcha/api.js?render=${environment.siteKey}`;
    script.src = `https://www.google.com/recaptcha/api.js`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
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

  ngAfterViewInit(): void {

    // this.resizeRecaptcha();
    // window.addEventListener('resize', () => this.resizeRecaptcha());


    setTimeout(() => {
      document.querySelector('.herosection')?.classList.add('text-visible');
      document.querySelector('.navbar')?.classList.add('visible');
    }, 300);

    this.featureSection = document.querySelector('.features-section');

    if (this.featureSection) {
      this.observeFeatureSection();
    }

    //   const target = document.getElementById('typing-text');
    //   if (!target) return;

    //   const observer = new IntersectionObserver(
    //     (entries) => {
    //       if (entries[0].isIntersecting) {
    //         observer.unobserve(target); // Stop observing after animation starts
    //         // this.startTypingEffect(target);
    //       }
    //     },
    //     { threshold: 0.6 } // Trigger when 60% of the text is visible
    //   );

    //   observer.observe(target);
    // }

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
  }

 


  private observeFeatureSection(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.featureSection?.classList.add('box-visible');
            this.featureSection?.classList.remove('box-hidden');
          } else {
            this.featureSection?.classList.add('box-hidden');
            this.featureSection?.classList.remove('box-visible');
          }
        });
      },
      { threshold: 0.4 } // Triggers when 50% of the section is visible
    );

    if (this.featureSection) {
      observer.observe(this.featureSection);
    }
  }

  saveEmail(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/saveEmail`, data);
  }

  onEmailChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.emailText = inputElement.value;
  }

  async scheduleDemo(buttonName: String) {
    const recaptchaResponse = (
      document.getElementById('g-recaptcha-response') as HTMLInputElement
    ).value;
    if (!recaptchaResponse) {
      alert('Please complete the reCAPTCHA');
      return;
    }
    let res: any = await this.http
      .post(`${this.apiUrl}/verify-recaptcha`, {
        recaptchaToken: recaptchaResponse,
      })
      .toPromise();
    console.log(res);

    if (res.success === true && res.message === 'Valid reCAPTCHA') {
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
          this.toastr.success('Thank you! We will contact you shortly.');
          localStorage.setItem('demoScheduled', 'true');
          localStorage.setItem('userEmail', this.emailText);

          this.isDemoScheduled = true;
          grecaptcha.reset();
        },
        (error) => {
          this.toastr.error(`${error.error.error}`);

          console.error('Error saving details:', error);
          grecaptcha.reset();
        }
      );
      console.log('Entered Email:', this.emailText);
    } else {
      grecaptcha.reset();

      this.toastr.error('Invalid captcha');
    }
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

    window.removeEventListener('resize', () => this.resizeRecaptcha());

    const sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
    console.log(`Session duration: ${sessionDuration} seconds`);
    posthog.capture('session_duration', { duration: sessionDuration });

    this.subscription.unsubscribe();
  }
}
