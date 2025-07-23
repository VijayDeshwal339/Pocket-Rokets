import { useState, useEffect } from 'react';
import { auditService } from '../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const response = await auditService.getAuditLogs();
      setLogs(response.logs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'expense_created':
        return '➕';
      case 'status_changed':
        return '🔄';
      case 'expense_updated':
        return '✏️';
      case 'expense_deleted':
        return '🗑️';
      default:
        return '📝';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'expense_created':
        return 'bg-green-100 text-green-800';
      case 'status_changed':
        return 'bg-blue-100 text-blue-800';
      case 'expense_updated':
        return 'bg-yellow-100 text-yellow-800';
      case 'expense_deleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading audit logs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600 mt-2">Track all system activities and changes</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Activities
          </h2>
          
          {logs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No audit logs found</p>
          ) : (
            <div className="space-y-4">
              {logs.map(log => (
                <div
                  key={log._id}
                  className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="mr-4 mt-1">
                    <span className="text-2xl">{getActionIcon(log.action)}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}
                        >
                          {log.action.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-700">
                      <strong>{log.userId?.name}</strong> ({log.userId?.email})
                    </div>
                    
                    {log.details && (
                      <div className="text-sm text-gray-600 mt-2">
                        {log.action === 'expense_created' && log.details && (
                          <div>
                            Created expense: ${log.details.amount} for {log.details.category}
                            {log.details.date && ` on ${new Date(log.details.date).toLocaleDateString()}`}
                          </div>
                        )}
                        
                        {log.action === 'status_changed' && log.details && (
                          <div>
                            Changed status from <strong>{log.details.oldStatus}</strong> to{' '}
                            <strong>{log.details.newStatus}</strong>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;