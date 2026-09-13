const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add organization name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Please add organization slug'],
      unique: true,
      lowercase: true,
    },
    domain: {
      type: String,
      unique: true,
      sparse: true,
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    type: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'pending'],
      default: 'pending',
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    usersCount: {
      type: Number,
      default: 0,
    },
    leadsCount: {
      type: Number,
      default: 0,
    },
    campaignsCount: {
      type: Number,
      default: 0,
    },
    socialPagesCount: {
      type: Number,
      default: 0,
    },
    settings: {
      timezone: {
        type: String,
        default: 'UTC',
      },
      language: {
        type: String,
        default: 'en',
      },
      currency: {
        type: String,
        default: 'USD',
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      branding: {
        primaryColor: { type: String, default: '#3b82f6' },
        secondaryColor: { type: String, default: '#647494' },
      },
    },
    features: {
      socialMedia: { type: Boolean, default: true },
      automation: { type: Boolean, default: false },
      analytics: { type: Boolean, default: true },
      twoFactorAuth: { type: Boolean, default: false },
      customDomains: { type: Boolean, default: false },
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'premium', 'enterprise'],
        default: 'free',
      },
      billingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly',
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      nextBillingDate: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Organization', OrganizationSchema);