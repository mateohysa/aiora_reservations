# Aiora Reservations

- Overview
Aiora Reservations is a comprehensive, full-stack restaurant reservation management system designed for hotel restaurants. The platform enables staff to efficiently manage reservations across multiple restaurants, track guest information, and visualize table occupancy in real-time.
Built with a sleek, responsive UI, Aiora Reservations works seamlessly across desktop and mobile devices, allowing restaurant staff to manage reservations from anywhere.

- Features
Multi-Restaurant Support: Manage reservations for multiple restaurants from a single dashboard
Real-Time Table Visualization: Interactive table grid showing occupied, pending, and available tables
Guest Management: Track hotel guests and outside visitors with specialized fields for room numbers
Meal Deduction Tracking: Track meal deductions for hotel guests with all-inclusive packages
Advanced Search: Spotlight-style search functionality across all reservations
Responsive Design: Works on all devices from desktop to mobile
Role-Based Access: Different permission levels for staff and administrators
Reservation Status Flow: Track reservations from pending to confirmed to completed
Statistics Dashboard: View key metrics and reservation counts for each restaurant

- Technologies
Frontend
React.js
React Router for navigation
CSS with responsive design
Modern JavaScript (ES6+)
Backend
Java Spring Boot
Spring Security for authentication
JPA/Hibernate for database operations
RESTful API architecture
Database
MySQL / PostgreSQL

- Prerequisites
Node.js (v14+)
Java JDK (v11+)
Maven
PostgreSQL 

- Getting Started
Installation
Clone the repository
   git clone https://github.com/yourusername/aiora-reservations.git
   cd aiora-reservations
Set up the backend
   cd aiora_reservation_backend
   mvn install
Set up the database
   # Import the database dump
   mysql -u username -p database_name < aiora_reservations_dump.sql
Configure the backend
Edit application.properties with your database credentials:
    spring.datasource.url=jdbc:mysql://localhost:3306/your_database
   spring.datasource.username=your_username
   spring.datasource.password=your_password
Set up the frontend
   cd ../aiora_reservation_frontend
   npm install
Running the Application
Start the backend server
   cd aiora_reservation_backend
   mvn spring-boot:run
Start the frontend development server
   cd aiora_reservation_frontend
   npm run dev
Access the application
Open your browser and navigate to http://localhost:5173

- Mobile Responsiveness
Aiora Reservations is designed to work flawlessly on all device sizes:
Desktop: Full-featured dashboard with comprehensive statistics
Tablet: Optimized layouts for reservation management on-the-go
Mobile: Touch-friendly interfaces for quick status updates and table management
    
- Project Structure
aiora_reservations/
├── aiora_reservation_backend/      # Java Spring Boot backend
│   ├── src/main/java/
│   │   └── com/aiora/reservation_backend/
│   │       ├── api/                # REST API controllers
│   │       ├── dao/                # Data Access Objects
│   │       ├── model/              # Entity models
│   │       └── service/            # Business logic services
│   └── pom.xml                     # Maven dependencies
│
├── aiora_reservation_frontend/     # React frontend
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── assets/                 # Images and static resources
│   │   ├── components/             # React components
│   │   ├── services/               # API and auth services
│   │   ├── App.jsx                 # Main application component
│   │   └── main.jsx                # Application entry point
│   ├── index.html                  # HTML template
│   └── package.json                # npm dependencies
│
└── README.md                       # Project documentation
- Authentication
Aiora Reservations uses JWT (JSON Web Tokens) for secure authentication. The login system supports:
Username/password authentication
Persistent sessions with token storage
Role-based access control
Session timeouts for security

- State Flow
User Authentication: Staff login to access the system
Dashboard View: Overview of all restaurants and their current status
Restaurant Selection: Select specific restaurant to manage
Table Management: View table status and create/edit reservations
Reservation Lifecycle: Track reservations from creation to completion