# Student Study Portal - Trident Academy of Technology

## Project Overview
- **College Name**: Trident Academy of Technology
- **Tech Stack**: MERN (MongoDB, Express, React, Node.js)
- **Authentication**: JWT
- **File Upload**: Yes (for assignments and notes)

## User Roles
1. **Admin**: Full access (manage users, assignments, notes, delete anything)
2. **Teacher**: Add/edit/delete assignments and notes
3. **Student**: View and download assignments and notes only

## Project Structure

### Backend (server/)
- `server.js` - Main server file
- `models/User.js` - User model (name, email, password, role)
- `models/Assignment.js` - Assignment model
- `models/Note.js` - Note model
- `routes/auth.js` - Authentication routes
- `routes/assignments.js` - Assignment CRUD routes
- `routes/notes.js` - Note CRUD routes
- `middleware/auth.js` - JWT middleware
- `uploads/` - File storage directory

### Frontend (client/)
- `public/index.html`
- `src/App.js` - Main app with routing
- `src/pages/Login.js` - Login page
- `src/pages/Register.js` - Registration page
- `src/pages/Dashboard.js` - Main dashboard (role-based)
- `src/pages/AdminPanel.js` - Admin management
- `src/components/Navbar.js` - Navigation
- `src/api.js` - API configuration

## Implementation Steps
1. Create backend server with Express
2. Set up MongoDB connection
3. Create User, Assignment, Note models
4. Implement authentication with JWT
5. Create CRUD routes for assignments and notes
6. Implement file upload (multer)
7. Create React frontend
8. Implement role-based dashboard
9. Add file download functionality
10. Style the application

## Theme Colors
- Primary: #1e3a8a (Dark Blue)
- Secondary: #3b82f6 (Blue)
- Accent: #f59e0b (Amber)
- Background: #f8fafc (Light Gray)
- Text: #1e293b (Dark Slate)
