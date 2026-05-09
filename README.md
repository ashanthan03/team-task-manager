# Team Task Manager

A modern, full-stack task management application designed for teams to collaborate, organize projects, and track tasks efficiently. Built with React, Node.js, Express, and MongoDB, deployed on Railway.

**Live Demo:** https://team-task-manager-production-4308.up.railway.app

---

## 🎯 Features

### Core Functionality
- **User Authentication** - Secure signup/login with JWT tokens
- **Project Management** - Create, read, update, and delete projects
- **Task Management** - Organize tasks within projects with status tracking
- **Team Collaboration** - Add team members to projects
- **Dashboard** - Quick overview of all projects and tasks
- **Real-time Updates** - Instant task and project status changes

### User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Intuitive UI** - Clean, modern interface built with React
- **Role-based Access** - Manage project members and permissions
- **Task Filtering** - View tasks by status, priority, or assignee

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 - UI library for dynamic interfaces
- React Router v6 - Client-side routing
- Axios - HTTP client for API calls
- Tailwind CSS - Utility-first CSS framework
- Vite - Lightning-fast build tool

**Backend:**
- Node.js & Express - Server framework
- MongoDB - NoSQL database
- Mongoose - MongoDB ODM
- JWT (jsonwebtoken) - Secure authentication
- CORS - Cross-origin resource sharing

**Deployment:**
- Railway - Cloud hosting platform
- MongoDB Atlas - Cloud database

### Project Structure

```
team-task-manager/
├── frontend/                   # React application
│   ├── src/
│   │   ├── pages/             # Page components (Login, Signup, Dashboard, etc.)
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # API client (axios)
│   │   ├── context/           # Auth context (state management)
│   │   └── main.jsx           # Entry point
│   ├── vite.config.js         # Vite configuration
│   └── package.json
│
├── backend/                    # Express server
│   ├── src/
│   │   ├── routes/            # API endpoints (auth, projects, tasks)
│   │   ├── controllers/       # Business logic
│   │   ├── models/            # MongoDB schemas (User, Project, Task)
│   │   ├── middleware/        # Auth middleware
│   │   ├── config/            # Configuration
│   │   └── index.js           # Server entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (for cloud DB)
- Git

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashanthan03/team-task-manager.git
   cd team-task-manager
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env and add your MongoDB URI
   
   npm start
   # Server runs on http://localhost:5000
   ```

3. **Setup Frontend (in another terminal)**
   ```bash
   cd frontend
   npm install
   
   # Create .env file
   cp .env.example .env
   # VITE_API_URL should point to your backend
   
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

4. **Access the application**
   - Open http://localhost:5173 in your browser
   - Sign up with a new account
   - Start creating projects and tasks!

---

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/signup        - Create new user account
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user (protected)
```

### Projects
```
POST   /api/projects           - Create project (protected)
GET    /api/projects           - Get all projects (protected)
GET    /api/projects/:id       - Get project details (protected)
PUT    /api/projects/:id       - Update project (protected)
DELETE /api/projects/:id       - Delete project (protected)
POST   /api/projects/:id/members     - Add team member (protected)
DELETE /api/projects/:id/members     - Remove team member (protected)
```

### Tasks
```
POST   /api/tasks              - Create task (protected)
GET    /api/tasks              - Get all tasks (protected)
GET    /api/tasks/:id          - Get task details (protected)
PUT    /api/tasks/:id          - Update task (protected)
DELETE /api/tasks/:id          - Delete task (protected)
GET    /api/tasks/dashboard    - Get dashboard stats (protected)
```

---

## 🔐 Authentication & Security

- **JWT-based Authentication** - Stateless authentication using JSON Web Tokens
- **Password Hashing** - Passwords securely hashed before storage
- **Protected Routes** - API endpoints require valid JWT token in headers
- **CORS Configuration** - Secure cross-origin requests
- **Environment Variables** - Sensitive data stored in .env files

**Example Protected Request:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://team-task-manager-production-adcc.up.railway.app/api/projects
```

---

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: "user"),
  createdAt: Date
}
```

### Project Model
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (references User),
  members: [ObjectId] (references User),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  project: ObjectId (references Project),
  assignee: ObjectId (references User),
  status: String (enum: "pending", "in-progress", "completed"),
  priority: String (enum: "low", "medium", "high"),
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 Deployment

### Deploy to Railway

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect Railway to GitHub**
   - Go to [Railway.app](https://railway.app)
   - Create new project
   - Select your GitHub repository
   - Configure environment variables

3. **Environment Variables**

   **Backend (.env):**
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRE=7d
   ```

   **Frontend (.env.production):**
   ```
   VITE_API_URL=https://your-backend-url/api
   ```

4. **Deploy**
   - Railway auto-deploys on push to main
   - Monitor deployment in Railway dashboard
   - Check logs for any errors

---

## 🛠️ Development Workflow

### Available Scripts

**Backend:**
```bash
npm start      # Start server (production mode)
npm run dev    # Start with nodemon (development)
```

**Frontend:**
```bash
npm run dev    # Start Vite dev server
npm run build  # Build for production
npm run preview # Preview production build
```

### Code Quality Tips
- Follow RESTful API conventions
- Use descriptive variable and function names
- Add comments for complex logic
- Keep components small and reusable
- Test authentication flows thoroughly

---

## 🐛 Troubleshooting

**Frontend can't connect to backend:**
- Check `VITE_API_URL` in `.env` matches your backend URL
- Ensure backend is running and accessible
- Check browser console for CORS errors

**MongoDB connection failed:**
- Verify MongoDB Atlas connection string in `.env`
- Check IP whitelist in MongoDB Atlas settings
- Ensure network access is enabled

**Authentication not working:**
- Clear browser localStorage (stores JWT token)
- Check JWT_SECRET is same in backend
- Verify token is included in request headers

---

## 📝 Features Implemented

✅ User registration and login  
✅ JWT-based authentication  
✅ Create/read/update/delete projects  
✅ Create/read/update/delete tasks  
✅ Team member management  
✅ Task status tracking  
✅ Dashboard with task overview  
✅ Responsive UI design  
✅ Protected API routes  
✅ CORS configuration  
✅ MongoDB integration  
✅ Railway deployment  

---

## 🔮 Future Enhancements

- Task comments and discussions
- Real-time notifications
- Advanced filtering and search
- Task attachment support
- Team analytics and reporting
- Email notifications
- Calendar view for tasks
- User profile customization
- Dark mode theme
- Export tasks to PDF/CSV

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👤 Author

**Ashan** - Full Stack Developer

- GitHub: [@ashanthan03](https://github.com/ashanthan03)
- Project: [Team Task Manager](https://github.com/ashanthan03/team-task-manager)

---

## 📞 Support

For issues, questions, or suggestions:
1. Check existing [GitHub Issues](https://github.com/ashanthan03/team-task-manager/issues)
2. Create a new issue with detailed description
3. Include steps to reproduce and expected behavior

---

## 🎓 Learning Resources

This project demonstrates:
- Full-stack web development workflow
- REST API design principles
- JWT authentication implementation
- MongoDB database design
- React component architecture
- Environment-based configuration
- Cloud deployment practices
- Git and version control

---

**Made with ❤️ by Shanthan Kumar**
