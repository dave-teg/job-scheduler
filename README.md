# Job Scheduler System

A backend system for managing tasks, where Supervisors create tasks and the system automatically assigns them to available Agents.

## Features
- **Supervisors**:
  - Create tasks.
  - View all tasks they created.
- **Agents**:
  - View assigned tasks.
  - Mark tasks as complete.
- **System**:
  - Automatically assigns tasks to the least-busy Agent.
  - Ensures fair task distribution.

## Technologies
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/dave-teg/job-scheduler.git
2. Install dependencies:
   ```bash
   npm install
3. Create a .env file and add:
   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   PORT=5000
4. Run the server
   ```bash
   npm start

## Deployment
Deployed on https://render.com/
Access the live API at: https://job-scheduler-gs0h.onrender.com
