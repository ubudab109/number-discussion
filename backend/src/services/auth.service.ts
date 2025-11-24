import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/database';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

export const registerUser = async (username: string, password: string): Promise<{ token: string; userId: number }> => {
  // Check if user already exists
  const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

  if (existingUser.rows.length > 0) {
    throw new Error('Username already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Insert user
  const result = await pool.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id',
    [username, passwordHash]
  );

  const userId = result.rows[0].id;

  // Generate JWT
  const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '7d' });

  return { token, userId };
};

export const loginUser = async (username: string, password: string): Promise<{ token: string; userId: number }> => {
  // Find user
  const result = await pool.query('SELECT id, password_hash FROM users WHERE username = $1', [username]);

  if (result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];

  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT
  const token = jwt.sign({ userId: user.id, username }, JWT_SECRET, { expiresIn: '7d' });

  return { token, userId: user.id };
};

export const verifyToken = (token: string): { userId: number; username: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
