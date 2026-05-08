TEAM TASK MANAGER - README
==========================

A full-stack web application for managing team projects and tasks with role-based access control.

PROJECT OVERVIEW
================

This application allows teams to:
- Create and manage projects
- Assign tasks to team members
- Track task progress and status
- View project dashboards with metrics
- Manage team members with role-based access
- Track overdue tasks and completion rates

TECH STACK
==========

Backend:
- Node.js + Express.js (REST APIs)
- MongoDB (Database)
- JWT (Authentication)
- bcryptjs (Password hashing)

Frontend:
- React 18
- React Router (Navigation)
- Axios (API calls)
- Tailwind CSS (Styling)

FEATURES
========

1. AUTHENTICATION
   - User signup and login
   - JWT-based authentication
   - Password hashing with bcrypt
   - Token stored in localStorage

2. PROJECT MANAGEMENT
   - Create/Update/Delete projects
   - Add/Remove team members
   - Role-based permissions (Admin/Member)
   - Project status tracking (active/archived/completed)

3. TASK MANAGEMENT
   - Create/Update/Delete tasks
   - Assign tasks to team members
   - Status tracking (todo/in-progress/completed/blocked)
   - Priority levels (low/medium/high/urgent)
   - Due date management
   - Overdue tracking

4. DASHBOARD
   - Total projects count
   - Total tasks count
   - Completion percentage
   - Overdue tasks count
   - Recent tasks list
   - Personal task assignments

5. ROLE-BASED ACCESS CONTROL
   - Admin: Full access to all features
   - Member: Limited access to assigned projects/tasks

INSTALLATION & SETUP
====================

Prerequisites:
- Node.js (v14+)
- MongoDB (Local or Atlas cloud database)
- Git

Backend Setup:
1. Navigate to backend directory: cd backend
2. Install dependencies: npm install
3. Create .env file with:
   - PORT=5000
   - MONGODB_URI=your_mongodb_connection_string
   - JWT_SECRET=your_secret_key
   - JWT_EXPIRE=7d
4. Start server: npm start (or npm run dev for development)

Frontend Setup:
1. Navigate to frontend directory: cd frontend
2. Install dependencies: npm install
3. Create .env file with:
   - VITE_API_URL=http://localhost:5000/api
4. Start development server: npm run dev
5. Build for production: npm run build

DATABASE SCHEMA
===============

Users Collection:
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/member),
  createdAt: Date
}

Projects Collection:
{
  _id: ObjectId,
  name: String,
  description: String,
  owner: ObjectId (User),
  members: [{
    user: ObjectId (User),
    role: String (admin/member)
  }],
  status: String (active/archived/completed),
  createdAt: Date,
  updatedAt: Date
}

Tasks Collection:
{
  _id: ObjectId,
  title: String,
  description: String,
  project: ObjectId (Project),
  assignedTo: ObjectId (User),
  createdBy: ObjectId (User),
  status: String (todo/in-progress/completed/blocked),
  priority: String (low/medium/high/urgent),
  dueDate: Date,
  isOverdue: Boolean,
  createdAt: Date,
  updatedAt: Date
}

API ENDPOINTS
=============

Authentication:
POST   /api/auth/signup        - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user (protected)

Projects:
POST   /api/projects           - Create project (protected)
GET    /api/projects           - Get all user projects (protected)
GET    /api/projects/:id       - Get project details (protected)
PUT    /api/projects/:id       - Update project (protected)
DELETE /api/projects/:id       - Delete project (protected)
POST   /api/projects/:id/members     - Add member to project (protected)
DELETE /api/projects/:id/members     - Remove member from project (protected)

Tasks:
POST   /api/tasks              - Create task (protected)
GET    /api/tasks              - Get all tasks with filters (protected)
GET    /api/tasks/:id          - Get task details (protected)
PUT    /api/tasks/:id          - Update task (protected)
DELETE /api/tasks/:id          - Delete task (protected)
GET    /api/tasks/dashboard    - Get dashboard stats (protected)

DEPLOYMENT TO RAILWAY
======================

Prerequisites:
- Railway account (https://railway.app)
- GitHub repository with the code

Steps:
1. Push code to GitHub
2. Go to railway.app and login
3. Create new project
4. Select "Deploy from GitHub repo"
5. Connect your GitHub repository
6. Add MongoDB service:
   - Add service > MongoDB
   - Copy connection string
7. Add environment variables in Railway:
   - PORT=5000
   - MONGODB_URI=(from MongoDB service)
   - JWT_SECRET=your_secret_key
   - JWT_EXPIRE=7d
8. Backend will deploy automatically
9. For frontend, use Static Site service:
   - Build command: npm run build
   - Start command: npm start (if using server)
   - Root directory: frontend/dist

Update frontend .env.production with deployed backend URL:
VITE_API_URL=https://your-railway-backend.railway.app/api

FOLDER STRUCTURE
================

team-task-manager/
├── backend/
│   ├── src/
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth & validation
│   │   ├── config/          # Configuration
│   │   └── index.js         # Server entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # React context
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.txt

TESTING THE APP
===============

1. Create an account:
   - Go to /signup
   - Fill in name, email, password
   - Submit

2. Login:
   - Go to /login
   - Use your credentials
   - You'll be redirected to dashboard

3. Create a project:
   - Click "Projects" in navigation
   - Click "New Project"
   - Fill in name and description
   - Submit

4. Create a task:
   - Go to project details
   - Click "Add Task"
   - Fill in title, description, priority
   - Submit

5. Update task status:
   - In project view, select new status from dropdown
   - Status updates immediately

6. View dashboard:
   - Dashboard shows overall statistics
   - Recent tasks and your assigned tasks

TROUBLESHOOTING
===============

MongoDB Connection Issues:
- Check MONGODB_URI in .env
- Ensure MongoDB Atlas IP whitelist includes your IP
- Use proper connection string format

API Not Connecting:
- Verify backend is running (npm start)
- Check CORS settings in backend
- Verify API URL in frontend .env

Port Already in Use:
- Backend: Change PORT in .env or kill process on port 5000
- Frontend: Vite will use next available port

FUTURE ENHANCEMENTS
====================

- Email notifications for task assignments
- Real-time updates with WebSockets
- File attachments for tasks
- Task comments and activity log
- Advanced filtering and sorting
- Calendar view for tasks
- Team analytics and reports
- Mobile app version

SECURITY CONSIDERATIONS
=======================

- Passwords are hashed with bcrypt
- JWT tokens used for stateless authentication
- Token expiration set to 7 days
- Role-based access control implemented
- Input validation on all endpoints
- MongoDB injection prevention with mongoose

For production deployment:
- Use strong JWT_SECRET
- Enable HTTPS/SSL
- Set secure CORS origins
- Use environment variables for secrets
- Enable MongoDB IP whitelist
- Regular security audits

SUPPORT & FEEDBACK
==================

For issues or feedback:
- Create issue on GitHub repository
- Check existing issues for solutions

VERSION HISTORY
===============

v1.0.0 - Initial release
- Basic authentication
- Project management
- Task management
- Dashboard
- Role-based access control

---

Built with ❤️ for effective team collaboration
