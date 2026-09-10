const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate('organization');

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  await AuditLog.create({
    organization: user.organization,
    user: req.user.id,
    action: 'create_user',
    resource: 'User',
    resourceId: user._id,
    details: { userId: user._id, username: user.username },
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(201).json({
    success: true,
    user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  const oldData = user.toObject();
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await AuditLog.create({
    organization: user.organization,
    user: req.user.id,
    action: 'update_user',
    resource: 'User',
    resourceId: user._id,
    details: { userId: user._id, changes: { from: oldData, to: req.body } },
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  user.isActive = false;
  await user.save();

  await AuditLog.create({
    organization: user.organization,
    user: req.user.id,
    action: 'delete_user',
    resource: 'User',
    resourceId: user._id,
    details: { userId: user._id, username: user.username },
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});