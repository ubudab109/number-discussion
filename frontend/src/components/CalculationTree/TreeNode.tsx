import React, { useState } from 'react';
import { CalculationNode } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { OperationForm } from './OperationForm';

interface TreeNodeProps {
    node: CalculationNode;
    onUpdate: () => void;
    isRoot?: boolean;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ node, onUpdate, isRoot = false }) => {
    const [showOperationForm, setShowOperationForm] = useState(false);
    const { isAuthenticated } = useAuth();

    const operationSymbols = {
        add: '+',
        subtract: '-',
        multiply: '×',
        divide: '÷',
    };

    const handleSuccess = () => {
        setShowOperationForm(false);
        onUpdate();
    };

    return (
        <div className={`${isRoot ? 'tree-root' : 'tree-node'} mb-4 fade-in`}>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        {node.starting_number !== null ? (
                            <div className="text-lg font-semibold text-purple-600">
                                Starting: {node.starting_number}
                            </div>
                        ) : (
                            <div className="text-lg">
                                <span className="text-gray-600">
                                    {operationSymbols[node.operation!]} {node.operand}
                                </span>
                            </div>
                        )}
                        <div className="text-xl font-bold text-gray-800">
                            = {node.result}
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        by <span className="font-medium">{node.username}</span>
                    </div>
                </div>

                {isAuthenticated && (
                    <div className="mt-2">
                        {!showOperationForm ? (
                            <button
                                onClick={() => setShowOperationForm(true)}
                                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors"
                            >
                                + Add Operation
                            </button>
                        ) : (
                            <OperationForm
                                parentId={node.id}
                                onSuccess={handleSuccess}
                                onCancel={() => setShowOperationForm(false)}
                            />
                        )}
                    </div>
                )}
            </div>

            {node.children && node.children.length > 0 && (
                <div className="mt-2">
                    {node.children.map((child) => (
                        <TreeNode key={child.id} node={child} onUpdate={onUpdate} />
                    ))}
                </div>
            )}
        </div>
    );
};
