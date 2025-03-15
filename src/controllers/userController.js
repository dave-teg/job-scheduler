import { createUser, getUserByEmail, getUserByUsername } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export async function registerUser(req, res) {
  const { username, email, password, role } = req.body;
  if (!['Supervisor', 'Agent'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

     // Check if username already exists
     const existingUserByUsername = await getUserByUsername(username);
     if (existingUserByUsername) {
       return res.status(400).json({ error: 'Username already exists' });
     }

    const user = await createUser(username, email, password, role);
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(500).json({ error: 'Error creating user' });
    console.error(err)
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Login error' });
  }
}
