import axios from 'axios';
import { AuthResponse, CalculationNode, Calculation } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },

  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

// Calculation endpoints
export const calculationAPI = {
  getAll: async (): Promise<CalculationNode[]> => {
    const response = await api.get('/calculations');
    return response.data;
  },

  createStartingNumber: async (startingNumber: number): Promise<Calculation> => {
    const response = await api.post('/calculations', { startingNumber });
    return response.data;
  },

  addOperation: async (
    parentId: number,
    operation: 'add' | 'subtract' | 'multiply' | 'divide',
    operand: number
  ): Promise<Calculation> => {
    const response = await api.post('/calculations', { parentId, operation, operand });
    return response.data;
  },
};

export default api;
