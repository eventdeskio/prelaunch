import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput } from '@ionic/angular/standalone';
import { AdminService } from '../service/adminservice'; 
import { HttpClientModule } from '@angular/common/http';// Import ToastrService

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.page.html',
  styleUrls: ['./admin-page.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, CommonModule, FormsModule, HttpClientModule],
  providers: [AdminService]
})
export class AdminPagePage implements OnInit {
  isAuthenticated = true;
  username = '';
  password = '';
  private readonly adminUsername = 'admin';
  private readonly adminPassword = '12345';
  sampleData: any[] = [];
  page = 1;
  limit = 10;

  constructor(
    private adminService: AdminService,
  ) {}

  ngOnInit() { 
    this.fetchResumes();
  }

  authenticate() {
    if (this.username === this.adminUsername && this.password === this.adminPassword) {
      this.isAuthenticated = true;
    } else {
      alert('Invalid Credentials');
    }
  }

  fetchResumes() {
    this.adminService.getResumes(this.page, this.limit).subscribe(
      (response) => {
        if (response.success) {
          this.sampleData = response.data;
          if (response.count === 0 && this.page > 1) {
            alert('You have reached the end of the page.');
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

  // Pagination Methods
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
}
