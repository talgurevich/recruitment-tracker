import React, { useState } from 'react';

interface RejectProcessModalProps {
  process: any;
  onClose: () => void;
  onReject: (data: { status: string; rejectionReason: string; rejectionDate: string }) => void;
}

const RejectProcessModal: React.FC<RejectProcessModalProps> = ({ process, onClose, onReject }) => {
  const [formData, setFormData] = useState({
    rejectionReason: '',
    rejectionDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    // Convert the date string to ISO format and send with status update
    onReject({
      status: 'REJECTED',
      rejectionReason: formData.rejectionReason,
      rejectionDate: new Date(formData.rejectionDate).toISOString()
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Reject Application</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Rejecting application for <span className="font-semibold">{process.position}</span> at{' '}
              <span className="font-semibold">{process.companyName}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rejection Date *
              </label>
              <input
                type="date"
                name="rejectionDate"
                value={formData.rejectionDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rejection *
              </label>
              <textarea
                name="rejectionReason"
                value={formData.rejectionReason}
                onChange={handleChange}
                required
                rows={4}
                placeholder="e.g., Position filled, Not a good fit, Salary expectations, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Mark as Rejected
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RejectProcessModal;