export interface User {
  id: number;
  username: string;
}

export interface Calculation {
  id: number;
  user_id: number;
  parent_id: number | null;
  starting_number: number | null;
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | null;
  operand: number | null;
  result: number;
  created_at: string;
  username?: string;
}

export interface CalculationNode extends Calculation {
  children: CalculationNode[];
}

export interface AuthResponse {
  token: string;
  userId: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
