const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Campaign = require('../models/Campaign');
const Organization = require('../models/Organization');
const AuditLog = require('../models/AuditLog');

exports.getCampaigns = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate('organization')
    .populate('pages')
    .populate('createdBy')
    .populate('approvedBy');

  if (!campaign) {
    return next(
      new ErrorResponse(`Campaign not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    campaign,
  });
});

exports.createCampaign = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;
  const campaign = await Campaign.create(req.body);

  await Organization.findByIdAndUpdate(req.body.organization, {
    $inc: { campaignsCount: 1 },
  });

  await AuditLog.create({
    organization: req.body.organization,
    user: req.user.id,
    action: 'create_campaign',
    resource: 'Campaign',
    resourceId: campaign._id,
    details: { campaignId: campaign._id, name: campaign.name },
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(201).json({
    success: true,
    campaign,
  });
});

exports.updateCampaign = asyncHandler(async (req, res, next) => {
  let campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return next(
      new ErrorResponse(`Campaign not found with id of ${req.params.id}`, 404)
    );
  }

  const oldData = campaign.toObject();
  campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await AuditLog.create({
    organization: campaign.organization,
    user: req.user.id,
    action: 'update_campaign',
    resource: 'Campaign',
    resourceId: campaign._id,
    details: { campaignId: campaign._id, changes: { from: oldData, to: req.body } },
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(200).json({
    success: true,
    campaign,
  });
});

exports.deleteCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return next(
      new ErrorResponse(`Campaign not found with id of ${req.params.id}`, 404)
    );
  }

  campaign.deleteOne();

  await AuditLog.create({
    organization: campaign.organization,
    user: req.user.id,
    action: 'delete_campaign',
    resource: 'Campaign',
    resourceId: campaign._id,
    details: { campaignId: campaign._id, name: campaign.name },
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.approveCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return next(
      new ErrorResponse(`Campaign not found with id of ${req.params.id}`, 404)
    );
  }

  campaign.approvalStatus = 'approved';
  campaign.approvedBy = req.user.id;
  await campaign.save();

  res.status(200).json({
    success: true,
    campaign,
  });
});

exports.pauseCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return next(
      new ErrorResponse(`Campaign not found with id of ${req.params.id}`, 404)
    );
  }

  campaign.status = 'paused';
  await campaign.save();

  await AuditLog.create({
    organization: campaign.organization,
    user: req.user.id,
    action: 'pause_campaign',
    resource: 'Campaign',
    resourceId: campaign._id,
    details: { campaignId: campaign._id, name: campaign.name },
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(200).json({
    success: true,
    campaign,
  });
});

exports.resumeCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return next(
      new ErrorResponse(`Campaign not found with id of ${req.params.id}`, 404)
    );
  }

  campaign.status = 'active';
  await campaign.save();

  await AuditLog.create({
    organization: campaign.organization,
    user: req.user.id,
    action: 'resume_campaign',
    resource: 'Campaign',
    resourceId: campaign._id,
    details: { campaignId: campaign._id, name: campaign.name },
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(200).json({
    success: true,
    campaign,
  });
});