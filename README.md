# Prelaunch Page for Event Management Website
## Developer Guidelines

### 1. Branching Strategy

#### Main Branches:
- **main**: Always in a deployable state (production-ready).
- **dev**: Latest development version, integrates features before moving to main.

#### Supporting Branches:
- **feature/<name>**: For new features or enhancements.
- **bugfix/<name>**: For fixing bugs found in the dev branch.
- **hotfix/<name>**: For urgent fixes to main.
- **chore/<name>**: For tasks like updating dependencies or documentation.

#### Rules:
- Create feature branches from `dev`.
- Merge feature branches back into `dev` using pull requests (PRs).
- Never push directly to `dev` or `main`. Always use PRs.

### 2. Workflow Process

#### Pull Latest Changes:
Always pull the latest changes from `dev` before starting any work:

git checkout dev
git pull origin dev

#### Create a New Branch:

Branch off from dev using the naming convention:

- git checkout -b feature/feature-name

#### Commit Frequently:

Keep commits small and focused on a single change or feature.
Use descriptive commit messages:

- feat: add user authentication using OAuth
- fix: resolve null pointer in dashboard component
  
**Push to Remote:**

- git push origin feature/feature-name
  
**Create a Pull Request (PR):**

- Ensure the PR is from feature/<name> to dev.
- Link related issues in the PR description.
- Assign at least one reviewer and do not merge your own PR.

**Code Review and Approval:**

- At least one approval required before merging.
- Address feedback promptly and push changes to the same branch.
- Sync with dev Before Merging:

Before merging, sync with the latest dev to avoid conflicts:
- git fetch origin dev
- git merge origin/dev
**Resolve any conflicts locally, test the build, and push again**.

**Merge and Delete Branch:**

After approval, Squash and Merge the PR.
Delete the feature branch from GitHub to keep the repo clean.

### 3. Tricks to Avoid Merge Conflicts

#### Trick #1: Short-Living Branches
Why: Long-living branches are prone to merge conflicts because the longer the branch exists, the more likely someone else will modify the same part of the code.
Guidelines:
Keep feature branches short-lived—preferably less than a day.
Merge changes back to dev frequently.
Example workflow:
##### Create and work on feature branch
- git checkout -b feature/new-ui-component
- git add .
- git commit -m "feat: add new UI component"
- git push origin feature/new-ui-component

##### Create Pull Request and merge back to dev quickly
##### After approval:
- git checkout dev
- git pull origin dev
- git branch -d feature/new-ui-component

#### Trick #2: Small Modules
Why: Following the Single Responsibility Principle from SOLID design ensures that a class or module has only one reason to change. This reduces the likelihood of two developers editing the same file simultaneously.
Guidelines:
- Split large components or classes into smaller, single-responsibility modules.
- Ensure each module has a clearly defined purpose.
- Use folder structures that reflect modular boundaries.
  **Example:**

src/ components/ Header/ ├── Header.js ├── Header.test.js Footer/ ├── Footer.js ├── Footer.test.js

Assign clear ownership of modules to team members to reduce overlaps.
4. Conflict Prevention Tips
Small, Incremental Changes:

Break down large tasks into smaller, manageable chunks.
Regularly push changes to avoid massive merges.
Frequent Syncing:

Regularly sync feature branches with the latest dev.
Example:

git fetch origin dev
git merge origin/dev
Clear Ownership:

Assign team members ownership of specific modules or components.
This reduces the chances of multiple people editing the same files.
5. Testing and CI/CD
Automated Tests:

Ensure all code is covered by unit tests.
Run tests locally before pushing.
Continuous Integration:

Implement CI pipelines that run tests and lint checks on every PR.
Example tools: GitHub Actions, CircleCI, or Jenkins.
No Failing Tests:

Do not merge PRs with failing tests.
6. Code Quality and Consistency
Linting and Formatting:

Enforce consistent code style using tools like ESLint and Prettier.
Include pre-commit hooks (e.g., using Husky) to run linters and tests:

"husky": {
  "hooks": {
    "pre-commit": "npm run lint && npm test"
  }
}
Code Reviews:

Focus on logic, readability, maintainability, and security.
Encourage constructive feedback and knowledge sharing.
7. Documentation and Communication
README Updates:

Update README.md if changes impact setup, usage, or deployment.
Comments and Documentation:

Document complex logic within the code.
Update API docs and architectural diagrams as needed.
Communication:

Regular stand-ups and clear communication in team channels to avoid duplicate work.
8. Example Git Commands
Creating a Branch:

git checkout -b feature/new-ui-component
Syncing with dev:

git fetch origin dev
git merge origin/dev
Rebasing (Alternative to Merge):

git pull --rebase origin dev
Resolving Conflicts:

git status
git add <file>
git commit

---

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

## Deployed @ 
- https://devf.eventdesk.io/

## License
This project is licensed under the MIT License.

## Contact
For any questions or feedback, feel free to reach out:
- Email: raja@herocore.io
