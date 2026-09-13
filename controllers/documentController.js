const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const DocumentVerification = require('../models/DocumentVerification');

exports.getDocumentVerifications = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getDocumentVerification = asyncHandler(async (req, res, next) => {
  const doc = await DocumentVerification.findById(req.params.id)
    .populate('organization')
    .populate('user')
    .populate('verifiedBy');

  if (!doc) {
    return next(
      new ErrorResponse(`Document not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    document: doc,
  });
});

exports.createDocumentVerification = asyncHandler(async (req, res, next) => {
  const doc = await DocumentVerification.create(req.body);

  res.status(201).json({
    success: true,
    document: doc,
  });
});

exports.updateDocumentVerification = asyncHandler(async (req, res, next) => {
  let doc = await DocumentVerification.findById(req.params.id);

  if (!doc) {
    return next(
      new ErrorResponse(`Document not found with id of ${req.params.id}`, 404)
    );
  }

  doc = await DocumentVerification.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    document: doc,
  });
});

exports.approveDocument = asyncHandler(async (req, res, next) => {
  const doc = await DocumentVerification.findById(req.params.id);

  if (!doc) {
    return next(
      new ErrorResponse(`Document not found with id of ${req.params.id}`, 404)
    );
  }

  doc.status = 'approved';
  doc.verifiedBy = req.user.id;
  doc.verifiedAt = Date.now();
  await doc.save();

  res.status(200).json({
    success: true,
    document: doc,
  });
});

exports.rejectDocument = asyncHandler(async (req, res, next) => {
  const doc = await DocumentVerification.findById(req.params.id);

  if (!doc) {
    return next(
      new ErrorResponse(`Document not found with id of ${req.params.id}`, 404)
    );
  }

  doc.status = 'rejected';
  doc.verifiedBy = req.user.id;
  doc.verifiedAt = Date.now();
  doc.verificationNotes = req.body.verificationNotes || '';
  await doc.save();

  res.status(200).json({
    success: true,
    document: doc,
  });
});