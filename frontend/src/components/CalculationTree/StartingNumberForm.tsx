import React, { useState } from 'react';
import { calculationAPI } from '../../services/api';

interface StartingNumberFormProps {
    onSuccess: () => void;
}

export const StartingNumberForm: React.FC<StartingNumberFormProps> = ({ onSuccess }) => {
    const [number, setNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const numValue = parseFloat(number);
            if (isNaN(numValue)) {
                setError('Please enter a valid number');
                return;
            }

            await calculationAPI.createStartingNumber(numValue);
            setNumber('');
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create starting number');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Start a New Discussion</h3>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="number"
                    step="any"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Enter a starting number"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </form>
            {error && (
                <div className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded">{error}</div>
            )}
        </div>
    );
};
