import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { createStartingNumber, addOperation, getAllCalculations } from '../services/calculation.service';
import { AuthRequest } from '../types';

const router = Router();

// Get all calculations (public)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const calculations = await getAllCalculations();
    res.status(200).json(calculations);
  } catch (error) {
    console.error('Error fetching calculations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create calculation (requires auth)
router.post('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId!;
    const { startingNumber, parentId, operation, operand } = req.body;

    // Creating a starting number
    if (startingNumber !== undefined && parentId === undefined) {
      if (typeof startingNumber !== 'number') {
        res.status(400).json({ error: 'Starting number must be a number' });
        return;
      }

      const calculation = await createStartingNumber(userId, startingNumber);
      res.status(201).json(calculation);
      return;
    }

    // Adding an operation
    if (parentId !== undefined && operation && operand !== undefined) {
      if (!['add', 'subtract', 'multiply', 'divide'].includes(operation)) {
        res.status(400).json({ error: 'Invalid operation' });
        return;
      }

      if (typeof operand !== 'number') {
        res.status(400).json({ error: 'Operand must be a number' });
        return;
      }

      const calculation = await addOperation(userId, parentId, operation, operand);
      res.status(201).json(calculation);
      return;
    }

    res.status(400).json({ error: 'Invalid request body' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
