import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-parallax-carousel',
  templateUrl: './parallax-carousel.component.html',
  styleUrls: ['./parallax-carousel.component.scss'],
})
export class ParallaxCarouselComponent implements OnInit, AfterViewInit {
  carousel!: HTMLElement | null;
  listHTML!: HTMLElement | null;
  unAcceppClick: any;
  
  touchStartX = 0;
  touchEndX = 0;
  swipeThreshold = 50; // Minimum distance to trigger swipe

  private isScrolling = false; // Flag to prevent multiple triggers
  private scrollTimeout: any;

  private isScrollable = true;

  private autoSlideInterval: any;
  private isPaused = false; // Flag for pausing autoplay


  constructor() {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngAfterViewInit(): void {
    this.carousel = document.querySelector('.carousel');
    this.listHTML = document.querySelector('.carousel .list');

    this.carousel?.addEventListener('mouseenter', () => this.pauseAutoSlide());
    this.carousel?.addEventListener('mouseleave', () => this.resumeAutoSlide());



    
    if (this.carousel && this.isScrollable) {
      // this.carousel.addEventListener(WheelEvent,);

     
      this.carousel.addEventListener('wheel', (event: WheelEvent) =>{
        // this.isScrolling = false;
        console.log(event); this.onWheel(event)
      
        setTimeout(() => {
          this.isScrollable = false;
        }, 1000);
      });
    }

   
  }


  pauseAutoSlide(): void {
    this.isPaused = true;
  }

  resumeAutoSlide(): void {
    this.isPaused = false;
  }


  onWheel(event: WheelEvent): void {
    // event.preventDefault();

    if (this.isScrolling) return; // Ignore extra events while scrolling

    this.isScrolling = true;
    clearTimeout(this.scrollTimeout); // Reset timeout if scrolling continues

    if (event.deltaX > 0 && event.deltaZ == 0 && event.deltaY == 0)  {
      
      this.showSlider('next'); // Scroll down → Next Slide
    } 
    else if((event.deltaX < 0 && event.deltaZ == 0 && event.deltaY == 0))
      this.showSlider('prev'); // Scroll up → Previous Slide
    else
      event.preventDefault();
    

    // Allow another scroll event after 500ms
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 1000);
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      if (!this.isPaused) {
        this.showSlider('next');
      }
    }, 4000); // Change slide every 4s
  }


  showSlider(type: 'next' | 'prev'): void {
    if (!this.carousel || !this.listHTML) return;

    const items = this.listHTML.querySelectorAll('.item');
    if (items.length === 0) return;

    this.carousel.classList.remove('next', 'prev');

    if (type === 'next') {
      this.listHTML.appendChild(items[0]);
      this.carousel.classList.add('next');
    } else {
      this.listHTML.prepend(items[items.length - 1]);
      this.carousel.classList.add('prev');
    }

    clearTimeout(this.unAcceppClick);
    this.unAcceppClick = setTimeout(() => {}, 2000);
  }
}
