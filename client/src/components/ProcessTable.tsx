import React, { useState } from 'react';
import { actionItems as actionItemsApi } from '../services/api';
import EditProcessModal from './EditProcessModal';

interface ProcessTableProps {
  processes: any[];
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

const ProcessTable: React.FC<ProcessTableProps> = ({ processes, onUpdate, onDelete }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showAddAction, setShowAddAction] = useState<string | null>(null);
  const [actionTitle, setActionTitle] = useState('');
  const [editingProcess, setEditingProcess] = useState<any | null>(null);

  const statusColors: Record<string, string> = {
    APPLIED: 'bg-blue-100 text-blue-800',
    SCREENING: 'bg-yellow-100 text-yellow-800',
    INTERVIEW: 'bg-purple-100 text-purple-800',
    OFFER: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    WITHDRAWN: 'bg-gray-100 text-gray-800',
  };

  const toggleRow = (processId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(processId)) {
      newExpanded.delete(processId);
    } else {
      newExpanded.add(processId);
    }
    setExpandedRows(newExpanded);
  };

  const handleStatusChange = (processId: string, newStatus: string) => {
    onUpdate(processId, { status: newStatus });
  };

  const handleAddAction = async (processId: string) => {
    if (!actionTitle.trim()) return;
    
    try {
      await actionItemsApi.create({
        processId,
        title: actionTitle,
        completed: false,
      });
      setActionTitle('');
      setShowAddAction(null);
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

  const handleEditProcess = (data: any) => {
    onUpdate(editingProcess.id, data);
    setEditingProcess(null);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company & Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applied Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {processes.map((process) => (
            <React.Fragment key={process.id}>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{process.companyName}</div>
                    <div className="text-sm text-gray-500">{process.position}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={process.status}
                    onChange={(e) => handleStatusChange(process.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${statusColors[process.status]}`}
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="SCREENING">Screening</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="WITHDRAWN">Withdrawn</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {process.contactName && (
                    <div>{process.contactName}</div>
                  )}
                  {process.contactEmail && (
                    <div className="text-gray-500">{process.contactEmail}</div>
                  )}
                  {process.contactPhone && (
                    <div className="text-gray-500">{process.contactPhone}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(process.appliedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {process.actionItems.filter((a: any) => !a.completed).length > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {process.actionItems.filter((a: any) => !a.completed).length} pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => toggleRow(process.id)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    {expandedRows.has(process.id) ? '▼' : '▶'}
                  </button>
                  <button
                    onClick={() => setShowAddAction(showAddAction === process.id ? null : process.id)}
                    className="text-green-600 hover:text-green-900 mr-2"
                    title="Add Action Item"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setEditingProcess(process)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                    title="Edit Application"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(process.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Application"
                  >
                    ✕
                  </button>
                </td>
              </tr>
              
              {expandedRows.has(process.id) && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 bg-gray-50">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {process.location && (
                          <div>
                            <span className="font-medium text-gray-700">Location:</span>
                            <div className="text-gray-600">{process.location}</div>
                          </div>
                        )}
                        {process.jobType && (
                          <div>
                            <span className="font-medium text-gray-700">Job Type:</span>
                            <div className="text-gray-600">{process.jobType.replace('_', ' ')}</div>
                          </div>
                        )}
                        {process.source && (
                          <div>
                            <span className="font-medium text-gray-700">Source:</span>
                            <div className="text-gray-600">{process.source}</div>
                          </div>
                        )}
                      </div>
                      
                      {process.notes && (
                        <div>
                          <span className="font-medium text-gray-700">Notes:</span>
                          <div className="text-gray-600">{process.notes}</div>
                        </div>
                      )}
                      
                      {process.actionItems.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700">Action Items:</span>
                          <div className="mt-2 space-y-1">
                            {process.actionItems.map((action: any) => (
                              <div key={action.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={action.completed}
                                  onChange={() => handleToggleAction(action.id, action.completed)}
                                  className="mr-2"
                                />
                                <span className={action.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                                  {action.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              
              {showAddAction === process.id && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 bg-blue-50">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={actionTitle}
                        onChange={(e) => setActionTitle(e.target.value)}
                        placeholder="Enter action item..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddAction(process.id)}
                        autoFocus
                      />
                      <button
                        onClick={() => handleAddAction(process.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddAction(null)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      
      {processes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No applications found.
        </div>
      )}
      
      {editingProcess && (
        <EditProcessModal
          process={editingProcess}
          onClose={() => setEditingProcess(null)}
          onUpdate={handleEditProcess}
        />
      )}
    </div>
  );
};

export default ProcessTable;