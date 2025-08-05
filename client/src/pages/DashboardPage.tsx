import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { processes as processesApi, auth as authApi } from '../services/api';
import ProcessTable from '../components/ProcessTable';
import CreateProcessModal from '../components/CreateProcessModal';
import WeightSetupModal from '../components/WeightSetupModal';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [processes, setProcesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showWeightSetup, setShowWeightSetup] = useState(false);
  const [hasSetupWeights, setHasSetupWeights] = useState(true); // Default to true to prevent flash

  useEffect(() => {
    fetchProcesses();
    checkWeightSetup();
  }, []);

  const fetchProcesses = async () => {
    try {
      const data = await processesApi.getAll();
      setProcesses(data);
    } catch (error) {
      console.error('Failed to fetch processes:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWeightSetup = async () => {
    try {
      // Check if user has dismissed the popup
      const dismissed = localStorage.getItem('weightPopupDismissed');
      if (dismissed === 'true') {
        setHasSetupWeights(true);
        return;
      }

      const response = await authApi.getExcitementWeights();
      // Check if weights are still default (user hasn't customized them)
      const weights = response.weights;
      const defaultSum = weights.salary === 0.35 && weights.workLife === 0.25;
      setHasSetupWeights(!defaultSum);
    } catch (error) {
      console.error('Failed to check weight setup:', error);
      setHasSetupWeights(true); // Hide popup on error
    }
  };

  const handleCreateProcess = async (data: any) => {
    try {
      const newProcess = await processesApi.create(data);
      setProcesses([newProcess, ...processes]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create process:', error);
    }
  };

  const handleUpdateProcess = async (id: string, data: any) => {
    try {
      const updated = await processesApi.update(id, data);
      setProcesses(processes.map(p => p.id === id ? updated : p));
    } catch (error) {
      console.error('Failed to update process:', error);
    }
  };

  const handleDeleteProcess = async (id: string) => {
    try {
      await processesApi.delete(id);
      setProcesses(processes.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete process:', error);
    }
  };

  // Separate active and inactive applications
  const activeProcesses = processes.filter(p => !['REJECTED', 'WITHDRAWN'].includes(p.status));
  const inactiveProcesses = processes.filter(p => ['REJECTED', 'WITHDRAWN'].includes(p.status));
  
  const filteredActiveProcesses = filterStatus === 'all'
    ? activeProcesses
    : activeProcesses.filter(p => p.status === filterStatus);

  // Count only active processes for main statistics
  const activeStatusCounts = activeProcesses.reduce((acc, process) => {
    acc[process.status] = (acc[process.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Count all processes (including inactive) for complete statistics
  const allStatusCounts = processes.reduce((acc, process) => {
    acc[process.status] = (acc[process.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Job Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowWeightSetup(true)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center space-x-1"
                title="Edit Excitement Weights"
              >
                <span>⚙️</span>
                <span>Edit Weights</span>
              </button>
              <span className="text-gray-700">Hi, {user?.name}</span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Dashboard</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">{activeProcesses.length}</div>
              <div className="text-gray-600 text-sm">Active Applications</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">
                {(activeStatusCounts.INTERVIEW || 0) + (activeStatusCounts.HOME_ASSIGNMENT || 0)}
              </div>
              <div className="text-gray-600 text-sm">In Progress</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-600">{activeStatusCounts.OFFER || 0}</div>
              <div className="text-gray-600 text-sm">Offers</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-orange-600">
                {activeProcesses.reduce((count, p) => count + p.actionItems.filter((a: any) => !a.completed).length, 0)}
              </div>
              <div className="text-gray-600 text-sm">Pending Actions</div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Excitement Weight Model</p>
              <p className="text-xs text-yellow-600 mt-1">Customize how job excitement is calculated based on your priorities</p>
            </div>
            <button
              onClick={() => setShowWeightSetup(true)}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm font-medium"
            >
              Edit Weights
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-md ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Active ({activeProcesses.length})
              </button>
              <button
                onClick={() => setFilterStatus('APPLIED')}
                className={`px-4 py-2 rounded-md ${
                  filterStatus === 'APPLIED'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Applied ({activeStatusCounts.APPLIED || 0})
              </button>
              <button
                onClick={() => setFilterStatus('INTERVIEW')}
                className={`px-4 py-2 rounded-md ${
                  filterStatus === 'INTERVIEW'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Interview ({activeStatusCounts.INTERVIEW || 0})
              </button>
              <button
                onClick={() => setFilterStatus('HOME_ASSIGNMENT')}
                className={`px-4 py-2 rounded-md ${
                  filterStatus === 'HOME_ASSIGNMENT'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Home Assignment ({activeStatusCounts.HOME_ASSIGNMENT || 0})
              </button>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add New Application
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading your applications...</div>
          </div>
        ) : (
          <>
            {/* Active Applications Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Applications</h3>
              {filteredActiveProcesses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <div className="text-gray-500 mb-4">
                    {filterStatus === 'all'
                      ? "You haven't tracked any active applications yet."
                      : `No active applications with status: ${filterStatus}`}
                  </div>
                  {filterStatus === 'all' && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Track Your First Application
                    </button>
                  )}
                </div>
              ) : (
                <ProcessTable
                  processes={filteredActiveProcesses}
                  onUpdate={handleUpdateProcess}
                  onDelete={handleDeleteProcess}
                />
              )}
            </div>

            {/* Inactive Applications Section */}
            {inactiveProcesses.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-600">
                    Archived Applications ({inactiveProcesses.length})
                  </h3>
                  <div className="text-sm text-gray-500">
                    {allStatusCounts.REJECTED || 0} rejected, {allStatusCounts.WITHDRAWN || 0} withdrawn
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-1">
                  <ProcessTable
                    processes={inactiveProcesses}
                    onUpdate={handleUpdateProcess}
                    onDelete={handleDeleteProcess}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {showCreateModal && (
        <CreateProcessModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateProcess}
        />
      )}
      
      {showWeightSetup && (
        <WeightSetupModal
          onClose={() => setShowWeightSetup(false)}
          onSave={() => {
            setHasSetupWeights(true);
            localStorage.setItem('weightPopupDismissed', 'true');
            window.location.reload();
          }}
        />
      )}
      
      {!hasSetupWeights && !loading && processes.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <button
            onClick={() => {
              setHasSetupWeights(true);
              localStorage.setItem('weightPopupDismissed', 'true');
            }}
            className="absolute top-2 right-2 text-white hover:text-gray-200"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="font-semibold mb-2">Set up your excitement priorities!</p>
          <p className="text-sm mb-3">Customize how you measure excitement for job opportunities.</p>
          <button
            onClick={() => setShowWeightSetup(true)}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 font-medium"
          >
            Set Priorities
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;