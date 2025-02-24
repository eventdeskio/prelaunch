import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-prelaunch-footer',
  templateUrl: './prelaunch-footer.component.html',
  styleUrls: ['./prelaunch-footer.component.scss'],
})
export class PrelaunchFooterComponent  implements OnInit {

  @Input() boyImageFlag: boolean = true; // Explicitly declare as boolean

  temp:boolean=true;
  constructor() { }

  ngOnInit() {
    console.log("Boy Image Flag:", this.boyImageFlag);
  }

}
