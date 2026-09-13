const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add campaign name'],
      trim: true,
    },
    description: {
      type: String,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'completed', 'archived'],
      default: 'draft',
    },
    type: {
      type: String,
      enum: ['standard', 'automated', 'scheduled'],
      default: 'standard',
    },
    pages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FacebookPage',
      },
    ],
    content: {
      message: {
        type: String,
      },
      link: {
        type: String,
      },
      image: {
        type: String,
      },
      callToAction: {
        text: String,
        link: String,
      },
    },
    scheduling: {
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      postSchedule: [
        {
          day: {
            type: String,
            enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
          },
          time: String,
        },
      ],
    },
    metrics: {
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      engagement: { type: Number, default: 0 },
      reach: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      clicksThroughRate: { type: Number, default: 0 },
    },
    budget: {
      daily: { type: Number },
      total: { type: Number },
      spent: { type: Number, default: 0 },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Campaign', CampaignSchema);