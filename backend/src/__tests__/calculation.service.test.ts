import { createStartingNumber, addOperation, getAllCalculations } from '../services/calculation.service';
import { registerUser } from '../services/auth.service';
import { createTestPool, clearTestDatabase, closeTestDatabase } from './helpers/testDatabase';

// Mock the database module to use SQLite
jest.mock('../db/database', () => {
  const { createTestPool } = require('./helpers/testDatabase');
  return {
    __esModule: true,
    default: createTestPool(),
  };
});

describe('Calculation Service with SQLite', () => {
  let userId: number;

  beforeEach(async () => {
    clearTestDatabase();
    // Create a test user
    const result = await registerUser('testuser', 'password123');
    userId = result.userId;
  });

  afterAll(() => {
    closeTestDatabase();
  });

  describe('createStartingNumber', () => {
    it('should create a starting number successfully', async () => {
      const result = await createStartingNumber(userId, 10);

      expect(result).toHaveProperty('id');
      expect(result.user_id).toBe(userId);
      expect(result.starting_number).toBe(10);
      expect(result.result).toBe(10);
      expect(result.parent_id).toBeNull();
      expect(result.operation).toBeNull();
      expect(result.operand).toBeNull();
    });

    it('should create multiple starting numbers', async () => {
      const result1 = await createStartingNumber(userId, 10);
      const result2 = await createStartingNumber(userId, 20);

      expect(result1.id).not.toBe(result2.id);
      expect(result1.result).toBe(10);
      expect(result2.result).toBe(20);
    });
  });

  describe('addOperation', () => {
    let startingCalc: any;

    beforeEach(async () => {
      startingCalc = await createStartingNumber(userId, 10);
    });

    it('should add operation successfully', async () => {
      const result = await addOperation(userId, startingCalc.id, 'add', 5);

      expect(result.parent_id).toBe(startingCalc.id);
      expect(result.operation).toBe('add');
      expect(result.operand).toBe(5);
      expect(result.result).toBe(15);
    });

    it('should perform subtraction correctly', async () => {
      const result = await addOperation(userId, startingCalc.id, 'subtract', 3);

      expect(result.result).toBe(7);
      expect(result.operation).toBe('subtract');
    });

    it('should perform multiplication correctly', async () => {
      const result = await addOperation(userId, startingCalc.id, 'multiply', 2);

      expect(result.result).toBe(20);
      expect(result.operation).toBe('multiply');
    });

    it('should perform division correctly', async () => {
      const result = await addOperation(userId, startingCalc.id, 'divide', 2);

      expect(result.result).toBe(5);
      expect(result.operation).toBe('divide');
    });

    it('should throw error for division by zero', async () => {
      await expect(addOperation(userId, startingCalc.id, 'divide', 0)).rejects.toThrow(
        'Cannot divide by zero'
      );
    });

    it('should throw error if parent not found', async () => {
      await expect(addOperation(userId, 999, 'add', 5)).rejects.toThrow('Parent calculation not found');
    });

    it('should chain operations correctly', async () => {
      const calc1 = await addOperation(userId, startingCalc.id, 'add', 5); // 10 + 5 = 15
      const calc2 = await addOperation(userId, calc1.id, 'multiply', 2); // 15 * 2 = 30

      expect(calc2.result).toBe(30);
      expect(calc2.parent_id).toBe(calc1.id);
    });
  });

  describe('getAllCalculations', () => {
    it('should return empty array when no calculations exist', async () => {
      const result = await getAllCalculations();

      expect(result).toEqual([]);
    });

    it('should build tree structure correctly', async () => {
      const user2Result = await registerUser('user2', 'password123');
      const user2Id = user2Result.userId;

      // Create tree structure
      const root = await createStartingNumber(userId, 10);
      const child1 = await addOperation(userId, root.id, 'add', 5);
      const child2 = await addOperation(user2Id, root.id, 'multiply', 2);
      const grandchild = await addOperation(userId, child1.id, 'subtract', 3);

      const result = await getAllCalculations();

      expect(result).toHaveLength(1); // One root
      expect(result[0].id).toBe(root.id);
      expect(result[0].children).toHaveLength(2); // Two direct children
      expect(result[0].children![0].children).toHaveLength(1); // One grandchild
    });

    it('should include username in calculations', async () => {
      await createStartingNumber(userId, 10);

      const result = await getAllCalculations();

      expect(result[0].username).toBe('testuser');
    });
  });
});
