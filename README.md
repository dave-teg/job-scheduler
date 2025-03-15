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
