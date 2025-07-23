import { useState } from 'react';

const ExpenseCard = ({ expense, onStatusUpdate, canUpdateStatus }) => {
  const [updating, setUpdating] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await onStatusUpdate(expense._id, newStatus);
      // Force a small delay to ensure the UI updates properly
      await new Promise(resolve => setTimeout(resolve, 100));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            ${expense.amount.toFixed(2)}
          </h3>
          <p className="text-sm text-gray-600">{expense.category}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[expense.status]}`}>
          {expense.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div>
          <strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}
        </div>
        {expense.userId?.name && (
          <div>
            <strong>Employee:</strong> {expense.userId.name}
          </div>
        )}
        {expense.notes && (
          <div>
            <strong>Notes:</strong> {expense.notes}
          </div>
        )}
        {expense.approvedBy?.name && (
          <div>
            <strong>Approved by:</strong> {expense.approvedBy.name}
          </div>
        )}
      </div>
      
      {canUpdateStatus && expense.status === 'pending' && (
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => handleStatusUpdate('approved')}
            disabled={updating}
            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updating ? 'Updating...' : 'Approve'}
          </button>
          <button
            onClick={() => handleStatusUpdate('rejected')}
            disabled={updating}
            className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updating ? 'Updating...' : 'Reject'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;