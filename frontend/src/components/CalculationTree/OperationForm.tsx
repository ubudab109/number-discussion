import React, { useState } from 'react';
import { calculationAPI } from '../../services/api';

interface OperationFormProps {
    parentId: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export const OperationForm: React.FC<OperationFormProps> = ({ parentId, onSuccess, onCancel }) => {
    const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply' | 'divide'>('add');
    const [operand, setOperand] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const operandValue = parseFloat(operand);
            if (isNaN(operandValue)) {
                setError('Please enter a valid number');
                return;
            }

            if (operation === 'divide' && operandValue === 0) {
                setError('Cannot divide by zero');
                return;
            }

            await calculationAPI.addOperation(parentId, operation, operandValue);
            setOperand('');
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add operation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 p-3 rounded-md mt-2 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex gap-2">
                    <select
                        value={operation}
                        onChange={(e) => setOperation(e.target.value as any)}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="add">+ Add</option>
                        <option value="subtract">- Subtract</option>
                        <option value="multiply">x Multiply</option>
                        <option value="divide">÷ Divide</option>
                    </select>
                    <input
                        type="number"
                        step="any"
                        value={operand}
                        onChange={(e) => setOperand(e.target.value)}
                        placeholder="Enter number"
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                {error && (
                    <div className="text-red-600 text-xs bg-red-50 p-2 rounded">{error}</div>
                )}
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm transition-colors"
                    >
                        {loading ? 'Adding...' : 'Add'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400 text-sm transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};
