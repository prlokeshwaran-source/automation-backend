const express = require('express');
const {
  getAuditLogs,
  getAuditLog,
  createAuditLog,
  getUserActivity,
} = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const AuditLog = require('../models/AuditLog');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(
    authorize('admin', 'super_admin'),
    advancedResults(AuditLog, ['organization', 'user']),
    getAuditLogs
  )
  .post(authorize('super_admin'), createAuditLog);

router.route('/user/:userId').get(authorize('admin', 'super_admin'), getUserActivity);
router.route('/:id').get(authorize('admin', 'super_admin'), getAuditLog);

module.exports = router;