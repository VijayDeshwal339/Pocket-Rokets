import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['USER_REGISTER', 'USER_LOGIN', 'EXPENSE_CREATED', 'EXPENSE_STATUS_CHANGED', 'EXPENSE_UPDATED', 'EXPENSE_DELETED']
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

auditLogSchema.statics.log = async function(action, userId, details = {}) {
  return await this.create({
    action,
    userId,
    details,
    timestamp: new Date()
  });
};

export default mongoose.model('AuditLog', auditLogSchema);