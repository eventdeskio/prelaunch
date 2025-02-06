# eventdesk-mvp
# EventDesk - An Event Management System 

**Description**: EventDesk is a comprehensive Angular-based application designed to simplify event planning and management. This platform enables vendors, admins, and users to collaboratively manage events, track progress, and handle requirements efficiently. The system integrates features such as dynamic routing, role-based navigation, email notifications, and a responsive user interface.

## Features 

1. **Secure Authentication:** Easy and safe login and signup using JWT (JSON Web Token).
2. **Role-Based Access:**
      Supports different roles:
         - *Super Admin:* Full control over the system.
         - *Admin:* Manages events and users.
         - *Host:* Organizes events.
         - *Vendor:* Provides services for events.
3. **Event Management:** Create, read, update, and delete events easily.
4. **Vendor and Host Integration:** Seamlessly assign vendors and hosts to events.
     
## Project Structure

**Backend Service**

The backend service is a Node.js application that provides an API for event management. It supports the following features:

- User authentication and role-based access control (RBAC)
- Event CRUD operations (Create, Read, Update, Delete)
- Vendor and host integration

**Frontend Application**

The frontend application is an Angular-based application that provides a user interface for managing events. It supports the following features:

- Role-based views and navigation
- Event list, preview, and details
- Service management
- Forgot password functionality with email-based reset

## Tech Stack

[![My Skills](https://skillicons.dev/icons?i=postgresql,angular,express,nodejs)](https://skillicons.dev)

## Prerequisites

- Angular CLI (v19)
- Node.js (v14 or higher)
- PostgreSQL database
- Email service credentials (for forgot password functionality)
- Environment Variables

The following environment variables are required to configure the backend service:

- **DB_USER**: PostgreSQL username
- **DB_PASSWORD**: PostgreSQL password
- **DB_HOST**: Database host (default: localhost)
- **DB_PORT**: Database port (default: 5432)
- **DB_NAME**: Name of the database
- **JWT_SECRET**: Secret key for JWT signing

## Setup Instructions

### Backend

1. Clone the repository: `git clone <repository_url>`
2. Install dependencies: `npm install`
3. Configure Database:
   - Create the required database and tables using the provided schema.
   - Create a `.env` file and set the environment variables as mentioned above.
4. Run the server: `npm start`
   - The server will run at [http://localhost:3000](http://localhost:3000)

### Frontend

1. Clone the repository: `git clone <repository_url>`
2. Install dependencies: `npm install`
3. Set up environment variables: Update `src/environment/environment.ts` with your API base URL.
4. Run the development server: `ng serve --port=4200`
   - Access the application at [http://localhost:4200](http://localhost:4200)

## Contact

For any questions or feedback, please reach out to: [krishnaag.317@gmail.com](mailto:krishnaag.317@gmail.com)
