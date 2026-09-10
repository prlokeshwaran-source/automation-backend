const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const AuditLog = require('../models/AuditLog');

exports.getAuditLogs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getAuditLog = asyncHandler(async (req, res, next) => {
  const log = await AuditLog.findById(req.params.id)
    .populate('organization')
    .populate('user');

  if (!log) {
    return next(
      new ErrorResponse(`Audit log not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    log,
  });
});

exports.createAuditLog = asyncHandler(async (req, res, next) => {
  const log = await AuditLog.create(req.body);

  res.status(201).json({
    success: true,
    log,
  });
});

exports.getUserActivity = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  const activities = await AuditLog.find({ user: userId })
    .sort('-createdAt')
    .limit(50)
    .select('action resource createdAt details ip status')
    .populate('resource');

  res.status(200).json({
    success: true,
    count: activities.length,
    activities,
  });
});