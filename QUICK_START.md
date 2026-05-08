QUICK START GUIDE
=================

This guide will help you get the Team Task Manager running locally.

STEP 1: Install Dependencies
=============================

From the root directory:

Option A - Install all at once:
npm run install-all

Option B - Install separately:
cd backend && npm install
cd ../frontend && npm install

STEP 2: Set up MongoDB
=====================

Option A - Local MongoDB:
1. Download and install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Create a database called "team-task-manager"

Option B - MongoDB Atlas (Cloud):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new cluster
4. Get connection string
5. Use it in backend/.env

STEP 3: Configure Environment Variables
========================================

Backend (backend/.env):
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your-secret-key-12345
JWT_EXPIRE=7d

Frontend (frontend/.env):
VITE_API_URL=http://localhost:5000/api

STEP 4: Start the Application
==============================

Option A - Run both together (requires concurrently):
npm run dev

Option B - Run separately (two terminal windows):
Terminal 1: npm run backend:start
Terminal 2: npm run frontend:dev

STEP 5: Access the Application
===============================

Frontend: http://localhost:3000
Backend API: http://localhost:5000/api

Test Endpoints:
- Health check: http://localhost:5000/api/health

STEP 6: Create Test Account
============================

1. Open http://localhost:3000 in your browser
2. Click "Sign up"
3. Fill in test data:
   Name: John Doe
   Email: john@example.com
   Password: password123
4. Click "Sign up"
5. You'll be logged in automatically

STEP 7: Test Core Features
===========================

1. Create a Project:
   - Click "Projects" in navigation
   - Click "New Project"
   - Name: "Test Project"
   - Click "Create Project"

2. Create a Task:
   - Click "View Details" on your project
   - Click "Add Task"
   - Title: "First Task"
   - Priority: "Medium"
   - Click "Create Task"

3. Update Task Status:
   - Use the dropdown to change status
   - Options: To Do, In Progress, Completed, Blocked

4. View Dashboard:
   - Click "Dashboard"
   - See your project and task statistics

TROUBLESHOOTING
===============

Port 5000 already in use:
- Linux/Mac: lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
- Windows: netstat -ano | findstr :5000 (then taskkill /PID <PID> /F)
- Or change PORT in backend/.env

Port 3000 already in use:
- Vite will automatically use next available port (usually 3001)

MongoDB connection error:
- Check MONGODB_URI in backend/.env
- Ensure MongoDB service is running
- For Atlas, check IP whitelist settings

API not connecting from frontend:
- Check VITE_API_URL in frontend/.env
- Ensure backend is running
- Check browser console for CORS errors

NEXT STEPS
==========

1. Set up Git repository:
   git init
   git add .
   git commit -m "Initial commit"

2. Push to GitHub:
   git remote add origin https://github.com/yourusername/team-task-manager
   git push -u origin main

3. Deploy to Railway:
   - Go to https://railway.app
   - Create new project
   - Connect GitHub repository
   - Add MongoDB service
   - Set environment variables
   - Deploy!

4. Update frontend .env.production with Railway backend URL

For more information, see README.txt
