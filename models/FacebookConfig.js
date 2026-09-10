const mongoose = require('mongoose');

const FacebookConfigSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    appName: {
      type: String,
      required: true,
    },
    appId: {
      type: String,
    },
    appSecret: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['connected', 'disconnected', 'error'],
      default: 'disconnected',
    },
    errorDetails: {
      type: String,
    },
    lastSync: {
      type: Date,
    },
    syncFrequency: {
      type: Number,
      default: 30,
    },
    webhookEnabled: {
      type: Boolean,
      default: false,
    },
    autoSync: {
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

module.exports = mongoose.model('FacebookConfig', FacebookConfigSchema);