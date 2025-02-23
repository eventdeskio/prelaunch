import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import posthog from 'posthog-js';
import { environment } from './environments/environment';

// posthog.init(
//   environment.POSTHOG_KEY,
//   {
//     api_host:environment.POSTHOG_HOST,
//     person_profiles: 'identified_only', 
//     capture_pageview: true, 
//     autocapture: true,
//   }
// )

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // provideAnimations(), 
    provideToastr(), 
  ],
});
