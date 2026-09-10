const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'login',
        'logout',
        'create_user',
        'update_user',
        'delete_user',
        'create_organization',
        'update_organization',
        'delete_organization',
        'create_campaign',
        'update_campaign',
        'pause_campaign',
        'resume_campaign',
        'delete_campaign',
        'create_lead',
        'update_lead',
        'assign_lead',
        'delete_lead',
        'document_submit',
        'document_approve',
        'document_reject',
        'settings_update',
        'social_connect',
        'social_disconnect',
        'role_create',
        'role_update',
        'role_delete',
      ],
    },
    resource: {
      type: String,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'warning'],
      default: 'success',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
AuditLogSchema.index({ organization: 1, createdAt: -1 });
AuditLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);