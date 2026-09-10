const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Lead = require('../models/Lead');
const Campaign = require('../models/Campaign');
const FacebookPage = require('../models/FacebookPage');
const Organization = require('../models/Organization');

exports.getLeads = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id)
    .populate('organization')
    .populate('campaign')
    .populate('page')
    .populate('assignedTo')
    .populate('notes.createdBy');

  if (!lead) {
    return next(
      new ErrorResponse(`Lead not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    lead,
  });
});

exports.createLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.create(req.body);

  if (req.body.organization) {
    await Organization.findByIdAndUpdate(req.body.organization, {
      $inc: { leadsCount: 1 },
    });
  }

  res.status(201).json({
    success: true,
    lead,
  });
});

exports.updateLead = asyncHandler(async (req, res, next) => {
  let lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(
      new ErrorResponse(`Lead not found with id of ${req.params.id}`, 404)
    );
  }

  lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    lead,
  });
});

exports.deleteLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(
      new ErrorResponse(`Lead not found with id of ${req.params.id}`, 404)
    );
  }

  lead.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.assignLead = asyncHandler(async (req, res, next) => {
  const { assignedTo } = req.body;

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { assignedTo },
    { new: true }
  );

  if (!lead) {
    return next(
      new ErrorResponse(`Lead not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    lead,
  });
});

exports.addNote = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(
      new ErrorResponse(`Lead not found with id of ${req.params.id}`, 404)
    );
  }

  lead.notes.push({
    text: req.body.text,
    createdBy: req.user.id,
  });

  await lead.save();

  res.status(200).json({
    success: true,
    lead,
  });
});

exports.getLeadStats = asyncHandler(async (req, res, next) => {
  const organizationId = req.params.orgId;

  const stats = await Lead.aggregate([
    { $match: { organization: { $toObjectId: organizationId } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const total = await Lead.countDocuments({ organization: organizationId });

  res.status(200).json({
    success: true,
    stats: {
      total,
      byStatus: stats,
    },
  });
});