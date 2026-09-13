const mongoose = require('mongoose');

const FacebookPageSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    pageId: {
      type: String,
      required: true,
    },
    pageName: {
      type: String,
      required: true,
    },
    pageToken: {
      type: String,
    },
    pageImageUrl: {
      type: String,
    },
    fansCount: {
      type: Number,
      default: 0,
    },
    about: {
      type: String,
    },
    website: {
      type: String,
    },
    categoryNames: [
      {
        type: String,
      },
    ],
    isInstagramConnected: {
      type: Boolean,
      default: false,
    },
    instagramAccountId: {
      type: String,
    },
    tokenStatus: {
      type: String,
      enum: ['valid', 'invalid', 'expiring'],
      default: 'valid',
    },
    lastSync: {
      type: Date,
    },
    syncEnabled: {
      type: Boolean,
      default: true,
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
    metrics: {
      followers: { type: Number, default: 0 },
      posts: { type: Number, default: 0 },
      engagement: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FacebookPage', FacebookPageSchema);