const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Organization = require('../models/Organization');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

exports.getAvailableAdmins = asyncHandler(async (req, res, next) => {
  const admins = await User.find({
    role: { $in: ['super_admin', 'admin', 'organization_admin'] },
    isActive: true,
  })
    .select('firstName lastName email username organization role')
    .populate('organization', 'name');

  res.status(200).json({
    success: true,
    count: admins.length,
    admins,
  });
});

exports.getOrganizations = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getOrganization = asyncHandler(async (req, res, next) => {
  const org = await Organization.findById(req.params.id).populate('admin');

  if (!org) {
    return next(
      new ErrorResponse(`Organization not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    organization: org,
  });
});

exports.createOrganization = asyncHandler(async (req, res, next) => {
  const org = await Organization.create(req.body);

  await AuditLog.create({
    organization: org._id,
    user: req.user.id,
    action: 'create_organization',
    resource: 'Organization',
    resourceId: org._id,
    details: { orgId: org._id, name: org.name },
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(201).json({
    success: true,
    organization: org,
  });
});

exports.updateOrganization = asyncHandler(async (req, res, next) => {
  let org = await Organization.findById(req.params.id);

  if (!org) {
    return next(
      new ErrorResponse(`Organization not found with id of ${req.params.id}`, 404)
    );
  }

  const oldData = org.toObject();
  org = await Organization.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await AuditLog.create({
    organization: org._id,
    user: req.user.id,
    action: 'update_organization',
    resource: 'Organization',
    resourceId: org._id,
    details: { orgId: org._id, changes: { from: oldData, to: req.body } },
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(200).json({
    success: true,
    organization: org,
  });
});

exports.deleteOrganization = asyncHandler(async (req, res, next) => {
  const org = await Organization.findById(req.params.id);

  if (!org) {
    return next(
      new ErrorResponse(`Organization not found with id of ${req.params.id}`, 404)
    );
  }

  org.status = 'suspended';
  await org.save();

  await AuditLog.create({
    organization: org._id,
    user: req.user.id,
    action: 'delete_organization',
    resource: 'Organization',
    resourceId: org._id,
    details: { orgId: org._id, name: org.name },
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});