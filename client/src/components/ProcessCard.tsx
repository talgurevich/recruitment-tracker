import React, { useState } from 'react';
import { actionItems as actionItemsApi } from '../services/api';

interface ProcessCardProps {
  process: any;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ process, onUpdate, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showAddAction, setShowAddAction] = useState(false);
  const [actionTitle, setActionTitle] = useState('');

  const statusColors: Record<string, string> = {
    APPLIED: 'bg-blue-100 text-blue-800',
    SCREENING: 'bg-yellow-100 text-yellow-800',
    INTERVIEW: 'bg-purple-100 text-purple-800',
    OFFER: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    WITHDRAWN: 'bg-gray-100 text-gray-800',
  };

  const handleStatusChange = (newStatus: string) => {
    onUpdate(process.id, { status: newStatus });
  };

  const handleAddAction = async () => {
    if (!actionTitle.trim()) return;
    
    try {
      await actionItemsApi.create({
        processId: process.id,
        title: actionTitle,
        completed: false,
      });
      setActionTitle('');
      setShowAddAction(false);
      window.location.reload();
    } catch (error) {
      console.error('Failed to add action item:', error);
    }
  };

  const handleToggleAction = async (actionId: string, completed: boolean) => {
    try {
      await actionItemsApi.update(actionId, { completed: !completed });
      window.location.reload();
    } catch (error) {
      console.error('Failed to update action item:', error);
    }
  };

  const pendingActions = process.actionItems.filter((a: any) => !a.completed);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{process.companyName}</h3>
          <p className="text-gray-600">{process.position}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[process.status]}`}>
            {process.status}
          </span>
          <button
            onClick={() => onDelete(process.id)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Applied: {new Date(process.appliedDate).toLocaleDateString()}
      </div>

      {pendingActions.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-md">
          <div className="text-sm font-medium text-yellow-800">
            {pendingActions.length} pending action{pendingActions.length > 1 ? 's' : ''}
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
        <button
          onClick={() => setShowAddAction(!showAddAction)}
          className="text-green-600 hover:text-green-800 text-sm"
        >
          Add Action
        </button>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t">
          <div className="space-y-2 text-sm">
            {process.contactName && (
              <div>
                <span className="font-medium">Contact:</span> {process.contactName}
              </div>
            )}
            {process.contactEmail && (
              <div>
                <span className="font-medium">Email:</span> {process.contactEmail}
              </div>
            )}
            {process.contactPhone && (
              <div>
                <span className="font-medium">Phone:</span> {process.contactPhone}
              </div>
            )}
            {process.location && (
              <div>
                <span className="font-medium">Location:</span> {process.location}
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status:
            </label>
            <select
              value={process.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="APPLIED">Applied</option>
              <option value="SCREENING">Screening</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          {process.actionItems.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Action Items:</h4>
              <div className="space-y-2">
                {process.actionItems.map((action: any) => (
                  <div key={action.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={action.completed}
                      onChange={() => handleToggleAction(action.id, action.completed)}
                      className="mr-2"
                    />
                    <span className={action.completed ? 'line-through text-gray-500' : ''}>
                      {action.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showAddAction && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={actionTitle}
              onChange={(e) => setActionTitle(e.target.value)}
              placeholder="Enter action item..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              onKeyPress={(e) => e.key === 'Enter' && handleAddAction()}
            />
            <button
              onClick={handleAddAction}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessCard;