import { useState, useEffect } from 'react';
import CategoryChart from '../components/Charts/CategoryChart';
import TrendChart from '../components/Charts/TrendChart';
import { expenseService } from '../services/api';

const Analytics = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
    
    // Set up interval to refresh analytics every 60 seconds
    const interval = setInterval(fetchAnalytics, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [categoryResponse, trendResponse] = await Promise.all([
        expenseService.getCategoryAnalytics(),
        expenseService.getTrendsAnalytics()
      ]);
      
      setCategoryData(categoryResponse);
      setTrendData(trendResponse);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const totalApproved = categoryData.reduce((sum, item) => sum + item.total, 0);
  const totalTransactions = categoryData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Expense insights and trends</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 mr-4">
              <span className="text-2xl">💵</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalApproved.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 mr-4">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Expense</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalTransactions > 0 ? (totalApproved / totalTransactions).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {categoryData.length > 0 ? (
          <CategoryChart data={categoryData} />
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <p className="text-center text-gray-500">No category data available</p>
          </div>
        )}

        {trendData.length > 0 ? (
          <TrendChart data={trendData} />
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <p className="text-center text-gray-500">No trend data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;