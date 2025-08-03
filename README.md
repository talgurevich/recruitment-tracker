# Job Recruitment Tracker

A full-stack application to track job applications, interviews, and action items during your job search.

## Features

- User authentication (register/login)
- Track recruitment processes with companies
- Manage application status (Applied, Screening, Interview, Offer, Rejected, Withdrawn)
- Store contact information and notes
- Create and manage action items for each application
- Dashboard with statistics and filters

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Deployment**: Heroku

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

3. Set up PostgreSQL database and update `.env` file in server directory:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/recruitment_tracker"
   JWT_SECRET="your-secret-key"
   ```

4. Run database migrations:
   ```bash
   cd server
   npx prisma migrate dev
   ```

5. Start development servers:
   ```bash
   # From root directory
   npm run dev
   ```

## Deployment to Heroku

### Prerequisites
- Heroku CLI installed
- Git repository initialized
- Heroku account

### Steps

1. **Create a new Heroku app:**
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL addon:**
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set JWT_SECRET="your-super-secure-production-secret-key-here"
   heroku config:set NODE_ENV="production"
   ```

4. **Initialize git and commit (if not done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

5. **Connect to Heroku and deploy:**
   ```bash
   heroku git:remote -a your-app-name
   git push heroku main
   ```

6. **Run database migrations:**
   ```bash
   heroku run npm run migrate
   ```

### Environment Variables
The following environment variables are automatically set by Heroku:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Port number for the application

You need to set:
- `JWT_SECRET` - A secure secret key for JWT tokens
- `NODE_ENV` - Set to "production"

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (authenticated)
- `GET /api/processes` - Get all recruitment processes (authenticated)
- `POST /api/processes` - Create new process (authenticated)
- `PUT /api/processes/:id` - Update process (authenticated)
- `DELETE /api/processes/:id` - Delete process (authenticated)
- `POST /api/action-items` - Create action item (authenticated)
- `PUT /api/action-items/:id` - Update action item (authenticated)
- `DELETE /api/action-items/:id` - Delete action item (authenticated)