import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { expenseService } from '../services/api';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalExpenses: 0,
    pendingExpenses: 0,
    approvedExpenses: 0,
    rejectedExpenses: 0
  });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up interval to refresh dashboard data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await expenseService.getExpenses({ limit: 5 });
      const expenses = response.expenses;
      
      setRecentExpenses(expenses);
      
      // Calculate stats
      const totalExpenses = expenses.length;
      const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
      const approvedExpenses = expenses.filter(e => e.status === 'approved').length;
      const rejectedExpenses = expenses.filter(e => e.status === 'rejected').length;
      
      setStats({
        totalExpenses,
        pendingExpenses,
        approvedExpenses,
        rejectedExpenses
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color} mr-4`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your {isAdmin ? 'team' : ''} expenses
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Expenses"
          value={stats.totalExpenses}
          color="bg-blue-100"
          icon="💰"
        />
        <StatCard
          title="Pending"
          value={stats.pendingExpenses}
          color="bg-yellow-100"
          icon="⏳"
        />
        <StatCard
          title="Approved"
          value={stats.approvedExpenses}
          color="bg-green-100"
          icon="✅"
        />
        <StatCard
          title="Rejected"
          value={stats.rejectedExpenses}
          color="bg-red-100"
          icon="❌"
        />
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Expenses
        </h2>
        
        {recentExpenses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No recent expenses found
          </p>
        ) : (
          <div className="space-y-4">
            {recentExpenses.map(expense => (
              <div
                key={expense._id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    ${expense.amount.toFixed(2)} - {expense.category}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(expense.date).toLocaleDateString()}
                    {expense.userId?.name && ` • ${expense.userId.name}`}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    expense.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : expense.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {expense.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/expenses"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span className="text-2xl mr-3">💰</span>
            <div>
              <div className="font-medium text-blue-900">View My Expenses</div>
              <div className="text-sm text-blue-600">Manage your expenses</div>
            </div>
          </a>
          
          {isAdmin && (
            <>
              <a
                href="/admin/expenses"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <span className="text-2xl mr-3">📋</span>
                <div>
                  <div className="font-medium text-green-900">Review Expenses</div>
                  <div className="text-sm text-green-600">Approve or reject</div>
                </div>
              </a>
              
              <a
                href="/admin/analytics"
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <span className="text-2xl mr-3">📈</span>
                <div>
                  <div className="font-medium text-purple-900">View Analytics</div>
                  <div className="text-sm text-purple-600">Expense insights</div>
                </div>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;