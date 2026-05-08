RAILWAY DEPLOYMENT GUIDE
========================

Complete step-by-step guide to deploy Team Task Manager on Railway.

PREREQUISITES
=============

1. GitHub Account - https://github.com
2. Railway Account - https://railway.app (free tier available)
3. Git installed on your machine
4. Project files ready to push to GitHub

STEP 1: Prepare Your Repository
================================

1. Initialize git (if not done):
   git init

2. Add all files:
   git add .

3. Create initial commit:
   git commit -m "Initial commit: Team Task Manager"

4. Create GitHub repository:
   - Go to https://github.com/new
   - Name: team-task-manager
   - Choose Public (for easier Railway access)
   - Click "Create repository"

5. Add remote and push:
   git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
   git branch -M main
   git push -u origin main

STEP 2: Set Up MongoDB Atlas (Cloud Database)
==============================================

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Log in
3. Create a new project:
   - Project name: "Team Task Manager"
   - Click "Create Project"

4. Create a cluster:
   - Select "Free" tier (M0)
   - Cloud Provider: AWS
   - Region: Select closest to you
   - Click "Create Cluster"

5. Create database user:
   - Go to Database Access
   - Click "Add New Database User"
   - Username: admin
   - Password: Create strong password (save it!)
   - Built-in Role: Atlas Admin
   - Click "Add User"

6. Get connection string:
   - Go to "Database" section
   - Click "Connect" on your cluster
   - Select "Drivers" option
   - Copy connection string
   - Example: mongodb+srv://admin:PASSWORD@cluster0.mongodb.net/team-task-manager?retryWrites=true&w=majority

7. Add IP whitelist:
   - In Database Access, go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

STEP 3: Deploy Backend on Railway
==================================

1. Go to https://railway.app
2. Sign up / Log in (using GitHub is easiest)
3. Create new project:
   - Click "Create a new project"
   - Click "Deploy from GitHub repo"

4. Connect GitHub:
   - Click "Connect GitHub Account"
   - Authorize Railway
   - Select your "team-task-manager" repository
   - Select backend folder: select "backend" as the root directory

5. Configure environment variables:
   - In Railway dashboard for backend service:
   - Click "Variables" or "Config"
   - Add these variables:
     
     PORT=5000
     MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.mongodb.net/team-task-manager?retryWrites=true&w=majority
     JWT_SECRET=your-super-secret-key-min-32-chars-long-change-this
     JWT_EXPIRE=7d
     NODE_ENV=production

6. Wait for deployment:
   - Railway will automatically build and deploy
   - You'll see deployment logs
   - Once complete, you'll get a Railway URL like: https://team-task-manager-backend.railway.app

7. Test backend:
   - Visit: https://team-task-manager-backend.railway.app/api/health
   - Should return: {"success":true,"message":"Server is running"}

Note: Replace "YOUR_PASSWORD" with your actual MongoDB password

STEP 4: Deploy Frontend on Railway
===================================

1. In Railway dashboard, create another service:
   - Click "New Service"
   - Click "GitHub Repo"
   - Select "team-task-manager" repo again
   - This time it should auto-detect frontend

2. Configure for frontend:
   - Root Directory: frontend
   - Click "Deploy"

3. Set build and start commands:
   - Go to "Deployment" settings
   - Build Command: npm run build
   - Start Command: npm run preview (or use a static server)

4. Add environment variable:
   - VITE_API_URL=https://your-backend-railway-url/api
   - (Replace with actual URL from Step 3)

5. Wait for build and deployment:
   - Railway will build and deploy
   - You'll get frontend URL like: https://team-task-manager-frontend.railway.app

STEP 5: Connect Services on Railway
====================================

1. Link services (if needed):
   - In Railway project, services should auto-communicate
   - Frontend talks to backend via the VITE_API_URL environment variable

2. Test the application:
   - Open frontend URL in browser
   - Try to sign up
   - If successful, backend is properly connected

STEP 6: Verify Deployment
=========================

