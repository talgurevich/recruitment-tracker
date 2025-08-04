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
  const [hasSetupWeights, setHasSetupWeights] = useState(false);

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
      const response = await authApi.getExcitementWeights();
      // Check if weights are still default (user hasn't customized them)
      const weights = response.weights;
      const defaultSum = weights.salary === 0.35 && weights.workLife === 0.25;
      setHasSetupWeights(!defaultSum);
    } catch (error) {
      console.error('Failed to check weight setup:', error);
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

  const filteredProcesses = filterStatus === 'all'
    ? processes
    : processes.filter(p => p.status === filterStatus);

  const statusCounts = processes.reduce((acc, process) => {
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
                className="text-gray-600 hover:text-gray-800"
                title="Excitement Weight Settings"
              >
                ⚙️
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
              <div className="text-2xl font-bold text-blue-600">{processes.length}</div>
              <div className="text-gray-600 text-sm">Total Applications</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">{statusCounts.INTERVIEW || 0}</div>
              <div className="text-gray-600 text-sm">Interviews</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-600">{statusCounts.OFFER || 0}</div>
              <div className="text-gray-600 text-sm">Offers</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-orange-600">
                {processes.reduce((count, p) => count + p.actionItems.filter((a: any) => !a.completed).length, 0)}
              </div>
              <div className="text-gray-600 text-sm">Pending Actions</div>
            </div>
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
                All ({processes.length})
              </button>
              <button
                onClick={() => setFilterStatus('APPLIED')}
                className={`px-4 py-2 rounded-md ${
                  filterStatus === 'APPLIED'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Applied ({statusCounts.APPLIED || 0})
              </button>
              <button
                onClick={() => setFilterStatus('INTERVIEW')}
                className={`px-4 py-2 rounded-md ${
                  filterStatus === 'INTERVIEW'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Interview ({statusCounts.INTERVIEW || 0})
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
        ) : filteredProcesses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-500 mb-4">
              {filterStatus === 'all'
                ? "You haven't tracked any applications yet."
                : `No applications with status: ${filterStatus}`}
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
            processes={filteredProcesses}
            onUpdate={handleUpdateProcess}
            onDelete={handleDeleteProcess}
          />
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
            window.location.reload();
          }}
        />
      )}
      
      {!hasSetupWeights && !loading && processes.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
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