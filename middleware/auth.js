
const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Get token from cookie
  else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // No token
  if (!token) {
    return next(
      new ErrorResponse('Not authorized to access this route', 401)
    );
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);

    // User doesn't exist
    if (!user) {
      return next(
        new ErrorResponse('User no longer exists', 401)
      );
    }

    // Attach user to request
    req.user = user;

    next();

  } catch (err) {

    // JWT expired
    if (err.name === 'TokenExpiredError') {
      return next(
        new ErrorResponse('Token expired. Please login again.', 401)
      );
    }

    // Invalid JWT
    return next(
      new ErrorResponse('Invalid token. Please login again.', 401)
    );
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {

    // Safety check
    if (!req.user) {
      return next(
        new ErrorResponse('Not authorized', 401)
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};
