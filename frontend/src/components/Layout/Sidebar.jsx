import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: '📊',
      roles: ['employee', 'admin']
    },
    {
      name: 'My Expenses',
      path: '/expenses',
      icon: '💰',
      roles: ['employee', 'admin']
    },
    {
      name: 'All Expenses',
      path: '/admin/expenses',
      icon: '📋',
      roles: ['admin']
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: '📈',
      roles: ['admin']
    },
    {
      name: 'Audit Logs',
      path: '/admin/audit',
      icon: '🔍',
      roles: ['admin']
    }
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Expense Tracker</h2>
        <p className="text-sm text-gray-600 mt-1">
          {user?.name} ({user?.role})
        </p>
      </div>
      
      <nav className="mt-6">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : ''
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;