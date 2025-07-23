import { useState, useEffect } from 'react';
import ExpenseList from '../components/Expenses/ExpenseList';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import { expenseService } from '../services/api';

const MyExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await expenseService.getExpenses();
      setExpenses(response.expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (expenseData) => {
    setSubmitting(true);
    setError('');
    
    try {
      const newExpense = await expenseService.createExpense(expenseData);
      // Refresh the expenses list to get the latest data
      await fetchExpenses();
      setShowForm(false);
      setSuccess('Expense created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating expense:', error);
      setError(error.response?.data?.error || 'Failed to create expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Expenses</h1>
          <p className="text-gray-600 mt-2">Track and manage your expenses</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Expense
        </button>
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

      {showForm && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New Expense
          </h2>
          <ExpenseForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            loading={submitting}
          />
        </div>
      )}

      <ExpenseList
        expenses={expenses}
        loading={loading}
        canUpdateStatus={false}
      />
    </div>
  );
};

export default MyExpenses;