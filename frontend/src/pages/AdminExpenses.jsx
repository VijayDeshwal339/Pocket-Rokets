import { useState, useEffect } from 'react';
import ExpenseList from '../components/Expenses/ExpenseList';
import { expenseService } from '../services/api';

const AdminExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAllExpenses();
  }, []);

  const fetchAllExpenses = async () => {
    try {
      const response = await expenseService.getExpenses({ limit: 50 });
      setExpenses(response.expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (expenseId, newStatus) => {
    try {
      const updatedExpense = await expenseService.updateExpenseStatus(expenseId, newStatus);
      
      // Refresh the expenses list to get the latest data
      await fetchAllExpenses();
      
      setSuccess(`Expense ${newStatus} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating expense status:', error);
      setError(error.response?.data?.error || 'Failed to update expense');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Expenses</h1>
        <p className="text-gray-600 mt-2">Review and manage team expenses</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      <ExpenseList
        expenses={expenses}
        loading={loading}
        onStatusUpdate={handleStatusUpdate}
        canUpdateStatus={true}
      />
    </div>
  );
};

export default AdminExpenses;