import { createTask, assignTask, getAvailableAgent, getUnassignedTasks,completeTask, getTasksByAgent, getTasksBySupervisorId, getAssignmentByTaskAndAgent } from '../models/taskModel.js';

export async function addTask(req, res) {
  const { name, priority } = req.body;
  const supervisorId = req.user.id;

  try {
    const task = await createTask(supervisorId, name, priority);
    const agent = await getAvailableAgent();
    if (agent) {
      const updatedTask = await assignTask(task.id, agent.id);
      res.status(201).json({ message: 'Task created and assigned', task: updatedTask });
    } else {
      res.status(201).json({ message: 'Task created but no available agent try again later', task });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error creating task' });
  }
}

export async function assignUnassignedTasks(req, res) {
  const supervisorId = req.user.id;

  try {
    // Fetch unassigned tasks for the Supervisor
    const unassignedTasks = await getUnassignedTasks(supervisorId);

    if (unassignedTasks.length === 0) {
      return res.status(200).json({ message: 'No unassigned tasks found' });
    }

    // Try to assign the first unassigned task
    const agent = await getAvailableAgent();
    if (agent) {
      const updatedTask = await assignTask(unassignedTasks[0].id, agent.id);
      return res.status(200).json({ message: 'Unassigned task assigned', task: updatedTask });
    } else {
      return res.status(200).json({ message: 'No available agent, try again later', task: unassignedTasks[0] });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error assigning unassigned tasks' });
    console.error(err)
  }
}

export async function completeTaskController(req, res){
  const { taskId } = req.body; 
  const agentId = req.user.id; 

  try {
    // Check if the task is assigned to the agent
    const assignment = await getAssignmentByTaskAndAgent(taskId, agentId);
    if (!assignment) {
      return res.status(403).json({ error: 'Task not assigned to you' });
    }

    const updatedTask = await completeTask(taskId, agentId);

    res.status(200).json({ message: 'Task marked as complete', task: updatedTask });
  } catch (err) {
    res.status(500).json({ error: 'Error completing task' });
    console.error(err)
  }
}

export async function getAssignedTasks(req, res) {
  const agentId = req.user.id; // Get agentId from the JWT token

  try {
    // Fetch tasks assigned to the agent
    const assignedTasks = await getTasksByAgent(agentId);
    res.status(200).json({ message: 'Assigned tasks fetched', tasks: assignedTasks });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching assigned tasks' });
  }
}

export async function getTasksBySupervisor(req, res) {
  const supervisorId = req.user.id; // Get supervisorId from the JWT token

  try {
    // Fetch tasks created by the Supervisor
    const tasks = await getTasksBySupervisorId(supervisorId);
    res.status(200).json({ message: 'Tasks fetched', tasks });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
}