Test Checklist:
✓ Frontend loads at Railway URL
✓ Sign up page appears
✓ Can create an account
✓ Can log in
✓ Can create a project
✓ Can create a task
✓ Dashboard shows data
✓ Can update task status

If any test fails, check:
1. Backend deployment logs
2. Frontend build logs
3. MongoDB connection string
4. Environment variables are correctly set
5. CORS is enabled (backend has cors() middleware)

STEP 7: Custom Domain (Optional)
=================================

1. Purchase domain (GoDaddy, Namecheap, etc.)
2. In Railway, go to Settings
3. Click "Custom Domain"
4. Add your domain
5. Follow DNS setup instructions

TROUBLESHOOTING
===============

Build Fails:
- Check package.json has all dependencies
- Ensure .gitignore isn't excluding needed files
- Check build logs in Railway dashboard

App Won't Start:
- Check environment variables are set
- Verify MongoDB URI is correct
- Check all dependencies are in package.json

Frontend Shows Blank Page:
- Check browser console for errors
- Verify VITE_API_URL is set correctly
- Check network tab - API calls should reach backend

API 502/503 Error:
- Backend service might be down
- Check Railway backend logs
- Restart service in Railway dashboard

MongoDB Connection Error:
- Verify connection string in MONGODB_URI
- Check MongoDB Atlas IP whitelist
- Ensure database user password is correct
- Test connection locally first

ENVIRONMENT VARIABLES REFERENCE
===============================

Backend (.env):
PORT=5000
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=production

Frontend (.env.production):
VITE_API_URL=https://your-railway-backend.railway.app/api

MONITORING & MAINTENANCE
=========================

Regular checks:
1. Monitor logs in Railway dashboard
2. Check database usage in MongoDB Atlas
3. Watch for failed deployments
4. Monitor API response times

Scaling (if needed):
- In Railway, increase instance count
- Upgrade MongoDB tier from free to paid

Backup:
- MongoDB Atlas automatically backs up data
- Keep GitHub repository updated

SECURITY TIPS FOR PRODUCTION
=============================

1. Change JWT_SECRET to something very secure:
   - Use: openssl rand -base64 32
   - Or any 32+ character random string

2. Use MongoDB Atlas IP whitelist:
   - Only allow Railway IPs (get from Railway dashboard)
   - Don't use 0.0.0.0/0 in production

3. Enable HTTPS:
   - Railway provides free SSL
   - Enabled by default on *.railway.app

4. Regular updates:
   - Keep npm packages updated
   - Check for security vulnerabilities

5. Use environment variables for all secrets:
   - Never commit sensitive data to GitHub
   - Use Railway's environment variable system

ROLLBACK (If Something Goes Wrong)
==================================

In Railway:
1. Go to Deployments tab
2. Find previous working deployment
3. Click "Redeploy"

GitHub (if code issue):
1. git log --oneline (see commits)
2. git revert <commit-hash>
3. git push
4. Railway auto-redeploys

DATABASE BACKUP
================

From MongoDB Atlas:
1. Go to Database
2. Click on cluster
3. Click "..." menu
4. Click "Backup and Restore"
5. Download backup files

ESTIMATED MONTHLY COSTS
======================

Railway (Free tier for testing):
- Includes $5 credit/month
- Pricing starts at $0.10/minute after credit

MongoDB Atlas (Free tier):
- Up to 3 free databases
- Good for development/testing
- Paid tier for production

Estimated production cost: $10-50/month

NEXT STEPS AFTER DEPLOYMENT
============================

1. Share app URL with team
2. Create test accounts for team members
3. Set up analytics (optional)
4. Configure email notifications (optional)
5. Document usage for team
6. Regular backups and monitoring
7. Plan scaling strategy

GETTING HELP
============

Railway Support: https://railway.app/support
MongoDB Support: https://www.mongodb.com/support
Project GitHub Issues: Your GitHub repository

---

Deployment Complete! Your app is now live and accessible to the world.
