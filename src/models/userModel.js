import pool from '../db.js';
import bcrypt from 'bcryptjs';

export async function createUser(username, email, password, role) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (username, email, password_hash, role)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const values = [username, email, hashedPassword, role];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function getUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
}

export async function getUserByUsername(username) {
  const query = `SELECT * FROM users WHERE username = $1;`;
  const { rows } = await pool.query(query, [username]);
  return rows[0]; // Returns the user if found, otherwise undefined
}

export async function setAgentAvailability(agentId, isAvailable) {
  const query = `UPDATE users SET is_available = $1 WHERE id = $2 RETURNING *;`;
  const { rows } = await pool.query(query, [isAvailable, agentId]);
  return rows[0];
}