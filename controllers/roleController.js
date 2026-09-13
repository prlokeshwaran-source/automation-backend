const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Role = require('../models/Role');

exports.getRoles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    return next(
      new ErrorResponse(`Role not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    role,
  });
});

exports.createRole = asyncHandler(async (req, res, next) => {
  const role = await Role.create(req.body);

  res.status(201).json({
    success: true,
    role,
  });
});

exports.updateRole = asyncHandler(async (req, res, next) => {
  let role = await Role.findById(req.params.id);

  if (!role) {
    return next(
      new ErrorResponse(`Role not found with id of ${req.params.id}`, 404)
    );
  }

  role = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    role,
  });
});

exports.deleteRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    return next(
      new ErrorResponse(`Role not found with id of ${req.params.id}`, 404)
    );
  }

  if (role.isSystem) {
    return next(new ErrorResponse('Cannot delete system role', 400));
  }

  role.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});