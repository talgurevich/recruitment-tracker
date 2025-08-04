import React, { useState, useEffect } from 'react';
import { auth } from '../services/api';

interface WeightSetupModalProps {
  onClose: () => void;
  onSave: () => void;
}

interface Category {
  key: string;
  label: string;
  description: string;
}

const categories: Category[] = [
  { key: 'salary', label: 'Salary & Compensation', description: 'Base salary, equity, bonuses, benefits' },
  { key: 'workLife', label: 'Work-Life Balance', description: 'Hours, flexibility, remote work, vacation' },
  { key: 'growth', label: 'Career Growth', description: 'Learning opportunities, promotion path, mentorship' },
  { key: 'culture', label: 'Company Culture', description: 'Team fit, values alignment, work environment' },
  { key: 'role', label: 'Role Interest', description: 'Job responsibilities, technical challenges, impact' },
  { key: 'location', label: 'Location & Commute', description: 'Office location, commute time, hybrid options' },
  { key: 'stability', label: 'Company Stability', description: 'Financial health, market position, job security' },
];

const WeightSetupModal: React.FC<WeightSetupModalProps> = ({ onClose, onSave }) => {
  const [orderedCategories, setOrderedCategories] = useState<Category[]>(categories);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateWeights();
  }, [orderedCategories]);

  const calculateWeights = () => {
    const newWeights: Record<string, number> = {};
    const weightValues = [0.35, 0.25, 0.15, 0.10, 0.08, 0.05, 0.02];
    
    orderedCategories.forEach((category, index) => {
      newWeights[category.key] = weightValues[index];
    });
    
    setWeights(newWeights);
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= orderedCategories.length) return;

    const items = Array.from(orderedCategories);
    const [movedItem] = items.splice(index, 1);
    items.splice(newIndex, 0, movedItem);
    setOrderedCategories(items);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await auth.updateExcitementWeights(weights);
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save weights:', error);
      alert('Failed to save priority weights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Set Your Priority Weights</h2>
            <p className="text-sm text-gray-600 mt-1">Use the up/down arrows to reorder categories by importance (most important at top)</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {orderedCategories.map((category, index) => (
            <div
              key={category.key}
              className="p-4 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveCategory(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveCategory(index, 'down')}
                      disabled={index === orderedCategories.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.label}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {(weights[category.key] * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500">Weight</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> The weights are automatically calculated based on your ranking. 
            The top priority gets 35% weight, decreasing down to 2% for the lowest priority.
          </p>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Weights'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeightSetupModal;