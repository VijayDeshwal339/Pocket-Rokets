import { useState } from 'react';
import { useEffect } from 'react';
import ExpenseCard from './ExpenseCard';
import ExpenseFilters from './ExpenseFilters';

const ExpenseList = ({ 
  expenses, 
  onStatusUpdate, 
  canUpdateStatus = false,
  loading = false
}) => {
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);

  useEffect(() => {
    setFilteredExpenses(expenses);
  }, [expenses]);

  const handleFilter = (filters) => {
    let filtered = [...expenses];
    
    if (filters.status) {
      filtered = filtered.filter(expense => expense.status === filters.status);
    }
    
    if (filters.category) {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(expense => 
        new Date(expense.date) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(expense => 
        new Date(expense.date) <= new Date(filters.endDate)
      );
    }

    setFilteredExpenses(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ExpenseFilters onFilter={handleFilter} />
      
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No expenses found</div>
          <p className="text-gray-400 mt-2">Try adjusting your filters or add a new expense</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExpenses.map(expense => (
            <ExpenseCard
              key={expense._id}
              expense={expense}
              onStatusUpdate={onStatusUpdate}
              canUpdateStatus={canUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;