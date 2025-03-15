import pool from '../db.js';

export async function createTask(supervisorId, name, priority) {
  const query = `
    INSERT INTO job_tasks (supervisor_id, name, priority)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const values = [supervisorId, name, priority];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function assignTask(taskId, agentId) {
  const query = `
    INSERT INTO assignments (task_id, agent_id)
    VALUES ($1, $2) RETURNING *;
  `;
  const values = [taskId, agentId];
  const { rows } = await pool.query(query, values);
  
  // Update job_tasks table to mark it as assigned
  await pool.query(`UPDATE job_tasks SET is_assigned = TRUE WHERE id = $1;`, [taskId]);

  // Update agent availability
  await pool.query(`UPDATE users SET is_available = FALSE WHERE id = $1;`, [agentId]);

  const { rows: taskRows } = await pool.query(`SELECT * FROM job_tasks WHERE id = $1;`, [taskId]);
  return taskRows[0]; // Return the updated task

}

/* export async function getAvailableAgent() {
  const query = `
    SELECT id FROM users WHERE role = 'Agent' AND is_available = TRUE
    ORDER BY (SELECT COUNT(*) FROM assignments WHERE assignments.agent_id = users.id) ASC
    LIMIT 1;
  `;
  const { rows } = await pool.query(query);
  return rows[0]; // Returns the least-busy available agent
} */

  export async function getAvailableAgent() {
    const query = `
      SELECT id FROM users WHERE role = 'Agent' AND is_available = TRUE
      ORDER BY (SELECT COUNT(*) FROM assignments JOIN job_tasks ON assignments.task_id = job_tasks.id WHERE assignments.agent_id = users.id AND job_tasks.is_completed = TRUE) ASC
      LIMIT 1;
    `;
    const { rows } = await pool.query(query);
    return rows[0]; // Returns the least-busy available agent
  }


  export async function getUnassignedTasks(supervisorId) {
    const query = `
      SELECT * FROM job_tasks
      WHERE supervisor_id = $1 AND is_assigned = FALSE
      ORDER BY priority ASC;
    `;
    const { rows } = await pool.query(query, [supervisorId]);
    return rows; // Returns all unassigned tasks for the Supervisor
  }

  export async function getAssignmentByTaskAndAgent(taskId, agentId) {
    const query = `
      SELECT * FROM assignments
      WHERE task_id = $1 AND agent_id = $2;
    `;
    const { rows } = await pool.query(query, [taskId, agentId]);
    return rows[0]; // Returns the assignment if found, otherwise undefined
  }
    

  export async function completeTask(taskId, agentId) {
    const query = `
      UPDATE job_tasks 
      SET is_completed = TRUE 
      WHERE id = $1 
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [taskId]);
  
    // Update agent availability
    await pool.query(`UPDATE users SET is_available = TRUE WHERE id = $1;`, [agentId]);
  
    return rows[0];
  }

  export async function getTasksByAgent(agentId) {
    const query = `
      SELECT job_tasks.*
      FROM job_tasks
      JOIN assignments ON job_tasks.id = assignments.task_id
      WHERE assignments.agent_id = $1 AND job_tasks.is_completed = FALSE;
    `;
    const { rows } = await pool.query(query, [agentId]);
    return rows; // Returns all assigned tasks for the Agent
  }

  export async function getTasksBySupervisorId(supervisorId) {
    const query = `
      SELECT * FROM job_tasks
      WHERE supervisor_id = $1;
    `;
    const { rows } = await pool.query(query, [supervisorId]);
    return rows; // Returns all tasks created by the Supervisor
  }