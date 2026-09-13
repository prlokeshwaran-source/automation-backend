const mongoose = require('mongoose');

const DocumentVerificationSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    documentType: {
      type: String,
      enum: ['identity', 'business_license', 'tax_document', 'other'],
      required: true,
    },
    documentNumber: {
      type: String,
    },
    documentImages: [
      {
        url: { type: String, required: true },
        publicId: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'review', 'approved', 'rejected'],
      default: 'pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verificationNotes: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DocumentVerification', DocumentVerificationSchema);