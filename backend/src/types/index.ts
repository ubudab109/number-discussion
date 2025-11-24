export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: Date;
}

export interface Calculation {
  id: number;
  user_id: number;
  parent_id: number | null;
  starting_number: number | null;
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | null;
  operand: number | null;
  result: number;
  created_at: Date;
  username?: string;
}

export interface CalculationNode extends Calculation {
  children: CalculationNode[];
}

export interface AuthRequest extends Express.Request {
  userId?: number;
}
