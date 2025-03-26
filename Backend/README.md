# CoSA Student Database Backend

Welcome to the backend of the CoSA Student Database project! This application is built using Node.js, Express, and MongoDB, providing a comprehensive solution for managing student data and positions of responsibility (PORs) in an educational context.

## Table of Contents
- [CoSA Student Database Backend](#cosa-student-database-backend)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Project Structure](#project-structure)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Students](#students)
    - [Tenures](#tenures)
    - [Skills](#skills)
    - [Events](#events)
    - [Room Requests](#room-requests)
    - [Feedback](#feedback)
  - [Authentication](#authentication-1)
  - [Contributing](#contributing)
  - [License](#license)

## Features
- User registration and login
- Authentication via JWT and Google OAuth
- Role-based access control for different user roles (e.g., President, General Secretary)
- CRUD operations for student records and various PORs
- Skill endorsement system with domain-specific approvals
- Event management and room booking system
- Feedback collection and management
- Error handling and logging

## Project Structure
```
Backend/
├── config/               # Configuration files
│   ├── database.js       # Database connection setup
│   └── passport.js       # Passport authentication setup
├── controllers/          # Request handlers
│   ├── auth.controller.js
│   ├── event.controller.js
│   ├── feedback.controller.js
│   ├── room.controller.js
│   ├── skill.controller.js
│   ├── student.controller.js
│   └── tenure.controller.js
├── middleware/           # Custom middleware
│   └── auth.middleware.js
├── models/               # MongoDB schemas
│   ├── event.model.js
│   ├── feedback.model.js
│   ├── room.model.js
│   ├── skill.model.js
│   ├── student.model.js
│   ├── tenure.model.js
│   └── user.model.js
├── routes/               # API routes
│   ├── auth.routes.js
│   ├── event.routes.js
│   ├── feedback.routes.js
│   ├── general.routes.js
│   ├── room.routes.js
│   ├── skill.routes.js
│   └── tenure.routes.js
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
├── index.js              # Entry point
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## Technologies Used
- **Node.js**: JavaScript runtime for server-side development
- **Express**: Web framework for building RESTful APIs
- **MongoDB**: NoSQL database for storing student and POR data
- **Mongoose**: ODM for MongoDB and Node.js
- **Passport.js**: Middleware for authentication
- **JWT (JSON Web Tokens)**: For secure authentication
- **dotenv**: For managing environment variables
- **Moment.js**: For date manipulation and formatting

## Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/cosa-student-database-backend.git
   cd cosa-student-database-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your environment variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```plaintext
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   FRONTEND_URL=http://localhost:3000
   BACKEND_URL=http://localhost:8000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run the application**:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Log in an existing user
- **POST /api/auth/logout**: Log out the user
- **GET /api/auth/fetchAuth**: Check authentication status
- **GET /api/auth/google**: Authenticate using Google
- **GET /api/auth/google/verify**: Google callback URL

### Students
- **POST /api/auth/add**: Add a new student
- **POST /api/auth/update**: Update student information
- **POST /api/auth/remove**: Remove a student
- **POST /api/auth/addRecord**: Add POR or achievement
- **POST /api/fetch**: Fetch student details

### Tenures
- **POST /api/tenure**: Create a new tenure record
- **GET /api/tenure**: Get all tenure records
- **GET /api/tenure/:studentId**: Get tenure records for a specific student
- **PUT /api/tenure/:id**: Update a tenure record
- **DELETE /api/tenure/:id**: Delete a tenure record

### Skills
- **GET /api/skills**: Get all skills
- **GET /api/skills/:studentId**: Get skills of a specific student
- **POST /api/skills**: Add a new skill
- **DELETE /api/skills/:studentId/:skillId**: Remove a skill
- **GET /api/skills/unendorsed/tech**: Get unendorsed tech skills
- **PUT /api/skills/endorse/:skillId**: Endorse tech skill
- **Multiple specialized endpoints for different skill types**

### Events
- **POST /api/events**: Create a new event
- **GET /api/events**: Get all events
- **DELETE /api/events/:id**: Delete an event

### Room Requests
- **POST /api/rooms/request**: Submit a room request
- **GET /api/rooms/requests**: Get all room requests
- **PUT /api/rooms/request/:id/status**: Update room request status

### Feedback
- **POST /api/feedback**: Submit feedback
- **GET /api/feedback**: Get all feedback
- **GET /api/feedback/:userId**: Get feedback for a specific user

## Authentication
This application uses Passport.js for authentication with two strategies:
1. **Local Strategy**: Username/password authentication
2. **Google OAuth Strategy**: Authentication using Google accounts

Upon successful authentication, sessions are maintained using express-session.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
