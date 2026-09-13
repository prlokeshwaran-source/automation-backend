const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Lead = require('../models/Lead');
const Campaign = require('../models/Campaign');
const FacebookPage = require('../models/FacebookPage');
const Organization = require('../models/Organization');
const User = require('../models/User');

exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const organizationId = req.params.orgId;

  const totalUsers = await User.countDocuments({
    organization: organizationId,
  });

  const activeUsers = await User.countDocuments({
    organization: organizationId,
    isActive: true,
  });

  const totalOrgs = await Organization.countDocuments();

  const facebookPages = await FacebookPage.countDocuments({
    organization: organizationId,
  });

  const activeCampaigns = await Campaign.countDocuments({
    organization: organizationId,
    status: 'active',
  });

  const totalLeads = await Lead.countDocuments({
    organization: organizationId,
  });

  const campaigns = await Campaign.find({
    organization: organizationId,
  }).select('metrics');

  let totalEngagement = 0;
  campaigns.forEach((campaign) => {
    totalEngagement +=
      (campaign.metrics?.impressions || 0) +
      (campaign.metrics?.clicks || 0) +
      (campaign.metrics?.engagement || 0) +
      (campaign.metrics?.reach || 0);
  });

  const recentActivities = await Campaign.find({
    organization: organizationId,
  })
    .sort('-createdAt')
    .limit(10)
    .select('name status createdAt');

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      activeUsers,
      totalOrgs,
      facebookPages,
      activeCampaigns,
      totalLeads,
      totalEngagement,
    },
    recentActivities,
  });
});

exports.getCampaignAnalytics = asyncHandler(async (req, res, next) => {
  const { campaignId } = req.params;

  const campaign = await Campaign.findById(campaignId);

  if (!campaign) {
    return next(
      new ErrorResponse(`Campaign not found with id of ${campaignId}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    analytics: campaign.metrics,
  });
});

exports.getLeadAnalytics = asyncHandler(async (req, res, next) => {
  const organizationId = req.params.orgId;

  const leadStats = await Lead.aggregate([
    { $match: { organization: { $toObjectId: organizationId } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const leadSources = await Lead.aggregate([
    { $match: { organization: { $toObjectId: organizationId } } },
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    leadStats,
    leadSources,
  });
});

exports.getOperationalSignals = asyncHandler(async (req, res, next) => {
  const organizationId = req.params.orgId;

  const totalCampaigns = await Campaign.countDocuments({
    organization: organizationId,
  });

  const activeCampaigns = await Campaign.countDocuments({
    organization: organizationId,
    status: 'active',
  });

  const campaignHealth =
    totalCampaigns > 0
      ? Math.round((activeCampaigns / totalCampaigns) * 100)
      : 0;

  const convertedLeads = await Lead.countDocuments({
    organization: organizationId,
    status: 'converted',
  });

  const totalLeads = await Lead.countDocuments({
    organization: organizationId,
  });

  const leadCaptureRate =
    totalLeads > 0
      ? Math.round((convertedLeads / totalLeads) * 100)
      : 0;

  const DocumentVerification = require('../models/DocumentVerification');
  const pendingDocs = await DocumentVerification.countDocuments({
    organization: organizationId,
    status: 'pending',
  });

  res.status(200).json({
    success: true,
    signals: {
      campaignHealth,
      leadCapture: leadCaptureRate,
      verificationQueue: pendingDocs,
    },
  });
});

exports.exportData = asyncHandler(async (req, res, next) => {
  const { orgId } = req.params;
  const type = req.query.type;

  let data;

  switch (type) {
    case 'leads':
      data = await Lead.find({ organization: orgId });
      break;
    case 'campaigns':
      data = await Campaign.find({ organization: orgId });
      break;
    case 'users':
      data = await User.find({ organization: orgId });
      break;
    default:
      data = { leads: 0, campaigns: 0, users: 0 };
  }

  res.status(200).json({
    success: true,
    data,
  });
});