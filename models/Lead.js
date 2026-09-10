const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FacebookPage',
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
    },
    company: {
      type: String,
    },
    position: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    source: {
      type: String,
      enum: ['facebook', 'instagram', 'website', 'manual', 'import', 'referral'],
      default: 'website',
    },
    sourceId: {
      type: String,
    },
    sourceUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'converted', 'unqualified', 'blacklisted'],
      default: 'new',
    },
    leadScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    tags: [
      {
        type: String,
      },
    ],
    customFields: {
      type: mongoose.Schema.Types.Mixed,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastContacted: {
      type: Date,
    },
    nextFollowUp: {
      type: Date,
    },
    notes: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    activities: [
      {
        type: {
          type: String,
          enum: ['call', 'email', 'meeting', 'note'],
        },
        description: String,
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    isHot: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lead', LeadSchema);