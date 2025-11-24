import React, { useEffect, useState } from 'react';
import { calculationAPI } from '../../services/api';
import { CalculationNode } from '../../types';
import { TreeNode } from './TreeNode';
import { StartingNumberForm } from './StartingNumberForm';
import { useAuth } from '../../context/AuthContext';

export const TreeView: React.FC = () => {
    const [trees, setTrees] = useState<CalculationNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated } = useAuth();

    const fetchCalculations = async () => {
        try {
            setLoading(true);
            const data = await calculationAPI.getAll();
            setTrees(data);
            setError('');
        } catch (err: any) {
            setError('Failed to load calculations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCalculations();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-600">Loading calculations...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {isAuthenticated && <StartingNumberForm onSuccess={fetchCalculations} />}

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {trees.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-600">
                    <p className="text-lg mb-2">No discussions yet</p>
                    {isAuthenticated ? (
                        <p className="text-sm">Start a new discussion by entering a starting number above</p>
                    ) : (
                        <p className="text-sm">Login to start a discussion</p>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {trees.map((tree) => (
                        <TreeNode key={tree.id} node={tree} onUpdate={fetchCalculations} isRoot />
                    ))}
                </div>
            )}
        </div>
    );
};
