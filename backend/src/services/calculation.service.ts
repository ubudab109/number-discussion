import pool from '../db/database';
import { Calculation, CalculationNode } from '../types';

export const createStartingNumber = async (userId: number, startingNumber: number): Promise<Calculation> => {
  const result = await pool.query(
    `INSERT INTO calculations (user_id, starting_number, result) 
     VALUES ($1, $2, $2) 
     RETURNING *`,
    [userId, startingNumber]
  );

  return result.rows[0];
};

export const addOperation = async (
  userId: number,
  parentId: number,
  operation: 'add' | 'subtract' | 'multiply' | 'divide',
  operand: number
): Promise<Calculation> => {
  // Get parent calculation
  const parentResult = await pool.query('SELECT result FROM calculations WHERE id = $1', [parentId]);

  if (parentResult.rows.length === 0) {
    throw new Error('Parent calculation not found');
  }

  const parentValue = parseFloat(parentResult.rows[0].result);
  let result: number;

  // Calculate result based on operation
  switch (operation) {
    case 'add':
      result = parentValue + operand;
      break;
    case 'subtract':
      result = parentValue - operand;
      break;
    case 'multiply':
      result = parentValue * operand;
      break;
    case 'divide':
      if (operand === 0) {
        throw new Error('Cannot divide by zero');
      }
      result = parentValue / operand;
      break;
    default:
      throw new Error('Invalid operation');
  }

  // Insert new calculation
  const insertResult = await pool.query(
    `INSERT INTO calculations (user_id, parent_id, operation, operand, result) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [userId, parentId, operation, operand, result]
  );

  return insertResult.rows[0];
};

export const getAllCalculations = async (): Promise<CalculationNode[]> => {
  // Fetch all calculations with usernames
  const result = await pool.query(`
    SELECT c.*, u.username 
    FROM calculations c 
    JOIN users u ON c.user_id = u.id 
    ORDER BY c.created_at ASC
  `);

  const calculations: Calculation[] = result.rows;

  // Build tree structure
  const calculationMap = new Map<number, CalculationNode>();
  const roots: CalculationNode[] = [];

  // Initialize all nodes
  calculations.forEach((calc) => {
    calculationMap.set(calc.id, { ...calc, children: [] });
  });

  // Build tree
  calculations.forEach((calc) => {
    const node = calculationMap.get(calc.id)!;

    if (calc.parent_id === null) {
      roots.push(node);
    } else {
      const parent = calculationMap.get(calc.parent_id);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return roots;
};
