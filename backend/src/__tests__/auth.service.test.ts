import { registerUser, loginUser, verifyToken } from '../services/auth.service';
import { createTestPool, clearTestDatabase, closeTestDatabase } from './helpers/testDatabase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock the database module to use SQLite
jest.mock('../db/database', () => {
  const { createTestPool } = require('./helpers/testDatabase');
  return {
    __esModule: true,
    default: createTestPool(),
  };
});

describe('Auth Service with SQLite', () => {
  beforeEach(() => {
    clearTestDatabase();
  });

  afterAll(() => {
    closeTestDatabase();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const result = await registerUser('testuser', 'password123');

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('userId');
      expect(typeof result.userId).toBe('number');
      expect(typeof result.token).toBe('string');
    });

    it('should throw error if username already exists', async () => {
      await registerUser('testuser', 'password123');

      await expect(registerUser('testuser', 'password456')).rejects.toThrow('Username already exists');
    });

    it('should hash the password', async () => {
      const result = await registerUser('testuser', 'password123');

      // Verify we can login with the same password
      const loginResult = await loginUser('testuser', 'password123');
      expect(loginResult.userId).toBe(result.userId);
    });
  });

  describe('loginUser', () => {
    beforeEach(async () => {
      await registerUser('testuser', 'password123');
    });

    it('should login user with correct credentials', async () => {
      const result = await loginUser('testuser', 'password123');

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('userId');
      expect(typeof result.token).toBe('string');
    });

    it('should throw error for invalid username', async () => {
      await expect(loginUser('wronguser', 'password123')).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for invalid password', async () => {
      await expect(loginUser('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      const { token, userId } = await registerUser('testuser', 'password123');

      const decoded = verifyToken(token);

      expect(decoded).toHaveProperty('userId', userId);
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid.token.here')).toThrow();
    });

    it('should throw error for expired token', () => {
      // Create an expired token
      const expiredToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'test-secret', {
        expiresIn: '-1h',
      });

      expect(() => verifyToken(expiredToken)).toThrow();
    });
  });
});
