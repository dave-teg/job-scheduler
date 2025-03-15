import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { setupDatabase } from '../setupDB.js'; 

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Setup database schema on startup
setupDatabase()
  .then(() => {
    console.log('Database setup complete');
  })
  .catch((err) => {
    console.error('Failed to setup database:', err);
  });

// routes
app.use('/api', userRoutes);
app.use('/api', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
