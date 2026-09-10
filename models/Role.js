const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add role name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    permissions: [
      {
        type: String,
        enum: [
          'manage_users',
          'manage_organizations',
          'manage_campaigns',
          'manage_leads',
          'manage_documents',
          'manage_settings',
          'view_analytics',
          'manage_audit',
          'manage_notifications',
          'manage_facebook',
          'manage_roles',
          'export_data',
        ],
      },
    ],
    isSystem: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Role', RoleSchema);