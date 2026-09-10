const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const FacebookConfig = require('../models/FacebookConfig');
const FacebookPage = require('../models/FacebookPage');
const Organization = require('../models/Organization');

exports.getFacebookConfigs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getFacebookConfig = asyncHandler(async (req, res, next) => {
  const config = await FacebookConfig.findById(req.params.id).populate('organization');

  if (!config) {
    return next(
      new ErrorResponse(`Facebook config not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    config: {
      ...config._doc,
      appSecret: undefined,
      accessToken: undefined,
    },
  });
});

exports.createFacebookConfig = asyncHandler(async (req, res, next) => {
  const config = await FacebookConfig.create(req.body);

  res.status(201).json({
    success: true,
    config: {
      ...config._doc,
      appSecret: undefined,
      accessToken: undefined,
    },
  });
});

exports.updateFacebookConfig = asyncHandler(async (req, res, next) => {
  let config = await FacebookConfig.findById(req.params.id);

  if (!config) {
    return next(
      new ErrorResponse(`Facebook config not found with id of ${req.params.id}`, 404)
    );
  }

  config = await FacebookConfig.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    config,
  });
});

exports.deleteFacebookConfig = asyncHandler(async (req, res, next) => {
  const config = await FacebookConfig.findById(req.params.id);

  if (!config) {
    return next(
      new ErrorResponse(`Facebook config not found with id of ${req.params.id}`, 404)
    );
  }

  config.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.getFacebookPages = asyncHandler(async (req, res, next) => {
  const pages = await FacebookPage.find({ organization: req.params.orgId })
    .select('-pageToken');

  res.status(200).json({
    success: true,
    count: pages.length,
    pages,
  });
});

exports.savePageToken = asyncHandler(async (req, res, next) => {
  const { pageId, pageName, pageToken, organization } = req.body;

  let page = await FacebookPage.findOne({ pageId });

  if (page) {
    page.pageToken = pageToken;
    page.pageName = pageName;
    page.organization = organization;
    page.lastSync = Date.now();
    await page.save();
  } else {
    page = await FacebookPage.create({
      pageId,
      pageName,
      pageToken,
      organization,
      lastSync: Date.now(),
    });
  }

  res.status(200).json({
    success: true,
    page: { ...page._doc, pageToken: undefined },
  });
});