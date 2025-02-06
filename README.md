# Prelaunch Page for Event Management Website
### Dev
## Overview
This repository contains the prelaunch page for our upcoming Event Management website. The prelaunch page consists of two key sections:

1. **Landing Page**: Provides an overview of our platform and allows users to sign up for updates.
2. **Hiring Page**: A dedicated section where interested candidates can upload their resumes and provide their details.

The goal of this prelaunch page is to build anticipation for our platform and attract talented individuals to join our team.

## Tech Stack
The project is built using the following technologies:

- **Frontend**: Angular (for a dynamic and interactive UI)
- **Backend**: Node.js with Express (handling API requests and form submissions)
- **Database**: PostgreSQL (storing user data and job applications)
- **Deployment**: GitHub Actions CI/CD Pipeline

## Deployment & CI/CD Pipeline
This project is deployed using **GitHub Actions** with an automated CI/CD pipeline. The pipeline ensures:

- **Automated Rollbacks on Failure**: If a deployment fails due to a bug or critical error, the pipeline automatically rolls back to the last stable version.
- **Zero Downtime Deployments**: Ensures seamless updates without affecting live users, providing a smooth experience during releases.

## Features
### Landing Page
- Responsive and modern UI
- Email subscription form for updates
- Informational content about the upcoming platform

### Hiring Page
- Resume upload feature
- Form to collect candidate details (name, email, experience, etc.)
- Data securely stored in PostgreSQL

### Backend Functionality
- API endpoints for handling form submissions
- File upload and storage for resumes
- Data validation and error handling

### Deployment & Monitoring
- Continuous Integration and Deployment with GitHub Actions
- Health checks and monitoring for high availability
- Secure database integration with PostgreSQL

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js (v18+ recommended)
- PostgreSQL
- Angular CLI
- Git

### Setup Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/eventdeskio/prelaunch.git
   cd prelaunch-page
   ```

2. **Install dependencies:**
   ```sh
   npm install  # For backend
   cd frontend && npm install  # For Angular frontend
   ```

3. **Setup Environment Variables:**
   Create a `.env` file in the backend directory and add your configuration:
   ```env
   DATABASE_URL=//PostgreSQL DB url
   PORT=// Desired port
   ```

4. **Run the Application:**
   ```sh
   npm run dev  # Starts the backend
   cd frontend && ng serve  # Starts the Angular frontend
   ```

5. **Access the Website:**
   - Frontend: `http://localhost:4200`
   - Backend API: `http://localhost:5000`

## Deployment Process
This project follows an automated deployment pipeline:
1. **Push to GitHub:**
   - Code changes are pushed to the repository.
2. **CI/CD Pipeline Execution:**
   - The pipeline builds and tests the application.
3. **Zero Downtime Deployment:**
   - The new version is deployed while the existing version continues running.
4. **Health Check & Rollback:**
   - If any issues are detected, the deployment is rolled back automatically.

## License
This project is licensed under the MIT License.

## Contact
For any questions or feedback, feel free to reach out:
- Email: raja@herocore.io
