/* import express from 'express';
import { addTask } from '../controllers/taskController.js';

const router = express.Router();

router.post('/tasks', addTask);

export default router; */


import express from 'express';
import { addTask, assignUnassignedTasks, completeTaskController, getAssignedTasks, getTasksBySupervisor } from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/tasks', authenticateToken, addTask); //create new task
router.post('/tasks/assign', authenticateToken, assignUnassignedTasks); // assign unassigned tasks
router.put('/tasks/complete', authenticateToken, completeTaskController) //mark task as complete
router.get('/tasks/assigned', authenticateToken, getAssignedTasks) // get assigned tasks for agent
router.get('/tasks/created', authenticateToken, getTasksBySupervisor); // Get tasks created by Supervisor

export default router;
