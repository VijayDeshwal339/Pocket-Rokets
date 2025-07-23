import express from 'express';
import Expense from '../models/Expense.js';
import AuditLog from '../models/AuditLog.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { amount, category, date, notes } = req.body;
    
    const expense = new Expense({
      userId: req.user._id,
      amount,
      category,
      date,
      notes
    });

    await expense.save();

    // Create audit log
    await AuditLog.log('EXPENSE_CREATED', req.user._id, { 
      expenseId: expense._id, 
      amount, 
      category,
      date
    });

    const populatedExpense = await Expense.findById(expense._id).populate('userId', 'name email');
    res.status(201).json(populatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get expenses (employees see only their own, admins see all)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, category, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // If not admin, only show user's own expenses
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    // Add filters
    if (status) query.status = status;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    
    const expenses = await Expense.find(query)
      .populate('userId', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Expense.countDocuments(query);

    res.json({
      expenses,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update expense status (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const oldStatus = expense.status;
    expense.status = status;
    expense.approvedBy = req.user._id;
    await expense.save();

    // Create audit log
    await AuditLog.log('EXPENSE_STATUS_CHANGED', req.user._id, { 
      expenseId: expense._id, 
      oldStatus, 
      newStatus: status 
    });

    const updatedExpense = await Expense.findById(expense._id)
      .populate('userId', 'name email')
      .populate('approvedBy', 'name email');

    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get expense analytics (admin only)
router.get('/analytics/category', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const categoryStats = await Expense.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    res.json(categoryStats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get trends analytics (admin only)
router.get('/analytics/trends', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const trendStats = await Expense.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json(trendStats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;