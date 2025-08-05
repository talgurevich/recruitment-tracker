import React, { useState, useEffect } from 'react';
import { processes, auth } from '../services/api';

interface ExcitementRatingModalProps {
  process: any;
  onClose: () => void;
  onUpdate: () => void;
}

const categories = [
  { key: 'salary', label: 'Salary & Compensation', question: 'How satisfied are you with the compensation package?' },
  { key: 'workLife', label: 'Work-Life Balance', question: 'How well does this role fit your desired work-life balance?' },
  { key: 'growth', label: 'Career Growth', question: 'How strong are the growth and learning opportunities?' },
  { key: 'culture', label: 'Company Culture', question: 'How well do the company values and culture align with yours?' },
  { key: 'role', label: 'Role Interest', question: 'How excited are you about the actual work and responsibilities?' },
  { key: 'location', label: 'Location & Commute', question: 'How convenient is the location and work arrangement?' },
  { key: 'stability', label: 'Company Stability', question: 'How confident are you in the company\'s future and stability?' },
];

const ExcitementRatingModal: React.FC<ExcitementRatingModalProps> = ({ process, onClose, onUpdate }) => {
  const [scores, setScores] = useState<Record<string, number>>({
    salary: 3,
    workLife: 3,
    growth: 3,
    culture: 3,
    role: 3,
    location: 3,
    stability: 3,
  });
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [overallScore, setOverallScore] = useState(3);
  const [loading, setLoading] = useState(false);
  const [loadingWeights, setLoadingWeights] = useState(true);

  useEffect(() => {
    loadWeights();
    if (process.excitementRating) {
      try {
        // Handle case where excitementRating might already be an object
        const rating = typeof process.excitementRating === 'string' 
          ? JSON.parse(process.excitementRating) 
          : process.excitementRating;
        setScores(rating.scores);
        setNotes(rating.notes || {});
      } catch (error) {
        console.error('Error parsing excitement rating:', error);
        console.error('Raw data:', process.excitementRating);
      }
    }
  }, [process]);

  useEffect(() => {
    calculateOverallScore();
  }, [scores, weights]);

  const loadWeights = async () => {
    try {
      const response = await auth.getExcitementWeights();
      setWeights(response.weights);
    } catch (error) {
      console.error('Failed to load weights:', error);
    } finally {
      setLoadingWeights(false);
    }
  };

  const calculateOverallScore = () => {
    if (!weights || Object.keys(weights).length === 0) return;
    
    let weighted = 0;
    for (const [category, score] of Object.entries(scores)) {
      weighted += score * (weights[category] || 0);
    }
    setOverallScore(Math.round(weighted * 100) / 100);
  };

  const handleScoreChange = (category: string, score: number) => {
    setScores(prev => ({ ...prev, [category]: score }));
  };

  const handleNoteChange = (category: string, note: string) => {
    setNotes(prev => ({ ...prev, [category]: note }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await processes.updateExcitementRating(process.id, { scores, notes });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update excitement rating:', error);
      alert('Failed to update excitement rating');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-blue-600';
    if (score >= 2.5) return 'text-yellow-600';
    if (score >= 1.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const StarRating = ({ value, onChange, category }: { value: number; onChange: (v: number) => void; category: string }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl ${star <= value ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-500">
        ({(weights[category] * 100).toFixed(0)}% weight)
      </span>
    </div>
  );

  if (loadingWeights) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Rate Your Excitement</h2>
            <p className="text-sm text-gray-600 mt-1">{process.companyName} - {process.position}</p>
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

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Overall Excitement Score</h3>
          <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore.toFixed(2)} / 5.00
          </div>
          <p className="text-sm text-gray-600 mt-1">Based on your personal priority weights</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {categories.map((category) => (
            <div key={category.key} className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-1">{category.label}</h3>
              <p className="text-sm text-gray-600 mb-3">{category.question}</p>
              
              <StarRating
                value={scores[category.key]}
                onChange={(v) => handleScoreChange(category.key, v)}
                category={category.key}
              />
              
              <div className="mt-3">
                <textarea
                  value={notes[category.key] || ''}
                  onChange={(e) => handleNoteChange(category.key, e.target.value)}
                  placeholder="Add notes (optional)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={2}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <div className="space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Rating'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExcitementRatingModal;