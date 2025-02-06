import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./prelaunch-page/prelaunch-page.page').then( m => m.PrelaunchPagePage)
  },
  {
    path: 'application',
    loadComponent: () => import('./application-page/application-page.page').then( m => m.ApplicationPagePage)
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin-page/admin-page.page').then( m => m.AdminPagePage)
  },
  
];
