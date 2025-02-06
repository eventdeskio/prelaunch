import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { PrelaunchFooterComponent } from '../prelaunch-footer/prelaunch-footer.component';

register(); // Register Swiper Web Component

@Component({
  selector: 'app-prelaunch-page',
  templateUrl: './prelaunch-page.page.html',
  styleUrls: ['./prelaunch-page.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule,FooterComponent,PrelaunchFooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Needed for Swiper Web Component
})
export class PrelaunchPagePage implements OnInit {
  

  featureimages: any[] = [
    { imagesrc: '../../assets/1 3.png',  context: 'Manage Events, vendors, guests, and invitations seamlessly.' },
    { imagesrc: '../../assets/2 3.png',  context: 'Track event budgets and manage tasks effortlessly.' },
    { imagesrc: '../../assets/3 4.png', context: 'Drive engagement with a collaborative chat interface.' }
  ];


  deviceImages: any[] = [
    { imagesrc: '../../assets/Mobile.svg', title: 'Adapt to Your Workflow', context: 'From quick updates on the go to in-depth planning sessions, our platform is designed to fit seamlessly into your routine.' },
    { imagesrc: '../../assets/Tab.svg', title: 'Collaborate with Ease', context: 'Whether you`re coordinating tasks or sharing updates, our tools provide an intuitive experience tailored for every role in your team.' },
    { imagesrc: '../../assets/Desktop.svg', title: 'Access the Full Picture', context: 'Enjoy a complete suite of features with interfaces that scale perfectly to meet your needs, delivering clarity and control at every level.' }
  ];

  constructor(private route:Router) { }

  ngOnInit() { }


  navigateToApplication(){
    this.route.navigate(['/application'])
}

navigateToHome(){
  this.route.navigate(['/'])
}
}
