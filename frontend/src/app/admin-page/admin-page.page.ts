import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput } from '@ionic/angular/standalone';
import { AdminService } from '../service/adminservice'; 
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.page.html',
  styleUrls: ['./admin-page.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, CommonModule, FormsModule, HttpClientModule],
  providers: [AdminService]
})
export class AdminPagePage implements OnInit {
  isAuthenticated = false;
  username = '';
  password = '';
  sampleData: any[] = [];
  page = 1;
  limit = 8;

  constructor(private adminService: AdminService,private toastr: ToastrService) {}

  ngOnInit() { 
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      this.isAuthenticated = true;
      this.fetchResumes();
    }
  }

  authenticate() {
    let credentials = {
      "username": this.username, 
      "password": this.password
    };

    this.adminService.auth(credentials).subscribe((res: any) => {
      console.log(res);
      if (res === true) {
        this.isAuthenticated = true;
        localStorage.setItem('isAuthenticated', 'true'); 
        this.fetchResumes();
      }
    });
  }

  fetchResumes() {
    this.adminService.getResumes(this.page, this.limit).subscribe(
      (response) => {
        if (response.success) {
          this.sampleData = response.data;
          if (response.count === 0 && this.page > 1) {
            this.toastr.info('You have reached the end of the page.');
            this.page--;  
            this.fetchResumes();  
          }
        }
      },
      (error) => {
        console.error('Error fetching resumes:', error);
      }
    );
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('isAuthenticated'); 
  }

  nextPage() {
    this.page++;
    this.fetchResumes();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchResumes();
    }
  }
  updateReviewedStatus() {
    const updates = this.sampleData
      .filter(app => app.reviewed !== undefined) 
      .map(app => ({ id: app.id, reviewed: app.reviewed }));

    if (updates.length === 0) {
      this.toastr.info("No changes to save.");
      return;
    }

    this.adminService.updateReviewedStatus(updates).subscribe(
      (response) => {
        if (response.success) {
          this.toastr.success("Reviewed status updated successfully.");
          this.fetchResumes(); 
        }
      },
      (error) => {
        console.error("Error updating review status:", error);
      }
    );
  }
}
