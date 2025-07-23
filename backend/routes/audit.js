import express from 'express';
import AuditLog from '../models/AuditLog.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get audit logs (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, action, userId } = req.query;
    
    let query = {};
    if (action) query.action = action;
    if (userId) query.userId = userId;

    const skip = (page - 1) * limit;
    
    const logs = await AuditLog.find(query)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    res.json({
      logs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;