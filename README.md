# Student Study Portal - Trident Academy of Technology

A MERN stack student study portal with three user roles: Admin, Teacher, and Student.

## Features

### User Roles
- **Admin**: Full access to manage users, view/delete all assignments and notes
- **Teacher**: Add/edit/delete assignments and study notes with file uploads
- **Student**: View and download assignments and notes only

### Functionality
- JWT Authentication
- Role-based access control
- File upload for assignments and notes (PDF, DOC, PPT, etc.)
- Download functionality for all uploaded files
- Responsive design

## Tech Stack
- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (installed locally or use MongoDB Atlas)

## Installation & Setup

### 1. Backend Setup
```
bash
cd student-portal/server
npm install
```

### 2. Database Setup
Make sure MongoDB is running locally or update the connection string in `.env` file.

### 3. Frontend Setup
```
bash
cd student-portal/client
npm install
```

## Running the Application

### Start Backend Server
```
bash
cd student-portal/server
npm start
```
Server will run on http://localhost:5000

### Start Frontend
```
bash
cd student-portal/client
npm start
```
Client will run on http://localhost:3000

## Default Admin Account
After first registration with "admin" role, you can log in as admin.

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- GET `/api/auth/users` - Get all users (admin only)
- DELETE `/api/auth/users/:id` - Delete user (admin only)

### Assignments
- GET `/api/assignments` - Get all assignments
- POST `/api/assignments` - Create assignment (teacher/admin only)
- PUT `/api/assignments/:id` - Update assignment (owner/admin only)
- DELETE `/api/assignments/:id` - Delete assignment (owner/admin only)

### Notes
- GET `/api/notes` - Get all notes
- POST `/api/notes` - Create note (teacher/admin only)
- PUT `/api/notes/:id` - Update note (owner/admin only)
- DELETE `/api/notes/:id` - Delete note (owner/admin only)

## Project Structure
```
student-portal/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Assignment.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── assignments.js
│   │   └── notes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── AdminPanel.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── api.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## License
MIT
