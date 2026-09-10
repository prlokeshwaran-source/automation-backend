const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const SystemSettings = require('../models/SystemSettings');

exports.getSettings = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getSettingByKey = asyncHandler(async (req, res, next) => {
  const setting = await SystemSettings.findOne({ key: req.params.key });

  if (!setting) {
    return next(
      new ErrorResponse(`Setting not found with key of ${req.params.key}`, 404)
    );
  }

  if (setting.isSensitive) {
    setting.value = '***';
  }

  res.status(200).json({
    success: true,
    setting,
  });
});

exports.createSetting = asyncHandler(async (req, res, next) => {
  const setting = await SystemSettings.create(req.body);

  if (setting.isSensitive) {
    setting.value = '***';
  }

  res.status(201).json({
    success: true,
    setting,
  });
});

exports.updateSetting = asyncHandler(async (req, res, next) => {
  let setting = await SystemSettings.findOne({ key: req.params.key });

  if (!setting) {
    return next(
      new ErrorResponse(`Setting not found with key of ${req.params.key}`, 404)
    );
  }

  setting = await SystemSettings.findOneAndUpdate(
    { key: req.params.key },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (setting.isSensitive) {
    setting.value = '***';
  }

  res.status(200).json({
    success: true,
    setting,
  });
});